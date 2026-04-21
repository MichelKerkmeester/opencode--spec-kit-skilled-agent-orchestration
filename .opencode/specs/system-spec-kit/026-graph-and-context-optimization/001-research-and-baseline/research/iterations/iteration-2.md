# Iteration 2 — Gap closure (Phases 1 + 2)

## Closure summary
| ID | Gap | Status | Tag | Confidence |
|---|---|---|---|---|
| G1.Q2 | First-tool latency / discoverability impact | partial | phase-1-extended | medium |
| G1.Q8 | Edit-retry root-cause attribution | UNKNOWN | phase-1-confirmed | low |
| G1.Q9 | Net-cost audit of `/clear` + plugin-memory remedy bundle | partial | phase-1-extended | medium |
| G1.RM | Reddit-post arithmetic reconciliation | partial | phase-1-extended | medium |
| G1.X1 | Phase 005 auditor/parser vs F14-F17 expectations | closed | new-cross-phase | low |
| G2.T11 | Empirical validation of the 11.2x token claim | closed | phase-1-extended | medium |
| G2.TR | tRPC / Fastify contract enrichment | closed | phase-1-extended | medium |
| G2.GO | Go regex+brace-tracking labeled `ast` | closed | phase-1-corrected | medium |
| G2.MR | Monorepo support beyond pnpm + npm workspaces | partial | phase-1-extended | medium |
| G2.BR | Blast-radius BFS leak + schema-impact false-positive rate | partial | phase-1-extended | medium |

## Per-gap detail
### G1.Q2 — First-tool latency / discoverability impact
**Status:** partial
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-1/research/research.md:49-60] Phase 1 already limited the claim to smaller upfront payload and explicitly said latency and ergonomics were not proven.
- [SOURCE: phase-1/implementation-summary.md:115-115] The implementation summary preserved Q2 as open because no first-tool latency or discoverability benchmark existed.
- [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:15-24] The source adds one useful dimension: the setting was non-obvious to the author, then reduced the starting payload by lazy-loading non-primary tools.
**Answer:** Discoverability improved in the source scenario because the setting was hidden enough that the author had not known it existed, but first-tool latency and workflow ergonomics are still unmeasured. [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:15-24]
**Residual:** No first-tool latency, fallback-rate, or task-completion evidence exists for this repo or for the post. [SOURCE: phase-1/research/research.md:559-559]

### G1.Q8 — Edit-retry root-cause attribution
**Status:** UNKNOWN
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-1/research/research.md:560-560] Phase 1 says the packet never separates the 31 edit-retry chains into root-cause buckets.
- [SOURCE: phase-1/implementation-summary.md:117-117] The implementation summary repeats that the count is known but the cause partition is not.
- [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:62-62] The source only states that there were 31 failed-edit-then-retry sequences.
**Answer:** UNKNOWN. The source exposes the count of edit-retry chains but provides no examples, labels, or per-chain reasoning that would support prompt vs workflow vs guardrail attribution. [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:62-62]
**Residual:** Root-cause partitioning would require per-event evidence not present in the packet or source post. [SOURCE: phase-1/research/research.md:560-560]

### G1.Q9 — Net-cost audit of `/clear` + plugin-memory remedy bundle
**Status:** partial
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-1/research/research.md:218-229] F22 already says the remedy bundle is not net-costed.
- [SOURCE: phase-1/research/research.md:309-320] F9 keeps clear-and-rehydrate in a prototype lane because the overhead subtraction is missing.
- [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:74-76] The source identifies the bundle pieces: startup context injection, recall/search, and the auditor skill.
**Answer:** The bundle's moving parts are now explicit, but the net-cost audit is still missing. The post never subtracts injected startup context, recall/search usage, or auditor overhead from the stale-resume savings claim. [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:74-76]
**Residual:** No token-count delta is provided for injection, recall lookups, or hook overhead, so the stale-resume comparison cannot be closed quantitatively. [SOURCE: phase-1/research/research.md:561-561]

