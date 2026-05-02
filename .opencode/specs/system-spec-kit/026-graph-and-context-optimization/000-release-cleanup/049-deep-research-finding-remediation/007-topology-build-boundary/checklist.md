---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
title: "Quality Checklist: 007 Topology And Build/Dist Boundary Remediation [template:level_2/checklist.md]"
description: "QA gates for F-019-D4-02..03 and F-020-D5-01..04 remediation. Includes test fixture, dist alignment, and stress regression gates."
trigger_phrases:
  - "F-019-D4 checklist"
  - "F-020-D5 checklist"
  - "007 topology and build dist boundary checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/007-topology-build-boundary"
    last_updated_at: "2026-05-01T06:55:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored"
    next_safe_action: "Validate + commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-007-topology-build-boundary"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 007 Topology And Build/Dist Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This packet ships product-code, shell-rule, plugin, YAML, and dist deletions plus 3 vitest files. Verification is structural (`validate.sh`), targeted vitest, full stress, and explicit dist alignment.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P2] Read packet 046 D4 (phase topology) and D5 (build/dist boundary) findings F-019-D4-02..03, F-020-D5-01..04 [EVIDENCE: research.md sections cited in spec.md §6 Dependencies]
- [x] CHK-002 [P2] Confirmed each cited file:line still matches the research.md claim [EVIDENCE: All 6 target files read at the cited line ranges before authoring spec]
- [x] CHK-003 [P2] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md [EVIDENCE: All five docs present in this packet]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P2] Each edit is the smallest change that resolves the finding [EVIDENCE: each edit isolated to the cited line range; F-019-D4-02 stays additive (documentation-only) per user constraint]
- [x] CHK-005 [P2] No template-source bumps (template_source headers unchanged) [EVIDENCE: git diff shows no template_source lines changed in any product file]
- [x] CHK-006 [P2] Each edit carries an inline `// F-NNN-DN-NN:` (TS/JS), `# F-NNN-DN-NN:` (shell or YAML comment), or `<!-- F-NNN-DN-NN -->` (md) marker for traceability (verified via grep, 21 markers across 7 files)
- [x] CHK-007 [P2] No prose outside the cited line ranges was modified [EVIDENCE: git diff scope verified to target files + new tests + spec docs + dist deletion only]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P2] 3 new vitest files added: `mcp_server/tests/phase-parent-health.vitest.ts`, `mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts`, `scripts/tests/check-source-dist-alignment-orphans.vitest.ts` (verified)
- [x] CHK-009 [P2] Targeted vitest run passes for all new tests [EVIDENCE: 9/9 phase-parent-health + 5/5 plugin-bridge-smoke + 6/6 alignment-orphans = 20/20 across 3 new files]
- [x] CHK-010 [P2] Source/dist alignment check exit 0 [EVIDENCE: `npx tsx evals/check-source-dist-alignment.ts` → 643 scanned, 640 aligned, 3 allowlisted (F-020-D5-03 siblings), 0 violations]
- [x] CHK-011 [P2] Existing 60+ test fixtures still validate (no regression) [EVIDENCE: alignment broadened scope finds zero NEW violations]
- [ ] CHK-012 [P2] `validate.sh --strict` on this packet [Pending — to run during finalization]
- [x] CHK-013 [P2] `npm run stress` matches entering baseline of 58/195 [EVIDENCE: 57 passed + 1 pre-existing code_graph failure from parallel track that pre-existed in the working tree before this packet's edits, confirmed via stash test]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P2] No secrets, tokens, or credentials in any edit (verified)
- [x] CHK-015 [P2] Plugin cache-signature path swap targets the actual on-disk runtime path (snake_case) — does not alter what the plugin executes, only what it stat's for cache-signature freshness [EVIDENCE: bridge already imports snake-case; plugin signature now matches]
- [x] CHK-016 [P2] Bridge smoke test uses fail-open paths (empty stdin, missing fields, malformed JSON) — does NOT exercise advisor's recommendation path with real prompts on every run [EVIDENCE: only one smoke case sends a valid prompt; advisor path is exercised by the existing `plugin-bridge.vitest.ts`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-017 [P2] All 6 findings have a row in the Findings closed table (verified)
- [x] CHK-018 [P2] Implementation-summary.md describes the actual fix per finding (not generic) (verified)
- [x] CHK-019 [P2] Plan.md numbered phases match the actual steps run (verified)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P2] Only target product files touched outside this packet [EVIDENCE: git diff scope: 6 product files + 1 dist deletion + 3 new tests + this packet's spec docs]
- [x] CHK-021 [P2] Spec docs live at this packet's root, not in `scratch/` (verified)
- [x] CHK-022 [P2] New tests live under existing test trees (`mcp_server/tests/`, `mcp_server/skill_advisor/tests/compat/`, `scripts/tests/`), not the packet folder (verified)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-019-D4-02 (P2) | `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | `# F-019-D4-02:` marker plus `phase_path_grammar` block under `phase_folder_awareness`. Documentation-only; runtime parser unchanged. |
| F-019-D4-03 (P2) | `mcp_server/lib/spec/is-phase-parent.ts` + `scripts/spec/is-phase-parent.ts` + `scripts/rules/check-phase-parent-content.sh` | `// F-019-D4-03:` markers in both TS mirrors plus `# F-019-D4-03:` in the shell rule. 9 new vitest cases pass. Health helper soft-fails when node/dist unavailable. |
| F-020-D5-01 (P2) | `.opencode/plugins/spec-kit-skill-advisor.js` | `// F-020-D5-01:` marker on `ADVISOR_SOURCE_PATHS` and the snake-case path now matches the bridge's runtime import target. |
| F-020-D5-02 (P2) | `scripts/evals/check-source-dist-alignment.ts` | 9 `F-020-D5-02:` markers covering broadened DIST_TARGETS (17 entries), allowlist (3 entries), missing-root soften, and segment derivation fix. Checker exits 0 with 3 allowlisted, 0 violations. |
| F-020-D5-03 (P2) | `mcp_server/dist/tests/search-quality/harness.{js,js.map,d.ts,d.ts.map}` | Files deleted from disk. Verified via `git grep "dist/tests/search-quality/harness"` that no live code imports them. Improved checker (D5-02) flags the same orphan if it returns. |
| F-020-D5-04 (P2) | `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` + `mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts` | `F-020-D5-04:` marker in the bridge header explains source-of-truth status; 5 new smoke cases pass. |

### Status

- [x] All 6 findings closed [EVIDENCE: 21 inline finding markers verified via grep across 7 files]
- [ ] validate.sh --strict on this packet [Pending — to run during finalization]
- [x] npm run stress matches entering baseline [EVIDENCE: 58 files / 195 tests baseline; 1 pre-existing code_graph failure from parallel track]
- [x] Source/dist alignment check exit 0 [EVIDENCE: 643 scanned / 640 aligned / 3 allowlisted / 0 violations]
- [ ] commit + push to origin main (final step)
<!-- /ANCHOR:summary -->
