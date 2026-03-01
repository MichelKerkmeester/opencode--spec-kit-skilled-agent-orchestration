---
title: "Feature Specification: CV Upload Form File Type Validation Fix [035-form-upload-issues/spec]"
description: "Level 3 (+Arch) is appropriate when"
trigger_phrases:
  - "feature"
  - "specification"
  - "upload"
  - "form"
  - "file"
  - "spec"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: CV Upload Form File Type Validation Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3 (+Arch) is appropriate when:
- Changes affect 500+ lines of code
- Architecture decisions need formal documentation (ADRs)
- Executive summary needed for stakeholders
- Risk matrix required
- 4-8 user stories
- Multiple teams or cross-functional work

This specification is Level 3 because:
- Multi-layered root cause requiring architectural understanding
- Cross-system debugging (Webflow → FilePond → Cloudflare → R2)
- Platform-specific undocumented behaviors requiring deep investigation
- Multiple interdependent fixes with complex deployment chain
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

**CURRENT STATUS (2026-02-14 Evening)**: Previously claimed RESOLVED, now REOPENED. Production debugging revealed the deployed script v1.3.4 already contains all MIME fixes (`removeAttribute('accept')`, `fileValidateTypeDetectType`, aggressive whitespace stripping), but uploads fail due to **CORS misconfiguration** (Worker allows `https://anobel.com`, browser sends from `https://a-nobel-en-zn.webflow.io`) + **frontend error handling bug** (`processfile` event ignores `_error` parameter, marks COMPLETE on failed uploads, allowing form submission with empty `cv_url`).

**Historical Context**: Initial investigation (2026-02-14 morning) identified three MIME validation bugs: (1) missing types + no extension fallback, (2) Webflow attribute whitespace corruption, (3) FilePond native `accept` attribute override. These were fixed in v1.3.4 and deployed successfully (confirmed via curl: CDN serves script with `removeAttribute('accept')` and `fileValidateTypeDetectType`). However, live testing revealed the MIME fixes are working, but uploads fail due to infrastructure issues discovered during production debugging.

**Current Root Cause**: Worker CORS policy blocks Webflow preview domain → Upload POST returns status 0 (network error, CORS block) → Frontend ignores `_error` parameter in `processfile` → UI shows false "Complete" → Form submits with empty `cv_url` → Formspark entries missing CV attachments.

**Note on ".docx invalid type" error**: Not reproducible in current controlled tests with v1.3.4 deployed. The original client-side MIME validation bugs are fixed. Current issue is upload failure (CORS) masked by false success state (error handling bug).

**Key Decisions (Original)**: Extension-based MIME detection, aggressive whitespace stripping, removal of native `accept` attribute.

**Pending Decisions**: CORS origin allowlist strategy (include both preview + production domains), frontend error state handling, submission guard validation.

**Live Script Status**: v1.3.4 on CDN contains all Phase 1 fixes: `removeAttribute('accept')`, `fileValidateTypeDetectType` custom MIME detector, aggressive whitespace stripping (`replace(/\s+/g, '')`). Verified via curl response inspection.


<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Reopened — CORS + error handling issues discovered in production |
| **Created** | 2026-02-14 |
| **Reopened** | 2026-02-14 (evening) |


<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement (Complex, Multi-Layered Bug — UPDATED 2026-02-14 Evening)

The CV upload form on the anobel.com careers page (`/nl/werkenbij`) was designed to accept seven file types (PDF, DOC, DOCX, TXT, MD, ODT, RTF) but was rejecting .docx files with a client-side validation error: "Ongeldig bestandstype" (Invalid file type). This appeared to be a simple MIME type configuration issue but investigation revealed **three independent bugs** operating simultaneously, each capable of causing the validation failure on its own.

#### Layer 1: Missing MIME Types & Extension Map

The `input_upload.js` FilePond connector had an incomplete file type configuration. The `DEFAULTS.acceptedTypes` constant was set to `'application/pdf,.doc,.docx'` — mixing MIME type syntax (`application/pdf`) with file extension syntax (`.doc`, `.docx`) and completely missing four of the seven required types (TXT, MD, ODT, RTF).

**Business Requirement**: Accept PDF, DOC, DOCX, TXT, MD, ODT, RTF
**Actual Configuration**: Only PDF, DOC, DOCX — missing TXT, MD, ODT, RTF

