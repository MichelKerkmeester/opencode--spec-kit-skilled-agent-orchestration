---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: Catalog and playbook degraded-alignment [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment/spec]"
description: "Docs-only Packet C from 011-post-stress-followup-research review-report. Aligns three catalog/playbook entries with the shipped (or expected, pending packet 016) degraded-readiness envelope vocabulary, and corrects rankingSignals shape from object to array of strings to match the Zod schema."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
trigger_phrases:
  - "018-catalog-playbook-degraded-alignment"
  - "catalog playbook degraded alignment"
  - "F-005 catalog fallbackDecision"
  - "F-007 rankingSignals array"
  - "F-008 readiness contract handler-local"
  - "packet C deep-review docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment"
    last_updated_at: "2026-04-27T22:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan tasks checklist files"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md"
      - ".opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md"
      - ".opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md"
    completion_pct: 30
    open_questions:
      - "Does packet 016 ship fallbackDecision with nextTool rg or a differently named field for context readiness-crash"
    answered_questions:
      - "Are these files hardlinked across runtimes? No — stat -f %l returns 1 link per file"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Catalog and playbook degraded-alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 017-cli-copilot-dispatch-test-parity; SUCCESSOR: none -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-04-27 |
| **Sources** | `../011-post-stress-followup-research/review/review-report.md` §4 (F-005 / F-007 / F-008 doc parts) and §7 Packet C |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three operator-facing documentation surfaces drifted from the shipped runtime contract in ways that mislead readers reproducing degraded-state scenarios:

- **F-005**: `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` lines 15-23 describe the `fallbackDecision` recovery routing as if `code_graph_query` and `code_graph_context` share one universal contract. In reality the routing payload is handler-local; the readiness-crash branch for context is being shipped by packet `016-degraded-readiness-envelope-parity` with a possibly different field path.
- **F-007**: `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` lines 133-144 say `rankingSignals (object)` while the Zod schema at `mcp_server/schemas/tool-input-schemas.ts:482-492` accepts `rankingSignals: z.array(z.string()).optional()`. Operators following the playbook construct the wrong shape and waste a debugging cycle.
- **F-008 (doc parts)**: `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` reads as if the readiness contract is one shared response type. The actual contract is **shared vocabulary, handler-local payload fields** — `code_graph_query`, `code_graph_context`, and `code_graph_status` each emit their own surface around the shared `readiness` / `canonicalReadiness` / `trustState` block.

### Purpose
Align the three catalog/playbook entries with shipped behavior so an operator reading them constructs correct payloads, sees the right fields on degraded-state probes, and understands that handler responses are NOT a single universal type. Packet 016 is the source of truth for the `code_graph_context` readiness-crash field name; this packet either references that source post-016-landing OR points readers at the binding expectation in the review-report §3 / §7 Packet A while 016 is in flight.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Edit `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md`. Split the single `fallbackDecision` bullet into per-handler bullets (query / context / status). Add a footnote pointing at 016's implementation-summary for the canonical field name on context readiness-crash. Reference review-report §3 / §7 Packet A as the binding expectation while 016 is in flight.
- Edit `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md`. State the shared-vocabulary / handler-local-shape rule explicitly. List the concrete shape per handler. Cross-reference packet 016 for the context readiness-crash envelope.
- Edit `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md`. Change `rankingSignals (object)` to `rankingSignals (array of strings)`. Cite the Zod schema line range. Update the Pass/Fail criterion to assert `Array<string>` shape.
- Author the 7-file Level-1 packet (spec, plan, tasks, checklist, description.json, graph-metadata.json, implementation-summary).

### Out of Scope
- ANY code change. This is documentation-only.
- ANY edit to packet 016 or 017 docs / code.
- ANY edit to packets 003-015 (frozen).
- Adding a new feature catalog entry for the readiness-crash envelope. If 016 ships a separately-named field, that page can be authored as a follow-on; here we only adjust the cross-references in the two existing pages.
- Per-runtime copies of these files. The `stat -f %l` check confirms link count = 1 per file (NOT hardlinked across runtimes); only `.opencode/skill/system-spec-kit/` hosts them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/15-code-graph-auto-trigger.md` | Modify | Per-handler bullets + footnote referencing 016 implementation-summary |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/24-code-graph-readiness-contract.md` | Modify | Shared-vocabulary / handler-local-shape rule with concrete per-handler shape |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md` | Modify | rankingSignals (array of strings) + schema line cite + Pass/Fail update |
| `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 — Documentation alignment

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The auto-trigger catalog page MUST describe the recovery-routing payload as handler-local with separate bullets for `code_graph_query`, `code_graph_context`, and `code_graph_status`, AND MUST reference packet 016's implementation-summary (or while-in-flight, the review-report §3 / §7 Packet A) for the context readiness-crash field shape. | Read the page; confirm three handler-specific bullets and the footnote reference are present. |
| REQ-002 | The readiness-contract catalog page MUST state explicitly that the contract is "shared vocabulary, handler-local payload fields" and MUST list the concrete per-handler shape (query / context / status). | Read the page; confirm the rule is stated and three handler-specific paragraphs exist. |
| REQ-003 | The CocoIndex routing playbook page MUST describe `rankingSignals` as an array of strings (matching the Zod shape `z.array(z.string()).optional()` at `mcp_server/schemas/tool-input-schemas.ts:482-492`) and MUST update the Pass/Fail criterion to assert `Array<string>`. | Read the page; confirm wording is `rankingSignals (array of strings)` and the Pass/Fail line asserts the array shape. |

