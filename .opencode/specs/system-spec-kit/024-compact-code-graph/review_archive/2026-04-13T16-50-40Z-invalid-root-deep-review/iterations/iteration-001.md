# Review Iteration 1: Correctness + Traceability - Root packet and recovery contract inventory

## Focus
Inventory the root packet and current recovery surfaces to verify that canonical packet claims match live implementation/docs, that `session_bootstrap` / `session_resume` / resume wrapper guidance are internally consistent, and that advertised tool parameter contracts are honored.

## Scope
- Review target: `.opencode/specs/system-spec-kit/024-compact-code-graph`
- Spec refs: `spec.md`, `plan.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`
- Runtime/docs refs: `.opencode/command/spec_kit/resume.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`, `.claude/settings.local.json`
- Dimension: correctness, traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `spec.md` | 3/5 | 4/5 | 3/5 | 3/5 |
| `plan.md` | 3/5 | 4/5 | 3/5 | 3/5 |
| `checklist.md` | 2/5 | 4/5 | 2/5 | 3/5 |
| `implementation-summary.md` | 2/5 | 4/5 | 1/5 | 2/5 |
| `resume.md` | 4/5 | 4/5 | 4/5 | 4/5 |
| `tool-schemas.ts` | 3/5 | 4/5 | 2/5 | 4/5 |
| `session-bootstrap.ts` | 3/5 | 4/5 | 2/5 | 4/5 |
| `session-resume.ts` | 4/5 | 4/5 | 4/5 | 4/5 |
| `code-graph/query.ts` | 4/5 | 4/5 | 4/5 | 4/5 |

## Findings
### P1-001: `session_bootstrap` advertises recommended next actions that the handler never returns
- Dimension: traceability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:753], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:584], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:23], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:100]
- Impact: The documented API contract says `session_bootstrap` returns recommended next actions, but the live handler only returns `resume`, `health`, `structuralContext`, and `hints`. Callers auditing or consuming the canonical recovery surface can rely on a field that is not actually present.
- Skeptic: The free-form `hints` array may be intended to stand in for next actions, so this could be wording drift rather than a real contract break.
- Referee: Kept at P1 because both the schema description and README promise a specific surfaced capability, while the result type and emitted payload omit any `nextActions` field entirely; ambiguous prose would be a P2, but a missing advertised response element is a contract mismatch.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"The documented session_bootstrap contract promises recommended next actions, but the live handler does not return them.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:753",".opencode/skill/system-spec-kit/mcp_server/README.md:584",".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:23",".opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:100"],"counterevidenceSought":"Checked whether the handler result type or emitted JSON included a nextActions/recommendedNextActions field, and whether hints were explicitly documented as the same contract.","alternativeExplanation":"The author may have intended the hints array to cover recommended next actions informally.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Downgrade if another emitted field in the live payload is explicitly the documented next-actions contract, or if the docs are updated to stop promising that field."}
```

### P1-002: The canonical implementation summary still marks shipped packet items as deferred, so root checklist evidence no longer matches packet truth
- Dimension: correctness
- Evidence: [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:110], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:111], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:162], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:172], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:177], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/015-tree-sitter-migration/spec.md:129], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/spec.md:156]
- Cross-reference: [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:162], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:172], [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:177]
- Impact: The root checklist marks tree-sitter default/fallback behavior and SessionStart scope alignment as verified via `implementation-summary.md`, but that same implementation summary still says those items were deferred. That leaves the canonical packet internally inconsistent and undermines checklist evidence during future resume/review flows.
- Skeptic: Later phases may have completed the deferred work, so the root summary could just be a stale historical snapshot rather than an active packet claim.
- Referee: Kept at P1 because the root checklist explicitly uses `implementation-summary.md` as present-tense evidence for shipped completion, and the child phase specs now record those items as done. A canonical packet cannot use an outdated root summary as verification evidence without breaking traceability.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"The root packet's implementation-summary is stale enough to invalidate checklist evidence for shipped Phase 015/016 follow-through items.","evidenceRefs":[".opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:110",".opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:111",".opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:162",".opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:172",".opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:177",".opencode/specs/system-spec-kit/024-compact-code-graph/015-tree-sitter-migration/spec.md:129",".opencode/specs/system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/spec.md:156"],"counterevidenceSought":"Checked whether sibling packet docs or root packet later sections reclassified these items as completed in a way that would preserve the checklist's cited evidence path.","alternativeExplanation":"The implementation summary may have been intended as a time-stamped historical note, with later child phases carrying the authoritative status.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Downgrade if the root checklist stops citing implementation-summary.md for these items or the implementation summary is updated to reflect their completed later-phase status."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: `session_resume` / `session_bootstrap` / `/spec_kit:resume` all agree that `session_bootstrap()` is the canonical first recovery call and `session_resume()` is the detailed follow-up surface [SOURCE: .opencode/command/spec_kit/resume.md:259] [SOURCE: .opencode/command/spec_kit/resume.md:354] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:573] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739]
- Contradictions: `session_bootstrap` docs promise recommended next actions, but the live handler does not emit them [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:753] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:100]
- Contradictions: Root checklist evidence for tree-sitter/parser follow-through and SessionStart scope still points at an implementation summary that says those items were deferred [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:110] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:162]
- Unknowns: None for this inventory pass.

### Overlay Protocols
- Confirmed: Claude SessionStart registration is a single unscoped hook entry with in-script branching, matching the later phase-016 correction [SOURCE: .claude/settings.local.json:17] [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/spec.md:156]
- Contradictions: None newly confirmed in overlay protocols this iteration.
- Unknowns: `skill_agent`, `feature_catalog_code`, and `playbook_capability` were not materially exercised by the reviewed evidence set.

## Ruled Out
- Prior hypothesis that `code_graph_query` ignores the advertised `edgeType` parameter is not supported in the live handler; `resolveRequestedEdgeType()` normalizes explicit input and the handler passes it through both transitive and 1-hop query paths [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:18] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:169] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:184]
- Prior hypothesis that recovery guidance is split inconsistently across `session_resume` and `session_bootstrap` is not supported in the currently reviewed docs; the wrapper command, README, and schema descriptions align on bootstrap-first / resume-detailed usage [SOURCE: .opencode/command/spec_kit/resume.md:259] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:573] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739]

## Sources Reviewed
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:85-141]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/plan.md:65-121]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:72-178]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:80-184]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:94-100]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/015-tree-sitter-migration/spec.md:124-143]
- [SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/spec.md:148-163]
- [SOURCE: .opencode/command/spec_kit/resume.md:248-360]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:571-589]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:1032-1043]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:637-763]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:18-110]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:19-158]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:54-145]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:9-210]
- [SOURCE: .claude/settings.local.json:5-39]

## Assessment
- Confirmed findings: 2
- New findings ratio: 1.00
- noveltyJustification: Both confirmed findings are fully new P1 mismatches discovered by directly cross-checking current root-packet claims against live handler output shape and sibling packet truth.
- Dimensions addressed: correctness, traceability

## Reflection
- What worked: Cross-reading root checklist evidence against implementation-summary and live handler result types exposed concrete contract drift quickly.
- What did not work: Archived rerun hypotheses were too broad to trust without narrowing to exact live-file claims.
- Next adjustment: Move to security/reliability on hook-state and SessionStart/Stop durability, while keeping an eye on remaining root-packet truth-sync drift.
