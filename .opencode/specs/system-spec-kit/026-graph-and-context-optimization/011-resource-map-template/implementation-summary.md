---
title: "Implementation Summary: Resource Map Template [system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/implementation-summary]"
description: "Three sub-phases delivered: local-owner deep-loop artifact placement restored, resource-map template wired into all discovery surfaces, and convergence-time emission integrated into both deep-loop skills."
trigger_phrases:
  - "011-resource-map-template implementation summary"
  - "resource map template packet summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Created packet-root implementation-summary.md with sub-phase status sections"
    next_safe_action: "Run validate.sh --strict on packet root"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/spec.md"
      - ".opencode/skill/system-spec-kit/templates/resource-map.md"
      - ".opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs"
      - ".opencode/skill/system-spec-kit/shared/review-research-paths.cjs"
    session_dedup:
      fingerprint: "sha256:011-resource-map-template-root-impl-summary"
      session_id: "011-resource-map-template-root-scaffold"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Phase 001 is complete — local-owner artifact placement restored and repo-wide migration executed."
      - "Phase 002 is in-progress at 85% — template and surfaces wired; final validate.sh run pending."
      - "Phase 003 is complete — convergence-time emission shipped with F001-F004 closed."
---
# Implementation Summary: Resource Map Template

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-resource-map-template |
| **Completed** | 2026-04-24 (Phase 001, 003); Phase 002 in-progress |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 011-resource-map-template packet closed a recurring pain point: reviewers had no fast way to answer "what files did this loop touch" and deep-loop artifacts were landing in the wrong spec folder. Three coordinated sub-phases fixed the placement policy, introduced the reusable template, and wired automatic map emission into every autonomous deep-loop run — all without adding new scan costs or changing convergence math.

### Resource Map Template (`resource-map.md`)

You can now copy `resource-map.md` from the templates root into any packet at any level (1 through 3+) and fill the ten-category path ledger. The template is optional everywhere — no hard block in `validate.sh` — and the MCP spec-doc classifier now recognizes the filename, so memory saves index it automatically. Every level README, SKILL.md, and the references catalog all point to the new template so operators find it beside `handover.md` and `debug-delegation.md`.

### Local-Owner Artifact Placement

Child-phase and sub-phase deep loops now write their research and review artifacts beside the target spec, not under an ancestor root. The `review-research-paths.cjs` resolver was rolled back to the local-owner contract, a migration script moved every misplaced child packet to its correct owner folder, and the historical origin of the centralized behavior was documented against the `006-integrity-parity-closure` closure work.

### Convergence-Time Resource Map Emission

Running `/spec_kit:deep-review :auto` or `/spec_kit:deep-research :auto` now produces a `resource-map.md` in the resolved local-owner packet folder at convergence. A shared extractor (`extract-from-evidence.cjs`) reads the per-iteration delta JSON already captured during the run and categorizes every touched path into the ten-column skeleton. Review maps carry per-file findings counts (P0/P1/P2); research maps carry per-file citation counts. Opt-out is `--no-resource-map` or `emit: false` in the YAML config; partial writes never occur on a clean opt-out.

## Sub-phase Summaries

### 001-reverse-parent-research-review-folders

**Status: Complete** (completion_pct: 100)

`review-research-paths.cjs` is back to local-owner resolution. A two-script migration (`migrate-deep-loop-local-owner.cjs` and `migrate-deep-loop-legacy-owner-map.cjs`) moved every misplaced child packet and cleaned up the residual owner-map directories under `026-graph-and-context-optimization`. Phase-local `resource-map.md` ledger documents all touched paths. All command YAMLs, docs, and mirrors describe the restored child-local packet policy. Phase 003 now depends on this contract being in place.

### 002-resource-map-template-creation

**Status: In Progress** (completion_pct: 85)

The `resource-map.md` template exists at the templates root with correct frontmatter and ten category sections (READMEs, Documents, Commands, Agents, Skills, Specs, Scripts, Tests, Config, Meta). All five level READMEs, the main templates README, SKILL.md, the skill README, `references/templates/level_specifications.md`, the feature catalog, the manual testing playbook, and CLAUDE.md have been updated. The `SPEC_DOCUMENT_FILENAMES` constant in `spec-doc-paths.ts` now includes the new filename. A final `validate.sh --strict` run is pending to close the last 15%.

### 003-resource-map-deep-loop-integration

**Status: Complete** (completion_pct: 100, status: conditional)

The shared extractor lives at `scripts/resource-map/extract-from-evidence.cjs` and exports `emitResourceMap({ shape, deltas, packet, scope })`. Both `sk-deep-review` and `sk-deep-research` `reduce-state.cjs` scripts call it at convergence. All four YAML workflows include the post-convergence emission step guarded by `config.resource_map.emit: true` (default on). F001–F004 from the 7-iteration deep-review were closed: file:line normalization in the extractor (F001), regression vitest added (F003), `{artifact_dir}` doc alignment in `deep-review.md` and `deep-research.md` (F004), and T035 deferred with reconciled status across tasks/checklist/summary (F002). The T030 vitest command has a pre-existing include/root mismatch in `mcp_server/vitest.config.ts`; the assertions pass with an explicit root override.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 001 and Phase 003 shipped through autonomous cli-codex and cli-copilot runs, each followed by a 7-iteration deep-review convergence pass. Phase 002 was implemented in a focused direct-edit session. F001–F004 findings from the Phase 003 deep-review were fixed in a single remediation pass before the final status was set to conditional-complete. The packet-root Level 3 docs (this file and siblings) were created in one synchronized pass after all three sub-phases reached their respective completion states.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Local-owner over parent-root placement | Child packet history must live beside the owning spec; parent-root placement forced ancestor traversal and broke reviewer workflow |
| Template optional at all levels | The resource map is high-value for complex packets but overhead for simple ones; we chose additive over mandatory |
| Shared extractor (single script, both shapes) | One code path for both review and research delta shapes keeps the maintenance surface minimal and the output format consistent |
| Convergence-only emission (not per-iteration) | Partial-state maps would mislead reviewers; emitting once at convergence ensures the map reflects the full run |
| T035 deferred (not blocking) | Validator drift is a pre-existing out-of-scope issue in the packet-doc chain; deferring keeps Phase 003 status clean without hiding the known gap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 001 validate.sh --strict | PASS |
| Phase 002 validate.sh --strict | Pending (final run) |
| Phase 003 validate.sh --strict | PASS |
| Extractor vitest (both shapes) | PASS (with explicit root override for mcp_server config) |
| Resolver tests (root/child/nested/rerun) | PASS |
| F001 file:line normalization | PASS |
| F003 regression vitest | PASS |
| F004 {artifact_dir} doc alignment | PASS |
| F002 T035 deferred status reconciliation | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T030 vitest command** The existing `mcp_server/vitest.config.ts` has an include/root mismatch that blocks the canonical `npm test` invocation; extractor assertions pass with an explicit root override. This is a pre-existing config issue outside Phase 003 scope.
2. **Phase 002 final validation** One `validate.sh --strict` run is pending on the 002 packet to confirm exit 0 after all surface updates landed.
3. **Interim emission not implemented** Per-iteration `resource-map.md` refresh (emit_interim: true) is a P2 defer tracked in Phase 003 tasks.
<!-- /ANCHOR:limitations -->
