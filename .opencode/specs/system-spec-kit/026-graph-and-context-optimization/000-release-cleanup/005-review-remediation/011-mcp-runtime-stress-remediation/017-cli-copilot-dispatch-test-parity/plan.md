---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: cli-copilot Dispatch Test Parity"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Test-only rewrite of the cli-copilot section of cli-matrix.vitest.ts so the assertions model buildCopilotPromptArg's built.argv + promptFileBody shape (the contract packet 012 ships) instead of the legacy resolveCopilotPromptArg command string. Closes deep-review F-004 P2 and satisfies §7 Packet B PASS gate."
trigger_phrases:
  - "017 plan"
  - "cli-copilot dispatch test parity plan"
  - "cli-matrix buildCopilotPromptArg parity plan"
importance_tier: "important"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity"
    last_updated_at: "2026-04-27T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md after the test rewrite landed"
    next_safe_action: "Operator review the packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: cli-copilot Dispatch Test Parity

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, vitest 4.1.x) |
| **Framework** | Vitest |
| **Storage** | None (test-only) |
| **Testing** | Vitest via `mcp_server/vitest.config.ts` |

### Overview

Rewrite the cli-copilot portion of `mcp_server/tests/deep-loop/cli-matrix.vitest.ts` so the test exercises `buildCopilotPromptArg` directly across all 3 `targetAuthority` branches plus the YAML write-then-dispatch ordering. Drop the legacy `resolveCopilotPromptArg` / `-p "$(cat ...)"` assertions — they no longer reflect what the YAML auto-loop dispatch actually does. Update the smoke test to model the approved-authority happy path with `promptFileBody` written to disk before subprocess invocation.

Production code stays byte-stable: `executor-config.ts`, `spec_kit_deep-research_auto.yaml`, and `spec_kit_deep-review_auto.yaml` are not touched. The packet only modifies the test file plus authoring of the standard Level 1 packet docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem cited with file:line evidence (deep-review §4 F-004 + §7 Packet B)
- [x] PASS gate explicit and falsifiable (§7 Packet B: "models built.argv, promptFileBody, and @PROMPT_PATH behavior, not the legacy command string")
- [x] Scope confirmed test-only (production unchanged); no cross-packet bleed into 016 / 018
- [x] All 3 targetAuthority branches identified for coverage

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..010)
- [ ] cli-matrix vitest passes 13/13
- [ ] Full deep-loop suite passes 73/73
- [ ] executor-config-copilot-target-authority vitest passes 29/29
- [ ] `validate.sh --strict` returns 0 structural errors
- [ ] Implementation summary authored with verification table
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pure test-rewrite. The dispatch shape that 012 introduced is the contract under test:

```
buildCopilotPromptArg input
   ┌──────────────────────────────────────────┐
   │ promptPath  prompt  targetAuthority      │
   │                     baseArgv             │
   └──────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ targetAuthority     │
              │   ┌──"approved"  ──▶│ argv carries preamble inline (small)
              │   │                 │ argv carries @PATH, promptFileBody set (large)
              │   ├──"missing"   ──▶│ writeIntent:false → unchanged
              │   │                 │ writeIntent:true  → Gate-3 question, --allow-all-tools stripped
              │   └─                │
              └─────────────────────┘
                         │
                         ▼
              { argv, promptBody, promptFileBody?, enforcedPlanOnly }
                         │
                         ▼ YAML auto-loop:
              if (built.promptFileBody !== undefined)
                writeFileSync(promptPath, built.promptFileBody)
              spawnSync('copilot', built.argv, ...)        // deep-review
              runAuditedExecutorCommand({command:'copilot',args:built.argv}) // deep-research
```

### Key Components

- **Updated `cli-matrix.vitest.ts`**: drops 3 cli-copilot tests in the dispatch-shape block; adds a 5-test `cli-matrix cli-copilot dispatch shape (buildCopilotPromptArg)` block; updates the smoke test to model approved-large-prompt happy path; rewires `buildDispatchCommand`'s cli-copilot branch to throw fail-loud.
- **Constants**: `COPILOT_BASE_ARGV` (matches the YAML's base argv slot), `APPROVED_FOLDER` (this packet's spec folder), and repo-root anchored YAML path constants for the static-grep ordering test.
- **Production code**: byte-stable. `buildCopilotPromptArg`, `executor-config.ts`, both `_auto.yaml` files unchanged.

### Test Coverage Matrix

