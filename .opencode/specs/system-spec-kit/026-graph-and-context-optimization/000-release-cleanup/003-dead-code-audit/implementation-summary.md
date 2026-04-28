---
title: "Implementation Summary: Dead-Code & Disconnected-Code Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Dead-code audit executed for .opencode/skill/system-spec-kit/: reachability anchors enumerated, candidates classified, report and audit-state written."
trigger_phrases:
  - "003 implementation summary"
  - "dead-code audit summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit"
    last_updated_at: "2026-04-28T08:56:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Executed dead-code and disconnected-code audit"
    next_safe_action: "Review dead-code-audit-report.md, then scope downstream 004-dead-code-pruning if approved"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: Dead-Code & Disconnected-Code Audit

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-dead-code-audit |
| **Status** | Audit complete; downstream pruning pending operator approval |
| **Level** | 1 |
| **Created** | 2026-04-28 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The audit deliverables are now authored:

- `audit-state.jsonl` records setup, reachability anchors, candidate sets, and finding summaries.
- `dead-code-audit-report.md` is the canonical report with executive summary, all six REQ-004 anchor types, category sections, per-finding evidence, per-directory summary, and replication appendix.
- This `implementation-summary.md` now records the actual audit stats and verification outcome.

Audit scope covered 2,648 owned code files under `.opencode/skill/system-spec-kit/`, excluding third-party `node_modules` and keeping generated `dist/` artifacts in scope where the packet required them. Extension breakdown: 1,876 TypeScript, 676 JavaScript, 20 CJS, 10 Python, and 66 shell files.

Finding counts:

| Category | Count | Action posture |
|---|---:|---|
| `dead` | 13 | delete in downstream pruning packet |
| `disconnected` | 0 | no action |
| `dynamic-only-reference` | 15 | keep unless runtime hook wiring is removed |
| `false-positive` | 5 | keep with rationale |

Top high-confidence delete recommendations:

- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:97` unused `memoryParser` import.
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:950` unused private `isMarkdownOrTextFile`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:624` unused private `deleteCausalEdgesForMemoryIds`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:416` unused `failedCount`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/extract.ts:45` unused `SOURCE_CATEGORIES`.

Top needs-investigation keep items:

- Claude hook entrypoints under `mcp_server/hooks/claude/`, reachable through `.claude/settings.local.json`.
- Codex hook entrypoints under `mcp_server/hooks/codex/`, reachable through `.codex/settings.json`.
- Gemini hook entrypoints under `mcp_server/hooks/gemini/`, reachable through `.gemini/settings.json`.
- Copilot hook helpers under `mcp_server/hooks/copilot/`, reachable through the managed custom-instructions hook contract.
- `mcp_server/hooks/codex/prompt-wrapper.ts`, documented as the fallback when native Codex hooks are unavailable.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Execution followed the packet plan:

1. Read `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` in full before auditing.
2. Captured tool availability: TypeScript 5.9.3 and ripgrep 15.1.0 were available; `ts-prune` and `knip` were not locally installed and could not be fetched because the sandbox has no registry network access.
3. Built the alive graph from MCP tool dispatchers, script references, hook settings, cross-runtime markdown references, API barrels, and test imports.
4. Ran candidate detection with local `tsc`, path/import greps, stale-dist pairing, and stale-test resolution.
5. Classified findings using the packet decision tree.
6. Wrote `audit-state.jsonl` and `dead-code-audit-report.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Audit-only, no deletions.** Deletions land in a downstream packet (`004-dead-code-pruning/`, future, not yet scoped). This packet ships findings + recommendations only. Operator reviews the report before any code is removed.
- **Hard scope guard**: every audited path MUST start with `.opencode/skill/system-spec-kit/`. Cross-runtime mirrors (`.gemini/skills/...`, `.claude/skills/...`, `.codex/skills/...`) are excluded — they're hardlinked, so a finding in `.opencode/skill/...` automatically applies to all 4 runtimes when fixed.
- **4-category classification**: `dead` / `disconnected` / `dynamic-only-reference` / `false-positive`. The `dynamic-only-reference` bucket is critical — it captures runtime-resolved imports that ts-prune misses. Auto-classified `needs-investigation`, never `high-confidence-delete`.
- **Slot 003 reused**: parent manifest previously listed `003-testing-playbook` as a planned phase, but no folder ever materialized in git. This packet takes slot 003 (renamed to `003-dead-code-audit`); `003-testing-playbook` is dropped from the parent manifest as stale.
- **`node_modules` excluded.** The literal recursive tree contains third-party dependency code; this audit excludes `**/node_modules/**` and documents that boundary in the report. Owned generated `dist/` files remain in scope for stale-source checks.
- **`ts-prune` fallback.** Because `ts-prune` and `knip` could not be fetched, the audit uses TypeScript unused diagnostics plus manual reachability checks. Findings are therefore conservative and focused on evidence-backed candidates.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Expected | Observed |
|-------|----------|----------|
| Sample-verify >=10 random findings resolve on disk | 10/10 | 10/10 resolved with `sed -n NUMp` |
| Cross-check 5 random `dead` findings via `rg` | 5/5 confirmed | 5/5 exact dead declarations found only at cited lines |
| `tsc --noEmit` | exit 0 | exit 0 |
| `tsc --noUnusedLocals --noUnusedParameters` | candidate diagnostics | 13 unused-code diagnostics |
| Stale `scripts/dist` files | 0 | 0 / 244 |
| Stale test imports | 0 real broken imports | 0 after resolver correction |
| `validate.sh --strict` Errors | 0 | exit 0, Errors 0, Warnings 0 |
| All 4 categories populated or explicit "none" | yes | yes |
| Reachability anchor enumeration covers 6 anchor types | yes | yes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No `ts-prune`/`knip` output.** Both tools were unavailable without network access, so the report documents the fallback and does not claim a real ts-prune run.
- **Dynamic-load gap.** Runtime hooks are intentionally classified as `dynamic-only-reference`, never high-confidence delete.
- **Generated artifacts.** `scripts/dist` pairing is clean, but broader `mcp_server/dist` declaration artifacts are treated as build output noise rather than deletion findings.
- **Audit-only.** The report recommends deletes but does not remove code.
<!-- /ANCHOR:limitations -->
