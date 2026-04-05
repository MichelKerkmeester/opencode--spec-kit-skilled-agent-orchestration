# Checklist: Phase 011 — Skill Advisor Routing + README Sync

## P0 — Hard Blockers

- [x] skill/README.md shows sk-agent-improver at version 1.0.0.0
- [x] skill_advisor.py routes "5-dimension" queries to sk-agent-improver
- [x] skill_advisor.py routes "/improve:agent" to sk-agent-improver
- [x] COMMAND_BRIDGES include all /improve: and /create: commands
- [x] All routing tests pass with threshold 0.8

## P1 — Required

- [x] INTENT_BOOSTERS added for integration scan, dynamic profile, evaluate/score agent
- [x] PHRASE_INTENT_BOOSTERS added for Phase 008+ capabilities
- [x] Barter advisor has /improve:prompt and /create:* COMMAND_BRIDGES
- [x] Parent 041 spec.md updated with Phase 11 row
