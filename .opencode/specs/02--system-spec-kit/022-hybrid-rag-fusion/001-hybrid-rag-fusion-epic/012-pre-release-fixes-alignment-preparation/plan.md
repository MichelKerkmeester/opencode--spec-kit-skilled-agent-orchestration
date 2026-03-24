# Plan: Pre-Release Fixes & Alignment

---

## Phase 1: Deep Research (complete)

- [x] Launch 10 GPT-5.4 agents (read-only, high reasoning) in parallel
- [x] Collect outputs and extract findings
- [x] Compile into research.md with P0/P1/P2 categorization
- [x] Cross-reference findings across agents, identify cascade dependencies

---

## Phase 2: P0 Blocker Remediation (immediate)

**Dependency chain**: Fix 1 → Fix 2 → Fix 3 → Fix 4

### Fix 1: Module Resolution (`package.json` exports)
- **Fixes**: P0-3 (failing tests), P0-4 (broken imports)
- **File**: `mcp_server/package.json`
- **Change**: Update `exports` to correctly resolve `api/index.ts` → `dist/api/index.js`
- **Verify**: `node -e "require('@spec-kit/mcp-server/api')"` succeeds; 5 workflow-e2e tests pass

### Fix 2: Network Error Handling (startup abort)
- **Fixes**: P0-1 (startup crash), P1-2 (error conflation)
- **Files**: `shared/embeddings/factory.ts`, `mcp_server/context-server.ts`
- **Change**: Add `networkError` state to validation result; retry or warn-and-continue on transient failure instead of `process.exit(1)`
- **Verify**: Server starts with network disabled; logs warning instead of crashing

### Fix 3: Lint Failures (npm run check)
- **Fixes**: P2-2 (lint gate red)
- **Files**: `lib/eval/k-value-analysis.ts:692` (prefer-const), `lib/cognitive/archival-manager.ts:455` (dead function), `lib/providers/retry-manager.ts:46` (empty interface), `lib/storage/causal-edges.ts:7` (unused import), `lib/storage/checkpoints.ts:405` (unused helper)
- **Change**: Fix prefer-const, remove dead code/unused imports
- **Verify**: `npm run check` passes

### Fix 4: Spec Validation (validate.sh exit 2)
- **Fixes**: P0-2 (validation red), P1-8 (missing decision-record.md), P1-9 (broken refs)
- **Changes**:
  - Add `decision-record.md` to `007-code-audit-per-feature-catalog/`
  - Fix broken markdown references in `011-research-based-refinement/spec.md:69`, `010-template-compliance-enforcement/research.md`, `011-skill-alignment/checklist.md`, `016-rewrite-memory-mcp-readme/implementation-summary.md`
  - Fix template header violations in affected spec files
- **Verify**: `validate.sh` exits 0 or 1 (not 2); error count < 10

---

## Phase 3: P1 Must-Fix Remediation (short-term)

### Batch A: Code Fixes
| # | Fix | File | Change |
|---|-----|------|--------|
| P1-1 | Quality loop best-state | `handlers/quality-loop.ts:597` | Return `bestContent` instead of `currentContent` on rejection |
| P1-3 | preflight/postflight dropped | `scripts/utils/input-normalizer.ts:705` | Add `preflight`, `postflight` to `KNOWN_RAW_INPUT_FIELDS` |
| P1-4 | --session-id dead flag | `scripts/memory/generate-context.ts:381` | Forward `sessionId` into `runWorkflow` options |
| P1-5 | Dead registry entry | `scripts/scripts-registry.json:425` | Remove `opencode-capture` entry |
| P1-7 | Path-fragment triggers + JSON mode quality | `workflow.ts:1056-1128`, `topic-extractor.ts:29-36`, `frontmatter-editor.ts:96-136`, `input-normalizer.ts:571-689` | Combined fix: (1) Remove post-filter folder reinsertion, (2) Create shared semantic sanitizer, (3) Promote PATH_FRAGMENT_PATTERNS to pre-write prevention, (4) Enrich JSON normalization (promote exchanges/toolCalls to messages), (5) Fix ensureMin fallback contamination. See 013/research.md for full ADR. |
| P1-16 | Stage 1 vector fallback | `lib/search/hybrid-search.ts:1344` | Restore vector fallback when `skipFusion` hybrid fails |

### Batch B: Pipeline Integrity
| # | Fix | Files | Change |
|---|-----|-------|--------|
| P1-11 | Script bypass | `scripts/core/memory-indexer.ts`, `workflow.ts` | Route through MCP `memory_save` or add equivalent governance/preflight to direct path |
| P1-12 | Retention sweep | `lib/governance/retention.ts` | Wire into startup or remove dead implementation |

### Batch C: Documentation Fixes
| # | Fix | Files | Change |
|---|-----|-------|--------|
| P1-10 | tools/README.md | `mcp_server/tools/README.md:38` | Update "28 tools" → "33 tools" |
| P1-13 | Root 022 counts | `022-hybrid-rag-fusion/spec.md:20` | Fix contradictory 19/20 phases, 118/119 dirs, remove phantom 020 |
| P1-14 | Server README | `mcp_server/README.md:186` | Add `api/`, `core/`, `formatters/`, `schemas/` to structure map |
| P1-15 | DB path examples | `mcp_server/README.md:912` | Update to actual `mcp_server/database/` path |

### Batch D: Session Capturing (deferred — documented gaps)
| # | Status | Sub-phase |
|---|--------|-----------|
| P1-6a | In-progress | `009/000/005-live-proof-and-parity-hardening` — needs retained live artifacts |
| P1-6b | Missing files | `009/016-json-mode-hybrid-enrichment` — needs plan.md, tasks.md, impl-summary |
| P1-6c | Planned | `009/019-architecture-remediation` — T020-T027 remediation sprints |

---

## Phase 4: P2 Triage (deferred)

P2 items organized by effort and impact for post-release cleanup:

| Category | Items | Approach |
|----------|-------|----------|
| Dead code | P2-1, P2-3, P2-12, P2-13 | Bulk cleanup PR |
| Orphaned dist | P2-4 | `tsc --build --clean && tsc --build` |
| Stale catalog refs | P2-5, P2-17 | Update/remove broken file references |
| Playbook coverage | P2-11 | 54 scenarios needed, prioritize ux-hooks (14) and graph-signal (7) |
| Architecture docs | P2-15, P2-14 | Update MODULE_MAP.md, sprint status metadata |
| Standards compliance | P2-8, P2-9 | Migrate Python CLI to argparse, fix shell strict mode |
| Catalog alignment | P2-6, P2-7 | Add missing catalog entries for 3 audit categories |

---

## Phase 5: Verification & Context Preservation

- Re-run full test suite: `npm run test` (all workspaces)
- Re-run `validate.sh --recursive` on 022 spec tree
- Re-run `npm run check` (lint + typecheck)
- Verify MCP server starts cleanly: `node dist/context-server.js`
- Save context via `generate-context.js`
