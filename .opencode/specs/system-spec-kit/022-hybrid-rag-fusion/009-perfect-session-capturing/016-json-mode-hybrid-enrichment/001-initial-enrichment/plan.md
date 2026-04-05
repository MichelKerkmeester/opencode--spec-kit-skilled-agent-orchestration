---
title: "...-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/001-initial-enrichment/plan]"
description: "This corrected plan reflects the narrower phase-016 scope that actually shipped: structured JSON summary support, downstream hardening, and documentation alignment rather than a dedicated file-backed hybrid enrichment branch."
trigger_phrases:
  - "implementation"
  - "json mode"
  - "hybrid enrichment"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: JSON Mode Hybrid Enrichment (Phase 1B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | OpenCode `system-spec-kit` runtime scripts |
| **Storage** | Markdown memory files plus runtime metadata derived from git/spec folders |
| **Testing** | `npx tsc --noEmit`, `npx tsc -b`, targeted runtime-memory validation |

### Overview

This corrected plan keeps phase 016 aligned to the code that actually shipped in this tree. The delivered work expanded the structured JSON contract with summary fields such as `toolCalls` and `exchanges`, preserved file-backed JSON authority, and added Wave 2 hardening around counts, confidence, and operator guidance.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement and contamination boundary are documented in `spec.md`.
- [x] Success criteria cover structured summary support, file-backed JSON authority, and backward compatibility.
- [x] Dependencies across workflow, session extraction, and input normalization are identified.

### Definition of Done

- [x] File-backed JSON remains on the authoritative structured path.
- [x] Structured JSON summary fields and Wave 2 hardening are documented truthfully.
- [x] Validation, build checks, and phase documentation all pass for this phase.

### AI Execution Protocol
- [x] Pre-Task Checklist documented for this implementation pass.
- [x] Execution Rules documented for this implementation pass.
- [x] Status Reporting Format documented for this implementation pass.
- [x] Blocked Task Protocol documented for this implementation pass.

### Pre-Task Checklist
- [x] Re-read the current phase-016 markdown docs before editing.
- [x] Re-read the active level-3 templates before normalizing structure.
- [x] Keep edits scoped to this phase folder only.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope Lock | Only edit phase-016 markdown files needed for strict validation |
| Template First | Normalize headings and anchors to the active level-3 scaffold before polishing prose |
| Truth Discipline | Preserve delivered implementation facts and do not invent new runtime behavior |
| Verification | Re-run strict phase validation after each major documentation pass |

### Status Reporting Format

`Phase 016: <status> -> <artifact or validation result>`

### Blocked Task Protocol
1. Stop if a validator fix would require inventing undocumented implementation behavior.
2. Patch the smallest markdown surface that satisfies the validator.
3. Re-run strict validation before claiming completion.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Structured JSON contract hardening with a documentation-correction pass.

### Key Components

- **`session-types.ts`**: Adds shipped structured-summary fields such as `toolCalls` and `exchanges`.
- **`workflow.ts`**: Keeps file-backed JSON authoritative instead of routing it into a dedicated hybrid branch.
- **`generate-context.ts`**: Documents the structured JSON contract and structured-first operator workflow.
- **`session-extractor.ts`**: RC5 — `detectContextType()` fix and `explicitContextType` parameter.
- **`input-normalizer.ts`**: RC3/RC5 — fast-path keyDecisions + contextType propagation.
- **`collect-session-data.ts`**: RC1/RC5 — `_JSON_SESSION_SUMMARY` passthrough and `explicitContextType` threading.
- **`post-save-review.ts`**: New module — reads saved frontmatter, compares against JSON payload, reports issues.
- **Phase docs**: Record the narrower shipped scope and retire claims about an unimplemented branch.

### Data Flow

The caller submits structured JSON data. The shared contract accepts richer summary fields, file-backed payloads stay on the authoritative structured path, and later assembly logic preserves the Wave 2 fixes for counts, confidence, and operator-facing guidance. Wave 3 ensures all JSON payload fields (`sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType`) propagate correctly through the normalization and extraction pipeline to frontmatter, with a post-save review step as a safety net.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Extend runtime types with shipped structured-summary fields such as `toolCalls` and `exchanges`.
- [x] Confirm backward compatibility by keeping new structured fields optional.

### Phase 2: Core Implementation

- [x] Preserve file-backed JSON authority in `workflow.ts`.
- [x] Carry shipped structured-summary support through the shared contract and help text.
- [x] Document the real JSON contract and the Wave 2 count/confidence fixes.
- [x] Ship Wave 2 fixes for decision confidence, outcomes truncation, changed-file counts, and template-level count overrides.

### Phase 3: Verification

- [x] Run TypeScript verification.
- [x] Confirm V8 safety guard behavior remains intact.
- [x] Confirm documentation and implementation summary reflect the delivered behavior.

### Wave 3: JSON Payload Field Propagation Fixes + Post-Save Review

- [x] RC5: Fix `detectContextType()` ordering and add `explicitContextType` threading through session-extractor, input-normalizer, collect-session-data.
- [x] RC3: Fix fast-path `keyDecisions` propagation in input-normalizer (create `_manualDecisions` + decision observations).
- [x] RC2: Merge `_manualTriggerPhrases` into `preExtractedTriggers` in workflow.ts before folder token dedup.
- [x] RC1: Thread `_JSON_SESSION_SUMMARY` through session-types, collect-session-data, and workflow.ts as first title candidate.
- [x] Create `scripts/core/post-save-review.ts` — 6-check quality review module with severity grading.
- [x] Integrate Step 10.5 in workflow.ts (after file write, before indexing).
- [x] Update the 4 tracked instruction files present in this repo (CLAUDE.md, AGENTS.md, GEMINI.md, AGENTS_example_fs_enterprises.md).
- [x] Update feature catalog and manual testing playbook.
- [x] TypeScript verification passes cleanly.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Type correctness across new fields and call sites | `npx tsc --noEmit` |
| Build | Dist output generation for the updated script set | `npx tsc -b` |
| Manual | JSON-mode examples covering structured summary fields and authoritative file-backed behavior | Targeted end-to-end payload checks |
| Regression | Wave 2 count, confidence, and outcome behavior | Existing runtime-memory validation flows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `session-types.ts` shared contract | Internal | Green | Structured-summary fields would disappear from the JSON path if it regressed |
| `workflow.ts` file-backed authority check | Internal | Green | File-backed JSON could accidentally re-enter stateless flow if it regressed |
| `collectSessionData()` template assembly | Internal | Green | Counts and confidence could regress if Wave 2 ordering changed |
| Operator help text and phase docs | Internal | Green | Users and maintainers would be misled if contract docs drifted again |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The structured-summary contract or Wave 2 hardening regress, or the phase docs drift away from shipped behavior again.
- **Procedure**: Revert the phase-specific updates in `session-types.ts`, `workflow.ts`, `generate-context.ts`, and the phase-016 markdown pack, then rerun TypeScript validation and the targeted runtime-memory tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Types ───► Structured JSON Contract ───► Wave 2 Hardening ───► Validation and Docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core implementation |
| Core implementation | Setup | Verification |
| Wave 2 fixes | Core implementation | Verification |
| Verification | Core implementation, Wave 2 fixes | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | ~1 hour |
| Core Implementation | Medium | ~2-4 hours |
| Wave 2 Fixes | Medium | ~1-2 hours |
| Verification | Medium | ~1 hour |
| **Total** | | **~7-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Backward compatibility maintained through optional fields.
- [x] Verification commands identified before rollout.
- [x] Structured-first authority boundary explicitly documented.

### Rollback Procedure

1. Revert the phase-specific code and documentation changes.
2. Re-run TypeScript validation.
3. Re-test structured JSON save scenarios.
4. Confirm summary-field support, count handling, and authority behavior match pre-change expectations.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase changes runtime transformation logic only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌────────────────────┐     ┌──────────────────────┐
│ Type Support │────►│ Structured Contract│────►│ Session Data Output  │
└──────────────┘     └─────────┬──────────┘     └──────────┬───────────┘
                               │                           │
                               ▼                           ▼
                      ┌────────────────────┐      ┌──────────────────────┐
                      │ Wave 2 Hardening   │─────►│ Docs and Verification │
                      └────────────────────┘      └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Types | None | New structured-summary contracts | Structured path, docs |
| Structured contract | Types | Authoritative file-backed JSON behavior | Session output |
| Session output | Structured contract | Final counts, confidence, and outcomes behavior | Verification |
| Validation/docs | Types, session output | Truthful operator contract and phase record | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Add optional structured-summary type support** - short critical path starter because the later contract docs depend on the shape.
2. **Preserve file-backed JSON authority** - critical because phase 016 did not ship a dedicated hybrid branch.
3. **Document the Wave 2 count/confidence fixes accurately** - critical because incorrect descriptions would recreate the truthfulness gap.
4. **Validate builds and phase-pack consistency** - critical because both the scripts and the docs are correctness-sensitive.

**Total Critical Path**: Setup -> structured contract -> Wave 2 hardening -> verification

**Parallel Opportunities**:

- Help text and implementation-summary updates can proceed once the structured field shape is finalized.
- Research archival framing can land in parallel after the corrected phase scope is settled.
<!-- /ANCHOR:critical-path -->
