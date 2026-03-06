# Review Report: 014-ux-hooks-automation

**Date**: 2026-03-06
**Reviewers**: 3 Opus 4.6 agents + 3 Codex 5.3 agents (parallel delegation)
**Spec Level**: 2 | **Files Changed**: 26 | **Tests**: 485 passing

---

## Summary Verdict: PASS WITH NOTES (88/100)

The implementation is production-quality with strong type safety, consistent hook wiring, excellent test coverage, and complete spec documentation traceability. No Critical findings. Four Major findings identified — all architectural/sustainability concerns aligned with the research.md future roadmap rather than correctness bugs. The work delivered exactly what was specified.

| Dimension | Agent | Score | Verdict |
|---|---|---|---|
| Hook Module Code Quality | Opus #1 | 94/100 | EXCELLENT |
| Handler Integration | Opus #2 | 96/100 | EXCELLENT |
| Test Coverage & Assertions | Opus #3 | 90/100 | EXCELLENT |
| Architecture & Extensibility | Codex #4 | — | PASS WITH NOTES |
| Spec Documentation Traceability | Codex #5 | — | PASS WITH NOTES |
| Security & Reliability NFR | Codex #6 | — | PASS WITH NOTES |

---

## Findings by Severity

### Critical (must fix)
None.

### Major (should fix — 4 findings)

| # | Source | Finding | File Reference |
|---|---|---|---|
| M1 | Codex #6 | **Sensitive data in hints**: Raw exception text injected into user-facing `hints`/`error` fields can expose provider internals. Violates NFR-S01. | `memory-crud-health.ts:228-229,293,343,349` |
| M2 | Codex #6 | **Path redaction gap**: Absolute local paths returned to clients via `groups[].variants[].filePath` and `embeddingProvider.databasePath`. Conflicts with NFR-S02. | `memory-crud-health.ts:143-146,264,381` |
| M3 | Codex #6 | **Hook failure escape**: `toolCache.invalidateOnWrite()` not guarded by try/catch in hook runner; `context-server.ts` invokes hooks directly on file-watcher delete path — a thrown invalidation can escape. | `mutation-hooks.ts:34`, `context-server.ts:638` |
| M4 | Codex #4 | **Layer boundary inversion**: Hook module imports handler-owned type (`MutationHookResult`). Bi-directional coupling between `hooks/` and `handlers/` — safe at runtime (`import type`), but architecturally unclear. | `mutation-feedback.ts:5`, `mutation-hooks.ts:11-18` |

### Minor (nice to fix — 10 findings)

| # | Source | Finding | File Reference |
|---|---|---|---|
| m1 | Opus #1 | Non-null assertion `result.content![0]` after guard — safe but fragile | `response-hints.ts:97` |
| m2 | Opus #1 | `syncEnvelopeTokenCount` runs up to 5x `JSON.stringify`; convergence undocumented | `response-hints.ts:38-47` |
| m3 | Opus #1 | Redundant serialization: `serializeEnvelopeWithTokenCount` re-serializes after sync | `response-hints.ts:50-53` |
| m4 | Opus #2 | `runPostMutationHooks` call sites lack local try/catch — internally defensive but contract not explicit at handler level | Handler call sites |
| m5 | Opus #3 | Placeholder test T521-L3 asserts only `typeof === 'function'` — zero behavioral validation of limit clamping | `handler-checkpoints.vitest.ts:148-151` |
| m6 | Opus #3 | Conditional skips (15+ tests) with `ctx.skip()` could mask failures in CI | Multiple test files |
| m7 | Codex #4 | Manual hook composition distributed across 6+ files increases drift risk as hook count grows | `context-server.ts`, 4 handlers |
| m8 | Codex #4 | `response-hints.ts` scope broadened beyond "hints" (includes envelope/token serialization) | `response-hints.ts:31-53,103` |
| m9 | Codex #4 | `MutationHookResult` flat fields force additive churn; typed map would scale better | `mutation-hooks.ts:11-18` |
| m10 | Codex #6 | No explicit latency guard/measurement for hook precheck path — NFR-P01 (250ms p95) not provably enforced | `context-server.ts:289-292,300` |

### Suggestions (future consideration — 8 items)

| # | Source | Finding |
|---|---|---|
| s1 | Opus #1 | `HookResult.content` uses all-optional fields; discriminated union would be tighter |
| s2 | Opus #1 | `AutoSurfacedContext` uses `unknown[]` where precise types from `memory-surface.ts` exist |
| s3 | Opus #1 | `memory-surface.ts:56-58` module-level mutable state needs single-process assumption comment |
| s4 | Opus #2 | `runPostMutationHooks` called unconditionally on updates (no `if (changed)` guard) — inconsistent with delete/bulk-delete pattern |
| s5 | Opus #2 | File-watcher delete path discards `MutationHookResult` — stderr log would improve observability |
| s6 | Opus #3 | Missing test: `buildMutationHookFeedback` with all caches succeeding (no warning hint) |
| s7 | Opus #3 | Missing test: `appendAutoSurfaceHints` with zero constitutional + zero triggered |
| s8 | Opus #3 | Missing test: `autoRepair=true` when FTS is already in sync (no-op path) |

---

## Dimension Reports

### 1. Hook Module Code Quality (Opus #1) — 94/100 EXCELLENT

Well-structured modules with clear single-responsibility: `response-hints.ts` owns envelope decoration, `mutation-feedback.ts` structures cache-clear telemetry, `memory-surface.ts` orchestrates constitutional/trigger surfacing with caching. All exports clean through barrel. No `any` escapes. Error handling consistently non-throwing (try/catch-to-null pattern). The `MutationHookResult` ↔ `buildMutationHookFeedback` type contract aligns exactly across all 6 fields. Only actionable items: redundant JSON.stringify in hot path and a non-null assertion that could be tightened.

