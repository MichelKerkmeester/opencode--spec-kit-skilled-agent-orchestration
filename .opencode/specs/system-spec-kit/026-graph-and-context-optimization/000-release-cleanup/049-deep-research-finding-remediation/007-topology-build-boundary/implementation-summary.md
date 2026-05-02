---
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
title: "Implementation Summary: 007 Topology And Build/Dist Boundary Remediation [template:level_2/implementation-summary.md]"
description: "Six surgical edits across the implement-workflow YAML, the dual phase-parent detection mirrors, the OpenCode plugin, the source/dist alignment checker, the dist tree, and the MJS plugin bridge close findings F-019-D4-02..03 and F-020-D5-01..04. Adds explicit phase-path grammar (documentation-only), a manifest-size health helper for phase parents, fixes the kebab/snake cache-signature mismatch, expands the alignment checker to cover all runtime-critical dist subtrees, deletes the orphan harness.js, and adds a smoke test plus decision-record header for the source-of-truth MJS bridge."
trigger_phrases:
  - "F-019-D4-02"
  - "F-019-D4-03"
  - "F-020-D5-01"
  - "F-020-D5-02"
  - "F-020-D5-03"
  - "F-020-D5-04"
  - "007 topology and build dist boundary summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/007-topology-build-boundary"
    last_updated_at: "2026-05-01T06:55:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "6 fixes applied; new tests + alignment + stress green (with pre-existing parallel-track delta)"
    next_safe_action: "Validate strict; commit + push to origin main"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts"
      - ".opencode/skill/system-spec-kit/scripts/spec/is-phase-parent.ts"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh"
      - ".opencode/plugins/spec-kit-skill-advisor.js"
      - ".opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/phase-parent-health.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts"
      - ".opencode/skill/system-spec-kit/scripts/tests/check-source-dist-alignment-orphans.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-007-topology-build-boundary"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-topology-build-boundary |
| **Completed** | 2026-04-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Six surgical fixes across the implement-workflow YAML, the dual phase-parent detection mirrors, the OpenCode skill-advisor plugin, the source/dist alignment checker, the dist tree, and the MJS plugin bridge close out the topology and build/dist boundary findings from packet 046's deep research. The fixes share a common direction: surface drift earlier (broader alignment scope, manifest-size health), align declared paths with actual runtime paths (kebab→snake cache signature), and document why source-of-truth files live where they do (MJS bridge header).

You can now run the alignment checker and trust that orphans in `dist/tests`, `dist/skill_advisor`, `dist/handlers`, etc. will fail loudly instead of slipping past. You can call `assessPhaseParentHealth(folder)` to get a `{ childCount, status, recommendation }` advisory for any phase parent, with thresholds at 20 (warning) and 40 (error). The OpenCode plugin's cache signature now reflects the real on-disk compat module rather than a non-existent kebab-case path.

### Findings closed

