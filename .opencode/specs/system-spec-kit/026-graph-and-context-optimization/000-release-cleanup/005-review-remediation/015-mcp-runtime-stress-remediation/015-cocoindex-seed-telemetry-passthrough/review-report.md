# Review Report: Packet 015 — CocoIndex Seed Telemetry Passthrough

**Reviewer:** GitHub Copilot CLI (model: `gpt-5.5`, effort: `high`)
**Orchestrator:** Claude Opus 4.7 (1M context)
**Date:** 2026-04-27
**Packet:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/`
**Mode:** Read-only

## Verdict

**REQUEST-CHANGES** (reviewer)
**Orchestrator note:** see "Orchestrator Adjustments" section below — the P1 scope-discipline finding is reclassified as informational under the standing repo policy on parallel-track worktree state.

## Finding Counts (reviewer)

- P0 (blocker): **0**
- P1 (must-fix before merge): **2**
- P1 (after orchestrator reclassification): **1**
- P2 (nice-to-have): **0**

## Orchestrator-Independent Verification

Per the dispatch contract, the orchestrator independently verified the "no second rerank" claim **before and after** dispatching the reviewer.

```text
Command:
  grep -rE 'path_class|pathClass|raw_score|rawScore|rankingSignals' \
    .opencode/skill/system-spec-kit/mcp_server/lib/search/

Pre-dispatch hits: 11 lines (3 files)
Post-dispatch hits: 11 lines (3 files) — IDENTICAL

Files with hits:
  - mcp_server/lib/search/search-utils.ts (2 hits)
  - mcp_server/lib/search/pipeline/stage1-candidate-gen.ts (2 hits)
  - mcp_server/lib/search/hybrid-search.ts (7 hits)

Tokens hit by packet 015: NONE (path_class, pathClass, raw_score, rankingSignals)
Tokens hit pre-existing:  rawScore (local-variable name only)

Diff verification:
  git diff HEAD -- .opencode/skill/system-spec-kit/mcp_server/lib/search/
  → EMPTY (zero changes from packet 015)
