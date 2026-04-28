---
title: "Feature Specification: Skill-Advisor Release Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Close 3 P1 release blockers and 15 P2 advisories from the 008-skill-graph-daemon-and-advisor-unification deep review: advisor unavailable fail-open, public scan caller-authority gate, missing regression coverage for active invariants."
trigger_phrases:
  - "003-skill-advisor-fail-open"
  - "advisor_recommend unavailable fail-open"
  - "skill_graph_scan caller authority"
  - "skill-advisor regression coverage"
  - "008/008 review remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/003-skill-advisor-fail-open"
    last_updated_at: "2026-04-28T16:13:26Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed skill-advisor remediation"
    next_safe_action: "Keep final validators green"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill-Advisor Release Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source review** | `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/review-report` |
| **Source verdict** | CONDITIONAL (P0=0, P1=3, P2=15 — all 3 P1s adversarially confirmed) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 008/008-skill-graph-daemon-and-advisor-unification deep review surfaced three release-blocker correctness/security/traceability gaps and 15 P2 advisories. The three P1s (all confirmed by Hunter→Skeptic→Referee adversarial self-check):

1. **D1 correctness**: `advisor_recommend` does not fail-open when `freshness === 'unavailable'`. Status corruption / daemon-unavailable states still produce normal scoring output, returning authoritative-looking recommendations from broken inputs.
2. **D2 security**: `skill_graph_scan` is a public MCP maintenance tool with no caller-authority check. Any MCP caller can trigger mutable reindex + generation publication, crossing the trusted-caller boundary for graph authority.
3. **D3 traceability**: Active review invariants are not mapped to regression tests. The two P1 contracts plus corruption-recovery integration and diagnostic-path-leak suppression all lack failing-before / passing-after coverage, so the active findings can regress silently.

### Purpose
Close all three P1s with concrete fixes + regression tests, and absorb the 15 P2 advisories into a single coordinated batch (live-path integration, diagnostics hygiene, documentation drift, pattern consistency).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `unavailableOutput()` branch in `advisor-recommend.ts` parallel to `absentOutput()`.
- Gate `skill_graph_scan` on trusted caller context (or remove from public MCP tool list).
- Add regression tests: unavailable fail-open, untrusted scan rejection, corruption recovery integration, concurrent rebuild serialization, filesystem path leak suppression.
- Wire `checkSqliteIntegrity()` into `initDb()` quick_check path.
- Add `runWithBusyRetry` boundary around `rebuildFromSource()` for concurrency safety.
- Sanitize filesystem path leakage in `scan.ts`, `advisor-status.ts`, `generation.ts`, plugin status output.
- Documentation cleanup: hyphen-vs-underscore path spelling, checklist evidence line anchors, feature catalog accuracy (lane weight 0.10 vs 0.15 reconciliation), playbook adversarial scenarios, ADR sub-track split, missing promotion-gate artifact reference cleanup.
- Pattern consolidation: scorer lane registry, compat-contract single-source, skill-graph response-envelope schema, shared SQLite fixture.

### Out of Scope
- Re-running 008/008 deep-review (the source of these findings is final).
- Strict-validation completion (D1-P2-003): packet-level operator gate, not blocked by review.
- Architectural rewrites of the unified advisor runtime — the runtime is broadly sound.

### Files to Change

