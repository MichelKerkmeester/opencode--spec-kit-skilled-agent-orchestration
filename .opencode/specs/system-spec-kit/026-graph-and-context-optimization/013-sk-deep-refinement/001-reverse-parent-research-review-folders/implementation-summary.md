---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Reverse Parent Research/Review Folder Placement"
description: "The deep-loop artifact contract is back to local ownership: root specs stay root-local, child phases own their own packet folders again, and the repo's misplaced child packets have been migrated home."
trigger_phrases:
  - "013/001 implementation summary"
  - "reverse parent folders implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-sk-deep-refinement/001-reverse-parent-research-review-folders"
    last_updated_at: "2026-04-24T16:20:00+02:00"
    last_updated_by: "codex"
    recent_action: "Summarized heuristic and owner-map migration results"
    next_safe_action: "Phase 002 can emit resource maps beside resolved local packet artifacts"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs"
      - ".opencode/skill/system-spec-kit/scripts/migrate-deep-loop-legacy-owner-map.cjs"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-sk-deep-refinement/001-reverse-parent-research-review-folders/resource-map.md"
    session_dedup:
      fingerprint: "sha256:reverse-parent-research-review-folders-implementation"
      session_id: "reverse-parent-research-review-folders-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root specs keep root-local research/ and review/ folders."
      - "Child phases and sub-phases keep local-owner research/ and review/ packet folders."
      - "Phase 002 now depends on this rollback before resuming resource-map emission work."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-reverse-parent-research-review-folders |
| **Completed** | 2026-04-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop artifact contract is back where it started: root specs still write directly into root-local `research/` and `review/`, while child phases and nested sub-phases now resolve and keep their own packet folders locally again. That removes the parent/root coordination detour from reducers, YAMLs, docs, and tests, and it puts child packet history back beside the owning phase instead of scattering it under an ancestor.

### Resolver rollback and runtime alignment

`review-research-paths.cjs` is now the single source of truth for owner-local packet placement. Root specs resolve straight to `{spec_folder}/research` or `{spec_folder}/review`, while child and sub-phase specs resolve to `{spec_folder}/{mode}/{packet}` and reuse an existing packet when the stored `specFolder` already matches the target. Both deep-loop reducers now write only to the resolver-provided `artifactDir`, and the command YAMLs, dashboards, and review contract asset all follow that same path contract.

### Repo-wide migration

The packet added a dedicated migration utility and used it to relocate already-misplaced child packets across the repo. The first applied run discovered 86 misplaced child-owned packets, moved all 86 into their owner-local `research/` or `review/` folders, rewrote 131 live canonical references, hit 0 conflicts, and left 0 heuristic matches in the first post-migration scan. After the residual root packet directories were reviewed manually, a second explicit owner-map pass moved 49 additional child-owned packets, rewrote 24 more live references, hit 0 conflicts, and emptied the remaining root `research/` and `review/` packet directories under `026-graph-and-context-optimization`. Across both passes, 135 child-owned packets were restored to owner-local folders and 155 live canonical references were rewritten.

### Documentation and dependent packet rebase

