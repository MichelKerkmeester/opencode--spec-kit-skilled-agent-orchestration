---
title: "Implementat [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-memory-save-quality-fixes/plan]"
description: "This plan delivered eight targeted backend fixes across the memory-save extraction pipeline, then verified them with rebuilds, tests, and independent reviews."
trigger_phrases:
  - "memory save quality plan"
  - "018 memory save quality fixes"
  - "generate-context remediation"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: level_2/plan.md | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/018-memory-save-quality-fixes"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
key_topics:
  - "extractor fixes"
  - "review process"
  - "test verification"
level: 2
---
# Implementation Plan: Memory Save Quality Root Cause Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/plan.md | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript dist output, and Markdown documentation |
| **Framework** | system-spec-kit memory-save and `generate-context` pipeline |
| **Storage** | Filesystem-backed memory artifacts |
| **Testing** | Vitest, `generate-context.js --help`, shared/dist rebuild verification |

### Overview
This phase treated the remaining save-quality defects as a focused root-cause remediation pass. The implementation touched only existing extractor, normalizer, thinning, and dist surfaces, grouped the eight fixes by severity, and used targeted regression tests plus two independent ultra-think reviews to confirm the combined change set was safe.

### Files Modified

| File | Fixes | Why It Changed |
|------|-------|----------------|
| `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` | 1 | Separate decision title, rationale, and chosen output |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | 2 | Recover completion detection from observation-based Next Steps |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | 3 | Replace broad blocker keywords with structural patterns |
| `.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts` | 4 | Stop generic pattern filler and substring inflation |
| `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts` | 5 | Improve trigger quality filtering and preserve technical short words |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | 6 | Parse more separator variants in `filesModified` |
| `.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts` | 7 | Reduce over-merging and keep more useful file nodes |
| `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts` | 8 | Synthesize richer conversations from structured JSON |
| `.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts` | 5 | Align the golden expectation with intentional new behavior |
| `.opencode/skill/system-spec-kit/shared/dist/trigger-extractor.js` | 5 | Keep the shipped dist artifact in sync with source |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All eight root-cause fixes shipped in the intended files
- [x] Targeted tests and CLI smoke checks passed
- [x] Docs updated (spec, plan, tasks, checklist, implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted defect remediation across existing extractor, normalizer, rendering, and verification surfaces.

### Key Components
- **Extraction logic**: Decision, session, implementation-guide, and conversation extractors own Fixes 1, 2, 3, 4, and 8.
- **Normalization and signal quality**: The input normalizer and trigger extractor own Fixes 5 and 6.
- **Rendering controls**: Tree thinning owns Fix 7 and determines how file nodes stay visible in the final memory output.

### Data Flow
Structured or normalized session data enters the extraction layer first, quality filters and path parsing refine that data next, and tree thinning plus conversation synthesis shape the final rendered memory output that downstream validation and review inspect.

### Review Process

| Review Stage | Focus | Outcome |
|--------------|-------|---------|
| Review 1 | Independent GPT-5.4 ultra-think inspection | Found the Fix 4 substring bug and Fix 5 over-aggressive short-word filtering |
| Review Fix Pass | Apply review findings | Added word-boundary regex matching and expanded the short-word allowlist |
| Review 2 | Independent GPT-5.4 ultra-think re-review | All eight fixes passed, low risk, ready to ship |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the eight root causes from the manual memory-file review
- [x] Freeze the in-scope file list and keep template or MCP-server changes out of scope
- [x] Identify the targeted regression suites and review checkpoints needed for sign-off

### Phase 2: Core Implementation
- [x] Deliver the three medium-severity fixes for decision rendering, completion detection, and blocker extraction
- [x] Deliver the three low-severity quality-gate fixes for patterns, trigger phrases, and file-path parsing
- [x] Deliver the two rendering fixes for tree thinning and conversation synthesis

### Phase 3: Verification
- [x] Rebuild `shared/dist` and update the intentional golden expectation
- [x] Run 106 targeted tests plus the `generate-context.js --help` smoke check
- [x] Complete both ultra-think reviews and rerun the final regression pass after the review fixes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | `runtime-memory-inputs`, `task-enrichment`, `generate-context-cli-authority`, and `semantic-signal-golden` | Vitest |
| Build Artifact | Trigger-extractor dist synchronization after Fix 5 | shared/dist rebuild |
| CLI Smoke | Basic command availability and argument parsing | `generate-context.js --help` |
| Manual Review | Structural output quality and cross-fix interaction review | Human inspection plus two ultra-think reviews |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `017-json-primary-deprecation` | Internal | Green | The quality-fix phase would lose the immediate contract baseline it follows |
| Existing targeted Vitest suites | Internal | Green | Regression confidence would drop sharply without the 106-test gate |
| `shared/dist` rebuild path | Internal | Green | Fix 5 would ship mismatched source and dist artifacts |
| Independent ultra-think review loop | Internal | Green | The substring and allowlist regressions from Review 1 might survive into the final ship state |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix reintroduces incorrect blocker detection, noisy trigger phrases, wrong completion status, or over-merged file trees in a post-merge check.
- **Procedure**: Revert the affected extractor or utility changes together, restore the last known-good golden expectation if needed, rebuild `shared/dist`, and rerun the targeted regression pack before redeploying.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Root-Cause Confirmation) ---> Phase 2 (Code Fixes) ---> Phase 3 (Verification)
                 \_______________________________________________/
                       review findings must be folded into the final pass
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Manual review of the flawed memory save | Core Implementation, Verification |
| Core Implementation | Setup | Verification |
| Verification | Setup, Core Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 4-6 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Root causes mapped to specific files
- [x] Golden test impact understood before changing expectations
- [x] Review checkpoints planned for heuristic-sensitive fixes

### Rollback Procedure
1. Revert the affected extractor, normalizer, thinning, or conversation-synthesis changes.
2. Restore the prior golden expectation if the trigger-filter behavior is rolled back.
3. Rebuild `shared/dist` so the shipped artifact matches the restored source.
4. Re-run the 106-test targeted pack and the CLI smoke check before re-shipping.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
