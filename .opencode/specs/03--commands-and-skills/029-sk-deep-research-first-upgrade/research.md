# Deep Research: Improving sk-deep-research from ResearcherSkill & autoresearch

> **Topic:** How can auto-research approaches from krzysztofdudek/ResearcherSkill and pjhoberman/autoresearch improve our sk-deep-research skill?
> **Iterations:** 5 (Wave 1) | **Stop reason:** all_questions_answered | **Avg newInfoRatio:** 0.83

---

## 1. Executive Summary

Two open-source auto-research implementations — **ResearcherSkill** (experiment-driven, branch-aware) and **pjhoberman/autoresearch** (metric-driven, harness-generated) — were analyzed against our **sk-deep-research** skill (v1.0.0). Both repos generalize Karpathy's autoresearch loop beyond ML, and each brings innovations our skill currently lacks.

**Key finding:** Our skill's core architecture (fresh-context LEAF dispatch, JSONL state, composite convergence) is already strong. The biggest gains come from layering capabilities **on top** of it, not replacing it.

**Critical caveat (from Opus ultra-think review):** Both source repos do *code optimization with measurable numerical metrics*. Our skill does *knowledge research with subjective agent-judged assessment*. Every borrowed pattern requires a domain-translation step. Proposals below are adjusted accordingly.

**Top P0 improvements (revised after critical review):**
1. Persistent dashboard + resume decision summary (easiest, immediate observability)
2. Negative knowledge as first-class output (template change, near-zero cost)
3. Simplified quality guards on convergence (binary checks, not 4-part rubric)

**Demoted to P1 (higher complexity, uncertain value for knowledge research):**
- Structured novelty accounting (adds 5 subjective fields instead of 1 — use justification field instead)
- Live segments/branches (conflates code branching with research focus changes; start with lightweight track labels)

---

## 2. Source Repos Analyzed

### ResearcherSkill (krzysztofdudek/ResearcherSkill)
- **What it is:** Single-file autonomous experimentation skill for Claude Code, Codex, or any agent
- **Core innovation:** Branchable experiment DAG with .lab/ state container, hypothesis strategies, thought experiments, qualitative rubrics, pattern-based convergence signals
- **Key philosophy:** "Think, Test, Reflect, repeat" with complete autonomy and non-linear branching
- **Strengths:** Rich experiment genealogy, git-backed rollback, flexible convergence, periodic revalidation
- **v1.1.0 addition:** Criteria-discovery before qualitative rubric construction

### pjhoberman/autoresearch
- **What it is:** Claude Code plugin for autonomous experiment loops with "one file, one metric, one loop" constraint
- **Core innovation:** Harness generation (instructions + eval script + test data + launch prompt), noise-aware scoring, guard metrics
- **Key philosophy:** "93% of experiments fail — the value is in the 41 dead ends you eliminated"
- **Strengths:** Best noise handling, explicit quality protection via guard metrics, production-tested lessons
- **Includes:** `autoresearch-discover` skill for finding optimization candidates

### Wave 2 Repos (5 additional)

### assafelovic/gpt-researcher
- **What it is:** Multi-agent research orchestration framework with planner/executor/publisher decomposition
- **Core innovation:** Tree-like depth/breadth traversal, parallel shard execution with merge-at-end, shard-local reviewer/reviser loops, source curation pipeline
- **Key delta:** First multi-agent decomposition pattern analyzed; shows planner-owned shards + merge is simpler than persistent branch state

### aiming-lab/AutoResearchClaw
- **What it is:** End-to-end autonomous paper generation pipeline (23 stages across 8 phases)
- **Core innovation:** Typed stage transitions with rollback, diagnosis-led self-repair, multi-perspective debate (save dissenting views before synthesis), citation verification via DOI/CrossRef/OpenAlex/arXiv, cross-run memory with decay
- **Key delta:** Moves beyond "better loop judgment" to a fully operationalized research production line

### Orchestra-Research/AI-Research-SKILLs
- **What it is:** Library of 90+ research skills organized as coordinator + specialized leaf skills
- **Core innovation:** Routing-based soft-coupled composition, strict authoring contracts, hypothesis refutation as loop-level concern (not separate skill), shallow cross-skill dependencies
- **Key delta:** Strongest argument for modularizing sk-deep-research into a small skill family instead of growing one monolith

### snarktank/ralph
- **What it is:** Minimalist "Ralph Loop" — bash script spawning fresh Claude agents in a loop
- **Core innovation:** Proves essential loop is tiny (spawn, execute, log, check done, repeat). Quality comes from tightly bounded work units + external verifiers, not orchestration complexity
- **Key delta:** Validates our core (fresh context, file state, append-only logs) while challenging optional complexity (waves, segments, checkpoints)

