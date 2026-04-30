## Packet 043: hook-plugin-per-runtime-testing — Tier C live runtime testing

You are cli-codex (gpt-5.5 high fast) implementing **043-hook-plugin-per-runtime-testing**.

### Goal

Test the hook + plugin wiring for EACH supported runtime by actually invoking that runtime's CLI and observing whether the hook brief / startup context / session-stop save fire as documented. This is the live-execution counterpart to the documentation/contract pass that 031 + 034 produced.

The 5 supported runtimes:

| Runtime | CLI binary | Hook config location | Expected hook behavior |
|---------|------------|----------------------|------------------------|
| Claude Code | `claude` | `.claude/settings.local.json` | UserPromptSubmit/PreCompact/SessionStart/Stop fire; advisor brief returned via `additionalContext` |
| Codex CLI | `codex` | `~/.codex/config.toml` + `~/.codex/hooks.json` (live) OR `.codex/settings.json` (example) | SessionStart/UserPromptSubmit/PreToolUse fire when `[features].codex_hooks=true` |
| GitHub Copilot CLI | `copilot` | `.github/hooks/superset-notify.json` (postToolUse hook); custom-instructions writer for next-prompt freshness | hook output ignored; managed instructions block refreshed for NEXT prompt |
| Gemini CLI | `gemini` | `.gemini/settings.json` | SessionStart/PreCompress/BeforeAgent/SessionEnd fire; advisor brief via `additionalContext` |
| OpenCode plugin bridge | `opencode` (or local opencode) | `.opencode/plugins/*.js` | local plugin auto-load; `transform` path appends advisor brief in-process |

### Read these first

- `.opencode/skill/system-spec-kit/references/config/hook_system.md` (the hook contract reference; recently updated)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/{claude,codex,copilot,gemini}/README.md` (per-runtime hook docs)
- `.opencode/plugins/spec-kit-skill-advisor.js` (OpenCode plugin entry)
- The per-runtime CLI skills:
  - `.opencode/skill/cli-codex/SKILL.md` (how to invoke codex)
  - `.opencode/skill/cli-copilot/SKILL.md` (how to invoke copilot)
  - `.opencode/skill/cli-gemini/SKILL.md` (how to invoke gemini)
  - `.opencode/skill/cli-claude-code/SKILL.md` (how to invoke claude)
  - `.opencode/skill/cli-opencode/SKILL.md` (how to invoke opencode)
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-*.ts` — the per-CLI dispatch helpers (build-on-top reference)
- 035 findings.md (which already showed F11 hooks failing for copilot/native/inline)

### Implementation

#### Phase 1: Test scaffolding

Create `043-hook-plugin-per-runtime-testing/runners/` with a per-runtime test harness:

```
043/runners/
├── README.md (operator quickstart)
├── common.ts          (shared types: HookTestInput, HookTestResult, classification helpers)
├── test-claude-hooks.ts
├── test-codex-hooks.ts
├── test-copilot-hooks.ts
├── test-gemini-hooks.ts
├── test-opencode-plugins.ts
└── run-all-runtime-hooks.ts (orchestrator; respects 3-concurrent throttle)
```

Each runner should:
- Compose a minimal trigger prompt that should activate the hook (e.g., a UserPromptSubmit-style request mentioning a known trigger phrase)
- Invoke the runtime CLI with that prompt (via the existing matrix_runners adapter, OR directly)
- Capture the output
- Assert presence/absence of expected hook artifacts:
  - Claude: `additionalContext` block should contain a skill-advisor brief
  - Codex: stale-marker logic + freshness-smoke-check observable
  - Copilot: managed custom-instructions block updated AFTER the call (next-prompt freshness)
  - Gemini: `additionalContext` block in BeforeAgent
  - OpenCode plugin: prompt body should be transformed by the plugin
- Classify each cell as: PASS / FAIL / SKIPPED (CLI unavailable in this env) / TIMEOUT_CELL
- Capture evidence (stdout/stderr snippets, file contents)

#### Phase 2: Execute the runners

Run the orchestrator. For each cell, write JSONL evidence to `043/results/<runtime>-<event>.jsonl`. Concurrency limit: 3.

Honest reporting:
- If a CLI binary is not present in $PATH, mark SKIPPED (`reason: "binary_not_present"`)
- If a hook config file is missing for a runtime, mark SKIPPED (`reason: "config_not_present"`)
- If invocation succeeds but hook signal is absent in output, mark FAIL with the actual output captured
- Real-CLI invocations may need short wall-clock timeouts (300s) and could hit upstream API throttles

#### Phase 3: Findings + remediation

Aggregate per-runtime + per-event matrix. For each FAIL:
- Document the exact assertion that failed
- Cite the hook source code that was supposed to fire (`hooks/<runtime>/user-prompt-submit.ts:NN`)
- If the cause is a known doc/contract mismatch, reference the doc-fix that closes it (or note that a follow-up packet is needed)

For each SKIPPED:
- Document the reason
- If it's an environment limitation (CLI not installed), note that operator setup would unblock the test

For each PASS:
- Cite the file:line that produced the observable signal

Write `findings.md` at packet root with the full matrix + verdicts.

#### Phase 4: Doc updates (if any contract drift surfaced)

If FAIL cases surface a real contract bug between docs and runtime behavior, apply minimal doc fixes (per the evergreen-doc rule — describe by file:line, no packet refs).

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/043-hook-plugin-per-runtime-testing/`.

PLUS: `findings.md`, `runners/`, `results/` at packet root.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners","system-spec-kit/026-graph-and-context-optimization/031-doc-truth-pass","system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades","system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal"]`.

**Trigger phrases**: `["043-hook-plugin-per-runtime-testing","runtime hook tests","per-runtime hook validation","cli skill hook tests","hook live testing"]`.

**Causal summary**: `"Live tests hook + plugin wiring for each of 5 supported runtimes (Claude/Codex/Copilot/Gemini/OpenCode-plugin). Uses existing per-CLI skills (cli-codex/cli-copilot/cli-gemini/cli-claude-code/cli-opencode) plus the matrix_runners adapter helpers. Captures per-cell PASS/FAIL/SKIPPED with evidence; produces signed-off matrix + remediation tickets for any cells that fail."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- This packet RUNS CLIs (real subprocess execution). Honest reporting: SKIPPED is a valid status if a binary or config isn't present.
- Test outputs MUST be captured to `results/` JSONL — not just summarized in chat.
- Strict validator MUST exit 0.
- Real-CLI invocations honor cli-copilot 3-concurrent throttle.
- Per-cell timeout 300s.
- DO NOT mutate runtime hook configs to make tests pass — the test reveals reality, doesn't paper over it.
- DO NOT commit; orchestrator will commit.
- Honor evergreen-doc rule in all created markdown.

When done, last action is strict validator passing + findings.md showing complete per-runtime matrix. No narration; just write files and exit.
