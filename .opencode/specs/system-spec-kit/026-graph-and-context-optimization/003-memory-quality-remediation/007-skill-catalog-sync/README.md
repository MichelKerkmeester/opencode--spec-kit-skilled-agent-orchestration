---
title: "README: Phase 7 — Skill Catalog Sync"
description: "Quick orientation for the Phase 7 packet that audits downstream documentation and tooling surfaces after Phase 6 stabilizes the final memory state."
trigger_phrases:
  - "phase 7 readme"
  - "skill catalog sync"
  - "downstream artifact audit"
importance_tier: normal
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/007-skill-catalog-sync"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["README.md"]

---
# README: Phase 7 — Skill Catalog Sync

Phase 7 is the downstream audit and sync packet that follows Phase 6. It does not start from assumptions. Instead, it treats the Phase 1-6 memory behavior as the final surface, runs ten focused deep-review iterations across the named downstream artifacts, and then updates only the surfaces that truly drifted.

## What Lives Here

- `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` define the approved Phase 7 review and update workflow.
- `research/iterations/` is reserved for the ten deep-review iteration outputs.
- `scratch/` is the workspace for drift matrices, update proposals, and verification notes.
- `memory/` is reserved for saved findings and handoff context.

## Review Focus

- Feature catalog and manual testing playbook.
- `system-spec-kit` skill docs, references, assets, and templates.
- Memory commands, MCP server, and agent definitions.
- README and install/setup surfaces that may need parity updates after Phase 1-6.

## Validation Surface

- Complete Phase 6 first so the downstream audit uses the final post-dedupe surface.
- Validate this phase folder with `validate.sh --strict`.
- Re-run the parent packet validator after Phase 7 docs are synchronized.

## Related Docs

- `./spec.md`
- `./plan.md`
- `./tasks.md`
- `./checklist.md`
- `../spec.md`
- `../006-memory-duplication-reduction/spec.md`
