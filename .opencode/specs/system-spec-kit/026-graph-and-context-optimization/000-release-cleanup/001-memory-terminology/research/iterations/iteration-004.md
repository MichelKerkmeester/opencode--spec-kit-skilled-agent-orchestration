# Iteration 4: Q6 Anthropic positioning callout + Q7 FSRS / cognitive-science loanwords

## Focus

Two question advances driven by REQ-002 (no operator-facing collision with Anthropic Claude Memory) and the iter-1-finding-5 grounding (Anthropic vocabulary is narrow + asymmetric collision risk: our `memory_*` tokens read like Anthropic's tool, not vice versa). Track: **operator-facing-disambiguation + cognitive-vocabulary-carve-out** — distinct from iter-1/2/3's concept-layer / tier-stratification / migration-and-governance tracks.

**Q6 (Anthropic positioning callout)**: Where (if anywhere) does the rename need a one-paragraph callout disambiguating "Spec Kit Memory" / `_continuity` from Anthropic's Claude Memory tool (`memory_20250818` type, `/memories` container, six-command interface)?

**Q7 (FSRS + cognitive-science loanword carve-outs)**: Which `memory`-named identifiers in `mcp_server/lib/cognitive/` are intentional cognitive-science vocabulary (FSRS literature, Miller's working-memory model, attention/co-activation) that must retain the "memory" token because the literature uses it — vs which are accidental leakage that should rename anyway?

## Findings

### Q6: Anthropic positioning callout — VERDICT: ZERO existing precedent; targeted callout in TWO READMEs + glossary preamble

1. **The project has ZERO existing mentions of "Anthropic" or "Claude Memory" across the synced top-doc triad and the two primary READMEs that operators see when discovering the system.** Direct grep across `.opencode/skill/system-spec-kit/README.md` (84 occurrences of "memory"), `.opencode/skill/system-spec-kit/mcp_server/README.md` (130), `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` (63), `.opencode/skill/system-spec-kit/SKILL.md` (87), `CLAUDE.md` (25; symlink to `AGENTS.md`), `AGENTS.md` (25), `AGENTS_Barter.md` (22; symlink to Barter sibling), and `AGENTS_example_fs_enterprises.md` (24) returns **zero matches** for either `Anthropic` or `Claude Memory`. The system therefore has NO disambiguation precedent — the rename's positioning callout is greenfield, parallel to iter-3 finding 6's glossary verdict. **Implication**: a callout cannot bolt onto existing brand-positioning text; it must be authored from scratch and added to a deliberate set of surfaces. [SOURCE: `grep -nE 'Anthropic|Claude Memory' [8 surfaces]` returns empty, iteration 4]

2. **The two operator-facing READMEs already establish a clear product-positioning tone in their §1 OVERVIEW sections; the callout fits structurally into that frame.** `.opencode/skill/system-spec-kit/README.md:50-56` opens with "AI conversations that modify files leave no paper trail [...] AI assistants have amnesia." `.opencode/skill/system-spec-kit/mcp_server/README.md:43-51` opens with "Your AI assistant has amnesia. Every conversation starts from scratch [...] The server works across sessions, models and tools. Switch from Claude to GPT to Gemini and back." Both READMEs explicitly position against ad-hoc memory loss; both use the word "memory" prominently; both are tone-matched to a brief "and to be clear, this is not Anthropic's Claude Memory tool — that's a different product" sentence. The mcp_server README's existing "Switch from Claude to GPT to Gemini and back" line is the most natural anchor for a one-line disambiguation. [SOURCE: `.opencode/skill/system-spec-kit/README.md:50-56`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:43-51`]

3. **Placement decision matrix**: where the callout should appear vs where it should NOT.

   | Surface | Has it? | Add callout? | Rationale |
   |---|---|---|---|
   | `.opencode/skill/system-spec-kit/README.md` (top skill README) | No | **YES** — §1 OVERVIEW | Operator-facing entry point; first impression; current "memory" usage is high (84 hits) |
   | `.opencode/skill/system-spec-kit/mcp_server/README.md` (MCP-server README) | No | **YES** — §1 OVERVIEW after "Switch from Claude to GPT to Gemini" anchor | Already mentions Claude as a model provider; operators evaluating the MCP tool will most directly compare against Anthropic's tool |
   | `.opencode/skill/system-spec-kit/SKILL.md` (skill instructions for AI agents) | No | **NO** | Internal AI-agent contract; doesn't need brand disambiguation |
   | `INSTALL_GUIDE.md` | No | **NO** | Installation playbook; brand context is out of scope |
   | `CLAUDE.md` / `AGENTS.md` triad | No | **NO** | Universal AI behavior framework; brand positioning is wrong layer |
   | `references/glossary.md` (planned via iter-3 finding 8) | N/A (greenfield) | **YES** — §0 PREAMBLE | Vocabulary contract should explicitly call out terminology it is NOT inheriting from Anthropic |

   **Total surfaces**: 3 (top skill README + mcp_server README + new glossary preamble). NOT 6+ (do not propagate to every README); NOT 1 (the top skill README and the mcp_server README target different reader populations and need separate copy).

4. **Three callout-text candidates, ordered by tone defensiveness**.

   - **(a) BRIEF** (recommended for top skill README §1):
     > Note: Spec Kit Memory is a local MCP server, not Anthropic's Claude Memory tool. Anthropic's tool is a per-conversation memory feature inside `claude.ai`; this system is a separate, local-first context layer that works across Claude, GPT, Gemini and other models.

   - **(b) BALANCED** (recommended for mcp_server README §1):
     > Note: This is *not* Anthropic's Claude Memory tool. Anthropic's `memory_20250818` tool exposes a six-command interface (`view`, `create`, `str_replace`, `insert`, `delete`, `rename`) over a `/memories` filesystem container, scoped to a single Claude conversation. Spec Kit Memory is an independent MCP server that stores spec-folder context and decisions in a local SQLite database, persists across sessions and providers, and exposes a different API surface (`continuity_search`, `continuity_save`, etc.). They solve different problems and can coexist.

   - **(c) DEFENSIVE** (recommended for `references/glossary.md` §0):
     > Scope note: The vocabulary in this glossary is specific to Spec Kit Memory and is unrelated to Anthropic's Claude Memory tool (`memory_20250818`, `/memories` container, six-command interface). Where this glossary uses the term "memory" — most often as a legacy alias retained for backward compatibility (see L1, L5) — it refers exclusively to entities in the Spec Kit Memory system, not to Anthropic's product. New code and documentation should prefer `continuity` and the per-layer terms defined below.

   **Recommendation**: ship (a) in the top skill README, (b) in the mcp_server README, (c) at the top of the new glossary. [INFERENCE: combines findings 1, 2, 3 + iter-1 finding 5 + spec.md REQ-002]

### Q7: FSRS + cognitive-science loanword carve-outs — VERDICT: STRONG carve-out signal; ~12 identifiers stay, ~5 conditional, ~10 doc-line edits

5. **The `mcp_server/lib/cognitive/` subsystem is structurally bounded — 11 source files implementing FSRS v4, Miller's working-memory model, attention decay, co-activation, prediction-error gating, tier classification, and adaptive ranking.** The subsystem self-identifies as "the brain of the memory system" in `cognitive/README.md:38-39`. Its overview cites "FSRS v4 power-law decay validated on 100M+ real human memory data" and explicitly invokes cognitive-science vocabulary throughout: "Memory Lifecycle" architecture diagram, "5-state memory model", "Spreading Activation", "Temporal Contiguity", "Working Memory + spreading activation". This is unambiguously a domain where the literature uses `memory` as a technical term — not a vocabulary leak from the rest of the codebase. The carve-out is structurally legible: anything inside `mcp_server/lib/cognitive/` is presumptively a loanword candidate. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1-80`]

6. **Per-identifier carve-out table for `working-memory.ts` (Miller's-Law-based session attention).** Implements Miller's 7±2 capacity limit (`maxCapacity: 7, // Miller's Law: 7 +/- 2` at line 29).

   | Identifier | Type | Literature term? | Decision | Rationale |
   |---|---|---|---|---|
   | `working_memory` (SQL table) | DB table | YES (Miller 1956 / Baddeley) | **KEEP** | Direct cognitive-science term |
   | `WorkingMemoryConfigType` / `WORKING_MEMORY_CONFIG` / `WorkingMemoryEntry` | TS types/constants | YES | **KEEP** | Subsystem-bound |
   | `getWorkingMemory` (line 279) | Function | YES | **KEEP** | Public API named after subsystem |
   | `enforceMemoryLimit` (line 519) | Function | Partial | **KEEP** | Internal-only; file name disambiguates |
   | `migrateLegacyWorkingMemorySchema` | Function | YES | **KEEP** | Migration utility |
   | `memory_id` (FK column → `memory_index.id`) | DB column | NO (cross-subsystem FK to L1) | **CONDITIONAL** | Lock to L1 verdict; if L1 stays `memory_*`, this stays too |
   | `getSessionMemories` | Function | NO (returns L1 rows) | **CONDITIONAL** | Lock to L1 |

7. **Per-identifier carve-out table for `fsrs-scheduler.ts` (Free Spaced Repetition Scheduler v4).** Two-domain decay model explicitly separates long-term memory (FSRS) from working memory (linear) at lines 5-15.

   | Identifier / phrase | Where | Literature term? | Decision |
   |---|---|---|---|
   | "long-term memory" comments (lines 9, 13, 187, 244-245) | Doc comments | YES | **KEEP** |
   | "working memory" cross-references (lines 14-15) | Doc comments | YES | **KEEP** |
   | `Memory context_type` parameter docs (lines 318, 342, 343, 448) | JSDoc | NO (refers to L1 row) | **RENAME doc** to "Continuity row context_type" |
   | `applyClassificationDecay(...)` | Function | NO | **KEEP** signature; rename JSDoc strings |
   | `createInitialParams` doc "for a new memory" (line 187) | JSDoc | NO | **RENAME** doc to "for a new continuity row" |
   | `FSRS_CONSTANTS`, `FSRS_FACTOR`, `FSRS_DECAY`, etc. | Constants | YES | **KEEP** |

8. **Per-identifier carve-out table for the rest of `cognitive/` (8 files).**
   - `attention-decay.ts`: "Memory decay" / "Long-term memory scoring" / "Session/working memory" — KEEP literature terms; parameter `memory` → `continuityRow` is **CONDITIONAL** on L1 verdict.
   - `co-activation.ts`: spreading-activation literature terms (Collins & Loftus 1975) — **KEEP all**.
   - `tier-classifier.ts`: spec-kit L1 row references — **CONDITIONAL** on L1 SQL-table rename.
   - `prediction-error-gate.ts`: JSDoc references — **RENAME doc strings** to "continuity row"; **KEEP code symbols**.
   - `temporal-contiguity.ts`: log messages referencing L1 rows — **RENAME log strings**; **KEEP code symbols**.
   - `adaptive-ranking.ts`: JSDoc — **RENAME doc strings**.
   - `pressure-monitor.ts`, `rollout-policy.ts`: zero `memory`-named identifiers — **NO ACTION**.

9. **Net carve-out summary**:
   - **KEEP (cognitive-science loanwords)**: ~12 identifiers + ~30 comment-level loanwords across 4 files (`working-memory.ts`, `fsrs-scheduler.ts`, `attention-decay.ts`, `co-activation.ts`).
   - **CONDITIONAL RENAME (lock to L1 SQL-table decision)**: ~5 affected files. Default behavior: KEEP because iter-3 verdict pushes L1 SQL-table rename out of scope.
   - **RENAME (doc-string clarification only)**: ~10 doc-line edits in 4 files.
   - **NO ACTION**: 2 files + all FSRS algorithmic constants. [INFERENCE: combines findings 5, 6, 7, 8 + iter-1 layer mapping + iter-3 verdict]

## Ruled Out

- **Adding the Anthropic-disambiguation callout to every README in the system (1+5+ surfaces)** — finding 3 shows different audiences for whom brand positioning is out of scope. Three targeted surfaces is the right granularity.
- **Renaming all `memory`-named identifiers in `cognitive/`** — finding 5 shows the cognitive subsystem self-identifies as the cognitive-science layer. Renaming `working_memory` → `working_continuity` would obscure literature provenance.
- **Coupling the cognitive-subsystem rename to the L1 SQL-table rename without explicit operator decision** — finding 6 row 9 (`memory_id` FK) and finding 8 multiple parameter-name decisions show ~5 cognitive-subsystem identifiers depend on L1 verdict. Iter-3 already concluded L1 stays `memory_*`.

## Dead Ends

- **Treating Q6 as "is there an existing brand-disambiguation paragraph anywhere?"** — finding 1's grep returned zero matches across 8 surfaces; the binary "precedent exists?" framing was the right first move.
- **Treating Q7 as "rename every `memory` token in `cognitive/`"** — would have produced ~50 rename targets and obscured the literature provenance.
- **Looking for cognitive-science vocabulary outside `cognitive/`** — the subsystem is structurally bounded.

## Sources Consulted

- `grep -nE 'Anthropic|Claude Memory' [8 surfaces]` returns empty
- `grep -cE 'memory' [same 8 surfaces]` → 84/130/63/87/25/25/22/24
- `.opencode/skill/system-spec-kit/README.md:1-120` (§1 OVERVIEW tone)
- `.opencode/skill/system-spec-kit/mcp_server/README.md:1-120` (§1 OVERVIEW + "Switch from Claude to GPT to Gemini" anchor)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:1-768` (Miller's-Law citation line 29)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:1-504` (FSRS v4 + two-domain decay)
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1-80` (subsystem self-ID)
- `grep -nE '\bmemory\b' [8 cognitive files]` (per-file inventory)

## Assessment

- **New information ratio**: 0.65 — Of 9 findings: 6 fully new (precedent absence + placement matrix + 3 callout candidates + per-identifier carve-out tables); 3 partially confirm prior framing.
- **Questions addressed**: Q6, Q7
- **Questions answered**: Q6 (callout VERDICT: 3 surfaces with calibrated tone candidates), Q7 (carve-out VERDICT: ~12 stay; ~5 conditional default-keep; ~10 doc-line edits)

## Reflection

- **What worked and why**: Treating Q6 as a binary "precedent exists?" search first gave instant grounding. Treating Q7 as a structural-boundedness check (cognitive subsystem self-identifies) collapsed what could have been a 100-identifier review into ~12+~5+~10.
- **What did not work and why**: First instinct was to read all 11 cognitive files in full; replaced with batched grep + targeted reads. 8 calls vs estimated 14.
- **What I would do differently**: Iter-5 batches Q10 + Q3 final synthesis since both reduce to web searches + tool-name surveys.

## Recommended Next Focus

**Iteration 5 — Q10 OSS precedent survey + Q3 SQL-table-rename final synthesis.** With Q1/Q2/Q4/Q5/Q6/Q7/Q8/Q9 resolved, only Q10 (OSS precedent for layered "memory" vocabulary) and Q3 final synthesis remain. Iter-5 should batch-search the OSS ecosystem (LangChain memory modules, LlamaIndex storage, MCP-server registry, Cursor `.cursor/rules`) for precedent, then close Q3 with a public-API-only verdict. Expect convergence around iter-5 or iter-6.
