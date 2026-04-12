# Codex CLI Prompt — Close the 3 remaining 009 gaps + cosmetic note fix

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). Self-contained prompt. This is a FOCUSED CORRECTION follow-up to packet `026/003-memory-quality-issues/009-post-save-render-fixes/` which already shipped 7 of 9 lanes working in the wild. Close the remaining 3 gaps, rebuild dist/, re-run the wild save, re-audit, report.

## SCOPE

After the initial 009 scaffold+fix run (all uncommitted in working tree), a wild verification via `node dist/memory/generate-context.js` on packet 014 produced **7 of 9 lanes PASS** with these remaining gaps:

1. **Lane F — PARTIAL**: Phase derivation from `contextType` works (renders `Phase: IMPLEMENTATION`), but explicit payload fields for Status and Completion% are REJECTED by the loader as "Unknown field":
   ```
   [WARN] Unknown field in input data: "phase" — this field will be ignored
   [WARN] Unknown field in input data: "status" — this field will be ignored
   [WARN] Unknown field in input data: "completionPercent" — this field will be ignored
   ```
   The new save still shows `Session Status: IN_PROGRESS` + `Completion %: 95%` (stale defaults). Lane F's fix for payload overrides either never landed OR uses different field names that the loader's known-field list doesn't include.

2. **Lane G — FAIL**: `causal_links.derived_from` in the rendered memory file is still `[]` empty despite 3 prior 014 sibling memory saves existing (`09-04-26_08-46__...`, `09-04-26_10-30__...`, `09-04-26_12-22__...`). The auto-populate fix from the initial 009 run either doesn't run, runs in a branch that's not exercised, or writes to the wrong field.

3. **OVERVIEW truncation (10th bug)** — NOT previously scoped in 009. The post-save review reports it as a HIGH issue:
   ```
   [HIGH] D1 overview: OVERVIEW appears truncated mid-token or with non-canonical ellipsis handling
     Fix: Re-render the OVERVIEW from the full session summary using the boundary-safe truncation helper
   ```
   The new save's OVERVIEW ends with `"...without replacing…"` — the sentence is cut mid-phrase. A boundary-safe truncation helper already exists per the post-save review's fix suggestion; your job is to find it and use it when rendering the OVERVIEW section.

4. **Cosmetic note prose leak** — line 23 of the new save shows `> **Note:** This session had limited actionable content (quality score: 0/100).` The label "quality score" is the OLD generic scorer name. Since Lane I renamed the frontmatter field to `render_quality_score`, the note prose should match: either say `render_quality_score: X/100` or `input_completeness_score: X/100` depending on which one the note is actually reporting. Inconsistent label is confusing.

## PRE-APPROVALS (do not ask)

- Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/` (PRE-APPROVED)
- Authorized to modify: the same scripts files already touched in the initial 009 run (see FILES_MODIFIED in the prior result), plus `templates/context_template.md` if the note prose is in the template

## MANDATORY READS (read once at start)

1. The wild-verified successful save (your ground truth for what the current pipeline produces):
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades/memory/09-04-26_12-40__shipped-the-005-code-graph-upgrades-runtime-lane.md`
2. The clean 014-only test payload already in place:
   - `/tmp/save-context-data.json` (do NOT edit unless you discover the Lane F fix requires specific payload field names and the test needs them)
