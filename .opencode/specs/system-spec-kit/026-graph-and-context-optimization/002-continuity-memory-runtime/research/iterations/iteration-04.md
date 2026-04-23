## Iteration 04
### Focus
Gate E continuity-source drift: re-read Gate E spec/ADR/summary and compare the documented parent-handover contract with the actual file-resolution behavior in the live resume helper.

### Findings
- Gate E repeatedly states that continuity should resolve from `../handover.md`, then `_memory.continuity`, then canonical spec docs, so the phase packet teaches a parent-handover recovery contract. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration/spec.md:27-29`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration/spec.md:190-199`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration/decision-record.md:73-75`
- The live resume helper never looks at a parent packet handover. It computes `handoverPath` from the resolved folder itself and only reads `folderPath/handover.md`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:627-644`
- The parent `003-continuity-refactor-gates` packet does have a handover file, which makes the Gate E wording plausible to a human reader, but the helper will not consult that parent artifact when the resumed folder is the Gate E child packet. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/handover.md:1-4`

### New Questions
- Should phase-child resume explicitly traverse to a parent handover, or should Gate E docs drop the `../handover.md` claim?
- If parent handover is intended, where should the ownership boundary between parent and child packet continuity live?
- Are other phase packets teaching the same parent-handover rule even though the helper is folder-local?
- Would adding parent traversal change any existing tests or security assumptions around explicit `specFolder` resolution?

### Status
new-territory
