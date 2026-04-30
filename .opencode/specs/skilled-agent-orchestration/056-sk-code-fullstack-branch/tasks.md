---
title: "Tasks: sk-code multi-stack scaffolding"
description: "Executable task list — Phases A (origin) → B (rename + fill) → C (sk-doc align) → D (validate). All complete."
trigger_phrases: ["056 tasks", "sk-code multi-stack tasks"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/056-sk-code-fullstack-branch"
    last_updated_at: "2026-04-30T17:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "057 merged into 056"
    next_safe_action: "Run /memory:save"
    blockers: []
    completion_pct: 100
---
# Tasks: sk-code multi-stack scaffolding

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (file path)`

---

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

(Original 056 spec packet creation + later merge-rewrite during 057 absorption.)

- [x] T001 Author original 056 spec/plan/tasks/checklist (Phase A start).
- [x] T002 Pre-flight grep: identify consumers of `references/nextjs` / `assets/nextjs` paths.
- [x] T003 Decision: rename to `nextjs/` (final user direction), with constant `NEXTJS`.
- [x] T004 `git mv .opencode/skill/sk-code/references/nextjs .opencode/skill/sk-code/references/react` (Phase A initial — later reverted by user).
- [x] T005 `git mv references/react references/nextjs` (final state).
- [x] T006 `mkdir -p .opencode/skill/sk-code/assets/nextjs/{checklists,patterns,integrations}`.
- [x] T007 `mkdir -p .opencode/skill/sk-code/assets/go/{checklists,patterns}`.

---

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

(Bulk stub fill + carry-over rewrites + kerkmeester scrub + SKILL.md updates + universal/router reference rewrites + sk-doc smart-router alignment + anchor removal.)

### Phase B — Bulk stub fill + carry-over rewrites + scrub

- [x] T010 Read `.opencode/skill/cli-codex/SKILL.md` to confirm dispatch contract.
- [x] T011 Compose cli-codex dispatch prompt (43-entry flat path list + canonical templates + strict prohibitions).
- [x] T012 Invoke cli-codex `codex exec -c service_tier="fast" --model gpt-5.5` → 43 stub files written.
- [x] T013 Post-dispatch verification: file count, status:stub markers, kerkmeester sweep, no-fenced-code sweep.
- [x] T014 Hand-rewrite `references/nextjs/README.md` as project-agnostic stub.
- [x] T015 Hand-rewrite `references/go/README.md` as project-agnostic stub.
- [x] T016 Hand-rewrite `references/nextjs/implementation/implementation_workflows.md` as Phase 1 entry stub.
- [x] T017 Hand-rewrite `references/go/implementation/implementation_workflows.md` as Phase 1 entry stub.
- [x] T018 Scrub kerkmeester from `references/router/cross_stack_pairing.md` (keyword line + line 200 prose).

### Phase B — SKILL.md / metadata updates

- [x] T020 SKILL.md: line 119-120 LIVE → STUB for NEXTJS / GO.
- [x] T021 SKILL.md: lines 148-149 Resource Domains LIVE → STUB.
- [x] T022 sk-code/README.md: stack detection table updated; STUB markers honest.
- [x] T023 sk-code/changelog/v1.3.0.0.md: new version changelog entry.
- [x] T024 description.json: supported_stacks, keywords, trigger_examples, lastUpdated, placeholder_fill_packet field.
- [x] T025 graph-metadata.json: domains, intent_signals, key_files, causal_summary, placeholder_fill_packet field.
- [x] T026 explicit.ts: NEXTJS lane (was REACT); kerkmeester key removed; nextjs go pairing triggers added.
- [x] T027 sk-code SKILL.md frontmatter: version 1.2.0 → 1.3.0.

### Phase C — sk-doc smart-router alignment + universal/router rewrites

- [x] T030 SKILL.md §2 SMART ROUTING: anchor renamed `smart-routing` → `smart-routing-references` (sk-doc canonical).
- [x] T031 SKILL.md §2: subsection order matches sk-doc (Stack Detection → Resource Domains → Resource Loading Levels → Smart Router Pseudocode).
- [x] T032 SKILL.md §2: single comprehensive Python pseudocode block (replacing fragmented sub-blocks).
- [x] T033 SKILL.md §2: helper signatures match sk-doc (`_task_text`, `_guard_in_skill`, `discover_markdown_resources`, `score_intents`, `select_intents`, `route_code_resources`).
- [x] T034 SKILL.md §2: `LOADING_LEVELS = {ALWAYS, ON_DEMAND_KEYWORDS, ON_DEMAND}` (sk-doc shape).
- [x] T035 SKILL.md §2: `RESOURCE_MAPS = {stack: {intent: paths}}` nested per-stack maps.
- [x] T036 SKILL.md: insert §5 REFERENCES section (sk-doc canonical: Core References → Templates and Assets → Build/Verification Scripts).
- [x] T037 SKILL.md: renumber sections 5-9 → 6-10 (SUCCESS CRITERIA → 6, EXTERNAL → 7, RELATED → 8, WHERE AM I → 9, QUICK REFERENCE → 10).
- [x] T038 [P] Rewrite `references/universal/code_quality_standards.md` to sk-doc reference template.
- [x] T039 [P] Rewrite `references/universal/code_style_guide.md` to sk-doc reference template.
- [x] T040 [P] Rewrite `references/universal/error_recovery.md` to sk-doc reference template.
- [x] T041 [P] Rewrite `references/universal/multi_agent_research.md` to sk-doc reference template.
- [x] T042 [P] Rewrite `references/router/stack_detection.md` to sk-doc reference template.
- [x] T043 [P] Rewrite `references/router/intent_classification.md` to sk-doc reference template.
- [x] T044 [P] Rewrite `references/router/resource_loading.md` to sk-doc reference template.
- [x] T045 [P] Rewrite `references/router/phase_lifecycle.md` to sk-doc reference template.
- [x] T046 Restructure `references/router/cross_stack_pairing.md` (insert OVERVIEW; renumber sections 1-8 → 2-9; replace See also with `## 10. RELATED RESOURCES`).
- [x] T047 [P] Rewrite `assets/universal/checklists/debugging_checklist.md` to sk-doc asset template.
- [x] T048 [P] Rewrite `assets/universal/checklists/verification_checklist.md` to sk-doc asset template.
- [x] T049 Strip all `<!--.*ANCHOR:.*-->` HTML comments from every md file under `sk-code/` (Python sweep).
- [x] T050 Cleanup pass: strip auto-linter `## N. OVERVIEW _TODO_` pollution.

---

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T060 Path-existence sweep: 33/33 RESOURCE_MAPS paths for WEBFLOW + NEXTJS + GO resolve.
- [x] T061 [P] sk-doc validate: 9 reference + 2 asset checklist files all `valid: true`, 0 issues.
- [x] T062 [P] sk-doc DQI: all 11 files band ∈ {good, excellent} (DQI ≥ 88).
- [x] T063 [P] No-fenced-code in markdown stubs sweep: 0 hits.
- [x] T064 [P] Final kerkmeester sweep across whole `sk-code/`: 0 hits.
- [x] T065 [P] Anchor sweep: 0 hits.
- [x] T066 Advisor smoke #1: "implement Next.js App Router page with vanilla-extract" → score 0.857, sk-code wins.
- [x] T067 Advisor smoke #2: "build a gin handler with sqlc and Postgres" → score 0.78, sk-code wins.
- [x] T068 Advisor smoke #3: "fix Webflow animation flicker" (regression check) → score 0.842, sk-code wins (no regression).
- [x] T069 Mark every checklist.md item `[x]` with evidence (command output, file paths).
- [ ] T070 Final `/memory:save` for spec folder 056 (refreshes description.json + graph-metadata.json + memory index).

---

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T069 marked `[x]`.
- [ ] T070 (memory save) — run by user after merge.
- [x] No `[B]` blocked tasks remaining.
- [x] checklist.md verified end-to-end with evidence.
- [x] implementation-summary.md authored AFTER above (post-merge consolidation).

---

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification**: See `checklist.md`.
- **Implementation summary**: See `implementation-summary.md`.
- **Absorbed packet**: `057-sk-code-multi-stack-placeholders` (deleted; content merged here).
<!-- /ANCHOR:cross-refs -->
