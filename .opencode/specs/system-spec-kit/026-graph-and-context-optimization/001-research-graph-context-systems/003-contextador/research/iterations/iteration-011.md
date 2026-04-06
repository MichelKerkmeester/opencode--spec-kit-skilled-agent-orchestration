# Iteration 11 -- 003-contextador

## Metadata
- Run: 11 of 13
- Focus: Setup wizard + framework presets + UI helpers (`.mcp.json` auto-detection reality check)
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-06T12:28:14Z
- Tool calls used: 9

## Reading order followed
1. `.opencode/skill/sk-deep-research/SKILL.md` `1-220`
2. `.opencode/skill/system-spec-kit/SKILL.md` `1-220`
3. `.opencode/skill/sk-doc/SKILL.md` `1-220`
4. `research/iterations/iteration-010.md` `1-86`
5. `external/src/lib/setup/wizard.ts` `1-335`
6. `external/src/lib/frameworks/index.ts` `1-2`
7. `external/src/lib/frameworks/hermes.ts` `1-46`
8. `external/src/lib/frameworks/openclaw.ts` `1-53`
9. `external/src/lib/ui.ts` `1-191`
10. `external/src/cli.ts` `120-158`
11. `external/src/cli.ts` `769-790`
12. `research/research.md` `164-172`
13. `research/iterations/iteration-005.md` `57-63`

## Findings

Evidence posture for this iteration:
- Source-proven claims below come from the wizard, framework modules, UI helper module, and the traced `cli.ts` init/doctor slices (`external/src/lib/setup/wizard.ts:1-335`, `external/src/lib/frameworks/index.ts:1-2`, `external/src/lib/frameworks/hermes.ts:1-46`, `external/src/lib/frameworks/openclaw.ts:1-53`, `external/src/lib/ui.ts:1-191`, `external/src/cli.ts:120-158`, `external/src/cli.ts:769-790`).
- README carryover is not freshly re-read in this pass. Any statement about README-level positioning is inherited from earlier packet evidence and is called out explicitly as prior README/inferred context rather than new source proof (`research/iterations/iteration-005.md:57-63`, `research/research.md:164-172`).

### Setup wizard step-by-step

1. `runSetup()` shows the branded banner, opens a readline session, then executes three sequential stages: provider selection, framework selection, and Mainframe selection. After that it writes the global config and tells the user to run `contextador init` next; the wizard does not itself initialize a project (`external/src/lib/setup/wizard.ts:299-325`).
2. Provider selection offers seven choices: Anthropic, OpenAI, Google, GitHub Copilot, OpenRouter, custom server, and Claude Code. Non-`claude-code` providers may ask for API key and optional base URL/model, then immediately run `detectProvider()`, `configure()`, and `testConnection()` to smoke-test the chosen backend. Claude Code skips the API-key path and only prints success/info text (`external/src/lib/setup/wizard.ts:31-114`).
3. Framework selection is a simple menu, not repo auto-detection. The wizard asks "What agent framework are you using?" and maps the answer to one of four stored strings: `claude-code`, `openclaw`, `hermes`, or `other` (`external/src/lib/setup/wizard.ts:116-149`).
4. Mainframe setup asks whether to enable shared multi-agent context at all. If the user says no, the wizard records `enabled: false` and exits that branch without touching network or Docker surfaces (`external/src/lib/setup/wizard.ts:152-169`).
5. If Mainframe is enabled, the wizard asks whether to use an existing Matrix server or let Contextador set one up. The existing-server branch asks for `Matrix server URL` and `Server name`, probes `/_matrix/client/versions`, and stores `operatorUrl`, `serverName`, and `autoSetup: false` regardless of whether the probe succeeds (`external/src/lib/setup/wizard.ts:171-215`).
6. The Docker branch is the only path that materially creates extra files. It runs `docker info`, reads `external/docker/operator.toml`, writes `external/docker/operator.generated.toml` with `contextador.local` substituted in, then runs `docker compose -f external/docker/docker-compose.yml up -d` with `OPERATOR_PORT=6167`; after that it polls `http://localhost:6167/_matrix/client/versions` up to ten times and, if healthy, stores `operatorUrl: "http://localhost:6167"`, `serverName: "contextador.local"`, and `autoSetup: true` (`external/src/lib/setup/wizard.ts:218-297`).
7. The only always-written file from the wizard itself is the global config at `~/.contextador/config.json`. It creates `~/.contextador/`, writes provider/framework/Mainframe data, and `chmod`s the file to `0600`. This is where framework choice is persisted for later commands (`external/src/lib/setup/wizard.ts:6-7`, `external/src/lib/setup/wizard.ts:309-316`, `external/src/lib/setup/wizard.ts:328-335`).
8. `.mcp.json` creation happens later in `contextador init`, not in the wizard. The init path writes a generic project-root `.mcp.json` only if the file is missing, and doctor mode later warns that MCP editors will not auto-detect Contextador if the file is absent (`external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`).

### Framework presets table

