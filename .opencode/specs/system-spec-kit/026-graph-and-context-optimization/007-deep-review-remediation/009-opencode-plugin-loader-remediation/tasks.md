---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->"
title: "Task Breakdown: OpenCode Plugin Loader Remediation"
description: "Task breakdown for investigating the OpenCode 1.3.17 plugin loader contract, isolating non-plugin helpers, smoke-testing the TUI in two directories, and adding a regression guard."
trigger_phrases:
  - "026/007/009 tasks"
  - "opencode plugin loader tasks"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/009-opencode-plugin-loader-remediation"
    last_updated_at: "2026-04-22T13:32:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implementation complete; full vitest blocked"
    next_safe_action: "Resolve out-of-scope Copilot hook wiring test, then rerun full vitest"
    completion_pct: 95
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
- [ ] **T-22** Run full vitest suite to ensure no regression: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run`. [EVIDENCE: deferred per P1-04 — see implementation-summary.md Known Limitations item 1; out-of-scope Copilot hook wiring blocker is tracked in parent 007-deep-review-remediation handover.md as priority follow-up. Focused plugin-loader tests passed 15/15.]
- [x] **T-23** Author or update a new README inside `.opencode/plugins/` documenting the "entrypoints only" convention; list current plugin entrypoints; reference `.opencode/plugin-helpers/` (or whichever target outcome A/B/C selected). [EVIDENCE: `.opencode/plugins/README.md` created.]
- [x] **T-24** Add top-of-file comment to each relocated helper explaining why it lives outside `.opencode/plugins/` and citing this packet. [EVIDENCE: all three helpers start with packet 026/007/009 relocation comments.]
- [x] **T-25** Update parent handover (the sibling-level handover.md in `007-deep-review-remediation/`) with phase outcome. [EVIDENCE: parent `../handover.md` now records the 009 phase outcome.]
- [x] **T-26** Walk `checklist.md` with evidence (P0/P1/P2 entries). [EVIDENCE: checklist updated with evidence and the full-suite limitation.]
- [x] **T-27** Author `implementation-summary.md` (post-impl, mirrors sibling 008's structure: Metadata / What Built / How Delivered / Decisions / Verification / Limitations). [EVIDENCE: implementation summary populated.]
- [x] **T-28** Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — must pass 0 errors / 0 warnings. [EVIDENCE: strict validation passed with 0 errors / 0 warnings.]
- [x] **T-29** Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for canonical save (refreshes description.json + graph-metadata.json). [EVIDENCE: `generate-context.js` exited 0, refreshed `graph-metadata.json`, indexed 7/8 canonical files with deferred BM25 fallback after embedding network failures, and reported no blocking post-save issues.]
<!-- /ANCHOR:phase-3 -->

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
- Sibling phases: `../007-copilot-hook-parity-remediation/`, `../008-codex-hook-parity-remediation/`.
<!-- /ANCHOR:cross-refs -->
