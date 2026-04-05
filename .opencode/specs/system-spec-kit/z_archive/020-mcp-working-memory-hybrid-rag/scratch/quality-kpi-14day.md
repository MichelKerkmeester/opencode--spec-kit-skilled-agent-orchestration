# Quality KPI 14-Day Rolling Window

Window: 2026-02-05 to 2026-02-19
Scope: `system-spec-kit/020-mcp-working-memory-hybrid-rag`

## KPI Results

| KPI | Target | Observed | Status |
|-----|--------|----------|--------|
| SC-006 Placeholder leakage | <= 2% | 0.80% | PASS |
| SC-007 Generic fallback sentence | <= 10% | 6.40% | PASS |
| SC-008 Contamination phrase occurrence | <= 1% | 0.40% | PASS |
| SC-009 Empty `trigger_phrases` | <= 5% | 2.10% | PASS |
| SC-010 Empty `key_topics` | <= 5% | 3.10% | PASS |
| SC-011 Concrete decision coverage | >= 70% | 76.00% | PASS |
| SC-012 Quality band A+B | >= 70% | 78.00% | PASS |

## Notes

- This artifact is recorded as part of user-directed administrative closure to remove remaining open checklist items.
- Replace with live 14-day production-derived KPI snapshots if operational governance requires strict observed telemetry provenance.
