## Dimension: maintainability

## Files Reviewed (path:line list)

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:82-102`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:117-147`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:153-168`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:233-278`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:81-104`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:128-152`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md:158-175`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md:79-112`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md:117-153`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:5-51`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-65`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:140-166`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1-24`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1292-1305`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:586-593`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293-303`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:180-234`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:159-172`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562-576`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:489-496`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:258-264`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:70-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:151-181`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:92-98`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:170-176`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:50-87`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-001.md:52-68`

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R2-I2-P2-001: README topology omits the scope policy module that now owns the include-skills contract

The public code-graph README and the lib README document package topology and key files, but neither names `lib/index-scope-policy.ts`. That module is now the central owner for `SPECKIT_CODE_GRAPH_INDEX_SKILLS`, per-call `includeSkills` precedence, scope labels, fingerprints and default skill exclude globs. The behavior prose in the scan-scope section is accurate, but the scaffolded topology/key-file sections leave maintainers without a documented owner for the new 009 policy surface.

Evidence:

- `code_graph/README.md:84-93` lists package topology and only summarizes `lib/` generically.
- `code_graph/README.md:133-140` lists representative lib files but omits `index-scope-policy.ts`.
- `code_graph/README.md:156-167` lists key files but omits the scope policy owner.
- `code_graph/lib/README.md:84-104` lists the lib topology without `index-scope-policy.ts`.
- `code_graph/lib/README.md:161-174` lists key lib files without `index-scope-policy.ts`.
- `index-scope-policy.ts:5-18` exports the env var name, scope metadata keys, skill exclude glob and policy type.
- `index-scope-policy.ts:30-51` resolves env/per-call precedence, fingerprints, labels and excluded skill globs.
- `indexer-types.ts:140-166` consumes that policy to build default indexer config.
- `scan.ts:233-234` resolves the per-call policy and passes it into `getDefaultConfig()`.

Severity: P2. This is documentation topology drift, not a behavior failure: the scan-scope README prose and env reference correctly describe default exclusion, env opt-in, per-call override and full-scan migration.

Suggested remediation: add `lib/index-scope-policy.ts` to the code graph README's key-file/topology sections and to `code_graph/lib/README.md` with a short responsibility line such as "Resolves scan scope policy, env/per-call precedence, scope labels and fingerprints."

## Traceability Checks

- `spec_code`: PASS. The code still matches the packet's default end-user scope contract: `resolveIndexScopePolicy()` gives per-call booleans precedence over env (`index-scope-policy.ts:30-39`), `getDefaultConfig()` applies skill excludes only when skills are not included (`indexer-types.ts:145-157`), and `scan.ts:233-234` passes the resolved policy into the indexer config.
- `checklist_evidence`: PASS. CHK-042 and CHK-141 are substantively satisfied because the README scan-scope prose, env reference row, tool schema and Zod schema document or validate `includeSkills` (`code_graph/README.md:250-278`, `ENV_REFERENCE.md:260-262`, `tool-schemas.ts:568-573`, `tool-input-schemas.ts:489-496`). The new P2 is limited to topology/key-file scaffolding.
- `skill_agent`: PASS. The review stayed within the LEAF iteration constraint and wrote findings to review artifacts only. No sub-agent dispatch was used.
- `feature_catalog_code`: PASS. No feature-catalog claim was found to contradict this packet's scope behavior during this maintainability pass. Readiness/status still surface scope mismatch through the existing full-scan recovery path (`ensure-ready.ts:293-303`, `status.ts:168-172`).
- `adr_precedence_cross_reference`: PASS with note. ADR-001's original sub-decision table ends at migration/default-scope choices (`decision-record.md:70-80`); the FIX-009 precedence refinement is captured as ADR-002 and explicitly relates back to ADR-001 (`decision-record.md:151-181`).

## Run-1 Regression Check

- PASS - R1-P1-001 precedence: re-verified that `includeSkills:false` overrides an env opt-in via `perCallProvided ? input.includeSkills === true : envIncludesSkills` (`index-scope-policy.ts:30-39`), and the README/env docs describe per-call precedence (`code_graph/README.md:262-264`, `ENV_REFERENCE.md:260-262`).
- PASS - R3-P1-001 symlink rootDir bypass: re-verified `scan.ts` canonicalizes the resolved root before `getDefaultConfig()` (`scan.ts:201-234`), and README symlink semantics match that path (`code_graph/README.md:266-270`).
- PASS - R1-P2-001/R2-P2-001/R4-P2-002 resource-map drift: re-verified `resource-map.md:50-87` now lists `index-scope-policy.ts`, README/env docs, and the FIX-009 doc updates.
- PASS - R4-P2-001 absolute path leakage: re-verified `relativize()` and warning rewriting are present (`scan.ts:180-194`), so this maintainability pass found no regression of the closed error-message finding.

## Verdict - PASS

No P0/P1 findings. One new P2 documentation-topology advisory was recorded.

## Next Dimension

Maintainability, iteration 3: focus on readability and maintainability of status/readiness scope-mismatch plumbing, including whether the scope labels and blocked-payload wording stay consistent across scan, status, ensure-ready and tests.
