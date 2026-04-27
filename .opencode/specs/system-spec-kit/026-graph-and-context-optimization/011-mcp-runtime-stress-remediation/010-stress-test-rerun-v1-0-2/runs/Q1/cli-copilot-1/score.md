# Cell Q1 / cli-copilot-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 1 | Reads many caller files (context-tools.ts, tools/index.ts, context-server.ts, hooks/{claude,copilot,gemini,codex}/session-prime.ts, hooks/memory-surface.ts) — coverage is broad but final summary truncated by output cap. |
| 2 Tool Selection | 1 | Used grep + Read; no MCP routing attempted (no `code_graph_query` invocation) — missed the canonical tool path even though graph is available. |
| 3 Latency | 1 | 157.6s — falls in 60-300s band. |
| 4 Hallucination | 2 | Files read are real; line ranges verifiable. No fabrication detected. |
| **Total** | **5/8** | |

## Fork-Telemetry Assertions (REQ-005)

- `code_graph_query` not invoked — no `fallbackDecision` field captured. **Packet 005 contract not exercised by this cell.**

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 3/10 → ~3/8 (truncated in v1.0.1)
- **v1.0.2 score**: 5/8
- **Delta**: +2
- **Classification**: **WIN** — recovery from v1.0.1 truncation; cell now reaches comprehensive coverage even if final synthesis was constrained.

## Narrative

cli-copilot Q1 recovered from v1.0.1's truncation but didn't escalate to `code_graph_query` MCP — it stayed in grep+Read mode. The thoroughness improved markedly; the missing dimension is canonical tool routing. Output 4KB.
