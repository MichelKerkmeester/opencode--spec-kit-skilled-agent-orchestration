# Final Audit Synthesis

This synthesis covers all 42 markdown files in `scratch/`. `w7-a31-011-security.md` and the wave-8 audits (`w8-a36` through `w8-a40`) did not add actionable defects; the findings below deduplicate the remaining reports and keep the highest observed severity for each issue.

## CRITICAL

### SECURITY

### FINDING-01: Atomic writes can escape `contextDir` before containment is verified
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:15-25,95-116,143-163`
- **Severity:** CRITICAL
- **Category:** SECURITY
- **Refs:** `w1-a01-file-writer.md`, `w4-a16-path-traversal.md`, `w5-a25-write-pipeline.md`
- **Current Behavior:** `writeFilesAtomically()` performs lexical path checks up front, but backup creation, temp-file writes, and the final `rename()` still operate on live paths. If a parent under `contextDir` is a symlink, bytes can be written outside the intended tree before `realpath` validation runs.
- **Expected Behavior:** Canonical containment must be established before any write, backup, rollback, or cleanup step touches the filesystem.
- **Root Cause:** Path safety is checked with string resolution before I/O, then rechecked after `rename()`, leaving a TOCTOU window and trusting symlinked parents.
- **Suggested Fix:** Resolve and pin the canonical parent directory first, reject symlinked parents, and build temp/backup/final paths from the canonical location rather than validating only after commit.

### FINDING-02: `toRelativePath()` allows post-normalization traversal outside `PROJECT_ROOT`
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts:10-25`; `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:154-164`
- **Severity:** CRITICAL
- **Category:** SECURITY
- **Refs:** `w1-a04-file-helpers.md`, `w2-a07-file-extractor.md`, `w4-a16-path-traversal.md`, `w7-a35-011-files.md`
- **Current Behavior:** A path such as `/repo/../../etc/passwd` is normalized to `/etc/passwd`; once the `../` segments are collapsed, the helper no longer rejects it and can return an out-of-root absolute path.
- **Expected Behavior:** Any path that resolves outside `CONFIG.PROJECT_ROOT` must be rejected, regardless of how normalization transforms the input.
- **Root Cause:** Validation is string-based and happens after normalization, with no final canonical containment check against the resolved project root.
- **Suggested Fix:** Resolve both root and candidate to canonical paths, require the candidate to remain inside the root on a segment boundary, and reject absolute/out-of-root results before shortening them.

## HIGH

### SECURITY

### FINDING-03: Spec-folder path guards ignore symlinks and use conflicting containment rules
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:635-748`
- **Severity:** HIGH
- **Category:** SECURITY
- **Refs:** `w3-a15-collect-session-b.md`, `w4-a16-path-traversal.md`
- **Current Behavior:** Spec-folder discovery and validation combine single-root assumptions, basename remapping, and prefix checks that do not resolve symlinks. A path can be accepted as “inside specs” while actually resolving elsewhere.
- **Expected Behavior:** Spec-folder selection must resolve the same canonical path through discovery, validation, and save-time enforcement.
- **Root Cause:** The code mixes multiple “canonical” folder concepts and relies on lexical containment instead of canonical path checks.
- **Suggested Fix:** Canonicalize all candidate spec folders once, forbid basename-based remapping for unknown paths, and validate membership with `realpath` + segment-boundary checks across the full flow.

### FINDING-04: Cross-spec relevance filtering still leaks foreign content into normalized data
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:435-456`
- **Severity:** HIGH
- **Category:** SECURITY
- **Refs:** `w2-a10-input-normalizer-b.md`
- **Current Behavior:** Relevance filtering can keep prompts, observations, or recent-context entries from other specs even when a specific spec folder is in scope.
- **Expected Behavior:** When a spec-folder filter is active, unrelated spec content should be excluded consistently across all collections.
- **Root Cause:** Filtering is lossy and inconsistent across prompts, observations, and recent context, so hybrid payloads slip through.
- **Suggested Fix:** Apply one canonical spec-scope predicate to every normalized collection and fail closed when the scope cannot be determined.

### BUG

