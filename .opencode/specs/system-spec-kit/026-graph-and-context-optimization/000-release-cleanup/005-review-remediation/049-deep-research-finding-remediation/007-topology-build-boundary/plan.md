---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 007 Topology And Build/Dist Boundary Remediation [template:level_2/plan.md]"
description: "Apply 6 surgical edits and add 3 new test files for findings F-019-D4-02..03 and F-020-D5-01..04."
trigger_phrases:
  - "F-019-D4 plan"
  - "F-020-D5 plan"
  - "007 topology and build dist boundary plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/007-topology-build-boundary"
    last_updated_at: "2026-05-01T06:55:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec"
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
# Implementation Plan: 007 Topology And Build/Dist Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Six surgical edits across the implement-workflow YAML, the dual phase-parent detection mirrors, the OpenCode plugin, the source/dist alignment checker, the dist tree, and the MJS plugin bridge close findings F-019-D4-02..03 and F-020-D5-01..04. Each fix is the smallest change that resolves the specific drift the finding flagged.

### Technical Context

The product code lives across two TypeScript trees (`mcp_server/`, `scripts/`), one OpenCode plugin (`.opencode/plugins/`), one shell rule, one YAML workflow asset, and one MJS bridge. The dist artifacts live under `mcp_server/dist/` and `scripts/dist/`. All edits stay within existing files except for three new vitest files and the YAML grammar block, which is additive documentation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict (this packet) | exit 0 (errors=0) |
| New vitest tests | all pass |
| Targeted alignment check (`check-source-dist-alignment.ts`) | exit 0 with allowlisted orphans only |
| `npm run stress` | matches entering baseline 58/195 |
| Inline finding markers | one `// F-NNN-DN-NN:` (TS/JS), `# F-NNN-DN-NN:` (shell), `<!-- F-NNN-DN-NN -->` (md), or `# F-NNN-DN-NN:` (YAML comment) marker per finding |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The fixes preserve module boundaries and the source/dist contract:

- **Implement workflow YAML** — `phase_path_grammar` is added under `phase_folder_awareness` as a structured YAML block. Existing `note` and `path_pattern` keys remain unchanged. The runtime parser is untouched.
- **Phase-parent detection** — both mirrors (`mcp_server/lib/spec/is-phase-parent.ts` and `scripts/spec/is-phase-parent.ts`) get the new `assessPhaseParentHealth` export. The scripts mirror also gets a CLI entrypoint so shell rules shell-out to `node scripts/dist/spec/is-phase-parent.js health <folder>`.
- **`check-phase-parent-content.sh`** — appends a single advisory line when the helper reports `warning` or `error`. Soft-fails when node or the dist artifact is unavailable (no escalation).
- **OpenCode plugin** — `ADVISOR_SOURCE_PATHS` swaps the kebab-case path entry for the snake-case path that matches the bridge's actual `import('../dist/skill_advisor/compat/index.js')`.
- **Alignment checker** — `DIST_TARGETS` expands from 2 entries to 17 (16 mcp_server subtrees + scripts). `mapDistFileToSource` derives the package segment from the dist root prefix instead of a hardcoded label match. Missing dist roots `continue` instead of exiting non-zero. A 3-entry time-bounded allowlist accepts the known stragglers from F-020-D5-03's siblings.
- **Dist orphan deletion** — `mcp_server/dist/tests/search-quality/harness.js` plus its three companion files are deleted via `rm`. Verified via `git grep` that no live code imports the dist path.
- **MJS bridge** — receives a header decision-record explaining its source-of-truth status. The new smoke test asserts the subprocess contract via `spawnSync` over fail-open and valid-payload paths.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | Add additive `phase_path_grammar` documentation block | spec_kit_implement_auto.yaml | F-019-D4-02 | Done |
| 2 | Edit | Export `assessPhaseParentHealth` + thresholds | mcp_server/lib/spec/is-phase-parent.ts | F-019-D4-03 | Done |
| 3 | Edit | Mirror health helper + CLI entrypoint | scripts/spec/is-phase-parent.ts | F-019-D4-03 | Done |
| 4 | Edit | Append health advisory line via dist CLI | scripts/rules/check-phase-parent-content.sh | F-019-D4-03 | Done |
| 5 | Edit | Swap kebab→snake cache-signature path | .opencode/plugins/spec-kit-skill-advisor.js | F-020-D5-01 | Done |
| 6 | Edit | Broaden DIST_TARGETS, soften missing-root, fix segment derivation, add allowlist | scripts/evals/check-source-dist-alignment.ts | F-020-D5-02 | Done |
| 7 | Delete | Remove orphan harness.js + companions | mcp_server/dist/tests/search-quality/harness.* | F-020-D5-03 | Done |
| 8 | Edit | Add source-of-truth header + smoke test pointer | mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs | F-020-D5-04 | Done |
| 9 | Test | Add phase-parent-health vitest (9 cases) | mcp_server/tests/phase-parent-health.vitest.ts | F-019-D4-03 | Done |
| 10 | Test | Add bridge smoke vitest (5 cases) | mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts | F-020-D5-04 | Done |
| 11 | Test | Add alignment-orphan vitest (6 cases) | scripts/tests/check-source-dist-alignment-orphans.vitest.ts | F-020-D5-02 | Done |
| 12 | Build | `tsc --build` for both TS trees so dist exposes new exports | mcp_server/dist/ + scripts/dist/ | F-019-D4-03 | Done |
| 13 | Verify | Run alignment check; expect 3 allowlisted, 0 violations | scripts/evals/ | F-020-D5-02/03 | Done |
| 14 | Verify | Run targeted vitest for the 3 new files | mcp_server + scripts | All | Done |
| 15 | Validate | `validate.sh --strict` on this packet | this packet | — | Pending |
| 16 | Stress | `npm run stress` (matches entering baseline) | mcp_server/ | — | Done |
| 17 | Refresh | `generate-context.js` for this packet | spec docs | — | Pending |
| 18 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (vitest) | `assessPhaseParentHealth` thresholds and edge cases (9 cases) | vitest |
| Smoke (vitest) | MJS bridge subprocess contract: file existence, JSON envelope shape, fail-open paths (5 cases) | vitest + node spawnSync |
| Integration (vitest) | Alignment checker scope coverage and allowlist behavior (6 cases) | vitest, fs-based assertions |
| Stress (full) | Full `npm run stress` matches entering baseline | vitest stress config |

For TS edits: vitest cases live next to existing test patterns (`mcp_server/tests/`, `mcp_server/skill_advisor/tests/compat/`, `scripts/tests/`). Path resolution mirrors `alignment-drift-fixture-preservation.vitest.ts` (`__dirname`-relative).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` D4 (phase topology, §F-019) + D5 (build/dist boundary, §F-020)
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Alignment checker: `.opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts` (modified by this packet)
- Stress runner: `cd mcp_server && npm run stress`
- No cross-packet dependencies; sub-phase 007 is independent within Wave 1.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If any change breaks a downstream consumer:
1. `git revert <commit-sha>` reverts all 6 fixes plus the dist deletion atomically (the deletion is reflected as a tracked-file removal in the commit).
2. Re-run validate + stress to confirm prior baseline restored.
3. Identify the failing finding from inline `// F-NNN-DN-NN:` markers (each fix carries its ID).
4. Reauthor the failing edit with smaller scope; re-validate.

Each edit carries a finding marker so a partial-revert (single hunk) is straightforward. The orphan deletion is the only non-marker-carryable change; reverting the commit restores it via git history.
<!-- /ANCHOR:rollback -->
