---
iteration: 36
dimension: security
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T16:57:09Z
completedAt: 2026-04-12T17:05:12Z
---

# Deep Review Iteration 036 — security (Round 3)

**Focus:** UPDATED WORKFLOW: Verify workflow YAML security after fixes. Check deep-review auto+confirm YAMLs for graphBlockerDetail in blocked_stop, single reviewDimensions normalization. Check deep-research auto+confirm YAMLs removed completed-session-to-synthesize. Check improve-agent confirm YAML for enforced session-boundary gate.

---

● skill(sk-code-review)

I’m narrowing the review to the workflow surfaces named in the focus area, then I’ll trace any referenced implementation paths to confirm the fixes didn’t leave a security gap.

● Search (glob)
  │ ".opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/**/*"
  └ 8 files found

● Search (grep)
  │ "graphBlockerDetail|reviewDimensions|completed-session-to-synthesize|session-boundary|blocked_st
  │ op" in **/*.{yml,yaml,md,ts,js,json}
  └ 7 lines found

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 36 security validat…
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● skill(sk-code-opencode)

I found the review bundle and I’m now reading the spec summary plus the exact workflow/config files named in the updated workflow notes so I can validate the final security-sensitive branches.

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md
  └ L1:260 (260 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L1:260 (129 lines read)

● Search (glob)
  │ "**/*{deep-review,deep-research,improve-agent}*.{yml,yaml}" in .opencode
  └ 6 files found

● Search (grep)
  │ "graphBlockerDetail|reviewDimensions|completed-session-to-synthesize|session-boundary|blocked_st
  │ op" in **/*.{yml,yaml,md,ts,js,json} (.opencode)
  └ 7 lines found

The next pass is the actual trust boundary check: I’m reading the six workflow assets in full and then I’ll inspect the code paths they invoke where session IDs, graph blocker data, and review dimensions cross from YAML into runtime code.

● Read spec_kit_deep-research_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
  └ L1:400 (304 lines read)

● Read spec_kit_deep-review_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
  └ L1:400 (274 lines read)

● Read spec_kit_deep-review_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
  └ L1:400 (274 lines read)

● Read spec_kit_deep-research_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
  └ L1:400 (312 lines read)

● Read improve_improve-agent_confirm.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_confirm.yaml
  └ L1:400 (244 lines read)

● Read improve_improve-agent_auto.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_auto.yaml
  └ L1:400 (204 lines read)

● Search (grep)
  │ "completed-session-to-synthesize" in **/*.{yml,yaml,md,ts,js,json} (.opencode)
  └ 12 lines found

● Search (grep)
  │ "session-boundary|graphBlockerDetail|review_dimensions_json|reviewDimensions" in
  │ **/*.{yml,yaml,md,ts,js,json} (.opencode)
  └ 7 lines found

I’ve confirmed the intended branches exist in the YAMLs. I’m now reading the exact convergence/blocked-stop sections and the session-boundary gate implementation details to see whether any of the fixes accidentally weakened a trust boundary or reintroduced unsafe routing.

● Read spec_kit_deep-research_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
  └ L300:430 (131 lines read)

● Read spec_kit_deep-review_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
  └ L275:520 (246 lines read)

● Read spec_kit_deep-review_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
  └ L275:560 (278 lines read)

● Read spec_kit_deep-research_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
  └ L300:440 (141 lines read)

● Search (grep)
  │ "graphBlockerDetail|blocked_stop|review_dimensions_json|session_boundary|lineage_mode_must_equal
  │ _new|completed-session" in **/*.{yml,yaml,md} (.opencode/command)
  └ 32 lines found

● Search (grep)
  │ "lineageMode|sessionId|reviewDimensions|graphBlockerDetail|blockers" in
  │ **/*.{md,json,jsonc,ts,js,cjs} (.opencode/skill)
  └ 7 lines found

I found one likely trust-boundary weakness unrelated to the specific lane-fix wording: the improve-agent workflows gate session lineage, but I haven’t seen a matching spec-folder containment check before they start interpolating user-supplied paths into shell commands. I’m verifying whether any downstream script neutralizes that before I call it a finding.

● Read generate-profile.cjs
  │ .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs
  └ L1:260 (260 lines read)

● Search (grep)
  │ "spec_folder_is_within|target_path_must_be_agent|spec_folder_required|mkdir -p
  │ \{spec_folder\}|--output=\{spec_folder\}|--journal
  │ \{spec_folder\}|\{target_path\}|\{target_profile\}" in **/*.yaml
  │ (.opencode/command/improve/assets)
  └ 35 lines found

● Search (grep)
  │ "process\.argv|parseArgs|targetPath|specFolder|resolve\(|realpath|canonical|path\.resolve|approv
  │ ed root|\.opencode/agent" in **/*.{js,cjs,mjs,ts} (.opencode/skill/sk-improve-agent/scripts)
  └ 74 lines found

● Read scan-integration.cjs
  │ .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
  └ L1:260 (240 lines read)

● Read promote-candidate.cjs
  │ .opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs
  └ L1:260 (188 lines read)

I’ve got one concrete candidate finding. I’m doing a quick independent cross-check against just these workflow files to make sure I’m not missing a second security issue or overcalling a false positive.

● Code-review(gpt-5.4-mini) Security review cross-check
  │ Search (grep)
  │   │ "function
  │   │ everyConfiguredDimensionExaminedAtLeastOnce|everyConfiguredDimensionExaminedAtLeastOnce\("
  │   │ (.opencode/skill/sk-deep-review)
  │   └ 1 line found
  └ Read convergence.md
      │ .opencode/skill/sk-deep-review/references/convergence.md
      └ L360:420 (61 lines read)

● Search (grep)
  │ "append_to_jsonl|command: "mkdir -p \{spec_folder\}|archive: "\{spec_folder\}/review|archive:
  │ "\{spec_folder\}/research" in **/*.{yaml,yml} (.opencode/command/spec_kit/assets)
  └ 20 lines found

● Search (grep)
  │ "NNN-name|spec_folder_is_within|canonicalize alias roots|spec_folder.*regex|validate spec
  │ folder|approved roots" in **/*.{md,js,cjs,ts,yaml,yml,py} (.opencode)
  └ 7 lines found

● Search (grep)
  │ "NNN-name|must match.*NNN|slug|^[A-Za-z0-9_-]+$|metachar|shell"
  │ (.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml)
  └ 2 lines found

● Search (grep)
  │ "NNN-name|must match.*NNN|slug|^[A-Za-z0-9_-]+$|metachar|shell"
  │ (.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml)
  └ 2 lines found

● Search (grep)
  │ "NNN-name|must match.*NNN|slug|^[A-Za-z0-9_-]+$|metachar|shell"
  │ (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml)
  └ 2 lines found

● Search (grep)
  │ "NNN-name|must match.*NNN|slug|^[A-Za-z0-9_-]+$|metachar|shell"
  │ (.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml)
  └ 2 lines found

I’ve converged on two actual security findings. I’m pulling the exact line ranges I need for a clean findings-first report, and the rest of the targeted fixes look intact.

● Read improve_improve-agent_auto.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_auto.yaml
  └ L52:140 (89 lines read)

● Read improve_improve-agent_confirm.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_confirm.yaml
  └ L52:150 (99 lines read)

● Read scan-integration.cjs
  │ .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
  └ L126:182 (57 lines read)

● Read spec_kit_deep-review_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
  └ L234:245 (11 lines read)

● Read spec_kit_deep-review_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
  └ L242:253 (11 lines read)

● Read spec_kit_deep-review_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
  └ L452:493 (42 lines read)

● Read spec_kit_deep-research_auto.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
  └ L154:159 (6 lines read)

● Read spec_kit_deep-research_confirm.yaml
  │ .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
  └ L163:166 (4 lines read)

**F-036-001**  
**Severity:** P1  
**Dimension:** security  
**File:** `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:55-59,124-147`; `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:56-60,118-134`  
**Title:** Session-boundary gate does not protect shell-executed path inputs  
**Description:** The new improve-agent session-boundary gate only checks lineage semantics. It does not constrain `spec_folder` to an approved root or neutralize shell metacharacters before the workflow interpolates `spec_folder` and `target_path` into shell command strings. That leaves the init path vulnerable to command injection and out-of-scope filesystem writes if a crafted path reaches the workflow.  
**Evidence:** Both YAMLs validate only presence plus `target_path_must_be_agent` and then immediately execute unquoted commands such as `mkdir -p {spec_folder}/...`, `node ... --output={spec_folder}/...`, and `node ... --agent={target_path}`. The downstream scripts also accept those argv values verbatim and write to resolved output paths without a containment check (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:186-189,234-236`; `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs:244-257`).  
**Recommendation:** Add a preflight contract equivalent to `spec_folder_is_within` plus strict slug validation, reject shell metacharacters, and stop interpolating user-controlled values into shell strings. Pass paths as structured argv/env values and remove inline shell/`node -e` dependence where possible.

**F-036-002**  
**Severity:** P2  
**Dimension:** security  
**File:** `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:129-179`  
**Title:** Integration scanner builds regexes from unescaped agent names  
**Description:** `scan-integration.cjs` constructs multiple `RegExp` objects directly from `agentName`. A crafted agent filename containing regex metacharacters can change match semantics or throw at runtime, causing the improvement workflow to mis-scan or fail before scoring/promotion.  
**Evidence:** `scanCommands`, `scanYamlWorkflows`, `scanSkills`, `scanGlobalDocs`, and `scanSkillAdvisor` all call `new RegExp(...)` with raw `agentName` (`:130`, `:135`, `:152`, `:166`, `:179`). The workflow derives `agent_name` from the basename of `target_path` without any metacharacter restriction (`improve_improve-agent_confirm.yaml:49-59`, `improve_improve-agent_auto.yaml:47-60`).  
**Recommendation:** Escape regex metacharacters before constructing patterns, or replace regex matching with literal substring/path comparisons.

**ITERATION SUMMARY:** 2 findings total: **0 P0, 1 P1, 1 P2**. The named round-3 YAML fixes themselves look correct: deep-review now normalizes `reviewDimensions` once and preserves `graphBlockerDetail` in `blocked_stop`; deep-research no longer routes completed sessions directly to synthesis and now halts instead.

**COVERAGE ASSESSMENT:** Reviewed the parent 042 packet summary plus all six workflow assets named in the focus area. Verified the targeted deep-review fix points in `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:234-244,452-492` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:242-252,479-525`; verified the deep-research completed-session halt in `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:154-158` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:163-166`; traced the improve-agent workflow into the referenced `sk-improve-agent` scripts for path/regex handling.

**CONFIDENCE:** High.

**NEXT PRIORITIES:**  
1. Harden improve-agent auto+confirm with root/slug validation and argv-safe command execution.  
2. Escape `agentName` in `scan-integration.cjs` before any regex construction.  
3. Re-run a narrow security pass on the improve-agent workflow after those two fixes land.


Changes   +0 -0
Requests  1 Premium (8m 0s)
Tokens    ↑ 2.9m • ↓ 34.2k • 2.7m (cached) • 25.1k (reasoning)
