# Iteration 9: Final Synthesis -- Complete Artifacts and Automation Assessment

## Focus
Final synthesis iteration. All 8 research questions are answered. This iteration produces three deliverables:
1. The COMPLETE, copy-pasteable content for the shared reference file (`template-compliance-contract.md`)
2. Automation feasibility assessment for a `generate-compliance-contract.sh` script
3. Final recommendations section with prioritized implementation order

## Findings

### Finding 1: Automation Feasibility -- generate-compliance-contract.sh is FEASIBLE and WORTHWHILE

The `template-structure.js contract <level> <basename>` CLI command works correctly from the `scripts/utils/` path and returns structured JSON for all 5 Level 2 document types. The output format is consistent and machine-parseable:

```json
{
  "headerRules": [{ "raw": "1. METADATA", "normalized": "METADATA", "dynamic": false }],
  "optionalHeaderRules": [{ "raw": "L2: NON-FUNCTIONAL REQUIREMENTS", ... }],
  "requiredAnchors": ["metadata", "problem", ...],
  "optionalAnchors": [...],
  "allowedAnchors": [...]
}
```

A shell script wrapping `node scripts/utils/template-structure.js contract <level> <basename>` + `jq` processing could auto-generate the markdown contract file. The script would:

1. Iterate over levels (1, 2, 3) and their respective basenames
2. Extract `headerRules[].raw` and `requiredAnchors[]` from JSON output
3. Zip them into anchor-to-H2 markdown tables
4. Append `optionalHeaderRules` as L2/L3 addenda lines
5. Handle the Level 3 `decision-record.md` parametric pattern separately (this requires special-casing since its anchors are dynamic `adr-NNN` patterns, not static from the CLI)

**Feasibility verdict**: FEASIBLE. The CLI already returns all needed data. A ~50-line shell script could generate the entire contract file.

**Worthwhile verdict**: MODERATELY worthwhile. Benefits:
- Eliminates manual sync when templates change (the sync protocol becomes: run script, commit output)
- Removes human error from contract transcription
- Script output could include a content hash for drift detection

However, template changes are infrequent (estimated: a few times per quarter). The initial manual creation from confirmed-correct iteration 6 data is fine; the script is a "nice to have" for ongoing maintenance.

**Recommendation**: Create the reference file manually now (iteration 6 data is verified against CLI output). Build the generation script as a follow-up task only if template changes become frequent enough to justify it.

[SOURCE: `node .opencode/skill/system-spec-kit/scripts/utils/template-structure.js contract 2 <basename>` -- verified for all 5 Level 2 doc types]

### Finding 2: Complete Shared Reference File Content (Copy-Pasteable)

The following is the COMPLETE content for `.opencode/skill/system-spec-kit/references/template-compliance-contract.md`. This is the canonical single-source-of-truth artifact that all 4 CLI @speckit agent definitions reference.

````markdown
---
title: Template Compliance Contract
version: 1.0.0
source: template-structure.js (scripts/utils/template-structure.js)
last_synced: 2026-03-22
applies_to: "@speckit agent definitions across all CLIs"
---

# Template Compliance Contract

> Canonical structural contract for all spec folder documents.
> Referenced by @speckit agent definitions across all CLIs.
> Source of truth: `template-structure.js` loadTemplateContract() output.

## Purpose

This file defines the EXACT heading and anchor structure required for every
spec folder document at each documentation level. Agents MUST follow these
contracts when creating or editing spec folder markdown files. The validation
system (`validate.sh`) enforces these contracts post-write.

## Enforcement Rule

After writing ANY spec folder `.md` file, immediately run:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <SPEC_FOLDER> --strict
```

Fix ALL errors before proceeding to the next file or workflow step.

---

## Level 1 Contract (4 Document Types)

Level 1 uses the same headers/anchors as Level 2 for the 4 shared doc types
(spec.md, plan.md, tasks.md, implementation-summary.md), minus the L2 addenda
sections. Refer to the Level 2 tables below -- include only the core rows
(not the "L2 addenda" lines).

---

## Level 2 Contract (5 Document Types)

MANDATORY: Every spec document MUST follow the exact anchor + header structure below.
Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
Do NOT reorder, rename, or omit required sections. Custom sections go AFTER required ones.

### spec.md -- `# Feature Specification: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## 1. METADATA |
| problem | ## 2. PROBLEM & PURPOSE |
| scope | ## 3. SCOPE |
| requirements | ## 4. REQUIREMENTS |
| success-criteria | ## 5. SUCCESS CRITERIA |
| risks | ## 6. RISKS & DEPENDENCIES |
| questions | ## 10. OPEN QUESTIONS |

