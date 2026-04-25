# 009 Impact Analysis — 08 (008-skill-advisor-plugin-hardening)

## Sub-packet Summary
- Sub-packet: `008-skill-advisor-plugin-hardening`
- Spec docs read:
  - `008-skill-advisor-plugin-hardening/spec.md` (depth 1)
  - `008-skill-advisor-plugin-hardening/plan.md` (depth 1)
  - `008-skill-advisor-plugin-hardening/tasks.md` (depth 1)
  - `008-skill-advisor-plugin-hardening/implementation-summary.md` (depth 1)
  - `008-skill-advisor-plugin-hardening/checklist.md` (depth 1)
- Work performed:
  - Hardened `.opencode/plugins/spec-kit-skill-advisor.js` by moving mutable runtime state from module globals into per-instance closure state.
  - Added `state.inFlight` request dedup so concurrent identical prompts share one bridge subprocess.
  - Added bounded payload/cache policy: prompt clamp, advisor-brief clamp, cache-entry cap, and insertion-order LRU eviction.
  - Added configurable plugin options `maxPromptBytes`, `maxBriefChars`, and `maxCacheEntries`.
  - Preserved per-instance status/metric invariants and expanded focused Vitest coverage from 23 to 30 tests.
  - Explicitly did not change the bridge subprocess protocol, overall plugin API shape, or non-advisor plugins/MCP server surfaces.
- Key surfaces touched: advisor, renderer, plugin bridge, cache policy, runtime state, status metrics

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Skill | The audited architecture doc is the only listed external file that directly documents the OpenCode skill-advisor plugin bridge. Packet 008 added bridge-level guarantees that are now part of the operational contract at that surface: per-instance state isolation, in-flight identical-request dedup, and bounded prompt/brief/cache behavior. The current subsection still describes delegation order only. | MED | Extend the "OpenCode plugin bridge" subsection with one short paragraph covering per-instance state, in-flight dedup, and cap/eviction guarantees. |

## Files Not Requiring Updates (from audit)
- README, Document, and Command entries in the audit are focused on memory/spec workflows, template operations, or general runtime setup; packet 008 did not change those surfaces.
- Agent docs and the large majority of Skill entries are about memory retrieval, code-graph, validation, templates, or playbook execution rather than the OpenCode skill-advisor plugin bridge internals changed here.
- `AGENTS.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/references/config/hook_system.md`, `.opencode/skill/system-spec-kit/references/workflows/execution_methods.md`, `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, and `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` remain materially correct because packet 008 did not change gate policy, command wiring, lifecycle-hook parity, or startup recovery behavior.

## Evidence
No HIGH-severity rows were identified.

Supporting evidence for the MED row:
- Source spec doc: `008-skill-advisor-plugin-hardening/spec.md:77-81,97-99,124-143,177-180` defines the new guarantees as per-instance state, in-flight dedup, prompt/brief caps, cache-entry caps, and configurable overrides.
- Source implementation summary: `008-skill-advisor-plugin-hardening/implementation-summary.md:48-53,73-76,99-100` confirms those guarantees shipped in the OpenCode bridge plugin.
- Target file section: `.opencode/skill/system-spec-kit/ARCHITECTURE.md:346-360` is the audited external subsection that documents the OpenCode skill-advisor plugin bridge but currently stops at delegation order.

## Uncertainty
- NEEDS VERIFICATION: the audit file at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/path-references-audit.md:1-8` is stale or mislabeled. Its title and scope point to `005-release-cleanup-playbooks`, not `009-hook-parity`, so the audited universe may be incomplete for this phase.
- NEEDS VERIFICATION: hook-reference docs that look like natural targets for packet 008, especially `references/hooks/*skill-advisor*`, do not appear in the audit inventory and therefore could not be listed in the table above even though they are plausible follow-up documentation surfaces.
