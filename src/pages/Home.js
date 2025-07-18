import React from 'react';
import { motion } from 'framer-motion';
import NewsList from '../components/NewsList';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        >
            <NewsList />
        </motion.div>
    );
};

export default Home;
