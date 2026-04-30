---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Copilot Target-Authority Helper"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Helper + 2 YAML wire-ins + 13 vitest cases. Closes the v1.0.2 cli-copilot Gate 3 bypass at the executor-config layer with a typed authority token; recovered context cannot override workflow-resolved authority."
trigger_phrases:
  - "012 plan"
  - "copilot authority helper plan"
  - "buildCopilotPromptArg plan"
importance_tier: "important"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper"
    last_updated_at: "2026-04-27T20:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Operator review the packet docs; commit code + packet together"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Copilot Target-Authority Helper

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, `--experimental-strip-types`) |
| **Framework** | None (plain helper module + YAML workflow templates) |
| **Storage** | None |
| **Testing** | Vitest 4.x via `mcp_server/vitest.config.ts` |

### Overview

Add a typed `buildCopilotPromptArg` function next to `resolveCopilotPromptArg` in `mcp_server/lib/deep-loop/executor-config.ts`. The helper accepts a `targetAuthority` discriminated union and returns `{ argv, promptBody, enforcedPlanOnly }`. Wire both `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml` cli-copilot dispatch blocks to route through the helper, resolving authority from the workflow's `{spec_folder}` template. Add a vitest covering the full behavior matrix and override resistance.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and root-cause hypothesis cited with file:line evidence (research.md §3.1, §3.2)
- [x] Recommended approach selected from 3 ranked alternatives (research.md §3.3, option 1)
- [x] Falsifiable success criteria defined (research.md §3.5; mirrored in spec.md SC-001..006)
- [x] Scope estimate validated (research.md §3.6 budget: 80–120 LOC; actual: ~150 LOC helper + ~50 LOC YAML + ~210 LOC tests; in line)

### Definition of Done
- [ ] All P0 acceptance criteria met (spec.md REQ-001..007)
- [ ] Vitest suite passes: 13/13 new + 24/24 existing executor-config (37/37 total)
- [ ] Both `_auto.yaml` files import + call `buildCopilotPromptArg`
- [ ] `validate.sh --strict` returns same accepted-noise pattern as 010 + 011 packets (0 structural errors)
- [ ] Implementation summary authored with verification table
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pure-function helper with a discriminated-union input type. Stateless, deterministic, side-effect-free. Inserted at the executor-config layer (already the home of `resolveCopilotPromptArg`) so deep-research and deep-review workflows share the same authority enforcement.

### Key Components

- **`CopilotTargetAuthority`** (type): discriminated union `{ kind:"approved", specFolder } | { kind:"missing", writeIntent }`.
- **`buildCopilotPromptArg(input)`** (function): takes `{ promptPath, prompt, targetAuthority, baseArgv, promptArgIndex?, thresholdBytes? }` and returns `{ argv, promptBody, enforcedPlanOnly }`. The argv has the prompt slot rewritten with the authority-prefixed prompt body; on plan-only enforcement, `--allow-all-tools` is filtered out.
- **`buildTargetAuthorityPreamble(specFolder)`** (helper): renders the byte-stable preamble used in `kind:"approved"` mode and exported for audit/display use.
- **`buildMissingAuthorityGate3Prompt()`** (helper): renders the Gate-3 clarifying-question prompt used when authority is missing on a write-intent dispatch.
- **`spec_kit_deep-research_auto.yaml`** (workflow caller): inline Node script imports the helper, builds `targetAuthority` from `{spec_folder}`, and feeds the resulting argv to `runAuditedExecutorCommand`.
- **`spec_kit_deep-review_auto.yaml`** (workflow caller): inline Node script imports the helper, builds `targetAuthority` from `{spec_folder}`, and feeds the resulting argv to `spawnSync('copilot', ...)`. Conversion from the prior bash-only dispatch unifies behavior with deep-research.

### Data Flow

