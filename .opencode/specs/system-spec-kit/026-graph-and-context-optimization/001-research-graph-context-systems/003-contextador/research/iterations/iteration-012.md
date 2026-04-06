# Iteration 12 -- 003-contextador

## Metadata
- Run: 12 of 13
- Focus: GitHub integration as a real automation example (`webhook` + `triage` + types + tests)
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-06T12:32:29Z
- Tool calls used: 9

## Reading order followed
1. `.opencode/skill/sk-deep-research/SKILL.md` `1-260`
2. `.opencode/skill/sk-doc/SKILL.md` `1-156`
3. `.opencode/skill/system-spec-kit/SKILL.md` `120-255`
4. `research/iterations/iteration-011.md` `1-94`
5. `external/src/lib/github/types.ts` `1-53`
6. `external/src/lib/github/index.ts` `1-3`
7. `external/src/lib/github/triage.ts` `1-296`
8. `external/src/lib/github/webhook.ts` `1-325`
9. `external/src/lib/github/triage.test.ts` `1-108`
10. `external/src/lib/github/webhook.test.ts` `1-12`
11. `external/src/cli.ts` `403-553`
12. `external/src/cli.ts` `587-603`
13. `external/src/cli.ts` `927-935`
14. `external/src/mcp.ts` `1-27`
15. `external/src/mcp.ts` `180-215`

## Findings

Evidence posture for this iteration:
- Source-proven claims below come from the phase-local Contextador checkout under `003-contextador/external/...`, not from repository-root `external/...` paths. The prompt's shorter paths resolved to the phase-local copies that actually exist in this packet (`external/src/lib/github/index.ts:1-3`, `external/src/lib/github/types.ts:1-53`, `external/src/lib/github/triage.ts:1-296`, `external/src/lib/github/webhook.ts:1-325`).
- No README was freshly re-read in this pass. Anything labeled "inferred" below is inferred from source shape and test gaps, not from README marketing copy (`external/src/lib/github/triage.test.ts:1-108`, `external/src/lib/github/webhook.test.ts:1-12`).

### GitHub layer architecture diagram

```text
GitHub push payload
  -> webhook.ts / handleWebhook()
     -> verifySignature()
     -> branch + event filtering
     -> triagePush()
        -> extractChangedFiles()
        -> filterTrivialFiles()
        -> mapFilesToScopes()
        -> triageScope()
           -> local model verdict via generateText()
     -> if shouldUpdate:
          targetedSweep()
          -> generateContextContent()
          -> generateBriefing()
          -> buildHierarchyConfig()
          -> syncServiceIndex()
          -> syncArchitectureDeps()
     -> logEvent()

Does it call any Contextador MCP tool?
  NO. It calls core library functions directly, not the MCP `context` tool surface
  (`external/src/lib/github/triage.ts:12-18`, `external/src/lib/github/webhook.ts:13-20`,
  `external/src/mcp.ts:185-192`).
```

### GitHub event lifecycle table

| Event | Receiver function | Triage logic | Output / side effect | Test coverage |
|-------|-------------------|--------------|----------------------|---------------|
| `GET /` or `GET /health` | `handleWebhook()` | None; returns health immediately | JSON `{ status: "ok", service: "contextador-webhook" }` (`external/src/lib/github/webhook.ts:153-166`) | No direct webhook handler coverage; `webhook.test.ts` only checks defaults (`external/src/lib/github/webhook.test.ts:1-12`) |
| GitHub `ping` | `handleWebhook()` | None; bypasses triage | JSON `{ status: "pong" }` (`external/src/lib/github/webhook.ts:173-191`) | No direct coverage (`external/src/lib/github/webhook.test.ts:1-12`) |
| Non-`push` event | `handleWebhook()` | None; ignored after header check | JSON `{ status: "ignored", reason: ... }` (`external/src/lib/github/webhook.ts:193-198`) | No direct coverage (`external/src/lib/github/webhook.test.ts:1-12`) |
| `push` on unwatched branch | `handleWebhook()` | Branch filter only; `triagePush()` not called | JSON `{ status: "ignored", reason: "branch ... not watched" }` (`external/src/lib/github/webhook.ts:210-217`) | No direct coverage (`external/src/lib/github/webhook.test.ts:1-12`) |
| Watched `push` with only trivial or already-covered changes | `handleWebhook()` -> `triagePush()` | `extractChangedFiles()` + `filterTrivialFiles()` + scope checks; returns `shouldUpdate: false` | Event logged to `.contextador/webhook-events.json`; response status `skipped` (`external/src/lib/github/triage.ts:39-75`, `external/src/lib/github/triage.ts:238-296`, `external/src/lib/github/webhook.ts:73-91`, `external/src/lib/github/webhook.ts:231-275`) | Helper coverage only: changed-file extraction, trivial-file filtering, and scope mapping (`external/src/lib/github/triage.test.ts:27-108`) |
| Watched `push` needing context refresh | `handleWebhook()` -> `triagePush()` -> `targetedSweep()` | Per-scope model/heuristic verdict via `triageScope()` drives `shouldUpdate: true` | Regenerates affected `CONTEXT.md` files, refreshes derived artifacts, logs event, returns `swept` with actions (`external/src/lib/github/triage.ts:172-232`, `external/src/lib/github/triage.ts:273-295`, `external/src/lib/github/webhook.ts:97-148`, `external/src/lib/github/webhook.ts:244-260`) | No integration coverage for HTTP, signature verification, targeted sweep, or model path (`external/src/lib/github/triage.test.ts:1-108`, `external/src/lib/github/webhook.test.ts:1-12`) |

