---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 007 Topology And Build/Dist Boundary Remediation [template:level_2/spec.md]"
description: "Closes 6 P2 findings F-019-D4-02..03 and F-020-D5-01..04 from packet 046. Tightens phase-path topology grammar in the implement workflow YAML, adds a manifest-size health helper for phase parents, fixes the kebab/snake cache-signature mismatch in the OpenCode plugin, expands the source/dist alignment checker to cover all runtime-critical dist subtrees, deletes the orphan harness.js dist artifact left after its source moved, and adds a smoke test plus decision-record header for the source-of-truth MJS plugin bridge."
trigger_phrases:
  - "F-019-D4-02"
  - "F-019-D4-03"
  - "F-020-D5-01"
  - "F-020-D5-02"
  - "F-020-D5-03"
  - "F-020-D5-04"
  - "topology and build dist boundary remediation"
  - "phase path grammar"
  - "phase parent health"
  - "advisor source path snake case"
  - "source dist alignment checker"
  - "orphan harness dist"
  - "plugin bridge mjs smoke"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/007-topology-build-boundary"
    last_updated_at: "2026-05-01T06:55:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec re-authored after manual-fallback rollback"
    next_safe_action: "Validate strict; commit + push"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts"
      - ".opencode/skill/system-spec-kit/scripts/spec/is-phase-parent.ts"
      - ".opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh"
      - ".opencode/plugins/spec-kit-skill-advisor.js"
      - ".opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-007-topology-build-boundary"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: 007 Topology And Build/Dist Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 (6 findings) |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-architecture-cleanup |
| **Successor** | 008-search-quality-tuning |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six P2 findings from packet 046's deep research (D4 phase-topology, D5 build/dist boundary) leak topology drift, cache-signature drift, and stale dist artifacts the existing tooling cannot see:

- The implement workflow YAML's `phase_folder_awareness` block describes only a two-level path pattern `specs/{NNN-parent}/{NNN-phase}/`, even though the runtime parser walks arbitrary depth and packets like `026/000/005/049/001` already exist (F-019-D4-02).
- Large phase parents like `005-review-remediation` (50+ children) have no manifest-size health warning. Authors discover the readability cliff visually instead of via a programmatic check (F-019-D4-03).
- The OpenCode skill-advisor plugin's cache-signature watch list points at `dist/skill-advisor/compat/index.js` (kebab) but the runtime bridge imports `dist/skill_advisor/compat/index.js` (snake). The kebab path never exists on disk, so `advisorSourceSignature()` always hashes a "missing" record for that entry and cache invalidation never reacts to compat-module changes (F-020-D5-01).
- `check-source-dist-alignment.ts` only scans `dist/lib` and `scripts/dist`. Orphan `*.js` files in any other runtime-critical dist subtree (e.g. `dist/tests/search-quality/harness.js` after its source moved) are silently ignored (F-020-D5-02).
- A specific orphan `mcp_server/dist/tests/search-quality/harness.js` survived its source's relocation to `stress_test/search-quality/harness.ts`. No live code imports it, but the alignment checker's narrow scope masked the drift (F-020-D5-03).
- The MJS plugin bridge `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` is the source-of-truth bridge between the OpenCode plugin and the native compat surface, yet it lives outside the TypeScript build tree and carries no decision-record header explaining why or smoke test guarding the contract (F-020-D5-04).

### Purpose
Close all six findings with surgical edits that keep behavior backward-compatible, expand the alignment checker's coverage so future drift surfaces immediately, and add lightweight tests around the new health helper, the broadened alignment scope, and the MJS bridge contract. Stay on `main`. Keep YAML topology grammar additive — documentation-only, not a runtime parser change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Six surgical product-code/shell-rule edits, one per finding F-019-D4-02..03 and F-020-D5-01..04.
- New `assessPhaseParentHealth(folder)` helper exported from both `mcp_server/lib/spec/is-phase-parent.ts` and `scripts/spec/is-phase-parent.ts`.
- Wire the health helper into `check-phase-parent-content.sh` via a CLI subcommand.
- Broaden DIST_TARGETS in the alignment checker to cover 16 runtime subtrees, plus a time-bounded allowlist for known stragglers (F-020-D5-03 siblings).
- Delete the orphan `mcp_server/dist/tests/search-quality/harness.js` (and its `.js.map`/`.d.ts`/`.d.ts.map` companions).
- Add a smoke test for the MJS bridge subprocess contract.
- Add a decision-record header to the MJS bridge explaining its source-of-truth status.
- New vitest cases for the health helper, the broadened alignment scope, and the bridge smoke contract.
- Strict validation pass on this packet.
- One commit pushed to `origin main`.

