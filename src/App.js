import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NewsProvider } from './context/NewsContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Footer from './components/footer';
import './App.css';

function App() {
  return (
    <NewsProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/favorites" element={<div className="p-8 text-center">Favorites page coming soon!</div>} />
              <Route path="/read-later" element={<div className="p-8 text-center">Read Later page coming soon!</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
          }}
        />
      </Router>
    </NewsProvider>
  );
}

export default App;
