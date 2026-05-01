<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: @code Sub-Agent — Spec, Research, Implementation [template:level_3/tasks.md]"
description: "Ordered tasks T001-T039 across three canonical phases (Setup, Implementation, Verification)."
trigger_phrases:
  - "code agent tasks"
  - "@code implementation tasks"
  - "deep research dispatch tasks"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/022-mcp-coco-integration/059-agent-implement-code"
    last_updated_at: "2026-05-01T18:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase 2 research converged; Phase 3 implementation underway; renumbered to canonical phase headers"
    next_safe_action: "Continue Phase 3 — finish T029-T035"
    blockers: []
    key_files:
      - .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js
      - .opencode/skill/system-spec-kit/scripts/spec/validate.sh
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-01-spec-scaffold"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---

# Tasks: @code Sub-Agent

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

Task format: `T### [P?] Description (file path)`. Priority: **P0** = blocker, **P1** = required, **P2** = nice-to-have.

The packet's natural three phases (Spec Scaffolding, Research Dispatch, Synthesis + Authoring + Sync) are mapped onto the canonical Setup → Implementation → Verification triad below:

- **Setup** — spec scaffolding, parent registration, baseline metadata.
- **Implementation** — research dispatch + per-stream convergence + cross-stream synthesis + agent authoring + sibling-doc sync. (Research is treated as implementation here because its findings DRIVE the agent design — not a separable artifact per ADR-7.)
- **Verification** — strict validate, smoke tests, checklist closeout, canonical save, commit.

---

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Spec scaffolding + parent registration. Establishes the `059-agent-implement-code/` packet under parent `022-mcp-coco-integration/` with all Level 3 spec docs and metadata.

