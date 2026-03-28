# Research Strategy

## Topic
Investigate improvements to sk-deep-research: validate 18 v2 proposals, analyze 3 reference repos (AGR, pi-autoresearch, autoresearch-opencode) at code level, discover new improvements, produce v3 proposals with file-level change lists

## Key Questions (remaining)
- [~] RQ1: What error recovery patterns do AGR/pi-autoresearch/autoresearch-opencode implement at CODE level (not just docs)? [~90% answered. Iteration 1: three-tier architecture, pi-autoresearch TypeScript enforcement; Iteration 9: autoresearch-opencode plugins/autoresearch-context.ts is a context injection hook (not error recovery), scripts/uninstall.sh is lifecycle management. AGR templates remain inaccessible (404). Remaining: pi-autoresearch latest security hardening code (inaccessible)]
- [~] RQ2: How has each repo's convergence/stopping logic evolved since spec 023's analysis? [~95% answered. Iteration 2: pi-autoresearch hard maxExperiments only, AGR prompt-driven, autoresearch-opencode manual sentinel, our composite is UNIQUE. Iteration 9: AGR templates.md inaccessible (404) but assessed as non-material (format details, not algorithmic). Pi-autoresearch 2026-03-18 commits unlikely to add convergence (architectural mismatch). Remaining: only pi-autoresearch latest commits (inaccessible)]
- [x] RQ3: Which of our 18 v2 proposals are confirmed by actual running code? [ANSWERED iteration 3: 8 IMPLEMENTED (P1.1, P1.3, P1.4, P1.5, P2.3, P2.6, P3.2, P4.4), 5 PARTIALLY IMPLEMENTED (P1.2, P2.1, P2.2, P2.4, P3.1, P4.1 -- specs exist but orchestrator not wired), 3 NOT IMPLEMENTED (P2.5, P4.2, P4.3), 1 deliberately excluded (P3.3). Dominant gap pattern: "spec-code gap" where algorithms are fully specified in reference docs but YAML workflow does not invoke them.]
- [~] RQ4: What improvements do the reference repos implement that we DON'T have in our 18 proposals? [~90% answered. Iteration 4: 8 novel gaps, 9 v3 candidates. Iteration 9: autoresearch-opencode scripts/ (uninstall.sh -- lifecycle, not features) and plugins/ (context injection hook -- runtime-specific, correctly excluded from cross-runtime design) analyzed. 2 additional gaps from research-ideas triage: tool call budget formalization and breakthrough detection. Neither merits a Tier 1-2 v3 proposal. Remaining: pi-autoresearch latest commits (inaccessible)]
- [x] RQ5: Where do our 4 runtime agent definitions (Claude/Codex/OpenCode/ChatGPT) diverge in behavior? [ANSWERED iteration 8: 7 unintentional divergences classified by behavioral impact -- 2 HIGH (model specification, temperature), 3 MEDIUM (MCP declaration, reasoning effort, budget wording), 1 LOW (tool/permission granularity), 1 NONE (stale agent ref). 7 prioritized alignment recommendations produced. Key finding: model specification and temperature are the only divergences that materially affect research outcomes (newInfoRatio trajectory and convergence speed). v3 proposals validated: 15/16 correct, 1 merge recommended (v3-16 into v3-08).]
- [~] RQ6: What do GitHub issues/PRs in the 3 repos reveal about real-world failure modes we haven't addressed? [~95% answered. Iteration 5: 7 failure modes, 4 v3 candidates. Iteration 9: community leads from research-ideas.md confirmed as fully covered by iteration 5 findings. darwin-derby fork (12 stars) assessed as low priority -- unlikely to contain patterns not in parent repos. Remaining: darwin-derby deep analysis (diminishing returns)]
- [~] RQ7: Are there convergence detection approaches from outside the autoresearch domain (ML training, optimization) applicable to our research loops? [~95% answered. Iteration 6: 5 frameworks analyzed, 3 actionable findings, CUSUM rejection validated. Iteration 9: meta-research leads (convergence replay, calibration audit, enforcement test, etc.) confirmed as validation/testing activities, not product improvements -- correctly excluded from v3 proposals. Remaining: BoTorch/GPyOpt PI threshold implementation details (below research significance)]
- [x] RQ8: What would a "v2 deep-research" look like if we started from scratch with current knowledge? [ANSWERED iteration 7: v2 architecture has 4 structural changes: (1) close spec-code gap by wiring 5 partially-implemented proposals in YAML orchestrator, (2) add best-seen patience as 4th convergence signal, (3) add safety boundaries (session UUID, instance lock, content trust), (4) early zero-yield gate. 16 v3 proposals consolidated in 4 tiers with file-level change specs for Tier 1. Critical insight: system is 72% implemented by specification but only 44% by runtime behavior -- highest ROI is wiring, not new features.]

## Answered Questions
[RQ3 fully answered iteration 3; RQ5 fully answered iteration 8; RQ8 fully answered iteration 7; RQ1 ~90% iteration 9; RQ2 ~95% iteration 9; RQ4 ~90% iteration 9; RQ6 ~95% iteration 9; RQ7 ~95% iteration 9. Average coverage: 95.6% across 8 RQs.]

