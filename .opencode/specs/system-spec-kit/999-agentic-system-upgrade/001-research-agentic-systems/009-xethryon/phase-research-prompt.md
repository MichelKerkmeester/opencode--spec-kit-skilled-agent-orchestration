# $refine TIDD-EC Prompt: 009-xethryon

## 2. Role
You are a research specialist in persistent memory architectures, self-reflective AI agents, swarm orchestration, and multi-modal agent systems with autonomy modes.
Operate as a phase-local analyst for `Code_Environment/Public`, with strong attention to evidence, implementation reality, adoption cost, orchestration safety, and docs-vs-code drift.

## 3. Task
Research Xethryon's persistent memory, self-reflection, and swarm orchestration patterns to identify concrete, evidence-backed improvements for `Code_Environment/Public`'s memory systems, agent self-evaluation, and parallel execution capabilities.
Do not import Xethryon wholesale. Extract what should be `adopt now`, `prototype later`, or `reject`, especially around persistent memory, AutoDream consolidation, self-review before delivery, git-aware context, autonomy switching, autonomous skill invocation, and file-based swarm coordination.

## 4. Context

### 4.1 System Description
Treat Xethryon as an OpenCode fork implemented in TypeScript on Bun with these relevant claims and mechanisms:
- persistent project memory under `~/.xethryon/projects/<project>/memory/`
- recall of prior learnings based on current query context
- AutoDream consolidation after `24h` or `5` sessions of new memory activity
- a self-reflection pass for tool-using turns before user-visible delivery
- git-aware context injection for branch, dirty state, merge / rebase, ahead / behind, and stash count
- autonomy mode (`F4`) with `CONSTRUCT`, `ARCHITECT`, `RECON`, `COORDINATE`, and `VALIDATOR`
- autonomous skill invocation through `invoke_skill`
- swarm orchestration via sub-sessions, file-based IPC mailboxes, and shared task boards
- multi-provider support across Anthropic, OpenAI, Google, OpenRouter, MiniMax, and local models

Primary evidence anchors:
- `README.md`, `XETHRYON_CONTEXT.md`, `XETHRYON_MODS.md`
- `packages/opencode/src/session/system.ts`, `packages/opencode/src/session/prompt.ts`
- `packages/opencode/src/xethryon/memory/*`
- `packages/opencode/src/xethryon/reflection.ts`, `packages/opencode/src/xethryon/git.ts`, `packages/opencode/src/xethryon/autonomy.ts`
- `packages/opencode/src/tool/switch_agent.ts`, `packages/opencode/src/tool/invoke_skill.ts`
- `packages/opencode/src/xethryon/swarm/*` and the `team_*`, `send_message`, and `task_*` tools

Important caution: the docs frame the memory system as LLM-ranked retrieval, but the code must be verified end to end. Do not assume the marketing description matches the default runtime path.

### 4.2 Cross-Phase Awareness Table
| Phase | External target | This phase's relationship to it |
| --- | --- | --- |
| 001 | `001-agent-lightning-main` | Mention only if Xethryon's autonomy or reflection resembles optimization, tracing, or closed-loop tuning. |
| 002 | `002-babysitter-main` | Explicit overlap packet for orchestration and run control. Capture Xethryon's swarm mailbox / task-board mechanics here, but do not redo Babysitter's broader supervision model. |
| 003 | `003-claude-code-mastery-project-starter-kit-main` | Mention only if Xethryon's prompts or slash-skill flows overlap harness conventions. |
| 004 | `004-get-it-right-main` | Mention only if Xethryon's self-reflection materially overlaps structured correction or verifier-first loops. |
| 005 | `005-intellegix-code-agent-toolkit-master` | Mention only if Xethryon's swarm or autonomy overlaps generalized toolkit architecture. |
| 006 | `006-ralph-main` | Explicit overlap packet for persistence strategy. Compare Xethryon's durable memory extraction and consolidation to Ralph's git / progress-file memory, but do not drift into Ralph's fresh-agent Bash loop. |
| 007 | `007-relay-main` | Mention only if mailbox IPC or task notifications resemble relay / transport infrastructure. |
| 008 | `008-bmad-autonomous-development` | Mention only if coordinator behavior overlaps sprint automation or batch delegation. |
| 009 | `009-xethryon` | Primary focus. Own persistent memory lifecycle, AutoDream, self-reflection gate, git-aware context, autonomy switching, autonomous skill invocation, and swarm file-IPC patterns. |

Cross-phase rule: tag overlap with `002` for orchestration and `006` for persistence, but keep phase `009` ownership on memory lifecycle, AutoDream, reflection, git context, autonomy switching, and skill invocation.

