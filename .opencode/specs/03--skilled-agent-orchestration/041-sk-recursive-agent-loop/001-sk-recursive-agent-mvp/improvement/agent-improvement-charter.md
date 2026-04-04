---
title: Agent Improvement Charter
description: Fixed MVP charter for sk-agent-improver.
---

# Agent Improvement Charter

## Mission

Build a trustworthy improvement loop for agent surfaces by proving evaluation discipline before allowing self-editing.

## MVP Target

- Canonical source under test: `.opencode/agent/handover.md`
- Reason: structured prompt surface, narrow scope, clear downstream artifact contract

## Policy

- Proposal-only mode is mandatory
- The mutator and scorer are separate roles
- All attempts are logged append-only
- Runtime mirrors are read-only reference surfaces in phase 1
- Human approval is required before any later promotion design

## Keep / Discard Rule

- Keep the baseline when the candidate is weaker, noisier, or broader
- Keep the candidate only when it scores higher without violating policy
- Prefer the simpler option on ties

## Out of Scope

- Auto-editing the canonical target
- Runtime-mirror mutation
- Multi-target experiments
- Self-grading mutators
