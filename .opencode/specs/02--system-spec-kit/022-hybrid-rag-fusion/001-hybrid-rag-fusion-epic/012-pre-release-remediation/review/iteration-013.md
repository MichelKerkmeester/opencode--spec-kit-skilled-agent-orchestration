# Iteration 013 -- Maintainability: root README and install-guide drift

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** maintainability, traceability
**Status:** complete
**Timestamp:** 2026-03-27T17:04:00+01:00

## Findings

### HRF-DR-004 [P1] Public docs/install surfaces drift from live repo truth
- **File:line:** `.opencode/README.md:52-58`; `.opencode/install_guides/README.md:17,820,1179,1236,1433`; `.opencode/skill/system-spec-kit/SKILL.md:5`
- **Evidence:** Public docs still advertise stale counts (`9 agents`, `22 commands`) and `system-spec-kit v2.2.26.0` while the live skill is `v2.2.27.0` and base agent files on disk now total `10`.
- **Recommendation:** Refresh README/install guide counts, versions, and command/agent listings against the live filesystem.

## Next Adjustment
- Strengthen the same finding with the broken CocoIndex installer target and the mislabeled packet-local README.
