# Iteration 053 — Follow-up Track G: G4 — Parity harness architecture

## Question
Should the Python-to-TypeScript parity harness live in its own sub-packet, or be integrated into `027/003` as part of the native advisor core rollout? `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:88-92,124-127`

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:88-92,124-127,180-184` → The follow-up question explicitly asks who owns the parity harness, but the same doc's implementation alternative already places "weight tuning + parity protocol" inside `027/003`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:124-127` → r01's roadmap already scopes a "Python parity harness" into `027/003`, while `027/004` is reserved for the MCP-facing advisor surface.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:138-155` → The risk and measurement plans treat parity as the gate for replacing Python with native `recommendSkills()`, with a "Dual-run parity wrapper" required before Python removal.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:332-468` → `buildSkillAdvisorBrief()` is the current runtime seam: it owns freshness, cache, subprocess invocation, threshold filtering, and brief rendering, so the native scorer swap happens inside the 027/003 core path rather than at a separate packet boundary.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:37-43,51-70,76-119` → The existing corpus parity test already compares direct Python batch output against the hook-visible TypeScript path on the 200-prompt corpus.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:18-23,77-123,190-254` → The regression harness already supplies the second canonical fixture surface: versioned JSONL cases with hard gates for top-1 accuracy, command-bridge false positives, P0 pass rate, and all-cases pass/fail.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:198-243` → Runtime parity is a separate concern from scorer parity: it normalizes outputs across Claude, Gemini, Copilot, Codex, wrapper, and plugin variants and asserts identical visible brief text.
- `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:423-451` and `.opencode/skill/skill-advisor/feature_catalog/04--testing/01-regression-harness.md:18-31` → The repo already documents three distinct but related validation surfaces: four-runtime visible-brief parity, 200-prompt corpus parity, and the permanent regression harness.

## Analysis
The repo's own roadmap already answers the ownership question: parity is part of the native advisor core ship gate, not an adjacent workstream. `027/003` is where the Python subprocess path is replaced with native TypeScript scoring, and `buildSkillAdvisorBrief()` is the exact seam where that substitution occurs today. Because the failure mode is "native scorer diverges from Python behavior," the dual-run harness belongs next to the scorer implementation it gates, not in a separate packet that would only proxy the same transition. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:124-127,138-155`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:332-468`

The current test inventory suggests the right architecture is **integrated ownership with shared fixtures**. The scorer-level surfaces already exist as a corpus parity gate plus the Python regression harness, while `advisor-runtime-parity.vitest.ts` separately protects cross-runtime visible-brief rendering. That points to a layered design: `027/003` owns the dual-run scorer parity wrapper and shared fixture/comparator utilities; `027/004` reuses those normalized outputs to keep runtime transports text-identical; later promotion work can reuse the same fixture layer without owning parity itself. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts:37-43,51-70,76-119`, `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py:190-254`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:198-243`, `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md:423-451`

Creating a standalone parity sub-packet would mostly add coordination cost: duplicated fixture plumbing, split CI ownership, and unclear boundaries between scorer parity, runtime parity, and later shadow-eval promotion gates. The cleaner cut is to keep parity harness implementation in `027/003`, extract only reusable comparison/data-loader helpers into a shared test/eval layer, and let `027/004` plus `027/006` consume that layer. That preserves the existing roadmap, keeps the release blocker attached to the code being ported, and still avoids one-off test duplication. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:180-184`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-051.md:33-36`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:155-159`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Keep the parity harness integrated into `027/003`, with only shared fixtures/comparators factored out for reuse. The migration risk, roadmap ownership, and existing test surfaces all align around parity as a native-core ship gate rather than a separate sub-packet. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:124-127,138-155`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:198-243`

## Dependencies
G1, G2, G3, D4, D7, G5, G6

## Open follow-ups
- Define the shared fixture/comparator surface explicitly: whether corpus rows, regression JSONL cases, and runtime fixtures collapse into one canonical schema or remain three datasets behind one comparison API.
- Decide whether G2 lane-ablation reports should be emitted by the same parity helper layer or remain a sibling evaluation surface that merely reuses the corpus/regression datasets.
- Lock the CI boundary between `027/003` and `027/004`: core parity failures should block native scorer promotion, while runtime visible-brief parity should block transport rollout but not re-own the scorer harness.

## Metrics
- newInfoRatio: 0.41
- dimensions_advanced: [G]
