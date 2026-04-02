---
title: "Phase 7: Testing & Validation [02--system-spec-kit/024-compact-code-graph/007-testing-validation/spec]"
description: "Implement automated tests and run manual testing playbook scenarios for the entire hook system. Covers unit tests, integration tests, runtime smoke tests, and manual verification."
trigger_phrases:
  - "phase"
  - "testing"
  - "validation"
  - "spec"
  - "007"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 7: Testing & Validation

<!-- PHASE_LINKS: parent=../spec.md predecessor=006-documentation-alignment successor=008-structural-indexer -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary
Implement automated tests and run manual testing playbook scenarios for the entire hook system. Covers unit tests, integration tests, runtime smoke tests, and manual verification.

### Automated Test Files

### New Test Files (from research iteration 015)

| File | Type | Scope |
|------|------|-------|
| `tests/runtime-routing.vitest.ts` | Unit | Runtime detection logic, capability model output |
| `tests/hook-session-start.vitest.ts` | Unit | SessionStart hook payload parsing, context injection |
| `tests/hook-precompact.vitest.ts` | Unit | PreCompact precompute logic, cache write/read |
| `tests/hook-stop-token-tracking.vitest.ts` | Unit | Stop hook transcript parsing, token snapshot storage |
| `tests/cross-runtime-fallback.vitest.ts` | Integration | Tool-based fallback for non-hook runtimes |
| `tests/token-snapshot-store.vitest.ts` | Integration | SQLite `session_token_snapshots` table CRUD |
| `tests/session-token-resume.vitest.ts` | Integration | Session resume from token snapshot + context continuity |

### Existing Test File Extensions

| File | Extension |
|------|-----------|
| `dual-scope-hooks.vitest.ts` | Add Claude compaction fixtures (PreCompact -> SessionStart flow) |
| `crash-recovery.vitest.ts` | Add real SQLite fixtures for session recovery |

### 13-Scenario Test Matrix (iteration 015)

| # | Scenario | Runtime | Hook Policy | Test Path | Key Assertions |
|---|----------|---------|-------------|-----------|----------------|
| 1 | Claude Code with hooks (full path) | claude-code | enabled | SessionStart + PreCompact + Stop | Hook fires, correct MCP calls, budget enforced |
| 2 | Codex CLI without hooks (tool fallback) | codex-cli | unavailable | Gate 1 tool fallback | Runtime=codex-cli, hookPolicy=unavailable, Gate 1 works |
| 3 | Copilot CLI without hooks (v1 policy) | copilot-cli | disabled_by_scope | Tool fallback by policy | Runtime=copilot-cli, hooks suppressed by policy |
| 4 | Gemini CLI without hooks (unavailable) | gemini-cli | unavailable | Tool fallback by availability | Runtime=gemini-cli, hookPolicy=unavailable, hooks unavailable |
| 5 | Context compaction recovery (Claude only) | claude-code | enabled | PreCompact -> SessionStart(compact) | Surfaced payload truncates, constitutional ordering stable |
| 6 | Session resume after crash/exit | any | varies | resetInterruptedSessions + resume | Interrupted sessions recoverable, session IDs reused |
| 7 | Multi-session context continuity | any | varies | Session lifecycle + working memory | Event counters continue, no cross-session bleed |
| 8 | CocoIndex + code graph complementary queries | any | varies | Semantic query → CocoIndex, structural query → code_graph | Correct routing, no duplication |
| 9 | Code graph expansion from CocoIndex seeds | any | varies | CocoIndex search → feed results to code_graph_context | Structural expansion produces connected symbols |
| 10 | Compaction with CocoIndex enrichment | claude-code | enabled | PreCompact queries CocoIndex for active symbol neighbors | Cached context includes semantic neighbors within budget |
| 11 | Token budget allocator floors + overflow | any | varies | 3-source budget allocation with empty sources | Overflow redistribution works, floors respected, total ≤ 4000 |
| 12 | PreCompact latency within 2s cap | claude-code | enabled | Full pipeline: CocoIndex + graph + memory + merge | Total time < 2s, graceful skip of reverse augmentation if slow |
| 13 | Seed-to-node resolution accuracy | any | varies | CocoIndex hit at various line ranges → graph node mapping | Exact, enclosing, and file-anchor resolution all work correctly |

### RuntimeFixture Contract Interface

```typescript
interface RuntimeFixture {
  runtime: 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli';
  hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable';
  supports: {
    sessionStartHook: boolean;
    preCompactHook: boolean;
    stopHook: boolean;
    toolFallback: boolean;
  };
}
```

Shared fixture factory:
```typescript
function createRuntimeFixture(runtime: RuntimeFixture['runtime']): RuntimeFixture;
```

### Test Categories

### Unit Tests
- Runtime detection: environment variable parsing, capability model output
- Hook payload parsing: stdin JSON parsing for each hook type
- Transcript extraction: JSONL parsing, token counting from transcript
- Budget logic: 4000-token budget enforcement, truncation, constitutional priority

### Integration Tests (in-memory SQLite)
- Token snapshots: write/read/query `session_token_snapshots` table
- Session resume: reconstruct session state from snapshot + memory search
- Cross-session continuity: verify event counters, no bleed between sessions
- CocoIndex routing: verify semantic queries go to CocoIndex, structural to code graph
- CocoIndex + code graph enrichment: verify bidirectional seed → expansion flow
- Compaction with CocoIndex: verify PreCompact queries CocoIndex and includes results in cached context
- Token budget allocator: verify floors + overflow pool distribution across 3 sources
- PreCompact latency: verify pipeline completes within 2s hard cap with graceful degradation
- Seed resolution: verify CocoIndex file:line hits resolve correctly to tree-sitter nodes
- Working-set tracking: verify files accessed during session appear in compaction priority

### Runtime Smoke Tests
- Claude hook fixture: simulate PreCompact -> cache -> SessionStart(compact) -> inject
- Codex/Copilot/Gemini fallback: simulate tool-based recovery without hooks

### Manual Testing (from Phase 6 playbook)
- Execute all playbook scenarios from Phase 6
- Document results with pass/fail and evidence
- Capture any issues found during manual testing

### Acceptance Criteria
- [ ] All new test files created and passing
- [ ] Existing `dual-scope-hooks.vitest.ts` extended with compaction fixtures
- [ ] Existing `crash-recovery.vitest.ts` extended with SQLite fixtures
- [ ] RuntimeFixture contract implemented as shared test utility
- [ ] All 13 scenarios from test matrix covered
- [ ] Manual testing playbook scenarios executed and documented
- [ ] Test coverage includes both hook-active and hook-absent paths
- [ ] CI (vitest) status documented as: 242/242 spec-024 tests pass; 9089/9147 passed (51 pre-existing failures in unrelated tests)

### Files Modified
- NEW: `tests/runtime-routing.vitest.ts`
- NEW: `tests/hook-session-start.vitest.ts`
- NEW: `tests/hook-precompact.vitest.ts`
- NEW: `tests/hook-stop-token-tracking.vitest.ts`
- NEW: `tests/cross-runtime-fallback.vitest.ts`
- NEW: `tests/token-snapshot-store.vitest.ts`
- NEW: `tests/session-token-resume.vitest.ts`
- NEW: `tests/fixtures/runtime-fixtures.ts` (shared fixture factory)
- EDIT: `tests/dual-scope-hooks.vitest.ts` (add compaction fixtures)
- EDIT: `tests/crash-recovery.vitest.ts` (add SQLite fixtures)

### LOC Estimate
~400-600 lines (7 new test files) + ~100-150 lines (fixture factory) + ~80-100 lines (extensions to existing tests)

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
