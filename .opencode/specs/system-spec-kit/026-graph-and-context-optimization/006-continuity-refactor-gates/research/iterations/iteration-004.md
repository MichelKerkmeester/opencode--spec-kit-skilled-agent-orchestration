---
title: "Iteration 004 — Frontmatter and metadata merge policy"
iteration: 4
band: A
timestamp: 2026-04-11T13:50:00Z
worker: claude-opus-4-6
scope: q2_q3_metadata_merge
status: complete
focus: "Design how memory metadata (tier, FSRS, causal edges, provenance, fingerprint) attaches to spec docs. Compare 3 options and pick one."
maps_to_questions: [Q2, Q3]
---

# Iteration 004 — Frontmatter and Metadata Merge Policy

## Goal

Memory metadata (trigger phrases, tier, causal links, FSRS state, fingerprint, provenance) must attach to SOMETHING in the Option C world. Spec docs already have their own frontmatter. Design the attachment policy: what goes where, without corrupting the spec doc's identity.

## Three options evaluated

### Option M-A: Sidecar JSON file per spec doc

Write a `.meta.json` file next to each spec doc:
```
specs/NNN-name/
├── implementation-summary.md
├── implementation-summary.meta.json   ← NEW
├── decision-record.md
├── decision-record.meta.json          ← NEW
└── ...
```

