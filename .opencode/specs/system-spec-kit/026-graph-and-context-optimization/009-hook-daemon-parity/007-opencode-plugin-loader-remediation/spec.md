---
title: "...ystem-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/007-opencode-plugin-loader-remediation/spec]"
description: "OpenCode 1.3.17 TUI crash remediation plus Phase 4 skill-advisor hook remap: plugin helpers live outside .opencode/plugins/, parseTransportPlan() fail-opens for legacy loader invocation, and the skill-advisor plugin now uses OpenCode event + experimental.chat.system.transform hooks so advisor briefs reach model context."
trigger_phrases:
  - "opencode plugin loader"
  - "opencode plugin crash"
  - "opencode plugin auth null"
  - "opencode bridge isolation"
  - "opencode plugin discovery"
  - "opencode tui worker plugin2"
  - "026/009/007"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/007-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-22T13:32:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 5 status accuracy and defensive guards implemented and verified"
    next_safe_action: "Run Phase 1 contract probe"
    blockers: []
    key_files:
      - ".opencode/plugins/spec-kit-skill-advisor.js"
      - ".opencode/plugins/spec-kit-skill-advisor-bridge.mjs"
      - ".opencode/plugins/spec-kit-compact-code-graph.js"
      - ".opencode/plugins/spec-kit-compact-code-graph-bridge.mjs"
      - ".opencode/plugins/spec-kit-opencode-message-schema.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-009-007-draft-2026-04-22"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "What exact glob does OpenCode 1.3.17 use to discover plugins under `.opencode/plugins/`?"
      - "Does OpenCode treat `*.mjs` and `*.js` identically, or filter on extension?"
      - "Is there a documented opt-out (e.g., underscore prefix, opencode.json `plugins.exclude`) for files that should not be auto-loaded?"
      - "What is the canonical OpenCode-bundled location for plugin helper modules that ship alongside plugins but are not themselves plugins?"
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
# Feature Specification: OpenCode Plugin Loader Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

User-reproduced on 2026-04-22 that running `opencode` in any directory under this repo (verified in both `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter` and the Public root) terminates the TUI with:

```
TypeError: null is not an object (evaluating 'plugin2.auth')
  at <anonymous> (/$bunfs/root/src/cli/cmd/tui/worker.js:301126:25)
```

Corrected diagnosis (confirmed by ADR-001 and the shipped code): OpenCode 1.3.17's local plugin scanner is flat and loads `{plugin,plugins}/*.{ts,js}` from config directories. `.mjs` files are not discovered by the installed 1.3.17 glob, so the three bridge/helper `.mjs` files were not the direct auto-load targets for the reproduced crash.

The real null-hook source was the named export `parseTransportPlan` from `.opencode/plugins/spec-kit-compact-code-graph.js`. OpenCode's legacy plugin-function loader path can treat exported functions in a discovered `.js` plugin module as plugin factories. When invoked with a plugin context object instead of a bridge response string, `parseTransportPlan` returned `null`; that null hook was later stored in the plugin array and the auth iteration crashed while reading `plugin2.auth`.

Outcome A still shipped: the bridge/schema helpers were moved out of `.opencode/plugins/` as good architectural cleanup and prevention. The plugin folder is now an entrypoints-only directory, so future OpenCode discovery changes or contributor drift are less likely to turn helpers into plugin candidates.

The direct crash fix is the `parseTransportPlan` hardening: non-string input now returns `{}` instead of `null`, producing an empty hook object if the legacy loader path invokes the named parser export.

**Sibling-phase context**: phases 004 (Copilot) and 005 (Codex) addressed *missing* hook surfaces in those CLIs. This phase is structurally similar (Level 3, OpenCode runtime) but the gap is different: OpenCode plugins exist and work in principle, while the installed loader's legacy export handling can turn a named parser helper into a null hook.

