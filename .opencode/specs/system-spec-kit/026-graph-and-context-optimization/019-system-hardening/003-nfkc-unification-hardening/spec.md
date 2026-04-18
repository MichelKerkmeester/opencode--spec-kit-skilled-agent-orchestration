---
title: "Feature Specification: NFKC Unification Hardening"
description: "Implement HP1-HP6 from 019/001/003 Q4 NFKC research: unify Unicode normalization across Gate 3, shared-provenance, and trigger-phrase-sanitizer; add post-normalization instruction denylist; expand confusable coverage (RT5 Greek-omicron); semantic recovered-payload contract; provenance enforcement; adversarial regression corpus."
trigger_phrases:
  - "nfkc unification"
  - "trigger phrase sanitizer hardening"
  - "recovered payload contract"
  - "shared provenance hardening"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/003-nfkc-unification-hardening"
    last_updated_at: "2026-04-18T23:42:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Remediation child scaffolded from 019/001/003 research"
    next_safe_action: "Dispatch /spec_kit:implement :auto"
    blockers: []

---
# Feature Specification: NFKC Unification Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Source Research** | ../001-initial-research/003-q4-nfkc-robustness/research.md |
| **Priority** | P1 |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (3 P1 + 1 P2) |
| **Status** | Spec Ready |
| **Estimated Effort** | 4-6 days |
| **Executor** | cli-codex gpt-5.4 high fast |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Research 019/001/003 found 3 P1 Unicode normalization gaps + 1 P2 regression-locking gap:
- **P1**: `trigger-phrase-sanitizer.ts` uses `NFC` only, while Gate 3 + shared-provenance use `NFKC + hidden-char strip + combining-mark strip + confusable fold`. Fullwidth/mathematical/zero-width chars survive trigger filtering then canonicalize into instruction-shaped ASCII downstream.
- **P1**: RT5 Greek-omicron construction (`ignοre previous`) survives recovered-payload strip patterns because the confusable table is manually curated and incomplete.
- **P1**: Hook-state schema validates payload as `z.string()` only — no semantic gate before session-prime emission.
- **P2**: No shared adversarial round-trip corpus across Gate 3 + trigger + shared-provenance + session-prime surfaces.

### Purpose

Implement 6 hardening proposals (HP1-HP6) in staged order to close the normalization-policy mismatch, expand confusable coverage, add semantic payload validation, enforce provenance contracts, and lock behavior with adversarial tests.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

**HP1 — Shared Unicode Normalization Utility:**
- Extract canonical fold pipeline (NFKC + hidden-char strip + combining-mark strip + confusable fold) into shared utility
- Route `trigger-phrase-sanitizer.ts`, `gate-3-classifier.ts`, and `shared-provenance.ts` through the same utility

**HP2 — Post-Normalization Instruction Denylist:**
- Run contamination + suspicious-prefix checks on canonicalized text (not raw/NFC)

**HP3 — Expand Confusable Coverage:**
- Patch Greek-omicron construction in `normalizeRecoveredPayloadLineForMatching()` + adjacent high-risk instruction lookalikes

**HP4 — Semantic Recovered-Payload Contract:**
- Add semantic rule set before prompt emission: reject forbidden normalized prefixes, cap suspicious line density, require provenance markers, quarantine instruction-shaped payloads

**HP5 — Provenance Contract Enforcement:**
- Require provenance metadata + sanitizer-version / runtime-fingerprint field on compact-cache writers/readers

**HP6 — Shared Adversarial Round-Trip Corpus:**
- Build one corpus covering width forms, hidden chars, combining marks, confusables, runtime fingerprinting
- Run through each surface under active runtime fingerprint

### 3.2 Out of Scope

- Non-Unicode attack families (XSS, SQL injection)
- Formal verification
- Cross-platform Unicode 15/16 parity claims

### 3.3 Files to Change

- `scripts/lib/trigger-phrase-sanitizer.ts` (HP1, HP2)
- `shared/gate-3-classifier.ts` (HP1 refactor to shared utility)
- `mcp_server/hooks/shared-provenance.ts` (HP3)
- `mcp_server/hooks/claude/hook-state.ts` (HP4)
- `mcp_server/hooks/{claude,gemini,copilot}/session-prime.ts` (HP4)
- `mcp_server/hooks/{claude,gemini,copilot}/compact-inject.ts` (HP5)
- `scripts/lib/unicode-normalization.ts` (NEW — shared utility for HP1)
- `mcp_server/tests/security/adversarial-unicode.vitest.ts` (NEW — HP6)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

- **R1** (HP1): Shared normalization utility used by all 3 surfaces
- **R2** (HP2): Denylist applied post-normalization, not raw
- **R3** (HP3): RT5 Greek-omicron + adjacent high-risk confusables patched
- **R4** (HP4): Semantic payload boundary added before session-prime emission

### 4.2 P1 - Required

- **R5** (HP5): Provenance metadata required on compact-cache writers
- **R6** (HP6): Adversarial corpus + tests pass across all 4 surfaces
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] 3 surfaces use shared normalization utility (no divergent fold paths)
- [ ] RT1-RT10 adversarial cases all blocked or quarantined
- [ ] Hook-state payload passes through semantic gate before emission
- [ ] Full regression + adversarial test suite green
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Refactoring breaks Gate 3 behavior | Per-surface regression tests before refactor |
| Adversarial corpus false-positives benign text | Corpus curation with review |
| Semantic gate too strict, rejects valid payloads | Quarantine-first, fail-closed later |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

- Manual confusable table vs library-driven (Unicode confusables data) — implementation chooses
- Legacy `pendingCompactPrime` migration if semantic validation stricter than `z.string()`
<!-- /ANCHOR:open-questions -->
