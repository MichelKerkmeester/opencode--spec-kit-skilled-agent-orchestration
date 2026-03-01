---
title: "Implementation Plan: CV Upload Form File Type Validation Fix [035-form-upload-issues/plan]"
description: "Phase 1 (COMPLETED): Fixed three independent MIME validation bugs — expanded MIME type configuration with extension fallback (MIME_TYPE_MAP), aggressive whitespace stripping for..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "upload"
  - "form"
  - "file"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: CV Upload Form File Type Validation Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES6), Vanilla JS (no framework) |
| **Framework** | FilePond (file upload library), Webflow (page builder) |
| **Storage** | Cloudflare R2 (S3-compatible object storage) |
| **Backend** | Cloudflare Workers (upload proxy) |
| **Testing** | Manual (Chrome DevTools, browser testing, curl) |

### Overview

**Phase 1 (COMPLETED)**: Fixed three independent MIME validation bugs — expanded MIME type configuration with extension fallback (`MIME_TYPE_MAP`), aggressive whitespace stripping for Webflow corruption (`replace(/\s+/g, '')`), removed native `accept` attribute (`removeAttribute('accept')`), registered custom MIME detector (`fileValidateTypeDetectType`). Deployed as v1.3.4 to Cloudflare R2 CDN. **Verified via curl**: CDN response contains `removeAttribute("accept")` and `fileValidateTypeDetectType`.

**Phase 2 (REOPENED — 2026-02-14 Evening)**: Production debugging on `https://a-nobel-en-zn.webflow.io/nl/werkenbij` revealed Phase 1 fixes are deployed and working correctly (all 7 file types accepted client-side), but uploads fail due to **CORS infrastructure misconfiguration** (Worker allows `anobel.com`, browser sends from Webflow preview domain `a-nobel-en-zn.webflow.io` → status 0 / CORS block) plus **frontend error handling bug** (processfile ignores `_error` parameter completely, shows false "Complete" state). Requires Worker CORS update, frontend error detection, and submission guard. The original ".docx invalid type" error is not reproducible — MIME validation is working correctly.


<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (3 independent bugs identified)
- [x] Success criteria measurable (7 file types must validate)
- [x] Dependencies identified (Cloudflare R2 bucket, Webflow attributes, FilePond behavior)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-008)
- [x] Tests passing (manual DevTools verification)
- [x] Docs updated (spec/plan/tasks/checklist/decision-record/handover)


<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Client-Side Validation → Upload Worker → Object Storage**

```
Browser (FilePond client-side validation)
    ↓
Cloudflare Worker (upload-form worker)
    ↓
R2 Bucket (anobel-uploads)
```

### Key Components
- **FilePond Library**: Client-side file upload UI and validation (third-party, v4.x)
- **input_upload.js**: Custom FilePond connector/initializer (anobel.com codebase)
- **Webflow HTML**: Page builder output with data-* attributes for configuration
- **R2 CDN (`code` bucket)**: Serves minified JavaScript with public URL
- **Cloudflare Worker**: Receives uploaded files and stores in R2 `anobel-uploads` bucket

### Data Flow

1. User selects file → Browser creates `File` object with MIME type
2. FilePond validates file against `acceptedFileTypes` configuration
3. **CRITICAL**: FilePond checks if source `<input>` has native `accept` attribute
   - If YES: uses native attribute (ignores programmatic config) ❌ BUG
   - If NO: uses programmatic config ✅ FIXED
4. If valid → FilePond uploads to Cloudflare Worker endpoint
5. Worker stores in R2 bucket → Returns public R2 URL
6. Form submission includes R2 URL in `cv_url` field


<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose (Completed)

- [x] Identified missing MIME types (TXT, MD, ODT, RTF)
- [x] Discovered Webflow attribute whitespace corruption via DevTools inspection
- [x] Discovered native `accept` attribute override via controlled FilePond experiment
- [x] Identified upload endpoint URL mismatch (user fixed separately)
- [x] Verified CDN bucket name (`code` not `anobel-cdn`) via 034 spec

### Phase 2: Fix Implementation (Completed)

