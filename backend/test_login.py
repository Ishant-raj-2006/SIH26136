import urllib.request
import urllib.parse
import json

url = "http://localhost:8001/api/auth/login"
data = json.dumps({"username": "government_user", "password": "Government@123"}).encode("utf-8")
headers = {"Content-Type": "application/json"}

req = urllib.request.Request(url, data=data, headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        print("STATUS:", response.status)
        print("BODY:", response.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("BODY:", e.read().decode("utf-8"))
except Exception as e:
    print("ERROR:", e)
