# Product Search Application

A full-stack application that allows users to search for products from a MongoDB database, with search suggestions and trending products features.

## Features

- **Product Search**: Search for products by name, description, or category
- **Real-time Search Suggestions**: Get suggestions as you type
- **Trending Products**: View popular products based on views or likes
- **Pagination**: Navigate through search results with ease
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js and Express for the server
- MongoDB for the database
- Mongoose as the ODM (Object Data Modeling)
- Full-text search capabilities

### Frontend
- React for the UI
- Responsive design with CSS
- Real-time search suggestions
- Display of trending products

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB connection (provided in the project)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`

### Initial Setup
- Seed the database with sample products by making a POST request to `/api/products/seed`
- This can be done through the UI or by using a tool like Postman

## API Endpoints

- `GET /api/products/search?query=keyword&page=1&limit=10`: Search for products
- `GET /api/products/suggestions?query=keyword`: Get search suggestions
- `GET /api/products/trending?metric=views&limit=5`: Get trending products
- `POST /api/products/seed`: Seed the database with sample products

## Implementation Details

### Search Functionality
- Utilizes MongoDB's text indexing for efficient full-text search
- Supports pagination for large result sets

### Search Suggestions
- Provides real-time suggestions as users type
- Uses regex pattern matching for flexible matching

### Trending Products
- Tracks product views when they appear in search results
- Can sort by either views or likes based on preference
- Automatically highlights popular products

## Optimizations
- MongoDB text indexes for faster search performance
- Caching of trending products
- Efficient pagination implementation
- Debounced search input for reduced API calls