# Iteration 014 — Dimension(s): D7

## Scope this iteration
This iteration stayed on the default D7 rotation and re-audited the operator-facing documentation around health checks, graph-count expectations, and live-session observability guidance. The focus was to verify whether the post-025 documentation fixes still match the shipped repo inventory and the non-mutating command surfaces they tell operators to run.

## Evidence read
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:96-100` → The hook reference still uses the workspace-safe MCP build command from repo root.
- `.opencode/skill/skill-advisor/SET-UP_GUIDE.md:87-99` → The setup guide still routes hook setup through the same build command and the Phase 020 hook reference.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:51-53` → The root playbook still declares 46 deterministic scenarios across 9 categories.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291-305` → The MR/LT rows still use the post-025 artifact names and say Copilot uses callback wrapping.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:40-44` → The live-session wrapper guide still points operators at `smart-router-analyze.ts` for report generation.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:112-124` → Copilot setup is still documented as callback-style `onToolInvoked` integration.
- `.opencode/skill/skill-advisor/README.md:62-63` → README still says there are 10 command bridges and 21 skill folders with graph metadata.
- `.opencode/skill/skill-advisor/README.md:190-192` → README still says the compiled graph groups the current 21 folders into 6 families.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:78-78` → Global preconditions still require 21 skill folders with `graph-metadata.json`.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:222-226` → CP-001/CP-005 still require 21 discovered metadata files plus `skill_graph_skill_count: 21` and status `ok`.
- `.opencode/skill/skill-advisor/SET-UP_GUIDE.md:305-308` → The setup guide still hardcodes `skill_graph_skill_count: 21` as the expected `--health` signal.
- `.opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md:18-20` → The health-check feature doc hardcodes `20 discovered skills, 10 command bridges, ... skill_graph_skill_count set to 21`.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2636-2693` → `health_check()` computes `skills_found`, `command_bridges_found`, `skill_graph_skill_count`, and `status` from live discovery, graph, cache, and source-metadata state rather than fixed constants.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
#### P1-014-01 (D7) Health-check and graph-count docs hard-code stale inventory/status values across operator surfaces
Evidence: `.opencode/skill/skill-advisor/README.md:62-63`, `.opencode/skill/skill-advisor/README.md:190-192`, `.opencode/skill/skill-advisor/SET-UP_GUIDE.md:305-308`, `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:78-78`, `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:222-226`, `.opencode/skill/skill-advisor/feature_catalog/04--testing/02-health-check.md:18-20`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2636-2693`.

Impact: The docs instruct operators to expect fixed values such as 21 skill folders, 21 discovered metadata records, `skill_graph_skill_count: 21`, and `status: ok`, but the implementation derives those fields from the live skill inventory and current graph/cache/source-health conditions. That makes the playbook and setup guide false-fail valid repo states as the skill library evolves or when the runtime legitimately reports `degraded` diagnostics.

Remediation: Replace hard-coded numeric/status assertions with dynamic checks tied to live discovery output (for example, nonzero counts and graph/discovery parity), then update README, setup, playbook, and feature-catalog health surfaces together from one source of truth.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-005 remains closed for the workspace build command.** The hook reference and setup guide still direct operators to `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` from repo root (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:96-100`, `.opencode/skill/skill-advisor/SET-UP_GUIDE.md:87-99`).
- **DR-P1-005 remains closed for the playbook denominator, observability artifact names, and Copilot callback model.** The root playbook still declares 46 scenarios across 9 categories, the MR/LT table still matches the shipped measurement/telemetry artifact names, and both the playbook and live-wrapper guide still document Copilot as callback-based integration (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:51-53`, `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:291-305`, `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:635-653`, `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:112-124`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:105-107`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:145-145`).

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 2
- cumulative_p2: 3
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Rotate back to D1 and re-check the post-remediation stdin, privacy, and disable-flag surfaces for any residual runtime or operator-contract drift.
