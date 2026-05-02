---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Catalog and playbook degraded-alignment [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment/plan]"
description: "Three-file documentation patch with shared-vocabulary / handler-local-shape wording and Zod schema cite for rankingSignals."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "catalog playbook degraded plan"
  - "018 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment"
    last_updated_at: "2026-04-27T22:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and remaining packet files"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Catalog and playbook degraded-alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (catalog + playbook) |
| **Framework** | None — prose edits |
| **Storage** | Filesystem (`.opencode/skill/system-spec-kit/feature_catalog/` + `manual_testing_playbook/`) |
| **Testing** | Read-back verification + `validate.sh --strict` on the packet |

### Overview
Three surgical Markdown edits aligning operator-facing documentation with the runtime contract for the code-graph degraded-readiness envelope, plus the Zod schema reality for `rankingSignals`. No code change. The catalog edits use forward references to packet 016's implementation-summary because 016 is being implemented in parallel; the binding expectation while 016 is in flight is the review-report §3 / §7 Packet A from `011-post-stress-followup-research`.

### Pre-step
1. Verify packet 016 status (whether the implementation-summary exists and what field name it actually ships). At time of authoring: 016 folder is empty → write against expected contract from review-report.
2. Verify hardlink topology: `stat -f %l <file>` shows link count = 1 for all three target files → single edit per file is sufficient.
3. Verify Zod schema reality: `mcp_server/schemas/tool-input-schemas.ts:482-492` confirms `rankingSignals: z.array(z.string()).optional()`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] review-report §4 (F-005 / F-007 / F-008 doc parts) and §7 Packet C read end-to-end
- [x] Source-of-truth Zod schema confirmed at `mcp_server/schemas/tool-input-schemas.ts:482-492`
- [x] Packet 016 status checked (empty folder → write against expected contract)
- [x] Hardlink topology verified (link count = 1; only `.opencode/` hosts these files)

### Definition of Done
- [x] All 3 target Markdown files edited
- [x] All 7 packet docs authored
- [ ] `validate.sh --strict` PASS on this packet
- [ ] Re-read pass confirms wording is consistent between the auto-trigger and readiness-contract catalog pages
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Forward-reference cross-doc edits. The two catalog pages (auto-trigger + readiness-contract) both point at packet 016's implementation-summary as the binding source for the context readiness-crash field name. The playbook page is self-contained: it cites the Zod schema directly (file + line range).

### Key Components
- **Auto-trigger catalog page** lines 15-30 — recovery-routing payload paragraph. Was: single bullet promising `fallbackDecision` with `nextTool: "rg"` for both query and context readiness-crash. Is: per-handler bullets (query / context / status) with a footnote for the canonical field name on context readiness-crash.
- **Readiness-contract catalog page** §1 OVERVIEW (~lines 12-32) — vocabulary-vs-shape paragraph. Was: implied one universal degraded-response type. Is: explicit "shared vocabulary, handler-local payload fields" rule + concrete per-handler shape paragraphs.
- **CocoIndex routing playbook page** lines 134, 144, 152-153 — rankingSignals shape. Was: `rankingSignals (object)`. Is: `rankingSignals (array of strings)` with Zod schema cite + Pass/Fail criterion update.

### Cross-doc consistency rules
- The phrase "shared vocabulary, handler-local payload fields" is the canonical wording. Both catalog pages use it.
- The footnote in the auto-trigger page MUST cite the absolute spec-folder path of 016's implementation-summary so readers can find it whether or not 016 has landed yet.
- The CocoIndex routing playbook page MUST cite the Zod schema by file path + line range (`mcp_server/schemas/tool-input-schemas.ts:482-492`) so the wording is verifiable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: F-005 — auto-trigger catalog page
- [x] Read lines 15-23 (or surrounding paragraph)
- [x] Replace the single `fallbackDecision` bullet with three per-handler bullets (query / context / status)
- [x] Add footnote citing 016's implementation-summary + the review-report §3 / §7 Packet A as the binding-expectation fallback

### Phase 2: F-008 (doc parts) — readiness-contract catalog page
- [x] Read §1 OVERVIEW
- [x] Add explicit "shared vocabulary, handler-local payload fields" rule
- [x] List concrete per-handler shape (query / context / status) with the same wording philosophy as the auto-trigger page

### Phase 3: F-007 — CocoIndex routing playbook page
- [x] Read lines 133-144 (Prompt + Expected paragraph)
- [x] Change `rankingSignals (object)` to `rankingSignals (array of strings)`
- [x] Update the Expected paragraph to cite the Zod schema line range
- [x] Update the Pass/Fail criterion to assert `Array<string>` shape

### Phase 4: Packet authoring + verification
- [x] Author packet docs (spec, plan, tasks, checklist, description.json, graph-metadata.json, implementation-summary)
- [ ] Run `validate.sh --strict` on the packet folder
- [ ] Re-read each modified catalog/playbook file to confirm the wording is consistent
- [ ] `git diff --name-only` confirms no code files (only `.md` + `.json` under the catalog/playbook + 018 packet folder)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Direct re-read | Wording matches REQ-001..006 | Manual `Read` tool |
| Spec validator | Packet structure (Level-1 file set, frontmatter, anchors) | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Diff scope check | Only `.md` + `.json` files in scope | `git diff --name-only` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `011-post-stress-followup-research` review-report | Internal — review source of truth | Published, immutable for this purpose | None — packet is unblocked |
| `016-degraded-readiness-envelope-parity` | Sibling packet (Packet A) | In flight (folder empty at write time) | Catalog footnote uses forward reference; if 016 ships a different field shape than the review-report §3 / §7 Packet A, a Packet C-prime patch updates the wording |
| `014-graph-status-readiness-snapshot` | Sibling packet (status snapshot helper) | Complete | None — referenced for cross-cutting consistency |
| `015-cocoindex-seed-telemetry-passthrough` | Sibling packet (anchor telemetry) | Complete | None — provides the Zod schema cite path |
| `005-code-graph-fast-fail` | Sibling packet (related historical context) | Complete | None — `related_to` link for graph metadata |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Catalog/playbook wording proves to mislead operators after 016 lands with a different field shape than expected, OR a re-read finds the wording is internally inconsistent.
- **Procedure**: Single-commit revert of the 3 Markdown files. The packet docs themselves remain as historical record (Level-1 packet completion). Re-issue under a Packet C-prime spec folder if substantive rewording is needed. Documentation rollback is non-destructive: no consumers programmatically parse these pages.
<!-- /ANCHOR:rollback -->
