# $refine TIDD-EC Prompt: 003-claude-code-mastery-project-starter-kit-main

## 2. Role

Act as a research specialist in AI-assisted development workflows, Claude Code conventions, hook-driven enforcement, command-system design, and context-efficient Manual-First Development (MDD) patterns. Operate as a packet-local analyst for `Code_Environment/Public`, with strong attention to evidence, workflow ergonomics, safety rules, and adoption cost.

## 3. Task

Research the Claude Code Mastery Project Starter Kit external repo and identify concrete improvements for this repository's own Claude Code setup, especially:

- `CLAUDE.md`
- `.claude/settings.local.json`
- `.opencode/command/`
- `.opencode/agent/`
- `.opencode/skill/scripts/skill_advisor.py`
- Spec Kit memory, handover, and deep-research workflows

The goal is not to copy the starter kit wholesale. The goal is to extract the best ideas from its MDD workflow, hook architecture, command system, AI monitor, and `CLAUDE.md` rulebook, then judge what `Code_Environment/Public` should adopt now, prototype later, or reject.

## 4. Context

### 4.1 System Description

Treat the external starter kit as a Claude-centric workflow scaffold with these relevant traits:

- `27` slash commands under `.claude/commands/`
- `9` deterministic hooks wired through `.claude/settings.json`
- A central `CLAUDE.md` that acts as an operating rulebook and team memory
- MDD: `Document -> Audit -> Analyze -> Fix -> Verify`
- Context compression claims of roughly `20K -> 200` tokens by reading one structured feature doc instead of dozens of source files
- Incremental writes to disk during audits so notes survive context compaction
- A live AI monitor via `pnpm ai:monitor` and `/what-is-my-ai-doing`
- Workflow-specific agents such as `code-reviewer` and `test-writer`
- Featured MCP integrations including ClassMCP and StrictDB-MCP
- Starter-kit/project command scoping via YAML frontmatter

Important source anchors in the external repo:

- `README.md`
- `CLAUDE.md`
- `.claude/settings.json`
- `.claude/commands/`
- `.claude/hooks/`
- `.claude/agents/`
- `.mdd/docs/`
- `package.json`

### 4.2 Cross-Phase Awareness Table

Use the full 9-phase packet map below to avoid duplicate analysis and to tag overlap intentionally.

| Phase | External target | This phase's relationship to it |
| --- | --- | --- |
| 001 | `001-agent-lightning-main` | Separate sibling packet. Only mention if phase 003 evidence directly overlaps agent parallelism, worktree isolation, or session orchestration. |
| 002 | `002-babysitter-main` | Separate sibling packet. Only mention if the starter kit's AI monitor or guardrail flows resemble supervisor-style oversight patterns. |
| 003 | `003-claude-code-mastery-project-starter-kit-main` | Primary focus. Own MDD, `.claude/commands`, `.claude/hooks`, starter-kit `CLAUDE.md`, AI monitor, and Claude-specific workflow improvements. |
| 004 | `004-get-it-right-main` | Separate sibling packet. Only mention if verification loops, review discipline, or correction workflows directly overlap. |
| 005 | `005-intellegix-code-agent-toolkit-master` | Explicit overlap packet for command-system analysis. In phase 003, capture Claude-specific command lessons, but flag broader command taxonomy, packaging, or command-registry findings for phase 005. |
| 006 | `006-ralph-main` | Separate sibling packet. Only mention if runtime bootstrapping, operator workflows, or repo-level automation clearly intersect this starter kit. |
| 007 | `007-relay-main` | Separate sibling packet. Only mention if session relay, handoff, or routing patterns materially overlap. |
| 008 | `008-bmad-autonomous-development` | Explicit overlap packet for skills and autonomous workflow design. In phase 003, note starter-kit agent/skill support patterns, but route generalized skill-system conclusions to phase 008. |
| 009 | `009-xethryon` | Separate sibling packet. Only mention if memory, orchestration, or command-control patterns directly align. |

Cross-phase rule:

- Do not do another packet's deep dive.
- Do tag overlaps when they materially affect commands, skills, or workflow adoption sequencing.
- Do preserve phase 003's ownership over Claude-specific MDD, hook, and rulebook analysis.

