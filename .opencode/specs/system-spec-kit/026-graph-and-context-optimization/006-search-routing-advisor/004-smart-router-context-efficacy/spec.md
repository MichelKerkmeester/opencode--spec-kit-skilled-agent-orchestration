---
title: "Feature Specification: Smart-Router Context-Load Efficacy Investigation"
description: "Investigation + measurement phase. Does the Phase 020 advisor hook actually reduce AI-assistant context load? Secondary: design OpenCode plugin packaging for the advisor hook using code-graph plugin as reference."
trigger_phrases:
  - "021 smart router efficacy"
  - "advisor context load measurement"
  - "opencode plugin advisor hook"
importance_tier: "important"
contextType: "investigation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-full | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy"
    last_updated_at: "2026-04-19T18:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Phase 021 scaffolded as T11 follow-up to 020"
    next_safe_action: "Dispatch 001-initial-research deep-research loop"
    dispatch_policy: "cli-codex gpt-5.4 high fast primary; cli-copilot gpt-5.4 high fallback"

---
# Feature Specification: Smart-Router Context-Load Efficacy Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-full | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Track** | 026-graph-and-context-optimization |
| **Position in track** | 021 — first measurement phase post-advisor-hook |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (efficacy validation) |
| **Status** | Research Dispatched |
| **Created** | 2026-04-19 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | ../003-advisor-phrase-booster-tailoring/spec.md |
| **Successor** | ../005-skill-advisor-docs-and-code-alignment/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 020 shipped a cross-runtime advisor hook surface that injects a brief (`Advisor: <state>; use <skill> <confidence>/<uncertainty>`) into every `UserPromptSubmit` event. The advisor's stated value proposition is that it steers the AI to the right skill with minimal preload — avoiding the full SKILL.md + references/ + assets/ walk that AIs default to when uncertain.

But this is an unverified claim. The AI might:
- Load full SKILL.md anyway as verification
- Ignore the advisor brief and do its own search
- Correctly follow the brief but miss nuance
- Be confused by stale or low-confidence briefs
- Be exploited by prompt-poisoning through the advisor label

We need empirical measurement before claiming the smart router delivers context-load savings.

### Purpose

Investigate + measure whether the smart-router effectively reduces AI-assistant context load, across Claude/Gemini/Copilot/Codex. Propose OpenCode plugin packaging for the advisor hook as a follow-up artifact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- V1-V10 research questions per `001-initial-research/` spec
- Empirical benchmarks: tokens loaded, time-to-action, miss-rate
- Cross-runtime comparison (Claude/Gemini/Copilot/Codex)
- OpenCode plugin architecture design (referencing code-graph plugin)
- Adopt-now / prototype-later / reject call per finding

### Out of Scope
- Any re-architecture of Phase 020 advisor hook surface
- Changes to the advisor ranker (`skill_advisor.py`)
- Production plugin build (just the design + research)
<!-- /ANCHOR:scope -->

---

## 4. REQUIREMENTS

### 4.1 P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 20-iteration deep-research on V1-V10 questions | Converged research-validation.md with findings |
| REQ-002 | Empirical measurement protocol defined | Fixture prompts + AI test harness + token counting methodology |
| REQ-003 | Per-question adopt/prototype/reject calls | Decisions table in research synthesis |

### 4.2 P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | OpenCode plugin proposal | Package shape + manifest + hook registration + install flow |
| REQ-011 | Cross-runtime delta table | Per-runtime context-load savings |

---

## 5. SUCCESS CRITERIA

- Research synthesis answers V1-V10 with evidence
- OpenCode plugin design documented
- Next-phase dispatch can build on findings (either plugin implementation or measurement-driven advisor refinement)

---

## RELATED DOCUMENTS

- Parent: `../../009-hook-daemon-parity/001-skill-advisor-hook-surface/` (shipped 2026-04-19)
- Reference: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` (the shipped hook surface)
- Corpus: `../research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl` (200 labeled prompts for benchmarks)
- Code-graph plugin reference: TBD — codex to locate during research
