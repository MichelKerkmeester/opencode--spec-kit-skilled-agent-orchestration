# Applied: .opencode/install_guides/SET-UP - AGENTS.md

## Source Flagging
- Sub-packets: 02,07
- Severity (from merged report): HIGH

## Changes Applied
- Rewrote the Gate 2 setup prose and embedded AGENTS example to make the automatic Skill Advisor Hook brief primary and `skill_advisor.py` the fallback/diagnostic shim.
  - Before: `.opencode/install_guides/SET-UP - AGENTS.md:540-575` said `When Gate 2 runs skill_advisor.py...` and `Gate 2 routes tasks to skills via skill_advisor.py.`
  - After: `.opencode/install_guides/SET-UP - AGENTS.md:540-575` now says `When the runtime surfaces the automatic Skill Advisor Hook brief...` and `Gate 2 uses the automatic Skill Advisor Hook brief...`
  - Flagged by: 02,07
- Expanded the verification checklist from script-only checks to native-first bootstrap verification.
  - Before: `.opencode/install_guides/SET-UP - AGENTS.md:786-805` only ran `python3 .../skill_advisor.py "help me debug CSS"` and had no native tool verification.
  - After: `.opencode/install_guides/SET-UP - AGENTS.md:780-831` adds `--force-native`, `--force-local`, `advisor_status(...)`, `advisor_recommend(...)`, `advisor_validate(...)`, and a rollback note for `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
  - Flagged by: 02
- Replaced script-only Gate 2 summaries with hook-first wording across the usage and validation references.
  - Before: `.opencode/install_guides/SET-UP - AGENTS.md:838`, `:858`, `:874`, and `:926` described Gate 2 as `Run skill_advisor.py`.
  - After: `.opencode/install_guides/SET-UP - AGENTS.md:858`, `:878`, `:894`, and `:946` describe Gate 2 as `Use hook brief when available -> else skill_advisor.py` and update success criteria to `Hook-first skill routing works...`
  - Flagged by: 02,07
- Updated troubleshooting and file references to document the shipped compat controls and bootstrap source-of-truth.
  - Before: `.opencode/install_guides/SET-UP - AGENTS.md:1057-1068` only checked whether `skill_advisor.py` existed and ran, and `:1226` labeled it the `Gate 2 skill routing script`.
  - After: `.opencode/install_guides/SET-UP - AGENTS.md:1077-1105` adds `--force-native`, `--force-local`, `unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, and native tool probes; `:1259-1260` now labels the script as a compatibility shim and points readers to `mcp_server/skill-advisor/INSTALL_GUIDE.md`.
  - Flagged by: 02

## Evidence Links
- Merged report row: `impact-analysis/merged-impact-report.md:35`
- Merged report detailed section: `impact-analysis/merged-impact-report.md:66-76`
- Per-sub-packet evidence: `impact-analysis/02-impact.md:19`, `impact-analysis/02-impact.md:33-35`, `impact-analysis/07-impact.md:20`
- Native tool surface shipped: `002-skill-graph-daemon-and-advisor-unification/005-mcp-advisor-surface/implementation-summary.md:49-59`
- Native-first compat flow and controls shipped: `002-skill-graph-daemon-and-advisor-unification/006-compat-migration-and-bootstrap/implementation-summary.md:50-78`
- OpenCode prompt-time hook brief shipped: `007-opencode-plugin-loader-remediation/implementation-summary.md:58-64`, `007-opencode-plugin-loader-remediation/implementation-summary.md:82-84`

## Verification
- Frontmatter parses: target file had no YAML frontmatter before the edit and remains frontmatter-free after the edit.
- Anchors are still paired: target file contains no `<!-- ANCHOR:* -->` markers; open count `0`, close count `0`.
- No unrelated content was deleted: `git diff -- .opencode/install_guides/SET-UP - AGENTS.md` shows changes only in the flagged Gate 2, verification, troubleshooting, success-criteria, and file-reference blocks.

## Deferred / Unchanged
- No suggested changes were deferred. All merged-report changes for this target were applied within the existing sections.
