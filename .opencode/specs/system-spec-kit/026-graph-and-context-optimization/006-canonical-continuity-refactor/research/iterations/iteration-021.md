---
title: "Iteration 021 — Classifier prototype library for Tier 2 embedding similarity"
iteration: 21
band: A
timestamp: 2026-04-11T11:49:31Z
worker: codex-gpt-5.4
scope: q1_tier2_classifier_prototypes
status: complete
focus: "Populate the Tier 2 prototype library with concrete sample chunks for all 8 routing categories so ambiguous saves can fall back to nearest-neighbor embedding classification."
maps_to_questions: [Q1]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-021.md"]

---

# Iteration 021 — Tier 2 Prototype Library

## Goal

Iteration 002 fixed the classifier architecture but left the Tier 2 prototype corpus open. This pass fills that gap. The aim is not to invent abstract labels; it is to give the embedding layer 40 realistic, high-signal chunks shaped like this repo's actual `implementation-summary.md`, `decision-record.md`, `handover.md`, `research/research.md`, `tasks.md`, and legacy `memory/*.md` artifacts. Per iteration 002, this library supports the 15% of chunks that Tier 1 rules cannot classify confidently. Per phase 017 seed F4 and phase 017 iteration 004, the most important boundary is not "good prose vs bad prose"; it is "canonical narrative vs thin metadata vs drop-worthy boilerplate/noise."

## The 8 categories with prototypes

Below, each prototype is a normalized sample chunk derived from real repo patterns, not a verbatim lift. The label notes the shape the embedding should learn.

### `narrative_progress`

- `NP-01 build-story / command merge`: "Merged the standalone `/spec_kit:phase` surface into `/spec_kit:plan` and `/spec_kit:complete` so phase decomposition now rides the same optional flag pattern as `:with-research`. The shipped change added `:with-phases` handling, wired a `phase_decomposition` block into all four YAML workflow assets, removed the obsolete phase command files, and updated the primary command docs. This is a 'what changed in the system' paragraph, not a rollout note."
- `NP-02 subsystem addition / new generator`: "Packet-local changelog generation now lives beside the implementation-summary workflow. The new generator resolves packet roots versus child phases, reads packet documents such as `spec.md`, `tasks.md`, and `checklist.md`, and derives the final changelog structure from those sources instead of asking operators to hand-assemble markdown. The point of this chunk is the new capability and its moving parts, not the order in which the work was landed."
- `NP-03 focused runtime fix / concrete code delta`: "The search pipeline now keeps folder discovery as a scoring boost instead of promoting the discovered folder into an exact-match filter, and stage 1 no longer treats `sessionId` as a governance scope boundary. Together those changes unblock focused-mode searches that were returning zero candidates. The chunk is about the substantive runtime correction and the precise code-path behavior that changed."
- `NP-04 foundation refactor / contract surface`: "Phase 1 established a canonical review manifest, normalized severity handling, and split shared review doctrine from the single-pass UX rules. The resulting package now has one source of truth for the review-mode contract and a narrower shared core that downstream review agents can reuse. This is narrative progress because it explains the structural work that now exists in the repository."
- `NP-05 packet-level capability expansion`: "The workflow can now create nested changelog output for packet roots and child phases without inventing filenames or scattering release history across phase folders. Root packets write `changelog-<packet>-root.md`; child phases write `changelog-<packet>-<phase>.md` in the parent packet. The emphasis is on the new productized behavior and its output shape, which is classic implementation-summary `what-built` language."

### `narrative_delivery`

