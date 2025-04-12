import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ query, onQueryChange, suggestions, onSuggestionSelect, onClearSearch }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Add event listener to close suggestions when clicking outside
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        onQueryChange(e.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        onSuggestionSelect(suggestion);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // If input is empty, trigger clearing the search
        if (!query.trim() && onClearSearch) {
            onClearSearch();
        }
        setShowSuggestions(false);
    };

    const handleClear = () => {
        if (onClearSearch) {
            onClearSearch();
            inputRef.current.focus();
        }
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for products..."
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        ref={inputRef}
                    />
                    {query && (
                        <button
                            type="button"
                            className="clear-button"
                            onClick={handleClear}
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </button>
                    )}
                    <button type="submit" className="search-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-container" ref={suggestionsRef}>
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="suggestion-item"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;