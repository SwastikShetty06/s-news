import React, { useEffect } from 'react';
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
        setLoading,
        setError,
        setArticles,
        setCurrentPage,
        setHasMore
    } = useNews();


    // Load initial news on mount - only once
    useEffect(() => {
        let isMounted = true;
        
        const loadInitialNews = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const news = await fetchTopHeadlines(1);
                
                if (isMounted) {
                    if (news && news.length > 0) {
                        setArticles(news);
                        if (news.length < 10) {
                            setHasMore(false);
                        }
                    } else {
                        setHasMore(false);
                        setArticles([]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    const errorMessage = 'Failed to load news. Please try again.';
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        loadInitialNews();
        
        return () => {
            isMounted = false;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run only once

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setCurrentPage(1);
            setHasMore(true);
            
            const news = await fetchTopHeadlines(1);
            
            if (news && news.length > 0) {
                setArticles(news);
                if (news.length < 10) {
                    setHasMore(false);
                }
                toast.success('News refreshed!');
            } else {
                setHasMore(false);
                setArticles([]);
                toast.error('No news found.');
            }
        } catch (err) {
            const errorMessage = 'Failed to refresh news. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
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
                
                {/* Mock data banner - only show when using mock data */}
                {articles.length > 0 && articles[0].url === 'https://example.com/article1' && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Demo Mode:</strong> Currently showing sample news articles. 
                                This happens when the API rate limit is exceeded or the account needs activation. 
                                Visit <a href="https://gnews.io/dashboard" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">gnews.io/dashboard</a> to check your account status.
                            </p>
                        </div>
                    </div>
                )}
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

            {/* Refresh News Button */}
            {articles.length > 0 && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Refreshing...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-5 h-5" />
                                <span>Refresh News</span>
                            </>
                        )}
                    </button>
                </div>
            )}

        </div>
    );
};

export default NewsList;