### P0 — Invariants (NON-NEGOTIABLE)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | NO code (`.ts`, `.js`, `.py`, `.sh`) file MUST be modified by this packet. | `git diff --name-only` for the packet's working set shows ONLY `.md` and `.json` files under the catalog/playbook + 018 packet folder. |
| REQ-005 | NO file in packets 003-015, 016, or 017 MUST be modified by this packet. | `git diff --name-only` shows no entries in those sibling folders. |
| REQ-006 | The catalog footnote MUST cite packet 016 by absolute spec-folder path so readers can find it whether or not 016 has landed. | Read the auto-trigger catalog page; confirm the path under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/` is present verbatim. |

### Acceptance Scenarios

**Given** an operator reading the auto-trigger catalog page after this packet lands, **when** they look up the recovery routing for `code_graph_context` on a readiness-crash, **then** they see (a) that the field path is handler-local, (b) the binding source is packet 016's implementation-summary, and (c) the binding expectation while 016 is in flight is the review-report §3 / §7 Packet A — they do NOT infer a `fallbackDecision: { nextTool: "rg" }` shape from the page itself.

**Given** an operator following the CocoIndex telemetry probe in the routing playbook page, **when** they validate the response, **then** they assert `rankingSignals` as `Array<string>` (matching the Zod schema), not as an object — and the Pass/Fail line confirms that assertion shape.

**Given** an operator reading the readiness-contract catalog page, **when** they want to know the shape of a degraded response, **then** they see one paragraph per handler (query / context / status) and the explicit "shared vocabulary, handler-local payload fields" rule — they do NOT assume one universal type covers all three.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 REQs verified by direct re-read of the modified files.
- **SC-002**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/018-catalog-playbook-degraded-alignment --strict` PASS.
- **SC-003**: `git diff --name-only` shows only the 3 catalog/playbook files + 7 packet docs.
- **SC-004**: No `.ts` / `.js` / `.py` / `.sh` files appear in the diff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 016 (`016-degraded-readiness-envelope-parity`) ships a specific field name for context readiness-crash | Medium — if 016 ships under a different field than `fallbackDecision`, this packet's footnote is the only correct reference. The body of the page intentionally avoids stating a specific field name; it points readers at 016. | Catalog footnote and readiness-contract page cross-reference 016's implementation-summary. If 016's contract differs from review-report §3 / §7 Packet A, a follow-up patch (informally "Packet C-prime") may need to refresh the wording. |
| Risk | Operator reads page mid-016-landing window | Low — the binding-expectation reference points at the review-report §3 / §7 Packet A, which is published and immutable for this purpose. | Footnote explicitly names the fallback source ("Until 016 lands, the contract defined in packet 011's review-report §3 / §7 Packet A is the binding expectation"). |
| Risk | Other runtime directories (`.gemini`, `.claude`, `.codex`) start hosting feature_catalog/manual_testing_playbook copies in the future | Low | The `stat` check confirmed link count = 1 today. If a future packet introduces hardlinks or copies, that packet owns the sync — outside scope here. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does 016 ship `fallbackDecision: { nextTool: "rg", reason: "..." }` for `code_graph_context` readiness-crash, OR a different field name? **Resolution path**: read 016's implementation-summary after it lands; if the wording in the auto-trigger catalog page materially differs from 016's actual contract, queue a Packet C-prime to refresh the wording (single-edit; same surface).
- Should the readiness-contract catalog page host the canonical "envelope parity" table once 016 is final? Deferred — that's a follow-on documentation packet, not in scope here.

### 016 coordination strategy (decision-record supplement)

This packet was authored while packet 016 was empty (folder existed but no spec docs at the time of writing). The catalog and readiness-contract pages therefore use **forward references** to 016's implementation-summary for the canonical field name on `code_graph_context` readiness-crash, and use the review-report §3 / §7 Packet A (an immutable published source) as the binding expectation in the meantime.

**Why this is acceptable for a P2 docs-only packet**: the wording does NOT promise a specific field shape — it points readers at the source-of-truth document, which is the correct pattern when two packets have a contract dependency and land in any order. The catalog reader gets the right answer regardless of land order.

**Trigger for follow-up patch (Packet C-prime)**: if 016's shipped contract differs from the review-report §3 / §7 Packet A's expectation (e.g., if 016 names the field something other than `fallbackDecision: { nextTool: "rg" }`), a single-edit patch updates the catalog wording. Both pages already point at 016 for the binding shape, so the body text needs minimal adjustment.
<!-- /ANCHOR:questions -->
