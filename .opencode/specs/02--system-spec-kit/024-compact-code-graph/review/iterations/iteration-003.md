# Review Iteration 003: D3 Traceability — root packet to live implementation map

## Focus
D3 Traceability — root packet to live implementation map

## Scope
- Review target: .opencode/specs/02--system-spec-kit/024-compact-code-graph
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P1-024-001: Root packet still points reviewers at non-existent hook/build/API paths
- Dimension: D3 Traceability
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:172]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:180]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:99]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:229]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:230]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:56]
- Evidence: [SOURCE: .claude/settings.local.json:22]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:29]
- Impact: Operators following the root packet land on stale or missing paths rather than the shipped hook surfaces, so packet-to-runtime traceability is broken.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "The root packet\u2019s file map no longer matches the live hook implementation layout.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:172",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:180",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:99",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:229"
  ],
  "counterevidenceSought": "Checked whether the cited paths were intentionally historical or still referenced via compatibility wrappers; the live registration points elsewhere.",
  "alternativeExplanation": "Some path references may be legacy breadcrumbs, but they are still presented as active implementation surfaces.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the root packet clearly marks those paths historical and adds the current hook locations as the authoritative references."
}
```
### P1-024-002: Root packet records the resume-profile remediation as complete while the canonical wrapper still shows the stale call shape
- Dimension: D3 Traceability
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:77]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:126]
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:97]
- Evidence: [SOURCE: .opencode/command/spec_kit/resume.md:259]
- Evidence: [SOURCE: .opencode/command/spec_kit/resume.md:354]
- Impact: The root packet marks a wrapper-level fix as shipped even though the wrapper doc still presents the older bare `memory_context({ mode: "resume" })` contract.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "Spec-024 currently overstates completion of the `/spec_kit:resume` remediation.",
  "evidenceRefs": [
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:77",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:126",
    ".opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:97",
    ".opencode/command/spec_kit/resume.md:259"
  ],
  "counterevidenceSought": "Checked whether the stale lines were isolated examples; the cited wrapper surfaces still carry the old path in canonical command docs.",
  "alternativeExplanation": "If the live executable wrapper is fixed and the markdown is the only lagging surface, the issue is still a root-packet completeness problem.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if the canonical wrapper docs are truth-synced to the shipped runtime contract."
}
```

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- Compared root packet file maps and wrapper claims against the shipped hook/runtime locations.

## Sources Reviewed
- [SOURCE: .claude/settings.local.json:22]
- [SOURCE: .opencode/command/spec_kit/resume.md:259]
- [SOURCE: .opencode/command/spec_kit/resume.md:354]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:29]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:126]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:77]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:56]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:97]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:229]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:230]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:99]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:172]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:180]

## Assessment
- Confirmed findings: 2
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D3 Traceability — root packet to live implementation map

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.
