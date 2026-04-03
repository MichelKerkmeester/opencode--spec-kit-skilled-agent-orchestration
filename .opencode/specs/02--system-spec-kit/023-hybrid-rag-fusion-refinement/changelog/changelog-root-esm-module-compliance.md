## [v1.1.0] - 2026-04-02

This follow-on release extends the packet after the original migration closure recorded in `v1.0.0`. Phase 13 hardened search correctness, search visibility, and SQLite path stability: multi-word FTS5 searches keep their exact-word matches, `/memory:search` now groups results by leaf spec folder, vector search stays pinned to the populated `context-index.sqlite`, and the search pipeline now warns instead of failing quietly on unexpected empty paths. Phase 13 verified all P0 and P1 checklist items and leaves one P2 follow-up open for saving the supporting research and review findings into `memory/`.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement` (Level 2)

---

## Search Hardening (4)

This release turns the packet's post-migration search follow-up into a recorded shipped state instead of leaving it buried in a late child phase.

### Multi-word phrase queries now survive FTS5 normalization

**Problem:** Phrase tokens that already arrived quoted from the lexical normalization path were being wrapped in a second pair of quotes before the FTS5 search executed. That created invalid `""phrase""` syntax and silently dropped the FTS-backed portion of multi-word hybrid searches.

**Fix:** The FTS5 search path now detects already-quoted phrase tokens and leaves them alone. Multi-word searches can return FTS-backed results again instead of losing them at the last minute.

### `/memory:search` results are easier to scan by folder

**Problem:** Search results were rendered with full spec-folder paths in a dense layout. Even when the ranking was right, the output was harder to scan than it needed to be.

**Fix:** The dashboard now uses the chosen Design 10 layout, grouping results by leaf spec folder and shortening the path presentation. The same layout is applied in both command surfaces so the output story is consistent.

### Focused and deep search no longer lose candidates because of over-eager narrowing

**Problem:** The search path still had two correctness traps after the earlier retrieval fixes. Focused mode could promote a discovered folder into a hard search filter, and deep mode could let an ephemeral `sessionId` act like governance scope input. Both cases made legitimate candidates disappear.

**Fix:** Folder discovery no longer turns into a hard scope filter in `memory_context`, and stage-1 candidate generation no longer treats a plain `sessionId` as governed scope input. Focused mode returns candidates again, and deep mode keeps its expected hybrid recall.

### Search traces now show active channels and zero graph contribution explicitly

**Problem:** When hybrid search blended multiple ranking signals, it was still hard to tell which channels actually contributed and whether graph signals were active or merely configured.

**Fix:** Stage 1 now reports `activeChannels`, and Stage 2 emits a zero-contribution graph diagnostic when graph rollout state is present but no graph boosts fired. Operators can inspect the search path more directly instead of inferring it from the final ranking alone.

---

## Reliability (2)

### Vector search no longer drifts onto the empty provider-specific database

**Problem:** After lazy Voyage-4 initialization, the vector-index store could re-resolve its SQLite path and drift from the populated `context-index.sqlite` to the empty provider-specific database. The search path still ran, but it was reading from the wrong place.

**Fix:** Database path resolution is now stabilized around the active populated database, with conflict logging and post-validation connection caching. Vector search stays bound to the correct store instead of silently swapping itself onto an empty one.

### Startup and rebinding now defend the populated database path

**Problem:** Even with the main path fix in place, startup and lifecycle rebinding could still weaken the guarantee if projection state was empty or if consumers rebound to a newly derived but empty database.

**Fix:** Startup now logs and checks the active database state, triggers lineage backfill when projection data is missing but `memory_index` is populated, and refuses to rebind consumers onto an empty database unless explicitly overridden. The packet now guards the whole lifecycle, not just one call site.

---

## Operations (1)

### Silent failure paths now warn before returning empty results

**Problem:** Several unexpected empty or null exits in the hybrid search path returned quietly. That made operational troubleshooting much harder because broken conditions looked too similar to ordinary "no result" cases.

**Fix:** The search pipeline now emits warning logs across the affected failure paths in `hybrid-search.ts`, `stage1-candidate-gen.ts`, and `vector-index-queries.ts`, and the FTS scope filter now matches exact-or-descendant folders consistently. Search failures are still bounded, but they are no longer invisible.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Multi-word hybrid search | FTS5 matches silently dropped | Runtime verification returned 5 results |
| `memory_context` focused mode | Broken path could return 0 candidates | Runtime verification returned 5 candidates |
| Hybrid pipeline visibility | Active channels not exposed | `activeChannels: 2` present in stage-1 metadata |
| Phase 13 checklist closure | P0/P1 not yet verified | P0 13/13 and P1 11/11 verified |

The original `v1.0.0` entry below remains the migration-closure release. This `v1.1.0` entry records the later post-closure stabilization phase that expanded the packet to 13 phases.

---

## [v1.0.0] - 2026-04-01

This release closed the original 12-phase ESM Module Compliance packet at `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement`. The point of the work was simple: make the runtime tell the truth, make search trustworthy again, and make saved memory useful instead of boilerplate.

Across 10 days, the packet migrated `@spec-kit/shared` and `@spec-kit/mcp-server` to native ESM (Node's modern module system), kept `@spec-kit/scripts` on CommonJS (Node's older module system) without faking compatibility, fixed search failures that could return zero results, audited 186 spec folders, rebuilt the memory database from clean inputs, and raised JSON-mode memory saves from unusable 0/100 output to a repeatable 55-75/100 range. Final verification ended at 9480+ passing tests with 0 failures and 0 skipped.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement` (Level 2)

