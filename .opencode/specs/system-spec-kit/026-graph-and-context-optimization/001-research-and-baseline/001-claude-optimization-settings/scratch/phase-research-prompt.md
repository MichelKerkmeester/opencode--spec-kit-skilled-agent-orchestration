# $refine TIDD-EC Prompt: 001-claude-optimization-settings

## 2. Role

Act as a research specialist in Claude Code token optimization, configuration auditing, prompt-cache lifecycle analysis, and waste-pattern detection in stateless agent loops. Work like a systems analyst who can separate transferable methodology from one-user anecdote, extract configuration lessons from quantified narrative evidence, and translate those lessons into practical improvements for `Code_Environment/Public`. Stay focused on Claude Code runtime behavior, cost visibility, and context-efficiency interventions.

## 3. Task

Research the Reddit post's documented audit methodology, configuration patterns, and waste categories to identify concrete optimizations for `Code_Environment/Public`'s Claude Code setup. Treat the post as a primary-source field report about real token waste, cache expiry behavior, and configuration blind spots rather than as a repo implementation guide. Focus especially on `ENABLE_TOOL_SEARCH`, cache-expiry mitigation, skill-schema bloat reduction, and behavioral antipattern detection. The goal is to decide what this repo should adopt now, prototype later, or reject, with evidence anchored to exact passages in `reddit_post.md` and cross-checks against the repo's current `.claude/settings.local.json` and `CLAUDE.md`.

## 4. Context

### 4.1 System Description

The research target for this phase is unusual: it is a single narrative document, `external/reddit_post.md`, not a code repository. That post contains the author's audit framing, quantitative findings, configuration recipes, waste categories, and proposed hook designs derived from inspecting local Claude Code JSONL session files. Treat it as documentation of a real-world experiment whose claims must be extracted carefully, tested against the repo's current setup, and translated into repo-specific recommendations.

The post mixes methodology, observed metrics, and product commentary in one stream. Some findings are directly actionable configuration lessons, such as deferred tool loading through `ENABLE_TOOL_SEARCH`; others are operational heuristics, such as avoiding stale sessions after idle gaps or preferring native tools over bash wrappers. The research output must separate those categories cleanly so later packets can distinguish simple config flips from hook engineering, instrumentation work, or documentation-only behavior changes.

The post also points to a companion implementation in phase `005-claudest`, where the `/get-token-insights` skill lives inside the `claude-memory` plugin. This phase does not own the plugin implementation. It owns the audit method, the waste taxonomy, the hook concepts, and the configuration implications for `Code_Environment/Public`.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Claude Optimization Settings (Reddit post) | Configuration audit + ENABLE_TOOL_SEARCH + cache hooks | 005 (claudest hosts the auditor) | Focus on config patterns, audit methodology, waste taxonomy — NOT implementation |
| 002 | codesight | Zero-dep AST + framework detectors -> CLAUDE.md generation | 003, 004 (context generation) | Focus on AST detectors, framework parsers, MCP tools |
| 003 | contextador | MCP server + queryable structure + Mainframe shared cache | 002, 004 (context generation) | Focus on self-healing, shared cache, MCP query interface |
| 004 | graphify | Knowledge graph (NetworkX + Leiden + EXTRACTED/INFERRED tags) | 002, 003 (codebase structure) | Focus on graph viz, multimodal, evidence tagging |
| 005 | claudest | Plugin marketplace + claude-memory + get-token-insights | 001 (auditor lives here) | Focus on marketplace structure, plugin discovery, memory plugin |

### 4.3 What This Repo Already Has

Assume `Code_Environment/Public` already has meaningful Claude workflow infrastructure:

- `.claude/settings.local.json` with `PreCompact`, `SessionStart`, and `Stop` hooks
- `CLAUDE.md` with mandatory gates, tool-routing rules, spec-folder enforcement, and completion rules
- Spec Kit Memory for context preservation and session continuity
- `skill_advisor.py` for Gate 2 skill routing
- existing hook wiring for recovery and session-state handling

This repo does **not** currently show `ENABLE_TOOL_SEARCH` in `.claude/settings.local.json`, does **not** have token-usage auditing comparable to `/get-token-insights`, and does **not** have cache-expiry warning hooks that block or warn before an expensive stale-cache turn. The research should compare these missing capabilities against the repo's current workflow rather than assuming a blank-slate Claude setup.

## 5. Instructions

