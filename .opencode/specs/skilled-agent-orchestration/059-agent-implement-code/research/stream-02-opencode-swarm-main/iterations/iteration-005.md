# Iteration 005 - Q2 Stack-Agnostic Detection

## Focus

Q2: determine whether opencode-swarm-main assumes a fixed target stack or detects/probes the project it is operating on. This pass checked marker-file readers, `src/lang/`, coder/test-engineer prompts, config schema, and target-facing build/test/audit tools.

## Actions Taken

1. Listed `src/lang/` and searched `src/`, `package.json` for stack, language, marker, framework, runtime, and common marker-file keywords.
2. Read `src/lang/detector.ts`, `src/lang/profiles.ts`, `src/lang/framework-detector.ts`, and `src/lang/registry.ts`.
3. Read target-facing build/test/audit paths: `src/build/discovery.ts`, `src/tools/build-check.ts`, `src/tools/test-runner.ts`, and `src/tools/pkg-audit.ts`.
4. Re-read `src/agents/coder.ts`, `src/agents/test-engineer.ts`, `src/config/schema.ts`, and environment/language prompt injection paths with the stack-detection lens.

## Findings

### F1 - Swarm itself is Bun/TypeScript, but target-project probing is broader

The plugin package is implemented and tested as a Bun/TypeScript project: `package.json` requires Bun, builds with `bun build`, tests with `bun test`, and ships tree-sitter grammar assets. Citations: `package.json:10`, `package.json:12`, `package.json:35`, `package.json:41`, `package.json:43`, `package.json:54`, `package.json:59`.

That implementation substrate is distinct from the target-project surface. `src/lang/` contains a detector, framework detector, registry, runtime, profiles, and grammar WASM files for many languages, so the framework is not purely TS-only at the analysis/tool layer. Citations: `src/lang/detector.ts:1`, `src/lang/detector.ts:4`, `src/lang/index.ts:1`, `src/lang/index.ts:2`, `src/lang/index.ts:3`, `src/lang/index.ts:4`.

### F2 - `src/lang/detector.ts` is explicit stack/language probing by markers and extensions

`detectProjectLanguages(projectDir)` scans the root and immediate subdirectories, checks every language profile's `build.detectFiles`, and also detects languages by file extension. It ignores unreadable directories and skips dot directories plus `node_modules` for the one-level subdirectory scan. Citations: `src/lang/detector.ts:25`, `src/lang/detector.ts:26`, `src/lang/detector.ts:27`, `src/lang/detector.ts:31`, `src/lang/detector.ts:45`, `src/lang/detector.ts:46`, `src/lang/detector.ts:47`, `src/lang/detector.ts:51`, `src/lang/detector.ts:60`, `src/lang/detector.ts:64`, `src/lang/detector.ts:71`, `src/lang/detector.ts:74`, `src/lang/detector.ts:79`, `src/lang/detector.ts:81`, `src/lang/detector.ts:96`.

The same module exposes `getProfileForFile(filePath)`, resolving a language profile by extension. This is used by prompt injection and syntax/SAST tools, so detection is both project-level and file-level. Citations: `src/lang/detector.ts:13`, `src/lang/detector.ts:17`, `src/lang/detector.ts:20`, `src/lang/detector.ts:22`, `src/hooks/system-enhancer.ts:343`, `src/tools/syntax-check.ts:148`, `src/tools/sast-scan.ts:317`.

### F3 - Language profiles encode stack-specific commands, prompts, and marker files

The profile model is deliberately stack-aware: each `LanguageProfile` has extensions, tree-sitter grammar, build/test/lint/audit detection files, commands, and prompt constraints/checklists. Citations: `src/lang/profiles.ts:29`, `src/lang/profiles.ts:33`, `src/lang/profiles.ts:38`, `src/lang/profiles.ts:39`, `src/lang/profiles.ts:42`, `src/lang/profiles.ts:43`, `src/lang/profiles.ts:46`, `src/lang/profiles.ts:47`, `src/lang/profiles.ts:50`, `src/lang/profiles.ts:51`, `src/lang/profiles.ts:59`, `src/lang/profiles.ts:60`, `src/lang/profiles.ts:61`, `src/lang/profiles.ts:62`.

