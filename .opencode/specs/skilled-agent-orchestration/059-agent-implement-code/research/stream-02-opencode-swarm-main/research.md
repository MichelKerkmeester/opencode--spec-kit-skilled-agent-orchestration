# Stream-02 — opencode-swarm-main: Architect-Led Swarm Patterns for `@code`

## Summary

Five autonomous research iterations (cli-codex / gpt-5.5 / high / fast) resolved all five key questions for Stream-02. The dominant finding is that opencode-swarm-main does **not** rely on prompt-level role discipline alone — it ships a real harness-level boundary in the OpenCode SDK agent config (architect = `primary` + `permission.task=allow`; everyone else = `subagent` without that permission). Write safety, dispatch, knowledge injection, and stack detection all sit on top of this caller-restriction floor and are layered through hooks. For our `@code` LEAF design, this gives us a concrete, copy-pasteable caller-restriction pattern, a multi-layer write-safety pattern, and an explicit warning about residual gaps (Bash bypass, suffix-classifier overmatch, prompt vs. runtime mismatch on missing scope).

This packet investigates `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/` only. Cross-stream synthesis with stream-01 (oh-my-opencode-slim) and stream-03 (internal agent inventory) belongs at the parent spec folder `059-agent-implement-code`, not here.

## Topic

Identify reusable patterns from the opencode-swarm-main architect-led swarm framework that inform the design of a new `@code` LEAF agent for our `.opencode/agent/` inventory. Specifically:

1. Skill auto-loading patterns — how do swarm worker agents pick up skills/contexts based on architect dispatch?
2. Stack-agnostic detection — does the swarm assume a stack, or do workers detect/probe?
3. Caller-restriction enforcement (highest priority) — what HARNESS-LEVEL mechanism ensures workers can ONLY be invoked by the architect?
4. Write-capable safety guarantees — how do worker agents prevent scope drift / accidental overwrites / out-of-scope edits?
5. Sub-agent dispatch contracts — payload structure, depth bounds, response contract.

## Resolved Questions

All 5 of 5 resolved.

| Q  | Iteration | newInfoRatio | One-line answer |
|----|-----------|--------------|-----------------|
| Q3 | 1         | 0.86         | OpenCode SDK agent config: architect = `primary` + `permission.task=allow`; subagents lack task permission. Suffix classifier overmatches `_architect`. |
| Q4 | 2         | 0.78         | Multi-layered: `declare_scope` → `scope-guard` (Edit/Write/Patch only) + `guardrails` role authority + `diff-scope` advisory + coder STOP/BLOCKED/NEED. Bash bypass is a documented gap. |
| Q5 | 3         | 0.74         | OpenCode `Task` tool with structured prompt text. `DelegationEnvelope` has no depth field — depth bounded entirely by Task permission. Workflow advance is hook-driven. |
| Q1 | 4         | 0.72         | No literal skill loader. Knowledge subsystem injects architect at phase start; coder gets a scope-keyed context pack via `system-enhancer`. `technicalContext` is plain string. |
| Q2 | 5         | 0.69         | Detection lives in `src/lang/` (marker files + extensions) and at the tool layer (`build_check`, `test_runner`, `pkg_audit`). Static worker prompts still leak TS/Bun. |

## Open Questions

None remaining at the packet level. (One Q4 follow-up for cross-stream consideration: whether the host runtime exposes a config knob to deny coder/Bash entirely, hardening the residual interpreter-write gap.)

## Key Findings (with file:line citations)

All citations are relative to `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`.

### Q3 — Caller-restriction enforcement (HIGHEST PRIORITY)

