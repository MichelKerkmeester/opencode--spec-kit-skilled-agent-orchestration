# Deep Research Strategy: 040 Auto Deep Research / Review Improvement

## Topic
Unify deep research and deep review into one consistent, evolvable, lineage-aware loop with durable state semantics and runtime parity across hook and non-hook CLIs.

## Key Questions
1. Where does historical fragmentation happen today (state naming, lifecycle branches, runtime drift, packet migration)?
2. Which documented behaviors are not executable in YAML/agent contracts (restart, fork, completed-session continuation)?
3. Which external patterns improve reliability without importing weak memory/lineage models?
4. How can completed sessions continue same-lineage work without forcing manual subfolder drift?
5. What canonical state model can keep JSONL, iteration markdown, strategy, and dashboard synchronized?
6. Which naming contract should become canonical for review mode (`deep-review-*` vs `deep-research-*`)?
7. How do we keep compatibility for Codex/OpenCode/Claude/Gemini and non-hook startup paths?
8. What parity checks prevent drift across runtime mirrors and documentation surfaces?
9. What migration contract safely absorbs legacy artifacts from `scratch/` and previous review packets?
10. Which test matrix proves behavior for pause/resume/restart/fork and lineage continuity?

## Known Context
- Prior packet work moved review artifacts into `{spec_folder}/review/`, but lineage is still implicit and restart/fork is not fully executable in research mode.
- Existing state files are strong for portability, but there is no canonical reducer that continuously reconciles state surfaces.
- Waves 1 and 2 proved the main internal gaps are contract gaps: lifecycle execution, lineage metadata, reducer ownership, and runtime/doc parity.
- Wave 3 deep-dived the three external repos and confirmed the strongest external ideas are runtime portability, capability gating, explicit handoffs, small mutable surfaces, and fixed evaluation boundaries.
- No external repo provides a drop-in lineage-aware research/review history model; that layer still has to be designed internally.
- CocoIndex semantic search is unavailable in this environment due daemon absence (`~/.cocoindex_code/daemon.sock`), so this wave used direct source evidence via `rg`/`sed`.

## What Worked
- Multi-lane evidence decomposition with explicit line-level citations across internal and external sources.
- Cross-surface drift matrixing (SKILL vs README vs references vs YAML vs runtime mirrors) exposed concrete contract conflicts quickly.
- Wave-2 iteration design with richer per-iteration schema increased traceability and reduced synthesis ambiguity.
- Wave-3 worker-owned external lanes made it possible to extend the same packet without fragmenting the shared ledger again.
- Compact iteration files with fixed sections kept 90-step synthesis readable and mergeable.
- Compatibility lens (hook + non-hook) remained stable by keeping the packet/disk model as the primary state authority.

## What Failed
- Assumption that `resume/restart/fork` prompts implied executable lifecycle branches in confirm mode.
- Assumption that deep-review naming had already converged; SKILL, README, references, manual playbook, and YAML still diverge.
- Assumption that runtime orchestrate/context-prime mirrors were parity-complete across Codex/OpenCode/Claude/Gemini.
- Assumption that documentation-first contracts alone can prevent drift without CI parity gates.
- Assumption that external repos would offer a direct answer for durable lineage continuity instead of just better runtime ergonomics.

## Exhausted Approaches
- Treating external frameworks as drop-in architecture templates for historical lineage persistence.
- Relying on markdown strategy as the only persistent "brain" without normalized machine-owned state.
- Keeping review naming mixed for backward compatibility without an explicit dual-read/single-write window and deprecation checkpoints.
- Handling completed-session resumes only via synthesis path without a continuation branch.
- Treating logs, retrieval memory, or generated workflow files as substitutes for a canonical findings registry.

## Next Focus
Finalize implementation planning artifacts around six P0/P1 tracks:
1) Lineage schema + lifecycle state machine (`new`, `resume`, `restart`, `fork`, `completed-continue`).
2) Canonical naming contract for review artifacts with migration bridge and sunset criteria.
3) Deterministic per-iteration reducer + active findings registry.
4) Runtime capability matrix + portability adapter layer for provider/tool support.
5) Runtime parity generation and contract tests across all CLI mirrors.
6) Hook/non-hook compatibility test matrix with explicit failure and recovery expectations.
