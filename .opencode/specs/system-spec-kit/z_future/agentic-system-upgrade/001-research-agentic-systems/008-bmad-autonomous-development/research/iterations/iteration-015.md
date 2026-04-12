# Iteration 015 — Memory Architecture Versus Packet-Local State

## Research question
Should `system-spec-kit` simplify away its global memory architecture in favor of BAD-style lightweight local state?

## Hypothesis
BAD's lack of a semantic memory layer is a scope decision, not evidence that the local memory architecture should be replaced.

## Method
Compared BAD's execution-state surface with the local Spec Kit Memory architecture and the current deep-research packet-state model.

## Evidence
- BAD stores module configuration in `_bmad/config.yaml`, relies on planning artifacts like `sprint-status.yaml`, and does not expose a semantic memory, retrieval, or governance subsystem in the repo snapshot. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:10-14] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:25-32] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:63-78]
- `system-spec-kit`'s memory system is intentionally broader: MCP server, SQLite plus FTS5 plus vector embeddings, constitutional rules, generated memory files, spec-doc indexing, and 43 MCP tools. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:38-57] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]
- Local deep-research already uses packet-local state files as the authoritative loop state, with memory as an overlay for discovery and resume, not as the live loop substrate. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-29] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:65-110] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:194-197]

## Analysis
The local system already has the right architectural split for this comparison: packet-local files for execution continuity, global memory for cross-session retrieval, governance, and discovery. BAD shows that some execution modules can function without global memory, but that is because they intentionally limit their problem boundary. Replacing the local memory system with BAD-style local state would discard capabilities the repo clearly wants.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** global semantic memory plus packet-local state for live workflow continuity.
- **External repo's approach:** only local config and planning artifacts; no semantic memory subsystem.
- **Why the external approach might be better:** it keeps execution modules easier to reason about when cross-session semantic retrieval is not required.
- **Why system-spec-kit's approach might still be correct:** the local repo explicitly needs cross-session recall, constitutional surfacing, spec-doc indexing, and governed retrieval.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** N/A
- **Blast radius of the change:** none
- **Migration path:** N/A

## Conclusion
confidence: high

finding: BAD does not justify replacing Spec Kit Memory. It reinforces the current local split: packet-local files should remain the source of truth for active loops, while the global memory system remains the retrieval and governance layer.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/memory/memory_system.md`
- **Change type:** rejected
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for any BAD evidence of cross-session semantic retrieval, constitutional memory, or governed sharing. None appears in this snapshot, which makes the systems non-equivalent by design.

## Follow-up questions for next iteration
If the memory split is already sound, does BAD still suggest a cleaner way to package local agent topology so users do not have to think in terms of the full internal roster?
