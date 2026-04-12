# Codex CLI Prompt — Fix 009 build errors + rebuild dist/ + re-verify in the wild

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). Self-contained prompt. This is a FOCUSED CORRECTION follow-up to packet `026/003-memory-quality-issues/009-post-save-render-fixes/` — the code you just shipped has 4 TypeScript compile errors that were missed because the original verification used `mcp_server` typecheck (which does not include `scripts/`), and the `scripts/dist/` directory was never rebuilt so the CLI still runs 4-day-old compiled output.

## SCOPE

1. Fix 4 known TypeScript compile errors in `scripts/core/workflow.ts` and `scripts/extractors/collect-session-data.ts`
2. Run `npm run build` in `scripts/` to regenerate `scripts/dist/`
3. Run a real memory save on packet 014 via `node scripts/dist/memory/generate-context.js` and inspect the output against the 9 wrapper-contract checks
4. Report PASS/FAIL per contract check

## PRE-APPROVALS (do not ask)

- Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/` (PRE-APPROVED)
- This is a bug fix to uncommitted code that you shipped in a prior run; authorized to modify the same files you already touched

## THE 4 COMPILE ERRORS (exact locations)

Run `cd .opencode/skill/system-spec-kit/scripts && npm run build` first to see the live errors. Expected output includes:

```
core/workflow.ts(1446,48): error TS2352: Conversion of type 'CanonicalDocs' to type 'Record<string, unknown>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Index signature for type 'string' is missing in type 'CanonicalDocs'.
core/workflow.ts(1447,12): error TS2352: Conversion of type 'CanonicalDocs' to type 'Record<string, unknown>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Index signature for type 'string' is missing in type 'CanonicalDocs'.
core/workflow.ts(1527,30): error TS2352: Conversion of type 'FilterStats' to type 'Record<string, unknown>' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Index signature for type 'string' is missing in type 'FilterStats'.
extractors/collect-session-data.ts(772,33): error TS2552: Cannot find name 'match'. Did you mean 'matches'?
```

### Fix 1 — `core/workflow.ts:1446` and `:1447` (CanonicalDocs cast)
Replace the direct cast `x as Record<string, unknown>` with a double cast `x as unknown as Record<string, unknown>`. This tells TypeScript you understand the type conversion and accept responsibility.

### Fix 2 — `core/workflow.ts:1527` (FilterStats cast)
Same pattern: `x as unknown as Record<string, unknown>`.

### Fix 3 — `extractors/collect-session-data.ts:772` (typo `match` vs `matches`)
Either `match` should be `matches` (if a previously-defined variable) OR it should be a method call like `.match(regex)`. Read the surrounding code (lines 760-780) to determine intent and fix accordingly. Do NOT introduce a new bug — understand what the code was trying to do.

### Rebuild verification

After fixing all 4 errors:
```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build
```
Must exit with code 0. If any new errors surface, fix them the same way.

## STEP 2 — Run the wild save

After `dist/` is rebuilt, run the memory save on 014 via the CLI and inspect the output:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades 2>&1 | tail -30
```

The `/tmp/save-context-data.json` file already exists from the prior wild verification attempt. Use it as-is. The save will create a NEW memory file in `005-code-graph-upgrades/memory/` with a fresh timestamp.

If the save fails because of a post-009 change to the input validator (e.g., now requires a new field), edit `/tmp/save-context-data.json` to satisfy the validator and retry. Report any field changes in your output.

## STEP 3 — Audit the new memory file against the 9 wrapper-contract checks

