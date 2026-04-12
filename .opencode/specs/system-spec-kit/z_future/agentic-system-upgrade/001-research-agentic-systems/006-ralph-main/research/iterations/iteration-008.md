# Iteration 008 — Guidance Propagation Surfaces

## Research question
How do Ralph's `AGENTS.md` and `CLAUDE.md` update rules propagate reusable learnings, and how should `system-spec-kit` promote similar learnings into always-surface guidance?

## Hypothesis
Ralph's main insight is not "edit AGENTS every time," but "promote reusable learnings into a file the next agent is guaranteed to see."

## Method
Compared Ralph's prompt instructions for updating `AGENTS.md` and `CLAUDE.md` with `system-spec-kit`'s constitutional guidance surfaces and the deep-research agent contract.

## Evidence
- The Amp prompt tells the agent to update nearby `AGENTS.md` files only when a genuinely reusable pattern, gotcha, dependency, or testing rule was discovered. [SOURCE: external/prompt.md:50-74]
- The Claude variant mirrors the same behavior for nearby `CLAUDE.md` files. [SOURCE: external/CLAUDE.md:47-71]
- Ralph's README treats these guidance-file updates as critical because future iterations automatically read them. [SOURCE: external/README.md:185-188]
- The repo-level `AGENTS.md` distills the same idea into a short Patterns section: fresh instance, git/progress/prd memory, small stories, and always update AGENTS with discovered patterns. [SOURCE: external/AGENTS.md:42-47]
- `system-spec-kit` already has always-surface constitutional guidance for gate enforcement and tool routing. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-68] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:31-41]
- The memory system explicitly says constitutional memories are auto-indexed, exempt from decay, and always surfaced at the top of search results. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:83-89]
- The deep-research agent currently writes iteration findings and JSONL state, but it does not have an explicit step for flagging "candidate constitutional learnings" for later promotion. [SOURCE: .opencode/agent/deep-research.md:121-167]

## Analysis
Ralph's propagation mechanism works because it forces reusable learnings into an always-read surface immediately adjacent to the work. `system-spec-kit` already has a stronger equivalent surface in constitutional memory, but the promotion path is manual and implicit. The practical adoption is to formalize a promotion checkpoint: after research or implementation, decide whether a finding belongs in memory only, a reference doc, or constitutional guidance.

## Conclusion
confidence: medium

finding: `system-spec-kit` should adopt Ralph's promotion instinct, but map it onto its own hierarchy. The right move is not indiscriminate AGENTS edits; it is a structured "promote to constitutional/reference?" checkpoint that routes reusable learnings into the strongest always-surface artifact available.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define a lightweight decision rubric for memory-only vs reference vs constitutional promotion
- **Priority:** should-have

## Counter-evidence sought
I looked for an existing post-iteration promotion decision in the deep-research agent contract and did not find one; the agent writes findings but does not classify durable learnings into the repo's guidance hierarchy. [SOURCE: .opencode/agent/deep-research.md:121-167]

## Follow-up questions for next iteration
- How much of Ralph's one-story discipline comes from prompt wording alone?
- Where should `system-spec-kit` enforce single-task focus: templates, commands, or both?
- Could overly broad tasks be the reason future iterations need heavier continuation machinery?
