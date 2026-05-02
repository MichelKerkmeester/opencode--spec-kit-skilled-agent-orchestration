---
title: "Plan: Half-Auto Upgrades"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Level 2 implementation plan for packet 034 half-auto upgrade remediation."
trigger_phrases:
  - "021-half-auto-upgrades"
  - "half-auto upgrade plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/021-half-auto-upgrades"
    last_updated_at: "2026-04-29T14:15:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Half-auto upgrades complete"
    next_safe_action: "Run packet 035 next"
    blockers: []
    completion_pct: 100
---
# Plan: Half-Auto Upgrades

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, JSON metadata |
| **Framework** | system-spec-kit Level 2 packet |
| **Scope** | Four independent half-auto surfaces |
| **Testing** | Vitest targeted tests, TypeScript build, strict spec validator |
| **Runtime Code** | Codex hook fallback, Copilot block header, advisor MCP command |

### Overview

This plan implements packet 034 from the 013 remediation backlog. It makes Copilot next-prompt behavior visible, marks Codex timeout fallback as stale, generates source-derived feature-flag defaults, and keeps advisor freshness status diagnostic-only while adding an explicit repair command.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet folder identified. [EVIDENCE: user requested `021-half-auto-upgrades`]
- [x] Source research read. [EVIDENCE: 012 and 013 reports loaded before edits]
- [x] Target source files read before editing. [EVIDENCE: Copilot, Codex, search flags, advisor status, and env reference inspected]
- [x] Scope locked to four sub-tasks. [EVIDENCE: no runtime feature-flag behavior changes]

### Definition of Done

- [x] Seven packet files created. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`]
- [x] Four sub-tasks implemented in order. [EVIDENCE: tasks T005-T019]
- [x] New targeted tests pass. [EVIDENCE: Vitest targeted run passed]
- [x] TypeScript build passes. [EVIDENCE: `npm --prefix ... run build` passed]
- [x] Strict validator passes. [EVIDENCE: final strict validator run]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mechanically honest contract upgrades. Where runtime behavior cannot be made fully automatic without changing carriers, expose the actual freshness state or repair command directly in code and docs.

### Key Components

- **Copilot freshness**: Managed custom-instructions block carries `nextPromptFreshness: true`; docs use the exact next-prompt contract.
- **Codex fallback**: Timeout branch returns stale marker and emits prompt-safe structured warning.
- **Codex smoke check**: Helper reads startup brief freshness into `{ fresh, lastUpdateAt, latencyMs }`.
- **Feature defaults**: The ENV reference table documents source-derived defaults from `search-flags.ts`.
- **Advisor repair**: New `advisor_rebuild` handler, schema, descriptor, and dispatcher route; `advisor_status` remains read-only.

### Data Flow

Codex `UserPromptSubmit` still calls the advisor builder. If it times out, the existing fallback branch returns stale text plus marker, writes a warning, then writes the normal diagnostic. Advisor rebuild is operator-triggered through MCP dispatch and publishes a new skill graph generation after explicit indexing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 2 packet docs and metadata.
- [x] Initialize continuity fields.

### Phase 2: Implementation
- [x] Sub-task 1: Copilot next-prompt wording and header field.
- [x] Sub-task 2: Codex timeout marker, warning, smoke helper, docs, and test.
- [x] Sub-task 3: Source-derived feature flags reference table.
- [x] Sub-task 4: Diagnostic `advisor_status` plus explicit `advisor_rebuild`.

### Phase 3: Validation
- [x] Run targeted Vitest tests.
- [x] Run TypeScript build.
- [x] Run strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Codex fallback | Timeout marker, warning, stale diagnostic, smoke helper | `hooks-codex-freshness.vitest.ts` |
| Advisor rebuild | Stale rebuild path and live skip path | `advisor-rebuild.vitest.ts` |
| TypeScript | Schema exports, tool registration, imports | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` |
| Packet validation | Required docs, anchors, metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 031 doc truth pass | Internal | Complete | Provides corrected docs baseline |
| 032 code graph watcher retraction | Internal | Complete dependency per user metadata | Prevents conflicting graph freshness language |
| 033 memory retention sweep | Internal | Complete dependency per user metadata | Prevents conflicting retention/default language |
| 012/013 research reports | Internal | Available | Source evidence for scope |
| MCP server build | Internal | Available | Required TypeScript validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Codex hook output incompatibility, `advisor_rebuild` registration failure, or strict validator failure that cannot be repaired inside packet scope.
- **Procedure**: Revert only files changed by packet 034. Do not touch unrelated existing `.opencode/specs/...` changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Sub-tasks 1-4) -> Phase 3 (Validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User packet contract | Implementation |
| Implementation | Source reads | Validation |
| Validation | Completed code/docs | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Implementation | Medium | 2-4 hours |
| Validation | Low | 20-40 minutes |
| **Total** | | **~4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Existing files read before editing.
- [x] New tests pass.
- [x] TypeScript build passes.
- [x] Strict validator passes.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert packet 034 code/docs and packet-local docs.
<!-- /ANCHOR:enhanced-rollback -->
