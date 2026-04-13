---
title: "Implementation Plan: Input Normalizer Fast-Path Fix [system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/008-input-normalizer-fastpath-fix/plan]"
description: "Apply a minimal additive patch to fast-path normalization, rebuild the scripts workspace, rerun the failing save repro, and close with validator-clean Level-1 docs."
trigger_phrases:
  - "input normalizer plan"
  - "fast-path fix plan"
  - "003 phase 8 plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/008-input-normalizer-fastpath-fix"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Input Normalizer Fast-Path Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, npm workspace scripts |
| **Framework** | `system-spec-kit` scripts workspace |
| **Storage** | Repo-local TS sources plus JSON-mode temp payload under `/tmp/` |
| **Testing** | `npm run build`, `node .../generate-context.js`, Vitest |

### Overview
Keep the patch additive: coerce only plain strings in the fast-path arrays, reuse existing slow-path builders for mixed payload enrichments, and avoid any surrounding refactor. After the patch lands, rebuild the scripts workspace, replay the exact failing save command, rerun the memory-quality regression suite, and capture the outcome in this Level-1 child phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Diagnostic root cause reviewed from the original B4 diagnostic report captured during the implementation pass
- [x] Repro payload available at `/tmp/save-context-data.json`
- [x] Exact source files and existing unit test coverage located

### Definition of Done
- [x] Fast-path string coercion added without changing object-shaped callers
- [x] Fast-path enrichment merge covers the documented mixed payload fields
- [x] `npm run build` exits 0
- [x] The failing structured-save repro exits 0 and creates a new memory file
- [x] Requested Vitest regression suite matches or exceeds the prior baseline
- [x] This Level-1 phase validates cleanly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal fast-path normalization patch plus focused regression coverage.

### Key Components
- **`normalizeInputData()` fast path**: coerces only string entries while preserving existing object entries.
- **Fast-path enrichment merge**: reuses session-summary, next-step, decision, file, tool-call, and exchange enrichment behavior when mixed payloads are supplied.
- **`generate-context.ts` help text**: keeps CLI wording aligned with real session metadata behavior.
- **Focused Vitest coverage**: proves both string coercion and enrichment merge without widening the patch scope.

### Data Flow
Structured JSON input -> `normalizeInputData()` fast path -> normalized evidence arrays -> workflow save -> post-save quality review -> memory file output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Patch
- [x] Read the normalizer fast path, slow-path enrichments, and CLI help text source.
- [x] Add string coercion guards for `user_prompts`, `observations`, and `recent_context`.
- [x] Merge slow-path enrichment handling into the fast-path branch.
- [x] Correct the `--session-id` help text in the TypeScript source.

### Phase 2: Verification
- [x] Rebuild the scripts workspace with `npm run build`.
- [x] Re-run the exact `/tmp/save-context-data.json` repro command and inspect the created memory file.
- [x] Run the requested memory-quality regression suite.
- [x] Run the direct `input-normalizer` unit test file.

### Phase 3: Documentation
- [x] Add focused unit coverage for the fast-path fix.
- [x] Scaffold this new Level-1 child phase with post-implementation results.
- [x] Validate the child phase and then re-validate the parent packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Scripts workspace compile | `npm run build` |
| Repro | Structured-save failing case | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation` |
| Regression | Memory-quality suite | `npx vitest run --config ../mcp_server/vitest.config.ts --root . ...` |
| Unit | Normalizer-specific coverage | `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/input-normalizer-unit.vitest.ts` |
| Spec validation | Phase docs | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing TypeScript builders in `input-normalizer.ts` | Internal | Green | Needed to keep the patch additive instead of duplicating normalization behavior |
| Original B4 diagnostic report (implementation-time artifact) | Internal | Green | Confirms the root cause and the required fix shape |
| `/tmp/save-context-data.json` | Internal | Green | Required for the exact save repro verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build breaks, regression counts fall below baseline, or the repro still throws `INSUFFICIENT_CONTEXT_ABORT`.
- **Procedure**: Revert the fast-path patch, inspect the failing normalization output, narrow the change further, and rebuild before retrying the repro.
<!-- /ANCHOR:rollback -->
