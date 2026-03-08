---
title: "Architecture Audit"
status: "complete"
level: 3
created: "2025-12-01"
updated: "2026-03-08"
description: "Audit and remediate ownership boundaries between root scripts (build-time and CLI tooling) and mcp_server (runtime MCP server), including merged follow-up boundary remediation work from former spec 030."
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
# Feature Specification: System-Spec-Kit Scripts vs mcp_server Architecture Audit + Boundary Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

This phase performs a full architecture audit of `.opencode/skill/system-spec-kit/` with specific focus on the boundary between root `scripts/` and `mcp_server/`. The audit confirms overlapping concerns in memory/index/eval/tooling, partial boundary enforcement, and concrete dependency-direction risks that should be addressed with documentation and guardrails first, then selective refactoring.

As of 2026-03-05, the follow-up boundary remediation work previously tracked in `009-architecture-audit` is merged into this spec as continuation scope.

**Key Decisions**: Define a strict runtime-vs-CLI boundary contract; use API-first imports for cross-boundary consumers.

**Critical Dependencies**: Boundary documentation, import-policy enforcement, and cycle reduction in handler orchestration.

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-04 |
| **Branch** | `022-hybrid-rag-fusion/009-architecture-audit` |
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
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/spec.md` | Update | Level 3 audit specification |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/plan.md` | Update | Reorganization implementation plan |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/tasks.md` | Update | Atomic task map |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/checklist.md` | Create | P0/P1/P2 architecture verification checklist |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/decision-record.md` | Create | ADRs for boundary, compatibility, and consolidation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/scratch/agent1-root-tree-readme-config.md` | Existing evidence | Complete root tree/readme/config inventory |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/scratch/agent2-mcp-tree-readme-config.md` | Existing evidence | Complete mcp_server tree/readme/config inventory |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/scratch/agent3-root-source-inventory.md` | Existing evidence | Per-file root source mapping |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/scratch/agent4-mcp-source-inventory.md` | Existing evidence | Per-file mcp source mapping |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-architecture-audit/scratch/agent5-architecture-analysis.md` | Existing evidence | Cross-boundary architecture findings |
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
| REQ-009 | Content-aware memory filename generation | Memory filenames reflect task content, not just spec folder name |
| REQ-010 | Generation-time quality gates (empty + duplicate prevention) | Empty templates and duplicate content rejected before file write |
<!-- /ANCHOR:requirements -->

## 4.5 REQUIREMENT-TASK TRACEABILITY (BACKFILL)

| Requirement | Plan Phase | Task IDs |
|-------------|------------|----------|
| REQ-001 | Phase 2b, Phase 6 | T018, T070 |
| REQ-003 | Phase 6 | T070 |
| REQ-004 | Phase 6 | T070 |
| REQ-005 | Phase 4, Phase 6 | T038, T070 |
| REQ-007 | Phase 0, Phase 3, Phase 5 | T000, T017, T047, T049 |
| REQ-011 | Phase 7 | T076, T078 |
| REQ-012 | Phase 7 | T074, T075, T077 |
| REQ-013 | Phase 7 | T078, T085, T088 |
| REQ-014 | Phase 7 | T081, T082 |
| REQ-015 | Phase 7 | T083, T084 |
| REQ-016 | Phase 7 | T086 |
| REQ-017 | Phase 7 | T079, T089 |
| REQ-018 | Phase 7 | T087, T088 |
| REQ-002 | Phase 1 | T001-T006 |
| REQ-006 | Phase 1, Phase 8 | T003-T005, T091-T095 |
| REQ-008 | Phase 2, Phase 3 | T007-T017 |
| REQ-009 | Phase 6 | T071, T073 |
| REQ-010 | Phase 6 | T072 |

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

## 12. OPEN QUESTIONS (Resolved)

- Should compatibility wrappers in `mcp_server/scripts/` be renamed now or only retitled during transition?
  - **Resolved:** Compatibility wrappers retained with documented deprecation criteria per ADR-002.
- Should API-first migration be strict immediately, or staged with an allowlist expiry window?
  - **Resolved:** Staged with allowlist expiry window, per ADR-001 and ADR-004 implementation.

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

**Documentation** has 4 MAJOR drift issues — boundary contract exception table incomplete, .opencode/skill/system-spec-kit/shared/README.md missing new modules, checklist summary stale, cross-links partially unidirectional.

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
| CV-3 | MAJOR | Exception table documentation drift — .opencode/skill/system-spec-kit/ARCHITECTURE.md missing `reindex-embeddings.ts` entry | Claude + Codex |
| CV-4 | MAJOR | Quality extraction not frontmatter-bounded — body text can influence metadata | Codex (Agent 4) + Gemini (flagged regex rigidity) |
| CV-5 | MAJOR | Relative `require` paths for `mcp_server/lib/` not detected by enforcement | Codex (Agents 3+4) |

