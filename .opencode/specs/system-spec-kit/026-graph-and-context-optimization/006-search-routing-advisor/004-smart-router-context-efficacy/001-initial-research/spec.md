---
title: "Research Charter: Smart-Router Context-Load Efficacy"
description: "Research charter for 004/001 — 20-iteration deep-research on V1-V10 questions covering context-load measurement + OpenCode plugin design."
trigger_phrases:
  - "004 001 research charter"
importance_tier: "important"
contextType: "research-charter"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research"
    last_updated_at: "2026-04-19T18:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Charter scaffolded"
    next_safe_action: "Dispatch cli-codex deep-research 20 iterations"
    dispatch_policy: "cli-codex gpt-5.4 high fast"

---
# Research Charter: Smart-Router Context-Load Efficacy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Research Budget** | 20 iterations (auto-convergence possible earlier) |
| **Executor** | cli-codex gpt-5.4 high fast |

---

## 1. RESEARCH QUESTIONS (V1-V10)

- **V1 Baseline** — without hook, how much context does an AI load when approaching a skill-requiring task? Measure: tokens loaded, files read, time-to-first-useful-action.
- **V2 With-hook** — does the advisor brief effectively steer the AI to the right skill with minimal preload?
- **V3 Savings quantification** — tokens saved, latency saved, per-prompt distribution.
- **V4 Miss-rate analysis** — when the advisor picks wrong or returns low-confidence, does the AI correctly override vs blindly follow?
- **V5 Adversarial cases** — prompt-poisoning, metalinguistic skill mentions (e.g. "explain sk-git"), ambiguous tasks.
- **V6 Cross-runtime** — do Claude/Gemini/Copilot/Codex all see the same context-load reduction?
- **V7 Runtime behavior** — does the AI actually skip SKILL.md reads when the brief is high-confidence, or does it still verify?
- **V8 OpenCode plugin architecture design** — how to package the advisor hook as an OpenCode plugin. Reference: the working code-graph OpenCode plugin in this repo.
- **V9 Design** — propose the OpenCode plugin shape for advisor hook (skill name, trigger hooks, install steps, settings).
- **V10 Risks** — prompt injection into advisor brief, stale-skill-graph false-positive routing, hook slowing down the loop, opt-out path if plugin misbehaves.

---

## 2. NON-GOALS

- Re-opening Phase 020 architecture
- Modifying `skill_advisor.py` ranker
- Full plugin implementation (design only — plugin build is a follow-up phase)

---

## 3. STOP CONDITIONS

- Convergence: rolling 3-iter newInfoRatio < 0.05 across all V1-V10
- All V1-V10 answered with evidence
- 20 iterations completed

---

## 4. EXPECTED ARTIFACTS

- `research/research.md` — canonical synthesis (17-section format per sk-deep-research)
- `research/research-validation.md` — per-question findings + decisions table
- `research/iterations/iteration-NNN.md` — one per iteration (1-20)
- `research/deep-research-state.jsonl` — structured state log
- `research/findings-registry.json` — findings index

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Phase 020: `../../../009-hook-daemon-parity/001-skill-advisor-hook-surface/`
- sk-deep-research skill: `.opencode/skill/sk-deep-research/SKILL.md`
