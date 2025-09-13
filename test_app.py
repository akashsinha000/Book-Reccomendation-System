#!/usr/bin/env python3
"""
Simple test script to verify the Book Recommendation System works correctly.
"""

import requests
import json
import time

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:5001"
    
    print("Testing Book Recommendation System API...")
    print("=" * 50)
    
    # Test 1: Get genres
    print("1. Testing /api/genres endpoint...")
    try:
        response = requests.get(f"{base_url}/api/genres")
        if response.status_code == 200:
            genres = response.json()['genres']
            print(f"   ✓ Success! Found {len(genres)} genres: {genres}")
        else:
            print(f"   ✗ Failed with status code: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # Test 2: Get all books
    print("\n2. Testing /api/books endpoint...")
    try:
        response = requests.get(f"{base_url}/api/books")
        if response.status_code == 200:
            books = response.json()['books']
            print(f"   ✓ Success! Found {len(books)} books")
            print(f"   Sample book: {books[0]['title']} by {books[0]['author']}")
        else:
            print(f"   ✗ Failed with status code: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # Test 3: Get recommendations
    print("\n3. Testing /api/recommend endpoint...")
    try:
        test_preferences = "I love mystery novels with complex characters and thrilling plots"
        payload = {
            "preferences": test_preferences,
            "num_recommendations": 3
        }
        response = requests.post(f"{base_url}/api/recommend", json=payload)
        if response.status_code == 200:
            recommendations = response.json()['recommendations']
            print(f"   ✓ Success! Got {len(recommendations)} recommendations")
            for i, book in enumerate(recommendations, 1):
                print(f"   {i}. {book['title']} (Match: {book['similarity_score']:.2f})")
        else:
            print(f"   ✗ Failed with status code: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    # Test 4: Filter books by genre
    print("\n4. Testing filtered books endpoint...")
    try:
        response = requests.get(f"{base_url}/api/books?genre=Fantasy")
        if response.status_code == 200:
            books = response.json()['books']
            print(f"   ✓ Success! Found {len(books)} Fantasy books")
            for book in books:
                print(f"   - {book['title']} by {book['author']}")
        else:
            print(f"   ✗ Failed with status code: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Error: {e}")
    
    print("\n" + "=" * 50)
    print("API testing completed!")

if __name__ == "__main__":
    print("Waiting for Flask app to start...")
    time.sleep(5)  # Give the app time to start
    test_api_endpoints()