- `ND-01 sequencing / how-delivered paragraph`: "The work was delivered in three passes: first analyze packet 024 for existing changelog examples, then add the generator and templates, then align command, skill, and reference surfaces in the same packet. Closure only happened after the first Vitest failure exposed template-path resolution drift and the generator was patched. This is distinct from narrative progress because it explains the delivery sequence and verification gating."
- `ND-02 verification-first rollout`: "Verification stayed intentionally narrow and honest. The scripts workspace build was rerun after the generator fix, a focused Vitest suite covered both packet-root and phase-child output, and only then were the packet docs synchronized so the workflow change was auditable. The distinctive cue here is the delivery mechanics and evidence path, not the feature description itself."
- `ND-03 staged runtime remediation`: "Attempt 1 confirmed that `memory_search(\"semantic search\")` returned results again, but Attempt 2 kept the work in a pending state until the MCP server could be restarted and the new focused-mode fix rechecked in a fresh session. The implementation was compiled before handover, yet the delivery story deliberately stopped at 'awaiting runtime verification after restart.' That phrasing belongs in `how-delivered`, not `what-built`."
- `ND-04 contract alignment in same pass`: "Commands, templates, validators, and reference docs were updated together because a packet-local workflow is only useful if every surface points at the same runtime truth. The team deliberately avoided shipping the generator first and documentation later. That 'same-pass alignment' language is a delivery pattern that repeatedly appears in this repo and should cluster near other rollout-and-coordination prototypes."
- `ND-05 phased rollout / feature-flag shape`: "The recommended implementation path keeps the new writer behind a dual-write feature flag, runs shadow comparison before any default flip, and treats schema migration plus archive weighting as Gate B rather than post-merge cleanup. This chunk is about rollout discipline, gates, and deployment sequencing, which separates it from pure implementation narration even though both discuss the same feature."

### `decision`

- `DE-01 ADR / playbook-first`: "We chose to build the manual testing playbook first and state the missing feature catalog explicitly rather than invent a companion package. The future playbook can ship truthfully today, while any catalog linkage is deferred to a later decision. Alternatives considered were catalog-first and dual-package release, both rejected because they expand scope and delay the operator-facing validation surface. This is unmistakably ADR language."
- `DE-02 ADR / integrated package shape`: "We chose the integrated root-guidance package shape from `sk-doc` and mapped the approved `DR-001` through `DR-019` scenario inventory into the six named category folders. The why is structural: it is the only option that preserves the shipped contract and the approved scenario order at the same time. The chunk includes explicit alternatives, rationale, and rollback language, which are strong decision cues."
- `DE-03 ADR / orchestrator-owned side effects`: "We chose to keep all journal write operations in the orchestrator, never in the proposal agent. If the agent can emit journal entries directly, it is no longer honestly proposal-only, which breaks the safety guarantee of bounded improvement loops. The consequence is that the orchestrator must call emit hooks at every lifecycle boundary. This is a decision because it formalizes a trade-off and a governing rule."
- `DE-04 ADR / namespace reuse`: "We chose to reuse the existing coverage-graph infrastructure by namespacing all writes with `loop_type: \"improvement\"` instead of building a second graph system. Separate infrastructure would isolate data but duplicate persistence, query, and maintenance burden. Namespace reuse keeps the API surface stable while preserving data isolation. The presence of rejected alternatives and a chosen architecture makes this a strong decision prototype."
- `DE-05 ADR / backward-compatible defaults`: "We chose to make all new configuration fields optional with documented defaults so the skill behaves exactly like its pre-phase version when fields are absent. The explicit goal is backward compatibility during rollout. The alternative would have been a mandatory config migration, but that would turn a bounded improvement packet into a breaking-change packet. This reads like a decision record even without the ADR heading."

### `handover_state`

- `HS-01 continuation header + progress`: "CONTINUATION - Attempt 1. Objective: improve sk-deep-research review logic, then implement the accepted roadmap. Progress is roughly 85 percent: research is complete, the foundation phase is complete, and phases 2 through 5 were dispatched as parallel agents. The next session needs to verify the background agent outputs, inspect `git diff`, and finish the remaining template update. This is session-state transfer, not a permanent narrative summary."
- `HS-02 current state + blocker`: "Current state: implementation fixes are compiled, the MCP server was killed to force a clean restart, and runtime verification must happen in a fresh session before the packet can be closed. Active files are the focused-mode handler and the stage-1/stage-2 search pipeline modules. The handoff is about what is live right now, what was last done, and the exact blocker preventing closure."
- `HS-03 pending work checklist`: "Immediate next session work: verify the Phase 2-3 agent output, verify the Phase 4-5 agent output, update the deep-review strategy template, run `git diff`, and then commit. Deferred work remains explicitly separated from immediate work. The distinctive phrasing is operational and time-bound: it assumes a human or agent is resuming where the last session stopped."
- `HS-04 quick-start resume instructions`: "To resume, run `/spec_kit:resume <spec-folder>`, then review the handover's listed files in order: the focused handler fix, the stage-1 scope fix, the stage-2 graph diagnostic warning, and the packet docs that still need verification evidence. This is not task planning for a future packet; it is a restart recipe for the next session."
- `HS-05 risks + effort estimate`: "Current blockers are limited to runtime restart verification, but there is still risk that removing `sessionId` from scope enforcement has an unintended side effect in consumers that expected session-scoped filtering. Estimated remaining effort is about 30 minutes for verification, documentation closure, memory save, and commit. This combination of blocker, risk, and near-term effort estimate is a stable handover signature."

