---
title: "Refresh Review Report: 026-graph-and-context-optimization (post-remediation + 010)"
description: "10-iteration deep review refresh covering the 7 P1 remediations, new packet 010-memory-save-heuristic-calibration, and parent coordination accuracy. Verdict: CONDITIONAL."
importance_tier: "important"
contextType: "review-report"
---

# Refresh Review Report

## 1. Overview

- Iterations: 10
- Dimensions: D1, D2, D3, D4
- Verdict: CONDITIONAL
- Finding counts: P0=0 P1=3 P2=0

This refresh covered the full `026-graph-and-context-optimization` folder family after the prior 108-iteration batch review, with special attention on packet `003-memory-quality-issues/010-memory-save-heuristic-calibration`, the `8fa97d848` remediation batch, and the later root/report alignment commits. I also re-ran focused verification on the new scripts-side packet-010 suites and a targeted MCP-server suite during the refresh.

## 2. Findings Registry

### Finding DR-REFRESH-001-P1-001

- **Title:** Packet `010` lane accounting is internally inconsistent
- **Dimension:** D3 Traceability
- **Summary:** Packet `010-memory-save-heuristic-calibration` claims a 9-lane closeout, but the packet-local spec, tasks, checklist, and implementation summary disagree on how many lanes exist and which lane owns parent-sync work.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/spec.md:105-118`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/tasks.md:41-64`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/implementation-summary.md:35-46`

```json
{
  "claim": "Packet 010 advertises a 9-lane closeout, but its packet-local traceability surfaces disagree on the actual lane map.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/spec.md:105-118",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/tasks.md:41-64",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/implementation-summary.md:35-46"
  ],
  "counterevidenceSought": "Reviewed spec, tasks, checklist, and implementation summary for a single authoritative lane model.",
  "alternativeExplanation": "Closeout documentation may have drifted while runtime work remained correct.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if packet 010 is explicitly re-scoped to a different documented lane model and all packet-local docs are updated to match."
}
```

### Finding DR-REFRESH-007-P1-001

- **Title:** Parent packet `003` still reports Phase 10 as in progress
- **Dimension:** D3 Traceability
- **Summary:** Packet `003-memory-quality-issues` says its phase map is the current-truth surface, but the phase-10 row still says `In Progress` even though the child packet and the parent implementation summary both describe the work as shipped.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:33-36`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:84-99`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/spec.md:33-36`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/implementation-summary.md:20-25`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/implementation-summary.md:38-40`

```json
{
  "claim": "Parent packet 003 still reports Phase 10 as in progress even though the child packet and parent closeout prose say it shipped.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:33-36",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:84-99",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/spec.md:33-36",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/implementation-summary.md:20-25",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/implementation-summary.md:38-40"
  ],
  "counterevidenceSought": "Looked for a waiver or note that intentionally froze the phase-10 row at In Progress.",
  "alternativeExplanation": "The parent row may simply have been left stale after packet 010 landed.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if packet 003 explicitly redefines the phase map as non-authoritative for later child completion state."
}
```

### Finding DR-REFRESH-009-P1-001

- **Title:** Manual trigger preservation still bypasses the path-fragment guard
- **Dimension:** D2 Security
- **Summary:** Packet `010`'s ADR says manual phrases should still reject path fragments, but the sanitizer and workflow both return early for manual phrases before the path-fragment checks run.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/decision-record.md:60-67`; `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:139-156`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:138-154`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1299-1304`; `.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts:8-38`

```json
{
  "claim": "Manual trigger phrases still bypass the path-fragment guard even though packet 010's ADR says path fragments remain disallowed contamination.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/010-memory-save-heuristic-calibration/decision-record.md:60-67",
    ".opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:139-156",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:138-154",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1299-1304",
    ".opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts:8-38"
  ],
  "counterevidenceSought": "Looked for another pre-render validation layer that would reject manual path fragments before save or index.",
  "alternativeExplanation": "The broad manual allow path may have been added only to rescue DR IDs and singleton anchors, but it currently over-applies that exception.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if a later save-stage validator proves manual path fragments cannot be persisted or indexed."
}
```

## 3. What the Prior Remediation Fixed vs What It Introduced

The prior batch's 7 active P1 findings appear to hold as remediated in the sampled lanes I re-checked. The old packet-008 startup-hint issue is no longer reproducible in the focused startup test, which now explicitly rejects a `Structural Routing Hint` section on startup. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md:145-177] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67-86]

The old packet-010 degraded lexical overclaim also appears closed. Current forced-degrade tests expect `lexicalPath: 'unavailable'` plus explicit fallback-state metadata, not `bm25_fallback`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md:179-213] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:162-207]

The old packet-014 resume/bootstrap scope overclaim is likewise narrowed in current docs and tests. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md:245-267] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/spec.md:69-73] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/implementation-summary.md:34-37]

The refresh findings above therefore read as new or newly visible issues rather than regressions caused by the prior P1 fixes themselves.

## 4. Packet 010 Review Summary

Packet `010-memory-save-heuristic-calibration` is mostly behaviorally sound. The newly added tests cover the headline contracts well, and the focused V8 and V12 calibration work matches both code and tests. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:45-118] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts:27-80] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/validate-memory-quality-v12-normalization.vitest.ts:41-122] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:68-245]

The two weaknesses are narrower:

1. Packet-local closeout traceability drifted. The lane model is not internally consistent enough to support the claimed 9-lane narrative.
2. Manual trigger preservation widened too far and now bypasses the path-fragment guard that the packet ADR still claims should apply.

I also checked the new `title`, `description`, and `causalLinks` passthrough for obvious injection or path-traversal risk and did not find a comparable fail-open. Those fields are normalized directly, rendered through the normal template path, and blocked on malformed frontmatter before write if they would break YAML structure. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:632-655] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:747-755] [SOURCE: .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:136-168] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:154-161] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1780-1792]

## 5. Parent Coordination Accuracy

The root `026` parent packet remains coherent as a coordination surface. It still clearly marks itself as coordination-only, preserves the `001`-`014` phase map, and records dependency-aware handoff rules instead of over-claiming child behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:21-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:90-125]

The coordination weakness is instead localized inside packet `003-memory-quality-issues`, which still presents its phase map as the current-truth surface while leaving the phase-10 row stale. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:33-36] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:84-99]

## 6. Release Readiness Assessment

**Adversarial synthesis:** the strongest case against release is not broad runtime instability. It is that the packet-local truth surfaces are weaker than the runtime behavior they describe.

The weakest link is the combination of:

- packet `003` still misreporting phase-10 status in its own authoritative roll-up,
- packet `010` still carrying a lane-accounting drift that makes its closeout story harder to audit, and
- packet `010` still allowing manual path fragments through the trigger-preservation path.

That is enough to keep the overall verdict at `CONDITIONAL`, but not enough to justify `FAIL`. The sampled prior P1 remediations held, the focused scripts-side suite passed, and the focused MCP-server suite passed. There is no new P0 blocker in this refresh.

## 7. Recommended Next Steps

1. Fix the manual trigger path so DR IDs and compact manual anchors remain preserved, but manual path fragments still fail with `path_fragment`.
2. Repair packet `010`'s closeout traceability so `spec.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all describe the same lane model.
3. Update the packet-003 phase map so Phase 10 reflects the shipped child status and the parent roll-up is truthful again.
4. Re-run the focused scripts and MCP-server suites used in this refresh after the above three fixes land.
