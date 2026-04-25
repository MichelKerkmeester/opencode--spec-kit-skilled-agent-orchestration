---
title: "Featur [system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements/spec]"
description: "Deep-research investigation into how the code-graph package and its hook wiring can be improved beyond the state delivered by 009-hook-parity and 012-docs-impact-remediation. Research-only packet — output is findings + recommendations, no implementation in this sub-phase."
trigger_phrases:
  - "code-graph hook improvements"
  - "code-graph system research"
  - "026/009/013"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/004-code-graph-hook-improvements"
    last_updated_at: "2026-04-24T01:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Research packet spec scaffolded; sk-deep-research with 10 iterations queued"
    next_safe_action: "Run sk-deep-research (cli-codex gpt-5.4 high fast) on this spec folder"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
    status: "research-queued"
---
# Feature Specification: Code-Graph System + Hooks Improvement Investigation

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research queued |
| **Created** | 2026-04-24 |
| **Parent** | `026-graph-and-context-optimization/009-hook-parity/` |
| **Parent Spec** | `../spec.md` |
| **Related** | `../impact-analysis/merged-impact-report.md`, `../006-integrity-parity-closure/`, 026 phase 003 (code-graph-package) research |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The code-graph system has been delivered and partially remediated across 026 phases 003 (code-graph-package) and 009 (hook-package). Recent cross-phase synthesis (`026/research/cross-phase-synthesis.md`) flagged code-graph and runtime-hook concerns among its top P0 items (CF-002, CF-009, CF-010, CF-014). Those specific findings are now closed in `007/006-integrity-parity-closure/`. The open question: **beyond those findings, where else can the code-graph system and its hook wiring improve?**

This packet scopes a focused deep-research investigation into that question. It is research-only; any implementation work that emerges becomes follow-up sub-phases (e.g. a `007/00N-code-graph-improvements-implementation/`).

### Purpose

Produce a `research/research.md` that answers, with evidence drawn directly from the code and prior research:

1. What correctness, freshness, scalability, or ergonomic gaps still exist in the code-graph scan, read, and readiness paths?
2. How can the hook-triggered graph refresh / staleness-handling flow be made more reliable, deterministic, or cheaper?
3. Which code-graph tools, events, or signals are under-used by downstream consumers (memory search, CocoIndex bridge, session bootstrap)?
4. What observability gaps make code-graph regressions hard to detect (telemetry, structured events, dashboards)?
5. Which cross-runtime hook surfaces would benefit from code-graph-aware enrichment that isn't present today?
6. What architectural tensions (e.g. parser-adapter boundary, readiness-contract scope, migration-phase invariants) are worth resolving vs. accepting?

---

## 3. SCOPE

### In Scope

- Code-graph package: `mcp_server/code-graph/lib/`, `mcp_server/code-graph/handlers/`, `lib/code-graph/readiness-contract.ts`, structural-indexer, ensure-ready, scan handlers.
- Parser adapters (tree-sitter WASM + regex fallback) and the `SPECKIT_PARSER` env knob.
- Code-graph MCP tools: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`.
- CocoIndex ↔ code-graph bridge: seed resolution, neighborhood expansion.
- Hook wiring that triggers or observes code-graph state: session-prime startup injection, bounded inline refresh on structural reads, staleness propagation.
- Operator-facing surfaces: ENV_REFERENCE entries for code-graph, hook_system.md rows for code-graph-related hooks, INSTALL_GUIDE verification steps.

### Out of Scope

- Implementation of any discovered improvements (that's follow-up sub-phases).
- CocoIndex's own indexing pipeline (covered by 026 phase 006 research instead).
- Memory system beyond the code-graph integration points (covered by 026 phase 002 research).
- New query engines or rewrite of the graph storage layer.

### Files Likely to be Referenced

| Path | Why |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/**` | Core graph library |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/**` | MCP tool handlers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts` | Readiness contract |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Hook matrix (for code-graph-related hooks) |
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Env knobs including `SPECKIT_PARSER` |
| `026/003-code-graph-package/research/research.md` | Prior 003 research findings |
| `026/007/006-integrity-parity-closure/applied/CF-002.md`, `CF-009.md`, `CF-010.md`, `CF-013.md`, `CF-014.md` | Already-applied code-graph fixes to build on |

---

## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Complete 10 sk-deep-research iterations on the topic defined in §2.Purpose | `research/iterations/iteration-01.md` … `iteration-10.md` written; `deep-research-state.jsonl` has 10 delta entries |
| REQ-002 | Final `research.md` synthesis written with required sections | Summary, Scope, Key Findings (grouped by severity), Evidence Trail, Recommended Fixes, Convergence Report, Open Questions, References |
| REQ-003 | Findings registry JSON emitted | `research/findings-registry.json` with per-finding severity, category, evidence, recommended_fix, target_files |

### P1 — Recommended

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-004 | Every finding cites code paths or prior-research sections with line-level specificity | Random-sample check: 3 findings each have at least one `path:line` or `doc#anchor` citation |
| REQ-005 | Recommended-fix section groups by logical bucket (correctness / freshness / observability / ergonomics / cross-runtime) | Synthesizer output visibly uses those buckets |

---

## 5. SUCCESS CRITERIA

- **SC-001**: 10 iterations completed or convergence detected early (newInfoRatio < 0.05 for 2 consecutive iterations).
- **SC-002**: `research.md` has ≥ 3 P0/P1 findings that represent net-new gaps beyond what is already closed in `007/006-integrity-parity-closure/applied/`.
- **SC-003**: Every recommended fix names concrete target files so a downstream implementation packet can act on it without re-investigation.
- **SC-004**: Research completes using `cli-codex gpt-5.4 high fast` (gpt-5.5 was verified unavailable earlier this session).

---

## 6. EXECUTION NOTE

Dispatched via the same direct `codex exec` pattern documented in `../006-integrity-parity-closure/decision-record.md#adr-001` — the canonical `claude -p "/spec_kit:deep-research :auto"` invocation hangs on this system. Output file layout matches sk-deep-research conventions.

**Research output location (canonical):** `../../research/028-code-graph-hook-improvements-pt-01/` at the 026 coordination-root (following the `{phase-slug}-pt-NN` nested-packet convention used by sk-deep-research). Contains: `research.md` (synthesis), `iterations/iteration-01..10.md`, `findings-registry.json`, `deep-research-state.jsonl`, `deep-research-dashboard.md`.
