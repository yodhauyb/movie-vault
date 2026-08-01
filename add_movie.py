import requests
import json
import re
import os

# 🔑 तेरा TMDB API Key
TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a"
JSON_FILE_PATH = "data/telegramlink.json"

def search_tmdb(query, media_type):
    url = f"https://api.themoviedb.org/3/search/{media_type}?api_key={TMDB_API_KEY}&query={query}&language=en-US"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('results', [])
    return []

def clean_title_for_key(title, media_type):
    # नाम को साफ़ करके JSON Key बनाना (e.g., Stranger Things Season 1 -> series_stranger_things_season_1)
    clean_name = re.sub(r'[^a-z0-9\s]', '', title.lower()).strip().replace(' ', '_')
    prefix = "series_" if media_type == 'tv' else "movie_"
    return f"{prefix}{clean_name}"

def main():
    print("========================================")
    print("🎬 MOVIE & WEB SERIES ADDER BOT 📺")
    print("========================================\n")
    
    # 1. पूछो क्या ऐड करना है?
    choice = input("👉 Kya add karna hai? (1 for Movie, 2 for Web Series): ").strip()
    if choice not in ['1', '2']:
        print("❌ Galat input! Please 1 ya 2 dabayein.")
        return
        
    media_type = 'tv' if choice == '2' else 'movie'
    type_str = 'series' if choice == '2' else 'movie'

    # 2. नाम पूछो (सिर्फ मेन नाम डालना है)
    search_query = input(f"\n🔍 {type_str.capitalize()} ka naam batao (e.g., Stranger Things): ").strip()
    
    print("\n⏳ TMDB par dhoondh raha hoon...")
    results = search_tmdb(search_query, media_type)
    
    if not results:
        print("❌ Kuch nahi mila! Spelling check karo ya TMDB par exist nahi karta.")
        return

    # 3. टॉप रिज़ल्ट्स दिखाओ
    print("\n✅ Ye results mile hain:")
    for i, item in enumerate(results[:5]): # Top 5 dikhayega
        title = item.get('title') if media_type == 'movie' else item.get('name')
        date = item.get('release_date') if media_type == 'movie' else item.get('first_air_date')
        year = date.split('-')[0] if date else "Unknown"
        print(f"   {i + 1}. {title} ({year})")
    
    # 4. सही रिज़ल्ट चुनो
    try:
        sel_idx = int(input("\n👉 Sahi number choose karo (1-5): ")) - 1
        if sel_idx < 0 or sel_idx >= len(results[:5]):
            raise ValueError
        selected = results[sel_idx]
    except ValueError:
        print("❌ Galat number. Script band ho rahi hai.")
        return

    # 5. असली नाम निकालो
    title = selected.get('title') if media_type == 'movie' else selected.get('name')
    
    # 🔥 6. यहाँ है तेरा सीज़न वाला असली जादू 🔥
    if media_type == 'tv':
        season_num = input(f"\n📺 Kaunsa season add karna hai? (Sirf number likho jaise '1' ya '2'. Agar poori series ka ek link hai toh direct ENTER daba do): ").strip()
        if season_num:
            title = f"{title} Season {season_num}"

    # 7. बाकी का डेटा निकालो
    date = selected.get('release_date') if media_type == 'movie' else selected.get('first_air_date')
    year = date.split('-')[0] if date else "2026"
    rating = round(selected.get('vote_average', 8.0), 1)
    overview = selected.get('overview', "No description available.")
    
    poster_path = selected.get('poster_path')
    poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

    print(f"\n✅ Poster, Rating, aur Details fetch ho gayi!")

    # 8. डाउनलोड लिंक पूछो
    download_link = input(f"\n🔗 '{title}' ka HDHub4u/Hubcloud download link paste karo: ").strip()

    # 9. JSON एंट्री बनाओ
    key = clean_title_for_key(title, media_type)
    new_entry = {
        "link": download_link,
        "poster": poster_url,
        "type": type_str,
        "year": year,
        "rating": rating,
        "description": overview
    }

    # 10. JSON फाइल में सेव करो
    if not os.path.exists(JSON_FILE_PATH):
        print(f"⚠️ {JSON_FILE_PATH} nahi mili, nayi file bana raha hoon.")
        data = {}
    else:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = {}

    data[key] = new_entry

    with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print("\n🎉 BOOM! 🚀")
    print(f"'{title}' successfully teri website par add ho gayi hai!")
    print(f"Key used: {key}")
    print("========================================\n")

if __name__ == "__main__":
    main()