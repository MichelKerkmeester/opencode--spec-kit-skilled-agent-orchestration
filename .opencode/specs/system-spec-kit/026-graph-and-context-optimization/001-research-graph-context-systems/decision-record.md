---
title: "Decision Record: Graph and Context Systems Master Research Packet"
description: "Root ADRs for the v2 master packet covering measurement honesty, P0 sequencing, trust-axis separation, and conditional warm-start handling."
trigger_phrases:
  - "graph context packet ADR"
  - "measurement contract"
  - "trust-axis separation"
  - "conditional warm-start"
importance_tier: "critical"
contextType: "decision-record"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]

---
# Decision Record: Graph and Context Systems Master Research Packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Publish a provisional honest measurement contract before any multiplier

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-07 |
| **Deciders** | Parent packet assembly, grounded in v2 Q-A and recommendation R1 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The v2 packet found the same failure mode in several places: approximate or partial evidence becomes crisp-looking output once it reaches a dashboard, artifact, or recommendation surface. Phase 001 preserves unresolved arithmetic, CodeSight overstates `ast` confidence for some regex-backed extraction, Contextador turns fixed constants into savings numbers, Graphify backfills confidence defaults, and Claudest can project certainty through normalized reporting even when some fields are estimated. Public therefore needs one visible rule about what can be published now and what still requires stronger authority. [SOURCE: research/research.md:46-60] [SOURCE: research/research.md:252-256] [SOURCE: research/recommendations.md:3-12]

### Constraints

- Public still lacks provider-counted authority for every headline savings claim.
- The packet must not freeze a misleading permanent rule just to sound decisive.
- Downstream dashboard work still needs a usable contract right now. [SOURCE: research/research.md:73-76] [SOURCE: research/archive/v1-v2-diff-iter-18.md:103-113]
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Make the first packet decision a provisional honest measurement contract that labels every published field `exact`, `estimated`, `defaulted`, or `unknown` and blocks headline multipliers until stronger authority exists.

**How it works**: The root packet treats measurement honesty as the first downstream packet to open. Later dashboard, pricing, and startup-claim work may proceed only through that contract, not around it. [SOURCE: research/recommendations.md:3-12] [SOURCE: research/recommendations.md:83-91]
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Provisional honest measurement contract** | Makes uncertainty explicit now, unlocks later reporting work safely | Requires downstream packet and vocabulary changes | 9/10 |
| Wait for perfect observability before writing any contract | Avoids premature wording | Leaves later packets without a decision surface | 6/10 |
| Keep v1-style multiplier language and treat caveats as footnotes | Feels decisive | Repeats the precision-laundering problem the rigor lane exposed | 2/10 |

**Why this one**: It is the narrowest move that fixes the load-bearing problem without pretending observability is already finished. [SOURCE: research/research.md:73-76] [SOURCE: research/archive/v1-v2-diff-iter-18.md:103-105]
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Later packet work inherits a single honesty vocabulary instead of ad hoc caveats.
- Dashboard and analytics work can proceed without outrunning the evidence substrate.

**What it costs**:
- The first follow-on packet must define the vocabulary and publication gates before prettier reporting work lands. Mitigation: keep it as the first P0 packet.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Downstream packet authors treat the contract as optional | H | Make R1 the first follow-on packet and reference it in later packet charters |
| Readers confuse "provisional" with "weak" | M | State clearly that provisional refers to authority, not to the need for honesty |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Q-A and pattern 1 both identify publication honesty as the gate on later claims |
| 2 | **Beyond Local Maxima?** | PASS | Two weaker alternatives were considered and rejected |
| 3 | **Sufficient?** | PASS | A vocabulary and publication gate solve the packet-level problem now |
| 4 | **Fits Goal?** | PASS | This is the first follow-on packet the roadmap now requires |
| 5 | **Open Horizons?** | PASS | Later exact-count upgrades can strengthen the contract without replacing it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Open the R1 follow-on packet first.
- Make dashboard and analytics packet work depend on the measurement contract.

**How to roll back**: Revert the follow-on packet decision and withdraw any publication guidance that depends on multiplier claims.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Front-load P0 seam hardening before conditional adapters or packaging

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-07 |
| **Deciders** | Parent packet assembly, grounded in Q-D and the v2 cost-reality pass |

---

### Context

The roadmap stayed directionally stable from v1 to v2, but the rigor lane changed which items are truly "early" work. Honest reporting, Stop-summary production, payload validation, provenance honesty, and detector regression all directly address the seam problems the rigor lane exposed. By contrast, artifact-default packaging, monolithic scan orchestration, and broad cached-startup claims now look attractive only if the missing trust and freshness contracts are ignored. [SOURCE: research/research.md:148-199] [SOURCE: research/iterations/q-d-adoption-sequencing.md:15-61]

