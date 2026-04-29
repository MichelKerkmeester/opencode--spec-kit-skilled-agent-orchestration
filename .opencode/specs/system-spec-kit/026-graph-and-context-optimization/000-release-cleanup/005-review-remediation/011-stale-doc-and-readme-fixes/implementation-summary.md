---
title: "Implementation Summary: Stale Doc + README Fixes"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Closed 12 stale packet-continuity and README findings from 011 deep-review F-001/002/004/006 plus the README staleness audit HIGH and MEDIUM set."
trigger_phrases:
  - "011-stale-doc-and-readme-fixes complete"
  - "readme staleness remediation complete"
  - "F-001 F-002 F-004 F-006 closed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes"
    last_updated_at: "2026-04-29T11:12:30Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Closed 12 stale doc/README findings (F-001/002/004/006 + README audit HIGH+MED)"
    next_safe_action: "Re-run README staleness audit to confirm 0 STALE-HIGH"
    blockers: []
    key_files:
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/spec.md"
      - "/tmp/audit-readme-staleness-report.md"
    session_dedup:
      fingerprint: "sha256:011-stale-doc-and-readme-fixes-summary"
      session_id: "011-stale-doc-and-readme-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All README audit HIGH and MEDIUM findings were included."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-stale-doc-and-readme-fixes |
| **Completed** | 2026-04-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The stale documentation set is closed across packet continuity, code-adjacent READMEs, and skill READMEs. The edits retire 011 deep-review findings F-001, F-002, F-004, and F-006, plus the README staleness audit's 5 HIGH and 3 MEDIUM findings, without touching runtime code or tests.

### Requirement Disposition

| Requirement | Status | Evidence |
|-------------|--------|----------|
| REQ-001 | Met | Packet continuity updated in 023, 025, 028, and `.opencode/skill/system-spec-kit/references/structure/folder_structure.md` |
| REQ-002 | Met | Five code-adjacent READMEs updated; deleted embedding-readiness identifiers grep clean |
| REQ-003 | Met | Deep-review/deep-research READMEs now describe flat-first artifact dirs; sk-doc lists `playbook_feature` |
| REQ-004 | Met | Strict validator exits 0 after final continuity update |
| REQ-005 | Met by equivalent grep | Targeted stale-token greps return 0 hits for deleted identifiers and old layout terms |

### Files Changed

| File | Lines | Action |
|------|-------|--------|
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/plan.md` | 1-145 | Created Level 1 implementation plan |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/tasks.md` | 1-115 | Created and updated Level 1 task ledger |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/spec.md` | 48-53, 82-84 | Normalized shorthand paths so strict validation resolves them |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam/implementation-summary.md` | 4, 18-31, 62, 91, 101, 111 | Updated TC-3 from stale gap marker prose to packet-025 passing-state prose |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/tasks.md` | 17-29, 82-87, 95-100 | Removed stale typecheck-blocked state and marked final batch clean |
| `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes/spec.md` | 15-20 | Updated continuity to implementation complete and 100 percent |
| `.opencode/skill/system-spec-kit/references/structure/folder_structure.md` | 183-220 | Replaced child-phase layout example with flat-first plus conditional `pt-NN` example |
| `.opencode/skill/system-spec-kit/mcp_server/core/README.md` | 40 | Replaced stale embedding-readiness ownership with DB rebind/cache ownership |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` | 79 | Replaced deleted readiness setter with lazy embedding/provider startup path |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` | 118 | Updated Stage 3 rerank to conditional default-on, 4-candidate floor, and `rerankGateDecision` metadata |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` | 145-149 | Added `fallbackDecision` to blocked/degraded operator surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md` | 12-22 | Updated parser contract to Tree-sitter WASM default plus regex fallback and added newer modules |
| `.opencode/skill/sk-deep-review/README.md` | 216-229 | Rewrote review runtime state around flat-first `{artifact_dir}` and conditional `pt-NN` |
| `.opencode/skill/sk-deep-research/README.md` | 63-73, 134-147 | Rewrote research quick-start and runtime layout around flat-first `{artifact_dir}` and conditional `pt-NN` |
| `.opencode/skill/sk-doc/README.md` | 80, 149-155 | Added `playbook_feature` doctype and per-feature playbook path explanation |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes/implementation-summary.md` | 1-129 | Created completion summary and verification record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All edits were made as direct Markdown replacements or additions against the 12 scoped files, plus the packet's own Level 1 docs. Adjacent README paragraphs were checked around each cited line; related stale prose was updated where the audit issue extended beyond a single sentence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the 025 implementation summary unchanged | The 12-file authority listed 025 tasks, not the implementation summary; widening scope would violate the packet contract |
| Use equivalent grep instead of rerunning the unavailable audit script | The audit report is a static `/tmp` artifact; no audit runner was provided, so targeted stale-token probes directly verify the listed HIGH and MEDIUM findings |
| Record the missing registry as a limitation | The requested `review/deep-review-findings-registry.json` path does not exist under this packet or `/tmp`; the spec still carries the F-001/002/004/006 IDs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n 'setEmbeddingModelReady|isEmbeddingModelReady|embeddingModelReady|waitForEmbeddingModel' <5 code-adjacent READMEs>` | PASS: exit 1, 0 matches |
| `rg -n 'pt-01' .opencode/skill/sk-deep-review/README.md .opencode/skill/sk-deep-research/README.md` | PASS: exit 1, 0 matches |
| `rg -n 'regex-only|tree-sitter planned|optional, min 2 results|\{packet\}|\[packet-dir/\]|expected_fail|expected-failure' <target docs>` | PASS: exit 1, 0 matches |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/011-stale-doc-and-readme-fixes --strict` | PASS: exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **011 deep-review registry unavailable.** The requested `specs/.../011-stale-doc-and-readme-fixes/review/deep-review-findings-registry.json` file does not exist, and `/tmp` has no replacement. The implementation used `spec.md` and `/tmp/audit-readme-staleness-report.md` as the available authorities.
2. **Nearby 025 summary still contains historical typecheck-fail prose.** The packet contract listed 025 tasks only. Updating the 025 implementation summary would be a 13th target-file edit, so it remains unchanged.
3. **No runtime audit script was rerun.** Verification used targeted grep equivalent to the README audit findings because the audit report did not include an executable rerun command.
<!-- /ANCHOR:limitations -->
