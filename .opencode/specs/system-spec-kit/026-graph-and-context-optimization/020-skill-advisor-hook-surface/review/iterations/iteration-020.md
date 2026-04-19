# Iteration 020 — Dimension(s): D6

## Scope this iteration
Reviewed D6 Test coverage + test-code quality because iteration 20 rotates to D6. This pass spot-checked the subprocess and runtime-parity suites for still-untested contract branches after earlier D6 passes had already covered plugin cache/parsing gaps.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:22-31 → the subprocess runner publishes a broad fail-open error taxonomy including `INVALID_JSON_SHAPE`, `NON_ZERO_EXIT`, and `SQLITE_BUSY_EXHAUSTED`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:248-259 → non-success subprocess exits are normalized to `SQLITE_BUSY_EXHAUSTED` or `NON_ZERO_EXIT`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:279-284 → syntactically valid but schema-invalid JSON is normalized to `INVALID_JSON_SHAPE`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:57-139 → the suite currently covers success, `JSON_PARSE_FAILED`, timeout `SIGNAL_KILLED`, retry-success on `SQLITE_BUSY`, and `SCRIPT_MISSING`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:18-25 → the runtime-parity normalizer contract includes `transport`, `stderrVisible`, and optional `decision` alongside `additionalContext`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:66-115 → those normalized fields vary by raw output shape and are part of the adapter output surface.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:25-32 → the parity suite drives a fixed canonical fixture set.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119-134 → the parity assertion only compares `additionalContext` across runtimes.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
id P2-020-01, dimension D6, the subprocess unit suite leaves several shipped fail-open result codes untested. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:22-31` defines `INVALID_JSON_SHAPE`, `NON_ZERO_EXIT`, and `SQLITE_BUSY_EXHAUSTED` as first-class error outcomes, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:248-259` emits `SQLITE_BUSY_EXHAUSTED` / `NON_ZERO_EXIT` on unsuccessful closes, and `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:279-284` emits `INVALID_JSON_SHAPE` when stdout parses but violates the expected schema. The dedicated unit file `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:57-139` only exercises success, `JSON_PARSE_FAILED`, timeout `SIGNAL_KILLED`, retry-success on `SQLITE_BUSY`, and `SCRIPT_MISSING`. Impact: regressions in the remaining error-code normalization branches can change downstream diagnostics or fail-open telemetry while the focused subprocess suite still passes. Remediation: add table-driven cases for schema-invalid JSON, non-busy nonzero exit, and exhausted `SQLITE_BUSY` retry budget.

id P2-020-02, dimension D6, the runtime parity suite only asserts visible brief text and does not cover the rest of the normalized adapter contract. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:18-25` declares parity outputs as `{ runtime, transport, additionalContext, stderrVisible, decision? }`, and `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:66-115` populates those fields from multiple raw-output branches. But `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119-134` collects only `output.additionalContext` and matches only that property. Impact: a runtime can drift on `transport`, stderr visibility, or `allow/block/deny` decision semantics while keeping the same rendered brief text, so the advertised cross-runtime parity suite remains green. Remediation: extend parity expectations to assert the full normalized shape for representative fixtures, not just `additionalContext`.

### Re-verified (no new severity)
- P2-006-02 remains unresolved: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:25-32` still omits `ambiguousTopTwo.json` from `CANONICAL_FIXTURES`, and `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119-134` still iterates only that list.

## Metrics
- newInfoRatio: 0.09 (late-cycle D6 pass produced two small but fresh test-coverage gaps and one re-verification)
- cumulative_p0: 0
- cumulative_p1: 11
- cumulative_p2: 11
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Advance D7 by checking whether the hook-reference and skill-advisor docs reflect the newly observed plugin/native disable-flag split and current parity-test scope.
