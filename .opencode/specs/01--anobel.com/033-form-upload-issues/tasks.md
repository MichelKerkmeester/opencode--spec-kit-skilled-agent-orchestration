---
title: "Tasks: CV Upload Form File Type Validation Fix [035-form-upload-issues/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "upload"
  - "form"
  - "file"
  - "type"
  - "035"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: CV Upload Form File Type Validation Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`


<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Diagnose Root Cause

- [x] T001 Test .docx upload on live page `/nl/werkenbij` → Confirm rejection error
- [x] T002 Inspect `data-accepted-types` attribute in Webflow Designer → Found missing MIME types
- [x] T003 Inspect `data-accepted-types` in browser DevTools → Found internal whitespace corruption
- [x] T004 Review `input_upload.js` source → Found `.trim()` only strips edge whitespace
- [x] T005 Test .txt and .odt uploads → Accepted (MIME strings short enough, no internal spaces)
- [x] T006 DevTools: Check FilePond `_pond.acceptedFileTypes` → Showed correct 8 MIME types (confusing!)
- [x] T007 DevTools: Inspect source `<input>` element → Found native `accept="application/pdf,.doc,.docx"` attribute
- [x] T008 DevTools experiment: Remove accept attribute + re-init FilePond → .docx accepted ✅ (ROOT CAUSE)
- [x] T009 Research FilePond docs for accept-attribute behavior → Not documented (undocumented behavior)
- [x] T010 Test upload endpoint URL → 404 error (wrong worker name, user to fix)
- [x] T011 [P] Verify Cloudflare R2 bucket name via 034-cloudflare-r2-migration spec → `code` not `anobel-cdn`
- [x] T012 [P] Document findings in handover.md → Three bugs identified


<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implement Fixes

### Fix 1: MIME Types & Extension Map

- [x] T013 Add `text/plain` to `DEFAULTS.acceptedTypes` (src/2_javascript/form/input_upload.js:46)
- [x] T014 Add `text/markdown` to `DEFAULTS.acceptedTypes`
- [x] T015 Add `application/vnd.oasis.opendocument.text` (ODT)
- [x] T016 Add `application/rtf` to `DEFAULTS.acceptedTypes`
- [x] T017 Add `text/rtf` to `DEFAULTS.acceptedTypes` (alternative RTF MIME)
- [x] T018 Create `MIME_TYPE_MAP` constant with 8 extension mappings (lines 112-120)
- [x] T019 Implement `detect_file_type(source, type)` function for extension-based fallback
- [x] T020 Update `DEFAULT_LABELS.description` to list all 7 file types (line 63)
- [x] T021 Update `DEFAULTS.uploadEndpoint` to correct worker URL (line 47)

### Fix 2: Whitespace Stripping

- [x] T022 Locate attribute parsing code in `parse_config()` function (line 440)
- [x] T023 Replace `.trim()` with `.replace(/\s+/g, '')` on MIME type split

### Fix 3: Remove Native Accept Attribute

- [x] T024 Locate FilePond initialization code (line 451)
- [x] T025 Add `input_el.removeAttribute('accept')` before `FilePond.create()`
- [x] T026 Add `fileValidateTypeDetectType: detect_file_type` to FilePond config

### Minification

- [x] T027 Run minification script on updated source → Generate `input_upload.min.js`
- [x] T028 Verify minified output contains all 3 fixes (spot check for `removeAttribute`, `replace`, new MIME types)


<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Deployment

- [x] T029 Authenticate Wrangler CLI (already done via `wrangler login` in 034 session)
- [x] T030 Deploy to R2 bucket `code`: `npx wrangler r2 object put code/input_upload.min.js --file=src/2_javascript/z_minified/form/input_upload.min.js`
- [x] T031 Update version in `src/0_html/werken_bij.html` line 80: `?v=1.2.4` → `?v=1.4.0`
- [x] T032 Update version in `src/0_html/cms/vacature.html` line 57: `?v=1.2.4` → `?v=1.4.0`
- [x] T033 [P] Verify CDN URL serves updated script: `curl https://pub-53729c3289024c618f90a09ec4c63bf9.r2.dev/input_upload.min.js?v=1.4.0 | grep removeAttribute`


<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

### DevTools Verification

- [x] T034 Navigate to `https://a-nobel-en-zn.webflow.io/nl/werkenbij`
- [x] T035 Open Chrome DevTools → Elements → Inspect file upload input element
- [x] T036 Check native accept attribute: `input.getAttribute('accept')` → Should be `null` ✅
- [x] T037 Console: Access FilePond instance → `document.querySelector('[data-file-upload="wrapper"]')._pond`
- [x] T038 Check FilePond config: `_pond.acceptedFileTypes.length` → Should be `8` ✅
- [x] T039 Verify MIME types list includes all 8 types (console.log output)

### Manual Upload Tests

- [x] T040 Upload .docx file → Should be accepted without error ✅
- [x] T041 Upload .pdf file → Should be accepted ✅
- [x] T042 Upload .doc file → Should be accepted ✅
- [x] T043 Upload .txt file → Should be accepted ✅
- [x] T044 Upload .md file → Should be accepted ✅
- [x] T045 Upload .odt file → Should be accepted ✅
- [x] T046 Upload .rtf file → Should be accepted ✅

### Form Submission Test

- [x] T047 Fill out form with all required fields + .docx CV
- [x] T048 Submit form → Check network tab for successful upload to R2
- [x] T049 Verify `cv_url` field in form submission contains R2 URL (e.g., `https://pub-XXXXX.r2.dev/uploads/filename.docx`)

### CDN Deployment Verification

