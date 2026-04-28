---
title: "Feature Specification: 005 Review Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase parent for closing P1/P2 findings surfaced by the 026 release-readiness deep-review program. Each synthesized review report becomes a sub-phase that owns the concrete fix work."
trigger_phrases:
  - "005-review-remediation"
  - "review remediation 026"
  - "deep-review remediation phase"
  - "release cleanup review fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation"
    last_updated_at: "2026-04-28T15:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase-parent manifest with two sub-phases for the synthesized 005 and 011 review reports; 1C placeholder pending 008/008 synthesis"
    next_safe_action: "Implement sub-phase 001 (memory-indexer storage boundary fix); 002 doc cleanup batch is parallelizable"
    completion_pct: 5
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Lean manifest: root purpose, sub-phase list, what needs done.
  Heavy docs (plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md) live in child sub-phases only.
-->

# Feature Specification: 005 Review Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization/000-release-cleanup` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The 026 release-readiness deep-review program (Tier 1: 005-memory-indexer-invariants, 011-mcp-runtime-stress-remediation, 008/008-skill-graph-daemon-and-advisor-unification) surfaced 3 P1 correctness findings and 22 P2 advisories spread across 3 packets. Without a coordinated remediation phase, the findings risk drifting back into "code-complete" status without ever being closed.

### Purpose
Provide a single phase-parent home where each synthesized review report drives a sub-phase of concrete fix work. Each sub-phase owns its own spec, plan, tasks, and verification — this parent only manifests the inventory.

---

## 3. SCOPE

### In Scope
- One sub-phase per synthesized deep-review report from the 026 release-readiness program.
- Concrete code, doc, and test fixes for findings cited at file:line in each `review-report.md`.
- Closure verification per sub-phase (tests pass, validator green).

### Out of Scope
- Re-running the deep-review loops themselves (those live under each reviewed packet's `review/` folder).
- Tier 2 packets (008/007 hook-surface, 009/005 plugin-loader, 009/002 copilot-hook, 006/008 deep-research-review, 006/001 license audit) — they get their own remediation if findings warrant.
- The `005-memory-indexer-invariants` CHK-T15 P0 blocker (live MCP rescan) — that is a packet-level operator gate, not a code fix, and is tracked separately.

---

## 4. SUB-PHASE MANIFEST

| Phase | Source Review | Verdict | Findings | Severity Mix |
|-------|---------------|---------|----------|--------------|
| `001-memory-indexer-storage-boundary/` | `005-memory-indexer-invariants/review/.../review-report.md` | CONDITIONAL | 14 | P1=1, P2=13 |
| `002-mcp-stress-cycle-cleanup/` | `011-mcp-runtime-stress-remediation/review/.../review-report.md` | PASS (hasAdvisories) | 6 | P2=6 |
| `003-skill-advisor-fail-open/` | `008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/...` | CONDITIONAL | 18 | P1=3, P2=15 |
| `004-tier2-remediation/` | Tier 2 D/E/F/G review reports (H deferred) | 4 × CONDITIONAL | 15 | P1=8, P2=7 |
| `006-search-query-rag-optimization/` | `011-mcp-runtime-stress-remediation/019-search-query-rag-optimization-research/research/research-report.md` | PROCEED | 20 | P1=3, P2=17 |

Sub-phase 003 is scaffolded as a placeholder while the 008/008 deep-review loop is still in flight. It will be populated when the synthesis writes its `review-report.md`.

---

## 5. WHAT NEEDS DONE

- **Sub-phase 001 first** (`P1-001` constitutional README storage-boundary): introduce a shared `isIndexableConstitutionalMemoryPath()` predicate, wire it into checkpoint restore + SQL update + post-insert metadata + cleanup CLI + parser/discovery, add regression test for poisoned-checkpoint replay. The 13 P2 advisories from the same review batch into the same sub-phase as a doc/observability cleanup.
- **Sub-phase 002** (parallelizable with 001): doc cleanup batch — refresh parent resource-map, soften "monotonic decay" wording, update HANDOVER-deferred, reconcile catalog/playbook impact audits with live state, group 18 children logically, extract verdict rubric inputs as JSON sidecar.
- **Sub-phase 003** (after 1C synthesis): if the `advisor_recommend` fail-open gap is confirmed P1 in synthesis, add the `unavailableOutput()` branch + regression. Other 1C findings batch in.
- **Sub-phase 006** (Phase D search optimization): add search-quality harness and telemetry-only query-plan contract first; leave trust-tree, rerank, learned weights, CocoIndex calibration, and degraded-readiness stress cells planned until the harness can measure them.

---

## 6. PHASE TRANSITION RULES

- Each sub-phase validates independently with strict spec-validator before parent rolls up.
- Implementation-summary in each sub-phase is the source-of-truth for completion claims; parent only reflects status.
- 003 sub-phase content gets back-filled when 1C deep-review synthesizes; until then, it carries a `pending-synthesis` status flag in its `_memory.continuity.recent_action`.

---

## 7. RELATED DOCUMENTS

- **Tier 1A review report**: `../../005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/review-report.md`
- **Tier 1B review report**: `../../011-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/review-report.md`
- **Tier 1C review packet (in-flight)**: `../../008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/008-skill-graph-daemon-and-advisor-unification-pt-01/`
- **Original investigation plan**: `~/.claude/plans/investigate-users-michelkerkmeester-mega-synthetic-rose.md`
