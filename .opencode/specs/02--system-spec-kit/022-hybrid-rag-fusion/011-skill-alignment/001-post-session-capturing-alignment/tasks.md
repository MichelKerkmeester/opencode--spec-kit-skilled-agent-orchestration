# Tasks — Post Session Capturing Alignment

## Sprint 1: SKILL.md

- [x] T001: Add structured JSON fields documentation (toolCalls, exchanges, preflight, postflight)
- [x] T002: Update handler count ~30 → ~40
- [x] T003: Add 6-command structure note
- [x] T004: Add quality-fix Key Concepts from 018

## Sprint 2: References

- [x] T005: Fix template_guide.md bare positional syntax
- [x] T006: Reorder execution_methods.md JSON-first
- [x] T007: Fix save_workflow.md bare positional examples
- [x] T008: Add JSON-mode example to environment_variables.md
- [x] T009: Update memory_system.md tool count 23→33

## Sprint 3: Verification

- [x] T010: Run validate.sh [Evidence: parent 011-skill-alignment passed strict validation 2026-03-21]
- [x] T011: Grep for remaining bare positional syntax [Evidence: verified in parent 011-skill-alignment reconciliation pass]
- [x] T012: Verify tool counts match live repo [Evidence: 33 tools in tool-schemas.ts, 33 rows in memory_system.md, verified 2026-03-22]
