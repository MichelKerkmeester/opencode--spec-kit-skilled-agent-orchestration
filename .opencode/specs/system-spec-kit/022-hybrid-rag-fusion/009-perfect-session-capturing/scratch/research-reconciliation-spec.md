● skill(sk-code-review)

● SQL: Create review todos
  └ 2 row(s) inserted. Last inserted row ID: 2.

● Read
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  └ 1 line read

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md
  └ 1 line read

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

I’m pulling the exact sections and research anchors now so the recommendations can be paste-ready and tightly scoped.

● Grep "^#{1,6} " (/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02-
-system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md)
  └ 37 lines found

● Grep "^(#|##|###) " (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/r
esearch/research-pipeline-improvements.md)
  └ 31 lines found

● Grep "R-11|R-13|Priority Matrix|Phase A0|cross-cutting|theme|data integrity|wrong session|decision
 deduplication|key_files|auto-detection" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/r
esearch/research-pipeline-improvements.md)
  └ 5 lines found

I found the target sections. Next I’m pulling the exact paragraphs around them plus the relevant R-item passages so each recommendation can quote and justify precisely.

● Read
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  lines 100-130
  └ 31 lines read

● Read
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  lines 229-244
  └ 16 lines read

● Read
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  lines 245-281
  └ 36 lines read

● Read
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  lines 354-380
  └ 9 lines read

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 30-72
  └ 43 lines read

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 260-406
  └ 146 lines read

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 407-472
  └ 66 lines read

I’ve got the main evidence. I’m checking the local anchor/comment conventions around the insertion points so the proposed markdown matches the spec’s structure exactly.

● Read
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  lines 223-247
  └ 25 lines read

● Read
  .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  lines 348-366
  └ 15 lines read

● Grep "Known Issues|Limitations|Future Work|Deferred"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/0
22-hybrid-rag-fusion/009-perfect-session-capturing/spec.md)
  └ No matches found

I have enough to write the review cleanly now. I’m just closing out the tracking state, then I’ll deliver the recommendations in the requested format.

● Todo completed: review-spec-doc, summarize-recommendations

## Summary

4 gaps found, 4 recommendations.

## Recommendation 1: 6. Risks And Dependencies

### Current Text (lines 233-236)
```md
233. | Risk | Native CLIs persist different filesystem spellings for the same workspace | High | Canonical `.opencode` identity layer accepts only equivalent paths, not nearby guesses |
234. | Risk | Broader path equivalence could weaken contamination safety if over-broad | High | Matching still requires one shared `.opencode` anchor and file hints remain workspace-scoped |
235. | Risk | Aligned but thin saves can still look plausible if metadata is over-counted | High | Shared insufficiency gate counts only durable evidence and hard-blocks under-evidenced saves |
236. | Risk | Stateless captures with sparse file edits can still look low-signal | Medium | Keep numeric scorer active, preserve tool evidence, and preserve quality/alignment/insufficiency aborts after discovery succeeds |
```

### Proposed Addition
Insert after line 236:

```md
| Risk | Same-spec transcript selection can resolve to the wrong session, still pass current spec-affinity checks, receive a high quality score, and be indexed as valid output | High | Deferred follow-up is documented in `research/research-pipeline-improvements.md` (R-11); until that work lands, treat transcript/file-count/provenance mismatches as source-integrity incidents rather than successful captures |
```

### Justification
R-11 is a P0 data-integrity finding and explicitly documents the failure mode the spec currently omits: wrong session selected, downstream checks still pass, quality can remain `1.00`, and the result can be indexed. This belongs in the risk table because it is a present operational risk, even though the corrective work is deferred.

## Recommendation 2: 6. Risks And Dependencies

### Current Text (lines 237-240)
```md
237. | Dependency | Existing stateless enrichment pipeline | High | Native backends still feed the same downstream transform and render path |
238. | Dependency | MCP memory-save handler flow | High | Dry-run, quality-loop, and persistence now rely on the same sufficiency contract |
239. | Dependency | Local CLI storage layouts | Medium | Each backend remains bounded, fixture-tested, and empty-state safe |
240. <!-- /ANCHOR:risks -->
```

### Proposed Addition
Insert before line 240:

```md
### Deferred Known Limitations

The research synthesis identified additional pipeline limitations that are acknowledged here for traceability only. They are deferred follow-up items, not new requirements for spec `010`.

- **Auto-detection fragility**: R-13 found that parent/child folder depth bias and the absence of stronger activity signals can cause the auto-detection cascade to prefer the wrong spec folder in large trees. This is documented as deferred routing hardening, not a change to the committed save contract.
- **Decision deduplication bug**: R-13 found that JSON-assisted saves can emit the same decision through both observation-derived and manual-decision paths, producing duplicate decisions in rendered output. This is a known limitation of current output fidelity until the deferred follow-up lands.
- **`key_files` pipeline weakness**: R-13 found that tree-thinning can over-merge short-description inputs and leave `key_files` empty even when relevant spec files exist. This remains deferred future work rather than an in-scope change for this spec.
```

