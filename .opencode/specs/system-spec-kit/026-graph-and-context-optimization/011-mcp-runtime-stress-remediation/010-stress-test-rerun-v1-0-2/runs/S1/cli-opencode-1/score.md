# Cell S1 / cli-opencode-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns exact spec folder + cites `spec.md` line 161 (REQ-001) and `ANCHOR:requirements` at line 154. Matches expected outcome. |
| 2 Tool Selection | 2 | Invoked `memory_search` MCP (the canonical tool for this scenario), got `requestQuality.label:"gap"` + 0 results, then correctly broadened to grep + Read — packet 009 + REQ-007 broaden-on-weak behavior. |
| 3 Latency | 2 | 54s — under 60s threshold. |
| 4 Hallucination | 2 | All citations verifiable. **Critical observation: weak-quality `memory_search` response did NOT trigger fabrication** — the same trigger that produced v1.0.1 I2/cli-opencode's 1/10 catastrophe. Strong supporting evidence for packet 009's response-policy contract reaching the model. |
| **Total** | **8/8** | |

## Fork-Telemetry Assertions (REQ-008/REQ-011)

- `memory_search` returned `requestQuality.label:"gap"`, `count:0`, `featureFlags.trmEnabled:true` — the post-fix telemetry shape (packet 009).
- Model honored the gap signal — exactly the **REQ-011** behavior (`responsePolicy.noCanonicalPathClaims:true`-equivalent at the model layer).
- **Packet 009 verdict signal: PROVEN at the model boundary** for cli-opencode S1.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 7/10 → ~7/8 under v1.0.1 rubric
- **v1.0.2 score**: 8/8
- **Delta**: +1
- **Classification**: **WIN** — driven by Tool Selection going from suboptimal to optimal (memory_search MCP correctly invoked) AND by the no-hallucination behavior on weak retrieval being maintained even though v1.0.1's I2 case taught us this was a real risk.

## Narrative

S1/cli-opencode is the first WIN of v1.0.2 — a +1 delta entirely attributable to two things: (1) memory_search MCP was actually invoked (a Tool Selection improvement), and (2) the post-fork response-policy contract held the model away from hallucination on a weak-quality retrieval. This is the clearest preview of why packet 009 was authored. JSON-streaming output (80 KB), 54s latency, no errors.
