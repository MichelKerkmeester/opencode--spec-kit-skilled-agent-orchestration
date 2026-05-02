#!/bin/bash
set -euo pipefail

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PHASE_DIR="$ROOT/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/009-round3-review-remediation"
LOG="$PHASE_DIR/fix-log.txt"
cd "$ROOT"

echo "=== Phase 009 Fix Dispatch ===" | tee "$LOG"
echo "Start: $(date)" | tee -a "$LOG"
echo "Primary: codex exec --model gpt-5.4 -c model_reasoning_effort=high -c service_tier=fast --full-auto" | tee -a "$LOG"
echo "Fallback: copilot -p --model gpt-5.4 --allow-all-tools" | tee -a "$LOG"

run_fix() {
  local batch="$1"
  local prompt="$2"
  echo "--- Batch $batch | $(date) ---" | tee -a "$LOG"

  if OUTPUT=$(codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "$prompt" 2>&1); then
    echo "  codex: SUCCESS" | tee -a "$LOG"
  else
    echo "  codex: FAILED, falling back to copilot" | tee -a "$LOG"
    OUTPUT=$(copilot -p "$prompt" --model gpt-5.4 --allow-all-tools 2>&1) || echo "  copilot: ALSO FAILED" | tee -a "$LOG"
  fi

  echo "--- Batch $batch done | $(date) ---" | tee -a "$LOG"
  echo "" | tee -a "$LOG"
}

# BATCH 1: Correctness
run_fix "1-correctness" "Fix 8 correctness bugs in the deep-loop reducers and helpers:

1. .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml + _confirm.yaml: Emit per-finding claim_adjudication events with findingId, finalSeverity, and transitions array before stop checks.

2. Same YAMLs: Add continuedFromRun with iteration count to restart event payloads.

3. .opencode/skill/sk-deep-review/scripts/reduce-state.cjs: In the veto freshness check, re-validate ALL active P0/P1 findings (not just new ones from latest iteration) before emitting a stop verdict.

4. Same file: In buildActiveRisks(), apply the same timestamp-based freshness check used in NEXT FOCUS so historical blocked_stop events don't show as current debt.

5. .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs: Coerce numeric strings for details.iteration in getTrajectory() — the journal stores iteration as string but trajectory math needs numbers.

6. .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs: Replace hard-coded composite/candidate-proposal key in recordMutation() with real dimension/mutation-family metadata from the caller.

7. .opencode/command/improve/assets/improve_improve-agent_auto.yaml + _confirm.yaml: Emit canonical legal_stop_evaluated and blocked_stop events with gate bundle, or update the reducer to consume the actual gate_evaluation payload shape.

8. .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs: Port the fail-closed JSONL parser pattern from sk-deep-review/reduce-state.cjs — throw STATE_CORRUPTION on corrupt lines instead of silently discarding them.

Make minimal targeted changes."

# BATCH 2: Security
run_fix "2-security" "Fix 10 security issues in workflow YAMLs and helper scripts:

1. All 4 spec_kit workflow YAMLs (deep-research auto+confirm, deep-review auto+confirm): Replace any inline shell string interpolation of spec_folder with parameter passing via argv. Do not interpolate user-controlled values into shell command strings.

2. Both improve-agent workflow YAMLs (auto+confirm): Remove any node -e inline evaluation. Move operations into the existing checked-in CJS scripts and pass data via argv or stdin.

3. .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs: Before every new RegExp(agentName) construction, escape regex metacharacters in the agent name string.

4. .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs + scan-integration.cjs: Add path containment checks verifying targets resolve under .opencode/agent/ before processing.

5. .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs: Apply the same approved-root containment policy to saveCorpus() and loadCorpus() that buildCorpus() already uses.

6. .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs: Validate all path segments before any mkdirSync call — reject paths that traverse through symlink parents.

7. .opencode/skill/system-spec-kit/references/templates/template_mapping.md + level_specifications.md: Replace any residual sign-off wording with approval-tracking terminology.

8. .opencode/skill/system-spec-kit/references/templates/level_specifications.md: Add stakeholder tracking to the Level 3+ definition alongside approval and compliance.

9. .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts: Fix schema_version migration edge case — treat missing version row as legacy state requiring drop/recreate.

Make minimal targeted changes."

# BATCH 3: Traceability — Reference Docs
run_fix "3-traceability-refs" "Fix 8 traceability issues in reference docs and root packet:

1. .opencode/skill/sk-deep-research/references/convergence.md: Rewrite ALL legalStop examples to the emitted blocked_stop schema with actual gate names.

