---
title: "...-graph-and-context-optimization/009-hook-package/007-opencode-plugin-loader-remediation/implementation-summary]"
description: "Outcome A shipped for the loader crash; Phase 4 remapped the skill-advisor plugin to OpenCode hooks; Phase 5 corrected status readiness, cache accounting evidence, defensive output guards, and sessionID normalization with focused vitest and direct smokes."
trigger_phrases:
  - "opencode plugin loader complete"
  - "026/009/007 implementation"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/007-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-23T07:48:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Phase 5 status accuracy and defensive guards implemented and verified"
    next_safe_action: "Resolve parent-tracked Copilot hook wiring mismatch only if full-suite verification is required"
    blockers:
      - "Full `npx vitest run` fails in `copilot-hook-wiring.vitest.ts` because current `.github/hooks/superset-notify.json` points at Superset hook commands while the test expects repo-local Copilot hook commands."
    completion_pct: 100
    open_questions:
      - "Should the out-of-scope Copilot hook config be aligned to the sibling 007/008 expectations?"
    answered_questions:
      - "Outcome A is feasible because OpenCode 1.3.17 uses a flat `{plugin,plugins}/*.{ts,js}` local plugin glob."
      - "The observed null-hook source includes the compact plugin's named parser export under the legacy loader path, so the parser now fails open with `{}` for non-string inputs."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: OpenCode Plugin Loader Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-opencode-plugin-loader-remediation |
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

### Phase 4: Skill-Advisor Hook Remap

The skill-advisor plugin now registers OpenCode-recognized hooks instead of ignored Claude-Code-style lifecycle names. `onUserPromptSubmitted` was replaced by `experimental.chat.system.transform`, which pushes a non-empty advisor brief into `output.system[]`; `onSessionStart`/`onSessionEnd` were replaced by an `event` listener for readiness and scoped cache cleanup. The `tool` registration stayed unchanged.

The transform handler uses the existing prompt extraction path when prompt text is present and falls back to the OpenCode client session messages when the transform input only carries `sessionID` + `model`.

### Phase 5: Status Accuracy + Defensive Guards

The skill-advisor plugin now treats OpenCode runtime readiness as lifecycle/handler readiness instead of advisor bridge success. The SDK and compact plugin both confirmed the real event discriminant is `type`; Phase 5 retained that discriminant, added direct/wrapped event payload normalization, and stopped skipped/degraded bridge responses from overwriting `runtime_ready=false`. The first `experimental.chat.system.transform` call also flips readiness to true as a pragmatic fallback if lifecycle events are not observed.

The status tool now exposes `advisor_lookups` so cache accounting is explicit: `bridge_invocations` counts subprocess spawns/cache misses, while `advisor_lookups` equals `cache_hits + cache_misses`. `appendAdvisorBrief()` defensively initializes `output.system`, and session cache keys normalize session IDs through stable stringification before use.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 documented the OpenCode discovery contract in ADR-001 using official docs, installed package types, installed binary strings, and sandbox-safe empirical probes. ADR-002 selected Outcome A and rejected no-op helper plugins and undocumented opt-outs.

Phase 2 moved the helper files to `.opencode/plugin-helpers/`, updated the two plugin entrypoints, and preserved the subprocess bridge architecture. `git mv` was attempted, but sandbox permissions prevented taking `.git/index.lock`; the filesystem move was used instead.

Phase 3 added the regression guard, README, helper comments, focused test updates, parent docs entry, checklist evidence, and this implementation summary.

### Phase 4: Skill-Advisor Hook Remap

Phase 4 read the installed OpenCode `Hooks` interface and confirmed the valid surfaces are `event`, `tool`, `chat.message`, `chat.params`, `chat.headers`, `permission.ask`, `command.execute.before`, `tool.execute.before`, `shell.env`, `tool.execute.after`, `experimental.chat.messages.transform`, `experimental.chat.system.transform`, `experimental.session.compacting`, and `experimental.text.complete`. The plugin was patched to mirror the compact plugin's event/system-transform pattern without modifying bridge/cache helpers.

Focused vitest was extended to cover hook shape, system prompt injection, empty fail-open behavior, session-message prompt fallback, event readiness/cache cleanup, and status tool registration. A direct Node smoke imported the plugin, invoked `experimental.chat.system.transform`, and asserted the advisor brief landed in `output.system[]`.

