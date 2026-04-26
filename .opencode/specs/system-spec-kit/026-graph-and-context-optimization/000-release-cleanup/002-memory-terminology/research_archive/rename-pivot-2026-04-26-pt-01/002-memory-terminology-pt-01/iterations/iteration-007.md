# Iteration 7: Implementation PR sequencing plan (status: insight)

## Focus

Pure synthesis: decompose the 6-layer Q3 scope-frozen contract into 4 atomically-shippable PRs ordered by dependency. Track: **implementation-sequencing**.

## Findings

### Deliverable 1 — 4-PR Sequencing Plan

**PR1: Parser-fallback + telemetry foundation** (scope verb: "make codebase READ both keys safely; instrument legacy path")
- 5 source-side parser anchor sites (atomic): `mcp_server/handlers/save/create-record.ts:23`, `mcp_server/dist/handlers/memory-search.js:49`, `mcp_server/dist/handlers/memory-save.js:67`, `mcp_server/dist/lib/parsing/trigger-matcher.js:64`, `mcp_server/dist/lib/routing/content-router.js:44` [iter-3 #1]
- 1 regex extractor: `mcp_server/dist/lib/resume/resume-ladder.js:65-90` extend `^_memory:\s*$/u` → `^_(memory|continuity):\s*$/u` [iter-3 #3]
- 1 yaml.load reader: `scripts/validation/continuity-freshness.ts:62-77` — `'_memory' in parsed` → `parsed._continuity ?? parsed._memory?.continuity` with telemetry [iter-3 #2]
- NEW shared-constants module: `mcp_server/lib/parsing/continuity-anchor-constants.ts` exporting `LEGACY_CONTINUITY_ANCHOR_ID = '_memory.continuity'` and `CONTINUITY_ANCHOR_ID = '_continuity'` (matches `MEMORY_LINEAGE_TABLE` / `LEGACY_MEMORY_LINEAGE_TABLE` precedent)
- NEW telemetry channel: `mcp_server/lib/telemetry/legacy-memory-name-telemetry.ts` — single `LegacyMemoryNameTelemetry` event channel
- NEW regression test: dual-fixture (`legacy.md` with `_memory:`, `new.md` with `_continuity:`) — assert identical resume-ladder output
- **NOT in scope**: tool/handler/command renames; templates; synced-triad; cognitive; SQL tables; the 1,916 in-corpus files
- **Rollback**: single revert; no external surface touched
- **Dependencies**: NONE — foundation

**PR2: New tool/command names + handler renames + scripts/dist rename** (scope verb: "activate new vocabulary on user-facing surface")
- 21 MCP tool schema renames in `mcp_server/tool-schemas.ts:47-542` [iter-1 #2]
- 17 handler file renames `memory-*.ts` → `continuity-*.ts` (search/context/save/index-scan/match-triggers/stats/list/health/delete/validate/update/bulk-delete/drift-why/quick-search/causal-link/causal-stats/causal-unlink)
- 4 slash command renames: `.opencode/command/memory/{save,search,learn,manage}.md` → `.opencode/command/continuity/`
- Folder renames: `references/memory/` → `references/continuity/`; `scripts/dist/memory/` → `scripts/dist/continuity/`
- Tier-stratified deprecation alias activation: T1 (4 perm), T2 (4 × 2-rel), T3 (13 × 1-rel) [iter-2 #8]
- **NOT in scope**: parser, templates, glossary, callouts, ladder, synced-triad, cognitive, configs (alias-neutral per iter-2 #2), SQL
- **Rollback**: revert PR2 only; PR1 parser-fallback stays. Sequence: PR3 → PR2 if both must roll back
- **Dependencies**: PR1 (shared constants + telemetry channel + parser)

**PR3: Template + glossary scaffolding + Anthropic callouts** (scope verb: "lock new vocabulary in templates and contract docs; ship disambiguation layer")
- 9 Level-3 template `_memory:` → `_continuity:` rewrites: `templates/level_3/{spec,plan,tasks,checklist,decision-record,implementation-summary,README}.md` + `templates/handover.md`, `templates/changelog/README.md` [iter-1 #4, iter-3 #1]
- NEW `references/glossary.md` (greenfield 6-section vocabulary contract):
  - §0 PREAMBLE: defensive Anthropic disambiguation callout — must mention BOTH Anthropic Claude Memory AND MCP reference `memory` server [iter-4 #4, iter-5 #3]
  - §1 L1 Storage: documents `memory_index`, `memory_fts`, etc. as legacy infrastructure terms exempt from rename
  - §2 L2 Spec-doc markdown: prose term "spec docs"
  - §3 L3 Generated metadata: documents `_continuity:` + parser-fallback for `_memory:` legacy + mixed-mode warning [R3]
  - §4 L4 Recovery surfaces: documents canonical ladder `handover.md → _continuity → spec docs`
  - §5 L5 Retrieval pipeline + 21 tools: 21 `continuity_*` names + tier-stratified `memory_*` aliases
  - §6 L6 Constitutional/cognitive carve-out: ~12 KEEP loanwords + ~5 CONDITIONAL identifiers BY NAME with cross-link to L1 [iter-6 R5]
  - Cursor footnote citing precedent for optional future per-layer split [iter-5 #4]
- NEW `scripts/validation/glossary-drift-lint.ts`: regex scan flagging `memory_*` where should be `continuity_*`; severity warn (existing) / fail (new); special rule detects `memory_id` outside `cognitive/` AND `lib/storage/`; registered in `validator-registry.json`
- 3-surface Anthropic disambiguation callouts: (a) BRIEF in top skill README §1; (b) BALANCED in mcp_server README §1 (mentions BOTH); (c) DEFENSIVE in glossary §0 PREAMBLE
- 5-file ladder-phrase rewrite: `templates/{README.md:82, core/README.md:31, level_3/README.md:120, handover.md:127, changelog/README.md:27}` (+ optional `debug-delegation.md:127`)
- NEW `npm run validate:continuity-frontmatter-mixed-mode` script — warns on mixed `_memory:` and `_continuity:` within a single spec folder [R3]
- **NOT in scope**: parser; tool/handler/command renames; synced-triad; cognitive; FSRS constants; cognitive-science literature terms; the 1,916 in-corpus files
- **Rollback**: PR3 reverts independently; PR1 fallback handles either key
- **Dependencies**: PR2 (21 new tool names exist + tier matrix shipped); transitively PR1

**PR4: Synced top-doc triad + cognitive doc-string clarifications** (scope verb: "update operator-facing rules layer; clarify cognitive doc-strings without renaming code")
- Coordinated synced-triad edit at exact lines: `CLAUDE.md:141,164,170` (same-repo symlink to AGENTS.md), `AGENTS.md:141,164,170`, `AGENTS_Barter.md:181,213,219` (cross-repo symlink), `AGENTS_example_fs_enterprises.md:160,193,199` [iter-2 #3]
- All 4 docs reference 4 T1 gateway tools + `memory_index_scan` in MEMORY SAVE RULE
- NEW pre-commit hook `scripts/git/triad-parity-check.sh` — fails if `AGENTS.md` modified without sibling docs co-modified [iter-6 R4]
- ~10 cognitive JSDoc edits (code symbols KEEP):
  - `cognitive/fsrs-scheduler.ts:187,318,342,343,448` — JSDoc "Memory context_type" → "Continuity row context_type"; "for a new memory" → "for a new continuity row"
  - `cognitive/prediction-error-gate.ts` — JSDoc → "continuity row"
  - `cognitive/temporal-contiguity.ts` — log strings → "continuity row"
  - `cognitive/adaptive-ranking.ts` — JSDoc edits
  - **EXPLICITLY KEEP**: `working-memory.ts`, `co-activation.ts`, all FSRS constants, all literature terminology
- CONDITIONAL ~5 identifiers DEFAULT KEEP per glossary §6: `memory_id` FK column, `getSessionMemories`, parameter `memory` in attention-decay/tier-classifier — locked to L1=NO-ACTION
- **NOT in scope**: parser; tool/handler/command renames; templates; glossary content; Anthropic callouts in synced-triad; cognitive code-symbol renames; FSRS constants; SQL; configs
- **Rollback**: independent; cross-repo coordination required for `AGENTS_Barter.md` (BOTH repos must revert)
- **Dependencies**: PR3 (glossary §5 documents tools cited in triad; glossary §1 defines "continuity row"); transitively PR1+PR2

### Deliverable 2 — Cross-PR Dependency Graph + Rollback Matrix

```
PR1 (parser + telemetry foundation)
 └── consumed by ──> PR2 (tool/command/handler renames + alias activation)
                      └── consumed by ──> PR3 (templates + glossary + callouts)
                                            └── consumed by ──> PR4 (triad + cognitive doc-strings)
```

**Hard dependency edges**:

| Edge | Why hard | What breaks if violated |
|---|---|---|
| **PR2 ← PR1** | 17 renamed handlers consume `CONTINUITY_ANCHOR_ID` from PR1's shared module; T1 aliases fire telemetry registered by PR1 | 17 handlers have duplicated literal constants; alias handlers reference undefined telemetry |
| **PR3 ← PR2** | Glossary §5 documents 21 NEW names; lint flags `memory_*` where should be `continuity_*`; callout (b) cites new tools | Glossary documents non-existent tools; lint false positives; callout cites missing tools |
| **PR4 ← PR3** | Triad cites tools documented in glossary §5; cognitive doc-strings use "continuity row" defined in glossary §1; pre-commit hook leans on glossary-drift-lint | Triad cites undocumented term; undefined concept; hook has nothing to validate |
| **PR4 ← PR2** (transitive) | Triad cites 5 tool NAMES that exist as T1 aliases | Triad cites non-existent tool names |

**Rollback Matrix** (revert PR → forward state stays valid?):

| Revert | Forward state | Valid? | Action |
|---|---|---|---|
| PR1 only | NEVER — cascades to PR2/3/4 | NO | Revert PR4→PR3→PR2→PR1 in order, or patch forward |
| PR2 only (PR1 stays) | parser-fallback works; codebase exposes only `memory_*` | YES | Revert PR4→PR3→PR2 if all shipped |
| PR3 only (PR1+PR2 stay) | tools live; templates revert to `_memory:`; fallback handles either key | YES | Revert PR4 first if shipped |
| PR4 only (PR1+PR2+PR3 stay) | terminal layer revert; lint flags triad backslide warn-level | YES | Cross-repo: revert `AGENTS_Barter.md` in BOTH repos |
| PR3+PR4 | back to "PR2 done" | YES | Sequence: PR4 then PR3 |
| PR2+PR3+PR4 | back to "PR1 done" | YES | Sequence: PR4→PR3→PR2 |
| All four | pre-rename baseline | YES | Sequence: PR4→PR3→PR2→PR1 |

**Atomicity constraints**:
- **R1 (parser atomicity)**: All 6 parser sites + 1 yaml site MUST land in PR1 atomically. Reviewer checklist: all 6 + new constants module + new telemetry channel + new test fixture must be present.
- **R2 (T1 telemetry sequencing)**: Aliases + telemetry + new names ship in PR2 (not split). Reviewer verifies all 4 T1 aliases route correctly AND emit telemetry on first call.
- **R4 (cross-repo symlink)**: PR4 description MUST list all 4 doc paths with note "AGENTS_Barter.md is cross-repo symlink — commits in BOTH repos." Pre-commit hook prevents future drift.

## Ruled Out

- **Parallel PR landing** — linear chain has no parallelism opportunities; each PR depends on the prior.
- **Splitting PR1's 6 parser sites across multiple PRs** — R1 atomicity violation.
- **Shipping new tool names in PR2 without telemetry** — R2 sequencing violation.
- **Editing `AGENTS_Barter.md` in this repo only** — R4 cross-repo symlink violation.

## Dead Ends

None — this iteration produced clean structural insight.

## Sources Consulted

- iter-1 findings 1-7
- iter-2 findings 1-9
- iter-3 findings 1-8
- iter-4 findings 1-9
- iter-5 findings 1-9
- iter-6 contradiction matrix + dependency table + risk register
- MEMORY.md AGENTS.md sync rule

## Assessment

- **New information ratio**: 0.20 (synthesis-only; +0.10 simplicity bonus for resolving R1+R2+R4 to specific PRs)
- **Questions addressed**: implementation sequencing (post-convergence polish; not strategy.md key questions)
- **Questions answered**: implementation-sequencing concern from iter-6 row L5 closed (telemetry co-ships in PR2)

## Reflection

- **What worked**: Treating PR sequencing as "scope verbs" rather than "scope file lists" produced cleaner PR boundaries. Each PR has a single coherent verb of work.
- **What did not work**: Initially tempted to split PR2 into separate tool-rename + alias-activation PRs; rejected because of R2 atomicity.
- **What I'd do differently**: For iter-8, draft actual prose for glossary §0 PREAMBLE + glossary §6 cognitive carve-out (the two most-content-heavy sections) so PR3 author has prose to copy-paste.

## Recommended Next Focus

**Iter-8 — Glossary content draft preview.** Draft actual prose for `references/glossary.md` §0 PREAMBLE (Anthropic + MCP `memory` server callout) and §6 (L6 cognitive carve-out with 5 conditional identifiers BY NAME + L1 cross-link). PR3 author can copy-paste. Iter-9 reserved for edge-case enumeration; iter-10 for final synthesis prep (research.md outline + handover note).
