# $refine TIDD-EC Prompt: 005-intellegix-code-agent-toolkit-master

## 2. Role

Act as a research specialist in autonomous agent loop architectures, multi-agent orchestration via git worktrees, budget-constrained execution, stagnation-aware control loops, and multi-model council patterns. Work like a systems analyst who can connect Python control-plane logic, Claude Code command surfaces, browser-bridge workflows, and portfolio governance into concrete improvement options for `Code_Environment/Public`.

## 3. Task

Research Intellegix's autonomous loop driver, multi-agent worktree orchestration, and council automation patterns to identify improvements for `Code_Environment/Public`'s agent orchestration, especially around budget enforcement, stagnation detection, session continuity, and multi-model coordination.

The goal is not to import Intellegix wholesale. The goal is to extract the strongest ideas from its automated loop, orchestrator suite, command taxonomy, council stack, browser-testing workflow, and portfolio tier system, then judge what this repo should `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

Treat the external Intellegix repo as a Claude Code control plane with these relevant traits:

- `automated-loop/` is the critical subsystem: Python runtime, NDJSON streaming, `--resume` session continuity, budget enforcement, model-aware scaling, timeout cooldowns, completion markers, and stagnation-driven exits.
- Core loop files: `automated-loop/loop_driver.py`, `ndjson_parser.py`, `state_tracker.py`, `research_bridge.py`, `config.py`, `multi_agent.py`.
- Exit-code contract: `0 = complete`, `1 = max iterations`, `2 = budget exceeded`, `3 = stagnation`.
- Orchestrator surface: `/orchestrator-new`, `/orchestrator`, `/orchestrator-multi`.
- Command surface: `31` markdown slash commands covering research, planning, review, implementation, handoff, council, Perplexity, portfolio, and specialized workflows.
- Council layer: `external/council-automation/` fans out to multiple frontier models and can synthesize with Opus via `external/council-automation/synthesis_prompt.md`.
- Browser layer: `external/mcp-servers/browser-bridge/` plus `external/commands/frontend-e2e.md` imply seven-tier browser testing and bridge-based automation.
- Governance layer: `portfolio/PORTFOLIO.md.example` constrains project effort by tier and phase.
- Behavioral evidence: `automated-loop/tests/` contains `377` tests and must be treated as part of the spec, not as optional support code.

Important source anchors:

- `external/README.md`, `external/automated-loop/loop_driver.py`
- `automated-loop/loop_driver.py`, `ndjson_parser.py`, `state_tracker.py`, `research_bridge.py`, `config.py`, `multi_agent.py`
- `automated-loop/tests/`
- `external/agents/orchestrator.md`, `external/agents/orchestrator-multi.md`
- `external/commands/orchestrator-new.md`, `external/commands/orchestrator.md`, `external/commands/orchestrator-multi.md`
- `hooks/orchestrator-guard.py`
- `external/council-automation/council_query.py`, `external/council-automation/synthesis_prompt.md`
- `external/portfolio/PORTFOLIO.md.example`, `external/portfolio/DECISIONS.md`

### 4.2 Cross-Phase Awareness Table

| Phase | External target | Relationship to phase 005 |
| --- | --- | --- |
| 001 | `001-agent-lightning-main` | Mention only when Intellegix loop metrics or state could later support agent optimization or instrumentation. |
| 002 | `002-babysitter-main` | Mention only when supervisory control or watchdog semantics overlap with budget/stagnation control. |
| 003 | `003-claude-code-mastery-project-starter-kit-main` | Explicit overlap packet for command-system ergonomics and Claude workflow UX; do not let generic command-packaging analysis dominate phase 005. |
| 004 | `004-get-it-right-main` | Mention only when retry, critique, or verification flows materially intersect convergence behavior. |
| 005 | `005-intellegix-code-agent-toolkit-master` | Primary focus: loop runtime, worktree orchestration, council flow, browser bridge, and governance tiers. |
| 006 | `006-ralph-main` | Mention only when bash-first or git-memory simplicity offers a meaningful alternative to Intellegix's heavier control plane. |
| 007 | `007-relay-main` | Mention only when transport, relay, or cross-agent messaging intersects worktree coordination or council fan-out. |
| 008 | `008-bmad-autonomous-development` | Mention only when coordinator/subagent patterns or structured project phases overlap with orchestrator or governance behavior. |
| 009 | `009-xethryon` | Mention only when memory persistence, swarm control, or self-reflection overlaps session continuity and loop-state control. |

Cross-phase rule:

- Do not do another packet's deep dive.
- Do tag overlap with phase `001` when a finding is really about agent optimization potential.
- Do tag overlap with phase `003` when a finding is really about command packaging, discoverability, or Claude workflow UX.

### 4.3 What This Repo Already Has

Assume `Code_Environment/Public` already has significant workflow infrastructure, but organized differently:

- `.opencode/agent/orchestrate.md` already defines a senior orchestration model with single-hop delegation and leaf-agent boundaries.
- `.opencode/skill/cli-copilot/` already provides multi-model delegation patterns through Copilot CLI.
- `.opencode/command/` and `.opencode/agent/` already provide a substantial command and agent surface.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` already provides strong spec-folder validation.
- `CLAUDE.md` and Spec Kit Memory already provide hard gates, retrieval, recovery, and completion discipline.

