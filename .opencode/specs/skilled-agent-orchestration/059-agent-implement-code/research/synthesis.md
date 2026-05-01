---
title: "Phase 2 Cross-Stream Research Synthesis — @code Agent Design"
description: "Cross-stream synthesis for packet 059-agent-implement-code: reconciles findings from oh-my-opencode-slim, opencode-swarm-main, and internal .opencode/agent/ inventory into final D3 decision and .opencode/agent/code.md skeleton."
status: complete
---

# Phase 2 — Cross-Stream Research Synthesis

Final synthesis across the three deep-research streams that ran sequentially under cli-codex (gpt-5.5, reasoning=high, service_tier=fast). Each stream investigated the same five priority questions against a different source.

| Stream | Source | Iters | Stop reason | Findings |
|---|---|---|---|---|
| **01** | `external/oh-my-opencode-slim/` | 4 / 8 | all_questions_answered | ~30, P0/P1 |
| **02** | `external/opencode-swarm-main/` | 5 / 8 | all_questions_resolved | ~44, P0/P1/P2 |
| **03** | internal `.opencode/agent/*` + AGENTS.md + skill-advisor + sk-code | 5 / 8 | zero-remaining-questions | 56 |

Per-stream `research.md` files are the canonical evidence record:
- `research/stream-01-oh-my-opencode-slim/research.md`
- `research/stream-02-opencode-swarm-main/research.md`
- `research/stream-03-internal-agent-inventory/research/research.md` *(extra `research/` nesting because the reducer required `specFolder` to match the artifact dir; not a layout error to fix)*

This synthesis only reconciles the cross-stream consensus and translates it into the two load-bearing deliverables: **D3** in `decision-record.md` and the `.opencode/agent/code.md` skeleton. All file:line citations are repo-relative.

---

## 1. Cross-Stream Consensus per Question

### Q1 — Skill auto-loading patterns

**Consensus: NO frontmatter-driven skill loader exists in any of the three sources.** Skill binding is always external to the agent file.

| Stream | Mechanism |
|---|---|
| **01** (slim) | `filter-available-skills` runtime chat-message transform + per-agent permission map (`getSkillPermissionsForAgent`) — visibility filter, not loader. `src/hooks/filter-available-skills/index.ts:37-45`, `src/cli/skills.ts:116-170`. |
| **02** (swarm) | No literal loader. Knowledge subsystem injects an architect-only system message at phase start (`knowledge-injector.ts:208`) and injects a coder-only scope-keyed context pack via `system-enhancer.ts:850+` reading `declare_scope.files[0]`. |
| **03** (internal) | Skill Advisor hook injects a recommendation brief (`Advisor: …`) into the runtime prompt context — does NOT load `SKILL.md`. Agents declare skill needs via body prose, routing tables, or orchestrator task-prompt `Skills: [...]` line. Precedent: `@review.md:31,47` reads sk-code; `@improve-agent.md:48` has a Skills table. |

**For @code:** Use a body-level `Skills` table (precedent: `@improve-agent.md:48`, `@review.md:31`). Orchestrator binds skills via task-prompt `Skills: sk-code, sk-code-*` line (`orchestrate.md:309,315`). NO new frontmatter field — would not be read by any consumer.

---

### Q2 — Stack-agnostic detection

**Consensus: detection lives at the tool/skill layer, NOT in agent prompts. `@code` should delegate to `sk-code`.**

| Stream | Approach |
|---|---|
| **01** (slim) | NO stack detection. Reusable agentic pattern is the `codemap` skill: agent infers globs and persists hash-based folder map (`src/skills/codemap/SKILL.md:32-39`). |
| **02** (swarm) | Real detection at tool/hook layer (`src/lang/detector.ts:25` profile probe; `discoverBuildCommands` ecosystem table covering Node/Rust/Go/Python/Maven/Gradle/.NET/Swift/Dart/C/C++/PHP). **Residual gap:** static worker prompts (`coder.ts:77+`, `test-engineer.ts:41+`) leak TS/Bun assumptions. |
| **03** (internal) | `sk-code` first-match-wins ordered marker detection: WEBFLOW → GO → NEXTJS → UNKNOWN. Documented as Python-style pseudocode (`SKILL.md:132,270,303`) + `references/router/stack_detection.md`. NO callable script. WEBFLOW/GO/NEXTJS markers per `SKILL.md:88`. |

