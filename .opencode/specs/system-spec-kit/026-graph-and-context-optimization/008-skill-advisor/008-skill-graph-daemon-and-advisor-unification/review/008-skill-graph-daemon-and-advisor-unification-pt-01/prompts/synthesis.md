# Deep-Review Synthesis Prompt — 008/008-skill-graph-daemon-and-advisor-unification

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification`. The orchestrator has authorized this folder. DO NOT re-ask Gate 3. Proceed directly to synthesis.

The 4-dimension iteration loop has converged at iter-4. Cumulative: **P0=0, P1=3, P2=15** = 18 active findings. STOP gates pass (P0=0; all dims covered; coverage_age ≥ 1; claim adjudication green). Verdict candidate: **CONDITIONAL** with `hasAdvisories=true`.

## CONVERGENCE STATE

```
Iterations: 4 of 7 (converged early)
Stop reason: converged (composite weighted-stop score >= 0.60; all 4 dimensions covered; P0=0)
Cumulative findings: P0=0, P1=3, P2=15
Verdict candidate: CONDITIONAL
Active P1s:
  - DR-008-D1-P1-001: advisor_recommend doesn't fail-open on freshness:'unavailable'
  - DR-008-D2-P1-001: skill_graph_scan public MCP tool has no caller-authority check
  - DR-008-D3-P1-001: active review invariants not mapped to regression tests
