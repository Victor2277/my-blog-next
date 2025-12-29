'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import PostEditor from '@/components/PostEditor';

export default function ImportPage() {
    const router = useRouter();
    const [mode, setMode] = useState('single'); // 'single' or 'bulk'
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // Pagination State
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    const [scrapedData, setScrapedData] = useState(null);
    const [status, setStatus] = useState('');

    // Bulk State
    const [articles, setArticles] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState(new Set());
    const [importingIndex, setImportingIndex] = useState(-1);

    // Single Fetch
    const handleFetchSingle = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Fetching article...');
        setScrapedData(null);

        try {
            const res = await fetch('/api/pixnet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to import');
            }

            const data = await res.json();
            setScrapedData({
                title: data.title,
                category: '生活隨筆',
                cover_image: data.coverImage,
                content: data.content
            });
            setStatus('Fetched successfully!');
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Bulk Fetch List (Multi-page)
    const handleFetchList = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('Fetching article list...');
        setArticles([]);

        try {
            // Clean URL: remove existing query params
            const baseUrl = url.split('?')[0].replace(/\/$/, '');
            let allArticles = [];

            // Loop through pages
            const start = Math.max(1, startPage);
            const end = Math.max(start, endPage);

            for (let i = start; i <= end; i++) {
                setStatus(`Crawling Page ${i} of ${end}...`);

                // Construct URL. Pixnet uses ?page=N
                const targetUrl = i === 1 ? baseUrl : `${baseUrl}?page=${i}`;

                const res = await fetch('/api/pixnet/list', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: targetUrl })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.articles && data.articles.length > 0) {
                        // Avoid duplicates across pages just in case
                        const newArticles = data.articles.filter(
                            newItem => !allArticles.some(existing => existing.link === newItem.link)
                        );
                        allArticles = [...allArticles, ...newArticles];
                    }
                }

                // Be nice to server
                await new Promise(r => setTimeout(r, 500));
            }

            if (allArticles.length === 0) throw new Error('No articles found in range.');

            setArticles(allArticles);
            setStatus(`Found ${allArticles.length} unique articles from pages ${start}-${end}.`);
        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Single Save
    const handleSaveSingle = async (formData) => {
        try {
            const { error } = await supabase
                .from('posts')
                .insert([{
                    title: formData.title,
                    category: formData.category,
                    cover_image: formData.coverImage,
                    content: formData.content
                }]);

            if (error) throw error;
            alert('Imported successfully!');
            router.push('/admin');
        } catch (e) {
            alert('Save failed: ' + e.message);
        }
    };

    // Bulk Import Process
    const handleBulkImport = async () => {
        if (selectedArticles.size === 0) return;

        const toImport = articles.filter((_, i) => selectedArticles.has(i));
        setImportingIndex(0);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < toImport.length; i++) {
            const article = toImport[i];
            setStatus(`Importing ${i + 1}/${toImport.length}: ${article.title}...`);

            try {
                // 1. Fetch content
                const fetchRes = await fetch('/api/pixnet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: article.link })
                });

                if (!fetchRes.ok) throw new Error('Fetch failed');
                const data = await fetchRes.json();

                // 2. Insert to Supabase
                const { error } = await supabase.from('posts').insert([{
                    title: data.title,
                    category: '生活隨筆',
                    cover_image: data.coverImage,
                    content: data.content,
                    created_at: data.date
                }]);

                if (error) {
                    // Ignore dupes? or throw. 
                    // Supabase error: duplicate key value... usually returns 23505
                    throw error;
                }
                successCount++;

            } catch (e) {
                console.error(`Failed to import ${article.title}:`, e);
                // Allow "duplicate" error to pass as "fail" but maybe clarify
                failCount++;
            }

            await new Promise(r => setTimeout(r, 800));
        }

        setStatus(`Import Complete! Success: ${successCount}, Failed: ${failCount}`);
        setImportingIndex(-1);
    };

    const toggleSelection = (index) => {
        const newSet = new Set(selectedArticles);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setSelectedArticles(newSet);
    };

    const toggleAll = () => {
        if (selectedArticles.size === articles.length) {
            setSelectedArticles(new Set());
        } else {
            setSelectedArticles(new Set(articles.map((_, i) => i)));
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-serif">Import from Pixnet</h1>
                <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
                    <button
                        onClick={() => setMode('single')}
                        className={`px-4 py-2 rounded-md transition-all ${mode === 'single' ? 'bg-white shadow text-brand-900' : 'text-gray-500'}`}
                    >
                        Single Article
                    </button>
                    <button
                        onClick={() => setMode('bulk')}
                        className={`px-4 py-2 rounded-md transition-all ${mode === 'bulk' ? 'bg-white shadow text-brand-900' : 'text-gray-500'}`}
                    >
                        Bulk Import (Multi-Page)
                    </button>
                </div>
            </header>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 transition-all">
                <form onSubmit={mode === 'single' ? handleFetchSingle : handleFetchList} className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={mode === 'single' ? "Enter Article URL..." : "Enter Blog List URL (e.g. https://.../blog)..."}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-900 focus:outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || importingIndex >= 0}
                            className="bg-brand-900 text-white px-8 py-3 rounded-lg hover:bg-black disabled:opacity-50 transition-colors font-bold whitespace-nowrap"
                        >
                            {loading ? 'Fetching...' : (mode === 'single' ? 'Fetch Article' : 'Fetch List')}
                        </button>
                    </div>

                    {mode === 'bulk' && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-sm font-bold text-gray-700">Page Range:</span>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500">From Page</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={startPage}
                                    onChange={(e) => setStartPage(parseInt(e.target.value))}
                                    className="w-20 px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-900 outline-none"
                                />
                            </div>
                            <span className="text-gray-400">to</span>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500">To Page</label>
                                <input
                                    type="number"
                                    min={startPage}
                                    value={endPage}
                                    onChange={(e) => setEndPage(parseInt(e.target.value))}
                                    className="w-20 px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-brand-900 outline-none"
                                />
                            </div>
                        </div>
                    )}
                </form>
                {status && <p className="mt-4 text-sm font-mono text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 inline-block">{status}</p>}
            </div>

            {/* Single Mode: Editor Preview */}
            {mode === 'single' && scrapedData && (
                <div className="animate-fade-in-up">
                    <h2 className="text-xl font-bold mb-4">Review & Save</h2>
                    <PostEditor initialData={scrapedData} onSave={handleSaveSingle} />
                </div>
            )}

            {/* Bulk Mode: List Selection */}
            {mode === 'bulk' && articles.length > 0 && (
                <div className="animate-fade-in-up">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Found {articles.length} Articles</h2>
                        <div className="flex gap-3">
                            <div className="text-sm text-gray-500 pt-2 mr-4">
                                {selectedArticles.size} selected
                            </div>
                            <button onClick={toggleAll} className="text-gray-600 hover:text-brand-900 text-sm font-medium underline">
                                {selectedArticles.size === articles.length ? 'Deselect All' : 'Select All'}
                            </button>
                            <button
                                onClick={handleBulkImport}
                                disabled={selectedArticles.size === 0 || importingIndex >= 0}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm font-bold"
                            >
                                {importingIndex >= 0 ? `Importing...` : `Import Selected`}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                        Select
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title / Link
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {articles.map((article, index) => (
                                    <tr key={index} className={selectedArticles.has(index) ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedArticles.has(index)}
                                                onChange={() => toggleSelection(index)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{article.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 truncate max-w-lg">{article.link}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