```

**Pre-existing context:** the `rawScore` references are local-variable names referring to candidate `quality_score`/`similarity` raw values inside hybrid-search candidate score normalization. They predate packet 015 (last touched in commits `e279375dca` and earlier — Phase 13 search performance work) and are unrelated to seed telemetry. Packet 015 introduced **zero** new references to any of the five forbidden tokens in `lib/search/`. The "no second rerank introduced" claim is independently confirmed.

**CocoIndex fork verification:**

```text
git status --short --untracked-files=all -- .opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/
→ EMPTY (fork untouched, byte-equal to origin/main)
```

## Per-Check Findings

### Check 1: Plan adherence

**Status:** PASS
**Severity:** N/A
**Evidence:** Research recommends Option #1 ("per-seed telemetry passthrough") at `research.md:245-250` and rejects Option #3 ("mcp_server/lib/search rerank using fork signals") at `research.md:256-257`. Implementation follows the passthrough path in:
- `context.ts:175-208` (handler normalization)
- `seed-resolver.ts:111-134` (seed-to-anchor propagation)
- `tool-input-schemas.ts:464-493` (schema acceptance of telemetry shape)

**Finding:** Implementation matches research.md §6.3 Option #1 and does not implement the rejected `lib/search` rerank path.

### Check 2: Critical fixture-equality

**Status:** PASS
**Severity:** N/A
**Evidence:** Test E uses a fixed fixture at `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:281-303`, runs telemetry-less vs telemetry-laden seeds at `:310-321`, strips telemetry-only fields at `:305-307`, and asserts full core-object equality at `:334-335`:

```ts
expect(afterStripped).toEqual(beforeAnchors);
```

Separate assertions cover ordering at `:337-340` and `score`/`confidence`/`resolution` at `:342-347`. The `source` field is part of the compared anchor object because anchors emit `source` at `context.ts:287`.

**Finding:** Fixed-fixture byte-equality is established for `score`, `confidence`, `resolution`, `ordering`, and `source`. No P0 finding.

### Check 3: No second rerank introduced

**Status:** PASS
**Severity:** N/A
**Evidence:** `git diff HEAD -- mcp_server/lib/search/` is empty. Static grep for the five forbidden tokens across the six requested files found only pre-existing `rawScore` local-variable usage in `hybrid-search.ts:622-635` (and similar pre-existing usage in `search-utils.ts` and `pipeline/stage1-candidate-gen.ts`). No `path_class`, `pathClass`, `raw_score`, or `rankingSignals` references are present in those files.

**Finding:** Packet 015 introduced zero changes to `lib/search/` and no second-rerank path. (Independently re-verified by orchestrator — see top of report.)

### Check 4: Schema validation

**Status:** PASS
**Severity:** N/A
**Evidence:** Schema accepts both casings at `tool-input-schemas.ts:488-492`: `rawScore`, `raw_score`, `pathClass`, `path_class`, `rankingSignals`. Mixed/conflicting inputs are accepted by the schema (no rejection); tests at `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts:142-160` exercise this acceptance.

**Finding:** Both variants validate. Schema does not reject conflicting values; downstream handler normalization silently prefers camelCase when both are defined and non-empty. Behavior is documented and tested.

### Check 5: Wire normalization

**Status:** PASS
**Severity:** N/A
**Evidence:** `context.ts:187-195` normalizes `raw_score → rawScore`, `path_class → pathClass`, and preserves `rankingSignals`. Conditional assignment at `context.ts:205-207` emits only defined normalized fields.

**Finding:** All four edge cases handled correctly:
- Only snake_case present → normalized to camelCase
- Only camelCase present → preserved as-is
- Both present → camelCase wins (when defined and non-empty)
- Neither present → no telemetry fields emitted

### Check 6: Optional-only emission

**Status:** PASS
**Severity:** N/A
**Evidence:** CocoIndex seed construction adds telemetry only when defined at `context.ts:205-207`; resolver propagation adds telemetry only when valid at `seed-resolver.ts:131-133`; anchor emission adds telemetry only when present at `context.ts:293-295`. Backward-compat tests assert absent properties at `vitest.ts:223-244` and manual-provider non-propagation at `:246-269`.

**Finding:** Seeds lacking telemetry produce no `rawScore`, `pathClass`, or `rankingSignals` anchor properties. No nulls, empty strings, or undefined keys leak into the anchor.

### Check 7: Fork untouched

**Status:** PASS
**Severity:** N/A
**Evidence:**
- `git status --short --untracked-files=all -- .opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` → empty
- `git diff --name-only origin/main -- .opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` → empty
- Fork telemetry source remains untouched in `schema.py:24-36` and `query.py:21-37`, `:192-217`

**Finding:** CocoIndex fork is byte-equal to origin/main. (Independently re-verified by orchestrator.)

### Check 8: Response-level counters deferred

**Status:** PASS
**Severity:** N/A
**Evidence:** Research defers response-level counters at `research.md:253-255`. Static search for `dedupedAliases|uniqueResultCount` in `mcp_server/` returned no code changes; occurrences are documentation-only in packet docs (`spec.md:83`, `implementation-summary.md:141`).

**Finding:** `dedupedAliases` and `uniqueResultCount` were correctly deferred to a future packet.

### Check 9: Anchor score = seed score (NOT raw_score)

**Status:** PASS
**Severity:** N/A
**Evidence:** Test E2 sets `score: 0.5` and `raw_score: 0.99` at `vitest.ts:354-362`, then asserts:

```ts
expect(anchor.score).toBe(0.5);       // line 366
expect(anchor.rawScore).toBe(0.99);   // line 368
```

Resolver assigns anchor score from `seed.score` at `seed-resolver.ts:120` and `rawScore` separately at `:131`.

**Finding:** Anchor score remains the bounded seed score; raw score is audit metadata only. Self-flagged contract honored.

### Check 10: Test coverage vs success criteria

**Status:** FAIL
**Severity:** P1
**Evidence:** research.md §6.5 requires "`mcp_server/lib/search/hybrid-search.ts` rank order unchanged on a fixed query corpus" at `research.md:267`. The new vitest's Test F is static-only: it reads source and greps tokens at `vitest.ts:387-410`, and explicitly says it does NOT run hybrid-search end-to-end at `:382-385`.

**Finding:** One authoritative success criterion is not mapped to a fixed-query-corpus test in the new vitest file. Static grep is supportive (especially given lib/search has zero diff) but is not the requested fixed-corpus rank-order assertion. Suggest adding a small fixed-corpus regression test or explicitly marking this criterion as "static-grep proof sufficient" with a research-level decision record update.

### Check 11: Scope discipline

**Status:** FAIL (reviewer) → **INFORMATIONAL** (orchestrator reclassified)
**Severity (reviewer):** P1
**Severity (orchestrator):** N/A — see Orchestrator Adjustments
**Evidence:** Reviewer ran `git status --short --untracked-files=all` and observed dirty siblings: `command/spec_kit/assets/spec_kit_deep-research_auto.yaml`, `code_graph/handlers/status.ts`, `lib/deep-loop/executor-config.ts`, parent `015-mcp-runtime-stress-remediation/{spec.md,description.json,graph-metadata.json}`, untracked sibling packets 012–014, etc.

**Finding (reviewer):** Worktree is not isolated to packet 015.

**Orchestrator response:** Per the standing repository constitutional rule (see CLAUDE.md memory: `feedback_worktree_cleanliness_not_a_blocker`), parallel-track work is baseline state in this repo. Worktree cleanliness is **never** a blocker or P1. The packet-015-scoped diff is verified clean:

```text
git diff HEAD -- \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts \
  .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
