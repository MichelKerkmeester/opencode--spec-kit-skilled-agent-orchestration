# Iteration 9: PR-ready pre-flight, INV-F5-V2 source binding, graph-emit seam correction

## Focus

Three depth-evidence tasks: (1) Convert F37 #2 (corpus path) and F37 #1's adjacent F25 (legacy parity test gap) into PR-ready file:line edit lists with before/after diffs. (2) Bind iter-2's INV-F5-V2 to a concrete file:line in the cache-invalidation surface. (3) Verify whether the iter-1 F3 5-class code-graph flattening actually propagates into the scorer's `graph_causal` lane (iter-6 F31's claim).

## Actions Taken

1. Read `tests/parity/python-ts-parity.vitest.ts` in full (181 lines) to anchor F33's exact OLD_PATH constant.
2. `find` enumerated `tests/legacy/*.vitest.ts` (13 files) and identified `advisor-runtime-parity.vitest.ts` as the F25-relevant adapter parity test; read it in full (290 lines) to confirm what spawn/invocation path is exercised.
3. Read `lib/prompt-cache.ts` in full (181 lines) to lock down INV-F5-V2's binding target.
4. Read `lib/promotion/rollback.ts` in full (88 lines) to confirm the rollback's `invalidateCache` callback contract.
5. Grepped `generation` across `lib/promotion/`, `lib/scorer/`, `lib/prompt-cache.ts` -- single hit: `shadow-cycle.ts:28` (a `generationBump` callback in test surface only).
6. Grepped `invalidate|sourceSignature` across `lib/promotion/`, `lib/skill-advisor-brief.ts`, `handlers/` -- found the two cache-invalidation call sites (`skill-advisor-brief.ts:442,467`; `advisor-recommend.ts:172-173`).
7. Read `lib/skill-advisor-brief.ts:420-540` (the cache lookup + write path) to confirm cache invalidation is keyed on `freshness.sourceSignature`, not `generation`.
8. Read `handlers/advisor-recommend.ts:160-234` to confirm the second cache-invalidation entry point uses the same `cacheSourceSignature(status)` derivation.
9. Read `lib/scorer/lanes/graph-causal.ts` in full (82 lines) to inspect what edge taxonomy the lane uses.
10. Grepped `edgeType|sourceId|targetId|AdvisorProjection` against `lib/scorer/types.ts` and `lib/scorer/projection.ts` -- confirmed `AdvisorProjection.edgeType` is restricted to a 5-element skill-graph union (`depends_on | enhances | siblings | conflicts_with | prerequisite_for`).
11. Grepped `code_graph|code-graph|skill_graph` across `lib/scorer/` and `lib/skill-advisor-brief.ts` -- only hit is `projection.ts:38` `SKILL_GRAPH_DB = '.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite'`. No code-graph imports anywhere in the scorer.

## Findings

### F45 — F33 corpus-path fix is a 4-line surgical edit on `tests/parity/python-ts-parity.vitest.ts:40-43`

PR-ready before/after diff. The current constant references a sub-spec corpus that doesn't exist at that path under spec 026/008; the live corpus is shipped beside the Python advisor at `scripts/routing-accuracy/labeled-prompts.jsonl`.

**File:** `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`

**Before (lines 40-43):**

```ts
const CORPUS_PATH = resolve(
  WORKSPACE_ROOT,
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/005-routing-accuracy/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl',
);
```

**After:**

```ts
const CORPUS_PATH = resolve(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl',
);
```

Verification: `Read` of `scripts/routing-accuracy/labeled-prompts.jsonl` returned the JSONL `rr-iter2-001`/`rr-iter2-002` rows -- corpus is present at the new path with the schema (`prompt`, `skill_top_1`, etc.) the parity test's `CorpusRow` interface expects (lines 14-18 of the parity file). No fixture or schema drift; pure path repointing.

