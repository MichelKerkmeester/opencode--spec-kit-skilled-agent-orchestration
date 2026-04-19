# Iteration 001 - X1 Corpus Parity + Timing Harness Design

## Focus

Design the full 200-prompt harness for corpus parity and timing validation. This pass is design-only. It does not implement the harness or change hook behavior.

## Inputs Read

- Wave 1 `research.md` empirical section for the 19-prompt timing sample, cache policy, and brief-length guidance.
- The full 200-row routing corpus at `019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl`.
- Existing Python harnesses:
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_regression.py`
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_bench.py`
  - `.opencode/skill/skill-advisor/SET-UP_GUIDE.md`

## Corpus Shape Confirmed

| Bucket | Count |
| --- | ---: |
| `true_write` | 32 |
| `true_read_only` | 32 |
| `memory_save_resume` | 32 |
| `mixed_ambiguous` | 32 |
| `deep_loop_prompts` | 36 |
| `skill_routing_prompts` | 36 |
| **Total** | **200** |

## Harness Design

### 1. Fixture File Layout

Use a two-layer fixture model so the packet keeps the editorial source and the skill package keeps the executable test fixtures.

| Path | Role | Notes |
| --- | --- | --- |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl` | Canonical human-labeled source | Keep this as the research-owned corpus. It already carries bucket, prompt, Gate 3, and top-1 labels. |
| `.opencode/skill/skill-advisor/scripts/fixtures/hook_surface_parity_200.jsonl` | Derived executable fixture | Generated from the canonical corpus for CI and local harness runs. |
| `.opencode/skill/skill-advisor/scripts/fixtures/hook_surface_parity_200_baseline.json` | Frozen confidence baseline | Stores expected top-1 confidence for each prompt at the blessed reference commit. |
| `.opencode/skill/skill-advisor/scripts/out/hook-surface/report.json` | Harness output | Machine-readable report for CI and local review. |

Required fields for each derived fixture row:

| Field | Purpose |
| --- | --- |
| `id` | Stable corpus row ID |
| `bucket` | Bucket rollup for failure summaries |
| `prompt` | Exact prompt string under test |
| `expect_result` | `true` when a dual-threshold result should exist, `false` for abstain rows |
| `expected_top_1` | Exact expected winning skill or command owner |
| `expected_kind` | `skill`, `command`, or `none` |
| `allow_command_bridge` | Matches the current regression harness contract |
| `gate3_expected` | `yes` or `no` for side-by-side Gate 3 drift checks |
| `baseline_top_1_confidence` | Frozen blessed confidence for the winning result |
| `confidence_tolerance` | Absolute tolerance window for that row |
| `notes` | Short label from the research corpus |

### 2. Runner Choice

Choose a **standalone Python harness** at `.opencode/skill/skill-advisor/scripts/skill_advisor_hook_surface_harness.py`.

Reason:

- The advisor runtime and both existing harnesses are already Python.
- `skill_advisor_regression.py` and `skill_advisor_bench.py` already contain the loading and timing logic worth reusing.
- `time.perf_counter()` and subprocess control are already established in the Python path.
- A Vitest wrapper would add a second timing stack around a Python program and make the latency numbers harder to trust.

The new script should import and reuse helpers from the two current harnesses instead of re-implementing their logic.

### 3. Measurement Methodology

Measure four lanes in one report.

#### A. Routing parity lane

- Load the 200-row derived fixture.
- Run one default dual-threshold pass at `confidence=0.8` and `uncertainty=0.35`.
- Record top-1 skill, kind, confidence, uncertainty, and pass or fail for every row.
- Emit per-bucket failure counts and a per-row drift list.

#### B. Cold subprocess lane

- Use one-process-per-prompt execution, matching `skill_advisor_bench.py`.
- Use `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1` for the timing lane, matching the current bench contract.
- Run the full 200-prompt corpus 5 times.
- Record `p50`, `p95`, and `p99` for one-shot subprocess latency.

#### C. Warm in-process lane

- Import the advisor once.
- Run one untimed priming pass across the 200 prompts.
- Run 7 timed passes in-process.
- Record `p50`, `p95`, and `p99` for warm calls.

#### D. Exact-cache impact lane

- Reuse the exact same 200 prompts in the same synthetic session scope.
- Run pass 1 as cold cache warm-up.
- Run pass 2 immediately with the same cache key inputs: canonical prompt, source signature, runtime, thresholds, and semantic-mode flag.
- Record:
  - cache hit count
  - cache hit rate
  - cache-hit `p50`, `p95`, `p99`
  - speedup ratio versus cold subprocess `p95`
- Do **not** count similarity-cache reuse as a pass condition. Wave 1 already ruled out similarity-based execution skipping.

### 4. Pass or Fail Thresholds

These gates keep the harness aligned with wave-1 evidence and the current skill-advisor bench defaults.

#### Routing parity

| Gate | Threshold |
| --- | --- |
| Top-1 winner parity | **200 / 200 rows must match** `expected_top_1` |
| Kind parity | **200 / 200 rows must match** `expected_kind` |
| Confidence drift | Each row must stay within **`baseline_top_1_confidence ± 0.05`** |
| Abstain rows | `expect_result=false` rows must return no passing result in default mode |
| Command-bridge false positives | **0** non-slash rows may flip to `kind=command` unless `allow_command_bridge=true` |

#### Timing

| Lane | Gate |
| --- | --- |
| Cold subprocess `p50` | **<= 45 ms** |
| Cold subprocess `p95` | **<= 60 ms** |
| Cold subprocess `p99` | **<= 75 ms** |
| Warm in-process `p50` | **<= 0.75 ms** |
| Warm in-process `p95` | **<= 2.0 ms** |
| Warm in-process `p99` | **<= 5.0 ms** |
| Batch throughput multiplier over cold subprocess | **>= 10x** |

#### Cache impact

| Gate | Threshold |
| --- | --- |
| Exact-cache hit rate on immediate second pass | **>= 95%** |
| Cache-hit `p95` | **<= 5 ms** |
| Cache speedup versus cold subprocess `p95` | **>= 5x** |

### 5. Regression Gate Integration

Local and CI should call one command that owns the whole hook-surface report.

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_hook_surface_harness.py \
  --source-corpus .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-001-initial-research-005-routing-accuracy/corpus/labeled-prompts.jsonl \
  --fixture .opencode/skill/skill-advisor/scripts/fixtures/hook_surface_parity_200.jsonl \
  --baseline .opencode/skill/skill-advisor/scripts/fixtures/hook_surface_parity_200_baseline.json \
  --out .opencode/skill/skill-advisor/scripts/out/hook-surface/report.json
```

