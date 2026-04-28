# Deep-Review Iteration Prompt Pack — 008/008 Iteration 2 (RE-DISPATCH)

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification`. The orchestrator (Claude loop manager) has authorized this folder for the entire deep-review session. DO NOT re-ask Gate 3. DO NOT request confirmation. DO NOT halt. Proceed directly to review work.

**TARGET AUTHORITY**: All write paths in this prompt are pre-approved under spec folder `008-skill-graph-daemon-and-advisor-unification/`. Writing iteration-002.md, appending JSONL state, writing delta — these are the deliverables, not options.

You are dispatched as a LEAF deep-review agent. Iter-1 closed CONDITIONAL with **P1-001 (advisor_recommend doesn't fail-open on freshness:'unavailable'; returns recommendations from corrupted/unavailable state)** plus 3 P2. Now perform the security pass.

## STATE SUMMARY

```
Iteration: 2 of 7
Mode: review
Dimension: security (priority 2)
Review Target: 008-skill-graph-daemon-and-advisor-unification
Prior Findings (cumulative): P0=0 P1=1 P2=3
Dimension Coverage: 1 / 4 (correctness covered)
Coverage Age: 1
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: CONDITIONAL (hasAdvisories=true)
Last claim_adjudication_passed: true
```

## PRIOR FINDINGS (do NOT re-flag)

- **DR-008-D1-P1-001**: `advisor_recommend` returns recommendations when freshness=unavailable.
- **DR-008-D1-P2-001**: Checklist evidence not resolvable as `file:line`.
- **DR-008-D1-P2-002**: Spec docs use `skill-advisor` (hyphen) while runtime is `skill_advisor` (underscore).
- **DR-008-D1-P2-003**: Strict-validation completion still open.

## ITERATION 2 FOCUS — D2 SECURITY

### S1. Cache corruption recovery boundaries
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- When the on-disk SQLite skill-graph DB is corrupted (truncated, malformed, locked), what's the recovery path?
- Does the daemon detect corruption proactively, or only on first failed query?
- Is the rebuild idempotent under concurrent recovery attempts?

### S2. SIGKILL / SIGTERM paths
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
- Daemon receives SIGTERM during a rebuild — does it abort gracefully, or leave a partial graph state?
- Plugin subprocess receives SIGKILL during scoring — does the parent recover, or hang?
- Are there orphaned processes after SIGTERM cascading?
- Lifecycle lease handling: does SIGTERM release the lease, or leave it hanging?

### S3. MCP error handling — prompt leak surface
- Per iter-1 referral: do `advisor-recommend.ts`, `advisor-status.ts`, `query.ts`, `scan.ts`, `status.ts` ever leak the user's prompt OR sensitive filesystem details (absolute paths, env vars) into error envelopes?
- Per iter-1 P1-001 (now-known): the unavailable fail-open is a separate finding; this iteration looks for OTHER MCP error paths.
- Specifically check: when an exception is caught, is the message templated with user input or filesystem state?

### S4. Compat shim trust boundaries
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- The Python fallback advisor: what privileges does it run with? Can a malicious skill graph file (after directory traversal) cause arbitrary code execution via the parser?
- Probe semantics: can the probe be tricked into reporting "available" when daemon is actually dead via a stale lock file?

### S5. Plugin loader surface
- `.opencode/plugins/spec-kit-skill-advisor.js`
- ESM plugin loader: any path traversal vulns? Does it sanitize the skill name before constructing import paths?
- Plugin caches scoring results — is the cache key collision-resistant?

### S6. Daemon authoritative-output guarantees
- For non-unavailable states (live, stale, absent, disabled): does the daemon ever return scoring output that diverges from the documented contract?
- Specifically: stale state should return results with a warning. Does the warning actually reach the client, or is it dropped at the MCP envelope boundary?

### S7. Authority-token / session-id boundary
- The MCP surface: does it differentiate between trusted system callers and external callers?
- Is there any path where an external caller can bypass authority checks and trigger a daemon rebuild?

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.
- Do NOT re-flag iter-1 findings.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown
Write to: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-002.md`

Headings: `# Iteration 2 — Security`, `## Dimension`, `## Files Reviewed`, `## Findings — P0`, `## Findings — P1`, `## Findings — P2`, `## Traceability Checks`, `## Claim Adjudication Packets`, `## Verdict`, `## Next Dimension`.

### 2. JSONL state log APPEND
```json
{"type":"iteration","iteration":2,"mode":"review","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T15:00:00.000Z","generation":1}
```

### 3. Per-iteration delta
Write to: `.../deltas/iter-002.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to point iter-3 at traceability.

GO.
