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
- [x] T004 Confirm 10-file family counts across base, ChatGPT, Claude, Codex, and Gemini paths
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

### Phase 4: Content Alignment Review & Remediation (2026-03-25)
<!-- alias: Deep review of agent content vs 022-hybrid-rag-fusion changes -->

- [x] T015 Deep review of 10 agents × 5 runtimes via cli-copilot (GPT-5.4 high + GPT-5.3-Codex xhigh) — review-report.md in scratch/
- [x] T016 Remove @explore from orchestrate LEAF lists and NDP examples (all 5 runtimes)
- [x] T017 Add @deep-review to orchestrate LEAF lists (all 5 runtimes)
- [x] T018 Fix dead `sk-code` path → `sk-code--review` in orchestrate resource tables (all 5 runtimes)
- [x] T019 Add all 6 memory commands to orchestrate suggestion and resource tables (all 5 runtimes)
- [x] T020 Add `/memory:shared` to speckit command tables (all 5 runtimes)
- [x] T021 Fix `/memory:learn` label in codex speckit ("Explicit learning" → "Constitutional memory manager")
- [x] T022 Port canonical claim-adjudication packet into all 5 deep-review agents (via copilot Wave A+B)
- [x] T023 Port canonical review JSONL schema into all 5 deep-review agents (via copilot Wave A+B)
- [x] T024 Replace 5-dimension scorecard with 4-dimension canonical taxonomy in codex deep-review
- [x] T025 Update spec folder docs to reflect content alignment pass

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The packet documents dual-source lineage clearly
- [x] Active lineage naming standardized on deep-research; legacy naming appears only in historical discussion
- [x] The packet documents Codex and Gemini runtime lineage accurately
- [x] The packet distinguishes scoped runtime-doc closeout from bulk runtime sync
- [x] 6 of 7 P1 content alignment findings remediated across 15 agent files (1 P1 deferred: memory/ EXCLUSIVITY wording tightening)
- [x] Deep-review schemas aligned with canonical loop_protocol.md and state_format.md
- [x] Memory command surface complete (6 commands) in orchestrate and speckit agents
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
