---
title: Troubleshooting Guide
description: Error resolution guide for common bdg issues with diagnostic steps and solutions.
---

# Troubleshooting Guide

Systematic diagnostics and solutions for bdg CLI issues.

---

## 1. OVERVIEW

Find root cause before attempting fixes - symptom fixes create cascading failures. Always run systematic diagnostics (5-check sequence) before implementing solutions.

---

## 2. PREREQUISITES

**Foundation:** Run quick diagnostics from this guide before deeper troubleshooting:
- **5-Check Sequence**: Installation → Version → Session → Browser → Node/npm
- **Platform Awareness**: macOS (native), Linux (native), Windows (WSL only)
- **Error Capture**: Always use `2>&1` to see full error output
- See Quick Diagnostics section below for complete diagnostic sequence

**Required Knowledge**:
- Basic Bash/terminal usage
- Package manager familiarity (npm, brew, apt)
- Path and environment variable concepts

---

## 3. QUICK DIAGNOSTICS

**Run these checks first**:

```bash
# 1. Check bdg installation
command -v bdg || echo "bdg not found - install with: npm install -g browser-debugger-cli@alpha"

# 2. Check bdg version
bdg --version 2>&1

# 3. Check session status
bdg status 2>&1

# 4. Check Chrome/Chromium availability
which google-chrome chromium-browser chromium 2>/dev/null

# 5. Check node/npm versions
node --version
npm --version
```

---

## 4. INSTALLATION ISSUES

### Issue: bdg command not found

**Symptoms**:
```bash
$ bdg https://example.com
bash: bdg: command not found
```

**Diagnosis**:
```bash
# Check if installed
npm list -g browser-debugger-cli

# Check npm global bin path
npm config get prefix
echo $PATH
```

**Solutions**:

1. **Install bdg**:
   ```bash
   npm install -g browser-debugger-cli@alpha
   ```

2. **Fix PATH if npm bin not in PATH**:
   ```bash
   # Find npm global bin directory
   NPM_BIN=$(npm config get prefix)/bin

   # Add to PATH (bash)
   echo 'export PATH="$PATH:'$NPM_BIN'"' >> ~/.bashrc
   source ~/.bashrc

   # Add to PATH (zsh)
   echo 'export PATH="$PATH:'$NPM_BIN'"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Use npx as alternative**:
   ```bash
   npx browser-debugger-cli https://example.com
   ```

---

### Issue: npm install fails

**Symptoms**:
```bash
$ npm install -g browser-debugger-cli@alpha
npm ERR! code EACCES
npm ERR! syscall access
```

**Diagnosis**:
```bash
# Check npm permissions
npm config get prefix
ls -la $(npm config get prefix)
```

**Solutions**:

1. **Use npx (no global install needed)**:
   ```bash
   npx browser-debugger-cli@alpha https://example.com
   ```

2. **Fix npm permissions** (recommended):
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc

   npm install -g browser-debugger-cli@alpha
   ```

3. **Use sudo** (not recommended):
   ```bash
   sudo npm install -g browser-debugger-cli@alpha
   ```

---

### Issue: Wrong Node version

**Symptoms**:
```bash
$ bdg --version
Error: Node version too old
```

**Diagnosis**:
```bash
node --version
# bdg requires Node.js 14.x or higher
```

**Solution**:
```bash
# Install/update Node.js
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from nodejs.org
```

---

## 5. BROWSER CONNECTION ISSUES

### Issue: Browser not found

**Symptoms**:
```bash
$ bdg https://example.com
Error: Could not find Chrome/Chromium executable
```

**Diagnosis**:
```bash
# Check for Chrome/Chromium
which google-chrome google-chrome-stable chromium chromium-browser

# Check environment variable
echo $CHROME_PATH
```

**Solutions**:

1. **macOS**:
   ```bash
   # Set Chrome path
   export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

   # Add to shell profile
   echo 'export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"' >> ~/.zshrc
   ```

2. **Linux**:
   ```bash
   # Install Chromium
   sudo apt-get install chromium-browser  # Debian/Ubuntu
   sudo yum install chromium              # RHEL/CentOS
   sudo pacman -S chromium                # Arch

   # Or set custom path
   export CHROME_PATH=/usr/bin/chromium-browser
   ```

3. **Windows (WSL)**:
   ```bash
   # Install Chrome in WSL or point to Windows Chrome
   export CHROME_PATH="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
   ```

---

### Before/After: Systematic Troubleshooting

