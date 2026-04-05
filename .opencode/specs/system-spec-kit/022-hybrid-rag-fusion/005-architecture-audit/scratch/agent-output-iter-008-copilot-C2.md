● skill(system-spec-kit)

I’m going to inspect the targeted subsystems, cross-check how the handlers actually use them, and then synthesize a findings-first audit with concrete robustness gaps.

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/dfa95180-c775-48ce-8dab-5198b70cf6b7/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Inspect the requested learning, error, validation, and PE/quality handler modules.…
  └ 4 lines...

● Explore Audit learning/errors
  │ Read corrections.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts
  │   └ L600:750 (151 lines read)
  └ Search (grep)
      │ "withTimeout|Promise.race|clearTimeout"
      │ (.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts)
      └ 5 lines found

● Explore Audit handlers integration
  │ Check aggregated result reporting (shell)
  │   │ grep -n "processed\|inserted\|resolved\|unresolved\|errors:"
  │   │ "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts" |
  │   head
  │   │ -20
  │   └ 20 lines...
  └ Read final causal-links processing (shell)
      │ sed -n '240,280p' "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts"
      └ 1 line...

I’ve got two synthesized passes from sub-agents. Now I’m spot-checking the critical claims directly in the source so the final audit is grounded in exact evidence, not just summaries.

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L140:230 (91 lines read)

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L240:430 (191 lines read)

