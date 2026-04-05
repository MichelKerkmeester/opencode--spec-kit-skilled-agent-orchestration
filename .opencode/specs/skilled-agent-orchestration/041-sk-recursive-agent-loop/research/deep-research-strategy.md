# Deep Research Strategy - Session Tracking Template

Runtime template copied to `research/` during initialization. Tracks research progress across iterations.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Serve as the persistent brain for researching how `autoagent-main` performs automated agent iteration, how that maps to our `.opencode/agent` system, and whether `sk-agent-improver` is feasible.

### Usage

- Init the packet with key questions, boundaries, and known context.
- Feed each iteration's findings into reducer-owned sections through the normal deep-research workflow.
- Keep the final recommendation grounded in explicit code and command evidence rather than aspiration.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Compare `autoagent-main` automatic agent iteration with our `.opencode/agent` system and assess feasibility of a new skill named `sk-agent-improver`.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?
- [x] Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure?
- [x] What capabilities are missing if we want a reliable `sk-agent-improver` rather than a one-off research packet?
- [x] What should the MVP scope, boundaries, and success metric be for a new skill in this repo?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Re-implement `autoagent-main` inside this packet.
- Modify `.opencode/agent` or add a new skill during this research run.
- Design a benchmark dataset in full detail.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Stop when the external loop, internal mapping, gap analysis, MVP recommendation, and completed-continue extension all converge on a stable evaluator-first recommendation with direct file evidence.
- Stop immediately if the packet state becomes contradictory or reducer outputs fail repeatedly.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?
- Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure?
- What capabilities are missing if we want a reliable `sk-agent-improver` rather than a one-off research packet?
- What should the MVP scope, boundaries, and success metric be for a new skill in this repo?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading `README.md`, `program.md`, and both harness files together exposed the true control plane, score loop, and fixed-boundary model quickly because each file explains a different part of the experiment contract. (iteration 1)
- Reading the skill, runtime agent, skills library, and create command together made the "easy vs hard" split obvious: loop scaffolding and skill registration exist, but the target metric and mutation boundaries do not. (iteration 2)
- Reframing the problem around evaluator availability and mutable-surface discipline turned a vague "can we make this?" question into a concrete MVP boundary. (iteration 3)
- A second pass over `program.md` uncovered the parts that matter most for translation: variance-aware ledgering, evidence-preserving rejection, and explicit simplicity rules. (iteration 4)
- Tracing runtime mirrors and adjacent control files made it obvious that `.opencode/agent` is the right primary boundary and that parity is a later-phase concern. (iteration 5)
- Looking for validators and test contracts around generated artifacts surfaced a far more credible evaluator path than trying to score raw agent prose. (iteration 6)
- Looking at create workflows, templates, and reducer-managed state made the answer much less abstract than reasoning from `program.md` alone. (iteration 7)
- Reading the formal state-format and convergence references made it easy to separate plumbing from policy. (iteration 8)
- Reading the repo's safety and documentation rules directly turned vague "be careful" guidance into concrete architecture requirements. (iteration 9)
- Comparing skill packaging rules to the deep-research architecture made it clear where the future loop would need to expand beyond a bare `SKILL.md`. (iteration 10)
- Comparing one highly templated workflow to one synthesis-heavy workflow made the phase-1 target choice much less ambiguous. (iteration 11)
- Mapping our recommendation onto existing gate/checklist behavior produced a rollout plan that feels native to the repo rather than imported from the external benchmark loop. (iteration 12)
- Reading the repo's safety model and reviewer boundary as first-class architecture constraints kept the recommendation honest. (iteration 13)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Semantic search over the imported external folder was not useful here; the local index did not return targeted hits for this small snapshot, so direct file inspection was more reliable. (iteration 1)
- Looking for an existing "agent improvement" skill name via broad ripgrep produced a lot of unrelated historical noise, so direct architectural files were more useful than keyword sweeps. (iteration 2)
- Treating the external repo as a drop-in template stayed misleading even in synthesis, because its single harness and benchmark assumptions do not map one-to-one onto our layered command/skill/runtime system. (iteration 3)
- The imported snapshot still lacks a real `results.tsv` sample, so some ledger details remain inferred from policy rather than observed from populated data. (iteration 4)
- Broad keyword search was noisier than reading runtime docs and config surfaces directly. (iteration 5)
- Searching for a direct "agent evaluator" surface came up empty; the current repo mostly scores outputs, not agent definitions themselves. (iteration 6)
- Broad searching for "manifest" and "generated from" found the right hints, but the architecture only clicked once the runtime/source split was read alongside the deep-research packet model. (iteration 7)
- Looking only at the live packet state is misleading because it hides how much logic lives in the shared references and reducer. (iteration 8)
- Looking only at agent files understates the strength of the surrounding workflow constraints. (iteration 9)
- The Copilot pass explored the right files but needed manual normalization into a packet-ready shape. (iteration 10)
- The delegated run returned more exploration trace than final structure, so the packet needed manual normalization. (iteration 11)
- The delegated pass again needed manual normalization because it surfaced the right source files but not a finished packet-ready summary. (iteration 12)
- The delegated critique surfaced strong source files but needed local synthesis to turn them into packet-quality guidance. (iteration 13)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Build the skill now and figure out the evaluator later" is a no-go path. The repo has too many safety and verification expectations to justify mutation-first experimentation. [SOURCE: AGENTS.md:14] [SOURCE: .opencode/agent/review.md:315] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: "Build the skill now and figure out the evaluator later" is a no-go path. The repo has too many safety and verification expectations to justify mutation-first experimentation. [SOURCE: AGENTS.md:14] [SOURCE: .opencode/agent/review.md:315]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Build the skill now and figure out the evaluator later" is a no-go path. The repo has too many safety and verification expectations to justify mutation-first experimentation. [SOURCE: AGENTS.md:14] [SOURCE: .opencode/agent/review.md:315]

