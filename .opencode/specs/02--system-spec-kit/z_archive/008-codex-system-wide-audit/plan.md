---
title: "Implementation Plan: System-Wide Remediation of Confirmed Findings [125-codex-system-wide-audit/plan]"
description: "This plan executes remediation in a strict order"
trigger_phrases:
  - "implementation"
  - "plan"
  - "system"
  - "wide"
  - "remediation"
  - "125"
  - "codex"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: System-Wide Remediation of Confirmed Findings

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 (refactored) -->

---

- **Level**: 3+

<!-- ANCHOR:summary -->
## 1. SUMMARY

This plan executes remediation in a strict order:
1) documentation truth reset,
2) shell/runtime safety fixes,
3) MCP/TypeScript correctness fixes,
4) verification and closure.

The objective is to close all confirmed issues listed in `spec.md` section 4 without introducing new contract drift.

### Technical Context

| Aspect | Value |
|--------|-------|
| Primary languages | Bash, TypeScript, Markdown |
| Runtime surfaces | Spec upgrade scripts, validation rules, MCP memory handlers |
| Verification modes | `bash -n`, targeted shell tests, TypeScript checks/tests, spec validation |
| Data sensitivity | Spec folders and memory index state must remain consistent |

<!-- /ANCHOR:summary -->

---

## 2. CANONICAL CONTRACTS

These contracts are authoritative for this plan.

| Contract | Canonical Value |
|----------|-----------------|
| Upgrade script exit codes | `0=success`, `1=validation/dependency`, `2=upgrade failure`, `3=backup failure` |
| Backup artifact shape | `.backup-<timestamp>/` directory tree preserving relative paths |
| Status discipline | No "Complete" claim while any P0 task/checklist item is open |
| Command examples | Must be runnable from the declared working directory |

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pattern:
- Documentation governance layer (this spec folder)
- Shell remediation layer (upgrade/validation/registry/test scripts)
- MCP remediation layer (dedup/reinforcement/index-scan correctness)

Implementation principle:
- Keep behavior contracts centralized in docs and enforced by verification gates.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. PHASES

## Phase 1: Documentation Re-Baselining (Completed)

Targets:
- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `handover.md`

Deliverables:
- stale assumptions removed,
- open work represented honestly,
- issue inventory synchronized with runtime findings.

## Phase 2: Shell Runtime Remediation (Pending)

### Workstream A: upgrade flow reliability

Files:
- `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`

Actions:
1. Replace undefined `error` call in failure path with defined logging + `error_exit`.
2. Make rollback atomic:
   - restore backed-up files,
   - remove files created during failed upgrade that are absent from backup,
   - fail restore if any copy/delete operation fails.
3. Ensure restore return code is propagated to caller (no silent "restored" success on partial failure).

### Workstream B: level parser parity

Files:
- `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh`

Actions:
1. Use one parsing contract (marker first, then table, then explicit anchored fallback).
2. Eliminate loose prose-trigger regex behavior.
3. Add parity tests/fixtures so all scripts return identical level output for the same folder.

### Workstream C: script discovery

Files:
- `.opencode/skill/system-spec-kit/scripts/scripts-registry.json`
- `.opencode/skill/system-spec-kit/scripts/registry-loader.sh`

Actions:
1. Register `upgrade-level` in registry.
2. Verify `registry-loader.sh` can resolve it by name and trigger.

### Workstream D: test isolation

Files:
- `.opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh`

Actions:
1. Remove in-place rename of shared `shell-common.sh`.
2. Use isolated fixture/shim approach for dependency-failure tests.
3. Add exact exit-code assertions (not just non-zero).

## Phase 3: MCP/TypeScript Remediation (Pending)

### Workstream E: DB update signal consistency

Files:
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`

Actions:
1. Replace hardcoded marker path in memory indexer with shared config path.
2. Validate marker detection across default and env-overridden DB directories.

### Workstream F: memory save and dedup correctness

Files:
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

Actions:
1. Make dedup behavior explicit when DB unavailable (no silent bypass).
2. Return non-success/degraded result for zero-row reinforcement updates.

### Workstream G: index scan cooldown semantics

Files:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`

Actions:
1. Move cooldown timestamp update to post-success path.
2. Keep failed scans from consuming cooldown budget.

## Phase 4: Verification and Closure (Pending)

Actions:
1. Run targeted shell checks and update evidence logs.
2. Run targeted TypeScript tests/checks for changed handlers.
3. Reconcile checklist/task status against actual outcomes.
4. Update implementation summary and handover with truthful completion state.

