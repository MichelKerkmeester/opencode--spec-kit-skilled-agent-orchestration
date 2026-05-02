---
title: "Implementation Summary: CLI Matrix Adapter Runners"
template_source: "SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2"
description: "Completion summary for packet 036 CLI matrix adapter runners."
trigger_phrases:
  - "023-cli-matrix-adapter-runners"
  - "CLI matrix adapter"
  - "matrix runner adapters"
  - "cli-codex adapter"
  - "cli-copilot adapter"
  - "cli-gemini adapter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners"
    last_updated_at: "2026-04-29T20:35:30+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Resource map indexed"
    next_safe_action: "Use packet for downstream work"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md"
    completion_pct: 100
---
# Implementation Summary: CLI Matrix Adapter Runners

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-cli-matrix-adapter-runners |
| **Completed** | 2026-04-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 036 built the missing external CLI adapter layer for packet 030's matrix design. The implementation adds a shared adapter contract, five per-CLI adapters, a 70-cell manifest, feature prompt templates, a manifest-driven meta-runner, five mocked adapter smoke tests, runner docs, and this Level 2 packet documentation.

The work directly addresses packet 035's highest-leverage gap: the CONDITIONAL verdict listed 42 `RUNNER_MISSING` cells and noted no complete matrix manifest, runner tree, or meta-aggregator existed (`022-full-matrix-execution-validation/findings.md:5`, `:15`, `:73`, `:75`).

### Matrix Adapter Layer

You can now route packet 030's external CLI cells through typed adapter functions. The shared runner handles spawn errors, timeouts, stdout/stderr capture, and expected-signal detection, while each CLI adapter owns only its command shape.

| Area | Evidence |
|------|----------|
| Adapter contract | `adapter-common.ts` defines `AdapterStatus`, `AdapterInput`, and `AdapterResult` (`adapter-common.ts:14`, `:16`, `:24`) |
| Spawn/timeout handling | `runCliAdapter` normalizes spawn, stdout/stderr capture, timeout, expected-signal, and exit handling (`adapter-common.ts:97`, `:118`, `:134`, `:143`, `:160`) |
| CLI adapters | Five adapters wrap `codex`, `copilot`, `gemini`, `claude`, and `opencode` (`adapter-cli-codex.ts:16`, `adapter-cli-copilot.ts:14`, `adapter-cli-gemini.ts:14`, `adapter-cli-claude-code.ts:14`, `adapter-cli-opencode.ts:16`) |
| Matrix manifest | `matrix-manifest.json` enumerates 70 cells; sanity check output: `70`, `14`, `5`, `F11-cli-gemini` |
| Meta-runner | `run-matrix.ts` loads manifest, filters cells, routes adapters, writes JSONL, writes `summary.tsv`, and emits aggregates (`run-matrix.ts:125`, `:240`, `:248`, `:263`) |
| Smoke tests | Five adapter test files mock `spawn`, assert PASS parsing, and assert timeout behavior (`matrix-adapter-codex.vitest.ts:3`, `:14`, `:37`; `matrix-adapter-opencode.vitest.ts:14`, `:37`) |
| Docs | Runner README and MCP README structure reference (`.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md:12`, `:31`, `:64`; `.opencode/skill/system-spec-kit/mcp_server/README.md:1301`, `:1322`) |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts` | Created | Shared adapter contract and process handling |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/adapter-cli-*.ts` | Created | Five CLI adapter entrypoints |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` | Created | 70-cell external CLI manifest |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | Created | Manifest-driven meta-runner |
| `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-*.vitest.ts` | Created | Mocked smoke tests |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md` | Created | Runner usage docs |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Updated | Structure reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed inside the MCP server package and the packet 036 docs. It first added a shared adapter primitive, then layered five thin CLI adapters over it, then created the manifest/meta-runner surface, and finally pinned behavior with mocked Vitest smoke tests. The full matrix was not executed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shared adapter primitive | Keeps timeout, spawn-error, capture, and PASS detection behavior consistent across all five CLIs |
| Environment-overridable defaults | Lets future real runs adjust model/tier without editing source |
| Prompt templates emit `MATRIX_CELL_PASS F#` | Gives deterministic stdout detection across model providers |
| Concurrency fixed at 3 | Matches packet feedback that cli-copilot should not exceed 3 concurrent dispatches |
| `NA` handled in meta-runner, not adapters | Applicability belongs to the manifest; adapters stay executor-specific |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Command | Result |
|---------|--------|
| `node -e "<manifest sanity check>"` | `70`, `14`, `5`, `F11-cli-gemini` |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | Exit 0 |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run matrix-adapter` | Exit 0; 5 files passed; 10 tests passed |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/023-cli-matrix-adapter-runners --strict` | Exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Real external CLI auth was not exercised.** Packet 037 owns those checks.
2. **Prompt templates are adapter smoke prompts.** Future verification can replace them with deeper feature scripts.
3. **F13 native/inline runner remains outside this packet.** Packet 040 owns that runner.
4. **Packet 035 findings were not updated.** A later verification packet should consume these runners and publish new findings.
<!-- /ANCHOR:limitations -->
