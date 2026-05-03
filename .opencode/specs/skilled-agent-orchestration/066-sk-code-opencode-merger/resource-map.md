---
title: "Resource Map: sk-code-opencode-merger"
description: "Path ledger for the plan-only sk-code-opencode into sk-code merger analysis."
trigger_phrases:
  - "resource map"
  - "sk-code-opencode merger paths"
  - "affected files"
importance_tier: "important"
contextType: "resource-map"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/066-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T15:00:00Z"
    last_updated_by: "multi-ai-council"
    recent_action: "Deep-analysis session resolved all open questions; deletion/regeneration decisions documented"
    next_safe_action: "Await implementation approval"
    blockers:
      - "Implementation not approved"
    key_files:
      - ".opencode/skill/sk-code/SKILL.md"
      - ".opencode/skill/sk-code-opencode/SKILL.md"
      - ".opencode/barter/sk-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660666"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Resource map created."
      - "Historical changelogs: DELETE (13 files)."
      - "Telemetry JSONL: REGENERATE."
      - "Route name: opencode/OPENCODE."
      - "Two-axis detection: Code Surface → Intent Classification."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 161 path entries
- **By category**: READMEs=8, Documents=3, Commands=5, Agents=20, Skills=83, Specs=7, Scripts=2, Tests=28, Config=3, Meta=2
- **Missing on disk**: 0
- **Scope**: active non-archived paths analyzed for the future `sk-code-opencode` into `sk-code` merger; historical archived specs and scratch outputs were excluded from the active rewrite list
- **Generated**: 2026-05-03T13:04:06+02:00

