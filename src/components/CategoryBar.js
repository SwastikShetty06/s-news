import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNews } from '../context/NewsContext';

const CategoryBar = () => {
    const { categories, selectedCategory, setCategory } = useNews();
    const scrollContainerRef = useRef(null);

    // Scroll to selected category when it changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            const selectedElement = scrollContainerRef.current.querySelector(`[data-category="${selectedCategory}"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [selectedCategory]);

    return (
        <div className="sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={scrollContainerRef}
                    className="flex items-center space-x-2 py-3 overflow-x-auto no-scrollbar scroll-smooth"
                >
                    {categories.map((category) => (
                        <motion.button
                            key={category.id}
                            data-category={category.id}
                            onClick={() => setCategory(category.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                                ${selectedCategory === category.id
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
