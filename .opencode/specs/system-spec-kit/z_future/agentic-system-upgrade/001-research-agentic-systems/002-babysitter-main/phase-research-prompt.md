# $refine TIDD-EC Prompt: 002-babysitter-main

## 2. Role

You are a research specialist in event-sourced architectures, deterministic workflow orchestration, and agentic process enforcement. Work like a systems analyst who understands immutable journals, replay engines, quality-gated execution, human-in-the-loop breakpoints, harness adapters, and token-efficiency design for long-running coding workflows.

## 3. Task

Research Babysitter's event-sourcing and process orchestration patterns to identify concrete improvements for `Code_Environment/Public`, especially around deterministic execution, quality gates, replay and resumption, plugin and harness extensibility, and context compression for agent workflows.

## 4. Context

### 4.1 System Description

Babysitter is a TypeScript/Node.js orchestration system centered on process-as-code. The workflow authority lives in JavaScript processes, not loose prompts or static config. The runtime enforces mandatory stops between meaningful steps, persists an immutable journal for every run, rebuilds state through replay, supports breakpoints for human approval, dispatches parallel work with dependency awareness, and exposes a harness abstraction so the same orchestration core can drive Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode, and the internal harness used in CI/CD and headless automation.

Use the external repo at:

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/babysitter-main`

Treat these runtime areas as primary:

- `packages/sdk/src/runtime/`
- `packages/sdk/src/storage/`
- `library/methodologies/`
- `plugins/`

Known high-value patterns to validate with repo evidence:

- append-only journal files with checksums
- deterministic replay and state-cache rebuild
- breakpoint-driven approval gates
- process-defined quality convergence loops
- parallel effect batching and pending-action resumption
- harness plugin bundles and runtime hooks
- 4-layer token compression embedded into the orchestration stack

### 4.2 Cross-Phase Awareness Table

Use this table to avoid rediscovering the same theme in every phase. Keep Babysitter focused on deterministic orchestration, event sourcing, enforced gates, and replay semantics.

| Phase | External system | Primary comparison angle | Overlap risk to manage |
| --- | --- | --- | --- |
| 001 | `001-agent-lightning-main` | agent execution speed, delegation ergonomics, workflow acceleration | Do not let performance or delegation UX overshadow Babysitter's journal and enforcement model |
| 002 | `002-babysitter-main` | event-sourced orchestration, mandatory stops, replayable runs, harness plugins | This phase owns deterministic process enforcement and replay/resume patterns |
| 003 | `003-claude-code-mastery-project-starter-kit-main` | project setup, standards, starter workflow packaging | Compare only where starter-kit conventions interact with enforced workflows |
| 004 | `004-get-it-right-main` | correctness-first iteration, validation rigor, refinement discipline | Keep focus on how Babysitter encodes gates in runtime logic, not generic review loops |
| 005 | `005-intellegix-code-agent-toolkit-master` | toolkits, utilities, operational support surfaces | Prefer Babysitter findings only when they improve orchestration control, not general tooling breadth |
| 006 | `006-ralph-main` | agent coordination patterns, orchestration behavior, control planes | Separate Ralph-style coordination ideas from Babysitter's immutable event journal mechanics |
| 007 | `007-relay-main` | transport, relay, messaging, or handoff substrate | Explicitly avoid reframing Babysitter as a relay system; address overlap and explain why event sourcing is distinct |
| 008 | `008-bmad-autonomous-development` | methodology-driven autonomous delivery and structured execution | Focus on how Babysitter executes methodologies deterministically, not on methodology prose itself |
| 009 | `009-xethryon` | broader autonomous-system patterns and platform design | Pull only evidence-backed orchestration ideas that complement, not duplicate, Babysitter's runtime core |

### 4.3 What This Repo Already Has

Anchor recommendations against existing strengths in `Code_Environment/Public` so findings are additive, not redundant.

- Spec Kit documentation workflows under `.opencode/skill/system-spec-kit/`
- spec-folder validation and Level 1-3+ packet conventions
- Spec Kit Memory for session continuity, retrieval, and saved context
- CocoIndex, code-graph, and MCP-backed context retrieval
- agent and skill routing across `.opencode/agent/`, `.agents/skills/`, and runtime-specific agent directories
- deep-research and deep-review workflows already designed for evidence-backed iteration
- validation-first operational culture with explicit checklists and phase folders
- multi-runtime support patterns spanning Claude, Codex, Gemini, Copilot, and OpenCode ecosystems

Do not recommend replacing systems this repo already has unless Babysitter shows a clearly stronger pattern with lower operational risk or materially better determinism.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main` as the already-approved phase folder. Do not create a new packet and do not switch to another spec path.
2. Read the governing `AGENTS.md` instructions before editing any phase-local files. The entire `external/` tree is read-only.
3. Start in `external/babysitter-main/packages/sdk/src/runtime/` because this phase is about runtime authority, not UI surfaces.
4. Read these files early and treat them as the minimum evidence set for the orchestration lifecycle:
   - `packages/sdk/src/runtime/createRun.ts`
   - `packages/sdk/src/runtime/orchestrateIteration.ts`
   - `packages/sdk/src/runtime/processContext.ts`
   - `packages/sdk/src/runtime/replay/createReplayEngine.ts`
   - `packages/sdk/src/storage/journal.ts`
   - `packages/sdk/src/runtime/intrinsics/breakpoint.ts`
   - `packages/sdk/src/runtime/intrinsics/parallel.ts`
   - `packages/sdk/src/runtime/types.ts`
