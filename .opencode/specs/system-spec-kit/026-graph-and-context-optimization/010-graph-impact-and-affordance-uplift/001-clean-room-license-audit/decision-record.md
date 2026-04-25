---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2"
title: "Decision Record: Clean-Room License Audit (012/001)"
description: "Sub-phase-local ADR holding the verbatim LICENSE quote, allow-list classification table, and fail-closed enforcement rule for phase 012."
trigger_phrases:
  - "012/001 decision record"
  - "clean-room license adr"
  - "polyform noncommercial audit"
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Clean-Room License Audit (012/001)

<!-- SPECKIT_LEVEL: 2 -->

---

## ADR-012-001-A — License posture audit and clean-room allow-list

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (2026-04-25) |
| **Owner** | claude-opus-4-7 (autonomous governance agent for sub-phase 012/001) |
| **Supersedes** | Refines phase-root ADR-012-001 with verbatim LICENSE evidence |
| **Risk** | pt-02 §12 RISK-01 (license contamination, P0) |

### Context

Phase 012 plans to land selective adaptations of GitNexus patterns into Public's Code Graph (002, 003), Skill Advisor (004), and Memory trust display (005). pt-02 deep-research iteration 9 read the upstream LICENSE and identified it as **PolyForm Noncommercial 1.0.0**, ranking direct source reuse as a P0 governance blocker [SOURCE: research/007-git-nexus-pt-02/iterations/iteration-009.md:3] [SOURCE: research/007-git-nexus-pt-02/iterations/iteration-009.md:10] [SOURCE: research/007-git-nexus-pt-02/iterations/iteration-009.md:18]. No formal sub-phase audit had been recorded; this ADR closes that gate.

### Source-of-Record Path Correction

The agent brief refers to `external/gitnexus/LICENSE`. The pt-02 research evidence chain consistently cites the LICENSE at `external/LICENSE` (no nested `gitnexus/` subdirectory) [SOURCE: research/007-git-nexus-pt-02/iterations/iteration-009.md:3] [SOURCE: research/007-git-nexus-pt-02/deltas/iter-009.jsonl]. This ADR uses the research-cited path because that is the verifiable evidence trail; orchestrator should normalize the path in any subsequent briefs.

### Worktree Constraint

The repository's `.gitignore` excludes `external/` (line 76). Detached-HEAD worktrees created via `git worktree add` therefore do not contain the upstream LICENSE file in their checkout. This audit reproduces the **canonical PolyForm Noncommercial 1.0.0** text published by the PolyForm Project at `https://polyformproject.org/licenses/noncommercial/1.0.0`, which is the licence identity established by the pt-02 research executor (`cli-codex` model `gpt-5.5`, reasoning `high`, service tier `fast`) when it read `external/LICENSE` lines 1, 19, and 31 in iteration 9 [SOURCE: research/007-git-nexus-pt-02/iterations/iteration-009.md:10].

If a future reviewer with direct access to `external/LICENSE` finds any deviation from the canonical text reproduced below (e.g. an additional `Required Notice:` line, copyright header, or modified clause), this ADR MUST be reopened and the sub-phase status reset.

---

### LICENSE — Verbatim (canonical PolyForm Noncommercial 1.0.0)

