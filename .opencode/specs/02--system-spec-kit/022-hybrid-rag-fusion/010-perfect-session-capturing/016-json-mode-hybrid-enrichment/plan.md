---
title: "Implementation Plan: JSON Mode Hybrid Enrichment (Phase 1B)"
description: "This phase adds a safe file-source enrichment path and explicit JSON metadata overrides so JSON-mode saves stay both accurate and contamination-safe."
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

The implementation keeps JSON mode as the safe default for multi-spec sessions while restoring the metadata that was lost when file-backed inputs skipped all enrichment. The plan stays additive: extend types, enrich only safe metadata, honor explicit JSON overrides, and harden the path with Wave 2 quality fixes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement and contamination boundary are documented in `spec.md`.
- [x] Success criteria cover status, git provenance, counts, and backward compatibility.
- [x] Dependencies across workflow, session extraction, and input normalization are identified.

### Definition of Done

- [x] File-backed JSON mode enriches only safe metadata.
- [x] Explicit `session` and `git` fields override heuristics where intended.
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

Additive pipeline hardening with a split enrichment path.

### Key Components

- **`workflow.ts`**: Routes file-backed inputs through `enrichFileSourceData()` instead of short-circuiting all enrichment.
- **`collect-session-data.ts`**: Converts explicit JSON metadata into final session fields and count outputs.
- **`input-normalizer.ts`**: Rejects malformed new fields before they can affect the save pipeline.
- **`generate-context.ts`**: Documents the operator-facing JSON contract.

### Data Flow

The caller submits JSON data. Normalization validates optional `session` and `git` blocks, workflow enrichment merges safe provenance for file-backed inputs, and session collection applies explicit priority rules so the final template output reflects the caller’s authoritative metadata instead of falling back too early.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Extend runtime types with `SessionMetadata`, `GitMetadata`, and supporting optional fields.
- [x] Confirm backward compatibility by keeping all new fields optional.

### Phase 2: Core Implementation

- [x] Add `enrichFileSourceData()` and route file-backed sources into the safe enrichment path.
- [x] Apply session and git priority rules in `collectSessionData()`.
- [x] Update help text and input validation for the new JSON contract.
- [x] Ship Wave 2 fixes for decision confidence, outcomes truncation, changed-file counts, and template-level count overrides.

### Phase 3: Verification

- [x] Run TypeScript verification.
- [x] Confirm V8 safety guard behavior remains intact.
- [x] Confirm documentation and implementation summary reflect the delivered behavior.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Type correctness across new fields and call sites | `npx tsc --noEmit` |
| Build | Dist output generation for the updated script set | `npx tsc -b` |
| Manual | JSON-mode examples covering session/git override behavior | Targeted end-to-end payload checks |
| Regression | Wave 2 count, confidence, and outcome behavior | Existing runtime-memory validation flows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `extractGitContext()` | Internal | Green | Git provenance and description enhancement fall back to explicit JSON input only |
| `extractSpecFolderContext()` | Internal | Green | Trigger phrases and decisions stop enriching file-backed inputs |
| `collectSessionData()` template assembly | Internal | Green | Counts and status could regress if override ordering is wrong |
| Input normalization pipeline | Internal | Green | Malformed JSON blocks could bypass validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: File-backed JSON saves start leaking observations, or explicit metadata overrides stop working.
- **Procedure**: Revert the phase-specific changes in `workflow.ts`, `collect-session-data.ts`, `session-types.ts`, `input-normalizer.ts`, and `generate-context.ts`, then rerun TypeScript validation and sample save flows.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Types ───► Safe Enrichment ───► Session Aggregation ───► Validation and Docs
                    └────────► Wave 2 Fixes ────────────┘
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
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | ~1 hour |
| Core Implementation | High | ~4-6 hours |
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
- [x] V8-safety boundary explicitly documented.

### Rollback Procedure

1. Revert the phase-specific code changes.
2. Re-run TypeScript validation.
3. Re-test file-backed JSON save scenarios.
4. Confirm counts, provenance, and safety behavior match pre-change expectations.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase changes runtime transformation logic only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌────────────────────┐     ┌──────────────────────┐
│ Type Support │────►│ Safe File Enrich   │────►│ Session Data Output  │
└──────────────┘     └─────────┬──────────┘     └──────────┬───────────┘
                               │                           │
                               ▼                           ▼
                      ┌────────────────────┐      ┌──────────────────────┐
                      │ Input Validation   │─────►│ Docs and Verification │
                      └────────────────────┘      └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Types | None | New field contracts | Enrichment, validation |
| Safe enrichment | Types | Provenance, descriptions, merged context | Session output |
| Session output | Safe enrichment | Final status, counts, git fields | Verification |
| Validation/docs | Types, session output | Usable operator contract and confidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Add optional type support** - short critical path starter because all later stages depend on the shape.
2. **Route file-backed JSON mode through safe enrichment** - critical because it restores provenance without reopening contamination.
3. **Apply explicit session/git priority rules and template count fixes** - critical because incorrect ordering would negate the feature.
4. **Validate builds and sample save behavior** - critical because the path is correctness-sensitive.

**Total Critical Path**: Setup -> safe enrichment -> session aggregation -> verification

**Parallel Opportunities**:

- Help text and validation updates can proceed once the JSON field shape is finalized.
- Wave 2 fixes can land in parallel after the base safe-enrichment path is stable.
<!-- /ANCHOR:critical-path -->