### Action Items Summary

- **P0 Blockers (4)**: Integrate `check-api-boundary.sh` into pipeline, add missing exception to boundary doc, expand prohibited patterns to cover `core/*`, fix `escapeLikePattern` backslash escaping
- **P1 Should-Fix (11)**: Dynamic import detection, path variant coverage, .opencode/skill/system-spec-kit/shared/README.md update, allowlist governance fields, wildcard sunset, .opencode/skill/system-spec-kit/scripts/evals/README.md update, frontmatter-scope quality extraction, causal reference ordering, chunking empty-set guard, pe-gating NaN guard
- **P2 Nice-to-Have (8)**: Block comment tracking, behavioral tests, bidirectional cross-links, handler-utils growth policy, AST-based parsing upgrade, transitive dependency checks

All remediation items are tracked as Phase 4 tasks (T021-T045) in `tasks.md`.
<!-- /ANCHOR:review-findings -->

## 14. MERGED SPEC 030 CONTINUATION
<!-- ANCHOR:merged-030 -->

Former spec `009-architecture-audit` is consolidated into this spec folder to keep one canonical architecture-boundary track.

### Archived Source Location
- Archived folder: `scratch/merged-009-architecture-audit/`
- Preserved documents: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`

### Carry-Over Scope (Completed 2026-03-06)
- `scripts/core/memory-indexer.ts` imports migrated to API/shared surfaces for Phase 7 concerns.
- `scripts/memory/reindex-embeddings.ts` imports audited and migrated to API surface (`@spec-kit/mcp-server/api/indexing`).
- API surface expanded minimally via `mcp_server/api/indexing.ts` for safe bootstrap/index-scan hooks.
- Obsolete memory-indexer allowlist exceptions removed; retained wildcard exceptions remain eval-only with governance metadata.
- Mandatory CI boundary enforcement wired for pull requests in `.github/workflows/system-spec-kit-boundary-enforcement.yml`.

### Carry-Over Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Migrate `memory-indexer` vector index import to API surface | `check-no-mcp-lib-imports.ts` passes without the legacy memory-indexer exception |
| REQ-012 | Move `DB_UPDATED_FILE` ownership to shared config | `memory-indexer` imports shared config, runtime core config remains backward compatible via re-export |
| REQ-013 | Reduce resolved allowlist exceptions | Remaining entries are justified, dated, and scoped |
| REQ-014 | Reindex import audit completed | `reindex-embeddings.ts` import inventory documents what can/cannot migrate to API |
| REQ-015 | API surface expansion is explicit and minimal | New exports documented with encapsulation rationale |
| REQ-016 | CI-level enforcement is mandatory | Boundary checks run on every PR and fail the workflow on violations |
| REQ-017 | TypeScript compilation remains clean | `npx tsc --noEmit` passes |
| REQ-018 | Architecture exceptions documentation stays synchronized | .opencode/skill/system-spec-kit/ARCHITECTURE.md and allowlist reflect post-migration state |

### Carry-Over Success Criteria

- **SC-005**: Allowlist count and scope are reduced without adding new forbidden-direction imports.
- **SC-006**: `npm run check` remains passing with all boundary enforcement stages active.
- **SC-007**: CI workflow blocks merges on boundary-check failures.
- **SC-008**: No unresolved P0/P1 remediation items remain for merged boundary-continuation tasks. (Achieved 2026-03-06)
<!-- /ANCHOR:merged-030 -->

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `006-extra-features`

## Acceptance Scenarios (Validator Coverage)
1. **Given** a filesystem scan of root scripts scope, **When** the source file inventory is compared, **Then** the count matches the actual file total (REQ-001) and every file appears in the inventory artifact.
2. **Given** the boundary contract document exists, **When** a new contributor reads it, **Then** they can determine runtime-vs-CLI ownership and allowed dependency directions without reading source code (REQ-002).
3. **Given** the six evaluation criteria table is populated, **When** each rating is reviewed, **Then** every score has at least one concrete file or directory path as evidence (REQ-003).
4. **Given** the recommendations list, **When** each recommendation is checked, **Then** it includes a source/destination path and a rationale statement (REQ-004).
5. **Given** the import-policy enforcement script, **When** it scans scripts for `@spec-kit/mcp-server/lib/*` imports, **Then** it reports violations not in the allowlist and exits non-zero (REQ-008).
6. **Given** the handler cycle documented in the audit, **When** static import analysis is run after Phase 2 refactors, **Then** no circular dependency path exists through the handler modules (plan Phase 2).
