---
iteration: 48
dimension: security
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-release-readiness
startedAt: 2026-04-12T18:41:30Z
completedAt: 2026-04-12T18:44:27Z
---

# Deep Review Iteration 048 — security (Round 3 Release)

**Focus:** RELEASE: Verify the Level 3+ documentation is consistent after the enterprise/sign-off cleanup. Check SKILL.md, README.md, template_mapping.md, level_decision_matrix.md, level_specifications.md, template_guide.md all use approval/compliance/stakeholder language consistently.

---

● skill(sk-code-review)

I’m pulling the review baseline and the six target docs together first so I can do a single consistency pass against the approval/compliance/stakeholder language.

● Read review_core.md
  │ .claude/skills/sk-code-review/references/review_core.md
  └ 98 lines read

● Read security_checklist.md
  │ .claude/skills/sk-code-review/references/security_checklist.md
  └ 206 lines read

● Read review_ux_single_pass.md
  │ .claude/skills/sk-code-review/references/review_ux_single_pass.md
  └ 82 lines read

● Search (glob)
  │ "**/{SKILL.md,README.md,template_mapping.md,level_decision_matrix.md,level_specifications.md,tem
  │ plate_guide.md}"
  └ 10 files found

I found the repo-wide matches were too broad, so I’m narrowing the scope to the system-spec-kit docs bundle and scanning the governance language directly.

