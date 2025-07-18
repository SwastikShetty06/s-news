import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import NewsItem from './NewsItem';
import { fetchTopHeadlines } from '../api';
import { useNews } from '../context/NewsContext';
import toast from 'react-hot-toast';

const NewsList = () => {
    const {
        articles,
        loading,
        error,
        currentPage,
        hasMore,
        selectedCategory,
        setLoading,
        setError,
        setArticles,
        appendArticles,
        setCurrentPage,
        setHasMore
    } = useNews();

    const loadNews = useCallback(async (page = 1, append = false) => {
        try {
            setLoading(true);
            setError(null);
            
            const news = await fetchTopHeadlines(page);
            
            if (news && news.length > 0) {
                if (append) {
                    appendArticles(news);
                } else {
                    setArticles(news);
                }
                
                if (news.length < 10) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
                if (page === 1) {
                    setArticles([]);
                }
            }
        } catch (err) {
            const errorMessage = 'Failed to load news. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setArticles, appendArticles, setHasMore]);

    // Load initial news
    useEffect(() => {
        loadNews(1, false);
    }, [loadNews, selectedCategory]); // Reload when category changes

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadNews(nextPage, true);
        }
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        setHasMore(true);
        loadNews(1, false);
        toast.success('News refreshed!');
    };

    if (error && articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Oops! Something went wrong
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    {error}
                </p>
                <button
                    onClick={handleRefresh}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Latest News
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Stay updated with the latest headlines from around the world
                </p>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {articles.map((article, index) => (
                        <motion.div
                            key={`${article.url}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <NewsItem
                                title={article.title}
                                description={article.description}
                                url={article.url}
                                image={article.image}
                                publishedAt={article.publishedAt}
                                source={article.source}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Loading State */}
            {loading && articles.length === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {articles.length > 0 && hasMore && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-5 h-5" />
                                <span>Load More News</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* No More Articles */}
            {articles.length > 0 && !hasMore && !loading && (
                <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                        You've reached the end of the news feed.
                    </p>
                </div>
            )}
        </div>
    );
};

export default NewsList;
