● skill(sk-doc)

I’m reviewing the existing decision record against the research synthesis, then I’ll map gaps and draft append-ready DR entries only.

● SQL: Create review todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md
  └ 1 line read

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/decisi
  on-record.md
  └ 205 lines read

● Create session plan
  $ cat >
  '/Users/michelkerkmeester/.copilot/session-state/6fc3ffb8-afd3-4732-98c1-6460151bcb91/plan.md'
   <<'EOF'
  # Plan
  1. Read the current decision record and research synthesis....
  └ 4 lines...

I’ve got the current DR set. Next I’m slicing the research synthesis into themes, priority items, and any already-covered decisions so I can recommend only true gaps.

● Todo started: review-existing-drs

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 1-260
  └ 227 lines read

● Grep "^## |^### |^#### |^- \*\*R-|^\| \*\*P[0-2]"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/0
22-hybrid-rag-fusion/009-perfect-session-capturing/research/research-pipeline-improvements.md)
  └ 30 lines found

● Grep "R-0[1-9]|R-1[0-3]|P0|P1|P2|theme|Theme|Priority Matrix|implemented|defer|validation|quality
scorer|metadata|auto-detection|template compliance|session-source"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/0
22-hybrid-rag-fusion/009-perfect-session-capturing/research/research-pipeline-improvements.md)
  └ 5 lines found

The research file is big, so I’m focusing on the decisive sections: R-10 through R-13, the 7 theme summary, and the decision-point section that may already imply no-change cases.

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 407-497
  └ 90 lines read

● Read .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 229-406
  └ 177 lines read

● Todo completed: map-research-gaps

## Summary

`5` gaps found, `5` new DRs recommended.

Uncovered themes: `Contract consolidation debt`, `Information loss at boundaries`, `Template compliance at generation time`, `Source-of-truth integrity`, and `Detection & routing fragility`.

## Recommendation 1: DR-015 — Defer Session-Identity Validation Beyond Current Integrity Gates

### Proposed DR Entry

```md
---

<!-- ANCHOR:dr15 -->
## DR-015: Defer Session-Identity Validation Beyond Current Integrity Gates

**Decision:** This spec acknowledges the R-11 source-of-truth finding but defers session-ID-first transcript resolution, same-session validation, contamination score penalties tied to wrong-session capture, and filesystem-truth cross-checks to a follow-up scope. The current spec remains limited to workspace identity, target-spec affinity, contamination blocking, and semantic sufficiency.

**Why:** R-11 shows that `mtime`-based transcript selection can choose the wrong same-spec session even while downstream validators still pass because they only verify spec affinity, not session identity. Fixing that requires coordinated loader, capture, validation, scoring, and audit-surface changes across the pipeline, which would expand this spec beyond its frozen scope and introduce high regression risk late in the pass.

**Consequences:**
- Same-spec wrong-session capture remains a known source-of-truth risk when multiple sessions target the same spec folder.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-11, Priority Matrix P0 item 0, and Recommended Implementation Sequence Phase A0.
- Revisit this decision in the next source-integrity follow-up that can change transcript resolution, V10 validation, contamination score penalties, and filesystem-truth comparison end to end.
<!-- /ANCHOR:dr15 -->
```

### Justification

This is the clearest missing DR. None of DR-001 through DR-014 document the distinction between `same spec folder` and `same session`, even though R-11 shows that current validators can certify the wrong transcript as high quality.

## Recommendation 2: DR-016 — Defer Quality Scorer Contract Unification

### Proposed DR Entry

```md
---

<!-- ANCHOR:dr16 -->
## DR-016: Defer Quality Scorer Contract Unification

**Decision:** This spec defers unifying the dual quality-scorer contract and keeps the current split behavior in place: normalized `0.0-1.0` quality for stored/indexed output and `1-100` quality thresholds for abort behavior and compatibility paths. Any migration to canonical `score01` with `score100` as a compatibility field is reserved for a dedicated follow-up.

**Why:** R-01 confirmed that the pipeline currently operates with two related but different scoring contracts, and that the abort threshold is explicitly validated on the `1-100` scale. Converging those contracts would require coordinated schema, config, workflow, frontmatter, and test-baseline updates, which is broader than this frozen spec and carries medium migration risk if done opportunistically.

**Consequences:**
- Dual-scale quality behavior remains known contract debt and can still cause fidelity drift between workflow gating and persisted metadata.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-01 and Priority Matrix P0 item 1.
- Revisit this decision in a contract-consolidation follow-up scoped specifically to `QualityScoreResult`, `score01` canonicalization, `score100` compatibility, and threshold migration.
<!-- /ANCHOR:dr16 -->
```

### Justification

Theme 1 is otherwise absent from the DR set. Existing DRs define insufficiency behavior, but none record the deliberate choice to postpone scorer-contract unification after research validated the scale mismatch.

## Recommendation 3: DR-017 — Defer Lossless Metadata Preservation Through Normalization

### Proposed DR Entry

