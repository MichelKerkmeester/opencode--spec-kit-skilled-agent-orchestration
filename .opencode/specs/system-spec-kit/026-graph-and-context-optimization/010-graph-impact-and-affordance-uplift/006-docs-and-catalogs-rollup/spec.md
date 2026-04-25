---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Docs and Catalogs Rollup (012/006)"
description: "Update umbrella docs (root README, skill SKILL.md/README, mcp_server README/INSTALL_GUIDE) reflecting capabilities shipped by 012/002-005. Per-packet feature_catalog + manual_testing_playbook entries are written inline by 002-005; this sub-phase rolls up indexes."
trigger_phrases:
  - "012 docs rollup"
  - "feature catalog rollup"
  - "manual testing playbook rollup"
  - "root readme update"
  - "skill skill md update"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup"
    last_updated_at: "2026-04-25T11:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized sub-phase scaffold"
    next_safe_action: "Wait for 012/002-005 to ship; then run sk-doc on umbrella docs"
    completion_pct: 0
    blockers: ["012/002 pending", "012/003 pending", "012/004 pending", "012/005 pending"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---
# Feature Specification: Docs and Catalogs Rollup (012/006)

<!-- SPECKIT_LEVEL: 2 -->

> **Phase-naming alias (R-007-P2-12):** This packet was authored under the
> historical label `012/006`. During refactor `bdd3c831d`, the parent phase
> was renumbered from `012-graph-impact-and-affordance-uplift` to the
> wrapper `010-graph-impact-and-affordance-uplift`. Both labels refer to the
> same packet; the canonical path is now
> `026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/006-docs-and-catalogs-rollup/`.
> Existing `012/006` references in body text are intentional — they point
> to the same documents.

---

## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft (blocked on 012/002-005) |
| **Created** | 2026-04-25 |
| **Branch** | `012/006-docs-and-catalogs-rollup` |

---

## 2. PROBLEM & PURPOSE

**Problem:** Once 012/002-005 ship, umbrella docs (root README, skill SKILL.md/README, mcp_server README/INSTALL_GUIDE, feature_catalog/manual_testing_playbook indexes) won't reflect the new capabilities. Per-packet `feature_catalog/{NN--category}/` and `manual_testing_playbook/{NN--category}/` entries are written inline by 002-005, but the umbrella surfaces and top-level indexes need a coordinated update.

**Purpose:** Roll up the umbrella docs and top-level indexes after 002-005 land. sk-doc DQI compliance.

---

## 3. SCOPE

### In Scope (Umbrella docs)
- `/README.md` (repo root) — features section update for new capabilities
- `.opencode/skill/system-spec-kit/SKILL.md` — capability matrix update (new handlers, lanes, badges)
- `.opencode/skill/system-spec-kit/README.md` — feature index
- `.opencode/skill/system-spec-kit/mcp_server/README.md` — handler list update (new `detect_changes`, enriched query/blast_radius)
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — verification steps for new behaviors
- `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` — top-level index reflecting new entries
- `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — top-level index reflecting new entries
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/merged-phase-map.md` — record 012 as the External Project adoption phase

### Out of Scope (handled inline by 002-005)
- Per-packet `feature_catalog/{NN--category}/` entries — written by their respective code sub-phases
- Per-packet `manual_testing_playbook/{NN--category}/` entries — written by their respective code sub-phases
- Code changes (this sub-phase is docs-only)

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `/README.md` | MODIFY | Features section (root) |
| `.opencode/skill/system-spec-kit/SKILL.md` | MODIFY | Capability matrix |
| `.opencode/skill/system-spec-kit/README.md` | MODIFY | Feature index |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | MODIFY | Handler list |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | MODIFY | Verification steps |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | MODIFY | Top-level index |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | MODIFY | Top-level index |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/merged-phase-map.md` | MODIFY | Add 012 entry |

---

## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R-006-1 | Each umbrella doc reflects all capabilities shipped by 012/002-005 |
| R-006-2 | sk-doc DQI score ≥85 on each modified umbrella doc |
| R-006-3 | All file references in updated docs are valid (no broken links) |
| R-006-4 | feature_catalog and manual_testing_playbook top-level indexes list new per-packet entries with correct paths |
| R-006-5 | INSTALL_GUIDE includes a smoke-test step exercising one new capability per sub-phase (002-005) |
| R-006-6 | merged-phase-map.md notes that 012 is the implementation phase derived from pt-01 + pt-02 syntheses |
| R-006-7 | No factual claims unsupported by what 002-005 actually shipped (sync, not aspiration) |

---

## 5. VERIFICATION

- [ ] Each umbrella doc loaded into sk-doc DQI scorer; score ≥85
- [ ] Manual review: changes match 002-005 implementation-summary.md content
- [ ] Link checker (or grep) confirms no broken references
- [ ] feature_catalog.md and manual_testing_playbook.md indexes match on-disk entries
- [ ] INSTALL_GUIDE smoke tests run successfully
- [ ] `validate.sh --strict` passes on this sub-phase
- [ ] Capture before/after diff summary in `implementation-summary.md`

---

## 6. REFERENCES
- 012/spec.md §3 (scope), §4 (R-006 row)
- 012/decision-record.md ADR-012-007 (per-packet inline + trailing rollup)
- pt-02 §11 (no specific packet — this sub-phase is user-requested addition)
- Reference docs to update (paths above)
- sk-doc skill: `.opencode/skill/sk-doc/`
