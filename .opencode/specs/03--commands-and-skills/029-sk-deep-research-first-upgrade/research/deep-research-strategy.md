# Research Strategy

## Topic
How can auto-research approaches from krzysztofdudek/ResearcherSkill and pjhoberman/autoresearch improve our sk-deep-research skill?

## Key Questions (remaining — Wave 2)
[All answered]

## Wave 2 Answered Questions
- [x] Q6: gpt-researcher — planner-owned shard decomposition, hybrid breadth/depth traversal, shard-local review loops, source curation pipeline (iteration-006)
- [x] Q7: AutoResearchClaw — 23-stage typed pipeline with rollback, diagnosis-led self-repair, multi-perspective debate, citation verification, cross-run memory/evolution (iteration-007)
- [x] Q8: AI-Research-SKILLs — coordinator+leaf modular architecture, hypothesis refutation as loop-level concern, strict authoring contract, shallow cross-skill coupling (iteration-008)
- [x] Q9: ralph — validates fresh-context core, challenges optional complexity (waves/segments/checkpoints), better work-unit bounding can substitute for control-plane logic (iteration-009)
- [x] Q10: ARIS — protocol-first Markdown portability, reviewer transport contract, compact recovery artifacts, optional helpers over mandatory framework (iteration-010)

## Answered Questions
- [x] Q1: ResearcherSkill innovations — branching DAG, .lab/ state, pattern-based convergence, hypothesis strategies, qualitative rubrics, thought experiments, periodic revalidation, bounded consultation (iteration-001)
- [x] Q2: autoresearch patterns — harness generation, one-file constraint, JSONL+dashboard, noise handling, guard metrics, multi-round design, discover skill, dead-end-as-output philosophy (iteration-002)
- [x] Q3: Convergence comparison — our composite is rigorous but lacks pattern heuristics (ResearcherSkill) and pre-loop calibration (autoresearch); keep composite + add layers (iteration-003)
- [x] Q4: State management — our approach strongest on typed state + resume validation; borrow dashboard (autoresearch) and branch registry (ResearcherSkill) (iteration-004)
- [x] Q5: Priority improvements — P0: live segments, quality guards, structured novelty accounting, dashboard+resume; P1: charter/preflight, negative knowledge, source hygiene (iteration-005)

## What Worked
- Parallel wave dispatch (5 agents simultaneously) — completed all research in ~8 minutes total
- Giving each agent a focused question with explicit file paths and output format
- Pre-cloning repos to /tmp for reliable local access
- GPT-5.4 with high reasoning produced thorough, well-cited analysis across all agents

## What Failed
- Nothing significant — all agents completed successfully and produced high-quality output

## Exhausted Approaches (do not retry)
[None — research completed on first wave]

## Next Focus
Wave 2: 5 parallel agents analyzing 5 new repos for delta findings vs Wave 1

## Known Context
Our sk-deep-research skill (v1.0.0) implements:
- 4-phase loop: Init -> Iterate -> Synthesize -> Save
- LEAF agent dispatch per iteration (fresh context each time)
- Externalized state: JSONL log + strategy.md + config.json
- 3-signal composite convergence: rolling avg (w=0.30), MAD noise floor (w=0.35), question entropy (w=0.35)
- Stuck recovery with 3-strategy selection (try opposites, combine prior findings, audit low-value)
- 5-tier error recovery cascade
- Progressive synthesis (research/research.md updated each iteration)
- Wave orchestration documented as reference-only (not yet implemented)
- Design origins: karpathy/autoresearch (loop), AGR (fresh context), pi-autoresearch (JSONL), autoresearch-opencode (context injection)

## Research Boundaries
- Max iterations: 10
- Convergence threshold: 0.05
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Current segment: 1
- Started: 2026-03-24T08:35:00Z
- Delegation: up to 5 GPT-5.4 agents via codex exec (high reasoning)