### 2. Handler Integration (Opus #2) — 96/100 EXCELLENT

All five mutation paths call `runPostMutationHooks` at the correct lifecycle point. Four handlers follow identical three-step wiring: hook → feedback → response. `confirmName` enforcement is three-stage and cannot be bypassed. `autoRepair` defaults safely to `false`. `appendAutoSurfaceHints` correctly placed on success path, non-throwing. Zero `console.log` in handlers or hooks. Each cache-clear individually try-caught for graceful degradation. Two minor suggestions only.

### 3. Test Coverage & Assertions (Opus #3) — 90/100 EXCELLENT

Strong assertion specificity throughout (toEqual, toBe, toMatch — virtually no toBeTruthy). Stdio safety scanner is clever filesystem-level prevention. Duplicate-save regression test has exemplary isolation. Checkpoint CRUD lifecycle fully covered including confirmName safety gate. Envelope structure tests verify full contract including tokenCount self-consistency. One P1: placeholder test T521-L3. Six coverage gaps identified (edge cases, not major flows).

### 4. Architecture & Extensibility (Codex #4) — PASS WITH NOTES

Separation of concerns between mutation-feedback and response-hints is sound but response-hints scope has broadened. Hook composition is manual and distributed across 6+ files — functional today but research.md's top-3 priorities (structured actions, shared composer, registry) remain unaddressed. `MutationHookResult` contract is clear but flat-field design limits extensibility. Layer boundary inversion (hooks importing handler types) is safe at runtime but architecturally inverted.

### 5. Spec Documentation Traceability (Codex #5) — PASS WITH NOTES

Full traceability matrix verified: all 7 requirements (REQ-001 through REQ-007) trace from spec.md → tasks.md → implementation-summary.md. Plan phases align with task groupings. Research baseline corrections reflected in implementation decisions. Two minor gaps:
1. CHK-021 (manual client pass) and CHK-030 (secret scan) not represented as explicit tasks
2. Extra deliverables (stdio-logging-safety.vitest.ts, embeddings.vitest.ts, stdout→stderr hardening) not in spec's "Files to Change" table — only in risks/dependencies narrative

### 6. Security & Reliability NFR (Codex #6) — PASS WITH NOTES

Three Major security findings: raw exception text in user-facing hints (NFR-S01), absolute paths in response payloads (NFR-S02), and an unguarded hook failure path. Verified controls: `confirmName` is robust (required, type-checked, exact match), `autoRepair` is safe (FTS rebuild only, no row deletion), stdio discipline is correct (console.error/warn only). No latency measurement for hook precheck against NFR-P01 target.

---

## Cross-Cutting Observations

1. **Consistency is a strength**: The same three-step hook wiring pattern is used across all mutation handlers, making the codebase predictable.
2. **Error handling philosophy is sound**: Non-throwing hooks with individual try/catch per cache-clear operation mean the system degrades gracefully.
3. **The type system is well-leveraged**: TypeScript types enforce contracts between hooks and handlers with no `any` escapes.
4. **Testing is behavior-focused**: Tests validate observable behavior (envelope shapes, hint content, error messages) rather than implementation details.

## Alignment with research.md Future Roadmap

The research.md identified 10 improvement opportunities and 10 new hook proposals. The current implementation **deliberately deferred** these to focus on shipping the P0-P1 scope. The top-3 research priorities (structured actions, shared composer, hook registry) are the most impactful next steps and would address findings M4, m7, m8, m9, and m10.

## Known Limitations Acknowledged

All three known limitations from implementation-summary.md are confirmed:
1. Memory indexing blocked by 1024 vs 768 embedding dimension mismatch — outside phase scope
2. 3008 orphaned entries in runtime stderr — outside phase scope
3. Broader hook expansion deferred to later phase — confirmed by research.md analysis

---

## Recommended Actions

**Applied in Phase 4 (2026-03-06)**:
- [x] M1: Sanitize exception text before injecting into user-facing hints — `sanitizeErrorForHint()` added with Unix+Windows path regex
- [x] M2: Redact absolute paths in health report response payloads — `redactPath()` added at 3 call sites
- [x] M3: Add try/catch around `toolCache.invalidateOnWrite()` in hook runner + file-watcher path
- [x] M4: Extract `MutationHookResult` into shared types module — moved to `memory-crud-types.ts`, re-exported
- [x] m1: Replace non-null assertion with safe access in `response-hints.ts`
- [x] m2/m3: Add convergence and serialization trade-off documentation comments
- [x] m4: Wrap `runPostMutationHooks` call sites in try/catch in 3 handler files
- [x] m5: Replace placeholder test T521-L3 with behavioral limit clamping assertions
- [x] m10: Add latency measurement for hook precheck path with 250ms p95 warning
- [x] s3: Add single-process assumption comment to `memory-surface.ts`
- [x] s6: Add all-caches-succeed test (no false non-fatal warning)
- [x] s7: Add zero-count auto-surface test (no false hint injection)
- [x] Review P1-a: Add Windows path regex to `sanitizeErrorForHint`
- [x] Review P1-b: Sanitize `repair.errors` entries through `sanitizeErrorForHint`

**Deferred (requires separate spec)**:
- [ ] m6: CI conditional skip masking (15+ tests with `ctx.skip()`)
- [ ] m7: Hook registry architecture to replace manual composition
- [ ] m8: Split `response-hints.ts` scope (envelope/token vs hints)
- [ ] m9: Typed map for `MutationHookResult` instead of flat fields

**Future architecture (per research.md)**:
- [ ] Structured response actions replacing string hints
- [ ] Centralized success-hint composer
- [ ] Lightweight hook registry/pipeline
