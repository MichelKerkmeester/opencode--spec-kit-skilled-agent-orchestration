---
title: Agent Improvement Charter
description: Fixed charter for sk-improve-agent full-skill packet.
---

# Agent Improvement Charter

## Mission

Build a trustworthy improvement loop for agent surfaces by proving evaluation discipline before allowing self-editing.

## Canonical Benchmark Seed

- Canonical source under test: `.opencode/agent/handover.md`
- Reason: structured prompt surface, narrow scope, clear downstream artifact contract

## Additional Bounded Target

- Candidate-only source under test: `.opencode/agent/context-prime.md`
- Reason: structured, read-only Prime Package contract with a smaller and safer output surface than broad orchestration agents

## Policy

- Proposal-only mode is mandatory
- The mutator and scorer are separate roles
- Benchmark evidence is required for target profiles that declare fixtures
- All attempts are logged append-only
- Runtime mirrors are downstream packaging surfaces, not benchmark truth
- Human approval is required before any canonical promotion
- Only the handover target is promotion-eligible in this packet

## Keep / Discard Rule

- Keep the baseline when the candidate is weaker, noisier, or broader
- Keep the candidate only when it scores higher without violating policy
- Prefer the simpler option on ties

## Out of Scope

- Multi-canonical promotion
- Runtime-mirror mutation as experiment evidence
- Open-ended multi-target rollout
- Self-grading mutators