<!-- /ANCHOR:phases -->

---

## 5. VERIFICATION COMMAND MANIFEST

The commands below are intentionally path-corrected.

### From repo root (`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public`)

```bash
bash ".opencode/skill/system-spec-kit/scripts/spec/validate.sh" ".opencode/specs/02--system-spec-kit/z_archive/008-codex-system-wide-audit"
bash ".opencode/skill/system-spec-kit/scripts/tests/test-upgrade-level.sh"
node --check ".opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js"
```

### From scripts directory (`.opencode/skill/system-spec-kit/scripts`)

```bash
tsc --build 2>&1 | tee "../../../specs/02--system-spec-kit/z_archive/006-generate-context-subfolder/scratch/build-output.txt"
node tests/test-subfolder-resolution.js 2>&1 | tee "../../../specs/02--system-spec-kit/z_archive/006-generate-context-subfolder/scratch/test-results.txt"
node dist/memory/generate-context.js "02--system-spec-kit/z_archive/006-generate-context-subfolder"
node dist/memory/generate-context.js ".opencode/specs/02--system-spec-kit/z_archive/006-generate-context-subfolder"
node dist/memory/generate-context.js ".opencode/specs/02--system-spec-kit/z_archive/006-generate-context-subfolder"
```

---

## 6. EVIDENCE ARTIFACTS

Required evidence targets:

| Phase | Artifact |
|------|----------|
| Shell fixes | `scratch/verify-shell-runtime-remediation.md` |
| Parser parity | `scratch/verify-level-parser-parity.md` |
| Registry integration | `scratch/verify-registry-upgrade-level.md` |
| MCP fixes | `scratch/verify-mcp-runtime-remediation.md` |
| End-to-end closure | `scratch/verification-evidence.md` |

---

<!-- ANCHOR:quality-gates -->
## 7. QUALITY GATES

### Definition of Ready

- Confirm each targeted defect has an owner task in `tasks.md`.
- Confirm each owner task has at least one verification entry in `checklist.md`.
- Confirm command examples in docs are executable from stated cwd.

### Definition of Done

- All P0 checklist items are marked `[x]` with evidence references.
- No stale completion/orphan statements remain in root docs.
- Parser, rollback, and memory-path contracts are validated by targeted tests.
- `implementation-summary.md` and `handover.md` reflect actual state.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK STRATEGY

- If any remediation change introduces regressions, revert only the affected file(s), keep docs truthful, and record regression in `scratch/verification-evidence.md`.
- Do not mark any P0 item complete unless its verification command and expected behavior both pass.

<!-- /ANCHOR:rollback -->

---

## 9. RISK MITIGATION

| Risk | Mitigation |
|------|------------|
| Fixing rollback introduces data-loss edge case | Add fixture test for failed multi-step upgrade with created-file cleanup |
| Parser alignment breaks existing docs | Add parity fixture set before changing regex logic |
| Dedup policy change impacts response volume | Add explicit behavior note and regression test around DB unavailable scenario |
| Docs drift returns after patching | Require checklist + implementation-summary updates in same change set |

---

## 10. SIGN-OFF REQUIREMENTS

| Milestone | Criteria |
|----------|----------|
| Documentation re-baseline | Root docs aligned and contradiction-free |
| Shell remediation complete | `REQ-C01..REQ-C05` verified |
| MCP remediation complete | `REQ-M01..REQ-M04` verified |
| Final closure | All P0 items complete and evidence-linked |

---

<!-- ANCHOR:ai-execution -->
## 11. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm target requirement IDs before implementation.
- Confirm target file and test path exist.
- Confirm checklist evidence destination is defined.
- Confirm task dependency order for the current change set.

### Execution Rules

| Rule ID | Rule |
|---------|------|
| TASK-SEQ | Do not start verification updates before implementation tasks complete |
| TASK-SCOPE | Only modify files mapped to the active remediation task |
| TASK-EVIDENCE | Every completed P0/P1 task must link evidence output |
| TASK-TRUTH | Never mark complete while any linked P0 checklist item is open |

### Status Reporting Format

- Phase
- Task IDs completed in this step
- P0 ratio
- Evidence file(s) updated
- Remaining blockers

### Blocked Task Protocol

- Mark blocked work with `[B]` in `tasks.md`.
- Record exact blocker dependency and owner.
- Record unblock condition in one line.
- Keep linked checklist items open until blocker is resolved.

<!-- /ANCHOR:ai-execution -->
