---
title: "Implemen [02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/plan]"
description: "Technical plan for auditing 5 Decisions and Deferrals features against source code"
trigger_phrases:
  - "audit plan"
  - "decisions and deferrals"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Code Audit — Decisions and Deferrals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / JavaScript (Node.js) |
| **Framework** | MCP server (Model Context Protocol) |
| **Storage** | better-sqlite3 |
| **Testing** | Manual code review + cross-reference |

### Overview
Audit each of the 5 Decisions and Deferrals features by reading the feature catalog entry, locating the referenced source files, and verifying that the implementation matches the documented behavior.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Feature catalog files current and accessible
- [x] Source code accessible via file system
- [x] Audit methodology defined

### Definition of Done
- [x] All 5 features audited
- [x] Findings documented per feature
- [x] Summary report completed

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only audit: Feature Catalog → Source Code → Findings Report

### Key Components
- **Feature Catalog**: `feature_catalog/cross-cutting/` — source of truth
- **Source Code**: `.opencode/skill/system-spec-kit/` — implementation files
- **Audit Output**: This spec folder — findings and documentation

### Data Flow
Read feature catalog entry → Locate source files → Compare description to implementation → Document findings

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [x] Verify feature catalog is current for Decisions and Deferrals
- [x] Identify source code root paths
- [x] Set up audit methodology

### Phase 2: Feature-by-Feature Audit
- [x] Audit: Collect architectural decisions from all audit phases
- [x] Audit: Document deferred items with rationale
- [x] Audit: Map decision dependencies across categories
- [x] Audit: Prioritize deferrals for future work
- [x] Audit: Create decision timeline

### Phase 3: Synthesis
- [x] Cross-reference findings across features
- [x] Identify systemic patterns
- [x] Compile summary report

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-reference | Feature-to-code traceability | Grep, Read, Glob |
| Completeness | All 5 features covered | Checklist verification |
| Accuracy | Catalog matches implementation | Manual review |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog | Internal | Green | Cannot audit without reference |
| Source code access | Internal | Green | Cannot verify implementation |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Audit methodology proves inadequate
- **Procedure**: Revise approach and restart from Phase 1

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Prep) ──► Phase 2 (Audit 5 features) ──► Phase 3 (Synthesis)
```

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | 1 session |
| Feature Audit | Low | 5 features |
| Synthesis | Medium | 1 session |

---

### Milestones

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit spec created | All docs in place |
| M2 | All features audited | 5/5 complete |
| M3 | Synthesis delivered | Summary report finalized |

---

### Findings Summary

This meta-phase synthesized cross-cutting signals from all 18 main audit phases (001–018). The analysis proceeded in three layers: stable architectural decisions, intentionally deferred work, and deprecated/dead modules.

### Layer 1 — Architectural Decisions (Stable, Intentional)

Four decisions emerged as load-bearing constraints respected by every audit phase:

1. **4-stage pipeline sole runtime path** — All retrieval in the system routes through sparse → dense → graph → fusion. No short-circuit paths were found. Any future retrieval extension must fit within this envelope.
2. **PE gating 5-action model** — The permission model is intentionally closed at 5 actions. Multiple phases (002-mutation, 005-lifecycle) attempted to add implicit actions and were rejected at gate time; the 5-action model held.
3. **Graduated rollout policy** — Governance phase (017) confirmed no path from code change to full deployment without passing canary and staged gates. This is enforced by `rollout/policy.ts`, not by convention alone.
4. **Deny-by-default shared memory** — Shared memory spaces have no implicit access. Every membership is an explicit allow-list entry. This was confirmed via 004-maintenance and the shared-memory module itself.

### Layer 2 — Deferrals (Open, Prioritized)

Four items were intentionally deferred during phase audits with documented rationale. None block current functionality:

- **AST-level section retrieval** (001-retrieval F07) — Future, requires parser integration milestone
- **Warm server / daemon mode** (014-pipeline-architecture F15) — Future, requires scale milestone trigger
- **Anchor-tags-as-graph-nodes** (010-graph-signal-activation F09) — Future, requires document-graph schema stabilization
- **Full namespace CRUD** (002-mutation F07) — Future, requires UX design sign-off

### Layer 3 — Deprecated Modules (Dead Code Confirmed)

Four modules confirmed dead across phases: `temporal-contiguity`, `graph-calibration-profiles`, `channel-attribution`, `eval-ceiling`. None have active import chains. Removal is safe and recommended as a housekeeping pass.

### Decision Timeline

```
v0 (bootstrap)       → 4-stage pipeline committed, deny-by-default shared memory
v0.x (early audit)   → PE gating 5-action model finalized; namespace CRUD deferred
v1 (pre-production)  → Graduated rollout policy enforced; deprecated modules removed
Ongoing (deferred)   → AST retrieval, daemon mode, anchor-graph, full CRUD
```
<!-- /ANCHOR:effort -->
