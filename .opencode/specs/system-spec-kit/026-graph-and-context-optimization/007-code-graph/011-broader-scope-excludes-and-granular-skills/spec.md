---
title: "Feature Specification: Broader Default Excludes and Granular Skills"
description: "Extends 009's code-graph scope policy with broader .opencode defaults and selected skill inclusion."
trigger_phrases:
  - "broader default excludes"
  - "granular skill selection"
  - "per skill code graph"
  - "exclude opencode subdirs"
  - "include skills list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "026/007/011"
    last_updated_at: "2026-05-02T19:50:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented broader code-graph scope excludes and granular skill selection"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "026-007-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder supplied by user; missing folder was created from this packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Broader Default Excludes and Granular Skills

<!-- SPECKIT_LEVEL: 2 -->

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
Packet 009 excluded `.opencode/skill/**` from default code-graph scans, but adjacent internal-heavy folders remained in the default scan surface. The `includeSkills` argument was also all-or-nothing, which made targeted skill graph work expensive when only one or two `sk-*` folders were relevant.

### Purpose
Default scans should stay end-user focused while maintainers can opt in agents, commands, specs, plugins, all skills, or a selected list of `sk-*` skill folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add default excludes for `.opencode/agent/**`, `.opencode/command/**`, `.opencode/specs/**`, and `.opencode/plugins/**` while preserving `.opencode/skill/**`.
- Extend `includeSkills` to `boolean | string[]` and support csv skill lists in `SPECKIT_CODE_GRAPH_INDEX_SKILLS`.
- Add per-folder env vars and scan args: agents, commands, specs, plugins.
- Move the scope fingerprint to v2 and make v1 fingerprints return `null` so read paths require a full scan.
- Surface expanded active scope fields in `code_graph_status`.
- Update schemas, docs, and tests.

### Out of Scope
- Changing graph extraction logic outside scan eligibility.
- Reworking skill-advisor indexing, memory indexing, or code graph query semantics.
- Adding tracked-file counters for each excluded folder.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/index-scope-policy.ts` | Modify | Resolve folder/list policy, env vars, v2 fingerprints. |
| `mcp_server/lib/utils/index-scope.ts` | Modify | Enforce broad excludes and selected skill matching. |
| `mcp_server/code_graph/lib/indexer-types.ts` | Modify | Build default exclude globs from policy fields. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Modify | Return expanded stored scope fields. |
| `mcp_server/code_graph/handlers/scan.ts` | Modify | Accept new scan args. |
| `mcp_server/code_graph/handlers/status.ts` | Modify | Report expanded active scope. |
| `mcp_server/tool-schemas.ts` | Modify | Publish public scan args. |
| `mcp_server/schemas/tool-input-schemas.ts` | Modify | Validate runtime scan args. |
| `mcp_server/utils/tool-input-schema.ts` | Modify | Validate public property unions and string regex. |
| `mcp_server/code_graph/tests/*` | Modify | Add matrix and migration tests. |
| `mcp_server/code_graph/README.md` | Modify | Document broader excludes and selected skills. |
| `mcp_server/ENV_REFERENCE.md` | Modify | Document new env vars. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default code-graph scans exclude all five `.opencode` folders. | Config and walker tests prove skill, agent, command, specs, plugins are excluded by default. |
| REQ-002 | Per-call args override env vars. | Tests cover false-over-true and true-over-false precedence. |
| REQ-003 | `includeSkills` accepts all, none, and selected `sk-*` lists. | Tests cover boolean true, empty list, one-name list, two-name list, and csv env. |
| REQ-004 | Scope fingerprints use deterministic v2 serialization. | Tests prove sorted skill lists serialize identically and parse back. |
| REQ-005 | Stored v1 fingerprints trigger full-scan readiness. | Readiness test stores v1 and verifies blocked read migration behavior. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Status payload exposes expanded scope fields. | Scan/status test verifies `includedSkills`, `includedAgents`, `includedCommands`, `includedSpecs`, and `includedPlugins`. |
| REQ-007 | Public and runtime schemas accept the new args. | Schema tests accept `includeSkills: ["sk-code-review"]` and reject invalid names. |
| REQ-008 | Docs describe the new defaults and env vars. | README and env reference updated. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Gate A focused tests pass.
- **SC-002**: Gate B full code-graph regression passes.
- **SC-003**: Gate C workflow-invariance test passes.
- **SC-004**: Gate D strict validation passes for packets 009 and 011.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | List-based skills cannot use a blanket skill exclude glob. | Walker may never descend into selected skill folders. | Leave skill glob out for list/all and filter by skill name in `shouldIndexForCodeGraph`. |
| Risk | v1 stored scope could be mistaken as current. | Read paths might serve stale graph rows after policy change. | Parse v1 as null and require explicit full scan. |
| Risk | Public schema validator may lag Zod schema. | API shape appears valid publicly but fails at runtime, or the reverse. | Extend public validator and add paired schema tests. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default scans should avoid additional internal-heavy `.opencode` traversal.

### Security
- **NFR-S01**: Path filtering must normalize separators and continue to block `mcp-coco-index/mcp_server`.

### Reliability
- **NFR-R01**: Fingerprints must be deterministic across equivalent skill-list orderings.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty skill list resolves to no skills.
- Invalid public skill names reject at schema validation.
- Csv env skill lists sort and dedupe before fingerprinting.

### Error Scenarios
- Stored v1 fingerprint returns null from parser and forces a full scan.
- Symlink/canonical path handling remains protected by existing root canonicalization.

### State Transitions
- Default to env opt-in to per-call override transitions each produce distinct scope fingerprints.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Shared policy, handlers, schemas, docs, tests. |
| Risk | 16/25 | Env precedence, path filtering, persisted scope migration. |
| Research | 8/20 | Existing 009 implementation gave the baseline. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
