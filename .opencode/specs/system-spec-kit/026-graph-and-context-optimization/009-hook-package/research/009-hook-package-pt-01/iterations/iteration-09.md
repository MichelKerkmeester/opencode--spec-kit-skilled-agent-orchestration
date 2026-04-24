## Iteration 09

### Focus
Compare the OpenCode/plugin surface to the CLI surfaces to see whether the drift is in shared advisor code or in runtime-specific/operator-specific layers.

### Findings
- The OpenCode skill-advisor plugin already carries bounded prompt size, bounded brief size, cache TTL, per-session cache keys, and source-signature invalidation in one place. Evidence: `.opencode/plugins/spec-kit-skill-advisor.js:26`, `.opencode/plugins/spec-kit-skill-advisor.js:27`, `.opencode/plugins/spec-kit-skill-advisor.js:29`, `.opencode/plugins/spec-kit-skill-advisor.js:33`, `.opencode/plugins/spec-kit-skill-advisor.js:91`, `.opencode/plugins/spec-kit-skill-advisor.js:157`
- The plugin also honors the shared disable flag and a legacy alias, which is the kind of explicit operator contract missing from some CLI readiness paths. Evidence: `.opencode/plugins/spec-kit-skill-advisor.js:35`, `.opencode/plugins/spec-kit-skill-advisor.js:58`, `.opencode/plugins/spec-kit-skill-advisor.js:62`
- Packet 012's docs remediation that described OpenCode as plugin-bridge based is consistent with the checked-in code: the plugin is ESM, uses a bridge helper, and does not rely on shell wrapper hooks. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/012-docs-impact-remediation/implementation-summary.md:67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/012-docs-impact-remediation/implementation-summary.md:72`, `.opencode/plugins/spec-kit-skill-advisor.js:8`, `.opencode/plugins/spec-kit-skill-advisor.js:37`, `.opencode/plugins/spec-kit-compact-code-graph.js:9`, `.opencode/plugins/spec-kit-compact-code-graph.js:13`
- That contrast matters: the advisor core and the OpenCode bridge look aligned; the visible residual drift is concentrated in runtime-specific activation and readiness surfaces for Codex, Copilot, and Gemini rather than in the shared scorer/brief producer itself. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:41`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:43`, `.opencode/plugins/spec-kit-skill-advisor.js:4`, `.opencode/plugins/spec-kit-skill-advisor.js:37`

### New Questions
- Can the CLI runtimes reuse more of the plugin's explicit activation/disable contract to avoid the current operator-surface divergence?
- Should the docs distinguish "shared advisor core parity" from "runtime activation parity" more explicitly?
- Is there a common runtime-contract module that could own readiness checks for Codex, Copilot, and Gemini instead of duplicating local heuristics?
- Which of the remaining issues are safe to fix purely in detection/docs/tests without touching the shared advisor core?

### Status
converging
