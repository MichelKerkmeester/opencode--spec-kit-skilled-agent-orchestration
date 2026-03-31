---
title: "Checklist: Spec 017 - Agent Provider Switching [04--agent-orchestration/z_archive/017-agent-provider-switch/checklist]"
description: "Verification Date: 2026-02-16"
trigger_phrases:
  - "checklist"
  - "spec"
  - "017"
  - "agent"
  - "provider"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Spec 017 - Agent Provider Switching

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:p0 -->
## P0 - Hard Blockers

- [x] CHK-001 Spec folder exists at `.opencode/specs/04--agent-orchestration/z_archive/017-agent-provider-switch` [Evidence: folder created and verified via `ls`]
- [x] CHK-002 Spec documentation is Level 3 (`SPECKIT_LEVEL: 3` markers present) [Evidence: headers in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`]
- [x] CHK-003 Upgrade script check executed (`upgrade-level.sh ... --to 3 --dry-run` -> already Level 3) [Evidence: script output confirms `Detected level: 3 (explicit)`]
- [x] CHK-004 Runtime path invariance preserved (`.opencode/agent/*.md` remains primary) [Evidence: all references use `.opencode/agent/*.md`, profile folders separate at `.opencode/agent/{provider}/`]
- [x] CHK-005 Activation script performs backup + rollback on failure [Evidence: induced mismatch test exits 5 with `ERROR: Verification failed for write.md`, `ROLLBACK_RUNTIME_MATCH=YES` confirms restore]
- [x] CHK-006 Activation script verifies all managed runtime agent files [Evidence: script loops over 8 files with frontmatter verification after copy]
<!-- /ANCHOR:p0 -->

---

<!-- ANCHOR:p1 -->
## P1 - Required

- [x] CHK-010 Copilot profile folder exists and is complete (8 files) [Evidence: `.opencode/agent/copilot/` contains 8 agent files verified by status script]
- [x] CHK-011 ChatGPT profile folder parity verified (8 files) [Evidence: `.opencode/agent/chatgpt/` contains matching 8 agent files]
- [x] CHK-012 Provider status script reports active provider + verification health [Evidence: `provider-status.sh` shows `copilot 8/8 MATCH`]
- [x] CHK-013 README documents switch workflow and troubleshooting [Evidence: `.opencode/README.md` and `.opencode/skill/scripts/README.md` updated with activation/status commands]
- [x] CHK-014 Two-way switch test passes: copilot -> chatgpt -> copilot [Evidence: successful round-trip switching with clean activation]
- [x] CHK-015 Failure rollback test passes [Evidence: induced mismatch exits 5, runtime restored to backup]
- [x] CHK-016 Decision record captures selected architecture and alternatives [Evidence: `decision-record.md` documents runtime path, profile names, activation flow]
<!-- /ANCHOR:p1 -->

---

<!-- ANCHOR:p2 -->
## P2 - Optional

- [ ] CHK-020 Launch wrappers added (`opencode-copilot`, `opencode-chatgpt`)
- [ ] CHK-021 Active provider marker file added for faster status checks
- [ ] CHK-022 Automated drift detection added in CI/preflight
<!-- /ANCHOR:p2 -->

---

<!-- ANCHOR:verification-summary -->
<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 7 | 7/7 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-02-16
<!-- /ANCHOR:verification-summary -->
<!-- /ANCHOR:summary -->
