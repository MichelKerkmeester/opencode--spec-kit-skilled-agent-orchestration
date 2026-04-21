---
title: "Phase 027 Remediation Commit Blocker"
description: "Git staging/commit blocked by sandbox index.lock permission."
importance_tier: "high"
contextType: "handover"
---

# Blocker — Commit Not Created

## Reason

`git add` failed because the sandbox could not create the repository index lock:

```text
fatal: Unable to create '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/index.lock': Operation not permitted
```

This matches the user-provided commit sandbox note.

## State

The remediation work is complete and verified, but remains uncommitted in the working tree.

Do not stage unrelated pre-existing changes:
- `.opencode/skill/system-spec-kit/scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts`
- `.opencode/skill/mcp-coco-index/feedback/`
- `.opencode/skill/system-spec-kit/mcp_server/.opencode/skill/`

Stage only the remediation files described in `remediation-report.md`, including the moved advisor legacy tests and this review remediation folder's `remediation-report.md` + `blocker.md`.

## Proposed Next Step

The orchestrator should stage the in-scope remediation files and commit with the requested message:

```text
fix(027): remediate 21 post-implementation deep-review findings (15 P1 + 6 P2)
```

Include the verification evidence from `remediation-report.md`.

## 2026-04-21 Theme 1 Commit Blocker

Theme: `THEME 1 — Public safety contracts`

Findings implemented and locally verified:

- `MERGE-P1-001`: redacts raw prompts from generic MCP error envelopes.
- `MERGE-P1-002`: rejects absolute, escaping, and symlinked-out `derived.key_files` before hashing/provenance.
- `MERGE-P1-003`: constrains daemon watcher `derived.key_files` targets to workspace-contained files.

Files modified for Theme 1:

- `.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/provenance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/extract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts`

Verification completed before the commit attempt:

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` -> exit 0
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` -> exit 0
- `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/ code-graph/tests/ --reporter=default` -> 222/222 green
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` -> 52/52 overall_pass: true

Commit command attempted:

```text
git add <Theme 1 scoped files> && git commit -m "fix(027): public safety contracts - 3 findings (P1:3 P2:0 merge:3)" ...
```

Failure:

```text
fatal: Unable to create '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/index.lock': Operation not permitted
```

Required next step:

Run the Theme 1 commit outside this sandbox, then resume with `THEME 2 — API correctness`.
