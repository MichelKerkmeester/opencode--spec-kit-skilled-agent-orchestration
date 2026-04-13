---
title: "Iteration 002: observations and decisions textual duplication"
description: "Phase 6 deep-research iteration 002 — observations and decisions textual duplication duplication landscape and proposed remediation"
trigger_phrases:
  - "phase 6 iteration 002"
  - "observations and decisions textual duplication"
  - "memory duplication observations decisions textual duplication"
importance_tier: important
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/006-memory-duplication-reduction"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-002.md"]

---

# Iteration 002: observations and decisions textual duplication

## Question
Do recent post-PR6 memory saves still duplicate observation text or decision text in ways that add no new semantics, and did the PR6 D2 fix actually stop `observation decision N` / `user decision N` placeholders in newly written memories?

## Method
- Files sampled: 52 total. I reviewed the 50 most recent live spec-folder memories under `.opencode/specs/**/memory/*.md` (excluding `z_archive/`, quarantines, hidden archive rebuild folders, and vendored `external/` trees) plus the 2 files currently present in `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/`.
- Detection technique: regex scans over `### Decision N:` and `### OBSERVATION:` headings, lexical overlap checks between `Key Outcomes` and `DECISIONS`, manual inspection of flagged files, and owner tracing through `decision-extractor.ts`, `collect-session-data.ts`, `file-extractor.ts`, and `context_template.md`.
- Bounding rule: I counted something as duplication only when the repeated text carried no new information. Boilerplate continuation text such as "No pending tasks" was ignored. I also separated cross-file historical restatement from live same-file duplication.

## Findings
- `F002.1 - Live generic observation placeholder leak`
  Frequency: 2 live memory files, 8 total occurrences.
  Example(s): `### OBSERVATION: Observation` repeats four times in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md:226`, `:231`, `:236`, `:241`; the same pattern repeats in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/memory/06-04-26_17-14__created-level-3-speckit-folder-002-implement.md:228`, `:233`, `:238`, `:243`.
  Cause hypothesis: `buildObservationsWithAnchors()` still falls back to `obs.title || 'Observation'` and the template renders every non-decision observation verbatim, so blank-title observations collapse into identical headings instead of being synthesized or dropped (`.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:337-364`, `.opencode/skill/system-spec-kit/templates/context_template.md:380-389`). The local dedupe only keys on normalized title plus file list, so several blank-title observations with no file list survive as separate entries (`.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:381-421`).
  Severity: HIGH.
- `F002.2 - Decision title, outcome bullet, and rationale often restate the same proposition`
  Frequency: 29 of the 52 sampled files triggered at least one lexical title/outcome restatement hit; I manually verified the pattern in the most recent packet saves.
  Example(s): in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/memory/08-04-26_08-18__extended-the-005-claudest-deep-research-packet.md:196-205`, the `Key Outcomes` bullets are repeated again as decision titles at `:255`, `:282`, `:309`, `:336`, `:363`, `:390`, and then repeated a third time as `**Rationale**` lines at `:271`, `:298`, `:325`, `:352`, `:379`, `:406`. The same structure appears in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/07-04-26_16-18__this-session-closed-out-the-research-only-level-3.md:161-167`, `:196-304`, and `:212-293`. A variant also appears in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/001-foundation-templates-truncation/memory/07-04-26_20-24__closed-out-phase-1-of-the-memory-quality.md:227-236` and `:278-372`.
  Cause hypothesis: `collect-session-data.ts` converts the first 10 observation titles directly into `OUTCOMES`, so any decision-like observation title becomes a `Key Outcomes` bullet (`.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:852-857`). Separately, `decision-extractor.ts` defaults `RATIONALE` to `decisionText` whenever no explicit rationale is present, which makes the decision body repeat the title nearly verbatim (`.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:214-222`, `:285-348`).
  Severity: MEDIUM.
- `F002.3 - Same decision survives across same-folder memories under different wording`
  Frequency: at least 2 clear same-folder cross-memory pairs in the bounded sample.
  Example(s): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_12-05__deep-research-run-8-iterations-via-cli-copilot.md:217-219` says `Treat Reddit post as primary-source field report, NOT implementation spec`, while `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/07-04-26_16-18__this-session-closed-out-the-research-only-level-3.md:196-212` restates the same decision as `Source framing decision (ADR-001): treat the Reddit post as a primary-source field report rather than an implementation spec.` Another pair appears in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/memory/06-04-26_15-37__deep-research-on-graphify-external-repo-python.md:235-251` versus `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/memory/06-04-26_18-17__completed-10-iteration-deep-research-audit-of.md:329-345`.
  Cause hypothesis: successive saves for the same spec folder re-emit the same underlying decision with slightly different surface phrasing, but there is no decision identity or same-folder dedupe across memory generations. This is a retrieval-noise issue, not evidence that PR6 regressed.
  Severity: LOW.
- `F002.4 - PR6 D2 placeholder fix is holding for new saves, but historical placeholder artifacts remain searchable`
  Frequency: 1 placeholder-bearing file in the 52-file sample; 0 post-fix files dated 2026-04-07 or 2026-04-08 showed the pattern.
  Example(s): the old memory `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:232-300` still contains `### Decision 1: observation decision 1` and `### Decision 2: user decision 1`, with the same placeholder text echoed inside the visual trees at `:244` and `:312`. In contrast, the current extractor explicitly suppresses lexical fallback whenever `_manualDecisions` or raw `keyDecisions` exist (`.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:185-191`, `:385-392`), and I found no new `observation decision` / `user decision` titles in the April 7-8 saves.
  Cause hypothesis: this is historical corpus residue from pre-PR6 output, not an active post-PR6 generation leak.
  Severity: LOW.

