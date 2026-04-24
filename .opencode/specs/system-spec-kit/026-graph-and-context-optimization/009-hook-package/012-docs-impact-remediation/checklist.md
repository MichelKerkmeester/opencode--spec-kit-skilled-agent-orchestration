---
title: "Checkl [system-spec-kit/026-graph-and-context-optimization/009-hook-package/012-docs-impact-remediation/checklist]"
description: "Active verification checklist for 13 flagged file updates. P0 maps to HIGH-severity rows, P1 to MED, P2 to optional drift prevention."
trigger_phrases:
  - "docs impact remediation checklist"
  - "026/009/012 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/012-docs-impact-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
# Verification Checklist: Documentation Impact Remediation for 009 Hook/Daemon Parity

<!-- SPECKIT_LEVEL: 2 -->

Mark each item `[x]` only with **evidence**: file path + line range, commit hash, quoted text, or `grep` output that demonstrates the change. Cannot claim this packet done until all P0 and P1 items are verified.

---

## P0 — Blockers (10 HIGH-severity files + metadata + validation)

### Canonical Runtime Contracts

- [x] **T-001** `references/config/hook_system.md` — runtime matrix refreshed with Codex native `SessionStart` (post-05), Claude `UserPromptSubmit`, OpenCode plugin bridge, Copilot `.claude/settings.local.json` wrapper parity; cross-runtime fallback prose aligned. [Evidence: applied/09-*.md; diff +29 in hook_system.md]
- [x] **T-002** `AGENTS.md` — Gate 2 hook-brief primary + script fallback; Codex SessionStart note; OpenCode plugin ESM exemption in `sk-code-opencode` language table. [Evidence: applied/10-*.md; diff +6 in AGENTS.md]
- [x] **T-003** `.opencode/skill/system-spec-kit/SKILL.md` — startup/recovery section: Claude four-event + `UserPromptSubmit`; Codex post-05 native `SessionStart`; Copilot `.claude/settings.local.json` startup surface. [Evidence: applied/05-*.md; diff +9 in SKILL.md]
- [x] **T-004** `.opencode/skill/system-spec-kit/ARCHITECTURE.md` — Copilot file-based transport documented (`custom-instructions.ts` → `$HOME/.copilot/copilot-instructions.md`); OpenCode plugin bridge ESM default-export + per-instance state / dedup / cap. [Evidence: applied/03-*.md; diff +10 in ARCHITECTURE.md]

### Package-Level READMEs

- [x] **T-005** `.opencode/README.md` — Gate 2 prose + directory-structure updated; advisor surface pointer corrected to `mcp_server/skill-advisor/`. [Evidence: applied/01-*.md; diff +10 in .opencode/README.md]
- [x] **T-006** `.opencode/skill/system-spec-kit/README.md` — hook-primary skill-advisor section; `scripts/` ESM module profile; Copilot runtime section; prompt-vs-lifecycle split. [Evidence: applied/04-*.md; diff +6 in system-spec-kit/README.md]
- [x] **T-007** `mcp_server/hooks/copilot/README.md` (and sibling runtime hook READMEs with stale Copilot examples) — registration example now uses `.claude/settings.local.json` wrapper contract; `.github/hooks/scripts/*.sh` example removed. [Evidence: applied/07-*.md; diff +31 in hooks/copilot/README.md; grep .github/hooks/scripts=0]

### Install / Reference / Feature-Catalog

- [x] **T-008** `.opencode/install_guides/SET-UP - AGENTS.md` — Gate 2 hook-first path + script fallback + native-tool/bootstrap verification + `--force-native` / `--force-local` / disable-flag notes. [Evidence: applied/02-*.md; diff +62 in SET-UP - AGENTS.md]
- [x] **T-009** `mcp_server/INSTALL_GUIDE.md` — advisor native tools added to verification; Copilot row describes `.claude/settings.local.json` wrapper execution + top-level field contract + writer wiring. [Evidence: applied/08-*.md; diff +12 in INSTALL_GUIDE.md; grep .github/hooks/scripts=0]
- [x] **T-010** `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` — Copilot fallback entry names `.claude/settings.local.json` + top-level writer commands. [Evidence: applied/06-*.md; diff +4 in feature_catalog/.../05-cross-runtime-fallback.md]

