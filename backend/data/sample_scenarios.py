"""
Sample Scenarios & Fallback Data
==================================
- SAMPLE_SCENARIOS: Pre-built demo data for each scenario type
- get_fallback_result(): Returns rich sample results when API key not set
"""

from datetime import datetime


SAMPLE_SCENARIOS = [
    {
        "id": "supply",
        "title": "Supply Chain Disruption",
        "description": "Port strike affecting 145K units across 3 fulfillment centers",
        "icon": "📦",
        "input_data": {
            "event_type": "supply_chain_disruption",
            "timestamp": "2025-02-25T09:14:00Z",
            "affected_skus": ["B08N5WRWNW", "B07XJ8C8F7", "B09B8RNKL1"],
            "supplier": "Foxconn_Shenzhen",
            "disruption_reason": "Port_strike",
            "affected_units": 145000,
            "current_stock_days": 4.2,
            "reorder_lead_time_days": 18,
            "daily_demand_avg": 34500,
            "fulfillment_centers": ["SEA6", "LAX9", "DFW7"],
            "contract_penalty_per_day_usd": 12000,
            "alternative_suppliers": [
                {"name": "Pegatron_Taiwan", "lead_days": 12, "cost_premium_pct": 8},
                {"name": "Wistron_India", "lead_days": 9, "cost_premium_pct": 15}
            ]
        }
    },
    {
        "id": "demand",
        "title": "Prime Day Demand Forecast",
        "description": "Predict inventory needs for 285% demand spike across 3 categories",
        "icon": "📈",
        "input_data": {
            "event_type": "demand_forecast",
            "event": "Amazon_Prime_Day_2025",
            "forecast_window_days": 14,
            "categories": [
                {"name": "Electronics", "hist_spike_pct": 285, "current_inv_units": 420000},
                {"name": "Home_Appliances", "hist_spike_pct": 195, "current_inv_units": 280000},
                {"name": "Fashion", "hist_spike_pct": 165, "current_inv_units": 850000}
            ],
            "warehouse_capacity_pct": 87,
            "current_vendor_lead_days": 7,
            "marketing_spend_planned_usd": 2400000,
            "last_year_revenue": 184000000,
            "confidence_interval": 0.92
        }
    },
    {
        "id": "fraud",
        "title": "Fraud Pattern Detection",
        "description": "2,847 suspicious transactions detected in 24h — $1.15M at risk",
        "icon": "🔒",
        "input_data": {
            "event_type": "fraud_analysis",
            "time_window": "24h",
            "flagged_transactions": 2847,
            "total_transactions": 4820000,
            "suspicious_patterns": [
                {"type": "account_farming", "instances": 892, "est_loss_usd": 445000},
                {"type": "return_fraud", "instances": 1243, "est_loss_usd": 621500},
                {"type": "card_testing", "instances": 712, "est_loss_usd": 89000}
            ],
            "new_accounts_flagged": 3421,
            "geo_anomalies": ["RU", "NG", "BR"],
            "velocity_threshold_exceeded": True,
            "device_fingerprints_new": 1893
        }
    },
    {
        "id": "cost",
        "title": "Cost Reduction Analysis",
        "description": "$128M quarterly opex — agents find 18% reduction opportunity",
        "icon": "💰",
        "input_data": {
            "event_type": "cost_optimization",
            "analysis_period": "Q4_2024",
            "total_operational_cost_usd": 128000000,
            "cost_centers": [
                {"name": "Last_Mile_Delivery", "cost_usd": 42000000, "inefficiency_pct": 18},
                {"name": "Warehouse_Ops", "cost_usd": 31000000, "inefficiency_pct": 12},
                {"name": "Returns_Processing", "cost_usd": 19000000, "inefficiency_pct": 34},
                {"name": "Cloud_Infrastructure", "cost_usd": 14000000, "inefficiency_pct": 22},
                {"name": "Vendor_Contracts", "cost_usd": 22000000, "inefficiency_pct": 9}
            ],
            "energy_cost_monthly": 890000,
            "labor_overtime_cost": 3200000
        }
    },
    {
        "id": "inventory",
        "title": "Inventory Rebalancing",
        "description": "84K SKUs analyzed — 12.4K overstock, 3.2K understock across 22 FCs",
        "icon": "🏭",
        "input_data": {
            "event_type": "inventory_optimization",
            "total_skus": 84000,
            "overstock_skus": 12400,
            "understock_skus": 3200,
            "dead_stock_units": 285000,
            "carrying_cost_per_unit_monthly": 4.2,
            "stockout_incidents_30d": 8400,
            "lost_sales_est_usd": 5600000,
            "fulfillment_centers": 22,
            "cross_dock_capacity": 0.67,
            "seasonal_items_pct": 31
        }
    },
    {
        "id": "logistics",
        "title": "Last-Mile Optimization",
        "description": "3.2M daily packages — 4.8% fail rate, $8.42 avg cost to optimize",
        "icon": "🚚",
        "input_data": {
            "event_type": "logistics_optimization",
            "daily_packages": 3200000,
            "on_time_delivery_pct": 89.3,
            "failed_delivery_pct": 4.8,
            "avg_delivery_cost_usd": 8.42,
            "routes_analyzed": 48000,
            "fuel_cost_daily_usd": 2800000,
            "return_trip_pct": 12.3,
            "customer_complaints_delivery": 84000,
            "drone_eligible_pct": 23,
            "same_day_demand": 18
        }
    }
]


