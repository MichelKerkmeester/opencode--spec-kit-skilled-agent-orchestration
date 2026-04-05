# $refine TIDD-EC Prompt: 007-relay-main

## 2. Role

You are a research specialist in agent-to-agent communication protocols, real-time messaging architectures, multi-LLM coordination, and broker-backed event systems for AI runtimes. Work like a systems analyst who can connect SDK ergonomics, channel routing, readiness semantics, callback surfaces, plugin UX, and transport trade-offs to concrete improvements inside Code_Environment/Public.

## 3. Task

Research Relay's channel-based messaging and multi-LLM coordination patterns to identify evidence-backed improvements for Code_Environment/Public's inter-agent communication, especially around realtime coordination, message routing, delivery semantics, event callbacks, ready-state synchronization, and multi-provider agent spawning. Compare Relay's transport-first model against Public's current Task-tool delegation and orchestration patterns, then label each recommendation `adopt now`, `prototype later`, or `reject`.

## 4. Context

### System Description

Relay (Agent Relay) is a real-time messaging system for autonomous agent-to-agent communication. Its core stack combines a TypeScript/Node.js SDK, a Python SDK with parallel concepts, a Rust broker runtime using async/PTYS/WebSocket routing, and a Claude Code plugin with `/relay-team`, `/relay-fanout`, and `/relay-pipeline`. Key patterns include channel-based communication, multi-provider spawning across Claude/Codex/Gemini/Opencode, callback-based interception such as `onMessageReceived`, ready-state waits such as `waitForAgentReady()`, and event-driven handling of peer, system, idle, and lifecycle signals.

Relay is not just "multi-agent orchestration" in the abstract. Its distinctive value is transport: channels, DMs, thread replies, worker readiness, routing plans, PTY injection timing, headless-versus-PTY choices, and broker-mediated delivery. The SDK and plugin are coordination surfaces on top of that transport layer.

### Cross-Phase Awareness Table

Use the full 9-phase packet map below to avoid duplicate analysis. Phase 007 owns realtime A2A transport, routing semantics, and agent messaging ergonomics; phase 002 still owns deterministic orchestration, replay, and workflow enforcement.

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Agent Lightning | RL span optimization | 005 (loop driver) | Focus RL rewards, not general loops |
| 002 | Babysitter | Event-sourced orchestration | 007 (messaging) | Focus deterministic replay, journals, and enforcement rather than realtime transport |
| 003 | Claude Code Mastery | MDD + hooks + CLAUDE.md discipline | 005 (commands), 008 (skills) | Focus workflow doctrine and hook conventions, not messaging fabric |
| 004 | Get It Right | Structured retry and convergence control | 001 (optimization), 002 (orchestration) | Focus correction loops and feedback gates, not channel routing |
| 005 | Intellegix | Multi-agent worktrees and council patterns | 002 (orchestration), 007 (multi-agent) | Focus repo isolation and worktree execution, not brokered messaging |
| 006 | Ralph | Git-memory fresh agents | 002 (orchestration), 009 (memory) | Focus git-backed memory and fresh-session simplicity, not transport |
| 007 | Relay | Real-time messaging + multi-LLM spawning | 002 (orchestration), 005 (multi-agent) | Focus channels, DMs, readiness, callbacks, broker routing, and plugin transport UX |
| 008 | BAD | Sprint automation and coordinator-subagent planning | 003 (MDD), 005 (agents) | Focus sprint structure and planning roles, not realtime message exchange |
| 009 | Xethryon | Memory + swarm self-reflection | 006 (memory), 002 (swarm) | Focus reflective memory and swarm cognition, not broker transport |

### What This Repo Already Has

Code_Environment/Public already has agent coordination guidance in `.opencode/agent/orchestrate.md`, multi-model delegation surfaces in `.opencode/skill/cli-copilot/`, `.opencode/skill/cli-codex/`, and `.opencode/skill/cli-gemini/`, plus Spec Kit Memory, spec validation, and strong orchestration/safety rules. What it does **not** have is a first-class realtime messaging fabric between concurrently running agents. There is no Relay-style shared channel layer where agents subscribe, wait for peer readiness, exchange messages asynchronously, and react to inbound transport events through callbacks.