### 4.3 What This Repo Already Has

Assume `Code_Environment/Public` already has significant workflow infrastructure, but organized differently from the starter kit:

- Root `CLAUDE.md` with hard gates, spec-folder requirements, skill routing, memory save rules, and completion verification
- `.claude/CLAUDE.md` as Claude-specific recovery notes layered on top of the root rulebook
- `.claude/settings.local.json` with `PreCompact`, `SessionStart`, and `Stop` hooks for recovery and context injection
- `.opencode/command/` with `22` markdown command files grouped into `create`, `improve`, `memory`, and `spec_kit`
- `.opencode/agent/` with `12` custom agents such as `deep-research`, `deep-review`, `debug`, `handover`, `review`, and `speckit`
- `skill_advisor.py` for Gate 2 skill routing
- Spec Kit Memory, code graph tooling, CocoIndex, handover, resume, and deep-research workflows

This means the research should compare equivalent capabilities, not just count features. The most important comparison is architecture:

- starter kit: Claude-first `.claude/commands` + `.claude/hooks` + `.mdd/`
- this repo: cross-runtime `CLAUDE.md` + `.opencode/command` + `.opencode/agent` + Spec Kit Memory + startup hooks

## 5. Instructions

Follow these steps in order and keep the analysis evidence-first.

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main` as the already-approved phase folder. Do not create a new packet and do not ask the spec-folder question again.
2. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/claude-code-mastery-project-starter-kit-main` as read-only.
3. Start with the external `CLAUDE.md`. Extract how it structures rules, quick references, project structure, command scope, and team-memory feedback loops.
4. Compare that external `CLAUDE.md` side-by-side with this repo's `CLAUDE.md` and `.claude/CLAUDE.md`. Highlight differences in gate style, recovery model, enforcement style, rule specificity, and update discipline.
5. Inventory the external `.claude/commands/` directory. Confirm the command count, identify the highest-value commands, and note how `scope: project` versus `scope: starter-kit` changes distribution behavior.
6. Compare the starter kit command surface against this repo's `.opencode/command/README.txt`, `.opencode/command/spec_kit/README.txt`, and relevant command entrypoints such as `.opencode/command/improve/prompt.md`. Focus on workflow ergonomics, discoverability, distribution model, and execution-mode design.
7. Read the external `.claude/commands/mdd.md` in detail. Use it as the main reference for MDD mechanics, audit flow, test-skeleton generation, plan approval, and incremental notes-to-disk behavior.
8. Inventory the external hook system using `.claude/settings.json` plus the hook scripts in `.claude/hooks/`. Confirm all `9` hooks and map them to trigger points such as `PreToolUse`, `PostToolUse`, and `Stop`.
9. Compare that hook architecture against this repo's `.claude/settings.local.json`. Be explicit about the difference between enforcement hooks in the starter kit and recovery/context hooks in this repo.
10. Read representative starter-kit hooks including branch protection, lint-on-save, secrets blocking, and E2E or port guards. Judge which patterns could be transplanted into `Code_Environment/Public` without fighting the existing Spec Kit gate system.
11. Read the external `README.md` sections on MDD, AI monitor, command usage, and `CLAUDE.md` rules. Use `package.json` to confirm scripts such as `pnpm ai:monitor`, `test:e2e`, and fixed test-port conventions.
12. Read the `.mdd/` artifacts, especially a real doc under `.mdd/docs/`, and compare that workflow to this repo's spec-folder, memory, deep-research, handover, and resume system. Do not assume `.mdd/` is a drop-in replacement for Spec Kit.
13. Read the starter-kit support roles under `.claude/agents/` and any starter-kit skills that directly support workflow execution. Compare them to this repo's `.opencode/agent/` model and `skill_advisor.py` routing. Keep general skill-system conclusions clearly tagged as overlap with phase `008`.
14. For every meaningful finding, include exact source paths, a crisp comparison to the matching local file or subsystem, and one recommendation label: `adopt now`, `prototype later`, or `reject`.
15. Throughout the research, keep focus on AI workflow infrastructure. Do not spend time comparing tech-stack starter templates such as React, Vue, Svelte, Go, or Python scaffolds unless they directly affect Claude workflow behavior.

