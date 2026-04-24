---
title: "...optimization/002-continuity-memory-runtime/002-memory-quality-remediation/010-memory-save-heuristic-calibration/plan]"
description: "Execution plan for packet 010 covering schema, sanitizer, validator, D5, dist rebuild, strict validation, and wild-save verification."
trigger_phrases:
  - "010 heuristic calibration plan"
  - "memory save calibration plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/010-memory-save-heuristic-calibration"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Memory Save Heuristic Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime helpers plus Markdown packet docs |
| **Runtime Surface** | system-spec-kit memory-save pipeline |
| **Primary Entry Point** | `scripts/dist/memory/generate-context.js` |
| **Testing** | focused vitest lanes, full `npm test`, strict packet validation, real wild save |

### Overview

Implement the remaining schema, sanitizer, validator, D5, and truncation-helper fixes in one bounded packet, then prove the result on the compiled dist entrypoint against the live `026-graph-and-context-optimization` parent folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Both motivating audit reports were read end-to-end before runtime edits.
- [x] The `009-post-save-render-fixes` packet was treated as the soft predecessor and its dist-plus-wild-save bar stayed in force.
- [x] The edit scope stayed inside the approved runtime files, tests, packet docs, and parent phase-map surfaces.

### Definition of Done

- [x] Every shipped lane has focused regression coverage.
- [x] `scripts/dist` is rebuilt after the TypeScript edits land.
- [x] `cd .opencode/skill/system-spec-kit/scripts && npm test` passes.
- [x] The packet validates strictly.
- [x] The real dist-based save passes with zero quality-gate failures and semantic indexing enabled.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read the RCA and skipped-recommendation audits before changing any lane.
- Re-confirm the `009` packet boundary before touching shared save helpers.
- Keep the packet-local docs synchronized with the runtime verification evidence.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-010 | Only modify the approved runtime files, tests, and packet/parent docs | Prevents drift into unrelated 026 runtime work |
| AI-ORDER-010 | Ship runtime fixes before packet closeout edits | Keeps the docs anchored to actual code and command output |
| AI-VERIFY-010 | Add or extend at least one regression per shipped lane | Makes every calibration auditable |
| AI-E2E-010 | Finish with the compiled dist entrypoint and a real parent-folder save | Proves the CLI behavior, not just the TypeScript source |

### Status Reporting Format

- Start state: active lane or verification gate.
- Work state: changed runtime surface and proving test.
- End state: completed, running, or blocked.

### Blocked Task Protocol

1. Stop if a fix would expand beyond the approved runtime or packet-doc scope.
2. Record the blocker and owner surface in the packet docs.
3. Keep all finished lanes reviewable while the blocker is reported explicitly.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Bounded helper remediation on top of the existing memory-save pipeline

### Key Components

- `utils/input-normalizer.ts`
- `core/workflow.ts`
- `core/memory-metadata.ts`
- `lib/trigger-phrase-sanitizer.ts`
- `lib/validate-memory-quality.ts`
- `core/find-predecessor-memory.ts`
- `core/post-save-review.ts`
- `extractors/decision-extractor.ts`

### Data Flow

Structured JSON payload -> input normalization -> workflow merge -> render/template population -> post-save validation and review -> semantic indexing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Bind the new Level 3 packet under `003-memory-quality-remediation`.
- [x] Update the parent phase map to ten child phases.
- [x] Map each user-defined lane to concrete runtime owners.

### Phase 2: Runtime Implementation

- [x] Lane 1: explicit `title` and `description` schema acceptance and workflow propagation.
- [x] Lane 2: manual-vs-extracted trigger handling and REC-006 narrowing.
- [x] Lane 3: V8 regex narrowing.
- [x] Lane 4: V12 slug/prose normalization and `filePath` propagation.
- [x] Lane 5: explicit `causalLinks`, D5 alignment, and REC-018 description-aware fallback.
- [x] Lane 6: `decision-extractor.ts` truncation-helper migration.
- [x] Lane 9: parent packet sync.

### Phase 3: Verification and Closeout

- [x] Add or extend focused regression coverage for every shipped lane.
- [x] Rebuild `scripts/dist`.
- [x] Run `scripts` and `mcp_server` test suites and classify unrelated failures.
- [x] Validate the packet strictly.
- [x] Run the real dist-based save verification and close the packet docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Focused lane tests | One or more tests per lane | Vitest under `scripts/tests/` |
| Full scripts regression | Entire `scripts` workspace | `cd .opencode/skill/system-spec-kit/scripts && npm test` |
| Full MCP regression | Entire `mcp_server` workspace | `cd .opencode/skill/system-spec-kit/mcp_server && npm test` |
| Wild save verification | Real parent-folder save on compiled dist | `node scripts/dist/memory/generate-context.js ...` |
| Packet validation | Spec-doc compliance | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict ...` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `009-post-save-render-fixes` | Soft predecessor | Required context | Defines the current acceptance bar |
| Motivating RCA and skipped-rec audits | Evidence | Required | Drive the exact lane contracts |
| Voyage embedding provider | Runtime dependency | Available | Needed for the final semantic-indexing proof |
| Parent `026-graph-and-context-optimization` packet | Runtime target | Required | Owns the real verification save location |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a calibration fix causes broader save-path regressions or breaks strict packet validation.
- **Procedure**:
  1. Revert the affected lane only.
  2. Re-run the focused lane tests and the full `scripts` suite.
  3. Keep the packet docs explicit about the reverted lane while remaining fixes stay reviewable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Audit reads and packet scaffold
        ->
Runtime lane fixes
        ->
Focused regression coverage
        ->
dist rebuild and full tests
        ->
strict validation and wild save
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and parent sync | Medium | 0.5 day |
| Runtime lane fixes | High | 1 day |
| Regression coverage and rebuild | Medium | 0.5 day |
| Validation and wild save | Medium | 0.5 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Runtime changes are backed by focused regression tests.
- [x] The compiled dist artifacts were rebuilt after the final source edits.
- [x] The packet docs cite actual command outputs and not planned-only evidence.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: revert the affected runtime lane and rerun the verification save rather than editing any `memory/` files directly.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
RCA + skipped recommendations
          ->
009-post-save-render-fixes
          ->
010-memory-save-heuristic-calibration
          ->
optional historical repair follow-on
```
<!-- /ANCHOR:dependency-graph -->
