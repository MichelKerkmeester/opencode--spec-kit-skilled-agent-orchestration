---
title: "Checklist: Phase 1 — Foundation (Templates & Truncation)"
description: "Verification checklist for PR-1 and PR-2 completion, covering fixture success, phase validation, parent packet handoff, and light documentation hygiene."
---
# Checklist: Phase 1 — Foundation (Templates & Truncation)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Meaning | Closeout Rule |
|----------|---------|---------------|
| **P0** | Blocking | Must pass before Phase 1 can be marked complete |
| **P1** | Should-pass | Expected unless explicitly deferred with evidence |
| **P2** | Nice-to-have | Helpful hygiene and release-readiness checks |
<!-- /ANCHOR:protocol -->

---

## P0 — Blocking

<!-- ANCHOR:pre-impl -->
### Pre-Implementation and Contract Checks

| ID | Check | Concrete Verification |
|----|-------|-----------------------|
| CHK-P0-00 | The four phase docs are present and describe PR-1 plus PR-2 consistently before implementation begins. | `rg -n "PR-1|PR-2|F-AC1|F-AC7" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/spec.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/plan.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/tasks.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/checklist.md` |
| CHK-P0-01 | F-AC1 is green and OVERVIEW no longer ends mid-token. [SOURCE: research.md §D.3] | `npm --prefix .opencode/skill/system-spec-kit/scripts exec vitest run tests/truncate-on-word-boundary.vitest.ts tests/memory-quality-phase1.vitest.ts --config ../mcp_server/vitest.config.ts --root .` |
| CHK-P0-02 | F-AC7 is green and the rendered markdown uses `overview` for TOC, HTML id, and comment marker. [SOURCE: research.md §D.3] | `npm --prefix .opencode/skill/system-spec-kit/scripts exec vitest run tests/memory-quality-phase1.vitest.ts --config ../mcp_server/vitest.config.ts --root .` |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
### Code and Fixture Checks

| ID | Check | Concrete Verification |
|----|-------|-----------------------|
| CHK-P0-03 | JSON-mode `generate-context.js` replays succeed for both phase fixtures. [SOURCE: research.md §11] | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues` and `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues` both exit `0`. |
| CHK-P0-04 | Phase 1 docs validate cleanly. | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation` exits `0`. |
| CHK-P0-05 | Parent phase map status is updated from `Pending` to `Complete` after all checks pass. | `rg -n "001-foundation-templates-truncation/|Complete|F-AC1|F-AC7" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md` returns the completed row and existing handoff line. |
<!-- /ANCHOR:code-quality -->

---

## P1 — Should-Pass

<!-- ANCHOR:testing -->
### Replay and Regression Confidence

| ID | Check | Concrete Verification |
|----|-------|-----------------------|
| CHK-P1-01 | Only the intended Phase 1 source seams changed: template anchor block, helper file, OVERVIEW owner, and observation-summary callsites. [SOURCE: research.md §B.4] | `rg -n "truncateOnWordBoundary|ANCHOR:overview|substring\\(0, 500\\)" .opencode/skill/system-spec-kit/templates/context_template.md .opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` |
| CHK-P1-02 | No sibling child-phase docs were accidentally edited during Phase 1 work. | `find .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues -maxdepth 2 \\( -path '*/002-single-owner-metadata/*' -o -path '*/003-sanitization-precedence/*' -o -path '*/004-heuristics-refactor-guardrails/*' -o -path '*/005-operations-tail-prs/*' \\) -type f | sort` and compare against the pre-change file list for no unexpected modifications. |
| CHK-P1-03 | Post-save reviewer output for the two fixture replays contains no new high-severity drift findings on the repaired D1/D8 surfaces. [SOURCE: research.md §11] | Capture stderr/stdout from the two `generate-context.js` commands above and confirm no HIGH reviewer findings mention truncation or anchor drift. |
| CHK-P1-04 | The pinned ellipsis choice is enforced consistently in helper tests and rendered fixture assertions. [SOURCE: research.md §D.3] | `rg -n "\\.\\.\\.|…" .opencode/skill/system-spec-kit/scripts/tests/truncate-on-word-boundary.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts` shows exactly one canonical suffix style in assertions. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
### Security / Data Hygiene

- [ ] CHK-SEC-01 [P1] Fixture JSON contains no real secrets, tokens, or personal data.
  Verification: `rg -n "api[_-]?key|token|secret|password" .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json`
- [ ] CHK-SEC-02 [P1] CLI verification commands write only to the intended spec folder.
  Verification: inspect the explicit folder argument in the two `generate-context.js` replay commands above.
<!-- /ANCHOR:security -->

---

## P2 — Nice-to-Have

<!-- ANCHOR:docs -->
### Documentation Hygiene

| ID | Check | Concrete Verification |
|----|-------|-----------------------|
| CHK-P2-01 | Phase docs remain internally aligned on PR names, owner files, and fixture names. | `rg -n "PR-1|PR-2|F-AC1|F-AC7|truncate-on-word-boundary|context_template.md:172-183|collect-session-data.ts:875-881" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/spec.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/plan.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/tasks.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/checklist.md` |
| CHK-P2-02 | The phase closeout has a release-note draft line ready for later packet summary work. | `rg -n "Phase 1: foundation templates and truncation" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/*.md` |
| CHK-P2-03 | The child docs no longer contain scaffold placeholders or duplicate frontmatter artifacts. | `rg -n "YOUR_VALUE_HERE|\\[NAME\\]|phase child header|template:level_1|template:addendum" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/spec.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/plan.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/tasks.md .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/checklist.md` returns no matches. |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
### File Organization

- [ ] CHK-FILE-01 [P1] New fixtures live under the script test fixture tree rather than in `scratch/` or `memory/`.
  Verification: `find .opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality -maxdepth 1 -type f | sort`
- [ ] CHK-FILE-02 [P2] The phase folder still contains only the expected spec-doc files plus untouched scaffold support files.
  Verification: `find .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation -maxdepth 1 -type f | sort`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Must Pass |
|----------|-------|-----------|
| P0 | 6 | 6 |
| P1 | 6 | 6 or explicit documented deferral |
| P2 | 5 | Optional but recommended |

**Closeout Rule**: Phase 1 is complete when all P0 items pass, P1 items are either green or explicitly deferred with evidence, and the parent phase map reflects the completed status.
<!-- /ANCHOR:summary -->
