---
title: "Verification Checklist: cli-* skill consistency patterns"
description: "Per-skill grep gate + structural verification for the 052 harmonization packet."
trigger_phrases:
  - "cli skill checklist"
  - "do-not-collapse verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: cli-* skill consistency patterns

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- **P0** items are HARD BLOCKERS — packet cannot be marked complete until all P0 items are `[x]` with grep evidence.
- **P1** items are required — complete OR get user approval to defer.
- **P2** items may be deferred without approval.
- **Evidence format**: `[EVIDENCE: <bash command> -> <expected hit count>]` after each `[x]`.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Baseline grep snapshot captured for all 5 skills' do-not-collapse terms `[EVIDENCE: scratch/baseline-grep.txt populated]`
- [ ] CHK-002 [P0] cli-opencode SKILL.md §3 Provider Auth Pre-Flight subsection extracted to `scratch/provider-auth-preflight-template.md` `[EVIDENCE: file exists with the §3 block]`

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality (Per-Skill Do-Not-Collapse Grep Gate)

### cli-claude-code

- [ ] CHK-010 [P0] `--effort high` / `--effort` mention preserved `[EVIDENCE: grep -c 'effort high\|--effort' .opencode/skill/cli-claude-code/SKILL.md >= 1]`
- [ ] CHK-011 [P0] `--json-schema` preserved `[EVIDENCE: grep -c 'json-schema' >= 1]`
- [ ] CHK-012 [P0] `--max-budget-usd` preserved `[EVIDENCE: grep -c 'max-budget-usd' >= 1]`
- [ ] CHK-013 [P0] `--permission-mode` preserved `[EVIDENCE: grep -c 'permission-mode' >= 1]`
- [ ] CHK-014 [P0] surgical Edit tool mention preserved `[EVIDENCE: grep -ci 'edit tool\|surgical' >= 1]`

### cli-codex

- [ ] CHK-020 [P0] `--search` preserved `[EVIDENCE: grep -c '\-\-search' >= 1]`
- [ ] CHK-021 [P0] sandbox modes preserved `[EVIDENCE: grep -cE 'read-only\|workspace-write\|danger-full-access' >= 3]`
- [ ] CHK-022 [P0] `--ask-for-approval` preserved `[EVIDENCE: grep -c 'ask-for-approval' >= 1]`
- [ ] CHK-023 [P0] `--image` / `-i` visual input preserved `[EVIDENCE: grep -c '\-\-image' >= 1]`
- [ ] CHK-024 [P0] session fork mention preserved `[EVIDENCE: grep -ci 'session fork\|fork session' >= 1]`
- [ ] CHK-025 [P0] `/review` subcommand preserved `[EVIDENCE: grep -c '/review' >= 1]`
- [ ] CHK-026 [P0] hooks support preserved `[EVIDENCE: grep -ci 'hooks support\|codex_hooks\|SessionStart' >= 1]`

### cli-copilot

- [ ] CHK-030 [P0] `--allow-all-tools` Autopilot preserved `[EVIDENCE: grep -c 'allow-all-tools' >= 1]`
- [ ] CHK-031 [P0] `/delegate` cloud agents preserved `[EVIDENCE: grep -c '/delegate' >= 1]`
- [ ] CHK-032 [P0] `/model` runtime switch preserved `[EVIDENCE: grep -c '/model' >= 1]`
- [ ] CHK-033 [P0] repo memory preserved `[EVIDENCE: grep -ci 'repo memory' >= 1]`
- [ ] CHK-034 [P0] `--agent explore | task` preserved `[EVIDENCE: grep -cE 'explore\|task' >= 1]`
- [ ] CHK-035 [P0] max-3-concurrent constraint preserved `[EVIDENCE: grep -ci 'concurrent\|max 3' >= 1]`
- [ ] CHK-036 [P0] `SPEC-KIT-COPILOT-CONTEXT` markers preserved `[EVIDENCE: grep -c 'SPEC-KIT-COPILOT-CONTEXT' >= 1]`

### cli-gemini

- [ ] CHK-040 [P0] `google_web_search` preserved `[EVIDENCE: grep -c 'google_web_search' >= 1]`
- [ ] CHK-041 [P0] `codebase_investigator` preserved `[EVIDENCE: grep -c 'codebase_investigator' >= 1]`
- [ ] CHK-042 [P0] `save_memory` tool preserved `[EVIDENCE: grep -c 'save_memory' >= 1]`
- [ ] CHK-043 [P0] 1M+ context window mention preserved `[EVIDENCE: grep -cE '1M\+\|1 million' >= 1]`
- [ ] CHK-044 [P0] free tier mention preserved `[EVIDENCE: grep -ci 'free tier' >= 1]`
- [ ] CHK-045 [P0] `.geminiignore` preserved `[EVIDENCE: grep -c '\.geminiignore' >= 1]`
- [ ] CHK-046 [P0] `--yolo` / `-y` preserved `[EVIDENCE: grep -c '\-\-yolo' >= 1]`

### cli-opencode

