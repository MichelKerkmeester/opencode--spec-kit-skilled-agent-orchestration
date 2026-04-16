# Iteration 26 — Domain 2: State Contract Honesty (6/10)

## Investigation Thread
I re-checked the five requested seams against prior iterations and Phase 015, then narrowed to additive state-contract drift that had not already been recorded: where the runtime now **tests in** collapsed structural trust semantics, and where downstream health/bootstrap consumers still preserve only the coarse envelope-level trust label.

## Findings

### Finding R26-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- **Lines:** `598-601`
- **Severity:** P2
- **Description:** The `missing -> stale` collapse is no longer just an implementation detail; it is now a directly asserted public contract. `trustStateFromStructuralStatus()` still maps both `stale` and `missing` structural states to the same provenance label, and the newer structural contract tests now explicitly lock that downgraded label in for an empty graph.
- **Evidence:** `trustStateFromStructuralStatus()` returns `'live'` only for `ready` and `'stale'` for every other structural state (`shared-payload.ts:598-601`). `buildStructuralBootstrapContract()` still derives `status = 'missing'` for `empty` / unusable graph freshness and immediately serializes that status with `provenance.trustState = trustStateFromStructuralStatus(status)` (`lib/session/session-snapshot.ts:215-274`). The important additive change is test coverage: `tests/structural-contract.vitest.ts:90-111` now asserts `contract.status === 'missing'` **and** `contract.provenance?.trustState === 'stale'` for an empty graph, while `tests/startup-brief.vitest.ts:101-111` keeps asserting the same coarse `'stale'` label on the startup payload when the graph state is unavailable.
- **Downstream Impact:** The OpenCode transport renders only the envelope-level provenance line (`lib/context/opencode-transport.ts:64-71`), so missing structural context is now contractually presented to operators and agents as a recoverable "`stale`" graph rather than an absent one. That weakens downstream routing between "refresh existing graph state" and "there is no trustworthy structural graph yet."

### Finding R26-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts`
- **Lines:** `136-166`
- **Severity:** P2
- **Description:** `session_health` preserves the same collapsed `trustStateFromStructuralStatus(...)` output, but unlike `session_resume` and `session_bootstrap` it does not attach section-level `structuralTrust` axes at all. The health surface therefore exposes only the coarse envelope label (`live`/`stale`) even when the underlying structural status is `missing`.
- **Evidence:** `handleSessionHealth()` emits a `structural-context` section with only `content` and `source`, then sets `payloadContract.provenance.trustState = trustStateFromStructuralStatus(structuralContext.status)` (`handlers/session-health.ts:136-166`). By contrast, `session_resume` and `session_bootstrap` both compute `buildStructuralContextTrust(...)` and attach it to their `structural-context` sections before serializing the same collapsed provenance field (`handlers/session-resume.ts:475-547`, `handlers/session-bootstrap.ts:252-338`). Bootstrap only fail-closes on missing structural trust from the nested **resume** payload, not the health payload (`handlers/session-bootstrap.ts:252-270`). The current tests hide that asymmetry by mocking `handleSessionHealth()` as a bare `{ state, hints }` response with no payload contract or structural trust at all (`tests/session-bootstrap.vitest.ts:44-50`, `tests/graph-payload-validator.vitest.ts:168-175`, `tests/hook-session-start.vitest.ts:219-226`).
- **Downstream Impact:** `session_health` consumers get a machine-readable structural summary whose only trust signal is the same collapsed envelope provenance label already known to blur `missing` and `stale`. Because bootstrap/startup flows do not require health-surface structural trust the way they require resume-surface structural trust, this lower-fidelity contract can keep flowing through composite startup guidance unnoticed.

## Novel Insights
- Iteration 009 found the structural trust-state collapse in code; this pass shows that the collapse has since become **test-canonical**. The risk is now harder to treat as accidental drift because the suite explicitly blesses `missing status + stale provenance`.
- The runtime's structural surfaces are no longer equally honest: `session_resume` and `session_bootstrap` carry section-level trust axes, but `session_health` still reduces structural trust to the envelope provenance label alone. That makes health the weakest downstream consumer of the shared-payload trust vocabulary.

## Next Investigation Angle
Stay in Domain 2, but follow the first consumers that branch on these health/bootstrap envelopes: identify which hook/runtime surfaces read only `payloadContract.provenance.trustState` versus which ones inspect `structural-context.structuralTrust`, and verify whether any caller still has a machine-readable way to distinguish "graph missing" from "graph stale" once `session_health` is in the loop.