## Negative Cases
- I did not confirm a strong same-spec, cross-memory verbatim copy-paste of the exact same observation sentence across multiple files. The strongest observation problem was live intra-file duplication and generic placeholder collapse, not repeated full-sentence copy-paste across generations.
- I found no `### Decision N: Chosen Approach` titles in the sampled corpus.
- The two auto-memory files in `~/.claude/.../memory/` did not surface decision-title duplication findings relevant to this dimension.

## Proposed Remediation
- `F002.1`
  Owner file:line: `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:337-364` and `.opencode/skill/system-spec-kit/templates/context_template.md:380-389`
  Patch shape: code change
  Risk: LOW. Mitigation: only suppress or rewrite blank/generic non-decision observation titles; keep explicitly-authored observation titles untouched.
  Verification: replay a fixture with multiple blank-title observations and assert that the rendered memory contains zero `### OBSERVATION: Observation` headings, preserves distinct narratives, and emits a quality warning if meaningful observation density is still too low.
- `F002.2`
  Owner file:line: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:852-857` and `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:214-222`, `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:285-348`
  Patch shape: code change
  Risk: MEDIUM. Mitigation: dedupe only when outcome text and decision title normalize to the same proposition, and only collapse rationale when no explicit `rationale`, `reasoning`, or evidence is present.
  Verification: replay the 005-claudest and 001-claude-optimization-settings payloads and assert that each proposition appears once in `Key Outcomes` or `DECISIONS`, while decision records with real rationale still retain non-empty rationale text.
- `F002.4`
  Owner file:line: corpus migration rather than runtime owner; historical file example at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:232-300`
  Patch shape: one-time migration
  Risk: LOW. Mitigation: do not rewrite content; archive, annotate, or exclude known pre-PR6 placeholder memories from live retrieval instead.
  Verification: bounded corpus grep for `observation decision` and `user decision` returns only archived/quarantined historical artifacts, not live memory directories.

## Confidence
0.87. The evidence is strong for the live placeholder-observation leak and for same-file decision/outcome/rationale restatement because those patterns are plainly visible in recent saved markdown and trace back to concrete owners. Confidence is lower on the cross-memory semantic-duplicate count because that required human judgment rather than exact-string matching.

## Convergence Signal
There is at least one actionable HIGH finding in this dimension: live `### OBSERVATION: Observation` leakage is still shipping in recent saves. A follow-up iteration in this dimension would still help if the team wants a fixture-first owner trace from raw `observations[]` input to rendered markdown, but the current evidence is already sufficient to justify a remediation packet.
