# Skipped and Partially-Implemented Research Recommendations — 026 Memory Quality Train

## Executive Summary

- Research corpus surveyed: 42 research or implementation-summary files across 9 child phases, plus a 36-file child-packet doc sweep (`spec.md`, `plan.md`, `decision-record.md`, `implementation-summary.md`, `checklist.md` where present).
- Research iterations read: `003-memory-quality-issues/research/iterations/iteration-001.md` through `iteration-025.md`, plus `001-research-graph-context-systems/006-research-memory-redundancy/research/iterations/iteration-001.md` through `iteration-004.md`.
- Runtime files spot-checked: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `.opencode/skill/system-spec-kit/scripts/dist/lib/validate-memory-quality.js`, `.opencode/skill/system-spec-kit/scripts/dist/utils/spec-affinity.js`, `.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js`, `.opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js`, `.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js`, `.opencode/skill/system-spec-kit/scripts/dist/lib/trigger-phrase-sanitizer.js`, `.opencode/skill/system-spec-kit/scripts/dist/lib/memory-telemetry.js`, plus TypeScript source equivalents under `scripts/`. No repo-local `scripts/src/` tree exists in this checkout; `find .opencode/skill/system-spec-kit/scripts -type d -name src` only returned `node_modules` internals.
- Recommendation ledger basis: 22 normalized items from the final 9-PR train, Gen-3 operational add-ons, the sibling `001/.../006-research-memory-redundancy` recommendations, and research-only follow-ons that never entered planning.
- Total recommendations classified: 22
  - SHIPPED-COMPLETE: 13
  - SHIPPED-PARTIAL: 4
  - SKIPPED: 2
  - DEFERRED-EXPLICIT: 1
  - SUPERSEDED: 1
  - OUT-OF-SCOPE: 1
- Child phases audited: `001-foundation-templates-truncation`, `002-single-owner-metadata`, `003-sanitization-precedence`, `004-heuristics-refactor-guardrails`, `005-operations-tail-prs`, `006-memory-duplication-reduction`, `007-skill-catalog-sync`, `008-input-normalizer-fastpath-fix`, and `009-post-save-render-fixes`.
- Most critical gaps (top 5 by present user impact):
  - `REC-006` narrow D3 sanitizer contract only partially landed; runtime now hard-filters residue singletons that research said to leave to reviewer or frequency heuristics.
  - `REC-008` D5 continuation contract is only partially aligned between linker and reviewer, and the parent closeout still leaves D5 warning persistence as a follow-up.
  - `REC-003` the shared truncation-helper migration never finished in `decision-extractor.ts`, so ad-hoc substring paths still exist after PR-8 was marked shipped.
  - `REC-009` PR-10 stopped at dry-run classification, so historical broken memories remain broken even though preventive fixes shipped.
  - `REC-019` the research-proposed save canary never moved into planning, leaving no automated pre-release drift tripwire for the memory-save path.

## Section 1 — Skipped Recommendations

### REC-018: Description-Aware D5 Fallback Never Left Research

- **Origin:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:59-60`]
- **Recommendation text (tightly paraphrased):** The D5 pre-render helper should consult description or payload signals before title when the frontmatter title is truncated or pathified.
- **Why it was made:** Iteration 14 found that title-only continuation signals can miss legitimate continuation saves, especially when the visible title is not the best lineage surface. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39`]
- **Runtime check performed:** `rg -n "readFrontmatterHead|frontmatter-only read|2 KB head-read helper|description/payload before title|payload before title" .opencode/skill/system-spec-kit/scripts/dist .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy | sed -n '1,200p'`
  Result: only research hits were returned, including the iteration-014 question and iteration-022 performance notes. `rg -n "continuationOf|continuation_of|description|sessionSummary|summary" .opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js` returned `summary` and `sessionSummary`, but no explicit `description` field path. The refinement never became a phase spec, plan, or runtime contract.
- **What breaks today because of the gap:** continuation saves with weak titles can still miss predecessor linkage and fall through into D5 warning noise instead of being recovered from richer payload context.
- **Minimum fix to close the gap:** add an explicit secondary payload or description cue path to predecessor discovery, then replay the ambiguous-lineage fixtures against real JSON-mode saves.
- **Implementation home if re-planned:** new follow-on under `003-memory-quality-issues/004-heuristics-refactor-guardrails` or a new `010-memory-save-heuristic-calibration` child packet.

### REC-019: `memory-doctor --canary` Never Reached Planning

