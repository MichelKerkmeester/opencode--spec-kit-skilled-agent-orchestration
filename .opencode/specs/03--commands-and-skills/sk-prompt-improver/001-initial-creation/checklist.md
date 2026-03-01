---
title: "Verification Checklist: sk-prompt-improver Initial Creation"
---
# Verification Checklist: sk-prompt-improver Initial Creation

<!-- SPECKIT_LEVEL: 3 -->

---

## P0: Hard Blockers

These must be completed before claiming readiness.

- [x] **SKILL.md exists with valid frontmatter** [EVIDENCE: SKILL.md:1-5 — name: sk-prompt-improver, description: "Prompt engineering specialist...", allowed-tools: [Read, Write, Edit, Bash, Glob, Grep], version: 1.0.0]
  - Required fields: `name`, `description`, `allowed-tools`
  - Frontmatter format: YAML between `---` markers

- [x] **SKILL.md has all required sections** [EVIDENCE: SKILL.md grep — 8 sections: §1 WHEN TO USE (:19), §2 SMART ROUTING (:67), §3 HOW IT WORKS (:211), §4 RULES (:289), §5 REFERENCES (:345), §6 SUCCESS CRITERIA (:374), §7 INTEGRATION POINTS (:396), §8 RELATED RESOURCES (:433)]
  - Verify each section header exists
  - Verify section content is substantive (not placeholder text)

- [x] **SKILL.md under 5000 words** [EVIDENCE: wc -w SKILL.md = 2,334 words (46.7% of 5,000 limit)]
  - Keep orchestrator SKILL.md lean
  - Deep content belongs in references/

- [x] **RULES section has required subsections** [EVIDENCE: SKILL.md:289-343 — ALWAYS (6 rules), NEVER (5 anti-patterns), ESCALATE IF (3 triggers)]
  - Verify ALWAYS subsection exists with 2+ rules
  - Verify NEVER subsection exists with 2+ anti-patterns
  - Verify ESCALATE IF subsection exists with 2+ escalation triggers

- [x] **references/ directory contains all adapted knowledge base files** [EVIDENCE: ls references/ — 8 files: depth_framework.md (23KB), system_prompt.md (33KB), patterns_evaluation.md (39KB), interactive_mode.md (20KB), visual_mode.md (49KB), image_mode.md (64KB), video_mode.md (41KB), format_guides.md (38KB)]
  - system_prompt.md
  - depth_framework.md
  - patterns_evaluation.md
  - interactive_mode.md
  - visual_mode.md
  - image_mode.md
  - video_mode.md
  - format_guides.md

- [x] **skill_advisor.py updated with sk-prompt-improver entries** [EVIDENCE: skill_advisor.py contains 43 occurrences of "sk-prompt-improver" — INTENT_BOOSTERS (18 keywords), PHRASE_INTENT_BOOSTERS (21 phrases), MULTI_SKILL_BOOSTERS (4 entries), SYNONYM_MAP (3 entries). Routing test: "improve my prompt" returns 0.95 confidence]
  - Verify intent boosters added
  - Verify confidence weighting configured

---

## P1: Required Items

These must be completed or explicitly deferred with user approval.

- [x] **SKILL.md name matches folder name** [EVIDENCE: SKILL.md:2 — `name: sk-prompt-improver` matches directory `.opencode/skill/sk-prompt-improver/`]
  - Consistency check: skill name must match directory name

- [x] **Description uses third-person voice** [EVIDENCE: SKILL.md:3 — "Prompt engineering specialist that transforms vague requests..." — no first-person pronouns (I/we/you), professional third-person voice throughout]
  - Verify no first-person pronouns (I, we, you)
  - Check professional tone

- [x] **Smart routing pseudocode is authoritative and complete** [EVIDENCE: SKILL.md:67-209 — Python pseudocode with 6 intent categories (TEXT_ENHANCE, VISUAL_UI, IMAGE_GEN, VIDEO_GEN, FRAMEWORK, FORMAT), keyword/context/explicit scoring, resource mapping per intent, scoped guards, recursive discovery. 142 lines of routing logic]
  - Verify decision tree logic
  - Verify coverage of all major use cases
  - Verify pseudocode is unambiguous

- [x] **All 10 operating modes documented** [EVIDENCE: 8 dedicated reference files — system_prompt.md (core routing), depth_framework.md (DEPTH methodology), patterns_evaluation.md (10 frameworks), interactive_mode.md (7 conversation variants), visual_mode.md (VIBE/VIBE-MP), image_mode.md (FRAME for image gen), video_mode.md (MOTION for video gen), format_guides.md (Markdown/JSON/YAML)]
  - System Prompt mode
  - DEPTH Framework mode
  - Patterns Evaluation mode
  - Interactive mode (7 variants)
  - Visual mode
  - Image mode
  - Video mode
  - Verify each has dedicated section or file

- [x] **DEPTH framework integrated in references** [EVIDENCE: depth_framework.md (23KB, 43 matches for DEPTH/Discover/Engineer/Prototype/Test/Harmonize) — complete 5-phase structure, RICCE integration, signal-based routing, 10-round processing methodology]
  - Verify framework structure documented
  - Verify all depth levels explained (Surface, Intermediate, Expert, Mastery)

- [x] **Triple scoring systems documented** [EVIDENCE: 174 total occurrences of CLEAR/EVOKE/VISUAL across all 8 reference files — CLEAR scoring in patterns_evaluation.md (50-point rubric), EVOKE scoring in visual_mode.md (quantifiable rubric), VISUAL scoring in image_mode.md (60-point) and video_mode.md (70-point)]
  - CLARITY scoring dimension
  - EVOKE scoring dimension
  - VISUAL scoring dimension
  - Verify scoring rubrics are quantifiable (0-100 or similar)

---

## P2: Nice-to-Have Items

These enhance quality but are not blockers.

- [ ] **README.md for skill folder** [E: .opencode/skill/sk-prompt-improver/README.md]
  - Overview of skill purpose
  - Quick start guide
  - Links to skill documentation

- [ ] **All references under 10k words each** [E: word count analysis per file]
  - Helps keep individual reference files focused
  - Easier navigation for users

- [ ] **Flowchart supplements for complex logic** [E: diagram files in references/]
  - Routing decision flowchart
  - Mode selection flowchart
  - Optional: ASCII diagrams in markdown

---

## Verification Summary

**Total Checklist Items:**
- P0: 6 blockers
- P1: 6 required
- P2: 3 optional

**Completion Rule:** All P0 items marked `[x]` + all P1 items marked `[x]` OR deferred with evidence = READY FOR HANDOVER

---

## Evidence Format

For each checked item, provide:
- Tool output or file excerpt
- Screenshot or reference path
- Verification method used

Example:
```
- [x] SKILL.md exists [E: grep -l "name:" .opencode/skill/sk-prompt-improver/SKILL.md returns file path]
```

---

## Cross-References

- **Tasks**: See `tasks.md`
- **Plan**: See `plan.md`
- **Spec**: See `spec.md`
- **Decisions**: See `decision-record.md`
