---
title: "Fix Graph Metadata Status Derivation - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [x] `mcp_server/lib/graph/graph-metadata-parser.ts:498-510` preserves override and ranked frontmatter precedence. Evidence: `deriveStatus()` normalizes overrides first, then uses the ranked frontmatter stack before fallback logic.
- [x] `implementation-summary.md` only promotes status to `complete` when `checklist.md` is absent or complete, matching `../research/research.md:294-314`. Evidence: `deriveStatus()` returns `complete` only when the checklist is absent or evaluates to `COMPLETE`, and otherwise returns `in_progress`.
- [x] Tests cover the researched false-positive boundary around incomplete checklists. Evidence: `graph-metadata-schema.vitest.ts` covers complete, incomplete, missing-checklist, and frontmatter-precedence cases.
## P1 (Should Fix)
- [ ] Verification evidence shows the change fixes the `180 + 39` high-confidence subset from `../research/research.md:317-324`.
- [x] The phase does not auto-promote the 63 incomplete-checklist folders the research flagged as risky. Evidence: incomplete checklists now force `in_progress` rather than `complete`.
- [x] The change stays localized to status derivation and does not alter graph-metadata schema behavior. Evidence: the implementation is confined to `deriveStatus()` plus `evaluateChecklistCompletion()`, while schema files remain unchanged.
## P2 (Advisory)
- [ ] A follow-on note captures whether `in_progress` deserves a later fallback distinct from `planned`.
- [ ] Corpus/backfill verification records before-and-after status totals for the targeted folders.