### Constraints

- The first packet wave should reinforce existing owner surfaces, not bypass them.
- Public's moat is strong enough that external ideas must arrive as supplements.
- The roadmap must stay compatible with the hidden-prerequisite lens from iter-13. [SOURCE: research/research.md:277-306]

---

### Decision

**We chose**: Make the first downstream packet cluster measurement honesty, trust prerequisites, payload validation, provenance honesty, detector regression, and nearby substrate-ready hardening work. Keep adapters like graph-first nudges and guarded cached-startup work behind that cluster.

**How it works**: `plan.md` and `tasks.md` now treat the P0 rails as the first implementation wave and push adapters into the next wave only after the contracts exist. [SOURCE: research/research.md:151-160] [SOURCE: research/research.md:162-168]

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **P0 seam hardening first** | Matches the evidence, protects Public's split topology, reduces ambiguity early | Feels slower than feature-forward packaging | 9/10 |
| Lead with cached-startup and graph-hook bundle | High perceived momentum | Depends on contracts and evaluation work not yet landed | 5/10 |
| Lead with structural artifact packaging | Produces visible artifacts fast | Revives the exact trust and freshness problems v2 downgraded | 3/10 |

**Why this one**: It is the only order that fits both the hidden-prerequisite inventory and the revised effort sizing. [SOURCE: research/research.md:168-199] [SOURCE: research/archive/v1-v2-diff-iter-18.md:103-113]

---

### Consequences

**What improves**:
- The first packet wave lands on the highest-confidence seams.
- Later packets can inherit clearer contracts instead of discovering them mid-build.

**What it costs**:
- Some visible feature ideas move down the queue. Mitigation: capture them as explicit follow-on tasks so they remain visible.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stakeholders mistake sequencing discipline for lack of ambition | M | Keep the milestone table and tasks explicit about the later packet waves |
| Downstream packets cherry-pick adapters without their prerequisites | H | Reference this ADR in future packet charters |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Q-D and iter-14 both re-tier the first cluster this way |
| 2 | **Beyond Local Maxima?** | PASS | Adapter-first and packaging-first options were considered |
| 3 | **Sufficient?** | PASS | The root plan and tasks now expose a concrete first wave |
| 4 | **Fits Goal?** | PASS | This is the adoption order the packet exists to formalize |
| 5 | **Open Horizons?** | PASS | Later packets remain possible once the contracts land |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `plan.md` Phase 2 starts with the P0 rail cluster.
- `tasks.md` opens measurement, trust, payload, and detector follow-ons before adapter packets.

**How to roll back**: Reorder the downstream packet list only if new evidence disproves the current hidden-prerequisite model.

---

### ADR-003: Replace old R10 and former Combo 3 with trust-axis separation before structural packaging

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-07 |
| **Deciders** | Parent packet assembly, grounded in iter-12 and iter-16 |

---

### Context

The old structural-artifact story depended on one notion of trust doing too much work at once. Iter-12 showed the opposite: CodeSight provenance, Graphify evidence tiers, and artifact-default packaging do not reinforce each other safely today. One upstream path already overclaims `ast`, Graphify uses numeric confidence defaults, and packaging magnifies any mislabel as if it were settled truth. V2 therefore replaced old R10 with a prerequisite contract for provenance, evidence status, and freshness authority. [SOURCE: research/research.md:229-236] [SOURCE: research/research.md:235-236] [SOURCE: research/recommendations.md:43-51] [SOURCE: research/recommendations.md:93-101]

### Constraints

- Structural packaging remains attractive and will keep resurfacing in later packet work.
- Public already has enough substrate to package outputs, which increases the risk of packaging them too early.
- The packet must keep the replacement explicit so later readers do not quietly revive the old assumption.

---

### Decision

**We chose**: Treat trust-axis separation, payload validation, and stable interchange as prerequisites. Do not package structural artifacts as default reusable context until those fields are separate and the contract has been evaluated.

**How it works**: The root packet ties structural packaging to the R10 replacement instead of to the old Combo 3 story. Downstream packet work must name provenance, evidence status, and freshness authority separately. [SOURCE: research/research.md:229-236] [SOURCE: research/recommendations.md:43-51] [SOURCE: research/recommendations.md:93-101]

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Trust-axis separation first** | Fixes the real ambiguity, keeps later packaging honest | Delays visible artifact work | 9/10 |
| Keep old R10 packaging with caveats | Produces portable artifacts sooner | Repeats the falsified Combo 3 premise | 2/10 |
| Collapse provenance, evidence, and freshness into one scalar confidence | Easy to explain | The rigor lane showed this is exactly the wrong abstraction | 1/10 |

