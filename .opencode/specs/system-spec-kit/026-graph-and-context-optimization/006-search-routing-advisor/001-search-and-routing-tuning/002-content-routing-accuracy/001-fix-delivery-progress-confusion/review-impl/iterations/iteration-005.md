# Iteration 005 - Correctness

## Scope

Second correctness pass across the same scoped code files.

## Verification

- Git log checked for the scoped files.
- Scoped Vitest command: PASS, 30 tests.

## Findings

### F-005 - P2 Security - Routing audit entries persist raw chunk previews without redaction

`createRoutingAuditEntry` copies the chunk id at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1338` and stores the first 120 characters of raw chunk text at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1339`.

That preview is useful for diagnostics, but the router can receive arbitrary save chunks. If a chunk includes a secret, token, private path, or personal data in the first 120 characters, the audit object preserves it without masking. I am marking this P2 because the audited file does not show the persistence boundary, but the code path is a real privacy/security hardening gap.

## Delta

New finding: F-005.
