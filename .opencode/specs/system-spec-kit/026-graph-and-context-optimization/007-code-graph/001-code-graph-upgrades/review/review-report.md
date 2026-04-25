---
title: "Phase Review Report: 005-code-graph-upgrades"
description: "2-iteration deep review of 005-code-graph-upgrades. Verdict CONDITIONAL with 0 P0 / 0 P1 / 1 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 005-code-graph-upgrades

## 1. Overview

Two allocated iterations covered the live `code_graph_query`, `code_graph_context`, `code_graph_scan`, and `code_graph_status` implementations and then the packet-local operator prompts that describe them. Verdict `CONDITIONAL`: the main packet scope and runtime stayed aligned, but one packet-local scratch guide still tells operators to expect detector provenance summary from `code_graph_status` even though that summary is exposed on the scan response instead.

## 2. Findings

### P2

1. Packet-local scratch prompts still tell operators to expect detector provenance summary from `code_graph_status`, but the live status handler only returns counts and health while the summary is exposed on the scan response. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/scratch/test-prompts-all-clis.md:13] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:18] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:110]

    {
      "claim": "The packet-local scratch verification prompts over-claim the `code_graph_status` response by asking for detector provenance summary there instead of on the scan response.",
      "evidenceRefs": [
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/scratch/test-prompts-all-clis.md:11",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/scratch/test-prompts-all-clis.md:13",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/scratch/test-prompts-all-clis.md:28",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/scratch/test-prompts-all-clis.md:30",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:18",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:31",
        ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:82",
        ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:110"
      ],
      "counterevidenceSought": "I re-checked the main packet docs and implementation summary first. Those surfaces only promise scan-handler persistence and context-handler exposure, which is why this remains a packet-local prompt drift instead of a broader P1.",
      "alternativeExplanation": "The scratch prompts may have been written before the final surface split was settled and never refreshed after implementation closed.",
      "finalSeverity": "P2",
      "confidence": 0.93,
      "downgradeTrigger": "Downgrade if the scratch prompts are explicitly labeled as exploratory examples rather than operator-facing verification guidance."
    }

## 3. Traceability

The live code-graph runtime stayed within the main packet boundary. `query.ts`, `context.ts`, `scan.ts`, `status.ts`, the handler tests, and the regression floor all support the shipped packet story. The only drift that survived review is the packet-local scratch guidance that points operators at the wrong response surface for detector provenance summary.

## 4. Recommended Remediation

- Refresh `scratch/test-prompts-all-clis.md` so the detector provenance summary is requested from `code_graph_scan` rather than `code_graph_status`.
- If status is intended to surface that summary in the future, add the field and a focused status-handler test instead of leaving the scratch guide ahead of the implementation.

## 5. Cross-References

- The main packet spec keeps the summary requirement on the scan handler. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/spec.md:99]
- The scan-handler test proves the summary on the scan response today. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:82] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:110]
