# Iteration 2: Security Session Scoping On Coverage Graph Runtime

## Focus
This pass audited security on the coverage-graph runtime surfaces, concentrating on whether session-scoped handlers actually stay isolated once data reaches the shared SQLite store. I reviewed the graph handlers, shared DB/query helpers, reducer fail-closed behavior, and the phase 008 session-isolation contract, then rotated into the shipped REQ-024 regression coverage to see whether the current tests would catch an isolation break.

## Scorecard
- Dimensions covered: [security, traceability, maintainability]
- Files reviewed: 18
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.4

## Findings

### P0 — Blocker
- None.

### P1 — Required
- **F004**: Coverage-graph writes are not session-isolated when IDs collide — `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:154` — `coverage_nodes` and `coverage_edges` key rows by bare `id` only (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:152-192`), and both upsert paths decide update vs insert with `WHERE id = ?` instead of the full namespace (`.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302`, `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376`). A later session that reuses an earlier node or edge ID mutates the existing row rather than creating a session-local record, violating REQ-012’s `specFolder + loopType + sessionId` isolation contract (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:99-100`) and creating a cross-session overwrite/leak path underneath handlers that otherwise pass `sessionId`.

### P2 — Suggestion
- **F005**: Session-isolation regression omits the ID-collision path — `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62` — The REQ-024 suite only inserts disjoint node and edge IDs per session (`q-a`/`q-b`, `a-answers-1`/`b-answers-1`) across `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62-91`, so it proves filtered reads on non-overlapping fixtures but never exercises the global-ID overwrite path in `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` and `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376`. The test can stay green while the runtime still corrupts session isolation under shared IDs.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:99` | REQ-012 requires shared graph helpers to scope by `specFolder + loopType + sessionId`, but the underlying write identity is still global by bare `id`. |
| test_traceability | partial | soft | `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62` | REQ-024 exists, but the only shipped isolation regression covers disjoint IDs and misses the collision path that the DB upsert semantics still allow. |
| fail_closed | pass | hard | `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:888` | Review and research reducers still fail closed on corrupt JSONL unless `--lenient` is explicitly set (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:693`). |

## Assessment
- New findings ratio: 0.4
- Dimensions addressed: [security, traceability, maintainability]
- Novelty justification: F004 is a new runtime isolation defect in the shared coverage-graph storage layer that was not part of iteration 1’s review-loop contract pass. F005 is new because the shipped REQ-024 regression suite does not cover the collision pattern that makes F004 actionable.

## Ruled Out
- Reducer corruption handling: Both reducers now surface `corruptionWarnings` and exit non-zero unless `--lenient` is passed — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:888-896`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:693-701`
- Confirm-mirror contract drift on blocked-stop and normalized pause/recovery events: confirm YAML and loop-protocol references agree on `blocked_stop`, `userPaused`, `stuckRecovery`, and graph convergence/upsert wiring — `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:375-379`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-517`, `.opencode/skill/sk-deep-review/references/loop_protocol.md:172-209`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:273-381`, `.opencode/skill/sk-deep-research/references/loop_protocol.md:121-145`

## Dead Ends
- Handler fallback without `sessionId`: The `all_sessions_default` path is explicitly documented bootstrap/debug behavior rather than a hidden bypass — `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:70`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:174`, `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:71`

## Recommended Next Focus
Stay on security for one more pass around graph identity generation and any callsites that can reuse node or edge IDs across sessions. If that namespace story is otherwise contained, rotate into maintainability and traceability on the remaining confirm/reference mirrors.
