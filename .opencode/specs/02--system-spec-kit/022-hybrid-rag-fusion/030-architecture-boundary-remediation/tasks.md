---
title: "Tasks: Architecture Boundary Remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "boundary remediation tasks"
  - "api migration tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Architecture Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Constant Migration + Memory-Indexer Fix

- [ ] T001 Add `DB_UPDATED_FILE` export to shared/config (`shared/config.ts`)
- [ ] T002 Re-export `DB_UPDATED_FILE` from core/config for backward compat (`mcp_server/core/config.ts`)
- [ ] T003 Migrate memory-indexer vectorIndex import to api/search (`scripts/core/memory-indexer.ts`)
- [ ] T004 Migrate memory-indexer DB_UPDATED_FILE import to shared/config (`scripts/core/memory-indexer.ts`)
- [ ] T005 Remove 2 resolved allowlist entries (`scripts/evals/import-policy-allowlist.json`)
- [ ] T006 Verify compilation (`npx tsc --noEmit`)
- [ ] T007 Verify boundary checks (`npm run check` from scripts/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Reindex-Embeddings Audit + API Expansion

- [ ] T008 Catalog all mcp_server/lib imports in reindex-embeddings (`scripts/memory/reindex-embeddings.ts`)
- [ ] T009 [P] Check which imports api/ already exposes (`mcp_server/api/search.ts`, `mcp_server/api/index.ts`)
- [ ] T010 Expand api/ with checkpoints and access-tracker exports if feasible (`mcp_server/api/search.ts` or new `mcp_server/api/storage.ts`)
- [ ] T011 Migrate reindex-embeddings imports to api/ where possible (`scripts/memory/reindex-embeddings.ts`)
- [ ] T012 Narrow wildcard allowlist entry or retain with justification (`scripts/evals/import-policy-allowlist.json`)
- [ ] T013 Verify compilation and boundary checks
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Enforcement Automation + Documentation

- [ ] T014 Add pre-commit hook or CI config for boundary checks
- [ ] T015 Update ARCHITECTURE_BOUNDARIES.md current exceptions table (`ARCHITECTURE_BOUNDARIES.md`)
- [ ] T016 Update allowlist `lastReviewedAt` for retained entries (`scripts/evals/import-policy-allowlist.json`)
- [ ] T017 Final verification: all enforcement scripts pass
- [ ] T018 Create implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run check` passes (all 4 enforcement scripts)
- [ ] Allowlist reduced from 6 to 3 or fewer entries
- [ ] Enforcement automation in place
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Architecture Doc**: See `../../ARCHITECTURE_BOUNDARIES.md` (relative to system-spec-kit root)
- **Audit Source**: 5 Gemini 3.1 Pro Preview agents, 2026-03-04
<!-- /ANCHOR:cross-refs -->

---
