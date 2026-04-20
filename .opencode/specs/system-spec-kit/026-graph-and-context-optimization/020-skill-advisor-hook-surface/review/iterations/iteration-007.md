# Iteration 007 — Dimension(s): D7

## Scope this iteration
This iteration reviewed the post-remediation D7 documentation surfaces for the skill-advisor hook stack: the hook reference, root skill-advisor docs, and the manual testing playbook. The goal was to verify that Phase 025's documentation fixes still match the shipped runtime registration files and operator workflows.

## Evidence read
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-90` -> the workspace-safe build command now uses `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:183-191` -> the Copilot wrapper section says the snippet is "shown from local `.github/hooks/superset-notify.json`" and shows an inline Node fallback wrapper.
- `.github/hooks/superset-notify.json:18-30` -> the shipped local Copilot hook config delegates `userPromptSubmitted` to `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh`, not the inline Node wrapper shown in the hook reference.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:205-248` -> the Codex section says `.codex/settings.json` and `.codex/policy.json` are the shipped registration surfaces and shows flat hook objects plus object-shaped `bashDenylist` entries.
- `.codex/settings.json:2-25` -> the shipped Codex config nests commands inside `hooks:[{hooks:[...]}]`, so it does not match the flat JSON shown in the hook reference.
- `.codex/policy.json:1-41` -> the shipped Codex policy uses string arrays under both `bashDenylist` and `bash_denylist`, not `{pattern, reason}` objects.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:297-304` -> LT-001 tells operators to follow `LIVE_SESSION_WRAPPER_SETUP.md` for runtime-specific wrapper registration.
- `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:1-4` -> the live-session wrapper setup guide exists, but it lives under the system-spec-kit observability scripts tree rather than beside the playbook.
- `.opencode/skill/skill-advisor/README.md:96-101` -> the root README now documents the same workspace-safe build command as the hook reference.
- `.opencode/skill/skill-advisor/SET-UP_GUIDE.md:87-99` -> the setup guide also points operators at the workspace-safe build command before hook registration.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:51-53` -> the root playbook states that the package exposes 46 deterministic scenarios across 9 categories.
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:183-306` -> the RA/GB/CP/RS/SG/HR/PP/MR/LT sections enumerate those 46 scenarios across the 9 category blocks.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
**P1-007-01 (D7): Hook reference registration snippets no longer match the shipped Copilot/Codex runtime files.** The D7 hook reference presents the Copilot wrapper snippet as if it were the local `.github/hooks/superset-notify.json` and labels the Codex snippets as the active shipped registration surfaces, but the checked-in files use different shapes: Copilot delegates to an external `copilot-hook.sh`, Codex keeps the extra nested `hooks` wrapper in `.codex/settings.json`, and `.codex/policy.json` ships dual alias string arrays instead of `{pattern, reason}` objects (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:183-191`, `.github/hooks/superset-notify.json:18-30`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:205-248`, `.codex/settings.json:2-25`, `.codex/policy.json:1-41`). Impact: operators using the docs for parity checks, local repair, or rollback can patch the wrong JSON shape and misdiagnose runtime drift. Remediation: update the hook reference so the Copilot and Codex snippets either match the checked-in files exactly or are explicitly labeled as illustrative examples with links to the authoritative repo files.

### P2 (Suggestion)
**P2-007-01 (D7): LT-001 names the live-session wrapper guide without a resolvable repo path.** The playbook tells operators to follow `LIVE_SESSION_WRAPPER_SETUP.md`, but the actual guide lives under `.opencode/skill/system-spec-kit/scripts/observability/`, so the current text leaves the operator to search the repo manually (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:303`, `.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:1-4`). Impact: minor friction during live-session telemetry setup, especially for first-time operators. Remediation: replace the bare filename with a repo-relative Markdown link to the shipped setup guide.

### Re-verified (no new severity)
- **DR-P1-005 remains closed for the workspace build command.** The sampled D7 docs now consistently use `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`, and that command completed successfully during this iteration (`.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-90`, `.opencode/skill/skill-advisor/README.md:96-101`, `.opencode/skill/skill-advisor/SET-UP_GUIDE.md:87-99`).
- **DR-P1-005 remains closed for the playbook denominator.** The root playbook still describes 46 deterministic scenarios, and the category sections continue to enumerate RA/GB/CP/RS/SG/HR/PP/MR/LT coverage that sums to that denominator (`.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:51-53`, `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:183-306`).

## Metrics
- newInfoRatio: 0.15
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 1
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Rotate back to D1 and re-check the post-remediation privacy and disable-flag surfaces for any residual gaps that were not exercised in the first D1 pass.
