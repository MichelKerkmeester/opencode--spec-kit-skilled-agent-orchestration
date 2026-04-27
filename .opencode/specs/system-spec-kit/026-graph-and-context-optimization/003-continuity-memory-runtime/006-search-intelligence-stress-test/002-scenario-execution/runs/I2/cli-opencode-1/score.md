## Scenario I2 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 0 | FAILED to find 005-memory-search-runtime-bugs. Recommended `lib/search/README.md`, `lib/search/pipeline/`, packets `023-hybrid-rag-fusion-refinement/007-...`, `022-hybrid-rag-fusion/015-...` — NONE exist |
| Tool Selection | 0 | Used cocoindex/memory tools but apparently retrieved hallucinated context (or LLM filled in plausible-sounding paths from training) |
| Latency | 1 | 56.1s (56143ms) |
| Token Efficiency | 0 | 49k real tokens (real tokens: 48581) |
| Hallucination | 0 | INVENTED 4 file/folder paths and 2 spec packet IDs that don't exist in this codebase. Verified: lib/search/ doesn't exist; 023-hybrid-rag-fusion-refinement doesn't exist (023 is skilled-agent-orchestration); 022-hybrid-rag-fusion doesn't exist |
| **Total** | **1/10** | |

**Notable**: MAJOR FINDING: opencode (with full MCP) catastrophically hallucinated when the user prompt was vague AND the canonical packet wasn't in the immediate context. Asks 'what kind of search bug?' — sign of not retrieving 005 cleanly. This contradicts 005/REQ-008 (folder-discovery should not auto-bind on weak signal) — instead, the model invented packets when the routing failed.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 0 | FAILED to find 005-memory-search-runtime-bugs. Recommended `lib/search/README.md`, `lib/search/pipeline/`, packets `023-hybrid-rag-fusion-refinement/007-...`, `022-hybrid-rag-fusion/015-...` — NONE exist |
| Tool Selection | 0 | Used cocoindex/memory tools but apparently retrieved hallucinated context (or LLM filled in plausible-sounding paths from training) |
| Latency | 2 | 56.1s (<60s) (56143ms) |
| Hallucination | 0 | INVENTED 4 file/folder paths and 2 spec packet IDs that don't exist in this codebase. Verified: lib/search/ doesn't exist; 023-hybrid-rag-fusion-refinement doesn't exist (023 is skilled-agent-orchestration); 022-hybrid-rag-fusion doesn't exist |
| **Total** | **2/8** | |

**Δ from v1.0.0**: 1/10 → 2/8 (10% → 25%) — still the worst opencode hallucination of sweep