**Why this one**: It is the only option consistent with the combo falsification and the v2 replacement recommendation. [SOURCE: research/archive/v1-v2-diff-iter-18.md:87-113]

---

### Consequences

**What improves**:
- Later structural artifacts can become inspectable rather than just polished.
- Public avoids amplifying ambiguous trust labels into first-class reusable context.

**What it costs**:
- Structural packaging work becomes a later packet rather than an immediate one. Mitigation: keep the downstream task visible but explicitly blocked on the contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Later packet authors try to shortcut the contract | H | Keep this ADR and the replacement R10 language in every follow-on charter |
| Trust-axis work expands too broadly | M | Bound the first packet to shared payload fields and stable interchange only |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Combo 3 was falsified, not just downgraded |
| 2 | **Beyond Local Maxima?** | PASS | Old R10 and scalar confidence were both considered and rejected |
| 3 | **Sufficient?** | PASS | A prerequisite contract solves the packet-level ambiguity |
| 4 | **Fits Goal?** | PASS | The packet must stop later work from reviving the wrong premise |
| 5 | **Open Horizons?** | PASS | Honest structural packaging remains possible once the contract exists |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `plan.md` and `tasks.md` now place structural packaging behind trust-axis packet work.
- `spec.md` and `implementation-summary.md` record the replacement explicitly.

**How to roll back**: Revisit only if new evidence disproves the iter-12 falsification and the iter-16 replacement rationale.

---

### ADR-004: Keep the warm-start bundle conditional and preserve Public's split-topology moat

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-07 |
| **Deciders** | Parent packet assembly, grounded in iter-12, iter-13, and iter-16 |

---

### Context

The warm-start bundle survived, but only as a conditional bundle. Cached summaries can be lossy, the wrong prior session can be selected, and a graph-first hook only catches one class of first-move error. At the same time, iter-13 showed that Public's real strength is its split topology plus its recovery, routing, and governance moats. The packet therefore needs a decision that both preserves the useful bundle and prevents readers from turning it into a default-safe architecture story. [SOURCE: research/research.md:217-228] [SOURCE: research/research.md:277-306]

### Constraints

- The bundle still has value and should not be erased.
- Public's split semantic, structural, and continuity owners are part of the moat, not a problem to solve away.
- Promotion must be blocked on a real evaluation corpus, not on intuition.

---

### Decision

**We chose**: Keep the warm-start work as a conditional, later packet and make the split-topology moat explicit in the root packet. The bundle may advance only after fidelity, freshness, and task-outcome checks exist.

**How it works**: The packet records the bundle as downstream work, not as the default early multiplier, and ties it to an evaluation corpus task before promotion. [SOURCE: research/recommendations.md:23-31] [SOURCE: research/recommendations.md:73-81]

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Conditional bundle plus moat preservation** | Keeps the useful idea while protecting Public's architecture | Requires patience and evaluation work | 9/10 |
| Promote cached startup and graph nudges as the default early win | Feels fast and visible | Ignores freshness and fidelity risk, weakens the moat framing | 4/10 |
| Replace split topology with a single scan or bootstrap facade | Simplifies the narrative | Directly contradicts the moat inventory and composition-risk findings | 1/10 |

**Why this one**: It preserves the only surviving value of Combo 1 without pretending the prerequisites are already solved. [SOURCE: research/research.md:95-96] [SOURCE: research/archive/v1-v2-diff-iter-18.md:74-83]

---

### Consequences

**What improves**:
- Public keeps the architectural self-awareness that iter-13 identified as a moat.
- Later warm-start work gets a clear promotion bar instead of implicit momentum.

**What it costs**:
- The bundle waits behind P0 and some P1 work. Mitigation: keep it visible in `tasks.md` and `spec.md` open questions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Readers interpret the downgrade as rejection | M | State that the bundle survived conditionally, not that it failed |
| A future packet bypasses fidelity and freshness checks | H | Keep corpus definition as an explicit prerequisite task |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Combo 1 survived only in narrower form |
| 2 | **Beyond Local Maxima?** | PASS | Default-safe promotion and facade replacement were both rejected |
| 3 | **Sufficient?** | PASS | A conditional packet decision and a corpus prerequisite solve the packet-level problem |
| 4 | **Fits Goal?** | PASS | The packet exists to preserve the right adoption posture |
| 5 | **Open Horizons?** | PASS | The bundle can still advance once evidence supports it |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `plan.md` keeps cached-startup and graph-nudge work in the P1 wave.
- `tasks.md` adds an evaluation-corpus task before any promotion.

**How to roll back**: Promote the bundle earlier only if a future follow-on packet proves fidelity, freshness, and pass-rate preservation on a frozen corpus.