**Pros**:
- Zero changes to spec doc files — no risk of corrupting human-authored content
- Clean separation of human content from machine metadata
- Easy to parse with any JSON library
- Easy to .gitignore if desired (though we wouldn't — metadata is valuable)

**Cons**:
- Double the file count in every spec folder
- Metadata can drift out of sync if a human edits the .md without touching the sidecar
- Tooling must read two files to get full context

### Option M-B: Embedded YAML extension inside spec doc frontmatter

Extend the existing YAML frontmatter in each spec doc with a reserved `_memory` key:
```yaml
---
title: Implementation Summary
description: ...
trigger_phrases:
  - existing trigger 1
  - existing trigger 2
importance_tier: important
contextType: implementation
_memory:
  causal_links:
    caused_by: []
    supersedes: ["F-017-004"]
    related_to: ["adr-005"]
  fsrs_state:
    stability: 1.5
    difficulty: 5.2
    last_review: 2026-04-11T13:50:00Z
    review_count: 1
  fingerprint: sha256:abc123...
  provenance:
    tenant_id: default
    session_id: 018-impl-design
---
```

**Pros**:
- Single file = single source of truth; no sync drift
- Spec doc frontmatter is already well-supported by the validator and parsers
- Human editors see the metadata when they open the file (transparency)
- Git diff shows metadata changes alongside content changes

**Cons**:
- Spec doc frontmatter becomes large and noisy (potentially +30 lines)
- Humans editing the doc may accidentally corrupt the `_memory` block
- Requires template updates across all 4 levels

### Option M-C: Separate continuity record in `research/` or dedicated folder

Create a new `continuity/` subfolder per spec packet:
```
specs/NNN-name/
├── implementation-summary.md
├── ...
└── continuity/
    ├── implementation-summary.continuity.json
    ├── decision-record.continuity.json
    └── ...
```

Same shape as sidecar but centralized in one subfolder per packet.

**Pros** / **Cons**: basically Option M-A with one layer of indirection. Marginally cleaner visual but same sync-drift risk.

## Recommendation: Option M-B with a safety net

**Embedded YAML extension with a reserved `_memory` key**, guarded by:

1. **Template updates**: add the `_memory` key structure to all `implementation-summary.md`, `decision-record.md`, `handover.md`, `research.md`, `tasks.md`, `checklist.md`, `plan.md`, `spec.md` templates across Levels 1/2/3/3+.

2. **Validator rule**: extend `ANCHORS_VALID` with a companion `FRONTMATTER_MEMORY_BLOCK` rule that checks:
   - `_memory` key is valid YAML under the existing frontmatter
   - Required sub-keys present: `causal_links`, `fsrs_state`, `fingerprint` (others optional)
   - No required sub-key is null or malformed

3. **Human override safety**: if a human edit corrupts the `_memory` block, the next save detects the corruption (via validator) and surfaces it with options:
   - Restore from last-known-good (stored in `.git/` history)
   - Reset `_memory` block to default
   - Abort save

4. **`_memory` block excluded from `git diff` noise**: recommend operators add a `.gitattributes` entry to treat the `_memory` block as "auto-generated" for review diffs. This is a soft convention, not enforced.

### Why M-B over M-A/M-C

- **M-A doubles file count** — in a repo with 150+ spec folders × 8 docs each, that's 1200+ new sidecar files. Friction cost is high.
- **M-C** is M-A with a folder shim. Same problem.
- **M-B** is the single-source-of-truth pattern the rest of the spec kit already uses. Spec docs already have frontmatter; extending it is the natural move.
- **M-B's main risk (human corruption) is mitigated** by validator + restore path.

## What the `_memory` block contains (schema draft)

```yaml
_memory:
  # Causal relationships to other packet docs or memories
  causal_links:
    caused_by: [...]     # list of (doc, anchor) tuples or memory_ids
    supersedes: [...]
    contradicts: [...]
    derived_from: [...]
    supports: [...]
    related_to: [...]
  
  # FSRS cognitive state (copied from memory_index when indexed)
  fsrs_state:
    stability: 1.5
    difficulty: 5.2
    last_review: ISO-8601
    review_count: 1
    access_count: 0
  
  # Content deduplication
  fingerprint: sha256:...
  content_hash: sha256:...
  
  # Provenance (governance)
  provenance:
    tenant_id: string
    user_id: string
    agent_id: string
    session_id: string
    shared_space_id: string
    
  # Optional epistemic baseline (from task_preflight/task_postflight)
  preflight:
    knowledge_score: 0-100
    uncertainty_score: 0-100
    context_score: 0-100
    timestamp: ISO-8601
  postflight:
    knowledge_delta: integer
    uncertainty_reduction: integer
    learning_index: 0.0-1.0
  
  # Thin continuity pointer (what the next resume should surface)
  continuity:
    packet_pointer: string   # spec folder path
    recent_action: string    # one-line description
    next_safe_action: string # one-line description
    blockers: [list]
    key_files: [list]
```

This is the minimum. Additional fields can be added per packet without breaking the schema (YAML is extensible).

## Handling the "what about the thin continuity layer?" question

The phase 018 plan talks about a "thin continuity layer" separate from spec docs. Does M-B conflict with that?

**Answer**: no. The `_memory.continuity` sub-block IS the thin continuity layer. It lives in the spec doc's frontmatter rather than as a separate file. Benefits:
- One source of truth
- Resume path reads it from the same file it would read anyway
- No new storage primitive needed

Iteration 5 designs this thin continuity layer in detail — the schema sketch here is the starting point.

## Findings

- **F4.1**: M-B (embedded YAML extension) wins on "single source of truth" and minimizes file count proliferation.
- **F4.2**: The existing spec doc frontmatter is already parsed by the spec kit validator. Extending it with a reserved `_memory` key is a small, well-grounded change.
- **F4.3**: Human corruption of the `_memory` block is a real risk, mitigated by (a) validator rule, (b) restore-from-git option, (c) save-time detection.
- **F4.4**: The thin continuity layer from iteration 5 can be expressed as a sub-field of `_memory.continuity` rather than a separate storage primitive. This simplifies the architecture.
- **F4.5**: All Option C advanced feature retargeting can happen through the `_memory` block: trigger phrases (already in frontmatter), causal links (new sub-key), FSRS state (new sub-key), tiers (already in frontmatter via `importance_tier`), provenance (new sub-key), constitutional flag (new sub-key).

## Open questions

- Exact template updates per level — deferred to phase 018 implementation
- `.gitattributes` convention for `_memory` block diff suppression — operator preference

## What worked

- Evaluating 3 options against pros/cons made M-B's choice defensible.
- Recognizing that the thin continuity layer can LIVE in `_memory.continuity` rather than as a separate file simplifies the architecture.

## What failed / did not work

- Did not prototype the YAML extension in a real template — deferred to iteration 5 which designs the schema in detail.

## Next focus (iteration 5)

Design the thin continuity layer schema in detail. Specifically: what fields, what lifecycle, what read/write patterns. Complete Band A.