Action vocabulary: `Created`, `Updated`, `Analyzed`, `Removed`, `Cited`, `Validated`, `Moved`, `Renamed`.
Status vocabulary: `OK`, `MISSING`, `PLANNED`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/install_guides/README.md` | Analyzed | OK | Mentions `sk-code-opencode` in skill inventory |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Analyzed | OK | Mentions `sk-code-opencode` and old skill counts |
| `.opencode/skill/README.md` | Analyzed | OK | Skill inventory and code quality overlay narrative |
| `.opencode/skill/sk-code/README.md` | Analyzed | OK | Says `sk-code-opencode` is a sibling, not subsumed |
| `.opencode/skill/sk-code-opencode/README.md` | Analyzed | OK | Source README to merge, move, or archive |
| `.opencode/skill/sk-code-review/README.md` | Analyzed | OK | Baseline plus overlay contract |
| `.opencode/skill/system-spec-kit/scripts/extractors/README.md` | Analyzed | OK | Verifier path example points at old skill |
| `.opencode/skill/system-spec-kit/scripts/loaders/README.md` | Analyzed | OK | Verifier path example points at old skill |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/scripts/ops/README.md` | Analyzed | OK | Verifier path example points at old skill |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md` | Analyzed | OK | Mentions code standards alignment |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Analyzed | OK | Feature catalog likely needs current skill path review |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Analyzed | OK | Mentions `sk-code-*` overlay phase |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Analyzed | OK | Mentions `sk-code-*` overlay phase |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Analyzed | OK | Mentions `sk-code-*` overlay phase |
| `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml` | Analyzed | OK | Mentions `sk-code-*` overlay phase |
| `.opencode/command/spec_kit/deep-review.md` | Analyzed | OK | Mentions code review overlay behavior |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agent/code.md` | Analyzed | OK | Mentions supported stacks `WEBFLOW, GO, NEXTJS` and overlay model |
| `.opencode/agent/review.md` | Analyzed | OK | Requires one `sk-code-*` overlay |
| `.opencode/agent/deep-review.md` | Analyzed | OK | Mentions `sk-code-opencode` / `sk-code` overlay |
| `.opencode/agent/orchestrate.md` | Analyzed | OK | Dispatch table mentions `sk-code-*` overlays |
| `.opencode/agent/multi-ai-council.md` | Analyzed | OK | Mentions `sk-code-*` code standards |
| `.claude/agents/code.md` | Analyzed | OK | Mentions supported stacks `WEBFLOW, GO, NEXTJS` and overlay model |
| `.claude/agents/review.md` | Analyzed | OK | Requires one `sk-code-*` overlay |
| `.claude/agents/deep-review.md` | Analyzed | OK | Mentions `sk-code-opencode` / `sk-code` overlay |
| `.claude/agents/orchestrate.md` | Analyzed | OK | Dispatch table mentions `sk-code-*` overlays |
| `.claude/agents/multi-ai-council.md` | Analyzed | OK | Mentions `sk-code-*` code standards |
| `.codex/agents/code.toml` | Analyzed | OK | Mentions supported stacks `WEBFLOW, GO, NEXTJS` and overlay model |
| `.codex/agents/review.toml` | Analyzed | OK | Requires one `sk-code-*` overlay |
| `.codex/agents/deep-review.toml` | Analyzed | OK | Mentions `sk-code-opencode` / `sk-code` overlay |
| `.codex/agents/orchestrate.toml` | Analyzed | OK | Dispatch table mentions `sk-code-*` overlays |
| `.codex/agents/multi-ai-council.toml` | Analyzed | OK | Mentions `sk-code-*` code standards |
| `.gemini/agents/code.md` | Analyzed | OK | Mentions supported stacks `WEBFLOW, GO, NEXTJS` and overlay model |
| `.gemini/agents/review.md` | Analyzed | OK | Requires one `sk-code-*` overlay |
| `.gemini/agents/deep-review.md` | Analyzed | OK | Mentions `sk-code-opencode` / `sk-code` overlay |
| `.gemini/agents/orchestrate.md` | Analyzed | OK | Dispatch table mentions `sk-code-*` overlays |
| `.gemini/agents/multi-ai-council.md` | Analyzed | OK | Mentions `sk-code-*` code standards |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/sk-code/SKILL.md` | Analyzed | OK | Target skill; add OpenCode route and remove Go/NextJS route claims |
| `.opencode/skill/sk-code/README.md` | Analyzed | OK | Target README; rewrite sibling-skill and supported-stack story |
| `.opencode/skill/sk-code/description.json` | Analyzed | OK | Refresh after route changes |
| `.opencode/skill/sk-code/graph-metadata.json` | Analyzed | OK | Refresh after route changes |
| `.opencode/skill/sk-code/references/router/stack_detection.md` | Analyzed | OK | Remove Go and NextJS detection claims |
| `.opencode/skill/sk-code/references/router/resource_loading.md` | Analyzed | OK | Remove Go/NextJS maps; add OpenCode route map |
| `.opencode/skill/sk-code/references/router/phase_lifecycle.md` | Analyzed | OK | Review lifecycle language after route changes |
| `.opencode/skill/sk-code/references/router/cross_stack_pairing.md` | Analyzed | OK | Remove or archive React/Go pairing contract |
| `.opencode/skill/sk-code/references/router/intent_classification.md` | Analyzed | OK | Remove Go/React route keywords or re-scope them |
| `.opencode/skill/sk-code/references/go/README.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/debugging/debugging_workflows.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/debugging/pprof_profiling.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/deployment/docker_railway.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/api_design.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/database_sqlc_postgres.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/error_envelopes.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/gin_handler_patterns.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/implementation_workflows.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/jwt_middleware.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/service_layer.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/implementation/validation_patterns.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/standards/code_style.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/go/verification/verification_workflows.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/checklists/code_quality_checklist.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/checklists/debugging_checklist.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/checklists/verification_checklist.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/patterns/handler_pattern.go` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/patterns/jwt_middleware.go` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/patterns/repository_sqlc.go` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/patterns/service_pattern.go` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/go/patterns/table_test_pattern_test.go` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/README.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/debugging/debugging_workflows.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/debugging/hydration_errors.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/deployment/vercel_deploy.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/accessibility_aria.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/api_integration.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/app_router_patterns.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/content_tinacms.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/forms_validation.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/implementation_workflows.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/motion_animation.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/implementation/vanilla_extract_styling.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/standards/code_style.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/references/nextjs/verification/verification_workflows.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/checklists/code_quality_checklist.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/checklists/debugging_checklist.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/checklists/verification_checklist.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/integrations/tinacms_bootstrap.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/integrations/untitled_ui_setup.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/integrations/vanilla_extract_setup.md` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/patterns/api_call_pattern.ts` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/patterns/form_pattern.tsx` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/patterns/motion_v12_pattern.tsx` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/patterns/server_action_pattern.tsx` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code/assets/nextjs/patterns/vanilla_extract_recipe.css.ts` | Removed | OK | Future deletion candidate |
| `.opencode/skill/sk-code-opencode/SKILL.md` | Moved | OK | Source skill instructions to merge into `sk-code` |
| `.opencode/skill/sk-code-opencode/README.md` | Moved | OK | Source README to merge or archive |
| `.opencode/skill/sk-code-opencode/graph-metadata.json` | Moved | OK | Regenerate under `sk-code` or archive |
| `.opencode/skill/sk-code-opencode/references/shared/universal_patterns.md` | Moved | OK | OpenCode universal patterns |
| `.opencode/skill/sk-code-opencode/references/shared/code_organization.md` | Moved | OK | OpenCode organization guidance |
| `.opencode/skill/sk-code-opencode/references/shared/hooks.md` | Moved | OK | Runtime hook guidance |
| `.opencode/skill/sk-code-opencode/references/shared/alignment_verification_automation.md` | Moved | OK | Verifier automation contract |
| `.opencode/skill/sk-code-opencode/references/javascript/style_guide.md` | Moved | OK | JavaScript route guidance |
| `.opencode/skill/sk-code-opencode/references/javascript/quality_standards.md` | Moved | OK | JavaScript route guidance |
| `.opencode/skill/sk-code-opencode/references/javascript/quick_reference.md` | Moved | OK | JavaScript route guidance |
| `.opencode/skill/sk-code-opencode/references/typescript/style_guide.md` | Moved | OK | TypeScript route guidance |
| `.opencode/skill/sk-code-opencode/references/typescript/quality_standards.md` | Moved | OK | TypeScript route guidance |
| `.opencode/skill/sk-code-opencode/references/typescript/quick_reference.md` | Moved | OK | TypeScript route guidance |
| `.opencode/skill/sk-code-opencode/references/python/style_guide.md` | Moved | OK | Python route guidance |
| `.opencode/skill/sk-code-opencode/references/python/quality_standards.md` | Moved | OK | Python route guidance |
| `.opencode/skill/sk-code-opencode/references/python/quick_reference.md` | Moved | OK | Python route guidance |
| `.opencode/skill/sk-code-opencode/references/shell/style_guide.md` | Moved | OK | Shell route guidance |
| `.opencode/skill/sk-code-opencode/references/shell/quality_standards.md` | Moved | OK | Shell route guidance |
| `.opencode/skill/sk-code-opencode/references/shell/quick_reference.md` | Moved | OK | Shell route guidance |
| `.opencode/skill/sk-code-opencode/references/config/style_guide.md` | Moved | OK | Config route guidance |
| `.opencode/skill/sk-code-opencode/references/config/quality_standards.md` | Moved | OK | Config route guidance |
| `.opencode/skill/sk-code-opencode/references/config/quick_reference.md` | Moved | OK | Config route guidance |
| `.opencode/skill/sk-code-opencode/assets/checklists/universal_checklist.md` | Moved | OK | Checklist to merge |
| `.opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md` | Moved | OK | Checklist to merge |
| `.opencode/skill/sk-code-opencode/assets/checklists/typescript_checklist.md` | Moved | OK | Checklist to merge |
| `.opencode/skill/sk-code-opencode/assets/checklists/python_checklist.md` | Moved | OK | Checklist to merge |
| `.opencode/skill/sk-code-opencode/assets/checklists/shell_checklist.md` | Moved | OK | Checklist to merge |
| `.opencode/skill/sk-code-opencode/assets/checklists/config_checklist.md` | Moved | OK | Checklist to merge |
| `.opencode/skill/sk-code-review/SKILL.md` | Analyzed | OK | Update overlay selection contract |
| `.opencode/skill/sk-code-review/references/quick_reference.md` | Analyzed | OK | Update overlay model |
| `.opencode/skill/sk-code-review/references/review_core.md` | Analyzed | OK | Update baseline plus overlay doctrine |
| `.opencode/skill/sk-code-review/references/code_quality_checklist.md` | Analyzed | OK | Check for overlay references |
| `.opencode/skill/sk-code-review/references/removal_plan.md` | Analyzed | OK | Check for overlay references |
| `.opencode/skill/cli-claude-code/SKILL.md` | Analyzed | OK | Dispatch guidance mentions baseline plus overlay and `sk-code-opencode` example |
| `.opencode/skill/cli-codex/SKILL.md` | Analyzed | OK | Check CLI dispatch guidance |
| `.opencode/skill/cli-copilot/SKILL.md` | Analyzed | OK | Check CLI dispatch guidance |
| `.opencode/skill/cli-gemini/SKILL.md` | Analyzed | OK | Dispatch guidance mentions baseline plus overlay and `sk-code-opencode` example |
| `.opencode/skill/cli-opencode/SKILL.md` | Analyzed | OK | Check CLI dispatch guidance |
| `.opencode/skill/sk-deep-review/SKILL.md` | Analyzed | OK | Check review overlay references |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/spec.md` | Created | OK | This planning spec |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/plan.md` | Created | OK | This implementation plan |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/tasks.md` | Created | OK | Future task list |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/checklist.md` | Created | OK | Verification checklist |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/decision-record.md` | Created | OK | ADR |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/implementation-summary.md` | Created | OK | Planning-only summary |
| `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md` | Created | OK | This resource map |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py` | Moved | OK | Move into `sk-code/scripts/` or equivalent |
| `.opencode/skill/sk-code-opencode/scripts/test_verify_alignment_drift.py` | Moved | OK | Move with verifier or relocate under tests |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-brief-producer.vitest.ts` | Analyzed | OK | Legacy advisor expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-renderer.vitest.ts` | Analyzed | OK | Legacy advisor brief output |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-runtime-parity.vitest.ts` | Analyzed | OK | Legacy runtime parity expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-fixtures/ambiguousTopTwo.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-fixtures/livePassingSkill.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-fixtures/noPassingSkill.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-fixtures/promptPoisoningAdversarial.json` | Analyzed | OK | Fixture expected skill and prompt-injection coverage |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-fixtures/staleHighConfidenceSkill.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/ambiguousTopTwo.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/livePassingSkill.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/noPassingSkill.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/promptPoisoningAdversarial.json` | Analyzed | OK | Fixture expected skill and prompt-injection coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/staleHighConfidenceSkill.json` | Analyzed | OK | Fixture expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts` | Analyzed | OK | Hook brief expects old skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-prompt-wrapper.vitest.ts` | Analyzed | OK | Codex wrapper expected brief |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | Analyzed | OK | Hook brief expects old skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts` | Analyzed | OK | Hook brief expects old skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts` | Analyzed | OK | Hook brief expects old skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts` | Analyzed | OK | Shared payload skill label and injection fixture |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts` | Analyzed | OK | Measurement output expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts` | Analyzed | OK | Writes test skill and expected advisor result |
| `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-telemetry.vitest.ts` | Analyzed | OK | Telemetry expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` | Analyzed | OK | Plugin bridge output expected skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts` | Analyzed | OK | Input schema target skill ID |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts` | Analyzed | OK | Stress expected top skill |
| `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts` | Analyzed | OK | Must preserve prompt-injection test path sanitization |
| `.opencode/skill/system-spec-kit/scripts/tests/alignment-drift-fixture-preservation.vitest.ts` | Analyzed | OK | Check if verifier move affects fixture assumptions |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Analyzed | OK | Regression cases expect `sk-code-opencode` |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Analyzed | OK | Generated graph includes `sk-code-opencode` family and edges |
| `.opencode/skill/.smart-router-telemetry/compliance.jsonl` | Analyzed | OK | Generated telemetry contains historical selected skill values |
| `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` | Analyzed | OK | Generated measurement output contains historical selected skill values |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `AGENTS.md` | Analyzed | OK | Global/project instructions mention `sk-code-opencode` sibling and separate OpenCode system code workflow |
| `README.md` | Analyzed | OK | Root docs mention `sk-code`, `sk-code-opencode`, and `sk-code-*` overlays |
<!-- /ANCHOR:meta -->

