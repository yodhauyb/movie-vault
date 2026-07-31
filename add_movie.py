import json
import requests
os = None # if needed

def get_tmdb_poster(title):
    # TMDB API Key जो हम पहले से यूज़ कर रहे हैं
    api_key = "3fd2be6f0c70a2a598f084ddfb75487c"
    url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={requests.utils.quote(title)}"
    
    try:
        response = requests.get(url)
        data = response.json()
        if data.get("results") and len(data["results"]) > 0:
            poster_path = data["results"][0].get("poster_path")
            if poster_path:
                return f"https://image.tmdb.org/t/p/w500{poster_path}"
    except Exception as e:
        print(f"Error fetching poster for {title}: {e}")
    
    return None

# जब तू अपनी स्क्रिप्ट से मूवी जोड़ेगा, तो अब डेटा इस फॉर्मेट में सेव होगा:
# {
#   "movie_name": {
#       "link": "hubcloud_or_telegram_link",
#       "poster": "https://image.tmdb.org/t/p/w500/..."
#   }
# }