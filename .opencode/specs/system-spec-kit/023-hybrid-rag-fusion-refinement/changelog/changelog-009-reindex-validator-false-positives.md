## [v0.9.0] - 2026-04-01

This release matters because bulk rebuilds had started rejecting good files and keeping older context labels alive. In `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives`, Phase 009 addresses 25 issues across validation behavior, shared context labeling and database cleanup so valid content can be rebuilt instead of blocked. The forced full rebuild path now drops blocked files from 1,106 to 0, total passing tests rise from 134 to 139, clean distribution rebuilds pass and the sk-code-opencode alignment verifier reports 0 findings. Two lower-priority follow-ups remain deferred: summary counts during rate limiting and per-file skip reasons.

> Spec folder: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives` (Level 2)

---

## Bug Fixes (11)

These fixes stop good files from being rejected and keep older context labels from slipping back into active use.

### Folder detection no longer fails when metadata is missing

**Problem:** Bulk validation could lose track of which spec folder a file belonged to when the structured metadata block at the top of a markdown file was empty or incomplete. That made a good file look like it belonged somewhere else.

**Fix:** Folder detection now falls back to the file's location on disk. Valid files keep their proper home even when their metadata is incomplete.

### Shallow spec folders are now recognized correctly

**Problem:** Some specs live directly under the main specs directory instead of inside an extra parent folder. Those simpler paths could still be missed by the folder check.

**Fix:** The folder check now recognizes both shallow and nested spec layouts. Good files are judged consistently no matter how the spec folder is nested.

### Batch validation now keeps each file's own location

**Problem:** The bulk path knew a file's contents but did not always carry the file's location all the way through the validation flow. Later checks had to guess instead of judge with full context.

**Fix:** Each file now keeps its own location during the full validation pass. Rules that depend on where a file lives now get the same context during bulk work that they already had during one-file saves.

### Memory notes no longer fail the topic check

**Problem:** Memory notes often describe an outcome or decision in plain language instead of repeating the spec name. The topic check treated that normal writing style as a sign that the note did not belong.

**Fix:** Memory notes are now skipped by that topic check during bulk rebuilds. They still get structural review without being blocked by a rule that does not fit their job.

### Spec-defining documents no longer fail their own topic check

**Problem:** Documents that define a spec, such as the main plan or summary pages, should not have to prove they belong to the spec they are defining. The old behavior still asked them to do that.

**Fix:** Spec-defining documents are now skipped by that topic check too. The rule stays focused on drift where drift is a real signal.

### Forced full rebuilds no longer turn warnings into blockers

**Problem:** A forced full rebuild is meant to rebuild aggressively, but advisory quality warnings could still stop the run. That made recovery work more fragile than it needed to be.

**Fix:** Forced rebuilds now treat those quality issues as warnings instead of hard stops. Operators still see the warning, but the rebuild can finish.

### The approved label list now includes planning

**Problem:** One of the system's own approved label lists still left out planning. That created a quiet mismatch between what the system wanted to save and what it officially allowed.

**Fix:** Planning is now part of the approved set everywhere that list matters. The save path and the official label set now match.

### Default document mappings no longer restore older labels

**Problem:** Some document defaults still pointed at older labels like decision. A later repair pass could fix a file once and then quietly push it back to the older wording on the next run.

**Fix:** Default mappings now point at the current approved labels. New writes and repeated repair runs now land on the same vocabulary.

### Metadata cleanup now preserves the current vocabulary

**Problem:** Metadata cleanup could still translate a repaired value back toward older wording. That made the system feel fixed until another rebuild reversed the result.

**Fix:** Cleanup now keeps approved labels as they are and only modernizes older aliases in the safe direction. Once a file is repaired, later runs keep it repaired.

### The text reader now modernizes the older decision label

**Problem:** The text reader, which is the component that turns file text into structured data, still interpreted the older decision label with the retired meaning. That kept filesystem content and stored data from agreeing.

**Fix:** Older decision values are now read as planning. Legacy content still works, but active behavior follows the current model.

### The text reader now modernizes the older discovery label

**Problem:** The same drift remained for the older discovery label. Leaving that split in place would keep retrieval and state logic from using one shared meaning.

**Fix:** Older discovery values are now read as general. Older content remains readable while live behavior follows one approved vocabulary.

---

## Architecture (10)

These changes make the repaired behavior stick across storage, upgrade paths and runtime consumers.

### Planning now has full reader and database support

**Problem:** A label change is not complete if the reader accepts it but the database boundary still rejects it, or if the database accepts it but the reader still treats it as second-class. That leaves the system half-migrated.

**Fix:** Planning is now supported from text reading through stored data validation. The full path now agrees on what the label means.

### Existing files now get a retroactive repair pass

**Problem:** Fixing the rules for future writes would not help files that had already been written with older labels. Those older files could keep reintroducing stale state during later rebuilds.

**Fix:** Existing files now receive a retroactive repair pass during rebuild work. Stored markdown catches up with the repaired rules instead of waiting for slow organic churn.

### Existing database rows now use the current labels

**Problem:** Files on disk were only half the problem because older rows inside the database could still return outdated values. Search and storage could stay out of step even after file repairs.

**Fix:** Older stored rows are now rewritten to the current labels during the upgrade path. Database results and file content now move together.

### Session extraction and intent classification now share one vocabulary

**Problem:** Session extraction and intent classification could each carry slightly different assumptions about older and newer labels. That makes the same file look different depending on who is reading it.

**Fix:** Both runtime surfaces now share the same approved vocabulary. Session context and intent decisions now interpret repaired files the same way.

### Save quality gate, spaced-repetition scheduler and memory state baseline now share one vocabulary

**Problem:** Save checks, scheduling logic and baseline state tracking can drift if each surface keeps its own label rules. That kind of split slowly reintroduces inconsistent behavior.

**Fix:** Those runtime surfaces now read from the same shared contract. Saving, scheduling and state tracking now agree on the meaning of repaired labels.

### One shared source of truth now replaces copied label rules

**Problem:** Copied label rules tend to drift because one place gets updated and another place gets forgotten. That turns a simple vocabulary change into repeated cleanup work.

**Fix:** The project now keeps one shared source of truth for approved labels and older aliases. Future updates have one place to change instead of many places to forget.

### Duplicate cleanup now removes old buildup and keeps future rebuilds cleaner

**Problem:** Earlier forced rebuilds could pile up repeated records for unchanged files, and force mode still had a path that could recreate that buildup later. Left alone, the index would keep collecting extra copies.

**Fix:** Old repeated rows were removed and future forced rebuilds keep duplicate checks active for unchanged content. The index now moves closer to one file, one stored record.

### Existing installs now get a safe database upgrade that also locks storage to approved values

**Problem:** Fresh installs can pick up a fixed rule set right away, but existing installs need a database upgrade step if they are going to match. Without that step, old installations stay exposed to the retired vocabulary.

**Fix:** Existing installs now upgrade in place and finish on a storage rule that accepts only the approved labels. The fix travels with upgrades instead of helping only new databases.

### Rule results and logs now explain themselves in plain language

**Problem:** Short internal rule codes are useful for maintainers, but they are not very helpful in operator output on their own. Readers should not need a separate codebook to understand what failed.

**Fix:** Rule output now includes descriptive names and logs now report the real label being processed. Operators get clearer feedback when they need to inspect a rebuild.

### Two follow-ups remain deferred and are not presented as resolved

**Problem:** The rebuild path is fixed, but two operator-facing rough edges still remain. Summary counts can disappear during rate limiting, and skipped files still do not report their individual reasons.

**Fix:** This release does not present those items as finished. They remain deferred follow-ups while the main false-positive and vocabulary work is complete.

---

## Testing (4)

The verification work focused on proving the real failure path was fixed and that the rebuilt artifacts still matched project standards.

### The regression suite now covers the exact false-positive path

**Problem:** The original bug lived in the bulk path that judged files with their disk location in play. Without direct coverage for that route, a future refactor could reopen the same failure quietly.

**Fix:** The regression suite now includes five new checks for the exact false-positive path. The release is protected by tests that exercise the real failure mode instead of a nearby imitation.

### Text reader expectations now protect the current contract

**Problem:** Tests are only useful if they defend the behavior the project actually wants. Older text reader expectations were still protecting the retired label set.

**Fix:** Text reader expectations now protect the current approved label contract. The safety net now matches the repaired system instead of an older version of it.

### Clean distribution rebuilds now verify the shipped artifacts

**Problem:** A code fix is not fully trustworthy if the packaged output still diverges from the repaired source. Rebuild verification needs to prove the shipped artifacts still compile cleanly.

**Fix:** Clean distribution rebuilds now pass across the affected workspaces. The release was verified as something that can be shipped, not just something that passes local source checks.

### The sk-code-opencode alignment verifier now confirms the shared code matches project standards

**Problem:** Shared code can still drift away from project standards even when tests pass. A standards check helps catch that kind of mismatch before release.

**Fix:** The sk-code-opencode alignment verifier passed with zero findings on the shared code that changed in this phase. That gives an extra confirmation that the release matches the project's coding contract.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Tests passing | 134 | 139 |
| Test files | 4 | 4 |
| TypeScript errors | 0 | 0 |
| Files blocked during forced full rebuild | 1,106 | 0 |

Five new regression tests were added for the exact false-positive path. Clean distribution rebuilds passed and the sk-code-opencode alignment verifier reported 0 findings.

---

## Schema Changes

| Change | Details |
| ------ | ------- |
| Schema version | 24 to 25 |
| Allowed stored labels | `memory_index.context_type` now accepts only `research`, `implementation`, `planning` and `general` |
| Existing rows rewritten | 2,006 `decision -> planning` and 3 `discovery -> general` updates |
| Duplicate cleanup | Removed 13,211 repeated rows from earlier forced rebuild runs |

Existing installs remain compatible because older labels are rewritten before the stricter table copy runs.

---

<details>
<summary>Technical Details: Files Changed (12 total)</summary>

### Source (10 files)

| File | Changes |
| ---- | ------- |
| `shared/context-types.ts` | Added the shared source of truth for approved context labels, older aliases and resolver logic. |
| `shared/index.ts` | Re-exported the shared context label utilities for other workspaces. |
| `scripts/lib/validate-memory-quality.ts` | Added folder fallback from file location, shallow path handling, topic-check skips for memory and spec-defining files and descriptive rule names. |
| `scripts/lib/frontmatter-migration.ts` | Updated frontmatter (structured metadata block at the top of a markdown file) migration defaults and alias direction so repaired values stay on the approved labels. |
| `mcp_server/lib/parsing/memory-parser.ts` | Updated the parser (the component that turns file text into structured data) to normalize older decision and discovery labels into the approved set and to treat planning as a first-class value. |
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Switched the spaced-repetition scheduler to the shared label aliases so retention behavior follows the approved vocabulary. |
| `mcp_server/lib/validation/save-quality-gate.ts` | Replaced hardcoded label assumptions with shared approved-label resolution. |
| `mcp_server/lib/search/vector-index-schema.ts` | Added database upgrade step 25, rewrote older stored values and rebuilt the storage rule around the approved labels only. |
| `mcp_server/lib/storage/schema-downgrade.ts` | Matched downgrade schema generation to the stricter approved-label rule. |
| `mcp_server/handlers/save/dedup.ts` | Removed the force reindex (forced full rebuild) bypass from dedup (duplicate cleanup) so unchanged content no longer accumulates repeated rows. |

### Tests (2 files)

| File | Changes |
| ---- | ------- |
| `scripts/tests/validate-memory-quality.vitest.ts` | Added five regression checks for folder fallback, shallow spec paths, topic-check skips and descriptive rule names. |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Updated the parser expectations so the approved label set matches the repaired storage and reader contract. |

### Documentation (0 files)

The implementation set for this phase was code and test focused. No standalone documentation files were part of the shipped implementation diff.

</details>

---

## Upgrade

No manual migration is required.

Existing databases move to schema version 25 during the normal upgrade path, and older decision and discovery labels are rewritten as part of that step. If an environment still carries repeated rows from earlier forced rebuild runs, rerunning the rebuild on this patched version will settle the index under the new duplicate checks.
