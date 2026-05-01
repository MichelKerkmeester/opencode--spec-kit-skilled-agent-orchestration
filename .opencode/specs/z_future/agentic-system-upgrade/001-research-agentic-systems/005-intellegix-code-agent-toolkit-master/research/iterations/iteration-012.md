# Iteration 012 — Operational State Versus Archival Memory

Date: 2026-04-10

## Research question
Should `system-spec-kit` stop treating long-term memory capture as a built-in terminal phase of every deep-research run, and instead separate operational loop state from archival context more explicitly?

## Hypothesis
Yes. The external repo shows that loop continuity can stay operationally simple when state, budget, and resumability live in one runtime boundary. `system-spec-kit` should keep its memory system, but it should not make archival memory behave like active loop state.

## Method
I compared the external loop's runtime state model with `system-spec-kit`'s deep-research workflow, memory system architecture, and save workflow. I focused on where loop completion depends on memory-specific machinery rather than just packet-local research artifacts.

## Evidence
- `[SOURCE: external/automated-loop/state_tracker.py:65-77]` The external loop persists a compact runtime state model with iteration count, status, cycle history, metrics, and `last_session_id`.
- `[SOURCE: external/automated-loop/state_tracker.py:116-125]` Runtime state is saved directly to disk as one canonical state file.
- `[SOURCE: external/automated-loop/state_tracker.py:137-179]` Each cycle updates state, metrics, and resumable session identity in the same operational boundary.
- `[SOURCE: external/automated-loop/state_tracker.py:191-209]` Budget enforcement is also evaluated against the same persisted runtime state.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:147-154]` The local workflow overview includes a final `Save` phase after initialization, looping, and synthesis.
- `[SOURCE: .opencode/command/spec_kit/deep-research.md:196-209]` The command explicitly couples deep research completion to memory retrieval/bootstrap up front and `generate-context.js` at the end.
- `[SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-27]` The memory subsystem is a separate architecture with an MCP server, SQLite/vector database, constitutional rules, and generation scripts.
- `[SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145]` The memory layer exposes 43 tools spanning orchestration, mutation, lifecycle, shared spaces, analysis, and maintenance.
- `[SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:17-39]` Memory save is framed as a governed multi-path system rather than a minimal packet export.
- `[SOURCE: .opencode/skill/system-spec-kit/references/memory/save_workflow.md:148-152]` The slash-command save path requires the AI to analyze the conversation, produce structured JSON, invoke `generate-context.js`, and then write into `memory/`.

## Analysis
The external toolkit is intentionally narrow: runtime state is for running the loop, and handoffs are for humans. `system-spec-kit` aims higher by preserving reusable context across many packets and sessions. That broader goal is valid. The problem is boundary confusion. Deep research already has rich packet-local artifacts: JSONL state, strategy, findings registry, dashboard, iteration files, and canonical synthesis. Treating memory save as a built-in final phase makes archival context feel like part of the loop's operational correctness rather than a separate export or knowledge-preservation step.

That coupling creates cost and ceremony. It also obscures the real contract of a successful research run: the packet-local research artifacts are the canonical output; memory is an indexing and retrieval convenience layered on top. The external repo's simplicity suggests a cleaner split. Keep operational loop state inside the research packet. Keep long-term memory as an optional or policy-driven export from that state, not as a required part of the loop's core lifecycle.

## Conclusion
confidence: high

finding: `system-spec-kit` should refactor deep-research and deep-review so packet-local research artifacts are the canonical completion boundary, while memory save becomes an explicit export step triggered by policy, user intent, or post-closeout automation.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/deep-research.md`, `.opencode/command/spec_kit/deep-review.md`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`, `.opencode/skill/system-spec-kit/references/memory/memory_system.md`
- **Change type:** architectural shift
- **Blast radius:** medium
- **Prerequisites:** define when memory export is automatic, optional, or suppressed for research-only packets
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** The deep-research command integrates memory retrieval at startup and memory save at closeout, while the broader memory platform carries much more functionality than the loop itself needs to run.
- **External repo's approach:** The loop keeps runtime state, metrics, and resume data in a small operational state boundary and uses separate handoff artifacts for continuity.
- **Why the external approach might be better:** It keeps the loop's success contract small and makes runtime debugging easier because operational state is not mixed with archival indexing concerns.
- **Why system-spec-kit's approach might still be correct:** Cross-session semantic retrieval is a genuine advantage in a large packet ecosystem and should not be thrown away.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Make `research/` artifacts authoritative for loop completion, add a policy flag for post-run memory export, and stop describing archival memory as part of the loop's core success path.
- **Blast radius of the change:** medium
- **Migration path:** First update docs and command contracts, then teach reducers/commands to emit an explicit `memory_export` event only when export actually runs.

## Counter-evidence sought
I looked for evidence that the loop truly needs semantic memory writes to be considered complete. I found retrieval and save hooks, but the packet-local research artifacts already capture the operational record.

## Follow-up questions for next iteration
- If memory export becomes optional, what defaults should apply for deep-review versus deep-research?
- Should packet closeout commands, rather than deep-loop commands, own archival export?
- Does the current loop architecture make this boundary hard to implement cleanly?