| Preset | Source file | What it configures | Detection signal | Output files |
|--------|-------------|--------------------|------------------|--------------|
| `claude-code` / Cursor | `external/src/lib/setup/wizard.ts:121-149`, `external/src/cli.ts:141-158` | Stores `framework: "claude-code"` in global config; no traced framework-specific project helper is generated. The only project file on the init path is the generic `.mcp.json`, which is not specific to this preset (`external/src/lib/setup/wizard.ts:309-316`, `external/src/cli.ts:141-145`). | User menu choice `1`, saved as `claude-code` (`external/src/lib/setup/wizard.ts:121-149`). | `~/.contextador/config.json`; optionally generic project `.mcp.json` during `init` (`external/src/lib/setup/wizard.ts:309-316`, `external/src/cli.ts:141-145`). |
| `openclaw` | `external/src/lib/frameworks/index.ts:1-2`, `external/src/lib/frameworks/openclaw.ts:1-53`, `external/src/cli.ts:147-153` | Real preset module with two generators: an OpenClaw `SKILL.md` template and an unused MCP-config helper function. On the traced init path, only the skill file is emitted (`external/src/lib/frameworks/openclaw.ts:1-53`, `external/src/cli.ts:148-153`). | `globalConfig.framework === "openclaw"` (`external/src/cli.ts:148-153`). | `skills/contextador/SKILL.md` plus the generic project `.mcp.json` if missing (`external/src/cli.ts:141-145`, `external/src/cli.ts:148-153`). |
| `hermes` | `external/src/lib/frameworks/index.ts:1-2`, `external/src/lib/frameworks/hermes.ts:1-46`, `external/src/cli.ts:154-157` | Real preset module with a Hermes MCP-config helper and a tool-guide generator, but the traced init path only writes the guide markdown. The Hermes MCP config generator exists in source but is not called here (`external/src/lib/frameworks/hermes.ts:1-46`, `external/src/cli.ts:154-157`). | `globalConfig.framework === "hermes"` (`external/src/cli.ts:154-157`). | `CONTEXTADOR_HERMES.md` plus the generic project `.mcp.json` if missing (`external/src/cli.ts:141-145`, `external/src/cli.ts:154-157`). |
| `other` / none | `external/src/lib/setup/wizard.ts:121-149`, `external/src/cli.ts:147-158` | Records `framework: "other"` in global config and stops there. No dedicated framework module exists for this preset (`external/src/lib/frameworks/index.ts:1-2`, `external/src/lib/setup/wizard.ts:130-149`). | User menu choice `4`, saved as `other` (`external/src/lib/setup/wizard.ts:121-149`). | `~/.contextador/config.json`; optionally generic project `.mcp.json` during `init` (`external/src/lib/setup/wizard.ts:309-316`, `external/src/cli.ts:141-145`). |

### F11.1 -- `.mcp.json` auto-detection is still just generated project config plus host-editor discovery; the wizard itself does not perform detection
- Source-proven: the wizard only records provider/framework/Mainframe state to `~/.contextador/config.json` and tells the user to run `contextador init` next (`external/src/lib/setup/wizard.ts:299-321`).
- Source-proven: `contextador init` creates a project-root `.mcp.json` only when the file is missing, and `doctor` later checks only for file presence before warning that MCP editors will not auto-detect Contextador if the file is absent (`external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`).
- README/inferred carryover: prior packet evidence already mapped the README's "auto-detected via `.mcp.json`" wording to editor-side discovery of that generated file rather than any deeper runtime registration logic inside Contextador (`research/iterations/iteration-005.md:57-63`, `research/research.md:164-172`).

### F11.2 -- The real preset surface is small: four user-selectable framework labels, but only two dedicated preset modules exist
- The wizard exposes four choices to the user: `claude-code`, `openclaw`, `hermes`, and `other` (`external/src/lib/setup/wizard.ts:121-149`).
- The framework export surface contains only two dedicated modules: OpenClaw and Hermes (`external/src/lib/frameworks/index.ts:1-2`).
- That means "framework support" is partly menu-level labeling and only partly code generation. Claude Code / Cursor and Other are persisted choices, not generator-backed preset packages (`external/src/lib/setup/wizard.ts:130-149`, `external/src/cli.ts:147-158`).

### F11.3 -- OpenClaw and Hermes are real, but their implementation is lightweight and partly aspirational
- OpenClaw has the fuller traced integration: `init` creates `skills/contextador/SKILL.md` from `generateOpenClawSkill()`, while `.mcp.json` remains the same generic project file used for every framework (`external/src/lib/frameworks/openclaw.ts:1-42`, `external/src/cli.ts:141-145`, `external/src/cli.ts:148-153`).
- Hermes is lighter: `init` writes `CONTEXTADOR_HERMES.md` from `generateHermesToolGuide()`, but the separately exported `generateHermesMcpConfig()` helper is not used in the traced CLI flow (`external/src/lib/frameworks/hermes.ts:1-46`, `external/src/cli.ts:154-157`).
- The same unused-helper pattern exists for OpenClaw's `generateOpenClawMcpConfig()`: the module exports it, but this iteration found no traced callsite using it (`external/src/lib/frameworks/openclaw.ts:44-53`, `external/src/cli.ts:147-153`).

