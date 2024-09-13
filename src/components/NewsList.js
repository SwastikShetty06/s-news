import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import { fetchTopHeadlines } from '../api';

const NewsList = () => {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadNews = async () => {
        const news = await fetchTopHeadlines(page);
        setArticles(news);
        };
        loadNews();
    }, [page]);

    return (
        <div>
        {articles.map((article, index) => (
            <NewsItem
            key={index}
            title={article.title}
            description={article.description}
            url={article.url}
            image={article.image}
            />
        ))}
        <button onClick={() => setPage(page + 1)}>Load More</button>
        </div>
    );
};

export default NewsList;
