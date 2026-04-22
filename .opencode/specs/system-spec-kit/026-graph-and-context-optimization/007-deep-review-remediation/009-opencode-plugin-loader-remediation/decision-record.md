---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->"
title: "Decision Record: OpenCode Plugin Loader Remediation"
description: "ADRs for scoping decisions. ADR-001 captures the OpenCode 1.3.17 plugin discovery contract (lands after Phase 1 probe). ADR-002 selects the remediation outcome (A, B, or C)."
trigger_phrases:
  - "026/007/009 adr"
  - "opencode plugin loader decisions"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/009-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-22T13:32:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "ADRs accepted; Outcome A implemented with legacy export hardening"
    next_safe_action: "Resolve out-of-scope full-suite Copilot hook blocker, then rerun canonical verification"
    completion_pct: 95
---
# Decision Record: OpenCode Plugin Loader Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: OpenCode 1.3.17 plugin discovery contract — empirical baseline

**Status**: Accepted (Phase 1 probe complete, 2026-04-22T15:12:00+02:00).

### Context

OpenCode 1.3.17 ships as a single bun-bundled binary. The TUI worker auto-discovers plugins from `.opencode/plugins/` at startup. Empirical observation (drafting session, 2026-04-22T13:30Z): the worker crashes with `TypeError: null is not an object (evaluating 'plugin2.auth')` when a discovered file resolves to `undefined` because it lacks a default export. The crash occurs at `/$bunfs/root/src/cli/cmd/tui/worker.js:301126:25` — a bundled, non-source-readable location.

The contract details (glob shape, extension filter, opt-out mechanism, undefined-handling, recommended helper-module location) were confirmed from official docs, the installed package type contract, the installed 1.3.17 binary strings, and empirical TUI probes.

### Decision

Treat `.opencode/plugins/` as a flat plugin-entrypoint directory. In OpenCode 1.3.17, the server-side local plugin scanner loads JavaScript/TypeScript files from `{plugin,plugins}/*.{ts,js}` under each config directory. The official documentation says files placed in `.opencode/plugins/` and `~/.config/opencode/plugins/` are automatically loaded at startup and that a plugin module exports plugin functions. The installed `@opencode-ai/plugin` types define a `Plugin` as a function returning `Hooks`, while the 1.3.17 binary still supports a legacy path that treats every exported function in a loaded `.js` module as a plugin function. That legacy behavior is the immediate null-hook source for `spec-kit-compact-code-graph.js`: its named `parseTransportPlan` export is invoked as a second plugin, returns `null` for a plugin input object, and later the auth loop crashes while reading `plugin2.auth`.

**Discovery contract matrix**:

| Aspect                            | Observed in OpenCode 1.3.17 | Evidence |
|-----------------------------------|-----------------------------|----------|
| Discovery glob                    | `{plugin,plugins}/*.{ts,js}` from config directories | `strings /Users/michelkerkmeester/.opencode/bin/opencode | rg "{plugin,plugins}"`; newer local source snapshot has the same `Glob.scan("{plugin,plugins}/*.{ts,js}", { dot: true, symlink: true })` shape |
| Recursive vs flat                 | Flat only                   | The glob has a single `*` segment, not `**/*`; helper subdirectories are outside the discovered entrypoint set |
| Extension filter                  | `.ts` and `.js` only in the installed 1.3.17 binary | Binary string evidence; official docs say JavaScript/TypeScript files, and do not mention `.mjs` |
| Default-export shape required     | V1 modules default-export an object with `server()` or `tui()`; legacy modules may export plugin functions directly | `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts`; binary strings for `must default export an object with server()` and `Plugin export is not a function` |
| Behavior on missing default export | Missing default is not enough by itself if no exported functions exist, but any loaded exported function returning `null`/`undefined` leaves a null hook and crashes at auth iteration | Probe + log: TUI emitted `TypeError: null is not an object (evaluating 'plugin2.auth')`; log recorded project `.js` plugins loaded and `plugin config hook failed` with `hook.config` null |
| Behavior on `export default null` | Equivalent risk if the loaded plugin resolves to `null` | Inferred from auth loop string `plugin2.auth` and the observed null-hook crash |
| Behavior on `export default undefined` | Equivalent risk if the loaded plugin resolves to `undefined`/missing hook object | Inferred from legacy loader contract and observed null-hook crash |
| Opt-out: filename prefix          | No documented opt-out found | Official docs list plugin directories and npm config; no filename-prefix exclusion documented |
| Opt-out: opencode.json `plugins.exclude` | No documented opt-out found | Official config docs expose `plugin` package list, not local-folder exclude rules |
| Opt-out: manifest file            | No documented manifest opt-out for local plugin folders | Installed package type contract and official docs do not define a local manifest exclusion |
| Recommended helper-module location | Any sibling folder outside `{plugin,plugins}/` is safe; use `.opencode/plugin-helpers/` locally | Flat glob evidence plus the packet's Outcome A target layout |