| Finding | File | Fix |
|---------|------|-----|
| F-019-D4-02 (P2) | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Added an additive `phase_path_grammar` documentation block under `phase_folder_awareness` listing flat / two-level / three-level / deep path shapes (e.g. observed `026/000/005/049/001` deep nest), the detection rule pointer to `isPhaseParent` in both TS mirrors, and the spec_id derivation rule. Existing keys remain unchanged; the runtime parser is untouched per user constraint. |
| F-019-D4-03 (P2) | `mcp_server/lib/spec/is-phase-parent.ts` + `scripts/spec/is-phase-parent.ts` + `scripts/rules/check-phase-parent-content.sh` | Added `assessPhaseParentHealth(folder)` returning `{ childCount, status: 'ok' | 'warning' | 'error' | 'not_phase_parent', recommendation }` with thresholds at 20 (warning) and 40 (error). Counts ALL direct NNN-named children (manifest size), not only those qualifying for `isPhaseParent`. The scripts mirror also gained a CLI entrypoint (`node is-phase-parent.js health <folder>`) so `check-phase-parent-content.sh` can shell-out and append a single advisory line when the helper reports a warning or error. The shell rule soft-fails when node or the dist artifact is unavailable. |
| F-020-D5-01 (P2) | `.opencode/plugins/spec-kit-skill-advisor.js` | Swapped the kebab-case `dist/skill-advisor/compat/index.js` path entry in `ADVISOR_SOURCE_PATHS` for the snake-case `dist/skill_advisor/compat/index.js` that actually exists on disk and matches the bridge's runtime `import('../dist/skill_advisor/compat/index.js')`. The plugin's cache signature now hashes a real file's mtime/size rather than always logging a `missing` placeholder for that entry. |
| F-020-D5-02 (P2) | `scripts/evals/check-source-dist-alignment.ts` | Broadened `DIST_TARGETS` from 2 entries (`mcp_server/dist/lib`, `scripts/dist`) to 17 entries covering every runtime-critical mcp_server dist subtree (`lib`, `skill_advisor`, `handlers`, `formatters`, `tools`, `code_graph`, `hooks`, `matrix_runners`, `schemas`, `stress_test`, `tests`, `core`, `api`, `utils`, `configs`, `scripts`) plus `scripts/dist`. Softened missing-dist-root from `process.exit(2)` to `continue` so optional subtrees don't fail the build. Fixed `mapDistFileToSource`'s package-segment derivation to derive from the dist-root prefix instead of a hardcoded `target.label === 'mcp_server'` match. Added a 3-entry time-bounded allowlist for the F-020-D5-03 siblings (corpus.js, measurement-fixtures.js, metrics.js) pending follow-on cleanup. |
| F-020-D5-03 (P2) | `mcp_server/dist/tests/search-quality/harness.{js,js.map,d.ts,d.ts.map}` | Verified via `git grep "dist/tests/search-quality/harness"` that no live code imports the orphan path (only research/finding docs reference it). Deleted the four files. The improved checker from F-020-D5-02 flags the same orphan if it returns. |
| F-020-D5-04 (P2) | `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` + `mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts` | Added a decision-record header to the bridge explaining its source-of-truth status (lives outside the TS build tree on purpose, three reasons documented inline), with a pointer to the new smoke test path. Added a 5-case smoke test asserting file existence, JSON envelope shape for valid prompts, and stable fail-open envelope shape for empty stdin / missing fields / malformed JSON. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Modified | F-019-D4-02: additive `phase_path_grammar` documentation block |
| `mcp_server/lib/spec/is-phase-parent.ts` | Modified | F-019-D4-03: `assessPhaseParentHealth` + threshold exports |
| `scripts/spec/is-phase-parent.ts` | Modified | F-019-D4-03: mirror health helper + CLI entrypoint |
| `scripts/rules/check-phase-parent-content.sh` | Modified | F-019-D4-03: append health advisory via dist CLI |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modified | F-020-D5-01: kebab→snake cache-signature path |
| `scripts/evals/check-source-dist-alignment.ts` | Modified | F-020-D5-02: broaden DIST_TARGETS, soften missing-root, fix segment derivation, add allowlist |
| `mcp_server/dist/tests/search-quality/harness.js` (+ map/d.ts/d.ts.map) | Deleted | F-020-D5-03: orphan after source moved to `stress_test/search-quality/harness.ts` |
| `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modified | F-020-D5-04: source-of-truth header + smoke test pointer |
| `mcp_server/tests/phase-parent-health.vitest.ts` | Created | F-019-D4-03: 9 cases covering thresholds + edge cases |
| `mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts` | Created | F-020-D5-04: 5 cases covering subprocess contract |
| `scripts/tests/check-source-dist-alignment-orphans.vitest.ts` | Created | F-020-D5-02: 6 cases covering broadened scope + allowlist + harness deletion |
| Spec docs (this packet) | Created/Modified | spec/plan/tasks/checklist/implementation-summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I read each cited finding from packet 046's research.md D4 and D5 sections and confirmed the line ranges in the live files before authoring spec.md. Each fix is the smallest doc-or-code change that resolves the specific drift the finding flagged. Every product code edit carries an inline `// F-NNN-DN-NN:` (TS/JS) or `# F-NNN-DN-NN:` (shell or YAML comment) marker so the next reader can trace the change back to its source finding.

For F-019-D4-02 I kept the YAML strictly additive — the runtime parser was already unbounded; the grammar block exists to document supported shapes for workflow authors. For F-019-D4-03 I mirrored the helper across both `is-phase-parent.ts` copies (the dual ownership was retained to keep this packet small; consolidation is a follow-on packet) and added a CLI entrypoint so the shell rule can stay as a thin wrapper. For F-020-D5-01 I swapped a single string literal — small but load-bearing, since cache invalidation depends on hashing a real file. For F-020-D5-02 I broadened the scan and added a 3-entry time-bounded allowlist for the known stragglers; the broader scan will catch any future orphans in those subtrees. For F-020-D5-03 I deleted the orphan after verifying no live imports. For F-020-D5-04 I went with the smaller-scope option (smoke test + decision-record header) over a TS migration per user constraint.

