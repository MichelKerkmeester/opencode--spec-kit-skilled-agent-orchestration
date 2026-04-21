# Phase 019-B: YAML Dispatch Branches for 3 New CLIs (4 tasks)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution/002-runtime-matrix/`
**Phase 019-A state**: COMPLETE. executor-config.ts + tests (48/48 green). Config accepts all 4 CLI kinds with per-kind flag validation.
**Your role**: Add `if_cli_copilot`, `if_cli_gemini`, `if_cli_claude_code` branches to all 4 YAMLs (T-YMR-05/06, T-YMV-03/04).

**First line of output**: `GATE_3_ACKNOWLEDGED: proceeding with packet 019 Phase B`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Reference: existing structure

In `spec_kit_deep-research_auto.yaml` around lines 494-530, the current `step_dispatch_iteration` has:

```yaml
branch_on: "config.executor.kind"
if_native:
  dispatch:
    agent: deep-research
    model: opus
    context_source: "rendered_prompt_pack"
  wait_for_completion: true
if_cli_codex:
  command: |
    codex exec \
      --model "{config.executor.model}" \
      -c model_reasoning_effort="{config.executor.reasoningEffort}" \
      -c service_tier="{config.executor.serviceTier}" \
      -c approval_policy=never \
      --sandbox workspace-write \
      - < "{spec_folder}/research/prompts/iteration-{current_iteration}.md"
  working_directory: "{repo_root}"
  timeout_seconds: "{config.executor.timeoutSeconds}"
  wait_for_completion: true
post_dispatch_validate: ...
record_executor_audit: ...
```

You will ADD three new branches (`if_cli_copilot`, `if_cli_gemini`, `if_cli_claude_code`) immediately after `if_cli_codex` and before `post_dispatch_validate`. Do NOT remove or modify the existing `if_native` or `if_cli_codex` branches.

## Do these four tasks

### T-YMR-05 — Add 3 new branches to spec_kit_deep-research_auto.yaml

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`

After the `if_cli_codex` block (currently ending around line 512 with `wait_for_completion: true`), and before `post_dispatch_validate`, insert:

```yaml
        if_cli_copilot:
          command: |
            copilot \
              -p "$(cat '{spec_folder}/research/prompts/iteration-{current_iteration}.md')" \
              --model "{config.executor.model}" \
              --allow-all-tools \
              --no-ask-user
          working_directory: "{repo_root}"
          timeout_seconds: "{config.executor.timeoutSeconds}"
          wait_for_completion: true
          notes:
            - "copilot has no stdin support; prompt passed positionally via -p and command substitution"
            - "copilot reasoningEffort is NOT a CLI flag; must be set in ~/.copilot/config.json ahead of time"
            - "copilot concurrency cap: max 5 per account (feedback_copilot_concurrency_override)"
        if_cli_gemini:
          command: |
            gemini \
              "$(cat '{spec_folder}/research/prompts/iteration-{current_iteration}.md')" \
              -m "{config.executor.model}" \
              -s none \
              -y \
              -o text
          working_directory: "{repo_root}"
          timeout_seconds: "{config.executor.timeoutSeconds}"
          wait_for_completion: true
          notes:
            - "gemini accepts positional prompt or stdin; we use positional via command substitution"
            - "gemini has no reasoningEffort or serviceTier flags; model is the only lever"
            - "gemini model whitelist enforced at config parse (currently only gemini-3.1-pro-preview)"
        if_cli_claude_code:
          command: |
            claude \
              -p "$(cat '{spec_folder}/research/prompts/iteration-{current_iteration}.md')" \
              --model "{config.executor.model}" \
              --permission-mode acceptEdits \
              --output-format text \
              {optional_effort_flag}
          working_directory: "{repo_root}"
          timeout_seconds: "{config.executor.timeoutSeconds}"
          wait_for_completion: true
          render_hint:
            optional_effort_flag: |
              If config.executor.reasoningEffort is set and non-null, expand to: --effort {config.executor.reasoningEffort}
              Otherwise expand to empty string.
          notes:
            - "claude-code default permission-mode is 'plan' (read-only); we override to 'acceptEdits' for iteration writes"
            - "claude-code has no serviceTier flag"
            - "claude-code supports --effort for reasoning depth"
```

Keep the indentation matching the existing `if_cli_codex` block (same parent indent level — inside `step_dispatch_iteration`). Preserve all surrounding YAML (before and after).

### T-YMR-06 — Mirror T-YMR-05 into spec_kit_deep-research_confirm.yaml

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`

Find the `step_dispatch_iteration` block in that file (look for the `branch_on: "config.executor.kind"` line). Insert the same three new branches in the same position (after `if_cli_codex`, before `post_dispatch_validate`). Preserve confirm-mode pauses intact.

### T-YMV-03 — Mirror into spec_kit_deep-review_auto.yaml

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`

Add the same three branches. CRITICAL substitution: change the prompt path from `research/prompts/` to `review/prompts/`. Everything else identical.

### T-YMV-04 — Mirror into spec_kit_deep-review_confirm.yaml

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`

Same pattern: 3 new branches with `review/prompts/` path substitution.

## Invariants

- Do NOT modify `if_native` or `if_cli_codex` branches (those are Phase 018 contract, shipped).
- Do NOT modify `post_dispatch_validate` or `record_executor_audit` (shared across all branches).
- Keep YAML indentation consistent with existing branches in each file.
- The `notes:` block under each new branch is optional documentation — include it for human readability. YAML workflow engines should ignore unknown fields.
- Preserve trailing YAML structure (everything after `record_executor_audit` stays untouched).
- The `{optional_effort_flag}` placeholder in `if_cli_claude_code` is an instruction to the workflow engine; keep it as literal text in the YAML — the render_hint block explains the intended behavior.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
grep -n "if_cli_copilot\|if_cli_gemini\|if_cli_claude_code" \
  .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml

cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run tests/deep-loop/ 2>&1 | tail -6
```

Expected: grep shows 3 markers per file (12 total across 4 YAMLs). Vitest still green at 48/48.

Run `tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -3` to confirm no regression.

## Output format (final line)

```
PHASE_019B_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
YAML_GREP_COUNTS: research_auto=<n> research_confirm=<n> review_auto=<n> review_confirm=<n>
VITEST_RESULT: [<n>/<m> passed]
NEXT_STEPS: <any follow-ups>
```
