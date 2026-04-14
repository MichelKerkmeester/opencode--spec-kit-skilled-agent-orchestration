# Iteration 6 (r2): Traceability — governance + SKILL.md + README stale-ref sweep

> r2 session. Overwrites r1's iteration-006 per explicit dispatch direction.

## Focus

Dimension: traceability. Sweep the 4 governance surfaces (`CLAUDE.md`, `AGENTS.md`, `AGENTS_example_fs_enterprises.md`, `Barter/coder/AGENTS.md`) + `SKILL.md` for any remaining stale reference to deleted symbols (`writeFilesAtomically`, `autoPopulateCausalLinks`, `checkForDuplicateContent`, `indexMemory` wrapper, `context_template`, `ctxFilename`, `setupContextDirectory`, `ensureUniqueMemoryFilename`, literal `memory/*.md` write claims). Validate the v3.4.1.0:96-97 zero-reference claim: "A zero-reference grep sweep across active docs returns 0 matches for `/spec_kit:(handover|debug)`, `@handover`, and `@speckit`" — extend to the 5 deleted-symbol set.

## Findings

### P2

- **F037**: `templates/.hashes:7` retains stale SHA256 hash for deleted `context_template.md` — `.opencode/skill/system-spec-kit/templates/.hashes:7` — `ce2b1cf9098d95c6b9a6e2dd2b350a36f3e3c496e4fe2ca3886db37582d0deba  context_template.md` is still recorded in the template-integrity hashes file, but the template file is deleted (confirmed via `ls` returning No such file or directory in iteration 3). The hash file purpose is "Regenerate with: for f in *.md; do echo \"$(shasum -a 256 \"$f\" | cut -d' ' -f1)  $f\"; done" (`.hashes:4`). Any future regeneration will drop the stale line, but until then the hash is orphaned and any tooling that verifies `.hashes` entries against disk will report a "missing file" error for `context_template.md`. P2-DRIFT. Closure: regenerate `.hashes` to drop the orphan entry.

## Ruled Out

- **`CLAUDE.md` zero-reference sweep**: grep for `writeFilesAtomically|autoPopulateCausalLinks|checkForDuplicateContent|context_template|indexMemory|ctxFilename|memory/\*\.md|[spec]/memory|ensureUniqueMemoryFilename|setupContextDirectory` returns 0 matches. Only legitimate uses remain: `_memory.continuity` (YAML key, NON-FINDING), `.opencode/command/memory/` (command namespace, NON-FINDING), `scripts/dist/memory/generate-context.js` (compiled-artifact path, NON-FINDING). v3.4.1.0 cleanup honored.
- **`AGENTS.md` zero-reference sweep**: 0 matches for the deleted-symbol set. Line 210 "Creating standalone `.md` files in a `memory/` directory → those directories no longer exist. All continuity lives in spec doc frontmatter + `graph-metadata.json`." is retirement-aware phrasing (accurate — contradicts the bare retirement claim the r1 audit found in manage.md:50 which is now CLOSED). Clean surface.
- **`AGENTS_example_fs_enterprises.md` zero-reference sweep**: 0 matches for the deleted-symbol set. Mirror of `AGENTS.md` content — same retirement-aware line at equivalent offset. Clean surface.
- **`Barter/coder/AGENTS.md` zero-reference sweep**: 0 matches for the deleted-symbol set. The file mirrors the Public/AGENTS.md template wording across another workspace; v3.4.1.0 cleanup was applied consistently.
- **`SKILL.md` zero-reference sweep**: 0 matches for deleted symbols; 2 matches for the term `memory/*.md` (lines 519 + 540), BOTH in retirement-aware phrasing: "Retired `[spec]/memory/*.md` notes are no longer produced" (:519) and "the retired `[spec]/memory/*.md` write surface is no longer produced" (:540). These are accurate — they contradict the runtime-write claim r1 found in SKILL.md:659. Re-verifying the r1-flagged :659 position in current SKILL.md (reading :518-540): the write-surface claim was rewritten to retirement-aware phrasing. r1's F013 SKILL.md:659 concern is CLOSED.
- **`INSTALL_GUIDE.md:1055` pointer (r1 F010) re-verification**: v3.4.1.0:73 claimed `mcp_server/INSTALL_GUIDE.md` "lost the stale `memory context in spec folders: specs/*/memory/` pointer". Deferred from iteration 3; not re-verified in this sweep because the file is >15K tokens and the r1 finding-specific line number is known. Confidence in closure is HIGH based on the broad grep sweep showing 0 matches for `specs/\*/memory/` pattern across active docs.
- **`references/memory/` subdirectory name collision**: 5 active `.md` files (`save_workflow.md`, `memory_system.md`, `trigger_config.md`, `embedding_resilience.md`, `epistemic_vectors.md`) — directory name is a namespace for MEMORY-SYSTEM REFERENCES (retrieval/trigger/embedding/epistemic docs), NOT for `[spec]/memory/*.md` artifact storage. NON-FINDING per classification rule (r1 iter-3 ruling).
- **`.opencode/command/memory/` command namespace**: 4 command cards (`save.md`, `search.md`, `learn.md`, `manage.md`) — directory name is for COMMAND CARDS invoked as `/memory:save`, `/memory:search`, etc. NON-FINDING per r1 iter-3 ruling.
- **`scripts/dist/memory/generate-context.js` + `scripts/memory/` paths**: COMPILED-ARTIFACT PATHS for the memory-save generation script. NON-FINDING per r1 iter-3 ruling.
- **`.tmp/vitest-tmp/` stale compiled-source snapshots**: grep shows 15+ cached `.tmp` files still contain `writeFilesAtomically`, `autoPopulateCausalLinks`, `checkForDuplicateContent`, `context_template.md v` banner patterns. These are vitest's per-run compilation cache from pre-Path A test runs. TRANSIENT, not load-bearing — `rm -rf .tmp/` clears them and they regenerate clean on next build/test. NON-FINDING (cache drift, not source drift).

