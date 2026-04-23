---
title: "Checklist: Documentation Impact Remediation for 009 Hook/Daemon Parity"
description: "Active verification checklist for 13 flagged file updates. P0 maps to HIGH-severity rows, P1 to MED, P2 to optional drift prevention."
trigger_phrases:
  - "docs impact remediation checklist"
  - "026/009/012 checklist"
contextType: "checklist"
---
# Verification Checklist: Documentation Impact Remediation for 009 Hook/Daemon Parity

<!-- SPECKIT_LEVEL: 2 -->

Mark each item `[x]` only with **evidence**: file path + line range, commit hash, quoted text, or `grep` output that demonstrates the change. Cannot claim this packet done until all P0 and P1 items are verified.

---

## P0 — Blockers (10 HIGH-severity files + metadata + validation)

### Canonical Runtime Contracts

- [ ] **T-001** `references/config/hook_system.md` — runtime matrix refreshed with Codex native `SessionStart` (post-05), Claude `UserPromptSubmit`, OpenCode plugin bridge, Copilot `.claude/settings.local.json` wrapper parity; cross-runtime fallback prose aligned. [Evidence: ]
- [ ] **T-002** `AGENTS.md` — Gate 2 hook-brief primary + script fallback; Codex SessionStart note; OpenCode plugin ESM exemption in `sk-code-opencode` language table. [Evidence: ]
- [ ] **T-003** `.opencode/skill/system-spec-kit/SKILL.md` — startup/recovery section: Claude four-event + `UserPromptSubmit`; Codex post-05 native `SessionStart`; Copilot `.claude/settings.local.json` startup surface. [Evidence: ]
- [ ] **T-004** `.opencode/skill/system-spec-kit/ARCHITECTURE.md` — Copilot file-based transport documented (`custom-instructions.ts` → `$HOME/.copilot/copilot-instructions.md`); OpenCode plugin bridge ESM default-export + per-instance state / dedup / cap. [Evidence: ]

### Package-Level READMEs

- [ ] **T-005** `.opencode/README.md` — Gate 2 prose + directory-structure updated; advisor surface pointer corrected to `mcp_server/skill-advisor/`. [Evidence: ]
- [ ] **T-006** `.opencode/skill/system-spec-kit/README.md` — hook-primary skill-advisor section; `scripts/` ESM module profile; Copilot runtime section; prompt-vs-lifecycle split. [Evidence: ]
- [ ] **T-007** `mcp_server/hooks/copilot/README.md` (and sibling runtime hook READMEs with stale Copilot examples) — registration example now uses `.claude/settings.local.json` wrapper contract; `.github/hooks/scripts/*.sh` example removed. [Evidence: ]

### Install / Reference / Feature-Catalog

- [ ] **T-008** `.opencode/install_guides/SET-UP - AGENTS.md` — Gate 2 hook-first path + script fallback + native-tool/bootstrap verification + `--force-native` / `--force-local` / disable-flag notes. [Evidence: ]
- [ ] **T-009** `mcp_server/INSTALL_GUIDE.md` — advisor native tools added to verification; Copilot row describes `.claude/settings.local.json` wrapper execution + top-level field contract + writer wiring. [Evidence: ]
- [ ] **T-010** `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` — Copilot fallback entry names `.claude/settings.local.json` + top-level writer commands. [Evidence: ]

### Graph / Validation

- [ ] **T-014** 009 parent `graph-metadata.json` `children_ids` includes `system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation`. [Evidence: ]
- [ ] **T-015** `validate.sh --strict` exits 0 or 1 on this packet. [Evidence: ]
- [ ] **T-016** `description.json` + this packet's `graph-metadata.json` refreshed via canonical save. [Evidence: ]

---

## P1 — Recommended (3 MED-severity files)

- [ ] **T-011** `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` — Copilot scenario inspects `.claude/settings.local.json` top-level fields/commands + managed-block refresh. [Evidence: ]
- [ ] **T-012** `mcp_server/ENV_REFERENCE.md` — `SPECKIT_CODEX_HOOK_TIMEOUT_MS` added with default, scope, timeout-fallback behavior. [Evidence: ]
- [ ] **T-013** `mcp_server/README.md` — hook-surface summary + cross-links to runtime hook READMEs + hook reference docs. [Evidence: ]

---

## P2 — Optional (drift prevention)

- [ ] **T-017** Every mention of "Codex has no lifecycle hook" across updated files replaced with the post-05 native `SessionStart` description. [Evidence: ]
- [ ] Inline `[026/009/012]` change-note back-reference in each updated file's relevant section (traceability). [Evidence: ]

---

## Cross-File Consistency Gates

These are integrated checks run after individual P0 tasks complete; they verify the canonical docs tell one coherent story.

- [ ] `grep -rn "skill_advisor.py" .opencode/README.md .opencode/skill/system-spec-kit/README.md AGENTS.md` — any surviving references explicitly describe the **fallback** path, never the primary Gate 2 surface. [Evidence: ]
- [ ] `grep -rn "\.github/hooks/scripts" .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md .opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — returns no rows for the Copilot prompt/startup execution path. [Evidence: ]
- [ ] `grep -rn "CommonJS entrypoint.*plugin\|plugin.*CommonJS entrypoint" .opencode/skill/system-spec-kit/ARCHITECTURE.md` — empty (plugin is ESM default-export). [Evidence: ]
- [ ] `hook_system.md`, `SKILL.md`, `ARCHITECTURE.md`, `AGENTS.md` agree on: Codex post-05 native `SessionStart` gated by `codex_hooks`; Claude four-event `UserPromptSubmit` surface; OpenCode plugin bridge transport; Copilot `.claude/settings.local.json` wrapper. [Evidence: read-through log ]

---

## Completion Gate

Cannot claim this packet "done" until:
1. All P0 items above are `[x]` with evidence.
2. All P1 items are `[x]` with evidence.
3. All four Cross-File Consistency Gates pass.
4. `implementation-summary.md` populated with Work Log, Lessons Learned, and final status.
5. `/memory:save` run with canonical JSON to refresh `description.json` + `graph-metadata.json`.
