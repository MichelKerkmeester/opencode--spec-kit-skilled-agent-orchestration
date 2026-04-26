## Verdict
Strong design scaffold, but execution should pause until the ablation contract and a few reproducibility gaps are tightened. Total: 23/30.

## Per-dimension scores

### Scenario design quality (4/5)
Evidence: `.opencode/specs/.../001-scenario-design/spec.md:133` defines `Scenario Corpus (v1.0.0)`; `.opencode/specs/.../001-scenario-design/spec.md:135-196` covers all 9 cells across Search, Query, Intelligence. Good breadth, but open questions at `.opencode/specs/.../001-scenario-design/spec.md:404-408` show the corpus is not fully locked.

### Rubric soundness (4/5)
Evidence: `.opencode/specs/.../001-scenario-design/spec.md:202` says each run gets “5 dimensions, 0-2 scale”; `.opencode/specs/.../001-scenario-design/spec.md:361-365` adds tie-breakers, latency handling, token estimation, and hallucination verification. Weakness: latency and token thresholds are fixed before calibration, and MCP tool latency may be unfairly penalized.

### Dispatch matrix correctness (4/5)
Evidence: cli-codex matches the named skill default: spec uses `--model gpt-5.5`, `model_reasoning_effort="medium"`, `service_tier="fast"` at `.opencode/specs/.../001-scenario-design/spec.md:253-258`; skill §3 defines the same defaults at `.opencode/skill/cli-codex/SKILL.md:170-179`. cli-copilot mostly matches: spec uses `copilot -p "$PROMPT" --model gpt-5.4 --allow-all-tools` at `.opencode/specs/.../001-scenario-design/spec.md:275`; skill §3-4 requires `-p`, `--allow-all-tools`, supports `gpt-5.4`, and caps routine concurrency at 3 at `.opencode/skill/cli-copilot/SKILL.md:167-178`, `.opencode/skill/cli-copilot/SKILL.md:214`, `.opencode/skill/cli-copilot/SKILL.md:275-278`. Repro gap: add explicit `--effort high` because the skill says that flag is preferred for scripted usage at `.opencode/skill/cli-copilot/SKILL.md:222`. cli-opencode matches: spec invocation at `.opencode/specs/.../001-scenario-design/spec.md:290-296` matches skill §3 default at `.opencode/skill/cli-opencode/SKILL.md:181-190`.

### Asymmetry framing (3/5)
Evidence: parent spec correctly names the asymmetry as the “most informative axis” at `.opencode/specs/.../spec.md:77`; 001 says the ablation dispatches S1-S3 with `--agent context` “to isolate model quality from full-MCP advantage” at `.opencode/specs/.../001-scenario-design/spec.md:299-300`. The value is high, but the cost is extra cells and the mechanism is wrong: `context` is an OpenCode agent, not documented as “WITHOUT spec-kit MCP”; skill §3 lists `--pure` as the disable-plugins flag at `.opencode/skill/cli-opencode/SKILL.md:223`.

### Cross-references to 005 defects (3/5)
Evidence: S2 cross-ref is accurate: 001 maps vague search vocabulary to `005/REQ-003` at `.opencode/specs/.../001-scenario-design/spec.md:142-147`, and 005/REQ-003 forbids “Auto-triggered memories” at `.opencode/specs/.../005-memory-search-runtime-bugs/spec.md:115`. S1 and S3 have `Cross-ref: None` at `.opencode/specs/.../001-scenario-design/spec.md:140` and `.opencode/specs/.../001-scenario-design/spec.md:154`; that may be valid, but it means the S-tier is not consistently tied to 005 defect coverage.

### Risks & gaps (5/5)
Evidence: missing/fuzzy items are explicitly listed: S2 result cap, Q1 code-graph fallback, ablation scope, latency fairness, and DB snapshot reproducibility at `.opencode/specs/.../001-scenario-design/spec.md:404-408`. 002 also leaves production-vs-snapshot and N=1-vs-N=3 open at `.opencode/specs/.../002-scenario-execution/spec.md:249-253`.

## Top 3 strengths
1. The 9-scenario corpus is compact, readable, and covers simple/vague/specific prompts across all three surfaces.
2. The scoring rubric is practical enough for a first sweep, with concrete hallucination and tie-breaker rules.
3. The dispatch matrix is mostly faithful to the three CLI contracts and records reproducibility-critical flags.

## Top 5 improvements (priority-tagged)
1. **[P0]** Fix the ablation contract: `--agent context` does not prove “WITHOUT spec-kit MCP”; define a real no-MCP mode, likely `--pure` or an isolated profile.
2. **[P0/P1]** Add explicit `--effort high` to the cli-copilot invocation for reproducibility.
3. **[P1]** Decide live DB vs frozen snapshot before execution; current docs ask for both realism and reproducibility.
4. **[P1/P2]** Calibrate latency scoring so MCP-enabled runs are not punished for doing the thing under test.
5. **[P2]** Add a hard result cap to S2 and a deterministic fallback for Q1 when structural code graph data is unavailable.

## Blockers (if any)
The ablation cell should stop execution before sweep runs: current wording claims “WITHOUT spec-kit MCP,” but the documented command only changes `--agent general` to `--agent context`.
