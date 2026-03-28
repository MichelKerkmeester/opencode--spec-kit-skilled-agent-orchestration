---
title: "Implementation Summary: 020 Pre-Release Remediation"
description: "Current implementation summary for the active remediation packet, including packet truth-sync plus two narrow landed remediation slices."
trigger_phrases:
  - "020 implementation summary"
  - "pre-release remediation summary"
importance_tier: "high"
contextType: "general"
---
# Implementation Summary: 020 Pre-Release Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-pre-release-remediation |
| **Completed** | In progress as of 2026-03-28; two narrow slices landed |
| **Level** | 3 |
| **Baseline** | Canonical review verdict `FAIL`; `012` local validate failing on stale packet truth |
| **Current Scope** | Packet/spec truth-sync plus two narrow remediation slices, one wrapper-alignment and one modularization/test-budget update; broader runtime and release-surface work remains open |
| **Runtime Gate** | Fresh slice evidence: `npm run check --workspace=scripts`, `npx vitest run tests/modularization.vitest.ts`, `timeout 180 npm run test:core`, and `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` all passed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is no longer purely staging work. The broader remediation program remains incomplete, but two narrow implementation slices have landed alongside the packet truth-sync updates without changing the canonical `FAIL` verdict: `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts` now acts as a thin compatibility wrapper over `../../scripts/dist/evals/map-ground-truth-ids.js`, and `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` now reflects the landed `formatters/search-results.js` extended limit and actual-count note at `536`.

### Canonical Review Re-anchoring

`012` now consistently treats `review/review-report.md` as the authoritative review surface and the packet-local top-level `review-report.md` as historical evidence only.

### Validator-Facing Packet Cleanup

The packet-local summary surfaces were updated so they no longer imply the packet is already clean or release-ready. The stale research-file mention was removed, the custom related-documents section that caused template-header drift was folded back into the standard packet structure, and the Level 3 AI execution protocol is now present in `plan.md`.

### Compatibility Wrapper Slice

The `map-ground-truth-ids` wrapper now delegates directly to the built eval entrypoint instead of carrying wrapper-local implementation logic. This keeps the compatibility surface thin and restores the intended architecture boundary between the MCP-server script shim and the shared `scripts/dist/evals` implementation.

### Modularization Test-Budget Slice

The modularization guard for `formatters/search-results.js` was refreshed so the extended limit is `536` and the adjacent actual-count note is also `536`. This is a narrow integrity update to the modularization budget harness, not evidence that the wider runtime or tooling backlog is closed.

### Scope Of This Pass

This implementation summary covers packet truth-sync plus the two narrow remediation slices described above. It does not claim that the wider runtime, wrapper, public-doc, or feature-verification findings are fixed, and it does not replace the canonical review verdict.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work was delivered as a focused spec-folder truth-sync pass plus two narrow implementation slices:

1. Read the canonical review and the packet-local remediation docs.
2. Converted `mcp_server/scripts/map-ground-truth-ids.ts` into a thin compatibility wrapper that delegates to `../../scripts/dist/evals/map-ground-truth-ids.js`.
3. Updated `mcp_server/tests/modularization.vitest.ts` so the `formatters/search-results.js` extended limit and actual-count note both read `536`.
4. Verified the landed slices with `npm run check --workspace=scripts`, `npx vitest run tests/modularization.vitest.ts`, `timeout 180 npm run test:core`, and `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`.
5. Updated the packet docs so they record partial progress without overstating broader closure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `review/review-report.md` as the only active review authority | Prevents future packet prose from drifting away from the canonical finding registry |
| Treat the `map-ground-truth-ids` change as a narrow compatibility-wrapper slice rather than broad remediation closure | The fix is real and verified, but it does not retire the rest of the canonical finding registry |
| Treat the modularization limit refresh as a narrow test-budget integrity slice rather than broader runtime closure | The updated ceiling and count are verified, but they only keep the modularization guard aligned to the current landed split |
| Prefer a thin wrapper that delegates to `scripts/dist/evals` | This restores the intended architecture boundary and avoids wrapper-local logic drift |
| Keep runtime and verdict status tied to fresh evidence rather than optimistic prose | The canonical review still reports `FAIL` and most remediation work remains open |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run check --workspace=scripts` in `.opencode/skill/system-spec-kit` | PASS |
| `npx vitest run tests/modularization.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `timeout 180 npm run test:core` in `.opencode/skill/system-spec-kit/mcp_server` | PASS |
| `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` | PASS |
| Canonical review verdict | Still `FAIL`; `review/review-report.md` remains authoritative |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Runtime findings from the canonical review remain open until the code-owning workstreams land and are re-verified.
- Wrapper and public-doc drift outside the packet still requires separate evidence-backed cleanup.
- The packet keeps the release verdict `FAIL` unless fresh reruns justify a replacement review.
<!-- /ANCHOR:limitations -->
