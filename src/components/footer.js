import React from 'react';
import { Github, Heart, Code } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Left side - Logo and tagline */}
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            S-News
                        </h2>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Stay informed, stay ahead
                        </span>
                    </div>

                    {/* Right side - Links */}
                    <div className="flex items-center space-x-6">
                        <a
                            href="https://github.com/SwastikShetty06/s-news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            <span className="text-sm">View Source</span>
                        </a>
                        
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <span className="text-sm">Built with</span>
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-sm">and</span>
                            <Code className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                
                {/* Bottom section */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        © 2024 Swastik Shetty. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
