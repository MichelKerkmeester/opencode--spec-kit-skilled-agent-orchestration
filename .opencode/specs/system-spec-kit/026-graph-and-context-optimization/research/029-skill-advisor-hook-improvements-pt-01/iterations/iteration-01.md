## Iteration 01

### Focus
Baseline packet scope, already-closed work, and the remaining advisor/hook surfaces that still matter for net-new findings.

### Findings
- The packet explicitly scopes recommendation quality, threshold drift, cross-runtime brief parity, telemetry/feedback, and MCP tool-surface behavior; implementation is out of scope for this phase. Citation: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md:31`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md:40`.
- CF-019 already closed the Python-path bug where threshold pass/fail froze before graph-conflict penalties and post-normalization; this packet should not re-flag that issue. Citation: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md:4`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-019.md:12`.
- The shipped hook surface claims four-runtime parity and a stable brief contract, so net-new gaps are most likely in parity drift after landing rather than missing baseline wiring. Citation: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/implementation-summary.md:24`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/implementation-summary.md:54`.
- Active investigation surfaces still span native handlers, shared brief/cache/render code, per-runtime hooks, the OpenCode plugin bridge, and the operator docs. Citation: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md:59`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md:69`.

### New Questions
- Are threshold defaults and pass/fail semantics still identical across native MCP, Python shim, Codex, Copilot, Gemini, Claude, and OpenCode?
- Do all caches invalidate from advisor freshness/generation changes, or only from code changes in the hook layer?
- Which telemetry surfaces are declared but not connected to a durable sink or feedback loop?
- Does `advisor_validate` measure runtime-hook parity, or only scorer quality?

### Status
new-territory