**For @code:** Body-level "Stack Delegation Contract" — read `sk-code/SKILL.md` per dispatch, apply detect/intent/resource-loading protocol, escalate UNKNOWN to orchestrator. DO NOT bake stack rules into the agent prompt (avoid the swarm residual-gap pattern).

---

### Q3 — Caller-restriction enforcement (D3 BLOCKER)

**Consensus: the literal "callable only by orchestrator" mechanism does NOT exist as a frontmatter field or runtime validator in any of the three sources.** Each source achieves the policy via different layers; none is a single bespoke field.

| Stream | What enforces "callable only by X"? |
|---|---|
| **01** (slim) | Layered, no single field. (1) `mode` classification on registry (`src/agents/index.ts:428-442`), (2) `applyDefaultPermissions` deny-by-default for restricted tools (`src/agents/index.ts:172-181`), (3) plugin-owned `toolContext.agent` guard inside specific tools (`src/tools/council.ts:52-69`), (4) `delegate-task-retry` reaction to OpenCode core's `"Agent X is not allowed"` error. `SUBAGENT_DELEGATION_RULES` constant (`src/config/constants.ts:25-66`) is **declared but never read** (dead code). |
| **02** (swarm) | OpenCode SDK boundary: `name === "architect" \|\| name.endsWith("_architect")` ⇒ `mode='primary'` + `permission.task='allow'`; everyone else ⇒ `mode='subagent'` without task perm (`src/agents/index.ts:651`). **CAVEAT:** suffix classifier overmatches — `_architect`, `__architect`, `not_an_architect` all promote (`architect-permission.adversarial.test.ts:123`). |
| **03** (internal) | NO machine-readable caller-restriction field on any of 10 live agents. NO local dispatch validator. Existing pattern is **convention-floor** (4 layers): description prose; body §0 dispatch gate; `cli-opencode/SKILL.md:296-300` + `AGENTS.md:223` documentation; `orchestrate.md` injects "NESTING CONSTRAINT" at dispatch (`orchestrate.md:147,151`). |

**Reconciliation:** Stream-02's "harness-level" finding is the OpenCode SDK's Task-tool boundary (`mode: subagent` + no `permission.task: allow`) — this is a **LEAF mechanism** (prevents the callee from fanning out), not caller restriction (does not prevent third parties from invoking the callee). Stream-01 confirms: even with all four layers in slim, there is no env-var/schema-field/frontmatter property that restricts caller identity. Stream-03 confirms our harness has no validator surface for it either.

**Final D3 = Convention-Floor + LEAF enforcement** (full text in §3 below).

---

### Q4 — Write-capable safety guarantees

**Consensus: write safety is layered convention + post-write validation, not a single frontmatter allowlist.** Bash/interpreter writes bypass every hook in every system inspected.

| Stream | Mechanism |
|---|---|
| **01** (slim) | Strongest pattern: `apply-patch` hook with `guardPatchTargets()` (refuses paths outside root/worktree), conservative verification, EOL preservation (`src/hooks/apply-patch/execution-context.ts:131-360`). Per-agent MCP allowlist via `agent-mcps.ts`. `edit`/`write` inherit defaults — no central guard. |
| **02** (swarm) | Multi-layer: `declare_scope` persists `{taskId, files}` to `.swarm/scopes/scope-{taskId}.json`; `scope-guard.ts:8-136` blocks Edit/Write/Patch outside scope (NOT Bash); `guardrails.ts:2072-2169` enforces per-role authority; `diff-scope.ts` post-hoc advisory; coder STOP/BLOCKED/NEED protocol (`coder.ts:111-125`). **Documented gap:** Bash/interpreter writes bypass scope-guard. **Documented mismatch:** prompt requires pre-`declare_scope`; runtime allows writes when scope absent (`scope-guard.test.ts:108-132`). |
| **03** (internal) | NO universal `allowed_paths`; NO runtime allowlist. Convention pattern: (a) frontmatter tool permissions; (b) body-level path/scope prose (`@write.md:30` "MUST NOT create or write documentation inside spec folders"); (c) command-owned validation gates (deep-research YAML runs `validate.sh --strict` after spec.md mutation per `spec_kit_deep-research_auto.yaml:356-360`); (d) helper scripts with explicit guards (`scaffold-debug-delegation.sh:34-126` requires `--spec-folder`, rejects targets outside `specs/`, uses noclobber). `validate.sh` is structural, not scope-lock. |

