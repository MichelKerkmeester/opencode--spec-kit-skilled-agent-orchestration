# Review 002: Scope Governance Fix Review

## Dimension: Security & Correctness

Verdict: the opt-in change is a valid hotfix for the packet's local usability regression, but it is not a clean governance fix. It restores unscoped single-user search by removing the previous fail-closed default, which means the code now trades secure-by-default behavior for open-by-default behavior unless operators explicitly enable scope enforcement.

## Findings (P0/P1/P2 with file:line citations)

No P0 findings.

- `P1` The fix restores search results by changing the global read-path default from fail-closed to open-by-default for unscoped requests. `isScopeEnforcementEnabled()` now returns `true` only when `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` or `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` is explicitly set, `stage1-candidate-gen` only applies scope filtering when a request already carries scope or that flag is on, and `createScopeFilterPredicate()` returns `() => true` when both enforcement and request scope are absent. That is correct for the specific single-user outage described in this packet, but it also means deployments that previously relied on implicit scope enforcement now silently expose all rows to unscoped reads until the env flag is set. Evidence: `mcp_server/lib/governance/scope-governance.ts:192-195`, `mcp_server/lib/governance/scope-governance.ts:476-482`, `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:896-914`, mirrored in `mcp_server/dist/lib/governance/scope-governance.js:50-54` and `mcp_server/dist/lib/governance/scope-governance.js:300-305`.

- `P1` The `() => false` branch for empty scope is only the right behavior when the system is intentionally running in governed mode, but the surrounding call sites do not enforce that contract consistently. In the search pipeline, explicit enforcement plus empty scope yields zero visible rows, which is a reasonable fail-closed stance. In checkpoint flows, however, empty scope short-circuits before `createScopeFilterPredicate()` is ever called, so the same "empty scope means no access" rule is not applied there. That makes BUG-001 a caller-local rule rather than a system-wide governance guarantee. Evidence: `mcp_server/lib/governance/scope-governance.ts:471-482`, `mcp_server/lib/storage/checkpoints.ts:452-458`, `mcp_server/lib/storage/checkpoints.ts:461-466`, `mcp_server/lib/storage/checkpoints.ts:650-654`.

- `P2` `isGovernanceGuardrailsEnabled()` does not currently have the same default-ON bug class as `isScopeEnforcementEnabled()`. Its only active runtime use in this codepath is a fail-closed tenant requirement for shared-space access, so changing it to opt-in would relax an actual governance boundary rather than restore generic usability. The real issue is semantic drift: the shared helper and surrounding docs/comments still describe these governance flags as a unified default-ON family even though scope enforcement no longer behaves that way. I did not find any other current `isDefaultOnFlagEnabled()` callers in `mcp_server` beyond `isGovernanceGuardrailsEnabled()`, so this inconsistency is localized but still misleading. Evidence: `mcp_server/lib/governance/scope-governance.ts:152-165`, `mcp_server/lib/governance/scope-governance.ts:203-207`, `mcp_server/lib/collab/shared-spaces.ts:620-621`, `mcp_server/lib/telemetry/README.md:99-100`, mirrored in `mcp_server/dist/lib/governance/scope-governance.js:16-29` and `mcp_server/dist/lib/governance/scope-governance.js:60-61`.

- `P2` The BUG-001 fix comment should be updated. As written, it reads like a universal rule, but after this change the deny-all predicate only applies when scope enforcement has been explicitly enabled. The comment is not strictly false, but it is incomplete enough to send future maintainers toward the wrong mental model. Evidence: `mcp_server/lib/governance/scope-governance.ts:479-481`, mirrored in `mcp_server/dist/lib/governance/scope-governance.js:303-305`.

## Recommendations

- Keep the empty-scope `() => false` behavior for explicitly governed mode, but treat it as an authorization failure contract rather than a silent "0 results" fallback. That will preserve the fail-closed stance without making governance bugs look like empty datasets.

- Pick one product contract and encode it everywhere: either scope enforcement is intentionally opt-in for local/single-user deployments, or it is secure-by-default for governed deployments with a separate explicit bypass for local search. The current hybrid state fixes the packet regression but leaves the security posture implicit.

- Unify caller behavior so `isScopeEnforcementEnabled()` means the same thing across search, checkpoints, and any future governed read paths. Right now checkpoint code bypasses the empty-scope fail-closed rule entirely, which weakens the conceptual value of BUG-001.

- Leave `isGovernanceGuardrailsEnabled()` default-ON unless there is an explicit product decision to make shared-space governance open-by-default. Since `isDefaultOnFlagEnabled()` now effectively serves only that one guardrail wrapper, consider renaming or inlining it so the helper name matches reality.

- Update the surrounding contract surfaces to match the new behavior: the BUG-001 comment, the helper comment above `isDefaultOnFlagEnabled()`, and the telemetry/environment docs that still describe `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` as a default-ON capability.
