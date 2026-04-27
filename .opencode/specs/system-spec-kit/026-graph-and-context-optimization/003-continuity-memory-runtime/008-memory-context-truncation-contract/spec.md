---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: memory_context truncation contract + token telemetry [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/008-memory-context-truncation-contract/spec]"
description: "Remediation packet for 005/REQ-002 + 007/Q5 — adds preEnforcementTokens / returnedTokens / droppedAllResultsReason fields, asserts payload/count invariant, and forbids the post-fallback zero-fill envelope from masquerading as a normal truncated response."
trigger_phrases:
  - "008-memory-context-truncation-contract"
  - "memory context truncation contract"
  - "preEnforcementTokens returnedTokens"
  - "droppedAllResultsReason"
  - "token telemetry split"
  - "memory_context payload count invariant"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/008-memory-context-truncation-contract"
    last_updated_at: "2026-04-27T09:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded remediation packet from 007 research §11 Rec #1"
    next_safe_action: "Dispatch cli-codex implementation against the contract additions"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions:
      - "Should preEnforcementTokens be added to inner content[0].text payload too, or only meta?"
      - "Define droppedAllResultsReason enum precisely (impossible_budget | parse_failed | no_survivor_fits)"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: memory_context truncation contract + token telemetry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Sources** | 005/REQ-002, 007/research.md §5 (Q5 Contract), §9, §11 Rec #1, §15 |
| **Sibling Phases** | 005-memory-search-runtime-bugs, 006-search-intelligence-stress-test, 007-mcp-runtime-improvement-research |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 005 post-remediation verification (2026-04-26 18:49) showed that the Cluster 1 truncation fix is NOT live in the daemon: `memory_context({input:"Semantic Search"})` still returns `meta.tokenBudgetEnforcement.{enforced:true, truncated:true, returnedResultCount:3, originalResultCount:5}` while `actualTokens=65 / budgetTokens=3500` (1.9% utilization) and `data.content[0].text` still contains `{"count":0,"results":[]}`. The 007 research isolated the root cause as soft contracts: `actualTokens` is reported AFTER fallback (post-enforcement size), there is no `preEnforcementTokens` to distinguish overflow from returned size, and the wrapper has no payload/count invariant assertion that the metadata's `returnedResultCount` matches the actual `JSON.parse(content[0].text).data.results.length`.

### Purpose
Add hard token-telemetry fields to `meta.tokenBudgetEnforcement` so callers can distinguish overflow size from returned size, name empty fallback as a degraded outcome (`droppedAllResultsReason`), and enforce the `returnedResultCount === payload.results.length` invariant in tests. This prevents callers from misdiagnosing a 2% truncation when the real signal is "fallback chain emptied the payload."
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `preEnforcementTokens`, `returnedTokens`, and `droppedAllResultsReason` fields to `meta.tokenBudgetEnforcement` in the `memory_context` handler.
- Keep `actualTokens` for backward compatibility; document as alias of `returnedTokens`.
- Assert payload/count invariant: `returnedResultCount === JSON.parse(content[0].text).data.results.length` in unit tests.
- Treat empty fallback as degraded: when `returnedResultCount === 0`, MUST emit a `droppedAllResultsReason`.
- Update vitest suite to parse the final nested payload (not just metadata) and assert the invariant.
- Rebuild dist + document MCP daemon restart requirement.