### 4.3 What This Repo Already Has
`Code_Environment/Public` already has meaningful equivalents:
- `.opencode/skill/system-spec-kit/README.md` describes Spec Kit Memory with persistent semantic memory, graph intelligence, and session continuity
- `.opencode/agent/orchestrate.md` defines agent routing, single-hop delegation, and leaf-agent boundaries
- Spec Kit Memory, deep-research, code graph, and CocoIndex already cover semantic retrieval, recovery, and evidence gathering

What this repo does **not** visibly have today:
- a built-in self-reflection pass in the live turn loop before user-visible delivery
- an AutoDream-style background consolidation pass across accumulated memory
- a Xethryon-style file-based mailbox + task-board runtime for parallel sub-sessions

Research should compare equivalent surfaces: Xethryon memory vs Spec Kit Memory, Xethryon reflection vs the current response pipeline, Xethryon autonomy vs local routing surfaces, and Xethryon swarm IPC vs current limited multi-agent execution.

## 5. Instructions
Follow these steps in order and keep the analysis evidence-first.
1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon` as the pre-approved phase folder. Skip Gate 3, do not create a sibling packet, and keep every write inside this phase folder only.
2. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON-xethryon` as read-only.
3. Start with `external/XETHRYON-xethryon/XETHRYON_CONTEXT.md`; extract the architecture map, subsystem claims, and file hotspots before reading implementation files.
4. Read `external/XETHRYON-xethryon/XETHRYON_MODS.md` next; use it as the modification catalog that separates Xethryon-specific behavior from upstream OpenCode.
5. Read `external/XETHRYON-xethryon/README.md` only after the two docs above; treat README claims as hypotheses to verify, not final truth.
6. Inspect `external/XETHRYON-xethryon/packages/opencode/src/session/system.ts` and `external/XETHRYON-xethryon/packages/opencode/src/session/prompt.ts` before diving into subsystems. Identify where memory, relevant-memory recall, git context, autonomy prompt injection, reflection, and post-turn hooks enter the runtime.
7. Trace the persistent memory lifecycle in order: `memoryHook.ts` -> `extractMemories.ts` -> file writes under the auto-memory path -> `retrieveMemories.ts` / `findRelevantMemories.ts` -> `autoDream.ts`. Verify extraction triggers, storage format, retrieval mode, and consolidation gates.
8. Read the memory files in this order after the pipeline entry points: `index.ts`, `memoryHook.ts`, `extractMemories.ts`, `retrieveMemories.ts`, `findRelevantMemories.ts`, `autoDream.ts`, `consolidationLock.ts`, `consolidationPrompt.ts`, `memoryScan.ts`, `paths.ts`.
9. Verify whether retrieval is truly LLM-ranked at runtime or only optionally LLM-ranked when an `llmCall` callback is provided. If the default prompt-injection path falls back to keyword scoring, document that precisely.
10. Inspect `external/XETHRYON-xethryon/packages/opencode/src/xethryon/reflection.ts` and then the reflection gate in `session/prompt.ts`. Confirm the one-pass cap, tool-call trigger, subagent exclusion, critique format, synthetic self-reflection injection, and env-toggle behavior.
11. Inspect `external/XETHRYON-xethryon/packages/opencode/src/xethryon/git.ts` and then the `gitContext()` integration in `session/system.ts`. Verify exactly which git signals are injected and what guidance is added.
12. Inspect `external/XETHRYON-xethryon/packages/opencode/src/xethryon/autonomy.ts`, `tool/switch_agent.ts`, and `tool/invoke_skill.ts`. Map the autonomy toggle, intent-to-agent switching rules, hard limits, permission checks, and post-task skill invocation logic.
13. Inspect the swarm stack last: `xethryon/swarm/spawn.ts`, `mailbox.ts`, `tasks-board.ts`, `team.ts`, `state.ts`, `paths.ts`, then `tool/team_create.ts`, `tool/send_message.ts`, and the `task_*` tools. Trace teammate session creation, file IPC, locks, and idle / failure notifications.
14. Compare Xethryon directly against `.opencode/skill/system-spec-kit/README.md` for memory and session continuity, and `.opencode/agent/orchestrate.md` for routing and delegation boundaries.
15. Before any deep-research run, ensure this phase folder contains `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`. Validate the folder, run deep research against this same packet, save outputs under `research/`, update `checklist.md`, create `implementation-summary.md`, and save memory from this packet path when complete.

Use this exact deep-research topic:
```text
Research Xethryon at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON-xethryon, focusing on persistent memory extraction and recall, AutoDream consolidation, self-reflection before delivery, git-aware prompt context, autonomy-mode switching, autonomous skill invocation, and swarm orchestration through file-based IPC so we can identify concrete improvements for Code_Environment/Public.
```

