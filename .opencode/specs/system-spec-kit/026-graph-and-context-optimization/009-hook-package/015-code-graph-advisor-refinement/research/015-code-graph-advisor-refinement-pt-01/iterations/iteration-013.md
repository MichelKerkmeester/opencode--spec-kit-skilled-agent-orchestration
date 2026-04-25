# Iteration 13: F37 #7 Delete-vs-Wire Decision Memo

## Focus

Iter 12 closed F15 (12-gate matrix) and ruled F37 #7 reducible to a delete-vs-wire
decision because git-log archaeology + production-call-site grep showed the 6-module
promotion subsystem has **no production runtime callers** outside `lib/promotion/`
itself. Iter 11 F57 sketched a `handlers/promotion-orchestrate.ts` seam but never
materialized the file. Iter 12 framed F37 #7 closure as "delete or wire — write the
memo next."

This iteration produces that memo: an evidence-grounded comparison of three options
(Delete / Wire-up / Partial-with-feature-flag), each with **measured** blast radius
(file lists, LOC, schema implications, test deltas) instead of estimates. It also
closes a sub-question seeded in the dispatch prompt: are there orphan schema types in
`schemas/` that would need cleanup under Option A?

## Actions Taken

1. `wc -l` on all 6 `lib/promotion/*.ts` modules (635 LOC total).
2. `wc -l` on the two promotion test files (316 + 127 = 443 LOC).
3. `grep -rn "from.*lib/promotion"` across `mcp_server/skill-advisor/` excluding
   `dist/` and `tests/` to locate production callers — **discovered 3 bench scripts
   that import `runShadowCycle`**, contradicting iter-010 F52's "zero callers" framing.
4. `grep -rn "promotion-cycle"` across same scope to locate schema importers
   (5 production files + 1 test).
5. `grep -rn "derived_tier\|derivedTier"` across same scope — **zero hits**, the
   `derived_tier` schema concept named in the dispatch prompt does not exist in
   production code.
6. Listed all 8 exports of `schemas/promotion-cycle.ts` and confirmed none are imported
   by anything outside `lib/promotion/`, the bench scripts, or the promotion test
   file → no orphans elsewhere; the schema **is** the orphan.
7. `find -name 'promotion-orchestrate*'` — **handler skeleton from iter 11 F57 was
   never created** (proposal stayed conceptual).

## Findings

### F37-CLOSURE — Decision Memo: Delete vs Wire-up vs Partial

**Background facts (measured, not estimated):**

| Item | Value | Source |
|------|-------|--------|
| Promotion modules | 6 files, **635 LOC** | `wc -l` `lib/promotion/*.ts` |
| Promotion tests | 2 files, **443 LOC** (316 in `tests/promotion/promotion-gates.vitest.ts` + 127 in `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts`) | `wc -l` |
| Schema | 1 file, **82 LOC**, 8 exports (3 schemas as `*Schema`, 5 derived types) | `wc -l` + `grep '^export'` |
| Production runtime callers | **0** in `handlers/`, advisor pipeline, or hook surfaces | grep, confirmed iter-010 F52 |
| Bench-script callers | **3** — `corpus-bench.ts`, `safety-bench.ts`, `holdout-bench.ts` all import `runShadowCycle` from `shadow-cycle.js` and 2 of them also import `PromotionCorpusCase`/`PromotionWeights` types | grep `from.*lib/promotion` |
| Wire-listing in `package.json` scripts | None (benches not invoked from `npm run` scripts in `mcp_server/`) | grep `corpus-bench\|safety-bench\|holdout-bench` in `*.json` |
| `handlers/promotion-orchestrate.ts` | **does not exist** (iter-11 F57 was a skeleton proposal, never written) | `find` |
| `derived_tier` / `derivedTier` references | **0** anywhere in skill-advisor source | grep |

The prompt's premise "remove `derived_tier` from registry schema" is **not actionable**
— that field doesn't exist. The actual schema-level cost of Option A is the entire
`schemas/promotion-cycle.ts` (82 LOC, 8 exports), not a single field.

The prompt's premise "zero production callers" is **partially false** — it's true for
the runtime/handler surface but the **3 bench scripts ARE production callers** in the
sense that they exercise the promotion code, validate corpus quality, and would break
if `lib/promotion/` were deleted. They are not test files (no `.vitest.ts` extension,
not in `tests/` dir, not invoked by Vitest); they are standalone executables intended
to be run during evaluation cycles.

