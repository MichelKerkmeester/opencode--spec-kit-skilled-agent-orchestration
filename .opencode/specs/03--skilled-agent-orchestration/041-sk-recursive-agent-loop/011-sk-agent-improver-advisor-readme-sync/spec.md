# Spec: Skill Advisor Routing + README Sync

| Field | Value |
| --- | --- |
| Status | Complete |
| Priority | P1 |
| Level | 2 |
| Parent | 041-sk-agent-improver-loop |
| Phase | 011 |
| Estimated LOC | 60-80 |

## Problem

After Phase 008-010, the skill advisor and skill README are outdated:

1. **Skill README** (`skill/README.md`): Lists sk-agent-improver at version 0.1.0.0 with old description. Should be 1.0.0.0 with 5D scoring, integration scanning, dynamic profiling.
2. **Skill advisor** (`skill/scripts/skill_advisor.py`): Missing routing for Phase 008+ capabilities — no entries for "5-dimension", "integration scan", "dynamic profile", "/improve:agent", "evaluate agent", "score agent". Also missing COMMAND_BRIDGES for `/improve:agent`, `/improve:prompt`, and all `/create:*` commands.
3. **Barter sync**: The Barter version at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/.opencode/skill/scripts/skill_advisor.py` needs the same COMMAND_BRIDGES additions (for `/improve:prompt` and `/create:*` commands) even though it doesn't have sk-agent-improver.

## Solution

1. Update skill README with correct version and description
2. Add missing routing entries to skill advisor (INTENT_BOOSTERS, PHRASE_INTENT_BOOSTERS, COMMAND_BRIDGES)
3. Sync COMMAND_BRIDGES to Barter advisor

## Scope

### In Scope

- `.opencode/skill/README.md` — version bump + description update for sk-agent-improver
- `.opencode/skill/scripts/skill_advisor.py` — add Phase 008+ routing entries + COMMAND_BRIDGES
- Barter `skill/scripts/skill_advisor.py` — sync COMMAND_BRIDGES only (no sk-agent-improver routes)

### Out of Scope

- Barter skill/README.md (sk-agent-improver intentionally removed from Barter)
- SKILL.md description update (separate concern)
- New scripts or evaluation logic

## Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| REQ-001 | Skill README shows correct version | sk-agent-improver listed at 1.0.0.0 with Phase 008 description |
| REQ-002 | Advisor routes 5D/scanning/profiling queries | `skill_advisor.py "5-dimension agent evaluation"` returns sk-agent-improver >= 0.8 |
| REQ-003 | Advisor routes /improve:agent command | `skill_advisor.py "/improve:agent"` returns sk-agent-improver >= 0.8 |
| REQ-004 | COMMAND_BRIDGES includes /improve: and /create: commands | All slash commands have bridge entries |
| REQ-005 | Barter advisor has same COMMAND_BRIDGES | Barter version has /improve:prompt and /create:* bridges |

## Success Criteria

- `python3 .opencode/skill/scripts/skill_advisor.py "evaluate agent with 5 dimensions" --threshold 0.8` returns sk-agent-improver
- `python3 .opencode/skill/scripts/skill_advisor.py "/improve:agent" --threshold 0.8` returns sk-agent-improver
- skill/README.md shows `sk-agent-improver | 1.0.0.0`