Additionally, browsers report inconsistent MIME types for Microsoft Office documents:
- Chrome may report `.docx` as `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Some browsers report `.docx` as `application/zip` (because .docx is a ZIP archive internally)
- Edge cases report `application/octet-stream` for unknown types

Without a MIME-to-extension mapping fallback, these browser inconsistencies would cause false rejections.

#### Layer 2: Webflow Attribute Editor Whitespace Corruption

Webflow's custom attribute editor has an undocumented behavior: when editing long attribute values, it silently inserts internal whitespace to wrap text for display readability. This is purely a UI presentation choice but the corrupted string is **persisted to the HTML output**.

**The Critical Bug**: The MIME type for .docx files is 68 characters long:
```
application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

Webflow's attribute editor broke this across lines and inserted spaces:
```
application/vnd.openxmlformats-officedocument.wordprocessingml.doc   ument
```

The original `input_upload.js` code used `.trim()` to clean attribute values, which only strips **leading and trailing** whitespace. The internal spaces remained, causing the MIME string comparison to fail even when the correct MIME type was configured.

**Evidence**: Testing `.txt` and `.odt` files succeeded because their MIME types (`text/plain`, `application/vnd.oasis.opendocument.text`) were short enough to fit on one line without Webflow inserting internal spaces.

#### Layer 3: Native HTML `accept` Attribute Override (ROOT CAUSE)

This was the most insidious bug and the true root cause. Webflow renders a native HTML `accept` attribute on the `<input type="file">` element:

```html
<input type="file" accept="application/pdf,.doc,.docx">
```

FilePond has **undocumented behavior**: when the source `<input>` element has a native `accept` attribute, FilePond **completely ignores** the programmatic `acceptedFileTypes` configuration passed to `FilePond.create()`. Instead, it uses the native HTML attribute for validation.

**Discovery Process**: This was discovered through a controlled experiment in Chrome DevTools:
1. Inspected the FilePond instance on the live page
2. Checked `_pond.acceptedFileTypes` → showed correct 8 MIME types
3. Manually uploaded .docx → still rejected
4. Inspected source `<input>` element → found `accept="application/pdf,.doc,.docx"`
5. Removed attribute via DevTools: `input.removeAttribute('accept')`
6. Re-initialized FilePond → .docx accepted ✅

