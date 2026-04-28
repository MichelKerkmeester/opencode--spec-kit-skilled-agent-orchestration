# Deep Review Report - 008 Skill Graph Daemon and Advisor Unification

## 1. Executive Summary

Overall verdict: **CONDITIONAL**.

hasAdvisories: true.

Post-self-check active counts: P0=0, P1=3, P2=15.

Review scope: 4 dimensions over 4 iterations, with 103 cumulative file reads recorded across correctness (26), security (23), traceability (29), and maintainability (25). The loop converged early at iteration 4 after all dimensions were covered and no new P0/P1 appeared in the stabilization pass.

Headline: the unified advisor runtime is broadly sound. Daemon SIGTERM/SIGKILL shutdown, plugin loader safety, Python compatibility fallback, stale warning propagation, and daemon-probe freshness semantics all passed review. Three P1 release blockers remain: direct `advisor_recommend` unavailable fail-open behavior, public `skill_graph_scan` authority gating, and missing regression coverage for active invariants. Fifteen P2 advisories remain across live-path recovery, diagnostics, documentation drift, ADR coverage, and pattern consistency.

### Adversarial P1 Self-Check

**DR-008-D1-P1-001 - advisor unavailable fail-open**

- Hunter: confirmed. `readAdvisorStatus()` catches failures and returns `freshness: 'unavailable'` with errors at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts:151`; the direct recommendation path only fails open for `absent` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:161`; it then scores at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:195`. The compat probe treats this same freshness as unavailable through `AVAILABLE_FRESHNESS.has(status.freshness)` at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts:53`.
- Skeptic: a P2 downgrade would require unavailable to be intentionally usable like stale, or for the public contract to say scoring during unavailable states is acceptable. The evidence points the other way: unavailable is produced for status failures and the compat probe marks it unavailable.
- Referee: **confirm P1**. This can return authoritative-looking recommendations during corrupt/unavailable graph states.

**DR-008-D2-P1-001 - public scan authority**

- Hunter: confirmed. `skill_graph_scan` is exposed as a public maintenance tool at `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:673` with only `skillsRoot` at line 679. The server builds `callerContext` at `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:925` and passes it through `runWithCallerContext()` at line 1010, but the generic dispatcher calls `dispatcher.handleTool(name, validatedArgs)` at `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:107`. The skill-graph dispatcher routes scan directly at `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:53`, and the handler indexes plus publishes generation at `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40` and line 42.
- Skeptic: a P2 downgrade would require the MCP surface itself to be trusted-only, or for scan to be read-only. Neither is true in the code reviewed: it mutates SQLite and publishes a live generation.
- Referee: **confirm P1**. This is a privilege-boundary failure for a mutable maintenance operation.

**DR-008-D3-P1-001 - active invariants lack regression tests**

