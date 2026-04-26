# Iteration 8: Glossary content draft preview — §0 PREAMBLE + §6 cognitive carve-out (status: insight)

## Focus

Draft actual prose for the two highest-content glossary sections so PR3 author can copy-paste. Track: **glossary-content-prep**.

## Findings

### Finding 1 — §0 PREAMBLE prose draft (~210 words, ready-to-paste)

```markdown
# Spec Kit Memory — Vocabulary Glossary

> **Scope note** — This glossary defines the canonical vocabulary for the **Spec Kit Memory** system: the local MCP server that persists spec-folder context, decisions, and continuity across AI conversations and providers. It is the contract that PRs targeting `mcp_server/`, `references/`, `templates/`, and the synced top-doc triad (`CLAUDE.md` / `AGENTS.md` / `AGENTS_Barter.md` / `AGENTS_example_fs_enterprises.md`) must satisfy.
>
> **Disambiguation — what this is NOT.** Spec Kit Memory is **unrelated to Anthropic's Claude Memory tool**. Anthropic's tool is exposed via the `memory_20250818` API type and a six-command interface (`view`, `create`, `str_replace`, `insert`, `delete`, `rename`) backed by a `/memories` filesystem container, scoped to a single Claude conversation. Spec Kit Memory is an independent local-first MCP server that stores spec-folder records in a SQLite database, persists across sessions and across providers (Claude, GPT, Gemini, OpenCode), and exposes a separate API surface (`continuity_search`, `continuity_save`, `continuity_context`, etc.). The two products solve different problems and can coexist.
>
> Spec Kit Memory is also distinct from the **official MCP reference `memory` server** published at `github.com/modelcontextprotocol/servers/tree/main/src/memory`, which is a knowledge-graph reference implementation for the MCP protocol itself. That server shares a name token with this project but no code, no schema, and no recovery model.
>
> **Where this glossary uses the bare token "memory"** — most often as a legacy alias retained for backward compatibility (see §1 L1 Storage and §5 L5 Retrieval Pipeline) — it refers exclusively to entities inside the Spec Kit Memory system, never to Anthropic's product nor to the MCP reference server. New code, new templates, and new operator-facing documentation should prefer `continuity` and the per-layer terms defined in §1–§6 below.
```

**Iter-grounding**:
- Paragraph 2 (Anthropic): expanded from iter-4 #4(c) candidate; identical mechanic phrasing per iter-1 #5
- Paragraph 3 (MCP reference server): added per iter-5 #3 finding
- Paragraph 4 (legacy-alias rule): per iter-1 layer mapping (L1 stays) + iter-5 #8 (L5 tier-stratified aliases)
- Tone: DEFENSIVE per iter-4 #4 placement matrix row "glossary §0 PREAMBLE"

### Finding 2 — §6 L6 Constitutional / Cognitive Carve-Out prose draft (~270 words, ready-to-paste)

