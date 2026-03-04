---
title: "Feature Specification: System-Spec-Kit Scripts vs mcp_server Architecture Audit [template:level_3/spec.md]"
description: "Audit and clarify ownership boundaries between root scripts (build-time and CLI tooling) and mcp_server (runtime MCP server), with concrete reorganization recommendations and risk assessment."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "architecture audit"
  - "mcp server boundary"
  - "scripts boundary"
  - "concern separation"
  - "phase 8 refinement"
importance_tier: "critical"
contextType: "architecture"
---
# Feature Specification: System-Spec-Kit Scripts vs mcp_server Architecture Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

This phase performs a full architecture audit of `.opencode/skill/system-spec-kit/` with specific focus on the boundary between root `scripts/` and `mcp_server/`. The audit confirms overlapping concerns in memory/index/eval/tooling, partial boundary enforcement, and concrete dependency-direction risks that should be addressed with documentation and guardrails first, then selective refactoring.

**Key Decisions**: Define a strict runtime-vs-CLI boundary contract; use API-first imports for cross-boundary consumers.

**Critical Dependencies**: Boundary documentation, import-policy enforcement, and cycle reduction in handler orchestration.

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Review |
| **Created** | 2026-03-04 |
| **Branch** | `023-hybrid-rag-fusion-refinement/020-refinement-phase-8` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current code organization mixes concerns across two major areas:
- Root skill workspace (`scripts/`, `shared/`, templates/references/config) that contains build-time and CLI workflows.
- Runtime MCP server (`mcp_server/`) that serves tool requests at runtime.

The audit baseline found:
- `scripts/` + `shared/` + root-level sources: **175** source files (152 in scripts/root + 23 in shared/).
- `mcp_server/` sources: **431** source files.
- Known overlap and coupling in memory/index/eval logic, including direct `scripts` imports from `@spec-kit/mcp-server/lib/*` and a compatibility wrapper back-edge via `mcp_server/scripts/reindex-embeddings.ts`.

### Purpose
Produce a complete inventory, evaluate architecture quality with evidence, and define actionable reorganization recommendations that improve separation, discoverability, and long-term maintainability.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Full tree inventory for:
  - `.opencode/skill/system-spec-kit/` (all depths, excluding `node_modules/`, `dist/`)
  - `.opencode/skill/system-spec-kit/mcp_server/` (all depths, excluding `node_modules/`, `dist/`)
- Per-source-file inventory for `.ts`, `.js`, `.mjs`, `.cjs`, `.sh` in both target areas.
- README and config relationship inventory.
- Architecture evaluation across 6 criteria.
- Reorganization recommendations with effort/risk/impact.

### Out of Scope
- Implementing the full refactor in this phase.
- Behavior changes to MCP runtime tools.
- Non-boundary feature additions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/spec.md` | Update | Level 3 audit specification |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/plan.md` | Update | Reorganization implementation plan |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/tasks.md` | Update | Atomic task map |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/checklist.md` | Create | P0/P1/P2 architecture verification checklist |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/decision-record.md` | Create | ADRs for boundary, compatibility, and consolidation |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent1-root-tree-readme-config.md` | Existing evidence | Complete root tree/readme/config inventory |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent2-mcp-tree-readme-config.md` | Existing evidence | Complete mcp_server tree/readme/config inventory |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent3-root-source-inventory.md` | Existing evidence | Per-file root source mapping |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent4-mcp-source-inventory.md` | Existing evidence | Per-file mcp source mapping |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent5-architecture-analysis.md` | Existing evidence | Cross-boundary architecture findings |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete source-file accounting across both scopes | Counts match filesystem scan: 175 root-scripts scope (including shared/), 431 mcp scope |
| REQ-002 | Boundary classification runtime vs build/CLI is explicit | Documentation contains explicit belongs-here / does-not-belong-here matrix |
| REQ-003 | Six evaluation criteria scored with evidence | Ratings table includes files/directories per criterion |
| REQ-004 | Recommendations include WHY before WHAT with concrete paths | Each recommendation includes source/destination or target path and rationale |
| REQ-005 | Level 3 docs exist in this spec folder | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | README coverage assessed | README inventory includes scope statement and gaps |
| REQ-007 | Config relationships documented | package/tsconfig/eslint relationships captured with evidence |
| REQ-008 | Dependency-direction concerns identified | Circular and cross-layer concerns listed with concrete file paths |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every source file in scope is represented in inventory artifacts.
- **SC-002**: A new maintainer can distinguish runtime MCP concerns from build/CLI concerns without reading most source code.
- **SC-003**: Recommendations are prioritized by impact-to-effort and actionable without additional discovery work.
- **SC-004**: Documentation is fully contained in this phase folder and no longer uses `mcp_server/specs/`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Refactor scope expansion while fixing boundaries | Delays and regressions | Phase work: docs and policy first, code refactors second |
| Risk | Compatibility wrapper removal too early | Operational breakage | Keep wrapper as transitional path with explicit deprecation policy |
| Dependency | Accurate import graph for scripts and handlers | Incomplete recommendations | Use per-file inventory + cycle evidence before code changes |
| Dependency | Team alignment on API-first policy | Drift in future imports | Add automated guardrail in CI/lint pipeline |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Policy checks introduced by recommendations should not add more than 10% to lint/check time.

