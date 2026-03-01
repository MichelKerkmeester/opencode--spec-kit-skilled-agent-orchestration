# Remediation Backlog: System-Spec-Kit Script Audit

Generated: 2026-02-15  
Source: ADR-003 Synthesis from decision-record.md

---

## Remediation Items

| Priority | Finding ID | Component | Fix Summary | Owner Placeholder | Effort(S/M/L) | Evidence Source |
|----------|-----------|-----------|-------------|-------------------|---------------|-----------------|
| P0 | C08-F001 | Error Handling | Fix swallowed errors in cleanup-orphaned-vectors.ts to surface cleanup failures | TBD | M | decision-record.md:252 |
| P0 | C08-F008 | Error Handling | Fix null DB returns in session-manager.ts returning `true` instead of error | TBD | S | decision-record.md:253 |
| P0 | C08-F003 | Error Handling | Add metrics/logging when operations continue in degraded state | TBD | M | decision-record.md:254 |
| P0 | C08-F010 | Error Handling | Fix UPDATE statements reporting success when 0 rows matched | TBD | M | decision-record.md:255 |
| P0 | C09-001 | Memory/Indexing | Fix DB marker path contract to prevent silent divergence and stale data | TBD | L | decision-record.md:256 |
| P1 | C01-002 | JS/TS Scripts | Add try/catch to async boundaries (severity adjusted from original) | TBD | S | decision-record.md:266 |
| P1 | C02-F004 | Shared Utilities | Fix doc-drift in score/similarity interfaces | TBD | S | decision-record.md:267 |
| P1 | C03-F001 | MCP Server | Improve unknown-tool dispatch diagnostics (currently too generic) | TBD | S | decision-record.md:268 |
| P1 | C03-F003 | MCP Server | Fix embedding readiness race on cold start (lazy mode) | TBD | M | decision-record.md:269 |
| P1 | C03-F008 | MCP Server | Remove/fix startup remediation reference to non-existent script | TBD | S | decision-record.md:270 |
| P1 | C04-F002 | Root Orchestration | Downgrade policy interpretation severity from HIGH to MEDIUM | TBD | S | decision-record.md:271 |
| P1 | C06-02 | Validation/Quality | Fix zero-file anchor validation false pass | TBD | M | decision-record.md:272 |
| P1 | C06-04 | Validation/Quality | Fix case-insensitive + non-exact section matching | TBD | M | decision-record.md:273 |
| P1 | C07-002 | Data Contracts | Fix IVectorStore.search signature divergence | TBD | M | decision-record.md:274 |
| P1 | C07-003 | Data Contracts | Fix IVectorStore id/lifecycle signature divergence | TBD | M | decision-record.md:275 |
| P1 | C08-F002 | Error Handling | Standardize error levels across session-manager.ts | TBD | S | decision-record.md:276 |
| P1 | C08-F004 | Error Handling | Add exit(1) to CLI script error paths | TBD | S | decision-record.md:277 |
| P1 | C08-F006 | Error Handling | Use stderr for warnings instead of stdout | TBD | S | decision-record.md:278 |
| P1 | C08-F007 | Error Handling | Add retry logic for transient errors | TBD | M | decision-record.md:279 |
| P1 | C08-F011 | Error Handling | Establish exit code taxonomy | TBD | S | decision-record.md:280 |
| P1 | C10-F002 | Memory/Indexing | Fix save-then-query guarantee (deferred indexing issue) | TBD | M | decision-record.md:281 |

---

## Summary

- **Total Items**: 21
- **P0 (Blockers)**: 5
- **P1 (Required)**: 16
- **P2 Items**: Not included in this backlog (26+ suggestions documented in implementation-summary.md)

---

## Notes

1. **False Positives Excluded**: C04-F003 and C04-F004 were originally reported as P0 but disproven by build verification and retracted.
2. **Node_modules Relocation**: No findings attributed exclusively to the in-progress node_modules relocation (per ADR-002 exclusion protocol).
3. **Uncertainties**: Several coverage gaps documented in decision-record.md (review-agent-01, 02, 04, 07, 09, 10) may require follow-up investigation.
4. **Effort Estimates**: S=Small (1-4 hours), M=Medium (4-8 hours), L=Large (8+ hours or requires architectural changes).

---

## Next Steps

1. Assign owners to each finding
2. Create implementation tasks for P0 items (block resolution)
3. Schedule P1 items for production readiness milestone
4. Evaluate P2 backlog for quality improvement roadmap
