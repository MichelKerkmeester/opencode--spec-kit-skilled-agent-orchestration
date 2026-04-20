---
title: "027/002 — Checklist"
description: "Acceptance verification for lifecycle + derived metadata."
importance_tier: "high"
contextType: "implementation"
---
# 027/002 Checklist

## P0 (HARD BLOCKER)
- [ ] Derived extraction pipeline deterministic + regenerable from documented inputs
- [ ] Trust lanes: `explicit_author` vs `derived_generated`; author intent never decays
- [ ] Schema-v2 `derived` block published (Zod validator + spec)
- [ ] v1→v2 backfill additive; rollback additive strip
- [ ] Mixed-version reads during migration (v1 still routable)
- [ ] Supersession asymmetry: successor default + explicit-name redirect
- [ ] `z_archive` + `z_future` excluded from routing + corpus stats
- [ ] Anti-stuffing caps enforced before derived lane contributes to scoring

## P1 (Required)
- [ ] Provenance fingerprint per skill invalidates derived rows on change
- [ ] Age haircut applied to derived lane only (advisor-side)
- [ ] DF/IDF corpus stats recomputed on startup + debounced
- [ ] Rollback tooling verified via test
- [ ] Lifecycle fixtures exported for 027/003

## P2 (Suggestion)
- [ ] Commit-message signal integration
- [ ] Adversarial fixture library growth
- [ ] Debounced DF/IDF warm-cache

## Integration / Regression
- [ ] Focused suite passes
- [ ] TS build OK
- [ ] 027/001 benchmark still passes (≤1% CPU / <20MB RSS)
- [ ] No regressions in 200-prompt corpus parity

## Research conformance
- [ ] B1 deterministic local extraction; no commit messages in first slice
- [ ] B2 hybrid pipeline: explicit + n-gram/pattern + corpus-aware DF/IDF
- [ ] B3 write to `graph-metadata.json.derived`; never overwrite frontmatter
- [ ] B4 trust-lane separation + caps + haircuts + corpus precision checks
- [ ] B5 A3 graph + content-hash authority; mtimes are wake signals only
- [ ] B6 DF/IDF recomputed on startup + graph debounced changes
- [ ] B7 anti-stuffing lanes + demotions
- [ ] F1 age/status haircuts on derived lane only
- [ ] F2 asymmetric supersession routing
- [ ] F3 mixed-version v1/v2 reads + daemon additive backfill
- [ ] F4 reversible rollback
- [ ] F5 z_archive/z_future indexed but not routed
- [ ] Y1 lifecycle backfill fits daemon control plane
- [ ] Y3 lifecycle-normalized inputs exposed for 027/003
