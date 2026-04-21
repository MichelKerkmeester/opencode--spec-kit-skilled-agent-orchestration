---
title: "Implementation Plan: Skill Graph Auto-Setup"
description: "Level 2 repair plan for aligning the Phase 007 packet to the completed skill-graph auto-setup implementation."
trigger_phrases:
  - "phase 007 plan"
  - "skill graph auto setup plan"
  - "packet repair plan"
  - "startup logging plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/007-skill-graph-auto-setup"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "copilot"
    recent_action: "Aligned the plan document with the completed Phase 007 implementation surface."
    next_safe_action: "Keep this plan focused on packet maintenance and validation, not new runtime changes."
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skill/skill-advisor/scripts/init-skill-graph.sh"
      - ".opencode/skill/skill-advisor/scripts/skill_advisor.py"
      - ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skill/skill-advisor/SET-UP_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:1cd7f2827a6fb4ea6850c145df1b04f8b2d715eb16f497b18a1902f6f7a2c2a5"
      session_id: "phase-007-plan-repair"
      parent_session_id: "phase-007-packet-repair"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet repair remains documentation-only."
---
# Implementation Plan: Skill Graph Auto-Setup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Python, TypeScript, Markdown/JSON packet metadata |
| **Framework** | skill-advisor CLI + system-spec-kit MCP server |
| **Storage** | `skill-graph.sqlite` plus JSON fallback metadata |
| **Testing** | Strict packet validation plus referenced advisor regression workflow |

### Overview
The code for Phase 007 is already complete, so this plan focuses on repairing the packet around it. The repair makes the packet Level 2-compliant, reconnects it to the real implementation files, and removes the false assumption that the setup guide lives inside the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase scope limited to packet repair, not runtime changes.
- [x] Canonical external paths for the init script, advisor, context server, and setup guide identified.
- [x] Strict validator failure modes captured before editing the packet.

### Definition of Done
- [x] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` use Level 2 headers, anchors, and template markers.
- [x] Packet metadata files exist at the packet root.
- [x] Strict packet validation completes with exit code `0` or `1`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation repair over an already-completed cross-runtime implementation.

### Key Components
- **Packet docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` define the validated Level 2 packet surface.
- **Init entrypoint**: `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` validates metadata, exports JSON, and runs advisor health.
- **Advisor fallback logic**: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` loads SQLite first, then JSON, then auto-compiles JSON if both are missing.
- **Startup and watcher logging**: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` reports fresh creation, existing load, reindex, and new-skill detection.
- **Operator documentation**: `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` covers setup, verification, troubleshooting, and regression commands.

### Data Flow
Packet docs point to the actual implementation files -> reviewers confirm the shipped runtime behavior -> packet metadata enables discovery and continuity -> strict validation confirms the packet now matches the Level 2 contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet Normalization
- [x] Add `_memory` frontmatter and template-source markers to packet docs.
- [x] Replace non-template section headers with the active Level 2 scaffold.
- [x] Create `checklist.md`, `graph-metadata.json`, and `description.json`.

### Phase 2: Evidence Alignment
- [x] Re-anchor requirements to `init-skill-graph.sh`, `skill_advisor.py`, `context-server.ts`, and `.opencode/skill/skill-advisor/SET-UP_GUIDE.md`.
- [x] Remove broken packet-local guide references.
- [x] Preserve the original Phase 007 technical scope without expanding implementation work.

### Phase 3: Verification
- [x] Run strict packet validation.
- [x] Confirm the packet passes or only warns.
- [x] Record the validation result in the completion report.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documentation integrity | Headers, anchors, frontmatter, required files, packet links | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
| Static evidence review | Verify init script, fallback logic, logging, and guide coverage are documented accurately | File inspection of referenced runtime files |
| Regression surface confirmation | Confirm the packet still points to the existing regression workflow and setup guide commands | `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` and `skill_advisor_regression.py` references |
| Manual continuity review | Confirm packet metadata and anchors support future recovery | `graph-metadata.json` plus `_memory` frontmatter review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` | Internal | Green | Packet cannot accurately document the init flow. |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Internal | Green | Packet cannot accurately document fallback loading or health behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Internal | Green | Packet cannot accurately document startup and watcher logging behavior. |
| `.opencode/skill/skill-advisor/SET-UP_GUIDE.md` | Internal | Green | Packet would continue pointing to a nonexistent local guide. |
| Strict validator script | Internal | Green | Packet repair cannot be proven complete. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The repaired packet introduces validation errors or misstates the completed implementation scope.
- **Procedure**: Revert the packet docs and metadata files in this folder only, then restore the prior packet revision from version control.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Packet Normalization) ──► Phase 2 (Evidence Alignment) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet Normalization | Validator error inventory | Evidence alignment, final verification |
| Evidence Alignment | Packet normalization | Final verification |
| Verification | Packet normalization, evidence alignment | Completion report |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet Normalization | Medium | 45-60 minutes |
| Evidence Alignment | Medium | 30-45 minutes |
| Verification | Low | 10-20 minutes |
| **Total** |  | **85-125 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Packet repair stays inside the target phase folder.
- [x] Runtime files are referenced only and not modified.
- [x] Broken guide references are replaced with canonical repo paths.

### Rollback Procedure
1. Revert the modified packet docs and metadata files in this folder.
2. Re-run strict validation to confirm the packet returned to its prior state.
3. Re-open the packet repair with the validator output as the starting point.
4. Document any unresolved validation edge cases before another retry.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Revert packet docs and metadata only; no runtime or database rollback is needed.
<!-- /ANCHOR:enhanced-rollback -->

---
