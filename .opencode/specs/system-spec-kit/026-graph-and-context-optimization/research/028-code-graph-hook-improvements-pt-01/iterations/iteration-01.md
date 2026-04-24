## Iteration 01
### Focus
Baseline scope calibration, closure guardrails, and packet breadcrumb accuracy.

### Findings
- The packet spec still points readers to `../006-integrity-parity-closure/`, while the applied closure reports actually live under `007-deep-review-remediation/006-integrity-parity-closure/`, so the research packet begins with stale breadcrumbing before code review even starts [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md:40,48,93].
- The already-closed findings cover staged persistence (`CF-009`), shared detector-provenance mapping (`CF-010`), and child-packet artifact rooting (`CF-014`), so net-new work needs to concentrate on scope safety, freshness invalidation, and downstream signal loss rather than reopening those remediated lanes [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md:3-16; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md:3-27; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md:3-17].
- The packet purpose explicitly asks for under-used signals, observability, and cross-runtime enrichment, which makes status/startup/hook adapter surfaces valid investigation targets even when the core graph storage layer itself is out of rewrite scope [.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md:54-61,69-74].

### New Questions
- Which current scan paths can still corrupt or silently narrow graph coverage after the CF-009 persistence fix?
- Which read/status surfaces still bypass the post-CF-010 trust/provenance contract?
- Which runtime startup adapters consume only text even when structured graph payload already exists?
- Is there any packet-local test coverage for partial-root scans or debounce invalidation?

### Status
new-territory
