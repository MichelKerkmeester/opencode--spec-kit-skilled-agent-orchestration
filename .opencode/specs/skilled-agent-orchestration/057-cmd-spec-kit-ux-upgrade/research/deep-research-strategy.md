---
title: Deep Research Strategy - Session Tracking
description: Live strategy file for the 057-cmd-spec-kit-ux-upgrade SPAR-Kit comparison research run.
---

# Deep Research Strategy - Session Tracking (Packet 057)

## 1. OVERVIEW

### Purpose

Persistent brain for the 10-iteration SPAR-Kit vs system-spec-kit comparison loop.

### Usage

- **Init:** Strategy seeded by Claude orchestrator for the cli-codex/gpt-5.5/high/fast 10-iteration run.
- **Per iteration:** Codex agent reads Next Focus, writes iteration evidence to `iterations/iteration-NNN.md` and `deltas/iter-NNN.jsonl`. The reducer refreshes machine-owned sections.
- **Mutability:** Mutable. Sections 3, 6, 7-11 are reducer-owned; sections 1-2, 4-5, 12-13 are analyst-owned.

---

## 2. TOPIC

Compare external SPAR-Kit project at `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/` (Specify -> Plan -> Act -> Retain workflow kit by jed-tech, npm `@spar-kit/install` Beta1) against the internal `system-spec-kit` surface (`.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/templates/`, `.opencode/command/spec_kit/`, `.opencode/command/memory/`, `.opencode/command/create/`, `.opencode/agent/`). Produce 10-20 ranked, evidence-backed UX/orchestration patterns we should adopt-as-is, adapt, take inspiration from, or reject-with-rationale across 6 axes.

---

## 3. KEY QUESTIONS (remaining)

- [ ] Q1: What is the smallest viable subset of SPAR-Kit's managed-block policy we could adopt without breaking the AGENTS.md sync triad (Public + Barter + fs-enterprises)?
- [ ] Q2: Does collapsing `:auto`/`:confirm`/`:with-phases`/`:with-research` into a 2-axis matrix (mode × scope) break any existing skill-advisor or hook contracts?
- [ ] Q3: Could our 99-template tree compress to a SPAR-style declarative manifest with on-demand composition, given that `compose.sh` already materializes per-level outputs?
- [ ] Q4: Which SPAR personas (Vera/Pete/Tess/Maya/Max) translate cleanly to our skill prompts and which would clash with our terse-output style?
- [ ] Q5: Does the SPAR `tools.yaml` "seed once, never overwrite" model improve discoverability vs our skill-advisor + MCP routing for sessions where the user doesn't know what's available?
- [ ] Q6: Is the SPAR npm-installer pattern (`@spar-kit/install --target claude/cursor/codex`) worth the maintenance cost vs our manual skill installation, considering our cross-runtime hook reality (`.claude/`, `.opencode/`, `.codex/`, `.gemini/`)?
- [ ] Q7: What do SPAR's "Key Follow-Up vs Optional Follow-up" splits in `spar-plan` and the "creative, suggestive, teammate-like" tone in `spar-specify` suggest about our current consolidated-question protocol?
- [ ] Q8: Where is evidence thin — which axes need extra digging in later iterations?

---

## 4. NON-GOALS

- Implementing any discovered patterns in this packet (each adoption candidate lands in 058+).
- Rewriting `external/` (read-only).
- Changing skill-advisor scoring tables.
- Touching production behavior of any current command.
- Modeling network effects of npm distribution (we are not shipping our spec-kit publicly).

---

## 5. STOP CONDITIONS

- All 8 key questions answered AND ≥10 ranked findings with verdict tags.
- `newInfoRatio < 0.05` for 2 consecutive iterations after iter-3.
- 3 consecutive `stuck` iterations on the same focus area.
- Iteration 10 hard cap reached (synthesis still emits).

---

## 6. ANSWERED QUESTIONS

[None yet — populated as iterations answer questions]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

[Populated after iteration 1]

---

## 8. WHAT FAILED

[Populated after iteration 1]

---

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when angles exhausted]

---

## 10. RULED OUT DIRECTIONS

[Populated as iterations dead-end]

---

## 11. NEXT FOCUS

Iteration 1 focus: SCOUT pass — enumerate external/ folder structure and key files (README.md, ROADMAP.md, technicalBrief.md, AGENTS.md, install-root/skills/spar-*/SKILL.md, install-root/targets/*.json, templates/*, lib/cli.mjs, lib/install-engine.mjs, bin/spar-kit.mjs). Produce a structural map and 2-3 first-pass findings on Axis 1 (installer/distribution) and Axis 3 (command granularity) where SPAR's 4-skill surface is most directly comparable to our 6-command surface. Defer deep template-architecture (Axis 4) and personas (Axis 6) to iter-2/3.

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

- Internal surface scope (counts from spec.md §11):
  - SKILL.md: ~991 lines
  - Templates: ~99 files (core, addendum, level_{1,2,3,3+}, examples, cross-cutting)
  - Commands: 6 spec_kit + 4 memory + 6 create
  - Agents: 10 in `.opencode/agent/`
  - MCP tools: 47
- External surface (from spec.md §3 In Scope):
  - 4 SPAR phases: Specify / Plan / Act / Retain
  - 5 personas: Vera / Pete / Tess / Maya / Max
  - 2 templates: spec.md, plan.md
  - Declarative asset policies: replace, seed_if_missing, managed_block, replace_managed_children
  - Per-target install configs in `install-root/targets/*.json`
  - `tools.yaml` discovery surface
  - 60-line AGENTS.md cap
- Memory context: None retrieved at init; rely on iteration evidence.
- Resource map: not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 (newInfoRatio < 0.05 for 2 consecutive iterations)
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` live; `fork`, `completed-continue` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Generation: 1
- Started: 2026-05-01T08:26:08.402Z
