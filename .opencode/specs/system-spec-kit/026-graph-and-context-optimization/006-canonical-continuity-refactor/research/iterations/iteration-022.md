---
title: "Iteration 022 — Spec-doc-structure validator detail"
iteration: 22
band: A
timestamp: 2026-04-11T11:54:45Z
worker: codex-gpt-5.4
scope: q7_validator_detail
status: complete
focus: "Deepen the six spec-doc-structure validator rules into an implementable contract with concrete order, error codes, edge cases, validate.sh integration, and unit-test sketches."
maps_to_questions: [Q7]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-022.md"]

---

# Iteration 022 — Spec-doc-structure validator detail
## Goal
Make Q7 implementation-ready. Iteration 009 defined the retargeted gates. Iteration 017 defined the failure surface. This pass defines exact rule order, failure codes, severity, edge-case handling, `validate.sh` integration, and test shape.

## Placement and orchestration
- New implementation home: `mcp_server/lib/validation/spec-doc-structure.ts`.
- `validate.sh` stays the public orchestrator, severity aggregator, and JSON reporter.
- Shell wrappers should delegate YAML parsing, merge simulation, prototype similarity, and hashing to Node/TS.
- Recommended order: `ANCHORS_VALID` -> `FRONTMATTER_MEMORY_BLOCK` -> `MERGE_LEGALITY` -> `SPEC_DOC_SUFFICIENCY` -> `CROSS_ANCHOR_CONTAMINATION` -> `POST_SAVE_FINGERPRINT`.
- Structural hard-fails short-circuit later write-time checks.
- Public rule names stay human-facing; machine codes use `SPECDOC_<RULE>_<NNN>`.

## Rule 1 — `ANCHORS_VALID`
### Algorithm
1. Collect `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, and optional `handover.md` / `research/research.md`.
2. Parse linearly and record open anchor, close anchor, ID, line, and depth.
3. Validate syntax first: open must match `<!-- ANCHOR:[a-z0-9-]+ -->`; close must match `<!-- /ANCHOR:[a-z0-9-]+ -->`.
4. Validate pairing and nesting: no orphan close, no unclosed open, no same-ID nesting.
5. Compare against required template anchors and required order using the existing template structure helper.
6. Extend required-anchor coverage for phase 018: `implementation-summary.md` must expose `what-built`, `how-delivered`, `decisions`, `verification`, `limitations`, `metadata`.
7. Return file-scoped diagnostics sorted by line number.
### Codes / severity
- `SPECDOC_ANCHORS_001` malformed syntax — `error`
- `SPECDOC_ANCHORS_002` orphan close or unclosed open — `error`
- `SPECDOC_ANCHORS_003` same-ID nested anchor — `error`
- `SPECDOC_ANCHORS_004` missing required anchor — `error`
- `SPECDOC_ANCHORS_005` required anchor out of order — `error`
- `SPECDOC_ANCHORS_006` extra custom anchor — `warning`
### Edge cases
- Empty anchors pass here; content emptiness belongs to sufficiency.
- Missing files stay under `FILE_EXISTS`, not this rule.
- Legacy uppercase or underscore IDs fail unless a future compat mode is explicitly added.
- Different-ID nesting may remain legal; same-ID nesting is never legal because merge targeting becomes ambiguous.
### `validate.sh`
- Replace current shell-only `check-anchors.sh` internals, keep rule name `ANCHORS_VALID`.
- Same exit behavior as today: errors fail; warnings only fail under `--strict`.
### Test sketches
- compliant fixture passes; orphan close fails; missing `what-built` fails; same-ID nested anchor fails; extra custom anchor warns.

## Rule 2 — `FRONTMATTER_MEMORY_BLOCK`
### Algorithm
1. Parse YAML frontmatter for any doc with frontmatter and any active save target.
2. If `_memory` is absent: ordinary legacy validation warns only; active save targets synthesize a default block in memory and validate that shape.
3. Validate required block keys: `causal_links`, `fsrs_state`, `fingerprint`.
4. Validate optional keys: `continuity`, `provenance`, `preflight`, `postflight`, `anchor_tiers`, `content_hash`.
5. Validate sub-shapes: `causal_links.caused_by|supersedes|related_to` arrays; `fsrs_state.stability|difficulty` numeric; `last_review` ISO; `review_count` integer; `fingerprint` matches `sha256:<hex>`; if `continuity` exists then require `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, `next_safe_action`.
6. Enforce the phase-018 frontmatter budget by warning when serialized `_memory` exceeds the target size budget (<2KB).
### Codes / severity
- `SPECDOC_FRONTMATTER_001` invalid YAML — `error`
- `SPECDOC_FRONTMATTER_002` `_memory` missing on save target — `warning`
- `SPECDOC_FRONTMATTER_003` missing required sub-key — `error`
- `SPECDOC_FRONTMATTER_004` invalid field type — `error`
- `SPECDOC_FRONTMATTER_005` invalid fingerprint format — `error`
- `SPECDOC_FRONTMATTER_006` incomplete `continuity` block — `warning`
- `SPECDOC_FRONTMATTER_007` size budget exceeded — `warning`
### Edge cases
- Missing `_memory` on pre-phase-018 docs is migration-safe and should not block reads.
- Malformed machine-owned state is worse than missing state and should fail.
- Unknown top-level `_memory` keys warn unless explicitly namespaced under `_memory.custom.*`.
- Fingerprint freshness is not checked here; only structure and format are. Equality belongs to Rule 6.
### `validate.sh`
- New first-class rule in help and JSON output.
- Must work with `SPECKIT_RULES=FRONTMATTER_MEMORY_BLOCK`.
- `--strict` may escalate warnings for active save targets, but should not turn untouched legacy docs into bulk-audit blockers.
### Test sketches
- valid `_memory` block passes; legacy doc with no `_memory` warns; malformed YAML fails; `review_count: "one"` fails; oversized continuity array warns.