### F12.1 -- The GitHub layer does not use the MCP `context` tool; it runs independently on direct library calls
- Source-proven: the GitHub export surface is only webhook server helpers, triage helpers, and types; there is no GitHub wrapper around MCP tool invocation (`external/src/lib/github/index.ts:1-3`).
- Source-proven: `triage.ts` imports `generateText`, `getModel`, `findContextFiles`, and `checkFreshness`-adjacent core utilities directly, then makes its freshness verdict inside `triageScope()` rather than calling into `mcp.ts` (`external/src/lib/github/triage.ts:12-18`, `external/src/lib/github/triage.ts:172-232`).
- Source-proven: `webhook.ts` imports generator, briefing, hierarchy, and doc-sync core functions directly and calls them in `targetedSweep()`; again, there is no MCP-tool hop in this flow (`external/src/lib/github/webhook.ts:13-20`, `external/src/lib/github/webhook.ts:97-148`).
- Source-proven: the MCP `context` tool is a separate server tool defined in `mcp.ts`; this iteration found it only in the MCP server surface, not in the GitHub modules (`external/src/mcp.ts:180-215`).

### F12.2 -- GitHub is shipped as a separate CLI surface inside the same product, not as part of the traced MCP surface
- Source-proven: `cli.ts` exposes `contextador webhook start`, `events`, and `test`, and dispatches them through `cmdWebhook()` as a normal CLI command family (`external/src/cli.ts:403-553`, `external/src/cli.ts:587-603`, `external/src/cli.ts:927-935`).
- Source-proven: the CLI help text describes `webhook` as "GitHub push webhook — auto-update context on push," which positions it as a user-facing command surface rather than an internal MCP-only feature (`external/src/cli.ts:587-603`).
- Source-proven: the traced `mcp.ts` import block pulls in core, mainframe, provider, and setup modules, then defines the MCP server and `context` tool; it does not import `./lib/github/*` in the read slices (`external/src/mcp.ts:6-27`, `external/src/mcp.ts:180-215`).

### F12.3 -- The production/aspiration ratio is mixed: the webhook loop is real, but the confidence story is thin
- Source-proven: the production path is concrete. `handleWebhook()` verifies HMAC signatures, filters event type and branch, optionally does `git pull --ff-only`, triages the push, logs the event, and either skips or performs a targeted sweep (`external/src/lib/github/webhook.ts:35-68`, `external/src/lib/github/webhook.ts:168-275`).
- Source-proven: `targetedSweep()` really regenerates affected `CONTEXT.md` files and refreshes derivative artifacts such as `briefing.md`, `hierarchy.json`, `service-index.md`, and architecture dependencies when regeneration succeeds (`external/src/lib/github/webhook.ts:97-148`).
- Source-proven: the triage pipeline is also real. It extracts changed files, filters trivial paths, maps files to scopes, gets git diffs, reads existing `CONTEXT.md`, and asks the local model for an `UPDATE` vs `SKIP` verdict with a heuristic fallback (`external/src/lib/github/triage.ts:39-113`, `external/src/lib/github/triage.ts:119-232`, `external/src/lib/github/triage.ts:238-296`).
- Inferred: the assurance level is much weaker than the runtime ambition. `triage.test.ts` covers only pure helpers (`extractChangedFiles`, `filterTrivialFiles`, `mapFilesToScopes`), and `webhook.test.ts` covers only `getWebhookDefaults()`, so the HTTP handler, signature verification, `triagePush()`, model fallback path, and targeted sweep side effects remain untested in the traced suite (`external/src/lib/github/triage.test.ts:1-108`, `external/src/lib/github/webhook.test.ts:1-12`).

### F12.4 -- The reusable pattern for Public is "cheap deterministic filter -> narrow model decision -> scoped repair," not "GitHub via MCP"
- Source-proven: the cheap deterministic front-end is reusable: deduplicate changed files, remove known-trivial paths, and map remaining files to the deepest known scope before spending model tokens (`external/src/lib/github/triage.ts:39-113`).
- Source-proven: the expensive reasoning step is deliberately narrow. `triageScope()` sends existing `CONTEXT.md`, changed files, and a truncated diff to the local model only after scope reduction, and it has a simple line-count heuristic when the model is unavailable (`external/src/lib/github/triage.ts:168-232`).
- Source-proven: the repair action is targeted rather than global. `targetedSweep()` only rewrites affected scopes, then conditionally refreshes secondary artifacts if regeneration actually happened (`external/src/lib/github/webhook.ts:93-148`).
- Source-proven: the CLI also includes an operator-friendly simulation path: `contextador webhook test` synthesizes a pseudo-push from recent git history and prints a triage summary, which is a practical pattern for validating automation without a live webhook sender (`external/src/cli.ts:470-541`).
- Inferred recommendation: for Public, the portable value is the staged automation shape itself: webhook or event intake, deterministic narrowing, optional model adjudication, append-only event logging, and bounded repair. The GitHub-specific transport is secondary (`external/src/lib/github/webhook.ts:73-91`, `external/src/lib/github/triage.ts:172-232`).

