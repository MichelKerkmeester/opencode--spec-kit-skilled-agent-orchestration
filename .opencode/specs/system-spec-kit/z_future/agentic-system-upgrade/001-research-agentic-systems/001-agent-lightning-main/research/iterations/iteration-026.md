# Iteration 026 — Keep Externalized Loop State, Merge Only Session Roles

Date: 2026-04-10

## Research question
Is the LEAF-plus-externalized-state pattern for deep research and deep review still the right model, or should Agent Lightning's runtime coordination push `system-spec-kit` toward a different iteration architecture?

## Hypothesis
The packet-local JSONL/state-file pattern is still right for Public. The comparison likely supports keeping externalized loop state while simplifying the surrounding session-role topology.

## Method
I compared Public's deep-loop state contracts with Agent Lightning's artifact-rich example flows and trainer/store coordination surfaces.

## Evidence
- The deep-research workflow declares explicit state paths for config, JSONL state log, strategy, registry, dashboard, iteration files, and the final `research.md`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89]
- The deep-research agent is built around externalized state: read JSONL plus strategy, execute one cycle, then append one line to `deep-research-state.jsonl`. [SOURCE: .opencode/agent/deep-research.md:53-57] [SOURCE: .opencode/agent/deep-research.md:168-168] [SOURCE: .opencode/agent/deep-research.md:291-331]
- The deep-review agent follows the same reducer-owned, append-only pattern for review JSONL and iteration artifacts. [SOURCE: .opencode/agent/deep-review.md:45-68] [SOURCE: .opencode/agent/deep-review.md:232-232] [SOURCE: .opencode/agent/deep-review.md:384-451]
- Agent Lightning's Claude Code example also treats outputs as explicit artifacts: span streams, HuggingFace datasets, container logs, and evaluation reports. [SOURCE: external/examples/claude_code/README.md:5-12] [SOURCE: external/examples/claude_code/README.md:108-112]
- The `tinker` hello example supports both distributed execution and an integrated `oneclick` mode that still revolves around explicit store, runner, and trainer coordination. [SOURCE: external/examples/tinker/hello.py:22-29] [SOURCE: external/examples/tinker/hello.py:154-185]

## Analysis
The external repo does not suggest that Public should abandon packet-local artifact state. If anything, it reinforces the value of explicit run artifacts when workflows are long, parallel, or inspectable after the fact. Public's JSONL-plus-iteration-file model is especially well suited to research and review packets because it keeps reasoning history durable and inspectable without requiring a live service.

Where simplification is warranted is around the session roles that orbit that state. Public likely does not need so many distinct startup, retrieval, and handover identities wrapped around a loop model that is already strong.

## Conclusion
confidence: high

finding: `system-spec-kit` should keep the externalized-state architecture for deep research and deep review, while simplifying the session-role layer around it rather than the loop-state layer itself.

## Adoption recommendation for system-spec-kit
- **Target file or module:** deep-loop architecture and surrounding session-role model
- **Change type:** boundary-setting keep
- **Blast radius:** medium
- **Prerequisites:** identify session-role simplifications that do not compromise reducer-owned state, artifact traceability, or append-only history
- **Priority:** should-have

## UX / System Design Analysis

- **Current system-spec-kit surface:** Deep loops expose explicit config, JSONL, strategy, registry, dashboard, and iteration artifacts, with separate supporting session roles around them.
- **External repo's equivalent surface:** Agent Lightning also leans on explicit runtime artifacts and logs, but presents execution choices more simply through examples and trainer flows.
- **Friction comparison:** The artifact model itself is not the main source of friction. Public's friction comes more from the number of surrounding roles and entrypoints than from the existence of state files.
- **What system-spec-kit could DELETE to improve UX:** Delete redundant session-role distinctions that exist around an already solid loop-state model.
- **What system-spec-kit should ADD for better UX:** Add a compact run-status card that summarizes current loop state without making users inspect raw JSONL unless they want to.
- **Net recommendation:** KEEP

## Counter-evidence sought
I looked for evidence that Agent Lightning's service-oriented runtime would make Public's file-based loop state obsolete, but its own examples still foreground durable outputs, logs, and replayable artifacts. The stronger contrast is in presentation, not in the need for explicit state.

## Follow-up questions for next iteration
- Which session-support roles can shrink without touching deep-loop correctness?
- Should loop dashboards become the default operator surface for research/review progress?
- Can Public keep append-only auditability while making loop state feel less raw?
