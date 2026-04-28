---
title: "Implementation Summary: Skill-Advisor Release Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Completed the release remediation packet for the 008/008 skill-advisor deep review, closing 3 P1 blockers and 15 P2 advisories with runtime fixes, regression tests, documentation cleanup, and pattern consolidation."
trigger_phrases:
  - "003-skill-advisor-fail-open implementation"
  - "skill-advisor release remediation complete"
  - "advisor unavailable fail-open summary"
  - "008/008 remediation disposition"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open"
    last_updated_at: "2026-04-28T16:13:26Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Remediation complete"
    next_safe_action: "Keep focused regression suite, typecheck/build, and packet validators green before release."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/response-envelope.ts"
      - "specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/decision-record"
    session_dedup:
      fingerprint: "sha256:003-skill-advisor-fail-open-2026-04-28"
      session_id: "003-skill-advisor-fail-open-remediation"
      parent_session_id: "008-skill-graph-daemon-and-advisor-unification-review"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-002 uses a trusted-caller gate rather than removing skill_graph_scan from the MCP surface."
      - "REQ-011 keeps runtime lane weight 0.15 and updates docs/catalogs to match."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-skill-advisor-fail-open |
| **Completed** | 2026-04-28 |
| **Level** | 2 |
| **Source Review** | `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/review-report` |
| **Result** | 18/18 source findings closed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill-advisor release blockers are closed at the runtime boundary instead of only in documentation. Direct recommendation calls now fail open when the graph is unavailable, mutable graph scans require trusted caller context, and the active invariants have regression tests that failed before the fixes and pass after them.

### P1 Runtime Closures

`advisor_recommend` now returns empty recommendations with `advisor_unavailable` trust state when freshness is unavailable, so corrupt or unreachable graph state cannot produce authoritative-looking output. `skill_graph_scan` now rejects untrusted callers with a typed `UNTRUSTED_CALLER` envelope before it can mutate SQLite or publish a generation.

### Recovery, Concurrency, And Diagnostics

The live SQLite path now checks integrity during `initDb()` and recovers malformed graph databases before callers hit broken state. Rebuilds run through a per-path lease and busy-retry boundary, diagnostic envelopes redact local paths, and plugin status output no longer exposes bridge or filesystem internals.

### Documentation And Pattern Consolidation

The 008/008 packet now uses the runtime `skill_advisor` path spelling, carries file:line checklist evidence, records the trusted-caller model, reconciles the `derived_generated` lane weight at 0.15, rewrites the promotion-gate summary around real `advisor_validate` slices, and splits the decision log into the umbrella ADR plus six child ADRs. Runtime patterns were also consolidated through a lane registry, compat contract, shared skill-graph response envelope, daemon mutation helper, and SQLite test fixture.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Modified | Add unavailable fail-open branch before scoring. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts` | Created | Cover unavailable fail-open and no-scorer-call behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/auth/trusted-caller.ts` | Created | Centralize trusted caller validation. |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Modified | Derive trusted caller metadata. |
| `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` | Modified | Thread caller context through dispatch. |
| `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts` | Modified | Pass caller context into skill-graph handlers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts` | Modified | Gate mutation on trusted callers and use shared redacted envelopes. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts` | Created | Cover trusted and untrusted scan paths. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | Modified | Run SQLite integrity quick_check in live DB initialization. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/sqlite-integrity.ts` | Created | Share SQLite integrity checking. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts` | Modified | Serialize rebuild recovery with lease and busy retry. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-corruption-recovery.vitest.ts` | Created | Cover malformed DB recovery on the live path. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-rebuild-concurrency.vitest.ts` | Created | Cover concurrent rebuild serialization. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-diagnostic-redaction.vitest.ts` | Created | Cover path redaction across public diagnostics. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/response-envelope.ts` | Created | Share response envelopes and redaction helpers. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts` | Modified | Use shared response envelope. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/status.ts` | Modified | Use shared response envelope. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Modified | Redact unavailable diagnostic errors. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts` | Modified | Remove lock-path leakage from timeout diagnostics. |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modified | Redact plugin status bridge/path output. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/state-mutation.ts` | Created | Share daemon mutation retry boundary. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modified | Route daemon DB mutations through the helper. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts` | Created | Single source of scorer lane ids, weights, and schema metadata. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts` | Modified | Derive scorer lanes from registry. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts` | Modified | Derive weights and lanes from registry. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Modified | Consume registry-derived lane metadata. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Modified | Derive lane enum from registry. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/contract.ts` | Created | Define shared advisor compatibility contract. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/compat-contract.json` | Created | JSON sidecar consumed by non-TS runtimes. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modified | Read compatibility defaults from JSON sidecar. |
| `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modified | Read compatibility defaults from JSON sidecar. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/skill-graph-db.ts` | Created | Share SQLite graph metadata fixture setup. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/skill-graph-handlers.vitest.ts` | Modified | Use shared SQLite fixture and trusted scan context. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/skill-graph-db.vitest.ts` | Modified | Use shared SQLite fixture. |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/spec.md` | Modified | Document trusted-caller model and runtime path spelling. |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/checklist.md` | Modified | Add resolvable evidence anchors and validation status. |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/decision-record.md` | Modified | Add child ADRs for the remediated sub-tracks. |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/implementation-summary.md` | Modified | Fix lane weight and promotion-gate traceability. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md` | Modified | Add untrusted scan negative case. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/01-five-lane-fusion.md` | Modified | Align derived_generated lane weight at 0.15. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/06-weights-config.md` | Modified | Document registry-derived lane weights. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 closed the three P1s with test-first regressions. The unavailable recommendation test failed before `unavailableOutput()` existed, the scan auth test failed before the trusted-caller gate, and the remaining regression scaffolds captured corruption recovery, concurrent rebuilds, and diagnostic path leakage before the Phase 2 and Phase 3 fixes.