### wanshuiyin/ARIS (Auto-claude-code-research-in-sleep)
- **What it is:** Lightweight Markdown-only research skills with zero framework dependencies and cross-model support
- **Core innovation:** Protocol-first workflow (Markdown as portability layer), thin runtime/reviewer overlays instead of forks, compact recovery artifacts for weaker runtimes, standardized reviewer transport contract
- **Key delta:** Strongest portability model — separates workflow protocol from host runtime more cleanly than our path-resolution approach

---

## 3. Architecture Comparison

| Dimension | sk-deep-research (ours) | ResearcherSkill | pjhoberman/autoresearch |
|-----------|------------------------|-----------------|------------------------|
| **Purpose** | Iterative deep research | Autonomous experimentation | Metric optimization |
| **Loop model** | Sequential LEAF dispatch | THINK→TEST→REFLECT cycle | Edit→eval→keep/revert loop |
| **State container** | Config JSON + JSONL + strategy.md + iterations | .lab/ (config, results.tsv, log, branches, parking-lot) | JSONL + dashboard |
| **Context isolation** | Fresh context per iteration (core design) | Single long session (reads state files) | Single session (JSONL as recovery) |
| **Branching** | Reference-only (segments/waves) | First-class (fork from any keep) | Round-based (new harness per round) |
| **Convergence** | 3-signal composite weighted vote | Pattern-based heuristic table | Noise-calibrated plateau detection |
| **Stuck recovery** | 3-strategy selection + 5-tier escalation | Freeform strategy shifts + branch switching | Stop and start new round |
| **Quality protection** | Question coverage entropy | Revalidation every 10 experiments | Guard metrics + confirmation runs |
| **Resume** | Strict state-agreement validation | Phase 0 summary + user choice | JSONL re-read + continue |
| **Autonomy** | Full (no user consultation) | Bounded (consult at scope/exhaustion) | Setup requires user; loop is autonomous |

---

## 4. Findings by Research Question

### Q1: ResearcherSkill Architectural Innovations

Nine key innovations identified (iteration-001, newInfoRatio: 0.88):

1. **Branchable exploration DAG** — Non-linear experiment history with fork/merge from any successful state. Our loop is effectively linear with recovery pivots. Upgrade: add `researchTracks` to JSONL state.

2. **Structured .lab/ state container** — Role-specific artifacts (config.md, results.tsv, log.md, branches.md, parking-lot.md) vs our generic scratch/ bundle. Upgrade: introduce sub-structure inside scratch/.

3. **Phase 0 resume check** — Interactive summary + "resume or archive-and-restart" choice. Our auto-resume is orchestrator-centric without human checkpoint. Upgrade: add pre-resume summary + explicit choice.

4. **Pattern-based convergence signals** — 7+ qualitative patterns (discards streak, area repetition, keep/discard alternation, branch stagnation) as steering signals, not just stopping signals. Upgrade: layer heuristic detectors on top of our composite vote.

5. **Hypothesis strategy library** — 10 named move types (ablation, amplification, combination, inversion, isolation, analogy, simplification, scaling, decomposition, sweep). Our recovery has only 3 strategies. Upgrade: promote strategy selection to a first-class state field.

6. **Thought experiments** — First-class `thought` status for analytical iterations that produce no code changes. Our schema lacks an equivalent. Upgrade: add `mode` field for thought/survey/synthesis-only iterations.

7. **Qualitative rubric system** — Weighted multi-criteria scoring for non-numerical metrics with criteria-discovery assistance. We have no formal mechanism for judging research quality beyond newInfoRatio. Upgrade: add optional rubric layer.

8. **Periodic revalidation** — Re-score current best every 10 experiments to detect drift. We have no scheduled audit pass. Upgrade: add periodic synthesis audit every N iterations.

9. **Bounded consultation** — Autonomy with explicit exception points (scope violation, exhaustion). Our contract is stricter ("never ask"). Upgrade: add consultation checkpoints for resume, ambiguity, and post-recovery exhaustion.

### Q2: pjhoberman/autoresearch Patterns

Eight key patterns identified (iteration-002, newInfoRatio: 0.82):

1. **Harness generation** — Full execution harness (instructions, eval script, test data, launch prompt) generated before loop starts. Our init creates config/strategy/state but no "research harness" artifact set. Upgrade: add generated preflight pack (round brief, source scorecard, dispatch prompt, review sheet).

2. **Bounded research-segment contract** — "One file, one metric, one loop" adapted to research = one question cluster, one success scorecard, one evidence surface per round. Upgrade: define bounded research segments with explicit constraints.

