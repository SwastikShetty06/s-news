import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
  favorites: [],
  readLater: [],
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

    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.url !== action.payload.url),
      };

    case 'ADD_TO_READ_LATER':
      return {
        ...state,
        readLater: [...state.readLater, action.payload],
      };

    case 'REMOVE_FROM_READ_LATER':
      return {
        ...state,
        readLater: state.readLater.filter(item => item.url !== action.payload.url),
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
        if (parsedState.favorites) {
          dispatch({ type: 'SET_FAVORITES', payload: parsedState.favorites });
        }
        if (parsedState.readLater) {
          dispatch({ type: 'SET_READ_LATER', payload: parsedState.readLater });
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
      favorites: state.favorites,
      readLater: state.readLater,
    };
    localStorage.setItem('newsAppState', JSON.stringify(stateToSave));
  }, [state.darkMode, state.favorites, state.readLater]);

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Helper functions
  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setArticles = (articles) => {
    dispatch({ type: 'SET_ARTICLES', payload: articles });
  };

  const appendArticles = (articles) => {
    dispatch({ type: 'APPEND_ARTICLES', payload: articles });
  };

  const setSearchResults = (results) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  };

  const appendSearchResults = (results) => {
    dispatch({ type: 'APPEND_SEARCH_RESULTS', payload: results });
  };

  const setCurrentPage = (page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const setSearchPage = (page) => {
    dispatch({ type: 'SET_SEARCH_PAGE', payload: page });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setHasMore = (hasMore) => {
    dispatch({ type: 'SET_HAS_MORE', payload: hasMore });
  };

  const setSearchHasMore = (hasMore) => {
    dispatch({ type: 'SET_SEARCH_HAS_MORE', payload: hasMore });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const setCategory = (category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const addToFavorites = (article) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: article });
  };

  const removeFromFavorites = (article) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: article });
  };

  const addToReadLater = (article) => {
    dispatch({ type: 'ADD_TO_READ_LATER', payload: article });
  };

  const removeFromReadLater = (article) => {
    dispatch({ type: 'REMOVE_FROM_READ_LATER', payload: article });
  };

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
  };

  const isFavorite = (article) => {
    return state.favorites.some(fav => fav.url === article.url);
  };

  const isReadLater = (article) => {
    return state.readLater.some(item => item.url === article.url);
  };

  const value = {
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
    addToFavorites,
    removeFromFavorites,
    addToReadLater,
    removeFromReadLater,
    clearSearch,
    isFavorite,
    isReadLater,
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}
