---
title: "...ystem-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/plan]"
description: "Three-phase plan: confirm OpenCode 1.3.17 plugin discovery contract, isolate non-plugin helper modules out of .opencode/plugins/, then add a regression guard and documentation so the colocated-helper crash cannot return."
trigger_phrases:
  - "026/009/007 plan"
  - "opencode plugin loader plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-22T13:32:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 5 status accuracy and defensive guards implemented and verified"
    next_safe_action: "Execute Phase 1 contract investigation"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->"
---
# Implementation Plan: OpenCode Plugin Loader Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet uses an investigation-first, implementation-light path. Phase 1 confirms OpenCode 1.3.17's plugin discovery contract (glob, extensions, opt-out, undefined handling) so the chosen remediation is grounded in evidence, not assumption. Phase 2 relocates the 3 non-plugin helper modules out of `.opencode/plugins/` and updates the 2 real plugins' import paths atomically. Phase 3 adds a regression-guard test and documents the convention.

The expected outcome is **A: full isolation** — helpers move to a clearly named non-plugin folder, plugins continue to import them via relative paths, and a vitest guard fails CI if a non-plugin file lands in the plugin folder. Outcomes B (no-op default exports for helpers) and C (extension/prefix opt-out via OpenCode config) are documented fallbacks if Phase 1 surfaces a hard constraint.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Pass Criteria |
|------|-------------|---------------|
| Contract evidence | OpenCode 1.3.17 plugin discovery contract documented | ADR-001 cites primary source + empirical probe |
| Pre-move audit | All references to the 3 helper files identified | `git grep` produces a complete inventory before any file is moved |
| Bridge resolution | Bridge subprocess paths still resolve after move | Plugin's `BRIDGE_PATH` constant smoke-passes (`node <bridge> --help`-equivalent or static `import.meta.url` check) |
| TUI smoke | `opencode` reaches TUI without `plugin2.auth` crash | Manual smoke in Public root + Barter |
| Plugin smoke | Both real plugins still load and execute | Advisor brief surfaces, compact event fires (or equivalent observable) |
| Regression guard | New test fails on a stub non-plugin file in `.opencode/plugins/` | Add stub, assert vitest red; remove stub, assert green |
| Strict spec validation | `validate.sh --strict` clean | 0 errors / 0 warnings on this packet |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Technical Context

OpenCode 1.3.17 ships as a single bun-bundled binary at `/Users/michelkerkmeester/.superset/bin/opencode`. The TUI worker (`/$bunfs/root/src/cli/cmd/tui/worker.js`) discovers plugins under `.opencode/plugins/` at startup. Each discovered file is dynamically imported, its default export is awaited as a plugin factory, and the resolved value is stored in a plugins array. Later, the worker iterates this array — at line 301126 of the bundled worker — accessing `.auth` on each entry to wire authentication hooks. When an entry is `null` or `undefined` (because the file had no default export), this access throws `TypeError: null is not an object (evaluating 'plugin2.auth')` and the worker crashes before the TUI is rendered.

### Current Layout

```
.opencode/plugins/
├── spec-kit-skill-advisor.js                  ← plugin (default export)
├── spec-kit-skill-advisor-bridge.mjs          ← helper (no default export) ❌
├── spec-kit-compact-code-graph.js             ← plugin (default export)
├── spec-kit-compact-code-graph-bridge.mjs     ← helper (no default export) ❌
└── spec-kit-opencode-message-schema.mjs       ← helper (no default export) ❌
```

### Target Layout (Outcome A — primary path, subject to Phase 1 confirmation)

```
.opencode/plugins/
├── spec-kit-skill-advisor.js                  ← plugin
├── spec-kit-compact-code-graph.js             ← plugin
└── README.md                                  ← convention doc

.opencode/plugin-helpers/                       ← NEW, outside loader scope
├── spec-kit-skill-advisor-bridge.mjs
├── spec-kit-compact-code-graph-bridge.mjs
└── spec-kit-opencode-message-schema.mjs
```

The plugin files update their imports:
- `BRIDGE_PATH` constant in `spec-kit-skill-advisor.js` and `spec-kit-compact-code-graph.js` retargets `../plugin-helpers/<bridge>.mjs`
- The `import { ... } from './spec-kit-opencode-message-schema.mjs'` line in `spec-kit-compact-code-graph.js` retargets `../plugin-helpers/spec-kit-opencode-message-schema.mjs`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Investigation

Confirm the OpenCode plugin discovery contract empirically. Deliverables:
- Documented glob (recursive vs flat).
- Extension filter (which extensions are auto-loaded).
- Behavior on `export default undefined` / no default export (does it skip, log, or crash?).
- Opt-out mechanisms (manifest, config key, filename prefix).
- Recommended location for plugin helpers (per upstream OpenCode docs if any).

Methodology: search upstream `sst/opencode` repo + `@opencode-ai/plugin` package; run an isolated probe (drop a `__discovery_probe.mjs` with no default export into a scratch `.opencode/plugins/` and observe loader behavior); read `~/.local/share/opencode/log/` for any structured loader log lines.

### Phase 2: Isolation Implementation

