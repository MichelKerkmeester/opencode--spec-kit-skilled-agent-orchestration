# Iteration 20: PR Breakdown + Rollout Sequence (Q17)

## Focus
The remediation set is not safe as a single mega-PR because the packet mixes three different risk classes: template-only cleanup (D8), single-owner correctness fixes (D1, D7), and behavior-sensitive heuristic work (D2, D3, D5). The canonical priority ordering already separates those classes into P0-P3, and the spec adds explicit landing constraints such as "D4 must land before adding the post-save reviewer drift assertion" and "D5 should only land with a regression fixture proving the continuation-signal gate works on a 3+ memory folder." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:24-28]

A staged train is also justified by the new Gen-2 evidence. Iteration 11 confirms the original owner lines are still valid, iteration 12 shows D4/D8/D3 are corpus-wide rather than seven-file anomalies, iteration 16 converts AC-1..AC-8 into minimal fixtures, iteration 17 maps the refactor-only surfaces that should trail the functional fixes, and iteration 18 reduces D7 to a workflow-only patch small enough to stand alone. That combination makes the safest plan: land user-visible correctness first, then consistency/provenance, then heuristic changes, then optional refactor/guardrail follow-ups. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-40] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58]

## Approach
- Reused strategy section 14 as the scope lock so this pass stayed in rollout planning rather than reopening root-cause questions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:180-200]
- Used research section 10 as the canonical P0-P3 ordering baseline, then split each priority bucket into reviewable PR-sized slices. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191]
- Used iteration 11 to trust the cited live owner lines and iteration 17 to map which helper/refactor work can wait until after behavior fixes land. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]
- Used iteration 12 to bias earlier PRs toward the defects that appear across the broader JSON-mode population, not just the original seven-file sample. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:44-46]
- Used iterations 13-18 to assign exact owner files, minimal patch boundaries, and fixture-backed validation lanes per PR. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:26-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-264] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58]
- Kept the reviewer-upgrade PR last because the strategy schedules Q16 as a post-fix guardrail question, the spec makes reviewer assertions downstream of D4, and iteration 19 now defines the new CHECK-D1..D8 reviewer contract as a post-fix structural guardrail rather than a prerequisite remediation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:3-13]

## Input summary (from iterations 11-19)
- Drift report (iter 11): all frozen D1/D2/D3/D4/D5/D7 file:line anchors still land on the same live owners, so the rollout can use the existing seams without re-mapping them. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35]
- Survey results (iter 12): 82 of 135 memory files matched JSON-mode heuristics, with D4 and D8 broadly visible and D3 widespread enough to justify an early dedicated PR instead of burying it inside a refactor. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:44-46]
- D2 call graph (iter 13): the real gate is `decisionObservations.length === 0 && processedManualDecisions.length === 0` inside `extractDecisions()`, so D2 should ship as precedence hardening, not a broad JSON-mode branch change. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:26-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:65-73]
- D5 corpus (iter 14): `extended` and `continuation` are the only title-side signals clean enough to gate auto-supersedes, while `phase N` and `vN` are too noisy to use. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:16-20] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39]
- D3 blocklist (iter 15): a narrow regex-and-allowlist filter removes about 10% of trigger-phrase corpus entries with zero observed false positives, leaving generic singleton cleanup for reviewer or later tuning rather than this train. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:21-43] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:48-60]
- AC fixtures (iter 16): AC-1..AC-8 already map to minimal JSON fixtures, with F-AC5 requiring a seeded predecessor and F-AC6 requiring a stubbed git seam; the PR train can therefore be validated without inventing new test strategy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-40] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:138-185] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:207-264]
- Refactor map (iter 17): the helper/refactor surface is explicit now — 8 truncation callsites, 2 real importance-tier writers, and 7 `_source`/save-mode callsites — which makes it safe to defer refactor work until after the functional defects land. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:15-31] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:33-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]
- D7 patch (iter 18): D7 is a workflow-only insertion after Step 3.5 that copies four provenance fields from `extractGitContext()` into JSON-mode saves and explicitly avoids reusing the full capture-mode enrichment branch. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:72-78]
- Post-save reviewer (iter 19): the reviewer should grow from six payload/frontmatter quality checks into a CHECK-D1..D8 structural guardrail pass, with D1/D2/D4/D7 regressions elevated to HIGH and D3/D5/D6/D8 kept deterministic and review-time cheap. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:15-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-167]