- **F-Q3-1 [P0]** `getAgentConfigs` in `src/agents/index.ts:651` is the harness-level boundary. Agents named `architect` or `*_architect` get `mode='primary'` and `permission = { task: 'allow' }`; everyone else becomes `mode='subagent'` and is **not** granted that task permission, so they cannot dispatch via the OpenCode `Task` tool. Citation: `src/agents/index.ts:651`.
- **F-Q3-2 [P0]** Adversarial test asserts the default deny-list explicitly: `coder`, `reviewer`, `explorer`, `sme`, `critic`, `test_engineer`, `docs` all lack task permission. Citation: `src/agents/architect-permission.adversarial.test.ts:43`.
- **F-Q3-3 [P0]** Multi-swarm prefixed architects (`cloud_architect`, `local_architect`, `mega_architect`, `paid_architect`) remain dispatch-capable; prefixed workers (`cloud_coder`, `cloud_reviewer`) remain denied. Citations: `src/agents/architect-permission.adversarial.test.ts:55`, `src/agents/architect-permission.adversarial.test.ts:104`.
- **F-Q3-4 [P1] CAVEAT** The classifier is suffix-based — `name === "architect" || name.endsWith("_architect")` — and the adversarial matrix explicitly labels `not_an_architect`, `_architect`, and `__architect` as matching. Any name ending in `_architect` becomes primary + task-capable. Citation: `src/agents/architect-permission.adversarial.test.ts:123`.
- **F-Q3-5 [P1]** Tool whitelist `AGENT_TOOL_MAP` reinforces the boundary: architect gets the broad orchestration tool set; coder gets implementation/search/build only, no Task tool. Citations: `src/config/constants.ts:48`, `src/config/constants.ts:124`, `src/agents/index.ts:753`.
- **F-Q3-6 [P2]** Architect prompt requires `declare_scope` before coder delegation; coder prompt forbids delegation and tells the worker to ignore agent references. These are role-discipline reinforcers on top of the SDK boundary. Citations: `src/agents/architect.ts:1186`, `src/agents/coder.ts:3`.
- **F-Q3-7 [P2]** Delegation envelope validation blocks `slash_command` delegation and validates target agents — but this is post-authorization, not the caller-restriction itself. Citations: `src/types/delegation.ts:6`, `src/hooks/delegation-gate.ts:238`, `src/hooks/delegation-gate.ts:265`.

### Q4 — Write-capable safety guarantees

- **F-Q4-1 [P0]** `declare_scope` shape: `{ taskId, files, whitelist?, working_directory? }`. `whitelist` merges into `files`. The tool validates path traversal, null bytes, oversized paths, plan presence, completed tasks, and symlinks before persisting. Citations: `src/tools/declare-scope.ts:20-24`, `src/tools/declare-scope.ts:91-313`.
- **F-Q4-2 [P0]** Scope persists to `.swarm/scopes/scope-{taskId}.json` with versioned payload (`taskId/declaredAt/expiresAt/files`). Resolver fallback order: in-memory session → disk → `plan.json:phases[].tasks[].files_touched` → `pendingCoderScopeByTaskId`. Citations: `src/tools/declare-scope.ts:328-333`, `src/scope/scope-persistence.ts:92-97`, `src/scope/scope-persistence.ts:374-397`.
- **F-Q4-3 [P0]** Two-layer hook enforcement. `scope-guard.ts:8-136` runs before write tools, only on `WRITE_TOOL_NAMES`, only for non-architect sessions, throws `SCOPE VIOLATION` outside declared scope. `guardrails.ts:2072-2169` fails closed without an active agent, blocks universal deny prefixes, runs per-role authority rules, throws `WRITE BLOCKED` for unauthorized writes. Hooks register without safe wrappers (errors propagate). Citations: `src/hooks/scope-guard.ts:8`, `src/hooks/scope-guard.ts:20`, `src/hooks/scope-guard.ts:74`, `src/hooks/guardrails.ts:2072`, `src/hooks/guardrails.ts:2162`, `src/index.ts:430`, `src/index.ts:1128`.
- **F-Q4-4 [P0]** Per-role authority rules in `guardrails.ts:3325+`. `coder` is blocked from `.swarm/` and generated/config zones. `declaredScope` only relaxes the `allowedPrefix` step for coder-like agents — it does NOT override read-only, exact/glob/prefix denies, blocked zones, or universal deny prefixes. Citations: `src/hooks/guardrails.ts:3325`, `src/hooks/guardrails.ts:3338-3368`, `src/hooks/guardrails.ts:3630-3658`.
- **F-Q4-5 [P1] KNOWN GAP** Bash/interpreter writes bypass `scope-guard` because `WRITE_TOOL_NAMES` excludes shell tools. `scope-persistence` and the `declare_scope` warning string both document this as a residual architectural limitation. Citations: `src/hooks/scope-guard.ts:20-24`, `src/scope/scope-persistence.ts:26-48`, `src/tools/declare-scope.ts:337-343`.
- **F-Q4-6 [P1]** Coder STOP/BLOCKED/NEED protocol: when Edit/Write/Patch returns `WRITE BLOCKED`, the coder must stop, must not retry, must not use shell redirection / file copying / interpreters / patch utilities / network writes / indirection wrappers, and must report in fixed `BLOCKED`/`NEED` format. Architect mirrors this with re-`declare_scope`. Citations: `src/agents/coder.ts:111-125`, `src/agents/architect.ts:120-129`.
- **F-Q4-7 [P2]** `diff-scope.ts` is post-hoc advisory — compares git-changed files against `plan.json` `files_touched`, returns `SCOPE WARNING`, never throws. Reaches QA via `checkReviewerGateWithScope` but is not the write-time block. Citations: `src/hooks/diff-scope.ts:1-133`, `src/tools/update-task-status.ts:377-407`.
- **F-Q4-8 [P1] MISMATCH** Architect prompt says missing `declare_scope` blocks every coder write; the hook implementation and tests show that `scope-guard` returns early and allows the tool call when no declared scope is found. Practical safety model: prompt requires pre-declaration; runtime only blocks when scope exists. Citations: `src/agents/architect.ts:1186`, `src/hooks/scope-guard.ts:90`, `src/hooks/scope-guard.test.ts:108-132`.

