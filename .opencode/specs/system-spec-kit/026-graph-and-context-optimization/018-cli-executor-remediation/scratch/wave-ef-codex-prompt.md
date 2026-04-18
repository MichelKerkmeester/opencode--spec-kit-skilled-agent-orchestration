# Phase 020 Waves E+F — Fence Parser (R9) + Telemetry/Coverage/Docs (R8+R10+R11)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-cli-executor-remediation/`
**Waves A+B+C+D state**: COMPLETE. 94/94 tests green. Executor first-write + description repair + copilot @path + metadata lineage shipped.
**Your role**: Bundle Wave E (R9 fence parser) + Wave F (R8 retry telemetry + R10 caller-context coverage + R11 readiness docs parity).

**First line**: `GATE_3_ACKNOWLEDGED: proceeding with packet 020 Waves E+F`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Wave E — Evidence-Marker Fence Parser (R9)

### T-FEN-01+02 — Fix indented + nested fence handling

**File**: `.opencode/skill/system-spec-kit/scripts/validation/evidence-marker-audit.ts` (or wherever the parser lives; search for `[EVIDENCE:` handler).

Research.md §6 Q9 conclusion:
- **Indented fences** (e.g., `    ```lang` with leading spaces) are a FALSE-POSITIVE source. The parser only recognizes column-0 fences, so content inside indented fences is incorrectly flagged as evidence markers.
- **Nested line-start triple backticks** (a ``` fence inside an already-open ``` fence) prematurely break fenced-code mode.

Fixes:
1. Track opener shape: store the opening fence's column and backtick-count. A closing fence must match (Markdown rule: any column ≤ opener's, same or greater backtick count).
2. Accept indented fences (column ≥ 0 but ≤ 3 is canonical Markdown). The parser should treat indented triple-backticks as a valid fence.
3. Track nested fence state: while inside an OPEN fence with backtick-count N, inner triple-backticks with count < N do NOT close the outer fence. Only ≥ N closes it.

Four-backtick fences are NOT an active issue per research findings; don't change that path.

Mismatched / unclosed fences stay separate false-negative cases (documented elsewhere).

### T-FEN-03 — Regression fixtures

Add regression test fixtures:
- `tests/validation/fixtures/evidence-indented-fence.md` — content with indented code block that contains paren-heavy prose; parser should NOT flag as evidence marker.
- `tests/validation/fixtures/evidence-nested-fence.md` — outer 4-backtick fence containing inner 3-backtick fence; parser should track state correctly.
- `tests/validation/fixtures/evidence-mismatched-fence.md` — unclosed fence; expected behavior is documented (false-negative, not the bug we're fixing here).

### T-TST-09 — Extend vitest suite

**File**: `.opencode/skill/system-spec-kit/mcp_server/tests/validation/evidence-marker-audit.vitest.ts` (create or extend depending on existing structure)

Test cases:
- Indented code block with paren-heavy content: NO false positives.
- Nested fence (4-backtick outer, 3-backtick inner): inner content stays within outer fence.
- Four-backtick fence in isolation: safe (no false positive).
- Mismatched-fence file: documented behavior preserved (false-negative expected, not regressed).

---

## Wave F — Retry Telemetry + Caller-Context Coverage + Readiness Docs Parity

### T-RET-01 — Retry-budget structured telemetry

**File**: wherever the retry-budget module lives. Find by searching for `MAX_RETRIES = 3` or `partial_causal_link_unresolved`.

Add a telemetry emit at each retry decision point:

```typescript
type RetryTelemetryRecord = {
  type: 'event';
  event: 'retry_attempt';
  memoryId: string;
  step: string;      // e.g., 'causal_link_backfill'
  reason: string;    // e.g., 'partial_causal_link_unresolved'
  attempt: number;   // 0-based
  outcome: 'retry' | 'give_up' | 'resolved';
  timestamp: string; // ISO 8601
};
```

Emit to the same state-log channel as the rest of deep-loop telemetry. No behavior change to the retry loop — N=3 stays.

### T-DOC-03 — Retry-budget docs update

Update the SKILL.md + any related README.md to say: "N=3 is a heuristic bounded-hot-loop budget. No empirical calibration data yet. Telemetry emits `retry_attempt` events (see module) so future calibration can use real attempt histograms."

### T-CTX-01+T-TST-10 — Caller-context async boundary coverage

**File**: `.opencode/skill/system-spec-kit/mcp_server/tests/caller-context.vitest.ts` (extend)

Add committed test cases for these async boundaries:
- `setImmediate(() => { expect(getCallerContext()).toEqual(expected); done(); })`
- `queueMicrotask(() => { expect(getCallerContext()).toEqual(expected); done(); })`
- `await import('node:timers/promises').then(({setImmediate, setTimeout}) => ...)` for `timers/promises` API

Each test confirms AsyncLocalStorage context survives the boundary. Research.md §6 Q6 verified these empirically with local probes; this wave commits the proofs as permanent regressions.

### T-DOC-04+T-DOC-05 — Readiness docs + Copilot bootstrap parity

**File 1**: `.opencode/skill/sk-deep-research/SKILL.md` — find the readiness-contract section. Narrow to 4 reachable TrustState values (`live`, `stale`, `absent`, `unavailable`). Mark `cached`, `imported`, `rebuilt`, `rehomed` as "declared in the shared type for compatibility but not emitted by the 7 code-graph handlers on this surface."

**File 2**: `.opencode/skill/sk-deep-review/SKILL.md` — same edit, symmetric.

**File 3 (if not already done in Wave C)**: `.opencode/skill/cli-copilot/SKILL.md` — any remaining bootstrap-doc contradictions after Wave C's fix.

---

## Invariants

- Zero behavior change to retry loop (N=3 stays).
- Zero behavior change to caller-context runtime.
- Fence parser fix may change output for specific false-positive fixtures; existing fixtures (paren-heavy, normal fences) must still pass.
- Docs-only edits don't affect vitest.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -5
npx vitest run 2>&1 | tail -8
```

Expected: tsc clean; total test count grows by ~6-10 (new fence cases + caller-context async + retry telemetry).

## Output

```
WAVES_EF_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
FENCE_PARSER_EDIT: [yes | no]
RETRY_TELEMETRY: [wired | deferred]
CALLER_CONTEXT_TESTS: [setImmediate, queueMicrotask, timers/promises]
DOCS_UPDATED: [sk-deep-research, sk-deep-review, cli-copilot]
VITEST_RESULT: [<n>/<m> passed]
TSC_RESULT: [pass | fail]
```
</content>
</invoke>