❌ **BEFORE** (Anti-pattern - Guessing fixes):
```bash
# Browser won't launch - trying random fixes
export CHROME_PATH=/usr/bin/chrome  # Guess 1
bdg https://example.com 2>&1  # Still fails

killall chrome  # Guess 2
bdg https://example.com 2>&1  # Still fails

sudo bdg https://example.com 2>&1  # Guess 3 - dangerous!
# Still fails, now with permission issues

# Results: Wasted time, created new problems, no root cause identified
```

✅ **AFTER** (Correct - Systematic diagnosis):
```bash
# Step 1: Run 5-check diagnostic sequence
command -v bdg  # → ✓ Installed

**Validation**: `installation_verified`

bdg --version 2>&1  # → ✓ v1.0.0

**Validation**: `version_confirmed`

which google-chrome chromium-browser  # → ✗ Not found

**Validation**: `browser_missing` (root cause identified!)

# Step 2: Fix root cause (install browser)
brew install --cask google-chrome  # macOS

**Validation**: `browser_installed`

# Step 3: Verify fix
bdg https://example.com 2>&1  # → ✓ Works!

**Validation**: `session_started`
```

**Why better**: Systematic approach finds root cause, no guessing, verifiable checkpoints, prevents cascading issues.

---

### Issue: Browser launch fails

**Symptoms**:
```bash
$ bdg https://example.com
Error: Failed to launch browser
Timeout waiting for browser connection
```

**Diagnosis**:
```bash
# Check if Chrome can launch manually
google-chrome --version

# Check for conflicting processes
ps aux | grep chrome

# Check available ports
netstat -an | grep 9222  # Default debugging port
```

**Solutions**:

1. **Kill existing Chrome instances**:
   ```bash
   # macOS/Linux
   pkill -f chrome

   # Verify
   ps aux | grep chrome
   ```

2. **Use different debugging port**:
   ```bash
   export CHROME_DEBUGGING_PORT=9223
   bdg https://example.com 2>&1
   ```

3. **Run with headless mode** (if display issues):
   ```bash
   export CHROME_HEADLESS=true
   bdg https://example.com 2>&1
   ```

4. **Check permissions** (Linux):
   ```bash
   # Add to chrome-sandbox group
   sudo chown root:root /opt/google/chrome/chrome-sandbox
   sudo chmod 4755 /opt/google/chrome/chrome-sandbox
   ```

---

## 6. SESSION MANAGEMENT ISSUES

### Issue: Session won't start

**Symptoms**:
```bash
$ bdg https://example.com
$ bdg status
{ "state": "inactive" }
```

**Diagnosis**:
```bash
# Check stderr output
bdg https://example.com 2>&1 | tee debug.log

# Check system resources
free -h  # Linux
vm_stat  # macOS

# Check network connectivity
curl -I https://example.com
```

**Solutions**:

1. **Verify URL is accessible**:
   ```bash
   curl -I https://example.com
   # Should return HTTP 200 OK
   ```

2. **Increase timeout**:
   ```bash
   export BDG_TIMEOUT=60000  # 60 seconds
   bdg https://example.com 2>&1
   ```

3. **Check for certificate errors**:
   ```bash
   # Bypass SSL verification (not for production)
   export NODE_TLS_REJECT_UNAUTHORIZED=0
   bdg https://example.com 2>&1
   ```

4. **Start with simpler URL**:
   ```bash
   # Test with simple page first
   bdg https://example.com 2>&1
   ```

---

### Issue: Session stuck in "starting" state

**Symptoms**:
```bash
$ bdg status
{ "state": "starting", "duration": "300s" }
```

**Diagnosis**:
```bash
# Check Chrome process
ps aux | grep chrome

# Check logs
bdg status 2>&1 | jq '.logs // []'
```

**Solutions**:

1. **Force stop and restart**:
   ```bash
   bdg stop 2>&1
   sleep 3
   pkill -9 -f chrome  # Force kill if needed
   bdg https://example.com 2>&1
   ```

2. **Clear bdg state**:
   ```bash
   # Find and remove state files
   rm -rf ~/.bdg/state 2>/dev/null
   bdg https://example.com 2>&1
   ```

---

### Issue: Multiple sessions conflict

**Symptoms**:
```bash
$ bdg https://example.com
Error: Another session already active
```

**Diagnosis**:
```bash
bdg status 2>&1
ps aux | grep bdg
```

**Solutions**:

1. **Stop existing session**:
   ```bash
   bdg stop 2>&1
   ```

2. **Kill all bdg processes**:
   ```bash
   pkill -f "bdg "
   pkill -f browser-debugger-cli
   ```

