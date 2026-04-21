# Iteration 20 - Dimension: security - Subset: 009+012

## Dispatcher
- iteration: 20 of 50
- dispatcher: cli-copilot (model gpt-5.4, effort high, parallel v2)
- timestamp: 2026-04-15T18:27:34Z

## Files Reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/001-playbook-prompt-rewrite/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/002-full-playbook-execution/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/003-playbook-and-remediation/003-deep-review-remediation/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/002-command-graph-consolidation/implementation-summary.md`

## Findings - New This Iteration
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **Broad tool grant normalized in the closeout narrative** — `012-command-graph-consolidation/implementation-summary.md:121,186` records the M14 documentation sweep as a `cli-copilot` run with `--allow-all-tools`. That sits awkwardly against the same packet's security/governance framing, which emphasizes explicit routing and constrained spec-doc governance rather than permissive middleware (`spec.md:53,257-273,517-524`; `decision-record.md:358-367`). This is only a documentation-level concern today, but the closeout text now serves as a reusable operator example and should either justify why blanket access was necessary or document a narrower approved privilege envelope.

## Findings - Confirming / Re-validating Prior
- `009/002-full-playbook-execution` still keeps destructive scenario handling bounded to disposable fixtures and keeps unsupported shell/source/transport flows truthful as `UNAUTOMATABLE` instead of synthetic PASSes (`spec.md:127-146`; `plan.md:51,83-88`; `checklist.md:85-87`; `implementation-summary.md:58-90,104-116`).
- `012-command-graph-consolidation` still keeps the intake lock scoped to Step 1 and keeps the deprecated command/agent deletion surfaces explicitly verified across spec, ADRs, and checklist evidence (`spec.md:98-104,250-273`; `decision-record.md:259-390`; `checklist.md:84-90,140-145,200-205`).

## Traceability Checks
- **core / spec_code — partial**: `009/002` security claims stay aligned across spec/plan/checklist/summary, but `012`'s implementation summary documents a broader delegation privilege model than the packet's governance language suggests.
- **core / checklist_evidence — pass**: `009/002` CHK-030..032 and `012` CHK-041, CHK-068, CHK-071 all map to corroborating packet-local spec/ADR/summary surfaces.
- **overlay / playbook_capability — pass**: `009/002` continues to bound capability claims by classifying shell/source/transport scenarios as `UNAUTOMATABLE`, which matches the packet's documented security posture.
- **overlay / skill_agent — partial**: `012` records the prior P1 governance-route remediation as fixed (`implementation-summary.md:136`), but the same summary still preserves the `--allow-all-tools` delegation note (`implementation-summary.md:121,186`), so the agent-governance story is accurate but not least-privilege.

## Confirmed-Clean Surfaces
- `009/002-full-playbook-execution`: disposable-fixture boundary, no-secret claim, and truthful unsupported-scenario classification remain internally consistent.
- `012-command-graph-consolidation`: Step-1-only intake lock, deleted middleware surfaces, and `/memory:save` handover ownership remain internally consistent at the packet-doc level.

## Next Focus (recommendation)
Review `010+014` for security next, especially delegation privilege narratives and continuity-write governance after middleware cleanup.
