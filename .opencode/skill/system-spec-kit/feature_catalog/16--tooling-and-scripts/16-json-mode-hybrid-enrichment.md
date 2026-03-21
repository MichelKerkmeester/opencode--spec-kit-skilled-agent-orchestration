---
title: "JSON mode hybrid enrichment"
description: "Structured JSON summary support for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening for decision confidence, truncated titles, git_changed_file_count stability, and template count preservation."
---

# JSON mode hybrid enrichment

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. FEATURE BREAKDOWN](#3--feature-breakdown)
- [4. SOURCE FILES](#4--source-files)
- [5. VERIFICATION SOURCES](#5--verification-sources)
- [6. SOURCE METADATA](#6--source-metadata)

## 1. OVERVIEW

Phase 016 added structured JSON summary support to the session capturing pipeline. The shipped implementation accepts richer caller-authored session data via `--json` and `--stdin` inputs, including fields like `toolCalls` and `exchanges`. It also preserves file-backed JSON authority (preventing silent fallback into stateless reconstruction) and ships Wave 2 hardening fixes for decision confidence, truncated outcome titles, `git_changed_file_count` stability, and template count preservation.

The original phase design described a broader file-backed hybrid enrichment path, but only the narrower structured-summary contract and hardening fixes shipped.

---

## 2. CURRENT REALITY

The session capturing pipeline now handles structured JSON summaries as follows:

1. `generate-context.js --json '<data>'` and `generate-context.js --stdin` accept structured JSON with fields like `toolCalls`, `exchanges`, `sessionSummary`, and the documented snake_case contract (`user_prompts`, `recent_context`, `trigger_phrases`).
2. File-backed JSON (passed as a file path argument) stays on the structured path and does not silently fall back into hybrid/stateless reconstruction.
3. Older JSON payloads that omit the newer structured-summary fields remain backward compatible.
4. Decision confidence values from explicit input are preserved rather than overwritten by heuristics.
5. Truncated outcome/title handling respects explicit input values instead of silently replacing them.
6. `git_changed_file_count` follows a stable 3-tier priority chain: explicit count > enrichment-derived count > provenance-based count.
7. Template assembly preserves explicit session-level message and tool counts when conversation arrays are sparse.
8. After the memory file is written (Step 10.5), a post-save quality review validates that JSON payload fields propagated correctly to frontmatter before indexing begins.
9. JSON payload fields `sessionSummary`, `triggerPhrases`, `keyDecisions`, and `contextType` now properly flow through to rendered frontmatter via RC1–RC5 fixes (see §3.4).

---

## 3. FEATURE BREAKDOWN

### 3.1 Structured JSON summary contract

- `toolCalls` and `exchanges` are accepted as first-class fields in the structured JSON input.
- Snake_case field names (`user_prompts`, `recent_context`, `trigger_phrases`) are accepted alongside the existing camelCase keys.
- The input normalizer maps both conventions into the internal representation without data loss.

### 3.2 File-backed JSON authority

- When a file path is provided as input, the content is treated as structured JSON.
- The workflow does not reopen the abandoned hybrid/stateless enrichment branch for file-backed inputs.
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
- Emits a machine-readable review with severity levels (HIGH/MEDIUM/LOW) so callers can surface actionable field-level failures.
- Skipped automatically in recovery mode and stateless mode where no authoritative JSON payload is available.
- See feature catalog entry `13--memory-quality-and-indexing/19-post-save-quality-review.md` for full specification.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `scripts/types/session-types.ts` | Structured JSON contract types for `toolCalls` and `exchanges` |
| `scripts/utils/input-normalizer.ts` | Snake_case JSON compatibility, structured-summary normalization |
| `scripts/extractors/collect-session-data.ts` | Wave 2 count, confidence, and outcome handling |
| `scripts/core/workflow.ts` | JSON/file authority behavior, structured-input routing |
| `scripts/memory/generate-context.ts` | CLI help text and structured-first save workflow documentation |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/generate-context-cli-authority.vitest.ts` | Structured-input precedence for `--stdin` and `--json` |
| `scripts/tests/task-enrichment.vitest.ts` | Summary enrichment and count preservation behavior |
| `scripts/tests/workflow-e2e.vitest.ts` | End-to-end save pipeline with structured JSON inputs |

---

## 5. VERIFICATION SOURCES

- `cd .opencode/skill/system-spec-kit/scripts && npm run check`
- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/generate-context-cli-authority.vitest.ts tests/task-enrichment.vitest.ts tests/workflow-e2e.vitest.ts`

---

## 6. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: JSON mode hybrid enrichment
- Source spec: `010-perfect-session-capturing/016-json-mode-hybrid-enrichment`
- Phase: 016
