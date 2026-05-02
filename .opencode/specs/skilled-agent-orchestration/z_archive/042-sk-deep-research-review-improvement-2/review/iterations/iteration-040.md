---
iteration: 40
dimension: security
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T17:22:26Z
completedAt: 2026-04-12T17:31:34Z
---

# Deep Review Iteration 040 — security (Round 3)

**Focus:** CROSS-CUTTING: Verify all 6 workflow YAMLs (deep-research auto+confirm, deep-review auto+confirm, improve-agent auto+confirm) for consistent patterns. Check that blocked_stop events, session gates, and lineage tracking follow the same contract across all 6.

---

● skill(sk-code-review)

I’m mapping the review surface first so I can check the six workflows against the runtime code and cite exact lines instead of guessing from the spec alone.

● Read review_core.md
  │ .claude/skills/sk-code-review/references/review_core.md
  └ L1:220 (98 lines read)

● Read security_checklist.md
  │ .claude/skills/sk-code-review/references/security_checklist.md
  └ L1:220 (206 lines read)

● List directory .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvemen…
  └ 20 files found

● Search (glob)
  │ "**/*{deep-research,deep-review,improve-agent}*.y*ml"
  └ 6 files found

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 40 security audit f…
  └ {"summary":"Matched 2 memories via trigger phrases","data":{"matchType":"trig...

● Search (grep)
  │ "042-sk-deep-research-review-improvement-2|blocked_stop|lineage|session gate|session_gate|wave
  │ executor|optimizer"
  └ 8 lines found

I’ve got the workflow set; now I’m pulling the spec references and runtime files together so I can check whether the six YAMLs actually enforce the same stop/session/lineage contract in code.

● Review(gpt-5.4-mini) Security review assist
  └ Agent started in background with agent_id: round3-security. You can use read_...

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md
  └ L1:260 (260 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L1:260 (129 lines read)

● Read spec_kit_deep-research_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
  └ L1:260 (260 lines read)

● Read spec_kit_deep-research_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
  └ L1:260 (260 lines read)

● Read spec_kit_deep-review_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
  └ L1:260 (260 lines read)

● Read spec_kit_deep-review_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
  └ L1:260 (260 lines read)

● Read improve_improve-agent_auto.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_auto.yaml
  └ L1:260 (204 lines read)

● Read improve_improve-agent_confirm.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_confirm.yaml
  └ L1:260 (244 lines read)

● Search (grep)
  │ "\.ya?ml|wave executor|optimizer|blocked_stop|session
  │ gate|session_gate|lineage|deep-research|deep-review|improve-agent" in *.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

I’ve confirmed the YAML contracts. Now I’m tracing where those contracts land in code, especially any place that turns spec-folder inputs into shell commands or cross-session state, because that’s where the security defects usually hide.

● Search (glob)
  │ "**/*{deep-loop-graph*,graph-convergence*,convergence*,state_format,loop_protocol}*" in
  │ .opencode/skill
  └ 24 files found

● Search (glob)
  │ "**/*{reduce-state,reduce-state.cjs,wave*,optimizer*,candidate-lineage*,mutation-coverage*,bench
  │ mark-stability*,trade-off-detector*,improvement-journal*,scan-integration*,session-isolation*}*"
  │ in .opencode
  └ 7 files found

● Search (grep)
  │ "mkdir -p \{spec_folder\}|mv \{spec_folder\}|archive: "\{spec_folder\}|command:
  │ ".*\{spec_folder\}|--journal \{spec_folder\}|--output=\{spec_folder\}" in *.{yaml,yml,md}
  │ (.opencode)
  └ 6 lines found

● Search (grep)
  │ "blocked_stop|claim_adjudication|lineageMode|parentSessionId|sessionId|review_dimensions_json|de
  │ ep-loop-graph|session boundary|lineage_mode_must_equal_new" in
  │ *.{js,cjs,mjs,ts,tsx,json,yaml,yml,md} (.opencode)
  └ 6 lines found

✗ search (MCP: cocoindex_code) · implementation of blocked_stop events in deep review or deep resea…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search (MCP: cocoindex_code) · session gate lineage tracking deep review deep research improve ag…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ Search (grep)
  │ "step_migrate_legacy_review_state|step_session_boundary_gate|step_classify_session|step_graph_co
  │ nvergence|blocked_stop|claim_adjudication" in *.md (.opencode/skill/sk-deep-*)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-*:
    IO error for operation on
    /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-*: No
    such file or directory (os error 2)

● Search (grep)
  │ "deep-review-config|deep-review-state|deep-research-config|deep-research-state|review/iterations
  │ |research/iterations|review_archive|research_archive" in *.{js,cjs,mjs,ts,tsx} (.opencode/skill)
  └ 54 lines found

● Search (grep)
  │ "execSync|spawn|spawnSync|child_process|node -e|mv \{|mkdir -p \{|printf '%s\\n'" in
  │ *.{js,cjs,mjs,ts,tsx} (.opencode/skill)
  └ 7 lines found

● Search (grep)
  │ "spec_folder_is_within|required_values_present|unresolved_placeholders|tool_contract|lineage_mod
  │ e_must_equal_new|existing_runtime_must_be_archived|dormant_resume_fields_disallowed" in
  │ *.{js,cjs,mjs,ts,tsx,py}
  └ No matches found

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L1:260 (260 lines read)

● Search (grep)
  │ "deep_loop_graph_convergence|sessionId|session_id|persistSnapshot|blocked_stop|claimAdjudication
  │ Gate|graphDecision" in spec_kit_deep-*.yaml (.opencode/command/spec_kit/assets)
  └ 6 lines found

● Search (grep)
  │ "sessionId|parentSessionId|lineageMode|generation|continuedFromRun|archivedPath|blocked_stop|cla
  │ im_adjudication" in improve_improve-agent_*.yaml (.opencode/command/improve/assets)
  └ 16 lines found

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
  └ L1:260 (259 lines read)

● Read convergence.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
  └ L1:260 (260 lines read)

The review agent finished; I’m pulling its result now and cross-checking it against the exact YAML/code lines before I finalize findings.

● Read (Review agent — Security review assist)
  └ Completed

● Read spec_kit_deep-review_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
  └ L145:240 (96 lines read)

● Read spec_kit_deep-review_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
  └ L145:260 (116 lines read)

● Read spec_kit_deep-research_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
  └ L135:250 (116 lines read)

● Read spec_kit_deep-research_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
  └ L140:250 (111 lines read)

● Read improve_improve-agent_auto.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_auto.yaml
  └ L115:210 (90 lines read)

● Read improve_improve-agent_confirm.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_confirm.yaml
  └ L120:235 (116 lines read)

● Read score-candidate.cjs
  │ .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs
  └ L300:360 (61 lines read)

● Read generate-profile.cjs
  │ .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs
  └ L220:300 (41 lines read)

● Read scan-integration.cjs
  │ .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
  └ L110:220 (111 lines read)

● Search (grep)
  │ "args\.agent|target_path|agent_name|readFileSync\(|new RegExp\(" in *.cjs
  │ (.opencode/skill/sk-improve-agent/scripts)
  └ 30 lines found

● Search (grep)
  │ "blocked_stop|claim_adjudication|sessionId|parentSessionId|lineageMode" in *.md
  │ (.opencode/skill/sk-deep-review/references)
  └ 56 lines found

● Search (grep)
  │ "blocked_stop|sessionId|parentSessionId|lineageMode" in *.md
  │ (.opencode/skill/sk-deep-research/references)
  └ 44 lines found

● Search (grep)
  │ "session boundary|lineage_mode_must_equal_new|sessionId|parentSessionId|lineageMode|generation"
  │ (.opencode/command/improve/assets/improve_improve-agent_auto.yaml)
  └ 9 lines found

● Search (grep)
  │ "blocked_stop|claim_adjudication|graph_convergence|sessionId|parentSessionId|lineageMode|generat
  │ ion" (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml)
  └ 46 lines found

● Search (grep)
  │ "blocked_stop|claim_adjudication|graph_convergence|sessionId|parentSessionId|lineageMode|generat
  │ ion" (.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml)
  └ 44 lines found

● Search (grep)
  │ "blocked_stop|graph_convergence|sessionId|parentSessionId|lineageMode|generation"
  │ (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml)
  └ 26 lines found

● Search (grep)
  │ "blocked_stop|graph_convergence|sessionId|parentSessionId|lineageMode|generation"
  │ (.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml)
  └ 24 lines found

● Search (grep)
  │ "session boundary|lineage_mode_must_equal_new|sessionId|parentSessionId|lineageMode|generation"
  │ (.opencode/command/improve/assets/improve_improve-agent_confirm.yaml)
  └ 12 lines found

● Read spec_kit_deep-research_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
  └ L108:118 (11 lines read)

● Read promote-candidate.cjs
  │ .opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs
  └ L1:220 (188 lines read)

● Search (grep)
  │ "args\.target|targetPath|writeFileSync|copyFileSync|renameSync|fs\.cpSync|readFileSync\(args\.ta
  │ rget|target_path_must_be_agent" in *.cjs (.opencode/skill/sk-improve-agent/scripts)
  └ 27 lines found

● Read spec_kit_deep-research_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
  └ L108:118 (11 lines read)

● Read spec_kit_deep-review_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
  └ L112:118 (7 lines read)

● Read spec_kit_deep-review_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
  └ L112:118 (7 lines read)

● skill(sk-code-opencode)

● Read improve_improve-agent_auto.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_auto.yaml
  └ L36:60 (24 lines read)

● Read improve_improve-agent_confirm.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_confirm.yaml
  └ L36:60 (25 lines read)

● Read scan-integration.cjs
  │ .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
  └ L186:204 (19 lines read)

● Read generate-profile.cjs
  │ .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs
  └ L243:257 (15 lines read)

**Found 3 security findings: 2x P1, 1x P2.** The blocked-stop and lineage contracts are otherwise consistent across the four deep-research/deep-review workflows; the material risk is the execution boundary around workflow inputs.

## Findings

### F-040-001
- **Severity**: P1
- **Dimension**: security
- **File**: multiple
- **Line**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:114`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:114`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:115,149`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:115,149`
- **Title**: Raw `spec_folder` interpolation reaches shell execution in all four research/review workflows
- **Description**: The four spec-kit workflows embed `{spec_folder}` directly into shell commands (`mkdir`, `mv`, `find`, `printf >> ...`) without quoting or argv separation. Because `spec_folder` is a runtime input, any shell metacharacter or whitespace that survives prompt-time validation can escape the intended path boundary and execute arbitrary commands or redirect writes outside the packet.
- **Evidence**: The deep-research workflows create directories via raw shell at `...deep-research_auto.yaml:114` and `...deep-research_confirm.yaml:114`. The deep-review workflows do the same at `...deep-review_auto.yaml:115` / `...deep-review_confirm.yaml:115`, then run a long migration one-liner with repeated unquoted `{spec_folder}` expansions at `...deep-review_auto.yaml:149` and `...deep-review_confirm.yaml:149`.
- **Recommendation**: Replace these shell snippets with committed helper scripts that take validated argv inputs, canonicalize `spec_folder` under approved roots, and perform file operations with filesystem APIs instead of interpolated shell.

### F-040-002
- **Severity**: P1
- **Dimension**: security
- **File**: multiple
- **Line**: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:127,130,134,143,158,161,164,170,176,179,191,204`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:140,143,147,166,189,192,195,201,207,210,228,232`
- **Title**: improve-agent workflows inject runtime values into shell arguments and inline `node -e` source
- **Description**: The improve-agent auto/confirm workflows pass `{spec_folder}`, `{target_path}`, `{candidate_path}`, `{candidate_id}`, `{session_id}`, and related fields straight into shell command strings and inline JavaScript source. This is a direct command/JS injection surface: a crafted value can break quoting, append flags, alter JSON payloads, or execute arbitrary JS inside the `node -e` steps.
- **Evidence**: Representative sinks include raw command construction at `...auto.yaml:127,130,134,164,185,204` and `...confirm.yaml:140,143,147,195,216,232`, plus inline JS execution at `...auto.yaml:161,170,176,179` and `...confirm.yaml:192,201,207,210`. The journaling calls also embed raw JSON inside shell-quoted `--details` strings at `...auto.yaml:143,158,167,191,204` and `...confirm.yaml:166,189,198,228,245`.
- **Recommendation**: Remove `node -e` from the workflow, move each operation into checked-in scripts, pass structured data via stdin or temp files, and invoke helpers with argv-safe parameters after canonical path validation.

### F-040-003
- **Severity**: P2
- **Dimension**: security
- **File**: multiple
- **Line**: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:37-59`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:38-60`, `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs:243-257`, `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:129-179,186-204`
- **Title**: improve-agent helper scripts do not re-enforce the workflow’s path and name safety contract
- **Description**: The workflow declares `target_path` must be an existing `.opencode/agent/*.md` file and derives `agent_name` from that path, but the executable helpers trust those values verbatim. `generate-profile.cjs` reads `args.agent` directly from disk with no containment check, and `scan-integration.cjs` builds regexes from `agentName` without escaping metacharacters. That leaves the actual execution boundary weaker than the workflow contract and lets a non-UI caller or injected value broaden scans or read unintended files.
- **Evidence**: The contract is declared at `...improve_improve-agent_auto.yaml:37-59` and `...confirm.yaml:38-60`. `generate-profile.cjs` accepts `--agent` and immediately `readFileSync`s it at `generate-profile.cjs:243-257`. `scan-integration.cjs` constructs `new RegExp(...)` from `agentName` at `scan-integration.cjs:129-179` and accepts the raw CLI value in `scan-integration.cjs:186-204`.
- **Recommendation**: Enforce canonical containment under `.opencode/agent/` in the scripts themselves, reject unsafe path forms (`..`, absolute paths, unexpected extensions), and escape `agentName` before every regex construction.

## ITERATION SUMMARY

- **Findings**: 3
- **Severity mix**: 0 P0 / 2 P1 / 1 P2
- **Theme**: The stop/session/lineage model is mostly aligned; the remaining security debt is unsafe execution of workflow inputs.

## COVERAGE ASSESSMENT

Reviewed all 6 workflow YAMLs plus the relevant runtime code. The four deep-research/deep-review workflows consistently persist lineage and blocked-stop state with `sessionId`/`generation` (`spec_kit_deep-research_auto.yaml:143-152,266-274,338-341`; `...confirm.yaml:149-157,295-303,367-370`; `spec_kit_deep-review_auto.yaml:167-176,375-376,489-492,611-626`; `...confirm.yaml:173-181,408-409,522-525,665-680`). The graph convergence handler also enforces session-scoped reads (`.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:151-165`). Improve-agent intentionally uses a new-session-only model (`improve_improve-agent_auto.yaml:119-123`; `...confirm.yaml:126-131`), and that surface is where the executable hardening still lags.

## CONFIDENCE

**High.** The two P1 findings are direct, code-backed injection surfaces. The P2 finding is also real, but lower impact because it depends on a caller bypassing the intended workflow UI contract.

## NEXT PRIORITIES

1. Replace interpolated shell one-liners with dedicated helper scripts and argv-safe invocation.
2. Add script-level canonical path enforcement for `spec_folder`, `target_path`, `candidate_path`, and `archive_dir`.
3. Add adversarial regression cases for quotes, spaces, `..`, shell metacharacters, and regex metacharacters in workflow inputs.


Changes   +0 -0
Requests  1 Premium (9m 6s)
Tokens    ↑ 4.6m • ↓ 41.5k • 4.3m (cached) • 28.6k (reasoning)