3. **Dashboard layer** — Human-readable dashboard regenerated each iteration showing baseline, current best, status counts, guard state. Our state is machine-readable but lacks compact human summary. Upgrade: add `deep-research-dashboard.md`.

4. **Noise-aware scoring** — Baseline stability checks (3 runs), min-delta thresholds, confirmation runs for borderline wins. Our MAD noise floor acts after iterations, not before. Upgrade: add pre-loop calibration and min-delta for newInfoRatio.

5. **Guard metrics** — Secondary metrics that must not regress (guard_fail status). newInfoRatio alone can reward novelty while harming rigor. Upgrade: guard on citation completeness, source diversity, evidence strength.

6. **Multi-round experiment design** — Round 2 is an explicit new harness, not just more iterations. Lessons warn about co-optimization ceiling. Upgrade: add live round-transition protocol with explicit round hypothesis.

7. **Discovery skill** — Preflight scan for good optimization targets before expensive loop. Our init generates questions but doesn't score researchability. Upgrade: add discovery/preflight scoring of question clusters and evidence surfaces.

8. **Dead ends as primary output** — "93% fail" philosophy with dead-end log as product. Our "What Failed" is a side note, not a first-class output. Upgrade: make dead-end map a mandatory synthesis artifact and convergence input.

### Q3: Convergence & Stopping Mechanisms

Five comparative findings (iteration-003, newInfoRatio: 0.78):

| Aspect | sk-deep-research | ResearcherSkill | autoresearch |
|--------|-----------------|-----------------|--------------|
| **Model** | Deterministic state machine | Heuristic pattern table | Noise-calibrated plateau |
| **Statistical rigor** | Moderate (MAD) | Low | High (variance, min-delta, confirmation) |
| **Quality protection** | Question coverage | Revalidation + KEEP* | Guard metrics + guard_fail |
| **Stuck handling** | Procedural escalation | Freeform strategy shifts | Constrain setup, declare ceiling |
| **Biggest strength** | Balanced auditability | Rich pattern intuition | Best noise protection |
| **Biggest gap** | No calibration, no pattern heuristics | Hard to reproduce | Less autonomous recovery |

**Synthesis:** Keep our composite vote. Layer two additions: (1) autoresearch-style pre-loop calibration + min-delta, (2) ResearcherSkill-style pattern heuristics as advisory signals.

### Q4: State Management & Context Resilience

Five comparative findings (iteration-004, newInfoRatio: 0.86):

| Dimension | sk-deep-research | ResearcherSkill | autoresearch |
|-----------|-----------------|-----------------|--------------|
| **State container** | Config JSON + JSONL + strategy + iterations + research.md | .lab/ (6 files + git) | JSONL + dashboard |
| **Code-state tracking** | Weak (checkpoint commits reference-only) | Strongest (commit before, revert on discard) | Medium |
| **Resume safety** | Strictest (state-agreement validation) | Best UX (summary + user choice) | Lightest (re-read JSONL) |
| **Compaction resilience** | Strongest (fresh context by design) | Implicit only | Explicit JSONL recovery |
| **Multi-round** | Reference-only segments | Branch tree in one lab | Sequential rounds with new harness |

**Synthesis:** Our typed state model is the strongest for orchestrated research. Borrow: dashboard (autoresearch), branch/ideas registry (ResearcherSkill), resume decision flow (ResearcherSkill).

### Q5: Actionable Improvement Priorities

Seven proposals ranked by impact and feasibility (iteration-005, newInfoRatio: 0.82):

---

## 5. Priority Improvement Matrix (Revised After Critical Review)

> **Domain caveat:** Source repos optimize code with numerical metrics. Our skill researches knowledge with agent-judged scores. Each proposal below includes its knowledge-research adaptation.

| Priority | Improvement | Impact | Feasibility | Adaptation Note |
|----------|-----------|--------|-------------|-----------------|
| **P0-1** | Persistent dashboard + resume decision | High | Easy | Direct transfer — auto-generate from JSONL |
| **P0-2** | Negative knowledge as first-class output | High | Easy | Template change; dead-end map as convergence signal |
| **P0-3** | Simplified quality guards on convergence | High | Moderate | Binary checks (>=2 sources, focus alignment), not rubric scores |
| **P1-1** | Per-iteration time/tool budget | Medium | Easy | Config addition; prevents runaway iterations |
| **P1-2** | Novelty justification field | Medium | Easy | Add 1-sentence justification to newInfoRatio, not full categorization |
| **P1-3** | Lightweight track labels for segments | Medium | Moderate | Label focus changes, not formal branches; defer full segment activation |
| **P1-4** | Research charter + preflight gate | Medium | Easy | Extend strategy template with non-goals and stop conditions |
| **P1-5** | Source-hygiene confirmation | Medium | Moderate | Keeps position; moderate value for knowledge research |
| **P1-6** | Iteration outcome statuses (`insight`, `thought`) | Medium | Easy | Add statuses for non-evidence iterations |
| **P2** | Source freshness awareness | Low | Moderate | WebFetch 15-min cache creates stale-source risk in rapid loops |