2. .opencode/skill/sk-deep-research/references/loop_protocol.md: Change delta-only reducer refresh description to full-history replay as actually implemented.

3. .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml: Update the reducer input model from delta to fullJSONLHistory/iterationFiles contract.

4. Both skill loop protocols (sk-deep-research + sk-deep-review): Replace abbreviated pause/resume JSON snippets with canonical full-field event payloads.

5. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md + spec.md: Fix Phase 7 routing from 007-graph-aware-stop-gate to 007-skill-rename-improve-agent-prompt.

6. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md: Downgrade Lane 1-5 verification to PARTIAL where lifecycle drift is unresolved, or finish the cleanup.

7. Same file: Add explicit Lane-to-Finding-to-Commit mapping for remediation traceability.

Make minimal targeted changes."

# BATCH 4: Traceability — Mirrors + Root Docs
run_fix "4-traceability-mirrors" "Fix 14 traceability issues in agent mirrors and root docs:

1. .claude/agents/deep-review.md: Sync iteration skeleton Step 5/7 from canonical .opencode/agent/deep-review.md template including findingId in claim-adjudication packets.

2. .gemini/agents/deep-review.md (or .toml): Mirror canonical deep-review agent iteration contract verbatim.

3. .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml + spec_kit_deep-research_confirm.yaml: Add archivedPath:null to confirm-mode resumed event payloads.

4. .claude/agents/deep-research.md: Restore config to Step 1 required reads.

5. .gemini/agents/deep-research.md: Use config.lineage.lineageMode to match actual config shape.

6. .claude/agents/improve-agent.md: Reinsert canonical Phase 005 runtime-truth contract section.

7. .gemini/agents/improve-agent.md: Either add shell tool to allowed-tools or remove bash/script guidance.

8. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/plan.md: Rewrite from 4-phase to 8-phase topology reflecting actual delivered work.

9. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md: Re-open items that claim verification the root docs haven't actually achieved.

10. README.md: Remove /create:prompt from command list (command file doesn't exist) or note it as planned.

11. README.md: Fix count badges — audit agent count and command count, make hero blurb, At a Glance table, and footer consistent.

12. .opencode/command/improve/agent.md: Remove stale static-mode/handover-only promotion language.

13. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md: Update schema section to shipped v2 DDL with composite primary keys.

Make minimal targeted changes."

# BATCH 5: Maintainability — Code
run_fix "5-maintainability-code" "Fix 13 maintainability issues in code and docs:

1. .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs: Require sessionId, generation, and loopType explicitly at the joinWave() API boundary. Remove the wave-join fallback default.

2. .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs: Add an exported finalizeBoard() function that transitions board.status to completed through the allowed transition path. Fix createCanonicalMergeBoard() defaults.

3. .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs: Replace private session comparison functions with imports from coverage-graph-session.cjs.

4. Consolidate .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts and coverage-graph-cross-layer.vitest.ts into one canonical contract suite.

5. .opencode/skill/system-spec-kit/vitest.config.ts: Add mcp_server/tests/archive/** to exclusion pattern.

6. .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md + decision-record.md + README.md: Update release evidence references from v1.6.0.0/v1.3.0.0/v1.2.0.0 to v1.6.2.0/v1.3.2.0/v1.2.2.0.

7. .opencode/skill/sk-deep-review/README.md + sk-deep-research/README.md + sk-improve-agent/README.md: Add version footer with changelog link.

8. .opencode/skill/sk-deep-review/scripts/reduce-state.cjs: Isolate repeatedFindings to a legacy adapter path. Remove from canonical contract init and dashboard rendering.

9. .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts + lib/extraction/entity-extractor.ts: Consolidate entity-length policy to one shared constant (pick 100 or 80 and use everywhere).

Make minimal targeted changes."

# BATCH 6: Maintainability — Playbooks
run_fix "6-maintainability-playbooks" "Fix 4 playbook accuracy issues and 4 minor doc issues:

1. .opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md: Rewrite around flat event schema (dimension, file, finding, evidence, edge) instead of retired _node taxonomy. Point to active coverage-graph test sources, not archived ones.

2. .opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md: Rename scenario around actual flat coverage artifact (mutations, exhausted, trajectory) instead of node/edge graph model.

3. .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuation.md: Change verification to use archive separation and iteration reset instead of asserting lineageMode/generation fields the runtime doesn't emit. Fix any corrupted prompt text.

4. .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-benchmark-stability-surface.md: Reword stability description from all deltas to last-N-samples staying within per-dimension score range.

Make minimal targeted changes."

echo "=== ALL BATCHES COMPLETE ===" | tee -a "$LOG"
echo "End: $(date)" | tee -a "$LOG"
