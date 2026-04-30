---
title: "Plan: Code Graph Watcher Retraction"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Level 2 plan for retracting structural code-graph watcher documentation."
trigger_phrases:
  - "019-code-graph-watcher-retraction"
  - "code-graph watcher retraction"
  - "structural watcher doc fix"
  - "read-path graph freshness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/019-code-graph-watcher-retraction"
    last_updated_at: "2026-04-29T13:58:12Z"
    last_updated_by: "cli-codex"
    recent_action: "Watcher claim retracted"
    next_safe_action: "Plan packet 033 next"
    blockers: []
    completion_pct: 100
---
# Plan: Code Graph Watcher Retraction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON metadata |
| **Framework** | system-spec-kit Level 2 packet |
| **Scope** | Documentation-only remediation |
| **Testing** | Strict spec validator + targeted `rg` checks |
| **Runtime Code** | Read-only |

### Overview

This plan implements Packet 032's Tier B-beta path. The README will stop implying structural source watching and will instead document the actual freshness model backed by `ensure-ready.ts`, `code_graph_scan`, `code_graph_status`, and the query blocked-required-action path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder identified. [EVIDENCE: user requested `019-code-graph-watcher-retraction`]
- [x] Source research identified. [EVIDENCE: `../017-automation-reality-supplemental-research/research/research-report.md:84`]
- [x] Runtime-code exclusion clear. [EVIDENCE: user constraint: DOC-ONLY]

### Definition of Done

- [x] Packet docs created with required metadata and continuity.
- [x] README freshness model replaces watcher overclaim.
- [x] Related docs are swept for inherited false claims.
- [x] Strict validator passes with 0 errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-cited documentation retraction. The current product contract should separate four surfaces: read-path selective self-heal, operator-triggered full repair, read-only status diagnostics, and blocked query required-action behavior.

### Key Components

- **Read-path self-heal**: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:329-442`.
- **Manual full repair**: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:177-356`.
- **Read-only status**: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:158-167`.
- **Required action**: `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-828`.
- **No watcher proof**: `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:274`.

### Data Flow

Operator invokes `code_graph_query` or `code_graph_context`. The read path calls readiness logic and may selectively reindex stale tracked files. If readiness requires a full scan, the read path blocks and instructs the operator to run `code_graph_scan`; `code_graph_status` remains diagnostic.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 2 packet docs and metadata.
- [x] Initialize continuity fields at 5%.

### Phase 2: Implementation
- [x] Patch README with `Code-graph freshness model`.
- [x] Sweep watcher/real-time/code-graph wording in current operator docs.
- [x] Confirm `.opencode/skill/system-spec-kit/SKILL.md`, `CLAUDE.md`, and `.opencode/skill/system-spec-kit/references/config/hook_system.md` do not inherit the false watcher claim.

### Phase 3: Validation
- [x] Run strict validator on this packet.
- [x] Update checklist and implementation-summary to completion state.
- [x] Re-run strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packet validation | Required spec docs, anchors, frontmatter | `validate.sh --strict` |
| Scope check | Ensure no runtime code edits | `git diff --name-only` |
| Claim check | Watcher/real-time/code-graph wording | Targeted `rg` |
| Metadata check | Valid JSON metadata | Validator / JSON parse |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 018-doc-truth-pass | Internal | Complete | Provides prior trigger-table cleanup |
| 013 research report | Internal | Available | Source-of-truth for P1-1 verdict |
| MCP README | Internal | Available | Primary current operator doc to patch |
| Spec validator | Internal | Available | Required completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validator fails in a way that cannot be repaired without runtime code changes, or source evidence contradicts the beta-path contract.
- **Procedure**: Revert only packet 032 docs and README doc edits. Runtime code remains untouched.
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
| Doc edits | Low | 30-60 minutes |
| Validation | Low | 10-20 minutes |
| **Total** | | **~1.5 hours** |
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
