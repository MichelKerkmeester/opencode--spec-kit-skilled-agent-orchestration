---
title: Advanced Session Management
description: Patterns for browser session lifecycle, concurrency, resumption, and state persistence with bdg.
---

# Advanced Session Management

Advanced patterns for session lifecycle, multi-session handling, and state persistence.

---

## 1. OVERVIEW

Always verify session state before operations - session failures cascade. Implement proper cleanup patterns (trap-based) to prevent resource leaks and orphaned browser processes.

---

## 2. PREREQUISITES

**Foundation:** Follow session basics from SKILL.md Section 3 before using advanced patterns:
- **Session Lifecycle**: Start → Verify → Execute → Stop workflow
- **Session States**: inactive, starting, active, error
- **Basic Verification**: `bdg status 2>&1 | jq '.state'`
- See [../SKILL.md](../SKILL.md) Section 3 "HOW IT WORKS"

**Recommended Tools**:
- `jq` for JSON parsing (install: `brew install jq` or `apt-get install jq`)
- Bash 4.0+ for array support and trap handling

---

## 3. SESSION LIFECYCLE

### Basic Lifecycle Pattern

```bash
# 1. Start session
bdg <url>

# 2. Verify session active
bdg status

# 3. Execute operations
bdg cdp <Method>
bdg dom screenshot output.png
bdg console --list

# 4. Stop session
bdg stop
```

**Session States**:
- `inactive` - No browser connection
- `starting` - Browser launching
- `active` - Ready for commands
- `error` - Connection failed

---

## 4. SESSION START PATTERNS

### Standard Start

```bash
# Start with URL
bdg https://example.com 2>&1

# Check if started successfully
if bdg status 2>&1 | grep -q "active"; then
  echo "Session ready"
else
  echo "Session failed to start"
  exit 1
fi
```

### Start with Retry Logic

```bash
#!/bin/bash
# Robust session start with retries

MAX_RETRIES=3
RETRY_DELAY=2

start_session() {
  local url=$1
  local attempt=1

  while [ $attempt -le $MAX_RETRIES ]; do
    echo "Attempt $attempt: Starting session for $url"

    bdg "$url" 2>&1
    sleep $RETRY_DELAY

    if bdg status 2>&1 | grep -q "active"; then
      echo "Session started successfully"
      return 0
    fi

    echo "Retry $attempt failed"
    attempt=$((attempt + 1))
    sleep $((RETRY_DELAY * attempt))
  done

  echo "Failed to start session after $MAX_RETRIES attempts"
  return 1
}

start_session "https://example.com"
```

### Start with Timeout

```bash
#!/bin/bash
# Session start with timeout

SESSION_TIMEOUT=30

start_with_timeout() {
  local url=$1

  # Start in background
  bdg "$url" 2>&1 &
  local pid=$!

  # Wait with timeout
  local elapsed=0
  while [ $elapsed -lt $SESSION_TIMEOUT ]; do
    if bdg status 2>&1 | grep -q "active"; then
      echo "Session active after ${elapsed}s"
      return 0
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done

  echo "Session timeout after ${SESSION_TIMEOUT}s"
  kill $pid 2>/dev/null
  return 1
}

start_with_timeout "https://example.com"
```

---

## 5. SESSION STATUS VERIFICATION

### Status Check Patterns

```bash
# Simple status check
bdg status 2>&1

# Check and extract state
session_state=$(bdg status 2>&1 | jq -r '.state')
echo "Current state: $session_state"

# Conditional execution based on status
if bdg status 2>&1 | jq -e '.state == "active"' > /dev/null; then
  bdg dom screenshot output.png 2>&1
else
  echo "Session not active, cannot capture screenshot"
fi
```

### Health Check Function

