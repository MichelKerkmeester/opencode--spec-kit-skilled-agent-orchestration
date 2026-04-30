---
title: "Spec: Half-Auto Upgrades"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Tier C remediation for four half-automated surfaces: Copilot freshness, Codex timeout fallback, feature-flag defaults, and advisor rebuild."
trigger_phrases:
  - "034-half-auto-upgrades"
  - "Copilot freshness"
  - "Codex cold-start"
  - "feature-flag table"
  - "advisor rebuild"
  - "half-auto upgrades"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: Half-Auto Upgrades

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
| **Depends On** | `031-doc-truth-pass`, `032-code-graph-watcher-retraction`, `033-memory-retention-sweep` |
| **Related** | `012-automation-self-management-deep-research`, `013-automation-reality-supplemental-research` |
| **Mode** | Hybrid code and documentation remediation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 013 identified four Tier C surfaces where automation was easy to overstate:

1. Copilot advisor refresh is next-prompt only, not current-prompt injection. [EVIDENCE: `../013-automation-reality-supplemental-research/research/research-report.md:155-168`]
2. Codex timeout fallback served stale cold-start context without a machine-visible marker. [EVIDENCE: `../012-automation-self-management-deep-research/research/research-report.md:13`; `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:174-180` before this packet]
3. Feature-flag defaults hid opt-in OFF behavior for save reconsolidation, post-insert enrichment, quality auto-fix, watcher, and local reranker. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:140-152`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:348-366`]
4. `advisor_status` detected stale advisor state but had no explicit repair tool. [EVIDENCE: `../013-automation-reality-supplemental-research/research/research-report.md:101`]

### Purpose

Upgrade each surface to either fully automated behavior or a mechanically honest documented contract without broadening the packet beyond the four requested sub-tasks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Copilot next-prompt wording in the CLAUDE, AGENTS, SKILL, skill-advisor-hook, hook_system, and Copilot README docs
- Copilot custom-instructions managed block header
- Codex timeout fallback marker, warning, smoke helper, docs, and test
- Feature flags reference table in the MCP server ENV reference
- `advisor_status` diagnostic-only docs and new explicit `advisor_rebuild` MCP tool
- Packet-local docs under this `034-half-auto-upgrades/` folder

### Out of Scope

- Changing Copilot transport behavior to current-prompt injection
- Changing search or memory feature-flag runtime defaults
- Auto-repair inside `advisor_status`
- Packet 035 matrix execution
- Committing changes
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Make Copilot next-prompt freshness mechanically visible. | Docs say "NEXT-PROMPT freshness; current prompt sees PRIOR turn's brief", and the managed block header includes `nextPromptFreshness: true`. |
| REQ-002 | Mark Codex timeout fallback as stale. | Timeout fallback returns `{"stale":true,"reason":"timeout-fallback"}` and logs a structured warning. |
| REQ-003 | Add Codex cold-start smoke helper. | `hooks/codex/lib/freshness-smoke-check.ts` returns `{ fresh, lastUpdateAt, latencyMs }`. |
| REQ-004 | Generate feature-flag default-state table. | The ENV reference includes columns `flag name`, `default state (ON/OFF)`, `governing env var`, `which automation it gates`, and `added in version`. |
| REQ-005 | Keep `advisor_status` diagnostic-only. | JSDoc and docs say it does not rebuild. |
| REQ-006 | Add explicit advisor repair command. | `advisor_rebuild({ force?: boolean })` is registered in schemas and dispatcher. |
| REQ-007 | Add focused tests. | `hooks-codex-freshness.vitest.ts` and `advisor-rebuild.vitest.ts` pass. |

### Acceptance Scenarios

- **SCN-001**: **Given** Copilot refreshes instructions, when the next prompt starts, then the managed block tells the operator it is next-prompt fresh.
- **SCN-002**: **Given** Codex advisor generation times out, when hook output is returned, then the stale fallback marker is visible to machines and operators.
- **SCN-003**: **Given** an operator reads feature defaults, when a behavior is opt-in, then the table says default OFF.
- **SCN-004**: **Given** `advisor_status` reports stale, when the operator wants repair, then `advisor_rebuild` is the named command.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four requested sub-tasks are implemented without expanding behavior outside scope.
- **SC-002**: New tests pass.
- **SC-003**: TypeScript build succeeds.
- **SC-004**: Strict packet validator exits 0.
- **SC-005**: Packet continuity reaches `completion_pct: 100`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Copilot wording could imply current-prompt freshness | Use the exact NEXT-PROMPT / PRIOR turn phrase in all scoped docs |
| Risk | Codex timeout marker could break hook output consumers | Preserve `hookSpecificOutput.additionalContext`; append a marker line only |
| Risk | Feature flag docs can drift | Cite `search-flags.ts` as generation source and avoid changing runtime defaults |
| Risk | Advisor rebuild could silently auto-repair status | Keep `advisor_status` read-only and require explicit `advisor_rebuild` call |
| Dependency | 031, 032, 033 packets | Listed in `graph-metadata.json` `manual.depends_on` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Timeout fallback must fail open and never throw because warning emission fails.
- **NFR-R02**: `advisor_rebuild` must skip live status unless `force:true` is passed.

### Maintainability
- **NFR-M01**: Follow existing advisor tool schema and dispatcher patterns.
- **NFR-M02**: Keep feature-flag docs generated from the existing source file, with no runtime default changes.

### Security
- **NFR-S01**: Do not log raw prompt text in Codex timeout warnings.
- **NFR-S02**: Do not expose user-level config secrets in docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Codex timeout warning sink throws: ignore the warning failure and still return fallback output.
- `advisor_status` is live but operator wants a rebuild: require `advisor_rebuild({"force":true})`.
- Copilot workspace differs from the managed block workspace: existing managed-block freshness contract tells Copilot to ignore the block when workspace differs.
- Feature flag uses a non-boolean mode: document ON/OFF by shipped automation state and name the mode in the automation column.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Files touched | Medium | Multiple docs plus two small runtime additions |
| Behavioral risk | Medium | Codex hook output and advisor MCP registry changed |
| Verification | Medium | New tests, build, and strict validator required |
| Overall | Level 2 | Coordinated code/docs changes with focused blast radius |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No blocking questions. The packet follows the user-provided Tier C decision to keep `advisor_status` diagnostic-only and add an explicit `advisor_rebuild` command.
<!-- /ANCHOR:questions -->
