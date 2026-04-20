# Blocker: 027/003 Native Advisor Core

## Step
Step 9 / Step 11 pre-implementation validation: reconcile Python-to-TypeScript parity with deterministic §11 corpus gates before implementing the native scorer.

## Problem
The phase contract requires exact Python↔TypeScript parity on the 200-prompt corpus and also requires §11 gates that exceed the current Python scorer baseline.

Measured current Python scorer baseline on the frozen 200-prompt corpus:

- Corpus path found in this checkout: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- User-requested path `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl` does not exist in this checkout.
- Python source of truth: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` with `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`
- Result: `112/200` exact gold top-1 (`56.00%`)
- UNKNOWN fallback count: `37`
- Gold-`none` rows: `18`
- Gold-`none` false-fire count: `10`

This conflicts with deterministic §11 gates:

- Full-corpus exact top-1 must be `>= 140/200` (`>=70%`)
- UNKNOWN fallback count must be `<= 10`

If TypeScript exactly matches Python, it inherits `112/200` and `37` UNKNOWNs, failing the hard gates. If TypeScript improves to satisfy §11, it cannot also be exact per-prompt parity with the current Python scorer.

## What I Tried
- Read 027/003 `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.
- Read research evidence: Track C, measurement plan, Track G, Y2/Y3, and roadmap delta.
- Read Python runtime helper `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`.
- Read Python scorer entrypoint `.opencode/skill/skill-advisor/scripts/skill_advisor.py` because scoring logic lives there rather than in the runtime helper.
- Read the 11 TypeScript advisor files under `mcp_server/lib/skill-advisor/`.
- Read 027/001 and 027/002 implementation summaries and lifecycle fixtures.
- Located and read the actual 200-prompt corpus at the active Phase 024 path.
- Ran required baseline before edits:
  - `../scripts/node_modules/.bin/vitest run mcp_server/skill-advisor/tests/ mcp_server/tests/advisor-freshness.vitest.ts --reporter=default`
  - Result: `3` files passed, `40` tests passed.
- Migrated the 11 advisor files from `mcp_server/lib/skill-advisor/` to `mcp_server/skill-advisor/lib/` using filesystem moves because `git mv` failed with `.git/index.lock: Operation not permitted`.
- Updated imports to the new package-local path.
- Re-ran the same baseline after migration:
  - Result: `3` files passed, `40` tests passed.
- Measured current Python corpus baseline using the frozen corpus and Python scorer:
  - Result: `112/200`, `UNKNOWN=37`, gold-`none` false-fire `10`.

## Proposed Next
Orchestrator needs to resolve the contract before 027/003 can safely continue:

1. Choose Python parity as the hard gate for this child and defer §11 accuracy / UNKNOWN improvements to a later scorer-tuning phase; or
2. Choose §11 deterministic gates as the hard gate and redefine Python↔TS parity as a baseline-comparison harness, not exact agreement; or
3. Update the Python source-of-truth first so Python itself reaches `>=140/200` and `UNKNOWN<=10`, then rerun 027/003 exact parity against that improved baseline.

The currently completed migration-only changes are behavior-preserving under the targeted baseline, but the native scorer implementation should not proceed until the parity-vs-accuracy contradiction is resolved.
