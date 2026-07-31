import os
import json
import time
import re
import cloudscraper
from bs4 import BeautifulSoup

# ================= Configuration =================
HDHUB4U_DOMAIN = "https://new3.hdhub4u.cl" 
JSON_FILE = "data/telegramlink.json"
MOVIES_FILE = "movies.txt"
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
    clean_name = re.sub(r'\(?\b(19\d{2}|20\d{2})\b\)?', '', movie_name).strip()
    return clean_name

def main():
    print("="*60)
    print("🕵️  ULTIMATE JASOOS BOT 10.0 (Ultra-Flexible Matcher) - STARTING!")
    print(f"🌐 Target Site: {HDHUB4U_DOMAIN}")
    print("="*60)
    
    if not os.path.exists(MOVIES_FILE):
        print(f"❌ '{MOVIES_FILE}' file nahi mili!")
        return
        
    with open(MOVIES_FILE, "r", encoding="utf-8") as f:
        movies_list = [line.strip() for line in f.readlines() if line.strip()]
        
    vault_data = load_json()
    added_count = 0

    scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False})
    
    for movie_name in movies_list:
        try:
            print(f"🔍 Processing: {movie_name}")
            
            safe_id = "movie_" + re.sub(r'[^a-zA-Z0-9]', '_', movie_name.lower())
            
            if safe_id in vault_data:
                print(f"  ⚡ Pehle se Vault mein hai: {movie_name}\n")
                continue
                
            clean_name = get_clean_name(movie_name)
            
            # स्मार्ट सर्च क्वेरीज़ बनाएंगे
            search_queries = [clean_name.replace(' ', '+')]
            words = [w.lower() for w in clean_name.split() if len(w) > 2] # सिर्फ 2 से बड़े काम के शब्द लेंगे
            
            if len(words) > 0:
                search_queries.append(words[0])
            if len(words) > 1:
                search_queries.append(f"{words[0]}+{words[1]}")

            movie_link = None
            
            for query in search_queries:
                search_url = f"{HDHUB4U_DOMAIN}/?s={query}"
                response = scraper.get(search_url, timeout=12)
                
                if response.status_code != 200:
                    continue

                soup = BeautifulSoup(response.text, 'html.parser')
                all_links = soup.find_all('a', href=True)
                
                found = False
                for a_tag in all_links:
                    href = a_tag['href']
                    lower_href = href.lower()
                    
                    # फालतू लिंक्स को इग्नोर करो
                    ignore_list = ['/search/', '/category/', '/tag/', '/page/', '/author/', '/genre/', '/year/', 'wp-', 'telegram', 'whatsapp']
                    if any(ignore in lower_href for ignore in ignore_list):
                        continue
                    
                    # 🔥 ULTRA-FLEXIBLE MATCHING: 
                    # अगर मूवी के नाम के कम से कम 2 बड़े शब्द लिंक में मौजूद हैं, तो इसे असली मूवी लिंक मान लो!
                    matched_words_count = 0
                    for w in words:
                        if w in lower_href:
                            matched_words_count += 1
                    
                    # अगर नाम में 2 से ज़्यादा शब्द हैं और कम से कम 2 मैच हो गए, या छोटा नाम है और 1 मैच हो गया
                    threshold = 2 if len(words) >= 2 else 1
                    if matched_words_count >= threshold:
                        if href.startswith('/'):
                            movie_link = f"{HDHUB4U_DOMAIN.rstrip('/')}{href}"
                        else:
                            movie_link = href
                        found = True
                        break
                
                if found:
                    break
                
                time.sleep(1)

            if movie_link:
                vault_data[safe_id] = movie_link
                save_json(vault_data)
                added_count += 1
                print("  ✅ SUCCESS:")
                print(f"  🔗 Link: {movie_link}\n")
            else:
                print("  ❌ FAILED: Site par link nahi mili.\n")
                
            time.sleep(1.5) 
            
        except Exception as e:
            print(f"  ❌ Error: {str(e)}\n")
            time.sleep(2)
            continue 

    print("="*60)
    print(f"🎉 MISSION COMPLETE! Total {added_count} nayi movies add hui.")
    print("="*60)

if __name__ == "__main__":
    main()