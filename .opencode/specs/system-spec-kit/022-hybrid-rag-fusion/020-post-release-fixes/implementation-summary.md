---
title: "Implementation Summary: 020 [system-spec-kit/022-hybrid-rag-fusion/020-post-release-fixes/implementation-summary]"
description: "Current implementation summary for the active remediation packet, including packet truth-sync plus seven narrow landed remediation slices."
trigger_phrases:
  - "020 implementation summary"
  - "pre-release remediation summary"
importance_tier: "important"
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
| **Spec Folder** | 020-post-release-fixes |
| **Completed** | In progress as of 2026-03-28; seven narrow slices landed |
| **Level** | 3 |
| **Baseline** | Canonical review verdict `FAIL`; `012` local validate failing on stale packet truth |
| **Current Scope** | Packet/spec truth-sync plus seven narrow remediation slices: one wrapper-alignment update, one modularization/test-budget update, three conservative causal-graph hygiene passes in the Spec Kit memory DB, and two case-by-case single-node cleanup passes; broader runtime and release-surface work remains open |
| **Runtime Gate** | Fresh slice evidence: `npm run check --workspace=scripts`, `npx vitest run tests/modularization.vitest.ts`, `timeout 180 npm run test:core`, `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`, `spec_kit_memory_memory_causal_stats`, and `spec_kit_memory_memory_health` all stayed healthy for the recorded narrow slices while `review/review-report.md` remains authoritative and overall verdict `FAIL` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is no longer purely staging work. The broader remediation program remains incomplete, but seven narrow implementation slices have landed alongside the packet truth-sync updates without changing the canonical `FAIL` verdict: `.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts` now acts as a thin compatibility wrapper over `../../scripts/dist/evals/map-ground-truth-ids.js`; `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` now reflects the landed `formatters/search-results.js` extended limit and actual-count note at `536`; the Spec Kit memory DB received an initial conservative causal-graph hygiene pass that pruned only qualifying deprecated-to-deprecated `supports` hubs after checkpointing; a second conservative pass then targeted archived deprecated supports-only hubs without claiming broader graph or review closure; a third, narrower pass then pruned only the outgoing `supports` fan-out from five targeted deprecated broadcaster nodes; and the next follow-up explicitly switched from broad pruning to case-by-case cleanup, executing single-node actions on deprecated nodes `24980` and `25027`.

### Canonical Review Re-anchoring

`012` now consistently treats `review/review-report.md` as the authoritative review surface and the packet-local top-level `review-report.md` as historical evidence only.

### Validator-Facing Packet Cleanup

The packet-local summary surfaces were updated so they no longer imply the packet is already clean or release-ready. The stale research-file mention was removed, the custom related-documents section that caused template-header drift was folded back into the standard packet structure, and the Level 3 AI execution protocol is now present in `plan.md`.

### Compatibility Wrapper Slice

The `map-ground-truth-ids` wrapper now delegates directly to the built eval entrypoint instead of carrying wrapper-local implementation logic. This keeps the compatibility surface thin and restores the intended architecture boundary between the MCP-server script shim and the shared `scripts/dist/evals` implementation.

### Modularization Test-Budget Slice

The modularization guard for `formatters/search-results.js` was refreshed so the extended limit is `536` and the adjacent actual-count note is also `536`. This is a narrow integrity update to the modularization budget harness, not evidence that the wider runtime or tooling backlog is closed.

### Causal-Graph Hygiene Slice

The Spec Kit memory DB received a conservative causal-graph hygiene pass with two safety checkpoints, `pre-supports-hub-prune-global-20260328-0910` and `pre-supports-hub-prune-20260328-0910`, before mutation. The prune rule deleted only `supports` edges where both source and target memories were `deprecated` and the source qualified as a broad deprecated hub with at least `10` deprecated-to-deprecated outgoing supports spanning at least `8` distinct target folders. That removed `585` causal edges after scanning `44` source hubs across `78` target folders, while post-prune verification stayed healthy at `3104` total edges, `0` orphaned edges, and `2409` indexed memories. This remains a hygiene and usefulness pass only: `408` deprecated-to-deprecated supports still remain, and noisy archived/deprecated hubs `25019`, `24960`, `25018`, `24742`, `24743`, `25017`, `24938`, `24980`, `24981`, `24982`, `24983`, and `24984` were identified for follow-up rather than claimed as closed.

