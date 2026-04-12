# Iteration 026 — Skills System Packaging And Overlap

## Research question
Is the local skill system too fragmented compared with BAD's one-skill packaging, especially across the `sk-code-*` family and adjacent workflow skills?

## Hypothesis
The local skill inventory has useful depth, but too many public names leak capability overlap. BAD suggests a thinner packaging layer with internal routing instead of asking operators to choose among many sibling skills.

## Method
Compared BAD's one-skill module packaging to the local skill registry, loading protocol, and overlapping code/documentation workflow skills.

## Evidence
- BAD exposes one skill entrypoint for its entire domain workflow. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:22-31]
- The local skill system currently documents 20 skill folders, five skill domains, and a loading sequence that begins with routing before the chosen `SKILL.md` is read. [SOURCE: .opencode/skill/README.md:42-59] [SOURCE: .opencode/skill/README.md:80-109] [SOURCE: .opencode/skill/README.md:133-176]
- The `sk-code-opencode`, `sk-code-web`, and `sk-code-full-stack` skills all solve "how do I code in this repo" from slightly different entrypoints, while `sk-doc`, `sk-code-review`, and `system-spec-kit` also participate in overlapping workflow decisions. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:21-28] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:42-59] [SOURCE: .opencode/skill/sk-code-web/SKILL.md:21-36] [SOURCE: .opencode/skill/sk-code-full-stack/SKILL.md:21-39] [SOURCE: .opencode/skill/sk-doc/SKILL.md:21-45]

## Analysis
This is not evidence that the local skills are unnecessary. It is evidence that the packaging layer is too explicit. Operators should not need to decide among multiple "coding" skills up front when the system can route internally. BAD's one-skill module is too thin to copy wholesale, but the packaging lesson is strong: present fewer public entrypoints and do more internal specialization behind them.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators can encounter many named skills, including multiple coding variants, workflow skills, niche improvers, and infrastructure helpers.
- **External repo's equivalent surface:** BAD exposes one skill for one domain and keeps internal specialization hidden.
- **Friction comparison:** Local UX imposes more naming and routing overhead. BAD reduces cognitive branching by turning packaging into a domain-level facade.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that operators must pick among multiple sibling `sk-code-*` surfaces for common implementation work.
- **What system-spec-kit should ADD for better UX:** Add a single `sk-code` facade that internally routes to OpenCode, web, or full-stack guidance based on repo markers and task shape.
- **Net recommendation:** MERGE

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** multiple public skills for adjacent coding and workflow concerns.
- **External repo's approach:** one domain skill with hidden internal complexity.
- **Why the external approach might be better:** it reduces packaging friction and makes the system feel more coherent.
- **Why system-spec-kit's approach might still be correct:** local domains are broader and sometimes do need specialized rules.
- **Verdict:** MERGE
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** keep the existing skill content, but add a smaller facade layer so most operators see fewer public skill choices.
- **Blast radius of the change:** medium
- **Migration path:** begin with docs and routing aliases, then decide whether the underlying skill files should stay separate or become internal references behind the facade.

## Conclusion
confidence: high

finding: The skill system is too fragmented at the packaging layer. `system-spec-kit` should merge public skill UX toward a few domain facades, starting with a unified coding entrypoint over the `sk-code-*` family.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/README.md`
- **Change type:** packaging merge
- **Blast radius:** medium
- **Prerequisites:** define the public facade set and the routing signals behind each one
- **Priority:** should-have

## Counter-evidence sought
I looked for strong evidence that operators benefit from seeing the full current skill taxonomy. The docs explain it well, but they do not show that most users need that many public choices.

## Follow-up questions for next iteration
If public skill packaging should shrink, is the Gate 2 skill routing ceremony itself also too visible and expensive?
