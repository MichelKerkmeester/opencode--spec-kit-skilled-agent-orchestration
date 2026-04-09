---
title: "Phase Review Report: 010-fts-capability-cascade-floor"
description: "10-iteration deep review of 010-fts-capability-cascade-floor. Verdict CONDITIONAL with 0 P0 / 1 P1 / 0 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 010-fts-capability-cascade-floor

## 1. Overview
Review target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/`. Iterations completed: 10 of 10. Stop reason: `max_iterations`. Dimensions covered: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. Verdict: CONDITIONAL. Finding counts: 0 P0 / 1 P1 / 0 P2.

## 2. Findings
### DR-010-I001-P1-001
Packet `010` records degraded capability states and surfaces them in `memory_search`, but the packet overstates the degraded lane. `sqlite-fts.ts` logs `bm25_fallback` and returns an empty lexical result set as soon as FTS5 is unavailable, so the lane that supposedly "actually ran" did not execute.

```json
{
  "claim": "Packet 010 labels degraded requests as bm25_fallback even though the runtime returns empty lexical results instead of executing a fallback lexical lane.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/spec.md:95",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/spec.md:98",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/spec.md:125",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/implementation-summary.md:34",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/implementation-summary.md:36",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor/implementation-summary.md:56",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:99",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:210",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:212",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185"
  ],
  "counterevidenceSought": "Reviewed sqlite-fts.ts, handler metadata wiring, README text, and focused tests for any actual non-FTS lexical query behind the bm25_fallback label.",
  "alternativeExplanation": "The label may have been intended as capability shorthand rather than a description of executed work, but that is not how the packet documents or response field are worded today.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the packet docs and metadata are rewritten so bm25_fallback is explicitly only a capability-status label for an empty lexical lane."
}
```

Iterations `006` through `010` re-sampled the degraded runtime path, handler metadata, and README wording and did not surface any additional divergence beyond this original lane-label overstatement.

## 3. Traceability
The packet's docs and tests consistently freeze the same degraded labels, but that consistency hides the deeper mismatch: the runtime truth is "explicit fallback state with no lexical execution," while the packet vocabulary says a fallback lexical lane actually ran. The extension rerun left that mismatch unchanged.

## 4. Recommended Remediation
- Either implement a real degraded lexical path behind [`sqlite-fts.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts):208 or change the metadata and docs so they stop claiming the lane that "actually ran" was `bm25_fallback`.
- Update [`README.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md):177 and the focused tests to match whichever contract wins.

## 5. Cross-References
This phase is a predecessor contract for `002-implement-cache-warning-hooks`, so the misleading degraded-lane vocabulary has downstream impact even though the runtime fix should stay localized to packet `010`.
