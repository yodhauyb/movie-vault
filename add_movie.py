import argparse
import json
import os
import re
import time
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# 📁 SMART Path setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
JSON_FILE_PATH = os.path.join(BASE_DIR, "data", "telegramlink.json")

def get_tmdb_id_by_name(movie_title, silent=False):
    if not silent:
        print(f"🧠 TMDB par '{movie_title}' ki ID search ki ja rahi hai...")
    
    search_url = f"https://www.themoviedb.org/search/movie?query={movie_title.replace(' ', '+')}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }
    
    try:
        response = requests.get(search_url, headers=headers, timeout=12)
        if response.status_code != 200:
            return None
            
        html = response.text
        section = html.split('id="movie_results"')[1] if 'id="movie_results"' in html else html
        chunks = section.split('comp:media-card')[1:]
        
        for chunk in chunks[:3]:
            id_match = re.search(r'href="/movie/(\d+)', chunk)
            if id_match:
                return id_match.group(1)
    except Exception:
        pass
        
    return None

def save_to_json(movie_id, telegram_link):
    data = {}
    data_folder = os.path.join(BASE_DIR, "data")
    os.makedirs(data_folder, exist_ok=True) 
    
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, "r") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = {}
            
    data[str(movie_id)] = telegram_link
    
    with open(JSON_FILE_PATH, "w") as f:
        json.dump(data, f, indent=4)

def process_single_movie(movie_title, page, is_json_mode):
    result = {"title": movie_title, "status": "failed", "tmdb_id": None, "link": None, "error": None}
    
    if not is_json_mode:
        print(f"\n{'='*50}\n🚀 Processing: {movie_title}\n{'='*50}")

    try:
        # STEP 1: TMDB
        tmdb_id = get_tmdb_id_by_name(movie_title, silent=is_json_mode)
        if not tmdb_id:
            if not is_json_mode: print("❌ TMDB ID nahi mili. Skipping.")
            result["error"] = "TMDB ID not found"
            return result
            
        result["tmdb_id"] = tmdb_id
        if not is_json_mode: print(f"✅ TMDB ID: {tmdb_id}")

        # STEP 2: HDHub4u
        base_domain = "https://new3.hdhub4u.cl"
        search_url = f"{base_domain}/?s={movie_title.replace(' ', '+')}"
        if not is_json_mode: print(f"🌐 Searching: {search_url}")
        
        # Timeout aur wait wapas normal kar diya Cloudflare bypass ke liye
        page.goto(search_url, timeout=60000) 
        page.wait_for_timeout(5000) 
        
        movie_post_url = None
        if "?s=" not in page.url and movie_title.lower() in page.url.lower():
            movie_post_url = page.url
        else:
            soup = BeautifulSoup(page.content(), 'html.parser')
            for post in soup.find_all('a', href=True):
                url = post['href']
                if "catimages" in url or url.endswith(('.jpg', '.png')) or "/tag/" in url or "?s=" in url:
                    continue
                    
                text = post.get_text(strip=True).lower()
                title_attr = post.get('title', '').lower()
                alt_attr = post.find('img').get('alt', '').lower() if post.find('img') else ""
                
                combined_data = f"{text} {title_attr} {alt_attr} {url.lower()}"
                
                if movie_title.lower() in combined_data:
                    movie_post_url = url
                    if not movie_post_url.startswith("http"):
                        parsed_uri = urlparse(page.url)
                        movie_post_url = f"{parsed_uri.scheme}://{parsed_uri.netloc}{movie_post_url}"
                    break
        
        if not movie_post_url:
            if not is_json_mode: print("⚠️ Movie page not found on HDHub4u.")
            result["error"] = "Movie not on HDHub4u"
            return result

        if not is_json_mode: print(f"🔍 Extracting Hubcloud link...")
        page.goto(movie_post_url, timeout=60000)
        page.wait_for_timeout(5000)
        
        soup = BeautifulSoup(page.content(), 'html.parser')
        real_hubcloud_link = None
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            text = link.get_text(strip=True).lower()
            if "hubcloud" in text or "drive" in text or "hubcloud" in href:
                if href != movie_post_url and not href.startswith('#'):
                    real_hubcloud_link = href
                    break
        
        final_link = real_hubcloud_link if real_hubcloud_link else movie_post_url
        
        # STEP 3: Save Data
        save_to_json(tmdb_id, final_link)
        
        result["status"] = "success"
        result["link"] = final_link
        if not is_json_mode: print(f"💾 [Saved] {tmdb_id} -> {final_link}")
        
    except Exception as e:
        result["error"] = str(e)
        if not is_json_mode: print(f"❌ Error: {e}")
        
    return result

def main():
    parser = argparse.ArgumentParser(description="Autonomous Movie Agent")
    parser.add_argument("movies", nargs="*", help="Movie names to search")
    parser.add_argument("--file", type=str, help="Path to a text file")
    parser.add_argument("--json", action="store_true", help="JSON output")
    args = parser.parse_args()

    movie_list = []
    if args.movies:
        movie_list.extend(args.movies)
    if args.file:
        try:
            with open(args.file, "r") as f:
                movies_from_file = [line.strip() for line in f.readlines() if line.strip()]
                movie_list.extend(movies_from_file)
        except Exception as e:
            if not args.json: print(f"❌ File read error: {e}")
            return

    if not movie_list:
        if not args.json: print("⚠️ Koi movie name nahi diya gaya.")
        return

    results = []

    with sync_playwright() as p:
        # 🛑 Cloudflare Fix: headless ko False kar diya
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        for i, movie in enumerate(movie_list):
            res = process_single_movie(movie, page, args.json)
            results.append(res)
            
            if i < len(movie_list) - 1:
                # Anti-ban sleep wapas 5 seconds kiya hai taaki safe rahe
                if not args.json: print("⏳ Anti-ban wait (5 sec)...")
                time.sleep(5)
                
        browser.close()

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print("\n🎉 Bulk Processing Complete!")
        success_count = sum(1 for r in results if r['status'] == 'success')
        print(f"📊 Stats: {success_count}/{len(movie_list)} movies saved successfully.")

if __name__ == "__main__":
    main()