```md
---

<!-- ANCHOR:dr17 -->
## DR-017: Defer Lossless Metadata Preservation Through Normalization

**Decision:** This spec defers changing normalization to preserve file-level and extractor-facing metadata end to end, including `ACTION`, `_provenance`, `_synthetic`, manual decision enrichment fields, and object-based fact fidelity. The current normalization contract remains in place for this pass.

**Why:** R-03 shows that normalization is still lossy at the pipeline boundary and drops metadata before downstream extractors can use it. Fixing that would alter shared input contracts across multiple extraction branches and would expand this spec from integrity-gate hardening into a broader data-model and helper-consolidation effort, which is outside the frozen scope.

**Consequences:**
- Entry-point metadata loss remains known technical debt, including dropped file-action context and reduced fidelity for downstream extraction and rendering.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-03, Priority Matrix P0 item 2, and P2 cleanup items for helper centralization and drop instrumentation.
- Revisit this decision in a dedicated data-fidelity follow-up before or alongside broader extractor-contract consolidation.
<!-- /ANCHOR:dr17 -->
```

### Justification

Theme 2 is not covered by any current DR. DR-006 improves `TOOL_COUNT`, but it does not document the separate research finding that normalization itself is still discarding durable metadata.

## Recommendation 4: DR-018 — Defer Further Template-Compliance Hardening Beyond Implemented Validator Enforcement

### Proposed DR Entry

```md
---

<!-- ANCHOR:dr18 -->
## DR-018: Defer Further Template-Compliance Hardening Beyond Implemented Validator Enforcement

**Decision:** This spec records the newly implemented template-compliance enforcement as sufficient for the current pass and defers deeper hardening beyond it. The current scope stops at the new `TEMPLATE_HEADERS` rule and the extended required-anchor validation in `ANCHORS_VALID`; structural fingerprinting, inline template delegation content, and automatic strict post-agent validation are deferred.

**Why:** R-12 showed a real generation-time compliance gap, and the implemented validator changes close the immediate blind spot without expanding the spec into broader delegation and orchestration changes. Additional hardening would touch agent prompting, workflow automation, and stricter post-generation enforcement, which exceeds the frozen scope even though the research strongly supports it.

**Consequences:**
- Template semantics are better protected than before, but external-agent deviations can still survive outside the new header and required-anchor checks.
- This follow-up debt is tracked in `research/research-pipeline-improvements.md` as R-12, especially the future items for structural fingerprinting, inline template content in delegation prompts, and automatic strict validation.
- Revisit this decision in a dedicated template-generation hardening pass after the current validator-level enforcement has been exercised on more real agent output.
<!-- /ANCHOR:dr18 -->
```

### Justification

DR-012 through DR-014 cover renderer/template integrity details, but not the broader R-12 enforcement decision. This is the right place to document that the implemented validator fix is the stopping point for this spec, with deeper hardening explicitly deferred.

## Recommendation 5: DR-019 — Defer Auto-Detection Cascade Expansion Beyond Current Ranking Logic

### Proposed DR Entry

```md
---

<!-- ANCHOR:dr19 -->
## DR-019: Defer Auto-Detection Cascade Expansion Beyond Current Ranking Logic

**Decision:** This spec defers expanding the spec-folder auto-detection cascade beyond its current ranking logic. New git-status signals, session-activity signals, parent-folder affinity boosts, key-files fallbacks, and broader template-to-workflow wiring identified by R-13 are reserved for a follow-up detection pass.

**Why:** R-13 shows that the current cascade is fragile under production-scale repo conditions, especially when parent folders compete with active children or when many same-depth candidates exist. Addressing that fragility requires coordinated changes across folder detection, transcript-derived activity, workflow enrichment, and downstream rendering contracts, which would broaden this spec beyond its frozen scope and couple it tightly to the unresolved R-11 session-source problem.

**Consequences:**
- Depth-bias, stale-candidate competition, and missing git/session signals remain known risks in first-save, parent-folder, and bulk-file workflows.
- This debt is tracked in `research/research-pipeline-improvements.md` as R-13, including Priority Matrix P0 items 6-8 and P1 items 11-13.
- Revisit this decision after the source-integrity follow-up for R-11, because wrong-session capture and weak folder detection compound each other and should be corrected together.
<!-- /ANCHOR:dr19 -->
```

### Justification

Theme 7 is completely missing from the current DR set. Existing DRs define how discovered content is judged after selection, but not the documented fragility in how the target spec folder is selected in the first place.

## No-Change Items

`DR-001` through `DR-005` are sufficient as-is for JSON authority, fallback order, workspace identity, and target-spec affinity. They do not need rewriting; they just do not cover session identity.

`DR-006` and `DR-008` through `DR-011` are sufficient as-is for current tool-evidence recovery, insufficiency gating, dry-run behavior, and `force:true` limits. I would not add separate DRs for R-02 from this review because those contamination follow-ups read as implementation refinements under the existing integrity model.

`DR-012` through `DR-014` are sufficient as-is for current renderer/template integrity behavior. The only missing piece is the broader R-12 validator/delegation boundary, which is why I recommended `DR-018` rather than edits to the existing three entries.

I would not recommend new DRs here for R-04, R-05, R-06, R-07, R-08, R-09, or R-10. Those are valid follow-up improvements, but in this spec they read more like future consolidation, enrichment, scoring, and test-depth work than missing decisions that need immediate DR coverage.


Total usage est:        1 Premium request
API time spent:         3m 15s
Total session time:     3m 30s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 556.0k in, 9.5k out, 515.3k cached (Est. 1 Premium request)
