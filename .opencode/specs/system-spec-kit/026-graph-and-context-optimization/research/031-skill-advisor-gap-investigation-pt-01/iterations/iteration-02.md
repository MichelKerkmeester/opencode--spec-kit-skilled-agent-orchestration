# Iteration 02

### Focus

Find downstream docs and playbooks that still describe the pre-helper OpenCode bridge path or the pre-014 threshold wording.

### Search Strategy

- CocoIndex attempt:
  - `HOME=/tmp COCOINDEX_CODE_ROOT_PATH=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ccc search "OpenCode plugin bridge path threshold 0.7 helper relocation skill advisor" --limit 8 --path '.opencode/**'`
  - Result: daemon startup timed out; no usable semantic output.
- Grep patterns:
  - `rg -n '\.opencode/plugins/spec-kit-skill-advisor-bridge\.mjs|thresholdConfidence.:0\.7|threshold is 0\.7' .opencode --glob '!**/dist/**' --glob '!**/z_future/**'`
  - `rg -n 'spec-kit-skill-advisor-bridge\.mjs' .opencode/plugins/README.md .opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md`
- Code-graph traversals:
  - `sqlite3 .../code-graph.sqlite "select distinct file_path from code_nodes where file_path like '%skill-advisor-bridge%'"`
  - `sqlite3 .../code-graph.sqlite "select key, value from code_graph_metadata"`
  - Outcome: verified the graph is current enough for landed-file anchoring, but the bridge drift lived in docs, not in extra code dependents.

### Missed Files Found

| Path | Why It's Relevant | Category | Confidence | Why It Was Missed | Needs Update |
| --- | --- | --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md` | The feature page still says the bridge lives at `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` and that the threshold is `0.7` [`feature_catalog/.../05-opencode-plugin-bridge.md:31-38`]. The live plugin now resolves `../plugin-helpers/spec-kit-skill-advisor-bridge.mjs` [`plugins/spec-kit-skill-advisor.js:37`], and the helper forwards the effective threshold pair through `handleAdvisorRecommend` [`plugin-helpers/spec-kit-skill-advisor-bridge.mjs:193-205`]. | docs | High | Packet 014 updated the hook reference and runtime code, but this feature-catalog leaf remained outside the packet-owned write set. | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md` | The playbook still tells operators to run `node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs` with `thresholdConfidence:0.7` [`manual_testing_playbook/.../005-opencode-plugin-bridge.md:33-50`]. The live plugin helper path and threshold contract now differ, and the compat regression test asserts the 014 threshold pair [`tests/compat/plugin-bridge.vitest.ts:46-50`]. | manual-playbook | High | The verification packet recorded the plugin-bridge test and hook reference, but not the operator playbook that still holds the old command. | Y |

### Already-Covered

- Already in `resource-map.md`: `.opencode/plugins/spec-kit-skill-advisor.js`, `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`, the hook reference, and `tests/compat/plugin-bridge.vitest.ts`.
- Not flagged: `.opencode/plugins/README.md` because it already points helper modules to `.opencode/plugin-helpers/`.

### Status

The OpenCode bridge drift is real and specific: two downstream docs still point at the wrong bridge path and old threshold wording, even though the landed code and focused regression test are already aligned.