### What Changed From Original Priorities

| Original | Change | Reason |
|----------|--------|--------|
| P0-1: Live segments/branches | Demoted to P1-3 | Conflates code branching with research direction; our "Next Focus" already handles pivots; high complexity, uncertain value |
| P0-3: Structured novelty accounting | Replaced with P1-2 (justification field) | Distributes subjectivity across 5 fields instead of 1; doesn't eliminate the core problem |
| P1-6: Negative knowledge | Promoted to P0-2 | Template-level change, near-zero cost, immediate synthesis value |
| P0-4: Dashboard | Promoted to P0-1 | Easiest to implement, immediate observability payoff |
| NEW: Per-iteration budget | Added as P1-1 | ResearcherSkill has wall-clock budgets; prevents runaway iterations |
| NEW: Iteration statuses | Added as P1-6 | `insight` and `thought` statuses missed in original research |

---

## 6. Detailed Improvement Proposals (Revised)

### P0-1: Persistent Dashboard + Resume Decision
- **What:** Generate `deep-research-dashboard.md` after each iteration; on resume, present state summary and offer resume/restart/fork choice
- **Why:** Makes long sessions observable, reduces resume mistakes, provides compact recovery surface after compaction
- **How:** Dashboard derived from existing JSONL + strategy data; resume flow adds human checkpoint before continuing
- **Domain fit:** Direct transfer — works identically for knowledge research and code optimization
- **LEAF constraint:** Resume decision happens at orchestrator level (YAML workflow), not in the LEAF agent

### P0-2: Negative Knowledge as First-Class Output
- **What:** Elevate "what did not work" and "what can be ruled out" into required structured outputs
- **Why:** Increases value of partial research; dead-end map as convergence input (space of alternatives mostly exhausted = done)
- **How:** Add `Ruled Out`, `Dead Ends`, `Confidence` fields to iteration output; mandatory synthesis section
- **Domain fit:** Excellent — dead-end tracking is arguably MORE valuable for knowledge research than code optimization

### P0-3: Simplified Quality Guards
- **What:** Add binary quality checks that block convergence when evidence is thin
- **Why:** Prevents premature convergence when questions are "answered" shallowly
- **How:** Binary checks: (1) >=2 unique sources per answered question, (2) focus alignment with original key questions, (3) no answered question relies solely on a single weak source. Block STOP unless checks pass.
- **Domain fit:** Binary checks work for subjective domains; avoid rubric scores that create subjective-on-subjective layering
- **Key difference from original P0-2:** No 4-part rubric. Binary pass/fail only. The fundamental measurement problem (agent-judged quality) means rubric scores add complexity without trustworthiness.

### P1-1: Per-Iteration Time/Tool Budget (NEW)
- **What:** Add `maxToolCallsPerIteration` and `maxMinutesPerIteration` to config
- **Why:** An agent spending 20 minutes with 12 tool calls on one iteration is likely going in circles
- **How:** Config field; orchestrator enforces after dispatch
- **Source:** ResearcherSkill's "wall-clock budget per experiment" (default 5 min)

### P1-2: Novelty Justification Field (REVISED from original P0-3)
- **What:** Add a 1-sentence `noveltyJustification` field alongside `newInfoRatio` in each JSONL iteration record
- **Why:** Provides auditability without schema changes or classification overhead
- **How:** Agent appends: `"newInfoRatio": 0.7, "noveltyJustification": "2 new findings on reconnection, 1 refinement of prior backoff finding"`
- **Key difference from original:** Does NOT replace newInfoRatio with structured categories. Structured categories (new/refinement/confirmation/duplicate/contradiction) just distribute subjectivity across 5 fields instead of 1.

### P1-3: Lightweight Track Labels (REVISED from original P0-1)
- **What:** Add an optional `focusTrack` label to iteration records to group related iterations
- **Why:** Enables post-hoc analysis of which research directions were productive
- **How:** Agent tags each iteration with a track label (e.g., "browser-support", "backoff-algorithms"); no formal branching or segment infrastructure needed
- **Key difference from original:** Does NOT promote full segment/branch support to live. Our "Next Focus" mechanism already handles direction changes. Formal branching conflates code-state branching (git-backed) with research-direction changes (focus-based).

