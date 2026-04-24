# Iteration 016 — Dimension(s): D7

## Scope this iteration
Verified the most repeated setup command in the README/reference/playbooks against the repo’s actual npm/workspace layout. This was the first D7 drill that exercised the command surface instead of only reading prose.

## Evidence read
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-91` -> hook reference tells operators to run `npm run --workspace=@spec-kit/mcp-server build` from the repo root.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md:18-23` -> validation playbook repeats the same repo-root workspace build command.
- `.opencode/skill/skill-advisor/README.md:96-101` and `manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md:27-32` -> the README and hook smoke playbook repeat the same instruction.
- `.npmrc:1` and `package.json:1-13` -> the repo root disables workspaces and has no workspace declarations, while `.opencode/skill/system-spec-kit/package.json:6-16` defines the actual workspace and local build script.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
[P1-016-01] [D7] Published build/setup commands point at a repo-root workspace invocation that the checkout cannot satisfy
- **Evidence**: `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:86-91`; `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md:18-23`; `.opencode/skill/skill-advisor/README.md:96-101`; `.opencode/skill/skill-advisor/manual_testing_playbook/06--hook-routing/001-hook-routing-smoke.md:27-32`; `.npmrc:1`; `package.json:1-13`; `.opencode/skill/system-spec-kit/package.json:6-16`
- **Impact**: The documented operator path fails on a normal checkout because the repo root is not the `system-spec-kit` workspace root. That blocks the very first build step for setup, smoke checks, and release validation.
- **Remediation**: Update the docs to build from `.opencode/skill/system-spec-kit/` or directly from `.opencode/skill/system-spec-kit/mcp_server/`; alternatively, if repo-root workspace commands are intended, remove the conflicting root `workspaces=false` posture and add the appropriate root workspace declarations.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.22
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 2
- dimensions_advanced: [D7]
- stuck_counter: 0

## Next iteration focus
Return to D1 and finish the Unicode/instruction-shape edge-case drill to confirm the late-pass privacy work stays bounded to the existing argv leak.
