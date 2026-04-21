---
title: "Feature Specification: Q4 NFKC Robustness Research (RR-1)"
description: "Deep-research sub-packet covering the RR-1 Tier 1 item. Research the canonical-equivalence attack surface and sanitizer-bypass risk for the NFKC normalization boundary added in 016 T-SAN-01/02/03. Wave 2 dispatch per ADR-001 of 019/001."
trigger_phrases:
  - "q4 nfkc robustness"
  - "nfkc canonical equivalence research"
  - "sanitizer bypass research"
  - "rr-1 nfkc"
  - "unicode normalization security"
importance_tier: "critical"
contextType: "research"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/003-q4-nfkc-robustness"
    last_updated_at: "2026-04-18T17:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Research packet scaffolded"
    next_safe_action: "Dispatch /spec_kit:deep-research :auto after Wave 1 convergence"
    blockers: []

---
# Feature Specification: Q4 NFKC Robustness Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Originating Source** | ../../../scratch/deep-review-research-suggestions.md §3 RR-1 |
| **Wave** | 2 (026-scoped research, after Wave 1) |
| **Dispatch** | `/spec_kit:deep-research :auto` |

Phase 018 spec `§3.2 Out of Scope` explicitly deferred Q4 NFKC robustness research as a future research slice. Phase 016 T-SAN-01/02/03 added NFKC normalization at Gate 3 and in `sanitizeRecoveredPayload`, but no research pass has explored the canonical-equivalence attack surface. Relevant because sanitizer bypass would invalidate several security invariants in phase 016 (HookStateSchema `.bad` quarantine, trigger-phrase sanitizer, Zod schema validation).

This packet researches attacker-controlled input constructions that survive NFKC normalization but bypass downstream lexical filters, maps the residual threat surface, and proposes concrete hardening (extended normalization or post-normalization deny-list for high-risk canonical-equivalence classes).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (latent security surface; could surface P0 if bypass is practical) |
| **Status** | Spec Ready, Awaiting Wave 1 Convergence |
| **Created** | 2026-04-18 |
| **Branch** | `main` |
| **Parent Packet** | `../` (019-system-hardening/001-initial-research) |
| **Iteration Budget** | 15-20 |
| **Executor** | cli-codex gpt-5.4 high fast (timeout 1800s) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 016 added NFKC normalization at three surfaces via T-SAN-01/02/03: Gate 3 classifier input, `sanitizeRecoveredPayload` at the memory-save entry, and the trigger-phrase sanitizer. NFKC collapses canonical-equivalent characters (e.g., `ﬀ` → `ff`, fullwidth Latin → ASCII, mathematical alphanumerics → ASCII) into a single representative. This is generally hardening — but NFKC has known edge cases:

- **Over-collapse**: NFKC can collapse characters that look different to a human but share canonical equivalence, potentially breaking legitimate inputs.
- **Under-collapse**: Some visually similar glyphs (e.g., Cyrillic `а` vs Latin `a`) share no canonical equivalence and survive NFKC unchanged. Attackers can construct strings that pass lexical filters.
- **Round-trip instability**: NFKC output may differ across Unicode versions (15 vs 16); cross-platform drift (macOS HFS+ pre-NFD, Windows codepage) affects normalization consistency.

Phase 018 spec §3.2 flagged this as a residual research slice. Without systematic investigation, three security invariants remain unverified:

1. Can an attacker construct a trigger-phrase that bypasses the lexical filter after NFKC?
2. Can a malformed payload survive Zod schema validation by routing through NFKC-safe equivalence classes?
3. Can cross-platform normalization drift introduce inconsistency between write-time sanitization and read-time validation?

### Purpose

Produce a residual-threat inventory of sanitizer-bypass constructions, with severity classifications and concrete hardening proposals (either extended normalization beyond NFKC, or a post-normalization deny-list targeting high-risk canonical-equivalence classes).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- NFKC vs NFKD boundary tests against Unicode 15 and 16 equivalence tables.
- Canonical-equivalence class exhaustion for ASCII-looking glyphs (fullwidth Latin, mathematical alphanumerics, ligatures like `ﬀ`/`ﬁ`/`ﬂ`, small-form compatibility characters).
- Attacker-controlled trigger-phrase constructions that survive NFKC but bypass the lexical filter in `trigger-phrase-sanitizer.ts`.
- Attacker-controlled payload constructions that survive `sanitizeRecoveredPayload` NFKC normalization but fail downstream Zod validation or — worse — pass it.
- Round-trip stability tests: input → write → NFKC → serialize → deserialize → NFKC → compare.
- Cross-platform normalization drift (macOS HFS+ pre-NFD conversion, Windows codepage, Linux default NFC).
- CVE corpus review for comparable sanitizer-bypass attacks in other systems (e.g., Unicode normalization attacks on email validation, XSS filters, SQL identifier sanitizers).