```markdown
## §6 — L6 Constitutional / Cognitive Carve-Out

The `mcp_server/lib/cognitive/` subsystem implements the cognitive-science layer of Spec Kit Memory: FSRS v4 spaced-repetition scheduling, Miller's working-memory model, attention decay, spreading activation, prediction-error gating, and tier classification. The subsystem self-identifies as "the brain of the memory system" in `cognitive/README.md`. Because the academic literature for this domain uses the token **memory** as a precise technical term — Miller (1956), Baddeley & Hitch (1974), Collins & Loftus (1975), FSRS v4 — this glossary **carves out** the subsystem from the L1–L5 vocabulary contract.

### KEEP — cognitive-science loanwords (do NOT rename)

The following identifiers, types, comments, and constants retain the `memory` token because renaming would obscure literature provenance. They are exempt from the L5 retrieval-pipeline tier-stratified rename rule and from the L3 `_continuity` frontmatter-key migration.

- **Miller's-Law working-memory subsystem** (`mcp_server/lib/cognitive/working-memory.ts`):
  - `working_memory` (SQL table) — direct cognitive-science term
  - `WorkingMemoryConfigType`, `WORKING_MEMORY_CONFIG`, `WorkingMemoryEntry` — TS types and constants
  - `getWorkingMemory(...)` — public API named after the subsystem
- **FSRS v4 algorithmic constants** (`mcp_server/lib/cognitive/fsrs-scheduler.ts`):
  - All `FSRS_*` constants (`FSRS_FACTOR`, `FSRS_DECAY`, `FSRS_HALF_LIFE_FACTOR`, `FSRS_CONSTANTS`, …)
  - All "long-term memory" / "working memory" doc comments at lines 9, 13–15, 187, 244–245
- **Spreading-activation literature terms** (`mcp_server/lib/cognitive/co-activation.ts`):
  - All Collins & Loftus 1975 terminology — "spreading activation", "co-activation", "associative network", "activation level" — across the file

### CONDITIONAL — 5 identifiers, default KEEP (lock to L1 SQL-table verdict)

The following five identifiers are **not** cognitive-science loanwords; they cross the boundary into L1 storage. Per the iter-3 / iter-5 / iter-6 verdict, L1 SQL tables (`memory_index`, `memory_fts`, `memory_lineage`, …) **stay** under their legacy names in this rename packet. Therefore these five identifiers also stay. They are listed by name and file path so a future packet that flips L1 can flip them in the same atomic change:

1. **`memory_id` FK column** — references `memory_index.id`, declared and used at `mcp_server/lib/cognitive/working-memory.ts:49,61,77,285,287,305`
2. **`getSessionMemories(...)` function** — returns L1 rows, declared at `mcp_server/lib/cognitive/working-memory.ts:297`
3. **`memory` parameter** in attention-decay scoring — at `mcp_server/lib/cognitive/attention-decay.ts:116,160-185,233,242`
4. **`memory` parameter** in tier classification — at `mcp_server/lib/cognitive/tier-classifier.ts:108,122,157,291,496`
5. **`memory.related_memories` accessor chain** in spreading activation — at `mcp_server/lib/cognitive/co-activation.ts:211,215`

### Cross-link rule (canary)

If a future packet renames the L1 SQL tables (`memory_index`, `memory_fts`, `memory_lineage`, etc.), **these five identifiers in `mcp_server/lib/cognitive/` MUST flip in the same packet**. They are the implicit edges between L1 and L6; holding them when L1 flips would silently desynchronise the two layers.

The canary that surfaces a forgotten flip is **`scripts/validation/glossary-drift-lint.ts`**: its rule that fails on any `memory_id` reference outside `mcp_server/lib/cognitive/` **and** outside `mcp_server/lib/storage/` is the structural signal. If a future packet flips L1 but forgets the five identifiers above, the lint rule's allow-list boundaries will move and CI will fail in `lib/cognitive/` until the five identifiers flip too.

### Out of scope for this carve-out

- Doc-string clarifications inside `cognitive/` that reference L1 rows ("Memory context_type" → "Continuity row context_type") **are** in scope and ship in PR4
- File renames (`working-memory.ts`, `fsrs-scheduler.ts`, …) — never in scope; the filename is itself the literature anchor
- `pressure-monitor.ts` and `rollout-policy.ts` — zero `memory`-named identifiers, no action required
```

**Iter-grounding**:
- KEEP block: iter-4 #6 (working-memory.ts table), iter-4 #7 (FSRS), iter-4 #8 (Collins & Loftus 1975)
- 5 CONDITIONAL items + line-level paths: iter-4 #6, #8, #9
- Cross-link rule: iter-6 R5 + iter-7 PR3 glossary-drift-lint canary
- Out of scope: iter-4 #9 + iter-7 PR4 cognitive-doc-string scope

## Ruled Out

- **Defensive callout in §0 omitting the MCP reference server** — iter-5 #3 explicitly required mentioning BOTH Anthropic Claude Memory AND MCP reference `memory` server
- **5 conditional identifiers listed only by file (not line)** — PR3 author needs paste-ready precision; iter-4 captured exact line numbers

## Dead Ends

None — pure synthesis polish.

## Sources Consulted

- iter-1 #5 (Anthropic vocabulary)
- iter-4 #4 candidate (c) DEFENSIVE callout
- iter-4 #5–9 (cognitive carve-out tables + per-identifier file paths)
- iter-5 #3 (MCP reference `memory` server)
- iter-5 #8 (Q3 6-row contract)
- iter-6 R5 (cognitive carve-out cross-link rule)
- iter-7 PR3 (glossary-drift-lint canary specification)

## Assessment

- **New information ratio**: 0.15 (synthesis-polish; +0.10 simplicity bonus for canary rule cross-link)
- **Questions answered**: none new (Q5 + Q6 already answered; this iteration produces ready-to-paste prose)

## Reflection

- **What worked**: Treating §0 PREAMBLE as a 4-paragraph defensive structure (scope / Anthropic / MCP-registry / legacy-alias rule) gave a clean prose layout. The §6 cognitive carve-out's structural insight is that the `glossary-drift-lint.ts` canary IS the load-bearing mechanism — when L1 SQL tables flip in a future packet, the lint rule's allow-list move forces the 5 cognitive-side identifiers to flip in the same atomic change.
- **What I'd do differently**: For iter-9 (edge cases), draft mixed-mode warning text + telemetry payload + parser-fallback fixture content + lint regex + triad-parity-check failure modes — concrete payloads PR-author can copy-paste.

## Recommended Next Focus

**Iter-9 — edge case content drafts.** Draft (a) mixed-mode warning text for `npm run validate:continuity-frontmatter-mixed-mode`, (b) `LegacyMemoryNameTelemetry` event payload schema, (c) PR1 dual-fixture parser test content, (d) `glossary-drift-lint.ts` regex patterns, (e) `triad-parity-check.sh` failure modes. All concrete content for PR-author copy-paste.
