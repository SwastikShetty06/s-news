import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, User, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const NewsItem = ({ title, description, url, image, publishedAt, source }) => {

    const getTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="news-card h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700"
        >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={image || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Category/Source Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-primary-600 dark:text-primary-400 shadow-sm">
                        {source?.name || 'News'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Meta Information */}
                <div className="flex items-center justify-between mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getTimeAgo(publishedAt)}</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                    {description || 'No description available for this article.'}
                </p>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:text-primary-700 dark:hover:text-primary-300 transition-colors group/link"
                    >
                        <span>Read More</span>
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>

                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        title="Share article"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export default NewsItem;
