# Changelog: 041/010-self-test-fixes

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 010-self-test-fixes — 2026-04-04

Fixed 5 issues discovered during the Phase 009 self-test and promoted 6 candidate improvements from that test into the canonical agent file. Added a configurable plateau window setting to close the observation about plateau detector behavior.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/010-sk-improve-agent-self-test-fixes/`

---

## Bug Fixes (5)

### Stale command path in agent definition

**Problem:** The agent file referenced `/improve:agent-improver` and `.opencode/command/spec_kit/agent-improver.md`, both of which were stale paths from before the Phase 008 rename.

**Fix:** Updated to `/improve:agent` and `.opencode/command/improve/agent.md`.

### Reducer family hardcoding

**Problem:** `inferFamily()` in `reduce-state.cjs` defaulted everything to `session-handover`, which produced incorrect family labels for non-handover targets.

**Fix:** The reducer now uses the profileId for non-handover/context-prime targets instead of falling back to a hardcoded default.

### Accepted count miscounting

**Problem:** The dashboard's accepted count only counted `candidate-promoted` recommendations, missing `candidate-acceptable` and `candidate-better` which are also accepted outcomes.

**Fix:** Updated the accepted counting logic to include all three recommendation types that represent acceptance.

### Wrong Gemini mirror path

**Problem:** The Gemini mirror reference pointed to `.agents/agents/*.md` instead of the correct `.gemini/agents/*.md` path.

**Fix:** Corrected the canonical path reference in the mirror configuration.

### Codex TOML wording inconsistency

**Problem:** The Codex TOML wrapper used "leaf-only mutator" while all other surfaces used "leaf mutator".

**Fix:** Standardized to "leaf mutator" for consistency across all runtime wrappers.

---

## New Features (1)

### Configurable plateau window

**Problem:** The plateau detector used a hardcoded window of 3 consecutive identical scores. The self-test showed this was sometimes too rigid.

**Fix:** Added `stopRules.plateauWindow` to the improvement config (default 3, backward compatible). Documented the new field in `improvement_config_reference.md`.

---

## Promoted Candidates (6)

### Improvements promoted from Phase 009

**Problem:** Phase 009 generated 3 candidates with improvements that were validated but not yet promoted to the canonical agent file.

**Fix:** Promoted 6 specific improvements: HALT CONDITION block with structured error JSON for missing inputs, merged two checklist blocks into one unified verification list, self-validation converted from numbered YES/NO to checkbox format, 4th anti-pattern ("Never proceed when required inputs are missing"), scan report provenance note in Step 2, and summary box Step 2 label updated to include integration scan report.

---

<details>
<summary>Files Changed (6)</summary>

| File | What changed |
| --- | --- |
| `.opencode/agent/agent-improver.md` | Command path fix, 6 promoted improvements merged in. |
| `sk-improve-agent/scripts/reduce-state.cjs` | Family inference fix, accepted count fix. |
| `sk-improve-agent/references/improvement_config_reference.md` | New `plateauWindow` field documented. |
| `.gemini/agents/agent-improver.md` | Mirror path corrected. |
| `.codex/agents/agent-improver.toml` | Wording standardized to "leaf mutator". |
| `.agents/agents/agent-improver.md` | Mirror synced with canonical updates. |

</details>

---

## Upgrade

No migration required. The `plateauWindow` config field defaults to 3, matching the previous hardcoded behavior.
