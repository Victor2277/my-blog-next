'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除這篇文章嗎？此動作無法復原。')) {
            try {
                // Ensure ID is an integer and Select retrieved rows to verify deletion
                const { data, error } = await supabase
                    .from('posts')
                    .delete()
                    .eq('id', parseInt(id, 10))
                    .select();

                if (error) throw error;

                // If no data returned, it means no rows were deleted (likely RLS)
                if (!data || data.length === 0) {
                    throw new Error('Deletion failed (No rows affected). Check RLS policies.');
                }

                setPosts(posts.filter(post => post.id !== id));
                alert('文章已成功刪除');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert(`刪除失敗: ${error.message}`);
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">載入中...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 font-serif">文章管理</h1>
                <div className="flex gap-3">
                    <Link
                        href="/admin/import"
                        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        匯入文章
                    </Link>
                    <Link
                        href="/admin/new"
                        className="bg-brand-900 hover:bg-accent-500 text-white px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        新增文章
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    文章標題
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    分類
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    發布日期
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    管理操作
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        尚無文章資料
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-normal max-w-lg">
                                            <div className="text-sm font-bold text-gray-900 font-serif leading-tight">{post.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 text-indigo-700">
                                                {post.category || '未分類'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/admin/edit/${post.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 font-bold inline-block hover:underline">
                                                編輯
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-500 hover:text-red-700 font-bold inline-block hover:underline"
                                            >
                                                刪除
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
