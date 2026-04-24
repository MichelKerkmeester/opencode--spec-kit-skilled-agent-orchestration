# Iteration 06 — AGENTS triad sync + distributed governance rule

**Executor:** cli-copilot (gpt-5.4, reasoning: high) + direct Read/Grep
**Scope:** AGENTS.md §5 governance rule, AGENTS_example_fs_enterprises.md Level-3 row + cross-cutting note, AGENTS_Barter.md (no-change decision), CLAUDE.md cross-cutting note.
**Out of scope:** packet docs, templates/, commands/, YAML, skill references (covered by iterations 01–05).

## Answers

**Q1 — Grammar of AGENTS.md:330.** Sentence is grammatically valid, no run-ons or double negatives. However it is semantically overloaded: one bullet now carries general rule + deep-research exemption + `@deep-research` / `@debug` ownership + the new `resource-map.md` optionality clause. Readable but dense.

**Q2 — Flow of the tacked-on clause.** The "`resource-map.md` is optional at any level — copy it from `.opencode/skill/system-spec-kit/templates/resource-map.md` …" clause switches register from enforcement to usage guidance, which reads as bolted on. The information duplicates what the cross-cutting note at AGENTS.md:268 already states. See F-01.

**Q3 — Exemptions preserved.** Yes. `research/iterations/*.md`, `research/deep-research-*.md`, and `research/research.md` (progressive loop updates) remain in the workflow-owned exemption list, and `@deep-research` + `@debug` exclusive-write clauses are intact.

**Q4 — AGENTS.md vs fs_enterprises Documentation Levels.** DRIFT. AGENTS.md:265 Level-3 row says `(+ optional research.md)` only; fs_enterprises:294 says `(+ optional research.md, resource-map.md)`. Since `resource-map.md` is framed as cross-cutting (any level), neither row needs the enumeration — but they should match. See F-02.

**Q5 — AGENTS_Barter.md no-change decision.** Defensible. Its generic phrasing `spec folder docs (*.md)` is a glob that implicitly covers `resource-map.md`. Barter is a symlink into a separate repo (AUDIT-C: minimize cross-repo drift). The trade-off — reader loses the explicit authored-doc list and the `resource-map.md` cue — is acceptable for a shared anchor that must stay light. Decision stands.

**Q6 — CLAUDE.md vs AGENTS.md vs fs_enterprises cross-cutting note.** Same 4-file set in all three (`handover.md`, `debug-delegation.md`, `research.md`, `resource-map.md`); only punctuation/formatting differs (em-dash vs hyphen vs note block). No semantic drift.

**Q7 — `resource-map.md` ownership.** Currently implicit: "any agent following the authored-doc rule." Unlike `research/research.md` (@deep-research) and `debug-delegation.md` (@debug), no workflow claims exclusive write. Recommend ONE-SENTENCE clarification rather than a new owner clause — see F-03.

## Findings

- **F-01 [P2] Governance bullet overloaded with usage guidance.** AGENTS.md:330 mixes enforcement + exemption + ownership + resource-map optionality. The optionality clause duplicates AGENTS.md:268. Fix: move the "copy it from templates/resource-map.md" pointer out of §5 and rely on the §3 cross-cutting note alone.
- **F-02 [P1] Documentation Levels drift between AGENTS.md and fs_enterprises sibling.** AGENTS.md:265 `(+ optional research.md)` vs fs_enterprises:294 `(+ optional research.md, resource-map.md)`. Since `resource-map.md` is any-level cross-cutting, drop the enumeration in both rows and let the §3 cross-cutting note be authoritative. Alternative: sync AGENTS.md to match fs_enterprises.
- **F-03 [P2] No explicit writer for resource-map.md.** Unlike research.md and debug-delegation.md, no agent owns resource-map.md writes. Add a short clarifier to §5 governance rule: "`resource-map.md` has no exclusive writer — any agent following this rule may author it."
- **F-04 [INFO] AGENTS_Barter.md intentional lag.** The generic `spec folder docs (*.md)` phrasing implicitly covers `resource-map.md`. No change needed per AUDIT-C. Recorded for traceability.

## Convergence Signal

Low-severity only (1×P1 presentation drift, 2×P2 clarity, 1×INFO). No P0 blockers.