### G1.RM — Reddit-post arithmetic reconciliation
**Status:** partial
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-1/decision-record.md:139-160] ADR-002 records the two unresolved dataset mismatches and explicitly refuses silent normalization.
- [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:22-24] The 264M figure is derived from 14,000 saved tokens per turn, 22 turns per session, and 858 sessions.
- [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:36-46] The same post separately reports 858 sessions, 18,903 turns, 6,152 of 11,357 idle-gap turns, and 12.3M wasted tokens.
**Answer:** Some arithmetic is locally consistent: 264M is a rounded 14,000×22×858 estimate, and the 54% idle-gap ratio matches 6,152/11,357. What does not reconcile is the dataset framing itself: 926 vs 858 sessions and 11,357 vs 18,903 turns remain unexplained by the source. [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:22-24] [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:36-46]
**Residual:** The header/body session mismatch and the idle-gap denominator mismatch are permanently source-bounded without author clarification. [SOURCE: phase-1/decision-record.md:139-149]

### G1.X1 — Phase 005 auditor/parser vs F14-F17 expectations
**Status:** closed
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-1/research/research.md:179-196] Phase 1 expected an offline-first auditor plus a guarded adapter rather than a trusted core JSONL substrate.
- [SOURCE: phase-1/research/research.md:322-339] Phase 1 also expected reasoned skill review and cross-agent sharing at schema/dashboard layers rather than parser monoculture.
- [SOURCE: phase-5/research/research.md:15-17] Phase 5 documents JSONL ingestion into a relational analytics model, a verifier/discoverer split, and contract-first borrowing.
- [SOURCE: phase-5/research/research.md:374-378] Phase 5 explicitly rejects the raw `count <= 2` disable widget as policy and keeps only the `skill_usage` contract.
- [SOURCE: phase-5/research/research.md:608-615] Phase 5 keeps parsing behind an additive reader, transcript identity, offsets, and replay verification gates.
**Answer:** Closed at the design-contract level: phase 005's shipped research matches F14-F17. It provides the offline auditor shape, keeps transcript parsing guarded and replay-verified, rejects raw low-usage disable thresholds as reusable policy, and recommends sharing contracts instead of one parser or UI shell. [SOURCE: phase-5/research/research.md:15-17] [SOURCE: phase-5/research/research.md:374-378] [SOURCE: phase-5/research/research.md:608-615]
**Residual:** External phase 5 source was outside iteration 2's approved external-read scope, so this is a document-level validation rather than a new source-code audit. [SOURCE: phase-5/research/research.md:15-17]

### G2.T11 — Empirical validation of the 11.2x token claim
**Status:** closed
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-2/research/research.md:338-341] Phase 2 already said the 11.2x headline was README-only and unreproducible from the public eval suite.
- [SOURCE: 002-codesight/external/README.md:52-62] The claim is published as a three-row benchmark table averaged to 11.2x.
- [SOURCE: 002-codesight/external/src/detectors/tokens.ts:4-60] Token math is a heuristic: chars/4 output estimates plus fixed exploration weights and a revisit multiplier.
- [SOURCE: 002-codesight/external/src/eval.ts:97-142] The shipped eval harness measures detector outputs only.
**Answer:** The empirical validation gap closes negatively: there is none. The 11.2x figure is a heuristic README benchmark, not a model-backed Claude/GPT measurement, and the repo's reproducible eval harness never measures token counts at all. [SOURCE: 002-codesight/external/src/detectors/tokens.ts:4-60] [SOURCE: 002-codesight/external/src/eval.ts:97-142]
**Residual:** Replacing the claim would require new instrumentation, not more source rereading. [SOURCE: phase-2/research/research.md:341-341]

### G2.TR — tRPC / Fastify contract enrichment
**Status:** closed
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-2/research/research.md:668-672] Phase 2 already identified tRPC as unenriched and the shared TS helper as Hono-biased.
- [SOURCE: 002-codesight/external/src/ast/extract-routes.ts:43-45] tRPC is explicitly supported by the AST route extractor.
- [SOURCE: 002-codesight/external/src/detectors/contracts.ts:40-64] The contract switch contains no `trpc` branch, while Fastify is routed into the generic TS helper.
- [SOURCE: 002-codesight/external/src/detectors/contracts.ts:70-96] The TS helper only looks for three regex patterns centered on Hono-style code.
**Answer:** This is a real implementation gap, not a deliberate enriched contract model. tRPC gets route extraction but zero contract enrichment, and Fastify only gets the generic Hono-skewed TS regex pass rather than framework-specific contract parsing. [SOURCE: 002-codesight/external/src/detectors/contracts.ts:40-64] [SOURCE: 002-codesight/external/src/detectors/contracts.ts:70-96]
**Residual:** The miss rate is still unknown because no enrichment-focused fixture or test coverage ships in the checkout. [SOURCE: phase-2/research/research.md:672-672]

