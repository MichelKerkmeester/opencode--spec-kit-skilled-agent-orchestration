---
title: "Implementation Plan: ESM Module Compliance"
description: "Technical plan for documenting ESM as the accepted module convention for MCP server TypeScript code."
trigger_phrases:
  - "esm plan"
  - "typescript module compliance"
importance_tier: "standard"
contextType: "architecture"
---
# Implementation Plan: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Markdown |
| **Framework** | OpenCode skills + MCP server runtime |
| **Storage** | N/A |
| **Testing** | Doc verification and targeted search |

### Overview
This phase updates the standards documentation to match the current architecture. The work is documentation-only: read the current TypeScript guidance, revise `SKILL.md` so ESM is the accepted convention for `mcp_server/` TypeScript code while preserving CommonJS guidance for `.js` files in `scripts/`, then record the rationale in the shared parent `decision-record.md`.

---

## 2. QUALITY GATES

### Definition of Ready
- [ ] Current `sk-code--opencode` TypeScript guidance reviewed
- [ ] Shared parent `decision-record.md` available for ADR entry
- [ ] Scope confirmed as documentation-only

### Definition of Done
- [ ] `SKILL.md` documents ESM as the standard for `mcp_server/` TypeScript code
- [ ] CommonJS guidance remains accurate for `.js` files in `scripts/`
- [ ] ADR recorded in `../decision-record.md`
- [ ] No conflicting CJS-mandatory TypeScript guidance remains in scope

---

## 3. ARCHITECTURE

### Pattern
Documentation alignment: Existing architecture -> standards update -> ADR record

### Key Components
- **Primary standard**: `.opencode/skill/sk-code--opencode/SKILL.md`
- **Shared decision log**: `../decision-record.md`
- **Verification target**: In-scope docs that describe TypeScript module conventions

### Data Flow
Read current guidance -> update standard wording -> record ADR -> verify no conflicting wording remains

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Read Current Guidance
- [ ] Read the current `.opencode/skill/sk-code--opencode/SKILL.md` TypeScript section

### Phase 2: Update the Standard
- [ ] Update the TypeScript section to document ESM as accepted for `mcp_server/` code
- [ ] Preserve CommonJS guidance for `.js` files in `scripts/`

### Phase 3: Record and Verify
- [ ] Add ADR-ESM to `../decision-record.md`
- [ ] Verify no existing docs reference CJS as mandatory for TypeScript

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc review | `SKILL.md` wording correctness | Read |
| Consistency check | Conflicting TypeScript guidance | `rg` |
| Decision traceability | ADR presence and rationale | Read |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-code--opencode` skill doc | Internal | Green | Cannot update module standard |
| Parent `decision-record.md` | Internal | Green | Cannot record ADR rationale |

---

## 7. ROLLBACK PLAN

- **Trigger**: Updated wording proves too broad or inaccurate
- **Procedure**: Restore prior scope wording and narrow the module-convention guidance to the correct paths

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Read) -> Phase 2 (Update standard) -> Phase 3 (ADR + verify)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Read current guidance | Low | 15-20 minutes |
| Phase 2: Update `SKILL.md` | Low | 30-45 minutes |
| Phase 3: ADR + verification | Low | 20-30 minutes |
| **Total** | **Low** | **1-2 hours** |
