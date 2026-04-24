---
title: "...ec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/plan]"
description: "Implementation plan for Phase 027 parent coordination across daemon freshness, derived metadata, native advisor scoring, MCP surface, compatibility, and promotion gates."
trigger_phrases:
  - "026/009/002 plan"
  - "advisor daemon plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification"
    last_updated_at: "2026-04-21T15:42:05Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Shipped implementation preserved; strict validation follow-up still pending"
    next_safe_action: "Keep validation green"
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: 027 - Skill Graph Daemon and Advisor Unification

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python compatibility shim, Markdown, JSON |
| **Framework** | Node.js, Vitest, system-spec-kit MCP server |
| **Storage** | SQLite graph, JSON graph metadata, spec markdown |
| **Testing** | MCP server typecheck/build, advisor vitest suites, strict spec validation |

### Overview

Phase 027 was delivered as seven child packets: validator prerequisite, daemon freshness, lifecycle metadata, native scorer, MCP surface, compatibility/bootstrap, and promotion gates. The parent plan records the dependency chain and validation strategy while the children own implementation details.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Research synthesis established the implementation roadmap.
- [x] Child packets were scaffolded with dependency order.
- [x] Validator prerequisite was identified before downstream implementation.

### Definition of Done

- [x] All seven child packets shipped.
- [x] Native advisor scorer and compatibility surfaces are implemented.
- [x] Promotion gates are documented and enforced.
- [ ] Parent strict validation exits 0 after the 2026-04-21 parity repair.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single advisor subsystem inside the system-spec-kit MCP server with thin compatibility adapters for legacy callers.

### Key Components

- **Daemon/freshness layer**: watches skill metadata, manages single-writer lease, and publishes freshness generations.
- **Derived metadata layer**: extracts generated signals with provenance and lifecycle handling.
- **Scorer layer**: fuses explicit, lexical, graph, derived, and semantic-shadow lanes.
- **MCP tool layer**: exposes recommendation, status, and validation tools.
- **Compatibility layer**: keeps Python CLI and OpenCode plugin paths usable.
- **Promotion layer**: evaluates shadow-cycle gates before live influence changes.

### Data Flow

Skill file change -> daemon event -> hash-aware graph refresh -> derived metadata projection -> advisor scorer -> MCP tool response -> compatibility adapters for legacy runtimes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Complete research synthesis and roadmap.
- [x] Ship validator ESM prerequisite.
- [x] Confirm child packet dependency order.

### Phase 2: Implementation

- [x] Ship daemon freshness foundation.
- [x] Ship lifecycle and derived metadata.
- [x] Ship native advisor core.
- [x] Ship MCP advisor surface.
- [x] Ship compatibility migration and bootstrap.
- [x] Ship promotion gates.

### Phase 3: Verification

- [x] Child implementation tests passed during shipment.
- [x] Parent implementation summary records convergence.
- [ ] Strict validation exits 0 for this parent after documentation parity repair.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | MCP server TypeScript sources | `npm run typecheck` |
| Build | MCP server compiled output | `npm run build` |
| Unit/contract | Advisor daemon, scorer, handlers, and compatibility | Vitest suites |
| Documentation | Phase 027 parent and child docs | `validate.sh --strict --no-recursive` |

The 2026-04-21 remediation gate focuses on strict documentation validation for this parent packet and child parity validation requested by the orchestrator.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Validator ESM prerequisite | Internal | Complete | Required for reliable spec validation. |
| Daemon freshness foundation | Internal | Complete | Required for lifecycle and advisor status. |
| Lifecycle metadata | Internal | Complete | Required for native scorer inputs. |
| Native advisor core | Internal | Complete | Required for MCP tool surface and compatibility routing. |
| Promotion gates | Internal | Complete | Required before semantic or learned live influence. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Native advisor or compatibility path regresses legacy routing.
- **Procedure**: Keep the compatibility shim active, leave semantic lane at 0.00 live weight, and route callers through the last known safe deterministic scorer while preserving graph metadata.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001 validator ESM fix | None | Reliable validation for downstream packets |
| 002 daemon freshness foundation | 001 | Lifecycle metadata and advisor status |
| 003 lifecycle and derived metadata | 002 | Native scorer inputs |
| 004 native advisor core | 003 | MCP surface and compatibility |
| 005 MCP advisor surface | 004 | Compatibility migration |
| 006 compatibility migration | 005 | Operator bootstrap |
| 007 promotion gates | 004 | Future live influence changes |
<!-- /ANCHOR:phase-deps -->

### AI Execution Protocol

#### Pre-Task Checklist

- Confirm child dependency order before dispatch.
- Read current implementation and validation evidence before editing docs.
- Keep remediation changes inside the Phase 027 packet when repairing validation shape.

#### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Preserve child dependency order. |
| TASK-SCOPE | Do not broaden implementation beyond shipped Phase 027 surfaces. |
| TASK-VERIFY | Validate parent and child packets after documentation repair. |
| TASK-TRUTH | Mark only evidence-backed closure as complete. |

#### Status Reporting Format

Status Format: child packet, shipped state, verification output, and remaining validation action.

#### Blocked Task Protocol

If strict validation exposes an out-of-scope broken historical reference, remove or rewrite the stale reference in this packet and document the repair in the remediation summary.
