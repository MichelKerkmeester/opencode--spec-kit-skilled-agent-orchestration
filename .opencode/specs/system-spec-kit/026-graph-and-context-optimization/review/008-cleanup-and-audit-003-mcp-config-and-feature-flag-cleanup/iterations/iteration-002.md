# Review Iteration 002 (Batch 002/010): Security - Local path leakage and cross-runtime config consistency

## Focus

Check whether any of the five checked-in MCP surfaces still leak local machine state or overclaim cross-runtime config parity.

## Scope

- Review target: Phase 012 packet, `implementation-summary.md`, and the five checked-in MCP configs
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:59] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:116] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/implementation-summary.md:41]
- Dimension: security

## Scorecard

| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `012/spec.md` | 8 | 7 | 8 | 8 |
| `012/implementation-summary.md` | 8 | 7 | 7 | 8 |
| `.mcp.json` | 9 | 8 | 8 | 8 |
| `.claude/mcp.json` | 9 | 8 | 8 | 8 |
| `.vscode/mcp.json` | 9 | 8 | 8 | 8 |
| `.gemini/settings.json` | 6 | 4 | 5 | 5 |
| `opencode.json` | 9 | 8 | 8 | 8 |

## Findings

### P1-001: Gemini MCP config still hardcodes a local absolute workspace path
- Dimension: security
- Evidence: Phase 012 says the five checked-in Public configs should be aligned and records the closeout as one identical minimal env block across those surfaces [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:59] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:116] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/implementation-summary.md:41]. Four checked-in surfaces keep the memory server repo-relative or do not add a host-specific `cwd` [SOURCE: .mcp.json:16] [SOURCE: .claude/mcp.json:15] [SOURCE: .vscode/mcp.json:16] [SOURCE: opencode.json:25], but `.gemini/settings.json` still checks in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` as the server `cwd` [SOURCE: .gemini/settings.json:31].
- Impact: The shipped config surface still leaks local filesystem layout and is not actually parity-clean across runtimes, so the packet overstates the cleanup.
- Skeptic: Gemini may require an absolute `cwd` while the other runtimes tolerate relative resolution.
- Referee: No equivalent requirement is documented in the packet, and the other checked-in surfaces already express the same server target without a machine-specific absolute path. In the absence of a documented Gemini-only requirement, the checked-in absolute path is release-relevant drift rather than harmless tooling noise.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Phase 012 still ships a checked-in machine-specific path in the Gemini MCP surface even though the packet describes the five Public configs as aligned and clean.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:47",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:59",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:116",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/implementation-summary.md:41",".gemini/settings.json:31",".mcp.json:16",".claude/mcp.json:15",".vscode/mcp.json:16","opencode.json:25"],"counterevidenceSought":"Looked for a packet note or a mirrored absolute-path requirement in the other checked-in runtime configs.","alternativeExplanation":"Gemini might need absolute cwd resolution, but the current packet does not document that constraint and the other shipped configs already avoid it.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if a Gemini-specific runtime contract is documented nearby and explicitly requires a checked-in absolute workspace cwd."}
```

## Cross-Reference Results

### Core Protocols
- Confirmed: the packet correctly narrows scope to the five Public configs and no broader fanout surface [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:59].
- Contradictions: the packet and summary describe an identical/clean cross-runtime config posture that the current Gemini surface still breaks [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/checklist.md:53] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/implementation-summary.md:41].
- Unknowns: whether the absolute path was left intentionally for a local-only Gemini quirk.

### Overlay Protocols
- Not applicable in this slice.

## Ruled Out

- Reintroduced checked-in feature flags in the reviewed config env blocks: ruled out.
- Reintroduced `MEMORY_DB_PATH` in the reviewed config surfaces: ruled out.

## Sources Reviewed

- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:47]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:59]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/spec.md:116]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/checklist.md:53]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/012-mcp-config-and-feature-flag-cleanup/implementation-summary.md:41]
- [SOURCE: .gemini/settings.json:31]
- [SOURCE: .mcp.json:16]
- [SOURCE: .claude/mcp.json:15]
- [SOURCE: .vscode/mcp.json:16]
- [SOURCE: opencode.json:25]

## Assessment

- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The second pass identified a checked-in host-specific path that the packet's earlier parity-focused sweeps do not acknowledge.
- Dimensions addressed: security, maintainability

## Reflection

- What worked: Comparing non-env fields after the env-block sweep surfaced the remaining parity defect quickly.
- What did not work: The packet's "identical env block" phrasing risks hiding broader config drift if reviewed too literally.
- Next adjustment: Verify the runtime-default files so the remaining finding stays tightly scoped to checked-in config parity rather than drifting into code behavior claims.
