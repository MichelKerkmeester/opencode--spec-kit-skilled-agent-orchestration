---
title: "Tasks: ESM Module Compliance"
description: "Task breakdown for documenting ESM as the accepted module convention for MCP server TypeScript code."
trigger_phrases:
  - "esm tasks"
  - "module compliance tasks"
importance_tier: "standard"
contextType: "architecture"
---
# Tasks: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description - WHY - Acceptance`

---

## Phase 1: Standards Update

- [ ] T001 Update `.opencode/skill/sk-code--opencode/SKILL.md` TypeScript module convention - WHY: the documented standard should match the existing ESM architecture in `mcp_server/` - Acceptance: TypeScript guidance explicitly documents ESM as the standard for `mcp_server/` code while keeping CommonJS guidance for `.js` files in `scripts/`

---

## Phase 2: Decision Record

- [ ] T002 Add ADR-ESM to `../decision-record.md` - WHY: the rationale for accepting ESM as the standard should be preserved in shared architecture decisions - Acceptance: ADR explains that the standard was updated to match the existing MCP server architecture

---

## Phase 3: Verification

- [ ] T003 Verify no existing docs reference CJS as mandatory for TypeScript - WHY: the update should eliminate conflicting guidance, not create a new split standard - Acceptance: in-scope documentation no longer states that CommonJS is mandatory for TypeScript

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
