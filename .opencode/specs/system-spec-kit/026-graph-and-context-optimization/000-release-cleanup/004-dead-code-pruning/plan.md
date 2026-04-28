---
title: "Implementation Plan: Dead-Code Pruning"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Apply 13 high-confidence dead-code deletes from 003-audit. Verify with tsc --noEmit + tsc --noUnusedLocals + vitest run. Cascade-orphan cleanup in same packet."
trigger_phrases:
  - "004-dead-code-pruning plan"
  - "dead-code pruning plan"
importance_tier: "important"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-dead-code-pruning"
    last_updated_at: "2026-04-28T09:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Validate packet"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Dead-Code Pruning

<!-- ANCHOR:summary -->
## Summary

Mechanical 13-delete sweep across `.opencode/skill/system-spec-kit/mcp_server/` driven by `../003-dead-code-audit/dead-code-audit-report.md`. Each delete is small (1-10 lines). Verify by typecheck + vitest. Clean up cascade orphans (symbols whose only consumer was a listed delete) in the same packet so the strict-unused baseline stays green.

**Strategy**: read each cited file at the cited line, confirm the symbol still matches what the audit said, apply minimal Edit, run `tsc` + `vitest`, document outcomes per finding.

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server tree) |
| **Framework** | MCP server package |
| **Storage** | Source files only; no runtime mutation |
| **Testing** | `tsc --noEmit`, `tsc --noUnusedLocals --noUnusedParameters`, full `vitest run` |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## Quality Gates

Per `checklist.md`:

- **P0**: All 13 deletes applied (or skipped with documented reason); `tsc --noEmit` exit 0; `tsc --noUnusedLocals` exit 0; `vitest run` passes; no scope drift outside cited symbols.
- **P1**: Cascade orphans cleaned; stale comments trimmed; per-finding outcome documented.
- **P2**: Tooling appendix reproducible; `validate.sh --strict` on packet exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## Architecture

```
       ../003-dead-code-audit/dead-code-audit-report.md
                              │
                              │ (13 high-confidence deletes
                              │  cited by file:line + symbol)
                              ▼
              ┌──────────────────────────────────┐
              │   For each finding (1..13)        │
              │   1. Read file at cited line      │
              │   2. Verify symbol still matches  │
              │   3. Apply minimal Edit:          │
              │      - destructured import: drop  │
              │        only the unused symbol     │
              │      - sole import: drop full line│
              │      - constant: drop declaration │
              │      - private fn: drop fn block  │
              │      - test local: drop variable  │
              └──────────────┬───────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ tsc --noEmit + strict│
                    │ vitest run          │
                    └─────────┬───────────┘
                              │
                              │ cascade orphan?
                              ▼
                    ┌─────────────────────┐
                    │ Remove orphan in     │
                    │ same packet          │
                    │ Re-run typecheck     │
                    └─────────────────────┘
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Read + Verify (~10 min)

- T001: Read `../003-dead-code-audit/dead-code-audit-report.md` Category: `dead` table — confirm 13 findings.
- T002: For each finding, read the cited file at the cited line; verify the symbol still matches (line numbers may have drifted; verify by symbol name).

### Phase 2 — Apply Deletes (~15 min)

- T101..T113: Apply each of the 13 deletes (one Edit per finding). For destructured imports, drop only the unused symbol and keep siblings. For sole imports, drop the entire line. For unused constants and private helpers, drop the declaration. For unused test locals, drop the variable line.
- T114: Run strict typecheck `tsc --noUnusedLocals --noUnusedParameters` to detect cascade orphans.
- T115: For each cascade orphan, apply minimal Edit to remove it. Re-run strict typecheck until exit 0.

### Phase 3 — Verification (~10 min)

- T201: Run `tsc --noEmit` — must exit 0.
- T202: Run `vitest run` — must pass.
- T203: Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — Errors=0 (SPEC_DOC_INTEGRITY accepted noise).
- T204: Update `implementation-summary.md` with per-finding outcome.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is a deletion packet — no new tests, no new production code. The verification is:

- **SC-002 / SC-003 typecheck**: `tsc --noEmit` and `tsc --noUnusedLocals --noUnusedParameters` both exit 0.
- **SC-004 vitest**: full `vitest run` passes; no regression compared to pre-delete baseline.
- **SC-005 / SC-006 scope**: no files outside `mcp_server/` modified; no sibling packets touched.
- **SC-008 validate**: `validate.sh --strict` on the packet exits 0.

Pre-delete baseline (from audit's tooling appendix):
- normal `tsc --noEmit` exit 0
- `tsc --noUnusedLocals --noUnusedParameters` exit 2 with 13 unused-code diagnostics

Post-delete expected:
- normal `tsc --noEmit` exit 0
- `tsc --noUnusedLocals --noUnusedParameters` exit 0
- `vitest run` passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## Dependencies

**Blocking**:
- `../003-dead-code-audit/dead-code-audit-report.md` exists and is authoritative (verified: yes)
- TypeScript compiler available locally (`mcp_server/node_modules/.bin/tsc`)
- `vitest` available locally (`mcp_server/node_modules/.bin/vitest`)
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` reachable

**Read targets**:
- All 13 file paths listed in spec.md §3 In Scope
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a delete breaks `tsc` or `vitest`:

1. Identify the offending finding by error message
2. Restore that single finding using `git checkout -- <file>` for that path
3. Document the skip in `implementation-summary.md` (with reason: "audit miscategorized — symbol IS used at <path:line>")
4. Continue with the remaining deletes

If the cascade-orphan chain is deeper than one level:

1. Stop chasing the cascade
2. Document the chain in `implementation-summary.md`
3. Defer deeper cleanup to a follow-up packet (out of scope for this surgical sweep)

If `validate.sh --strict` reports Errors > 0 (excluding SPEC_DOC_INTEGRITY noise):

1. Address the structural error in this packet's docs (typically frontmatter or anchors)
2. Re-run `validate.sh --strict` until clean
<!-- /ANCHOR:rollback -->
