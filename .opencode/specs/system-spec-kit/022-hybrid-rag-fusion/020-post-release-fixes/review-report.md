# Consolidated Release-Control Review Report — 020 Pre-Release Remediation

## Executive Summary

| Field | Value |
|-------|-------|
| Review Type | Consolidated live release-control review artifact |
| Source-of-Truth Date | 2026-03-26 |
| Backbone Review | Historical v8 review from predecessor `012-pre-release-fixes-alignment-preparation` |
| Historical Packet Lineage | `012-pre-release-fixes-alignment-preparation`, `013-v7-remediation`, `014-v8-p1-p2-remediation` |
| Verdict | **FAIL** |
| hasAdvisories | true |
| Active P0 | 0 |
| Release Gate Status | `npm test`: PASS, `012 --no-recursive`: PASS, `013 --no-recursive`: PASS, `022 --no-recursive`: PASS, `022 --recursive`: FAIL |
| Recursive Validator | `10 errors`, `7 warnings` across `001`, `003`, `005`, `006`, `007`, `010`, `013`, `015`, `016`, `018` |
| Runtime Remediation Status | Runtime P0 and code-side P1 fixes remain landed and green |

This report is the live release-control review artifact for `020-post-release-fixes`, not a fresh rerun review. It keeps the written v8 FAIL review from the historical predecessor `012` packet as the backbone, folds in the current-state runtime truth recorded in historical `013`, and folds in the blocker-first follow-on scope recorded in historical `014`.

The merged release truth is unchanged from the latest top-level evidence dated **2026-03-26**: runtime remediation is green, but the `022-hybrid-rag-fusion` tree is still not release-ready because recursive validation remains red and release-significant follow-on work is still open.

## Findings First

### Fixed Since Earlier Waves

| ID | Title | Consolidated Status | Evidence | Source |
|----|-------|---------------------|----------|--------|
| `F-P0-01` | 012 release-control packet internally contradictory | **FIXED** | The `012` control packet was rewritten to match the live remediation state rather than claiming release closure too early. | `012:review-report.md` |
| `F-P0-02` | `npm test` failed across 6 suites | **FIXED** | `npm test` exits `0`; `013` explicitly treats the runtime gate as landed current-state evidence rather than draft backlog work. | `012:review-report.md`; `013:spec.md`; `013:plan.md` |
| `F-C01` | Deep-mode Stage 1 dropped cross-branch evidence | **FIXED** | Marked fixed in the v8 review backbone and carried forward by `013` as landed runtime remediation. | `012:review-report.md`; `013:spec.md` |
| `F-C02` | Missing `memoryState` bypassed Stage 4 `minState` filtering | **FIXED** | Marked fixed in the v8 review backbone and carried forward by `013` as landed runtime remediation. | `012:review-report.md`; `013:spec.md` |
| `F-C03` | Channel enforcement promoted raw scores above fused rankings | **FIXED** | Marked fixed in the v8 review backbone and carried forward by `013` as landed runtime remediation. | `012:review-report.md`; `013:spec.md` |
| `F-C04` | File-watcher TOCTOU race on reindex path | **FIXED** | Marked fixed in the v8 review backbone and carried forward by `013` as landed runtime remediation. | `012:review-report.md`; `013:spec.md` |
| `F-S01` | Session IDs lacked tenant/user/agent binding | **FIXED** | Marked fixed in the v8 review backbone and carried forward by `013` as landed runtime remediation. | `012:review-report.md`; `013:spec.md` |

### Current-State Notes From 013

- The `013` packet exists to stop treating the runtime remediation wave as draft-only work and to keep those landed fixes recorded as current state. `[Source: 013:spec.md Executive Summary, Scope; 013:plan.md Summary, Architecture]`
- `013` also keeps wider tree-wide documentation cleanup and recursive-validator cleanup explicitly open, so the green runtime gate must not be mistaken for release closure. `[Source: 013:spec.md Scope, Success Criteria; 013:plan.md Dependencies]`

### Active Release Blockers

