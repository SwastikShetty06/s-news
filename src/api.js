import axios from 'axios';

const API_KEY = 'f28d2684d54f2d4d8b269548059d10de'; // GNews.io API key

// Create a cancellation token source for request control
let cancelTokenSource = axios.CancelToken.source();

// Function to cancel ongoing requests
const cancelOngoingRequests = () => {
    cancelTokenSource.cancel('Operation cancelled due to new request');
    cancelTokenSource = axios.CancelToken.source();
};

// Mock data for testing when API key is not available
const mockArticles = [
    {
        title: "Breaking: Major Technology Breakthrough Announced",
        description: "Scientists have made a significant breakthrough in quantum computing technology that could revolutionize the industry. This development promises to accelerate computing power exponentially.",
        url: "https://example.com/article1",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech News Daily" }
    },
    {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders have reached a groundbreaking agreement on climate action during the international summit. The deal includes ambitious targets for carbon reduction and renewable energy adoption.",
        url: "https://example.com/article2",
        image: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: { name: "Global News Network" }
    },
    {
        title: "Space Exploration Milestone: New Planet Discovered",
        description: "Astronomers have discovered a potentially habitable exoplanet in a nearby star system. The planet shows signs of having liquid water and an atmosphere suitable for life.",
        url: "https://example.com/article3",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        source: { name: "Space Today" }
    },
    {
        title: "Medical Research: New Treatment Shows Promise",
        description: "A new treatment for a rare genetic disorder has shown remarkable results in clinical trials. Patients have experienced significant improvements in their condition.",
        url: "https://example.com/article4",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        source: { name: "Medical Journal" }
    },
    {
        title: "Economic Markets Show Strong Recovery",
        description: "Global financial markets have shown strong signs of recovery following recent economic uncertainty. Experts predict continued growth in the coming quarters.",
        url: "https://example.com/article5",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: { name: "Financial Times" }
    },
    {
        title: "Sports: Championship Finals Set for This Weekend",
        description: "The championship finals are set to take place this weekend with record-breaking attendance expected. Both teams have prepared extensively for this crucial match.",
        url: "https://example.com/article6",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        source: { name: "Sports Central" }
    },
    {
        title: "Education Revolution: AI-Powered Learning Platforms",
        description: "Educational institutions worldwide are adopting AI-powered learning platforms that personalize education for each student. These systems adapt to individual learning styles and pace.",
        url: "https://example.com/article7",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        source: { name: "Education Today" }
    },
    {
        title: "Sustainable Energy: Solar Power Reaches New Milestone",
        description: "Solar energy installations have reached a new global milestone, with renewable energy now accounting for over 40% of electricity generation in several countries.",
        url: "https://example.com/article8",
        image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        source: { name: "Green Energy News" }
    },
    {
        title: "Cultural Festival Celebrates Diversity Worldwide",
        description: "A global cultural festival is bringing together artists, musicians, and performers from over 50 countries to celebrate diversity and promote cross-cultural understanding.",
        url: "https://example.com/article9",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        source: { name: "Cultural Times" }
    }
];
const BASE_URL = 'https://gnews.io/api/v4';

