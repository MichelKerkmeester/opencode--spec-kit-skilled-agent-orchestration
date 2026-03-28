---
title: "Checklist: Context Loader Sub-Agent (@context_loader) [007-explore-sub-agent/checklist]"
description: "checklist document for 007-explore-sub-agent."
trigger_phrases:
  - "checklist"
  - "context"
  - "loader"
  - "sub"
  - "agent"
  - "007"
  - "explore"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: Context Loader Sub-Agent (@context_loader)

> **Spec Folder:** `.opencode/specs/04--agent-orchestration/z_archive/007-explore-sub-agent/`
> **Created:** 2026-02-10
> **Note:** Originally scoped as `@explore`, renamed to `@context_loader` during implementation.

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **P0** Existing agent patterns analyzed (research/research.md, write.md, review.md)
- [x] **P0** Architecture designed via Sequential Thinking (8 thoughts)
- [x] **P0** Differentiation from @research clearly defined
- [x] **P0** Spec folder documentation created (Level 2)

<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Implementation — Agent Definition

- [x] **P0** File created at `.opencode/agent/context_loader.md` (renamed from explore.md)
- [x] **P0** YAML frontmatter follows peer agent pattern
- [x] **P0** Model set to `github-copilot/gpt-5.2-think-medium` (changed from original claude-sonnet-4.5 plan)
- [x] **P0** Mode set to `subagent`
- [x] **P0** Permissions: `write: deny`, `edit: deny` (READ-ONLY enforced)
- [x] **P0** Permissions: `read: allow`, `grep: allow`, `glob: allow`, `memory: allow`
- [x] **P0** Permission: `task: allow` (changed from deny — enables Active Dispatch)
- [x] **P0** §1 Core Identity defined
- [x] **P0** §2 Core Workflow defined (6-step: RECEIVE → MEMORY → CODEBASE → DISPATCH → SYNTHESIZE → DELIVER)
- [x] **P0** §3 Capability Scan with available tools
- [x] **P0** §4 Retrieval Modes (quick/medium/thorough)
- [x] **P0** §5 Agent Dispatch Protocol (Active Dispatch capability)
- [x] **P0** §6 Retrieval Strategy (3 layers: Memory → Codebase → Deep Memory)
- [x] **P0** §7 Output Format (Context Package)
- [x] **P1** §8 Integration with Orchestrator
- [x] **P1** §9 Rules & Constraints
- [x] **P1** §10 Anti-Patterns
- [x] **P1** §11 Related Resources

<!-- /ANCHOR:code-quality -->

## Implementation — Active Dispatch Upgrade

- [x] **P0** §5 Agent Dispatch Protocol added to context_loader.md
- [x] **P0** Dispatch allowlist: ONLY `@explore` (built-in) and `@research`
- [x] **P0** ANALYSIS-ONLY boundary enforced (never dispatch for implementation)
- [x] **P0** Dispatch limits defined: quick=0, medium=2, thorough=3
- [x] **P0** Structured dispatch prompt format with 4-section context
- [x] **P0** Result collection pattern documented
- [x] **P1** Dispatch limits bumped (+1): medium 1→2, thorough 2→3
- [x] **P1** All 7 locations in context_loader.md updated consistently for limit bump

## Implementation — Ecosystem Updates

- [x] **P0** orchestrate.md: `@context_loader` added to Project-Specific Agents table
- [x] **P0** orchestrate.md: Agent Selection Matrix updated (Context loading, Quick file search)
- [x] **P0** orchestrate.md: Rules 1 & 2 updated (`@explore` → `@context_loader`)
- [x] **P0** orchestrate.md: File Existence Check, OnError trigger, Example Task #1 updated
- [x] **P0** orchestrate.md: Routing Logic #9, Summary block, Pattern A, Anti-pattern updated
- [x] **P1** orchestrate.md: Two-Tier Dispatch Model subsection added (~line 265)
- [x] **P0** AGENTS.md (Public): `@context_loader` row + quick reference entry added
- [x] **P0** AGENTS.md (anobel.com): `@context_loader` row + quick reference entry added
- [x] **P0** AGENTS.md (Barter/coder): `@context_loader` row + quick reference entry added

## Quality

- [x] **P0** No placeholder text ([TODO], [PLACEHOLDER], TBD) in context_loader.md
- [x] **P0** All Memory MCP tool references accurate in context_loader.md
- [x] **P0** Structural consistency with peer agents verified
- [x] **P0** 9 intentional `@explore` references in orchestrate.md reviewed and confirmed
- [x] **P1** Output format practical and CWB-compliant
- [x] **P1** Thoroughness levels have clear time and token budgets
- [x] **P1** Mermaid diagram for retrieval workflow included

## Skills Audit

- [x] **P1** All 9 skill directories searched for agent references (10 agents dispatched in parallel)
- [x] **P1** 8/9 skills confirmed clean (zero named agent references)
- [x] **P1** `sk-doc/assets/opencode/agent_template.md` Table 1: Added @context_loader, @general, @handover
- [x] **P1** `sk-doc/assets/opencode/agent_template.md` Table 2: Added context_loader, general, handover
- [x] **P1** Both tables verified: all 9 agents present, no placeholders, formatting correct
- [x] **P1** Zero stale `@explore` references found in any skill directory

## Commands & Install Guides Audit

- [x] **P1** All 38 command/YAML files searched for agent references (4 agents dispatched in parallel)
- [x] **P1** 18 command .md files confirmed clean
- [x] **P1** 20 command .yaml files confirmed clean (4× `subagent_type: explore` correctly reference built-in Task tool type)
- [x] **P1** `.opencode/command/agent_router.md` confirmed clean (external AI systems only)
- [x] **P1** `SET-UP - Opencode Agents.md`: Pass 1 — @context_loader added to 8 locations (agent table, quick reference, ls output, directory tree, etc.)
- [x] **P1** `SET-UP - Opencode Agents.md`: Pass 2 — 3× REPLACE Quick Start refs + 5× ADD alongside notes
- [x] **P1** `SET-UP - Opencode Agents.md`: First Use items consolidated and renumbered

## Symlink

- [x] **P1** Symlink created: `.claude/agents/context_loader.md` → `../../.opencode/agent/context_loader.md`
- [x] **P1** Symlink follows same relative path pattern as all other agent symlinks

## Spec Folder Alignment

- [x] **P2** spec.md updated to reflect @context_loader rename and scope expansion
- [x] **P2** plan.md updated to reflect @context_loader rename and scope expansion

## Post-Implementation

- [x] **P1** Final verification grep passed (no misalignment across files)
- [x] **P1** tasks.md updated with Phases 6-8 work (T11c-T11f added)
- [x] **P1** checklist.md updated with commands audit, install guide, symlink sections
- [x] **P2** spec.md and plan.md updated for @context_loader rename
- [x] **P2** implementation-summary.md created