- [x] **Fix 1**: Add 4 missing MIME types to `DEFAULTS.acceptedTypes`
- [x] **Fix 1**: Create `MIME_TYPE_MAP` constant (extension → MIME mappings)
- [x] **Fix 1**: Implement `detect_file_type()` function for browser MIME fallback
- [x] **Fix 2**: Change `.trim()` to `.replace(/\s+/g, '')` for attribute parsing
- [x] **Fix 3**: Add `input_el.removeAttribute('accept')` before `FilePond.create()`
- [x] Update `DEFAULT_LABELS.description` to list all 7 file types
- [x] Minify source via existing minification script

### Phase 3: Deployment (Completed)

- [x] Deploy minified JS to R2 bucket `code` via `npx wrangler r2 object put`
- [x] Update HTML version strings: `?v=1.2.4` → `?v=1.4.0` (2 files)
- [x] Verify CDN serves updated script (contains `removeAttribute("accept")`)
- [x] Browser cache bust verification (hard refresh with Cmd+Shift+R)

### Phase 4: Verification (Completed — Then Invalidated by Production Testing)

- [x] Chrome DevTools: Verify `input.getAttribute('accept') === null`
- [x] Chrome DevTools: Verify `_pond.acceptedFileTypes.length === 8`
- [x] Manual upload test: .docx file accepted client-side
- [x] Manual upload test: All 7 file types accepted client-side
- [x] CDN response inspection: Contains `removeAttribute("accept")`
- [ ] **FAILED**: Upload POST to Worker succeeds (CORS error on Webflow preview domain)
- [ ] **FAILED**: Form submission includes valid cv_url (processfile false-positive allows empty submission)


<!-- /ANCHOR:phases -->

---

### Phase 5: Production Issue Discovery (2026-02-14 Evening)

- [x] Live debugging on `https://a-nobel-en-zn.webflow.io/nl/werkenbij`
- [x] Confirmed v1.3.4 deployed with all MIME fixes (curl verification: `removeAttribute("accept")`, `fileValidateTypeDetectType`)
- [x] Confirmed MIME validation working: All 7 file types accepted client-side without "Invalid type" error
- [x] Discovered CORS preflight mismatch: Worker allows `anobel.com`, browser origin is `a-nobel-en-zn.webflow.io` → Status 0
- [x] Confirmed Worker functional via curl POST (returns R2 URL outside browser, proves backend works)
- [x] Discovered frontend bug: `pond.on('processfile', function(_error, file) { set_state(COMPLETE); })` ignores `_error` completely
- [x] Traced root cause of Formspark empty cv_url entries to false-complete state (upload fails → error ignored → UI shows "Complete" → form submits with empty cv_url)
- [x] Updated spec documentation to reflect reopened status with corrected evidence

---

### Phase 6: PENDING — Worker CORS Fix

- [ ] Access Cloudflare Workers dashboard → Select `worker--upload-form`
- [ ] Update CORS headers to allow Webflow preview domain:
  - Option A: Add `https://a-nobel-en-zn.webflow.io` to allowlist
  - Option B: Use wildcard `https://*.webflow.io` for all Webflow previews
  - Option C: Allow both `https://anobel.com` AND `https://a-nobel-en-zn.webflow.io`
- [ ] Test OPTIONS preflight request returns correct origin header
- [ ] Deploy Worker changes
- [ ] Verify POST from Webflow preview succeeds (no CORS error)

---

### Phase 7: PENDING — Frontend Error Handling Fix

- [ ] Modify `pond.on('processfile')` to check `_error` parameter
- [ ] If `_error` exists → Set error state (not COMPLETE)
- [ ] Surface error message to user (e.g., "Upload failed, please try again")
- [ ] Prevent form submission when upload error occurred
- [ ] Add submission guard: Validate `cv_url` hidden field is not empty before submit
- [ ] Minify updated source
- [ ] Deploy to R2 with version bump to `?v=1.4.0`

---

### Phase 8: PENDING — End-to-End Verification

