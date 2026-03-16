● skill(sk-doc)

I’m pulling the three source docs together first, then I’ll compare section-by-section and turn the gaps into exact insert-ready recommendations.

● SQL: Create review todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/implem
  entation-summary.md
  └ 277 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md
  └ 1 line read

● Read
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/tasks.md
  └ 183 lines read

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Create session plan
  $ cat >
  '/Users/michelkerkmeester/.copilot/session-state/ceda97e1-c430-4274-b365-f04e80e8a63b/plan.md'
   <<'EOF'
  # Plan
  1. Read implementation-summary.md, research-pipeline-improvements.md, and tasks.md....
  └ 5 lines...

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

I’ve got the summary and task checklist. Next I’m pulling just the research sections that matter for R-12, the priority matrix, and the phased rollout so I can make the additions exact rather than hand-wavy.

● Todo started: doc-review-plan

● Grep "^(#|##|###) |R-12|Priority Matrix|Phases A0|cross-cutting|21 improvement|P0|P1|P2"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/0
22-hybrid-rag-fusion/010-perfect-session-capturing/research/research-pipeline-improvements.md)
  └ 48 lines found

● Grep "check-template-headers|TEMPLATE_HEADERS|CHK-|frontmatter|H1|YAML leak|anchor id|required
anchor" in **/*.{sh,ts,js,md} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit)
  └ 5 lines found

● Grep "AUTO_DECISION_TREES|word-boundary|json-mode|trigger phrase|semantic summary file
extraction|tree thinning|medium-quality warning|agent files|SPECKIT_RULES|date
format|bullet-metadata" in **/*.{ts,js,sh,md,yaml,yml}
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 10-70
  └ 61 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 313-349
  └ 36 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 407-472
  └ 66 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 498-526
  └ 26 lines read

I found the exact R-12 passage, the seven themes, and the phased implementation sequence. I’m now checking the repo-side evidence for the template-validation work and whether Phase 6 items look implemented versus merely listed.

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/resear
  ch/research-pipeline-improvements.md lines 30-73
  └ 43 lines read

● Glob "**/check-template-headers.sh" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit
  └ 1 file found

● Grep "TEMPLATE_HEADERS|required_anchors|CHK-NNN|Verification Checklist|SPECKIT_TEMPLATE_SOURCE" in
 **/*.sh (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/spec)
  └ 8 lines found

● Grep "AUTO_DECISION_TREES|truncate.*word|json-mode|stopword|semantic summary|tree
thinning|medium-quality|agent files|SPECKIT_RULES|date format|bullet-metadata" in **/*.{ts,js,sh}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 40 lines found

● Read .opencode/skill/system-spec-kit/scripts/spec/validate.sh lines 300-390
  └ 91 lines read

● Read .opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh lines 1-220
  └ 144 lines read

● Read .opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh lines 1-260
  └ 231 lines read

● Grep "CG-0[1-8]|SE-0[1-5]" in **/*.{ts,js,sh} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 12 lines found

● Read .opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh lines 35-80
  └ 46 lines read

● Grep "CG-02|word-boundary-aware|truncateTo|truncate.*boundary" in **/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 13 lines found

● Grep "CG-05|semantic summary file extraction|file paths in any message|semantic summarizer" in
**/*.{ts,js} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "CG-08|agent files|implementation-guide-extractor" in **/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 8 lines found

● Read .opencode/skill/system-spec-kit/scripts/spec/validate.sh lines 140-162
  └ 22 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts lines 176-190
  └ 15 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 382-446
  └ 65 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1336-1360
  └ 25 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1588-1605
  └ 18 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts lines 110-150
  └ 41 lines read

● Read .opencode/skill/system-spec-kit/scripts/spec/validate.sh lines 248-264
  └ 17 lines read

✗ Grep "CG-05|file path" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/semantic-summarizer.ts)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts/core/semantic-summarizer.ts: IO error for
  operation on /Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts/core/semantic-summarizer.ts: No such file or
  directory (os error 2)

● Grep "agent|CG-08|classification" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts)
  └ 2 lines found

✗ Grep "word-boundary|lastSpace|truncate" in **/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/{utils,extractors})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts/{utils,extractors}: IO error for operation on
  /Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/scripts/{utils,extractors}: No such file or directory
  (os error 2)

Quick check: the R-12 implementation is definitely real code, not just research notes. I’ve verified the new validator script and the rule registration; I’m now spot-checking the omitted Phase 6 items the same way.

● Read .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts lines
  170-205
  └ 36 lines read

