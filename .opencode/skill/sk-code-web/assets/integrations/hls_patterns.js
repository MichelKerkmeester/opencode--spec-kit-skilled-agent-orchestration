/**
 * HLS.JS VIDEO STREAMING PATTERNS
 *
 * Reference implementation patterns for HLS.js video streaming in Webflow.
 * Extracted from production code: src/2_javascript/video/video_background_hls_hover.js
 * @see https://github.com/video-dev/hls.js
 * Check HTML source files for current pinned version.
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CDN LOADING
──────────────────────────────────────────────────────────────── */

/**
 * HLS.js CDN URL pattern - pin to specific version for stability
 * Check HTML source files (e.g., home.html) for current version
 * Use with preload link for critical video pages:
 *   <link rel="preload" href="..." as="script">
 *   <script src="..." defer></script>
 */
const HLS_CDN_URL = 'https://cdn.jsdelivr.net/npm/hls.js@{version}';

/**
 * Load HLS.js library dynamically via CDN script injection.
 * Returns a Promise that resolves when library is ready.
 *
 * @param {Object} [options] - Configuration options
 * @param {number} [options.timeout_ms=10000] - Timeout in milliseconds
 * @returns {Promise<boolean>} - True if loaded successfully
 *
 * @example
 * const loaded = await load_hls_library();
 * if (loaded && Hls.isSupported()) {
 *   // Initialize player
 * }
 */
