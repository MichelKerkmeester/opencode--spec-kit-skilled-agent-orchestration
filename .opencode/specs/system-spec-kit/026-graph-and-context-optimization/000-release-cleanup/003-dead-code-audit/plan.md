---
title: "Implementation Plan: Dead-Code & Disconnected-Code Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Audit-only plan: enumerate reachability anchors, run ts-prune + tsc --noEmit + targeted greps, classify findings into 4 categories, write canonical dead-code-audit-report.md."
trigger_phrases:
  - "dead-code audit plan"
  - "003-dead-code-audit plan"
importance_tier: "important"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit"
    last_updated_at: "2026-04-28T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "T101 enumerate reachability anchors"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Dead-Code & Disconnected-Code Audit

<!-- ANCHOR:summary -->
## Summary

Run a structured 4-pass audit of `.opencode/skill/system-spec-kit/` (focus: `mcp_server/`) to inventory dead and disconnected code, classify findings, and produce a single canonical `dead-code-audit-report.md`. Audit-only; deletions are downstream work.

**Strategy**: build the "alive graph" first (REQ-004 reachability anchors), then run `ts-prune` + `tsc --noEmit` to surface candidates, cross-check each candidate against grep for dynamic-load patterns, classify into 4 buckets, recommend actions with safety rankings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## Quality Gates

Per `checklist.md`:

- **P0**: Every finding cites verifiable file:line; categories populated; reachability anchors enumerated; no fabrications.
- **P1**: Each finding has a recommended action + safety-of-deletion ranking; dynamic-load patterns explicitly handled; per-directory summary table present.
- **P2**: Tooling appendix reproducible; report follows existing audit-report style conventions in this repo (e.g., the feature-catalog-impact-audit pattern).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## Architecture

