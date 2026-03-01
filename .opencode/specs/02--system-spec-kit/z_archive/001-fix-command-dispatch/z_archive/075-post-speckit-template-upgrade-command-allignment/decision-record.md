---
title: "Decision Record: Post-SpecKit Template Upgrade [075-post-speckit-template-upgrade-command-allignment/decision-record]"
description: "Status: PROPOSED"
trigger_phrases:
  - "decision"
  - "record"
  - "post"
  - "speckit"
  - "template"
  - "decision record"
  - "075"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Post-SpecKit Template Upgrade - Command Alignment

## ADR-001: Section Header Standardization Approach

**Status**: PROPOSED

**Context**:
All 19 commands use `🔜 WHAT NEXT?` section header, but `🔜` is not in the approved emoji vocabulary defined in command_template.md Section 6.

**Options Considered**:
1. Add `🔜` to approved emoji vocabulary in command_template.md
2. Replace with existing approved emoji (`📌 NOTES` or `🔗 RELATED`)
3. Create new standard: `📌 NEXT STEPS`

**Decision**: Option 3 - Use `📌 NEXT STEPS`

**Rationale**:
- `📌` is already approved for REFERENCE/NOTES
- "NEXT STEPS" is clearer than "WHAT NEXT?"
- Avoids modifying the command_template.md standard

---

## ADR-002: Mandatory Gate Addition Strategy

**Status**: PROPOSED

**Context**:
`/memory:search` has `<id>` and `<spec-folder>` in argument-hint but lacks a mandatory gate.

**Options Considered**:
1. Add full multi-phase blocking gate
2. Add simplified single-phase gate
3. Change argument-hint to all optional (no gate needed)

**Decision**: Option 1 - Full multi-phase blocking gate

**Rationale**:
- Consistency with other memory commands
- Prevents context inference errors
- Matches template Section 8 requirements

---

## ADR-003: Parallel Agent Dispatch Structure

**Status**: ACCEPTED

**Context**:
Need to update 19 commands efficiently while maintaining quality.

**Options Considered**:
1. Sequential updates (1 agent, all commands)
2. Namespace-based parallel (4 agents by namespace)
3. Function-based parallel (5 agents by task type)

**Decision**: Option 2 with validation agent (5 total)

**Rationale**:
- Each namespace has consistent patterns
- Parallel execution reduces total time
- Dedicated validation agent ensures quality

**Agent Assignment**:
- Agent 1: spec_kit namespace (7 commands)
- Agent 2: memory namespace (4 commands) + gate fix
- Agent 3: create namespace (6 commands) + frontmatter fixes
- Agent 4: search namespace (2 commands)
- Agent 5: Cross-reference fixes + validation

---

## ADR-004: OUTPUT FORMATS Section Placement

**Status**: PROPOSED

**Context**:
Some spec_kit commands lack explicit OUTPUT FORMATS sections, relying on YAML assets.

**Options Considered**:
1. Add inline OUTPUT FORMATS section to all commands
2. Add reference to YAML assets in existing CONTRACT section
3. Keep current structure (implicit in examples)

**Decision**: Option 1 - Add inline OUTPUT FORMATS section

**Rationale**:
- Improves discoverability
- Follows debug.md and handover.md patterns
- Consistent with template Section 17

---

## ADR-005: Cross-Reference Error Fix Scope

**Status**: ACCEPTED

**Context**:
`/memory:database` line 393 incorrectly references `/memory:database restore` when it should reference `/memory:checkpoint restore`.

**Options Considered**:
1. Fix only the specific line
2. Audit all cross-references in all commands
3. Add automated cross-reference validation

**Decision**: Option 1 - Fix specific line only

**Rationale**:
- Single known error identified in audit
- Full audit already completed by Agent 10
- Scope control for this spec

---

## ADR-006: Emoji Vocabulary Enforcement

**Status**: PROPOSED

**Context**:
command_template.md Section 6 defines approved emojis, but no automated validation exists.

**Options Considered**:
1. Manual enforcement (document-based)
2. Add to validate-spec.sh
3. Create separate command-validate.sh

**Decision**: Option 1 - Manual enforcement (defer automation)

**Rationale**:
- Automation is out of scope for this spec
- Document-based standards are sufficient
- Can be added in future spec if needed

---

## Summary

| ADR | Decision | Impact |
|-----|----------|--------|
| ADR-001 | Use `📌 NEXT STEPS` | All 19 commands |
| ADR-002 | Full multi-phase gate | /memory:search only |
| ADR-003 | 5 parallel agents by namespace | Execution efficiency |
| ADR-004 | Add OUTPUT FORMATS inline | 4 spec_kit commands |
| ADR-005 | Fix specific line only | /memory:database only |
| ADR-006 | Manual enforcement | No automation changes |
