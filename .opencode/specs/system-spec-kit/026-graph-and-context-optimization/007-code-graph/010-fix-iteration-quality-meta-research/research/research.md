# Research Synthesis — Fix-Iteration Quality Meta-Research

**Generated:** 2026-05-02T16:13:09.752Z
**SessionId:** 2026-05-02T15:45:24.467Z
**Iterations:** 5 of 5
**Executor:** cli-codex gpt-5.5 reasoning=xhigh service_tier=fast

## Topic

Why did the 009-end-user-scope-default packet require 4 review rounds (Run 1 CONDITIONAL → FIX-009 → Run 2 FAIL → FIX-009-v2 → Run 3 FAIL → FIX-009-v3 → Run 4 PASS) to converge clean? What changes to FIX prompts, sk-code-review skill, and sk-deep-review convergence rules would compress this cycle?

## Table of Contents

- [Iteration 1 (11.4 KB)](#iteration-1)
- [Iteration 2 (13.0 KB)](#iteration-2)
- [Iteration 3 (23.9 KB)](#iteration-3)
- [Iteration 4 (15.9 KB)](#iteration-4)
- [Iteration 5 (31.8 KB)](#iteration-5)

---


## Iteration 1

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


---


## Iteration 2

# Iteration 002 - Historical Packet Audit

## Audit method

I audited sibling packets under:

`../001-code-graph-upgrades` through `../008-code-graph-backend-resilience`

The first pass was a packet artifact inventory:

```bash
find .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph -maxdepth 2 -type d | sort
rg --files .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph | rg '/(00[1-8][^/]*)/(implementation-summary|decision-record|review-report)\.md$|/(00[1-8][^/]*)/(review|research)/'
```

Then I checked the current path git history and widened it when the current path under-reported renamed packets:

```bash
git log --all --date=short --pretty=format:'%h%x09%ad%x09%s' -- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph
git log --all --date=short --pretty=format:'%h%x09%ad%x09%s' --grep='fix('
git log --all --date=short --pretty=format:'%h%x09%ad%x09%s' -- .opencode/specs/system-spec-kit/026-graph-and-context-optimization
```

Important caveat: the current `007-code-graph` packet names are post-consolidation names. Older commits often used prior phase IDs such as `026/009/015`, `013`, `015`, or generic `fix(026)` subjects. So I treated the on-disk packet artifacts as authoritative and used commit subjects as secondary trajectory evidence, not as the only source of truth.

For each candidate packet I read the active or nested `implementation-summary.md`, `decision-record.md` where present, `review/review-report.md`, `review/deep-review-state.jsonl`, and `research/deep-research-state.jsonl` where present. Key direct reads included:

- `001-code-graph-upgrades/implementation-summary.md`, `review/review-report.md`, `review/deep-review-state.jsonl`
- `002-code-graph-self-contained-package/implementation-summary.md`
- `003-code-graph-context-and-scan-scope/implementation-summary.md`, `research/deep-research-state.jsonl`
- `004-code-graph-hook-improvements/implementation-summary.md`, `review/review-report.md`, `review/deep-review-state.jsonl`
- `005-code-graph-advisor-refinement/implementation-summary.md`, `decision-record.md`, `review/015-code-graph-advisor-refinement-pt-01/review-report.md`, `review/015-code-graph-advisor-refinement-pt-01/deep-review-state.jsonl`, `research/015-code-graph-advisor-refinement-pt-01/deep-research-state.jsonl`, `applied/B1.md` through `applied/B6.md`, and `applied/F35-calibration.md`
- `006-code-graph-doctor-command/implementation-summary.md`
- `007-code-graph-resilience-research/implementation-summary.md`, `decision-record.md`, `research/deep-research-state.jsonl`
- `008-code-graph-backend-resilience/implementation-summary.md`, `review/review-report.md`, `review/deep-review-state.jsonl`

I also did a broader quick scan of the 026 tree for `review-report.md`, `deep-review-state.jsonl`, and repeated `fix(...)` subjects. I did not include broad-tree packets in the frequency denominator unless I read their artifacts closely enough to classify them.

## Multi-round packet table

| Packet | Rounds-to-clean | Failure modes seen (1-5) | Compressible? |
|---|---:|---|---|
| `001-code-graph-upgrades` | 2 review iterations, then 1 post-remediation verification record (`run:25`) | 2, 4 | Yes. This was a small wrong-surface traceability drift: scratch prompts asked for detector provenance on `code_graph_status`, while the live surface was `code_graph_scan`. A single response-surface inventory would have compressed it. |
| `003-code-graph-context-and-scan-scope` | 5-iteration research diagnosis, then 2 absorbed implementation sub-phases (`001-incremental-fullscan-recovery`, `002-cross-file-dedup-defense`) | 3, 4 | Mostly yes. The core bug was algorithmic: `indexFiles()` applied the stale gate even for full scans, and duplicate symbol IDs surfaced later. A full-vs-incremental truth table plus cross-file uniqueness tests would likely have collapsed both rounds into one. |
| `004-code-graph-hook-improvements` | Not clean in audited artifacts. Ten review iterations converged with 5 P1 + 5 P2, and the implementation summary still records strict-validation blockers. | 2, 3, 4 | Partially. The findings are compressible by surface enumeration, but I found no clean closure artifact. Misses spanned query ranking, context seed shape, deadline accounting, no-op incremental scan semantics, runtime parity evidence, and missing packet-local reports. |
| `005-code-graph-advisor-refinement` | 20 research iterations, 7 review iterations, then at least 3 remediation waves: B1-B5, F35, B6. Final summary claims PASS after B6. | 2, 3, 4, 5 | Partially. The initial 11 P1 + 3 P2 were compressed into coherent batches, which is the good version of broad remediation. B6 shows the residual non-compressible part: later daemon-hardening changed one runtime truth and regressed the Python compat shim plus playbook inventory. |
| `008-code-graph-backend-resilience` | 10 review iterations, then 3 fix commits: `f8c37631e2`, `6fd20b1a29`, `ddfe5b1b1b`. P0/P1 axis clean after the third; P2s deferred. | 2, 3, 4 | Partially. The first fix closed the main deep-review set, but the canonical-path security fix leaked canonical paths into emitted paths and needed a regression fix. The later sk-code-opencode audit was a separate maintainability/style pass. |
| `009-end-user-scope-default` (baseline from iteration 001) | 4 review/fix rounds: initial implementation, FIX-009, FIX-009-v2, FIX-009-v3, final clean review | 1, 2, 3, 4, 5 | No, not with the original fix prompt. It became clean only after the fix changed abstraction from regex replacement to split-then-relativize and after downstream consumers/status surfaces were enumerated. |

Non-multi-round or non-fix sibling packets:

- `002-code-graph-self-contained-package` was a migration packet with complete local verification and a sandboxed git-staging blocker. I found no review/fix loop in packet artifacts.
- `006-code-graph-doctor-command` shipped Phase A diagnostic-only and explicitly deferred Phase B to `007`; no deep-review or fix loop found.
- `007-code-graph-resilience-research` was research-only. It produced four assets and unblocked doctor apply-mode work, but it is not itself a fix trajectory.

Broader 026 quick-scan signal:

- `008-skill-advisor/007-skill-advisor-hook-surface` has `review-archive-r01-copilot`, `review-archive-r02-codex-copilot`, and current review artifacts. This looks structurally similar to the 009 multi-round pattern, but I did not deep-read it in this iteration.
- `000-release-cleanup/032-release-readiness-deep-review-program` has ten review reports and a later synthesis/remediation track. This is program-level batching rather than one packet needing repeated same-scope fixes.
- `000-release-cleanup/049-deep-research-finding-remediation` shows one fix commit per remediation child on 2026-05-01. That is the opposite shape from 009: findings were pre-partitioned by subsystem before fixes landed.

## Failure-mode frequency across audited packets (combined with iter-1 numbers)

The iteration-001 numbers for `009` are exact finding-level counts from the prior matrix. The sibling counts below are audit-coded finding-equivalents: I split compound review findings when the report named independent failure shapes, and I counted remediation-only regressions such as `005` B6 and `008` canonical-path leak when they required another fix round.

| Failure mode | Iter-1 `009` count | Sibling audit-coded additions | Combined count | Read from this audit |
|---|---:|---:|---:|---|
| 1 - single-site fix when class-of-bug exists | 1 | 1 | 2 | Rare in this sample as a standalone cause. It appears more often as a subcase of mode 2 or 4. |
| 2 - one-consumer fix when cross-cutting | 6 | 18 | 24 | Very common. Examples: status vs scan surface in `001`; seed `file` vs `filePath` in `004`; startup/context/query trust-state consumers in `005`; verify/rootDir and resolver boundary surfaces in `008`. |
| 3 - algorithm choice with hidden edge cases | 2 | 13 | 15 | Common in path, parser, resolver, and scan logic. Examples: full scans still using stale-gate filtering in `003`; candidate-window ranking and deadline undercount in `004`; canonical comparison leaking into emitted paths in `008`; regex redaction in `009`. |
| 4 - partial test/evidence matrix | 7 | 20 | 27 | Most frequent overall. Examples: missing full-vs-incremental scan rows in `003`; missing runtime parity and evidence inventory rows in `004`; stale implementation summary and skipped benches in `005`; missing direct REQ coverage in `008`; precedence/resource-map rows in `009`. |
| 5 - test isolation regressions | 1 | 2 | 3 | Less frequent but high leverage. Examples: `005` benches included in default Vitest path, settings parity skipped all assertions outside Claude, and `009` env-sensitive scan tests inherited caller state. |

Main result: mode 4 and mode 2 dominate. That holds both in the `009` baseline and in siblings. The multi-round pattern is therefore not primarily "agent made random mistakes." It is usually "the first fix lacked an explicit surface/matrix enumeration step."

Security sensitivity is not the only predictor. Security/path work makes mode 2 and mode 3 more dangerous, as seen in `008` verifier/rootDir and canonical-path behavior. But correctness and maintainability packets show the same pattern: `004` query/context/scan semantics, `005` bench/test infrastructure, and `001` prompt/status surface drift were not mainly security work.

## Patterns: which packets compressed naturally vs not, and why

`001` compressed naturally because it had one wrong public surface and a direct verification surface. The review found the mismatch, the post-remediation record verified it, and there was no evidence of sibling consumers beyond scan/status.

`003` was also naturally compressible once the bug was named correctly. The first symptom was "scan returned 33 files", but the useful abstraction was "full scans and incremental scans need different stale-gate semantics." Once the fix was reframed as a mode matrix, the duplicate-symbol defense became a second narrow invariant rather than another open-ended review loop.

`004` did not compress cleanly in the artifacts I found. The report spans separate handler behaviors, test realism, runtime parity, and missing packet-local evidence. That is exactly the shape where a fix prompt needs an affected-surface table before editing: query, context, scan, startup hooks, tests, packet docs, and resource-map evidence each needed a line saying "changed, checked, or intentionally unchanged." Without that, the packet can look implemented while review remains conditional.

`005` is the strongest example of productive batching. The deep-review report ended with 11 P1 + 3 P2, but the remediation plan grouped them into B1-B5 by dependency and surface. That prevented a 009-style "one finding, one tiny patch, rerun" loop. The catch is B6: cross-packet daemon-hardening changed an invariant after the main remediation and regressed a compatibility shim. That kind of follow-on regression is not solved by a broader original fix prompt unless the prompt explicitly asks for external consumers and alternate executor surfaces.

`008` compressed the main review well but still needed follow-up. `f8c37631e2` fixed all 5 P0 and 12 P1 deep-review findings in eight batches. Then `6fd20b1a29` fixed the canonical-path leak caused by one of those fixes, and `ddfe5b1b1b` closed a separate sk-code-opencode P0/P1 audit. The lesson is precise: canonicalization fixes need a two-channel invariant. Use canonical paths for comparison, but preserve display/original paths for emitted records unless the product contract says otherwise.

`009` did not compress until the algorithm changed. The first two fixes were too tied to visible review findings. The final successful fix switched from regex replacement to split-then-relativize, which matched the class of bug. This is the cleanest evidence for changing the FIX prompt default from "fix this finding" to "fix this finding and prove the sibling/consumer/class boundary."

Preliminary answer to research question 1: mode 4 is most frequent, with mode 2 close behind. The practical distinction matters less than it seems: both are prevented by making the fixer enumerate the matrix or surface set before writing code.

Preliminary answer to research question 2: multi-round fixes are not limited to security-sensitive code. Security-sensitive path/code-graph work amplifies severity, but correctness, docs, benchmark, and runtime-parity packets show the same failure modes.

Preliminary answer to research question 3: a broader-scope fix does add up-front time, but the sibling evidence suggests it is worthwhile when the finding names a policy, path normalization, public response field, env behavior, or test matrix. It is probably not worthwhile for `001`-style one-surface prompt drift.

Preliminary answer to research question 5: yes. Fix-oriented planning should require an "Affected Surfaces" section for changed policies/functions, including direct callers, response fields, tests, docs/resource maps, and executor/runtime variants. `004`, `005`, `008`, and `009` each would have benefited from that enumeration.


---


## Iteration 3

# Iteration 003 - Algorithm and Pattern Catalog

## Evidence base

This iteration converts the empirical 009 trajectory and sibling-packet audit into reusable fix patterns. I used iteration 001's finding matrix, iteration 002's packet-frequency audit, the 009 review archives, current clean 009 code, and selected sibling remediation reports from 005 and 008.

The key distinction I am using:

- Mode 1 is a same-class miss inside the local failure family: one error field, string family, literal family, or output field was fixed while sibling sites of that same class remained unfixed.
- Mode 2 is a cross-consumer miss: one handler or consumer was fixed while another public path, status/readiness path, database path, documentation path, or runtime variant still reflected the old contract.
- Mode 4 is not "more sites." It is an incomplete truth table or evidence matrix where the implementation might be right but the proof does not enumerate every required row.

## Failure Mode 1 - Single-site fix when a class-of-bug exists

### WRONG

The wrong pattern is fixing the cited line, not the error class.

Concrete 009 example: FIX-009 handled invalid-`rootDir` errors and scan warnings but missed successful scan `data.errors`. Run 2 found `R2-I7-P0-001`: `handleCodeGraphScan()` was still building returned errors from raw `result.filePath` values. The original wrong shape was visible in the FIX-009-v2 diff:

```ts
errors.push(`${result.filePath}: ${err instanceof Error ? err.message : String(err)}`);
errors.push(...result.parseErrors.map(e => `${result.filePath}: ${e}`));
```

That was a single-site fix failure because all of these are user-visible scan error-string emitters, even though they appear in different branches (`payload.error`, `data.warnings`, `data.errors`).

A smaller 009 example is `R2-I3-P2-001`: the ADR-005 wording sweep checked README/user prose and obvious output strings, but missed readiness metadata text (`candidate manifest drift`) returned in blocked tool payloads. The fix treated "bad vocabulary" as a docs/prose site instead of a class of user-visible strings.

### RIGHT

The right pattern is a class inventory before editing. For 009, the clean state now has:

- `relativize()` for one path value.
- `relativizeScanMessage()` for embedded message strings.
- `relativizeScanWarning()` and exported `relativizeScanError()` as named wrappers.
- `errors: errors.slice(0, 10).map(error => relativizeScanError(error, canonicalWorkspace))`.
- `warnings: ...map(warning => relativizeScanWarning(warning, canonicalWorkspace))`.
- tests for invalid roots, out-of-workspace roots, scan warnings, `data.errors`, and multi-path messages.

The generalized right pattern is: list every producer of the bug class, assign one helper or policy per class, then prove each producer either calls the helper or is not user-visible.

The sibling packet 005 B2 is the same good shape in a different domain. The remediation did not normalize one metrics emission site and stop; it introduced closed-vocabulary label normalization and then applied it to runtime and freshness label emitters before the collector can create new series.

### DETECTION

A FIX prompt or reviewer should suspect this wrong pattern when the fix changes one call site for a repeated concept and the review finding was phrased as a class: "absolute paths in errors," "internal vocabulary in user-visible messages," "unbounded label cardinality," "raw path disclosure," "unsafe string interpolation," "stale docs inventory."

Run a producer inventory, not a diff-only inspection:

```bash
SCAN=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
rg -n 'error:|errors:|errors\.push|warnings:|warnings\.push|throw new Error|JSON.stringify' "$SCAN"
rg -n 'relativizeScan(Error|Warning|Message)|relativize\(' "$SCAN"
```

For wording or vocabulary fixes, search across response builders and schemas, not only README text:

```bash
rg -n -i 'preset|capabilit(y|ies)|kind|manifest|candidate manifest' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph \
  --glob '*.ts' --glob '*.md'
```

The wrong pattern is present if new or edited user-facing emitters are not accounted for in the helper/policy grep.

### CHECKLIST

Self-verifying 009 gate for the raw-path class:

```bash
SCAN=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
! rg -n 'errors\.push\(`\$\{result\.filePath\}|parseErrors\.map\(e => `\$\{result\.filePath\}' "$SCAN"
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-scan.vitest.ts \
    -t 'invalid rootDir|out-of-workspace rootDir|scan warnings|data.errors|relativizeScanError multi-path safety'
```

Self-verifying vocabulary-class gate:

```bash
rg -n -i 'candidate manifest drift|preset|capabilities' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph \
  --glob '*.ts' --glob '*.md'
```

Expected result after a fix: either no user-facing matches, or each match is explicitly documented as an internal schema discriminator or maintainer-only field.

## Failure Mode 2 - One-consumer fix when the change is cross-cutting

### WRONG

The wrong pattern is fixing the producer path while leaving another consumer to recompute, re-state, or re-document the old contract.

Concrete 009 example: FIX-009 correctly made `code_graph_scan({ includeSkills:false })` override `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, but Run 2 found `R2-I9-P1-001`: `code_graph_status` still computed active scope from ambient env only. That meant an env-enabled maintainer process could run a one-off end-user scan, then status would immediately report the env-enabled scope instead of the stored scan scope.

The pre-fix wrong consumer shape was:

```ts
const activeScopePolicy = resolveIndexScopePolicy();
```

in the status handler, disconnected from the scan's stored fingerprint/source.

Other 009 examples:

- `R2-I1-P2-001`: the skill-scope contract existed as a new policy constant, but regex/SQL/doc representations still carried sibling forms.
- `R2-I2-P2-001`: `index-scope-policy.ts` became the owner module, but README topology/key-file docs did not name it.
- `R2-I8-P2-001`: precedence was captured in ADR-002, but the requested ADR-001 sub-decision table still had only five rows.

Sibling example from 001: scratch prompts asked for detector provenance on `code_graph_status`, while the live surface was `code_graph_scan`. The wrong surface was being verified.

### RIGHT

The right pattern is an affected-consumers table. For 009, the clean status path now does this:

```ts
const storedScope = graphDb.getStoredCodeGraphScope();
const activeScopePolicy = parseIndexScopePolicyFromFingerprint(storedScope) ?? resolveIndexScopePolicy();
const scopeMismatch = storedScope.fingerprint !== activeScopePolicy.fingerprint;
```

The test then exercises scan plus status in one flow: set env true, scan with `includeSkills:false`, replay the stored policy through `getStoredCodeGraphScope`, call `handleCodeGraphStatus()`, and assert `activeScope === storedScope` with `scopeMismatch:false`.

The strongest good sibling example is packet 005's remediation plan. The review grouped 11 P1 and 3 P2 findings into batches by consumer surface:

- B1: trust-state and freshness consumers.
- B2: metrics label policy and benchmark harness consumers.
- B3: deletion inventory and packet traceability consumers.
- B4: hook settings execution, parity tests, and docs.
- B5: corpus path parity consumers.

That batching prevented a one-finding, one-patch loop. It is the right form of broader-scope remediation.

### DETECTION

Look for a changed policy/function with more than one consumer. If the fix only touches the initially reported handler, assume it is incomplete until a consumer grep proves otherwise.

For the 009 scope policy:

```bash
rg -n 'resolveIndexScopePolicy|parseIndexScopePolicyFromFingerprint|setCodeGraphScope|getStoredCodeGraphScope|activeScope|storedScope|scopeMismatch' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph \
  --glob '*.ts'
```

For any changed function:

```bash
SYMBOL=resolveIndexScopePolicy
rg -n "($SYMBOL|from '../lib/index-scope-policy|from \"../lib/index-scope-policy)" \
  .opencode/skill/system-spec-kit/mcp_server \
  --glob '*.ts'
```

The wrong pattern is present if the consumer list is larger than the test/fix list and the skipped consumers have no explicit unchanged rationale.

### CHECKLIST

Self-verifying 009 gate:

```bash
STATUS=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
! rg -n 'activeScopePolicy\s*=\s*resolveIndexScopePolicy\(\)' "$STATUS"
rg -n 'parseIndexScopePolicyFromFingerprint\(storedScope\).*resolveIndexScopePolicy' "$STATUS"
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-scan.vitest.ts \
    -t 'reports status activeScope from the stored scan scope|lets includeSkills false override'
```

Generic consumer gate for future FIX prompts:

```bash
SYMBOL='<changedFunctionOrPolicy>'
rg -n "$SYMBOL" . --glob '*.ts' --glob '*.js' --glob '*.md'
```

The FIX response must include a table with every match classified as `updated`, `covered by existing invariant`, `intentionally unchanged`, or `not a consumer`.

## Failure Mode 3 - Algorithm choice with hidden edge cases

### WRONG

The wrong pattern is patching the observed input shape with a local regex or condition when the invariant is actually structural.

Concrete 009 example: FIX-009-v2 added `relativizeScanError()` with a regex-replace strategy:

```ts
return error.replace(/\/[^\s'"`{}\[\],)]+/g, match => relativize(match, workspaceRoot));
```

Run 3 found `RUN3-I3-P0-001`: joined tokens such as `/workspace/src/a.ts:/workspace/src/b.ts` and `/workspace/src/a.ts\0/workspace/src/b.ts` could be treated as one path-like match, so only the first path was relativized and the second absolute path survived. The algorithm was fighting delimiters one exclusion at a time.

Sibling examples:

- Packet 003: full scans and incremental scans shared stale-gate semantics, so a full scan could still behave like an incremental stale-filtered scan.
- Packet 008: canonical path comparison was needed for security, but canonical paths leaked into emitted paths. The invariant needed two channels: canonical for comparison, original/display for output.

### RIGHT

The right pattern is to encode the invariant directly.

For 009, FIX-009-v3 replaced regex-replace with split-then-process:

```ts
const PATH_DELIMITERS = /([\s:'"`{}\[\],()\x00]+)/;

function relativizeScanMessage(message: string, workspaceRoot: string): string {
  return message.split(PATH_DELIMITERS).map(segment => {
    if (segment.startsWith('/')) {
      return relativize(segment, workspaceRoot);
    }
    return segment;
  }).join('');
}
```

The invariant becomes "each absolute-looking segment is independently transformed; delimiters are preserved." The test table covers colon-delimited, NUL-delimited, quoted, bracketed, mixed-delimiter, and no-op inputs.

For packet 008, the right invariant is "canonicalize before containment checks; preserve display/original path semantics for emitted data unless the public contract says otherwise." That would have caught the canonical-path leak earlier.

### DETECTION

Suspect the wrong pattern when:

- The fix uses `.replace(/.../g)` on unstructured messages, paths, SQL, command text, or serialized payloads.
- The test added for a security/string bug has only one happy-path or one regression input.
- The edge case is a delimiter, escaping, casing, symlink, nested config, or fallback path.
- A reviewer can create a failing input by concatenating two valid examples.

Concrete detection for the 009 wrong approach:

```bash
rg -n 'replace\(/\\/\[\^|relativizeScan(Error|Warning)\(.*replace|PATH_DELIMITERS|split\(PATH_DELIMITERS\)' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
```

Wrong smell: regex replacement exists without a structural split/parser and without adversarial table coverage.

### CHECKLIST

Self-verifying 009 gate:

```bash
SCAN=.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
TEST=.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
! rg -n 'relativizeScan(Error|Warning).*replace|replace\(/\\/\[\^' "$SCAN"
rg -n 'PATH_DELIMITERS|split\(PATH_DELIMITERS\)' "$SCAN"
rg -n 'colon-delimited|NUL-delimited|quoted path|bracketed path list|mixed delimiters|no abs paths' "$TEST"
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-scan.vitest.ts \
    -t 'relativizeScanError multi-path safety'
```

Generic algorithm gate:

```bash
rg -n '\.replace\(|new RegExp|startsWith\(|includes\(|split\(' <changed-files>
```

For every match in the changed algorithm, the FIX response must name the invariant and list adversarial cases. A one-row regression test is not enough for path, redaction, parser, resolver, or precedence logic.

## Failure Mode 4 - Partial test or evidence matrix

### WRONG

The wrong pattern is testing the row that failed in review and assuming neighboring rows are implied.

Concrete 009 examples:

- Run 1 `R1-P1-001`: the original precedence tests missed the env-true plus explicit `includeSkills:false` row, so env could override an explicit one-off end-user scan.
- Run 2 `R2-I5-P1-001`: FIX-009 production code was correct, but `code-graph-indexer.vitest.ts` still did not pin the full six-case scope precedence matrix. Missing examples included `(env=undefined, includeSkills=false)` and `(env=true, includeSkills=true source=scan-argument)`.
- Run 2 resource-map drift: review used a moving `main~1..HEAD` range after HEAD advanced, manufacturing a regression. That is an evidence-matrix bug: the reviewed diff range was not pinned to the remediation SHA.

Sibling examples:

- Packet 008 review found five P0 traceability blockers because implementation docs claimed direct REQ coverage, but tests did not directly execute many REQ-002 through REQ-015 behaviors.
- Packet 004 review had missing runtime parity/evidence rows across query, context, scan, startup hooks, tests, and packet-local reports.

### RIGHT

The right pattern is an explicit matrix before implementation is declared complete.

For 009, the clean unit matrix is:

```ts
it.each([
  [undefined, undefined, false, 'default'],
  [undefined, true, true, 'scan-argument'],
  [undefined, false, false, 'scan-argument'],
  ['true', undefined, true, 'env'],
  ['true', true, true, 'scan-argument'],
  ['true', false, false, 'scan-argument'],
] as const)
```

That table covers the legal input states: env absent vs true, per-call absent vs true vs false, with impossible duplicate absent rows removed. It also asserts not only the boolean output but the source label.

For evidence packets, the right pattern is a pinned source of truth: fix commit SHA or explicit diff range, plus a finding-to-file:line table. Packet 005's applied reports are a good example: each batch records source findings, target files, before/after evidence, and verification commands.

### DETECTION

A FIX prompt or reviewer should identify all independent axes before accepting the test suite:

- env/default/per-call
- true/false/absent/null/rejected
- full/incremental
- fresh/stale/empty/error
- root inside workspace/symlink/outside/broken
- direct handler/status/readiness/database/docs
- native/codex/copilot/claude/gemini runtime variants

The wrong pattern is present if a test name says "matrix" but row count is smaller than the legal state count, or if packet docs claim REQ coverage without direct test evidence.

Concrete 009 matrix-row check:

```bash
TEST=.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
sed -n '/resolveIndexScopePolicy precedence matrix/,/] as const/p' "$TEST"
```

Concrete evidence-range check:

```bash
git rev-parse --verify HEAD
git diff --name-only <FIX_SHA>^..<FIX_SHA>
```

Wrong smell: the review/checklist refers to `main~1..HEAD` or an unpinned branch-relative range after parallel commits landed.

### CHECKLIST

Self-verifying 009 matrix gate:

```bash
TEST=.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
rows=$(sed -n '/resolveIndexScopePolicy precedence matrix/,/] as const/p' "$TEST" | rg -c "^\s*\[(undefined|'true')")
test "$rows" -eq 6
cd .opencode/skill/system-spec-kit/mcp_server &&
  npx vitest run code_graph/tests/code-graph-indexer.vitest.ts \
    -t 'resolveIndexScopePolicy precedence matrix'
```

Self-verifying direct-coverage gate for REQ-heavy packets:

```bash
PACKET=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience
rg -n 'REQ-00[2-9]|REQ-01[0-5]' "$PACKET"/spec.md "$PACKET"/checklist.md "$PACKET"/implementation-summary.md
rg -n 'REQ-00[2-9]|REQ-01[0-5]' .opencode/skill/system-spec-kit/mcp_server --glob '*.{vitest,test}.ts'
```

Expected result: every claimed requirement has direct test evidence or the packet docs explicitly downgrade the claim from direct to indirect coverage.

## Failure Mode 5 - Test isolation regressions

### WRONG

The wrong pattern is adding tests for env-controlled or global-state behavior while inheriting the caller's process state.

Concrete 009 example: Run 2 found `R2-I4-P1-001`. `code-graph-scan.vitest.ts` had a default-scope assertion that assumed `SPECKIT_CODE_GRAPH_INDEX_SKILLS` was unset, but its `beforeEach` reset mocks only. Under the documented maintainer shell state:

```bash
SPECKIT_CODE_GRAPH_INDEX_SKILLS=true npx vitest run code_graph/tests/code-graph-scan.vitest.ts
```

the default-scope test failed because production correctly read the env opt-in.

Sibling examples:

- Packet 005 B2: benchmark tests set `SPECKIT_METRICS_ENABLED=true` and needed explicit restore plus metrics collector reset.
- Packet 005 B6: daemon-hardening changed runtime truth; tests that did not distinguish freshness artifacts from daemon trust collapsed outputs to `unavailable`.

### RIGHT

The right pattern is a full test-state bracket:

```ts
let originalIndexSkillsEnv: string | undefined;

beforeEach(() => {
  originalIndexSkillsEnv = process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
  delete process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
});

afterEach(() => {
  if (originalIndexSkillsEnv === undefined) {
    delete process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
  } else {
    process.env[CODE_GRAPH_INDEX_SKILLS_ENV] = originalIndexSkillsEnv;
  }
});
```

For metrics/global collectors, the bracket also resets in-memory state after restore. Packet 005 B2 did this for `SPECKIT_METRICS_ENABLED` and `speckitMetrics.reset()`.

### DETECTION

Search for process-wide state writes in tests and bench files. Any write must have a same-file capture/restore bracket, and suites that assert default behavior must actively clear the relevant env in `beforeEach`.

```bash
rg -n 'process\.env(\[[^\]]+\]|\.[A-Z0-9_]+)\s*=|delete process\.env|speckitMetrics\.reset|vi\.stubEnv|vi\.unstubAllEnvs' \
  .opencode/skill/system-spec-kit/mcp_server \
  --glob '*.{vitest,test,bench}.ts'
```

Wrong smell: a test sets `process.env.X = ...` inside one case, or relies on default env absence, without top-level `beforeEach` and `afterEach` restoring the original value.

### CHECKLIST

Self-verifying 009 isolation gate:

```bash
cd .opencode/skill/system-spec-kit/mcp_server &&
  SPECKIT_CODE_GRAPH_INDEX_SKILLS=true npx vitest run \
    code_graph/tests/code-graph-scan.vitest.ts \
    code_graph/tests/code-graph-indexer.vitest.ts \
    code_graph/tests/code-graph-scope-readiness.vitest.ts
```

Self-verifying source audit:

```bash
rg -n 'original.*Env|beforeEach\(\(\) => \{|afterEach\(\(\) => \{|delete process\.env\[CODE_GRAPH_INDEX_SKILLS_ENV\]' \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts \
  .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts
```

Generic global-state gate:

```bash
ENV_NAME='<ENV_OR_GLOBAL_NAME>'
rg -n "$ENV_NAME|original.*Env|afterEach|finally|reset\\(" <changed-test-files>
```

Expected result: every env/global write has a restore path that runs on assertion failure, and default-behavior tests pass under the opposite caller environment.

## Universal "fix completeness checklist"

Use this as the default FIX prompt checklist for security-sensitive or cross-cutting code. A narrow "fix this finding" prompt is acceptable only after the fixer proves the finding is instance-only.

1. **Classify the finding.**

   State one of: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. If the answer is unknown, default to class/cross-consumer until grep proves otherwise.

2. **Inventory same-class producers.**

   ```bash
   rg -n '<field|string|helper|literal|error-pattern>' <changed-files-or-module>
   rg -n 'errors\.push|warnings\.push|throw new Error|JSON.stringify|return \{.*error|message:' <changed-files-or-module>
   ```

   Output a table: `site`, `user-visible?`, `fixed?`, `test?`, `rationale`.

3. **Inventory consumers of changed functions or policies.**

   ```bash
   rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'
   ```

   Every consumer is `updated`, `covered unchanged`, `intentionally unchanged`, or `not a consumer`.

4. **Replace fragile algorithms with invariant-shaped logic.**

   ```bash
   rg -n '\.replace\(|new RegExp|startsWith\(|includes\(|split\(' <changed-files>
   ```

   For each changed algorithm, write adversarial tests before declaring done. Required for path/redaction/parser/resolver/security code: multiple delimiters, two valid examples joined together, outside-root input, empty/no-op input, and one fallback-path input.

5. **Build the full matrix.**

   List every independent axis and row count before testing. The test table must include output and source/provenance labels, not only booleans.

   ```bash
   rg -n 'it\.each|test\.each|describe\.each|REQ-|source:' <changed-tests-and-packet-docs>
   ```

6. **Pin evidence to a SHA or explicit range.**

   ```bash
   git rev-parse --verify HEAD
   git diff --name-only <FIX_SHA>^..<FIX_SHA>
   ```

   Avoid moving ranges such as `main~1..HEAD` in remediation review evidence.

7. **Run the hostile environment variant.**

   ```bash
   env <RELEVANT_ENV>=true <focused-test-command>
   env -u <RELEVANT_ENV> <focused-test-command>
   ```

   If tests mutate env, grep for capture/restore and reset of in-memory singletons.

8. **Re-check every previously closed gate after the fix.**

   For deep-review reruns, the reviewer should not only search for new findings. It should explicitly re-run closed-finding checks and mark each `PASS`, `FAIL`, or `carried forward`.

9. **Declare residual scope explicitly.**

   The final FIX response should include:

   - Changed files.
   - Same-class producer inventory.
   - Consumer inventory.
   - Matrix rows added or verified.
   - Hostile env command.
   - Previously closed gates rechecked.
   - Any intentionally unchanged sibling/consumer with evidence.

## Research question updates

This iteration mainly advances questions 4 and 7, with a refinement to question 5.

Question 4: yes, `sk-deep-review` should require a hard "closed gates rechecked after fix" section for security-sensitive fixes. The 009 run shows rolling convergence alone is insufficient; Run 3 still found a P0 after v2 had apparently closed the prior P0 because the algorithm shape was wrong.

Question 5: yes, fix-oriented planning should require "Affected Surfaces" for policies/functions. The checklist above makes that operational through consumer grep and same-class producer inventory.

Question 7: the default fix prompt should be "fix this finding and prove sibling/consumer/class coverage." Only downgrade to "fix this instance" after the fixer provides evidence that the finding is truly instance-only.

## New findings ratio

I estimate `newFindingsRatio = 0.64` for this iteration. The five failure modes and frequency ranking were known from iterations 001 and 002, but this iteration adds the operational pattern catalog, explicit wrong/right examples, and concrete grep/test gates that can be copied into FIX prompts and review checklists.


---


## Iteration 4

# Iteration 004 - Cost-Benefit Analysis

## Actual 009 cost table

### Measurement method

I used three evidence classes:

- Review/fix orchestration logs under `/tmp/dr-009*` for machine wall-clock durations.
- `git show -s --format='%H %cd %s' --date=iso-strict` for remediation commit timestamps.
- `codex.log` `tokens used` footers for cli-codex fix-session token counts.

Important limitation: cli-copilot review iterations did not persist token counts in the available logs. I therefore treat cli-copilot "Premium" as premium invocation count, not token spend. cli-codex fix sessions have actual token counts.

### Four-round trajectory, measured

| Segment | Evidence | Machine wall-clock | Premium cost proxy | Result |
|---|---:|---:|---:|---|
| Review run 1 | `/tmp/dr-009/dispatch.log` | 22m 36s | 6 cli-copilot review calls | CONDITIONAL: 2 P1 + 4 P2 |
| FIX-009 | `/tmp/dr-009/fix/orchestrator.log`, `/tmp/dr-009/fix/codex.log` | 5m 52s | 1 cli-codex session, 196,118 tokens | Closed run-1 findings, but too narrow |
| Verify run 2 | `/tmp/dr-009-v2/dispatch.log` | 30m 25s | 10 cli-copilot review calls | FAIL: 1 P0 + 3 P1 + 6 P2 |
| FIX-009-v2 | `/tmp/dr-009-v2/fix/orchestrator.log`, `/tmp/dr-009-v2/fix/codex.log` | 13m 11s | 1 cli-codex session, 321,030 tokens | Closed major run-2 findings, but used regex redaction |
| Verify run 3 | `/tmp/dr-009-v3/dispatch.log` | 12m 57s | 5 cli-copilot review calls | FAIL: 1 P0 |
| FIX-009-v3 | `/tmp/dr-009-v4/loop.log`, `/tmp/dr-009-v4/fix-codex.log` | 2m 53s | 1 cli-codex session, 91,404 tokens | Split-then-relativize fix |
| Verify run 4 | `/tmp/dr-009-v4/v4-orch.log` | 4m 12s | 3 cli-copilot review calls | PASS: 0 P0 / 0 P1 / 0 P2 |

Totals:

| Scope | Active machine time | Elapsed wall-clock | Premium lower bound | cli-codex tokens |
|---|---:|---:|---:|---:|
| Full trajectory, review run 1 through clean run 4 | 92m 06s | 175m 51s | 3 cli-codex sessions + 24 cli-copilot calls | 608,552 fix-session tokens |
| Post-run-1 remediation only, FIX-009 through clean run 4 | 69m 29s | 149m 15s | 3 cli-codex sessions + 18 cli-copilot calls | 608,552 fix-session tokens |
| Fix sessions only | 21m 56s | n/a | 3 cli-codex sessions | 608,552 tokens |
| Review sessions only | 70m 10s | n/a | 24 cli-copilot calls | Not logged |

The elapsed time is the real operator cost. The active machine time after run 1 was 69m 29s, but the clock from `FIX-009 START` to clean verification was 149m 15s because of handoff, commit, archive, and restart gaps.

### Git timestamp cost

The remediation commits show the operator-visible cadence:

| Commit | Commit timestamp | Meaning |
|---|---:|---|
| `79e97aec92` | 2026-05-02T15:27:53+02:00 | Original 009 implementation plus FIX-009 and run-1 archive |
| `03d8732764` | 2026-05-02T17:00:02+02:00 | FIX-009-v2 after run-2 FAIL |
| `c8ee2e8198` | 2026-05-02T17:39:38+02:00 | FIX-009-v3 plus run-4 PASS verification |

Inter-commit elapsed:

| Interval | Elapsed |
|---|---:|
| `79e97aec92` -> `03d8732764` | 92m 09s |
| `03d8732764` -> `c8ee2e8198` | 39m 36s |
| First fix commit -> final clean commit | 131m 45s |

That makes the economic problem clear: each "small" missed surface created another review loop with a 30-90 minute human-visible delay, even when the actual code fix was only a few minutes.

### Per fix-plus-verify cycle

| Cycle | Fix | Verify | Active time | Elapsed from fix start to verify end | Premium lower bound | cli-codex tokens | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|
| Cycle 1: FIX-009 + run 2 | 5m 52s | 30m 25s | 36m 17s | 89m 53s | 1 codex + 10 copilot | 196,118 | FAIL |
| Cycle 2: FIX-009-v2 + run 3 | 13m 11s | 12m 57s | 26m 08s | 36m 54s | 1 codex + 5 copilot | 321,030 | FAIL |
| Cycle 3: FIX-009-v3 + run 4 | 2m 53s | 4m 12s | 7m 05s | 7m 04s | 1 codex + 3 copilot | 91,404 | PASS |

The highest-cost cycle was not the final P0 fix; it was the second pass. FIX-009-v2 was a broad remediation relative to FIX-009, touched 18 files, and consumed 321,030 cli-codex tokens. The reason it still failed was not insufficient effort. It chose the wrong algorithm shape for redaction: regex replacement instead of split-and-process.

## Estimated broader-scope cost

### What "broader-scope fix" means here

This is not "fix everything nearby." It means the fixer starts with the iteration-003 completeness checklist before editing:

1. Classify each finding as instance-only, class-of-bug, cross-consumer, algorithmic, matrix/evidence, or test-isolation.
2. Inventory same-class producers with `rg`.
3. Inventory consumers of changed policies/functions.
4. For path/redaction/parser/security logic, name the invariant and add adversarial table tests.
5. Build the full env/default/per-call or equivalent truth table.
6. Pin review evidence to a remediation SHA/range.
7. Run hostile environment variants.
8. Re-check all previously closed gates after the fix.

For 009, a one-shot broader fix after run 1 would have needed to cover these surfaces in one remediation pass:

| Surface | Actual round that exposed it | Broader-scope preflight that should have caught it |
|---|---:|---|
| `includeSkills:false` vs env precedence | Run 1 | Full precedence matrix |
| symlink `rootDir` alias | Run 1 | Canonical path invariant: compare and consume the same canonical root |
| scan validation errors and warnings | Run 1 | Same-class user-visible error/warning producer inventory |
| successful scan `data.errors` | Run 2 | Same-class response field inventory |
| status active scope after one-off scan | Run 2 | Consumer inventory for changed scope policy |
| env-sensitive tests inheriting shell state | Run 2 | Hostile env test variant |
| six-row unit precedence matrix | Run 2 | Matrix gate, not only integration gate |
| constants/docs/ADR/resource-map drift | Run 2 | Consumer/docs/evidence inventory |
| colon/NUL multi-path redaction edge | Run 3 | Algorithm gate: reject regex redaction for structural path-token redaction |

The last row is the hardest. A broader prompt only catches it if it contains the algorithmic rule from iteration 003: for redaction/parsing/path code, do not accept a one-regex patch without adversarial delimiter tests.

### Prompt complexity estimate

Actual fix prompt sizes:

| Prompt | Bytes | Lines | Actual cli-codex session tokens |
|---|---:|---:|---:|
| FIX-009 | 10,337 | 185 | 196,118 |
| FIX-009-v2 | 14,987 | 307 | 321,030 |
| FIX-009-v3 | 6,769 | 180 | 91,404 |
| Combined actual fix prompts | 32,093 | 672 | 608,552 |

Estimated one-shot broader prompt:

| Component | Estimate |
|---|---:|
| Run-1 finding summary and mandatory reading | 8-10 KB |
| Completeness checklist and required inventories | 5-7 KB |
| Explicit 009-specific surface matrix | 5-7 KB |
| Verification and output contract | 3-4 KB |
| Total prompt size | 21-28 KB, about 350-500 lines |
| Prompt tokens, rough chars/4 estimate | 5k-7k input tokens before tool reads |

The prompt would be about 2.0-2.7x the first narrow prompt, but still smaller than the three actual fix prompts combined. The material cost is not the prompt text itself; it is the extra code reading and test iteration that the prompt forces.

### cli-codex token estimate

The closest actual analog is FIX-009-v2: it fixed seven real items plus one severity downgrade, touched 18 files, took 13m 11s, and used 321,030 cli-codex tokens.

A good broader one-shot after run 1 would be larger than FIX-009-v2 because it would also include the algorithmic redaction gate and consumer/sibling inventory before editing. My estimate:

| Scenario | Fix active time | cli-codex tokens | Why |
|---|---:|---:|---|
| Optimistic broader fix | 15m | 300k-350k | Finder already gives exact surfaces and the model applies the checklist cleanly |
| Expected broader fix | 18-22m | 350k-420k | Similar to FIX-009-v2 plus extra algorithm/matrix preflight |
| Pessimistic broader fix | 25-30m | 450k-550k | Prompt causes more exploratory reads or broad doc churn |

The expected case is still below the actual 608,552 cli-codex tokens spent across three fix sessions. It also avoids 18 cli-copilot verification calls if it passes on the first verification rerun.

### Verification estimate

A broader fix should not get the tiny 3-iteration run-4 verification unless its scope is extremely narrow. For 009-class security/path behavior, the realistic verification bound is:

| Verification model | Evidence anchor | Expected time | Premium calls |
|---|---|---:|---:|
| Targeted security/correctness verification | Run 3: 5 iterations | 13m | 5 cli-copilot calls |
| Fuller cross-dimension verification | Run 1: 6 iterations | 18-23m | 6 cli-copilot calls |
| Full rerun at v2 scale | Run 2: 10 iterations | 30m | 10 cli-copilot calls |

Expected one-shot broader path after run 1:

| Cost dimension | Expected broader path | Actual post-run-1 path |
|---|---:|---:|
| Active wall-clock | 31-45m | 69m 29s |
| Operator elapsed | 45-70m if one commit/review handoff | 149m 15s |
| Premium lower bound | 1 cli-codex + 5-6 cli-copilot calls | 3 cli-codex + 18 cli-copilot calls |
| cli-codex tokens | 350k-420k expected | 608,552 actual |

In the pessimistic case, the broader fix can approach 550k tokens and 60m active time. Even then, it is roughly break-even on active time and still saves operator wait time if it avoids the second and third verification loops.

## Break-even analysis

### Active-time break-even

Let:

- `N_fix` = narrow first fix cost.
- `B_fix` = broader first fix cost.
- `Extra_cycle` = cost of one additional failed narrow cycle, including the next fix and verify.

For 009:

- `N_fix` = 5m 52s.
- `B_fix` expected = 18-22m.
- `B_fix - N_fix` = about 12-16m extra up front.
- Failed-cycle active cost was 36m 17s for cycle 1 and 26m 08s for cycle 2. Average failed-cycle cost = about 31m.

Break-even:

```text
extra_upfront_cost / avoided_failed_cycle_cost
~= 12-16m / 31m
~= 0.39-0.52
```

So a broader fix pays off if the chance of needing one extra narrow fix+verify cycle is above roughly 40-55%. For 009 itself, that probability was effectively 100% because the first fix missed multiple same-class and cross-consumer surfaces.

Another way to state it: if a packet is likely to need 2 or more narrow remediation cycles, broader-scope pays off. It does not need to avoid three cycles; avoiding one failed rerun is enough.

### Token break-even

Using cli-codex tokens only, because cli-copilot token counts are absent:

- Actual first narrow fix: 196,118 tokens.
- Expected broader fix: 350k-420k tokens.
- Extra upfront token cost: 154k-224k tokens.
- Actual second fix alone: 321,030 tokens.

Break-even:

```text
154k-224k / 321k = 0.48-0.70
```

So token-wise, broader-scope pays off if it prevents the next fix session with probability above about 50-70%. If we counted the next verification run's cli-copilot tokens, the break-even probability would be lower.

### Premium-call break-even

Premium invocation counts favor broader-scope more strongly than tokens:

| Path | Premium lower bound after run 1 |
|---|---:|
| Actual narrow/multi-round | 3 cli-codex + 18 cli-copilot = 21 calls |
| Expected broader one-shot | 1 cli-codex + 5-6 cli-copilot = 6-7 calls |
| Broader one-shot with full v2-style rerun | 1 cli-codex + 10 cli-copilot = 11 calls |

Even if a broader fix still receives a full 10-iteration verification run, it ties the first actual narrow cycle on calls and avoids the second and third cycles. On Premium-call count, broad pays off as soon as it avoids any additional remediation round.

### Operator-latency break-even

The operator-visible cost is more decisive than machine time:

- Active post-run-1 machine time: 69m 29s.
- Elapsed post-run-1 clock time: 149m 15s.
- Commit-to-commit remediation span: 131m 45s.

Every extra failed review round creates a context-switch gap: read report, decide fix scope, dispatch codex, archive/restart review, wait for verdict, then commit. In 009, those gaps were larger than several of the actual code fixes.

If cycle latency is above about 15m, a broader-scope fix becomes attractive even when its prompt and token cost are noticeably higher. If cycle latency is under 5m and local verification is cheap, narrow fixes can still win.

## Recommendations: when to pick narrow-fix vs broad-fix per-packet

### Pick broad-fix-one-round by default when any of these are true

| Signal | Reason |
|---|---|
| Security, path disclosure, auth/permission, sandboxing, env precedence, schema boundary, or DB persistence is involved | Missed sibling surfaces become P0/P1, not harmless cleanup |
| The finding mentions a policy, helper, response field, status/readiness output, warning/error payload, or public schema | These almost always have consumers beyond the cited line |
| The first review found mode 2 or mode 4 symptoms | Cross-consumer and matrix misses dominated both 009 and the sibling audit |
| Verification is multi-iteration cli-copilot/cli-codex rather than local tests | The next review loop is expensive enough that up-front inventory pays |
| Reviewer fatigue is already visible | Repeated "same class, new location" findings degrade attention and increase severity-calibration mistakes |
| Cycle latency is above 15m | Avoiding one failed rerun saves more elapsed time than the broad prompt costs |

For these packets, the FIX prompt should require the iteration-003 completeness checklist before code changes. The model should not be allowed to answer only "fixed the cited line" unless it proves the finding is instance-only.

### Pick narrow-fix-multi-round when these are true

| Signal | Reason |
|---|---|
| The finding is instance-only and grep proves no sibling producers or consumers | Broad inventory becomes mostly ceremony |
| The change is a small docs typo, one resource-map row, or one stale file:line reference | Low blast radius, low verification cost |
| There is one failing local test with a local cause and no shared helper/policy | The fastest truth source is the test, not a broad prompt |
| Review cycles are cheap and synchronous | If fix+verify is under 5m, narrow iteration is economical |
| A broad prompt would touch unrelated packet state | Prompt bloat can become scope creep and create new review noise |

Even narrow fixes should still include a tiny "instance-only proof": the exact grep or path check that showed no sibling/cross-consumer surface.

### Per-packet decision rule

Use this rule after the first review report:

```text
If P0/P1 OR security/path/policy/env/schema/DB code:
  run broad fix checklist.
Else if finding is docs/resource-map-only and grep proves one surface:
  allow narrow fix.
Else:
  require at least same-class producer inventory + consumer inventory.
```

For 009 specifically, the correct choice after run 1 would have been broad. The initial run already had a precedence matrix bug, a symlink/canonicalization bug, absolute path disclosure, and resource-map drift. That combination predicts modes 2, 3, and 4 strongly enough that a narrow "close the report rows" fix was false economy.

### Research question updates

Question 3 is now answered with numbers: a broader-scope fix likely increases first-fix cli-codex spend from 196k tokens to about 350k-420k tokens, but it pays off if it prevents even one additional failed fix+verify cycle. The actual 009 post-run-1 path cost 69m 29s active, 149m 15s elapsed, 21 premium invocations, and 608,552 cli-codex fix tokens.

Question 2 is refined: security sensitivity is not the only predictor, but it lowers the tolerance for narrow fixes. Security/path/code-graph scope work makes modes 2 and 3 P0-prone, while maintainability packets can still suffer the same repeated-cycle cost at lower severity.

Question 7 is reinforced: the default should be "fix this finding and prove sibling/consumer/class coverage." The downgrade to "fix this one instance" should require evidence, not intuition.

## New findings ratio

I estimate `newFindingsRatio = 0.70` for this iteration. Prior iterations already established that broader-scope fixes were probably worthwhile for 009-class work, but this iteration adds measured wall-clock, commit-gap, Premium-call, and cli-codex-token break-even numbers.


---


## Iteration 5

# Iteration 005 - Recommendations and ADR-001 Draft

## Recommendations

These recommendations synthesize iterations 001-004 into concrete workflow edits. The line numbers below are from this iteration's local read of the current workspace; re-run `nl -ba` before implementing if the files move.

### R1 - Add a fix-aware affected-surface section to the plan template

**WHAT to change**

The requested target, `.opencode/skill/system-spec-kit/scripts/templates/level_*/`, is not the current Level template location. That directory owns only the inline gate renderer: `.opencode/skill/system-spec-kit/scripts/templates/README.md:21-37` lists `inline-gate-renderer.{ts,sh}` and no `level_*` folders exist. The canonical Level markdown templates are in `.opencode/skill/system-spec-kit/templates/manifest/*.md.tmpl`, rendered by that script.

Modify `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl`:

- Insert this section after `## 3. ARCHITECTURE` and before `## 4. IMPLEMENTATION PHASES` in each Level block:
  - Level 1: after line 83, before line 87.
  - Level 2: after line 229, before line 233.
  - Level 3: after line 431, before line 435.
  - Level 3+: after line 710, before line 714.

Suggested section:

```markdown
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->
```

**WHY**

This addresses failure modes 2 and 4: one-consumer fixes and partial test/evidence matrices. Iteration 001 counted 13 of 17 `009` findings in those two modes: 6 cross-consumer misses and 7 matrix/evidence misses. Iteration 002 widened the sample and still found the same shape: combined mode 2 count 24, combined mode 4 count 27. The missed surfaces in `009` were concrete: scan was fixed before status, warnings before `data.errors`, and a three-row precedence proof before the six-row unit matrix.

Expected cycle compression: for `009`-class work this should move remediation from 4 review rounds toward 2 rounds. It would have forced the first fix plan to list scan, status, error/warning producers, docs/resource-map evidence, and env matrix rows before editing.

**HOW TO VERIFY**

```bash
rg -n "FIX ADDENDUM: AFFECTED SURFACES|ANCHOR:affected-surfaces|Same-class producers|Consumers of changed symbols" \
  .opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl

for level in 1 2 3 3+; do
  .opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh \
    --level "$level" \
    .opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl >/tmp/plan-"$level".md
  rg -n "AFFECTED SURFACES" /tmp/plan-"$level".md
done
```

### R2 - Add fix completeness gates to checklist templates

**WHAT to change**

Modify `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl`:

- Level 2: insert after `## Testing` and before `## Security`, around lines 69-80.
- Level 3: insert after `## Testing` and before `## Security`, around lines 198-209.
- Level 3+: insert after `## Testing` and before `## Security`, around lines 399-410.

Suggested checklist block:

```markdown
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->
```

**WHY**

This turns the iteration-003 "Universal fix completeness checklist" into a completion gate instead of advice. It covers all five observed failure modes:

- Mode 1: proves same-class sites are handled.
- Mode 2: proves consumers are handled.
- Mode 3: requires invariant-shaped algorithms and adversarial tables.
- Mode 4: requires full matrix/evidence rows.
- Mode 5: requires hostile env/global-state tests.

Expected cycle compression: it mainly prevents the high-cost second cycle. Iteration 004 measured cycle 1 plus run 2 at 36m17s active and cycle 2 plus run 3 at 26m08s active. Avoiding either failed cycle pays for the checklist overhead.

**HOW TO VERIFY**

```bash
rg -n "CHK-FIX-001|CHK-FIX-007|Fix Completeness" \
  .opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl

for level in 2 3 3+; do
  .opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh \
    --level "$level" \
    .opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl >/tmp/checklist-"$level".md
  rg -n "Fix Completeness|CHK-FIX" /tmp/checklist-"$level".md
done
```

### R3 - Make `/spec_kit:plan` generate affected surfaces for fix/remediation packets

**WHAT to change**

Modify both plan workflow YAML files:

- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:553` currently lists planning activities without an affected-surface output. Add `Generate Affected Surfaces table for fix_bug/remediation packets`.
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:602` has the same activities list; add the same item.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:562-566` and `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:611-615` score plan quality on approach, risk, dependency mapping, and pattern alignment. Add a fifth scoring factor:

```yaml
- { factor: "Affected surface coverage", weight: 0.20, assess: "For fix/remediation packets, are same-class producers, consumers, test matrices, docs/resource maps, and runtime variants enumerated?" }
```

Then rebalance the existing weights, for example:

```yaml
- { factor: "Technical approach clarity", weight: 0.25, assess: "Implementation strategy well-defined?" }
- { factor: "Risk identification", weight: 0.20, assess: "Risks identified with mitigations?" }
- { factor: "Dependency mapping", weight: 0.20, assess: "All dependencies documented?" }
- { factor: "Pattern alignment", weight: 0.15, assess: "Follows existing codebase patterns?" }
- { factor: "Affected surface coverage", weight: 0.20, assess: "For fix/remediation packets, are same-class producers, consumers, test matrices, docs/resource maps, and runtime variants enumerated?" }
```

Also update the plan inline scaffold:

- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-214`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:212-220`

Add an optional custom section after the required seven anchors rather than renumbering existing required anchors:

```yaml
      <!-- ANCHOR:affected-surfaces --> ## FIX ADDENDUM: AFFECTED SURFACES
```

**WHY**

This addresses research question 5 directly. Iteration 002 found that `004`, `005`, `008`, and `009` would each have benefited from explicit surface enumeration. The plan flow is the right choke point because deep-review verdicts route FAIL and CONDITIONAL to `/spec_kit:plan` (`.opencode/skill/sk-deep-review/references/convergence.md:473-479`). If plan.md does not require surfaces, the next implement/fix session starts with a narrow target by default.

Expected cycle compression: reduces the probability of a second failed fix+verify cycle. Iteration 004 estimated broad one-shot remediation at 31-45m active versus the actual post-run-1 path at 69m29s active and 149m15s elapsed.

**HOW TO VERIFY**

```bash
rg -n "Affected surface coverage|Generate Affected Surfaces|ANCHOR:affected-surfaces" \
  .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research \
  --strict
```

### R4 - Extend `sk-code-review` finding schema with finding class and fix scope

**WHAT to change**

Modify `.opencode/skill/sk-code-review/SKILL.md`:

- Add `references/fix-completeness-checklist.md` to the default resources at lines 120-125.
- Add the new file to the Resource Loading table at lines 87-90, likely under ALWAYS for security/correctness reviews and CONDITIONAL for ordinary maintainability reviews.
- In Phase 3, after line 286, add: "For every actionable finding, classify fix scope as `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. If unknown, default to class/cross-consumer until a producer/consumer inventory proves instance-only."
- In the output contract at lines 302-307, add fields under each finding:

```markdown
   - Finding class: [instance-only | class-of-bug | cross-consumer | algorithmic | matrix/evidence | test-isolation]
   - Scope proof: [grep/test evidence proving class coverage or instance-only status]
   - Recommended fix
```

Also modify `.opencode/skill/sk-code-review/references/review_core.md:75-87` so the shared finding schema includes:

| Field | Requirement |
| --- | --- |
| `findingClass` | One of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` |
| `scopeProof` | Grep/test/audit evidence that the recommendation covers same-class sites and consumers, or proves the finding is instance-only |

**WHY**

This addresses failure mode 1 and prevents failure modes 2 and 4 from being hidden inside vague "Recommended fix" prose. Iteration 001 showed that "fix the cited finding" repeatedly optimized for one file:line: readiness wording was treated as a README/prose site, status was missed as a scope consumer, and `data.errors` was missed as a sibling error producer.

Expected cycle compression: this moves the broad-vs-narrow decision from the fixer to the reviewer. Review reports become better planning inputs, and `/spec_kit:plan` can seed affected surfaces without rediscovering classification from scratch.

**HOW TO VERIFY**

```bash
rg -n "findingClass|Finding class|scopeProof|Scope proof|fix-completeness-checklist" \
  .opencode/skill/sk-code-review/SKILL.md \
  .opencode/skill/sk-code-review/references/review_core.md

python .opencode/skill/sk-doc/scripts/validate_document.py \
  .opencode/skill/sk-code-review/SKILL.md
```

### R5 - Add the new fix completeness checklist reference

**WHAT to change**

Create `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md`.

Minimum content:

```markdown
---
title: Fix Completeness Checklist
description: Checklist for turning review findings into complete fixes across same-class producers, consumers, algorithms, matrices, and hostile environments.
---

# Fix Completeness Checklist

## 1. Classification

State one class for every actionable finding:

| Class | Use When | Required Proof |
|-------|----------|----------------|
| `instance-only` | One cited site and grep proves no siblings or consumers | Exact grep command and result |
| `class-of-bug` | Same field/string/helper/error pattern can appear at sibling sites | Same-class producer inventory |
| `cross-consumer` | Changed policy/helper/field is observed by other handlers, status, DB, docs, or tests | Consumer inventory |
| `algorithmic` | Regex/parser/path/resolver/security logic is being changed | Invariant plus adversarial table tests |
| `matrix/evidence` | Env/default/per-call, full/incremental, fresh/stale, root shape, runtime, or doc evidence axes exist | Full row table and SHA/range pin |
| `test-isolation` | Env/global-state/singleton behavior is tested | Capture/restore proof and hostile env variant |

## 2. Required Inventories

Same-class producers:

```bash
rg -n '<field|string|helper|literal|error-pattern>' <changed-files-or-module>
rg -n 'errors\.push|warnings\.push|throw new Error|JSON.stringify|return \{.*error|message:' <changed-files-or-module>
```

Consumers:

```bash
rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'
```

Algorithm smell:

```bash
rg -n '\.replace\(|new RegExp|startsWith\(|includes\(|split\(' <changed-files>
```

Matrix/evidence:

```bash
rg -n 'it\.each|test\.each|describe\.each|REQ-|source:' <changed-tests-and-packet-docs>
git rev-parse --verify HEAD
git diff --name-only <FIX_SHA>^..<FIX_SHA>
```

Hostile env/global state:

```bash
env <RELEVANT_ENV>=true <focused-test-command>
env -u <RELEVANT_ENV> <focused-test-command>
rg -n '<ENV_OR_GLOBAL_NAME>|original.*Env|afterEach|finally|reset\(' <changed-test-files>
```

## 3. Completion Output

The fix response must include:

- Changed files.
- Finding class table.
- Same-class producer inventory.
- Consumer inventory.
- Matrix rows added or verified.
- Hostile env command when relevant.
- Previously closed gates rechecked.
- Intentionally unchanged siblings/consumers with evidence.
```

**WHY**

This operationalizes iteration 003 lines 438-511 as a reusable review/fix resource. It keeps the checklist close to `sk-code-review`, where finding recommendations are produced, instead of burying it in one research packet.

Expected cycle compression: lower prompt overhead than embedding the full research narrative every time. The checklist adds about 5-7 KB to a broad fix prompt, versus the actual `009` three fix prompts totaling 32,093 bytes and 608,552 cli-codex fix-session tokens.

**HOW TO VERIFY**

```bash
test -f .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
rg -n "Finding class|Same-class producers|Consumers|Hostile env" \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
python .opencode/skill/sk-doc/scripts/validate_document.py \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
```

### R6 - Make security-sensitive deep-review convergence require closed-gate replay

**WHAT to change**

Modify `.opencode/skill/sk-deep-review/references/convergence.md`:

- After Key Defaults (`lines 31-42`), add security-sensitive override defaults:

```markdown
### Security-Sensitive Fix Overrides

For review reruns after fixes involving security, path disclosure, auth/authz, sandboxing, env precedence, public schemas, persistence, or user-visible error payloads:

| Setting | General Default | Security-Sensitive Fix Default |
|---------|-----------------|--------------------------------|
| `minStabilizationPasses` | 1 | 2 |
| `requiredClosedFindingReplay` | false | true for prior P0/P1 and any prior security/path P2 |
| `requiredFixCompletenessGate` | false | true |

STOP is not legal until the review report contains a closed-gate replay table that marks each prior active or remediated P0/P1 as `PASS`, `FAIL`, or `carried forward`, with file:line or command evidence.
```

- In the Legal-Stop Gate Bundle table at lines 368-375, add:

```markdown
| **fixCompletenessReplay** | Security-sensitive fix reruns must replay previously closed P0/P1 gates and validate producer/consumer/matrix coverage from the remediation packet | Block STOP, persist `blockedStop` |
```

- In the Gate Evaluation pseudocode around lines 379-410, add a `fixCompletenessReplay` gate whose pass condition is either non-security-sensitive scope or all required replay rows pass.

Live enforcement should mirror the reference in:

- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:474-480`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:482-488`

Add `g) fixCompletenessReplayGate` to the legal-stop decision tree and include it in `blockedBy` plus `gateResults` in the `blocked_stop` JSONL append.

**WHY**

This addresses failure mode 3 and research question 4. `009` Run 3 found a P0 after FIX-009-v2 because the review had apparently closed the earlier `data.errors` redaction issue but had not forced an adversarial replay of the redaction class. Rolling convergence was insufficient because the failure was not "more review novelty"; it was "same security class, hidden delimiter edge."

Expected cycle compression: should catch v2-style wrong abstractions before a PASS/CONDITIONAL stop. It may add one stabilization/replay pass, but it is cheaper than another fix session plus review cycle. In `009`, the final P0 cycle still cost 7m05s active and another handoff.

**HOW TO VERIFY**

```bash
rg -n "Security-Sensitive Fix Overrides|requiredClosedFindingReplay|fixCompletenessReplay" \
  .opencode/skill/sk-deep-review/references/convergence.md \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml

rg -n "blocked_stop.*fixCompletenessReplay|fix_completeness_replay_gate|fixCompletenessReplayGate" \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
```

### R7 - Put finding class and affected surfaces into the deep-review Planning Packet

**WHAT to change**

Modify deep-review synthesis instructions:

- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1035-1038`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1057-1060`

The Planning Packet currently must include `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, and `planSeed`. Extend it:

```yaml
The packet MUST include: `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, `planSeed`, `findingClasses`, `affectedSurfacesSeed`, `fixCompletenessRequired`
```

Also update Active Finding Registry instructions:

- Auto: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1040-1043`
- Confirm: `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1062-1065`

Add `findingClass`, `scopeProofNeeded`, and `affectedSurfaceHints` to each active finding.

**WHY**

This connects R4/R5 to R3. Without these fields, `/spec_kit:plan` must infer broad-fix scope from prose, which recreates the `009` problem. The review already has the evidence; it should pass machine-readable seeds downstream.

Expected cycle compression: prevents "review found it, plan forgot it" drift. This is especially useful for multi-finding reports like `005` and `008`, where batching worked only after findings were grouped by consumer surface.

**HOW TO VERIFY**

```bash
rg -n "findingClasses|affectedSurfacesSeed|fixCompletenessRequired|scopeProofNeeded|affectedSurfaceHints" \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
```

### R8 - Add an instance-only opt-out so the checklist does not become ceremony

**WHAT to change**

Add this rule to the new `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md` and mirror it in `.opencode/skill/sk-code-review/SKILL.md` near the Phase 3 classification rule:

```markdown
### Instance-Only Opt-Out

A finding may use the narrow fix path only when all are true:

- It is not P0/P1 security, path, auth/authz, sandboxing, env precedence, schema, persistence, or public-response behavior.
- `rg` proves no same-class producer or consumer.
- Verification is local and cheap: one focused test, one doc row, or one static audit command.
- The fix response includes the exact command evidence for the opt-out.

Otherwise, run the full fix completeness checklist.
```

**WHY**

Iteration 004 found broad fixes break even when the probability of another failed narrow cycle is roughly 40-55% active-time or 50-70% token-wise. But iteration 002 also showed small packets like `001` can compress naturally when one wrong public surface is known. The opt-out preserves speed for true one-surface fixes while making broad scope the default for risky classes.

Expected cycle compression: prevents overuse of the broad prompt. That matters because the negative consequence of ADR-001 is per-fix prompt overhead.

**HOW TO VERIFY**

```bash
rg -n "Instance-Only Opt-Out|full fix completeness checklist|narrow fix path" \
  .opencode/skill/sk-code-review/SKILL.md \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
```

## ADR-001 draft

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt class-of-bug-aware FIX prompts to compress multi-round trajectories

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-02 |
| **Deciders** | Spec Kit maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `009-end-user-scope-default` packet needed four review/fix rounds to converge:

| Round | Verdict | Findings | Fix result |
|-------|---------|----------|------------|
| Run 1 | CONDITIONAL | P0 0, P1 2, P2 4 | FIX-009 addressed the visible report, but missed sibling and consumer surfaces. |
| Run 2 | FAIL | Final adjudicated P0 1, P1 3, P2 6 | FIX-009-v2 closed major gaps, but still used regex redaction for a structural path-token problem. |
| Run 3 | FAIL | P0 1, P1 0, P2 0 | FIX-009-v3 changed the algorithm to split-then-relativize. |
| Run 4 | PASS | P0 0, P1 0, P2 0 | No further fix needed. |

The finding distribution explains the repeated cycle. In the `009` packet, mode 2 one-consumer/cross-cutting misses and mode 4 partial matrix/evidence misses accounted for 13 of 17 findings. Across audited sibling packets, mode 2 reached 24 audit-coded findings and mode 4 reached 27, making them the dominant pattern. Mode 3 algorithm choice was less frequent but more severe in security/path work: the v2 regex redaction fix still leaked a second absolute path when two path tokens were joined by colon or NUL delimiters.

The cost was material. After Run 1, the actual path consumed 69m29s active machine time, 149m15s elapsed operator time, 3 cli-codex fix sessions, 18 cli-copilot review calls, and 608,552 cli-codex fix-session tokens. A broader one-shot fix after Run 1 was estimated at 31-45m active time, 45-70m elapsed time, 1 cli-codex session, 5-6 cli-copilot calls, and 350k-420k cli-codex tokens.

### Constraints

- Keep LEAF-agent review and research architecture intact; this decision changes prompt and workflow contracts, not executor model.
- Avoid broad "fix everything nearby" scope creep. The broad path must be earned by finding class and risk, with an instance-only opt-out.
- Make checklist items self-verifying through grep, tests, diff-range pins, or review packet fields.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: adopt class-of-bug-aware FIX prompts and downstream planning fields that require same-class producer, consumer, matrix, algorithm, and hostile-environment proof before security-sensitive or cross-cutting fixes can claim completion.

**How it works**:

- `sk-code-review` findings gain `findingClass` and `scopeProof` fields.
- A new `fix-completeness-checklist.md` defines the reusable proof protocol.
- `/spec_kit:plan` writes an `Affected Surfaces` section for fix/remediation packets.
- Level plan/checklist templates include fix addenda that turn producer/consumer/matrix inventory into completion gates.
- `sk-deep-review` uses stricter security-sensitive convergence rules, including closed-gate replay for previously fixed P0/P1 findings.
- Deep-review Planning Packets pass `findingClasses`, `affectedSurfacesSeed`, and `fixCompletenessRequired` to planning.

Adopt R1 through R8 from iteration-005 as the implementation set.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Rejected

| Alternative | Why rejected |
|-------------|--------------|
| Status quo narrow FIX prompts | The `009` trajectory shows this creates repeated "same class, new location" failures. It cost 149m15s elapsed after Run 1 and three fix sessions. |
| Deeper convergence threshold only | More iterations can find more defects, but does not make the fixer enumerate sibling/consumer surfaces. Run 3's P0 was not a convergence-math issue; it was a wrong algorithm invariant. |
| Executor change | The sibling audit found the pattern across review/fix workflows and packet types. Switching cli-codex/cli-copilot does not force class-of-bug inventory, consumer search, or matrix proof. |
| Always broad remediation for every finding | Too much overhead for instance-only docs/resource-map/test fixes. Iteration 004 supports an opt-out when grep proves one surface and verification is cheap. |

**Why this one**: It targets the dominant failure modes directly while preserving a narrow path for proven one-off findings.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Expected review/fix cycle count drops for security-sensitive and cross-cutting packets. For `009`, the expected path moves from 4 rounds to 1-2 remediation rounds.
- Review findings become better planning inputs because class, scope proof, and affected surfaces are explicit.
- Security/path fixes get adversarial replay before convergence, reducing the chance of v2-style "closed but still vulnerable" failures.
- Resource-map and evidence drift become easier to catch because SHA/range pinning is required.

**What it costs**:

- Fix prompts get longer. Iteration 004 estimated an expected broader fix at 350k-420k cli-codex tokens versus the first narrow fix at 196,118 tokens. Mitigation: use the instance-only opt-out when grep and local verification prove low blast radius.
- Planning and review reports gain more fields. Mitigation: reuse the checklist reference and machine-readable Planning Packet fields instead of embedding bespoke prose in every packet.
- Security-sensitive reviews may require an extra stabilization/replay pass. Mitigation: apply stricter convergence only to security/path/auth/env/schema/persistence/public-response fixes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Checklist becomes checkbox theater | Medium | Every checklist item requires command evidence or a concrete unchanged rationale. |
| Broad prompt causes unrelated cleanup | Medium | Affected Surfaces table uses `updated`, `covered unchanged`, `intentionally unchanged`, or `not a consumer`; unrelated surfaces are named but not edited. |
| Template target confusion persists | Low | Document that `scripts/templates/` is the renderer and canonical content lives in `templates/manifest/*.md.tmpl`. |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `009` required four rounds, 608,552 cli-codex fix tokens, and 149m15s elapsed after Run 1. Modes 2 and 4 dominated both `009` and sibling audits. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered include status quo, deeper convergence only, executor change, and always-broad remediation. |
| 3 | **Sufficient?** | PASS | The decision adds only the missing workflow contracts: finding class, affected surfaces, checklist proof, and security-sensitive replay. It does not replace agents or rewrite the whole review loop. |
| 4 | **Fits Goal?** | PASS | The stated goal is cycle compression for fix trajectories. Producer/consumer/matrix proof targets the exact causes of repeated cycles. |
| 5 | **Open Horizons?** | PASS | The checklist is reusable across `sk-code-review`, deep-review Planning Packets, and `/spec_kit:plan`, and can later be measured with cycle-count telemetry. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl`: add `FIX ADDENDUM: AFFECTED SURFACES`.
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl`: add `Fix Completeness` checklist items.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` and `_confirm.yaml`: require affected-surface generation and scoring.
- `.opencode/skill/sk-code-review/SKILL.md`: add finding class and scope-proof contract.
- `.opencode/skill/sk-code-review/references/review_core.md`: extend the shared finding schema.
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md`: new reusable checklist.
- `.opencode/skill/sk-deep-review/references/convergence.md`: document security-sensitive closed-gate replay.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` and `_confirm.yaml`: add the live `fixCompletenessReplayGate` and Planning Packet fields.

**How to roll back**:

Revert the template/checklist/schema/convergence edits and remove `fix-completeness-checklist.md`. Then rerun the template render checks and strict spec validation to confirm the workflow returns to the previous contract.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

## Implementation plan summary

1. Copy the ADR-001 draft above into `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/decision-record.md`.
2. Implement recommendations in dependency order: R5 first (new checklist), then R4 (review schema loads it), then R7 (deep-review emits planning fields), then R3/R1/R2 (plan and Level templates consume them), then R6 (security-sensitive convergence enforcement), then R8 (opt-out guard).
3. Validate documentation and workflow surfaces:

```bash
python .opencode/skill/sk-doc/scripts/validate_document.py \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md

rg -n "findingClass|affectedSurfacesSeed|fixCompletenessRequired|fixCompletenessReplay|AFFECTED SURFACES|CHK-FIX" \
  .opencode/skill/sk-code-review \
  .opencode/skill/sk-deep-review/references/convergence.md \
  .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml \
  .opencode/skill/system-spec-kit/templates/manifest

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research \
  --strict
```

## Open questions remaining

1. Should the legacy/nonexistent `.opencode/skill/system-spec-kit/scripts/templates/level_*/` path be recreated as compatibility stubs, or should the implementation explicitly document that canonical content belongs in `.opencode/skill/system-spec-kit/templates/manifest/*.md.tmpl`?
2. Should `fixCompletenessReplayGate` be doc-only in `sk-deep-review/references/convergence.md` first, or immediately wired into both `spec_kit_deep-review_{auto,confirm}.yaml`? My recommendation is immediate YAML enforcement because the reference already says the YAML workflow is authoritative for live stop behavior.
3. Should P2-only security/path findings trigger the full checklist? My recommendation is yes for security/path/public-response classes, no for ordinary docs/resource-map P2 unless a consumer/matrix axis exists.




## End of Synthesis
