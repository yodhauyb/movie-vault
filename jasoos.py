import time
import os
import subprocess
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MOVIES_TXT_PATH = os.path.join(BASE_DIR, "movies.txt")
ADD_MOVIE_SCRIPT = os.path.join(BASE_DIR, "add_movie.py")

def master_ai_agent_loop():
    print("🤖 [Master AI Agent & Auto-Healer Initialized]")
    print("🛡️ Monitoring website integrity, database, and auto-fetching new releases...")
    
    while True:
        try:
            # 1. Check if movies.txt has new items to process automatically
            if os.path.exists(MOVIES_TXT_PATH):
                with open(MOVIES_TXT_PATH, "r") as f:
                    lines = [line.strip() for line in f.readlines() if line.strip()]
                
                if lines:
                    print(f"\n🧠 [AI Agent] Found {len(lines)} titles in queue. Processing autonomously...")
                    subprocess.run(["python3", ADD_MOVIE_SCRIPT, "--file", "movies.txt"], check=True)
                    
                    # Clear file after processing
                    open(MOVIES_TXT_PATH, "w").close()
                    print("✅ [AI Agent] Queue processed and deployed successfully.")
            
            # 2. Health check of local server / app
            response = requests.get("http://localhost:3000", timeout=5)
            if response.status_code == 200:
                print("🟢 [Auto-Healer] Website status: HEALTHY (Online)")
            else:
                print("⚠️ [Auto-Healer] Warning: Website responding with code:", response.status_code)
                
        except Exception as e:
            print(f"🛠️ [Auto-Healer Recovery] Handled minor glitch/server offline: {e}")
            
        # Run auto-check every 5 minutes
        time.sleep(300)

if __name__ == "__main__":
    master_ai_agent_loop()