## PR plan (staged rollout)

### PR-1 — [P0] D8 anchor template consistency
Template-only cleanup should land first because it is the lowest-risk change in the entire train and already has an isolated AC-7 fixture. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-186] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:187-205]

**Files touched:**
- `.opencode/skill/system-spec-kit/templates/context_template.md` (172-183, 330-352)

**Tests added:** F-AC7 fixture; extend `memory-template-contract.vitest.ts` with anchor-consistency assertions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:187-205]

**Depends on:** none

**Rollback:** revert commit; no downstream data-shape or schema coupling.

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-template-contract.vitest.ts tests/template-structure.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-2 — [P0] D1 shared truncation helper + OVERVIEW fix
This is the second ship-fast PR because D1 is a single-owner correctness bug with a proven in-repo fix pattern already present in `input-normalizer.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-186] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:18-31] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:67-69]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (875-881)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (274-283, 668-674)
- NEW: `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts`

**Tests added:** F-AC1 fixture; extend `collect-session-data.vitest.ts` and `memory-render-fixture.vitest.ts` with 450/520/900-char truncation assertions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:37-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:27-31]

**Depends on:** none

**Rollback:** revert commit; no other PR in the train requires the helper to exist first.

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/collect-session-data.vitest.ts tests/memory-render-fixture.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-3 — [P1] D4 importance-tier single source of truth
D4 leads P1 because it fixes the duplicated-fact mismatch that later guardrails must assert against, and Gen-2 now isolates the real writers to initial render plus managed-frontmatter migration. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:187-188] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:33-42] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts` (1112-1183)
- `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` (607-612)
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` (279-289)

**Tests added:** F-AC4 fixture; extend `backfill-frontmatter.vitest.ts` and `post-save-review.vitest.ts` with frontmatter-vs-metadata agreement assertions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:118-136] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:39-42]

**Depends on:** PR-1, PR-2 (ship P0 first; D4 is the first PR that later reviewer work depends on)

**Rollback:** revert commit; the pre-fix state is internally inconsistent but stable, so rollback restores prior behavior without blocking later PR reordering.

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/backfill-frontmatter.vitest.ts tests/post-save-review.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-4 — [P1] D7 provenance-only injection
Iteration 18 reduces D7 to a minimal workflow patch, so it should land as a small, reviewable PR instead of piggybacking on larger enrichment or refactor work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:187-188] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:72-78]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (658-659, 877-923)

**Tests added:** F-AC6 fixture; extend `session-enrichment.vitest.ts` with a stubbed `extractGitContext()` JSON-mode assertion and add one workflow smoke assertion in `workflow-e2e.vitest.ts`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:160-185]

**Depends on:** PR-3 (preserve the canonical P1 order so reviewer drift checks do not inspect pre-D4 state)

**Rollback:** revert commit; no schema changes, and JSON mode simply returns to the current blank-provenance behavior.

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/session-enrichment.vitest.ts tests/workflow-e2e.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-5 — [P2] D3 trigger-phrase sanitization
D3 starts P2 because the defect is widespread enough to matter immediately, but it spans multiple heuristics and therefore deserves its own fixture-backed review slice. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:189-190] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:48-55]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (1271-1298)
- `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts` (260-284)
- NEW: `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`

**Tests added:** F-AC3 fixture; extend `trigger-phrase-filter.vitest.ts` and `semantic-signal-golden.vitest.ts` with the empirical blocklist/allowlist corpus cases from iteration 15. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-43] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:93-116]

**Depends on:** PR-4 (finish P1 before entering the higher-variance heuristic lane)

**Rollback:** revert commit; keep `ensureMinTriggerPhrases()` behavior untouched so rollback restores the current leak without cascading into empty trigger lists. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:182-182]

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/trigger-phrase-filter.vitest.ts tests/semantic-signal-golden.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-6 — [P2] D2 precedence-only gate
D2 ships after D3 because the narrowed fix is small but semantically sensitive: the goal is to block placeholder generation only when authoritative raw decision arrays exist, without weakening degraded-payload fallback. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:189-190] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:44-47]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` (182-185, 381-384)
- optionally `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (566-584, 676-752) only if the PR chooses raw-array rehydration instead of a predicate-only gate

**Tests added:** F-AC2 fixture plus one degraded-payload control fixture; add `decision-precedence.vitest.ts` or extend `runtime-memory-inputs.vitest.ts` with authored-decision-wins and degraded-payload-still-falls-back assertions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:47-63] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:57-91]

**Depends on:** PR-5

**Rollback:** revert commit; lexical fallback remains intact because the fix only tightens precedence when authoritative raw decision arrays exist. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:63-73]

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/decision-precedence.vitest.ts tests/runtime-memory-inputs.vitest.ts tests/memory-render-fixture.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-7 — [P3] D5 auto-supersedes with continuation gate
D5 is the only production P3 defect that should still ship in this train. The new corpus work makes the gate concrete enough now, but the implementation still needs a dedicated ambiguity-safe lineage fixture and should not be bundled with unrelated refactor or reviewer work. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:191-191] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:27-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (1305-1372)
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` (227-236)
- NEW: `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts`

