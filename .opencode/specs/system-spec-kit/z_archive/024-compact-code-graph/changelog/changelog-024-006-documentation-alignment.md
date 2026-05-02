# Changelog: 024/006-documentation-alignment

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 006-documentation-alignment — 2026-03-31

This phase documented the compact-code-graph rollout across the places users actually learn the system: the feature catalog, the manual testing playbook, the skill docs, and the architecture notes. Instead of leaving the new behavior trapped in phase specs, it turned the rollout into operator-facing reference material.

> Spec folder: `.opencode/specs/system-spec-kit/024-compact-code-graph/006-documentation-alignment/`

---

## Documentation (3)

### Feature catalog coverage

**Problem:** The new hook, recovery, and structural-search capabilities were implemented but not described in the feature catalog.

**Fix:** Added catalog entries so the packet’s behavior is discoverable from the canonical system inventory.

### Manual testing playbook updates

**Problem:** Testers had no clear scenarios for startup recovery, compaction behavior, or code-graph-assisted recovery.

**Fix:** Added playbook coverage for those flows, with scenario-level steps and evidence expectations.

### Skill and architecture updates

**Problem:** The higher-level docs still described the old context-preservation story.

**Fix:** Updated `SKILL.md`, architecture guidance, and README-level references so the packet’s runtime model and recovery design are reflected outside the spec folder.

---

## Follow-Up Gaps (1)

### Broader parity work still open

**Problem:** Some README and dedicated cross-runtime documentation work was intentionally left out of this phase.

**Status:** Recorded as follow-up scope rather than claimed as delivered here.

---

## Files Changed (5)

| File | What changed |
|------|-------------|
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Added compact-code-graph capability coverage. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Added testing coverage for recovery and startup behavior. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Synced system behavior and recovery references. |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Added architecture notes for the packet’s runtime behavior. |
| `README.md` | Added cross-links to the new packet documentation surfaces. |

---

## Upgrade

No migration required.