3. **Use session management pattern**:
   ```bash
   # Check before starting
   if bdg status 2>&1 | jq -e '.state == "active"' > /dev/null; then
     echo "Stopping existing session"
     bdg stop 2>&1
   fi

   bdg https://example.com 2>&1
   ```

---

## 7. CDP COMMAND ISSUES

### Issue: CDP method not found

**Symptoms**:
```bash
$ bdg cdp Page.screenshot
Error: Method not found: Page.screenshot
```

**Diagnosis**:
```bash
# Discover correct method name
bdg cdp --search screenshot

# Check domain
bdg cdp --describe Page
```

**Solution**:

Use correct method name (case matters):
```bash
# Correct
bdg cdp Page.captureScreenshot 2>&1

# Also works (bdg normalizes case)
bdg cdp page.capturescreenshot 2>&1

# Use helper instead
bdg dom screenshot output.png 2>&1
```

---

### Issue: CDP method fails with parameter error

**Symptoms**:
```bash
$ bdg cdp Page.navigate '{"url":"example.com"}'
Error: Invalid URL format
```

**Diagnosis**:
```bash
# Check method signature
bdg cdp --describe Page.navigate

# Validate JSON
echo '{"url":"example.com"}' | jq .
```

**Solutions**:

1. **Fix parameter format**:
   ```bash
   # Use full URL with protocol
   bdg cdp Page.navigate '{"url":"https://example.com"}' 2>&1
   ```

2. **Escape quotes properly**:
   ```bash
   # Use single quotes for JSON, double quotes inside
   bdg cdp Page.navigate '{"url":"https://example.com","referrer":"https://google.com"}' 2>&1

   # Or escape double quotes
   bdg cdp Page.navigate "{\"url\":\"https://example.com\"}" 2>&1
   ```

3. **Use jq to build JSON**:
   ```bash
   params=$(jq -n --arg url "https://example.com" '{url: $url}')
   bdg cdp Page.navigate "$params" 2>&1
   ```

---

### Issue: Session required for CDP command

**Symptoms**:
```bash
$ bdg cdp Page.captureScreenshot
Error: No active session
```

**Solution**:

Start session first:
```bash
# Always verify session before CDP commands
if ! bdg status 2>&1 | jq -e '.state == "active"' > /dev/null; then
  bdg https://example.com 2>&1
fi

# Now execute CDP command
bdg cdp Page.captureScreenshot 2>&1
```

---

## Output Parsing Issues

### Issue: jq parse error

**Symptoms**:
```bash
$ bdg status | jq .
parse error: Invalid numeric literal at line 1, column 10
```

**Diagnosis**:
```bash
# Check raw output
bdg status 2>&1

# Check if stderr mixed with stdout
bdg status 2>&1 | head
```

**Solutions**:

1. **Always use 2>&1 to capture stderr**:
   ```bash
   bdg status 2>&1 | jq '.'
   ```

2. **Filter non-JSON lines**:
   ```bash
   bdg status 2>&1 | grep '^{' | jq '.'
   ```

3. **Handle errors gracefully**:
   ```bash
   output=$(bdg status 2>&1)
   if echo "$output" | jq . > /dev/null 2>&1; then
     echo "$output" | jq '.state'
   else
     echo "Error: Invalid JSON output"
     echo "$output"
   fi
   ```

---

### Issue: Binary data in stdout

**Symptoms**:
```bash
$ bdg dom screenshot - | jq .
Binary file (standard input) matches
```

**Solution**:

Handle binary output correctly:
```bash
# Save to file
bdg dom screenshot output.png 2>&1

# Or pipe to base64
bdg cdp Page.captureScreenshot 2>&1 | jq -r '.result.data' | base64 -d > output.png

# Don't pipe binary to jq
```

---

## 8. PERFORMANCE ISSUES

### Issue: Slow CDP command execution

**Symptoms**:
```bash
$ time bdg cdp Page.captureScreenshot
real    0m15.432s  # Should be much faster
```

**Diagnosis**:
```bash
# Check network latency
ping example.com

# Check browser resources
bdg cdp Memory.getDOMCounters 2>&1

# Check page complexity
bdg dom eval "document.querySelectorAll('*').length" 2>&1
```

**Solutions**:

1. **Enable CDP domains once upfront**:
   ```bash
   # Enable at session start
   bdg https://example.com 2>&1
   bdg cdp Network.enable 2>&1
   bdg cdp Runtime.enable 2>&1
   bdg cdp DOM.enable 2>&1

   # Now commands execute faster
   bdg console --list 2>&1
   ```

2. **Use helpers instead of raw CDP**:
   ```bash
    # Faster
    bdg dom screenshot output.png 2>&1

    # Slower (raw CDP)
   bdg cdp Page.captureScreenshot 2>&1 | jq -r '.result.data' | base64 -d > output.png
   ```

