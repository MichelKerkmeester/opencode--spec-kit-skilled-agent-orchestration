# Iteration 5: RQ6 -- GitHub Issues/PRs for Real-World Failure Modes

## Focus
Investigate GitHub issues and PRs across all 4 autoresearch repositories (pi-autoresearch, AGR, autoresearch-opencode, karpathy/autoresearch) to identify real-world failure modes that inform our v3 proposal prioritization. Ground our proposals in actual user pain points rather than theoretical concerns.

## Findings

### 1. Cross-Session State Leakage (pi-autoresearch #7) -- CRITICAL FAILURE MODE
pi-autoresearch experienced a critical bug where autoresearch state leaked across Pi sessions/projects. Module-level variables persisted widget state, system prompt injections, metrics counters, and auto-resume triggers across session switches. Users opening unrelated projects saw active autoresearch widgets, misleading metrics, and incorrect system prompts influencing agent behavior. **Fix**: Session-scoped storage keyed by session ID (PR #8).

**Relevance to our system**: Our sk-deep-research uses file-based state (JSONL + strategy.md) scoped to spec folders, which provides natural session isolation. However, if the orchestrator YAML workflow is interrupted and restarted, stale state files from a prior run could contaminate a new session. Our system has no equivalent "session ID keying" -- the state files are simply overwritten or appended. **This validates v2 proposal P1.1 (atomic state writes) and suggests a new proposal: state file session tagging to detect stale/orphaned state from interrupted runs.**
[SOURCE: https://github.com/davebcn87/pi-autoresearch/issues/7]

### 2. Zero-Yield Experiment Failure (karpathy #307) -- SYSTEMIC QUALITY DEGRADATION
Over 3 nights (March 14-17), karpathy's autoresearch produced 0 retained experiments from 400-560 daily attempts. Root cause: `gemma3:1b` model too small to generate code passing Gemini quality review. All proposals were systematically rejected for incomplete changes, non-compliance with docs style, and unfinished workflows. This is a "silent failure" -- the system kept running without crashing but produced zero value.

**Relevance to our system**: Our deep-research has an analogous failure mode: if the dispatched agent consistently produces low-quality findings (newInfoRatio = 0.0 for multiple iterations), the loop continues burning iterations without value. Our convergence detection catches this via the `newInfoRatio < threshold` signal, but only after multiple wasted iterations. **This supports a new v3 proposal: "early quality gate" that detects zero-yield patterns within 2 iterations (not 3+) and either escalates to a different strategy or halts with a diagnostic.**
[SOURCE: https://github.com/karpathy/autoresearch/issues/307]

### 3. Statistical Confidence Layer for Metric Improvements (pi-autoresearch #15) -- CONVERGENCE ENHANCEMENT
RFC proposing Median Absolute Deviation (MAD) to distinguish real metric improvements from noise. Formula: `confidence = |current_delta| / noise_floor` where `noise_floor = median(|metric[i] - metric[i-1]|)`. Thresholds: >=2.0x = likely real, 1.0-2.0x = marginal, <1.0x = noise. Advisory-only (never auto-discards), requires 3+ data points, color-coded visualization, persisted to JSONL.

**Relevance to our system**: Our newInfoRatio is our equivalent "metric" but it lacks statistical confidence scoring. We treat each ratio as an absolute truth, but it could be noise (e.g., an iteration that happens to find 1 new thing vs. 0 new things is 1.0 vs 0.0 -- massive swing from a single finding). **This strongly supports v2 proposal P3.1 (statistical validation) and provides a concrete implementation path: apply MAD-based confidence to newInfoRatio trajectory. A newInfoRatio of 0.3 after 5 iterations at 0.7+ might be "within noise" rather than "genuine convergence."**
[SOURCE: https://github.com/davebcn87/pi-autoresearch/issues/15]

### 4. Multi-Instance Conflict (pi-autoresearch #10, #12) -- CONCURRENCY PROBLEM
Two separate issues raised the problem of running multiple autoresearch loops simultaneously: #10 asked "how to deal with multiple autoresearches?" (answered: use subdirectories) and #12 proposed dedicated subdirectory-based isolation. Both were resolved by recommending separate project directories.

**Relevance to our system**: Our spec-folder-scoped state naturally isolates concurrent deep-research sessions. However, the YAML workflow and orchestrator do not enforce single-instance locks. Running `/spec_kit:deep-research` twice on the same spec folder simultaneously would cause JSONL corruption (concurrent appends) and strategy.md race conditions. **This suggests a new v3 proposal: "instance lock" via a PID/lock file in scratch/ to prevent concurrent deep-research on the same spec folder.**
[SOURCE: https://github.com/davebcn87/pi-autoresearch/issues/10, #12]

### 5. Repository Bloat from Experiment Logging (pi-autoresearch #3) -- DATA MANAGEMENT
The `tree-on-experiment-log` branch made git clone 150 MB heavier due to accumulated experiment log data. This is a long-term maintenance concern for any system that persists iteration data.

**Relevance to our system**: Our scratch/ directory accumulates iteration-NNN.md files (currently 14 files from spec 023, up to 15 per run). Each file is small (1-5 KB), but over many research runs, scratch/ directories could grow. More importantly, the JSONL state file grows monotonically. **This is a minor concern for our use case (text files, not binary data) but validates that our "scratch/ is ephemeral" design principle is correct. No v3 proposal needed -- existing cleanup is sufficient.**
[SOURCE: https://github.com/davebcn87/pi-autoresearch/issues/3]

### 6. AGR and autoresearch-opencode: Zero Issues Filed -- SIGNIFICANT SIGNAL
AGR has 0 open and 0 closed issues. autoresearch-opencode has 0 open and 0 closed issues. This is a significant data point: either these repos have very few users, or the prompt-only approach (no code-level complexity) produces fewer reportable bugs.

**Relevance to our system**: The absence of issues in prompt-only implementations contrasts with pi-autoresearch's 15+ issues (TypeScript code-level implementation). This reinforces the finding from iteration 1: code-level implementations surface more edge cases but also provide more robust solutions. Our mixed approach (YAML orchestrator + prompt-based agent) occupies a middle ground. **The implication: as we add more code-level features (v3 proposals), we should expect more edge cases to emerge and should plan for issue triage.**
[INFERENCE: based on comparative issue counts across repos with different implementation approaches]

### 7. Broader karpathy Failure Patterns (Issues #298, #64, #200, #239) -- EMERGING CONCERNS
From the karpathy/autoresearch repository (300+ issues, most-discussed):
- **#298 "Primary Agent Context window"**: Context window limitations affecting long research sessions -- directly relevant to our context isolation concerns
- **#64 "Indirect prompt injection via training output"**: Security concern where experiment outputs fed back to the agent could contain adversarial prompts -- a risk for any system that feeds findings back into agent context
- **#200 "Is there a plan to reduce hallucinations?"**: Research quality concern about model reliability in generating experimental proposals
- **#239 "Proposal: add a guidance agent before the working agent"**: Architectural pattern of a pre-filter/guidance agent to improve research quality before the main agent executes

**Relevance to our system**: #64 (prompt injection) is particularly relevant -- our deep-research agent reads prior iteration findings into its context. If a WebFetch returns adversarial content, it could persist through iteration files into future agent context. This is a security concern not addressed by any v2 or v3 proposal. **New v3 proposal candidate: "finding sanitization" or "content trust boundary" where iteration findings are validated before being fed back to future iterations.**
[SOURCE: https://github.com/karpathy/autoresearch/issues/298, #64, #200, #239]

## Sources Consulted
- https://github.com/davebcn87/pi-autoresearch/issues (open: 1 issue)
- https://github.com/davebcn87/pi-autoresearch/issues?q=is%3Aissue+is%3Aclosed (closed: 5 issues)
- https://github.com/davebcn87/pi-autoresearch/issues/7 (state leak detail)
- https://github.com/davebcn87/pi-autoresearch/issues/15 (statistical confidence RFC)
- https://github.com/JoaquinMulet/Artificial-General-Research/issues (0 issues)
- https://github.com/dabiggm0e/autoresearch-opencode/issues (0 issues)
- https://github.com/karpathy/autoresearch/issues?q=is%3Aissue+sort%3Acomments-desc (page 1)
- https://github.com/karpathy/autoresearch/issues?q=is%3Aissue+sort%3Acomments-desc&page=2 (page 2)
- https://github.com/karpathy/autoresearch/issues/307 (zero-yield detail)
- https://github.com/karpathy/autoresearch/issues?q=is%3Aissue+label%3Abug+sort%3Acomments-desc (bug label)

## Assessment
- New information ratio: 0.79
- Questions addressed: [RQ6]
- Questions answered: [RQ6 -- ~90% answered; remaining: deeper karpathy issue mining could yield 1-2 more patterns]

### New Information Breakdown
- Finding 1 (state leakage): Fully new -- pi-autoresearch-specific session isolation failure not in prior iterations (1.0)
- Finding 2 (zero-yield): Fully new -- karpathy-specific systematic quality failure pattern (1.0)
- Finding 3 (statistical confidence): Partially new -- reinforces known P3.1 but adds concrete MAD implementation path (0.5)
- Finding 4 (multi-instance): Fully new -- concurrency failure mode not previously identified (1.0)
- Finding 5 (repo bloat): Partially new -- known concern but concrete example from pi-autoresearch (0.5)
- Finding 6 (zero issues signal): Fully new -- comparative absence-of-issues insight (1.0)
- Finding 7 (karpathy patterns): Partially new -- security concern (#64) is novel, others reinforce known themes (0.5)
- Calculation: (4 * 1.0 + 3 * 0.5) / 7 = 5.5 / 7 = 0.79

## Reflection
- **What worked and why**: Fetching closed issues (not just open) was essential -- pi-autoresearch's most informative issue (#7, state leakage) was closed. Sorting karpathy by comment count surfaced the most discussed (and thus most impactful) issues first. The multi-repo comparison approach revealed that absence of issues in AGR/autoresearch-opencode is itself informative.
- **What did not work and why**: The karpathy repo's bug label filter only surfaced 1 issue despite 300+ total issues -- the repo does not consistently label bugs, making label-based filtering unreliable. Would need to read individual issue pages to find more failure modes.
- **What I would do differently**: For karpathy, search by specific keywords ("stuck", "failed", "crash", "loop", "corrupted") rather than relying on labels. Also check PRs (not just issues) since fixes often reveal failure modes in their descriptions.

## Recommended Next Focus
RQ7: Cross-domain convergence approaches. The statistical confidence layer from pi-autoresearch #15 provides a bridge to examining convergence detection methods from ML training (early stopping, patience schedulers), optimization (gradient convergence tests), and Bayesian optimization (expected improvement thresholds). This would ground our convergence algorithm improvements in established mathematical frameworks rather than ad-hoc heuristics.

## New v3 Proposal Candidates from This Iteration
1. **Session Tagging / Stale State Detection** (from Finding 1): Add run-session UUID to JSONL config record; detect and warn when state files are from a different session
2. **Early Zero-Yield Gate** (from Finding 2): Detect 2 consecutive iterations with newInfoRatio = 0.0 and trigger immediate strategy pivot or halt with diagnostic
3. **Instance Lock** (from Finding 4): PID/lock file in scratch/ to prevent concurrent deep-research on same spec folder
4. **Finding Content Trust Boundary** (from Finding 7): Sanitize/validate iteration findings before they enter future agent context to prevent prompt injection via WebFetch content
