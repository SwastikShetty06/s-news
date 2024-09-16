import React from 'react';
import NewsList from '../components/NewsList';

const Home = () => {
    return (
        <div>
        <h1 className='homeH1'>Top Headlines</h1>
        <NewsList />
        </div>
    );
};

export default Home;
