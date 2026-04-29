## Packet 045/007: deep-loop-workflow-integrity — Deep-review angle 7 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/` (entire dir)
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/coverage-graph.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/prompt-pack.ts`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_{auto,confirm}.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_{auto,confirm}.yaml`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-research/references/{loop_protocol,convergence,state_format,spec_check_protocol}.md`

### Audit dimensions + workflow-specific questions

For correctness: convergence-detection logic (rolling avg + MAD + question entropy + graph-assisted vote) produces honest stop decisions; lineage continuation (parentSessionId/lineageMode) preserves state; the reducer correctly merges JSONL deltas into findings registry.

For security: prompt-pack rendering doesn't leak credentials; executor-audit captures provenance for every dispatch.

For traceability: every iteration writes a JSONL record with required fields; state log is append-only; synthesis_complete event fires honestly with the right stopReason.

For maintainability: deep-research and deep-review YAMLs share patterns where applicable; convergence-vote logic is testable.

### Specific questions

- Does the inline 3-signal vote correctly fall back when fewer than 3 iterations have completed?
- Does `step_graph_convergence` correctly veto premature inline STOP when blockers are present?
- Lineage modes: `new` / `resume` / `restart` are live; `fork` and `completed-continue` are deferred. Does the workflow honor that?
- Post-dispatch validation: are all 10 failure_reasons enumerated in the YAML reachable in code? Any orphan failure modes?
- Does the prompt-pack rendering correctly substitute variables, especially `{state_paths.*}` and `{config.lineage.*}`?
- For each failure_mode (malformed_delta / missing_iteration_file / schema_mismatch), what's the recovery path?
- Convergence threshold defaults: 0.05 (research) vs 0.10 (review) — is this the right calibration?

### Read also

- 028 deep-review skill contract fixes
- 037/005 + 038 stress-test folder migration (any path refs in deep-loop YAMLs)
- 022 + 027 + 013 + 045 example deep-research/review packets for actual usage

### Output

Same 9-section review-report.md format. Severity rubric: P0=runaway loops / silent false-convergence / lost iteration evidence, P1=workflow contract drift, P2=ergonomics.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent.

**Trigger phrases**: `["045-007-deep-loop-workflow-integrity","deep-loop audit","convergence detection review","JSONL state log integrity"]`.

**Causal summary**: `"Deep-review angle 7: deep-research/review workflow integrity — convergence detection, JSONL state integrity, lineage continuation, reducer correctness, prompt-pack rendering."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