### `research_finding`

- `RF-01 smallest-correct recommendation`: "The repo already has the needed command docs; the actual discoverability problem is that Codex sees `references/workflows/quick_reference.md` first and that surface currently spends its prime space on documentation mechanics instead of a first-touch command shortlist. The smallest correct recommendation is a compact 'Start Here' command block in the quick reference, not a new generated registry. This is a finding because it answers a scoped question with evidence and a recommendation."
- `RF-02 architecture conclusion`: "The compact code graph work should use a clean-room tree-sitter plus SQLite approach rather than a full graph database. The research across tooling and academic sources points to a hybrid retrieval system: embeddings for recall, structural graph signals for precision, and a compact projection layer for model-facing context. This is a research synthesis chunk, not a build story or ADR."
- `RF-03 overlap matrix insight`: "Across the sampled memory corpus, the majority of bytes are high-overlap narrative that maps cleanly to `implementation-summary.md`, `decision-record.md`, `handover.md`, and `tasks.md`. The unique long-term value is concentrated in metadata, preflight baselines, and postflight learning deltas. That finding matters because it narrows the thin continuity layer to a small machine-owned surface instead of preserving the full session wrapper."
- `RF-04 migration finding`: "The bounded-archive strategy is viable because archived memories can be weighted down to 0.3 and surfaced only when fresh spec-doc results are sparse. The critical signal is `archived_hit_rate`: if it drops below 0.5 percent for a sustained window, the archive stops being load-bearing. This reads as a research finding because it connects a mechanism, an observed metric, and a future decision rule."
- `RF-05 prerequisite blocker`: "The biggest migration blocker is not schema complexity; it is the small set of root packets whose memory files are still the only narrative artifact. If those packets are archived before root-level canonical docs are backfilled, the implementation story is lost. This is a finding because it identifies a hidden dependency and reframes the order of operations for the phase."

### `task_update`

- `TU-01 completed implementation slice`: "- [x] T004 Add `:with-phases` flag to the plan command. - [x] T005 Add the phase decomposition section to the plan command. - [x] T008 Wire `phase_decomposition` into the auto plan workflow asset. These lines are not descriptive narrative; they are direct status mutations against scoped task IDs and belong in `tasks.md::phase-2` style anchors."
- `TU-02 verification still open`: "- [x] T015 Update `README.txt` to remove the phase command row. - [x] T016 Update `CLAUDE.md` quick reference wording. - [ ] T017 Verify `/spec_kit:plan` without `:with-phases` works unchanged. Completion criteria remain open until manual verification passes. This is a classic edge case where the task update is mostly complete but still has one blocking checkbox."
- `TU-03 packet-wide completion`: "- [x] T012 Fix template path resolution in the generator after the first test failure. - [x] T013 Run scripts build verification. - [x] T014 Run focused nested changelog Vitest verification. - [x] T015 Update packet 025 documentation to match the shipped workflow. This chunk is tightly tied to progress accounting and evidence capture, not to narrative prose."
- `TU-04 structural parent packet work`: "- [ ] T004 Add the minimal summary of the child phase to the root packet. - [ ] T005 Ensure the parent-child relationship resolves through the child spec. - [ ] T006 Keep parent scope structural only. The wording is sparse on purpose because task updates often name exact to-dos without giving rationale or context paragraphs."
- `TU-05 completion criteria block`: "- [x] All implementation and workflow-alignment tasks marked complete. - [x] No blocked tasks remain in this packet. - [x] Verification captured in `implementation-summary.md` and `checklist.md`. This is task-update language because it mutates packet status directly even though it looks more summary-like than individual T-lines."

### `metadata_only`

