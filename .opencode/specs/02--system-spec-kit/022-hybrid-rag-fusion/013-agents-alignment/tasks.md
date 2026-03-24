---
title: "Tasks: 013 — Agent Alignment"
description: "Truth-reconciliation tasks for updating the 013 packet and the scoped runtime-facing agent docs to the live runtime lineage model."
---
<!-- SPECKIT_LEVEL: 2 -->
# Tasks: 013 — Agent Alignment
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- alias: Audit Current Runtime Reality -->

- [x] T001 Read the canonical `013` packet and identify stale copy-model language (`./spec.md`, `./plan.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`)
- [x] T002 Verify the two source families at `.opencode/agent/*.md` and `.opencode/agent/chatgpt/*.md`
- [x] T003 Verify runtime targets for Claude, Codex, and Gemini, including `.gemini -> .agents`
- [x] T004 Confirm 9-file family counts across base, ChatGPT, Claude, Codex, and Gemini paths
- [x] T004a Identify scoped runtime-facing drift in Gemini delegation guidance and write-agent projections
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- alias: Rewrite the Canonical Packet -->

- [x] T005 Rewrite `spec.md` around dual-source lineage and runtime-facing path guidance (`./spec.md`)
- [x] T006 Rewrite `plan.md` as a documentation-only reconciliation plan (`./plan.md`)
- [x] T007 Rewrite `tasks.md` to reflect audit, rewrite, and verification work instead of bulk runtime sync claims (`./tasks.md`)
- [x] T008 Rewrite `checklist.md` to verify lineage, naming, path, and scope integrity (`./checklist.md`)
- [x] T009 Rewrite `implementation-summary.md` so it reports packet reconciliation instead of claiming fresh runtime sync work (`./implementation-summary.md`)
- [x] T009a Reconcile `.gemini/workflows/delegate_agent.md` and the scoped write-agent projections with the verified lineage model
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Remove stale research.md naming from canonical packet docs
- [x] T011 Remove stale single-source/copy-to-every-runtime language from canonical packet docs
- [x] T012 Run strict validation on `013-agents-alignment`
- [x] T013 Re-read the packet for internal consistency and runtime-path accuracy
- [x] T014 Re-read the scoped runtime-facing docs for path/routing consistency after the closeout patch
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The packet documents dual-source lineage clearly
- [x] The packet uses deep-research.md naming only
- [x] The packet documents Codex and Gemini runtime lineage accurately
- [x] The packet distinguishes scoped runtime-doc closeout from bulk runtime sync
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `./spec.md`
- **Plan**: See `./plan.md`
- **Checklist**: See `./checklist.md`
- **Implementation Summary**: See `./implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