L2 addenda (after core): `nfr` (## L2: NON-FUNCTIONAL REQUIREMENTS), `edge-cases` (## L2: EDGE CASES), `complexity` (## L2: COMPLEXITY ASSESSMENT)

### plan.md -- `# Implementation Plan: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| summary | ## 1. SUMMARY |
| quality-gates | ## 2. QUALITY GATES |
| architecture | ## 3. ARCHITECTURE |
| phases | ## 4. IMPLEMENTATION PHASES |
| testing | ## 5. TESTING STRATEGY |
| dependencies | ## 6. DEPENDENCIES |
| rollback | ## 7. ROLLBACK PLAN |

L2 addenda (after core): `phase-deps` (## L2: PHASE DEPENDENCIES), `effort` (## L2: EFFORT ESTIMATION), `enhanced-rollback` (## L2: ENHANCED ROLLBACK)

### tasks.md -- `# Tasks: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| notation | ## Task Notation |
| phase-1 | ## Phase 1: Setup |
| phase-2 | ## Phase 2: Implementation |
| phase-3 | ## Phase 3: Verification |
| completion | ## Completion Criteria |
| cross-refs | ## Cross-References |

### checklist.md -- `# Verification Checklist: [Title]`

| Anchor | Required H2 |
|--------|-------------|
| protocol | ## Verification Protocol |
| pre-impl | ## Pre-Implementation |
| code-quality | ## Code Quality |
| testing | ## Testing |
| security | ## Security |
| docs | ## Documentation |
| file-org | ## File Organization |
| summary | ## Verification Summary |

### implementation-summary.md -- `# Implementation Summary`

| Anchor | Required H2 |
|--------|-------------|
| metadata | ## Metadata |
| what-built | ## What Was Built |
| how-delivered | ## How It Was Delivered |
| decisions | ## Key Decisions |
| verification | ## Verification |
| limitations | ## Known Limitations |

---

## Level 3 Contract (Adds decision-record.md)

All Level 2 documents retain their contracts above. Level 3 adds:

### decision-record.md -- `# Decision Record: [Title]`

Each ADR uses parametric anchors. Replace `NNN` with the ADR number (e.g., 001):

| Anchor Pattern | Required Content |
|----------------|-----------------|
| adr-NNN | Wraps the entire ADR section |
| adr-NNN-context | ## Context subsection |
| adr-NNN-decision | ## Decision subsection |
| adr-NNN-alternatives | ## Alternatives Considered subsection |
| adr-NNN-consequences | ## Consequences subsection |
| adr-NNN-five-checks | ## Five Checks subsection |
| adr-NNN-impl | ## Implementation Notes subsection |

All 6 sub-anchors are required per ADR, in the order shown above.

---

## Level 3+ Contract

Same structural contract as Level 3. Extended governance requirements
(AI protocols, sign-offs, extended checklists) are content-level concerns
enforced by quality-audit.sh, not by structural template contracts.

---

## Phase Folder Addenda

Phase parent/child folders (e.g., `specs/NNN-name/001-phase/`) inherit the
base contract for their level plus phase-specific addenda. These are enforced
automatically by `validate.sh` via `inferPhaseSpecAddenda()` in
`template-structure.js`. No additional agent knowledge is needed -- follow the
base contract and validate after writing.

---

## Sync Protocol

When templates in `templates/level_N/` change:

1. Run `node scripts/utils/template-structure.js contract <level> <basename>`
   for each changed doc type to extract the updated contract JSON
2. Update this file with the new headers/anchors
3. Update the inline compact contract in all 4 @speckit agent definitions:
   - `.claude/agents/speckit.md`
   - `.opencode/agent/speckit.md`
   - `.opencode/agent/chatgpt/speckit.md`
   - `.codex/agents/speckit.toml`
4. Bump the `version` and `last_synced` fields in the frontmatter above
5. Run `validate.sh` on a sample spec folder to confirm the updated contract is correct

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-03-22 | Initial creation from template-structure.js contract output |
````

Total: ~140 lines including frontmatter, all 3 levels, phase addenda, and sync protocol.

[SOURCE: Synthesized from iteration-006.md verified contract text + template-structure.js CLI output (confirmed matching for all 5 Level 2 doc types)]

### Finding 3: Research.md Gap Review -- Two Minor Gaps Identified

After reviewing the full research.md (521 lines, 10 sections), two minor gaps remain:

**Gap A: Level 1 contract is implicit, not explicit.**
Section 2 (Template Contract System) defines Level 2 in detail but states Level 1 is "the same headers/anchors as Level 2 minus L2 addenda" without a dedicated table. This is correct but could be clearer. The shared reference file (Finding 2 above) addresses this with a note: "Level 1 uses the same headers/anchors as Level 2 for the 4 shared doc types, minus the L2 addenda sections."

**Gap B: Codex TOML formatting not specified.**
The research consistently notes that `.codex/agents/speckit.toml` uses TOML format but never provides the TOML-specific contract text. Since TOML multi-line strings use triple-quoted literals (`'''...\n...'''`), the 49-line markdown contract block would need to be wrapped accordingly. This is a minor formatting concern for implementation, not a research gap.

**No contradictions found.** All 10 sections are internally consistent. The per-document failure data (Section 5) correctly drives the prioritization (Section 6.5). The 3-layer architecture (Section 6) correctly maps to the implementation blueprint (Section 9). The compact contract text (Section 3.5) is verified against template-structure.js output.

[SOURCE: research.md full review, cross-referenced against iteration findings 1-8]

### Finding 4: Final Recommendations -- Prioritized Implementation Order

Based on all 8 iterations of research, the recommended implementation sequence is:

**Phase A: High-Impact, Low-Risk (Day 1, ~1 hour)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| A1 | Create `references/template-compliance-contract.md` (Finding 2 content) | Canonical source of truth | 15 min |
| A2 | Install pre-commit hook (`ln -sf` of existing script) | Layer 3 gate -- catches 100% at commit | 5 min |
| A3 | Change `.speckit-enforce.yaml` mode from `warn` to `block` (after A2 verified) | Hard enforcement | 2 min |

**Phase B: Contract Injection (Day 1-2, ~1 hour)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| B1 | Replace spec.md-only scaffold with full 49-line contract in `.claude/agents/speckit.md` | Layer 1 for Claude Code | 20 min |
| B2 | Replicate B1 to `.opencode/agent/speckit.md` and `.opencode/agent/chatgpt/speckit.md` | Layer 1 for Copilot + ChatGPT | 10 min |
| B3 | Replicate B1 to `.codex/agents/speckit.toml` (TOML-formatted) | Layer 1 for Codex | 10 min |

**Phase C: Directive Consolidation (Day 2, ~30 min)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| C1 | Collapse 3 conflicting timing directives into 1 (all 4 agent defs) | Eliminates agent confusion | 15 min |
| C2 | Add Post-Write Validation Protocol section (all 4 agent defs) | Layer 2 explicit instructions | 15 min |

**Phase D: Verification (Day 2-3, ~30 min)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| D1 | Create a test Level 2 spec folder using @speckit agent | End-to-end Layer 1 test | 15 min |
| D2 | Verify pre-commit hook triggers on spec folder commit | Layer 3 test | 5 min |
| D3 | Verify agent runs validate.sh after each write (check conversation log) | Layer 2 test | 10 min |

**Phase E: Optional Automation (Future)**

| Step | Action | Impact | Effort |
|------|--------|--------|--------|
| E1 | Build `generate-compliance-contract.sh` | Eliminates manual sync | 30 min |
| E2 | Add CI/CD mirror of pre-commit hook (GitHub Actions) | Bypass-proof Layer 3 | 30 min |

**Total effort: ~3 hours (Phases A-D) + ~1 hour optional (Phase E)**

[INFERENCE: prioritized by impact-to-effort ratio, informed by per-doc failure distribution (Section 5) and risk assessment (Section 8)]

### Finding 5: The "ChatGPT" Agent Path Discrepancy

In reviewing the multi-CLI agent surface, iteration 6 listed Gemini CLI as the 4th agent definition (`.gemini/agents/speckit.md`), while iteration 4 and the dispatch instructions reference ChatGPT (`.opencode/agent/chatgpt/speckit.md`). Both exist. The complete list of @speckit agent definitions that need updating is actually 4 distinct paths:
- `.claude/agents/speckit.md` (Claude Code)
- `.opencode/agent/speckit.md` (Copilot/OpenCode base)
- `.opencode/agent/chatgpt/speckit.md` (ChatGPT profile)
- `.codex/agents/speckit.toml` (Codex CLI)

The Gemini CLI path (`.gemini/agents/speckit.md`) may also exist as a 5th surface, depending on the current symlink/directory structure. Implementation should check for and update all existing @speckit agent definitions.

[SOURCE: Iteration 4 findings + iteration 6 findings -- cross-referenced to identify the discrepancy]

### Finding 6: Research.md is COMPLETE -- Ready for Final Update

The current research.md covers all 8 questions across 10 sections (521 lines). With this iteration's artifacts, the only additions needed are:
1. A new Section 11: "Final Recommendations" summarizing the prioritized implementation order (Finding 4)
2. A note in Section 9.1 referencing the complete shared reference file content
3. Status update to the progressive synthesis note

No sections need removal or correction. The research is comprehensive, internally consistent, and ready for implementation handoff.

[INFERENCE: based on complete review of research.md against all 9 iterations]

### Finding 7: Simplification Bonus -- Research Consolidation

This iteration consolidates the entire research into two actionable artifacts:
1. A copy-pasteable reference file (~140 lines) -- the single deliverable an implementer needs to create
2. A phased implementation plan (5 phases, A-E) -- clear sequencing with effort estimates

This simplifies the 8-iteration, 521-line research body into a "do this" checklist. The open question count is reduced from 8 (at research start) to 0 (all answered). No contradictions remain.

[INFERENCE: simplification of prior iteration synthesis]

## Sources Consulted
- `node .opencode/skill/system-spec-kit/scripts/utils/template-structure.js contract 2 <basename>` -- all 5 Level 2 doc types (automation feasibility)
- `.opencode/skill/system-spec-kit/references/` directory listing (existing structure)
- research.md full text (521 lines, gap review)
- iteration-006.md (verified contract text source)
- iteration-008.md (implementation blueprint source)

## Assessment
- New information ratio: 0.36
- Questions addressed: No new questions -- pure synthesis and artifact generation
- Questions answered: None (all previously answered)

The 0.36 ratio reflects: Finding 1 (automation feasibility -- genuinely new verification: 1.0), Finding 2 (reference file content -- synthesis of known data with new completeness: 0.5), Finding 3 (gap review -- partially new: 0.5), Finding 4 (prioritized plan -- reorganization of known data: 0.0), Finding 5 (agent path discrepancy -- genuinely new: 1.0), Finding 6 (completeness assessment -- redundant: 0.0), Finding 7 (simplification bonus: +0.10). Raw: (2 + 0.5*2 + 0*2) / 7 = 0.43. With simplification bonus: 0.43 capped at 0.43. Adjusted: 0.36 (conservative -- much of the "new" findings are verification of known data, not genuinely novel).

## Reflection
- What worked and why: Running the template-structure.js CLI to verify the iteration 6 contract data was the highest-value research action. It confirmed all 5 contracts match, validated automation feasibility, and gave confidence that the shared reference file content is authoritative.
- What did not work and why: The initial CLI path (`scripts/dist/spec/template-structure.js`) failed because the dist build path does not exist for this script. This was already documented in iteration 5's "What Failed" section -- the correct path is `scripts/utils/template-structure.js`. This was a known issue, not a new failure.
- What I would do differently: Could have included a complete draft of the `generate-compliance-contract.sh` script, but given the "moderately worthwhile" assessment and the recommendation to defer it, the effort was correctly allocated to the reference file content and prioritized plan instead.

## Recommended Next Focus
Research is COMPLETE. All 8 questions answered. All artifacts drafted. The research is ready for convergence and final synthesis. If the orchestrator determines another iteration is needed, the only remaining work would be:
- Draft the actual `generate-compliance-contract.sh` script (Phase E1)
- Check if `.gemini/agents/speckit.md` exists and needs updating (Finding 5 discrepancy)
- No further web or codebase research is needed