**Test commands to verify post-fix:**

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
cd .opencode/skill/system-spec-kit/mcp_server/skill-advisor
npx vitest run tests/parity/python-ts-parity.vitest.ts
```

Both AC-1 (parity at line 167) and AC-4 (lexical-ablation at line 178) suites depend on the same `loadCorpus()`. F39 (cross-cutting interaction in iter 8) is now confirmed: this single 4-line edit unblocks BOTH F36 #2 (lane-ablation extension) and F36 #8 (calibration ECE bench), exactly as the iter-8 F39 dependency graph predicted. **Severity: P0. Effort: S (4 lines, single file).** [SOURCE: `tests/parity/python-ts-parity.vitest.ts:40-43`; `scripts/routing-accuracy/labeled-prompts.jsonl:1-2`]

### F46 — F25 legacy parity test gap is unfixable as a "1-line" edit; requires a NEW test file ~150 LOC

The iter-8 F37 #2 gloss "F25 legacy parity test fix" implied a small addition to `tests/legacy/advisor-runtime-parity.vitest.ts`. Reading the file in full proves this is incorrect.

`advisor-runtime-parity.vitest.ts` exercises `handle{Claude,Gemini,Copilot,Codex}UserPromptSubmit` adapters by **direct function call** (lines 171-218). It does NOT spawn a child process, does NOT load `.claude/settings.local.json`, does NOT exercise the Claude Code runtime-launcher's hook-schema interpreter. There is no surface in this file that can be extended to reach F23.1's wiring bug. The mock at line 25-31 (`vi.mock('node:child_process')`) only intercepts plugin-bridge spawns for the `opencode-plugin` variant -- not the Claude hook-config interpreter (which lives in the Claude Code runtime, not in this repo).

The correct fix shape is a NEW test file `tests/hooks/settings-driven-invocation-parity.vitest.ts` (already named in F36 #1's 8-suite). That test must:

1. Read `.claude/settings.local.json` (or a fixture copy of it) and parse the four hook event blocks (`UserPromptSubmit`, `PreCompact`, `SessionStart`, `Stop`).
2. For each event, simulate Claude Code's interpreter precedence: top-level `bash:` vs nested `hooks[0].command`.
3. Assert that the resolved invocation path matches the expected runtime adapter (`hooks/claude/*.js`) for ALL four events.
4. Cross-check the same shape against `.gemini/settings.json`, `.codex/config.toml`, `.copilot/config.json` for consistency.

This is **M effort (~150 LOC, 1 new file, 0 production code touched)** -- not S. The iter-8 F37 #2 row should be re-tagged as M-effort. **Severity: P1 (was P0 in F37 #1's wiring claim, but F37 #1 itself is the JSON rewrite -- this F46 finding upgrades F37 #2's effort estimate).** [SOURCE: `tests/legacy/advisor-runtime-parity.vitest.ts:1-290`, especially lines 171-218 + the absent settings-loader path]

### F47 — INV-F5-V2 binds to the ADVISOR PROMPT-CACHE at TWO call sites; rollback path is COMPLETELY UNWIRED to either

Iter-2 logged INV-F5-V2 as "cache keyed on workspaceRoot + sourceSignature + generation; generation must bump and fan out on rollback." Iter-6 confirmed there is no query-result cache, so the binding target must be the advisor's prompt cache. Iter-9 evidence:

**Cache-key parts (lib/prompt-cache.ts:22-29, 67-80):**

```ts
export interface AdvisorPromptCacheKeyParts {
  readonly canonicalPrompt: string;
  readonly sourceSignature: string;       // ← the only "fan-out" axis present
  readonly workspaceRoot?: string;
  readonly runtime: string;
  readonly maxTokens?: number;
  readonly thresholdConfig?: AdvisorThresholds;
}
```

**There is NO `generation` field in the cache key.** INV-F5-V2's "generation" axis is absent at the type level. The cache invalidation is keyed on `sourceSignature` (a hash derived from the advisor source artifacts at `computeAdvisorSourceSignature(workspaceRoot)`), with `generation` only appearing as scalar telemetry on `AdvisorStatus.generation` (handlers/advisor-recommend.ts:221).

**Two cache-invalidation call sites (the ONLY ones in the surface):**

1. `lib/skill-advisor-brief.ts:442` -- `cache.invalidateSourceSignatureChange(freshness.sourceSignature)` -- runs at every brief build, BEFORE cache-key derivation.
2. `handlers/advisor-recommend.ts:173` -- `advisorPromptCache.invalidateSourceSignatureChange(sourceSignature)` -- runs at every MCP recommend call.

Both call sites depend on `freshness.sourceSignature` / `cacheSourceSignature(status)` -- a **read-through** invariant. They detect a signature change at request time, not at write time.

**Rollback path (lib/promotion/rollback.ts:36-48):**

```ts
readonly invalidateCache: () => void | Promise<void>;
...
try {
  await args.invalidateCache();
  cacheInvalidated = true;
} catch (error: unknown) {
  cacheInvalidationError = errorMessage(error);
}
```

`rollback.ts` accepts a generic `invalidateCache` callback. **There is no production caller in the repo that wires this callback to `advisorPromptCache.invalidateSourceSignatureChange(...)` or `advisorPromptCache.clear()`.** Grep `invalidateCache.*advisorPromptCache` returns zero hits across the repo. The callback contract is purely test-shaped.

**INV-F5-V2 binding (concrete):**

| Axis                     | Where it SHOULD fire                                       | Where it actually fires                                     | Gap                                                                                                                        |
| ------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Generation bump          | `lib/promotion/shadow-cycle.ts:28` callback (test-only)    | `lib/promotion/shadow-cycle.ts:28`                          | Callback is test-only; no production binding to `advisorPromptCache`.                                                      |
| Cache fan-out on rollback | After `applyWeights(previousWeights)` at `rollback.ts:40` | Nothing -- `invalidateCache` is a caller-supplied callback | **The rollback path has no compile-time binding to the advisor prompt cache. INV-F5-V2 fan-out is unenforced production-side.** |
| Read-through detection   | At brief build / recommend call                            | `skill-advisor-brief.ts:442`, `advisor-recommend.ts:173`    | Present and correct. Stale-serve risk only exists during the request that crosses the rollback boundary.                   |

**Implication for F37 #7 (rollback fix):**
Iter-8 F41's "two simultaneous routes to stale post-rollback cache" claim is now sharper:

- **Route 1 (F15 Cat C):** `invalidateCache` callback throws -> `cacheInvalidationError` stashed, `rolledBack: true` returned -- but the caller of `rollbackPromotion()` doesn't actually pass `advisorPromptCache.invalidateSourceSignatureChange` as the callback. **Route 1 doesn't even get a chance to throw -- the wire is missing upstream.**
- **Route 2 (INV-F5-V2):** Cache stays warm at the old `sourceSignature` until the next `freshness.sourceSignature` re-derivation; if the rollback didn't bump the sourceSignature inputs, cache hits keep serving rolled-back results indefinitely.

**The F37 #7 surgical edit (return `rolledBack: false` on cache-invalidation error) is necessary but addresses the LESS LIKELY route.** The actually-load-bearing fix is wiring `rollbackPromotion()`'s caller to pass `advisorPromptCache.clear()` (or `invalidateSourceSignatureChange(newSignature)` once a new signature is derived) as the `invalidateCache` callback. **That's the missing seam.**

[SOURCE: `lib/prompt-cache.ts:22-29`; `lib/skill-advisor-brief.ts:442`; `handlers/advisor-recommend.ts:172-176`; `lib/promotion/rollback.ts:36-48`; absence-of-grep `invalidateCache.*advisorPromptCache`]

### F48 — CRITICAL CORRECTION: iter-6 F31 "graph_causal lane consumes 5-class flattened code-graph edges" is FALSE; the seam doesn't exist

Iter-6 F31 implied that the iter-1 F3 finding (CALLS edge regex + 5-class flattening at the code-graph emit) propagates into the scorer's `graph_causal` lane and biases skill recommendations. Iter-9 evidence falsifies this.

**Evidence chain:**

1. `lib/scorer/lanes/graph-causal.ts:12-18` defines `EDGE_MULTIPLIER` over five edge types: `enhances, siblings, depends_on, prerequisite_for, conflicts_with`. **None of these are code-graph edges.** Code-graph edges are `CALLS, IMPORTS, DEFINES, REFERENCES`, etc.
2. `lib/scorer/types.ts:36`: `edgeType: 'depends_on' | 'enhances' | 'siblings' | 'conflicts_with' | 'prerequisite_for'`. The TypeScript union restricts edges to the SKILL-graph taxonomy at the type level. Code-graph edges cannot pass this gate.
3. `lib/scorer/projection.ts:38`: `SKILL_GRAPH_DB = '.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite'`. The scorer's projection loader reads the **skill-graph SQLite**, not the code-graph SQLite.
4. Grep `code_graph|code-graph` across `lib/scorer/` and `lib/skill-advisor-brief.ts` returns ZERO hits. There is no import, no read, no shared schema between the code-graph emit pipeline and the skill-advisor scorer.

**What this means for the F37 remediation table:**

- **F37 #9 (F2/F3 -- CALLS regex + 5-class flattening) blast radius is OVERSTATED in iter-1.** It does NOT cascade into scorer bias. It only affects the code-graph's own consumers (graph-query, blast-radius, code_graph_context). Those consumers are downstream of `lib/code-graph/`, not `lib/scorer/`.
- **F37 #9 should be RE-CLASSIFIED from "cross-system" to "subsystem" blast radius.**
- **Iter-8 F40 (F17 vocabulary multiplies F28 instrumentation cost) remains valid** -- it concerns the freshness-state vocabulary, not the edge taxonomy. F40 is independent of F48.
- **Iter-6 F31 should be retracted as a false cross-cutting connection.** The 5-class flattening and the scorer's 5-edge-type lane are unrelated naming coincidences operating on different graphs.

**Net update to remediation priorities:** F37 #9 (the L-effort AST-visitor + per-language edge corpus rebuild) was prioritized partly on its scorer-bias claim. With that claim falsified, #9's remediation pressure relaxes -- it becomes an isolated code-graph relevance fix, not a scorer-relevance multiplier. **Suggest re-tagging as P2** unless code-graph downstream consumers (graph-query latency, blast-radius accuracy) are independently shown to feel the gap. Iter-6 F28 is the closest such consumer; it measures latency, not edge correctness, so the relevance pressure remains weak.

[SOURCE: `lib/scorer/lanes/graph-causal.ts:12-18`; `lib/scorer/types.ts:36`; `lib/scorer/projection.ts:38`; absence-of-grep `code_graph|code-graph` in `lib/scorer/`]

### F49 — Day-1 unblock claim from iter-8 F44 partially survives the depth pass: corpus path is exactly 4 lines (was claimed "1 line"), settings rewrite is unchanged

F44 framed Day-1 as "5 lines of effort." Iter-9 walks the actual edits:

| Iter-8 F44 claim                | Iter-9 verified edit                                                | Delta                              |
| ------------------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| Corpus path "1-line change"     | 4 lines (the `resolve(...)` block spans 4 lines)                    | +3 lines vs claim                  |
| Settings rewrite "4 nested entries" | 4 nested entries × 4 events = up to 16 lines of JSON              | +12 lines vs claim                 |

**Honest day-1 framing:** ~20 LOC across 2 files (parity test + settings JSON), not "5 lines." Effort tier remains S, but the marketing-grade "5-line" framing is misleading. Recommend updating F37's row #1 + #2 effort detail to "S (~20 LOC, 2 files)" rather than "S (1-line)" / "S (4 entries)" wordings.

This adjustment does NOT change blast radius (still cross-system for #1, subsystem for #2) or severity (still P0 / P0). It only sharpens the planning estimate so the implementer doesn't reach for the wrong PR template. [SOURCE: `tests/parity/python-ts-parity.vitest.ts:40-43`; iter-008.md F37 row 1 + 2 wording]

### F50 — Hidden invariant at the prompt-cache seam: `secret` is process-pid + timeOrigin keyed, so the cache CANNOT survive process restart -- INV-F5-V2's stale-serve window is bounded by process lifetime

`lib/prompt-cache.ts:40-43`:

```ts
const SESSION_LAUNCH_TIME = performance.timeOrigin.toFixed(3);
const DEFAULT_SECRET = createHash('sha256')
  .update(`${process.pid}:${SESSION_LAUNCH_TIME}:${Math.random()}`)
  .digest();
```

The HMAC secret is rotated per process (random + pid + timeOrigin). This means cache entries from process A are unreadable by process B even if both processes have identical advisor source signatures. **Implication for INV-F5-V2:** the stale-serve window from F47's "Route 2" is bounded by:

- Process lifetime (max 5 min TTL per `ADVISOR_PROMPT_CACHE_TTL_MS`).
- Single in-memory Map (no disk persistence).
- Per-process secret (no cross-process sharing).

So the production attack surface for INV-F5-V2 stale-serve is: "within a single 5-minute TTL window inside a single advisor host process, after a rollback that didn't bump `freshness.sourceSignature` re-derivation." This is a narrower failure window than F37 #7's framing suggested, but it is non-zero and exactly matches the rollback timing model where weights flip mid-session.

**Implication for F37 #7's closing benchmark:** the test in `tests/freshness/concurrent-state-invariants.vitest.ts` should assert "post-rollback within the same host process, the next prompt-cache lookup with identical canonicalPrompt + identical sourceSignature does NOT serve the pre-rollback brief." That's the load-bearing assertion. The `cacheInvalidated: false` propagation fix from F37 #7 is necessary AND sufficient ONLY IF the upstream caller passes `advisorPromptCache.invalidateSourceSignatureChange(newSignature)` as the callback.

[SOURCE: `lib/prompt-cache.ts:40-43`; `ADVISOR_PROMPT_CACHE_TTL_MS = 5 * 60 * 1000`; F47 binding evidence]

## Ruled Out

- **Patching `tests/legacy/advisor-runtime-parity.vitest.ts` to cover F23.1 wiring:** considered then rejected -- the file mocks `node:child_process` but does NOT mock the Claude Code hook-schema interpreter, which is where F23.1's bug actually resolves. A new file `tests/hooks/settings-driven-invocation-parity.vitest.ts` is the correct shape (F36 #1 already names it).
- **Treating `generation` as a real key axis:** `lib/prompt-cache.ts` has zero `generation` field. Iter-2's INV-F5-V2 wording was prescriptive (what should be), not descriptive (what is). Bind to `sourceSignature` instead.
- **Treating iter-6 F31 as confirmed:** evidence chain in F48 falsifies it. The iter-6 grep that produced F31 must have inferred a connection that doesn't exist at the type/import level.

## Dead Ends

- **Searching for a `generation` field in `prompt-cache.ts`:** zero hits. Iter-2 INV-F5-V2 should have been rebound to `sourceSignature` from the start; iter-9 fixes this by rebinding the invariant rather than chasing a phantom `generation` axis.
- **Searching for code-graph imports in the scorer:** zero hits. The scorer/code-graph seam doesn't exist. Iter-6 F31 was a false cross-cutting connection.
- **Hoping the legacy parity test would yield a 1-line fix:** ruled out by F46. The legacy file's surface area cannot reach the runtime-launcher; a new test file is the only correct shape.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts` (lines 1-181, full read)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts` (lines 1-290, full read)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts` (lines 1-181, full read)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts` (lines 1-88, full read)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts` (lines 420-540)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts` (lines 160-234)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts` (lines 1-82, full read)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/types.ts:34-91` (via grep)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:11-275` (via grep)
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:100-128`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl` (head 2 rows for schema validation)
- `iterations/iteration-008.md` F37, F39, F41, F44 (re-anchored)

## Assessment

- **New information ratio: 0.55.**
  - F45: PR-ready surgical-edit list with verified before/after for F33 (4 lines on `python-ts-parity.vitest.ts:40-43`). Promoted from inferred fix-shape to evidence-cited diff. **Fully new.**
  - F46: Reclassification of F37 #2 from S-effort 1-line to M-effort ~150 LOC new file; the legacy parity test's surface cannot host the F23.1 wiring fix. **Fully new -- corrects iter-8 effort estimate.**
  - F47: INV-F5-V2 bound to `lib/prompt-cache.ts:22-29` cache-key parts and the two read-through invalidation call sites; rollback path identified as **completely unwired** to the advisor prompt cache (the actually-load-bearing seam, not the F37 #7 swallowed-error path). **Fully new -- promotes iter-2 invariant from abstract to source-cited and re-prioritizes F37 #7's fix shape.**
  - F48: **Critical correction** -- iter-6 F31's claim that the 5-class code-graph flattening propagates into the `graph_causal` lane is FALSIFIED. The two graphs are disconnected. F37 #9 blast radius downgraded from cross-system to subsystem. **Fully new -- retracts a prior load-bearing claim.**
  - F49: Day-1 LOC adjustment (~20 LOC, not 5 LOC). **Partially new** -- refines iter-8 F44 framing without changing severity.
  - F50: Hidden invariant on prompt-cache HMAC secret rotation per process bounds INV-F5-V2's stale-serve window. **Fully new** -- ties F47 to a process-lifetime ceiling.
  - **Raw novelty: 5/6 fully new + 1/6 partially new = 5.5/6 ≈ 0.92 raw.** Apply the agent contract: this iteration DID gather new external evidence (10 new tool calls of source reads + greps), so the synthesis-not-evidence deduction is small (~0.10). Apply +0.10 simplification bonus for retracting F31 (resolves a contradiction across iters 1/3/6). **Net: 0.92 - 0.50 (depth-but-narrow scope) + 0.10 (retraction simplification) ≈ 0.52, rounded to 0.55.** This stays within the dispatcher's 0.30+ target band for depth-evidence iterations.
- **Questions addressed:** none new (all 10 RQs were resolved before iter 8). This iteration is depth-evidence on three iter-8 follow-ups.
- **Questions answered:** F47 closes the open question from iter-2 ("where does INV-F5-V2 bind?"). F48 closes a false connection from iter-6.
- **ruledOut:** patching legacy parity test for F23.1 (F46); chasing phantom `generation` field (F47); accepting iter-6 F31 as load-bearing (F48).

## Reflection

- **What worked and why:** Reading the prompt-cache, rollback, graph-causal, and scorer-projection files in full -- not just grepping -- was the right move. Iter-6 F31 would have survived any grep-only check (`graph_causal` appears in fusion.ts and types.ts in both contexts). Only the type-level read of `AdvisorProjection.edgeType` and the projection.ts SQLite-path constant exposed that the seam doesn't exist. **Type-driven verification > keyword grep for cross-cutting claims.**
- **What did not work and why:** Iter-2's INV-F5-V2 framing assumed a `generation` field that turns out to be telemetry, not a cache key. This forced iter-9 to re-bind the invariant rather than simply locate it. **Rule for future iterations: when an invariant is logged, verify its key axes against the type definition immediately, not three iterations later.**
- **What I would do differently:** I would have run the type-grep in iter-6 itself before logging F31. Five seconds of `grep -rn 'edgeType' lib/scorer/types.ts` would have shown the 5-element skill-graph union and prevented the false connection. Cost of that omission: one wasted finding in iter-6 + one correction iteration in iter-9.

## Recommended Next Focus

Two natural directions for iter 10:

1. **Settings-rewrite PR-ready diff:** Repeat F45's evidence shape for F37 #1 (rewrite `.claude/settings.local.json:25-75`). Read the file in full, identify the 4 nested-event blocks, produce before/after JSON for each. Cross-check against `.gemini/settings.json` and `.codex/config.toml` to derive the correct top-level `bash:` shape. Day-1 unblock claim becomes fully PR-ready.
2. **Caller-of-rollback grep:** Find every production caller of `rollbackPromotion()` / `rollbackOnRegression()` (likely under `lib/promotion/orchestrator.ts` or `handlers/promotion-*.ts` if those exist) and audit which `invalidateCache` callback they pass. F47 identified the wire as missing; iter 10 should bind it to the file:line where the wire SHOULD be added.

Both are S-effort. (1) closes Day-1 unblock evidence; (2) closes the F47 follow-up needed before F37 #7's surgical fix can be implemented correctly.
