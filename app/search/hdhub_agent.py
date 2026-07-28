import json
import os
import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# 📁 Configuration Paths & Keys
JSON_FILE_PATH = "data/telegramlink.json"
TARGET_URL = "https://new3.hdhub4u.cl/"

# 🔑 Apni TMDB API Key yahan dalein (Agar aapke paas ho, warna ye blank bhi chalegi par ID match nahi hogi)
TMDB_API_KEY = "YOUR_TMDB_API_KEY_HERE" 

def get_tmdb_id_by_name(movie_title, year=""):
    """Movie ke naam aur year se automatically TMDB ID nikalne ka function"""
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        print("⚠️ Warning: TMDB API key nahi mili, isliye default ID use hogi.")
        return None
        
    search_url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={movie_title}"
    if year:
        search_url += f"&year={year}"
        
    try:
        response = requests.get(search_url, timeout=10)
        if response.status_code == 200:
            results = response.json().get("results")
            if results:
                # Sabse pehle match hone wali movie ki exact TMDB ID return karega
                return str(results[0]["id"])
    except Exception as e:
        print(f"❌ TMDB API Error: {e}")
        
    return None

def save_to_json(movie_id, telegram_link):
    """Extraction ke baad direct JSON database file update karne ka function"""
    data = {}
    if os.path.exists(JSON_FILE_PATH):
        try:
            with open(JSON_FILE_PATH, "r") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = {}
            
    # Database mein movie ID aur link save karna
    data[str(movie_id)] = telegram_link
    
    with open(JSON_FILE_PATH, "w") as f:
        json.dump(data, f, indent=4)
        
    print(f"💾 [Saved Successfully] Movie ID: {movie_id} -> Link: {telegram_link}")

def run_autonomous_agent():
    print("🤖 HDHub4u AI Autonomous Agent Started...")
    
    with sync_playwright() as p:
        # Headless=True rakha hai taaki background mein chupchap chale (False karne par browser dikhega)
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        
        try:
            print(f"🌐 Connecting to target site: {TARGET_URL}")
            page.goto(TARGET_URL, timeout=60000)
            page.wait_for_timeout(5000) # Cloudflare bypass aur page load hone ka wait
            
            html_content = page.content()
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Website ke posts/articles select karna
            posts = soup.select('div.post_guard, div.item, article')
            print(f"🔍 Found {len(posts)} items on the page. Processing...")
            
            processed_count = 0
            for post in posts:
                title_tag = post.find('a')
                if not title_tag:
                    continue
                    
                movie_title = title_tag.get_text(strip=True)
                movie_page_url = title_tag.get('href')
                
                if movie_title and movie_page_url:
                    print(f"\n🎬 Analyzing: {movie_title}")
                    
                    # 1. Movie ke naam se TMDB ID pata karna
                    # (Agar aapke paas API key nahi hai, toh agent sample ID use karega)
                    tmdb_id = get_tmdb_id_by_name(movie_title)
                    
                    if not tmdb_id:
                        # Fallback dummy ID agar API key configure na ho
                        tmdb_id = "999999" 
                        print(f"⚠️ Using fallback ID for testing: {tmdb_id}")
                    else:
                        print(f"✅ Matched TMDB ID: {tmdb_id}")
                    
                    # 2. Agent yahan se Hubcloud link extract karega (Ya apne channel format mein convert karega)
                    # Example format jo aapki website par direct chalega:
                    converted_telegram_link = f"https://hubcloud.cx/drive/sample_link_for_{tmdb_id}"
                    
                    # 3. JSON file mein automatic write kar dena
                    save_to_json(tmdb_id, converted_telegram_link)
                    
                    processed_count += 1
                    if processed_count >= 3: # Test ke liye abhi sirf pehli 3 movies process karega
                        break
                        
            print("\n✅ Agent Run Completed Successfully! Your JSON file is updated.")

        except Exception as e:
            print(f"❌ Critical Error in Agent: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run_autonomous_agent()