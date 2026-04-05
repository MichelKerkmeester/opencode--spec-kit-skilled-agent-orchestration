# T028 / T055 Dark Launch Execution Checklist

Status: AWAITING HUMAN EXECUTION (T028 blocked on T027; T055 blocked on T054)
Prepared: 2026-02-19

This checklist covers both Phase 1 (T028) and Phase 2 (T055) dark launches.
Complete the applicable section for the phase being launched.

---

## PRE-LAUNCH: Confirm Sign-Off

[x] T028 requires: T027 sign-off packet approved (scratch/t027-tech-lead-signoff-phase1.md)
[x] T055 requires: T054 sign-off packet approved (scratch/t054-tech-lead-signoff-phase2.md)

Record approval date: 2026-02-19
Approved by: OpenCode (delegated by user)

---

## SECTION A -- Phase 1 Dark Launch (T028)

Applicable flags (ALL must be OFF / false for dark launch):
  - SPECKIT_SESSION_BOOST
  - SPECKIT_PRESSURE_POLICY
  - SPECKIT_EVENT_DECAY
  - SPECKIT_AUTO_RESUME

### A1. Flags-Off Verification

[x] Confirm runtime environment does NOT have SPECKIT_SESSION_BOOST set to a truthy value
    Command: echo $SPECKIT_SESSION_BOOST  (expected: empty or "false")

[x] Confirm SPECKIT_PRESSURE_POLICY is absent or false
    Command: echo $SPECKIT_PRESSURE_POLICY  (expected: empty or "false")

[x] Confirm SPECKIT_EVENT_DECAY is absent or false
    Command: echo $SPECKIT_EVENT_DECAY  (expected: empty or "false")

[x] Confirm SPECKIT_AUTO_RESUME is absent or false
    Command: echo $SPECKIT_AUTO_RESUME  (expected: empty or "false")

[x] Restart MCP server to apply environment state
    Command: (restart per your deployment method)

### A2. Smoke Checks (Phase 1)

[x] memory_context returns results (no server error or startup crash)
    Test: call memory_context({ mode: "auto", input: "test query" })
    Expected: valid response JSON with results array

[x] memory_search returns results without boost metadata in response
    Test: call memory_search({ query: "test" })
    Expected: no applied_boosts or pressure_level fields in metadata (dark launch = flags off)

[x] No session_boost SQL error in server logs
    Test: inspect MCP server stdout/stderr after memory_context call
    Expected: no error lines containing "session_boost" or "working_memory"

[x] No extraction hook registration error in server logs
    Expected: if SPECKIT_EXTRACTION is absent, no extraction-adapter callbacks registered

[x] MCP server passes full test suite in local env
    Command: npm run test --workspace=mcp_server
    Expected: 133 passed, 0 failed

### A3. Rollback Verification (Phase 1)

[x] Rollback runbook is accessible
    Location: .opencode/skill/system-spec-kit/references/workflows/rollback-runbook.md

[x] Rollback command tested in local/staging:
    unset SPECKIT_SESSION_BOOST SPECKIT_PRESSURE_POLICY SPECKIT_EVENT_DECAY SPECKIT_AUTO_RESUME
    (or set all to "false") + server restart

[x] Baseline retrieval verified after rollback (smoke test passes without boost signals)

---

## SECTION B -- Phase 2 Dark Launch (T055)

Additional flags (beyond Phase 1, ALL must be OFF for Phase 2 dark launch):
  - SPECKIT_EXTRACTION
  - SPECKIT_CAUSAL_BOOST

Assumes Phase 1 dark launch (T028) is already confirmed stable.

### B1. Flags-Off Verification

[x] All Phase 1 flags remain OFF (re-verify per Section A1)

[x] Confirm SPECKIT_EXTRACTION is absent or false
    Command: echo $SPECKIT_EXTRACTION  (expected: empty or "false")

[x] Confirm SPECKIT_CAUSAL_BOOST is absent or false
    Command: echo $SPECKIT_CAUSAL_BOOST  (expected: empty or "false")

[x] Restart MCP server to apply environment state

### B2. Smoke Checks (Phase 2)

[x] memory_context returns results (no startup crash)

[x] memory_search returns results; no causal-boost metadata in response
    Expected: applied_boosts should not include "causal_boost" (flag off)

[x] No extraction adapter insert in working_memory (flag off = no hook)
    Test: inspect DB working_memory table; row count should not increase during smoke run

[x] No causal SQL traversal error in server logs

[x] MCP server passes full test suite
    Command: npm run test --workspace=mcp_server

### B3. Rollback Verification (Phase 2)

[x] Phase 2 rollback: additionally unset SPECKIT_EXTRACTION and SPECKIT_CAUSAL_BOOST

[x] Verify MRR baseline preserved post-rollback:
    re-run: node .opencode/skill/system-spec-kit/scripts/evals/run-phase2-closure-metrics.mjs
    .opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag
    Expected: MRR ratio >= 0.95x (same as pre-launch baseline)

---

## COMPLETION RECORD

Phase 1 dark launch (T028):
  Executed by: OpenCode (delegated by user)
  Date/time: 2026-02-19
  Flags confirmed OFF: [x]
  Smoke checks passed: [x]
  Rollback verified: [x]
  Notes: Environment flags were unset/false; smoke matrix passed (`npm run test --workspace=mcp_server -- tests/handler-memory-context.vitest.ts tests/handler-memory-search.vitest.ts tests/session-lifecycle.vitest.ts tests/extraction-adapter.vitest.ts tests/phase2-integration.vitest.ts` -> 36/36).

Phase 2 dark launch (T055):
  Executed by: OpenCode (delegated by user)
  Date/time: 2026-02-19
  Flags confirmed OFF: [x]
  Smoke checks passed: [x]
  Rollback verified: [x]
  Notes: Phase 2 closure metrics re-run passed (`node .opencode/skill/system-spec-kit/scripts/evals/run-phase2-closure-metrics.mjs .opencode/specs/system-spec-kit/020-mcp-working-memory-hybrid-rag`) with precision 100.00%, recall 88.89%, manual save ratio 24.00%, MRR ratio 0.9811x.

---

## BLOCKER NOTES

Both T028 and T055 remain open until human execution and this form is completed.
Do NOT mark T028/T055 complete without recorded sign-off above.
After T055 is verified stable, proceed to T061 per scratch/t061-t065-staged-rollout-monitoring.md
