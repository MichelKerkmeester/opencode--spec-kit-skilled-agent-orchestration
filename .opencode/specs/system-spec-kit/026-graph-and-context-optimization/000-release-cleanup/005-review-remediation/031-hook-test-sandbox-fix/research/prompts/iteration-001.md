## Packet 044: hook-test-sandbox-fix — Tier B methodology + amend 043

You are cli-codex (gpt-5.5 high fast) implementing **031-hook-test-sandbox-fix**.

### Background

Packet 043 ran a hook/plugin per-runtime live test. All 5 cells came back FAIL/TIMEOUT_CELL. The findings.md verdict claimed the failures were operator environment issues (auth not set up, keychain login needed, etc.).

**That verdict is wrong.** The actual evidence (in `043/results/*.jsonl`) shows the cause is the test runner itself running INSIDE a cli-codex sandbox (`codex exec --sandbox workspace-write`). That sandbox restricts child processes to writing only inside the working directory. Every CLI binary the runner spawns then fails on:

- `~/.codex/sessions` writes (sandbox blocked) → Codex sees "permission denied"
- macOS keychain access (sandbox blocked) → Copilot sees `SecItemCopyMatching failed -50`
- `~/.claude/` and `~/.gemini/` config reads (sandbox-stripped env) → Claude says "Not logged in"; Gemini falls back to interactive browser auth despite `-y`
- `~/.local/state/opencode/locks/` writes (sandbox blocked) → OpenCode `EPERM` on mkdir

The user IS authenticated to all 5 runtimes (except possibly Copilot which is "out of usage"). The hook+plugin CODE is fine — direct smoke tests inside 043 prove every hook emits the expected signal.

The methodology is what's broken: a sandboxed test runner can't validate live runtime CLIs that need access to the user's auth state and config dirs.

### Goal

Two-part:
1. **Methodology fix**: Amend the test runner so it detects when it's running inside a sandbox; in that case it SKIPS the live-CLI step and runs only the direct hook smokes (which are sandbox-safe). Document the operator-run-outside-sandbox path as the canonical live-test mode.
2. **Reclassify 043's findings**: The FAIL/TIMEOUT_CELL verdicts misattributed cause. Reclassify as `BLOCKED_BY_TEST_SANDBOX` with the real evidence + remediation pointing to the new operator-run path.

