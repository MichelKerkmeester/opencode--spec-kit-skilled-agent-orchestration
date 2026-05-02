---
title: "Plan: Command Alignment [system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/plan]"
description: "Documentation-only reconciliation plan for updating the 012 command-alignment spec pack to the live 33-tool, 4-command memory-command surface plus /spec_kit:resume recovery ownership."
trigger_phrases:
  - "plan"
  - "command"
  - "alignment"
  - "012"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/012-command-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_LEVEL: 2 -->
# Plan: 012-command-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation for the OpenCode system-spec-kit workflow |
| **Framework** | Level 2 spec-pack templates with strict validator enforcement |
| **Storage** | Repo markdown under `.opencode/specs/.../012-command-alignment/` |
| **Testing** | `validate.sh --strict`, targeted grep, and live file-count verification |

### Overview

This pass does not add new MCP tools. It reconciles the 012 command-alignment planning docs with what the repo already ships today: a 33-tool Spec Kit Memory MCP surface, a 4-command memory suite, session recovery owned by `/spec_kit:resume`, retrieval plus analysis owned by `/memory:search`, and shared-memory lifecycle nested under `/memory:manage shared`.

**Effort Estimate:** Small documentation rewrite limited to the five canonical 012 markdown files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live schema count verified from `tool-schemas.ts`
- [x] Live command-surface count verified from `.opencode/command/memory/`
- [x] Retrieval and shared-lifecycle ownership verified from `.opencode/command/memory/search.md`, `.opencode/command/memory/manage.md`, and `.opencode/command/memory/README.txt`

