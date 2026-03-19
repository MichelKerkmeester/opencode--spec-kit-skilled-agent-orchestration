<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/spec.md -->
<!-- anchor:spec:start -->

# Spec: Research Remediation — Wave 1

<!-- anchor:overview:start -->
## 1. OVERVIEW

| Field | Value |
|-------|-------|
| **Spec Folder** | `010-perfect-session-capturing/021-research-remediation` |
| **Parent** | `010-perfect-session-capturing` |
| **Level** | 3 (500+ LOC across 21 files) |
| **Status** | In Progress |
| **Created** | 2026-03-19 |

**Purpose**: Implement all P0 + critical P1 recommendations from the 13 R-series research findings (R-01 through R-13) produced by 19 agents across 4 AI providers. Wave 1 focuses on source integrity, detection fixes, data flow corrections, signal extraction improvements, and workflow integration.
<!-- anchor:overview:end -->

<!-- anchor:problem:start -->
## 2. PROBLEM & PURPOSE

The session capturing pipeline has 82 remaining remediation items (5 P0, 13 P1, 30 P2, 34 P3) identified across 7 cross-cutting themes. The most critical: the pipeline can select the WRONG session transcript entirely (R-11), the auto-detection cascade fails for parent folders (R-13), quality gates don't actually block (P0-01), and decisions are duplicated (R-13 A0.7).

**Root cause**: Features added incrementally with local contracts never unified. Source-of-truth validation missing at pipeline entry.
<!-- anchor:problem:end -->

<!-- anchor:solution:start -->
## 3. PROPOSED SOLUTION

5 sequential Codex 5.3 agents, each with exclusive file ownership:

1. **Agent 1**: Source Integrity — session-ID-first resolution, provenance tracking, error surfacing (8 items)
2. **Agent 2**: Detection & Quality Gates — git-status signal, contamination penalty, V10 validator (9 items)
3. **Agent 3**: Data Flow & Types — decision dedup, metadata preservation, type canonicalization (10 items)
4. **Agent 4**: Signal Extraction — trigger sanitization, weighted embeddings, stopword merge (6 items)
5. **Agent 5**: Workflow Integration — key_files fallback, field wiring, template fixes, E2E tests (8 items)

Total: 41 items across Wave 1.
<!-- anchor:solution:end -->

<!-- anchor:scope:start -->
## 4. SCOPE

**In scope**: All P0 items, Phase A0 items, critical P1 items from research findings R-01 through R-13.

**Out of scope**: Wave 2 (R-series Phases A+B), Wave 3 (Phases C+D + P2/P3), quality scorer unification (R-01 full), unified SemanticSignalExtractor (R-08 full), dual-confidence model (R-05).
<!-- anchor:scope:end -->

<!-- anchor:dependencies:start -->
## 5. DEPENDENCIES

- Research findings: `010-perfect-session-capturing/research/research-pipeline-improvements.md`
- Remediation manifest: `010-perfect-session-capturing/research/remediation-manifest.md`
- Prior session: V11 documentation fixes applied to specs 018, 010, 022
<!-- anchor:dependencies:end -->

<!-- anchor:risks:start -->
## 6. RISKS & MITIGATIONS

| Risk | Mitigation |
|------|------------|
| Build breaks between agents | `npm run build` verification gate after each agent |
| File ownership conflicts | Exclusive file assignment per agent |
| Regression in existing tests | `npx vitest run` after Agent 5 |
| Type changes cascade | Agent 3 handles types before Agent 4/5 consume them |
<!-- anchor:risks:end -->

<!-- anchor:spec:end -->
