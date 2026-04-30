---
title: CDP Patterns & Command Examples
description: Chrome DevTools Protocol patterns, workflows, and Unix composability examples for bdg.
---

# CDP Patterns & Command Examples

CDP command reference with domain patterns and Unix pipeline examples.

---

## 1. OVERVIEW

Progressive disclosure from discovery to execution - always explore capabilities via `bdg cdp --list`/`--describe`/`--search` before executing CDP methods. Self-documentation eliminates hardcoded method lists and ensures up-to-date access to 300+ CDP methods across 53 domains.

---

## 2. PREREQUISITES

**Foundation:** Follow session management basics from SKILL.md Section 3 for all CDP operations:
- **Installation Verification**: Check `command -v bdg` before first use
- **Session Lifecycle**: Start → Verify → Execute → Stop pattern
- **Error Handling**: Always use `2>&1` for stderr capture
- See [../SKILL.md](../SKILL.md) Section 3 for core workflows

**Platform Requirements**:
- macOS: Native support
- Linux: Native support
- Windows: WSL only (PowerShell/Git Bash NOT supported)

---

## 3. QUICK REFERENCE

**Common Use Cases**:

| Task | Command Pattern | Output |
|------|----------------|--------|
| Screenshot | `bdg dom screenshot output.png` | PNG file saved |
| Console logs | `bdg console --list` | JSON array of log entries |
| Network cookies | `bdg network getCookies` | JSON cookie list |
| DOM query | `bdg dom query ".classname"` | Matching elements |
| HAR export | `bdg network har output.har` | HAR file with network data |
| JavaScript eval | `bdg dom eval "document.title"` | Execution result |
| Page navigation | `bdg cdp Page.navigate '{"url":"https://example.com"}'` | Navigation response |

---

## 4. CDP DOMAIN PATTERNS

### Page Domain

**Navigation and Lifecycle**:
```bash
# Navigate to URL
bdg cdp Page.navigate '{"url":"https://example.com"}'

# Get navigation history
bdg cdp Page.getNavigationHistory

# Reload page
bdg cdp Page.reload '{"ignoreCache":true}'

# Stop loading
bdg cdp Page.stopLoading

# Enable page events
bdg cdp Page.enable
```

**Screenshot and Rendering**:
```bash
# Full page screenshot (base64)
bdg cdp Page.captureScreenshot

# Specific viewport screenshot
bdg cdp Page.captureScreenshot '{
  "clip": {
    "x": 0,
    "y": 0,
    "width": 800,
    "height": 600,
    "scale": 1
  }
}'

# Print to PDF
bdg cdp Page.printToPDF '{"landscape":false}'
```

**Layout and Metrics**:
```bash
# Get layout metrics
bdg cdp Page.getLayoutMetrics

# Set device metrics override
bdg cdp Emulation.setDeviceMetricsOverride '{
  "width": 375,
  "height": 667,
  "deviceScaleFactor": 2,
  "mobile": true
}'
```

---

### DOM Domain

**Document Inspection**:
```bash
# Get document root
bdg cdp DOM.getDocument

# Get document with depth
bdg cdp DOM.getDocument '{"depth":-1,"pierce":true}'

# Query selector
bdg cdp DOM.querySelector '{
  "nodeId": 1,
  "selector": ".my-class"
}'

# Query all matching
bdg cdp DOM.querySelectorAll '{
  "nodeId": 1,
  "selector": "div"
}'
```

**Node Operations**:
```bash
# Get outer HTML
bdg cdp DOM.getOuterHTML '{"nodeId":123}'

# Get attributes
bdg cdp DOM.getAttributes '{"nodeId":123}'

# Set attribute value
bdg cdp DOM.setAttributeValue '{
  "nodeId": 123,
  "name": "class",
  "value": "active"
}'

# Remove node
bdg cdp DOM.removeNode '{"nodeId":123}'
```

**Helper Command Alternative**:
```bash
# Simpler DOM query using helper
bdg dom query "button.submit"
bdg dom query "#main-content"
bdg dom query "[data-testid='login']"
```

---

### Network Domain

