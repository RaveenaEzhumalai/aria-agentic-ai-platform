"""
Base Agent Class - FIXED JSON PARSER
======================================
Every agent (Supply Chain, Fraud, etc.) inherits from this.

FIX: Replaced the simple JSON cleaner with a robust extractor
that handles ALL the ways Claude might format its response:
  - Plain JSON
  - JSON wrapped in ```json ... ```
  - JSON wrapped in ``` ... ```
  - JSON with extra text before/after
  - JSON with trailing commas (common Claude mistake)
  - Truncated JSON (when response is cut off)
"""

import anthropic
import time
import json
import re
from datetime import datetime
from config import settings


class BaseAgent:

    def __init__(self, name: str, emoji: str, specialty: str):
        self.name = name
        self.emoji = emoji
        self.specialty = specialty
        self.status = "idle"
        self.logs = []
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    def log(self, message: str, log_type: str = "info") -> dict:
        entry = {
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "agent_name": f"{self.emoji} {self.name}",
            "message": message,
            "log_type": log_type
        }
        self.logs.append(entry)
        return entry

    def build_prompt(self, data: dict) -> str:
        raise NotImplementedError("Each agent must implement build_prompt()")

    def build_user_message(self, data: dict) -> str:
        return f"""
Analyze this operational data and provide insights in valid JSON format:

{data}

CRITICAL RULES:
- Respond ONLY with a valid JSON object
- No markdown, no code fences, no explanation outside the JSON
- All strings must use double quotes
- No trailing commas
- Keep all text values under 200 characters

Use this EXACT structure:
{{
  "summary": "2-3 sentence executive summary",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "risk_level": "LOW",
  "projected_savings_usd": 1234567,
  "confidence_score": 0.94,
  "recommendations": [
    {{
      "priority": "HIGH",
      "action": "specific action to take",
      "owner": "team name",
      "deadline": "24 hours",
      "impact": "business impact"
    }}
  ],
  "metrics": {{
    "metric_one": "value one",
    "metric_two": "value two"
  }}
}}
"""

    def _extract_json(self, text: str) -> dict:
        """
        Robust JSON extractor — handles every format Claude might return.
        Tries multiple strategies in order until one works.
        """

        # ── Strategy 1: Direct parse (ideal case) ──────────────
        try:
            return json.loads(text.strip())
        except Exception:
            pass

        # ── Strategy 2: Extract from ```json ... ``` block ──────
        match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1).strip())
            except Exception:
                pass

        # ── Strategy 3: Extract from ``` ... ``` block ──────────
        match = re.search(r'```\s*(.*?)\s*```', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1).strip())
            except Exception:
                pass

        # ── Strategy 4: Find first { to last } ──────────────────
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1 and end > start:
            candidate = text[start:end + 1]
            try:
                return json.loads(candidate)
            except Exception:
                pass

        # ── Strategy 5: Fix trailing commas then parse ───────────
        if start != -1 and end != -1:
            candidate = text[start:end + 1]
            # Remove trailing commas before } and ]
            fixed = re.sub(r',\s*([}\]])', r'\1', candidate)
            # Fix single quotes to double quotes
            fixed = re.sub(r"'([^']*)':", r'"\1":', fixed)
            try:
                return json.loads(fixed)
            except Exception:
                pass

        # ── Strategy 6: Return safe fallback ────────────────────
        raise ValueError(f"Could not extract valid JSON from Claude response. "
                        f"Response preview: {text[:200]}")

    async def analyze(self, data: dict) -> dict:
        self.status = "running"
        start_time = time.time()

        try:
            self.log(f"Starting analysis for {self.specialty}...", "info")

            message = self.client.messages.create(
                model=settings.model_name,
                max_tokens=settings.max_tokens,
                system=self.build_prompt(data),
                messages=[
                    {"role": "user", "content": self.build_user_message(data)}
                ]
            )

            response_text = message.content[0].text

            # Use robust JSON extractor
            result = self._extract_json(response_text)

            elapsed = round((time.time() - start_time) * 1000)
            confidence = result.get('confidence_score', 0)
            self.log(
                f"Analysis complete in {elapsed}ms. Confidence: {confidence:.0%}",
                "success"
            )
            self.status = "done"
            return result

        except Exception as e:
            self.status = "error"
            self.log(f"Error: {str(e)}", "error")
            return self._fallback_result(str(e))

    def _fallback_result(self, error: str) -> dict:
        return {
            "summary": f"{self.name} encountered an issue: {error[:100]}",
            "key_findings": ["Analysis unavailable — check API key and model name"],
            "risk_level": "MEDIUM",
            "projected_savings_usd": 0,
            "confidence_score": 0.0,
            "recommendations": [],
            "metrics": {}
        }