```
workflow setup
   │  spec_folder resolved (or unset)
   ▼
yaml inline node script
   │  reads prompt from {state_paths.prompt_dir}/iteration-NNN.md
   │  derives targetAuthority from spec_folder
   │  calls buildCopilotPromptArg({ promptPath, prompt, targetAuthority, baseArgv })
   ▼
buildCopilotPromptArg
   ├─ kind:"approved"           → preamble + divider + prompt | argv with --allow-all-tools intact
   ├─ kind:"missing"+RO         → prompt unchanged             | argv with --allow-all-tools intact
   └─ kind:"missing"+writeIntent → Gate-3 question replaces    | --allow-all-tools stripped
                                  prompt; enforcedPlanOnly=true
   ▼
runAuditedExecutorCommand / spawnSync('copilot', built.argv, ...)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read research.md §3 in full; verify file:line targets exist on disk
- [x] Read existing `resolveCopilotPromptArg` and YAML call sites; confirm prior behavior
- [x] Read 004-memory-save-rewrite/spec.md for the planner-first contract this layer enforces

### Phase 2: Core Implementation
- [x] Append `CopilotTargetAuthority` type + `buildCopilotPromptArg` + 2 helper builders to `executor-config.ts`
- [x] Replace `if_cli_copilot.command` in `spec_kit_deep-research_auto.yaml` with the helper-routed Node script
- [x] Replace `if_cli_copilot.command` in `spec_kit_deep-review_auto.yaml` with the helper-routed Node script (also unifies on Node-based dispatch)
- [x] Author vitest at `mcp_server/tests/executor-config-copilot-target-authority.vitest.ts` covering all 3 branches + override resistance + large-prompt fallback

### Phase 3: Verification
- [x] Run new vitest: 13/13 pass
- [x] Run existing executor-config vitest: 24/24 pass (no regression)
- [x] `validate.sh --strict` on packet folder: structural errors = 0
- [x] Author `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildCopilotPromptArg` behavior matrix (3 branches), override resistance, large-prompt fallback, exported helpers | Vitest |
| Regression | `executor-config.vitest.ts` (24 prior cases) | Vitest |
| Manual (spot) | YAML wiring: grep for `buildCopilotPromptArg` import + call in both `_auto.yaml` files | shell |
| Manual (deferred) | Live cli-copilot deep-loop dispatch in next deep-research run | operator |

The vitest covers the falsifiable success criteria from research.md §3.5 and spec.md SC-001..005. Live dispatch behavior is a separate verification pass scheduled for the next deep-research or deep-review run that exercises cli-copilot.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `executor-config.ts` (existing module) | Internal | Green | N/A — already present; modify in place |
| `runAuditedExecutorCommand` | Internal | Green | N/A — used as-is in deep-research wiring |
| Node `--experimental-strip-types` | Runtime | Green | Already used by existing deep-research YAML |
| Vitest config at `mcp_server/vitest.config.ts` | Tooling | Green | Already includes `mcp_server/tests/**/*.vitest.ts` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: post-merge regression in cli-copilot deep-loop dispatch (e.g. all iterations stop with "TARGET AUTHORITY MISSING — GATE 3 REQUIRED" because `{spec_folder}` resolution is broken in the workflow setup phase).
- **Procedure**:
  1. Revert the two YAML files (`spec_kit_deep-research_auto.yaml`, `spec_kit_deep-review_auto.yaml`) to the prior bash/`resolveCopilotPromptArg` shape via `git revert <yaml-commit>`.
  2. Leave `buildCopilotPromptArg` in `executor-config.ts` (additive helper; no callers break by its presence).
  3. Reopen this packet's `_memory.continuity.blockers` with the regression description and root-cause hypothesis.
- **Test before rollback**: re-run the new vitest with the exact `{spec_folder}` value the workflow renders. If the test fails on `kind:"approved"` with the live folder string, the bug is in the helper; if the test passes but live dispatch fails, the bug is upstream in workflow-state resolution.
<!-- /ANCHOR:rollback -->
