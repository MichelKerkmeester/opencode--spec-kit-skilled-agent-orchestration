---
title: "Implementation Plan: Perfect Session Capturing [template:level_3/plan.md]"
description: "Root-only documentation remediation to strict Level 3 template compliance with refreshed March 17, 2026 verification evidence."
trigger_phrases:
  - "implementation plan"
  - "spec 010 root docs"
  - "template compliance"
  - "verification refresh"
  - "cross cli proof"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, shell validation commands |
| **Framework** | system-spec-kit Level 3 template validation |
| **Storage** | Spec folder markdown under `.opencode/specs/.../010-perfect-session-capturing` |
| **Testing** | `validate.sh`, `check-completion.sh`, scripts and MCP verification lanes |

### Overview
This work rewrites the six root markdown files onto exact v2.2 Level 3 templates and aligns every root claim to fresh March 17, 2026 evidence. It preserves runtime behavior contracts while repairing root compliance blockers, checklist evidence formatting, and cross-CLI proof language.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root file ownership limited to six assigned markdown files.
- [x] Level 3 template source files reviewed before rewriting.
- [x] Fresh authoritative verification outputs available for root evidence refresh.

### Definition of Done
- [x] Root docs match required template headers, anchors, and ordering.
- [x] `implementation-summary.md` exists and is populated.
- [x] Root checklist completed items include valid priority and evidence context.
- [x] Broken research link prefix fixed to `research/research-pipeline-improvements.md`.
- [x] Root validation and completion checks no longer block on root markdown drift.
<!-- /ANCHOR:quality-gates -->

---

**AI EXECUTION PROTOCOL**

### Pre-Task Checklist
- [x] Root scope confirmed before edits.
- [x] Active Level 3 templates read before rewriting.
- [x] Fresh verification evidence captured before publishing completion language.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope Lock | Edit only the root markdown set and the minimal child phase-link metadata needed for recursive validation |
| Evidence First | Refresh command counts and live-proof language from current local reruns only |
| Boundary Safety | Do not change runtime loader order, JSON authority, or `memory_save` `dryRun` and `force` behavior |
| Completion | Do not claim closure until validation, completion, and targeted test lanes are rerun |

### Status Reporting Format

`STEP [N]: [status] -> [artifact/result]`

### Blocked Task Protocol
1. Stop at the first validator or test blocker that changes completion truth.
2. Record the exact file or lane that failed and the evidence gathered.
3. Patch only the minimum scope needed to restore truthful completion.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-first documentation remediation with evidence-first claim updates.

### Key Components
- **Level 3 templates**: Structural source of truth for required headers and anchors.
- **Root markdown set**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- **Validation stack**: `validate.sh` and `check-completion.sh`.
- **Evidence stack**: scripts and MCP lanes rerun on 2026-03-17.

### Data Flow
Template review -> root markdown rewrite -> evidence refresh -> root validation -> root completion check -> publish closure language.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read active Level 3 templates.
- [x] Collect current verification evidence.
- [x] Confirm root-only scope boundaries.

### Phase 2: Core Implementation
- [x] Rewrite `spec.md` to exact template structure and anchors.
- [x] Rewrite `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` to exact template structure.
- [x] Create `implementation-summary.md`.

### Phase 3: Verification
- [x] Rerun key evidence lanes and refresh counts/dates.
- [x] Run root validator and root completion checks.
- [x] Confirm cross-CLI proof text clearly separates fixture and live evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/Targeted | Session-capture scripts lanes | Vitest, Node test suites |
| Integration | MCP save-path targeted lanes | Vitest |
| Specialized | Hydra/docs and file watcher lanes | Vitest |
| Manual/Documentation | Root template and completion compliance | `validate.sh`, `check-completion.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/templates/level_3` | Internal | Green | Root docs cannot be rewritten to canonical structure |
| scripts verification lanes | Internal | Green | Evidence claims would be stale or unverifiable |
| MCP targeted lanes (`core`, Hydra/docs, file-watcher) | Internal | Green | Cross-surface proof would be incomplete |
| Root validator/completion scripts | Internal | Green | Cannot certify root compliance closure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Root validation/check-completion regression after markdown rewrite.
- **Procedure**: Restore prior root markdown revisions, re-apply template-first rewrite, rerun root checks, and republish evidence from passing outputs only.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Evidence) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Evidence |
| Evidence | Setup | Core, Verify |
| Core | Setup, Evidence | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30-60 minutes |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **3.5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Root-only file scope confirmed.
- [x] Current evidence captured from rerun outputs.
- [x] Template source reviewed before edits.

### Rollback Procedure
1. Revert only the six root markdown files.
2. Re-run root validation and completion checks.
3. Re-apply template-compliant rewrite with corrected sections.
4. Re-verify and republish.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ Evidence  │
                    │  Refresh  │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Template mapping | None | Required header/anchor map | Rewrite |
| Root rewrite | Template mapping, evidence capture | Template-compliant root docs | Validation |
| Validation/completion checks | Root rewrite | Compliance confirmation | Final closure |
| Evidence publication | Validation/completion checks | Accurate completion language | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Refresh evidence commands and counts** - 60-90 min - CRITICAL
2. **Rewrite all six root markdown files to template** - 90-150 min - CRITICAL
3. **Run root validation and completion checks** - 20-45 min - CRITICAL

**Total Critical Path**: 2.8-4.8 hours

**Parallel Opportunities**:
- scripts and MCP evidence lanes can run in parallel.
- root file drafting can proceed while non-root suites execute.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Evidence refresh complete | Current counts/dates captured (2026-03-17) | Phase 1 |
| M2 | Root rewrite complete | All six root docs on Level 3 template structure | Phase 2 |
| M3 | Root compliance closure | Root validation and completion checks pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Root Docs Must Track Verifiable Evidence Only

**Status**: Accepted

**Context**: Prior root docs failed template checks and included stale or over-broad claims.

**Decision**: Publish only rerunnable, dated evidence and keep fixture/live CLI proof explicitly separated.

**Consequences**:
- Improved trust in closure claims.
- Slightly higher maintenance burden to rerun and refresh evidence.

**Alternatives Rejected**:
- Continue with historic counts and inferred parity claims: rejected due verification risk.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
