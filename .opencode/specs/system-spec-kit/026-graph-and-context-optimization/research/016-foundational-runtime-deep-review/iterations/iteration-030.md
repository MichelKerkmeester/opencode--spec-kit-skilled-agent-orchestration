# Iteration 30 — Domain 2: State Contract Honesty (10/10)

## Investigation Thread
I traced the remaining missing/empty/stale collapse past the already-documented source seams and into the newer recovery/transport surfaces. The additive angle this pass is not another local mapper bug, but that higher-level consumers now emit contradictory machine-readable contracts for the same absent graph state and then hand the collapsed one to OpenCode transport.

## Findings

### Finding R30-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- **Lines:** `session-bootstrap.ts:321-347`, `session-resume.ts:530-551`
- **Severity:** P1
- **Description:** `session_bootstrap` and `session_resume` now serialize two incompatible states for the same structural condition. Their envelope provenance still uses `trustStateFromStructuralStatus(structuralContext.status)`, so a `missing` graph is labeled `stale`, while the newer `graphOps` contract in the same response canonicalizes that same condition to `missing` by routing non-ready/non-stale states through `graphFreshness: 'empty'`.
- **Evidence:** `shared-payload.ts:598-601` maps every structural status other than `ready` to `trustState = 'stale'`, while `session-snapshot.ts:215-222` derives `structuralContext.status = 'missing'` when graph freshness is `empty` or otherwise unusable. Both recovery handlers then serialize `payloadContract.provenance.trustState = trustStateFromStructuralStatus(structuralContext.status)` and immediately build `graphOps` from `'fresh' | 'stale' | 'empty'` (`session-bootstrap.ts:321-347`, `session-resume.ts:530-551`). The current tests only pin the aligned stale branch, not the contradictory missing branch: `tests/session-bootstrap.vitest.ts:104-123` asserts `trustState === 'stale'` together with `graphOps.readiness.canonical === 'stale'`, and `tests/session-resume.vitest.ts:221-235` covers only `graph=stale`.
- **Downstream Impact:** Any caller that keys off `payloadContract.provenance.trustState` gets “graph exists but is old,” while a caller that keys off `graphOps.readiness.canonical` gets “graph missing or unusable.” The same recovery payload can therefore drive refresh-first and repair-first behavior simultaneously, depending on which field a consumer trusts.

### Finding R30-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts`
- **Lines:** `64-71`, `98-149`
- **Severity:** P1
- **Description:** The OpenCode transport adapter consumes the already-collapsed top-level provenance label and drops the richer structural truth that bootstrap/resume surfaces already computed. `renderBlockContent()` prints only `payload.provenance.trustState`, and `buildOpenCodeTransportPlan()` forwards bootstrap/resume/health payloads straight into startup/message/compaction blocks without surfacing `structural-context.structuralTrust` or `graphOps`.
- **Evidence:** `renderBlockContent()` renders `Summary`, section text, and then `Provenance: ... trustState=...` with no mention of section-level trust or readiness (`opencode-transport.ts:64-71`). `buildOpenCodeTransportPlan()` uses that renderer for the startup digest, retrieved-context blocks, and compaction note (`opencode-transport.ts:98-149`). But the upstream payloads do contain richer structural truth: `tests/graph-payload-validator.vitest.ts:187-220` asserts that `session_resume` and `session_bootstrap` carry `sections[].structuralTrust` with separate trust axes. The transport tests never exercise degraded structural states and only validate a happy-path payload whose provenance is hard-coded to `trustState: 'live'` (`tests/opencode-transport.vitest.ts:33-60`).
- **Downstream Impact:** Hookless OpenCode recovery is handed the weakest and most misleading state label available. Even when bootstrap/resume already know the graph is `missing` and attach section-level structural trust, the injected transport blocks surface only `trustState=stale`, so downstream runtime guidance can treat “repair required” as merely “refresh later.”

## Novel Insights
- The remaining Domain 2 issue is now a **consumer-priority problem**: higher-level recovery payloads already carry enough information to distinguish missing from stale, but sibling fields disagree and the transport layer selects the dishonest one.
- Earlier iterations established the source collapses in `shared-payload.ts`, `code-graph/query.ts`, `graph-metadata-parser.ts`, `post-insert.ts`, and `hook-state.ts`. This pass shows the newest downstream risk is that later surfaces do not just preserve those collapses - they can place a collapsed label next to a more truthful contract, then export only the collapsed one.

## Next Investigation Angle
Domain 2 is exhausted at the current seam list. The next useful step would be cross-domain: trace which runtime or agent consumers branch on `payloadContract.provenance.trustState` instead of `graphOps.readiness.canonical` or `sections[].structuralTrust`, and quantify whether that preference changes actual fallback/repair behavior in OpenCode and startup-hook flows.
