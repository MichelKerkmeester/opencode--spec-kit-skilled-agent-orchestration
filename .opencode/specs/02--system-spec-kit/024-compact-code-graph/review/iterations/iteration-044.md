# Review Iteration 044
## Dimension: D1 Correctness
## Focus: Phase 020 query routing (memory-context.ts routing block, session-resume.ts)

## Findings

### [P2] F050 - classifyQueryIntent routing uses subject=normalizedInput, which passes prose queries as symbol names
- File: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1116
- Evidence: `buildContext({ input: normalizedInput, subject: normalizedInput })` passes the raw user query (e.g., "who calls ensureInit") as the `subject` parameter. In code-graph-context.ts, `resolveSubjectToRef(subject)` tries to look up this prose string as a symbolId, fqName, or name in code_nodes table. This will almost never match, so the code graph query will return empty results and fall through to semantic search. The routing is technically harmless (falls back gracefully) but the structural backend will never produce useful results for natural-language queries.
- Fix: Extract the actual symbol name from the query (e.g., parse "who calls ensureInit" to extract "ensureInit") before passing as subject. Or pass subject as undefined and rely on seeds.

### [P2] F051 - session-resume.ts hardcodes CocoIndex binary path using process.cwd()
- File: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:104
- Evidence: Same issue as F046 in memory-surface.ts: `resolve(process.cwd(), '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc')` relies on cwd being the project root. This is duplicated logic across two files (memory-surface.ts:347 and session-resume.ts:104).
- Fix: Extract CocoIndex availability check into a shared helper in a utils module. Use project root from config instead of process.cwd().

### [P2] F052 - session_resume does not record a metric event
- File: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts
- Evidence: The session_resume handler does not call `recordMetricEvent({ kind: 'memory_recovery' })` from context-metrics.ts, even though it performs a memory recovery operation. This means session_resume calls are invisible to the quality scoring system in Phase 023.
- Fix: Add `recordMetricEvent({ kind: 'memory_recovery' })` at the start of the handler.

## Verified Correct
- classifyQueryIntent correctly classifies structural/semantic/hybrid based on keyword/pattern scoring
- confidence threshold (0.65) for structural routing is appropriate — avoids routing on weak signals
- Fallback: if structural returns empty (totalNodes === 0), result is silently dropped and semantic runs normally
- Entire routing block wrapped in try/catch — any failure falls through to existing semantic logic
- session-resume.ts correctly merges three sub-calls (memory, graph, cocoindex) with independent error handling
- session-resume.ts provides actionable hints array when sub-calls fail or return empty
- queryIntentMetadata is appended to response at line 1391, providing routing transparency to the LLM

## Iteration Summary
- New findings: 3 (P2)
- Items verified correct: 7
- Reviewer: Claude Opus 4.6 (1M context)
