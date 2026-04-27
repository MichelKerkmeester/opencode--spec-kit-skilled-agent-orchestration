# Cell S1 / cli-copilot-1 — Score (v1.0.2)

## v1.0.1 Rubric (4 dims, 0-2 scale, 8 max)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns exact spec folder + cites 2 anchors (problem, requirements) + the spec title. Matches expected outcome. |
| 2 Tool Selection | 2 | Tried `memory_quick_search` MCP first (correct intent), got `EVIDENCE GAP DETECTED` weak-quality response, fell back to grep + glob + Read — exactly the REQ-007 broaden-on-weak behavior 005 specified. |
| 3 Latency | 1 | 67s — falls in the 60-300s band. |
| 4 Hallucination | 2 | All citations verifiable. Notably, model honored the weak-quality signal from `memory_quick_search` (low confidence) and broadened instead of fabricating — cf. v1.0.1 I2/opencode catastrophe where the same signal triggered hallucination. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-008 — applicable)

| REQ | Field | Observed | Result |
|-----|-------|----------|--------|
| REQ-008 | cocoindex telemetry fields | cli-copilot used `memory_quick_search` (not cocoindex_search) — fields N-A | N-A |
| REQ-013 | `memory_context` token-budget envelope | Not invoked in this cell | N-A |

Note: cli-copilot S1 is novel in that it exercised `memory_quick_search`'s weak-quality response path WITHOUT triggering hallucination — early supporting evidence for packet 009's response-policy contract.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 7/10 (cli-copilot per findings.md row 23) → ~7/8 under v1.0.1 rubric
- **v1.0.2 score**: 7/8
- **Delta**: 0
- **Classification**: **NEUTRAL-CEILING**

## Narrative

cli-copilot S1 confirms the v1.0.1 baseline holds — same correct answer, same tool routing, similar latency. **Behavioral note worth flagging in findings**: the weak-quality `memory_quick_search` response triggered a clean broaden-then-cite pattern rather than hallucination, which is the exact contract packet 009 ratified for `memory_search`. This suggests `memory_quick_search` may already implement (or honor) the same response-policy semantics. Output is much smaller than cli-codex (2 KB vs 1.17 MB) because copilot doesn't dump full reasoning traces. Token usage: 192.8k input / 1.5k output / 136.2k cached.
