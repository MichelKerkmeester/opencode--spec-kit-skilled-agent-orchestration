# Iteration 009 — Cross-Cutting: Consistency

Scope: consistency review of `contextType` mapping across the six requested locations, plus adjacent runtime paths that still accept, reinterpret, or persist legacy aliases.

## P0

None.

## P1

### P1-1 - The session/save pipeline still preserves legacy `decision`/`discovery` values even though the migration/parser path canonicalizes them

- **Files:** `scripts/utils/input-normalizer.ts`, `scripts/extractors/session-extractor.ts`, `scripts/extractors/collect-session-data.ts`, `scripts/core/post-save-review.ts`
- **Lines:** `input-normalizer.ts:775-805`, `session-extractor.ts:575-606`, `collect-session-data.ts:879-908`, `post-save-review.ts:310-319`
- **Evidence:**
  - JSON input validation still accepts legacy `decision` as a valid `contextType` value instead of canonicalizing or rejecting it. [SOURCE: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:775-805`]
  - In the same save-generation pipeline, `detectSessionCharacteristics()` accepts an explicit `contextType` verbatim if it is in that broader set; it does **not** apply the `decision -> planning` or `discovery -> general` canonicalization used elsewhere. [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:575-606`]
  - `collectSessionData()` carries that explicit value through as `contextType`; it only remaps it when deriving `projectPhase` (`decision -> PLANNING`, `discovery -> RESEARCH`), which proves the file-generation side and the migration/parser side are using different semantic tables. [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:879-908`]
  - `post-save-review` then treats a canonical saved frontmatter value as a mismatch and suggests changing it back to the payload's explicit legacy value. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:310-319`]
- **Impact:**
  - The migration/parser stack treats `decision` as legacy input and canonicalizes it to `planning`, but the session-generation/review stack still treats explicit `decision` as authoritative.
  - That disagreement can keep reintroducing legacy file metadata pressure and produce misleading post-save review advice even when the indexed value is already canonical.
- **Recommendation:**
  - Canonicalize explicit payload values at the input/session boundary using the same alias map as `memory-parser` / `frontmatter-migration`.
  - Update `post-save-review` so canonicalized `planning` is not flagged as a mismatch when the incoming payload used legacy `decision`.

## P2

### P2-1 - The six reviewed locations do not share one authoritative valid-value set