Concrete marker coverage includes TypeScript/JavaScript via `package.json`, Python via `setup.py`/`pyproject.toml`/`setup.cfg`, Rust via `Cargo.toml`, Go via `go.mod`, Java/Kotlin via Maven/Gradle files, and .NET via `*.csproj`/`*.sln`. Citations: `src/lang/profiles.ts:109`, `src/lang/profiles.ts:119`, `src/lang/profiles.ts:205`, `src/lang/profiles.ts:212`, `src/lang/profiles.ts:276`, `src/lang/profiles.ts:283`, `src/lang/profiles.ts:346`, `src/lang/profiles.ts:353`, `src/lang/profiles.ts:412`, `src/lang/profiles.ts:419`, `src/lang/profiles.ts:494`, `src/lang/profiles.ts:501`, `src/lang/profiles.ts:576`, `src/lang/profiles.ts:583`.

### F4 - Build discovery is profile-first, then ecosystem fallback

`build_check` delegates command selection to `discoverBuildCommands`. That function first runs profile-driven detection via `detectProjectLanguages`, pulls the full registry profile, sorts profile commands by priority, checks required marker files, checks whether the command binary is available on `PATH`, and picks the first available command. Citations: `src/tools/build-check.ts:190`, `src/tools/build-check.ts:201`, `src/build/discovery.ts:348`, `src/build/discovery.ts:354`, `src/build/discovery.ts:355`, `src/build/discovery.ts:359`, `src/build/discovery.ts:367`, `src/build/discovery.ts:375`, `src/build/discovery.ts:377`, `src/build/discovery.ts:385`, `src/build/discovery.ts:386`, `src/build/discovery.ts:393`.

The fallback `ECOSYSTEMS` table separately probes Node, Rust, Go, Python, Maven, Gradle, .NET, Swift, Dart, C/C++, and PHP Composer through marker files and toolchain commands. Citations: `src/build/discovery.ts:38`, `src/build/discovery.ts:40`, `src/build/discovery.ts:41`, `src/build/discovery.ts:51`, `src/build/discovery.ts:52`, `src/build/discovery.ts:60`, `src/build/discovery.ts:61`, `src/build/discovery.ts:66`, `src/build/discovery.ts:67`, `src/build/discovery.ts:75`, `src/build/discovery.ts:76`, `src/build/discovery.ts:81`, `src/build/discovery.ts:82`, `src/build/discovery.ts:96`, `src/build/discovery.ts:97`, `src/build/discovery.ts:102`, `src/build/discovery.ts:103`, `src/build/discovery.ts:108`, `src/build/discovery.ts:109`, `src/build/discovery.ts:117`, `src/build/discovery.ts:118`, `src/build/discovery.ts:126`, `src/build/discovery.ts:127`.

Important caveat: the TypeScript profile's highest-priority build/test commands are Bun-flavored when `package.json` exists. If Bun is on `PATH`, profile detection can select `bun run build` or `bun test` before npm/vitest/jest fallback behavior. Citations: `src/lang/profiles.ts:119`, `src/lang/profiles.ts:122`, `src/lang/profiles.ts:123`, `src/lang/profiles.ts:141`, `src/lang/profiles.ts:147`, `src/lang/profiles.ts:152`, `src/lang/profiles.ts:154`, `src/build/discovery.ts:382`, `src/build/discovery.ts:385`, `src/build/discovery.ts:393`.

### F5 - Test execution probes frameworks across languages and reports targetability limits

`test_runner` supports many frameworks: Bun, Vitest, Jest, Mocha, pytest, cargo, Pester, Go, Maven, Gradle, dotnet, CTest, Swift, Dart, RSpec, and Minitest. Citations: `src/tools/test-runner.ts:28`, `src/tools/test-runner.ts:30`, `src/tools/test-runner.ts:34`, `src/tools/test-runner.ts:35`, `src/tools/test-runner.ts:37`, `src/tools/test-runner.ts:38`, `src/tools/test-runner.ts:40`, `src/tools/test-runner.ts:42`, `src/tools/test-runner.ts:44`, `src/tools/test-runner.ts:45`.