function load_hls_library(options = {}) {
  const { timeout_ms = 10000 } = options;

  return new Promise((resolve) => {
    if (typeof window.Hls !== 'undefined') {
      resolve(true);
      return;
    }

    // Timeout protection
    const timeout_id = setTimeout(() => {
      console.warn('HLS.js load timeout after', timeout_ms + 'ms');
      resolve(false);
    }, timeout_ms);

    const script = document.createElement('script');
    script.src = HLS_CDN_URL;
    script.async = true;

    script.onload = () => {
      clearTimeout(timeout_id);
      resolve(true);
    };

    script.onerror = () => {
      clearTimeout(timeout_id);
      console.error('Failed to load HLS.js from CDN');
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

/* ─────────────────────────────────────────────────────────────
   2. FEATURE DETECTION
──────────────────────────────────────────────────────────────── */

/**
 * Detect if browser has native HLS support (Safari) or needs HLS.js.
 * Safari uses Media Source Extensions (MSE) natively for HLS.
 *
 * @returns {Object} Feature detection result
 * @property {boolean} safari_native - True if Safari with native HLS
 * @property {boolean} can_use_hls_js - True if HLS.js is available and supported
 * @property {boolean} has_support - True if any HLS playback method available
 *
 * @example
 * const { safari_native, can_use_hls_js, has_support } = detect_hls_support();
 * if (!has_support) {
 *   console.error('No HLS support available');
 * }
 */
function detect_hls_support() {
  const test_video = document.createElement('video');
  const safari_native = !!test_video.canPlayType('application/vnd.apple.mpegurl');
  const can_use_hls_js = !!(window.Hls && Hls.isSupported()) && !safari_native;

  return {
    safari_native,
    can_use_hls_js,
    has_support: safari_native || can_use_hls_js
  };
}

/* ─────────────────────────────────────────────────────────────
   3. PLAYER INITIALIZATION
──────────────────────────────────────────────────────────────── */

/**
 * Create and configure an HLS.js player instance.
 * Handles Safari native fallback automatically.
 *
 * @param {HTMLVideoElement} video - Target video element
 * @param {string} src - HLS manifest URL (.m3u8)
 * @param {Object} [options] - HLS.js configuration
 * @param {number} [options.max_buffer_length=8] - Max buffer in seconds (lower = less memory)
 * @param {boolean} [options.safari_native] - Override Safari detection
 * @returns {Object} Player instance with control methods
 *
 * @example
 * const player = create_hls_player(video_element, 'https://cdn.example.com/video/playlist.m3u8');
 * player.on_ready(() => video_element.play());
 */
function create_hls_player(video, src, options = {}) {
  const {
    max_buffer_length = 8,
    safari_native = null
  } = options;

  const { safari_native: detected_safari, can_use_hls_js } = detect_hls_support();
  const use_safari_native = safari_native !== null ? safari_native : detected_safari;

  let hls_instance = null;
  let ready_callback = null;
  let error_callback = null;
  let is_destroyed = false;

  // Safari native HLS path
  if (use_safari_native) {
    video.src = src;

    video.addEventListener('loadedmetadata', function on_meta() {
      video.removeEventListener('loadedmetadata', on_meta);
      if (!is_destroyed && ready_callback) {
        ready_callback();
      }
    });

    return {
      hls: null,
      is_safari_native: true,
      on_ready: (cb) => { ready_callback = cb; },
      on_error: (cb) => { error_callback = cb; },
      destroy: () => {
        is_destroyed = true;
        try {
          video.pause();
          video.removeAttribute('src');
          video.load();
        } catch (_) { /* ignore */ }
      }
    };
  }

  // HLS.js path for non-Safari browsers
  if (!can_use_hls_js) {
    console.error('HLS.js not available and no native support');
    return null;
  }

  hls_instance = new Hls({ maxBufferLength: max_buffer_length });

  return {
    hls: hls_instance,
    is_safari_native: false,
    on_ready: (cb) => { ready_callback = cb; },
    on_error: (cb) => { error_callback = cb; },

    /**
     * Attach to video element and load source
     */
    attach: () => {
      hls_instance.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls_instance.loadSource(src);
      });

      hls_instance.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!is_destroyed && ready_callback) {
          ready_callback();
        }
      });

      hls_instance.on(Hls.Events.ERROR, (event, data) => {
        if (!is_destroyed && error_callback) {
          error_callback(event, data);
        }
      });

      hls_instance.attachMedia(video);
    },

    destroy: () => {
      is_destroyed = true;
      if (hls_instance) {
        try { hls_instance.destroy(); } catch (_) { /* ignore */ }
        hls_instance = null;
      }
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   4. EVENT HANDLING
──────────────────────────────────────────────────────────────── */

/**
 * Set up common HLS.js event handlers for player state management.
 * Manages MANIFEST_PARSED, LEVEL_LOADED, and ERROR events.
 *
 * @param {Hls} hls - HLS.js instance
 * @param {Object} callbacks - Event callback functions
 * @param {Function} [callbacks.on_manifest_parsed] - Called when manifest is parsed
 * @param {Function} [callbacks.on_level_loaded] - Called with quality level data
 * @param {Function} [callbacks.on_error] - Called on any HLS error
 * @returns {Function} Cleanup function to remove all listeners
 *
 * @example
 * const cleanup = setup_hls_events(hls, {
 *   on_manifest_parsed: () => set_status('ready'),
 *   on_level_loaded: (data) => update_quality_info(data),
 *   on_error: (event, data) => handle_hls_error(hls, data)
 * });
 */
function setup_hls_events(hls, callbacks = {}) {
  const {
    on_manifest_parsed,
    on_level_loaded,
    on_error
  } = callbacks;

  function handle_manifest_parsed(event, data) {
    if (on_manifest_parsed) {
      on_manifest_parsed(data);
    }
  }

  function handle_level_loaded(event, data) {
    if (on_level_loaded && data && data.details) {
      on_level_loaded({
        duration: data.details.totalduration,
        level: data.level,
        details: data.details
      });
    }
  }

  function handle_error(event, data) {
    if (on_error) {
      on_error(event, data);
    }
  }

  hls.on(Hls.Events.MANIFEST_PARSED, handle_manifest_parsed);
  hls.on(Hls.Events.LEVEL_LOADED, handle_level_loaded);
  hls.on(Hls.Events.ERROR, handle_error);

  return function cleanup() {
    try { hls.off(Hls.Events.MANIFEST_PARSED, handle_manifest_parsed); } catch (_) { /* ignore */ }
    try { hls.off(Hls.Events.LEVEL_LOADED, handle_level_loaded); } catch (_) { /* ignore */ }
    try { hls.off(Hls.Events.ERROR, handle_error); } catch (_) { /* ignore */ }
  };
}

/* ─────────────────────────────────────────────────────────────
   5. ERROR HANDLING & RECOVERY
──────────────────────────────────────────────────────────────── */

/**
 * Handle HLS.js errors with appropriate recovery strategies.
 * Uses recoverMediaError() for media errors, reload for network issues.
 *
 * @param {Hls} hls - HLS.js instance
 * @param {Object} data - Error event data from HLS.js
 * @param {Object} [state] - Mutable state object for tracking recovery attempts
 * @param {number} [state.media_error_count=0] - Media error recovery attempts
 * @param {number} [state.max_retries=3] - Maximum recovery attempts before fatal
 * @returns {Object} Recovery result
 * @property {boolean} recovered - True if recovery was attempted
 * @property {boolean} fatal - True if error is unrecoverable
 * @property {string} type - Error type (network|media|other)
 *
 * @example
 * const state = { media_error_count: 0, max_retries: 3 };
 * hls.on(Hls.Events.ERROR, (event, data) => {
 *   const result = handle_hls_error(hls, data, state);
 *   if (result.fatal) {
 *     show_error_fallback();
 *   }
 * });
 */
function handle_hls_error(hls, data, state = {}) {
  const { max_retries = 3 } = state;

  if (typeof state.media_error_count !== 'number') {
    state.media_error_count = 0;
  }

  const result = {
    recovered: false,
    fatal: false,
    type: data.type || 'other'
  };

  // Only handle fatal errors
  if (!data.fatal) {
    return result;
  }

  switch (data.type) {
    case Hls.ErrorTypes.NETWORK_ERROR:
      // Network errors: attempt to reload source
      console.warn('HLS network error, attempting recovery:', data.details);
      try {
        hls.startLoad();
        result.recovered = true;
      } catch (err) {
        console.error('HLS network recovery failed:', err);
        result.fatal = true;
      }
      break;

    case Hls.ErrorTypes.MEDIA_ERROR:
      // Media errors: use recoverMediaError() method
      state.media_error_count++;
      console.warn('HLS media error, recovery attempt', state.media_error_count + '/' + max_retries);

      if (state.media_error_count <= max_retries) {
        try {
          hls.recoverMediaError();
          result.recovered = true;
        } catch (err) {
          console.error('HLS media recovery failed:', err);
          result.fatal = true;
        }
      } else {
        console.error('HLS media error recovery exhausted');
        result.fatal = true;
      }
      break;

    default:
      // Other fatal errors: cannot recover
      console.error('HLS fatal error:', data.type, data.details);
      result.fatal = true;
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   6. CLEANUP & DESTROY
──────────────────────────────────────────────────────────────── */

/**
 * Properly destroy an HLS.js player and clean up resources.
 * Prevents memory leaks by removing all event listeners and references.
 *
 * @param {Object} player_state - Player state object
 * @param {Hls} [player_state.hls] - HLS.js instance to destroy
 * @param {HTMLVideoElement} [player_state.video] - Video element to clean
 * @param {Function} [player_state.event_cleanup] - Event listener cleanup function
 * @param {AbortController} [player_state.abort_controller] - Fetch abort controller
 *
 * @example
 * destroy_hls_player({
 *   hls: player_hls,
 *   video: video_element,
 *   event_cleanup: cleanup_function,
 *   abort_controller: meta_abort
 * });
 */
function destroy_hls_player(player_state) {
  const { hls, video, event_cleanup, abort_controller } = player_state;

  // Cancel in-flight requests to prevent orphaned callbacks
  if (abort_controller) {
    try { abort_controller.abort(); } catch (_) { /* ignore */ }
  }

  if (typeof event_cleanup === 'function') {
    try { event_cleanup(); } catch (_) { /* ignore */ }
  }

  if (hls) {
    try { hls.destroy(); } catch (_) { /* ignore */ }
  }

  // Reset video element to release media resources
  if (video) {
    try {
      video.pause();
      video.removeAttribute('src');
      video.load();
    } catch (err) {
      console.warn('Video cleanup error:', err);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   7. QUALITY MANAGEMENT
──────────────────────────────────────────────────────────────── */

/**
 * Get the best available quality level from HLS.js levels array.
 * Returns the level with highest resolution (width).
 *
 * @param {Array} levels - HLS.js quality levels array
 * @returns {Object|null} Best quality level or null if none available
 *
 * @example
 * hls.on(Hls.Events.MANIFEST_PARSED, () => {
 *   const best = get_best_quality_level(hls.levels);
 *   console.log('Best quality:', best?.width + 'x' + best?.height);
 * });
 */
function get_best_quality_level(levels) {
  if (!levels || !levels.length) {
    return null;
  }

  return levels.reduce((best, current) => {
    return (current.width || 0) > (best.width || 0) ? current : best;
  }, levels[0]);
}

/**
 * Fetch video duration without loading full stream.
 * Uses HLS.js LEVEL_LOADED event for efficiency, with fallback to manifest parsing.
 *
 * @param {string} src - HLS manifest URL
 * @param {Object} [options] - Fetch options
 * @param {number} [options.timeout_ms=10000] - Timeout in milliseconds
 * @param {AbortSignal} [options.signal] - AbortController signal
 * @returns {Promise<Object>} Duration metadata
 *
 * @example
 * const meta = await fetch_hls_duration('https://cdn.example.com/video.m3u8');
 * if (isFinite(meta.duration)) {
 *   display_duration(meta.duration);
 * }
 */
function fetch_hls_duration(src, options = {}) {
  const { timeout_ms = 10000, signal } = options;

  return new Promise((resolve) => {
    let resolved = false;
    let timer = null;
    let controller = signal ? null : new AbortController();

    function cleanup_and_resolve(result) {
      if (resolved) return;
      resolved = true;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      resolve(result);
    }

    timer = setTimeout(() => {
      if (controller) {
        try { controller.abort(); } catch (_) { /* ignore */ }
      }
      cleanup_and_resolve({ duration: NaN });
    }, timeout_ms);

    const { can_use_hls_js } = detect_hls_support();

    // HLS.js path: faster and more reliable
    if (can_use_hls_js && window.Hls && Hls.isSupported()) {
      try {
        const tmp = new Hls();
        const out = { duration: NaN };

        function teardown() {
          try { tmp.off(Hls.Events.LEVEL_LOADED, on_level_loaded); } catch (_) { /* ignore */ }
          try { tmp.off(Hls.Events.ERROR, on_error); } catch (_) { /* ignore */ }
          try { tmp.destroy(); } catch (_) { /* ignore */ }
        }

        function on_level_loaded(event, data) {
          if (data && data.details && isFinite(data.details.totalduration)) {
            out.duration = data.details.totalduration;
          }
          teardown();
          cleanup_and_resolve(out);
        }

        function on_error() {
          teardown();
          cleanup_and_resolve(out);
        }

        tmp.on(Hls.Events.LEVEL_LOADED, on_level_loaded);
        tmp.on(Hls.Events.ERROR, on_error);
        tmp.loadSource(src);
        return;
      } catch (_) {
        cleanup_and_resolve({ duration: NaN });
        return;
      }
    }

    // Fallback: manual manifest parsing
    const fetch_signal = controller ? controller.signal : signal;

    fetch(src, { credentials: 'omit', cache: 'no-store', signal: fetch_signal })
      .then((r) => {
        if (!r.ok) throw new Error('manifest fetch failed');
        return r.text();
      })
      .then((master_text) => {
        // Find first non-comment line (media playlist URL)
        const media_line = master_text.split(/\r?\n/).find((line) => {
          return line && line[0] !== '#';
        });

        if (!media_line) {
          cleanup_and_resolve({ duration: NaN });
          return;
        }

        const media_url = new URL(media_line.trim(), src).toString();

        return fetch(media_url, { credentials: 'omit', cache: 'no-store', signal: fetch_signal })
          .then((resp) => {
            if (!resp.ok) throw new Error('media playlist fetch failed');
            return resp.text();
          })
          .then((media_text) => {
            // Sum #EXTINF segment durations
            let total = 0;
            const pattern = /#EXTINF:([\d.]+)/g;
            let match;
            while ((match = pattern.exec(media_text))) {
              total += parseFloat(match[1]);
            }
            cleanup_and_resolve({ duration: total });
          });
      })
      .catch(() => {
        cleanup_and_resolve({ duration: NaN });
      });
  });
}

/* ─────────────────────────────────────────────────────────────
   8. WEBFLOW INTEGRATION HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Retry mechanism for HLS.js library loading.
 * Handles race conditions when library loads after script initialization.
 *
 * @param {Function} init_function - Initialization function to retry
 * @param {Object} [options] - Retry options
 * @param {number} [options.max_retries=10] - Maximum retry attempts
 * @param {number} [options.retry_delay_ms=120] - Delay between retries
 * @returns {Function} Function to reset retry counter
 *
 * @example
 * const reset_retries = create_hls_retry_loader(init_players, {
 *   max_retries: 10,
 *   retry_delay_ms: 120
 * });
 */
function create_hls_retry_loader(init_function, options = {}) {
  const { max_retries = 10, retry_delay_ms = 120 } = options;
  let retry_count = 0;

  function attempt_init() {
    const { safari_native } = detect_hls_support();

    // Safari has native support, proceed immediately
    if (safari_native) {
      retry_count = 0;
      init_function();
      return;
    }

    if (typeof Hls === 'undefined') {
      retry_count++;

      if (retry_count >= max_retries) {
        console.error('HLS.js failed to load after', max_retries, 'attempts');
        return;
      }

      console.warn('HLS.js not loaded, retrying...', retry_count + '/' + max_retries);
      setTimeout(attempt_init, retry_delay_ms);
      return;
    }

    // Success - reset and initialize
    retry_count = 0;
    init_function();
  }

  attempt_init();

  return function reset() {
    retry_count = 0;
  };
}

/**
 * Configure video element for mobile autoplay compliance.
 * Sets required attributes for iOS/Android autoplay policies.
 *
 * @param {HTMLVideoElement} video - Video element to configure
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.loop=true] - Enable looping
 * @param {boolean} [options.disable_remote=true] - Disable Chromecast/AirPlay
 *
 * @example
 * configure_video_for_autoplay(video_element, { loop: true });
 */
function configure_video_for_autoplay(video, options = {}) {
  const { loop = true, disable_remote = true } = options;

  // Required for iOS autoplay
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('muted', '');
  video.playsInline = true;
  video.muted = true;

  if (loop) {
    video.loop = true;
  }

  // Prevent AirPlay/Chromecast interference
  if (disable_remote && typeof video.disableRemotePlayback !== 'undefined') {
    video.disableRemotePlayback = true;
  }
}

/* ─────────────────────────────────────────────────────────────
   9. EXPORTS (for reference - actual usage is via copy-paste patterns)
──────────────────────────────────────────────────────────────── */

/**
 * Pattern Summary:
 *
 * 1. load_hls_library()         - Dynamic CDN script loading with timeout
 * 2. detect_hls_support()       - Safari native vs HLS.js feature detection
 * 3. create_hls_player()        - Initialize player with Safari fallback
 * 4. setup_hls_events()         - Event handler configuration with cleanup
 * 5. handle_hls_error()         - Error recovery with recoverMediaError()
 * 6. destroy_hls_player()       - Memory-safe cleanup pattern
 * 7. get_best_quality_level()   - Quality level selection
 * 8. fetch_hls_duration()       - Metadata-only duration fetch
 * 9. create_hls_retry_loader()  - Library load retry mechanism
 * 10. configure_video_for_autoplay() - Mobile compliance attributes
 */
