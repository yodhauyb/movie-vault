import sys
import json
import requests
import re
import os

# 🔥 1. यहाँ अपनी TMDB API Key डाल (https://www.themoviedb.org/ से फ्री में मिलेगी)
API_KEY = "YOUR_TMDB_API_KEY_HERE"
JSON_PATH = "data/telegramlink.json"

def search_and_add_movie(query):
    print(f"\n🎬 '{query}' को TMDB (मूवी/शो) पर ढूँढ रहा हूँ...")
    
    # 🚀 'search/multi' यूज़ कर रहे हैं ताकि शो और मूवी दोनों मिलें
    url = f"https://api.themoviedb.org/3/search/multi?api_key={API_KEY}&query={query}&language=en-US&page=1&include_adult=false"
    
    try:
        response = requests.get(url)
        # अगर API की सही नहीं है तो यहाँ एरर आएगा
        if response.status_code != 200:
            print(f"❌ TMDB API एरर! स्टेटस कोड: {response.status_code}")
            print("   चेक करो कि तुमने 'API_KEY' की जगह अपनी असली चाबी डाली है या नहीं।")
            return

        data = response.json()
        results = data.get('results', [])
        
        # सिर्फ़ मूवीज़ और टीवी शोज़ को ही फिल्टर करना (इंसानों को नहीं)
        valid_results = [r for r in results if r.get('media_type') in ['movie', 'tv']]

        if not valid_results:
            print("❌ कोई मूवी या शो नहीं मिला! नाम की स्पेलिंग चेक करो भाई।")
            return

        # सबसे पहला (Top) सही रिजल्ट उठाना
        movie = valid_results[0]
        media_type = movie.get('media_type') # 'movie' या 'tv'

        # मूवी और शो के डेटा में फर्क होता है
        if media_type == 'movie':
            raw_title = movie.get('title', 'Unknown')
            year = movie.get('release_date', 'Unknown')[:4]
        else: # टीवी शो के लिए
            raw_title = movie.get('name', 'Unknown')
            year = movie.get('first_air_date', 'Unknown')[:4]
        
        # नाम को साफ करके JSON Key बनाना
        clean_title = re.sub(r'[^a-zA-Z0-9\s]', '', raw_title).lower().replace(' ', '_')
        key = f"movie_{clean_title}"
        if media_type == 'tv': key += "_show" # शो के लिए key अलग रखना

        # बाकी डिटेल्स
        poster_path = movie.get('poster_path')
        poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else ""
        rating = movie.get('vote_average', 0)

        # JSON फाइल को लोड करना
        if os.path.exists(JSON_PATH):
            with open(JSON_PATH, 'r', encoding='utf-8') as f:
                try:
                    vault_data = json.load(f)
                except json.JSONDecodeError:
                    vault_data = {}
        else:
            vault_data = {}

        # डेटा अपडेट करना
        vault_data[key] = {
            "link": "YAHAN_APNA_HUBCLOUD_LINK_DAAL_DENA",
            "poster": poster_url,
            "year": year,
            "rating": round(rating, 1)
        }

        # JSON फाइल में सेव करना
        with open(JSON_PATH, 'w', encoding='utf-8') as f:
            json.dump(vault_data, f, indent=4, ensure_ascii=False)
            
        print(f"✅ कमाल हो गया भाई! '{raw_title}' ({year}) ({media_type}) का डेटा JSON फाइल में ऐड हो गया है।")
        print("👉 अब 'telegramlink.json' फाइल खोलो और 'YAHAN_APNA_HUBCLOUD_LINK_DAAL_DENA' को हटाकर अपना Hubcloud लिंक डाल दो!\n")

    except Exception as e:
        print(f"❌ कुछ एरर आ गया भाई: {e}")

# 🔥 यह हिस्सा टर्मिनल से कमांड लेने के लिए है
if __name__ == "__main__":
    if len(sys.argv) > 1:
        movie_name = " ".join(sys.argv[1:])
        search_and_add_movie(movie_name)
    else:
        movie_name = input("🍿 कौन सी मूवी/शो ऐड करनी है? नाम बताओ: ")
        search_and_add_movie(movie_name)