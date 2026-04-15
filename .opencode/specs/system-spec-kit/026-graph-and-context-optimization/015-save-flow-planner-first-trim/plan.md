---
title: "Implementation Plan: Save Flow Planner-First Trim"
description: "Translate packet 014's trim-targeted research verdict into an implementation plan that makes planner output the default `/memory:save` experience while preserving canonical atomic fallback and moving advisory save-time work off the hot path."
trigger_phrases:
  - "015-save-flow-planner-first-trim"
  - "implementation plan"
  - "planner-first save flow"
  - "save path trim"
  - "memory save fallback"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored Level 3 docs scaffold from 014 research findings"
    next_safe_action: "Review packet; run 3 transcript prototypes"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-save-flow-planner-first-trim-seed"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Save Flow Planner-First Trim

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript handler and workflow code plus Markdown command and packet docs |
| **Framework** | system-spec-kit MCP save pipeline, CLI wrapper, and packet validation workflow |
| **Storage** | Canonical spec docs, `_memory.continuity` frontmatter, SQLite memory index, graph-metadata JSON |
| **Testing** | Vitest handler suites, CLI workflow tests, transcript prototypes, `validate_document.py`, `validate.sh --strict` |

### Overview
The plan keeps the canonical write core intact while changing the default operator experience: `/memory:save` should first tell the AI what to change, why it is safe, and what deferred actions remain, instead of immediately running the full automation stack. Packet 014's evidence shows that canonical preparation, routed identity, and atomic rollback are still the durable core, while Tier 3 routing, auto-fix quality retries, reconsolidation, enrichment, synchronous graph refresh, and synchronous reindexing can move behind opt-in flags or explicit follow-up steps. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1223] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:89] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:554-629] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1364-1400]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 014 research verdict, findings registry, and seed spec have been read and translated into explicit implementation requirements.
- [x] The load-bearing core is named and protected: canonical atomic writer, routed record identity, content-router category contract, and thin continuity validation.
- [x] Over-engineered trim targets are named and bounded: routing classifier stack, quality loop, reconsolidation bridge, and post-insert enrichment.
- [x] Partial-value follow-up systems are named and bounded: CLI wrapper, workflow orchestrator, quality-gate hard checks, reindex, graph refresh, PE gating, and chunking.
- [x] Packet docs, tests, and command contract updates are all included in the implementation scope.

### Definition of Done
- [ ] Planner-first mode is the default `/memory:save` behavior and remains non-mutating.
- [ ] Explicit fallback mode still preserves canonical atomic write safety and rollback guarantees.
- [ ] Tier 3 routing, auto-fix quality retries, reconsolidation, and post-insert enrichment are off the default path.
- [ ] Indexing and graph refresh appear as explicit follow-up actions rather than unconditional side effects.
- [ ] Targeted Vitest suites, transcript prototypes, `validate_document.py`, and `validate.sh --strict` all pass.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read the packet 014 research verdict and findings registry before implementation starts.
- Confirm `memory-save.ts`, `response-builder.ts`, `types.ts`, and `generate-context.ts` all agree on the planner contract.
- Confirm existing save safety rules stay owned by `validateCanonicalPreparedSave()` and `validateThinContinuityRecord()`.
- Confirm every trim decision has either an explicit follow-up action, an opt-in flag, or a documented standalone command path.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-CORE-001 | Do not redesign the canonical atomic writer | It is already the proven write-safety core |
| AI-DEFAULT-001 | Keep planner mode non-mutating | The entire refactor depends on planner-first default behavior |
| AI-FALLBACK-001 | Preserve full-auto canonical mutation as explicit fallback only | Operators still need a safe end-to-end mode |
| AI-FLAG-001 | Every retired hot-path subsystem must either move behind an opt-in flag or an explicit follow-up step | Prevents silent feature loss |
| AI-PARITY-001 | Command docs, env refs, and test names must describe the same defaults and flags | Avoids runtime or documentation drift |

### Status Reporting Format

- Start state: current milestone, target files, and which subsystem is being trimmed or preserved
- Work state: planner contract changes, trimmed default-path behavior, and any follow-up action surfaced
- End state: targeted test results, transcript prototype result, and packet validator status

