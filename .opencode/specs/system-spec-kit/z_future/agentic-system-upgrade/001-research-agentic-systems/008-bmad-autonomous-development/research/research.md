---
title: "...ystem-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/research]"
description: "30-iteration research of BMad Autonomous Development for system-spec-kit adoption, refactor, simplification, and UX redesign opportunities. 22 actionable findings, 8 rejected."
trigger_phrases:
  - "ystem"
  - "spec"
  - "kit"
  - "future"
  - "agentic"
  - "research"
  - "008"
  - "bmad"
importance_tier: "important"
contextType: "research"
---
# Deep Research Report — 008-bmad-autonomous-development

## 1. Executive Summary
- External repo: BMad Autonomous Development (`bmad-bad`), a skill-packaged sprint execution orchestrator published at `https://github.com/stephenleo/bmad-autonomous-development`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:2-6]
- Iterations executed: 30 of 30
- Phase split: Phase 1 (`001`-`010`) established adoption opportunities; Phase 2 (`011`-`020`) expanded into refactor, pivot, simplification, architecture, and UX questions; Phase 3 (`021`-`030`) focused on operator UX, command taxonomy, spec bootstrap, agent packaging, skill routing, and end-to-end workflow friction.
- Stop reason: max_iterations
- Total actionable findings: 22
- Must-have: 7 | Should-have: 14 | Nice-to-have: 1 | Rejected: 8
- Phase 2 verdict mix: REFACTOR 2 | PIVOT 2 | SIMPLIFY 3 | KEEP 3
- Phase 3 UX verdict mix: SIMPLIFY 2 | ADD 2 | MERGE 3 | KEEP 2 | REDESIGN 1
- Top combined adoption opportunities for `system-spec-kit`:
  - Add an integrated, intent-first lifecycle surface so operators do not need to compose the common path from `plan`, `implement`, `complete`, and separate memory commands by hand. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:72-99] [SOURCE: .opencode/command/spec_kit/README.txt:43-76] [SOURCE: .opencode/command/memory/README.txt:308-320]
  - Introduce a guided spec bootstrap that recommends the right Level 1/2/3+ shape instead of making users reason from template architecture first. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:40-93] [SOURCE: .opencode/skill/system-spec-kit/references/templates/template_guide.md:67-186]
  - Merge public agent and skill packaging toward domain facades, while keeping specialist decomposition internal where it improves execution quality. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:22-31] [SOURCE: .opencode/agent/orchestrate.md:95-127] [SOURCE: .opencode/skill/README.md:42-59]
  - Keep `skill_advisor.py`, gates, and governance machinery as substrate, but redesign the operator surface so routing and safeguards feel automatic instead of ceremonial. [SOURCE: AGENTS.md:165-218] [SOURCE: CLAUDE.md:107-176] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:35-78]
  - Preserve the deeper substrate where it solves real problems: keep LEAF deep-loop architecture and keep advanced memory search/governance separate even as the common save/resume path becomes more implicit. [SOURCE: .opencode/agent/deep-research.md:24-32] [SOURCE: .opencode/agent/deep-research.md:167-212] [SOURCE: .opencode/command/memory/README.txt:248-320]

## 2. External Repo Map
- The BAD snapshot is documentation-first: one `skills/bad/SKILL.md` coordinator contract, three phase references, setup assets, merge helpers, and plugin packaging metadata. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:80-93]
- BAD is not a service process; it is a skill-style orchestration layer that assumes BMad Method planning artifacts already exist. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:23-33]
- Its architecture is coordinator-centric:

```text
Planning artifacts + GitHub state
            |
            v
  Phase 0 dependency graph builder
            |
            v
   Coordinator ready-story selector
            |
            v
  Parallel story pipelines in worktrees
   create -> dev -> review -> PR/CI
            |
            v
   Optional sequential auto-merge
            |
            v
   wait / retro / continue loop
```

- The coordinator is intentionally thin and delegates almost everything to fresh-context subagents. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25]
- Phase 2's deeper pass found the strongest new signals in areas Phase 1 only touched lightly:
  - Harness-aware setup and config ownership live in one module-owned layer instead of being spread across workflow assets. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:21-93] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module.yaml:5-38]
  - Continuation is treated as a runtime contract with explicit timer/rate-limit branches. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-88]
  - Merge helpers actively migrate legacy config and prevent zombie markers within the active module boundary. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-config.py:230-275] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/scripts/merge-help-csv.py:176-212]
  - The repo has no semantic memory, governed retrieval layer, multi-level documentation taxonomy, or large validator stack. That absence matters because it shows what BAD can omit when it stays a thin domain module instead of a general planning/governance framework. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:25-32] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:63-78]

## 3. Findings Registry

### Phase 1 Findings

#### Finding F-001 — Tighten Coordinator Boundaries
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.opencode/agent/orchestrate.md`
- Priority: should-have
- Description: BAD's strongest orchestration lesson is the narrow coordinator contract: select work, spawn workers, manage timers, and report status, but do not become an implementation agent. Local orchestration already forbids direct implementation, yet it could state the boundary more explicitly for future long-running automation. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25] [SOURCE: .opencode/agent/orchestrate.md:36-46]
- Evidence: BAD uses coordinator-only responsibilities and pure-coordinator Phase 1; local orchestrate already enforces single-hop delegation but allows a broader read surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:177-205] [SOURCE: .opencode/agent/deep-research.md:28-42]

#### Finding F-002 — Add A Readiness Ledger Concept For Phased Work