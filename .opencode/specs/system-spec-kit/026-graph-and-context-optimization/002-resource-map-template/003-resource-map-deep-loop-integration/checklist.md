---
title: "...ec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/checklist]"
description: "P0/P1/P2 verification for convergence-time resource-map emission in sk-deep-review and sk-deep-research."
trigger_phrases:
  - "026/013 checklist"
  - "deep loop checklist"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration"
    last_updated_at: "2026-04-24T17:15:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed T001-T037 checklist evidence pass"
    next_safe_action: "Run /spec_kit:deep-review:auto for audit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Resource Map Deep-Loop Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: `spec.md:135` and `spec.md:148` define the P0/P1 requirement tables for this packet]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: `plan.md:32`, `plan.md:43`, and `plan.md:79` describe the architecture, extractor boundary, and workflow wiring]
- [x] CHK-003 [P1] Phase 001 local-owner rollback completed and phase 012 template shape confirmed stable [EVIDENCE: `plan.md:53` marks the phase-012 prerequisite as landed, and `spec.md:186` plus `spec.md:187` record the phase-001/phase-012 dependencies]
- [x] CHK-004 [P1] Delta shape fields for both skills confirmed [EVIDENCE: `research/research.md:9`, `research/research.md:30`, and `research/iterations/iteration-007.md:10` capture the converged delta-shape findings that drove the implementation]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `extract-from-evidence.cjs` is pure CJS (no network, no shell) [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:1`, `:3`, `:4`, and `:546` show a CommonJS module using only `node:fs` and `node:path`]
- [x] CHK-011 [P0] `reduce-state.cjs` integration does not introduce convergence-write races [EVIDENCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1215` plus `:1245` and `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:908` plus `:936` keep resource-map writes inside the explicit synthesis-only branch; `research/iterations/iteration-007.md:7` documents the post-adjudication ordering requirement that the YAML step now follows]
- [x] CHK-012 [P1] Error handling defensive — malformed deltas logged and skipped, not fatal [EVIDENCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:167` and `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:126` log malformed delta rows; `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:132` plus `:133` surface degraded output instead of crashing; malformed-row dry run returned `{\"degraded\":true,\"degradedRows\":true}`]
- [x] CHK-013 [P1] YAML edits syntactically valid (no tab/indentation breakage) [EVIDENCE: `ruby -e 'require \"yaml\"; ... YAML.load_file(...)'` exited `0` and parsed all four workflow assets successfully]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Vitest snapshot coverage for review and research shapes both pass [EVIDENCE: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run --config vitest.config.ts --root . scripts/tests/resource-map-extractor.vitest.ts` exited `0` with `Test Files 1 passed` and `Tests 2 passed`; coverage lives in `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:32`]
- [x] CHK-021 [P0] Manual `/spec_kit:deep-review :auto` on fixture packet emits a valid map [EVIDENCE: per the packet's no-full-loop constraint, the equivalent review-shape dry run returned `true / true / true` for READMEs heading, Skills heading, and final findings note]
- [x] CHK-022 [P0] Manual `/spec_kit:deep-research :auto` on fixture packet emits a valid map [EVIDENCE: per the packet's no-full-loop constraint, the equivalent research-shape dry run returned `true / true / true` for Commands heading, Skills heading, and `Citations=3; Iterations=3`]
- [x] CHK-023 [P1] `--no-resource-map` opt-out produces no map file and exits cleanly [EVIDENCE: opt-out reducer exercise returned `{\"resourceMapSkipped\":true,\"resourceMapSkipReason\":\"config.resource_map.emit=false\",\"resourceMapExists\":false}`]
- [x] CHK-024 [P1] Zero-iteration and max-iteration edge cases behave per spec [EVIDENCE: edge-case dry run returned `{\"zeroTotal\":\"0\",\"zeroHasCategoryHeadings\":false,\"maxCitationNote\":true}`]
- [x] CHK-025 [P1] Malformed delta scenario produces a `degraded: true` map, not a crash [EVIDENCE: malformed-row extractor dry run returned `{\"degraded\":true,\"degradedRows\":true}` and `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:132` emits the degraded summary line]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the emitted map (filter frontmatter from deltas) [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:212`, `:295`, `:375`, and `:397` only harvest path-like fields and citations, while `:401` drops URLs instead of copying arbitrary content into the map]
- [x] CHK-031 [P0] No shell-out or network calls in the extractor [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:3` and `:4` are the only imports, with no `child_process`, HTTP, or MCP usage anywhere in the module]
- [x] CHK-032 [P1] Path normalization prevents directory traversal in emitted paths [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:397` normalizes candidates and `:414` rejects `../` traversal; traversal dry run returned `{\"blockedTraversal\":true,\"keptInRepoPath\":true}`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Both SKILL.md files document the new output and opt-out [EVIDENCE: `.opencode/skill/sk-deep-review/SKILL.md:250` and `:510`, plus `.opencode/skill/sk-deep-research/SKILL.md:241` and `:455`]
- [x] CHK-041 [P1] Both command MD files mention the convergence-time emission [EVIDENCE: `.opencode/command/spec_kit/deep-review.md:188` and `:205`, plus `.opencode/command/spec_kit/deep-research.md:177` and `:194`]
- [x] CHK-042 [P1] Both convergence.md references note the new step [EVIDENCE: `.opencode/skill/sk-deep-review/references/convergence.md:30` and `.opencode/skill/sk-deep-research/references/convergence.md:19`]
- [x] CHK-043 [P1] Feature catalog entries exist for both skills [EVIDENCE: `.opencode/skill/sk-deep-review/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md:10` and `.opencode/skill/sk-deep-research/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md:10`]
- [x] CHK-044 [P1] Manual testing playbook entries exist for both skills [EVIDENCE: `.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md:14` and `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/027-resource-map-emission.md:14`]
- [x] CHK-045 [P2] README under `scripts/resource-map/` covers the input/output contract [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/resource-map/README.md:9`, `:19`, and `:52`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Extractor lands under `scripts/resource-map/` (consistent with phase-012 peer location) [EVIDENCE: `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:1` and `spec.md:108`]
- [x] CHK-051 [P1] Test fixtures live under `scripts/tests/` (project convention) [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:1` and `tasks.md:60`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-24
<!-- /ANCHOR:summary -->