- Hunter: confirmed. Existing advisor tests cover disabled fail-open at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:238`, absent fail-open at line 249, and stale warnings at line 338, but not direct unavailable fail-open. `skill_graph_scan` tests assert direct routing at `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-schema.vitest.ts:53` and pass-through at line 133, but not untrusted rejection. Daemon tests cover busy retry at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:187` and lease exclusivity at line 307, but not concurrent corruption rebuild. Diagnostic tests check prompt redaction at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts:97`, not filesystem path redaction.
- Skeptic: a P2 downgrade would require only one or two low-risk coverage gaps. Here the missing tests map directly to both active P1s plus the corruption recovery and path-leak hardening findings.
- Referee: **confirm P1**. Regression coverage is itself release-blocking because the active invariants are unprotected.

## 2. Planning Trigger

`/spec_kit:plan` is REQUIRED. Three P1 findings remain active.

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

## 3. Active Finding Registry

| ID | Sev | Title | Dim | File:line | Evidence excerpt | Impact | Fix | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DR-008-D1-P1-001 | P1 | `advisor_recommend` does not fail open on unavailable freshness | D1 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:161` | `if (status.freshness === 'absent')` | Direct MCP callers can get normal recommendations during corrupt/unavailable graph states. | Add `unavailableOutput()` before scoring; assert no scorer call and warning propagation. | active, confirmed P1 |
| DR-008-D2-P1-001 | P1 | `skill_graph_scan` public MCP tool lacks caller-authority gate | D2 | `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40` | `const scanResult = indexSkillMetadata(skillsRoot);` | Any MCP tool caller can trigger mutable reindex and generation publication. | Gate on trusted caller context or remove scan from public tools; add trusted/untrusted tests. | active, confirmed P1 |
| DR-008-D3-P1-001 | P1 | Active review invariants are not mapped to regression tests | D3 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:238` | Disabled, absent, and stale tests exist; unavailable fail-open is absent. | Both active P1s and key P2 hardening paths can regress silently. | Add targeted failing-before/passing-after tests for unavailable, scan auth, corruption rebuild, and path redaction. | active, confirmed P1 |
| DR-008-D1-P2-001 | P2 | Checklist evidence is vague | D1 | `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/checklist.md:43` | Evidence cites `implementation-summary.md` without a line anchor. | `checklist_evidence` protocol cannot resolve claims precisely. | Replace completed checklist evidence with concrete `file:line` citations. | active |
| DR-008-D1-P2-002 | P2 | Hyphen-vs-underscore runtime path drift | D1 | `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/spec.md:91` | Docs cite `mcp_server/skill-advisor/**`; runtime uses `mcp_server/skill_advisor/**`. | Readers and validators can chase stale paths. | Standardize path spelling and update all root docs. | active |
| DR-008-D1-P2-003 | P2 | Strict-validation completion remains pending | D1 | `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/tasks.md:76` | `T052 Parent strict validation exits 0...` remains unchecked. | Packet status remains visibly incomplete. | Run and record final strict validation, or keep as explicit operator gate. | active |
| DR-008-D2-P2-001 | P2 | Corruption recovery is not wired into live DB open/query paths | D2 | `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:181` | `initDb()` opens the DB without `PRAGMA quick_check`. | Corruption helper exists but is not proactively used by authoritative paths. | Wire `checkSqliteIntegrity()` into `initDb()` or daemon recovery. | active |
| DR-008-D2-P2-002 | P2 | Rebuild helper is not concurrency-safe | D2 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts:61` | Integrity check, rename/remove, and indexing are unguarded. | Concurrent recovery attempts can race over the same DB file. | Add lease/busy-retry/compare-and-swap boundary around rebuild. | active |
| DR-008-D2-P2-003 | P2 | Diagnostics leak filesystem/process paths | D2 | `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:36` | Escape error includes resolved path and workspace cwd. | External diagnostics expose local filesystem layout. | Sanitize scan/status/generation/plugin diagnostic envelopes. | active |
| DR-008-D3-P2-001 | P2 | Public scan authority docs gap | D3 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md:50` | Playbook tells operators to call `skill_graph_scan({})` with no negative auth case. | Trusted-caller model remains implicit. | Add spec/ADR requirement and manual negative test for untrusted scan rejection. | active |
| DR-008-D3-P2-002 | P2 | Feature catalog disagrees with runtime lane weight | D3 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:11` | Runtime sets `DERIVED_GENERATED_WEIGHT = 0.15`; docs claim 0.10. | REQ-004 traceability is inconsistent. | Pick 0.10 or 0.15 and align summary, catalog, and code. | active |
| DR-008-D3-P2-003 | P2 | Promotion-gate artifact is missing | D3 | `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/implementation-summary.md:129` | Summary claims `lib/promotion/gate-bundle.ts`; file is absent. | Promotion-gate traceability points to a non-existent artifact. | Add the artifact or rewrite docs around `advisor_validate` slices. | active |
| DR-008-D4-P2-001 | P2 | Watcher retry boundary is not reused | D4 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:239` | Quarantine writes open DB directly while retry helper protects only reindex. | Future SQLite mutation paths rely on convention. | Extract daemon-state mutation helper with shared busy retry. | active |
| DR-008-D4-P2-002 | P2 | Scorer lane addition touches too many hand lists | D4 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts:7` | Lane union, score shape, weights, fusion, and schema duplicate lane ids. | Extending scorer lanes is fragile. | Create typed lane descriptor registry and derive lists from it. | active |
| DR-008-D4-P2-003 | P2 | Compat contracts are duplicated | D4 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:91` | Python embeds a separate Node bridge contract. | New runtime adapters may drift from TS/plugin envelopes. | Add shared compat schema or fixture-driven contract tests. | active |
| DR-008-D4-P2-004 | P2 | Skill-graph handlers use inconsistent response schemas | D4 | `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:65` | Local `okResponse()`/`errorResponse()` helpers repeat envelope logic. | Redaction and response policy remain harder to centralize. | Add shared `SkillGraphResponse` schemas and helper. | active |
| DR-008-D4-P2-005 | P2 | SQLite fixtures are duplicated | D4 | `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts:11` | Second local `writeGraphMetadata()` duplicates advisor DB tests. | Schema fixture updates can miss one suite. | Add shared skill-graph DB fixture helper and migrate both suites. | active |
| DR-008-D4-P2-006 | P2 | Decision record collapses seven sub-tracks into one ADR | D4 | `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/decision-record.md:27` | Only `ADR-001: Unified Advisor Architecture` exists. | Maintainers lack decision-level rationale for each architectural track. | Keep umbrella ADR and add child ADRs for freshness, schema, scorer, MCP authority, compat, and promotion gates. | active |

## 4. Remediation Workstreams

P0: none.

P1 release-blocking:

- P1-A: advisor unavailable fail-open. Add `unavailableOutput()` in `advisor-recommend.ts` before scoring and cover it with `tests/handlers/advisor-recommend-unavailable.vitest.ts`.
- P1-B: public scan auth gating. Gate `skill_graph_scan` on trusted caller context or remove it from the public MCP list, then add trusted/untrusted regressions.
- P1-C: regression coverage for active invariants. Cover unavailable fail-open, scan auth, corruption recovery integration, concurrent rebuild, and diagnostic path redaction.

P2 advisories:

- Live-path integration: DR-008-D2-P2-001, DR-008-D2-P2-002.
- Diagnostics hygiene: DR-008-D2-P2-003.
- Documentation drift: DR-008-D1-P2-001, DR-008-D1-P2-002, DR-008-D1-P2-003, DR-008-D3-P2-001, DR-008-D3-P2-002, DR-008-D3-P2-003, DR-008-D4-P2-006.
- Pattern consistency: DR-008-D4-P2-001, DR-008-D4-P2-002, DR-008-D4-P2-003, DR-008-D4-P2-004, DR-008-D4-P2-005.

## 5. Spec Seed

- REQ-X: advisor unavailable fail-open MUST return empty recommendations plus warning/error reason, not normal scoring output.
- REQ-Y: `skill_graph_scan` MUST require trusted-caller context for mutation and reject untrusted callers.
- REQ-Z: every active invariant MUST have a regression test that fails before the fix and passes after.
- Document the trusted-caller model in `spec.md`; it is currently implicit.
- Standardize hyphen/underscore path spelling; pick one and update all references.

## 6. Plan Seed

- T1: Add `unavailableOutput()` branch in `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:161`; add regression `tests/handlers/advisor-recommend-unavailable.vitest.ts`.
- T2: Add `callerContext` or `requireTrustedCaller()` boundary to `handleSkillGraphScan()`; gate on `trustedCaller=true`; add regression `tests/handlers/skill-graph-scan-auth.vitest.ts`.
- T3: Add regression tests for corruption recovery live-path triggering, concurrent rebuild serialization, and filesystem path leak suppression.
- T4: Wire `checkSqliteIntegrity()` into the live `initDb()`/daemon recovery path; add `runWithBusyRetry` or lease protection around `rebuildFromSource()`.
- T5: Sanitize filesystem path leakage in `scan.ts`, `advisor-status.ts`, `generation.ts`, and plugin status output.
- T6: Run a documentation cleanup batch for hyphen-vs-underscore paths, checklist evidence line anchors, feature catalog/playbook reconciliation, and ADR sub-track split.
- T7: Consolidate patterns through scorer lane registry, compat-contract single source, skill-graph response envelope schema, and shared SQLite fixture.

## 7. Traceability Status

Core protocols:

- `spec_code`: partial. REQ statements need additions for the three P1 contracts.
- `checklist_evidence`: fail. DR-008-D1-P2-001 quantified broad evidence citations without file-line anchors.

Overlay protocols:

- `skill_agent`: partial. Skill advisor to advisor-agent contracts are present in runtime, but not fully exposed in the spec docs.
- `agent_cross_runtime`: partial. Python fallback and plugin compatibility contracts are documented in code and README surfaces, not as one spec-level contract.
- `feature_catalog_code`: fail. DR-008-D3-P2-002 shows catalog/runtime disagreement on `derived_generated` lane weight.
- `playbook_capability`: partial. Corruption, unavailable, and public scan adversarial paths are not all covered as negative tests.

## 8. Deferred Items

- Strict-validation completion (DR-008-D1-P2-003) is a packet-level operator gate; it remains visible but does not change the P1 release decision.
- Test-fixture consolidation (DR-008-D4-P2-005) is maintainability-only, but high leverage. Bundle it with the shared SQLite fixture work.

## 9. Audit Appendix

Convergence summary: 4 iterations of 7, converged early. New-findings ratio decayed from 1.0 in iteration 1 to 1.0 in iteration 2, 0.5 in iteration 3, and 0.3077 in iteration 4. Composite stop score crossed the configured threshold by the stabilization pass; all legal stop gates were green at iteration 4.

Coverage summary: D1 correctness (26 files), D2 security (23 files), D3 traceability (29 files), D4 maintainability (25 files), for 103 cumulative file reads with overlap.

Ruled-out claims:

- SIGTERM/SIGKILL daemon shutdown is clean.
- Plugin loader is static-import safe; SHA-256 cache key is collision-resistant.
- Python compatibility fallback uses parsers, not dynamic code execution.
- Stale warnings propagate to client envelopes.
- Daemon-probe semantics use freshness/PID, not stale lock alone.

Sources reviewed: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, daemon/scorer/handler/compat/plugin runtime files, focused tests, and the plugin bridge.

Cross-reference appendix:

- Core: `spec_code`, `checklist_evidence`.
- Overlay: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

