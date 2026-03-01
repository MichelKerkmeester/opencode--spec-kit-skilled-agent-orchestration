---
title: "Feature Specification: System-Wide Remediation of Audit Findings [125-codex-system-wide-audit/spec]"
description: "This spec is re-baselined to address the full set of confirmed issues from audits of specs 121, 124, and 125 plus the runtime code they reference. The previous version mixed sta..."
trigger_phrases:
  - "feature"
  - "specification"
  - "system"
  - "wide"
  - "remediation"
  - "spec"
  - "125"
  - "codex"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: System-Wide Remediation of Audit Findings

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 (refactored) -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This spec is re-baselined to address the full set of confirmed issues from audits of specs 121, 124, and 125 plus the runtime code they reference. The previous version mixed stale status claims with partial implementation notes. This version is a remediation contract: clear defects, clear ownership, clear verification.

Primary goal: eliminate false-green documentation and close runtime defects that can cause failed upgrades, inconsistent validation, and memory system drift.

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Level**: 3+

| Field | Value |
|-------|-------|
| Level | 3+ |
| Priority | P0 |
| Status | Active Remediation |
| Created | 2026-02-15 |
| Last Updated | 2026-02-16 |
| Branch | `125-codex-system-wide-audit` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current documentation and implementation state has two classes of defects:

1. **Documentation integrity defects** in this spec folder (stale assumptions, contradictory completion state, broken command paths, and task/checklist drift).
2. **Runtime defects** in touched code paths (`upgrade-level.sh`, validation/parsing rules, registry integration, and MCP memory handlers).

These defects create operational risk: upgrade failures can report unclear errors, rollback can leave partial state behind, validation tools can disagree on level detection, and memory workflows can silently degrade correctness.

### Purpose

Provide one authoritative remediation contract that:
- lists all confirmed defects,
- defines acceptance criteria for each fix,
- enforces truthful completion reporting,
- and provides verifiable closure gates.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Refactor spec 125 documents to match confirmed findings and real code state.
- Plan and track fixes for all confirmed runtime issues discovered in the 121/124/125 audit pass.
- Align contracts across docs, scripts, and verification artifacts.

### Out of Scope

- New feature development unrelated to confirmed defects.
- Broad refactors outside files directly tied to confirmed findings.
- Performance tuning unrelated to correctness and reliability defects.

### Primary Code Targets

