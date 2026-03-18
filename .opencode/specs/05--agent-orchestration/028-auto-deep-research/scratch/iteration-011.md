# Iteration 011: Community Pain Points Across All Repos

## Focus
GitHub issues/PRs/discussions analysis across pi-autoresearch (22 items), karpathy/autoresearch (300+ items), AGR (0 items), and autoresearch-opencode (0 items)

## Key Findings

### Finding 1: Session State Isolation is the #1 Bug Category
[SOURCE: pi-autoresearch Issue #7, PR #8 (7 comments)]

State leaks across sessions/projects. Users reported that starting a new autoresearch in a different directory would inherit state from a previous session. Root cause: runtime store was keyed by a shared identifier rather than per-project.

Fix (PR #8): Introduced `createRuntimeStore()` with per-session keying via `Map<string, AutoresearchRuntime>`.

**Impact on our system**: Our deep-research system uses spec folders for isolation (each research topic gets its own folder). However, if two research loops run concurrently on the same spec folder, we have no locking mechanism. This validates P1.4 (State Recovery) but also suggests a NEW proposal: concurrent access prevention via lock files or segment-based isolation.

### Finding 2: Shell Injection Vulnerability in Git Commits
[SOURCE: pi-autoresearch PR #13]

The `log_experiment` tool passed experiment descriptions directly into git commit messages without sanitization. Experiment descriptions could contain shell metacharacters (backticks, $(), etc.) leading to command injection during `git commit -m "..."`.

Fix: Sanitize commit message strings before passing to shell.

**Impact on our system**: Our iteration files contain user-provided topic descriptions and agent-generated content. If we implement P3.3 (Git Commit Per Iteration), we must sanitize commit messages. This is a concrete security edge case.

### Finding 3: Multiple Research Loops Need Subdirectory Support
[SOURCE: pi-autoresearch Issue #12 (closed), Issue #10]

Users want to run multiple sequential autoresearch sessions on different problems without file collisions. Current approach: all state in root directory means only one research loop at a time.

Proposed solutions discussed:
- Subdirectory-based isolation (each research gets its own folder)
- Working directory configuration (autoresearch.config.json `workingDir`)
- Git worktree for parallel isolation (PR #9, PR #19)

**Impact on our system**: We already solved this -- our spec folder per topic is exactly the subdirectory approach the pi-autoresearch community requested. This confirms our architecture is ahead of the community.

### Finding 4: Statistical Confidence for Noisy Metrics
[SOURCE: pi-autoresearch Issue #15, PR #22]

RFC and implementation of a statistical confidence layer for metric improvements. Problem: noisy benchmarks show apparent improvement that's actually within measurement variance.

PR #22 implements MAD-based confidence scoring. This directly validates our P1.2 (Composite Convergence Algorithm) which incorporates MAD as Signal 2.

The community discussion reveals the motivation: users were keeping experiments that showed "improvement" within noise, leading to accumulated marginal changes that didn't represent real progress.

### Finding 5: Agent Reliability Varies Dramatically by LLM Backend
[SOURCE: karpathy Issue #57 (28 comments, 17 reactions)]

"Codex doesn't seem to work?" -- The most-discussed issue in the karpathy repo. Codex CLI cannot follow "never stop" instructions and halts after a few iterations. Claude succeeds because its `/loop` capability and `-p` print mode enable autonomous operation.

Community findings:
- Claude Code with `--dangerously-skip-permissions` is the only reliable backend for autonomous loops
- Codex and other LLMs lack the tool-use persistence needed for multi-turn autonomous operation
- Some users report success with Gemini but with reduced reliability

**Impact on our system**: Our system uses the Task tool within Claude Code, which provides the same autonomous tool-use capability. If we ever support multi-backend (P4.3: True Context Isolation), the LLM backend choice is critical -- not all LLMs can sustain autonomous research loops.

### Finding 6: Zero-Kept Problem at Scale
[SOURCE: karpathy Issue #307]

"Zero experiments kept after 400+ nightly attempts." A user running `gemma3:1b` (small model) as the Gemini reviewer found that ALL experiments were discarded. Root cause: the model was too small to evaluate improvements correctly, or the optimization problem was already at a local optimum.

This reveals a failure mode our system should handle: what happens when the research loop produces N iterations with consistently low newInfoRatio? Our P2.1 (Enriched Stuck Recovery Heuristics) addresses this, but the karpathy community experience suggests the threshold should be configurable and the recovery should include "change the approach category entirely" (not just "try opposites").

### Finding 7: Experiment Diversity is a Core Problem
[SOURCE: karpathy PR #80 (8 comments)]

"Encourage experiment diversity in program.md" -- Agents converge on incremental parameter sweeps rather than exploring fundamentally different approaches. The PR adds nudges toward varied categories (architecture, optimization, regularization, data augmentation).

This directly validates our Q9 finding (no branching/tree search) and P2.5 (Scored Branching with Pruning). The community solution is prompt-based nudging; our proposed solution is structural (score branches, prune low-value ones, allocate more iterations to high-value branches).

### Finding 8: Deterministic Experiment Runner Needed
[SOURCE: karpathy PR #193 (4 comments)]

Replaces prose-only execution with `workflows/run_experiment.py` -- a Python script that provides resumable checkpointing and human intervention via `next_proposal.json`.

Key addition: human can inject proposals between iterations by editing a JSON file. This is analogous to our Ideas Backlog proposal (P2.2) and autoresearch-opencode's `autoresearch.ideas.md`.

### Finding 9: Repository Bloat from Experiment Artifacts
[SOURCE: pi-autoresearch Issue #3 (2 comments), PR #5]

"tree-on-experiment-log branch makes git clone 150 MB heavier." Each experiment commit accumulates binary artifacts, logs, and generated files. Over hundreds of experiments, the git repository becomes unwieldy.

Mitigation: `.gitignore` for node_modules and debug logs (PR #5). But the fundamental problem -- experiment commits accumulating -- persists.

**Impact on our system**: If we implement P3.3 (Git Commit Per Iteration), we should commit only state files (JSONL, strategy.md, iteration files), NOT generated artifacts or temporary files. A targeted `git add` list rather than `git add -A`.

### Finding 10: Hardware Fragmentation is Dominant Pain Point (karpathy ecosystem)
[SOURCE: karpathy PRs #96, #97, #202, #232, #138]

The most frequent PR category in karpathy's repo addresses hardware compatibility:
- AMD GPU support (ROCm/HIP)
- Older NVIDIA GPUs (Turing, SDPA fallback)
- Apple Silicon/MLX support
- Windows (no Triton)
- Configurable batch sizes for different VRAM

This is not directly relevant to our knowledge-research system (no GPU training), but reveals that for optimization-research systems, hardware portability is the #1 barrier to adoption.

### Finding 11: Stop/Pause Mechanism is a Frequently Requested Feature
[SOURCE: pi-autoresearch Issue #6 (3 comments)]

"Dedicated 'stop' button or command?" -- Users want clean ways to pause/stop the loop without killing the process. autoresearch-opencode's sentinel file (`.autoresearch-off`) is the simplest implementation.

**Impact on our system**: Our manual-orchestrated mode inherently supports pause (don't dispatch next iteration). For autonomous mode (future P4.3), we should implement a sentinel file check.

## Community Pain Points Summary

| Pain Point | Repos Affected | Severity | Our Proposal |
|-----------|---------------|----------|--------------|
| Session state leaks | pi-autoresearch | Critical | Spec folder isolation (already solved) |
| Shell injection in git commits | pi-autoresearch | High | Sanitize in P3.3 |
| Multiple concurrent research | pi-autoresearch, karpathy | High | Spec folders (already solved) |
| Noisy metrics, false improvements | pi-autoresearch, karpathy | High | P1.2 (MAD-based composite convergence) |
| LLM backend reliability | karpathy | High | N/A (we use Claude) |
| Zero-kept at scale | karpathy | Medium | P2.1 (stuck recovery heuristics) |
| Experiment diversity/convergence | karpathy | Medium | P2.5 (scored branching) |
| Repository bloat | pi-autoresearch | Medium | P3.3 (targeted git add) |
| Pause/stop mechanism | pi-autoresearch | Medium | Sentinel file for autonomous mode |
| Human intervention between iterations | karpathy | Medium | P2.2 (ideas backlog) |

## Assessment
- Questions addressed: Q12
- Questions answered: Q12 (fully -- comprehensive community pain point analysis across all repos)
- newInfoRatio: 0.75
- Key insight: The community's top pain points (state isolation, noisy metrics, experiment diversity) are already addressed by our existing proposals. Our spec folder architecture solves the #1 community request (multiple research loops). The new discovery is the zero-kept-at-scale problem and the importance of LLM backend reliability.

## Recommended Next Focus
Synthesis: cross-reference code patterns (iter 008-010) with community pain points (this iteration) to refine improvement proposals.