### A generic "improve any agent prompt" MVP would blur together artifact generation, orchestration, and synthesis. The first experiment needs a much narrower surface. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: A generic "improve any agent prompt" MVP would blur together artifact generation, orchestration, and synthesis. The first experiment needs a much narrower surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A generic "improve any agent prompt" MVP would blur together artifact generation, orchestration, and synthesis. The first experiment needs a much narrower surface.

### A lone `program.md` is too weak for this repo. The existing command/skill architecture expects a small control bundle with human-authored policy plus machine-readable state and routing configuration. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:249] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A lone `program.md` is too weak for this repo. The existing command/skill architecture expects a small control bundle with human-authored policy plus machine-readable state and routing configuration. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:249]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A lone `program.md` is too weak for this repo. The existing command/skill architecture expects a small control bundle with human-authored policy plus machine-readable state and routing configuration. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:249]

### A pure prompt-quality evaluator is too subjective for a first loop. The repo already favors structural checks, deterministic tests, and thresholded quality scores over freeform prose judgment. [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:126] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:670] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A pure prompt-quality evaluator is too subjective for a first loop. The repo already favors structural checks, deterministic tests, and thresholded quality scores over freeform prose judgment. [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:126] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:670]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A pure prompt-quality evaluator is too subjective for a first loop. The repo already favors structural checks, deterministic tests, and thresholded quality scores over freeform prose judgment. [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:126] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:670]

### A self-grading improvement loop is incompatible with the repo's existing reviewer boundary. Mutation and scoring need separate roles or separate phases. [SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/agent/review.md:422] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A self-grading improvement loop is incompatible with the repo's existing reviewer boundary. Mutation and scoring need separate roles or separate phases. [SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/agent/review.md:422]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A self-grading improvement loop is incompatible with the repo's existing reviewer boundary. Mutation and scoring need separate roles or separate phases. [SOURCE: .opencode/agent/review.md:24] [SOURCE: .opencode/agent/review.md:422]

### A skill folder alone is probably insufficient if the loop owns lifecycle orchestration. The repo's established pattern for iterative workflows is skill + command + workflow + agent + scripts, not prose-only routing. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:239] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A skill folder alone is probably insufficient if the loop owns lifecycle orchestration. The repo's established pattern for iterative workflows is skill + command + workflow + agent + scripts, not prose-only routing. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:239]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A skill folder alone is probably insufficient if the loop owns lifecycle orchestration. The repo's established pattern for iterative workflows is skill + command + workflow + agent + scripts, not prose-only routing. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/command/create/sk-skill.md:239]

### Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:3] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:3]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:3]

### Broad overnight self-improvement remains the wrong framing. The extension work kept finding the same architectural boundary: narrow target first, then prove the scorer, then consider expansion. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Broad overnight self-improvement remains the wrong framing. The extension work kept finding the same architectural boundary: narrow target first, then prove the scorer, then consider expansion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad overnight self-improvement remains the wrong framing. The extension work kept finding the same architectural boundary: narrow target first, then prove the scorer, then consider expansion.

