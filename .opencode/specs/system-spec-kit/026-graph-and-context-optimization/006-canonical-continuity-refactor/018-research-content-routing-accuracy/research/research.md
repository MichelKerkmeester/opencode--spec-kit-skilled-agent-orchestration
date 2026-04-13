# Research Synthesis: Content Routing Accuracy After Implementation

## Scope And Method

This packet stayed read-only and only updated `research/` artifacts. Iterations 1-25 established the pre-implementation baseline and produced the three remediation phases plus the doc-alignment follow-on. Iterations 26-35 reran the benchmark against shipped behavior, traced the always-on Tier 3 path end to end, checked the canonical docs against code, and measured prototype separation after the refresh. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:384] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:951] [SOURCE: .opencode/command/memory/save.md:76]

Two benchmark rules matter for the post-implementation verdict:
- The exact preserved subset of the earlier corpus is reproducible: `40` full prototypes, `40` first-sentence variants, and `12` test-style samples.
- The earlier compact-variant generator was not preserved as a packet artifact, so any all-in `132`-sample replay is diagnostic rather than strictly baseline-comparable. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/research/iterations/iteration-005.md:7] [INFERENCE: packet-local artifact inspection]

## 1. Benchmark Verdict

The core post-implementation answer is positive on the reproducible part of the earlier benchmark.

- The preserved replay now scores `95.65%` on `92` exact-preserved samples. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48] [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
- The prior baseline recorded in iteration 5 was `87.88%` on the earlier `132`-sample corpus. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/research/iterations/iteration-005.md:7]
- The old dominant seams are gone from the preserved replay. `narrative_delivery -> narrative_progress` and `handover_state -> drop` no longer lead the confusion list. [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
- The remaining preserved-subset errors are narrower:
  - `narrative_progress -> research_finding` for `NP-02` and `NP-04`
  - `research_finding -> metadata_only` for `RF-03`
  - one short `drop` fragment (`DR-05-s1`) that refuses instead of routing cleanly to `drop` [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]
- The preserved-shape breakdown is strong: full prototypes score `92.50%`, first-sentence variants `97.50%`, and the `12` targeted test-style samples `100%`. [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]

The compact-fragment story is less clean:
- A best-effort reconstructed `132`-sample replay lands at `86.36%`.
- Those misses are concentrated in compact-only refusals for delivery, research, metadata, and terse drop telemetry.
- Because the earlier compact-generator logic was not preserved, that number is useful for residual-gap diagnosis but should not be treated as a strict before-after headline. [INFERENCE: packet-local reconstructed 132-sample replay over dist/lib/routing/content-router.js]

## 2. Tier 3 Always-On Path

The save handler now wires Tier 3 into the live canonical path by default, and the fallback behavior is correct.

- Canonical routing is unconditional because `shouldUseCanonicalRouting()` now returns `true`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:711]
- The handler constructs the router through `buildCanonicalRouter()`, injecting both `classifyWithTier3Llm` and the shared `tier3RoutingCache`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005]
- `classifyWithTier3Llm()` fail-opens on missing endpoint, non-OK response, invalid JSON, and thrown transport errors by returning `null`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:951]
- `resolveNaturalDecision()` accepts Tier 3 only above the configured thresholds, otherwise falls back to penalized Tier 2 when safe, and refuses when even the penalized fallback stays below `0.50`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:553] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:569] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:579]
- The prompt body now correctly distinguishes:
  - natural saves: `PACKET_KIND: feature`, `SAVE_MODE: natural`
  - research roots: `PACKET_KIND: research`
  - explicit route overrides on child phases: `PACKET_KIND: phase`, `SAVE_MODE: route-as` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1294] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1347]
- The fail-open test also passes: when Tier 3 transport throws, the handler still succeeds via natural Tier 2 routing and writes the expected canonical target. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1401] [INFERENCE: targeted routing-only Vitest run]

The targeted routing-only verification run passed `7/7`. That is the right signal for this packet. The broader handler suite still has unrelated failure-injection and concurrency failures elsewhere in the file, but they do not contradict the Tier 3 routing verdict here. [INFERENCE: targeted `npx vitest run ... -t ...` execution]

## 3. Documentation Parity

The canonical docs are functionally aligned with shipped routing behavior.