### Research Lens for This Phase

Keep phase 007 centered on transport and communication design:

- how agents discover and address each other,
- how channels differ from direct task delegation,
- how readiness and delivery are modeled,
- how plugin commands map onto transport patterns,
- how a broker mediates messaging without becoming a full repo-aware orchestrator,
- how TypeScript and Python stay aligned at the SDK surface,
- how Public could add realtime messaging without breaking current orchestration rules.

Relay's coordinator surfaces are lightweight and communication-oriented. Do not mistake channel coordination for a fully privileged orchestrator with file access, code-editing authority, or deep Spec Kit awareness.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main` as the pre-approved spec folder. Skip Gate 3, do not create a sibling packet, and keep every write inside this phase folder only.
2. Read the governing `AGENTS.md` files first: the Public repo root `AGENTS.md` and the external repo guidance if present. Treat everything under `external/` as read-only.
3. Create or refresh Level 3 Spec Kit docs in this phase folder before deep research begins: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
4. Use `@speckit` for markdown authoring when the runtime supports agent routing. If routing is unavailable, follow the established Level 3 structure manually.
5. Validate the phase folder before deep research with this exact command:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main" --strict
   ```
6. If validation fails, fix the docs in this same phase folder and rerun strict validation before continuing. If blocked, record the blocker explicitly in `tasks.md` and `checklist.md`.
7. Run `spec_kit:deep-research` with this exact topic string:
   ```text
   Research Relay for Code_Environment/Public with focus on channel-based agent communication, multi-LLM spawning, ready-state synchronization, message interception, broker routing, Claude Code plugin transport UX, TypeScript/Python SDK parity, and how realtime messaging compares with Public's current Task-tool delegation and orchestration patterns.
   ```
8. Start with the API surface rather than broker internals: `README.md`, `ARCHITECTURE.md`, `packages/sdk/README.md`, `packages/sdk-py/README.md`, then `packages/sdk/src/index.ts`, `packages/sdk/src/client.ts`, `packages/sdk/src/relay.ts`, `packages/sdk/src/protocol.ts`, `packages/sdk/src/workflows/README.md`, `packages/sdk/src/workflows/builder.ts`, and `packages/sdk/src/workflows/coordinator.ts`.
9. After the SDK pass, inspect the Rust broker layer. In this checkout the broker lives under repo-root `src/` rather than a separate `relay-pty/src/` package. Prioritize `src/main.rs`, `src/routing.rs`, `src/pty.rs`, and `src/spawner.rs`.
10. Then examine the Claude Code plugin surface through `docs/plugin-claude-code.md`, the README's plugin section, and any closely related plugin docs needed to confirm `/relay-team`, `/relay-fanout`, and `/relay-pipeline`.
11. Trace the message lifecycle end to end: provider-specific spawn helper or `spawnPty()` -> broker startup/connect -> worker registration and `worker_ready` -> `sendMessage()` or channel post -> routing target resolution -> inbound relay event -> callback firing such as `onMessageReceived`.
12. Compare the TypeScript and Python SDKs explicitly. Capture where they expose the same concepts (`AgentRelay`, provider-specific spawn helpers, ready waits, event hooks, channels) and where one surface is richer or clearer than the other.
13. Compare Relay's transport model against Public's current model: `task`-tool dispatch, `.opencode/agent/orchestrate.md`, and the `cli-copilot` / `cli-codex` / `cli-gemini` delegation skills. Explain what Relay adds that Task-tool delegation alone cannot provide, and what should remain outside scope because phase 002 or 005 already owns it.
14. Verify the docs delivery model. Relay exposes both web docs and generated Markdown mirrors backed by the same MDX source; do not rely on one surface if the other clarifies transport, plugin, or workflow behavior.
15. Save findings under `research/`, with `research/research.md` as the canonical output. Update `checklist.md`, create `implementation-summary.md`, then save memory with:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main"
   ```

