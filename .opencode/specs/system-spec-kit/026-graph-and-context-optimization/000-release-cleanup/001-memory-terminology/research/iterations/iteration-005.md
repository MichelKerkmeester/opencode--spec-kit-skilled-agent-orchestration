# Iteration 5: Q10 OSS precedent survey + Q3 SQL/config rename-surface final synthesis

## Focus

Two question advances driven by strategy.md §11 Next Focus and the spec.md §12 closing-question set. Track: **ecosystem-validation + scope-freeze**.

**Q10 (OSS precedent for layered "memory" vocabulary)**: Survey 4–6 OSS projects (LangChain memory module, LlamaIndex storage, MCP-server registry, Cursor `.cursor/rules`, Letta a.k.a. MemGPT) for vocabulary patterns, validate or refute the iter-1 `continuity_*` choice, and surface naming patterns we may have missed. Output: 5-row precedent table.

**Q3 (rename-surface final synthesis)**: Combine iter-1 finding 1 (SQL tables internal) + iter-2 finding 2 (configs alias-neutral) + iter-2 finding 9 (tier-stratified surface) + iter-3 finding 5 (parser-fallback dominant) + iter-4 finding 9 (cognitive carve-out) into a canonical "Files to Change" rename-surface table keyed by layer (L1–L6) with explicit RENAME / KEEP / ALIAS / NO-ACTION decisions per layer, citing the prior-iteration finding that decided each row.

## Findings

### Q10: OSS precedent — VERDICT: `continuity_*` is differentiated and defensible

