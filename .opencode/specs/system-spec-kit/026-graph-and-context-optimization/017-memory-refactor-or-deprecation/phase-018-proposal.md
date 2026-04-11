# Phase 018 Proposal

## Title

Canonical Continuity Refactor

## Goal

Refactor session continuity so canonical narrative lives in packet docs, while the memory system is reduced to the smallest layer that still supports safe resume and historical retrieval.

## Problem

The current system saves heavyweight narrative memory documents even though most of the same information already belongs in:

- `implementation-summary.md`
- `decision-record.md`
- `handover.md`
- `research/research.md`
- `tasks.md`

This creates duplication, generator complexity, and retrieval noise. Phase 005 also showed systemic generator-quality defects, which raises the question of whether the current memory format is worth continuing at all (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/005-memory-deep-quality-investigation/spec.md:62-80`).

## Scope

In scope:

- Define canonical save-routing rules for continuity content.
- Redesign default `memory_save` behavior around a thin continuity artifact or metadata-only record.
- Redesign `/spec_kit:resume`, `session_resume`, and `session_bootstrap` around the new contract.
- Update command and agent guidance that currently assumes memory-first retrieval.
- Keep old memory files read-only during transition.

Out of scope:

- Bulk rewriting the historical memory corpus.
- Deleting memory MCP entirely in the same phase.
- Rewriting every spec template in one pass.

## Proposed Architecture

1. Canonical docs
   - Implementation narrative -> `implementation-summary.md`
   - Durable decisions -> `decision-record.md`
   - Research findings -> `research/research.md`
   - Session-end next step / blockers -> `handover.md`
2. Thin continuity layer
   - small indexed continuity record or metadata-only record
   - retains packet pointer, recent action, next safe action, blockers, key files, and provenance
3. Resume stack
   - `handover.md` first
   - packet docs second
   - thin continuity retrieval third
   - historical archived memory search last

## Deliverables

- Updated continuity architecture spec
- Updated `/spec_kit:resume` contract
- Updated `session_resume` / `session_bootstrap` behavior
- Updated `/memory:save` semantics
- Agent and command doc alignment
- Read-only legacy memory compatibility plan

## Phases

1. Contract Design
   - define authority, routing, and fallback rules
2. Runtime Migration
   - implement thin continuity save/retrieval and resume-path updates
3. Surface Cleanup
   - commands, agents, tests, and docs

## Validation

- `/spec_kit:resume` can recover next safe action without requiring a full narrative memory file
- implementation closeout writes canonical narrative to packet docs
- at least one historical archived-memory query still succeeds through the fallback path
- command and agent docs no longer describe heavyweight memory files as the default truth surface

## Rollback

Keep legacy memory files and legacy index rows read-only until the new resume path is proven. If the new continuity contract underperforms, re-enable legacy memory retrieval as a fallback while keeping the canonical-doc routing work.

