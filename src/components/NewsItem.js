import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NewsItem = ({ title, description, url, image, publishedAt, source }) => {
    
    const getTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="news-card bg-white dark:bg-gray-800 rounded-xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden group"
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Meta Information */}
                <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{source?.name || 'Unknown Source'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeAgo(publishedAt)}</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-tight line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                    {description || 'No description available.'}
                </p>

                {/* Read More Button */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium group/button"
                >
                    <span>Read More</span>
                    <ExternalLink className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                </a>
            </div>
        </motion.article>
    );
};

export default NewsItem;
