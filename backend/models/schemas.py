"""
Data Models / Schemas
======================
These define the shape of data going in and out of the API.
Pydantic automatically validates and documents everything.
"""

from pydantic import BaseModel, Field
from typing import Any, Optional
from enum import Enum


class ScenarioType(str, Enum):
    SUPPLY_CHAIN = "supply"
    DEMAND_FORECAST = "demand"
    FRAUD_DETECTION = "fraud"
    COST_OPTIMIZATION = "cost"
    INVENTORY = "inventory"
    LOGISTICS = "logistics"


class PriorityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class AnalysisRequest(BaseModel):
    """What the frontend sends us."""
    scenario: ScenarioType = Field(..., description="Which type of analysis to run")
    input_data: dict[str, Any] = Field(..., description="The operational data to analyze")
    confidence_threshold: float = Field(0.85, ge=0.5, le=1.0)
    priority: PriorityLevel = Field(PriorityLevel.HIGH)

    class Config:
        json_schema_extra = {
            "example": {
                "scenario": "supply",
                "input_data": {"affected_units": 145000, "current_stock_days": 4.2},
                "confidence_threshold": 0.85,
                "priority": "critical"
            }
        }


class AgentLog(BaseModel):
    """A single log line from an agent."""
    timestamp: str
    agent_name: str
    message: str
    log_type: str  # "info" | "success" | "warning" | "error"


class Metric(BaseModel):
    """A single KPI metric."""
    label: str
    value: str
    delta: str
    color: str  # "green" | "orange" | "red" | "yellow"


class ChartBar(BaseModel):
    """A bar in the savings breakdown chart."""
    label: str
    percentage: int
    value: str
    color: str


class Insight(BaseModel):
    """An agent-generated insight."""
    icon: str
    title: str
    description: str
    badge_type: str   # "save" | "risk" | "opt"
    badge_text: str


class Recommendation(BaseModel):
    """An actionable recommendation."""
    rank: int
    priority: PriorityLevel
    action: str
    owner: str
    deadline: str
    impact: str


class AnalysisResponse(BaseModel):
    """What we send back to the frontend."""
    success: bool
    scenario: str
    timestamp: str
    execution_time_ms: int
    metrics: list[Metric]
    chart_bars: list[ChartBar]
    insights: list[Insight]
    recommendations: list[Recommendation]
    agent_logs: list[AgentLog]
    summary: str
