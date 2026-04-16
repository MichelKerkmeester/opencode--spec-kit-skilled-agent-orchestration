# Iteration 44 — Domain 4: Stringly Typed Governance (4/10)

## Investigation Thread
I traced whether the repository's declared routing/governance vocabularies are actually consumed by the live runtime, focusing on three seams: compiled `intent_signals` in the skill graph, SKILL-file keyword metadata, and the `--intake-only` boolean gate in the `/spec_kit:plan` command assets.

## Findings

### Finding R44-001
- **File:** `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`; `.opencode/skill/skill-advisor/graph-metadata.json`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py`; `.opencode/skill/skill-advisor/tests/test_skill_advisor.py`
- **Lines:** `skill_graph_compiler.py:501-568`; `graph-metadata.json:37-42`; `skill_advisor.py:105-189,250-339,1185-1200,1629-1694`; `test_skill_advisor.py:61-186`
- **Severity:** P1
- **Description:** The skill graph compiler preserves per-skill `intent_signals`, and the runtime loader faithfully pulls those signals from SQLite/JSON into the in-memory graph object, but the scoring path never consumes them. Live Gate 2 routing is still driven by hard-coded boost tables, description terms, name variants, and graph topology edges, so graph-level routing vocabulary is effectively advisory metadata.
- **Evidence:** `graph-metadata.json` declares routing phrases such as `"skill routing"`, `"gate 2 routing"`, `"route request"`, `"confidence threshold"`, and `"graph compiler"` (`graph-metadata.json:37-42`). `compile_graph()` copies `intent_signals` into the compiled graph payload (`skill_graph_compiler.py:546-568`), and `_load_skill_graph_sqlite()` loads them into a returned `"signals"` field (`skill_advisor.py:114-189`). But every graph-aware runtime consumer reads only `adjacency`, `families`, or `conflicts` (`skill_advisor.py:250-339`), while `get_skills()` and `analyze_request()` build lexical evidence only from cached skill records plus manual boosters (`skill_advisor.py:1185-1200,1629-1694`). The automated test suite exercises `analyze_prompt()`, `analyze_batch()`, `health_check()`, and `get_skills()` shape/health only; it never asserts that `intent_signals` affect routing (`test_skill_advisor.py:61-186`).
- **Downstream Impact:** Editing `graph-metadata.json` to refine routing phrases looks authoritative but does not change Gate 2 behavior. Skill authors and reviewers can believe they updated routing semantics when they only updated inert metadata, leaving manual dictionaries and the graph store free to drift apart.

### Finding R44-002
- **File:** `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/system-spec-kit/SKILL.md`; `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`; `.opencode/skill/skill-advisor/tests/test_skill_advisor.py`
- **Lines:** `sk-deep-research/SKILL.md:1-10`; `system-spec-kit/SKILL.md:1-8`; `skill_advisor_runtime.py:38-64,111-141,165-203`; `test_skill_advisor.py:61-186`
- **Severity:** P2
- **Description:** The advisor's cached skill discovery strips each `SKILL.md` down to scalar frontmatter fields and ignores the keyword vocabularies that the skills themselves publish in `<!-- Keywords: ... -->` comments. In practice, the live router sees only `name`, `description`, and generated variants, so repository-authored keyword lists in skill files are governance prose rather than executable routing input.
- **Evidence:** Real skill files expose keyword metadata immediately after the frontmatter fence, e.g. `sk-deep-research` publishes `<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, ... -->` (`sk-deep-research/SKILL.md:1-10`) and `system-spec-kit` publishes `<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, ... -->` (`system-spec-kit/SKILL.md:1-8`). But `parse_frontmatter_fast()` returns as soon as it reaches the closing `---` and stores only `key: value` scalar lines (`skill_advisor_runtime.py:38-64`), while `_build_skill_record()` derives routing terms solely from `name` and `description` (`skill_advisor_runtime.py:111-141`). `get_cached_skill_records()` then caches only those reduced records (`skill_advisor_runtime.py:165-203`). The current automated tests verify module loading, result shape, and basic prompt routing, but never assert keyword extraction from `SKILL.md` content beyond frontmatter (`test_skill_advisor.py:61-186`).
- **Downstream Impact:** Skill maintainers can update the keyword surface in `SKILL.md` and see no routing change unless they also remember to edit separate Python dictionaries. That turns the skill files' own keyword comments into a drift-prone social contract instead of a mechanically enforced source of truth.

### Finding R44-003
- **File:** `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`; `.opencode/skill/system-spec-kit/mcp_server/tests/transcript-planner-export.vitest.ts`
- **Lines:** `spec_kit_plan_auto.yaml:375-392`; `spec_kit_plan_confirm.yaml:400-417`; `transcript-planner-export.vitest.ts:146-217`
- **Severity:** P2
- **Description:** Both `/spec_kit:plan` workflow assets express the `--intake-only` stop/continue branch with uppercase boolean literals inside string conditions (`"intake_only == TRUE"` / `"intake_only == FALSE"`), but no nearby runtime contract or automated test pins what evaluator semantics make those literals valid. The branch is therefore controlled by interpreter convention rather than a shared, validated boolean grammar.
- **Evidence:** The auto and confirm assets both define `step_0.6_intake_only_gate` with `bound_variable: intake_only`, then branch on `when: "intake_only == TRUE"` and `when: "intake_only == FALSE"` (`spec_kit_plan_auto.yaml:375-392`; `spec_kit_plan_confirm.yaml:400-417`). The adjacent planner export test exercises transcript save/planner output and full-auto routing summaries only; it never invokes or asserts the intake-only halt path (`transcript-planner-export.vitest.ts:146-217`).
- **Downstream Impact:** A runtime or prompt interpreter that treats booleans differently can either ignore `--intake-only` and run planning Steps 1-7 anyway, or halt when it should continue. Because the condition language is only stringly encoded in YAML, the failure mode is behavioral drift rather than a schema or type error.

## Novel Insights
- Domain 4's deepest routing issue is not just "manual dictionaries exist"; it is that the system now has **three separate routing vocabularies** - skill-graph `intent_signals`, SKILL-file keyword comments, and Python booster tables - while only the last one is guaranteed to influence runtime scoring.
- The current skill-graph toolchain already moves `intent_signals` end-to-end through compile and load stages, which makes the eventual discard more dangerous: the repository looks mechanically wired even though the signals never reach `analyze_request()`.
- The `/spec_kit:plan` assets show the same pattern in command governance: branch-critical booleans are expressed as opaque string conditions, and the existing tests validate outcome summaries rather than the control-language itself.

## Next Investigation Angle
Stay in Domain 4 and trace the next layer of silent routing drift: audit whether any command/workflow runtime actually documents or enforces the boolean/expression grammar used in `*.yaml`, then inspect whether other command assets (`complete`, `implement`, `deep-research`) rely on similarly unpinned uppercase booleans or token names for control flow.
