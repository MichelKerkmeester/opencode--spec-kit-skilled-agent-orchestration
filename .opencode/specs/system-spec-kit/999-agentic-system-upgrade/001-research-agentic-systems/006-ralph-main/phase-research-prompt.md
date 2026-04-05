# $refine TIDD-EC Prompt: 006-ralph-main

## 2. Role

You are a research specialist in minimal autonomous agent architectures, git-based memory persistence, Bash orchestration, and clean-context iteration patterns. Work like a systems analyst who can recognize when a deliberately simple loop is stronger than a richer runtime and translate Ralph's fresh-agent-per-iteration model into concrete improvements for `Code_Environment/Public`.

## 3. Task

Research Ralph's fresh-agent-per-iteration pattern and git-as-memory architecture to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around context management, lightweight orchestration, persistent learnings across iterations, PRD decomposition, and validation-first execution. Determine which patterns should be `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

Ralph is a compact autonomous agent loop implemented primarily as a single Bash script. Every iteration launches a brand-new AI instance with clean context, so persistence is pushed out of the live session and into durable artifacts: `git` history, append-only `progress.txt`, structured `prd.json`, feature branch naming, and archive folders. The harness contract lives in `prompt.md` and `CLAUDE.md`, while `skills/ralph/` and `skills/prd/` define how work is decomposed into small, verifiable stories. The system's key bets are minimal dependencies, one-story-per-iteration discipline, AGENTS-style learning propagation, and mandatory feedback loops such as typecheck, tests, CI, and browser verification for UI work.

### 4.2 Cross-Phase Awareness Table

| Phase | External system | Primary comparison angle | Overlap risk to manage |
| --- | --- | --- | --- |
| 001 | `001-agent-lightning-main` | optimization, tracing, reward loops | Do not drift into RL instrumentation; Ralph is about simple execution loops |
| 002 | `002-babysitter-main` | orchestration behavior and run control | Separate Ralph's lightweight Bash loop from Babysitter's event-sourced deterministic runtime |
| 003 | `003-claude-code-mastery-project-starter-kit-main` | harness prompts and project guidance | Focus on iteration templates and loop mechanics, not starter-kit packaging |
| 004 | `004-get-it-right-main` | correctness and retry discipline | Keep emphasis on state persistence and simple loop control, not generic refinement |
| 005 | `005-intellegix-code-agent-toolkit-master` | tool-assisted agent workflows | Avoid reframing Ralph as a toolkit; it is a tiny execution spine |
| 006 | `006-ralph-main` | fresh-agent loop, git-as-memory, progress accumulation | This phase owns the minimal Bash loop, archive/reset behavior, and one-story-per-iteration discipline |
| 007 | `007-relay-main` | handoff or transport between agents | Ralph is not a relay substrate; focus on repeated fresh invocation with durable artifacts |
| 008 | `008-bmad-autonomous-development` | methodology-driven autonomous delivery | Compare only where Ralph's loop could host structured methods without losing minimalism |
| 009 | `009-xethryon` | memory-heavy autonomy and swarm patterns | Highlight where Ralph intentionally rejects richer runtime complexity in favor of clean restarts |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory for context preservation and saved handovers, spec-folder validation workflows, multi-runtime agent/skill routing, and strong checklist-driven governance. What it does **not** currently have is a lightweight Bash-based loop that repeatedly spawns fresh coding agents, treats git history as the primary durable memory layer, or uses an append-only `progress.txt` plus `prd.json` pair as the canonical iteration bridge. Research should focus on that gap.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Start with `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/ralph-main/ralph.sh` and read it line by line before anything else. It is the whole orchestrator in one file.
3. Trace the exact control loop from `ralph.sh`: parse args -> validate tool -> inspect `prd.json`/branch -> archive prior run if branch changed -> initialize `progress.txt` -> spawn fresh AI instance -> check for `<promise>COMPLETE</promise>` -> continue or exit at max iterations.
4. Read `external/ralph-main/prompt.md` and `external/ralph-main/CLAUDE.md` next. Treat them as harness templates encoding the same per-iteration contract for Amp and Claude Code.
5. Extract the loop contract from those prompt files in order: read `prd.json`, read `progress.txt`, align to `branchName`, select the highest-priority story where `passes: false`, implement only that story, run checks, update reusable guidance files, commit, mark the story passed, append progress, then yield to the next fresh iteration.
6. Inspect `external/ralph-main/skills/ralph/SKILL.md` after the prompt templates. Study one-story-per-iteration sizing, dependency-ordered priorities, verifiable acceptance criteria, browser-verification requirements, `branchName` generation, and archive awareness.
7. Inspect `external/ralph-main/skills/prd/SKILL.md` after that. Study how clarifying questions, explicit scope boundaries, and small user stories create PRDs that Ralph can execute without long-context reasoning.
8. Read `external/ralph-main/prd.json.example` and treat `project`, `branchName`, ordered `userStories`, and per-story `passes` as the minimum state machine Ralph needs.
9. Read `external/ralph-main/README.md` only after the files above. Use it to confirm claims about fresh context, git-as-memory, `progress.txt`, AGENTS updates, browser verification, archiving, and stop conditions. Do not let README prose replace code evidence.
10. Read the governing instruction files: repo-root `AGENTS.md` and `external/ralph-main/AGENTS.md`. Note that the Claude-specific harness uses nearby `CLAUDE.md` updates as a related propagation mechanism.
11. Before any deep-research run, ensure this phase folder contains `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`. Use `@speckit` when supported; otherwise follow existing Spec Kit templates manually.
12. Validate the phase folder before deep research with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main" --strict
    ```
13. After validation passes, run deep research against this same phase folder using this topic:
    ```text
    Research Ralph at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/ralph-main, focusing on fresh-agent-per-iteration execution, git-as-memory persistence, append-only progress learnings, PRD-to-JSON task decomposition, lightweight Bash orchestration, archive rotation, and validation-first loops that could improve Code_Environment/Public.
    ```
14. Compare Ralph directly against current `Code_Environment/Public` capabilities: Spec Kit Memory, handover documents, validation scripts, runtime prompts, and agent-routing surfaces. Address overlap with `002-babysitter-main` explicitly by separating minimal loop orchestration from deterministic event-sourced replay.
15. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, explain what Ralph does, why it matters here, whether to `adopt now`, `prototype later`, or `reject`, what Public subsystem it affects, and what migration or validation risk comes with it. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main"
    ```

