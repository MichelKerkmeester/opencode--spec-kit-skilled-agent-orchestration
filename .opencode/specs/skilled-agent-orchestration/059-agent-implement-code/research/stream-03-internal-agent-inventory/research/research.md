---
title: "Stream 03 — Internal Agent Inventory & Harness Governance — Synthesis"
description: "Convergence synthesis for stream-03 of packet 059-agent-implement-code: skill auto-loading, sk-code stack detection, caller-restriction enforcement (D3 BLOCKER), write-capable safety, and LEAF/depth dispatch contracts. Maps findings to a concrete .opencode/agent/code.md design recommendation."
---

# Stream 03 — Internal Agent Inventory & Harness Governance — Synthesis

Workflow-owned canonical synthesis output for packet `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/`.

## 1. Summary

This stream investigated the existing internal `.opencode/agent/*` ecosystem, root `AGENTS.md` governance, the skill-advisor hook, deep-research command-owned dispatch wiring, and `sk-code` stack-routing. After 5 iterations driven by `cli-codex` (gpt-5.5, reasoning=high, service_tier=fast), all 5 key questions are answered with cited evidence. Convergence reached the explicit "0 remaining questions" stop signal at iteration 5; the rolling-average newInfoRatio descended from 0.86 → 0.52 (rolling avg(3) at stop = 0.587, which would extend the loop on that metric alone, but the question-coverage signal dominates).

**The headline result for the D3 blocker:** the harness has NO machine-readable caller-restriction frontmatter field and NO local dispatch validator that gates "callable only by orchestrator". Caller restriction in the current codebase is a four-layer convention: (1) prose in the agent description/body, (2) workflow ownership in command YAML (e.g. `/spec_kit:deep-research` is the only legal dispatcher of `@deep-research`), (3) tool permissions on the callee (`permission.task: deny` blocks the callee from re-dispatching, but does not restrict the caller), and (4) prompt-level NDP (Nesting/Depth/Proximity) instructions injected by `@orchestrate` at dispatch time. ADR D3 should be finalized as **convention-floor**, with the agent body's §0 dispatch gate being the strongest available enforcement. A future harness extension (a frontmatter `dispatch.allowedCallers` field plus a loader-side validator) is feasible but out of scope for packet 059.

## 2. Topic

Inventory existing internal agent ecosystem and harness governance: skill auto-loading patterns, stack-agnostic detection mechanisms, caller-restriction enforcement (D3 BLOCKER), write-capable safety guarantees, sub-agent dispatch contracts and depth/nesting rules. Output a concrete recommendation set for `.opencode/agent/code.md`.

## 3. Resolved Questions

All 5 stream-level key questions are resolved. Each carries cited evidence:

- **Q1 — Skill auto-loading patterns** (resolved iter 4). NO frontmatter field auto-loads skills. Agents declare skill needs via body prose, routing tables, or the orchestrator's task-prompt `Skills: [...]` line. The Skill Advisor hook injects a compact recommendation brief ("Advisor: ...") into the runtime prompt context but does NOT read or load `SKILL.md` for the agent. Evidence: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:25,29,31,52,59`; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124,150`; `.opencode/agent/orchestrate.md:51,93,98,194`; `.opencode/agent/improve-agent.md:48,52,205,209`; `.opencode/agent/improve-prompt.md:90`; `.opencode/agent/review.md:31,47`; `AGENTS.md:77,195,199,367,371,380`.

- **Q2 — Stack-agnostic detection in `sk-code`** (resolved iter 5). `sk-code` is an umbrella skill with first-match-wins ordered marker detection: WEBFLOW → GO → NEXTJS → UNKNOWN. The detector is documented as Python-style pseudocode in `SKILL.md` plus `references/router/stack_detection.md`; there is NO standalone executable router script, NO structured JSON marker table. WEBFLOW markers: `src/2_javascript/`, `*.webflow.js`, `Webflow.push`, `--vw-`, motion.dev/GSAP/Lenis/HLS/Swiper/FilePond, `wrangler.toml`. GO marker: `go.mod`. NEXTJS markers: `next.config.{js,mjs,ts}` or `package.json` with `"next"`/`"react"`. OpenCode harness code, generic Node.js, React Native, and Swift route to UNKNOWN or to the sibling `sk-code-opencode`. There's a small SKILL.md inconsistency around `wrangler.toml` (pseudocode at line 274 only treats it as WEBFLOW when no `next.config.*` exists, while marker table at line 88 + reference at stack_detection.md:46 treat it as a first-match WEBFLOW signal). Evidence: `.opencode/skill/sk-code/SKILL.md:2,3,12,14,75,77,79,81,88,95,101,105,111,143,244,270,303,322,663`; `.opencode/skill/sk-code/references/router/stack_detection.md:16,20,38,57,69,75,79`; `.opencode/skill/sk-code/README.md:11,18,33,82,101`; `AGENTS.md:24,174`.

