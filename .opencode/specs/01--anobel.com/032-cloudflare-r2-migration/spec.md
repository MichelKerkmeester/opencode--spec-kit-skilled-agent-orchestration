---
title: "Spec: Cloudflare R2 + Worker Migration [034-cloudflare-r2-migration/spec]"
description: "Created: 2026-02-14"
trigger_phrases:
  - "spec"
  - "cloudflare"
  - "worker"
  - "migration"
  - "034"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Cloudflare R2 + Worker Migration

**Created:** 2026-02-14
**Level:** 1

---

<!-- ANCHOR:scope -->
## Scope

Create a step-by-step Cloudflare Dashboard setup guide for migrating the upload proxy Worker and R2 storage from the personal `cloudflare-decorated911` account to A. Nobel's company Cloudflare account.

<!-- /ANCHOR:scope -->

## Deliverables

| # | Deliverable | File |
|---|-------------|------|
| 1 | Cloudflare Dashboard setup guide | `cloudflare-setup-guide.md` |

## Current State

- **Upload Worker:** `r2-upload-proxy.cloudflare-decorated911.workers.dev` (personal account)
- **CDN bucket:** `pub-85443b585f1e4411ab5cc976c4fb08ca.r2.dev` (personal account)
- **20 files** reference these URLs (18 HTML + 2 JS)

## Out of Scope

- Actual URL replacement in codebase files (separate task after new account is set up)
- DNS/domain configuration
- Custom domain setup for Worker or R2
