---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: OpenCode Plugin Loader Remediation"
description: "Outcome A shipped: OpenCode plugin helpers were moved out of `.opencode/plugins/`, the real plugin entrypoints now resolve relocated helpers, plugin-folder purity is guarded by vitest, and OpenCode starts without the `plugin2.auth` crash in sandbox-safe smokes."
trigger_phrases:
  - "opencode plugin loader complete"
  - "026/007/009 implementation"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/009-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-22T16:01:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "P1 follow-up fixes applied; full vitest gate formally deferred"
    next_safe_action: "Resolve parent-tracked Copilot hook wiring mismatch"
    blockers:
      - "Full `npx vitest run` fails in `copilot-hook-wiring.vitest.ts` because current `.github/hooks/superset-notify.json` points at Superset hook commands while the test expects repo-local Copilot hook commands."
    completion_pct: 95
    open_questions:
      - "Should the out-of-scope Copilot hook config be aligned to the sibling 007/008 expectations?"
    answered_questions:
      - "Outcome A is feasible because OpenCode 1.3.17 uses a flat `{plugin,plugins}/*.{ts,js}` local plugin glob."
      - "The observed null-hook source includes the compact plugin's named parser export under the legacy loader path, so the parser now fails open with `{}` for non-string inputs."
---
# Implementation Summary: OpenCode Plugin Loader Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-opencode-plugin-loader-remediation |
| **Completed** | 2026-04-22 |
| **Level** | 3 |
| **Outcome** | A, helper isolation plus legacy export hardening |
| **OpenCode Version** | 1.3.17 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

OpenCode plugin helper modules now live outside the plugin discovery folder. `.opencode/plugins/` contains only the two real plugin entrypoints plus `README.md`; the three helper modules moved to `.opencode/plugin-helpers/`.

The two plugin entrypoints were updated to resolve relocated helpers by relative `import.meta.url` paths. `spec-kit-compact-code-graph.js` also hardens its named `parseTransportPlan()` export so legacy loader invocation returns an empty hook object instead of `null`.

A new vitest guard scans `.opencode/plugins/*.{js,mjs,ts}`, dynamically imports each file, and fails if any file lacks a default export. The plugin folder README documents the entrypoints-only convention and the OpenCode 1.3.17 upgrade probe.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 documented the OpenCode discovery contract in ADR-001 using official docs, installed package types, installed binary strings, and sandbox-safe empirical probes. ADR-002 selected Outcome A and rejected no-op helper plugins and undocumented opt-outs.

Phase 2 moved the helper files to `.opencode/plugin-helpers/`, updated the two plugin entrypoints, and preserved the subprocess bridge architecture. `git mv` was attempted, but sandbox permissions prevented taking `.git/index.lock`; the filesystem move was used instead.

Phase 3 added the regression guard, README, helper comments, focused test updates, parent handover entry, checklist evidence, and this implementation summary.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use Outcome A | The installed 1.3.17 plugin glob is flat; a sibling helper folder is outside discovery scope and avoids helper files becoming plugin candidates. |
| Keep bridge subprocesses | The existing design isolates native-module/runtime concerns from the OpenCode host process. |
| Add parser guard | The legacy loader can invoke named function exports; returning `{}` for non-string parser input prevents a null hook. |
| Add folder purity test | It catches future helper drift before OpenCode reaches the TUI worker crash path. |
| Leave historical docs untouched | The user locked scope to `spec.md` §3 plus packet docs; archival references remain historical evidence rather than active executable paths. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `opencode --version` | PASS, returned `1.3.17` during the probe |
| Pre-fix probe | PASS, XDG-isolated OpenCode reproduced `TypeError: null is not an object (evaluating 'plugin2.auth')` |
| `ls .opencode/plugins/` | PASS, shows only `README.md`, `spec-kit-compact-code-graph.js`, and `spec-kit-skill-advisor.js` |
| `ls .opencode/plugin-helpers/` | PASS, shows the three relocated helper files |
| `node --check` on both plugin entrypoints | PASS |
| Public exact smoke | PASS for target symptom, no `plugin2.auth`; sandbox then blocked home-state DB/lock writes |
| Barter exact smoke | PASS for target symptom, no `plugin2.auth`; sandbox then blocked home-state DB writes |
| Public XDG-writable smoke | PASS, reached OpenCode TUI/server bootstrap logs with no `plugin2.auth` |
| Barter XDG-writable smoke | PASS, reached OpenCode TUI/server bootstrap logs with no `plugin2.auth` |
| Advisor bridge direct smoke | PASS, returned `Advisor: live; use system-spec-kit 0.92/0.00 pass.` |
| Compact bridge direct smoke | PASS, `--minimal` returned transport JSON |
| Legacy parser guard direct smoke | PASS, plugin-like object input returned `{}` |
| Regression guard negative test | PASS, temporary no-default-export stub caused vitest red |
| Regression guard positive test | PASS, removal restored green |
| Focused plugin-loader vitest set | PASS, 3 files / 15 tests |
| `npm run build` in `mcp_server` | PASS |
| Full `npx vitest run` | BLOCKED, unrelated `copilot-hook-wiring.vitest.ts` mismatch against current `.github/hooks/superset-notify.json` |
| Strict spec validation | PASS, 0 errors / 0 warnings |
| `generate-context.js` | EXIT 0; refreshed graph metadata; indexed canonical docs with deferred BM25 fallback after embedding provider network failures; post-save reviewer emitted no HIGH issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full vitest gate P1-04 is formally deferred.** Owner: parent `007-deep-review-remediation` handover. Date: 2026-04-22. The blocker is outside the plugin-loader packet: `copilot-hook-wiring.vitest.ts` expects repo-local Copilot hook commands, while `.github/hooks/superset-notify.json` currently routes all events through Superset hook commands.
2. **The sandbox prevented a true home-state TUI smoke.** Exact `opencode` commands no longer emitted `plugin2.auth`, but OpenCode then failed on state/DB permissions. XDG-writable smokes confirmed TUI/server bootstrap without the plugin-loader crash.
3. **`git mv` could not be used.** The sandbox denied `.git/index.lock`; files were moved on disk and will appear as delete/add pairs until staged.
4. **Memory embeddings were deferred.** `generate-context.js` exited 0, but embedding-provider network calls failed and the indexer saved BM25/FTS-searchable entries without embeddings.
5. **Some historical docs still mention old bridge paths.** Executable tests and current plugin README were updated; archival spec/review documents were left unchanged under the user's scope lock.

### Deferred Gates

| Gate | Status | Owner | Date | Reason |
|------|--------|-------|------|--------|
| P1-04 full `npx vitest run` | Deferred | Parent `007-deep-review-remediation` handover | 2026-04-22 | Out-of-scope Copilot hook wiring blocker in `copilot-hook-wiring.vitest.ts` against `.github/hooks/superset-notify.json`; focused plugin-loader verification remains green. |
<!-- /ANCHOR:limitations -->