**Tests added:** F-AC5 fixture plus a 3+ memory-folder lineage fixture proving (a) one clean predecessor links, (b) ambiguous predecessors skip, and (c) `phase N` / `vN` titles do not trigger linkage. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:138-158]

**Depends on:** PR-6

**Rollback:** revert commit; if lineage mis-links appear, rollback cleanly removes auto-injected `supersedes`, and the ambiguity-skip rule means no later PR relies on those links being present. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:37-39]

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/causal-supersedes-lineage.vitest.ts tests/workflow-e2e.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-8 — [P3] Refactor-only follow-up: save-mode flag + remaining helper migration
This PR is explicitly behavior-preserving. It packages the cross-cutting cleanups Gen-2 mapped but did not need for the functional fixes: the `_source` overload becomes a clearer save-mode contract, and the remaining decision-extractor truncation snippets move to the shared helper after D1 has already proven the helper boundary. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:214-219]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (453-460, 654-659)
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (361-388, 475-482, 836-847)
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` (120-135, 270-274, 329-332, 429-455)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (274-283)
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` (220-226)
- `.opencode/skill/system-spec-kit/scripts/types/session-types.ts` (if `SaveMode` becomes explicit in the shared contract)

**Tests added:** refactor safety fixtures only; reuse F-AC1/F-AC2/F-AC6 as no-regression assertions rather than inventing new behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-65]

**Depends on:** PR-1 through PR-7

**Rollback:** revert commit; all user-facing fixes remain in earlier PRs, so this refactor can be reverted independently if the contract churn or helper extraction introduces noise.

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/collect-session-data.vitest.ts tests/decision-precedence.vitest.ts tests/session-enrichment.vitest.ts tests/workflow-e2e.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

### PR-9 — [P3] Post-save reviewer upgrade (CHECK-D1..D8 guardrails)
This PR must land last. The strategy explicitly reserves Q16 for post-fix assertions, the spec makes reviewer drift checks downstream of D4, and iteration 19 now makes the target concrete: add CHECK-D1..D8 after the existing six baseline checks and promote new HIGH regressions to blocking. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:15-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-167]

**Files touched:**
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` (220-226, 279-289)
- `.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts`
- optionally `.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts` for end-to-end reviewer assertions

**Tests added:** false-positive regression suite covering CHECK-D1..D8 against one clean F-AC8 render plus deliberately broken fixtures for D1/D4/D7/D8. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:207-264] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:173-175]

**Depends on:** PR-1 through PR-8

**Rollback:** revert commit; rolling back reviewer assertions removes regression detection but does not reintroduce any of the fixed defects.

**Validation:** `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/post-save-review.vitest.ts tests/memory-render-fixture.vitest.ts tests/workflow-e2e.vitest.ts --config ../mcp_server/vitest.config.ts --root . && cd .. && npm run typecheck` [SOURCE: .opencode/skill/system-spec-kit/package.json:17-21] [SOURCE: .opencode/skill/system-spec-kit/scripts/package.json:12-18]

**Deferred outside this train:** D6 remains test-only until a live owner and reproducer are re-established; do not open a production D6 PR in this sequence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:135-144] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:191-191] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:221-224]

## Dependency DAG (ASCII)
```text
PR-1 (D8) ─┐
PR-2 (D1) ─┼── PR-3 (D4) ── PR-4 (D7) ── PR-5 (D3) ── PR-6 (D2) ── PR-7 (D5) ── PR-8 (refactor) ── PR-9 (reviewer)
           └───────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Rollback strategy