### Out of Scope
- Migrating the MJS bridge to TypeScript (preferred path was the smaller-scope option per user constraint).
- Deleting other dist orphans surfaced by the broadened scan beyond `harness.js` (their source siblings remain — corpus, measurement-fixtures, metrics — pending a follow-on cleanup packet).
- Changing the runtime phase-path parser. F-019-D4-02 is documentation-only — `phase_path_grammar` is added under the existing `phase_folder_awareness` block as a structured note, not a parser rule.
- Refactoring `is-phase-parent.ts` ownership across the dual TS/scripts mirrors. The two copies stay in sync via mirrored edits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Modify | F-019-D4-02: add `phase_path_grammar` documentation block under `phase_folder_awareness` (additive, runtime parser unchanged). |
| `mcp_server/lib/spec/is-phase-parent.ts` | Modify | F-019-D4-03: export `assessPhaseParentHealth()` plus `PHASE_PARENT_WARNING_THRESHOLD` (20) and `PHASE_PARENT_ERROR_THRESHOLD` (40). |
| `scripts/spec/is-phase-parent.ts` | Modify | F-019-D4-03: mirror the health helper export plus a CLI entrypoint (`health <folder>`) so shell rules can shell-out. |
| `scripts/rules/check-phase-parent-content.sh` | Modify | F-019-D4-03: append manifest-size advisory using the dist `is-phase-parent.js` CLI. Soft-fails if node or the dist artifact is unavailable. |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | F-020-D5-01: change the kebab-case `dist/skill-advisor/compat/index.js` cache-signature path to the snake-case `dist/skill_advisor/compat/index.js` that actually exists on disk. |
| `scripts/evals/check-source-dist-alignment.ts` | Modify | F-020-D5-02: broaden `DIST_TARGETS` to 16 runtime subtrees, soften missing-dist-root from `process.exit(2)` to `continue`, fix `mapDistFileToSource` package-segment derivation, add a time-bounded 3-entry allowlist for known stragglers. |
| `mcp_server/dist/tests/search-quality/harness.js` (+ `.js.map`/`.d.ts`/`.d.ts.map`) | Delete | F-020-D5-03: orphan; source moved to `stress_test/search-quality/harness.ts`. Verified no live code imports the dist path. |
| `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modify | F-020-D5-04: add a decision-record header explaining why the bridge is JS not TS. Pointer to the new smoke test. |
| `mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts` | Create | F-020-D5-04: minimal subprocess smoke contract (file exists, JSON envelope shape, fail-open paths). |
| `mcp_server/tests/phase-parent-health.vitest.ts` | Create | F-019-D4-03: 9 cases covering ok/warning/error buckets, threshold edge cases, non-NNN children. |
| `scripts/tests/check-source-dist-alignment-orphans.vitest.ts` | Create | F-020-D5-02: 6 cases covering broadened scope, optional-root soft-fail, allowlist honoring, harness.js deletion. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-1 | F-019-D4-02: implement workflow YAML carries an additive `phase_path_grammar` block under `phase_folder_awareness`. | YAML lints clean; existing `note` and `path_pattern` keys unchanged; new block lists flat / two-level / three-level / deep shapes plus detection-rule pointer. |
| FR-2 | F-019-D4-03: `assessPhaseParentHealth(folder)` returns `{ childCount, status, recommendation }`. | Returns `'ok'`/`'warning'`/`'error'`/`'not_phase_parent'` per thresholds 20/40; vitest covers boundary and non-NNN cases. |
| FR-3 | F-019-D4-03: `check-phase-parent-content.sh` appends a `phase-parent health: ...` advisory line on warning/error. | Soft-fails when node or dist CLI unavailable; never escalates RULE_STATUS. |
| FR-4 | F-020-D5-01: `ADVISOR_SOURCE_PATHS` contains the snake-case dist path. | The path matches `'../skill/system-spec-kit/mcp_server/dist/skill_advisor/compat/index.js'`. |
| FR-5 | F-020-D5-02: `DIST_TARGETS` covers the 17 runtime subtrees and missing roots `continue` instead of exiting. | `npx tsx evals/check-source-dist-alignment.ts` exits 0; missing optional dist roots do not fail. |
| FR-6 | F-020-D5-03: `mcp_server/dist/tests/search-quality/harness.{js,js.map,d.ts,d.ts.map}` are removed. | Files absent on disk; the broadened checker would re-flag them if returned. |
| FR-7 | F-020-D5-04: MJS bridge carries source-of-truth header; smoke test asserts envelope contract. | Header documents 3 reasons; smoke test asserts file existence, valid JSON envelope, and fail-open paths. |

### Non-Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NFR-1 | New tests pass when run targeted (vitest). | 20+ tests across 3 new files all green. |
| NFR-2 | `validate.sh --strict` exits 0 on this packet. | Errors=0; warnings allowed. |
| NFR-3 | The dist `mcp_server/dist/lib/spec/is-phase-parent.js` and `scripts/dist/spec/is-phase-parent.js` SHALL include the new `assessPhaseParentHealth` export after `tsc --build`. | `head -50` of dist files shows the export line. |
| NFR-4 | Each edit carries an inline finding-ID marker. | `// F-NNN-DN-NN:` (TS/JS), `# F-NNN-DN-NN:` (shell or YAML comment), `<!-- F-NNN-DN-NN -->` (md). 21 markers across 7 files. |