This re-frames the three options below — Option A is bigger than the prompt assumed
(it must also delete or rewrite the benches), and Option B's "zero baseline" assumption
is also wrong (there is a partial callsite already, just at the bench layer not the
handler layer).

---

#### Option A: Delete

**Blast radius (files):**
- DELETE: 6 files in `lib/promotion/` (635 LOC)
- DELETE: 1 file `schemas/promotion-cycle.ts` (82 LOC, 8 exports)
- DELETE: 2 test files (443 LOC) in `tests/promotion/promotion-gates.vitest.ts` and
  `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts`
- DELETE or REWRITE: 3 bench files
  (`bench/corpus-bench.ts`, `bench/safety-bench.ts`, `bench/holdout-bench.ts`) — each
  imports `runShadowCycle` and 2 import the schema types. If benches are also obsolete
  (likely if there's no production promotion pipeline to bench), delete them
  (~ unmeasured LOC, but the imports are 1-2 lines each at the top).
- DELETE: corresponding `dist/` build artifacts (regenerated on next build, no
  source-control delete needed)

**Total source LOC delta:** **−1,160 LOC minimum** (635 + 82 + 443 = 1,160), plus
unmeasured bench LOC. Closer to **−1,400 LOC** if benches are deleted entirely.

**Schema implications:**
- `schemas/promotion-cycle.ts` is **fully orphaned outside the promotion subsystem** —
  no other schema, handler, or hook imports `PromotionLane`, `PromotionWeights`,
  `PromotionCorpusCase`, `PromotionPerPromptMatch`, `ShadowCycleResult`,
  `PromotionGateResult`, `PromotionGateBundleResult`, or any of the 3 `*Schema` zod
  exports. Safe to delete entirely.
- No `derived_tier` field exists in registry schema (prompt premise corrected). No
  registry-schema mutation needed.

**Test implications:**
- Delete `promotion-gates.vitest.ts` (316 LOC) — pure unit tests of gate-bundle behavior
- Delete `promotion-positive-validation-semantics.vitest.ts` (127 LOC) — semantic-lock
  unit tests
- No integration tests exist that would break
- No regression risk to the rest of the suite (zero cross-imports)

**Risk:** If the spec downstream (or any future iter ≥ 14) rediscovers the need for
gated promotion with shadow-cycles and rebuilds it elsewhere, we lose 635+82=717 LOC
of design intent. **Mitigation:** the iter-12 12-gate matrix is the design artifact.
Delete the code but keep the matrix in research output as a recipe for re-implementation
if needed. The matrix is more valuable than the dead code because it documents what
the gates *should* catch (and where each leaks), independent of whether they're wired.

**Benefit:**
- Removes 1,160-1,400 LOC of dead code (≈14% of skill-advisor source by rough proportion)
- Eliminates spec-vs-reality drift permanently — prevents future audits from re-finding
  the same dead-code finding
- Removes the temptation for the next contributor to "wire it up" without revisiting
  whether the gates are still appropriate
- Reduces test surface (443 LOC of tests that exercise nothing in the production path
  still consume CI time)

**Confidence:** HIGH — measured blast radius, no field references, no orphans
elsewhere. The corpus-bench/safety-bench/holdout-bench coupling is the only nuance,
and the right answer is "delete those too" since they bench code that has no production
callers anyway.

---

#### Option B: Wire up

**Blast radius (files):**
- CREATE: `handlers/promotion-orchestrate.ts` (per iter-11 F57 sketch, est. 150-250 LOC)
- MODIFY: advisor entry point or scheduler to invoke the orchestrator (1-2 sites,
  unmeasured but small — likely `cli.ts` and/or `mcp-server.ts`)
- CREATE: integration test at orchestrator layer (est. 200-300 LOC for a meaningful
  "candidate weights → shadow cycle → gate bundle → promotion decision" test)
- MODIFY: telemetry — add emission for `promotion-decision`, `gate-bundle-result`, and
  `rollback-event` (est. 30-50 LOC across telemetry helpers)
- KEEP: 6 modules + 82 LOC schema + 443 LOC tests (no deletions)
- ADD: at least the iter-12 enhancements that close Cat A/B/C leaks (variance gates,
  L2 weight-delta-cap actually called from gate-bundle, fail-closed missing-baseline,
  etc. — est. 100-200 LOC)

**Total source LOC delta:** **+480 to +800 LOC net** added across handlers, integration
tests, telemetry, and gate enhancements. No deletions.

**Schema implications:**
- `schemas/promotion-cycle.ts` stays. If telemetry emission is added, may need a new
  schema for the audit-artifact JSON written by `gate-bundle.ts` (currently typed
  inline at lines 70-75 of the gate-bundle module).
- May want to add `baselineUnknownCount` to `PromotionGateBundleInput.fullCorpus`
  per iter-12 gate-3 enhancement.

**Test implications:**
- Keep both existing test files (443 LOC)
- Add 200-300 LOC integration test
- Add new unit tests for variance-stability gates, L2-delta gate, fail-closed paths
  (est. 150-250 LOC)
- **Total test LOC after: ≈ 800-1,000 LOC** (+ ~360-560 over current)

**Risk:**
- Iter-12 documented that the 12 gates have material category leaks (Cat A no L2 vector
  check, Cat B no per-skill variance, Cat C no rollback-effectiveness gate, magnitude-
  blind boolean gates at #6/#7/#8). Wiring up *now* installs a safety net with known
  holes that will produce false-PASS verdicts on the very regression categories iter-3
  identified (oscillating skills, correlated micro-perturbations, silent
  cache-invalidation failures).
- Mitigation requires implementing the iter-12 enhancements *before* wiring, which
  expands scope to ~+800 LOC and pushes the scope boundary of this packet.
- Ongoing maintenance: 12 gates × constants/thresholds × evolving advisor pipeline =
  drift surface. Every advisor pipeline change must be re-validated against gates.

**Benefit:**
- The 12-gate safety net becomes real (after enhancements)
- Iter-12 F15 leakage categories get addressed in code, not just in research artifacts
- Future contributors get a working promotion pipeline they can extend rather than
  dead modules they have to interpret
- Telemetry emission unlocks longitudinal analysis of weight-update behavior

**Confidence:** MEDIUM — handler skeleton was sketched (iter-11 F57) but never
written; LOC estimates are first-order; iter-12 enhancements are designed but not
costed. The "wire-up" path is materially larger than the dispatch prompt's framing
("implement seam + telemetry + integration test") suggested, because the gates have
known holes that need fixing first.

---

#### Option C: Partial — Ship behind feature flag, shadow-metrics only

**Blast radius (files):**
- CREATE: `handlers/promotion-orchestrate.ts` (est. 100-150 LOC — simpler than Option
  B because it only emits metrics, doesn't actuate weight updates)
- MODIFY: 1 entry point to read `SKILL_ADVISOR_PROMOTION_MODE` env var
  (`shadow|enforce|disabled`, default `disabled`)
- CREATE: shadow-metrics emission path (est. 50-80 LOC) — runs the gate bundle on
  every advisor cycle but only logs PASS/FAIL counts to telemetry, never blocks
- KEEP: 6 modules + 82 LOC schema + 443 LOC tests
- ADD: integration test in `shadow` mode only (est. 100-150 LOC)
- DEFER: iter-12 enhancements (variance gates, L2 vector check, fail-closed) —
  acceptable in shadow mode because no decisions are gated on the (potentially leaky)
  results
- DEFER: full bench wiring upgrade

**Total source LOC delta:** **+250 to +380 LOC net** (smaller than Option B because
fewer enhancements ship)

**Schema implications:**
- Keep `schemas/promotion-cycle.ts`. Add `PromotionMode` enum
  (`shadow|enforce|disabled`) with default `disabled`. Add a telemetry-only schema for
  the shadow report (est. 15-20 LOC).

**Test implications:**
- Keep all 443 LOC of existing tests
- Add 100-150 LOC integration test in shadow mode
- **Total test LOC after: ≈ 590 LOC** (+150 over current)

**Risk:**
- Indefinite "shadow forever" outcome — once shipped behind a flag with default
  `disabled`, the path to actually enforcing is non-trivial (need to validate gates
  don't false-fail, deal with iter-12 leaks, get sign-off on first enforcement
  cycle). The "ship and forget" failure mode means the leak categories never get
  closed and the code remains de-facto dead but with telemetry overhead.
- False sense of progress: "we shipped the gate bundle" is true but in `disabled`
  mode it's still doing nothing.
- Telemetry noise: shadow-mode false PASSes (Cat A/B/C leaks) will appear as PASS in
  telemetry, which can be misread as "gates work."

**Benefit:**
- Lowest immediate risk — no production behavior change
- Generates real-world data on gate-bundle behavior to inform whether iter-12
  enhancements are needed in practice
- Forward-compatible: if enhancements ship later, the wiring is already there
- Reversible — flip flag back to `disabled` if shadow data shows unexpected behavior
- Smallest scope expansion of the three options if shipped strictly as shadow-only

**Confidence:** MEDIUM-LOW — depends entirely on follow-through to enforce mode. If
the next 1-2 iterations don't promote shadow → enforce, this is functionally Option B
with extra telemetry overhead and zero teeth.

---

### Recommendation

**Option A (Delete) is the highest-EV choice given the evidence:**

1. The 12-gate matrix from iter-12 documents the *design intent* of the safety net,
   line by line, with each leak category called out. That artifact is more valuable
   than 1,160 LOC of code that doesn't run, because it can be re-implemented later if
   needed without re-discovering the design.
2. Option B's hidden cost (iter-12 enhancements must ship together, +800 LOC scope
   creep, packet-boundary risk) was not visible in the dispatch prompt and is
   material.
3. Option C's "shadow forever" failure mode is the most likely outcome given that no
   downstream packet has scheduled the enforcement cutover, and shadow telemetry on a
   gate bundle with documented leaks is misleading rather than informative.
4. Bench scripts exist but don't appear to be wired into CI/`package.json` — they're
   standalone executables for ad-hoc evaluation. Deleting them with the rest of the
   subsystem has no cascade.
5. Re-implementation cost (if needed) is bounded: the 12-gate matrix + the schema
   exports list + this packet's research output is sufficient input to rebuild from
   scratch in ≈1 sprint, whereas the cost of *maintaining* dead code grows
   monotonically.

**If A is rejected on stakeholder grounds, the second-best is C with a hard cutover
date** — ship `shadow` mode with a calendar deadline (≤2 weeks) to flip to `enforce`,
during which the iter-12 enhancements MUST be implemented. Without the deadline, C
degenerates to Option B-without-teeth.

**Reject Option B as posed** — it understates scope by ignoring the iter-12 leak
categories that would need fixing before wiring is safe.

### F60 — Bench Scripts Are Hidden Production Coupling (revises iter-10 F52)

Iter-10 F52 reported "zero production callers" of `lib/promotion/`. That was correct
for the runtime/handler surface but **false at the bench layer**:

- `bench/corpus-bench.ts:9` imports `runShadowCycle` from `lib/promotion/shadow-cycle.js`
- `bench/safety-bench.ts:9` imports same
- `bench/holdout-bench.ts:9` imports same
- 2 of the 3 also import `PromotionCorpusCase` and `PromotionWeights` types from
  `schemas/promotion-cycle.js`

These benches do not run in the test suite (no `.vitest.ts` extension, not in
`tests/`) and are not invoked from `package.json` scripts in `mcp_server/`. They appear
to be standalone evaluation harnesses. This revises F52: the correct framing is
**"zero runtime/handler callers, three bench-layer callers, and the bench layer is
itself unwired into CI."** Under Option A, deleting them costs nothing because they're
also dead at the harness level. Under Option B/C, they're coupled to whatever
shadow-cycle interface ships.

### F61 — `derived_tier` Schema Concept Doesn't Exist (corrects dispatch prompt)

The dispatch prompt's "remove `derived_tier` from registry schema" instruction is not
actionable. `grep -rn "derived_tier\|derivedTier"` across the entire skill-advisor
source returns zero matches. The actual schema deletion cost of Option A is the entire
`schemas/promotion-cycle.ts` (82 LOC, 8 exports), not a single field.

This likely traces to confusion between this packet's promotion subsystem and a
separate `derived_tier` field that exists in some other registry (possibly the memory
system's tier classification). Either way: no registry-schema mutation is required by
Option A.

### F62 — `handlers/promotion-orchestrate.ts` Was Never Materialized

Iter-11 F57 sketched the handler seam as a forward proposal. `find` confirms no file
of that name exists. Option B's scope therefore includes file *creation*, not
*modification* — which slightly increases its size but means there's no existing
half-built code to consider as sunk cost.

## Ruled Out

- "Wire-up is cheap because we already have the modules" framing — measured cost is
  +480 to +800 LOC including the iter-12 enhancements that *must* ship together to
  avoid installing a safety net with known holes.
- Shadow-mode-by-default-forever — Option C without a hard cutover deadline
  degenerates to Option B with telemetry overhead and zero enforcement, which is the
  worst of all three.
- "Zero callers" framing from iter-10 F52 — partial truth, missed bench-layer
  coupling. Corrected in F60.
- Removing `derived_tier` field — not actionable, field doesn't exist (F61).

## Dead Ends

None this iteration — the dispatch prompt was scoped and execution stayed on the
documented path.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts` (185 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts` (87 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts` (39 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts` (203 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts` (50 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/weight-delta-cap.ts` (72 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/promotion-cycle.ts` (82 LOC, 8 exports)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts` (316 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` (127 LOC)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/corpus-bench.ts:9-10` (callsite of runShadowCycle)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/safety-bench.ts:9-10` (callsite)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/holdout-bench.ts:9-10` (callsite)
- Iter-12 12-gate matrix (this packet, `iterations/iteration-012.md` lines 39-52)
- Iter-11 F57 handler seam proposal (this packet, `iterations/iteration-011.md`)
- Iter-10 F52 zero-callers finding (this packet, `iterations/iteration-010.md`)

## Assessment

- **New information ratio:** 0.40
  - F37-CLOSURE memo: fully new this packet (decision artifact, not just data)
  - F60 bench-layer coupling: fully new — corrects iter-10 F52, was not visible
    before because prior grep excluded `bench/`
  - F61 `derived_tier` non-existence: fully new — closes a dispatch-prompt premise
  - F62 handler-skeleton-not-materialized: fully new
  - Background facts table (LOC counts, schema export counts): partially new — some
    were known approximate, now exact
- **Questions addressed:** F37 #7 disposition (delete-vs-wire); orphan schema types
  question (no orphans elsewhere — schema *is* the orphan); bench coupling status
- **Questions answered:** F37 #7 → recommend Delete (Option A); orphan question →
  none outside `lib/promotion/`+benches+tests; `derived_tier` → does not exist

## Reflection

- **What worked and why:** Going to measured LOC and grep evidence first before
  drafting the memo prevented restating the dispatch prompt's premises as facts.
  Two of those premises (zero callers, `derived_tier` existence) turned out to be
  partially or wholly wrong, and catching that *before* writing the recommendation
  changed the analysis materially. The 6-tool budget was sufficient because each
  tool call answered a specific structural question (LOC, callers, schema deps,
  derived_tier search, handler existence, schema exports).
- **What did not work and why:** Nothing this iteration — the path was constrained
  by the dispatch prompt and execution stayed scoped.
- **What I would do differently:** If a future iteration revisits F37 #7, run the
  bench-coupling grep first, before the runtime-callers grep, because the bench layer
  is the more interesting structural finding. Iter-10's grep scope (excluding bench/)
  was the reason F60 took until iter-13 to surface.

## Recommended Next Focus

Per dispatch context, this is iter 13 of 20 with ratios 0.50 → 0.55 → 0.65 trending
upward. Suggested iter-14 focus options ranked by EV:

1. **F37 #7 actuation** — pick Option A/B/C (default A per this memo), generate the
   concrete delete patch (file list + git mv/rm commands + test removals), and put
   the diff into a `deltas/iter-014-actuation.diff` artifact. Closes F37 #7
   completely instead of just deciding it. **HIGH EV — closes the longest-standing
   dead-code finding.**
2. **F60 bench-layer audit** — apply the same delete-vs-wire framing to the 3 bench
   scripts independently. Are *they* in spec? Wired into anything? If not, are there
   other bench scripts in the same dir with similar dead-coupling patterns? Could
   uncover an F60-cluster.
3. **F15 secondary — gate-bundle leak categories** — pick one of the iter-12 enhancements
   (Cat A: L2-vector check, Cat B: variance gate, Cat C: rollback-effectiveness gate)
   and write the concrete patch. Useful only if Option B or C wins; wasted work if
   Option A wins. Defer until F37 #7 actuation completes.
4. **Cross-packet check** — is there a sibling packet (016/017/018) that has its own
   promotion subsystem the spec might intend this one to replace? `find` for
   `*/promotion/*.ts` outside this packet to detect overlap. **Useful as risk check
   for Option A** before the delete diff is generated.

Default recommendation: **iter-14 = F37 #7 actuation patch (Option A delete diff)
with iter-13 cross-packet check as a 2-tool preflight inside iter-14.**
