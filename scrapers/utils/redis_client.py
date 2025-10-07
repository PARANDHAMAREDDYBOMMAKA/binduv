import json
import requests
from typing import Any, Optional
from config import REDIS_URL, REDIS_TOKEN


class RedisClient:
    """Simple Redis client using Upstash REST API"""

    def __init__(self):
        self.base_url = REDIS_URL.rstrip("/")
        self.headers = {"Authorization": f"Bearer {REDIS_TOKEN}"}

    def set(self, key: str, value: Any, ex: Optional[int] = None) -> bool:
        """Set a key-value pair in Redis with optional expiration"""
        try:
            data = json.dumps(value) if not isinstance(value, str) else value
            url = f"{self.base_url}/set/{key}"
            params = {}
            if ex:
                params["EX"] = ex

            response = requests.post(url, headers=self.headers, data=data, params=params)
            return response.status_code == 200
        except Exception as e:
            print(f"Redis SET error: {e}")
            return False

    def get(self, key: str) -> Optional[Any]:
        """Get a value from Redis by key"""
        try:
            url = f"{self.base_url}/get/{key}"
            response = requests.get(url, headers=self.headers)

            if response.status_code == 200:
                result = response.json().get("result")
                if result:
                    try:
                        return json.loads(result)
                    except json.JSONDecodeError:
                        return result
            return None
        except Exception as e:
            print(f"Redis GET error: {e}")
            return None

    def delete(self, key: str) -> bool:
        """Delete a key from Redis"""
        try:
            url = f"{self.base_url}/del/{key}"
            response = requests.post(url, headers=self.headers)
            return response.status_code == 200
        except Exception as e:
            print(f"Redis DELETE error: {e}")
            return False