### 3.2 Out of Scope

- Implementing the proposed hardening. This is research; implementation belongs to a sibling child (e.g., `019/002-nfkc-hardening`).
- Non-canonical normalization (the repo's choice of NFKC over NFC/NFD is already decided per phase 016).
- Unicode version upgrade planning. Current repo usage of Unicode 15 stays; research addresses portability between versions.

### 3.3 Files to Read (research inputs)

- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/sanitize-recovered-payload.ts` (or equivalent; NFKC call site)
- `.opencode/skill/system-spec-kit/mcp_server/lib/trigger-phrase-sanitizer.ts`
- `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`
- Phase 016 T-SAN-01/02/03 commit history for rationale
- Unicode 15 + 16 `CaseFolding.txt`, `DerivedNormalizationProps.txt`, `NormalizationTest.txt`
- CVE database for Unicode-normalization-related sanitizer bypasses
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Residual-threat inventory must enumerate at least 10 distinct bypass construction classes | research.md §Threat Inventory lists ≥ 10 entries with severity |
| REQ-002 | Any practical bypass (not just theoretical) MUST be classified as P0 | P0 threats in `_memory.continuity.blockers` |
| REQ-003 | Proposed hardening must reference specific file + line | Hardening proposals cite implementation anchors |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Unicode 15 vs 16 drift MUST be assessed | research.md §Version Drift section exists |
| REQ-005 | Cross-platform drift tests MUST cover macOS, Linux, Windows | Test matrix covers all three |
| REQ-006 | Hardening proposals must compare deny-list vs extended-normalization approaches | Comparison table with pros/cons |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** attacker-controlled input, **when** it passes NFKC but bypasses the trigger-phrase lexical filter, **then** it appears as a P0 threat with concrete construction + filter evasion evidence.

**Given** a ligature like `ﬀ`, **when** tested through the full sanitizer chain, **then** the research.md documents whether it becomes `ff` or survives.

**Given** cross-platform write → read, **when** macOS HFS+ pre-NFD conversion happens, **then** the research documents whether round-trip consistency holds.

**Given** the threat inventory is complete, **when** the user reads hardening proposals, **then** each proposal has a concrete implementation reference (file:line + Zod-schema change or equivalent).

**Given** CVE corpus review, **when** findings are written, **then** applicable comparable attacks are cited with CVE IDs.

**Given** the iteration loop converges, **when** code-graph events are emitted, **then** `deep_loop_graph_convergence` stop signal aligns with inline.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Threat inventory ≥ 10 entries with concrete constructions.
- **SC-002**: At least one hardening proposal ships with implementation anchor.
- **SC-003**: Cross-platform + version-drift sections filled.
- **SC-004**: P0 threats escalated via parent continuity within same session they surface.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/spec_kit:deep-research :auto` | High | Gate 4 |
| Dependency | cli-codex executor | Medium | Fallback to native |
| Dependency | Wave 1 convergence (ADR-001) | High | Gate on Wave 1 before dispatch |
| Risk | Practical bypass surfaces (P0) | High | REQ-002 + parent escalation |
| Risk | 15-20 iteration budget insufficient for exhaustive audit | Medium | Accept PARTIAL with prioritized threat classes |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Security

- **NFR-S01**: Practical bypass constructions MUST NOT be published externally; stay in local `research/` tree.
- **NFR-S02**: P0 threats trigger immediate continuity-blocker update.

### Reliability

- **NFR-R01**: Tests are reproducible with Unicode table versions cited.

---

## L2: EDGE CASES

- If NFKC normalization itself has a platform bug (e.g., older Node.js ICU variant), document as P0 and defer until upgrade.
- If a proposed deny-list is too large to be maintainable, fall back to extended normalization with documented trade-offs.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Broad canonical-equivalence audit + cross-platform matrix |
| Risk | 18/25 | Latent security surface; could surface P0 |
| Research | 20/20 | Pure research |
| Multi-Agent | 4/15 | Single executor |
| Coordination | 8/15 | Parent-child plus wait-for-Wave-1 |
| **Total** | **70/100** | **Level 2 acceptable (research-only)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q-001**: Should hardening proposals prefer extended normalization (broader canonical collapse) or post-normalization deny-list (targeted allow)? Trade-off to resolve during iteration.
- **Q-002**: Does the CVE corpus include Node.js-specific ICU normalization bugs? If yes, they should be cited directly.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md` (dispatch)
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
- **Scratch Source**: `../../../scratch/deep-review-research-suggestions.md` §3 Tier 1 RR-1
