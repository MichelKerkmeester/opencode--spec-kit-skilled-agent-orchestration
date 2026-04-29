---
title: "Phase Parent: Release-Readiness Deep-Review Program"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "10-child phase parent running parallel deep-review audits across system-spec-kit, MCP memory, skill advisor, and code graph to assess release readiness."
trigger_phrases:
  - "release-readiness deep-review"
  - "10-angle audit program"
  - "release readiness program"
  - "parallel deep-review program"
importance_tier: "important"
contextType: "phase-parent"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program"
    last_updated_at: "2026-04-29T22:00:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase parent + 10 children authored"
    next_safe_action: "Dispatch 10 deep-review children"
    blockers: []
    completion_pct: 5
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# Phase Parent: Release-Readiness Deep-Review Program

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Type** | Phase parent (lean manifest only) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization` |
| **Children** | 10 child packets (Level 2 each — independent deep-review per angle) |
| **Executor** | cli-codex `gpt-5.5` reasoning=`high` service-tier=`fast` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After this session's wave of remediation work (013 research → 031-044 implementation + audits + finalization), the 026-graph-and-context-optimization wrapper packet is approximately release-ready. But "approximately" is not "verified." Before declaring release-ready, run a structured 10-angle audit program where each angle scrutinizes a distinct release-critical dimension.

This phase parent organizes 10 independent deep-review audits, each scoped to one of the 10 release-readiness angles. Children are independent — they can run in parallel (with concurrency=3 to honor cli-codex throttling). Each child produces its own `review-report.md` with severity-weighted P0/P1/P2 findings + remediation tickets.

### Purpose

Validate release-readiness across:
1. system-spec-kit workflow correctness
2. MCP memory data integrity
3. Skill advisor freshness + scoring
4. Code graph readiness contract
5. Cross-runtime hook + plugin parity
6. MCP tool schema + governance
7. Deep-loop research/review workflow integrity
8. Validator + spec-doc structural integrity
9. Documentation truth (post-031 + 040 + 042 verification)
10. Upgrade safety + operability
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Children Manifest

| Child | Slug | Target surface | Effort |
|-------|------|----------------|--------|
| 001 | workflow-correctness | `/spec_kit:plan,implement,complete,resume` + `/memory:save,search,manage` end-to-end | 30-90 min cli-codex |
| 002 | memory-data-integrity | `mcp_server/handlers/memory-*` + `mcp_server/lib/governance/` + DB consistency | 30-90 min cli-codex |
| 003 | skill-advisor-freshness | `mcp_server/skill_advisor/` daemon + status/rebuild + scoring | 30-90 min cli-codex |
| 004 | code-graph-readiness | `mcp_server/code_graph/` read-path/manual contract | 30-90 min cli-codex |
| 005 | cross-runtime-hook-parity | `mcp_server/hooks/` + 035 + 043 + 044 evidence; 5-runtime parity | 30-90 min cli-codex |
| 006 | mcp-tool-schema-governance | `mcp_server/schemas/` + `tool-schemas.ts` + governed-ingest | 30-90 min cli-codex |
| 007 | deep-loop-workflow-integrity | `mcp_server/lib/deep-loop/` + deep-research/review YAMLs | 30-90 min cli-codex |
| 008 | validator-spec-doc-integrity | `scripts/spec/validate.sh` + `mcp_server/lib/spec/` + sample of `specs/**` | 30-90 min cli-codex |
| 009 | documentation-truth | AGENTS.md + CLAUDE.md + SKILL.md + READMEs + feature_catalog + manual_testing_playbook | 30-90 min cli-codex |
| 010 | upgrade-safety-operability | `mcp_server/db/` + INSTALL_GUIDE.md + `package.json` + `doctor:mcp_install` | 30-90 min cli-codex |

### Out of Scope

- Implementing remediation (audit-only program; remediation goes to packets 046+ if needed)
- Modifying 031-044 spec docs (already shipped)
- Re-running the full automation matrix (035 + 036 + 043 + 044 already cover that)

### Concurrency strategy

To honor cli-codex throttling and avoid file-write races:
- Tier 1 (independent doc-only audits, run 3 in parallel): 005, 008, 009
- Tier 2 (independent code-area audits, run 3 in parallel): 002, 003, 004
- Tier 3 (run 3 in parallel): 001, 006, 007
- Tier 4 (run 1): 010

Or simply: dispatch sequentially if parallelism creates conflicts.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

The phase parent inherits requirements from each child packet. Aggregate:

- All 10 children produce a `review-report.md` with the standard 9-section structure
- Each child's strict validator exits 0
- Each child's findings classified P0/P1/P2 with severity-weighted convergence
- Aggregate roll-up: zero P0 findings across all 10 → release-ready; any P0 → blocked; P1 only → conditional with remediation backlog

### Acceptance scenarios

- **SCN-001**: **Given** all 10 children complete, **when** a reviewer reads each `review-report.md`, **then** they can decide release-readiness on a per-angle basis with severity-classified findings.
- **SCN-002**: **Given** any child surfaces a P0, **when** synthesis runs, **then** the parent records release as BLOCKED until the P0 is resolved.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

| Source | Type | Status |
|--------|------|--------|
| 013 supplemental research | Internal | Shipped |
| 031-040 remediation packets | Internal | Shipped |
| 041 finalization + memory index | Internal | Shipped |
| 042 root README refresh | Internal | Shipped |
| 043 hook+plugin live tests + 044 sandbox-fix | Internal | Shipped/in flight |
| sk-deep-review skill | Internal | Active reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- All 10 children ship with strict validator green
- Each `review-report.md` enumerates findings with file:line evidence
- Aggregate verdict: zero P0 → release-ready; P1-only → conditional + remediation backlog; any P0 → blocked
- Phase parent strict validator exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:phase-doc-map -->
## 7. PHASE DOCUMENTATION MAP

| Child | spec.md | plan.md | tasks.md | checklist.md | implementation-summary.md | review-report.md |
|-------|---------|---------|----------|--------------|---------------------------|------------------|
| 001-workflow-correctness | [spec](001-workflow-correctness/spec.md) | [plan](001-workflow-correctness/plan.md) | [tasks](001-workflow-correctness/tasks.md) | [checklist](001-workflow-correctness/checklist.md) | [impl](001-workflow-correctness/implementation-summary.md) | [review](001-workflow-correctness/review-report.md) |
| 002-memory-data-integrity | [spec](002-memory-data-integrity/spec.md) | [plan](002-memory-data-integrity/plan.md) | [tasks](002-memory-data-integrity/tasks.md) | [checklist](002-memory-data-integrity/checklist.md) | [impl](002-memory-data-integrity/implementation-summary.md) | [review](002-memory-data-integrity/review-report.md) |
| 003-skill-advisor-freshness | [spec](003-skill-advisor-freshness/spec.md) | [plan](003-skill-advisor-freshness/plan.md) | [tasks](003-skill-advisor-freshness/tasks.md) | [checklist](003-skill-advisor-freshness/checklist.md) | [impl](003-skill-advisor-freshness/implementation-summary.md) | [review](003-skill-advisor-freshness/review-report.md) |
| 004-code-graph-readiness | [spec](004-code-graph-readiness/spec.md) | [plan](004-code-graph-readiness/plan.md) | [tasks](004-code-graph-readiness/tasks.md) | [checklist](004-code-graph-readiness/checklist.md) | [impl](004-code-graph-readiness/implementation-summary.md) | [review](004-code-graph-readiness/review-report.md) |
| 005-cross-runtime-hook-parity | [spec](005-cross-runtime-hook-parity/spec.md) | [plan](005-cross-runtime-hook-parity/plan.md) | [tasks](005-cross-runtime-hook-parity/tasks.md) | [checklist](005-cross-runtime-hook-parity/checklist.md) | [impl](005-cross-runtime-hook-parity/implementation-summary.md) | [review](005-cross-runtime-hook-parity/review-report.md) |
| 006-mcp-tool-schema-governance | [spec](006-mcp-tool-schema-governance/spec.md) | [plan](006-mcp-tool-schema-governance/plan.md) | [tasks](006-mcp-tool-schema-governance/tasks.md) | [checklist](006-mcp-tool-schema-governance/checklist.md) | [impl](006-mcp-tool-schema-governance/implementation-summary.md) | [review](006-mcp-tool-schema-governance/review-report.md) |
| 007-deep-loop-workflow-integrity | [spec](007-deep-loop-workflow-integrity/spec.md) | [plan](007-deep-loop-workflow-integrity/plan.md) | [tasks](007-deep-loop-workflow-integrity/tasks.md) | [checklist](007-deep-loop-workflow-integrity/checklist.md) | [impl](007-deep-loop-workflow-integrity/implementation-summary.md) | [review](007-deep-loop-workflow-integrity/review-report.md) |
| 008-validator-spec-doc-integrity | [spec](008-validator-spec-doc-integrity/spec.md) | [plan](008-validator-spec-doc-integrity/plan.md) | [tasks](008-validator-spec-doc-integrity/tasks.md) | [checklist](008-validator-spec-doc-integrity/checklist.md) | [impl](008-validator-spec-doc-integrity/implementation-summary.md) | [review](008-validator-spec-doc-integrity/review-report.md) |
| 009-documentation-truth | [spec](009-documentation-truth/spec.md) | [plan](009-documentation-truth/plan.md) | [tasks](009-documentation-truth/tasks.md) | [checklist](009-documentation-truth/checklist.md) | [impl](009-documentation-truth/implementation-summary.md) | [review](009-documentation-truth/review-report.md) |
| 010-upgrade-safety-operability | [spec](010-upgrade-safety-operability/spec.md) | [plan](010-upgrade-safety-operability/plan.md) | [tasks](010-upgrade-safety-operability/tasks.md) | [checklist](010-upgrade-safety-operability/checklist.md) | [impl](010-upgrade-safety-operability/implementation-summary.md) | [review](010-upgrade-safety-operability/review-report.md) |
<!-- /ANCHOR:phase-doc-map -->

---

<!-- ANCHOR:children -->
## 8. CHILDREN STATUS

| Child | Status | Last update |
|-------|--------|-------------|
| 001-workflow-correctness | Planned | 2026-04-29 |
| 002-memory-data-integrity | Planned | 2026-04-29 |
| 003-skill-advisor-freshness | Planned | 2026-04-29 |
| 004-code-graph-readiness | Planned | 2026-04-29 |
| 005-cross-runtime-hook-parity | Planned | 2026-04-29 |
| 006-mcp-tool-schema-governance | Planned | 2026-04-29 |
| 007-deep-loop-workflow-integrity | Planned | 2026-04-29 |
| 008-validator-spec-doc-integrity | Planned | 2026-04-29 |
| 009-documentation-truth | Planned | 2026-04-29 |
| 010-upgrade-safety-operability | Planned | 2026-04-29 |
<!-- /ANCHOR:children -->

---

<!-- ANCHOR:risks -->
## 9. RISKS

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Concurrent dispatches conflict on shared file writes | Use 4-tier dispatch grouping above; max 3 concurrent per cli-codex throttle |
| Risk | Per-angle scope drift if children audit overlapping surfaces | Each child's prompt locks scope to a single target surface; cross-references go to other children's reports |
| Risk | Findings not actionable | Each finding MUST cite file:line + propose remediation packet |
| Risk | Audit fatigue blurs P0 vs P1 | Use sk-deep-review's severity rubric explicitly per finding |
<!-- /ANCHOR:risks -->