5. Trace the journal lifecycle end to end: command or process entry -> effect request or runtime action -> `appendEvent(...)` persistence -> journal file layout under the run directory -> replay engine initialization -> effect index/state-cache reconstruction -> resumed next action selection.
6. Pay special attention to how Babysitter separates process authority from runtime enforcement:
   - process code defines what is allowed
   - runtime stops after each meaningful step
   - replay decides what remains pending
   - breakpoints gate human approval
   - quality checks must pass before progression
7. After the runtime pass, inspect `external/babysitter-main/library/methodologies/` to understand how methodologies are packaged as reusable process assets. Prioritize the structural pattern of the methodology library over the content of any single methodology.
8. Read at least 2 methodology examples, including `library/methodologies/state-machine-orchestration.js`, and compare how methodology files encode phases, guards, convergence, validation, or state transitions.
9. Then inspect `external/babysitter-main/plugins/`, starting with `plugins/babysitter-opencode/` and at least one additional harness plugin. Identify the plugin bundle shape, hooks, commands, skills, and installation model.
10. Explicitly study the internal harness and multi-harness story from the README plus plugin/runtime evidence. Determine what is runtime-core versus harness-adapter glue.
11. Review the README sections on "How It Works" and "Compression" and verify claims against source files wherever possible. Do not repeat README marketing language without code evidence.
12. Compare Babysitter patterns to this repo's current capabilities in `.opencode/skill/system-spec-kit/`, `.opencode/agent/`, `.agents/skills/`, `opencode.json`, and related orchestration or memory surfaces. Focus on gaps, not superficial similarities.
13. Before any deep-research run, ensure this phase folder has proper Level 3 docs:
   - `spec.md`
   - `plan.md`
   - `tasks.md`
   - `checklist.md`
   - `decision-record.md`
14. Validate the phase packet before deep research:
   - `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main" --strict`
15. After docs validate, run deep research against this same phase folder with a Babysitter-specific topic such as:
   - `Research Babysitter at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/babysitter-main, focusing on event-sourced orchestration, mandatory stop-gates, deterministic replay and resume, harness plugin architecture, methodology packaging, and token compression patterns that could improve Code_Environment/Public.`
16. Save research artifacts inside this phase folder, especially under `research/`, and keep all writable outputs local to `002-babysitter-main`.
17. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
   - `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main"`
18. Every meaningful finding must include exact source paths, a clear explanation of what Babysitter does, why it matters here, whether to adopt now/prototype later/reject, what part of this repo it affects, and what validation or migration risk comes with it.

## 6. Research Questions

1. How does Babysitter encode authority between process code and runtime enforcement, and what parts of that split are most transferable to this repo?
2. How are run creation, event persistence, and replay initialization connected across `createRun.ts`, `journal.ts`, and `createReplayEngine.ts`?
3. What event shapes, file naming conventions, checksums, and sequencing rules make the journal deterministic and auditable?
4. How do mandatory stops actually happen in practice: effect requests, pending actions, replay cursor advancement, and breakpoint routing?
5. How does Babysitter distinguish breakpoint approval, task execution, and parallel pending work inside the runtime model?
6. What is the exact replay and resume story for interrupted runs, failed runs, and post-completion cache rebuilds?
7. What tradeoffs does Babysitter make by choosing process-as-code instead of config-as-code, and which of those tradeoffs fit `Code_Environment/Public`?
8. How is the methodology library structured so that processes remain reusable, composable, and deterministic rather than just descriptive?
9. What is the harness plugin contract across OpenCode and other integrations, and which parts belong in SDK core versus plugin bundles?
10. How does Babysitter's internal harness extend the same orchestration engine into CI/CD and headless automation without forking the model?
11. Which compression layers appear core to agentic scalability, and which ones are merely convenience features?
12. Where does Babysitter meaningfully differ from `007-relay-main`, and how should that difference be captured so the research program does not duplicate recommendations?

## 7. Do's

- Do trace the command -> event -> persist -> replay -> next-action chain using concrete code paths.
- Do inspect journal storage format, file naming, checksums, and recorded timestamps before making architectural claims.
- Do study `ctx.breakpoint(...)`, `ctx.task(...)`, and `ctx.parallel.*(...)` as first-class enforcement mechanisms, not helper utilities.
- Do examine how non-interactive mode alters breakpoint behavior and what that implies for CI/CD or headless runs.
- Do inspect the harness plugin bundle shape, especially hooks, command surfaces, env injection, and install flow.
- Do examine the token compression layers as an orchestration-adjacent scalability mechanism, not just a UX optimization.
- Do separate runtime guarantees from README-level positioning; validate claims with source whenever possible.
- Do identify whether a finding belongs in this repo's spec/memory/orchestration stack, not just whether it is interesting in Babysitter.

