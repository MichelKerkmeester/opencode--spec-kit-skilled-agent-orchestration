---
SPECKIT_TEMPLATE_SOURCE: "blocker | v1.0"
title: "027/004 — Commit Blocker"
description: "Sandbox prevented git index writes after implementation and verification completed."
trigger_phrases:
  - "027/004 blocker"
  - "git index lock"
  - "commit sandbox"
importance_tier: "high"
contextType: "implementation"
---
# Blocker: 027/004 Commit Sandbox

## Summary

Implementation and verification completed for 027/004, but staging failed because the sandbox could not create `.git/index.lock`.

## Evidence

Command attempted:

```bash
git add <027/004 scoped files>
```

Observed error:

```text
fatal: Unable to create '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/index.lock': Operation not permitted
```

## Verification Completed

- Baseline requested suite before edits: 49 tests passed.
- Handler tests: 17 tests passed.
- Requested advisor/freshness regression suite: 83 tests passed.
- Spec validation: passed with 0 errors and 0 warnings.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.

## Commit Status

Per the 027/004 commit sandbox note, changes are intentionally left uncommitted for the orchestrator to stage and commit.

Suggested commit message:

```text
feat(027/004): MCP advisor surface — advisor_recommend + advisor_status + advisor_validate

- 3 MCP tools under mcp_server/skill-advisor/tools/ + handlers under handlers/
- Strict Zod schemas for inputs + outputs
- advisor_recommend: calls lib/scorer/fusion.ts + lifecycle redirect metadata + freshness state
- advisor_status: reads daemon freshness + generation + trust state
- advisor_validate: slice bundle output (corpus/holdout/parity/safety/latency)
- Dispatcher registration wired into MCP surface
- Privacy contracts preserved (no prompt leakage; no PII)
- Cache/freshness integration reuses 001 daemon output
- 17 handler tests covering happy + ambiguous + redirect + UNKNOWN + disabled paths

Closes 027/004.

Co-Authored-By: Codex gpt-5.4 <noreply@openai.com>
```