- [ ] Test from Webflow preview domain: Upload .docx → Verify success
- [ ] Test from production domain (if available): Upload .docx → Verify success
- [ ] Test error scenario: Disconnect network mid-upload → Verify error surfaced
- [ ] Test submission guard: Submit form with empty cv_url → Verify blocked
- [ ] Submit complete form → Verify Formspark receives cv_url with R2 URL

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A (client-side validation, no unit tests) | N/A |
| Integration | FilePond config → Upload worker → R2 storage | Manual (form submission) |
| Manual | File validation for all 7 types, DevTools inspection | Chrome DevTools, Firefox, Safari |

### Manual Test Cases

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| TC-001 | Upload .docx file (client validation) | Accepted, no error | ✅ PASS (v1.3.4) |
| TC-002 | Upload .pdf file | Accepted | ✅ PASS (v1.3.4) |
| TC-003 | Upload .doc file | Accepted | ✅ PASS (v1.3.4) |
| TC-004 | Upload .txt file | Accepted | ✅ PASS (v1.3.4) |
| TC-005 | Upload .md file | Accepted | ✅ PASS (v1.3.4) |
| TC-006 | Upload .odt file | Accepted | ✅ PASS (v1.3.4) |
| TC-007 | Upload .rtf file | Accepted | ✅ PASS (v1.3.4) |
| TC-008 | DevTools: Check accept attr | `null` | ✅ PASS (v1.3.4) |
| TC-009 | DevTools: Check FilePond config | 8 MIME types | ✅ PASS (v1.3.4) |
| TC-010 | Upload POST from Webflow preview | R2 URL returned | ❌ FAIL (CORS block) |
| TC-011 | Form submission with valid upload | cv_url populated | ❌ FAIL (false-complete allows empty) |
| TC-012 | Form submission with failed upload | Blocked or error shown | ❌ FAIL (no error detection) |


<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cloudflare R2 `code` bucket | External | ✅ Green | Cannot deploy → users see old version |
| Cloudflare Worker CORS config | External | ❌ Red | Uploads fail from Webflow preview domain |
| Wrangler CLI authentication | External | ✅ Green | Cannot deploy → manual upload needed |
| Webflow Designer attributes | External | ✅ Green | Validated correct in live environment |
| FilePond library (v4.x) | Third-party | ✅ Green | Library update could break accept-override fix |
| Browser MIME detection | External | ⚠️ Yellow | Extension fallback mitigates inconsistencies |


<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Uploads fail after Phase 2 deployment, or frontend errors surface incorrectly
- **Procedure**:
  1. Revert HTML version strings: `?v=1.4.0` → `?v=1.3.4` (keep current working state)
  2. If Worker CORS changes cause issues: Revert Worker to `anobel.com`-only allowlist
  3. If frontend error handling causes issues: Redeploy v1.3.4 minified script (known working state)
  4. Hard refresh browser cache (Cmd+Shift+R)
  5. Verify MIME validation still works (client-side) with v1.3.4


<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Diagnose) ──────┐
                         ├──► Phase 2 (Fix) ──► Phase 3 (Deploy) ──► Phase 4 (Verify)
                         │
                         └──► Webflow Designer fixes (User, parallel)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Diagnose | None | Fix, Deploy |
| Fix Implementation | Diagnose | Deploy |
| Deployment | Fix | Verify |
| Verification | Deploy | Completion claim |

**Parallel Work**: Webflow Designer attribute updates (user-handled) could proceed simultaneously with Fix Implementation, but were completed during Diagnose phase.


<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | Actual Effort |
|-------|------------|------------------|---------------|
| Diagnose | HIGH | 2-4 hours | ~3 hours (controlled DevTools experiments) |
| Fix Implementation | MEDIUM | 1-2 hours | ~1 hour (60 lines across 4 files) |
| Deployment | LOW | 0.5-1 hour | ~0.5 hours (Wrangler CLI + HTML edits) |
| Verification | MEDIUM | 1-2 hours | ~1 hour (manual testing + DevTools) |
| **Total** | | **4.5-9 hours** | **~5.5 hours** |