## 6. Research Questions

- How does Relay model channel membership, direct targeting, and workspace-aware delivery, and what would Public need to adopt similar routing semantics safely?
- What do provider-specific spawning surfaces such as `relay.claude.spawn()`, `relay.codex.spawn()`, `client.spawnProvider()`, `spawnClaude()`, and `spawnOpencode()` reveal about multi-LLM coordination ergonomics that Public could reuse?
- How does `waitForAgentReady()` differ from "first message received" or "idle" semantics, and why does that distinction matter for realtime coordination?
- How are inbound messages surfaced back into the SDK through event hooks such as `onMessageReceived`, and what callback model would fit Public best?
- How does the Rust broker use tokio, PTY management, WebSocket connectivity, deduplication, and routing plans to keep delivery asynchronous but controlled?
- How do channel posts, direct messages, thread replies, and human/system injection differ, and which of those are most relevant for Public's agents?
- What are the practical differences between `/relay-team`, `/relay-fanout`, and `/relay-pipeline`, and how do those modes compare to Task-tool delegation, orchestrate-agent flows, and current multi-model CLI delegation?
- Where does Relay intentionally stay lightweight compared with a full orchestrator, and what should Public avoid over-copying because it already has stronger orchestration or spec-governance layers?
- How strong is TypeScript/Python feature parity today, and which parity patterns would reduce maintenance cost if Public ever adds more than one runtime surface?
- Which Relay patterns are immediately adoptable for Public, which need a prototype packet first, and which should be rejected because they duplicate existing orchestration capabilities?

## 7. Do's

- Trace message flow from SDK call site into the broker and back to SDK callbacks.
- Read both high-level docs and implementation files before concluding how a feature works.
- Examine `packages/sdk/src/relay.ts` and `packages/sdk/src/client.ts` as the main API and transport entry points.
- Study `src/routing.rs`, `src/pty.rs`, `src/spawner.rs`, and `src/main.rs` to understand routing, PTY injection, lifecycle control, and worker startup.
- Compare SDK patterns across TypeScript and Python instead of assuming parity.
- Inspect the Claude Code plugin commands and explain what user-facing coordination mode each one represents.
- Distinguish channel communication, DMs, thread replies, readiness signals, idle signals, and workflow topology; they are related but not interchangeable.
- Map every meaningful finding to a specific Public subsystem or gap.
- Address overlap with phase 002 explicitly whenever a Relay pattern starts to look like generic orchestration rather than transport.
- Use exact file paths in every nontrivial finding.

## 8. Don'ts

- Do not confuse Relay's lightweight coordinator or transport facade with a full repo-aware orchestrator that has file access, spec authority, or deep workflow governance.
- Do not spend most of the analysis on Rust internals if the pattern is already obvious from the SDK surface; use the broker to validate transport behavior, not to drown the research in low-level details.
- Do not ignore the web-doc plus Markdown-mirror delivery model when validating claims about docs, plugin behavior, or workflows.
- Do not flatten `/relay-team`, `/relay-fanout`, and `/relay-pipeline` into the same idea; compare their execution shape and coordination assumptions.
- Do not recommend copying Relay patterns that simply duplicate existing Public capabilities in orchestration, memory, or validation unless Relay adds realtime transport value.
- Do not edit anything under `external/` or outside this phase folder.
- Do not dispatch sub-agents. This phase prompt is for a LEAF agent path only.

## 9. Examples

```text
**Finding: Ready-State Gating Before Peer Messaging**
- Source: README.md; packages/sdk/src/relay.ts; packages/sdk-py/README.md
- What it does: Relay explicitly separates spawn success from transport readiness by exposing `waitForAgentReady()` / `wait_for_agent_ready()` before agents are treated as safe message targets.
- Why it matters: Public currently delegates work, but it does not expose a first-class readiness handshake for concurrently running agents that need to message each other in realtime.
- Recommended action: prototype later
- Affected area: .opencode/agent/orchestrate.md, Task-tool coordination, future transport abstractions
- Risk/cost: Medium; requires lifecycle state modeling and timeout/error semantics that do not exist today
```