### P1-4: Research Charter + Preflight Gate
- **What:** Short initialization charter recording objective, deliverable, source boundaries, stop conditions, non-goals, initial questions
- **Why:** Reduces wasted loops from fuzzy problem framing
- **How:** Extend strategy template with "Non-goals" and "Stop conditions" sections; review checkpoint in confirm mode
- **Note:** Already partially exists via our config + strategy initialization; this formalizes it

### P1-5: Source-Hygiene Confirmation
- **What:** Treat single-source or weak-source findings as tentative until confirmed by independent source
- **Why:** Reduces false confidence on noisy/stale/contradictory topics
- **How:** Track `tentativeFindings` vs `confirmedFindings` in state; only confirmed findings count toward question coverage

### P1-6: Iteration Outcome Statuses (NEW)
- **What:** Add `insight` and `thought` statuses to the iteration record schema
- **Why:** ResearcherSkill distinguishes real experiments from thought experiments; `insight` captures iterations with low newInfoRatio but important conceptual breakthroughs
- **How:** Extend JSONL status enum: `complete | timeout | error | stuck | insight | thought`
- **Note:** Our existing `research-ideas.md` backlog (loop_protocol.md lines 175-200) already serves a similar purpose to ResearcherSkill's `parking-lot.md` — this was missed in the original research

---

## 7. Additional Improvements Identified (Cross-Cutting)

From iteration-001 analysis:
- **Hypothesis strategy library** — Expand recovery from 3 strategies to 10+ named moves (ablation, amplification, combination, inversion, isolation, analogy, simplification, scaling, decomposition, sweep). Make strategy a first-class JSONL field.
- **Periodic revalidation** — Every N iterations, re-read highest-value prior iterations and audit whether research direction is genuinely improving.

From iteration-002 analysis:
- **Harness generation** — Generate a preflight pack (round brief, source scorecard, dispatch prompt) before autonomous execution starts.
- **Bounded research segments** — One question cluster + one scorecard + one evidence surface per round.
- **Discovery/preflight mode** — Score question clusters and evidence surfaces for researchability before committing to a loop.

From critical review (ultra-think):
- **"Verify influence first"** — Before committing iterations to a question, verify it has researchable content (adapted from autoresearch lessons: "set output to garbage and check if score changes").
- **Hard stop between rounds** — Autoresearch mandates human review between rounds. If we activate round transitions, include a similar hard boundary.
- **Source freshness awareness** — WebFetch has a 15-minute cache. Iterations within 15 minutes see identical web content, creating a de facto stale-source problem for rapid loops.
- **Default iteration ceiling** — Autoresearch defaults to 30 iterations; our default is 10. Consider whether 10 is too low for complex topics.

---

## 8. What Our Skill Already Does Well

Important context: both reference repos validate several of our existing design choices:

1. **Fresh context per iteration** — Neither repo has this. ResearcherSkill runs in a single long session; autoresearch uses JSONL for compaction recovery. Our approach eliminates context degradation in long runs. *(Tradeoff: the agent loses accumulated conceptual connections between iterations — state files must carry all continuity.)*

