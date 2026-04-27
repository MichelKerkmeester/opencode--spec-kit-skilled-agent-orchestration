---
title: "Deep Review — 004-skill-advisor-affordance-evidence"
description: "7-iteration scoped review with P0/P1/P2 findings."
generated_by: cli-codex gpt-5.5 high fast
generated_at: 2026-04-25T13:27:15Z
iteration_count: 7
---

# Deep Review — 004-skill-advisor-affordance-evidence

## Findings by Iteration

### Iteration 1 — Correctness

- **P1 — Compile-time `conflicts_with` affordance edges are accepted but silently dropped from the compiled graph.** The affordance allowlist includes `conflictsWith` / `conflicts_with` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:45`), the validator checks normalized affordance edge targets generically (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:453`), and the ADR says affordances use the existing relation set including `conflicts_with` (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/decision-record.md:80`). But `compile_graph()` serializes affordance adjacency only for `depends_on`, `enhances`, `siblings`, and `prerequisite_for` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:834`), while compiled `conflicts` are built only from static `edges.conflicts_with` declarations (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:847`). Fix: either reject affordance-level conflicts at validation time or serialize them into the compiled conflict contract with the same mutual-declaration semantics.

### Iteration 2 — Security & Privacy

- **P1 — Instruction-shaped affordance filtering is narrower than the stated prompt-stuffing boundary.** The spec requires instruction-shaped strings to be stripped or dropped (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence/spec.md:174`) and pt-02 says affordance ingestion must require allowlisted normalization and privacy-preserving output (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/research.md:267`). The TypeScript denylist only catches role labels plus `ignore previous/all instructions` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts:59`), and the Python compiler duplicates the same narrow expression (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:59`). Common variants such as "ignore prior instructions" or "disregard previous directions" would become sanitized trigger text. Fix: broaden the prompt-injection detector, add adversarial variants in both TS and Python tests, or move to a positive allowlist for short noun-phrase style affordances.

### Iteration 3 — Integration

- **P1 — Score-time affordances are not exposed through the public advisor recommendation contract.** The scorer type accepts `options.affordances` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/types.ts:91`) and `fusion.ts` normalizes that option before lane execution (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:241`). The MCP input schema has no affordance field under either the top-level input or `options` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:24`), and `advisor-recommend` calls `scoreAdvisorPrompt()` with only thresholds (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:202`). That makes request-local tool/resource affordances test-only unless some other internal caller is added. Fix: either add a validated public `affordances` input path with cache-key participation, or document that this packet only supports compile-time graph metadata plus direct library calls.

### Iteration 4 — Performance

- **P2 — Score-time affordance matching has no global cap and uses an avoidable `skills × affordances` scan.** The normalizer caps triggers and edges per affordance but maps every supplied affordance object (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts:150`). The derived lane then filters the full affordance list once per projected skill (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts:10`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts:27`). In normal use this is likely small, but if affordances become a public input, this is a hot-path multiplier. Fix: cap total request affordances and pre-index normalized affordances by `skillId` before lane scoring.

### Iteration 5 — Maintainability

- **P2 — Sanitization logic is duplicated across TypeScript and Python without a shared parity fixture for adversarial inputs.** The TypeScript normalizer defines privacy and instruction patterns (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts:59`), while the Python compiler repeats equivalent patterns and cleanup (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:59`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:314`). Current TS tests cover a narrow sample (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/affordance-normalizer.test.ts:51`), and the Python test repeats one similar case (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py:1457`). Fix: introduce a shared JSON fixture of accepted/rejected affordance phrases consumed by both test suites.

### Iteration 6 — Observability

- **P2 — Dropped affordance inputs leave no diagnostic trail.** Invalid skill IDs, empty sanitized triggers, and empty edge sets cause the TS normalizer to return `null` or filter entries away (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts:153`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts:157`). Python compile-time normalization similarly returns an empty list when `derived.affordances` is absent or malformed (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:407`). The scorer result metrics only report candidate count and live lane count (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:362`). Fix: add debug-only counters for received, accepted, dropped-unsafe, dropped-empty, and dropped-unknown affordances.

### Iteration 7 — Evolution

- **P2 — Compiled affordance evidence loses source context needed for future debugging.** The normalizer creates stable evidence labels at score time (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts:164`), but the compiler flattens affordance triggers directly into `signals` (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:866`) and writes adjacency weights without an affordance context field (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:834`). This is acceptable for the current no-schema-change packet, but it makes later routing-debug work harder because compiled evidence cannot distinguish author `intent_signals` from affordance-derived signals. Fix: defer schema change, but record this as a follow-up design item before adding richer route/tool evidence.

## Severity Roll-Up

| Severity | Count |
|---|---|
| P0 | 0 |
| P1 | 3 |
| P2 | 4 |

## Top 3 Recommendations

1. Decide the `conflicts_with` contract for affordance edges and make compiler validation and serialization agree.
2. Expose score-time affordances through a validated public API, or explicitly narrow the feature to compile-time metadata/direct library use.
3. Replace the duplicated sanitizer tests with a shared adversarial fixture before expanding affordance sources.

## Verification Notes

- Full implementation/spec/research files reviewed: 3,059 LOC.
- Attempted `npm test -- --run skill_advisor/tests/affordance-normalizer.test.ts skill_advisor/tests/lane-attribution.test.ts skill_advisor/tests/routing-fixtures.affordance.test.ts` from `mcp_server`; this expanded into the broader core suite and surfaced unrelated failures before the focused affordance run completed.
- Code graph scan was attempted for the Skill Advisor subtree, but the MCP call was cancelled by the runtime before producing an index.

## Convergence

- Iterations completed: 7/7
- New-info ratio per iteration: [it1: 1.00, it2: 0.80, it3: 0.75, it4: 0.45, it5: 0.40, it6: 0.35, it7: 0.25]
- Final state: ALL_FINDINGS_DOCUMENTED
