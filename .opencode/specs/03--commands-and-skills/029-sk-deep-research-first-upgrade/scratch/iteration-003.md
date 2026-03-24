# Iteration 003 — Convergence & Stopping Mechanisms Comparison

## Focus
Q3: Convergence/stopping mechanisms comparison across three systems

## Findings

### 1. ResearcherSkill is heuristic and pattern-led; our loop is an explicit scored state machine
ResearcherSkill checks a table of convergence signals after each experiment, including `5+ discards`, `<0.5% over 5 keeps`, repeated work in the same area, alternating keep/discard, timeouts, theory contradiction, and branch stagnation. Its own guide says these are "not hard rules" and the agent may ignore them if it still has a strong hypothesis. That makes convergence judgment flexible, but also agent-dependent and harder to audit. Our `sk-deep-research` instead codifies stop decisions in `shouldContinue()`: hard stops first, then stuck detection, then a 3-signal weighted vote across rolling average, MAD noise floor, and question-coverage entropy, stopping when the weighted score exceeds `0.60`. The tradeoff is clear: ResearcherSkill is richer in pattern recognition, while our system is more deterministic and inspectable.
[SOURCE: /tmp/deep-research-029/ResearcherSkill/researcher.md:190-202; /tmp/deep-research-029/ResearcherSkill/GUIDE.md:192-210; .opencode/skill/sk-deep-research/references/convergence.md:21-120]

### 2. Autoresearch is much more noise-aware than either ResearcherSkill or our current loop
Autoresearch treats convergence as a measurement problem before it becomes a stopping problem. It requires three baseline runs, rejects noisy evals when the spread is too large, sets `min-delta` to roughly `2-3x` observed variance, uses the median baseline, and can require a confirmation run before accepting any improvement in high-noise settings. It also supports explicit guard metrics and `guard_fail` states when the primary score rises but a protected secondary metric regresses. Our loop does include a MAD-based noise-floor vote, but that acts on the agent-scored `newInfoRatio` after iterations happen; it does not calibrate the rating process up front, define a minimum meaningful gain, or re-run borderline "wins" for confirmation. ResearcherSkill is even looser: it uses a `0.1%` keep threshold and a few timeout/crash heuristics, but no baseline variance calibration or confirmation protocol.
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:124-138; /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:216-243; /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:41-70; /tmp/deep-research-029/ResearcherSkill/researcher.md:97-110; .opencode/skill/sk-deep-research/references/convergence.md:50-101; .opencode/skill/sk-deep-research/references/convergence.md:391-425]

### 3. Stuck handling differs sharply: ResearcherSkill improvises, autoresearch constrains, our loop escalates through explicit recovery tiers
ResearcherSkill responds to being stuck through open-ended strategy shifts: inversion, analogy, scaling, decomposition, branch switching, branch combination, and general "think out of the box" behavior. It also treats repeated crashes and timeouts as signs to rethink or scale down, and only consults the user after exhausting strategies, branches, and parking-lot ideas. Autoresearch is less autonomous in-loop: its template forbids spending more than three consecutive iterations on a non-moving approach, and its main escape hatch is to stop, declare plateau/architectural ceiling, or start a new round with changed constraints. Our loop is the most procedural: after `3` consecutive low-progress iterations it enters `STUCK_RECOVERY`, selects among "try opposites", "combine prior findings", or "audit low-value iterations", and then escalates further through tool retry, focus pivot, state reconstruction, direct mode, and finally user escalation if failures persist.
[SOURCE: /tmp/deep-research-029/ResearcherSkill/researcher.md:105-109; /tmp/deep-research-029/ResearcherSkill/researcher.md:124-146; /tmp/deep-research-029/ResearcherSkill/researcher.md:173-210; /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:107-126; /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:140-153; .opencode/skill/sk-deep-research/references/convergence.md:250-385; .opencode/skill/sk-deep-research/references/loop_protocol.md:170-208]

### 4. Autoresearch has the strongest notion of quality protection and "architectural ceiling"
Autoresearch separates primary optimization from quality protection using guard metrics, fixed test data, cache validation, and explicit lessons about metric gaming, co-optimization traps, and stale caches producing false gains. Its lessons file also adds an important stopping heuristic: most gains arrived in iterations `10-20`, while a `5+` iteration plateau indicated that the remaining limit was architectural rather than parametric. ResearcherSkill has a lighter version of quality control via `KEEP*` when the primary metric improves but secondaries regress, plus re-validation every 10 experiments, but it does not formalize guard thresholds. Our loop currently protects topical completeness through question coverage and adds statistical validation on `newInfoRatio`, but it has no equivalent notion of "architectural ceiling", no explicit guardrail metric for synthesis quality regression, and no scheduled revalidation pass.
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:155-165; /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:29-41; /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:47-75; /tmp/deep-research-029/ResearcherSkill/researcher.md:101-103; /tmp/deep-research-029/ResearcherSkill/researcher.md:144-155; .opencode/skill/sk-deep-research/references/convergence.md:84-101; .opencode/skill/sk-deep-research/references/convergence.md:427-430]

