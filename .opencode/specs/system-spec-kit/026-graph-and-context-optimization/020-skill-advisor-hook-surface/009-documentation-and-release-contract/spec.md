---
title: "Feature Specification: Documentation + Release Contract"
description: "New hook-surface reference doc under .opencode/skill/system-spec-kit/references/hooks/ + setup / disable flags / privacy / failure modes / observability / migration / concurrency / runtime capability matrix. Update CLAUDE.md Gate 2 discussion + cross-runtime READMEs."
trigger_phrases:
  - "020 documentation"
  - "skill advisor hook reference doc"
  - "skill advisor hook release contract"
  - "skill advisor hook playbook"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Spec scaffolded from wave-1 + wave-2 research"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 006/007/008 converge"
    blockers: ["006-claude-hook-wiring", "007-gemini-copilot-hook-wiring", "008-codex-integration-and-hook-policy"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"

---
# Feature Specification: Documentation + Release Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Predecessors** | ../006-*, ../007-*, ../008-* |
| **Position in train** | 8 of 8 (final; closes 020) |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (required for release; not blocking runtime operation) |
| **Status** | Spec Ready, Blocked by 006 + 007 + 008 |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 0.5-1 engineering day |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After 006/007/008 ship runtime adapters, operators and developers lack:
- A single reference doc covering hook-surface contract, failure modes, privacy, observability
- Setup instructions per runtime (where to register, what settings file)
- Disable flag name + precedence (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`)
- Migration notes (rename/delete semantics, cache invalidation, SQLite vs JSON fallback)
- Concurrency caveats (generation-tagged snapshots, session-scoped locks)
- Runtime capability matrix (which runtimes expose model-visible injection, which need wrapper fallback)
- Updated CLAUDE.md §Gate 2 discussion making the hook the primary advisor path (explicit invocation remains fallback)

Without this, the feature ships but operators can't configure / diagnose / disable it cleanly.

### Purpose

Close the release contract: create the reference doc that 020/spec.md §3 already promised, update CLAUDE.md to reflect the new primary path, update cross-runtime READMEs, and document the observability/health contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

#### 3.1 Reference doc

- New .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md
- Sections:
  1. **Overview** — what the hook does, why it replaces manual invocation, minimum runtime versions
  2. **Setup per runtime** — where to register, settings file paths, sample snippets for Claude/Gemini/Copilot/Codex
  3. **Disable flag** — `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` per-session; per-runtime overrides if needed
  4. **Privacy contract** — raw prompts never persisted; fingerprint-only cache; HMAC-keyed exact prompt cache
  5. **Failure-mode playbook** — `unavailable` / `degraded` / `fail_open` behaviors; what operator sees in `session_health`
  6. **Observability** — metrics namespace `speckit_advisor_hook_*`; JSONL stderr schema; alert thresholds (fail-open rate > 5%, p95 latency > 100ms)
  7. **Migration notes** — per-skill fingerprint cache invalidation; rename/delete semantics; SQLite vs JSON fallback
  8. **Concurrency** — generation-tagged snapshots; CAS hook-state writes; session-scoped locks
  9. **Runtime capability matrix** — table per research-extended §X2/§X3/§X4 findings
  10. **Troubleshooting** — common symptoms + diagnostics + next steps
  11. **Performance budget** — p50/p95/p99 per lane from 005's timing harness

#### 3.2 CLAUDE.md updates

- Update §Mandatory Tools section to describe the hook as primary advisor invocation path
- Update §Gate 2 discussion:
  - Primary path: hook fires automatically; AI sees brief in context
  - Fallback: explicit `skill_advisor.py` invocation remains for scripted / harness use
  - Threshold cascade: 0.8 default, ask-if-below, explicit direction accepted
- Add cross-reference to new reference doc

#### 3.3 Cross-runtime README updates

- `.claude/` README snippet — hook registration
- `.gemini/` README snippet
- `.codex/` README snippet (if present in repo)
- Copilot runtime README snippet

#### 3.4 Release checklist

- Add a "release prep" section to 020 parent `implementation-summary.md`:
  - All 8 children converged
  - Parity 4/4 runtimes
  - Bench tables committed
  - Disable flag tested
  - Documentation published
  - CLAUDE.md updated

### Out of Scope

- Updating external user-facing marketing docs (handled elsewhere)
- Changing the hook contract itself (006/007/008 are authoritative)
- Blog posts / announcements

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md | Create | Main reference doc |
| `CLAUDE.md` | Modify | §Mandatory Tools + §Gate 2 discussion |
| .claude/README.md (if present) | Modify | Hook registration snippet |
| .gemini/README.md (if present) | Modify | Same |
| .opencode/runtime/copilot/README.md (or equivalent) | Modify | Same |
| .codex/README.md (if present) | Modify | Same |
| ../implementation-summary.md | Modify | Release prep section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reference doc exists at documented path | File present, ≥ 400 lines covering all 11 sections |
| REQ-002 | Runtime capability matrix accurate per shipped 006/007/008 | Cross-reference each child's implementation-summary.md |
| REQ-003 | Disable flag documented | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` per research.md §Q8 recommendation |
| REQ-004 | CLAUDE.md updated | Gate 2 discussion references hook as primary |
| REQ-005 | Privacy contract explicit | Raw-prompt non-persistence + HMAC cache key + fingerprint rules stated |
| REQ-006 | Observability contract published | Metric names + alert thresholds + health section |
| REQ-007 | Failure-mode playbook | Map each `status` × `freshness` to operator action |
| REQ-008 | Release checklist in 020 implementation-summary.md | All 6 items listed |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Cross-runtime READMEs updated with registration snippets | Diff |
| REQ-021 | DQI score on reference doc ≥ 0.85 | sk-doc validator run |
| REQ-022 | Troubleshooting section covers top 5 common failures | Reviewed against research.md §Failure Modes table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Reference doc exists, covers all 11 sections
- **SC-002**: CLAUDE.md Gate 2 discussion references hook
- **SC-003**: skill-advisor-hook.md DQI ≥ 0.85
- **SC-004**: 020 parent `implementation-summary.md` has release checklist with all 6 items checked
- **SC-005**: All 4 runtime READMEs updated (where present in repo)

### Acceptance Scenario 1: Reference doc readable
**Given** the reference doc, **when** opened, **then** it covers setup, disable flag, privacy, failure modes, observability, migration, concurrency, capability matrix, troubleshooting, performance budget.

### Acceptance Scenario 2: CLAUDE.md points to hook as primary
**Given** CLAUDE.md §Gate 2 discussion, **when** read, **then** it describes the hook as the automatic primary path and explicit `skill_advisor.py` as fallback.

### Acceptance Scenario 3: Disable flag tested
**Given** `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, **when** any runtime fires a prompt, **then** no advisor subprocess runs; no additionalContext emitted.

### Acceptance Scenario 4: Capability matrix accurate
**Given** the matrix in the doc, **when** cross-referenced against shipped 006/007/008, **then** every entry matches the child's implementation-summary.md.

### Acceptance Scenario 5: Release checklist reflects truth
**Given** 020 parent implementation-summary.md, **when** reviewed, **then** each of the 6 release-prep items has evidence linking to the right child or artifact.

### Acceptance Scenario 6: Operator troubleshooting walks end-to-end
**Given** the doc's troubleshooting section, **when** a user hits `freshness: "unavailable"`, **then** they can follow the playbook to check: Python present, advisor script path, subprocess timeout, graph file existence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Runtime capability matrix drifts from reality | Medium | Pull values from each child's implementation-summary.md at authoring time |
| CLAUDE.md edit conflicts with other in-flight changes | Medium | Use Edit tool with narrow old_string; coordinate with parent packet edits |
| Reference doc gets stale after future runtime changes | Low | Link each section to research artifacts + implementation summaries |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Reference doc lives at a canonical path used by other reference docs
- **NFR-M02**: Each section links to its authoritative research / implementation source

### Accuracy
- **NFR-A01**: Capability matrix values derived from committed artifacts, not speculative
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Runtime README file does not exist: skip update for that runtime (note in implementation-summary.md)

### Error Scenarios
- sk-doc validator reports DQI < 0.85: fix flagged issues before merging
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 1 new doc + 4-5 README edits + CLAUDE.md edit |
| Risk | 6/25 | Low — doc-only |
| Research | 2/20 | Aggregation of prior research |
| **Total** | **16/70** | **Level 2 (lower)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- Q1: Should the reference doc include sample invocation snippets for each runtime, or link to each child's implementation-summary.md? Recommend: inline snippets with links to children for depth.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessors: `../006-*`, `../007-*`, `../008-*`
- Research: `../../../research/020-skill-advisor-hook-surface-pt-01/research.md §Failure Modes + §Cross-Runtime Testing + Privacy`
- Extended research: `../../../research/020-skill-advisor-hook-surface-pt-02/research-extended.md §X6 (observability) §X7 (migration) §X8 (concurrency)`
- sk-doc skill: `../../../../skill/sk-doc/`
