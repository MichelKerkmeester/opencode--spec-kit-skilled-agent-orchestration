# Iteration 10 — Gap re-attempt (2 UNKNOWN + 8 PARTIAL)

## Method
- Gaps targeted: `G1.Q2`, `G1.Q8`, `G1.Q9`, `G1.RM`, `G2.MR`, `G2.BR`, `G3.T93`, `G4.T715`, `G4.MM`, `G4.PT`
- New external files opened: 16
- Phase-1 constraint: `001-claude-optimization-settings/external/` contains only `reddit_post.md`, so those re-attempts used deeper line tracing rather than genuinely new files

## Closure delta
| ID | Iter-2/3 | Iter-10 | Delta |
|---|---|---|---|
| G1.Q2 | partial | partial | improved |
| G1.Q8 | UNKNOWN | UNKNOWN-confirmed | reclassified |
| G1.Q9 | partial | partial | improved |
| G1.RM | partial | partial | improved |
| G2.MR | partial | closed | reclassified |
| G2.BR | partial | partial | improved |
| G3.T93 | partial | closed | reclassified |
| G4.T715 | partial | closed | reclassified |
| G4.MM | partial | closed | reclassified |
| G4.PT | UNKNOWN | UNKNOWN-confirmed | reclassified |

## Per-gap detail (improvements only)
### G2.MR — improved from partial to closed
**New evidence:**
- [SOURCE: 002-codesight/external/src/scanner.ts:107-112]
- [SOURCE: 002-codesight/external/src/scanner.ts:384-399]
- [SOURCE: 002-codesight/external/tests/detectors.test.ts:487-498]
- [SOURCE: 002-codesight/external/eval/fixtures/hono-monorepo/repo.json:5-6]
- [SOURCE: 002-codesight/external/README.md:316-316]
**Iter-10 answer:** codesight's real monorepo boundary is now explicit: it supports pnpm-workspace manifests plus generic `package.json` workspaces, which covers pnpm and npm/yarn workspace repos, but not manager-specific nx/turbo/lerna/rush metadata unless those repos also mirror membership into one of those standard manifests.

### G3.T93 — improved from partial to closed
**New evidence:**
- [SOURCE: 003-contextador/external/src/lib/core/stats.test.ts:36-52]
- [SOURCE: 003-contextador/external/src/lib/frameworks/openclaw.ts:5-6]
- [SOURCE: 003-contextador/external/src/lib/frameworks/openclaw.ts:26-31]
**Iter-10 answer:** the 93% story is decisively an estimate. The repo tests fixed 25k-token savings arithmetic and emits the same 93% / 500-vs-25k framing into generated agent instructions, but still provides no benchmark against Public's typed retrieval stack.

### G4.T715 — improved from partial to closed
**New evidence:**
- [SOURCE: 004-graphify/external/graphify/benchmark.py:9-13]
- [SOURCE: 004-graphify/external/graphify/benchmark.py:81-98]
- [SOURCE: 004-graphify/external/tests/test_benchmark.py:52-67]
**Iter-10 answer:** the 71.5x benchmark is heuristic all the way down: 4 chars per token, heuristic corpus-word conversion, and tests that only validate internal proportionality. There is still no provider-grounded token counting in the measurement path.

### G4.MM — improved from partial to closed
**New evidence:**
- [SOURCE: 004-graphify/external/worked/mixed-corpus/README.md:19-22]
- [SOURCE: 004-graphify/external/worked/mixed-corpus/README.md:37-45]
- [SOURCE: 004-graphify/external/worked/mixed-corpus/GRAPH_REPORT.md:3-10]
- [SOURCE: 004-graphify/external/worked/mixed-corpus/review.md:3-5]
**Iter-10 answer:** the checked-in worked artifact is not actually multimodal evidence. The repo says the benchmark PNG is not stored in version control, the shipped report covers only 4 files with 0 token spend, and the multimodal story in `review.md` refers to a separate live run.

### G1.Q8 — reclassified from UNKNOWN to UNKNOWN-confirmed
**New evidence:**
- [SOURCE: 001-claude-optimization-settings/external/reddit_post.md:62-62]
**Iter-10 answer:** iter-9's caution stands. This is not a missing measurement; it is a missing event-level evidence problem. The only recoverable fact is that 31 edit-retry chains existed. There are still no per-chain examples or cause labels.

### G4.PT — reclassified from UNKNOWN to UNKNOWN-confirmed
**New evidence:**
- [SOURCE: 004-graphify/external/graphify/__main__.py:9-18]
- [SOURCE: 004-graphify/external/graphify/__main__.py:108-131]
- [SOURCE: 004-graphify/external/tests/test_claude_md.py:104-136]
**Iter-10 answer:** the hook mechanism is now fully pinned down, but effectiveness is still unmeasured. The repo proves registration hygiene for an echo-only PreToolUse message and nothing about whether Claude actually changes tool-choice behavior because of it.

## Gaps that did NOT improve
- `G1.Q2`: still `partial`; reason: discoverability is better evidenced, but no first-tool latency or fallback benchmark exists.
- `G1.Q9`: still `partial`; reason: the source names the `/clear` remedy components but still never subtracts their token overhead from the stale-resume baseline.
- `G1.RM`: still `partial`; reason: some arithmetic is self-consistent, but the 926-vs-858 session mismatch and 11,357 denominator remain source-bounded.
- `G2.BR`: still `partial`; reason: source defects are real, but no blast-radius precision/recall harness exists to quantify false-positive rate.

## Surprises
- Phase 1 could not satisfy the "open new external files" ideal because its entire external evidence base is one markdown post.
- CodeSight's eval docs mention blast radius, but the actual `GroundTruth` schema and scoring code never implement it. [SOURCE: 002-codesight/external/eval/README.md:7-10] [SOURCE: 002-codesight/external/src/eval.ts:16-22] [SOURCE: 002-codesight/external/src/eval.ts:100-142]
- Contextador's 93% claim is not just an internal constant; it is repeated into generated agent-facing instructions. [SOURCE: 003-contextador/external/src/lib/frameworks/openclaw.ts:5-6] [SOURCE: 003-contextador/external/src/lib/frameworks/openclaw.ts:26-31]
- Graphify's multimodal mismatch is more specific than "stale artifact": the repo knowingly omits the image needed to reproduce the multimodal run. [SOURCE: 004-graphify/external/worked/mixed-corpus/README.md:19-22]

## Handoff to iter-11
- Iter-11 will verify the top 30 findings' citations point to what they claim.
- This iter's new closures (`G2.MR`, `G3.T93`, `G4.T715`, `G4.MM`) should be used when v2 re-renders the gap log and confidence statement.
