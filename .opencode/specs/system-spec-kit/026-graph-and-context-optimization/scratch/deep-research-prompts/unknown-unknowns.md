---
title: "Deep Research Prompts — Unknown Unknowns"
description: "Exploratory research campaigns for ambiguous problem spaces. Use when you don't yet have a hypothesis — the goal is to find the right questions, not just answers."
importance_tier: "normal"
contextType: "research-prompts"
---

# Unknown-Unknowns Exploration

Use when the problem is still ambiguous and you need the research loop itself
to surface the right questions. Output is less prescriptive than other packs —
it's a question catalog + hypothesis shortlist.

---

## Scenario DR-UU-01 — What's worth knowing about X

**When:** You've been told "look into X" with no specific question.

**Paste this:**

```
/spec_kit:deep-research :auto "Exploratory investigation of __TOPIC__ in this repo. No specific question — the goal is to produce the shortlist of questions worth pursuing. Deliverables: (1) landscape map — what subsystems, docs, commits, memories relate to __TOPIC__, (2) 10-20 candidate questions at the surface, ranked by 'is this a real question anyone would act on', (3) shortlist of 3-5 questions that are both answerable AND load-bearing (i.e., the answer would change a decision), (4) for each shortlisted question: proposed follow-up research packet (which scenario from /spec_kit:deep-research packs fits), (5) explicit 'don't pursue' list for questions that are answerable but unimportant. P0: discovering the topic has a critical unknown-unknown (e.g., a silent failure mode, a missing safety invariant, a compliance gap). P1: question whose answer would significantly shift priorities. P2: curiosity-only questions worth logging but not scheduling." --max-iterations=12 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__TOPIC_SLUG__-landscape/
```

---

## Scenario DR-UU-02 — What we don't yet know about our own system

**When:** After a significant refactor/migration, you suspect there are knowledge gaps worth closing before moving on.

**Paste this:**

```
/spec_kit:deep-research :auto "Inventory the current knowledge gaps about __SUBSYSTEM_OR_TRACK__ in this repo. Methodology: (1) scan the spec folders under __SCOPE_PATH__ for open questions, TODOs, deferred items, blocker.md files, 'follow-up' notes, (2) scan implementation-summary.md files for 'deferred' or 'known limitations', (3) scan recent review/ packets for P1/P2 findings that were noted but not fixed, (4) grep production code for TODO/FIXME/XXX/HACK comments and tie each to its current reality, (5) check if any 'we'll verify this later' claims in spec docs were ever verified. Deliver: a prioritized knowledge-gap list with 'why this matters', 'what would answer it', and 'which deep-research scenario fits'. P0 for gaps whose answer could change a safety/correctness property. P1 for gaps blocking the next planned work. P2 for gaps that can wait. Exclude stylistic/naming gaps." --max-iterations=12 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SCOPE__-knowledge-gaps/
```

---

## Scenario DR-UU-03 — Silent-failure-mode scan

**When:** You suspect there are failures the system silently masks.

**Paste this:**

```
/spec_kit:deep-research :auto "Hunt for silent failure modes in __SCOPE_PATH__. Categories: (a) fail-open paths where fail-closed is safer (the recent Phase 029 HOOK-P1-002 fix pattern), (b) errors swallowed in catch blocks without logging or rethrow, (c) optional values (null / undefined / empty string / NaN) accepted where validation should reject, (d) fallbacks to defaults that mask upstream breakage, (e) timeouts that terminate silently, (f) cache paths that return stale on error instead of surfacing the error. For each: cite file:line, quote the swallow/fallback logic, classify severity by 'what could go wrong in production' (P0 if data loss / security / crashed daemon; P1 if degraded UX without operator signal; P2 if cosmetic). Propose the minimal diagnostic addition (stderr log, telemetry event, runtime status entry) that would surface the failure." --max-iterations=11 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SCOPE__-silent-failure-modes/
```

---

## Scenario DR-UU-04 — Assumption audit

**When:** A subsystem has implicit assumptions about its environment and you want them explicit.

**Paste this:**

