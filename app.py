vivefrom flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json
import os

app = Flask(__name__)

# Initialize the NLP model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Sample book data
books_data = [
    {
        "id": 1,
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "genre": "Fiction",
        "description": "A classic American novel about the Jazz Age and the American Dream.",
        "rating": 4.5,
        "year": 1925
    },
    {
        "id": 2,
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "genre": "Fiction",
        "description": "A story of racial injustice and childhood innocence in the American South.",
        "rating": 4.8,
        "year": 1960
    },
    {
        "id": 3,
        "title": "1984",
        "author": "George Orwell",
        "genre": "Dystopian Fiction",
        "description": "A dystopian social science fiction novel about totalitarian control.",
        "rating": 4.7,
        "year": 1949
    },
    {
        "id": 4,
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "genre": "Romance",
        "description": "A romantic novel about Elizabeth Bennet and Mr. Darcy.",
        "rating": 4.6,
        "year": 1813
    },
    {
        "id": 5,
        "title": "The Catcher in the Rye",
        "author": "J.D. Salinger",
        "genre": "Fiction",
        "description": "A coming-of-age story about teenage rebellion and alienation.",
        "rating": 4.2,
        "year": 1951
    },
    {
        "id": 6,
        "title": "Lord of the Flies",
        "author": "William Golding",
        "genre": "Fiction",
        "description": "A story about British boys stranded on an uninhabited island.",
        "rating": 4.3,
        "year": 1954
    },
    {
        "id": 7,
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "genre": "Fantasy",
        "description": "A fantasy novel about Bilbo Baggins and his adventure.",
        "rating": 4.7,
        "year": 1937
    },
    {
        "id": 8,
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "genre": "Fantasy",
        "description": "The first book in the Harry Potter series about a young wizard.",
        "rating": 4.8,
        "year": 1997
    },
    {
        "id": 9,
        "title": "The Chronicles of Narnia",
        "author": "C.S. Lewis",
        "genre": "Fantasy",
        "description": "A series of fantasy novels about the magical world of Narnia.",
        "rating": 4.6,
        "year": 1950
    },
    {
        "id": 10,
        "title": "The Da Vinci Code",
        "author": "Dan Brown",
        "genre": "Mystery",
        "description": "A mystery thriller about symbologist Robert Langdon.",
        "rating": 4.1,
        "year": 2003
    }
]

# Create embeddings for all books
def create_book_embeddings():
    """Create embeddings for all books using their descriptions"""
    book_texts = []
    for book in books_data:
        text = f"{book['title']} {book['author']} {book['genre']} {book['description']}"
        book_texts.append(text)
    
    embeddings = model.encode(book_texts)
    return embeddings

# Pre-compute embeddings
book_embeddings = create_book_embeddings()

def get_recommendations(user_preferences, num_recommendations=5):
    """Get book recommendations based on user preferences"""
    # Create embedding for user preferences
    user_embedding = model.encode([user_preferences])
    
    # Calculate similarity scores
    similarities = cosine_similarity(user_embedding, book_embeddings)[0]
    
    # Get top recommendations
    top_indices = np.argsort(similarities)[::-1][:num_recommendations]
    
    recommendations = []
    for idx in top_indices:
        book = books_data[idx].copy()
        book['similarity_score'] = float(similarities[idx])
        recommendations.append(book)
    
    return recommendations

def filter_books(genre=None, min_rating=None, year_range=None):
    """Filter books based on criteria"""
    filtered_books = books_data.copy()
    
    if genre:
        filtered_books = [book for book in filtered_books if book['genre'].lower() == genre.lower()]
    
    if min_rating:
        filtered_books = [book for book in filtered_books if book['rating'] >= min_rating]
    
    if year_range:
        start_year, end_year = year_range
        filtered_books = [book for book in filtered_books if start_year <= book['year'] <= end_year]
    
    return filtered_books

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """API endpoint for getting recommendations"""
    data = request.get_json()
    user_preferences = data.get('preferences', '')
    num_recommendations = data.get('num_recommendations', 5)
    
    if not user_preferences:
        return jsonify({'error': 'Preferences are required'}), 400
    
    recommendations = get_recommendations(user_preferences, num_recommendations)
    return jsonify({'recommendations': recommendations})

@app.route('/api/books')
def get_books():
    """API endpoint for getting all books"""
    genre = request.args.get('genre')
    min_rating = request.args.get('min_rating', type=float)
    year_range = request.args.get('year_range')
    
    filtered_books = books_data.copy()
    
    if genre:
        filtered_books = [book for book in filtered_books if book['genre'].lower() == genre.lower()]
    
    if min_rating:
        filtered_books = [book for book in filtered_books if book['rating'] >= min_rating]
    
    if year_range:
        try:
            start_year, end_year = map(int, year_range.split('-'))
            filtered_books = [book for book in filtered_books if start_year <= book['year'] <= end_year]
        except ValueError:
            pass
    
    return jsonify({'books': filtered_books})

@app.route('/api/genres')
def get_genres():
    """API endpoint for getting all genres"""
    genres = list(set(book['genre'] for book in books_data))
    return jsonify({'genres': genres})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
