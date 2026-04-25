# Runner Blocker Trace — `manual-playbook-runner.ts`

**Captured:** 2026-04-25 17:45 (UTC offset CEST)
**Filter under test:** `MANUAL_PLAYBOOK_FILTER=014-detect-changes-preflight`
**Outcome:** BLOCKED before any scenario step executed; failed during in-fixture seeding.

---

## Invocation

```bash
cd .opencode/skill/system-spec-kit
# Compile runner + fixture in-place (the runner's relative imports require
# the .js files to live next to the .ts sources because `import('../../mcp_server/dist/handlers/index.js')`
# is computed from the source-file location).
npx --no-install tsc \
  --module es2022 --target es2022 --moduleResolution node \
  --esModuleInterop --skipLibCheck --resolveJsonModule \
  scripts/tests/manual-playbook-runner.ts \
  scripts/tests/fixtures/manual-playbook-fixture.ts

MANUAL_PLAYBOOK_FILTER=014-detect-changes-preflight \
MANUAL_PLAYBOOK_REPORT_ROOT=<repo>/.opencode/specs/.../011-.../scratch/manual-playbook-results/014 \
node scripts/tests/manual-playbook-runner.js
```

---

## Diagnostic output (final 30 lines, verbatim)

```
INFO  [VectorIndex] Running migration v27
INFO  [VectorIndex] Migration v27: causal_edges uniqueness already anchor-aware, skipping rebuild
INFO  [VectorIndex] Schema migration complete: v27
{"timestamp":"2026-04-25T15:45:58.350Z","level":"info","message":"contamination_audit","stage":"post-render", ...}
[memory-save] Sufficiency warn-only (spec doc) for checkpoint-rollback.md: No primary evidence was captured for this memory.
[memory-save] Template contract warn-only (spec doc) for checkpoint-rollback.md: Rendered memory is missing the required canonical-docs section.; Rendered memory is missing the required evidence section.
[factory] Using provider: hf-local (Explicit EMBEDDINGS_PROVIDER variable)
[hf-local] Loading nomic-ai/nomic-embed-text-v1.5 (~274MB, first load may take 15-30s)...
[hf-local] Attempting device: mps
[hf-local] MPS unavailable (Unsupported device: "mps". Should be one of: cpu.), using CPU
[hf-local] Model loaded in 544ms (device: cpu)
[memory-save] Embedding cache MISS+GENERATE for checkpoint-rollback.md
[memory-save] Embedding cache STORE after quality gate for checkpoint-rollback.md
{"timestamp":"2026-04-25T15:45:58.967Z","level":"info","message":"contamination_audit", ...}
[memory-save] Sufficiency warn-only (spec doc) for graph-rollout-diagnostics.md: ...
[memory-save] Embedding cache MISS+GENERATE for graph-rollout-diagnostics.md
[QUALITY-GATE] warn-only | score: 0.70 | would-reject: true | reasons: [Near-duplicate detected: memory #1 (similarity: 93.4% >= 92%)]
[memory-save] TM-04: Quality gate WARN-ONLY for graph-rollout-diagnostics.md: Near-duplicate detected: memory #1 (similarity: 93.4% >= 92%)
[memory-save] Embedding cache STORE after quality gate for graph-rollout-diagnostics.md
Failed to seed memory for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/.tmp/gate-i-manual-playbook-NySgUn/specs/001-manual-fixture-auth-resume/memory/graph-rollout-diagnostics.md
Error: Failed to seed memory for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/.tmp/gate-i-manual-playbook-NySgUn/specs/001-manual-fixture-auth-resume/memory/graph-rollout-diagnostics.md
    at indexSeed (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:127:15)
    at async createManualPlaybookFixture (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.js:461:29)
    at async main (file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.js:1418:21)
```

The runner reaches `Gate I runner: discovered 1 active scenario files; parsed 1.` (the 014 scenario), then enters `createManualPlaybookFixture` to seed two fixture memories (`checkpoint-rollback.md`, `graph-rollout-diagnostics.md`). The second seed trips the quality-gate near-duplicate detector at 93.4% similarity (threshold 92%), `indexSeed` throws, and the runner aborts before any scenario-under-test executes.

---

## Why this is pre-existing, not introduced by 011

1. The error path is in `manual-playbook-fixture.ts:127` (`indexSeed`), which is fixture infrastructure unchanged by 010 / 010/007 / 011. The fixture stages two seed memories on every run regardless of which scenario is filtered.
2. The quality-gate near-duplicate threshold (92%) and the two near-duplicate seed corpora (`checkpoint-rollback.md` ↔ `graph-rollout-diagnostics.md` at 93.4%) predate all 010/* work.
3. The default `MANUAL_PLAYBOOK_REPORT_ROOT` constant in `manual-playbook-runner.ts:114-116` points at `006-canonical-continuity-refactor/015-full-playbook-execution/scratch/manual-playbook-results/` — a phase folder that does NOT exist on disk (`find .opencode/specs -name "015-full-playbook*"` returns nothing). This constant has been stale since whenever `006/015` was reorganized away.
4. `scripts/tests/README.md` does not list the runner under "Recommended run order" or "Vitest regression suites".
5. `package.json` has no script that invokes the runner.
6. The runner is in `scripts/tests/` but is excluded from `scripts/tsconfig.json:include` (which lists only `tests/**/*.vitest.ts` exclusions; runner is `manual-playbook-runner.ts`, not a vitest file). Hence no compiled `.js` exists in `scripts/dist/`.

These signals together strongly suggest the runner is **partially decommissioned** infrastructure — wired to compile, but with a broken fixture-seed path and no canonical invocation pattern in the repo.

---

## Mitigation chosen for 011

Instead of fixing the runner fixture in-scope (which would be a 30-60 minute side-quest unrelated to 010/007 surfaces), the 011 scorecard relies on **automated-test surrogate coverage**: each scenario block maps to one or more vitest/pytest tests that exercise the same surface. Counts:

- 175 vitest tests pass (the canonical phase-010 11-file suite + tool-input-schema)
- 57 Python tests pass (`test_skill_advisor.py` including new 010/007/T-D R-007-8 + R-007-P2-8 fixture tests)

The implementation-summary scorecard tabulates per-scenario-block PASS / PASS-PARTIAL / UNAUTOMATABLE / FAIL based on this surrogate evidence. Three blocks marked UNAUTOMATABLE (014/B path traversal, 026/E control-char, 203/B cache invalidation) are recommended P2 follow-ups: each surface is shipped + wired, but no dedicated automated test exists yet.

---

## Recommended P2 follow-ups (out of scope for 011)

1. **Fix the manual-playbook-fixture seeding bug.** Either (a) make the two near-duplicate seed corpora more distinct so the quality gate passes, (b) bypass the quality gate during fixture seeding (it's already warn-only — the throw is downstream), or (c) replace the dual-seed with a single-seed corpus.
2. **Update the runner's default `MANUAL_PLAYBOOK_REPORT_ROOT`** to point at a real path or require it via env var.
3. **Document the runner invocation pattern** in `scripts/tests/README.md` or `package.json` so future operators don't have to compile in-place from scratch.
4. **Add the three follow-up adversarial vitest tests** identified in the scorecard triage.
