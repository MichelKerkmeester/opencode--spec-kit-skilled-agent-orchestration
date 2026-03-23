---
title: "Feature Specification: ESM Module Compliance"
description: "Document ESM as the accepted module convention for MCP server TypeScript code."
trigger_phrases:
  - "esm module compliance"
  - "typescript module convention"
  - "mcp server esm standard"
importance_tier: "standard"
contextType: "architecture"
---
# Feature Specification: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

This phase documents ESM as the accepted module convention for MCP server TypeScript code. The `mcp_server/` runtime already uses ESM `import`/`export` syntax throughout the codebase, so the correct remediation is to update the standard in `.opencode/skill/sk-code--opencode/SKILL.md`, not to convert code that already matches the architecture.

**Key Decisions**: Accept ESM as the standard for `mcp_server/` TypeScript code, while retaining CommonJS guidance for `.js` files in `scripts/`

**Critical Dependencies**: `.opencode/skill/sk-code--opencode/SKILL.md` and shared ADR tracking in `../decision-record.md`

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Pending |
| **Created** | 2026-03-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The current `sk-code--opencode` TypeScript guidance still reflects older CommonJS-oriented assumptions that predate the current MCP server architecture. In practice, the entire `mcp_server/` tree already uses ESM module syntax and TypeScript compiles to the correct target.

### Purpose
Update the documented standard so it matches the architecture already in use: ESM is accepted for `mcp_server/` TypeScript code, while CommonJS guidance remains applicable to `.js` files in `scripts/`.

### Rationale
The `mcp_server/` runtime spans 4000+ files that already follow ESM conventions. The architecture is not out of compliance with the standard; the standard is out of date with the architecture. The remediation should therefore update documentation and decision records rather than trigger unnecessary code conversion.

---

## 3. SCOPE

### In Scope
- Update `.opencode/skill/sk-code--opencode/SKILL.md` to document ESM as the accepted convention for `mcp_server/` TypeScript code
- Add an ADR to `../decision-record.md` explaining why ESM is the correct standard
- Verify that no other in-scope documentation still states CommonJS is mandatory for TypeScript

### Out of Scope
- Converting any existing runtime code
- Changing runtime behavior in `mcp_server/`
- Broad standards rewrites outside the module-convention clarification

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code--opencode/SKILL.md` | Update | Document ESM as the accepted convention for `mcp_server/` TypeScript code |
| `../decision-record.md` | Update | Add ADR-ESM rationale for standards alignment |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` documents ESM as the standard for `mcp_server/` TypeScript code | TypeScript section explicitly allows ESM `import`/`export` syntax for MCP server code |
| REQ-002 | ADR recorded in parent `decision-record.md` | Decision record explains why the standard changes instead of the codebase |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | CommonJS guidance remains accurate for `.js` files in `scripts/` | `SKILL.md` distinguishes TypeScript-in-`mcp_server/` guidance from `.js` script guidance |
| REQ-004 | No conflicting TypeScript guidance remains | In-scope docs no longer state that CommonJS is mandatory for TypeScript |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `SKILL.md` TypeScript section documents ESM imports as the standard for `mcp_server/` code
- **SC-002**: ADR recorded in `decision-record.md`

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wording change accidentally broadens guidance beyond intended scope | Standards drift | Keep guidance explicitly scoped to `mcp_server/` TypeScript code |
| Dependency | Existing docs may still contain older CommonJS language | Incomplete remediation | Verify adjacent guidance after updating `SKILL.md` |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
