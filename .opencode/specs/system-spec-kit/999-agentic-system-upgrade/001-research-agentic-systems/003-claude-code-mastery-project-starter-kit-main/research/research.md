---
title: "Deep Research Report — 003-claude-code-mastery-project-starter-kit-main"
description: "10-iteration research of the Claude Code Mastery Project Starter Kit for system-spec-kit improvement opportunities. 8 actionable findings, 2 rejected."
importance_tier: "important"
contextType: "research"
---

# Deep Research Report — 003-claude-code-mastery-project-starter-kit-main

## 1. Executive Summary
- External repo: `claude-code-mastery-project-starter-kit-main`; a Claude-first starter kit centered on `.claude/commands`, `.claude/hooks`, `.mdd/`, and a dense `CLAUDE.md` rulebook. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:14-37] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:92-104]
- Iterations executed: 10 of 10
- Stop reason: max_iterations
- Total actionable findings: 8
- Must-have: 1 | Should-have: 5 | Nice-to-have: 2 | Rejected: 2
- Top 3 adoption opportunities for system-spec-kit:
  - Add Claude-only secret guardrails to `.claude/settings.local.json` and companion hooks. Origin: iteration 006.
  - Add command audience/distribution metadata so help and docs can become more runtime-aware and less static. Origin: iteration 008. Overlap: phase `005`.
  - Introduce a lightweight working-brief artifact so packets retain the local durability model but become easier to scan during long Claude sessions. Origin: iterations 003-004.

## 2. External Repo Map
- Core surfaces:
  - `CLAUDE.md` acts as the main Claude-facing rulebook with scripts, command quick-reference, and project-specific rules. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-31] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:76-103]
  - `.claude/commands/` contains 27 command files; `help.md` dynamically reads command frontmatter and distinguishes `scope: project` from `scope: starter-kit`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:96-104] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-25]
  - `.claude/settings.json` wires 9 deterministic hooks across `PreToolUse`, `PostToolUse`, and `Stop`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:2-64]
  - `.mdd/` provides small structured docs and audit artifacts that support the Manual-First Development workflow. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:150-189] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-20]
  - `.claude/agents/` is intentionally tiny: one reviewer and one test writer. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/code-reviewer.md:1-6] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/test-writer.md:1-6]

```text
external/
├── CLAUDE.md
├── .claude/
│   ├── commands/
│   ├── hooks/
│   ├── agents/
│   └── settings.json
├── .mdd/docs/
├── project-docs/
├── src/
└── package.json
```

Architecture pattern:
- Claude-facing operator rulebook (`CLAUDE.md`)
- Metadata-tagged command surface (`.claude/commands/*.md`)
- Deterministic enforcement hooks (`.claude/settings.json` + `.claude/hooks/*`)
- Lightweight working artifacts (`.mdd/`)
- Minimal specialist agents

## 3. Findings Registry

### Finding F-001 — Add A Claude-Only Quick Reference Layer
- Origin iteration: `iteration-001.md`
- system-spec-kit target: `.claude/CLAUDE.md`
- Priority: should-have
- Description: The external starter kit keeps Claude-facing instructions highly compressed inside one file, while the local repo keeps governance in a stronger root `CLAUDE.md` and uses `.claude/CLAUDE.md` only as a supplement. The local architecture should stay intact, but `.claude/CLAUDE.md` should become a sharper Claude-only operator surface that mirrors the most actionable recovery, tool-routing, and command-entry guidance from the root file. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md:11-31] [SOURCE: CLAUDE.md:34-56] [SOURCE: CLAUDE.md:72-81] [SOURCE: .claude/CLAUDE.md:5-14]

### Finding F-002 — Add A Guided Doc-First Front Door Without Replacing Spec Kit
- Origin iteration: `iteration-002.md`
- system-spec-kit target: `.opencode/command/spec_kit/README.txt`
- Priority: should-have
- Description: The external `/mdd` command is a memorable, guided entry point that asks consolidated questions, writes a working doc, generates tests, and presents a named-step plan before coding. Local Spec Kit is more robust but more fragmented from a new operator's perspective. A new front-door workflow or documented entry mode could route users into the existing research/plan/implement lifecycle with less cognitive overhead. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:44-71] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/mdd.md:71-131] [SOURCE: .opencode/command/spec_kit/README.txt:43-46] [SOURCE: .opencode/command/spec_kit/README.txt:121-159]