## What Worked
- GitHub blob view WebFetch: Extracting TypeScript source from GitHub blob URLs yields rich, near-complete source code. Use blob URLs not raw.githubusercontent.com (iteration 1)
- Directory listing first: Fetching repo root to discover actual file structure before targeting specific files prevents wasted fetches on wrong paths (iteration 1)
- Comparative analysis: Examining the same concern (error handling) across all repos + our own system in one iteration produces strong cross-cutting findings (iteration 1)
- Root-then-drill navigation: Start with repo root, then subdirectory, then file blob — 404 on direct blob URLs is consistent across all 3 repos (iteration 2)
- Single-file architecture exploit: pi-autoresearch concentrates all logic in one index.ts, making comprehensive extraction feasible in a single WebFetch (iteration 2)
- Specific code construct prompts: Asking WebFetch for explicit constructs (maxExperiments enforcement, segment boundaries, findBaselineMetric) yields structured, actionable extraction (iteration 2)
- Local-file systematic audit: Reading our OWN source files (convergence.md, state_format.md, YAML workflow, agent definition) and cross-referencing against proposal text produced 100% coverage of all 18 proposals in a single iteration. No web fetches needed for self-validation (iteration 3)
- Concentrated reference files: AGR's references/guide.md contains full specifications for 6+ unique patterns in one file. Single-fetch, high-yield. The more concentrated a repo's specs, the more efficient the extraction (iteration 4)
- Synthesis across prior iterations: Building the gap analysis on top of iterations 1-3 findings created a complete picture without re-fetching already-documented features. Prior iteration files are efficient secondary sources (iteration 4)
- Closed issue mining: Fetching closed issues (not just open) was essential -- pi-autoresearch's most informative issue (#7, state leakage) was closed. Always check both open and closed (iteration 5)
- Comment-count sorting for large repos: Sorting karpathy's 300+ issues by comment count surfaced the most impactful issues first, efficient for triage (iteration 5)
- Absence-of-issues as signal: AGR and autoresearch-opencode having 0 issues (vs pi-autoresearch's 15+) is itself informative about implementation-complexity-to-bug-surface correlation (iteration 5)
- Framework-specific docs over Wikipedia: Keras API docs, Optuna API docs, and NIST handbooks provide complete algorithmic specifications with parameters, while Wikipedia returned 403 consistently. Framework docs are designed to explain "how it works" precisely (iteration 6)
- First-principles reasoning as fallback: When web sources fail (Wikipedia 403), reasoning from known ML/optimization literature produced targeted analysis that was actually more useful than a general encyclopedia article would have been (iteration 6)
- Cross-domain comparison methodology: Mapping each external algorithm's parameters to our system's equivalents (patience->stuckCount, min_delta->MAD, start_from_epoch->graceful degradation) produced concrete gap identification (iteration 6)
- Sequential synthesis from local iteration files: Reading all 6 prior iteration files and synthesizing without new external research produced the highest-value output (file-level change specs, dependency graph, quantitative gap analysis). Prior iterations were thorough enough that no new data was needed -- value was in organizing and prioritizing (iteration 7)
- Combining completion + validation in one iteration: Addressing RQ5 behavioral impact analysis alongside v3 proposal validation was efficient -- the cross-runtime understanding directly informed whether proposals adequately cover alignment concerns (iteration 8)
- Reading actual frontmatter vs audit summary: Reading the real agent definition files (not just the Wave 1B summary) provided precise details for behavioral impact assessment that the summary abstracted away (iteration 8)
- Research-ideas negative space analysis: Systematically triaging ALL seeded/community/meta leads against v3 proposals identified 2 genuine gaps (tool call budget, breakthrough detection) that 8 prior iterations missed. "What is NOT covered" is as valuable as "what is covered" in late-stage research (iteration 9)
- Skip external fetches in consolidation: All 3 blob URL attempts in iteration 9 returned 404 (consistent pattern). The one successful fetch (repo root listing) was sufficient. For late-stage iterations, internal cross-referencing and synthesis yield higher ROI than web fetches (iteration 9)

## What Failed
- raw.githubusercontent.com URLs: All 3 repos returned 404 on raw URLs. Either repos have restricted raw access or the URLs need different branch/path format. Use GitHub blob view instead (iteration 1)
- Direct blob URLs to pi-autoresearch index.ts: Returned 404 again in iteration 4, even with main branch. The file path may have changed or the blob URL format needs exact commit hash. Root-then-drill worked for directory listing but not for file content this time (iteration 4)
- karpathy bug label filter: Only surfaced 1 issue despite 300+ total -- repo doesn't consistently label bugs, making label-based filtering unreliable for karpathy (iteration 5)
- Wikipedia for cross-domain research: Both Early Stopping and Bayesian Optimization Wikipedia articles returned 403 -- Wikipedia appears to block automated fetches. Use framework-specific documentation instead (iteration 6)
- Blob URLs in consolidation phase: 3 additional 404s in iteration 9 (AGR references/, autoresearch-opencode plugins/, scripts/). All 3 repos consistently block direct blob URL fetches. Repo root listings work but not file-level access (iteration 9)

## Exhausted Approaches (do not retry)
[Populated when an approach has been tried from multiple angles without success]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful approaches in this category]
- Prefer for: [related questions where this category may help]