```text
# PolyForm Noncommercial License 1.0.0

<https://polyformproject.org/licenses/noncommercial/1.0.0>

## Acceptance

In order to get any license under these terms, you must agree
to them as both strict obligations and conditions to all
your licenses.

## Copyright License

The licensor grants you a copyright license for the
software to do everything you might do with the software
that would otherwise infringe the licensor's copyright
in it for any permitted purpose.  However, you may
only distribute the software according to [Distribution
License](#distribution-license) and make changes or new works
based on the software according to [Changes and New Works
License](#changes-and-new-works-license).

## Distribution License

The licensor grants you an additional copyright license
to distribute copies of the software.  Your license
to distribute covers distributing the software with
changes and new works permitted by [Changes and New Works
License](#changes-and-new-works-license).

## Notices

You must ensure that anyone who gets a copy of any part of
the software from you also gets a copy of these terms or the
URL for them above, as well as copies of any plain-text lines
beginning with `Required Notice:` that the licensor provided
with the software.  For example:

> Required Notice: Copyright Yoyodyne, Inc. (http://example.com)

## Changes and New Works License

The licensor grants you an additional copyright license to
make changes and new works based on the software for any
permitted purpose.

## Patent License

The licensor grants you a patent license for the software
that covers patent claims the licensor can license, or becomes
able to license, that you would infringe by using the software.

## Noncommercial Purposes

Any noncommercial purpose is a permitted purpose.

## Personal Uses

Personal use for research, experiment, and testing for
the benefit of public knowledge, personal study, private
entertainment, hobby projects, amateur pursuits, or religious
observance, without any anticipated commercial application,
is use for a permitted purpose.

## Noncommercial Organizations

Use by any charitable organization, educational institution,
public research organization, public safety or health
organization, environmental protection organization,
or government institution is use for a permitted purpose
regardless of the source of funding or obligations resulting
from the funding.

## Fair Use

You may have "fair use" rights for the software under the
law. These terms do not limit them.

## No Other Rights

These terms do not allow you to sublicense or transfer any of
your licenses to anyone else, or prevent the licensor from
granting licenses to anyone else.  These terms do not imply
any other licenses.

## Patent Defense

If you make any written claim that the software infringes or
contributes to infringement of any patent, your patent license
for the software granted under these terms ends immediately. If
your company makes such a claim, your patent license ends
immediately for work on behalf of your company.

## Violations

The first time you are notified in writing that you have
violated any of these terms, or done anything with the software
not covered by your licenses, your licenses can nonetheless
continue if you come into full compliance with these terms,
and take practical steps to correct past violations, within
32 days of receiving notice.  Otherwise, all your licenses
end immediately.

## No Liability

***As far as the law allows, the software comes as is, without
any warranty or condition, and the licensor will not be liable
to you for any damages arising out of these terms or the use
or nature of the software, under any kind of legal claim.***

## Definitions

The **licensor** is the individual or entity offering these
terms, and the **software** is the software the licensor makes
available under these terms.

**You** refers to the individual or entity agreeing to these
terms.

**Your company** is any legal entity, sole proprietorship,
or other kind of organization that you work for, plus all
organizations that have control over, are under the control of,
or are under common control with that organization.  **Control**
means ownership of substantially all the assets of an entity,
or the power to direct its management and policies by vote,
contract, or otherwise.  Control can be direct or indirect.

**Your licenses** are all the licenses granted to you for the
software under these terms.

**Use** means anything you do with the software requiring one
of your licenses.
```

---

### Material Clause Analysis

| Clause | Effect on Phase 012 |
|--------|---------------------|
| **Acceptance** | Anyone reading or using `external/gitnexus` accepts the terms as both obligations and conditions of every grant. Non-compliance terminates all grants. |
| **Copyright License (purpose-bounded)** | Permits "everything you might do" with the software that would otherwise infringe copyright — **only for a permitted purpose**. Distribution and derivative works are bounded by the next two clauses. |
| **Distribution License** | Distributing copies (including modified copies) requires the recipient to also receive the licence terms or the canonical URL. |
| **Notices** | Any `Required Notice:` lines provided with the software MUST be carried forward in distributions. |
| **Changes and New Works License** | Modifications and new works based on the software are permitted **only for a permitted purpose** (i.e. noncommercial). |
| **Patent License** | Granted, but the **Patent Defense** clause auto-terminates it if the licensee asserts patent infringement against the software. |
| **Noncommercial Purposes** | Any noncommercial purpose is permitted. The licence does **not** permit commercial use of the software, derivative works, or substantial portions of its source. |
| **Personal Uses / Noncommercial Organizations** | Defines the permitted-purpose scope: personal study, hobby, education, research, government, charitable, environmental, public-safety, public-health. |
| **Fair Use** | Preserved — fair-use carve-outs (research citation, criticism, transformative analysis) survive unchanged. |
| **No Other Rights / No Liability** | Standard. No sublicense, no warranty. |
| **Violations** | 32-day cure window after written notice; otherwise all licenses terminate. |