### FINDING-05: Atomic-write rollback hides failure to restore the current file
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:148-188`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w1-a01-file-writer.md`, `w4-a19-error-handling.md`
- **Current Behavior:** If rollback of the file currently being written fails, that error is swallowed and callers see only the original write failure.
- **Expected Behavior:** Rollback failures must be reported because they mean the destination file may now be corrupted or in an unknown state.
- **Root Cause:** The current-file restore path uses empty catches while only earlier-file rollback failures are accumulated.
- **Suggested Fix:** Capture restore errors for the current file in the same rollback error collection and surface them together with the original failure.

### FINDING-06: Atomic restore is non-atomic and unsafe under concurrent writers
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:123-172`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w1-a01-file-writer.md`, `w4-a20-race-conditions.md`, `w5-a25-write-pipeline.md`
- **Current Behavior:** Backup/restore uses check-then-act logic and `copyFile()`-based recovery. If another writer updates the file between backup and rollback, the older backup can overwrite newer data.
- **Expected Behavior:** Concurrent writes should either serialize or fail, and rollback should use an atomic restore path when the final rename already happened.
- **Root Cause:** The implementation has no final-name reservation, no version/inode verification, and no atomic compare-and-swap style restore.
- **Suggested Fix:** Add per-file locking or compare-before-rename checks, and use atomic rename-based restore only when the destination was actually replaced.

### FINDING-07: Memory filename uniqueness is only advisory under concurrent saves
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:146-170`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:969-971,1213-1215`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w1-a05-slug-utils.md`, `w4-a20-race-conditions.md`, `w5-a25-write-pipeline.md`, `w6-a27-010-uniqueness.md`, `w6-a30-010-checklist.md`
- **Current Behavior:** `ensureUniqueMemoryFilename()` chooses an available name from a directory snapshot, but the actual write happens later, so parallel saves can select the same filename and one overwrite the other.
- **Expected Behavior:** Filename uniqueness guarantees must be enforced at creation time, not inferred from a preflight directory scan.
- **Root Cause:** The pipeline separates collision detection from final file creation and never atomically reserves the chosen name.
- **Suggested Fix:** Reserve the final filename with an atomic primitive (`O_EXCL`, hard-link reservation, or retry-on-conflict rename loop) and regenerate candidates until reservation succeeds.

### FINDING-08: Config path discovery is layout-dependent and breaks source/dist consistency
- **File:** `.opencode/skill/system-spec-kit/scripts/core/config.ts:70-71,210,284-285`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w1-a02-config.md`
- **Current Behavior:** Operational paths depend on where the code is executed from, so source-tree and built/dist layouts can resolve different directories for the same installation.
- **Expected Behavior:** Configured operational paths should resolve deterministically regardless of source-vs-dist layout.
- **Root Cause:** Path resolution is derived from local module layout assumptions instead of a stable repository/runtime root.
- **Suggested Fix:** Centralize root detection, validate it once, and derive all config paths from that canonical base.