→ shows packet 015's intended modifications (3 files, M)

ls .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-context-cocoindex-telemetry-passthrough.vitest.ts
→ exists (untracked, intended new test)

ls .opencode/specs/.../015-cocoindex-seed-telemetry-passthrough/
→ 7 packet docs present (spec, plan, tasks, checklist, implementation-summary, description, graph-metadata)
```

Packet 015's own scope is clean: 3 modified TS files + 1 new test + 7 packet docs = exactly the contract. The reviewer's finding about sibling worktree noise is correct in the abstract but not actionable in this repo's standing operating model. **Reclassified as informational. Not a P1 blocker.**

## Top 3 Findings (severity-ordered, post-orchestrator)

1. **[P1] Missing fixed-query-corpus rank-order test** — research.md §6.5 requires a fixed-corpus hybrid-search rank-order invariant test, but new Test F is static-grep only. Either (a) add a small fixed-corpus regression test exercising `hybrid-search.ts` end-to-end with the same query and asserting rank order is unchanged pre/post patch, or (b) add a research-level note clarifying that static-grep over `lib/search/` is sufficient evidence given zero code diff in that path.

2. **[Informational] Worktree contains unrelated parallel-track files** — reviewer flagged P1; orchestrator reclassified to informational per standing repo policy. Packet 015's own scope is clean. No action.

3. **[Informational] Schema does not reject conflicting telemetry values** — when callers send both `raw_score` and `rawScore` with different values, the schema accepts both and downstream silently prefers camelCase. This is by design (lenient interop) and is tested. No action unless a future packet wants to add strict mode.

## Summary

Implementation logic for packet 015 is correctly additive: it accepts snake/camel telemetry, normalizes and propagates per-seed fields, preserves anchor `score`/`confidence`/`resolution`/`source`/`ordering`, avoids `lib/search/` reranking, and leaves the CocoIndex fork untouched. Critical fixture-equality is established (Test E), the agent's self-flagged Test E2 verifies `anchor.score === seed.score` (not `seed.raw_score`), and orchestrator-independent grep confirms zero new `lib/search/` references.

**Single actionable P1:** add a fixed-query-corpus rank-order test (or an explicit research decision-record note that static-grep is sufficient) to fully close research.md §6.5.

**Recommendation:** APPROVE-WITH-MINOR-FIXES (orchestrator) on resolution of the §6.5 coverage gap.

## Copilot CLI Diagnostics

- Model: `gpt-5.5`
- Effort: `high`
- Wall-clock: ~3 minutes
- Tokens: ↑ 454.7k / ↓ 10.1k / 407.6k cached / 6.0k reasoning
- No fallback to `gpt-5.4` required.
- Exit: clean.
- No CLI errors.
