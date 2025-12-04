import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, AlertCircle, ExternalLink, Clock, User } from 'lucide-react';
import NewsItem from './NewsItem';
import { fetchTopHeadlines } from '../api';
import { useNews } from '../context/NewsContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const NewsList = () => {
    const {
        articles,
        loading,
        error,
        setLoading,
        setError,
        setArticles,
        setCurrentPage,
        setHasMore,
        selectedCategory
    } = useNews();


    // Load news when category changes or on mount
    useEffect(() => {
        let isMounted = true;

        const loadNews = async () => {
            try {
                setLoading(true);
                setError(null);

                const news = await fetchTopHeadlines(1, selectedCategory);

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

        loadNews();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            setError(null);
            setCurrentPage(1);
            setHasMore(true);

            const news = await fetchTopHeadlines(1, selectedCategory);

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

    const getTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Recently';
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                    {selectedCategory === 'general' ? 'Top Headlines' : `${selectedCategory} News`}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Stay updated with the latest stories
                </p>

            </div>

            {/* Hero Section (First Article) */}
            {articles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 group cursor-pointer"
                >
                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src={articles[0].image || 'https://via.placeholder.com/800x400?text=No+Image'}
                            alt={articles[0].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                <div className="flex items-center space-x-4 text-white/80 text-sm mb-3">
                                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                        Featured
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4" />
                                        <span>{articles[0].source?.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{getTimeAgo(articles[0].publishedAt)}</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">
                                    {articles[0].title}
                                </h2>
                                <p className="text-gray-300 text-lg md:text-xl line-clamp-2 mb-6 max-w-3xl">
                                    {articles[0].description}
                                </p>
                                <a
                                    href={articles[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 bg-white text-gray-900 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    <span>Read Full Story</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* News Grid (Remaining Articles) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {articles.slice(1).map((article, index) => (
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
                        className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
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
