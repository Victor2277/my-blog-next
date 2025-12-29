import Link from 'next/link';

const PostCard = ({ post }) => {
    // Handle both Supabase (snake_case) and Mock Data (camelCase)
    const title = post.title;
    const summary = post.summary || post.content?.substring(0, 100).replace(/<[^>]+>/g, '') + '...';
    const category = post.category || '未分類';
    const coverImage = post.cover_image || post.coverImage;
    const date = post.created_at || post.date;
    const authorName = post.author?.name || 'Admin'; // Default to Admin for Supabase posts for now
    const authorAvatar = post.author?.avatar || '/images/author.png';
    const viewCount = post.viewCount || 0; // Supabase might require a separate view_count column

    return (
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col h-full">
            <Link href={`/posts/${post.id}`} className="block relative overflow-hidden h-48 sm:h-56">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📝</span>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-900 text-xs font-bold rounded-full shadow-sm tracking-wide uppercase">
                        {category}
                    </span>
                </div>
            </Link>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                    <time dateTime={date}>
                        {new Date(date).toLocaleDateString()}
                    </time>
                    <span>•</span>
                    <span>{viewCount} 次閱讀</span>
                </div>

                <Link href={`/posts/${post.id}`} className="block mb-3">
                    <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-accent-500 transition-colors line-clamp-2">
                        {title}
                    </h2>
                </Link>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 font-serif flex-1">
                    {summary}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <div className="flex items-center space-x-2">
                        <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-8 h-8 rounded-full ring-2 ring-gray-50"
                        />
                        <span className="text-sm font-medium text-gray-900">{authorName}</span>
                    </div>
                    <Link
                        href={`/posts/${post.id}`}
                        className="text-accent-500 text-sm font-semibold hover:text-accent-600 transition-colors group/link flex items-center"
                    >
                        閱讀更多
                        <span className="ml-1 transform group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