**For @code:** Body-level scope discipline + explicit Bash-bypass warning + fail-closed verify (return to orchestrator on failure, no internal retry). Frontmatter `task: deny` and `external_directory: deny` to leverage available harness boundaries. The `@write.md:30` body-prose path-boundary pattern is the closest internal analog.

---

### Q5 — Sub-agent dispatch contracts and depth/nesting

**Consensus: depth/LEAF is enforced via tool-permission boundary at the runtime layer; envelope shape is informal but conventional.**

| Stream | Pattern |
|---|---|
| **01** (slim) | OpenCode `task` tool, payload `{description, prompt, subagent_type, task_id?}`. `task_id` is a resumable-session selector (NOT parent/child security). `parentID` derived from session events. **Default depth = 3** (`DEFAULT_MAX_SUBAGENT_DEPTH = 3` in `src/config/constants.ts:92-94`) — NOT depth-1 LEAF. Strict LEAF requires `tools: { task: false }` at dispatch time (`src/council/council-manager.ts:243-275`). |
| **02** (swarm) | `DelegationEnvelope = {taskId, targetAgent, action, commandType, files, acceptanceCriteria, technicalContext, errorStrategy?, platformNotes?}`. **NO depth/generation/parentTaskId field.** Depth is bound entirely by SDK Task permission. Coder returns prompt-constrained text (`DONE/CHANGED/REUSE_SCAN` or `BLOCKED/NEED`), NOT a typed result envelope. |
| **03** (internal) | LEAF enforced by `permission.task: deny` on 8/9 of our agents (only `ultra-think` has `task: allow`; `orchestrate` omits the key). `@orchestrate` injects "NESTING CONSTRAINT" + "Depth: N" prefix into every dispatch (`orchestrate.md:147,151,208`). `agent_config.leaf_only: true` in deep-research YAML is **informational** — `executor-config.ts:21` does NOT parse it. |