Recommended gate order for the existing skill-advisor validation bundle:

1. `python3 .opencode/skill/skill-advisor/tests/test_skill_advisor.py`
2. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
3. `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_hook_surface_harness.py ...`
4. `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/skill-advisor`

Failure contract for the new harness:

- Exit `0`: all parity, timing, and cache gates pass.
- Exit `1`: any regression gate fails.
- Report JSON must include:
  - `routing_parity_failures`
  - `confidence_drift_failures`
  - `performance_failures`
  - `cache_failures`
  - `bucket_summary`

### 6. Parity Assertions for All 200 Prompts

Each of the 200 prompts must assert the same core contract:

1. **Winner identity:** the top-1 result matches `expected_top_1`.
2. **Winner type:** the top-1 `kind` matches `expected_kind`.
3. **Confidence stability:** the top-1 confidence stays within the stored absolute tolerance window.
4. **Default-mode abstain behavior:** rows marked `expect_result=false` stay below the dual threshold.
5. **Non-slash safety:** natural-language rows do not promote a command bridge unless the row explicitly allows it.

Bucket-specific notes:

| Bucket | Additional check |
| --- | --- |
| `true_write` | Gate 3 expected = `yes` |
| `true_read_only` | Gate 3 expected = `no` |
| `memory_save_resume` | Winner stays on `system-spec-kit`, `sk-deep-research`, or `sk-deep-review` as labeled |
| `mixed_ambiguous` | Winner and confidence window must hold even when read-only and write tokens co-occur |
| `deep_loop_prompts` | Slash and natural-language loop prompts keep the owning deep skill at top-1 |
| `skill_routing_prompts` | External tool and specialist-skill prompts keep the labeled owner at top-1 |

## Decisions

- **Use the 200-row packet corpus as source-of-truth.** Do not hand-maintain two editorial corpora.
- **Add one Python harness, not a Vitest wrapper.** The timing path already lives in Python and should stay there.
- **Freeze confidence parity in a baseline JSON.** The corpus source file should keep labels, while the baseline file carries numeric expectations that can be deliberately refreshed.
- **Treat exact-cache impact as a measured bonus gate.** Similarity cache reuse stays diagnostic-only.

## Question Status

- **X1 answered**: the packet now has a concrete fixture layout, runner choice, measurement plan, thresholds, and CI gate contract for the full corpus parity harness.

## Next Focus

Iteration 2 should move to X2 and inspect Claude `UserPromptSubmit` semantics in checked-in code and runtime surfaces, using this harness design as the validation target for later hook work.
