---
title: "...ec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/spec]"
description: "Completed Phase 027 implementation for skill-graph freshness, derived metadata, native advisor scoring, MCP advisor tools, compatibility shims, and promotion gates."
trigger_phrases:
  - "026/009/002 skill graph daemon"
  - "advisor unification"
  - "native advisor"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification"
    last_updated_at: "2026-04-28T15:30:03Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Shipped implementation preserved; strict validation follow-up still pending"
    next_safe_action: "Keep validation green"
    completion_pct: 95
packet_level: 3
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 027 - Skill Graph Daemon and Advisor Unification

---

## EXECUTIVE SUMMARY

Phase 027 unified the skill-advisor subsystem around a live skill graph, derived metadata, native TypeScript scoring, MCP tools, compatibility shims, and promotion gates. The completed implementation preserves legacy advisor entrypoints while routing the durable implementation through the system-spec-kit MCP server.

**Key Decisions**: chokidar watcher plus hash-aware SQLite indexer; self-contained `mcp_server/skill_advisor/` package; five-lane analytical fusion; workspace-scoped single-writer lease; trusted-caller gating for mutable maintenance tools; additive schema migration; semantic lane shadow-only until promotion gates pass.

**Critical Dependencies**: Phase 027 children 001 through 007, advisor test suites, and strict packet validation.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 architecture |
| **Status** | Complete |
| **Created** | 2026-04-20 |
| **Branch** | `009-hook-parity` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../007-skill-advisor-hook-surface/spec.md` |
| **Successor** | `../../009-hook-parity/001-hook-parity-remediation/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The legacy skill-advisor stack depended on manually refreshed graph files, hand-maintained trigger phrases, fixed Python scoring, and split ownership between Python scripts and the system-spec-kit MCP server. Those constraints made routing stale, hard to observe, and difficult to evolve.

### Purpose

Ship a unified advisor architecture where skill graph freshness, derived metadata, native scoring, MCP tools, compatibility bridges, and promotion gates live under the same operational contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Skill-graph daemon, freshness states, and single-writer lease.
- Derived metadata extraction, lifecycle normalization, and schema v2 additive migration.
- Native TypeScript advisor scoring with five-lane analytical fusion.
- MCP advisor tools: `advisor_recommend`, `advisor_status`, and `advisor_validate`.
- Python and plugin compatibility shims.
- Promotion gates for learned and semantic lanes.
- Parent and child packet validation evidence.

### Out of Scope