### Methodology

1. Checked official OpenCode plugin docs: local files in `.opencode/plugins/` and `~/.config/opencode/plugins/` are startup-loaded, and plugin modules export plugin functions.
2. Inspected the installed dependency at `.opencode/node_modules/@opencode-ai/plugin/`; the local install is `@opencode-ai/plugin` package metadata `1.3.15` under a `1.3.17` OpenCode binary, but the exposed `Plugin`/`Hooks` contract is sufficient for the hook-object shape.
3. Inspected the installed 1.3.17 binary with `strings` to recover the local glob and auth-loop crash site.
4. Ran empirical probes with `XDG_STATE_HOME=/tmp/opencode-state XDG_DATA_HOME=/tmp/opencode-data XDG_CACHE_HOME=/tmp/opencode-cache` so the sandbox did not block OpenCode state writes. `opencode --version` returned `1.3.17`; `timeout 4 opencode` reproduced the `plugin2.auth` JSON envelope.
5. Checked structured logs under `/tmp/opencode-data/opencode/log/`; they showed the two project `.js` plugins loaded, no `.mjs` helpers loaded, and a null `hook.config` failure before the TUI bootstrap error.

### Consequences

- **Positive**: ADR-002 can choose the remediation outcome with full confidence in the contract semantics.
- **Positive**: The contract documentation becomes a reusable reference for any future OpenCode plugin authoring or upgrade probe.
- **Negative**: Phase 1 must complete before Phase 2 can begin; partial-knowledge implementation risks shipping against assumption.

<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Remediation outcome selection (A / B / C)

**Status**: Accepted.

### Context

Three feasible remediation paths emerged during drafting. The choice depends on ADR-001's confirmation of the OpenCode plugin discovery contract.

### Decision

Choose **Outcome A: move helpers out of `.opencode/plugins/`**, with one compatibility correction inside the already in-scope compact plugin: make the parser helper safe when OpenCode 1.3.17's legacy loader invokes named function exports as plugins. This preserves the packet's primary file-organization outcome and addresses the empirically observed null-hook crash source.

**Decision matrix**:

| # | Outcome                                                                                | Mechanism                                                                                                                | Feasibility (depends on ADR-001) | Eng. cost | Runtime cost | Coverage / Risk |
|---|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------------------------|-----------|--------------|-----------------|
| A | **Move helpers out of `.opencode/plugins/`**                                           | `git mv` 3 helper files to `.opencode/plugin-helpers/`; update `BRIDGE_PATH` constants and schema-helper import; guard the compact plugin's named parser export against legacy-loader invocation | HIGH — discovery is flat and outside sibling folders | Low (~30-60 min) | Negligible | Chosen. Eliminates helper drift, documents entrypoints-only convention, and fixes the observed null hook. |
| B | **Add no-op default exports to the 3 helper files**                                    | Append `export default async function() { return {}; }` to each helper                                                   | LOW benefit — installed 1.3.17 does not load `.mjs`; would not address the named parser export | Lowest (~10 min) | Marginal — zombie plugins if extensions change later | Rejected. Masks folder impurity and does not match the empirical crash source. |
| C | **Use OpenCode opt-out mechanism (filename prefix or opencode.json exclude)**          | Rename helpers to `_<name>.mjs` or add `plugins.exclude: ["*-bridge.mjs", "*-schema.mjs"]` to opencode.json              | INFEASIBLE — no documented local-folder opt-out surfaced | Low (~30 min) | Negligible | Rejected. Depends on unsupported behavior. |

**Selected primary path**: A (full isolation plus legacy export hardening). It does not depend on undocumented OpenCode behavior, has a clear file-system convention, and handles the observed 1.3.17 legacy loader behavior.

**Fallback if A is infeasible** (e.g., discovery is recursive into `.opencode/`): B is the safest universal fallback.

**Use C only if** ADR-001 surfaces a stable, documented opt-out — otherwise its dependency on undocumented behavior makes it brittle across OpenCode upgrades.

### Consequences (Outcome A)

- **Positive**: TUI starts cleanly. Plugin folder becomes self-documenting (every file is an entrypoint).
- **Positive**: Future contributors cannot accidentally re-introduce the crash by adding a helper next to a plugin (regression test catches it).
- **Positive**: Bridge subprocess architecture preserved — bridges still run as spawned `node` processes, just from a different parent path.
- **Positive**: The compact plugin's test-only parser helper no longer creates a null hook if a legacy loader treats it as a plugin function.
- **Negative**: One extra folder (`.opencode/plugin-helpers/`) to know about. Mitigated by README convention doc.
- **Negative**: Move breaks existing bridge path references — T-10 inventory governs which references are updated.