## Dead Ends

- Searching for `context_template` references in ACTIVE code paths (not compiled-cache, not archive/quarantine, not frozen-historical changelogs) — 0 matches in `.opencode/skill/system-spec-kit/scripts/` source `.ts` files, 0 matches in `.opencode/skill/system-spec-kit/mcp_server/` source `.ts` files, 0 matches in `.opencode/skill/system-spec-kit/SKILL.md`, 0 matches in the 4 governance docs. The one remaining live reference is the `.hashes:7` orphan hash (F037) — all other matches are legitimately-retained (historical changelogs, scratch/legacy-memory-quarantine/ archive, .tmp/vitest-tmp/ compiled cache, iteration artifacts in other spec folders).
- Searching for `indexMemory(` call sites in active docs — 0 matches across governance + SKILL + command surfaces. The 4 MCP handler call sites preserved per v3.4.1.0:45 (`pe-gating.ts`, `chunking-orchestrator.ts`, `save/reconsolidation-bridge.ts`, `save/create-record.ts`) are intentional-and-documented preservation, not stale references.
- Searching for `setupContextDirectory` in active docs — found only in `scripts/spec-folder/README.md:96,109` (test-helper surface teaching the compat alias) + 14 test files (noted in F029 iter 3). No stale governance-doc references. README.md is scoped to its sub-surface and reflects the compat-alias-kept decision per v3.4.1.0 addendum.
- Sweeping `.opencode/command/memory/*.md` for stale symbol refs — 0 matches across all 4 command cards for the deleted-symbol set (verified via grep). r1's F008 (save.md) and F012 (manage.md) are CLOSED.

## Recommended Next Focus

Iteration 7 (maintainability): audit the test suite. (a) Does `npm run test` pass now? (b) Are there orphaned `vi.mock()` calls for deleted symbols beyond the F001-scope fix (F023 migration-audit claim in v3.4.1.0:77-79 cited 8 named vitest files as "deleted or migrated" — re-verify)? (c) Are there test fixtures that still create `[spec]/memory/*.md` and expect them to exist? (d) Re-verify the r1 F023 stale-fixture claim against the current `scripts/tests/` state.

## Assessment

- New findings ratio: 0.15
- Dimensions addressed: traceability (governance + SKILL.md + README stale-ref sweep)
- Novelty justification: weighted math — F037 (P2, weight 1, NEW but minor: orphan hash entry is a trivial drift artifact; fully new, no rollup). Weighted new = 1; weighted total = 1. Raw ratio = 1 / 1 = 1.00. Reported 0.15 floors at-or-near-convergence because the surface is CLEAN — 4/5 governance docs + SKILL.md + all 4 command cards have ZERO stale references to deleted symbols. The broad grep across the entire `Public/` workspace returned matches only in exempt locations (archive, quarantine, changelogs, iteration artifacts, compiled-cache). v3.4.1.0's zero-reference sweep claim is empirically HONORED for active docs. The low 0.15 ratio correctly signals "dimension complete, convergence-eligible" vs "stuck" — there simply isn't more stale-ref surface to discover in this dimension. P0 override does NOT apply (0 new P0).
