---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Skill Advisor Affordance Evidence (012/004)"
description: "Wire tool/resource/MCP-resource affordances into existing derived + graph-causal lanes via affordance-normalizer (allowlist sanitizer + privacy preservation). No new scoring lane; no new entity_kinds."
trigger_phrases:
  - "012 affordance evidence"
  - "skill advisor affordance"
  - "tool resource routing evidence"
  - "affordance normalizer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/004-skill-advisor-affordance-evidence"
    last_updated_at: "2026-04-25T11:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized sub-phase scaffold"
    next_safe_action: "Wait for 012/001 license sign-off; then read skill_graph_compiler.py:43 + scorer/lanes/{derived,graph-causal}.ts"
    completion_pct: 0
    blockers: ["012/001 license audit pending"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---
# Feature Specification: Skill Advisor Affordance Evidence (012/004)

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft (blocked on 012/001) |
| **Created** | 2026-04-25 |
| **Branch** | `012/004-skill-advisor-affordance-evidence` |

---

## 2. PROBLEM & PURPOSE

**Problem:** Skill Advisor's compiler whitelist (`skill_graph_compiler.py:43`) is `{skill, agent, script, config, reference}`. Tool/resource affordances from MCP servers (descriptions, next-step hints, AGENTS.md-style tables) currently can't inform routing. The `derived` lane (`scorer/lanes/derived.ts:9-43`) takes prompt + projection but doesn't ingest affordance evidence. Without sanitization, raw tool descriptions could become uncontrolled prompt-stuffing triggers.

**Purpose:** Add an affordance-normalizer that converts tool/resource text into derived triggers + graph-causal edge weights using the existing relation set. Sanitize first, never leak raw matched phrases.

---

## 3. SCOPE

### In Scope
- New `affordance-normalizer.ts` module (allowlist filter + privacy stripping)
- Compile-time pass: tool/resource affordances → derived triggers / source docs
- Score-time pass: weighted edges using existing relations (`depends_on`, `enhances`, `siblings`, `prerequisite_for`, `conflicts_with`)
- Per-packet feature_catalog + manual_testing_playbook entries

### Out of Scope (HARD RULES per pt-02 §12 RISK-05)
- New scoring lane (must use existing `derived` + `graph-causal`)
- New compiler entity_kinds (`tool`, `resource` NOT added)
- New relation types in graph
- Leaking raw matched phrases in recommendation payload
- Skipping sanitization

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/skill_advisor/lib/affordance-normalizer.ts` | NEW | Allowlist filter + privacy-preserving phrase stripping |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py:43` | MODIFY | Accept normalized affordances as derived inputs (NOT new entity_kinds) |
| `mcp_server/skill_advisor/lib/scorer/lanes/derived.ts:9-43` | MODIFY | Accept affordance evidence as additional derived signal |
| `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts:20-81` | MODIFY | Weight affordance edges into existing relation set |
| `feature_catalog/11--scoring-and-calibration/` | NEW entry | Affordance evidence routing |
| `manual_testing_playbook/11--scoring-and-calibration/` | NEW entry | Routing fixture testing |

---

## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R-004-1 | `affordance-normalizer.ts` exposes `normalize(toolDescriptions: AffordanceInput[]): NormalizedAffordance[]` with allowlist of fields permitted to become triggers |
| R-004-2 | Sanitization is **mandatory** — no path bypasses normalization on the way to the scorer |
| R-004-3 | `derived.ts` lane accepts `NormalizedAffordance[]` as additional input alongside `prompt` + `projection` |
| R-004-4 | `graph-causal.ts` lane uses existing `EDGE_MULTIPLIER` constants — no new relations introduced |
| R-004-5 | Compiler whitelist `ALLOWED_ENTITY_KINDS` unchanged: `{skill, agent, script, config, reference}` |
| R-004-6 | Recommendation payload contains NO raw matched phrases (privacy preserved per existing behavior) |
| R-004-7 | Lane attribution: routing decision can be traced back to `derived` and/or `graph-causal` lane (NOT a new lane) |
| R-004-8 | Routing fixtures pass with affordance evidence improving accuracy without overpowering explicit triggers |

---

## 5. VERIFICATION

- [ ] Unit test: `normalize()` strips disallowed fields per allowlist
- [ ] Unit test: prompt-stuffing attempt (long descriptive text) is filtered
- [ ] Unit test: privacy assertion — no raw matched phrase appears in recommendation payload
- [ ] Unit test: lane attribution traces to derived/graph-causal (not new lane)
- [ ] Routing fixture: affordance evidence improves recall without dropping precision below baseline
- [ ] Static check: `ALLOWED_ENTITY_KINDS` unchanged in `skill_graph_compiler.py:43`
- [ ] Static check: no new keys added to `EDGE_MULTIPLIER` in `graph-causal.ts:12-18`
- [ ] `validate.sh --strict` passes
- [ ] sk-doc DQI ≥85 on feature_catalog + playbook entries

---

## 6. REFERENCES
- 012/spec.md §3 (scope), §4 (R-004 row)
- 012/decision-record.md ADR-012-006
- pt-02 §6 (Skill Advisor findings — Strongest analogue, Existing lane, Integration route, Schema limit, Prompt-stuffing risk rows)
- pt-02 §11 Packet 3
- pt-02 §12 RISK-05
- Verified anchors: `skill_graph_compiler.py:43` (ALLOWED_ENTITY_KINDS), `scorer/lanes/derived.ts:9-43`, `scorer/lanes/graph-causal.ts:20-81` + `:12-18` (EDGE_MULTIPLIER)