These findings still keep the release state at `FAIL` because they keep the full-tree recursive validator red. Historical predecessor packet names below are preserved as provenance and baseline evidence labels, not as live folder dependencies.

| ID | Title | Evidence | Status | Source |
|----|-------|----------|--------|--------|
| `R-B01` | `001-hybrid-rag-fusion-epic` still has invalid memory anchors | Recursive validator reports orphaned closing anchors in the epic memory session artifact at lines `105` and `122`. | **OPEN** | `012:review-report.md` |
| `R-B02` | `003-constitutional-learn-refactor` still references missing agent docs | Recursive validator reports `3` spec-doc integrity failures pointing at a missing legacy ChatGPT speckit path. | **OPEN** | `012:review-report.md` |
| `R-B03` | `005-architecture-audit` still has invalid memory anchors | Recursive validator reports orphaned closing anchors in the architecture-audit memory artifact at lines `127` and `137`. | **OPEN** | `012:review-report.md` |
| `R-B04` | `006-feature-catalog` still has large-scale broken documentation refs | Recursive validator reports `102` spec-doc integrity failures across the packet implementation summary, review report, and task list. | **OPEN** | `012:review-report.md` |
| `R-B05` | `007-code-audit-per-feature-catalog` still has broken refs | Recursive validator reports `9` spec-doc integrity failures plus `1` template-header warning. | **OPEN** | `012:review-report.md` |
| `R-B06` | `010-template-compliance-enforcement` still has broken refs | Recursive validator reports `9` spec-doc integrity failures, largely stale agent and reference paths. | **OPEN** | `012:review-report.md` |
| `R-B07` | `013-agents-alignment` still has one blocking broken ref | Recursive validator reports the packet plan still references a missing legacy ChatGPT write-agent path. | **OPEN** | `012:review-report.md` |
| `R-B08` | `015-manual-testing-per-playbook` still has broad documentation-integrity drift | Recursive validator reports `35` spec-doc integrity failures in the packet plan and review report. | **OPEN** | `012:review-report.md` |
| `R-B09` | `016-rewrite-memory-mcp-readme` still has broken cross-doc refs | Recursive validator reports `7` spec-doc integrity failures in the packet plan and implementation summary. | **OPEN** | `012:review-report.md` |
| `R-B10` | `018-rewrite-system-speckit-readme` still has one blocking broken ref | Recursive validator reports the implementation summary still references a missing MCP server README target. | **OPEN** | `012:review-report.md` |

- `014` adopts these ten packet families as the blocker-first scope for the next remediation wave and requires local packet reruns before the final global sweep. `[Source: 014:spec.md Executive Summary, Scope, Requirements; 014:plan.md Summary, Phases]`
- `014` also requires the green runtime and non-recursive baselines to remain intact while these blockers are cleared. `[Source: 014:spec.md REQ-002; 014:plan.md Architecture, Phases]`

### Active Advisories

These do not create the FAIL verdict on their own, but they remain visible debt in the recursive run.

| ID | Title | Evidence | Status | Source |
|----|-------|----------|--------|--------|
| `R-A01` | `007-code-audit-per-feature-catalog` has a template-header deviation | Recursive validator flags an extra custom section header in the packet task list. | **OPEN** | `012:review-report.md` |
| `R-A02` | `013-agents-alignment` keeps non-blocking custom anchor deviations | Recursive validator flags extra anchors in the task list, checklist, and implementation summary. | **OPEN** | `012:review-report.md` |
| `R-A03` | `013-agents-alignment` keeps non-blocking template-header deviations | Recursive validator flags extra custom section headers in the task list, checklist, and implementation summary. | **OPEN** | `012:review-report.md` |
| `R-A04` | `014-agents-md-alignment` keeps a non-blocking custom anchor deviation | Recursive validator flags one extra custom anchor in the packet spec. | **OPEN** | `012:review-report.md` |
| `R-A05` | `014-agents-md-alignment` keeps non-blocking template-header deviations | Recursive validator flags extra custom section headers in the packet spec. | **OPEN** | `012:review-report.md` |
| `R-A06` | `015-manual-testing-per-playbook` keeps non-blocking custom anchor deviations | Recursive validator flags extra anchors in the packet spec, task list, and checklist. | **OPEN** | `012:review-report.md` |
| `R-A07` | `015-manual-testing-per-playbook` keeps non-blocking template-header deviations | Recursive validator flags extra custom section headers in packet docs. | **OPEN** | `012:review-report.md` |

