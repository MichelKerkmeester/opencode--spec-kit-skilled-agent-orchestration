# Agent Brief — 012/006 Docs and Catalogs Rollup

You are an autonomous documentation agent. **No conversation context.** This brief is everything you need.

## Your role

After sub-phases 002, 003, 004, 005 ship, you sync the umbrella docs (root README, skill SKILL.md/README, mcp_server README/INSTALL_GUIDE) and consolidate the per-packet feature_catalog/manual_testing_playbook entries written inline by 002-005. **Sync, not aspiration** — only document what was actually shipped.

## Read first (in this exact order)

1. **Sub-phase spec (your scope, READ FULLY):**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/spec.md`
2. **Sub-phase plan + tasks + checklist:**
   `.../006-docs-and-catalogs-rollup/{plan.md,tasks.md,checklist.md}`
3. **Phase-root (read-only):**
   `.../012-graph-impact-and-affordance-uplift/{spec.md,decision-record.md}` (note ADR-012-007: per-packet inline + trailing rollup)
4. **All four code sub-phase outcomes (your source-of-truth — sync to these):**
   - `.../012/002-code-graph-phase-runner-and-detect-changes/implementation-summary.md`
   - `.../012/003-code-graph-edge-explanation-and-impact-uplift/implementation-summary.md`
   - `.../012/004-skill-advisor-affordance-evidence/implementation-summary.md`
   - `.../012/005-memory-causal-trust-display/implementation-summary.md`
5. **Per-packet entries already written (002-005 inline):**
   - `feature_catalog/03--discovery/` (002 entry)
   - `feature_catalog/06--analysis/` (003 entry)
   - `feature_catalog/11--scoring-and-calibration/` (004 entry)
   - `feature_catalog/13--memory-quality-and-indexing/` (005 entry)
   - `feature_catalog/14--pipeline-architecture/` (002 entry)
   - Same five categories under `manual_testing_playbook/`

## Worktree + branch

- Worktree: `../012-006` (`git worktree add ../012-006 -b feat/012/006-docs-rollup`)
- Branch: `feat/012/006-docs-rollup`
- ⚠️ **Hard dependency:** sub-phases 002, 003, 004, 005 must all be merged before you start. Confirm via `git log --oneline main | head` showing all four merge commits.

## Files you may touch

| File | Action |
|------|--------|
| `/README.md` (repo root) | **MODIFY** — features section reflects new capabilities (phase runner, detect_changes, blast_radius uplift, affordance evidence, trust badges) |
| `.opencode/skill/system-spec-kit/SKILL.md` | **MODIFY** — capability matrix update |
| `.opencode/skill/system-spec-kit/README.md` | **MODIFY** — feature index |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | **MODIFY** — handler list (add `detect_changes`); note enriched query/blast_radius outputs and new affordance lane wiring |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | **MODIFY** — verification steps include one smoke test per new capability (4 sub-phases × 1 smoke each) |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | **MODIFY** — top-level index lists the 5 new per-packet entries with correct paths |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | **MODIFY** — top-level index lists the 5 new per-packet playbook entries |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/merged-phase-map.md` | **MODIFY** — add 012 entry as the GitNexus implementation phase derived from pt-01 + pt-02 |
| `012/006/implementation-summary.md` | **MODIFY** — populate Capabilities Reflected, Before/After Diff Summary, DQI Scores |

## Files you may NOT touch

- 012 phase-root files (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)
- Other sub-phase folders (001-005)
- Any code under `mcp_server/`
- `external/` (read-only)
- The per-packet feature_catalog/playbook entries themselves (002-005 own them; you only update the top-level indexes pointing at them)

## Hard rules

1. **Clean-room only** (ADR-012-001) for any cited GitNexus pattern (cite, don't copy).
2. **Sync, not aspiration** — every claim in updated docs MUST be supported by 002/003/004/005 implementation-summary.md content. If 002 chose diff-parser library X, document X. If 005 deferred `weightHistoryChanged`, document the deferral.
3. **No broken links** — every internal reference must resolve. Use `grep` or a link checker.
4. **sk-doc DQI ≥85** on each modified umbrella doc.
5. **INSTALL_GUIDE smoke tests** — at least one verification step per new capability (detect_changes, blast_radius enrichment, affordance evidence, memory trust badges). Each smoke test must be runnable end-to-end.
6. **Top-level index entries** — list all 5 new per-packet entries (002 contributes 2: `03--discovery` + `14--pipeline-architecture`; 003 contributes 1: `06--analysis`; 004 contributes 1: `11--scoring-and-calibration`; 005 contributes 1: `13--memory-quality-and-indexing`).
7. **Read whole file before edit.**

## Success criteria

- [ ] All 18 tasks in `012/006/tasks.md` complete (T-006-A1 through T-006-F3)
- [ ] All checklist items in `012/006/checklist.md` ticked with evidence
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../012/006 --strict` passes
- [ ] sk-doc DQI ≥85 on root README, system-spec-kit/SKILL.md, system-spec-kit/README.md, mcp_server/README.md, mcp_server/INSTALL_GUIDE.md
- [ ] No broken links (grep verification)
- [ ] INSTALL_GUIDE smoke tests run successfully
- [ ] feature_catalog top-level index lists 5 new entries with correct relative paths
- [ ] manual_testing_playbook top-level index lists 5 new entries
- [ ] merged-phase-map.md has new 012 row
- [ ] `implementation-summary.md` populated with before/after diff summary + DQI scores per file

## Output contract

- Commit to `feat/012/006-docs-rollup` with conventional-commit messages
- Final commit suffix: `(012/006)`
- Do NOT merge — orchestrator handles merges
- On completion, print: `EXIT_STATUS=DONE` + DQI score table + smoke-test pass/fail + LOC delta

## References

- pt-02 §11 (no specific packet — 006 is user-requested addition per ADR-012-007)
- ADR-012-007 (per-packet inline + trailing umbrella rollup)
- 002-005 implementation-summary.md (your source-of-truth)
- sk-doc skill: `.opencode/skill/sk-doc/SKILL.md`
