# Iteration 028 — Dimension(s): D7

## Scope this iteration
This iteration followed the default D7 rotation and re-checked the operator-facing command surfaces for the live-session telemetry and measurement workflow. The focus was whether the playbook's documented commands are actually runnable in the checked-in repo after the Phase 025 documentation fixes.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-strategy.md:26,30-34,79-81` -> R03 keeps D7 on documentation accuracy and explicitly asks for command-snippet and path verification on fresh evidence.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291-305` -> MR-001 tells operators to execute `scripts/observability/smart-router-measurement.ts`, and LT-003 tells them to run `scripts/observability/smart-router-analyze.ts`.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:40-44` -> the shipped live-session guide documents the analyzer with an explicit runnable command: `npx tsx .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts`.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:1,44-45,341` -> the analyzer is a TypeScript CLI entrypoint with a `tsx` shebang and explicit CLI-argument parsing.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:1,109-110,753` -> the measurement harness is also a TypeScript CLI entrypoint with a `tsx` shebang and explicit CLI-argument parsing.
- `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:635-658,670-674` -> the feature catalog still points at the same measurement/analyzer source files and current artifact names.
- `ls -l .opencode/skill/system-spec-kit/scripts/observability/{smart-router-analyze.ts,smart-router-measurement.ts}` -> both files are checked in as `-rw-r--r--`, not executable.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
**P1-028-01 (D7): The manual testing playbook still gives non-runnable bare-path commands for the measurement and analyzer scenarios.** MR-001 and LT-003 tell operators to execute bare `scripts/observability/smart-router-measurement.ts` and `scripts/observability/smart-router-analyze.ts` paths (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291-305`), but the shipped setup guide uses an explicit runnable form for the analyzer via `npx tsx .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts` (`.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:40-44`). The target files are TypeScript source entrypoints rather than compiled binaries (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:1,44-45,341`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:1,109-110,753`), and the checked-in file modes are non-executable. Impact: operators following the playbook literally can hit a non-runnable command shape and treat the observability workflow as broken even though the scripts remain usable through `npx tsx`. Remediation: update MR-001 and LT-003 to use explicit runnable commands (for example `npx tsx ...`) or make the direct-execution contract real by shipping executable bits and documenting that path consistently.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-005 remains closed for workspace-safe build guidance.** The root README still directs operators to `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` from repo root before enabling hooks (`.opencode/skill/skill-advisor/README.md:96-101`).
- **DR-P1-005 remains closed for Copilot callback-model guidance.** The live-session wrapper guide still documents Copilot integration through an `onToolInvoked(...)` callback rather than a generic settings-file model (`.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:112-124`).
- **DR-P1-005 remains closed for measurement/analyzer artifact naming.** The playbook and feature catalog still agree on the generated measurement report/results artifacts and analyzer JSONL/report behavior (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291-305`, `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:635-674`).

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 3
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Rotate to D1 and re-check the post-025 prompt-handling/privacy surfaces for any residual gaps outside the already-verified stdin and disable-flag fixes.
