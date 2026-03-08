# F24 Shell Script Quality Fix Report

## Scope
Updated only the requested shell scripts plus this report:
- `.opencode/skill/system-spec-kit/scripts/ops/heal-index-drift.sh`
- `.opencode/skill/system-spec-kit/scripts/ops/heal-ledger-mismatch.sh`
- `.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh`
- `.opencode/skill/system-spec-kit/scripts/ops/heal-telemetry-drift.sh`
- `.opencode/skill/system-spec-kit/scripts/ops/ops-common.sh`
- `.opencode/skill/system-spec-kit/scripts/ops/runbook.sh`
- `.opencode/skill/system-spec-kit/scripts/lib/git-branch.sh`
- `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`
- `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`
- `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh`

## Fixes Applied

### 1) COMPONENT header normalization
All listed `.sh` files now start with:
```bash
#!/usr/bin/env bash
# ---------------------------------------------------------------
# COMPONENT: [Name Derived From Filename]
# ---------------------------------------------------------------
```

### 2) Conditional strict mode documentation
Added the required guard comment directly above conditional strict-mode blocks in:
- `scripts/lib/git-branch.sh`
- `scripts/lib/shell-common.sh`
- `scripts/lib/template-utils.sh`

Added comment text (exact):
```bash
# AI-GUARD: Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
```

### 3) Unquoted variable expansion fixes
Updated command-argument variable expansion in:
- `scripts/wrap-all-templates.sh`
  - `if [ ${total_errors} -gt 0 ]; then` → `if [ "${total_errors}" -gt 0 ]; then`

## Validation
- `bash -n` run across all 10 target scripts: **passed**.
- `shellcheck` run across all 10 target scripts: reported an existing warning (`SC2034` for `OPS_VERSION` in `ops-common.sh`) and returned non-zero; no new quoting/header/conditional-strict issues introduced by this fix.

## Logic/Behavior Safety
No operational logic was changed; edits were limited to header/comment/documentation normalization and one quoting hardening change.
