# Medium-Priority Deep Dive

Line numbers below refer to the current repository state for each source file.

## M1. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`

### Architecture Assessment

This file is a synchronous post-save review engine that re-compares rendered markdown against the originating JSON payload. It groups checks into PSR, D, and DUP families, computes severity counts, and converts a subset of findings into a blocking signal (`573-1126`). Complexity is concentrated in the custom frontmatter/metadata parsing helpers and in the guardrail arithmetic that determines when findings become blocking.

### Contract Surface

`reviewPostSaveQuality()` is the public entry point. It only meaningfully runs in JSON save mode and returns a `PostSaveReviewResult` with issues, counts, and a `blocking` flag. The blocking contract is narrower than the raw severity counts: only issues with `checkId` prefixes `PSR`, `D`, or `DUP` contribute to guardrail blocking.

### Failure Modes

The file uses hand-rolled line-oriented YAML parsing, so values containing additional colons can be misparsed. `repository_state !== 'unavailable'` treats many non-empty strings as valid provenance. Magic thresholds such as the 40-character overflow allowance have no machine-checked justification. The disk-read error path returns `REVIEWER_ERROR` but emits no comparable telemetry to the normal reviewer output path.

### Concurrency & State

The module is stateless and concurrency-safe.

### Drift Risk

Hardcoded generic-title lists, continuation-pattern heuristics, and placeholder detection can drift behind template evolution. New issue families that do not start with the recognized prefixes will not affect blocking arithmetic unless developers remember to update the prefix filter.

### Test Coverage Assessment

Direct tests exist in `scripts/tests/post-save-review.vitest.ts`. Additional coverage exists in `scripts/tests/memory-quality-phase2-pr3.test.ts` and `scripts/tests/overview-boundary-safe-truncation.vitest.ts`. Missing coverage includes embedded-colon YAML parsing, exact blocking-threshold boundary cases, and `repository_state` null/string-null edge cases.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `163` | custom YAML parsing splits on first colon and can misread valid YAML values containing `:`. | P1 |
| `457-474` | only `PSR`/`D`/`DUP` check IDs contribute to blocking; new prefixes are silently non-blocking. | P2 |
| `636-641` | short specific titles can be swept into generic-title logic because the generic-title heuristic is length sensitive. | P2 |
| `955` | `repository_state !== 'unavailable'` treats stringified null-like values as valid provenance. | P2 |
| `1014` | blocking formula never blocks on medium-only issue clusters, even if numerous. | P2 |

### Recommended Deep-Review Focus

1. Stress the custom YAML parser with embedded colons, arrays, and multiline values.
2. Verify whether the blocking formula still matches the intended severity policy.
3. Audit whether null-like repository-state values can create false provenance passes.
4. Consider making the guardrail-eligible check families explicit schema rather than prefix conventions.

## M2. `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`

### Architecture Assessment

This is a pure phrase-filter module built around regex/set checks and a batch dedup/shadow-removal pass. `sanitizeTriggerPhrase()` decides keep/drop for one phrase, while `sanitizeTriggerPhrases()` normalizes, sorts, deduplicates, and removes shorter shadowed phrases. Complexity is low, but semantic nuance sits in the `source: 'manual' | 'extracted'` split.

### Contract Surface

The single-phrase API returns a keep boolean plus reason. The batch API returns only kept normalized phrases, not a reasoned audit log. Manual-source phrases intentionally bypass several rejection classes after path-fragment and contamination checks.

### Failure Modes

Manual-source bypass means low-information stopwords or synthetic bigrams can pass if the caller marks them manual. Batch shadow removal is quadratic in the size of accepted phrases. Normalized comparison keys collapse dashes/underscores to spaces, so some semantically distinct phrases intentionally or unintentionally merge.

### Concurrency & State

The module is stateless and concurrency-safe.

### Drift Risk

Allowlists and blocklists are frozen literals. The header comment explicitly says some values must stay in sync with `topic-keywords.ts`, but no CI check enforces parity. Corpus-derived synthetic bigram blocklists will drift as new noisy phrase patterns appear.

### Test Coverage Assessment

Coverage is strong: `scripts/tests/trigger-phrase-sanitizer.vitest.ts`, `trigger-phrase-sanitizer-manual-preservation.vitest.ts`, `trigger-phrase-filter.vitest.ts`, and `trigger-phrase-no-prose-bigrams.vitest.ts`. Missing coverage includes performance behavior on large lists, dash/underscore dedup collisions, and explicit MAX length boundary tests.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `126-183` | manual-source flow bypasses stopword/synthetic-bigram rejections after early contamination checks. | P2 |
| `166-168` | a manual single-word phrase such as `and` can pass if the caller marks it manual. | P2 |
| `208-229` | returned phrases are normalized lowercase values, so original casing is lost permanently. | P2 |
| `218-224` | shadow-removal loop is O(n²) and unbounded by phrase count. | P2 |

