---
title: "Implementation Summary: Phase Parent Generator Pointer + Polish"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Generator now writes a derived.last_active_child_id pointer at phase-parent saves and bubbles up from child saves. Resume honors a fresh pointer first and falls back to listing. Lean phase-parent template ships as the default in create.sh --phase. Content-discipline validator warns on merge/migration narratives."
trigger_phrases:
  - "phase parent generator implementation"
  - "phase parent pointer shipped"
  - "lean phase parent default"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/002-generator-and-polish"
    last_updated_at: "2026-04-27T13:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation-summary.md after codex (gpt-5.5/medium/fast) shipped all 18 tasks"
    next_safe_action: "Run canonical save; pointer bubble-up should populate 010 graph-metadata"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/002-generator-and-polish/` |
| **Completed** | 2026-04-27 |
| **Level** | 2 |
| **Predecessor** | `001-validator-and-docs` (validator + detection + lean template + docs sync) |
| **Executor** | cli-codex with `gpt-5.5` reasoning=medium service_tier=fast (~15 min wall clock) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A `/memory:save` against a phase parent now stamps `derived.last_active_child_id = null` and `derived.last_active_at = ISO_8601_NOW` into the parent's `graph-metadata.json`. A save against a child of a phase parent ALSO writes the child's `packet_id` and timestamp into the parent's metadata. `/spec_kit:resume` reads that pointer first: if non-null and within 24h, it recurses straight into the active child; otherwise it falls back to listing children with statuses. Users can bypass the redirect with `--no-redirect` to inspect the parent surface directly. New phase decompositions via `create.sh --phase` get the lean parent template by default — no more vestigial heavy docs at the parent.

### Generator pointer-write + bubble-up

`updatePhaseParentPointersAfterSave()` in `scripts/memory/generate-context.ts:428` checks `isPhaseParent()` on the save target. If true, it writes `null` to `last_active_child_id` (a parent-level save isn't tied to a child). If false, it checks the direct parent — if THAT is a phase parent, it reads the saved target's `packet_id` from its `graph-metadata.json` and writes it to the parent's pointer. Atomic write via `atomicWriteJson()` at line 372: temp file in same dir, then `fs.renameSync()`. POSIX-safe, no torn writes under concurrent saves.

### Resume pointer-redirect

`.opencode/command/spec_kit/resume.md` step 3b now reads `derived.last_active_child_id` first when the target is a phase parent. The redirect fires only when (a) the value is a non-null string, (b) `derived.last_active_at` parses as ISO-8601, and (c) the timestamp is within the last 24 hours. Stale, malformed, or missing pointers fall through to the existing list-children-with-statuses behavior. `--no-redirect` skips the pointer step entirely. Both the `auto` and `confirm` YAML assets mirror this logic.

### Lean phase-parent default in `create.sh --phase`

`scripts/spec/create.sh` parent path now copies `templates/phase_parent/spec.md` and fills the placeholders (feature name, packet id, phase rows, handoff criteria). Children continue to receive their level-N templates unchanged. New decompositions land with the lean trio at parent level by default — no more retrofitting.

### `templates/context-index.md`

Created as an optional cross-cutting template for phase parents that have undergone reorganization (renames, gap renumbers, consolidation). Author Instructions (line 18) explicitly state: "use only when reorganizing"; it is never auto-scaffolded.

### `templates/resource-map.md` polish

Author Instructions §Scope shape (line 191) sharpened to: at phase parents, prefer ONE mode — parent-aggregate (single map listing children's touched paths) OR per-child resource-maps. Don't author both. Document choice in the Scope line.

### `check-phase-parent-content.sh` (P2 validator)

Severity `warn`. Runs only when `is_phase_parent($folder)` returns true. Scans `spec.md` for forbidden tokens (`consolidat[a-z]*`, `merged from`, `renamed from`, `collapsed`, `[0-9]+→[0-9]+`, `reorganization`). Code-fence aware — matches inside ```` ```fences``` ```` are skipped. Registered in `validator-registry.json` as `PHASE_PARENT_CONTENT`.

### Documentation sync

CLAUDE.md (§1 fallback resume ladder, line 98) and AGENTS.md (resume ladder + §3 Documentation Levels Phase Parent Mode block) both updated to mention the pointer-first behavior. `references/hooks/skill-advisor-hook.md` brief assembler honors the same redirect.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modified | `isPhaseParent` import; `updatePhaseParentPointersAfterSave` + `atomicWriteJson` helpers; pointer-write at parent saves + bubble-up at child saves |
| `.opencode/skill/system-spec-kit/scripts/spec/is-phase-parent.ts` | Created | New ESM source under the `"type":"module"` package; pairs with the existing mcp_server CJS twin so the dist is auto-rebuildable by `tsc --build` |
| `.opencode/skill/system-spec-kit/scripts/dist/spec/is-phase-parent.js` | Rebuilt | tsc-emitted ESM dist with sourceMappingURL — replaces my hand-rolled fallback from 001 |
| `.opencode/skill/system-spec-kit/scripts/tsconfig.json` | Modified | Includes scripts/spec for the new ESM source |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modified | `--phase` parent path copies `templates/phase_parent/spec.md` and fills placeholders |
| `.opencode/skill/system-spec-kit/templates/context-index.md` | Created | Migration-bridge template (optional, never auto-scaffolded) |
| `.opencode/skill/system-spec-kit/templates/resource-map.md` | Modified | Author Instructions §Scope shape sharpened for phase parents |
| `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh` | Created | P2 token-scan validator with code-fence awareness |
| `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json` | Modified | Registered `PHASE_PARENT_CONTENT` rule (severity warn) |
| `.opencode/command/spec_kit/resume.md` | Modified | Pointer-first redirect with stale-pointer fallback and `--no-redirect` bypass |
| `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml` | Modified | Mirrors resume.md redirect logic |
| `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml` | Modified | Mirrors resume.md redirect logic |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modified | Brief assembler honors phase-parent redirect |
| `AGENTS.md` | Modified | Resume ladder mentions pointer-first behavior |
| `CLAUDE.md` | Modified | Resume ladder mentions pointer-first behavior |
| `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts` | Created | 4 vitest fixtures: parent pointer write, child bubble-up, concurrent atomic, non-phase no-op |
| `.opencode/specs/.../002-generator-and-polish/scratch/e2e-trace.txt` | Created | Real round-trip trace: scaffolded tmp packet, ran generator save against child, parent pointer populated, resume simulation returned `{redirected: true}` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Cross-AI handback to cli-codex (`gpt-5.5` reasoning=medium service_tier=fast, sandbox=workspace-write, approval=never). The brief at `/tmp/codex-brief-002-generator-and-polish.md` named tolerant migration as a hard constraint, called out the ESM/CJS module-flavor trap from 001, and required atomic writes and per-write validation. Codex returned in ~15 minutes with all 18 tasks marked `[x]`, the entire P0/P1 checklist verified with file:line evidence, vitest 4/4 passing, the e2e trace captured under `scratch/e2e-trace.txt`, and a structured JSON summary on stdout. Two monitors armed during the run: a 2-min status pulse (`b4zv8rjhd`) showed steady progress (0/18 → 7/18 → 11/18 → 18/18 with extras flipped on completion criteria) and a one-shot completion signal (`bacda42lt`) fired at exit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| New ESM source at `scripts/spec/is-phase-parent.ts` instead of importing the CJS mcp_server twin from generator | The generator runs under the `"type":"module"` scripts package; importing CJS from ESM is awkward and fragile. A duplicate ESM source compiled by the same tsconfig is cleaner and survives future rebuilds without hand-rolled fallbacks. |
| Pointer fields default to `null` (not undefined) when target is parent-level save | Explicit null reads cleaner in JSON than missing keys; downstream consumers can treat null and missing identically without special-casing. |
| Atomic write via temp+rename in same directory | POSIX rename is atomic when source and dest are on the same filesystem. Same-dir tmpfile guarantees that. Prevents torn writes under SIGTERM mid-write or concurrent saves. |
| `--no-redirect` flag rather than env var | Flag is per-invocation and discoverable in `--help`; env var would persist across sessions and surprise users. |
| Code-fence aware token scan in content validator | Reviewers occasionally need to discuss "merged from" or "consolidated" inside fenced examples or migration history excerpts. Fence-skip avoids false positives on legitimate documentation about the policy. |
| Registered `PHASE_PARENT_CONTENT` as severity `warn` not `error` | Reviewer discipline already carries content-discipline through 001's template guidance. Warn-level lets it surface drift without blocking unrelated work. Promote to error if drift recurs. |
| 24-hour staleness threshold hard-coded | Configurability is YAGNI for v1. If real workflows need different windows, env var override is a one-line follow-on. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd scripts && npx tsc --build` | PASS — TypeScript build clean, dist regenerated |
| `vitest run scripts/tests/phase-parent-pointer.vitest.ts` | PASS — 4/4 tests: parent pointer write, child bubble-up, concurrent atomic consistency, non-phase no-op |
| `bash -n create.sh && bash -n check-phase-parent-content.sh` | PASS — shell syntax checks |
| `create.sh --phase --phases 2 --level 2 --skip-branch` (tmp fixture) | PASS — parent has only `{spec.md, description.json, graph-metadata.json}` plus child folders; children retain Level 1 docs |
| Manual E2E generator save + pointer resume | PASS — scaffolded tmp packet, ran generator save against child, parent pointer populated with child's packet_id and fresh timestamp, resume simulation returned `{redirected: true, fresh: true}`. Tmp scaffold cleaned up. Trace at `scratch/e2e-trace.txt`. |
| `validate.sh --strict` against `002-generator-and-polish/` | 2 errors, 1 warning — same baseline residuals as 001 (SPEC_DOC_INTEGRITY 25 forward refs, TEMPLATE_HEADERS 1 non-blocking). All other rules PASS including ANCHORS_VALID, EVIDENCE_CITED, FRONTMATTER_MEMORY_BLOCK, GRAPH_METADATA_PRESENT, SECTION_COUNTS, TEMPLATE_SOURCE, COMPLEXITY_MATCH, LEVEL_MATCH, EVIDENCE_MARKER_LINT, CONTINUITY_FRESHNESS, PHASE_PARENT_CONTENT (correctly skipped at child level) |
| `validate.sh --strict` regression on `026-graph-and-context-optimization/` | PASS — no new error class introduced; only legacy baseline errors and new advisory `PHASE_PARENT_CONTENT` warns appear |
| codex's stdout JSON summary | `ready_for_summary: true`, `tasks_completed: [T001..T018]`, `tasks_blocked: []`, `blocking_issues: []` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Voyage embedding network failures during e2e test.** The captured e2e trace shows transient `voyage-embedding fetch failed` retries during the indexer step — these are external network glitches against the Voyage API, not a regression in the generator. Saves still succeeded with deferred indexing (BM25/FTS5 search remains available; embeddings hydrate on next online save).