## 8. Don'ts

- Do not confuse the process library catalog or plugin marketplace presentation with the core runtime.
- Do not spend most of the effort summarizing individual methodology content; focus on the structural pattern of methodology packaging.
- Do not ignore the plugin architecture; it is the integration model that makes the runtime portable across harnesses.
- Do not reduce Babysitter to "just another agent framework"; this phase is about deterministic enforcement and replay semantics.
- Do not recommend adopting concepts that this repo already has unless Babysitter materially improves determinism, resumability, or control.
- Do not cite README claims as final truth when code evidence is available deeper in `packages/sdk/src/`.
- Do not drift into generic LLM workflow advice that is not grounded in Babysitter's runtime and journal implementation.
- Do not overlap with `007-relay-main` by reframing relay/transport concerns as if they were the same as event-sourced orchestration.

## 9. Examples

### Example A: Event-sourced journal finding

`packages/sdk/src/storage/journal.ts` appends each event as its own sequenced JSON file with a ULID and checksum, while `packages/sdk/src/runtime/replay/createReplayEngine.ts` reloads the journal, rebuilds effect indexes, and repairs state cache drift. A strong finding would explain how that append-only run journal could improve resumability or auditability in `Code_Environment/Public`, then classify it as `adopt now`, `prototype later`, or `reject`.

### Example B: Mandatory stop-gate finding

`packages/sdk/src/runtime/intrinsics/breakpoint.ts` turns a breakpoint into a runtime-controlled task boundary, and `packages/sdk/src/runtime/orchestrateIteration.ts` returns `waiting` with `nextActions` when effects remain unresolved. A strong finding would show how this creates a true stop-gate rather than a soft reminder, then map that pattern to a concrete workflow in this repo where human approval or validation must block progression.

## 10. Constraints

### 10.1 Error handling

- If a cited file path is missing, say so plainly and adjust the finding instead of guessing.
- If a README claim cannot be verified in source, mark it as unverified rather than presenting it as proven.
- If two sources disagree, surface the contradiction and state what needs follow-up.
- Do not hide uncertainty inside vague architecture language.

### 10.2 Scope

**IN SCOPE**

- event sourcing and journal persistence
- orchestration runtime flow
- replay and resume mechanics
- mandatory stop-gates and breakpoints
- parallel execution and pending-action handling
- harness plugin architecture
- methodology packaging as executable process assets
- compression layers only where they affect orchestration scalability or context discipline

**OUT OF SCOPE**

- UI catalog or marketing presentation layers
- deep summaries of individual methodologies as content
- marketplace browsing unless it reveals plugin/runtime architecture
- unrelated repo setup details
- cosmetic documentation commentary not tied to orchestration value

### 10.3 Prioritization framework

Rank findings in this order:

1. Deterministic enforcement value
2. Replay/resume reliability gain
3. Quality-gate or human-approval strength
4. Integration fit with existing Spec Kit and memory systems
5. Plugin or harness reuse potential
6. Compression or context-efficiency leverage
7. Implementation complexity and migration risk

## 11. Deliverables

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` present and valid in this phase folder before deep research runs
- `research/research.md` with at least 5 substantial findings
- each finding backed by exact file-path citations from Babysitter and a mapped implication for `Code_Environment/Public`
- an explicit section covering overlap and non-overlap with `007-relay-main`
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- what Babysitter does
- why it matters here
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected repo area
- risk, migration cost, or validation requirement

## 12. Evaluation Criteria

- CLEAR score target: `>= 40/50`
- RICCE compliance is visible in the work product:
  - **Role** is specialized and consistent
  - **Instructions** are concrete and ordered
  - **Context** is domain-specific and cross-phase aware
  - **Constraints** are explicit and enforce scope discipline
  - **Examples** demonstrate what "good findings" look like
- at least 5 findings are evidence-backed rather than speculative
- findings distinguish runtime-core patterns from plugin-layer conveniences
- conclusions identify what this repo should adopt, prototype, or reject
- no recommendation is justified only by branding or README claims

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the prompt user followed the runtime-first reading order
- Level 3 docs existed before deep research started
- the validation command passed on the phase folder
- `research/research.md` contains at least 5 evidence-backed findings
- findings include exact file paths and actionable repo implications
- cross-phase overlap with `007-relay-main` is explicitly addressed
- `implementation-summary.md` exists
- memory save completed successfully
- no edits were made outside `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main`
- no stale legacy spec path remains anywhere in this prompt
- runtime truth was favored over description, deterministic enforcement over generic orchestration rhetoric, and transferability over admiration
