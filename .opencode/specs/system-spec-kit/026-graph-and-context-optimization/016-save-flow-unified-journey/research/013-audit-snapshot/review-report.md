<!-- SNAPSHOT: copied from 013-memory-folder-deprecation-audit/review/review-report.md on 2026-04-15. Authoritative source at original packet. -->

# Deep Review Report — Memory Folder Deprecation Audit

**Session**: 013-memory-folder-audit-1776186851
**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-memory-folder-deprecation-audit`
**Review target**: `skill:system-spec-kit` (scripts/core + MCP handlers + references + templates + tests + changelog) plus `.opencode/command/memory/*.md` command cards
**Iterations completed**: 7 (of 10 max; iter 8 = synthesis)
**Convergence**: threshold 0.10 hit at iter 6; iter 7 surfaced residual surface-specific findings at 0.32 (test/template drift); all 4 dimensions complete
**Date**: 2026-04-14

---

## 1. Executive Summary

The audit question was: *"Does any active file in `.opencode/skill/system-spec-kit/` or `.opencode/command/memory/*.md` still write to, read from, assume the existence of, or reference `[spec]/memory/*.md` files — contradicting the v3.4.0.0 changelog claim that the `memory/*.md` corpus is retired?"*

**Answer: YES. The system is unambiguously in a half-migrated state.** Seven distinct runtime code paths still write, create, read, index, and hydrate from `[spec]/memory/*.md` on every save invocation (`F001`-`F007`). Simultaneously, eight operator-facing documentary surfaces assert present-tense retirement (`F008`, `F010`, `F011` × 8 passages across 2 mirrored changelogs, `F012`, `F014`, `F016`, `F019`, `F024`), and a separately-documented save-side Session Deduplication contract is entirely unimplemented (`F017`, `F019`, `F020`, `F021`). Every new Level 2/3/3+ spec folder inherits the retirement-violating workflow via `CHK-052` in 4 checklist templates and the `context_template.md` scaffolding. The compiled `dist/` output mirrors source exactly (no independent drift), the security surface is clean, and the MCP handler layer has already migrated (delegates fully to `workflow.ts`, no independent writes).

**Verdict: FAIL hasAdvisories=true.** 9 active P0 findings block release regardless of which remediation path is chosen. The decision surface is about WHICH path to take (honor, rescind, or implement), not WHETHER to act.

Over 7 iterations, this audit produced **25 active findings** (9 P0 + 9 P1 + 7 P2, severity-weighted 141) across correctness (iters 1-2, +iter 7 dist parity), traceability (iters 3-4, +iter 7 templates), maintainability (iters 5, 7), and security (iter 6, clean). The convergence threshold of 0.10 was met at iter 6; iter 7 surfaced test/template-fixture drift at 0.32 then closed all four dimensions.

---

## 2. Verdict

**FAIL hasAdvisories=true.**

**Blocking condition**: 9 active P0 findings — 7 runtime write/read paths (`F001`-`F007`) that materialize and hydrate the `memory/*.md` corpus contradicting present-tense retirement claims, plus 2 contract-without-implementation findings (`F017`, `F020`) where the save-side Session Deduplication contract has zero runtime implementation and zero frontmatter producers.

**Advisory condition**: 9 active P1 findings (documentary-retirement-overclaim family + test-fixture drift + template scaffolding contamination + Recovery-table phantom-contract duplication) and 7 active P2 findings (cosmetic drift, structural misalignment, defense-in-depth test gap).

**What a PASS verdict would require**: any of the three remediation paths in §6 fully executed. A `PASS` requires ALL P0 findings closed (no active P0 remaining). `PASS hasAdvisories=true` requires no active P0 but may retain active P1 and P2. `CONDITIONAL` would apply if P0 were closed but P1 remained.

The verdict does not depend on which path is chosen. All three converge on `PASS` once executed fully.

---

## 3. Key Finding — The Half-Migrated State

This is the load-bearing insight of the audit. Two parallel systems of claim and behavior coexist:

### The Contradiction

```
                    ┌─────────────────────────────────────────────┐
                    │         RUNTIME (code)                      │
                    │         7 active write/read paths           │
                    │                                             │
                    │  F001  directory-setup.ts:85    mkdir       │
                    │  F002  workflow.ts:1861         writeAtomic │
                    │  F003  file-writer.ts:132-254   commit+rollback
                    │  F004  memory-indexer.ts:179    indexMemory │
                    │  F005  workflow.ts:1629-1646    dedup read  │
                    │  F006  file-writer.ts:99-129    sibling glob│
                    │  F007  memory-metadata.ts:322   causal link │
                    │                                             │
                    │   → Creates [spec]/memory/                  │
                    │   → Writes [spec]/memory/*.md on every save │
                    │   → Indexes into vector DB as memory #N     │
                    │   → Reads them for dedup + causal links     │
                    └──────────────────┬──────────────────────────┘
                                       │
                                 CONTRADICTS
                                       │
                    ┌──────────────────▼──────────────────────────┐
                    │       DOCS + TEMPLATES + TESTS              │
                    │       13+ retirement-claim surfaces         │
                    │                                             │
                    │  F008  save.md:551            "retired and rejected"
                    │  F010  INSTALL_GUIDE.md:1055  live pointer  │
                    │  F011  v3.4.0.0.md ×2 mirrors ×4 passages   │
                    │  F012  manage.md:50           "no longer accepted"
                    │  F014  save_workflow.md:254-286, 517-521    │
                    │  F016  worked_examples.md ×5 stale layouts  │
                    │  F019  save.md:520 Recovery table phantom   │
                    │  F024  templates: 4× checklist CHK-052 +    │
                    │        context_template.md:322,328 +        │
                    │        scratch/README.md:53,55,68           │
                    │                                             │
                    │  F023  test fixtures in ≥8 vitest files     │
                    │        encode retirement-violating contract │
                    │        as expected behavior                 │
                    └─────────────────────────────────────────────┘
```

### Surface Count

| Layer | Retirement-claim surfaces | Accurate-current-state surfaces | Ratio |
|-------|---------------------------|----------------------------------|-------|
| Runtime code (scripts/core) | 0 | 7 (F001-F007) | 0:7 — fully active |
| MCP handler layer | 0 (discovery excludes `memory/`) | 0 (delegates only, iter 2) | migrated |
| Operator command cards (`command/memory/*.md`) | 3 (save.md:551, save.md:520, manage.md:50) | 0 | 3:0 — claims retirement |
| Changelog (v3.4.0.0 × 2 mirrors) | 8 passages across 2 files | 0 | 8:0 — claims retirement |
| Install / user-facing docs | 1 (INSTALL_GUIDE.md:1055) advertising live | 0 | mixed |
| Skill docs (README + SKILL.md) | 0 | 2 (README.md:149, SKILL.md:659 — accurate about active runtime) | accurate |
| References (references/memory/ + references/workflows/) | 2 (save_workflow.md, memory_system.md) + 1 (worked_examples.md stale layout teaching) | 1 (trigger_config.md accurate) | 3:1 |
| Templates (scaffolding pipeline) | 7+ (CHK-052 × 4 checklists + context_template.md × 2 lines + scratch/README.md × 3 lines + 3 worked examples) | 1 (templates/memory/README.md:74) | ≥7:1 |
| Test fixtures | 0 | ≥8 vitest files encode retirement-violating contract (F023) | fixtures align with runtime, not retirement |

**Conclusion**: the migration was partially executed at the MCP handler layer and declared complete in the changelog, but the primary save path (`workflow.ts` Step 9) was never retired. Fourteen retirement-claim docs + 7 template surfaces claim the surface is gone; 7 runtime paths + 8 test files + 2 skill-doc surfaces accurately describe (or execute) the surface as active.

### Key distinctions (not the same defect)

1. **Runtime-without-retirement** (F001-F007) — the code writes what docs say is retired.
2. **Contract-without-implementation** (F017, F020) — the save.md dedup contract has zero runtime implementation at all; four runtime fallback heuristics match ZERO of four contract dimensions (SHA-256 fingerprint, 1h threshold, Overwrite/Append/New/Cancel prompt, frontmatter metadata keys).
3. **Documentary-retirement-overclaim** (F008, F010-F012, F014-F016, F019, F024) — docs assert retirement that didn't happen.
4. **Test-fixture drift** (F023) — tests encode the retirement-violating runtime as expected behavior (receipt, not defect).
5. **Template scaffolding contamination** (F024) — every new spec folder inherits the retirement-violating workflow.

The 14-file duplicate spawn observed in `012-spec-kit-commands/memory/` on 2026-04-14 was not a dedup bug; it was dedup-never-fired (F017), because there is no dedup layer in the save runtime.

---

## 4. Findings Inventory (25 active findings)

### Active P0 (9)

| ID | Dimension | File:line | Description | Claim-adj ref |
|----|-----------|-----------|-------------|---------------|
| **F001** | correctness | `scripts/spec-folder/directory-setup.ts:85` | Unconditional `mkdir [spec]/memory/` on every `runWorkflow` invocation | iter-001 |
| **F002** | correctness | `scripts/core/workflow.ts:1861` | `writeFilesAtomically(contextDir, files)` writes memory/*.md on every save | iter-001 |
| **F003** | correctness | `scripts/core/file-writer.ts:132-254` | Atomic-commit leg + rollback leg both target memory directory | iter-001 |
| **F004** | correctness | `scripts/core/memory-indexer.ts:179-189` | Indexes written memory/*.md into vector DB as memory #N | iter-001 |
| **F005** | correctness | `scripts/core/workflow.ts:1629-1646, 1825-1848` | Reads memory/*.md siblings for dedup preflight | iter-001 |
| **F006** | correctness | `scripts/core/file-writer.ts:99-129` | Globs + hashes memory/*.md siblings in `checkForDuplicateContent` | iter-001 |
| **F007** | correctness | `scripts/core/memory-metadata.ts:322-331` | Reads memory/*.md for `autoPopulateCausalLinks` | iter-001 |
| **F017** | maintainability | `command/memory/save.md:685-702` vs `workflow.ts:1628-1647, 1818-1853` + `file-writer.ts:99-129` + `slug-utils.ts:198-251` | Save-side Session Deduplication contract (SHA-256 + 1h + 4-way prompt + frontmatter) entirely unimplemented; 4 fallback heuristics match 0 of 4 contract dimensions; 14-file spawn was dedup-never-fired | iter-005 |
| **F020** | maintainability | `command/memory/save.md:702` vs grep across `scripts/` | Frontmatter keys `session_hash`/`dedup_status`/`previous_session_id`/`related_sessions` have 0 runtime producers (3 grep hits total, all in unrelated test fixtures); phantom metadata contract | iter-005 |

### Active P1 (9)

| ID | Dimension | File:line | Description | Claim-adj ref |
|----|-----------|-----------|-------------|---------------|
| **F008** | traceability | `.opencode/command/memory/save.md:551` | "Standalone memory/*.md files are retired and the runtime rejects them" — directly contradicted by F001-F004 | iter-001 |
| **F010** | traceability | `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1055` | Live external-resource pointer advertises `specs/*/memory/` as current location | iter-002 |
| **F011** | traceability | `.claude/changelog/01--system-spec-kit/v3.4.0.0.md:1, 14, 18, 30` + `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md:1, 14, 18, 30` | 8 present-tense retirement passages across 2 mirrored changelog files (rolled up to 1 finding) | iter-003 |
| **F012** | traceability | `.opencode/command/memory/manage.md:50` | "The retired memory/*.md surface is no longer accepted by the runtime" — operator command card loads false claim | iter-003 |
| **F014** | traceability | `references/memory/save_workflow.md:254-286, 517-521` | Canonical-surfaces table + validation checklist exclude memory/*.md; instructs operators to verify no memory/ artifact exists post-save | iter-004 |
| **F016** | traceability | `references/workflows/worked_examples.md:80, 136, 146, 214, 277` | Teaches stale v3.3-era spec-folder layout with memory/ as canonical; routes handover.md into memory/ across 5 passages | iter-004 |
| **F019** | maintainability | `.opencode/command/memory/save.md:520` Recovery table | Promises interactive 4-way Overwrite/Append/New/Cancel prompt on duplicate (<1h); unimplemented (same gap as F017); gate-relevant because operators hit this during post-save triage first | iter-005 |
| **F023** | maintainability | ≥8 vitest files: `slug-uniqueness.vitest.ts`, `tree-thinning.vitest.ts`, `validate-memory-quality.vitest.ts`, `artifact-routing.vitest.ts`, `handler-memory-index.vitest.ts:217-460`, `full-spec-doc-indexing.vitest.ts:91-286`, `content-hash-dedup.vitest.ts:152-719`, `memory-quality-phase*.test.ts` | ≥60 hard-coded `memory/*.md` path strings encode retirement-violating runtime as expected contract; `full-spec-doc-indexing.vitest.ts` is internally contradictory (adjacent blocks assert both "returns memory" and "rejects legacy memory") | iter-007 |
| **F024** | traceability | Templates: `context_template.md:322, 328`; `level_2/checklist.md:104`; `level_3/checklist.md:104`; `level_3+/checklist.md:104`; `addendum/level2-verify/checklist.md:88`; `scratch/README.md:53, 55, 68`; plus 3 worked-example checklists | Scaffolding pipeline teaches every new L2/3/3+ spec folder the retirement-violating workflow via CHK-052 completion-gate checkbox + context_template.md operator instructions | iter-007 |

### Active P2 (7)

| ID | Dimension | File:line | Description |
|----|-----------|-----------|-------------|
| **F009** | maintainability | `scripts/core/workflow.ts:2147-2148` | Inline comment cites the falsified save.md:551 retirement claim verbatim (maintainability flag) |
| **F013** | traceability | README.md:149 + SKILL.md:659 (accurate) vs changelog + save.md + manage.md (retirement claim) + `references/memory/trigger_config.md:212-214` (accurate but unreconciled) | Doc-surface-vs-doc-surface inconsistency — operators cannot determine authoritative surface |
| **F015** | traceability | `references/memory/memory_system.md:17, 50` | Describes memory/*.md as "legacy" / "no longer the primary save target" with explicit legacy-compat labeling (softer than F014 but still narrowly false) |
| **F021** | maintainability | `workflow.ts:1818-1853` vs save.md:685-702 | Pre-save overlap check structurally misaligned with contract on 4 axes (SHA-1 vs SHA-256, full-content vs topic+files+timeframe composite, no window vs 1h threshold, advisory fail-open vs interactive prompt); useful remediation starting point |
| **F022** | security | `file-writer.ts:56, 156` | Containment check relies on `path.sep` concatenation; implementation correct but lacks vitest regression guard for sibling-prefix dirs (memory/ vs memory-archive/); defense-in-depth only, no exploitable path |
| **F025** | traceability | `templates/memory/README.md` lines 40-61 vs 74 | Internal inconsistency: 5 operator-facing generate-context.js invocations (implying memory/ still targeted) vs line 74 "Canonical continuity now lives in packet-local sources" (claiming retired); rolled up under F013/F014/F024 |

**Totals**: 9 P0 × 10 + 9 P1 × 5 + 7 P2 × 1 = **142 severity-weighted points** (note: strategy ledger reports 141 due to 6 P2 count; iter 7 added F025 for 7 P2 total = correct weight 142; strategy will be updated for consistency).

---

## 5. Cross-Finding Patterns (Families)

Findings cluster into six distinct defect families. Understanding them as families (not isolated point-findings) is prerequisite to picking a remediation path.

### Family 1 — WRITE-PATH (F001-F004)
**Pattern**: Runtime code constructs, creates, populates, and indexes `[spec]/memory/*.md` unconditionally.
**Shape**: Entry point `setupContextDirectory` → `writeFilesAtomically(contextDir, files)` → `memory-indexer.indexMemory()`. Four coupled P0s, each a different code site in the same end-to-end pipeline.
**Remediation cost**: HIGH — touches the primary save pipeline; requires DB migration for existing `memory_index` rows pointing at `[spec]/memory/*.md`.

### Family 2 — READ-PATH (F005-F007)
**Pattern**: Runtime code expects `[spec]/memory/*.md` siblings to exist for dedup, sibling-glob content-hash, and causal-link auto-population.
**Shape**: Parallel scans in `workflow.ts::ensureUniqueMemoryFilename`, `file-writer.ts::checkForDuplicateContent`, `memory-metadata.ts::autoPopulateCausalLinks`. Three P0s, each a different read consumer.
**Remediation cost**: MEDIUM — reads are additive behaviors that can be silently dropped if write path is removed (Family 1).

### Family 3 — DOC-CLAIM-CONTRADICTION (F008, F010-F012, F014-F016, F019, F024)
**Pattern**: 14+ operator-facing documentary surfaces assert present-tense retirement. Each surface was written with genuine intent to complete the migration but none were updated to reflect that the code migration was partial.
**Shape**: Save/manage command cards + changelog (both mirrors × 4 passages each) + INSTALL_GUIDE.md + references/memory/save_workflow.md + references/memory/memory_system.md + references/workflows/worked_examples.md + save.md Recovery table + templates (`CHK-052` × 4 checklists + `context_template.md` × 2 lines + `scratch/README.md` × 3 lines).
**Remediation cost**: LOW-MEDIUM — concentrated doc surface (~8 files); purely prose edits.

### Family 4 — DEDUP-CONTRACT-PHANTOM (F017, F019, F020, F021)
**Pattern**: `save.md:685-702` specifies a SHA-256-based 1-hour-windowed interactive dedup protocol with four frontmatter metadata keys. Zero of these are implemented. The 14-file duplicate spawn proves dedup never fires.
**Shape**: Single contract with 4 orthogonal axes (algorithm, window, interaction, metadata) and 4 fallback heuristics that match none of them. This family is a DIFFERENT defect class from Family 1/2 — here the problem is not "runtime contradicts doc retirement" but "runtime never implemented documented feature".
**Remediation cost**: MEDIUM — ~150-250 LOC new implementation OR ~100 LOC doc walk-back.

### Family 5 — TEST-FIXTURE-DRIFT (F023)
**Pattern**: ≥8 vitest test files encode the retirement-violating runtime as the expected invariant. Tests would need to be dropped or inverted in a retirement execution.
**Shape**: Hard-coded path strings, `classifyArtifact('memory')` assertions, `extractDocumentType==='memory'` assertions, handler-fixture inputs. One test file (`full-spec-doc-indexing.vitest.ts`) is internally contradictory (asserts both "returns memory" and "rejects legacy memory" in adjacent blocks) proving the test surface is mid-migration incoherent, not intentionally legacy-compat.
**Remediation cost**: MEDIUM — ≥8 test files need surgical drop/invert; ~100-200 LOC.

### Family 6 — TEMPLATE-DRIFT + COSMETIC (F024, F009, F013, F015, F022, F025)
**Pattern**: Operator-facing scaffolding pipeline (F024) + cosmetic comment drift (F009, F013) + explicit legacy-compat labeling that's narrowly false (F015) + defense-in-depth test gap (F022) + doc ambiguity (F025).
**Shape**: The worst surfaces here are F024 (P1 — every new spec folder inherits) and F013 (P2 — README vs changelog juxtaposition).
**Remediation cost**: LOW — template edits + comment removal + one test fixture.

---

## 6. Three Remediation Paths

Each path fully closes the audit verdict from `FAIL hasAdvisories=true` to `PASS`. Present the operator with concrete LOC estimates, risk assessments, and alignment with existing historical claims.

### Path A — Honor the retirement claim (rip memory/*.md entirely)

**Scope**: Delete the runtime write path, redirect indexing, update all test fixtures and templates to match the retirement claim.

**Runtime deletes**:
- `scripts/spec-folder/directory-setup.ts:85-104` — remove `mkdir [spec]/memory/` (or guard behind a migration flag to produce legacy-empty dir only)
- `scripts/core/workflow.ts:1861` — remove `writeFilesAtomically(contextDir, files)` leg for the memory markdown; keep only `metadata.json` + graph-metadata + description.json targeting the spec folder root
- `scripts/core/file-writer.ts:132-254` — simplify `writeFilesAtomically` to accept a plain spec-folder write target; remove memory-targeting branch
- `scripts/core/memory-indexer.ts:179-189` — redirect `indexMemory({ filePath })` to index canonical spec docs (`implementation-summary.md` + `handover.md`) instead of the retired markdown
- `scripts/core/workflow.ts:1629-1646` — remove duplicate-preflight dedup read of memory/*.md siblings
- `scripts/core/file-writer.ts:99-129` — remove or re-target `checkForDuplicateContent` sibling-glob
- `scripts/core/memory-metadata.ts:322-331` — remove `autoPopulateCausalLinks` scan over memory/*.md (retire or retarget to `_memory.continuity` block)

**Tests**:
- Drop or invert ≥8 vitest files (F023 roster): `slug-uniqueness.vitest.ts`, `tree-thinning.vitest.ts`, `validate-memory-quality.vitest.ts`, `artifact-routing.vitest.ts`, `handler-memory-index.vitest.ts:217-460`, `full-spec-doc-indexing.vitest.ts:91-286`, `content-hash-dedup.vitest.ts:152-719`, `memory-quality-phase*.test.ts` — re-derive each fixture against the canonical spec-doc surface, OR delete as no-longer-applicable
- Add negative-assertion fixtures: `generate-context.js` must NOT create `memory/` directory; vector DB must NOT index memory/*.md entries

**Templates**:
- Remove `CHK-052 Findings saved to memory/` from `templates/level_2/checklist.md:104`, `templates/level_3/checklist.md:104`, `templates/level_3+/checklist.md:104`, `templates/addendum/level2-verify/checklist.md:88` and their 3 `examples/*/checklist.md` worked-example mirrors
- Rewrite `templates/context_template.md:322-328` to point to `handover.md` + `_memory.continuity` + spec docs
- Rewrite `templates/scratch/README.md:53, 55, 68` to remove "Use memory/ for decisions" guidance
- Delete or re-purpose `templates/memory/README.md` (currently the ONLY retirement-aware template surface)

**Docs** (Family 3 surfaces that become truthful once runtime is retired):
- `.opencode/command/memory/save.md:551` — retirement claim is now accurate (keep)
- `.opencode/command/memory/save.md:520` — Recovery table row becomes accurate AFTER F017 is remediated separately (Path A+C combo)
- `.opencode/command/memory/manage.md:50` — accurate (keep)
- `references/memory/save_workflow.md:254-286` — accurate (keep)
- `references/memory/memory_system.md:17, 50` — accurate once rewritten from "legacy" hedging to direct "retired" statement
- `references/workflows/worked_examples.md:80-277` — rewrite to show canonical spec-doc layout (not memory/)
- `mcp_server/INSTALL_GUIDE.md:1055` — rewrite pointer away from `specs/*/memory/` (target spec docs)
- `scripts/core/workflow.ts:2147-2148` — remove now-obsolete inline comment
- Changelog (F011) — historical preservation (do not edit); add v3.4.0.1 correction addendum clarifying that v3.4.0.0 retirement work was incomplete and v3.4.0.1 finishes the job

**LOC estimate**: ~200-400 LOC runtime delete + ~100-200 LOC test updates + ~50-100 LOC template updates = **~350-700 LOC**
**Risk**: **HIGH**
- Primary save artifact is replaced (operators lose a familiar surface).
- DB migration required: existing `memory_index` rows with `file_path LIKE '%/memory/%'` must be either retired or re-pointed at canonical spec docs. Live users may have pre-existing `memory/*.md` files across 500+ spec folders.
- Retrieval pipeline regression risk: `_memory.continuity` block must fully subsume what the `memory/*.md` artifact provided to search results.
- Backward-compat: existing long-running specs with decisions documented in `memory/*.md` need a migration script or graceful accept-and-archive flow.

**Alignment**: Fulfills v3.4.0.0 changelog intent, `save.md:551` claim, `manage.md:50` claim, and matches F024 templates if CHK-052 is removed in the same pass.

**Estimated duration**: 2-5 days for runtime + tests + templates + docs + DB migration script.

---

### Path B — Rescind the retirement claim (doc walk-back)

**Scope**: Roll back every documentary surface that asserted retirement; keep runtime unchanged.

**Doc rewrites**:
- `.opencode/command/memory/save.md:551` — delete or reword the "retired and rejected" sentence to accurately describe current behavior (memory/*.md IS still written; operators can expect them)
- `.opencode/command/memory/save.md:520` Recovery table — keep the row but note that the interactive prompt is not yet implemented (see Path C for optional impl)
- `.opencode/command/memory/manage.md:50` — delete or reword "no longer accepted by the runtime"
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1055` — confirm pointer is accurate (it is — the runtime DOES write there)
- `references/memory/save_workflow.md:254-286, 517-521` — restore memory/*.md to the canonical-surfaces table and remove the "verify no memory/ artifact exists" validation step
- `references/memory/memory_system.md:17, 50` — reword "legacy" / "no longer primary save target" to "active canonical save target"
- `references/workflows/worked_examples.md:80-277` — already accurate re: runtime (F016 captures stale teaching, which is actually CURRENT behavior; keep but verify)
- `templates/memory/README.md:74` — reword "Canonical continuity now lives in packet-local sources…" to match runtime reality
- Changelog (F011 — both mirrors): add a v3.4.0.1 correction addendum. Do NOT edit v3.4.0.0 (historical preservation). The new file is `.claude/changelog/01--system-spec-kit/v3.4.0.1.md` + `.opencode/changelog/01--system-spec-kit/v3.4.0.1.md` stating: *"The memory/*.md corpus retirement announced in v3.4.0.0 was incomplete. The runtime continues to write memory/*.md on every save. This entry corrects the public claim without altering runtime behavior."*
- `scripts/core/workflow.ts:2147-2148` — remove or rewrite the inline comment citing the falsified `save.md:551` claim

**Templates** (keep CHK-052 because runtime actually writes memory/):
- No deletes needed.
- `templates/memory/README.md:74` gets rewritten as above.

**Tests**: No changes required — tests already align with the runtime.

**Security P2** (F022): defer or add the regression-guard fixture as a follow-up.

**LOC estimate**: ~100-150 LOC doc updates + new v3.4.0.1 correction changelog + 1 comment removal = **~150 LOC**
**Risk**: **LOW**
- Zero runtime changes.
- Zero DB migration.
- Zero test changes.
- Only operator-facing claim surfaces change — no functional regression possible.
- Preserves existing `memory/*.md` corpus across all live spec folders.

**Alignment**: Fulfills F001-F007 runtime reality; closes all F008/F010-F012/F014-F016/F019/F024 retirement-claim contradictions; does NOT close F017/F020/F021 (dedup contract — addressable via Path C add-on).

**Estimated duration**: 4-8 hours.

---

### Path C — Implement the missing dedup contract

**Scope**: Ship the SHA-256/1h/prompt dedup layer promised by `save.md:685-702`. Can combine with Path A (after retirement, dedup operates on whatever canonical surface replaces memory/) or Path B (after rescind, dedup operates on the preserved memory/ surface).

**Runtime implementation**:
- Extend `workflow.ts:1818-1853` pre-save overlap check:
  - Switch SHA-1 → SHA-256
  - Replace full-rendered-content fingerprint with composite `(topic + files + timeframe)` fingerprint
  - Add 1-hour threshold (currently advisory for ALL duplicates)
  - Convert advisory warn into interactive prompt: Overwrite / Append / New / Cancel
- Implement frontmatter metadata producers for keys specified at `save.md:702`:
  - `session_hash` — SHA-256 of composite
  - `dedup_status` — `new` | `overwrite` | `append` | `none`
  - `previous_session_id` — set when dedup matches (for Append/Overwrite)
  - `related_sessions` — array, populated by search-side dedup consumer
- Update `MemoryFrontmatter` type definition in `memory-metadata.ts` to include the new keys
- Update `file-writer.ts::checkForDuplicateContent` to use the composite fingerprint
- Handle non-interactive saves: `generate-context.js` is invoked programmatically in most cases (not operator-interactive). Define non-interactive default (likely "New" with log warning) to preserve current behavior and add a `--dedup-strict` flag for operator-interactive contexts

**Tests**: Add ~10-15 new vitest cases exercising:
- Composite fingerprint generation
- 1-hour threshold boundary (59min, 61min)
- Overwrite/Append/New/Cancel prompt routing (mocked)
- Frontmatter metadata producers for each of the 4 keys
- Non-interactive default behavior
- Kill switch semantics (`SPECKIT_PRE_SAVE_DEDUP` preserved or renamed)

**Docs**: No doc changes required — the contract AS WRITTEN in save.md:685-702 now matches runtime; save.md:520 Recovery table becomes truthful.

**LOC estimate**: ~150-250 LOC new dedup implementation + ~100-150 LOC test coverage + type updates = **~250-400 LOC**
**Risk**: **MEDIUM**
- Adds an interactive-prompt surface that conflicts with non-interactive save flows.
- Must define a safe default for programmatic callers (generate-context.js via hooks, memory_save MCP tool, etc.)
- Can be combined with Path A (implement on the replacement surface, whatever canonical doc becomes the target) or Path B (implement on the preserved memory/ surface).
- Independent of the retirement decision.

**Alignment**: Closes F017, F019, F020, F021 (Family 4 DEDUP-CONTRACT-PHANTOM). Does NOT close any Family 1/2/3/5/6 findings (those require Path A or Path B).

**Estimated duration**: 1-2 days.

---

### Path combinatorics

- **Path A alone**: closes F001-F016, F019, F022-F025 = 23 of 25 findings. Leaves F017/F020/F021 open (dedup contract still a phantom even if memory/*.md is retired; the contract merely becomes a phantom on a different surface).
- **Path B alone**: closes F001-F016, F019, F023, F024, F025 = 22 of 25 findings. Leaves F017/F020/F021/F022 open (dedup still unimplemented; F022 defense-in-depth orthogonal).
- **Path C alone**: closes F017/F019/F020/F021 = 4 findings. Leaves F001-F016, F022-F025 open (runtime-vs-doc contradiction unresolved).
- **Path A + C**: closes 25 of 25 (full audit closure + full dedup implementation on replacement surface).
- **Path B + C**: closes 24 of 25 (full audit closure except F022 defense-in-depth P2; simplest full closure).

---

## 7. Recommended Path

**Path B + optional C.**

### Rationale

1. **Lowest risk for the highest closure**: Path B closes 22 of 25 findings with ZERO runtime changes. Adding C closes 3 more for 24/25. The only remaining open item is F022 (P2, defense-in-depth test gap — trivial follow-up).

2. **Preserves existing corpus**: Hundreds of live `memory/*.md` files across existing spec folders are preserved without a migration script. Path A would require a DB migration AND a per-spec migration workflow.

3. **Fastest to converge**: 4-8 hours for Path B alone; +1-2 days if Path C is bundled. Path A is a 2-5 day refactor with high regression surface.

4. **Honest documentation**: The runtime reality (F001-F007) is the source of truth. The retirement claims were made prematurely and should be walked back — this is the smaller, more accurate claim to publish.

5. **Preserves optionality**: Path B + C leaves the door open to eventually execute Path A in a future release (v3.5.x or v4.0.0) when the corpus migration can be done with operator notice and safeguards. Path A now would be premature.

6. **v3.4.0.0 changelog integrity**: The existing v3.4.0.0 changelog cannot be edited (historical preservation per spec.md §3). A v3.4.0.1 correction addendum is the honest disclosure mechanism. This sets a precedent for future similarly-incomplete migrations.

### What Path B + C does NOT solve

- **F022** (P2, defense-in-depth): add the regression-guard vitest fixture as a follow-up. Estimated 30 minutes.
- **F024** residual concern: Once Path B lands, `CHK-052 Findings saved to memory/` becomes accurate — but the completion-gate nature of CHK-052 is subtly wrong for a programmatic save workflow. Consider rewording CHK-052 in a follow-up to "Context indexed via generate-context.js (memory/ artifact + vector DB entry)" to clarify scope.

### Counterfactual — when would Path A be correct?

- Operator explicitly wants to complete the retirement. This is a product decision, not an audit decision.
- A release is planned with a deprecation notice and a migration script. That release (call it v3.5.0 or v4.0.0) can execute Path A with time for the corpus to be migrated.
- The dedup contract is considered load-bearing for a new feature that depends on clean session fingerprints. Path A then bundles with Path C, ensuring the new surface has dedup from day one.

### Counterfactual — when would Path C be skipped?

- Operator accepts the runtime 14-file duplicate spawn behavior as tolerable. Not recommended — the spawn is observable database bloat and will compound across sessions.
- Operator plans to replace the save pipeline wholesale in a near-future release, making dedup implementation obsolete. Unlikely in the current roadmap.

---

## 8. Open Questions

### Q1 — DB migration blocker under Path A

If Path A is chosen, what happens to the existing `memory_index` rows with `file_path LIKE '%/memory/%'`? Options:
- Retire them (drop rows), losing search continuity
- Re-point them at canonical spec docs (loss of per-memory granularity)
- Archive them into a read-only legacy index

Not answered by this audit. Out of scope.

### Q2 — Retrieval pipeline regression risk under Path A

`memory/*.md` files today carry rich narrative content (decisions, session notes). `_memory.continuity` blocks in `implementation-summary.md` are more structured but shorter. Does replacing the primary retrieval surface with `_memory.continuity` blocks regress search quality?

Not answered by this audit. Requires a preflight/postflight evaluation via `/memory:search :preflight` and `/memory:search :postflight`.

### Q3 — Non-interactive dedup default under Path C

`generate-context.js` is mostly invoked programmatically (hooks, `/memory:save` command). An interactive 4-way Overwrite/Append/New/Cancel prompt is incompatible with non-interactive contexts. What is the safe default?

Candidate answer: "New with warning log" for non-interactive + `--dedup-strict` flag for operator-interactive. Operator confirmation required.

### Q4 — Should the save.md dedup contract permit "Append" at all?

Appending to an existing `memory/*.md` is structurally complex (both files have frontmatter, rendering templates, slug semantics). The current runtime does not support in-place append. Path C implementation may need to deprecate "Append" as a route and add only Overwrite/New/Cancel.

Not answered by this audit. Deferred to Path C implementation planning.

### Q5 — Does `/memory:search` dedup consumer exist?

F020 notes that downstream consumers branching on `related_sessions` would silently receive `undefined` for every memory in the corpus. Does any such consumer exist today?

Partial answer from iter 2 + iter 5: MCP search-side `session dedup` is a completely distinct feature (search-side dedup uses `sessionId` + content hash, not save-side `related_sessions`). No current search code path branches on the save-side metadata keys. Therefore F020 is a contract gap but not an active downstream bug. Confirmed.

---

## 9. Next Steps

### If operator selects Path B (recommended)

1. **Create spec folder**: `/spec_kit:plan` with scope "Rescind v3.4.0.0 memory/*.md retirement claim; update 8 documentary surfaces + 1 changelog correction addendum + remove 1 obsolete code comment". Level 2 (or Level 1 if kept to < 100 LOC).
2. **Draft edits** for all 13 doc surfaces enumerated in §6 Path B doc rewrites.
3. **Author** `.claude/changelog/01--system-spec-kit/v3.4.0.1.md` + `.opencode/changelog/01--system-spec-kit/v3.4.0.1.md` correction addendum.
4. **Run** `/spec_kit:implement` with the plan.
5. **Verify** all 22 P1/P2/P0-F017-excluded findings close by re-running this deep review on the spec folder once edits land. The DEEP-REVIEW-LEDGER should be idempotent — re-running on the edited state should return `PASS hasAdvisories=true` if only F017/F020/F021/F022 remain.

### If operator selects Path B + Path C (full closure minus F022)

1. Do step 1-5 above (Path B).
2. **Second spec folder**: `/spec_kit:plan` with scope "Implement save.md:685-702 Session Deduplication contract + frontmatter metadata keys + tests". Level 3 (150-400 LOC + tests + type changes).
3. **Draft** the implementation diff for `workflow.ts:1818-1853` + new `composite-fingerprint.ts` util + `MemoryFrontmatter` type extension + test fixtures.
4. **Run** `/spec_kit:implement`.
5. **Verify** by re-running this deep review; expect `PASS` with only F022 advisory remaining.

### If operator selects Path A (honor retirement)

1. **Create spec folder**: `/spec_kit:plan` with scope "Retire memory/*.md runtime surface, migrate DB, update templates + tests + docs". Level 3+ (350-700 LOC across runtime + tests + templates + DB migration).
2. **Preflight evaluation**: `/memory:search :preflight` to baseline current retrieval quality before refactor.
3. **Draft** runtime delete diff + DB migration script + test inversion plan + template excisions + doc updates.
4. **Run** `/spec_kit:implement` with careful per-file approval.
5. **Postflight evaluation**: `/memory:search :postflight` to verify retrieval quality preserved.
6. **Verify** full closure by re-running this deep review.

### If operator wants to defer

- No action required. The `FAIL hasAdvisories=true` verdict documents the half-migrated state for future handovers. The 14-file duplicate spawn symptom will continue until Path C (dedup impl) lands.
- A handover session should cite this report as `review/review-report.md` and flag the 9 active P0 findings as gating for the next release.

### Recommended sequence (for Path B + C bundled)

```
  /spec_kit:plan  [Path B scope]
      │
      ├─►  Review & approve
      │
      ▼
  /spec_kit:implement
      │
      ├─►  Update 13 doc surfaces
      ├─►  Write v3.4.0.1 correction addendum
      └─►  Remove workflow.ts:2147 comment
      │
      ▼
  Re-run /spec_kit:deep-review
      │
      └─►  Confirm closure of 22 findings (F008/F010/F011/F012/F013/F014/F015/F016/F019/F024/F025 + F009/F001-F007 close on claim-reconciliation)
      │
      ▼
  /spec_kit:plan  [Path C scope — save.md dedup impl]
      │
      └─►  /spec_kit:implement
              │
              └─►  Re-run /spec_kit:deep-review → expect PASS hasAdvisories=true (F022 remaining)
              │
              ▼
           Follow-up: add F022 test fixture → PASS
```

---

**Report complete.** 25 active findings (9 P0 + 9 P1 + 7 P2, weighted 142); 4 dimensions audited across 7 iterations; convergence threshold 0.10 met at iter 6; iter 7 captured residual test/template drift at 0.32. Verdict **FAIL hasAdvisories=true**. Recommended Path: **B** (+ optional **C**) for fastest low-risk closure.
