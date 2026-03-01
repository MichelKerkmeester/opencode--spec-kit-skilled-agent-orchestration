---
title: "Tasks: Finsweet Performance Optimization [001-finsweet-performance/tasks]"
description: "tasks document for 001-finsweet-performance."
trigger_phrases:
  - "tasks"
  - "finsweet"
  - "performance"
  - "optimization"
  - "001"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Finsweet Performance Optimization

<!-- ANCHOR:us-001-deferred-finsweet-loading -->
## US-001: Deferred Finsweet Loading

### Task 1: Fix cms/werken_bij.html
- [ ] Remove line 19: `<script async src="...cmsnest.js"></script>`
- [ ] Add deferred cmsnest script in FOOTER section

### Task 2: Fix cms/blog_template.html
- [ ] Remove lines 17-18: `<script async type="module"...fs-socialshare></script>`
- [ ] Add deferred attributes script with fs-socialshare in FOOTER section

### Task 3: Fix cms/vacature.html
- [ ] Remove line 16: `<script async type="module"...fs-socialshare></script>`
- [ ] Add deferred attributes script with fs-socialshare in FOOTER section

### Task 4: Fix cms/blog.html
- [ ] Remove line 15: `<script async type="module"...fs-list></script>`
- [ ] Add deferred attributes script with fs-list in FOOTER section

### Task 5: Fix nobel/n4_het_team.html
- [ ] Remove line 20: `<script async type="module"...fs-list></script>`
- [ ] Add deferred attributes script with fs-list in FOOTER section

### Task 6: Fix home.html
- [ ] Remove line 20: `<script async src="...cmsnest.js"></script>`
- [ ] Add deferred cmsnest script in FOOTER section
<!-- /ANCHOR:us-001-deferred-finsweet-loading -->

<!-- ANCHOR:verification -->
## Verification
- [ ] All Finsweet features work correctly
- [ ] PageSpeed score improvement measured
<!-- /ANCHOR:verification -->