### F12.5 -- This layer does not demonstrate Mainframe multi-agent coordination in practice; it stays local
- Source-proven: the GitHub modules import local core and provider utilities, but no Mainframe modules (`external/src/lib/github/triage.ts:12-18`, `external/src/lib/github/webhook.ts:13-20`).
- Source-proven: Mainframe wiring exists in `mcp.ts`, where `bootstrap()` optionally creates a `MainframeBridge` and the `context` tool checks cache/history before routing locally (`external/src/mcp.ts:18-20`, `external/src/mcp.ts:45-91`, `external/src/mcp.ts:185-215`).
- Source-proven: because the webhook path never enters that MCP tool flow in the traced sources, this iteration found no evidence that GitHub-triggered sweeps broadcast to or coordinate through Mainframe (`external/src/lib/github/webhook.ts:153-325`, `external/src/mcp.ts:185-215`).

## Newly answered key questions
- The GitHub layer does not use the Contextador MCP `context` tool. It operates as direct local automation over core library calls plus a local model decision (`external/src/lib/github/index.ts:1-3`, `external/src/lib/github/triage.ts:12-18`, `external/src/lib/github/webhook.ts:13-20`, `external/src/mcp.ts:180-215`).
- GitHub is wired into the same product repository and CLI, but not into the traced MCP server surface. The exposed runtime surface here is `contextador webhook ...`, not an MCP tool (`external/src/cli.ts:403-553`, `external/src/cli.ts:587-603`, `external/src/cli.ts:927-935`, `external/src/mcp.ts:6-27`).
- The production/aspiration ratio is "real workflow, light proof." The implementation does meaningful work, but the test suite stops at helper/default coverage rather than end-to-end behavior (`external/src/lib/github/triage.ts:238-296`, `external/src/lib/github/webhook.ts:168-325`, `external/src/lib/github/triage.test.ts:1-108`, `external/src/lib/github/webhook.test.ts:1-12`).
- The reusable pattern for Public is a bounded automation pipeline: intake -> deterministic narrowing -> model arbitration -> targeted remediation -> event log (`external/src/lib/github/triage.ts:39-113`, `external/src/lib/github/triage.ts:172-232`, `external/src/lib/github/webhook.ts:73-148`).
- This slice does not prove cross-agent Mainframe coordination in practice; the automation remains local to the repository runtime (`external/src/lib/github/webhook.ts:13-20`, `external/src/mcp.ts:18-20`, `external/src/mcp.ts:45-91`).

## Open questions still pending
- Does any untraced production path outside this slice connect webhook-triggered sweeps back into Mainframe notifications or coordination, or is the separation complete in the broader codebase too (`external/src/lib/github/webhook.ts:153-325`, `external/src/mcp.ts:45-91`)?
- Are there hidden integration or manual tests outside `src/lib/github/*.test.ts` that exercise signature verification, branch filtering, or `targetedSweep()` side effects, or is runtime confidence genuinely this thin (`external/src/lib/github/webhook.test.ts:1-12`, `external/src/lib/github/triage.test.ts:1-108`)?

## Recommended next focus (iteration 13)
- Closing module sweep to finish near-complete source coverage: read the remaining untraced core production modules `external/src/lib/core/agents.ts`, `external/src/lib/core/demolish.ts`, `external/src/lib/core/sizecheck.ts`, `external/src/lib/core/docsync.ts`, `external/src/lib/core/depscan.ts`, `external/src/lib/core/validation.ts`, and `external/src/lib/core/writer.ts`.
- Specific closure goals:
  - `agents.ts`: confirm agent identity/persistence behavior and any privacy implications left open from F9.
  - `demolish.ts`: trace cleanup and uninstall semantics.
  - `sizecheck.ts`: document context file size validation and thresholds.
  - `docsync.ts` and `depscan.ts`: close the janitor-stage coverage story.
  - `validation.ts`: extract the real validation rules instead of inferred constraints.
  - `writer.ts`: understand the file-write abstraction that other modules depend on.
- This is the natural stopping point because it closes the remaining core production gaps without reopening already-traced subsystems (`external/src/lib/core/agents.ts`, `external/src/lib/core/demolish.ts`, `external/src/lib/core/sizecheck.ts`, `external/src/lib/core/docsync.ts`, `external/src/lib/core/depscan.ts`, `external/src/lib/core/validation.ts`, `external/src/lib/core/writer.ts`).

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.31
- status: insight
- findingsCount: 5