### Q5 — Sub-agent dispatch contracts

- **F-Q5-1 [P0]** Full envelope schema: `taskId/targetAgent/action/commandType/files/acceptanceCriteria/technicalContext/errorStrategy?/platformNotes?`. Only `commandType` (`'task'|'slash_command'`) and `errorStrategy` (`'FAIL_FAST'|'BEST_EFFORT'`) are typed unions. `action` is unconstrained string. Sibling type `EnvelopeValidationResult` is success/failure only — no result envelope. Citations: `src/types/delegation.ts:6-15`, `src/types/delegation.ts:21-23`.
- **F-Q5-2 [P0]** Dispatch is the OpenCode `Task` tool with a structured PROMPT TEXT block (`agent_name`, then `TASK`/`FILE`/`INPUT`/`OUTPUT`/`CONSTRAINT` lines). Writing the same text in chat is explicitly declared ineffective. Citations: `src/agents/architect.ts:395-407`.
- **F-Q5-3 [P0]** Parser accepts JSON, embedded JSON, or `KEY: value` text; normalizes aliases (`task_id`, `target_agent`, etc.) into camelCase. Validation requires the six core fields, blocks `commandType==='slash_command'`, validates target after swarm-prefix stripping. `implement` and `review` actions require non-empty `files`. Citations: `src/hooks/delegation-gate.ts:104-150`, `src/hooks/delegation-gate.ts:227-285`.
- **F-Q5-4 [P0] DEPTH BOUND** No `depth/generation/parentTaskId` field exists in `DelegationEnvelope`. Depth is enforced ENTIRELY by SDK Task permission (Q3 finding) plus the coder prompt's no-delegation rule. Citations: `src/types/delegation.ts:6-15`, `src/agents/coder.ts:3-6`, `src/state.ts:107-168`.
- **F-Q5-5 [P0] RESPONSE CONTRACT** Coder returns prompt-constrained text (`DONE`/`CHANGED`/`REUSE_SCAN` or `BLOCKED`/`NEED`), not a typed result envelope. Architect does NOT receive a typed `TaskResult`. Hooks observe the Task tool call (`subagent_type` arg) and advance per-task workflow states from `coder_delegated → reviewer_run → tests_run`. Citations: `src/agents/coder.ts:129-142`, `src/hooks/delegation-gate.ts:697-719`, `src/hooks/delegation-gate.ts:830-858`.
- **F-Q5-6 [P1]** Council tool `submit_council_verdicts` parses structured response (`success/overallVerdict/allCriteriaMet/requiredFixesCount/roundNumber/quorumSize`), but that is a council-synthesis-only contract, not a generic worker return. Citation: `src/hooks/delegation-gate.ts:619-633`.
- **F-Q5-7 [P2]** `parallel/dispatcher` exists with `DispatcherConfig {enabled, maxConcurrentTasks, evidenceLockTimeoutMs}` and decisions `dispatch/defer/reject` — but `createDispatcher` returns a no-op unless explicitly enabled and `maxConcurrentTasks > 1`; production code does not import the parallel implementation directly. Defaults: parallelization off, `maxConcurrentTasks=1`, schema cap 64. Citations: `src/parallel/dispatcher/types.ts:7-25`, `src/parallel/dispatcher/index.ts:27-34`, `src/parallel/dispatcher/parallel-dispatcher.ts:30-88`, `src/config/schema.ts:1099-1112`.
- **F-Q5-8 [P2]** Stage B parallelization (reviewer + test_engineer can run independently when `config.parallelization?.stageB?.parallel?.enabled === true`) and council parallel dispatch (architect prompt instructs single-message multi-Task fan-out) are the only active parallel surfaces. Citations: `src/hooks/delegation-gate.ts:727-767`, `src/agents/architect.ts:1522-1548`.

