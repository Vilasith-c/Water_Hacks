from typing import Optional
from app.features.ai.providers.base import BaseProvider

class GeminiProvider(BaseProvider):
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
        gemini_model = model or "gemini-2.5-flash"
        url = base_url or "https://generativelanguage.googleapis.com"
        url = f"{url.rstrip('/')}/v1beta/models/{gemini_model}:generateContent?key={api_key}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        
        if system_prompt:
            data["systemInstruction"] = {
                "parts": [
                    {"text": system_prompt}
                ]
            }
            
        res = self._post_json(url, headers, data)
        candidates = res.get("candidates", [])
        if not candidates:
            raise Exception("Invalid Gemini response structure: empty candidates")
            
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            raise Exception("Invalid Gemini response structure: empty content parts")
            
        content = parts[0].get("text", "")
        tokens = res.get("usageMetadata", {}).get("totalTokenCount", 0)
        
        return {
            "content": content,
            "tokens": tokens
        }
