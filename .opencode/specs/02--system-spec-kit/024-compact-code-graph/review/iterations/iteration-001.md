# Review Iteration 001: D1 Correctness — bootstrap, code graph, and semantic bridge

## Focus
D1 Correctness — bootstrap, code graph, and semantic bridge

## Scope
- Review target: .opencode/specs/02--system-spec-kit/024-compact-code-graph
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P1-024-005: `code_graph_query` exposes an `edgeType` filter that the handler never honors
- Dimension: D1 Correctness
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:645]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:1040]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:149]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:167]
- Impact: The structural-query surface advertises an option users cannot actually rely on, which is a direct command/runtime contract break.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "The current code graph query handler ignores a documented input parameter.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:645",
    ".opencode/skill/system-spec-kit/mcp_server/README.md:1040",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:149",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:167"
  ],
  "counterevidenceSought": "Checked both transitive and one-hop paths for any use of `args.edgeType`; neither path consults it.",
  "alternativeExplanation": "If the implementation intends only high-level CALLS/IMPORTS selection, the schema and docs need to remove or narrow `edgeType`.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the handler begins enforcing `edgeType` consistently or the option is removed from the public surface."
}
```
### P1-024-008: Root packet overstates shipped compaction behavior as a true three-source merge
- Dimension: D1 Correctness
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:82]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:200]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:206]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:236]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:239]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:254]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:162]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:166]
- Impact: The implementation summary describes memory, structural, and semantic context as already merged into the compaction payload, but the live Claude path still feeds empty memory sections into the merger and appends surfaced memories only afterward.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "Spec-024 currently claims a stronger merged compaction product than the runtime actually constructs.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:82",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:200",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:206",
    ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:236"
  ],
  "counterevidenceSought": "Checked whether the merger itself materializes missing sources; it only truncates and renders the strings it receives.",
  "alternativeExplanation": "If the intended contract is \u201cmerge structure plus semantic hints, then append memories,\u201d the packet needs to say that precisely.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if the packet language is narrowed or the compact path begins injecting non-empty memory sections before merge."
}
```

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- Verified the current tree against the root packet rather than the archived startup-highlight review.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:1040]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:149]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:167]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:200]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:206]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:236]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:239]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:254]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:162]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:166]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:645]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:82]

## Assessment
- Confirmed findings: 2
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D1 Correctness — bootstrap, code graph, and semantic bridge

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.
