---
title: "Feature [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation/spec]"
description: "Update 13 external documentation files flagged by the 009 impact analysis (10 HIGH + 3 MED) to reflect the hook, advisor, plugin-loader, renderer, and Copilot wrapper behavior actually shipped across sub-packets 001-011. Source of truth is impact-analysis/merged-impact-report.md."
trigger_phrases:
  - "docs impact remediation"
  - "hook daemon docs alignment"
  - "026/009/012"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/012-docs-impact-remediation"
    last_updated_at: "2026-04-23T19:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec folder scaffolded from merged-impact-report.md (13 target files)"
    next_safe_action: "Begin P0 implementation with hook_system.md (highest agent-flagged count)"
    blockers: []
    completion_pct: 5
    status: "planning"
---
# Feature Specification: Documentation Impact Remediation for 009 Hook/Daemon Parity

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planning |
| **Created** | 2026-04-23 |
| **Parent** | `026-graph-and-context-optimization/009-hook-daemon-parity/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../011-copilot-writer-wiring/spec.md` |
| **Source Analysis** | `../impact-analysis/merged-impact-report.md` |
| **Underlying Reports** | `../impact-analysis/01-impact.md` through `10-impact.md` |

---

## 2. PROBLEM

Sub-packets 001-011 of `009-hook-daemon-parity` changed runtime hook contracts, advisor delivery, plugin-loader semantics, Copilot wrapper schema, Codex startup parity, and Claude prompt-time hook registration. The shipped behavior diverges from what the checked-in documentation still describes.

Ten parallel `cli-codex` impact-analysis agents (one per sub-packet, `gpt-5.4` reasoning=high, fast tier) audited every path referenced by `009/path-references-audit.md` and flagged files as HIGH / MED / LOW. After dedup and severity rollup (MAX across agents), **13 unique files** require updates:

- **10 HIGH** — doc is factually wrong or actively misleads operators relative to shipped behavior.
- **3 MED** — doc omits newly documented surfaces, knobs, or validation paths.

The top hotspot is `references/config/hook_system.md`, flagged by 6 of 10 sub-packets, because it is the canonical runtime hook matrix that every sub-packet touches.

Without this remediation, operators consulting `SKILL.md`, `ARCHITECTURE.md`, `hook_system.md`, top-level `AGENTS.md`, or the install / feature-catalog / testing playbook trees will receive stale or wrong guidance about:

- Gate 2 skill routing (script-first vs hook-first)
- Codex runtime hook capability (no-lifecycle vs `SessionStart` native)
- Claude `UserPromptSubmit` event registration under the normalized settings schema
- Copilot prompt/startup transport via `.claude/settings.local.json` wrapper fields
- OpenCode plugin loader contract (ESM default-export) and skill-advisor plugin bridge guarantees
- Codex hook timeout env knob (`SPECKIT_CODEX_HOOK_TIMEOUT_MS`)
- Advisor native MCP tools (`advisor_recommend`, `advisor_status`, `advisor_validate`)

---

## 3. SCOPE

### In Scope

Update the following 13 files to align with shipped 009 behavior. Severity is the maximum across flagging sub-packets.

**P0 — HIGH (10 files):**