```bash
#!/bin/bash
# Comprehensive session health check

check_session_health() {
  # Check if bdg is installed
  command -v bdg >/dev/null 2>&1 || {
    echo "ERROR: bdg not installed"
    echo "Install: npm install -g browser-debugger-cli@alpha"
    return 1
  }

  # Check session status
  local status_output=$(bdg status 2>&1)
  local exit_code=$?

  if [ $exit_code -ne 0 ]; then
    echo "ERROR: Status check failed"
    echo "$status_output"
    return 1
  fi

  # Parse status
  local state=$(echo "$status_output" | jq -r '.state // "unknown"')

  case "$state" in
    active)
      echo "✓ Session healthy and active"
      return 0
      ;;
    starting)
      echo "⚠ Session starting..."
      return 2
      ;;
    inactive)
      echo "✗ No active session"
      return 3
      ;;
    error)
      echo "✗ Session in error state"
      echo "$status_output" | jq '.error // "Unknown error"'
      return 4
      ;;
    *)
      echo "✗ Unknown session state: $state"
      return 5
      ;;
  esac
}

check_session_health
```

---

## 6. MULTI-SESSION MANAGEMENT

### Concurrent Sessions Pattern

```bash
#!/bin/bash
# Manage multiple browser sessions concurrently

# Session tracking
declare -A SESSIONS

start_tracked_session() {
  local name=$1
  local url=$2

  echo "Starting session: $name"
  bdg "$url" 2>&1

  # Store session metadata
  SESSIONS[$name]="$url"

  # Verify
  if bdg status 2>&1 | grep -q "active"; then
    echo "✓ Session $name active"
  else
    echo "✗ Session $name failed"
    unset SESSIONS[$name]
  fi
}

stop_tracked_session() {
  local name=$1

  if [ -n "${SESSIONS[$name]}" ]; then
    echo "Stopping session: $name"
    bdg stop 2>&1
    unset SESSIONS[$name]
  else
    echo "No session found: $name"
  fi
}

list_sessions() {
  echo "Active sessions:"
  for name in "${!SESSIONS[@]}"; do
    echo "  - $name: ${SESSIONS[$name]}"
  done
}

# Usage
start_tracked_session "production" "https://example.com"
start_tracked_session "staging" "https://staging.example.com"
list_sessions
stop_tracked_session "production"
stop_tracked_session "staging"
```

### Sequential Session Processing

```bash
#!/bin/bash
# Process multiple URLs sequentially with session cleanup

urls=(
  "https://example.com"
  "https://test.com"
  "https://demo.com"
)

process_url() {
  local url=$1
  local filename=$(echo "$url" | sed 's|https://||' | sed 's|/|-|g')

  echo "Processing: $url"

  # Start session
  bdg "$url" 2>&1 || return 1

  # Wait for page load
  sleep 3

  # Capture data
  bdg dom screenshot "${filename}.png" 2>&1
  bdg console --list 2>&1 > "${filename}-console.json"
  bdg network har "${filename}.har" 2>&1

  # Cleanup
  bdg stop 2>&1

  echo "✓ Completed: $url"
}

# Process each URL
for url in "${urls[@]}"; do
  process_url "$url" || echo "Failed: $url"
  sleep 2  # Cool-down between sessions
done
```

---

## 7. SESSION RESUMPTION

### Resume Check Pattern

```bash
#!/bin/bash
# Check if session can be resumed or needs restart

resume_or_start() {
  local url=$1

  # Check if session already active
  if bdg status 2>&1 | jq -e '.state == "active"' > /dev/null; then
    echo "Resuming existing session"

    # Verify session URL matches
    current_url=$(bdg cdp Page.getNavigationHistory 2>&1 | \
      jq -r '.result.entries[-1].url // ""')

    if [[ "$current_url" =~ ^"$url" ]]; then
      echo "✓ Session URL matches, resuming"
      return 0
    else
      echo "⚠ Session URL mismatch, restarting"
      bdg stop 2>&1
    fi
  fi

  # Start new session
  echo "Starting new session"
  bdg "$url" 2>&1
}

resume_or_start "https://example.com"
```