### Justification
R-13 documents three concrete current limitations the spec does not acknowledge anywhere: auto-detection fragility, duplicated decisions, and empty `key_files`. A deferred-limitations subsection keeps scope frozen while still recording known issues that materially affect interpretation of current behavior.

## Recommendation 3: 12. Related Documents

### Current Text (lines 354-362)
```md
354. ## 12. Related Documents
355. 
356. - `plan`
357. - `tasks`
358. - `checklist`
359. - `decision record`
360. - `implementation summary`
361. 
362. Scratch audit artifacts under `scratch/` are historical research only. Canonical completion evidence for spec `010` lives in this markdown set plus fresh verification command output.
```

### Proposed Addition
Insert after line 360:

```md
- `research/research-pipeline-improvements.md`
- `research/`
```

### Justification
The research synthesis is now a directly relevant companion document for interpreting deferred risks, limitations, and future work. This addition is driven primarily by R-11 through R-13 plus the Priority Matrix and phased sequence, and it belongs in Related Documents because it is reference material, not scope expansion.

## Recommendation 4: 12. Related Documents

### Current Text (lines 354-362)
```md
354. ## 12. Related Documents
355. 
356. - `plan`
357. - `tasks`
358. - `checklist`
359. - `decision record`
360. - `implementation summary`
361. 
362. Scratch audit artifacts under `scratch/` are historical research only. Canonical completion evidence for spec `010` lives in this markdown set plus fresh verification command output.
```

### Proposed Addition
Insert after line 362:

```md
### Identified Future Work

The research synthesis in `research/research-pipeline-improvements.md` identified 21 deferred improvement items across seven cross-cutting themes plus a recommended implementation sequence (`Phase A0` through `Phase D`). They are recorded here for traceability only and do not expand the committed scope, requirements, success criteria, or acceptance scenarios for spec `010`.

- **Contract consolidation debt** — deferred unification of scorer, type, validator, and semantic-signal contracts across the pipeline (R-01, R-04, R-06, R-08).
- **Information loss at boundaries** — deferred work to preserve richer metadata through normalization and stage hand-offs, with better visibility into dropped data (R-02, R-03, R-06).
- **Scoring model maturity** — deferred evolution of quality, confidence, phase, and embedding signals toward more explicit multi-dimensional scoring (R-01, R-05, R-07, R-09).
- **Verification maturity** — deferred orchestration-level testing and observability improvements to catch regressions before indexing (R-02, R-03, R-10).
- **Template compliance at generation time** — deferred hardening of delegation and validation so generated outputs stay structurally aligned with templates (R-12).
- **Source-of-truth integrity** — deferred session-boundary and provenance work to prevent same-spec wrong-session capture from being processed as valid input (R-11).
- **Detection & routing fragility** — deferred improvements to spec-folder auto-detection, parent/child ranking, and session-activity routing signals (R-13).

See `research/research-pipeline-improvements.md` for the Priority Matrix (`P0`/`P1`/`P2`) and the recommended implementation sequence (`Phase A0` through `Phase D`).
```

### Justification
The research synthesis organizes 13 R-items into 7 themes and 21 deferred improvement items; none of that traceability currently appears in `spec.md`. Because scope is frozen, this belongs in a future-work style acknowledgment rather than in Scope, Requirements, or Success Criteria.

## No-Change Sections

- **3. Scope / Out Of Scope** — left unchanged because scope is explicitly frozen and the requested additions should not be framed as scope changes.
- **4. Requirements** — no additions recommended because the R-series items are deferred research, not new committed requirements.
- **5. Success Criteria** — complete as-is for the current spec contract; adding deferred items here would incorrectly turn backlog research into acceptance criteria.
- **7. Non-Functional Requirements** — current NFRs cover the implemented contract; deferred R-11/R-13 findings fit better as risks/limitations than as new NFR statements.
- **8. Edge Cases** — current list already documents runtime edge behavior; R-13 issues are better represented as known limitations than as normal edge-case handling.
- **11. Acceptance Scenarios** — no change recommended because the review constraint explicitly excludes acceptance-scenario expansion.


Total usage est:        1 Premium request
API time spent:         2m 31s
Total session time:     2m 46s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 327.5k in, 9.4k out, 272.1k cached (Est. 1 Premium request)
