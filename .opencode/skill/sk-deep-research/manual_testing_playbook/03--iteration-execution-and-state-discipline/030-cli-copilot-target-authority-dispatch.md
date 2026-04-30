---
title: "DR-030 -- cli-copilot dispatch routes through buildCopilotPromptArg with targetAuthority"
description: "Verify every cli-copilot dispatch in spec_kit_deep-research_auto.yaml routes through buildCopilotPromptArg, derives a CopilotTargetAuthority from the workflow-resolved {spec_folder}, and produces an approved preamble when present or Gate-3 plan-only when absent (packet 012)."
---

# DR-030 -- cli-copilot dispatch routes through buildCopilotPromptArg with targetAuthority

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-030`.

---

## 1. OVERVIEW

This scenario validates the cli-copilot dispatch path of `spec_kit_deep-research_auto.yaml` for `DR-030`. The objective is to verify every cli-copilot dispatch routes through `buildCopilotPromptArg` (packet 012), derives `CopilotTargetAuthority` from the workflow-resolved `{spec_folder}`, and produces the canonical `## TARGET AUTHORITY` preamble when present or the Gate-3 plan-only refusal when absent.

### WHY THIS MATTERS

The deep-research auto loop dispatches cli-copilot iterations on its own. If the YAML wire-in regresses past `buildCopilotPromptArg`, recovered-context spec folder strings inside the prompt body could re-anchor Copilot to a folder the operator never approved — the v1.0.2 catastrophic-mutation pathology. This entry is the deep-research-side regression guard against that regression.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Title: cli-copilot dispatch in `spec_kit_deep-research_auto.yaml` routes through `buildCopilotPromptArg` with a workflow-derived `CopilotTargetAuthority`.
- Given: An auto-loop dispatch step that targets the cli-copilot executor.
- When: The YAML's `if_cli_copilot.command` block runs.
- Then: It calls `buildCopilotPromptArg`, derives `targetAuthority = specFolder ? { kind:'approved', specFolder } : { kind:'missing', writeIntent:true }`, and produces an approved preamble or Gate-3 plan-only outcome accordingly.
- Real user request: When the deep-research auto loop calls cli-copilot, what guarantees the spec folder authority is bound at dispatch time and recovered context cannot override it?
- Prompt: `As a manual-testing orchestrator, validate the cli-copilot dispatch authority contract for sk-deep-research against the auto-workflow YAML, the helper source, and the packet 012 implementation summary. Verify the YAML routes every cli-copilot dispatch through buildCopilotPromptArg, derives CopilotTargetAuthority from the workflow-resolved {spec_folder}, and that an end-to-end run with an approved spec folder produces the preamble while an unresolved {spec_folder} produces a Gate-3 refusal. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the auto-workflow YAML for the helper invocation, then the helper source for the discriminated-union signature, then the packet 012 implementation summary's "YAML wire-ins" section.
- Desired user-facing outcome: The user is told that the deep-research auto loop cannot dispatch cli-copilot without binding `targetAuthority` from the workflow-resolved spec folder, and that missing authority forces plan-only.
- Expected signals: `grep -n "buildCopilotPromptArg" spec_kit_deep-research_auto.yaml` returns at least one hit; the inline Node script defines `targetAuthority = specFolder ? { kind:'approved', specFolder } : { kind:'missing', writeIntent:true }`; an end-to-end run with `{spec_folder}` set produces the approved preamble in the rendered prompt; with `{spec_folder}` absent the dispatch becomes Gate-3 plan-only.
- Pass/fail posture: PASS if the YAML routes through `buildCopilotPromptArg`, the authority shape is derived from workflow state, and both presence/absence branches produce the documented outcome; FAIL if the YAML calls cli-copilot directly without the helper, hard-codes authority, or mishandles the missing case.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the YAML is checked before the helper source.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

### Prompt

As a manual-testing orchestrator, validate the cli-copilot dispatch authority contract for sk-deep-research against the auto-workflow YAML, the helper source, and the packet 012 implementation summary. Verify the YAML routes every cli-copilot dispatch through buildCopilotPromptArg, derives CopilotTargetAuthority from the workflow-resolved {spec_folder}, and that the approved/missing branches produce preamble vs Gate-3 plan-only outcomes. Return a concise operator-facing verdict.

### Commands

1. `bash: grep -n "buildCopilotPromptArg" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
2. `bash: grep -B2 -A6 "kind:.*approved\|kind:.*missing" .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
3. `bash: grep -n "buildCopilotPromptArg\|CopilotTargetAuthority\|buildTargetAuthorityPreamble\|buildMissingAuthorityGate3Prompt" .opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
4. `bash: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/executor-config-copilot-target-authority.vitest.ts 2>&1 | tail -40`

### Expected

YAML contains at least one `buildCopilotPromptArg` reference and derives `targetAuthority` from `{spec_folder}` per the packet 012 implementation summary. Helper source defines the discriminated-union signature and both preamble builders. Vitest passes for both branches.

### Evidence

Captured grep outputs for the YAML wire-in, helper source, and the vitest tail showing the approved + missing describe blocks both passing.

### Pass/Fail

PASS if the auto-workflow YAML routes cli-copilot dispatch through `buildCopilotPromptArg`, derives authority from `{spec_folder}`, and both branches verify under vitest; FAIL if the YAML hard-codes authority, skips the helper, or vitest fails for either branch.

### Failure Triage

If the YAML grep returns zero: the wire-in regressed — restore the helper-routed Node script per packet 012 implementation summary. If the helper source is missing the union shape: confirm packet 012 dist marker via `grep -l "CopilotTargetAuthority" mcp_server/dist/lib/deep-loop/executor-config.js`. If vitest fails: pivot to the cli-copilot CP-022/CP-023 playbook entries which exercise the helper directly.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Auto-workflow dispatch wire-in for cli-copilot |
| `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | `buildCopilotPromptArg` + `CopilotTargetAuthority` (packet 012) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` | Vitest covering all 3 authority branches + override resistance |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/implementation-summary.md` | Packet 012 implementation summary, §"YAML wire-ins for both auto-loop dispatch sites" |

### Related Sibling Tests

| File | Role |
|---|---|
| `.opencode/skill/cli-copilot/manual_testing_playbook/01--cli-invocation/004-target-authority-approved-preamble.md` | CP-022 — approved-authority preamble (helper-side) |
| `.opencode/skill/cli-copilot/manual_testing_playbook/01--cli-invocation/005-target-authority-missing-write-intent-plan-only.md` | CP-023 — missing+writeIntent plan-only (helper-side) |
| `.opencode/skill/cli-copilot/manual_testing_playbook/05--session-continuity/003-i1-replay-zero-mutation.md` | CP-024 — I1-replay zero-mutation regression |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/030-cli-copilot-target-authority-dispatch.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-04-27.
