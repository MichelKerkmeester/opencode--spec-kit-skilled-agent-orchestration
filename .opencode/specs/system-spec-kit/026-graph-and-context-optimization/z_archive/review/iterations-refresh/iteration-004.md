# Iteration 004 — Prior P1 Remediation Spot Check

## Dimension
D1

## Focus area
Remediation commit review: did the 7 P1 remediations (8fa97d848) introduce any new issues? Spot-check 2-3 lanes.

## Findings

No findings — dimension clean for this focus area.

The sampled remediations from the prior batch still hold on the shipped surfaces I re-checked. The old packet-008 startup-hint issue is no longer reproducible: the focused test now asserts that startup priming stays generic and does not emit a `Structural Routing Hint` section. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md:145-177] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67-86]

The old packet-010 lexical-lane overclaim also appears closed: degraded FTS states now surface `lexicalPath: 'unavailable'` rather than pretending a `bm25_fallback` lane actually executed. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md:179-213] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:162-207]

The old packet-014 scope-overclaim around resume or bootstrap enrichment is likewise narrowed. The spec now keeps resume/bootstrap carriage out of scope, keeps `shared-payload-certainty.vitest.ts` read-only for trust-preservation verification, and the implementation summary explicitly says graph enrichment stays graph-local rather than expanding `session_resume` or `session_bootstrap`. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:69-73] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/spec.md:88-90] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md:34-37] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md:60-62] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/implementation-summary.md:75-76]

## Counter-evidence sought

I looked for new regressions created by the fixes themselves on the 008 startup surface, the 010 degraded lexical metadata surface, and the 014 graph-local scope boundary. I did not find a newly introduced contradiction in those sampled lanes.

## Iteration summary

The sampled prior remediations hold. The remaining issues in this refresh are new or newly visible, not reopenings of the prior 7-P1 batch.