def get_fallback_result(scenario: str, logs: list, elapsed_ms: int):
    """
    Returns rich sample results when Claude API is not configured.
    This lets you demo the app without an API key!
    """
    from models.schemas import (
        AnalysisResponse, Metric, ChartBar, Insight, Recommendation, AgentLog
    )

    FALLBACK_DATA = {
        "supply": {
            "savings": 2800000, "accuracy": 0.964, "risks": 12, "actions": 6,
            "bars": [
                ChartBar(label="Supplier Switch Savings", percentage=78, value="$1.4M", color="var(--orange)"),
                ChartBar(label="Penalty Avoidance", percentage=52, value="$840K", color="var(--teal)"),
                ChartBar(label="FC Rebalancing", percentage=35, value="$560K", color="var(--yellow)"),
            ],
            "insights": [
                Insight(icon="⚠️", title="Critical: Stock Depletion in 4.2 Days",
                        description="SKUs B08N5WRWNW, B07XJ8C8F7, B09B8RNKL1 will hit zero inventory by March 1. 34,500 orders/day at risk. Estimated revenue impact: $1.9M/day at current velocity.",
                        badge_type="risk", badge_text="CRITICAL"),
                Insight(icon="✈️", title="Wistron India: Optimal Alternative Supplier",
                        description="9-day lead time vs 18-day current supplier. 15% cost premium is justified given $12K/day contract penalties. Recommend emergency PO for 145,000 units via air freight.",
                        badge_type="opt", badge_text="ACTION NOW"),
                Insight(icon="🔄", title="SEA6 Has 23% Surplus — Cross-FC Rebalance Possible",
                        description="Moving 31,000 units from SEA6 to LAX9 (18K) and DFW7 (13K) adds 0.9 days of buffer coverage at zero procurement cost using existing internal logistics.",
                        badge_type="save", badge_text="SAVE $280K"),
            ],
            "recs": [
                Recommendation(rank=1, priority="critical", action="Issue emergency PO to Wistron India for 145,000 units via expedited air freight", owner="Supply Chain", deadline="2 hours", impact="Avoids $216K/day in contract penalties"),
                Recommendation(rank=2, priority="critical", action="Reallocate 31K units from SEA6 → LAX9 (18K) and DFW7 (13K) using internal logistics", owner="Fulfillment Ops", deadline="6 hours", impact="Adds 0.9 days buffer at $0 cost"),
                Recommendation(rank=3, priority="high", action="Enable dynamic demand throttling — reduce ad spend 40% on affected SKUs to slow depletion", owner="Marketing", deadline="30 minutes", impact="Buys 1.2 additional days of coverage"),
                Recommendation(rank=4, priority="high", action="Activate Pegatron Taiwan as secondary backup supplier for diversification", owner="Procurement", deadline="24 hours", impact="Reduces single-source dependency risk"),
                Recommendation(rank=5, priority="medium", action="Update reorder trigger from 4-day to 6-day threshold in system configuration", owner="Engineering", deadline="48 hours", impact="Prevents future recurrence structurally"),
                Recommendation(rank=6, priority="low", action="File force majeure claim with primary supplier to waive penalties retroactively", owner="Legal", deadline="72 hours", impact="Potential $84K penalty recovery"),
            ],
            "summary": "ARIA detected critical supply chain disruption: 3 high-velocity SKUs face stockout in 4.2 days. Wistron India identified as optimal emergency supplier. Immediate action can save $2.8M and prevent service failure for 145K orders."
        },
        "fraud": {
            "savings": 1155000, "accuracy": 0.991, "risks": 47, "actions": 5,
            "bars": [
                ChartBar(label="Return Fraud Ring Blocked", percentage=88, value="$621K", color="var(--red)"),
                ChartBar(label="Account Farming Stopped", percentage=65, value="$445K", color="var(--orange)"),
                ChartBar(label="Card Testing Blocked", percentage=30, value="$89K", color="var(--yellow)"),
            ],
            "insights": [
                Insight(icon="🚨", title="Return Fraud Ring Detected — $621K at Risk",
                        description="1,243 accounts show coordinated return abuse: buy→use→return with 94% behavioral similarity. Accounts created within 72h of first purchase, 89% using prepaid cards.",
                        badge_type="risk", badge_text="FRAUD RING"),
                Insight(icon="🤖", title="Bot Farm: 892 Auto-Created Accounts Identified",
                        description="Behavioral fingerprinting identified bot-operated account farming across 14 distinct IP ranges with identical JS fingerprint hash. Recommend immediate suspension.",
                        badge_type="risk", badge_text="BOT ACTIVITY"),
                Insight(icon="🌍", title="Geo-Velocity Anomaly in RU/NG/BR Markets",
                        description="712 card testing events with impossible travel velocity (same card used in 2 countries within 4 minutes). Patterns consistent with organized criminal syndicate.",
                        badge_type="opt", badge_text="AUTO-BLOCKED"),
            ],
            "recs": [
                Recommendation(rank=1, priority="critical", action="Suspend 2,847 flagged accounts pending manual review (94% true-positive estimated)", owner="Trust & Safety", deadline="Immediate", impact="Stops $1.15M active fraud loss"),
                Recommendation(rank=2, priority="critical", action="Deploy geo-velocity rule: flag any card used in 2+ countries within 30 minutes", owner="Risk Engineering", deadline="1 hour", impact="Prevents recurrence of card testing attack"),
                Recommendation(rank=3, priority="high", action="Restrict prepaid cards on accounts <30 days old for returns >$200", owner="Product", deadline="4 hours", impact="Eliminates primary return fraud vector"),
                Recommendation(rank=4, priority="high", action="Deploy device fingerprint ML clustering on new signups (similarity threshold 0.87)", owner="ML Platform", deadline="8 hours", impact="Blocks bot account farm creation"),
                Recommendation(rank=5, priority="medium", action="File SAR (Suspicious Activity Report) for RU/NG patterns per compliance mandate", owner="Compliance", deadline="24 hours", impact="Required by regulation, legal protection"),
            ],
            "summary": "ARIA Fraud Sentinel detected 3 coordinated fraud patterns totaling $1.15M in 24 hours. A return fraud ring (1,243 accounts), bot farm (892 accounts), and geo-velocity card testing attack identified. Immediate suspension recommended with 94% true-positive confidence."
        }
    }

    DEFAULT = {
        "savings": 3400000, "accuracy": 0.972, "risks": 18, "actions": 7,
        "bars": [
            ChartBar(label="Process Optimization", percentage=82, value="$1.8M", color="var(--orange)"),
            ChartBar(label="Cost Reduction", percentage=65, value="$1.1M", color="var(--teal)"),
            ChartBar(label="Risk Prevention", percentage=45, value="$500K", color="var(--yellow)"),
        ],
        "insights": [
            Insight(icon="💡", title="High-Impact Optimization: $2.1M Quick Wins Available",
                    description="Agents identified 18 operational inefficiencies. Top-3 can deliver $2.1M in savings within 30 days with zero capital expenditure required.",
                    badge_type="save", badge_text="$2.1M QUICK WIN"),
            Insight(icon="📊", title="Forecast Accuracy Improved to 97.2% with Ensemble Model",
                    description="New ensemble model combining historical data, market signals, and seasonality outperforms baseline by 14.3 percentage points. Reduces overstock carrying cost by $890K annually.",
                    badge_type="opt", badge_text="MODEL UPGRADE"),
            Insight(icon="🛡️", title="3 Compliance Gaps Require Immediate Remediation",
                    description="Data retention policy gap, vendor SLA tracking deficit, and incomplete audit trail identified. Remediation required to maintain SOC 2 Type II certification.",
                    badge_type="risk", badge_text="COMPLIANCE RISK"),
        ],
        "recs": [
            Recommendation(rank=1, priority="critical", action="Implement top cost-reduction opportunity identified by Cost Analyst Agent", owner="Operations", deadline="24 hours", impact="$1.8M projected savings"),
            Recommendation(rank=2, priority="high", action="Deploy updated 97.2% accuracy ML model to production via SageMaker", owner="ML Platform", deadline="48 hours", impact="Eliminates $890K annual overstock cost"),
            Recommendation(rank=3, priority="high", action="Remediate 3 compliance gaps before next SOC 2 audit", owner="Compliance", deadline="72 hours", impact="Maintains certification, avoids $500K fines"),
            Recommendation(rank=4, priority="medium", action="Renegotiate vendor contracts based on market intelligence findings", owner="Procurement", deadline="1 week", impact="$340K annual savings"),
            Recommendation(rank=5, priority="medium", action="Execute inventory rebalancing across 22 fulfillment centers", owner="Fulfillment", deadline="48 hours", impact="Reduces stockout incidents by 28%"),
            Recommendation(rank=6, priority="low", action="Schedule quarterly agentic re-analysis for continuous improvement loop", owner="Strategy", deadline="1 month", impact="Compounds savings each quarter"),
        ],
        "summary": "ARIA completed multi-agent analysis across all operational domains. Identified $3.4M in immediate savings opportunities with 97.2% model accuracy. 18 risk items flagged, 7 prioritized actions generated for immediate execution."
    }

    data = FALLBACK_DATA.get(scenario, DEFAULT)
    
    metrics = [
        Metric(label="Projected Savings", value=f"${data['savings']:,}", delta="↑ Above baseline", color="orange"),
        Metric(label="Model Accuracy", value=f"{data['accuracy']:.1%}", delta="↑ +14.3% vs baseline", color="green"),
        Metric(label="Risk Items Found", value=str(data['risks']), delta=f"{data['risks']} items flagged", color="red"),
        Metric(label="Recommended Actions", value=str(data['actions']), delta="Agent-generated", color="yellow"),
    ]

    return AnalysisResponse(
        success=True,
        scenario=scenario,
        timestamp=datetime.utcnow().isoformat(),
        execution_time_ms=elapsed_ms,
        metrics=metrics,
        chart_bars=data['bars'],
        insights=data['insights'],
        recommendations=data['recs'],
        agent_logs=logs,
        summary=data['summary']
    )