- **Files:** `scripts/lib/frontmatter-migration.ts`, `scripts/extractors/session-extractor.ts`, `mcp_server/lib/parsing/memory-parser.ts`, `mcp_server/lib/search/intent-classifier.ts`, `mcp_server/lib/cognitive/fsrs-scheduler.ts`, `mcp_server/lib/validation/save-quality-gate.ts`
- **Lines:** `frontmatter-migration.ts:101-108, 135-147, 824-845`, `session-extractor.ts:120-135, 575-606`, `memory-parser.ts:84-124, 604-617`, `intent-classifier.ts:197-205`, `fsrs-scheduler.ts:271-277, 383-397`, `save-quality-gate.ts:336-360, 396-430`
- **Evidence:**
  - `frontmatter-migration` still treats both `decision` and `discovery` as valid values, while only canonicalizing `decision -> planning`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:101-108`; `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:824-845`]
  - `memory-parser` canonicalizes both legacy aliases (`decision -> planning`, `discovery -> general`). [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:108-124`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:604-617`]
  - `intent-classifier` only uses `implementation`, `research`, `planning`, or `null`; `decision` and `discovery` are absent as runtime weight values. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:197-205`]
  - `fsrs-scheduler` still carries `decision` as a live no-decay alias and treats `discovery` as a standard-decay / FSRS-schedule context. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:271-277`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:383-397`]
  - `save-quality-gate` only recognizes `planning` and legacy `decision` for the short-critical exception; `discovery` is not eligible. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:336-360`; `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:396-430`]
- **Impact:**
  - There is no single authoritative runtime enum for `contextType`; similar values mean different things depending on subsystem.
  - That raises the odds of future regressions whenever one layer's accepted values are reused as if they were global truth.
- **Recommendation:**
  - Define one shared canonical enum plus one shared alias-normalizer, then make all policy layers consume canonical values only.

### P2-2 - The main file-ingest path is canonical, but the DB boundary still allows legacy `decision` rows if any caller bypasses the parser

- **Files:** `mcp_server/lib/parsing/memory-parser.ts`, `mcp_server/handlers/memory-save.ts`, `mcp_server/handlers/chunking-orchestrator.ts`, `mcp_server/lib/search/vector-index-schema.ts`, `shared/normalization.ts`
- **Lines:** `memory-parser.ts:604-617`, `memory-save.ts:1055-1058, 1550-1553`, `chunking-orchestrator.ts:503-518`, `vector-index-schema.ts:1656-1659, 2226-2255`, `shared/normalization.ts:168-193`
- **Evidence:**
  - The main parse step canonicalizes `decision -> planning` before indexing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:604-617`]
  - Both the normal index path and the atomic pending-file path feed the parsed object into `prepareParsedMemoryForIndexing()`, so the reviewed file-ingest flow persists `parsed.contextType`, not raw frontmatter text. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1055-1058`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1550-1553`]
  - Chunk finalization also writes `context_type = ?`, but in the reviewed path that parameter is still `parsed.contextType`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:503-518`; `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:468-490`]
  - However, the database schema still allows `decision` and `discovery` in fresh installs, and low-level row serialization copies `memory.contextType` straight into `row.context_type` without normalization. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2226-2255`; `.opencode/skill/system-spec-kit/shared/normalization.ts:168-193`]
  - Upgraded databases are even looser: the migration adds `context_type` with no `CHECK` at all. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1656-1659`]
- **Impact:**
  - I did **not** find a reviewed file-content path that stores raw `decision` in `memory_index.context_type`; the canonical parser/indexer path appears safe.
  - But the persistence boundary itself does not enforce the canonical set, so `decision` can still exist through direct SQL, low-level helpers, or any future write path that bypasses parser normalization.
- **Recommendation:**
  - Tighten the storage boundary to canonical values only once the compatibility window closes, or normalize again immediately before every DB write.

## CONSISTENCY TABLE

| Location | File | "decision" maps to | "planning" maps to | "discovery" maps to | Notes |
|----------|------|--------------------|--------------------|---------------------|-------|
| 1 | `scripts/lib/frontmatter-migration.ts` | `normalizeContextType('decision') -> 'planning'` | `normalizeContextType('planning') -> 'planning'` | `normalizeContextType('discovery') -> 'discovery'` | `DOC_DEFAULT_CONTEXT` also defaults `decision_record -> planning`; valid set still includes legacy `decision` and `discovery`. |
| 2 | `scripts/extractors/session-extractor.ts` | `decisionCount > 0 -> 'planning'` in `detectContextType()` | output bucket is `'planning'` | not returned by `detectContextType()` | Same file separately accepts explicit `decision` / `discovery` unchanged in `detectSessionCharacteristics()`. |
| 3 | `mcp_server/lib/parsing/memory-parser.ts` | `CONTEXT_TYPE_MAP.decision -> 'planning'` | `CONTEXT_TYPE_MAP.planning -> 'planning'` | `CONTEXT_TYPE_MAP.discovery -> 'general'` | This is the strongest canonicalizer in the reviewed runtime path. |
| 4 | `mcp_server/lib/search/intent-classifier.ts` | `find_decision` intent weights use `contextType: 'planning'` | `find_spec` / `find_decision` both use `contextType: 'planning'` | not referenced | This is intent weighting, not a general-purpose normalizer. |
| 5 | `mcp_server/lib/cognitive/fsrs-scheduler.ts` | `decision -> Infinity / no_decay` | `planning -> Infinity / no_decay` | standard decay (`1.0` in classification path; `fsrs_schedule` in hybrid path) | Keeps `decision` as a live legacy alias instead of collapsing it. |
| 6 | `mcp_server/lib/validation/save-quality-gate.ts` | treated as equivalent to `planning` for short-critical exception | accepted for short-critical exception | rejected / `false` | Log message still hard-codes `context_type=decision` even when `planning` triggered the bypass. |

## Direct Answers

### 1. Do all 6 locations agree on what `decision` maps to?

No.

- Locations 1, 2, 3, and 4 converge on **planning semantics** for `decision`:
  - `frontmatter-migration` normalizes `decision -> planning`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:824-845`]
  - `detectContextType()` treats decisions as the `planning` bucket. [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:120-135`]
  - `memory-parser` maps `decision -> planning`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:108-124`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:604-617`]
  - `intent-classifier` uses `planning` for `find_decision`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:197-205`]
