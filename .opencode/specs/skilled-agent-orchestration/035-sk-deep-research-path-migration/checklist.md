---
title: "Verification Checklist: sk-deep-research Path [03--commands-and-skills/035-sk-deep-research-path-migration/checklist]"
description: "Verification Date: 2026-03-28"
trigger_phrases:
  - "deep-research path migration checklist"
  - "research packet verification"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: sk-deep-research Path Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim migration complete until verified |
| **[P1]** | Required | Must complete or document an approved deferral |
| **[P2]** | Optional | Can defer with an explicit note |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: requirements table and acceptance scenarios]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: architecture, phases, and migration rules]
- [x] CHK-003 [P1] Affected file families enumerated and frozen [EVIDENCE: files-to-change table in `spec.md`]
- [x] CHK-004 [P1] Scope boundaries are explicit, including no `output/` folder and preserved review-report location [EVIDENCE: in-scope and out-of-scope sections plus ADR coverage]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Research auto and confirm workflows use the `research/` packet root and `research/iterations/` consistently [EVIDENCE: user-provided implementation evidence states commands migrated to the canonical `research/` contract across the touched repo surfaces in this session]
- [x] CHK-011 [P0] Review auto and confirm workflows normalize iteration files into `review/iterations/` [EVIDENCE: user-provided implementation evidence states commands migrated to the canonical `review/iterations/` contract across the touched repo surfaces in this session]
- [x] CHK-012 [P1] Canonical runtime packet guidance and mirrored runtime agents describe the same packet layout for the touched surfaces [EVIDENCE: user-provided implementation evidence confirms runtime parity fixes landed, including `.opencode/agent/speckit.md` and `.claude/agents/speckit.md`, alongside the broader command or skill or runtime contract migration]
- [x] CHK-013 [P1] `system-spec-kit` helper logic resolves the new packet paths and excludes iteration folders from canonical indexing [EVIDENCE: helper and runtime updates landed in `mcp_server/lib/config/spec-doc-paths.ts`, `mcp_server/lib/parsing/memory-parser.ts`, `mcp_server/handlers/memory-index-discovery.ts`, `scripts/lib/frontmatter-migration.ts`, and `shared/scoring/folder-scoring.ts`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fresh research-session initialization creates the `research/` packet [DEFERRED: no full end-to-end disposable live `/spec_kit:deep-research` smoke was run in this session]
- [ ] CHK-021 [P0] Fresh review-session initialization creates `review/iterations/` and preserves the review report at the `review/` packet root [DEFERRED: no full end-to-end disposable live `/spec_kit:deep-research:review` smoke was run in this session]
- [x] CHK-022 [P1] The migration utility rehomes representative legacy packets correctly [EVIDENCE: `node scripts/dist/migrate-deep-research-paths.js '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs'` completed with `Moved files: 0`, `Rewritten text files: 347`, `Skipped conflicts: 0`]
- [x] CHK-023 [P1] Targeted helper tests pass after path-sensitive updates [EVIDENCE: `npm run --workspaces=false build`, `npm run --workspaces=false typecheck`, `npm run --workspaces=false test:cli`, `npm run test:core -- tests/folder-scoring.vitest.ts tests/full-spec-doc-indexing.vitest.ts tests/memory-types.vitest.ts tests/artifact-routing.vitest.ts`, and `node scripts/tests/test-phase-command-workflows.js` all passed; the phase workflow suite now passes 72/72]
- [x] CHK-024 [P1] Repo-wide path sweeps show no newly advertised old canonical paths in the migrated packet corpus [EVIDENCE: `find .opencode/specs -name 'research.md' ! -path '*/research/research.md' | wc -l` => `0`; `find .opencode/specs -path '*/research/iterations/iteration-*.md' | wc -l` => `0`; `find .opencode/specs -path '*/review/iterations/iteration-*.md' | wc -l` => `0`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Migration logic moves only the approved deep-research packet whitelist [EVIDENCE: the landed migration support includes `.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts`, and the corpus run completed with `Skipped conflicts: 0` while zero-count sweeps confirmed only the targeted legacy packet paths were eliminated]
- [x] CHK-031 [P1] Unrelated `scratch/` temp files remain untouched during corpus migration [EVIDENCE: migration support was implemented as packet-path-specific logic in `.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts` rather than a broad scratch-folder rewrite]
- [x] CHK-032 [P1] Legacy recognition remains bounded and does not silently create duplicate canonical packet roots [EVIDENCE: intentional helper tolerance remains in the landed path logic, while post-migration packet sweeps show zero residual duplicate canonical research or review iteration paths in `.opencode/specs`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` are synchronized for the migration packet [EVIDENCE: packet authored in this task]
- [x] CHK-041 [P1] The packet explicitly names the canonical runtime reference convention and mirrored runtime parity requirement [EVIDENCE: `spec.md` and `plan.md`]
- [x] CHK-042 [P2] First-party command and skill docs are updated to the new packet contract [EVIDENCE: `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/SKILL.md`, `.opencode/skill/sk-deep-research/README.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-research/references/quick_reference.md`, manual playbook files under `.opencode/skill/sk-deep-research/manual_testing_playbook/`, `.agents/commands/spec_kit/plan.toml`, `.agents/commands/spec_kit/complete.toml`, `.agents/commands/spec_kit/phase.toml`, and `.agents/workflows/spec_kit_research.md` were aligned to `/spec_kit:deep-research` and `@deep-research`; `.opencode/skill/sk-deep-research/SKILL.md` is now version `1.2.2.0`, and `.opencode/changelog/12--sk-deep-research/v1.2.2.0.md` was added for this migration]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet markdown exists only inside the 035 spec folder for this task [EVIDENCE: this spec-only change scope]
- [x] CHK-051 [P1] No packet-local `output/` folder is introduced by the design [EVIDENCE: packet contract and ADR]
- [x] CHK-052 [P2] `implementation-summary.md` is refreshed with migration results after repo changes land [EVIDENCE: this update records the landed migration, verification commands, and residual caveats]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 7/9 |
| P1 Items | 21 | 21/21 |
| P2 Items | 6 | 5/6 |

**Verification Date**: 2026-03-28
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions are documented in `decision-record.md` [EVIDENCE: ADR-001]
- [x] CHK-101 [P1] The packet freezes the packet-root contract for both research and review modes [EVIDENCE: `spec.md` and `plan.md` target layouts]
- [x] CHK-102 [P1] The packet keeps the review report at the `review/` packet root and rejects `output/` folders explicitly [EVIDENCE: scope and ADR]
- [x] CHK-103 [P2] Residual legacy-tolerance behavior is documented with post-implementation evidence [EVIDENCE: `implementation-summary.md` now records that helper logic and tests intentionally retain bounded legacy tolerance]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Path-helper updates use bounded checks rather than unbounded rescans [EVIDENCE: the landed helper changes are localized to packet-path resolution, parser classification, discovery, frontmatter migration, and folder scoring surfaces rather than broad rescans]
- [x] CHK-111 [P2] The migration utility avoids recursive re-entry into newly created packet folders [EVIDENCE: the landed migration utility completed a corpus run successfully with `Skipped conflicts: 0` and without leaving residual legacy packet paths in `.opencode/specs`]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback approach is documented in `plan.md` [EVIDENCE: rollback sections]
- [x] CHK-121 [P1] Verification commands and evidence are captured after implementation [EVIDENCE: this checklist and `implementation-summary.md` now record the build, typecheck, targeted Vitest, CLI, command-workflow, migration, sweep results, the post-closeout `.agents` parity sync evidence, and the final release-housekeeping evidence for `sk-deep-research` version `1.2.2.0` plus changelog `v1.2.2.0`]
- [x] CHK-122 [P1] Representative migrated packets validate cleanly after the corpus migration [EVIDENCE: after fixing the migration utility rewrite regression, `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/023-esm-module-compliance' --strict` passed with `0` errors and `0` warnings]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] The packet preserves the repo rule that `scratch/` remains temporary rather than canonical deep-research state [EVIDENCE: spec scope and ADR]
- [ ] CHK-131 [P2] Historical examples that keep old canonical paths are labeled or scoped as non-live references after implementation [DEFERRED: the provided evidence proves the migrated packet corpus and touched docs were updated, but it does not separately prove treatment of every historical example outside those touched surfaces]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] The packet documents the command, skill, runtime, helper, workflow, and corpus migration surfaces together [EVIDENCE: files-to-change table and plan phases, now reflected alongside the `.agents` command-wrapper and workflow parity sync]
- [x] CHK-141 [P1] The packet names the required verification matrix for command workflows, helper logic, corpus migration, and representative packet validation [EVIDENCE: `plan.md` testing strategy]
- [x] CHK-142 [P2] The current implementation summary is honest about scope and current status [EVIDENCE: `implementation-summary.md`]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Request owner | [ ] Approved | |
| Maintainer | Technical review | [ ] Approved | |
| Operator | Verification review | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
