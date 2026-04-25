# Iteration 1: INTENT_BOOSTERS Inventory + Disposition Classification

## Research Actions Taken

1. Ran `rg "INTENT_BOOSTERS|MULTI_SKILL_BOOSTERS|PHRASE_INTENT_BOOSTERS" .opencode/skill/skill-advisor/scripts/skill_advisor.py` to confirm the three relevant dict anchors and the token/phrase application sites.
2. Read `skill_advisor.py:496-920` to inspect `INTENT_BOOSTERS`, `MULTI_SKILL_BOOSTERS`, and the relevant `PHRASE_INTENT_BOOSTERS` entries.
3. Read `skill_advisor.py:1628-1679` to verify the tokenizer path: `all_tokens = re.findall(r'\b\w+\b', prompt_lower)` feeds exact token lookups into `INTENT_BOOSTERS`/`MULTI_SKILL_BOOSTERS`, while `PHRASE_INTENT_BOOSTERS` scans raw substrings in `prompt_lower`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1677]
4. Read `research/deep-research-strategy.md` and `research/deep-research-state.jsonl` to align with the current loop topic and iteration focus. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/deep-research-strategy.md:1-45] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring/research/deep-research-state.jsonl:1]
5. Ran an AST-backed Python extraction over `skill_advisor.py` to enumerate every whitespace-containing key in `INTENT_BOOSTERS` and `MULTI_SKILL_BOOSTERS`, compare each against `PHRASE_INTENT_BOOSTERS`, and validate value shapes.

## Multi-Word Key Inventory

`MULTI_SKILL_BOOSTERS` contains **zero** whitespace-containing keys; the complete tokenizer-broken inventory is therefore the 24 whitespace-containing entries in `INTENT_BOOSTERS`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:751-784]

| Key | Source Dict | Current Target | Weight | PHRASE Duplicate? | PHRASE Weight | Disposition | Rationale |
|-----|-------------|----------------|--------|-------------------|---------------|-------------|-----------|
| `deep research` | `INTENT_BOOSTERS` | `sk-deep-research` | 1.5 | yes | 2.5 | `migrate-with-phrase-weight-kept` | INTENT at L537 is dead under token matching; PHRASE L824 already routes the same key to the same skill at a higher weight. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:537] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:824] |
| `research loop` | `INTENT_BOOSTERS` | `sk-deep-research` | 1.5 | yes | 2.5 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with stronger PHRASE routing: INTENT L538 vs PHRASE L825. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:538] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:825] |
| `iterative research` | `INTENT_BOOSTERS` | `sk-deep-research` | 1.2 | yes | 2.5 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight at L830 than dead INTENT weight at L539. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:539] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:830] |
| `autonomous research` | `INTENT_BOOSTERS` | `sk-deep-research` | 1.5 | yes | 2.5 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L541, PHRASE L829. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:541] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:829] |
| `agent improvement` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.8 | yes | 2.8 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L542, PHRASE L834. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:542] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:834] |
| `recursive agent` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.8 | yes | 2.8 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L543, PHRASE L835. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:543] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:835] |
| `improvement loop` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.8 | yes | 2.8 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L544, PHRASE L836. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:544] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:836] |
| `proposal only` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.4 | no | - | `migrate-with-same-weight` | No exact PHRASE duplicate exists; this whitespace key is dead in INTENT and should be moved into PHRASE unchanged. INTENT source is L546. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:546] |
| `candidate scoring` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.6 | yes | 2.3 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L548, PHRASE L842. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:548] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:842] |
| `promotion gate` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.4 | yes | 2.0 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L549, PHRASE L843. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:549] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:843] |
| `5d scoring` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.8 | no | - | `migrate-with-same-weight` | No exact PHRASE duplicate exists; move this dead whitespace key into PHRASE with the existing INTENT weight. INTENT source is L551. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:551] |
| `integration scan` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.6 | no | - | `migrate-with-same-weight` | No exact PHRASE duplicate exists; move this dead whitespace key into PHRASE unchanged. INTENT source is L552. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:552] |
| `dynamic profile` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.6 | no | - | `migrate-with-same-weight` | No exact PHRASE duplicate exists; move this dead whitespace key into PHRASE unchanged. INTENT source is L553. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:553] |
| `evaluate agent` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.6 | yes | 2.6 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L554, PHRASE L860. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:554] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:860] |
| `score agent` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.6 | yes | 2.6 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L555, PHRASE L859. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:555] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:859] |
| `agent evaluation` | `INTENT_BOOSTERS` | `sk-improve-agent` | 1.6 | yes | 2.6 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L556, PHRASE L861. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:556] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:861] |
| `deep review` | `INTENT_BOOSTERS` | `sk-deep-review` | 1.5 | yes | 2.5 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L557, PHRASE L884. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:557] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:884] |
| `review mode` | `INTENT_BOOSTERS` | `sk-deep-review` | 1.2 | yes | 2.0 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L558, PHRASE L888. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:558] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:888] |
| `iterative review` | `INTENT_BOOSTERS` | `sk-deep-review` | 1.2 | yes | 2.5 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L559, PHRASE L886. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:559] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:886] |
| `code audit` | `INTENT_BOOSTERS` | `sk-deep-review` | 1.0 | yes | `2.2 (sk-code-review)` | `schema-violation` | Same phrase key exists in PHRASE, but it routes to a different skill (`sk-code-review`) than INTENT (`sk-deep-review`), so this cannot be auto-migrated as a weight-only cleanup. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:560] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:807] |
| `review loop` | `INTENT_BOOSTERS` | `sk-deep-review` | 1.2 | yes | 2.5 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L561, PHRASE L885. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:561] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:885] |
| `vector search` | `INTENT_BOOSTERS` | `mcp-coco-index` | 2.0 | no | - | `migrate-with-same-weight` | No exact PHRASE duplicate exists; move this dead whitespace key into PHRASE unchanged. INTENT source is L742. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:742] |
| `similar code` | `INTENT_BOOSTERS` | `mcp-coco-index` | 1.8 | yes | 2.0 | `migrate-with-phrase-weight-kept` | Same-skill duplicate with higher PHRASE weight: INTENT L743, PHRASE L870. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:743] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:870] |
| `concept search` | `INTENT_BOOSTERS` | `mcp-coco-index` | 2.0 | no | - | `migrate-with-same-weight` | No exact PHRASE duplicate exists; move this dead whitespace key into PHRASE unchanged. INTENT source is L744. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:744] |

