## Dimension: correctness

Iteration 9 reviewed the cross-cutting scope interaction matrix after FIX-009: env opt-in plus explicit `includeSkills:false`, symlinked roots, scan-to-walker policy propagation, stored scope fingerprint behavior, and status payload consistency. The scan and walker path preserves the FIX-009 precedence and symlink fixes, but the status surface cannot evaluate the same per-call scope that scan just used.

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:23-41`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:6-78`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-004.md:41-54`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-005.md:36-48`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-008.md:30-83`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md:119-128`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:162-194`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:162-181`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:226-232`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:64-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:58-87`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-50`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:56-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1390-1448`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1451-1489`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:242-252`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-304`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:197-235`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:328-380`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:159-173`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:258-295`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562-604`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:488-496`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:680-749`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:257-359`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:253-346`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts:63-107`
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:534-632`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:250-272`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:258-262`

## Findings by Severity

### P0

None.

### P1

#### R2-I9-P1-001: `code_graph_status` cannot evaluate the per-call scan scope and reports env-only active scope after one-off overrides

- claim: FIX-009 makes `code_graph_scan({ includeSkills:false })` override `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` for a one-off end-user-only scan, and scan persists the excluded fingerprint. `code_graph_status`, however, accepts no `includeSkills` argument and computes `activeScope` with `resolveIndexScopePolicy()` using only process env. In an env-enabled maintainer process, status therefore reports `activeScope.includeSkills:true` and `scopeMismatch:true` immediately after a successful one-off `includeSkills:false` full scan, even though the operator is trying to inspect that per-call end-user scope. This is an emergent scan/status contract gap, not a scan-path precedence regression.
- evidenceRefs:
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:233-235`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:311-312`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:159-173`
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:268-275`
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:600-604`
  - `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:683-685`
  - `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:746-748`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:168-180`
- counterevidenceSought: I verified the production scan path does pass the resolved policy into `getDefaultConfig()` and stores that same policy fingerprint after scan. I also checked the strict schemas and tool definition for `code_graph_status`; both explicitly expose an empty input surface, and the only status test coverage accepts `{}` and rejects unexpected parameters rather than exercising an `includeSkills` override. Existing scan tests cover the one-off override through `indexFiles()` and `setCodeGraphScope()`, but they do not call status after that scan under env-enabled conditions.
- alternativeExplanation: One could define `code_graph_status` as reporting only the ambient process default rather than the last scan call's requested scope. That does not satisfy this run's cross-cutting status check, and it makes the documented "one-off" override hard to verify from the status payload while env remains enabled.
- finalSeverity: P1
- confidence: 0.86
- downgradeTrigger: Downgrade to P2 if the contract is explicitly narrowed so `includeSkills:false` is scan-only and status/readiness are expected to report only the process-wide env scope, with documentation telling maintainers to unset the env var before checking one-off end-user scans.

### P2

None.

## Traceability Checks

- spec_code: CONDITIONAL. The scan/walker code still matches the spec and ADR-002 for default exclusion, env opt-in, explicit per-call override, and symlink canonicalization. The status surface does not expose the same override input, so the cross-surface behavior is inconsistent for one-off end-user scans in env-enabled processes.
- checklist_evidence: CONDITIONAL. CHK-G-NEW-01 is supported for scan/indexer precedence, but CHK-G2-05's status evidence is incomplete for the per-call override interaction because `code_graph_status` accepts no scope input and no status test checks active/stored scope after an override scan.
- skill_agent: PASS. This iteration stayed LEAF-only, reviewed read-only target files and traceability docs, and wrote findings under the approved review packet.
- feature_catalog_code: PASS. No issue was found in the core skill-index path deny-by-default semantics, canonicalized root handling, or strict scan schema.
- scope_fingerprint_matrix: CARRIED FORWARD. Iteration 5 already recorded `R2-I5-P1-001` for incomplete six-case test coverage; this iteration did not duplicate it. Production fingerprints remain a two-value function of `includeSkills`, with source metadata reflecting default/env/scan-argument in the reviewed code.

## Run-1 Regression Check (state which closed finding(s) you re-verified, with PASS/FAIL)

- PASS -- R1-P1-001 precedence fix: `resolveIndexScopePolicy()` uses a boolean-presence check, so `includeSkills:false` still overrides an env opt-in in scan and reaches `getDefaultConfig()`.
- PASS -- R3-P1-001 symlink rootDir bypass: `scan.ts` canonicalizes `rootDir` before config creation, and the structural walker applies `shouldIndexForCodeGraph()` with the carried policy during directory descent and specific-file collection.
- PASS -- R1-P2-001/R2-P2-001/R4-P2-002 resource-map remediation was not re-flagged here; the prior run-2 traceability finding remains separate and was not duplicated in this correctness pass.
- CARRIED FORWARD -- R4-P2-001 absolute path redaction: iteration 7 already recorded the remaining `data.errors` exposure variant, so this iteration did not duplicate that prior run-2 finding.

## Verdict -- FAIL

FAIL -- the run remains release-blocked by prior P0s, and this iteration adds one new P1 cross-surface correctness gap for status scope reporting after per-call scan overrides.

## Next Dimension

Security.
