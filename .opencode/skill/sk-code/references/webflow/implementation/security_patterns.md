---
title: Security Patterns - OWASP Top 10 Integration
description: Security hardening patterns covering XSS prevention, CSRF protection, and input validation.
---

# Security Patterns - OWASP Top 10 Integration

Security hardening patterns covering XSS prevention, CSRF protection, and input validation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Frontend security checklist based on OWASP Top 10 vulnerabilities, covering input validation, injection prevention, and secure data handling.

### When to Use
Apply during Phase 1 (Implementation) when:
- Handling user input (forms, search, etc.)
- Making API calls
- Displaying user-generated content
- Storing data (localStorage, sessionStorage, cookies)
- Before deploying to production

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:security-checklist -->
## 2. SECURITY CHECKLIST

### Input Validation & XSS Prevention

**Sanitize User Input:**
```javascript
// ✅ GOOD: Sanitize before display
function sanitize_html(str) {
  const div = document.createElement('div');
  div.textContent = str;  // Automatically escapes HTML
  return div.innerHTML;
}

const user_input = '<script>alert("XSS")</script>';
element.innerHTML = sanitize_html(user_input);
// Result: &lt;script&gt;alert("XSS")&lt;/script&gt;

// ❌ BAD: Direct innerHTML without sanitization
element.innerHTML = user_input;  // XSS vulnerability!
```

**Use textContent When Possible:**
```javascript
// ✅ GOOD: Use textContent for plain text
element.textContent = user_input;  // Safe, no HTML rendering

// ❌ BAD: innerHTML for plain text
element.innerHTML = user_input;  // Unnecessary risk
```

**Validate Input Format:**
```javascript
// ✅ GOOD: Validate email format
function is_valid_email(email) {
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email_regex.test(email);
}

if (!is_valid_email(user_email)) {
  throw new Error('Invalid email format');
}

// ❌ BAD: Accept any input
const user_email = input.value;  // No validation
send_to_api(user_email);
```

**Checklist:**
- [ ] All user input sanitized before display
- [ ] textContent used instead of innerHTML when possible
- [ ] HTML entities escaped in user-generated content
- [ ] Input format validated (email, phone, URL, etc.)
- [ ] No eval() or Function() constructor with user input

### CSRF Protection

**SameSite Cookies:**
```javascript
// ✅ GOOD: Set SameSite cookie attribute
document.cookie = "session=abc123; SameSite=Strict; Secure";

// ❌ BAD: No SameSite attribute
document.cookie = "session=abc123";  // Vulnerable to CSRF
```

**CSRF Tokens:**
```html
<!-- ✅ GOOD: Include CSRF token in forms -->
<form method="POST">
  <input type="hidden" name="csrf_token" value="${csrfToken}">
  <input type="text" name="username">
  <button type="submit">Submit</button>
</form>

<!-- Server-side verification required -->
```

**Verify Origin/Referer:**
```javascript
// ✅ GOOD: Verify request origin (server-side)
const allowed_origins = ['https://example.com'];
if (!allowed_origins.includes(req.headers.origin)) {
  throw new Error('Invalid origin');
}
```

**Checklist:**
- [ ] SameSite=Strict set on cookies
- [ ] CSRF tokens implemented for state-changing operations
- [ ] Origin/Referer headers verified (server-side)
- [ ] GET requests never modify state

### Injection Prevention

**SQL/NoSQL Injection:**
```javascript
// ✅ GOOD: Parameterized queries (server-side)
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [user_email]);

// ❌ BAD: String concatenation
const query = `SELECT * FROM users WHERE email = '${user_email}'`;
// Vulnerable to SQL injection!
```

**Command Injection:**
```javascript
// ✅ GOOD: Validate and sanitize inputs
const allowed_commands = ['start', 'stop', 'restart'];
if (!allowed_commands.includes(user_command)) {
  throw new Error('Invalid command');
}

// ❌ BAD: Execute user input directly
exec(user_command);  // Command injection vulnerability!
```

**Never Execute User Input:**
```javascript
// ❌ BAD: eval() with user input
eval(user_input);  // Extreme vulnerability

// ❌ BAD: Function constructor
new Function(user_input)();  // Also vulnerable

// ❌ BAD: setTimeout/setInterval with strings
setTimeout(user_input, 1000);  // Vulnerable
```

**Checklist:**
- [ ] Parameterized queries used (no string concatenation)
- [ ] All inputs validated and sanitized
- [ ] Never use eval(), Function(), or execute user input
- [ ] Whitelist approach for allowed values

### Security Headers

**Content Security Policy (CSP):**
```html
<!-- ✅ GOOD: Strict CSP -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'">

<!-- ❌ BAD: No CSP or overly permissive -->
<meta http-equiv="Content-Security-Policy" content="default-src *">
```

