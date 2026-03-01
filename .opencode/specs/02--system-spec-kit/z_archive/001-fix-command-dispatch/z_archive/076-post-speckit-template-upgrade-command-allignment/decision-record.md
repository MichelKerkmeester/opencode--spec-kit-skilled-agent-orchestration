---
title: "Decision Record: Post-SpecKit Template Upgrade [076-post-speckit-template-upgrade-command-allignment/decision-record]"
description: "Status: ACCEPTED"
trigger_phrases:
  - "decision"
  - "record"
  - "post"
  - "speckit"
  - "template"
  - "decision record"
  - "076"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Post-SpecKit Template Upgrade - Command Alignment

## ADR-001: Section Header Emoji Standardization

**Status**: ACCEPTED
**Date**: 2026-01-20

**Context**: All 19 commands used `🔜 WHAT NEXT?` but `🔜` is not in command_template.md Section 6 approved vocabulary.

**Decision**: Replace with `📌 NEXT STEPS`

**Rationale**: `📌` is approved for REFERENCE/NOTES sections; "NEXT STEPS" is clearer than "WHAT NEXT?"

---

## ADR-002: Mandatory Gate Addition for /memory:search

**Status**: ACCEPTED
**Date**: 2026-01-20

**Context**: `/memory:search` has `<id>` and `<spec-folder>` as required args but lacked mandatory gate.

**Decision**: Add full multi-phase blocking gate with 4 search mode options.

**Rationale**: Consistency with other memory commands; prevents context inference errors.

---

## ADR-003: Parallel Agent Dispatch Strategy

**Status**: ACCEPTED
**Date**: 2026-01-20

**Context**: Need to update 19 commands efficiently.

**Decision**: 5 Opus agents by namespace (spec_kit: 7, memory: 4, create: 6, search: 2, validation: all).

**Rationale**: Namespace-based grouping maintains consistency; parallel execution reduces time.

---

## ADR-004: OUTPUT FORMATS Section Placement

**Status**: ACCEPTED
**Date**: 2026-01-20

**Context**: spec_kit workflow commands lacked explicit output format documentation.

**Decision**: Add inline OUTPUT FORMATS section after INSTRUCTIONS in complete, implement, plan, research.

**Rationale**: Improves discoverability; follows debug.md and handover.md patterns.

---

## ADR-005: Frontmatter Argument-Hint Format

**Status**: ACCEPTED
**Date**: 2026-01-20

**Context**: `/create:skill` and `/create:agent` used `skill-name` without angle brackets.

**Decision**: Change to `<skill-name>` and `<agent-name>` respectively.

**Rationale**: Template standard requires `<angle-brackets>` for required arguments.

---

## Summary

| ADR | Decision | Commands Affected |
|-----|----------|-------------------|
| 001 | `📌 NEXT STEPS` | 14 commands |
| 002 | Mandatory gate | /memory:search |
| 003 | 5 parallel agents | All 19 |
| 004 | OUTPUT FORMATS | 4 spec_kit commands |
| 005 | Angle brackets | /create:skill, /create:agent |