● Glob "**/semantic-summarizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts
  └ 1 file found

● Grep "lastSpace|truncate\(|truncate.*word|substring\(0, 77\)|substring\(0, 80\)" in **/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ 32 lines found

● Read .opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts lines 72-90
  └ 18 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts lines 308-322
  └ 15 lines read

I’ve finished the comparison. The main gaps are concentrated in one missing code-changes category, one omitted Phase 6 category, and the absence of any research-phase summary/traceability section.

● Todo completed: doc-review-analyze

✗ Memory stored: validation rules
  └ Spec validation includes a TEMPLATE_HEADERS warn rule and check-anchors enforces…

## Summary

4 gaps found, 4 recommendations.

Note: the current `research-pipeline-improvements.md` priority matrix visibly lists **25 rows** (`P0: 9`, `P1: 8`, `P2: 8`), not 21. I’d avoid hardcoding `21` in the summary unless the research doc is reconciled first.

## Recommendation 1: Section 2 `Code Changes`
### Current Text (lines 139-146)
```md
- Updated `mcp_server/lib/errors/recovery-hints.ts`.
  - Recovery guidance now tells operators to gather concrete file/tool/decision/outcome evidence instead of retrying blindly.
<!-- /ANCHOR:code -->

---

<!-- ANCHOR:tests -->
## 3. Test Coverage Added Or Expanded
```

### Proposed Addition
```md
### Template Compliance Enforcement (R-12)

- Added `scripts/rules/check-template-headers.sh`.
  - Introduces the `TEMPLATE_HEADERS` WARN rule for template-semantic validation.
  - Verifies expected section headers by file type, enforces checklist `CHK-NNN [P0/P1/P2]` identifiers, and checks the `# Verification Checklist:` H1 contract.

- Extended `scripts/rules/check-anchors.sh`.
  - Adds required anchor-id validation per file type instead of only checking balanced anchor pairs.
  - Enforces required anchor sets for `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`.

- Updated `scripts/spec/validate.sh`.
  - Registers `TEMPLATE_HEADERS` in severity resolution, canonical rule-name mapping, and script dispatch so the new rule runs in standard spec validation.

- Corrected the checklist corpus identified during the research pass.
  - Fixed `019-manual-testing-per-playbook/002-mutation/checklist.md` and `019-feature-flag-reference/checklist.md`.
  - Removed leaked or extra `SPECKIT_TEMPLATE_SOURCE` YAML and aligned H1 / checklist-item formatting across 14+ checklist files.
```

### Justification
`R-12` explicitly says these fixes were **implemented**, not merely researched: new `check-template-headers.sh`, extended `check-anchors.sh`, `validate.sh` registration, and checklist-file corrections. That work is absent from Section 2 even though it is real implementation coverage and belongs in its own code-changes category.

## Recommendation 2: Section 2 `Code Changes`
### Current Text (lines 139-146)
```md
- Updated `mcp_server/lib/errors/recovery-hints.ts`.
  - Recovery guidance now tells operators to gather concrete file/tool/decision/outcome evidence instead of retrying blindly.
<!-- /ANCHOR:code -->

---

<!-- ANCHOR:tests -->
## 3. Test Coverage Added Or Expanded
```

### Proposed Addition
```md
### Content Generation Quality And `speckit-enforce.yaml` Backend

- Updated content-generation behavior across the scripts workspace:
  - `scripts/extractors/diagram-extractor.ts` suppresses duplicated `AUTO_DECISION_TREES` (`CG-01`).
  - `scripts/utils/file-helpers.ts` and `scripts/extractors/decision-extractor.ts` now use word-boundary-aware truncation instead of mid-token clipping (`CG-02`).
  - `scripts/extractors/collect-session-data.ts` detects completion and completion-percent signals from explicit JSON-mode inputs (`CG-03`).
  - `scripts/core/workflow.ts` filters domain-stopword single-word trigger phrases and prepends a warning banner for medium-quality output (`CG-04`, `CG-07`).
  - `scripts/lib/semantic-summarizer.ts` broadens semantic-summary file extraction to any message that mentions file paths (`CG-05`).
  - `scripts/core/tree-thinning.ts` generates merged file descriptions from filenames and change summaries instead of placeholder text (`CG-06`).
  - `scripts/extractors/implementation-guide-extractor.ts` classifies `/agent/` and `/agents/` paths as agent-definition files (`CG-08`).

