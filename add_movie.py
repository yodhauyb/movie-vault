import os
import json
import time
import re
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# ================= Configuration =================
# ================= Configuration =================
TMDB_API_KEY = "f7ab0059bfd1e541fa8b3fb3d709517a"
HDHUB4U_DOMAIN = "https://new3.hdhub4u.cl"
JSON_FILE = "data/telegramlink.json"
MOVIES_FILE = "movies.txt"
# =================================================
# =================================================

def load_json():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except:
                return {}
    return {}

def save_json(data):
    os.makedirs(os.path.dirname(JSON_FILE), exist_ok=True)
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def get_clean_name(movie_name):
    # Saal aur brackets hatane ka smart logic taaki KGF aur RRR jaise naam TMDB pe mil jayein
    clean_name = re.sub(r'\(?\b(19\d{2}|20\d{2})\b\)?', '', movie_name).strip()
    return clean_name

def get_tmdb_id(movie_name):
    clean_name = get_clean_name(movie_name)
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={clean_name}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            results = response.json().get("results", [])
            if results:
                return f"movie_{results[0]['id']}"
    except Exception:
        pass
    return None

def main():
    print("="*60)
    print("🕵️  ULTIMATE JASOOS BOT 2.0 - STARTING MISSION!")
    print(f"🌐 Target Site: {HDHUB4U_DOMAIN}")
    print("="*60)
    
    if not os.path.exists(MOVIES_FILE):
        print(f"❌ '{MOVIES_FILE}' file nahi mili! Pehle get_1000_movies.py run karo.")
        return
        
    with open(MOVIES_FILE, "r", encoding="utf-8") as f:
        movies_list = [line.strip() for line in f.readlines() if line.strip()]
        
    vault_data = load_json()
    added_count = 0

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.page_load_strategy = 'eager'
    
    print("🚀 Firing up 'Chrome for Testing'... (Ab fatafat khulega!)\n")
    
    try:
        # Standard Selenium 4 implementation (Bina kisi extra manager library ke)
        driver = webdriver.Chrome(options=options)
    except Exception as e:
        print(f"❌ Chrome Driver start hone mein error: {e}")
        return
        
    for movie_name in movies_list:
        try:
            print(f"🔍 Processing: {movie_name}")
            
            tmdb_id = get_tmdb_id(movie_name)
            
            if not tmdb_id:
                print(f"  ❌ TMDB par nahi mili: {movie_name}\n")
                continue
                
            if tmdb_id in vault_data:
                print(f"  ⚡ Pehle se Vault mein maujood hai: {movie_name}\n")
                continue
                
            search_query = get_clean_name(movie_name).replace(' ', '+')
            search_url = f"{HDHUB4U_DOMAIN}/search/{search_query}"
            
            driver.set_page_load_timeout(30)
            driver.get(search_url)
            
            links = driver.find_elements(By.TAG_NAME, "a")
            movie_link = None
            for link in links:
                href = link.get_attribute("href")
                if href and "/search/" not in href and search_query.split('+')[0].lower() in href.lower():
                    movie_link = href
                    break
                    
            if movie_link:
                vault_data[tmdb_id] = movie_link
                save_json(vault_data)
                added_count += 1
                print("  ✅ SUCCESS:")
                print(f"  🔗 Link: {movie_link}\n")
            else:
                print("  ❌ FAILED: HDHub4u par valid link nahi mili\n")
                
            time.sleep(2)
            
        except Exception as e:
            # Bot ko marne se bachane wala 'continue' block
            print(f"  ❌ Error aayi '{movie_name}' par, but bot rukega nahi! Agli movie pe jaa raha hoon...")
            time.sleep(3)
            continue 

    driver.quit()
    print("="*60)
    print(f"🎉 MISSION COMPLETE! Total {added_count} nayi movies aapke Vault mein add hui.")
    print("="*60)

if __name__ == "__main__":
    main()