---

## Migration (3)

This release started as a module migration, but it only counted as done once the runtime, tests, and surrounding tooling all matched the same story.

### Shared moved to truthful native ESM

**Problem:** `@spec-kit/shared` used modern import syntax in source code, but the package contract still needed to match what Node actually runs. If the package says one thing and emits another, every downstream package inherits that confusion.

**Fix:** `@spec-kit/shared` now ships as real native ESM. The phase updated package metadata, compiler settings, and relative import paths so runtime behavior matches the source. That touched 20 files and rewrote 48 imports and exports, giving the rest of the packet a clean base to build on.

### MCP server moved to truthful native ESM

**Problem:** The MCP server was the hardest part of the migration because it had years of CommonJS assumptions buried inside it. Old patterns like `require()`, `__dirname`, `__filename`, and loose JSON loading can keep a package looking modern in source while still depending on old runtime rules.

**Fix:** `@spec-kit/mcp-server` now runs as native ESM end to end. The migration rewrote 839 imports across 181 files, replaced CommonJS-only globals, converted the remaining `require()` holdouts, and repaired ESM startup details like JSON import attributes. The result is a server that starts and runs under the module system it claims to use.

### Scripts kept their CommonJS contract without pretending to be ESM

**Problem:** `@spec-kit/scripts` still needed to behave like CommonJS for callers that already depend on that contract. Flipping it to ESM just for consistency would have broken the wrong thing.

**Fix:** The packet kept `scripts` on CommonJS and proved that choice cleanly. Instead of forcing a dual-build or a fake wrapper layer, it used Node 25's native `require(esm)` support where appropriate, removed blockers that broke that boundary, and hardened the memory-save path at the same time. That preserved compatibility without dragging old assumptions back into `shared` or `mcp-server`.

---

## Testing (3)

The migration only mattered if the repo could prove it under load, under regression checks, and after old failures were removed instead of ignored.

### The verification matrix closed cleanly

**Problem:** A module migration can look finished because the build passes, while the actual runtime matrix still has blind spots. That is how teams end up shipping "it compiles" instead of "it works."

**Fix:** This packet closed the full verification matrix. Builds passed, direct runtime smokes passed, package-specific test suites passed, and cross-boundary interop checks passed. The final state was 9480+ passing tests with 0 failures and 0 skipped, which gave the migration a real finish line instead of a hopeful one.

### Pre-existing failures and skipped coverage stopped hiding the true state

**Problem:** By the time the runtime migration landed, the suite still had 8 pre-existing failures plus skipped and todo gaps. That meant the repo could not honestly say whether the migration was finished because old noise still covered the dashboard.

**Fix:** Phase 5 fixed the old failures first, then converted the remaining skipped and todo cases into real passing tests. That turned the suite from "mostly green with caveats" into a clean signal the repo can trust.

### Deep review findings were remediated instead of filed away

**Problem:** Large migrations often end with a review report that points at real risks but lands too late to influence the shipped state. That creates a second cleanup project and leaves known weak spots in production.

**Fix:** This packet absorbed the review while it was still live. A 10-iteration GPT-5.4 deep review produced 18 findings across correctness, security, reliability, maintainability, and performance. All 18 were remediated in the packet itself, adding 632 insertions and 91 deletions across 20 files so the shipped state includes the review follow-through rather than merely documenting it.

---

## Security (2)

