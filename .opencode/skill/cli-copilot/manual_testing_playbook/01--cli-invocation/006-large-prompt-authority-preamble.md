---
title: "CP-025 -- Large-prompt @PROMPT_PATH wrapper preserves authority preamble"
description: "This scenario validates that buildCopilotPromptArg writes the `## TARGET AUTHORITY` preamble into the prompt FILE BODY when the prompt exceeds the inline size threshold and switches to @PROMPT_PATH wrapper mode (packet 012, P1 fix-up)."
---

# CP-025 -- Large-prompt @PROMPT_PATH wrapper preserves authority preamble

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-025`.

---

## 1. OVERVIEW

This scenario validates the wrapper-mode path of `buildCopilotPromptArg` for `CP-025`. It focuses on confirming that for prompts over the inline size threshold (~16KB) where the helper switches to `@PROMPT_PATH` wrapper argv, the `## TARGET AUTHORITY` preamble is written into the prompt FILE BODY itself, so the file Copilot reads via `@path` opens with the authority block — not just an inline preamble in argv.

### Why This Matters

The original packet 012 implementation only carried the preamble inline in argv. For prompts over 16KB, argv switched to `@PROMPT_PATH` and Copilot read the prompt from disk — but the file body still opened with the original prompt content. Recovered/bootstrap folder mentions inside the file could re-anchor Copilot through that path. The P1 fix-up (post-review) added `promptFileBody` so the on-disk file itself opens with the authority block. CP-025 is the regression guard for that fix.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-025` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `buildCopilotPromptArg` returns `promptFileBody` containing the `## TARGET AUTHORITY` preamble + the original prompt when prompt size exceeds the inline threshold AND `targetAuthority.kind === 'approved'`. Confirm argv switches to `@${promptPath}` (no inline preamble) and the YAML wire-ins write `promptFileBody` to disk.
- Real user request: `Show me cli-copilot's deep-loop dispatch keeps the authority block above the prompt even when the prompt is huge and Copilot reads it from a file.`
- RCAF Prompt: `As a cross-AI orchestrator validating wrapper-mode authority preservation, exercise buildCopilotPromptArg with a 20000-byte prompt body and targetAuthority { kind:'approved', specFolder }. Verify the returned object carries promptFileBody starting with '## TARGET AUTHORITY' followed by the spec folder, separator, and original prompt; argv contains '@${promptPath}' (no inline preamble); and the YAML wire-ins writeFileSync(promptPath, built.promptFileBody) before dispatch. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: orchestrator runs the helper's vitest covering the wrapper-mode + approved-authority cases (3 cases added in the P1 fix-up) and confirms the YAML wire-ins write `promptFileBody` to disk before invoking copilot
- Expected signals: vitest exits 0; the wrapper-mode describe block passes all 3 cases including "promptFileBody opens with `## TARGET AUTHORITY`" and "argv is `@${promptPath}` without inline preamble"; both `_auto.yaml` files contain `writeFileSync(promptPath, built.promptFileBody, 'utf8')` guarded on `built.promptFileBody !== undefined`
- Desired user-visible outcome: PASS verdict reporting wrapper-mode preserves the preamble in the on-disk file body
- Pass/fail: PASS if vitest exit 0 AND wrapper-mode cases pass AND both YAML files write `promptFileBody` to disk. FAIL if `promptFileBody` undefined for approved+over-threshold, argv still carries an inline preamble (double-write), or YAML wire-ins skip the file write

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate the on-disk prompt file carries the authority preamble in wrapper mode".
2. Stay local: vitest + static greps only.
3. Run the helper's vitest covering the wrapper-mode describe block (3 cases from the P1 fix-up).
4. Confirm both `_auto.yaml` files write `promptFileBody` to disk when set.
5. Optionally, simulate a 20kb prompt against the live helper and dump `promptFileBody` to inspect the byte ordering.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-025 | Large-prompt @PROMPT_PATH wrapper preamble | Confirm wrapper-mode (>16KB prompt + approved authority) writes the authority preamble into the on-disk file body | `As a cross-AI orchestrator validating wrapper-mode authority preservation, exercise buildCopilotPromptArg with a 20000-byte prompt body and targetAuthority { kind:'approved', specFolder }. Verify promptFileBody starts with '## TARGET AUTHORITY', argv contains '@${promptPath}' (no inline preamble), and the YAML wire-ins writeFileSync(promptPath, built.promptFileBody) before dispatch.` | 1. `bash: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/executor-config-copilot-target-authority.vitest.ts 2>&1 \| tee /tmp/cp-025-vitest.txt` -> 2. `bash: grep -n "promptFileBody\|wrapper\|@\\\${promptPath}" .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts \| head -30` -> 3. `bash: grep -n "promptFileBody\|writeFileSync" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Step 1: vitest exits 0; the wrapper-mode describe block passes all 3 cases; Step 2: helper source defines `promptFileBody` on `BuildCopilotPromptArgResult` and assigns the preamble + separator + original prompt when approved+over-threshold; Step 3: both YAML files include `writeFileSync(promptPath, built.promptFileBody, 'utf8')` guarded on `built.promptFileBody !== undefined` | `/tmp/cp-025-vitest.txt` + grep outputs from Steps 2 and 3 | PASS if vitest exit 0 AND wrapper-mode cases pass AND both YAML files write `promptFileBody` to disk; FAIL if any case fails, `promptFileBody` undefined for approved+over-threshold, or YAML skips the file write | 1. If `promptFileBody` undefined: inspect the threshold branch in `buildCopilotPromptArg`; the post-P1 contract requires `promptFileBody` whenever `kind === 'approved'` AND prompt exceeds the wrapper threshold; 2. If argv still inlines the preamble alongside `@${promptPath}`: that's a double-write — only the file body should carry the preamble in wrapper mode; 3. If YAML wire-ins skip the file write: restore the `writeFileSync` block per packet 012 post-review fix #2 |

### Optional Supplemental Checks

After PASS, manually craft a 20kb prompt, call the helper with approved authority, dump `promptFileBody` to a temp file, and `head -10` it to confirm the byte ordering: `## TARGET AUTHORITY` block, then `---` separator, then original prompt. The first 200 bytes of the file should be the authority block, NOT the original prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | cli-copilot skill surface, §3 dispatch contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | `buildCopilotPromptArg` wrapper-mode branch + `BuildCopilotPromptArgResult.promptFileBody` (packet 012, P1 fix-up) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | Vitest suite, wrapper-mode describe block (3 cases added in fix-up) |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Dispatch wire-in: `writeFileSync(promptPath, built.promptFileBody)` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Dispatch wire-in: same writeFileSync guard |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CP-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/006-large-prompt-authority-preamble.md`
