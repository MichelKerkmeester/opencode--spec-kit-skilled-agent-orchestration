# Iteration 007 - Convergence Confirmation

## Focus

Confirm whether iteration 006 already satisfied the deep-research stop conditions, and avoid padding the loop if the schema answer, concrete patch, and empirical reproducer were already complete.

## Actions Taken

1. Re-read the active strategy stop conditions. The packet requires a primary-source-backed Copilot schema explanation, a concrete `.github/hooks/superset-notify.json` patch shape, and an empirical reproducer where the patched shape logs successful hook execution. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/deep-research-strategy.md:30-34`.
2. Re-read iterations 003 through 006 and the active project hook files without mutating `.github/hooks/superset-notify.json` or any hook script.
3. Verified that the active `.github/hooks/superset-notify.json` still has the flat Copilot command shape with `version`, canonical event names, top-level `type`, `bash`, and `timeoutSec`. Source: `.github/hooks/superset-notify.json:1-33`.
4. Verified that the active `.claude/settings.local.json` still has a Claude-style `UserPromptSubmit` wrapper with nested `hooks[0].command` and no top-level Copilot no-op fields. Source: `.claude/settings.local.json:24-34`.

## Findings

No new technical finding was needed in this iteration. The prior iteration already marked the research-only convergence signal as met and listed the five completed requirements: schema explanation, `.github/hooks` patch shape, Copilot broken/mitigated repro, and Claude compatibility repro. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-006.md:149-161`.

## Evidence Review

### Schema and patch shape remain answered

Iteration 003 traced Copilot CLI 1.0.34's bundled schema and established that file hooks accept flat command objects with `type: "command"`, optional `bash` / `powershell` / `command`, and `timeoutSec` / `timeout`. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-003.md:26-40`.

Iteration 003 also identified the canonical accepted event keys and alias normalization, then produced the concrete `.github/hooks/superset-notify.json` patch shape. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-003.md:41-61` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-003.md:100-140`.

The active project file matches that patch shape today. Source: `.github/hooks/superset-notify.json:1-33`.

### Root cause remains outside `.github/hooks/superset-notify.json`

Iteration 004 traced Copilot's repo-settings loader and found that Copilot CLI 1.0.34 reads `.claude/settings*.json` hooks in addition to `.github/hooks/*.json`. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-004.md:21-38`.

Iteration 004 explained the asymmetric failure: `sessionStart` filters entries by `type === "command"`, while `userPromptSubmitted` maps every entry through execution, allowing the Claude wrapper to reach the executor without top-level `bash` or `powershell`. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-004.md:56-67`.

The active Claude settings file still has the vulnerable wrapper shape pending implementation. Source: `.claude/settings.local.json:24-34`.

### Empirical reproducer remains decisive

Iteration 005 built the combined repro with both a valid flat `.github/hooks/superset-notify.json` and a Claude-style wrapper. The broken case logged successful execution of the flat `.github/hooks` command, then reproduced the target error from the wrapper object. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-005.md:19-30` and `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:26-29`.

The mitigated case added top-level `type`, `bash`, and `timeoutSec` to the Claude wrapper and logged successful execution for both the `.github/hooks` command and the Copilot-safe wrapper command, with no missing-shell error. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-005.md:32-47` and `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:26-31`.

Iteration 006 then verified the same wrapper mitigation is acceptable to Claude Code: Claude executed the nested command and did not execute the top-level Copilot `bash` field. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-006.md:95-120` and `/tmp/claude-hook-compat-iter006-1776869539/logs/claude-debug.log:131-132`.

## Questions Answered

### KQ-1 / KQ-3: Current accepted schema

Still answered. Copilot CLI 1.0.34 accepts flat command objects under canonical hook event keys. `command` is an alias; flat `bash` remains accepted. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-003.md:144-150`.

### KQ-2: Why `sessionStart` succeeds while `userPromptSubmitted` fails

Still answered. The event asymmetry comes from Copilot's different filtering paths, not from `.github/hooks/superset-notify.json` being invalid. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-004.md:127-129`.

### KQ-4: Which config paths are read

Still answered. Copilot merges `.github/hooks/*.json` with repo settings hooks, including `.claude/settings.local.json`. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-004.md:131-137`.

### KQ-7: Corrected patch

Still answered. `.github/hooks/superset-notify.json` should remain in the flat `bash` shape already present. The implementation-safe additional patch is to add top-level `type: "command"`, `bash: "true"`, and `timeoutSec: 3` to `.claude/settings.local.json` `hooks.UserPromptSubmit[0]`, leaving nested `hooks[0].command` unchanged. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-006.md:95-120`.

### KQ-10: Real project refresh timestamp

Still intentionally open for implementation. This research-only run did not mutate `.claude/settings.local.json`, `.github/hooks/superset-notify.json`, or hook scripts, so a live real-project `Refreshed:` timestamp smoke remains the first post-patch validation step. Source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-006.md:140-142`.

## Ruled Out

- **R9 - Continuing the research loop will reduce the open technical question count.** Ruled out for this iteration. The remaining work is implementation plus live smoke validation, not further schema discovery. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-006.md:153-161` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-006.md:163-165`.

## Convergence

### Convergence signal met

Iteration 007 confirms iteration 006's convergence decision. The research packet has satisfied the research stop conditions:

1. Primary-source-backed schema explanation: Copilot CLI 1.0.34 bundled source traces plus Claude hook docs and compatibility smoke. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-003.md:26-40` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-006.md:25-41`.
2. Concrete `.github/hooks/superset-notify.json` patch: flat `bash` shape, already present in the active file. Sources: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-03/iterations/iteration-003.md:100-140` and `.github/hooks/superset-notify.json:1-33`.
3. Empirical reproducer: broken and mitigated Copilot repro logs plus Claude compatibility proof. Sources: `/tmp/copilot-hook-repro-iter005c-1776868850/broken/logs/process-1776868851140-10267.log:26-29`, `/tmp/copilot-hook-repro-iter005c-1776868850/mitigated/logs/process-1776868939747-14186.log:26-31`, and `/tmp/claude-hook-compat-iter006-1776869539/logs/claude-debug.log:131-132`.

`newInfoRatio` is therefore set to `0.02`: this iteration adds no new schema facts, only an explicit convergence confirmation and a ruled-out direction.

## Next Focus

Hand off to implementation: patch `.claude/settings.local.json` `UserPromptSubmit[0]` with top-level `type: "command"`, `bash: "true"`, and `timeoutSec: 3`; leave the nested Claude `hooks[0].command` unchanged; then run a real Copilot prompt smoke and verify both Copilot hook logs and the `Refreshed:` timestamp.
