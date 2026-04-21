---
title: "Implementation Summary: Smart-Router Remediation + OpenCode Plugin"
description: "Tracks Phase 023 delivery across router remediation, static validation, keyword tuning, CLI fallback safety, observe-only telemetry, and the OpenCode skill-advisor plugin."
trigger_phrases:
  - "023 smart router implementation summary"
  - "spec-kit-skill-advisor plugin shipped"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin"
    last_updated_at: "2026-04-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 023 implementation and verification"
    next_safe_action: "Roll out OpenCode plugin and collect observe-only telemetry before considering enforcement"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh"
      - ".opencode/plugins/spec-kit-skill-advisor.js"
      - ".opencode/plugins/spec-kit-skill-advisor-bridge.mjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 020 runtime code and skill_advisor.py are out of scope for modification."
---
# Implementation Summary: Smart-Router Remediation + OpenCode Plugin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-smart-router-remediation-and-opencode-plugin |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 023 shipped all six work areas from the 021 smart-router research packet and added the OpenCode `spec-kit-skill-advisor` plugin. The packet fixes stale route resources, adds static router validation, tunes conservative ON_DEMAND routing keywords, replaces silent CLI fallback with UNKNOWN disambiguation, creates observe-only telemetry, and delivers a bridge-backed OpenCode plugin that imports the Phase 020 advisor producer and renderer without modifying Phase 020 runtime code.

### Area A: Stale Route Paths

Fixed five stale references found by the Area A scan:

- `mcp-code-mode`: changed `DEFAULT_RESOURCE` from a nonexistent quick-reference resource to existing `.opencode/skill/mcp-code-mode/references/workflows.md`; rationale: dedicated quick-reference file is not present and workflows is the operational first-touch reference.
- `sk-improve-agent`: removed a nonexistent second-target evaluation resource from `TARGET_ONBOARDING`; rationale: no renamed replacement exists in the skill package, while `.opencode/skill/sk-improve-agent/references/target_onboarding.md` covers the live onboarding path.
- `sk-deep-research`: changed the auto workflow prose from skill-local `assets/spec_kit_deep-research_auto.yaml` to `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; rationale: workflow YAML lives under command assets.
- `sk-deep-review`: changed the auto workflow prose from skill-local `assets/spec_kit_deep-review_auto.yaml` to `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; rationale: workflow YAML lives under command assets.
- `sk-doc`: changed the feature catalog template reference to `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md`; rationale: template was moved under the documentation asset family.

### Area B: ON_DEMAND Keyword Tuning

Measured the 200-prompt corpus before and after ON_DEMAND keyword tuning.

| Metric | Result |
|--------|--------|
| Baseline ON_DEMAND union hit rate | 5.5% (11/200 prompts) |
| Tuned ON_DEMAND union hit rate | 48.0% (96/200 prompts) |
| Target | At least 15% |

Keyword additions were conservative domain phrases rather than generic English. Rationale by family:

- CLI skills: added explicit CLI-agent, prompt-template, web-research, schema, and delegation phrases that map to their extended prompt/template resources.
- MCP skills: added concrete tool-use phrases from the corpus such as HAR capture, ClickUp sprint tasks, semantic code search, Code Mode tool-chain language, and Figma component export.
- Code skills: added OpenCode-specific filenames and formats (`gate-3-classifier`, `skill_advisor.py`, `jsonl`, `mcp.json`), stack-specific implementation phrases, review finding phrases, and web/browser/UI phrases.
- Deep-loop skills: added lineage, iteration, artifact, convergence, and release-readiness phrases that indicate full protocol context is likely useful.
- Documentation, Git, prompt-improvement, and system-spec-kit skills: added concrete artifact names and workflow commands (`README`, manual testing playbook, feature catalog, git worktree, experiment branch, prompt package, `/memory:save`, `/spec_kit:resume`, `implementation-summary`, `tasks.md`).