### FINDING-09: Config parsing breaks valid JSON/JSONC and fails open on malformed files
- **File:** `.opencode/skill/system-spec-kit/scripts/core/config.ts:217-239,241-320`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w1-a02-config.md`
- **Current Behavior:** Hand-rolled brace scanning misparses valid JSON containing `{` or `}` inside strings, trailing-comma JSONC is rejected despite the filename, and malformed configs silently fall back to defaults.
- **Expected Behavior:** Config parsing should either fully support the advertised format or fail loudly with structural validation errors.
- **Root Cause:** The parser is custom, partial, and merges parsed values by unchecked cast rather than validating the complete schema.
- **Suggested Fix:** Replace the brace scanner with a real JSONC parser, validate the full config object before merge, and treat malformed config as a hard error.

### FINDING-10: Contamination filtering is bypassable via whitespace, Unicode, and tool-title variants
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:11-75`; `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:35-37,83-89`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w1-a03-contamination-filter.md`, `w4-a18-regex.md`, `w6-a29-010-slugs.md`
- **Current Behavior:** Simple formatting changes, non-ASCII variants, dotted/hyphenated tool names, and generated `Read/Edit/Write ...` titles can bypass the denylist and reach downstream slugs or summaries.
- **Expected Behavior:** Operational chatter should be removed regardless of harmless formatting or tool-name representation.
- **Root Cause:** Matching happens before normalization, the regex set is ASCII-centric, and `slug-utils` and `input-normalizer` do not share one contamination contract.
- **Suggested Fix:** Normalize whitespace and Unicode before matching, expand patterns for tool titles and relative paths, and centralize contamination detection so all producers use the same rules.

### FINDING-11: Over-broad contamination rules delete legitimate content
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:11-70`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w1-a03-contamination-filter.md`, `w5-a24-filter-pipeline.md`
- **Current Behavior:** Some denylist patterns are broad enough to remove valid narrative content, and cleaned records are sometimes retained in degraded form instead of being excluded.
- **Expected Behavior:** Filtering should remove operational chatter without deleting real user or workflow content.
- **Root Cause:** Phrase rules are too generic, and the workflow keeps partially cleaned artifacts in contexts where exclusion would be safer.
- **Suggested Fix:** Tighten denylist patterns around concrete operational scaffolding, add negative tests for legitimate prose, and drop irredeemably contaminated records instead of retaining damaged fragments.

### FINDING-12: Decision extraction fabricates or discards decisions on null/manual input
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:121-129,250-257`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a06-decision-extractor.md`
- **Current Behavior:** Null input yields synthetic decisions, while manual decisions can short-circuit extraction and discard real observed decisions.
- **Expected Behavior:** Missing data should produce an empty/safe result, and manual decisions should augment or override only the specific decisions they actually represent.
- **Root Cause:** Fallback generation and manual short-circuiting are treated as control flow rather than as data-merging cases.
- **Suggested Fix:** Return no decisions for null input, normalize manual decisions into the same pipeline as extracted decisions, and merge by stable identity instead of replacing the entire set.

### FINDING-13: Decision confidence handling is broken end-to-end
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:40-42,329-335`; `.opencode/skill/system-spec-kit/templates/context_template.md:533`; `.opencode/skill/system-spec-kit/scripts/lib/ascii-boxes.ts:92-105`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a06-decision-extractor.md`, `w7-a34-011-confidence.md`
- **Current Behavior:** Decimal confidences like `0.8` parse as `0`, normalized values are rendered directly as percentages (`0.7%`), and the wider system mixes ratio and percent units under the same field name.
- **Expected Behavior:** Confidence should have one canonical unit across parsing, storage, thresholds, and rendering.
- **Root Cause:** Producer-side normalization changed without updating renderers or establishing a shared contract for ratio vs percent confidence.
- **Suggested Fix:** Define one canonical representation, add decimal-safe parsing plus finite-number guards, and convert explicitly at display boundaries.

### FINDING-14: Missing runtime guards let malformed inputs and transcripts crash the pipeline
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:103-109,261-278`; `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:337-349,454-456,550-557`; `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:90-97,501-507`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a06-decision-extractor.md`, `w4-a17-null-safety.md`
- **Current Behavior:** Container-only validation, unchecked casts, and direct field dereferences let malformed JSON or version-skewed capture data crash normalization and extraction.
- **Expected Behavior:** All external data should be validated structurally before any deep property access.
- **Root Cause:** The code trusts static TypeScript types at runtime boundaries and validates only the outer container shape.
- **Suggested Fix:** Add runtime decoders/guards for each external structure and reject or coerce invalid nested values before downstream transforms run.

### FINDING-15: Partial and hybrid normalized inputs bypass canonicalization
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:238-246,419-426`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a09-input-normalizer-a.md`, `w5-a21-norm-to-session.md`, `w7-a33-011-normalization.md`
- **Current Behavior:** As soon as some normalized-shape fields exist, the normalizer returns a clone without backfilling missing arrays, aliases, or manual fields.
- **Expected Behavior:** Partially normalized inputs should be completed into one canonical safe shape before the rest of the pipeline consumes them.
- **Root Cause:** The early-return path treats partial normalization as complete normalization.
- **Suggested Fix:** Replace the short-circuit with field-by-field completion that backfills every required collection/object and canonical alias.

### FINDING-16: The FILES contract diverges across normalizer, extractor, and workflow
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:49,253-258`; `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:217-319`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:903-910`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w5-a21-norm-to-session.md`, `w5-a23-file-pipeline.md`, `w7-a35-011-files.md`
- **Current Behavior:** Legacy `filesModified` objects can become invalid `FILE_PATH` objects, `importanceTier` is ignored downstream, and structured ACTION data can be overwritten later in the pipeline.
- **Expected Behavior:** Producer and consumer should share one typed file-change contract from normalization through final rendering.
- **Root Cause:** Each stage owns part of the file schema independently, so fields are reinterpreted, dropped, or overwritten as data moves forward.
- **Suggested Fix:** Define one canonical `FileChange` schema, normalize everything into it once, and make later stages enrich only missing fields rather than rewriting authoritative ones.

