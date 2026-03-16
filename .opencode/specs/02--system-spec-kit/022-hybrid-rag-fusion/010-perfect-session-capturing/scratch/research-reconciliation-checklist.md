● skill(sk-doc)

I’m reviewing the checklist against the research synthesis and the surrounding spec docs so I can recommend paste-ready checklist additions, not implementation work.

● SQL: Seed review todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .agents/skills/sk-doc/references/quick_reference.md
  └ 328 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/checkl
  ist.md
  └ 96 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md
  └ 1 line read

● Read
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md
  └ 1 line read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/decisi
  on-record.md
  └ 205 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implem
  entation-summary.md
  └ 277 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/README.md
  └ 59 lines read

I’ve got the checklist and summary docs; now I’m checking whether the rest of the spec folder actually records the research in the places the checklist should verify.

● Todo started: review-checklist

● Grep "^## " (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/r
esearch/research-pipeline-improvements.md)
  └ 7 lines found

● Grep "R-(0[1-9]|1[0-3])" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/r
esearch/research-pipeline-improvements.md)
  └ 5 lines found

● Grep "(Risks|Future Work|Related Docs|research|R-12|R-11|R-01|R-13|R-03|theme)"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/0
22-hybrid-rag-fusion/010-perfect-session-capturing/spec.md)
  └ 2 lines found

● Grep "(R-11|R-01|R-13|R-03|deferr|future|research)"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/0
22-hybrid-rag-fusion/010-perfect-session-capturing/decision-record.md)
  └ 7 lines found

● Grep "(R-12|Phase 6|template|compliance|research|future|README)"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/0
22-hybrid-rag-fusion/010-perfect-session-capturing/implementation-summary.md)
  └ 8 lines found

● Read
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md
  lines 220-310
  └ 91 lines read

● Grep "^## " (/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--sys
tem-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md)
  └ 13 lines found

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773674631496-xc1elu.txt
  lines 1-220
  └ 51 lines read

● Grep "^### R-(0[1-9]|1[0-3])" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/r
esearch/research-pipeline-improvements.md)
  └ 13 lines found

● Grep "Theme|theme" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/r
esearch/research-pipeline-improvements.md)
  └ 9 lines found

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 10-32
  └ 23 lines read

● Read
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/spec.md
  lines 348-380
  └ 15 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 407-431
  └ 24 lines read

I’ve confirmed the research synthesis itself is strong. The main gaps are around whether the rest of the spec folder proves that the research was captured, deferred, and indexed in canonical docs.

● Todo started: inspect-related-docs

● Grep "Phase 6|Phase F|content generation|template|required-anchor|TEMPLATE_HEADERS"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/0
22-hybrid-rag-fusion/010-perfect-session-capturing/research/research-pipeline-improvements.md)
  └ 21 lines found

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 313-349
  └ 36 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 432-497
  └ 65 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/checkl
  ist.md lines 71-97
  └ 26 lines read

● Todo completed: draft-recommendations

## Summary

6 gaps found, 6 recommendations

## Recommendation 1: 6. Research Documentation Completeness

### Current Text (lines 84-96)
```markdown
## 5. Remediation Pass: GPT-5.4 Review Findings

- [x] [P0] Inner-symlink tests prove the canonicalization bug and its fix. [Evidence: 4 new tests in `spec-folder-canonicalization.vitest.ts` create a symlink inside `/specs/` that aliases a spec folder name; naive regex returns `"current"` (wrong), `extractSpecFolder` returns `"02--domain/010-feature"` (correct).]
- [x] [P1] Migration runs once via schema v23, not on every startup. [Evidence: `SCHEMA_VERSION` bumped to 23; `normalizeStoredSpecFolders()` removed from `create_schema`; migration v23 runs re-canonicalization inside `run_migrations` transaction.]
- [x] [P1] SQL guard replaced with JS-side normalized filter. [Evidence: migration v23 selects all rows then filters with `normalized.includes('/specs/')` instead of SQL `LIKE '%/specs/%'`.]
- [x] [P1] `session_state.spec_folder` migrated via old→new mapping. [Evidence: `migrateSessionStateSpecFolders()` added and called from migration v23; skips ambiguous 1:N mappings safely.]
- [x] [P2] Error handling narrowed to ENOENT/ENOTDIR for parent-walk. [Evidence: `isMissingPathError()` helper added; ELOOP test passes with real circular symlinks returning resolved path without parent-walk.]
- [x] [P2] Fallback uses canonicalized `normalizedPath`. [Evidence: `memory-parser.ts:311` changed from `filePath` to `normalizedPath`; backslash test confirms forward-slash output.]
- [x] [P2] TypeScript compiles cleanly after remediation. [Evidence: `npx tsc --noEmit` in `mcp_server` — zero errors.]
- [x] [P2] All canonicalization tests pass including 7 new tests. [Evidence: `npx vitest run tests/spec-folder-canonicalization.vitest.ts` — 20 tests, 0 failures.]
- [x] [P2] Full MCP suite passes with zero regressions. [Evidence: `npx vitest run` — 282 files, 7,787 tests passed, 0 failures.]
<!-- /ANCHOR:remediation -->
```