### Finding F-003 — Add A Lightweight Compressed-Brief Pattern, Not A Token Slogan
- Origin iteration: `iteration-003.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- Priority: nice-to-have
- Description: The external "20K -> 200" message is partly marketing, but the actual workflow primitives are real: concise structured briefs, periodic note-to-disk, and resumable recovery. `system-spec-kit` already has stronger state and compaction infrastructure, so the right adoption is a lightweight compressed-brief convention, not copied token claims. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:116-149] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:187-189] [SOURCE: .opencode/command/spec_kit/deep-research.md:196-205] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-225]

### Finding F-004 — Introduce A Lightweight Working-Brief Template
- Origin iteration: `iteration-004.md`
- system-spec-kit target: `.opencode/skill/system-spec-kit/templates/`
- Priority: should-have
- Description: The local repo already outclasses `.mdd/` on continuity because it combines research packets, handover, and autosave. What it lacks is a lighter artifact shape that is easy to scan mid-session. A small working-brief template would improve ergonomics without weakening packet durability. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-13] [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/handover.md:42-58] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60-83]

### Finding F-005 — Keep Recovery Hooks, Add A Thin Enforcement Layer
- Origin iteration: `iteration-005.md`
- system-spec-kit target: `.claude/settings.local.json`
- Priority: should-have
- Description: The external hook system and the local hook system solve different problems. The external starter kit excels at deterministic enforcement during tool use; the local system excels at recovery, continuity, and token-aware context injection. The best local move is a hybrid configuration: retain the existing recovery hooks and add only a minimal set of Claude-only enforcement hooks on top. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:2-64] [SOURCE: .claude/settings.local.json:7-42] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:111-173]

### Finding F-006 — Adopt Secret Guardrails First
- Origin iteration: `iteration-006.md`
- system-spec-kit target: `.claude/settings.local.json`
- Priority: must-have
- Description: The single best adopt-now finding is the external secret guardrail pair: block access to sensitive files before tool use, and scan staged files plus contents for secrets at stop time. Those two hooks are narrow, low-risk, and directly strengthen a repo that already carries powerful automation and memory tooling. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/block-secrets.py:13-29] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/block-secrets.py:49-64] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/verify-no-secrets.sh:42-77] [SOURCE: .claude/settings.local.json:7-42]

### Finding F-007 — Add Command Audience And Distribution Metadata
- Origin iteration: `iteration-008.md`
- system-spec-kit target: `.opencode/command/README.txt`
- Priority: should-have
- Description: The external repo's most transferable command-system lesson is metadata-driven distribution. Its help and update flows trust command frontmatter more than static prose. Local commands are well grouped but still documented statically. Adding metadata for audience, distribution, or runtime scope would make help surfaces more adaptive and less drift-prone. Overlap: this belongs partly to phase `005` because it touches broader command-system packaging. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/help.md:11-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/update-project.md:90-98] [SOURCE: .opencode/command/README.txt:38-49] [SOURCE: .opencode/command/spec_kit/README.txt:54-63]

### Finding F-008 — Expose Operator-Facing Observability
- Origin iteration: `iteration-009.md`
- system-spec-kit target: `.opencode/command/memory/manage.md`
- Priority: nice-to-have
- Description: The external repo turns AI monitoring into a user-visible workflow. The local repo already has pressure monitoring and other internal telemetry, but it does not present them as an operator-facing command surface. A read-only session-observability or telemetry-summary command would fill that gap without requiring RuleCatch itself. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/what-is-my-ai-doing.md:8-41] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:297-305] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/README.md:420-424] [SOURCE: .opencode/command/README.txt:40-49]

## 4. Rejected Recommendations

### Rejection R-001 — Do Not Copy Branch, Port, And E2E Hooks Wholesale
- Origin iteration: `iteration-007.md`
- Rationale: These hooks assume starter-kit-generated app repos with fixed branch expectations, `tests/e2e` conventions, and known port maps. They do not transfer cleanly to `system-spec-kit`, which already has its own git/spec governance and is not a generated application template. Only the port-conflict concept may deserve a future repo-specific variant. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-branch.sh:56-76] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/hooks/check-e2e.sh:46-69] [SOURCE: CLAUDE.md:129-175]

### Rejection R-002 — Do Not Import The External Mini-Agent Architecture
- Origin iteration: `iteration-010.md`
- Rationale: The local repo already has a richer agent system plus formal skill routing. Importing the external two-agent model would reduce capability rather than improve it. The worthwhile borrow is stylistic: concise role contracts and plain-language MCP install guidance. Overlap: the agent-contract portion belongs partly to phase `008`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/code-reviewer.md:1-6] [SOURCE: .opencode/agent/deep-research.md:22-32] [SOURCE: .opencode/skill/scripts/skill_advisor.py:7-16]

## 5. Cross-Phase Implications
- Phase `005` overlap:
  - Finding F-007 is partly a command-system packaging problem because it concerns command metadata, dynamic help, and distribution semantics across command families.
  - Any follow-on to expose operator-facing observability through commands may also intersect broader command taxonomy decisions.
- Phase `008` overlap:
  - Rejection R-002 still leaves a useful follow-on for phase `008`: tighten agent contracts so local agent docs communicate tool budget, role, and output expectations as tersely as the external mini-agents.
  - MCP install guidance packaging also overlaps phase `008` if it becomes part of skill or agent-adjacent workflow docs rather than command docs.

## 6. Recommended Next Step
Plan the secret-guardrail work first. It is the clearest adopt-now improvement because it has the best benefit-to-risk ratio, maps to a single concrete target (`.claude/settings.local.json` plus companion hook scripts), and complements rather than competes with the current recovery-first hook stack.