### Reliability
- **NFR-R01**: Compatibility operational flows (reindex) remain runnable during migration.

### Maintainability
- **NFR-M01**: Ownership boundaries must be documented at canonical locations and linked from both code areas.

## 8. EDGE CASES

- Partial migration with temporary exceptions.
- Mixed import style (`api/*` and `lib/*`) during transition.
- Handler cycle reduction that accidentally alters ordering in save/link workflows.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | 500+ files inventoried, two major code areas |
| Risk | 20/25 | Cross-boundary contracts, cycle risk, migration complexity |
| Research | 18/20 | Full tree/source/readme/config mapping and dependency tracing |
| Multi-Agent | 12/15 | Parallel inventory streams and synthesis |
| Coordination | 13/15 | Documentation, policy, and architecture alignment |
| **Total** | **87/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Boundary policy not enforced in code checks | High | Medium | Add explicit check for forbidden `@spec-kit/mcp-server/lib/*` imports in scripts |
| R-002 | Duplicate helper consolidation changes behavior | Medium | Medium | Add parity tests and staged migration |
| R-003 | Cycle break in handlers introduces regressions | High | Medium | Extract minimal shared orchestration and verify call order paths |

## 11. USER STORIES

### US-001: Architecture Maintainer (P0)
As a maintainer, I need clear ownership boundaries between `scripts` and `mcp_server` so I can change one without accidental breakage in the other.

### US-002: New Contributor (P1)
As a new contributor, I need discoverable directory and README structure so I can find the right module quickly.

### US-003: Tooling Owner (P1)
As a tooling owner, I need enforceable import policies so boundary violations are caught automatically.

## 12. OPEN QUESTIONS

- Should compatibility wrappers in `mcp_server/scripts/` be renamed now or only retitled during transition?
- Should API-first migration be strict immediately, or staged with an allowlist expiry window?

<!-- /ANCHOR:questions -->

## 13. TRIPLE ULTRA-THINK REVIEW FINDINGS
<!-- ANCHOR:review-findings -->

On 2026-03-04, a **triple ultra-think cross-AI review** was performed by three independent agents analyzing Phase 8 from complementary perspectives:

| Agent | Model | Lens | Verdict | Confidence |
|-------|-------|------|---------|------------|
| Agent 1 | Claude Opus 4.6 | Architectural Coherence | PASS WITH CONCERNS | 88/100 |
| Agent 2 | Gemini 3.1 Pro Preview | Code Quality & Completeness | PASS | 98/100 |
| Agent 3 | Codex 5.3 | Enforcement & Evasion | NEEDS REVISION | 93/100 |
| Agent 4 | Codex 5.3 (ultra-think) | Code Quality & Completeness | PASS WITH CONCERNS | 84/100 |

### Unified Verdict: PASS WITH CONCERNS — Enforcement Layer NEEDS REVISION

**Code quality** is excellent — behavior parity confirmed at 98% confidence across all 12 migrated files, re-exports preserve backward compatibility perfectly, and the extraction is clean.

**Architecture design** is sound — API-first boundary, shared module layer, and handler cycle break are correctly implemented.

**Documentation** has 4 MAJOR drift issues — boundary contract exception table incomplete, shared/README.md missing new modules, checklist summary stale, cross-links partially unidirectional.

**Enforcement** has 4 CRITICAL evasion vectors — dynamic imports undetected, relative path variants partially covered, multi-line imports bypass line-by-line scanning, boundary narrower than architecture intent (only `lib/*` blocked, not `core/*`).

