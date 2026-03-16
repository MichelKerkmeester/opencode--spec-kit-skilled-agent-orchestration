---
title: "Implementation Summary: Outsourced Agent Handback Protocol"
description: "External CLI handback protocol — hard-fail JSON input, next-step persistence, redact-and-scrub security, with post-010 sufficiency/contamination gate awareness."
trigger_phrases: ["outsourced agent summary", "memory handback summary", "runtime memory inputs"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: Outsourced Agent Handback Protocol

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-03-14 |
| **Parent** | 010-perfect-session-capturing |
| **R-Item** | R-15 |
| **Total LOC** | ~600 (runtime ~60, tests ~400, CLI docs ~540) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### 1. Runtime Input Hardening (`data-loader.ts`)

Three-branch `EXPLICIT_DATA_FILE_LOAD_FAILED` error contract: ENOENT, bad JSON, validation failure. No fallback to native capture. Path security via `sanitizePath()` against fixed allowlist.

### 2. Next-Step Persistence (`input-normalizer.ts` + `session-extractor.ts`)

Accepts `nextSteps` (camelCase, priority) and `next_steps` (snake_case). `buildNextStepsObservation()` → `Next:` / `Follow-up:` facts. `extractNextAction()` via `findFactByPattern()` → `NEXT_ACTION`. Dedup guard via `hasPersistedNextStepsObservation()`.

### 3. CLI Handback Documentation (4 skills + 4 templates)

Identical 7-step Memory Handback Protocol in all 4 CLI skills (`cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`): extract `MEMORY_HANDBACK` section, parse to JSON, redact secrets, write `/tmp/save-context-data.json`, run `generate-context.js`, index.

### 4. Code Hardening

Empty-array guard on `buildNextStepsObservation`, `extractNextAction` DRY refactor via `findFactByPattern`, test expansion from 5 to 25 tests.

### 5. Post-010 Gate Awareness

File-backed saves bypass alignment and quality gates but hit sufficiency and contamination gates. Minimum viable payload documented for callers.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

3 implementation phases:
1. **Runtime safeguards**: Hard-fail JSON errors, normalize next-steps, regression tests
2. **CLI handback documentation**: 4 SKILL files + 4 prompt templates with redact-and-scrub guidance
3. **Verification and reconciliation**: Remove stale claims, record current alignment drift, validate

Post-010 integration analysis added as a fourth delivery layer — gate interaction documentation and minimum payload guidance.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Hard-fail over silent fallback**: Explicit JSON errors throw immediately — no native capture fallback. Prevents mysterious behavior when outsourced CLI writes bad data.
2. **camelCase priority**: When both `nextSteps` and `next_steps` present, camelCase wins. Consistent with broader normalizer convention.
3. **Sufficiency gate not bypassed for file-backed saves**: By design — thin outsourced payloads should fail rather than index low-value context.
4. **Quality gate IS bypassed for file-backed saves**: `_source !== 'file'` guard at `workflow.ts` line 1633. This is intentional — JSON callers control their own data quality.
5. **Identical protocol across all 4 CLIs**: Same 7-step flow, same delimiters, same error handling. Prevents drift.
<!-- /ANCHOR:decisions -->

---

## Post-010 Pipeline Gate Matrix

| Gate | File-Backed? | Stateless? | Code |
|------|-------------|-----------|------|
| Input validation | Yes | N/A | `EXPLICIT_DATA_FILE_LOAD_FAILED` |
| Alignment | **No** | Yes | `ALIGNMENT_BLOCK` |
| Sufficiency | **Yes** | Yes | `INSUFFICIENT_CONTEXT_ABORT` |
| Contamination | **Yes** | Yes | `CONTAMINATION_GATE_ABORT` |
| Quality | **No** | Yes | `QUALITY_GATE_ABORT` |

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `runtime-memory-inputs.vitest.ts` | 25/25 PASS |
| Alignment drift | 0 findings, 0 warnings |
| `npm run lint` | PASS |
| Live outsourced CLI dispatch | 583-line memory file |
| Spec validation | 0 errors, 0 warnings |

**Verification Date**: 2026-03-14
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **L1**: CLI docs do not yet document `INSUFFICIENT_CONTEXT_ABORT` as a possible response code (gap in REQ-006 for future update)
2. **L2**: Native capture mode for external CLIs (same workspace) not covered by handback protocol
3. **L3**: Snake_case field names not yet shown in CLI prompt template JSON examples (documented camelCase only)
<!-- /ANCHOR:limitations -->
