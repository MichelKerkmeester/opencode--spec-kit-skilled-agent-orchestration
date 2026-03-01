# Form Submission System Analysis

> **Research Output**: Complete attribute inventory extracted from form JavaScript files
> **Source Files**:
> - `/src/2_javascript/form/form_submission.js` (1302 lines)
> - `/src/2_javascript/form/form_validation.js` (1446 lines)
> - `/src/2_javascript/form/form_persistence.js` (631 lines)
> - `/src/2_javascript/form/input_select.js` (500 lines)
> - `/src/2_javascript/form/input_upload.js` (689 lines)

---

## 1. Form Element Selectors

### 1.1 Form Discovery Selector (form_submission.js:13)

```javascript
const FORM_SELECTOR = 'form[action*="submit-form.com"], form[data-formspark-url]';
```

**Forms are discovered if they have:**
- `action` attribute containing "submit-form.com"
- OR `data-formspark-url` attribute

### 1.2 Submit Button Selectors (form_submission.js:14)

```javascript
const SUBMIT_SELECTOR = 'button[type="submit"], input[type="submit"], [data-submit-button]';
```

---

## 2. Complete Attribute Inventory

### 2.1 Form-Level Attributes (form_submission.js)

| Attribute | Default | Purpose | Values |
|-----------|---------|---------|--------|
| `data-form-submit` | `true` | Enable/disable submission handling | `true`, `false`, `1`, `0`, `yes`, `no`, `enabled`, `disabled`, `on`, `off` |
| `data-form-enhance` | `true` | Enable enhanced submission (JSON) | Boolean |
| `data-form-reset` | `true` | Reset form after successful submission | Boolean |
| `data-form-reset-delay` | `200` | Milliseconds before form reset | Integer (ms) |
| `data-form-reset-preserve` | - | CSS selectors of fields to preserve on reset | Comma-separated selectors |
| `data-success-modal` | - | CSS selector for success modal dialog | CSS selector (e.g., `#success-modal`) |
| `data-botpoison-public-key` | - | Botpoison public key for spam protection | String |
| `data-botpoison-key` | - | Alternative Botpoison key attribute | String |
| `data-form-configured` | - | Set to `true` after configuration | `true` |
| `data-formspark-url` | - | Formspark endpoint URL | URL string |
| `data-form-fallback` | `true` | Enable native fallback on JSON failure | Boolean |
| `action` | - | Form action URL (fallback endpoint) | URL string |

### 2.2 Validation Attributes (form_validation.js)

#### Form/Scope Level

| Attribute | Default | Purpose | Values |
|-----------|---------|---------|--------|
| `data-form-live-validation` | - | Enable live validation on form | Present (no value needed) |
| `data-validate-on` | `input,blur` | Events that trigger validation | Pipe or comma-separated: `input`, `blur`, `change` |
| `data-validate-scroll` | - | Scroll to invalid field on submit | Present (no value needed) |
| `data-validate-scroll-offset` | `100` | Scroll offset in pixels | Integer (px) |

#### Field Level

| Attribute | Default | Purpose | Values |
|-----------|---------|---------|--------|
| `data-validate-rules` | - | Custom validation rules | Pipe-separated rules (see below) |
| `data-validate-on-submit-only` | - | Skip live validation, only validate on submit | Present (no value needed) |
| `data-error-[rule]` | - | Custom error message for rule | String |
| `data-error-message-[rule]` | - | Legacy custom error message | String |
| `data-validate-group` | - | Group name for checkbox/radio validation | String identifier |
| `data-select-placeholder` | - | Mark select option as placeholder | Present (no value needed) |

#### Validation Rules (data-validate-rules values)

```
email          - Valid email format
url            - Valid URL format
tel            - Valid telephone format
number         - Valid number
min:[n]        - Minimum numeric value
max:[n]        - Maximum numeric value
minlength:[n]  - Minimum string length
maxlength:[n]  - Maximum string length
pattern:[regex] - Regular expression match
equals:[selector] - Match another field's value
minchecked:[n] - Minimum checked in group
maxchecked:[n] - Maximum checked in group
```

#### Phone Formatting

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-phone-format` | Enable phone number formatting | `nl-mobile`, `intl-e164`, `intl-format` (pipe or comma separated) |

### 2.3 Field Wrapper/Group Attributes

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-form-field` | Marks field wrapper for validation styling | Present (no value needed) |
| `data-form-group` | Groups related fields (checkbox/radio) | String identifier |
| `data-group` | Legacy group wrapper | String identifier |
| `data-min` | Minimum selections in group | Integer |
| `data-max` | Maximum selections in group | Integer |

