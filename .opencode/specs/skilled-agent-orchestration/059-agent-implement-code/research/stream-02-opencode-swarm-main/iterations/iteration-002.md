# Iteration 002 - Q4 Write-Capable Safety Guarantees

## Focus

Q4: identify the concrete write-capable safety guarantees in opencode-swarm-main: scope declaration shape, allowed-paths config, hooks that block out-of-scope writes, and coder recovery when writes are blocked.

## Actions Taken

1. Listed `src/hooks/` and narrowed to `scope-guard.ts`, `diff-scope.ts`, `guardrails.ts`, and scope persistence.
2. Read the architect and coder prompts around `declare_scope` and WRITE BLOCKED recovery.
3. Read `declare_scope`, `scope-persistence`, default authority rules, and guard registration/call order.
4. Checked tests for adversarial scope handling, no-scope behavior, persistence fallback, and diff-scope warning behavior.

## Findings

### F1 - `declare_scope` shape is `{ taskId, files, whitelist?, working_directory? }`

The tool interface defines `DeclareScopeArgs` with `taskId`, `files`, optional `whitelist`, and optional `working_directory`; there is no `allowed_paths` field on the tool input. The tool schema requires `taskId` to match `N.M` / `N.M.P` style and requires a non-empty `files` array. Citations: `src/tools/declare-scope.ts:20`, `src/tools/declare-scope.ts:21`, `src/tools/declare-scope.ts:22`, `src/tools/declare-scope.ts:23`, `src/tools/declare-scope.ts:24`, `src/tools/declare-scope.ts:364`, `src/tools/declare-scope.ts:371`.

The optional `whitelist` is merged into `files`, so it is an additive path allowlist rather than a separate authority channel. Citations: `src/tools/declare-scope.ts:267`, `src/tools/declare-scope.ts:268`, `src/tools/declare-scope.ts:375`.

### F2 - `declare_scope` validates task identity and path shape before persisting scope

`executeDeclareScope` rejects invalid task IDs, empty file arrays, null bytes, `..` path traversal, oversized paths, invalid working directories, missing plan files, task IDs absent from `plan.json`, and completed tasks. Citations: `src/tools/declare-scope.ts:91`, `src/tools/declare-scope.ts:101`, `src/tools/declare-scope.ts:110`, `src/tools/declare-scope.ts:132`, `src/tools/declare-scope.ts:210`, `src/tools/declare-scope.ts:235`, `src/tools/declare-scope.ts:247`.

It normalizes absolute paths to relative paths and rejects absolute paths resolving outside the project directory. Citations: `src/tools/declare-scope.ts:270`, `src/tools/declare-scope.ts:276`, `src/tools/declare-scope.ts:279`, `src/tools/declare-scope.ts:294`.

It also checks declared targets for symlink-backed paths before accepting scope. Citations: `src/tools/declare-scope.ts:302`, `src/tools/declare-scope.ts:307`, `src/tools/declare-scope.ts:313`.

### F3 - Scope is stored in memory and on disk under `.swarm/scopes/scope-{taskId}.json`

On success, the tool sets `session.declaredCoderScope` on all active sessions and clears prior scope violations. Citations: `src/tools/declare-scope.ts:321`, `src/tools/declare-scope.ts:323`, `src/tools/declare-scope.ts:324`.

It then persists scope with `writeScopeToDisk(dir, args.taskId, mergedFiles)` so cross-process coder sessions can recover the architect's declaration. Citations: `src/tools/declare-scope.ts:328`, `src/tools/declare-scope.ts:333`.

The persisted payload shape is versioned and contains `taskId`, `declaredAt`, `expiresAt`, and `files`. Citations: `src/scope/scope-persistence.ts:92`, `src/scope/scope-persistence.ts:93`, `src/scope/scope-persistence.ts:94`, `src/scope/scope-persistence.ts:95`, `src/scope/scope-persistence.ts:96`, `src/scope/scope-persistence.ts:97`.

The disk file location is `.swarm/scopes/scope-{taskId}.json`. Citations: `src/scope/scope-persistence.ts:4`, `src/scope/scope-persistence.ts:59`, `src/scope/scope-persistence.ts:136`, `src/scope/scope-persistence.ts:140`.

### F4 - Scope fallback order is memory, disk, plan, then pending delegation map

Both `scope-guard` and `guardrails` call `resolveScopeWithFallbacks`. The fallback order is documented and implemented as in-memory session scope, disk-persisted scope, `.swarm/plan.json:phases[].tasks[].files_touched`, then `pendingCoderScopeByTaskId`. Citations: `src/scope/scope-persistence.ts:374`, `src/scope/scope-persistence.ts:375`, `src/scope/scope-persistence.ts:376`, `src/scope/scope-persistence.ts:377`, `src/scope/scope-persistence.ts:378`, `src/scope/scope-persistence.ts:379`, `src/scope/scope-persistence.ts:390`, `src/scope/scope-persistence.ts:392`, `src/scope/scope-persistence.ts:394`, `src/scope/scope-persistence.ts:397`.