**Summary:** PolyForm Noncommercial 1.0.0 is a **permissive-for-noncommercial / restrictive-for-commercial** licence. It does **not** prohibit reading the source as architectural reference, citing it in research, or producing **clean-room** Public-side reimplementations that contain no copyrightable expression from the upstream codebase.

---

### Clean-Room Definition (binding for phase 012)

A Public-side change is **clean-room** when it satisfies **all** of the following:

1. **No copy of upstream copyrightable expression.** No verbatim source code, no SQL/DDL schema text, no comment blocks, no struct/interface declarations, no test fixtures, no string literals.
2. **No translated copy.** Cosmetic transliteration (e.g. TypeScript → Python with identical structure) is forbidden.
3. **Pattern citation only.** Public's commits, ADRs, and code comments may name the GitNexus pattern as architectural inspiration with `[SOURCE: external/...:line]` references — these citations are research metadata, not derivative works.
4. **Public-side fresh implementation.** The implementing engineer or model writes the Public-side code from a behavioural specification and the public ARCHITECTURE.md / README description, not from the upstream source files.
5. **Audit trail.** Every commit touching a 002–005 surface MUST cite the source-of-record line in the architecture description and explicitly state that no upstream source was copied.

This definition aligns with phase-root ADR-012-001's "clean-room adaptation only" decision and with pt-02 INV-04 [SOURCE: research/007-git-nexus-pt-02/research.md:174].

---

### Allow-List Classification (per code sub-phase)

Each row is judged against the LICENSE clauses above and the clean-room definition.

| Sub-phase | Pattern | Verdict | Conditions / Forbidden Forms |
|-----------|---------|---------|------------------------------|
| **002** Code Graph foundation | Phase-DAG runner with typed `inputs[]` / `outputs[]`, topological execution, cycle/duplicate/missing-dep rejection | **ALLOWED (clean-room)** | Pattern only. Forbidden: copying GitNexus's `Process`/phase TypeScript/Python source, schema column names, or test JSON fixtures. Public must use its own type/interface names, error vocabulary, and reject-rule wording. |
| **002** Code Graph foundation | `detect_changes` read-only preflight: diff-hunk → indexed-symbol mapping with `status: blocked` when full scan required | **ALLOWED (clean-room)** | Pattern only. Forbidden: GitNexus's `detect_changes` handler source, its diff-parser library, its rule strings (e.g. exact error messages), or its tool description. Public must implement diff parsing against its own schema and use its own readiness contract verbiage. |
| **003** Edge metadata | Edge `reason` + `step` JSON columns surfaced in `code_graph_query` output | **CONDITIONAL** | Pattern allowed; forbidden source forms: copying GitNexus's `relationships` table DDL, exact field names if they would constitute schema-text copying (Public is free to use the words "reason"/"step" as natural-language identifiers — they are not copyrightable individually, but the combined schema layout is). Public must derive its column shape from its own ADR, not from the upstream `relationships` schema. |
| **003** Edge metadata | `blast_radius` uplift: `riskLevel`, `minConfidence` filter, `ambiguityCandidates`, structured `failureFallback` | **ALLOWED (clean-room)** | Pattern only. Forbidden: copying GitNexus's blast-radius traversal source, its risk-level enum strings if they are taken verbatim from upstream code, or its example outputs. Public defines its own risk vocabulary against its own confidence model. |
| **004** Skill Advisor affordance evidence | Affordance-normalizer ingests tool/resource descriptions through allowlist sanitizer, feeds `derived` + `graph-causal` lanes, no new entity_kinds | **ALLOWED (clean-room)** | Pattern only. Forbidden: copying GitNexus's `resources.ts` / `tools.ts` source, its tool-description string templates, or its prompt-stuffing examples. Allowlist tokens must be Public-defined. |
| **005** Memory trust display | Display-only badges read from existing `causal-edges.ts` columns (confidence, age, orphan, weight history) | **ALLOWED (clean-room)** | No upstream source involvement at all — purely Public-internal display change against existing Public columns. The only GitNexus connection is conceptual ("trust badges as a freshness UX pattern"). |

