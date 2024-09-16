import React, { useState } from 'react';
import NewsItem from '../components/NewsItem';
import { searchNews } from '../api';

const SearchResults = () => {
    const [query, setQuery] = useState('');
    const [articles, setArticles] = useState([]);

    const handleSearch = async () => {
        const results = await searchNews(query);
        setArticles(results);
    };

    return (
        <div className='searchDiv'>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
        />
        <button onClick={handleSearch}>Search</button>

        {articles.map((article, index) => (
            <NewsItem
            key={index}
            title={article.title}
            description={article.description}
            url={article.url}
            image={article.image}
            />
        ))}
        </div>
    );
};

export default SearchResults;