### Session State Persistence

```bash
#!/bin/bash
# Save and restore session state

SESSION_STATE_FILE="/tmp/bdg-session-state.json"

save_session_state() {
  echo "Saving session state..."

  local state=$(bdg status 2>&1)
  local cookies=$(bdg network getCookies 2>&1)
  local url=$(bdg cdp Page.getNavigationHistory 2>&1 | \
    jq -r '.result.entries[-1].url')

  jq -n \
    --argjson status "$state" \
    --argjson cookies "$cookies" \
    --arg url "$url" \
    '{
      timestamp: now,
      url: $url,
      status: $status,
      cookies: $cookies
    }' > "$SESSION_STATE_FILE"

  echo "✓ Session state saved to $SESSION_STATE_FILE"
}

restore_session_state() {
  if [ ! -f "$SESSION_STATE_FILE" ]; then
    echo "No saved session state found"
    return 1
  fi

  echo "Restoring session state..."

  local url=$(jq -r '.url' "$SESSION_STATE_FILE")
  local cookies=$(jq -r '.cookies' "$SESSION_STATE_FILE")

  # Start session
  bdg "$url" 2>&1

  # Restore cookies
  echo "$cookies" | jq -r '.[] | @json' | while read cookie; do
    bdg cdp Network.setCookie "$cookie" 2>&1 > /dev/null
  done

  echo "✓ Session state restored"
}

# Usage
save_session_state
bdg stop 2>&1
restore_session_state
```

---

## 8. ERROR HANDLING

### Session Error Recovery

```bash
#!/bin/bash
# Recover from session errors

recover_session() {
  local url=$1
  local max_attempts=3

  for attempt in $(seq 1 $max_attempts); do
    echo "Recovery attempt $attempt..."

    # Stop any existing session
    bdg stop 2>&1 2>/dev/null

    # Wait before retry
    sleep 2

    # Start new session
    bdg "$url" 2>&1

    # Verify
    if check_session_health; then
      echo "✓ Session recovered"
      return 0
    fi
  done

  echo "✗ Session recovery failed after $max_attempts attempts"
  return 1
}

# Usage
if ! check_session_health; then
  recover_session "https://example.com"
fi
```

### Graceful Degradation

```bash
#!/bin/bash
# Fallback to alternative approaches on session failure

capture_with_fallback() {
  local url=$1
  local output=$2

  # Try bdg dom screenshot
  if bdg dom screenshot "$output" 2>&1; then
    echo "✓ Screenshot captured with bdg"
    return 0
  fi

  echo "⚠ bdg failed, trying CDP method..."

  # Fallback to CDP screenshot
  if bdg cdp Page.captureScreenshot 2>&1 | \
     jq -r '.result.data' | \
     base64 -d > "$output"; then
    echo "✓ Screenshot captured with CDP"
    return 0
  fi

  echo "✗ All screenshot methods failed"
  return 1
}

capture_with_fallback "https://example.com" "output.png"
```

---

## 9. SESSION CLEANUP

### Before/After: Cleanup Patterns

❌ **BEFORE** (Anti-pattern - No cleanup):
```bash
#!/bin/bash
# Missing cleanup - resource leak risk

bdg https://example.com 2>&1
bdg dom screenshot output.png 2>&1
bdg console --list 2>&1

# Script exits without stopping session
# → Browser process remains running
# → Session resources not released
# → Next script may fail with "session already active"
```

✅ **AFTER** (Correct - Trap-based cleanup):
```bash
#!/bin/bash
# Automatic cleanup via trap handler

cleanup() {
  echo "Cleaning up session..."
  bdg stop 2>&1 > /dev/null
  echo "✓ Cleanup complete"
}

# Register cleanup on EXIT, INT (Ctrl+C), TERM
trap cleanup EXIT INT TERM

**Validation**: `cleanup_registered`

# Session work
bdg https://example.com 2>&1
bdg dom screenshot output.png 2>&1
bdg console --list 2>&1

**Validation**: `operations_complete`

# Cleanup happens automatically on exit (success or error)
# → Session always stopped
# → Resources always released
# → No orphaned processes
```

