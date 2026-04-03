# Review Iteration 006: D6 Reliability — context capture path

## Focus
D6 Reliability — context capture path

## Scope
- Review target: .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P1-023-007: CLI `--session-id` save path is wired through the surface but dropped before workflow capture
- Dimension: D6 Reliability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:398]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:562]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:265]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:589]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:791]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:832]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1431]
- Impact: The operator-facing flag suggests deterministic session targeting, but the current workflow never consumes it and may save against a different synthesized session id.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "The explicit session-selection contract for generate-context is currently unreliable.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:398",
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:562",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:265",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:589"
  ],
  "counterevidenceSought": "Checked whether normalized payload ingestion or workflow options honor the forwarded session id; the cited workflow path ignores it.",
  "alternativeExplanation": "If session selection is intentionally best-effort, the CLI surface should not present it as a deterministic control.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if runWorkflow begins honoring the forwarded sessionId or the CLI/help text is reduced to advisory wording."
}
```

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- Verified that memory-save recovery paths exist even though explicit session targeting is unreliable.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:265]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:589]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:791]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:832]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:398]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:562]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1431]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D6 Reliability — context capture path

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.
