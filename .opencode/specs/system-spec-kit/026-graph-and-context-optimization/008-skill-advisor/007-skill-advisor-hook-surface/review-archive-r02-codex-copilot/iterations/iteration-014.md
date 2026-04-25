# Iteration 014 — Dimension(s): D7

## Scope this iteration
Reviewed D7 Documentation accuracy because iteration 14 rotates to D7 and iteration 13 explicitly handed off to the documentation surface. This pass focused on the live-session wrapper docs to verify that the feature catalog and manual playbook still match the shipped per-runtime setup contract.

## Evidence read
- .opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:653 → the catalog says `LIVE_SESSION_WRAPPER_SETUP.md` covers all 4 runtimes and that users opt in by registering in their runtime settings file.
- .opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:303 → LT-001 expects wrapper registration "in the runtime settings file" after following `LIVE_SESSION_WRAPPER_SETUP.md`.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:70 → Claude setup is described as a module referenced by `.claude/settings.local.json`.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:86 → Codex setup is described as registration in `.codex/settings.json`.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:100 → Gemini setup is described as registration in `.gemini/settings.json`.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:114 → Copilot setup is described instead as calling the wrapper from a tool invocation callback.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:119 → the Copilot example exports `onToolInvoked(...)`, reinforcing that the integration point is callback-based rather than settings-file registration.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-014-01, dimension D7, the live-session wrapper docs collapse all runtimes into a "settings file" registration model even though the shipped Copilot setup is callback-based. Evidence: the feature catalog says users opt in "by registering in their runtime settings file" at `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:653`, and the manual playbook repeats the same expected outcome for LT-001 at `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:303`. The authoritative setup doc contradicts that for Copilot: `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:114` says "Copilot SDK hosts can call the wrapper from their tool invocation callback", and `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:119` shows an `onToolInvoked(...)` callback rather than a settings-file entry. Impact: Copilot operators following the catalog/playbook cannot satisfy the documented expected outcome as written, which makes the live-session wrapper validation flow inaccurate for one of the four advertised runtimes. Remediation: update the feature catalog and LT-001 wording to describe per-runtime registration accurately (settings-file for Claude/Codex/Gemini, callback integration for Copilot SDK hosts).

### P2 (Suggestion)
None.

### Re-verified (no new severity)
The authoritative setup doc itself remains internally consistent for the non-Copilot runtimes: Claude, Codex, and Gemini still map to settings-file based setup at `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:70`, `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:86`, and `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:100`.

## Metrics
- newInfoRatio: 0.10 (late-cycle D7 pass with one fresh cross-doc/runtime mismatch and one targeted re-verification)
- cumulative_p0: 0
- cumulative_p1: 9
- cumulative_p2: 8
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Return to D1 Security/Privacy and probe prompt-handling, disable-flag, and privacy-contract surfaces with fresh hook/test evidence.
