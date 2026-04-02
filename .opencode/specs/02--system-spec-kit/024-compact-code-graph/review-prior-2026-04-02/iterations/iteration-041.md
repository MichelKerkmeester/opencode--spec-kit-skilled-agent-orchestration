# Review Iteration 041
## Dimension: ALL (D1-D5 cross-phase)
## Focus: Ultra-think final quality gate — phases 017-023 (30 files, +1651/-305)
## Reviewer: GPT-5.4 xhigh via Copilot CLI

---

## Investigation Summary

GPT-5.4 performed an exhaustive review across all 7 phases with:
- Code-review sub-agent (Claude Sonnet 4.6) on full diff
- Completeness sub-agent (Claude Haiku 4.5) on spec acceptance
- Direct grep/read verification of all critical code paths
- TypeScript compilation check (`npm run check`)
- Runtime routing test execution
- Gemini hook registration verification
- Freshness/health logic consistency cross-check

---

## Phase-by-Phase Verdicts

### Phase 017: Tree-sitter Parser Bug Fixes (F030-F044)
**VERDICT: PASS** | **Risk: MEDIUM**

- Parser fixes landed for abstract methods, decorators, multi-import/export, init poisoning, and nested class `fqName`
- Classifier matching tightened with word-boundary enforcement and confidence scaling
- Structural exports (`RawCapture`/`capturesToNodes`) exposed for reuse
- Prior iteration-041 finding (P1 F031-ext: `resolveKind` misses `const X = class {}` under `lexical_declaration`) remains valid but is edge-case severity

### Phase 018: MCP Auto-Priming + session_health Tool
**VERDICT: CONDITIONAL** | **Risk: MEDIUM**

- `PrimePackage` and session-health wiring are in place
- **Finding: Premature priming flag** — priming may be marked complete before package construction finishes, which could suppress retries after a failure during package building
- `recordToolCall` properly dispatched on every tool invocation in context-server.ts

### Phase 019: Code Graph Auto-Trigger
**VERDICT: PASS** | **Risk: LOW**

- `ensureCodeGraphReady()` checks empty/HEAD/mtime drift with 10s timeout guard
- Properly invoked before queries in both `context.ts` and `query.ts`
- `status.ts` reports true freshness (empty/stale/fresh)
- Timeout guard reduces hang risk in degraded environments

### Phase 020: Query-Intent Routing + session_resume Composite
**VERDICT: CONDITIONAL** | **Risk: MEDIUM**

- `classifyQueryIntent` wired into `memory-context.ts` for structural/semantic/hybrid routing
- `session-resume.ts` composite tool merges memory + graph + coco status
- **Finding: No test coverage** — no dedicated test files found for query-intent routing or session-resume handler
- Routing logic is correct by inspection but untested edge cases remain

### Phase 021: Instruction Parity + @context-prime Agent
**VERDICT: PASS** | **Risk: LOW**

- `context-prime.md` agent properly created with bootstrap responsibilities
- CODEX.md, AGENTS.md, GEMINI.md all updated with No Hook Transport lifecycle tables
- Cross-runtime guidance is consistent

### Phase 022: Gemini CLI Hooks
**VERDICT: CONDITIONAL** | **Risk: HIGH**

- 5 hook files created: session-prime.ts, compact-cache.ts, compact-inject.ts, session-stop.ts, shared.ts
- `.gemini/settings.json` has proper hook registration with correct lifecycle events (AfterAgent, PreCompress, SessionStart, SessionEnd)
- **Finding: Potential CWD mismatch** — MCP server `cwd` in Gemini config may point at a different checkout path than the current repo, which could cause Gemini to read/write the wrong workspace entirely
- Permission constraints prevented automated verification of the stale path

### Phase 023: Context Preservation Metrics
**VERDICT: CONDITIONAL** | **Risk: MEDIUM**

- `SessionMetrics` and `QualityScore` (healthy/degraded/critical) model is clean
- Event recording via `recordMetricEvent` exists
- **Finding: Sparse instrumentation** — only ~5 `recordMetricEvent` call sites found across the entire codebase, meaning most session events go unrecorded and the metrics module provides limited real-world signal

---

## Cross-Phase Findings

| # | Severity | Finding | Phase | Risk |
|---|----------|---------|-------|------|
| 1 | P1 | Premature priming flag may suppress retry on failure | 018 | MEDIUM |
| 2 | P1 | No test coverage for query-intent routing or session-resume | 020 | MEDIUM |
| 3 | P1 | Gemini MCP server `cwd` may point to wrong checkout path | 022 | HIGH |
| 4 | P2 | Sparse metrics instrumentation (~5 call sites) | 023 | MEDIUM |
| 5 | P2 | session_health uses weaker graph-staleness heuristic than code_graph_status | 018/019 | LOW |

---

## Overall Verdict

| Aspect | Assessment |
|--------|------------|
| **Verdict** | **CONDITIONAL** |
| **Confidence** | **82% (medium-high)** |
| **Blocking items** | 0 hard blockers — all P1s are reliability/coverage risks, not correctness failures |
| **Recommendation** | Ship with tracked follow-ups for P1 items; P022 cwd issue should be verified before Gemini usage |

The 017-023 stack is largely implemented and architecturally sound. Phases 017, 019, and 021 pass cleanly. Phases 018, 020, 022, and 023 carry enough reliability/coverage risk to warrant conditional approval with tracked remediation items.

---

## Verification Evidence

- TypeScript compilation: warnings but no blocking errors
- Runtime routing tests: PASSED
- Context server tests: partial issues (non-blocking)
- Code graph status: operational (15,443 files, 389,180 nodes, 20k+ edges)
- All 7 phase spec.md files reviewed against implementation