**For @code:** `permission.task: deny` (LEAF). Depth-1 enforced via this permission; depth field NOT added to dispatch envelope (matches all three streams). Return contract: structured `RETURN: <files> | <verification> | <escalation>` (refines stream-02's `DONE/BLOCKED` to add escalation classifier).

---

## 2. Synthesis Headlines

1. **D3 BLOCKER UNBLOCKED.** Caller-restriction has no harness-level field anywhere — three independent codebases confirm. Final answer is convention-floor; details in §3.

2. **`mode: subagent` + `permission.task: deny` is the LEAF dimension, not the caller-restriction dimension.** All three streams treat this as the runtime gate that prevents the agent from fanning out, NOT as a gate that prevents direct user invocation. Mixing the two is a documented anti-pattern (stream-03 explicit; streams 01/02 implicit via separate finding lanes).

3. **Stack detection lives in skills, not agents.** `@code` MUST delegate to `sk-code` and treat dispatched files as the primary stack signal — matches `@review.md:31` precedent and avoids swarm's `coder.ts:77+` residual-gap.

4. **Bash/interpreter writes bypass every hook.** Document this explicitly in the agent body. There is no programmatic fix in scope — this matches swarm's documented limitation (`scope-persistence.ts:26-48`) and our internal lack of a runtime allowlist.

5. **Skill auto-loading is orchestrator-side.** `@code` does NOT pick its own skills. Orchestrator's `Skills:` line in the dispatch payload + body-level Skills table is the canonical pattern.

---

## 3. Final D3 — Decision-Record Diff

Apply this to `decision-record.md` D3 (replacing the "pending research" placeholder):

```markdown
### D3 — Caller-Restriction Enforcement for @code

**Status:** Accepted (post-research, Phase 2 complete 2026-05-01)

**Decision:** Convention-floor with three layers, matching the precedent set by
`@deep-research`/`@deep-review`/`@improve-agent` and documented in
`cli-opencode/SKILL.md:296-300` and `AGENTS.md:223`:

1. Frontmatter `description` field states: "Dispatched ONLY by @orchestrate
   (orchestrator-only convention; not harness-enforced)."
2. Body §0 **DISPATCH GATE** that refuses with explicit message when invoked
   without an orchestrator-context marker (e.g. the orchestrator-injected
   "Depth: 1" prefix per `.opencode/agent/orchestrate.md:208`). REFUSE, do not
   warn-and-proceed.
3. `.opencode/agent/orchestrate.md` §3 routing-table entry adds `@code` as the
   implementation specialist.

**Reinforcing harness mechanism (LEAF, distinct from caller-restriction):**
- frontmatter `mode: subagent` (registry classification; prevents `@code` from
  being a primary/user-invocable target)
- frontmatter `permission.task: deny` (blocks the Task tool fan-out at the
  OpenCode runtime; matches 8/9 of our existing agents)

**Anti-patterns (DO NOT):**
- Invent frontmatter keys like `caller`, `dispatchableBy`, `restricted_callers`,
  `allowed_callers`, `callerRestriction`, `isOrchestrator` — none have schema or
  runtime support across any of the three researched sources, and adding them
  would create silent dead-code (`SUBAGENT_DELEGATION_RULES` precedent in
  oh-my-opencode-slim).
- Treat `permission.task: deny` as caller restriction. It prevents the callee
  from fanning out; it does NOT restrict who can invoke the callee.
- Rely on `agent_config.leaf_only: true`-style declarations alone —
  `executor-config.ts:21` does not parse the field; informational only.

**Validation:** Smoke tests T032 (orchestrator-dispatched call → §0 passes;
§1 RECEIVE proceeds) and T033 (direct-call without marker → §0 refuses with
the canonical REFUSE message).

**Citations:**
- Stream-01 (oh-my-opencode-slim): `src/agents/index.ts:428-442`,
  `src/agents/index.ts:172-181`, `src/tools/council.ts:52-69`,
  `src/config/constants.ts:25-66` (dead-code anti-pattern).
- Stream-02 (opencode-swarm-main): `src/agents/index.ts:651`,
  `src/agents/architect-permission.adversarial.test.ts:43,55,104,123`
  (suffix-classifier overmatch caveat informs name choice).
- Stream-03 (internal): `.opencode/skill/cli-opencode/SKILL.md:296-300`,
  `AGENTS.md:223`, `.opencode/agent/orchestrate.md:147,151,208`,
  `.opencode/agent/write.md:30` (closest write-capable LEAF analog).
```

---

## 4. Final `.opencode/agent/code.md` Skeleton

Adopting stream-03's §7.2 skeleton (which already conforms to our agent-file conventions) with refinements informed by streams 01/02 (Bash-bypass warning, swarm-style return contract, name-collision avoidance):

```markdown
---
name: code
description: "Application-code implementation specialist using sk-code for stack-aware execution. Dispatched ONLY by @orchestrate (orchestrator-only convention; not harness-enforced — see §0)."
mode: subagent
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  patch: allow
  bash: allow
  grep: allow
  glob: allow
  memory: allow
  list: allow
  webfetch: deny
  chrome_devtools: deny
  task: deny
  external_directory: deny
---

# The Code Implementer: Application-Code Specialist

Stack-aware application-code implementer that delegates stack detection to `sk-code`,
executes bounded by sk-code-returned guidance, and verifies via stack-appropriate gates.

> ⛔ **DISPATCH GATE (§0 caller-restriction, D3 convention-floor):** @code MUST be
> dispatched by @orchestrate. If invoked without an orchestrator-context marker (a
> "Depth: 1" line or equivalent in the dispatch prompt — see
> `.opencode/agent/orchestrate.md:208`), HALT and return:
>
> "REFUSE: @code is orchestrator-only. Dispatch via @orchestrate. (D3
> caller-restriction convention; see
> specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md ADR-D3.)"
>
> This is a convention-level gate, not a harness validator. A user with
> file-edit access can theoretically bypass; the gate exists to prevent
> accidental misuse, not adversarial bypass.

---

## 0. ILLEGAL NESTING (HARD BLOCK)

This agent is LEAF-only. Nested sub-agent dispatch is illegal.
- NEVER create sub-tasks or dispatch sub-agents.
- `permission.task: deny` blocks the Task tool at the OpenCode runtime layer.
- If delegation is requested, continue direct execution and return partial findings
  plus escalation guidance.

---

## 1. CORE WORKFLOW

### Bounded Stack-Aware Implementation

1. **RECEIVE** scope from orchestrator (parse task description, target files,
   success criteria, packet/spec-folder context).
2. **READ PACKET DOCS** if available (`spec.md`, `plan.md`, `tasks.md`) to anchor
   scope. Spec-folder scope is FROZEN per `AGENTS.md:36`.
3. **INVOKE sk-code** by reading `.opencode/skill/sk-code/SKILL.md` and applying its
   detection/intent/resource-loading protocol. Capture: stack, intents,
   verification_commands, resource paths.
4. **IMPLEMENT** strictly bounded by sk-code-returned guidance and packet scope.
   NO free-form deviation. NO files outside the orchestrator-specified scope.
5. **VERIFY** via sk-code's returned verification command. FAIL-CLOSED —
   verification failure returns summary to orchestrator. NO internal retry. NO
   loop-fix.
6. **RETURN summary** to orchestrator (see §3 escalation contract for format).

### Stack Delegation Contract

@code does NOT pre-detect stack. The full marker-file probing logic lives in
`sk-code/SKILL.md` and `sk-code/references/router/stack_detection.md`.
UNKNOWN/ambiguous returns from sk-code → escalate to orchestrator (e.g. "sk-code
returned UNKNOWN for cwd=...; needs stack hint or sibling skill").

### Skills Used

| Skill | Use When | How |
| --- | --- | --- |
| `sk-code` | Always | Read `.opencode/skill/sk-code/SKILL.md`; apply detect/route protocol; load returned resources before implementing. |
| `sk-code-opencode` | If sk-code returns UNKNOWN AND working under `.opencode/` | Sibling skill for OpenCode harness/system code. |
| `sk-code-review` | NEVER inside @code | Pair via @orchestrate dispatching @review separately if formal review is required. |

---

## 2. SCOPE BOUNDARIES

- **Scope-locked**: Only modify files explicitly named in the dispatch task
  description. NO "while we're here" cleanups (CLAUDE.md Iron Law).
- **Spec-folder discipline**: NEVER author packet docs (`spec.md`/`plan.md`/`tasks.md`/
  `checklist.md`/`decision-record.md`/`implementation-summary.md`/`handover.md`).
  Those belong to the main agent under Distributed Governance Rule
  (`AGENTS.md:340-342`). @code writes ONLY application-code files.
- **No cross-stack pivot**: If sk-code detects stack X but the task implies stack Y,
  HALT and escalate. Do not silently switch stacks.
- **Verify-before-claim**: NEVER claim completion without running stack-appropriate
  verification.
- **Bash-bypass warning**: Bash is permitted for read commands, build/test runners,
  and operations within scope. Bash MUST NOT be used to write files outside
  scope (no shell redirection / sed / eval / interpreter / network write
  workarounds). This is a documented harness-level gap (mirrors swarm's
  `scope-persistence.ts:26-48`).

---

## 3. ESCALATION & RETURN CONTRACT

Return to orchestrator with a structured summary in any of:
- sk-code returns UNKNOWN
- Verification fails (per §1 step 5 fail-closed contract)
- Scope conflict detected (file outside orchestrator-named scope)
- Confidence < 80% on a load-bearing decision (per `AGENTS.md` §4)
- Logic-Sync conflict (per `AGENTS.md` §4)

**Format:**
```
RETURN: <files modified, repo-relative> | <verification: PASS|FAIL|N/A with details> | <escalation: NONE|UNKNOWN_STACK|SCOPE_CONFLICT|LOW_CONFIDENCE|LOGIC_SYNC|VERIFY_FAIL>
```
```

The structural elements (§0 dispatch gate + §0 illegal nesting + §1 6-step workflow with fail-closed verify + §2 scope boundaries citing AGENTS.md and CLAUDE.md + §3 escalation contract) are research-validated against the closest internal precedents (`@write.md`, `@deep-research.md`, `@review.md`, `@improve-agent.md`).

---

## 5. Phase 3 Implementation Order

1. **T027** — Author `.opencode/agent/code.md` with the §4 skeleton above.
2. **T028** — Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/059-agent-implement-code --strict` to validate authored-spec markdown contract.
3. **T029** — Update `.opencode/agent/orchestrate.md` §3 routing-table to add `@code` row (D3 convention layer 3). Run targeted-strict validate after.
4. **T030** — Sync AGENTS.md siblings per memory rule:
   - `AGENTS.md` (canonical)
   - `AGENTS_Barter.md` (symlinked → separate Barter repo)
   Port shared gates / runtime contracts only; do NOT port skill-specific names. The `@code` row is shared infrastructure → port to both.
5. **T031** — Update `decision-record.md` D3 with the §3 final text above. Status: Accepted (post-research).
6. **T032** — Smoke test: orchestrator dispatch → §0 passes, §1 RECEIVE proceeds.
7. **T033** — Smoke test: direct-call without orchestrator marker → §0 returns canonical REFUSE message.
8. **T034** — Fill `implementation-summary.md` continuity block, run `generate-context.js` for canonical save, refresh `handover.md`.
9. **T035** — Strict validate one final time across the packet; mark `checklist.md` complete with evidence.

---

## 6. Out-of-Scope Cleanups (Track Separately)

These surfaced during research but do NOT belong in 059. File as future packets:

1. **Normalize `wrangler.toml` inconsistency in `sk-code/SKILL.md`** — line 274 pseudocode treats `wrangler.toml` as WEBFLOW only when no `next.config.*` exists; line 88 marker table + `references/router/stack_detection.md:46` treat it as a first-match WEBFLOW signal. Pick one. (Stream-03 finding.)
2. **Optional `sk-code-router.cjs`** — replace pseudocode-only stack detection with a callable script. Eliminates pseudocode-vs-prose drift risk. (Stream-03 reflection.)
3. **Post-dispatch validator extension** — flag `task: deny` agent → Task call attempts in iteration logs. Defense-in-depth for the "no automated test asserts that `task: deny` blocks Task" gap. (Stream-03 finding.)
4. **Runtime hook design** for scope-guard equivalent + scope-keyed knowledge injection — would adopt swarm's `scope-guard.ts` + `system-enhancer.ts:850+` patterns into our harness if/when justified. Large cross-cutting change; not justified by 059 alone. (Stream-02 R4 follow-up.)

---

## 7. References

### Per-stream research.md (canonical evidence)

- `research/stream-01-oh-my-opencode-slim/research.md` — 354 lines, 4 iterations
- `research/stream-02-opencode-swarm-main/research.md` — 259 lines, 5 iterations
- `research/stream-03-internal-agent-inventory/research/research.md` — 330 lines, 5 iterations

### External codebases (cited in streams 01/02)

- `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/`
- `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`

### Internal anchors (cited heavily in stream-03)

- `.opencode/agent/{context,debug,deep-research,deep-review,improve-agent,improve-prompt,orchestrate,review,ultra-think,write}.md`
- `.opencode/skill/sk-code/SKILL.md` + `references/router/stack_detection.md`
- `.opencode/skill/cli-opencode/SKILL.md` (D3 dispatch-contract precedent)
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `AGENTS.md` (governance: §3 §4 §5 §6 §7)
- `specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md` (D1-D10)

### Archived prior attempt

- `research_archive/2026-05-01-stream-01-cli-copilot-init/` — initial cli-copilot stream-01 init that was archived before this run

---

## 8. Convergence Summary

| Stream | Iters / Max | Stop reason | Quality guard |
|---|---|---|---|
| 01 | 4 / 8 | all_questions_answered | PASS (4-6 cited findings per Q) |
| 02 | 5 / 8 | all_questions_resolved | PASS (44 cited findings, P0/P1/P2) |
| 03 | 5 / 8 | zero-remaining-questions | PASS (56 cited findings) |

All three streams converged on the strong stop signal (5/5 questions resolved with cited evidence) rather than on weak signals (rolling-avg / MAD). All five priority questions reach the same answers from three independent sources, with the D3 finalization triangulated across all three.

**Phase 2 complete.** Hand off to Phase 3 implementation per §5.
