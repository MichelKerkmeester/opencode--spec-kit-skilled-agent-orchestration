# Architecture Path Drift Analysis — 009

## Summary
- Stale references found: 2 (source code / feature catalog) + 35 (scratch/memory — historical)
- Exception count mismatch: No (both ARCHITECTURE.md and allowlist.json report 4 entries)
- Files affected: 2 actionable source files, 15 historical-only scratch/memory files

## Classification

Stale references fall into two categories:

1. **Actionable (source code)** — references in live `.ts` source or feature catalog docs that are part of the active codebase. These should be fixed.
2. **Historical (scratch/memory)** — references in review artifacts, audit scratch files, and memory files that record what happened at a point in time. These are archival and do NOT need updating; changing them would falsify the historical record.

## Actionable Stale ARCHITECTURE_BOUNDARIES.md References

| # | File | Line | Current Text | Fix |
|---|------|------|-------------|-----|
| 1 | `.opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts` | 3 | `// Enforces two rules from ARCHITECTURE_BOUNDARIES.md that were` | Change to `ARCHITECTURE.md` |
| 2 | `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md` | 5 | `Two architecture rules in \`ARCHITECTURE_BOUNDARIES.md\` were previously...` | Change to `ARCHITECTURE.md` |

### Impact Assessment — Actionable Files

| File | Impact | Severity |
|------|--------|----------|
| `check-architecture-boundaries.ts` | Comment-only; no runtime behavior change. But misleads developers about the canonical doc name. | Low (cosmetic) |
| `02-architecture-boundary-enforcement.md` | Feature catalog description references wrong filename. Discoverable by AI and human readers. | Medium (documentation accuracy) |

## Historical References (No Fix Needed — Archival)

These files contain ARCHITECTURE_BOUNDARIES.md references but are historical audit/review artifacts. Modifying them would falsify the record of what was verified at that time.

| # | File | Occurrences | Context |
|---|------|-------------|---------|
| 1 | `005-architecture-audit/scratch/cross-ai-review-2026-03-05/gemini-gamma-checklist-verification.md` | 4 | Review artifact from 2026-03-05 |
| 2 | `005-architecture-audit/scratch/cross-ai-review-2026-03-05/codex-beta-enforcement-robustness.md` | 3 | Review artifact from 2026-03-05 |
| 3 | `005-architecture-audit/scratch/cross-ai-review-2026-03-05/codex-alpha-implementation-integrity.md` | 2 | Review artifact from 2026-03-05 |
| 4 | `005-architecture-audit/scratch/cross-ai-review-2026-03-05/gemini-alpha-adr-quality.md` | 1 | Review artifact from 2026-03-05 |
| 5 | `005-architecture-audit/scratch/cross-ai-review-2026-03-05/gemini-epsilon-risk-analysis.md` | 2 | Review artifact from 2026-03-05 |
| 6 | `005-architecture-audit/scratch/cross-ai-review-2026-03-05/codex-epsilon-cross-spec-continuity.md` | 1 | Review artifact from 2026-03-05 |
| 7 | `005-architecture-audit/scratch/review-2026-03-06/agent-6-cross-ai-remediation.md` | 2 | Review artifact from 2026-03-06 |
| 8 | `005-architecture-audit/scratch/review-2026-03-06/agent-4-adr-quality.md` | 1 | Review artifact from 2026-03-06 |
| 9 | `005-architecture-audit/scratch/review-2026-03-06/agent-8-merge-quality.md` | 1 | Review artifact from 2026-03-06 |
| 10 | `005-architecture-audit/scratch/review-2026-03-06/agent-9-evidence-audit.md` | 1 | Review artifact from 2026-03-06 |
| 11 | `005-architecture-audit/scratch/review-2026-03-06/agent-10-risk-debt.md` | 3 | Review artifact from 2026-03-06 |
| 12 | `005-architecture-audit/scratch/review-2026-03-06/agent-3-checklist-integrity.md` | 2 | Review artifact from 2026-03-06 |
| 13 | `005-architecture-audit/scratch/merged-030-architecture-boundary-remediation/spec.md` | 3 | Archived merged spec |
| 14 | `005-architecture-audit/scratch/merged-030-architecture-boundary-remediation/plan.md` | 2 | Archived merged plan |
| 15 | `005-architecture-audit/scratch/merged-030-architecture-boundary-remediation/tasks.md` | 2 | Archived merged tasks |
| 16 | `005-architecture-audit/scratch/merged-030-architecture-boundary-remediation/checklist.md` | 1 | Archived merged checklist |
| 17 | `005-architecture-audit/scratch/architecture-audit-report.md` | 1 | Original audit report |
| 18 | `005-architecture-audit/memory/06-03-26_11-58__phase-8-architecture-boundaries.md` | 8+ | Memory file (auto-generated) |
| 19 | `006-extra-features/handover.md` | 1 | Handover record |
| 20 | `009-spec-descriptions/scratch/audit-A09.md` | 5 | External audit that already flags this issue |
| 21 | `009-spec-descriptions/scratch/audit-risk-matrix.md` | 2 | Risk matrix that already tracks ISS-A09-STALE |
| 22 | `009-spec-descriptions/scratch/audit-D08.md` | 2 | External audit of shared/README |

