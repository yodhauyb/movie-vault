import json
import requests
import time

JSON_FILE = "data/telegramlink.json"
TMDB_API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"

def fix_posters_by_id():
    try:
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    updated_data = {}
    total = len(data)
    print(f"Total movies found: {total}. Starting SUPER FAST TMDB ID sync...\n", flush=True)

    count = 0
    for key, val in data.items():
        count += 1
        link = val if isinstance(val, str) else val.get("link")
        clean_key = key.replace("movie_", "").strip()
        
        poster_url = None
        
        if clean_key.isdigit():
            try:
                # 5 second timeout लगा दिया है ताकि स्क्रिप्ट कभी अटके नहीं
                res = requests.get(f"https://api.themoviedb.org/3/movie/{clean_key}?api_key={TMDB_API_KEY}", timeout=5)
                res_data = res.json()
                poster_path = res_data.get("poster_path")
                if poster_path:
                    poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
                    print(f"[{count}/{total}] ✅ ID Found: {clean_key}", flush=True)
                else:
                    print(f"[{count}/{total}] ⚠️ ID No Poster: {clean_key}", flush=True)
            except Exception as e:
                print(f"[{count}/{total}] ❌ Error ID: {clean_key} | वजह: {e}", flush=True)
        else:
            try:
                query_name = clean_key.replace("_", " ")
                res = requests.get(f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={requests.utils.quote(query_name)}", timeout=5)
                res_data = res.json()
                results = res_data.get("results", [])
                if results and results[0].get("poster_path"):
                    poster_url = f"https://image.tmdb.org/t/p/w500{results[0].get('poster_path')}"
                    print(f"[{count}/{total}] ✅ Name Found: {query_name}", flush=True)
                else:
                    print(f"[{count}/{total}] ⚠️ Name Not Found: {query_name}", flush=True)
            except Exception as e:
                print(f"[{count}/{total}] ❌ Timeout/Error Name: {clean_key}", flush=True)

        updated_data[key] = {
            "link": link,
            "poster": poster_url if poster_url else (val.get("poster") if isinstance(val, dict) else None)
        }
        
        # हर 100 मूवी के बाद डेटा सेव कर देगा ताकि कुछ भी लॉस न हो
        if count % 100 == 0:
            with open(JSON_FILE, "w", encoding="utf-8") as f:
                json.dump(updated_data, f, indent=4, ensure_ascii=False)
            print(f"💾 Auto-Saved Progress at {count} movies...", flush=True)

        time.sleep(0.1)

    # फाइनल सेव
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(updated_data, f, indent=4, ensure_ascii=False)
    
    print("\n✨ All posters successfully synced and saved via TMDB!", flush=True)

if __name__ == "__main__":
    fix_posters_by_id()