- [ ] CHK-050 [P0] `--share --port` parallel detached preserved `[EVIDENCE: grep -cE '\-\-share.*\-\-port\|\-\-port.*\-\-share' >= 1]`
- [ ] CHK-051 [P0] `--dir` cross-repo preserved `[EVIDENCE: grep -c '\-\-dir' >= 1]`
- [ ] CHK-052 [P0] `--attach` cross-server preserved `[EVIDENCE: grep -c '\-\-attach' >= 1]`
- [ ] CHK-053 [P0] ADR-001 self-invocation guard preserved `[EVIDENCE: grep -c 'ADR-001' >= 1]`
- [ ] CHK-054 [P0] `--variant` preserved `[EVIDENCE: grep -c '\-\-variant' >= 1]`
- [ ] CHK-055 [P0] `--pure` plugin-disable preserved `[EVIDENCE: grep -c '\-\-pure' >= 1]`
- [ ] CHK-056 [P0] Provider Auth Pre-Flight (canonical) preserved `[EVIDENCE: grep -c 'Provider Auth Pre-Flight' >= 1]`

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing (Structural Harmonization Verification)

- [ ] CHK-060 [P0] All 5 SKILL.md files have identical 8-section header order/titles `[EVIDENCE: diff <(grep '^## [0-9]\+\.' cli-claude-code/SKILL.md) <(grep '^## [0-9]\+\.' cli-codex/SKILL.md) returns empty; repeat for all pairs]`
- [ ] CHK-061 [P0] All 5 skills have an Error Handling table in §3 `[EVIDENCE: grep -lE '^### Error Handling' .opencode/skill/cli-*/SKILL.md returns 5 paths]`
- [ ] CHK-062 [P0] All 5 skills have a Default Invocation block in §3 `[EVIDENCE: grep -lE 'Default Invocation' .opencode/skill/cli-*/SKILL.md returns 5 paths]`
- [ ] CHK-063 [P0] All 5 skills have a Provider Auth Pre-Flight subsection in §3 `[EVIDENCE: grep -lE 'Provider Auth Pre-Flight' .opencode/skill/cli-*/SKILL.md returns 5 paths]`
- [ ] CHK-064 [P0] UNKNOWN_FALLBACK_CHECKLIST appears exactly once per skill `[EVIDENCE: for f in .opencode/skill/cli-*/SKILL.md; do echo "$f: $(grep -c UNKNOWN_FALLBACK_CHECKLIST $f)"; done all show 1]`
- [ ] CHK-065 [P1] INTENT_SIGNALS count is 7 across all 5 skills `[EVIDENCE: per-skill awk-block-extraction yields 7 entries each]`
- [ ] CHK-066 [P1] ALWAYS / NEVER / ESCALATE triple in §4 of all 5 skills `[EVIDENCE: grep -cE '^### (ALWAYS\|NEVER\|ESCALATE)' returns 3 per skill]`

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-070 [P0] No provider credentials embedded in SKILL.md or graph-metadata.json `[EVIDENCE: grep -E 'sk-[a-zA-Z0-9]{20,}\|ghp_[a-zA-Z0-9]{36}\|key-[a-zA-Z0-9]{32}' .opencode/skill/cli-*/SKILL.md .opencode/skill/cli-*/graph-metadata.json returns empty]`
- [ ] CHK-071 [P0] Self-invocation guard preserved in all 5 skills `[EVIDENCE: grep -lE 'self-invocation\|self_invocation' .opencode/skill/cli-*/SKILL.md returns 5 paths]`

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-080 [P0] Strict validate exit 0 `[EVIDENCE: bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/052-cli-skill-patterns --strict; echo $?  -> 0]`
- [ ] CHK-081 [P1] Each skill's `graph-metadata.json` `causal_summary` mentions the new harmonized subsection terms (Default Invocation / Error Handling / Provider Auth Pre-Flight) `[EVIDENCE: grep -l 'Provider Auth Pre-Flight\|Error Handling\|Default Invocation' .opencode/skill/cli-*/graph-metadata.json returns 5 paths]`
- [ ] CHK-082 [P2] Anchor cross-link audit returns no rotted links `[EVIDENCE: grep -rn '<!-- ANCHOR:' .opencode/skill/cli-*/SKILL.md; manual review]`

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] No new top-level files added to any cli-* skill folder (harmonization is in-file edits only) `[EVIDENCE: git status --short .opencode/skill/cli-*/ | grep -v '^[ M]' returns empty]`
- [ ] CHK-091 [P2] `references/hook_contract.md` (cli-codex) preserved `[EVIDENCE: ls .opencode/skill/cli-codex/references/hook_contract.md returns 0]`
- [ ] CHK-092 [P2] `assets/shell_wrapper.md` (cli-copilot) preserved `[EVIDENCE: ls .opencode/skill/cli-copilot/assets/shell_wrapper.md returns 0]`

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Status | P0 | P1 | P2 |
|--------|----|----|----|
| Pending | 30+ | 5 | 3 |
| Pass | 0 | 0 | 0 |
| Fail | 0 | 0 | 0 |
| Deferred | 0 | 0 | 0 |

**HARD BLOCKER status**: All P0 items must be `[x]` with grep evidence before `implementation-summary.md` is authored and packet 052 is marked complete.
<!-- /ANCHOR:summary -->

---
