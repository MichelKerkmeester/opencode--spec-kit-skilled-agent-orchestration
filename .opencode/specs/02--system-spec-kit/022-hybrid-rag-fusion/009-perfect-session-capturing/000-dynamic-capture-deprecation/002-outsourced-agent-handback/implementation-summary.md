---
title: "Implementation Summary: Outsourced Agent Handback Protocol"
description: "External CLI handback protocol: hard-fail JSON input, next-step persistence, richer caller guidance, and post-010 save-gate awareness."
trigger_phrases: ["outsourced agent summary", "memory handback summary", "runtime memory inputs"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: Outsourced Agent Handback Protocol

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-03-16 |
| **Parent** | 009-perfect-session-capturing |
| **R-Item** | R-15 |
| **Total LOC** | ~700 (runtime ~60, tests ~470, CLI docs + catalog ~620) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### 1. Runtime Input Hardening (`data-loader.ts`)

Three-branch `EXPLICIT_DATA_FILE_LOAD_FAILED` error contract: ENOENT, bad JSON, validation failure. No fallback to native capture. Path security via `sanitizePath()` against the fixed allowlist.

### 2. Next-Step Persistence (`input-normalizer.ts` + `session-extractor.ts`)

Accepts `nextSteps` (camelCase, priority) and `next_steps` (snake_case). `buildNextStepsObservation()` emits `Next:` / `Follow-up:` facts. `extractNextAction()` pulls the first persisted next-step fact into `NEXT_ACTION`.

### 3. CLI Handback Documentation (4 skills + 4 templates)

All 8 caller-facing handback docs now explain the same post-010 contract: extract `MEMORY_HANDBACK`, redact and scrub it, write `/tmp/save-context-data.json`, accept the documented snake_case fields, and expect `INSUFFICIENT_CONTEXT_ABORT` or `CONTAMINATION_GATE_ABORT` when the payload is too thin or cross-spec.

### 4. Feature-Catalog and Doc Regression Guardrail

The feature-catalog entry for outsourced handbacks now points at the current archived-branch phase path, and `scripts/tests/outsourced-agent-handback-docs.vitest.ts` locks the 8 CLI docs plus the catalog to the same rejection-code and payload-richness guidance.

### 5. Post-010 Gate Awareness

File-backed saves bypass stateless alignment and `QUALITY_GATE_ABORT`, but they still hit sufficiency and contamination gates and can still log non-blocking `QUALITY_GATE_FAIL` warnings that skip production indexing. Minimum viable payload guidance now documents that nuance explicitly for callers.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

3 implementation phases:
1. **Runtime safeguards**: Re-verify the explicit JSON hard-fail and next-step persistence behavior already shipped in the system-spec-kit runtime.
2. **CLI handback documentation**: Update the 4 SKILL files and 4 prompt templates with post-010 rejection codes, snake_case guidance, and richer `FILES` examples. Align the feature catalog and add a dedicated Vitest lane so the caller-facing contract does not drift silently.
3. **Verification and reconciliation**: Record fresh 2026-03-17 lint, Vitest, alignment-drift, retained JSON-mode handback evidence, and spec validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

1. **Hard-fail over silent fallback**: Explicit JSON errors throw immediately, with no native capture fallback. That keeps outsourced failures visible instead of silently mutating into a different capture mode.
2. **camelCase priority**: When both `nextSteps` and `next_steps` are present, camelCase wins. This stays consistent with the broader normalizer convention.
3. **Sufficiency gate not bypassed for file-backed saves**: Thin outsourced payloads should fail rather than index low-value context.
4. **File-backed saves bypass `QUALITY_GATE_ABORT`, not all quality validation**: The `_source !== 'file'` guard exempts file-backed saves from the abort path, but the workflow still emits `QUALITY_GATE_FAIL` warnings and skips production indexing when rendered validation rules fail.
5. **Identical protocol across all 4 CLIs**: Same delimiter, same rejection-code guidance, and same minimum payload expectations. This prevents drift.
<!-- /ANCHOR:decisions -->

### Post-010 Pipeline Gate Matrix

| Gate | File-Backed? | Stateless? | Code |
|------|-------------|-----------|------|
| Input validation | Yes | N/A | `EXPLICIT_DATA_FILE_LOAD_FAILED` |
| Alignment | **No** | Yes | `ALIGNMENT_BLOCK` |
| Sufficiency | **Yes** | Yes | `INSUFFICIENT_CONTEXT_ABORT` |
| Contamination | **Yes** | Yes | `CONTAMINATION_GATE_ABORT` |
| Quality abort | **No** | Yes | `QUALITY_GATE_ABORT` |
| Non-blocking quality validation | **Yes** | Yes | Warning-only (`QUALITY_GATE_FAIL`) |

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/runtime-memory-inputs.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts` | PASS (`2` files, `32` tests) |
| Alignment drift | PASS (`246` scanned, `0` findings, `0` warnings) |
| `npm run lint` | PASS |
| Rich JSON-mode handback | Wrote `memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md` (`556` lines) |
| Thin JSON-mode handback | Rejected with `INSUFFICIENT_CONTEXT_ABORT` before file write |
| Spec validation | 0 errors, 0 warnings |

**Verification Date**: 2026-03-17
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **L1**: File-backed saves can still write successfully while logging `QUALITY_GATE_FAIL` and skipping production indexing if rendered validation rules fail.
2. **L2**: Native capture mode for external CLIs (same workspace) is still outside this protocol’s scope.
3. **L3**: Structured payloads that arrive pre-populated with `user_prompts`, `recent_context`, or `observations` need equivalent durable evidence because they bypass part of the manual-format synthesis path.
<!-- /ANCHOR:limitations -->