### Broad spec-doc mutation is a non-starter for the MVP because it would collide immediately with `@speckit` exclusivity and Gate 3 rules. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:63] [SOURCE: AGENTS.md:179] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Broad spec-doc mutation is a non-starter for the MVP because it would collide immediately with `@speckit` exclusivity and Gate 3 rules. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:63] [SOURCE: AGENTS.md:179]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad spec-doc mutation is a non-starter for the MVP because it would collide immediately with `@speckit` exclusivity and Gate 3 rules. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:63] [SOURCE: AGENTS.md:179]

### Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137]

### Copying deep-research convergence logic into an agent-improvement loop would optimize the wrong thing. Fresh-context orchestration is reusable; evidence-convergence semantics are not. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:121] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Copying deep-research convergence logic into an agent-improvement loop would optimize the wrong thing. Fresh-context orchestration is reusable; evidence-convergence semantics are not. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:121]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying deep-research convergence logic into an agent-improvement loop would optimize the wrong thing. Fresh-context orchestration is reusable; evidence-convergence semantics are not. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:121]

### Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28]

### I did not find a ready-made numeric evaluator for `.opencode/agent/*.md` directly. The strongest existing scoring surfaces measure outputs or artifact quality, not prompt text in isolation. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: I did not find a ready-made numeric evaluator for `.opencode/agent/*.md` directly. The strongest existing scoring surfaces measure outputs or artifact quality, not prompt text in isolation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not find a ready-made numeric evaluator for `.opencode/agent/*.md` directly. The strongest existing scoring surfaces measure outputs or artifact quality, not prompt text in isolation.

### I did not locate a checked-in sync/generation workflow that deterministically refreshes all runtime copies from `.opencode/agent`, which keeps mirror maintenance a live drift risk. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/install_guides/README.md:1421] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: I did not locate a checked-in sync/generation workflow that deterministically refreshes all runtime copies from `.opencode/agent`, which keeps mirror maintenance a live drift risk. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/install_guides/README.md:1421]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: I did not locate a checked-in sync/generation workflow that deterministically refreshes all runtime copies from `.opencode/agent`, which keeps mirror maintenance a live drift risk. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/install_guides/README.md:1421]

### Jumping directly from design to auto-editing is not compatible with the repo's current safety model. The first executable phase needs to score proposals without mutating canonical files. [SOURCE: AGENTS.md:14] [SOURCE: AGENTS.md:179] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Jumping directly from design to auto-editing is not compatible with the repo's current safety model. The first executable phase needs to score proposals without mutating canonical files. [SOURCE: AGENTS.md:14] [SOURCE: AGENTS.md:179] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Jumping directly from design to auto-editing is not compatible with the repo's current safety model. The first executable phase needs to score proposals without mutating canonical files. [SOURCE: AGENTS.md:14] [SOURCE: AGENTS.md:179] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:438]

### Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:35] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:35]

### The snapshot still does not expose the exact git rollback mechanic for rejected runs. The policy outcome is explicit, but the concrete reset/revert procedure remains implicit in this import. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:145] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:162] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The snapshot still does not expose the exact git rollback mechanic for rejected runs. The policy outcome is explicit, but the concrete reset/revert procedure remains implicit in this import. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:145] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:162]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The snapshot still does not expose the exact git rollback mechanic for rejected runs. The policy outcome is explicit, but the concrete reset/revert procedure remains implicit in this import. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:145] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:162]

### Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201]

### Treating `.opencode/agent`, `.claude/agents`, `.codex/agents`, and `.gemini/agents` as equal first-class mutation targets is too broad for an MVP; some are copies, some are format translations, and some behavior lives in adjacent control files. [SOURCE: .opencode/README.md:330] [SOURCE: .codex/config.toml:47] [SOURCE: .opencode/skill/cli-gemini/SKILL.md:277] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating `.opencode/agent`, `.claude/agents`, `.codex/agents`, and `.gemini/agents` as equal first-class mutation targets is too broad for an MVP; some are copies, some are format translations, and some behavior lives in adjacent control files. [SOURCE: .opencode/README.md:330] [SOURCE: .codex/config.toml:47] [SOURCE: .opencode/skill/cli-gemini/SKILL.md:277]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `.opencode/agent`, `.claude/agents`, `.codex/agents`, and `.gemini/agents` as equal first-class mutation targets is too broad for an MVP; some are copies, some are format translations, and some behavior lives in adjacent control files. [SOURCE: .opencode/README.md:330] [SOURCE: .codex/config.toml:47] [SOURCE: .opencode/skill/cli-gemini/SKILL.md:277]

### Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:80] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:80]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:80]

### Treating keep/discard as a stateless "best score wins" rule is too shallow; the loop is designed to preserve evidence from rejected runs and to separate infra noise from actual harness changes. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:204] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating keep/discard as a stateless "best score wins" rule is too shallow; the loop is designed to preserve evidence from rejected runs and to separate infra noise from actual harness changes. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:204]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating keep/discard as a stateless "best score wins" rule is too shallow; the loop is designed to preserve evidence from rejected runs and to separate infra noise from actual harness changes. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:204]

### Treating packaging as the core risk would be misleading. The repo already knows how to package skills; the hard parts remain evaluator design, mutation boundary control, and promotion rules. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating packaging as the core risk would be misleading. The repo already knows how to package skills; the hard parts remain evaluator design, mutation boundary control, and promotion rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating packaging as the core risk would be misleading. The repo already knows how to package skills; the hard parts remain evaluator design, mutation boundary control, and promotion rules.

### Treating rollout as a single "MVP vs later" distinction is too coarse. The repo's existing workflows are already phaseful, and the improvement loop should inherit that discipline. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating rollout as a single "MVP vs later" distinction is too coarse. The repo's existing workflows are already phaseful, and the improvement loop should inherit that discipline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating rollout as a single "MVP vs later" distinction is too coarse. The repo's existing workflows are already phaseful, and the improvement loop should inherit that discipline.

### Treating runtime mirror directories as primary mutation targets would tangle the control plane immediately. The manifest has to distinguish canonical sources from derived runtime copies up front. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:41] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating runtime mirror directories as primary mutation targets would tangle the control plane immediately. The manifest has to distinguish canonical sources from derived runtime copies up front. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:41]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating runtime mirror directories as primary mutation targets would tangle the control plane immediately. The manifest has to distinguish canonical sources from derived runtime copies up front. [SOURCE: .opencode/README.md:330] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:41]

### Treating the existing findings registry as the final experiment ledger would blur key concepts. A mutation loop needs candidate IDs, evaluator outputs, best-so-far state, and promotion history, not just questions and findings. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the existing findings registry as the final experiment ledger would blur key concepts. A mutation loop needs candidate IDs, evaluator outputs, best-so-far state, and promotion history, not just questions and findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the existing findings registry as the final experiment ledger would blur key concepts. A mutation loop needs candidate IDs, evaluator outputs, best-so-far state, and promotion history, not just questions and findings.

### Using `@deep-research` as the first mutation target would make the evaluator problem harder, not easier. It is too open-ended for a phase-1 keep/discard contract. [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Using `@deep-research` as the first mutation target would make the evaluator problem harder, not easier. It is too open-ended for a phase-1 keep/discard contract. [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `@deep-research` as the first mutation target would make the evaluator problem harder, not easier. It is too open-ended for a phase-1 keep/discard contract. [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:3] (iteration 1)
- Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:80] (iteration 1)
- Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28] (iteration 2)
- Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201] (iteration 2)
- Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] (iteration 3)
- Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:35] (iteration 3)
- The snapshot still does not expose the exact git rollback mechanic for rejected runs. The policy outcome is explicit, but the concrete reset/revert procedure remains implicit in this import. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:145] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:162] (iteration 4)
- Treating keep/discard as a stateless "best score wins" rule is too shallow; the loop is designed to preserve evidence from rejected runs and to separate infra noise from actual harness changes. [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:204] (iteration 4)
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

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Stop the completed-continue extension and synthesize the extra evidence into the packet report, reducer state, and final recommendation.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
- The repo already implements a disk-first iterative loop for deep research through `sk-deep-research`, a YAML workflow, and a LEAF `@deep-research` agent.
- Memory lookup suggests prior packet work exists around improving `sk-deep-research` and researching external auto-research patterns, but this packet should verify conclusions from first principles before adopting them.
- The completed-continue extension used `cli-copilot` with `gpt-5.4` at high reasoning effort in five waves of two delegated research passes, then normalized the results back into local packet artifacts.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 13
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Lifecycle mode: `completed-continue` from run 3
- Current generation: 2
- Started: 2026-04-03T12:06:08Z
<!-- /ANCHOR:research-boundaries -->