```
                              .opencode/skill/system-spec-kit/
                              (audit target — recursive)
                                          │
                ┌─────────────────────────┴──────────────────────────┐
                │                                                     │
        ALIVE GRAPH                                          CANDIDATE GRAPH
   (build via REQ-004)                                  (build via tools)
                │                                                     │
   ┌────────────┼────────────┐                          ┌─────────────┼─────────────┐
   │            │            │                          │             │             │
  MCP        scripts/      hooks/                  ts-prune       tsc --noEmit  ad-hoc grep
  tools      (CLI)         (registries)           (unused        (compile     (orphan
  (tools/    + agent/     + commands/             exports)       reachability) files)
   index.ts) + .opencode/                                                ▲
              command/                                                   │
              + tests/                                                   │
                │                                                        │
                └─────────────────────┬──────────────────────────────────┘
                                      │
                              CLASSIFY EACH CANDIDATE:
                              ├── dead (no references anywhere)
                              ├── disconnected (file exists, exports unused, but file
                              │   has shape suggesting it WAS meant to be wired)
                              ├── dynamic-only-reference (references exist but only
                              │   via runtime-resolved paths — needs-investigation)
                              └── false-positive (tool wrong; e.g., barrel re-export)
                                      │
                                      ▼
                              dead-code-audit-report.md
                              ├── Executive summary
                              ├── Reachability anchor enumeration
                              ├── 4 category sections (dead/disconnected/
                              │   dynamic-only/false-positive)
                              ├── Per-finding: file:line, evidence,
                              │   recommendation, safety ranking
                              ├── Per-directory summary table
                              └── Tooling + replication appendix
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Setup (~10 min)

- T001: Verify tooling (`ts-prune`, `knip` (alt), `rg`, `tsc`) available; fall back to `npx ts-prune` if not installed.
- T002: Confirm scope: every audited path starts with `.opencode/skill/system-spec-kit/`. Hard-fail any audit step that would write outside the packet folder.

### Phase 2 — Build Alive Graph (~30 min)

- T101: Enumerate MCP tool registrations from `mcp_server/tools/index.ts` + `mcp_server/context-server.ts` setRequestHandler calls.
- T102: Enumerate CLI scripts under `scripts/` (every `.ts`/`.cjs`/`.js`/`.sh` invoked by package scripts, agents, or commands).
- T103: Enumerate hook registrations: how do hooks get loaded? (static import vs glob/readdir). Document the loader pattern.
- T104: Grep agent/command markdown references: `rg -lF "<symbol-or-path>" .opencode/agent/ .opencode/command/spec_kit/ .claude/agents/ .codex/agents/ .gemini/agents/` for any symbols/paths that might be referenced by name string.
- T105: Enumerate `api/` barrel exports (if `mcp_server/api/` exists) — these are public surfaces.
- T106: Enumerate test imports — every file imported by `mcp_server/tests/**/*.vitest.ts` is alive (its referenced symbols are tested).
- T107: Build the union "alive set" of (file, exported-symbol) pairs. Persist as `audit-state.jsonl`.

### Phase 3 — Run Candidate Detection (~30 min)

- T201: Run `ts-prune` (or `knip`) on the system-spec-kit tsconfig (probably `mcp_server/tsconfig.json`). Capture raw output.
- T202: Run `tsc --noEmit` to confirm the codebase compiles cleanly (sanity check; failures here pollute the audit).
- T203: Build orphan-files candidate set: every `.ts`/`.js`/`.py`/`.sh` whose path doesn't appear in any `import`, `require`, `from`, `source`, or `spawn(...)` statement across the audited tree.
- T204: Build dead-types candidate set: TypeScript types/interfaces declared but never referenced (use `tsc --noEmit --noUnusedLocals` or analogous flag, OR ad-hoc `tsc --listFiles` + grep for type names).
- T205: Build stale-dist candidate set: every `scripts/dist/*.js` whose paired `.ts` source no longer exists.
- T206: Build stale-test candidate set: every `*.vitest.ts` that imports from a path that doesn't resolve.

### Phase 4 — Classify + Recommend (~45 min)

- T301: For each candidate, walk the classification decision tree:
  1. Is the symbol/file in the alive set? → false-positive
  2. Does any file reference the symbol/file via dynamic-load pattern (template-string `import()`, `require()` with built path, `child_process.spawn` reading by path, hook-loader glob)? → dynamic-only-reference, `needs-investigation`
  3. Is the file shape suggestive of "meant to be wired" (handler/tool/hook with proper exports + frontmatter, but not registered)? → disconnected
  4. Otherwise → dead, `high-confidence-delete`
- T302: For each `dead`/`disconnected` finding, write recommended action: `delete` / `wire-in` / `keep-with-rationale`.
- T303: For each finding, assign safety ranking: `high-confidence-delete` / `needs-investigation` / `keep`.

### Phase 5 — Write Report (~30 min)

- T401: Write `dead-code-audit-report.md` with the 9-section structure (executive summary → reachability anchors → 4 category sections → per-directory summary → tooling appendix).
- T402: Build per-directory summary table covering at minimum the 7 directories called out in SC-007.
- T403: Write tooling appendix with exact commands + tool versions + tsconfig path.

### Phase 6 — Verification (~15 min)

- T501: Sample-verify ≥10 random findings exist on disk at cited file:line. Zero fabrications.
- T502: Cross-check classification correctness on 5 random `dead` findings — does the alive-set actually exclude them?
- T503: Run `validate.sh --strict` on the packet.
- T504: Update `implementation-summary.md` with audit summary stats.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is an audit packet — no production code change, so no unit-test additions. The "tests" are evidence-verification:

- **SC-002 sample verification**: pick 10 random findings, confirm file:line resolves on disk
- **SC-003 category coverage**: confirm all 4 categories have content (or explicit "none found" notes)
- **SC-004 anchor enumeration completeness**: walk the alive-graph build phase outputs against the 6 anchor types in REQ-004
- **SC-009 false-delete prevention**: for each `high-confidence-delete` finding, confirm zero references via `rg <symbol-name> .opencode/` produces no hits

If audit reveals real dead code worth deleting, the downstream `004-dead-code-pruning/` packet (future) will:
1. Run vitest before deletion (baseline)
2. Apply deletes in surgical batches per category
3. Run vitest after each batch to confirm no regression
4. Run typecheck to confirm no broken imports

That gates how aggressive the deletion sweep can be — not in scope here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## Dependencies

**Blocking**:
- `npx ts-prune` (or `npx knip`) available
- `tsc` (TypeScript compiler) — already a dev dependency
- `rg` (ripgrep) — system tool

**Read targets**:
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/api/*.ts` (if exists)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/*.ts`
- `.opencode/skill/system-spec-kit/scripts/**/*.{ts,js,sh}`
- `.opencode/skill/system-spec-kit/mcp_server/tests/**/*.vitest.ts`
- `.opencode/agent/*.md`, `.opencode/command/spec_kit/*.md` for symbol/path references
- `.gemini/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml` for cross-runtime references
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This is an audit-only packet. No production code change to roll back.

If the report itself is wrong (e.g., misclassifies live code as dead):
1. Add a correction footnote to `dead-code-audit-report.md`
2. Update the affected finding's classification
3. Re-run the affected portion of the alive-graph build to regenerate state

If the audit produces noise (e.g., ts-prune over-aggressive):
1. Reduce confidence on affected items (`high-confidence-delete` → `needs-investigation`)
2. Document the tool's known false-positive patterns in the tooling appendix

The downstream pruning packet (`004-dead-code-pruning/`, future) is where actual rollback risk lives. This packet just inventories — no risk.
<!-- /ANCHOR:rollback -->
