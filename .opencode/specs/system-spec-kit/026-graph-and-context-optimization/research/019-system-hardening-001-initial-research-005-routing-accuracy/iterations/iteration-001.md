# Iteration 001

## Focus

Enumerate the current routing surfaces without running any corpus evaluation yet:

1. `gate-3-classifier.ts` trigger vocabulary, normalization, return schema, and override behavior.
2. `skill_advisor.py` routing pipeline, thresholding, scoring surfaces, and registry/graph inputs.
3. Trigger-bearing phrases currently exposed by `.opencode/skill/*/SKILL.md`.

## Actions

1. Read the deep-research workflow contract in [sk-deep-research/SKILL.md] and the mandatory spec-folder workflow in [system-spec-kit/SKILL.md].
2. Read the phase-local strategy/config to confirm scope, key questions, and executor constraints.
3. Read `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`.
4. Read `.opencode/skill/skill-advisor/scripts/skill_advisor.py` and traced the ranking path with targeted `rg`/`sed` extraction.
5. Scanned `.opencode/skill/*/SKILL.md` for `<!-- Keywords: ... -->`, `Activation Triggers`, and `Keyword Triggers` sections.

## Enumeration Results

### A. Gate 3 classifier

Source: `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`

- Trigger categories: `file_write`, `memory_save`, `resume`, `read_only`.
- Match kinds: `phrase` and `token`.
- Return schema: `ClassificationResult { triggersGate3, reason, matched, readOnlyMatched }`.
- `reason` enum values: `file_write_match`, `memory_save_match`, `resume_match`, `read_only_override`, `no_match`.
- Normalization path:
  - folds unicode confusables to ASCII
  - lowercases
  - collapses whitespace
  - preserves `/` and `:` so command phrases survive
- Tokenization: split on non `[a-z0-9:/_-]`, so slash commands and `:` namespaces remain intact.

Canonical trigger vocabulary:

- File-write positive tokens:
  - `create`, `add`, `remove`, `delete`, `rename`, `move`, `update`, `change`, `modify`, `edit`, `fix`, `refactor`, `implement`, `build`, `write`, `generate`, `configure`
- Memory-save phrases:
  - `save context`, `save memory`, `/memory:save`
- Resume/write-producing phrases:
  - `/spec_kit:resume`, `resume iteration`, `resume deep research`, `resume deep review`, `continue iteration`
- Read-only disqualifiers:
  - `review`, `audit`, `inspect`, `analyze`, `explain`

Behavior/edge cases:

- `memory_save` and `resume` matches always trigger Gate 3, even if read-only words are also present.
- `file_write` can be suppressed if any read-only disqualifier matches.
- The implementation currently does not perform a file-target pairing heuristic; for `file_write`, any read-only disqualifier is enough to flip the result to `read_only_override`.
- Known false-positive tokens called out in the strategy are reflected in the vocabulary split:
  - `analyze` was moved to read-only disqualifiers.
  - `decompose` and `phase` are intentionally absent from positive triggers.

### B. Skill advisor

Sources:

- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py` (referenced by the main script)

Observed routing inputs:

- Skill graph source prefers SQLite:
  - `system-spec-kit/mcp_server/database/skill-graph.sqlite`
  - falls back to `skill-graph.json` if SQLite is unavailable
- Graph-enriched signal sources:
  - `intent_signals` from compiled graph rows
  - `derived.trigger_phrases` from each skill's `graph-metadata.json`
- SKILL discovery surface:
  - frontmatter is parsed via `parse_frontmatter_fast(...)`
  - inline records/variants are built from `name`, `description`, and normalized skill-name variants

Observed routing pipeline:

1. Lowercase prompt and collect raw tokens.
2. Load skills via `get_skills()`.
3. Detect explicit command intent.
4. Apply intent normalization (`review`, `implementation`, `documentation`, `memory`, `tooling` buckets).
5. Auto-boost `mcp-coco-index` when `should_auto_use_semantic_search(prompt)` fires.
6. Blend optional CocoIndex semantic hits into keyword scoring.
7. Apply token-level intent boosters and multi-skill boosters.
8. Apply phrase-level intent boosters (`PHRASE_INTENT_BOOSTERS`).
9. Apply graph signal boosts from compiled/source graph metadata.
10. Apply graph relationship boosts and family affinity boosts.
11. Apply strong explicit-skill boost when the prompt names a skill directly.
12. Apply keyword-variant boost from per-skill keyword phrases.
13. Run name/corpus term matching over normalized search terms.
14. Apply command penalty when a command skill is not the explicit command target.
15. Compute `confidence` and `uncertainty`.
16. Calibrate confidence, dampen graph-heavy matches, then run:
  - deep-research/deep-review disambiguation
  - iteration-loop tiebreaker
  - dual-threshold pass/fail
  - graph conflict penalty
17. Sort final recommendations.

Threshold/scoring surfaces confirmed this iteration:

- Default confidence threshold: `0.8`
- Default uncertainty threshold: `0.35`
- CLI flags expose both thresholds:
  - `--threshold`
  - `--uncertainty`
  - `--confidence-only`
- Confidence comments in the source document the current linear scaling:
  - with intent boost: `min(0.50 + score * 0.15, 0.95)`
  - without intent boost: `min(0.25 + score * 0.15, 0.95)`
  - the source comment notes `score >= 2.0` is enough to clear `0.8` with an intent boost
- Uncertainty is derived from:
  - `num_matches`
  - `has_intent_boost`
  - `num_ambiguous_matches`

Important routing observations:

- The advisor is not a pure embedding/semantic router. It is a hybrid scorer:
  - keyword/token/phrase boosts
  - graph signal/relationship boosts
  - optional CocoIndex semantic boosts
  - explicit-skill mention boosts
- The graph is authoritative for adjacency/signal/conflict boosts; SKILL markdown alone is not the whole routing source of truth.

### C. Skill trigger-phrase catalogue from `SKILL.md`

Important cataloguing observation first:

- No scanned `SKILL.md` exposed a canonical YAML frontmatter field named `triggerPhrases` or `trigger_phrases`.
- In practice, trigger-bearing text is split across:
  - `<!-- Keywords: ... -->` comments near the top of the file
  - `### Activation Triggers`
  - `### Keyword Triggers` or `**Keyword Triggers**`
- Machine-consumable `trigger_phrases` for the advisor appear to come from `graph-metadata.json`, not from SKILL frontmatter.

Per-skill SKILL.md trigger-bearing surfaces found in this pass:

