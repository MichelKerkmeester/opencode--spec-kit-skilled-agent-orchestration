---
title: "Implementation Plan: Hook Plugin Per Runtime Testing"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Plan and verification record for live hook and plugin testing across five runtimes."
trigger_phrases:
  - "030-hook-plugin-per-runtime-testing"
  - "runtime hook tests"
  - "per-runtime hook validation"
  - "cli skill hook tests"
  - "hook live testing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/030-hook-plugin-per-runtime-testing"
    last_updated_at: "2026-04-29T21:12:00+02:00"
    last_updated_by: "cli-codex"
    recent_action: "Plan executed"
    next_safe_action: "Review findings matrix"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: Hook Plugin Per Runtime Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Markdown, JSONL |
| **Framework** | Packet-local runners under Spec Kit docs |
| **Storage** | `results/*.jsonl` |
| **Testing** | Live CLI subprocesses plus strict spec validation |

### Overview

The implementation creates a small packet-local harness rather than changing shared runtime code. Each runtime runner checks binary/config availability, invokes the runtime CLI, captures evidence, and pairs that with the deterministic hook or plugin signal needed to classify the cell.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Hook contract reference read.
- [x] Per-runtime hook READMEs read.
- [x] Per-runtime CLI skill docs read.
- [x] Matrix adapter runner shape read.
- [x] Prior hook findings read.

### Definition of Done

- [x] Runners created for five runtimes.
- [x] Orchestrator writes packet-local JSONL.
- [x] Live run completed with five classified cells.
- [x] Findings matrix written.
- [x] Strict validator exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Packet-local live runner with shared subprocess and result classification helpers.

### Key Components

| Component | Purpose |
|-----------|---------|
| `runners/common.ts` | Shared types, subprocess execution, timeout handling, redaction, and JSONL writes |
| `test-claude-hooks.ts` | Claude CLI invocation plus UserPromptSubmit hook smoke |
| `test-codex-hooks.ts` | Codex CLI invocation plus stale fallback and freshness smoke |
| `test-copilot-hooks.ts` | Copilot CLI invocation plus isolated custom-instructions refresh |
| `test-gemini-hooks.ts` | Gemini CLI invocation plus BeforeAgent hook smoke |
| `test-opencode-plugins.ts` | OpenCode CLI invocation plus plugin system transform smoke |
| `run-all-runtime-hooks.ts` | Three-wide orchestrator and result writer |

### Data Flow

```text
runtime runner -> CLI subprocess -> hook/plugin observable -> classify -> JSONL
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Context Loading

- Read hook docs, plugin entrypoint, CLI skill docs, and matrix adapter helpers.
- Confirm existing packet folder contents before writing.

### Phase 2: Runner Implementation

- Build shared runner primitives and per-runtime cells.
- Add an orchestrator that runs at most three cells at once.
- Keep all runtime config files read-only.

### Phase 3: Live Execution And Reporting

- Run the orchestrator with live CLI subprocesses.
- Aggregate JSONL into `findings.md`.
- Write packet docs and validate strictly.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Evidence |
|-------|----------|
| Live orchestrator | `node --experimental-strip-types .../run-all-runtime-hooks.ts` produced five JSONL files |
| Result completeness | `results/` contains Claude, Codex, Copilot, Gemini, and OpenCode JSONL |
| Secret redaction | Targeted `rg` found no key-like secret values in `results/` |
| Findings | `findings.md` lists all runtime/event statuses |
| Strict spec validation | `validate.sh ... --strict` exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Role |
|------------|------|
| Claude Code CLI | Live Claude hook invocation |
| Codex CLI | Live Codex hook invocation |
| GitHub Copilot CLI | Live Copilot hook invocation |
| Gemini CLI | Live Gemini hook invocation |
| OpenCode CLI | Live OpenCode plugin invocation |
| Runtime hook configs | Read-only evidence and invocation wiring |
| Node.js | Executes packet-local runners and direct hook smokes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the packet-local files added under `030-hook-plugin-per-runtime-testing/`. Runtime hook configs were not modified, so rollback does not require restoring Claude, Codex, Copilot, Gemini, or OpenCode settings.
<!-- /ANCHOR:rollback -->
