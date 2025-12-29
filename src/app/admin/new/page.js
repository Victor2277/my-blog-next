'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export default function NewPostPage() {
    const router = useRouter();

    const handleSave = async (data) => {
        try {
            const { error } = await supabase
                .from('posts')
                .insert([
                    {
                        title: data.title,
                        category: data.category,
                        cover_image: data.coverImage,
                        content: data.content
                    }
                ]);

            if (error) throw error;

            alert('文章發布成功！');
            router.push('/admin');
            router.refresh();

        } catch (error) {
            console.error('Error creating post:', error);
            alert('發布失敗：' + error.message);
        }
    };

    return <PostEditor onSave={handleSave} />;
}