| Area | File(s) |
|------|---------|
| Upgrade flow | `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` |
| Validation parity | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh` |
| Registry integration | `.opencode/skill/system-spec-kit/scripts/scripts-registry.json`, `.opencode/skill/system-spec-kit/scripts/registry-loader.sh` |
| Upgrade tests | `.opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh` |
| Memory indexing signal | `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts` |
| Memory runtime behavior | `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` |

<!-- /ANCHOR:scope -->

---

## 4. CONFIRMED ISSUE INVENTORY

| ID | Severity | Type | Confirmed Defect |
|----|----------|------|------------------|
| DOC-001 | High | Documentation | Stale claim that spec 121 is orphaned/memory-only |
| DOC-002 | High | Documentation | Completion claims conflict with open P0 tasks/checklist items |
| DOC-003 | High | Documentation | Broken command examples in `plan.md` (`scripts/...` nesting and wrong `tee` path) |
| DOC-004 | Medium | Documentation | Duplicate task IDs and contradictory status markers |
| DOC-005 | Medium | Documentation | Exit-code contract drift in docs (`1` vs `2`) |
| DOC-006 | Medium | Documentation | Pseudo tool calls inside fenced `bash` blocks in related audit memory docs |
| CODE-001 | High | Shell | Undefined `error` call in upgrade failure path |
| CODE-002 | High | Shell | Rollback restore is non-atomic; created files can survive failed upgrade |
| CODE-003 | Medium | Shell | Rollback copy failures can be ignored while restore reports success |
| CODE-004 | High | Shell | Level parser drift between `upgrade-level.sh`, `validate.sh`, and `check-level-match.sh` |
| CODE-005 | High | Shell | `upgrade-level.sh` missing from script registry discovery |
| CODE-006 | Medium | Test | `test-upgrade-level.sh` mutates shared `shell-common.sh`, causing parallel-run race risk |
| CODE-007 | High | TS | DB update marker path divergence (`memory-indexer` vs MCP config/state) |
| CODE-008 | High | TS | Dedup logic defaults to allow-send when DB unavailable |
| CODE-009 | High | TS | Zero-row reinforcement update still reports `status: 'reinforced'` |
| CODE-010 | Medium | TS | Index scan cooldown is set before scan succeeds |

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 Documentation Integrity

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-D01 | Spec 125 docs reflect current reality | No stale orphan/completion claims; status fields match open work |
| REQ-D02 | Command examples are executable and path-correct | All documented commands resolve from stated working directory |
| REQ-D03 | Task/checklist contracts are internally consistent | Unique task IDs; no contradictory `[ ]`/`DONE` markers; checklist totals match items |
| REQ-D04 | Exit-code contract is singular across docs | One canonical contract documented and referenced consistently |

### P0 Runtime Safety and Correctness

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-C01 | Remove undefined failure-path call | `upgrade-level.sh` does not call undefined `error`; failure path exits with intended code/message |
| REQ-C02 | Make rollback atomic and trustworthy | Failed upgrade removes files created during failed run and reports copy failures as non-zero |
| REQ-C03 | Canonical level parsing across tools | `upgrade-level.sh`, `validate.sh`, and `check-level-match.sh` produce the same level for shared fixtures |
| REQ-C04 | Register upgrade script for discovery | `scripts-registry.json` includes `upgrade-level` and `registry-loader.sh` can resolve it |
| REQ-C05 | Remove shared-file mutation from tests | `test-upgrade-level.sh` no longer renames global `shell-common.sh` in place |

### P1 Memory System Correctness

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-M01 | Canonicalize DB update marker path | writer and reader use same resolved marker path in all environments |
| REQ-M02 | Make dedup degradation explicit | DB-unavailable dedup behavior is deterministic, logged, and test-covered |
| REQ-M03 | Do not report false reinforcement success | zero-row update returns error/degraded status, not `reinforced` |
| REQ-M04 | Cooldown reflects successful scans | `setLastScanTime` occurs after successful indexing completion |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: All P0 requirements (`REQ-D01..REQ-D04`, `REQ-C01..REQ-C05`) are complete and evidence-linked.
- **SC-002**: Targeted shell and TS checks pass for each remediated defect.
- **SC-003**: No cross-file contract drift remains for level detection, exit codes, or completion status reporting.
- **SC-004**: Spec 125 can be used as an accurate source of truth for pending and completed remediation work.

## 6.1 ACCEPTANCE SCENARIOS

1. **Given** spec 125 docs are opened, **When** a maintainer checks status fields and open tasks, **Then** no file claims completion while P0 work remains.
2. **Given** a user runs documented commands, **When** commands are executed from the declared working directory, **Then** commands resolve and run without path correction.
3. **Given** upgrade flow fails mid-step, **When** rollback runs, **Then** files created during the failed run do not remain in the target spec folder.
4. **Given** the same fixture spec folder, **When** `upgrade-level.sh`, `validate.sh`, and `check-level-match.sh` detect level, **Then** all three return the same level.
5. **Given** the database is unavailable, **When** dedup logic executes, **Then** behavior is explicit and test-covered rather than silently bypassing suppression.
6. **Given** reinforcement update matches zero rows, **When** `memory-save` returns result, **Then** it does not return success-shaped `reinforced` status.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rollback logic changes can introduce new failure modes | High | Add targeted rollback tests before merge |
| Risk | Parser alignment can break existing fixtures | Medium | Build parity fixture set and compare all three parsers |
| Risk | Dedup policy change can alter response behavior | Medium | Document behavior and gate with explicit tests |
| Dependency | Existing test infrastructure in scripts and MCP modules | Medium | Reuse current suites and add focused cases only |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | Multi-surface remediation: docs + shell + TS runtime paths |
| Risk | 24/25 | Includes upgrade rollback and memory dedup correctness |
| Research | 17/20 | Findings are evidence-backed and already correlated |
| Coordination | 13/15 | Requires cross-file contract unification |
| Verification | 13/15 | Requires targeted shell + TS tests and doc sync checks |
| **Total** | **90/100** | **Level 3+ governance justified** |

<!-- /ANCHOR:complexity -->

---

## 9. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm target issue IDs from `spec.md` section 4 before edits.
- Confirm target file exists and current content is read before modification.
- Confirm planned change has a checklist gate in `checklist.md`.
- Confirm verification command and evidence destination before implementation.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Evidence-first | Do not mark any P0 item complete without concrete evidence path |
| Contract lock | Keep exit-code, backup, and status contracts aligned with section 5 |
| Path safety | Command examples must run from stated working directory |
| State truth | Never claim completion while any P0 task/checklist item remains open |

### Status Reporting Format

- Phase
- P0 completion ratio
- Files updated
- Evidence paths
- Open blockers

### Blocked Task Protocol

- Mark blocked work in `tasks.md` using `[B]` and include exact dependency.
- Add a one-line unblock condition and owner.
- Keep checklist item open until dependency is resolved and verified.

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

1. For dedup when DB is unavailable, should behavior be fail-open (current), fail-closed, or explicit degraded-mode with caller-visible flag?
2. Should `cleanup-orphaned-vectors.ts` remain direct-apply by default, or switch to dry-run default with explicit `--apply`?

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:changelog -->
## 11. CHANGELOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | 2026-02-16 | @codex | Re-baselined spec to cover full confirmed doc and runtime issue set |
| 1.0 | 2026-02-15 | @speckit | Initial consolidated audit spec |

<!-- /ANCHOR:changelog -->
