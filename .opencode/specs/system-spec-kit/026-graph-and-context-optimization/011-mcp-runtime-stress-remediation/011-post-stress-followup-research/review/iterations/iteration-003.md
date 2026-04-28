# Iteration 003 - Test Brittleness + Maintainability Audit (Q-TEST + Q-MAINT)

## Status
- Iteration: 3 / 10
- Focus: Q-TEST + Q-MAINT
- newFindingsRatio: 0.20
- Convergence trajectory: New finding rate continues to decay. This pass found one cross-cutting test drift issue around cli-copilot dispatch coverage; no new authority bypass was found in `buildCopilotPromptArg` itself.
- Verdict signal so far: CONDITIONAL-leaning

## Q-CROSS - Cross-Packet Interactions

See iteration 001 for the `code_graph_context` degraded-readiness metadata loss and status crash-action mismatch findings. This iteration did not re-cover graph degraded/readiness paths.

## Q-REGRESS - Regression Risk on Unchanged Callers

See iteration 002 for unchanged caller coverage around `code_graph_status`, `memory_search`, and `memory_save`. No new unchanged-caller regression was found in this iteration.

## Q-FLOW - cli-copilot Dispatch Flow End-to-End

### Findings
- **F-004 [P2] The cli-copilot dispatch regression test still models the pre-012 command shape while claiming to mirror YAML**
  - Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:17` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:20` say `buildDispatchCommand()` "mirrors the YAML dispatch logic". For `cli-copilot`, that helper still builds the old shell command shape: small prompts use `-p "$(cat '<promptPath>')"` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:40` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:48`, and large prompts still call `resolveCopilotPromptArg()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:50` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts:56`. The shipped auto YAML no longer follows that path: deep-review imports `buildCopilotPromptArg()` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:673`, builds `built` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:697` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:702`, writes `built.promptFileBody` back to `promptPath` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:709` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:710`, and then dispatches `spawnSync('copilot', built.argv, ...)` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:713` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:718`. Deep-research follows the new helper path too, including `runAuditedExecutorCommand({ command: 'copilot', args: built.argv, ... })` at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:650` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:659`.
  - Risk: This is not a fresh authority leak, but it is a false-confidence pattern in exactly the area iteration 002 flagged. A future regression in the YAML call sites could drop the `promptFileBody` write, pass the wrong `promptPath`, or bypass `buildCopilotPromptArg()` while `cli-matrix.vitest.ts` still passes because it tests the legacy command string. The packet 012 helper unit test proves `promptFileBody` exists for approved large prompts at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts:207` through `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts:235`, but no test exercises the production call-site sequence of read prompt file -> build helper result -> write prefixed file -> dispatch `built.argv`.
  - Recommended remediation: Update `cli-matrix.vitest.ts` so its cli-copilot branch reflects the post-012 helper-routed path, or split it into explicit "legacy helper" and "YAML dispatch shim" tests. The higher-value test is a temp-file call-site shim shared by deep-research and deep-review: write a large prompt containing a competing recovered-context folder, run the same `buildCopilotPromptArg()` + `writeFileSync(promptPath, built.promptFileBody)` sequence used by YAML, and assert the persisted `promptPath` begins with `## TARGET AUTHORITY` before dispatch. If deep-review keeps direct `spawnSync()` while deep-research uses `runAuditedExecutorCommand()`, add a focused failure-path assertion so that difference is intentional rather than accidental.

### Notes
Iteration 001's source-level Q-FLOW conclusion still holds: `validateSpecFolder()` rejects unresolved and malformed authority, malformed approved authority safe-fails to Gate 3, approved large prompts emit `promptFileBody`, and both auto YAML call sites write that body before dispatch. The residual gap is test alignment with the shipped call order, not the helper's behavior matrix.

## Q-TEST - Test Brittleness Across 4 Vitest Files

### Findings
F-004 is also the Q-TEST finding for this iteration. The packet-specific `executor-config-copilot-target-authority.vitest.ts` suite is broad for the pure helper, but the cross-workflow regression harness still points at the old cli-copilot dispatch abstraction. That makes the test surface weaker than the shipped behavior it claims to protect.

### Notes
The packet 014 mock false-confidence issue remains covered by iteration 002's F-003. This pass did not find a comparable production-order bug in `executor-config-copilot-target-authority.vitest.ts`; the gap is that no test goes beyond the helper boundary into the two YAML call-site sequences.

## Q-COV - Coverage Gaps Spanning Packets

See iteration 001 and iteration 002 for degraded graph/readiness coverage gaps. This iteration adds only the cli-copilot call-site coverage gap described in F-004.

## Q-DOC - Catalog/Playbook Drift

No new Q-DOC finding in this iteration. The catalog entry for the Copilot helper accurately describes the current split where deep-research uses `runAuditedExecutorCommand()` and deep-review uses `spawnSync('copilot', ...)`; the drift is in the older test harness, not in the catalog text read for this pass.

## Q-MAINT - Maintainability / Code Smell

### Findings
F-004 is the maintainability finding for this iteration.

### Notes
`buildCopilotPromptArg()` remains a reasonable isolation boundary: validation, authority preamble generation, plan-only enforcement, and wrapper-mode file-body emission are centralized in one helper. The maintainability smell is the parallel test abstraction in `cli-matrix.vitest.ts`, which now duplicates an obsolete mental model of cli-copilot dispatch while the YAML has moved to inline Node scripts.

## Sources read this iteration
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-001.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/iterations/iteration-002.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/011-post-stress-followup-research/review/deep-review-strategy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/implementation-summary.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/review-report.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/executor-config-copilot-target-authority.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/36-copilot-target-authority-helper.md`

## Suggested focus for iteration 004
Deepen Q-DOC + Q-COV across the 28 catalog/playbook updates. Prioritize terminology and operator instructions for degraded code-graph states: verify that `trustState`, `readiness.action`, `fallbackDecision`, CocoIndex seed telemetry, and manual fallback guidance match the actual shipped behavior after F-001 through F-003.