### Blocked Task Protocol

1. Stop if planner mode cannot express the same canonical target or legality state as the fallback path.
2. Stop if fallback changes weaken per-spec-folder locking, rollback, or same-path identity behavior.
3. Stop if a subsystem is removed from the default path without an explicit follow-up action, fallback flag, or documented deferral.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Planner-first orchestration with canonical atomic fallback

### Key Components
- **Planner response surface**: `memory-save.ts`, `handlers/save/types.ts`, `response-builder.ts`, and `validation-responses.ts` expose route, legality, continuity, and follow-up actions without mutating files.
- **Canonical atomic fallback**: `buildCanonicalAtomicPreparedSave()`, `resolveCreateRecordIdentity()`, and `atomicIndexMemory()` remain the durable mutation path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1223-1265] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:89-118] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270-360]
- **Routing trim boundary**: `content-router.ts` keeps category-to-target mapping while Tier 3 and oversized prototype machinery stop participating by default. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:22-31] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:554-629]
- **Advisory-quality trim boundary**: `quality-loop.ts` and `save-quality-gate.ts` keep hard structural safety but stop mutating content automatically on the default path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:423-470] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:398-430]
- **Deferred follow-up surfaces**: `workflow.ts`, `api/indexing.ts`, `graph-metadata-parser.ts`, `reconsolidation-bridge.ts`, `post-insert.ts`, `pe-gating.ts`, and `chunking-orchestrator.ts` become explicit follow-up or fallback-only concerns. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1364-1400] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:979-1005] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:165-188] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:50-56]

### Data Flow
1. `generate-context.ts` or the MCP handler receives a save request and resolves planner-first mode as the default.
2. `memory-save.ts` parses content, evaluates route and legality using the same canonical prep information the fallback path uses, then returns a planner payload instead of writing files.
3. The AI applies canonical-doc edits directly using the planner output.
4. The planner payload surfaces explicit follow-up actions such as `memory_index_scan` or `refreshGraphMetadataForSpecFolder` when freshness matters.
5. If the operator explicitly requests full-auto fallback, the request flows through canonical preparation, same-path identity resolution, thin continuity validation, per-folder locking, atomic promotion, and rollback-aware indexing. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2276-2365] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2493-2512]

### File-Level Change Map

| Area | Primary Files | Purpose | Milestone |
|------|---------------|---------|-----------|
| Planner contract | `handlers/memory-save.ts`, `handlers/save/types.ts`, `handlers/save/response-builder.ts`, `handlers/save/validation-responses.ts` | Define and serialize the new planner-default response | M1 |
| CLI and command parity | `scripts/memory/generate-context.ts`, `.opencode/command/memory/save.md`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Make the new default visible to operators and tests | M1 |
| Router trim | `lib/routing/content-router.ts`, `lib/routing/routing-prototypes.json`, `tests/content-router.vitest.ts` | Keep categories, trim classifier stack | M2 |
| Quality trim | `handlers/quality-loop.ts`, `lib/validation/save-quality-gate.ts`, related tests | Preserve blockers, retire auto-fix default behavior | M3 |
| Deferred side effects | `handlers/save/reconsolidation-bridge.ts`, `handlers/save/post-insert.ts`, `handlers/pe-gating.ts`, `handlers/chunking-orchestrator.ts`, `scripts/core/workflow.ts`, `api/indexing.ts`, `lib/graph/graph-metadata-parser.ts` | Move advisory or freshness work out of the default save path | M4 |
| Regression and verification | `mcp_server/tests/*.vitest.ts`, `scripts/tests/*.vitest.ts`, packet docs | Prove planner parity, fallback safety, and transcript behavior | M5 |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### M1: Planner Contract and Flag Plumbing
- Add shared planner-response types and fallback markers.
- Make planner mode the default in `memory-save.ts` and `generate-context.ts`.
- Document default and fallback behavior in `/memory:save` docs and env references.

### M2: Routing Classifier Stack Trim
- Keep the eight-category contract and Tier 1 or Tier 2 deterministic behavior.
- Remove default-path Tier 3 participation.
- Reduce prototype-library reliance to the remaining Tier 2 behavior still needed.