### Q1 — Skill auto-loading patterns

- **F-Q1-1 [P0]** No first-class skill loader. The analogue is the knowledge subsystem with stores `.swarm/knowledge.jsonl` (project), `.swarm/knowledge-rejected.jsonl` (project), and `shared-learnings.jsonl` (hive/platform). Config exposes `knowledge.enabled`, entry limits, injection count, character budget, scope filtering. Citations: `src/knowledge/index.ts:1-3`, `src/config/schema.ts:822-844`, `src/hooks/knowledge-store.ts:36-72`.
- **F-Q1-2 [P0]** Architect-only auto-injection at phase start. `knowledge-injector.ts` runs as `experimental.chat.messages.transform`, gated by `isOrchestratorAgent` (strips swarm prefix; only base role `architect` passes). Inserts a system message before the last user message, caches per-phase for compaction recovery. Citations: `src/hooks/knowledge-injector.ts:102-107`, `src/hooks/knowledge-injector.ts:208-216`, `src/index.ts:472-473`, `src/index.ts:1001-1007`.
- **F-Q1-3 [P0]** Architect-block ranking: lessons + run memory + drift preamble + rejected-pattern warnings, in that order. `readMergedKnowledge` merges swarm and hive (hive wins on duplicates), filters by `scope_filter`, excludes archived, ranks by category/confidence/keyword. Citations: `src/hooks/knowledge-injector.ts:233-350`, `src/hooks/knowledge-reader.ts:293-371`.
- **F-Q1-4 [P0] (closest analogue to worker auto-loading)** Coder-only context pack in `system-enhancer.ts:850+`: when active base role is `coder`, reads session declared scope, uses first file as a knowledge query, calls `knowledge_recall`, and injects a `## CONTEXT FROM KNOWLEDGE BASE` block when results exist. Same pack also injects prior reviewer rejections from task evidence and repo-graph localization for the declared primary file. Role-specific, scope-keyed, hook-injected — NOT carried in the static prompt. Citations: `src/hooks/system-enhancer.ts:850-960`.
- **F-Q1-5 [P1]** Architect dispatch still does explicit knowledge selection: pre-delegation "dark matter co-change detection" — call `knowledge_recall` with `hidden-coupling primaryFile`, add returned files to `AFFECTS`. So the model is mixed: hook auto-injects + architect explicitly augments. Citations: `src/agents/architect.ts:1184-1190`.
- **F-Q1-6 [P1]** `technicalContext` is `string` only — no structured skill/capability/context-pack slot. Coder prompt's `INPUT: [requirements/context]` format treats it as untyped human-readable text. Citations: `src/types/delegation.ts:13`, `src/agents/coder.ts:11-16`.
- **F-Q1-7 [P2]** `context/role-filter.ts` supports `[FOR: ...]` tags but PRESERVES system prompts, user delegation envelopes, plan content, and knowledge content (never filters them). Useful as a delivery filter, not a loader. Citations: `src/context/role-filter.ts:22-126`.
- **F-Q1-8 [P2]** `/swarm knowledge` command provides operational management (migrate/list/quarantine/restore), not dispatch-time loading. Citations: `src/commands/knowledge.ts:40-171`.

### Q2 — Stack-agnostic detection

