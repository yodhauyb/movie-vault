import json
import os

json_path = "data/telegramlink.json"

if os.path.exists(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"JSON mein error hai: {e}")
            exit()
            
    # Sabse upar Spider-Man ko add karna
    new_data = {"Spider-Man Brand New Day": "https://hubcloud.cx/drive/mck1klxb1mlgxkr"}
    
    # Baaki purani movies ko wapas add karna
    for k, v in data.items():
        if k != "Spider-Man Brand New Day":
            new_data[k] = v
            
    # Wapas clean JSON save karna
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(new_data, f, indent=4)
        
    print("✅ JSON file successfully fix ho gayi aur Spider-Man top par add ho gaya!")
else:
    print("❌ file nahi mili!")