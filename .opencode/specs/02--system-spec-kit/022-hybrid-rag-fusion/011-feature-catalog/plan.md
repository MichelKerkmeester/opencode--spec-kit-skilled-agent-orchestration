---
title: "Implementation Plan: Feature Catalog Audit & Remediation"
description: "Historical 30-agent audit snapshot (2026-03-08) plus 2026-03-16 current-state addendum for omitted-snippet classification and remediation updates."
trigger_phrases:
  - "feature catalog"
  - "audit"
  - "remediation"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Feature Catalog Audit & Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server source), Markdown (catalog) |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | Historical snapshot: 180 snippets (2026-03-08); current tree: 189 snippets (2026-03-16) |
| **Testing** | Agent-based verification, file-path validation |

### Overview
Historical plan: verify ~180 feature snippets and investigate 55 known gaps, then synthesize a remediation manifest. Current-state addendum: classify 14 omitted current snippets and fold follow-up actions into the remediation plan.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (MCP source tree, feature catalog)

### Definition of Done
- [ ] All 30 agent reports exist in `scratch/`
- [ ] Remediation manifest produced with prioritized actions
- [ ] Analysis summary with aggregate statistics
- [ ] `tasks.md` updated with concrete remediation items

---

## 3. ARCHITECTURE

### Pattern
Multi-agent parallel research with file-based collection (CWB Pattern C)

### Key Components
- **Stream 1 (Verification)**: 20 Codex agents reading snippet files + source files, producing accuracy reports
- **Stream 2 (Investigation)**: 10 Codex agents deep-diving source files to verify gaps
- **Synthesis**: Cross-stream validation and manifest generation

### Data Flow
```
Feature Snippets ──► Stream 1 Agents ──► verification-C[NN].md ──┐
                                                                   ├──► Synthesis ──► remediation-manifest.md
MCP Source Files ──► Stream 2 Agents ──► investigation-X[NN].md ──┘
```

---

## 4. IMPLEMENTATION PHASES

### Phase A: Spec Folder Upgrade (L1 → L3)
- [x] Run upgrade-level.sh to L3
- [x] Update description.json level to 3
- [x] Rewrite spec.md with full audit scope
- [x] Create plan.md with technical approach
- [x] Rewrite tasks.md with new breakdown
- [x] Create decision-record.md with 3 ADRs
- [x] Create checklist.md with audit checks

### Phase B: Research Delegation (30 Agents) — COMPLETE
- [x] Launch Stream 1: 20 Codex agents (GPT-5.4) for feature verification
- [x] Launch Stream 2: 10 Codex agents (GPT-5.3-Codex) for gap investigation
- [x] Collect all 30 scratch files (44-139KB each)

### Phase C: Analysis & Synthesis — COMPLETE
- [x] Parse all 30 scratch files — 180 features + 55 gaps + 29 new gaps
- [x] Create remediation-manifest.md — 202 total items (P0: 3, P1: 173, P2: 29)
- [x] Cross-validate streams — 7 false positives identified
- [x] Create analysis-summary.md — category-level statistics

**Key results:** 3.9% features pass, 96.1% need remediation. 49.4% description accuracy (below 95% target). 48/55 gaps confirmed, 29 new discovered.

### Phase D: Documentation Update — COMPLETE
- [x] Update tasks.md with Phase E remediation items (T100-T171)
- [x] Update checklist.md with verification results (9/9 P0 verified)
- [x] Update plan.md with Phase C findings (this update)

### Phase E: Current-State Addendum (2026-03-16) — COMPLETE
- [x] Reconcile historical snapshot claims vs live-tree reality (180 -> 189 snippets)
- [x] Audit and classify 14 omitted current snippets
- [x] Add two follow-up remediation items for source-path normalization/correction
- [x] Clarify tooling and taxonomy drift without rewriting March 8 historical metrics

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path validation | All file paths in snippets | `test -f` on each path |
| Report completeness | All 30 agent outputs | File existence + non-empty check |
| Cross-validation | Stream overlap | Manual comparison of findings |
| Spot check | 10 random features | Read snippet + source, confirm match |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server source (`mcp_server/`) | Internal | Green | Cannot verify features |
| Feature catalog snippets | Internal | Green | Cannot audit |
| Codex CLI (`codex` binary) | External | Green | Cannot run Stream 1/2 historical audit flows |

---

## 7. ROLLBACK PLAN

- **Trigger**: Agent outputs contain fundamentally flawed data
- **Procedure**: Delete scratch files, re-run agents with corrected prompts. No source code is modified.

---

## L2: PHASE DEPENDENCIES