- **Origin:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:117-118`]
- **Recommendation text (tightly paraphrased):** add `scripts/memory-doctor.ts --canary` that runs one clean save fixture plus defect-shaped canaries through `reviewPostSaveQuality()` and exits `0/1/2` for healthy, warning, or HIGH drift.
- **Why it was made:** Iteration 24 wanted a script-native healthcheck for the same save pipeline operators actually run, instead of waiting for live saves to expose reviewer or telemetry regressions. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-024.md:109-118`]
- **Runtime check performed:** `rg -n "memory-doctor|memory doctor|--canary" .opencode/skill/system-spec-kit/scripts/dist .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy | sed -n '1,120p'`
  Result: only iteration-024 returned matches (`iteration-024.md:118`, `iteration-024.md:147`). No runtime file, child phase spec, plan, checklist, or implementation-summary mentions the canary.
- **What breaks today because of the gap:** the train has no deterministic canary that would have caught save-path drift before today's live parent-folder save exposed fresh failures.
- **Minimum fix to close the gap:** add the canary CLI exactly at the script layer the research specified and wire it to the existing reviewer fixtures plus the emitted metric and log names.
- **Implementation home if re-planned:** a new operational follow-on sibling to `005-operations-tail-prs`, after the heuristic fixes are frozen.

## Section 2 — Partially-Implemented Recommendations

### REC-003: PR-8 Helper Migration Stopped Before `decision-extractor.ts`

- **Origin:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:27-31`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:60-65`]
- **Recommendation text (tightly paraphrased):** after PR-2 proves the helper boundary, finish PR-8 by migrating the remaining narrative truncation callsites in `decision-extractor.ts` to the shared `truncateOnWordBoundary()` helper.
- **Why it was made:** research treated the shared helper as the anti-regression boundary for all narrative truncation so D1-style clipping would not reappear in secondary paths.
- **Runtime check performed:** `rg -n "truncateOnWordBoundary|substring\\(0, 200\\)|substring\\(0, 120\\)|narrative\\.substring|rationaleFromInput\\.substring" .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`
  Result: raw substring callsites remain at `decision-extractor.ts:387`, `decision-extractor.ts:491`, and `decision-extractor.ts:513`.
- **What DID land:** the shared helper exists and is compiled into the shipped runtime (`dist/lib/truncate-on-word-boundary.js:3-4`), so the helper foundation itself is real.
- **What DID NOT land:** the remaining `decision-extractor.ts` callsites never migrated. Phase 1 explicitly recorded that "`decision-extractor.ts` still has its own narrative truncation callsites" and left the work for a later phase. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/implementation-summary.md:113-114`]
- **What breaks today because of the gap:** ad-hoc truncation logic still bypasses the canonical helper in decision-derived surfaces, leaving one last path where clipping can drift independently from the D1 fix.
- **Minimum fix to close the gap:** replace the three remaining raw substrings in `decision-extractor.ts` with helper-backed truncation, then replay the D1 and D2 fixture suites.
- **Implementation home if re-planned:** a PR-8 follow-on inside a new heuristic-calibration phase.

### REC-006: D3 Sanitizer Landed, But Its Narrow Corpus Contract Did Not

- **Origin:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:82-82`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:31-39`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:53-59`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:58-61`]
- **Recommendation text (tightly paraphrased):** keep the D3 filter narrow and shape-based: path fragments, standalone stopwords, single-character tokens, synthetic stopword bigrams, and narrow ID-prefix junk; do not promote residue singletons like `graph` or `research` into hard regex blocking.
- **Why it was made:** iteration 15's simulation only claimed zero observed false positives because the rule set stayed empirical and did not broaden into semantic singleton blocking.
- **Runtime check performed:** `rg -n "graph|with research|with phases|SHORT_PRODUCT_ALLOWLIST|STANDALONE_STOPWORD_BLOCKLIST|SYNTHETIC_BIGRAM_BLOCKLIST" .opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
  Result: the shipped source includes `graph` in `STANDALONE_STOPWORD_BLOCKLIST` at line 60 and includes `with phases` / `with research` in `SYNTHETIC_BIGRAM_BLOCKLIST` at lines 82-83.
- **What DID land:** the sanitizer module, short-name allowlist, path filtering, stopword filtering, and synthetic-bigram filtering are all present in runtime and source.
- **What DID NOT land:** the research guardrail against hard-blocking residue singletons did not survive. Research said those should stay in reviewer or frequency heuristics instead of the sanitizer itself. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:55-64`]
- **What breaks today because of the gap:** the sanitizer can now drop legitimate compact anchors that the research wanted to review, not erase. This is the closest already-documented miss to the sibling DR-trigger-phrase-loss investigation, even though the corpus never modeled `DR-###` identifiers directly.
- **Minimum fix to close the gap:** remove residue singletons from the hard sanitizer and move them into reviewer or scorer heuristics with corpus-backed tests.
- **Implementation home if re-planned:** a follow-on to `006-memory-duplication-reduction` or the new heuristic-calibration bundle.