## Rule 3 — `MERGE_LEGALITY`
### Algorithm
1. Inputs: target doc, target anchor or field, merge mode, routed chunk, current text.
2. Re-run Rules 1 and 2 on the target snapshot; abort immediately on hard-fail.
3. Resolve the destination and confirm exactly one legal target region.
4. Classify destination shape: prose anchor, markdown table, checklist block, ADR region, or frontmatter field.
5. Validate merge-mode compatibility: `append-as-paragraph` => prose; `append-table-row` => table; `update-in-place` => existing task/row; `insert-new-adr` => decision target; `set-field` => `_memory.*`.
6. Apply the merge to an in-memory copy.
7. Re-parse the merged result and ensure anchors still close, tables still align, checklist syntax still holds, and ADR numbering did not collide.
### Codes / severity
- `SPECDOC_MERGE_001` target doc missing — `error`
- `SPECDOC_MERGE_002` target anchor missing or duplicated — `error`
- `SPECDOC_MERGE_003` mode incompatible with target shape — `error`
- `SPECDOC_MERGE_004` merged render breaks structure — `error`
- `SPECDOC_MERGE_005` conflict markers or unresolved concurrent-edit markers present — `error`
### Edge cases
- Empty-but-present anchors may be initialized if the selected mode supports initialization.
- Header-only tables may accept a first row if width matches the header.
- `update-in-place` must fail on a missing task ID, not silently append.
- Parent-packet ADR insertion must still avoid ADR-number collisions.
### `validate.sh`
- Primarily a save-pipeline rule, not default folder validation.
- A debug hook is still useful: `validate.sh --merge-plan <json>`.
### Test sketches
- paragraph append to `what-built` passes; table row into prose fails; missing task ID update fails; broken table width fails; conflict marker presence fails.

## Rule 4 — `SPEC_DOC_SUFFICIENCY`
### Algorithm
1. Evaluate the final target anchor body, not the whole file.
2. Normalize by removing anchor comments and formatting clutter.
3. Apply anchor rubric:
   - `what-built` => file/path/code citation
   - `how-delivered` => rollout or delivery mechanism
   - `decisions` => decision plus rationale
   - `verification` => at least one concrete verification step
   - `adr-*` => decision, rationale, alternatives, consequences
   - `handover` => at least one of `recent_action`, `next_safe_action`, `blockers`
   - `research` => at least one cited source