### 2.4 Error Container Attributes

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-error-container` | Error message display element | Present (no value needed) |
| `data-form-helper` | Nested text element for error messages | Present (no value needed) |
| `role` | ARIA role for error container | `alert` (error-only) or `status` (info helper) |
| `aria-live` | ARIA live region | `polite` (auto-set) |

### 2.5 Form Persistence Attributes (form_persistence.js)

| Attribute | Default | Purpose | Values |
|-----------|---------|---------|--------|
| `data-form-persist` | - | Enable persistence, optionally specify field selectors | Empty or comma-separated selectors |
| `data-form-reset-preserve` | - | Fields to preserve (also enables persistence) | Comma-separated selectors |
| `data-persist-key` | - | Custom storage key | String |
| `data-persist-expiry` | `24` | Hours before data expires | Integer (hours) |

### 2.6 Custom Select Attributes (input_select.js)

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-select="wrapper"` | Custom select container | `wrapper` |
| `data-select="trigger"` | Clickable trigger element | `trigger` |
| `data-select="input"` | Hidden input for value | `input` |
| `data-select="dropdown"` | Dropdown container | `dropdown` |
| `data-select="option"` | Dropdown option | `option` |
| `data-value` | Option's actual value (on option element) | String |
| `data-placeholder` | Input placeholder text | String |

### 2.7 File Upload Attributes (input_upload.js)

#### Wrapper/Structure

| Attribute | Purpose | Values |
|-----------|---------|--------|
| `data-file-upload="wrapper"` | Upload component container | `wrapper` |
| `data-file-upload="input"` | File input element | `input` |
| `data-file-upload="url"` | Hidden input for uploaded URL | `url` |
| `data-file-upload="idle"` | Idle state view | `idle` |
| `data-file-upload="loader"` | Uploading/complete state view | `loader` |
| `data-file-upload="browse"` | Browse link trigger | `browse` |
| `data-file-upload="notice"` | Action notice text | `notice` |
| `data-file-upload="text"` | Idle text element | `text` |
| `data-file-upload="description"` | Description text | `description` |
| `data-file-upload="uploading"` | Uploading status text | `uploading` |
| `data-file-upload="progress-bar"` | Progress bar fill | `progress-bar` |
| `data-file-upload="percentage"` | Percentage text | `percentage` |
| `data-file-upload="size"` | Size text | `size` |

#### Configuration

| Attribute | Default | Purpose | Values |
|-----------|---------|---------|--------|
| `data-upload-endpoint` | R2 proxy URL | Upload endpoint | URL |
| `data-max-size` | `5MB` | Maximum file size | Size string (e.g., `10MB`) |
| `data-accepted-types` | `application/pdf,.doc,.docx` | Accepted MIME types | Comma-separated types |

#### Labels (Localization)

| Attribute | Default | Purpose |
|-----------|---------|---------|
| `data-label-idle-text` | "Drag & drop your file or" | Idle state text |
| `data-label-browse` | "Browse" | Browse link text |
| `data-label-description` | "Max 5 MB: PDF, DOC, DOCX" | Description text |
| `data-label-uploading` | "Uploading..." | Uploading state text |
| `data-label-cancel` | "Click to cancel upload" | Cancel notice |
| `data-label-delete` | "Click to delete" | Delete notice |
| `data-label-size-separator` | " of " | Size separator |
| `data-label-error-type` | "Invalid file type" | Type error message |
| `data-label-error-size` | "File too large" | Size error message |
| `data-label-error-dismiss` | "Click to dismiss" | Error dismiss notice |

---

## 3. Form Collection Logic Flow

### 3.1 Data Collection Process (form_submission.js:671-699)

```
FormData Collection Flow:
1. Create FormData from native form element
2. Iterate through all FormData entries
3. For each entry:
   a. Check if value is a File object
      - If yes: Log warning, skip (files can't be JSON stringified)
   b. Handle multiple values for same key (checkboxes)
      - Convert to array if duplicate key exists
   c. Store key:value pairs in form_json object
4. Add Botpoison token if required: form_data.set('_botpoison', token)
5. Submit as JSON to endpoint
```

### 3.2 Custom Select Integration

Custom selects store values in two locations:
1. `input.value` - Display text shown to user
2. `input.dataset.value` - Actual value for form submission

