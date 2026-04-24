---
title: "...ntext-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/001-validator-esm-fix/tasks]"
description: "Ordered task ladder for ESM migration of scripts/ package."
trigger_phrases:
  - "027/000 tasks"
  - "validator esm task ladder"
  - "scripts esm migration tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: level2-tasks | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/001-validator-esm-fix"
    last_updated_at: "2026-04-20T15:15:11Z"
    last_updated_by: "codex"
    recent_action: "Preserved task ladder."
    next_safe_action: "Commit scoped migration."
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source: "SPECKIT_TEMPLATE_SOURCE: level2-tasks | v2.2"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level2-tasks | v2.2 -->
<!-- ANCHOR:task-ladder -->

# Tasks: 027/000

| ID | Task | Priority | Est. | Evidence |
|---|---|---|---|---|
| T001 | Scaffold 027/000 spec folder (7 files) | P0 | — | This folder |
| T002 | Read predecessor evidence + research context (spec §2 Problem) | P0 | 2m | spec.md |
| T003 | Capture `npm test` baseline to `/tmp/027-000-baseline.log` | P0 | 2m | Log file |
| T004 | Capture `validate.sh` before-state to `/tmp/027-000-validate-before.log` | P0 | 1m | Log file |
| T005 | Flip `package.json` `"type": "commonjs"` → `"type": "module"` | P0 | 1m | Git diff |
| T006 | Create shared helper `lib/esm-entry.ts` exporting `isMainModule(importMetaUrl)` (P2 convenience) | P2 | 3m | New file |
| T007 | Convert all `if (require.main === module)` guards in production sources (18-20 files) | P0 | 20m | Grep returns 0 lines |
| T008 | Convert `const yaml = require('js-yaml')` → ESM import in `validation/continuity-freshness.ts` | P0 | 2m | File diff |
| T009 | Grep-audit for any remaining `= require(` or `require.main` in production sources; convert any survivors | P0 | 5m | Grep returns 0 lines |
| T010 | Grep-audit for `__dirname` / `__filename` in production sources; convert if present | P0 | 3m | Grep returns 0 lines |
| T011 | `rm -rf dist && npm run build` in scripts/ | P0 | 1m | Exit 0 |
| T012 | AC-1 Verify: `bash validate.sh .../002-daemon-freshness-foundation --strict --no-recursive` under Node 25 → no SyntaxError/ReferenceError | P0 | 2m | stderr clean |
| T013 | AC-2 Verify: same under Node 20.19.5 (`export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"`) | P0 | 2m | stderr clean |
| T014 | AC-3 Verify: `rm -rf dist && npm run build` exits 0 | P0 | 1m | Exit 0 |
| T015 | AC-4 Verify: `node dist/validation/evidence-marker-lint.js --folder <path> --json` exits cleanly | P0 | 1m | Stdout parseable JSON |
| T016 | AC-5 Verify: `grep -rln "require.main === module" scripts --include="*.ts" \| grep -v node_modules \| grep -v "\.vitest\.ts"` returns 0 | P0 | 1m | Empty output |
| T017 | AC-6 Verify: `grep -rln "^const .* = require(" scripts --include="*.ts" \| grep -v node_modules \| grep -v "\.vitest\.ts"` returns 0 | P0 | 1m | Empty output |
| T018 | AC-7 Verify: `npm test` in scripts/ matches baseline (no new regressions) | P0 | 3m | Diff vs baseline |
| T019 | AC-8 Verify: `node dist/memory/generate-context.js --stdin <<<'{}'` exits 1 with structured error, not SyntaxError | P0 | 1m | stderr clean |
| T020 | Update scripts README — add ESM requirement note + Node 25 support | P1 | 2m | Git diff |
| T021 | Mark all checklist.md items `[x]` with `file:line` evidence | P0 | 5m | checklist.md |
| T022 | Fill `implementation-summary.md` from placeholder → real summary | P0 | 3m | File diff |
| T023 | Commit `feat(027/000): migrate scripts/ to ESM for Node 25 compat` | P0 | 1m | Git log |
| T024 | Update parent `implementation-summary.md` Children Convergence Log (mark 000 "Converged") | P0 | 2m | Git diff |
| T025 | Push to main | P0 | 1m | Remote updated |

**Total est.:** 30-60 min for cli-codex gpt-5.4 high fast.

## Dispatch prompt for cli-codex

```
Implement Phase 027/000 per spec at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/001-validator-esm-fix/spec.md.

Scope: convert .opencode/skill/system-spec-kit/scripts/ from hybrid CJS/ESM to pure ESM so bash validate.sh runs green under Node 25.

Follow tasks.md T001-T025 in order. Do not modify anything outside .opencode/skill/system-spec-kit/scripts/ and the 027/000 spec folder.

On blocker, write blocker.md to 027/000/ and exit 2.

Commit + stop (orchestrator pushes).
```

<!-- /ANCHOR:task-ladder -->