The security work in this packet was about making boundaries explicit. The system should reject the wrong thing for a clear reason, not quietly block the right thing by accident.

### Governance became explicit instead of silently breaking normal search

**Problem:** A security control that defaults to "deny everything" can be correct in theory and still wrong in practice if the system is not actually running in a governed environment. That is exactly what happened in one search path. Normal unscoped queries were being rejected as if they were unauthorized, which made valid searches look empty.

**Fix:** The packet changed scope enforcement from silent default-on behavior to explicit opt-in behavior. Governance still works when intentionally enabled, but normal single-user search no longer gets treated like an access violation. That restored truthful behavior without weakening the guarded path.

### Memory-save and shared-memory boundaries were hardened

**Problem:** The review found several places where the system trusted too much or explained too little. Shared-memory admin operations lacked clear transport warnings, path handling needed stronger workspace boundary checks, and duplicate-preflight queries needed governed scope threading so cross-scope data would not leak through metadata.

**Fix:** The packet closed those gaps in the live code. It added trusted-transport warnings for admin paths, fail-closed behavior in the V-rule bridge, workspace boundary validation in shared path handling, and governed-scope handling with metadata redaction in duplicate-preflight logic. The practical result is simpler to explain: the system now draws sharper lines around where sensitive operations can run and what they are allowed to reveal.

---

## Search (4)

Search was the second major story in this packet. It went from "sometimes empty, sometimes misleading" to something the repo can rely on again.

### The zero-result search outage was fixed at the root cause

**Problem:** The search pipeline could return zero results even when the database clearly had matching content. This was not a ranking issue. It was a silent-filter issue. Two separate checks were removing valid candidates after the search channels had already found them.

**Fix:** The packet fixed both filters. Scope enforcement stopped rejecting every unscoped query by default, and the `minState: 'WARM'` filter stopped running against a state column that does not exist yet. Once those two gates were removed, `memory_search` and `memory_context` started returning real results again instead of empty answers.

### The corpus behind search was cleaned and rebuilt

**Problem:** Even a correct pipeline gives poor answers if the underlying corpus is messy. By the time this phase started, spec documents and memory files carried enough structural drift that indexing them cleanly was no longer a safe assumption.

**Fix:** The compliance audit attacked the corpus directly. It scanned 186 spec folders, applied 2,081 frontmatter fixes, added 4,291 anchors, removed 46 hard-block memory files, cleaned orphaned vectors, and rebuilt the database from zero. Final audit status reached 175/175 in-scope folders at 0 errors. That matters because search quality is only as good as the documents it is allowed to search.

### Bulk reindex stopped rejecting good files

**Problem:** The reindex validator was blocking 1,106 legitimate files because two validation rules were using the wrong kind of context. In plain English, the checker was reading batch inputs without enough file-path awareness and calling good files bad.

**Fix:** The packet threaded file-path context through the validator, skipped checks that do not make sense for spec docs and memory files, corrected `contextType` normalization, and added schema migration v25 so the database enforces the cleaned canonical values. It also removed 13,211 duplicate rows that had accumulated during force reindex runs. The end result was the one that matters: bulk reindex went from rejecting 1,106 files to accepting all of them.

### Retrieval quality improved after correctness was restored

**Problem:** Once search returned results again, it still needed to return the right results in the right shape. Intent could get lost between handlers, folder discovery could over-narrow the search, token-budget trimming could throw away too much content, and score traces could lose lexical signals from exact-word channels.

**Fix:** The packet added six retrieval-quality fixes, then followed with index and scoring repairs after a repository move broke three search indexes. Intent now propagates through the search path, folder discovery can recover instead of trapping the query in an empty folder, token-budget enforcement truncates more gracefully, metadata-only fallbacks preserve visibility, lexical scores survive fusion traces, and CocoIndex was re-indexed across 51,820 files. Search is not just alive again. It is easier to trust and easier to inspect.

---

## Quality (3)

The last part of the packet was about truthfulness at the edges: documentation, database state, and saved memory quality all needed to stop drifting from what the system actually does.

### Standards and packet documentation now describe the shipped runtime

**Problem:** During long migrations, docs often lag behind the implementation or overstate work that is still in flight. That makes the release harder to understand and harder to maintain.

**Fix:** This packet synced its standards docs and packet records after runtime proof, not before it. The result is a changelog and packet set that describe the shipped state rather than the intended one. For a future maintainer, that means less guesswork and fewer "which version is true?" moments.

### Context types and schema rules were normalized

