# Iteration 003 — Compression Primitives

## Research question
Which parts of the starter kit's "20K -> 200" context-compression story are actual workflow primitives that `system-spec-kit` could adopt?

## Hypothesis
The real value will be disciplined artifacts and cached summaries, not the literal token numbers.

## Method
Compared the external README's compression claims and `.mdd` artifact framing with the local deep-research command and compaction hook implementation.

## Evidence
- The starter kit claims MDD flips development from "read 40 files" to "read one structured doc" and ties that to a Document -> Audit -> Analyze -> Fix -> Verify workflow. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:116-149]
- The README also says the critical mechanism is writing notes to disk every two features so compaction does not erase audit progress. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/README.md:187-189]
- A real `.mdd` doc is compact and structured: frontmatter names source files, models, test files, and known issues before short prose sections describe purpose and architecture. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.mdd/docs/03-database-layer.md:1-20]
- The local deep-research system already treats externalized state as first-class: it writes findings to files, keeps JSONL state, auto-generates dashboards, and explicitly says "never hold findings in memory." [SOURCE: .opencode/command/spec_kit/deep-research.md:136-143] [SOURCE: .opencode/command/spec_kit/deep-research.md:196-205] [SOURCE: .opencode/command/spec_kit/deep-research.md:263-270] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-24] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89]
- The local compaction hook already merges transcript tail, active files, topics, attention signals, and memory/code-graph context into cached recovery payloads. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:5-8] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-225] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:230-250]

## Analysis
The external repo's real primitives are: one concise structured brief, repeated note-to-disk, and resumable compaction recovery. `system-spec-kit` already has the second and third primitives in more robust form through research state and hook caching. What it lacks is a lightweight, human-scale "compressed brief" artifact that sits between a full spec packet and raw scratch notes. The numeric claim itself is marketing shorthand because token savings depend on topic complexity and on whether the single doc is truly sufficient.

## Conclusion
confidence: high

finding: The starter kit's compression story is mostly real at the workflow level but overstated at the token-accounting level. `system-spec-kit` should borrow the artifact pattern, not the slogan.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- **Change type:** added option
- **Blast radius:** small
- **Prerequisites:** define when a compressed brief is allowed versus when a full spec packet is still mandatory
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for evidence that the starter kit had deeper automatic summary generation beyond the single doc plus notes-to-disk model. The reviewed sources did not show a richer recovery stack than the local hook and state system.

## Follow-up questions for next iteration
What does the external `.mdd` artifact shape get right for human scanability?
Where is the closest local equivalent: research iterations, handover, or memory saves?
Would a compressed brief belong under `research/`, `scratch/`, or a template library?
