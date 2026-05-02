# Iteration 001 - Empirical Analysis of 009 Four-Round Fix Trajectory

## Trajectory summary table

| Round | Review source | Verdict | Iterations | Final finding counts | Fix response |
|---|---:|---|---:|---|---|
| 1 | `run-001-converged-at-6-20260502T132458Z` | CONDITIONAL | 6/10 | P0 0, P1 2, P2 4 | FIX-009 in `79e97aec92` addressed precedence, symlink root handling, resource-map drift, and path wording. |
| 2 | `run-002-v2-conditional-20260502T150011Z` | FAIL | 10/10 | Final adjudicated: P0 1, P1 3, P2 6. Original before downgrade: P0 2, P1 3, P2 5. | FIX-009-v2 in `03d8732764` addressed data.errors redaction, status scope reporting, six-case precedence tests, env isolation, constants/docs, and ADR traceability. |
| 3 | `run-003-v3-fail-1p0-20260502T152609Z` | FAIL | 5/5 | P0 1, P1 0, P2 0 | FIX-009-v3 in `c8ee2e8198` replaced regex-replace with split-then-relativize and added 6 multi-path tests. |
| 4 | `review/` | PASS | 3/3 | P0 0, P1 0, P2 0 | No further fix. The split-then-relativize pattern held across security and correctness verification. |

Source note: the exact mandatory path-filtered command for the 010 meta-research packet returned no rows because the three fix commits touch 009 artifacts, not this 010 research packet. I used `git show -s --format='%h %s%n%b'` on `79e97aec9`, `03d873276`, and `c8ee2e819` as supplemental commit-message evidence.

## Finding-cause-fix matrix

| Finding ID | Round | Severity | Failure Mode (1-5) | Why fix missed it | Prevention pattern |
|---|---:|---|---|---|---|
| R1-P1-001 | 1 | P1 | 4 - partial test matrix | Initial implementation covered default false, env true, and per-call true, but not env true plus explicit `includeSkills:false`. The policy therefore let process env override an explicit one-off end-user scan request. | Require a full precedence matrix whenever env, default, and per-call values interact; table must include absent/true/false for each controlling input. |
| R3-P1-001 | 1 | P1 | 3 - algorithm choice with hidden edge cases | Initial implementation validated `rootDir` with realpath containment but passed the lexical root into indexing. A symlink alias could hide `.opencode/skill` from the segment filter. | When a guard uses canonicalized paths, carry the canonical value into all downstream consumers; add symlink-root tests for path-scope security. |
| R1-P2-001 | 1 | P2 | 4 - partial evidence matrix | Resource-map evidence over-listed Phase 2 handler files that the packet diff had not actually changed. The artifact inventory was not mechanically reconciled against the reviewed diff. | Generate or verify resource-map modified-file sections from a pinned diff range; require reviewer-visible command evidence for the file set. |
| R2-P2-001 | 1 | P2 | 4 - partial evidence matrix | Resource-map evidence omitted the added scope-readiness test and README artifacts. The implementation inventory tracked core code paths but missed adjacent validation/docs artifacts. | Treat tests and docs as first-class changed surfaces in resource-map checks; compare map entries against `git diff --name-only` before synthesis. |
| R4-P2-001 | 1 | P2 | 2 - one-consumer/cross-cutting miss | Initial path-disclosure cleanup did not identify every user-facing scan response/log surface. Validation errors and walker warnings exposed absolute paths through separate consumers. | For any redaction/sanitization rule, enumerate all response fields and log/warning producers before fixing; add response-boundary tests per field. |
| R4-P2-002 | 1 | P2 | 4 - partial evidence matrix | Resource-map coverage again missed broad README/docs/artifact changes visible in the working diff. This was an inventory discipline issue, not a code behavior failure. | Pin packet resource maps to the intended commit range and require "included, excluded, unrelated noise" classification for changed docs/artifacts. |
| R2-I1-P2-001 | 2 | P2 | 2 - one-consumer/cross-cutting miss | FIX-009 introduced a shared glob constant, but sibling representations remained as a regex in `index-scope.ts` and SQL `LIKE` text in `code-graph-db.ts`. The fix centralized one representation, not the full scope contract. | When adding a policy constant, grep for every literal, regex, SQL predicate, and docs spelling of the same contract; either centralize or document why each remains separate. |
| R2-I2-P2-001 | 2 | P2 | 2 - one-consumer/cross-cutting miss | FIX-009 added `index-scope-policy.ts` as the owner module but updated behavior docs without updating topology/key-file docs. Maintainer-facing README consumers were missed. | "New owner module" fixes must update package topology docs, key-file lists, and resource maps in the same pass. |
| R2-I3-P2-001 | 2 | P2 | 1 - single-site fix when class-of-bug exists | The vocabulary sweep checked README prose and obvious user-facing strings but missed readiness metadata returned in blocked tool payloads. It treated the wording problem as a doc-site issue rather than a class of user-visible strings. | Classify wording fixes by output audience, then grep code payload strings, schema descriptions, README text, and status/readiness reasons together. |
| R2-I4-P1-001 | 2 | P1 | 5 - test isolation regression | FIX-009 added env-sensitive behavior but one default-scope scan test inherited `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` from the caller environment. The suite lacked a consistent env capture/delete/restore baseline. | Any test touching env-controlled behavior must capture, clear, and restore the env var in `beforeEach`/`afterEach`; run the focused suite once with the env opt-in enabled. |
| R2-I5-P1-001 | 2 | P1 | 4 - partial test matrix | FIX-009 fixed precedence behavior and had integration coverage, but `code-graph-indexer.vitest.ts` did not pin all six env/per-call combinations. Two rows were left to inference. | Convert precedence coverage to `describe.each` with the full matrix and explicit expected source labels; do not rely on handler tests to cover unit-level policy semantics. |
| R2-I7-P0-001 | 2 | P0 | 2 - one-consumer/cross-cutting miss | FIX-009 redacted invalid-root errors and warnings, but successful scan `data.errors` still interpolated raw `result.filePath`. The fix targeted visible error surfaces only, not every scan response field. | Redaction fixes need an exhaustive response schema audit: `error`, `data.errors`, `data.warnings`, logs, thrown errors, and nested diagnostic objects must each have tests. |
| R2-I8-P0-001 | 2 | P2, downgraded from P0 | 4 - partial evidence matrix | The review used a moving `main~1..HEAD` range after HEAD had advanced beyond the FIX-009 commit, so the resource-map comparison produced a false regression. The process lacked a pinned remediation SHA contract. | Deep-review reruns should record and use the fix commit SHA or explicit diff range in config/prompts; moving branch-relative ranges should be forbidden for regression adjudication. |
| R2-I8-P2-001 | 2 | P2 | 2 - one-consumer/cross-cutting miss | The precedence decision was captured in ADR-002, but the requested ADR-001 sub-decision table still had only five rows. The fix updated one decision surface and missed a related traceability consumer. | For docs fixes, enumerate all named document surfaces in the review finding and mark each "updated, intentionally unchanged, or superseded" with a reason. |
| R2-I8-P2-002 | 2 | P2 | 4 - partial evidence matrix | The remediation summary named fix classes but did not provide file:line evidence for all six fixes. Evidence existed elsewhere, but not in the requested summary section. | Require implementation summaries for fix packets to include a finding-to-file:line table, even when checklist evidence already exists. |
| R2-I9-P1-001 | 2 | P1 | 2 - one-consumer/cross-cutting miss | FIX-009 fixed scan precedence, but `code_graph_status` recomputed active scope from ambient env and could not represent a one-off scan override. The changed policy's downstream status consumer was not audited. | After changing a policy function, list all consumers that report, persist, compare, or infer that policy; add at least one cross-tool test that exercises scan then status. |
| RUN3-I3-P0-001 | 3 | P0 | 3 - algorithm choice with hidden edge cases | FIX-009-v2 used regex-replace to redact absolute paths, so joined tokens like `/workspace/a.ts:/workspace/b.ts` were treated as one match and left the second absolute path behind. The patch fixed the known single-path instance but not the delimiter class. | Prefer split-and-process when the invariant is "redact every embedded segment"; add adversarial delimiter tables before declaring security redaction complete. |

