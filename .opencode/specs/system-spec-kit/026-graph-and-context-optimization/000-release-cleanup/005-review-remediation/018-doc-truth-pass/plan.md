---
title: "Plan: Doc Truth Pass"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Level 2 implementation plan for Tier A documentation truth fixes."
trigger_phrases:
  - "031 doc truth plan"
  - "automation doc fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/018-doc-truth-pass"
    last_updated_at: "2026-04-29T13:50:55Z"
    last_updated_by: "cli-codex"
    recent_action: "Doc truth pass complete"
    next_safe_action: "Plan packet 032 next"
    blockers: []
    completion_pct: 100
---
# Plan: Doc Truth Pass

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TXT, JSON metadata |
| **Framework** | system-spec-kit Level 2 packet |
| **Scope** | Documentation-only remediation |
| **Testing** | Strict spec validator + targeted grep checks |
| **Runtime Code** | Read-only |

### Overview

This plan implements packet 031 from the 013 remediation backlog. It rewrites hook docs to distinguish actual runtime triggers from templates, corrects CCC command/path docs, replaces validation auto-fire wording with workflow-required validation gates, and adds trigger columns to broad automation summaries.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder identified. [EVIDENCE: user requested `018-doc-truth-pass`]
- [x] Source research identified. [EVIDENCE: `../017-automation-reality-supplemental-research/research/research-report.md` sections 2 and 5]
- [x] Runtime-code exclusion clear. [EVIDENCE: user constraint: no `.ts` / `.js` / `.py` changes]

### Definition of Done

- [x] Packet docs created with required metadata and continuity. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`]
- [x] Seven doc remediations applied. [EVIDENCE: target docs patched for hooks, CCC, architecture, validation, and trigger columns]
- [x] Strict validator passes with 0 errors. [EVIDENCE: `validate.sh --strict` final run]
- [x] Implementation summary records final verification. [EVIDENCE: `implementation-summary.md` verification table]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-cited documentation correction. Each broad automation claim should answer: what triggers it, whether it is default-on, and what the manual fallback is.

### Key Components

- **Hook contract docs**: Runtime-specific trigger matrix for Claude, Codex, Copilot, Gemini, and OpenCode.
- **Memory command docs**: CCC ownership corrected to direct MCP unless `/memory:manage` grows routing.
- **Validation docs**: Required operator gate with explicit `validate.sh --strict` command.
- **Trigger tables**: Small truth tables in broad docs to prevent "automatic" overclaiming.

### Data Flow

013 findings provide evidence and trigger classifications. The docs consume those classifications as prose and tables. No runtime behavior changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 2 packet docs and metadata.
- [x] Initialize continuity fields at 5%.

### Phase 2: Implementation
- [x] Patch Copilot and Codex hook docs in the shared hook-system reference.
- [x] Patch CCC command-home docs or command routing docs.
- [x] Patch CCC handler paths in the architecture guide.
- [x] Patch validation wording in AGENTS and SKILL docs.
- [x] Add trigger-column truth tables to CLAUDE, SKILL, MCP server README, and hook-system docs.

### Phase 3: Validation
- [x] Run strict validator on this packet.
- [x] Update implementation-summary.md to completion state.
- [x] Re-run strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packet validation | Required spec docs, anchors, frontmatter | `validate.sh --strict` |
| Scope check | Ensure no runtime code edits | `git diff --name-only` |
| Claim check | Automation docs mention trigger/manual fallback | `rg` targeted phrases |
| Metadata check | `description.json` and `graph-metadata.json` valid JSON | validator / `node` parser if needed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 013 research report | Internal | Available | Source-of-truth for trigger map |
| 012 research report | Internal | Available | Baseline P1 findings |
| Copilot README | Internal | Available | Authoritative Copilot-local contract |
| Codex README and user runtime files | Internal/user-local | Available | Authoritative live Codex registration evidence |
| Spec validator | Internal | Available | Required completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validator fails in a way that cannot be repaired without runtime code changes, or docs produce an irreconcilable contradiction with 013 evidence.
- **Procedure**: Revert only packet 031 docs and the documentation files changed by this packet. Runtime code remains untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Doc edits) -> Phase 3 (Validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User packet contract | Doc edits |
| Doc edits | Source evidence reads | Validation |
| Validation | Completed doc edits | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Doc edits | Medium | 1-2 hours |
| Validation | Low | 10-20 minutes |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Runtime code is out of scope.
- [x] Existing docs read before editing.
- [x] Strict validator passes.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only diff revert.
<!-- /ANCHOR:enhanced-rollback -->