**Network Monitoring**:
```bash
# Enable network tracking
bdg cdp Network.enable

# Clear browser cache
bdg cdp Network.clearBrowserCache

# Clear browser cookies
bdg cdp Network.clearBrowserCookies

# Get all cookies
bdg cdp Network.getAllCookies

# Get cookies for URL
bdg cdp Network.getCookies '{"urls":["https://example.com"]}'

# Set cookie
bdg cdp Network.setCookie '{
  "name": "session",
  "value": "abc123",
  "domain": "example.com",
  "path": "/",
  "secure": true,
  "httpOnly": true
}'

# Delete cookie
bdg cdp Network.deleteCookies '{
  "name": "session",
  "domain": "example.com"
}'
```

**Request Interception**:
```bash
# Enable request interception
bdg cdp Network.setRequestInterception '{
  "patterns": [{"urlPattern":"*"}]
}'

# Continue intercepted request
bdg cdp Network.continueInterceptedRequest '{
  "interceptionId": "id-123"
}'

# Block request
bdg cdp Network.continueInterceptedRequest '{
  "interceptionId": "id-123",
  "errorReason": "BlockedByClient"
}'
```

**Helper Command Alternative**:
```bash
# Simpler network inspection
bdg network getCookies
bdg network headers
bdg network har network-trace.har
```

---

### Runtime Domain

**Console and Logging**:
```bash
# Enable console
bdg cdp Runtime.enable

# Evaluate JavaScript
bdg cdp Runtime.evaluate '{
  "expression": "document.title",
  "returnByValue": true
}'

# Call function on object
bdg cdp Runtime.callFunctionOn '{
  "functionDeclaration": "function() { return this.value; }",
  "objectId": "object-123"
}'

# Get properties
bdg cdp Runtime.getProperties '{
  "objectId": "object-123",
  "ownProperties": true
}'
```

**Helper Command Alternative**:
```bash
# Simpler console access
bdg console --list
bdg dom eval "window.location.href"
bdg dom eval "localStorage.getItem('token')"
```

---

### Memory Domain

**Heap Snapshots**:
```bash
# Take heap snapshot
bdg cdp HeapProfiler.takeHeapSnapshot

# Start sampling
bdg cdp HeapProfiler.startSampling

# Stop sampling
bdg cdp HeapProfiler.stopSampling

# Get sampling profile
bdg cdp HeapProfiler.getSamplingProfile
```

**Memory Metrics**:
```bash
# Get DOM counters
bdg cdp Memory.getDOMCounters

# Force garbage collection
bdg cdp HeapProfiler.collectGarbage
```

---

### Performance Domain

**Metrics Collection**:
```bash
# Enable performance tracking
bdg cdp Performance.enable

# Get metrics
bdg cdp Performance.getMetrics

# Disable tracking
bdg cdp Performance.disable
```

**Timeline Recording**:
```bash
# Start timeline
bdg cdp Tracing.start '{
  "categories": "devtools.timeline"
}'

# Stop timeline
bdg cdp Tracing.end

# Get trace
bdg cdp Tracing.getCategories
```

---

## 5. COMPLETE WORKFLOWS

### Workflow 1: Full Page Screenshot

```bash
#!/bin/bash
# Complete screenshot workflow with error handling

# Check bdg availability
command -v bdg || { echo "Install: npm install -g browser-debugger-cli@alpha"; exit 1; }

# Start session
bdg https://example.com 2>&1

# Wait for page load (check status)
sleep 2
bdg status 2>&1 || { echo "Session failed"; exit 1; }

# Capture screenshot
bdg dom screenshot output.png 2>&1

# Alternative: Base64 screenshot via CDP
bdg cdp Page.captureScreenshot 2>&1 | jq -r '.result.data' > screenshot-b64.txt

# Stop session
bdg stop 2>&1

echo "Screenshot saved to output.png"
```

---

### Workflow 2: Console Log Analysis

```bash
#!/bin/bash
# Capture and analyze console logs

bdg https://example.com 2>&1

# Enable console
bdg cdp Runtime.enable 2>&1

# Get console logs (helper)
bdg console --list 2>&1 | jq '.[] | select(.level=="error")' > errors.json

# Count errors
error_count=$(jq '. | length' errors.json)
echo "Found $error_count console errors"

# Extract error messages
jq -r '.[] | "\(.level): \(.text)"' errors.json

bdg stop 2>&1
```

---

### Workflow 3: Network Request Monitoring

