# Review Iteration 006: D6 Reliability — hookless recovery semantics

## Focus
D6 Reliability — hookless recovery semantics

## Scope
- Review target: .opencode/specs/02--system-spec-kit/024-compact-code-graph
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P1-024-004: Canonical hookless recovery path suppresses the actual resume payload
- Dimension: D6 Reliability
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:116]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:122]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:584]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:59]
- Impact: The packet and public README frame `session_bootstrap` as the first-call recovery surface that returns context, but the implementation always forces minimal mode and skips memory resume content.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "Hookless recovery is currently less complete than the root packet claims.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:116",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:122",
    ".opencode/skill/system-spec-kit/mcp_server/README.md:584",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58"
  ],
  "counterevidenceSought": "Checked whether `session_bootstrap` rehydrates context elsewhere in the handler path; the cited minimal-mode branch intentionally suppresses it.",
  "alternativeExplanation": "If structural readiness alone is the intended bootstrap contract, the docs need to stop describing it as returning resume context.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if `session_bootstrap` grows an actual resume payload or the public/root contracts are narrowed to structural readiness only."
}
```

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- The canonical first-call recovery step still omits actual resume context.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:584]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:59]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:116]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:122]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D6 Reliability — hookless recovery semantics

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.