### Out of Scope
- `memory_search` response policy / citation policy (packet 008b candidate or merged here? — see open questions; for now scoped to memory_context-side wrapper).
- Changes to the underlying `memory_search` retrieval pipeline.
- Changes to budget VALUES; only telemetry contract.
- CocoIndex, code-graph, causal-graph, intent-classifier surfaces (separate packets 009-012).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-context.ts` | Modify | Add preEnforcementTokens/returnedTokens/droppedAllResultsReason; preserve invariant in fallback path |
| `mcp_server/tests/token-budget-enforcement.vitest.ts` | Modify | Add invariant assertion + empty-fallback test cases |
| `mcp_server/tests/memory-context.vitest.ts` | Modify | Strengthen the existing under-budget test to parse nested payload count |
| `mcp_server/dist/handlers/memory-context.js` | Build artifact | Regenerated by `npm run build` |
| `spec.md` | Create | This file |
| `plan.md` | Create | Root cause + change surface |
| `tasks.md` | Create | Per-defect work units |
| `implementation-summary.md` | Create | Placeholder until impl lands |
| `description.json` | Create | Spec metadata |
| `graph-metadata.json` | Create | Graph-derived metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Contract-Level Telemetry

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `meta.tokenBudgetEnforcement` MUST include `preEnforcementTokens` measuring the wrapper payload size BEFORE any truncation/fallback. | After fix, every response carrying `tokenBudgetEnforcement` includes `preEnforcementTokens: number`. When no truncation occurs, `preEnforcementTokens === actualTokens`. When truncation occurs, `preEnforcementTokens > budgetTokens`. |
| REQ-002 | `meta.tokenBudgetEnforcement` MUST include `returnedTokens` measuring the FINAL emitted payload size. | After fix, `returnedTokens` is always the size of the final response body. `actualTokens` is documented as an alias for backward compatibility. |
| REQ-003 | When the fallback chain produces an empty payload (`results.length === 0`), `meta.tokenBudgetEnforcement.droppedAllResultsReason` MUST be set and MUST be one of `impossible_budget` \| `parse_failed` \| `no_survivor_fits`. | After fix, the 005 Probe B repro that returns `count:0,results:[]` carries `droppedAllResultsReason: "impossible_budget"` (or appropriate value), surfacing the degraded outcome explicitly. |
| REQ-004 | The `returnedResultCount` metadata MUST equal `JSON.parse(content[0].text).data.results.length`. | After fix, a unit-test helper `expectReturnedCountMatchesPayload()` parses the final text and asserts equality. The existing pattern at `mcp_server/tests/token-budget-enforcement.vitest.ts:151-162` extends to memory-context.vitest.ts. |
| REQ-005 | When `actualTokens / budgetTokens < 0.50`, no truncation MUST occur. | After fix, the 005 Probe B repro (`actualTokens=65 / budgetTokens=3500 = 1.9%`) returns the full `originalResultCount` results unmodified, with `enforced:false, truncated:false`. |

### Acceptance Scenarios

**Given** `memory_context({input:"Semantic Search", mode:"auto"})`, **when** the original payload fits well under budget, **then** `meta.tokenBudgetEnforcement.{enforced:false, truncated:false}`, `preEnforcementTokens === returnedTokens === actualTokens`, no `droppedAllResultsReason`, and `data.content[0].text` contains the actual results.

**Given** an over-budget payload that the fallback chain cannot reduce without dropping all results, **when** the response is built, **then** `meta.tokenBudgetEnforcement` includes `enforced:true, truncated:true, preEnforcementTokens > budgetTokens, returnedTokens <= budgetTokens, returnedResultCount:0, droppedAllResultsReason:"impossible_budget"`.

**Given** a fixture with N=5 results and a budget that fits 3 of them, **when** truncation runs, **then** `returnedResultCount === 3` AND `JSON.parse(content[0].text).data.results.length === 3`.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 REQs covered by green vitest assertions.
- **SC-002**: 005 Probe B (Semantic Search) re-run after dist rebuild + MCP daemon restart shows `count > 0` in `data.content[0].text`.
- **SC-003**: New test helper `expectReturnedCountMatchesPayload()` exists in shared test utils, used by at least 2 tests.
- **SC-004**: Validation passes via `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`.
- **SC-005**: `npm run build` regenerates `dist/handlers/memory-context.js` with new fields visible in compiled output (grep marker check).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renaming `actualTokens` would break downstream consumers. | High | Keep `actualTokens` as alias of `returnedTokens`; do NOT remove. |
| Risk | Adding required fields could break callers that do strict shape validation. | Medium | New fields are additive in the optional `meta.tokenBudgetEnforcement` block; existing fields retain shape. |
| Dependency | Phantom-fix risk per 005 lesson — source patches without daemon restart appear to "fail." | High | This packet's verification REQUIRES `npm run build` AND a documented MCP-owning client restart before live probe. See packet 013 for the canonical rebuild protocol. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `preEnforcementTokens` be reported in the inner content[0].text payload too, or only `meta`? Default: `meta` only.
- Are there additional `droppedAllResultsReason` values we need beyond the three documented? Add as discovered, but start conservative.
<!-- /ANCHOR:questions -->
