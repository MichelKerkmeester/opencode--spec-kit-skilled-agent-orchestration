# Iteration 005 — Actionable Improvement Opportunities

## Focus
Q5: Highest-impact improvements for sk-deep-research

## Improvement Proposals

### Proposal 1: Activate Live Segment and Branch Support
- **Source**: ResearcherSkill + autoresearch
- **Description**: Turn our reference-only segment model into a live feature so major pivots, alternate angles, and follow-on rounds are tracked explicitly instead of being flattened into one linear loop. This is the closest match to ResearcherSkill's branch tree and autoresearch's round-based progression.
- **Impact**: high - It would make multi-angle investigations much more effective, preserve dead-end history cleanly, and let convergence operate on the current line of inquiry instead of the whole session.
- **Feasibility**: moderate - The schema and event vocabulary already exist in our docs, so this is mostly implementation and prompt wiring rather than invention.
- **Compatibility**: fits - `segment`, `segment_start`, and cross-segment synthesis are already modeled in our JSONL/state docs as reference-only features.
- **Implementation sketch**: Promote `segment_start` and `currentSegment` into the live workflow, add parent/pivot metadata to JSONL events, compute convergence on the active segment, and synthesize across all segments at the end.
- **Priority**: P0

### Proposal 2: Add Research-Quality Guards to Convergence
- **Source**: ResearcherSkill + autoresearch
- **Description**: Pair our novelty-based stop logic with a quality floor so the loop cannot converge just because question coverage is high or `newInfoRatio` is low. The guard should score evidence strength, source diversity, contradiction resolution, and actionability.
- **Impact**: high - This directly addresses premature convergence, which is the biggest failure mode for iterative research loops that can answer questions shallowly.
- **Feasibility**: moderate - We only need a lightweight rubric and a few extra fields in state.
- **Compatibility**: fits - It extends our current convergence model rather than replacing it, and it aligns with ResearcherSkill's qualitative rubric idea plus autoresearch's guard-metric discipline.
- **Implementation sketch**: Add a `qualityAssessment` object to each iteration record, define a 4-part rubric, and block STOP decisions unless novelty signals and quality guards both pass.
- **Priority**: P0

### Proposal 3: Replace Subjective `newInfoRatio` With Structured Novelty Accounting
- **Source**: autoresearch + ResearcherSkill
- **Description**: Require each iteration to classify findings as `new`, `refinement`, `confirmation`, `duplicate`, or `contradiction`, with linked source IDs. Then compute `newInfoRatio` from the ledger instead of relying on a single free-form self-rating.
- **Impact**: high - This would make convergence more trustworthy, improve resume fidelity, and give us a much stronger audit trail for why the loop stopped.
- **Feasibility**: moderate - It needs an iteration template update and a parser, but it fits our existing append-only JSONL model well.
- **Compatibility**: fits - It builds on our current iteration files, citation rule, and JSONL state rather than changing the architecture.
- **Implementation sketch**: Add a structured assessment block to `iteration-NNN.md`, parse counts into JSONL, and derive `newInfoRatio` from weighted novelty categories.
- **Priority**: P0

### Proposal 4: Add a Persistent Dashboard and Resume Decision Summary
- **Source**: autoresearch + ResearcherSkill
- **Description**: Generate a human-readable dashboard after each iteration and use it on resume to present the current state, active line of inquiry, best findings, dead ends, and next focus. When prior state exists, offer `resume`, `restart`, or `fork` instead of silently assuming one path.
- **Impact**: high - This improves context resilience, makes long-running sessions observable, and reduces resume mistakes.
- **Feasibility**: easy - The dashboard is derived from data we already store or plan to store.
- **Compatibility**: fits - It layers on top of JSONL plus strategy with no architectural disruption.
- **Implementation sketch**: Add `research/deep-research-dashboard.md`, regenerate it after each iteration, and wire init to summarize state and choose resume behavior when artifacts already exist.
- **Priority**: P0

