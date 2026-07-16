from abc import ABC, abstractmethod
from typing import Optional
import urllib.request
import json

class BaseProvider(ABC):
    @abstractmethod
    def generate(
        self,
        prompt: str,
        model: str,
        api_key: str,
        base_url: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        system_prompt: Optional[str] = None
    ) -> dict:
        pass

    def _post_json(self, url: str, headers: dict, data: dict, timeout: int = 30) -> dict:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8")
            try:
                error_json = json.loads(error_body)
                error_msg = error_json.get("error", {}).get("message", error_body)
            except Exception:
                error_msg = error_body
            raise Exception(f"API Error ({e.code}): {error_msg}")
        except Exception as e:
            raise Exception(f"Request failed: {str(e)}")
