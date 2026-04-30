---
title: "Tasks: Merge sk-code-web + sk-code-full-stack into sk-code"
description: "Task tracking for 054 packet — phases mirror plan.md and the in-session TaskList."
trigger_phrases: ["sk-code merger tasks", "054 tasks", "sk-code task list"]
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/054-sk-code-merger"
    last_updated_at: "2026-04-30T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list mirroring in-session TaskCreate batch"
    next_safe_action: "Execute Phase 2 — scaffold sk-code/ directory"
    blockers: []
    completion_pct: 5
---
# Tasks: Merge sk-code-web + sk-code-full-stack into sk-code

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (can run alongside another `[P]` task) |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Canonical setup phase covering spec folder bootstrap and new-skill scaffold (subdivided below into 1.a Spec Setup and 1.b New Skill Scaffold).

### Phase 1.a: Spec Setup

- [x] T001 Verify slot 054 free under skilled-agent-orchestration (`.opencode/specs/skilled-agent-orchestration/`)
- [x] T002 [P] Read Level 3 templates (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
- [x] T003 [P] Audit sk-code-web/scripts/*.mjs for path assumptions (RESOLVED — CWD-relative, no edits needed)
- [x] T004 Author spec.md (full Level 3 with executive summary, 4 user stories, complexity 64/100)
- [x] T005 Author plan.md (mirrors approved plan with phase deps + critical path)
- [x] T006 Author tasks.md (this file)
- [ ] T007 Author checklist.md (P0/P1/P2 verification items)
- [ ] T008 Author decision-record.md (5 ADRs)
- [ ] T009 Generate description.json + graph-metadata.json (manual write modeled on 053)

---

### Phase 1.b: New skill scaffold

- [ ] T010 Create `.opencode/skill/sk-code/` directory tree (folders only)
- [ ] T011 Author SKILL.md (merged routing pseudocode: stack detection → intent classification → phase lifecycle)
- [ ] T012 [P] Author README.md (modeled on sk-code-web/README.md; setup, troubleshooting, structure inventory)
- [ ] T013 [P] Author CHANGELOG.md (1.0.0 baseline noting merger of sk-code-web 1.1.0 + sk-code-full-stack 1.1.0)
- [ ] T014 Author `_router/stack_detection.md` (extracted from SKILL.md)
- [ ] T015 [P] Author `_router/intent_classification.md` (extracted TASK_SIGNALS)
- [ ] T016 [P] Author `_router/resource_loading.md` (load levels MINIMAL/FOCUSED/STANDARD/DEBUGGING)
- [ ] T017 [P] Author `_router/phase_lifecycle.md` (Implementation→Quality Gate→Debug→Verify)
- [ ] T018 Generate sk-code/graph-metadata.json + description.json

---

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Canonical implementation phase covering web migration, placeholder scaffolding, and all cross-repo reference updates (subdivided below into 2.a Web Migration, 2.b Placeholders, 2.c Cross-Repo).

### Phase 2.a: Web content migration

- [ ] T020 Copy `sk-code-web/references/implementation/*.md` → `sk-code/references/web/implementation/`
- [ ] T021 [P] Copy `sk-code-web/references/debugging/*.md` → `sk-code/references/web/debugging/`
- [ ] T022 [P] Copy `sk-code-web/references/verification/*.md` → `sk-code/references/web/verification/`
- [ ] T023 [P] Copy `sk-code-web/references/deployment/*.md` → `sk-code/references/web/deployment/`
- [ ] T024 [P] Copy `sk-code-web/references/performance/*.md` → `sk-code/references/web/performance/`
- [ ] T025 [P] Copy `sk-code-web/references/standards/*.md` → `sk-code/references/web/standards/`
- [ ] T026 [P] Copy `sk-code-web/references/research/multi_agent_patterns.md` → `sk-code/references/universal/multi_agent_research.md`
- [ ] T027 [P] Copy `sk-code-web/assets/checklists/*.md` → `sk-code/assets/web/checklists/`
- [ ] T028 [P] Copy `sk-code-web/assets/patterns/*.js` → `sk-code/assets/web/patterns/`
- [ ] T029 [P] Copy `sk-code-web/assets/integrations/*.js` → `sk-code/assets/web/integrations/`
- [ ] T030 [P] Copy `sk-code-web/scripts/*.mjs` → `sk-code/scripts/`

### Universal namespace curation (TIGHT scope per Plan-agent critique)

- [ ] T031 Copy + strip-browser-bits: `sk-code-web/references/debugging/error_recovery.md` → `sk-code/references/universal/error_recovery.md`
- [ ] T032 Copy + scope to severity model: `sk-code-web/references/standards/code_quality_standards.md` → `sk-code/references/universal/code_quality_standards.md`
- [ ] T033 Copy + language-agnostic only: `sk-code-web/references/standards/code_style_guide.md` → `sk-code/references/universal/code_style_guide.md`
- [ ] T034 [P] Copy: `sk-code-web/assets/patterns/validation_patterns.js` → `sk-code/assets/universal/patterns/validation_patterns.js`
- [ ] T035 [P] Copy: `sk-code-web/assets/patterns/wait_patterns.js` → `sk-code/assets/universal/patterns/wait_patterns.js`
- [ ] T036 [P] Copy + browser-agnostic version: `sk-code-web/assets/checklists/debugging_checklist.md` → `sk-code/assets/universal/checklists/debugging_checklist.md`
- [ ] T037 [P] Copy + browser-agnostic version: `sk-code-web/assets/checklists/verification_checklist.md` → `sk-code/assets/universal/checklists/verification_checklist.md`

---

### Phase 2.b: Placeholder stubs (non-web stacks)

- [ ] T040 Create `sk-code/references/react/_placeholder.md` + 7 stub files (frontmatter only)
- [ ] T041 [P] Create `sk-code/references/nodejs/_placeholder.md` + 4 stub files
- [ ] T042 [P] Create `sk-code/references/go/_placeholder.md` + 11 stub files
- [ ] T043 [P] Create `sk-code/references/react-native/_placeholder.md` + 7 stub files
- [ ] T044 [P] Create `sk-code/references/swift/_placeholder.md` + 6 stub files
- [ ] T045 [P] Create `sk-code/assets/{react,nodejs,go,react-native,swift}/_placeholder.md` (5 files, no per-stack pattern stubs in assets — only pointer)

---

### Phase 2.c: Cross-repo reference updates

### Tier 1: Skill advisor scoring (CRITICAL — drives routing)

- [ ] T050 Add `DEPRECATED_SKILLS = frozenset({"sk-code-web", "sk-code-full-stack"})` to `skill_advisor.py` with early-return guard in score-computation
- [ ] T051 Rewrite PHRASE_BOOSTS (3 full-stack entries) in `skill_advisor.py` to point at `sk-code`
- [ ] T052 Rewrite TOKEN_BOOSTS (17 web entries) in `skill_advisor.py`; merge full-stack stack keywords (react, swift, go, nextjs, react-native, nodejs)
- [ ] T053 Add `DEPRECATED_SKILLS` constant + early-return guard in `lib/scorer/lanes/explicit.ts`
- [ ] T054 Rewrite 18 lane mappings in `explicit.ts` to retarget legacy skill names → `sk-code`
- [ ] T055 Update 1 entry in `lib/scorer/lanes/lexical.ts`
- [ ] T056 Update fixtures in `tests/lane-attribution.test.ts` for new skill name; verify test passes

### Tier 2: graph-metadata.json (8 files)

- [ ] T060 Update `sk-code-web/graph-metadata.json` (deprecated: true, superseded_by: sk-code, advisor_weight: 0)
- [ ] T061 [P] Update `sk-code-full-stack/graph-metadata.json` (same)
- [ ] T062 [P] Update `sk-code-review/graph-metadata.json` (enhanced_by retarget: [sk-code-web, sk-code-full-stack] → [sk-code])
- [ ] T063 [P] Update `sk-code-opencode/graph-metadata.json` (sibling weight retarget)
- [ ] T064 [P] Update `mcp-chrome-devtools/graph-metadata.json` (enhances: sk-code-web → sk-code)
- [ ] T065 [P] Update `mcp-figma/graph-metadata.json` (same)
- [ ] T066 [P] Update `system-spec-kit/.../skill_advisor/graph-metadata.json` (routing edges)

### Tier 3: Sister SKILL.md cross-refs (7 files)

- [ ] T070 Update `sk-code-review/SKILL.md` (2 refs)
- [ ] T071 [P] Update `sk-code-opencode/SKILL.md` (2 refs)
- [ ] T072 [P] Update `mcp-chrome-devtools/SKILL.md` (1 ref, "Phase 3 browser testing")
- [ ] T073 [P] Update `cli-claude-code/SKILL.md` (2 refs)
- [ ] T074 [P] Update `cli-codex/SKILL.md` (1 ref)
- [ ] T075 [P] Update `cli-gemini/SKILL.md` (1 ref)
- [ ] T076 [P] Update `sk-improve-prompt/SKILL.md` (1 ref)

### Tier 4: Root instruction files (4 files)

- [ ] T080 Update AGENTS.md line ~161 ("Web code → sk-code-web" → "Application code → sk-code")
- [ ] T081 [P] Update CLAUDE.md (mirror)
- [ ] T082 [P] Update AGENTS_example_fs_enterprises.md (3 refs at L170, L406, L408)
- [ ] T083 [P] Update AGENTS_Barter.md (mirror per `feedback_agents_md_sync_triad.md` memory rule)

### Tier 5: Deep-review agent definitions (3 files)

- [ ] T090 Update `.opencode/agent/deep-review.md`
- [ ] T091 [P] Update `.claude/agents/deep-review.md`
- [ ] T092 [P] Update `.gemini/agents/deep-review.md`

### Tier 6: README and documentation (~10 files)

- [ ] T100 Update `.opencode/skill/README.md` (skill registry, capability matrix)
- [ ] T101 [P] Update `mcp-chrome-devtools/README.md`
- [ ] T102 [P] Update `mcp-chrome-devtools/examples/README.md`
- [ ] T103 [P] Update top-level `README.md`
- [ ] T104 [P] Update system-spec-kit references (audit + edit as needed)
- [ ] T105 [P] Add deprecation note to observability reports (smart-router-measurement-report.md, smart-router-analyze-report-*.md)

### Tier 7: Old skill frontmatter deprecation (2 files, additive only)

- [ ] T110 Append `deprecated: true`, `superseded_by: sk-code`, `advisor_weight: 0` to `sk-code-web/SKILL.md` YAML frontmatter (body untouched)
- [ ] T111 [P] Same for `sk-code-full-stack/SKILL.md`

---

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Canonical verification phase covering validation suite + packet finalization (subdivided below into 3.a Validation Suite and 3.b Finalization).

### Phase 3.a: Validation Suite

- [ ] T120 `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh skilled-agent-orchestration/054-sk-code-merger --strict` exits 0
- [ ] T121 `/doctor:skill-advisor :confirm` re-tunes scoring without regressions
- [ ] T122 Trigger test: "Fix Webflow animation flicker" → `sk-code` (WEB route, full content)
- [ ] T123 [P] Trigger test: "Add a React component to my Next.js app" → `sk-code` (REACT placeholder)
- [ ] T124 [P] Trigger test: "Help me debug a Go service" → `sk-code` (GO placeholder)
- [ ] T125 [P] Trigger test: "Audit OpenCode plugin loader" → `sk-code-opencode` (UNCHANGED)
- [ ] T126 [P] Trigger test: "Review this PR" → `sk-code-review` (UNCHANGED)
- [ ] T127 `cd .opencode/skill/system-spec-kit/mcp_server && npm test -- lane-attribution` passes
- [ ] T128 Cross-repo regrep returns only intentional residuals
- [ ] T129 Web smoke test: `node .opencode/skill/sk-code/scripts/minify-webflow.mjs` produces output identical to running from sk-code-web/scripts/

---

### Phase 3.b: Finalization

- [ ] T130 Author `implementation-summary.md` with continuity frontmatter (recent_action, completion_pct, next_safe_action)
- [ ] T131 Mark all checklist.md P0/P1 items `[x]` with evidence
- [ ] T132 `/memory:save` to persist context for future sessions

---

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (REQ-001 through REQ-007) complete
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification (T122-T126) passed
- [ ] Web smoke test passed
- [ ] checklist.md verified

---

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Approved plan source**: `~/.claude/plans/merge-users-michelkerkmeester-mega-devel-crispy-rabin.md`

<!-- /ANCHOR:cross-refs -->