Framework detection checks JS/TS via `package.json` scripts/dependencies and lockfiles, Python via `pyproject.toml`/`setup.cfg`/`requirements.txt`, Rust via `Cargo.toml`, PowerShell/Pester markers, then additional language detectors such as Go `go.mod`, Maven `pom.xml`, Gradle files, .NET projects, CMake, Swift, Dart, Ruby/RSpec, and Ruby/Minitest. Citations: `src/tools/test-runner.ts:286`, `src/tools/test-runner.ts:288`, `src/tools/test-runner.ts:290`, `src/tools/test-runner.ts:303`, `src/tools/test-runner.ts:304`, `src/tools/test-runner.ts:307`, `src/tools/test-runner.ts:327`, `src/tools/test-runner.ts:329`, `src/tools/test-runner.ts:333`, `src/tools/test-runner.ts:344`, `src/tools/test-runner.ts:352`, `src/tools/test-runner.ts:354`, `src/tools/test-runner.ts:372`, `src/tools/test-runner.ts:389`, `src/tools/test-runner.ts:390`, `src/tools/test-runner.ts:391`, `src/tools/test-runner.ts:392`, `src/tools/test-runner.ts:393`, `src/tools/test-runner.ts:394`, `src/tools/test-runner.ts:395`, `src/tools/test-runner.ts:396`, `src/tools/test-runner.ts:397`, `src/tools/test-runner.ts:398`.

The runner also encodes framework limitations instead of pretending all stacks support file-targeted execution. Go, cargo, Maven, Gradle, .NET, CTest, and Swift return explicit targeted-execution unsupported reasons. Citations: `src/tools/test-runner.ts:870`, `src/tools/test-runner.ts:873`, `src/tools/test-runner.ts:875`, `src/tools/test-runner.ts:877`, `src/tools/test-runner.ts:879`, `src/tools/test-runner.ts:881`, `src/tools/test-runner.ts:883`, `src/tools/test-runner.ts:885`, `src/tools/test-runner.ts:1344`, `src/tools/test-runner.ts:1351`, `src/tools/test-runner.ts:1358`, `src/tools/test-runner.ts:1359`.

### F6 - Package audit has independent ecosystem auto-detection

`pkg_audit` exposes `ecosystem: "auto"` and explicitly describes auto-detection from project files. Its file detector checks `package.json`, `pyproject.toml` or `requirements.txt`, `Cargo.toml`, `go.mod`, `.csproj`/`.sln`, `Gemfile`/`Gemfile.lock`, `pubspec.yaml`, and `composer.lock`. Citations: `src/tools/pkg-audit.ts:101`, `src/tools/pkg-audit.ts:102`, `src/tools/pkg-audit.ts:106`, `src/tools/pkg-audit.ts:111`, `src/tools/pkg-audit.ts:119`, `src/tools/pkg-audit.ts:124`, `src/tools/pkg-audit.ts:129`, `src/tools/pkg-audit.ts:139`, `src/tools/pkg-audit.ts:147`, `src/tools/pkg-audit.ts:152`, `src/tools/pkg-audit.ts:1542`, `src/tools/pkg-audit.ts:1543`, `src/tools/pkg-audit.ts:1611`, `src/tools/pkg-audit.ts:1625`, `src/tools/pkg-audit.ts:1627`.

### F7 - Worker prompts are partially stack-neutral, but still leak TypeScript/Bun defaults

The coder prompt is not fully stack-neutral. Its general safety rules name TypeScript-specific constraints (`any`, import traversal), Node APIs, `path.join`, and Bun test framework requirements. Citations: `src/agents/coder.ts:77`, `src/agents/coder.ts:78`, `src/agents/coder.ts:80`, `src/agents/coder.ts:82`, `src/agents/coder.ts:83`, `src/agents/coder.ts:88`, `src/agents/coder.ts:89`, `src/agents/coder.ts:91`, `src/agents/coder.ts:92`, `src/agents/coder.ts:95`, `src/agents/coder.ts:96`, `src/agents/coder.ts:97`.