### Recommended Deep-Review Focus

1. Reconfirm that manual-source bypass should apply to all low-information phrase classes.
2. Decide whether preserving original casing matters to any caller-facing UI or docs.
3. Add large-input tests or document expected list-size limits.
4. Add an explicit parity check with `topic-keywords.ts`.

## M3. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`

### Architecture Assessment

This MCP handler executes outline, caller/callee/import, and blast-radius queries over the code graph. It performs readiness checks, resolves the query subject, optionally traverses transitively, and decorates results with trust fields and breadcrumbs. Complexity is highest in subject resolution, BFS traversal, and payload enrichment because the file compresses multiple modes into one handler.

### Contract Surface

`handleCodeGraphQuery()` is the only public surface. It accepts six operations, optional transitive traversal, and optional blast-radius multi-subject mode. The file assumes graph DB helpers return consistent, bounded datasets and that the readiness layer can fail harmlessly.

### Failure Modes

`ensureCodeGraphReady()` errors are swallowed and become indistinguishable from an actually empty graph. `computeBlastRadius()` loads all reverse-import edges into memory. Transitive traversal stops at a hard limit mid-frontier, so same-depth nodes near the boundary can be omitted without explicit signal. The response-level enrichment uses only the first edge, even when the result set is heterogeneous.

### Concurrency & State

The handler itself is stateless; DB work is synchronous and shared underneath.

### Drift Risk

New edge types can silently misclassify into the fallback evidence class. Missing inferred edge types default to `CALLS` in transitive traversal. Outline responses for unknown paths can look like valid empties unless callers interpret them carefully.

### Test Coverage Assessment

No dedicated direct unit test file was identified for `query.ts`. Any current coverage is indirect through broader code-graph regression suites. Missing direct tests include readiness-failure surfacing, outline not-found behavior, BFS limit-at-frontier behavior, and heterogeneous-edge enrichment.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `241` | blast-radius computation pulls the full reverse-import edge set into memory with no explicit bound. | P1 |
| `332-334` | readiness-check failures are swallowed, hiding the distinction between failure and empty graph. | P1 |
| `375-376` | outline-style empty results and invalid subjects are not sharply distinguished for callers. | P2 |
| `419` | missing edge-type inference falls back to `CALLS`, which can silently change traversal semantics. | P2 |
| `559` | payload-level enrichment reflects only the first returned edge. | P2 |

### Recommended Deep-Review Focus

1. Add explicit signaling for readiness-check failure versus genuinely empty graph state.
2. Stress blast-radius on large graphs and check whether eager edge loading becomes material.
3. Test frontier-limit behavior on cyclic graphs.
4. Decide whether payload-level enrichment should summarize all returned edges instead of only the first.

## M4. `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`

### Architecture Assessment

This is a synchronous CLI traversal that finds spec folders, derives or refreshes `graph-metadata.json`, and emits a summary JSON report. It exports helper functions for testability but otherwise runs as a monolithic sequential filesystem walker. Complexity is moderate and sits in folder discovery, repo-root inference, and review-flag heuristics.

### Contract Surface

`runBackfill()` returns a `BackfillSummary` with counts and review flags. `collectSpecFolders()` and `collectReviewFlags()` are reusable helpers. The CLI accepts `--root`, `--dry-run`, and `--active-only`, and assumes any missing or malformed CLI argument can be handled locally.

### Failure Modes

Missing `--root` values are silently ignored and default back to the current root. `collectReviewFlags()` requires a newline before `status:`, which misses first-line status markers. Dry-run output increments intent counts in a way that can be misread as actual writes. Repo-root fallback logic depends on a brittle five-level path escape.

### Concurrency & State

Execution is single-threaded and state is local to the run.

### Drift Risk

Excluded directory sets and archive heuristics are hardcoded. The numbering regex permits `000-*` folders even though the broader spec convention starts at `001`. Repo-root inference is especially sensitive to layout changes.

### Test Coverage Assessment

Direct coverage appears to exist in `scripts/tests/graph-metadata-backfill.vitest.ts`. Missing targeted coverage includes malformed CLI args, repo-root fallback behavior, first-line `status:` handling, and dry-run counter semantics.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `22` | folder regex permits `000-*` packet folders outside the normal numbering convention. | P2 |
| `63` | repo-root fallback uses a brittle hardcoded five-level relative path. | P2 |
| `86-88` | `--root` without a value silently falls through to the default root. | P1 |
| `164` | review-flag regex requires `\nstatus:` and misses first-line status fields. | P2 |
| `204-215` | dry-run summary counts can imply mutations that did not occur. | P2 |

### Recommended Deep-Review Focus