### Phase 5: Status Accuracy + Defensive Guards

Phase 5 read the installed SDK event union and the compact plugin reference before patching. The evidence showed `session.created`, `session.deleted`, `server.instance.disposed`, and `global.disposed` are all `type`-discriminated events, so the remediation focused on the real status bug: bridge responses were conflated with runtime readiness.

Focused vitest added readiness, cache-invariant, output-guard, and object-sessionID cases. Direct Node smokes imported the live plugin, invoked the event handler with `session.created`, and ran two real system-transform calls to assert `cache_misses === bridge_invocations` and `cache_hits + cache_misses === advisor_lookups`.
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
| Focused skill-advisor hook vitest | PASS, Phase 4 passed 18/18; Phase 5 passed 23/23 |
| OpenCode Hooks API check | PASS, `Hooks` exposes `event`, `tool`, `chat.message`, and `experimental.chat.system.transform`; it does not expose `onSessionStart`, `onUserPromptSubmitted`, or `onSessionEnd` |
| Direct skill-advisor system-transform smoke | PASS, imported plugin and asserted `output.system[0]=Advisor: smoke brief landed.` |
| Event discriminant check | PASS, SDK `Event` union uses `type`; compact plugin also filters `event?.type` |
| Direct skill-advisor event smoke | PASS, mock `session.created` yielded `runtime_ready=true` and `last_bridge_status=ready` |
| Direct cache invariant smoke | PASS, real transform calls yielded `cache_hits=1`, `cache_misses=1`, `bridge_invocations=1`, `advisor_lookups=2` |
| Defensive output guard vitest | PASS, `output={}` and `{ system: null }` append without throwing |
| SessionID normalization vitest | PASS, object session IDs with reordered keys hit the same cache entry |
| `npm run build` in `mcp_server` | PASS |
| Full `npx vitest run` | BLOCKED, unrelated `copilot-hook-wiring.vitest.ts` mismatch against current `.github/hooks/superset-notify.json` |
| Strict spec validation | PASS, 0 errors / 0 warnings |
| `generate-context.js` | PASS; Phase 3, Phase 4, and Phase 5 runs exited 0. Phase 5 refreshed graph metadata and canonical context with non-blocking embedding/provider fallback behavior. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full vitest gate P1-04 is formally deferred.** Owner: parent `009-hook-package` docs. Date: 2026-04-22. The blocker is outside the plugin-loader packet: `copilot-hook-wiring.vitest.ts` expects repo-local Copilot hook commands, while `.github/hooks/superset-notify.json` currently routes all events through Superset hook commands.
2. **The sandbox prevented a true home-state TUI smoke.** Exact `opencode` commands no longer emitted `plugin2.auth`, but OpenCode then failed on state/DB permissions. XDG-writable smokes confirmed TUI/server bootstrap without the plugin-loader crash.
3. **`git mv` could not be used.** The sandbox denied `.git/index.lock`; files were moved on disk and will appear as delete/add pairs until staged.
4. **Memory embeddings were deferred.** `generate-context.js` exited 0, but embedding-provider network calls failed and the indexer saved BM25/FTS-searchable entries without embeddings.
5. **Some historical docs still mention old bridge paths.** Executable tests and current plugin README were updated; archival spec/review documents were left unchanged under the user's scope lock.

### Deferred Follow-ups

- **Module-global state refactor (P2):** still deferred. The plugin keeps module-global state for this phase; a future per-instance closure or WeakMap design can address multi-instance races.
- **In-flight bridge dedup (P2):** still deferred. Concurrent identical misses may spawn duplicate bridge subprocesses until a later hardening pass adds promise deduplication.
- **Unbounded prompt/brief sizes (P2):** still deferred. Prompt and brief size caps remain a broader plugin-hardening item, not part of Phase 5.

### Deferred Gates

| Gate | Status | Owner | Date | Reason |
|------|--------|-------|------|--------|
| P1-04 full `npx vitest run` | Deferred | Parent `009-hook-package` docs | 2026-04-22 | Out-of-scope Copilot hook wiring blocker in `copilot-hook-wiring.vitest.ts` against `.github/hooks/superset-notify.json`; focused plugin-loader verification remains green. |
<!-- /ANCHOR:limitations -->