- `save.md`, `SKILL.md`, and `save_workflow.md` all describe the live eight-category router correctly. [SOURCE: .opencode/command/memory/save.md:76] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:549] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:304]
- Their Tier-flow description matches the code: Tier 1 heuristics, Tier 2 prototypes, Tier 3 wired by default with safe fallback or refusal. [SOURCE: .opencode/command/memory/save.md:89] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:317] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005]
- The new delivery and handover boundary language is accurate:
  - delivery emphasizes sequencing, gating, rollout, and verification
  - handover preserves state-first stop/resume notes even when soft operational commands such as `git diff`, `list memories`, or `force re-index` appear
  - hard transcript, telemetry, and wrapper scaffolding still route to `drop` [SOURCE: .opencode/command/memory/save.md:95] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:384] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:943]
- The override and context rules are also aligned: `routeAs` preserves the natural decision for audit, and `packet_kind` derives from spec metadata first (`type`, `title`, `description`) with parent-phase fallback only when metadata is silent. [SOURCE: .opencode/command/memory/save.md:101] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:479] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:858]

I found one wording nuance, not a functional drift:
- The docs phrase Tier 3 as if `LLM_REFORMULATION_ENDPOINT` is configured.
- The code only checks whether the env var exists and otherwise returns `null`, preserving fail-open behavior. [SOURCE: .opencode/command/memory/save.md:93] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:321] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:899]

That is a wording-hardening opportunity, not a behavior mismatch.

## 4. Prototype Quality After Refresh

The refreshed library is improved enough for runtime correctness, but it is still not globally well separated in embedding space.

- The closest centroid pair is still `narrative_progress <-> narrative_delivery` at `cosine 0.9084` (`distance 0.0916`). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical-vector centroid analysis over routing-prototypes.json]
- The next closest is `narrative_delivery <-> handover_state` at `0.8918` (`distance 0.1082`). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical-vector centroid analysis over routing-prototypes.json]
- `decision <-> research_finding` also remains close at `0.8797`, which fits the residual overlap around source-of-truth, investigation, and metadata-heavy prose. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [INFERENCE: packet-local lexical-vector centroid analysis over routing-prototypes.json]
- The single riskiest off-category prototype pair is `ND-03` versus `HS-04` at `cosine 0.8244`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:65] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:157] [INFERENCE: packet-local nearest-neighbor scan over routing-prototypes.json]
- Even so, the live router now keeps the specifically refreshed hotspot prototypes on the correct side of the boundary: `ND-03`, `ND-04`, `NP-05`, `HS-01`, and `HS-04` all pass the dedicated boundary test. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:503] [INFERENCE: targeted routing-only Vitest run]

That means the improvement is behavior-first rather than geometry-first. The heuristics and floors now rescue the hardest full-text examples, but the corpus still clusters tightly enough that short or mixed fragments can drift.

## 5. Remaining Path To 95%+

The core packet problem is solved. The remaining follow-on work is smaller and has changed categories.

Residual exact replay issues now live in:
- `narrative_progress -> research_finding` when implementation text is heavy on spec-doc and source-of-truth nouns (`NP-02`, `NP-04`)
- `research_finding -> metadata_only` when a finding discusses continuity, preflight, postflight, and metadata fields (`RF-03`)
- terse drop telemetry that currently refuses instead of cleanly routing to `drop` (`DR-05-s1`) [INFERENCE: packet-local preserved-subset replay over dist/lib/routing/content-router.js]

If the team wants a stronger 95%+ short-fragment story, the smallest next changes are:
1. Add short-form drop wrappers for phrases like `captured file count`, `tool executions`, and `repository state` so terse telemetry clears `drop` more reliably. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:385] [INFERENCE: synthesis across preserved replay and residual short-fragment errors]
2. Distinguish `research_finding` from `metadata_only` more explicitly when `_memory.continuity`, `preflight`, or `postflight` vocabulary appears inside analytical prose rather than field-heavy payloads. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:417]
3. Add one more guard so spec-doc nouns alone do not push progress narratives into `research_finding`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:390] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:409]
4. If more headroom is needed without a full corpus rewrite, let prototype `negativeHints` influence Tier 2 tie-breaking or fallback penalties. Those hints exist in the library today but do not participate in the live scoring path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:11] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:802] [INFERENCE: packet-local code inspection]

## Final Recommendation

The packet is reconverged after implementation.

1. The delivered phases fixed the original delivery/progress and handover/drop seams.
2. The always-on Tier 3 path is wired correctly and fail-opens the right way.
3. The canonical docs are functionally aligned with shipped behavior.
4. The remaining accuracy work is optional and much narrower: short-fragment robustness around progress versus research, research versus metadata, and terse drop telemetry.

If the team wants another pass, it should be a small follow-on refinement wave aimed at those short-fragment cases. If not, this packet's main research question is answered.