```
Phase A (Spec Upgrade) ──► Phase B (30 Agents) ──► Phase C (Synthesis) ──► Phase D (Docs Update)
                           Stream 1 ──┐
                                      ├──► Phase C
                           Stream 2 ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A: Spec Upgrade | None | B |
| B: Stream 1 (Verification) | A | C |
| B: Stream 2 (Investigation) | A | C |
| C: Synthesis | B (both streams) | D |
| D: Documentation | C | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| A: Spec Upgrade | Low | Done |
| B: Research (30 agents) | High | ~15 min (parallel) |
| C: Synthesis | Medium | ~30 min |
| D: Documentation | Low | ~15 min |
| **Total** | | **~1 hour** |

---

## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────────────────┐     ┌──────────────┐     ┌──────────────┐
│   Phase A    │────►│        Phase B               │────►│   Phase C    │────►│   Phase D    │
│ Spec Upgrade │     │  ┌────────────────────────┐  │     │  Synthesis   │     │  Doc Update  │
│   (done)     │     │  │ Stream 1: C01-C20      │  │     │              │     │              │
└──────────────┘     │  │ (20 Codex agents)      │  │     └──────────────┘     └──────────────┘
                     │  └────────────────────────┘  │
                     │  ┌────────────────────────┐  │
                     │  │ Stream 2: X01-X10      │  │
                     │  │ (10 Codex agents)      │  │
                     │  └────────────────────────┘  │
                     └──────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase A | None | Spec folder at L3 | Phase B |
| Stream 1 | Phase A | 20 verification reports | Phase C |
| Stream 2 | Phase A | 10 investigation reports | Phase C |
| Phase C | Both streams | Manifest + summary | Phase D |
| Phase D | Phase C | Updated docs | None |

---

## L3: CRITICAL PATH

1. **Phase A: Spec Upgrade** - Complete - DONE
2. **Phase B: 30-Agent Research** - Parallel execution - CRITICAL
3. **Phase C: Synthesis** - Sequential analysis - CRITICAL
4. **Phase D: Documentation** - Final updates - CRITICAL

**Parallel Opportunities**:
- Stream 1 (C01-C20) and Stream 2 (X01-X10) run simultaneously
- All 20 Codex agents run in parallel
- All 10 Codex agents run in parallel

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Spec Upgrade Complete | All L3 files created | Phase A (done) |
| M2 | Research Complete | 30 scratch files exist and non-empty | Phase B |
| M3 | Synthesis Complete | Manifest + summary produced | Phase C |
| M4 | Documentation Updated | tasks.md and checklist.md reflect findings | Phase D |

---

## L3: AGENT PARTITIONING

### Stream 1: Verification Agents (C01-C20)

| Agent | Categories | ~Files |
|-------|-----------|--------|
| C01 | 01-retrieval | 9 |
| C02 | 02-mutation | 8 |
| C03 | 03-discovery + 04-maintenance + 05-lifecycle | 8 |
| C04 | 06-analysis + 07-evaluation | 9 |
| C05 | 08-bug-fixes (1-6) | 6 |
| C06 | 08-bug-fixes (7-12) | 6 |
| C07 | 09-eval-measurement (1-8) | 8 |
| C08 | 09-eval-measurement (9-15) | 7 |
| C09 | 10-graph-signal (1-5) | 5 |
| C10 | 10-graph-signal (6-9) + 11-scoring (1-4) | 8 |
| C11 | 11-scoring (5-10) | 6 |
| C12 | 11-scoring (11-19) | 9 |
| C13 | 12-query-intelligence | 8 |
| C14 | 13-memory-quality (1-9) | 9 |
| C15 | 13-memory-quality (10-18) | 9 |
| C16 | 14-pipeline (1-12) | 12 |
| C17 | 14-pipeline (13-23) | 11 |
| C18 | 15-retrieval-enhancements | 11 |
| C19 | 16-tooling + 17-governance | 11 |
| C20 | 18-ux-hooks + 19-decisions + 20-flags | 31 |

> **Historical scope note**: The C-table above is the March 8 planning snapshot. Executed ranges in `tasks.md` narrowed C08/C12/C15/C17/C19/C20, and the 2026-03-16 addendum now accounts for 14 omitted current snippets in the live tree.

---

## 2026-03-16 Addendum: Reality Alignment

### Snapshot vs Current Tree

| Dimension | Historical Snapshot (2026-03-08) | Current Tree (2026-03-16) |
|-----------|----------------------------------|-----------------------------|
| Snippet count | 180 | 189 |
| Audit coverage claim | 180 verified | 14 current snippets were outside executed ranges |
| Remediation base | 202 items | 202 base + 2 addendum follow-ups |

### Taxonomy Drift Clarification

- Historical docs used the working labels `19-decisions` and `20-feature-flags`.
- Current monolith headings now include `20. UX HOOKS`, `21. PHASE SYSTEM`, and `22. FEATURE FLAG REFERENCE`.
- Addendum reporting preserves March 8 labels for historical traceability and adds mapping notes to current taxonomy.

### Stream 2: Gap Investigation Agents (X01-X10)

| Agent | Focus | Gaps |
|-------|-------|------|
| X01 | Server & Operations | #1-4 |
| X02 | Save Path & Mutation | #5-9 |
| X03 | Discovery & Indexing | #10-13 |
| X04 | Search & Retrieval | #14-17 |
| X05 | Cognitive Subsystems | #18-23 |
| X06 | Scoring & Evaluation | #24-31 |
| X07 | Infrastructure | #32-37 |
| X08 | Storage & Parsing | #38-42 |
| X09 | Search internals (low-sig) | #43-48 |
| X10 | Handlers + infra (low-sig) | #49-55 |

---

## Merged Section: 016-feature-catalog-code-references Plan

> **Merge note (2026-03-14)**: Originally `016-feature-catalog-code-references/plan.md`.

# Plan: 016-Feature Catalog Code References
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:approach -->
## 1. APPROACH

Comment-only pass across all MCP server source files in two phases:

**Phase A: Cleanup** (remove stale references)
Scan all `.ts` source files for inline comments referencing specific sprint numbers, phase numbers or spec folder identifiers. Remove or neutralize these references while preserving any useful context they contain.

**Phase B: Annotate** (add feature catalog references)
Map each source file to its feature catalog entry and add concise `// Feature catalog: <feature-name>` comments at module level and key function boundaries.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:technical-context -->
## 2. TECHNICAL CONTEXT

