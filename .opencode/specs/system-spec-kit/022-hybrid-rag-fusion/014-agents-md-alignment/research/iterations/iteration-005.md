# Iteration 005 - Cross-cutting Verification

## Finding Adjudication

### D3-001 - DOWNGRADED to P2

- `spec.md` still marks the phase `Complete` in metadata, while `implementation-summary.md` says the alignment work was "partially reverted by a subsequent AGENTS.md restructuring" (`spec.md:24-34`, `implementation-summary.md:14-15`, `implementation-summary.md:118-120`).
- Post-completion history does show repeated edits to `AGENTS.md` / `AGENTS_example_fs_enterprises.md` after `2026-03-16`, including commits `b55bee6`, `ab5d953`, `2f99460`, `6eb3aef`, `07615f7`, `9ee992b`, `2a014f6`, `2386729`, `7f7d00f`, `625088a`, `41a33e5`, and `2e2eff9`.
- But the inspected post-completion diffs do not substantiate an unrepaired revert of the alignment rows. `6eb3aef` changed the CocoIndex skill path only, while `9ee992b` / `2a014f6` changed memory-save syntax to JSON-primary. A targeted patch scan since `2026-03-16` found no deletions of `/memory:analyze`, `/memory:shared`, `ingest`, `budget`, `memory_context()`, or the `Gate 3 -> Gate 1 -> Gate 2` ordering.
- The packet's own verification surface still assumes those rows are present (`checklist.md:57-61`), and prior iteration evidence already showed the live greps still match.
- Adjudication: this is better characterized as a misleading/stale implementation-summary note than as a live P1 traceability contradiction between packet status and current implementation state.

### D3-002 - CONFIRMED (P1)

- The spec body still describes a narrow scope: `3 target files`, `5 gaps identified and fixed`, and `~36 LOC total change` (`spec.md:50-55`).
- The same spec body explicitly marks `CLAUDE.md` as out of scope and lists only the three AGENTS files as targets (`spec.md:72-87`).
- But the phase packet records materially broader work:
  - front matter description says the phase also overhauled skill sections and touched `CLAUDE.md` (`spec.md:1-3`);
  - tasks include `G-01` through `G-06`, two skill-section overhauls, and a changelog (`tasks.md:46-58`);
  - tasks summary says `Files modified | 5` and `Gaps fixed | 6 + skill overhaul` (`tasks.md:89-95`);
  - checklist evidence repeatedly counts `CLAUDE.md` in `4/4` verification checks (`checklist.md:57-61`);
  - implementation summary documents `G-01` through `G-06` plus the Universal/FS skill overhauls (`implementation-summary.md:69-80`).
- Adjudication: the maintained packet materially exceeds its declared scope, so the scope-drift finding stands at P1.

### D4-001 - CONFIRMED (P1)

- `014/spec.md` goes from `## 6. RISKS & DEPENDENCIES` directly to `## 10. OPEN QUESTIONS` (`spec.md:134-149`).
- The canonical Level 2 composed template includes three intervening sections before open questions: `## L2: NON-FUNCTIONAL REQUIREMENTS`, `## L2: EDGE CASES`, and `## L2: COMPLEXITY ASSESSMENT` (`.opencode/skill/system-spec-kit/templates/level_2/spec.md:109-160`).
- `template_guide.md` states Level 2 is `Core + level2-verify addendum`, making the composed Level 2 template the authoritative structure (`.opencode/skill/system-spec-kit/references/templates/template_guide.md:64-68`).
- Adjudication: the numbering gap is not explained by optional section omission; the packet skips required Level 2 structural sections and keeps the wrong section numbering.

### D3-003 - CONFIRMED (P2)

- Checklist evidence still cites old line numbers, e.g. CHK-001 through CHK-004 point to `AGENTS.md:53-57` and CHK-006 points to `FS:64` (`checklist.md:30-33`, `checklist.md:42`).
- Fresh live grep now resolves those rows at different locations: `AGENTS.md` lines `62`, `65`, `66`, `67`; `AGENTS_example_fs_enterprises.md` lines `71`, `88`, `91`, `92`, `93`.
- Adjudication: the checklist's evidence pointers are stale even though the underlying patterns are still present.

### D3-004 - CONFIRMED (P2)

- CHK-017 claims `GPT-5.4 ultra-think cross-AI review completed (Analytical 88, Critical 92, Holistic 88)` with evidence `review session documented` (`checklist.md:62`).
- Within the packet, the only corroborating reference is task `T9: GPT-5.4 ultra-think cross-AI review -- Validated G-01-G-04, surfaced G-05/G-06` (`tasks.md:50`).
- No preserved review artifact, score sheet, or transcript exists in the phase packet to back those numeric scores.
- Adjudication: the evidence trail is incomplete, so the finding remains valid at P2.

### D4-002 - CONFIRMED (P2)

- The trailing `Phase Navigation` block exists (`spec.md:153-160`) but is not wrapped in an anchor pair, unlike the packet's major sections above it.
- Adjudication: this remains a minor but real template-compliance / retrieval-structure defect.

### D4-003 - CONFIRMED (P2)

- `description.json` still uses the generic description string `"Specification: 014-agents-md-alignment"` (`description.json:2-3`).
- That description does not capture the actual scope now recorded in the packet (quick-reference fixes, six refinement gaps, skill overhauls, and CLAUDE.md involvement).
- Adjudication: the placeholder-style metadata finding stands.

## New Findings

- No new findings this iteration.
- Phase-system alignment cross-check passed:
  - the child packet includes `Parent Spec`, `Predecessor`, and `Successor` metadata (`spec.md:32-34`);
  - the parent `022` packet includes phase `014` in its `PHASE DOCUMENTATION MAP` (`../spec.md:87-105`);
  - the phase-system reference requires parent phase maps plus child back-references / predecessor-successor links (`../../021-spec-kit-phase-system/spec.md:141-154`).
- Result: 014 is structurally aligned with the 021 phase-linkage conventions; the remaining issues are documentation drift and template compliance, not broken parent/child phase wiring.