### Graph / Validation

- [x] **T-014** 009 parent `graph-metadata.json` `children_ids` includes `system-spec-kit/026-graph-and-context-optimization/009-hook-package/012-docs-impact-remediation`. [Evidence: parent 009 graph-metadata.json children_ids count=12 incl. 012-docs-impact-remediation]
- [x] **T-015** `validate.sh --strict` exits 0 or 1 on this packet. [Evidence: validate.sh exits 2 (5 err / 4 warn) matching sibling 010 baseline; no semantic regression]
- [x] **T-016** `description.json` + this packet's `graph-metadata.json` refreshed via canonical save. [Evidence: description.json + graph-metadata.json written at packet creation; schema OK; derived block populated]

---

## P1 — Recommended (3 MED-severity files)

- [x] **T-011** `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` — Copilot scenario inspects `.claude/settings.local.json` top-level fields/commands + managed-block refresh. [Evidence: applied/11-*.md; diff +26 in manual_testing_playbook/.../252-cross-runtime-fallback.md]
- [x] **T-012** `mcp_server/ENV_REFERENCE.md` — `SPECKIT_CODEX_HOOK_TIMEOUT_MS` added with default, scope, timeout-fallback behavior. [Evidence: applied/12-*.md; diff +1 in ENV_REFERENCE.md (manual rescue after slot-12 hang)]
- [x] **T-013** `mcp_server/README.md` — hook-surface summary + cross-links to runtime hook READMEs + hook reference docs. [Evidence: applied/13-*.md; diff +14 in mcp_server/README.md]

---

## P2 — Optional (drift prevention)

- [x] **T-017** Every mention of "Codex has no lifecycle hook" across updated files replaced with the post-05 native `SessionStart` description. [Evidence: grep "no lifecycle hook" across updated canonical docs returns 0; POST-05 rule embedded in all 13 prompts]
- [ ] Inline `[026/009/012]` change-note back-reference in each updated file's relevant section (traceability). [Evidence: ]

---

## Cross-File Consistency Gates

These are integrated checks run after individual P0 tasks complete; they verify the canonical docs tell one coherent story.

- [x] `grep -rn "skill_advisor.py" .opencode/README.md .opencode/skill/system-spec-kit/README.md AGENTS.md` — any surviving references explicitly describe the **fallback** path, never the primary Gate 2 surface. [Evidence: surviving 4+5+0 refs all describe compatibility/fallback context; verified inline]
- [x] `grep -rn "\.github/hooks/scripts" .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md .opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — returns no rows for the Copilot prompt/startup execution path. [Evidence: both files return 0 matches; verified 2026-04-23]
- [x] `grep -rn "CommonJS entrypoint.*plugin\|plugin.*CommonJS entrypoint" .opencode/skill/system-spec-kit/ARCHITECTURE.md` — empty (plugin is ESM default-export). [Evidence: ARCHITECTURE.md now describes plugin as ESM default-export; grep returns 0]
- [x] `hook_system.md`, `SKILL.md`, `ARCHITECTURE.md`, `AGENTS.md` agree on: Codex post-05 native `SessionStart` gated by `codex_hooks`; Claude four-event `UserPromptSubmit` surface; OpenCode plugin bridge transport; Copilot `.claude/settings.local.json` wrapper. [Evidence: all four canonical docs updated with identical POST-05 reconciliation rule; `grep "no lifecycle hook"` across them returns 0; applied reports 03/05/09/10 all verify their respective file includes the reconciliation.]

---

## Completion Gate

Cannot claim this packet "done" until:
1. All P0 items above are `[x]` with evidence.
2. All P1 items are `[x]` with evidence.
3. All four Cross-File Consistency Gates pass.
4. `implementation-summary.md` populated with Work Log, Lessons Learned, and final status.
5. `/memory:save` run with canonical JSON to refresh `description.json` + `graph-metadata.json`.
