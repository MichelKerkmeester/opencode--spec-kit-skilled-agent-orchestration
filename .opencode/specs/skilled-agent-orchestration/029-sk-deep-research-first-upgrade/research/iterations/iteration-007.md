# Iteration 007 — Pipeline Architecture (AutoResearchClaw)

## Focus
Q7: What end-to-end pipeline patterns from AutoResearchClaw add beyond Wave 1's guard metrics and revalidation proposals?

## Summary
Wave 1 mostly improved loop judgment: guard metrics, revalidation, harness generation, and noise handling. AutoResearchClaw adds a different layer: a typed end-to-end production pipeline with stage-local artifacts, rollback edges, diagnose-and-repair machinery, publication-specific verification, and cross-run learning.

## Key Delta Findings

### Finding 1: The core delta is typed pipeline orchestration, not just stronger loop heuristics
- **Sources**: `README.md`, `researchclaw/pipeline/stages.py`, `researchclaw/pipeline/runner.py`, `tests/test_rc_checkpoint.py`, `tests/test_rc_sentinel.py`, `sentinel.sh`
- **What is new vs Wave 1**: AutoResearchClaw models the workflow as a 23-stage state machine over 8 phases, with numbered stages, gate stages, rollback targets, checkpoint files, heartbeat files, resume-from-checkpoint behavior, and a watchdog that can restart a stale crashed run.
- **Why it matters**: This is not another "should we continue?" heuristic. It is an operational architecture for recoverable long-running work.
- **Transferable pattern**: Add explicit typed transitions and resumable stage checkpoints around fragile handoffs, rather than treating the whole workflow as one repeating loop.

### Finding 2: The extra stages are real control surfaces, not cosmetic subdivisions
- **Sources**: `README.md`, `researchclaw/pipeline/stages.py`
- **What the 23-stage pipeline adds beyond our 4-phase loop**:
- `PROBLEM_DECOMPOSE`, `SEARCH_STRATEGY`, `LITERATURE_SCREEN`, `KNOWLEDGE_EXTRACT` split evidence collection into planning, collection, screening, and extraction.
- `EXPERIMENT_DESIGN`, `CODE_GENERATION`, `RESOURCE_PLANNING` separate idea formation from executable plan and runtime constraints.
- `EXPERIMENT_RUN` and `ITERATIVE_REFINE` separate first-pass execution from recovery/refinement.
- `RESULT_ANALYSIS` and `RESEARCH_DECISION` separate interpretation from proceed/refine/pivot control.
- `PAPER_OUTLINE`, `PAPER_DRAFT`, `PEER_REVIEW`, `PAPER_REVISION`, `QUALITY_GATE`, `EXPORT_PUBLISH`, `CITATION_VERIFY` turn final synthesis into its own verification pipeline.
- **Why it matters**: These artifact boundaries are what make precise rollback and repair possible.
- **Transferable pattern**: Introduce explicit phase boundaries when the work product changes type: evidence set, synthesis, plan, critique, repaired output, and verified final deliverable.

### Finding 3: AutoResearchClaw persists multi-perspective reasoning before synthesis
- **Sources**: `researchclaw/pipeline/_helpers.py`, `researchclaw/pipeline/stage_impls/_synthesis.py`, `researchclaw/pipeline/stage_impls/_analysis.py`, `researchclaw/prompts.py`, `researchclaw/pipeline/stage_impls/_review_publish.py`
- **What is new vs Wave 1**:
- Hypothesis generation and result analysis call `_multi_perspective_generate()`, save separate role outputs under `perspectives/`, and only then synthesize them into the final artifact.
- Peer review is partly weaker than the README framing: Stage 18 usually simulates Reviewer A/B/C in one response rather than launching separate reviewer agents. But the prompt still forces differentiated methodology, domain, and statistics lenses.
- **Why it matters**: The durable innovation is not "more reviewers"; it is preserving disagreement surfaces and role-specific intermediate artifacts before collapse into one answer.
- **Transferable pattern**: For critical reasoning steps, materialize multiple role outputs first and synthesize second.

### Finding 4: Self-healing is a concrete diagnose-fix-rerun-assess subsystem
- **Sources**: `researchclaw/pipeline/runner.py`, `researchclaw/pipeline/experiment_diagnosis.py`, `researchclaw/pipeline/experiment_repair.py`, `tests/test_experiment_diagnosis.py`, `tests/test_experiment_repair.py`
- **What is new vs Wave 1**:
- After Stage 14, the runner writes `experiment_diagnosis.json`, classifies failure modes, assesses paper readiness, and decides whether repair is needed.
- `diagnose_experiment()` detects typed deficiencies such as missing dependencies, too few conditions, synthetic-data fallback, code crash, time-guard domination, identical conditions, dataset unavailability, permission issues, and GPU OOM.
- `build_repair_prompt()` turns those deficiencies into scoped fixes instead of a generic retry.
- `run_repair_loop()` executes bounded repair cycles: diagnose -> repair via OpenCode/LLM -> sandbox rerun -> reassess -> keep the best summary.
- Best recovered results are promoted back into Stage 14 so downstream writing uses the strongest available evidence.
- **Why it matters**: This is much stronger than Wave 1's revalidation concept. It is root-cause-aware recovery with bounded cycles and state promotion.
- **Transferable pattern**: Make recovery diagnosis-led, bounded, and artifact-promoting rather than a blind retry or generic "take another pass."

