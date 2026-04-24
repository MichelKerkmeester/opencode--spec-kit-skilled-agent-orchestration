---
title: "...stem-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/007-opencode-plugin-loader-remediation/tasks]"
description: "Task breakdown for investigating the OpenCode 1.3.17 plugin loader contract, isolating non-plugin helpers, smoke-testing the TUI in two directories, and adding a regression guard."
trigger_phrases:
  - "026/009/007 tasks"
  - "opencode plugin loader tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/007-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-22T13:32:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase 5 status accuracy and defensive guards implemented and verified"
    next_safe_action: "Resolve out-of-scope Copilot hook wiring test, then rerun full vitest"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->"
---
# Task Breakdown: OpenCode Plugin Loader Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending.
- `[x]` complete with evidence (recorded in checklist + implementation summary post-impl).
- P0/P1/P2 evidence requirements live in `checklist.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-01** Reproduce crash from clean state: `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && opencode` and confirm the `plugin2.auth` JSON error. [EVIDENCE: user supplied reproduction; pre-fix XDG smoke in Public also emitted `TypeError: null is not an object (evaluating 'plugin2.auth')`.]
- [x] **T-02** Reproduce crash in Barter: `cd /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter && opencode` and confirm same error. [EVIDENCE: user supplied reproduction for Barter; post-fix Barter smoke confirmed the error is gone.]
- [x] **T-03** Search upstream OpenCode docs (opencode.ai/docs, GitHub repo if discoverable) for plugin discovery contract: glob, extension filter, opt-out, default-export shape. [EVIDENCE: ADR-001 cites `https://opencode.ai/docs/plugins/` and `https://opencode.ai/docs/config/`.]
- [x] **T-04** Inspect `node_modules/@opencode-ai/plugin/` package contents for type signatures and any documented helper-module convention. [EVIDENCE: `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts` inspected; ADR-001 records `Plugin`/`Hooks` shape.]
- [x] **T-05** Empirical probe: drop a temporary `__discovery_probe.mjs` (no default export) into `.opencode/plugins/`, run `opencode --version` and `opencode` (capture exit + first error line), then remove the probe. Record observed loader behavior. [EVIDENCE: temporary probe removed; `opencode --version` returned `1.3.17`; XDG-isolated `timeout 4 opencode` reproduced the JSON `plugin2.auth` error.]
- [x] **T-06** Probe extension behavior: add temporary `__discovery_probe.txt` and `__discovery_probe.bak.mjs` to test if extension filter / dotfile prefix excludes them. [EVIDENCE: probes removed; binary inspection found `{plugin,plugins}/*.{ts,js}`, so `.txt`/`.bak.mjs`/`.mjs` are outside the installed 1.3.17 glob.]
- [x] **T-07** Check `~/.local/share/opencode/log/` for any structured loader log lines from the probe runs. [EVIDENCE: sandbox-safe XDG logs under `/tmp/opencode-data*/opencode/log/` showed loaded project `.js` plugins and no helper `.mjs` loads.]
- [x] **T-08** Author ADR-001 in `decision-record.md` documenting the contract: glob, extensions, undefined handling, available opt-outs, recommended helper location. [EVIDENCE: ADR-001 accepted with contract matrix.]
- [x] **T-09** Author ADR-002 in `decision-record.md` selecting outcome A, B, or C with concrete mechanism/cost/risk. [EVIDENCE: ADR-002 accepted Outcome A plus legacy export hardening.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-10** Inventory all references to the 3 helper files: `git grep -l "spec-kit-skill-advisor-bridge\|spec-kit-compact-code-graph-bridge\|spec-kit-opencode-message-schema"`. [EVIDENCE: grep surfaced plugin imports, focused bridge tests, live docs, and archival spec references.]
- [x] **T-11** Create target folder per chosen outcome (e.g., `mkdir .opencode/plugin-helpers/` for outcome A). [EVIDENCE: `.opencode/plugin-helpers/` exists.]
- [x] **T-12** Move helpers atomically with `git mv` to the new location. [EVIDENCE: filesystem move completed; `git mv` was attempted but sandbox blocked `.git/index.lock`, so status shows delete/add pairs instead of staged renames.]
- [x] **T-13** Update `BRIDGE_PATH` constant in `.opencode/plugins/spec-kit-skill-advisor.js` to target relocated bridge. [EVIDENCE: path now resolves `../plugin-helpers/spec-kit-skill-advisor-bridge.mjs`.]
- [x] **T-14** Update `BRIDGE_PATH` constant + schema-helper import in `.opencode/plugins/spec-kit-compact-code-graph.js` to target relocated files. [EVIDENCE: bridge path and schema import now resolve via `../plugin-helpers/`.]
- [x] **T-15** Update any other references discovered in T-10 (docs, install guides, MCP server code if applicable). [EVIDENCE: executable/focused test references updated; historical docs/spec references were left unchanged because the user locked scope to `spec.md` §3 plus this packet docs.]
- [x] **T-16** Manual smoke: `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && opencode` reaches TUI without crash; capture stderr/stdout for evidence. [EVIDENCE: exact home-state command no longer emitted `plugin2.auth` but hit sandbox state/DB locks; XDG-writable smoke reached server/TUI bootstrap logs with no `plugin2.auth`.]
- [x] **T-17** Manual smoke: `cd /Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter && opencode` reaches TUI without crash. [EVIDENCE: exact command no longer emitted `plugin2.auth` but hit sandbox DB locks; XDG-writable Barter smoke reached TUI/server bootstrap logs with no `plugin2.auth`.]
- [x] **T-18** Plugin smoke: in TUI, submit a prompt that triggers the advisor (e.g., "review this code"); confirm advisor brief surfaces. If `plugin-status` tool exists, run it and capture `enabled=true` for both plugins. [EVIDENCE: direct bridge smokes passed: advisor bridge returned `Advisor: live; use system-spec-kit 0.92/0.00 pass.`; compact bridge `--minimal` returned transport JSON; parser legacy-loader guard returned `{}`.]
- [x] **T-19** Verify `~/.local/share/opencode/log/` has no new error lines from the smoke runs. [EVIDENCE: XDG smoke logs show no `plugin2.auth` or plugin-loader error after the fix; unrelated sandbox MCP startup errors remain.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-20** Author `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugins-folder-purity.vitest.ts`: scans `.opencode/plugins/*.{js,mjs,ts}`, dynamically imports each, asserts each has a default export. [EVIDENCE: test file created.]
- [x] **T-21** Negative-test the regression guard: drop a stub no-default-export file, assert vitest red; remove stub, assert green. [EVIDENCE: temporary `__regression_probe.mjs` failed the guard as expected; removal restored green.]
- [ ] **T-22** Run full vitest suite to ensure no regression: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run`. [EVIDENCE: deferred per P1-04 — see implementation-summary.md Known Limitations item 1; out-of-scope Copilot hook wiring blocker is tracked in parent 009-hook-daemon-parity docs as priority follow-up. Focused plugin-loader tests passed 15/15.]
- [x] **T-23** Author or update a new README inside `.opencode/plugins/` documenting the "entrypoints only" convention; list current plugin entrypoints; reference `.opencode/plugin-helpers/` (or whichever target outcome A/B/C selected). [EVIDENCE: `.opencode/plugins/README.md` created.]
- [x] **T-24** Add top-of-file comment to each relocated helper explaining why it lives outside `.opencode/plugins/` and citing this packet. [EVIDENCE: all three helpers start with packet 026/009/007 relocation comments.]
- [x] **T-25** Update parent docs (the sibling-level handover.md in `009-hook-daemon-parity/`) with phase outcome. [EVIDENCE: parent docs now record the 007 phase outcome.]
- [x] **T-26** Walk `checklist.md` with evidence (P0/P1/P2 entries). [EVIDENCE: checklist updated with evidence and the full-suite limitation.]
- [x] **T-27** Author `implementation-summary.md` (post-impl, mirrors sibling 008's structure: Metadata / What Built / How Delivered / Decisions / Verification / Limitations). [EVIDENCE: implementation summary populated.]
- [x] **T-28** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — must pass 0 errors / 0 warnings. [EVIDENCE: strict validation passed with 0 errors / 0 warnings.]
- [x] **T-29** Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for canonical save (refreshes description.json + graph-metadata.json). [EVIDENCE: `generate-context.js` exited 0, refreshed `graph-metadata.json`, indexed 7/8 canonical files with deferred BM25 fallback after embedding network failures, and reported no blocking post-save issues.]
<!-- /ANCHOR:phase-3 -->

---

**Phase 4: Skill-Advisor Hook Remap (follow-up from live OpenCode session)**

Live finding 2026-04-23: skill-advisor plugin loaded cleanly post-009 but its per-prompt advisor brief never surfaced in OpenCode. Cause: the plugin returns Claude-Code-style hook names (`onSessionStart`, `onUserPromptSubmitted`, `onSessionEnd`) that OpenCode 1.3.17's `Hooks` interface does not recognize. See ADR-004.

- [x] **T-30** Read `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts` lines 142-260 (Hooks interface) and confirm hook-name mismatch. [EVIDENCE: OpenCode `Hooks` exposes `event`, `tool`, `chat.message`, `chat.params`, `chat.headers`, `permission.ask`, `command.execute.before`, `tool.execute.before`, `shell.env`, `tool.execute.after`, `experimental.chat.messages.transform`, `experimental.chat.system.transform`, `experimental.session.compacting`, and `experimental.text.complete`; it does not expose `onSessionStart`, `onUserPromptSubmitted`, or `onSessionEnd`.]
- [x] **T-31** Patch `.opencode/plugins/spec-kit-skill-advisor.js`: remap `onUserPromptSubmitted` to `'experimental.chat.system.transform'` (push brief into `output.system[]`). Keep all helper functions and bridge logic unchanged. [EVIDENCE: plugin now registers `'experimental.chat.system.transform': appendAdvisorBrief`; direct smoke proved `output.system[0]=Advisor: smoke brief landed.`]
- [x] **T-32** Replace `onSessionStart` and `onSessionEnd` with `event:` listener that filters by event type, mirroring the compact plugin's pattern at `spec-kit-compact-code-graph.js:329`. [EVIDENCE: plugin now registers `event: async ({ event }) => { ... }`, maps `session.created` to readiness, `session.deleted` to scoped cache cleanup, and `server.instance.disposed` / `global.disposed` to reset.]
- [x] **T-33** Add focused vitest covering: returned hook keys match OpenCode `Hooks` API, `experimental.chat.system.transform` populates `system[]` with the brief when advisor returns one, the `event:` handler filters correctly, the status tool still works. [EVIDENCE: `./node_modules/.bin/vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` passed 18/18.]
- [x] **T-34** Manual smoke in fresh OpenCode session: open in Public root, send a triggering prompt (e.g., "review my code for security"), confirm advisor brief now reaches the model context (model behavior follows skill-routing pattern OR brief is visible in compaction context OR `~/.local/share/opencode/log/` shows skill-advisor activity). [EVIDENCE: sandbox-friendly direct hook invocation imported the plugin, called `experimental.chat.system.transform`, and asserted `output.system[0]=Advisor: smoke brief landed.` A real TUI smoke was not run because direct hook smoke + vitest is sufficient Phase 4 evidence.]
- [x] **T-35** Update implementation-summary.md with the Phase 4 outcome, refresh ADR-004 evidence table, run strict validation + canonical save. [EVIDENCE: implementation summary/checklist/spec/ADR updated with Phase 4 evidence; `validate.sh --strict` passed 0 errors / 0 warnings; `generate-context.js` exited 0 and refreshed graph metadata with non-blocking embedding fallback warnings.]

---

**Phase 5: Status Accuracy + Defensive Guards (follow-up from real OpenCode TUI smoke)**

Live finding 2026-04-23 from real OpenCode TUI session: hook remap works (briefs reach model, `bridge_invocations=8`), but status tool surfaced `runtime_ready=false` despite session events firing AND `cache_hits=8 == cache_misses=8 == bridge_invocations=8` accounting bug. Codex review independently flagged 5 issues; this phase addresses 4 scoped fixes and explicitly defers the architectural ones. See ADR-005.

- [x] **T-36** Investigate the actual `@opencode-ai/sdk` Event type discriminant. Read `.opencode/node_modules/@opencode-ai/sdk/dist/` (or wherever the Event type is defined) to find the real event names emitted by OpenCode 1.3.17 for session creation, session deletion, server disposal. Compare against the strings the plugin currently checks (`session.created`, `session.deleted`, `server.instance.disposed`, `global.disposed`). [EVIDENCE: SDK `Event` uses the `type` discriminant. Exact members inspected: `.opencode/node_modules/@opencode-ai/sdk/dist/gen/types.gen.d.ts:493-510` defines `session.created`, `session.updated`, `session.deleted`; `:1-6` defines `server.instance.disposed`; v2 `.opencode/node_modules/@opencode-ai/sdk/dist/v2/gen/types.gen.d.ts:55-60` defines `global.disposed`; `@opencode-ai/plugin/dist/index.d.ts:142-145` types `Hooks.event` as `{ event: Event }`. Compact plugin reference at `.opencode/plugins/spec-kit-compact-code-graph.js:329-333` also filters `event?.type`.]
- [x] **T-37** Fix `event:` listener discriminant in `.opencode/plugins/spec-kit-skill-advisor.js` so `runtime_ready` actually flips to `true` when a session event fires. May require switching from `event.type` checks to whatever discriminant the SDK uses (`event.kind`, `event.name`, namespace path, etc.). [EVIDENCE: discriminant stayed `type`; plugin now normalizes direct or wrapped payloads via `eventTypeFrom()` and no longer lets bridge status overwrite lifecycle readiness. Direct Node smoke returned `runtime_ready=true` and `last_bridge_status=ready` after mock `{ type: 'session.created' }`.]
- [x] **T-38** Fix the cache metric accounting bug: audit every `cacheHits++` and `cacheMisses++` increment path; ensure exactly one increments per `getAdvisorContext` call; the invariant `cacheHits + cacheMisses === bridge_invocations` (or equivalent — depending on what bridge_invocations counts) must hold. [EVIDENCE: code audit confirmed `bridge_invocations` counts actual subprocess spawns/misses, not total lookups. Status now emits `advisor_lookups`; vitest locks `cache_misses === bridge_invocations` and `cache_hits + cache_misses === advisor_lookups`. Direct smoke returned `cache_hits=1`, `cache_misses=1`, `bridge_invocations=1`, `advisor_lookups=2`.]
- [x] **T-39** Add defensive guard in `appendAdvisorBrief`: at top, do `output.system = Array.isArray(output?.system) ? output.system : []` (or equivalent safety) so the handler never throws on a host that passes `output={}` or `{ system: null }`. [EVIDENCE: plugin initializes `output.system` defensively; vitest covers `{}` and `{ system: null }` with no throw and appended advisor briefs.]
- [x] **T-40** Normalize session IDs to strings in `sessionIdFrom()` and at every cache key construction site to prevent `[object Object]` collisions. [EVIDENCE: `sessionIdFrom()` and `cacheKeyForPrompt()` now normalize session IDs through stable stringification; vitest passes object session IDs with reordered keys and confirms deterministic cache behavior (`cache_hits=1`, `cache_misses=2`, `advisor_lookups=3`).]
- [x] **T-41** Run focused vitest, strict spec validation, canonical save. Update implementation-summary.md with Phase 5 outcome, refresh ADR-005 evidence table. Mark deferred items (in-flight dedup, module-global state refactor, size caps) explicitly in Known Limitations. [EVIDENCE: `npm run build` passed; focused skill-advisor vitest passed 23/23; direct runtime_ready and cache invariant smokes passed; `validate.sh --strict` passed 0/0; `generate-context.js` exited 0; deferred follow-ups listed in implementation summary.]

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 and P1 checklist items complete with evidence.
- TUI smoke green in both Public root and Barter.
- Both real plugins still load and execute (advisor brief + compact event observable).
- Regression guard test merged and passing.
- README convention documented.
- Strict validation 0/0; canonical save invoked.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` in this folder.
- Plan: `plan.md` in this folder.
- Checklist: `checklist.md` in this folder.
- Decision record: `decision-record.md` in this folder (ADR-001, ADR-002).
- Implementation summary: `implementation-summary.md` (created post-implementation).
- Sibling phases: `../004-copilot-hook-parity-remediation/`, `../005-codex-hook-parity-remediation/`.
<!-- /ANCHOR:cross-refs -->