Follow these steps in order and keep the research evidence-first.

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings` as the pre-approved phase folder. Skip Gate 3, keep all writable outputs inside this phase folder, and treat `external/` as read-only.
2. Read `external/reddit_post.md` fully from top to bottom before doing any sibling-phase cross-references. It is the primary and only required external research target for this phase.
3. Treat the Reddit post as a primary-source narrative with quantified findings, not as a formal implementation spec. Extract what the post documents, then assess what needs validation before repo adoption.
4. If the post uses multiple totals or labels that do not perfectly align across title and body, preserve that discrepancy explicitly in the research instead of smoothing it over or assuming a transcription mistake.
5. Cross-check the post against this repo's actual `.claude/settings.local.json` and `CLAUDE.md`. Confirm what already exists here, what is missing, and what would conflict with current gates or hooks.
6. Cross-reference the auditor implementation in sibling phase `005-claudest`, especially the `claude-memory` plugin README and the `get-token-insights` skill, because the post says the auditor ships there. Use phase `005` only to understand where the implementation lives; do not duplicate that phase's implementation deep dive.
7. Create Level 3 Spec Kit docs for this phase: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`. Keep the documentation aligned with the packet's research scope.
8. Use `@speckit` for markdown authoring and keep research outputs under `research/`. The canonical final analysis belongs in `research/research.md`.
9. Validate the phase folder with this exact command before treating the packet as complete:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings" --strict
   ```
10. Run `spec_kit:deep-research` using this exact topic:
   ```text
   Research the Reddit post at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/external/reddit_post.md and identify concrete configuration changes, hook designs, and waste-pattern detection methods that should be adopted by Code_Environment/Public to reduce Claude Code token spend and avoid rate-limit exhaustion.
   ```
11. Distinguish each major finding as one of three types: config change, hook implementation, or behavioral/process change. Recommendations that fit more than one category should say so explicitly.
12. Save all research outputs to `research/` and ensure `research/research.md` contains at least 5 evidence-backed findings citing exact passages from `reddit_post.md` using paragraph-start phrases or equivalent anchor language.
13. Update `checklist.md` with evidence, create `implementation-summary.md`, and record which recommendations are `adopt now`, `prototype later`, or `reject`.
14. Save packet memory with this exact command when the phase is complete:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings"
   ```

## 6. Research Questions

Answer these questions directly in the resulting research output.

1. What does the post actually prove about `ENABLE_TOOL_SEARCH`, and how credible is the claimed drop from roughly `20k` tool-schema tokens to `6k`?
2. What risks or tradeoffs might deferred tool loading introduce for first-tool-use latency, tool discoverability, or workflow ergonomics in `Code_Environment/Public`?
3. How should cache expiry be modeled as the dominant waste source, given the post's claim that `54%` of turns followed idle gaps longer than 5 minutes?
4. Which cache-expiry mitigations are configuration changes versus hook features versus user-behavior changes?
5. How should low-usage skills and schema bloat be detected in this repo, and what would count as evidence strong enough to disable or gate a skill?
6. What does the post reveal about redundant file reads, and how should that pattern be translated into repo-specific prompt rules, hooks, or reporting?
7. How serious are bash-vs-native-tool antipatterns in the post, and how should this repo reinforce native `Read` / `Grep` / `Glob` usage instead of `cat` / `grep` / `find` through bash?
8. What do the reported edit retry chains imply about prompt quality, file-edit workflow design, or guardrail messaging?
9. How should the three proposed cache-warning hooks (`Stop`, `UserPromptSubmit`, `SessionStart`) be evaluated for fit with this repo's existing hooks and session-recovery architecture?
10. Which waste categories in the post are directly measurable from local Claude JSONL data, and which depend on heuristics or inferred cost models?
11. How portable is the post's audit methodology to other CLI coding agents, and which parts are Claude-specific versus generally applicable?
12. What operational risk comes from relying on reverse-engineered local JSONL formats that Anthropic has not documented, and how should that fragility affect adoption priority?

## 7. Do's

- Do quote specific token counts, counts-of-events, and percentages from the post, including values like `45k`, `20k`, `6k`, `54%`, `1,122`, `662`, and `31` where relevant.
- Do distinguish transferable methodology from situational findings tied to one user's setup.
- Do cross-reference the findings against this repo's real `.claude/settings.local.json` and `CLAUDE.md`, not a hypothetical Claude environment.
- Do classify each recommendation as config change, hook implementation, behavioral change, or a hybrid of those categories.
- Do anchor every major finding to an exact passage in `reddit_post.md`, using paragraph-start phrases when possible.
- Do use phase `005` only as the implementation-overlap packet for the auditor and plugin location.
- Do keep the analysis focused on Claude workflow efficiency, token waste visibility, and rate-limit preservation.

## 8. Don'ts

- Don't treat the Reddit post as an implementation spec. It is a primary-source narrative with quantified claims and proposed interventions.
- Don't dismiss the findings just because they come from one author; the methodology is still rigorous enough to analyze because it uses large-session counts and explicit waste categories.
- Don't enable `ENABLE_TOOL_SEARCH` blindly without testing; first-tool-use latency or tool-discovery ergonomics may change.
- Don't ignore the JSONL-format fragility warning; Anthropic can change local transcript formats at any time.
- Don't conflate this phase with phase `005-claudest`; this phase owns the `what` and `why`, while phase `005` owns the implementation-oriented `how`.
- Don't chase dead URLs or external Reddit comments linked inside the post; treat them as references noted by the source, not as required follow-up reading.
- Don't spend the research on Anthropic billing debates or subscription pricing theory; stay on observable waste patterns and actionable repo changes.
- Don't dispatch sub-agents. This is a depth-1 leaf task and must be executed directly.

