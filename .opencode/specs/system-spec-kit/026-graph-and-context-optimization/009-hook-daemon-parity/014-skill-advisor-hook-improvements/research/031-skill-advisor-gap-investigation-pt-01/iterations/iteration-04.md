# Iteration 04

### Focus

Run the setup/readme-family cross-check, verify exclusions against packet-owned files, and close on a deduplicated missed-files set.

### Search Strategy

- Grep patterns:
  - `rg -n "OpenCode \\| .*spec-kit-skill-advisor-bridge|plugin-helpers/spec-kit-skill-advisor-bridge|spec-kit-skill-advisor-bridge\\.mjs" .opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md .opencode/skill/system-spec-kit/mcp_server/skill-advisor/INSTALL_GUIDE.md .opencode/README.md .opencode/plugins/README.md`
  - `rg -n "workspaceRoot|effectiveThresholds|AdvisorRecommendOutputSchema" .opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- Code-graph traversals:
  - Reused the local graph metadata and landed-file-set path scans to confirm no new unlisted runtime files sat between the plugin entrypoint and helper.
- Exclusion check:
  - Compared candidate files against `resource-map.md`.
  - Compared candidate intent against packet `tasks.md` target lists because `applied/T-###.md` artifacts are referenced by checklist/resource-map but absent on disk.

### Missed Files Found

| Path | Why It's Relevant | Category | Confidence | Why It Was Missed | Needs Update |
| --- | --- | --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md` | The runtime matrix still describes OpenCode as `.opencode/plugins/spec-kit-skill-advisor.js` plus bare `spec-kit-skill-advisor-bridge.mjs` [`SET-UP_GUIDE.md:111-117`], while the actual plugin resolves the helper under `.opencode/plugin-helpers/` [`plugins/spec-kit-skill-advisor.js:37`]. This is a lighter doc drift than the feature catalog/playbook, but it is still an operator-facing stale reference outside the resource map. | docs | Medium | Packet 014 updated the narrow hook reference, not the broader setup guide family. | Maybe |

### Already-Covered

- `.opencode/plugins/README.md` is already correct and explicitly separates plugin entrypoints from helper modules.
- `.opencode/install_guides/SET-UP - AGENTS.md` examples still execute valid tool calls; they are incomplete relative to the richer 014 outputs but not concretely wrong enough to flag as a missed update.
- Historical packet specs/reviews still mention the old bridge path, but those are archival evidence, not current operator surfaces.

### Status

Coverage saturated. New hits after this pass were either archival references or files already covered by the packet resource map. The deduped missed-files set stabilized at 8 findings: 6 update-now docs/playbook gaps and 2 medium-confidence follow-ups.