### References

- Reproduction evidence: drafting session 2026-04-22T13:30Z reproduced the crash in both Public root and Barter.
- Official docs: https://opencode.ai/docs/plugins/ and https://opencode.ai/docs/config/
- Installed package: `.opencode/node_modules/@opencode-ai/plugin/` (inspected during Phase 1).
- Installed binary: `/Users/michelkerkmeester/.opencode/bin/opencode` and wrapper `/Users/michelkerkmeester/.superset/bin/opencode`.
- Bundled worker: `/$bunfs/root/src/cli/cmd/tui/worker.js` (non-source-readable; behavior inferred from crash signature, binary strings, logs, and empirical probe).
- Sibling phases: `../007-copilot-hook-parity-remediation/`, `../008-codex-hook-parity-remediation/` (different runtime, different gap).

---

### ADR-003: Implementation outcome — Outcome A shipped

**Status**: Accepted (implemented 2026-04-22T15:21Z).

### Context

Phase 2 implemented the ADR-002 selection after the empirical contract investigation. The helper files were removed from `.opencode/plugins/`, which is now documented as an entrypoint-only folder.

One additional code-level compatibility correction was necessary inside the in-scope compact plugin. The installed 1.3.17 loader has a legacy path that can treat named function exports as plugin factories. `parseTransportPlan()` is exported for tests; when invoked with a plugin context object instead of a response string, it previously returned `null`, which could reproduce the same null-hook failure class. The parser now returns an empty hook object for non-string input, preserving its test utility while avoiding a null hook under legacy loader invocation.

### Decision

Ship Outcome A with these implementation details:

| Area | Outcome |
|------|---------|
| Helper location | `.opencode/plugin-helpers/` |
| Plugin folder convention | `.opencode/plugins/` contains only `spec-kit-skill-advisor.js`, `spec-kit-compact-code-graph.js`, and `README.md` |
| Advisor bridge | `BRIDGE_PATH` now targets `../plugin-helpers/spec-kit-skill-advisor-bridge.mjs` |
| Compact bridge | `BRIDGE_PATH` now targets `../plugin-helpers/spec-kit-compact-code-graph-bridge.mjs` |
| Schema helper | compact plugin imports `../plugin-helpers/spec-kit-opencode-message-schema.mjs` |
| Legacy loader hardening | `parseTransportPlan(nonString)` returns `{}` instead of `null` |
| Regression guard | `opencode-plugins-folder-purity.vitest.ts` dynamically imports every plugin-folder `*.js`, `*.mjs`, and `*.ts` file and requires a default export |

### Evidence

- `ls .opencode/plugins/` shows only `README.md`, `spec-kit-compact-code-graph.js`, and `spec-kit-skill-advisor.js`.
- `ls .opencode/plugin-helpers/` shows the three relocated helper files.
- `node --check` passed for both plugin entrypoint files.
- Direct advisor bridge smoke returned a live advisor brief.
- Direct compact bridge smoke returned transport JSON.
- Direct legacy parser guard smoke returned `{}` for a plugin-like object.
- Regression guard failed with a temporary no-default-export stub and passed after removal.
- Focused plugin-loader vitest set passed 15/15.
- `npm run build` passed.

### Limitations

- `git mv` could not take `.git/index.lock` in this sandbox, so the move was performed at the filesystem level. The worktree shows delete/add pairs until a later staging operation records them as renames.
- Exact home-state `opencode` smokes no longer emitted `plugin2.auth` but hit sandbox state/DB permission errors. XDG-writable smokes reached OpenCode TUI/server bootstrap logs without `plugin2.auth`.
- Full `npx vitest run` is blocked by an out-of-scope Copilot hook wiring mismatch: `copilot-hook-wiring.vitest.ts` expects repo-local hook commands while current `.github/hooks/superset-notify.json` points to Superset hook commands.

---

### Cross-References

- **Spec**: `spec.md` §2 (problem), §4 (requirements REQ-001..REQ-011)
- **Plan**: `plan.md` §2 quality gates, §4 phases
- **Tasks**: `tasks.md` T-01..T-09 (Phase 1 contract investigation), T-10..T-19 (Phase 2 isolation), T-20..T-29 (Phase 3 guard + docs)
- **Sibling phases**: `../007-copilot-hook-parity-remediation/`, `../008-codex-hook-parity-remediation/`
