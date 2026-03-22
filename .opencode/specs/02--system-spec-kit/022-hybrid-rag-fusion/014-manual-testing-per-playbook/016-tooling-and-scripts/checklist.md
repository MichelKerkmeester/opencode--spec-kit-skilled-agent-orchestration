# Verification Checklist: 016-Tooling-and-Scripts Manual Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All 28 scenario files verified to exist in playbook/16--tooling-and-scripts/
- [ ] CHK-002 [P0] Scope locked to exactly 60 scenario IDs as defined in spec.md
- [ ] CHK-003 [P1] Feature catalog cross-references verified for all 17 catalog entries
- [ ] CHK-004 [P1] Sandbox folders prepared for destructive tests
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Group A: Phase Workflow (5 IDs)
- [ ] CHK-010 [P0] PHASE-001: Phase detection scoring executed with evidence
- [ ] CHK-011 [P0] PHASE-002: Phase folder creation executed with evidence
- [ ] CHK-012 [P0] PHASE-003: Recursive phase validation executed with evidence
- [ ] CHK-013 [P0] PHASE-004: Phase link validation executed with evidence
- [ ] CHK-014 [P0] PHASE-005: Phase command workflow executed with evidence

### Group B: Main-Agent Review (1 ID)
- [ ] CHK-015 [P0] M-004: Main-Agent Review and Verdict Handoff executed with evidence

### Group C: Session Capturing Pipeline Quality (18 IDs)
- [ ] CHK-020 [P0] M-007: Session Capturing Pipeline Quality parent executed with evidence
- [ ] CHK-021 [P0] M-007a: JSON authority and successful indexing verified
- [ ] CHK-022 [P0] M-007b: Thin JSON insufficiency rejection verified
- [ ] CHK-023 [P0] M-007c: Explicit-CLI mis-scoped captured-session warning verified
- [ ] CHK-024 [P0] M-007d: Spec-folder and git-context enrichment presence verified
- [ ] CHK-025 [P0] M-007e: OpenCode precedence verified
- [ ] CHK-026 [P0] M-007f: Claude fallback verified
- [ ] CHK-027 [P0] M-007g: Codex fallback verified
- [ ] CHK-028 [P0] M-007h: Copilot fallback verified
- [ ] CHK-029 [P0] M-007i: Gemini fallback verified
- [ ] CHK-030 [P0] M-007j: Final NO_DATA_AVAILABLE hard-fail verified
- [ ] CHK-031 [P0] M-007k: V10-only captured-session save warns verified
- [ ] CHK-032 [P0] M-007l: V8/V9 captured-session contamination abort verified
- [ ] CHK-033 [P0] M-007m: --stdin structured JSON with explicit CLI target verified
- [ ] CHK-034 [P0] M-007n: --json structured JSON with payload-target fallback verified
- [ ] CHK-035 [P0] M-007o: Claude tool-path downgrade vs non-Claude capped path verified
- [ ] CHK-036 [P0] M-007p: Structured-summary JSON coverage and file-backed authority verified
- [ ] CHK-037 [P0] M-007q: Phase 018 output-quality hardening verified

### Group D: Tooling and Script Utilities (20 IDs)
- [ ] CHK-040 [P0] 061: Tree thinning for spec folder consolidation (PI-B1) executed with evidence
- [ ] CHK-041 [P0] 062: Progressive validation for spec documents (PI-B2) executed with evidence
- [ ] CHK-042 [P0] 070: Dead code removal executed with evidence
- [ ] CHK-043 [P0] 089: Code standards alignment executed with evidence
- [ ] CHK-044 [P0] 099: Real-time filesystem watching (P1-7) executed with evidence
- [ ] CHK-045 [P0] 108: Spec 007 finalized verification command suite evidence executed
- [ ] CHK-046 [P0] 113: Standalone admin CLI executed with evidence
- [ ] CHK-047 [P0] 127: Migration checkpoint scripts executed with evidence
- [ ] CHK-048 [P0] 128: Schema compatibility validation executed with evidence
- [ ] CHK-049 [P0] 135: Grep traceability for feature catalog code references executed with evidence
- [ ] CHK-050 [P0] 136: Feature catalog annotation name validity executed with evidence
- [ ] CHK-051 [P0] 137: Multi-feature annotation coverage executed with evidence
- [ ] CHK-052 [P0] 138: MODULE: header compliance via verify_alignment_drift.py executed with evidence
- [ ] CHK-053 [P0] 139: Session capturing pipeline quality executed with evidence
- [ ] CHK-054 [P0] 147: Constitutional memory manager command executed with evidence
- [ ] CHK-055 [P0] 149: Rendered memory template contract executed with evidence
- [ ] CHK-056 [P0] 150: Source-dist alignment validation executed with evidence
- [ ] CHK-057 [P0] 151: MODULE_MAP.md accuracy validation executed with evidence
- [ ] CHK-058 [P0] 152: No symlinks in lib/ tree executed with evidence
- [ ] CHK-059 [P0] 154: JSON-primary deprecation posture executed with evidence

### Group E: JSON Mode Structured Summary Hardening (16 IDs)
- [ ] CHK-060 [P0] 153: JSON mode structured summary hardening parent executed with evidence
- [ ] CHK-061 [P0] 153-A: Post-save quality review output verification verified
- [ ] CHK-062 [P0] 153-B: sessionSummary propagates to frontmatter title verified
- [ ] CHK-063 [P0] 153-C: triggerPhrases propagate to frontmatter trigger_phrases verified
- [ ] CHK-064 [P0] 153-D: keyDecisions propagate to non-zero decision_count verified
- [ ] CHK-065 [P0] 153-E: importanceTier propagates to frontmatter importance_tier verified
- [ ] CHK-066 [P0] 153-F: contextType propagates for full documented valid enum verified
- [ ] CHK-067 [P0] 153-G: Contamination filter cleans hedging in sessionSummary verified
- [ ] CHK-068 [P0] 153-H: Fast-path filesModified to FILES conversion verified
- [ ] CHK-069 [P0] 153-I: Unknown field warning for typos verified
- [ ] CHK-070 [P0] 153-J: contextType enum rejection verified
- [ ] CHK-071 [P0] 153-K: Quality score discriminates contaminated vs clean verified
- [ ] CHK-072 [P0] 153-L: Trigger phrase filter removes path fragments verified
- [ ] CHK-073 [P0] 153-M: Embedding retry stats visible in memory_health verified
- [ ] CHK-074 [P0] 153-N: Default-on pre-save overlap warning uses exact content match verified
- [ ] CHK-075 [P0] 153-O: projectPhase override propagates to frontmatter verified
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-080 [P0] All 60 scenario IDs have individual pass/fail evidence
- [ ] CHK-081 [P0] Zero untested scenarios remaining
- [ ] CHK-082 [P1] Evidence is reproducible (exact commands documented)
- [ ] CHK-083 [P1] Failures include exact error output verbatim
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-090 [P0] No secrets or credentials in any phase documents
- [ ] CHK-091 [P0] Destructive tests (099, 113, PHASE-002 through PHASE-005) use sandbox only
- [ ] CHK-092 [P1] Sandbox folders cleaned up after evidence capture
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-100 [P1] spec.md, plan.md, tasks.md, checklist.md synchronized
- [ ] CHK-101 [P1] Implementation-summary.md completed with execution results
- [ ] CHK-102 [P2] Memory save triggered for future session continuity
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-110 [P1] Temp files in scratch/ only
- [ ] CHK-111 [P1] scratch/ cleaned before completion
- [ ] CHK-112 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 68 | 0/68 |
| P1 Items | 9 | 0/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->