## 9. Examples

Use findings in this style.

```text
**Finding: ENABLE_TOOL_SEARCH reduces tool schema overhead from 20k to 6k tokens per turn**
- Source: reddit_post.md (paragraph beginning "The setting is called enable_tool_search")
- What it documents: Setting `ENABLE_TOOL_SEARCH=true` in `.claude/settings.local.json` env enables deferred tool loading, loading only 6 primary tools and lazy-loading the rest
- Why it matters: Code_Environment/Public has 100+ MCP tools registered; full schema loading dominates the session-start budget
- Recommended action: prototype later (test tool-discovery latency before adoption)
- Affected area: .claude/settings.local.json env block
- Risk/cost: Low config change but unknown latency impact on first-tool-use; needs A/B comparison
```

If useful, produce additional findings in the same compact schema:

- finding title
- source passage
- what the post documents
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected area
- risk, ambiguity, or validation cost

## 10. Constraints

### 10.1 Error Handling

- Reddit URLs mentioned inside the post may be dead, partial, or no longer accessible. Note them if relevant, but do not depend on them.
- If the post's top-line counts and body counts differ, preserve the discrepancy explicitly instead of normalizing the numbers silently.
- The companion implementation lives in phase `005`; refer there for implementation overlap, but do not duplicate the plugin deep dive in this phase.
- If a recommendation depends on instrumentation or hook behavior not present in this repo today, label that dependency clearly instead of implying it already exists.

### 10.2 Scope Boundaries

**IN SCOPE**

- configuration patterns
- waste taxonomy
- cache-expiry interpretation
- hook designs
- skill-schema bloat analysis
- redundant-file-read detection concepts
- bash-antipattern and edit-retry findings
- audit methodology portability

**OUT OF SCOPE**

- full `claudest` plugin implementation analysis
- reverse-engineering Anthropic billing behavior
- broad Reddit sentiment about rate limits
- implementation details owned by phases `002`, `003`, or `004`
- building a new token auditor inside this phase

### 10.3 Prioritization Framework

Rank findings in this order:

1. high-impact / low-effort config changes such as `ENABLE_TOOL_SEARCH` -> adopt now after light validation
2. high-impact / medium-effort hooks such as cache-expiry warnings -> prototype later
3. behavioral changes such as avoiding bash for `cat` / `grep` / `find` -> adopt now through documentation and workflow rules
4. instrumentation-heavy or format-fragile ideas -> prototype later unless the observability gap is severe

Maintain explicit RICCE completeness: Role, Instructions, Context, Constraints, and Examples must remain materially visible in the work product. Maintain explicit TIDD-EC completeness: Task, Instructions, Do's, Don'ts, Examples, and Context must remain clear, not merely implied.

## 11. Deliverables

Produce outputs that include all of the following:

1. `research/research.md` with at least 5 evidence-backed findings derived from `reddit_post.md`
2. exact source anchoring for each finding using passage-level phrasing such as the paragraph opening text
3. comparison against this repo's current `.claude/settings.local.json` and `CLAUDE.md`
4. a config-change checklist specifically for `.claude/settings.local.json`
5. recommendation labels for each finding: `adopt now`, `prototype later`, or `reject`
6. clear distinction between config changes, hook implementations, and behavioral/process changes
7. explicit overlap handling so phase `005` is referenced but not duplicated

## 12. Evaluation Criteria

Evaluate the finished work against this rubric before treating it as complete.

| Dimension | Target |
| --- | --- |
| TIDD-EC completeness | All required sections are materially present |
| RICCE completeness | Role, Instructions, Context, Constraints, and Examples are explicit and usable |
| Evidence quality | Each major finding cites a specific `reddit_post.md` passage |
| Repo alignment | Findings are cross-referenced with current `.claude/settings.local.json` and `CLAUDE.md` |
| Domain focus | Analysis stays on Claude Code optimization, cache behavior, and waste detection |
| Cross-phase discipline | Phase `005` overlap is acknowledged without duplicating implementation analysis |
| Actionability | Recommendations are concrete enough to drive later planning |
| CLEAR score | `>= 40/50` |

Minimum evidence bar:

- at least 5 findings
- each finding cites a specific passage
- each finding explains why it matters for this repo
- each finding includes a recommendation label
- the output includes a `.claude/settings.local.json` config checklist

## 13. Completion Bar

The phase is only complete when all of the following are true:

- Level 3 docs exist for this phase
- `research/research.md` contains at least 5 evidence-backed findings
- each finding cites an exact passage from `reddit_post.md`
- the findings are cross-referenced with this repo's current Claude configuration and rulebook
- `checklist.md` is updated with evidence
- `implementation-summary.md` exists
- memory is saved successfully for this phase folder
- overlap with phase `005-claudest` is explicit and does not duplicate auditor implementation analysis
- the work remains focused on configuration patterns, cache hooks, and waste taxonomy rather than generic Claude commentary