## Schema Violations (if any)

One halt-worthy anomaly was detected:

- `code audit` is not a clean duplicate. `INTENT_BOOSTERS` maps it to `("sk-deep-review", 1.0)` at L560, while `PHRASE_INTENT_BOOSTERS` maps the same phrase to `[("sk-code-review", 2.2)]` at L807. That is a target mismatch, not a simple weight mismatch, so it should be treated as `schema-violation` for this migration pass. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:560] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:807]

No malformed value shapes were found during the AST validation pass:

- Every `INTENT_BOOSTERS` entry still uses a 2-tuple `(skill_name, boost)`.
- Every `MULTI_SKILL_BOOSTERS` entry still uses a list of 2-tuples `[(skill_name, boost), ...]`.
- `MULTI_SKILL_BOOSTERS` has no whitespace-containing keys to migrate. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:496-784]

## Weight Preservation Logic

Because token matching uses `re.findall(r'\b\w+\b', prompt_lower)` and then checks each token against `INTENT_BOOSTERS`/`MULTI_SKILL_BOOSTERS`, any key containing a space is unreachable there. Phrase routing is the correct home because `PHRASE_INTENT_BOOSTERS` checks `if phrase in prompt_lower`. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1677]

The disposition logic for this inventory is:

1. If the same phrase already exists in `PHRASE_INTENT_BOOSTERS` for the same skill and with a higher weight, delete the dead `INTENT_BOOSTERS` entry and keep the existing PHRASE weight (`migrate-with-phrase-weight-kept`).
2. If no exact phrase duplicate exists, move the dead INTENT entry into `PHRASE_INTENT_BOOSTERS` with the same weight (`migrate-with-same-weight`).
3. If an exact phrase duplicate ever existed with the same skill and same weight, that would be `duplicate-remove`; **none were found in this inventory**.
4. If an exact phrase duplicate exists but points to a different skill or otherwise breaks one-to-one migration assumptions, halt and flag it as `schema-violation` (`code audit` is the only current case).

Observed counts in this pass:

- `migrate-with-phrase-weight-kept`: 17
- `migrate-with-same-weight`: 6
- `duplicate-remove`: 0
- `schema-violation`: 1

## Key Citations

- Dead-code mechanism: whitespace tokenization plus exact token lookups, versus substring phrase matching. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1677]
- Full `INTENT_BOOSTERS` inventory zone containing all 24 whitespace keys: deep-research/improve-agent/deep-review entries at L537-L561, CocoIndex entries at L742-L744. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:537-561] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:742-744]
- `MULTI_SKILL_BOOSTERS` contains only single-token keys across the whole dict. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:751-784]
- Matching PHRASE duplicates for deep research live at L824-L830. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:824-830]
- Matching PHRASE duplicates for improve-agent live at L834-L861. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:834-861]
- Matching PHRASE duplicates for CocoIndex live at L863-L882. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:863-882]
- Matching PHRASE duplicates for deep-review live at L884-L899. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:884-899]
- Cross-skill conflict on `code audit`: INTENT L560 vs PHRASE L807. [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:560] [SOURCE: .opencode/skill/skill-advisor/scripts/skill_advisor.py:807]

## Strategy Updates

### New Findings to Propagate

- `INTENT_BOOSTERS` contains exactly 24 whitespace-containing keys; `MULTI_SKILL_BOOSTERS` contains 0.
- 17 of the 24 whitespace keys already exist in `PHRASE_INTENT_BOOSTERS` with the same target skill and a higher weight, so they are dead INTENT entries that should be removed while preserving the PHRASE weight.
- 6 of the 24 whitespace keys have no exact PHRASE route and should be migrated unchanged: `proposal only`, `5d scoring`, `integration scan`, `dynamic profile`, `vector search`, `concept search`.
- `code audit` is the only halt-worthy anomaly because INTENT routes it to `sk-deep-review` while PHRASE routes it to `sk-code-review`.
- The dead-code root cause is confirmed in the implementation: `INTENT_BOOSTERS` only receives whitespace-split tokens, while `PHRASE_INTENT_BOOSTERS` scans raw substrings.

### Updated Next Focus

Iteration 2: trace the 44 regression fixture cases against these 24 whitespace keys, with special attention to the 6 missing PHRASE routes and the `code audit` target conflict.

## Convergence Signal

- newInfoRatio: 0.90
- stuckIndicator: no — this pass produced the complete inventory, disposition counts, and the first concrete migration blocker.
- inventoryComplete: yes
