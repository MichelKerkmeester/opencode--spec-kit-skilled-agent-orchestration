# Iteration 003 — Git as Memory Boundary

## Research question
How reliable is git history as Ralph's primary memory layer, and what selective git metadata should `system-spec-kit` capture instead?

## Hypothesis
Git is a good audit trail and rollback surface, but a poor primary retrieval interface for autonomous restarts.

## Method
Read Ralph's commit/progress contract in `external/prompt.md` and `external/README.md`, then compared it with the structured JSON-primary save contract in `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` and `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`.

## Evidence
- Ralph requires every passing iteration to commit all changes with a story-specific message and then mark the story complete in `prd.json`. [SOURCE: external/prompt.md:13-17]
- Ralph's debugging guidance assumes users inspect `prd.json`, `progress.txt`, and recent `git log` output together to recover state. [SOURCE: external/README.md:209-221]
- The README frames git history as one of only three persistence channels between fresh runs. [SOURCE: external/README.md:165-168]
- `system-spec-kit`'s save workflow is explicitly JSON-primary: the AI should pass structured session data into `generate-context.js`, and an explicit CLI target outranks inference. [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:15-22] [SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:182-239]
- `generate-context.ts` already accepts structured data such as tool calls, exchanges, and preflight/postflight metrics, but the documented payload does not include branch, commit range, or last successful verification commit. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:75-124]

## Analysis
Git works for Ralph because the state machine is tiny: "which story is next?" plus "what changed last time?" In `system-spec-kit`, git alone cannot answer intent-aware questions such as "what decision was made?", "which validation failed?", or "which packet doc should be loaded first?" The opportunity is to borrow git's audit precision without demoting semantic memory: capture a few branch/commit references inside memory artifacts so search results can point to the exact implementation boundary that the narrative summary describes.

## Conclusion
confidence: medium

finding: Git is reliable as an audit substrate, not as the primary memory substrate. `system-spec-kit` should keep semantic memory as the main continuity layer, but enrich saved context with branch and commit metadata so recovered memories are easier to map back to code history.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- **Change type:** modified existing
- **Blast radius:** small
- **Prerequisites:** decide a minimal git metadata schema (`branch`, `HEAD`, optional commit range)
- **Priority:** should-have

## Counter-evidence sought
I looked for existing git fields in the documented JSON payload and found none. The save contract covers tool calls and exchanges, but not branch or commit lineage. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:85-124]

## Follow-up questions for next iteration
- Does Ralph's append-only `progress.txt` cover a gap that git plus semantic memory still leaves open?
- Should git metadata be stored in memory frontmatter, anchors, or generated summary sections?
- How much of Ralph's continuity value comes from the progress log rather than commit history?
