import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

export const revalidate = 0; // Disable cache for demo / real-time updates

export default async function Home({ searchParams }) {
  // Parse page number, default to 1
  const sp = await searchParams; // Next.js 15: searchParams may be a promise
  const page = parseInt(sp?.page || '1', 10);
  const pageSize = 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch posts with pagination and count
  const { data: posts, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-red-500">
        Error loading posts.
      </div>
    );
  }

  const totalPages = Math.ceil((count || 0) / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <header className="mb-12 text-center pt-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-900 mb-6 leading-tight font-serif">
          My Blog
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-serif italic">
          Sharing thoughts on technology, life, and everything in between.
        </p>
      </header>

      {(!posts || posts.length === 0) ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-6xl mb-4">✍️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">這裡還沒有文章</h3>
          <p className="text-gray-500 mb-8">開始撰寫你的第一篇精彩內容吧！</p>
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-brand-900 hover:bg-accent-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            前往後台新增文章
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 py-8 flex-wrap">
            {hasPrevPage && (
              <Link
                href={`/?page=${page - 1}`}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                ← Prev
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
              .map((p, i, arr) => {
                const isGap = i > 0 && p !== arr[i - 1] + 1;
                return (
                  <div key={p} className="flex items-center">
                    {isGap && <span className="px-2 text-gray-400">...</span>}
                    <Link
                      href={`/?page=${p}`}
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors font-medium border ${p === page
                          ? 'bg-brand-900 text-white border-brand-900'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                        }`}
                    >
                      {p}
                    </Link>
                  </div>
                );
              })}

            {hasNextPage && (
              <Link
                href={`/?page=${page + 1}`}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Next →
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
