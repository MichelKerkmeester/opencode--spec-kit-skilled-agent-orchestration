# Iteration 010 - V10 Hard-gate realism timing + cache math

## Assessment

The **latency gate itself is realistic** if it is interpreted exactly as written: a **cache-hit-only** producer gate, not a cold/miss end-to-end gate. `004` caps the warm cache-hit producer path at **p95 <= 10 ms** (`020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md` §5 SC-003; §L2 NFR-P01), while `005` keeps the renderer pure and effectively sub-millisecond (`020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md` §4.1 REQ-001; §L2 NFR-P01). The runtime children then reserve another ~10 ms of transport headroom by budgeting **hook total p95 <= 60 ms** while assuming **producer p95 <= 50 ms** (`020-skill-advisor-hook-surface/006-claude-hook-wiring/spec.md` §4.1 REQ-008; `020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/spec.md` §4.1 REQ-008). On that reading, the cache-hit path has comfortable slack under 50 ms.

The **hard realism problem is not the 50 ms gate**. It is the replay math behind `005`'s **REQ-006 / SC-004 / Acceptance Scenario 10**. A 30-turn replay defined as **20 unique prompts + 10 repeats** can only yield **10 cache hits out of 30 turns = 33.3% overall hit rate**, not 60%. That gate is mathematically impossible as written.

## Budget math

| Path | Contract inputs | Derived total | Verdict |
|---|---|---:|---|
| Warm cache hit (producer gate) | `004` warm hit p95 <= 10 ms + `005` renderer pure/<1 ms + runtime-child transport headroom implied by 60 ms total / 50 ms producer | ~11-20 ms practical envelope | **Passes 50 ms gate** |
| Cache miss / subprocess | `005` §3.5 sets warm subprocess p95 <= 1100 ms and cold subprocess p95 <= 1500 ms | ~1.1-1.5 s | **Not part of 50 ms gate** |
| 30-turn replay hit rate | 20 unique misses + 10 repeated hits | 10 / 30 = **33.3%** | **Fails 60% gate** |
| Timing harness wall clock | 50 cold @ 1500 ms + 50 warm @ 1100 ms + 50 hit @ 50 ms + 50 signature-changed miss/re-probe (at least warm-class) | ~187.5 s minimum before setup/fixtures | **Exceeds <2 min NFR** |

## Findings

1. **P0 - `005` replay hit-rate gate is impossible as written.** `020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md` §4.1 REQ-006, §5 SC-004, and §5 Acceptance Scenario 10 require **cache hit rate >= 60%** while simultaneously defining the replay as **20 unique prompts + 10 repeats**. Under exact-prompt caching from `004` (§4.1 REQ-005), that workload can produce at most **10 hits / 30 turns = 33.3%**. This is a blocking spec math error, not an implementation risk.
2. **P1 - `005`'s timing-harness runtime budget is undercounted.** `020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md` §3.5 says the harness records **50 invocations across 4 lanes**, but §L2 NFR-P03 still requires completion in **< 2 minutes**. Using the same section's own thresholds gives a lower bound of roughly **75 s cold + 55 s warm + 2.5 s hit + ~55 s signature-changed miss = ~187.5 s**, before fixture/setup overhead. The harness runtime target should be relaxed or the sampling plan reduced.
3. **P2 - The 50 ms gate should stay explicitly cache-hit-scoped everywhere it is cited.** The underlying numbers are coherent: `004`'s warm-hit producer budget is stricter than the parent gate, and `006`/`007` already frame adapter latency as **60 ms total on cache hit**. The risk is interpretive drift: if any downstream summary treats **50 ms** as a universal invocation budget, it will contradict `005`'s own **1100-1500 ms** subprocess lanes (`020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/spec.md` §3.5; `020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/spec.md` §4.1 REQ-011; §5 SC-003).

## Concrete corrections

1. **Fix REQ-006 / SC-004 / Acceptance Scenario 10 in one of two ways:**
   - Keep the **20 unique + 10 repeats** replay and change the gate to **overall hit rate >= 33%** (or `>= 10/30`) for that trace.
   - Keep the **>= 60%** gate and change the replay shape to **12 unique + 18 repeats** (exactly 60%) or any more-repetitive mix.
2. **Best contract split if the current replay is meant to stay representative:** use **two metrics** instead of one overloaded metric:
   - **Overall replay hit rate:** `10/30 = 33.3%` for the stated 20/10 trace.
   - **Repeat-eligible hit rate:** `10/10 = 100%` after first-seen warm-up turns.
3. **Patch `005` NFR-P03** to match the lane count and thresholds already in §3.5. With current sample counts, a realistic floor is **>3 minutes**, not `<2 minutes`.

## Novelty assessment

This pass did not reopen architecture. It validated that the 50 ms cache-hit gate is workable, but it found one new blocking contract error (the 60% replay math) and one secondary realism gap (the harness runtime budget).