2. **Concurrent-save guarantee is eventual consistency, not linearizable.** Two children saving simultaneously produce a parent pointer reflecting whichever save's rename completed last. The 24h staleness window plus the list-fallback in resume absorb this — no user-visible bug — but it's worth knowing for high-frequency multi-child save scenarios.

3. **`PHASE_PARENT_CONTENT` validator is heuristic, not perfect.** Token scan with code-fence awareness catches common drift (`consolidated`, `merged from`, `29→9`) but won't flag novel narrative phrasings ("we collapsed five tracks into two", "originally lived in") that don't match the literal token list. Reviewer judgment remains the primary line of defense.

4. **Resume pointer redirect adds 1 file read on every phase-parent resume.** Cost is ~1ms in practice (single small JSON), well under the listing-fallback's directory walk + per-child stat. Net win, but not zero overhead.

5. **No follow-on packet for soft deprecation of legacy heavy docs (e.g. 026's `plan.md`/`tasks.md`/...).** Tolerant policy preserves them as before. A future packet under 026 could introduce an opt-in `migrate-phase-parent.sh` that archives legacy heavy docs to `z_archive/legacy-parent-docs/` once the lean policy has stabilized.

6. **Phase-parent branch not extended to all validator rules yet.** `check-anchors.sh`, `check-section-counts.sh`, `check-template-headers.sh` still expect the full Level-2 anchor set on a lean parent — produces non-blocking errors on `010/spec.md` itself. Discovered in the 010 restructure session; tracked as a small follow-on (extend phase-parent branch to those three rules).
<!-- /ANCHOR:limitations -->