### REC-008: D5 Continuation Logic Landed, But the Linker and Reviewer Still Drift

- **Origin:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:84-84`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1213-1215`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-014.md:35-39`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:93-96`]
- **Recommendation text (tightly paraphrased):** ship immediate-predecessor-only lineage discovery with ambiguity skip, a narrow continuation-signal set, and reviewer-side D5 warnings that use the same high-precision continuation families.
- **Why it was made:** D5 was supposed to auto-link only obvious continuation saves while refusing to fabricate lineage in mixed folders.
- **Runtime check performed:** 
  - `rg -n "HEADER_READ_BYTES|POSITIVE_CONTINUATION_SIGNAL|TITLE_FAMILY_OVERLAP_THRESHOLD|continuationOf|sourceMatch|hasContinuationSignal" .opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js`
    Result: the shipped helper uses a 2048-byte header read, title-family overlap, explicit `continuationOf` markers, and source-session matching.
  - `rg -n "round\\s*\\d+|follow\\[- \\]up|iter\\(\\?:ation\\)\\?\\s\\*\\d\\+|iterations\\?" .opencode/skill/system-spec-kit/scripts/dist/core/find-predecessor-memory.js`
    Result: only the single regex at line 40 matched, and it does not include a `round N` branch.
- **What DID land:** Phase 4 claimed the conservative helper that "scans sibling headers once, looks for the narrow continuation signals approved by the research packet, and refuses to fabricate lineage when the candidate set is ambiguous." [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/implementation-summary.md:36-39`]
- **What DID NOT land:** full reviewer or linker alignment and complete D5 quieting. Reviewer-side `CONTINUATION_PATTERNS` still includes `round` [SOURCE: `.opencode/skill/system-spec-kit/scripts/dist/core/post-save-review.js:67-75`], but the linker helper does not, and the parent closeout still leaves D5 warning persistence open as a follow-up. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/implementation-summary.md:181-187`]
- **What breaks today because of the gap:** continuation checks can still stack or disagree between auto-linking and review, which matches the sibling RCA's D5 symptom.
- **Minimum fix to close the gap:** freeze one shared continuation-signal contract for both linker and reviewer, then replay the D5 fixture set through the real save path.
- **Implementation home if re-planned:** a focused D5 follow-on under `004-heuristics-refactor-guardrails`.

### REC-009: PR-10 Shipped as a Classifier, Not as Historical Repair

- **Origin:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1217-1221`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1422-1423`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-023.md:71-80`]
- **Recommendation text (tightly paraphrased):** after PR-1 through PR-9 land, ship a safe-subset migration CLI with dry-run, apply, JSON report output, and ambiguity skip; repair D3, D4, D6, D8 mechanically and D5 only when unambiguous.
- **Why it was made:** the research concluded that 82 historical files would remain inconsistent unless the post-fix runtime was followed by a controlled corpus-repair step.
- **Runtime check performed:** historical Phase 5 verification confirmed the legacy PR-10 dry-run classifier exposed `dry-run`, `skipped-ambiguous`, `unrecoverable`, and `fixed` reporting buckets before the script was retired.
- **What DID land:** Phase 5 explicitly shipped a dry-run-only classifier for historical JSON-mode memories; that legacy script has since been removed post-routing refactor. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/implementation-summary.md:39-42`]
- **What DID NOT land:** actual historical repair. Phase 5 also states: "PR-10 remains dry-run only. This phase does not rewrite historical memory files." [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/implementation-summary.md:96-97`]
- **What breaks today because of the gap:** the runtime is cleaner for fresh saves, but the corpus still contains the historical broken artifacts the research explicitly wanted classified and eventually repaired.
- **Minimum fix to close the gap:** add a guarded `--apply` mode only after the D3 and D5 semantics are frozen, then rerun reviewer and contamination checks over touched files.
- **Implementation home if re-planned:** `005-operations-tail-prs` follow-on or a new historical-repair packet.

## Section 3 — Deferred or Superseded

- **REC-010 — PR-11 cross-process save lock:** explicitly deferred. Gen-3 added PR-11 as an optional successor only if concurrent `--json` saves become a real workflow. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1420-1423`] The current runtime still contains the degraded-lock fallback: `rg -n "without fs lock|workflow-lock|degraded-lock|fail closed|filesystem lock|lock timeout|continue without fs lock|proceed without fs lock" .opencode/skill/system-spec-kit/scripts/dist/core/workflow.js` returned `workflow.js:301-302`, including "proceeding without fs lock." Phase 5 then codified the defer: "Record PR-11 as deferred-with-rationale" and "PR-11 remains deferred." [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/implementation-summary.md:73-75`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-operations-tail-prs/implementation-summary.md:96-97`]
- **REC-020 — the broader iteration-8 remediation matrix:** superseded by the final narrow matrix. The canonical research synthesis explicitly says the final matrix "supersedes iter 8" and narrows D2, D3, D5, and D7. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:77-89`]
- **REC-021 — V8 contamination-gate redesign:** out of scope, not a missed shipment. The research scope explicitly excluded "V8 contamination work" from the 003 packet family. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:30-30`] That means today's V8 over-match is real debt, but not evidence that 003 skipped a planned V8 fix.