### Follow-On P2 Status Notes

- `F-P2-06` remains a live follow-on question and must be re-verified before any new runtime patch is claimed. `[Source: 014:spec.md Problem Statement, Acceptance Scenarios; 014:plan.md Phases]`
- `F-P2-13` and `F-P2-24` remain open documentation-truth follow-ons that must be fixed or explicitly re-deferred with evidence. `[Source: 014:spec.md Scope, Success Criteria; 014:plan.md Phases]`
- Remaining non-target P2 items must stay explicitly deferred rather than disappearing from release-control tracking. `[Source: 014:spec.md REQ-008; 014:plan.md Summary]`

## Gate Verification

No fresh reruns are claimed here. The gate state below is the latest documented top-level state from **2026-03-26**.

### Runtime Verification

- `cd .opencode/skill/system-spec-kit/mcp_server && npm test`
  - Exit code: `0`
  - Core suite: `312 passed | 1 skipped` test files
  - Core tests: `8577 passed | 74 skipped | 26 todo`
  - File watcher suite: `21 passed`
  - Source: `012:review-report.md`

- `013` treats that green runtime gate as active current-state evidence, not draft-only planned work.
  - Source: `013:spec.md Executive Summary, Requirements; 013:plan.md Summary`

### Spec Validation

- Historical baseline: `012-pre-release-fixes-alignment-preparation --no-recursive`
  - Result: `PASSED`
  - Errors: `0`
  - Warnings: `0`
  - Source: `012:review-report.md`
- Historical baseline: `013-v7-remediation --no-recursive`
  - Result: `PASSED`
  - Errors: `0`
  - Warnings: `0`
  - Source: `012:review-report.md`
- `022-hybrid-rag-fusion --no-recursive`
  - Result: `PASSED`
  - Errors: `0`
  - Warnings: `0`
  - Source: `012:review-report.md`
- `022-hybrid-rag-fusion --recursive`
  - Result: `FAILED`
  - Errors: `10`
  - Warnings: `7`
  - Source: `012:review-report.md`

- `014` treats those ten recursive blocker families as the default release-critical cleanup surface until reruns replace this state.
  - Source: `014:spec.md Scope, Requirements; 014:plan.md Architecture, Phases`

## Verdict

**FAIL**

Why the consolidated verdict remains FAIL:

1. The runtime remediation wave is still green and remains legitimately fixed. `[Source: 012:review-report.md; 013:spec.md]`
2. The release gate is still blocked by recursive validation across ten packet families. `[Source: 012:review-report.md; 014:spec.md]`
3. The merged report is a consolidation artifact, not a fresh rerun, so there is no evidence basis for a verdict upgrade. `[Source: 012:review-report.md; 013:spec.md; 014:spec.md]`
4. Remaining release-significant P2 and documentation-truth follow-ons are still open and must stay visible until reruns replace them with fresh evidence. `[Source: 014:spec.md; 014:plan.md]`

## Release Recommendation

Do **not** mark the `022-hybrid-rag-fusion` tree release-ready from this consolidated release-control report.

The next release-oriented execution wave should:

1. Use this packet as the single active control surface for the merged historical `012` + `013` + `014` backlog.
2. Clear the ten recursive blocking packet families while preserving the green runtime and non-recursive baselines.
3. Re-verify `F-P2-06`, `F-P2-13`, and `F-P2-24` instead of silently carrying them forward.
4. Replace this FAIL verdict only when fresh reruns produce new evidence.

Until that happens, the truthful release state remains: runtime green, tree not release-ready.