### FINDING-17: Session-scoped capture can mispair prompts and messages when timestamps are weak or missing
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:193-195,206-210,522-535`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a08-opencode-capture.md`
- **Current Behavior:** Missing or weak timestamps break session-scoped prompt capture and can attach the wrong prompt to a user message.
- **Expected Behavior:** Prompt/message pairing should remain stable even when prompt-history records are incomplete.
- **Root Cause:** The matching logic depends too heavily on timestamps and does not maintain a robust fallback identity/order strategy.
- **Suggested Fix:** Match prompts and messages with stable session/order keys first, use timestamp tolerance consistently, and treat missing timestamps as degraded-but-supported input.

### FINDING-18: Capture and discovery errors are downgraded to false “not found” or empty data
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:118-133,168-175,271-296`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a08-opencode-capture.md`, `w4-a19-error-handling.md`
- **Current Behavior:** Session discovery, transcript loading, and parse failures are often returned as empty captures or “not found,” hiding operational failures from callers.
- **Expected Behavior:** Permission, I/O, and parse errors should remain distinguishable from true absence of data.
- **Root Cause:** Broad error swallowing turns multiple failure classes into the same empty-result shape.
- **Suggested Fix:** Narrow error handling to expected cases such as `ENOENT`, and propagate or explicitly annotate all other failures.

### FINDING-19: File extraction overwrites authoritative ACTION values during merge/enrichment
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:182-205,287-319`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a07-file-extractor.md`, `w5-a23-file-pipeline.md`, `w7-a35-011-files.md`
- **Current Behavior:** Stronger git-derived actions such as `Created`, `Deleted`, or `Renamed` can be downgraded to semantic defaults like `Modified` during later enrichment.
- **Expected Behavior:** Once a concrete action is present, later stages should preserve it and only fill in missing metadata.
- **Root Cause:** Semantic enrichment is treated as authoritative instead of fallback-only.
- **Suggested Fix:** Preserve existing ACTION values, merge only when missing, and prefer the more specific non-generic action on conflicts.