- **Q3 — Caller-restriction enforcement (D3 BLOCKER)** (resolved iter 1, the originally-flagged blocker). NO machine-readable caller-restriction frontmatter key on any of the 10 live agents (`context`, `debug`, `deep-research`, `deep-review`, `improve-agent`, `improve-prompt`, `orchestrate`, `review`, `ultra-think`, `write`). The keys present are `name`, `description`, `mode`, `temperature`, `permission`, and sometimes `mcpServers`. Searched candidate fields (`caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, `callerRestriction`, `isOrchestrator`) returned zero matches. The harness has no local validator that gates "this caller is allowed to dispatch this callee". Workflow-level governance is documentation-only: `cli-opencode/SKILL.md` describes the command-owned dispatch contract (deep-research/deep-review/improve-agent/improve-prompt are dispatched ONLY by their parent commands), and `AGENTS.md:223` carries the same as a hard workflow rule, but both are instruction-level gates. The `permission.task: deny` field is NOT caller restriction — it prevents the callee from dispatching onward, not third parties from invoking it. Evidence: `.opencode/agent/{context,debug,deep-research,deep-review,improve-agent,improve-prompt,orchestrate,review,ultra-think,write}.md` frontmatter lines 2-20; `.opencode/agent/orchestrate.md:42,95,101,149,151`; `.opencode/skill/cli-opencode/SKILL.md:296,298,300`; `AGENTS.md:223,329,334,335,337,338,342`.

- **Q4 — Write-capable safety guarantees** (resolved iter 2). NO universal `allowed_paths` frontmatter, NO runtime write allowlist for `.opencode/agent/*`. Each write-capable agent expresses bounds through a four-layer convention: (a) frontmatter tool permissions (e.g. `write: allow`), (b) body-level path/scope prose (e.g. `@write` MUST NOT create docs inside `specs/[###-name]/` per `.opencode/agent/write.md:30`), (c) command-owned workflow steps that scaffold/validate (`@deep-research` writes only its resolved local-owner research packet per deep-research.md:34,52,58-61; deep-research YAML runs strict `validate.sh` after every `spec.md` mutation per spec_kit_deep-research_auto.yaml:356-360), (d) helper scripts with explicit guards (`scaffold-debug-delegation.sh:34-36,87,89,114,120,126` requires `--spec-folder`, rejects targets outside `specs/`/`.opencode/specs/`, uses noclobber). `validate.sh` is a structural/template validator, NOT a scope-lock or path-allowlist enforcer. The "spec.md scope is FROZEN" rule is `AGENTS.md:36` prose only; no code-level enforcement found. Distributed Governance Rule self-describes as "a workflow-required gate, not a runtime hook" (`AGENTS.md:342`). The leanest contrast is `@improve-prompt` which sidesteps the entire problem by denying `write`/`edit`/`patch` in frontmatter (.opencode/agent/improve-prompt.md:6-10).

- **Q5 — Sub-agent dispatch contracts and depth/nesting rules** (resolved iter 3). LEAF is enforced through THREE distinct mechanisms with different reach:
  1. **Tool-availability layer**: `permission.task: deny` is the per-agent Task-tool boundary, almost certainly consumed by the external OpenCode runtime/binary (v1.3.17 installed locally; binary source not in repo, so cannot cite the enforcement line). Evidence: `permission.task: deny` is set on 8 of 9 agents (`context`, `debug`, `deep-research`, `deep-review`, `improve-agent`, `improve-prompt`, `review`, `write`); `ultra-think` is the sole `task: allow`; `orchestrate` has no `task` key (omission grants Task by role).
  2. **Depth/single-hop layer**: enforced by `@orchestrate` body prose at orchestrate.md:40,43,105,116,120,122,126,129 (max depth=2, counters 0/1, depth-0 dispatch authority, depth-1 no-dispatch, depth 2+ forbidden) PLUS prompt injection of "NESTING CONSTRAINT" into every dispatch (orchestrate.md:147,151). NOT runtime-validated locally.
  3. **Command-owned LEAF layer**: deep-research YAML declares `agent_config.leaf_only: true` at spec_kit_deep-research_auto.yaml:81-86, but `executor-config.ts:21` parses only `kind/model/reasoning/service/sandbox/timeout` — `leaf_only` is informational. The actual LEAF instruction is carried via the prompt-pack template (`prompt_pack_iteration.md.tmpl:3,28`). The post-dispatch validator (`post-dispatch-validate.ts`) checks artifact/schema completion, NOT LEAF behavior or sub-dispatch detection.

  No automated tests assert that a `task: deny` agent is blocked from dispatching; only manual playbook scenarios exist (`.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md`).

## 4. Open Questions

None at the stream level. Three follow-ups belong to the parent packet's cross-stream synthesis:

- Should packet 059 propose a new harness-level frontmatter field for caller-restriction (e.g. `dispatch.allowedCallers: [orchestrate]`) backed by a loader-side validator, or finalize D3 as convention-only? (Streams 01/02 may surface external-repo precedents that argue one way or the other.)
- Should packet 059 normalize the `wrangler.toml` inconsistency in `sk-code/SKILL.md` (line 274 pseudocode vs line 88 marker table)? Out of scope for `code.md` itself; tracked here for visibility.
- Should `@code` add a body-level `Skills:` table in the orchestrator-task-prompt format (mirroring `@improve-agent`'s table at improve-agent.md:48) to make the `sk-code` binding maximally explicit even without auto-loading?

## 5. Key Findings

Cited findings consolidated across iterations 1-5 (selecting the load-bearing items; full registry has 56):

1. **F-iter1-001**: The 10 live `.opencode/agent/*.md` files share a uniform frontmatter schema: `name`, `description`, `mode`, `temperature`, `permission`, sometimes `mcpServers`. No agent has a caller-restriction key. (`.opencode/agent/{context,debug,deep-research,deep-review,improve-agent,improve-prompt,orchestrate,review,ultra-think,write}.md:2-20`)

2. **F-iter1-002**: `permission.task` distribution: `deny` on 8 agents, `allow` on `ultra-think` only, key absent on `orchestrate`. `ultra-think` proves LEAF is depth-sensitive — at Depth 0 it dispatches, at Depth 1 it must use `sequential_thinking` inline. (`.opencode/agent/ultra-think.md:16,40,42,55,77,89`)

3. **F-iter1-003**: `cli-opencode/SKILL.md` is the cleanest documented dispatch contract: `@deep-research`, `@deep-review`, `@improve-agent`, `@improve-prompt` are dispatched ONLY by their parent commands; never via `@orchestrate`'s Task tool. This is documentation-level governance, not runtime enforcement. (`.opencode/skill/cli-opencode/SKILL.md:296,298,300`; `AGENTS.md:223`)

4. **F-iter1-004**: `@orchestrate` injects a "NESTING CONSTRAINT" into every non-orchestrator dispatch, telling the child it is a LEAF agent and must not use Task. This is convention via prompt injection, not enforced metadata on the callee. (`.opencode/agent/orchestrate.md:147,149,151`)

5. **F-iter2-001**: `@write` is the closest analog for a write-capable LEAF specialist. Its strongest path boundary is body prose: "MUST NOT create or write documentation inside spec folders (`specs/[###-name]/`)". (`.opencode/agent/write.md:30`)

6. **F-iter2-002**: `@write` bounds output through mandatory template + validation gates: load template, copy skeleton, run `validate_document.py`, deliver only after DQI score passes. This is the canonical "convention + post-write validation" pattern. (`.opencode/agent/write.md:46,48,51,58,67,71,299,303,307,311,327`)

7. **F-iter2-003**: `@deep-research` declares the most explicit agent-local write set: only the resolved local-owner research packet for the target spec; iteration files are create-new, JSONL is append-only, strategy/registry/dashboard are reducer-owned, `research/research.md` is conditional on `progressiveSynthesis`. (`.opencode/agent/deep-research.md:34,52,58-61,162,170,207,212,291,297,308,310,312,329,333`)

8. **F-iter2-004**: `scaffold-debug-delegation.sh` is the only concrete script-level write guard found: it requires `--spec-folder`, rejects targets outside `specs/`/`.opencode/specs/`, uses noclobber. (`.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:34-36,87,89,114,120,126`)

9. **F-iter2-005**: `validate.sh` is structural (folder/template/anchor/source-header validation), not a scope-lock or path-allowlist enforcer. Its `--strict` mode upgrades warnings to errors but does not check filesystem boundaries. (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh:3,5,95,99,101,104,155,157`)

10. **F-iter3-001**: `agent_config.leaf_only: true` is declared in deep-research YAML but `executor-config.ts:21` does NOT parse it. It is informational; the actual LEAF instruction reaches the executor via the prompt pack template. (`.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81,86,523,527,536,563`; `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21`; `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:3,28`)

11. **F-iter3-002**: `post-dispatch-validate.ts` validates artifact/schema completion (state-log growth, iteration markdown existence, canonical `"type":"iteration"`, executor provenance, delta-file existence) — NOT sub-agent dispatch, depth, leaf_only, or Task-tool use. (`.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:23,37,103,136,146,164`)

12. **F-iter3-003**: No local repository code interprets `permission.task`. The OpenCode binary (1.3.17) is the likely consumer; its source is not in this repo. (Negative finding from focused grep across `.opencode/skill/`, `.opencode/plugin/`, `.opencode/command/`)

13. **F-iter4-001**: The Skill Advisor hook is a prompt-time recommendation surface, NOT a skill loader. Output format: `Advisor: <freshness>; use <skill> <confidence>/<uncertainty> pass.` Filters by threshold; returns null when no recommendation passes. (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:25,29,31,34`; `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:115,124,135,150,156`)

14. **F-iter4-002**: The advisor brief is RUNTIME/GLOBAL prompt context (Claude/Gemini/Codex use `hookSpecificOutput.additionalContext`; Copilot uses managed custom-instructions; OpenCode mutates `output.system`). NOT agent-scoped. (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:52,54,55,57,59`; `.opencode/plugins/spec-kit-skill-advisor.js:567,579,638,673`)

15. **F-iter4-003**: `@review` provides the canonical `sk-code` binding precedent: body instruction "load `sk-code` baseline first, then exactly one `sk-code-*` overlay based on stack/codebase signals." (`.opencode/agent/review.md:31,47,79,82`)

16. **F-iter4-004**: `@orchestrate`'s task format includes a `Skills: [Specific skills the agent should use]` line — orchestrator-side skill routing. Routing table at orchestrate.md:51,93-100 maps task classes to agents and skills as prose, not metadata. (`.opencode/agent/orchestrate.md:49,51,93,98,100,194`)

17. **F-iter5-001**: `sk-code` detection is documented as Python-style pseudocode (`detect_stack(cwd)`, `score_intents`, `select_intents`, `route_code_resources`) at `.opencode/skill/sk-code/SKILL.md:132,134,270,282,303` plus prose marker tables. Inventory of `.opencode/skill/sk-code/scripts/` contains only Webflow build/verify utilities (`minify-webflow.mjs`, `verify-minification.mjs`, `test-minified-runtime.mjs`); no detection script. (`.opencode/skill/sk-code/SKILL.md:544,550`; `.opencode/skill/sk-code/README.md:37,82`)

18. **F-iter5-002**: `route_code_resources()` returns `{stack, intents, verification_commands, resources}`. UNKNOWN returns no verification commands, only universal resources, and a fallback checklist. (`.opencode/skill/sk-code/SKILL.md:303,306,318,329,347,352`)

19. **F-iter5-003**: The canonical invocation pattern for a future `@code` is body/prose skill use: read `sk-code/SKILL.md`, then apply its detection/resource-loading protocol. README at `.opencode/skill/sk-code/README.md:11,18` explicitly documents manual invocation as `Read .opencode/skill/sk-code/SKILL.md`. The orchestrator-task path is `Skills: sk-code, sk-code-*` per orchestrate.md:309,315.

## 6. Ruled-Out Directions

- Existing explicit frontmatter keys named `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, `callerRestriction`, `isOrchestrator` — none exist in any agent (iter 1).
- Existing harness-level validator patterns named `isOrchestrator`, `restricted_callers`, `dispatchableBy` — focused grep returned zero matches in `.opencode/skill/`, `.opencode/plugin/`, `.opencode/command/` (iter 1).
- Treating `permission.task: deny` as caller restriction. It prevents the callee from dispatching onward; it does NOT restrict who can invoke the callee (iter 1).
- Machine-readable `allowed_paths` / `allowedPaths` / `allowed_path` fields in agent frontmatter — none exist (iter 2).
- A universal runtime write allowlist for `.opencode/agent/*` — none found in `system-spec-kit` scripts/shared (iter 2).
- Code-level enforcement of "spec.md scope is FROZEN" — only `AGENTS.md:36` prose (iter 2).
- `@orchestrate` having an explicit `permission.task: allow` frontmatter — the key is absent; orchestration authority is body-defined (iter 3).
- A local `agent_config.leaf_only` loader — informational config only (iter 3).
- Post-dispatch validation as LEAF validation — it validates artifacts/schema, not LEAF behavior (iter 3).
- Tests asserting `permission.task: deny` blocks Task — only manual playbook scenarios exist (iter 3).
- Existing agent frontmatter keys named `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, `routes` — none exist (iter 4).
- Existing runtime loader patterns named `auto_load_skills`, `preload_skills` — none found (iter 4).
- Treating the Skill Advisor hook as skill auto-loading — it injects a brief, does not load `SKILL.md` for the agent (iter 4).
- A standalone executable `sk-code` stack-router script — does not exist (iter 5).
- A structured JSON marker table for stack detection — does not exist (iter 5).
- OpenCode harness/system code as an `sk-code` application stack — belongs to `sk-code-opencode` (iter 5).
- Swift, React Native/Expo, generic Node.js owned by `sk-code` — they route to UNKNOWN (iter 5).

## 7. Recommendations

### 7.1 D3 mechanism for `decision-record.md`

**Final D3 decision (post-research):** Convention-floor with the existing three layers, NO new harness mechanism in scope for packet 059. This is the appropriate finalization because:

1. The harness has no validator surface to extend cleanly. Adding a `dispatch.allowedCallers` field would require modifying the OpenCode binary's agent loader (not in this repo) OR adding a new MCP-side dispatch validator that intercepts every `Task` call (large, cross-cutting change far beyond `@code`).
2. The strongest available enforcement is the agent's own §0 dispatch gate refusing on missing orchestrator-context marker. This matches the "convention + body refusal" pattern used by `@write`'s SPEC FOLDER BOUNDARY (.opencode/agent/write.md:30) and by `@improve-agent`'s journal-emission/proposal-only rules (.opencode/agent/improve-agent.md:155-167).
3. The existing pattern is well-precedented: `@deep-research`, `@deep-review`, `@improve-agent`, `@improve-prompt` are all "command-owned, never directly Task-dispatched" and they enforce that with body prose + `cli-opencode/SKILL.md` documentation (.opencode/skill/cli-opencode/SKILL.md:296-300) + `AGENTS.md:223` hard rule. The packet 059 plan should explicitly cite this precedent.

**Concrete D3 row text:**
> **Status:** Accepted (post-research)
>
> **Decision (final):** Convention-floor with three layers, matching the precedent set by `@deep-research`/`@deep-review`/`@improve-agent` and documented in `cli-opencode/SKILL.md:296-300` and `AGENTS.md:223`:
> 1. Frontmatter `description` field states "Dispatched ONLY by @orchestrate (orchestrator-only convention; not harness-enforced)"
> 2. Body §0 dispatch gate refuses with explicit message when invoked without an orchestrator-context marker (e.g. the orchestrator-injected "Depth: 1" prefix per `.opencode/agent/orchestrate.md:208`). Refuse, don't warn-and-proceed — matches the "absolute" tone of "cant be used in other ways"
> 3. `.opencode/agent/orchestrate.md` §3 routing table adds `@code` as the implementation specialist (orchestrator-side referencing)
>
> **Validation:** Smoke test in Phase 3 (T033) — direct-call without orchestrator marker → §0 refuses; orchestrator-dispatched call → §0 passes and §1 RECEIVE proceeds.

### 7.2 Recommended agents body skeleton for `.opencode/agent/code.md`

Modeled on `@write` (closest analog: write-capable LEAF specialist that delegates to `sk-doc`), with permission profile from D2 and §0 dispatch gate per §7.1 above:

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

Stack-aware application-code implementer that delegates stack detection to `sk-code`, executes bounded by sk-code-returned guidance, and verifies via stack-appropriate gates.

**Path Convention:** Use only `.opencode/agent/*.md` as the canonical runtime path reference.

> ⛔ **DISPATCH GATE:** @code MUST be dispatched by @orchestrate. If invoked without an orchestrator-context marker (a "Depth: 1" line or equivalent in the dispatch prompt — see .opencode/agent/orchestrate.md:208), HALT and return:
>
> "REFUSE: @code is orchestrator-only. Dispatch via @orchestrate. (D3 caller-restriction convention; see specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md ADR-D3.)"
>
> This is a convention-level gate, not a harness validator. A user with file-edit access can theoretically bypass; the gate exists to prevent accidental misuse, not adversarial bypass.

---

## 0. ILLEGAL NESTING (HARD BLOCK)

This agent is LEAF-only. Nested sub-agent dispatch is illegal.
- NEVER create sub-tasks or dispatch sub-agents.
- `permission.task: deny` blocks the Task tool at the runtime layer.
- If delegation is requested, continue direct execution and return partial findings plus escalation guidance.

---

## 1. CORE WORKFLOW

### Bounded Stack-Aware Implementation

1. **RECEIVE** scope from orchestrator (parse task description, target files, success criteria, packet/spec-folder context)
2. **READ PACKET DOCS** if available (`spec.md`, `plan.md`, `tasks.md`) to anchor scope. Spec-folder scope is FROZEN per AGENTS.md:36.
3. **INVOKE sk-code** by reading `.opencode/skill/sk-code/SKILL.md` and applying its detection/intent/resource-loading protocol. Capture: stack, intents, verification_commands, resource paths.
4. **IMPLEMENT** strictly bounded by sk-code-returned guidance and packet scope. NO free-form deviation. NO files outside the orchestrator-specified scope.
5. **VERIFY** via sk-code's stack-appropriate verification (e.g. Cloudflare deploy preview for Webflow, `go test` for Go, `npm test` for Next.js). FAIL-CLOSED — failure returns summary to orchestrator. NO internal retry. NO loop-fix.
6. **RETURN summary** to orchestrator: files modified, verification result, any UNKNOWN/escalation flags.

### Stack Delegation Contract

@code does NOT pre-detect stack. The full marker-file probing logic lives in `sk-code/SKILL.md` and `sk-code/references/router/stack_detection.md`. UNKNOWN/ambiguous returns from sk-code → escalate to orchestrator (e.g. "sk-code returned UNKNOWN for cwd=...; needs stack hint or sibling skill").

### Skills Used

| Skill | Use When | How |
| --- | --- | --- |
| `sk-code` | Always | Read `.opencode/skill/sk-code/SKILL.md`; apply detect/route protocol; load returned resources before implementing. |
| `sk-code-opencode` | If sk-code returns UNKNOWN AND working under `.opencode/` | Sibling skill for OpenCode harness/system code. |
| `sk-code-review` | NEVER inside @code | Pair via @orchestrate dispatching @review separately if formal review is required. |

---

## 2. SCOPE BOUNDARIES

- **Scope-locked**: Only modify files explicitly named in the dispatch task description. NO "while we're here" cleanups (CLAUDE.md Iron Law).
- **Spec-folder discipline**: NEVER author packet docs (`spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`decision-record.md`/`implementation-summary.md`/`handover.md`). Those belong to the main agent under Distributed Governance Rule (AGENTS.md:340-342). @code writes ONLY application-code files.
- **No cross-stack pivot**: If sk-code detects stack X but the task implies stack Y, HALT and escalate. Do not silently switch stacks.
- **Verify-before-claim**: NEVER claim completion without running stack-appropriate verification.

---

## 3. ESCALATION

Return to orchestrator with a structured summary in any of:
- sk-code returns UNKNOWN
- Verification fails (per §1 step 5 fail-closed contract)
- Scope conflict detected (file outside orchestrator-named scope)
- Confidence < 80% on a load-bearing decision (per AGENTS.md §4)
- Logic-Sync conflict (per AGENTS.md §4)

Format: `RETURN: <files modified> | <verification result: PASS|FAIL|N/A with details> | <escalation: NONE | UNKNOWN_STACK | SCOPE_CONFLICT | LOW_CONFIDENCE | LOGIC_SYNC>`
```

This skeleton is NOT prescriptive on the exact prose at every line — implementers may refine wording during T027 — but the structural elements (D3 §0 dispatch gate, D2 permission profile, §1 6-step workflow with fail-closed verify, §2 scope boundaries citing AGENTS.md and CLAUDE.md, §3 escalation contract) are research-validated against existing precedent.

### 7.3 Implementation order for packet 059

1. **First**: Author `.opencode/agent/code.md` with the skeleton above (T027). Run targeted-strict `validate.sh` after the write per Distributed Governance Rule (AGENTS.md:342).
2. **Second**: Update `.opencode/agent/orchestrate.md` routing table to add `@code` as implementation specialist (D3 layer 3). Run targeted-strict `validate.sh`.
3. **Third**: Sync the AGENTS.md sibling triad (D10) — port the `@code` row to `AGENTS.md`, `AGENTS_Barter.md`, `AGENTS_example_fs_enterprises.md`. Per memory rule, port shared gates/runtime contracts only; skip skill-specific names.
4. **Fourth**: Smoke tests (T032/T033) — verify §0 refuses on direct-call (no orchestrator marker), accepts on orchestrator-dispatched call.

### 7.4 Out-of-scope cleanups (track separately)

- Normalize `wrangler.toml` inconsistency in `sk-code/SKILL.md` (line 274 pseudocode vs line 88 marker table). Future packet.
- Consider a small tested `sk-code-router.cjs` script that exposes `detect_stack(cwd)` as callable code, eliminating the pseudocode-vs-prose drift risk. Future packet (recommended by iter 5 reflection).
- Consider extending the post-dispatch validator to flag `task: deny` agent → Task call attempts in iteration logs. Future packet.

## 8. References

### Internal source citations (file:line)

Agent frontmatter / body:
- `.opencode/agent/context.md:2,4,16,39`
- `.opencode/agent/debug.md:3,6,8,9,16,34,36,238,249,396,400`
- `.opencode/agent/deep-research.md:6,8,9,18,34,38,40,42,52,58-61,162,167,170,171,207,208,212,291,297,298,308,310,312,329,333,334`
- `.opencode/agent/deep-review.md:18,38,39`
- `.opencode/agent/improve-agent.md:16,24,26,36,38,40,42,48,52,80,99,106,107,123,137,138,155,157,160,167,205,209`
- `.opencode/agent/improve-prompt.md:6,8,9,10,16,22,24,26,37,52,90,96,99,182,208,210,239`
- `.opencode/agent/orchestrate.md:6,15,34,40,42,43,49,51,93,95,98,100,101,105,116,120,122,126,129,147,149,151,155,158,194,201,208,267,309,315,334,338,344,355,357,358,361,362,376,379,493,513,739,745,748`
- `.opencode/agent/review.md:16,31,37,47,79,82`
- `.opencode/agent/ultra-think.md:2,4,16,20,37,39,40,42,55,77,89`
- `.opencode/agent/write.md:6,8,9,16,30,34,36,37,46,48,51,58,63,67,71,299,303,307,311,327,329`
- `.opencode/agent/README.txt:4,5`

Skills / advisor:
- `.opencode/skill/sk-code/SKILL.md:2,3,12,14,40,43,75,77,79,81,88,95,101,105,111,122,132,134,143,147,244,249,270,274,282,303,306,318,322,329,330,332,347,352,544,550,621,630,631,663,665`
- `.opencode/skill/sk-code/references/router/stack_detection.md:16,20,38,46,57,63,69,73,75,79,96`
- `.opencode/skill/sk-code/references/router/resource_loading.md:31,67,112,137,142`
- `.opencode/skill/sk-code/README.md:11,18,22,33,37,82,101,105`
- `.opencode/skill/cli-opencode/SKILL.md:296,298,300`
- `.opencode/skill/sk-deep-research/SKILL.md:48,54`
- `.opencode/skill/sk-deep-review/SKILL.md:51`
- `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:3,28`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:3,29,55`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:25,29,31,34,52,54,55,57,59`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:115,124,135,150,156`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:23,37,103,136,146,164`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:1`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:62,930`
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:34,35,36,87,89,92,114,120,126`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:3,5,95,99,101,104,155,157`
- `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:202`

Plugins / commands:
- `.opencode/plugins/spec-kit-skill-advisor.js:567,579,638,673`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81,86,356,357,359,360,523,527,536,563`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:144,145,214,354,355`
- `.opencode/command/improve/agent.md:188,195,197`
- `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:150,153,154,158,164`

Governance:
- `AGENTS.md:24,36,77,174,195,196,197,199,223,329,333,334,335,337,338,340,342,367,371,380,382`

### Packet context

- `specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md` (D1-D10 ADRs; this stream finalizes D3)
- `specs/skilled-agent-orchestration/059-agent-implement-code/spec.md` (packet scope)
- `specs/skilled-agent-orchestration/059-agent-implement-code/plan.md` (research streams 01/02 sibling)

## 9. Iteration Log

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q3 caller-restriction enforcement | caller-restriction | 0.86 | 8 | complete |
| 2 | Q4 write-capable safety guarantees | write-safety | 0.72 | 13 | complete |
| 3 | Q5 LEAF + dispatch contracts | dispatch-contracts | 0.66 | 11 | complete |
| 4 | Q1 skill auto-loading patterns | skill-loading | 0.58 | 11 | complete |
| 5 | Q2 sk-code stack detection | stack-detection | 0.52 | 12 | complete |

Total iterations: 5. Total findings: 56 (cumulative; deduplicated in registry). Total sources consulted: ~70 unique file:line citations across `.opencode/agent/`, `.opencode/skill/`, `.opencode/command/`, `.opencode/plugins/`, `AGENTS.md`.

## 10. Convergence Report

**Stop reason:** zero remaining open questions (all 5 key questions resolved with at least one cited finding each).

**Three-signal vote at iteration 5:**
- Rolling avg(3) newInfoRatio = (0.66+0.58+0.52)/3 = 0.587 — does NOT cross the 0.05 threshold; this signal alone would extend the loop. Weight 0.30, score contribution = 0.
- MAD floor at 4+ iters: ratios 0.86,0.72,0.66,0.58,0.52 are monotonically decreasing with median 0.66, MAD ≈ 0.06; not at floor. Weight 0.35, score contribution = 0.
- Coverage: 5/5 questions resolved = 1.00, well above 0.85 threshold. Weight 0.35, score contribution = 0.35.

**Weighted score: 0.35**, below the 0.60 threshold for that combined signal alone. **Override**: explicit "0 remaining → STOP" rule fires. Quality guard satisfied: each of Q1-Q5 has at least one cited finding.

**Stuck count:** 0 (no consecutive low-ratio iterations; ratios decrease smoothly).

**Synthesis quality:** high. The D3 blocker has a definitive answer (no harness mechanism, convention-floor finalized). The `@code` skeleton in §7.2 is grounded in three concrete precedents (@write structure, @deep-research write boundaries, @review sk-code binding pattern).

## 11. Next Steps

For the parent packet `059-agent-implement-code`:

1. Cross-stream synthesis at `specs/.../059-agent-implement-code/research.md` — fold this stream's §7.1 D3 finalization with stream-01/stream-02 external-repo findings. If streams 01/02 surface a precedent for harness-level caller-restriction in oh-my-opencode-slim or opencode-swarm-main, RECONSIDER §7.1 before locking D3.
2. Update `decision-record.md` ADR-D3 to **Status: Accepted (post-research)** with the §7.1 final decision text.
3. Proceed to Phase 3 implementation (T027 author `code.md`, T029-T031 sibling sync, T032-T033 smoke tests). Use the §7.2 skeleton as starting draft.
4. File three follow-up packet stubs for §7.4 out-of-scope cleanups (`sk-code` wrangler.toml normalization, optional `sk-code-router.cjs`, optional post-dispatch LEAF validator extension). Mark all three as future-not-blocking.

Streamed at: 2026-05-01T16:30:00Z
Convergence stop signal: zero-remaining-questions
Lineage: dr-2026-05-01-stream-03 (generation 1, no parent session)
