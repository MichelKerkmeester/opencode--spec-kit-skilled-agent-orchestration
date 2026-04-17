# Iteration 6 — Recovery Sweep + CP-001/CP-003 Re-Severity + Convergence Decision

## Dispatcher

- iteration: 6 of 7
- dispatcher: task-tool / @deep-review / claude-opus-4-7
- session_id: 2026-04-17T120827Z-016-phase017-review
- timestamp: 2026-04-17T13:45:00Z

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:133-376` (runPostInsertEnrichment rollup re-examination)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:136-201,388-402` (buildPostInsertEnrichmentResult rollup comparison)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:60-210` (CP-001 re-verification)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:1120-1135` (CP-003 re-verification)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:230-310` (comparison anchor for CP-001)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:1-200` (focus-file sample, unreviewed until now)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:1-120` (focus-file sample, unreviewed until now)
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:1-200` (focus-file sample, unreviewed until now)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/closing-pass-notes.md` (CP-001/CP-003 re-read)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/implementation-summary.md`, `tasks.md`, `spec.md`, `phase-4-quick-wins-summary.md`, `phase-017-p0-composites-summary.md` (T-RBD-01/T-RBD-02 intent trace)

## Investigation Thread

Iteration 6 is the final recovery sweep per the iter 5 brief. Three tracks executed:

### A. Re-examine confirmed-clean surfaces for hidden issues

