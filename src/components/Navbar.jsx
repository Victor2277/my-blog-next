'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="bg-brand-900 text-white p-2 rounded-lg transform group-hover:rotate-3 transition-transform duration-300">
                            <BookOpen size={24} />
                        </div>
                        <span className="font-serif font-bold text-2xl text-brand-900 tracking-tight group-hover:text-accent-500 transition-colors">
                            My Blog
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {['首頁', '技術', '生活', '關於'].map((item) => (
                            <Link
                                key={item}
                                href={item === '首頁' ? '/' : `/category/${item}`}
                                className="text-sm font-medium text-gray-600 hover:text-accent-500 transition-colors relative group py-2"
                            >
                                {item}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            className="bg-brand-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            撰寫文章
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-brand-900 focus:outline-none p-2 rounded-md transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 pt-2 pb-6 space-y-2 bg-white border-t border-gray-100 shadow-xl">
                    {['首頁', '技術', '生活', '關於'].map((item) => (
                        <Link
                            key={item}
                            href={item === '首頁' ? '/' : `/category/${item}`}
                            className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-accent-500 hover:bg-gray-50 transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <Link
                        href="/admin"
                        className="block w-full text-center mt-4 bg-brand-900 text-white px-5 py-3 rounded-lg text-base font-medium hover:bg-accent-500 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        撰寫文章
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