### Archived Deprecated Supports-Only Hygiene Slice

The second conservative graph-hygiene pass focused only on archived deprecated supports-only hubs. It created checkpoints `pre-archive-supports-prune-global-20260328-0921` and `pre-archive-supports-prune-20260328-0921`, then deleted only `supports` edges where the source memory is `deprecated`, the source `spec_folder` contains `z_archive`, and the source has zero remaining `supports` targets outside `deprecated`. That removed `148` causal edges after scanning `23` source hubs across `36` target folders, while post-prune verification stayed healthy at `2956` total edges, `2070` supports, `886` caused, `77.04%` coverage, `0` orphaned edges, and `2409` indexed memories. This also remains a hygiene and usefulness pass only: `260` deprecated-to-deprecated supports still remain, and the exact per-node action-table follow-up stays limited to prune-outgoing-only hubs `24743`, `24981`, `24982`, `24983`, `24984` plus leave-as-historical-lineage hubs `24742`, `24986`, `24987`, `24989`, `24992`, `24993`, `24994`, `24729`, `24734`, `24736`.

### Targeted Broadcaster Hygiene Slice

The third conservative graph-hygiene pass focused only on five deprecated broadcaster nodes: `24743`, `24981`, `24982`, `24983`, and `24984`. It created checkpoints `pre-targeted-broadcaster-prune-global-20260328-0933` and `pre-targeted-broadcaster-prune-20260328-0933`, validated that pruning all outgoing `supports` from those nodes would delete `58` edges total (`24743=11`, `24981=13`, `24982=12`, `24983=11`, `24984=11`), and confirmed those nodes had zero outgoing `caused` edges. The target-tier mix before delete was `50 deprecated`, `8 normal`, `0` critical/important/constitutional`, with the only non-deprecated targets being repeated links to manual-testing nodes `25560` and `25561`. After deleting the `58` edges, post-prune verification stayed healthy at `2898` total edges, `2012` supports, `886` caused, `76.88%` coverage, `0` orphaned edges, and `2409` indexed memories. Trace spot-checks show `24743` is no longer a broadcaster and now shows only inbound/support context; `24742` remains a sink-heavy deprecated historical node; and active node `25860` remains connected but still semantically noisy via generic `supports` fan-out. This remains a hygiene and usefulness slice only, not canonical finding closure.

### Case-By-Case Node Cleanup Slices

The next graph-hygiene follow-up explicitly switched from broad pruning to case-by-case cleanup. The first single-node action inspected node `24980` (`Implementation Summary - Voyage 4 Upgrade [067-voyage-4-upgrade/implementation-summary]`, `implementation_summary`, `deprecated`, spec folder `system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/067-voyage-4-upgrade`) after creating checkpoints `pre-node-24980-prune-global-20260328-1009` and `pre-node-24980-prune-20260328-1009`. Pre-delete inspection found exactly `13` outgoing `supports` edges and `0` outgoing `caused` edges. The target mix before delete was `11 deprecated`, `2 normal`, `0` critical/important/constitutional`, and the only normal targets were `25559` (`Manual Testing Per Playbook Discovery Phase`) and `25560` (`005 Lifecycle Manual Testing`). After deleting the `13` outgoing `supports` edges from `24980`, six synthetic orphan test edges (`5436`-`5441`, all `test-source-id -> test-target-id`) reappeared in the graph-health surface and were immediately removed as contamination cleanup. Final post-cleanup verification stayed healthy at `2885` total edges, `1999` supports, `886` caused, `76.42%` coverage, `0` orphaned edges, and `2417` indexed memories, while `spec_kit_memory_memory_drift_why(24980)` showed no causal relationships remain for `24980`.