### 5. The main gaps in our current design are pattern memory and calibration, not basic stopping coverage
Our loop already covers the essentials ResearcherSkill and autoresearch both need: hard stops, a diminishing-returns signal, stuck recovery, resumable state, and a formal synthesis exit. The biggest gaps are elsewhere. Compared with ResearcherSkill, we do not yet watch for structural patterns like repeated focus on the same area, alternating success/failure, branch-level thriving vs stagnation, or repeated contradiction between theory and outcomes. Compared with autoresearch, we do not calibrate the signal before the loop, define a minimum meaningful improvement, run confirmation passes in noisy cases, or encode architectural-ceiling heuristics. A stronger next version would likely keep our composite vote, but add a second layer of pattern heuristics and pre-loop calibration checks rather than replacing the current model.
[SOURCE: /tmp/deep-research-029/ResearcherSkill/researcher.md:190-202; /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:128-138; /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:220-243; /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:61-75; .opencode/skill/sk-deep-research/references/convergence.md:25-120; .opencode/skill/sk-deep-research/references/convergence.md:250-425; .opencode/skill/sk-deep-research/references/loop_protocol.md:83-208]

## Comparison Table
| Aspect | Our sk-deep-research | ResearcherSkill | pjhoberman/autoresearch |
|--------|---------------------|-----------------|------------------------|
| Core stop model | Explicit `shouldContinue()` state machine with hard stops, stuck detection, then weighted composite vote | Pattern table checked after each experiment; agent decides whether to pivot or ignore | No single stop algorithm; stop logic is built into eval calibration, plateau heuristics, and round/human review |
| Main convergence signals | Rolling avg of last 3 `newInfoRatio`, MAD noise floor, question coverage entropy | `5+` discards, `<0.5%` plateau over 5 keeps, same area `3+` times, alternating keep/discard, timeouts, contradiction, branch stagnation | Baseline stability, min-delta, confirmation runs, guard metrics, 5+ plateau heuristic, "most gains in 10-20" lesson |
| Statistical rigor | Moderate: MAD-based noise floor and weighted threshold | Low: mostly heuristic patterns plus a keep threshold | High: variance measurement, median baseline, min-delta, confirmation reruns |
| Quality assessment | Question coverage and advisory noise validation on `newInfoRatio` | Primary/secondary metrics with `KEEP*`; revalidate every 10 experiments | Primary metric plus explicit guard metric thresholds and `guard_fail` |
| Stuck recovery | Formal recovery mode plus targeted strategies and five-tier escalation | Freeform strategy shifts, branch switching, parking lot, consult user only at true dead end | Mostly constrain setup to avoid noise; if plateau persists, document ceiling or start a new round |
| Stop conditions | Max iterations, all questions answered, weighted convergence, unrecoverable stuck case | Target hit, experiment cap, user interrupt, or open-ended continuation by default | Plateau for 5+, fixed iteration budget, user review gates, or conclusion that next gains are architectural |
| State/auditability | JSONL + strategy + iteration files; highly inspectable | `.lab/` logs and branches are durable, but convergence decisions are discretionary | JSONL + dashboard + config header; very strong audit trail for numeric optimization |
| Biggest strength | Balanced, auditable orchestration for exploratory research | Rich pattern intuition and branch-aware experimentation | Best noise handling and best protection against false-positive "improvements" |
| Biggest weakness | Lacks pre-loop calibration and richer heuristic pattern detectors | Harder to reproduce because stop decisions depend on agent judgment | Less autonomous exploratory recovery; better for tuning than for open-ended research |

## Sources Consulted
- `/tmp/deep-research-029/ResearcherSkill/researcher.md`
- `/tmp/deep-research-029/ResearcherSkill/GUIDE.md`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`

## Assessment
- newInfoRatio: 0.78
- findingsCount: 5
- status: complete
- keyInsights: keep our weighted composite, add autoresearch-style calibration, add ResearcherSkill-style pattern heuristics

## Questions Answered
- How ResearcherSkill detects convergence versus our composite vote
- How autoresearch handles noise, confirmation, and plateau-based stopping
- What each system does when progress stalls
- Which gaps in our current model are meaningfully addressed by the other two repos

## New Questions Raised
- Should `newInfoRatio` itself get a calibration phase or double-scoring/confirmation when borderline?
- Should branch/focus repetition heuristics become extra advisory signals alongside the current weighted vote?
- Should we add an "architectural ceiling" stop reason distinct from ordinary convergence?
