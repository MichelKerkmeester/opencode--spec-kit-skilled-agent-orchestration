---
title: "...26-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/007-skill-graph-auto-setup/spec]"
description: "Repair the Phase 007 packet so it accurately documents the completed auto-setup work for skill graph initialization, fallback loading, startup logging, setup guide updates, and regression verification."
trigger_phrases:
  - "007-skill-graph-auto-setup"
  - "skill graph auto setup"
  - "init skill graph"
  - "skill graph startup logging"
  - "skill advisor setup guide"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/007-skill-graph-auto-setup"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "copilot"
    recent_action: "Repaired the Phase 007 packet to match the completed implementation scope."
    next_safe_action: "Use this packet as the canonical Phase 007 reference and avoid further scope expansion."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skill/skill-advisor/scripts/init-skill-graph.sh"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skill/skill-advisor/SET-UP_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:8df2e2929e26e7ecf0a56ce9db0b53f14eb93f84b7312c31bc4f95fdf56b4671"
      session_id: "phase-007-packet-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet references now point at the real setup guide path outside the packet."
      - "Phase 007 remains limited to auto-setup, logging, guide, and regression-verification surfaces."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Skill Graph Auto-Setup

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
| **Created** | 2026-04-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../006-skill-graph-sqlite-migration/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 007 implementation work is already present in the runtime files, but the packet drifted away from the active Level 2 template. That drift breaks strict validation, removes structured anchors needed for retrieval, and incorrectly implies a packet-local setup guide instead of the real guide at `.opencode/skill/skill-advisor/SET-UP_GUIDE.md`.

### Purpose
Restore the packet so it accurately documents the completed auto-setup behavior for the skill graph without changing the technical scope or modifying implementation files outside this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the completed `init-skill-graph.sh` initialization workflow.
- Document the advisor's SQLite-first, JSON-fallback, auto-compile loading behavior.
- Document context-server startup and watcher logging for fresh, existing, and changed skill graph states.
- Document the canonical setup guide path at `.opencode/skill/skill-advisor/SET-UP_GUIDE.md`.
- Document the regression-verification surface already shipped with the skill-advisor package.
- Repair this packet so Level 2 strict validation passes or only warns.

### Out of Scope
- Changing runtime behavior in `.opencode/skill/skill-advisor/` or `.opencode/skill/system-spec-kit/mcp_server/`.
- Altering the skill graph schema or MCP tool surface introduced earlier in Phase 006.
- Moving the setup guide into the packet or creating a packet-local duplicate guide.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Align Phase 007 requirements and anchors with the Level 2 template. |
| `plan.md` | Modify | Reframe the packet repair plan around the completed implementation surface. |
| `tasks.md` | Modify | Record the completed documentation-repair tasks for this phase. |
| `checklist.md` | Create | Add Level 2 verification items tied to Phase 007 behavior and packet integrity. |
| `graph-metadata.json` | Create | Add packet metadata for graph-aware packet discovery. |
| `description.json` | Create | Add packet description metadata matching neighboring phase packets. |
| `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` | Reference only | Completed init script covered by this phase. |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Reference only | Completed lazy auto-init and fallback logic covered by this phase. |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Reference only | Completed startup and watcher logging covered by this phase. |
| `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` | Reference only | Canonical external setup guide updated by the completed phase implementation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet MUST describe the completed `init-skill-graph.sh` flow as metadata validation, JSON export, and advisor health verification. | `spec.md`, `plan.md`, and `checklist.md` all cite `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` as the phase init surface. |
| REQ-002 | The packet MUST preserve the implemented advisor loading order: SQLite first, JSON fallback second, auto-compile fallback last. | The packet cites `.opencode/skill/skill-advisor/scripts/skill_advisor.py` and describes the fallback chain without introducing new behavior. |
| REQ-003 | The packet MUST preserve the completed context-server startup and watcher logging intent for skill graph creation, reuse, and new-skill detection. | The packet cites `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` and names the fresh/existing/reindex/new-skill logging states. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The packet MUST reference the real setup guide path `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` and must not imply a packet-local guide file. | No packet doc references a nonexistent packet-local setup guide; packet validation reports no missing markdown references. |
| REQ-005 | The packet MUST include Level 2 structure markers: `_memory` frontmatter, `SPECKIT_TEMPLATE_SOURCE`, required anchors, and required section headers. | Strict validation reports no missing anchors, template headers, or frontmatter-memory-block errors for packet docs. |
| REQ-006 | The packet MUST include a Phase 007 verification checklist tied to init setup, lazy auto-init, startup/watcher logging, guide coverage, and regression verification. | `checklist.md` exists and includes Phase 007-specific P0/P1/P2 verification items with evidence references. |
| REQ-007 | The packet MUST include graph metadata and packet description metadata that match the actual phase and parent packet lineage. | `graph-metadata.json` exists at the packet root and `description.json` describes the same phase scope. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict packet validation for this folder exits with code `0` or `1`.
- **SC-002**: The packet documents the completed implementation scope without changing runtime code outside the packet.
- **SC-003**: All packet-local references to the setup guide use the canonical external path.
- **SC-004**: The packet is retrievable as a Level 2 phase packet via anchors, frontmatter, and graph metadata.

