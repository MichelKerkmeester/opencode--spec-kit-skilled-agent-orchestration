---
title: "Feature Specification: Smart-Router Resilience Pattern in sk-doc Template and Repo-Wide Adoption"
description: "Promote the resilient smart-router pattern into sk-doc as the canonical skill template asset, then align every existing skill smart-router with the same discovery, guarded loading, extensible routing, and fallback behavior."
trigger_phrases:
  - "smart router resilience"
  - "skill router pattern"
  - "runtime discovery router"
  - "sk-doc router template"
  - "smart routing fallback"
importance_tier: "important"
contextType: "general"
level: 2
status: complete
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/012-sk-doc-smart-router-resilience-template"
    last_updated_at: "2026-05-03T00:58:00+02:00"
    last_updated_by: "codex"
    recent_action: "Finished IMPL-012 mop-up."
    next_safe_action: "Review the final diff if desired; no commit has been made."
    blockers: []
    key_files:
      - ".opencode/skill/sk-deep-review/SKILL.md"
      - ".opencode/skill/sk-doc/assets/skill/skill_smart_router.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "impl-012-finisher"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder supplied by user."
---
# Feature Specification: Smart-Router Resilience Pattern in sk-doc Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-02 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skills with smart-router sections can drift when resource paths move, references are deleted, or new folders appear. IMPL-012 had already aligned most skills but stopped before the final `sk-deep-review` pattern patch and eight cross-link additions.

### Purpose

Finish the remaining IMPL-012 work so all 19 skill smart-router sections expose the canonical resilience asset and all 19 are counted by the marker scan.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add the smart-router resilience pattern to `.opencode/skill/sk-deep-review/SKILL.md`.
- Add the canonical asset cross-link to the eight already-patterned skills that were missing it.
- Preserve existing per-skill intent scoring and load levels.
- Run the requested count checks and workflow-invariance test.

### Out of Scope

- Git commits or branch changes.
- Reworking unrelated skill routing behavior.
- Changing the canonical smart-router asset.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Add cross-link plus discovery, guarded loading, routing, and fallback pattern. |
| `.opencode/skill/sk-code/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
| `.opencode/skill/sk-code-opencode/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
| `.opencode/skill/sk-code-review/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
| `.opencode/skill/sk-git/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
| `.opencode/skill/sk-improve-prompt/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Add canonical smart-router asset cross-link. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `sk-deep-review` has the resilience pattern markers. | `rg -l "load_if_available\|discover_markdown_resources\|UNKNOWN_FALLBACK" .opencode/skill/*/SKILL.md \| wc -l` returns 19. |
| REQ-002 | All 19 skills link to the canonical smart-router asset. | `rg -l "skill_smart_router\\.md" .opencode/skill/*/SKILL.md \| wc -l` returns 19. |
| REQ-003 | Workflow-invariance test remains green. | The vitest command for `workflow-invariance.vitest.ts` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Existing skill intent routing remains recognizable. | `sk-deep-review` keeps its review setup, iteration, convergence, and report signals plus its load levels. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Pattern marker count is 19.
- **SC-002**: Cross-link count is 19.
- **SC-003**: Workflow-invariance test passes.
- **SC-004**: No git commit is created.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing canonical asset path | Cross-links fail if path format is inconsistent | Mirror the already-linked sibling skill format. |
| Risk | Overwriting bespoke review routing intent | `sk-deep-review` could lose useful review-specific behavior | Preserve the existing intent signals, synonyms, resource map shape, and load levels while swapping routing mechanics. |
| Risk | Markdown rendering regression | Skill docs may render poorly | Keep the cross-link as a single blockquote line and preserve fenced Python blocks. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The verification scans must stay simple `rg` checks over `.opencode/skill/*/SKILL.md`.

### Security

- **NFR-S01**: No secrets, credentials, or environment files are touched.

### Reliability

- **NFR-R01**: Missing markdown resources are skipped by guarded loading instead of crashing the router pseudocode.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty router inventory: load the default quick reference if available and return fallback guidance.
- Non-markdown assets: keep them as explicit references, not router-loaded markdown resources.
- Duplicate paths: suppress duplicate loads with a `seen` set.

### Error Scenarios

- Missing canonical asset cross-link: count check catches the gap.
- Workflow-invariance regression: vitest exits non-zero and blocks completion.
- Stale spec folder structure: strict spec validation catches missing docs or anchors.

### State Transitions

- Partial completion: marker and cross-link counts identify exactly what remains.
- Completion: counts reach 19/19 and the workflow-invariance test passes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Nine skill files plus packet documentation repair. |
| Risk | 8/25 | Mostly markdown edits, with one larger pseudocode section. |
| Research | 4/20 | Existing linked examples and canonical asset gave the pattern. |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-2-19-skill-propagation -->
## Phase 2 — 19-skill propagation

Phase 2 extends the original scope from shipping the canonical smart-router asset at `sk-doc` to propagating structural conformance across all 19 skills. This Stream B pass focused on the 12 host `SKILL.md` files that needed size reduction or router-alignment edits while preserving the four canonical patterns:

1. Runtime Discovery through recursive markdown discovery under `references/` and `assets/`.
2. Existence-Check Before Load through guarded `load_if_available()` behavior with duplicate suppression.
3. Extensible Routing Key through skill-local intent, stack, provider, or project signals.
4. Multi-Tier Graceful Fallback through `UNKNOWN_FALLBACK` disambiguation and missing-resource notices.

The 12 edited host files are `system-spec-kit`, `sk-doc`, `mcp-code-mode`, `sk-code-opencode`, `sk-deep-review`, `sk-code`, `mcp-coco-index`, `mcp-chrome-devtools`, `mcp-figma`, `sk-deep-research`, `cli-opencode`, and `sk-improve-agent`. The remaining seven skills were not touched because this task only required touching them if the canonical marker grep failed.
<!-- /ANCHOR:phase-2-19-skill-propagation -->
