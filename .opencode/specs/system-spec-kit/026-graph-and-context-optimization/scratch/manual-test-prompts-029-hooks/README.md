---
title: "029 — Manual Test Prompts for Hook + Plugin Features"
description: "Paste-ready prompts to exercise code-graph hooks, skill-advisor hooks, and OpenCode plugin features across Claude, Codex, Copilot, Gemini, and OpenCode runtimes after the Phase 029 remediation (commits 9810ad65d + 19eb09c3c)."
importance_tier: "high"
contextType: "manual-testing"
---

# Manual Test Prompts — 029 Hook + Plugin Verification

Paste-ready prompt packs for live verification of the three hook/plugin subsystems
remediated in Phase 029. One doc per subsystem; each doc walks through all runtimes
(Claude, Codex, Copilot, Gemini, OpenCode) where the subsystem applies.

## Files

| File | Subsystem | Runtimes | Covers |
|---|---|---|---|
| [code-graph-hooks.md](./code-graph-hooks.md) | Code-graph lifecycle hook + plugin bridge | OpenCode (plugin), Claude (SessionStart), Copilot (wrapper), Gemini | HOOK-P1-001, HOOK-P2-005 + parity |
| [skill-advisor-hooks.md](./skill-advisor-hooks.md) | Skill advisor prompt hook | Claude, Codex, Copilot, Gemini | HOOK-P1-002, HOOK-P1-003, native-first path, stale fallback, PreToolUse (Codex) |
| [opencode-plugin.md](./opencode-plugin.md) | OpenCode plugin deep-dive | OpenCode only | Bridge contract, startup digest, message-retrieval transform, compaction resume note |

## How to Use

1. Pick a subsystem doc.
2. Open the CLI section you're testing.
3. Run the **Preconditions** block to prepare workspace state.
4. Open the CLI in a fresh session.
5. Paste each **Test Scenario** prompt verbatim; observe the **Expected Signals** in the response.
6. Record pass/fail in the **Results Log** template at the bottom.

**No code changes required** to execute any test. Some tests call shell commands (`npm run...`, `node ...`); paste those into a separate terminal (not the CLI).

## Source Docs

- **Findings:** `review/027-.../codex-and-code-graph-hook-deep-dive.md` (10 findings, 5 P1 + 5 P2)
- **Implementation:** Phase 029 commits `3751acbe7` (scaffold) → `9810ad65d` (Phases A-E) → `19eb09c3c` (setup.ts + policy repair)
- **ADRs:** `../decision-record.md` (ADR-001..ADR-006)
- **Checklist evidence:** `../checklist.md` (R-P1-A..E + R-P2-A..E)

## Runtime Coverage Matrix

| Runtime | Prompt hook | Lifecycle/startup | Compaction | Stop | Plugin |
|---|---|---|---|---|---|
| Claude | ✅ tested | ✅ tested | ✅ tested | ✅ tested | n/a |
| Codex | ✅ tested | ❌ CLI doesn't support | ❌ | ❌ | n/a |
| Copilot | ✅ tested | ✅ tested (wrapper) | ✅ tested | n/a | n/a |
| Gemini | ⚠️ not deep-smoked pre-029 | ⚠️ | ⚠️ | ⚠️ | n/a |
| OpenCode | ⚠️ advisor separate | ✅ tested (plugin) | ✅ tested (plugin) | n/a | ✅ full coverage |

Legend: ✅ = test prompt exists in this pack | ⚠️ = smoke-level test, extend as needed | ❌ = capability absent by design

## Results Log Template

```
## [YYYY-MM-DD] Test Run

Runtime: [claude|codex|copilot|gemini|opencode]
Version: [$ codex --version, $ claude --version, etc.]
Environment: [workstation | CI | Superset]

| Scenario ID | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|
| CG-01 | ... | ... | ✅ | ... |
| CG-02 | ... | ... | ❌ | ... |
| ... | ... | ... | ... | ... |

Open blockers: [none | list]
Follow-ups: [none | list]
```

Append runs to the end of each subsystem doc's **Results Log** section.
