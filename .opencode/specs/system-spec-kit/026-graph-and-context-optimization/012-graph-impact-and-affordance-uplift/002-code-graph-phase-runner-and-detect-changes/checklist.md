---
title: "Checklist: 012/002"
description: "Verification items for phase-DAG runner + detect_changes."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: 012/002

<!-- SPECKIT_LEVEL: 2 -->

## P1 — Safety semantics (pt-02 §12 RISK-03)
- [ ] `detect_changes` returns `status: "blocked"` when graph is stale
- [ ] `detect_changes` NEVER returns `"no affected symbols"` on stale state
- [ ] Phase runner rejects duplicate phase names
- [ ] Phase runner rejects missing dependencies
- [ ] Phase runner rejects cycles
- [ ] Phases see only their declared dependency outputs

## P1 — Backward compatibility
- [ ] `indexFiles()` exports preserved
- [ ] Existing code-graph vitest suite passes unchanged
- [ ] No SQLite schema migration triggered

## P1 — Output contract
- [ ] `detect_changes` output = `{ status, affectedSymbols[], blockedReason?, timestamp }`
- [ ] Handler registered in `handlers/index.ts`
- [ ] Diff parser handles standard unified diff; returns `parse_error` on unknown format

## P2 — Documentation
- [ ] feature_catalog entries created in `03--discovery/` (detect_changes) and `14--pipeline-architecture/` (phase-DAG)
- [ ] manual_testing_playbook entries created in same categories
- [ ] sk-doc DQI score ≥85 on new entries

## Phase Hand-off
- [ ] `validate.sh --strict` passes
- [ ] `implementation-summary.md` populated with what-was-built section + diff-lib decision

## References
- spec.md §4 (requirements), §5 (verification)
- pt-02 §11 (Packet 1), §12 (RISK-03)