1. Make malformed CLI argument handling fail loudly.
2. Clarify or rename dry-run counters so they cannot be mistaken for actual writes.
3. Harden repo-root discovery and consider sharing it across scripts.
4. Add tests for near-empty packets where `status:` appears at the top of the file.

## M5. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

### Architecture Assessment

This is the main skill-routing engine. It combines tokenizer-based intent boosting, phrase boosts, synonym expansion, skill-graph adjacency boosts, family affinity, conflict penalties, and threshold filtering into one scoring pipeline. It also owns graph loading and fallback behavior. Complexity is high because scoring order materially changes output and many boost systems overlap.

### Contract Surface

The file exports analyzer helpers and a CLI that emits JSON recommendations with confidence, uncertainty, and pass/fail threshold fields. It assumes the runtime sidecar module loads cleanly and that the skill graph is available via SQLite or JSON, or else can be compiled on demand.

### Failure Modes

The auto-compile subprocess has no timeout. `_SKILL_GRAPH` is cached process-wide with no invalidation. `GRAPH_ADJACENCY_EDGE_TYPES` includes `prerequisite_for`, but graph boosting never uses that relation. Phrase-intent entries containing `.*` are substring-checked, not regex-checked, so they are effectively dead. Conflict penalties mutate uncertainty in place but do not directly demote confidence.

### Concurrency & State

This file uses module-level mutable caches and is not designed for threaded access, even if today it mostly runs as a CLI.

### Drift Risk

`INTENT_BOOSTERS` and `PHRASE_INTENT_BOOSTERS` are manual vocabularies that can drift behind actual skill metadata. Hyphenated keys are especially fragile because tokenization uses `re.findall(r'\b\w+\b', prompt_lower)`, which splits on hyphens. SQLite-vs-JSON graph divergence can also change routing silently.

### Test Coverage Assessment

Coverage is thin: `test_skill_advisor.py` provides smoke-level checks, while repo-level regression harnesses exercise the CLI externally. Missing targeted coverage includes stale graph reload behavior, dead phrase entries, unused `prerequisite_for` graph edges, conflict-penalty semantics, and subprocess timeout handling.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `78` | graph adjacency includes `prerequisite_for`, but boost logic never consumes it. | P2 |
| `206` | graph cache has no invalidation or refresh path once loaded. | P2 |
| `227-244` | graph auto-compile subprocess has no timeout and can hang indefinitely. | P1 |
| `1645`, `1670-1682` | tokenizer splits on hyphens, so hyphenated single-token boosters are unreachable. | P1 |
| `1684-1690` | phrase entries are substring matched, so regex-like literals such as `how is.*implemented` are dead. | P1 |
| `1792-1800` | conflict penalty only adjusts uncertainty, so high-confidence conflicting skills can still pass. | P2 |

### Recommended Deep-Review Focus

1. Audit the dead phrase and hyphenated-booster surfaces and decide whether they should be removed, migrated, or truly regex-enabled.
2. Add timeout and refresh semantics around graph auto-compilation and caching.
3. Decide whether `prerequisite_for` should have routing meaning or be dropped from adjacency load.
4. Inspect whether conflict penalties should alter pass/fail status, not just uncertainty.

## M6. `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`

### Architecture Assessment

This file validates and compiles skill graph metadata into a routing-friendly adjacency structure. It discovers all `graph-metadata.json` files, validates each, runs cross-validation passes, and emits compiled output. Complexity is moderate; the sharp edges are in which validation failures block compilation and which only warn.

### Contract Surface

The compiler promises a compiled graph artifact with stable keys and a small set of exit codes. It treats most cross-graph issues as warnings, except certain hard validation failures and simple dependency cycles. Consumers assume the compiled graph is trustworthy even when warnings are present.

### Failure Modes

One corrupt file can halt the entire compile. Cycle detection only catches direct two-node cycles. Validation accepts zero-weight edges, but compilation silently drops them. `conflicts_with` has no weight-band validation, so one edge class is effectively less governed than the others.

### Concurrency & State

The compiler is stateless per run.

### Drift Risk

Allowed families, categories, edge types, and entity kinds are all hardcoded literal sets. The compiler becomes the hidden schema authority and can drift from actual metadata documentation. Warning-only symmetry behavior also lets asymmetric graphs influence routing silently.

### Test Coverage Assessment

No dedicated direct compiler test suite was identified. Most confidence comes from manual validation commands and downstream routing behavior, not from narrow unit tests of the compiler itself.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `84-87` | one corrupt metadata file blocks graph compilation for all skills. | P1 |
| `272-318` | symmetry problems are warnings only, so asymmetric graphs still compile and affect routing. | P2 |
| `323-329` | `conflicts_with` has no defined weight band and therefore no comparable advisory enforcement. | P2 |
| `460` | cycle detection only checks simple two-node reverse edges. | P1 |
| `529` | validation accepts zero-weight edges, but compilation silently drops them. | P1 |

