---
title: "Plan: Command Alignment"
description: "Documentation-only reconciliation plan for updating the 012 command-alignment spec pack to the live 33-tool, 6-command memory-command surface."
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

This pass does not implement memory-command features. It reconciles the 012 command-alignment planning docs with what the repo already ships today: a 33-tool Spec Kit Memory MCP surface and a 6-command memory suite with retrieval merged into `/memory:analyze`. It also resolved the runtime-doc drift in `analyze.md` and `shared.md` during the 2026-03-21 reconciliation pass.

**Effort Estimate:** Small documentation rewrite limited to the five canonical 012 markdown files plus targeted runtime-doc patches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live schema count verified from `tool-schemas.ts`
- [x] Live command-surface count verified from `.opencode/command/memory/`
- [x] Retrieval ownership verified from `.opencode/command/memory/analyze.md` and `.opencode/command/memory/README.txt`

### Definition of Done
- [ ] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` satisfy required Level 2 anchors and sections
- [ ] The pack preserves the 33-tool / 6-command / `/memory:analyze` ownership story
- [ ] Strict validation passes with no errors or warnings
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only truth reconciliation against live repo sources.

### Key Components
- **Schema inventory**: `tool-schemas.ts` and `schemas/tool-input-schemas.ts` define the canonical 33-tool surface.
- **Runtime command docs**: `.opencode/command/memory/*.md` plus `README.txt` define the live 6-command ownership model.
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
| 0.2 | Count live memory command files | Confirm 6-command suite and no standalone `context` command file | P0 |
| 0.3 | Verify command ownership in `.opencode/command/memory/analyze.md` and `.opencode/command/memory/README.txt` | Confirm retrieval plus `memory_quick_search` ownership | P0 |

### Phase 1: Reconcile the 012 Spec Pack

| Step | File | Changes | Priority |
|------|------|---------|----------|
| 1.1 | `spec.md` | Preserve the live 33-tool / 6-command current-state story and restore required success-criteria anchor coverage | P0 |
| 1.2 | `plan.md` | Restore required Level 2 plan anchors while keeping the reconciliation scope narrow | P0 |
| 1.3 | `tasks.md` | Restore required Level 2 task anchors and phase structure | P0 |
| 1.4 | `checklist.md`, `implementation-summary.md` | Keep verification evidence aligned with the updated pack and validator contract | P1 |

### Phase 2: Verification

| Step | Action | Success Criteria |
|------|--------|-----------------|
| 2.1 | Grep 012 pack for stale count and structure strings | No stale live-state claims remain in canonical docs |
| 2.2 | Run strict validation | Validation passes with no errors or warnings |
| 2.3 | Confirm runtime-doc drift cluster resolved | `analyze.md` and `shared.md` mismatches were resolved during the 2026-03-21 reconciliation pass (13-tool count, governed params, tenantId/actor, auto-grant) |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Required Level 2 anchors and sections in the five scoped files | `validate.sh --strict` |
| Drift checks | Stale `32`, `7 commands`, and standalone `context` command assumptions in canonical docs | `rg` |
| Manual truth audit | Count verification and ownership spot-checks against live command docs and schema files | `sed`, `ls`, `node` |

### Verification Focus

- The 012 pack now describes a 33-tool surface.
- The 012 pack now describes a 6-command suite.
- The 012 pack no longer assumes a standalone `context` command file.
- The 012 pack explicitly assigns retrieval plus `memory_quick_search` to `/memory:analyze`.
- The 012 pack records the drift cluster as resolved, not open.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Internal | Green | Tool-count truth source would be unavailable |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Internal | Green | Parameter-parity verification would be incomplete |
| `.opencode/command/memory/analyze.md` | Internal | Green | Retrieval ownership and governed-parameter drift could not be verified |
| `.opencode/command/memory/shared.md` | Internal | Green | Shared-memory schema-contract drift could not be verified |
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
- If rollback is needed, preserve the current repo-truth counts and ownership notes rather than restoring older 32-tool / 7-command wording.
<!-- /ANCHOR:rollback -->

---

### Implementation Details

### Reconciliation Pattern

For each planning document:

1. Remove stale historical-state claims that conflict with live files.
2. Rebase counts on the current schema and directory state.
3. Convert "planned/missing" language into "already shipped" language where supported by files on disk.
4. Keep only directly verified residual issues in the gap list.

### Truth Boundaries

- Use `tool-schemas.ts` for canonical tool count.
- Use the live command directory to determine command-surface shape.
- Use `.opencode/command/memory/README.txt` and `.opencode/command/memory/analyze.md` as evidence for command ownership.
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
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment --strict
```

---

### Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Old implementation language survives in one section | Medium | Medium | Run targeted stale-string grep after edits |
| Future schema changes make 012 stale again | Medium | Medium | Keep schema files as the explicit source of truth |
| Resolved runtime-doc drift is misrepresented as open | Low | Medium | Drift is recorded as resolved with specific evidence from the 2026-03-21 pass |
| Validation reports unrelated legacy issues | Low | Low | Note them honestly if they appear, but do not widen scope |

---

### Assumptions

- Live repo state wins when it conflicts with older draft text.
- The 6-command suite is the canonical current memory-command surface.
- `README.txt` already provides a complete 33-tool ownership map.
- This pass resolved the runtime-doc drift in `analyze.md` and `shared.md` during the 2026-03-21 reconciliation.

---

<!--
PLAN: 012-command-alignment
Reconciled 2026-03-21
Current baseline: 33 tools, 6 commands, retrieval merged into analyze
-->