### Agent 4 Additional Findings (Codex Code Quality)

Agent 4 was dispatched after Agents 1-3 to provide a second code-quality perspective (complementing Gemini). It found additional MAJOR issues not caught by the original 3 agents:

| Severity | Finding | File:Line |
|----------|---------|-----------|
| **MAJOR** | `escapeLikePattern` doesn't escape backslash — with `ESCAPE '\'`, unescaped `\` can alter LIKE semantics | `handler-utils.ts:14` |
| **MAJOR** | `extractQualityScore` is not frontmatter-scoped — `quality_score:` in body text/code blocks can be parsed as metadata | `quality-extractors.ts:6` |
| **MAJOR** | `extractQualityFlags` block capture can overrun into unintended content when subsequent keys are indented | `quality-extractors.ts:17` |
| **MAJOR** | Causal reference resolution uses ambiguous `LIKE` without deterministic ordering — wrong memory can be linked | `causal-links-processor.ts:46-56` |
| **MAJOR** | Chunking fallback metadata updater builds SQL column list from object keys without allowlist guard | `chunking-orchestrator.ts:94-96` |
| **MAJOR** | No guard for `retainedChunks.length === 0` — can produce parent-only partial records | `chunking-orchestrator.ts:118,257` |
| **MAJOR** | `similarity / 100` has no finite guard — invalid provider output can propagate NaN | `pe-gating.ts:124` |

### Cross-Validated Findings (2+ agents agree)

| ID | Severity | Finding | Sources |
|----|----------|---------|---------|
| CV-1 | MINOR | Block comment handling gap — only `//` skipped, `/* */` can trigger false positives | Gemini + Codex (x2) |
| CV-2 | CRITICAL | Enforcement boundary narrower than architecture intent — `core/*` not blocked, `check-api-boundary.sh` not in pipeline | Codex (Agents 3+4) + Claude |
| CV-3 | MAJOR | Exception table documentation drift — ARCHITECTURE_BOUNDARIES.md missing `reindex-embeddings.ts` entry | Claude + Codex |
| CV-4 | MAJOR | Quality extraction not frontmatter-bounded — body text can influence metadata | Codex (Agent 4) + Gemini (flagged regex rigidity) |
| CV-5 | MAJOR | Relative `require` paths for `mcp_server/lib/` not detected by enforcement | Codex (Agents 3+4) |

### Action Items Summary

- **P0 Blockers (4)**: Integrate `check-api-boundary.sh` into pipeline, add missing exception to boundary doc, expand prohibited patterns to cover `core/*`, fix `escapeLikePattern` backslash escaping
- **P1 Should-Fix (11)**: Dynamic import detection, path variant coverage, shared/README.md update, allowlist governance fields, wildcard sunset, evals/README.md update, frontmatter-scope quality extraction, causal reference ordering, chunking empty-set guard, pe-gating NaN guard
- **P2 Nice-to-Have (8)**: Block comment tracking, behavioral tests, bidirectional cross-links, handler-utils growth policy, AST-based parsing upgrade, transitive dependency checks

All remediation items are tracked as Phase 4 tasks (T021-T045) in `tasks.md`.
<!-- /ANCHOR:review-findings -->

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `019-sprint-9-extra-features`

## Acceptance Scenarios (Validator Coverage)
1. **Given** a filesystem scan of root scripts scope, **When** the source file inventory is compared, **Then** the count matches the actual file total (REQ-001) and every file appears in the inventory artifact.
2. **Given** the boundary contract document exists, **When** a new contributor reads it, **Then** they can determine runtime-vs-CLI ownership and allowed dependency directions without reading source code (REQ-002).
3. **Given** the six evaluation criteria table is populated, **When** each rating is reviewed, **Then** every score has at least one concrete file or directory path as evidence (REQ-003).
4. **Given** the recommendations list, **When** each recommendation is checked, **Then** it includes a source/destination path and a rationale statement (REQ-004).
5. **Given** the import-policy enforcement script, **When** it scans scripts for `@spec-kit/mcp-server/lib/*` imports, **Then** it reports violations not in the allowlist and exits non-zero (REQ-008).
6. **Given** the handler cycle documented in the audit, **When** static import analysis is run after Phase 2 refactors, **Then** no circular dependency path exists through the handler modules (plan Phase 2).
