# Deep Review Report

## 1. Executive summary

- **Verdict:** PASS
- **Stop reason:** `max_iterations`
- **Severity totals:** 0 P0 / 3 P1 / 3 P2
- **hasAdvisories:** `true`
- **Scope note:** Under the requested scoring rule, this packet still lands on PASS because no P0 surfaced and the loop finished with fewer than five P1 findings. The active P1s still merit follow-up even though they do not flip the computed verdict.

## 2. Scope

Reviewed packet-local docs and metadata:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Reviewed referenced implementation and verification surfaces:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

`decision-record.md` is absent; that is acceptable for this Level 2 packet and was not treated as a defect.

## 3. Method

Ran 10 iterations in the required rotation:

1. correctness
2. security
3. traceability
4. maintainability
5. correctness
6. security
7. traceability
8. maintainability
9. correctness
10. security

Each pass re-read prior state, checked the packet against one dimension, wrote a packet-local iteration file, appended a delta record, and then fed the cumulative state into synthesis.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| None | - | No blocker survived the 10-pass loop. | - |

### P1

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| F001 | correctness | The Tier 3 prompt still leaks the internal `drop_candidate` alias inside a contract that says only the existing 8 public categories are valid. | `spec.md:24`; `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1275`; `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:582` |
| F003 | traceability | `description.json.parentChain` still records `010-search-and-routing-tuning` instead of the live `001-search-and-routing-tuning` segment. | `description.json:2`; `description.json:15`; `description.json:19` |
| F006 | correctness | The packet's `metadata_only -> implementation-summary.md` closure only becomes true after `memory-save.ts` resolves the router's internal `spec-frontmatter` alias. | `spec.md:23`; `spec.md:25`; `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:197`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1144`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157` |

### P2

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| F002 | security | The new continuity paragraph discloses more internal topology to the external Tier 3 classifier than before. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273` |
| F004 | maintainability | `graph-metadata.json.derived.key_files` mixes canonical repo-relative paths with broken shorthand duplicates. | `graph-metadata.json:33`; `graph-metadata.json:39`; `graph-metadata.json:40` |
| F005 | maintainability | `graph-metadata.json.derived.entities` still retains anchor markup and low-signal tokens. | `graph-metadata.json:118`; `graph-metadata.json:130`; `graph-metadata.json:136`; `graph-metadata.json:142` |

## 5. Findings by dimension

### Correctness

- **F001 / P1:** Public prompt contract still exposes `drop_candidate` instead of staying fully inside the documented 8-category surface.
- **F006 / P1:** Concrete `implementation-summary.md` targeting is only guaranteed after the save handler translates the router alias.

### Security

- **F002 / P2:** The enriched prompt shares more internal file-topology detail with the external classifier than before, but no secret or auth material is exposed.

### Traceability

- **F003 / P1:** `description.json` still encodes the old parent chain after the packet renumbering.

### Maintainability

- **F004 / P2:** Generated key-file metadata contains unresolved shorthand paths.
- **F005 / P2:** Generated entities still include raw anchor markup and low-value tokens.

## 6. Adversarial self-check for P0

No P0 finding survived adversarial re-check.

- Re-read the public category contract and the parser-facing tests: the `drop_candidate` drift is real, but it is a contract inconsistency rather than a hard failure because the runtime still normalizes refusal output.
- Re-read metadata routing: the `spec-frontmatter` alias resolves correctly in `memory-save.ts`, so the split is a documentation/contract clarity issue rather than a broken persistence path.
- Re-read metadata artifacts: the lineage and graph issues degrade traceability and maintainability, but they do not block packet recovery outright.

## 7. Remediation order

1. **Fix F001 first.** Make the public Tier 3 prompt and its prompt-shape test use the same public `drop` category language the packet promises.
2. **Fix F003 next.** Regenerate or patch `description.json` so `parentChain` mirrors the live packet path.
3. **Then fix F006.** Decide whether the router should publish `implementation-summary.md` directly or whether the packet should explicitly document `spec-frontmatter` as an internal alias.
4. **Finally clean F004/F005.** Regenerate the graph metadata with path normalization and entity sanitization so packet search/indexing quality improves.

## 8. Verification suggestions

1. Add a focused assertion that the public Tier 3 category list uses `drop`, not `drop_candidate`.
2. Regenerate `description.json` and `graph-metadata.json`, then verify:
   - `parentChain` matches the live path
   - `derived.key_files` contains only canonical repo-relative paths
   - `derived.entities` strips anchor comments and single-token noise
3. Add or update a packet-level check clarifying whether `metadata_only` should be asserted at the router alias layer, the host-doc layer, or both.

## 9. Appendix

| Iteration | Dimension | New-finding ratio | Notes |
|-----------|-----------|------------------:|-------|
| 001 | correctness | 0.32 | Found prompt-category contract drift (F001). |
| 002 | security | 0.11 | Logged topology-disclosure advisory (F002). |
| 003 | traceability | 0.29 | Found stale `description.json.parentChain` (F003). |
| 004 | maintainability | 0.18 | Found graph-metadata hygiene drift (F004, F005). |
| 005 | correctness | 0.14 | Found router/handler target split (F006). |
| 006 | security | 0.11 | Stabilization pass; no escalation beyond F002. |
| 007 | traceability | 0.12 | Re-confirmed F003 and F006 across packet surfaces. |
| 008 | maintainability | 0.11 | Re-confirmed metadata noise remains localized to graph artifacts. |
| 009 | correctness | 0.11 | Re-confirmed F001 and F006. |
| 010 | security | 0.08 | Final verification; stop on max iterations. |