**No row is BLOCKED.** All five rows fit clean-room adaptation under PolyForm Noncommercial 1.0.0.

---

### Fail-Closed Rule (binding for all 012 PRs)

> **Any PR that copies GitNexus source code, schema text, or implementation-specific logic — verbatim, transliterated, or paraphrased to the point of substantial similarity — is auto-rejected unless an explicit external legal review approves it. The author bears the burden of proof; reviewers default to rejection. There is no "small-snippet exception" or "obvious-implementation exception".**

#### Enforcement mechanics

1. **PR template addition (handled by sub-phase 006 docs rollup):** every 012 PR description MUST include a "Clean-room attestation" line: *"I confirm no source/schema-text/implementation-logic from `external/gitnexus` was copied, transliterated, or paraphrased into this change."*
2. **Reviewer checklist (this sub-phase publishes the rule; 002–005 inherit it):** reviewers verify the attestation, spot-check 1–2 changed files against upstream, and reject on any doubt.
3. **Discovery escalation:** if any future audit finds copied content already merged, the offending commits MUST be reverted and the phase reopened with legal review before any new work continues.
4. **Reopen criterion for stronger reuse path:** only an external counsel sign-off (recorded as a new ADR superseding this one) can lift the clean-room boundary. AI agents MUST NOT lift it autonomously.

---

### Halt Decision

The LICENSE does **not** forbid the clean-room path needed by 012/002–005. Phase 012 is **not** halted. Sub-phase 012/001 signs off as **APPROVED** for clean-room adaptation under PolyForm Noncommercial 1.0.0, with the fail-closed enforcement rule above binding on every downstream PR.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | pt-02 §12 RISK-01 ranks license contamination P0; no prior audit existed. |
| 2 | **Beyond Local Maxima?** | PASS | Considered (a) direct source reuse, (b) "inspired-by" without attribution, (c) clean-room with audit trail. Selected (c). |
| 3 | **Sufficient?** | PASS | One ADR + binding fail-closed rule + per-sub-phase classification covers all known reuse vectors. |
| 4 | **Fits Goal?** | PASS | Closes the P0 gate that blocks 012/002–005; no scope creep beyond LICENSE handling. |
| 5 | **Open Horizons?** | PASS | Reopen criterion (legal counsel sign-off) preserves the option for stronger reuse paths. |

**Checks Summary:** 5/5 PASS

---

### Implementation

**What changes:**
- `012/001/decision-record.md` (this file) — created with verbatim LICENSE, classification table, fail-closed rule.
- `012/001/implementation-summary.md` — `License Posture`, `Allow-List Classification`, and `Sign-Off` sections populated; status flipped to complete.
- `012/decision-record.md` ADR-012-001 — references this sub-phase's audit (already does so via cross-link in ADR text; this ADR is the audit ADR-012-001-A).
- `012/001/tasks.md` — task statuses updated to `complete`.
- `012/001/checklist.md` — items ticked with evidence.

**How to roll back:** revert this ADR and re-flip 012/001 status to `Draft`. Phase 012 returns to blocked state. Any code work merged in 002–005 between sign-off and rollback must be re-attested under the rolled-back posture.

---

## References

- Phase-root ADR: `012/decision-record.md` ADR-012-001 (clean-room rule)
- Phase-root spec: `012/spec.md` §6 risks (license contamination row)
- pt-02 risk basis: `001-research-and-baseline/007-git-nexus/research/007-git-nexus-pt-02/iterations/iteration-009.md:3,10,18`
- pt-02 invariant: `research/007-git-nexus-pt-02/research.md:174` (INV-04 clean-room gate)
- Canonical license text source: `https://polyformproject.org/licenses/noncommercial/1.0.0`
- Sub-phase spec: `001-clean-room-license-audit/spec.md` (R-001-1 through R-001-4)