## 6. Research Questions

Answer these questions directly in the resulting research output.

1. What makes the starter kit's MDD workflow materially different from this repo's existing spec-folder plus deep-research workflow?
2. Which parts of the starter kit's `20K -> 200` context-compression story are real workflow primitives versus marketing shorthand?
3. How does the starter kit use `.mdd/` artifacts and incremental writes to survive context compaction, and what is the closest equivalent in this repo today?
4. Which hook patterns are strongest candidates for adoption in `Code_Environment/Public`: secret blocking, branch protection, lint-on-save, E2E gating, port checks, env sync, or something else?
5. How is the starter kit command system organized, distributed, and documented, and what lessons apply to `.opencode/command/`?
6. How does the starter kit structure `CLAUDE.md` rules so they are easy for Claude Code to obey, and what should be borrowed or avoided in this repo's own rulebook?
7. How useful is the starter kit's AI monitor in practice, and is there a comparable observability gap in this repo?
8. What does the starter kit do with project-versus-kit command scoping that this repo currently lacks?
9. What do the starter kit's small dedicated agents contribute that this repo's broader custom-agent system does not already cover?
10. How should pre-deploy gates, test-port isolation, and E2E guardrails be adapted for this repo without importing starter-kit assumptions blindly?
11. What MCP integration patterns from ClassMCP or StrictDB-MCP are worth imitating at the prompt or command level, even if the exact packages are not adopted?
12. Which findings clearly overlap with phase `005` or phase `008`, and how should those overlaps be tagged without diluting phase `003` ownership?

## 7. Do's

- Do compare `CLAUDE.md` rules side-by-side, not in isolation.
- Do examine how the starter kit wires hooks through `.claude/settings.json`, not just the shell scripts individually.
- Do study the MDD compression claim using actual workflow artifacts: `README.md`, `.claude/commands/mdd.md`, and `.mdd/docs/`.
- Do inspect how command frontmatter uses `scope:` and how distribution behavior follows from that metadata.
- Do compare command discoverability between `.claude/commands/` and `.opencode/command/`.
- Do compare hook intent between starter-kit enforcement hooks and this repo's recovery hooks.
- Do call out when a finding is Claude-specific versus cross-runtime.
- Do distinguish ideas that improve prompt ergonomics from ideas that require runtime or tooling changes.
- Do tag command-heavy overlap with phase `005`.
- Do tag skill-heavy overlap with phase `008`.

## 8. Don'ts

- Don't compare React, Vue, Svelte, Go, Python, or other stack templates unless the finding directly changes AI workflow infrastructure.
- Don't confuse the starter kit's `CLAUDE.md` with this repo's `CLAUDE.md`. They serve similar purposes, but their conventions, scope, and runtime assumptions differ.
- Don't assume `.mdd/` should replace Spec Kit folders, memory files, or deep-research.
- Don't reduce the research to feature counts alone. Architecture and adoption cost matter more than raw totals.
- Don't recommend importing hooks that duplicate or conflict with existing root-gate behavior without explaining the interaction.
- Don't hide overlap. If a finding really belongs with command-system packaging or skills architecture, tag phase `005` or `008`.
- Don't use vague evidence like "the repo seems to..." or "it probably...". Use exact file paths.
- Don't dispatch sub-agents. This is a depth-1 leaf task and must be executed directly.

## 9. Examples

Use findings in this style.

### Example A - MDD context compression

- **Evidence:** `README.md:118-189`, `.claude/commands/mdd.md`, `.mdd/docs/03-database-layer.md`
- **What it does:** The starter kit compresses feature context into a single structured `.mdd/docs/*.md` file, then writes audit notes to disk every two features so context compaction does not erase progress.
- **Why it matters here:** This repo already has spec folders, memory saves, handover, and deep-research artifacts, but it does not yet offer a simple Claude-first "write notes to disk while auditing" convention.
- **Recommendation:** `prototype later`
- **Affected area:** `CLAUDE.md`, `.opencode/command/spec_kit/`, handover or research workflows
- **Risk / cost:** Medium. The concept is useful, but `.mdd/` must not undercut Spec Kit governance.

### Example B - hook-based enforcement