### Proposed Addition
```markdown
---

## 6. Research Documentation Completeness

- [ ] CHK-601 [P2] `research/research-pipeline-improvements.md` exists and remains the authoritative research synthesis for spec `010`.
  - [ ] The file exists at `research/research-pipeline-improvements.md`
  - [ ] The Executive Summary states that 13 research items are covered across 7 cross-cutting themes
  - [ ] The document contains `### R-01` through `### R-13`
  - [ ] The document includes `## Priority Matrix`, `## Detailed Findings`, `## Cross-Cutting Observations`, `## Recommended Implementation Sequence`, and `## Decision Points for User`
```

### Justification
The checklist currently proves implementation closure, but it never proves that the research synthesis itself is present and complete. Since the synthesis is the authoritative source for deferred R-series follow-up, the checklist should explicitly verify its existence, scope, and structure.

## Recommendation 2: 6. Research Documentation Completeness

### Current Text (insert under the new Section 6 from Recommendation 1)
New item under the proposed section.

### Proposed Addition
```markdown
- [ ] CHK-602 [P2] `spec.md` acknowledges the research backlog in canonical spec sections.
  - [ ] `## 6. Risks And Dependencies` references the research themes that still matter to this spec
  - [ ] `spec.md` includes a `Future Work` subsection that summarizes deferred R-series follow-up without restating those items as in-scope implementation work
  - [ ] `## 12. Related Documents` links `research/README.md` and `research/research-pipeline-improvements.md`
```

### Justification
`spec.md` currently has Risks and Related Documents, but it does not visibly carry the research synthesis forward into canonical spec framing, and it has no Future Work hook for deferred research. This item keeps the research documented without turning deferred R-series work into current-scope implementation requirements.

## Recommendation 3: 6. Research Documentation Completeness

### Current Text (insert under the new Section 6 from Recommendation 1)
New item under the proposed section.

### Proposed Addition
```markdown
- [ ] CHK-603 [P2] `decision-record.md` records explicit deferral decisions for the highest-priority research backlog.
  - [ ] Separate deferral DRs exist for R-11, R-01, R-13, and R-03
  - [ ] Each deferral DR states why the work is deferred from spec `010`
  - [ ] Each deferral DR points to `research/research-pipeline-improvements.md`
  - [ ] Each deferral DR distinguishes shipped `010` behavior from deferred follow-up work
```

### Justification
The decision record is detailed, but it records shipped behavior, not the deferral of the next research-driven backlog. Because you specifically called out R-11, R-01, R-13, and R-03, the checklist should verify that those deferrals are captured as explicit DRs instead of being left implicit.

## Recommendation 4: 6. Research Documentation Completeness

### Current Text (insert under the new Section 6 from Recommendation 1)
New item under the proposed section.

### Proposed Addition
```markdown
- [ ] CHK-604 [P2] `implementation-summary.md` documents the research-driven documentation fixes that are already shipped.
  - [ ] The summary explicitly names R-12 as implemented documentation/template compliance work
  - [ ] The summary documents the Phase 6 content-generation fixes that changed ANCHOR preservation, trigger-phrase YAML rendering, and template-validation behavior
  - [ ] The summary separates implemented R-12 fixes from future R-12 and R-13 follow-up
