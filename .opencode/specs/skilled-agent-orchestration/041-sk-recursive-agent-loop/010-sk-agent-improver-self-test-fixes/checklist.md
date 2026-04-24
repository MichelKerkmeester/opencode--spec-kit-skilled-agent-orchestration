---
title: "Checklist [skilled-agent-orchestration/041-sk-recursive-agent-loop/010-sk-agent-improver-self-test-fixes/checklist]"
description: "checklist document for 010-sk-agent-improver-self-test-fixes."
trigger_phrases:
  - "checklist"
  - "010"
  - "agent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/010-sk-agent-improver-self-test-fixes"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
# Checklist: Phase 010 — Self-Test Fixes and Reducer Improvements

## P0 — Hard Blockers

### Bug Fix
- [x] Stale command path fixed in canonical agent-improver.md (`/improve:agent` → `improve/agent.md`)
- [x] All 3 runtime mirrors synced with the fix
- [x] `score-candidate.cjs --dynamic` on agent-improver: systemFitness=100, resource-refs-valid=4/4

### Reducer Scripts
- [x] All 8 .cjs scripts parse without errors after changes
- [x] `inferFamily()` no longer hardcodes `session-handover` for unknown profiles
- [x] Plateau window reads from `stopRules.plateauWindow` config
- [x] Accepted counting includes `candidate-acceptable` and `candidate-better` recommendations

### Integration
- [x] `scan-integration.cjs --agent=agent-improver` shows all mirrors aligned

## P1 — Required

### Candidate Promotion
- [x] HALT CONDITION block added to Operating Rules (structured error JSON)
- [x] Two checklist blocks merged into one flat list
- [x] Self-Validation converted to checkbox format with input-check first item
- [x] 4th anti-pattern added (never proceed with missing inputs)
- [x] Scan report provenance note added to Step 2
- [x] Summary box Step 2 label updated

### Config and Docs
- [x] `plateauWindow` field added to improvement_config.json
- [x] `plateauWindow` documented in improvement_config_reference.md

### Verification
- [x] Re-run reducer with Phase 009 ledger: family shows `agent-improver` (not `session-handover`)
- [x] Re-run reducer with plateauWindow=2: plateau fires correctly
- [x] Re-run reducer: accepted count > 0 for scored records
- [x] Parent 041 spec.md updated with Phase 10 row

## P2 — Optional

- [x] Re-run full Phase 009 self-test to confirm all fixes work end-to-end
- [x] Update manual testing playbook with reducer fix test scenarios