**Other Security Headers:**
```html
<!-- X-Content-Type-Options -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- X-Frame-Options -->
<meta http-equiv="X-Frame-Options" content="DENY">

<!-- Strict-Transport-Security (HSTS) - server-side -->
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Checklist:**
- [ ] Content-Security-Policy set (restrict script/style sources)
- [ ] X-Content-Type-Options: nosniff set
- [ ] X-Frame-Options: DENY or SAMEORIGIN set
- [ ] Strict-Transport-Security (HSTS) enabled (server-side)
- [ ] Referrer-Policy configured appropriately

### Access Control

**Client-Side Authorization (UI Only):**
```javascript
// ⚠️ WARNING: Client-side checks are for UX only, NOT security
// Always verify on server-side

// ✅ GOOD: Hide UI elements, verify on backend
if (user.role === 'admin') {
  adminPanel.style.display = 'block';  // UI only
}
// Server MUST verify user.role before serving admin data

// ❌ BAD: Client-side only authorization
if (user.role === 'admin') {
  fetchAdminData();  // Vulnerable if server doesn't verify
}
```

**Least Privilege Principle:**
```javascript
// ✅ GOOD: Request only necessary permissions
const data = await fetch('/api/user/profile');  // Specific endpoint

// ❌ BAD: Request more than needed
const data = await fetch('/api/admin/all-users');  // Excessive permissions
```

**Checklist:**
- [ ] User authorization verified on EVERY server request
- [ ] Least privilege principle implemented
- [ ] Never trust client-side authorization checks
- [ ] Sensitive operations require re-authentication

### Data Storage Security

**localStorage/sessionStorage:**
```javascript
// ✅ GOOD: Never store sensitive data in localStorage
sessionStorage.setItem('theme', 'dark');  // Non-sensitive data OK

// ❌ BAD: Store sensitive data
localStorage.setItem('password', user_password);  // Vulnerable to XSS
localStorage.setItem('token', auth_token);  // Accessible to all scripts
```

**Cookies:**
```javascript
// ✅ GOOD: Secure, HttpOnly cookies (server-side)
Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Strict

// ❌ BAD: JavaScript-accessible cookies with sensitive data
document.cookie = "session=abc123";  // Accessible to XSS
```

**Checklist:**
- [ ] No sensitive data in localStorage/sessionStorage
- [ ] Cookies set with Secure, HttpOnly, SameSite attributes
- [ ] Sensitive data encrypted if stored client-side
- [ ] Clear storage on logout

---

<!-- /ANCHOR:security-checklist -->
<!-- ANCHOR:owasp-top-10-coverage -->
## 3. OWASP TOP 10 COVERAGE

1. **Broken Access Control** → Access Control checklist
2. **Cryptographic Failures** → Data Storage Security
3. **Injection** → Injection Prevention checklist
4. **Insecure Design** → Apply all checklists during design
5. **Security Misconfiguration** → Security Headers checklist
6. **Vulnerable Components** → Use latest CDN versions, audit dependencies
7. **Authentication Failures** → Access Control + CSRF Protection
8. **Data Integrity Failures** → Input Validation checklist
9. **Logging Failures** → Log security events (server-side)
10. **SSRF** → Validate URLs, whitelist allowed domains

---

<!-- /ANCHOR:owasp-top-10-coverage -->
<!-- ANCHOR:prototype-pollution-prevention -->
## 4. PROTOTYPE POLLUTION PREVENTION

Prototype pollution (CWE-1321) occurs when attackers inject properties into JavaScript object prototypes, potentially enabling property injection, denial of service, or remote code execution.

### The Attack Vector

```javascript
// ❌ VULNERABLE: Object allows prototype pollution
const ALLOWED = {
  'value1': true,
  'value2': true
};

// Attacker can pollute via __proto__
const userInput = '__proto__';
if (userInput in ALLOWED) { /* ... */ }  // Unsafe property check

// Or via constructor.prototype
ALLOWED[userInput] = true;  // Pollutes Object.prototype if userInput = '__proto__'
```

### Defense Pattern: Null-Prototype Frozen Objects

**The Pattern:**
```javascript
// ✅ GOOD: Null-prototype frozen object (defense-in-depth)
const ALLOWED_VALUES = Object.freeze(Object.assign(Object.create(null), {
  'value1': true,
  'value2': true,
  'value3': true
}));

