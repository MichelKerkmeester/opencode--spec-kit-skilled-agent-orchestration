## CODEX-EPSILON: Cross-Spec Continuity Analysis (012 → 013)

### Coverage Gap Matrix
| Item from 029 | Addressed in 030? | Gap? |
|---------------|-------------------|------|
| Open question: compatibility wrapper rename/removal timing | No | Yes |
| Open question: strict vs staged API-first migration | Partially | Partial gap (end-state policy still not explicit if wildcard remains) |
| P2 long-term recommendation: AST-based enforcement upgrade | No | Yes |
| Phase 5 result: enforcement scripts integrated into `npm run check` | Yes (Phase 3 automation intent) | Partial gap (trigger mechanism still undecided) |
| Memory-indexer allowlist entries with `removeWhen` conditions | Yes (Phase 1 targets both entries) | No |
| Reindex wildcard exception governance | Partially (Phase 2 audit/migrate) | Partial gap (can still remain wildcard) |
| Deferred/P2 items from 029 (CHK-042/CHK-112 etc.) | Already closed in 029 | No |

### Scope Overlap Check
- Both specs modify boundary governance artifacts (`import-policy-allowlist.json`, `ARCHITECTURE_BOUNDARIES.md`), but 030 is mostly follow-up reduction, not duplicate closure.
- 029 already automated checks inside `npm run check`; 030 extends this to commit/PR automation (complementary overlap).
- 030 repeats verification actions (`tsc`, `npm run check`) that 029 already used, but for post-remediation validation this is appropriate.

### Continuity Issues
- 030 references the architecture doc with an invalid relative path in tasks cross-refs (points to a non-existent location).
- 013 cites a “5 Gemini agents” audit source but has no evidence artifact in its own `scratch/` folder.
- 030 claims `api/search.ts` already exposes “hybridSearch”; current export is `hybridSearchEnhanced` (naming mismatch risk).
- 012 appears operationally complete, but its `spec.md` metadata still says “In Review,” creating state drift.

### Missing Bridge Items
- No concrete CI/hook bootstrap plan (if CI: workflow file/location/triggers; if Husky: install/init steps).
- No explicit handling of boundary-policy blind spots beyond `lib/*`/`core/*` path patterns (notably bare `@spec-kit/mcp-server/core` and `handlers` usage patterns in reindex flow).
- No explicit follow-up for wildcard exception expiry execution (some entries expire June 4, 2026).
- No dedicated runtime regression plan for reindex behavior after API-surface expansion (only compile/check gates listed).

### Contradiction Check
- Internal tension in 030: success criterion says allowlist must go from 6 to ≤3, but scope/open questions allow retaining reindex wildcard if migration is not feasible.
- “4 enforcement scripts” wording is imprecise versus current enforcement model (3 executable checkers + allowlist registry artifact).
- Cross-reference path in 030 tasks contradicts actual repo layout (broken reference).
- No contradiction found on current allowlist count: both live state and docs show 6 entries.

### Post-030 Completeness Assessment
030 is a strong next step, but boundary hardening will likely still need at least one follow-on spec for:
- enforcement robustness (AST parser migration / policy edge cases),
- wildcard exception sunset execution,
- compatibility-wrapper end-state decisions.

### Findings by Severity
#### CRITICAL
- Enforcement automation is underspecified as “pre-commit or CI”; pre-commit alone is bypassable and does not guarantee merge-time enforcement.

#### MAJOR
- Broken architecture-doc cross-reference path in 030 tasks.
- Policy/coverage blind spots not explicitly bridged (core/handlers usage patterns).
- Allowlist reduction target can conflict with “retain wildcard if legitimate” branch.
- Audit provenance in 030 is not traceable to artifacts.

#### MINOR
- Metadata drift: 012 `spec.md` status vs practical completion state.
- Terminology drift around “4 enforcement scripts.”

### Overall Verdict
GAPS FOUND  
Confidence: 89/100