## Failure-mode frequency

| Failure Mode | Count | Share | Observed shape in 009 |
|---|---:|---:|---|
| 1 - single-site fix when class-of-bug exists | 1 | 5.9% | The readiness wording issue was treated as a README/prose sweep instead of a user-visible-output class. |
| 2 - one-consumer fix when cross-cutting | 6 | 35.3% | Scan was fixed but status was not; warnings were redacted but `data.errors` was not; owner modules were added but topology/docs/SQL/regex consumers lagged. |
| 3 - algorithm choice with hidden edge cases | 2 | 11.8% | Symlink/canonical path flow and regex redaction both failed under adversarial path shapes. |
| 4 - partial test/evidence matrix | 7 | 41.2% | The most common issue: missing precedence rows, missing resource-map entries, moving diff ranges, and incomplete evidence tables. |
| 5 - test isolation regressions | 1 | 5.9% | Env-sensitive tests inherited maintainer shell state and failed under the documented opt-in env. |

Denominator: 17 unique final/adjudicated findings across rounds 1-3. Run 4 produced no findings. The run-3 duplicate discovery (`RUN3-I2-P0-001`) is counted once under the final report ID `RUN3-I3-P0-001`.

## Initial pattern observations

The dominant pattern is not "the fix was too small" in a generic sense. It is more specific: fixes lacked an explicit surface enumeration step. Modes 2 and 4 account for 13 of 17 findings, so most misses came from unlisted consumers, incomplete matrices, or evidence drift rather than subtle production logic.

The fresh-context LEAF reviews did add value. Round 2 found genuinely different surfaces from round 1: test isolation, status reporting, `data.errors`, docs topology, ADR placement, and constants. But those were mostly neighboring expressions of the same classes of bugs, which means adversarial diversity worked while also exposing fix narrowness.

The trajectory also shows a severity-calibration hazard. `R2-I8-P0-001` was a process artifact caused by a moving diff range and later downgraded. Regression review prompts should pin the fix SHA, because branch-relative ranges can manufacture a blocker out of unrelated HEAD drift.

The final round is the clearest algorithm lesson. FIX-009-v2 tried to harden a regex around more delimiters; FIX-009-v3 changed the shape of the algorithm to split, transform absolute-looking segments, and rejoin delimiters. That closed the class of bug and passed the clean verification sweep.

Preliminary answer to research question 6: the reviewers found both genuinely different findings and same-class misses in new locations. The stronger signal is fix narrowness plus missing surface enumeration, not random reviewer disagreement.

Preliminary answer to research question 7: the safer default fix prompt should be "fix this finding and justify sibling/consumer coverage." For this packet, "fix this finding" alone repeatedly optimized for the cited line and left adjacent surfaces to the next review round.
