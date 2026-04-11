---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Compare autoagent-main automatic agent iteration with our .opencode/agent system and assess feasibility of a new skill named sk-improve-agent.
- Started: 2026-04-03T12:06:08Z
- Status: COMPLETE
- Iteration: 13 of 13
- Session ID: dr-2026-04-03T12-22-09Z
- Parent Session: dr-2026-04-03T12-06-08Z
- Lifecycle Mode: completed-continue
- Generation: 2

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | External autoagent-main loop anatomy | external-loop | 1.00 | 4 | complete |
| 2 | Internal mapping to .opencode/agent and skills | internal-mapping | 0.90 | 4 | complete |
| 3 | Feasibility and MVP boundaries for sk-improve-agent | feasibility | 0.80 | 4 | insight |
| 4 | Deeper experiment contract inside autoagent-main | external-loop | 0.57 | 4 | complete |
| 5 | Runtime target topology and canonical mutation surface | internal-topology | 0.82 | 5 | complete |
| 6 | Evaluator candidates from existing validation surfaces | evaluator | 0.58 | 5 | insight |
| 7 | Control bundle and target manifest design | control-plane | 0.79 | 4 | insight |
| 8 | Reusable state architecture versus mutation-specific ledger | state-architecture | 0.42 | 4 | insight |
| 9 | Repo guardrails and evaluator independence constraints | guardrails | 0.22 | 5 | insight |
| 10 | Skill package shape and workflow surface | packaging | 0.38 | 4 | insight |
| 11 | Best first target surface for a phase-1 MVP | first-target | 0.46 | 4 | insight |
| 12 | Phased rollout and promotion gates | rollout | 0.34 | 4 | insight |
| 13 | Adversarial critique and go/no-go conditions | critique | 0.31 | 4 | insight |

- iterationsCompleted: 13
- keyFindings: 55
- openQuestions: 0
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/4
- [x] How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?
- [x] Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure?
- [x] What capabilities are missing if we want a reliable `sk-improve-agent` rather than a one-off research packet?
- [x] What should the MVP scope, boundaries, and success metric be for a new skill in this repo?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.46 -> 0.34 -> 0.31
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.31
- coverageBySources: {"code":43}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/program.md:3] (iteration 1)
- Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/program.md:80] (iteration 1)
- Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28] (iteration 2)
- Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201] (iteration 2)
- Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] (iteration 3)
- Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/program.md:35] (iteration 3)
- The snapshot still does not expose the exact git rollback mechanic for rejected runs. The policy outcome is explicit, but the concrete reset/revert procedure remains implicit in this import. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/program.md:145] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/program.md:162] (iteration 4)
- Treating keep/discard as a stateless "best score wins" rule is too shallow; the loop is designed to preserve evidence from rejected runs and to separate infra noise from actual harness changes. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/external/autoagent-main/program.md:204] (iteration 4)
- I did not locate a checked-in sync/generation workflow that deterministically refreshes all runtime copies from `.opencode/agent`, which keeps mirror maintenance a live drift risk. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/install_guides/README.md:1421] (iteration 5)
- Treating `.opencode/agent`, `.claude/agents`, `.codex/agents`, and `.gemini/agents` as equal first-class mutation targets is too broad for an MVP; some are copies, some are format translations, and some behavior lives in adjacent control files. [SOURCE: .opencode/README.md:330] [SOURCE: .codex/config.toml:47] [SOURCE: .opencode/skill/cli-gemini/SKILL.md:277] (iteration 5)
- A pure prompt-quality evaluator is too subjective for a first loop. The repo already favors structural checks, deterministic tests, and thresholded quality scores over freeform prose judgment. [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:126] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:670] (iteration 6)
- I did not find a ready-made numeric evaluator for `.opencode/agent/*.md` directly. The strongest existing scoring surfaces measure outputs or artifact quality, not prompt text in isolation. (iteration 6)
- A lone `program.md` is too weak for this repo. The existing command/skill architecture expects a small control bundle with human-authored policy plus machine-readable state and routing configuration. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:249] (iteration 7)
- Treating runtime mirror directories as primary mutation targets would tangle the control plane immediately. The manifest has to distinguish canonical sources from derived runtime copies up front. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:41] (iteration 7)
- Copying deep-research convergence logic into an agent-improvement loop would optimize the wrong thing. Fresh-context orchestration is reusable; evidence-convergence semantics are not. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:121] (iteration 8)
- Treating the existing findings registry as the final experiment ledger would blur key concepts. A mutation loop needs candidate IDs, evaluator outputs, best-so-far state, and promotion history, not just questions and findings. (iteration 8)
- A self-grading improvement loop is incompatible with the repo's existing reviewer boundary. Mutation and scoring need separate roles or separate phases. [SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/agent/review.md:422] (iteration 9)
- Broad spec-doc mutation is a non-starter for the MVP because it would collide immediately with `@speckit` exclusivity and Gate 3 rules. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:63] [SOURCE: AGENTS.md:179] (iteration 9)
- A skill folder alone is probably insufficient if the loop owns lifecycle orchestration. The repo's established pattern for iterative workflows is skill + command + workflow + agent + scripts, not prose-only routing. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:239] (iteration 10)
- Treating packaging as the core risk would be misleading. The repo already knows how to package skills; the hard parts remain evaluator design, mutation boundary control, and promotion rules. (iteration 10)
- A generic "improve any agent prompt" MVP would blur together artifact generation, orchestration, and synthesis. The first experiment needs a much narrower surface. (iteration 11)
- Using `@deep-research` as the first mutation target would make the evaluator problem harder, not easier. It is too open-ended for a phase-1 keep/discard contract. [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] (iteration 11)
- Jumping directly from design to auto-editing is not compatible with the repo's current safety model. The first executable phase needs to score proposals without mutating canonical files. [SOURCE: AGENTS.md:14] [SOURCE: AGENTS.md:179] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438] (iteration 12)
- Treating rollout as a single "MVP vs later" distinction is too coarse. The repo's existing workflows are already phaseful, and the improvement loop should inherit that discipline. (iteration 12)
- "Build the skill now and figure out the evaluator later" is a no-go path. The repo has too many safety and verification expectations to justify mutation-first experimentation. [SOURCE: AGENTS.md:14] [SOURCE: .opencode/agent/review.md:315] (iteration 13)
- Broad overnight self-improvement remains the wrong framing. The extension work kept finding the same architectural boundary: narrow target first, then prove the scorer, then consider expansion. (iteration 13)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Stop the completed-continue extension and synthesize the extra evidence into the packet report, reducer state, and final recommendation.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