- Live semantic scoring before promotion gates pass.
- New standalone MCP server registration for advisor logic.
- Removing the legacy Python command surface before compatibility is proven.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/**` | Modify | Native advisor implementation, daemon, tools, handlers, and tests. |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modify | Compatibility shim for legacy callers. |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modify | Runtime adapter for native advisor routing. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/**` | Modify | Phase 027 packet evidence and strict validation shape. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The graph daemon must refresh advisor graph state without manual rebuilds. | File changes produce generation-tagged freshness updates. |
| REQ-002 | Concurrent runtimes must avoid multiple SQLite writers. | Workspace-scoped single-writer lease is enforced. |
| REQ-003 | Native advisor behavior must preserve legacy-safe decisions. | Python-correct corpus decisions and gold-none safety are preserved. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Derived metadata must stay separate from author-authored intent. | Trust lanes distinguish explicit author signals from generated signals. |
| REQ-005 | Schema migration must be additive and reversible. | v1 readers remain valid and rollback strips only derived additions. |
| REQ-006 | Advisor tools must expose recommendation, status, and validation surfaces. | MCP handlers register the three tool contracts. |
| REQ-007 | Legacy scripts and plugins must keep working. | Compatibility shims route to native advisor when available and fall back safely. |
| REQ-008 | Promotion gates must guard learned and semantic live influence. | Semantic weight remains 0.00 until accuracy, safety, latency, and shadow-cycle gates pass. |
| REQ-011 | Public mutable skill-graph maintenance tools must require trusted caller context. | `skill_graph_scan` rejects untrusted callers with a typed envelope before indexing or publishing generation metadata. |

### P2 - Should complete where in scope

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Operator documentation must name current routing and recovery paths. | Implementation summary and decisions record shipped state and constraints. |
| REQ-010 | Parent and child docs must pass strict validation. | Non-recursive strict validation exits 0 for the parent packet. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a changed skill metadata file, **When** the daemon processes it, **Then** advisor graph freshness updates without manual rebuild.
- **SC-002**: **Given** two runtime sessions, **When** both can access the workspace, **Then** one writer owns the lease and readers remain non-blocking.
- **SC-003**: **Given** derived keyword extraction, **When** generated signals enter scoring, **Then** they remain capped in the generated trust lane.
- **SC-004**: **Given** the corpus validation suite, **When** native scoring runs, **Then** Python-correct decisions are preserved and accuracy improves over the baseline.
- **SC-005**: **Given** legacy CLI or plugin callers, **When** advisor routing runs, **Then** the compatibility path returns a valid recommendation or safe fallback.
- **SC-006**: **Given** semantic or learned candidate weights, **When** promotion is evaluated, **Then** promotion requires the full gate bundle and shadow-cycle evidence.
- **SC-007**: **Given** the Phase 027 packet, **When** strict validation runs, **Then** root documentation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SQLite graph consistency | Bad freshness state can misroute advisor calls. | Single-writer lease and generation-tagged updates. |
| Risk | Derived keywords can overfit noisy skill text. | False positives or keyword stuffing could increase. | Trust-lane caps, anti-stuffing checks, and gold-none gates. |
| Risk | Native scorer migration can break legacy callers. | Hook and CLI compatibility regressions. | Compatibility shims plus corpus and handler tests. |
| Constraint | Semantic lane latency is not proven for hot path. | Prompt-time latency regression. | Keep semantic live weight at 0.00 until promotion gates pass. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Daemon idle CPU remains at or below the release budget and RSS remains below the documented ceiling.
- **NFR-P02**: Deterministic advisor scoring stays within the prompt-hook latency budget.

### Security

- **NFR-S01**: Derived metadata is sanitized before it becomes advisor-visible.
- **NFR-S02**: Compatibility shims must not execute untrusted skill content.
- **NFR-S03**: Public MCP callers are untrusted by default for mutable maintenance operations; trusted context is transport-provided, not accepted from tool arguments.

### Reliability

- **NFR-R01**: Graph refresh failures degrade to stale or unavailable states instead of corrupting advisor output.
- **NFR-R02**: Rollback preserves author-authored metadata.

---

## 8. EDGE CASES

### Data Boundaries

- Mixed v1 and v2 metadata must remain readable during migration.
- Archived and future skills stay indexed for history but are excluded from normal routing.

### Error Scenarios

- SQLite busy states must back off and requeue safely.
- Malformed skill metadata must quarantine only the affected skill.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Daemon, metadata, scorer, tools, shims, and gates. |
| Risk | 21/25 | Runtime routing and advisor correctness. |
| Research | 19/20 | Deep research plus follow-up synthesis. |
| Multi-Agent | 9/15 | Multiple child packets and review passes. |
| Coordination | 14/15 | Parent plus seven children and compatibility surfaces. |
| **Total** | **86/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Daemon writes stale or partial graph state. | High | Medium | Transactional writes and generation freshness. |
| R-002 | Generated keywords dominate explicit intent. | High | Medium | Lane separation and caps. |
| R-003 | Native scorer regresses known-correct Python decisions. | High | Low | Regression-protection parity interpretation. |

---

## 11. USER STORIES

### US-001: Fresh Advisor Graph (Priority: P1)

**As an** operator, **I want** advisor graph state to update after skill metadata changes, **so that** routing does not depend on a forgotten manual rebuild.

**Acceptance Criteria**:
1. Given a watched skill file changes, When the daemon processes the event, Then advisor status reports a fresh generation.

### US-002: Safe Native Advisor (Priority: P1)

**As a** runtime user, **I want** native advisor scoring to preserve safe legacy behavior, **so that** migration improves accuracy without surprise regressions.

**Acceptance Criteria**:
1. Given corpus validation runs, When the TypeScript scorer evaluates prompts, Then Python-correct decisions remain preserved.

---

## 12. OPEN QUESTIONS

### Open Questions

- None for the completed shipped scope.

### Assumptions

- Semantic scoring remains shadow-only until future promotion evidence exists.
- Compatibility shims remain part of the supported surface.

### PHASE DOCUMENTATION MAP

All 7 sub-phases (001–007) have been flattened into this parent packet (2026-04-24). Sub-phase summaries are consolidated in `implementation-summary.md` under `### Sub-phase summaries`. Sub-phase directories have been deleted; research artifacts remain in the `research/` subtree (skill-owned, untouched).

| Child | Original Purpose | Status |
|-------|-----------------|--------|
| `001-validator-esm-fix` | Validator runtime prerequisite. | Merged |
| `002-daemon-freshness-foundation` | Daemon, lease, and freshness substrate. | Merged |
| `003-lifecycle-and-derived-metadata` | Derived metadata, lifecycle, schema migration. | Merged |
| `004-native-advisor-core` | TypeScript scorer and parity harness. | Merged |
| `005-mcp-advisor-surface` | MCP tool contracts and handlers. | Merged |
| `006-compat-migration-and-bootstrap` | Legacy compatibility and operator bootstrap. | Merged |
| `007-promotion-gates` | Shadow cycles and promotion gate bundle. | Merged |

---

## RELATED DOCUMENTS

- Parent 009 packet.
- Phase 027 plan, tasks, checklist, decision record, and implementation summary.
<!-- /ANCHOR:questions -->
