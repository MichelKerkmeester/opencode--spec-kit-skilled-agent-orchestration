# Iteration 004 — Workspace-Scoped Delivery

Date: 2026-04-09

## Research question
Should Public adopt Relay-style workspace-aware delivery filters so future agent messaging stays scoped to the active spec/session boundary?

## Hypothesis
Relay's workspace scoping is a useful safety pattern, but Public only needs a light version tied to spec/session identity.

## Method
Read Relay architecture notes, workspace env injection in the spawner, workspace filtering tests in `routing.rs`, and compared them with Public's resume/bootstrap boundary docs.

## Evidence
- Relaycast is explicitly workspace-based and provides workspace isolation, presence, channels, DMs, threads, and history. [SOURCE: external/ARCHITECTURE.md:274-283]
- The spawner forwards workspace configuration into worker environments via `RELAY_WORKSPACES_JSON`, `RELAY_DEFAULT_WORKSPACE`, and `RELAY_WORKSPACE_ID`. [SOURCE: external/src/spawner.rs:60-90] [SOURCE: external/src/spawner.rs:226-256]
- Routing only delivers to workers whose `workspace_id` matches the inbound event, while legacy workers with no workspace remain permissive. [SOURCE: external/src/routing.rs:58-65] [SOURCE: external/src/routing.rs:74-89] [SOURCE: external/src/routing.rs:441-500]
- Public's resume command already treats spec/session detection as a bounded recovery problem with ordered detection and context-loading rules. [SOURCE: .opencode/command/spec_kit/resume.md:250-260]
- Public's `context-prime` output format already centers on spec folder, blockers, health, and structural context, which is a plausible identity packet for transport scoping later. [SOURCE: .opencode/agent/context-prime.md:118-145]
- Public's parallel guidance already says campaign-style workstreams must stay anchored to one explicit phase or shared-space boundary. [SOURCE: .opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:17-28]

## Analysis
Relay's workspace filter is not just a cloud-tenancy feature; it prevents misdelivery across concurrent teams. Public already has strong identity anchors in spec folders, phase folders, and shared-memory spaces, so it does not need Relay's exact workspace implementation. What it can borrow is the principle: any future live messaging should default to the active spec/session scope and only widen deliberately.

## Conclusion
confidence: medium
finding: Public should prototype workspace-style scoping, but as a spec/session boundary layer rather than a clone of Relaycast workspaces. The safety value is real; the exact transport substrate is not yet necessary.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/resume.md`, `.opencode/agent/context-prime.md`, and a future coordination/session module under `.opencode/skill/system-spec-kit/mcp_server/`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** decide the canonical identity key for live coordination (`spec_folder`, `sessionId`, shared space, or a new transport scope id)
- **Priority:** nice-to-have (prototype later)

## Counter-evidence sought
Looked for evidence that Public already needs cross-spec live messaging; none found. The current benefit is mainly future safety, not present pain.

## Follow-up questions for next iteration
- Can provider capability docs express transport scope without implementing it?
- Which spawn surfaces would need to carry a future spec/session scope id?
- Is scope identity better attached to the conductor or each spawned worker?
