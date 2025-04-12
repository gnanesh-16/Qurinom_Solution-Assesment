import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import TrendingProducts from './components/TrendingProducts';
import './styles.css';

const API_BASE_URL = 'http://localhost:5000/api/products';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('all');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0
    });

    // Load all products on initial load
    useEffect(() => {
        // Seed database with sample data if necessary (for demo purposes)
        seedDatabaseIfNeeded();
        // Then fetch all products
        fetchAllProducts(1);
        // Also fetch trending products
        fetchTrendingProducts();
    }, []);

    // When category changes, refresh products
    useEffect(() => {
        if (searchQuery.trim()) {
            fetchSearchResults(searchQuery, 1);
        } else {
            fetchAllProducts(1, currentCategory);
        }
    }, [currentCategory]);

    // Fetch search results when query changes
    useEffect(() => {
        if (searchQuery.trim()) {
            fetchSearchResults(searchQuery, 1);
        }
    }, [searchQuery]);

    // Fetch search suggestions as user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/suggestions`, {
                    params: { query: searchQuery }
                });
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const fetchAllProducts = async (page = 1, category = 'all') => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/all`, {
                params: {
                    page,
                    limit: 6,
                    category: category !== 'all' ? category : undefined
                }
            });

            setSearchResults(response.data.products);
            setPagination({
                currentPage: parseInt(response.data.currentPage),
                totalPages: parseInt(response.data.totalPages),
                totalProducts: parseInt(response.data.totalProducts)
            });

            if (response.data.categories) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchResults = async (query, page = 1, limit = 6) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/search`, {
                params: {
                    query,
                    page,
                    limit
                }
            });

            setSearchResults(response.data.products);
            setPagination({
                currentPage: parseInt(response.data.currentPage),
                totalPages: parseInt(response.data.totalPages),
                totalProducts: parseInt(response.data.totalProducts)
            });

            if (response.data.categories) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrendingProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/trending`);
            setTrendingProducts(response.data);
        } catch (error) {
            console.error('Error fetching trending products:', error);
            setTrendingProducts([]);
        }
    };

    const seedDatabaseIfNeeded = async () => {
        try {
            // First check if we need to seed by searching for all products
            const testResponse = await axios.get(`${API_BASE_URL}/all`);

            // If no products exist, seed the database
            if (testResponse.data.totalProducts === 0) {
                await axios.post(`${API_BASE_URL}/seed`);
                console.log('Database seeded with sample products');
            }
        } catch (error) {
            // If there's an error (likely because no products exist), seed the database
            try {
                await axios.post(`${API_BASE_URL}/seed`);
                console.log('Database seeded with sample products');
            } catch (seedError) {
                console.error('Error seeding database:', seedError);
            }
        }
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        // When changing search query, reset category filter
        setCurrentCategory('all');
    };

    const handlePageChange = (newPage) => {
        if (searchQuery.trim()) {
            fetchSearchResults(searchQuery, newPage);
        } else {
            fetchAllProducts(newPage, currentCategory);
        }
    };

    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
    };

    const handleSuggestionSelect = (suggestion) => {
        setSearchQuery(suggestion);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        fetchAllProducts(1);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Product Finder</h1>
                <p className="app-subtitle">Discover amazing products with advanced search and trending recommendations</p>
            </header>

            <main className="main-content">
                <SearchBar
                    query={searchQuery}
                    onQueryChange={handleSearchChange}
                    suggestions={suggestions}
                    onSuggestionSelect={handleSuggestionSelect}
                    onClearSearch={handleClearSearch}
                />

                <div className="content-wrapper">
                    <div className="results-section">
                        {!loading && searchResults.length === 0 && !searchQuery.trim() ? (
                            <div className="welcome-container">
                                <h2>Welcome to Product Finder</h2>
                                <p>Start typing in the search bar to find products or browse our catalog below.</p>
                                <div className="welcome-features">
                                    <div className="feature">
                                        <div className="feature-icon">🔍</div>
                                        <div className="feature-text">
                                            <h3>Smart Search</h3>
                                            <p>Find products instantly with our advanced search</p>
                                        </div>
                                    </div>
                                    <div className="feature">
                                        <div className="feature-icon">💡</div>
                                        <div className="feature-text">
                                            <h3>Suggestions</h3>
                                            <p>Get real-time suggestions as you type</p>
                                        </div>
                                    </div>
                                    <div className="feature">
                                        <div className="feature-icon">📈</div>
                                        <div className="feature-text">
                                            <h3>Trending Products</h3>
                                            <p>Discover what other people are viewing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <SearchResults
                                products={searchResults}
                                loading={loading}
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                searchQuery={searchQuery}
                                categories={categories}
                                onCategoryChange={handleCategoryChange}
                                currentCategory={currentCategory}
                            />
                        )}
                    </div>

                    <div className="trending-section">
                        <TrendingProducts products={trendingProducts} />
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <p>&copy; {new Date().getFullYear()} Product Finder. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default App;