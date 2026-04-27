# Cell S2 / cli-opencode-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Comprehensive 9-layer tool taxonomy (L1-L9), architecture (hybrid RAG, 6-tier importance, 5-state lifecycle, causal graph), key files, major specs. Most thorough S2 answer across CLIs. |
| 2 Tool Selection | 2 | `memory_quick_search` MCP + `cocoindex_code_search` + glob — full hybrid routing including the cocoindex fork. |
| 3 Latency | 2 | 54.8s — under 60s. |
| 4 Hallucination | 2 | All layer descriptions, file paths, spec folders verifiable. No fabrication. |
| **Total** | **8/8** | |

## Fork-Telemetry Assertions (REQ-008)

- `cocoindex_code_search` returned `dedupedAliases:26`, `uniqueResultCount:10`, `path_class:"implementation"|"docs"`, `raw_score:` populated per result — **all packet 004 telemetry fields present**.
- **Packet 004 verdict signal: PROVEN** for cli-opencode S2.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 6/10 → ~6/8
- **v1.0.2 score**: 8/8
- **Delta**: +2
- **Classification**: **WIN** — driven by full fork-telemetry visibility + comprehensive layered taxonomy.

## Narrative

The clearest packet 004 win. Output payload shows `dedupedAliases:26` (the fork dedup is actively merging duplicates), `path_class:"implementation"` reranking applied, `raw_score` preserved alongside `score`. Vocabulary uses "Spec Kit Memory" but still references "memories" — REQ-003 partial violation. Output 57KB, latency 54s.