● Search (grep)
  │ "approval|approvals|approve|approved|stakeholder|stakeholders|compliance|sign-off|signoff" in
  │ **/{SKILL.md,README.md,template_mapping.md,level_decision_matrix.md,level_specifications.md,temp
  │ late_guide.md} (.opencode/skill/system-spec-kit)
  └ 60 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/{SKILL.md,README.md,template_mapping.md,level_decision_matri
  │ x.md,level_specifications.md,template_guide.md}"
  └ 113 files found

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L388:440 (53 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L792:902 (111 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L236:280 (45 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L420:490 (70 lines read)

● Read template_mapping.md
  │ .opencode/skill/system-spec-kit/assets/template_mapping.md
  └ L92:110 (19 lines read)

● Read template_mapping.md
  │ .opencode/skill/system-spec-kit/assets/template_mapping.md
  └ L228:246 (18 lines read)

● Read template_mapping.md
  │ .opencode/skill/system-spec-kit/assets/template_mapping.md
  └ L458:468 (10 lines read)

● Read level_decision_matrix.md
  │ .opencode/skill/system-spec-kit/assets/level_decision_matrix.md
  └ L38:62 (25 lines read)

● Read level_decision_matrix.md
  │ .opencode/skill/system-spec-kit/assets/level_decision_matrix.md
  └ L154:162 (9 lines read)

● Read level_specifications.md
  │ .opencode/skill/system-spec-kit/references/templates/level_specifications.md
  └ L62:75 (14 lines read)

● Read level_specifications.md
  │ .opencode/skill/system-spec-kit/references/templates/level_specifications.md
  └ L386:408 (23 lines read)

● Read level_specifications.md
  │ .opencode/skill/system-spec-kit/references/templates/level_specifications.md
  └ L498:540 (42 lines read)

● Read level_specifications.md
  │ .opencode/skill/system-spec-kit/references/templates/level_specifications.md
  └ L840:850 (11 lines read)

● Read template_guide.md
  │ .opencode/skill/system-spec-kit/references/templates/template_guide.md
  └ L224:240 (16 lines read)

● Search (grep)
  │ "sign-off|signoffs|sign-offs|sign off" in
  │ {SKILL.md,README.md,assets/template_mapping.md,assets/level_decision_matrix.md,references/templa
  │ tes/level_specifications.md,references/templates/template_guide.md}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "enterprise|governance|approval workflow|approval tracking|stakeholder
  │ tracking|stakeholders|compliance" in
  │ {SKILL.md,README.md,assets/template_mapping.md,assets/level_decision_matrix.md,references/templa
  │ tes/level_specifications.md,references/templates/template_guide.md}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

I found one likely drift already: some Level 3+ references still talk about explicit “sign-offs” while the top-level docs describe the cleanup as approval/compliance/stakeholder tracking. I’m verifying whether that’s isolated or repeated across the whole six-file set.

● Search (grep)
  │ "sign-off|sign-offs|sign off|signoffs" (.opencode/skill/system-spec-kit/SKILL.md)
  └ No matches found

● Search (grep)
  │ "sign-off|sign-offs|sign off|signoffs" (.opencode/skill/system-spec-kit/README.md)
  └ No matches found

● Search (grep)
  │ "sign-off|sign-offs|sign off|signoffs"
  │ (.opencode/skill/system-spec-kit/assets/template_mapping.md)
  └ 2 lines found

● Search (grep)
  │ "sign-off|sign-offs|sign off|signoffs"
  │ (.opencode/skill/system-spec-kit/assets/level_decision_matrix.md)
  └ No matches found

● Search (grep)
  │ "sign-off|sign-offs|sign off|signoffs"
  │ (.opencode/skill/system-spec-kit/references/templates/level_specifications.md)
  └ 2 lines found

● Search (grep)
  │ "sign-off|sign-offs|sign off|signoffs"
  │ (.opencode/skill/system-spec-kit/references/templates/template_guide.md)
  └ No matches found

● Search (grep)
  │ "stakeholder|stakeholders|approval workflow|approval tracking|compliance"
  │ (.opencode/skill/system-spec-kit/references/templates/level_specifications.md)
  └ 8 lines found

● Search (grep)
  │ "approval workflow|approval tracking|stakeholder|stakeholders|compliance|enterprise
  │ governance|formal approval" (.opencode/skill/system-spec-kit/assets/template_mapping.md)
  └ 8 lines found

● Search (grep)
  │ "approval workflow|approval tracking|stakeholder|stakeholders|compliance|enterprise
  │ governance|formal approval" (.opencode/skill/system-spec-kit/SKILL.md)
  └ 6 lines found

● Search (grep)
  │ "approval workflow|approval tracking|stakeholder|stakeholders|compliance|enterprise
  │ governance|formal approval" (.opencode/skill/system-spec-kit/README.md)
  └ 6 lines found

● Search (grep)
  │ "approval workflow|approval tracking|stakeholder|stakeholders|compliance|enterprise
  │ governance|formal approval" (.opencode/skill/system-spec-kit/assets/level_decision_matrix.md)
  └ 2 lines found

● Search (grep)
  │ "approval workflow|approval tracking|stakeholder|stakeholders|compliance|enterprise
  │ governance|formal approval"
  │ (.opencode/skill/system-spec-kit/references/templates/template_guide.md)
  └ 3 lines found

● Search (grep)
  │ "approval workflow|approval tracking|stakeholder|stakeholders|compliance|enterprise
  │ governance|formal approval|sign-off|sign-offs"
  │ (.opencode/skill/system-spec-kit/references/templates/level_specifications.md)
  └ 10 lines found

### P1

1. **F-048-001 — Stale “sign-off” wording still survives in Level 3+ checklist guidance**
   - **File:** `.opencode/skill/system-spec-kit/assets/template_mapping.md:235,466`; `.opencode/skill/system-spec-kit/references/templates/level_specifications.md:390,402`
   - **Evidence:** `template_mapping.md` still describes the Level 3+ checklist as having `+sign-offs` and “sign-offs and compliance,” and `level_specifications.md` still calls for a “sign-off section” with named role sign-offs. That conflicts with the cleaned-up canonical Level 3+ definition elsewhere, which consistently frames 3+ as **approval workflow + compliance + stakeholder tracking/communication**: `SKILL.md:399-407`, `README.md:240,462-486`, `template_guide.md:232-235`, `assets/level_decision_matrix.md:42-52`.
   - **Impact:** This reintroduces the pre-cleanup governance model into two of the six reference docs, so operators can still build or review Level 3+ packets against role-based sign-off expectations instead of the new approval/compliance/stakeholder model.
   - **Recommendation:** Replace all residual “sign-off/sign-offs” references in Level 3+ checklist descriptions with the same approval-tracking terminology used by the canonical docs.

### P2

1. **F-048-002 — `level_specifications.md` omits stakeholder tracking from its primary Level 3+ definition**
   - **File:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md:67,534`
   - **Evidence:** Its top-level Level 3+ summary says “Approval workflow, compliance, AI protocols,” and its upgrade heading says “approval workflow + compliance.” Every other reviewed source includes **stakeholders/stakeholder tracking** in the defining Level 3+ language: `SKILL.md:399-407`, `README.md:240,462-486`, `assets/template_mapping.md:96,104,243`, `assets/level_decision_matrix.md:42-52`, `template_guide.md:232-235`.
   - **Impact:** Readers using `level_specifications.md` as the source of truth can miss stakeholder communication/tracking when choosing or upgrading to Level 3+, which weakens the consistency of the enterprise/governance guidance.
   - **Recommendation:** Update the Level 3+ summary and upgrade text to include stakeholder tracking/communication alongside approval/compliance.

**ITERATION SUMMARY:** Two release-relevant consistency issues remain. The main problem is stale sign-off terminology in `template_mapping.md` and `level_specifications.md`; a secondary issue is that `level_specifications.md` still under-specifies Level 3+ by omitting stakeholder tracking in its headline definition.

**COVERAGE ASSESSMENT:** Reviewed all 6 requested files: `SKILL.md`, `README.md`, `assets/template_mapping.md`, `assets/level_decision_matrix.md`, `references/templates/level_specifications.md`, and `references/templates/template_guide.md`. Coverage was focused on Level 3+ approval/compliance/stakeholder terminology, checklist language, and upgrade/selection guidance.

**CONFIDENCE:** High. The inconsistencies are explicit, repeated, and directly evidenced by cross-file comparison.


Changes   +0 -0
Requests  1 Premium (2m 55s)
Tokens    ↑ 617.4k • ↓ 8.3k • 584.8k (cached) • 5.0k (reasoning)