## 6. Research Questions
1. What is the exact memory lifecycle in Xethryon from post-turn learning extraction to durable file writes to retrieval and then to AutoDream consolidation?
2. Does the live runtime actually use LLM-ranked memory retrieval for prompt injection, or is LLM ranking only an optional path while the default runtime path remains keyword / recency scoring?
3. How are memory files organized on disk, how is `MEMORY.md` maintained, and what operational benefits or risks come from this file-first approach?
4. What exact conditions trigger AutoDream, how does the consolidation lock work, and what is the algorithmic shape of the consolidation pass?
5. How does the self-reflection implementation decide when to review a response, what verdict format does it use, and how does the critique get re-inserted into the same turn?
6. How much of Xethryon's reflection quality gate is enforced by code versus prompt discipline?
7. How does git-aware context detection work, what state is injected, and where would this add practical value or noise in `Code_Environment/Public`?
8. How does autonomy mode decide which of the five agent types to use, and how much is hard-enforced versus merely instructed through prompt text?
9. How does `invoke_skill` decide when autonomous follow-up workflows such as `/verify`, `/remember`, `/pr`, or `/debug` should run, and what limits keep that behavior bounded?
10. How do the swarm mailbox and task-board files coordinate teammate lifecycle, message passing, task ownership, and idle / failure reporting?
11. Compared with Spec Kit Memory and `.opencode/agent/orchestrate.md`, which Xethryon patterns are genuinely novel, which are redundant, and which are weaker than local mechanisms already present?
12. Which findings belong mainly to overlap packet `002` or `006`, and how should they be tagged without weakening phase `009` ownership?

## 7. Do's
- Do study the memory extraction and ranking pipeline in detail, not just the README description.
- Do trace the full lifecycle from learning extraction -> storage -> retrieval -> AutoDream consolidation.
- Do inspect `session/system.ts` and `session/prompt.ts` early so subsystem analysis stays connected to the runtime wiring.
- Do examine self-reflection's single-pass implementation and how it injects a synthetic critique back into the turn.
- Do verify exactly how autonomy mode detects intent and when `switch_agent` is allowed or rejected.
- Do trace swarm file-based IPC through mailbox paths, task-board paths, lock files, and idle notifications.
- Do compare Xethryon's memory storage and retrieval model directly with Spec Kit Memory's persistent semantic-memory stack and session continuity surfaces.
- Do surface docs-vs-code mismatches explicitly when they exist.

## 8. Don'ts
- Don't focus on the cyberpunk theme, branding, or cosmetic UI changes.
- Don't confuse Xethryon's memory with a simple key-value store; the target is extraction, ranking, consolidation, and recall behavior.
- Don't ignore AutoDream; the consolidation pattern is a key differentiator from append-only memory.
- Don't get lost in upstream OpenCode internals that are not part of Xethryon's modifications; use `XETHRYON_MODS.md` to stay anchored on what is unique.
- Don't trust README claims until the code path confirms them.
- Don't recommend Xethryon patterns just because they are more autonomous; compare them to local governance and memory safety first.
- Don't edit anything under `external/` or outside this phase folder, and do not dispatch sub-agents.

## 9. Examples
### Example A - memory retrieval reality check
- **Evidence:** `packages/opencode/src/xethryon/memory/findRelevantMemories.ts`, `packages/opencode/src/xethryon/memory/retrieveMemories.ts`, `packages/opencode/src/session/system.ts`
- **What it does:** A strong finding verifies whether the live prompt-injection path actually passes an `llmCall` callback or whether default recall is keyword / recency based.
- **Why it matters here:** `Code_Environment/Public` already has semantic retrieval in Spec Kit Memory, so adoption value depends on whether Xethryon adds a genuinely different retrieval mechanism.
- **Recommendation:** `adopt now`, `prototype later`, or `reject`
- **Affected area:** Spec Kit Memory retrieval surfaces or future lightweight recall helpers
- **Risk / cost:** Medium if product claims overstate the runtime behavior

### Example B - self-reflection gate
- **Evidence:** `packages/opencode/src/xethryon/reflection.ts`, `packages/opencode/src/session/prompt.ts`
- **What it does:** A strong finding explains how Xethryon runs one cheap self-review pass for tool-using turns, emits a `pass` or `revise` verdict, and injects a synthetic `<self-reflection>` critique back into the same turn for one corrective pass.
- **Why it matters here:** `Code_Environment/Public` has governance and review tooling, but not an obvious built-in pre-delivery self-critique gate in the main response loop.
- **Recommendation:** `adopt now`, `prototype later`, or `reject`
- **Affected area:** response pipeline, review hooks, verifier integration
- **Risk / cost:** Medium because a hidden critique pass can improve quality but also add latency or hide failure modes

