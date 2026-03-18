# Iteration 013: Karpathy Ecosystem -- Forks, Community Adaptations, and Development Direction

## Focus
Top forks analysis, community adaptations, karpathy repo issue landscape, and ecosystem direction

## Key Findings

### Finding 1: macOS Fork Dominates with 1,259 Stars
[SOURCE: GitHub API forks endpoint, sorted by stars]

Top 10 forks of karpathy/autoresearch:

| Rank | Fork | Stars | Adaptation |
|------|------|-------|-----------|
| 1 | miolini/autoresearch-macos | 1,259 | macOS/Apple Silicon native |
| 2 | mutable-state-inc/autoresearch-at-home | 425 | Consumer hardware optimization |
| 3 | jsegov/autoresearch-win-rtx | 270 | Windows + RTX GPU support |
| 4 | sanbuphy/autoresearch-cn | 141 | Chinese localization |
| 5 | ncdrone/autoresearch-ANE | 43 | Apple Neural Engine (zero GPU) |
| 6 | thenamangoyal/autoresearch | 32 | Standard fork |
| 7 | kousun12/darwin-derby | 12 | Generalized "research on anything" |
| 8 | rawwerks/autoresearch | 12 | Standard fork |
| 9 | buzypi/autoresearch | 10 | Standard fork |
| 10 | hgarud/autoresearch | 8 | Standard fork |

**Dominant pattern**: Hardware portability drives fork creation. The top 5 forks all adapt for different hardware (macOS, consumer GPUs, Windows, Apple Neural Engine). Only 1 fork (darwin-derby) attempts to generalize the research loop beyond ML training.

**Impact on our system**: Our knowledge-research system is hardware-agnostic (no GPU training), so we sidestep the #1 community pain point entirely. The darwin-derby fork ("AI agents running research on anything automatically") is the closest analog to our use case.

### Finding 2: darwin-derby Generalizes Autoresearch Beyond ML
[SOURCE: kousun12/darwin-derby fork description]

"AI agents running research on anything automatically" -- This fork attempts to make the autoresearch pattern domain-agnostic, not tied to ML benchmark optimization. This is conceptually identical to our deep-research system's approach.

The fork has only 12 stars, suggesting the community hasn't yet recognized the general-purpose potential. Our system's question-driven, convergence-detecting approach is more sophisticated than anything in the fork ecosystem.

### Finding 3: Memory-in-the-Loop PR Adds Persistence
[SOURCE: karpathy PR #302 (4 comments)]

"Karpathy's AutoResearch with Memory-in-the-Loop States" -- Applies the DEITY framework for human-machine collaboration. Adds:
- Config extraction
- GPU auto-detection
- Memory persistence to `sessions/memory.md`

This introduces a persistent memory layer similar to our Spec Kit Memory system. The fact that the community is adding memory to autoresearch confirms the value of our memory-integrated approach.

### Finding 4: Pre-Eval Checkpoint for Crash Recovery
[SOURCE: karpathy PR #265]

Adds checkpointing before evaluation runs, enabling crash recovery. If evaluation crashes, the system can restart from the checkpoint rather than losing the entire iteration.

This is a code-level implementation of our P1.4 (State Recovery Fallback). The karpathy community independently identified the same need: recovery from mid-iteration failures.

### Finding 5: Reflection/Musings Step Proposed
[SOURCE: karpathy PR #282]

Adds a "reflection" or "musings" step between experiments. The agent pauses to consider what it has learned and what direction to explore next.

This is exactly our P2.3 (Iteration Reflection Section). The karpathy community independently proposed the same improvement, validating our proposal.

### Finding 6: Real-Time Dashboard as Most Wanted Feature
[SOURCE: karpathy PR #114]

"Zero-dependency real-time dashboard" -- Community wants live visualization of experiment progress without requiring matplotlib or other dependencies.

This validates P4.2 (Progress Visualization) as a real user need, not just a nice-to-have.

### Finding 7: Actor-Critic Sandbox Execution
[SOURCE: karpathy PR #116]

Proposes running experiments in a sandboxed environment where a "critic" agent evaluates results separately from the "actor" agent that generates them. This separation prevents the actor from gaming its own evaluation.

**Impact on our system**: For research, this maps to: the agent that CONDUCTS research should not be the same agent that EVALUATES its newInfoRatio. A separate evaluation agent could provide more objective quality assessment. This is a potential refinement to P3.1 (Statistical newInfoRatio Validation).

### Finding 8: Issue Landscape by Category (karpathy repo)

| Category | Examples | Count (approx) |
|----------|----------|---------|
| Hardware portability | AMD, Apple, Windows, batch size | ~15 PRs |
| Agent quality/diversity | Experiment diversity, novelty, reflection | ~8 issues/PRs |
| Infrastructure | Dashboard, sandbox, checkpointing | ~6 PRs |
| LLM backend | Codex compatibility, cost concerns | ~5 issues |
| Research methodology | Memory, deterministic runner, musings | ~5 PRs |

The methodology category (memory, determinism, reflection) is where our proposals overlap most with community needs.

### Finding 9: Cost Concerns Drive Architecture Decisions
[SOURCE: karpathy Issue #61]

Nightly LLM + GPU training costs are a significant barrier. Users want to minimize token usage per iteration while maintaining research quality.

For our system: each research iteration consumes tokens for the agent's reasoning + tool calls. Our parallel wave pattern multiplies this by the wave size. The Compact State Summary (P3.2) directly addresses token efficiency by injecting a 200-token summary instead of requiring agents to re-read all state files.

### Finding 10: Fork Divergence Analysis

| Fork | Active Development | Divergence Type |
|------|-------------------|-----------------|
| autoresearch-macos | High (daily pushes) | Hardware adaptation |
| autoresearch-at-home | Low (3-day gap) | Configuration tuning |
| autoresearch-win-rtx | Moderate (weekly) | Platform porting |
| autoresearch-cn | Minimal (1 push) | Localization only |
| autoresearch-ANE | High (significant) | Novel hardware (Neural Engine, Obj-C, private APIs) |
| darwin-derby | High (daily) | Conceptual generalization |

The ANE fork is the most technically interesting -- it targets Apple's Neural Engine using Objective-C and private APIs, completely bypassing GPU-based training. This represents the most radical divergence from the original.

## Community Adaptations Summary

| Adaptation Type | Forks | Our System Relevance |
|----------------|-------|---------------------|
| Hardware porting | 4 (macOS, Windows, ANE, consumer) | Not relevant (no GPU) |
| Localization | 1 (Chinese) | Not relevant |
| Generalization | 1 (darwin-derby) | Directly relevant -- validates our approach |
| Standard forks | 4 (minimal changes) | No insight |

## Assessment
- Questions addressed: Q16
- Questions answered: Q16 (fully -- fork ecosystem analyzed, community adaptations categorized)
- newInfoRatio: 0.55
- Key insight: The karpathy community independently proposed several improvements we already planned (reflection, checkpointing, memory, dashboard). The dominant fork pattern is hardware portability, which doesn't apply to knowledge research. The darwin-derby fork validates our general-purpose research approach but has minimal adoption.

## Recommended Next Focus
Final synthesis (iteration 014): cross-reference all findings to refine improvement proposals.