---

## Historical Or Generated References

These were found during broad exact search. The deep-analysis session (2026-05-03) decided their handling:

### DELETE (historical changelogs — the merger IS the changelog)

- `.opencode/skill/sk-code-opencode/changelog/v1.0.0.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.1.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.2.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.3.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.4.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.5.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.6.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.7.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.8.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.0.9.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.1.0.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.1.1.0.md`
- `.opencode/skill/sk-code-opencode/changelog/v1.1.2.0.md`

### REGENERATE (generated data)

- `.opencode/skill/.smart-router-telemetry/compliance.jsonl`
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl`

### ARCHIVED (historical spec packages, not active rewrite targets)
### ARCHIVED (historical spec packages, not active rewrite targets)

- `.opencode/specs/skilled-agent-orchestration/054-sk-code-merger/*`
- `.opencode/specs/skilled-agent-orchestration/055-cli-skill-removal-sk-code-merger-deprecated/*`
- `.opencode/specs/skilled-agent-orchestration/056-sk-code-fullstack-branch/*`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/024-followup-quality-pass/001-sk-code-opencode-audit/*`

### Architecture Updates (from deep-analysis session)

| Change | Detail |
|--------|--------|
| Detection model | Two-axis: Code Surface (Webflow/OpenCode) → Intent Classification |
| Route name | `opencode` (folder) / `OPENCODE` (identifier) |
| Surface detection source | CWD + changed files (not git remote like Barter) |
| Language sub-detection | File extension → JS/TS/Python/Shell/Config (absorbed from sk-code-opencode) |
| OpenCode lifecycle | Full 5-phase (was standards-only) |
| Changelog policy | DELETE (13 files) |
| Telemetry policy | REGENERATE |
| `stack_detection.md` | Renamed → `code_surface_detection.md` |

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

Before implementation, re-run the exact searches that produced this map:

```bash
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!**/dist/**' --glob '!**/scratch/**' --glob '!**/z_archive/**' 'sk-code-opencode' AGENTS.md README.md .opencode .codex .claude .gemini
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!**/dist/**' --glob '!**/scratch/**' --glob '!**/z_archive/**' 'sk-code-\*|sk-code\*|overlay skill|one overlay|baseline\+overlay|baseline \+ one|sk-code-web|sk-code-full-stack' .opencode .codex .claude .gemini README.md AGENTS.md
rg -n --hidden '\b(GO|NEXTJS|Next\.js|React|go.mod|next.config|cross_stack_pairing)\b' .opencode/skill/sk-code
```

Keep implementation grouped by category. Do not delete `sk-code-opencode` until advisor, agent, command, and docs references are clean or intentionally classified historical.
<!-- /ANCHOR:author-instructions -->