### FINDING-20: File identity, dedup, and truncation logic collapses distinct file changes
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:154-175,267-271`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:466-474,514-522`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w2-a07-file-extractor.md`, `w5-a23-file-pipeline.md`
- **Current Behavior:** Lossy path truncation, early workflow dedup, and non-canonical collision handling can merge separate file events or drop rows before the extractor can reconcile them correctly.
- **Expected Behavior:** Distinct file changes should remain distinguishable until final, canonical deduplication occurs.
- **Root Cause:** The pipeline deduplicates on lossy keys too early and in more than one place.
- **Suggested Fix:** Canonicalize path identity first, defer dedup until after merge-enrichment, and deduplicate on stable file identifiers rather than truncated display values.

### FINDING-21: `injectQualityMetadata()` can rewrite ordinary content as YAML frontmatter
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:384-430`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w3-a11-workflow-a.md`
- **Current Behavior:** Non-frontmatter content can be reinterpreted as YAML and rewritten incorrectly when quality metadata is injected.
- **Expected Behavior:** Only real frontmatter blocks should be parsed and rewritten; ordinary content should remain byte-stable.
- **Root Cause:** Frontmatter detection is permissive and does not clearly separate plain leading text from YAML document boundaries.
- **Suggested Fix:** Use a strict frontmatter parser, require exact delimiter placement, and leave files unchanged when a valid frontmatter block is absent.

### FINDING-22: Workflow stateless enrichment and validation contain null/unsafe dereferences
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:466-521,564-588,1162-1165`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w3-a12-workflow-b.md`, `w3-a13-workflow-c.md`
- **Current Behavior:** Unsafe `FILE_PATH` access, null dereferences in validation, and incorrect treatment of `loadDataFn` inputs can abort enrichment or crash no-data/simulation save paths.
- **Expected Behavior:** Stateless enrichment should tolerate missing or malformed data and fail with explicit validation errors rather than hard crashes.
- **Root Cause:** Multiple workflow branches assume normalized data exists even in fallback/simulation scenarios.
- **Suggested Fix:** Guard all nullable collections and file rows before access, and separate stateless live-session input handling from preloaded data handling.

### FINDING-23: Workflow contamination cleanup skips manual and non-provenanced data, and runs too late
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:680-763,804-825`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w5-a24-filter-pipeline.md`, `w7-a32-011-contamination.md`
- **Current Behavior:** `_manualDecisions` and observations without `_provenance` bypass cleaning entirely, and contamination filtering happens after enrichment has already introduced derived text.
- **Expected Behavior:** All user-visible observation/decision text should be sanitized before enrichment or downstream extraction consumes it.
- **Root Cause:** Cleaning is coupled to provenance metadata and is wired into a later pipeline stage instead of a guard phase.
- **Suggested Fix:** Sanitize all textual observation/decision fields in a pre-enrichment pass, then keep a lighter post-pass only for defensive cleanup.

### FINDING-24: `collect-session-data` uses conflicting canonical spec-folder logic
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:629-677,725-799`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w3-a15-collect-session-b.md`
- **Current Behavior:** Simulation fallback, multi-root detection, and final validation disagree about which spec folder is canonical, so valid inputs can be rejected or rewritten inconsistently.
- **Expected Behavior:** Spec-folder resolution should produce exactly one canonical representation that every later stage reuses.
- **Root Cause:** The extractor computes and validates spec-folder identity multiple times with different rules.
- **Suggested Fix:** Normalize spec-folder identity once, carry that canonical value through the extractor, and remove later re-derivation logic.

### FINDING-25: Final session status can remain `BLOCKED` after blockers are resolved
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:370-385`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w3-a14-collect-session-a.md`
- **Current Behavior:** Sessions can retain a `BLOCKED` status even after later evidence shows the blocker was resolved.
- **Expected Behavior:** Final status should reflect the latest known session state.
- **Root Cause:** Status derivation prioritizes earlier blocker evidence without a final reconciliation pass.
- **Suggested Fix:** Recompute status from the full ordered event stream and let later resolution events clear earlier blocked states.

### DESIGN

### FINDING-26: Workflow ignores per-folder description context when naming memory files
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:939-971,1221-1239`
- **Severity:** HIGH
- **Category:** DESIGN
- **Refs:** `w6-a26-010-descriptions.md`, `w6-a27-010-uniqueness.md`
- **Current Behavior:** Filename generation uses task text, spec title, and folder basename, while `description.json` tracking fields are updated only after the write.
- **Expected Behavior:** The per-folder description context should participate in filename generation so repeated saves and same-task collisions are disambiguated deterministically.
- **Root Cause:** `description.json` is treated as post-write bookkeeping rather than as an input to the naming algorithm.
- **Suggested Fix:** Load or generate the per-folder description before naming, feed its identity/history fields into slug generation, then persist the updated tracking data after a successful write.