- `MO-01 frontmatter-only classification`: "title: \"Implementation Summary: Nested Changelog Per Spec\"; trigger_phrases: [\"implementation summary\", \"nested changelog\", \"phase changelog\", \"025\"]; importance_tier: important; contextType: implementation. There is no session narrative here, only retrieval metadata that improves indexing and ranking. Embeddings should learn that YAML-style key/value density with classification keys means metadata, not an implementation paragraph."
- `MO-02 continuity block`: "_memory.continuity: recent_action = \"phase 2 fixes compiled\"; next_safe_action = \"restart MCP server and rerun focused-mode query\"; blockers = [\"server disconnected after pkill\"]; completion_pct = 95; fingerprint = \"sha256:...\". This is thin continuity state: machine-owned, highly structured, and intentionally compact. It supports resume without carrying a prose handover document."
- `MO-03 causal + decay payload`: "memory_classification.memory_type = semantic; half_life_days = 365; decay_factors.base_decay_rate = 0.9981; access_boost_factor = 0.1; causal_links.supersedes = [\"F-017-004\"]; provenance.session_id = \"018-impl-design\". The chunk is valuable to retrieval, but it is not readable narrative and should never route into an implementation summary or research section."
- `MO-04 preflight baseline`: "preflight.knowledgeScore = 42; preflight.uncertaintyScore = 71; preflight.contextScore = 38; knowledgeGaps = [\"root packet backfill count\", \"dedup key shape\", \"resume fallback latency\"]; taskId = \"implementation\". This is the edge case phase 017 marked as unique-and-valuable: it belongs in continuity metadata even though it captures session state."
- `MO-05 postflight learning delta`: "postflight.knowledgeScore = 88; postflight.uncertaintyScore = 24; postflight.contextScore = 84; gapsClosed = [\"routing overlap confirmed\", \"schema blocker isolated\"]; newGapsDiscovered = [\"prototype confusion tests still needed\"]; learningIndex = 0.74. The structure is score-heavy and field-heavy, which should separate it cleanly from both research findings and human-facing handovers."

### `drop`

- `DR-01 conversation transcript`: "2026-04-11 09:12 user: 'Continue anyway and keep scope on packet 026.' 2026-04-11 09:13 assistant: 'I found two more findings in the remediation packet.' 2026-04-11 09:14 tool: `git diff --name-only`. 2026-04-11 09:15 assistant: 'Applying targeted fix.' This is timestamped dialogue and tool telemetry. Phase 017 iteration 004 already established that transcripts are unique but low-value, so the router should treat this as drop."
- `DR-02 recovery hints boilerplate`: "Recovery scenarios: Context Loss -> run `/spec_kit:resume`; State Mismatch -> check `git status`; Memory Not Found -> call `memory_search`; Stale Context -> compare timestamps; Diagnostic Commands: list memories, verify file integrity, force re-index. This is generic operator boilerplate repeated across many memory files. It is not packet-specific knowledge and should not consume canonical doc space."
- `DR-03 table of contents wrapper`: "TABLE OF CONTENTS: CONTINUE SESSION, PROJECT STATE SNAPSHOT, OVERVIEW, DETAILED CHANGES, DECISIONS, CONVERSATION, RECOVERY HINTS, MEMORY METADATA. The chunk exists only to help a human scan a long legacy memory file. It carries almost no semantic retrieval value by itself and should be learned as drop-worthy framing text."
- `DR-04 auto-truncated legacy summary`: "> [RETROACTIVE: body contains auto-truncated summary text from the memory generator. Ellipsis markers (...) are known truncation points, not typos.] Recent: Deep research v2 improving review logic in sk-deep-research... [RETROACTIVE: auto-truncated]. This is a useful hard negative because it looks summary-like, but the truncation marker and repair-note framing make it poor canonical content."
- `DR-05 raw tool/file telemetry`: "Captured file count: 8. Files modified: `memory-context.ts`, `stage1-candidate-gen.ts`, `stage2-fusion.ts`, `types.ts`. Tool executions: 0. Repository state: clean. Channel: system-speckit/026-graph-and-context-optimization. On its own, this is operational telemetry rather than narrative, decision, or research content. It should either be folded into metadata fields or dropped if no consuming field exists."

## Storage format

Keep iteration 002's prototype-library idea, but make the placement precise: store the JSON at `mcp_server/lib/routing/routing-prototypes.json`, next to the future `content-router` module rather than in a generic top-level config folder.

Recommended JSON shape:

- `version`: integer for future library refreshes
- `embeddingProfile`: symbolic name for "use the same embedding pipeline as ambiguous save chunks"
- `categories`: object keyed by the 8 classifier labels
- each category entry: array of prototype objects
- prototype object fields:
  - `id`: stable key such as `NP-01`
  - `label`: short human name
  - `sourceShape`: one of `implementation-summary`, `decision-record`, `handover`, `research`, `tasks`, `legacy-memory`
  - `tags`: 2-5 discriminative cues such as `["rollout", "verification", "phased"]`
  - `chunk`: the normalized sample text
  - `negativeHints`: optional list of categories this prototype is commonly confused with

The important implementation detail is not the path alone; it is that the library stays human-editable, versioned with the router, and stable enough that embedding refreshes can be regenerated deterministically.

## Validation methodology

1. Build a holdout set of 15-20 real chunks per category from repo docs that are not reused as prototypes.
2. Run nearest-prototype classification and record top-1 accuracy, top-2 accuracy, and top-1 minus top-2 similarity margin.
3. Track the confusion pairs phase 017/018 make most likely: `narrative_progress` vs `narrative_delivery`, `handover_state` vs `task_update`, `metadata_only` vs `drop`, and `research_finding` vs `decision`.
4. Require each category to win at least one hard-negative test against its nearest neighbor; otherwise add or replace prototypes rather than lowering thresholds.
5. Log refusal rate for ambiguous chunks. A healthy Tier 2 library should reduce unnecessary Tier 3 escalations, not eliminate refusals entirely.
6. Re-run the validation after any major template change to `implementation-summary.md`, `handover.md`, `decision-record.md`, or the memory wrapper generator, because those surfaces define the language the prototypes are supposed to mirror.

Success criteria:

- top-1 accuracy above the Tier 1 fallback set for ambiguous chunks
- strong margins on the four confusion pairs above
- `metadata_only` and `drop` separated primarily by structured-key density versus generic boilerplate/transcript text
- Tier 3 escalation stays rare and concentrated on genuinely mixed-content chunks

## Findings

- Iteration 002's three-tier contract holds up: the missing piece really was the corpus, not the classifier shape.
- Phase 017 seed F4 and phase 017 iteration 004 were the right warning signs. The hardest semantic boundary is around legacy memory wrappers, because they interleave valuable continuity metadata with low-value recovery boilerplate and transcripts.
- Repo patterns strongly support keeping `narrative_progress` and `narrative_delivery` separate. Implementation summaries use materially different language in `what-built` versus `how-delivered`; collapsing them would blur feature substance with rollout mechanics.
- The best `decision` prototypes are not just "we chose" sentences. They also include alternatives, consequences, checks, and rollback language, which gives the embedding space more texture than a one-line rationale would.
- `handover_state` is operationally distinct from `task_update` because it bundles progress, blockers, next-session order, and resume instructions into a live continuity packet rather than a status ledger.
- For `metadata_only`, machine-readable key density is the discriminator. For `drop`, repeated boilerplate scaffolding and transcript chronology are the discriminator.

Sources that most informed this library: phase 017 iteration 002 (save-pipeline staging), phase 017 iteration 004 (redundancy matrix), phase 018 iterations 001, 002, 017, 018, 019, and 020, plus current repo examples from `implementation-summary.md`, `decision-record.md`, `handover.md`, `research/research.md`, `tasks.md`, and archived `memory/*.md`.

## What worked / what failed

### What worked

- Mining current repo artifacts gave category boundaries that are sharper than the abstract taxonomy alone.
- Legacy memory files were especially useful for the `metadata_only` and `drop` categories because they contain both the valuable machine block and the noisy wrapper content in one place.
- Using five prototypes per category is enough to cover common shapes plus one or two edge cases without turning the library into a second training corpus.

### What failed

- A generic "summary paragraph" prototype was too weak; summary language appears in implementation summaries, research reports, handovers, and legacy memories. The prototypes had to be grounded in document-specific phrasing.
- Some handover bullets initially looked like task updates. The fix was to keep resume framing, blockers, and next-session ordering inside the handover prototypes.
- Some metadata blocks looked like drop-worthy telemetry. The fix was to preserve only machine fields with clear downstream consumers and push free-floating telemetry into `drop`.

## Next focus (iteration 22)

Validate the Tier 2 library against mixed-content chunks that intentionally combine two categories in one save payload. The open question after this iteration is not "what are the prototypes?" but "when should the router split a chunk, route by dominant category, or refuse and escalate to Tier 3?"