The guardrails hook has the same order in its local resolver comment and passes the resolved scope into all authority checks. Citations: `src/hooks/guardrails.ts:1533`, `src/hooks/guardrails.ts:1540`, `src/hooks/guardrails.ts:1542`, `src/hooks/guardrails.ts:1548`, `src/hooks/guardrails.ts:1580`, `src/hooks/guardrails.ts:1607`, `src/hooks/guardrails.ts:2108`, `src/hooks/guardrails.ts:2162`.

### F5 - Two hook layers block write tools, but at different semantics

`scope-guard` is a watchdog hook. It runs before write/edit tools execute, only for tools in `WRITE_TOOL_NAMES`, only for non-architect sessions, and throws `SCOPE VIOLATION` when the target path is outside the declared scope. Citations: `src/hooks/scope-guard.ts:8`, `src/hooks/scope-guard.ts:20`, `src/hooks/scope-guard.ts:63`, `src/hooks/scope-guard.ts:74`, `src/hooks/scope-guard.ts:84`, `src/hooks/scope-guard.ts:105`, `src/hooks/scope-guard.ts:136`.

`guardrails` is the lower authority layer. It fails closed when no active agent is registered, blocks universal deny prefixes, runs per-agent authority rules, and throws `WRITE BLOCKED` for unauthorized writes. Citations: `src/hooks/guardrails.ts:2072`, `src/hooks/guardrails.ts:2077`, `src/hooks/guardrails.ts:2082`, `src/hooks/guardrails.ts:2108`, `src/hooks/guardrails.ts:2115`, `src/hooks/guardrails.ts:2123`, `src/hooks/guardrails.ts:2162`, `src/hooks/guardrails.ts:2169`.

Registration order matters: guardrails runs first, then scope-guard, then delegation-gate, and these hooks intentionally run without a safe wrapper so thrown errors propagate and block tools. Citations: `src/index.ts:430`, `src/index.ts:1128`, `src/index.ts:1131`, `src/index.ts:1134`.

### F6 - Allowed-path config is role-based authority, with declared scope relaxing only coder `allowedPrefix`

Default authority rules are role keyed. `coder` is blocked from `.swarm/` and from generated/config zones; reviewer/test/docs/designer/critic have narrower `allowedPrefix`-style rules. Citations: `src/hooks/guardrails.ts:3325`, `src/hooks/guardrails.ts:3338`, `src/hooks/guardrails.ts:3339`, `src/hooks/guardrails.ts:3340`, `src/hooks/guardrails.ts:3342`, `src/hooks/guardrails.ts:3354`, `src/hooks/guardrails.ts:3360`, `src/hooks/guardrails.ts:3364`, `src/hooks/guardrails.ts:3368`.

`declaredScope` only relaxes the `allowedPrefix` step for coder-like agents, and it does not override read-only, exact/glob/prefix denies, blocked zones, or universal deny prefixes. Citations: `src/hooks/guardrails.ts:3630`, `src/hooks/guardrails.ts:3633`, `src/hooks/guardrails.ts:3639`, `src/hooks/guardrails.ts:3645`, `src/hooks/guardrails.ts:3652`, `src/hooks/guardrails.ts:3653`, `src/hooks/guardrails.ts:3658`.

### F7 - The delegation envelope carries `files`, not a separate allowed-paths field

`DelegationEnvelope` includes `files: string[]`, `acceptanceCriteria`, and `technicalContext`, but there is no `allowedPaths` field. This means write authority is connected to the architect's `declare_scope` call and/or plan `files_touched`, not to a separate envelope-native permission field. Citations: `src/types/delegation.ts:6`, `src/types/delegation.ts:11`, `src/types/delegation.ts:12`, `src/types/delegation.ts:13`.

### F8 - Coder recovery protocol is explicit: stop, report, wait for re-scope

The coder prompt says that when Edit/Write/Patch returns `WRITE BLOCKED`, the coder must stop, must not retry with another tool, must not use shell redirection, file copying, in-place editors, interpreters, patch utilities, network writes, or indirection wrappers, and must report the block in a fixed `BLOCKED` / `NEED` format. Citations: `src/agents/coder.ts:111`, `src/agents/coder.ts:112`, `src/agents/coder.ts:113`, `src/agents/coder.ts:114`, `src/agents/coder.ts:115`, `src/agents/coder.ts:116`, `src/agents/coder.ts:117`, `src/agents/coder.ts:118`, `src/agents/coder.ts:119`, `src/agents/coder.ts:120`, `src/agents/coder.ts:121`, `src/agents/coder.ts:122`, `src/agents/coder.ts:123`, `src/agents/coder.ts:124`, `src/agents/coder.ts:125`.