### Acceptance Scenarios

1. **Given** a maintainer opens this packet after the code is already shipped, **when** they read `spec.md`, **then** they can identify the init script, advisor fallback, context-server logging, setup guide, and regression-verification surfaces without consulting stale packet-local filenames.
2. **Given** strict validation is run against the Phase 007 folder, **when** the validator checks headers, anchors, and required files, **then** it finds Level 2-compliant packet docs and no missing `checklist.md`.
3. **Given** a maintainer follows the packet's setup-guide references, **when** they look for the guide, **then** they are directed to `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` instead of a nonexistent packet-local markdown file.
4. **Given** a later session recovers this packet through structured retrieval, **when** it reads anchors and `_memory` frontmatter, **then** it can identify the packet state, lineage, and next safe action without parsing ad hoc prose.
5. **Given** a reviewer verifies the completed phase behavior, **when** they inspect the referenced implementation files, **then** the packet requirements align with the code that already shipped and do not expand scope.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` | Packet would misdescribe the init entrypoint if this script drifts. | Cite the exact script path and keep scope limited to the existing implementation. |
| Dependency | `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Packet would misrepresent fallback behavior if the loader changes. | Describe only the currently implemented SQLite → JSON → auto-compile chain. |
| Dependency | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Packet would lose traceability for startup and watcher logging behavior. | Keep logging references aligned to the current context-server messages. |
| Dependency | `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` | Packet references would break if the guide path changed again. | Use the full canonical path everywhere in the packet. |
| Risk | Packet repair could accidentally widen the phase scope into new runtime work. | Medium | Limit requirements to documentation alignment and already-completed implementation surfaces. |
| Risk | Missing metadata files would weaken packet discovery and continuity. | Medium | Add `checklist.md`, `graph-metadata.json`, `description.json`, and `_memory` blocks as part of the repair. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Packet validation should complete with the existing strict validator invocation and should not require scanning files outside the documented phase surface beyond normal validator behavior.
- **NFR-P02**: Retrieval metadata should remain concise enough for packet discovery without duplicating the full external setup guide inside the packet.

### Security
- **NFR-S01**: Packet repairs must not introduce secrets, tokens, or environment-specific credentials.
- **NFR-S02**: Packet references must use canonical repository paths so operators do not follow misleading documentation into nonexistent files.

### Reliability
- **NFR-R01**: The packet should remain valid even if the implementation files are only referenced and not modified during this repair.
- **NFR-R02**: Structured anchors and `_memory` frontmatter must support future resume flows without requiring manual interpretation of custom headings.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty packet metadata: `graph-metadata.json` and `description.json` must still identify the phase even if no new implementation artifacts are added.
- Cross-runtime paths: references must remain valid from packet readers even though the actual guide and scripts live outside the packet.
- Validation-only repair: the packet must pass strict validation without creating a redundant in-packet copy of the setup guide.

### Error Scenarios
- Missing SQLite database on first run: packet describes that the init script validates metadata and that the MCP server can create SQLite on startup.
- Missing JSON fallback: packet documents advisor auto-compile fallback instead of treating the condition as a permanent failure.
- Stale or new skill metadata: packet documents the watcher logging path for reindex and new-skill detection.

### State Transitions
- Completed implementation with stale docs: this repair updates packet docs only and leaves runtime behavior unchanged.
- Future packet maintenance: later sessions can update metadata or checklist evidence without rewriting the scope statement.
- Validator reruns: packet remains acceptable if the strict validator returns warnings only and no errors.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Four packet docs plus packet metadata files; multiple runtime surfaces referenced but not modified. |
| Risk | 9/25 | Documentation drift can mislead operators, but runtime behavior is already implemented and remains unchanged. |
| Research | 8/20 | Repair required aligning packet docs with existing shell, Python, TypeScript, and guide evidence. |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for scope. The packet repair intentionally preserves the completed Phase 007 technical surface as-is.
- If a future phase changes the setup guide path or startup logging messages, that should be handled by a new packet update rather than broadening this one.
<!-- /ANCHOR:questions -->

---
