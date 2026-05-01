# Iteration 013 — Do Not Pivot Spec Kit Memory to Prompt-Authored Repo-Global Markdown

Date: 2026-04-10

## Research question
Does Xethryon's prompt-authored, repo-global markdown memory suggest that `system-spec-kit` should pivot away from its explicit JSON-primary save pipeline and indexed memory architecture?

## Hypothesis
No. Xethryon's memory system improves ambient continuity, but it does so by trusting model-authored file writes and repo-global memory organization in ways that are too fragile for Spec Kit's governance and retrieval goals.

## Method
I examined Xethryon's memory path rules, type taxonomy, extraction pipeline, and relevance engine, then compared them to Spec Kit's explicit save contract and indexed content model.

## Evidence
- Xethryon stores project memory under `~/.xethryon/projects/{sanitized-project-root}/memory/` and explicitly says all worktrees of the same repo share one auto-memory directory. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/paths.ts:80-129]
- Xethryon's memory taxonomy says memories should exclude code patterns, git history, and project structure because those are derivable from current state. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryTypes.ts:1-12] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryTypes.ts:183-202]
- The extraction pipeline asks the model to emit full file writes and a full `MEMORY.md` index update, then writes those outputs directly. The prompt example itself references `project|user|session` types even though the declared taxonomy is `user|feedback|project|reference`, which is a concrete internal contract mismatch. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/memoryTypes.ts:14-21] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/extractMemories.ts:187-233]
- Xethryon's default relevance path is keyword overlap plus recency/type bonuses unless an `llmCall` callback is wired through. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171]
- Spec Kit's save path is intentionally explicit: structured JSON is preferred, the CLI target is authoritative, and indexed content comes from three managed sources rather than free-form repo-global markdown alone. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-84] [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:163-231] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:36-57]

## Analysis
Xethryon's design is appealing because it removes ceremony from the operator's perspective. The cost is that core truth moves into model-authored markdown and a generated index that can drift from its own taxonomy. That trade may be acceptable in a lightweight coding assistant fork, but it is the wrong direction for Spec Kit, whose value proposition depends on durable indexing, explicit routing, and auditable save behavior. The repo-global layer is useful as inspiration for orientation, not as a replacement for the indexed memory substrate.

## Conclusion
confidence: high

finding: Xethryon does not justify a memory-architecture pivot for Spec Kit. The safer takeaway is narrower: ambient project orientation is valuable, but memory authority should remain explicit, validated, and index-backed.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit JSON-primary memory capture via `generate-context.js`, validated frontmatter/metadata, and indexing into SQLite-backed retrieval across memory files, constitutional rules, and spec docs.
- **External repo's approach:** model-authored markdown memories plus a repo-global `MEMORY.md` index under a shared project-memory directory, with keyword-first recall by default.
- **Why the external approach might be better:** it reduces operator ceremony and gives every new session an ambient continuity layer without requiring a spec-folder memory save first.
- **Why system-spec-kit's approach might still be correct:** Spec Kit optimizes for traceability, scoped saves, validation, and retrieval quality. Those goals are undermined by prompt-authored file writes and shared repo-global memory authority.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** none. Preserve Spec Kit's explicit save/index authority; only explore an additive orientation layer.
- **Blast radius of the change:** large if attempted, which is another reason not to pivot.
- **Migration path:** not recommended.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- **Change type:** no change
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for signs that Xethryon's simpler memory path avoided schema drift or contract mismatches better than Spec Kit's pipeline. Instead, I found a type mismatch between the documented taxonomy and the extraction prompt.

## Follow-up questions for next iteration
- If Spec Kit keeps its stronger memory architecture, what is the smallest part of Xethryon's deferred consolidation model worth translating?
