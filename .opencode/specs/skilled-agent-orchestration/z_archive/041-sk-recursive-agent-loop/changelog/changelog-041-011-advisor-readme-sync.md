# Changelog: 041/011-advisor-readme-sync

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 011-advisor-readme-sync — 2026-04-04

Updated the skill advisor routing tables and root README to make Phase 008+ capabilities discoverable. Added intent boosters, phrase intent boosters, and command bridges so the advisor correctly routes queries about 5-dimension evaluation, dynamic profiling, and integration scanning to sk-improve-agent. Bumped the skill version to 1.0.0.0.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/011-sk-improve-agent-advisor-readme-sync/`

---

## Changed (4)

### Skill advisor routing (Public)

**Problem:** The skill advisor had no awareness of Phase 008+ capabilities. Queries about 5-dimension evaluation, dynamic profiling, or integration scanning would not route to sk-improve-agent.

**Fix:** Added 7 INTENT_BOOSTERS, 13 PHRASE_INTENT_BOOSTERS, and 8 COMMAND_BRIDGES covering the full Phase 008+ surface.

### Skill advisor routing (Barter)

**Problem:** The Barter-specific advisor lacked command bridges for `/improve:prompt` and `/create:*` commands.

**Fix:** Added 7 COMMAND_BRIDGES and 2 PHRASE_INTENT_BOOSTERS for the Barter skill advisor.

### Skill README version bump

**Problem:** The skill README still showed version 0.1.0.0, which did not reflect the maturity after 11 phases.

**Fix:** Bumped version from 0.1.0.0 to 1.0.0.0 with an updated description reflecting the full feature set.

### Root README agent network

**Problem:** The root README did not mention Context-Prime or Agent-Improver in the Agent Network section, and the Improve Agent command description was outdated.

**Fix:** Added Context-Prime and Agent-Improver to the Agent Network section and rewrote the Improve Agent command description. Updated 5 command README.txt files across all runtimes.

---

## Verification (1)

### Routing confidence checks

**Problem:** Needed to confirm the new advisor entries actually route correctly.

**Fix:** Verified routing at target confidence: `"5-dimension evaluation"` at 0.92, `"/improve:agent"` at 0.95, `"score agent"` at 0.89, and all `/create:*` commands routed correctly.

---

<details>
<summary>Files Changed (8)</summary>

| File | What changed |
| --- | --- |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | 7 intent boosters, 13 phrase intent boosters, 8 command bridges (Public). |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` (Barter) | 7 command bridges, 2 phrase intent boosters. |
| `sk-improve-agent/README.md` | Version 0.1.0.0 to 1.0.0.0, updated description. |
| `README.md` (root) | Agent Network section and Improve Agent description updated. |
| `.opencode/command/*/README.txt` | 5 command README.txt files updated across runtimes. |

</details>

---

## Upgrade

No migration required.