For `sk-code-full-stack`, `sk-code-opencode`, and `sk-improve-agent`, which previously had no explicit ON_DEMAND keyword gate, the router pseudocode now includes an `ON_DEMAND_KEYWORDS` list and a small load branch that expands to the relevant checklist/resource set when those explicit phrases appear.

### Area C: CLI Fallback Safety

Updated all four CLI skill routers: `cli-claude-code`, `cli-codex`, `cli-copilot`, and `cli-gemini`.

Zero-score routing now returns:

- `intents: ["UNKNOWN"]`
- `load_level: "UNKNOWN_FALLBACK"`
- `needs_disambiguation: True`
- the existing CLI-specific `UNKNOWN_FALLBACK_CHECKLIST`
- baseline resources only, with no intent-mapped extended resources

Non-zero-score behavior is unchanged: intent scoring, ambiguity selection, conditional resources, ON_DEMAND resources, and the final safety net still follow the existing patterns.

### Area D: Static CI Check

Created `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh` as a Bash entry point with an embedded Python parser. The checker scans every top-level `.opencode/skill/*/SKILL.md`, extracts `references/*.md` and `assets/*.md` paths from canonical and variant router pseudocode, validates the files, computes ALWAYS-tier bytes versus the loadable markdown tree, emits text or `--json`, exits 1 only for missing paths, and treats bloat as an informational warning.

Current result: exit 0. Path validation passes on all 20 smart-routing skills. Five informational bloat warnings remain: `mcp-chrome-devtools` 52.32%, `mcp-clickup` 50.34%, `mcp-coco-index` 52.33%, `mcp-figma` 61.12%, and `sk-code-review` 68.63%. These warnings are informational per Area D and not failing conditions.

### Area E: Observe-Only Telemetry

Created `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts` with:

- `ComplianceRecord` and `ComplianceClass` exports
- pure `classifyCompliance(allowedResources, actualReads)`
- `recordSmartRouterCompliance(...)` JSONL append behavior
- default output path `.opencode/skill/.smart-router-telemetry/compliance.jsonl`
- `SPECKIT_SMART_ROUTER_TELEMETRY_PATH` override for tests and local diagnostics

Telemetry remains observe-only. It classifies records, appends JSONL, and never blocks caller behavior. The generated telemetry directory is ignored by git.

### Area F: OpenCode Skill Advisor Plugin

Created `.opencode/plugins/spec-kit-skill-advisor.js` and `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`.

Plugin behavior:

- default-export OpenCode plugin function
- `onSessionStart` initializes a per-session prompt cache
- `onUserPromptSubmitted` sends the prompt to the bridge over stdin and returns `{ additionalContext }`
- `onSessionEnd` clears the session cache
- prompt-safe `spec_kit_skill_advisor_status` tool reports settings, readiness, cache counts, and bridge state without raw prompts
- opt-out via `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` or `{ enabled: false }`
- settings: `cacheTTLMs`, `thresholdConfidence`, `maxTokens`, `nodeBinaryOverride`, `bridgeTimeoutMs`
- bridge timeout and bridge errors fail open with no injected context

Bridge behavior:

- reads JSON from stdin
- imports Phase 020 compiled `buildSkillAdvisorBrief`, `renderAdvisorBrief`, and metrics diagnostic helpers
- returns `{ brief, status, metadata }`
- returns `brief: null` and `status: fail_open` on errors

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `plan.md` | Created | Define delivery sequence and verification strategy |
| `tasks.md` | Created | Track Areas A-F progressively |
| `checklist.md` | Created | Track Level 2 verification evidence |
| `implementation-summary.md` | Created | Capture decisions, metrics, and final handoff |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Modified | Fix stale default smart-router resource path |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modified | Remove stale onboarding reference |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modified | Point auto workflow prose at live command YAML |
| `.opencode/skill/sk-deep-review/SKILL.md` | Modified | Point auto workflow prose at live command YAML |
| `.opencode/skill/sk-doc/SKILL.md` | Modified | Correct feature catalog template path |
| `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh` | Created | Add static CI check for router resource paths and ALWAYS-tier bloat |
| `.opencode/skill/*/SKILL.md` | Modified | Tune ON_DEMAND keyword phrases across all 20 smart-routing skills |
| `.opencode/skill/cli-{claude-code,codex,copilot,gemini}/SKILL.md` | Modified | Replace zero-score silent CLI fallback with UNKNOWN disambiguation |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-telemetry.ts` | Created | Observe-only router compliance recorder |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts` | Created | Test all compliance classes, JSONL roundtrip, idempotent directory creation, and path sanitization |
| `.gitignore` | Modified | Ignore `.opencode/skill/.smart-router-telemetry/` |
| `.opencode/skill/system-spec-kit/scripts/tsconfig.json` | Modified | Include `observability/**/*.ts` in script typechecking |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Created | OpenCode plugin for skill-advisor prompt injection |
| `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` | Created | Node bridge that imports Phase 020 advisor producer/renderer |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Created | Cache, status, opt-out, and timeout tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery followed the requested Area order with Area D moved immediately after Area A so the new checker validated the cleaned tree. Phase 020 runtime code and `skill_advisor.py` were left untouched; Area F imports the compiled Phase 020 producer/renderer through a separate bridge process. Documentation was updated progressively and final verification was recorded before handoff.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Execute Area A before Area D | The static checker should validate a clean current tree rather than immediately failing on known stale paths. |
| Keep plugin bridge-backed | The existing compact-code-graph plugin avoids native module ABI issues by using a Node bridge process. |
| Keep telemetry observe-only | 021/002 recommended measurement before enforcement, so the harness records compliance without blocking reads. |
| Return UNKNOWN for zero-score CLI routing | CLI skills should ask for disambiguation rather than silently defaulting to generation/deep reasoning. |
| Use Phase 020 advisor modules by import only | The plugin should reuse `buildSkillAdvisorBrief` and `renderAdvisorBrief` without changing the already-green Phase 020 hook surface. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Initial required reads | PASS: all user-required driver files were read before coding |
| `validate.sh --strict` after initial plan scaffold | PASS after packet doc scaffold and `spec.md` remediation |
| `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh` | PASS: exit 0, no missing paths, 5 informational bloat warnings |
| `.opencode/skill/system-spec-kit/scripts/spec/check-smart-router.sh --json` | PASS: exit 0, JSON emitted with empty `errors` array |
| ON_DEMAND hit-rate measurement | PASS: 5.5% before, 48.0% after on 200-prompt corpus |
| CLI fallback scan | PASS: four zero-score branches return `UNKNOWN`; no silent `GENERATION` fallback remains |
| Phase 020 advisor/hook regression suite | PASS: 19 files / 118 tests via targeted Phase 020 Vitest run |
| Telemetry + plugin tests | PASS: 2 files / 16 tests via `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/smart-router-telemetry.vitest.ts mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts --config mcp_server/vitest.config.ts` |
| TypeScript | PASS: `cd .opencode/skill/system-spec-kit && npm run typecheck` exited 0 |
| Final 023 strict validation | PASS: `validate.sh .../006-smart-router-remediation-and-opencode-plugin --strict` exited 0 with errors=0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Bloat warnings remain observe-only.** The static checker reports five ALWAYS-tier bloat warnings but exits 0 because Area D defines bloat as informational.
2. **Telemetry is not enforcement.** Runtime enforcement should wait until real compliance data has been collected from `.opencode/skill/.smart-router-telemetry/compliance.jsonl`.
3. **Plugin rollout remains a deployment step.** The plugin files are present and tested, but enabling them for users should be handled by the orchestrator or plugin marketplace/config workflow.
<!-- /ANCHOR:limitations -->