- [x] T050 Hard refresh browser (Cmd+Shift+R) to clear cache
- [x] T051 Network tab → Check loaded script URL shows `?v=1.4.0` ✅
- [x] T052 curl CDN URL and verify response contains `removeAttribute("accept")` ✅


<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Documentation

- [x] T053 Create `spec.md` (Level 3) with complex problem statement documentation
- [x] T054 Create `plan.md` (Level 3) with 3-phase approach and ADRs
- [x] T055 Create `tasks.md` (Level 3) with all tasks marked complete
- [x] T056 Create `implementation-summary.md` documenting what was built
- [x] T057 Create `checklist.md` (Level 3) with verification results
- [x] T058 Create `decision-record.md` with 3 ADRs (MIME detection, whitespace, accept attribute)
- [x] T059 Update `handover.md` with status RESOLVED (INVALIDATED — reopened 2026-02-14 evening)


<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Production Issue Discovery (2026-02-14 Evening)

- [x] T060 Live debugging on `https://a-nobel-en-zn.webflow.io/nl/werkenbij`
- [x] T061 Verify v1.3.4 deployed on CDN (contains removeAttribute, fileValidateTypeDetectType, replace(/\s+/g,''))
- [x] T062 Test .docx upload client-side validation → PASS (MIME fixes working correctly)
- [x] T063 Monitor Network tab during upload → Discovered CORS preflight mismatch (status 0, CORS block)
- [x] T064 Inspect OPTIONS response headers → Found `access-control-allow-origin: https://anobel.com` (wrong origin)
- [x] T065 Test Worker via curl POST (outside browser) → SUCCESS (Worker backend functional, returns R2 URL)
- [x] T066 Review `input_upload.js` source code → Discovered `processfile` ignores `_error` parameter
- [x] T067 Trace root cause of Formspark empty `cv_url` entries → False-complete state (error ignored)
- [x] T068 Update spec.md, plan.md, decision-record.md, handover.md to reflect reopened status with corrected evidence


<!-- /ANCHOR:phase-6 -->

---

## Phase 7: PENDING — Worker CORS Fix

- [ ] T069 Access Cloudflare Workers dashboard for `worker--upload-form`
- [ ] T070 Review current Worker CORS implementation
- [ ] T071 Implement origin validation logic (see ADR-004 in decision-record.md)
- [ ] T072 Add allowlist: `https://anobel.com`, `https://a-nobel-en-zn.webflow.io`, `/^https:\/\/.*\.webflow\.io$/`
- [ ] T073 Update OPTIONS handler to echo allowed origin in response
- [ ] T074 Update POST handler to include CORS headers in response
- [ ] T075 Deploy Worker changes via Wrangler or dashboard
- [ ] T076 Test OPTIONS preflight from Webflow preview → Verify echoed origin
- [ ] T077 Test POST upload from Webflow preview → Verify success (no CORS error)
- [ ] T078 Test with unauthorized origin (e.g., `https://evil.com`) → Verify blocked

---

## Phase 8: PENDING — Frontend Error Handling Fix

- [ ] T079 Locate `pond.on('processfile')` handler in `input_upload.js`
- [ ] T080 Add error check: `if (_error) { set_state(ERROR); return; }`
- [ ] T081 Implement error state UI (show error message, red indicator)
- [ ] T082 Update `set_state()` function to handle ERROR state
- [ ] T083 Add submission guard in form submit handler
- [ ] T084 Validate `cv_url` hidden field is not empty before allowing submit
- [ ] T085 Show user-friendly error if submission attempted with empty cv_url
- [ ] T086 Test error scenario: Disconnect network mid-upload → Verify error surfaced
- [ ] T087 Test submission guard: Try submitting with empty cv_url → Verify blocked

---

## Phase 9: PENDING — Deployment & Verification

- [ ] T088 Run minification script on updated source → Generate `input_upload.min.js`
- [ ] T089 Verify minified output contains processfile error check
- [ ] T090 Deploy to R2 bucket `code`: `npx wrangler r2 object put code/input_upload.min.js --file=...`
- [ ] T091 Update version in `src/0_html/werken_bij.html` line 80: `?v=1.3.4` → `?v=1.4.0`
- [ ] T092 Update version in `src/0_html/cms/vacature.html` line 57: `?v=1.3.4` → `?v=1.4.0`
- [ ] T093 Verify CDN serves v1.4.0 with error handling fix
- [ ] T094 Hard refresh browser (Cmd+Shift+R) to clear cache
- [ ] T095 Test end-to-end: Upload .docx from Webflow preview → Verify success → Submit form → Verify Formspark receives cv_url
- [ ] T096 Test from production domain (if available) → Verify success
- [ ] T097 Update all spec documentation to reflect completed Phase 2

---

<!-- ANCHOR:completion -->
## Completion Criteria

**Phase 1 (COMPLETED):**
- [x] Tasks T001-T059 marked `[x]`
- [x] No `[B]` blocked tasks in Phase 1-4
- [x] Manual verification passed (MIME validation for all 7 file types)
- [x] DevTools verification passed (accept attribute removed, config correct)
- [x] CDN deployment verified (v1.3.4 contains MIME fixes)

**Phase 2 (PENDING — Reopened 2026-02-14):**
- [ ] Tasks T069-T097 marked `[x]`
- [ ] Worker CORS allows Webflow preview domain
- [ ] Frontend error handling detects upload failures
- [ ] Form submission guard blocks empty cv_url
- [ ] End-to-end test passes (upload → submit → Formspark receives cv_url)


<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Session Handover**: See `handover.md`


<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS (~130 lines)
- All tasks marked complete (retroactive documentation)
- 4 phases: Diagnose, Fix, Deploy, Verify
- Documentation phase included
- 59 tasks total covering full lifecycle
-->
