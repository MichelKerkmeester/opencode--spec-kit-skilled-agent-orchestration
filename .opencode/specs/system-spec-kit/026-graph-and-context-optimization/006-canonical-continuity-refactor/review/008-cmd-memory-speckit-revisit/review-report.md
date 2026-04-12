---
title: "Phase Review Report: 008-cmd-memory-speckit-revisit"
description: "2-iteration deep review of 008-cmd-memory-speckit-revisit. Verdict CONDITIONAL with 0 P0 / 2 P1 / 0 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 008-cmd-memory-speckit-revisit

## 1. Overview
Review target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/008-cmd-memory-speckit-revisit/`. Iterations completed: 2 of 2. Stop reason: `max_iterations`. Dimensions covered: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. Verdict: CONDITIONAL. Finding counts: 0 P0 / 2 P1 / 0 P2.

## 2. Findings
### DR-008-I001-P1-001
`/memory:save` still describes canonical saves as updating packet docs, `_memory.continuity`, and indexed continuity data, but the live workflow now also refreshes the packet root `graph-metadata.json` on every canonical save. That omission makes the primary save command under-document a shipped side effect.

```json
{
  "type": "claim-adjudication",
  "claim": "/memory:save omits the graph-metadata refresh that canonical saves now perform.",
  "evidenceRefs": [
    ".opencode/command/memory/save.md:67",
    ".opencode/command/memory/save.md:71",
    ".opencode/command/memory/save.md:81",
    ".opencode/command/memory/save.md:353",
    ".opencode/command/memory/save.md:507",
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1939"
  ],
  "counterevidenceSought": "Re-read the save contract, output section, and tool-restriction appendix for any explicit graph-metadata wording.",
  "alternativeExplanation": "The omission could be editorial brevity, but this file is the primary operator contract for canonical save behavior.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if save.md is intentionally scoped to continuity surfaces only and another command doc is designated as the authoritative source for save side effects."
}
```

### DR-008-I002-P1-002
`/memory:manage` still documents `memory_index_scan` as a 3-source pipeline, but the live scan now indexes a fourth source: `graph-metadata.json` files from spec-folder roots. The command surface therefore understates what the scan actually discovers and chains into spec-folder indexing.

```json
{
  "type": "claim-adjudication",
  "claim": "/memory:manage still documents memory_index_scan as a 3-source pipeline even though graph-metadata is a fourth indexed source.",
  "evidenceRefs": [
    ".opencode/command/memory/manage.md:242",
    ".opencode/command/memory/manage.md:246",
    ".opencode/command/memory/manage.md:248",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:216",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:230",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:544"
  ],
  "counterevidenceSought": "Checked whether graph-metadata was folded into specDocFiles instead of treated as a separate discovery source.",
  "alternativeExplanation": "The docs may have been left intentionally high-level, but they explicitly name the pipeline sources and keys, so the missing fourth source is concrete drift.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if graph-metadata discovery is removed or deliberately hidden behind a different documented flag before the next release."
}
```

## 3. Traceability
The command surfaces already align on the canonical resume ladder and no longer advertise live shared-memory modes. The remaining drift is specifically about what canonical save and scan workflows now do after packet `011`.

## 4. Recommended Remediation
- Update [`save.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/memory/save.md:67) so canonical save outputs mention `graph-metadata.json` refresh explicitly.
- Update [`manage.md`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/memory/manage.md:242) so the scan model reflects `graphMetadataFiles` as a fourth source.

## 5. Cross-References
`/spec_kit:resume` already documents `graph-metadata.json` as a secondary packet hint after the canonical docs. The drift is localized to `/memory:save` and `/memory:manage`.
