#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// BUILD: TEST MINIFIED RUNTIME
// ───────────────────────────────────────────────────────────────
//
// Usage:
//   node scripts/test-minified-runtime.mjs
//
// Executes each minified script in a mock browser environment to catch:
// - Syntax errors
// - ReferenceError for undefined variables
// - Runtime exceptions
// - Missing dependencies

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, relative } from 'path';
import vm from 'vm';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const OUTPUT_DIR = 'src/2_javascript/z_minified';

// Folders to skip
const SKIP_FOLDERS = ['node_modules', '.git'];

/* ─────────────────────────────────────────────────────────────
   2. MOCK ENVIRONMENT
──────────────────────────────────────────────────────────────── */

// Create mock browser environment
function create_mock_environment() {
  // Mock element
  const mock_element = {
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false,
    },
    dataset: {},
    getAttribute: () => null,
    setAttribute: () => {},
    removeAttribute: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: () => mock_element,
    removeChild: () => mock_element,
    insertBefore: () => mock_element,
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
    matches: () => false,
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    offsetWidth: 0,
    offsetHeight: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
    focus: () => {},
    blur: () => {},
    click: () => {},
    dispatchEvent: () => true,
  };

  // Mock document
  const mock_document = {
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ ...mock_element }),
    createTextNode: () => ({}),
    body: { ...mock_element },
    head: { ...mock_element },
    documentElement: { ...mock_element },
    addEventListener: () => {},
    removeEventListener: () => {},
    readyState: 'complete',
    fonts: {
      ready: Promise.resolve(),
      check: () => true,
    },
  };

  // Mock window
  const mock_window = {
    document: mock_document,
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: (fn) => {
      try {
        fn();
      } catch (e) {}
      return 1;
    },
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    requestAnimationFrame: (fn) => {
      try {
        fn(0);
      } catch (e) {}
      return 1;
    },
    cancelAnimationFrame: () => {},
    getComputedStyle: () => ({}),
    matchMedia: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    innerWidth: 1920,
    innerHeight: 1080,
    scrollX: 0,
    scrollY: 0,
    scrollTo: () => {},
    location: {
      href: 'https://example.com',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'https://example.com',
    },
    history: {
      pushState: () => {},
      replaceState: () => {},
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    navigator: {
      userAgent: 'Mozilla/5.0 (Mock)',
      language: 'en-US',
    },
    performance: {
      now: () => Date.now(),
    },
    console: {
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {},
      debug: () => {},
    },

    // Library mocks
    Webflow: {
      push: (fn) => {
        try {
          fn();
        } catch (e) {}
      },
    },
    Motion: {
      animate: () => ({ finished: Promise.resolve() }),
      timeline: () => ({}),
      stagger: () => 0,
      spring: () => ({}),
    },
    gsap: {
      to: () => ({}),
      from: () => ({}),
      fromTo: () => ({}),
      set: () => ({}),
      timeline: () => ({
        to: () => ({}),
        from: () => ({}),
        add: () => ({}),
      }),
      registerPlugin: () => {},
      utils: {
        toArray: () => [],
      },
    },
    ScrollTrigger: {
      create: () => ({}),
      refresh: () => {},
      update: () => {},
      getAll: () => [],
      kill: () => {},
    },
    Swiper: class MockSwiper {
      constructor() {
        this.slides = [];
        this.activeIndex = 0;
      }
      slideTo() {}
      update() {}
      destroy() {}
    },
    Hls: class MockHls {
      static isSupported() {
        return true;
      }
      constructor() {}
      loadSource() {}
      attachMedia() {}
      destroy() {}
      on() {}
      off() {}
    },

    // Observer mocks
    IntersectionObserver: class MockIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    ResizeObserver: class MockResizeObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    MutationObserver: class MockMutationObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },

    // Fetch mock
    fetch: () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
      }),
  };

  // Add self-reference
  mock_window.window = mock_window;
  mock_window.self = mock_window;
  mock_window.globalThis = mock_window;

  return mock_window;
}

/* ─────────────────────────────────────────────────────────────
   3. UTILITIES
──────────────────────────────────────────────────────────────── */

// Recursively find all .js files in directory
function find_js_files(dir, base_dir = dir) {
  const files = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full_path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_FOLDERS.includes(entry.name)) {
        files.push(...find_js_files(full_path, base_dir));
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(relative(base_dir, full_path));
    }
  }

  return files;
}

/* ─────────────────────────────────────────────────────────────
   4. TESTING
──────────────────────────────────────────────────────────────── */

// Test a single minified file
function test_file(relative_path) {
  const file_path = join(OUTPUT_DIR, relative_path);

  if (!existsSync(file_path)) {
    return { status: 'SKIP', message: 'File not found' };
  }

  const code = readFileSync(file_path, 'utf-8');

  // Create fresh mock environment
  const mock_env = create_mock_environment();

  try {
    // Create VM context
    const context = vm.createContext(mock_env);

    // Execute the script
    vm.runInContext(code, context, {
      filename: relative_path,
      timeout: 5000, // 5 second timeout
    });

    // Check for init flags that should be set
    const init_flag_pattern = /__[a-zA-Z_]+Init/g;
    const expected_flags = code.match(init_flag_pattern) || [];
    const set_flags = [];

    for (const flag of expected_flags) {
      if (context[flag] || context.window?.[flag]) {
        set_flags.push(flag);
      }
    }

    return {
      status: 'PASS',
      set_flags,
    };
  } catch (error) {
    return {
      status: 'FAIL',
      error: error.message,
      stack: error.stack,
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   5. MAIN EXECUTION
──────────────────────────────────────────────────────────────── */

function main() {
  console.log('=== RUNTIME TEST REPORT ===\n');

  // Find all minified files
  const files = find_js_files(OUTPUT_DIR);

  if (files.length === 0) {
    console.log('No minified files found in', OUTPUT_DIR);
    console.log('Run minify-webflow.mjs first.');
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    const result = test_file(file);

    console.log(file);

    if (result.status === 'SKIP') {
      console.log(`  ⊘ SKIP: ${result.message}`);
      skipped++;
      continue;
    }

    if (result.status === 'PASS') {
      console.log('  ✓ Script executed without errors');

      if (result.set_flags.length > 0) {
        for (const flag of result.set_flags) {
          console.log(`  ✓ Init flag set: ${flag}`);
        }
      }

      console.log('  RESULT: PASS\n');
      passed++;
    } else {
      console.log(`  ✗ FAIL: ${result.error}`);
      if (result.stack) {
        const stack_lines = result.stack.split('\n').slice(1, 4);
        for (const line of stack_lines) {
          console.log(`    ${line.trim()}`);
        }
      }
      console.log('  RESULT: FAIL\n');
      failed++;
    }
  }

  // Summary
  console.log('=== SUMMARY ===');
  console.log(`Passed:  ${passed}/${files.length}`);
  console.log(`Failed:  ${failed}/${files.length}`);
  console.log(`Skipped: ${skipped}/${files.length}`);

  if (failed > 0) {
    console.log('\n⚠️  RUNTIME TESTS FAILED - Do not deploy!');
    console.log('Fix the errors above before proceeding.');
    process.exit(1);
  }

  console.log('\n✓ All runtime tests passed');
  console.log('Next: Test in browser with bdg or manual testing');
}

main();