## 6. Research Questions

1. What concrete benefits does Ralph get from spawning a fresh AI instance every iteration instead of extending one long-lived conversation?
2. What are the tradeoffs of clean-context iteration, especially around duplicated setup work, lost local scratch state, and dependence on durable external artifacts?
3. How reliable is git history as the primary memory layer for Ralph, and where does it succeed or fail compared with richer systems such as Spec Kit Memory?
4. How does `progress.txt` accumulate reusable patterns, gotchas, and context across iterations, and what would a similar append-only learning log look like in `Code_Environment/Public`?
5. How does `prd.json` constrain work into small, verifiable stories, and what granularity rules are required to keep one story inside one context window?
6. What does Ralph gain by keeping orchestration in Bash rather than moving to a TypeScript or Python control plane, and where would extra runtime sophistication hurt the design?
7. How do archive rotation and `.last-branch` tracking prevent cross-feature contamination when a new PRD replaces an old one?
8. How do guidance-file updates propagate into future iterations, especially the README emphasis on `AGENTS.md` versus the Claude template's use of nearby `CLAUDE.md` files?
9. How does Ralph enforce "one story per iteration" in practice, and how much of that discipline comes from prompt wording versus PRD structure?
10. Which Ralph patterns would strengthen `Code_Environment/Public` immediately, which require a prototype, and which should be rejected because this repo already has a better or safer mechanism?

## 7. Do's

- Do read `ralph.sh` line by line; it is short enough that every branch and side effect matters.
- Do trace how `progress.txt` is initialized, appended to, and reused as future-iteration context.
- Do study the `prd.json` schema and story-order rules before making claims about orchestration behavior.
- Do verify exactly how the loop detects completion, including the `<promise>COMPLETE</promise>` sentinel.
- Do compare `prompt.md` and `CLAUDE.md` as two versions of the same loop contract.
- Do inspect how archive folders and `.last-branch` isolate prior runs when a new feature starts.
- Do treat simplicity as the feature under analysis, not as evidence that the system is unsophisticated.