The second single-node action continued the same case-by-case cleanup on node `25027` (`Verification Checklist: Foundation Package [001-foundation-phases-0-1-1-5/checklist]`, `checklist`, `deprecated`, spec folder `system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/001-foundation-phases-0-1-1-5`) after creating checkpoints `pre-node-25027-prune-global-20260328-1043` and `pre-node-25027-prune-20260328-1043`. Pre-delete inspection found exactly `10` outgoing `supports` edges and `0` outgoing `caused` edges. The target mix before delete was `9 deprecated`, `1 normal`, `0` critical/important/constitutional`, and the only normal target was `25195` (`T008: lastDbCheck advancement`). After deleting the `10` outgoing `supports` edges from `25027`, final post-cleanup verification stayed healthy at `2875` total edges, `1989` supports, `886` caused, `76.42%` coverage, `0` orphaned edges, and `2417` indexed memories, while `spec_kit_memory_memory_drift_why(25027)` showed only inbound/support context and no outgoing causal graph fan-out. This remains a hygiene and usefulness slice only, not canonical finding closure.

### Compact Usefulness Note

Across the graph-hygiene sequence, usefulness improved through narrower cleanup without changing the broader review verdict: pre-prune baseline `3689` edges / `78.41%` coverage; pass 1 `3104` / `78.25%`; pass 2 `2956` / `77.04%`; pass 3 `2898` / `76.88%`; case-by-case node `24980` pass `2885` / `76.42%`; case-by-case node `25027` pass `2875` / `76.42%`. Pass 1 was the high-yield cut (`-585` edges for `-0.16pp` coverage), pass 2 was lower-yield (`-148` for `-1.21pp`), pass 3 was a narrow cleanup (`-58` for `-0.16pp`), the first case-by-case pass removed `13` node-specific `supports` edges while fully disconnecting `24980`, and the second case-by-case pass removed `10` more `supports` edges so `25027` no longer acts as a broadcaster.

### Scope Of This Pass

This implementation summary covers packet truth-sync plus the seven narrow remediation slices described above. It does not claim that the wider runtime, wrapper, public-doc, or feature-verification findings are fixed, and it does not replace the canonical review verdict.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work was delivered as a focused spec-folder truth-sync pass plus seven narrow implementation slices:

1. Read the canonical review and the packet-local remediation docs.
2. Converted `mcp_server/scripts/map-ground-truth-ids.ts` into a thin compatibility wrapper that delegates to `../../scripts/dist/evals/map-ground-truth-ids.js`.
3. Updated `mcp_server/tests/modularization.vitest.ts` so the `formatters/search-results.js` extended limit and actual-count note both read `536`.
4. Created safety checkpoints `pre-supports-hub-prune-global-20260328-0910` and `pre-supports-hub-prune-20260328-0910`, pruned only the qualifying deprecated-to-deprecated `supports` hubs, and recorded the surviving noisy archived/deprecated cleanup candidates for later follow-up.
5. Created safety checkpoints `pre-archive-supports-prune-global-20260328-0921` and `pre-archive-supports-prune-20260328-0921`, pruned only archived deprecated supports-only hubs that still had zero non-deprecated `supports` targets, and recorded the exact remaining per-node action-table follow-up instead of broad closure.
6. Created safety checkpoints `pre-targeted-broadcaster-prune-global-20260328-0933` and `pre-targeted-broadcaster-prune-20260328-0933`, pruned only the outgoing `supports` fan-out from nodes `24743`, `24981`, `24982`, `24983`, and `24984`, and recorded the targeted pre-delete scope, post-delete health, and trace spot-check outcomes instead of broader closure.
7. Switched the next graph-hygiene follow-up from broad pruning to case-by-case cleanup by creating checkpoints `pre-node-24980-prune-global-20260328-1009` and `pre-node-24980-prune-20260328-1009`, pruning only node `24980`'s `13` outgoing `supports` edges, removing the reappearing synthetic orphan test edges `5436`-`5441` as contamination cleanup, and recording the post-cleanup healthy state and disconnected `24980` trace.
8. Continued the same case-by-case mode by creating checkpoints `pre-node-25027-prune-global-20260328-1043` and `pre-node-25027-prune-20260328-1043`, pruning only node `25027`'s `10` outgoing `supports` edges, and recording the post-cleanup healthy state and no-outgoing-fan-out trace.
9. Verified the landed slices with `npm run check --workspace=scripts`, `npx vitest run tests/modularization.vitest.ts`, `timeout 180 npm run test:core`, `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`, `spec_kit_memory_memory_causal_stats`, `spec_kit_memory_memory_health`, and `spec_kit_memory_memory_drift_why(24980)` plus `spec_kit_memory_memory_drift_why(25027)`.
10. Updated the packet docs so they record partial progress without overstating broader closure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `review/review-report.md` as the only active review authority | Prevents future packet prose from drifting away from the canonical finding registry |
| Treat the `map-ground-truth-ids` change as a narrow compatibility-wrapper slice rather than broad remediation closure | The fix is real and verified, but it does not retire the rest of the canonical finding registry |
| Treat the modularization limit refresh as a narrow test-budget integrity slice rather than broader runtime closure | The updated ceiling and count are verified, but they only keep the modularization guard aligned to the current landed split |
| Treat the deprecated-supports prune as a narrow graph-hygiene and usefulness slice rather than canonical finding closure | The graph is healthier after deleting `585` qualifying edges, but `408` deprecated-to-deprecated supports remain and the follow-up cleanup set is still open |
| Treat the archived deprecated supports-only prune as a second narrow graph-hygiene and usefulness slice rather than broader closure | The graph is healthier after deleting `148` more qualifying edges, but `260` deprecated-to-deprecated supports remain and the exact follow-up action table is still open |
| Treat the targeted-broadcaster prune as a third narrow graph-hygiene and usefulness slice rather than broader closure | The graph is healthier after deleting `58` targeted edges, but the canonical findings remain open and active node `25860` still shows generic `supports` noise |
| Switch from broad pruning to case-by-case cleanup for the next graph-hygiene follow-up | The earlier broad passes reduced obvious deprecated fan-out, but the remaining work needed narrower node-by-node inspection to avoid overstating closure |
| Keep the second case-by-case action limited to node `25027` only | The node still acted as a deprecated broadcaster, but a single-node prune preserved the narrow-slice framing and avoided implying broader graph closure |
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
| `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` | PASS |
| `spec_kit_memory_memory_causal_stats` | HEALTHY: `3104` total edges, `2218` supports, `886` caused, `78.25%` coverage, `0` orphaned edges |
| `spec_kit_memory_memory_causal_stats` after archived-supports pass | HEALTHY: `2956` total edges, `2070` supports, `886` caused, `77.04%` coverage, `0` orphaned edges |
| `spec_kit_memory_memory_causal_stats` after targeted-broadcaster pass | HEALTHY: `2898` total edges, `2012` supports, `886` caused, `76.88%` coverage, `0` orphaned edges |
| `spec_kit_memory_memory_causal_stats` after case-by-case node `24980` pass | HEALTHY: `2885` total edges, `1999` supports, `886` caused, `76.42%` coverage, `0` orphaned edges |
| `spec_kit_memory_memory_health` | HEALTHY: `2417` memories indexed |
| `spec_kit_memory_memory_drift_why(24980)` | HEALTHY: no causal relationships remain for `24980` |
| `spec_kit_memory_memory_causal_stats` after case-by-case node `25027` pass | HEALTHY: `2875` total edges, `1989` supports, `886` caused, `76.42%` coverage, `0` orphaned edges |
| `spec_kit_memory_memory_drift_why(25027)` | HEALTHY: only inbound/support context remains; no outgoing causal graph fan-out |
| Canonical review verdict | Still `FAIL`; `review/review-report.md` remains authoritative |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Runtime findings from the canonical review remain open until the code-owning workstreams land and are re-verified.
- Wrapper and public-doc drift outside the packet still requires separate evidence-backed cleanup.
- The targeted-broadcaster pass and the later node-`24980` and node-`25027` case-by-case cleanups improved graph hygiene, but they did not close the broader graph-hygiene or canonical review findings; `25027` no longer acts as a broadcaster, `24980` remains fully disconnected, `24742` remains a sink-heavy deprecated historical node, and active node `25860` still shows generic `supports` noise.
- The packet keeps the release verdict `FAIL` unless fresh reruns justify a replacement review.
<!-- /ANCHOR:limitations -->
