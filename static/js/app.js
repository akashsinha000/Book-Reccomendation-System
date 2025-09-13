// Book Recommendation System - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    loadGenres();
    loadAllBooks();
    setupEventListeners();
    addInteractiveAnimations();
    initializeTheme();
}

function setupEventListeners() {
    // Recommendation form submission
    document.getElementById('recommendationForm').addEventListener('submit', handleRecommendationSubmit);
    
    // Filter application
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    
    // Real-time filter changes
    document.getElementById('genreFilter').addEventListener('change', applyFilters);
    document.getElementById('ratingFilter').addEventListener('change', applyFilters);
    document.getElementById('yearFilter').addEventListener('change', applyFilters);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

async function loadGenres() {
    try {
        const response = await fetch('/api/genres');
        const data = await response.json();
        
        const genreSelect = document.getElementById('genreFilter');
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

async function loadAllBooks() {
    try {
        const response = await fetch('/api/books');
        const data = await response.json();
        displayBooks(data.books, 'booksContainer');
    } catch (error) {
        console.error('Error loading books:', error);
        showError('Failed to load books. Please try again.');
    }
}

async function handleRecommendationSubmit(event) {
    event.preventDefault();
    
    const preferences = document.getElementById('preferences').value.trim();
    const numRecommendations = parseInt(document.getElementById('numRecommendations').value);
    
    if (!preferences) {
        showError('Please enter your reading preferences.');
        return;
    }
    
    // Show loading modal
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    loadingModal.show();
    
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                preferences: preferences,
                num_recommendations: numRecommendations
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayRecommendations(data.recommendations);
            loadingModal.hide();
        } else {
            throw new Error(data.error || 'Failed to get recommendations');
        }
    } catch (error) {
        console.error('Error getting recommendations:', error);
        loadingModal.hide();
        showError('Failed to get recommendations. Please try again.');
    }
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContainer');
    const section = document.getElementById('recommendationsSection');
    
    container.innerHTML = '';
    
    recommendations.forEach((book, index) => {
        const bookCard = createBookCard(book, true);
        bookCard.style.animationDelay = `${index * 0.1}s`;
        bookCard.classList.add('fade-in-up');
        container.appendChild(bookCard);
    });
    
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

function displayBooks(books, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    books.forEach((book, index) => {
        const bookCard = createBookCard(book, false);
        bookCard.style.animationDelay = `${index * 0.05}s`;
        bookCard.classList.add('fade-in-up');
        container.appendChild(bookCard);
    });
}

function createBookCard(book, isRecommendation = false) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const card = document.createElement('div');
    card.className = 'book-card';
    
    const stars = '★'.repeat(Math.floor(book.rating)) + '☆'.repeat(5 - Math.floor(book.rating));
    
    // Add book cover placeholder with gradient based on genre
    const genreColors = {
        'Fiction': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'Fantasy': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'Mystery': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'Romance': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'Dystopian Fiction': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    };
    
    const coverGradient = genreColors[book.genre] || genreColors['Fiction'];
    
    card.innerHTML = `
        <div class="book-cover" style="background: ${coverGradient};">
            <div class="book-cover-content">
                <i class="fas fa-book"></i>
                <div class="book-cover-title">${book.title.split(' ').slice(0, 2).join(' ')}</div>
            </div>
        </div>
        <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">by ${book.author}</div>
            <div class="book-genre">${book.genre}</div>
            <div class="book-description">${book.description}</div>
            <div class="book-rating">
                <span class="stars">${stars}</span>
                <span>${book.rating}/5.0</span>
            </div>
            <div class="book-year">Published: ${book.year}</div>
            ${isRecommendation ? `<div class="similarity-score">Match: ${(book.similarity_score * 100).toFixed(1)}%</div>` : ''}
        </div>
    `;
    
    // Add click animation
    card.addEventListener('click', function() {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
    
    col.appendChild(card);
    return col;
}

async function applyFilters() {
    const genre = document.getElementById('genreFilter').value;
    const minRating = document.getElementById('ratingFilter').value;
    const yearRange = document.getElementById('yearFilter').value;
    
    let url = '/api/books?';
    const params = new URLSearchParams();
    
    if (genre) params.append('genre', genre);
    if (minRating) params.append('min_rating', minRating);
    if (yearRange) params.append('year_range', yearRange);
    
    url += params.toString();
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayBooks(data.books, 'booksContainer');
    } catch (error) {
        console.error('Error applying filters:', error);
        showError('Failed to apply filters. Please try again.');
    }
}

function showError(message) {
    // Create a toast notification
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '1055';
    
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header bg-danger text-white">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong class="me-auto">Error</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toastContainer.parentNode) {
            toastContainer.parentNode.removeChild(toastContainer);
        }
    }, 5000);
}

// Utility function to debounce API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add interactive animations
function addInteractiveAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .book-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add typing animation to hero title
    const heroTitle = document.querySelector('.display-4');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
    
    // Add parallax effect to hero stats
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('fade-in-up');
    });
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