## Exception Count Analysis

### ARCHITECTURE.md Exceptions Table
- **Count: 4 entries**
- Entries:
  1. `scripts/evals/run-performance-benchmarks.ts` — `@spec-kit/mcp-server/lib/*` (multiple)
  2. `scripts/evals/run-chk210-quality-backfill.ts` — `@spec-kit/mcp-server/lib/*`
  3. `scripts/spec-folder/generate-description.ts` — `@spec-kit/mcp-server/lib/search/folder-discovery`
  4. `scripts/core/workflow.ts` — `@spec-kit/mcp-server/lib/search/folder-discovery`

### allowlist.json Entries
- **Location:** `.opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json`
- **Count: 4 entries**
- Entries:
  1. `scripts/evals/run-performance-benchmarks.ts` — `@spec-kit/mcp-server/lib/*`
  2. `scripts/evals/run-chk210-quality-backfill.ts` — `@spec-kit/mcp-server/lib/*`
  3. `scripts/spec-folder/generate-description.ts` — `@spec-kit/mcp-server/lib/search/folder-discovery`
  4. `scripts/core/workflow.ts` — `@spec-kit/mcp-server/lib/search/folder-discovery`

### Mismatch Assessment
- **Mismatches: None** — ARCHITECTURE.md and allowlist.json are synchronized at 4 entries each.
- The checklist (CHK-201, CHK-513, CHK-721) all confirm this reconciliation as of 2026-03-08.

### Cross-Link Verification
The three consumer READMEs already reference the correct filename:
- `mcp_server/api/README.md` line 38: links to `../../ARCHITECTURE.md` (correct)
- `scripts/evals/README.md` line 49: links to `../../ARCHITECTURE.md` (correct)
- `shared/README.md` line 117: links to `../ARCHITECTURE.md` (correct)
- `mcp_server/scripts/README.md`: no ARCHITECTURE reference at all (not a problem — it's a wrapper doc)

## Recommended Fix Order

1. **`.opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts` line 3** — Update comment from `ARCHITECTURE_BOUNDARIES.md` to `ARCHITECTURE.md`. This is a live source file in the enforcement tooling. Low risk (comment only), high discoverability value.

2. **`.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md` line 5** — Update reference from `ARCHITECTURE_BOUNDARIES.md` to `ARCHITECTURE.md`. This is a feature catalog entry that describes the enforcement tooling.

3. **No changes to scratch/, memory/, or historical review files** — These are archival artifacts. The 009-spec-descriptions audit (audit-A09.md) already correctly identifies this drift as issue ISS-A09-STALE and recommends reconciliation of the canonical document path.

## Key Findings

- The **core documents are already fixed**: `checklist.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md`, and `spec.md` within 005-architecture-audit all use the correct `ARCHITECTURE.md` filename.
- The **consumer READMEs are already fixed**: `mcp_server/api/README.md`, `scripts/evals/README.md`, and `shared/README.md` all link to `ARCHITECTURE.md`.
- Only **2 actionable stale references** remain in the live codebase (1 source comment, 1 feature catalog doc).
- The **exception counts are synchronized** at 4 entries each.
- The rename from `ARCHITECTURE_BOUNDARIES.md` to `ARCHITECTURE.md` appears to have occurred during the 2026-03-08 remediation work (commit `359ef21e`), but the two minor references above were missed.