export const fetchTopHeadlines = async (page = 1, category = 'general') => {
    // Cancel any ongoing requests
    cancelOngoingRequests();

    // If API key is not set, return mock data
    if (API_KEY === 'YOUR_NEW_API_KEY_HERE') {
        console.log('Using mock data - please set your API key in src/api.js');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return paginated mock data
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        return mockArticles.slice(startIndex, endIndex);
    }

    try {
        const params = {
            token: API_KEY,
            lang: 'en',
            page: page,
            max: 10
        };

        // Only add category if it's not 'general' (GNews default is effectively general/top headlines)
        // GNews 'top-headlines' endpoint supports 'topic' parameter which maps to categories
        if (category && category !== 'general') {
            params.topic = category;
        }

        const response = await axios.get(`${BASE_URL}/top-headlines`, {
            params: params,
            cancelToken: cancelTokenSource.token
        });

        // Check if the response contains errors
        if (response.data.errors) {
            const errorMessage = response.data.errors[0] || 'API request failed';
            // If account needs activation, fall back to mock data
            if (errorMessage.includes('activate your account')) {
                console.log('API account needs activation, using mock data');
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Return paginated mock data
                const startIndex = (page - 1) * 10;
                const endIndex = startIndex + 10;
                return mockArticles.slice(startIndex, endIndex);
            }
            throw new Error(errorMessage);
        }

        return response.data.articles;
    } catch (error) {
        console.error("Error fetching top headlines", error);

        // Handle Network Errors (CORS) by trying a proxy first
        if (!error.response || error.code === 'ERR_NETWORK') {
            try {
                console.log('CORS error detected, attempting proxy...');
                // Re-construct params for the proxy request
                const retryParams = {
                    token: API_KEY,
                    lang: 'en',
                    page: page,
                    max: 10
                };
                if (category && category !== 'general') {
                    retryParams.topic = category;
                }

                // Construct URL manually for the proxy
                const queryString = Object.keys(retryParams)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(retryParams[key])}`)
                    .join('&');
                const targetUrl = `${BASE_URL}/top-headlines?${queryString}`;
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

                const response = await axios.get(proxyUrl);
                if (response.data.contents) {
                    const parsedData = JSON.parse(response.data.contents);
                    if (parsedData.articles) {
                        return parsedData.articles;
                    }
                }
            } catch (proxyError) {
                console.warn('Proxy attempt failed', proxyError);
                // Continue to mock data fallback
            }
        }

        // Handle rate limit (429), 403, or failed proxy by falling back to mock data
        if (error.response?.status === 429 || error.response?.status === 403 || !error.response || error.code === 'ERR_NETWORK') {
            console.log('API error or CORS issue, using mock data');
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Return paginated mock data
            const startIndex = (page - 1) * 10;
            const endIndex = startIndex + 10;
            return mockArticles.slice(startIndex, endIndex);
        }

        // For other errors, re-throw
        throw error;
    }
};

export const searchNews = async (query, page = 1, sortBy = 'publishedAt') => {
    // Cancel any ongoing requests for search
    cancelOngoingRequests();

    // If API key is not set, return filtered mock data
    if (API_KEY === 'YOUR_NEW_API_KEY_HERE') {
        console.log('Using mock data for search - please set your API key in src/api.js');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Filter mock data based on query
        const filteredArticles = mockArticles.filter(article =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.description.toLowerCase().includes(query.toLowerCase())
        );

        // Return paginated results
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        return filteredArticles.slice(startIndex, endIndex);
    }

    try {
        const params = {
            q: query,
            token: API_KEY,
            lang: 'en',
            page: page,
            max: 10,
            sortby: sortBy // publishedAt or relevance
        };

        const response = await axios.get(`${BASE_URL}/search`, {
            params: params,
            cancelToken: cancelTokenSource.token
        });

        // Check if the response contains errors
        if (response.data.errors) {
            const errorMessage = response.data.errors[0] || 'API request failed';
            // If account needs activation, fall back to mock data
            if (errorMessage.includes('activate your account')) {
                console.log('API account needs activation, using mock data for search');
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Filter mock data based on query
                const filteredArticles = mockArticles.filter(article =>
                    article.title.toLowerCase().includes(query.toLowerCase()) ||
                    article.description.toLowerCase().includes(query.toLowerCase())
                );

                // Return paginated results
                const startIndex = (page - 1) * 10;
                const endIndex = startIndex + 10;
                return filteredArticles.slice(startIndex, endIndex);
            }
            throw new Error(errorMessage);
        }

        return response.data.articles;
    } catch (error) {
        console.error("Error searching for news", error);

        // Handle Network Errors (CORS) by trying a proxy first
        if (!error.response || error.code === 'ERR_NETWORK') {
            try {
                console.log('CORS error detected, attempting proxy for search...');
                // Construct URL manually for the proxy
                const params = {
                    q: query,
                    token: API_KEY,
                    lang: 'en',
                    page: page,
                    max: 10,
                    sortby: sortBy
                };
                const queryString = Object.keys(params)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                    .join('&');
                const targetUrl = `${BASE_URL}/search?${queryString}`;
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

                const response = await axios.get(proxyUrl);
                if (response.data.contents) {
                    const parsedData = JSON.parse(response.data.contents);
                    if (parsedData.articles) {
                        return parsedData.articles;
                    }
                }
            } catch (proxyError) {
                console.warn('Proxy attempt failed', proxyError);
                // Continue to mock data fallback
            }
        }

        // Handle rate limit (429), 403, or Network Errors (CORS) by falling back to mock data
        if (error.response?.status === 429 || error.response?.status === 403 || !error.response || error.code === 'ERR_NETWORK') {
            console.log('API error or CORS issue, using mock data for search');
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Filter mock data based on query
            const filteredArticles = mockArticles.filter(article =>
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                article.description.toLowerCase().includes(query.toLowerCase())
            );

            // Return paginated results
            const startIndex = (page - 1) * 10;
            const endIndex = startIndex + 10;
            return filteredArticles.slice(startIndex, endIndex);
        }

        // For other errors, re-throw
        throw error;
    }
};