Phase 2 hardened live-path recovery and rebuild concurrency. `initDb()` now checks SQLite integrity before opening the authoritative graph, and `rebuildFromSource()` serializes recovery work so concurrent callers do not race over the same database.

Phase 3 cleaned the operator-facing and diagnostic surfaces. Public errors redact filesystem/process paths, root docs now match the underscore runtime path, strict validation is recorded for 008/008, feature catalog weights match runtime behavior, and the trusted-caller model is documented with a manual negative case.

Phase 4 reduced drift risk in repeated patterns. Lane metadata, compatibility defaults, daemon mutation behavior, response envelopes, and graph DB fixtures now have single shared homes instead of hand-maintained parallel lists.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate `skill_graph_scan` instead of removing it from the tool surface. | Operators and daemon flows still need scan access; a trusted-caller boundary preserves that path while rejecting public mutation attempts. |
| Treat `freshness === 'unavailable'` like a fail-open abstain state. | Unavailable is emitted for broken status/graph states, so normal scoring would misrepresent confidence. |
| Keep `derived_generated` at the runtime value of 0.15. | Tests and shipped scoring already use 0.15; the catalog and summary were stale. |
| Rewrite the promotion-gate documentation around `advisor_validate` slices. | The claimed `lib/promotion/gate-bundle.ts` artifact did not exist; the real traceability surface is the validation slices. |
| Use shared registries/contracts rather than fixture-only drift checks. | Runtime derivation prevents the next lane or compatibility field from requiring scattered manual updates. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts` before fix | FAIL, exit 1 as expected; unavailable status still produced recommendations. |
| `npx vitest run skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts` after fix | PASS, exit 0. |
| `npx vitest run tests/handlers/skill-graph-scan-auth.vitest.ts` before fix | FAIL, exit 1 as expected; untrusted scan could mutate. |
| `npx vitest run tests/handlers/skill-graph-scan-auth.vitest.ts` after fix | PASS, exit 0. |
| `npx vitest run tests/skill-graph-corruption-recovery.vitest.ts tests/skill-graph-rebuild-concurrency.vitest.ts tests/skill-graph-diagnostic-redaction.vitest.ts` before fixes | FAIL, exit 1 as expected; malformed DB, concurrent rebuild, and path leakage paths were exposed. |
| `npx vitest run tests/skill-graph-corruption-recovery.vitest.ts tests/skill-graph-rebuild-concurrency.vitest.ts tests/skill-graph-diagnostic-redaction.vitest.ts tests/handlers/skill-graph-scan-auth.vitest.ts skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts` | PASS, exit 0. |
| `npx vitest run tests/skill-graph-corruption-recovery.vitest.ts tests/skill-graph-rebuild-concurrency.vitest.ts tests/skill-graph-diagnostic-redaction.vitest.ts tests/handlers/skill-graph-scan-auth.vitest.ts skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts tests/skill-graph-handlers.vitest.ts tests/skill-graph-schema.vitest.ts skill_advisor/tests/skill-graph-db.vitest.ts skill_advisor/tests/scorer/native-scorer.vitest.ts tests/spec-kit-skill-advisor-plugin.vitest.ts skill_advisor/tests/daemon-freshness-foundation.vitest.ts` | PASS, exit 0; 11 files, 87 tests. |
| `python3 -m pytest skill_advisor/tests/python/test_skill_advisor.py` | PASS, exit 0; 4 tests. |
| `npm run typecheck` | PASS, exit 0. |
| `npm run build` | PASS, exit 0. |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification --strict` | PASS, exit 0. |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open --strict` | PASS, exit 0. |
### Per-Finding Disposition

| Finding | Severity | Disposition | Evidence |
|---------|----------|-------------|----------|
| DR-008-D1-P1-001 | P1 | Closed | `advisor-recommend.ts:116`, `advisor-recommend.ts:181`; unavailable regression exit 0. |
| DR-008-D2-P1-001 | P1 | Closed | `trusted-caller.ts:20`, `scan.ts:34`, `tools/index.ts:104`, `tools/skill-graph-tools.ts:59`; scan auth regression exit 0. |
| DR-008-D3-P1-001 | P1 | Closed | Five new regression files cover unavailable, scan auth, corruption recovery, rebuild concurrency, and diagnostic redaction; focused command exit 0. |
| DR-008-D1-P2-001 | P2 | Closed | 008/008 checklist completed items now cite file:line evidence. |
| DR-008-D1-P2-002 | P2 | Closed | 008/008 spec, decision log, and implementation summary use `mcp_server/skill_advisor`. |
| DR-008-D1-P2-003 | P2 | Closed | 008/008 strict validator exits 0. |
| DR-008-D2-P2-001 | P2 | Closed | `skill-graph-db.ts:203`; corruption recovery regression exit 0. |
| DR-008-D2-P2-002 | P2 | Closed | `rebuild-from-source.ts:30`, `rebuild-from-source.ts:57`; rebuild concurrency regression exit 0. |
| DR-008-D2-P2-003 | P2 | Closed | `response-envelope.ts:10`, `scan.ts:45`, `advisor-status.ts:153`, `generation.ts:84`, `spec-kit-skill-advisor.js:575`; redaction regression exit 0. |
| DR-008-D3-P2-001 | P2 | Closed | 008/008 spec documents trusted callers; playbook adds untrusted scan negative case. |
| DR-008-D3-P2-002 | P2 | Closed | `lane-registry.ts:9`, feature catalog, and 008/008 summary all use `derived_generated` weight 0.15. |
| DR-008-D3-P2-003 | P2 | Closed | 008/008 summary now references real `advisor_validate` slices instead of a missing promotion bundle file. |
| DR-008-D4-P2-001 | P2 | Closed | `state-mutation.ts:17`, `watcher.ts:237`, `watcher.ts:252`, `watcher.ts:263`; daemon foundation test exit 0. |
| DR-008-D4-P2-002 | P2 | Closed | `lane-registry.ts:5`, `types.ts:6`, `weights-config.ts:7`, `fusion.ts:55`, `advisor-tool-schemas.ts:6`; typecheck exit 0. |
| DR-008-D4-P2-003 | P2 | Closed | `contract.ts:5`, `compat-contract.json:1`, `skill_advisor.py:178`, `spec-kit-skill-advisor-bridge.mjs:7`; pytest exit 0. |
| DR-008-D4-P2-004 | P2 | Closed | `response-envelope.ts:34`, `scan.ts:12`, `query.ts:9`, `status.ts:11`; skill-graph handler/schema tests exit 0. |
| DR-008-D4-P2-005 | P2 | Closed | `fixtures/skill-graph-db.ts:8`, `skill-graph-handlers.vitest.ts:9`, `skill-graph-db.vitest.ts:10`; fixture-focused tests exit 0. |
| DR-008-D4-P2-006 | P2 | Closed | 008/008 decision log contains ADR-001 umbrella plus ADR-002 through ADR-007 child decisions. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

None identified.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
