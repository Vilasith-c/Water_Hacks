from typing import Optional
from app.features.ai.providers.base import BaseProvider

class OpenAIProvider(BaseProvider):
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
        url = base_url or "https://api.openai.com/v1"
        url = f"{url.rstrip('/')}/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        res = self._post_json(url, headers, data)
        choices = res.get("choices", [])
        if not choices:
            raise Exception("Invalid OpenAI response structure: empty choices")
            
        content = choices[0].get("message", {}).get("content", "")
        tokens = res.get("usage", {}).get("total_tokens", 0)
        
        return {
            "content": content,
            "tokens": tokens
        }