3. The 009 packet docs (scope context):
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/spec.md`
4. The loader that rejects unknown fields:
   - `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` OR `.opencode/skill/system-spec-kit/scripts/dist/loaders/data-loader.js` (compiled) — find by searching for `"Unknown field in input data"` in the scripts tree
5. The extractor/workflow that maps payload to render context:
   - `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
   - `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`
   - `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
6. The template body (for OVERVIEW rendering + note prose):
   - `.opencode/skill/system-spec-kit/templates/context_template.md`

## LANE F FIX — Status/Completion payload override

**Investigate first**: grep for `"Unknown field in input data"` to find the known-field allowlist in the loader. The list currently accepts fields like `sessionSummary`, `triggerPhrases`, `keyDecisions`, `filesModified`, `recentContext`, `nextSteps`, `specFolder`, `contextType`. Determine which field names codex's initial Lane F fix intended to consume for status and completion override.

**Fix**:
1. Add `phase`, `status` (or `sessionStatus`), and `completionPercent` (or `completionPercentage`) to the loader's known-fields allowlist so they don't trigger "Unknown field" warnings
2. In `collect-session-data.ts` (or wherever Phase/Status/Completion are derived), when the payload contains explicit values for these fields, USE THEM instead of the stale defaults
3. Keep the existing contextType → Phase fallback for payloads that don't specify an explicit `phase`
4. Keep the git-state fallback for Status/Completion when the payload doesn't specify them

**Test**: Extend `scripts/tests/phase-status-from-payload.vitest.ts` (created in the initial 009 run) to:
- Invoke the collector with `phase: "IMPLEMENTATION"`, `status: "COMPLETED"`, `completionPercent: 100` — assert the output reflects these values exactly
- Invoke with no fields — assert contextType-derived Phase + git-derived Status/Completion
- Assert the loader does NOT log an "Unknown field" warning for any of the three fields

## LANE G FIX — causal_links.derived_from auto-populate

**Investigate first**: find the code in `scripts/core/memory-metadata.ts` that codex's initial 009 run modified for Lane G. Check if:
- (a) The sibling-memory glob runs at all (add a debug log briefly if needed)
- (b) The glob produces results (the 014/memory/ folder has 3+ existing saves)
- (c) The extracted session_id from each sibling save is correct
- (d) The populate step writes to the correct field name (`causal_links.derived_from` vs `causalLinks.derivedFrom` vs `causal_links_derived_from`)

**Fix**: whatever is broken. Most likely the issue is path resolution — the glob may use a relative path that resolves wrong when called from the compiled dist. Use an absolute path derived from the target spec folder's canonical location.

**Test**: Extend `scripts/tests/causal-links-auto-populate.vitest.ts` to:
- Create a fixture spec folder with 2 existing memory save files (different session_ids in frontmatter)
- Invoke the memory-metadata assembly
- Assert the output `causal_links.derived_from` contains at least one entry with a session_id matching one of the fixture files
- Bonus: if the fixture has a prior save with `context_type: "planning"` and the current save is `context_type: "implementation"`, assert `causal_links.supersedes` also contains the planning save's session_id

## OVERVIEW TRUNCATION FIX (10th bug, new lane — call it Lane J)

**Bug**: Rendered OVERVIEW text is truncated mid-token with a non-boundary ellipsis (`"...without replacing…"`). The post-save review flags this as HIGH with fix suggestion `"Re-render the OVERVIEW from the full session summary using the boundary-safe truncation helper"`.

**Investigate**: 
- Grep for `truncat` or `ellipsis` or `…` in `scripts/core/` and `scripts/extractors/` to find the existing boundary-safe truncation helper the post-save review is referring to
- Find where the OVERVIEW text is rendered (likely in `scripts/core/workflow.ts` or the template binding for `{{OVERVIEW}}`)
- Determine if truncation is happening at:
  - (a) The extractor layer (truncating the session summary before it reaches the template)
  - (b) The template binding (applying a character limit with raw substring)
  - (c) The render layer (mid-render truncation with broken ellipsis)

**Fix**: Use the existing boundary-safe truncation helper when rendering the OVERVIEW. If no helper exists, create a minimal one: truncate at the last whitespace before the limit, append a proper UTF-8 ellipsis character `…` OR the three-char `...` (be consistent with the rest of the codebase).

**Test**: `scripts/tests/overview-boundary-safe-truncation.vitest.ts` — given a long session summary that exceeds the limit, assert the rendered OVERVIEW:
- Does not end in a mid-word cut (the last word before the ellipsis must be complete)
- Does not contain the broken ellipsis pattern `.…` or `....…`
- Uses the boundary-safe helper (if applicable)

## COSMETIC NOTE PROSE FIX

**Bug**: The header note at line 23 of the rendered memory file says `(quality score: 0/100)` using the old generic scorer label. Since Lane I renamed the frontmatter field to `render_quality_score`, the note prose should use a consistent label.

**Fix**:
- Find the note template in `templates/context_template.md` or wherever the `"limited actionable content"` string is emitted
- Replace `quality score: {X}/100` with either `render_quality_score: {X}/100` or `input_completeness_score: {X}/100` depending on which scorer the note is actually tracking
- If it's the input-completeness scorer (which tracks session data richness), use `input_completeness_score` — that matches the 0/100 value we saw for an input-light session
- Update the test fixture if any existing test asserts the old label

## STEP — Rebuild and re-verify

After all 4 fixes:

```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# Re-run the wild save (the payload is already clean 014-only)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  /tmp/save-context-data.json \
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph-upgrades
```

If the payload doesn't exercise Lane F (it's currently missing `phase`/`status`/`completionPercent` because those were flagged as unknown last time), after your Lane F fix ADD those fields to `/tmp/save-context-data.json` so the test payload actually triggers the new code path:
```json
{
  ...existing fields...,
  "phase": "IMPLEMENTATION",
  "status": "COMPLETED",
  "completionPercent": 100
}
```

Read the newly-created memory file and audit:

| Lane | Check |
|--|--|
| A Title | Still clean (should remain PASS) |
| B Canonical Sources | Still populated with 5+ pointers (should remain PASS) |
| C File count | Still 5/5/5 (should remain PASS) |
| D Trigger phrases | Still 4+ authored, no bigram noise (should remain PASS) |
| E Evidence bullets | Still deduped with anchors (should remain PASS) |
| **F Phase/Status** | **Now shows `Session Status: COMPLETED` + `Completion %: 100`** — this is the fix target |
| **G causal_links** | **`causal_links.derived_from` now contains session_ids from at least one prior 014 save** — this is the fix target |
| H parent_spec | Still parent-not-self (should remain PASS) |
| I Scorer rename | Still `render_quality_score` in frontmatter (should remain PASS) |
| **J (new) OVERVIEW** | **No truncation mid-token; ends at a complete word or full sentence** |
| **Note prose** | **`render_quality_score` or `input_completeness_score` label, NOT generic `quality score`** |

## CONSTRAINTS

- **Do NOT re-run the 009 scaffold** — 009's packet docs already exist, only the code fixes need updating
- **Do NOT modify mcp_server** — this is purely scripts/ render-layer work
- **Do NOT skip the rebuild** — `cd scripts && npm run build` MUST run after every code fix before the wild re-save
- **Do NOT touch historical 014 memory files** — the 08:46, 10:30, 12:22, 12:40 saves stay as regression evidence
- **Do NOT commit** — leave everything uncommitted for operator review
- **Do NOT introduce new compile errors** — run `npm run build` mid-way if making substantial changes, to catch issues early
- **HONESTY**: If a fix reveals the bug is elsewhere than described, report the real location and fix it there. If OVERVIEW truncation turns out to be impossible to fix without broader refactoring, report that honestly as a blocker rather than shipping a half-measure.

## OUTPUT FORMAT (print at the very end)

```
=== CLOSE_009_GAPS_RESULT ===
LANE_F_PAYLOAD_STATUS_OVERRIDE:
  investigation: <what you found about the loader allowlist and derivation path>
  fix_applied: <description>
  payload_updated: yes | no (and why)
  verification: PASS | FAIL