| Skill | Trigger-bearing surface in `SKILL.md` | Enumerated phrases/themes |
| --- | --- | --- |
| `cli-claude-code` | keywords comment + activation section | keywords: `claude-code`, `claude-cli`, `anthropic`, `deep-reasoning`, `extended-thinking`, `code-editing`, `structured-output`, `agent-delegation`, `opus`, `sonnet`, `haiku`; activation themes: complex architecture decisions, trade-off analysis, algorithm design, subtle bug RCA |
| `cli-codex` | keywords comment + activation section | keywords: `codex`, `codex-cli`, `openai`, `web-search`, `code-generation`, `code-review`, `second-opinion`, `agent-delegation`, `gpt-5`, `session-management`; activation themes: cross-AI validation, security audit, bug detection, `/review` workflow |
| `cli-copilot` | keywords comment + activation section | keywords: `copilot`, `copilot-cli`, `github`, `cross-ai`, `planning`, `cloud-delegation`, `autopilot`, `multi-model`, `gpt-5`, `claude-4.6`, `gemini-3`; activation themes: collaborative planning, architecture mapping, plan-mode logic, cross-file dependency mapping |
| `cli-gemini` | keywords comment + activation section | keywords: `gemini`, `gemini-cli`, `google`, `cross-ai`, `web-search`, `codebase-investigator`, `code-generation`, `code-review`, `second-opinion`, `agent-delegation`; activation themes: cross-AI validation, security audit, bug detection |
| `mcp-chrome-devtools` | keywords comment + activation section | keywords: `chrome-devtools`, `cdp`, `browser-debugger-cli`, `bdg`, `browser-automation`, `screenshot-capture`, `network-monitoring`, `mcp-code-mode`; activation phrases/themes: browser debugging, Chrome DevTools, CDP, screenshots, HAR files, console logs, `bdg` |
| `mcp-clickup` | keywords comment + activation section | keywords: `clickup`, `mcp-clickup`, `cu`, `clickup-cli`, `task-management`, `sprint`, `standup`, `project-management`, `workspace`, `time-tracking`, `goals`, `documents`, `webhooks`; activation phrases/themes: `ClickUp`, `clickup`, `cu`, tasks, sprints, standups, project management, workspace discovery |
| `mcp-coco-index` | keywords comment + activation section | keywords: `cocoindex-code`, `semantic-search`, `vector-embeddings`, `code-search`, `mcp-server`, `ccc`, `codebase-indexing`, `voyage-code-3`, `all-MiniLM-L6-v2`; activation themes: "find code that does X", concept/intent search, similar patterns, Grep/Glob insufficient |
| `mcp-code-mode` | keywords comment only in this pass | keywords: `mcp-code-mode`, `typescript-execution`, `multi-tool-workflow`, `tool-orchestration`, `context-reduction`, `progressive-discovery`, `external-api-integration`, `mcp-server` |
| `mcp-figma` | keywords comment + activation section + keyword trigger section | keywords: `figma`, `mcp-figma`, `design-files`, `components`, `styles`, `images`, `export`, `design-tokens`, `design-system`, `collaboration`, `comments`, `team-projects`; keyword triggers: `"figma file"`, `"design file"`, `"get design"`, `"figma document"`, `"export image"`, `"export png"`, `"export svg"`, `"render node"`, `"figma components"`, `"design system"`, `"component library"`, `"design tokens"`, `"figma styles"`, `"colors"`, `"typography"`, `"team projects"`, `"project files"`, `"figma team"`, `"design comments"`, `"review comments"`, `"figma feedback"` |
| `sk-code-full-stack` | keywords comment + activation section | keywords: `sk-code-web`, `development-orchestrator`, `multi-stack`, `stack-detection`, `debugging-workflow`, `implementation-patterns`, `react`, `nextjs`, `react-native`, `swift`, `go`, `nodejs`; activation themes: start dev work on supported stack, implement features/APIs/components/services/modules, handle failing tests, verify completion claims |
| `sk-code-opencode` | keywords comment + activation section | keywords: `opencode style`, `script standards`, `mcp code quality`, `node code style`, `typescript style`, `ts standards`, `python style`, `py standards`, `bash style`, `shell script`, `json format`, `jsonc config`, `code standards opencode`; activation themes: write/modify OpenCode system code, JS modules, Python scripts, shell scripts |
| `sk-code-review` | keywords comment + activation section + keyword trigger section | keywords: `sk-code-review`, `code-review`, `pull-request`, `findings-first`, `security-review`, `quality-gate`, `stack-agnostic`, `baseline-overlay`; keyword triggers: `review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `request changes`, `findings`, `blocking issues`, `merge readiness` |
| `sk-code-web` | keywords comment + activation section | keywords: `sk-code-web`, `development-orchestrator`, `frontend-development`, `browser-verification`, `debugging-workflow`, `implementation-patterns`, `webflow-integration`; activation themes: frontend work, forms/APIs/DOM, external libs/media, JS-file edits |
| `sk-deep-research` | keywords comment + keyword trigger section | keywords: `autoresearch`, `deep-research`, `iterative-research`, `autonomous-loop`, `convergence-detection`, `externalized-state`, `fresh-context`, `research-agent`, `JSONL-state`, `strategy-file`; keyword triggers: `autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research` |
| `sk-deep-review` | keywords comment + keyword trigger section | keywords: `deep-review`, `code-audit`, `iterative-review`, `review-loop`, `convergence-detection`, `externalized-state`, `fresh-context`, `review-agent`, `JSONL-state`, `severity-findings`, `P0-P1-P2`, `release-readiness`, `spec-alignment`; keyword triggers: `deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder` |
| `sk-doc` | keywords comment only in this pass | keywords: `sk-doc`, `markdown-quality`, `skill-creation`, `document-validation`, `ascii-flowchart`, `llms-txt`, `content-optimization`, `extract-structure` |
| `sk-git` | keywords comment + keyword trigger section | keywords: `git-workflow`, `git-worktree`, `conventional-commits`, `pull-request`, `commit-hygiene`, `workspace-isolation`, `version-control`, `github`, `issues`, `pr-review`; keyword triggers: `worktree`, `branch`, `commit`, `merge`, `pr`, `pull request`, `git workflow`, `conventional commits`, `finish work`, `integrate changes`, `github`, `issue`, `review` |
| `sk-improve-agent` | keywords comment + activation section | keywords: `sk-improve-agent`, `improve-agent`, `agent-improvement`, `benchmark-harness`, `score-candidate`, `promote-candidate`, `rollback-candidate`; activation themes: test whether agent prompt/instruction surfaces can improve, explicit mutation boundary, packet-local evidence, target-specific scoring rules |
| `sk-improve-prompt` | keywords comment + activation section + keyword trigger section | keywords: `prompt-engineering`, `prompt-improvement`, `DEPTH`, `RICCE`, `CLEAR-scoring`, `framework-selection`, `RCAF`, `COSTAR`, `CRAFT`, `TIDD-EC`, `CRISPE`; keyword triggers: `$improve`, `$text`, `$short`, `$refine`, `$json`, `$yaml`, `$raw`, `improve my prompt`, `enhance this prompt`, `prompt engineering`, `create a prompt for`, `optimize this prompt` |
| `system-spec-kit` | keywords comment + activation section | keywords: `spec-kit`, `speckit`, `documentation-workflow`, `spec-folder`, `template-enforcement`, `context-preservation`, `progressive-documentation`, `validation`, `spec-kit-memory`, `vector-search`, `hybrid-search`, `bm25`, `rrf-fusion`, `fsrs-decay`, `constitutional-tier`, `checkpoint`, `importance-tiers`, `cognitive-memory`, `co-activation`, `tiered-injection`; activation rule: mandatory for all file modifications |

## Questions Answered

- None fully closed yet.
- Partial progress toward Q4:
  - confirmed the current false-positive guard vocabulary (`analyze` as read-only; `decompose` and `phase` removed from positive triggers)
- Partial progress toward Q2/Q3/Q6/Q8:
  - routing surfaces, scoring knobs, and trigger-bearing skill text are now enumerated for later corpus evaluation

## Next Focus

Build the labeled corpus design:

1. Define corpus buckets (true write, true read-only, memory-save/resume, mixed/ambiguous, deep-loop prompts, skill-routing prompts).
2. Formalize annotation protocol and gold labels for Gate 3 and top-1 skill routing.
3. Decide how to extract machine-side `trigger_phrases` from `graph-metadata.json` alongside the SKILL.md catalogue assembled here.

## Ruled Out

- Treating `SKILL.md` YAML frontmatter as the canonical source of per-skill `triggerPhrases`.
  - This pass found no uniform `triggerPhrases` field in SKILL frontmatter.
  - The advisor’s machine-consumed signal surface appears to come from graph metadata plus keyword-bearing body sections/comments, not from frontmatter alone.