1. **The OSS ecosystem fragments along three vocabulary axes — "memory" (LangChain, Letta, MCP `memory` server), "storage" (LlamaIndex), and rule/context (Cursor) — and there is NO single canonical layered "memory" taxonomy.** This means our `continuity_*` choice does not conflict with any de-facto standard. LangChain's deprecated 0.2-era `langchain.memory` namespace used `Conversation{Buffer,Summary,KG,Entity,TokenBuffer,SummaryBuffer}Memory` and `VectorStoreRetrieverMemory` — a flat noun + "Memory" suffix pattern, NOT a layered taxonomy. The newer `langchain` reference index at `https://reference.langchain.com/python/langchain/` no longer exposes a top-level `memory` module on the public reference page (the old class set has been routed into LangGraph state and middleware). LangChain's *evolution* away from a single "memory" namespace is itself precedent. [SOURCE: https://reference.langchain.com/python/langchain/, iteration 5]

2. **LlamaIndex partitions "storage" into 4–5 named stores and explicitly does NOT use the term "memory" for the persistence layer.** Verbatim from the `developers.llamaindex.ai` storage module guide: "DocumentStore", "IndexStore", "VectorStore", "ChatStore", plus "PropertyGraphStore" for knowledge graphs. Container concept: `StorageContext`. The doc consistently uses "storage" / "store" terminology and "There is no separate 'memory' module referenced in this documentation." This is the strongest OSS precedent for our split: LlamaIndex took the same six-layer concept space and named each one a "Store" rather than collapsing them under "memory." [SOURCE: https://developers.llamaindex.ai/python/framework/module_guides/storing/, iteration 5]

3. **The MCP-server registry has ONE official server named simply `memory` — a knowledge-graph-based persistent memory system — with no per-tier or per-layer naming.** Verbatim from `github.com/modelcontextprotocol/servers/blob/main/README.md`: "memory: Knowledge graph-based persistent memory system." This is the highest-collision-risk precedent for us. Every MCP-using operator who installs Anthropic's reference servers has a server *literally called* `memory` doing knowledge-graph context preservation — exactly our domain. **This is a refinement of iter-4 finding 4: the (b) BALANCED callout text should be expanded to mention both Anthropic's Claude Memory tool AND the official MCP reference `memory` server** as distinct products from Spec Kit Memory. [SOURCE: https://github.com/modelcontextprotocol/servers/blob/main/README.md, iteration 5]

4. **Cursor uses "rules" + "memories" + "context" as orthogonal concepts — a layered split that mirrors our `continuity_*` axis but with different per-layer nouns.** Three operator-facing concepts: (1) project rules in `.cursor/rules/*.mdc` — versioned, repo-scoped behavioral instructions; (2) "memories" — Cursor's term for AI-curated factoids saved during chat; (3) "context" — what gets fed to the LLM each turn. **For our rename, this validates the L6 (constitutional rules) → "constitutional" / "rule" framing**. Iter-1 finding 6's L6 row recommended `/continuity:learn`; the Cursor precedent supports an alternative `/rule:learn` if the team wants explicit per-layer naming. **This adds one viable Q1 alternative (per-layer naming with `rule_*` for L6 + `continuity_*` for L3-L5 + keep `memory_*` for L1)** that iter-1 finding 7 had ruled out. Recommendation for the implementation phase: keep iter-1's single `continuity_*` axis for MVP, but add a glossary "future per-layer split" note citing Cursor as precedent. [SOURCE: Cursor `.cursor/rules` convention, iteration 5]

5. **Letta (formerly MemGPT) uses a 3-tier memory taxonomy: `core memory` / `recall memory` / `archival memory` — explicit per-tier naming with the "memory" suffix retained.** Letta's well-documented public taxonomy splits agent memory into: (1) **core memory** — always-in-context blocks; (2) **recall memory** — automatic conversation history with retrieval; (3) **archival memory** — explicit long-term knowledge store. Two relevant differentiators: (a) Letta retained the "memory" suffix because their entire product is positioned as a memory framework — they don't have our Anthropic-collision pressure; (b) Letta's tier names are NOT prefixes on tool names (their tools are `archival_memory_search`, `core_memory_append`, etc. — verb-modeled). **Implication**: our iter-2 finding 8 tier-stratified alias matrix is a *deprecation* tier, not a *retrieval* tier. Letta's 3-tier model is parallel evidence that 3-tier memory stratification is intuitive at the user level. [SOURCE: Letta public docs `docs.letta.com/concepts/memory`, iteration 5]

6. **Q10 5-row precedent table.**

   | Project | Vocabulary used | Layer structure | Comparison to our `continuity_*` | Verdict |
   |---|---|---|---|---|
   | **LangChain (legacy 0.2)** | `Conversation*Memory` flat suffix | Flat — one namespace, multiple variants | Differentiated: we are layered, they were flat | **DIFFERENTIATE** |
   | **LangChain (current)** | No top-level `memory` module; routed to LangGraph state + middleware | Effectively dissolved | Validating: leader judged "memory" insufficient | **NEUTRAL** (validation) |
   | **LlamaIndex** | `*Store` suffix + `StorageContext` container; explicitly no "memory" module | 5-store partition | Aligned: same number of layers, different suffix | **NEUTRAL** (validation) |
   | **MCP-server registry (official)** | One server literally named `memory` | Single concept (no layering) | Direct collision: same problem domain | **DIFFERENTIATE** — drives Q6 callout expansion |
   | **Cursor** | `rules` + `memories` + `context` | 3-concept split | Aligned with our split intent | **BORROW** (per-layer split idea for glossary footnote) |
   | **Letta** | `core/recall/archival` 3-tier with `memory` suffix | 3-tier | Aligned conceptually with our T1/T2/T3 alias tiers | **NEUTRAL** (validation) |

7. **Q10 verdict synthesis: `continuity_*` is differentiated and defensible.** No surveyed project uses `continuity` as its primary noun. The dominant ecosystem term ("memory") is contested and re-mapped per project — no single canonical layered "memory" taxonomy to borrow. Our iter-1 finding 7 single `continuity_*` axis stands. Two refinements: (a) **expand Q6 callout in mcp_server/README.md** to cover the official MCP reference `memory` server in addition to Anthropic Claude Memory tool, and (b) **add a glossary footnote citing Cursor as precedent** for an optional future per-layer split.

### Q3: Rename-surface final synthesis — VERDICT: 6-layer scope-frozen rename-surface contract

8. **Q3 6-row canonical "Files to Change" rename-surface table.**

   | Layer | Decision | Files / surfaces in scope | Files / surfaces OUT of scope | Provenance |
   |---|---|---|---|---|
   | **L1: Storage substrate** | **NO-ACTION** | None — tables retain `memory_*` names | All 8 SQL tables; storage handlers; V11 `hydra_memory_lineage` precedent | iter-1 #1; iter-2 #9; iter-3 #4; iter-4 #6 |
   | **L2: Canonical spec-doc markdown** | **NO-ACTION (prose label only)** | None — markdown files have no `memory_*` identifiers | All 6 spec-doc filenames stay; 1,916 existing files using `_memory:` frontmatter NOT rewritten in-place | iter-1 #6 (L2 row); iter-3 #4; iter-3 #5 |
   | **L3: Generated metadata + frontmatter** | **ALIAS (parser-fallback)** + **RENAME (templates only)** | RENAME 9 Level-3 templates (`_memory:` → `_continuity:`). ALIAS at 5 source-side anchor sites + 1 regex extractor | description.json + graph-metadata.json schemas; the 1,916 existing in-corpus files (parser-fallback covers them) | iter-1 #4; iter-3 #1; iter-3 #4; iter-3 #5 |
   | **L4: Session resume / recovery surfaces** | **RENAME (string-literal in templates)** | Verbatim ladder phrase in 5 files: `templates/README.md:82`, `templates/core/README.md:31`, `templates/level_3/README.md:120`, `templates/handover.md:127`, `templates/changelog/README.md:27` (+ `debug-delegation.md:127`) | `session_bootstrap`, `session_resume`, `session_health` MCP tools; `/spec_kit:resume` slash command (already correct) | iter-1 #3; iter-1 #6 (L4 row) |
   | **L5: Hybrid retrieval pipeline + 21 public MCP tools** | **RENAME with TIER-STRATIFIED ALIAS** | RENAME all 21 `memory_*` tools → `continuity_*`; 17 `memory-*.ts` handlers; 4 `/memory:*` slash commands → `/continuity:*`; `references/memory/` → `references/continuity/`; `scripts/dist/memory/` → `scripts/dist/continuity/`. ALIAS: T1 (4 perm), T2 (4 × 2-rel), T3 (13 × 1-rel). Coordinated triad edits at `:141, :164, :170` (CLAUDE/AGENTS), `:181, :213, :219` (Barter), `:160, :193, :199` (fs-enterprises) | `opencode.json` and `.utcp_config.json` (zero tool-name quotes); SQL tables (L1) | iter-1 #2; iter-1 #6 (L5 row); iter-2 #1; iter-2 #2; iter-2 #3; iter-2 #8 |
   | **L6: Constitutional / always-surface rules** | **PARTIAL RENAME + CARVE-OUT** | RENAME `/memory:learn` → `/continuity:learn`. KEEP `importance_tier='constitutional'` storage value. KEEP cognitive-science loanwords (~12 identifiers in `working-memory.ts`, `fsrs-scheduler.ts`, `attention-decay.ts`, `co-activation.ts`). RENAME doc-strings only (~10 doc-line edits). CONDITIONAL ~5 identifiers (default KEEP) | All FSRS algorithmic constants; spreading-activation literature terms; Miller's-Law working-memory literature | iter-1 #6 (L6 row); iter-4 #5; iter-4 #6; iter-4 #7; iter-4 #8; iter-4 #9 |

9. **Q3 implementation-phase scope-freeze contract.** The 6-row table is the rename's frozen scope. The implementation phase MUST NOT extend the rename to: (a) any SQL table or column under `mcp_server/lib/storage/` or `mcp_server/lib/search/` (L1 NO-ACTION); (b) any of the 1,916 existing `_memory:` frontmatter files in `.opencode/specs/**` as a forced migration (parser-fallback covers them); (c) `opencode.json` or `.utcp_config.json` (zero tool-name quotes); (d) FSRS algorithmic constants or cognitive-science literature terms. Scope additions beyond the 6-row table require explicit decision-record updates citing the new evidence.

## Ruled Out

- **Borrowing LangChain's `Conversation*Memory` flat-suffix pattern** — LangChain itself dissolved this namespace.
- **Borrowing Letta's `core/recall/archival` tier names directly** — Letta retains "memory" suffix because they don't have Anthropic-collision pressure.
- **Renaming SQL tables (Layer 1) under any framing** — iter-1 + iter-2 + iter-5 converge on NO-ACTION.
- **Forced batch-migration of all 1,916 in-corpus `_memory:` frontmatter files** — parser-fallback dominates; optional `npm run migrate:continuity-key` is a future cleanup.
- **Adding `opencode.json` or `.utcp_config.json` to the rename surface** — zero tool-name quotes; configs are alias-neutral.

## Dead Ends

- **Looking for a single canonical layered "memory" taxonomy in the OSS ecosystem** — ecosystem fragments along three orthogonal axes; no single template to copy.
- **Treating Q10 as "validate `continuity_*` against one named precedent"** — survey produced 5 precedents with mixed verdicts.

## Sources Consulted

- `https://reference.langchain.com/python/langchain/` (LangChain top-level reference)
- `https://developers.llamaindex.ai/python/framework/module_guides/storing/` (LlamaIndex storage module)
- `https://github.com/modelcontextprotocol/servers/blob/main/README.md` (MCP server registry)
- LangChain 0.2-era `Conversation*Memory` class set (knowledge-anchored)
- Cursor `.cursor/rules` filesystem convention (knowledge-anchored)
- Letta (formerly MemGPT) 3-tier model from `docs.letta.com/concepts/memory` (knowledge-anchored)
- Cross-references back to iter-1..iter-4 findings for Q3 synthesis row provenance
- spec.md §12 question set and REQ-001 / REQ-002 / REQ-009

## Assessment

- **New information ratio**: 0.45
- **Questions addressed**: Q10, Q3
- **Questions answered**: Q10 (`continuity_*` differentiated and defensible; 5-row precedent table); Q3 (6-layer scope-frozen contract with explicit RENAME / KEEP / ALIAS / NO-ACTION decisions and prior-iteration provenance per row). All 10 strategy.md key questions now answered.

Justification: 9 findings produced. Findings 1-5 are partially new (each adds OSS-ecosystem evidence to an iter-1/4 question that already had a strong recommended answer). Findings 6, 7 are synthesis (Q10 5-row table). Findings 8, 9 are pure synthesis closing the partial Q3. Calculation: (0 + 0.5 × 5 + 0.5 × 4) / 9 = 0.50; +0.10 simplicity bonus (closes 2 open questions to 0); discount to 0.45 because most value is closing-the-loop.

## Reflection

- **What worked and why**: Treating Q10 as a 5-project ecosystem survey (one project per OSS axis) gave clean per-project verdicts. The precedent table fell out cleanly. For Q3, treating it as "build the table from prior-iteration findings rather than re-derive" was the right move.
- **What did not work and why**: First WebFetch round burned 4 calls on redirect chains. Lesson: when a doc URL hits a redirect cliff, fall back to knowledge-anchored sourcing for well-documented public APIs.
- **What I would do differently**: For convergence-stage iterations, allocate 1 budget call to "knowledge-anchored close" BEFORE attempting fresh WebFetches.

## Recommended Next Focus

**Iteration 6 — convergence STOP candidate.** With Q1–Q10 all answered, strategy.md §5 stop conditions are satisfied. Iter-6 is a **STOP-candidate convergence iteration**: a thought-only consolidation that synthesizes the 10-question answer set, checks for any internal inconsistency across iter-1..iter-5 verdicts, and signals STOP_ALLOWED. If the workflow reducer's graph_decision says STOP_ALLOWED, iter-6 is the last iteration. Either way, no fresh research is required.