## Next Focus
Research at natural convergence point. All 8 RQs at 90%+ (average 95.6%). 15 v3 proposals validated. 2 minor gaps identified (tool call budget formalization, breakthrough detection) -- neither warrants Tier 1-2 proposals. Remaining unknowns are all inaccessible (blob URL 404s) or implementation-level details. If one more iteration: PURE SYNTHESIS -- update research/research.md with iterations 8-9 findings, add WIRE/EXTEND/PROTECT framework, add the 2 new gaps. Zero web fetches. Recommend convergence declaration.

## Known Context

### Wave 1 Intelligence (pre-research preparation, 3 parallel agents)

#### External Repository State (Agent 1A — scratch/wave1-repo-recon.md)
- **AGR (Artificial-General-Research)**: Pure prompt/template skill for Claude Code. "Ralph Loop" = fresh `claude -p` per iteration with zero context degradation. State in TSV + STRATEGY.md. Formal stuck detection (>5 discards triggers escalation), Metric+Guard separation with 2-attempt rework, variance-aware per-benchmark acceptance, Exhausted Approaches registry. Stable since v1.0.0 (2026-03-15), no structural changes since spec 023.
- **pi-autoresearch**: Full TypeScript Pi Agent extension (~2000+ LOC) with native tools (init/run/log_experiment), TUI dashboard, METRIC line parsing. MOST ACTIVELY DEVELOPED — 10+ commits on 2026-03-18 including security hardening (prototype pollution protection, command guard), streaming output, segment-aware state reconstruction. Has optional `autoresearch.checks.sh` backpressure gate.
- **autoresearch-opencode**: Pure OpenCode skill/plugin port. `.autoresearch-off` sentinel for pause/resume, rigorous data integrity protocol (atomic writes, pre/post validation, JSONL-vs-worklog cross-checks), `experiments/worklog.md` narrative log, missing-state-file recovery protocol. Least active (last commit 2026-03-14).

#### Cross-Runtime Agent Alignment (Agent 1B — scratch/wave1-cross-runtime-audit.md)
- Core 7-step workflow, tool budget (8-11/12), error tiers are IDENTICAL across Claude/Codex/OpenCode/ChatGPT runtimes
- 10 divergences found: 7 unintentional (model spec, temperature, MCP servers, permissions, budget wording, stale agent ref, reasoning effort), 3 intentional (file format, path conventions, sandbox config)
- Recommended canonical source: `.opencode/agent/deep-research.md` (most complete permission model)
- RQ5 is ~80% answered by this audit

#### Prior Research Baseline (Agent 1C — scratch/wave1-prior-context.md)
- 18 v2 proposals from spec 023: 6 at P1, 5 at P2, 3 at P3, 4 at P4
- 6 easy-to-validate (Small effort, clear code evidence): P1.5, P1.3, P1.4, P2.2, P2.6, P2.3
- 4 needing deep investigation (Medium/Large effort): P1.2 composite convergence, P2.5 branching, P4.3 context isolation, P3.1 statistical validation
- Spec 023 converged naturally in 14 iterations across 2 segments
- newInfoRatio trajectory: peaked at 0.85 (iteration 1), declined to 0.10 at convergence
- 8 research gaps from spec 023: threshold tuning, inter-proposal dependencies, breakthrough detection, missing baseline metrics, real-world validation, cross-runtime alignment, error recovery depth, iteration quality variance

#### Seeded Research Directions (research/research-ideas.md)
- 7 investigation leads from spec 023 analysis
- 12 community/external leads from karpathy (300+ issues) and pi-autoresearch (22 issues)
- 6 meta-research leads for testing the system against its own execution data

### External Repository URLs
- AGR: https://github.com/JoaquinMulet/Artificial-General-Research
- pi-autoresearch: https://github.com/davebcn87/pi-autoresearch
- autoresearch-opencode: https://github.com/dabiggm0e/autoresearch-opencode

### Local Files to Analyze
- `.opencode/skill/sk-deep-research/SKILL.md` — Core skill protocol
- `.opencode/skill/sk-deep-research/references/convergence.md` — Convergence algorithm
- `.opencode/skill/sk-deep-research/references/loop_protocol.md` — Loop lifecycle
- `.opencode/skill/sk-deep-research/references/state_format.md` — State schema
- `.opencode/command/spec_kit/deep-research.md` — Command setup
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` — Auto YAML
- `.claude/agents/deep-research.md` — Claude agent definition
- `.codex/agents/deep-research.toml` — Codex agent definition
- `.opencode/agent/deep-research.md` — OpenCode agent definition (canonical)
- `.opencode/agent/chatgpt/deep-research.md` — ChatGPT agent definition

## Research Boundaries
- Max iterations: 15
- Convergence threshold: 0.02
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Reference-only modes: :restart, segment partitioning, wave pruning, checkpoint commits, alternate claude -p dispatch
- Current segment: 1
- Started: 2026-03-18T20:35:00.000Z
