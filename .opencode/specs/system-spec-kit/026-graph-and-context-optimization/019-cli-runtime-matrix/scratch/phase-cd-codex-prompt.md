# Phase 019-C+D: Cross-CLI Delegation Docs + Setup Flags + CLI Matrix Tests (8 tasks)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-cli-runtime-matrix/`
**Phase 019-A+B state**: COMPLETE. executor-config per-kind validation + 12 YAML branches shipped. 48/48 tests green.
**Your role**: Execute Phase 019-C (docs) + Phase 019-D (setup flags + tests). Bundled because both are low-risk additive edits.

**First line of output**: `GATE_3_ACKNOWLEDGED: proceeding with packet 019 Phase C+D`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Phase 019-C — Cross-CLI Delegation Docs

### T-DOC-05 — Update sk-deep-research SKILL.md Executor Selection Contract

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md`

Find the **Executor Selection Contract** section added in Phase 018 (search for heading `### Executor Selection Contract`). The existing content has a Markdown table listing four kinds with statuses like:

- `native` — Shipped. Default.
- `cli-codex` — Shipped (spec 018).
- `cli-copilot` — Not wired — awaits future spec.
- `cli-gemini` — Not wired — awaits future spec.
- `cli-claude-code` — Not wired — awaits future spec.

Update the table so all four CLIs say **"Shipped (spec 019)"** for rows 3, 4, 5. Keep `native` and `cli-codex` rows exactly as they were.

Add a new subsection **AFTER** the table and **BEFORE** the "Invariants" section (or wherever the closing content sits) titled `#### Cross-CLI Delegation`:

```markdown
#### Cross-CLI Delegation

Each CLI executor operates inside its own sandbox / permissions layer (codex `workspace-write`, copilot `allow-all-tools`, gemini `-y -s none`, claude-code `acceptEdits`). Within that sandbox, a running iteration CAN, in theory, shell out to other CLIs.

**What is possible**:
- A `cli-codex` iteration can invoke `gemini "..."`, `copilot -p ...`, or `claude -p ...` via its shell.
- A `cli-gemini` iteration can invoke `codex exec ...`, `copilot -p ...`, or `claude -p ...`.
- A `cli-copilot` iteration can invoke other CLIs through its tool-execution layer.
- A `cli-claude-code` iteration (with `acceptEdits` permission mode) can invoke other CLIs via shell.

**Anti-patterns** (each CLI's own SKILL.md warns against these):
- **Self-recursion**: do NOT invoke `codex` from within a `cli-codex` iteration; do NOT invoke `copilot` from within a `cli-copilot` iteration; same for gemini and claude-code. Each CLI's orchestration skill warns that self-invocation is circular and wasteful.
- **Auth propagation assumptions**: do NOT assume the parent executor's environment has credentials for child CLIs. Each CLI uses its own authentication layer (OPENAI_API_KEY for codex, GitHub OAuth for copilot, Google credentials for gemini, Anthropic API key for claude). Auth is a user-responsibility; the deep-loop workflow does not mediate.

**Runtime enforcement**: NONE. This is documented design intent, not a code path. If a user wires a recursive invocation, the `post_dispatch_validate` step will eventually catch repeated failures through the existing `schema_mismatch` → `stuck_recovery` flow, but the workflow does not detect or block cross-CLI delegation at dispatch time.
```

### T-DOC-06 — Mirror to sk-deep-review SKILL.md

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`

Find the matching Executor Selection Contract section (same structure as sk-deep-research, with review-specific JSONL schema). Same two edits:
1. Update the four CLI rows in the contract table to say **"Shipped (spec 019)"** for cli-copilot, cli-gemini, cli-claude-code.
2. Add the same `#### Cross-CLI Delegation` subsection. You can reuse the text verbatim from T-DOC-05.

### T-DOC-07 — Update sk-deep-research loop_protocol.md §3 Executor Resolution

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md`

Find the **Executor Resolution (spec 018)** subsection in §3. Currently it mentions only `native` and `cli-codex`. Expand to list all 4 CLI kinds with their dispatch shapes:

```markdown
#### Executor Resolution (spec 018 + 019)

Before dispatching, the YAML resolves the executor via `parseExecutorConfig` from `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`. The resolved `config.executor.kind` selects the dispatch branch:

- `native` (spec 018): dispatch `@deep-research` agent with model Opus.
- `cli-codex` (spec 018): pipe rendered prompt via stdin to `codex exec --model X -c model_reasoning_effort=Y -c service_tier=Z -c approval_policy=never --sandbox workspace-write`.
- `cli-copilot` (spec 019): positional prompt to `copilot -p "$(cat prompt)" --model X --allow-all-tools --no-ask-user`. No stdin support; no CLI reasoning-effort flag (set via `~/.copilot/config.json` ahead of time).
- `cli-gemini` (spec 019): positional prompt to `gemini "$(cat prompt)" -m X -s none -y -o text`. Model whitelist enforced (`gemini-3.1-pro-preview` only). No reasoning-effort or service-tier flags.
- `cli-claude-code` (spec 019): `claude -p "$(cat prompt)" --model X --permission-mode acceptEdits --output-format text` with optional `--effort Y`. Default permission-mode is `plan` (read-only); we override to `acceptEdits` so iteration writes succeed.

All branches share:
1. Pre-dispatch prompt rendering via `renderPromptPack` (writes to `{spec_folder}/research/prompts/iteration-{n}.md`).
2. Post-dispatch validation via `validateIterationOutputs` (asserts iteration file + JSONL delta + required fields).
3. Executor audit append via `appendExecutorAuditToLastRecord` (skipped when kind=='native').

Per-kind flag-compatibility is enforced at config parse time by `EXECUTOR_KIND_FLAG_SUPPORT` in `executor-config.ts`. Setting a flag that the chosen kind does not support throws `ExecutorConfigError` before dispatch.

Cross-CLI delegation (a running executor invoking other CLIs via its shell) is documented design intent. Runtime recursion detection is out of scope; see the SKILL.md Cross-CLI Delegation subsection.

Failure handling remains unchanged from spec 018: `schema_mismatch` → conflict event → 3 consecutive failures → `stuck_recovery`.
```

Replace the existing Executor Resolution subsection with this expanded version.

### T-DOC-08 — Mirror to sk-deep-review loop_protocol.md

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/references/loop_protocol.md`

Same expansion. Substitute `@deep-review` for `@deep-research` and `review/prompts/` for `research/prompts/`.

---

## Phase 019-D — Setup Flags + CLI Matrix Tests

### T-FLG-03 — Update sk-deep-research command doc setup

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/deep-research.md`

Find the **Q-Exec** question added in spec 018. Currently it offers options A (native) and B (cli-codex). Expand to all 5:

```markdown
> **Q-Exec. Executor (optional, press enter for default):**
>   A) Native (default) — dispatch via @deep-research agent with Opus.
>   B) cli-codex — `codex exec` with --model X -c model_reasoning_effort -c service_tier.
>   C) cli-copilot — `copilot -p "PROMPT" --model X --allow-all-tools --no-ask-user`. Reasoning-effort only via ~/.copilot/config.json. No service-tier.
>   D) cli-gemini — `gemini "PROMPT" -m gemini-3.1-pro-preview -y -o text`. Single supported model currently. No reasoning-effort or service-tier.
>   E) cli-claude-code — `claude -p "PROMPT" --model X --permission-mode acceptEdits` with optional --effort. No service-tier.
```

Also find the **"Reply format examples"** block (if present) and add one example using cli-copilot, e.g.:

`"agent execution guardrails research, B, A, 15, 0.05, C, gpt-5.4, _, _"`

Where `_` denotes "not applicable" fields (reasoning-effort and service-tier for cli-copilot).

### T-FLG-04 — Mirror to sk-deep-review command doc

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/deep-review.md`

Same Q-Exec expansion. Use review-flavored example in the reply-format block.

### T-TST-06 — Create CLI matrix test suite