| File | Change Type | Source finding |
|------|-------------|----------------|
| `mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Modify | DR-008-D1-P1-001 |
| `mcp_server/handlers/skill-graph/scan.ts` | Modify | DR-008-D2-P1-001 |
| `mcp_server/tools/skill-graph-tools.ts` | Modify | DR-008-D2-P1-001 (caller-context plumbing) |
| `mcp_server/tools/index.ts` | Modify | DR-008-D2-P1-001 (caller-context dispatcher) |
| `mcp_server/skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts` | Create | DR-008-D3-P1-001 |
| `mcp_server/tests/handlers/skill-graph-scan-auth.vitest.ts` | Create | DR-008-D3-P1-001 |
| `mcp_server/tests/skill-graph-corruption-recovery.vitest.ts` | Create | DR-008-D3-P1-001, DR-008-D2-P2-001 |
| `mcp_server/tests/skill-graph-rebuild-concurrency.vitest.ts` | Create | DR-008-D3-P1-001, DR-008-D2-P2-002 |
| `mcp_server/tests/skill-graph-diagnostic-redaction.vitest.ts` | Create | DR-008-D3-P1-001, DR-008-D2-P2-003 |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | DR-008-D2-P2-001 (integrity quick_check at initDb) |
| `mcp_server/skill_advisor/lib/freshness/rebuild-from-source.ts` | Modify | DR-008-D2-P2-002 (busy-retry/lease boundary) |
| `mcp_server/handlers/skill-graph/scan.ts` (diagnostic envelopes) | Modify | DR-008-D2-P2-003 (path redaction) |
| `mcp_server/skill_advisor/handlers/advisor-status.ts` | Modify | DR-008-D2-P2-003 |
| `mcp_server/skill_advisor/lib/freshness/generation.ts` | Modify | DR-008-D2-P2-003 |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | DR-008-D2-P2-003 (plugin status output) |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/spec.md` | Modify | DR-008-D1-P2-002, DR-008-D3-P2-001 (hyphen to underscore + trusted-caller model) |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/checklist.md` | Modify | DR-008-D1-P2-001 (file:line evidence) |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/decision-record.md` | Modify | DR-008-D1-P2-002, DR-008-D4-P2-006 (path spelling + ADR sub-track split) |
| `specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/implementation-summary.md` | Modify | DR-008-D3-P2-003 (gate-bundle artifact reference cleanup) |
| `mcp_server/skill_advisor/lib/scorer/weights-config.ts` OR catalog/summary docs | Modify | DR-008-D3-P2-002 (lane weight 0.10 vs 0.15 reconciliation) |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md` | Modify | DR-008-D3-P2-001 (untrusted scan negative case) |
| `mcp_server/skill_advisor/lib/daemon/watcher.ts` | Modify | DR-008-D4-P2-001 (extract daemon-state mutation helper with shared busy retry) |
| `mcp_server/skill_advisor/lib/scorer/types.ts` + `weights-config.ts` + `lanes/*.ts` + schema | Modify | DR-008-D4-P2-002 (lane registry) |
| `mcp_server/skill_advisor/scripts/skill_advisor.py` + plugin bridge | Modify | DR-008-D4-P2-003 (compat contract single-source) |
| `mcp_server/handlers/skill-graph/{scan,query,status}.ts` | Modify | DR-008-D4-P2-004 (response-envelope schemas) |
| `mcp_server/tests/fixtures/skill-graph-db.ts` | Create | DR-008-D4-P2-005 |
| `mcp_server/tests/{skill-graph-handlers, advisor}/*.vitest.ts` (selected) | Modify | DR-008-D4-P2-005 (migrate to shared fixture) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required (release-blocking)

| ID | Requirement | Acceptance Criteria | Source finding |
|----|-------------|---------------------|----------------|
| REQ-001 | `advisor_recommend` MUST fail-open on `freshness === 'unavailable'`. | New `unavailableOutput()` mirror of `absentOutput()` returns empty recommendations + reason `'advisor_unavailable'` and propagates `errors`; scoring is NOT called. | DR-008-D1-P1-001 |
| REQ-002 | `skill_graph_scan` MUST require trusted caller context. | Untrusted callers receive a typed rejection (no mutation, no generation publish); trusted callers proceed. Either gate on `callerContext.trusted=true` or remove from public MCP tool list. | DR-008-D2-P1-001 |
| REQ-003 | All active invariants MUST have failing-before / passing-after regression tests. | Tests for: REQ-001 unavailable fail-open, REQ-002 trusted/untrusted scan, corruption recovery live path, concurrent rebuild, filesystem path leak suppression — each a vitest file, each fails against unfixed code, each passes after fix. | DR-008-D3-P1-001 |

### P2 — Required (advisories from review)

| ID | Requirement | Source |
|----|-------------|--------|
| REQ-004 | Checklist evidence in 008/008 carries file:line anchors. | DR-008-D1-P2-001 |
| REQ-005 | Hyphen-vs-underscore path drift resolved (pick one, update all). | DR-008-D1-P2-002 |
| REQ-006 | Strict-validation completion either run or kept as explicit operator gate. | DR-008-D1-P2-003 |
| REQ-007 | `checkSqliteIntegrity()` wired into live `initDb()` quick_check. | DR-008-D2-P2-001 |
| REQ-008 | `rebuildFromSource()` runs inside busy-retry / lease boundary. | DR-008-D2-P2-002 |
| REQ-009 | Diagnostic envelopes redact filesystem/process paths. | DR-008-D2-P2-003 |
| REQ-010 | Trusted-caller model documented in spec/ADR; playbook adds untrusted-scan negative case. | DR-008-D3-P2-001 |
| REQ-011 | Lane weight 0.10 vs 0.15 reconciled across runtime + catalog + summary. | DR-008-D3-P2-002 |
| REQ-012 | Promotion-gate artifact reference cleaned (file added or doc rewritten). | DR-008-D3-P2-003 |
| REQ-013 | Daemon-state mutation helper with shared busy retry extracted; consumers migrated. | DR-008-D4-P2-001 |
| REQ-014 | Scorer lane registry replaces hand-maintained lists. | DR-008-D4-P2-002 |
| REQ-015 | Compat contract single-source (TS / Python / plugin schemas align). | DR-008-D4-P2-003 |
| REQ-016 | Skill-graph handlers use shared `SkillGraphResponse` schema + redaction helper. | DR-008-D4-P2-004 |
| REQ-017 | Shared `tests/fixtures/skill-graph-db.ts`; selected test files migrated. | DR-008-D4-P2-005 |
| REQ-018 | Decision record split: keep umbrella ADR-001 + add child ADRs for freshness, schema, scorer, MCP authority, compat, promotion gates. | DR-008-D4-P2-006 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 18 source findings closed or explicitly deferred with sign-off.
- **SC-002**: All 5 new regression test files exit 0 (unavailable fail-open, scan auth, corruption recovery, concurrent rebuild, diagnostic redaction).
- **SC-003**: Existing 008/008 test suite still green (no regression).
- **SC-004**: Strict packet validator passes for `008-skill-graph-daemon-and-advisor-unification` AND for this remediation sub-phase.
- **SC-005**: Source review-report can be re-evaluated and yield verdict PASS (verbal walk-through, not loop re-run).

### Acceptance Scenarios

- **Acceptance Scenario 1**: **Given** advisor freshness is unavailable, **Then** `advisor_recommend` returns empty recommendations, `advisor_unavailable` trust state, propagated errors, and no scorer call.
- **Acceptance Scenario 2**: **Given** an untrusted caller invokes `skill_graph_scan`, **Then** the handler returns `UNTRUSTED_CALLER` and does not mutate the graph or publish a generation.
- **Acceptance Scenario 3**: **Given** the live skill graph database is malformed or rebuilds race, **Then** integrity recovery succeeds and concurrent rebuild attempts serialize.
- **Acceptance Scenario 4**: **Given** diagnostic failures occur, **Then** public scan/status/generation/plugin envelopes redact local filesystem and process paths.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Trusted-caller model wasn't previously documented; introducing it may break expected MCP callers | High | Make untrusted scan a typed rejection (not silent failure); document migration path; add explicit allowlist for known callers. |
| Risk | Lane weight reconciliation could change advisor behavior | Medium | Pick the value the runtime already uses (0.15); update docs to match; verify against existing scoring tests. |
| Risk | Pattern-consolidation refactors (scorer registry, compat schema) touch a lot of files | Medium | Phase 4 is parallelizable; each sub-task is its own commit boundary. |
| Dependency | None blocking — 008/008 deep-review and synthesis complete. | — | — |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- For REQ-002: gate scan on trusted caller, or remove from public MCP tool list entirely? Default: gate, since the operator still needs the ability to scan via local CLI / daemon.
- For REQ-011: pick 0.10 (catalog/summary) or 0.15 (runtime)? Default: 0.15 since runtime ships and tests pass; doc drift is the bug.
<!-- /ANCHOR:questions -->

---

### Related Documents

- **Source review report**: specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/review-report
- **Implementation plan**: local plan document
- **Tasks**: local tasks document
- **Checklist**: local checklist document