- Scope: comment-only updates in `.opencode/skill/system-spec-kit/mcp_server/` and `.opencode/skill/system-spec-kit/shared/`
- Source of truth for names: feature catalog H1 headings in `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md`
- Verification inputs: non-test stale-reference grep, handler coverage (40/40), script coverage (3/3), exact-name validation (0 invalid names), and `npm run typecheck`
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Inline traceability model: add `// Feature catalog: <feature-name>` at handler/module boundaries
- Change boundary: comments only; no runtime behavior, API contracts, or logic paths changed
- Validation model: static compile check, grep-based audits, and comment-only diff classification
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:implementation -->
## 4. IMPLEMENTATION

- Cleanup pass: remove or reword stale numbered-history comments in non-test TypeScript source
- Annotation pass: add feature-catalog comments to all handlers and strong-match modules, including all in-scope scripts
- Verification pass: run typecheck plus coverage and exact-name validation checks; record evidence in spec docs
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:execution -->
## 5. EXECUTION STEPS

### Phase A: Cleanup stale references

| Step | Action | Details |
|------|--------|---------|
| A1 | Scan for sprint references | Grep all `.ts` files for `Sprint \d+`, `sprint \d+` patterns in comments |
| A2 | Scan for phase references | Grep for `Phase \d+`, `phase \d+` patterns in comments |
| A3 | Scan for spec folder references | Grep for `spec \d+`, `Spec \d+`, `spec-folder`, `specs/\d+` patterns in comments |
| A4 | Review each match | Determine if the comment contains useful context beyond the stale reference |
| A5 | Remove or rewrite | Remove pure-reference comments. Rewrite mixed comments to keep the useful part and drop the stale identifier |
| A6 | Verify zero matches | Re-run scans from A1-A3 to confirm zero remaining stale references |

### Phase B: Add feature catalog references

| Step | Action | Details |
|------|--------|---------|
| B1 | Build file-to-feature map | Cross-reference the feature catalog SOURCE FILES tables with the actual codebase to create a mapping of every `.ts` file to its feature catalog entry or entries |
| B2 | Annotate handler files | Add `// Feature catalog: <name>` at the top of each handler file, below imports |
| B3 | Annotate core lib modules | Add references at module level and at key exported functions |
| B4 | Annotate shared modules | Add references to shared algorithm and type modules |
| B5 | Annotate script modules | Add references where scripts implement specific feature behavior |
| B6 | Verify format consistency | Grep for all `Feature catalog:` comments and verify they use name-only format |
| B7 | Compile check | Run `tsc --noEmit` to confirm no syntax issues from comment changes |
<!-- /ANCHOR:execution -->

---

<!-- ANCHOR:dependencies -->
## 6. ORDERING AND DEPENDENCIES

```
A1-A3 (parallel scans)
  -> A4-A5 (sequential review and fix)
    -> A6 (verify cleanup)
      -> B1 (build mapping)
        -> B2-B5 (parallel annotation by directory)
          -> B6-B7 (verify)
```
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:scope-estimate -->
## 7. ESTIMATED SCOPE

| Category | File Count | Effort |
|----------|------------|--------|
| Handlers | ~20 | Small per file |
| Lib modules | ~60 | Medium (multiple features per file possible) |
| Shared modules | ~10 | Small |
| Scripts | ~15 | Small |
| **Total** | **~105** | **Comment-only, no behavioral changes** |
<!-- /ANCHOR:scope-estimate -->
