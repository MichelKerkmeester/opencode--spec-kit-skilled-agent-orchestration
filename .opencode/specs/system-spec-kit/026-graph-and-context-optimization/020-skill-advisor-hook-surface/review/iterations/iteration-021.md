# Iteration 021 — Dimension(s): D7

## Scope this iteration
This iteration followed the default D7 rotation and re-audited the operator-facing documentation package rather than the runtime code. The focus was whether the post-025 root playbook, hook reference, and observability setup docs still provide the split-document execution surface they claim to ship.

## Evidence read
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:14-23` → the root playbook says per-feature execution detail lives in numbered category folders and lists canonical source artifacts only through `06--hook-routing/`.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:109-112` → review inputs require the root document plus referenced per-feature files under `manual_testing_playbook/NN--category-name/`.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:271-306` → the PP/MR/LT sections define 12 scenarios inline in the root document and omit per-scenario file links entirely.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:326-365` → the feature-catalog cross-reference index ends at `HR-006`; it does not include any `PP-*`, `MR-*`, or `LT-*` entries.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-92` → the hook reference still uses the workspace-safe MCP build command from repo root.
- `.opencode/skill/skill-advisor/README.md:96-101` → the root README still documents the same workspace-safe build command before runtime hook registration.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:112-124` → the live-session wrapper guide still documents Copilot as callback-style `onToolInvoked` integration.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
**P1-021-01 (D7): The root manual testing playbook still claims a split-document package, but the plugin, measurement, and live-telemetry scenarios ship only as inline root tables with no promised per-feature artifacts.** Evidence: the root playbook says per-feature execution detail lives in numbered category folders and only lists canonical source artifacts through `06--hook-routing/` (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:14-23`), and its review inputs require referenced per-feature files under `manual_testing_playbook/NN--category-name/` (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:109-112`). But the `PP-001..PP-005`, `MR-001..MR-003`, and `LT-001..LT-004` sections are defined inline with no `File` column or linked scenario files (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:271-306`), and the root cross-reference index stops at `HR-006` with no `PP-*`, `MR-*`, or `LT-*` entries (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:326-365`). Impact: 12 release-readiness scenarios lack the deeper execution contracts that the playbook says operators should rely on, so the package is internally inconsistent and harder to execute or maintain as a canonical split-document playbook. Remediation: either add the missing `07--plugin-path/`, `08--measurement-run/`, and `09--live-session-telemetry/` per-feature files plus cross-reference entries, or explicitly document those scenarios as root-only exceptions and remove the split-document claim for them.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-005 remains closed for the workspace-safe build command.** The hook reference and README still direct operators to `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` from repo root (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-92`, `.opencode/skill/skill-advisor/README.md:96-101`).
- **DR-P1-005 remains closed for the Copilot callback model.** The live-session wrapper setup guide still documents Copilot integration as callback-style `onToolInvoked(...)`, matching the post-025 doc contract (`.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:112-124`).

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 7
- cumulative_p2: 3
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Rotate back to D1 and re-check the post-remediation privacy, stdin, and disable-flag surfaces for residual runtime drift outside the already-covered doc gaps.
