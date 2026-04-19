# Iteration 16: Tests, Validators, and Playbooks Needed for Rollout

## Focus
This iteration answers Q19 by identifying which current verification surfaces need extension if Public adopts graph-first routing and evidence-tagged retrieval. The goal is to keep verification architecture-native: extend what already exists rather than inventing a detached test harness.

## Findings

### Finding 53
Public already has a routing-focused manual playbook. `255-cocoindex-code-graph-routing.md` explicitly tests semantic versus structural routing, seed resolution, and context-mode behavior. That makes it the right base document for graph-first routing verification. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35]

### Finding 54
The provenance feature catalog already points at formatter, types, and test surfaces for graph evidence. That means graphify-style provenance tiers can be verified through existing provenance-envelope tests instead of a new bespoke test family. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:28-36]

### Finding 55
Bootstrap and resume already expose structured payload contracts, graph ops, and hints. Any rollout of graph-first steering should therefore add contract tests around those existing fields rather than only asserting user-visible text. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-217; .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:155-213]

### Finding 56
`response-hints.ts` already records measurable metadata like `latency`, `tokenCount`, and `surfaced_at`. That gives Public a ready-made verification hook for checking whether graph-first nudges are firing at the right times and at acceptable token cost. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133]

## Cross-Phase Overlap Handling
- This iteration stayed on verification surfaces, not implementation details.
- It did not reopen phase 024 runtime behavior except where those files already define the payloads to be tested.

## Exhausted / Ruled-Out Directions
- I looked for a need to build a separate graph-first QA framework and ruled it out. The current manual playbook, provenance contract tests, bootstrap/resume payload tests, and response-hints metadata already provide the right scaffolding. [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35; .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:28-36]

## Final Verdict on Q19
Public should validate graph-first routing and provenance-tagged retrieval by extending four existing surfaces: the routing manual playbook, provenance-envelope tests, bootstrap/resume payload contract tests, and response-hints metadata assertions. No separate validation subsystem is necessary.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-35`
- `.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/20-result-provenance.md:28-36`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154-217`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:155-213`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-133`