`tsc --build` for both `mcp_server/` and `scripts/` rebuilds the dist outputs that include the new `assessPhaseParentHealth` export. Targeted vitest runs confirm 20/20 new tests pass. The alignment checker exits 0 with 643 scanned / 640 aligned / 3 allowlisted / 0 violations. `npm run stress` matches the entering baseline of 58 files / 195 tests; one pre-existing code_graph test from a parallel track is flaky in this working tree (confirmed via stash diff — the failure pre-existed and is not introduced by this packet's edits).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep YAML topology grammar additive (documentation-only) | The runtime parser already supports unbounded depth; the constraint per user was "additive — define `phase_path_grammar` as documentation-only in the YAML, don't change the runtime parser." Authors get an explicit shape vocabulary without reshaping any code path. |
| Mirror `assessPhaseParentHealth` across both `is-phase-parent.ts` copies | Both copies are already kept in sync via mirrored edits (the contract is documented in the existing comments). Consolidating them into a single source-of-truth is a larger refactor; out of scope for this packet. |
| Time-bounded allowlist over deletion for D5-03 siblings | User constraint was explicit: "ONLY delete the orphaned `dist/tests/search-quality/harness.js`. Do NOT delete other dist files unless they're confirmed orphans by D5-02's improved checker." The 3 siblings are flagged by D5-02 but pending follow-on cleanup; the time-boxed allowlist keeps them visible without breaking the build. |
| Snake_case for D5-01 (matches actual runtime imports) | User constraint: "Fix to use snake_case (matches actual runtime imports)." The bridge already imports the snake-case path, so the kebab-case entry was always a no-op missing-file hash. The fix aligns the cache signature with reality. |
| Smoke test over TS migration for the MJS bridge | User constraint: "preferred path is to add a smoke test asserting `spec-kit-skill-advisor-bridge.mjs` exports the expected functions; documenting current MJS-as-source decision in a comment header. Migration to TS is too big for this packet." The bridge's named function exports are not module-exported (it's a script with an internal `main()`), so the smoke test asserts the subprocess contract instead. |
| Use inline finding-ID markers for traceability | Markers don't render in skill briefs, don't affect skill-advisor scoring, and survive future edits. 21 markers across 7 files give one-grep traceability. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Git diff scope | 6 product/config/plugin files + 1 dist deletion (4 files) + 3 new test files + this packet's spec docs |
| `validate.sh --strict` (this packet) | Pending — to run during commit finalization |
| `npm run stress` | 57 passed + 1 pre-existing code_graph failure from a parallel track. Confirmed via stash diff that the failure pre-exists this packet's edits — the only changes I made are listed in this summary, none touch `code-graph/`. Per user policy on parallel tracks: not a blocker. |
| Targeted vitest (3 new files) | 20/20 tests passed (9 phase-parent-health + 5 plugin-bridge-smoke + 6 alignment-orphans) |
| `npx tsx evals/check-source-dist-alignment.ts` | exit 0 / 643 dist files scanned / 640 aligned / 3 allowlisted (F-020-D5-03 siblings) / 0 violations |
| Inline finding markers present | 21 markers found across 7 files (verified via `grep -c "F-019-D4-02\|F-019-D4-03\|F-020-D5-01\|F-020-D5-02\|F-020-D5-03\|F-020-D5-04"`) |
| Orphan harness.js deletion | Verified absent on disk; sibling files (corpus, measurement-fixtures, metrics) flagged but allowlisted |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three dist orphans remain under allowlist.** `dist/tests/search-quality/{corpus,measurement-fixtures,metrics}.js` are siblings of the `harness.js` orphan deleted in this packet. They are flagged by the broadened alignment checker but allowlisted with a 2026-04-30 ownership stamp pending a follow-on dist-cleanup packet. They are reachable from the `tests/` subtree but no live import path uses them; deletion was deferred per the user constraint scoping D5-03 to harness.js only.
2. **Phase-parent health helper exists in two TS mirrors.** `mcp_server/lib/spec/is-phase-parent.ts` and `scripts/spec/is-phase-parent.ts` both export `assessPhaseParentHealth` with identical logic. This matches the existing dual ownership of `isPhaseParent` itself; consolidation to a single source-of-truth is a follow-on refactor.
3. **YAML topology grammar is documentation-only.** F-019-D4-02 adds vocabulary for workflow authors and consumers but does not change runtime parsing. Anyone authoring a NEW phase shape that the runtime detection rejects must update both `isPhaseParent` mirrors (and re-run `tsc --build`) — the grammar block does not enforce.
4. **MJS bridge stays as plain JS.** F-020-D5-04 documents and smoke-tests the bridge but does not migrate it to TypeScript. The header explains the three reasons (chicken-and-egg with cache-signature, plugin host imports plain JS only, debugging affordance). A future TS migration packet should pair with a build-step decision for this single file.
5. **One pre-existing stress failure persists.** The `code-graph-degraded-sweep.vitest.ts > routes broad-stale graphs to code_graph_scan` case fails in this working tree. Confirmed via stash diff that it fails on the unmodified-by-this-packet tree too — it belongs to a parallel `code_graph/` work track. Not a blocker per user policy on parallel work; will be addressed by whichever packet owns the code_graph track.
<!-- /ANCHOR:limitations -->
