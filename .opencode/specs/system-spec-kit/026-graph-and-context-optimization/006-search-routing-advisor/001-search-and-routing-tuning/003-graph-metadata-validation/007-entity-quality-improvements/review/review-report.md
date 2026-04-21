# Deep Review Report - Entity Quality Improvements

## 1. Executive summary

Verdict: **PASS with advisories**.

The 10-iteration loop covered correctness, security, traceability, and maintainability. No P0 findings were found. One P1 traceability issue remains: `description.json` has a stale `parentChain` entry for `010-search-and-routing-tuning` while the active packet route is under `001-search-and-routing-tuning`. Eight P2 advisories remain.

Stop reason: `maxIterationsReached`. Convergence did not stop early because iteration 008 still produced a new advisory and the low-churn streak reached only two iterations by iteration 010.

## 2. Scope

Reviewed packet:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements`

Requested packet docs reviewed:

| File | Status |
|------|--------|
| `spec.md` | Present |
| `plan.md` | Present |
| `tasks.md` | Present |
| `checklist.md` | Present |
| `decision-record.md` | Missing |
| `implementation-summary.md` | Present |
| `description.json` | Present |
| `graph-metadata.json` | Present |

Production references read-only reviewed:

| File | Reason |
|------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Entity derivation implementation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Focused parser/schema coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | Integration coverage surface |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md` | Maintainer-facing graph metadata behavior docs |

## 3. Method

The loop ran 10 iterations with dimension rotation:

`correctness -> security -> traceability -> maintainability -> correctness -> security -> traceability -> maintainability -> correctness -> security`.

Each iteration read the current packet state, checked prior findings, reviewed one dimension, wrote an iteration narrative, appended a JSONL delta, updated the registry, and evaluated convergence. The review was read-only for production files and wrote only under `review/**`.

## 4. Findings by severity

### P0

| ID | Dimension | Summary | Evidence |
|----|-----------|---------|----------|
| None | - | No P0 findings found. | - |

### P1

| ID | Dimension | Summary | Evidence |
|----|-----------|---------|----------|
| DR-TRC-001 | traceability | `description.json` parentChain still points at pre-renumbered `010-search-and-routing-tuning` while the active route is `001-search-and-routing-tuning`. | `description.json:2`, `description.json:18`, `description.json:26`, `description.json:31` |

### P2