**runPostInsertEnrichment executionStatus roll-up (iter 4 P2 #1 god function; brief item A.4):**
- Question posed: "does aggregation of partial + failed across 5 steps produce correct final status?"
- Re-read post-insert.ts:344-369 and response-builder.ts:136-201 side-by-side.
- **Finding**: the two rollups disagree on mixed-outcome cases. Specifically:
  - `post-insert.ts:352-369`: `if any failed → 'failed' (+ optional partialSteps); elif any partial → 'partial'; else 'ran'`.
  - `response-builder.ts:160-175`: `if deferred → 'deferred'; elif any failed AND any ran-or-partial → 'partial' (mixed); elif all failed → 'failed'; elif any partial → 'partial'; elif some-but-not-all deferred → 'partial'; else passthrough or 'ran'`.
- Concrete example: 1 step `failed` + 4 steps `ran` produces `executionStatus.status = 'failed'` in post-insert, but `postInsertEnrichment.status = 'partial'` in the MCP response.
- This IS intentional per T-RBD-01 (commit `709727e98`) which was explicitly described as "response was collapsing further than post-insert.ts does". The design intent: post-insert tracks failure-with-recovery (→ `runEnrichmentBackfill`), response surfaces nuance to MCP clients.
- **The design intent is NOT documented as a comment in either file**, making this a latent maintainability trap. A future author editing either rollup without the other will silently reintroduce the R21-001 collapse bug T-RBD-01 fixed.
- New P2 finding: **R6-P2-001** — Undocumented intentional divergence between two rollups.

**executeConflict duplicate transaction blocks (iter 4 P2 #3; brief item A):**
- Iter 5 already validated semantic equivalence between `normalizeScopeValue` and `getOptionalString` paths. No new observation.

**CP-001 `context.ts:97-105` readiness fail-open re-severity (brief item A + C):**
- Verified structurally unchanged: `context.ts:98-105` silently catches `ensureCodeGraphReady` exception into a stub with `freshness: 'empty'`, `reason: 'readiness check not run'`.
- Comparison with `query.ts:238-282` (hardened in T-CGQ-09/10/11/12): query.ts emits `canonicalReadiness` + `trustState` from explicit switch statements (`queryTrustStateFromFreshness` line 238-249) which maps `empty → 'absent'` vs `error` which is NOT a case in the context.ts readiness type (ReadyResult only has `fresh | stale | empty`).
- Key observation: the caller-visible difference is that when `ensureCodeGraphReady` THROWS, context.ts reports `freshness: 'empty'` + `reason: 'readiness check not run'` (observability gap: caller cannot distinguish "genuinely empty graph" from "readiness check crashed"). query.ts was hardened to emit `trustState` + `canonicalReadiness` alongside `freshness`, but it too has no explicit error→unavailable path in `queryTrustStateFromFreshness` — it only handles `fresh | stale | empty`. Both surfaces share the same blind spot.
- But query.ts got additional hardening via `getLastDetectorProvenance()` + `lastPersistedAt` breadcrumbs (T-CGQ-09 R18-001) that context.ts does NOT mirror. Context's `graphMetadata.detectorProvenance` at line 191 uses the global snapshot — the same anti-pattern T-CGQ-09 explicitly replaced in query.ts.
- **Severity decision**: CP-001 should **upgrade from P2 to P1** because (a) it now has an explicit-hardened sibling (query.ts) that did NOT get back-ported, (b) the globally-surfaced detector provenance is the same silent pattern T-CGQ-09 explicitly fixed in query.ts, (c) Phase 017 architecture gained a new trust-state vocabulary that context.ts does NOT emit, creating a two-tier observability asymmetry in the code_graph_* tool family.
- Classifying as **R6-P1-001** (upgrade of CP-001).

**CP-003 `entity-linker.ts:1129-1133` whole-corpus escalation re-severity (brief item C):**
- Verified structurally unchanged: line 1131 catches per-memory failure, line 1132 calls `runEntityLinking(db)` (whole-corpus).
- Brief asked: does "R4-P2-001 (god function) + R1-P1-002 (backfill retry-exhaustion missing)" make this systemic?
- Analysis: R1-P1-002 is about `runEnrichmentBackfill` lacking retry-exhaustion — a separate surface from entity-linker. R4-P2-001 (runPostInsertEnrichment god function) gates entity-linking on `extractionRan` (post-insert.ts:247-286), so the incremental-pipeline failure handler at line 1129 only fires when extraction DID run. This bounds the blast radius.
- Under extreme pressure: if the incremental pipeline fails 1000x in rapid succession, 1000 whole-corpus reruns occur with no dedup. That's the CP-003 concern.
- Phase 017 did NOT land a rate-limit for this. It is still a latent resilience issue, not a correctness issue.
- **Severity decision**: CP-003 stays at P2. Cumulative Phase 017 evidence doesn't change its correctness profile; it's a pure CPU/edge-density amplification under sustained failure, and Phase 017's hardening doesn't amplify the damage it can do.

### B. Sample unreviewed focus files for hidden P0/P1

Brief asked to sample 3-4 from the remaining 9 focus files. Sampled:

**`session-bootstrap.ts:1-200`**:
- Composite tool that runs `session_resume + session_health` in one call. Extracts data defensively (`_extractionFailed` sentinel at line 75), treats child parse failures as benign (line 86-91). `buildNextActions` at line 132-156 uses `Set<string>` + `.slice(0, 3)` for dedup.
- `extractCachedSummary` at line 99-107 returns a cached summary if structurally valid — inherits whatever trust-state validation `session_resume` applies upstream. This is consistent with R2-P1-001's observation that cross-session leakage depends on session-resume's cache semantics; session-bootstrap is a thin passthrough here.
- **No new finding.** Surface is well-structured; risks are inherited from session-resume (already flagged R2-P1-001), not introduced by bootstrap.

**`session-health.ts:1-120`**:
- Clean mapping of graphFreshness to trust state (`fresh → live, stale → stale, empty → absent, error → unavailable` at line 90-103). Uses `Extract<SharedPayloadTrustState, ...>` at line 41-44 to narrow to exactly the 4 states session-health emits — good type discipline.
- 3 sensible threshold constants (`FIFTEEN_MINUTES_MS`, `SIXTY_MINUTES_MS`, `TWENTY_FOUR_HOURS_MS`) at line 82-84.
- Explicit 4-case switch-alternative (if-else chain) with a fall-through default of `'unavailable'` at line 102.
- **No new finding.** Exemplary trust-state discipline — contrast to context.ts CP-001 upgrade.

**`opencode-transport.ts:1-200`**:
- `coerceSharedPayloadEnvelope` at line 127-163 validates all three provenance fields (kind, producer, trustState) with explicit allowlist + throw-on-reject. Uses `isSharedPayloadTrustState` (line 145) for M8 / T-SHP-01 enforcement — the same hardening iter 1 confirmed at shared-payload.ts:643-670. Error messages include the full allowed-values list.
- `renderStructuralAvailability` at line 92-103 maps graphFreshness to 4 output states (`fresh→available, stale→stale, empty→absent, error→unavailable`). Exhaustive.
- `isSharedPayloadEnvelopeShape` at line 56-66 uses type predicate properly with `typeof` checks on each field.
- **No new finding.** Clean transport adapter.

Sample conclusion: **no hidden P0/P1 in the 3 sampled unreviewed focus files.** Each is well-hardened. Given that 3/3 samples were clean and these were a purposeful variety (composite bootstrap, health check, transport adapter), low confidence that the remaining 6 unsampled files (`skill_advisor.py`, `skill_advisor_runtime.py`, `skill_graph_compiler.py`, `spec_kit_complete_auto.yaml`, `spec_kit_plan_confirm.yaml`, plus minor ones) harbor hidden P0/P1 at this point.

### C. Final convergence decision

Running the 3-gate convergence protocol per the brief:

**Gate 1: Ratio**
- Net-new findings this iteration: 2 (1 P1 upgrade of CP-001 → R6-P1-001, 1 P2 on rollup divergence → R6-P2-001).
- Severity-weighted new = (1 × 5.0) + (1 × 1.0) = 6.0.
- Cumulative (iter 1+2+3+4+5+6) = 13.0 + 13.0 + 13.0 + 14.0 + 6.0 + 6.0 = 65.0.
- newFindingsRatio = 6.0 / 65.0 = **0.0923**. **Below 0.10 threshold → ratio gate MET**.
- Note: R6-P1-001 is an **upgrade** of the existing CP-001 (not a fully new finding). Counting conservatively as a new P1 because the upgrade-to-P1 is itself a new classification event with new evidence. If counted as a refinement (0.5 weight), the ratio drops further to 5.5/65 = 0.0846. Either way, ratio gate MET.

**Gate 2: P0**
- New P0 this iteration: 0.
- Cumulative P0: 0.
- No P0 override fires. **P0 gate MET**.

**Gate 3: Coverage**
- Dimensions complete: correctness (iter 1), security (iter 2), traceability (iter 3), maintainability (iter 4), cross-reference (iter 5), recovery sweep (iter 6).
- All 4 primary dimensions + cross-ref + recovery all covered. **Coverage gate MET**.

**Severity-weighted quality gate**:
- Total P1 findings: 9 pre-iter-6 (R1-P1-001, R1-P1-002, R2-P1-001, R2-P1-002, R3-P1-001, R3-P1-002, R4-P1-001, R4-P1-002, R5-P1-001) + 1 new (R6-P1-001) = **10 P1 findings**. Plus 18 P2. Remediation backlog clearly warranted for synthesis.

**Verdict**: **CONVERGED.** All three gates met. Proceed to iteration 7 as the synthesis pass.

Adversarial self-check on R6-P1-001 (CP-001 upgrade):
- Hunter: "If context.ts inherits the same blind spot query.ts already had, isn't this P0? Operator cannot distinguish crash from empty graph." Evidence against P0: cached graph DB reads still succeed — the readiness check is orthogonal to the actual graph data; a crash in ensureCodeGraphReady does NOT imply the DB is corrupt. The DB-query result is still valid. The operator-visibility gap is a correctness-of-metadata issue, not a correctness-of-data issue. **Not P0.**
- Skeptic: "Is upgrading from P2 to P1 justified? The closing-pass-notes graded this P2 with adequate evidence." Evidence for upgrade: closing-pass-notes was written before T-CGQ-09/10/11/12 landed. Post-Phase-017, query.ts has explicit `canonicalReadiness` + `trustState` + `lastPersistedAt` hardening that context.ts lacks. The asymmetry is new and observable. Two tools in the same family (code_graph_query vs code_graph_context) now emit categorically different trust signals to callers. **Upgrade to P1 justified.**
- Referee: **Keep as R6-P1-001 (upgrade-of-CP-001 to P1)**. Evidence is the asymmetry in the hardened sibling, not the closing-pass observation alone.

Adversarial self-check on R6-P2-001 (rollup divergence):
- Hunter: "1 failed + 4 ran produces 'partial' in response but 'failed' in executionStatus. Isn't that a P1 correctness bug?" Evidence against P1: T-RBD-01 explicitly describes this as "response was collapsing further than post-insert does" and commit 709727e98 landed the redesign. The design IS intentional: post-insert tracks failure-with-recovery (`runEnrichmentBackfill`); response surfaces nuance to MCP clients. **Not P1 correctness — intentional adapter.**
- Skeptic: "If it's intentional, should this be a finding at all?" Evidence for finding: neither rollup comments reference T-RBD-01 or the intent. A future author editing either rollup will not see the design-intent handshake and may silently re-collapse. **P2 maintainability.**
- Referee: **Keep as R6-P2-001 at P2**. The divergence is correct today but documentation debt is real. Fix: add a comment block at both rollup sites citing T-RBD-01 and the recovery-vs-nuance split.

## Findings

### P0 Findings

None. Recovery sweep confirmed no hidden P0 across 3/9 sampled unreviewed focus files, the god-function rollup investigation, and the CP-001/CP-003 re-severity analysis. Cumulative P0: 0.

### P1 Findings

1. **CP-001 upgraded to P1: `code-graph/context.ts:98-105` swallows readiness exception and lacks the canonicalReadiness + trustState + lastPersistedAt hardening that T-CGQ-09/10/11/12 applied to the sibling `query.ts`** — `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:87-210`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:238-282` — The inner `try/catch` at context.ts:98-105 silently catches a throw from `ensureCodeGraphReady` into a stub `{freshness: 'empty', action: 'none', reason: 'readiness check not run'}`. Downstream callers see a payload structurally indistinguishable from a genuinely empty graph. In Phase 017, the sibling `query.ts` was explicitly hardened via T-CGQ-09 (R18-001), T-CGQ-10 (R20-003), T-CGQ-11 (M8 canonical readiness), and T-CGQ-12 (trust-state): query.ts now emits `canonicalReadiness` (line 279) + `trustState` (line 280) + `lastPersistedAt` breadcrumb for detector provenance (line 268-270). Context.ts was NOT given the same hardening — it still uses the global `getLastDetectorProvenance()` snapshot at line 191 without the lastPersistedAt correlation, and it emits a raw `readiness` object without the M8-canonical `trustState` field. The result: two tools in the same `code_graph_*` family emit categorically different observability signals to the same caller for the same underlying graph state. A session_bootstrap caller reading `code_graph_context` response cannot determine `trustState`; the same caller reading `code_graph_query` response gets explicit `live`/`stale`/`absent`. Upgraded from the closing-pass P2 classification because the asymmetry is a new Phase 017 consequence — closing-pass was written before T-CGQ-09/10/11/12 landed. The fix is to back-port the query.ts readiness+trustState contract to context.ts, emitting the same four-state vocabulary. Classified P1 because it affects an operator-visible MCP contract symmetry and the observability gap is structurally asymmetric across two sibling tools.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "The code_graph_context handler silently swallows readiness exceptions into a stub indistinguishable from a genuinely empty graph, and unlike its Phase-017-hardened sibling code_graph_query does not emit canonicalReadiness, trustState, or lastPersistedAt breadcrumbs — creating a two-tier observability asymmetry in the code_graph_* tool family that a closing-pass-era P2 classification no longer captures.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:98-105 (silent catch)",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:178-191 (raw readiness + global detectorProvenance)",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:238-282 (queryTrustStateFromFreshness + buildReadinessBlock + buildQueryGraphMetadata lastPersistedAt)",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/closing-pass-notes.md:12,64-66,349 (CP-001 original P2 classification)"
      ],
      "counterevidenceSought": "Checked if context.ts has any commit in the Phase 017 window that back-ports T-CGQ-09/10/11/12 — none. Checked if there is a callsite that normalizes context.ts output to match query.ts shape downstream — none; callers consume context.ts readiness directly. Checked if the new M8/T-SHP-01 trust-state enforcement applies to context.ts — opencode-transport.ts coerceSharedPayloadEnvelope only fires on payloads with `sections`+`provenance` structure; context.ts emits a bespoke payload shape that does not go through that gate. Checked if query.ts hardening was explicitly non-scope for context.ts — tasks.md lists T-CGQ-09 through T-CGQ-12 against `mcp_server/handlers/code-graph/query.ts` only, no context.ts task.",
      "alternativeExplanation": "The team may have decided context.ts is used only by LLM-oriented callers that tolerate non-structured readiness (per README: 'LLM-oriented compact graph neighborhoods'), while query.ts is used by trust-sensitive callers (session_bootstrap, session_health). If that's the intent, a README note at context.ts top would suffice and this downgrades to P3 documentation. No such note exists.",
      "finalSeverity": "P1",
      "confidence": 0.85,
      "downgradeTrigger": "If context.ts is amended to emit canonicalReadiness + trustState (matching query.ts) OR if a README declares the LLM-oriented contract exempts it from the M8 trust-state vocabulary, this reverts to P2 or lower."
    }
    ```

### P2 Findings

1. **Undocumented intentional divergence between `post-insert.ts` executionStatus rollup and `response-builder.ts` postInsertEnrichment rollup — readers will misdiagnose the divergence as a bug** — `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:344-369`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:136-201` — For mixed-outcome cases (1 step failed + N steps ran), the two rollups compute different `status` values: post-insert.ts always reports `'failed'` with `followUpAction: 'runEnrichmentBackfill'`, while response-builder.ts reports `'partial'` (because `nonFailedNonSkipped === true` at line 165-168). The design is intentional per T-RBD-01 (commit `709727e98`) which landed in Phase 4 QW with the description "response was collapsing further than post-insert does" — the intent is that post-insert tracks failure-with-recovery (triggering backfill), while the response surfaces nuance to MCP clients ("you got most of the enrichment"). However, neither rollup site has a comment referencing T-RBD-01 or explaining why the two disagree. A future author modifying one without the other will silently reintroduce the R21-001 collapse bug that T-RBD-01 explicitly fixed. Classified P2 because (a) the current behavior is correct, (b) the hazard is purely maintainability drift over time, (c) the fix is a code comment not a code change. Reinforces Cluster B (canonical-save hygiene) because it's another "intent not documented in code" pattern.

    ```json
    {
      "type": "claim-adjudication",
      "claim": "post-insert.ts and response-builder.ts implement two intentionally-different rollups for the same EnrichmentStatus input; the design intent (post-insert = failure-with-recovery tracking; response = MCP-client nuance) is documented only in commit 709727e98 / T-RBD-01 backing notes, not in either code site, creating a maintenance trap that will likely re-collapse on future edits.",
      "evidenceRefs": [
        ".opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:352-369",
        ".opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160-175",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/phase-4-quick-wins-summary.md:58 (T-RBD-01 R21-001 description)",
        ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/tasks.md:299 (T-RBD-01 evidence marker)"
      ],
      "counterevidenceSought": "Checked if the comment at response-builder.ts:131-135 (T-RBD-02 block) explains the divergence — it explains the M13 shape migration, not the rollup divergence from post-insert. Checked if there is a unit test asserting the divergence (to serve as implicit spec) — no test covers the mixed case where post-insert reports 'failed' and response reports 'partial' for the same input. Checked if implementation-summary.md documents this — row for 709727e98 mentions 'preserve post-insert enrichment truth' without the specific divergence contract.",
      "alternativeExplanation": "None — this is a documentation gap, not a behavioral ambiguity."
    }
    ```

## Traceability Checks

- **runPostInsertEnrichment rollup consistency with response builder**: partial — the two rollups disagree on mixed-outcome cases; divergence is intentional per T-RBD-01 but undocumented at both code sites.
- **CP-001 re-severity given Phase 017 architecture**: fail — context.ts does not emit canonicalReadiness/trustState that sibling query.ts was hardened to emit in T-CGQ-09/10/11/12.
- **CP-003 re-severity given cumulative evidence**: pass — resilience amplifier remains bounded; no correctness escalation.
- **Sampling unreviewed focus files for hidden P0/P1**: pass — 3/3 samples (`session-bootstrap.ts`, `session-health.ts`, `opencode-transport.ts`) are well-hardened with no new findings.
- **Convergence gates evaluation**: pass — all three gates (ratio, P0, coverage) met.

## Confirmed-Clean Surfaces

- `session-health.ts` trust-state discipline (Extract-narrowed SharedPayloadTrustState; 4-case exhaustive mapping; explicit fall-through to `'unavailable'`).
- `session-bootstrap.ts` composite adapter (defensive extractData with sentinel; Set-based dedup of nextActions; no trust-state leakage introduced).
- `opencode-transport.ts` envelope coercion (M8/T-SHP-01 allowlist for all 3 provenance fields; exhaustive structural-availability render; proper type predicates).
- `entity-linker.ts:1129-1133` CP-003 escalation (confirmed unchanged; bounded by `extractionRan` gate; stays at P2).
- `query.ts:238-282` canonicalReadiness + trustState hardening (confirmed well-structured; sets the bar that context.ts does not meet — see R6-P1-001).

## Confirmed Already-Known (cross-reference)

- **R4-P2-001** — runPostInsertEnrichment god function. Re-examination of the rollup did not surface a hidden correctness bug in the god function itself, but did surface a documentation gap between post-insert and response-builder (R6-P2-001). God function remains P2 maintainability.
- **R4-P2-002** — missing exhaustiveness checks. Observed again at post-insert.ts:302-306 (reasonMap as Record lookup with fallback to 'graph_lifecycle_no_op'). No re-flagging.
- **CP-003** — entity-linker whole-corpus escalation. Still open, still P2; no upgrade.
- **R1-P1-002** — backfill retry-exhaustion missing. Non-intersecting with CP-003; no compound.
- **R2-P1-001** — session-resume cache cross-session. Session-bootstrap sample confirmed it's a passthrough here, not an amplifier.

## Convergence Decision

- newFindingsRatio (iter 6): **0.0923** (6.0 / 65.0)
- P0 findings cumulative: 0
- Coverage gate: all 4 primary dimensions + cross-reference + recovery sweep complete
- Quality gate: **MET** (10 P1 + 18 P2 findings is a substantial synthesis-ready remediation backlog; Cluster A, B, C themes are stable)
- Verdict: **CONVERGED**
- Recommendation: **Proceed to iteration 7 as pure synthesis-prep.** No additional discovery pass is needed; remaining unreviewed focus files (6 of 9) are skill-advisor Python scripts + YAML command assets which have low P0/P1 density given the 3/3 clean sample ratio in iter 6.

## Convergence Signal

- Novel findings this iteration: 2 (1 P1 upgrade, 1 P2 new).
- Severity-weighted new findings: (1 × 5.0) + (1 × 1.0) = 6.0.
- Cumulative severity-weighted total (iter 1-6): 13.0 + 13.0 + 13.0 + 14.0 + 6.0 + 6.0 = 65.0.
- newFindingsRatio = 6.0 / 65.0 = **0.0923**. **Below the 0.10 convergence threshold**.
- Convergence trajectory: iter 1 (1.00) → iter 2 (0.50) → iter 3 (0.333) → iter 4 (0.264) → iter 5 (0.102) → iter 6 (**0.0923**). Smooth deceleration; final iteration below threshold confirms saturation.
- No P0 override (no new P0 this iteration).
- ruledOut this iteration: ["runPostInsertEnrichment god function hides correctness bug (refuted — rollup divergence is intentional adapter, documented in T-RBD-01 backing)", "CP-003 upgrade to P1 given R4-P2-001 + R1-P1-002 compound (refuted — entity-linking is gated by extractionRan; resilience concern stays P2)", "Unreviewed focus files harbor hidden P0/P1 (bounded — 3/3 sample clean; remaining 6 are skill-advisor Python + YAML with low P0/P1 density)", "context.ts CP-001 stays P2 given Phase 017 (REFUTED — upgrade to P1 because sibling query.ts got explicit trustState+canonicalReadiness hardening and context.ts did not)"].

## Next Iteration Angle

**Iteration 7 is the synthesis pass.** No further discovery iteration needed.

Planned synthesis deliverables for iter 7:
1. **Remediation backlog** — 10 P1 + 18 P2 findings grouped by Cluster A (scope-normalization drift), Cluster B (canonical-save-surface hygiene), Cluster C (ASCII-only sanitization), and standalones (R1-P1-002 backfill exhaustion, R2-P1-001 cross-session leakage, R2-P1-002 unicode, R3-P1-001 closing-pass stale CP-002, R6-P1-001 CP-001-to-P1).
2. **Cluster B priority escalation** — explicit recommendation that Cluster B (canonical-save-surface hygiene) is the single highest-leverage Phase 017 follow-on because 5 findings share root cause.
3. **R6-P1-001 proposal** — back-port T-CGQ-09/10/11/12 to context.ts (suggested task: T-CGC-01 through T-CGC-04).
4. **R6-P2-001 fix** — comment annotation at both rollup sites citing T-RBD-01.
5. **Cluster A consolidation task** — collapse the 4 reinvented `normalizeScopeValue` helpers to imports of `normalizeScopeContext`.
6. **Synthesis report format** — consolidated clusters + per-finding rationale + recommended task IDs + severity-weighted prioritization + remaining-risk assessment.
7. **Convergence attestation** — all 3 gates met at 0.0923 ratio + 0 P0 + 4-dimension coverage.

## Assessment

- Iteration 6 achieved the recovery-sweep goal: **converged at 0.0923 ratio**, just below the 0.10 threshold, with a final upgrade (R6-P1-001 CP-001→P1) and one documentation P2 (R6-P2-001 rollup divergence).
- **Critical late-iteration discovery**: R6-P1-001 — the closing-pass-era P2 classification of CP-001 no longer captures the severity given Phase 017's explicit hardening of the sibling query.ts. Two tools in the same `code_graph_*` family emit categorically different trust signals, which is a structural asymmetry worth remediating.
- **No hidden P0 surfaced in 6 iterations**. Cumulative P0 count: 0. Phase 017 remediation is correctness-complete with respect to the review's 4 P0 composite concerns.
- **Remaining risk profile** after iter 6:
  - 0 P0 findings
  - 10 P1 findings: R1-P1-001 (narrowed), R1-P1-002, R2-P1-001, R2-P1-002, R3-P1-001, R3-P1-002, R4-P1-001, R4-P1-002, R5-P1-001, R6-P1-001
  - 18 P2 findings across iter 1-6
- **Cluster B remains the single largest remediation surface** — now 5 member findings with the systemic-escalation signal from R5-P1-001 and the sibling asymmetry of R6-P1-001 anchoring a "canonical hardening incomplete" theme.
- Iter 7 is synthesis — no further discovery required.