### FINDING-27: Post-100 filename fallback is random, not hash-based, and is not collision-checked
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:163-170`
- **Severity:** HIGH
- **Category:** BUG
- **Refs:** `w6-a27-010-uniqueness.md`, `w6-a30-010-checklist.md`
- **Current Behavior:** After 100 suffix attempts, the fallback path emits a random hex suffix and returns it without verifying that the resulting name is actually unused.
- **Expected Behavior:** Overflow handling should follow one deterministic, collision-safe fallback strategy.
- **Root Cause:** The implementation diverged from the documented hash-based fallback and skipped final existence validation.
- **Suggested Fix:** Replace the random overflow path with a deterministic hash-based suffix (or equivalent stable derivation) and keep retrying until reservation succeeds.

## MEDIUM

### SECURITY

### FINDING-28: “Atomic” writes are not crash-durable, and backup handling can widen permissions
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:27-44,129-145,191-195`
- **Severity:** MEDIUM
- **Category:** SECURITY
- **Refs:** `w1-a01-file-writer.md`, `w5-a25-write-pipeline.md`
- **Current Behavior:** Temp files are `fsync`'d, but directory-entry changes are not, and backups may be created with broader permissions than the original file.
- **Expected Behavior:** A reported-success atomic write should survive crashes and must not weaken file permissions during backup/restore.
- **Root Cause:** The implementation assumes file `fsync` is enough and does not explicitly preserve or restore file mode metadata.
- **Suggested Fix:** `fsync` the parent directory after backup/create/rename/delete operations, create backups with explicit secure modes, and preserve original metadata on restore.

### BUG

### FINDING-29: Non-ENOENT filesystem failures are swallowed in duplicate/collision checks
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:65-88`; `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:147-155`
- **Severity:** MEDIUM
- **Category:** BUG
- **Refs:** `w1-a01-file-writer.md`, `w1-a05-slug-utils.md`, `w4-a19-error-handling.md`, `w6-a27-010-uniqueness.md`
- **Current Behavior:** Permission errors, transient I/O problems, and other unexpected read failures are treated as “no duplicate” or “directory missing,” so the pipeline continues with false assumptions.
- **Expected Behavior:** Only explicitly tolerated cases such as `ENOENT` should be suppressed.
- **Root Cause:** Broad catch blocks collapse operational failures into absence checks.
- **Suggested Fix:** Narrow the catches to expected error codes, and propagate/log every other failure before proceeding.

### FINDING-30: Config invariants are under-validated, and `CONFIG` mixes static settings with runtime state
- **File:** `.opencode/skill/system-spec-kit/scripts/core/config.ts:241-356`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Refs:** `w1-a02-config.md`
- **Current Behavior:** Fractional counts, invalid weight distributions, and mutable runtime state can live inside the global config object even when comments imply stricter invariants.
- **Expected Behavior:** Operational limits and weights should be validated to the real business rules, and runtime state should not mutate the shared config singleton.
- **Root Cause:** Validation is shallow, and configuration/state boundaries are not separated in the design.
- **Suggested Fix:** Add strict schema validation for numeric invariants and split immutable config from mutable runtime caches/state.

### FINDING-31: Contamination cleanup still leaves fragmented prose and misses some documented coverage
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:6-87`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Refs:** `w1-a03-contamination-filter.md`, `w4-a18-regex.md`, `w7-a32-011-contamination.md`
- **Current Behavior:** Sentence-final filler phrases, punctuation cleanup, and some relative-path/tool-name cases remain inconsistent, and the current denylist falls short of its claimed coverage count.
- **Expected Behavior:** Cleanup should produce readable text and meet the documented denylist coverage it claims to enforce.
- **Root Cause:** Regexes are maintained piecemeal, so count/coverage and post-replacement cleanup drift apart over time.
- **Suggested Fix:** Add explicit regression tests for sentence cleanup and pattern count, and centralize cleanup logic so matching and replacement are versioned together.

