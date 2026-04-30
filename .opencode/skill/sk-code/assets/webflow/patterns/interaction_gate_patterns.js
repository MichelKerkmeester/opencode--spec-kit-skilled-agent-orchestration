'/**
 * INTERACTION GATE PATTERNS
 *
 * Reusable helpers for interaction-gated, viewport-gated, and idle-fallback loading.
 * Designed for non-critical modules that need idempotent initialization and one-time
 * script loading during performance remediation work.
 */

'use strict';

const script_load_cache = new Map();

function load_script_once(src, options = {}) {
  const {
    async = true,
    type = '',
    crossorigin = false,
    attributes = {},
  } = options;

  if (!src) {
    return Promise.reject(new Error('load_script_once requires a src value'));
  }

  if (script_load_cache.has(src)) {
    return script_load_cache.get(src);
  }

  const existing_script = Array.from(document.scripts).find((script) => {
    return script.dataset.gateSrc === src || script.getAttribute('src') === src;
  });

  if (existing_script) {
    const existing_promise = new Promise((resolve, reject) => {
      if (existing_script.dataset.loaded === 'true') {
        resolve(existing_script);
        return;
      }

      existing_script.addEventListener('load', () => resolve(existing_script), { once: true });
      existing_script.addEventListener('error', () => reject(new Error('Failed to load script: ' + src)), { once: true });
    });

    script_load_cache.set(src, existing_promise);
    return existing_promise;
  }

  const load_promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.dataset.gateSrc = src;

    if (type) {
      script.type = type;
    }

    if (crossorigin) {
      script.crossOrigin = 'anonymous';
    }

    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        script.setAttribute(key, String(value));
      }
    });

    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve(script);
    }, { once: true });

    script.addEventListener('error', () => {
      script_load_cache.delete(src);
      reject(new Error('Failed to load script: ' + src));
    }, { once: true });

    document.head.appendChild(script);
  });

  script_load_cache.set(src, load_promise);
  return load_promise;
}

function with_idempotent_init(init_fn) {
  let init_promise = null;

  return function init_once(...args) {
    if (init_promise) {
      return init_promise;
    }

    init_promise = Promise.resolve().then(() => init_fn.apply(this, args)).catch((error) => {
      init_promise = null;
      throw error;
    });

    return init_promise;
  };
}

function create_first_interaction_trigger(options = {}) {
  const {
    on_trigger = () => {},
    target = document,
    include_focus = true,
    include_scroll_intent = true,
    keyboard_keys = ['Enter', ' ', 'Spacebar', 'Tab', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'],
  } = options;

  const run_once = with_idempotent_init(on_trigger);
  let fired = false;
  const listeners = [];

  function cleanup() {
    listeners.forEach(({ event_name, handler, event_options }) => {
      target.removeEventListener(event_name, handler, event_options);
    });
    listeners.length = 0;
  }

  function fire(event) {
    if (fired) {
      return;
    }

    fired = true;
    cleanup();
    run_once(event);
  }

  function add_listener(event_name, handler, event_options) {
    target.addEventListener(event_name, handler, event_options);
    listeners.push({ event_name, handler, event_options });
  }

  add_listener('pointerdown', fire, { passive: true });

  add_listener('keydown', (event) => {
    if (keyboard_keys.includes(event.key)) {
      fire(event);
    }
  });

  if (include_focus) {
    add_listener('focusin', fire);
  }

  if (include_scroll_intent) {
    add_listener('wheel', fire, { passive: true });
    add_listener('touchmove', fire, { passive: true });
  }

  return {
    fire,
    dispose: cleanup,
    get fired() {
      return fired;
    },
  };
}

function create_viewport_trigger(options = {}) {
  const {
    element,
    on_trigger = () => {},
    threshold = 0.2,
    root = null,
    root_margin = '200px 0px',
    fallback,
  } = options;

  if (!element) {
    throw new Error('create_viewport_trigger requires an element');
  }

  const run_once = with_idempotent_init(on_trigger);
  let observer = null;

  function disconnect() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function fire(entry) {
    disconnect();
    return run_once(entry);
  }

  if (!('IntersectionObserver' in window)) {
    if (typeof fallback === 'function') {
      fallback();
    } else {
      fire();
    }

    return { disconnect, fire };
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        fire(entry);
      }
    });
  }, {
    root,
    rootMargin: root_margin,
    threshold: [0, threshold],
  });

  observer.observe(element);

  return { disconnect, fire };
}

function schedule_idle_fallback(callback, options = {}) {
  const { timeout = 2500, fallback_delay = 2000 } = options;
  const run_once = with_idempotent_init(callback);
  let handle = null;

  if ('requestIdleCallback' in window) {
    handle = window.requestIdleCallback(() => {
      run_once();
    }, { timeout });

    return {
      cancel() {
        window.cancelIdleCallback(handle);
      },
      run: run_once,
    };
  }

  handle = window.setTimeout(() => {
    run_once();
  }, fallback_delay);

  return {
    cancel() {
      window.clearTimeout(handle);
    },
    run: run_once,
  };
}

if (typeof window !== 'undefined') {
  window.InteractionGatePatterns = {
    load_script_once,
    with_idempotent_init,
    create_first_interaction_trigger,
    create_viewport_trigger,
    schedule_idle_fallback,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    load_script_once,
    with_idempotent_init,
    create_first_interaction_trigger,
    create_viewport_trigger,
    schedule_idle_fallback,
  };
}
