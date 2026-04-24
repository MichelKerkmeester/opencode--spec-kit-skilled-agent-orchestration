---
title: "...ontext-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/001-validator-esm-fix/plan]"
description: "Phase plan for converting scripts/ package from hybrid CJS/ESM to pure ESM."
trigger_phrases:
  - "ontext"
  - "optimization"
  - "009"
  - "hook"
  - "daemon"
  - "plan"
  - "001"
  - "validator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/001-validator-esm-fix"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Plan: 027/000 — Validator ESM Migration

## Phase Sequence

```
[baseline capture] → [package.json flip] → [source migration] → [rebuild] → [verify] → [commit]
```

## Phase 1 — Baseline capture (5 min)

- Run `cd .opencode/skill/system-spec-kit/scripts && npm test 2>&1 | tee /tmp/027-000-baseline.log`
- Record current pass/fail count so post-migration diff is interpretable
- Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/.../027-.../002-daemon-freshness-foundation --strict --no-recursive 2>&1 | tee /tmp/027-000-validate-before.log` — expect FAILED

## Phase 2 — Package-level flip (2 min)

- Edit `.opencode/skill/system-spec-kit/scripts/package.json`:
  - `"type": "commonjs"` → `"type": "module"`
- Leave `tsconfig.json` at `"module": "es2022"` (correct ESM output)

## Phase 3 — Source migration (20-40 min)

Pattern 1 — entrypoint guard (18-20 occurrences):

```ts
// Before
if (require.main === module) {
  main().catch(e => { console.error(e); process.exit(1); });
}

// After
import { fileURLToPath } from 'node:url';
const isMain = import.meta.url === fileURLToPath(process.argv[1]) ||
               import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch(e => { console.error(e); process.exit(1); });
}
```

Or via a shared helper `lib/esm-entry.ts`:
```ts
import { fileURLToPath } from 'node:url';
export function isMainModule(importMetaUrl: string): boolean {
  return importMetaUrl === fileURLToPath(process.argv[1]) ||
         importMetaUrl === `file://${process.argv[1]}`;
}
// Callers: if (isMainModule(import.meta.url)) { ... }
```

Pattern 2 — `require()` for user modules:

```ts
// Before (continuity-freshness.ts:11)
const yaml = require('js-yaml') as { load: (source: string) => unknown };

// After
import * as yaml from 'js-yaml';
// OR: import yaml from 'js-yaml';  (depending on yaml module shape)
```

Pattern 3 — `__dirname` / `__filename`:

```ts
// Before
const here = __dirname;

// After
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
const here = path.dirname(fileURLToPath(import.meta.url));
```

## Phase 4 — Rebuild (1 min)

```bash
cd .opencode/skill/system-spec-kit/scripts
rm -rf dist
npm run build
```

## Phase 5 — Verify (5-10 min)

Run each P0/P1/AC check from spec.md §4+§5:
- validate.sh on Node 25
- validate.sh on Node 20.19.5 (PATH override)
- evidence-marker-lint.js standalone invocation
- continuity-freshness.js standalone invocation
- generate-context.js --stdin test
- npm test in scripts/ — compare to /tmp/027-000-baseline.log

## Phase 6 — Commit (2 min)

Single commit: `feat(027/000): migrate scripts/ to ESM for Node 25 compat`

Body:
```
- Flip package.json "type" from commonjs to module
- Convert 18-20 production source files from require.main === module to import.meta.url check
- Convert continuity-freshness.ts yaml import from require() to import statement
- Verify validate.sh runs green on Node 25 + Node 20
- No semantic changes to validator logic

Closes 027/000.
```

## Estimated wall-clock

30-60 minutes for a cli-codex gpt-5.4 high fast dispatch.

## References

- Spec: `./spec.md`
- Tasks: `./tasks.md`
- Checklist: `./checklist.md`
- Parent battle plan: `../battle-plan.md`
