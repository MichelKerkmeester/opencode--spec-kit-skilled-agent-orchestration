# Iteration 006: State Management & Execution Strategy Consolidation

## Focus
Consolidate all partial answers on state management (Q4) and execution strategies (Q7) into unified recommendations. Investigate karpathy/autoresearch (the original, 41K stars) to identify patterns not inherited by the 3 forks. Propose an optimal state management architecture specifically adapted for RESEARCH loops (as distinct from optimization loops).

## Karpathy Original Analysis

### Project Structure
The original karpathy/autoresearch is a 10-file, flat-structure project: `prepare.py`, `train.py`, `program.md`, `analysis.ipynb`, `pyproject.toml`, plus config/lock files. No subdirectories. This extreme minimalism is the defining characteristic -- it is the philosophical foundation all forks inherited and then expanded.
[SOURCE: https://api.github.com/repos/karpathy/autoresearch/contents/]

### Patterns Present in Original but NOT Emphasized by Forks

**F1: The "Program" Pattern (program.md as executable specification)**
Karpathy's `program.md` is not a strategy document -- it is an *executable specification* that defines the entire research loop inline. It contains the complete agent instructions: what files to read, what to modify, how to run experiments, how to evaluate results, how to decide keep/discard, and how to handle errors. The forks fragmented this into separate files (SKILL.md, guide.md, templates.md, etc.), gaining modularity but losing the single-source-of-truth property.

Key detail: `program.md` explicitly defines the TSV format (`results.tsv`), the git workflow (commit before benchmark, reset on discard), the metric extraction commands (`grep "^val_bpb:\|^peak_vram_mb:" run.log`), and the error handling hierarchy -- all in one document. This is a *self-contained research protocol* that can be handed to any agent without additional files.
[SOURCE: https://raw.githubusercontent.com/karpathy/autoresearch/master/program.md]

**F2: Stdout-Only Results Interface**
The original `train.py` writes NO files for results tracking. It prints metrics to stdout (`val_bpb: X.XXXXXX`, `peak_vram_mb: XXX.X`), and the agent captures these via grep into `results.tsv`. This stdout-as-interface pattern means the experiment code is completely decoupled from the orchestration. The forks added more sophisticated file-based state (JSONL) but lost this clean separation.
[SOURCE: https://raw.githubusercontent.com/karpathy/autoresearch/master/train.py -- stdout printing, no file I/O for results]

**F3: Immutable Evaluation as Anchor**
`prepare.py` contains `evaluate_bpb()` which is the ONLY measurement function and is explicitly marked immutable. The 5-minute TIME_BUDGET, the validation shard pinning (shard_06542), the vocab-independent BPB metric -- all are locked. This creates an *immovable anchor* that prevents the agent from gaming the metric system. The forks inherited the concept (benchmark.py in AGR, autoresearch.sh in autoresearch-opencode) but the original is the purest expression.
[SOURCE: https://raw.githubusercontent.com/karpathy/autoresearch/master/prepare.py -- TIME_BUDGET=300, evaluate_bpb function]

**F4: No Convergence, No Strategy Document, No State Beyond TSV**
The original has zero convergence detection, zero strategy evolution, and zero structured state. The only accumulated state is `results.tsv` (agent-written, untracked by git) and the modified `train.py` (tracked by git commits). This is radically minimal. AGR added STRATEGY.md. pi-autoresearch added JSONL + segments. autoresearch-opencode added autoresearch.md + worklog.md + ideas.md. Each fork added layers of state management that the original deliberately omitted.
[SOURCE: program.md -- "runs until the human interrupts you, period", no stopping criteria]

**F5: The "Simplicity Criterion" as Quality Gate**
Unique to Karpathy's philosophy: code simplification counts as a WIN even without metric improvement. "Removing code with equal/better results? DEFINITELY keep." This is NOT inherited by any fork in the research-strategy sense -- the forks focus on metric improvement only. The simplicity criterion is a qualitative quality gate embedded in a quantitative optimization loop.
[SOURCE: program.md -- acceptance logic for keep/discard decisions]

**F6: Issue #314 -- The Meta-Learning Frontier**
An open issue (March 17, 2026) proposes making `program.md` itself a mutable artifact that evolves based on experiment results. This would create two optimization loops: object-level (train.py) and meta-level (program.md). Neither the original nor any fork implements this yet, but it directly maps to our strategy.md update protocol -- we already do meta-level evolution of our research strategy. Our system is ahead of the original on this dimension.
[SOURCE: https://api.github.com/repos/karpathy/autoresearch/issues/314]

### What the Original Teaches About State Management
The original proves that *minimal state is viable for optimization*. With just stdout + TSV + git commits, you can run 100+ experiments overnight. But this works ONLY because:
1. There is exactly ONE metric (val_bpb)
2. The keep/discard decision is binary
3. Git provides implicit state via commit history
4. The agent needs no memory of WHY something failed -- only THAT it failed

For research, all four conditions are violated: multiple qualitative signals, non-binary quality assessment, no natural git checkpoints, and understanding WHY matters critically.

## Optimal State Management for Research Loops

### Why Research Differs from Optimization

| Dimension | Optimization Loops | Research Loops |
|-----------|-------------------|----------------|
| Output type | Numeric metrics (val_bpb, runtime) | Qualitative findings, citations, explanations |
| Quality assessment | Binary (improved/not) or numeric delta | Continuous scale with subjective judgment |
| Information accumulation | Additive for keeps, discarded for failures | Always additive -- even "negative" findings have value |
| Question structure | Single metric to improve | Multiple questions that branch and merge |
| State granularity | Per-experiment (commit hash + metric) | Per-finding with source attribution |
| Recovery needs | Restore to last good commit | Never lose any finding -- all are valuable |
| Strategy evolution | Optional (original has none) | Essential (questions answered change direction) |
| Convergence signal | Metric plateau (objective) | Information gain (subjective) |

### Consolidated State Management Recommendation

Based on cross-analysis of 4 repos (karpathy original + 3 forks) and our current system:

**Architecture: 5-File Model with Research Extensions**

```
{spec_folder}/
  research/research.md                          # Progressive synthesis (additive only)
  scratch/
    deep-research-config.json           # Immutable after init
    deep-research-state.jsonl           # Append-only structured log
    deep-research-strategy.md           # Mutable persistent brain
    iteration-NNN.md                    # Write-once findings per iteration
    research-ideas.md                   # [NEW] Persistent ideas backlog
```

**Rationale for each file's role:**

1. **config.json (Immutable)** -- Mirrors karpathy's prepare.py/program.md immutability principle. Parameters frozen at init prevent the agent from adjusting its own constraints. Grade A pattern, universal across all 4 repos.

2. **state.jsonl (Append-only)** -- JSONL is the consensus format across pi-autoresearch, autoresearch-opencode, and our system. Append-only guarantees crash safety (partial writes never corrupt prior records). Our enriched format (iteration + event records with newInfoRatio, keyQuestions, answeredQuestions) is strictly superior to the optimization-focused formats.

3. **strategy.md (Mutable, orchestrator-controlled)** -- Maps to AGR's STRATEGY.md, pi-autoresearch's autoresearch.md, karpathy Issue #314's proposed meta-level loop. Our structured sections (Key Questions, Answered, What Worked, What Failed, Exhausted Approaches, Next Focus) are the most research-appropriate of any implementation examined. This is validated by the fact that Issue #314 asks for exactly what we already have.

4. **iteration-NNN.md (Write-once)** -- Provides the "rich narrative" that autoresearch-opencode's worklog achieves in a single growing file, but with better isolation (one file per iteration = easier to reference and synthesize). The write-once guarantee prevents accidental modification of historical findings.

5. **research.md (Progressive synthesis)** -- Unique to our system, not found in any of the 4 repos. This is the accumulated research output that grows with each iteration. It serves the role that `train.py` modifications serve in optimization (the "current best state"), but for knowledge rather than code.

6. **research-ideas.md [NEW, recommended]** -- Adopted from autoresearch-opencode's `autoresearch.ideas.md`. A persistent parking lot for promising directions not yet pursued. Survives across sessions, can be user-edited, and provides steering without requiring full orchestrator intervention.

### Research-Specific State Extensions Worth Adopting

**A. Segment Model (from pi-autoresearch) -- Priority: Medium**
Add a `segment` field to JSONL iteration records. When the research topic shifts or restarts with a different angle, increment the segment counter. This allows filtering to "current investigation" while retaining full history. Implementation: add `"segment": N` to each iteration record, default to 1. Increment via a new `{"type":"event","event":"segment_start","segment":N}` record.

**B. Recovery Tier Fallback (from pi-autoresearch) -- Priority: Medium**
Add a secondary recovery path: if JSONL is corrupted, reconstruct state from iteration-NNN.md files (which contain questions addressed, questions answered, and findings count). This mirrors pi-autoresearch's session-history fallback. Implementation: scan `research/iterations/iteration-*.md` files, parse Assessment sections, rebuild JSONL entries.

**C. Exhausted Approaches Registry Enhancement (from AGR) -- Priority: High**
Formalize the "Exhausted Approaches" section in strategy.md with explicit blocking rules. Currently it is a list; it should include the iteration number when exhausted, the number of attempts, and a "do not retry" instruction that the agent MUST check before choosing a focus. This mirrors AGR's Tier 5 error handling.

**D. File Mutability Declaration (from AGR and karpathy original) -- Priority: Low**
Add a comment block at the top of each state file declaring its mutability class:
```
<!-- MUTABILITY: append-only | This file must never be overwritten, only appended to -->
<!-- MUTABILITY: immutable | This file must not be modified after creation -->
<!-- MUTABILITY: mutable | Updated by orchestrator each iteration -->
<!-- MUTABILITY: write-once | Created once, never modified -->
```
This makes the contract explicit and prevents the class of failures AGR documented ("agent edited run_autoresearch.sh and broke the loop").

## Research-Adapted Execution Strategies

### What Transfers from Optimization to Research

| Optimization Pattern | Research Adaptation | Confidence |
|---------------------|-------------------|------------|
| Fresh context per iteration (all repos) | Directly applicable -- prevents context degradation and ensures consistent reasoning quality | High |
| Append-only results log (all repos) | Directly applicable -- JSONL is crash-safe and human-readable | High |
| Mutable strategy document (AGR, pi, opencode) | Directly applicable -- already implemented as strategy.md | High |
| Git commit before benchmark (AGR, karpathy) | Partial: commit after each iteration provides recovery points but is less natural for research | Medium |
| Binary keep/discard (all repos) | Does NOT transfer -- research findings are always additive | High |
| Stuck detection with recovery (AGR) | Transfers well -- our stuckThreshold + recovery protocol is a direct adaptation | High |
| Variance analysis / noise floor (AGR) | Partially transfers -- could measure "information noise floor" but the signal is subjective | Medium |

### What Does NOT Transfer

**1. Single-Metric Optimization**
All 4 repos optimize a single numeric metric (val_bpb or runtime). Research has no single metric. Our `newInfoRatio` is the closest analog, but it is subjective (agent self-assessed) and multi-dimensional (novelty, quality, relevance are conflated). This is the fundamental domain gap.

**2. Keep/Discard Binary**
In optimization, failed experiments are reverted (`git reset`). In research, negative findings are valuable ("X does not exist", "Y contradicts Z"). There is no "discard" in research -- every iteration's findings persist. This is why our write-once iteration files and progressive research/research.md are architecturally correct.

**3. Deterministic Evaluation**
Optimization can re-run a benchmark to verify results. Research cannot re-run a web search and expect identical results. Sources change, pages move, context shifts. This means research state must be richer (include citations, quotes, timestamps) because it cannot be regenerated.

### What Is Unique to Research (Not Found in Optimization Repos)

**1. Question-Driven Exploration**
Research loops are guided by questions, not metrics. Our Key Questions list in strategy.md drives iteration focus. No optimization repo has an equivalent -- they simply try to improve the metric. This is our strongest unique pattern.

**2. Source Tracking and Citation Management**
Research requires provenance. Every finding must link to a source (URL, file:line, API response). Optimization repos track commit hashes and metric values but not "why" or "where from." Our iteration files with `## Sources Consulted` sections and in-finding `[SOURCE: ...]` citations are research-specific state that has no optimization equivalent.

**3. Progressive Synthesis**
Research needs an accumulated "best understanding" document (research/research.md) that grows with each iteration. Optimization repos accumulate a "best code state" (the latest kept commit of train.py). These are structurally similar (both represent "current best") but the research version requires narrative coherence across iterations, not just metric superiority.

**4. Sub-Question Branching**
Research questions naturally branch: investigating Q1 reveals sub-questions Q1a and Q1b. Our strategy.md tracks this through the Key Questions list which grows and shrinks. Optimization has no equivalent -- there is always exactly one goal (improve the metric).

**5. Multi-Source Triangulation**
Research iterations may consult multiple independent sources (web, codebase, documentation, APIs) and cross-reference them. Optimization iterations have one input (code) and one output (metric). Our execution strategy correctly uses WebFetch, Grep, Glob, and Read in combination -- this multi-tool approach is absent from all optimization repos.

### Execution Strategy Recommendations

**Adopt from optimization repos:**
1. **True context isolation** (AGR's `claude -p` pattern) -- For autonomous mode, consider launching fresh agent processes instead of sub-agent dispatch. Trade-off: higher token cost for guaranteed consistent reasoning quality.
2. **Tiered error recovery** (AGR's 5-tier model) -- Implement recovery tiers: (1) retry with broader scope, (2) try opposite direction, (3) combine previous findings, (4) escalate to human. Currently we have single-tier recovery.
3. **Ideas backlog** (autoresearch-opencode) -- Maintain `research-ideas.md` for promising but deferred directions.

**Keep our research-specific innovations:**
1. **Question-driven focus selection** -- No optimization repo has this.
2. **Convergence detection via newInfoRatio** -- All optimization repos lack algorithmic stopping.
3. **Parallel wave execution** -- Genuinely novel, not found in any repo.
4. **Progressive synthesis** -- research/research.md has no optimization equivalent.

## Sources Consulted
- https://raw.githubusercontent.com/karpathy/autoresearch/master/README.md (original project overview)
- https://raw.githubusercontent.com/karpathy/autoresearch/master/program.md (the complete research protocol)
- https://raw.githubusercontent.com/karpathy/autoresearch/master/train.py (execution mechanics)
- https://raw.githubusercontent.com/karpathy/autoresearch/master/prepare.py (immutable evaluation anchor)
- https://raw.githubusercontent.com/karpathy/autoresearch/master/pyproject.toml (project metadata)
- https://api.github.com/repos/karpathy/autoresearch/contents/ (project structure)
- https://api.github.com/repos/karpathy/autoresearch (repo metadata: 41K stars, 5.7K forks)
- https://api.github.com/repos/karpathy/autoresearch/commits?per_page=5 (recent development)
- https://api.github.com/repos/karpathy/autoresearch/issues?state=all&per_page=10 (community discussion)
- https://api.github.com/repos/karpathy/autoresearch/issues/314 (meta-learning proposal)
- https://api.github.com/repos/karpathy/autoresearch/issues/318 (PR implementing #314)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/state-format.md (our state format spec)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/convergence.md (our convergence algorithm)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/research/iterations/iteration-001.md (prior AGR findings)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/research/iterations/iteration-002.md (prior pi-autoresearch findings)
- /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/03--commands-and-skills/023-sk-deep-research-creation/research/iterations/iteration-003.md (prior autoresearch-opencode findings)

## Assessment
- New information ratio: 0.60
- Questions addressed: Q4, Q7
- Questions answered: Q4 (fully -- consolidated with architectural recommendation), Q7 (fully -- what transfers, what does not, what is unique to research)

**Rationale for 0.60**: The karpathy original analysis yielded genuinely new insights (F1-F6) not covered in prior iterations -- particularly the program.md-as-executable-specification pattern, the stdout-only interface, Issue #314's meta-learning proposal, and the simplicity criterion. However, the state management consolidation and execution strategy analysis largely synthesized existing findings from iterations 001-003 rather than discovering entirely new information. The cross-cutting synthesis itself is the value-add, not raw new data.

## Recommended Next Focus
- **Q8 (Convergence algorithms)**: Explore optimization/information-theory literature for statistical convergence methods beyond MAD. This is the last partially-answered question with high value.
- **Q9+Q10 (Branching strategies + Concrete improvements)**: Cross-cutting synthesis ranking all discovered patterns by adoption priority. This should be the final synthesis iteration.
