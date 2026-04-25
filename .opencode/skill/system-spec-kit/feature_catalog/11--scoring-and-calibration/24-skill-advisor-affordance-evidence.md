---
title: "Skill Advisor affordance evidence"
description: "Privacy-preserving affordance normalization feeds tool and resource hints into existing Skill Advisor derived and graph-causal scoring lanes without adding a scoring lane, entity kind, or relation type."
---

# Skill Advisor affordance evidence

## 1. OVERVIEW

Skill Advisor affordance evidence lets callers provide tool, resource, or MCP-resource hints as structured inputs. The scorer can use these hints to improve recall for prompts that match an available tool capability, while explicit author signals stay stronger than affordance-only evidence.

The feature is deliberately narrow. Affordances pass through an allowlist normalizer, then contribute only to `derived_generated` and `graph_causal`. The public recommendation payload continues to omit raw matched phrases.

---

## 2. CURRENT REALITY

`affordance-normalizer.ts` accepts only `skillId`, `name`, `triggers[]`, `category`, and existing relation fields such as `dependsOn[]` or `enhances[]`. Free-form `description` text is ignored. URLs, email addresses, token-shaped fragments, control characters, and instruction-shaped strings are stripped before any phrase can affect scoring.

`scoreAdvisorPrompt()` normalizes raw affordance inputs before lane execution. The derived lane scores sanitized affordance trigger matches with reduced weight and records only stable labels such as `affordance:mcp-chrome-devtools:0`. The graph-causal lane converts normalized affordance relations into temporary edges that reuse `depends_on`, `enhances`, `siblings`, `prerequisite_for`, and `conflicts_with`.

The Python graph compiler mirrors the same contract for derived metadata. It can compile `derived.affordances[]` into `signals` and sparse adjacency without changing `ALLOWED_ENTITY_KINDS`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts` | Skill Advisor | Allowlist sanitizer and privacy stripping for affordance inputs |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Skill Advisor | Adds normalized affordance triggers to `derived_generated` scoring |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Skill Advisor | Adds normalized affordance edges using existing graph-causal edge multipliers |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Skill Advisor | Forces affordance normalization before scorer lane execution |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Skill Advisor | Compiles `derived.affordances[]` as derived inputs without new entity kinds |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/affordance-normalizer.test.ts` | Vitest | Allowlist, privacy, and no raw phrase attribution checks |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lane-attribution.test.ts` | Vitest | Confirms affordance evidence appears through `derived_generated` and `graph_causal` only |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts` | Vitest | Recall improvement and explicit-trigger precedence fixtures |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py` | Python | Compiler affordance normalization and entity-kind allowlist regression checks |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md`
