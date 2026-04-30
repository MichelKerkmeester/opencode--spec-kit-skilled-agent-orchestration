---
title: "CP-023 -- TARGET AUTHORITY missing + writeIntent enforces plan-only"
description: "This scenario validates that buildCopilotPromptArg replaces the prompt with a Gate-3 question and strips --allow-all-tools when targetAuthority is { kind:'missing', writeIntent:true } (packet 012)."
---

# CP-023 -- TARGET AUTHORITY missing + writeIntent enforces plan-only

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CP-023`.

---

## 1. OVERVIEW

This scenario validates the missing-authority enforcement path of `buildCopilotPromptArg` for `CP-023`. It focuses on confirming that when the workflow cannot resolve a spec folder and passes `targetAuthority = { kind:'missing', writeIntent:true }`, the helper REPLACES the prompt body with a Gate-3 clarifying question, strips `--allow-all-tools` from argv, and sets `enforcedPlanOnly:true`.

### Why This Matters

This is the safe-fail path that catches the v1.0.2 cli-copilot pathology directly: when the workflow has no approved spec folder but the dispatch carried write intent, the helper turns the call into a non-mutating Gate-3 ask rather than letting Copilot pick a folder from recovered context. If this path silently regressed, autonomous workflows could resume mutating arbitrary spec folders the operator never approved.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CP-023` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `buildCopilotPromptArg({ targetAuthority: { kind:'missing', writeIntent:true }, ... })` REPLACES the prompt body with the Gate-3 clarifying question, strips `--allow-all-tools` from argv, and returns `enforcedPlanOnly:true`
- Real user request: `Show me cli-copilot dispatch refuses to mutate when there's no approved spec folder, even if the original prompt was a write request.`
- RCAF Prompt: `As a cross-AI orchestrator validating the missing-authority enforcement contract, exercise buildCopilotPromptArg with targetAuthority { kind:'missing', writeIntent:true } and a write-intent prompt body. Verify the returned prompt body is REPLACED by the Gate-3 question 'TARGET AUTHORITY MISSING -- GATE 3 REQUIRED' plus 'Do NOT pick a folder yourself.', argv excludes '--allow-all-tools', and enforcedPlanOnly is true. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: orchestrator runs the helper's vitest covering the missing+writeIntent describe block and confirms the prompt-replacement and argv-strip behavior
- Expected signals: vitest exits 0; the missing-authority describe block passes all cases; rendered prompt body matches the Gate-3 template; rendered argv does NOT contain `--allow-all-tools`; `enforcedPlanOnly === true`
- Desired user-visible outcome: PASS verdict reporting the Gate-3 prompt replaced the original write-intent body and `--allow-all-tools` was stripped
- Pass/fail: PASS if vitest exit 0 AND missing-authority cases pass AND argv post-helper does NOT contain `--allow-all-tools` AND prompt body is the Gate-3 question only AND `enforcedPlanOnly === true`. FAIL if any of those fail or the original write-intent body leaks through

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as "validate missing-authority + write-intent forces plan-only".
2. Stay local: vitest invocation only — no live cli-copilot dispatch needed.
3. Run the helper's vitest covering the missing+writeIntent describe block.
4. Inspect a sample rendered argv to confirm `--allow-all-tools` is absent.
5. Confirm the helper source defines `buildMissingAuthorityGate3Prompt` and the YAML wire-ins call `buildCopilotPromptArg` with `kind:'missing', writeIntent:true` when `{spec_folder}` is unresolved.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CP-023 | TARGET AUTHORITY missing + writeIntent plan-only | Confirm missing-authority + writeIntent replaces prompt with Gate-3 question and strips `--allow-all-tools` | `As a cross-AI orchestrator validating the missing-authority enforcement contract, exercise buildCopilotPromptArg with targetAuthority { kind:'missing', writeIntent:true } and a write-intent prompt body. Verify the returned prompt body is REPLACED by the Gate-3 question, argv excludes '--allow-all-tools', and enforcedPlanOnly is true.` | 1. `bash: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/executor-config-copilot-target-authority.vitest.ts 2>&1 \| tee /tmp/cp-023-vitest.txt` -> 2. `bash: grep -n "buildMissingAuthorityGate3Prompt\|TARGET AUTHORITY MISSING\|GATE 3 REQUIRED" .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` -> 3. `bash: grep -B1 -A6 "kind:.*missing.*writeIntent" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Step 1: vitest exits 0 with the missing+writeIntent describe block passing every case including the argv-strip + prompt-replacement assertions; Step 2: helper source contains the Gate-3 template builder and the literal "TARGET AUTHORITY MISSING -- GATE 3 REQUIRED" line; Step 3: both YAML files instantiate `targetAuthority = { kind:'missing', writeIntent:true }` when `{spec_folder}` is null/empty | `/tmp/cp-023-vitest.txt` (vitest transcript) + grep outputs from Steps 2 and 3 | PASS if vitest exit 0 AND missing-authority cases pass AND argv post-helper excludes `--allow-all-tools` AND Gate-3 prompt replaces write-intent body AND `enforcedPlanOnly === true`; FAIL if any check misses or the original prompt leaks through | 1. If `--allow-all-tools` survives: inspect the `argv.filter()` step in `buildCopilotPromptArg`; 2. If the original prompt leaks: confirm the helper REPLACES (not appends) when `kind === 'missing' && writeIntent === true`; 3. If YAML wire-ins do not handle the missing case: restore the conditional per packet 012 implementation summary §"YAML wire-ins" |

### Optional Supplemental Checks

After PASS, also exercise `kind:'missing', writeIntent:false` (read-only path) and verify the prompt body and argv are passed through UNCHANGED — that confirms the helper does not over-block read-only dispatches.

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
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | `buildCopilotPromptArg` + `buildMissingAuthorityGate3Prompt` (packet 012) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | Vitest suite, "missing + writeIntent" describe block |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Dispatch wire-in for deep-research auto loop |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Dispatch wire-in for deep-review auto loop |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CP-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/005-target-authority-missing-write-intent-plan-only.md`
