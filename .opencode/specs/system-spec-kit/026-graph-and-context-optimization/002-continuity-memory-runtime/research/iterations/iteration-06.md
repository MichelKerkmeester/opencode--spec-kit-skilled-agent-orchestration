## Iteration 06
### Focus
Lock scope and multi-runtime race exposure: review the mutex implementation and save-entrypoint docs to determine whether the current serialization story holds outside a single Node process.

### Findings
- The folder mutex is an in-memory `Map<string, Promise<unknown>>`, so it only serializes saves inside one process lifetime. There is no filesystem lock, DB lock, or cross-process coordination primitive. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:9-27`
- The save workflow documents two independent execution paths, slash-command and direct-script, both feeding the same continuity substrate. That means concurrent saves can reasonably originate from separate runtimes even if one process is internally serialized. Evidence: `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:17-21`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:27-37`
- Inference from those two facts: the current mutex prevents same-process overlap, but it does not protect cross-process or cross-runtime `full-auto` saves targeting the same packet. The docs do not surface that reduced guarantee anywhere near the writer contract.

### New Questions
- Does production deploy the save handler as a single long-lived process, or can multiple MCP/server/CLI processes mutate the same packet concurrently today?
- Would a file lock on the target doc or spec folder be enough, or is DB-backed lease tracking needed for cross-process safety?
- Should the public docs downgrade the concurrency guarantee until an interprocess lock exists?
- Are there any hot paths where `generate-context.js` and MCP `memory_save` can run at the same time against one packet?

### Status
converging