- **F-Q2-1 [P0]** Implementation substrate ≠ target substrate. Swarm ships as Bun/TypeScript (`package.json:10/12/35/41/43/54/59`) but its analysis layer is multi-language with tree-sitter grammar WASM files for many languages. Citations: `src/lang/detector.ts:1-4`, `src/lang/index.ts:1-4`.
- **F-Q2-2 [P0]** `detectProjectLanguages(projectDir)` in `src/lang/detector.ts:25` is the project-level probe: scans root + immediate subdirs (skipping dot-dirs and `node_modules`), matches each profile's `build.detectFiles`, and detects by file extension. Sibling `getProfileForFile(filePath)` provides file-level profile resolution used by `system-enhancer`, `syntax-check`, and `sast-scan`. Citations: `src/lang/detector.ts:13-96`, `src/hooks/system-enhancer.ts:343`, `src/tools/syntax-check.ts:148`, `src/tools/sast-scan.ts:317`.
- **F-Q2-3 [P0]** `LanguageProfile` model in `src/lang/profiles.ts:29` encodes per-language extensions, tree-sitter grammar, build/test/lint/audit detection files, commands, and prompt constraints/checklists. Marker coverage: TS/JS via `package.json`, Python via `setup.py`/`pyproject.toml`/`setup.cfg`, Rust via `Cargo.toml`, Go via `go.mod`, Java/Kotlin via Maven/Gradle, .NET via `*.csproj`/`*.sln`. Citations: `src/lang/profiles.ts:29-62`, `src/lang/profiles.ts:109-583`.
- **F-Q2-4 [P0]** Tool-layer stack detection. `build_check` → `discoverBuildCommands` runs profile-driven detection first, then ecosystem fallback (`ECOSYSTEMS` table covers Node/Rust/Go/Python/Maven/Gradle/.NET/Swift/Dart/C/C++/PHP). `test_runner` supports Bun/Vitest/Jest/Mocha/pytest/cargo/Pester/Go/Maven/Gradle/dotnet/CTest/Swift/Dart/RSpec/Minitest, with explicit "targeted-execution unsupported" reasons for Go/cargo/Maven/Gradle/.NET/CTest/Swift. `pkg_audit` exposes `ecosystem: "auto"` with file-detector for nine ecosystems. Citations: `src/tools/build-check.ts:190-201`, `src/build/discovery.ts:38-393`, `src/tools/test-runner.ts:28-398`, `src/tools/test-runner.ts:870-885`, `src/tools/pkg-audit.ts:101-1627`.
- **F-Q2-5 [P0]** Stack adaptation reaches prompts via hooks. `system-enhancer.ts:324+` builds language-specific coder/reviewer/test-engineer blocks from task-file paths, then pulls constraints/checklists from the language profile registry. Task-file paths imply profile, profile implies prompt constraints. There is **no** `stack`/`targetLanguage`/framework-declaration knob in `src/config/schema.ts` — closest surface is agent/model overrides. Citations: `src/hooks/system-enhancer.ts:324-420`, `src/config/schema.ts:83-275`.
- **F-Q2-6 [P1] RESIDUAL GAP** `src/agents/coder.ts:77+` general safety rules name TypeScript-specific constraints (`any`, import traversal), Node APIs, `path.join`, and Bun test framework. `test-engineer.ts:41+` is better (maps multiple languages) but still gives TS/JS hard Bun preference. The TypeScript profile's highest-priority build/test commands are Bun-flavored (`bun run build`, `bun test`) when `package.json` exists, so detection can pick Bun before npm/vitest/jest fallback. Citations: `src/agents/coder.ts:77-97`, `src/agents/test-engineer.ts:41-77`, `src/lang/profiles.ts:119-154`, `src/build/discovery.ts:382-393`.

## Ruled-Out Directions

- **Env vars / runtime caller-identity checks as the primary caller-restriction (Q3 iter 1)** — the actual mechanism is the OpenCode SDK agent config (mode + permission.task), surfaced by `getAgentConfigs` in `src/agents/index.ts:651`. There are no env-var or frontmatter guards that gate caller identity.
- **Treating `DelegationEnvelope` as a depth/generation contract (Q5 iter 3)** — no depth/generation/parentTaskId field exists. Depth is bound only by SDK Task permission.
- **Searching for a literal skill loader subsystem (Q1 iter 4)** — there is no skill loader; the analogue is the knowledge subsystem with phase-start architect injection and the scope-keyed coder context pack via `system-enhancer`.
- **Assuming static worker prompts are stack-neutral (Q2 iter 5)** — `coder.ts` and `test-engineer.ts` contain TypeScript/Bun specifics. Stack-agnosticism lives at the tool/hook layer, not in prompts.

