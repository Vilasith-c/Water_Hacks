from typing import Optional
from app.features.ai.providers.base import BaseProvider

class AnthropicProvider(BaseProvider):
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
        url = base_url or "https://api.anthropic.com/v1/messages"
        
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        data = {
            "model": model or "claude-3-5-sonnet-20241022",
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        
        if system_prompt:
            data["system"] = system_prompt
            
        res = self._post_json(url, headers, data)
        content_parts = res.get("content", [])
        if not content_parts:
            raise Exception("Invalid Anthropic response structure: empty content")
            
        content = content_parts[0].get("text", "")
        usage = res.get("usage", {})
        tokens = usage.get("input_tokens", 0) + usage.get("output_tokens", 0)
        
        return {
            "content": content,
            "tokens": tokens
        }