### FINDING-32: Decision extractor regex and evidence logic are lossy
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:211-217,329-335`
- **Severity:** MEDIUM
- **Category:** BUG
- **Refs:** `w2-a06-decision-extractor.md`, `w4-a18-regex.md`
- **Current Behavior:** Hyphenated manual decision titles are split incorrectly, fallback cue matching hits substrings inside larger words, and fact-based evidence can disappear whenever a `files` list is present.
- **Expected Behavior:** Title parsing, cue matching, and evidence selection should preserve the most faithful representation of the source text.
- **Root Cause:** Regex-based extraction is too brittle, and evidence precedence favors one shape without merging complementary evidence.
- **Suggested Fix:** Tighten token boundaries in the regexes, parse manual decisions with a safer delimiter strategy, and merge fact/file evidence instead of dropping one when the other exists.

### FINDING-33: Timestamp normalization fabricates wall-clock time, and metadata aliasing is only partial
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:458-468,419-425`; `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:90-97,501-507`
- **Severity:** MEDIUM
- **Category:** BUG
- **Refs:** `w2-a10-input-normalizer-b.md`, `w5-a22-capture-pipeline.md`, `w7-a33-011-normalization.md`
- **Current Behavior:** Invalid or missing timestamps fall back to “now,” and only a subset of snake_case capture fields are aliased to camelCase.
- **Expected Behavior:** Normalization should preserve stable ordering and fully normalize the documented capture schema.
- **Root Cause:** The fallback strategy optimizes for always having a timestamp rather than for preserving source order, and alias coverage is limited to a few top-level fields.
- **Suggested Fix:** Use capture-scoped deterministic fallback timestamps, and add a dedicated metadata normalizer that maps the full documented schema.

### FINDING-34: Workflow metadata bookkeeping is best-effort and can report success after partial failure
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1024-1103,1215-1240`
- **Severity:** MEDIUM
- **Category:** BUG
- **Refs:** `w3-a13-workflow-c.md`, `w4-a20-race-conditions.md`, `w6-a26-010-descriptions.md`, `w6-a30-010-checklist.md`
- **Current Behavior:** Stale folder metadata, lost-update races, and description tracking failures can occur without changing the success path or logs in a meaningful way.
- **Expected Behavior:** Metadata updates should either complete transactionally or surface a partial-failure outcome.
- **Root Cause:** Metadata writes happen after the main file write, are not coordinated across writers, and are wrapped in broadly swallowed error handling.
- **Suggested Fix:** Move metadata updates into an explicit post-write transaction phase with conflict detection and partial-failure reporting.

### FINDING-35: `collect-session-data` accepts poisoned metrics and flattens documentation failures into empty state
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:148,208-245,692`
- **Severity:** MEDIUM
- **Category:** BUG
- **Refs:** `w3-a14-collect-session-a.md`, `w3-a15-collect-session-b.md`
- **Current Behavior:** `NaN` and fabricated derived fields can enter extracted metrics, and doc-read failures degrade to “no docs,” altering downstream summaries and status logic.
- **Expected Behavior:** Non-finite metrics and document-read failures should be rejected or surfaced explicitly, not normalized into plausible-looking output.
- **Root Cause:** Numeric guards are incomplete, and error handling favors silent fallback over state accuracy.
- **Suggested Fix:** Reject non-finite values at the boundary, recompute derived fields only from valid inputs, and preserve doc-read failures as explicit error state.

### FINDING-36: Missing/corrupt `description.json` files are not regenerated, and legacy schemas are never upgraded
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1221-1239`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:458-469,635-658`
- **Severity:** MEDIUM
- **Category:** BUG
- **Refs:** `w6-a26-010-descriptions.md`, `w6-a28-010-compat.md`
- **Current Behavior:** If per-folder description metadata is missing, corrupt, or still on the legacy shape, the workflow may skip tracking or continue persisting the outdated schema forever.
- **Expected Behavior:** Missing or obsolete per-folder metadata should be regenerated or upgraded automatically when it becomes part of a successful save/search path.
- **Root Cause:** Load/save code treats legacy optional fields as acceptable forever and has no upgrade-on-read or regenerate-on-miss path.
- **Suggested Fix:** Normalize legacy records on load, regenerate missing/corrupt records from `spec.md`, and write back the upgraded schema atomically.