### Read these first

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/findings.md` (the verdict that needs amendment)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/results/*.jsonl` (the actual evidence per cell)
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/runners/common.ts`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/runners/run-all-runtime-hooks.ts`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/runners/test-{claude,codex,copilot,gemini,opencode}-{hooks,plugins}.ts`
- `.opencode/skill/system-spec-kit/mcp_server/package.json` (where to add an `npm run hook-tests` script)

### Implementation

#### Phase 1: Sandbox detection in runners/common.ts

Add a `detectSandbox()` helper that returns `{ sandboxed: boolean, reason: string }`:
- Check for `CODEX_SANDBOX` env var (codex exec sets it)
- Check for `SANDBOX_PROFILE` env var
- Check for restricted-write detection: try writing to `~/.tmp-sandbox-probe-${pid}` and catch EPERM
- Also check `process.env.HOME` matches the OS-level home (sandbox sometimes diverts HOME)

Return value should expose:
```typescript
{
  sandboxed: boolean,
  reason: string,        // e.g., "CODEX_SANDBOX env present", "EPERM writing to home dir"
  detectionMethod: string
}
```

#### Phase 2: Sandbox-aware run mode in run-all-runtime-hooks.ts

When `detectSandbox()` returns `sandboxed: true`:
- Print a warning: "Sandbox detected (reason: X). Live CLI invocations will be SKIPPED. Direct hook smokes will still run."
- Each per-runtime test should:
  - Run the direct hook smoke (already implemented; sandbox-safe)
  - SKIP the live CLI invocation
  - Record status as `SKIPPED_SANDBOX` (new status code) with reason citing the sandbox detection
- Aggregate verdict in this mode: PASS if all direct smokes succeed, FAIL otherwise. Live CLI cells contribute neither pass nor fail count.

When `detectSandbox()` returns `sandboxed: false`:
- Run as before — direct smoke + live CLI invocation, both contribute to verdict.

The new `SKIPPED_SANDBOX` status is distinct from the existing `SKIPPED` (which means binary/config not present).

#### Phase 3: package.json script + operator path docs

Add to `.opencode/skill/system-spec-kit/mcp_server/package.json` scripts:

```json
{
  "hook-tests": "npx tsx ../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/runners/run-all-runtime-hooks.ts"
}
```

Or, if path resolution is awkward, add a runner script at the packet root and reference that.

Update `043/runners/README.md` to document:
- Run from a normal shell (NOT inside `codex exec`) for the live-CLI verdict
- Run via `cli-codex exec --sandbox workspace-write` if you only want the direct-smoke verdict (will SKIPPED_SANDBOX the live cells)
- The exact sandbox detection logic so operators understand when they're getting a partial run

#### Phase 4: Amend 043 findings.md

Edit `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/findings.md` to:
- Add an "Amendment (044)" section at the TOP that says the original verdict misattributed cause
- Reclassify each cell:
  - Claude UserPromptSubmit: `BLOCKED_BY_TEST_SANDBOX` (was FAIL); reason: claude binary couldn't access its credentials inside the sandboxed child process
  - Codex UserPromptSubmit freshness: `BLOCKED_BY_TEST_SANDBOX` (was FAIL); reason: codex sandbox blocked child codex from writing `~/.codex/sessions`
  - Copilot userPromptSubmitted next-prompt: `BLOCKED_BY_TEST_SANDBOX` (was FAIL); reason: macOS keychain unreachable from sandboxed child (`SecItemCopyMatching -50`)
  - Gemini BeforeAgent: `BLOCKED_BY_TEST_SANDBOX` (was TIMEOUT_CELL); reason: sandboxed child gemini didn't find auth state and fell back to interactive prompt despite `-y`
  - OpenCode plugin transform: `BLOCKED_BY_TEST_SANDBOX` (was FAIL); reason: sandbox blocked write to `~/.local/state/opencode/locks/`
- Move all 5 direct-smoke results to a new "Direct hook/plugin smoke verdict" subsection — these all PASSED, proving the hook code itself is correct
- New aggregate: Direct smoke = 5 PASS / 0 FAIL; Live CLI = 5 BLOCKED_BY_TEST_SANDBOX (deferred to operator-run-outside-sandbox)
- Add operator remediation: how to re-run the runner from a normal shell to get the actual live verdict

DO NOT delete the original "Verdict" section — preserve it as historical record under an "## Original (incorrect) verdict" subheading. Append the corrected verdict above it.

#### Phase 5: Verify build + integration

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` — must succeed
- `npx tsx specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing/runners/run-all-runtime-hooks.ts` (this WILL run inside the cli-codex test sandbox; should now report SKIPPED_SANDBOX for live cells, PASS for direct smokes — verify the new behavior works)

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/031-hook-test-sandbox-fix/`.

PLUS: `methodology-correction.md` at packet root with the full root-cause analysis (sandbox stripping access to user state).

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing"]`.

**Trigger phrases**: `["031-hook-test-sandbox-fix","hook test methodology","sandbox detection","BLOCKED_BY_TEST_SANDBOX","operator-run-outside-sandbox"]`.

**Causal summary**: `"Fixes the test methodology that 043 used. Adds sandbox detection to runners; introduces SKIPPED_SANDBOX status for live-CLI cells when running inside a sandbox; documents operator-run-outside-sandbox as the canonical live-test mode. Amends 043 findings.md to reclassify the FAIL verdicts as BLOCKED_BY_TEST_SANDBOX with the real cause and operator remediation. Hook+plugin code itself is unchanged; only test methodology + verdict classification."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- DO NOT mutate hook source code or plugin source code. The hooks/plugins are correct.
- 043's results JSONL files are historical evidence; don't rewrite them. Only amend findings.md to reclassify.
- DO honor the evergreen-doc rule (no packet IDs in evergreen docs; OK to reference in spec docs).
- Strict validator MUST exit 0 on this packet.
- Build MUST pass.
- DO NOT commit; orchestrator will commit.
- Be precise on cause: "BLOCKED_BY_TEST_SANDBOX" is the new status for live cells when sandbox detected; do not confuse with operator auth issues.

When done, last action is strict validator + build passing + 043/findings.md amended. No narration; just write files and exit.