**Problem:** The memory system had alias drift in one of its basic classification fields. Values like `decision` and `discovery` still existed in places where the current model expected `planning` and `general`. Over time, that kind of drift turns into validation noise, bad analytics, and brittle migrations.

**Fix:** The packet established canonical context types across parser logic, migrations, runtime consumers, and the database constraint itself. Schema version 25 migrates old values before enforcing the cleaned contract, so the repo gets a stricter and clearer model without forcing manual cleanup by hand.

### Memory saves now produce useful output instead of boilerplate

**Problem:** JSON-mode memory saves were scoring 0/100 because the pipeline skipped normalization for preloaded structured input. Downstream extractors then saw empty arrays, produced generic filler text, and saved memories that were technically valid but practically useless.

**Fix:** The packet rewired normalization for structured input, added message synthesis when no transcript exists, derived titles and summaries from real session data, reduced repeated decision text, relaxed false contamination hits for sibling phases, and added a guarded quality floor. The result moved JSON-mode saves from unusable 0/100 output to a repeatable 55-75/100 range. That is a quality overhaul, not a cosmetic tweak.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Runtime contract | Mixed module truth across package boundaries | `shared` and `mcp-server` are native ESM, `scripts` remains truthful CommonJS |
| Tests passing | Suite not fully clean | 9480+ |
| Failed tests | 8 pre-existing failures remained | 0 |
| Skipped or todo coverage | Present | 0 |
| TypeScript errors | 0 | 0 |

The packet also added and updated targeted regression coverage around module interop, search filtering, reindex validation, schema migration, and memory-save quality paths.

---

## Schema Changes

| Change | Details |
| ------ | ------- |
| Schema version | 24 to 25 |
| Canonical context types | Legacy aliases are migrated to `planning` and `general`, then enforced with a canonical-only `CHECK` constraint |
| Data cleanup | 2,009 legacy `contextType` values migrated and 13,211 duplicate rows removed |
| Search/index repair | Broken search indexes repaired after repo move, then CocoIndex re-indexed across 51,820 files |

Backward compatibility was preserved by migrating legacy data before the stricter schema rules were enforced.

---

<details>
<summary>Technical Details: Packet Surfaces Changed</summary>

### Source (10 major workstreams)

| Area | Changes |
| ---- | ------- |
| `.opencode/skill/system-spec-kit/shared/` | Native ESM migration across 20 files with 48 import and export rewrites |
| `.opencode/skill/system-spec-kit/mcp_server/` | Native ESM migration across 181 files with 839 import rewrites plus `require()` and path cleanup |
| `.opencode/skill/system-spec-kit/scripts/` | CommonJS interop boundary retained, Node 25 `require(esm)` path proven, memory-save pipeline hardened |
| `023-hybrid-rag-fusion-refinement/006-review-remediation/` | 18 deep-review findings remediated across correctness, security, reliability, maintainability, and performance |
| `023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix/` | Zero-result search failure fixed by removing two silent filters |
| `023-hybrid-rag-fusion-refinement/008-spec-memory-compliance-audit/` | 2,081 frontmatter fixes, 4,291 anchors added, 46 bad memory files removed, database rebuilt |
| `023-hybrid-rag-fusion-refinement/009-reindex-validator-false-positives/` | File-aware validation, canonical `contextType` cleanup, schema v25, duplicate-row cleanup |
| `023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes/` | Intent propagation, folder recovery, adaptive truncation, metadata-only fallback, confidence floor |
| `023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/` | Search index repair after repo move, CocoIndex re-index, adaptive fusion enablement, lexical score propagation |
| `023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline` | Normalization wiring, message synthesis, title derivation, decision dedup, V8 relaxation, quality floor |

### Tests

Verification covered package builds, runtime smoke tests, scripts interop proof, full `mcp_server` and `scripts` suites, targeted search and validator regressions, and the final zero-failure sweep that closed every skipped or todo gap.

### Documentation

Packet docs, standards docs, checklists, implementation summaries, and audit records were synced to the shipped runtime state. The compliance audit finished with 175/175 in-scope folders at 0 errors.

</details>

---

## Upgrade

No migration is required for this changelog artifact.

For future work, treat these behaviors as the new baseline:

- `@spec-kit/shared` and `@spec-kit/mcp-server` are native ESM.
- `@spec-kit/scripts` remains CommonJS by design.
- New `contextType` values should use the canonical set, not legacy aliases.
- Search and memory-save fixes described here are part of the shipped state and should not be reworked around as if they were temporary patches.
