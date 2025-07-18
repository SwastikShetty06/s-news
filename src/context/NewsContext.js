import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';

const NewsContext = createContext();

const initialState = {
  articles: [],
  searchResults: [],
  loading: false,
  error: null,
  currentPage: 1,
  searchQuery: '',
  searchPage: 1,
  hasMore: true,
  searchHasMore: true,
  darkMode: false,
  selectedCategory: 'general',
};

const categories = [
  { id: 'general', name: 'General', icon: '📰' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
];

function newsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'SET_ARTICLES':
      return {
        ...state,
        articles: action.payload,
        loading: false,
        error: null,
      };

    case 'APPEND_ARTICLES':
      return {
        ...state,
        articles: [...state.articles, ...action.payload],
        loading: false,
        error: null,
      };

    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        loading: false,
        error: null,
      };

    case 'APPEND_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: [...state.searchResults, ...action.payload],
        loading: false,
        error: null,
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };

    case 'SET_SEARCH_PAGE':
      return {
        ...state,
        searchPage: action.payload,
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
        searchPage: 1,
        searchResults: [],
        searchHasMore: true,
        loading: false,
        error: null,
      };

    case 'SET_HAS_MORE':
      return {
        ...state,
        hasMore: action.payload,
      };

    case 'SET_SEARCH_HAS_MORE':
      return {
        ...state,
        searchHasMore: action.payload,
      };

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    case 'SET_DARK_MODE':
      return {
        ...state,
        darkMode: action.payload,
      };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        articles: [],
        currentPage: 1,
        hasMore: true,
      };


    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchQuery: '',
        searchResults: [],
        searchPage: 1,
        searchHasMore: true,
      };

    default:
      return state;
  }
}

export function NewsProvider({ children }) {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('newsAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.darkMode !== undefined) {
          dispatch({ type: 'SET_DARK_MODE', payload: parsedState.darkMode });
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      darkMode: state.darkMode,
    };
    localStorage.setItem('newsAppState', JSON.stringify(stateToSave));
  }, [state.darkMode]);

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Memoize helper functions to prevent recreation on every render
  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setArticles = useCallback((articles) => {
    dispatch({ type: 'SET_ARTICLES', payload: articles });
  }, []);

  const appendArticles = useCallback((articles) => {
    dispatch({ type: 'APPEND_ARTICLES', payload: articles });
  }, []);

  const setSearchResults = useCallback((results) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  }, []);

  const appendSearchResults = useCallback((results) => {
    dispatch({ type: 'APPEND_SEARCH_RESULTS', payload: results });
  }, []);

  const setCurrentPage = useCallback((page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  const setSearchPage = useCallback((page) => {
    dispatch({ type: 'SET_SEARCH_PAGE', payload: page });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setHasMore = useCallback((hasMore) => {
    dispatch({ type: 'SET_HAS_MORE', payload: hasMore });
  }, []);

  const setSearchHasMore = useCallback((hasMore) => {
    dispatch({ type: 'SET_SEARCH_HAS_MORE', payload: hasMore });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const setCategory = useCallback((category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  const value = useMemo(() => ({
    ...state,
    categories,
    setLoading,
    setError,
    setArticles,
    appendArticles,
    setSearchResults,
    appendSearchResults,
    setCurrentPage,
    setSearchPage,
    setSearchQuery,
    setHasMore,
    setSearchHasMore,
    toggleDarkMode,
    setCategory,
    clearSearch,
  }), [state, setLoading, setError, setArticles, appendArticles, setSearchResults, appendSearchResults, setCurrentPage, setSearchPage, setSearchQuery, setHasMore, setSearchHasMore, toggleDarkMode, setCategory, clearSearch]);

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