## 8. Don'ts

- Do not overcomplicate analysis of a deliberately simple system.
- Do not try to run `ralph.sh`; it assumes a configured AI harness and this phase is static research.
- Do not dismiss the Bash approach as primitive; minimal dependencies and explicit control flow are core design choices.
- Do not quote README claims as final truth when `ralph.sh`, the prompt templates, or the skills show the actual mechanism.
- Do not recommend a heavyweight control plane unless the evidence shows Ralph's minimal loop truly fails at an important requirement for `Code_Environment/Public`.
- Do not blur Ralph with `002-babysitter-main`; one is a tiny fresh-agent loop, the other is a richer deterministic runtime.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Git-as-memory finding

`ralph.sh` relies on commit history, `progress.txt`, and `prd.json` instead of a persistent in-process runtime. A strong finding would explain why that makes fresh-agent restarts cheap, identify where `Code_Environment/Public` could benefit from a git-backed iteration log, and classify the idea as `adopt now`, `prototype later`, or `reject`.

### Example B: Fresh-context iteration finding

`prompt.md` and `CLAUDE.md` both instruct the agent to complete exactly one story, run checks, commit, mark the story passed, and append learnings before the next clean invocation. A strong finding would show how that pattern reduces context drift, where it increases setup overhead, and how it compares to this repo's existing memory and handover systems.

## 10. Constraints

### 10.1 Error handling

- If a cited file path is missing, say so plainly and adjust the finding instead of guessing.
- If README claims cannot be verified in `ralph.sh`, the prompt templates, or the skill files, mark them as unverified rather than proven.
- If prompt-template behavior differs between Amp and Claude variants, surface the difference explicitly rather than collapsing them into one model.
- If a search tool cannot operate on the external repo, fall back to direct file reads and exact-path evidence; do not invent mechanics.

### 10.2 Scope

**IN SCOPE**

- fresh-context-per-iteration execution
- Bash orchestration and minimal dependency design
- git history, `progress.txt`, and `prd.json` as persistence layers
- story granularity and verifiable acceptance criteria
- archive rotation and branch tracking
- prompt-template enforcement of one-story execution
- learnings propagation via `AGENTS.md` / `CLAUDE.md`
- validation-first loops including typecheck, tests, CI, and browser verification

**OUT OF SCOPE**

- benchmarking AI models or harness quality
- running the external automation loop in this phase
- speculative rewrites of Ralph into another language without evidence
- generic prompt-engineering advice not grounded in Ralph artifacts
- unrelated repo setup commentary

### 10.3 Prioritization framework

Rank findings in this order: context-drift reduction value, simplicity-to-impact ratio, persistence reliability across iterations, fit with existing Spec Kit Memory and handover workflows, story-sizing and validation discipline, ease of prototyping inside `Code_Environment/Public`, and cross-phase differentiation from `002-babysitter-main`.

## 11. Deliverables

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` present and valid in this phase folder before deep research starts
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison to current Public memory, handover, validation, and orchestration surfaces
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- what Ralph does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected repo area
- risk, migration cost, or validation requirement

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in minimal agent loops, git-memory, and Bash orchestration
  - **Instructions** are ordered, concrete, and path-specific
  - **Context** is domain-specific and cross-phase aware
  - **Constraints** clearly limit scope and error handling
  - **Examples** show what a strong Ralph finding looks like
- at least 5 findings are evidence-backed rather than speculative
- findings explicitly analyze fresh-context benefits **and** tradeoffs
- recommendations distinguish Ralph's minimal loop value from systems this repo already has
- overlap with `002-babysitter-main` is addressed so orchestration recommendations are not duplicated

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order started with `ralph.sh`, then the harness templates, then the Ralph and PRD skills
- Level 3 docs existed before deep research began
- the validation command passed on this exact phase folder
- `research/research.md` contains at least 5 evidence-backed findings
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `006-ralph-main`
- no edits were made outside the phase folder
- all paths reference `999-agentic-system-upgrade`, not `999-feature-roadmap`
- cross-phase overlap with `002-babysitter-main` is explicitly resolved
