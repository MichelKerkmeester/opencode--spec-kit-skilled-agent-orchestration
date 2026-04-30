---
title: Error Recovery Workflows
description: Recovery procedures for common deployment and build failures
keywords: [error-recovery, cdn, minification, version-mismatch, troubleshooting]
---

# Error Recovery Workflows

Recovery procedures for common frontend deployment failures.

---

## 1. OVERVIEW

### Purpose

Provides systematic recovery workflows for common deployment failures including CDN uploads, minification issues, and version mismatches.

### When to Use

- CDN upload fails or file not accessible
- Minification produces syntax errors or runtime breaks
- Browser loads old cached version instead of new changes
- Any deployment failure requiring systematic recovery

### Core Principle

Document → Isolate → Verify prerequisites → Retry with verbose → Escalate if 3+ attempts fail.

---

## 2. CDN UPLOAD FAILURE RECOVERY

**Symptoms:** Upload to Cloudflare R2 fails, file not accessible via CDN URL

**Recovery Steps:**
1. Verify R2 credentials: `wrangler whoami`
2. Check bucket exists: `wrangler r2 bucket list`
3. Retry upload with verbose: `wrangler r2 object put [bucket]/[path] --file [local-file] --verbose`
4. If persistent, check Cloudflare dashboard for rate limits
5. Verify file accessible: `curl -I https://cdn.example.com/[path]`

**Verification:**
```bash
# Check file is accessible and correct size
curl -sI https://cdn.example.com/js/[filename].js | grep -E "(HTTP|content-length)"
```

---

## 3. MINIFICATION FAILURE RECOVERY

**Symptoms:** Terser fails, minified file has syntax errors, runtime breaks

**Recovery Steps:**
1. Run verification first: `node scripts/verify-minification.mjs [file].js`
2. Check for ES6+ syntax issues in source
3. Test original file works: Open in browser, check console
4. Re-run minification with source maps: Add `--source-map` flag
5. If persistent, isolate problematic function with binary search

**Verification:**
```bash
# Run full verification pipeline
node scripts/verify-minification.mjs src/javascript/[file].js
node scripts/test-minified-runtime.mjs dist/[file].min.js
```

---

## 4. VERSION MISMATCH RECOVERY

**Symptoms:** Browser loads old cached version, changes not visible

**Recovery Steps:**
1. Check current version in HTML: `grep -n "v=" src/html/global.html | head -5`
2. Check CDN file version: `curl -sI https://cdn.example.com/js/[file].js?v=[version]`
3. Increment version in ALL HTML files referencing the JS
4. Hard refresh browser: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
5. Clear CDN cache if needed: Cloudflare dashboard > Caching > Purge

**Verification:**
```bash
# Verify version updated in all HTML files
grep -r "v=[NEW_VERSION]" src/html/ | wc -l
# Should match number of files referencing the JS
```

---

## 5. GENERAL RECOVERY PROTOCOL

When any failure occurs:

1. **Document** the failure (error message, context)
2. **Isolate** the problem (single file, single change)
3. **Verify** prerequisites (tools installed, credentials valid)
4. **Retry** with verbose output
5. **Escalate** if 3+ attempts fail (see SKILL.md escalation rules)

---

## 6. RELATED RESOURCES

- [cdn_deployment.md](../deployment/cdn_deployment.md) - CDN deployment workflow
- [minification_guide.md](../deployment/minification_guide.md) - Minification procedures
- [debugging_workflows.md](./debugging_workflows.md) - General debugging
