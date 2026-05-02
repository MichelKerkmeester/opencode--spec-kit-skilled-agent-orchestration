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
