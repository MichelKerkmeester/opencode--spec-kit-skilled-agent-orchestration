---
title: "Verification Checklist: NFKC Unification Hardening"
description: "Verification items for HP1-HP6."
trigger_phrases: ["nfkc hardening checklist"]
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/003-nfkc-unification-hardening"
    last_updated_at: "2026-04-18T23:42:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify post-implementation"
---
# Verification Checklist: NFKC Unification Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

## Verification Protocol

<!-- ANCHOR:protocol -->
All items must have evidence (file:line or test-run summary).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Research reviewed: ../../research/019-system-hardening-pt-02/research.md [P0] [EVIDENCE: HP1-HP6 and RT1-RT10 inventory reviewed before edits.]
- [x] Baseline tests captured [P0] [EVIDENCE: pre-change npm test failed on unrelated baseline suites before NFKC edits; targeted hardening slice established the regression baseline.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] HP1: `scripts/lib/unicode-normalization.ts` exports canonicalFold [P0] [EVIDENCE: scripts wrapper exports canonicalFold; build-safe implementation is shared/unicode-normalization.ts.]
- [x] HP1: 3 surfaces import shared utility [P0] [EVIDENCE: Gate 3 imports ./unicode-normalization.js; shared-provenance imports @spec-kit/shared/unicode-normalization; trigger sanitizer imports ./unicode-normalization.]
- [x] HP2: denylist checks post-canonicalization [P0] [EVIDENCE: trigger contamination and shared-provenance strip patterns run after canonicalFold().]
- [x] HP3: Greek-omicron in fold table [P0] [EVIDENCE: shared/unicode-normalization.ts maps Greek omicron, Greek rho, and adjacent high-risk Greek/Cyrillic lookalikes.]
- [x] HP4: semantic gate in hook-state [P0] [EVIDENCE: validatePendingCompactPrimeSemantics() rejects instruction-shaped canonical payload lines.]
- [x] HP4: 3 session-prime consumers wired [P0] [EVIDENCE: Claude, Gemini, and Copilot session-prime readers validate compact primes before wrapping.]
- [x] HP5: provenance fingerprint in compact-cache [P1] [EVIDENCE: compact-cache writers add sanitizerVersion and runtimeFingerprint; readers require both before emission.]
- [x] HP6: adversarial corpus test file exists and passes [P0] [EVIDENCE: mcp_server/tests/security/adversarial-unicode.vitest.ts; targeted Vitest run passed 6 files / 91 tests.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] RT1-RT10 all blocked or quarantined [P0] [EVIDENCE: adversarial corpus passes Gate 3 denylist matching, shared-provenance stripping, trigger-phrase rejection, and hook-state quarantine checks.]
- [x] Parity tests pass across 3 surfaces [P0] [EVIDENCE: targeted Vitest run passed parity assertions for canonicalFold(), Gate 3 normalization, and trigger/shared-provenance behavior.]
- [ ] Full mcp_server suite green [P0] [EVIDENCE: blocked because full npm test remains red on unrelated baseline failures and the post-change run stalled after reproducing them.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
- [x] No new secrets introduced [P0] [EVIDENCE: changes add code, tests, and docs only; no credential material added.]
- [x] Quarantine-first semantics reversible [P1] [EVIDENCE: suspicious hook-state payloads use existing .bad quarantine path or reader fallback/clear behavior; no fail-open prompt emission.]
- [x] Runtime fingerprint captured [P1] [EVIDENCE: adversarial corpus logs normalizer, Node, ICU, and Unicode fingerprint.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] spec.md scope matches implementation [P0] [EVIDENCE: implementation stayed within HP1-HP6 hardening surfaces plus build-safe shared utility wrapper.]
- [ ] tasks.md all T0NN `[x]` with evidence [P0] [EVIDENCE: blocked because T020 remains open while full suite is not green in current baseline.]
- [x] implementation-summary.md populated [P0] [EVIDENCE: summary updated with HP1-HP6 outcomes and verification caveats.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Shared utility placed correctly [P0] [EVIDENCE: runtime-safe implementation in shared/unicode-normalization.ts; requested scripts entrypoint in scripts/lib/unicode-normalization.ts.]
- [x] No orphan files [P1] [EVIDENCE: only packet docs, named hardening files, shared utility, and adversarial corpus added or updated.]
- [ ] Dist artifacts if applicable [P1] [EVIDENCE: blocked because npm run build fails on existing scripts import.meta module errors outside this NFKC scope; no dist refresh committed.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Partial. HP1-HP6 implementation and targeted adversarial tests are complete; full-suite completion remains blocked by unrelated baseline failures.
<!-- /ANCHOR:summary -->
