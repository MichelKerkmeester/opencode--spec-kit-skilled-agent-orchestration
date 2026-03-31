---
title: "Implementation Summary [03--commands-and-skills/035-sk-deep-research-path-migration/implementation-summary]"
description: "Deep-research packet paths now use the canonical research packet root and review iteration folders across the touched command, skill, runtime, helper, doc, test, and corpus-migration surfaces, with verification evidence captured and residual caveats kept explicit."
trigger_phrases:
  - "deep-research path migration implementation summary"
  - "research packet summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary: sk-deep-research Path Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-sk-deep-research-path-migration |
| **Completed** | 2026-03-28 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-research path migration is now landed across the repo surfaces touched in this session. Research-mode packet state now uses the canonical `research/` packet root, review iterations now live under `review/iterations/`, and the review report stays at the `review/` packet root. The implementation also updated helper logic, migration tooling, docs, tests, and the tracked packet corpus so the old root-plus-scratch research contract is no longer the canonical first-party shape.

### Command, Skill, and Runtime Contract

- Deep-research command and skill docs were updated to the canonical packet contract:
  - `.opencode/command/spec_kit/deep-research.md`
  - `.opencode/skill/sk-deep-research/SKILL.md`
  - `.opencode/skill/sk-deep-research/README.md`
  - `.opencode/skill/sk-deep-research/references/loop_protocol.md`
  - `.opencode/skill/sk-deep-research/references/state_format.md`
  - `.opencode/skill/sk-deep-research/references/quick_reference.md`
  - manual playbook files under `.opencode/skill/sk-deep-research/manual_testing_playbook/`
- Runtime parity fixes landed on the touched agent-guidance surfaces, including `.opencode/agent/speckit.md` and `.claude/agents/speckit.md`.
- The `.agents` parity follow-up also landed:
  - `.agents/commands/spec_kit/plan.toml`
  - `.agents/commands/spec_kit/complete.toml`
  - `.agents/commands/spec_kit/phase.toml`
  - `.agents/workflows/spec_kit_research.md`
- Those `.agents` surfaces were aligned away from stale `/spec_kit:research` and `@research` references and now point at `/spec_kit:deep-research`, `@deep-research`, and the canonical OpenCode deep-research command entrypoint.
- Final release housekeeping also landed for the skill package: `.opencode/skill/sk-deep-research/SKILL.md` is now version `1.2.2.0`, and `.opencode/changelog/12--sk-deep-research/v1.2.2.0.md` was added to record this migration release.

### Helper Logic and Migration Support

- Path-sensitive helper logic was updated in:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
  - `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`
  - `.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts`
  - `.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts`
- Supporting `system-spec-kit` docs, examples, and fixtures were updated so touched first-party references now match the landed packet contract.
- A post-closeout representative migrated-packet check exposed a migration-utility regression where same-packet research references were being rewritten into a duplicated nested form. The source utility was then fixed so it collapses same-packet duplicate research-path references for bare and dot-relative forms, and only rewrites safe bare or packet-relative research-document references instead of broadly mutating arbitrary paths that happen to end with the same filename.

### Corpus Migration

The migration utility was run over the tracked packet corpus with:
- `Moved files: 0`
- `Rewritten text files: 347`
- `Skipped conflicts: 0`

After the utility fix, the migration utility was run again over the tracked packet corpus with:
- `Moved files: 0`
- `Rewritten text files: 300`
- `Skipped conflicts: 0`

Post-migration sweeps over `.opencode/specs` showed:
- no legacy root research documents outside the canonical research packet root
- no legacy `scratch/iteration-*`
- no direct legacy `review/iteration-*`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The migration landed in four coordinated tracks. First, command and skill surfaces were updated so first-party guidance points at the canonical packet roots. Second, `system-spec-kit` helper logic and migration support were updated so packet discovery, parsing, frontmatter migration, and folder scoring align with the new layout. Third, verification coverage was run across build, typecheck, CLI, targeted Vitest suites, and command workflow tests. Fourth, the tracked `.opencode/specs` corpus was rewritten through the migration utility and then checked with zero-count sweeps for the retired canonical paths. When the representative migrated-packet validation exposed the same-packet rewrite regression, the migration utility was corrected, rebuilt, rerun over the corpus, and revalidated before this packet was synchronized again. After the main migration closeout, the `.agents` command wrappers and workflow markdown were also brought into parity so they no longer route through stale research naming, and the release housekeeping closed with the `1.2.2.0` skill version bump plus the matching changelog entry.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat `research/` as the canonical research packet root | This removes the mixed root-plus-scratch contract and gives research mode a single durable packet home |
| Treat `review/iterations/` as the canonical review iteration location | This keeps review packets internally consistent while preserving the review report at the `review/` packet root |
| Keep bounded legacy tolerance in helper logic | The corpus is migrated, but helper logic still intentionally recognizes some legacy shapes to avoid brittle behavior during transition |
| Narrow migration rewrites to safe packet-relative research references | The representative migrated-packet regression proved that broader same-filename rewriting was too aggressive for same-packet links |
| Sync `.agents` wrappers and workflow docs after the main migration | Wrapper and workflow parity still matters because stale `/spec_kit:research` and `@research` references would undercut the renamed command surface |
| Finish with explicit release housekeeping | The skill version and changelog need to reflect the landed migration so the release record stays coherent |
| Skip a disposable live smoke in this session | Build, typecheck, test, CLI, workflow, migration, and sweep evidence are strong, but no full live `/spec_kit:deep-research` throwaway run was executed here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run --workspaces=false build` in `.opencode/skill/system-spec-kit` | PASS, including the rerun after the migration-utility fix |
| `npm run --workspaces=false typecheck` in `.opencode/skill/system-spec-kit` | PASS |
| `npm run --workspaces=false test:cli` in `.opencode/skill/system-spec-kit` | PASS |
| `npm run test:core -- tests/folder-scoring.vitest.ts tests/full-spec-doc-indexing.vitest.ts tests/memory-types.vitest.ts tests/artifact-routing.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `node scripts/tests/test-phase-command-workflows.js` in `.opencode/skill/system-spec-kit` | PASS, now 72/72 |
| Initial migration utility run over `.opencode/specs` | PASS with `Moved files: 0`, `Rewritten text files: 347`, `Skipped conflicts: 0` |
| Migration utility rerun after the rewrite fix | PASS with `Moved files: 0`, `Rewritten text files: 300`, `Skipped conflicts: 0` |
| Post-migration corpus sweeps | PASS with zero residual root research docs outside canonical packet roots, zero legacy `scratch/iteration-*`, and zero direct legacy `review/iteration-*` |
| Representative migrated-packet strict validation | PASS for `023-esm-module-compliance` with `0` errors and `0` warnings |
| Strict validation for this packet | PASS via `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`, including the post-closeout resync |
| Full disposable live `/spec_kit:deep-research` or review-mode smoke | NOT RUN IN THIS SESSION |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Bounded legacy tolerance remains.** Helper logic and tests still intentionally tolerate some legacy path shapes where that behavior is part of the transition strategy.
2. **No disposable end-to-end smoke was run.** This session did not execute a full live `/spec_kit:deep-research` or `/spec_kit:deep-research:review` throwaway run after the migration.
3. **Historical or non-live examples beyond the touched surfaces can still remain deferred.** The evidence proves the migrated packet corpus and touched first-party surfaces, but not every historical example outside those surfaces.
<!-- /ANCHOR:limitations -->
