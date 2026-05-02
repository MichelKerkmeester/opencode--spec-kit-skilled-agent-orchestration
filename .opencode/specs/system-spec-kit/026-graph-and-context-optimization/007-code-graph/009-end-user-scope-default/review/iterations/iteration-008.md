## Dimension: traceability

## Files Reviewed (path:line list)

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md:23-41`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json:6-72`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-001.md:81`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-002.md:71-77`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-003.md:62`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-007.md:32-83`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md:58-87`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:70-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md:151-181`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md:482-491`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md:82-84`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md:226-232`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:30-50`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:179-193`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:221-234`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:343`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:260-299`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:280-308`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md:262-268`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:260-261`

## Findings by Severity

### P0

#### R2-I8-P0-001 — REGRESSION: R1-P2-001/R2-P2-001/R4-P2-002 resource-map §2 no longer matches the required `main~1..HEAD` in-scope diff

- **Claim:** Iteration 8's traceability contract required `<packet>/resource-map.md` §2 to match `git diff --name-only main~1..HEAD` for the in-scope files. The required diff currently has no entries matching the in-scope mcp_server implementation/docs/test paths, while §2 still lists 24 modified paths, including scope implementation files, test files, support README files, and tool schema files. That is the same class of resource-map drift closed in run 1, so it is escalated as a regression per this run's rules.
- **EvidenceRefs:** [`resource-map.md:58-87`, `checklist.md:231`]
- **Command evidence:** From repo root, `git diff --name-only main~1..HEAD | rg '<in-scope mcp_server path filter>'` returned no output; `git log --oneline -3` shows HEAD at `319af26519 docs: refresh resource-map.md across 5 packets with full added/updated inventory`, not the FIX-009 commit.
- **CounterevidenceSought:** Checked whether the diff range had any 009 packet or in-scope `mcp_server` graph/scope entries; none were present. Checked whether §2 was framed as something other than the current implementation diff; it explicitly says it matches the current implementation diff.
- **AlternativeExplanation:** The repository HEAD may have advanced after FIX-009, so `main~1..HEAD` may no longer identify the remediation commit. If the workflow pins the review diff to `79e97aec9` or another fixed range instead of the requested `main~1..HEAD`, downgrade this to a non-blocking traceability/process mismatch.
- **FinalSeverity:** P0 under the run-1 regression escalation rule.
- **Confidence:** 0.82.
- **DowngradeTrigger:** Provide the canonical FIX-009 diff range and show §2 exactly matches that range's in-scope files, or update the traceability contract to stop using moving `main~1..HEAD`.

### P1

None.

### P2

#### R2-I8-P2-001 — ADR-001 still has five sub-decisions; precedence is only recorded in ADR-002

- **Claim:** The traceability contract says ADR-001 should now list six sub-decisions with precedence added. ADR-001's table still has only five rows: default behavior, env opt-in, per-call field, default exclude list, and migration model. The precedence rule exists in ADR-002 instead, so the decision is documented but not in the requested ADR-001 sub-decision surface.
- **EvidenceRefs:** [`decision-record.md:70-80`, `decision-record.md:151-181`]
- **Severity rationale:** Documentation traceability gap only; the code and ADR-002 still express the precedence rule.

#### R2-I8-P2-002 — Remediation summary names six fixes but does not provide file:line evidence

- **Claim:** The traceability contract says `implementation-summary.md` "Remediation" should cross-reference the six fixes with file:line evidence. The subsection is a single prose paragraph naming the fix classes and files, but it does not enumerate all six findings and does not include file:line references.
- **EvidenceRefs:** [`implementation-summary.md:82-84`]
- **Severity rationale:** Non-blocking documentation evidence gap; checklist and tests provide some adjacent evidence, but the requested remediation subsection does not.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| Resource-map §2 matches `git diff --name-only main~1..HEAD` for in-scope files | FAIL | `resource-map.md:58-87` lists modified paths; required in-scope diff command returned no entries. |
| ADR-001 lists six sub-decisions with precedence added | FAIL | ADR-001 has five rows at `decision-record.md:74-78`; precedence is in ADR-002 at `decision-record.md:168-175`. |
| Plan Open Decisions table shows six RESOLVED decisions with the updated header | PASS | `plan.md:482-491` has six rows and each status is `RESOLVED`. |
| Implementation summary Remediation cross-references six fixes with file:line evidence | FAIL | `implementation-summary.md:82-84` is prose only and has no file:line evidence. |
| Checklist Remediation gates are marked `[x]` with evidence | PASS | `checklist.md:226-232` has five checked remediation gates with evidence text. |
| README precedence text matches ENV reference and ADR text | PASS | `README.md:262-264`, `ENV_REFERENCE.md:260-261`, and `decision-record.md:168-175` consistently say per-call `includeSkills` overrides env when provided. |

## Run-1 Regression Check

- PASS — R1-P1-001 precedence behavior: `index-scope-policy.ts:30-50`, `code-graph-indexer.vitest.ts:292-299`, and `code-graph-scan.vitest.ts:280-308` verify boolean `includeSkills` overrides env. The ADR-001 placement issue is traceability-only and not a behavior regression.
- PASS — R3-P1-001 symlink rootDir bypass: `scan.ts:221-234` passes the canonical root into `getDefaultConfig()`, and `README.md:266-268` documents realpath canonicalization before the skill exclusion guard.
- FAIL — R1-P2-001/R2-P2-001/R4-P2-002 resource-map drift: §2 does not match the required moving `main~1..HEAD` in-scope diff, recorded as R2-I8-P0-001.
- CARRIED FORWARD — R4-P2-001 absolute path redaction: iteration 7 already recorded `R2-I7-P0-001` for `data.errors` absolute path exposure. This iteration re-checked the documented root/warning redaction surfaces at `scan.ts:179-193`, `scan.ts:221-227`, and `scan.ts:343`, but did not duplicate the prior run-2 finding.

## Verdict — FAIL

FAIL — one new run-1 resource-map drift regression was confirmed under the requested diff-range check, and two additional P2 traceability gaps remain.

## Next Dimension

Iteration 9 should return to correctness and specifically distinguish behavior regressions from moving-diff traceability drift so the resource-map finding can be downgraded if the canonical remediation diff range is clarified.
