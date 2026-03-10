# 013 — Code Audit Per Feature Catalog

## Overview

Feature-centric code audit of the Spec Kit Memory MCP server. Each of 20 feature categories from the feature catalog becomes one phase, auditing every source file referenced in that category.

## Scope

- **Target:** `.opencode/skill/system-spec-kit/mcp_server/` (462 TypeScript source files)
- **Reference:** `feature_catalog/` (20 categories, ~179 features)
- **Standards:** `sk-code--opencode` TypeScript checklist
- **Playbook:** `manual_testing_playbook.md` (34 existing + 85+ new scenarios)

## Audit Dimensions

1. **Code correctness** — Logic bugs, off-by-one, null/undefined, error paths
2. **Standards alignment** — sk-code--opencode TypeScript checklist
3. **Behavior match** — Code matches feature catalog "Current Reality" description
4. **Test coverage** — Tests exist and cover described behavior
5. **Playbook mapping** — EX-*/NEW-* scenario cross-reference

## Phase Structure

20 phases, one per feature category. Each phase is Level 2 documentation (spec.md, plan.md, checklist.md).

| Phase | Category | Features | Complexity |
|-------|----------|----------|------------|
| 001 | Retrieval | 9 | HIGH |
| 002 | Mutation | 10 | HIGH |
| 003 | Discovery | 3 | LOW |
| 004 | Maintenance | 2 | LOW |
| 005 | Lifecycle | 7 | MEDIUM |
| 006 | Analysis | 7 | MEDIUM |
| 007 | Evaluation | 2 | LOW |
| 008 | Bug Fixes & Data Integrity | 11 | HIGH |
| 009 | Evaluation & Measurement | 14 | HIGH |
| 010 | Graph Signal Activation | 11 | HIGH |
| 011 | Scoring & Calibration | 17 | CRITICAL |
| 012 | Query Intelligence | 6 | MEDIUM |
| 013 | Memory Quality & Indexing | 16 | CRITICAL |
| 014 | Pipeline Architecture | 21 | CRITICAL |
| 015 | Retrieval Enhancements | 9 | HIGH |
| 016 | Tooling & Scripts | 8 | MEDIUM |
| 017 | Governance | 2 | LOW |
| 018 | UX Hooks | 13 | HIGH |
| 019 | Decisions & Deferrals | 5 | LOW |
| 020 | Feature Flag Reference | 7 | MEDIUM |

## Agent Delegation

- **3x GPT 5.4 xhigh** (cli-codex): CRITICAL phases 011, 013, 014
- **10x Codex 5.3 xhigh** (cli-copilot): Remaining phases
- **Batch execution:** All 13 agents dispatched in parallel

## Acceptance Criteria

- [ ] All 20 phase folders contain spec.md, plan.md, checklist.md
- [ ] Every feature in every category has a findings entry
- [ ] Each feature notes its EX-*/NEW-* scenario or documents the gap
- [ ] sk-code--opencode checklist applied to every source file
- [ ] Cross-phase synthesis report created
