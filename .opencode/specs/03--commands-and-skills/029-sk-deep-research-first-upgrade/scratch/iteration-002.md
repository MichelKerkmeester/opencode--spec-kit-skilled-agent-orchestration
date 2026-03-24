# Iteration 002 — pjhoberman/autoresearch Architecture & Innovation

## Focus
Q2: Patterns from pjhoberman/autoresearch that could improve sk-deep-research

## Findings

### 1. Harness generation is the biggest transferable idea, not the loop itself
`autoresearch` does not just define a loop; it generates a full execution harness before launch: `instructions.md`, an eval script, test data, and a short launch prompt. The README frames this as the main workflow, and the skill turns it into an explicit setup phase before any overnight run. The current `sk-deep-research` skill already has a strong loop engine and state model, but it mostly initializes `config`, `strategy`, and `state.jsonl`; it does not yet generate a richer "research harness" artifact set for each run. The most promising import is to add a generated preflight pack for deep research, for example: a round brief, a source-quality scorecard, a dispatch prompt, and a human review sheet before autonomous execution starts. This would make run quality depend less on ad hoc prompt composition and more on a reproducible setup contract.
[SOURCE: /tmp/deep-research-029/autoresearch/README.md:17-22]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:60-138]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:1-126]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/eval_template.py:1-256]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/launch_prompt.md:5-18]
[SOURCE: .opencode/skill/sk-deep-research/SKILL.md:175-199]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:47-60]

### 2. The "one file, one metric, one loop" pattern should be adapted into a bounded research-segment contract
The core `autoresearch` constraint is short and memorable: "one file, one metric, one loop." In practice, that means a single editable file, a single measurable outcome, and a tightly bounded search space. `sk-deep-research` already has "one focus per iteration," but that is weaker than `autoresearch`'s overall run-level constraint. A useful upgrade would be to define one bounded research segment per round: one question cluster, one success scorecard, and one allowed evidence surface. That would reduce broad drift across long runs and make each segment easier to evaluate afterward. In other words, import the constraint discipline, not the literal single-file rule.
[SOURCE: /tmp/deep-research-029/autoresearch/README.md:5]
[SOURCE: /tmp/deep-research-029/autoresearch/README.md:137-149]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:23-39]
[SOURCE: .opencode/skill/sk-deep-research/SKILL.md:220-228]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:125-149]

### 3. sk-deep-research already has JSONL state, but it lacks autoresearch's dashboard layer
This is the clearest "partially present, worth hardening" area. `sk-deep-research` already treats JSONL plus strategy files as core state, and it even auto-generates a compact state summary for dispatch. `autoresearch` goes one step further by standardizing a config header, append-only result records, and a regenerated dashboard that shows baseline, current best, counts by status, and guard state. That dashboard is not just UI polish; it gives humans and agents a second, compact recovery surface after compaction. A direct improvement would be a `deep-research-dashboard.md` regenerated each iteration from JSONL, showing iteration count, answered/open question counts, last ratios, active recovery mode, source diversity, and dead-end counts.
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:167-215]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:63-70]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/launch_prompt.md:12-18]
[SOURCE: .opencode/skill/sk-deep-research/SKILL.md:169-210]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:110-140]

### 4. Noise handling in autoresearch is much more operational than our current convergence model
`autoresearch` treats noise as a first-class setup problem: run the baseline three times, measure variance, set a `min_delta`, and in noisy environments confirm every apparent improvement with a second run. The lessons file shows why this matters: prompt experiments produced false signal because of stale cache behavior, and temperature `> 0` created a score range large enough to swamp expected gains. By contrast, `sk-deep-research` currently emphasizes convergence via `newInfoRatio`, stuck count, and answered questions, but it does not define a preflight for measuring scoring noise before the loop starts. For `sk-deep-research`, the analog would be calibration runs for research scoring: repeat an initial scoring pass, measure rubric variance, detect unstable retrieval/source churn, and only trust gains above a configured noise floor.
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:124-138]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:216-243]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:35-41]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:49-57]
[SOURCE: .opencode/skill/sk-deep-research/SKILL.md:205-210]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:83-89]

### 5. Guard metrics are a strong missing concept for deep research loops
`autoresearch` distinguishes between a primary optimization target and "guard metrics" that may not regress; it even defines a separate `guard_fail` status when the main score improves for the wrong reason. That is a powerful fit for deep research because `newInfoRatio` alone can reward novelty while quietly harming rigor. A deep-research version could keep `newInfoRatio` or question-coverage as the primary metric while guarding on citation completeness, source-quality floor, source diversity, or "answered questions that remain evidence-backed." This would turn "interesting but weakly sourced" iterations into explicit guard failures instead of apparent wins.
[SOURCE: /tmp/deep-research-029/autoresearch/README.md:145-149]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:54-58]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:173-186]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:41-56]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/eval_template.py:199-229]
[SOURCE: .opencode/skill/sk-deep-research/SKILL.md:207-210]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:143-149]

