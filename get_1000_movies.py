import requests
import os

# TMDB API Key
TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a"
MOVIES_FILE = "movies.txt"

# Languages jo humein dhoondhni hain
LANGUAGES = {
    "Hollywood (English)": "en",
    "Bollywood (Hindi)": "hi",
    "South (Telugu)": "te",
    "South (Tamil)": "ta",
    "Korean Masterpieces": "ko"
}

def fetch_diverse_movies():
    print("="*60)
    print("🚀 Fetching Multi-Language Top Movies from TMDB...")
    print("="*60)
    
    movie_list = []
    
    # Har industry ki top 10 pages (200 movies) nikalenge
    for industry, lang_code in LANGUAGES.items():
        print(f"🎬 Downloading Top movies for: {industry}...")
        
        for page in range(1, 11): # Page 1 to 10
            url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_original_language={lang_code}&sort_by=popularity.desc&page={page}"
            response = requests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                for movie in data.get("results", []):
                    title = movie.get("title")
                    release_date = movie.get("release_date", "")
                    year = release_date.split("-")[0] if release_date else ""
                    
                    if year:
                        movie_list.append(f"{title} {year}")
                    else:
                        movie_list.append(title)
                        
    # Duplicate movies hatane ke liye
    movie_list = list(dict.fromkeys(movie_list))

    # Movies ko text file mein save karna
    with open(MOVIES_FILE, "w", encoding="utf-8") as f:
        for movie_name in movie_list:
            f.write(f"{movie_name}\n")
            
    print("="*60)
    print(f"🎉 BOOM! Total {len(movie_list)} diverse movies aapki '{MOVIES_FILE}' mein save ho gayi hain!")
    print("="*60)

if __name__ == "__main__":
    fetch_diverse_movies()