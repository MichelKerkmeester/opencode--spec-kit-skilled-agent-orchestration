# Iteration 026 — The Skills Catalog Needs Fewer Visible Buckets

Date: 2026-04-10

## Research question
Is the `system-spec-kit` skill system too fragmented at the operator surface compared with Xethryon's bundled-skill model?

## Hypothesis
Yes at the surface, no in the underlying capability graph. The issue is too many visibly distinct buckets, especially across the `sk-code-*` family.

## Method
I compared the local skill catalog and its routing layers with Xethryon's bundled skill registration model and smaller public skill set.

## Evidence
- `system-spec-kit` already acts like an umbrella skill with mandatory routing into spec folder, memory, validation, and command workflows. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:10-13] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:32-59] [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:88-128]
- `sk-code-opencode` adds another routing layer over language families and intent categories. [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:10-15] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:65-85] [SOURCE: .opencode/skill/sk-code-opencode/SKILL.md:87-175]
- `sk-doc` is also broad and routes across documentation, component creation, and packaging tasks. [SOURCE: .opencode/skill/sk-doc/SKILL.md:10-16] [SOURCE: .opencode/skill/sk-doc/SKILL.md:148-209]
- Xethryon exposes a smaller bundled skill set and registers those skills into the command surface instead of asking the user to reason about many overlapping skill families. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:211-225] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/command/index.ts:165-237]

## Analysis
The local system has earned much of its internal specialization, but the naming and routing surface is too granular for ordinary use. A user should not need to care whether code standards currently live in `sk-code-opencode`, `sk-code-web`, or `sk-code-full-stack`. That distinction can stay internal. Xethryon's smaller bundled set feels simpler because it packages capabilities at the job-to-be-done level rather than the ontology-of-skills level.

The best move is surface consolidation: keep specialist instructions, but route them through fewer visible umbrella names.

## UX / System Design Analysis

- **Current system-spec-kit surface:** many skills with overlapping scope, especially in code and workflow guidance.
- **External repo's equivalent surface:** a smaller bundled-skill set presented as job-oriented commands.
- **Friction comparison:** `system-spec-kit` offers more precision but forces the operator to care about taxonomy; Xethryon packages more of that choice behind a simpler surface.
- **What system-spec-kit could DELETE to improve UX:** the need for users to distinguish among multiple code-family skills in common workflows.
- **What system-spec-kit should ADD for better UX:** umbrella routing labels such as one visible `sk-code` family backed by hidden specialist overlays.
- **Net recommendation:** MERGE

## Conclusion
confidence: medium

finding: consolidate the visible skill catalog into fewer umbrella surfaces while preserving the current specialist instructions underneath. The highest-value merge area is the `sk-code-*` family.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** many named skills, several of which are routers over other specialized guidance.
- **External repo's approach:** smaller bundled-skill set with more job-oriented packaging.
- **Why the external approach might be better:** lower taxonomy overhead for users.
- **Why system-spec-kit's approach might still be correct:** specialist standards still matter and should remain internally addressable.
- **Verdict:** MERGE
- **If MERGE — concrete proposal:** keep current skill content, but expose fewer top-level names and route to specialist overlays automatically.
- **Blast radius of the change:** medium
- **Migration path:** begin with aliasing and documentation changes before any deeper skill-file restructuring.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define which skills stay user-facing versus implementation-only
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for places where the current many-skill surface clearly improves operator confidence. Most gains came from the content itself, not the number of named surfaces.

## Follow-up questions for next iteration
- If visible skill buckets are too granular, is Gate 2's explicit advisor step also overexposed to the operator?
