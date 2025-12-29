import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const { data: post } = await supabase.from('posts').select('title, category').eq('id', id).single();

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | My Blog`,
        description: `Read more about ${post.category || 'this topic'}`,
    };
}

export default async function PostPage({ params }) {
    const { id } = await params;

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <Link
                href="/"
                className="inline-flex items-center text-gray-500 hover:text-accent-500 mb-8 transition-colors group font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回文章列表
            </Link>

            <header className="mb-12 text-center">
                {post.category && (
                    <div className="flex justify-center mb-6">
                        <span className="px-4 py-1.5 bg-indigo-50 text-brand-900 rounded-full text-sm font-bold tracking-wide uppercase">
                            {post.category}
                        </span>
                    </div>
                )}

                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-900 mb-6 leading-tight font-serif">
                    {post.title}
                </h1>

                <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/author.png"
                            alt="Author"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-50"
                        />
                        <span className="font-medium text-brand-900">{post.author_name || 'Admin'}</span>
                    </div>
                    <span>•</span>
                    <time>{formatDate(post.created_at)}</time>
                    {post.viewCount && (
                        <>
                            <span>•</span>
                            <span>{post.viewCount} 次閱讀</span>
                        </>
                    )}
                </div>
            </header>

            {post.cover_image && (
                <div className="rounded-3xl overflow-hidden shadow-xl mb-12 aspect-video relative ring-1 ring-gray-100/50">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="prose prose-lg prose-indigo max-w-none markdown-content bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-500 italic">感謝您的閱讀！</p>
            </div>
        </article>
    );
}
