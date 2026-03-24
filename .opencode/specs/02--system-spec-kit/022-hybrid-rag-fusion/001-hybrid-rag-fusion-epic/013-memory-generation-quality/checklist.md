# Checklist: Memory Generation Quality

---

## Q1 — Path Fragment Contamination

- [x] Complete contamination map with entry points and escape paths — [EVIDENCE: research.md §1, 7-row table with entry points, filters, escape paths, impacts]
- [x] Every `buildSpecTokens()` call site documented — [EVIDENCE: research.md §1 row 7, marked as LATENT path]
- [x] Every `deriveMemoryTriggerPhrases()` call site documented — [EVIDENCE: research.md §1 "Key Correction" — NOT active JSON-mode path, only deriveMemoryDescription called]
- [x] `filterTriggerPhrases()` gap analysis with specific regex patterns that fail — [EVIDENCE: research.md §1 "Filter Gap Summary" table]
- [x] `extractKeyTopics()` spec folder injection traced — [EVIDENCE: research.md §1 row 5, topic-extractor.ts:31-36]

## Q2 — JSON Mode Content Thinness

- [x] Field-by-field mapping: JSON input → normalized → pipeline consumer → output — [EVIDENCE: research.md §2, 10-row field-by-field gap analysis table]
- [x] Information loss quantified at each pipeline stage — [EVIDENCE: research.md §2 "Output Quality" column per field]
- [x] Specific enrichment opportunities identified in input-normalizer.ts — [EVIDENCE: research.md §2 "Best Enrichment Targets" — exchanges, toolCalls, nextSteps, filesModified]
- [x] Title truncation edge cases documented — [EVIDENCE: research.md §2 final paragraph on title vs body]

## Q3 — Fix Architecture

- [x] ADR with 3+ approaches evaluated (centralized/distributed/combined) — [EVIDENCE: research.md §3, 3 approaches + 2 hybrids evaluated]
- [x] Pros/cons/regression risks per approach — [EVIDENCE: research.md §5 "Eliminated Alternatives" + §7 "Risk Assessment"]
- [x] Recommended approach selected with rationale — [EVIDENCE: research.md §3 "Combined" selected, §7 simplified to 3-step/2-PR]
- [x] Regression test plan covering existing test suites — [EVIDENCE: research.md §4, 6 test suites with coverage gaps]
- [x] Implementation sequencing (which fixes are independent) — [EVIDENCE: research.md §7 PR1/PR2 split, deferred items marked]

## Research Quality

- [x] All 3 iteration files written with file:line citations — [EVIDENCE: scratch/iteration-001.md (0.67 newInfoRatio), iteration-002.md (0.72), iteration-003.md (0.82)]
- [x] research.md synthesized with all findings — [EVIDENCE: 7 sections including ultra-think review]
- [x] Context saved to memory — [EVIDENCE: memory/24-03-26_15-30__completed-deep-research-on-memory-generation.md indexed as #1]
