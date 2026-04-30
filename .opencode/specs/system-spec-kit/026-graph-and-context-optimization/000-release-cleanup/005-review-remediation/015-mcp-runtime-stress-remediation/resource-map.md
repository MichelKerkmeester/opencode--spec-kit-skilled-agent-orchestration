---
title: "Resource Map — 015-mcp-runtime-stress-remediation phase parent"
description: "Parent-aggregate file ledger for the v1.0.1 MCP-runtime stress-test remediation cycle, covering both the 2026-04-27 carve-out from 003-continuity-memory-runtime and the in-place 006-014 → 001-009 renumber."
trigger_phrases:
  - "011 resource map"
  - "stress-test remediation file ledger"
  - "carve-out renumber paths"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation"
    last_updated_at: "2026-04-28T20:00:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validator hygiene update"
    next_safe_action: "Run recursive strict validator"
    blockers: []
    key_files:
      - "resource-map.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 43
- **By category**: Documents=3, Specs=32, Skills=1, Config=1, Meta=3, READMEs=0, Commands=0, Agents=0, Scripts=0, Tests=0
- **Missing on disk**: 0 (the original autonomous-run handover document was deleted before this phase was created and is intentionally not tracked here; see `./context-index.md` §Deleted Predecessor Docs)
- **Scope**: Parent-aggregate ledger for the 011 phase parent, covering (a) the 2026-04-27 carve-out that moved 9 packets from `003-continuity-memory-runtime/` into this folder, (b) the same-day in-place renumber of those 9 packets from the 006-014 range to the 001-009 range, (c) the 010 v1.0.2 stress-test re-run and 011 post-stress research packets, and (d) the 012-018 downstream implementation/documentation follow-up packets.
- **Generated**: 2026-04-28T15:45:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Mode**: parent-aggregate. Per-child resource maps are NOT authored — this single map covers all 18 children. When a new child packet is added, this map must be refreshed in the same change set or the new child must be represented by an explicit `PLANNED` placeholder row.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/HANDOVER-deferred.md` | Moved + Updated | OK | Continuity doc for the cycle's still-open follow-ups; moved from `003-…/HANDOVER-deferred.md` and rewired for the renumbered children. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/context-index.md` | Created | OK | Migration bridge: old → new path map, reorganization rationale, deleted-predecessor pointer. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/resource-map.md` | Created | OK | This file. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/spec.md` | Created (rewritten v2) | OK | Phase-parent spec at Level 2; rewritten from a Level-1 carve-out narrative to the lean phase-parent template per `014-phase-parent-documentation/`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/description.json` | Created + Updated | OK | Phase-parent discovery metadata; child manifest reflects renumbered children. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/graph-metadata.json` | Created + Updated | OK | Phase-parent graph metadata; `children_ids` tracks the current 001-018 child rollup. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/` | Moved + Renamed | OK | From `003-…/006-search-intelligence-stress-test/`. v1.0.1 rubric + 30-cell sweep. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/` | Moved + Renamed | OK | From `003-…/007-mcp-runtime-improvement-research/`. 10-iter deep research. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/003-memory-context-truncation-contract/` | Moved + Renamed | OK | From `003-…/008-memory-context-truncation-contract/`. Token-budget contract. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/` | Moved + Renamed | OK | From `003-…/009-cocoindex-overfetch-dedup/`. Cocoindex fork + dedup. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/005-code-graph-fast-fail/` | Moved + Renamed | OK | From `003-…/010-code-graph-fast-fail/`. Fallback-decision routing. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/006-causal-graph-window-metrics/` | Moved + Renamed | OK | From `003-…/011-causal-graph-window-metrics/`. Causal-graph balance + window cap. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/007-intent-classifier-stability/` | Moved + Renamed | OK | From `003-…/012-intent-classifier-stability/`. IntentTelemetry + paraphrase corpus. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/` | Moved + Renamed | OK | From `003-…/013-mcp-daemon-rebuild-protocol/`. Daemon rebuild + restart contract. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/009-memory-search-response-policy/` | Moved + Renamed | OK | From `003-…/014-memory-search-response-policy/`. Refusal contract for low-quality searches. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/` | Created | OK | v1.0.2 re-run of the 30-cell stress-test against the post-fix dist; per-cell delta classification + per-packet verdict. **Complete 2026-04-27** — sweep done, findings shipped, HANDOVER §2.1 CLOSED. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/011-post-stress-followup-research/` | Created + Updated | OK | 10-iteration `/spec_kit:deep-research:auto` loop refining v1.0.2 P0/P1/P2 follow-ups + light architectural touch on intelligence-system seams. Complete 2026-04-27; synthesis at research/research.md. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/012-copilot-target-authority-helper/` | Created + Updated | OK | P0 cli-copilot target-authority helper; complete. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell/` | Created + Updated | OK | P1 deterministic degraded-graph stress cell; complete. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/` | Created + Updated | OK | P2 read-only graph readiness snapshot for `code_graph_status`; complete. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/015-cocoindex-seed-telemetry-passthrough/` | Created + Updated | OK | P2 CocoIndex seed telemetry passthrough into `code_graph_context` anchors; complete. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/` | Created + Updated | OK | P1 degraded-readiness envelope parity across context/status surfaces; complete. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity/` | Created + Updated | OK | P2 cli-copilot dispatch test parity for target-authority workflow coverage; complete. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment/` | Created + Updated | OK | P2 catalog/playbook degraded-alignment follow-up; in progress at cleanup time. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/002-mcp-stress-cycle-cleanup/` | Created + Updated | OK | Review-remediation cleanup packet closing the 6 P2 advisories from `011` deep review; depends on this phase parent and owns this resource-map refresh. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/**/description.json` | Updated | OK | Each renumbered child's `specId`, `specFolder`, `parentChain` rewired to the new parent + new local number. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/**/graph-metadata.json` | Updated | OK | Each renumbered child's `packet_id`, `spec_folder`, `parent_id` rewired. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/**/spec.md` | Updated | OK | Path-form `Spec Folder` and frontmatter pointers rewired across the renumbered children. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/**/plan.md` | Updated | OK | Sibling cross-references inside child plans rewired (e.g. `../006-…` → `../001-…`). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/**/tasks.md` | Updated | OK | Sibling cross-references inside child task lists rewired. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/**/implementation-summary.md` | Updated | OK | "Spec Folder" header rows rewired to renumbered slugs; live-probe verification rows preserved verbatim. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/description.json` | Analyzed | OK | Confirmed never listed 006-014 in `migration.child_phase_folders`; removal is a no-op. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/graph-metadata.json` | Analyzed | OK | Confirmed never listed 006-014 in `children_ids`; removal is a no-op. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/spec.md` | Analyzed | OK | PHASE DOCUMENTATION MAP table never listed 006-014; remains accurate at four native children. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/003-continuity-refactor-gates/description.json` | Analyzed | OK | Retains `intermediate_spec_folder` historical alias unrelated to this carve-out; intentionally not modified. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite/description.json` | Analyzed | OK | Retains `intermediate_spec_folder` historical alias unrelated to this carve-out; intentionally not modified. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/mcp-coco-index/README.md` | Updated | OK | Embedded reference path for the cocoindex-overfetch-dedup packet rewired to the renumbered location (`011-…/004-cocoindex-overfetch-dedup/`). |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/descriptions.json` | Updated | OK | Top-level discovery index entries rewired from `003-…/{006..014}-…` to `011-…/{001..009}-…`. |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md` | Updated | OK | PHASE DOCUMENTATION MAP gained a row for `015-mcp-runtime-stress-remediation/`; wrapper count updated 10 → 11; `006`/`011` numbering-gap commentary updated. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/description.json` | Updated | OK | `childTopology` includes `015-mcp-runtime-stress-remediation`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json` | Updated | OK | `children_ids` updated: stale `011-manual-testing-playbook-coverage-and-run` (no folder on disk) replaced with the real `015-mcp-runtime-stress-remediation`. |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

Maintenance notes for this map:

- **Mode is parent-aggregate** — do not author per-child resource maps for this phase parent. State that in the `Scope` line of any future regeneration.
- **Path conventions** — paths are repo-root relative; one path per row except where a `**` glob applies the same Action across all matches in the renumbered subtree.
- **Two immutable CLI run logs** under `001-search-intelligence-stress-test/002-scenario-execution/runs/{S3/cli-opencode-pure-1,I2/cli-copilot-1}/output.txt` reference legacy 003/006 paths and were intentionally NOT rewritten (they are historical CLI capture, not active spec content). They are not listed individually in the Specs section because they are leaf evidence inside an already-listed child; treat them as part of the `001-…` row's tree.
- **Future updates** — when additional post-cycle work lands, append rows to the relevant section or add a `PLANNED` placeholder at the time the child is created; do not let the parent ledger lag the phase-parent manifest.
- **Reference reading**: `.opencode/skill/system-spec-kit/templates/resource-map.md` (template), `.opencode/skill/system-spec-kit/SKILL.md` §3.
<!-- /ANCHOR:author-instructions -->

---

<!-- ANCHOR:agents -->
## 4. Agents

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:when-to-use -->