| ID | Dimension | Summary | Evidence |
|----|-----------|---------|----------|
| DR-COR-001 | correctness | External canonical-doc filtering can overmatch non-spec support docs by suffix. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:845`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:848`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:885` |
| DR-COR-002 | correctness | Runtime-name test directly asserts only three of the nine banned names. | `spec.md:24`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:521`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:524` |
| DR-TRC-002 | traceability | `decision-record.md` is absent from the requested read set; key decisions live only in the summary. | `implementation-summary.md:83`, `implementation-summary.md:90` |
| DR-TRC-003 | traceability | `graph-metadata.json` has duplicate aliases for the parser and test files in `derived.key_files`. | `graph-metadata.json:34`, `graph-metadata.json:43`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:94` |
| DR-TRC-004 | traceability | Implementation summary visible metadata collapses the full packet route to a basename. | `implementation-summary.md:14`, `implementation-summary.md:44` |
| DR-TRC-005 | traceability | `description.json` lastUpdated predates its own renumbered_at event. | `description.json:11`, `description.json:33` |
| DR-MTN-001 | maintainability | Graph metadata README omits the new 24 cap, runtime-name filter, and external canonical-doc skip. | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:88`, `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:95`, `implementation-summary.md:58`, `implementation-summary.md:61` |
| DR-MTN-002 | maintainability | REQ-002 leaves the canonical-doc exception ambiguous against the implemented external-doc skip. | `spec.md:23`, `spec.md:31`, `implementation-summary.md:88`, `implementation-summary.md:89` |

## 5. Findings by dimension

| Dimension | Iterations | P0 | P1 | P2 | Notes |
|-----------|------------|----|----|----|-------|
| correctness | 001, 005, 009 | 0 | 0 | 2 | Main behavior appears implemented; remaining items are edge-case and coverage advisories. |
| security | 002, 006, 010 | 0 | 0 | 0 | No direct security issues found. |
| traceability | 003, 007 | 0 | 1 | 5 | Main concentration of risk is stale or incomplete metadata after migration. |
| maintainability | 004, 008 | 0 | 0 | 2 | Docs and requirement wording need cleanup to match implementation. |

## 6. Adversarial self-check for P0

Hunter pass:
- Looked for direct breakage in cap behavior, scope rejection, runtime-name filtering, and metadata migration.
- No defect met P0 criteria.

Skeptic pass:
- The P1 parentChain mismatch is real, but aliases and migration fields preserve recoverability.
- The external-doc suffix overmatch is plausible but edge-case bounded and does not corrupt stored key_files.
- The absent `decision-record.md` is not P0 or P1 because this is a Level 2 packet where decision records are not mandatory.

Referee:
- No P0 findings are justified by the evidence.

## 7. Remediation order

| Order | Finding | Action |
|-------|---------|--------|
| 1 | DR-TRC-001 | Regenerate or patch `description.json.parentChain` to use `001-search-and-routing-tuning`. |
| 2 | DR-TRC-005 | Refresh `description.json.lastUpdated` after the renumbering event. |
| 3 | DR-COR-002 | Parameterize runtime-name tests over all nine banned names. |
| 4 | DR-TRC-003 | Normalize duplicate key-file aliases or document the expected mixed roots. |
| 5 | DR-MTN-001, DR-MTN-002 | Update docs and requirement wording to match the shipped external canonical-doc skip. |
| 6 | DR-COR-001 | Narrow external canonical-doc skip detection to recognized specs-root packet docs. |
| 7 | DR-TRC-002, DR-TRC-004 | Decide whether to add a short decision record and full route in the visible summary metadata. |

## 8. Verification suggestions

Suggested checks after remediation:

| Check | Purpose |
|-------|---------|
| `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{...}' <spec-folder>` | Regenerate description and graph metadata after metadata fixes. |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-schema.vitest.ts` | Verify expanded runtime-name and external-doc tests. |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | Confirm parser/test edits typecheck. |
| Inspect `description.json` | Confirm parentChain and lastUpdated are consistent with migration. |

I did not run the production test suite during this review because the requested authority allowed writes only under `review/**`, and test/build commands can create cache or temp artifacts outside that packet.

## 9. Appendix

### Iteration list

| Iteration | Dimension | New P0 | New P1 | New P2 | Ratio |
|-----------|-----------|--------|--------|--------|-------|
| 001 | correctness | 0 | 0 | 2 | 0.18 |
| 002 | security | 0 | 0 | 0 | 0.00 |
| 003 | traceability | 0 | 1 | 2 | 0.42 |
| 004 | maintainability | 0 | 0 | 1 | 0.08 |
| 005 | correctness | 0 | 0 | 0 | 0.03 |
| 006 | security | 0 | 0 | 0 | 0.00 |
| 007 | traceability | 0 | 0 | 2 | 0.11 |
| 008 | maintainability | 0 | 0 | 1 | 0.06 |
| 009 | correctness | 0 | 0 | 0 | 0.00 |
| 010 | security | 0 | 0 | 0 | 0.00 |

### Delta churn

| Delta file | Churn | Summary |
|------------|-------|---------|
| `deltas/iter-001.jsonl` | 0.18 | Correctness advisories found. |
| `deltas/iter-002.jsonl` | 0.00 | No security findings. |
| `deltas/iter-003.jsonl` | 0.42 | Main traceability findings found. |
| `deltas/iter-004.jsonl` | 0.08 | README maintainability finding found. |
| `deltas/iter-005.jsonl` | 0.03 | Correctness findings refined. |
| `deltas/iter-006.jsonl` | 0.00 | No security findings. |
| `deltas/iter-007.jsonl` | 0.11 | Additional migration traceability drift found. |
| `deltas/iter-008.jsonl` | 0.06 | Ambiguous requirement wording found. |
| `deltas/iter-009.jsonl` | 0.00 | No new correctness findings. |
| `deltas/iter-010.jsonl` | 0.00 | No new security findings. |