### FINDING-37: Read/Edit/Write observation titles can contaminate generated memory slugs
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:35-37,83-89`; `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:383-392`
- **Severity:** MEDIUM
- **Category:** BUG
- **Refs:** `w6-a29-010-slugs.md`
- **Current Behavior:** Tool-generated titles such as `Read utils/slug-utils.ts` are treated as valid content names and can become memory filenames.
- **Expected Behavior:** Operational tool labels should be filtered out before slug generation falls back to them.
- **Root Cause:** `slug-utils` contamination patterns no longer match the shorter relative-path titles emitted by the normalizer.
- **Suggested Fix:** Extend contamination rules to cover the current title format or reuse one shared “tool-title contamination” helper across both modules.

## LOW

### QUALITY

### FINDING-38: Checklist/spec compliance claims currently overstate what the implementation guarantees
- **File:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md:45-71`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-perfect-session-capturing/checklist.md:19-21`
- **Severity:** LOW
- **Category:** QUALITY
- **Refs:** `w6-a30-010-checklist.md`, `w7-a32-011-contamination.md`
- **Current Behavior:** Checklist items claim stronger guarantees than the code currently provides, including atomic filename uniqueness, per-save `memorySequence` correctness, scratch-only temp files, hash fallback behavior, and denylist pattern count.
- **Expected Behavior:** Compliance artifacts should match the actual implementation so audits and regressions remain trustworthy.
- **Root Cause:** Checklist text was not revalidated after implementation changes and specialized audit fixes.
- **Suggested Fix:** Update the checklist/spec claims to current reality immediately, then tighten the implementation and re-mark items only after targeted tests pass.

### PERFORMANCE

### FINDING-39: Centralized description-cache rebuild misses the documented 500-folder target
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:450-489`; `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:822-836`
- **Severity:** LOW
- **Category:** PERFORMANCE
- **Refs:** `w6-a28-010-compat.md`
- **Current Behavior:** The audited rebuild path takes roughly 2.7s-3.0s for 500 folders, missing both the enforced `<2s` test threshold and the stricter spec target.
- **Expected Behavior:** Cache rebuild should stay within the documented scan budget for 500 folders.
- **Root Cause:** The rebuild loop performs repeated synchronous discovery, stat, read, staleness, and optional repair work per folder.
- **Suggested Fix:** Reuse discovery metadata, avoid repair writes during aggregation, and move expensive upgrade/repair work to a separate maintenance path.

## Prioritized Action Plan

1. **Close every path-containment hole first.** Canonicalize all path checks in `file-writer.ts`, `file-helpers.ts`, `file-extractor.ts`, and `collect-session-data.ts`, and add regression tests for symlinked parents, `../../` escapes, and multi-root spec folders.
2. **Make writes and filename allocation truly atomic.** Fix rollback error surfacing, replace copy-based restore, add final-name reservation/retry logic, and make metadata updates conflict-aware.
3. **Harden runtime validation at every external-data boundary.** Add structural guards/decoders for capture JSON, normalized session input, decisions, files, and spec metadata before any deep property access.
4. **Repair the contamination pipeline as one system.** Normalize before filtering, clean all observation/manual/tool-title text, move the first pass before enrichment, and tighten rules so they neither leak chatter nor delete valid content.
5. **Reconcile the metadata contracts.** Unify the schemas shared by `opencode-capture`, `input-normalizer`, `file-extractor`, `workflow`, and `collect-session-data`, especially for timestamps, confidence, file changes, and spec-folder identity.
6. **Fix config and per-folder description lifecycle next.** Replace custom config parsing, regenerate/upgrade `description.json` automatically, and make description context part of deterministic filename generation.
7. **Only then update compliance artifacts and performance tuning.** Correct checklist/spec wording, add targeted regression tests for each finding cluster, and optimize description-cache rebuild once correctness is locked down.

## Multi-Agent Confirmation Highlights

- **Very high confidence:** FINDING-01, FINDING-02, FINDING-06, FINDING-07, FINDING-10, FINDING-13, FINDING-16, FINDING-19, FINDING-23, and FINDING-34 were independently confirmed by multiple agents/waves.
- **High confidence:** FINDING-03, FINDING-05, FINDING-14, FINDING-18, FINDING-24, FINDING-28, FINDING-29, FINDING-31, FINDING-33, and FINDING-36 each have at least two supporting audit references.
- **Single-audit but actionable:** The remaining findings were reported once, but each has concrete file/line references and a specific remediation path.

### SUMMARY - Total: 39, Critical: 2, High: 25, Medium: 10, Low: 2
