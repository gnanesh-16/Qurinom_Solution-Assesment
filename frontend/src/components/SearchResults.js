import React from 'react';

const SearchResults = ({ products, loading, pagination, onPageChange, searchQuery, categories, onCategoryChange, currentCategory }) => {
    const { currentPage, totalPages, totalProducts } = pagination;

    if (loading) {
        return <div className="loading-spinner">Searching for products...</div>;
    }

    if (products.length === 0 && searchQuery.trim()) {
        return (
            <div className="no-results">
                <p>No products found matching "<strong>{searchQuery}</strong>"</p>
                <p>Try different keywords or check for spelling errors</p>
            </div>
        );
    }

    return (
        <div className="search-results-container">
            <div className="search-header">
                <h2>
                    {searchQuery ?
                        `Search Results ${totalProducts > 0 ? `(${totalProducts} products found)` : ''}` :
                        'All Products'
                    }
                </h2>

                {/* Category filter */}
                {categories && categories.length > 0 && (
                    <div className="category-filter">
                        <span>Filter by category:</span>
                        <select
                            value={currentCategory || 'all'}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="category-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-description">{product.description}</p>
                            <div className="product-meta">
                                <span className="product-price">${product.price.toFixed(2)}</span>
                                <span className="product-category">{product.category}</span>
                            </div>
                            <div className="product-stats">
                                <span className="views-count">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                    </svg>
                                    {product.views}
                                </span>
                                <span className="likes-count">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                    </svg>
                                    {product.likes}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination controls - now with numeric pages for easier navigation */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        className="pagination-button"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                        </svg>
                        Previous
                    </button>

                    <div className="page-indicators">
                        {/* Logic to limit number of page buttons shown at once */}
                        {(() => {
                            const pageButtons = [];
                            const maxButtonsToShow = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
                            let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

                            if (endPage - startPage + 1 < maxButtonsToShow) {
                                startPage = Math.max(1, endPage - maxButtonsToShow + 1);
                            }

                            // Add first page button if not already included
                            if (startPage > 1) {
                                pageButtons.push(
                                    <button
                                        key={1}
                                        className={`page-button ${currentPage === 1 ? 'active' : ''}`}
                                        onClick={() => onPageChange(1)}
                                    >
                                        1
                                    </button>
                                );

                                // Add ellipsis if there's a gap
                                if (startPage > 2) {
                                    pageButtons.push(<span key="ellipsis1" className="page-ellipsis">...</span>);
                                }
                            }

                            // Add page buttons
                            for (let i = startPage; i <= endPage; i++) {
                                pageButtons.push(
                                    <button
                                        key={i}
                                        className={`page-button ${currentPage === i ? 'active' : ''}`}
                                        onClick={() => onPageChange(i)}
                                    >
                                        {i}
                                    </button>
                                );
                            }

                            // Add last page button if not already included
                            if (endPage < totalPages) {
                                // Add ellipsis if there's a gap
                                if (endPage < totalPages - 1) {
                                    pageButtons.push(<span key="ellipsis2" className="page-ellipsis">...</span>);
                                }

                                pageButtons.push(
                                    <button
                                        key={totalPages}
                                        className={`page-button ${currentPage === totalPages ? 'active' : ''}`}
                                        onClick={() => onPageChange(totalPages)}
                                    >
                                        {totalPages}
                                    </button>
                                );
                            }

                            return pageButtons;
                        })()}
                    </div>

                    <button
                        className="pagination-button"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;