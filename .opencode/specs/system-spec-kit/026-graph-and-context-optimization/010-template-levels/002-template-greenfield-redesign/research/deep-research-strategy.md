---
title: Deep Research Strategy — Template Backend Greenfield Redesign
description: Runtime strategy for the 011 deep-research session. Greenfield, no backward-compat constraint.
session_id: 2026-05-01-11-00-template-greenfield
spec_folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign
---

# Deep Research Strategy — Template Backend Greenfield Redesign

## 1. OVERVIEW

### Purpose
Greenfield design of the spec-kit template backend. Sibling packet 010 ran a 10-iter loop and recommended PARTIAL with backward-compat preservation; the user explicitly rejected that framing. This loop is unconstrained by the 868 existing spec folders (immutable git history, descriptive provenance markers).

Goal: simplest possible backend, eliminate the Level 1/2/3/3+ taxonomy, classify addon docs by ownership lifecycle, drive both scaffolder + validator from one manifest, identify MINIMUM parser contract.

### Usage
- Init: populated at session start with topic, key questions, non-goals, stop conditions, candidate designs, and the merged scope from claude+copilot independent analyses.
- Per iteration: each iter reads §11 NEXT FOCUS, performs investigation, writes to `iterations/iteration-NNN.md`, reducer refreshes machine-owned sections.

---

## 2. TOPIC

Greenfield template-system redesign. Eliminate Level 1/2/3/3+. Replace with capability flags. Classify each addon doc (handover, debug-delegation, research, resource-map, context-index) as `author-scaffolded` / `command-owned-lazy` / `workflow-owned-packet`. Design a single manifest driving both scaffolder AND validator. Identify the MINIMUM anchor + frontmatter contract memory parsers actually require (probe-based, not assumed). Score 5 candidate designs and pick one with refactor plan.

---

## 3. KEY QUESTIONS (remaining)
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[None yet]

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT investigate backward-compat with 868 existing folders. They are immutable git history; their `<!-- SPECKIT_TEMPLATE_SOURCE: ... -->` markers are descriptive comments, not resolver keys.
- Do NOT propose a 4-phase gated plan with byte-equivalence repair (that was 010's PARTIAL recommendation, which is REJECTED).
- Do NOT touch `templates/{changelog, examples, stress_test, scratch}/` and `.hashes/` — out of scope.
- Do NOT actually implement the redesign — this packet ends with chosen design + concrete plan; implementation is a follow-on packet.

---

## 5. STOP CONDITIONS

- Convergence: newInfoRatio < 0.10 (looser than 010's 0.05 — design questions converge more abruptly than archaeology)
- Stuck: 3 consecutive iters with no new findings or no question progress
- Max iters: 14 (extended from 9 per user request 2026-05-01 — iters 10-14 add WORKFLOW-INVARIANT pass: re-evaluate design under constraint that AI behavior + user conversation flow remains byte-identical to today)
- Stop criteria: 8/10 questions answered AND chosen design picked from {F, C+F hybrid, B, D, G} with rejection rationale for the other 4
- Final synthesis populated in `research/research.md` with: chosen design, manifest schema example, addon lifecycle classifications, minimum parser contract, refactor plan

---

## 6. ANSWERED QUESTIONS
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

## 8. WHAT FAILED
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

## 9. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

## 10. RULED OUT DIRECTIONS
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

## 11. NEXT FOCUS
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Start the follow-on implementation packet. Phase 1 should add the manifest loader, manifest JSON, and inline-gate renderer behind tests before touching `create.sh` or validator rules.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Inputs to this loop

- **Sibling packet 010 synthesis**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md` — full prior analysis with PARTIAL recommendation (REJECTED for framing reasons; many factual findings still useful)
- **Independent gpt-5.5 analysis (cli-copilot)**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/cross-validation/copilot-response.md` — proposed 7 candidate designs, called out 3 critical risks, identified the addon-ownership-lifecycle question
- **Sequential-thinking analysis (claude-opus-4-7)**: documented in conversation; converged on Trait-gated section composition with kind presets, then revised after copilot input to favor minimal-scaffold + lazy command-owned addons

### Carry-over facts from 010

- Templates folder today: 86 files / 13,115 markdown LOC
- Per-level rendered dirs: exactly 25 markdown files / 4,087 LOC
- Existing spec folders with `SPECKIT_TEMPLATE_SOURCE` markers: 868 directories
- `compose.sh` full recompose latency: 433 ms
- Generator deterministic against itself: YES; byte-equivalent to checked-in goldens: NO
- Phase-parent detection: `isPhaseParent()` reads spec folder contents (TS in `mcp_server/lib/spec/is-phase-parent.ts`, shell in `scripts/lib/shell-common.sh::is_phase_parent`)

### Candidate designs to score

- **Design F (copilot)**: Minimal scaffold + command-owned addons. Most radical, smallest source surface.
- **Design C+F hybrid (claude+copilot synthesis)**: Capability flags drive scaffold for human-authored docs; command/agent-owned addons stay lazy.
- **Design B**: Single manifest + full-document templates per doc-type. Simplest mental model.
- **Design D**: Section-fragment library with renderer. Maximum reuse.
- **Design G**: Schema-first (data → markdown). Most powerful, likely over-engineered.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 14
- Convergence threshold: 0.10
- Stuck threshold: 3
- Per-iteration budget: 12 tool calls, 15 minutes
- Per-iteration timeout: 900s
- Max session duration: 180 min
- Progressive synthesis: true
- Executor: cli-codex / gpt-5.5 / reasoning=high / service-tier=fast / sandbox=workspace-write
- Lifecycle: new
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- research.md ownership: workflow-owned canonical synthesis output
- Session ID: 2026-05-01-11-00-template-greenfield
- Generation: 1
- Started: 2026-05-01T11:00:00Z
