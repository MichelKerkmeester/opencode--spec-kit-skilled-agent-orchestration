# Iteration 008: Correctness regression probe on memory-save walk-up and context-server mock cleanup

## Focus
This pass re-checked two user-called-out correctness regressions inside the live v3 scope only: the `handlers/memory-save.ts` parent walk-up used for spec-doc-health annotation, and the `tests/context-server.vitest.ts` cleanup that removed the two `vi.doMock(...memory-parser...)` lines. The goal was to verify that the walk-up order does not silently misclassify save targets or reopen retired `memory/*.md` acceptance, and that the test cleanup did not damage unrelated mocks/import paths or leave stale `findMemoryFiles` / `MEMORY_FILE_PATTERN` references under `mcp_server/tests/`.

## Findings

### P0
- None.

### P1
- None.

### P2
- None.

## Regression Probe
- **Walk-up check ruled out:** `memory-save.ts` uses the immediate parent first and the parent-of-parent second only inside the non-blocking spec-doc-health annotation block; the save gate still separately rejects any path that is not a canonical spec document or constitutional memory. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:361] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:368] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:369] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:371] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2084] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:959] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:963] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:975]
- **`vi.doMock` cleanup ruled out:** `context-server.vitest.ts` still keeps the `../lib/parsing/memory-parser` module path in the reset/import list, and the adjacent active mocks now target `memory-index-discovery` / `discoverMemoryFiles`; no stale `findMemoryFiles` or `MEMORY_FILE_PATTERN` references survived under `mcp_server/tests/`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:408] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1048] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1049]

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts`

## Ruled Out
- Retired `specs/**/memory/*.md` acceptance reopened through the spec-doc-health parent walk-up.
- Immediate-parent-first probing silently misclassifies canonical saves.
- `context-server.vitest.ts` mock cleanup broke unrelated import paths or nearby mocks.
- Any surviving `findMemoryFiles` / `MEMORY_FILE_PATTERN` reference under `mcp_server/tests/`.

## Dead Ends
- None. The requested regression probes closed cleanly without producing a new defect family or refining an existing finding.

## Recommended Next Focus
Return to synthesis/remediation planning for the residual `F005` / `F006` / `F007` / `F008` cluster; this correctness probe did not add a new regression.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: This pass was a bounded regression verification over two user-called-out risks and produced no new or refined findings because both probes stayed aligned with the current canonical save and test-harness contracts.