```

## YOUR TASK

1. **Adversarial self-check on ALL THREE P1s** (Hunter → Skeptic → Referee).
   - **Hunter**: re-read each P1's cited file:line evidence; confirm or refute.
   - **Skeptic**: challenge severity. Could each P1 be a P2? What would have to be true for a P2 downgrade?
   - **Referee**: final call on each — confirm P1, downgrade to P2, mark false_positive.

   The 3 P1s by dimension:
   - **D1 (correctness)**: `advisor_recommend` doesn't fail-open on `freshness:'unavailable'`. Evidence in `advisor-recommend.ts:161-164`, `advisor-status.ts:151-172`, `daemon-probe.ts:51-60`.
   - **D2 (security)**: `skill_graph_scan` is a public MCP maintenance tool with no caller-authority check. Evidence in `tool-schemas.ts:673-681`, `context-server.ts:919-930`, `tools/index.ts:97-108`, `scan.ts:29-48`.
   - **D3 (traceability)**: Active review invariants not mapped to regression tests (test-coverage gap that masks P1 #1, #2, plus corruption recovery and path-leak findings).

2. **Read iteration files**:
   - `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`
   - `.../iterations/iteration-002.md`
   - `.../iterations/iteration-003.md`
   - `.../iterations/iteration-004.md`

3. **Compile** `review-report.md` at:
   `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/review-report.md`

   **Required structure (9 core sections + embedded Planning Packet):**

   ### 1. Executive Summary
   - Overall verdict: **CONDITIONAL** (or downgraded if Skeptic/Referee finds otherwise).
   - hasAdvisories: true
   - P0=0, P1=3, P2=15 (active counts after dedup + adversarial check; restate post-self-check counts).
   - Review scope summary (4 dimensions, 4 iterations, ~103 files reviewed cumulatively).
   - Headline: the unified advisor runtime is broadly sound (daemon SIGTERM/SIGKILL, plugin loader, compat shim, stale warning propagation all pass). Three P1 release blockers must close: advisor unavailable fail-open, public scan auth boundary, and missing regression coverage for active invariants. Plus 15 P2 advisories spanning observability, doc drift, ADR coverage, and pattern consistency.

   ### 2. Planning Trigger
   `/spec_kit:plan` is REQUIRED. Three P1s active.
   ```json
   {
     "triggered": true,
     "verdict": "CONDITIONAL",
     "hasAdvisories": true,
     "activeFindings": {"P0": 0, "P1": 3, "P2": 15},
     "remediationWorkstreams": [
       "advisor-unavailable-fail-open",
       "public-scan-authority-gating",
       "regression-coverage-for-active-invariants",
       "corruption-recovery-live-path-integration",
       "concurrency-safe-rebuild",
       "diagnostic-path-leak-suppression",
       "checklist-evidence-resolvability",
       "hyphen-vs-underscore-path-drift",
       "feature-catalog-accuracy",
       "playbook-adversarial-coverage",
       "adr-architectural-completeness",
       "scorer-lane-extensibility-pattern",
       "compat-contract-generation",
       "skill-graph-handler-schemas",
       "shared-fixture-consolidation",
       "decision-record-sub-track-split"
     ],
     "specSeed": "Add REQ statements for: (a) advisor unavailable fail-open contract; (b) skill_graph_scan caller-authority requirement; (c) regression-test-coverage invariant. Document the trusted-caller model in spec.md.",
     "planSeed": "Phase 1: 3 P1 closures with regression tests. Phase 2: corruption recovery live-path wiring + concurrency. Phase 3: doc/ADR/diagnostic/path-cleanup batch. Phase 4: pattern consolidation (scorer lanes, compat contracts, response schemas, shared fixtures)."
   }
   ```

   ### 3. Active Finding Registry
   For each of the 18 findings (3 P1 + 15 P2): ID, severity (post-self-check), title, dimension, file:line, evidence excerpt, impact, fix recommendation, disposition (active / downgraded / resolved / false_positive).

   The 18 findings:
   - **P1**: D1-P1-001 (advisor unavailable), D2-P1-001 (public scan auth), D3-P1-001 (test coverage gap)
   - **P2 from D1**: D1-P2-001 (checklist evidence vague), D1-P2-002 (hyphen-vs-underscore drift), D1-P2-003 (strict-validation pending)
   - **P2 from D2**: D2-P2-001 (corruption recovery not in live path), D2-P2-002 (rebuild not concurrency-safe), D2-P2-003 (path leakage in diagnostics)
   - **P2 from D3**: D3-P2-001 (scan authority docs gap), D3-P2-002 (catalog vs implementation disagreement on lane weight), D3-P2-003 (promotion-gate artifact missing)
   - **P2 from D4**: D4-P2-001 (watcher retry boundary not reused), D4-P2-002 (scorer lane add touches too many hand lists), D4-P2-003 (compat contracts duplicated), D4-P2-004 (skill-graph handlers vs advisor handlers schema inconsistency), D4-P2-005 (SQLite fixtures duplicated), D4-P2-006 (decision-record collapses 7 sub-tracks into 1 ADR)

   ### 4. Remediation Workstreams
   - **P0**: none.
   - **P1 (3 — release-blocking)**:
     - P1-A: advisor unavailable fail-open (`advisor-recommend.ts` add `unavailableOutput()` branch + regression).
     - P1-B: public scan auth gating (gate `skill_graph_scan` on trusted caller OR remove from public MCP list + regression).
     - P1-C: regression coverage for active invariants (add tests for unavailable fail-open, scan auth, corruption recovery integration, path leak).
   - **P2 advisories (grouped)**:
     - Live-path integration: D2-P2-001, D2-P2-002.
     - Diagnostics hygiene: D2-P2-003.
     - Documentation drift: D1-P2-001, D1-P2-002, D1-P2-003, D3-P2-001, D3-P2-002, D3-P2-003, D4-P2-006.
     - Pattern consistency: D4-P2-001, D4-P2-002, D4-P2-003, D4-P2-004, D4-P2-005.

   ### 5. Spec Seed
   - REQ-X: advisor unavailable fail-open MUST return empty recommendations + warning, NOT scoring output.
   - REQ-Y: skill_graph_scan MUST require trusted-caller context for mutation; reject untrusted callers.
   - REQ-Z: every active invariant MUST have a corresponding regression test that fails before fix and passes after.
   - Document the trusted-caller model in spec.md (currently implicit).
   - Standardize hyphen/underscore: pick one, update all references.

   ### 6. Plan Seed
   - T1: Add `unavailableOutput()` branch in `advisor-recommend.ts:161`; add regression `tests/handlers/advisor-recommend-unavailable.vitest.ts`.
   - T2: Add `callerContext` parameter to `handleSkillGraphScan()`; gate on `trustedCaller=true`; add regression `tests/handlers/skill-graph-scan-auth.vitest.ts`.
   - T3: Add regression tests for: corruption recovery (live path triggers helper), concurrent rebuild (lease + retry), filesystem path leak suppression (error envelope sanitization).
   - T4: Wire `checkSqliteIntegrity()` into `initDb()` quick_check path; add `runWithBusyRetry` boundary around `rebuildFromSource()`.
   - T5: Sanitize filesystem path leakage in `scan.ts`, `advisor-status.ts`, `generation.ts`, plugin status tool.
   - T6: Documentation cleanup batch (hyphen-vs-underscore, checklist evidence file:line, feature catalog/playbook reconciliation, ADR sub-track split).
   - T7: Pattern consolidation (scorer lane registry, compat-contract single-source, response-envelope schema, shared SQLite fixture).

   ### 7. Traceability Status
   **Core Protocols:**
   - `spec_code`: partial (REQ statements need addition for the 3 P1s).
   - `checklist_evidence`: fail (D1-P2-001 quantified the gap).

   **Overlay Protocols:**
   - `skill_agent`: partial (skill_advisor → advisor agent contracts not fully exposed).
   - `agent_cross_runtime`: partial (Python fallback contract documented in code, not spec).
   - `feature_catalog_code`: fail (D3-P2-002 contradicts catalog claim).
   - `playbook_capability`: partial (corruption / unavailable / public-scan adversarial paths not in playbook).

   ### 8. Deferred Items
   - Strict-validation completion (D1-P2-003): packet-level operator gate, not blocked by review.
   - Test-fixture consolidation (D4-P2-005) is a maintainability item but high-leverage; bundle with shared SQLite fixture work.

   ### 9. Audit Appendix
   - **Convergence summary**: 4 iterations; ratio decay 1.0 → ~0.4 → ~0.3 → low (estimated; final iter-4 had 6 P2 / 0 new P1 = stable convergence). Composite stop score crossed 0.60 at iter-3; legal-stop gates green at iter-4.
   - **Coverage summary**: D1 correctness (26 files), D2 security (23 files), D3 traceability (29 files), D4 maintainability (25 files); ~103 cumulative file reads (with overlap).
   - **Ruled-out claims**:
     - SIGTERM/SIGKILL daemon shutdown is clean (iter-2 confirmed).
     - Plugin loader is static-import safe; SHA-256 cache key is collision-resistant (iter-2).
     - Python compat fallback uses parsers, not dynamic code execution (iter-2).
     - Stale warnings propagate to client envelope (iter-2).
     - Daemon-probe semantics use freshness/PID, not stale lock (iter-2).
   - **Sources reviewed**: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, plus daemon/scorer/handler/compat/plugin runtime files, focused tests, and the bridge.
   - **Cross-reference appendix**: split into Core (spec_code, checklist_evidence) and Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability).

## CONSTRAINTS

- Review target is READ-ONLY.
- Cite findings with exact file:line.
- Adversarial self-check on EACH P1 must explicitly state confirm/downgrade/false_positive with rationale.
- Use ACTUAL on-disk paths.

After writing review-report.md, append a `synthesis_complete` event:

```json
{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":4,"activeP0":0,"activeP1":<post-self-check>,"activeP2":15,"dimensionCoverage":1.0,"verdict":"<final>","releaseReadinessState":"<final>","stopReason":"converged","timestamp":"<ISO_8601>","sessionId":"2026-04-28T15:00:00.000Z","generation":1}
```

GO.
