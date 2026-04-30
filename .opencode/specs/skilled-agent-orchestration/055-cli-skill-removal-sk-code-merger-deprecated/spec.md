---
title: "Feature Specification: Remove sk-code-full-stack and sk-code-web (sk-code-merger deprecated pair)"
description: "Hard-remove the two skills soft-deprecated by 054-sk-code-merger; accept loss of canonical non-web stack content; neutralize sk-code placeholder pointers; sweep all repo references the way 053 swept mcp-clickup."
trigger_phrases: ["remove sk-code-full-stack", "remove sk-code-web", "055 sk-code-merger cleanup"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated"
    last_updated_at: "2026-04-30T10:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec/plan/tasks/checklist for hard-removal of deprecated pair"
    next_safe_action: "Execute Phase A deletions and reference edits"
    blockers: []
    completion_pct: 0
---
# Feature Specification: Remove sk-code-full-stack and sk-code-web

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` (no feature branch — durable user policy) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skills `sk-code-full-stack` and `sk-code-web` were soft-deprecated on 2026-04-30 by packet `054-sk-code-merger`, which created the new umbrella skill `sk-code` and gated the deprecated pair to advisor weight 0. The deprecated trees still occupy disk and are referenced from advisor scoring tables, skill graphs, READMEs, install guides, AGENTS siblings, eval / telemetry JSONL, the new sk-code's own placeholder pointers, four runtime agent-definition files, and several SQLite indexes — leaving the registry internally inconsistent.

### Purpose
Delete both skill folders, prune every cross-reference, and neutralize sk-code's placeholder pointers (which still name `sk-code-full-stack/...` for non-web stack canonical content). The user has accepted the trade-off: roughly 36 markdown files of canonical React / Node / Go / Swift / React Native guidance retire with the deletion. The web stack content was already inlined into `sk-code/{references,assets,scripts}/webflow*` by the 054 merger, so no content is lost there.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `.opencode/skill/sk-code-full-stack/` (82 files) and `.opencode/skill/sk-code-web/` (46 files)
- Neutralize sk-code's 10 `_placeholder.md` pointers (5 references/<stack>/ + 5 assets/<stack>/)
- Strip mcp-clickup-pattern entries from `skill_advisor.py`, `skill-graph.json`, advisor `graph-metadata.json`, eval fixtures, routing-accuracy labels, and `.smart-router-telemetry/compliance.jsonl`
- Update the four sibling READMEs/install guides + root README + AGENTS.md + CLAUDE.md
- Update sk-code-review (overlay routing target swap), sk-code-opencode README, mcp-chrome-devtools, four cli-* orchestrator SKILL.md files, sk-doc, sk-git, sk-improve-prompt, system-spec-kit reference docs that list the deprecated names
- Update four runtime agent-definition files (deep-review across `.claude/`, `.codex/`, `.gemini/`, `.opencode/agent/`)
- Prune SQLite databases (skill-graph, code-graph, voyage context-index)
- Validate the new spec folder with `validate.sh --strict`

### Out of Scope
- Inline-migrating non-web stack content into sk-code (user explicitly declined)
- Editing historical `.opencode/specs/...` packets and `.opencode/skill/system-spec-kit/scripts/observability/` reports — frozen audit trail (same rule as 053)
- AGENTS_Barter.md / AGENTS_example_fs_enterprises.md (verified zero hits — durable triad sync is a no-op for this packet)

### Files to Change

| Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code-full-stack/**` | Delete | 82 files |
| `.opencode/skill/sk-code-web/**` | Delete | 46 files |
| `.opencode/skill/sk-code/{references,assets}/{react,nodejs,go,swift,react-native}/_placeholder.md` | Modify | 10 files — neutralize pointers |
| `.opencode/skill/sk-code/{SKILL.md, README.md, graph-metadata.json, CHANGELOG.md, description.json, changelog/v1.0.0.0.md}` | Modify | Self-reference cleanup |
| `.opencode/skill/sk-code/references/{router,universal,webflow}/*.md` (multiple) | Modify | Drop sk-code-full-stack/sk-code-web mentions |
| `.opencode/skill/sk-code/assets/{universal,webflow}/checklists/*.md` | Modify | Drop deprecated names |
| `system-spec-kit/.../skill_advisor/scripts/{skill_advisor.py, skill-graph.json}` | Modify | Advisor data |
| `system-spec-kit/.../skill_advisor/graph-metadata.json` | Modify | Cross-skill edges |
| `system-spec-kit/.../skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modify | Retarget P1-FULLSTACK-001 |
| `system-spec-kit/.../skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl` | Modify | Retarget skill_top_1 labels |
| `.opencode/skill/.smart-router-telemetry/compliance.jsonl` | Modify | Drop 3+ rows |
| `.opencode/skill/sk-code-review/{SKILL.md, README.md, graph-metadata.json}` and `references/*.md` | Modify | Overlay-target swap (~7 files) |
| `.opencode/skill/sk-code-opencode/{SKILL.md, README.md}` | Modify | Cosmetic |
| `.opencode/skill/mcp-chrome-devtools/{SKILL.md, README.md, examples/README.md}` | Modify | Cross-skill paths |
| `.opencode/skill/cli-{claude-code,codex,gemini}/SKILL.md` and `cli-opencode/assets/prompt_templates.md` | Modify | Narrative cross-refs |
| `.opencode/skill/sk-doc/assets/skill/skill_md_template.md` | Modify | Template example |
| `.opencode/skill/sk-git/README.md` | Modify | Cross-ref |
| `.opencode/skill/sk-improve-prompt/SKILL.md` | Modify | Cross-ref |
| `.opencode/skill/system-spec-kit/{assets/level_decision_matrix.md, references/**/*.md}` | Modify | Many doc refs |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/shadow-sink.vitest.ts` | Modify | Test file |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts` | Modify | Stress test |
| Root `README.md`, `AGENTS.md`, `CLAUDE.md` | Modify | Doc surfaces |
| `.opencode/install_guides/{README.md, SET-UP - AGENTS.md, SET-UP - Opencode Agents.md}` | Modify | Install guides |
| `.{claude,codex,gemini}/agents/deep-review.{md,toml}` and `.opencode/agent/deep-review.md` | Modify | Agent definitions |
| `.opencode/skill/system-spec-kit/mcp_server/database/{skill-graph,code-graph,context-index__voyage__voyage-4__1024}.sqlite` | Modify | SQL DELETE |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both skill folders removed | `ls .opencode/skill/sk-code-full-stack` and `ls .opencode/skill/sk-code-web` each return "No such file or directory" |
| REQ-002 | sk-code self-contained | `grep -rn "sk-code-full-stack\|sk-code-web" .opencode/skill/sk-code/` returns zero hits OUTSIDE intentional historical metadata (`graph-metadata.json supersedes` array kept by design) |
| REQ-003 | Advisor data coherent | `grep -rn "sk-code-full-stack\|sk-code-web" .opencode/skill/system-spec-kit/mcp_server/skill_advisor/` returns zero hits |
| REQ-004 | Skill graph self-consistent | `skill-graph.json` parses; `skill_count` 22 → 20; deprecated keys absent from `families.sk-code`, `adjacency`, peer adjacency `siblings`, `signals` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Doc surfaces updated | Root README, .opencode/skill/README, install guides, AGENTS.md, CLAUDE.md zero hits |
| REQ-006 | Cross-skill refs retargeted | sk-code-review, sk-code-opencode, mcp-chrome-devtools, cli-* orchestrators, sk-doc, sk-git, sk-improve-prompt, system-spec-kit zero hits |
| REQ-007 | Agent definitions synced | All four runtime deep-review.md/toml files retarget overlay list to `sk-code-opencode / sk-code` |
| REQ-008 | SQLite DBs pruned | `skill-graph.sqlite` count 22 → 20; `code-graph.sqlite` zero rows under deprecated paths; voyage `memory_index` rows for deprecated content purged |
| REQ-009 | Spec validates strict | `validate.sh --strict` exits 0, errors 0, warnings 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Repo-wide `grep -rn "sk-code-full-stack\|sk-code-web"` (excluding `.opencode/specs/`, `observability/`, this packet, and the intentional `supersedes` historical metadata) returns zero hits.
- **SC-002**: `python3 -m json.tool` passes on every edited JSON file; `python3 -c "import ast; ast.parse(...)"` passes on `skill_advisor.py`.

### Acceptance Scenarios

- **AS-001**: **Given** sk-code-full-stack and sk-code-web folders exist, **when** removal completes, **then** both `ls` commands return "No such file or directory".
- **AS-002**: **Given** sk-code's placeholder pointers name sk-code-full-stack, **when** removal completes, **then** all 10 `_placeholder.md` files contain neutralized stubs with `canonical_source: null` and a "content retired" message.
- **AS-003**: **Given** `skill-graph.json` declares `skill_count: 22` with both deprecated skills in `families.sk-code`, **when** removal completes, **then** `skill_count` is 20 and the deprecated names are absent from families/adjacency/signals.
- **AS-004**: **Given** four runtime agent-definitions list "sk-code-opencode / sk-code-web / sk-code-full-stack" as overlay options, **when** removal completes, **then** all four list "sk-code-opencode / sk-code".
- **AS-005**: **Given** `skill-graph.sqlite` contains nodes for both deprecated skills, **when** the SQL DELETE completes, **then** `SELECT COUNT(*) FROM skill_nodes` returns 20 (was 22).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Operators querying React/Node/Go/Swift/RN guidance via `sk-code` hit dead stubs | Medium (UX) | User explicitly accepted trade-off; document in `Known Limitations` |
| Risk | Vitest regression suite fails after `P1-FULLSTACK-001` retarget | Low | Update `expected_top_any` to `sk-code`; flag suite re-run as follow-up |
| Risk | Cross-AI agent-def drift if any of the four runtime files is missed | Medium | Sync all four in same edit pass (durable rule `feedback_agents_md_sync_triad`) |
| Risk | `DEPRECATED_SKILLS` frozenset becomes vestigial gate | Low | Empty the frozenset with explanatory comment OR remove the gate; either is safe |
| Dependency | None — repo-internal | None | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — documentation/skill removal only.

### Security
- **NFR-S01**: No secrets touched; deleted skills contained installer scripts and reference docs only.

### Reliability
- **NFR-R01**: After removal, the skill advisor must continue routing the remaining 20 skills correctly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **`families.sk-code` shrinks 5 → 3**: after deleting `sk-code-web` and `sk-code-full-stack`, the family contains only `sk-code`, `sk-code-opencode`, `sk-code-review`. Verify family is non-empty.
- **Vec virtual-table orphans in voyage DB**: same as 053 precedent — tolerable; embedding chunks become unreachable but harmless.

### Error Scenarios
- **JSON parse failure post-edit**: re-run `python3 -m json.tool` after each JSON modification.
- **Stray reference missed**: post-edit `grep -rn` to catch leftovers (excluding intentional residuals).

### State Transitions
- **Partial completion** (folders deleted, advisor still mentions them): mitigation — execute advisor edits BEFORE final validation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~50 file edits + 128 deletions; broader than 053 |
| Risk | 7/25 | Content-loss accepted; risk concentrated on cross-AI sync drift |
| Research | 6/20 | Three Explore agents already mapped surface area; no further investigation needed |
| **Total** | **27/70** | **Level 2** (verification needed for cross-doc / cross-AI consistency) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
