---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: memory_search hard response policy + citation policy [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/009-memory-search-response-policy/spec]"
description: "Remediation packet for 007/Q4 (and 006 cli-opencode I2 hallucination). Adds responsePolicy.requiredAction / noCanonicalPathClaims / citationRequiredForPaths and citationPolicy fields to memory_search response so weak retrieval becomes a binding refusal contract instead of advisory metadata."
trigger_phrases:
  - "009-memory-search-response-policy"
  - "memory_search response policy"
  - "noCanonicalPathClaims"
  - "citationPolicy do_not_cite_results"
  - "weak retrieval refusal contract"
  - "Q4 hallucination guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/009-memory-search-response-policy"
    last_updated_at: "2026-04-27T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet from 007 §5 Q4 + §13 + §15"
    next_safe_action: "Dispatch cli-codex on tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: memory_search hard response policy + citation policy

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
| **Sources** | 007/Q4 (sec 2 + 5), 007/§13 Security, 007/§15 API, 006/I2 cli-opencode hallucination |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
006/I2 cli-opencode received `requestQuality:"weak"` plus `recovery.recommendedAction:"ask_user"` with `suggestedQueries:[]`, yet still synthesized canonical-looking spec folder paths and file references that did not exist. The 007 research isolated the root cause as a soft-contract problem: weak retrieval is exposed as advisory metadata inside a SUCCESS envelope. Model callers treat the success envelope as license to cite, then fill the gap with plausible-looking inventions when no concrete result is present.

### Purpose
Add hard `responsePolicy` and `citationPolicy` fields to `memory_search` responses so weak retrieval becomes a BINDING claim-authority refusal contract, not advisory text. When `requestQuality.label != "good"` AND `recovery.status` indicates degraded, the response carries `responsePolicy.noCanonicalPathClaims:true` and a `safeResponse` string that the model MUST emit instead of inventing details. Also extend `RecoveryAction` vocabulary to include `ask_disambiguation`, `refuse_without_evidence`, and `broaden_or_ask`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `responsePolicy: { requiredAction, noCanonicalPathClaims, citationRequiredForPaths, safeResponse }` to `memory_search` response data when retrieval is non-authoritative.
- Add `citationPolicy: "cite_results" | "do_not_cite_results"` field to all `memory_search` responses.
- Extend `RecoveryAction` vocabulary in `mcp_server/lib/search/recovery-payload.ts`.
- Implement `deriveResponsePolicy(requestQuality, recovery)` per 007 §9 example.
- Backfill `suggestedQueries` to never be empty when `recommendedAction:"ask_user"`; either generate safe broadening suggestions or set `requiredAction:"ask_disambiguation"`.
- Update vitest suite to cover the new contract.

### Out of Scope
- Changes to the underlying search retrieval/ranking pipeline.
- Caller-side enforcement (model behavior); contract is server-side.
- CocoIndex, code-graph, causal-graph (separate packets 009-011).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/formatters/search-results.ts` | Modify | Insert responsePolicy + citationPolicy at lines ~951-1035 |
| `mcp_server/lib/search/recovery-payload.ts` | Modify | Extend RecoveryAction enum + suggestedQueries non-empty guarantee |
| `mcp_server/tests/d5-recovery-payload.vitest.ts` | Modify | Add response-policy assertions |
| `mcp_server/tests/empty-result-recovery.vitest.ts` | Modify | Add citation-policy assertions |
| `spec.md` | Create | This file |
| `plan.md` | Create | Root cause + change surface |
| `tasks.md` | Create | Per-defect work units |
| `implementation-summary.md` | Create | Placeholder |
| `description.json` | Create | Spec metadata |
| `graph-metadata.json` | Create | Graph-derived metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Refusal Contract

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When `requestQuality.label != "good"` AND `recovery.status` in {`low_confidence`, `partial`, `no_results`}, response MUST include `responsePolicy.requiredAction` set to one of `ask_disambiguation` \| `broaden_or_ask` \| `refuse_without_evidence`. | After fix, 006/I2 repro returns `responsePolicy.requiredAction:"ask_disambiguation"` (or appropriate value), `noCanonicalPathClaims:true`, and a `safeResponse` string. |
| REQ-002 | All `memory_search` responses MUST carry `citationPolicy` set to `"cite_results"` (good quality) or `"do_not_cite_results"` (weak/partial/no_results). | After fix, every response envelope has `data.citationPolicy` field. |
| REQ-003 | When `recommendedAction:"ask_user"` AND `suggestedQueries.length === 0`, the runtime MUST either synthesize at least 2 safe broadening suggestions OR set `responsePolicy.requiredAction:"ask_disambiguation"`. Empty suggestions MUST never co-exist with no policy guidance. | After fix, the 006/I2 repro shows non-empty suggestedQueries OR responsePolicy.requiredAction set. |
| REQ-004 | `RecoveryAction` enum MUST include `ask_disambiguation`, `refuse_without_evidence`, `broaden_or_ask` in addition to existing values. | After fix, `recovery-payload.ts:28-37` enum lists all 7 action values. |

### Acceptance Scenarios

**Given** a weak-retrieval search like 006/I2 (cli-opencode's "find the spec for the cache warning hooks packet"), **when** the response is built, **then** `data.responsePolicy.noCanonicalPathClaims:true`, `data.citationPolicy:"do_not_cite_results"`, and `data.responsePolicy.safeResponse` contains a string instructing the caller to ask for clarification rather than invent paths.

**Given** a strong retrieval (good quality + concrete results), **when** the response is built, **then** `data.citationPolicy:"cite_results"` and no `responsePolicy` block is emitted.

**Given** a `recommendedAction:"ask_user"` with empty `suggestedQueries`, **when** the response is built, **then** EITHER `suggestedQueries.length >= 2` OR `responsePolicy.requiredAction:"ask_disambiguation"`. Both empty + no policy is a contract violation.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 REQs covered by green vitest assertions.
- **SC-002**: 006/I2 repro (after dist rebuild + daemon restart) shows responsePolicy + citationPolicy on weak-retrieval response.
- **SC-003**: Strong-retrieval probe shows `citationPolicy:"cite_results"`, no responsePolicy.
- **SC-004**: Validation passes via `validate.sh --strict`.
- **SC-005**: dist marker grep confirms new fields compiled.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing callers may strict-validate response shape; new fields could break them. | Medium | New fields are additive in the optional `data` block. |
| Risk | Phantom-fix recurrence — patches without daemon restart. | High | Verification REQUIRES `npm run build` + documented restart. See packet 013. |
| Dependency | RecoveryAction enum is referenced in multiple files. | Medium | Audit all usages before extending. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `safeResponse` be a fixed string per `requiredAction` value, or contextual per query? Default: fixed canonical strings keyed by action.
- Do we add a `WARN` log line server-side when policy fires, for analytics? Defer to Phase D.
<!-- /ANCHOR:questions -->
