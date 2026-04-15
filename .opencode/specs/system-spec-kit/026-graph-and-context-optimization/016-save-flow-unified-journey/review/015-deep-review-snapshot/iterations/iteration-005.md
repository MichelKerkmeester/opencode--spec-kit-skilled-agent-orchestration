<!-- SNAPSHOT: copied from 015-save-flow-planner-first-trim/review/iterations/iteration-005.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 5
dimension: "Planner response classification"
focus: "Verify blocker versus advisory classification for legality, template, sufficiency, trigger-quality, and score-heavy checks"
timestamp: "2026-04-15T08:52:20Z"
runtime: "cli-copilot --effort high"
status: "insight"
findings:
  P0: 1
  P1: 0
  P2: 0
---

# Iteration 005

## Findings

### P0
1. **F003 — Planner-ready responses downgrade template-contract failures into advisories instead of blockers.** In the planner path, `buildAtomicPlannerAdvisories()` serializes invalid template-contract results as `TEMPLATE_CONTRACT_ADVISORY`, and `buildAtomicPlannerReadyResult()` only emits blockers for spec-doc structure failures. The non-warn-only save path still rejects invalid template contracts outright, so planner mode is currently under-classifying a template-required failure that the packet’s contract says must block. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1735-1744] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1770-1789] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1952-1970] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:61-80]

**Remediation suggestion:** Promote invalid template-contract results to planner blockers in the canonical planner path, or explicitly document and justify a narrow bypass rule that matches the existing `templateContractBypassed` exception instead of downgrading all violations.

## Ruled-out directions explored

- **Spec-doc legality stayed blocking.** The planner-ready path converts canonical validation failures into `SPEC_DOC_STRUCTURE_BLOCKER`, so merge legality, frontmatter-memory-block, cross-anchor contamination, and related spec-doc structure checks still surface as blockers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1770-1785]
- **Quality-loop trigger quotas stayed advisory.** Planner mode surfaces quality-loop failures and auto-fix suggestions as `QUALITY_LOOP_ADVISORY`, which matches the intended downgrade for score-heavy checks. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1711-1723]
- **Sufficiency stayed advisory in planner mode.** `SUFFICIENCY_ADVISORY` remains an advisory rather than a blocker in the planner response, which is consistent with the score-heavy half of the planner-first trim. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1725-1733]
- **Full save path still blocks template-contract failures.** Outside warn-only mode, invalid template contracts still go through `buildTemplateContractRejectionResult(...)`, so the misclassification is specific to the planner response surface rather than a global removal of the guard. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1960-1970] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:61-80]

## Evidence summary

- Planner blockers currently cover spec-doc structure failures.
- Planner advisories currently cover quality-loop score signals, sufficiency, and template-contract violations.
- The only blocker/advisory inversion found in this pass is template-contract severity.

## Novelty justification

This iteration added new signal because it found a planner-surface severity inversion that can let a template-required failure look optional to callers even though the underlying save pipeline still treats it as rejecting.
