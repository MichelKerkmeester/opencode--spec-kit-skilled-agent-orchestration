---
title: "...d-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence/plan]"
description: "Execution plan for PR-5 and PR-6 only: trigger-phrase sanitization, semantic-topic adjacency hardening, and a precedence-only decision gate with degraded-payload safety."
trigger_phrases:
  - "phase 3 implementation plan"
  - "pr-5"
  - "pr-6"
  - "trigger phrase sanitizer"
  - "decision precedence"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
---
# Implementation Plan: Phase 3 — Sanitization & Decision Precedence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase 3 executes the packet's P2 band by landing PR-5 and PR-6 in sequence: first the D3 sanitization work, then the D2 precedence-only gate. The parent packet and PR train already establish that ordering, and the research explains why D3 should land before D2: D3 is a multi-owner retrieval cleanup, while D2 is semantically critical but must stay narrow enough to protect degraded fallback behavior. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:216-223] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159]

The implementation strategy is intentionally small-surface. PR-5 extracts a reusable sanitizer module and wires it into the two D3 owners without deleting `ensureMinTriggerPhrases()`. PR-6 hardens the lexical predicate inside `extractDecisions()` so authored decisions always win when authoritative arrays exist, but degraded lexical fallback remains intact when those arrays are genuinely absent. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1459-1469] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-73]

Verification is fixture-led. F-AC3 proves the sanitizer removes empirical junk with zero observed false positives, F-AC2 proves placeholders are blocked when authored decisions exist, and the degraded-payload regression proves Phase 3 did not over-tighten D2. Full `generate-context.js` runs are reserved for final confirmation after localized tests pass. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:40-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1512-1518] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]
<!-- /ANCHOR:summary -->

---

### Technical Approach

### Approach Summary

The D3 path needs a dedicated sanitization primitive because the defect is split across two owners and the empirical corpus work already defined stable junk classes. The sanitizer should therefore expose narrow, testable rules for path fragments, standalone stopwords, synthetic bigrams, suspicious prefixes, and allowlisted short names. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:65-65] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39]

The workflow integration point stays at the existing folder-token append seam because that is the place where filtered triggers are re-polluted today. The semantic-topic integration point stays at the n-gram emission seam because D3's bigram artifact is created after stopword removal collapses non-adjacent terms into adjacent ranked pairs. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:23-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1465-1469]

The D2 path stays inside `extractDecisions()`. Iteration 13 ruled out a merge/clobber theory and showed that the correct patch boundary is the lexical admission predicate itself, because raw decision arrays only become visible upstream through normalization and are otherwise invisible to the extractor. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-78]

### Technical Context

| Aspect | Value | Source |
|--------|-------|--------|
| Language / Stack | TypeScript / Node-based save pipeline | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] |
| Primary Runtime Surface | `generate-context.js` save workflow with localized helper owners | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237] |
| Main Files | `workflow.ts`, `semantic-signal-extractor.ts`, `decision-extractor.ts`, new `trigger-phrase-sanitizer.ts` | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] |
| Test Style | Fixture replay first, full save-pipeline confirmation last | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237] |

### Design Constraints

- Keep `ensureMinTriggerPhrases()` in place because the packet explicitly retained it as the low-count fallback. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1467-1467]
- Keep D2 precedence-only. The plan cannot introduce a blanket lexical shutdown keyed off mode alone. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1461-1463]
- Keep D3 mode-agnostic because capture mode shares the same D3 defect class. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1467-1469]
- Prefer shape-based filtering over semantic suppression so the sanitizer does not overreach into valid domain terms. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1467-1468] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:53-59]

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The PR-5 empirical blocklist and allowlist have been frozen from iteration 15 before integration begins. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39]
- The D2 patch boundary is anchored to `decision-extractor.ts:381-384`, not to a later merge or mode gate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-48]
- Fixture ownership for F-AC3, F-AC2, and degraded payload is defined before code changes begin. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159]

### Definition of Done

- F-AC3 is green with zero observed false positives. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:41-44]
- F-AC2 and degraded-payload regression are green together. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]
- `validate.sh` exits 0 for the phase folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The Phase 3 architecture is intentionally seam-based rather than pipeline-wide. PR-5 inserts one reusable sanitizer at the two D3 owners, while PR-6 tightens one lexical predicate inside `extractDecisions()`. No new save mode, packet-wide refactor, or reviewer contract is introduced here. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/plan.md:57-73]
<!-- /ANCHOR:architecture -->

---

## 4. IMPLEMENTATION PHASES

### Phase 1: PR-5 trigger-phrase sanitization

PR-5 creates a new `lib/trigger-phrase-sanitizer.ts` and centralizes the empirical filter rules validated in iteration 15. The module should own the path-fragment matcher, standalone stopword blocker, suspicious-prefix matcher, synthetic-bigram blocker, and allowlist handling for legitimate short names. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39]