```bash
#!/bin/bash
# Monitor and export network requests

bdg https://example.com 2>&1

# Enable network tracking
bdg cdp Network.enable 2>&1

# Wait for page load
sleep 5

# Export HAR file
bdg network har network-trace.har 2>&1

# Analyze HAR with jq
jq '.log.entries[] | {
  url: .request.url,
  method: .request.method,
  status: .response.status,
  time: .time
}' network-trace.har > requests-summary.json

# Find slow requests (>1000ms)
jq '.log.entries[] | select(.time > 1000) | {url, time}' network-trace.har

bdg stop 2>&1
```

---

### Workflow 4: Cookie Manipulation

```bash
#!/bin/bash
# Cookie operations workflow

bdg https://example.com 2>&1

# Enable network
bdg cdp Network.enable 2>&1

# Get all cookies
bdg network getCookies 2>&1 | jq '.'

# Set authentication cookie
bdg cdp Network.setCookie '{
  "name": "auth_token",
  "value": "secret-token-123",
  "domain": "example.com",
  "path": "/",
  "secure": true,
  "httpOnly": true,
  "sameSite": "Strict"
}' 2>&1

# Verify cookie set
bdg cdp Network.getCookies '{"urls":["https://example.com"]}' 2>&1 | \
  jq '.result.cookies[] | select(.name=="auth_token")'

# Navigate with cookie
bdg cdp Page.navigate '{"url":"https://example.com/dashboard"}' 2>&1

bdg stop 2>&1
```

---

### Workflow 5: DOM Inspection and Modification

```bash
#!/bin/bash
# DOM inspection and modification

bdg https://example.com 2>&1

# Get document
doc_node=$(bdg cdp DOM.getDocument 2>&1 | jq '.result.root.nodeId')

# Find element by selector
element_node=$(bdg cdp DOM.querySelector "{
  \"nodeId\": $doc_node,
  \"selector\": \"h1\"
}" 2>&1 | jq '.result.nodeId')

# Get element HTML
bdg cdp DOM.getOuterHTML "{\"nodeId\": $element_node}" 2>&1 | jq -r '.result.outerHTML'

# Modify attribute
bdg cdp DOM.setAttributeValue "{
  \"nodeId\": $element_node,
  \"name\": \"class\",
  \"value\": \"modified\"
}" 2>&1

# Alternative: Use helper for simpler queries
bdg dom query "h1" 2>&1

bdg stop 2>&1
```

---

## 6. UNIX COMPOSABILITY PATTERNS

### Pattern 1: Pipe to jq for JSON Processing

```bash
# Extract specific fields
bdg cdp Page.getNavigationHistory 2>&1 | jq '.result.entries[] | .url'

# Filter results
bdg console --list 2>&1 | jq '.[] | select(.level == "error")'

# Transform output
bdg network getCookies 2>&1 | jq '[.[] | {name, domain, value}]'

# Count items
bdg cdp DOM.querySelectorAll '{"nodeId":1,"selector":"div"}' 2>&1 | \
  jq '.result.nodeIds | length'
```

---

### Pattern 2: Grep for Text Filtering

```bash
# Find errors in logs
bdg console --list 2>&1 | grep -i "error"

# Filter by URL pattern
bdg network har - 2>&1 | grep "api.example.com"

# Case-insensitive search
bdg cdp DOM.getDocument 2>&1 | grep -i "title"
```

---

### Pattern 3: Combine with curl and Other Tools

```bash
# Download screenshot and upload to S3
bdg dom screenshot - 2>&1 | aws s3 cp - s3://bucket/screenshot.png

# Extract data and POST to API
bdg dom eval "localStorage.getItem('data')" 2>&1 | \
  jq -r '.result.value' | \
  curl -X POST -d @- https://api.example.com/data

# Chain multiple operations
bdg cdp Page.captureScreenshot 2>&1 | \
  jq -r '.result.data' | \
  base64 -d > output.png
```

---

### Pattern 4: Loop Over Results

```bash
# Process multiple URLs
urls=("https://example.com" "https://test.com" "https://demo.com")

for url in "${urls[@]}"; do
  bdg "$url" 2>&1
  bdg dom screenshot "${url//https:\/\//}.png" 2>&1
  bdg stop 2>&1
done

# Batch cookie extraction
bdg https://example.com 2>&1
bdg network getCookies 2>&1 | jq -r '.[] | "\(.name)=\(.value)"' | \
while read cookie; do
  echo "$cookie" >> cookies.txt
done
bdg stop 2>&1
```

---

### Pattern 5: Error Stream Separation