### Acceptance Scenarios

- **Scenario 1**: Author calls `assessPhaseParentHealth('specs/100-parent')` with 1 child → returns `{ status: 'ok', childCount: 1 }`.
- **Scenario 2**: Author calls the helper on a folder with exactly 20 children → returns `{ status: 'warning', childCount: 20 }`.
- **Scenario 3**: Author calls the helper on a folder with 50 children → returns `{ status: 'error', childCount: 50 }` and the recommendation references the error threshold.
- **Scenario 4**: Alignment checker runs against the repo → exits 0 with 3 allowlisted entries (D5-03 siblings) and 0 violations.
- **Scenario 5**: Bridge subprocess receives empty stdin → emits `{ status: 'fail_open', brief: null, error: ... }` envelope.
- **Scenario 6**: Plugin loads cache signature → hashes the snake-case `dist/skill_advisor/compat/index.js` mtime/size, not a missing-file placeholder.

### Constraints
- Stay on `main`; no feature branch.
- No new external dependencies.
- F-019-D4-02 stays additive (documentation-only) per user constraint.
- F-020-D5-03 deletes ONLY `harness.js` + companions per user constraint. Other orphans surfaced by the broadened scan get a time-bounded allowlist entry, not deletion.
- F-020-D5-04 prefers the smaller-scope smoke test option over a TS migration per user constraint.
- F-020-D5-01 fixes to snake_case (matches actual runtime imports).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [x] All 6 doc/code edits applied with finding-ID citations
- [x] All new vitest cases pass (20+ tests across 3 new files)
- [x] Orphan `harness.js` removed from disk
- [x] Alignment checker scans broadened scope and honors allowlist
- [ ] `validate.sh --strict` exit 0 for this packet (Pending — to run during finalization)
- [x] `npm run stress` matches the entering baseline of 58 files / 195 tests (1 unrelated code_graph test from a parallel track is the only delta — pre-existed in the working tree)
- [ ] One commit pushed to `origin main` (final step)
- [x] implementation-summary.md updated with Findings closed table (6 rows)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Cache-signature path swap surfaces stale advisor caches in long-running OpenCode sessions | The path swap only changes which file gets stat'd into the signature; the signature itself rotates on the next prompt and the cache TTL (5 min default) bounds staleness. |
| Broadened alignment scan adds noise on CI for previously-skipped subtrees | Optional dist roots silently skip when missing. Three known stragglers carry time-bounded allowlist entries. New violations surface as failures, which is the intended behavior. |
| Deleting `harness.js` breaks an unseen consumer | Verified via `git grep "dist/tests/search-quality/harness"` — only research/finding docs reference the path, no live imports. |
| Phase-parent health helper triggers warnings on existing large parents | Warnings are advisory; `check-phase-parent-content.sh` returns `warn` not `error` and authors can pace cleanup. |
| Bridge smoke test starts a real `node` subprocess and hits the advisor compat path | Test uses fail-open paths (empty stdin, missing fields, malformed JSON) where the advisor is not invoked. The single valid-payload case uses the prompt the existing bridge test already exercises. |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` D4 (phase topology) + D5 (build/dist boundary)
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| `assessPhaseParentHealth` on non-existent folder | Folder path doesn't exist | Returns `{ childCount: 0, status: 'not_phase_parent', recommendation: '...skipped' }` (no throw) |
| `assessPhaseParentHealth` with exactly 20 children | Boundary | Returns `warning` (>=, not >) |
| `assessPhaseParentHealth` with exactly 40 children | Boundary | Returns `error` (>=, not >) |
| Phase parent with non-NNN siblings (`scratch/`, `z_archive/`) | Mixed children | Counts only NNN-matching directories; non-NNN are ignored |
| Alignment checker against an optional dist subtree that doesn't exist | e.g. `mcp_server/dist/api` not built | Silently `continue`; no `process.exit(2)`; no false-positive failure |
| Bridge subprocess receives valid prompt without advisor available | Advisor disabled or unavailable | Returns `fail_open` envelope with stable shape |
| Cache-signature path stat fails on real on-disk file | Permissions issue | Hashes `<path>missing` per existing `try/catch`; behavior preserved |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-019-D4-02 | spec_kit_implement_auto.yaml | 10 |
| F-019-D4-03 | is-phase-parent.ts (×2) + check-phase-parent-content.sh | 35 |
| F-020-D5-01 | spec-kit-skill-advisor.js | 5 |
| F-020-D5-02 | check-source-dist-alignment.ts | 30 |
| F-020-D5-03 | dist orphan deletion + verification | 5 |
| F-020-D5-04 | bridge header + smoke test | 25 |
| Tests + spec docs | 3 new test files + 5 spec docs | 60 |
| **Total** | | **~170 minutes (~3h)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Migration of `is-phase-parent.ts` to a single source-of-truth (versus the current dual mcp_server + scripts mirror) is a follow-on packet — out of scope here.
<!-- /ANCHOR:questions -->
