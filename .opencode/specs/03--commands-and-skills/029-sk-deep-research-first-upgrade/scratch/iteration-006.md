# Iteration 006 — gpt-researcher: Multi-Agent Decomposition

## Focus
Q6: Multi-agent decomposition patterns

## Findings
### 1. Planner-owned section sharding is the main decomposition pattern
GPT Researcher documents a planner/executor/publisher architecture, then implements it as a Chief Editor workflow that runs `browser -> planner -> researcher -> writer -> publisher`. The planner turns initial research into a section list, and the editor dispatches one research subworkflow per section. This is a meaningful delta from Wave 1's mostly single-loop patterns because decomposition happens by report shard, not only by iteration. Inference: `sk-deep-research` could preserve its LEAF agent while letting the orchestrator generate branch briefs and merge branch outputs. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/README.md:54-67] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/orchestrator.py:52-81] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:22-50] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:52-77] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:175-210] [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:47-58]

### 2. Parallel agents coordinate by working on isolated shard inputs, then merging once
The LangGraph editor creates one task input per section with only `task`, `topic`, and `title`, runs those tasks with `asyncio.gather`, and merges only the returned drafts. That is a low-conflict parallelism pattern: workers do not co-edit shared planning state while running. This matters for us because the current skill is explicitly LEAF-only and still treats wave orchestration as reference-only. Inference: if we add parallel fan-out later, the safe model is orchestrator-owned merge files plus immutable shard briefs, not shared `strategy.md` mutation by parallel workers. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:52-77] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:161-168] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:230-246]

### 3. The deep-research traversal is a hybrid: concurrent breadth fan-out, then recursive drill-down
`DeepResearchSkill` generates multiple search queries, runs them under a semaphore, gathers the whole breadth layer, then recurses on each result with reduced breadth (`max(2, breadth // 2)`) and lower depth. That is not a pure breadth-first or depth-first tree; it is a batched fan-out followed by per-branch drilling. This is new versus Wave 1 because it provides a concrete depth/breadth policy rather than only branch labels or round transitions. Inference: `sk-deep-research` could borrow a frontier policy like this without adopting persistent live branch state. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/README.md:213-220] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:223-237] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py:296-345]

### 4. Quality control is embedded as a shard-local review loop before final synthesis
The multi-agent path does not only parallelize research; it wraps each section in a local `researcher -> reviewer -> reviser` loop, and the AG2 version makes the loop bound explicit with `max_revisions`. That is a stronger decomposition pattern than Wave 1's global guard-metric ideas because the review happens at the unit of decomposition before synthesis. Inference: a future `sk-deep-research` upgrade could add an optional reviewer pass over each iteration or track before findings count toward convergence. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/docs/docs/gpt-researcher/multi_agents/langgraph.md:14-48] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py:126-144] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/README.md:46-56] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/agents/orchestrator.py:137-169]

### 5. Report generation is its own pipeline, with source curation and citation rules separated from search
GPT Researcher keeps report writing and publishing as distinct stages: the writer builds introduction/conclusion/table of contents/source list from `research_data`, the publisher renders the assembled layout to output formats, and the prompt stack requires in-text citations, deduplicated references, branch integration, and preference for reliable/recent sources. Upstream of that, source curation can rank scraped material by relevance, credibility, currency, objectivity, and quantitative value before report generation. This is a real delta from Wave 1: not just better looping, but a multi-stage synthesis pipeline that could improve `research.md` quality without changing the LEAF contract. [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/writer.py:32-67] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/publisher.py:16-61] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/researcher.py:193-197] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py:15-20] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py:33-85] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py:273-312] [SOURCE: /tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py:414-483]

## Delta From Wave 1
- New patterns not in Wave 1: planner-owned section sharding; immutable shard briefs plus merge-at-end parallelism; hybrid breadth-fan-out then recursive drill-down traversal; shard-local reviewer/reviser loops; separate writer/publisher/source-curation pipeline.
- Confirms Wave 1 findings: quality protection should sit on top of search rather than only at stop time; final synthesis deserves its own workflow stage; live branch history is not required to get multi-angle coverage. [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:12-19] [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:145-156]
- Contradicts Wave 1 findings: none directly. If anything, gpt-researcher further weakens the case for making persistent live branch state a first upgrade, because most of its decomposition value comes from planner-owned shards and merge stages rather than durable branch ledgers. [SOURCE: .opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md:147-155] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:242-246]

## Sources Consulted
- `/tmp/deep-research-029-wave2/gpt-researcher/README.md`
- `/tmp/deep-research-029-wave2/gpt-researcher/docs/docs/gpt-researcher/multi_agents/langgraph.md`
- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/deep_research.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/curator.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/skills/researcher.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/gpt_researcher/prompts.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/orchestrator.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/editor.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/writer.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents/agents/publisher.py`
- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/README.md`
- `/tmp/deep-research-029-wave2/gpt-researcher/multi_agents_ag2/agents/orchestrator.py`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research.md`

## Assessment
- newInfoRatio: 0.77
- findingsCount: 5
- status: complete
- keyInsights: planner-owned shard orchestration is the cleanest transferable multi-agent pattern; the tree search uses hybrid breadth fan-out plus recursive drill-down rather than pure BFS or DFS; source curation plus a dedicated synthesis pipeline is a bigger delta than persistent branch state.

## Questions Answered
- Q6: gpt-researcher adds a practical multi-agent decomposition model: planner-owned section sharding, parallel shard execution, shard-local review/revision, hybrid tree traversal, and a separate source-curation plus report-publication pipeline.

## New Questions Raised
- If we keep `@deep-research` LEAF-only, should the orchestrator create temporary shard briefs and aggregate shard findings into `research.md` after a merge pass?
- Should review happen per iteration, per focus track, or only as a final synthesis gate?
- Would a frontier queue with bounded parallel shards be simpler than activating full live segments or branch state?
