# README Audit A17 — mcp_server/{tools,utils,configs}

**Date:** 2026-03-08
**Auditor:** Claude Opus 4.6
**Base path:** `.opencode/skill/system-spec-kit/mcp_server/`

---

## 1. mcp_server/tools/

**Status:** UPDATED

**Actual files (7):**
- `index.ts` — central router (`dispatchTool()`) and barrel exports
- `types.ts` — shared arg interfaces and `parseArgs<T>()` / `parseValidatedArgs<T>()`
- `context-tools.ts` — 1 tool: `memory_context`
- `memory-tools.ts` — 10 tools: `memory_search`, `memory_match_triggers`, `memory_save`, `memory_list`, `memory_stats`, `memory_health`, `memory_delete`, `memory_update`, `memory_validate`, `memory_bulk_delete`
- `causal-tools.ts` — 4 tools: `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`
- `checkpoint-tools.ts` — 4 tools: `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`
- `lifecycle-tools.ts` — 9 tools: `memory_index_scan`, `task_preflight`, `task_postflight`, `memory_get_learning_history`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`, `eval_run_ablation`, `eval_reporting_dashboard`

**Issues found:**
1. Tool count wrong: README said "23 tools" but actual count is 28 (1+10+4+4+9). The lifecycle-tools module grew from 4 to 9 tools (added ingest_start/status/cancel, eval_run_ablation, eval_reporting_dashboard) without README update.

**Format checks:**
- YAML frontmatter: PASS
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW, 2. IMPLEMENTED STATE, 3. HARDENING NOTES, 4. RELATED)
- HVR-banned words: PASS (none found)
- File listing complete: PASS (all 7 files mentioned)
- Descriptions accurate: PASS (dispatch model, parseArgs, TOOL_NAMES.has pattern all correct)

**Actions taken:**
- Updated tool count from 23 to 28 in section 2 (IMPLEMENTED STATE).

---

## 2. mcp_server/utils/

**Status:** UPDATED

**Actual files (6):**
- `index.ts` — barrel exports (includes `validateToolInputSchema` from `tool-input-schema.ts`)
- `validators.ts` — `validateQuery`, `validateInputLengths`, `createFilePathValidator`, `getDefaultAllowedPaths`
- `json-helpers.ts` — `safeJsonParse`, `safeJsonStringify`, `safeJsonParseTyped`
- `batch-processor.ts` — `processWithRetry`, `processBatches`, `processSequentially`
- `db-helpers.ts` — `requireDb`, `toErrorMessage`
- `tool-input-schema.ts` — `validateToolInputSchema` (runtime validation of tool args against MCP input schemas: required fields, types, enums, oneOf/anyOf/allOf constraints)

**Issues found:**
1. Missing file: `tool-input-schema.ts` not listed in README overview or exports list. It is exported via `index.ts` barrel and provides runtime schema validation for all tool calls.

**Format checks:**
- YAML frontmatter: PASS
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW, 2. IMPLEMENTED STATE, 3. HARDENING NOTES, 4. RELATED)
- HVR-banned words: PASS (none found)
- File listing complete: FAIL (missing `tool-input-schema.ts`)
- Descriptions accurate: PASS (all listed files described correctly)

**Actions taken:**
- Added `tool-input-schema.ts` to overview file listing with description.
- Added `validateToolInputSchema` to exports list in section 2.
- Updated YAML frontmatter description and trigger_phrases to cover tool schema validation.

---

## 3. mcp_server/configs/

**Status:** UPDATED

**Actual files (2):**
- `search-weights.json` — scoring weights, document-type multipliers, trigger caps
- `cognitive.ts` — cognitive co-activation pattern config (Zod-validated env vars, regex safety, `COGNITIVE_CONFIG` singleton)

**Issues found:**
1. Missing file: `cognitive.ts` not mentioned anywhere in README. This is a TypeScript config module exporting `CognitiveConfig`, `COGNITIVE_CONFIG`, `loadCognitiveConfigFromEnv`, and `safeParseCognitiveConfigFromEnv`.
2. Stale dead-config references: README still listed `rrfFusion` and `crossEncoder` as "marked as dead config in comments" but these sections were already removed from the JSON file per P2-05 audit (2026-02-08). The JSON now contains a `_note_removedDeadConfig` explaining their removal.
3. Inaccurate document type count: README said "11 document types" but actual JSON has 10 entries (spec, decision_record, plan, tasks, implementation_summary, checklist, handover, memory, constitutional, scratch).
4. Inaccurate smartRanking description: README said "marked as partially legacy" but actual JSON note says "LIVE CONFIG" read by `vector-index-impl.ts`.

**Format checks:**
- YAML frontmatter: PASS
- Numbered ALL CAPS H2 sections: PASS (1. OVERVIEW, 2. IMPLEMENTED STATE, 3. HARDENING NOTES, 4. VALIDATION, 5. RELATED)
- HVR-banned words: PASS (none found)
- File listing complete: FAIL (missing `cognitive.ts`)
- Descriptions accurate: FAIL (dead-config refs stale, type count wrong, smartRanking status wrong)

**Actions taken:**
- Added `cognitive.ts` to overview file listing with description of its purpose and exports.
- Removed stale `rrfFusion`/`crossEncoder` bullet points; added removal note.
- Fixed document type count from 11 to 10.
- Fixed `smartRanking` description from "partially legacy" to "live config" with weight values.
- Added `cognitive.ts` exports to section 2.
- Updated YAML frontmatter description and trigger_phrases to cover cognitive config.

---

## Summary

| Folder | Status | Issues | Actions |
|--------|--------|--------|---------|
| `tools/` | UPDATED | Tool count drift (23 -> 28) | Fixed count |
| `utils/` | UPDATED | Missing `tool-input-schema.ts` | Added file + export to README |
| `configs/` | UPDATED | Missing `cognitive.ts`, 3 stale descriptions | Added file, fixed dead-config refs, corrected counts and status |