### M3: Quality Loop Retirement with Hard-Check Preservation
- Keep structural validation and spec-doc legality rules as blockers.
- Remove or gate score-driven auto-fix retries from the default path.
- Surface advisory quality issues through planner output or fallback-only behavior.

### M4: Reconsolidation, Enrichment, and Partial-Value Hot-Path Extraction
- Gate reconsolidation and post-insert enrichment behind explicit fallback flags or standalone commands.
- Preserve PE gating only where same-path lineage still needs it.
- Keep chunking as a size-driven fallback.
- Stop unconditional graph refresh and spec-doc reindex from riding every default save.

### M5: Regression Suite, Transcript Prototype, and Structural Parity
- Add or update planner-first, fallback, routing, quality, continuity, and workflow tests.
- Prototype the planner contract against three real session transcripts before implementation begins.
- Run packet-local doc validation and strict packet validation before closeout.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Planner response schema, fallback mode markers, follow-up action payloads | `memory-save-planner-first.vitest.ts`, `memory-save.vitest.ts`, `generate-context-cli-authority.vitest.ts` |
| Dry-run | Non-mutating default execution, legality blockers, continuity payload generation | `memory-save-integration.vitest.ts`, `handler-memory-save.vitest.ts` |
| Regression | Router defaults, quality trim, reconsolidation trim, enrichment trim, continuity preservation | `content-router.vitest.ts`, `quality-loop.vitest.ts`, `save-quality-gate.vitest.ts`, `reconsolidation-bridge.vitest.ts`, `thin-continuity-record.vitest.ts` |
| Manual review | Three real session transcript prototypes mapped to canonical docs and anchors | Packet-local prototype notes plus saved transcript fixtures |
| Structural parity | Command docs, env refs, packet docs, and validator rules stay aligned | `python3 .opencode/skill/sk-doc/scripts/validate_document.py`, `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `buildCanonicalAtomicPreparedSave()` and `atomicIndexMemory()` | Internal | Green | Without these, there is no safe fallback path |
| `resolveCreateRecordIdentity()` and same-path lineage lookup | Internal | Green | Planner and fallback would diverge on target identity |
| `validateThinContinuityRecord()` and `upsertThinContinuityInMarkdown()` | Internal | Green | Continuity payload would become unsafe or inconsistent |
| `content-router.ts` category mapping | Internal | Green | Planner output would lose canonical target authority |
| `/memory:save` command contract | Internal docs | Yellow | Operators could keep expecting default full-auto behavior |
| Transcript corpus for three real save examples | Verification input | Yellow | Planner-first parity cannot be proven before implementation start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Planner output cannot match fallback target selection, fallback safety weakens, or routing and quality trims introduce correctness regressions.
- **Procedure**: Revert the planner-default switch first, then revert subsystem trims one milestone at a time until the current full-auto default path is restored.

### Per-Phase Rollback Triggers and Procedure

| Milestone | Rollback Trigger | Procedure | Data Reversal |
|-----------|------------------|-----------|---------------|
| M1 | Planner schema is incomplete or `generate-context.ts` cannot consume it | Revert planner-default toggle and shared types; keep existing handler behavior | None |
| M2 | Routing parity drops or manual-review rate spikes during transcript prototypes | Re-enable previous router behavior and restore prototype library references | None |
| M3 | Structural blockers weaken or planner output hides critical failures | Revert quality-loop and save-quality-gate trim changes while retaining doc updates | None |
| M4 | Deferred side effects cause correctness regressions or fallback flag logic becomes ambiguous | Revert per-subsystem trim individually, starting with workflow follow-ups, then reconsolidation or enrichment gating | None |
| M5 | Test or transcript parity cannot be restored cleanly | Keep planner docs in Draft, revert runtime changes, and reopen packet with the transcript mismatch recorded | None |
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
M1 Planner contract + flags
  -> M2 Router trim
  -> M3 Quality trim
  -> M4 Deferred side effects
  -> M5 Regression + transcript prototype + strict validation

M4 also depends on M1 because follow-up actions are surfaced through the planner schema.
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| M1 | Packet 014 verdict, existing save safety core | M2, M3, M4, M5 |
| M2 | M1 | M5 |
| M3 | M1 | M5 |
| M4 | M1 | M5 |
| M5 | M1, M2, M3, M4 | Closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| M1 Planner contract + flags | High | 1.0-1.5 days |
| M2 Router trim | Medium | 0.5-1.0 day |
| M3 Quality trim | Medium | 0.5-1.0 day |
| M4 Deferred side effects | High | 1.0-1.5 days |
| M5 Regression + transcript prototype | High | 1.0-1.5 days |
| **Total** | | **4.0-6.5 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Planner schema is captured in shared types and exercised by tests.
- [ ] Full-auto fallback still passes rollback and same-path identity tests.
- [ ] Router, quality, reconsolidation, and enrichment trims each have explicit flag or follow-up documentation.
- [ ] Command docs and env references describe the same defaults and flags as the runtime.
- [ ] Transcript prototypes for three real sessions are recorded.

### Rollback Procedure
1. Disable planner-default behavior and restore the existing full-auto default path.
2. Re-run `memory-save`, router, quality, continuity, and CLI authority tests.
3. Restore docs to match the reverted runtime behavior.
4. Re-open the packet with the failing milestone and transcript evidence recorded in the implementation summary.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Restore the previous handler and workflow behavior; no persisted data migration is required because the refactor changes execution flow and defaults, not stored schema.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌──────────────┐
│  Packet 014  │
│ trim verdict │
└──────┬───────┘
       v
┌──────────────┐
│ M1 Planner   │
│ contract     │
└─┬─────┬──────┘
  │     │
  v     v
┌──────────────┐   ┌──────────────┐
│ M2 Router    │   │ M3 Quality   │
│ trim         │   │ trim         │
└──────┬───────┘   └──────┬───────┘
       │                  │
       └──────┬───────────┘
              v
        ┌──────────────┐
        │ M4 Deferred  │
        │ side effects │
        └──────┬───────┘
               v
        ┌──────────────┐
        │ M5 Tests +   │
        │ transcript   │
        │ verification │
        └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Planner schema | 014 verdict, existing handler contract | Shared structured output | All later milestones |
| Router trim | Planner schema | Deterministic default routing | Final verification |
| Quality trim | Planner schema | Hard blockers plus advisory quality output | Final verification |
| Deferred side effects | Planner schema, router trim, quality trim | Explicit follow-up actions and fallback-only side effects | Final verification |
| Verification layer | All prior milestones | Transcript proof and regression evidence | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **M1 Planner contract** - 1.0-1.5 days - CRITICAL
2. **M2 Router trim** - 0.5-1.0 day - CRITICAL
3. **M3 Quality trim** - 0.5-1.0 day - CRITICAL
4. **M4 Deferred side effects** - 1.0-1.5 days - CRITICAL
5. **M5 Regression and transcript verification** - 1.0-1.5 days - CRITICAL

**Total Critical Path**: 4.0-6.5 days

**Parallel Opportunities**:
- Command doc and env ref updates can run in parallel with planner type work once M1 field names are fixed.
- Some regression tests can be updated in parallel after M2 through M4 behavior is locked.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Planner contract and fallback flag plumbing complete | Planner schema exists, CLI and handler agree, docs reference planner-first default | Day 1-2 |
| M2 | Routing stack trim complete | Tier 3 no longer runs by default and category parity remains intact | Day 2-3 |
| M3 | Quality loop trim complete | Hard blockers preserved, score-heavy retries removed from default path | Day 3-4 |
| M4 | Deferred side effects complete | Reconsolidation, enrichment, reindex, and graph refresh are explicit follow-up or fallback-only behavior | Day 4-5 |
| M5 | Verification and transcript proof complete | Tests pass, transcripts map cleanly, packet docs validate strictly | Day 5-7 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Planner-first default, canonical atomic fallback

**Status**: Proposed

**Context**: Packet 014 concluded that planner output can reuse the dry-run surface while the canonical atomic path remains the durable write core. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2191-2346] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:270]

**Decision**: Make planner output the default execution mode and keep the canonical atomic writer as an explicit fallback for end-to-end mutation.