### 6. Multi-round experiment design is far more explicit in autoresearch than in sk-deep-research
`autoresearch` treats Round 2 as a different design problem, not just "more iterations." It explicitly says to read the prior log, use the "what didn't work" and "recommended next steps" sections to define the next round, preserve the same test data across rounds, and create new instructions, eval, JSONL, and dashboard files per round. The lessons file adds an important warning: sequential rounds can hit a co-optimization ceiling because Round 1 can overfit to the frozen state of other components. `sk-deep-research` has segment and wave ideas, but they are still mostly reference-only. A strong improvement would be to add a live round-transition protocol: carry forward the same key questions where comparability matters, require an explicit round hypothesis, and run a component-influence check before dedicating a new round to a subcomponent.
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md:140-165]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:3]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:29-41]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:69-75]
[SOURCE: .opencode/skill/sk-deep-research/SKILL.md:240-246]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:231-296]

### 7. The discover skill suggests a missing preflight mode for deep research candidate selection
`autoresearch-discover` is not just a convenience command; it formalizes how to find good optimization targets before launching an expensive unattended loop. It ranks candidates by tunability, metric clarity, eval feasibility, and likely impact. `sk-deep-research` currently initializes 3-5 key questions, but it does not have a discovery-oriented preflight that scores which question clusters or source domains are most researchable before the loop begins. A sibling mode like `deep-research-discover` could scan a topic or codebase for high-yield question clusters, available evidence surfaces, likely dead ends, and evaluation feasibility, then recommend the best starting focus for the main loop.
[SOURCE: /tmp/deep-research-029/autoresearch/README.md:11-13]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch-discover/SKILL.md:9-10]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch-discover/SKILL.md:73-123]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:50-55]

### 8. The deepest philosophy shift is that dead ends are first-class output
The most important production lesson is philosophical but operationally useful: "93% of experiments fail," and that failure log is still the product. The lessons file makes this concrete with 41 reverted changes that still mapped the architecture's non-responsive areas. `sk-deep-research` already tracks "What Failed" in the strategy file, but it does not elevate eliminated paths to the same level as positive findings in its end-state reporting. A worthwhile import is to make "dead-end map" a mandatory synthesis artifact and maybe even a convergence input: when the space of credible alternatives is mostly exhausted, that itself is evidence that the loop has done its job.
[SOURCE: /tmp/deep-research-029/autoresearch/README.md:3]
[SOURCE: /tmp/deep-research-029/autoresearch/README.md:141-143]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:20-27]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md:61-67]
[SOURCE: /tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md:120-124]
[SOURCE: .opencode/skill/sk-deep-research/SKILL.md:208-210]
[SOURCE: .opencode/skill/sk-deep-research/references/loop_protocol.md:202-208]

## Sources Consulted
- `/tmp/deep-research-029/autoresearch/README.md`: overall architecture, design principles, plugin workflow, and explicit statements on failure rate, guard metrics, compaction resilience, and noise awareness.
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/SKILL.md`: main process definition, harness generation, validation preflight, JSONL/dashboard schema, noise handling, guard metrics, and multi-round protocol.
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/instructions_template.md`: concrete operating contract for constrained edits, guard thresholds, min-delta, iteration logging, and end-of-round reporting.
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/eval_template.py`: eval architecture, caching structure, metric functions, `SCORE`/`GUARD` outputs, and machine-parseable scoring contract.
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/templates/launch_prompt.md`: baseline-stability launch flow, config-header initialization, and compaction recovery instructions.
- `/tmp/deep-research-029/autoresearch/skills/autoresearch/references/lessons.md`: production lessons from two rounds, including cache invalidation traps, co-optimization ceilings, temperature noise, and the value of dead-end elimination.
- `/tmp/deep-research-029/autoresearch/skills/autoresearch-discover/SKILL.md`: discovery workflow for ranking candidate targets by tunability, metric quality, and eval feasibility.
- `.opencode/skill/sk-deep-research/SKILL.md`: current deep-research architecture, state model, convergence model, and already-present concepts that overlap with autoresearch.
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`: live loop lifecycle, state summary injection, pause/resume, ideas backlog, recovery behavior, and reference-only segment/wave designs.

## Assessment
- newInfoRatio: 0.82
- findingsCount: 8
- status: complete
- keyInsights:
  - Harness generation is the most actionable import because it standardizes setup quality before autonomy begins.
  - sk-deep-research already has JSONL and fresh-context ideas, but it lacks autoresearch's dashboard, guard metrics, and noise-calibration discipline.
  - The lessons file argues for explicit round transitions and dead-end reporting, not just more iterations.

## Questions Answered
- Which `autoresearch` patterns are genuinely additive to `sk-deep-research`, versus already partially present.
- How `autoresearch` uses JSONL, dashboards, and launch-time setup to survive compaction and support unattended runs.
- How production lessons on noise, cache invalidation, guard metrics, and multi-round design could translate into deep-research workflow upgrades.

## New Questions Raised
- Should `sk-deep-research` define a formal research scorecard with primary and guard metrics, or keep evaluation mostly qualitative?
- Should round transitions become a live workflow feature now, or wait until segment support moves out of reference-only status?
- Is a `deep-research-discover` command the right abstraction, or should discovery be folded into initialization as a scored preflight step?