| # | Path | Flagged By | Primary Change |
|---|---|---|---|
| 1 | `.opencode/README.md` | 01, 02, 07 | Rewrite Gate 2 and directory-structure prose: hook brief primary, `skill_advisor.py` as fallback; advisor surface now lives in `mcp_server/skill-advisor/`. |
| 2 | `.opencode/install_guides/SET-UP - AGENTS.md` | 02, 07 | Gate 2 setup teaches runtime hook brief first; `skill_advisor.py` as diagnostic fallback; add native-tool/bootstrap verification + `--force-native` / `--force-local` / disable-flag notes. |
| 3 | `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | 04, 08, 09 | Describe Copilot file-based custom-instructions path, `custom-instructions.ts` module, OpenCode plugin bridge ESM default-export entrypoint, per-instance state isolation, in-flight dedup, cap/eviction. |
| 4 | `.opencode/skill/system-spec-kit/README.md` | 01, 02, 03, 04 | Hook-primary skill-advisor routing, `scripts/` ESM profile, Copilot runtime-hooks summary, prompt-vs-lifecycle distinction. |
| 5 | `.opencode/skill/system-spec-kit/SKILL.md` | 01, 03, 04, 06, 10 | Startup/recovery split: Codex prompt-hook-only → now native SessionStart (per sub-packet 05 reconciliation, see §4 REQ-010); Claude `UserPromptSubmit` added to four-event surface; Copilot `.claude/settings.local.json` startup surface call-out. |
| 6 | `.opencode/skill/system-spec-kit/feature_catalog/**` | 10 | Update `22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` to name `.claude/settings.local.json` as the Copilot wrapper surface and note top-level writer commands on `UserPromptSubmit` + `SessionStart`. |
| 7 | `.opencode/skill/system-spec-kit/mcp_server/**/README.md` | 01, 10 | Refresh runtime hook README family under `mcp_server/hooks/`; replace Copilot registration example to show `.claude/settings.local.json` wrapper contract instead of `.github/hooks/scripts/*.sh`. |
| 8 | `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | 02, 10 | Expand verification to include `advisor_recommend` / `advisor_status` / `advisor_validate`; revise Copilot row to describe merged `.claude/settings.local.json` wrapper execution + top-level `type`/`bash`/`timeoutSec` contract + writer wiring. |
| 9 | `.opencode/skill/system-spec-kit/references/config/hook_system.md` | 01, 04, 05, 06, 07, 10 | Canonical runtime hook matrix refresh: Codex native SessionStart; Claude `UserPromptSubmit` in the four-event example; OpenCode plugin bridge + `experimental.chat.system.transform`; Copilot file-based parity via `.claude/settings.local.json`; cross-runtime fallback prose aligned. |
| 10 | `AGENTS.md` | 01, 05, 09 | Gate 2 anchored on hook brief primary + `skill_advisor.py` fallback; Codex SessionStart parity note; OpenCode plugin ESM exemption under `sk-code-opencode` language table. |

**P1 — MED (3 files):**

| # | Path | Flagged By | Primary Change |
|---|---|---|---|
| 11 | `.opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md` | 10 | Update `22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` to validate Copilot via `.claude/settings.local.json` wrapper path + managed-block refresh. |
| 12 | `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | 03 | Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` (default, scope, timeout fallback behavior). |
| 13 | `.opencode/skill/system-spec-kit/mcp_server/README.md` | 01 | Add hook-surface summary + cross-links to runtime hook READMEs and hook reference docs. |

### Out of Scope

- Additional code changes to hook logic, advisor internals, plugin bridge, Copilot writer, or Codex integration — already shipped in 001-011.
- Changes to docs *not* flagged by the merged impact report.
- Propagation of doc updates into downstream consumers outside this repo (e.g. external wikis, runbooks).
- Re-verification of sub-packet implementations; the impact report already ran 10 parallel analyses and dedup.

### Files Expected to Change

See §3 In Scope — the 13 listed paths. Expected LOC impact: ~200–450 total across all files (documentation-only).

---

## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Update `.opencode/README.md` Gate 2 + directory-structure sections | Hook brief primary, `skill_advisor.py` fallback, advisor path corrected to `mcp_server/skill-advisor/` |
| REQ-002 | Update `.opencode/install_guides/SET-UP - AGENTS.md` Gate 2 flow | Hook-first setup path, script fallback, native-tool verification steps |
| REQ-003 | Update `.opencode/skill/system-spec-kit/ARCHITECTURE.md` — Copilot transport + OpenCode plugin bridge | File-based `$HOME/.copilot/copilot-instructions.md`, `custom-instructions.ts` module, ESM default-export entrypoint, per-instance state / dedup / cap docs |
| REQ-004 | Update `.opencode/skill/system-spec-kit/README.md` | Hook-primary routing, `scripts/` ESM, Copilot runtime section, prompt-vs-lifecycle split |
| REQ-005 | Update `.opencode/skill/system-spec-kit/SKILL.md` startup/recovery | Codex native SessionStart note, Claude `UserPromptSubmit`, Copilot `.claude/settings.local.json` startup surface |
| REQ-006 | Update `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` | Copilot fallback entry names `.claude/settings.local.json` + top-level writer commands |
| REQ-007 | Update `mcp_server/hooks/copilot/README.md` (and siblings as applicable) | Registration example shows `.claude/settings.local.json` wrapper contract; remove `.github/hooks/scripts/*.sh` example |
| REQ-008 | Update `mcp_server/INSTALL_GUIDE.md` | Add advisor native tools to verification; revise Copilot row to describe merged wrapper execution + top-level fields + writer wiring |
| REQ-009 | Update `references/config/hook_system.md` | Canonical runtime matrix + Copilot row + Codex native + Claude four-event example + OpenCode plugin + cross-runtime fallback prose |
| REQ-010 | Update top-level `AGENTS.md` Gate 2 + runtime notes | Hook brief primary + fallback, Codex SessionStart parity, OpenCode plugin ESM exemption in `sk-code-opencode` table |

### P1 — Recommended

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-011 | Update `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` | Copilot validation scenario inspects `.claude/settings.local.json` + managed-block refresh |
| REQ-012 | Add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` to `mcp_server/ENV_REFERENCE.md` | Default, scope, timeout-fallback behavior documented |
| REQ-013 | Add hook-surface summary to `mcp_server/README.md` | Short summary + cross-links to hook READMEs and hook reference docs |

### P2 — Optional

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-014 | Reconcile Codex hook capability across docs | Every mention of "Codex has no lifecycle hook" is replaced with the accurate `codex_hooks`-gated native SessionStart description from sub-packet 05 |
| REQ-015 | Add cross-references back to this packet | Each updated file includes an inline reference to `026/009/012` in the relevant section's "Change note" or equivalent |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 10 P0 files updated, each change grounded in a specific sub-packet's impact-analysis row with source evidence cited.
- **SC-002**: All 3 P1 files updated to P1 acceptance.
- **SC-003**: No surviving reference to `skill_advisor.py` as *primary* Gate 2 routing surface in any updated file.
- **SC-004**: No surviving reference to `.github/hooks/scripts/*.sh` as the Copilot prompt/startup execution surface in any updated file (research pt-03 and sub-packet 10 supersede that).
- **SC-005**: `hook_system.md` includes rows or prose for all four runtimes (Claude, Codex, Gemini, Copilot, OpenCode bridge) with the current prompt-vs-lifecycle split accurately represented.
- **SC-006**: `validate.sh --strict` against this packet exits with code 0 or 1 (warnings acceptable, errors not).
- **SC-007**: `graph-metadata.json` for 009 parent includes 012 in `children_ids`.
