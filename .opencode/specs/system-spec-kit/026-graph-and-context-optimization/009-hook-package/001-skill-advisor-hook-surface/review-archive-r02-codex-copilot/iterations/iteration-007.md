# Iteration 007 — Dimension(s): D7

## Scope this iteration
Reviewed D7 Documentation accuracy because the default rotation for iteration 7 selects D7. I checked the operator-facing hook reference, skill-advisor README/catalog/playbook, live-session wrapper setup, and whether referenced command/file paths match the repository.

## Evidence read
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86 -> setup tells operators to build the MCP server before enabling runtime hooks.
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:89 -> the documented build command is `npm run --workspace=@spec-kit/mcp-server build`.
- .opencode/skill/skill-advisor/README.md:96 -> README repeats the requirement to build the hook bundle before runtime registration.
- .opencode/skill/skill-advisor/README.md:100 -> README repeats `npm run --workspace=@spec-kit/mcp-server build`.
- .opencode/skill/skill-advisor/manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md:27 -> the smoke playbook precondition says to run from the repository root.
- .opencode/skill/skill-advisor/manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md:31 -> the smoke playbook repeats `npm run --workspace=@spec-kit/mcp-server build`.
- package.json:5 -> the repository-root package exposes only a `scripts` object.
- package.json:6 -> the repository-root scripts contain only `dev`, with no root build or workspace declaration.
- .opencode/skill/system-spec-kit/mcp_server/package.json:16 -> the nested MCP package has the actual `build` script.
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:70 -> the hook reference says Codex registration is deferred.
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:78 -> the hook reference says `.codex/settings.json` and `.codex/policy.json` remain documented snippets.
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:205 -> the Codex setup section repeats that configuration writes were blocked and snippets are deferred.
- .opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:579 -> the feature catalog says Codex settings and policy are now registered for users.
- .opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:583 -> the feature catalog says `.codex/settings.json` registers `UserPromptSubmit` and `PreToolUse` hooks.
- .codex/settings.json:2 -> the actual checkout has a `hooks` object.
- .codex/settings.json:8 -> `UserPromptSubmit` points to `mcp_server/dist/hooks/codex/user-prompt-submit.js`.
- .codex/settings.json:19 -> `PreToolUse` points to `mcp_server/dist/hooks/codex/pre-tool-use.js`.
- .codex/policy.json:4 -> the actual checkout has a `bashDenylist` policy array.
- .opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md:43 -> analyzer invocation uses the full repo-relative path to `smart-router-analyze.ts`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:42 -> analyzer default input is `.opencode/skill/.smart-router-telemetry/compliance.jsonl`.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:103 -> measurement report output path is the full repo-relative observability path.
- .opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:104 -> measurement JSONL output path is the full repo-relative observability path.
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:642 -> release readiness expects `skill-advisor-hook-validation.md` next to the hook reference, and that file exists in the same directory.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-007-01, dimension D7, published build/setup commands point at a repo-root workspace invocation this checkout does not define. Evidence: .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:89, .opencode/skill/skill-advisor/README.md:100, and .opencode/skill/skill-advisor/manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md:31 all tell operators to run `npm run --workspace=@spec-kit/mcp-server build`; the smoke playbook frames that command from repo root at .opencode/skill/skill-advisor/manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md:27, while package.json:5 through package.json:6 exposes only a root `dev` script and no workspace declaration. The actual MCP package build script exists in .opencode/skill/system-spec-kit/mcp_server/package.json:16. Impact: the setup reference and hook-routing smoke precondition are not directly executable from the documented working directory, so operators can fail before validating any runtime hook behavior. Remediation: replace the published command with a checkout-valid invocation such as `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build`, or add a real root workspace declaration and keep the docs tied to that contract.

### P2 (Suggestion)
id P2-007-01, dimension D7, the authoritative hook reference is stale about Codex registration status. Evidence: .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:70 marks Codex registration as deferred, .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:78 says `.codex/settings.json` and `.codex/policy.json` remain documented snippets, and .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:205 repeats that the snippets are deferred. Newer/current evidence contradicts that: .opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:579 says Codex registration is now registered for users, .opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:583 describes the registered hooks, .codex/settings.json:2 through .codex/settings.json:19 contains the actual `UserPromptSubmit` and `PreToolUse` commands, and .codex/policy.json:4 contains the shipped Bash denylist. Impact: operators get conflicting guidance from the reference doc that is supposed to be the setup source of truth, and may incorrectly treat live Codex config as a deferred snippet. Remediation: update the hook reference runtime matrix and Codex section to reflect the registered files, keeping the old sandbox limitation only as historical context if needed.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.59 (first D7 pass read the hook reference, README, feature catalog, playbook, live-session wrapper setup, actual Codex config, package metadata, and observability script defaults; two documentation accuracy findings were new for this run)
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 6
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Advance D1 Security/Privacy by checking disable-flag propagation, prompt-safe diagnostics, HMAC cache opacity, and Unicode/prompt-policy tests with fresh source evidence.