The deep-research and deep-review READMEs, SKILL docs, references, dashboards, runtime mirrors, folder-structure docs, and contract parity tests were updated to match the restored local-owner contract. Phase `013/002-resource-map-deep-loop-integration` was rebased so it now depends on phase 001 and emits `resource-map.md` beside the actual packet artifacts instead of assuming parent/root ownership.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Modified | Restores the root-local vs owner-local resolver contract and rerun packet reuse. |
| `.opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs` | Created | Migrates misplaced child packets repo-wide and rewrites live canonical references. |
| `.opencode/skill/system-spec-kit/scripts/migrate-deep-loop-legacy-owner-map.cjs` | Created | Manually maps residual root packet directories to their correct owning phases when legacy metadata shapes defeat heuristic discovery. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modified | Binds deep-research writes to the resolver-provided `artifactDir`. |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Modified | Binds deep-review writes to the resolver-provided `artifactDir`. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modified | Keeps prompts and packet artifacts inside the resolved research packet root. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modified | Keeps prompts and packet artifacts inside the resolved review packet root. |
| `.opencode/skill/sk-deep-research/**` | Modified | Rebased docs, references, and dashboards onto the restored child-local contract. |
| `.opencode/skill/sk-deep-review/**` | Modified | Rebased docs, references, dashboards, and review contract assets onto the restored child-local contract. |
| `.opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts` | Modified/Created | Added resolver coverage and updated contract parity expectations. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/**` | Modified/Moved | Relocated 135 child-owned packets back to their owner-local folders across a heuristic pass and a manual owner-map cleanup, then rebased phase 002 docs. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delivery happened in four passes. First, the shared resolver and both reducers were rolled back so they no longer derived child packet paths from a coordination root. Second, command YAMLs, docs, mirrors, folder-structure references, and parity tests were updated to the same contract. Third, the heuristic migration utility applied the repo-wide packet move and rewrote live canonical references. Fourth, after the remaining root packet directories were reviewed manually, an explicit owner-map migration pass moved the residual legacy-shaped packets into their correct phase-local folders and cleared the root `research/` and `review/` packet directories.

Because the local `vitest` config could not load `vitest/config` in this workspace, verification used direct Node assertions against the resolver, the migration reports, and the updated contract surfaces instead of a `vitest` invocation. That still gave executable coverage for the critical root, child, nested, rerun, and migration invariants.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restore local ownership in the shared resolver instead of patching individual writers | One canonical resolver contract keeps reducers, prompts, and docs aligned and removes the parent/root path drift at the source. |
| Reuse existing packets for the same target spec | Reruns must not create sibling packet directories just because resolution no longer points at a parent/root folder. |
| Migrate child-owned packets by reading stored `specFolder` metadata | Ownership needs to come from packet state, not from guessed folder names, so root-owned packets are not moved accidentally. |
| Add an explicit owner-map migration for residual root packets | Some legacy packets used `spec_folder`, review-only config names, packet-pointer frontmatter, or wrapper shapes that the heuristic pass did not classify, so a reviewed manual map was safer than leaving them behind. |
| Rewrite only live canonical references and skip historical-heavy logs | The rollback needed current navigation to keep working without rewriting immutable audit history. |
| Rebase phase 002 immediately after the rollback | The resource-map integration packet depends on the artifact path contract, so leaving it on the old parent-root assumption would reintroduce drift. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs --json` | PASS: discovered 86 misplaced child packets, moved 86, conflicts 0, rewritten live files 131, remaining misplaced packets 0 |
| `node .opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs --dry-run --json` | PASS: post-migration scan found 0 misplaced child packets and 0 additional rewrites |
| `node .opencode/skill/system-spec-kit/scripts/migrate-deep-loop-legacy-owner-map.cjs` | PASS: moved 49 residual root packets, conflicts 0, rewritten live files 24, remaining root research 0, remaining root review 0 |
| Direct Node assertion pass against resolver, migration reports, reducers, YAMLs, docs, and phase 002 packet | PASS: verified root, child, nested, and rerun reuse cases plus owner-local contract surfaces |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [packet] --strict` | PASS: validator returned `Errors: 0  Warnings: 0` after metadata refresh and packet-shape fixes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Direct Node assertions replaced `vitest` for this packet.** The workspace could not load `vitest/config` from the system-spec-kit config path, so executable verification used inline Node assertions instead of the committed `*.vitest.ts` files.
2. **Migration reporting lives outside the repo.** The applied and post-scan JSON reports were captured in `/tmp/deep-loop-migration-apply.json`, `/tmp/deep-loop-migration-post.json`, and `/tmp/deep-loop-legacy-owner-apply.json` for verification, not committed as packet artifacts.
<!-- /ANCHOR:limitations -->
