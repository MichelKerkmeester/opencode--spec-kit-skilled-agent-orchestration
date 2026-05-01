# Iteration 018 — Capability Profiles Versus 43-Tool Exposure

Date: 2026-04-10

## Research question
Do Agent Lightning's optional dependency groups suggest that `system-spec-kit` should package or expose its capabilities in smaller profiles instead of one broad all-up surface?

## Hypothesis
The external repo likely segments capability sets cleanly by optional groups and specialized integrations. If so, Public could benefit from similar capability profiling for commands, MCP tool exposure, and operator docs.

## Method
I reviewed Agent Lightning's optional dependency groups and contributor guidance, then compared them against `system-spec-kit`'s memory tool inventory and wide operator command map.

## Evidence
- Agent Lightning separates optional capabilities into explicit groups such as `apo`, `verl`, `weave`, `mongo`, and multiple training or hardware profiles. [SOURCE: external/pyproject.toml:30-49] [SOURCE: external/pyproject.toml:53-113]
- The external contributor guide tells maintainers to mention optional groups like VERL, APO, and GPU when they are relevant, rather than assuming one universal capability set. [SOURCE: external/AGENTS.md:11-16]
- `system-spec-kit`'s memory server currently documents 43 tools across orchestration, mutation, lifecycle, shared memory, analysis, and maintenance layers. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:95-140]
- The operator quick-reference in `AGENTS.md` also exposes many command families spanning research, implementation, analysis, shared memory, and database maintenance. [SOURCE: AGENTS.md:132-155]

## Analysis
The external repo uses optional dependency groups as a boundary-setting device: the platform remains broad, but users only load and think about the slices they need. Public currently has the opposite feel. Capabilities are well documented, yet the default mental model is still "the whole system is present at once."

That does not mean the MCP server must be physically split immediately. But it does suggest that capability profiles would improve both rollout safety and operator clarity. A smaller `core` profile plus clearly named advanced profiles would make the system feel more intentional and easier to adopt incrementally.

## Conclusion
confidence: high

finding: `system-spec-kit` should refactor its capability exposure into clearer profiles. The memory server and command system can remain unified internally for now, but the user-facing model should distinguish `core` from heavier areas such as evaluation, governance, shared memory, and graph tooling.

## Adoption recommendation for system-spec-kit
- **Target file or module:** memory/command exposure model
- **Change type:** architectural refactor
- **Blast radius:** medium
- **Prerequisites:** define stable profile boundaries and decide whether profiling is documentation-only, runtime-flagged, or installation-level
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** One broad surface exposes many tool and command families together.
- **External repo's approach:** Capability slices are grouped explicitly through optional dependencies and feature-specific guidance.
- **Why the external approach might be better:** It reduces mental overload, makes rollout safer, and gives operators a smaller starting surface.
- **Why system-spec-kit's approach might still be correct:** Public benefits from a unified runtime when advanced flows need to compose features dynamically.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Introduce named capability profiles such as `core`, `research`, `governance`, `eval`, and `shared-memory`, and update docs plus runtime flags to reflect those slices.
- **Blast radius of the change:** medium
- **Migration path:** Begin with docs and feature flags, then optionally add runtime profile manifests or filtered command/help surfaces later.

## Counter-evidence sought
I looked for evidence that Agent Lightning's groups are only dependency-management noise and not part of the user experience, but the contributor guide explicitly calls them out. I also checked whether Public already has a strong notion of profiles and found more of a tool inventory than a profile model.

## Follow-up questions for next iteration
- Which current Public surfaces belong in `core` versus advanced profiles?
- Can capability profiles coexist with a simplified operator front door?
- Are there high-risk tools that should move behind explicit enablement rather than only documentation?
