## Iteration 07

### Focus
Telemetry and measurement boundary: what the current compliance signals can and cannot prove about live smart-router behavior.

### Findings
- Earlier smart-router efficacy research explicitly concluded that no runtime enforcement mechanism had been found and recommended starting with observe-only telemetry. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/research/research.md:67-76`
- The remediation spec preserved that boundary by making telemetry observe-only and placing enforcement out of scope. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:94-99`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/spec.md:109-113`
- The telemetry classifier returns `unknown_unparsed` when allowed resources are unknown and `missing_expected` when no actual reads are observed, so the compliance stream depends on real read capture to mean anything stronger. Evidence: `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts:166-210`
- The static measurement harness explicitly says it does not observe live AI file reads, and its tests verify that static compliance records go to a separate stream while the live telemetry stream remains untouched. Evidence: `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:5-7`, `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:104-108`, `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:149-167`

### New Questions
- Which runtime adapters are actually wired to `live-session-wrapper.ts` today?
- How much of the current compliance dataset is static `unknown_unparsed` noise versus live observed reads?
- Can routing correctness regressions be hidden because telemetry is measuring only the predicted route, not actual skill-resource usage?
- Should future dashboards separate static-prediction accuracy from live compliance with stronger labeling?

### Status
converging