```
/spec_kit:deep-research :auto "Audit the implicit assumptions baked into __SUBSYSTEM_PATH__. Categories: (a) platform assumptions — OS / shell / binary versions (macOS, zsh, Node 25, python3.12, etc.), (b) filesystem assumptions — case-sensitivity, path separators, symlink behavior, permissions, (c) process assumptions — single-writer, single-reader, fork-safe, thread-safe, (d) data-shape assumptions — ordering, uniqueness, non-null, size bounds, (e) environment assumptions — which env vars must exist, which MUST be absent, (f) timing assumptions — deadlines, poll intervals, clock monotonicity, (g) network assumptions — online, specific hosts reachable. For each assumption: cite file:line, note whether it's validated at runtime or silently assumed, classify failure behavior if the assumption breaks. P0: an assumption that breaks silently with data loss or security impact. P1: one that would fail noisily but takes down the feature. P2: degradation-only." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SUBSYSTEM__-assumption-audit/
```

---

## Scenario DR-UU-05 — Dead-branch discovery

**When:** You suspect code paths exist that are never taken in production (or only taken in error scenarios that don't actually occur).

**Paste this:**

```
/spec_kit:deep-research :auto "Identify likely-dead branches in __SCOPE_PATH__. Methodology: for every conditional that splits control flow, evaluate whether each branch is reachable in production. Categorize each branch as: (a) LIVE (regularly taken based on call-site evidence), (b) ERROR-PATH (taken only on upstream error — verify the error is reachable), (c) LEGACY (preserved for backward compat — verify current consumers still exist), (d) IMPOSSIBLE (the guard condition can't be true given upstream invariants — the 'else' branch is dead), (e) TEST-ONLY (only taken from test doubles). Cite file:line for the branch AND evidence for reachability. P0 for IMPOSSIBLE branches in security-relevant code (silently never executes intended safeguard). P1 for LEGACY branches with no consumers left. P2 for TEST-ONLY paths in production files. Propose the minimal removal for safe deletions." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SCOPE__-dead-branch-discovery/
```

---

## Scenario DR-UU-06 — Novel-problem framing

**When:** You have a rough problem statement but the right framing isn't obvious yet.

**Paste this:**

```
/spec_kit:deep-research :auto "Help frame this ambiguous problem: __RAW_PROBLEM_STATEMENT__. Methodology: (1) extract the claims / preferences / constraints actually present in the raw statement, (2) list the assumptions the framer is likely making (elicit by stress-testing — 'is that actually true?'), (3) find 3-5 adjacent problems in this repo that share structural features, compare their solutions, (4) propose 3 alternative framings of the problem — same surface, different decomposition — with the shift in solution-space each framing implies, (5) identify the 2-3 key decisions that distinguish the framings (so the framer knows what's load-bearing). No premature solutioning. Output: a framing brief that's ready to feed into /spec_kit:plan or a more targeted deep-research scenario." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__PROBLEM_SLUG__-framing/
```

---

## Scenario DR-UU-07 — Post-mortem / retrospective mining

**When:** After a campaign / phase / incident, you want to extract durable lessons.

**Paste this:**

```
/spec_kit:deep-research :auto "Conduct a retrospective on __CAMPAIGN_OR_INCIDENT__. Sources: __LIST_ARTIFACTS__ (commit SHA range, spec-folder path, blocker.md, /tmp/*.log, etc.). For each: (1) extract decisions made with timestamps, (2) identify counter-factuals — decisions that could have been different and what would that have cost/saved, (3) unexpected surprises — what did not go according to the plan (good + bad), (4) process gaps — where did tooling or docs fail to catch problems, (5) durable lessons — what, if we internalized it, would make the next similar campaign cheaper/safer/better. Distinguish 'one-off' lessons from 'systemic' ones. P0 for systemic gaps that could cause future incidents. P1 for process improvements worth codifying in a skill/agent/playbook. P2 for one-off observations worth logging. End with a concrete list of memory entries / playbook updates / skill changes worth proposing." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-retro-__CAMPAIGN_SLUG__/
```

---

## Results Log

```markdown
## YYYY-MM-DD — <topic>

Scenario: DR-UU-__
Command: `/spec_kit:deep-research :auto "..."`
Spec folder: specs/.../
Executor: cli-codex gpt-5.4 high fast
Iterations: N / max
Verdict: PASS | CONDITIONAL | FAIL (rare for exploratory)
Questions surfaced: N candidates, M shortlisted
Highest-leverage question: [one-liner]
Hypotheses generated: [list]
Follow-up scenarios queued: [DR-TI-NN, DR-AA-NN, etc.]
Link: research/research.md (commit SHA)
```