Atomic commit:
1. `git grep -l "spec-kit-skill-advisor-bridge\|spec-kit-compact-code-graph-bridge\|spec-kit-opencode-message-schema"` to inventory references.
2. `mkdir .opencode/plugin-helpers/`.
3. `git mv` the 3 helper files.
4. Update `BRIDGE_PATH` constant in both plugin files (relative path `../plugin-helpers/...`).
5. Update the `from './spec-kit-opencode-message-schema.mjs'` import in `spec-kit-compact-code-graph.js`.
6. Update any other reference surfaced by step 1 (e.g., docs, install guides).
7. Manual smoke: `cd <Public root> && opencode` reaches TUI; `cd <Barter> && opencode` reaches TUI.
8. Plugin smoke: prompt that should trigger advisor brief returns brief; experimental compaction fires.

### Phase 3: Regression Guard + Documentation

1. Author `tests/opencode-plugins-folder-purity.vitest.ts`: scans `.opencode/plugins/*.{js,mjs,ts}` (excluding `README.md`), `import()`s each file, asserts each has a default export.
2. Author/update a new README inside `.opencode/plugins/` with the "entrypoints only" convention, listing current plugins and pointing to `.opencode/plugin-helpers/`.
3. Add a top-of-file comment to each relocated helper explaining why it lives outside `.opencode/plugins/` and referencing this packet.
4. Update parent docs with phase outcome.
5. Run strict spec validation; run `generate-context.js` for canonical save.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Automated:
- New: `npx vitest run tests/opencode-plugins-folder-purity.vitest.ts` (folder purity guard).
- Existing: `npx vitest run` baseline must remain green.
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` clean.

Manual smokes (cannot be automated cleanly because the TUI crash happens in the bundled bun worker and is sensitive to the user's full env):
- `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && opencode` → reaches TUI.
- `cd /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter && opencode` → reaches TUI.
- After TUI loads: trigger an advisor brief by submitting a prompt; observe the response includes the brief or, if disabled, the `plugin-status` tool reports `enabled=true`.

Negative test:
- Drop `.opencode/plugins/__regression_probe.mjs` with no default export → vitest guard fails.
- Remove the file → vitest guard passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Required for | Status |
|------------|--------------|--------|
| OpenCode CLI 1.3.17 | Reproducing crash + smoking fix | Installed at `/Users/michelkerkmeester/.superset/bin/opencode` |
| `node` for bridge subprocess | Plugin runtime | Already required by current plugins |
| Vitest already configured in `mcp_server` | Adding the regression guard | Confirmed in `mcp_server/package.json` |
| `git` for atomic file moves | Phase 2 | Standard |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is straightforward git-level:

1. `git revert <commit>` for the move + import-update commit.
2. The TUI returns to the crashing state — the rollback is purely defensive in case the move introduces a new failure mode.

No live-system state to restore (unlike sibling phases 007/008 which edited live `~/.codex/hooks.json` and `~/.codex/config.toml`).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on ADR-001 (Phase 1 contract) selecting outcome A, B, or C. Phase 3's regression guard depends on Phase 1's documented contract (the test asserts the same shape OpenCode requires).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Phase 1 — 1 to 2 hours (focused contract probe + upstream doc/source check).
Phase 2 — 30 to 60 minutes (atomic move, import updates, manual smoke in two directories).
Phase 3 — 1 to 2 hours (regression test + README + parent docs + canonical save).

Total: ~half a day of focused work.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

The atomic move commit is the rollback unit. No external system state changes (no `~/.codex/`, no `~/.config/opencode/`), so `git revert` fully restores prior state. The regression test, if landed in a separate commit, can be reverted independently.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
ADR-001 plugin discovery contract
  -> ADR-002 outcome selection (A/B/C)
    -> Phase 2 file moves + import updates
      -> Manual TUI smoke (Public + Barter)
        -> Plugin behavior smoke (advisor brief + compact event)
          -> Phase 3 regression guard test
            -> README convention doc
              -> Parent docs update
                -> Strict validation + canonical save
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is: contract probe → outcome selection → atomic move → TUI smoke → regression guard. The TUI smoke is the gating signal — until both directories cleanly launch, nothing else has shipped.

### AI Execution Protocol

**Pre-Task Checklist**

- Read every plugin file before editing.
- Inventory every `import` referencing the helper modules before moving them.
- Capture baseline: confirm the crash reproduces in BOTH Public root and Barter before any change.
- Use `git mv` (preserves history) rather than copy+delete.

**Task Execution Rules**

| Rule | Application |
|------|-------------|
| TASK-SEQ | Investigate → choose outcome → atomic move → smoke → guard → docs. Do not interleave. |
| TASK-SCOPE | Touch only `.opencode/plugins/`, the new `.opencode/plugin-helpers/`, the regression test, and this packet's docs. |
| TASK-VERIFY | Record TUI smoke output (or absence of error) in checklist evidence. |

**Status Reporting Format**

Status lines use: phase, current action, validation state, blocker if present.

**Blocked Task Protocol**

If TUI smoke fails after the move, do NOT modify plugin behavior to compensate. Investigate the new failure (likely a broken import path) and fix that, or revert and re-plan.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status |
|-----------|--------|
| Crash reproduced in Public + Barter | Complete (drafting session) |
| Plugin discovery contract documented | Pending Phase 1 |
| Outcome selected in ADR-002 | Pending Phase 1 |
| Helper files relocated | Pending Phase 2 |
| TUI smoke green in Public + Barter | Pending Phase 2 |
| Regression guard merged | Pending Phase 3 |
| Strict validation + canonical save | Final gate |
<!-- /ANCHOR:milestones -->
