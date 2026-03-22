# Plan — Post Session Capturing Alignment

## Approach
Documentation-only alignment pass using parallel agent dispatch for independent file edits.

## Sprints

### Sprint 1: SKILL.md Updates
- A1: Add structured JSON fields after Context Preservation section
- A2: Add 6-command structure note near Spec Kit Memory System section
- A3: Add quality-fix Key Concepts from 018
- A4: Update handler count ~30 → ~40

### Sprint 2: References Updates
- B1: template_guide.md — fix bare positional syntax
- B2: execution_methods.md — reorder JSON-first
- B3: save_workflow.md — add --recovery and JSON examples
- B4: environment_variables.md — add JSON-mode example
- B6: memory_system.md — update tool count to 33

### Sprint 3: Verification
- validate.sh on spec folder
- Grep for bare positional syntax
- Verify tool counts match live repo