The workflow change should stop trusting the current post-filter folder-token append. Instead of appending raw folder tokens after filtering, PR-5 routes those candidates through the sanitizer so the same empirical rules apply before the phrases are persisted. This preserves the fallback intent while removing the exact D3 leak path identified in iteration 4. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:23-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82]

The semantic-topic change should apply the same narrow contract to topic candidates, but with adjacency awareness layered in. Iteration 4 showed that the bad bigrams are not just low-quality topics; they are artifacts created by counting n-grams after stopword collapse. PR-5 therefore needs a gate that rejects topic phrases lacking source adjacency rather than only filtering output words. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:25-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:117-123]

The required safety property for PR-5 is zero observed false positives against the tuned corpus categories. The plan should therefore keep the allowlist small and explicit and should not expand beyond the observed short-name cases or the empirically justified regex classes. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:41-55] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1467-1468]

### Phase 2: PR-6 decision precedence-only gate

PR-6 stays inside `decision-extractor.ts` and treats the lexical predicate as the patch boundary. Iteration 13 makes the branch explicit: placeholders are only emitted when `decisionObservations.length === 0 && processedManualDecisions.length === 0`. The Phase 3 change hardens that branch so authoritative raw decisions can block lexical fallback even when normalization missed. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-73] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159]

The plan should not frame PR-6 as "disable lexical fallback for JSON mode." That wording is explicitly rejected by the research. The correct framing is "authored decisions always win when they exist; degraded lexical fallback remains available when they do not." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1461-1463]

The plan should pair the lexical gate with an authored-decision reader or equivalent predicate input that can distinguish real decision arrays from genuinely decision-less payloads. Iteration 13's patch sketch gives the intended shape: surface raw decisions first, then add `rawKeyDecisions.length === 0` to the lexical gate. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:48-63]

The required safety property for PR-6 is degraded-payload preservation. The phase must prove that decision-like narrative in summary or prompts still yields a decision section when no authoritative raw arrays exist. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

---

### File:Line Change List

| File / Line Range | Change | Why Here | Source |
|-------------------|--------|----------|--------|
| `workflow.ts:1271-1298` | Route folder-derived trigger additions through the sanitizer and stop persisting unsanitized appended tokens. | This is the exact D3 frontmatter leak owner and the PR-5 owner map entry. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:23-30] |
| `semantic-signal-extractor.ts:260-284` | Add adjacency-aware rejection for synthetic bigrams and sanitize surviving topic phrases. | This is the D3 topic-artifact owner and the second PR-5 seam. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-004.md:25-29] |
| `decision-extractor.ts:182-185` | Surface authored raw decisions at the extractor boundary or make them available to the lexical gate. | This is where the normalized/manual decision path enters `extractDecisions()`. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:66-73] |
| `decision-extractor.ts:381-384` | Tighten the lexical predicate so placeholders only run when both normalized/manual decisions and raw authored decisions are absent. | This is the exact D2 precedence gate identified by iteration 13. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:47-48] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:69-73] |
| `lib/trigger-phrase-sanitizer.ts` | Create the shared sanitizer contract, header comment, allowlist, and empirical blocklist categories. | PR-5 explicitly calls for a new module rather than scattered inline filtering. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39] |
| Fixture files for F-AC3 | Add fixture coverage for path fragments, standalone stopwords, synthetic bigrams, suspicious prefixes, and allowlist preservation. | The empirical filter needs category-by-category proof, not only one end-to-end replay. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:48-59] |
| Fixture files for F-AC2 and degraded payload | Add one authored-decision fixture and one degraded-payload fixture. | The D2 gate has two success conditions and both are called out in the research. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517] |

---

<!-- ANCHOR:phases -->
### Order of Operations

1. Freeze the PR-5 empirical contract by translating iteration-15 blocklist classes and allowlist values into a module-level spec and header comment. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39]

2. Build sanitizer unit tests before wiring the integration points so path fragments, stopwords, suspicious prefixes, synthetic bigrams, and allowlisted short names have stable expectations. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:48-59]

3. Integrate the sanitizer into `workflow.ts:1271-1298` and verify that the fallback behavior still routes through `ensureMinTriggerPhrases()` when phrase counts are genuinely low. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:82-82] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:214-214]

4. Integrate the sanitizer and adjacency gate into `semantic-signal-extractor.ts:260-284`, then run F-AC3 fixture replays for both saved triggers and rendered topics. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:117-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158]

5. Add or expose the authored-decision input needed by `extractDecisions()` so the lexical gate can distinguish authoritative raw arrays from truly decision-less payloads. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:48-63]

