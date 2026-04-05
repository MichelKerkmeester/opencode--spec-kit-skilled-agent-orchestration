# Iteration 2: RQ2 — Convergence/Stopping Logic Evolution

## Focus
Investigate how convergence/stopping logic works at code level in pi-autoresearch and AGR, then compare against our 3-signal composite algorithm in convergence.md. Determine if any repo implements statistical convergence detection (moving averages, variance, plateau detection) or if convergence is purely count-based or prompt-based.

## Findings

### Finding 1: pi-autoresearch has NO statistical convergence detection — only hard maxExperiments
Despite being the most sophisticated repo (2000+ LOC TypeScript), pi-autoresearch implements **zero** statistical convergence logic. No moving averages, no variance tracking, no newInfoRatio equivalent, no plateau detection. The ONLY stopping mechanism is a hard `maxExperiments` count read from `autoresearch.config.json` and enforced in the `run_experiment` tool handler. The code literally checks `segCount >= state.maxExperiments` and returns an error message. This means pi-autoresearch loops indefinitely within a segment until the hard cap is hit.
[SOURCE: https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts — run_experiment handler, maxExperiments enforcement block]

### Finding 2: pi-autoresearch's segment architecture is real and code-enforced
Segments are genuine code-level constructs, not just documentation. Each `init_experiment` call increments `state.currentSegment`, resets `bestMetric` and `secondaryMetrics`, and inserts a new config header in the JSONL. The `findBaselineMetric()` function recalculates baseline per-segment using `currentResults(results, segment)` which filters to only the current segment. State reconstruction from JSONL also correctly tracks segment boundaries by detecting config entries. This confirms what wave1 recon described, but adds precision: segments are optimization phases (not research phases), and the baseline reset is per-metric, not per-question.
[SOURCE: https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts — init_experiment handler, findBaselineMetric(), reconstructState()]

### Finding 3: pi-autoresearch's auto-resume is a context-recovery mechanism, not stuck detection
The `agent_end` event handler with `MAX_AUTORESUME_TURNS = 20` and a 5-minute rate limit is designed to handle agent context exhaustion (when the LLM runs out of context window), NOT to detect stuck research. It simply resumes the same loop prompt. There is no comparison of recent results, no detection of repeated identical metrics, and no escalation to fundamentally different approaches. This is orthogonal to our stuck recovery protocol.
[SOURCE: https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts — agent_end event handler]

