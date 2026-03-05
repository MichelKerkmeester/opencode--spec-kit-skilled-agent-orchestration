## CODEX-DELTA: Spec 013 Quality Assessment

### Spec Completeness
| Section | Score | Notes |
|---------|-------|-------|
| Problem Framing | 8/10 | Clear statement of the two gaps and intent to remediate ([`spec.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/spec.md):39). |
| Scope Definition | 6/10 | Good primary targets, but scope mixes optional paths and misses required companion files for API expansion/automation ([`spec.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/spec.md):73, [`tasks.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/tasks.md):51). |
| Requirements Quality | 6/10 | P0/P1 split is useful, but REQ-006 and REQ-007 are under-specified on concrete implementation target ([`spec.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/spec.md):100). |
| Edge Cases & Risks | 5/10 | Misses key edge cases: DB path parity after constant move, and dynamic deep-access bypass in reindex script ([`memory-indexer.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts):14, [`reindex-embeddings.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts):65). |
| Success Criteria | 5/10 | SC-001 is measurable but can be satisfied without materially fixing runtime boundary behavior ([`spec.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/spec.md):110). |
| Checklist Quality | 6/10 | Solid baseline checks, but lacks explicit verification for DB path compatibility and CI trigger behavior ([`checklist.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/checklist.md):65). |
| Open Questions Closure | 3/10 | Questions are listed but not resolved into decisions before implementation start ([`spec.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/spec.md):180). |

### Feasibility Assessment
Phase 1 is feasible and low risk: `api/search` already exports `vectorIndex`, and allowlist has exactly the two `memory-indexer` entries to remove ([`search.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/search.ts):20, [`import-policy-allowlist.json`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json):15).

Phase 2 is only partially feasible as written. `reindex-embeddings.ts` depends on `lib/search`, `lib/storage`, `lib/providers`, plus `core`/`handlers` at runtime ([`reindex-embeddings.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts):19). Current API surface does not expose checkpoints/access-tracker/retry-manager, and providers API is minimal ([`providers.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/providers.ts):7). So full “API migration” needs extra API design not captured in detail.

Phase 3 is under-specified. “pre-commit or CI” is not a concrete plan, and no target file path, trigger strategy, or failure policy is defined ([`plan.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/plan.md):91). Also NFR `<5s` conflicts with `npm run check` including `tsc --noEmit` ([`scripts/package.json`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/package.json):10).

### Task Gap Analysis
Missing or weak tasks:
- Add explicit decision task: choose CI vs Husky and lock implementation path before Phase 3 coding.
- If `api/storage.ts` is created, add tasks to update [`api/index.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/api/index.ts):8 and API docs.
- If retry-manager remains in scope, add migration task for [`workflow.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts):45.
- Add task/check for DB marker path parity between old/new `DB_UPDATED_FILE` computation ([`core/config.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts):36, [`shared/config.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/config.ts):5).
- Split T014/T013 into atomic tasks (implement, wire, verify trigger, verify fail-closed behavior).

### Allowlist Reduction Feasibility
Current 6 entries are real and match code ([`import-policy-allowlist.json`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/evals/import-policy-allowlist.json):4).

6→3 is achievable if:
- Remove 2 memory-indexer entries (very likely).
- Remove or narrow reindex wildcard (possible, but depends on approach).

Risk to SC-001 quality:
- Reindex currently performs runtime deep requires from `mcp_server/dist/lib/*` and `core`/`handlers` ([`reindex-embeddings.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts):65).
- Import policy checker only enforces `lib/*` and `core/*` package-style patterns, not this runtime path-construction pattern ([`check-no-mcp-lib-imports.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts):54).

Conclusion: SC-001 is mechanically realistic, but currently not strong enough to guarantee true boundary remediation.

### Open Questions Assessment
- Pre-commit vs CI: Recommend CI-first (mandatory), optional pre-commit as fast subset. Avoid forcing full `npm run check` in pre-commit.
- `api/storage.ts` vs extending `search.ts`: Recommend `api/storage.ts` for checkpoints/access-tracker to keep API domains coherent.
- Full reindex migration vs wildcard retention: Recommend explicit two-path decision gate. If no stable API contract for handlers/core in this spec, retain wildcard with strict justification and create follow-up spec for full runtime decoupling.

### Findings by Severity
#### CRITICAL (spec flaws that would block implementation)
- Success metric can be passed without materially fixing runtime boundary behavior in reindex flow (dynamic deep requires bypass intent). References: [`spec.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/spec.md):110, [`reindex-embeddings.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts):65, [`check-no-mcp-lib-imports.ts`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/evals/check-no-mcp-lib-imports.ts):54.
- Enforcement automation Phase 3 lacks a concrete implementation target and fail criteria, so execution is ambiguous. References: [`plan.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/plan.md):91, [`tasks.md`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-architecture-audit/scratch/merged-030-architecture-boundary-remediation/tasks.md):62.

#### MAJOR (gaps that need filling before implementation)
- API expansion scope is incomplete: retries/checkpoints/access-tracker requested, but companion files/tasks (`api/index.ts`, possibly `api/providers.ts`) not fully included.
- Retry-manager appears in scope text but no migration task exists for its only current consumer (`workflow.ts`).
- Backward-compat is asserted but no explicit path-equivalence validation for `DB_UPDATED_FILE`.
- NFR `<5s` is likely unrealistic if interpreted as full `npm run check`.

#### MINOR (improvements that would help)
- Effort estimate (2–4h) is optimistic for CI/hook wiring plus API surface decisions.
- Checklist should include “automation fires on PR/commit event” and “retained exceptions re-justified.”
- Consider updating `scripts/evals/README.md` exception section for consistency with actual allowlist.

### Overall Verdict
NEEDS REVISION  
Confidence: 90/100
