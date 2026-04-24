# Iteration 2: Regression Fixture Dependency Map

## Research Actions Taken

1. Read the current loop state in `research/deep-research-strategy.md` and the full 24-key inventory from `research/iterations/iteration-001.md` to carry forward the migration dispositions and the `code audit` schema-violation. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/deep-research-strategy.md:1-58] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/iterations/iteration-001.md:15-101]
2. Re-read the Public advisor matcher layers: multi-word `INTENT_BOOSTERS`, `PHRASE_INTENT_BOOSTERS`, audit normalization, token/phrase scoring, explicit variant scoring, and name/corpus scoring. This establishes the dependency vocabulary used in the table below (`phrase`, `single-token intent`, `explicit variant`, `name`, `corpus`). [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:536-561] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:788-899] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1086-1111] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1728]
3. Evaluated all 44 JSONL fixtures against the live advisor flow (`analyze_prompt` for harness-equivalent filtered routing plus `analyze_request` for raw reason strings) and traced which prompts contain migrating multi-word keys, existing phrase keys, token-level boosters, command markers, and name/corpus matches. Fixture line numbers below refer to the JSONL dataset line number. [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:1-44] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1881-1897]
4. Ran the baseline regression harness exactly as requested: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl --threshold 0.8 --uncertainty 0.35 --min-top1-accuracy 0.92`. Result: `44/44` passed, `top1_accuracy=1.0`, `p0_pass_rate=1.0`, no failures.
5. Ran targeted advisor checks for `:review:auto security audit`, `audit skill advisor recommendations and speed`, and literal `code audit` to separate generic audit behavior from the dead `INTENT_BOOSTERS["code audit"]` entry. Those probes showed that the literal phrase already routes to `sk-code-review` via `PHRASE_INTENT_BOOSTERS["code audit"]`; the schema-violation is a source-of-truth mismatch, not a currently observable runtime split. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:560] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:598] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:753] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:807] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1635-1677]

## Fixture Case Dependency Table

Interpretation note: `contains_multi_word_INTENT_key` only tracks the 24 whitespace-containing `INTENT_BOOSTERS` keys identified in Iteration 1. `token_match_path` summarizes which live scoring paths materially contribute according to `skill_advisor.py:1634-1728`, `1686-1699`, and the fixture prompt text itself.

| case_id | priority | prompt (truncated) | expected_top_any | contains_multi_word_INTENT_key | contains_PHRASE_key | token_match_path | regression_risk | rationale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0-GIT-001 | P0 | create a pull request on github | sk-git | - | - | single-token intent + name | low | Fixture L1; routed by `github`/`pull` token boosts plus skill-name evidence, with no migrating multi-word dependency. |
| P0-GIT-002 | P0 | resolve merge conflict and rebase branch | sk-git | - | - | single-token intent + name + corpus | low | Fixture L2; routed by `merge`/`conflict`/`rebase`/`branch` tokens and git name/corpus overlap only. |
| P0-MEM-001 | P0 | save this conversation context to memory | system-spec-kit | - | save this conversation context | phrase + single-token intent + multi-token + corpus | low | Fixture L3; already anchored by the existing PHRASE entry `save this conversation context`, so the migration set is irrelevant here. |
| P0-SPEC-001 | P0 | create a new spec folder with plan and tasks | system-spec-kit | - | - | single-token intent + multi-token + name + corpus | low | Fixture L4; routed by `spec`/`plan`/`tasks`/`folder` token evidence rather than any multi-word migration candidate. |
| P0-CHROME-001 | P0 | debug console errors in chrome devtools | mcp-chrome-devtools | - | - | single-token intent + name | low | Fixture L5; pure token/name routing (`chrome`, `console`, `devtools`, `debug`). |
| P0-CHROME-002 | P0 | inspect network waterfall in browser | mcp-chrome-devtools | - | - | single-token intent + name | low | Fixture L6; pure token/name routing (`inspect`, `network`, `browser`). |
| P0-UNC-001 | P0 | api chain mcp | [] | - | - | single-token intent + multi-token | low | Fixture L7; ambiguous token-only case (`mcp`, `api`, `chain`) and intentionally outside the migration surface. |
| P0-UNC-002 | P0 | api chain mcp | mcp-code-mode | - | - | single-token intent + multi-token + name | low | Fixture L8; same token-only prompt as L7, but confidence-only mode promotes `mcp-code-mode`; still unrelated to migrating multi-word keys. |
| P0-CMD-001 | P0 | save this conversation context to memory | system-spec-kit | - | save this conversation context | phrase + single-token intent + multi-token + corpus | low | Fixture L9 duplicates L3 and remains phrase-anchored by the same existing memory-save PHRASE entry. |
| P0-CMD-002 | P0 | /spec_kit:plan create docs | command-spec-kit | - | - | command `command-spec-kit` + explicit variant + single-token intent + multi-token + name + corpus | low | Fixture L10; slash marker `/spec_kit` is the decisive route, not any migrating phrase logic. |
| P0-CMD-003 | P0 | /memory:save this context | command-memory-save | - | save this context | command `command-memory-save` + explicit variant + phrase + single-token intent + multi-token + name + corpus | low | Fixture L11; explicit command bridge plus existing `save this context` PHRASE entry dominate. |
| P0-ABSTAIN-001 | P0 | find where this function is defined | [] | - | - | none | low | Fixture L12; no migration key, no phrase key, and still intentionally abstains. |
| P1-FIGMA-001 | P1 | export components from figma design | mcp-figma | - | - | single-token intent + multi-token + name + corpus | low | Fixture L13; routed by `figma` plus export/design evidence only. |
| P1-MCP-001 | P1 | update notion page using code mode toolchain | mcp-code-mode | - | - | single-token intent + multi-token + name + corpus | low | Fixture L14; routed by `notion`/`toolchain`/tooling normalization, not by any migrating phrase. |
| P1-MCP-002 | P1 | fetch webflow cms collection | mcp-code-mode | - | - | single-token intent + corpus | low | Fixture L15; token-only webflow/CMS route. |
| P1-SEARCH-001 | P1 | find code that handles auth | mcp-coco-index | - | find code that, code that handles | phrase + multi-token + corpus + auto-semantic | low | Fixture L16; already pinned by existing CocoIndex PHRASE keys and auto-semantic intent, with no migrating dependency. |
| P1-SEARCH-002 | P1 | semantic code search for rate limiting | mcp-coco-index | - | code search, semantic code search | phrase + single-token intent + multi-token + corpus + auto-semantic | low | Fixture L17; existing search PHRASE keys already provide the decisive path. |
| P1-RESEARCH-001 | P1 | autoresearch this repository architecture | sk-deep-research | - | autoresearch | phrase + single-token intent + name + corpus | low | Fixture L18; uses the single-token `autoresearch` key plus the matching PHRASE entry, not any of the 24 migrating multi-word keys. |
| P1-RESEARCH-002 | P1 | /autoresearch auth subsystem | sk-deep-research | - | autoresearch, /autoresearch | phrase + single-token intent + name + corpus | low | Fixture L19; same conclusion as L18, now strengthened by the explicit `/autoresearch` PHRASE route. |
| P1-REVIEW-001 | P1 | perform a security code review for regressions | sk-code-review | - | code review | phrase + single-token intent + multi-token + name + corpus | low | Fixture L20; existing `code review` PHRASE entry already controls the route. |
| P1-REVIEW-002 | P1 | check merge readiness and request changes | sk-code-review | - | request changes, merge readiness | phrase + single-token intent + multi-token | low | Fixture L21; existing review PHRASE entries dominate. |
| P1-REVIEW-003 | P1 | deep review loop for release readiness | sk-deep-review | deep review, review loop | deep review, review loop | phrase + single-token intent + multi-token + name + corpus | low | Fixture L22 is the only fixture that contains any migrating multi-word INTENT key, but both keys already have same-skill PHRASE entries (`deep review`, `review loop` at `skill_advisor.py:884-885`), so migration should be behavior-preserving. |
| P1-REVIEW-004 | P1 | :review:auto security audit | sk-deep-review | - | :review, :review:auto | phrase + single-token intent + multi-token + name | low | Fixture L23 is audit-adjacent, but it does **not** contain literal `code audit`; current routing comes from `:review:auto` (PHRASE at `skill_advisor.py:897`) plus generic audit/review signals. |
| P1-REVIEW-005 | P1 | auto review release readiness | sk-deep-review | - | auto review release readiness | phrase + single-token intent + multi-token + name | low | Fixture L24 is already anchored by the dedicated deep-review PHRASE entry `auto review release readiness`. |
| P1-REVIEW-006 | P1 | auto review this PR | sk-code-review | - | review this pr | phrase + single-token intent + multi-token + name | low | Fixture L25 is already anchored by the existing `review this pr` PHRASE key. |
| P1-REVIEW-007 | P1 | review and update this | sk-code-review | - | - | single-token intent + multi-token + name | low | Fixture L26 is review-token driven only; no migration key is involved. |
| P1-WEB-001 | P1 | implement responsive css layout fix | sk-code-web | - | responsive css, responsive css layout, responsive css layout fix, layout fix | phrase + single-token intent + multi-token + name + corpus | low | Fixture L27 is already pinned by multiple existing web PHRASE entries; migrating advisor phrases are unrelated. |
| P1-WEB-002 | P1 | refactor frontend component and verify access... | sk-code-web | - | - | single-token intent + name | low | Fixture L28 is pure token/name routing (`refactor`, `frontend`, `accessibility`). |
| P1-OPENCODE-001 | P1 | update python script following opencode stand... | sk-code-opencode | - | - | single-token intent + multi-token + name + corpus | low | Fixture L29 is routed by `opencode`/`python`/`script`/`standards` evidence only. |
| P1-OPENCODE-002 | P1 | write bash script with proper shebang and sna... | sk-code-opencode | - | - | single-token intent + multi-token | low | Fixture L30 is pure token routing (`bash`, `shebang`, `snake_case`, `script`). |
| P1-PROMPT-001 | P1 | improve this prompt with COSTAR framework | sk-improve-prompt | - | improve this prompt | phrase + single-token intent + multi-token + name + corpus | low | Fixture L31 is already pinned by the existing improve-prompt PHRASE key and single-token prompt-framework boosts. |
| P1-PROMPT-002 | P1 | enhance my prompt using CRISPE and CRAFT | sk-improve-prompt | - | enhance my prompt | phrase + single-token intent + multi-token + name + corpus | low | Fixture L32 is already pinned by the existing improve-prompt PHRASE key and framework tokens. |
| P1-DOC-001 | P1 | create markdown documentation and install gui... | sk-doc | - | - | single-token intent + corpus | low | Fixture L33 is documentation-token driven only. |
| P1-CLI-001 | P1 | use gemini cli for second opinion | cli-gemini | - | use gemini, gemini cli, second opinion | phrase + single-token intent + multi-token + name | low | Fixture L34 is already pinned by existing CLI PHRASE keys. |
| P1-CLI-002 | P1 | delegate to codex for code generation | cli-codex | - | delegate to codex | phrase + single-token intent + multi-token + name + corpus | low | Fixture L35 is already pinned by the existing Codex delegation PHRASE key. |
| P1-CLI-003 | P1 | use claude code cli for extended thinking | cli-claude-code | - | use claude code, claude code cli, extended thinking | phrase + multi-token + name + corpus | low | Fixture L36 is already pinned by existing Claude CLI PHRASE keys. |
| P1-CLI-004 | P1 | delegate to copilot cli in cloud delegation m... | cli-copilot | - | copilot cli, delegate to copilot, cloud delegation | phrase + single-token intent + multi-token + name + corpus | low | Fixture L37 is already pinned by existing Copilot CLI PHRASE keys. |
| P1-FULLSTACK-001 | P1 | build full stack typescript service | sk-code-full-stack, sk-code-opencode | - | full stack typescript | phrase + single-token intent + corpus | low | Fixture L38 is anchored by `full stack typescript`, which is already a PHRASE key outside the migration set. |
| P1-ABSTAIN-001 | P1 | help | [] | - | - | none | low | Fixture L39 intentionally abstains and does not touch the migration surface. |
| P1-ABSTAIN-002 | P1 | optimize skill_advisor.py execution speed and... | [] | - | - | none | low | Fixture L40 intentionally abstains and does not touch the migration surface. |
| P1-AUDIT-001 | P1 | audit skill advisor recommendations and speed | sk-code-review | - | - | single-token intent + multi-token + name | low | Fixture L41 is audit-adjacent, but it routes via generic `audit` token scoring and review normalization (`skill_advisor.py:598`, `753`, `1087-1090`), not via literal `code audit`. |
| P1-GRAPH-001 | P1 | use figma to export designs | mcp-figma | - | - | single-token intent + multi-token + name + corpus | low | Fixture L42 is pure figma/export routing with no migration key. |
| P1-GRAPH-002 | P1 | review opencode typescript module | sk-code-review, sk-code-opencode | - | - | single-token intent + multi-token + name + corpus | low | Fixture L43 is review/opencode token routing plus graph affinity, not a migrating phrase dependency. |
| P1-GRAPH-003 | P1 | clickup create task via mcp | mcp-clickup | - | - | single-token intent + multi-token + name | low | Fixture L44 is clickup/mcp token routing only. |

## At-Risk Cases

No current fixture case crosses `regression_risk >= med`.

The meaningful exposure in this suite is a **coverage gap**, not a live risky row:

- **No fixture contains the literal phrase `code audit`.** That means the only schema-violation found in Iteration 1 (`INTENT_BOOSTERS["code audit"] -> sk-deep-review` versus `PHRASE_INTENT_BOOSTERS["code audit"] -> sk-code-review`) can be cleaned up without any fixture asserting the exact phrase behavior. [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:1-44] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:560] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:807]
- The nearest fixture proxies are `P1-REVIEW-004` (L23) and `P1-AUDIT-001` (L41), but both stay low-risk because neither prompt contains `code audit`; they route through `:review:auto` or generic `audit` token logic instead. Mitigation: add at least one literal `code audit` fixture in Iteration 5 so the schema-alignment decision becomes regression-guarded. [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:23] [SOURCE: .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl:41]

## code-audit Impact Analysis

All fixture prompts containing `audit` or `code audit`:

| Fixture / probe | Source line | Current top skill | Why it routes there now | What changes after migration |
| --- | --- | --- | --- | --- |
| `P1-REVIEW-004` - `:review:auto security audit` | fixture L23 | `sk-deep-review` | The prompt does **not** contain literal `code audit`; it matches `:review` / `:review:auto` deep-review PHRASE keys and only uses `audit` as a generic token. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:896-897] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:598] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:753] | No expected change from the 24-key migration. This case is orthogonal to the `code audit` schema mismatch. |
| `P1-AUDIT-001` - `audit skill advisor recommendations and speed` | fixture L41 | `sk-code-review` | The prompt also lacks literal `code audit`; it routes via `audit` token scoring plus review normalization. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:598] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:753] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1087-1090] | No expected change from the 24-key migration. It remains a generic audit-token case, not a phrase-migration case. |
| Literal probe: `code audit` (non-fixture) | not in suite | `sk-code-review` | Runtime already favors the PHRASE entry `code audit -> sk-code-review`; the conflicting INTENT entry is dead because multi-word INTENT keys never receive the tokenized prompt. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:560] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:807] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1635-1677] | The visible routing should stay `sk-code-review`; migration only removes the dead conflicting declaration so the source data matches current runtime behavior. |

Bottom line: the `code audit` schema-violation is still worth fixing, but **today's regression suite does not exercise the literal phrase**, and the literal phrase already behaves like the PHRASE table says it should.

## Baseline Regression Metrics

Command run:

`python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl --threshold 0.8 --uncertainty 0.35 --min-top1-accuracy 0.92`

Observed baseline:

- `top1_accuracy`: `1.0`
- `p0_pass_rate`: `1.0`
- `pass_rate`: `1.0` (`44/44` passed)
- Currently failing cases: **none**

This means Iteration 2 found **no existing regression failures to preserve**; the migration work needs to preserve a clean baseline rather than avoid already-known red cases.

## Strategy Updates

### New Findings to Propagate

- Only **1/44** fixture cases contains any of the 24 migrating multi-word `INTENT_BOOSTERS` keys: `P1-REVIEW-003` at fixture line 22. That case is already protected by same-skill PHRASE entries (`deep review`, `review loop`), so it is not a direct regression risk.
- **0/44** fixtures exercise any of the six `migrate-with-same-weight` keys that currently have no PHRASE entry: `proposal only`, `5d scoring`, `integration scan`, `dynamic profile`, `vector search`, `concept search`.
- **21/44** fixtures already route through at least one existing PHRASE key, so much of the suite is already validating the correct phrase-scoring path rather than the broken INTENT path.
- **0/44** fixtures contain literal `code audit`; the audit-related coverage is indirect (`:review:auto security audit` and generic `audit`), so the schema-violation is presently unguarded by an exact-match regression case.
- Literal `code audit` already routes to `sk-code-review` at runtime because the PHRASE entry fires and the multi-word INTENT entry is unreachable under tokenization. The migration should therefore align source declarations with existing behavior, not introduce a deliberate routing change.

### Updated Next Focus

Iteration 3: identify under-covered Public multi-word identifiers needing new PHRASE entries, prioritizing the six currently unexercised `migrate-with-same-weight` keys and any high-signal Public identifiers that still depend on token-only fallbacks.

## Convergence Signal

- newInfoRatio: 0.68
- stuckIndicator: no - this pass mapped all 44 fixtures, isolated the sole fixture touching the migration set, and proved that `code audit` is currently a coverage gap rather than an active runtime split.
- regressionRiskMapped: yes