### Finding 4: AGR convergence is entirely prompt-driven with a manual intervention model
AGR's SKILL.md explicitly states "Never stop — runs until human interrupts." The `run_agr.sh` script accepts a `--max` parameter as a safety cap, but the actual convergence decision is delegated to the human operator. The stuck detection (">5 discards triggers re-read, try opposites, combine successes") is an instruction to the LLM agent, not code enforcement. However, AGR adds a unique nuance: its Metric+Guard separation means the LLM must evaluate both a numeric metric AND a correctness guard per experiment, with specific rework rules (GUARD FAILED + metric improved = REWORK max 2 attempts). This two-signal evaluation is more structured than our single newInfoRatio.
[SOURCE: https://github.com/JoaquinMulet/Artificial-General-Research/blob/main/skills/agr/SKILL.md — Core Principles, Decision Logic]

### Finding 5: AGR's variance-aware per-benchmark acceptance is a net-new convergence concept
AGR checks each sub-benchmark independently and accepts if ANY improves >5% without others regressing. This "GUARD PASSED + benchmark >5% up = KEEP (noise-masked improvement)" pattern acknowledges measurement noise masking real gains. Neither our system nor pi-autoresearch has this granular, per-dimension acceptance criterion. This is relevant for research quality assessment: rather than a single newInfoRatio, we could evaluate per-question improvement independently.
[SOURCE: https://github.com/JoaquinMulet/Artificial-General-Research/blob/main/skills/agr/SKILL.md — "Unique to AGR" section]

### Finding 6: Our convergence.md is significantly more sophisticated than any reference repo
Our 3-signal composite algorithm (rolling average w=0.30, MAD noise floor w=0.35, question entropy w=0.35) with a weighted consensus threshold of 0.60, plus the tiered stuck recovery (try opposites, combine prior findings, audit low-value), plus MAD-based statistical validation, plus graceful degradation for early iterations — none of this exists in any reference repo. pi-autoresearch has hard caps only. AGR has prompt-based human judgment only. autoresearch-opencode (from wave1 recon) has a `.autoresearch-off` sentinel for manual pause. Our system is the ONLY one with algorithmic convergence detection.
[INFERENCE: based on pi-autoresearch index.ts code analysis, AGR SKILL.md analysis, autoresearch-opencode wave1-repo-recon.md, and our convergence.md]

## Sources Consulted
- Our convergence.md: `.opencode/skill/sk-deep-research/references/convergence.md` (full read, 525 lines)
- pi-autoresearch index.ts: `https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts` (WebFetch, convergence/state/segment extraction)
- AGR SKILL.md: `https://github.com/JoaquinMulet/Artificial-General-Research/blob/main/skills/agr/SKILL.md` (WebFetch, convergence/stopping/stuck logic extraction)
- AGR repo root: `https://github.com/JoaquinMulet/Artificial-General-Research` (WebFetch, directory structure)
- pi-autoresearch repo root: `https://github.com/davebcn87/pi-autoresearch` (WebFetch, directory structure)

## Assessment
- New information ratio: 0.67
- Questions addressed: [RQ2]
- Questions answered: [RQ2 ~90% answered — convergence logic analyzed at code level for pi-autoresearch and AGR; autoresearch-opencode convergence was already characterized in wave1 recon as manual-only (.autoresearch-off sentinel). Remaining gap: AGR references/templates.md for STRATEGY.md format details, but this is minor.]

### newInfoRatio calculation
- Finding 1: FULLY NEW — pi-autoresearch having zero statistical convergence was unknown (wave1 recon noted "segment-aware" but didn't clarify it was count-only) = 1.0
- Finding 2: PARTIALLY NEW — segment architecture was described in wave1 recon, but code-level details (findBaselineMetric, per-metric reset) are new = 0.5
- Finding 3: PARTIALLY NEW — auto-resume was mentioned in wave1 recon, but confirmation it's NOT stuck detection is clarifying = 0.5
- Finding 4: PARTIALLY NEW — AGR's prompt-only convergence was hinted in wave1 recon, but Metric+Guard rework rules are new detail = 0.5
- Finding 5: FULLY NEW — per-benchmark variance-aware acceptance is entirely new concept for our analysis = 1.0
- Finding 6: PARTIALLY NEW — our superiority was implicit but explicit comparative confirmation and gap identification is new value = 0.5
- Calculation: (2 fully_new + 0.5 * 4 partially_new) / 6 = (2 + 2) / 6 = 0.67

## Reflection
- What worked and why: Fetching the pi-autoresearch index.ts blob page yielded excellent code-level extraction. The single-file architecture (all logic in one index.ts) made it easy to get a comprehensive view of convergence behavior. Asking for specific code constructs (maxExperiments enforcement, segment boundaries) in the WebFetch prompt focused the extraction well.
- What did not work and why: Initial blob URL attempts returned 404 (same issue as iteration 1). The repo root -> subdirectory -> file blob navigation pattern was needed. This is a consistent pattern worth documenting.
- What I would do differently: For iteration 3, I should start validating specific v2 proposals (RQ3) since RQ2 is now substantially answered. The AGR references/ subdirectory might have templates.md but it's diminishing returns for RQ2.

## Recommended Next Focus
RQ3: Validate our 18 v2 proposals against actual running code. Start with the 6 "easy-to-validate" proposals identified in wave1 (P1.5, P1.3, P1.4, P2.2, P2.6, P2.3). Cross-reference each against what we've learned about the reference repos' actual capabilities.
