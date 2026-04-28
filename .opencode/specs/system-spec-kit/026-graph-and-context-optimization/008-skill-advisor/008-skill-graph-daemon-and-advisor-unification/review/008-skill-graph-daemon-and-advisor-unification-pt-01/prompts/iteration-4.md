# Deep-Review Iteration Prompt Pack — 008/008 Iteration 4

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification`. The orchestrator has authorized this folder for the entire deep-review session. DO NOT re-ask Gate 3. Proceed directly to review work.

You are dispatched as a LEAF deep-review agent. Iter-1 (correctness, P1=1+P2=3), iter-2 (security, NEW P1=1+P2=3), iter-3 (traceability, NEW P1=1+P2=3) closed. This is the maintainability pass — the LAST dimension. After this iteration, dimension coverage hits 4/4 and the loop manager evaluates STOP gates.

## STATE SUMMARY

```
Iteration: 4 of 7
Mode: review
Dimension: maintainability (priority 4 — final)
Review Target: 008-skill-graph-daemon-and-advisor-unification
Prior Findings (cumulative): P0=0 P1=3 P2=9
Dimension Coverage: 3 / 4 (correctness, security, traceability covered)
Coverage Age: 1
Last 3 ratios: 1.0 -> ~0.4 -> ~0.3 (estimated)
Stuck count: 0
Provisional Verdict: CONDITIONAL (3 P1 active; hasAdvisories=true)
Last claim_adjudication_passed: true
```

## PRIOR FINDINGS (do NOT re-flag)

**P1s (active blockers):**
- D1: `advisor_recommend` doesn't fail-open on `freshness:'unavailable'`.
- D2: `skill_graph_scan` public MCP tool has no caller-authority check.
- D3: Active review invariants not mapped to regression tests.

**P2s (advisories):**
- Checklist evidence vague (D1)
- Hyphen vs underscore path drift (D1)
- Strict-validation completion still open (D1)
- SQLite corruption recovery not invoked from live paths (D2)
- Corruption rebuild helper not concurrency-safe (D2)
- MCP/plugin diagnostics leak filesystem paths (D2)
- Public scan authority boundary under-specified in docs (D3)
- Feature catalog vs implementation disagree on derived lane weight (D3)
- Promotion-gate traceability points to missing named gate-bundle artifact (D3)

## ITERATION 4 FOCUS — D4 MAINTAINABILITY

Audit code clarity, pattern consistency, and safe-follow-on-change cost. **Do NOT re-flag prior findings.** Maintainability findings should focus on patterns that future-you would have to fix even after the active P1s are resolved.

### M1. Daemon lifecycle / lease pattern consistency
- `mcp_server/skill_advisor/lib/daemon/{watcher.ts, lifecycle.ts}` — does the same lease/lock pattern appear in every mutation path? Or are there ad-hoc retries vs the `runWithBusyRetry` boundary?

### M2. Native scorer fusion clarity
- `mcp_server/skill_advisor/lib/scorer/{fusion.ts, lanes/explicit.ts, lanes/lexical.ts}` — is the lane fusion algorithm self-documenting? If a future maintainer adds a 4th lane, what's the touch surface?

### M3. Compat shim clarity
- `mcp_server/skill_advisor/lib/compat/daemon-probe.ts` and the Python fallback `scripts/skill_advisor.py` — is the contract between TS daemon and Python fallback documented anywhere? Or is it implicit in field shapes?

### M4. MCP tool surface coherence
- `mcp_server/skill_advisor/handlers/{advisor-recommend.ts, advisor-status.ts}` and `mcp_server/handlers/skill-graph/{query.ts, scan.ts, status.ts}` — are response shapes consistent? Is there a canonical `AdvisorResponse` / `SkillGraphResponse` type, or do each handler define its own?

### M5. Plugin bridge architecture
- `mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` and `.opencode/plugins/spec-kit-skill-advisor.js` — what's the boundary between bridge and plugin? If a future runtime (Codex, Gemini) wants to consume the advisor, what does it need to implement vs reuse?

### M6. Test fixture / shape consistency
- 008/008 test files: do they share fixtures for the SQLite skill-graph DB, or each set up their own? Is there a `tests/skill-advisor/fixtures/` helper?
- Are tests organized by handler, by capability, or by ad-hoc concern?

### M7. ADR coverage of major architectural choices
- Decision-record mentions seven sub-tracks (validator ESM, daemon freshness, derived metadata, native scorer, MCP, compat shims). Each of these is a substantial architectural choice — are they documented as separate ADRs or all collapsed into one section?

### M8. Phase-merge / sub-track artifact hygiene
- The 7 sub-track packets (or sub-tracks) — are there any orphaned imports, unused symbols, or redundant re-export files left over from the unification?

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.
- Do NOT re-flag iter-1/2/3 findings.
- 3 P1s are already active — additional P1s should only be reported if they're maintainability-class structural risks not already covered.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown
Write to: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-004.md`

Headings: `# Iteration 4 — Maintainability`, `## Dimension`, `## Files Reviewed`, `## Findings — P0`, `## Findings — P1`, `## Findings — P2`, `## Traceability Checks`, `## Claim Adjudication Packets`, `## Verdict`, `## Next Dimension` (state "STOP candidate — all 4 dimensions covered" if no new P0/P1).

### 2. JSONL state log APPEND
```json
{"type":"iteration","iteration":4,"mode":"review","status":"complete","focus":"maintainability","dimensions":["maintainability"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T15:00:00.000Z","generation":1}
```

### 3. Per-iteration delta
Write to: `.../deltas/iter-004.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to indicate STOP candidate.

GO.