- Updated the co-located `speckit-enforce.yaml` backend handling:
  - `scripts/spec/validate.sh` warns on unrecognized `SPECKIT_RULES` entries and recognizes bullet-metadata `Level` declarations (`SE-01`, `SE-05`).
  - `scripts/spec/pre-commit-spec-validate.sh` skips YAML comments while parsing rule lists, validates `mode` / `new_folder_mode`, and warns on invalid `created_after` date formats (`SE-02`, `SE-03`, `SE-04`).
```

### Justification
Phase 6 in `tasks.md` marks `CG-01` through `CG-08` and `SE-01` through `SE-05` as completed, and the repo contains matching code-path updates. The implementation summary currently jumps from MCP save-path work straight to tests, so an entire completed implementation category is missing. These should be documented as implemented, not deferred.

## Recommendation 3: New Section `Research Phase Findings`
### Current Text (lines 233-240)
```md
- `context_template` (shared trigger-phrase YAML rendering with empty-list fallback)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:remediation -->
## 7. Remediation Pass: GPT-5.4 Review Findings (2026-03-15)
```

### Proposed Addition
```md
<!-- ANCHOR:research-findings -->
## 7. Research Phase Findings

The supporting synthesis in `research/research-pipeline-improvements.md` documented `R-01` through `R-13` and grouped the findings into 7 cross-cutting themes:

1. Contract consolidation debt
2. Information loss at boundaries
3. Scoring model maturity
4. Verification maturity
5. Template compliance at generation time
6. Source-of-truth integrity
7. Detection and routing fragility

Within this spec, `R-12` is the only research item that produced implemented code-path changes. Those fixes landed as template-compliance validation hardening plus checklist corpus corrections. The remaining research items were captured as follow-up guidance rather than implemented under `010-perfect-session-capturing`.

Deferred research work is already sequenced in the research document as `Phase A0`, `Phase A`, `Phase B`, `Phase C`, and `Phase D`, covering source integrity and detection, foundation work, signal quality, semantic richness, and observability / cleanup.

The priority matrix in `research/research-pipeline-improvements.md` currently groups follow-up work across `P0` (9 rows), `P1` (8 rows), and `P2` (8 rows). Use that research file as the canonical source for the live priority list, risk ordering, and phase mapping.
<!-- /ANCHOR:research-findings -->

---

<!-- ANCHOR:remediation -->
## 8. Remediation Pass: GPT-5.4 Review Findings (2026-03-15)
```

### Justification
The summary currently has no section acknowledging the research phase at all, even though the research synthesis defines the 7 themes, the phased follow-up sequence, and the only research item that was actually implemented here (`R-12`). That traceability is missing. I used the research doc’s **actual** matrix counts rather than `21`, because the current matrix shows 25 rows.

## Recommendation 4: Section 6 `Documentation Updated`
### Current Text (lines 217-234)
```md
## 6. Documentation Updated

- Canonical spec document
- Canonical plan document
- Canonical task document
- Canonical checklist
- Canonical decision record
- Canonical implementation summary
- Feature-catalog entry `NEW-139`
- Feature-catalog entry for pre-storage quality gate
- Feature-catalog entry for the verify-fix-verify quality loop
- Feature-catalog entry for `memory_save` dry-run preflight
- Manual-testing playbook scenario `M-007`
- Manual-testing playbook scenario `NEW-133`
- Manual-testing playbook scenario `NEW-149`
- `scripts/core/workflow.ts` (ANCHOR-preserving HTML comment regex)
- `context_template` (shared trigger-phrase YAML rendering with empty-list fallback)
```

### Proposed Addition
```md
- Research synthesis `research/research-pipeline-improvements.md` (R-01 through R-13 findings, cross-cutting themes, priority matrix, and phased follow-up sequence)
```

### Justification
Section 6 should acknowledge the `research/` artifact because it directly informs the documented R-12 implementation work and the deferred follow-up sequence. Right now the summary lists canonical docs and related updates but omits the research document that explains why one research item was implemented and the rest were deferred.

## No-Change Sections

- `## 1. Overview` — complete as-is.
- `## 3. Test Coverage Added Or Expanded` — adequate as-is for recorded tests.
- `## 4. Final Behavior` — complete as-is.
- `## 5. Verification Results` — complete as-is; the clean `validate.sh` pass is already recorded.
- `## 7. Remediation Pass: GPT-5.4 Review Findings` — content is complete; only renumber if the new research section is inserted.


Total usage est:        1 Premium request
API time spent:         4m 27s
Total session time:     4m 46s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 914.5k in, 15.9k out, 859.3k cached (Est. 1 Premium request)