The architect prompt mirrors the recovery loop: if coder returns `WRITE BLOCKED`, architect must call `declare_scope` again with the missing path and must not suggest Bash/sed/eval workarounds. Citations: `src/agents/architect.ts:120`, `src/agents/architect.ts:121`, `src/agents/architect.ts:122`, `src/agents/architect.ts:123`, `src/agents/architect.ts:129`, `src/agents/architect.ts:1186`.

### F9 - Bash/interpreter writes are a known residual gap, not a concrete hard block

The strongest correction from this iteration: shell/interpreter writes are not actually blocked by scope-guard. `scope-guard.ts` explicitly excludes Bash/shell tools from `WRITE_TOOLS` and calls this a known architectural limitation. Citations: `src/hooks/scope-guard.ts:20`, `src/hooks/scope-guard.ts:21`, `src/hooks/scope-guard.ts:22`, `src/hooks/scope-guard.ts:23`, `src/hooks/scope-guard.ts:24`.

`scope-persistence.ts` repeats that Bash/interpreter writes bypass the tool-layer authority check and that syscall-layer remediation is still tracked separately. Citations: `src/scope/scope-persistence.ts:26`, `src/scope/scope-persistence.ts:27`, `src/scope/scope-persistence.ts:28`, `src/scope/scope-persistence.ts:29`, `src/scope/scope-persistence.ts:30`, `src/scope/scope-persistence.ts:46`, `src/scope/scope-persistence.ts:47`, `src/scope/scope-persistence.ts:48`.

`declare_scope` returns a warning that scope is enforced only at the Edit/Write/Patch layer and that Bash writes bypass the check. Citations: `src/tools/declare-scope.ts:337`, `src/tools/declare-scope.ts:340`, `src/tools/declare-scope.ts:341`, `src/tools/declare-scope.ts:342`, `src/tools/declare-scope.ts:343`.

### F10 - `diff-scope` is post-hoc advisory, not a hard stop

`diff-scope` compares git-changed files against `plan.json` task `files_touched`, returns a `SCOPE WARNING` string on undeclared files, and explicitly never throws. Citations: `src/hooks/diff-scope.ts:1`, `src/hooks/diff-scope.ts:2`, `src/hooks/diff-scope.ts:3`, `src/hooks/diff-scope.ts:4`, `src/hooks/diff-scope.ts:5`, `src/hooks/diff-scope.ts:107`, `src/hooks/diff-scope.ts:133`.

It is appended to reviewer-gate output from `checkReviewerGateWithScope`, which means it reaches QA review context but is not itself the write-time block. Citations: `src/tools/update-task-status.ts:377`, `src/tools/update-task-status.ts:384`, `src/tools/update-task-status.ts:403`, `src/tools/update-task-status.ts:406`, `src/tools/update-task-status.ts:407`.

### F11 - Important mismatch: prompt says no declared scope blocks every coder write, but tests/code show no-scope allows at `scope-guard`

The architect prompt says skipping `declare_scope` will cause every coder write to be blocked by scope-guard. Citation: `src/agents/architect.ts:1186`.

The hook implementation and tests say otherwise for `scope-guard`: if no declared scope is found, it returns early and allows the tool call. Citations: `src/hooks/scope-guard.ts:90`, `src/hooks/scope-guard.test.ts:108`, `src/hooks/scope-guard.test.ts:110`, `src/hooks/scope-guard.test.ts:122`, `src/hooks/scope-guard.test.ts:132`.

The practical safety model is therefore: prompt requires architect pre-declaration; guardrails enforces role authority and honors declared scope; scope-guard blocks out-of-declared-scope writes when a scope exists; diff-scope detects undeclared diffs after the fact. A missing declaration is not, by itself, a universal runtime deny in the code inspected this iteration.

## Questions Answered

- Q4 answered: write-capable safety is multi-layered but not a pure sandbox. It combines architect `declare_scope`, persisted scope fallback, role authority rules, write-tool blocking hooks, coder recovery protocol, and post-hoc diff-scope warnings.

## Questions Remaining

- Q1 remains: skill auto-loading patterns.
- Q2 remains: stack-agnostic detection.
- Q5 remains: sub-agent dispatch contracts.
- Q4 follow-up caveat: verify whether runtime config can set `interpreter_allowed_agents` to make Bash/interpreter tools unavailable to coder sessions. That would harden the residual gap, but the default inspected path documents no syscall-layer block.

## Next Focus

Q5: sub-agent dispatch contracts. The next iteration should inspect the architect-to-worker payload shape, task depth bounds, response contract, and how `files` in the delegation envelope maps to `declare_scope` / plan `files_touched`.