**Why This Masked Fixes 1 & 2**: Even with the MIME types corrected (Fix 1) and whitespace stripped (Fix 2), .docx files would still fail because FilePond was reading from the stale HTML attribute (`accept="application/pdf,.doc,.docx"`), not the JavaScript configuration. The HTML attribute uses **file extension syntax** (`.docx`) while browser `File` objects report **MIME type syntax** (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`), creating a type mismatch.

#### Layer 4: CORS Preflight Mismatch (CURRENT BLOCKER — 2026-02-14 Evening)

**Discovery**: Live debugging on `https://a-nobel-en-zn.webflow.io/nl/werkenbij` revealed upload POST to `https://worker--upload-form.lorenzo-89a.workers.dev/` fails with CORS error:

- **Browser origin**: `https://a-nobel-en-zn.webflow.io` (Webflow preview domain)
- **Worker CORS header**: `access-control-allow-origin: https://anobel.com` (production domain only)
- **Preflight result**: Mismatch → Browser blocks POST → Status 0 (network error)

**Evidence**:
- Chrome DevTools Network tab shows OPTIONS request with response header `access-control-allow-origin: https://anobel.com`
- Browser console: CORS policy error
- POST request status: 0 (failed before reaching worker logic)
- Worker itself is functional: `curl -X POST [worker-url]` returns valid R2 URL (proves backend works)

**Impact**: File validation succeeds client-side (MIME fixes work), but upload fails silently due to CORS block. This is the **current production blocker**.

#### Layer 5: Frontend Error Handling Bug (CURRENT BLOCKER — 2026-02-14 Evening)

**Discovery**: Inspection of `input_upload.js` source code revealed critical error handling flaw:

```javascript
pond.on('processfile', function (_error, file) {
  // BUG: _error parameter is ignored
  set_state(COMPLETE); // Always sets COMPLETE, even when upload failed
  // ... rest of completion logic
});
```

**Consequences**:
- When upload fails (CORS error, network error, Worker error), FilePond calls `processfile` with `_error` populated
- Frontend ignores `_error` parameter → Sets UI state to COMPLETE regardless of failure
- User sees green checkmark + "Upload complete" even though upload failed
- Form submission proceeds with empty `cv_url` hidden field
- Formspark receives submission with `cv_url: ""` → No CV attachment

**Evidence**: This explains Formspark entries with empty `cv_url` fields.

#### Historical Issue: Upload Endpoint Configuration (RESOLVED)

During initial investigation, the upload endpoint URL was incorrect:

**Incorrect**: `https://worker--form-upload.lorenzo-89a.workers.dev` (wrong worker name)
**Correct**: `https://worker--upload-form.lorenzo-89a.workers.dev`

This was fixed directly in Webflow Designer by the user and is no longer an issue.

### Purpose

Enable applicants to submit CVs in all seven commonly-used document formats (PDF, DOC, DOCX, TXT, MD, ODT, RTF) on the anobel.com careers page without false "Invalid file type" rejections AND ensure successful upload to R2 storage with proper error handling. Success means:

1. ✅ **ACHIEVED**: 100% of valid file types pass client-side FilePond validation (v1.3.4 deployed)
2. ❌ **BLOCKED**: Uploads succeed from both Webflow preview (`a-nobel-en-zn.webflow.io`) and production (`anobel.com`) domains (CORS issue)
3. ❌ **BLOCKED**: Upload errors are detected and surfaced to user (frontend bug: `processfile` ignores `_error`)
4. ❌ **BLOCKED**: Form submission is blocked when `cv_url` is empty (no submission guard)


<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Phase 1 (COMPLETED — v1.3.4 deployed):**
- ✅ Add MIME types for TXT, MD, ODT, RTF to FilePond configuration
- ✅ Create extension-to-MIME fallback map for browser inconsistencies
- ✅ Strip ALL whitespace (not just trim) from Webflow attribute values
- ✅ Remove native HTML `accept` attribute before FilePond initialization
- ✅ Add custom MIME type detector using extension-based fallback
- ✅ Deploy to Cloudflare R2 CDN (`code` bucket) with version `?v=1.3.4`

**Phase 2 (PENDING — Reopened workstream):**
- ❌ Fix Worker CORS policy: Add Webflow preview domain to allowlist
- ❌ Fix frontend error handling: Check `_error` in `processfile` event handler
- ❌ Add submission guard: Validate `cv_url` is not empty before form submit
- ❌ Test on both Webflow preview (`a-nobel-en-zn.webflow.io`) and production (`anobel.com`)
- ❌ Update version to `?v=1.4.0` after fixes deployed

### Out of Scope
- Server-side validation in Cloudflare Worker (assumed correct based on curl test)
- Automated testing infrastructure (manual verification sufficient)
- Browser compatibility testing beyond Chrome (primary target)
- Webflow publish workflow automation (manual version updates acceptable)
- Historical .docx invalid-type error (not reproducible with v1.3.4 deployed; MIME validation working correctly)

### Files to Change

| File Path | Change Type | Description | Status |
|-----------|-------------|-------------|--------|
| `src/2_javascript/form/input_upload.js` | Modified | Phase 1: MIME types, whitespace, removeAttribute (~60 lines) | ✅ Done (v1.3.4) |
| `src/2_javascript/form/input_upload.js` | Modify | Phase 2: Fix `processfile` error handling (~5 lines) | ❌ Pending |
| `src/2_javascript/form/input_upload.js` | Modify | Phase 2: Add submission guard for `cv_url` validation (~10 lines) | ❌ Pending |
| Cloudflare Worker (`worker--upload-form`) | Modify | Phase 2: Update CORS allowlist to include Webflow preview domain | ❌ Pending |
| `src/2_javascript/z_minified/form/input_upload.min.js` | Regenerate | Minified version after Phase 2 changes | ❌ Pending |
| `src/0_html/werken_bij.html` | Modify | Update version `?v=1.3.4` → `?v=1.4.0` (line 80) | ❌ Pending |
| `src/0_html/cms/vacature.html` | Modify | Update version `?v=1.3.4` → `?v=1.4.0` (line 57) | ❌ Pending |


<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | All 7 file types accepted by FilePond | Upload .pdf, .doc, .docx, .txt, .md, .odt, .rtf → no "Invalid file type" error | ✅ PASS (v1.3.4) |
| REQ-002 | Native accept attribute removed | DevTools inspection shows `input.getAttribute('accept') === null` | ✅ PASS (v1.3.4) |
| REQ-003 | FilePond uses programmatic config | DevTools shows `_pond.acceptedFileTypes` contains 8 MIME types | ✅ PASS (v1.3.4) |
| REQ-004 | CDN serves v1.3.4 script | CDN response contains `removeAttribute("accept")` and `fileValidateTypeDetectType` | ✅ PASS (deployed) |
| REQ-005 | Worker CORS allows Webflow preview domain | OPTIONS response includes `access-control-allow-origin: https://a-nobel-en-zn.webflow.io` OR wildcard | ❌ FAIL (currently `https://anobel.com` only) |
| REQ-006 | Upload errors surfaced to user | When upload fails, UI shows error state (not false "Complete") | ❌ FAIL (processfile ignores _error) |
| REQ-007 | Form submission blocked when cv_url empty | Form submit handler validates cv_url is not empty before proceeding | ❌ FAIL (no guard exists) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-008 | Browser MIME inconsistencies handled | .docx reported as `application/zip` still accepted via extension fallback | ✅ PASS (v1.3.4) |
| REQ-009 | Whitespace corruption resilient | MIME strings with internal spaces stripped correctly | ✅ PASS (v1.3.4) |
| REQ-010 | Upload to R2 succeeds from Webflow preview | POST from `https://a-nobel-en-zn.webflow.io` succeeds, returns R2 URL | ❌ FAIL (CORS block) |
| REQ-011 | Upload to R2 succeeds from production | POST from `https://anobel.com` succeeds, returns R2 URL | ⚠️ ASSUMED (not tested) |


<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

**Phase 1 (COMPLETED):**
- **SC-001**: ✅ PASS — .docx files accepted without "Ongeldig bestandstype" error (v1.3.4 deployed)
- **SC-002**: ✅ PASS — All 7 file types (.pdf, .doc, .docx, .txt, .md, .odt, .rtf) accepted client-side
- **SC-003**: ✅ PASS — DevTools confirms `input.getAttribute('accept') === null` and `_pond.acceptedFileTypes.length === 8`
- **SC-004**: ✅ PASS — CDN `?v=1.3.4` response contains `removeAttribute("accept")` and `fileValidateTypeDetectType`

**Phase 2 (PENDING):**
- **SC-005**: ❌ PENDING — Upload from Webflow preview domain succeeds (no CORS error)
- **SC-006**: ❌ PENDING — Upload errors surface in UI (not false "Complete" state)
- **SC-007**: ❌ PENDING — Form submit blocked when cv_url is empty
- **SC-008**: ❌ PENDING — End-to-end test: Select .docx → Upload succeeds → Form submit includes valid R2 URL → Formspark receives cv_url


<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cloudflare R2 `code` bucket | Cannot deploy → users see old broken version | Verified bucket name via 034-cloudflare-r2-migration spec, tested upload with `npx wrangler r2 object put` |
| Dependency | Webflow Designer attribute config | If user sets `data-accepted-types` with wrong MIME strings → validation breaks again | Documented correct values in `scratch/webflow-attributes.md` |
| Risk | Browser MIME detection regression | Future browser updates change MIME type reporting → validation fails | Extension-based fallback via `detect_file_type` provides resilience |
| Risk | FilePond library update | Upgrading FilePond could change accept-attribute-override behavior | Pin FilePond version, test thoroughly before any library updates |
| Dependency | Wrangler CLI authentication | `npx wrangler` requires valid auth → deployment fails | User already authenticated via `wrangler login` in 034 session |


<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: MIME type validation adds <5ms to file selection (negligible impact, extension regex is O(1))

### Security
- **NFR-S01**: No secrets in client code (upload endpoint is public worker URL, acceptable)
- **NFR-S02**: Server-side validation still required (client-side validation is UX only, not security boundary)

### Reliability
- **NFR-R01**: Validation logic does not depend on external services (fully client-side, no network calls)


<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty file: FilePond has built-in empty file rejection (not in scope)
- Maximum file size: Controlled by `data-max-file-size` Webflow attribute (not in scope)
- Files without extensions: Extension-based fallback won't work → falls back to browser MIME type

### Error Scenarios
- Browser reports MIME as `application/octet-stream`: Extension fallback detects correct type
- Webflow attribute has internal spaces: `.replace(/\s+/g, '')` strips all whitespace
- User renames `.txt` to `.docx` (wrong extension): Browser MIME detection will fail → edge case not handled (user error)


<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 4, LOC: ~60, Systems: 3 (Webflow/FilePond/Cloudflare) |
| Risk | 20/25 | Platform-specific bugs, undocumented library behavior, CDN deployment |
| Research | 18/20 | Deep investigation: Chrome DevTools experiments, FilePond source code review, Webflow attribute editor behavior |
| Multi-Agent | 5/15 | Single-agent session, no parallel workstreams |
| Coordination | 12/15 | Dependencies: Webflow Designer changes (user), R2 bucket config (034 spec), CDN deployment chain |
| **Total** | **70/100** | **Level 3** |

**Rationale for Level 3**:
- Multi-layered root cause (3 independent bugs)
- Cross-system debugging requiring architectural understanding
- Platform-specific undocumented behaviors
- Complex deployment chain (minify → R2 → CDN → cache bust)
- Investigation depth (controlled DevTools experiments to isolate FilePond behavior)


<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | CDN not updated → users still see old broken version | HIGH | LOW | Verified deployment via `curl` response inspection for `removeAttribute` string |
| R-002 | Browser cache serves old `?v=1.3.0` → fix appears to fail | HIGH | MEDIUM | Version bump to `?v=1.4.0` forces cache bust, users can hard-refresh (Cmd+Shift+R) |
| R-003 | FilePond library update breaks accept-override fix | MEDIUM | LOW | Document this behavior in decision-record.md, test thoroughly before any FilePond upgrades |
| R-004 | Server-side validation rejects file types client accepts | MEDIUM | LOW | Assume Cloudflare Worker validates correctly (not verified in this session) |
| R-005 | Webflow republish overwrites HTML version strings | LOW | MEDIUM | Monitor deployments, re-apply version bumps if Webflow overwrites |


<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Upload .docx CV (Priority: P0)

**As an** applicant, **I want** to upload my CV in .docx format, **so that** I can apply for a job without needing to convert my document to PDF.

**Acceptance Criteria**:
1. Given I'm on `/nl/werkenbij`, When I click "Selecteer bestand" and choose a `.docx` file, Then the file appears in the upload queue without "Ongeldig bestandstype" error
2. Given a .docx file is selected, When I submit the form, Then the file uploads to R2 and the `cv_url` field contains a valid R2 URL


<!-- /ANCHOR:user-stories -->

---

### US-002: Upload TXT/MD/ODT/RTF formats (Priority: P0)

**As an** applicant, **I want** to upload my CV in plain text, Markdown, ODT, or RTF formats, **so that** I can use my preferred document format.

**Acceptance Criteria**:
1. Given I select a `.txt` file, When FilePond validates, Then the file is accepted
2. Given I select a `.md` file, When FilePond validates, Then the file is accepted
3. Given I select a `.odt` file, When FilePond validates, Then the file is accepted
4. Given I select a `.rtf` file, When FilePond validates, Then the file is accepted

---

### US-003: Handle browser MIME inconsistencies (Priority: P1)

**As a** system, **I want** to validate file types by extension when browser MIME detection fails, **so that** users don't encounter false rejections due to browser quirks.

**Acceptance Criteria**:
1. Given a browser reports `.docx` as `application/zip`, When extension fallback runs, Then the file is accepted as `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
2. Given a browser reports `.docx` as `application/octet-stream`, When extension fallback runs, Then the file is accepted

---

### US-004: Resilient to Webflow attribute corruption (Priority: P1)

**As a** system, **I want** to strip all whitespace from Webflow attribute values, **so that** the platform's attribute editor display formatting doesn't break MIME type validation.

**Acceptance Criteria**:
1. Given Webflow's attribute editor inserts spaces in a long MIME string, When the script parses `data-accepted-types`, Then the internal spaces are removed before comparison
2. Given the MIME string `"application/vnd...doc   ument"` (with internal spaces), When `.replace(/\s+/g, '')` is applied, Then it becomes `"application/vnd...document"` (no spaces)

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

All questions resolved during implementation:

- ✅ **Q1**: Does FilePond prefer MIME types or file extensions in `acceptedFileTypes`?
  **A**: Prefers MIME types but falls back to extension matching. Browser File objects provide MIME types, so MIME-based validation is more reliable.

- ✅ **Q2**: Why do browsers report different MIME types for .docx?
  **A**: .docx is a ZIP archive internally. Browsers without Office format detection report `application/zip`. Added extension-based fallback to handle this.

- ✅ **Q3**: Does removing the native `accept` attribute have accessibility implications?
  **A**: No, FilePond provides its own accessible file picker UI. Native attribute was purely for browser's default file picker filtering.

- ✅ **Q4**: What is the correct R2 bucket name for CDN deployment?
  **A**: `code` (not `anobel-cdn` as initially assumed). Verified via 034-cloudflare-r2-migration spec.


<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Session Handover**: See `handover.md` (updated)
- **Webflow Attributes Reference**: See `scratch/webflow-attributes.md`
- **Prior Work**: See `034-cloudflare-r2-migration/` for Cloudflare account setup

---

<!--
LEVEL 3 SPEC (~490 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
- Complex Problem Statement with multi-layered bug documentation
-->