### Definition of Done
- [ ] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` satisfy required Level 2 anchors and sections
- [ ] The pack preserves the 33-tool / 4-command / `/spec_kit:resume` + `/memory:search` + `/memory:manage shared` ownership story
- [ ] Strict validation passes with no errors or warnings
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only truth reconciliation against live repo sources.

### Key Components
- **Schema inventory**: `tool-schemas.ts` and `schemas/tool-input-schemas.ts` define the canonical 33-tool surface.
- **Runtime command docs**: `.opencode/command/memory/*.md`, `.opencode/command/spec_kit/resume.md`, and the README surfaces define the live 4-command ownership model plus spec-kit recovery routing.
- **Spec pack**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` carry the reconciled narrative.

### Data Flow
Read live schema and command-doc evidence, update the five scoped planning documents so their counts and ownership claims match, then run strict validation on the spec pack.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Validate the Live Baseline

| Step | Action | Output | Priority |
|------|--------|--------|----------|
| 0.1 | Recount `TOOL_DEFINITIONS` | Confirm 33-tool baseline | P0 |
| 0.2 | Count live memory command files | Confirm 4-command suite, no standalone `/memory:analyze`, and no standalone `/memory:shared` command file | P0 |
| 0.3 | Verify command ownership in `.opencode/command/memory/search.md`, `.opencode/command/memory/manage.md`, and `.opencode/command/memory/README.txt` | Confirm retrieval plus `memory_quick_search` ownership under `search`, and shared lifecycle under `manage shared` | P0 |

### Phase 1: Reconcile the 012 Spec Pack

| Step | File | Changes | Priority |
|------|------|---------|----------|
| 1.1 | `spec.md` | Preserve the live 33-tool / 4-command current-state story and restore required success-criteria anchor coverage | P0 |
| 1.2 | `plan.md` | Restore required Level 2 plan anchors while keeping the reconciliation scope narrow | P0 |
| 1.3 | `tasks.md` | Restore required Level 2 task anchors and phase structure | P0 |
| 1.4 | `checklist.md`, `implementation-summary.md` | Keep verification evidence aligned with the updated pack and validator contract | P1 |

### Phase 2: Verification

| Step | Action | Success Criteria |
|------|--------|-----------------|
| 2.1 | Grep 012 pack for stale count and structure strings | No stale live-state claims remain in canonical docs |
| 2.2 | Run strict validation | Validation passes with no errors or warnings |
| 2.3 | Confirm rename/merge alignment reflected | Canonical docs consistently use `search` and `manage shared` instead of stale `analyze` and standalone `shared` wording |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Required Level 2 anchors and sections in the five scoped files | `validate.sh --strict` |
| Drift checks | Stale `32`, `/memory:analyze`, `/memory:shared`, and stale 5-command assumptions in canonical docs | `rg` |
| Manual truth audit | Count verification and ownership spot-checks against live command docs and schema files | `sed`, `ls`, `node` |

### Verification Focus

- The 012 pack now describes a 33-tool surface.
- The 012 pack now describes a 4-command memory suite plus `/spec_kit:resume` recovery ownership.
- The 012 pack no longer treats `/memory:analyze` or `/memory:shared` as current standalone commands.
- The 012 pack explicitly assigns retrieval plus `memory_quick_search` to `/memory:search`.
- The 012 pack explicitly assigns shared-memory lifecycle to `/memory:manage shared`.
- The 012 pack stays truthful about scope by limiting its claims to the five canonical 012 docs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Internal | Green | Tool-count truth source would be unavailable |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Internal | Green | Parameter-parity verification would be incomplete |
| `.opencode/command/memory/search.md` | Internal | Green | Retrieval ownership could not be verified |
| `.opencode/command/memory/manage.md` | Internal | Green | Shared-memory lifecycle ownership could not be verified |
| `.opencode/command/memory/README.txt` | Internal | Green | Command-home coverage matrix could not be verified |
| `validate.sh` | Internal | Green | Pack completion could not be claimed honestly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails after the reconciliation rewrite or the pack loses the current truth-reconciled ownership story.
- **Procedure**: Revert the scoped markdown files to the last validator-passing revision, then re-apply only the minimal anchor and section fixes required by the template.

### Documentation Rollback Notes

- No runtime behavior changes are part of this pass.
- Rollback is limited to the five scoped markdown files.
- If rollback is needed, preserve the current repo-truth counts and ownership notes rather than restoring older 32-tool / stale `analyze` / stale `shared` wording.
<!-- /ANCHOR:rollback -->

---

### Implementation Details

### Reconciliation Pattern

For each planning document:

1. Remove stale historical-state claims that conflict with live files.
2. Rebase counts on the current schema and directory state.
3. Convert "planned/missing" language into "already shipped" language where supported by files on disk.
4. Keep scope claims limited to the five canonical docs.

### Truth Boundaries

- Use `tool-schemas.ts` for canonical tool count.
- Use the live command directory to determine command-surface shape.
- Use `.opencode/command/memory/README.txt`, `.opencode/command/memory/search.md`, and `.opencode/command/memory/manage.md` as evidence for command ownership.
- Do not infer missing work if the command/docs already exist.

---

### Verification Commands

Recommended checks:

```bash
node - <<'NODE'
const fs = require('fs');
const text = fs.readFileSync('.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts', 'utf8');
console.log((text.match(/name:\s*'/g) || []).length);
NODE

ls .opencode/command/memory

rg -n "32-tool|32 tools|7-command|7 commands|context" \
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment

rg -n "/memory:analyze|/memory:shared|analyze\\.md|shared\\.md|5-command|5 commands" \
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-command-alignment --strict
```

---

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Old implementation language survives in one section | Medium | Medium | Run targeted stale-string grep after edits |
| Future schema changes make 012 stale again | Medium | Medium | Keep schema files as the explicit source of truth |
| Rename/merge alignment is only partially reflected | Medium | Medium | Run targeted stale-string grep after edits and validate the whole packet |
| Validation reports unrelated legacy issues | Low | Low | Note them honestly if they appear, but do not widen scope |

---

### Assumptions

- Live repo state wins when it conflicts with older draft text.
- The 4-command suite is the canonical current memory-command surface.
- Session recovery belongs to `/spec_kit:resume`, not `/memory:continue`.
- `README.txt` already provides a complete 33-tool ownership map.
- This pass reflects already-landed rename/merge work without editing command docs outside the packet.

---

<!--
PLAN: 012-command-alignment
Reconciled 2026-03-27
Current baseline: 33 tools, 4 memory commands, session recovery owned by /spec_kit:resume
-->