// Safe property check with Object.hasOwn
if (!Object.hasOwn(ALLOWED_VALUES, userInput)) {
  return false;  // Reject unknown input
}
```

**Why This Works:**
1. `Object.create(null)` - Creates object with NO prototype chain (no `__proto__`, `constructor`, etc.)
2. `Object.assign(...)` - Copies allowed values onto null-prototype object
3. `Object.freeze(...)` - Prevents modification after creation (immutable)
4. `Object.hasOwn(...)` - Checks only own properties, not inherited

**Evidence:** `/src/javascript/modal/modal_welcome.js:38-41`
```javascript
const modal_system = (window.project_modal_system ??= {
  list: Object.create(null), // SECURITY: Use null prototype to prevent prototype pollution
  open(id, reason) {
    // SECURITY: Use Object.hasOwn for safe property access (CWE-1321)
    if (id && typeof id === 'string' && Object.hasOwn(this.list, id)) {
      this.list[id]?.open?.(reason ?? 'manual');
    }
  },
  // ...
});
```

### Whitelist Validation Pattern

For user-controlled values that map to object keys, validate against an explicit whitelist:

**Evidence:** `/src/javascript/modal/modal_welcome.js:57-67`
```javascript
// SECURITY: Validate modal ID to prevent prototype pollution and injection (CWE-1321)
const ALLOWED_MODAL_IDS = ['welcome', 'cookie', 'newsletter', 'contact'];

const isValidModalId = (id) => {
  if (!id || typeof id !== 'string') return false;
  // Only allow known modal IDs (whitelist approach)
  if (ALLOWED_MODAL_IDS.includes(id)) return true;
  // Fallback: alphanumeric with dash/underscore, no dangerous patterns
  if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,30}$/.test(id)) return false;
  // Reject prototype pollution attempts
  if (['__proto__', 'constructor', 'prototype'].includes(id)) return false;
  return true;
};
```

### Checklist

- [ ] Dynamic object keys validated against whitelist before use
- [ ] Registry/lookup objects use `Object.create(null)` for null prototype
- [ ] Registry objects frozen with `Object.freeze()` when possible
- [ ] Property checks use `Object.hasOwn()` instead of `in` operator
- [ ] User input never directly used as object keys without validation
- [ ] Dangerous property names explicitly blocked (`__proto__`, `constructor`, `prototype`)

---

<!-- /ANCHOR:prototype-pollution-prevention -->
<!-- ANCHOR:secure-id-generation -->
## 5. SECURE ID GENERATION

Using `Math.random()` for security-sensitive operations (CWE-330) can lead to predictable values. Use `crypto.getRandomValues()` for cryptographically secure randomness.

### When to Use Each Approach

| Use Case | Method | Reason |
|----------|--------|--------|
| Session tokens, CSRF tokens | `crypto.getRandomValues()` | Security-critical, must be unpredictable |
| Unique DOM IDs (ARIA) | `crypto.getRandomValues()` | Prevent collision attacks |
| Shuffle algorithms (privacy) | `crypto.getRandomValues()` | Prevent prediction of order |
| Simple UI animations | `Math.random()` | No security implications |
| Non-sensitive visual effects | `Math.random()` | Performance over security |

### Pattern: Secure Random Seed for Counters

When generating unique IDs that need collision resistance:

**Evidence:** `/src/javascript/form/form_validation.js:561-571`
```javascript
// SECURITY FIX: Using crypto.getRandomValues() instead of Math.random() for secure randomness (CWE-330)
// Counter for generating unique IDs with cryptographically secure random seed to prevent collisions
let aria_id_counter = (function() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 10000;
  }
  // Fallback for environments without crypto API (very rare in modern browsers)
  return Math.floor(Math.random() * 10000);
})();

// Usage: Generate unique ID
const id = `err_${++aria_id_counter}_${Date.now()}`;
```

### Pattern: Secure Shuffle (Fisher-Yates)

For randomizing arrays where order prediction could leak information:

**Evidence:** `/src/javascript/cms/related_articles.js:76-86`
```javascript
// SECURITY FIX: Using crypto.getRandomValues() instead of Math.random() for secure randomness (CWE-330)
// Fisher-Yates shuffle algorithm with cryptographically secure random
for (let i = otherArticles.length - 1; i > 0; i--) {
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  const j = randomArray[0] % (i + 1);
  [otherArticles[i], otherArticles[j]] = [
    otherArticles[j],
    otherArticles[i],
  ];
}
```

### Pattern: UUID Generation

For generating universally unique identifiers:

```javascript
// ✅ GOOD: Use native crypto.randomUUID() when available
function generateSecureId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();  // Returns format: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  }
  // Fallback: Build UUID v4 from random values
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;  // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80;  // Variant 10xx
  return [...bytes].map((b, i) =>
    (i === 4 || i === 6 || i === 8 || i === 10 ? '-' : '') +
    b.toString(16).padStart(2, '0')
  ).join('');
}

