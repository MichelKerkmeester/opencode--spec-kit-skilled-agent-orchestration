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