4. Count evidence units plus semantic body length.
5. Classify final state: empty or near-empty => hard fail; structurally present but weak evidence => warning; sufficiently evidenced => pass.
### Codes / severity
- `SPECDOC_SUFFICIENCY_001` target anchor empty — `error`
- `SPECDOC_SUFFICIENCY_002` primary evidence missing — `warning`
- `SPECDOC_SUFFICIENCY_003` ADR fields incomplete — `warning`
- `SPECDOC_SUFFICIENCY_004` citation-required anchor missing citation — `warning`
### Edge cases
- Short task-state mutations can still pass if they update concrete task IDs.
- Local iteration-file citations count as valid research citations in this packet.
- "Validated successfully" without command or artifact should warn.
- A blocker-only handover is still sufficient if it is actionable.
### `validate.sh`
- Safe for ordinary folder validation and save-time merged-candidate validation.
- Save pipeline must evaluate the candidate anchor, not just the incoming chunk.
### Test sketches
- `what-built` with file refs passes; empty research anchor fails; weak verification note warns; ADR missing alternatives warns; short actionable handover passes.

## Rule 5 — `CROSS_ANCHOR_CONTAMINATION`
### Algorithm
1. Run after routing picks a target and after Rule 3 says the write is structurally legal.
2. Build a candidate representation from merged chunk text plus routed category.
3. Run two checks: hard-negative rules from iteration 002/021 cues, then embedding similarity against the Tier 2 prototype library.
4. Compare routed category vs winning alternate category.
5. Flag contamination when route confidence < 0.7 and an alternate wins by margin >= 0.10, or when hard-negative cues strongly indicate `task_update`, `metadata_only`, or `drop`.
6. Emit warning with suggested alternate target; only hard-fail when both rule-based and embedding checks agree the chunk is truly `drop`.
### Codes / severity
- `SPECDOC_CONTAM_001` alternate category wins by margin — `warning`
- `SPECDOC_CONTAM_002` hard-negative cue mismatch — `warning`
- `SPECDOC_CONTAM_003` chunk resolves to `drop` — `error`
### Edge cases
- Mixed progress/delivery chunks should not warn on narrow margins.
- `--route-as` should keep the warning but mark it as accepted-risk.
- Pure structured `_memory` writes may bypass embedding checks.
- Research findings mentioning implementation files are not contamination if source/citation cues still dominate.
### `validate.sh`
- Mostly save-pipeline facing, but useful as a dry-run/debug surface.
- Warning output should also land in `scratch/routing-log.jsonl`.
### Test sketches
- task checklist routed to `what-built` warns; delivery paragraph routed to `decisions` warns; transcript chunk routed anywhere fails as `drop`; mixed progress/delivery chunk passes; user override still warns.

## Rule 6 — `POST_SAVE_FINGERPRINT`
### Algorithm
1. After write, re-read exact file bytes.
2. Recompute canonical fingerprint over normalized frontmatter + body bytes using the same hash function the planner used.
3. Compare against the expected merged-candidate fingerprint.
4. If mismatch: distinguish concurrent edit vs normalization bug where possible, restore pre-merge snapshot, and keep session-dedup / continuity fingerprint unchanged.
5. If match, persist the new fingerprint into `_memory.fingerprint` and continuity/session-dedup fields.
### Codes / severity
- `SPECDOC_FINGERPRINT_001` expected fingerprint missing — `error`
- `SPECDOC_FINGERPRINT_002` post-write mismatch — `error`
- `SPECDOC_FINGERPRINT_003` rollback failed — `error`
- `SPECDOC_FINGERPRINT_004` concurrent edit detected during verification — `error`
### Edge cases
- Canonicalize line endings before hashing to avoid OS noise.
- YAML key reordering must happen before the expected fingerprint is planned.
- No-op merges should reuse the pre-write fingerprint and skip disk rewrite.
- Missing file after write is mismatch plus rollback failure, not a soft warning.
### `validate.sh`
- Not part of ordinary folder validation.
- Runs inside `/memory:save` and future merge commands.
- A debug entrypoint is still useful: `validate.sh --post-save --expected-fingerprint <hash> --file <path>`.
### Test sketches
- stable write passes; injected concurrent edit fails; YAML reordering mismatch fails; no-op merge skips rewrite and passes; rollback failure surfaces `_003`.

## Findings
- The six rules split cleanly into static validity (`ANCHORS_VALID`, `FRONTMATTER_MEMORY_BLOCK`, `SPEC_DOC_SUFFICIENCY`) and write-time safety (`MERGE_LEGALITY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`).
- The key migration boundary is missing vs malformed: missing continuity metadata may warn; malformed machine-owned state should fail.
- Phase 019 should ship this as a Node-backed validator bridge behind the existing shell orchestrator, not as more Bash parsing.
