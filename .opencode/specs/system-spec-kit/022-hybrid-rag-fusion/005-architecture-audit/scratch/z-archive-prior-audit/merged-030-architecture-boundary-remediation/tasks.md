---
title: "...d-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/merged-030-architecture-boundary-remediation/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "boundary remediation tasks"
  - "api migration tasks"
importance_tier: "normal"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
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

<!-- ANCHOR:phase-0 -->
## Phase 0: Pre-Implementation Hardening (Cross-AI Review P0)

> Source: unified-synthesis.md (2026-03-05, 10-agent cross-AI review of 012+013)

- [x] T019 [P0] Mandate CI-level enforcement in spec.md — replace "pre-commit or CI" with mandatory CI pipeline requirement; define target CI system, pipeline stage, and failure policy (`spec.md` §3, §4 REQ-007, §5 SC-003)
- [x] T020 [P0] Document regex evasion vectors — create decision record for accepted risk vs. AST fast-track: template literal bypass, block-comment same-line bypass, 1-hop transitive limit, `core/*` unblocked imports (`decision-record.md`)
- [x] T021 [P0] Add expiry-warning automation for allowlist `expiresAt` dates (2026-06-04, 2026-09-04) — implement 30-day advance CI warning or pre-commit check (`scripts/evals/check-allowlist-expiry.ts` or existing enforcement)
- [x] T022 [P0] Fix broken cross-reference paths in 030 docs — verify all file path references resolve to actual locations (`tasks.md`, `spec.md`, `plan.md`)
- [x] T023 [P0] Strengthen SC-001 — ensure success criterion covers dynamic deep-require bypass enforcement, not just static allowlist reduction (`spec.md` §5)
<!-- /ANCHOR:phase-0 -->

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

<!-- ANCHOR:phase-4 -->
## Phase 4: 012 Documentation Remediation (Cross-AI Review P1)

> Source: unified-synthesis.md — these tasks close documentation gaps in 012 before formal sign-off

- [x] T024 [P1] Update ADR-004 status from "Proposed" to "Accepted" in 029 (`010-architecture-audit/decision-record.md`)
- [x] T025 [P1] Backfill 7 orphaned task-to-checklist links in 029 — T018, T019, T020, T036, T053, T058, T070 lack CHK items (`010-architecture-audit/checklist.md`)
- [x] T026 [P1] Refresh 029 implementation-summary.md with Phases 4-6 artifacts and updated file change inventory (`010-architecture-audit/implementation-summary.md`)
- [x] T027 [P1] Verify and remove T013a `escapeLikePattern` re-export still present at memory-save.ts L1444 (`mcp_server/handlers/memory-save.ts`)
- [x] T028 [P1] Add handler-utils.ts structural shift ADR to 029 decision record (`010-architecture-audit/decision-record.md`)
- [x] T029 [P1] Backfill 5 orphaned requirements traceability — REQ-001, 002, 004, 003, 004 lack task mappings (`010-architecture-audit/spec.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Technical Debt Remediation (Cross-AI Review P2)

> Source: unified-synthesis.md — code quality issues found during architecture review

- [x] T030 [P2] Fix non-ASCII slug degradation — `/[^a-z0-9]+/g` strips non-Latin text, collapsing to generic fallback; add Unicode-safe slug generation (`scripts/utils/slug-utils.ts`)
- [x] T031 [P2] Harden frontmatter parsing — multiple implementations use naive `---` regex that fails on YAML literals containing markdown delimiters (`scripts/core/file-writer.ts`, `shared/parsing/quality-extractors.ts`)
- [x] T032 [P2] Add chunk failure rollback guard — if all child chunk inserts throw after parent created, no `successCount===0` cleanup exists (`mcp_server/handlers/chunking-orchestrator.ts`)
- [x] T033 [P2] Review API surface encapsulation before exposing checkpoints/access-tracker — assess whether T010 api expansion breaks encapsulation principles; document decision (`decision-record.md`)
- [x] T034 [P2] Update 029 ADR "Five Checks" P2 AST claim — un-executed AST upgrade falsely claimed "No tech debt"; correct the record (`010-architecture-audit/decision-record.md`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 0 P0 tasks marked `[x]` (hard blockers)
- [ ] All Phase 1-3 tasks marked `[x]`
- [x] All Phase 4 P1 tasks marked `[x]` or user-approved deferral
- [x] All Phase 5 P2 tasks marked `[x]` or documented deferral
- [ ] No `[B]` blocked tasks remaining
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run check` passes (all 4 enforcement scripts)
- [ ] Allowlist reduced from 6 to 3 or fewer entries
- [ ] CI-level enforcement in place (not pre-commit-only)
- [ ] Evasion vectors documented with accepted risk or mitigation timeline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Architecture Doc**: See `../../ARCHITECTURE_BOUNDARIES.md` (relative to system-spec-kit root)
- **Audit Source**: 5 Gemini 3.1 Pro Preview agents, 2026-03-04
- **Cross-AI Review**: 5 Codex xhigh (GPT-5.3) + 5 Gemini 3.1 Pro, 2026-03-05
- **Synthesis**: `010-architecture-audit/scratch/cross-ai-review-2026-03-05/unified-synthesis.md`
<!-- /ANCHOR:cross-refs -->

---