## Section 4 — Cross-Reference with Sibling RCA

- **Title or description fields rejected:** not attributable to a skipped 026 research recommendation. Gen-2 research knew the baseline reviewer already flagged generic titles and generic descriptions (`PSR-1`, `PSR-6`), but it did not recommend redesigning those checks; it focused on adding D1-D8 guardrails on top of them. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:18-23`] Treat the current failure as reviewer-baseline debt or a new interaction, not as a missed D1-D8 shipment.
- **DR trigger phrase drops:** closest existing gap is `REC-006`, because the research demanded a narrow, shape-based sanitizer and warned against broad semantic singleton blocking. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-015.md:53-64`] But the research corpus never modeled `DR-###` or finding-ID trigger phrases directly, so this is only an adjacent candidate until the sibling RCA proves ownership.
- **V8 `SPEC_ID_REGEX` over-match:** not attributable to skipped 003 work. See `REC-021`; V8 contamination redesign was explicitly out of scope for this train. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:30-30`]
- **V12 naive substring match:** not in the D1-D8 research ledger. Phase 1 already recorded `QUALITY_GATE_FAIL: V12` as a pre-existing, non-blocking reviewer signal and left it out of scope for Phase 1. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/implementation-summary.md:113-114`] Treat it as adjacent validator debt that never entered the 003 planning train, not as a skipped research recommendation from the main corpus.
- **D5 continuation-check stacking:** attributable to `REC-008` (`SHIPPED-PARTIAL`). The core predecessor helper landed, but the linker and reviewer still do not share a completely frozen continuation-signal contract, and the parent packet explicitly leaves D5 warning persistence open as a follow-up. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/implementation-summary.md:181-187`]

## Section 5 — Recommended Remediation Scoping

- **Proposed packet name:** `010-memory-save-heuristic-calibration`
  - Bundled REC IDs: `REC-003`, `REC-006`, `REC-008`, `REC-018`
  - Estimated blast radius: `decision-extractor`, `trigger-phrase-sanitizer`, `find-predecessor-memory`, `post-save-review`, and their fixture suites.
  - Dependencies on other bundles: none; this should freeze the live semantics before any historical rewrite or canary work.

- **Proposed packet name:** `011-historical-memory-repair-apply-mode`
  - Bundled REC IDs: `REC-009`
  - Estimated blast radius: migration CLI plus historical `memory/*.md` artifacts under packet folders.
  - Dependencies on other bundles: depends on `010-memory-save-heuristic-calibration`, because D3 and D5 semantics should be frozen before touching old files.

- **Proposed packet name:** `012-memory-save-canary-and-validator-followup`
  - Bundled REC IDs: `REC-019`
  - Estimated blast radius: operational tooling only; no corpus rewrites required.
  - Dependencies on other bundles: best done after `010-memory-save-heuristic-calibration` so the canary encodes the final D3 and D5 behavior rather than today's noisy contract.

## Section 6 — What the Research Correctly Flagged But Never Reached Planning

- **REC-018 — description-aware D5 fallback:** iteration 14 raised the "consult description/payload before title" follow-on, but `rg -n "description/payload before title|payload before title" .opencode/skill/system-spec-kit/scripts/dist .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy | sed -n '1,200p'` returned only research hits. No child phase `spec.md` or `plan.md` promoted it into scheduled work.
- **REC-019 — `memory-doctor --canary`:** iteration 24 proposed it as the script-native healthcheck, but the same `rg -n "memory-doctor|memory doctor|--canary" ...` search returned only research hits (`iteration-024.md:118`, `iteration-024.md:147`). It never entered any child-phase plan or implementation scope.