2. **Typed state with declared mutability** — Config (immutable), JSONL (append-only), strategy (mutable), iterations (write-once). More structured for machine-readability than either repo. *(Note: ResearcherSkill's .lab/ is more structured for human audit — different strengths for different audiences.)*

3. **Formal convergence algorithm** — Our 3-signal composite is more deterministic and auditable than ResearcherSkill's heuristic patterns or autoresearch's implicit plateau detection. *(Gap: lacks quality dimension — all signals measure information quantity, not quality.)*

4. **5-tier error recovery cascade** — Most procedural and complete *infrastructure* recovery model. *(Gap: both source repos address research-quality recovery via guard metrics and revalidation, which our tiers miss.)*

5. **Progressive synthesis** — research.md updated each iteration. Neither repo has an equivalent progressive output.

6. **Pause sentinel** — Graceful intervention for autonomous runs. Unique to our implementation.

7. **Existing research-ideas.md backlog** — Already functionally equivalent to ResearcherSkill's `parking-lot.md` (loop_protocol.md lines 175-200). This overlap was missed in the initial research.

---

## 9. Design Patterns Worth Adopting

| Pattern | Source | Our Equivalent | Gap |
|---------|--------|---------------|-----|
| Branchable experiment DAG | ResearcherSkill | Reference-only segments | No live branching |
| .lab/ state container | ResearcherSkill | scratch/ | Less role-specific structure |
| Phase 0 resume choice | ResearcherSkill | Auto-resume classification | No human checkpoint |
| Pattern convergence signals | ResearcherSkill | Composite vote only | No heuristic detectors |
| Hypothesis strategy library | ResearcherSkill | 3 recovery strategies | Limited strategy vocabulary |
| Thought experiments | ResearcherSkill | None | No analytical-only mode |
| Qualitative rubric | ResearcherSkill | None | No quality rating system |
| Periodic revalidation | ResearcherSkill | None | No scheduled audit |
| Harness generation | autoresearch | Config/strategy init | No preflight pack |
| Noise calibration | autoresearch | Post-hoc MAD | No pre-loop calibration |
| Guard metrics | autoresearch | Question coverage only | No quality protection |
| Dashboard | autoresearch | State summary injection | No persistent human view |
| Dead-end-as-output | autoresearch | "What Failed" section | Not a primary artifact |
| Discovery skill | autoresearch | None | No researchability scoring |
| Multi-round packaging | autoresearch | Reference-only segments | No round-transition protocol |

---

## 10. Implementation Recommendations (Revised)

> **Guiding principle:** Start with observability (what makes the loop VISIBLE), not mechanism (what adds new DECISION MACHINERY). Visibility improvements are cheap, reversible, and immediately useful. Mechanism changes are expensive, hard to reverse, and may not improve outcomes.

> **Documentation budget:** Keep total reference docs under 1000 lines. Current: ~800 lines across 4 files. Every addition has a cognitive cost for fresh-context agents.

### Phase 1: Quick Wins (P0, all easy/moderate feasibility)
1. **Dashboard** — Add `deep-research-dashboard.md` regenerated each iteration
2. **Negative knowledge** — Make dead-end map and ruled-out directions required synthesis artifacts
3. **Quality guards** — Binary checks only: >=2 sources per answered question, focus alignment, no single-weak-source answers

### Phase 2: Enrichments (P1, prioritized by effort-to-value)
4. **Per-iteration budget** — Add `maxToolCallsPerIteration` to config
5. **Novelty justification** — Add 1-sentence justification alongside newInfoRatio
6. **Track labels** — Optional `focusTrack` label on iteration records
7. **Charter/preflight** — Add "Non-goals" and "Stop conditions" to strategy template
8. **Source hygiene** — Track tentative vs confirmed findings
9. **Iteration statuses** — Add `insight` and `thought` to status enum

### Phase 3: Deferred (evaluate after Phase 1-2)
10. Full segment/branch activation — only if Phase 2 track labels prove insufficient
11. Hypothesis strategy library expansion
12. Source freshness awareness for rapid loops

---

## 11. Open Questions for Implementation

1. Should segments be lightweight pivots inside one JSONL, or should each branch/round get its own state file bundle?
2. Should quality guards be scored only by the agent, or should the orchestrator validate minimum evidence requirements before allowing convergence?
3. Should the preflight charter be mandatory only in `:confirm` mode, or also enforced in `:auto` mode for high-stakes topics?
4. Should branching be implemented as `researchTracks` in JSONL, or by promoting wave/segment concepts?
5. Should qualitative rubrics score iteration quality, final recommendation quality, or both?
6. Should `.lab`-like artifacts live directly under `scratch/`, or in a nested `scratch/lab/` boundary?
7. Should `newInfoRatio` itself get a calibration phase or confirmation when borderline?
8. Should branch/focus repetition heuristics become extra advisory signals alongside the weighted vote?
9. Should we add an "architectural ceiling" stop reason distinct from ordinary convergence?
10. Is `deep-research-discover` a separate command, or should discovery be folded into initialization as a scored preflight step?

---

## 12. Risk Assessment (Revised)

| Risk | Mitigation |
|------|-----------|
| **Domain mismatch** — importing code-optimization patterns into knowledge research | Every proposal must specify its knowledge-research adaptation; binary checks over rubric scores |
| **Complexity creep** — too many features for agents to follow in fresh context | Documentation budget: stay under 1000 lines total; limit P0 to 3 items |
| **LEAF architecture constraints** — proposals requiring user interaction | Assign each feature explicitly to orchestrator-level or agent-level; LEAF agents cannot interact |
| **Quality guards becoming subjective theater** | Start with binary checks (source count, primary source present), not rubric scores |
| **Dashboard maintenance overhead** | Auto-generate from JSONL only; no manual editing |
| **Subjectivity displacement** — structured novelty just distributes subjectivity | Use justification field (auditable) instead of categorical ledger (still subjective) |
| **Fresh-context knowledge loss** — agents lose conceptual connections each iteration | Strategy file must carry all continuity; consider richer "What connects to what" section |

---

## 13. Critical Review Summary (Opus Ultra-Think)

An independent critical review was conducted after the initial 5-agent wave. Key corrections:

### Corrections Applied
1. **Domain mismatch acknowledged** — Both source repos do code optimization with numerical metrics; our skill does knowledge research with subjective assessment. Every proposal now includes a domain-adaptation note.
2. **Live segments demoted P0→P1** — Conflates code branching (git-backed) with research direction changes (focus-based). Our "Next Focus" already handles pivots.
3. **Structured novelty demoted P0→P1** — Replaces 1 subjective field with 5 subjective fields. Justification field provides auditability without false precision.
4. **Negative knowledge promoted P1→P0** — Template change with near-zero cost and immediate synthesis value.
5. **"Strongest" claims nuanced** — Fresh context loses accumulated connections; typed state is machine-superior but human-inferior to .lab/; recovery tiers miss quality recovery.
6. **LEAF constraint flagged** — "Bounded consultation" proposals ignored that @deep-research is LEAF-only and cannot interact with users. All user-facing features must happen at orchestrator level.

### Missed Insights Added
- Per-iteration time/tool budget (from ResearcherSkill's wall-clock budget)
- `insight` and `thought` iteration statuses (from ResearcherSkill's 5-status model)
- "Verify influence first" before committing iterations (from autoresearch lessons)
- Existing `research-ideas.md` already equivalent to ResearcherSkill's `parking-lot.md`
- WebFetch 15-minute cache creates stale-source risk for rapid loops
- Our default 10 iterations may be too low for complex topics (autoresearch defaults to 30)

### Strategic Guidance
1. **Respect the domain boundary** — every proposal must answer "how does this work with agent-judged metrics?"
2. **Start with observability, not mechanism** — dashboard and dead-end tracking before branch infrastructure
3. **Keep the skill simple** — documentation budget under 1000 lines total
4. **Address LEAF constraint explicitly** — user interaction at orchestrator level only

---

## 14. Wave 2 Delta Analysis

Wave 2 analyzed 5 additional repos that bring fundamentally different approaches than the 2 repos in Wave 1. Here's what's new.

### New Architectural Patterns (not in Wave 1)

**1. Planner-Owned Shard Decomposition** (gpt-researcher)
The research task is split into sections by a planner agent; each section gets an independent researcher + reviewer; results merge at the end. This is a cleaner parallel model than persistent branches — workers don't share mutable state during execution.
- **Implication:** If we add parallel fan-out, use immutable shard briefs + merge-at-end, not shared strategy.md mutation.

**2. Typed Stage Pipeline with Rollback** (AutoResearchClaw)
23 named stages with artifact boundaries between evidence collection, planning, execution, analysis, critique, and publication. Failed stages roll back to specific repair points, not to "start over."
- **Implication:** Add lightweight stage boundaries around our fragile transitions (evidence → interpretation → synthesis) without copying the full 23-stage model.

**3. Diagnosis-Led Self-Repair** (AutoResearchClaw)
When experiments fail, a diagnosis system classifies the failure mode (missing deps, OOM, code crash, etc.), builds targeted repair prompts, runs bounded repair cycles, and promotes the best recovered state forward.
- **Implication:** Our stuck recovery could classify WHY an iteration failed (shallow sources, contradictory evidence, topic too broad) and build targeted recovery prompts instead of generic "try a different approach."

**4. Multi-Perspective Debate Before Synthesis** (AutoResearchClaw)
Critical reasoning stages save role-specific analyses (multiple perspectives) as separate files before synthesizing into one. Disagreement surfaces are preserved, not collapsed.
- **Implication:** For high-stakes research, save dissenting interpretations before final synthesis.

**5. Citation Verification Pipeline** (AutoResearchClaw)
Real API-backed verification: DOI/CrossRef lookup, OpenAlex title search, arXiv search. Citations classified as VERIFIED/SUSPICIOUS/HALLUCINATED. Bad citations pruned from final output.
- **Implication:** Upgrades our P1-5 source-hygiene proposal from policy to mechanism.

**6. Cross-Run Memory with Decay** (AutoResearchClaw)
Separate from per-run JSONL: a persistent memory layer with categories, embeddings, similarity retrieval, time decay, and confidence updates. Plus a self-evolution lesson store.
- **Implication:** Keep per-run state separate from long-horizon memory. We already have Spec Kit Memory for this; the lesson is to use it more actively during research.

**7. Coordinator + Leaf Modular Architecture** (AI-Research-SKILLs)
One thin coordinator skill handles loop control and routing. Specialized leaf skills handle ideation, execution, synthesis, writing. Shallow coupling via shared contracts, not shared files.
- **Implication:** sk-deep-research should evolve toward a small skill family, not a growing monolith.

**8. Protocol-First Portability** (ARIS)
Workflow encoded as host-neutral Markdown protocol. Runtime differences live in thin overlay docs. Reviewer contract standardized across models. Compact recovery artifacts for weaker runtimes.
- **Implication:** Separate our workflow protocol from runtime path resolution. Ship runtime adapters as overlays, not embedded tables.

### What Wave 2 Validates from Wave 1

- **Fresh-context iteration is the right core** — ralph proves the essential loop is tiny and our fresh-context model is sound
- **Dashboard/observability is high-value** — ARIS independently confirms compact recovery surfaces are critical for portability
- **Negative knowledge matters** — AI-Research-SKILLs treats hypothesis refutation as a primary loop artifact, confirming our P0-2
- **Optional complexity should stay optional** — ralph challenges waves/segments/checkpoints as default features; keep them reference-only

### What Wave 2 Challenges from Wave 1

- **Structured novelty accounting may be even less needed** — AutoResearchClaw's quality comes from typed stages and review loops, not from categorizing findings; ralph's quality comes from tight work-unit bounding
- **Modularization > feature addition** — AI-Research-SKILLs suggests the next big step is splitting into a skill family, not adding more features to the monolith
- **Better work-unit definition > better convergence math** — ralph shows that tighter question scoping can substitute for elaborate convergence algorithms

### New Recommendations from Wave 2

| Priority | Improvement | Source |
|----------|-----------|--------|
| **P1** | Diagnosis-led recovery prompts (classify failure mode, build targeted fix) | AutoResearchClaw |
| **P1** | Coordinator + leaf skill split (separate orchestration from research execution) | AI-Research-SKILLs |
| **P2** | Protocol-first portability (workflow as Markdown contract, runtime as overlay) | ARIS |
| **P2** | Shard-local review before synthesis (reviewer pass per iteration/track) | gpt-researcher |
| **P2** | Multi-perspective debate for critical stages | AutoResearchClaw |
| **P2** | Compact recovery artifacts alongside full JSONL | ARIS |
| **Defer** | Full citation verification pipeline | AutoResearchClaw (overkill for most research) |
| **Defer** | Cross-run memory/evolution layer | AutoResearchClaw (we have Spec Kit Memory) |

---

## 15. Convergence Report (Updated)

```
CONVERGENCE REPORT
------------------
Stop reason: all_questions_answered (Wave 1 + Wave 2)
Total iterations: 10 (2 waves of 5 parallel agents each)
Questions answered: 10 / 10 (100%)

Wave 1 Results (2 repos: ResearcherSkill, autoresearch):
  Iteration 001 - ResearcherSkill Architecture (ratio: 0.88)
  Iteration 002 - autoresearch Architecture (ratio: 0.82)
  Iteration 003 - Convergence Comparison (ratio: 0.78)
  Iteration 004 - State Management Comparison (ratio: 0.86)
  Iteration 005 - Actionable Improvements (ratio: 0.82)
  Wave 1 avg: 0.83 | median: 0.82

Wave 2 Results (5 repos: gpt-researcher, AutoResearchClaw, AI-Research-SKILLs, ralph, ARIS):
  Iteration 006 - gpt-researcher Multi-Agent (ratio: 0.77)
  Iteration 007 - AutoResearchClaw Pipeline (ratio: 0.84)
  Iteration 008 - AI-Research-SKILLs Modular (ratio: 0.86)
  Iteration 009 - ralph Minimal Loop (ratio: 0.77)
  Iteration 010 - ARIS Portability (ratio: 0.81)
  Wave 2 avg: 0.81 | median: 0.81

Overall avg: 0.82 | Total findings: 66 across 10 iterations
Repos analyzed: 7 total
Delegation: 10 GPT-5.4 agents via codex exec (reasoning: high)
Total research time: ~25 minutes wall clock (including retries for Gate 3 blocks)
```

---

## 15. Sources

### Primary Sources (analyzed repos)
- [krzysztofdudek/ResearcherSkill](https://github.com/krzysztofdudek/ResearcherSkill) — researcher.md, GUIDE.md, README.md, CHANGELOG.md
- [pjhoberman/autoresearch](https://github.com/pjhoberman/autoresearch) — SKILL.md, templates/*, references/lessons.md, autoresearch-discover/SKILL.md, README.md

### Internal Sources (our skill)
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`
- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`

---

## 16. Next Steps

| Condition | Suggested Command |
|-----------|-------------------|
| Ready to plan implementation | `/spec_kit:plan sk-deep-research v1.1 upgrade` |
| Need deeper dive on specific proposal | `/spec_kit:deep-research [specific-proposal-topic]` |
| Want to save this context | `/memory:save` (auto-saved below) |
| Ready to implement Phase 1 | Create spec folder for dashboard + resume decision |
