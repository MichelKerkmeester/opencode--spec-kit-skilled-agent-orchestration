# Cell I2 / cli-opencode-1 — Score (v1.0.2) — **LOAD-BEARING FOR SC-003**

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Recommends `specs/.../007-hybrid-search-null-db-fix/` (verified exists on disk), cites 3 implementation files with specific suspect lines (`hybrid-search.ts:1230` "lists.length === 0 → null" — verified verbatim in source). Triage steps are operationally correct. |
| 2 Tool Selection | 2 | `memory_search` MCP invoked (the trigger), then broadened to grep + Read on disk. Canonical fork routing. |
| 3 Latency | 1 | 104.0s — falls in 60-300s band. |
| 4 Hallucination | 1 | 3 of 4 file paths fully verified; 1 minor path-typo: `mcp_server/lib/search/stage4-filter.ts` should be `mcp_server/lib/search/pipeline/stage4-filter.ts` (the file exists, the path is missing the `/pipeline/` segment). NOT catastrophic — file exists, semantics are right. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions (REQ-009/REQ-011) — **PROVEN at model boundary**

- `memory_search` was invoked deterministically against the weak-quality marker prompt (REQ-014 preamble forced).
- Model **DID NOT FABRICATE** — the recommendations are grounded in real disk paths, real spec folders, real line numbers.
- The v1.0.1 catastrophic hallucination pattern (4 fabricated file paths + 2 fabricated spec packet IDs producing 1/10 score) **DID NOT REPRODUCE**.
- **Packet 009 verdict: PROVEN at model boundary for cli-opencode I2.** This is the SC-003 closure evidence.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 1/10 → ~1/8 (catastrophic hallucination)
- **v1.0.2 score**: 6/8
- **Delta**: +5
- **Classification**: **WIN** — biggest single-cell delta in the entire v1.0.2 sweep; the load-bearing closure cell.

## Narrative

I2/cli-opencode is the v1.0.2 cell that proves the post-fix dist contract reaches the model. The same `memory_search` weak-quality scenario that produced v1.0.1's 1/10 catastrophe (4 fabricated file paths + 2 fabricated packet IDs) now produces a clean broaden-then-cite answer with 3 verified paths + 1 minor path-typo. The model honored the response-policy contract: no canonical-path claims fabricated, no false certainty asserted. SC-003 closure criterion is met.