● Read recovery-hints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
  └ L1:260 (260 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L280:340 (61 lines read)

● Read quality-loop.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ L520:620 (100 lines read)

● Read causal-links-processor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
  └ L1:220 (183 lines read)

● Read core.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts
  └ L1:280 (280 lines read)

● Read pe-gating.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
  └ L160:340 (181 lines read)

● Read corrections.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts
  └ L420:530 (111 lines read)

● Search (grep)
  │ "recordCorrection|processCausalLinks|runQualityLoop|handleCheckpointRestore|getRecoveryHint|ERRO
  │ R_CODES|isTransientError|isPermanentError|validateAnchorFormat|ensureActivationTimestampInitiali
  │ zed|handleTaskPostflight|handleTaskPreflight" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed one concrete high-severity issue in `corrections.ts` directly. I’m now checking the call sites and error plumbing so the rest of the report stays evidence-based and avoids overclaiming.

● Read errors.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors.ts
  └ L1:260 (35 lines read)

● Read recovery-hints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
  └ L780:860 (81 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/learning/index.ts
  └ L1:220 (51 lines read)

● Read session-learning.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
  └ L260:520 (261 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L1:260 (260 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts
  └ L1:220 (40 lines read)

● Read session-learning.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "processCausalLinks\(" (.opencode/skill/system-spec-kit/mcp_server)
  └ 12 lines found

● Search (grep)
  │ "E100|E101|CAUSAL_EDGE_NOT_FOUND|CAUSAL_CYCLE_DETECTED"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts)
  └ 5 lines found

I found one sub-agent overclaim: the causal error codes actually do have recovery hints. I’m correcting that now and narrowing the report to the issues the source really supports.

● Read recovery-hints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
  └ L560:620 (61 lines read)

● Read post-insert.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
  └ L1:180 (127 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L360:660 (301 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L230:360 (130 lines read)

● Read causal-graph.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
  └ L240:320 (81 lines read)

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L1:240 (180 lines read)

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L1:220 (175 lines read)

The remaining question is whether preflight and the quality gate miss prerequisites or just intentionally degrade. I’m reading those paths now so the audit can distinguish “soft fail by design” from real robustness gaps.

● Read core.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts
  └ L256:360 (66 lines read)

● Read core.ts
  └ .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L430:620 (191 lines read)

● Read save-quality-gate.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
  └ L660:820 (68 lines read)

● Read chunking-orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
  └ L500:540 (41 lines read)

● Read causal-graph.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
  └ L430:540 (111 lines read)

● Read chunking-orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
  └ L360:430 (71 lines read)

● Read quality-loop.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ L1:120 (120 lines read)

I’ve got enough source-level evidence for the main conclusions. I’m doing one last pass on `runPreflight()` and the quality gate’s call pattern so the final findings cleanly separate “design choice” from “bug.”

● Read recovery-hints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
  └ L620:792 (173 lines read)

● Read pe-gating.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
  └ L1:170 (170 lines read)

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L620:760 (111 lines read)

● Search (grep)
  │ "runQualityGate\(" (.opencode/skill/system-spec-kit/mcp_server)
  └ 27 lines found

● Search (grep)
  │ "runPreflight\(|validateAnchorFormat\(|checkTokenBudget\(|checkDuplicate\("
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 42 lines found

I’m checking `memory-save.ts` now, because robustness here depends on whether preflight/quality-loop results are merely computed or actually enforced at the boundary.

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L520:620 (101 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L840:930 (91 lines read)

● Search (grep)
  │ "qualityGateResult|preflightResult|warnOnly|wouldReject|dryRun"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 34 lines found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L930:975 (46 lines read)

● Search (grep)
  │ "file_path" (.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts)
  └ 10 lines found

I’ve finished the code read. I’m running the subsystem tests that already exist so I can factor in whether the current suite actually covers the robustness gaps I found.

● Search (glob)
  │ "**/*session*learning*.vitest.ts" in .opencode/skill/system-spec-kit/mcp_server/tests
  └ 1 file found

● Run targeted audit tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/preflight.vitest.ts tests/save-quality-gate.vitest.ts tests/handler-helpers.vitest.ts
  │ --reporter=basic
  └ 41 lines...

The first test run failed because this Vitest version doesn’t recognize `--reporter=basic`. I’m retrying with the default reporter so I can still capture the baseline.

● Run targeted audit tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/preflight.vitest.ts tests/save-quality-gate.vitest.ts tests/handler-helpers.vitest.ts
  │ tests/handler-session-learning.vitest.ts
  └ 111 lines...

The targeted suite passes, which is useful: these issues are more about untested edge cases and partial-success semantics than basic breakage. I’m checking coverage around `record_correction` specifically because that’s where the strongest bug lives.

● Search (grep)
  │ "qualityGateActivatedAt|setActivationTimestamp|warn-only|warnOnly|ensureActivationTimestampIniti
  │ alized" (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 52 lines found

● Search (grep)
  │ "partial: true|checkpoint_restore|restored with warnings|warningCount"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 21 lines found

● Search (grep)
  │ "record_correction|recordCorrection|undo_correction|undoCorrection|corrections"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 60 lines found

● Read corrections.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts
  └ L360:395 (36 lines read)

● Read handler-checkpoints.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts
  └ L220:255 (36 lines read)

I noticed one possible contract mismatch around error severities (`'warning'` vs the shared `Severity` union). I’m checking whether that’s a real type hole or just a different envelope type before I include it.

● Read envelope.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "interface .*Recovery|type .*Severity|createMCPErrorResponse"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/response)
  └ 4 lines found

● Search (grep)
  │ "severity:\s*'warning'" (.opencode/skill/system-spec-kit/mcp_server)
  └ 7 lines found

● Search (grep)
  │ "causalLinksResult|runPostInsertEnrichment"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 3 lines found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L640:675 (36 lines read)

● Search (grep)
  │ "causalLinksResult" (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 19 lines found

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L150:180 (31 lines read)

● Search (grep)
  │ "throw new Error\(|throw new MemoryError\(|createMCPErrorResponse\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 12 lines found

● Search (grep)
  │ "createErrorWithHint\(" (.opencode/skill/system-spec-kit/mcp_server)
  └ 6 lines found

I want to see whether the corrections and checkpoint suites currently catch the two highest-signal issues I found. Running those tests now.

● Run corrections and checkpoints tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/corrections.vitest.ts tests/handler-checkpoints.vitest.ts
  └ 49 lines...

● Search (grep)
  │ "runQualityLoop\(" (.opencode/skill/system-spec-kit/mcp_server)
  └ 21 lines found

# Robustness Audit

## Findings

- **High — `record_correction()` is not fully atomic with graph sync.**  
  The learning pipeline correctly wraps stability updates and `memory_corrections` writes in a transaction, but causal-edge creation is explicitly best-effort and swallowed on failure. That means the correction ledger can say a correction happened while the causal graph never reflects it, leaving downstream lineage queries inconsistent (`lib/learning/corrections.ts:429-500`). The current test only asserts that causal-edge reads return an array, not that a correction actually created the expected edge (`tests/corrections.vitest.ts:374-383`).

- **Medium — The error hierarchy is good in core, but inconsistent in actual handler usage.**  
  The core layer is clean: `MemoryError` is a proper base class, `buildErrorResponse()` attaches hint metadata, and the barrels are organized (`lib/errors/core.ts:93-110,256-307`; `lib/errors.ts:5-22`; `lib/errors/index.ts:4-31`). But several handlers still throw raw `Error` instead of `MemoryError`, bypassing the hierarchy and any code/hint semantics (`handlers/checkpoints.ts:107-112,197-199,287-295`).

- **Medium — Recovery hints are genuinely useful, but only where the code actually uses them.**  
  The hint catalog is strong: causal, checkpoint, validation, and tool-specific hints are concrete and actionable, with a sensible fallback (`lib/errors/recovery-hints.ts:583-620,696-749,802-815`). `causal-graph.ts` is a good consumer of that model (`handlers/causal-graph.ts:257-280,450-540`). But `pe-gating.ts` and parts of `checkpoints.ts` return ad-hoc or raw errors instead of using typed errors + hint lookup, so the user experience depends on the handler rather than the shared error system (`handlers/pe-gating.ts:181-197`; `handlers/checkpoints.ts:107-112,287-295`).

- **Medium — The quality gate catches real content issues, but it is intentionally fail-open for backend issues.**  
  It meaningfully checks structure, signal density, metadata presence, and near-duplicates (`lib/validation/save-quality-gate.ts:303-334,460-509,555-603`), and `memory-save` does enforce rejection when the gate returns a hard fail (`handlers/memory-save.ts:545-582`). But semantic-dedup errors are converted into pass-through results, and warn-only mode also allows would-be rejects (`lib/validation/save-quality-gate.ts:590-602,690-710`). So it is effective against low-quality content, not against prerequisite failures in its own dependencies.

- **Medium — Preflight is broad, but not complete as a prerequisite gate.**  
  `runPreflight()` covers size, anchors, token budget, and duplicate detection (`lib/validation/preflight.ts:638-729`), and `memory-save` correctly blocks on preflight failure (`handlers/memory-save.ts:863-958`). But duplicate checks fail open if DB/vector lookup errors occur (`lib/validation/preflight.ts:397-446`), and `file_path` is carried through the API/result without being validated inside preflight itself. Path legitimacy is enforced elsewhere in `memory-save`, not by preflight (`handlers/memory-save.ts:846-848`).

- **Low/Medium — Partial-success contracts are explicit, but easy for clients to misuse.**  
  `checkpoint_restore` returns `success: true, partial: true` when some state restored and some failed (`handlers/checkpoints.ts:225-260`), and the tests lock that behavior in (`tests/handler-checkpoints.vitest.ts:231-245`). That is defensible, but any client that keys only off `success` can miss degraded restores.

## Strengths

- `session-learning.ts` is robust overall: it validates scores centrally, initializes schema safely, prevents overwriting completed records, and requires a real preflight baseline before postflight (`handlers/session-learning.ts:126-208,247-304,398-417`).

- `causal-graph.ts` is the best model for the broader codebase: it uses structured MCP error responses plus recovery hints consistently (`handlers/causal-graph.ts:257-280,450-540`).

## Verdict by check

1. **Error hierarchy:** clean in design, inconsistent in adoption.  
2. **Recovery hints:** helpful and well-authored, but not uniformly wired in.  
3. **Learning pipeline:** session learning is solid; corrections have a graph-sync hole.  
4. **Quality gate:** catches real low-signal content issues, but degrades open on dependency failures.  
5. **Preflight:** good coverage, but not all prerequisites are enforced inside preflight itself.

I also ran the existing targeted Vitest suites for these areas; they all passed. That suggests the biggest risks here are edge-case and contract issues, not basic happy-path breakage.