```

### Justification
The implementation summary already describes ANCHOR preservation and trigger-phrase rendering fixes, but it does not clearly frame them as research-derived R-12 closure or as Phase 6 content-generation fixes. This item closes that documentation traceability gap.

## Recommendation 5: 6. Research Documentation Completeness

### Current Text (insert under the new Section 6 from Recommendation 1)
New item under the proposed section.

### Proposed Addition
```markdown
- [ ] CHK-605 [P2] The `research/` directory is organized as a navigable index for the spec folder.
  - [ ] `research/README.md` exists
  - [ ] `research/README.md` identifies `research-pipeline-improvements.md` as the authoritative synthesis
  - [ ] `research/README.md` inventories the major research artifact groups (`analysis/`, `audits/`, `qa/`, `fixes/`, and `agent-outputs/`)
  - [ ] Canonical docs link to the research index instead of relying on `scratch/` artifacts
```

### Justification
The research directory is already well organized, but the checklist does not verify that organization as part of canonical documentation completeness. Adding this item protects the directory from regressing into an unindexed archive.

## Recommendation 6: 6. Research Documentation Completeness

### Current Text (lines 74-79)
```markdown
- [x] [P2] Canonical `010` docs now describe discovery, alignment, insufficiency, and contamination as separate gates. [Evidence: spec, plan, tasks, decision record, and implementation summary all distinguish those stages explicitly.]
- [x] [P2] Manual verification guidance matches actual repo commands. [Evidence: `M-007` now uses `scripts/tests` for the JS suites, includes scripts `check`/build, and records the package-clean MCP lint/build/test bar; `NEW-133` documents `memory_save` dry-run and insufficiency behavior.]
- [x] [P2] Verification counts in spec `010` are current. [Evidence: targeted scripts suite (`14` files, `127` tests), targeted MCP suite (`6` files, `298` tests), JS suites, full MCP package suite (`282` files, `7787` passed, `11` skipped, `28` todo), and alignment counts (`229` scanned files) were refreshed to the 2026-03-16 rerun results.]
- [x] [P2] Package-clean MCP closure evidence is part of the canonical bar. [Evidence: the canonical spec set, feature catalog, and `M-007` now record `mcp_server` lint/build/full-test verification rather than relying only on the targeted save suite.]
- [x] [P2] Live manual `M-007` evidence matches the final written contract. [Evidence: 2026-03-15 manual reruns produced `#4347` for rich snake_case JSON, `#4348` for Copilot, `#4349` for Gemini, `#4351` for Claude, `#4353` for Codex, `ALIGNMENT_BLOCK` for OpenCode off-spec direct mode, and `NO_DATA_AVAILABLE` for the empty-home run.]
- [x] [P2] No deferred save-quality or native-capture work remains in canonical docs for this feature. [Evidence: canonical markdown now treats workspace identity, spec affinity, and cross-platform sufficiency as shipped behavior rather than pending work.]
```

### Proposed Addition
```markdown
- [ ] CHK-606 [P2] Checklist closure evidence reflects the R-12 template-compliance hardening that now governs checklist validity.
  - [ ] Closure evidence cites the `TEMPLATE_HEADERS` rule addition
  - [ ] Closure evidence cites required-anchor enforcement for checklist files
  - [ ] Closure evidence confirms checklist item format expectations are documented, not only code-tested
  - [ ] Closure evidence points to canonical spec docs or validation output, not only source-code changes
```

### Justification
This is the one place where I do think the current P2 closure needs supplementation. The existing P2 items prove behavioral closure, but they do not prove that the checklist itself is now trustworthy under the R-12 template-compliance hardening, which matters for documentation integrity.

## No-Change Sections

- `## 1. Evidence Snapshot` — complete as-is for command/test evidence; it does not need research-backlog items mixed into it.

- `## 2. P0 Checks` — complete as implementation closure; adding deferred R-series documentation checks here would blur shipped behavior with future backlog.

- `## 3. P1 Checks` — complete as implementation closure for shared-path, sufficiency, and documentation refresh behavior.

- `## 5. Remediation Pass: GPT-5.4 Review Findings` — complete as a focused remediation section and should stay separate from research-synthesis completeness tracking.


Total usage est:        1 Premium request
API time spent:         3m 33s
Total session time:     3m 48s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 506.7k in, 13.7k out, 375.8k cached (Est. 1 Premium request)
