## Iteration 01

### Focus

This opening pass re-anchored the packet against the originating spec, the pt-01 synthesis, and the applied CF-019 closure. The goal was to separate already-closed baseline defects from the still-open fronts that justify a pt-02 packet, so later iterations could focus on new parity, tool-surface, and telemetry evidence instead of rediscovering the same threshold-refresh bug.

### Context Consumed

- `../deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/findings-registry.json`

### Findings

- The originating packet explicitly scopes the remaining investigation to recommendation quality, threshold drift, runtime-brief staleness, cross-runtime cache/render parity, telemetry, and MCP-tool scoping, so packet-02 should concentrate on those surfaces instead of re-opening base hook wiring [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md:56-63].
- CF-019 already fixed the earlier Python scorer bug where threshold decisions froze before graph-conflict penalties and post-normalization, so the old pass/fail-freeze defect is closed context, not an active packet-02 target [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md:6-12] [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md:24-40].
- Pt-01 already localized the main unresolved fronts to OpenCode threshold/cache drift, Codex fast-path divergence, static `laneWeights`, validator scope limits, and telemetry gaps, which gives packet-02 a concrete deeper-reading agenda rather than a blank-slate search [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/research.md:9-20] [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/findings-registry.json:4-150].

### Evidence

> 1. How well does the current advisor recommendation quality correlate with actual skill activation outcomes? Where does it miss?
> 2. Where do threshold / fusion weights, decay, or graph-conflict penalties introduce recommendation drift?
> 3. Which runtime hook surfaces still surface stale or over-verbose advisor briefs? [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md:58-60]

> - Finding summary: Skill-advisor threshold decisions freeze before graph conflict penalties are applied, so conflicting skills can remain marked as passing.
> - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Added a threshold-refresh helper and reran threshold derivation after graph conflict penalties and post-normalization so pass/fail reflects final confidence and uncertainty. [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md:6-12]

> - `F-001` OpenCode uses a lower default threshold (`0.7`) than the shared runtime path (`0.8`), and the native bridge path ignores configured `thresholdConfidence`...
> - `F-003` Codex native-hook mode bypasses the shared brief pipeline...
> - `F-005` Hook telemetry is effectively write-only... [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01/research.md:11-19]

### Negative Knowledge

- The packet does not need to prove CF-019 again; the applied closure already shows the old Python threshold-refresh defect was fixed.
- No evidence yet suggests that the remaining work is another single-scorer correctness bug; the open space looks more like parity, observability, and tool-surface drift.

### New Questions

#### Threshold Drift

- Does packet-02 uncover a second threshold mismatch beyond the pt-01 OpenCode default drift?
- Which runtime branches still apply thresholds differently depending on route?

#### Runtime Parity

- Which runtimes actually use the shared `buildSkillAdvisorBrief()` plus `renderAdvisorBrief()` contract end-to-end?
- Are OpenCode and Codex the only bespoke paths, or do the other runtimes diverge too?

#### MCP And Telemetry

- How asymmetric are the public MCP schemas compared with the docs?
- Where do prompt-safe hook diagnostics go after stderr emission, if anywhere?

### Status

new-territory