3. **Reduce page complexity**:
   ```bash
   # Block images/media
   bdg cdp Network.setBlockedURLs '{"urls":["*.jpg","*.png","*.mp4"]}' 2>&1
   ```

---

### Issue: High memory usage

**Symptoms**:
```bash
$ ps aux | grep chrome
... 4.5G ...  # High memory
```

**Solutions**:

1. **Stop sessions promptly**:
   ```bash
   # Always cleanup
   trap "bdg stop 2>&1" EXIT
   ```

2. **Limit concurrent sessions**:
   ```bash
   # Process sequentially instead of parallel
   for url in "${urls[@]}"; do
     bdg "$url" 2>&1
     # ... operations ...
     bdg stop 2>&1
   done
   ```

3. **Clear cache between sessions**:
   ```bash
   bdg cdp Network.clearBrowserCache 2>&1
   bdg cdp Network.clearBrowserCookies 2>&1
   ```

---

## 9. PLATFORM-SPECIFIC ISSUES

### macOS: Gatekeeper blocking Chrome

**Symptoms**:
```bash
Error: Chrome blocked by Gatekeeper
```

**Solution**:
```bash
# Allow Chrome in Security & Privacy settings
# Or use command
xattr -d com.apple.quarantine "/Applications/Google Chrome.app"
```

---

### Linux: Sandbox issues

**Symptoms**:
```bash
Error: Failed to move to new namespace
```

**Solution**:
```bash
# Disable sandbox (NOT for production)
export CHROME_DEVEL_SANDBOX=/dev/null

# Or fix permissions
sudo sysctl kernel.unprivileged_userns_clone=1
```

---

### Windows (WSL): Display issues

**Symptoms**:
```bash
Error: Could not open display
```

**Solution**:
```bash
# Use headless mode
export CHROME_HEADLESS=true

# Or setup X11 forwarding
export DISPLAY=:0
```

---

## 10. ERROR CODE REFERENCE

| Exit Code | Meaning | Solution |
|-----------|---------|----------|
| 0 | Success | N/A |
| 1 | General error | Check stderr output |
| 2 | Installation issue | Verify bdg installed |
| 3 | Browser launch failed | Check Chrome/Chromium path |
| 4 | Session timeout | Increase timeout or check URL |
| 5 | CDP method error | Verify method name and parameters |
| 6 | No active session | Start session first |
| 127 | Command not found | Install bdg or fix PATH |

---

## 11. DEBUG MODE

**Enable verbose logging**:
```bash
# Set debug environment variable
export DEBUG=bdg:*

# Run command
bdg https://example.com 2>&1 | tee debug.log

# Or increase log level
export BDG_LOG_LEVEL=debug
bdg status 2>&1
```

---

## 12. GETTING HELP

1. **Check documentation**: https://github.com/szymdzum/browser-debugger-cli
2. **Search issues**: https://github.com/szymdzum/browser-debugger-cli/issues
3. **Report bug** with:
   - bdg version (`bdg --version`)
   - Platform (macOS/Linux/WSL)
   - Node version (`node --version`)
   - Full error output (with `2>&1`)
   - Minimal reproduction steps

---

## 13. COMMON SOLUTIONS CHECKLIST

Before reporting issues, try these:

- [ ] bdg installed globally (`npm install -g browser-debugger-cli@alpha`)
- [ ] bdg in PATH (`command -v bdg`)
- [ ] Chrome/Chromium installed and accessible
- [ ] Session started before CDP commands
- [ ] Session stopped after operations
- [ ] Using `2>&1` to capture full output
- [ ] Valid JSON for CDP parameters
- [ ] Correct CDP method names (check with `--describe`)
- [ ] No conflicting Chrome processes
- [ ] Sufficient system resources (memory, CPU)

---

## 14. RELATED RESOURCES

### Reference Files
- [session_management.md](./session_management.md) - Session lifecycle patterns for robust automation
- [cdp_patterns.md](./cdp_patterns.md) - CDP command examples and domain-specific patterns

### Related Skills
- `mcp-chrome-devtools` - Main skill orchestrator for bdg CLI workflows

### External Resources
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) - Official CDP documentation
- [browser-debugger-cli GitHub](https://github.com/szymdzum/browser-debugger-cli) - Source repository for reporting issues
- [Node.js Downloads](https://nodejs.org/) - Required runtime environment (14.x+)

---

**Note**: Most issues stem from missing installation, session state mismanagement, or incorrect CDP parameter format. Always verify session status before executing commands.
