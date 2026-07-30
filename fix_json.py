import json
import os

# Aapki JSON file ka raasta
file_path = "data/telegramlink.json"

def clean_vault():
    print("🧹 Safai shuru ho rahi hai...")
    
    if not os.path.exists(file_path):
        print("❌ telegramlink.json file nahi mili!")
        return

    # Data read karna
    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except:
            print("❌ JSON file corrupt hai.")
            return

    clean_data = {}
    removed_count = 0

    # Saare links check karna
    for key, url in data.items():
        # Agar link mein google.com hai, toh usko chhod do
        if "google.com/search" in url:
            removed_count += 1
        else:
            # Asli links ko bacha lo
            clean_data[key] = url

    # Saaf kiya hua data wapas save karna
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(clean_data, f, indent=4)

    print("-" * 40)
    print(f"🗑️ KACHRA SAAF: {removed_count} ghalat Google links delete kar diye gaye!")
    print(f"✅ ASLI MOVIES BACHI: {len(clean_data)} valid links abhi bhi vault mein hain.")
    print("-" * 40)

if __name__ == "__main__":
    clean_vault()