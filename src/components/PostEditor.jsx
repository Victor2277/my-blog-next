'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const CustomToolbar = () => (
    <div id="toolbar">
        <span className="ql-formats">
            <select className="ql-header" defaultValue="" title="標題層級">
                <option value="1">標題 1</option>
                <option value="2">標題 2</option>
                <option value="" selected>內文</option>
            </select>
            <select className="ql-size" defaultValue="" title="字體大小">
                <option value="small">小</option>
                <option value="" selected>中</option>
                <option value="large">大</option>
                <option value="huge">特大</option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" title="粗體" />
            <button className="ql-italic" title="斜體" />
            <button className="ql-underline" title="底線" />
            <button className="ql-strike" title="刪除線" />
        </span>
        <span className="ql-formats">
            <select className="ql-color" title="文字顏色" />
            <select className="ql-background" title="背景顏色" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" title="編號清單" />
            <button className="ql-list" value="bullet" title="項目符號" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" title="插入連結" />
            <button className="ql-image" title="插入圖片" />
        </span>
        <span className="ql-formats">
            <button className="ql-clean" title="清除格式" />
        </span>
    </div>
);

const PostEditor = ({ initialData = {}, onSave, isEditMode = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '生活隨筆',
        coverImage: '',
        content: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                category: initialData.category || '生活隨筆',
                coverImage: initialData.cover_image || '',
                content: initialData.content || ''
            });
        }
    }, [initialData]);

    const categories = ['美味食記', '旅遊札記', '美妝生活', '生活隨筆', '技術分享'];

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            // In a real app, upload this to Supabase Storage here and get URL
            // For now, use Blob URL for preview
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                coverImage: imageUrl
            }));

            // Note: This blob URL is only valid in this session. 
            // The onSave handler should ideally handle the upload if it's a blob.
            // Or the user can paste an external URL.
        }
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    };

    const modules = {
        toolbar: {
            container: "#toolbar",
        }
    };

    const formats = [
        'header', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet',
        'link', 'image'
    ];

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Main Editor Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[700px]">

                {/* Meta Data Section (Top) */}
                <div className="p-8 border-b border-gray-100 space-y-6 bg-white">
                    {/* Title */}
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="請輸入文章標題..."
                        className="w-full text-4xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none focus:ring-0 bg-transparent"
                    />

                    {/* Secondary Inputs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/3">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">文章分類</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50 border"
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="w-full sm:w-2/3">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">封面圖片</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={(e) => handleChange('coverImage', e.target.value)}
                                    placeholder="輸入圖片網址 或 點擊上傳..."
                                    className="block w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 placeholder-gray-400"
                                />
                                <label className="flex-shrink-0 px-4 py-2 bg-gray-100 text-gray-600 rounded-md cursor-pointer hover:bg-gray-200 text-sm font-medium transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    上傳
                                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverImageUpload} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WYSIWYG Editor Section */}
                <div className="flex-1 flex flex-col relative">
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                        <CustomToolbar />
                    </div>
                    <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        className="flex-1 flex flex-col h-full border-none"
                        placeholder="開始輸入內容... 您可以拖放圖片或使用工具列"
                    />
                    <style jsx global>{`
                        .quill {
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            min-height: 500px;
                        }
                        .ql-toolbar {
                            border: none !important;
                            padding: 12px 24px !important;
                            background: #fff;
                        }
                        .ql-container {
                            border: none !important;
                            flex: 1;
                            overflow-y: auto;
                            font-family: var(--font-inter), sans-serif;
                            font-size: 1.1rem;
                        }
                        .ql-editor {
                            padding: 2rem 3rem;
                            min-height: 500px;
                        }
                        .ql-editor img {
                            max-width: 100%;
                            height: auto;
                            width: auto;
                            display: inline-block;
                        }
                        .ql-editor.ql-blank::before {
                            font-style: normal;
                            color: #9ca3af;
                            left: 3rem;
                        }
                    `}</style>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
                <button
                    onClick={handleSubmit}
                    className="px-8 py-3 text-base font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transform active:scale-95 transition-all"
                >
                    {isEditMode ? '更新文章' : '發布文章'}
                </button>
            </div>
        </div>
    );
};

export default PostEditor;
