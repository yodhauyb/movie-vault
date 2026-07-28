import requests

# Aapki TMDB API Key
TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a"

def fetch_hdhub_style_movies():
    # 1 March 2026 se lekar aaj tak ki Indian release movies, popularity ke hisaab se
    url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_origin_country=IN&primary_release_date.gte=2026-03-01&sort_by=popularity.desc"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            movies = data.get("results", [])
            
            print(f"--- HDHub4u Style: Total {len(movies)} Latest Movies Found (March 2026 Onwards) ---")
            for index, movie in enumerate(movies, start=1):
                title = movie.get("title") or movie.get("original_title")
                release_date = movie.get("release_date", "N/A")
                movie_id = movie.get("id")
                
                # HDHub4u jaisa clean format print hoga
                print(f"{index}. Title: {title} | Released: {release_date} | TMDB ID: {movie_id}")
                
            return movies
        else:
            print(f"Failed to fetch data, status code: {response.status_code}")
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == "__main__":
    fetch_hdhub_style_movies()