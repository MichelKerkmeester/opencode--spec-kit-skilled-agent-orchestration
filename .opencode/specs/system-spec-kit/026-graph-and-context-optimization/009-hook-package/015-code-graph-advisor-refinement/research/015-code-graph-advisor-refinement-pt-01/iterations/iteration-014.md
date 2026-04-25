# Iteration 14: Cross-Packet Preflight + Delete Plan Actuation

## Focus

Iter-13 selected Option A (DELETE the promotion subsystem) with high confidence. Iter-14 actuates the decision: (1) run a cross-packet preflight to confirm the delete blast radius is bounded, (2) produce a PR-ready delete plan as a `delete_plan` delta, (3) sweep documentation for prose that would go stale after the delete.

## Findings

### F61. Cross-packet preflight PASSES — zero external imports

Grep across `.opencode/skill/system-spec-kit/mcp_server/` (outside skill-advisor) and `.opencode/skill/system-spec-kit/scripts/` for any `from '...promotion/...'` or `from '...gate-bundle/shadow-cycle/semantic-lock/two-cycle-requirement/weight-delta-cap'` returned **zero hits**. The promotion modules are not imported anywhere outside `skill-advisor/lib/promotion/` and `skill-advisor/bench/`. [SOURCE: grep on `.opencode/skill/system-spec-kit/{mcp_server,scripts}/`, no matches]

### F62. Bench callers confirmed at exactly 3 (matches iter-13 correction)

`grep -l -E "from ['\"].*promotion|runShadowCycle|GateBundle..." .opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/*.ts` returns precisely:
- `bench/corpus-bench.ts`
- `bench/holdout-bench.ts`
- `bench/safety-bench.ts`

