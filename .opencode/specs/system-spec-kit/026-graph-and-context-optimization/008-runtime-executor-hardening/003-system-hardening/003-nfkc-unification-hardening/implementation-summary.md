---
title: "Implementation Summary: NFKC Unification Hardening"
description: "HP1-HP6 NFKC unification hardening implementation summary with targeted adversarial verification evidence and full-suite blocker notes."
trigger_phrases: ["nfkc hardening summary", "canonical unicode fold", "adversarial unicode corpus"]
importance_tier: "critical"
contextType: "implementation-summary"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/003-nfkc-unification-hardening"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Implemented HP1-HP6 Unicode normalization hardening and targeted adversarial tests"
    next_safe_action: "Resolve full-suite baseline"
---
# Implementation Summary: NFKC Unification Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> HP1-HP6 are implemented and the targeted adversarial regression slice passes. Full-suite completion remains intentionally unclaimed because the workspace `npm test` baseline is red on unrelated suites.

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-nfkc-unification-hardening |
| **Completed** | 2026-04-19, targeted implementation complete |
| **Level** | 2 |
| **Effort Estimate** | 4-6 days |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

- HP1: Added a canonical Unicode fold utility with NFKC normalization, hidden-character stripping, combining-mark stripping, and a manual high-risk confusable fold table.
- HP1: Kept the requested scripts entrypoint at `scripts/lib/unicode-normalization.ts` while placing the build-safe implementation under `shared/unicode-normalization.ts` for both shared and MCP surfaces.
- HP1: Refactored Gate 3, recovered-payload provenance handling, and trigger-phrase sanitization to use the same canonical fold behavior.
- HP2: Moved instruction contamination and suspicious-prefix detection to post-canonicalization paths so fullwidth, zero-width, combining-mark, and confusable variants are evaluated after folding.
- HP3: Expanded the fold table for Greek omicron, Greek rho, and adjacent high-risk Greek/Cyrillic role-word lookalikes so variants such as `ignοre previous` canonicalize into blockable text.
- HP4: Added semantic validation for pending compact-prime payloads and wired that validation into Claude, Gemini, and Copilot session-prime readers before recovered payloads can be emitted.
- HP5: Added compact-cache provenance contract metadata with `sanitizerVersion` and Node/ICU/Unicode runtime fingerprints, then required those fields at reader emission boundaries.
- HP6: Added a shared adversarial Unicode round-trip corpus covering RT1-RT10 and derived variants across Gate 3, shared provenance, trigger phrases, and hook-state validation.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- The canonical implementation lives in the shared package so MCP hooks and shared Gate 3 code can import it without TypeScript root-boundary violations. The scripts path is a thin wrapper to preserve the requested API surface for sanitizer code and tests.
- Trigger phrases now canonicalize before contamination checks, and recovered payload lines canonicalize before strip-pattern matching or semantic payload validation.
- Hook-state parsing rejects suspicious payload content through the existing quarantine-capable state loader path. Session-prime readers also clear rejected compact primes and return fallback recovery text instead of emitting untrusted payloads.
- Compact-cache writers now stamp producer metadata with the canonical fold version and runtime fingerprint. Compact-cache readers verify payload contracts before wrapping recovered content.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- **Build-safe shared home:** The implementation was placed under `shared/` with a `scripts/lib/` wrapper because importing script-root code from shared or MCP modules broke the package build contract.
- **Schema compatibility:** Hook-state schema validation enforces payload safety directly, while the stricter provenance contract is enforced at emission/read boundaries. This keeps benign legacy state files readable but prevents contractless recovered payloads from being emitted.
- **Manual confusable table:** The fold table remains a focused high-risk table rather than a full Unicode confusables database, matching the hardening scope and keeping behavior auditable.
- **No commit:** The dispatch explicitly said not to commit or push, so working-tree changes were left for the orchestrator.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- **Targeted hardening slice passed:** `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/security/adversarial-unicode.vitest.ts mcp_server/tests/hooks-shared-provenance.vitest.ts scripts/tests/gate-3-classifier.vitest.ts scripts/tests/trigger-phrase-sanitizer.vitest.ts mcp_server/tests/hook-session-start.vitest.ts mcp_server/tests/copilot-compact-cycle.vitest.ts --config mcp_server/vitest.config.ts` passed 6 files / 91 tests.
- **Runtime fingerprint captured:** The adversarial corpus logs `[adversarial-unicode-runtime]` with normalizer, Node, ICU, and Unicode versions.
- **Full suite not green:** `cd .opencode/skill/system-spec-kit && npm test` was red before these changes and remains red after them on unrelated baseline suites including `handler-memory-save`, `transaction-manager-recovery`, `memory-context.resume-gate-d`, and `startup-brief`.
- **Build not refreshed:** `npm run build` is blocked by existing script module-target errors in `scripts/lib/validator-registry.ts` and `scripts/spec-folder/generate-description.ts`; no dist artifacts were refreshed.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- T020 remains open because the full test suite is not green in the current baseline.
- Dist artifacts remain unchanged because the package build is blocked by unrelated `import.meta` module-target errors.
- The confusable fold table is intentionally scoped to high-risk role/instruction lookalikes from this packet, not the complete Unicode confusables dataset.
- Legacy compact-prime payloads without the new provenance contract are not trusted for emission until regenerated by the updated writers.
<!-- /ANCHOR:limitations -->
