# Iteration 020 — Core Versus Extension Boundary

## Research question
Should future BAD-like sprint automation be built into `system-spec-kit` core, or layered on top as a separate extension that consumes existing primitives?

## Hypothesis
BAD works precisely because it is a specialized module on top of another planning substrate. The equivalent move in this repo would be an optional extension, not more complexity in core `spec_kit` and `memory`.

## Method
Compared BAD's module boundary to the current local command, memory, and orchestration boundaries.

## Evidence
- BAD describes itself as a BMad Method module, not a whole-platform replacement. It assumes planning artifacts, GitHub state, and backlog structure already exist before it begins orchestration. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:9-20] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:25-32]
- BAD's plugin/module packaging keeps the specialization explicit: one module, one skill path, one execution surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/.claude-plugin/marketplace.json:1-24]
- Local core surfaces already cover a broad general-purpose lifecycle: planning, implementation, deep research, deep review, debugging, handover, resume, and a separate memory system with retrieval, governance, and maintenance tools. [SOURCE: .opencode/command/spec_kit/README.txt:43-76] [SOURCE: .opencode/command/memory/README.txt:38-66] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]

## Analysis
This is the clearest architecture lesson from BAD. Specialized automation is easiest to keep coherent when it is packaged as a specialized layer. If `system-spec-kit` absorbs sprint automation directly into core commands, it risks mixing another domain's assumptions into already broad general-purpose surfaces. If it instead ships sprint automation as an optional extension that consumes phase docs, git/GitHub state, memory, and search primitives, it can keep both layers simpler.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** broad reusable core with commands, memory, and agent primitives that many workflows already depend on.
- **External repo's approach:** domain-specific module layered on top of a separate planning system.
- **Why the external approach might be better:** it preserves a clean boundary between general-purpose substrate and specialized execution automation.
- **Why system-spec-kit's approach might still be correct:** putting everything in core can reduce cross-module integration work if the new domain becomes universally required.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** prototype any future sprint-automation feature as a separate skill or command pack that depends on existing spec/phase artifacts and memory/search services, rather than expanding core `spec_kit` and `memory` contracts first.
- **Blast radius of the change:** architectural
- **Migration path:** create an extension surface first, prove its interfaces, then upstream only the stable primitives it genuinely needs from core.

## Conclusion
confidence: high

finding: BAD's biggest architecture lesson is boundary discipline. If `system-spec-kit` wants BAD-like sprint automation, it should build it as a domain extension on top of current primitives rather than pushing more specialized behavior into the core command and memory systems.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`
- **Change type:** architectural shift
- **Blast radius:** architectural
- **Prerequisites:** define the minimum stable interfaces that an extension-level sprint runner would need from core
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that BAD succeeds by being deeply fused into BMad's core planning substrate. The repo instead frames BAD as an add-on module layered on top of that substrate.

## Follow-up questions for next iteration
None. Phase 2 converged on the main architecture question: simplify operator UX and loop contracts, but keep core documentation/memory/validation boundaries intact and layer future sprint automation as an extension.
