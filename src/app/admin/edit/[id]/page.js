'use client';

import { useState, useEffect, use } from 'react'; // Use `use` to unwrap params in Client Component if needed, or just standard useEffect with async wrapper if handling params directly in Page props
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

// In Next.js 15, params is a Promise.
// Since this is a Client Component ('use client'), we can unwap it with `use` or treat it as async.
// However, standard intuitive way for Client Components is often to just use `useParams` hook from `next/navigation`.
import { useParams } from 'next/navigation';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPost(id);
        }
    }, [id]);

    const fetchPost = async (postId) => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) throw error;
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
            alert('無法載入文章');
            router.push('/admin');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (data) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    title: data.title,
                    category: data.category,
                    cover_image: data.coverImage,
                    content: data.content
                })
                .eq('id', parseInt(id, 10)); // Ensure ID is an integer

            if (error) throw error;

            alert('文章更新成功！');
            router.push('/admin');
            router.refresh();

        } catch (error) {
            console.error('Error updating post:', error);
            alert('更新失敗：' + error.message);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">載入文章中...</div>;
    if (!post) return null;

    return <PostEditor initialData={post} onSave={handleUpdate} isEditMode={true} />;
}
