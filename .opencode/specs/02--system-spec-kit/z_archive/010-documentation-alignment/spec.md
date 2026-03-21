---
title: "Feature Specification: Documentation Alignment for Spec 126 [010-documentation-alignment/spec]"
description: "Spec 126 added the largest single MCP server feature since the memory system was created: full spec folder document indexing with schema v13, 11 document types, scoring multipli..."
trigger_phrases:
  - "feature"
  - "specification"
  - "documentation"
  - "alignment"
  - "for"
  - "spec"
  - "010"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->

# Feature Specification: Documentation Alignment for Spec 126

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Spec 126 added the largest single MCP server feature since the memory system was created: full spec folder document indexing with schema v13, 11 document types, scoring multipliers, 2 new intent classifiers, a spec document crawler, and causal relationship chains. None of this is reflected in any documentation. This spec aligns all READMEs, SKILL.md, and reference files with the post-126 state.

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Number** | 127 |
| **Parent** | 02--system-spec-kit |
| **Level** | 1 (documentation-only) |
| **Priority** | P1 |
| **LOC Estimate** | 0 (documentation-only, no code changes) |
| **Files Affected** | 10+ documentation files |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Spec 126 introduced schema v13, 11 document types, 2 new intents (`find_spec`, `find_decision`), scoring multipliers, a spec document crawler, causal chains, and a feature flag — none of which appear in any documentation. Three READMEs, SKILL.md, and four reference files all describe the pre-126 state with stale counts (4-source instead of 5-source, 5 intents instead of 7).

### Purpose

Update all documentation to accurately reflect the post-126 state of the memory system, ensuring consistency across all files.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Root `README.md`: Memory Engine sources, intent scoring table
- `.opencode/skill/system-spec-kit/README.md`: Key innovations, tool params, pipeline, recent changes
- `.opencode/skill/system-spec-kit/mcp_server/README.md`: Innovations, params, intents, feature flags, schema, structure
- `.opencode/skill/system-spec-kit/SKILL.md`: Version, memory tools, key concepts
- `references/memory/memory_system.md`: Sources, tool reference, intent enum
- `references/memory/readme_indexing.md`: Pipeline section, weights
- `references/memory/save_workflow.md`: Other indexed content table
- Changelogs for both system-spec-kit and opencode-environment

### Out of Scope

- Code changes (this is documentation-only)
- Test file updates (comments in test files are informational, not user-facing docs)
- Changelog files for versions prior to this spec

### Files to Change

| File | Action | Change Type |
|------|--------|-------------|
| `README.md` | Modify | Add 5th source, update intents |
| `.opencode/skill/system-spec-kit/README.md` | Modify | Update innovations, pipeline, params, recent changes |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Modify | Update innovations, params, intents, flags, schema, structure |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Bump version, add spec doc indexing, document-type scoring |
| `references/memory/memory_system.md` | Modify | Add 5th source, tool params, intents |
| `references/memory/readme_indexing.md` | Modify | Update pipeline 4->5 source |
| `references/memory/save_workflow.md` | Modify | Add spec docs to indexed content table |
| `.opencode/changelog/01--system-spec-kit/v2.2.17.0.md` | Create | Spec 126+127 combined changelog |
| `.opencode/changelog/00--opencode-environment/v2.0.5.0.md` | Create | Environment-level changelog |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-001 | All "4-source" references updated to "5-source" | Grep for "4-source" returns 0 in modified docs |
| R-002 | All "5 intent" references updated to "7" | Grep for "5 intent" returns 0 in modified docs |
| R-003 | Spec documents listed as 5th indexing source | All pipeline tables include spec documents row |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R-004 | `find_spec` and `find_decision` intents documented | Both appear in intent tables |
| R-005 | Document-type scoring multipliers documented | Multiplier table present in relevant files |
| R-006 | `includeSpecDocs` parameter documented | Parameter appears in tool param tables |
| R-007 | Schema v13 changes noted | `document_type` and `spec_level` columns mentioned |
| R-008 | `SPECKIT_INDEX_SPEC_DOCS` feature flag documented | Flag appears in feature flags table |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Zero stale "4-source" or "5 intent" references in modified files
- SC-002: All three READMEs use consistent numbers: 7 intents, 5 sources, 11 document types
- SC-003: Changelogs created with correct sequential version numbers
- SC-004: No broken ANCHOR tags in edited files

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

## 6. RELATED DOCUMENTS

- Implementation Plan: See `plan.md`
- Task Breakdown: See `tasks.md`
- Parent spec: `.opencode/specs/02--system-spec-kit/z_archive/009-full-spec-doc-indexing`
