from app.features.ai.providers.base import BaseProvider
from app.features.ai.providers.openai import OpenAIProvider
from app.features.ai.providers.groq import GroqProvider
from app.features.ai.providers.gemini import GeminiProvider
from app.features.ai.providers.anthropic import AnthropicProvider
from app.features.ai.providers.ollama import OllamaProvider
from app.features.ai.providers.openrouter import OpenRouterProvider

class AIFactory:
    @staticmethod
    def get_provider(provider_name: str) -> BaseProvider:
        name = provider_name.lower().strip()
        if name == "openai":
            return OpenAIProvider()
        elif name == "groq":
            return GroqProvider()
        elif name == "gemini":
            return GeminiProvider()
        elif name == "anthropic":
            return AnthropicProvider()
        elif name == "ollama":
            return OllamaProvider()
        elif name == "openrouter":
            return OpenRouterProvider()
        else:
            raise ValueError(f"Unsupported AI provider: {provider_name}")