**Shipped outcome**: A (move helpers out of `.opencode/plugins/`) landed as the cleanup/prevention path, plus the required parser guard that fixes the actual crash root.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field        | Value                                   |
| ------------ | --------------------------------------- |
| **Level**    | 3                                       |
| **Priority** | P0 (TUI is unusable across all directories) |
| **Status** | Complete |
| **Created**  | 2026-04-22                              |
| **Parent**   | `026-graph-and-context-optimization/009-hook-daemon-parity/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../006-claude-hook-findings-remediation/spec.md` |
| **Successor** | `../008-skill-advisor-plugin-hardening/spec.md` |
| **Related hook packets** | `../004-copilot-hook-parity-remediation/`, `../005-codex-hook-parity-remediation/` (migrated to hook-daemon parity; different runtimes) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

OpenCode 1.3.17 fails to start the TUI in any directory whose `.opencode/plugins/` resolves through the symlink at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/`. The bundled bun TUI worker prints a single JSON error envelope and exits before rendering:

```json
{
  "name": "UnknownError",
  "data": {
    "message": "TypeError: null is not an object (evaluating 'plugin2.auth')\n    at <anonymous> (/$bunfs/root/src/cli/cmd/tui/worker.js:301126:25)\n    ..."
  }
}
```

Root cause: the installed OpenCode 1.3.17 scanner uses a flat `{plugin,plugins}/*.{ts,js}` glob, and its legacy plugin-function loader path invokes the named `parseTransportPlan` export from `spec-kit-compact-code-graph.js`. That parser previously returned `null` when called with a plugin context object instead of a string, producing the null hook that later crashed at `plugin2.auth`. The colocated `.mjs` helpers were not loaded by the installed glob, but moving them out of `.opencode/plugins/` remains the shipped cleanup/prevention measure.

User impact:
- OpenCode CLI is non-functional. No interactive sessions, no plugin-driven hooks, no MCP server bootstrap from the TUI.
- The Spec Kit `skill-advisor` and `compact-code-graph` plugins ship as part of this repo's `.opencode/plugins/` and are the affected surface — every runtime that consumes them through the TUI is blocked.
- The error is opaque: the user cannot tell from the message which file is the offender.

### Purpose

Restore OpenCode TUI startup by hardening the named parser export against legacy loader invocation and by isolating non-plugin modules from `.opencode/plugins/`, while preserving:
- Existing plugin behavior (`SpecKitSkillAdvisorPlugin`, `SpecKitCompactCodeGraphPlugin`).
- The bridge/spawn architecture used by the Spec Kit Memory plugins (the bridges intentionally run in a subprocess to avoid host-process native-module ABI mismatches — this design is documented inline in `spec-kit-compact-code-graph.js` and must not be undone).
- All existing imports from the 2 plugin files into the helper modules.

### Non-goals

- Re-implementing the advisor or compact-code-graph plugins themselves.
- Changing the bridge/spawn architecture for native-module isolation.
- Patching the upstream OpenCode plugin loader (out of repo scope; if the loader's contract is hostile to colocated helpers, the fix is to work around it locally).
- Parity work for Copilot, Codex, Gemini, or Claude runtime hooks (those are sibling phases or already shipped).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Phase 1 — Discovery contract investigation**: confirm OpenCode 1.3.17's plugin discovery rules (glob patterns, extension filtering, opt-out mechanisms, expected default-export shape, error semantics when a file resolves to undefined). Single source of truth: probe the bundled binary + check upstream OpenCode docs/source.
- **Phase 2 — Isolation implementation**: relocate or otherwise hide the 3 non-plugin helper modules from the loader. Update import paths in the 2 real plugins. Validate that `opencode --version` succeeds and that `cd <repo> && opencode` reaches the TUI prompt without the crash.
- **Phase 3 — Documentation + regression guard**: update a new README inside `.opencode/plugins/` (if it exists) or add one documenting the "plugins folder = plugin entrypoints only" convention. Add a guard test (vitest or shell) that fails CI if a non-plugin file lands in `.opencode/plugins/`. Update parent docs.
- **Phase 4 — Skill-advisor hook remap**: update the loaded skill-advisor plugin from Claude-Code-style hook names to OpenCode-recognized `event` and `experimental.chat.system.transform` hooks so the advisor brief reaches `output.system[]`.

### Out of Scope

- Modifying the actual plugin logic.
- Cross-runtime hook parity (sibling-phase territory).
- Upstream OpenCode contributions.
- Reorganizing the rest of `.opencode/skill/` or `.opencode/skill/system-spec-kit/mcp_server/`.

### Files Expected to Change

| Path                                                                              | Change Type    | Description                                                                  |
| --------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`                             | Move/rename    | Relocate out of plugin discovery scope (target path TBD in Phase 1)          |
| `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`                        | Move/rename    | Same as above                                                                |
| `.opencode/plugins/spec-kit-opencode-message-schema.mjs`                          | Move/rename    | Same as above                                                                |
| `.opencode/plugins/spec-kit-skill-advisor.js`                                     | Modify (imports + hooks) | Update `BRIDGE_PATH` constant to point to relocated bridge; remap ignored Claude-style hooks to OpenCode `event` and `experimental.chat.system.transform` hooks |
| `.opencode/plugins/spec-kit-compact-code-graph.js`                                | Modify (imports) | Update bridge path + schema-helper import                                   |
| a new README inside `.opencode/plugins/`                                                     | Create or Modify | Document the "plugins folder = entrypoints only" convention                  |
| `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts` | Create | Regression guard: fail if `.opencode/plugins/` contains files without a default export |
| `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts`       | Modify         | Updated to reflect helper relocation and parseTransportPlan guard behavior   |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Modify | Focused OpenCode hook-shape, system-transform injection, fail-open, event cleanup, and status-tool coverage |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts` | Modify | Updated bridge import path to `../plugin-helpers/`                           |
| Parent docs (`009-hook-daemon-parity/`)     | Modify         | Record phase outcome                                                         |
| `decision-record.md` (this packet)                                                | Create         | ADRs for discovery contract + chosen remediation path                        |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID      | Requirement                                                                                                | Acceptance Criteria                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| REQ-001 | Document OpenCode 1.3.17 plugin discovery contract with primary sources + empirical evidence               | Decision-record ADR-001 cites upstream docs/source AND records empirical probe results (glob, extensions, opt-out, undefined-handling) |
| REQ-002 | Produce decision matrix for the chosen remediation path                                                    | ADR-002 fills concrete mechanism/feasibility/cost/risk entries for outcomes A, B, C                             |
| REQ-003 | `opencode` CLI reaches the TUI without crashing in the Public repo and in `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter` | Manual smoke: `cd <dir> && opencode` does NOT print the `plugin2.auth` JSON error and reaches the TUI prompt |
| REQ-004 | Existing `SpecKitSkillAdvisorPlugin` and `SpecKitCompactCodeGraphPlugin` continue to function              | Plugin-status command (or equivalent advisor brief / compact event) confirms both plugins load and execute      |
| REQ-005 | Bridge/spawn architecture is preserved — bridges still run as subprocesses, not in the OpenCode host process | The plugin code's `BRIDGE_PATH`-style constants still target the relocated bridge files; subprocess spawn semantics unchanged |

### P1 — Required (complete OR user-approved deferral)

| ID      | Requirement                                                                                       | Acceptance Criteria                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| REQ-006 | Regression guard prevents future drift                                                            | New vitest or shell test fails when a file lands in `.opencode/plugins/` without a default export                |
| REQ-007 | a new README inside `.opencode/plugins/` documents the convention                                            | README explains "plugin entrypoints only" rule, lists current entrypoints, and points to the helper-module location |
| REQ-008 | Parent docs updated with phase outcome                                                        | Parent docs have an entry referencing this phase with status + key decisions                                |
| REQ-009 | No regression in `opencode.json` MCP-server bootstrap                                             | After fix: `mcp__spec_kit_memory__*` tools, `mcp__cocoindex_code__*` tools, and `mcp__code_mode__*` tools remain reachable from the TUI |

### P2 — Recommended

| ID      | Requirement                                                                                       | Acceptance Criteria                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| REQ-010 | Capture investigation methodology so the discovery contract is reusable for future OpenCode plugin authoring | Methodology section in decision-record.md documents the probe approach (binary inspection, doc references, empirical undefined-handling test) |
| REQ-011 | Inline documentation in the relocated bridge files clarifies why they are NOT in the plugins folder | First comment block in each relocated file references this packet's spec and the loader contract                |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `opencode` invoked in the Public repo root reaches the TUI prompt with no `UnknownError` JSON envelope on stdout/stderr.
- **SC-002**: `opencode` invoked in `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter` (which symlinks to the Public `.opencode`) also reaches the TUI prompt cleanly.
- **SC-003**: Both `SpecKitSkillAdvisorPlugin` and `SpecKitCompactCodeGraphPlugin` are observed loading (e.g., via the advisor's `plugin-status` tool returning `plugin_id=spec-kit-skill-advisor` or via a successful compaction event).
- **SC-004**: Adding a temporary `dummy-helper.mjs` (no default export) into `.opencode/plugins/` causes the new regression test to fail. Removing it restores green.
- **SC-005**: No new errors or warnings appear in `~/.local/share/opencode/log/` after the TUI loads.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type       | Item                                                                             | Impact                                                          | Mitigation                                                                                         |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Risk       | OpenCode discovery uses a glob that also walks subdirectories                    | Moving helpers into a subfolder doesn't help; need a different escape | Phase 1 must empirically confirm glob behavior before choosing target paths                        |
| Risk       | Plugin imports use relative paths (`./spec-kit-...`) that break after move       | Plugins crash on import after relocation                        | Phase 2 updates `BRIDGE_PATH` constants and any sibling imports atomically with the file move      |
| Risk       | Other consumers reference the bridge files by absolute path                      | Renaming breaks downstream tools                                | `git grep` for each filename across the repo BEFORE moving; update all references in one commit    |
| Risk       | OpenCode upgrade re-introduces the loader behavior (e.g., a future version starts requiring a plugin manifest) | Solution becomes obsolete                                       | Document the OpenCode version this fix targets in decision-record.md; regression test catches drift |
| Risk       | Subprocess `BRIDGE_PATH` resolution uses `import.meta.url` from the plugin file — moving bridges silently breaks the spawn target | Bridge calls fail at runtime, plugin returns null briefs        | Phase 2 verifies bridge resolution post-move with the existing bridge smoke (read-only — no need for live opencode) |
| Dependency | OpenCode 1.3.17 must remain the pinned version OR upgrade plan must include re-running this contract probe | Regression risk on minor/major upgrade                          | Pin via Superset install guide; add upgrade checklist to README                                    |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Plugin discovery latency must not regress (reducing the file count in `.opencode/plugins/` should be neutral or marginally better).
- Bridge subprocess spawn latency unchanged from current measurements.

### Reliability

- Failure mode change: instead of fatal TUI crash → plugins fail open or do not load (acceptable degradation only if the underlying issue is OpenCode loader behavior outside our control). The chosen outcome MUST eliminate the crash, not merely move it.

### Compatibility

- Must work with OpenCode 1.3.17 (bundled bun-based TUI worker).
- Must continue to work after upstream OpenCode minor upgrades within the 1.x line, OR upgrade checklist must catch the regression.

---

## 8. EDGE CASES

- A user adds a third real plugin to `.opencode/plugins/` — must work without further changes.
- A user accidentally drops a helper file (e.g., `.test.mjs`, `.draft.js`) into `.opencode/plugins/` — regression test catches it before runtime crash.
- The Public `.opencode/plugins/` is consumed via symlink from another working directory (e.g., Barter) — fix must apply transparently because the symlink resolves to the same directory.
- The `node_modules/@opencode-ai/plugin` package is upgraded — verify no new colocated helper expectations.

---

## 9. COMPLEXITY ASSESSMENT

This is Level 3 because the change spans:
- A live runtime (OpenCode TUI bootstrap path).
- Two plugins with cross-file imports.
- Three helper modules that need a stable new home.
- A regression-guard test that depends on understanding the loader contract.
- Documentation for a convention that must be maintained going forward.

---

## 10. RISK MATRIX

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenCode plugin loader contract is undocumented | Investigation-heavy Phase 1 | Use binary inspection + empirical probe |
| Helper file moves break plugin imports | Runtime failure post-move | Atomic commit: move + update imports together |
| Future contributor adds a non-plugin file to `.opencode/plugins/` | TUI crash returns | Regression-guard test + README convention |

---

## 11. USER STORIES

- As an OpenCode user, I can launch `opencode` in any directory of this repo without the TUI crashing.
- As a plugin author, I have a clear convention (documented in a new README inside `.opencode/plugins/`) for where to place plugin entrypoints vs helper modules.
- As a maintainer, the regression test prevents accidental colocations from re-breaking the TUI.

### Acceptance Scenarios

- **Given** the Public repo root, **When** `opencode` is launched, **Then** the TUI reaches the interactive prompt without the `plugin2.auth` error.
- **Given** Barter (which symlinks `.opencode`), **When** `opencode` is launched, **Then** the TUI reaches the interactive prompt without the error.
- **Given** the regression test, **When** a non-plugin file is added to `.opencode/plugins/`, **Then** the test fails with a clear message naming the offending file.
- **Given** the regression test in steady state, **When** the plugin folder contains only valid entrypoints, **Then** the test passes silently.
- **Given** a Spec Kit advisor invocation, **When** the user submits a prompt that should trigger a skill recommendation, **Then** the advisor brief is delivered (proving the relocated bridge still works).
- **Given** a session compaction event, **When** the compact-code-graph plugin's `experimental.session.compacting` hook fires, **Then** the relocated schema-helper imports cleanly and the plugin appends transport context as before.
- **Given** the OpenCode TUI is running post-fix, **When** the user inspects `~/.local/share/opencode/log/`, **Then** no new plugin-loader error lines have been written.

---

## 12. OPEN QUESTIONS

1. What exact glob does OpenCode 1.3.17 use for plugin discovery? `.opencode/plugins/*.{js,mjs,ts}`? `.opencode/plugins/**/*.{js,mjs,ts}` (recursive)?
2. Does OpenCode treat `*.mjs` and `*.js` identically, or filter on extension?
3. Is there a documented opt-out mechanism (e.g., underscore prefix `_helper.mjs`, `opencode.json` `plugins.exclude` array, manifest file)?
4. What is the upstream-recommended location for plugin helper modules that ship alongside plugins but are not themselves plugins? (e.g., `.opencode/plugin-helpers/`, `.opencode/plugins/_internal/`, sibling to `.opencode/plugins/` entirely?)
5. Does the OpenCode `@opencode-ai/plugin` package export a contract type that would let us add an explicit `isPluginModule` marker?
6. What is the loader's behavior on `export default null` or `export default undefined` — does it skip silently or still crash?
<!-- /ANCHOR:questions -->

---

## 8. RELATED DOCUMENTS

- **Parent packet**: `../spec.md`, `../plan.md`, `../implementation-summary.md`
- **Sibling phase 004**: `../004-copilot-hook-parity-remediation/` — Copilot CLI hook gap (different runtime, missing transport)
- **Sibling phase 005**: `../005-codex-hook-parity-remediation/` — Codex CLI hook parity (different runtime, ship complete)
- **Affected plugins**: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugins/spec-kit-compact-code-graph.js`
- **Affected helpers**: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`, `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`, `.opencode/plugins/spec-kit-opencode-message-schema.mjs`
- **Reproduction evidence**: User screenshot + reproduction in this packet's drafting session (2026-04-22T13:30Z) showed the same crash in Public root and Barter
- **OpenCode binary**: `/Users/michelkerkmeester/.superset/bin/opencode` (version 1.3.17, bun-bundled)
