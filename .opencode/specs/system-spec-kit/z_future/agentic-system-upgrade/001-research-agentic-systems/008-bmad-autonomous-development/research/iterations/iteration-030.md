# Iteration 030 — Memory Surface Boundaries In The UX Redesign

## Research question
Should `system-spec-kit` fully collapse the `/memory:*` command family into `/spec_kit:*` as part of a thinner operator-facing redesign?

## Hypothesis
No. The common save/resume path should be absorbed into the main lifecycle UX, but dedicated memory search, governance, and learning surfaces still solve a distinct problem that BAD does not cover.

## Method
Compared BAD's lack of a separate memory subsystem to the local memory command taxonomy and its relationship to `spec_kit:resume`.

## Evidence
- BAD has no semantic memory, governed retrieval layer, or separate memory administration surface; it stays thin because it solves a narrower automation problem. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:63-78]
- Local memory docs define four distinct surfaces: `save`, `search`, `manage`, and `learn`, and explicitly keep `/spec_kit:resume` as the user-facing recovery entrypoint. [SOURCE: .opencode/command/memory/README.txt:61-66] [SOURCE: .opencode/command/memory/README.txt:90-113] [SOURCE: .opencode/command/memory/README.txt:308-320]
- The memory command README also documents broad tool coverage and governance/admin responsibilities that are meaningfully different from the spec lifecycle. [SOURCE: .opencode/command/memory/README.txt:248-299]

## Analysis
This is where simplification should stop. BAD does not offer a competing memory architecture; it simply omits the problem. That makes it a bad guide for deleting local memory capabilities. The correct UX move is partial absorption: make save/resume feel natural inside the main lifecycle, but keep advanced search, governance, and learning surfaces available for the broader system that `system-spec-kit` actually is.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Memory is both integrated and separate: `resume` lives in `spec_kit`, but advanced memory workflows still live in `/memory:*`.
- **External repo's equivalent surface:** BAD has no equivalent separate memory plane.
- **Friction comparison:** Local UX is heavier, but that weight reflects real capabilities BAD does not provide. Full collapse would hide too much operational power behind the wrong mental model.
- **What system-spec-kit could DELETE to improve UX:** Delete the expectation that routine users should manually invoke `/memory:save` for normal lifecycle closure when the main workflow can do it implicitly.
- **What system-spec-kit should ADD for better UX:** Add clearer separation between "automatic lifecycle memory behaviors" and "advanced memory operations."
- **Net recommendation:** KEEP

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** hybrid model where common recovery is in `spec_kit`, while broader memory capabilities remain separate.
- **External repo's approach:** no separate memory surface because the underlying problem is not addressed.
- **Why the external approach might be better:** it is simpler if the product scope stays narrow.
- **Why system-spec-kit's approach might still be correct:** local memory search, governance, and learning are distinct capabilities with their own operator value.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** do not fully collapse the memory family; instead, absorb only routine save/resume flows into the main lifecycle UX and keep advanced memory commands explicit.
- **Blast radius of the change:** high if over-collapsed, so keep boundaries deliberate
- **Migration path:** none for the separate advanced memory surfaces; only improve how the common path defaults into them

## Conclusion
confidence: high

finding: Do not fully collapse `/memory:*` into `/spec_kit:*`. The right move is partial UX integration for common save/resume behavior, while keeping advanced memory search, governance, and learning as their own surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/memory/README.txt`
- **Change type:** rejected merge
- **Blast radius:** high
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for evidence that BAD offers a thinner but still equivalent memory-management model. It does not; it simply omits semantic memory and governance concerns entirely.

## Follow-up questions for next iteration
None. Phase 3 reached a stable UX/system-shape conclusion: thinner public surface, fewer visible gates, more bundled defaults, but keep the deeper substrate where it solves genuinely broader problems.