6. Tighten the lexical predicate at `decision-extractor.ts:381-384` and run F-AC2 plus degraded-payload regression fixtures immediately after the patch. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

7. Run `generate-context.js --json` against the Phase 3 fixtures only after localized tests pass, because the research treats full pipeline runs as final confirmation rather than first-line debugging. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]

8. Run `validate.sh` on this phase folder, then update the parent phase map status as a separate closeout step once the child packet is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/tasks.md:89-90]
<!-- /ANCHOR:phases -->

---

### Risks & Mitigations

| Risk | Severity | Mitigation | Source |
|------|----------|------------|--------|
| The sanitizer over-filters valid short names or legitimate phrases. | High | Keep the allowlist narrow, test each empirical blocklist category directly, and hold the phase to zero observed false positives. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:41-55] |
| Generic singleton residue such as `graph` or `research` leads engineers to broaden the regex too far. | Medium | Keep singleton suppression out of the initial sanitizer unless a separate reviewer or frequency-based rule is proven safe. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:45-47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:55-59] |
| The D2 gate is implemented as a mode-wide lexical shutdown and breaks degraded payloads. | High | Keep the predicate keyed to authored decision presence only, and require the degraded-payload regression fixture to pass before closeout. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1461-1463] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517] |
| Engineers treat D2 as a merge-order bug instead of a predicate-boundary bug and patch the wrong seam. | Medium | Anchor the work to iteration 13's call graph and patch boundary inside `extractDecisions()`. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-78] |
| Capture mode regresses because D3 filtering is implemented as JSON-mode-only logic. | Medium | Keep the D3 sanitizer mode-agnostic and run the shared save-path fixtures after PR-5 lands. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1467-1469] |

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Unit and helper tests

- Sanitizer unit tests must cover each empirical class independently: path fragments, standalone stopwords, synthetic bigrams, suspicious prefixes, and allowlist preservation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:31-39] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:48-59]
- Decision-extractor tests must cover authored raw arrays, missing normalized carriers, and decision-less degraded payloads. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:81-81] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]

### Fixture replays

| Fixture | Purpose | Pass Condition | Source |
|---------|---------|----------------|--------|
| F-AC3 | D3 sanitization acceptance | No junk trigger phrases or synthetic topic bigrams remain in the saved output. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1158] |
| F-AC2 | D2 authored-decision precedence | No `observation decision N` or `user decision N` placeholders appear when authored decisions exist. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159] |
| Degraded-payload regression | D2 fallback preservation | A meaningful decision section still renders when authored arrays are absent but narrative decisions remain. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517] |
| F-AC1 and F-AC7 smoke replays | Sibling-phase regression guard | Phase 3 does not accidentally break the shared truncation or anchor fixes already assigned to earlier phases. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1514-1518] |

### Final confirmation

- Run `generate-context.js --json` against the authored-decision, degraded-payload, and D3 fixture set after localized tests are green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:237-237]
- Run `validate.sh` on `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/003-sanitization-precedence/` before claiming the phase is complete. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Why It Matters | Source |
|------------|--------|----------------|--------|
| Parent Phase 2 completion | Required | The packet orders this child after `002-single-owner-metadata`. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:198-199] |
| PR owner map | Required | The file:line change list is anchored to PR-5 and PR-6 only. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159] |
| Iteration 13 precedence analysis | Required | It fixes the D2 patch boundary and degraded-fallback guard. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:44-73] |
| Iteration 15 filter-list build | Required | It fixes the D3 blocklist, allowlist, and zero-false-positive target. | [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:21-59] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- If PR-5 introduces false positives or broken topic output, revert the sanitizer integration seams while keeping the research-backed blocklist in the packet docs for rework. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:41-55]

- If PR-6 suppresses degraded fallback, revert the precedence gate to the prior lexical predicate and restore behavior while retaining the regression fixture for the next attempt. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-013.md:63-64] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1517-1517]
<!-- /ANCHOR:rollback -->

---

### Rollout

### Landing sequence

PR-5 lands before PR-6 because the parent packet and PR train define D3 as the first P2 item, and because PR-5 reduces retrieval noise without changing decision semantics. PR-6 then lands on top of the sanitized trigger/topic path so the phase exits with both P2 criteria satisfied. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:216-223] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1158-1159]

### Exit criteria

- F-AC3 green, with zero observed false positives confirmed for the sanitizer rules. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-015.md:41-44]
- F-AC2 green for authored decisions. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1159-1159]
- Degraded-payload regression green. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-199]
- `validate.sh` exit 0 on the child phase folder. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]

### Handoff

Once the exit criteria are met, the parent packet can mark the Phase 3 -> Phase 4 handoff row complete because the required D2 and D3 fixtures are part of that row's verification clause. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:199-200]
