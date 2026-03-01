"""
ARIA Configuration - DEBUGGED VERSION
=======================================
This version:
1. Reads API key from .env file
2. Also checks environment variables directly
3. Prints confirmation that key was loaded (first 10 chars only)
4. Never exposes the full key in logs
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import ConfigDict


# Manually load .env file as backup
# This guarantees the key is read even if pydantic-settings has issues
def _load_env_manually():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, value = line.partition("=")
                    key = key.strip()
                    value = value.strip()
                    # Remove surrounding quotes if present
                    if value.startswith(('"', "'")) and value.endswith(('"', "'")):
                        value = value[1:-1]
                    os.environ.setdefault(key, value)

# Load .env manually first
_load_env_manually()


class Settings(BaseSettings):
    # Reads from environment / .env file
    anthropic_api_key: str = "not-set"

    # App settings
    app_name: str = "ARIA"
    debug: bool = True
    port: int = 8000

    # AI Model - works on ALL Anthropic accounts
    model_name: str = "claude-3-haiku-20240307"
    max_tokens: int = 2048

    # Agent settings
    agent_timeout_seconds: int = 60
    confidence_threshold: float = 0.85

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        protected_namespaces=('settings_',)
    )


settings = Settings()

# ── Startup Key Check ─────────────────────────────────────────
# Shows first 15 chars of key so you can confirm it loaded correctly
# Never prints the full key for security
key = settings.anthropic_api_key
if key == "not-set" or key == "your-anthropic-api-key-here":
    print("=" * 60)
    print("  ⚠️  WARNING: API key not found in .env file!")
    print("  Add your key to: backend/.env")
    print("  Format: ANTHROPIC_API_KEY=sk-ant-api03-xxxxx")
    print("  Running in SAMPLE DATA mode only.")
    print("=" * 60)
elif not key.startswith("sk-ant"):
    print("=" * 60)
    print("  ⚠️  WARNING: API key looks wrong!")
    print(f"  Key starts with: {key[:10]}...")
    print("  Expected format: sk-ant-api03-xxxxx")
    print("=" * 60)
else:
    print("=" * 60)
    print(f"  ✅ API Key loaded: {key[:15]}...{key[-4:]}")
    print(f"  ✅ Model: {settings.model_name}")
    print("=" * 60)
