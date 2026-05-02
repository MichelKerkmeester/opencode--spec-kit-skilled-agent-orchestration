---
title: "Remediation Log: 048 Remaining P1/P2 Remediation"
description: "Per-finding outcome log for the remaining P1/P2 backlog after packet 046."
trigger_phrases:
  - "035-remaining-p1-p2-remediation"
  - "P1 P2 backlog"
  - "release polish"
  - "remediation log"
importance_tier: "important"
contextType: "implementation"
---
# Remediation Log: 048 Remaining P1/P2 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: custom-extension | v2.2 -->

---

## P1 Outcomes

| Finding | Outcome | Files |
|---------|---------|-------|
| 045/001-P1-1 | Applied: auto closeout no longer waits in plan auto; complete auto checkpoint protocol no longer pauses | `spec_kit_plan_auto.yaml`, `spec_kit_complete_auto.yaml` |
| 045/001-P1-2 | Applied conservative default: memory commands documented as markdown-only contracts | `memory/save.md`, `memory/search.md`, `memory/manage.md`, `decision-record.md` |
| 045/001-P1-3 | Applied: `/memory:save` Step 5 now states plan-only default and explicit apply/full-auto execution | `memory/save.md` |
| 045/002-P1-1 | Applied: `memory_health` returns structured consistency with rows, FTS rows, vector rows, and mismatch indicators | `memory-crud-health.ts` |
| 045/002-P1-2 | Applied: added file-backed multi-connection retention/write fixture | `memory-retention-sweep.vitest.ts`, `memory-index-db.ts` |
| 045/002-P1-3 | Applied: retention delete removes embedding-cache rows by content hash when cache table exists | `embedding-cache.ts`, `vector-index-mutations.ts` |
| 045/005-P1-1 | Deferred operator-only | `deferred-p2.md` |
| 045/005-P1-2 | Applied: OpenCode output shape now names system transform and `output.system` mutation | `skill-advisor-hook.md` |
| 045/005-P1-3 | Applied: Codex README snippet now names template-only status and live `hooks.json` requirement | `hooks/codex/README.md` |
| 045/006-P1-2 | Applied conservative default: hidden planner inputs documented internal-only | `handlers/save/types.ts`, `decision-record.md` |
| 045/006-P1-3 | Applied: scan and ingest start accept governance metadata and run shared validation | `tool-input-schemas.ts`, `memory-index.ts`, `memory-ingest.ts`, `scope-governance.ts` |
| 045/006-P1-4 | Applied: context server validates known tool args before metrics, priming, auto-surface, and dispatch | `context-server.ts` |
| 045/007-P1-1 | Applied partial: review YAML failure reason lists now include validator reasons; audited wrapper port remains larger than safe scope | `spec_kit_deep-review_auto.yaml`, `spec_kit_deep-review_confirm.yaml` |
| 045/007-P1-2 | Applied: prompt-pack examples and validator require full review JSONL schema and array-valued `filesReviewed` | `prompt_pack_iteration.md.tmpl`, `post-dispatch-validate.ts`, review YAML |
| 045/008-P1-1 | Applied: JSON validation results include `details` and `remediation` fields | `validate.sh` |
| 045/009-P1-1 | Applied: evergreen packet-history wording removed from ENV reference and architecture docs | `ENV_REFERENCE.md`, `ARCHITECTURE.md` |
| 045/009-P1-2 | Applied: stale 43/47 count references updated to 54 tool surface | `memory_system.md`, `environment_variables.md`, `SKILL.md` |
| 045/009-P1-3 | Applied: Skill Graph feature catalog entries added | `feature_catalog/22--context-preservation-and-code-graph/26-29-*.md` |
| 045/009-P1-4 | Applied: Skill Graph and coverage graph manual scenarios added | `manual_testing_playbook/22--context-preservation-and-code-graph/283-286-*.md` |
| 045/009-P1-5 | Applied: `advisor_rebuild` added to advisor overview, install guide, and quick-start call list | `skill_advisor/README.md`, `skill_advisor/INSTALL_GUIDE.md` |
| 045/009-P1-6 | Applied partial: root README broken release-note link repaired; broader generated link cleanup limited to touched entries | `README.md`, catalog/playbook indexes |
| 045/010-P1-1 | Applied: Node floor aligned to `>=20.11.0` in install guide, doctor YAML, and installer script | `INSTALL_GUIDE.md`, `doctor_mcp_install.yaml`, `install.sh` |
| 045/010-P1-2 | Applied: doctor supports VS Code `servers` and legacy `mcpServers` shapes | `mcp-doctor-lib.sh`, `mcp-doctor.sh` |
| 045/010-P1-3 | Applied: explicit `legacy_grandfathered:true` and validator strict-warning skip for grandfathered packets | legacy `graph-metadata.json`, `validate.sh`, rules README |

## Already Fixed in 046

| Finding | Handling |
|---------|----------|
| 045/003-P1-1 | Skipped: fixed in 046 |
| 045/004-P1-1 | Skipped: fixed in 046 |
| 045/004-P1-2 | Skipped: fixed in 046 |
| 045/006-P1-1 | Skipped: fixed in 046 |
| 045/004-P2-1 | Skipped: fixed in 046 |

## P2 Outcomes

| Finding | Outcome |
|---------|---------|
| 045/001-P2-1 | Applied: checkpoint-delete matrix now includes `[confirmName]` sequence |
| 045/003-P2-1 | Applied: Python forced/local path labeled as weaker compatibility fallback |
| 045/003-P2-2 | Applied: scorer weight docs/playbook updated to `derived_generated:0.15` |
| 045/005-P2-1 | Applied: Gemini hook output event name changed to `BeforeAgent` |
| 045/005-P2-2 | Applied: OpenCode missing-prompt branch records skipped status and `MISSING_PROMPT` |
| 045/006-P2-1 | Applied: schema README no longer hard-codes stale registry-key count |
| 045/006-P2-2 | Applied: strict-off documented as development-only in environment variables reference |
| 045/010-P2-4 | Partial: installer note corrected; protected local runtime config edits deferred |
| Other P2s | Deferred in `deferred-p2.md` |

## Verification Runs

| Command | Result |
|---------|--------|
| `npm run build` | PASS |
| Targeted Vitest | PASS: 4 files, 107 tests |
| Strict validator: legacy 005 packet | PASS |
| Strict validator: packet 048 | PASS: 0 errors, 0 warnings |