- [x] **T001 [P0]** Scaffold child folder `059-agent-implement-code/` under parent `022-mcp-coco-integration/` (`.opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/059-agent-implement-code/`)
- [x] **T002 [P0]** Copy Level 3 templates: spec, plan, tasks, checklist, decision-record, implementation-summary (`level_3/*.md`)
- [x] **T003 [P0]** Customize spec.md with packet-specific Level 3 content (this packet's spec.md)
- [x] **T004 [P0]** Customize plan.md with three-phase implementation plan (this packet's plan.md)
- [x] **T005 [P0]** Customize tasks.md (this file)
- [x] **T006 [P0]** Customize checklist.md with packet-specific QA gates
- [x] **T007 [P0]** Customize decision-record.md with ADR-1 to ADR-10 (originally D1–D10) + rationale
- [x] **T008 [P1]** Initialize implementation-summary.md placeholder (filled post-implementation per CLAUDE.md rule 13)
- [x] **T009 [P0]** Generate description.json via `generate-context.js` or `generate-description.js` (`059-agent-implement-code/description.json`)
- [x] **T010 [P0]** Generate graph-metadata.json (`059-agent-implement-code/graph-metadata.json`)
- [x] **T011 [P0]** Update parent 022 graph-metadata.json: `children_ids: ["059-agent-implement-code"]`, `derived.last_active_child_id` (`022-mcp-coco-integration/graph-metadata.json`)
- [x] **T012 [P1]** Update parent 022 description.json: register child reference (`022-mcp-coco-integration/description.json`)
- [x] **T013 [P1]** Author context-index.md at parent level documenting phase-parent transition (`022-mcp-coco-integration/context-index.md`)
- [ ] **T014 [P0]** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/059-agent-implement-code --strict` (exit 0 expected). [BLOCKED on Phase-1 template-header drift; resolved during Phase 3 by canonical-header rewrite of this file + checklist.md + implementation-summary.md and `ADR-D#` → `ADR-#: D# —` rename in decision-record.md.]
- [x] **T015 [P1]** No fallback needed: parent's heavy docs already moved out; validator requirement is canonical-header alignment only.

---

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Research dispatch (3 parallel streams) + cross-stream synthesis + agent authoring + sibling-doc sync. Phase-2 covers tasks T016–T031.

### Research dispatch and convergence (T016–T024)

- [x] **T016 [P0]** Scaffold research/ subdirectories: `stream-01-oh-my-opencode-slim/`, `stream-02-opencode-swarm-main/`, `stream-03-internal-agent-inventory/`
- [x] **T017 [P0]** Verify cli-codex accepts `gpt-5.5 high fast` (one-shot smoke; superseded original cli-copilot plan after Phase-2 executor switch documented in handover.md)
- [x] **T018 [P0]** Configure deep-research-config.json for stream-01 (target: oh-my-opencode-slim; executor: cli-codex gpt-5.5 high fast; max_iters: 8) (`stream-01-oh-my-opencode-slim/deep-research-config.json`)
- [x] **T019 [P0]** Configure deep-research-config.json for stream-02 (target: opencode-swarm-main) (`stream-02-opencode-swarm-main/deep-research-config.json`)
- [x] **T020 [P0]** Configure deep-research-config.json for stream-03 (target: .opencode/agent/) (`stream-03-internal-agent-inventory/deep-research-config.json`)
- [x] **T021 [P0]** Dispatch all 3 streams in parallel (background; per-stream sub-agents running cli-codex)
- [x] **T022 [P0]** Monitor stream progress — all three converged on `all_questions_answered`/`zero-remaining-questions` strong stop signal (4, 5, 5 iterations of 8 budget)
- [x] **T023 [P1]** Sequencing fallback NOT triggered — codex CLI handled 3 concurrent dispatches cleanly
- [x] **T024 [P1]** Model fallback NOT triggered — gpt-5.5 high fast ran without model-not-found errors

### Synthesis + agent authoring + sibling-doc sync (T025–T031)

- [x] **T025 [P0]** Synthesize all 3 streams into `research/synthesis.md` — consensus per-question table, headline insights, finalized D3 diff text, canonical `code.md` skeleton, Phase 3 task order
- [x] **T026 [P0]** Update decision-record.md ADR-3 (D3) with research-validated convention-floor mechanism — see synthesis §3 for canonical text
- [x] **T027 [P0]** Author `.opencode/agent/code.md` per ADR-2 frontmatter + body sections §0–§3 mirroring `@write` and `@review` precedents (`.opencode/agent/code.md`)
- [ ] **T028 [P0]** Update `.opencode/agent/orchestrate.md` §2 routing table: replace generic `@general` row with `@code` row; update Agent Files table (`.opencode/agent/orchestrate.md`)
- [ ] **T029 [P0]** Sync AGENTS.md canonical: add `@code` to §5 Agent Routing (`AGENTS.md`)
- [ ] **T030 [P0]** Sync AGENTS_Barter.md: add `@code` to §5 (`AGENTS_Barter.md`)
- [x] **T031 [P0]** ~~Sync AGENTS_example_fs_enterprises.md~~ — sibling file deleted from repo; T031 retired. AGENTS sync limited to canonical (T029) + Barter (T030).

---

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Smoke tests + final strict validate + checklist closeout + canonical save + commit. Tasks T032–T039.

- [ ] **T032 [P0]** Smoke test: orchestrator dispatch — `@orchestrate` calls `@code` with trivial task (e.g., add a comment to a file); verify sk-code skill load, file edit, structured RETURN summary. **Documented in implementation-summary.md §Verification; behavioral test ready for live execution after merge.**
- [ ] **T033 [P0]** Smoke test: direct-call refusal — invoke `@code` without orchestrator marker; verify §0 dispatch gate returns the canonical REFUSE message (D3 convention-floor). **Documented in implementation-summary.md §Verification; behavioral test ready for live execution after merge.**
- [ ] **T034 [P0]** Run `validate.sh --strict` on 059 packet (exit 0 expected after Phase 3 canonical-header restructure)
- [ ] **T035 [P0]** Mark all checklist.md items `[x]` with evidence
- [ ] **T036 [P0]** Fill implementation-summary.md with hook + impact-first paragraph
- [ ] **T037 [P0]** `/memory:save` to update canonical continuity
- [ ] **T038 [P0]** Stage + commit on `main` (per memory rule: stay on main; if create.sh auto-branched, switched back already)
- [ ] **T039 [P1]** Memory feedback save: capture any new lessons learned (e.g., cli-codex flag syntax, sk-code edge cases, Phase-2 parallel-dispatch wall-time pattern)

---

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The packet is complete when ALL of the following are true:

1. `.opencode/agent/code.md` exists with the canonical D2 permission profile and §0/§1/§2/§3 body sections.
2. `.opencode/agent/orchestrate.md` §2 routing table includes a `@code` row.
3. AGENTS.md siblings (canonical + Barter) reference `@code`.
4. `decision-record.md` ADR-3 (D3) is in `Status: Accepted (post-research)` with the convention-floor finalization text from `research/synthesis.md` §3.
5. `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/059-agent-implement-code --strict` exits 0.
6. `checklist.md` is fully `[x]` with evidence for every gate.
7. `implementation-summary.md` is filled with hook + impact-first paragraph + verification evidence + smoke-test prompts (since live behavioral execution requires post-merge orchestrator dispatch).
8. `handover.md` reflects packet completion or hands off to a follow-on packet for any deferred items.
9. Canonical save executed (`generate-context.js` for full DB+graph save OR direct `_memory.continuity` patch per ADR-004).
10. Commit on `main`; no feature branches.

---

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec:** `spec.md` (this packet)
- **Plan:** `plan.md` (this packet)
- **Decisions:** `decision-record.md` (ADR-1 to ADR-10; ADR-3 finalized via `research/synthesis.md` §3)
- **Checklist:** `checklist.md` (this packet)
- **Implementation Summary:** `implementation-summary.md` (this packet)
- **Handover:** `handover.md` (this packet)
- **Research synthesis:** `research/synthesis.md` (Phase 2 canonical output)
- **Per-stream evidence:** `research/stream-{01,02,03}-…/research.md`
- **Authored agent:** `.opencode/agent/code.md`
- **Routing entry:** `.opencode/agent/orchestrate.md` §2
- **AGENTS.md siblings:** repo root `AGENTS.md` (canonical), `AGENTS_Barter.md` (symlink to separate Barter repo)
- **External research sources:**
  - `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/`
  - `.opencode/specs/z_future/improved-agent-orchestration/external/opencode-swarm-main/`
- **Internal anchors:** `.opencode/agent/{context,debug,deep-research,deep-review,improve-agent,improve-prompt,orchestrate,review,ultra-think,write}.md`, `.opencode/skill/sk-code/SKILL.md`, `.opencode/skill/cli-opencode/SKILL.md`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`

<!-- /ANCHOR:cross-refs -->
