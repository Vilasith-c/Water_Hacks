from typing import Optional
from app.features.ai.providers.openai import OpenAIProvider

class OllamaProvider(OpenAIProvider):
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
        url = base_url or "http://localhost:11434/v1"
        key = api_key or "ollama"
        return super().generate(
            prompt=prompt,
            model=model,
            api_key=key,
            base_url=url,
            temperature=temperature,
            max_tokens=max_tokens,
            system_prompt=system_prompt
        )