LANE_G_CAUSAL_LINKS_AUTOPOPULATE:
  investigation: <what you found about why the initial fix didn't work>
  fix_applied: <description>
  verification: PASS | FAIL (derived_from contains N entries pointing at <session_ids>)

LANE_J_OVERVIEW_TRUNCATION:
  investigation: <found the boundary-safe helper? where was truncation happening?>
  fix_applied: <description>
  verification: PASS | FAIL (OVERVIEW ends cleanly)

COSMETIC_NOTE_LABEL:
  fix_applied: <description>
  verification: PASS | FAIL (note now says <new label>)

BUILD:
  npm run build (scripts): PASS | FAIL
  new compile errors: <list or "none">
  dist rebuild timestamp: <time>

WILD_RE_SAVE:
  command: node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json .../005-code-graph-upgrades
  exit code: <n>
  new memory file: <path>

FULL_9_LANE_RE_AUDIT:
  LANE_A_TITLE:               PASS | FAIL
  LANE_B_CANONICAL_SOURCES:   PASS | FAIL
  LANE_C_FILE_CAPTURE:        PASS | FAIL
  LANE_D_TRIGGER_PHRASES:     PASS | FAIL
  LANE_E_EVIDENCE:            PASS | FAIL
  LANE_F_PHASE_STATUS:        PASS | FAIL
  LANE_G_CAUSAL_LINKS:        PASS | FAIL
  LANE_H_PARENT_SPEC:         PASS | FAIL
  LANE_I_SCORER_NAMES:        PASS | FAIL
  LANE_J_OVERVIEW_CLEAN:      PASS | FAIL
  NOTE_LABEL_CONSISTENT:      PASS | FAIL

TOTALS:
  lanes_passing: <n> / 10 (+ note)
  verdict: ALL_PASS | PARTIAL | REGRESSION

BLOCKERS: <list or "none">

NEXT_STEP_RECOMMENDATION:
  - If ALL_PASS: 009 is ready to commit + push as a clean packet shipment
  - If PARTIAL: name the remaining failing lanes and recommend whether to ship or iterate
  - If REGRESSION: identify which previously-passing lane broke and roll back
=== END_CLOSE_009_GAPS_RESULT ===
```

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/` (pre-approved)