// ❌ BAD: Math.random() for ID generation
function badGenerateId() {
  return Math.random().toString(36).substring(2);  // Predictable!
}
```

### Checklist

- [ ] Security-sensitive randomness uses `crypto.getRandomValues()`
- [ ] ID generation includes fallback for older environments
- [ ] Shuffle algorithms use cryptographically secure random
- [ ] Math.random() only used for non-security visual effects
- [ ] UUID generation uses `crypto.randomUUID()` where available

---

<!-- /ANCHOR:secure-id-generation -->
<!-- ANCHOR:safe-property-access-object-hasown -->
## 6. SAFE PROPERTY ACCESS (Object.hasOwn)

The `in` operator and `hasOwnProperty()` method have security and reliability issues. Use `Object.hasOwn()` for safe property checking.

### Why Not Use `in` Operator

```javascript
// ❌ BAD: 'in' operator checks entire prototype chain
const obj = { allowed: true };

'allowed' in obj;      // true (correct)
'toString' in obj;     // true (WRONG - inherited from Object.prototype)
'__proto__' in obj;    // true (WRONG - prototype chain property)

// Attacker can exploit:
const userInput = 'toString';
if (userInput in obj) {
  // This passes for ANY inherited property!
}
```

### Why Not Use `hasOwnProperty()` Directly

```javascript
// ❌ BAD: hasOwnProperty can be overridden or shadowed
const malicious = {
  hasOwnProperty: () => true,  // Overridden!
  __proto__: null
};

malicious.hasOwnProperty('anything');  // true (WRONG - always returns true)

// Or object created with null prototype:
const nullProto = Object.create(null);
nullProto.hasOwnProperty('key');  // TypeError: not a function
```

### Safe Pattern: Object.hasOwn()

```javascript
// ✅ GOOD: Object.hasOwn() is safe and reliable
const obj = { allowed: true };

Object.hasOwn(obj, 'allowed');    // true (correct)
Object.hasOwn(obj, 'toString');   // false (correct - not own property)
Object.hasOwn(obj, '__proto__');  // false (correct - not own property)

// Works on null-prototype objects:
const nullProto = Object.create(null);
nullProto.key = 'value';
Object.hasOwn(nullProto, 'key');  // true (works!)

// Cannot be overridden:
const malicious = { hasOwnProperty: () => true };
Object.hasOwn(malicious, 'fake');  // false (correct - uses static method)
```

### Complete Safe Property Access Pattern

**Evidence:** `/src/javascript/modal/modal_welcome.js:40-43`
```javascript
open(id, reason) {
  // SECURITY: Use Object.hasOwn for safe property access (CWE-1321)
  if (id && typeof id === 'string' && Object.hasOwn(this.list, id)) {
    this.list[id]?.open?.(reason ?? 'manual');
  }
}
```

### Migration Guide

| Old Pattern | New Pattern |
|-------------|-------------|
| `'key' in obj` | `Object.hasOwn(obj, 'key')` |
| `obj.hasOwnProperty('key')` | `Object.hasOwn(obj, 'key')` |
| `Object.prototype.hasOwnProperty.call(obj, 'key')` | `Object.hasOwn(obj, 'key')` |

### Checklist

- [ ] Replace `in` operator with `Object.hasOwn()` for property checks
- [ ] Replace `.hasOwnProperty()` calls with `Object.hasOwn()`
- [ ] Validate user input before using as property lookup key
- [ ] Combine with null-prototype objects for maximum safety

---

<!-- /ANCHOR:safe-property-access-object-hasown -->
<!-- ANCHOR:anti-patterns -->
## 7. ANTI-PATTERNS

**Never:**
- ❌ Use innerHTML with unsanitized user input
- ❌ Store passwords, tokens, or sensitive data in localStorage
- ❌ Trust client-side authorization checks
- ❌ Use eval(), Function(), or execute user input
- ❌ Skip input validation ("I'll sanitize on display")
- ❌ Ignore security headers (CSP, X-Frame-Options, etc.)
- ❌ Concatenate SQL queries with user input
- ❌ Use `in` operator for property checks with user input (prototype pollution)
- ❌ Use `Math.random()` for security-sensitive randomness (predictable)
- ❌ Create lookup objects without null prototype when keys are user-controlled
- ❌ Use `.hasOwnProperty()` directly on objects (can be overridden)
- ❌ Allow `__proto__`, `constructor`, or `prototype` as user-controlled keys

---

<!-- /ANCHOR:anti-patterns -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Reference Files
- [implementation_workflows.md](./implementation_workflows.md) - Defense-in-depth validation
- [verification_workflows.md](../verification/verification_workflows.md) - Security testing
- See `mcp-chrome-devtools` skill for DevTools security audits

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - OWASP Top 10 Web Application Security Risks
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security) - Web security best practices
<!-- /ANCHOR:related-resources -->
