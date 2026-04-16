# Iteration 9 — Monorepo workspace aggregation, config, plugins

> Engine: cli-codex (gpt-5.4 high), sandbox=read-only. The codex agent ran the full source trace successfully. The read-only sandbox blocked the heredoc-based write to `/tmp/codex-iter-009-output.md`, but the fully assembled report was preserved verbatim in the stdout reasoning trace before the write attempt. The orchestrator extracted that report and reformatted shell-escape artifacts back into clean markdown without altering the findings.

## Summary
Codesight's config surface is **code-first rather than dotfile-first**: it loads `codesight.config.ts|js|mjs|json` from the project root, then falls back to `package.json` `codesight`; there is **no `.codesightrc` path in source**. Monorepo support is intentionally narrow: `scanner.ts` only recognizes `pnpm-workspace.yaml` or `package.json` `workspaces`, expands one-level glob roots into workspace folders, and rolls workspace dependencies/frameworks/ORMs up into the root project summary. Plugins are real in source, but thin and unproven in-tree: built-ins can be skipped before invocation via `disableDetectors`, plugin detectors can append selected result categories, and post-processors can rewrite the final `ScanResult`.

## Files Read
- external/src/config.ts:1-108
- external/src/scanner.ts:20-32, 97-166, 380-399
- external/src/index.ts:25-56, 75-160, 300-413
- external/src/types.ts:36-52, 141-182
- external/eval/fixtures/hono-monorepo/repo.json:1-20 (plus fixture directory listing)
- external/tests/detectors.test.ts:487-498
- external/README.md:41-49, 421-422 (skim only; non-authoritative)

## Findings

### Finding 1 — Config inputs are `codesight.config.*` plus `package.json`, not `.codesightrc`
- Source: `external/src/config.ts:10-15, 29-38, 54-60, 40-49, 68-92`
- What it does: The loader only checks `codesight.config.ts`, `codesight.config.js`, `codesight.config.mjs`, and `codesight.config.json`, then falls back to `package.json` `codesight`. No `.codesightrc*` filename is referenced anywhere. TS config loading is best-effort via dynamic import, then a fallback regex that only handles a simple `export default { ... }` shape; failure returns `{}` with a warning ("Warning: cannot load codesight.config.ts (install tsx for TS config support)").
- Why it matters for Code_Environment/Public: Third-party or user customization is config-module based, not dotfile based. If we adopt anything similar, we should pick one of {dotfile, config-module, package.json embed} and document it; mixing all three (as Codesight effectively does, missing only the dotfile) creates user confusion.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: configuration surface
- Risk/cost: low

### Finding 2 — CLI flags are broad, but only three CLI values merge into persistent config
- Source: `external/src/index.ts:29-47, 300-363, 382-392`; `external/src/config.ts:98-107`
- What it does: The CLI parser accepts `-o/--output`, `-d/--depth`, `--init`, `--watch`, `--hook`, `--html`, `--open`, `--mcp`, `--json`, `--benchmark`, `--profile <tool>`, `--blast <file>`, `--telemetry`, `--eval`, `-v/--version`, `-h/--help`, plus a positional directory argument. After parsing, `loadConfig(root)` is merged with CLI overrides only for `maxDepth`, `outputDir`, and `profile`; the rest stay as runtime booleans/strings outside the config object.
- Why it matters for Code_Environment/Public: The source-of-truth config surface is narrower than the full CLI surface. Flags like `--json`, `--watch`, `--hook`, `--telemetry`, and `--eval` are not persisted through `CodesightConfig` merging. This is a small but real divergence between "what the CLI accepts" and "what the config file can express." Avoid importing this asymmetry; pick a rule (every flag is also config, or none of them are) and stick to it.
- Evidence type: source-confirmed
- Recommendation: adopt now (the rule, not the asymmetry)
- Affected area: configuration discipline
- Risk/cost: low