### Proposal 5: Introduce a Research Charter and Preflight Review Gate
- **Source**: ResearcherSkill + autoresearch
- **Description**: Add a short initialization charter that records objective, desired deliverable, source boundaries, stop conditions, non-goals, and initial key questions. In `:confirm` mode this should be reviewed before iteration 1; in `:auto` mode it can be drafted and accepted automatically unless the user interrupts.
- **Impact**: medium - It will reduce wasted loops caused by fuzzy problem framing and make the first strategy draft much more aligned.
- **Feasibility**: easy - This is mostly prompt and template work.
- **Compatibility**: fits - It extends config and strategy initialization cleanly.
- **Implementation sketch**: Add a `researchCharter` section to config/init templates, draft key questions from it, and insert a preflight review checkpoint before the loop starts in confirm mode.
- **Priority**: P1

### Proposal 6: Make Negative Knowledge a First-Class Output
- **Source**: autoresearch lessons + ResearcherSkill
- **Description**: Elevate "what did not work" and "what can be ruled out" into required structured outputs, both per iteration and in final synthesis. This should be treated as a primary product of the loop, not just a side note in `What Failed`.
- **Impact**: medium - It improves future reuse, makes stuck recovery smarter, and increases the value of partially converged research sessions.
- **Feasibility**: easy - We already have the right conceptual sections; this mainly needs stronger requirements and synthesis rules.
- **Compatibility**: fits - It reinforces our strategy file and final synthesis without changing the loop model.
- **Implementation sketch**: Add `Ruled Out`, `Dead Ends`, and `Confidence` fields to iteration output and require a dedicated "Do not retry / low-value directions" section in `research/research.md`.
- **Priority**: P1

### Proposal 7: Add Source-Hygiene Confirmation for Fragile Findings
- **Source**: autoresearch
- **Description**: Treat findings from a single weak source, stale artifact, or potentially cached page as tentative until they are confirmed by an independent source or a later iteration. This is the research analogue of autoresearch's confirmation runs and cache/noise checks.
- **Impact**: medium - It would reduce false confidence and improve answer quality on noisy, stale, or contradictory topics.
- **Feasibility**: moderate - It needs extra state fields and a small confirmation protocol.
- **Compatibility**: fits - It complements our citation rule and quality guards.
- **Implementation sketch**: Track `tentativeFindings` and `confirmedFindings` in strategy/state, and only count confirmed findings toward answered-question coverage unless the source is clearly authoritative.
- **Priority**: P1

## Priority Matrix
| # | Improvement | Impact | Feasibility | Priority |
|---|------------|--------|-------------|----------|
| 1 | Activate live segment and branch support | high | moderate | P0 |
| 2 | Add research-quality guards to convergence | high | moderate | P0 |
| 3 | Replace subjective `newInfoRatio` with structured novelty accounting | high | moderate | P0 |
| 4 | Add a persistent dashboard and resume decision summary | high | easy | P0 |
| 5 | Introduce a research charter and preflight review gate | medium | easy | P1 |
| 6 | Make negative knowledge a first-class output | medium | easy | P1 |
| 7 | Add source-hygiene confirmation for fragile findings | medium | moderate | P1 |

## Sources Consulted
- `/tmp/deep-research-029/ResearcherSkill/researcher.md`
- `/tmp/deep-research-029/ResearcherSkill/GUIDE.md`
- `/tmp/deep-research-029/ResearcherSkill/README.md`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md`
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md`
- `/tmp/deep-research-029/autoresearch/README.md`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`
- `.opencode/skill/sk-deep-research/references/quick_reference.md`

## Assessment
- newInfoRatio: 0.82
- findingsCount: 7
- status: complete
- keyInsights: segment support is the most leveraged architectural upgrade because it is already designed but not live; convergence needs quality guards, not just novelty signals; a dashboard plus structured novelty accounting would make the loop far more observable and auditable

## Questions Answered
- Q5: The most practical high-impact upgrades are live segment branching, convergence quality guards, structured novelty accounting, and a persistent dashboard/resume workflow. These fit our current architecture and do not require replacing the fresh-context loop.

## New Questions Raised
- Should segments be lightweight pivots inside one JSONL, or should each branch/round get its own state file bundle?
- Should quality guards be scored only by the agent, or should the orchestrator validate minimum evidence requirements before allowing convergence?
- Do we want the preflight charter to be mandatory only in `:confirm` mode, or also enforced in `:auto` mode for high-stakes research topics?
