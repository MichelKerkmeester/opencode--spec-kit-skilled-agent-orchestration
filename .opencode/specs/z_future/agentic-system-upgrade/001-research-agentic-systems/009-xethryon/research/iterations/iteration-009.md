# Iteration 009 — Swarm Coordination as Packet Artifacts

Date: 2026-04-09

## Research question
Can Xethryon's file-based swarm mailbox and task-board model improve Spec Kit's multi-agent workflows if translated into packet-local artifacts rather than a live IPC runtime?

## Hypothesis
The runtime mailbox itself is probably too application-specific, but the auditable task-board shape looks portable for deep-research and deep-review packets.

## Method
I traced Xethryon's swarm storage paths, mailbox, task board, spawn flow, and team tools, then compared that with Spec Kit's orchestrator constraints and deep-research state files.

## Evidence
- Xethryon stores all swarm coordination data under `.opencode/swarm/{team}/`, with separate `config.json`, inbox JSON files, and `tasks/tasks.json`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/paths.ts:1-58]
- Mailboxes are simple JSON arrays guarded by `.lock` files, and message formatting includes explicit idle notifications, shutdown requests, and task-assignment parsing. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/mailbox.ts:1-17] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/mailbox.ts:52-108] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/mailbox.ts:140-214]
- The shared task board is a locked JSON file with owners, dependencies, blocking relationships, and status transitions. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/tasks-board.ts:1-30] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/tasks-board.ts:36-157]
- Team creation spawns independent sub-sessions and directs the lead to coordinate through the mailbox. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/team_create.ts:25-87] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/send_message.ts:15-60]
- The spawn backend creates an in-process sub-session, runs `SessionPrompt.prompt()` in the background, and notifies the lead on completion or failure through mailbox messages. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/spawn.ts:80-139] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/spawn.ts:141-231]
- Spec Kit's orchestrator forbids nested dispatch and emphasizes a single accountable orchestrator, while the deep-research workflow already externalizes packet state into JSON/Markdown files under `research/`. [SOURCE: .opencode/agent/orchestrate.md:40-47] [SOURCE: .opencode/agent/orchestrate.md:119-127] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:218-239]

## Analysis
The portable idea is not "run swarm inside Spec Kit." Spec Kit already has an orchestration philosophy: explicit ownership, shallow delegation, and packet-local evidence. What Xethryon adds is a crisp artifact grammar for coordination state: tasks, dependencies, inbox-style status, and idle/failure notices. Those could be mapped into packet-local files under `research/` or `review/` without introducing a new runtime IPC subsystem. That would also respect phase overlap: the live orchestration runtime belongs more to packet `002`, while phase `009` can legitimately own the artifact pattern for auditable coordination state.

## Conclusion
confidence: medium

finding: Xethryon's swarm runtime should not be ported as-is, but its task-board artifact model is worth prototyping inside Spec Kit's research/review packets. The value is durable coordination state, not live mailbox plumbing.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** align the artifact schema with orchestrator single-hop rules and tag the work as phase-`002` overlap for runtime questions
- **Priority:** nice-to-have

## Counter-evidence sought
I looked for an existing task-board artifact in Spec Kit's research packet workflow. I found config/state/strategy/registry/dashboard files, but not an explicit dependency-tracked task board.

## Follow-up questions for next iteration
- What research workflow change would best force claim verification when external docs and code disagree?
- Should a packet-local task board be shared by deep-review as well as deep-research?
- Can the docs-vs-code verification finding be framed as a must-have without requiring a runtime rewrite?