**Why better**: Cleanup guaranteed even on errors/interrupts, prevents resource leaks, ensures deterministic state.

### Cleanup Verification

```bash
#!/bin/bash
# Verify session stopped successfully

stop_and_verify() {
  echo "Stopping session..."

  bdg stop 2>&1

  # Wait briefly
  sleep 1

  # Verify stopped
  if bdg status 2>&1 | jq -e '.state == "inactive"' > /dev/null; then
    echo "✓ Session stopped successfully"
    return 0
  else
    echo "⚠ Session may still be active"
    return 1
  fi
}

stop_and_verify
```

---

## 10. PERFORMANCE OPTIMIZATION

### Session Pooling Pattern

```bash
#!/bin/bash
# Keep session warm for multiple operations

SESSION_WARMUP_URL="https://example.com"
SESSION_IDLE_TIMEOUT=60

warm_session() {
  # Check if session active
  if bdg status 2>&1 | jq -e '.state == "active"' > /dev/null; then
    echo "Session already warm"
    return 0
  fi

  # Start warmup session
  echo "Warming up session..."
  bdg "$SESSION_WARMUP_URL" 2>&1

  # Pre-enable common domains
  bdg cdp Network.enable 2>&1 > /dev/null
  bdg cdp Runtime.enable 2>&1 > /dev/null
  bdg cdp DOM.enable 2>&1 > /dev/null

  echo "✓ Session warmed up and ready"
}

# Keep session alive during idle
keep_alive() {
  local last_use=$(date +%s)

  while true; do
    local now=$(date +%s)
    local idle=$((now - last_use))

    if [ $idle -gt $SESSION_IDLE_TIMEOUT ]; then
      echo "Session idle timeout, stopping..."
      bdg stop 2>&1
      break
    fi

    sleep 10
  done
}

# Usage
warm_session
# ... perform operations ...
keep_alive &
```

### Batch Operations

```bash
#!/bin/bash
# Batch multiple operations in single session

batch_operations() {
  local url=$1
  shift
  local operations=("$@")

  # Start session once
  bdg "$url" 2>&1

  # Execute all operations
  for op in "${operations[@]}"; do
    echo "Executing: $op"
    eval "$op" 2>&1
  done

  # Stop once
  bdg stop 2>&1
}

# Usage
batch_operations "https://example.com" \
  "bdg dom screenshot page.png" \
  "bdg console --list > console.json" \
  "bdg network getCookies > cookies.json" \
  "bdg network har network.har"
```

---

## 11. BEST PRACTICES

1. **Always verify session state** before executing operations
2. **Use trap for cleanup** to ensure sessions are stopped on script exit
3. **Implement retry logic** for production scripts
4. **Track multiple sessions** with metadata when running concurrent operations
5. **Save session state** for resumption after interruptions
6. **Enable common domains upfront** (Network, Runtime, DOM) for better performance
7. **Implement health checks** with meaningful error messages
8. **Use timeouts** to prevent hanging on failed session starts
9. **Clean up sessions** promptly to release browser resources
10. **Log session lifecycle events** for debugging

---

## 12. RELATED RESOURCES

### Reference Files
- [cdp_patterns.md](./cdp_patterns.md) - Complete CDP command examples and domain-specific patterns
- [troubleshooting.md](./troubleshooting.md) - Diagnostic steps and error resolution guide

### Related Skills
- `mcp-chrome-devtools` - Main skill orchestrator for bdg CLI workflows

### External Resources
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) - Official CDP documentation
- [browser-debugger-cli GitHub](https://github.com/szymdzum/browser-debugger-cli) - Source repository and issue tracker

---

**Note**: bdg manages browser sessions internally. These patterns provide robust handling for production scripts and automation workflows.