### Finding 3 — Monorepo aggregation only understands `pnpm-workspace.yaml` and `package.json` `workspaces`
- Source: `external/src/scanner.ts:107-111, 380-399, 26-29`
- What it does: `detectProject()` marks a repo as monorepo only when `pkg.workspaces` is present or `pnpm-workspace.yaml` exists. Workspace discovery comes exclusively from `getWorkspacePatterns()`, which parses YAML list items from `pnpm-workspace.yaml` or returns `pkg.workspaces` / `pkg.workspaces.packages`. There are **no dedicated branches for `turbo.json`, `nx.json`, `lerna.json`, or Rush manifests**. The enumerator converts each pattern by stripping `/*`, lists direct child directories under that root, reads each child `package.json`, and records workspace `name`, relative `path`, `frameworks`, and `orms`. `turbo` appears only as an ignored directory name (`.turbo`), not a discovery source.
- Why it matters for Code_Environment/Public: Codesight aggregates classic pnpm/yarn/npm workspaces, but not tool-specific monorepo graphs. If we ever need first-class monorepo introspection (which Public's specs structure increasingly resembles), the Codesight pattern is a starting point but is missing turbo/nx/rush awareness — a real gap to fix on adoption.
- Evidence type: source-confirmed
- Recommendation: prototype later (with the missing manager branches added)
- Affected area: monorepo aggregation
- Risk/cost: medium — adding turbo/nx/rush discovery is straightforward but requires authoring fixtures

### Finding 4 — Workspace aggregation rolls child deps and framework/ORM signals up into the root project
- Source: `external/src/scanner.ts:131-141, 143-155, 157-165`; `external/tests/detectors.test.ts:487-498`
- What it does: After discovering workspaces, Codesight merges each workspace's `dependencies` and `devDependencies` into `allDeps` before language and component-framework detection. It separately de-duplicates workspace `frameworks` and `orms` back into the top-level project arrays. The monorepo unit test asserts `project.isMonorepo === true`, `project.workspaces.length >= 2`, and that a workspace framework (`hono`) plus component framework (`react`) surface at the project level.
- Why it matters for Code_Environment/Public: The monorepo model is **aggregation-oriented, not graph-oriented**: workspace packages enrich one top-level `ProjectInfo` rather than remaining isolated sub-project analyses. This is a deliberate simplification — easier to consume, but loses per-workspace fidelity. For Public, the right move is probably the inverse: per-workspace `ProjectInfo` records joined by a parent index, since Public's workflows are spec-folder-scoped.
- Evidence type: test-confirmed
- Recommendation: reject the rollup model (prefer per-workspace records)
- Affected area: monorepo data model
- Risk/cost: low — the rejection is conceptual, not code-cost

### Finding 5 — `disableDetectors` skips built-ins before they run; it is not a post-filter
- Source: `external/src/index.ts:99-113, 104-112, 115-130`
- What it does: `scan()` creates `const disabled = new Set(userConfig.disableDetectors || [])` and uses conditional expressions that return resolved empty placeholders instead of calling the detector. Disabled routes/schema/components/libs/middleware return `[]`; disabled config returns an empty config object; disabled graph returns `{ edges: [], hotFiles: [] }`. There is no run-then-discard path for built-ins. Plugin detectors still run afterward if present.
- Why it matters for Code_Environment/Public: This is a clean "skip work, don't filter results" pattern that's worth borrowing wholesale. It pairs naturally with the future possibility of replacing a built-in detector with a plugin (disable the built-in, enable the plugin), and avoids paying the runtime cost of detection just to throw it away.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: orchestration pipeline
- Risk/cost: low

### Finding 6 — Plugins and post-processors are real hooks, but the extension story is source-inferred and lightly documented
- Source: `external/src/types.ts:141-170, 173-181`; `external/src/index.ts:115-133, 399-410`
- What it does: `CodesightConfig` exposes `plugins?: CodesightPlugin[]`; each plugin has a required `name`, optional async `detector(files, project)`, and optional async `postProcessor(result)`. Plugin detectors run after all built-ins, and can only merge additional `routes`, `schemas`, `components`, and `middleware` into the in-memory result set before contract enrichment/output. Post-processors run after `scan()` returns and can replace the final `ScanResult`. Within the files read, there are **no in-tree plugin implementations or plugin/disableDetectors tests** (`rg` over `external/tests` returned no matches), so third-party extensibility is inferred from the typed config-module surface rather than demonstrated by fixtures/tests.
- Why it matters for Code_Environment/Public: Third-party detectors are possible if a user's config module imports or constructs plugin objects, but this is not a discovered package/plugin registry. Post-processors are a real extension point in code, not obviously vestigial, though they are currently unexercised in the visible test surface. For Public, the lesson is: plugin contracts that aren't tested aren't real. If we add plugin hooks, ship at least one in-tree fixture exercising them.
- Evidence type: mixed (source-confirmed for the typed contract; test-confirmed negative for usage)
- Recommendation: prototype later (with mandatory test fixture)
- Affected area: extensibility story
- Risk/cost: medium — the typed contract is small but the fixture authoring discipline is the real cost

## Configuration Surface Inventory
| Input | Format | Source location | Used by |
|-------|--------|----------------|---------|
| `.codesightrc*` | Not supported in source | n/a | None |
| `codesight.config.ts` | TS module exporting a config object, ideally `export default { ... }` | `config.ts:10-15, 40-43, 68-92` | `loadConfig()` → `mergeCliConfig()` → `scan()` |
| `codesight.config.js` / `.mjs` | JS/MJS module imported dynamically; default export or module object | `config.ts:10-15, 45-47` | `loadConfig()` → `mergeCliConfig()` → `scan()` |
| `codesight.config.json` | JSON object | `config.ts:10-15, 35-38` | `loadConfig()` → `mergeCliConfig()` → `scan()` |
| `package.json` `codesight` field | Embedded object config | `config.ts:54-60` | `loadConfig()` fallback |
| CLI flags | Process args; see parser list in `main()` | `index.ts:29-47, 300-363` | Runtime behavior; only `maxDepth`, `outputDir`, and `profile` flow into merged config via `mergeCliConfig()` |
| Env vars | None found in config-loading or CLI code | No matches in `config.ts`, `index.ts`, `scanner.ts`, `types.ts` | None observed |

## Monorepo Aggregation Strategy
| Manager | Detection signal | Workspace discovery | Implementation file |
|---------|-----------------|---------------------|--------------------|
| pnpm | Root `pnpm-workspace.yaml` exists | Parse YAML `- pattern` entries, strip trailing `/*`, enumerate direct child dirs, read each child `package.json` | `scanner.ts:108-113, 384-392` |
| yarn / npm | `package.json` `workspaces` present | Accept `workspaces` array or `workspaces.packages`, then enumerate child package dirs from each pattern root | `scanner.ts:108-113, 395-397` |
| turbo | No dedicated detection; `.turbo` is only ignored during file collection | None beyond generic workspace handling above | `scanner.ts:26-29, 384-399` |
| nx | No dedicated detection | None beyond generic workspace handling above | `scanner.ts:384-399` |
| lerna | No dedicated detection | None beyond generic workspace handling above | `scanner.ts:384-399` |
| rush | No dedicated detection | None beyond generic workspace handling above | `scanner.ts:384-399` |

## Plugin Contract
Plugins are a config-embedded hook system, not a discovered plugin registry. The authoritative contract is source-defined in `types.ts`: a plugin object must provide `name`, and may provide `detector(files, project)` and/or `postProcessor(result)` async hooks. `index.ts` executes detector hooks after built-in detectors and merges only `routes`, `schemas`, `components`, and `middleware`, then later runs post-processors over the full `ScanResult`. Third-party detectors are feasible if the user's `codesight.config.*` imports or constructs plugin objects, but this is inferred from the config-module loading path (`config.ts:29-47, 68-92`) rather than from any explicit registry, discovery API, or in-tree example.

## Open Questions / Next Focus
- Does the published package export a stable plugin authoring API, or is `CodesightPlugin` only an internal TypeScript surface?
- How robust is workspace expansion for patterns beyond `dir/*` (for example explicit package paths or nested globs like `apps/**`)? The current implementation only strips a terminal `/*` before enumerating directories. (`scanner.ts:112-119`)
- Are plugin/post-processor hooks used in any real examples outside the files read, or are they currently an undocumented extension seam?

## Cross-Phase Awareness
This iteration stayed inside phase 002-codesight by reading only Codesight's own config, scanner, index, types, and the hono-monorepo fixture. It did not analyze contextador's MCP query design (phase 003) or graphify's NetworkX/Leiden (phase 004). The monorepo + config + plugin findings have no overlap with either phase.

## Sandbox Note
The codex CLI was invoked with `--sandbox read-only`. The agent successfully completed the source trace, assembled the full report inside a heredoc, and attempted to write it to `/tmp/codex-iter-009-output.md`. The write was blocked twice — once for the heredoc temp file (`zsh:1: can't create temp file for here document: operation not permitted`) and once for a direct Python `Path.write_text` (`PermissionError: [Errno 1] Operation not permitted: '/tmp/codex-iter-009-output.md'`). This confirmed `/tmp` is fully outside the read-only sandbox, not just a heredoc-tooling limitation. The orchestrator extracted the assembled report from the stdout reasoning trace and wrote this file directly.

## Metrics
- newInfoRatio: 0.79
- findingsCount: 6
- focus: "iteration 9: monorepo + config + plugins"
- status: insight