### Finding 5: Citation hygiene is implemented as a real verification-and-prune stage
- **Sources**: `researchclaw/pipeline/stage_impls/_review_publish.py`, `tests/test_rc_citation_verify.py`, `tests/test_rc_citation_resolve.py`, `README.md`
- **What is new vs Wave 1**:
- Stage 23 verifies bibliography entries through ordered checks: DOI/CrossRef, OpenAlex, arXiv, Semantic Scholar/title search.
- Citations are classified as verified, suspicious, hallucinated, or skipped, and the system writes a structured `verification_report.json`.
- The pipeline also runs an LLM topical-relevance filter, drops low-relevance citations, enforces a hard bibliography cap, prunes uncited entries, and removes hallucinated or low-relevance inline citations from the paper.
- Missing citation keys get a three-layer recovery path: seminal-paper lookup, validated API search with title overlap, then skip rather than guess.
- **Why it matters**: This is materially beyond "source hygiene" guidance. It is a destructive cleanup pass over real bibliography and inline citation artifacts.
- **Transferable pattern**: If references matter, treat them as verifiable artifacts with a post-generation filter/prune step.

### Finding 6: Anti-fabrication is enforced separately from citation verification
- **Sources**: `researchclaw/pipeline/verified_registry.py`, `tests/test_paper_verifier.py`, `README.md`
- **What is new vs Wave 1**:
- AutoResearchClaw builds a `VerifiedRegistry` from experiment artifacts and whitelists only numbers, condition names, derived differences, and rounded variants that are grounded in actual run outputs.
- The paper verifier can reject fabricated numbers in results tables, reject fabricated condition names, and downgrade unsupported quantitative claims outside strict sections.
- **Why it matters**: Wave 1 proposed better guards around research progression; AutoResearchClaw adds an explicit fact-grounding layer over final outputs.
- **Transferable pattern**: Separate "did we cite real sources?" from "are the concrete claims in the final artifact grounded in verified upstream data?"

### Finding 7: Memory is split into deterministic run state and longer-horizon cross-run learning
- **Sources**: `researchclaw/config.py`, `researchclaw/memory/store.py`, `researchclaw/memory/retriever.py`, `tests/test_memory_system.py`, `researchclaw/evolution.py`, `README.md`
- **What is new vs Wave 1**:
- The repo has a persistent memory system with `ideation`, `experiment`, and `writing` categories, JSONL storage, embeddings, time decay, confidence updates, access weighting, and prompt injection at selected stages.
- Separately, it has an evolution system that extracts lessons from failed/blocked/slow stages and injects stage-specific overlays into future prompts.
- **Why it matters**: Our skill is already strong on per-run externalized state. AutoResearchClaw adds a second layer for cross-run reuse and self-improvement.
- **Transferable pattern**: Keep deterministic per-run continuity separate from decayed, confidence-weighted cross-run memory and lessons.

## Convergence Note
- **Sources**: `researchclaw/experiment/evaluators/convergence.py`, `tests/test_convergence_evaluator.py`
- The repo's "convergence evaluator" is experiment-domain analysis, not autonomous research-loop stopping. It computes numerical convergence order from `(h, error)` curves for physics/math methods.
- The actual pipeline-level control is still Stage 15 `PROCEED/REFINE/PIVOT`, bounded pivots, empty-metric checks, checkpointing, and repair loops.
- **Conclusion**: AutoResearchClaw does not replace Wave 1's loop convergence ideas; it complements them with stronger operational scaffolding.

## Bottom Line
AutoResearchClaw's biggest contribution beyond Wave 1 is not another stop metric. It is a recoverable research-production architecture: typed stages, explicit artifact boundaries, persisted multi-perspective critique, diagnosis-led self-healing, citation and claim verification, and cross-run memory/evolution.

## Assessment
- `findingsCount`: 7
- `newInfoRatio`: 0.84
- `status`: complete

## Sources Consulted
- `/tmp/deep-research-029-wave2/AutoResearchClaw/README.md`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/config.researchclaw.example.yaml`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/prompts.default.yaml`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/prompts.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/stages.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/runner.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/_helpers.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/stage_impls/_synthesis.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/stage_impls/_analysis.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/stage_impls/_review_publish.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/experiment_diagnosis.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/experiment_repair.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/pipeline/verified_registry.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/experiment/evaluators/convergence.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/memory/store.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/memory/retriever.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/researchclaw/evolution.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/sentinel.sh`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_rc_checkpoint.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_rc_sentinel.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_experiment_diagnosis.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_experiment_repair.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_rc_citation_verify.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_rc_citation_resolve.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_paper_verifier.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_convergence_evaluator.py`
- `/tmp/deep-research-029-wave2/AutoResearchClaw/tests/test_memory_system.py`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md`
