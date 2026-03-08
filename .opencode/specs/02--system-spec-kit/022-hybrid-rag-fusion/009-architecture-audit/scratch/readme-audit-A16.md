# README Audit A16 — MCP Server: formatters/, handlers/, hooks/

**Auditor:** Claude Opus 4.6 (agent)
**Date:** 2026-03-08
**Base path:** `.opencode/skill/system-spec-kit/mcp_server/`

---

## 1. `formatters/` — PASS

**Files on disk:** `index.ts`, `search-results.ts`, `token-metrics.ts`, `README.md`
**Files listed in README:** `index.ts`, `search-results.ts`, `token-metrics.ts`

| Check | Result |
|---|---|
| All files listed | Yes — 3/3 source files documented |
| Descriptions accurate | Yes — `search-results.ts` formats results with content embedding, anchor extraction, path validation; `token-metrics.ts` does token estimation/savings; `index.ts` is barrel export |
| Module structure matches code | Yes — descriptions match actual exports and logic |
| YAML frontmatter present | Yes — title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes — `## 1. OVERVIEW`, `## 2. IMPLEMENTED STATE`, `## 3. HARDENING NOTES`, `## 4. RELATED` |
| HVR-banned words | None found |

**Status:** PASS. No changes needed.

---

## 2. `handlers/` — UPDATED

**Files on disk (root):** 30 `.ts` files + 1 `save/` subfolder (10 files) + `README.md`
**Files listed in README (before fix):** 21 modules

| Check | Result |
|---|---|
| All files listed | **NO** — 9 files missing from the module list |
| Descriptions accurate | Partially — listed files had accurate descriptions but the listing was incomplete |
| Module structure matches code | **NO** — `save/` subfolder not mentioned, several handler modules omitted |
| YAML frontmatter present | Yes — title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes — `## 1. OVERVIEW` through `## 5. RELATED` |
| HVR-banned words | None found |

**Missing files (pre-fix):**

| File | Role |
|---|---|
| `causal-links-processor.ts` | Causal link extraction and processing |
| `chunking-orchestrator.ts` | Document chunking orchestration |
| `eval-reporting.ts` | Ablation runs and reporting dashboard (R13-S3) |
| `handler-utils.ts` | Shared handler utility functions |
| `memory-ingest.ts` | Batch ingest start/status/cancel handlers |
| `mutation-hooks.ts` | Post-mutation hook runner (cache invalidation) |
| `pe-gating.ts` | Prediction-error gate actions |
| `quality-loop.ts` | Quality feedback loop handler |
| `save/` (subfolder) | Decomposed save pipeline (has own README) |

**Actions taken:**
1. Added all 9 missing files and the `save/` subfolder reference to the module list in `## 1. OVERVIEW`
2. Added brief role descriptions for every module (previously only some had descriptions)
3. Updated YAML `description` field to include newly documented domains (ingest, PE gating, eval reporting, quality loop)

**Status:** UPDATED. README now lists all 29 source files + `save/` subfolder.

---

## 3. `hooks/` — PASS

**Files on disk:** `index.ts`, `memory-surface.ts`, `mutation-feedback.ts`, `response-hints.ts`, `README.md`
**Files documented in README:** All 4 source files covered (exports enumerated by name)

| Check | Result |
|---|---|
| All files listed | Yes — all 4 source files covered via named exports |
| Descriptions accurate | Yes — `extractContextHint`, `getConstitutionalMemories`, `clearConstitutionalCache`, `autoSurfaceMemories`, `autoSurfaceAtToolDispatch`, `autoSurfaceAtCompaction`, `MEMORY_AWARE_TOOLS`, `buildMutationHookFeedback`, `appendAutoSurfaceHints` all verified against source |
| Module structure matches code | Yes — data shapes and export names match actual code |
| YAML frontmatter present | Yes — title, description, trigger_phrases |
| Numbered ALL CAPS H2 sections | Yes — `## 1. OVERVIEW`, `## 2. IMPLEMENTED STATE`, `## 3. HARDENING NOTES`, `## 4. RELATED` |
| HVR-banned words | None found |

**Minor note (not a failure):** `response-hints.ts` also exports `syncEnvelopeTokenCount` and `serializeEnvelopeWithTokenCount`, and `memory-surface.ts` exports constants `CONSTITUTIONAL_CACHE_TTL`, `TOOL_DISPATCH_TOKEN_BUDGET`, `COMPACTION_TOKEN_BUDGET`. These are secondary/internal exports not surfaced in the README's "Main exports" list. This is acceptable since the README focuses on the primary API surface.

**Status:** PASS. No changes needed.

---

## Summary

| Folder | Status | Issues | Actions |
|---|---|---|---|
| `formatters/` | PASS | None | None |
| `handlers/` | UPDATED | 9 files + `save/` subfolder missing from module list; YAML description incomplete | Added all missing entries with descriptions; updated YAML description |
| `hooks/` | PASS | None | None |
