---
title: "Feature Specification: MCP Stress-Cycle Doc/Observability Cleanup"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Close the 6 P2 advisories surfaced by the 011-mcp-runtime-stress-remediation deep review (PASS verdict, hasAdvisories=true). Doc drift, navigation, and verdict-replayability fixes only — no runtime code change."
trigger_phrases:
  - "002-mcp-stress-cycle-cleanup"
  - "011 review remediation"
  - "stress cycle doc drift"
  - "v1.0.2 verdict replayability"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/002-mcp-stress-cycle-cleanup"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: MCP Stress-Cycle Doc/Observability Cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (advisory) |
| **Status** | Complete |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source review** | 026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/review-report.md |
| **Source verdict** | PASS (hasAdvisories=true; P0=0, P1=0, P2=6) |

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 011-mcp-runtime-stress-remediation deep review confirmed the v1.0.2 verdict (6/7 PROVEN, 0 REGRESSION, 83.8% overall) holds independent verification, AND validated that the proposed P0 cli-copilot Gate 3 bypass fix in `executor-config.ts` + `buildCopilotPromptArg` is correctly implemented across all 5 sub-checks. The review surfaced 6 P2 advisories around documentation drift, navigation, and verdict replayability. None block release; closing them tightens the cycle's auditability.

### Purpose
Close the 6 P2 advisories so the 011 packet moves from PASS-with-advisories to clean PASS, and so the v1.0.2 verdict rubric is replayable from machine-readable artifacts.

---

<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refresh parent resource-map.md to cover the 18 children (current map predates expansion).
- Soften "monotonic decay" wording in post-stress research synthesis to match actual data.
- Update HANDOVER-deferred.md to reflect that 012-018 now own the deferred work.
- Reconcile feature-catalog-impact-audit.md and testing-playbook-impact-audit.md with current live catalog/playbook state.
- Group 18 children in context-index.md by cycle phase (baseline / research / remediation / rerun / followup / planned-fixes).
- Extract verdict rubric inputs (per-cell scores, weights, baseline) from 010/findings.md into a JSON sidecar.

### Out of Scope
- Runtime code changes — none required.
- Re-running the v1.0.2 sweep.
- Implementing the 4 patch proposals (P0 Gate 3, P1 graph testability, P2 file-watcher, OPP CocoIndex telemetry) — those live in 012-015 packets, not this remediation.

### Files to Change

| File | Change Type | Source finding |
|------|-------------|----------------|
| 011-mcp-runtime-stress-remediation/resource-map.md | Modify | F-001 |
| 011-mcp-runtime-stress-remediation/011-post-stress-followup-research/research/research.md | Modify | F-002 |
| 011-mcp-runtime-stress-remediation/HANDOVER-deferred.md | Modify | F-003 |
| 011-mcp-runtime-stress-remediation/feature-catalog-impact-audit.md | Modify | F-004 |
| 011-mcp-runtime-stress-remediation/testing-playbook-impact-audit.md | Modify | F-004 |
| 011-mcp-runtime-stress-remediation/context-index.md | Modify | F-005 |
| 011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings.md | Modify (or sidecar) | F-006 |
| `011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/findings-rubric.json` | Create | F-006 |

---

<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 (advisory closure)

| ID | Requirement | Source |
|----|-------------|--------|
| REQ-001 | Parent resource-map covers all 18 children with explicit "planned-extension" placeholders where appropriate. | F-001 |
| REQ-002 | Post-stress research synthesis softens "monotonic decay" wording to match data. | F-002 |
| REQ-003 | HANDOVER-deferred reflects 012-018 ownership of remaining work. | F-003 |
| REQ-004 | Catalog + playbook impact audits reconciled with current live state. | F-004 |
| REQ-005 | Context-index groups children by cycle phase. | F-005 |
| REQ-006 | Verdict rubric inputs extracted as JSON sidecar (`findings-rubric.json`) so the 83.8% can be recomputed. | F-006 |

---

<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 source findings closed.
- **SC-002**: Strict packet validator green for `011-mcp-runtime-stress-remediation`.
- **SC-003**: A maintainer can recompute the 83.8% verdict from `findings-rubric.json` without re-reading the markdown narrative.

### Acceptance Scenarios

1. **Given** the 011 resource map is opened, when a maintainer checks children 001 through 018, then every child has an explicit status.
2. **Given** the v1.0.2 verdict must be replayed, when `findings-rubric.json` is parsed, then the 83.8% aggregate can be recomputed from the sidecar.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parent recursive validation includes historical child debt outside this packet. | Medium | This packet records its own strict validator result separately. |
| Dependency | 011 source review report and existing rubric source data. | Required | Findings and score sidecar stay traceable to the completed review. |

<!-- /ANCHOR:risks -->
---
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Related documents for replay:

- **Source review report**: `../../../011-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/review-report.md`
- **Implementation plan**: `plan.md`
- **Tasks**: `tasks.md`
<!-- /ANCHOR:questions -->
