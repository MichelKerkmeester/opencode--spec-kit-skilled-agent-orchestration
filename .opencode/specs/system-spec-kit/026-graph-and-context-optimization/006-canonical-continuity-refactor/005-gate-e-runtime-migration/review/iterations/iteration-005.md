# Review Iteration 005: Correctness - Quick Continuity Edit Guidance vs Runtime

## Focus
Reviewed whether the Gate E operator-facing guidance about quick `_memory.continuity` edits matches the load-bearing runtime carrier used by `/spec_kit:resume`.

## Scope
- Review target: `AGENTS.md`, `CLAUDE.md`, `README.md`, `.opencode/command/memory/save.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`, `.opencode/skill/system-spec-kit/SKILL.md`
- Spec refs: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/005-gate-e-runtime-migration/spec.md`
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `AGENTS.md` | 5 | 8 | 5 | 6 |
| `CLAUDE.md` | 5 | 8 | 5 | 6 |
| `README.md` | 6 | 8 | 6 | 7 |
| `.opencode/command/memory/save.md` | 5 | 8 | 5 | 6 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | 6 | 8 | 6 | 6 |
| `.opencode/skill/system-spec-kit/SKILL.md` | 7 | 8 | 7 | 7 |

## Findings
### P1-005-001: Gate E quick-edit guidance over-promises which spec docs are load-bearing
- Dimension: correctness
- Evidence: AGENTS, CLAUDE, README, and `/memory:save` all authorize direct `_memory.continuity` edits in generic “spec docs” or “canonical spec docs” [SOURCE: AGENTS.md:52] [SOURCE: CLAUDE.md:35] [SOURCE: README.md:345] [SOURCE: .opencode/command/memory/save.md:69]
- Cross-reference: the live resume ladder still reads continuity only from `implementation-summary.md`, and the skill names that file as the primary continuity block [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:593] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:520]
- Impact: an operator or agent can follow the published quick-edit guidance in another canonical doc and reasonably expect `/spec_kit:resume` to pick it up, but the runtime will ignore that edit.
- Skeptic: the top-level docs might be abstracting over the exact storage carrier to keep the instructions simple.
- Referee: the abstraction becomes unsafe because the same docs explicitly permit direct `_memory.continuity` edits; a simple but false instruction is still a correctness defect on an operator-facing surface.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Gate E operator guidance says quick `_memory.continuity` edits can land in generic spec docs, but `/spec_kit:resume` only reads continuity from `implementation-summary.md`.","evidenceRefs":["AGENTS.md:52","CLAUDE.md:35","README.md:345",".opencode/command/memory/save.md:69",".opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:593",".opencode/skill/system-spec-kit/SKILL.md:520"],"counterevidenceSought":"Checked whether the runtime, the primary skill, or the packet spec explicitly broaden runtime continuity reading to all canonical docs.","alternativeExplanation":"The docs are intentionally high-level, but the quick-edit allowance makes the exact carrier operational rather than cosmetic.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"A runtime change that reads `_memory.continuity` from any canonical spec doc, or a doc correction that narrows quick edits to implementation-summary only."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: all reviewed surfaces agree that `/spec_kit:resume` is the recovery surface.
- Contradictions: quick `_memory.continuity` edit guidance is broader than the runtime carrier actually used by the resume ladder.
- Unknowns: none.

### Overlay Protocols
- Confirmed: no legacy `memory/*.md` primary-artifact guidance remains in the reviewed surfaces.
- Contradictions: none beyond the quick-edit carrier drift.
- Unknowns: none.

## Ruled Out
- The current Gate E surfaces still direct operators back to `/spec_kit:continue`.
- The live runtime already reads `_memory.continuity` from every canonical packet doc.

## Sources Reviewed
- [SOURCE: AGENTS.md:52]
- [SOURCE: CLAUDE.md:35]
- [SOURCE: README.md:345]
- [SOURCE: .opencode/command/memory/save.md:69]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:593]
- [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:520]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The pass surfaced a new operator-facing contract defect by comparing quick-edit guidance to the live runtime carrier.
- Dimensions addressed: correctness

## Reflection
- What worked: reading the operator docs and runtime together made the mismatch obvious.
- What did not work: packet-level phrasing like “spec docs” hid the exact carrier until the helper code was inspected.
- Next adjustment: check the wider skill and command stack for contradictions about whether manual continuity edits are allowed at all.
