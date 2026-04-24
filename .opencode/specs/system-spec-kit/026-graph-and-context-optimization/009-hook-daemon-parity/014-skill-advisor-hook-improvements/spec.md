---
title: "Fea [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec]"
description: "Level-2 implementation packet that translates the packet-02 skill-advisor research findings into shipped runtime parity, public MCP contract normalization, and durable prompt-safe telemetry across the skill-advisor and hook surfaces."
trigger_phrases:
  - "skill-advisor hook improvements"
  - "skill-advisor system research"
  - "026/009/014"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T12:15:00+02:00"
    last_updated_by: "codex-gpt-5"
    recent_action: "Governing spec reconciled to the shipped packet-02-derived implementation"
    next_safe_action: "Continue packet-015 remediation for the remaining packet-014 review gaps"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
    status: "complete"
---
# Feature Specification: Skill-Advisor Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-24 |
| **Parent** | `026-graph-and-context-optimization/009-hook-daemon-parity/` |
| **Parent Spec** | `../spec.md` |
| **Related** | `../001-skill-advisor-hook-surface/`, `../008-skill-advisor-plugin-hardening/`, `../009-skill-advisor-standards-alignment/`, `../../007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The skill-advisor system has already passed through sibling sub-phases `001`, `008`, and `009`, plus targeted parity closure in `007/006-integrity-parity-closure/`. That earlier work established the end-to-end hook surfaces, but packet-02 research still identified a bounded implementation set across OpenCode threshold parity, shared brief rendering, MCP surface symmetry, validator threshold semantics, and durable prompt-safe telemetry.

Those gaps were concrete shipped-behavior and contract issues rather than open-ended research questions. This packet owns the implementation follow-through for that research bundle so the governing spec, in-folder plan/tasks, and closeout docs all describe the same authorized work.

### Purpose

Implement the packet-02 findings in one Level-2 packet by:

1. Unifying the effective-threshold contract across the OpenCode plugin defaults, native bridge route, and fallback route.
2. Routing OpenCode native rendering through the shared advisor brief invariants instead of a bespoke formatter.
3. Normalizing Codex prompt submission and prompt-wrapper fallback against the shared builder contract.
4. Exposing explicit `workspaceRoot` and effective state on the public `advisor_recommend` and `advisor_validate` surfaces.
5. Publishing aggregate-vs-runtime threshold semantics so operator tooling can distinguish validation gates from runtime routing.
6. Persisting prompt-safe diagnostics in a bounded durable sink that validator analysis can read across processes.
7. Capturing accepted/corrected/ignored outcome totals for validator feedback without persisting raw prompt text.

---

## 3. SCOPE

### In Scope

- Skill-advisor package: `mcp_server/skill-advisor/` (native lib, scripts, subprocess pattern).
- Script fallback: `mcp_server/skill-advisor/scripts/skill_advisor.py`.
- Advisor brief producer + renderer + cache policy (`mcp_server/skill-advisor/lib/`).
- Hook adapters that deliver the brief: Claude `UserPromptSubmit`, Codex prompt/session hooks (gated by `codex_hooks`), Copilot `.claude/settings.local.json` writer commands, Gemini hooks, OpenCode plugin bridge `experimental.chat.system.transform`.
- Advisor MCP tools: `advisor_recommend`, `advisor_status`, `advisor_validate`.
- Skill-graph interactions: how advisor recommendations are influenced by skill-graph state.
- Telemetry / feedback surfaces touched by the shipped packet-02 findings, including durable diagnostics and outcome totals.
- Operator-facing surfaces: ENV_REFERENCE entries for advisor tunables, hook_system.md rows for advisor-related hooks, AGENTS.md Gate 2 prose.

### Out of Scope

- New exploratory deep-research beyond the packet-02 findings bundle.
- Skill package itself beyond how the advisor consumes it (skill content generation is covered elsewhere).
- Memory-system redesign beyond the advisor's cache and diagnostics integration points.
- New hook-engine work beyond the runtime surfaces touched by `014-F-001` through `014-F-007`.
- Packet-015 follow-up remediation items that are not part of the shipped 014 implementation contract.

### Files Likely to be Referenced

| Path | Why |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/**` | Advisor core logic |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Fallback path |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/**` | Per-runtime hook adapters |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Runtime hook matrix |
| `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` | Advisor hook contract |
| `026/009/001-skill-advisor-hook-surface/research/research.md` (if present) | Prior 001 research |
| `026/009/008-skill-advisor-plugin-hardening/implementation-summary.md` | Prior 008 outcomes |
| `026/009/009-skill-advisor-standards-alignment/implementation-summary.md` | Prior 009 outcomes |
| `026/007/006-integrity-parity-closure/applied/CF-019.md` | Upstream parity fix consumed as implementation baseline |

---

## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | OpenCode and Codex runtime entrypoints share the packet-014 threshold/render contract | OpenCode native + fallback paths and Codex prompt submission + prompt-wrapper fallback all consume the shared builder/render flow without branch-specific threshold drift |
| REQ-002 | Public advisor MCP surfaces expose explicit workspace and threshold state | `advisor_recommend` and `advisor_validate` surface `workspaceRoot`, effective threshold details, and validator threshold semantics through handlers, schemas, and operator docs |
| REQ-003 | Prompt-safe diagnostics and outcome totals persist beyond process-local stderr output | Durable bounded telemetry sinks exist for hook diagnostics, and validator analysis can read accepted/corrected/ignored outcomes back across processes |

### P1 — Recommended

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-004 | Focused verification covers the shipped runtime, MCP, and telemetry surfaces | Packet closeout includes targeted Vitest/smoke evidence for OpenCode parity, Codex parity, validator outputs, and durable telemetry behavior |
| REQ-005 | Packet lineage remains internally consistent after implementation | `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, and `checklist.md` all describe packet 014 as the implementation follow-through for packet-02 research |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Packet 014 closes the packet-02 implementation set for `014-F-001` through `014-F-007` inside this folder rather than deferring the actual code changes to an unnamed child packet.
- **SC-002**: OpenCode, Codex, and public MCP surfaces describe one threshold/render/operator contract after implementation.
- **SC-003**: The packet's governing spec and closeout docs consistently describe packet-02 research as upstream input and packet 014 as the implementation packet.
- **SC-004**: Verification records focused Vitest and smoke evidence for the shipped surfaces, while honestly documenting any remaining packet-external build blockers.

---

## 6. EXECUTION NOTE

Packet 014 consumes the packet-02 research bundle at `../../research/014-skill-advisor-hook-improvements-pt-02/` as its upstream implementation input and records the authorized execution in this folder's `plan.md`, `tasks.md`, `implementation-summary.md`, and `checklist.md`.

Implementation execution followed the same direct `codex exec` pattern documented in `../../007-deep-review-remediation/006-integrity-parity-closure/decision-record.md#adr-001`, but the canonical implementation record for this work lives in packet `014-skill-advisor-hook-improvements/` rather than in a separate child packet.