```bash
# Capture stderr separately
bdg cdp Page.navigate '{"url":"invalid"}' 2>errors.log 1>output.json

# Check exit code
bdg status 2>&1
if [ $? -ne 0 ]; then
  echo "Session check failed"
  cat errors.log
fi

# Discard stderr
bdg cdp Network.enable 2>/dev/null

# Combine and filter
(bdg console --list 2>&1 | jq '.') || echo "Command failed"
```

---

## 7. DISCOVERY PATTERN EXAMPLES

### Before/After: Progressive Disclosure

❌ **BEFORE** (Anti-pattern - Guessing method names):
```bash
# Guessing method names without discovery
bdg cdp Page.screenshot 2>&1  # FAILS - wrong method name
bdg cdp Screenshot 2>&1       # FAILS - wrong domain
bdg cdp capture 2>&1          # FAILS - incomplete name

# Results in: "Error: Method not found"
# Wastes time with trial and error
```

✅ **AFTER** (Correct - Progressive disclosure):
```bash
# Step 1: List all domains
bdg cdp --list  # → Discover "Page" domain exists

**Validation**: `domains_discovered`

# Step 2: Explore specific domain
bdg cdp --describe Page  # → Find "captureScreenshot" method

**Validation**: `method_identified`

# Step 3: Get method details
bdg cdp --describe Page.captureScreenshot  # → See parameters and return type

**Validation**: `signature_understood`

# Step 4: Execute discovered method
bdg cdp Page.captureScreenshot 2>&1

**Validation**: `execution_successful`
```

**Why better**: No guessing, documentation always current, clear understanding before execution, eliminates trial-and-error.

**Finding Methods by Use Case**:

```bash
# Find cookie-related methods
bdg cdp --search cookie

# Find performance methods
bdg cdp --search performance

# Find DOM manipulation
bdg cdp --search DOM

# Find network interception
bdg cdp --search intercept
```

---

## 8. ADVANCED PATTERNS

### Multi-Session Management

```bash
# Session 1: Monitor network
bdg https://example.com 2>&1 &
SESSION_1_PID=$!

# Session 2: Different URL
bdg https://test.com 2>&1 &
SESSION_2_PID=$!

# Check both sessions
bdg status 2>&1

# Stop specific session (requires manual intervention or session IDs)
kill $SESSION_1_PID
kill $SESSION_2_PID
```

### Conditional Execution

```bash
# Execute CDP only if session active
if bdg status 2>&1 | grep -q "active"; then
  bdg cdp Page.captureScreenshot 2>&1
else
  echo "No active session"
fi

# Retry with exponential backoff
for i in {1..5}; do
  bdg https://example.com 2>&1 && break
  echo "Retry $i failed, waiting..."
  sleep $((2**i))
done
```

### Data Extraction Pipelines

```bash
# Extract, transform, load pattern
bdg https://example.com 2>&1 && \
bdg dom eval "document.querySelectorAll('a')" 2>&1 | \
jq -r '.result.value[] | .href' | \
sort -u > links.txt && \
bdg stop 2>&1

# Performance monitoring pipeline
bdg https://example.com 2>&1 && \
bdg cdp Performance.enable 2>&1 && \
sleep 5 && \
bdg cdp Performance.getMetrics 2>&1 | \
jq '.result.metrics[] | select(.name | contains("DOM"))' > perf.json && \
bdg stop 2>&1
```

---

## 9. BEST PRACTICES

1. **Always verify session status** before executing CDP commands
2. **Use helpers when available** (simpler than raw CDP)
3. **Capture stderr** with `2>&1` for comprehensive error handling
4. **Use jq for JSON processing** instead of string manipulation
5. **Clean up sessions** with `bdg stop` after completion
6. **Progressive disclosure** - start with --describe before executing
7. **Case-insensitive method names** - bdg normalizes automatically
8. **Semantic exit codes** - check `$?` for scripting

---

## 10. RELATED RESOURCES

### Reference Files
- [session_management.md](./session_management.md) - Advanced session lifecycle patterns and cleanup strategies
- [troubleshooting.md](./troubleshooting.md) - Error resolution and diagnostic procedures

### Related Skills
- `mcp-chrome-devtools` - Main skill orchestrator for bdg CLI workflows

### External Resources
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) - Official CDP documentation with 300+ methods across 53 domains
- [browser-debugger-cli GitHub](https://github.com/szymdzum/browser-debugger-cli) - Source repository and issue tracker

---

**Reference**: Full CDP documentation at https://chromedevtools.github.io/devtools-protocol/
