● skill(sk-code--review)

I’m loading the review baseline and the TypeScript overlay, then I’ll inspect every extractor together so I can compare sibling patterns instead of judging files in isolation.

● Read SKILL.md
  │ .opencode/skill/sk-code--opencode/SKILL.md
  └ 1 line read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/extractors/*.ts"
  └ 18 files found

I’ve got the file list. Next I’m pulling the TypeScript standards section plus a few cross-cutting pattern scans so I can spot inconsistencies quickly before reading the extractor bodies.

● Explore Review extractor patterns
  └ Agent started in background with agent_id: extractor-audit. You can use read_...

● Read index.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/index.ts
  └ 46 lines read

● Search (grep)
  │ "^## .*TypeScript|TypeScript|typescript|no any|strict"
  │ (.opencode/skill/sk-code--opencode/SKILL.md)
  └ 31 lines found

● Search (grep)
  │ "\bany\b|console\.|catch\s*\(|export\s+(async\s+)?function|export\s*\{|logger\.|validate|assert"
  │ in *.ts (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 64 lines found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/706cf74c-5ab0-461b-9765-9bfc0c431146/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 10 lines...

I’ve already found some obvious cross-file signals like mixed `console.*` usage and inconsistent validation. Now I’m pulling the exact standard text and the high-risk code regions so I can cite concrete line-level evidence instead of broad impressions.

● Read quality_standards.md
  │ .opencode/skill/sk-code--opencode/references/typescript/quality_standards.md
  └ 1 line read

● Read SKILL.md
  │ .opencode/skill/sk-code--opencode/SKILL.md
  └ L330:365 (36 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-code--opencode/SKILL.md
  └ L600:640 (41 lines read)

● Read quick_reference.md
  │ .opencode/skill/sk-code--opencode/references/typescript/quick_reference.md
  └ 539 lines read

● Search (grep)
  │ "^export\s|^interface\s|^type\s|^async function|^function\s" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 5 lines found

● Count extractor file lines (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts/extractors' && wc -l *.ts
  └ 20 lines...

I’ve confirmed the overlay standards: typed catches, guard-clause validation, named exports, and consistent module structure are the main criteria. Now I’m doing a cross-file sweep for validation, logging, and error-handling hotspots before drilling into the individual implementations.

● Read quality_standards.md
  │ .opencode/skill/sk-code--opencode/references/typescript/quality_standards.md
  └ L1:260 (259 lines read)

● Search (grep)
  │ "catch\s*\(.*unknown|catch\s*\{|try\s*\{" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 10 files found

● Search (grep)
  │ "validateDataStructure|validate[A-Z][A-Za-z]+|assert[A-Z]|if \(![A-Za-z]" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 17 files found

● Search (grep)
  │ "TODO|FIXME|HACK|XXX|eslint-disable|ts-ignore|@ts-ignore" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ No matches found

● Search (grep)
  │ "console\.(log|warn|error|debug)|logger\." in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 9 files found

● Search (grep)
  │ "\bany\b" in *.ts (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 2 lines found

I’ve ruled out a big class of issues already: there’s effectively no explicit `any` usage or `ts-ignore` debt in this folder. The remaining work is mostly about consistency—validation, error propagation, and whether sibling extractors expose a coherent contract.

● Read diagram-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts
  └ L1:223 (223 lines read)

● Read decision-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ L1:260 (260 lines read)

● Read conversation-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts
  └ L1:220 (219 lines read)

● Read file-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
  └ L1:220 (219 lines read)

● Read session-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
  └ L1:260 (260 lines read)

● Read session-activity-signal.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/session-activity-signal.ts
  └ L1:260 (260 lines read)

● Read spec-folder-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts
  └ L1:260 (260 lines read)

● Read implementation-guide-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts
  └ L1:260 (260 lines read)

● Read contamination-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ L1:199 (199 lines read)

● Read git-context-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts
  └ L1:260 (259 lines read)

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
  └ L1:235 (235 lines read)

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L1:260 (260 lines read)

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L1:260 (260 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L1:260 (260 lines read)

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ L1:260 (260 lines read)

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L1:260 (260 lines read)

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ L1:260 (260 lines read)

The folder has split into three clear cohorts: “pure” transformers, orchestration-heavy extractors, and capture adapters. The biggest standards drift is between those cohorts, especially around logging and whether bad input is rejected, downgraded, or silently ignored.

● Search (grep)
  │ "console\.(log|warn|error|debug)|structuredLog|logger\." in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 21 lines found

● Search (grep)
  │ "validateDataStructure|validateDescription|validateAnchorUniqueness|isDescriptionValid|if
  │ \(![A-Za-z_][A-Za-z0-9_]*\)|throw new Error|throw error|return null;|return \[\];" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 5 lines found

● Search (grep)
  │ "catch\s*\(([^)]*)\)|catch\s*\{" in *.ts (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 37 lines found

● Read (Explore agent — Review extractor patterns)
  └ Running

I’ve got enough raw data to start scoring the standards drift. I’m now checking the public entry points and the tail sections, because that’s where contract consistency, validation, and export patterns usually become obvious.

● Read conversation-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts
  └ L220:275 (56 lines read)

● Read spec-folder-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts
  └ L260:394 (135 lines read)

● Read git-context-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts
  └ L260:504 (245 lines read)

● Read file-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
  └ L220:447 (228 lines read)

● Read session-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
  └ L260:556 (297 lines read)

● Search (grep)
  │ "export (async )?function|async function [A-Za-z0-9_]+\(|function [A-Za-z0-9_]+\(" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 5 lines found

I’ve found at least one concrete hygiene defect already: `diagram-extractor.ts` appears to import `generateDecisionTree` without ever using it. I’m running the workspace’s existing validation now to separate subjective style drift from issues the project itself already considers enforceable.

● Search (grep)
  │ "structuredLog|console\.|export async function capture|export async function
  │ extract|extract[A-Za-z]+\(|build[A-Za-z]+\("
  │ (.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 15 lines found

● Search (grep)
  │ "generateDecisionTree|generateDecisionTree\s*\("
  │ (.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts)
  └ 1 line found

● Run scripts lint and checks (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npm run -s lint && npm run -s check
  └ 12 lines...

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L680:968 (289 lines read)

● Read implementation-guide-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts
  └ L260:407 (148 lines read)

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L260:414 (155 lines read)

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ L260:394 (135 lines read)

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ L260:471 (212 lines read)

● Read decision-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ L260:614 (355 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L140:260 (121 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L520:860 (341 lines read)

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L520:731 (212 lines read)

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L100:220 (121 lines read)

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L620:760 (141 lines read)

● Search (grep)
  │ "export async function captureClaudeConversation|export async function
  │ captureCopilotConversation|export async function captureCodexConversation|export async function
  │ captureGeminiConversation|export async function captureConversation|async function
  │ collectSessionData|export async function collectSessionData" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 5 lines found

The background review is ready, so I’m cross-checking it against the evidence I already pulled. After that I’ll consolidate everything into a findings-first audit with the cross-extractor inconsistencies called out explicitly.

● Read (Explore agent — Review extractor patterns)
  └ idle

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ L96:120 (25 lines read)

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ L120:140 (21 lines read)

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L60:90 (31 lines read)

The existing workspace checks are interesting: lint/check passed cleanly, so the main problems here are consistency gaps the tooling doesn’t currently enforce. I’m doing one last pass on build health and a few suspect files, then I’ll hand back the audit.

● Read diagram-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts
  └ L10:25 (16 lines read)

● Read conversation-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts
  └ L52:75 (23 lines read)

● Read decision-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ L182:198 (17 lines read)

● Search (grep)
  │ "generateDecisionTree|console\.(log|warn|debug)|structuredLog|catch \{|catch
  │ \([^)]*unknown\)|return \{ DECISIONS:
  │ \[\]|createConversationData|createDiagramData|createSimulationPhases" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 64 lines found

● Run scripts build (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npm run -s build
  └ 1 line...

## Findings

### P1 - High

1. **Silent error suppression is common in the capture adapters**, which conflicts with the TypeScript error-handling standard’s typed-catch + meaningful-context pattern. Representative cases: `claude-code-capture.ts:101-118,125-148`, `codex-cli-capture.ts:100-117,212-219`, `copilot-cli-capture.ts:67-84`, `gemini-cli-capture.ts:130-134,202-209,234-249`, `spec-folder-extractor.ts:50-55,305-309`. These paths return `[]`, `null`, or `{}`-equivalents without surfacing why capture/parsing failed.

2. **There is no common failure/fallback contract across sibling extractors.** `conversation-extractor.ts:55-58` and `diagram-extractor.ts:124-127` synthesize data, `decision-extractor.ts:187-190` returns an empty structured payload, capture adapters like `captureCopilotConversation()` and peers return `null` (`copilot-cli-capture.ts:202-205,379-380`; `codex-cli-capture.ts:307-314,436-437`; `gemini-cli-capture.ts:262-269,358-359`; `claude-code-capture.ts:525-533,690-691`), while `git-context-extractor.ts:499-503` degrades to `emptyResult()`. Consumers have to know each extractor’s private contract.

3. **Several entry-point functions are too large for the folder’s otherwise extractor-oriented design**, which weakens SRP and consistency: `extractDecisions` spans `decision-extractor.ts:182-604`, `collectSessionData` spans `collect-session-data.ts:675-948`, `extractConversations` spans `conversation-extractor.ts:52-265`, `captureClaudeConversation` spans `claude-code-capture.ts:525-720`, `captureCopilotConversation` spans `copilot-cli-capture.ts:202-405`, and `captureCodexConversation` spans `codex-cli-capture.ts:307-462`.

### P2 - Medium

4. **Logging is inconsistent across extractors, and even within a single file.** `collect-session-data.ts` imports and uses `structuredLog` (`18`, `718-724`) but still uses `console.log`/`console.warn` at `700`, `731`, and `850`. Siblings use raw console output too: `conversation-extractor.ts:56,64-73`, `diagram-extractor.ts:55,125`, `decision-extractor.ts:195`, `file-extractor.ts:147,256,308`, `git-context-extractor.ts:501`. The folder does not follow a single logging policy.

5. **The capture adapters duplicate helper shapes and flow almost verbatim** instead of sharing typed utilities. Repeated patterns include `PendingPrompt`, `transcriptTimestamp`, `readJsonl`, `normalizeToolName`, and `stringifyPreview` in `claude-code-capture.ts`, `codex-cli-capture.ts`, `copilot-cli-capture.ts`, and `gemini-cli-capture.ts`. This is a DRY inconsistency more than a correctness bug, but it raises long-term divergence risk.

6. **Input validation is uneven.** Good examples exist (`quality-scorer.ts:79-100`, `contamination-filter.ts:136-143`, `collect-session-data.ts:826-842`), but several public entry points trust inputs and degrade later instead of guarding early, such as `extractSpecFolderContext(specFolderPath)` in `spec-folder-extractor.ts:301-394` and `extractGitContext(projectRoot, specFolderHint?)` in `git-context-extractor.ts:359-504`.

7. **`diagram-extractor.ts` contains dead code via an unused import**: `generateDecisionTree` is imported at `diagram-extractor.ts:19` and never used. That is the clearest concrete dead-code issue in the folder.

### P3 - Low

8. **Export style is named-only overall, which is good, but not consistent.** Many files use explicit end-of-file export blocks (`conversation-extractor.ts:271-275`, `decision-extractor.ts:610-614`, `quality-scorer.ts:226-235`), while `spec-folder-extractor.ts:301` and `git-context-extractor.ts:199,359` export inline and skip a dedicated exports section. This is standards drift, not a blocker.

## Summary

**Files reviewed**: 18 extractor files  
**Overall assessment**: `REQUEST_CHANGES`  
**Baseline used**: `sk-code--review`  
**Overlay used**: `sk-code--opencode`

Strong alignment areas: no explicit `any`, no `ts-ignore`, named exports dominate, and the smaller pure transformers (`contamination-filter.ts`, `quality-scorer.ts`, `session-activity-signal.ts`) are the cleanest standards matches.

Per-file highlights: `quality-scorer.ts`, `contamination-filter.ts`, `session-activity-signal.ts`, and `implementation-guide-extractor.ts` are the strongest. `file-extractor.ts`, `conversation-extractor.ts`, `diagram-extractor.ts`, `decision-extractor.ts`, `session-extractor.ts`, `spec-folder-extractor.ts`, `git-context-extractor.ts`, and `collect-session-data.ts` are typed well but diverge on fallback/logging/size. The five capture adapters are the weakest cohort because of repeated helper duplication and silent catches.

Verification note: `npm run -s lint`, `npm run -s check`, and `npm run -s build` all passed in `.opencode/skill/system-spec-kit/scripts`, so these are mostly **standards and consistency gaps that current tooling does not enforce**.