## 10. Constraints
### 10.1 Error handling
- If a cited file path is missing, say so plainly and adjust the finding instead of guessing.
- If README or context-doc claims do not match the live code path, mark the claim as unverified or contradicted.
- If a feature appears partially wired, document the exact point where wiring stops.
- If two files disagree about behavior, preserve the disagreement and identify which file seems authoritative.

### 10.2 Scope
**IN SCOPE**
- persistent memory extraction, storage layout, retrieval behavior, and AutoDream
- self-reflection pass and critique reinjection
- git-aware prompt context
- autonomy-mode switching and skill invocation
- swarm teammate spawning, mailbox IPC, task-board state, and idle / failure signals
- explicit comparison to Spec Kit Memory and `.opencode/agent/orchestrate.md`

**OUT OF SCOPE**
- theme, logos, branding, and cosmetic UI changes
- installation scripts and release packaging
- generic OpenCode code not modified in a memory / reflection / autonomy / swarm-relevant way
- speculative feature design not grounded in cited Xethryon files

### 10.3 Prioritization framework
Rank findings in this order: improvement value for `Code_Environment/Public` memory systems, improvement value for pre-delivery self-evaluation, orchestration leverage for safe parallel execution, portability into existing governance, docs-vs-code risk, and overlap discipline with packets `002` and `006`.

## 11. Deliverables
Produce research outputs that include:
1. A concise architecture summary of Xethryon's memory, reflection, autonomy, git-aware, and swarm systems.
2. A memory lifecycle trace covering extraction -> file storage -> retrieval -> AutoDream.
3. A reflection trace covering trigger -> verdict -> critique injection -> final pass behavior.
4. A swarm trace covering team creation -> teammate spawn -> mailbox IPC -> task board -> idle / failure notification.
5. A comparison section against `.opencode/skill/system-spec-kit/README.md`.
6. A comparison section against `.opencode/agent/orchestrate.md`.
7. A recommendation matrix with `adopt now`, `prototype later`, and `reject`, plus an overlap log for packets `002` and `006`.

Minimum finding schema:
- finding title
- exact source evidence
- what Xethryon does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected repo area
- risk, migration cost, or validation requirement

## 12. Evaluation
| Dimension | Target |
| --- | --- |
| TIDD-EC completeness | All required sections are explicit and materially useful |
| RICCE completeness | Role, Instructions, Context, Constraints, and Examples are visible and actionable |
| Evidence quality | Exact file paths, concrete behaviors, no vague feature summaries |
| Memory accuracy | Extraction, retrieval, and AutoDream behavior are traced from real code |
| Reflection accuracy | One-pass gate, verdict logic, and critique injection are explained correctly |
| Swarm accuracy | File-based IPC, task-board state, and teammate lifecycle are traced concretely |
| Comparison depth | Xethryon is compared to actual local equivalents, not abstractly |
| Overlap discipline | Packets `002` and `006` are tagged without losing phase `009` ownership |
| Actionability | Recommendations can guide later planning work without re-reading Xethryon |
| CLEAR score | Target `>= 40/50` |

Use this CLEAR self-check:
- **Correctness:** Are all claims grounded in cited Xethryon and local files?
- **Logic:** Does each recommendation follow from the comparison?
- **Expression:** Is the write-up precise, domain-specific, and easy to scan?
- **Arrangement:** Is the report ordered around subsystems and decisions rather than note dumping?
- **Reusability:** Can later packets reuse the findings without re-reading the external repo?

## 13. Completion Bar
- The reading order started with `XETHRYON_CONTEXT.md`, then `XETHRYON_MODS.md`, then `README.md`, then the session pipeline files.
- The memory lifecycle is traced end to end from extraction to AutoDream.
- The retrieval path clearly states whether runtime recall is LLM-ranked, keyword-based, or hybrid.
- The self-reflection gate is traced with exact evidence from `reflection.ts` and `session/prompt.ts`.
- Git-aware context injection is traced with exact evidence from `git.ts` and `session/system.ts`.
- Autonomy switching and autonomous skill invocation are traced with exact evidence from `autonomy.ts`, `switch_agent.ts`, and `invoke_skill.ts`.
- Swarm mailbox and task-board behavior are traced with exact evidence from `spawn.ts`, `mailbox.ts`, `tasks-board.ts`, and the related tools.
- `research/research.md` contains at least 5 evidence-backed findings.
- The research compares Xethryon directly to `.opencode/skill/system-spec-kit/README.md` and `.opencode/agent/orchestrate.md`.
- Overlap with packets `002` and `006` is explicitly resolved where applicable.
- All paths stay under the approved `999-agentic-system-upgrade` root.
- No edits were made outside the approved phase folder.
