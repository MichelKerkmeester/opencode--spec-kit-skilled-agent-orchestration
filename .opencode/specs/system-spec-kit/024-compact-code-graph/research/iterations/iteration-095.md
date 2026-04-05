# Iteration 95: Final Synthesis -- Segment 7 Verification via Copilot CLI (GPT-5.4)

## Focus
Complete the final synthesis for Segment 7 by updating `research.md` with the verification section, updating `deep-research-strategy.md` to mark Segment 7 complete, and recording the final Segment 7 roadmap, parity matrix, and revised P1 tally.

## Findings

### 1. Segment 7 materially changes how the earlier roadmap should be interpreted
The Segment 6 roadmap is still useful, but Segment 7 verification showed that several items previously described in implementation-sounding language are still design-only proposals in the current codebase. In particular, first-call priming, `GRAPH_AWARE_TOOLS`, near-exact seed resolution, auto-reindex triggers, and hybrid query execution remain future work rather than shipped behavior. That means the next implementation slice must start with hardening and truth-sync before feature expansion.

[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-077.md:55-64]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/deep-research-state.jsonl:86-99]

### 2. The verification pass confirmed most of the core correctness risks and narrowed only a small subset
The locally available verification artifacts confirm that the `endLine` collapse still exists, the public `code_graph_context` handler still strips provider-specific seed identity, and review findings around stale compact recovery, surrogate stop-time auto-save, and unvalidated scan roots remain active. The primary narrowing is wording precision: the `endLine` bug still severely degrades normal multi-line `CALLS` extraction, but it is not a universal zero-output failure because same-line bodies can still be detected.

[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-076.md:12-18]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:12-38]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:14-31]

### 3. The cross-runtime picture is now sharper and more runtime-specific
OpenCode, Codex, Copilot, and Gemini do not share one universal startup surface. OpenCode depends on agent markdown plus resume workflows, Codex depends on `CODEX.md` plus its context agent, Copilot depends on shared instruction files rather than optional agent profiles, and Gemini has an instruction-first path today with an upstream hook ceiling above that. The final parity matrix should therefore compare startup surfaces and practical parity per runtime instead of carrying a single "non-hook runtime" bucket forward.

[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md:63-139]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/deep-research-state.jsonl:95-99]

### 4. Revised P1 tally from the locally available verification wave: 6 confirmed, 1 false positive, 3 not recoverable as standalone artifacts
The available wave-4 verification artifacts explicitly confirm P1-1, P1-2, P1-4, P1-5, P1-6, and P1-10, while P1-3 becomes a false positive against current `session-stop.ts`. The expected remaining wave-4 / scorecard artifacts were not present as standalone markdown files in the workspace, so the final synthesis must keep that tally conservative instead of inventing results for absent files.

[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-088.md:12-57]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:85-90]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:12-67]

### 5. Provenance note for the final synthesis
The local final-synthesis workspace contains direct Segment 7 iteration markdown for `076-089` and `091` plus the canonical `deep-research-state.jsonl`, but it does not contain standalone markdown files for `090`, `092`, `093`, or `094`. The final research section therefore reconstructs the verification scorecard, updated roadmap, and parity matrix from the available Segment 7 evidence instead of pretending those missing standalone artifacts were present.

[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/deep-research-state.jsonl:89-100]

## Actions Taken
- Added `Part XI` to `research.md` with the Segment 7 executive summary, updated roadmap, cross-runtime parity matrix, revised P1 tally, and final recommendations.
- Updated the convergence tables and appendix to include Segment 7.
- Updated `deep-research-strategy.md` to mark Segment 7 `COMPLETE` and to revise the overall next action toward truth-sync + P1 hardening.

## Assessment
- `newInfoRatio`: 0.12
- Summary: Pure synthesis iteration with one important provenance clarification: the final segment summary had to be reconstructed from the canonical state log plus extant iteration files because standalone `090`/`092`/`093`/`094` markdown artifacts were absent locally.

## Reflection
This final pass was mainly consolidation, but it materially improves the reliability of the packet by separating what is **implemented**, what is **still proposed**, and what earlier review language overstated. Segment 7 did not overturn the program direction; it made the implementation order and runtime-specific surfaces much safer to act on.
