---
title: "Feature Specification: Skill-Advisor System + Hooks Improvement Investigation"
description: "Deep-research investigation into how the skill-advisor package and its hook-surfacing wiring can be improved beyond the state delivered by 009-hook-daemon-parity and 012-docs-impact-remediation. Research-only packet — output is findings + recommendations, no implementation in this sub-phase."
trigger_phrases:
  - "skill-advisor hook improvements"
  - "skill-advisor system research"
  - "026/009/014"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
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
# Feature Specification: Skill-Advisor System + Hooks Improvement Investigation

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research queued |
| **Created** | 2026-04-24 |
| **Parent** | `026-graph-and-context-optimization/009-hook-daemon-parity/` |
| **Parent Spec** | `../spec.md` |
| **Related** | `../001-skill-advisor-hook-surface/`, `../008-skill-advisor-plugin-hardening/`, `../009-skill-advisor-standards-alignment/`, `../006-integrity-parity-closure/applied/CF-019.md` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The skill-advisor system has been through three sibling sub-phases (001 surface, 008 hardening, 009 standards alignment) plus targeted P0 fixes in `007/006-integrity-parity-closure/` (CF-019 freezes-before-graph-penalty, etc.). The hook-surfacing story is now end-to-end: Claude / Codex / Copilot / Gemini / OpenCode-plugin-bridge all have automatic brief delivery wired when hooks are enabled, with `skill_advisor.py` as scripted fallback.

The open question: **beyond what has landed, where else can the skill-advisor system and its hook wiring improve?**

This packet scopes a focused deep-research investigation into that question. It is research-only; any implementation work becomes follow-up sub-phases.

### Purpose

Produce a `research/research.md` that answers, with evidence drawn directly from the code and prior research:

1. How well does the current advisor recommendation quality correlate with actual skill activation outcomes? Where does it miss?
2. Where do threshold / fusion weights, decay, or graph-conflict penalties introduce recommendation drift?
3. Which runtime hook surfaces still surface stale or over-verbose advisor briefs? How can prompt-entry latency be reduced?
4. What cross-runtime parity gaps remain in how the advisor brief is rendered, cached, and invalidated?
5. Which telemetry or feedback loops are under-used for adaptive tuning of advisor behavior?
6. Where are the skill-advisor MCP tools (`advisor_recommend`, `advisor_status`, `advisor_validate`) mis-scoped, missing, or redundant with skill-graph equivalents?

---

## 3. SCOPE

### In Scope

- Skill-advisor package: `mcp_server/skill-advisor/` (native lib, scripts, subprocess pattern).
- Script fallback: `mcp_server/skill-advisor/scripts/skill_advisor.py`.
- Advisor brief producer + renderer + cache policy (`mcp_server/skill-advisor/lib/`).
- Hook adapters that deliver the brief: Claude `UserPromptSubmit`, Codex prompt/session hooks (gated by `codex_hooks`), Copilot `.claude/settings.local.json` writer commands, Gemini hooks, OpenCode plugin bridge `experimental.chat.system.transform`.
- Advisor MCP tools: `advisor_recommend`, `advisor_status`, `advisor_validate`.
- Skill-graph interactions: how advisor recommendations are influenced by skill-graph state.
- Telemetry / feedback: how advisor outcomes are (or aren't) fed back for adaptive ranking.
- Operator-facing surfaces: ENV_REFERENCE entries for advisor tunables, hook_system.md rows for advisor-related hooks, AGENTS.md Gate 2 prose.

### Out of Scope

- Implementation of any discovered improvements (that's follow-up sub-phases).
- Skill package itself beyond how the advisor consumes it (skill content generation is covered elsewhere).
- Memory system beyond the advisor's cache integration points.
- New hook-engine work beyond advisor surface integration.

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
| `026/007/006-integrity-parity-closure/applied/CF-019.md` | Already-applied advisor fix |

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
| REQ-005 | Recommended-fix section groups by logical bucket (recommendation quality / hook latency / cross-runtime parity / telemetry / MCP-tool surface / env tunables) | Synthesizer output visibly uses those buckets |

---

## 5. SUCCESS CRITERIA

- **SC-001**: 10 iterations completed or convergence detected early.
- **SC-002**: `research.md` has ≥ 3 P0/P1 findings that represent net-new gaps beyond what is already closed in sibling sub-phases + `007/006-integrity-parity-closure/`.
- **SC-003**: Every recommended fix names concrete target files so a downstream implementation packet can act on it without re-investigation.
- **SC-004**: Research completes using `cli-codex gpt-5.4 high fast` (gpt-5.5 verified unavailable earlier this session).

---

## 6. EXECUTION NOTE

Dispatched via the same direct `codex exec` pattern documented in `../006-integrity-parity-closure/decision-record.md#adr-001`. Output file layout matches sk-deep-research conventions.