| `targetAuthority` | Prompt size | argv shape | promptFileBody | enforcedPlanOnly |
|-------------------|-------------|------------|----------------|------------------|
| `kind:"approved"` | small | preamble-prefixed prompt inline at argv[1] | undefined | false |
| `kind:"approved"` | large (>16KB) | bare `@PROMPT_PATH` at argv[1] | preamble + divider + body | false |
| `kind:"missing"+writeIntent:false` | any | raw prompt at argv[1] | undefined | false |
| `kind:"missing"+writeIntent:true` | small | Gate-3 question; `--allow-all-tools` stripped | undefined | true |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read 011 deep-review report §4 F-004 and §7 Packet B PASS gate
- [x] Read existing `cli-matrix.vitest.ts` (legacy shape) and identify the 3 cli-copilot dispatch tests + smoke test
- [x] Read `executor-config.ts` `buildCopilotPromptArg` shape + `executor-config-copilot-target-authority.vitest.ts` for assertion patterns to mirror
- [x] Read both `_auto.yaml` files to confirm the actual write-then-dispatch ordering and grep anchors

### Phase 2: Core Implementation
- [x] Update imports: add `buildCopilotPromptArg`, drop `resolveCopilotPromptArg`
- [x] Update `buildDispatchCommand` so its `cli-copilot` branch throws (fail-loud anti-regression); drop `promptSizeBytes` parameter
- [x] Add repo-root anchored YAML path constants + `COPILOT_BASE_ARGV` + `APPROVED_FOLDER` shared constants
- [x] Drop the 3 cli-copilot tests from `cli-matrix dispatch command shape` describe block
- [x] Add new `cli-matrix cli-copilot dispatch shape (buildCopilotPromptArg)` describe block with 5 cases:
  - `kind:"approved"` + small prompt
  - `kind:"approved"` + large prompt (with `promptFileBody`)
  - `kind:"missing"+writeIntent:false`
  - `kind:"missing"+writeIntent:true`
  - YAML auto-loop sites write `built.promptFileBody` before invoking copilot (static grep, both files)
- [x] Update smoke test to model approved-authority + large-prompt + `writeFileSync(promptPath, built.promptFileBody)` happy path

### Phase 3: Verification
- [x] Run cli-matrix vitest: 13/13 pass
- [x] Run full deep-loop test suite: 73/73 pass
- [x] Run executor-config-copilot-target-authority vitest: 29/29 pass
- [x] Confirm production code byte-stable: `executor-config.ts`, `spec_kit_deep-research_auto.yaml`, `spec_kit_deep-review_auto.yaml`
- [x] Author packet docs (spec, plan, tasks, checklist, implementation-summary, description.json, graph-metadata.json)
- [x] Run `validate.sh --strict` on packet folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (dispatch shape) | `buildCopilotPromptArg` argv + promptFileBody across all 3 `targetAuthority` branches | Vitest |
| Static (YAML ordering) | `_auto.yaml` files contain `if (built.promptFileBody !== undefined)` + `writeFileSync` BEFORE the copilot dispatch | readFileSync + regex |
| Smoke (real subprocess) | Approved-authority + large-prompt + `writeFileSync(promptPath, built.promptFileBody)` happy path; subprocess reads the file and confirms preamble + folder + body present | Vitest + node subprocess via `runAuditedExecutorCommand` |
| Regression | Full `tests/deep-loop/` suite + `executor-config-copilot-target-authority.vitest.ts` | Vitest |

The static-grep YAML test pins the contract that 012 introduced. If a future refactor drops or moves the `writeFileSync(promptPath, built.promptFileBody)` line in either `_auto.yaml`, this test fails. Combined with the unit tests on `buildCopilotPromptArg`'s output shape, the cli-copilot dispatch contract is end-to-end pinned at the test layer.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `buildCopilotPromptArg` exported from `executor-config.ts` (packet 012) | Internal | Green | If 012 is reverted, this test will not compile |
| Both `_auto.yaml` files routed through `buildCopilotPromptArg` (packet 012) | Internal | Green | If 012 is reverted, REQ-007's static grep fails |
| Vitest 4.1.x via `mcp_server/vitest.config.ts` | Tooling | Green | Already includes `mcp_server/tests/**/*.vitest.ts` |
| Node `import.meta.url` + `fileURLToPath` for repo-root resolution | Runtime | Green | Standard Node ESM API; vitest supports it natively |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: cli-matrix vitest fails post-merge in CI on a clean checkout (e.g. `import.meta.url` resolution returns an unexpected path on the runner, or YAML byte-ordering shifts without semantic change).
- **Procedure**:
  1. `git revert <test-rewrite-commit>` to restore the legacy assertions. The legacy test passed on the prior shape.
  2. Reopen this packet's `_memory.continuity.blockers` with the failure mode and root-cause hypothesis.
  3. Address the underlying issue (either the YAML ordering check uses fragile anchors, or the path resolution needs adjustment) before re-landing.
- **Test before rollback**: run the new vitest locally on the affected runner. If it passes locally and fails only on CI, the rollback is a no-op until the runner difference is understood.
- **Production-code blast radius**: zero. This is a test-only change; reverting affects only `cli-matrix.vitest.ts`.
<!-- /ANCHOR:rollback -->