What this repo does **not** appear to have:

- No dedicated autonomous loop driver equivalent to `automated-loop/loop_driver.py`
- No explicit machine-readable exit-code contract for completion, exhaustion, budget, and stagnation
- No persistent loop budget enforcement comparable to `state_tracker.py` plus `config.py`
- No built-in stagnation detector or automatic session-rotation policy
- No first-class worktree-native runtime for launching and supervising isolated worker loops

The research should therefore focus on control-plane deltas, not on capabilities this repo already has in another form.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master` as the already-approved phase folder. Do not create a sibling packet and do not ask the spec-folder question again.
2. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/005-intellegix-code-agent-toolkit-master/external/intellegix-code-agent-toolkit-master` as read-only.
3. Read the repo root `AGENTS.md`, then `external/README.md`, then `external/automated-loop/loop_driver.py` so the overview is anchored before deeper code inspection.
4. Start the deep technical read in `automated-loop/`: `loop_driver.py`, `ndjson_parser.py`, `state_tracker.py`, `research_bridge.py`, `config.py`, `multi_agent.py`. Do this before reading commands or hooks.
5. Trace the full loop lifecycle: initialization and preflight -> Claude CLI NDJSON streaming -> event parsing -> state persistence -> budget checks -> research injection -> stagnation handling -> exit-code selection.
6. Confirm session continuity by tracing `session_id`, `last_session_id`, `--resume`, `.workflow/state.json`, `trace.jsonl`, and any session-rotation thresholds.
7. Inspect the budget and stagnation model in detail: per-iteration limits, total limits, timeout cooldowns, fallback model logic, completion markers, and exit codes `0`, `1`, `2`, `3`.
8. Read `automated-loop/tests/`, especially tests covering completion detection, budgets, resume, NDJSON parsing, research fallback, state tracking, file locking, and multi-agent behavior.
9. Only after the loop-runtime read is complete, move to `external/agents/orchestrator.md` and `external/agents/orchestrator-multi.md`. Keep loop runtime and supervising agents conceptually separate.
10. Then read `external/commands/orchestrator-new.md`, `external/commands/orchestrator.md`, `external/commands/orchestrator-multi.md`, plus representative command files for research, council, handoff, and portfolio status. Compare the `31` commands against this repo's `.opencode/command/` and `.opencode/skill/` surfaces.
11. Read `hooks/orchestrator-guard.py` and `hooks/inject-time.py` after the commands. Focus on role boundaries, path safety, and orchestration mode enforcement.
12. Read `external/council-automation/council_query.py`, `external/council-automation/council_config.py`, and `external/council-automation/synthesis_prompt.md`. Focus on council workflow design, multi-model fan-out, fallback, and Opus synthesis rather than browser internals.
13. Read `external/portfolio/PORTFOLIO.md.example` and `external/portfolio/DECISIONS.md` last. Capture how tier and phase restrictions constrain allowed work by project maturity.
14. Compare findings directly against `.opencode/agent/orchestrate.md`, `.opencode/skill/cli-copilot/`, `.opencode/command/`, `CLAUDE.md`, and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`. Make every recommendation comparative, not standalone.
15. Save outputs under this phase folder only. Use `research/research.md` as the canonical report, classify each finding as `adopt now`, `prototype later`, or `reject`, and explicitly tag overlap with phase `001` or phase `003` when appropriate.

Use this exact deep-research topic:

```text
Research Intellegix Code Agent Toolkit for Code_Environment/Public with focus on autonomous loop execution, NDJSON session continuity, budget enforcement, stagnation detection, git-worktree multi-agent orchestration, multi-model council automation, browser-bridge-enabled testing, and portfolio governance patterns that could strengthen Public's orchestration and operational safety without duplicating existing Spec Kit or CLI delegation capabilities.
```

## 6. Research Questions

1. How does the Intellegix loop decide that a run is complete, exhausted, over budget, or stagnant, and which parts of that exit contract would improve `Code_Environment/Public`?
2. How does the NDJSON pipeline preserve session continuity across iterations, and what would be required to add a similar control-plane seam around existing CLI workflows here?
3. How are per-iteration budget, total budget, timeout cooldowns, model-specific limits, and model fallback encoded in `config.py` and enforced in runtime state?
4. What exact stagnation-detection strategy is used, and how does its reset-then-exit behavior compare to this repo's current orchestration and review flows?
5. How does Intellegix isolate multi-agent work through git worktrees, file manifests, file locking, and orchestrator-only shared-file edits?
6. How do the orchestrator agents and orchestrator commands divide responsibility between planning, launch, monitoring, relaunch, merge, and reporting?
7. How does council automation fan out across multiple models, when does it synthesize with Opus, and what lessons apply to this repo's existing `cli-copilot` multi-model delegation patterns?
8. How should the `31` Intellegix commands be compared against this repo's current command and skill surfaces, and which missing workflows are actual control-plane gaps rather than UX differences?
9. What does the portfolio governance tier system add beyond this repo's current gate and validation model, especially around restricting over-engineering by project maturity?
10. What do the `automated-loop/tests/` reveal about intended runtime behavior that the README alone does not make explicit?
11. Which findings truly belong to phase `001` or phase `003`, and how should they be tagged without diluting phase `005` ownership of the loop-runtime analysis?

## 7. Do's

- Do trace the NDJSON streaming pipeline end to end, from Claude CLI output to parsed events to persisted state.
- Do inspect `loop_driver.py`, `state_tracker.py`, and `config.py` together when reasoning about budget enforcement.
- Do examine the explicit exit-code semantics `0 / 1 / 2 / 3` and tie them to real control-flow branches.
- Do study the stagnation algorithm and any reset, timeout, or session-rotation behavior in detail.
- Do treat `automated-loop/tests/` as behavioral evidence, not just implementation noise.
- Do compare the `31` commands against this repo's existing commands and skills rather than assuming more commands automatically means a better workflow.
- Do inspect the portfolio governance tier system for maturity-aware constraints and anti-overbuilding rules.

## 8. Don'ts

- Don't conflate the loop driver with the agents it drives. They are separate concerns.
- Don't spend most of the analysis on Perplexity browser automation details or Playwright internals; focus on the council and research patterns they enable.
- Don't ignore the `377` tests. They reveal intended behavior, edge cases, and safety assumptions.
- Don't flatten every Intellegix idea into generic "more orchestration." Distinguish loop-runtime primitives from prompt-only or command-only UX choices.
- Don't recommend importing heavy subsystems if this repo already has an equivalent capability through Spec Kit Memory, validation gates, or `cli-copilot`.
- Don't hide overlap with phase `001` or phase `003`; tag it explicitly when a finding crosses packet boundaries.
- Don't edit anything under `external/` or outside this phase folder.
- Don't dispatch sub-agents. This is a depth-1 leaf task and must be executed directly.

## 9. Examples

### Example A - Budget and exit contract

- **Evidence:** `automated-loop/loop_driver.py`, `automated-loop/state_tracker.py`, `automated-loop/config.py`, `automated-loop/tests/test_loop_driver.py`
- **What it does:** Intellegix enforces per-iteration and total budget thresholds in persistent loop state, then exits with explicit status codes for `complete`, `max-iterations`, `budget-exceeded`, and `stagnation`.
- **Why it matters here:** `Code_Environment/Public` has orchestration rules and validation, but not a reusable machine-readable runtime contract for autonomous loop outcomes.
- **Recommendation:** `prototype later`
- **Affected area:** `.opencode/agent/orchestrate.md`, future loop-runtime packet, operational reporting conventions
- **Risk / cost:** Medium. Requires a durable runtime state model and agreement on how autonomous loops interact with existing gates.

### Example B - Worktree-native multi-agent supervision

- **Evidence:** `external/agents/orchestrator-multi.md`, `external/commands/orchestrator-multi.md`, `external/automated-loop/multi_agent.py`, `external/hooks/orchestrator-guard.py`
- **What it does:** Intellegix splits large work across isolated git worktrees, assigns explicit file territories, blocks orchestrator source edits via a guard hook, and merges agents sequentially.
- **Why it matters here:** This repo has strong orchestration prompts, but not a first-class runtime for parallel isolated worker loops with merge-order semantics.
- **Recommendation:** `prototype later`
- **Affected area:** `.opencode/agent/`, `.opencode/command/`, future worktree orchestration design
- **Risk / cost:** Medium to high. High operational value, but substantial control-plane complexity.

## 10. Constraints

### Error Handling

- If CocoIndex is incomplete or unavailable for the external repo, fall back to targeted file reads, exact grep searches, and test inspection. Record the fallback in the research output.
- If any Intellegix script is difficult to execute locally, prefer static analysis of interfaces, config models, tests, and command contracts. Do not burn time recreating the full runtime.

### Scope Boundaries

- In scope: loop lifecycle, NDJSON parsing, state persistence, budget enforcement, stagnation detection, resume/session continuity, worktree isolation, orchestrator command architecture, council fan-out, Opus synthesis, browser-bridge-enabled testing posture, and governance tiers.
- Out of scope: generic Perplexity setup walkthroughs, Chrome extension implementation minutiae, unrelated game-build commands except as taxonomy evidence, and superficial README feature lists without code or test confirmation.

### Prioritization

- Favor findings that add missing control-plane capabilities to this repo.
- Mark low-risk workflow ideas as `adopt now`, runtime-heavy changes as `prototype later`, and redundant or operationally expensive ideas as `reject`.
- Any finding mostly about agent optimization belongs partly to phase `001`.
- Any finding mostly about command taxonomy or Claude workflow UX belongs partly to phase `003`.

## 11. Deliverables

1. A loop-lifecycle section covering initialization, NDJSON streaming, state tracking, research injection, stagnation detection, and exit behavior.
2. A budget-and-stagnation section explaining thresholds, fallbacks, and exit semantics with exact file-path evidence.
3. A multi-agent orchestration section covering worktrees, territory control, merge order, and guard hooks.
4. A command-surface comparison section covering the `31` Intellegix commands versus this repo's current command and skill surfaces.
5. A council-automation section covering fan-out, synthesis, and comparison to `cli-copilot`.
6. A governance section covering portfolio tiers, phase restrictions, and anti-overbuilding rules.
7. A recommendation matrix using `adopt now`, `prototype later`, and `reject`.
8. An overlap log explicitly tagging findings that should also inform phase `001` or phase `003`.

## 12. Evaluation

| Dimension | Target |
| --- | --- |
| TIDD-EC completeness | Task, Instructions, Do's, Don'ts, Examples, and Context are explicit and materially useful |
| RICCE completeness | Role, Instructions, Context, Constraints, and Examples are explicit and actionable |
| Evidence quality | Exact file paths, real control-flow behavior, and test-backed claims where applicable |
| Comparison depth | Every major Intellegix subsystem is compared against a real local equivalent or absence |
| Domain focus | The analysis stays centered on control-plane architecture, not generic Claude usage |
| Overlap discipline | Findings that bleed into phase `001` or `003` are tagged clearly |
| Actionability | Recommendations are specific enough to feed later implementation or prototype packets |
| CLEAR score | Target `>= 40/50` |

Use this CLEAR self-check:

- **Correctness:** Are the claims grounded in the cited code, commands, config, or tests?
- **Logic:** Does each recommendation follow from a real control-plane comparison?
- **Expression:** Is the research precise and easy to scan?
- **Arrangement:** Are the findings grouped by subsystem and decision relevance?
- **Reusability:** Could later packets use the output without repeating the same repo reading?

## 13. Completion Bar

- All paths stay under `999-agentic-system-upgrade`.
- The external analysis meaningfully covered `automated-loop/`, `agents/`, `commands/`, `hooks/`, `council-automation/`, and `portfolio/`.
- The loop lifecycle was traced from initialization to exit, including NDJSON parsing, state persistence, budget enforcement, and stagnation handling.
- The `31` command surface was compared against this repo's existing command and skill surfaces.
- Local comparison anchors included `.opencode/agent/orchestrate.md`, `.opencode/skill/cli-copilot/`, `CLAUDE.md`, and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.
- The final analysis distinguishes `adopt now`, `prototype later`, and `reject`.
- Cross-phase overlap with phase `001` and phase `003` is explicitly addressed.
- No writable changes occur outside this phase folder.
