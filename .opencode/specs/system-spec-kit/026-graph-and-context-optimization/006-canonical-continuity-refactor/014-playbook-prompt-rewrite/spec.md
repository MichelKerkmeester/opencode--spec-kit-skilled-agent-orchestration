---
title: "Phase 014 — Manual Testing Playbook Prompt Rewrite"
description: "Rewrite all manual testing playbook scenario prompts using sk-improve-prompt frameworks for higher quality, consistency, and testability."
trigger_phrases:
  - "playbook prompt rewrite"
  - "improve test prompts"
  - "sk-improve-prompt playbook"
importance_tier: "important"
contextType: "implementation"
level: 2
status: "planned"
parent: "006-canonical-continuity-refactor"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 014 — Manual Testing Playbook Prompt Rewrite

## EXECUTIVE SUMMARY

The manual testing playbook contains ~305 scenarios across 22 categories. Each scenario has a `Prompt:` field that tells the tester what to type/ask. Many of these prompts are:
- Vague ("test this feature")
- Inconsistent in structure across categories
- Not optimized for AI execution (missing context, unclear expected behavior)
- Written pre-Phase 006 and reference deprecated concepts

This phase rewrites every playbook prompt using the sk-improve-prompt skill's proven frameworks (RCAF, COSTAR, etc.) for maximum clarity, consistency, and testability.

## SCOPE

### In scope
- Rewrite the `Prompt:` field in every manual testing playbook scenario
- Apply sk-improve-prompt frameworks for structure and scoring
- Ensure all prompts reference post-006 canonical continuity model
- Standardize prompt format across all 22 categories
- Update the `Commands:` and `Expected:` sections if they reference deprecated concepts

### Out of scope
- Creating new scenarios (Gate H/I scope)
- Modifying the feature catalog (separate concern)
- Code changes (documentation only)

## APPROACH

Use sk-improve-prompt to:
1. Analyze each category's existing prompts
2. Score them on CLEAR dimensions (Clarity, Layered, Evidence, Adaptive, Role-defined)
3. Rewrite low-scoring prompts using the best-fit framework
4. Standardize the prompt → commands → expected → evidence structure
5. Verify no deprecated concept references remain

## FILES

All files under `.opencode/skill/system-spec-kit/manual_testing_playbook/`:
- 22 category subfolders (`01--retrieval` through `22--context-preservation-and-code-graph`)
- ~305 individual scenario `.md` files
- Master index `manual_testing_playbook.md`