- Each PR is independently revertable because the train avoids shared schema migrations and keeps new helpers behind already-fixed behavior lanes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-65]
- If PR-5 or PR-6 regresses degraded-payload behavior, revert only that PR; D3 keeps `ensureMinTriggerPhrases()` intact and D2 is scoped to precedence hardening rather than blanket lexical disablement. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:182-182] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:63-73]
- If PR-7 produces a bad lineage link, revert the PR and fall back to manual/empty `supersedes`; the continuation gate already excludes noisy `phase N` / `vN` titles and keeps ambiguity-skip as the default safety valve. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39]
- PR-8 is intentionally rollback-friendly because it is refactor-only. Reverting it should leave the earlier functional fixes intact. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-65]
- PR-9 MUST land last; rolling it back only removes regression detection and does not reintroduce D1-D8 behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28]

## Release notes draft (for the merged train)
- JSON-mode memory saves now keep OVERVIEW text readable, with clean word-boundary truncation instead of mid-word cuts. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-186]
- Saved memories now keep internal metadata in sync, including importance tier and git provenance for JSON-mode runs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:187-188]
- Trigger phrases and decision sections are cleaner: fewer path fragments/stopwords, and authored decisions outrank placeholder fallbacks when authoritative input exists. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:189-190]
- Continuation runs can auto-link to the immediate predecessor when the lineage signal is explicit and unambiguous. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:191-191] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:76-79]
- Post-save review can be strengthened after the fix train so the same defect classes are caught automatically on future saves. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:193-200]

## Gen-2 convergence declaration
- Iteration goal answered here: Q17 now has a concrete PR train, dependency DAG, rollback plan, and per-PR validation commands. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:194-200]
- Evidence gap from Gen-1 is materially closed for rollout: drift was re-verified, population-scale prevalence was measured, fixtures were designed, refactor boundaries were mapped, and the D7 patch surface was reduced to a minimal diff. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:271-276] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:67-75] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:72-78]
- Q16 is now represented by iteration 19's concrete reviewer contract, which confirms the final PR should upgrade `post-save-review.ts` only after the functional defects land. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:3-13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-167]
- Stop reason: max_iterations reached and the rollout question is now concretely answerable from the available evidence set. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:197-203]

## Findings
1. The original D1/D2/D3/D4/D5/D7 owner lines are still live, so the PR plan can cite concrete file spans without re-investigating ownership. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-011.md:29-35]
2. D4 and D8 are population-scale JSON-mode defects, not just anomalies in the original seven-file sample, which justifies their placement before the narrower D5/D6 lane. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-012.md:15-18] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-191]
3. D2 is a predicate/precedence problem inside `extractDecisions()`, so it should ship as a tight branch fix with degraded-payload regression coverage rather than a mode-wide rewrite. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:44-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-013.md:65-73]
4. D5 should only gate on `extended` / `continuation`-style continuation signals plus immediate-predecessor semantics; `phase N` and `vN` stay excluded because the corpus shows they are noisy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:46-53]
5. D3 can remove a measurable junk slice of the live trigger corpus with narrow filters and no observed false positives, so it deserves its own PR rather than being hidden inside generic cleanup. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:40-55]
6. AC fixtures already exist for every planned production PR in this train, which means rollout can be validated with small, deterministic payloads instead of fresh ad hoc test strategy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-016.md:35-264]
7. The safe refactor ordering is now explicit: functional fixes first, then helper extraction / save-mode cleanup, because the helper and `_source` surfaces span many more callsites than any single defect fix. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-75]
8. D7 is independently shippable because iteration 18 reduced it to a small workflow-only patch that copies provenance fields without invoking full captured-session enrichment. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:43-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-018.md:72-78]
9. Reviewer guardrails belong last in the train because both the spec and iteration 19 place CHECK-D1..D8 after the functional fixes, especially D4, and expect new HIGH detections to block continuation only once the repaired contract exists. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:26-28] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:15-25] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:153-167]
10. D6 should stay deferred from the production rollout because Gen-1 still treats it as an unresolved live-owner question with test instrumentation only. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:135-144] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:221-224]

## Next focus recommendation
Deep-research loop Gen-2 COMPLETE for rollout planning. Next step outside this loop: `/spec_kit:plan :with-phases` against the spec folder to convert this PR train into a phase-structured implementation workflow.
