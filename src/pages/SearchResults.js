import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Loader2, ArrowUpDown } from 'lucide-react';
import NewsItem from '../components/NewsItem';
import { searchNews } from '../api';
import { useNews } from '../context/NewsContext';
import toast from 'react-hot-toast';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const debounceTimeout = useRef(null);
    const [sortBy, setSortBy] = useState('publishedAt'); // publishedAt or relevance

    const {
        searchResults,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        setLoading,
        setError,
        setSearchResults,
    } = useNews();

    const performSearch = useCallback(async (searchTerm, sort = 'publishedAt') => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        // Clear any existing timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Immediate search without debounce for better UX
        try {
            setLoading(true);
            setError(null);

            const results = await searchNews(searchTerm, 1, sort);
            setSearchResults(results || []);

            if (!results || results.length === 0) {
                toast.info(`No articles found for "${searchTerm}"`);
            }
        } catch (err) {
            if (err.message && err.message.includes('cancelled')) {
                // Request was cancelled, ignore
                return;
            }
            const errorMessage = 'Failed to search news. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setSearchResults]);

    // Update search query when URL changes and perform search
    useEffect(() => {
        if (query !== searchQuery) {
            setSearchQuery(query);
        }

        if (query) {
            // Clear previous results immediately
            setSearchResults([]);
            setError(null);
            performSearch(query, sortBy);
        } else {
            // Clear results when no query
            setSearchResults([]);
            setError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, sortBy]); // Removed searchQuery to prevent input reset loop

    // Cleanup function
    useEffect(() => {
        return () => {
            // Clear any pending timeouts
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <Search className="w-8 h-8 text-primary-600" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Search Results
                            </h1>
                        </div>

                        {/* Sort Dropdown */}
                        {query && (
                            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="bg-transparent border-none text-sm font-semibold text-gray-900 dark:text-white focus:ring-0 cursor-pointer outline-none"
                                >
                                    <option value="publishedAt">Newest</option>
                                    <option value="relevance">Relevance</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {query && (
                        <p className="text-gray-600 dark:text-gray-400">
                            Showing results for: <span className="font-semibold text-primary-600">"{query}"</span>
                        </p>
                    )}

                    {!query && (
                        <p className="text-gray-600 dark:text-gray-400">
                            Use the search bar above to find news articles
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Search Error
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center">
                            {error}
                        </p>
                    </div>
                )}

                {/* Search Results */}
                {!loading && !error && searchResults.length > 0 && (
                    <>
                        <div className="mb-6">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Found {searchResults.length} articles
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {searchResults.map((article, index) => (
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
                    </>
                )}

                {/* No Results */}
                {!loading && !error && query && searchResults.length === 0 && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Results Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            We couldn't find any articles matching "{query}". Try adjusting your search terms or check for typos.
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && !query && (
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Start Your Search
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            Use the search bar in the navigation to find news articles on topics that interest you.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchResults;