The test-engineer prompt is better: it explicitly maps TypeScript/JavaScript, Python, Go, PowerShell, Ruby, Java/Kotlin, C#, and "other languages" to expected frameworks or a test-runner support check. Still, it gives TS/JS a hard Bun preference. Citations: `src/agents/test-engineer.ts:41`, `src/agents/test-engineer.ts:42`, `src/agents/test-engineer.ts:43`, `src/agents/test-engineer.ts:44`, `src/agents/test-engineer.ts:45`, `src/agents/test-engineer.ts:46`, `src/agents/test-engineer.ts:47`, `src/agents/test-engineer.ts:48`, `src/agents/test-engineer.ts:49`, `src/agents/test-engineer.ts:50`, `src/agents/test-engineer.ts:51`, `src/agents/test-engineer.ts:71`, `src/agents/test-engineer.ts:76`, `src/agents/test-engineer.ts:77`.

### F8 - Stack adaptation reaches prompts through hooks, not config knobs

`system-enhancer.ts` builds language-specific coder, reviewer, and test-engineer blocks from file paths embedded in task text, then pulls constraints/checklists from the language profile registry. This is the worker-facing adaptation mechanism: task-file paths imply profile, profile implies prompt constraints. Citations: `src/hooks/system-enhancer.ts:324`, `src/hooks/system-enhancer.ts:328`, `src/hooks/system-enhancer.ts:333`, `src/hooks/system-enhancer.ts:334`, `src/hooks/system-enhancer.ts:342`, `src/hooks/system-enhancer.ts:343`, `src/hooks/system-enhancer.ts:348`, `src/hooks/system-enhancer.ts:358`, `src/hooks/system-enhancer.ts:361`, `src/hooks/system-enhancer.ts:365`, `src/hooks/system-enhancer.ts:370`, `src/hooks/system-enhancer.ts:380`, `src/hooks/system-enhancer.ts:385`, `src/hooks/system-enhancer.ts:395`, `src/hooks/system-enhancer.ts:398`, `src/hooks/system-enhancer.ts:402`, `src/hooks/system-enhancer.ts:407`, `src/hooks/system-enhancer.ts:415`, `src/hooks/system-enhancer.ts:420`.

By contrast, `src/config/schema.ts` exposes swarm name/agent overrides, hook flags, gates, context budgets, guardrail profiles, and similar framework settings; the targeted search found no `stack`, `targetLanguage`, or framework declaration knob. The closest relevant schema surface is agent/model override config, not target stack config. Citations: `src/config/schema.ts:83`, `src/config/schema.ts:84`, `src/config/schema.ts:85`, `src/config/schema.ts:102`, `src/config/schema.ts:103`, `src/config/schema.ts:104`, `src/config/schema.ts:105`, `src/config/schema.ts:110`, `src/config/schema.ts:111`, `src/config/schema.ts:248`, `src/config/schema.ts:275`.

## Answer to Q2

Resolved. opencode-swarm-main does not assume a single target stack at the tool layer. It has explicit project/file detection through `src/lang/`, `build_check`, `test_runner`, `pkg_audit`, and Laravel-specific framework overlay logic. The reusable architectural pattern is "detect stack at framework/tool boundaries, then inject stack-specific constraints into workers from declared task files."

The caveat is equally important: static worker prompts still contain TypeScript/Bun/Node assumptions. For a new `@code` LEAF agent, the cleaner pattern is to keep the static prompt stack-neutral and put language-specific rules behind detector-driven prompt injection or orchestrator-provided context.

## Implications for a new `@code` LEAF agent

1. Do not bake `bun:test`, TypeScript-only rules, or Node path rules into the base `@code` prompt.
2. Require task dispatch to include concrete file paths; use those paths as the primary stack signal.
3. Put marker-file probing in tools/hooks, not inside the LEAF worker's free-form reasoning.
4. Separate implementation substrate from target substrate: it is fine if the framework is TypeScript, but generated worker guidance must follow the target repo.
5. Return explicit `SKIPPED` or `BLOCKED` reasons when a stack cannot support the requested execution granularity.

## Remaining Questions

None. Q1, Q2, Q3, Q4, and Q5 are now resolved for Stream-02.

## Iteration Status

Status: insight.
New information ratio: 0.69.
Questions resolved this iteration: Q2.
