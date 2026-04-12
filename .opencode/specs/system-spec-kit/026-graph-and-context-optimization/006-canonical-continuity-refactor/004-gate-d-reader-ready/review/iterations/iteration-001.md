# Review Iteration 001: Correctness - Continuity Source Scope

## Focus
Reviewed whether the Gate D `resumeLadder` consumes `_memory.continuity` wherever the packet contract says it can live, or only from one specific canonical document.

## Scope
- Review target: `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`
- Spec refs: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/implementation-design.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md`
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | 6 | 8 | 5 | 6 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/implementation-design.md` | 8 | 8 | 9 | 8 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | 8 | 8 | 9 | 7 |

## Findings
### P1-004-001: `resumeLadder` only reads continuity from `implementation-summary.md`
- Dimension: correctness
- Evidence: `buildResumeLadder()` hard-codes `implementation-summary.md` as the only continuity snapshot source before parsing `_memory.continuity` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:593]
- Cross-reference: Option C defines `_memory.continuity` as a spec-doc frontmatter component, and the validator warns per document when the continuity block is missing [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/implementation-design.md:8] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:502]
- Impact: direct continuity updates in `spec.md`, `tasks.md`, or `decision-record.md` can exist, validate, and be indexed, but the resume fast path will ignore them and fall through to weaker document summaries.
- Skeptic: the skill later names `implementation-summary.md` as the primary continuity block, so the reader may be intentionally narrowed.
- Referee: even if `implementation-summary.md` is preferred, the Gate D design and validator surfaces still advertise `_memory.continuity` as a spec-doc feature; the runtime blind spot is therefore contract-breaking rather than harmless abstraction.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Gate D runtime recovery ignores `_memory.continuity` unless it is stored in `implementation-summary.md`.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:593",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/implementation-design.md:8",".opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:502"],"counterevidenceSought":"Checked the Gate D design summary, packet spec, and validator for any explicit statement that only implementation-summary continuity is load-bearing.","alternativeExplanation":"`implementation-summary.md` is the preferred continuity carrier, but the broader packet and validator contract do not constrain continuity to that file.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"A stronger canonical contract that explicitly narrows `_memory.continuity` to implementation-summary for all runtime recovery surfaces."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: `resume-ladder.ts` keeps the happy path filesystem-only and does not drop into SQL during the documented fast path.
- Contradictions: the implementation narrows `_memory.continuity` to `implementation-summary.md`, while the design and validator treat continuity as a spec-doc frontmatter feature.
- Unknowns: whether the narrowed reader scope is intentional for all future save/edit workflows.

### Overlay Protocols
- Confirmed: the Gate D packet still centers the reader flow on handover, continuity, and canonical docs.
- Contradictions: none beyond the continuity-scope blind spot.
- Unknowns: none.

## Ruled Out
- No evidence that `session_resume` performs SQL recovery on the happy path; it delegates to `buildResumeLadder()` and only reports no-context when ladder resolution fails.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:593]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/implementation-design.md:8]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:502]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md:71]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The iteration surfaced a fully new P1 by triangulating runtime behavior against the design and validator contract.
- Dimensions addressed: correctness

## Reflection
- What worked: comparing runtime code to the design summary and validator immediately exposed the continuity blind spot.
- What did not work: packet prose alone was too broad to settle whether the implementation-summary-only behavior was intentional.
- Next adjustment: inspect the temp-fixture tests to see whether the current regression lane protects the broader spec-doc continuity contract at all.