**File to create**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`

This test file verifies the expected dispatch command shape per executor kind. Since the YAML workflow isn't directly testable at the unit level (the runtime engine owns that), the test covers config→command-shape transformation via a helper function that we'll define inline in the test (later this could be extracted into a shared module).

Test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { parseExecutorConfig, type ExecutorConfig } from '../../lib/deep-loop/executor-config';

/**
 * Helper: Given a validated ExecutorConfig and a rendered-prompt path,
 * return the expected command string for that kind.
 * This mirrors the YAML dispatch logic for verification purposes.
 */
function buildDispatchCommand(config: ExecutorConfig, promptPath: string): string {
  switch (config.kind) {
    case 'native':
      return `TASK(agent=deep-research, model=opus, context=@${promptPath})`;
    case 'cli-codex':
      return [
        `codex exec`,
        `--model "${config.model}"`,
        `-c model_reasoning_effort="${config.reasoningEffort}"`,
        `-c service_tier="${config.serviceTier}"`,
        `-c approval_policy=never`,
        `--sandbox workspace-write`,
        `- < "${promptPath}"`,
      ].join(' ');
    case 'cli-copilot':
      return [
        `copilot`,
        `-p "$(cat '${promptPath}')"`,
        `--model "${config.model}"`,
        `--allow-all-tools`,
        `--no-ask-user`,
      ].join(' ');
    case 'cli-gemini':
      return [
        `gemini`,
        `"$(cat '${promptPath}')"`,
        `-m "${config.model}"`,
        `-s none`,
        `-y`,
        `-o text`,
      ].join(' ');
    case 'cli-claude-code': {
      const effortFlag = config.reasoningEffort ? ` --effort ${config.reasoningEffort}` : '';
      return [
        `claude`,
        `-p "$(cat '${promptPath}')"`,
        `--model "${config.model}"`,
        `--permission-mode acceptEdits`,
        `--output-format text${effortFlag}`,
      ].join(' ');
    }
  }
}

describe('cli-matrix dispatch command shape', () => {
  const promptPath = 'spec-folder/research/prompts/iteration-001.md';

  it('native kind produces agent task shape', () => {
    const config = parseExecutorConfig({ kind: 'native' });
    expect(buildDispatchCommand(config, promptPath)).toContain('TASK(agent=deep-research');
  });

  it('cli-codex produces codex exec with stdin piping', () => {
    const config = parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'fast',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('codex exec');
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('model_reasoning_effort="high"');
    expect(cmd).toContain('service_tier="fast"');
    expect(cmd).toContain(`- < "${promptPath}"`);
  });

  it('cli-copilot produces positional prompt via -p with command substitution', () => {
    const config = parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('copilot');
    expect(cmd).toContain(`-p "$(cat '${promptPath}')"`);
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('--allow-all-tools');
    expect(cmd).toContain('--no-ask-user');
    expect(cmd).not.toContain('--sandbox');
    expect(cmd).not.toContain('reasoning_effort');
    expect(cmd).not.toContain('service_tier');
  });

  it('cli-gemini produces positional prompt with whitelisted model', () => {
    const config = parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview' });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('gemini');
    expect(cmd).toContain(`"$(cat '${promptPath}')"`);
    expect(cmd).toContain('-m "gemini-3.1-pro-preview"');
    expect(cmd).toContain('-s none');
    expect(cmd).toContain('-y');
    expect(cmd).toContain('-o text');
    expect(cmd).not.toContain('reasoning_effort');
  });

  it('cli-claude-code with reasoningEffort includes --effort flag', () => {
    const config = parseExecutorConfig({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      reasoningEffort: 'high',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('claude');
    expect(cmd).toContain('--model "claude-opus-4-6"');
    expect(cmd).toContain('--permission-mode acceptEdits');
    expect(cmd).toContain('--effort high');
    expect(cmd).not.toContain('service_tier');
  });

  it('cli-claude-code without reasoningEffort omits --effort flag', () => {
    const config = parseExecutorConfig({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('--permission-mode acceptEdits');
    expect(cmd).not.toContain('--effort');
  });
});
```

Save this file. Run `npx vitest run tests/deep-loop/cli-matrix.vitest.ts` to confirm green.

## Invariants

- Do NOT modify `if_native` or `if_cli_codex` branches in YAMLs (Phase 018 contract).
- Do NOT modify the Phase 018 / 019-A Zod schema or its tests beyond what's written above.
- New test file must compile under existing tsconfig with strict mode.
- DQI: SKILL.md edits should remain high-quality prose; no broken markdown links.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Check SKILL.md contract sections updated
grep -c "Shipped (spec 019)" \
  .opencode/skill/sk-deep-research/SKILL.md \
  .opencode/skill/sk-deep-review/SKILL.md

# Check Cross-CLI Delegation subsection present
grep -l "Cross-CLI Delegation" \
  .opencode/skill/sk-deep-research/SKILL.md \
  .opencode/skill/sk-deep-review/SKILL.md

# Check loop_protocol.md updated (spec 018 + 019)
grep "spec 018 + 019" \
  .opencode/skill/sk-deep-research/references/loop_protocol.md \
  .opencode/skill/sk-deep-review/references/loop_protocol.md

# Check setup flags docs include options C/D/E
grep -c "cli-copilot\|cli-gemini\|cli-claude-code" \
  .opencode/command/spec_kit/deep-research.md \
  .opencode/command/spec_kit/deep-review.md

# Run full test suite
cd .opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -5
npx vitest run tests/deep-loop/ 2>&1 | tail -8
```

Expected: 5 suites, ~54 tests total (48 from 019-A + 6 new from cli-matrix).

## Output format (final line)

```
PHASE_019CD_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
SKILL_DOCS_UPDATED: [sk-deep-research, sk-deep-review]
LOOP_PROTOCOL_UPDATED: [sk-deep-research, sk-deep-review]
SETUP_FLAGS_UPDATED: [deep-research.md, deep-review.md]
NEW_TEST_SUITE: cli-matrix.vitest.ts
VITEST_RESULT: [<n>/<m> passed]
TSC_RESULT: [pass | fail]
NEXT_STEPS: <any follow-ups>
```
