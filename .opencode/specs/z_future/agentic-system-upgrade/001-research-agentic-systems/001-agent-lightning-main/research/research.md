---
title: "Deep [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/research]"
description: "30-iteration research of Agent Lightning for system-spec-kit improvement, including architecture, UX, agent-system, command, skill, and workflow recommendations. 24 actionable findings, 6 rejected."
trigger_phrases:
  - "deep"
  - "research"
  - "001"
  - "agent"
importance_tier: "important"
contextType: "research"
---
# Deep Research Report — 001-agent-lightning-main

## 1. Executive Summary
- External repo: Agent Lightning, a Microsoft Research framework that keeps agent runtimes in place while optimizing them through tracing, stores, algorithms, tutorials, and runnable examples rather than through a large operator-governance surface. [SOURCE: external/README.md:20-23] [SOURCE: external/README.md:63-67]
- Iterations executed: 30 of 30
- Stop reason: max_iterations
- Combined actionable findings: 24
- Combined totals: Must-have 6 | Should-have 15 | Nice-to-have 3 | Rejected 6
- Phase 3 totals: Must-have 3 | Should-have 5 | Nice-to-have 1 | Rejected 1
- Phase 3 UX verdicts: SIMPLIFY 2 | ADD 1 | MERGE 3 | KEEP 2 | REDESIGN 2
- Highest-confidence next moves after Phase 3:
  - Redesign the lifecycle front door around a guided default flow plus oneclick-style presets, instead of expecting most users to reason explicitly about `plan`, `implement`, and `complete`. [SOURCE: .opencode/command/spec_kit/plan.md:31-44] [SOURCE: .opencode/command/spec_kit/complete.md:32-45] [SOURCE: external/examples/tinker/hello.py:22-29] [SOURCE: external/examples/tinker/hello.py:154-185]
  - Merge everyday memory UX into lifecycle commands so `resume`, `complete`, and `handover` own routine context behavior while `/memory:*` stays advanced. [SOURCE: .opencode/command/memory/search.md:53-106] [SOURCE: .opencode/command/memory/manage.md:33-65] [SOURCE: .opencode/command/spec_kit/resume.md:258-304]
  - Collapse named agents and overlapping skills into capability bundles, then make Gate 2 routing largely implicit. [SOURCE: .opencode/agent/orchestrate.md:97-106] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:15-40] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:15-40] [SOURCE: AGENTS.md:175-179]
  - Compress the operator contract into a slim top-level workflow guide and move hook/runtime detail into appendix-grade docs. [SOURCE: CLAUDE.md:109-168] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:1-50] [SOURCE: external/AGENTS.md:3-16]

Phase 1 established that Agent Lightning offers real value at the RL-specific layer: richer evaluator payloads, stronger loop metrics, better adapter boundaries, and useful attempt-state vocabulary. Phase 2 widened the question from "what should Public adopt?" to "what parts of Public are overbuilt, misfactored, or aimed at the wrong UX?" Phase 3 narrowed that further to the operator-facing system itself: commands, template levels, skills, agent roles, gate machinery, hook surfaces, and end-to-end workflow friction.

The synthesis outcome is not a product pivot toward Agent Lightning's runtime model. It is a UX and topology simplification plan for `system-spec-kit`. Keep the mission-specific core: spec folders, file-first memory, explicit scope binding, packet-local loop state, and validator-backed governance. Simplify the operator-visible edges: too many lifecycle commands, too many agent and skill identities, too much exposed routing ceremony, too much duplicated master-doc and hook detail, and too little quickstart guidance.

This phase again attempted CocoIndex first for broader semantic discovery, but both MCP and direct `ccc` searches timed out on the operator-surface queries in this checkout. The fallback was line-numbered direct reads plus exact search. That was sufficient because the Phase 3 questions centered on command contracts, role topology, docs structure, and workflow presentation rather than on hidden implementation branches.

## 2. Research Expansion In Phase 2

Phase 2 intentionally moved beyond the Phase 1 adoption lens. The expanded research focused on:
- Refactor questions about where `system-spec-kit` is overcomplicated or misfactored
- Pivot questions about whether Gate 1/2/3, Level 1/2/3+, and the command/tool surface are the right product shape
- Simplification questions about user-visible ceremony, role taxonomy, and capability sprawl
- Architecture questions about deep-loop runtime state, validator structure, and memory boundaries
- UX questions about documentation navigation and the difference between internal authoring models and public/operator-facing surfaces

The external signals that mattered most in Phase 2 were:
- Compact public entrypoints
- Audience-based documentation
- Standard-tool validation
- Explicit runtime readiness and error handling
- Optional capability grouping
- The absence of repo-local governance machinery equivalent to Public's packets, constitutional memory, and conversational gates

## 3. Phase 3 — UX, Agentic System & Skills Analysis

Phase 3 covered all six mandated angles and converted the comparative work into operator-surface guidance:
- **Command UX (021-023):** Agent Lightning's smaller feel comes from tutorials, examples, and quickstart paths more than from the literal existence of a single CLI. Public should reject a single-binary pivot, but it should redesign the lifecycle front door, demote internal YAML/lifecycle detail, and merge everyday memory behavior into lifecycle commands. [SOURCE: external/docs/reference/cli.md:15-26] [SOURCE: external/examples/README.md:1-18] [SOURCE: .opencode/command/spec_kit/plan.md:13-17] [SOURCE: .opencode/command/spec_kit/complete.md:13-17] [SOURCE: .opencode/command/memory/search.md:53-106]
- **Template and spec-folder UX (024):** The Level 1/2/3+ model is still useful for authors and validators, but it is too literal as a first-contact UX. Public should keep the structure internally and simplify how it is explained and how validator output is phrased. [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:15-24] [SOURCE: .opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md:15-39] [SOURCE: external/docs/index.md:14-19]
- **Sub-agent architecture (025-026):** Public has too many named first-class roles, but its packet-local append-only state model for deep research and deep review remains strong. Merge the role topology, not the loop-state architecture. [SOURCE: .opencode/agent/orchestrate.md:97-106] [SOURCE: .opencode/agent/context.md:27-31] [SOURCE: .opencode/agent/deep-research.md:53-57] [SOURCE: .opencode/agent/deep-review.md:45-68]
- **Skills system (027-028):** The default routing surface is too fragmented across overlapping code skills and specialist meta-skills. Keep the expertise, but package it as fewer default capability packs and make Gate 2 routing mostly implicit. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:15-40] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:15-43] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:15-40] [SOURCE: AGENTS.md:175-179]
- **Automation and integration UX (029):** Public's runtime sophistication is real, but too much of its hook, gate, and fallback machinery is exposed in the operator contract. Slim the top layer and keep hook/runtime detail as appendix material. [SOURCE: CLAUDE.md:109-168] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:736-770] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:1-50]
- **End-to-end workflow friction (030):** Agent Lightning reaches a productive path faster through install docs, examples, and oneclick flows. Public should add safe presets for common jobs while keeping the full advanced matrix available. [SOURCE: external/README.md:31-45] [SOURCE: external/docs/index.md:14-19] [SOURCE: external/examples/tinker/hello.py:22-29] [SOURCE: external/examples/tinker/hello.py:154-185]