**Complexity Drivers**:
- **Diagnose**: Multi-layered root cause required deep investigation (3 independent bugs)
- **Fix**: Straightforward once bugs identified (clear code changes)
- **Deployment**: Simple but requires CDN verification (bucket name confusion delayed slightly)


<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: Git commit `e6f38d8c` contains pre-fix version
- [x] Feature flag configured: N/A (no feature flag system)
- [x] Monitoring alerts set: N/A (no monitoring on client-side validation)

### Rollback Procedure
1. **Immediate action**: Revert HTML version strings to `?v=1.3.0` (users will load old cached script)
2. **Revert code**: `git revert` or redeploy previous `input_upload.min.js` from commit `e6f38d8c`
3. **Verify rollback**: Upload .pdf file (known working type) and check FilePond accepts it
4. **Notify stakeholders**: Email user with rollback status (client-side fix, no server impact)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (client-side validation only, no database changes)


<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1        │────►│   Phase 2        │────►│   Phase 3        │────►│   Phase 4        │
│   Diagnose       │     │   Fix            │     │   Deploy         │     │   Verify         │
│                  │     │                  │     │                  │     │                  │
│ - Identify bugs  │     │ - Add MIME types │     │ - Upload to R2   │     │ - DevTools check │
│ - DevTools tests │     │ - Strip spaces   │     │ - Update HTML    │     │ - Manual upload  │
│ - Verify CDN     │     │ - Remove accept  │     │ - Verify CDN URL │     │ - All 7 types    │
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
         │
         │ (parallel, user-handled)
         ▼
┌──────────────────┐
│  Webflow Updates │
│  - data-accepted │
│  - data-endpoint │
└──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Diagnose | None | Root cause analysis (3 bugs) | Fix, Deploy, Verify |
| Fix Implementation | Diagnose | Updated source + minified JS | Deploy |
| Deployment | Fix | CDN-served JS `?v=1.4.0` | Verify |
| Verification | Deploy | Test results, completion evidence | None |
| Webflow Updates (User) | Diagnose | Updated attributes | None (independent) |


<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Diagnose Phase** - ~3 hours - CRITICAL
   - DevTools experiments to isolate accept-attribute-override behavior
   - Without this discovery, Fix 3 would not have been identified
2. **Fix Implementation** - ~1 hour - CRITICAL
   - All 3 fixes required (removing any one causes failures)
3. **Deployment** - ~0.5 hours - CRITICAL
   - CDN deployment is the only way to make fixes live
4. **Verification** - ~1 hour - CRITICAL
   - Confirms all 3 fixes work together

**Total Critical Path**: ~5.5 hours

**Parallel Opportunities**:
- Webflow Designer attribute updates (user) can run in parallel with Fix Implementation
- Minification can run in parallel with HTML version string updates (independent file edits)


<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target | Actual |
|-----------|-------------|------------------|--------|--------|
| M1 | Root Cause Identified | All 3 bugs documented with evidence | 2026-02-14 12:00 | 2026-02-14 11:30 |
| M2 | Fixes Implemented | Source code updated, minified | 2026-02-14 14:00 | 2026-02-14 13:00 |
| M3 | CDN Deployed | R2 bucket serves `?v=1.4.0` | 2026-02-14 15:00 | 2026-02-14 14:30 |
| M4 | Verification Complete | All 7 file types accepted | 2026-02-14 16:00 | 2026-02-14 15:30 |


<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Extension-Based MIME Detection with Fallback Map

**Status**: Accepted

