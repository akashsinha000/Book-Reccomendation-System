# Book Recommendation System

A modern web application that uses AI-powered natural language processing to provide personalized book recommendations based on user preferences.

## Features

- **AI-Powered Recommendations**: Uses Hugging Face's sentence-transformers model to understand user preferences and find similar books
- **Clean Modern UI**: Responsive design with Bootstrap 5 and custom CSS
- **Advanced Filtering**: Filter books by genre, rating, and publication year
- **Real-time Search**: Get instant recommendations as you type your preferences
- **Modular Architecture**: Clean separation of concerns with Flask backend and vanilla JavaScript frontend

## Technology Stack

- **Backend**: Python, Flask
- **AI/ML**: Hugging Face Transformers, Sentence-Transformers
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Data Processing**: Pandas, NumPy, Scikit-learn

## Installation

1. **Clone or download the project**
   ```bash
   cd book_recommendation_app
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## Usage

### Getting Recommendations

1. Enter your reading preferences in the text area (e.g., "I love mystery novels with complex characters")
2. Select the number of recommendations you want
3. Click "Get Recommendations"
4. View your personalized book suggestions with similarity scores

### Browsing Books

1. Use the filter options to narrow down books by:
   - Genre (Fiction, Fantasy, Mystery, etc.)
   - Minimum rating (3.0+ to 4.5+ stars)
   - Publication year range
2. Click "Apply Filters" to see filtered results

## API Endpoints

- `GET /` - Main application page
- `POST /api/recommend` - Get book recommendations based on preferences
- `GET /api/books` - Get all books with optional filtering
- `GET /api/genres` - Get all available genres

## How It Works

1. **Text Embedding**: User preferences are converted to vector embeddings using the `all-MiniLM-L6-v2` model
2. **Similarity Calculation**: Cosine similarity is calculated between user preferences and book descriptions
3. **Ranking**: Books are ranked by similarity score and returned as recommendations
4. **Filtering**: Additional filtering options allow users to refine results

## Sample Data

The application comes with a curated set of 10 classic books including:
- The Great Gatsby
- To Kill a Mockingbird
- 1984
- Pride and Prejudice
- Harry Potter and the Sorcerer's Stone
- And more...

## Customization

### Adding More Books

Edit the `books_data` list in `app.py` to add more books:

```python
{
    "id": 11,
    "title": "Your Book Title",
    "author": "Author Name",
    "genre": "Genre",
    "description": "Book description...",
    "rating": 4.5,
    "year": 2023
}
```

### Changing the AI Model

Replace the model in `app.py`:

```python
model = SentenceTransformer('your-preferred-model')
```

Popular alternatives:
- `all-mpnet-base-v2` (better accuracy, slower)
- `paraphrase-MiniLM-L6-v2` (faster, good accuracy)

## Performance Notes

- First run may take longer as the AI model downloads
- Recommendations are cached for better performance
- The application uses efficient vector operations for similarity calculations

## Troubleshooting

### Common Issues

1. **Model download fails**: Ensure you have a stable internet connection
2. **Memory issues**: The default model is lightweight, but you can use smaller models if needed
3. **Port already in use**: Change the port in `app.py` (line 95)

### Requirements

- Python 3.7+
- 2GB+ RAM recommended
- Internet connection for initial model download

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.