### Recommended Deep-Review Focus

1. Decide whether compile should support skip-invalid mode or remain all-or-nothing.
2. Add explicit documentation and tests for the two-node-only cycle rule.
3. Reconcile zero-weight validation with compile-time dropping.
4. Revisit whether symmetry warnings should become blocking for new skills.

## M7. `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`

### Architecture Assessment

This YAML file is a workflow contract for `/spec_kit:plan`. It encodes step order, intake branching, quality gates, template paths, parallel-dispatch policy, and save-context behavior. Complexity is not in algorithmic code but in the density of behavioral promises a consuming runtime must interpret consistently.

### Contract Surface

The workflow promises a sequential 0.5/0.6/1-7 plan path, optional phase decomposition, strict validation points, and a save-context step that shells into `generate-context.js`. `--intake-only` is supposed to halt before step 1. Quality gates are described as hard blocking, and the workflow implies runtime-agnostic portability.

### Failure Modes

`intake_only == TRUE` is an untyped string comparison and can be interpreter-sensitive. Save-context uses a shared `/tmp/save-context-data.json` path that is non-portable and racy. The post-execution quality-gate score ceiling is 85, not 100, but the file reads like a normal 100-point gate. Step 5 claims unconditional parallel dispatch while the earlier parallel-dispatch section still describes an ask-threshold model.

### Concurrency & State

The YAML itself is static, but its prescribed `/tmp` path introduces cross-run shared state.

### Drift Risk

Template paths and placeholder agent paths can drift silently because this YAML is not self-validating. The populated-folder check depends on `graph-metadata.json` already existing, which can misclassify new folders during the same workflow where creation is supposed to happen later.

### Test Coverage Assessment

No direct automated tests were identified for this asset. Any current validation is indirect and manual.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `98` | no-regression rule is a prose contract only and depends on consumer fidelity. | P2 |
| `208-210`, `466-467` | parallel-dispatch ask-threshold policy conflicts with step-5 "no question asked" wording. | P1 |
| `273-276` | post-execution quality checks sum to 85, not 100. | P2 |
| `336` | populated-folder check requires `graph-metadata.json` before the workflow's later create/repair steps would generate it. | P2 |
| `381` | `intake_only == TRUE` is untyped and interpreter dependent. | P1 |
| `550` | save-context path uses shared `/tmp/save-context-data.json`. | P1 |

### Recommended Deep-Review Focus

1. Normalize boolean semantics for `--intake-only`.
2. Remove the shared `/tmp` dependency from save-context instructions.
3. Reconcile the two conflicting parallel-dispatch stories.
4. Add CI or command-level validation that all declared template paths exist.

## M8. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-deep-review-and-remediation/implementation-summary.md`

### Architecture Assessment

This is a continuity-heavy implementation summary that doubles as machine-readable session state. The `_memory.continuity` frontmatter is the operational contract; the markdown body is the human explanation. Complexity here is state freshness rather than code flow.

### Contract Surface

The file promises authoritative `next_safe_action`, blockers, completion percentage, key files, and retrieval triggers. Because it is high-tier and continuity-indexed, stale fields can misdirect both resume flows and reviewers.

### Failure Modes

Stale `next_safe_action`, stale blocker lists, and frozen `completion_pct` can send agents back to already-completed remediation. The document also contains an internal count mismatch between the summary description and the body. `session_dedup.fingerprint` looks hash-like but is not a real hash, which can mislead downstream format assumptions.

### Concurrency & State

The file itself is static, but it functions as session-state input and therefore carries last-write-wins risk if multiple continuity refreshes touch it.

### Drift Risk

This document is especially drift-prone because it tries to encode live remediation state in static frontmatter fields. If maintainers update the body but not the continuity block, resume behavior diverges from the visible summary.

### Test Coverage Assessment

There is no direct automated validation of the semantic correctness of `next_safe_action`, `blockers`, or `completion_pct`. Confidence comes only from manual packet hygiene.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `25-27` | `next_safe_action` and blocker state can become stale and misdirect resume flows. | P1 |
| `32` | `key_files` omits the document that actually contains the continuity block. | P2 |
| `33` | `session_dedup.fingerprint` is hash-shaped prose, not an actual SHA256 digest. | P2 |
| `37` | `completion_pct` is a snapshot field with no automatic refresh path. | P2 |
| `3`, `110-116` | finding totals are inconsistent between description and body summary. | P2 |

### Recommended Deep-Review Focus

1. Reconcile the frontmatter continuity state with actual remediation completion.
2. Decide whether `completion_pct` should remain in this document if it is not actively maintained.
3. Normalize the fingerprint field so it is either a real hash or explicitly labeled synthetic.
4. Add packet hygiene checks that compare summary totals across frontmatter and body.