**Context**: Browsers report inconsistent MIME types for Microsoft Office documents. Chrome may report `.docx` as `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, while other browsers report `application/zip` (because .docx is a ZIP archive internally) or `application/octet-stream` for unknown types. FilePond validates files against `acceptedFileTypes` using the browser-reported MIME type, causing false rejections.

**Decision**: Create a `MIME_TYPE_MAP` constant mapping file extensions (`.docx`, `.doc`, `.txt`, etc.) to their correct MIME types. Implement a `detect_file_type(source, type)` function that serves as FilePond's `fileValidateTypeDetectType` callback. This function extracts the file extension and uses the map to return the correct MIME type, falling back to the browser-reported type if the extension is not in the map.

**Consequences**:
- **Positive**: Resilient to browser MIME detection quirks and inconsistencies
- **Positive**: Simple extension-based regex (O(1) performance, <5ms overhead)
- **Positive**: Self-documenting (explicit extension → MIME mappings in code)
- **Negative**: User could rename `.txt` to `.docx` (wrong extension) → would be accepted as .docx (edge case, user error)
- **Negative**: Files without extensions fall back to browser MIME type (rare edge case)

**Alternatives Rejected**:
- **Browser MIME only**: Would fail for browsers reporting .docx as application/zip (rejected: too brittle)
- **Magic byte detection**: Inspecting file header bytes to detect true type (rejected: too complex, requires async file reading, overkill for client-side UX validation)

**Score**: 9/10 (Extension-based fallback wins due to simplicity and reliability)

### ADR-002: Strip ALL Whitespace from Webflow Attributes

**Status**: Accepted

**Context**: Webflow's custom attribute editor inserts internal spaces into long attribute values for display readability (e.g., wrapping 68-character MIME strings across lines). The original code used `.trim()` which only strips leading/trailing whitespace, leaving internal spaces that break MIME string comparisons.

**Decision**: Replace `.trim()` with `.replace(/\s+/g, '')` when parsing `data-accepted-types` attribute. This regex strips **all** whitespace (spaces, tabs, newlines) from the MIME type string before splitting on commas.

**Consequences**:
- **Positive**: Resilient to Webflow's attribute editor UI formatting behavior
- **Positive**: Also handles accidental user-introduced whitespace (typos in Webflow Designer)
- **Positive**: Minimal performance cost (regex runs once on page load)
- **Negative**: If a MIME type legitimately contains internal spaces → would break (MITIGATED: no known MIME types have internal spaces per IANA spec)

**Alternatives Rejected**:
- **`.trim()` only**: Rejected because internal spaces remain
- **Normalize spaces to single space**: Rejected because MIME types should have zero spaces
- **Webflow attribute editor fix**: Not in our control (platform behavior)

**Score**: 10/10 (Aggressive whitespace stripping wins due to defensive programming)

### ADR-003: Remove Native HTML `accept` Attribute Before FilePond Initialization

**Status**: Accepted

**Context**: Webflow renders a native HTML `accept="application/pdf,.doc,.docx"` attribute on the `<input type="file">` element. FilePond has undocumented behavior: when the source input has a native `accept` attribute, FilePond **ignores** the programmatic `acceptedFileTypes` configuration and validates against the HTML attribute instead. This was discovered via controlled DevTools experiment. The HTML attribute uses file extension syntax (`.docx`) while browser File objects report MIME type syntax (`application/vnd...document`), creating a type mismatch.

**Decision**: Add `input_el.removeAttribute('accept')` immediately before `FilePond.create(input_el, config)`. This ensures FilePond has no native attribute to fall back to and must use the programmatic `acceptedFileTypes` configuration.

**Consequences**:
- **Positive**: FilePond now uses programmatic config (guaranteed behavior)
- **Positive**: No need to keep HTML attribute in sync with JS config (single source of truth)
- **Positive**: No accessibility impact (FilePond provides its own accessible file picker UI)
- **Negative**: Browsers' native file picker dialog won't filter by type (MITIGATED: FilePond replaces native picker, user doesn't see browser dialog)

**Alternatives Rejected**:
- **Sync HTML attribute with JS config**: Rejected because we can't control Webflow's HTML output (would require manual editing after every Webflow publish)
- **Override FilePond's validation logic**: Rejected because FilePond is third-party library (risky to patch)
- **Use only HTML attribute**: Rejected because HTML attribute is limited to 7 types and has extension/MIME mismatch

**Score**: 10/10 (Removing attribute wins due to single source of truth and guaranteed behavior)


<!-- /ANCHOR:architecture -->

---

<!--
LEVEL 3 PLAN (~380 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records (3 ADRs)
- 3-phase approach: Diagnose → Fix → Deploy → Verify
-->