- **Evidence:** `.claude/settings.json`, `.claude/hooks/check-branch.sh`, `.claude/hooks/lint-on-save.sh`, `.claude/hooks/verify-no-secrets.sh`
- **What it does:** The starter kit enforces branch, lint, secret, and E2E behaviors through deterministic Claude hook triggers instead of relying only on prose rules.
- **Why it matters here:** This repo's `.claude/settings.local.json` currently focuses on recovery hooks (`PreCompact`, `SessionStart`, `Stop`) rather than edit-time or commit-time enforcement.
- **Recommendation:** `adopt now` for the strongest low-risk candidates, or `prototype later` if root-gate interaction is unclear
- **Affected area:** `.claude/settings.local.json`, `CLAUDE.md`
- **Risk / cost:** Low to medium depending on whether the hook duplicates an existing gate.

## 10. Constraints

- Work only inside the approved phase folder for writable outputs.
- Treat the external starter-kit repo as read-only.
- Use exact file-path evidence for every substantive claim.
- Prefer comparing equivalent surfaces: rules to rules, commands to commands, hooks to hooks, agents to agents, workflow artifacts to workflow artifacts.
- Keep all packet paths under `999-agentic-system-upgrade` with no legacy packet-root references.
- Maintain RICCE completeness: Role, Instructions, Context, Constraints, and Examples must remain explicit in the research process and in the final research write-up.
- Maintain TIDD-EC completeness: Task, Instructions, Do's, Don'ts, Examples, and Context must be visibly reflected in the work product.
- Execute directly as a LEAF agent at depth `1`; do not delegate or spawn sub-agents.

## 11. Deliverables

Produce research outputs that include all of the following:

1. A concise summary of the starter kit's Claude workflow model.
2. A `CLAUDE.md` comparison section against this repo's `CLAUDE.md` and `.claude/CLAUDE.md`.
3. A command-system comparison section covering command counts, organization, scope, and high-value command patterns.
4. A hook-architecture comparison section covering triggers, enforcement goals, and portability.
5. An MDD section covering `.mdd/`, compression, incremental writes, and how that maps to Spec Kit workflows.
6. A support-systems section covering AI monitor, starter-kit agents, and MCP integrations.
7. A recommendation matrix with `adopt now`, `prototype later`, and `reject`.
8. An overlap log that explicitly tags findings for phase `005` and phase `008` when appropriate.

## 12. Evaluation

Evaluate the finished research against this rubric before treating it as complete.

| Dimension | Target |
| --- | --- |
| TIDD-EC completeness | All required sections are materially addressed, not implied |
| RICCE completeness | Role, Instructions, Context, Constraints, and Examples are explicit and usable |
| Evidence quality | Exact file paths, concrete behaviors, no hand-wavy claims |
| Comparison depth | External behavior is always compared to a real local equivalent |
| Domain focus | Research stays on AI workflow infrastructure, not generic stack templates |
| Overlap discipline | Command findings tagged for `005`, skill findings tagged for `008` when needed |
| Actionability | Recommendations are specific enough to feed later planning packets |
| CLEAR score | Target `>= 40/50` |

Use this CLEAR self-check:

- **Correctness:** Are the claims grounded in the cited files?
- **Logic:** Does each recommendation follow from the comparison?
- **Expression:** Is the research easy to scan and precise?
- **Arrangement:** Are sections ordered around decision-making, not note dumping?
- **Reusability:** Can later packets use the findings without redoing the same repo reading?

## 13. Completion Bar

The task is complete only when all of the following are true:

- The research uses `999-agentic-system-upgrade` everywhere with no legacy packet-root references.
- External `CLAUDE.md`, `.claude/commands/`, `.claude/hooks/`, `.mdd/`, `README.md`, and `package.json` were all meaningfully examined.
- This repo's `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/settings.local.json`, `.opencode/command/`, `.opencode/agent/`, and `skill_advisor.py` were used as comparison anchors.
- The final analysis distinguishes `adopt now`, `prototype later`, and `reject`.
- Phase overlap with `005` and `008` is explicitly handled.
- The analysis stays focused on Claude workflow infrastructure and MDD patterns.
- No writable changes occur outside this phase folder.
