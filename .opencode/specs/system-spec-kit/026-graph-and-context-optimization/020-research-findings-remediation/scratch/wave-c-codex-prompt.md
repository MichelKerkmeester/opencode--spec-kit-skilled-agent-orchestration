# Phase 020 Wave C — Copilot @path Large-Prompt Fallback (R3)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-research-findings-remediation/`
**Waves A+B state**: COMPLETE. 77/77 tests green. Executor first-write audit + description repair safety shipped.
**Your role**: Implement R3 — add Copilot `@path` fallback for oversized prompts across all 4 YAML dispatch files. Wire the size-check logic.

**First line**: `GATE_3_ACKNOWLEDGED: proceeding with packet 020 Wave C`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Context

Research.md §5 F6: Phase 019 documented a Copilot `@path` large-prompt fallback. It was never actually wired. The current `if_cli_copilot` branch uses positional prompt via command substitution `-p "$(cat prompt.md)"`, which hits shell ARG_MAX limits for prompts over ~32KB. Copilot CLI supports `@path` file-reference syntax within its prompt string.

Fix: inside `if_cli_copilot`, check the prompt file size. If over 16KB threshold, invoke a wrapper prompt: `copilot -p "Read @<prompt-path> and follow its instructions." --model ... --allow-all-tools --no-ask-user`.

Also resolve Copilot bootstrap doc contradictions per R11 scope (but save detailed R11 for Wave F).

## Do these tasks

### T-YML-05/06 — Update all 4 YAMLs

For each of:
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`

Find the `if_cli_copilot` branch. Current shape (simplified):

```yaml
if_cli_copilot:
  command: |
    copilot -p "$(cat '{spec_folder}/research/prompts/iteration-{current_iteration}.md')" --model "{config.executor.model}" --allow-all-tools --no-ask-user
  ...
```

Replace with a size-branched form. Use the YAML workflow engine's conditional construct if available; otherwise inline a shell-level conditional:

```yaml
if_cli_copilot:
  pre_check:
    prompt_path: "{spec_folder}/research/prompts/iteration-{current_iteration}.md"
    prompt_size_threshold_bytes: 16384
  command: |
    PROMPT_PATH='{spec_folder}/research/prompts/iteration-{current_iteration}.md'
    PROMPT_SIZE=$(wc -c < "$PROMPT_PATH" | tr -d ' ')
    if [ "$PROMPT_SIZE" -le 16384 ]; then
      copilot -p "$(cat "$PROMPT_PATH")" --model "{config.executor.model}" --allow-all-tools --no-ask-user
    else
      copilot -p "Read the instructions in @$PROMPT_PATH and follow them exactly. Do not deviate." --model "{config.executor.model}" --allow-all-tools --no-ask-user
    fi
  working_directory: "{repo_root}"
  timeout_seconds: "{config.executor.timeoutSeconds}"
  wait_for_completion: true
  notes:
    - "copilot has no stdin; prompt is positional"
    - "Size check uses 16KB threshold; above that uses @path wrapper prompt"
    - "Large-prompt path relies on copilot honoring @path references within its prompt string"
```

For the review YAMLs, substitute `research/prompts/` → `review/prompts/`.

### T-TST-06 — Extend cli-matrix.vitest.ts

**File**: `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`

Add two new tests:

1. **Small-prompt path**: cli-copilot config + small prompt (<16KB) → command shape includes `-p "$(cat ...)"` positional form. Assert no `@path` wrapper language.
2. **Large-prompt path**: cli-copilot config + prompt >16KB → command shape includes `Read the instructions in @<path>`. Assert the wrapper language is present.

Helper refactor: extend `buildDispatchCommand` in the test file to accept an optional `promptSizeBytes` parameter that mirrors the YAML size-check logic.

### T-DOC-01 — Copilot bootstrap doc parity

**File**: `.opencode/skill/cli-copilot/SKILL.md`

Find sections where the machine-readable matrix (JSON or YAML config) contradicts the prose. Two typical spots:
1. Concurrency cap: prose says max 5; some refs say max 3 per Phase 017 `feedback_copilot_concurrency_override` memory. Resolve by citing the explicit max (5 per Copilot API, 3 per this repo's Phase 018 convention). Document both.
2. Reasoning-effort: some refs suggest a CLI flag; there is none. Clarify: config.json-only.

Keep it terse; one paragraph per contradiction.

## Invariants

- `if_native`, `if_cli_codex`, `if_cli_gemini`, `if_cli_claude_code` branches untouched.
- Size threshold 16KB is shared across all 4 YAMLs.
- The `@path` wrapper must include `@<absolute-or-repo-relative-path>` syntax (Copilot's documented file-reference form).
- Existing cli-matrix tests for native/codex/gemini/claude-code unchanged.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
grep -c "16384\|@PROMPT_PATH\|Read the instructions" .opencode/command/spec_kit/assets/spec_kit_deep-*.yaml
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run tests/deep-loop/cli-matrix.vitest.ts 2>&1 | tail -5
```

Expected: 4 YAMLs each have the size-check marker; cli-matrix test count grows from 6 to 8.

## Output

```
WAVE_C_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
YAML_EDITS: [4 YAMLs]
NEW_TEST_CASES: [small-prompt path, large-prompt @path]
VITEST_RESULT: [<n>/<m> passed]
TSC_RESULT: [pass | fail]
```
</content>
</invoke>