**FormData only sees `input.value`** - the display text, not the data-value.

### 3.3 File Upload Integration

File uploads use FilePond with a hidden URL input:
1. FilePond uploads file to R2 proxy endpoint
2. Server returns URL of uploaded file
3. URL is stored in hidden input: `[data-file-upload="url"]`
4. Hidden input value is included in FormData

**Important**: The actual file is NOT submitted with the form - only the URL.

---

## 4. Required Name Attributes

### 4.1 For FormData Collection

Every field that should be submitted MUST have a `name` attribute. Fields without `name`:
- Are NOT included in FormData
- Will NOT be submitted to Formspark

### 4.2 Excluded from Persistence

```javascript
const EXCLUDED_NAMES = ['_gotcha', 'botpoison', 'g-recaptcha-response', 'bp_solution'];
```

### 4.3 Name-Based Validation Groups

Checkbox/radio groups are validated by shared `name` attribute:
```javascript
const boxes = form.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(name)}"]`);
```

---

## 5. Validation Attribute Requirements

### 5.1 Native HTML5 Validation Attributes

| Attribute | Field Types | Validation |
|-----------|-------------|------------|
| `required` | All | Field must have value |
| `minlength` | text, textarea | Minimum character count |
| `maxlength` | text, textarea | Maximum character count |
| `min` | number | Minimum numeric value |
| `max` | number | Maximum numeric value |
| `step` | number | Valid step value |
| `pattern` | text | Regex pattern match |
| `type="email"` | input | Email format validation |
| `type="url"` | input | URL format validation |
| `type="tel"` | input | Telephone format validation |
| `accept` | file | File type validation |

### 5.2 ARIA Attributes (Auto-Set)

| Attribute | When Set | Value |
|-----------|----------|-------|
| `aria-invalid` | Always | `true` or `false` |
| `aria-required` | On required fields | `true` |
| `aria-describedby` | When error container exists | Error container ID |

---

## 6. CSS Classes Applied by JavaScript

### 6.1 Validation Classes

| Class | Applied To | When |
|-------|------------|------|
| `validation-pristine` | Field wrapper/group | Initial state, before interaction |
| `validation-touched` | Field wrapper/group | After user interaction |
| `validation-valid` | Field wrapper/group | Field is valid AND has content |
| `validation-invalid` | Field wrapper/group | Field fails validation |
| `input--helper-w--error` | Helper wrapper | Field fails validation |
| `input--helper--visible` | Error container | Showing error/info |

### 6.2 Custom Select Classes

| Class | Applied To | When |
|-------|------------|------|
| `is--open` | Wrapper | Dropdown is open |
| `is--selected` | Option | Option is selected |
| `is--has-value` | Input | Value is selected |

### 6.3 File Upload Classes

| Class | Applied To | When |
|-------|------------|------|
| `is--uploading` | Wrapper | Upload in progress |
| `is--complete` | Wrapper | Upload complete |
| `is--error` | Wrapper | Upload error |
| `is--drag-over` | Wrapper | File being dragged over |

### 6.4 Form State Classes

| Attribute/Class | Applied To | When |
|-----------------|------------|------|
| `data-state="submitting"` | Form | Form is submitting |
| `data-state="success"` | Form | Submission succeeded |
| `data-state="error"` | Form | Submission failed |
| `data-form-submit-enhanced="true"` | Form | Enhanced submission active |
| `aria-busy` | Form | Form is submitting |

---

## 7. Custom Events Dispatched

### 7.1 Form Submission Events

| Event | Target | When | Detail |
|-------|--------|------|--------|
| `formspark:success` | Form | Submission succeeded | `{ handler }` |
| `formspark:error` | Form | Submission failed | `{ handler, error }` |
| `formsubmit:success` | Form | Submission succeeded | `{ handler, modal }` |
| `formsubmit:error` | Form | Submission failed | `{ handler, error }` |

### 7.2 Form Persistence Events

| Event | Target | When | Detail |
|-------|--------|------|--------|
| `form-data-restored` | Form | Data restored from storage | `{ restoredCount }` |
| `form-persistence-clear` | Form | Request to clear storage | - |

### 7.3 Validation Events

| Event | Target | When |
|-------|--------|------|
| `form-reset-requested` | Form | Form reset triggered |

---

## 8. Formspark-Specific Requirements

### 8.1 Required Attributes

| Attribute | Location | Purpose |
|-----------|----------|---------|
| `data-formspark-url` | Form | Formspark submission endpoint |
| OR `action="*submit-form.com*"` | Form | Alternative endpoint detection |

### 8.2 Hidden Fields for Formspark

| Name | Purpose | Auto-Set |
|------|---------|----------|
| `_botpoison` | Spam protection token | Yes (if Botpoison configured) |

### 8.3 Submission Format

Forms are submitted as JSON:
```javascript
fetch(endpoint, {
  method: 'POST',
  body: JSON.stringify(form_json),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

---

## 9. Error Messages (Validation)

### 9.1 Default Messages (form_validation.js:114-132)

```javascript
const DEFAULT_MESSAGES = {
  required: 'This field is required',
  email: 'Enter a valid email address',
  url: 'Enter a valid URL',
  tel: 'Enter a valid phone number',
  'phone-nl': 'Voer een geldig Nederlands mobiel nummer in (bijv. +31 6 1234 5678)',
  'phone-intl': 'Enter a valid international phone number (e.g., +1234567890)',
  number: 'Enter a valid number',
  min: 'Value is too small',
  max: 'Value is too large',
  step: 'Invalid step value',
  minlength: 'Value is too short',
  maxlength: 'Value is too long',
  pattern: 'Value does not match the required pattern',
  equals: 'Values do not match',
  minchecked: 'Select more options',
  maxchecked: 'Select fewer options',
  accept: 'Invalid file type',
};
```

### 9.2 Custom Messages

Override with `data-error-[rule]` or `data-error-message-[rule]` attribute:
```html
<input required data-error-required="Please fill in your name">
```

---

## 10. Integration Requirements Summary

### 10.1 Minimum Required for Form Submission

```html
<form data-formspark-url="https://submit-form.com/YOUR_FORM_ID">
  <input type="text" name="field_name" required>
  <button type="submit">Submit</button>
</form>
```

### 10.2 Full-Featured Form Example

```html
<form
  data-formspark-url="https://submit-form.com/YOUR_FORM_ID"
  data-botpoison-public-key="pk_xxxxx"
  data-form-reset="true"
  data-form-reset-delay="300"
  data-success-modal="#success-modal"
  data-form-live-validation
  data-form-persist
>
  <!-- Field with validation -->
  <div data-form-field>
    <input
      type="email"
      name="email"
      required
      data-error-required="Email is required"
      data-error-email="Please enter a valid email"
    >
    <div data-error-container role="alert">
      <span data-form-helper></span>
    </div>
  </div>

  <!-- Custom select -->
  <div data-select="wrapper">
    <div data-select="trigger">
      <input data-select="input" name="country" required readonly>
    </div>
    <div data-select="dropdown">
      <div data-select="option" data-value="nl">Netherlands</div>
      <div data-select="option" data-value="be">Belgium</div>
    </div>
  </div>

  <!-- File upload -->
  <div data-file-upload="wrapper" data-max-size="5MB">
    <input type="file" data-file-upload="input">
    <input type="hidden" name="resume_url" data-file-upload="url">
  </div>

  <button type="submit">Submit</button>
</form>
```

---

## 11. Key Findings

### 11.1 Critical for Form Submission

1. **Every field MUST have a `name` attribute** to be included in submission
2. **Custom selects use `data-value` for actual values** - only display text goes to FormData by default
3. **File uploads submit URLs, not files** - files are uploaded separately to R2

### 11.2 Validation Considerations

1. **`data-validate-on-submit-only`** prevents validation flash on custom selects
2. **Phone validation requires `data-phone-format`** attribute
3. **Checkbox groups require wrapper with `data-form-group` or `data-group`**

### 11.3 Persistence Considerations

1. **Passwords, files, hidden, submit fields are excluded**
2. **Honeypot fields (`_gotcha`, `botpoison`, etc.) are excluded**
3. **Custom selects store both `value` and `dataValue` for proper restoration**

---

## 12. Files Analyzed

| File | Lines | Purpose |
|------|-------|---------|
| `form_submission.js` | 1302 | Formspark submission, modals, retries |
| `form_validation.js` | 1446 | Live validation, error display, phone formatting |
| `form_persistence.js` | 631 | Local storage persistence across refreshes |
| `input_select.js` | 500 | Custom dropdown select component |
| `input_upload.js` | 689 | FilePond integration for file uploads |
| `input_select_fs_bridge.js` | 213 | Finsweet list-sort integration |

---

*Analysis completed: 2026-01-24*
