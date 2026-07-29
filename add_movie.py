import argparse
import json
import os
import time
import requests
import subprocess
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
JSON_FILE_PATH = os.path.join(BASE_DIR, "data", "telegramlink.json")
FAILED_LOG_PATH = os.path.join(BASE_DIR, "failed_movies.txt")
TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a" 

def get_existing_ids():
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, "r") as f:
                return set(json.load(f).keys())
        except json.JSONDecodeError:
            return set()
    return set()

def get_tmdb_info(title, silent=False):
    if not silent:
        print(f"🧠 TMDB API par '{title}' search ki ja rahi hai...")
    
    url = f"https://api.themoviedb.org/3/search/multi?api_key={TMDB_API_KEY}&query={title.replace(' ', '+')}&language=en-US"
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('results'):
                for item in data['results']:
                    if item['media_type'] in ['movie', 'tv']:
                        return str(item['id']), item['media_type']
    except Exception as e:
        if not silent: print(f"⚠️ TMDB API Error: {e}")
        
    return None, None

def save_to_json(prefixed_id, final_link):
    data = {}
    data_folder = os.path.join(BASE_DIR, "data")
    os.makedirs(data_folder, exist_ok=True) 
    
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, "r") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            pass
            
    data[prefixed_id] = final_link
    
    with open(JSON_FILE_PATH, "w") as f:
        json.dump(data, f, indent=4)

def auto_deploy_to_vercel():
    print("\n🚀 Uploading changes to GitHub / Vercel...")
    try:
        subprocess.run(["git", "add", JSON_FILE_PATH], check=True, stdout=subprocess.DEVNULL)
        subprocess.run(["git", "commit", "-m", "🤖 Updated all seasons links"], check=True, stdout=subprocess.DEVNULL)
        subprocess.run(["git", "push"], check=True, stdout=subprocess.DEVNULL)
        print("✅ Successfully deployed! Website par live ho gayi hai.")
    except Exception:
        print("⚠️ Auto-deploy fail ho gaya.")

def process_single_title(title, page, existing_ids, is_json_mode):
    result = {"title": title, "status": "failed", "tmdb_id": None, "type": None, "link": None, "error": None}
    
    if not is_json_mode:
        print(f"\n{'='*50}\n🚀 Processing: {title}\n{'='*50}")

    try:
        tmdb_id, media_type = get_tmdb_info(title, silent=is_json_mode)
        if not tmdb_id:
            if not is_json_mode: print("❌ TMDB ID nahi mili. Skipping.")
            result["error"] = "TMDB ID not found"
            return result
            
        prefixed_id = f"{media_type}_{tmdb_id}"
        result["tmdb_id"] = tmdb_id
        result["type"] = media_type
        
        if not is_json_mode: 
            print(f"✅ Found {media_type.upper()} | ID: {prefixed_id}")

        base_domain = "https://new3.hdhub4u.cl"
        search_url = f"{base_domain}/?s={title.replace(' ', '+')}"
        if not is_json_mode: print(f"🌐 Searching HDHub4u: {search_url}")
        
        page.goto(search_url, timeout=60000, wait_until="domcontentloaded") 
        page.wait_for_timeout(3000) 
        
        matching_posts = []
        soup = BeautifulSoup(page.content(), 'html.parser')
        
        # 🎯 SAare seasons ke posts ko catch karega (Jaise Squid Game S1, S2 dono)
        for post in soup.find_all('a', href=True):
            url = post['href']
            if any(x in url for x in ['catimages', '.jpg', '.png', '/tag/', '?s=']):
                continue
                
            text = post.get_text(strip=True).lower()
            title_attr = post.get('title', '').lower()
            
            # Agar naam match kar raha hai
            if title.lower() in text or title.lower() in title_attr:
                if not url.startswith("http"):
                    parsed_uri = urlparse(page.url)
                    url = f"{parsed_uri.scheme}://{parsed_uri.netloc}{url}"
                if url not in matching_posts:
                    matching_posts.append(url)

        if not matching_posts:
            if not is_json_mode: print("⚠️ Not found on HDHub4u.")
            result["error"] = "Not on HDHub4u"
            return result

        if not is_json_mode: print(f"🔍 Found {len(matching_posts)} matching posts (Seasons/Prints). Extracting links...")
        
        all_hubcloud_links = []
        
        # Har ek post (Season 1, Season 2) ke andar jayega aur wahan se Hubcloud link nikalega
        for post_url in matching_posts:
            try:
                page.goto(post_url, timeout=45000, wait_until="domcontentloaded")
                page.wait_for_timeout(2000)
                
                post_soup = BeautifulSoup(page.content(), 'html.parser')
                for link in post_soup.find_all('a', href=True):
                    href = link['href']
                    link_text = link.get_text(strip=True).lower()
                    
                    if "hubcloud" in link_text or "drive" in link_text or "hubcloud" in href or "download" in link_text:
                        if href != post_url and not href.startswith('#'):
                            if href not in all_hubcloud_links:
                                all_hubcloud_links.append(href)
            except Exception:
                continue # Agar koi post slow ho toh agle par chala jayega
                            
        # Agar Hubcloud links nahi mile toh direct post ke links hi daal do
        final_links_pool = all_hubcloud_links if all_hubcloud_links else matching_posts
        
        # Sabhi links ko ' | ' se jod denge taaki website par alag-alag buttons ban sakein
        final_link = " | ".join(final_links_pool)
            
        save_to_json(prefixed_id, final_link)
        existing_ids.add(prefixed_id) 
        
        result["status"] = "success"
        result["link"] = final_link
        if not is_json_mode: print(f"💾 [Saved] {prefixed_id} -> {len(final_links_pool)} Total Download/Season Links Saved!")
        
    except Exception as e:
        result["error"] = str(e)
        if not is_json_mode: print(f"❌ Error: {e}")
        
    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("movies", nargs="*", help="Movie/Series names")
    parser.add_argument("--file", type=str)
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--no-deploy", action="store_true")
    args = parser.parse_args()

    title_list = []
    if args.movies:
        title_list.extend(args.movies)
    if args.file:
        try:
            with open(args.file, "r") as f:
                title_list.extend([line.strip() for line in f.readlines() if line.strip()])
        except Exception as e:
            if not args.json: print(f"❌ File read error: {e}")
            return

    if not title_list:
        return

    results = []
    failed_titles = []
    existing_ids = get_existing_ids()
    new_added = False

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()

        for i, title in enumerate(title_list):
            res = process_single_title(title, page, existing_ids, args.json)
            results.append(res)
            
            if res["status"] == "success":
                new_added = True
            elif res["status"] == "failed":
                failed_titles.append(title)
            
            if res["status"] != "skipped" and i < len(title_list) - 1:
                time.sleep(3)
                
        browser.close()

    if failed_titles:
        with open(FAILED_LOG_PATH, "w") as f:
            for ft in failed_titles: f.write(f"{ft}\n")

    if not args.json:
        print("\n🎉 Bulk Processing Complete!")
        print(f"📊 Stats: {sum(1 for r in results if r['status'] == 'success')} added, {len(failed_titles)} failed.")
        if new_added and not args.no_deploy:
            auto_deploy_to_vercel()

if __name__ == "__main__":
    main()