### G2.GO — Go regex+brace-tracking labeled `ast`
**Status:** closed
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-2/research/research.md:676-681] Phase 2 already suspected the label was misleading.
- [SOURCE: 002-codesight/external/src/ast/extract-go.ts:1-12] The file header describes the implementation as brace-tracking plus regex.
- [SOURCE: 002-codesight/external/src/ast/extract-go.ts:240-245] Route extraction still emits `confidence: "ast"`.
- [SOURCE: 002-codesight/external/src/types.ts:54-75] The shared confidence enum only allows `ast` or `regex`.
**Answer:** It is a mislabel, not pending AST work. The Go path is a structured regex parser constrained by a binary confidence enum, and current code advertises that result as `ast` even though no compiler AST is involved. [SOURCE: 002-codesight/external/src/ast/extract-go.ts:1-12] [SOURCE: 002-codesight/external/src/ast/extract-go.ts:240-245]
**Residual:** The remediation shape remains open, but the status question itself is closed. [SOURCE: 002-codesight/external/src/types.ts:54-75]

### G2.MR — Monorepo support beyond pnpm + npm workspaces
**Status:** partial
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-2/research/research.md:691-696] Phase 2 already said only pnpm and package-workspace manifests are read.
- [SOURCE: 002-codesight/external/src/scanner.ts:107-124] Monorepo mode is triggered only by `pkg.workspaces` or `pnpm-workspace.yaml`.
- [SOURCE: 002-codesight/external/src/scanner.ts:380-399] Workspace patterns come only from those two sources.
**Answer:** The manifest scope is genuinely narrow. Turbo, Nx, Lerna, or Rush repos are only supported when their workspace membership is duplicated into npm-style workspaces or pnpm-workspace files. That means omission risk is real, but the silent-loss rate is still unmeasured because no such fixture is included here. [SOURCE: 002-codesight/external/src/scanner.ts:107-124] [SOURCE: 002-codesight/external/src/scanner.ts:380-399]
**Residual:** No turbo/nx/lerna fixture or trace quantifies how much route or model data would be missed. [SOURCE: phase-2/research/research.md:726-726]

### G2.BR — Blast-radius BFS leak + schema-impact false-positive rate
**Status:** partial
**Closure method:** combined
**Evidence:**
- [SOURCE: phase-2/research/research.md:243-255] Phase 2 already isolated the off-by-one traversal bug and the heuristic schema overlay.
- [SOURCE: 002-codesight/external/src/detectors/blast-radius.ts:31-46] Dependents are added before the queued node's depth is bounded.
- [SOURCE: 002-codesight/external/src/detectors/blast-radius.ts:57-67] Any affected file with a db-tagged route can mark schemas as affected.
- [SOURCE: 002-codesight/external/src/eval.ts:100-142] The eval harness never scores blast-radius output.
**Answer:** The false-positive mechanisms are source-confirmed, so the qualitative risk is real. But the actual false-positive rate remains unknown because the shipped eval harness never benchmarks blast radius, only detector categories such as routes, models, env vars, components, and middleware. [SOURCE: 002-codesight/external/src/detectors/blast-radius.ts:31-46] [SOURCE: 002-codesight/external/src/detectors/blast-radius.ts:57-67] [SOURCE: 002-codesight/external/src/eval.ts:100-142]
**Residual:** A measured FP rate would require blast-radius fixtures or tests that do not exist in this checkout. [SOURCE: phase-2/research/research.md:454-454]

## Cross-cutting observations
- Phase 1's remaining uncertainty is mostly measurement poverty, not hidden logic: the Reddit post names discoverability, remedy components, and waste counts, but it does not provide the latency, cause-bucketing, or net-cost evidence needed for stronger claims. [SOURCE: phase-1/research/research.md:545-552] [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:15-24] [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:62-76]
- Phase 2 splits cleanly into source-confirmed implementation gaps and still-unmeasured evaluation gaps: contracts, Go labeling, scanner scope, and blast semantics are inspectable in code, while token honesty and blast false-positive rate remain under-instrumented because eval coverage excludes them. [SOURCE: phase-2/research/research.md:329-341] [SOURCE: phase-2/research/research.md:668-698] [SOURCE: 002-codesight/external/src/eval.ts:100-142]

## Handoff to iteration 3
- Iteration 3 will close gaps for phases 3, 4, 5.
