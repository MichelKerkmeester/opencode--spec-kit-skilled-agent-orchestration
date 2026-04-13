---
title: "Fix Graph Metadata Status Derivation - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] `mcp_server/lib/graph/graph-metadata-parser.ts:498-510` preserves override and ranked frontmatter precedence.
- [ ] `implementation-summary.md` only promotes status to `complete` when `checklist.md` is absent or complete, matching `../research/research.md:294-314`.
- [ ] Tests cover the researched false-positive boundary around incomplete checklists.
## P1 (Should Fix)
- [ ] Verification evidence shows the change fixes the `180 + 39` high-confidence subset from `../research/research.md:317-324`.
- [ ] The phase does not auto-promote the 63 incomplete-checklist folders the research flagged as risky.
- [ ] The change stays localized to status derivation and does not alter graph-metadata schema behavior.
## P2 (Advisory)
- [ ] A follow-on note captures whether `in_progress` deserves a later fallback distinct from `planned`.
- [ ] Corpus/backfill verification records before-and-after status totals for the targeted folders.
