'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Legacy Mock Data (Directly embedded for simplicity or could be imported if file moved)
const MOCK_POSTS = [
    {
        "id": "1",
        "title": "探索台南巷弄美食：在地人推薦的隱藏版小吃",
        "summary": "台南不只是古蹟之都，更是美食天堂...",
        "category": "美味食記",
        "coverImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000",
        "date": "2024-03-15T09:00:00Z",
        "viewCount": 1250,
        "content": "<p>台南美食...</p>"
    },
    // ... (We can import the full JSON if available, for now just a demo item or instruction)
];

// Ideally, we import the actual JSON from the old project if I moved it. 
// I'll create an import from the verified 'src/lib/posts.json' if I moved it? 
// Checking my previous steps: I did NOT move 'posts.json' to 'my-blog-next/src/lib'.
// I will create this page to allow *pasting* JSON or just "Insert Sample Data".
// Given complexity of reading cross-project file in client side, I'll just provide a button to insert sample.

export default function SeedPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleSeed = async () => {
        setLoading(true);
        setStatus('Seeding...');

        // Sample data mimicking the old blog
        const samplePosts = [
            {
                title: "探索台南巷弄美食：在地人推薦的隱藏版小吃",
                category: "美味食記",
                cover_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80",
                content: "<h2>台南美食之旅</h2><p>來到台南，絕對不能錯過...</p>",
                created_at: new Date().toISOString()
            },
            {
                title: "2024 日本賞櫻攻略：東京必去賞櫻景點總整理",
                category: "旅遊札記",
                cover_image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80",
                content: "<h2>櫻花季來了！</h2><p>東京最美的賞櫻地點...</p>",
                created_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
                title: "React 19 新功能搶先看：Compiler 與 Actions",
                category: "技術分享",
                cover_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80",
                content: "<p>React 19 帶來了重大變革...</p>",
                created_at: new Date(Date.now() - 172800000).toISOString()
            }
        ];

        try {
            const { error } = await supabase.from('posts').insert(samplePosts);
            if (error) throw error;
            setStatus('Success! Added 3 sample posts.');
        } catch (e) {
            setStatus('Error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
            <p className="mb-8 text-gray-600">Click below to populate your Supabase database with sample content to verify the new UI.</p>
            <button
                onClick={handleSeed}
                disabled={loading}
                className="bg-brand-900 text-white px-6 py-3 rounded-lg hover:bg-black disabled:opacity-50"
            >
                {loading ? 'Seeding...' : 'Seed Sample Data'}
            </button>
            {status && <div className="mt-4 font-mono text-sm">{status}</div>}
        </div>
    );
}
