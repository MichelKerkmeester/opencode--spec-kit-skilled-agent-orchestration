---
title: "Implementation Plan: Feature Catalog Audit & Remediation"
description: "30-agent parallel research to verify all feature catalog entries and investigate 55 undocumented gaps, followed by synthesis into a prioritized remediation manifest."
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
| **Storage** | File-based (180 markdown snippets + monolithic catalog) |
| **Testing** | Agent-based verification, file-path validation |

### Overview
Verify all ~180 feature snippet files against MCP server source code using 20 Copilot agents, investigate 55 known undocumented gaps using 10 Codex agents, then synthesize findings into a prioritized remediation manifest.

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
- **Stream 1 (Verification)**: 20 Copilot agents reading snippet files + source files, producing accuracy reports
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
| Copilot CLI (`copilot` binary) | External | Green | Cannot run Stream 1 |
| Codex CLI (`codex` binary) | External | Green | Cannot run Stream 2 |

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
└──────────────┘     │  │ (20 Copilot agents)    │  │     └──────────────┘     └──────────────┘
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
- All 20 Copilot agents run in parallel
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