## 10. Constraints

### Error Handling

- If strict spec validation fails, fix the phase docs first. If a fix is not possible, document the blocker, the failed rule, and the downstream impact in `tasks.md` and `checklist.md`.
- If CocoIndex or other semantic search is weak on this repo snapshot, fall back to targeted file reads and exact grep confirmation. Record the fallback in `research/research.md`.
- If the broker is too complex to execute locally, analyze interfaces and control flow statically. Do not burn time on reconstructing the full runtime unless execution is essential to resolve an ambiguity.

### Scope Boundaries

- In scope: channels, DMs, threads, message callbacks, worker readiness, PTY/headless transport, broker routing, plugin coordination modes, SDK parity, delivery semantics, and comparison to Public's current delegation model.
- Out of scope: dashboard cosmetics, generic observability unrelated to messaging, unrelated product marketing copy, broad cloud platform choices, or low-level Rust details that do not change the transport conclusions.
- Treat phase 002 as the owner of deterministic orchestration, replay, and enforcement. Treat phase 005 as the owner of worktree-heavy execution patterns. Treat phase 007 as the owner of realtime transport and communication ergonomics.

### Prioritization

- Mark low-risk, high-leverage transport ideas as `adopt now`.
- Mark high-value ideas that need a design spike, protocol sketch, or experimental packet as `prototype later`.
- Mark redundant, over-complex, or phase-overlapping ideas as `reject`.
- Favor findings that show clear value beyond the existing Task-tool plus orchestration-agent model.

### Execution Limits

- You are a LEAF agent at depth 1. Do not dispatch sub-agents or create nested tasks.
- Keep all writes inside this phase folder only.
- Preserve exact path references under `999-agentic-system-upgrade`; do not reintroduce legacy packet paths.

## 11. Deliverables

- `spec.md`: Level 3 phase spec tailored to Relay transport research.
- `plan.md`: ordered work plan covering repo reading, evidence capture, synthesis, and closeout.
- `tasks.md`: actionable checklist of research steps, blockers, and completion items.
- `checklist.md`: verification checklist with evidence references and explicit phase-overlap checks.
- `decision-record.md`: documented decisions on adoption, prototyping, rejection, and scope boundaries.
- `research/research.md`: canonical research report with at least five evidence-backed findings.
- `implementation-summary.md`: concise summary of findings, recommended next packets, and transport risks.
- saved memory entry for this exact phase folder using `generate-context.js`.

## 12. Evaluation Criteria

- Produce at least five evidence-backed findings.
- Every finding must cite at least one exact external file path.
- Every finding must map to at least one concrete Public subsystem, file, or operational surface.
- Findings must distinguish realtime messaging value from generic orchestration, workflow planning, or worktree management.
- Findings must compare Relay's transport layer against Public's current Task-tool delegation model.
- The writeup must explicitly address overlap with phase 002 and explain why each recommendation belongs in phase 007 instead.
- Output must remain RICCE-complete: role, instructions, context, constraints, and examples must all be materially useful.
- Overall output should be CLEAR-aligned and strong enough to score at least 40/50 for clarity, logic, expression, arrangement, and reusability.

## 13. Completion Bar

- Level 3 docs exist in the phase folder and pass strict validation before deep research proceeds.
- `research/research.md` contains at least five evidence-backed Relay findings.
- `checklist.md` is updated with evidence and completion marks.
- `implementation-summary.md` exists and names recommended next steps or follow-on packets.
- Memory is saved successfully for this exact phase folder.
- No edits were made outside the phase folder.
- Cross-phase overlap with phase 002 is explicitly addressed.
- No final path reference uses deprecated packet naming.