### F11.4 -- `ui.ts` is mostly reusable console-output scaffolding, not a Bun-specific TUI framework
- Source-proven: `ui.ts` is built from ANSI color wrappers plus output helpers such as `success`, `error`, `warn`, `info`, `step`, `stepDone`, `stepFail`, `heading`, `stat`, and `divider`; there is no widget tree, state machine, or event-loop abstraction in this file (`external/src/lib/ui.ts:20-33`, `external/src/lib/ui.ts:152-190`).
- Source-proven: the file does include a width-aware branded banner with large ASCII art and a narrower fallback, so it is presentation-heavy and product-branded rather than generic UI infrastructure (`external/src/lib/ui.ts:35-52`, `external/src/lib/ui.ts:53-144`).
- Source-proven: the setup wizard imports these helpers directly and uses them as formatting primitives around otherwise plain readline/fetch/spawn logic (`external/src/lib/setup/wizard.ts:1-5`, `external/src/lib/setup/wizard.ts:34-46`, `external/src/lib/setup/wizard.ts:193-207`, `external/src/lib/setup/wizard.ts:299-321`).

### F11.5 -- Public should borrow the onboarding ergonomics pattern, but Finding 12's "adopt now" label needs to stay narrow
- Source-proven: the genuinely useful onboarding pieces are the guided provider/framework/Mainframe questions, the generic `.mcp.json` scaffold during `init`, and the setup/doctor hint loop that points users back to `contextador setup` or `contextador init` (`external/src/lib/setup/wizard.ts:31-149`, `external/src/lib/setup/wizard.ts:152-321`, `external/src/cli.ts:141-145`, `external/src/cli.ts:769-790`).
- Source-proven: the framework layer itself is thin. Only OpenClaw and Hermes have dedicated modules, and even there the traced outputs are one markdown skill or guide file rather than deep host integration; both preset-specific MCP-config generator functions are unproven on the traced CLI path (`external/src/lib/frameworks/index.ts:1-2`, `external/src/lib/frameworks/hermes.ts:1-46`, `external/src/lib/frameworks/openclaw.ts:1-53`, `external/src/cli.ts:147-157`).
- Inferred recommendation: keep F12 only as "adopt now for generated MCP scaffolding plus friendly onboarding guidance," not as "adopt now for framework integrations." Public can benefit from a small config/bootstrap helper, but the preset layer here is too shallow to justify copying its framing wholesale (`research/research.md:164-172`, `external/src/cli.ts:141-158`, `external/src/lib/setup/wizard.ts:116-149`).

## Newly answered key questions
- `.mcp.json` auto-detection still means "Contextador writes a project file that MCP-aware editors may discover"; there is no new wizard-side or framework-side detection mechanism in this slice (`external/src/lib/setup/wizard.ts:299-321`, `external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`).
- The only real preset modules are OpenClaw and Hermes. Claude Code / Cursor and Other are menu choices persisted in global config, not dedicated generator packages (`external/src/lib/setup/wizard.ts:121-149`, `external/src/lib/frameworks/index.ts:1-2`).
- `ui.ts` is reusable mainly at the "console messaging primitives" level, not as a deeper TUI subsystem (`external/src/lib/ui.ts:20-33`, `external/src/lib/ui.ts:152-190`).
- F12 still survives, but only in a narrowed form: adopt the project bootstrap pattern, not the broader framework-preset framing (`research/research.md:164-172`, `external/src/cli.ts:141-158`, `external/src/lib/frameworks/index.ts:1-2`).

## Open questions still pending
- Are the preset-generated files (`skills/contextador/SKILL.md`, `CONTEXTADOR_HERMES.md`) actually consumed by documented downstream workflows, or are they mostly convenience artifacts with no validation/tests in-tree (`external/src/cli.ts:148-157`, `external/src/lib/frameworks/hermes.ts:14-46`, `external/src/lib/frameworks/openclaw.ts:1-42`)?
- Is there any untraced command or test path that exercises the exported `generateHermesMcpConfig()` or `generateOpenClawMcpConfig()` helpers, or are those functions currently aspirational API surface (`external/src/lib/frameworks/index.ts:1-2`, `external/src/lib/frameworks/hermes.ts:1-12`, `external/src/lib/frameworks/openclaw.ts:44-53`)?

## Recommended next focus (iteration 12)
- GitHub integration trace: read `external/src/lib/github/index.ts`, `external/src/lib/github/triage.ts`, `external/src/lib/github/webhook.ts`, `external/src/lib/github/types.ts`, and optionally `external/src/lib/github/triage.test.ts` plus `external/src/lib/github/webhook.test.ts`.
- Goal: treat this as an end-to-end automation example built on top of Contextador's core so we can map what "shipping a real automation on top of this server" looks like, which is directly relevant to any Public consideration of automated agent workflows.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.34
- status: insight
- findingsCount: 5