After the save completes, find the newest file in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/memory/` (timestamp suffix will tell you). Read it and verify each of the 9 checks:

| Lane | Check | Pass criterion |
|--|--|--|
| A | Title | Does NOT contain `[<folder-slug>/<filename>]` suffix |
| B | CANONICAL SOURCES | Contains real pointer entries to the 014 packet's spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md (at minimum). NOT the "No canonical static documents detected" fallback text. |
| C | captured_file_count | Frontmatter shows `captured_file_count: 5` (or however many files are in `/tmp/save-context-data.json` filesModified) |
| D | trigger_phrases | Contains the authored phrases from the payload (`"014 post-009 wild verification"`, `"009 pipeline fix end-to-end"`, `"wrapper contract compliance proof"`, `"014 memory save post render fix"`, `"post-save render fixes verification"`) AND does NOT contain bigram-noise phrases (`"resolver bug"`, `"captured file count"`, `"chosen approach"`, `"session during"`, prose-fragment shapes) |
| E | DISTINGUISHING EVIDENCE | Bullets are DEDUPED (no identical duplicates), prefer bullets with `[SOURCE: file:line]` anchor patterns over prose paraphrases |
| F | Phase/Status | `Context Summary` Phase reflects the payload's intent (REVIEW is acceptable since `contextType: "review"`), AND `Session Status` + `Completion %` are either correct-from-payload OR honestly derived from git state (not stale defaults) |
| G | causal_links.derived_from | Contains at least one entry pointing at the prior 014 memory saves (`09-04-26_08-46__...` or `09-04-26_10-30__...`) |
| H | parent_spec | Points at `"system-spec-kit/026-graph-and-context-optimization"` (the ACTUAL parent) NOT the self-referential `"system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades"` |
| I | quality_score rename | Frontmatter uses `render_quality_score` (NOT the generic `quality_score`). Metadata.json uses `input_completeness_score` (NOT the generic `filtering.qualityScore`). |

## CONSTRAINTS

- **Do NOT modify anything outside the 2 named `.ts` files plus `/tmp/save-context-data.json` if the validator demands payload shape changes**
- **Do NOT rebuild mcp_server** — only `scripts/` needs rebuilding
- **Do NOT delete the historical 014 memory saves** (the 08:46 and 10:30 files stay)
- **Do NOT commit** — leave changes uncommitted
- **HONESTY**: If any of the 9 contract checks FAIL even after the rebuild, report which ones failed and DO NOT claim overall success. Partial fixes are OK to report as partial.

## OUTPUT FORMAT (print at the very end)

```
=== FIX_009_BUILD_REBUILD_VERIFY_RESULT ===
COMPILE_ERRORS_FIXED:
  workflow.ts:1446:  FIXED (CanonicalDocs double-cast)
  workflow.ts:1447:  FIXED (CanonicalDocs double-cast)
  workflow.ts:1527:  FIXED (FilterStats double-cast)
  collect-session-data.ts:772: FIXED (actual fix: <describe>)
NEW_ERRORS_DISCOVERED_DURING_REBUILD: <list or "none">

BUILD:
  npm run build (scripts): PASS | FAIL
  dist/memory/generate-context.js modified timestamp: <new time>
  dist/core/title-builder.js modified timestamp: <new time>

WILD_SAVE:
  command: node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json .../005-code-graph-upgrades
  exit code: <n>
  new memory file: <path>

WILD_VERIFICATION (9 lanes):
  LANE_A_TITLE:               PASS | FAIL (notes)
  LANE_B_CANONICAL_SOURCES:   PASS | FAIL (what was rendered)
  LANE_C_FILE_CAPTURE:        PASS | FAIL
  LANE_D_TRIGGER_PHRASES:     PASS | FAIL (authored present/missing, noise present/absent)
  LANE_E_EVIDENCE:            PASS | FAIL (duplicates found? anchors present?)
  LANE_F_PHASE_STATUS:        PASS | FAIL
  LANE_G_CAUSAL_LINKS:        PASS | FAIL
  LANE_H_PARENT_SPEC:         PASS | FAIL
  LANE_I_SCORER_NAMES:        PASS | FAIL

VERIFICATION_TOTALS:
  lanes_passing: <n> / 9
  verdict: ALL_PASS | PARTIAL | ALL_FAIL

BLOCKERS: <list or "none">

NEXT_STEP_RECOMMENDATION:
  - If ALL_PASS: commit + push the 009 fix is safe
  - If PARTIAL: fix the remaining failing lanes before commit
  - If ALL_FAIL: the fixes never reached the runtime; deeper investigation needed
=== END_FIX_009_BUILD_REBUILD_VERIFY_RESULT ===
```

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/` (pre-approved)
