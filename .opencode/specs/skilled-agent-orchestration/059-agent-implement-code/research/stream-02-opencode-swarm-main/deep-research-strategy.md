---
title: Deep Research Strategy — Stream-02 (opencode-swarm-main)
description: Per-iteration tracking for the architect-led swarm pattern study. This packet investigates opencode-swarm-main only; cross-stream synthesis happens at the parent (059-agent-implement-code).
---

# Deep Research Strategy — Stream-02 (opencode-swarm-main)

## 1. OVERVIEW

### Purpose
Identify reusable patterns from the opencode-swarm-main architect-led swarm framework that inform the design of a new `@code` LEAF agent for our `.opencode/agent/` inventory.

### Usage
- Init: this template was populated from `deep_research_strategy.md`.
- Per iteration: cli-codex (gpt-5.5 high fast) reads Next Focus, writes `iterations/iteration-NNN.md` + appends `{"type":"iteration",...}` to state log + writes `deltas/iter-NNN.jsonl`.
- Reducer: a lightweight per-packet reducer (NOT the canonical sk-deep-research reducer, which assumes flat `research/`) refreshes machine-owned sections and `findings-registry.json` after each iteration.

---

## 2. TOPIC
Identify reusable patterns from the opencode-swarm-main architect-led swarm framework that inform the design of a new `@code` LEAF agent for our `.opencode/agent/` inventory. Findings must include file:line citations from `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: skill auto-loading patterns — RESOLVED in iter 4
- [x] Q2: stack-agnostic detection — RESOLVED in iter 5
- [x] Q3: caller-restriction enforcement — RESOLVED in iter 1
- [x] Q4: write-capable safety guarantees — RESOLVED in iter 2
- [x] Q5: sub-agent dispatch contracts — RESOLVED in iter 3

---

## 4. NON-GOALS
- Cross-stream synthesis with stream-01 (oh-my-opencode-slim) or stream-03 (internal agent inventory). That happens at the parent.
- Wholesale code/architecture porting from opencode-swarm-main. We extract patterns + concrete diff-level recommendations.
- Implementation of `.opencode/agent/code.md` itself. We produce a recommendation skeleton only.

---

## 5. STOP CONDITIONS
- maxIterations 8 reached.
- All 5 key questions resolved.
- stuck_count >= 3 (newInfoRatio collapses 3 iters in a row) → recovery + restart.
- Weighted convergence vote > 0.60 (rolling avg < 0.05 ∧ MAD floor ∧ coverage >= 0.85).
- Quality guard: each of the 5 questions must have at least one cited finding. If not, override stop with continue.

---

## 6. ANSWERED QUESTIONS
- Q3 (iter 1, newInfoRatio 0.86): Caller-restriction is enforced by generated OpenCode SDK agent config in `src/agents/index.ts:651`. Architect agents ('architect' or `*_architect`) become `mode='primary'` with `permission.task='allow'`; workers become `mode='subagent'` without that permission. Tool whitelist (`AGENT_TOOL_MAP` in `src/config/constants.ts:48`) reinforces. Suffix classifier overmatches (`architect-permission.adversarial.test.ts:123`) — naming caveat.
- Q4 (iter 2, newInfoRatio 0.78): Multi-layered. `declare_scope` persists scope to `.swarm/scopes/scope-{taskId}.json` (`src/tools/declare-scope.ts:91+`); `scope-guard.ts:20` blocks Edit/Write/Patch outside scope (Bash/interpreter explicitly excluded — known gap); `guardrails.ts:2072+` enforces role authority and per-role allowed-prefixes (`:3325+`); `diff-scope.ts` is post-hoc advisory; coder STOP/BLOCKED/NEED protocol (`src/agents/coder.ts:111-125`). MISMATCH: prompt vs scope-guard early-return on missing scope.
- Q5 (iter 3, newInfoRatio 0.74): Dispatch is OpenCode `Task` tool with structured prompt text (`src/agents/architect.ts:395+`) — not a typed worker queue. `DelegationEnvelope` (`src/types/delegation.ts:6`) has no depth/generation field — depth is enforced only by SDK Task permission. Workflow advance is hook-driven (`delegation-gate.ts:830+`) not envelope-return-driven. `parallel/dispatcher` defaults to no-op (`src/parallel/dispatcher/index.ts:27`).
- Q1 (iter 4, newInfoRatio 0.72): No literal skill loader. Knowledge subsystem (`.swarm/knowledge.jsonl` + hive `shared-learnings.jsonl`) supplies architect at phase start via `experimental.chat.messages.transform` hook (`src/hooks/knowledge-injector.ts:208`). Coder gets a separate scope-keyed context pack via `system-enhancer.ts:850` (calls `knowledge_recall` on declared primary file). `technicalContext` is plain string. Pattern: orchestrator declares context + hook injects scope-keyed knowledge.
- Q2 (iter 5, newInfoRatio 0.69): Swarm has explicit detection at the tool/hook layer. `src/lang/detector.ts:25` probes marker files + extensions; `src/lang/profiles.ts:29` encodes per-language commands; `build_check`, `test_runner`, `pkg_audit` each implement ecosystem detection. RESIDUAL GAP: static worker prompts (coder.ts, test-engineer.ts) still leak TypeScript/Bun assumptions.

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Reading adversarial test files first to discover the load-bearing invariant (iter 1: `architect-permission.adversarial.test.ts` revealed the suffix classifier and the full deny-list).
- Pairing prompt-level role discipline reads with hook-level enforcement reads to separate "what the prompt says" from "what the runtime enforces" (iter 2 found a real mismatch this way).
- Question-driven focus per iteration plus crisp prompt-pack hand-off, which produced steady newInfoRatio (0.86 → 0.78 → 0.74 → 0.72 → 0.69 — graceful decay, no stuck iterations).
- Treating "skill" liberally so iter 4 could rule out the literal loader hypothesis and surface knowledge + system-enhancer instead.

## 8. WHAT FAILED
- No outright failures. Every iteration converged on its target question and produced cited findings within budget. Codex CLI exited with a benign warning ("failed to record rollout items") but artifacts always landed.

## 9. EXHAUSTED APPROACHES (do not retry)
- None — all 5 questions resolved.

## 10. RULED OUT DIRECTIONS
- Env vars / runtime caller-identity checks as the primary caller-restriction (Q3 iter 1) — actual mechanism is OpenCode SDK agent config.
- Treating `DelegationEnvelope` as a depth/generation contract (Q5 iter 3) — no depth field exists.
- Searching for a literal skill loader subsystem (Q1 iter 4) — analogue is the knowledge system + scope-keyed context pack.
- Assuming static worker prompts are stack-neutral (Q2 iter 5) — they leak TS/Bun specifics.

## 11. NEXT FOCUS
None at packet level — all 5 questions resolved with citations. Hand off to parent (`059-agent-implement-code`) for cross-stream synthesis with stream-01 and stream-03.

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- This packet investigates `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/` ONLY.
- Cross-stream synthesis (with stream-01 oh-my-opencode-slim, stream-03 internal agent inventory) happens at the parent spec folder `059-agent-implement-code` — NOT here.
- Target consumer: a new `@code` write-capable LEAF agent in `.opencode/agent/code.md`, dispatched only by `@orchestrate`.
- Layout note: opencode-swarm-main is a TypeScript codebase; src under `src/` with subdirs including `agents/`, `commands/`, `cli/`, `parallel/`, `council/`, `hooks/`, `knowledge/`, etc. Look for architect/worker/dispatch terminology.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 8
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- Lifecycle branches: `new` (live)
- Machine-owned sections: 3, 6, 7-11
- Canonical pause sentinel: `research/stream-02-opencode-swarm-main/.deep-research-pause`
- Current generation: 1
- Started: 2026-05-01
