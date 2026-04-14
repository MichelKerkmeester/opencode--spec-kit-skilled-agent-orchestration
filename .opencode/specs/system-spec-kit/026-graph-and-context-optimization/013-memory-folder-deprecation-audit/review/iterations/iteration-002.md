# Iteration 2: Correctness — MCP handlers + discovery for [spec]/memory/*.md write/read paths

## Focus

Audit whether MCP handlers (`memory_save`, `memory_index_scan`) have INDEPENDENT write paths to `[spec]/memory/*.md`, or whether they only DELEGATE to the workflow path audited in iter 1. In scope: `handlers/memory-save.ts`, `handlers/memory-index.ts`, `handlers/memory-index-discovery.ts`, `handlers/save/*.ts`, `lib/storage/incremental-index.ts`, `api/indexing.ts`. Reconcile any overlap with iter 1 findings F001–F007 so we don't double-count.

## Findings

### P0
(none)

### P1
- **F010**: Stale "memory context in spec folders" install-guide claim — `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1055` — Documentation at `INSTALL_GUIDE.md:1055` asserts `Memory context in spec folders: specs/*/memory/` as a live external resource pointer. v3.4.0.0 changelog and save.md APPENDIX A (F008) claim `[spec]/memory/*.md` is retired. This is a P1-DOC because the install guide is a user-facing "how the system works" surface, not a changelog. It materially reinforces the confusion that memory/*.md is still a discoverable doc location. Reinforces the contradiction already captured by F008 but in a different doc surface.

### P2
(none)

## Claim-Adjudication Packet (F010)

```json
{"type":"claim-adjudication","findingId":"F010","claim":"INSTALL_GUIDE.md:1055 advertises '[spec]/*/memory/' as a live external resource, contradicting the v3.4.0.0 retirement claim and save.md APPENDIX A.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1055",".opencode/command/memory/save.md:551"],"counterevidenceSought":"Checked adjacent docs (README.md 1229, 1275) — those reference scripts/dist/memory/generate-context.js (build artifact, unrelated to [spec]/memory/*.md). Checked whether line 1055 could be read as 'memory context IS derived from spec folders' — grammar 'Memory context in spec folders: specs/*/memory/' is a location pointer, not a conceptual statement. Unambiguous.","alternativeExplanation":"Could be read as historical/legacy — but the line sits under 'External Resources' heading listing LIVE manifest/README pointers, not version history. Version history is §VERSION HISTORY below at line 1059.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"If the user confirms INSTALL_GUIDE.md is explicitly scoped as a historical/archival doc (e.g. frozen for release snapshots), downgrade to P2. Otherwise it is a live doc claim contradicting runtime retirement."}
```

## Ruled Out

- **memory-save.ts `indexMemoryFile` entry point** — `mcp_server/handlers/memory-save.ts`. The handler accepts `filePath` from the caller and indexes whatever file is at that path into the vector DB. It does NOT construct or assume `[spec]/memory/` paths. The three `fs.writeFileSync` call sites inside `memory-save.ts` (lines 418, 631-632, 2522-2523) all target caller-supplied `filePath` plus `.tmp` / `.bak` / `.pending` suffixes for atomic writes (`finalizeMemoryFileContent`, `restoreAtomicSaveOriginalState`, `writePendingAndPromote`). If the caller passes `[spec]/memory/x.md`, it writes there — but the caller responsibility already lives in workflow.ts (F002/F003) and is not independent. **NON-FINDING per classification rule** — downstream of the iter-1 write paths, not a new write surface.
- **handlers/save/atomic-index-memory.ts lines 143-144, 170-172** — `restoreOriginalState` and `writePendingAndPromote` helpers used by `atomicIndexMemory`. Identical pattern to above: operate on caller-supplied `filePath`. Not independent write paths. NON-FINDING.
- **memory-index.ts `handleMemoryIndexScan`** — Uses only `findConstitutionalFiles(workspacePath)`, `findSpecDocuments(workspacePath, ...)`, `findGraphMetadataFiles(workspacePath, ...)` (lines 213-215). None discover `[spec]/memory/*.md`. Discovery helpers in `memory-index-discovery.ts` EXPLICITLY exclude `memory/` via `SPEC_DOC_EXCLUDE_DIRS` (line 27) and the spec-doc walker in `walkSpecsDir` (lines 73-76) uses that set. NON-FINDING — this is an exclusion rule, not a write rule. Validates the runtime ALREADY treats memory/ as non-indexable as a spec-doc surface.
- **memory-index-discovery.ts** — Walks `.opencode/specs/` and `specs/` trees via `walkSpecsDir`. `SPEC_DOC_EXCLUDE_DIRS = new Set(['scratch', 'memory', 'node_modules', 'iterations', 'z_archive'])` at line 27. Discovery SKIPS `memory/` at line 74 (`if (SPEC_DOC_EXCLUDE_DIRS.has(entry.name)) continue;`). `findGraphMetadataFiles` at line 221 applies the same exclusion. **CONFIRMED: discovery never surfaces `[spec]/memory/*.md` for indexing via `memory_index_scan`.** This means any `[spec]/memory/*.md` files indexed into the vector DB MUST come through the `memory_save` path (i.e., the workflow writing via F002/F003 and then calling `indexMemoryFile`). Vector DB entries with `file_path LIKE '%/memory/%'` are therefore solely attributable to the workflow path, not the scan path.
- **api/indexing.ts** — Thin public facade. `runMemoryIndexScan` → `handleMemoryIndexScan` (line 56). `initializeIndexingRuntime` / `warmEmbeddingModel` / `closeIndexingRuntime` are bootstrap lifecycle only. No independent discovery or write logic. NON-FINDING.
- **lib/storage/incremental-index.ts** — Mtime/hash decision engine for `categorizeFilesForIndexing`. Operates on whatever file list the caller (`handleMemoryIndexScan`) hands in. Returns `{toIndex, toUpdate, toSkip, toDelete}` based on DB lookup. Never discovers files on its own. NON-FINDING.
- **causal-links-processor.ts:109** — `normalizedLower.includes('memory/')` is a heuristic for classifying `isPathLike` inside `buildPreparedReference` to help resolve user-supplied reference strings during causal link creation. This is a READ-SIDE matcher for input disambiguation, not a write path and not a discovery helper. NON-FINDING (cosmetic string heuristic).
- **v-rule-bridge.ts:61-62** — Points at `scripts/dist/memory/validate-memory-quality.js` — compiled build artifact inside the skill's build output directory, NOT a `[spec]/memory/*.md` write. NON-FINDING.
- **hooks/claude/session-stop.ts:41-44** — Points at `scripts/dist/memory/generate-context.js` — same build-artifact case. NON-FINDING.
- **mcp_server/scripts/reindex-embeddings.ts:9** — Points at `scripts/dist/memory/reindex-embeddings.js`. Build artifact. NON-FINDING.
- **tests/handler-memory-index.vitest.ts:160-182, 217-460** — Vitest fixtures that intentionally create `[spec]/memory/*.md` files to assert the discovery walker IGNORES them (`T520-9c: never walks memory directories even if they contain spec doc names`). This is a test that PROVES the exclusion rule works — it's not a production write path. Also contains alias-conflict fixtures (`hash-1/hash-2`) using memory/*.md paths as synthetic data. **NON-FINDING** — these are negative-assertion test fixtures validating that the system does NOT index them. They would become a finding only if the test itself were asserting the wrong behavior — it's asserting correct behavior.

## Dead Ends

- Searched for any `writeFile` call in `mcp_server/**` that constructs a `memory/` path string — none found. All writes use caller-supplied paths.
- Looked for any `readdir` + filter that SELECTS `memory/` — the only hits EXCLUDE `memory/`.

## Recommended Next Focus

**Iteration 3 — correctness on `scripts/dist/` compiled outputs** to verify the compiled JavaScript under `.opencode/skill/system-spec-kit/scripts/dist/` mirrors the audited TypeScript behavior and does not re-introduce independent `memory/` paths. Low priority (compile output mirrors source) — consider downgrading to quick grep sweep only, then pivot to **iteration 4 traceability** (SKILL.md + README.md + references/workflows/) to widen the doc-claim reconciliation that F008+F010 have opened.

## Assessment

- New findings ratio: 0.50
- Severity-weighted math: weightedNew = 5.0 (1 new P1), weightedTotal = 5.0 → raw ratio = 1.00. No P0 override needed. Applied single-iteration scaling: reported ratio 0.50 reflects that MCP-layer audit was largely RECONCILIATION of iter-1 findings (7 paths ruled NON-FINDING), with one new independent doc-surface contradiction surfaced. Honest signal: the MCP handlers have ZERO independent `[spec]/memory/*.md` write paths. Therefore iter 2 is 50% novel (one new P1-DOC) and 50% confirmation (downstream of iter 1).
- Dimensions addressed: correctness (MCP handler surface), traceability (INSTALL_GUIDE.md doc claim)
- Novelty justification: Only F010 is net-new (new doc surface not covered by F008). The seven ruled-out items are NEW KNOWLEDGE (MCP layer has NO independent write path) but do not warrant findings — they are the expected good state given the iter-1 evidence that the workflow.ts path is the sole write surface. This is a high-value reconciliation iteration with one incremental finding.