## Recommendations for `.opencode/agent/code.md`

These are concrete, diff-level recommendations the parent (059-agent-implement-code) can apply directly. Each is anchored to the cited swarm pattern.

### R1 — Caller-restriction at the harness level (P0, derived from Q3)

**Mechanism for our `@code` agent:** rely on the OpenCode SDK agent-mode boundary, not on prompt language alone. In `.opencode/agent/code.md`:

- Frontmatter MUST set `mode: subagent`. Do NOT grant `permission.task: allow`.
- Pick a name that does NOT match `^architect$|_architect$` to avoid the swarm-style suffix overmatch caveat (`architect-permission.adversarial.test.ts:123`). `code` and `agent-code` are safe; `code_architect`, `_architect`, `__architect` would be silently elevated by a swarm-style classifier. We don't currently use that classifier, but the principle generalizes — keep "primary"-implying tokens out of subagent names.
- Restrict the tool whitelist to implementation surfaces only (Read, Write, Edit, Bash, Grep, Glob; NO Task tool; NO sub-agent dispatch). This mirrors swarm's `AGENT_TOOL_MAP` (`src/config/constants.ts:48`).
- Add a "MUST NOT delegate" clause in the body prompt mirroring `src/agents/coder.ts:3-6`. This is reinforcement, not the boundary.
- For **decision-record.md → D3 caller-restriction**, document this layered model: (1) SDK agent-mode floor, (2) tool whitelist, (3) prompt-level no-delegation discipline. State explicitly that prompt language is **not** the boundary.

### R2 — Write-capable safety (P0, derived from Q4)

**Pattern:** scope declaration + tool-name allowlist hook + role authority hook + post-hoc diff advisory + worker recovery protocol.

For `.opencode/agent/code.md`:

- Require the orchestrator (`@orchestrate`) to provide an explicit `files: string[]` allowlist in the dispatch payload (analogue to `declare_scope`'s `files`). Make this a contract, not an option.
- If the host runtime supports it, add a hook equivalent to `scope-guard` that intercepts Write/Edit (NOT Bash) and throws when the target is outside the dispatch `files` allowlist.
- Inherit the **explicit Bash gap warning** from swarm: document in the agent prompt that shell redirection / interpreter writes / `sed` / `eval` / network writes are forbidden bypass routes, mirroring `src/agents/coder.ts:111-125`. List these by name; do not rely on implicit understanding.
- Add a STOP/BLOCKED/NEED recovery format to the agent prompt. When a write is blocked, `@code` returns `BLOCKED: <path>` + `NEED: <reason or path to add>` and yields back to `@orchestrate`. No retry, no workaround.
- Document the scope-guard / prompt mismatch from `src/hooks/scope-guard.test.ts:108-132`: missing-scope behavior must be designed deliberately. Either fail closed (reject all writes when no allowlist provided) or fail open with a logged warning. Pick one and implement consistently.

### R3 — Dispatch contract (P0/P1, derived from Q5)

**Pattern:** structured prompt text + small JSON-or-text envelope + no depth field + hook-driven workflow advance.

For our dispatch from `@orchestrate` → `@code`:

- Define a small dispatch envelope with these fields (mirroring `DelegationEnvelope`): `taskId`, `targetAgent: "code"`, `action: string`, `files: string[]`, `acceptanceCriteria: string[]`, `technicalContext: string`. Keep `commandType` if we ever need to gate slash-command paths.
- Tighten what swarm leaves loose: enumerate `action` (`implement | refactor | fix | rename | move`) — swarm leaves it as unconstrained string and lost validation surface as a result.
- Add an explicit **return contract**: `@code` MUST return either `DONE: <summary>` + `CHANGED: <files>` or `BLOCKED: <reason>`. This makes orchestrator parsing deterministic — swarm relies on prompt-parsed text and gives that as a follow-up improvement.
- Do NOT add a depth/generation/parentTaskId field. Depth is enforced by the SDK no-Task-permission floor (R1). Adding it would be redundant + brittle.
- Validation: reject envelopes with `commandType !== 'task'`, missing `files`, missing `acceptanceCriteria`, or unknown `targetAgent`. Mirror `src/hooks/delegation-gate.ts:227-285`.

### R4 — Skill / context auto-loading (P1, derived from Q1)

**Pattern:** keep the static prompt small + orchestrator declares context explicitly + hook-injected scope-keyed knowledge + clearly labeled.

For `.opencode/agent/code.md`:

- Keep the static prompt role-pure: identity, constraints, return format. No baked-in framework expertise.
- Have `@orchestrate` provide concrete files + memory excerpts in the dispatch payload (the `technicalContext` analogue). This is cheap and explicit.
- Optional: add a runtime hook (separate spec packet, not in this agent file) that reads dispatch `files`, calls `memory_quick_search` and `code_graph_context` keyed on the primary file, and injects a `## CONTEXT FROM KNOWLEDGE BASE` block (mirror `system-enhancer.ts:850+`). Budget the injected block (entries cap, char cap) like swarm does.
- Treat persistent lessons as Spec Kit Memory continuity entries, not as executable skills. `@code` does NOT pick its own skills.

### R5 — Stack detection (P1, derived from Q2)

**Pattern:** detect at tool/hook boundaries; keep worker prompt stack-neutral; rely on dispatch file paths as primary signal.

For `.opencode/agent/code.md`:

- **Do NOT bake stack-specific rules** into the agent prompt. No mentions of `bun:test`, `npm`, `go test`, `pytest`, framework names, or language-specific safety rules. Keep the prompt at the "implementation contract" level.
- Require dispatch payload to include concrete file paths; the agent uses paths as the primary stack signal (read `package.json` / `go.mod` / `pyproject.toml` if needed at runtime, but only after locating the relevant marker in the dispatched files' ancestor tree).
- Defer language-specific guidance to `sk-code` (which already detects stack and loads stack-aware patterns per the project AGENTS.md). The smart-routing already exists; `@code` should call it rather than duplicating.
- Return explicit `BLOCKED: stack <name> not supported by this dispatch (reason: ...)` rather than fabricating commands for an unrecognized stack — mirror swarm's "targeted-execution unsupported" reasons in `src/tools/test-runner.ts:870-885`.

### Draft `.opencode/agent/code.md` skeleton

```yaml
---
description: Write-capable LEAF implementation agent. Dispatched ONLY by @orchestrate. Implements code changes within an orchestrator-declared file allowlist, returns DONE/BLOCKED, never delegates.
mode: subagent
model: claude/sonnet-4.7
temperature: 0.1
tools:
  read: true
  write: true
  edit: true
  bash: true
  grep: true
  glob: true
  task: false  # Hard floor: cannot dispatch sub-agents (mirrors src/agents/index.ts:651 swarm pattern)
permission:
  task: deny    # Defense-in-depth (the runtime SDK floor is the actual boundary)
  edit: allow
  bash:
    "*": ask
    "rm -rf *": deny
    "echo *": allow
    "ls *": allow
    "cat *": allow
allowed_directories: []  # Set per-dispatch by @orchestrate; agent rejects writes outside this list
---

# @code — Write-Capable LEAF Implementation Agent

## Identity & Boundary
- LEAF agent. MUST NOT use the Task tool. MUST NOT reference, summon, or simulate any other agent.
- Dispatched ONLY by @orchestrate. If user invokes me directly, respond `BLOCKED: not directly invocable; route via @orchestrate` and stop.
- I read, edit, and run shell commands within an orchestrator-declared file allowlist. I never decide scope myself.

## Dispatch Contract
The orchestrator MUST send a dispatch envelope:
```
TASK: <one-line summary>
ACTION: implement | refactor | fix | rename | move
FILES: <repo-relative path list — REQUIRED, non-empty>
ACCEPTANCE: <criteria — REQUIRED, non-empty>
INPUT: <requirements / context blob — may be empty>
CONSTRAINT: <stack-specific rules — may be empty>
```
Reject envelopes with empty FILES or ACCEPTANCE.

## Write Boundary (mirrors swarm scope-guard + guardrails)
- Writes are constrained to FILES + the dispatch-declared allowed_directories.
- Out-of-scope writes MUST return `BLOCKED: <path> outside scope` immediately. NO retry. NO shell redirection / sed / eval / interpreter / network write workarounds.
- Bash is permitted for read commands, build/test runners, and operations explicitly within scope. Bash MUST NOT be used to bypass write restrictions.

## Stack Discipline
- I treat the dispatched FILES as the primary stack signal. I do NOT assume TypeScript/Node/Go/Python.
- For language-specific patterns, I delegate cognitively to the `sk-code` skill (which detects stack via marker files). I do NOT bake stack rules into my own behavior.

## Return Contract
- Success: `DONE: <one-line summary>` + `CHANGED: <files modified>` + `REUSE_SCAN: <patterns reused or "none">`.
- Blocked: `BLOCKED: <reason>` + `NEED: <what orchestrator must provide>`.
- Never partial-success. Either DONE with all ACCEPTANCE met or BLOCKED.
```

This skeleton is meant to be edited at the parent spec folder (059-agent-implement-code) where cross-stream synthesis with stream-01 and stream-03 happens. Numbers/line ranges from swarm should be cited verbatim in the resulting `decision-record.md` — D3 (caller-restriction) and D4 (write-safety) are the load-bearing decisions to anchor against.

## References

- External codebase: `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`
- Iteration narratives: `iterations/iteration-001.md`..`iteration-005.md` (this packet)
- Per-iteration deltas: `deltas/iter-001.jsonl`..`deltas/iter-005.jsonl` (this packet)
- State log: `deep-research-state.jsonl` (this packet)
- Strategy: `deep-research-strategy.md` (this packet)
- Findings registry: `findings-registry.json` (this packet)

## Iteration Log

| Iter | Focus | newInfoRatio | Status   | Questions resolved this iter | Cited findings |
|------|-------|--------------|----------|------------------------------|----------------|
| 1    | Q3 caller-restriction | 0.86 | insight | Q3 | 8 |
| 2    | Q4 write-safety       | 0.78 | insight | Q4 | 11 |
| 3    | Q5 dispatch contracts | 0.74 | insight | Q5 | 9 |
| 4    | Q1 skill auto-loading | 0.72 | insight | Q1 | 8 |
| 5    | Q2 stack detection    | 0.69 | insight | Q2 | 8 |

Total cited findings: ~44 (with multiple file:line citations per finding).

## Convergence Report

Stop reason: **all_questions_resolved (5/5)**.

- Iterations executed: 5 of 8 budget.
- Rolling-avg newInfoRatio (last 3 iters): 0.717 (above 0.05 threshold but moot — primary stop signal triggered first).
- MAD floor / coverage gates: not evaluated; primary `remaining_questions == 0` stop signal pre-empted them.
- Quality guard: each of Q1..Q5 has multiple cited findings ≥ P1 severity. PASSED.
- Stuck count: 0. No iteration regressed in newInfoRatio relative to its predecessor's expected decay; graceful 0.86 → 0.78 → 0.74 → 0.72 → 0.69 trajectory.
- No dispatch failures. Codex CLI (gpt-5.5 high fast) emitted a benign rollout-record warning at exit but artifacts (iteration narrative + state log append + delta JSONL) landed cleanly every iteration.

## Next Steps

1. **At parent (`059-agent-implement-code`)**: synthesize this packet's R1–R5 with stream-01 (oh-my-opencode-slim) and stream-03 (internal agent inventory). Build the unified `@code` agent spec from cross-stream consensus.
2. **At parent decision-record.md**: anchor D3 (caller-restriction) on F-Q3-1/F-Q3-2/F-Q3-4. Anchor D4 (write-safety) on F-Q4-1..F-Q4-8 with explicit acknowledgement of the Bash gap and the prompt/runtime mismatch.
3. **Dispatch envelope ADR**: cite F-Q5-1..F-Q5-5 + R3 to lock in `action` enumeration and explicit return contract — improvements over swarm's loose envelope.
4. **Optional follow-up packet** (out of scope here): runtime hook design for scope-guard equivalent + scope-keyed knowledge injection + role-filter pattern. Cite F-Q4-3, F-Q1-2, F-Q1-4, F-Q1-7.
