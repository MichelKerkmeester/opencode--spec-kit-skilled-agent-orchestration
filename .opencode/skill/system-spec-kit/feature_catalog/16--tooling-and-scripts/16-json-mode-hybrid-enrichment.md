---
title: "JSON mode structured summary hardening"
description: "Structured JSON summary support for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening for decision confidence, truncated titles, git_changed_file_count stability, and template count preservation."
---

# JSON mode structured summary hardening

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. FEATURE BREAKDOWN](#3--feature-breakdown)
- [4. SOURCE FILES](#4--source-files)
- [5. VERIFICATION SOURCES](#5--verification-sources)
- [6. SOURCE METADATA](#6--source-metadata)

## 1. OVERVIEW

Phase 016 added structured JSON summary support to the session capturing pipeline. The shipped implementation accepts richer caller-authored session data via `--json` and `--stdin` inputs, including fields like `toolCalls` and `exchanges`. It also preserves file-backed JSON authority and ships Wave 2 hardening fixes for decision confidence, truncated outcome titles, `git_changed_file_count` stability, and template count preservation.

The original phase design described a broader file-backed enrichment path, but only the narrower structured-summary contract and hardening fixes shipped.

---

## 2. CURRENT REALITY

The session capturing pipeline now handles structured JSON summaries as follows:

1. `generate-context.js --json '<data>'` and `generate-context.js --stdin` accept structured JSON with fields like `toolCalls`, `exchanges`, `sessionSummary`, and the documented snake_case contract (`user_prompts`, `recent_context`, `trigger_phrases`).
2. File-backed JSON (passed as a file path argument) stays on the structured path and does not silently fall back into runtime-derived reconstruction.
3. Older JSON payloads that omit the newer structured-summary fields remain backward compatible.
4. Decision confidence values from explicit input are preserved rather than overwritten by heuristics.
5. Truncated outcome/title handling respects explicit input values instead of silently replacing them.
6. `git_changed_file_count` follows a stable 3-tier priority chain: explicit count > enrichment-derived count > provenance-based count.
7. Template assembly preserves explicit session-level message and tool counts when conversation arrays are sparse.
8. After the memory file is written (Step 10.5), a post-save quality review validates that JSON payload fields propagated correctly to the saved memory, using both frontmatter and the `## MEMORY METADATA` YAML block before indexing begins.
9. JSON payload fields `sessionSummary`, `triggerPhrases`, `keyDecisions`, and `contextType` now properly flow through to rendered frontmatter via RC1–RC5 fixes (see §3.4).

---

## 3. FEATURE BREAKDOWN

### 3.1 Structured JSON summary contract

- `toolCalls` and `exchanges` are accepted as first-class fields in the structured JSON input.
- Snake_case field names (`user_prompts`, `recent_context`, `trigger_phrases`) are accepted alongside the existing camelCase keys.
- The input normalizer maps both conventions into the internal representation without data loss.

### 3.2 File-backed JSON authority

- When a file path is provided as input, the content is treated as structured JSON.
- The workflow does not reopen the abandoned runtime-derived enrichment branch for file-backed inputs.
- This keeps caller intent unambiguous: structured input means structured processing.

### 3.3 Wave 2 hardening

- **Decision confidence**: Explicit confidence values from the input payload are preserved through template rendering.
- **Truncated titles**: Outcome titles that arrive truncated are handled gracefully instead of triggering validation warnings.
- **git_changed_file_count**: A 3-tier priority chain ensures stability across different input sources.
- **Template count preservation**: Explicit message and tool counts from the session-level input survive into the rendered output even when conversation arrays are sparse.

### 3.4 JSON payload field propagation fixes (RC1–RC5)

- **RC1 — sessionSummary title extraction**: When the caller passes `sessionSummary` in the JSON payload, the title is extracted from `_JSON_SESSION_SUMMARY` rather than falling back to a generic or path-derived string.
- **RC2 — Manual trigger phrase frontmatter merge**: `triggerPhrases` values from the JSON payload are merged into rendered frontmatter instead of being silently dropped when no dynamic trigger phrases were detected.
- **RC3 — Fast-path keyDecisions propagation**: `keyDecisions` from the JSON payload now flow through the fast-path rendering branch in addition to the standard enrichment branch.
- **RC5 — contextType JSON contract and detectContextType fix**: `contextType` is accepted as a first-class field in the JSON contract. `detectContextType()` is patched to recognize the full set of valid contextType values rather than defaulting to `general` for caller-specified types.

### 3.5 Post-save quality review (Step 10.5)

- After the memory file is written but before indexing begins, a post-save review step compares the saved frontmatter against the original JSON payload.
- Detects propagation failures including generic titles, path-fragment trigger phrases, importance_tier mismatch, decision_count of zero, contextType mismatch, and generic descriptions.
- Reads authoritative `decision_count` from either frontmatter or `## MEMORY METADATA`, matching the shipped runtime parser.
- Emits a machine-readable review with severity levels (HIGH/MEDIUM/LOW) so callers can surface actionable field-level failures.
- Always active. The review runs for every JSON-mode save where the payload is available.
- See feature catalog entry `13--memory-quality-and-indexing/19-post-save-quality-review.md` for full specification.

### 3.6 Quality scorer recalibration (Phase 002)

- Removed +0.20 bonus system (+0.05 messages, +0.05 tools, +0.10 decisions) from `extractors/quality-scorer.ts`.
- Base score is now 1.0 with only penalties subtracting.
- Penalty weights recalibrated: HIGH=0.10, MEDIUM=0.03, LOW=0.01.
- Five simultaneous MEDIUM penalties produce 0.85 (discriminative, below 0.90).
- Calibration test import fixed to test live scorer (`extractors/`, not `core/`).

### 3.7 Contamination filter extension (Phase 002)

- `filterContamination` now called on 4 additional text fields: `_JSON_SESSION_SUMMARY`, `_manualDecisions[]`, `recentContext[]`, `technicalContext` KEY/VALUE.
- 18 new contamination patterns across 7 categories added (33 -> 51 total): hedging phrases, conversational acknowledgment, meta-commentary, instruction echoing, markdown artifacts, safety disclaimers, redundant certainty markers.
- Safety edge case: "I cannot reproduce the bug" preserved (not stripped).

### 3.8 Field integrity hardening (Phase 003)

- Fast-path `filesModified` -> FILES conversion added (mirrors slow-path).
- Unknown-field warnings via `KNOWN_RAW_INPUT_FIELDS` set.
- `contextType` enum validation against `VALID_CONTEXT_TYPES`.
- String length limits: `sessionSummary` (50KB), `triggerPhrases` entries (200 chars), observation narratives (5000 chars).
- YAML frontmatter structural validation (V13 rule).
- Content density V-rule (minimum 50 non-whitespace characters).
- V12 path normalization for relative `spec_folder` paths.
- Status/percentage contradiction detection (V14 warning).

### 3.9 Indexing coherence (Phase 004)

- Trigger phrase filter pipeline: 3-stage filter (path fragments, short tokens, shingle subsets) applied to auto-extracted phrases before manual merge.
- Template sections for `toolCalls`/`exchanges` as compact strings.
- `OPTIONAL_PLACEHOLDERS` cleanup: phantom Session Integrity placeholders remain documented as intentional suppressions, while live Memory Classification and Session Dedup fields are tracked separately.
- Multi-token path fragment detection in post-save review.
- Observation dedup at normalization time (string-equality).
- Pre-save overlap check enabled by default (set `SPECKIT_PRE_SAVE_DEDUP=false` to disable). Current algorithm is advisory exact-match SHA1 comparison against the most recent 20 sibling memories.

### 3.10 Embedding visibility (Phase 004)

- Zero-DB `getEmbeddingRetryStats()` accessor in `retry-manager.ts`.
- `embeddingRetry` returns an in-memory health snapshot refreshed by retry-manager queue scans and status mutations; the accessor itself does not hit SQLite.
- `embeddingRetry` block in `memory_health` MCP response with: `pending`, `failed`, `retryAttempts`, `circuitBreakerOpen`, `lastRun`, `queueDepth`.

### 3.11 projectPhase override (Phase 002)

- `resolveProjectPhase()` in `session-extractor.ts` following `resolveContextType()` pattern.
- `projectPhase` propagated through fast-path and slow-path in `input-normalizer.ts`.
- Valid values: RESEARCH, PLANNING, IMPLEMENTATION, DEBUGGING, REVIEW.

### 3.12 Post-save review score feedback (Phase 002)

- `computeReviewScorePenalty()` with severity-based penalties (HIGH=-0.10, MEDIUM=-0.05, LOW=-0.02).
- Advisory logging only (does not modify saved file to preserve duplicate detection).

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/types/session-types.ts` | Structured JSON contract types for `toolCalls` and `exchanges` |
| `scripts/utils/input-normalizer.ts` | Snake_case JSON compatibility, structured-summary normalization, `projectPhase` propagation (fast-path and slow-path) |
| `scripts/extractors/collect-session-data.ts` | Wave 2 count, confidence, and outcome handling |
| `scripts/extractors/quality-scorer.ts` | Quality score computation; penalty-only model (Phase 002 recalibration) |
| `scripts/extractors/session-extractor.ts` | `resolveProjectPhase()` for projectPhase override |
| `scripts/core/workflow.ts` | JSON/file authority behavior, structured-input routing, trigger-phrase filtering, post-save review invocation gating, and SHA1-based pre-save overlap checks |
| `scripts/core/post-save-review.ts` | Post-save review logic, severity grading, MEMORY METADATA-aware field checks, `computeReviewScorePenalty()`, multi-token path fragment detection |
| `scripts/extractors/contamination-filter.ts` | Contamination filter extension: 4 additional text fields, 18 new patterns (33 -> 51 total) |
| `scripts/lib/validate-memory-quality.ts` | V13 YAML parsing and memory-quality validation |
| `scripts/renderers/template-renderer.ts` | Optional-placeholder handling for compact tool/exchange sections |
| `templates/context_template.md` | Compact `toolCalls` and `exchanges` template sections |
| `scripts/memory/generate-context.ts` | CLI help text and structured-first save workflow documentation |
| `mcp_server/lib/providers/retry-manager.ts` | `getEmbeddingRetryStats()` accessor for embedding retry visibility |
| `mcp_server/handlers/memory-crud-health.ts` | `embeddingRetry` block in `memory_health` MCP response |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Structured-input precedence for `--stdin` and `--json` |
| `scripts/tests/input-normalizer-unit.vitest.ts` | Fast-path field propagation, FILES conversion, and enum validation |
| `scripts/tests/post-save-review.vitest.ts` | Post-save review PASS-path coverage and score-penalty computation |
| `scripts/tests/project-phase-e2e.vitest.ts` | Explicit `projectPhase` propagation through the save pipeline |
| `scripts/tests/quality-scorer-calibration.vitest.ts` | Live scorer calibration coverage |
| `scripts/tests/task-enrichment.vitest.ts` | Summary enrichment and count preservation behavior |
| `scripts/tests/template-mustache-sections.vitest.ts` | Compact `toolCalls` and `exchanges` template sections |
| `scripts/tests/trigger-phrase-filter.vitest.ts` | Trigger-phrase filter coverage for path fragments, short tokens, and shingle subsets |
| `scripts/tests/validation-v13-v14-v12.vitest.ts` | V12/V13/V14 validation behavior |
| `scripts/tests/workflow-e2e.vitest.ts` | End-to-end save pipeline with structured JSON inputs |
| `mcp_server/tests/embedding-retry-stats.vitest.ts` | `embeddingRetry` type and zero-state contract |
| `mcp_server/tests/retry-manager-health.vitest.ts` | Zero-DB `embeddingRetry` snapshot accessor coverage |

---

## 5. VERIFICATION SOURCES

- `cd .opencode/skill/system-spec-kit/scripts && npm run lint`
- `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/generate-context-cli-authority.vitest.ts tests/input-normalizer-unit.vitest.ts tests/post-save-review.vitest.ts tests/project-phase-e2e.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/template-mustache-sections.vitest.ts tests/trigger-phrase-filter.vitest.ts tests/validation-v13-v14-v12.vitest.ts tests/workflow-e2e.vitest.ts`
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/embedding-retry-stats.vitest.ts tests/retry-manager-health.vitest.ts`

---

## 6. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: JSON mode structured summary hardening
- Source spec: `009-perfect-session-capturing/016-json-mode-hybrid-enrichment`
- Phase: 016
