# Tasks: 016-Tooling-and-Scripts Manual Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify all 28 scenario files exist in playbook/16--tooling-and-scripts/
- [ ] T002 [P] Confirm generate-context.js runs without errors
- [ ] T003 [P] Prepare sandbox folders for destructive tests (PHASE-002 through PHASE-005, 099, 113)
- [ ] T004 [P] Identify available CLI environments for M-007e through M-007i (OpenCode, Claude, Codex, Copilot, Gemini)
- [ ] T005 Confirm MCP runtime availability for memory_save and slash-command scenarios
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T006: Group A -- Phase Workflow (5 IDs)
- [ ] T006 Execute PHASE-001 through PHASE-005
  - PHASE-001: Phase detection scoring
  - PHASE-002: Phase folder creation
  - PHASE-003: Recursive phase validation
  - PHASE-004: Phase link validation
  - PHASE-005: Phase command workflow

### T007: Group B -- Main-Agent Review (1 ID)
- [ ] T007 Execute M-004: Main-Agent Review and Verdict Handoff

### T008: Group C -- Session Capturing Pipeline Quality (18 IDs)
- [ ] T008 Execute M-007 parent + M-007a through M-007q (18 IDs total)
  - M-007: Session Capturing Pipeline Quality (parent)
  - M-007a: JSON authority and successful indexing
  - M-007b: Thin JSON insufficiency rejection
  - M-007c: Explicit-CLI mis-scoped captured-session warning
  - M-007d: Spec-folder and git-context enrichment presence
  - M-007e: OpenCode precedence
  - M-007f: Claude fallback
  - M-007g: Codex fallback
  - M-007h: Copilot fallback
  - M-007i: Gemini fallback
  - M-007j: Final NO_DATA_AVAILABLE hard-fail
  - M-007k: V10-only captured-session save warns
  - M-007l: V8/V9 captured-session contamination abort
  - M-007m: --stdin structured JSON with explicit CLI target
  - M-007n: --json structured JSON with payload-target fallback
  - M-007o: Claude tool-path downgrade vs non-Claude capped path
  - M-007p: Structured-summary JSON coverage and file-backed authority
  - M-007q: Phase 018 output-quality hardening

### T009: Group D -- Tooling and Script Utilities (20 IDs)
- [ ] T009a Execute 061: Tree thinning for spec folder consolidation (PI-B1)
- [ ] T009b Execute 062: Progressive validation for spec documents (PI-B2)
- [ ] T009c Execute 070: Dead code removal
- [ ] T009d Execute 089: Code standards alignment
- [ ] T009e Execute 099: Real-time filesystem watching (P1-7)
- [ ] T009f Execute 108: Spec 007 finalized verification command suite evidence
- [ ] T009g Execute 113: Standalone admin CLI
- [ ] T009h Execute 127: Migration checkpoint scripts
- [ ] T009i Execute 128: Schema compatibility validation
- [ ] T009j Execute 135: Grep traceability for feature catalog code references
- [ ] T009k Execute 136: Feature catalog annotation name validity
- [ ] T009l Execute 137: Multi-feature annotation coverage
- [ ] T009m Execute 138: MODULE: header compliance via verify_alignment_drift.py
- [ ] T009n Execute 139: Session capturing pipeline quality
- [ ] T009o Execute 147: Constitutional memory manager command
- [ ] T009p Execute 149: Rendered memory template contract
- [ ] T009q Execute 150: Source-dist alignment validation
- [ ] T009r Execute 151: MODULE_MAP.md accuracy validation
- [ ] T009s Execute 152: No symlinks in lib/ tree
- [ ] T009t Execute 154: JSON-primary deprecation posture

### T010: Group E -- JSON Mode Structured Summary Hardening (16 IDs)
- [ ] T010 Execute 153 parent + 153-A through 153-O (16 IDs total)
  - 153: JSON mode structured summary hardening (parent)
  - 153-A: Post-save quality review output verification
  - 153-B: sessionSummary propagates to frontmatter title
  - 153-C: triggerPhrases propagate to frontmatter trigger_phrases
  - 153-D: keyDecisions propagate to non-zero decision_count
  - 153-E: importanceTier propagates to frontmatter importance_tier
  - 153-F: contextType propagates for full documented valid enum
  - 153-G: Contamination filter cleans hedging in sessionSummary
  - 153-H: Fast-path filesModified to FILES conversion
  - 153-I: Unknown field warning for typos
  - 153-J: contextType enum rejection
  - 153-K: Quality score discriminates contaminated vs clean
  - 153-L: Trigger phrase filter removes path fragments
  - 153-M: Embedding retry stats visible in memory_health
  - 153-N: Default-on pre-save overlap warning uses exact content match
  - 153-O: projectPhase override propagates to frontmatter
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify all 60 scenario IDs have captured evidence
- [ ] T012 Assign PASS / PARTIAL / FAIL verdict per scenario using review protocol
- [ ] T013 Update checklist with evidence references for all 5 groups
- [ ] T014 Clean up sandbox folders created during testing
- [ ] T015 Complete implementation-summary.md with execution results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 60 scenarios have evidence-backed verdicts
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
