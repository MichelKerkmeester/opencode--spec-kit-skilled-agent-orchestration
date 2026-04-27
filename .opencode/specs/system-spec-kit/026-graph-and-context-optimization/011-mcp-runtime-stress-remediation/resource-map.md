---
title: "Resource Map — 011-mcp-runtime-stress-remediation phase parent"
description: "Parent-aggregate file ledger for the v1.0.1 MCP-runtime stress-test remediation cycle, covering both the 2026-04-27 carve-out from 003-continuity-memory-runtime and the in-place 006-014 → 001-009 renumber."
trigger_phrases:
  - "011 resource map"
  - "stress-test remediation file ledger"
  - "carve-out renumber paths"
importance_tier: "normal"
contextType: "general"
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 33
- **By category**: Documents=3, Specs=22, Skills=1, Config=1, Meta=3, READMEs=0, Commands=0, Agents=0, Scripts=0, Tests=0
- **Missing on disk**: 0 (the original autonomous-run handover document was deleted before this phase was created and is intentionally not tracked here; see `./context-index.md` §Deleted Predecessor Docs)
- **Scope**: Parent-aggregate ledger for the 011 phase parent, covering (a) the 2026-04-27 carve-out that moved 9 packets from `003-continuity-memory-runtime/` into this folder and (b) the same-day in-place renumber of those 9 packets from the 006-014 range to the 001-009 range.
- **Generated**: 2026-04-27T12:30:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Mode**: parent-aggregate. Per-child resource maps are NOT authored — this single map covers all 9 children.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/HANDOVER-deferred.md` | Moved + Updated | OK | Continuity doc for the cycle's still-open follow-ups; moved from `003-…/HANDOVER-deferred.md` and rewired for the renumbered children. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/context-index.md` | Created | OK | Migration bridge: old → new path map, reorganization rationale, deleted-predecessor pointer. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/resource-map.md` | Created | OK | This file. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/spec.md` | Created (rewritten v2) | OK | Phase-parent spec at Level 2; rewritten from a Level-1 carve-out narrative to the lean phase-parent template per `010-phase-parent-documentation/`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/description.json` | Created + Updated | OK | Phase-parent discovery metadata; child manifest reflects renumbered children. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/graph-metadata.json` | Created + Updated | OK | Phase-parent graph metadata; `children_ids` lists the renumbered 001-009; `derived.last_active_child_id` points at 001. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/` | Moved + Renamed | OK | From `003-…/006-search-intelligence-stress-test/`. v1.0.1 rubric + 30-cell sweep. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/002-mcp-runtime-improvement-research/` | Moved + Renamed | OK | From `003-…/007-mcp-runtime-improvement-research/`. 10-iter deep research. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/003-memory-context-truncation-contract/` | Moved + Renamed | OK | From `003-…/008-memory-context-truncation-contract/`. Token-budget contract. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/` | Moved + Renamed | OK | From `003-…/009-cocoindex-overfetch-dedup/`. Cocoindex fork + dedup. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/` | Moved + Renamed | OK | From `003-…/010-code-graph-fast-fail/`. Fallback-decision routing. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics/` | Moved + Renamed | OK | From `003-…/011-causal-graph-window-metrics/`. Causal-graph balance + window cap. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/007-intent-classifier-stability/` | Moved + Renamed | OK | From `003-…/012-intent-classifier-stability/`. IntentTelemetry + paraphrase corpus. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/008-mcp-daemon-rebuild-protocol/` | Moved + Renamed | OK | From `003-…/013-mcp-daemon-rebuild-protocol/`. Daemon rebuild + restart contract. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/009-memory-search-response-policy/` | Moved + Renamed | OK | From `003-…/014-memory-search-response-policy/`. Refusal contract for low-quality searches. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/**/description.json` | Updated | OK | Each renumbered child's `specId`, `specFolder`, `parentChain` rewired to the new parent + new local number. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/**/graph-metadata.json` | Updated | OK | Each renumbered child's `packet_id`, `spec_folder`, `parent_id` rewired. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/**/spec.md` | Updated | OK | Path-form `Spec Folder` and frontmatter pointers rewired across the renumbered children. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/**/plan.md` | Updated | OK | Sibling cross-references inside child plans rewired (e.g. `../006-…` → `../001-…`). |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/**/tasks.md` | Updated | OK | Sibling cross-references inside child task lists rewired. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/**/implementation-summary.md` | Updated | OK | "Spec Folder" header rows rewired to renumbered slugs; live-probe verification rows preserved verbatim. |
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
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md` | Updated | OK | PHASE DOCUMENTATION MAP gained a row for `011-mcp-runtime-stress-remediation/`; wrapper count updated 10 → 11; `006`/`011` numbering-gap commentary updated. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/description.json` | Updated | OK | `childTopology` includes `011-mcp-runtime-stress-remediation`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json` | Updated | OK | `children_ids` updated: stale `011-manual-testing-playbook-coverage-and-run` (no folder on disk) replaced with the real `011-mcp-runtime-stress-remediation`. |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

Maintenance notes for this map:

- **Mode is parent-aggregate** — do not author per-child resource maps for this phase parent. State that in the `Scope` line of any future regeneration.
- **Path conventions** — paths are repo-root relative; one path per row except where a `**` glob applies the same Action across all matches in the renumbered subtree.
- **Two immutable CLI run logs** under `001-search-intelligence-stress-test/002-scenario-execution/runs/{S3/cli-opencode-pure-1,I2/cli-copilot-1}/output.txt` reference legacy 003/006 paths and were intentionally NOT rewritten (they are historical CLI capture, not active spec content). They are not listed individually in the Specs section because they are leaf evidence inside an already-listed child; treat them as part of the `001-…` row's tree.
- **Future updates** — when the post-cycle work in `HANDOVER-deferred.md` lands (sweep re-run, 006 tuning, 007 v2 classifier, hallucination guard), append rows to the relevant section rather than rewriting this map.
- **Reference reading**: `.opencode/skill/system-spec-kit/templates/resource-map.md` (template), `.opencode/skill/system-spec-kit/SKILL.md` §3.
<!-- /ANCHOR:author-instructions -->
