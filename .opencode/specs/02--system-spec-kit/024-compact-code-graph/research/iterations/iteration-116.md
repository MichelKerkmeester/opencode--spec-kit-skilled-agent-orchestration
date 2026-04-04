# Research Iteration 116: The Bridge and Native-Module Boundary Are No Longer the Main Problem

## Focus

Check whether the current OpenCode failure still points to the old native-module / plugin-host boundary problem, or whether the problem has clearly moved later in the pipeline.

## Findings

1. The current plugin no longer imports the Spec Kit MCP server bundle directly into the OpenCode host process. Instead it shells out to a plain `node` bridge script, parses JSON from stdout, and caches the returned transport plan. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:1-18`] [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:130-143`]

2. That design was introduced specifically to isolate `better-sqlite3` / native-module ABI issues from the OpenCode host runtime. The bridge path therefore solves a different class of problem than the one named by the current error. [SOURCE: `.opencode/plugins/spec-kit-compact-code-graph.js:1-8`]

3. The current error is not a native-module load failure or bridge JSON parse failure. It is a prompt-schema rejection reported after the plugin has already produced transformed prompt data. [INFERENCE: based on the live error text and the fact that `system.transform` / `messages.transform` only run after a plan is loaded]

4. The debugging target should therefore shift from "can the plugin load the runtime?" to "does the plugin return a host-valid prompt shape after the runtime loads?" [INFERENCE: synthesized from findings 1-3]

## Recommendation

Preserve the subprocess bridge architecture. It addresses the earlier ABI problem correctly. The present regression should be investigated and fixed inside the hook/prompt layer, not by undoing the bridge separation.

## Ruled Out Directions

- Rolling back to direct in-process MCP runtime imports
- Treating the old `better-sqlite3` host error as the current primary diagnosis
