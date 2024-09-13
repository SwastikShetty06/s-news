import axios from 'axios';

const API_KEY = 'f28d2684d54f2d4d8b269548059d10de';
const BASE_URL = 'https://gnews.io/api/v4';

export const fetchTopHeadlines = async (page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
            token: API_KEY,
            lang: 'en',
            page: page,
            max: 10
        }
        });
        return response.data.articles;
    } catch (error) {
        console.error("Error fetching top headlines", error);
        return [];
    }
    };

    export const searchNews = async (query, page = 1) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
        params: {
            q: query,
            token: API_KEY,
            lang: 'en',
            page: page,
            max: 10
        }
        });
        return response.data.articles;
    } catch (error) {
        console.error("Error searching for news", error);
        return [];
    }
};
