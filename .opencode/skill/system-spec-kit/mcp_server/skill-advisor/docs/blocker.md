# Commit Blocker

## Blocker

`git mv` could not create `.git/index.lock` inside this sandbox:

```text
fatal: Unable to create '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/index.lock': Operation not permitted
```

The consolidation has been applied in the working tree using ordinary filesystem
moves after the index lock failure. Changes are intentionally left uncommitted
for the orchestrator to stage and commit.

## Status

- `.opencode/skill/skill-advisor` has been removed after moving its live
  contents into `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`.
- `README.md` was merged into the package-local README at
  `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`.
- Python shim and graph compiler path logic was updated for the deeper package
  location.
- Live references were updated across AGENTS/CLAUDE, hook docs, package docs,
  sibling skill docs, plugin bridge references, and TypeScript tests.

## Verification

- `npm run typecheck`: exit `0`
- `npm run build`: exit `0`
- Vitest advisor + code-graph suite: `219/219` tests passed
- Python regression: `52/52`, `overall_pass: true`
- Python shim one-shot: valid JSON output
- Python shim `--stdin`: valid JSON output
- Exact live scan for the old skill-advisor package path: empty
- Full grep scan: only historical snapshots/artifacts remained

## Recommended Commit

```text
refactor: consolidate skill-advisor into self-contained mcp_server/skill-advisor/

Complete the Phase 027 architecture by moving the remaining operator-facing
surfaces from .opencode/skill/skill-advisor into the self-contained
mcp_server/skill-advisor/ package:

- scripts/ (Python shim + runtime + regression + bench + compiler + fixtures + routing-accuracy + shell scripts)
- feature_catalog/ (19 docs across 4 groups)
- manual_testing_playbook/ (17 NC/CL/CP/OP scenarios + root)
- SET-UP_GUIDE.md
- graph-metadata.json
- tests/python/test_skill_advisor.py

README.md merged: operator-facing content combined with package-local
content into a single README at mcp_server/skill-advisor/README.md.

Updated path references across:
- AGENTS.md + CLAUDE.md (Gate 2 fallback command)
- Plugin bridge (spec-kit-skill-advisor.js + bridge.mjs)
- TS test files (compat, legacy parity, Python<->TS parity)
- Hook reference docs
- Other live *.md docs

Python scripts' REPO_ROOT parents[N] indices updated for new depth.

Deleted .opencode/skill/skill-advisor (empty post-move).

Historical specs under .opencode/specs/ retain their time-of-writing
paths as documentation artifacts.

Verification:
- npm typecheck + build: exit 0
- vitest: 219/219 tests passed (167 advisor + 52 code-graph)
- Python regression: 52/52 overall_pass: true
- Shim one-shot + --stdin paths: both valid output
- grep for the old skill-advisor package path in live code: empty

Co-Authored-By: Codex gpt-5.4 <noreply@openai.com>
```

## Notes For Orchestrator

- Do not push from this step.
- The working tree may show delete/add pairs instead of renames because `git mv`
  could not acquire the index lock. Git rename detection should recover these
  during review, or the orchestrator can re-stage as desired.