Three other bench files (`latency-bench.ts`, `scorer-bench.ts`, `watcher-benchmark.ts`) do NOT import promotion modules and are out of scope for the delete. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/*.ts` import scan]

### F63. Test count CORRECTION: 14 `it()` blocks, not "17 tests"

Iter-10 F52 said "17 tests"; iter-13 carried that figure forward. The actual count is:
- 1 test file: `tests/promotion/promotion-gates.vitest.ts` (316 lines)
- 14 `it()` blocks across 6 `describe()` groups: shadow cycles (2), weight/semantic guards (4), seven-gate bundle (2), prompt-safety release gates (1), two-cycle requirement (1), rollback/integration (4)

The "17" figure conflated `it()` blocks with sub-assertions or was a stale count. The delete still removes the entire file as a single unit; only the line citing "17 tests" in iter-10 needs an erratum. [SOURCE: `tests/promotion/promotion-gates.vitest.ts:60-300` `grep -c "^\s*(it|test)\(" → 14`]

### F64. Sibling spec `026/009/002` describes promotion gates as DELIVERED but SEALED

`spec.md` of the Phase 027 unification packet describes promotion gates as a completed child packet (`007-promotion-gates`) of a merged effort. Its non-goals explicitly state "Live semantic scoring before promotion gates pass" and its constraint is "Keep semantic live weight at 0.00 until promotion gates pass." Combined with iter-12 (semantic weight is hardcoded 0.00 with no caller path to flip it) and F61 (zero imports), this confirms the subsystem was built but never wired live and never received a path to wire live. The 002 packet is itself "Merged" status — it is historical, not a forward dependency. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/spec.md:30,82-83,118,138,151-152,255`]

### F65. Sibling spec `042/001` references are FALSE POSITIVES

The `042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md` matches use "promotion checkpoint" as a deep-research synthesis pattern (moving a finding from "interesting" to "adopted"). This is unrelated to skill-advisor's promotion subsystem — different concept, different domain, no code coupling. Safe to ignore for the delete. [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md:82,113,141,174,187,229,243,285,345`]

### F66. Documentation surface for the scrub (16 files)

Six surface buckets host promotion prose inside `skill-advisor/`:
- `README.md` (repo overview — flag any "promotion gates" prose)
- `feature_catalog/05--promotion-gates/` — entire directory (6 files, all promotion-specific)
- `feature_catalog/02--auto-indexing/05-anti-stuffing.md` — incidental ref (verify before scrub)
- `feature_catalog/04--scorer-fusion/{01,03,05,06}*.md` — 4 files with incidental promotion-gates references in fusion docs
- `feature_catalog/06--mcp-surface/03-advisor-validate.md` — references promotion in MCP surface doc
- `feature_catalog/feature_catalog.md` — index file, scrub the section pointer
- `manual_testing_playbook/09--promotion-gates/` — entire directory (5 files, all promotion-specific)
- `manual_testing_playbook/06--auto-indexing/005-anti-stuffing.md` — incidental
- `manual_testing_playbook/07--lifecycle-routing/005-rollback-lifecycle.md` — promotion-rollback specific
- `manual_testing_playbook/08--scorer-fusion/{001,005}*.md` — 2 files with incidental refs
- `manual_testing_playbook/manual_testing_playbook.md` — index file, scrub section pointer
[SOURCE: `find .../skill-advisor -type f | xargs grep -l ...` — 16 distinct doc files]

### F67. Schema file `schemas/promotion-cycle.ts` (82 LOC) is part of the delete

The schema is a typed contract for the promotion cycle data model. Since lib/promotion/ + tests/promotion/ + 3 bench files are deleted and there are zero external imports, the schema becomes orphaned and goes in the same delete. Verify no remaining advisor code references `PromotionCycle` type after the delete. [SOURCE: `wc -l .../schemas/promotion-cycle.ts → 82`]

### F68. LOC delta calculation

Files to delete (LOC from `wc -l`):
- `lib/promotion/gate-bundle.ts` — 184
- `lib/promotion/rollback.ts` — 87
- `lib/promotion/semantic-lock.ts` — 39
- `lib/promotion/shadow-cycle.ts` — 203
- `lib/promotion/two-cycle-requirement.ts` — 50
- `lib/promotion/weight-delta-cap.ts` — 72
- `tests/promotion/promotion-gates.vitest.ts` — 316
- `schemas/promotion-cycle.ts` — 82
- `bench/corpus-bench.ts` — 70 (full delete; promotion-coupled)
- `bench/holdout-bench.ts` — 53 (full delete; promotion-coupled)
- `bench/safety-bench.ts` — 42 (full delete; promotion-coupled)

Subtotal lib+tests+schema: 951 LOC. Bench (3 files): 165 LOC. **Code delete total: 1116 LOC.**

Plus documentation removals: `feature_catalog/05--promotion-gates/` (6 files) + `manual_testing_playbook/09--promotion-gates/` (5 files) + scrub edits across ~10 incidental-reference files. Estimated docs delta: 400-700 LOC depending on length per file. **Combined PR delta estimate: ~1500-1800 LOC removed, ~30-60 LOC of edits to scrub indexes and incidental references.**

[SOURCE: `wc -l` aggregate; doc estimates based on standard skill-advisor markdown sizes]

## Ruled Out

- **"Surgical delete keeping shadow-cycle + bench"** — F61 + iter-12 confirm shadow-cycle has no live caller and the gates around it are also dead code. Partial deletes leave dangling schema types and bench scripts that test nothing.
- **"Keep schema for future re-introduction"** — YAGNI. If the subsystem returns it will need a re-design anyway (iter-13 reasoning). Keeping orphan schema costs maintenance and confuses readers.
- **"Just delete code, leave docs"** — Stale docs describing a non-existent subsystem are worse than no docs (iter-09 finding on docs decay). Docs scrub is non-optional for the same PR.

## Dead Ends

None new this iteration. Confirmed and locked in:
- Cross-packet wiring (none exists; ruled out as a blocker for delete)
- Re-implement-in-place strategies (already eliminated in iter-11/12)
- Behind-flag retention (eliminated in iter-13)

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/*.ts` (6 files, ls + wc -l)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/*.ts` (6 files, grep imports)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` (line counts + describe/it grep)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/promotion-cycle.ts:1-82`
- `.opencode/skill/system-spec-kit/mcp_server/{tools,scripts}` and `.opencode/skill/system-spec-kit/scripts/` (cross-packet import grep, zero hits)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/{spec.md,plan.md}` (sibling intent inspection)
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md` (false-positive verification)
- `find .../skill-advisor -type f | xargs grep -l ...` (documentation surface inventory)

## Assessment

- New information ratio: 0.50
- Questions addressed: cross-packet blast radius, delete plan completeness, doc scrub list, accurate test count
- Questions answered: 4 (preflight result, exact bench coupling, true test-block count, doc surface inventory)

## Reflection

**What worked and why:** Running the 4 preflight greps in parallel got the full blast-radius picture in one round, freeing the rest of the budget for the delete plan + erratum. Following iter-13's correction (3 bench files, not zero callers) by re-grepping bench imports caught the test-count misstatement (14 not 17) — iterations are catching their own predecessor errors, which is the loop working as designed.

**What did not work and why:** I almost merged a parallel grep of schema cross-refs that errored on `head -25` after a multi-pipe; truncating the trailing `head` would have saved one tool call. Minor.

**What I would do differently:** Next iteration should validate the delete plan against the actual `package.json` test/bench scripts to confirm no CI job references the deleted bench files (they aren't wired per iter-13 finding, but ideally the delete plan also strips any orphan script entries if they exist).

## Recommended Next Focus

Iter-15: Validate the delete plan against `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/package.json` (bench/test scripts), `vitest.config.ts` (test-include patterns), and any tsconfig `paths` that might still resolve `lib/promotion/*`. Produce a final ratification record and prepare a `STOP_READY` signal if no surprises surface. We are within striking distance of convergence.