- Locations 5 and 6 still treat `decision` as a **live legacy alias** rather than collapsing it away:
  - FSRS keeps a dedicated `decision` no-decay branch. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:271-277`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:383-397`]
  - Save-quality-gate explicitly checks `params.contextType !== 'planning' && params.contextType !== 'decision'`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:345-360`]

### 2. Do all 6 locations agree on what valid `contextType` values are?

No.

- `frontmatter-migration` valid set: `implementation`, `research`, `planning`, `general`, `decision`, `discovery`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:101-108`]
- `session-extractor` has two different notions:
  - `detectContextType()` only returns `planning`, `research`, `implementation`, `general`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:120-135`]
  - `detectSessionCharacteristics()` accepts `implementation`, `research`, `debugging`, `review`, `planning`, `decision`, `architecture`, `configuration`, `documentation`, `general`, `discovery`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:575-606`]
- `memory-parser` public union / map still includes legacy `decision` and `discovery`, plus additional aliases such as `debug`, `analysis`, `bug`, `fix`, `feature`, `architecture`, `review`, `test`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:84-124`]
- `intent-classifier` only emits `implementation`, `research`, `planning`, or `null` as intent-weight targets. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:197-205`]
- `fsrs-scheduler` special-cases `planning`, `decision`, `research`, `implementation`, `general`, plus hybrid-only `discovery`, `session`, `scratch`, `transient`, `constitutional`, `critical`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:271-277`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:383-397`]
- `save-quality-gate` only cares about `planning` and `decision`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:345-360`]

### 3. Is there a path where a file could get `contextType = "decision"` stored in the DB despite the migration work?

For the **reviewed main file-ingest path**, I did **not** find one.

- `extractContextType()` canonicalizes legacy `decision -> planning` before the parsed object is prepared for indexing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:604-617`]
- Both `indexMemoryFile()` and the atomic pending-file save path immediately feed that parsed object into `prepareParsedMemoryForIndexing()`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1055-1058`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1550-1553`]
- The chunk finalization path also writes `parsed.contextType`, not raw frontmatter text. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:468-490`; `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:503-518`]

However, **the DB boundary still permits it** if some caller bypasses parser normalization:

- fresh schema `CHECK(context_type IN (... 'planning', 'general', 'decision', 'discovery'))` still allows `decision`; [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2226-2255`]
- upgraded schemas may have **no** `CHECK` at all; [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1656-1659`]
- and `memoryToDbRow()` copies `memory.contextType` straight through. [SOURCE: `.opencode/skill/system-spec-kit/shared/normalization.ts:168-193`]

So the precise answer is: **not through the reviewed canonical file parser/indexer path, but yes through lower-level or bypass write paths because storage still accepts legacy values.**

### 4. Are there any other locations not in this list that also reference `contextType` values?

Yes — several important runtime locations outside the requested six still reference or reinterpret `contextType`:

- `scripts/utils/input-normalizer.ts` — accepts explicit payload `decision` as valid input. [SOURCE: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:775-805`]
- `scripts/extractors/collect-session-data.ts` — carries explicit `contextType` forward and separately maps it to `projectPhase`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:879-908`]
- `scripts/core/memory-metadata.ts` — `decision` and `discovery` still collapse into `semantic` memory type. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:68-78`]
- `scripts/core/post-save-review.ts` — mismatch checker compares saved frontmatter against raw payload `contextType`. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:310-319`]
- `mcp_server/lib/search/vector-index-schema.ts` — schema still admits legacy values. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2226-2255`]
- `mcp_server/lib/search/vector-index-queries.ts` — search filters on raw `m.context_type = ?`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:247-249`]
- `mcp_server/lib/scoring/composite-scoring.ts` — reads stored `context_type` and forwards it into the FSRS decay path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:304-330`]
- `shared/normalization.ts` — DB row serializer copies `memory.contextType` verbatim. [SOURCE: `.opencode/skill/system-spec-kit/shared/normalization.ts:168-193`]
- `mcp_server/handlers/chunking-orchestrator.ts` — raw SQL update writes `context_type = ?`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:503-518`]
