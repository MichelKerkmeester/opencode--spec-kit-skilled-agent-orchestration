---
title: "Verification Checklist: ESM Module Compliance"
description: "QA verification for documenting ESM as the accepted module convention for MCP server TypeScript code."
trigger_phrases:
  - "esm checklist"
  - "module compliance verification"
importance_tier: "standard"
contextType: "architecture"
---
# Verification Checklist: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Standards Alignment

- [ ] CHK-001 [P0] `SKILL.md` TypeScript section documents ESM as standard for `mcp_server/`
- [ ] CHK-002 [P0] ADR recorded in `decision-record.md`
- [ ] CHK-003 [P1] No conflicting CJS-mandatory guidance remains for TypeScript
- [ ] CHK-004 [P1] `CLAUDE.md` table still accurate after `SKILL.md` update
