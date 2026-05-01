# Iteration 013 — Memory Architecture And Promotion Boundaries

## Research question
Is `system-spec-kit`'s current memory architecture too heavy for routine session durability, and does the external repo suggest that session notes and indexed durable memories should be separated more aggressively?

## Hypothesis
The external repo will show that lightweight notes-to-disk already solve a large share of compaction and continuation pain, while the local memory pipeline will reveal that `system-spec-kit` is using the same write surface for both simple session capture and high-quality indexed memory.

## Method
Compared the external repo's note-to-disk artifacts and operator progress surfaces to the local JSON-primary memory save CLI, the 14-rule memory-quality gate, and the metadata layer attached to saved memories.

## Evidence
- The external repo's continuation model is materially simple: MDD creates one compact working doc, and the progress command gathers source/tests/git state without invoking a semantic memory system. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-30]
- The local `generate-context` CLI is explicitly JSON-primary, requires approved spec-folder routing, and enriches memory saves with tool summaries, exchanges, preflight/postflight epistemic scores, and learning-delta calculations. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-124] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:166-232]
- The canonical memory-quality validator carries 14 rule classes, including placeholder leakage, malformed routing metadata, cross-spec contamination, title contamination, API error leakage, topical coherence, malformed frontmatter, and status/percentage contradictions. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:23-176] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:709-1004]
- The memory metadata layer adds classification type, decay model, dedup signals, causal links, and evidence snapshots, which is valuable for durable retrieval but significantly richer than a plain session note. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:19-40] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:76-177]

## Analysis
`system-spec-kit` is asking a single save pipeline to satisfy two different jobs: "I need a faithful session artifact right now" and "I need a clean, semantically indexable, retrieval-optimized durable memory." The external repo shows that the first job can often be solved with a much simpler artifact. The local architecture adds real value for the second job, but it makes the first job heavier than necessary. That suggests a structural boundary problem, not merely a documentation problem.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** One memory save path captures rich structured session data, then subjects the resulting memory to a sophisticated post-render quality and metadata pipeline before indexing.
- **External repo's approach:** Keep continuity mostly in lightweight docs and operational checklists, without forcing every note through a semantic-memory promotion path.
- **Why the external approach might be better:** It treats routine continuity as cheap and immediate, which lowers operator friction and avoids overfitting every session artifact to the retrieval system.
- **Why system-spec-kit's approach might still be correct:** Cross-session retrieval, contamination safety, and semantic recall do need a high-integrity durable-memory path.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Split memory into two lanes: `session digests` for low-friction continuity and `promoted memories` for indexed long-term retrieval. The first lane can be lightweight and append-friendly; the second keeps the richer validation and metadata pipeline.
- **Blast radius of the change:** architectural
- **Migration path:** Preserve the current pipeline as the promoted-memory path, add a lighter session-digest artifact first, and later let promotion happen explicitly or automatically only when a digest meets quality thresholds.

## Conclusion
confidence: high

finding: The external repo suggests a real architectural simplification opportunity: `system-spec-kit` should stop forcing low-friction session capture and high-integrity indexed memory through exactly the same pipeline.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts`, memory retrieval surfaces
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define the contract between lightweight session digests and promoted/indexed memories, including when promotion happens
- **Priority:** must-have

## Counter-evidence sought
I looked for proof that the external repo needed retrieval-quality controls equivalent to V8/V11/V12 contamination and coherence rules. The reviewed sources did not show that burden because the repo is not trying to do the same kind of semantic memory retrieval. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]

## Follow-up questions for next iteration
If session continuity gets its own lightweight lane, can the gate system shrink as well?
Would the deep-research loop still need as many reducer-owned artifacts if session digests became cheaper and clearer?
