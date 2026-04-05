/**
 * DEFENSE-IN-DEPTH VALIDATION PATTERNS
 *
 * Production-ready validation templates.
 * Validates at every layer to make errors structurally impossible.
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. GENERIC VALIDATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Contact Form with Multi-Layer Validation
 * Example implementation of defense-in-depth for form handling
 */
class ContactForm {
  constructor(form_element) {
    // Layer 1: Constructor validation
    if (!form_element) {
      throw new Error('[ContactForm] Form element required');
    }

    this.form = form_element;
    this.setup_validation();
  }

  setup_validation() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handle_submit();
    });

    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validate_field(input));
    });
  }

  validate_field(field) {
    // Layer 2: Field-level validation
    const value = field.value?.trim();
    const field_name = field.name;

    this.clear_field_error(field);

    if (field.hasAttribute('required') && !value) {
      this.show_field_error(field, `${field_name} is required`);
      return false;
    }

    switch (field.type) {
      case 'email':
        if (value && !this.is_valid_email(value)) {
          this.show_field_error(field, 'Invalid email address');
          return false;
        }
        break;

      case 'tel':
        if (value && !this.is_valid_phone(value)) {
          this.show_field_error(field, 'Invalid phone number');
          return false;
        }
        break;
    }

    return true;
  }

  is_valid_email(email) {
    // Layer 3: Format validation
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email_regex.test(email);
  }

  is_valid_phone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^\d{10,15}$/.test(cleaned);
  }

  async handle_submit() {
    console.log('[ContactForm] Submitting...');

    // Layer 2: Validate all fields
    const fields = this.form.querySelectorAll('input, textarea');
    let is_valid = true;

    fields.forEach(field => {
      if (!this.validate_field(field)) {
        is_valid = false;
      }
    });

    if (!is_valid) {
      console.warn('[ContactForm] Validation failed');
      return;
    }

    // Layer 3: Collect and sanitize data
    const form_data = new FormData(this.form);
    const data = {
      name: this.sanitize_text(form_data.get('name')),
      email: this.sanitize_email(form_data.get('email')),
      message: this.sanitize_text(form_data.get('message'))
    };

    if (!data.name || !data.email || !data.message) {
      console.error('[ContactForm] Sanitization removed all content');
      this.show_form_error('Please check your input and try again');
      return;
    }

    try {
      const result = await this.submit_to_api(data);

      // Layer 4: Validate API response
      if (result && result.success) {
        this.show_form_success('Message sent successfully!');
        this.form.reset();
      } else {
        throw new Error(result?.message || 'Submission failed');
      }

    } catch (error) {
      console.error('[ContactForm] Submission failed:', error);
      this.show_form_error('Failed to send message. Please try again.');
    }
  }

  sanitize_text(text) {
    if (!text || typeof text !== 'string') return '';

    return text
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .slice(0, 1000);
  }

  sanitize_email(email) {
    if (!email || typeof email !== 'string') return '';

    return email
      .toLowerCase()
      .trim()
      .slice(0, 254);
  }

  async submit_to_api(data) {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  show_field_error(field, message) {
    field.classList.add('error');
    const error_el = field.parentElement.querySelector('.error-message');
    if (error_el) error_el.textContent = message;
  }

  clear_field_error(field) {
    field.classList.remove('error');
    const error_el = field.parentElement.querySelector('.error-message');
    if (error_el) error_el.textContent = '';
  }

  show_form_success(message) {
    const success_el = this.form.querySelector('[form-success]');
    if (success_el) {
      success_el.textContent = message;
      success_el.style.display = 'block';
    }
  }

  show_form_error(message) {
    const error_el = this.form.querySelector('[form-error]');
    if (error_el) {
      error_el.textContent = message;
      error_el.style.display = 'block';
    }
  }
}

/**
 * API Client with Multi-Layer Error Handling
 */
class APIClient {
  constructor(base_url) {
    // Layer 1: Constructor validation
    if (!base_url || typeof base_url !== 'string') {
      throw new Error('[API] Base URL required');
    }

    this.base_url = base_url.replace(/\/$/, '');
  }

  async get(endpoint, params = {}) {
    return this.request('GET', endpoint, null, params);
  }

  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  async request(method, endpoint, data = null, params = {}) {
    // Layer 1: Method validation
    const allowed_methods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!allowed_methods.includes(method)) {
      throw new Error(`[API] Invalid HTTP method: ${method}`);
    }

    // Layer 2: Endpoint validation
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('[API] Endpoint required');
    }

    const url = new URL(`${this.base_url}${endpoint}`);

    if (method === 'GET' && params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data && ['POST', 'PUT'].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // Layer 3: Response validation
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Layer 4: JSON validation
      const json = await response.json();

      if (json === null || json === undefined) {
        throw new Error('[API] Empty response');
      }

      return json;

    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  }
}


/* ─────────────────────────────────────────────────────────────
   2. WEBFLOW + FORMSPARK INTEGRATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Botpoison Spam Protection
 *
 * Provides async SDK loading and challenge token resolution for forms.
 * Singleton pattern ensures SDK loads only once per page.
 *
 * @example
 * const protection = new BotpoisonProtection({ public_key: 'pk_xxx' });
 * const token = await protection.get_token();
 * if (token) form_data.set('_botpoison', token);
 */
class BotpoisonProtection {
  static SDK_URL = 'https://unpkg.com/@botpoison/browser';
  static MAX_CLIENTS = 10;
  static DEFAULT_TIMEOUT_MS = 10000;

  /** @type {Promise<boolean>|null} */
  static sdk_loader = null;

  /** @type {Map<string, object>} */
  static clients = new Map();

  /**
   * @param {Object} config
   * @param {string} config.public_key - Botpoison public key
   * @param {number} [config.timeout_ms=10000] - Challenge timeout in ms
   */
  constructor(config = {}) {
    if (!config.public_key || typeof config.public_key !== 'string') {
      throw new Error('[BotpoisonProtection] public_key required');
    }

    this.public_key = config.public_key.trim();
    this.timeout_ms = config.timeout_ms || BotpoisonProtection.DEFAULT_TIMEOUT_MS;
  }

  /**
   * Load Botpoison SDK asynchronously (singleton)
   * @returns {Promise<boolean>} - True if SDK loaded successfully
   */
  static async load_sdk() {
    // Short-circuit if SDK is already present
    if (typeof window.Botpoison !== 'undefined') {
      return true;
    }

    // Return existing load promise to prevent duplicate script injection
    if (BotpoisonProtection.sdk_loader) {
      return BotpoisonProtection.sdk_loader;
    }

    BotpoisonProtection.sdk_loader = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = BotpoisonProtection.SDK_URL;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        BotpoisonProtection.sdk_loader = null; // Allow retry
        resolve(false);
      };
      document.head.appendChild(script);
    });

    return BotpoisonProtection.sdk_loader;
  }

  /**
   * Get or create a Botpoison client for this public key
   * Uses LRU-style eviction when max clients reached
   * @returns {object|null}
   */
  get_client() {
    if (!BotpoisonProtection.clients.has(this.public_key)) {
      // Evict oldest if at capacity
      if (BotpoisonProtection.clients.size >= BotpoisonProtection.MAX_CLIENTS) {
        const first_key = BotpoisonProtection.clients.keys().next().value;
        BotpoisonProtection.clients.delete(first_key);
      }

      BotpoisonProtection.clients.set(
        this.public_key,
        new window.Botpoison({ public_key: this.public_key })
      );
    }

    return BotpoisonProtection.clients.get(this.public_key);
  }

  /**
   * Solve the Botpoison challenge and return token
   * @returns {Promise<string|null>} - Token string or null on failure
   */
  async get_token() {
    const sdk_loaded = await BotpoisonProtection.load_sdk();

    if (!sdk_loaded || typeof window.Botpoison === 'undefined') {
      console.warn('[BotpoisonProtection] SDK failed to load');
      return null;
    }

    const client = this.get_client();
    if (!client) {
      return null;
    }

    try {
      // Race challenge against timeout
      const challenge = client.challenge();
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Botpoison timeout')), this.timeout_ms)
      );

      const result = await Promise.race([challenge, timeout]);

      if (!result) {
        return null;
      }

      // Handle both token formats (token or solution)
      const token =
        (typeof result.token === 'string' && result.token) ||
        (typeof result.solution === 'string' && result.solution) ||
        '';

      return token || null;

    } catch (error) {
      console.warn('[BotpoisonProtection] Challenge failed:', error.message);
      return null;
    }
  }

  /**
   * Check if Botpoison is required for a form element
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  static is_required(form) {
    const key = (
      form.getAttribute('data-botpoison-public-key') ||
      form.getAttribute('data-botpoison-key') ||
      ''
    ).trim();
    return key.length > 0;
  }

  /**
   * Create protection instance from form attributes
   * @param {HTMLFormElement} form
   * @returns {BotpoisonProtection|null}
   */
  static from_form(form) {
    const key = (
      form.getAttribute('data-botpoison-public-key') ||
      form.getAttribute('data-botpoison-key') ||
      ''
    ).trim();

    if (!key) {
      return null;
    }

    return new BotpoisonProtection({ public_key: key });
  }
}


/**
 * Webflow Form State Manager
 *
 * Handles Webflow's `.w-form-done` and `.w-form-fail` state blocks.
 * Provides methods to show/hide success/error states while respecting
 * Webflow's DOM structure.
 *
 * @example
 * const state_manager = new WebflowFormState(form_element);
 * state_manager.show_success();  // Shows .w-form-done, hides form
 * state_manager.show_error();    // Shows .w-form-fail
 * state_manager.reset();        // Restores initial state
 */
class WebflowFormState {
  /**
   * @param {HTMLFormElement} form
   */
  constructor(form) {
    if (!form) {
      throw new Error('[WebflowFormState] Form element required');
    }

    this.form = form;
    this.form_block = form.closest('.w-form') || form.parentElement;
    this.done_el = this.form_block?.querySelector('.w-form-done');
    this.fail_el = this.form_block?.querySelector('.w-form-fail');
  }

  /**
   * Show success state (Webflow .w-form-done)
   * @param {Object} options
   * @param {boolean} [options.hide_form=false] - Hide the form element
   * @param {boolean} [options.hide_error=true] - Hide error message
   */
  show_success(options = {}) {
    const { hide_form = false, hide_error = true } = options;

    if (hide_error && this.fail_el) {
      this.fail_el.style.display = 'none';
      this.fail_el.setAttribute('aria-hidden', 'true');
    }

    if (this.done_el) {
      this.done_el.style.display = 'block';
      this.done_el.setAttribute('aria-hidden', 'false');
    }

    if (hide_form) {
      this.form.style.display = 'none';
      this.form.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Show error state (Webflow .w-form-fail)
   * @param {Object} options
   * @param {boolean} [options.hide_success=true] - Hide success message
   * @param {string} [options.message] - Custom error message
   */
  show_error(options = {}) {
    const { hide_success = true, message } = options;

    if (hide_success && this.done_el) {
      this.done_el.style.display = 'none';
      this.done_el.setAttribute('aria-hidden', 'true');
    }

    if (this.fail_el) {
      this.fail_el.style.display = 'block';
      this.fail_el.setAttribute('aria-hidden', 'false');

      if (message) {
        const msg_el = this.fail_el.querySelector('[data-error-message]') ||
                      this.fail_el.querySelector('.w-form-fail-msg') ||
                      this.fail_el;
        if (msg_el.textContent !== undefined) {
          msg_el.textContent = message;
        }
      }
    }
  }

  /**
   * Reset to initial state (form visible, messages hidden)
   */
  reset() {
    if (this.done_el) {
      this.done_el.style.display = 'none';
      this.done_el.setAttribute('aria-hidden', 'true');
    }

    if (this.fail_el) {
      this.fail_el.style.display = 'none';
      this.fail_el.setAttribute('aria-hidden', 'true');
    }

    this.form.style.display = '';
    this.form.removeAttribute('aria-hidden');
  }

  /**
   * Check if Webflow form structure is present
   * @returns {boolean}
   */
  has_webflow_structure() {
    return Boolean(this.form_block?.classList.contains('w-form'));
  }
}


/**
 * Webflow Form Controller
 *
 * Production-ready form handler for Webflow sites with:
 * - Formspark/submit-form.com integration
 * - Botpoison spam protection
 * - Webflow state management (.w-form-done, .w-form-fail)
 * - Retry with exponential backoff
 * - Native form fallback for CORS issues
 * - Debounced real-time validation
 *
 * @example
 * // Auto-discovery (recommended)
 * WebflowForm.init();
 *
 * // Manual instantiation
 * const form = document.querySelector('form[data-formspark-url]');
 * const controller = new WebflowForm(form, {
 *   endpoint: 'https://submit-form.com/xxx',
 *   botpoison_key: 'pk_xxx',
 *   reset_on_success: true
 * });
 */
class WebflowForm {
  /** Form selector for auto-discovery */
  static FORM_SELECTOR = 'form[action*="submit-form.com"], form[data-formspark-url]';

  /** Submit button selector */
  static SUBMIT_SELECTOR = 'button[type="submit"], input[type="submit"], [data-submit-button]';

  /** HTTP status codes that warrant retry */
  static RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

  /** Default configuration */
  static DEFAULTS = {
    timeout_ms: 30000,
    retry_count: 2,
    retry_delay_ms: 1000,
    reset_delay_ms: 200,
    botpoison_timeout_ms: 10000,
    enable_fallback: true,
    validate_on_blur: true,
    debounce_ms: 300
  };

  /** @type {Map<HTMLFormElement, WebflowForm>} */
  static instances = new Map();

  /**
   * @param {HTMLFormElement} form
   * @param {Object} [config]
   * @param {string} [config.endpoint] - Form submission URL
   * @param {string} [config.botpoison_key] - Botpoison public key
   * @param {boolean} [config.reset_on_success=true] - Reset form after success
   * @param {number} [config.reset_delay_ms=200] - Delay before reset
   * @param {boolean} [config.enable_fallback=true] - Enable native fallback
   * @param {boolean} [config.validate_on_blur=true] - Validate fields on blur
   * @param {number} [config.debounce_ms=300] - Validation debounce delay
   */
  constructor(form, config = {}) {
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error('[WebflowForm] Valid form element required');
    }

    this.form = form;
    this.config = this.resolve_config(config);
    this.state = 'idle'; // idle | submitting | success | error
    this.state_manager = new WebflowFormState(form);
    this.submit_buttons = Array.from(form.querySelectorAll(WebflowForm.SUBMIT_SELECTOR));
    this.native_submit = typeof form.submit === 'function' ? form.submit.bind(form) : null;
    this.reset_timeout = null;
    this.debounce_timers = new Map();

    // Bind event handlers
    this.on_submit = this.handle_submit.bind(this);
    this.bind_events();

    // Prevent double-initialization on re-run
    this.form.dataset.webflowFormEnhanced = 'true';
  }

  /**
   * Resolve configuration from attributes and provided config
   * @param {Object} config
   * @returns {Object}
   */
  resolve_config(config) {
    const endpoint = (
      config.endpoint ||
      this.form.getAttribute('data-formspark-url') ||
      this.form.getAttribute('action') ||
      ''
    ).trim();

    const botpoison_key = (
      config.botpoison_key ||
      this.form.getAttribute('data-botpoison-public-key') ||
      this.form.getAttribute('data-botpoison-key') ||
      ''
    ).trim();

    return {
      endpoint,
      botpoison_key,
      reset_on_success: config.reset_on_success ?? true,
      reset_delay_ms: config.reset_delay_ms ?? WebflowForm.DEFAULTS.reset_delay_ms,
      enable_fallback: config.enable_fallback ?? WebflowForm.DEFAULTS.enable_fallback,
      validate_on_blur: config.validate_on_blur ?? WebflowForm.DEFAULTS.validate_on_blur,
      debounce_ms: config.debounce_ms ?? WebflowForm.DEFAULTS.debounce_ms,
      timeout_ms: WebflowForm.DEFAULTS.timeout_ms,
      retry_count: WebflowForm.DEFAULTS.retry_count,
      retry_delay_ms: WebflowForm.DEFAULTS.retry_delay_ms
    };
  }

  /**
   * Bind form events
   */
  bind_events() {
    this.form.addEventListener('submit', this.on_submit, { capture: true });

    if (this.config.validate_on_blur) {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.debounced_validate(input));
        input.addEventListener('input', () => this.clear_field_error(input));
      });
    }

    // Prevent Enter in textarea from submitting (mobile fix)
    this.form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target.tagName === 'TEXTAREA') {
        event.stopPropagation();
        // Allow default textarea behavior (newline insertion)
      }
    }, true);
  }

  /**
   * Debounced field validation
   * @param {HTMLElement} field
   */
  debounced_validate(field) {
    const existing_timer = this.debounce_timers.get(field);
    if (existing_timer) {
      clearTimeout(existing_timer);
    }

    const timer = setTimeout(() => {
      this.validate_field(field);
      this.debounce_timers.delete(field);
    }, this.config.debounce_ms);

    this.debounce_timers.set(field, timer);
  }

  /**
   * Validate a single field
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  validate_field(field) {
    const value = field.value?.trim() || '';

    this.clear_field_error(field);

    if (field.hasAttribute('required') && !value) {
      this.show_field_error(field, 'This field is required');
      return false;
    }

    if (value) {
      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.show_field_error(field, 'Please enter a valid email');
            return false;
          }
          break;

        case 'tel':
          const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
          if (!/^\+?\d{7,15}$/.test(cleaned)) {
            this.show_field_error(field, 'Please enter a valid phone number');
            return false;
          }
          break;

        case 'url':
          try {
            const url = new URL(value);
            // Security: Only allow safe URL schemes
            if (!['http:', 'https:'].includes(url.protocol)) {
              this.show_field_error(field, 'Only HTTP and HTTPS URLs are allowed');
              return false;
            }
          } catch {
            this.show_field_error(field, 'Please enter a valid URL');
            return false;
          }
          break;
      }
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        const message = field.getAttribute('data-error-message') || 'Invalid format';
        this.show_field_error(field, message);
        return false;
      }
    }

    return true;
  }

  /**
   * Show field-level error
   * @param {HTMLElement} field
   * @param {string} message
   */
  show_field_error(field, message) {
    field.classList.add('error', 'w-input-error');
    field.setAttribute('aria-invalid', 'true');

    const error_id = `${field.id || field.name}-error`;
    let error_el = field.parentElement?.querySelector(`[data-error-for="${field.name}"]`) ||
                  field.parentElement?.querySelector('.field-error-message') ||
                  document.getElementById(error_id);

    if (error_el) {
      error_el.textContent = message;
      error_el.style.display = 'block';
      field.setAttribute('aria-describedby', error_el.id || error_id);
    }
  }

  /**
   * Clear field-level error
   * @param {HTMLElement} field
   */
  clear_field_error(field) {
    field.classList.remove('error', 'w-input-error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');

    const error_el = field.parentElement?.querySelector(`[data-error-for="${field.name}"]`) ||
                    field.parentElement?.querySelector('.field-error-message');

    if (error_el) {
      error_el.textContent = '';
      error_el.style.display = 'none';
    }
  }

  /**
   * Handle form submission
   * @param {SubmitEvent} event
   */
  async handle_submit(event) {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation?.() || event.stopPropagation?.();
    }

    // Prevent double submission
    if (this.state === 'submitting') {
      return;
    }

    // Validate all fields
    const fields = this.form.querySelectorAll('input, textarea, select');
    let is_valid = true;

    fields.forEach(field => {
      if (!this.validate_field(field)) {
        is_valid = false;
      }
    });

    // Also use native validation
    if (!this.form.checkValidity()) {
      this.form.reportValidity?.();
      return;
    }

    if (!is_valid) {
      return;
    }

    // Begin submission
    this.state = 'submitting';
    this.set_loading_state(true);

    try {
      // Collect form data
      const form_data = new FormData(this.form);

      // Solve Botpoison challenge if configured
      if (this.config.botpoison_key) {
        const protection = new BotpoisonProtection({
          public_key: this.config.botpoison_key
        });

        const token = await protection.get_token();

        if (!token) {
          throw new Error('Spam protection challenge failed');
        }

        form_data.set('_botpoison', token);
      }

      // Submit with retry
      const response = await this.submit_with_retry(form_data);

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      // Success
      await this.handle_success();

    } catch (error) {
      console.error('[WebflowForm] Submission error:', error);

      // Check for CORS/network errors that might benefit from fallback
      const is_cors_error = error.message && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('CORS')
      );

      if (this.config.enable_fallback && is_cors_error && this.native_submit) {
        console.warn('[WebflowForm] Falling back to native submission');
        this.state = 'idle';
        this.set_loading_state(false);
        this.native_submit.call(this.form);
        return;
      }

      this.handle_error(error);

    } finally {
      if (this.state === 'submitting') {
        this.state = 'idle';
      }
      this.set_loading_state(false);
    }
  }

  /**
   * Submit form data with retry/backoff
   * @param {FormData} form_data
   * @param {number} [attempt=0]
   * @returns {Promise<Response>}
   */
  async submit_with_retry(form_data, attempt = 0) {
    // Build JSON payload (files excluded, multi-value fields become arrays)
    const json = {};
    for (const [key, value] of form_data.entries()) {
      if (value instanceof File) {
        console.warn(`[WebflowForm] File field "${key}" skipped (JSON mode)`);
        continue;
      }

      // Handle multiple values (checkboxes)
      if (key in json) {
        if (!Array.isArray(json[key])) {
          json[key] = [json[key]];
        }
        json[key].push(value);
      } else {
        json[key] = value;
      }
    }

    const controller = new AbortController();
    const timeout_id = setTimeout(
      () => controller.abort(),
      this.config.timeout_ms
    );

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(json),
        signal: controller.signal
      });

      clearTimeout(timeout_id);

      if (response.ok) {
        return response;
      }

      // Retry for transient errors
      if (WebflowForm.RETRYABLE_STATUS.has(response.status) &&
          attempt < this.config.retry_count) {
        const delay = this.config.retry_delay_ms * Math.pow(2, attempt);
        await this.wait(delay);
        return this.submit_with_retry(form_data, attempt + 1);
      }

      return response;

    } catch (error) {
      clearTimeout(timeout_id);

      // Retry on abort/network errors
      if (attempt < this.config.retry_count) {
        const delay = this.config.retry_delay_ms * Math.pow(2, attempt);
        await this.wait(delay);
        return this.submit_with_retry(form_data, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Handle successful submission
   */
  async handle_success() {
    this.state = 'success';
    this.form.setAttribute('data-state', 'success');

    // Show Webflow success state
    this.state_manager.show_success();

    // Dispatch custom events
    this.form.dispatchEvent(new CustomEvent('webflowform:success', {
      bubbles: true,
      detail: { controller: this }
    }));

    if (this.config.reset_on_success) {
      this.reset_timeout = setTimeout(() => {
        this.reset_form();
      }, this.config.reset_delay_ms);
    }
  }

  /**
   * Handle submission error
   * @param {Error} error
   */
  handle_error(error) {
    this.state = 'error';
    this.form.setAttribute('data-state', 'error');

    // Show Webflow error state
    this.state_manager.show_error({
      message: 'Something went wrong. Please try again.'
    });

    // Dispatch custom event
    this.form.dispatchEvent(new CustomEvent('webflowform:error', {
      bubbles: true,
      detail: { controller: this, error }
    }));
  }

  /**
   * Set loading state on form and buttons
   * @param {boolean} is_loading
   */
  set_loading_state(is_loading) {
    this.form.toggleAttribute('aria-busy', is_loading);
    this.form.setAttribute('data-state', is_loading ? 'submitting' : this.state);

    this.submit_buttons.forEach(button => {
      button.disabled = is_loading;
      button.classList.toggle('is-loading', is_loading);
    });
  }

  /**
   * Reset form to initial state
   */
  reset_form() {
    if (this.reset_timeout) {
      clearTimeout(this.reset_timeout);
      this.reset_timeout = null;
    }

    this.form.reset();
    this.state_manager.reset();
    this.state = 'idle';
    this.form.removeAttribute('data-state');

    const fields = this.form.querySelectorAll('input, textarea, select');
    fields.forEach(field => this.clear_field_error(field));
  }

  /**
   * Promise-based delay
   * @param {number} ms
   * @returns {Promise<void>}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup and destroy instance
   */
  destroy() {
    if (this.reset_timeout) {
      clearTimeout(this.reset_timeout);
    }

    this.debounce_timers.forEach(timer => clearTimeout(timer));
    this.debounce_timers.clear();

    this.form.removeEventListener('submit', this.on_submit, { capture: true });
    this.form.removeAttribute('data-webflow-form-enhanced');
    this.state = 'idle';

    WebflowForm.instances.delete(this.form);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Static Methods: Auto-Discovery & Initialization
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Initialize all matching forms on the page
   */
  static init() {
    const forms = document.querySelectorAll(WebflowForm.FORM_SELECTOR);
    forms.forEach(form => {
      if (!WebflowForm.instances.has(form)) {
        const controller = new WebflowForm(form);
        WebflowForm.instances.set(form, controller);
      }
    });
  }

  /**
   * Destroy all instances
   */
  static destroy_all() {
    WebflowForm.instances.forEach(controller => controller.destroy());
    WebflowForm.instances.clear();
  }

  /**
   * Get controller instance for a form element
   * @param {HTMLFormElement} form
   * @returns {WebflowForm|undefined}
   */
  static get_instance(form) {
    return WebflowForm.instances.get(form);
  }
}


/* ─────────────────────────────────────────────────────────────
   3. COMBINED USAGE EXAMPLE
──────────────────────────────────────────────────────────────── */

/**
 * EXAMPLE: Combined Webflow + Botpoison + Validation
 *
 * This example shows how all components work together in production.
 *
 * HTML Structure (Webflow):
 * ```html
 * <div class="w-form">
 *   <form
 *     data-formspark-url="https://submit-form.com/YOUR_FORM_ID"
 *     data-botpoison-public-key="pk_YOUR_KEY"
 *   >
 *     <input type="text" name="name" required />
 *     <input type="email" name="email" required />
 *     <textarea name="message" required></textarea>
 *     <button type="submit">Send</button>
 *   </form>
 *   <div class="w-form-done">Thank you!</div>
 *   <div class="w-form-fail">Something went wrong.</div>
 * </div>
 * ```
 *
 * JavaScript:
 * ```javascript
 * // Option 1: Auto-discovery (recommended)
 * WebflowForm.init();
 *
 * // Option 2: Manual with custom config
 * const form = document.querySelector('form');
 * const controller = new WebflowForm(form, {
 *   endpoint: 'https://submit-form.com/xxx',
 *   botpoison_key: 'pk_xxx',
 *   reset_on_success: true,
 *   reset_delay_ms: 500,
 *   validate_on_blur: true
 * });
 *
 * // Listen for events
 * form.addEventListener('webflowform:success', (e) => {
 *   console.log('Form submitted!', e.detail);
 *   // Trigger analytics, show modal, etc.
 * });
 *
 * form.addEventListener('webflowform:error', (e) => {
 *   console.error('Form error:', e.detail.error);
 *   // Log to error tracking service
 * });
 * ```
 *
 * Data Attributes Reference:
 * - data-formspark-url: Formspark submission endpoint
 * - data-botpoison-public-key: Botpoison spam protection key
 * - data-form-reset: Enable/disable auto-reset (default: true)
 * - data-form-reset-delay: Milliseconds before reset (default: 200)
 * - data-form-fallback: Enable native fallback on CORS errors (default: true)
 * - data-error-message: Custom validation error message for field
 * - data-error-for="field_name": Associate error element with field
 */


/* ─────────────────────────────────────────────────────────────
   4. DUTCH PHONE FORMATTING & AUTOFILL DETECTION
──────────────────────────────────────────────────────────────── */

/**
 * Dutch Phone Number Formatter
 *
 * Formats phone numbers in Dutch mobile format: +31 6 XXXX XXXX
 * Handles various input formats (international, national, raw digits).
 * Includes caret position tracking for seamless user input.
 *
 * @example
 * const formatter = new DutchPhoneFormatter();
 * formatter.format('0612345678');     // '+31 6 1234 5678'
 * formatter.format('+31612345678');   // '+31 6 1234 5678'
 * formatter.format('31612345678');    // '+31 6 1234 5678'
 * formatter.is_valid('+31 6 1234 5678'); // true
 *
 * @see /src/2_javascript/form/form_validation.js:163-340
 */
class DutchPhoneFormatter {
  /** Maximum digits in Dutch mobile number (after country code) */
  static MAX_DIGITS = 9;

  /** Country code for Netherlands */
  static COUNTRY_CODE = '31';

  /**
   * Extract national digits from raw phone input
   * Normalizes various formats to consistent digit string
   *
   * @param {string} raw - Raw phone input value
   * @returns {{ digits: string, national: string }}
   *
   * @example
   * extract_digits('+31 6 1234 5678') // { digits: '31612345678', national: '612345678' }
   * extract_digits('0612345678')      // { digits: '0612345678', national: '612345678' }
   * extract_digits('06-1234-5678')    // { digits: '0612345678', national: '612345678' }
   */
  extract_digits(raw) {
    const text = raw || '';
    const digits_only = text.replace(/\D+/g, '');

    if (!digits_only) {
      return { digits: '', national: '' };
    }

    let national = digits_only;

    // Handle +31 prefix
    if (text.trim().startsWith('+')) {
      if (digits_only.startsWith('31')) {
        national = digits_only.slice(2);
      } else {
        national = digits_only.replace(/^31/, '');
      }
    }
    // Handle 31 without +
    else if (digits_only.startsWith('31')) {
      national = digits_only.slice(2);
    }
    // Handle leading 0 (national format)
    else if (digits_only.startsWith('0')) {
      national = digits_only.slice(1);
    }

    return {
      digits: digits_only,
      national: national.slice(0, DutchPhoneFormatter.MAX_DIGITS)
    };
  }

  /**
   * Format digits into +31 mobile layout with caret position tracking
   *
   * @param {string} raw - Raw phone input value
   * @returns {{ formatted: string, digits: string, positions: number[], prefix_length: number }}
   *
   * @example
   * format_value('0612345678')
   * // { formatted: '+31 6 1234 5678', digits: '612345678', positions: [...], prefix_length: 4 }
   */
  format_value(raw) {
    const { national: digits } = this.extract_digits(raw);

    if (!digits.length) {
      return {
        formatted: raw,
        digits,
        positions: [],
        prefix_length: raw.length
      };
    }

    let formatted = '+31 ';
    const positions = [];

    // Add leading mobile digit (6 for mobile)
    formatted += digits[0];
    positions.push(formatted.length);

    // Add middle group (digits 2-5)
    if (digits.length > 1) {
      formatted += ' ';
      const middle = digits.slice(1, Math.min(5, digits.length));
      for (let i = 0; i < middle.length; i++) {
        formatted += middle[i];
        positions.push(formatted.length);
      }
    }

    // Add tail group (digits 6-9)
    if (digits.length > 5) {
      formatted += ' ';
      const tail = digits.slice(5, DutchPhoneFormatter.MAX_DIGITS);
      for (let i = 0; i < tail.length; i++) {
        formatted += tail[i];
        positions.push(formatted.length);
      }
    }

    return {
      formatted,
      digits,
      positions,
      prefix_length: 4 // '+31 '
    };
  }

  /**
   * Simple format function for display purposes
   *
   * @param {string} value - Phone number in any format
   * @returns {string} Formatted as +31 6 XXXX XXXX
   */
  format(value) {
    return this.format_value(value).formatted;
  }

  /**
   * Count digits before a given caret position
   *
   * @param {string} raw - Raw phone input value
   * @param {number} caret - Current caret position
   * @returns {number} Number of national digits before caret
   */
  count_digits_before_caret(raw, caret) {
    const slice = raw.slice(0, caret);
    return this.extract_digits(slice).national.length;
  }

  /**
   * Calculate new caret position after formatting
   *
   * @param {{ formatted: string, digits: string, positions: number[], prefix_length: number }} result
   * @param {number} digit_count - Number of digits before caret
   * @returns {number} New caret position in formatted string
   */
  caret_from_digit_positions(result, digit_count) {
    if (digit_count <= 0) {
      return Math.min(result.prefix_length, result.formatted.length);
    }

    if (digit_count > result.digits.length) {
      return result.formatted.length;
    }

    const index = result.positions[digit_count - 1];
    return typeof index === 'number' ? index : result.formatted.length;
  }

  /**
   * Check if value is likely a Dutch phone number
   *
   * @param {string} value - Phone input value
   * @returns {boolean} True if probably Dutch number
   */
  is_probably_dutch(value) {
    const text = String(value || '').replace(/\s+/g, '');
    if (!text) return true;

    // Check for Dutch prefixes
    if (text.startsWith('+31') || text.startsWith('31') || text.startsWith('0031')) {
      return true;
    }

    // Accept '0' (national format) or '6' (mobile without leading 0)
    return text.startsWith('0') || text.startsWith('6');
  }

  /**
   * Validate Dutch mobile number structure
   *
   * @param {string} value - Phone number to validate
   * @returns {boolean} True if valid Dutch mobile number
   *
   * @example
   * is_valid('+31 6 1234 5678') // true
   * is_valid('0612345678')       // true
   * is_valid('+31 20 123 4567')  // false (landline, not mobile)
   */
  is_valid(value) {
    const { national } = this.extract_digits(value || '');

    // Must have exactly 9 digits after country code
    if (national.length !== DutchPhoneFormatter.MAX_DIGITS) {
      return false;
    }

    // Must start with 6 (mobile indicator)
    return national[0] === '6';
  }

  /**
   * Validate E.164 international format
   *
   * @param {string} value - Phone number to validate
   * @returns {boolean} True if valid E.164 format
   */
  is_valid_e164(value) {
    const normalized = String(value || '').replace(/[\s()-]/g, '');
    return /^\+[1-9][0-9]{6,14}$/.test(normalized);
  }
}


/**
 * International Phone Formatter
 *
 * Generic formatter for international phone numbers with country code detection.
 * Groups digits in readable chunks based on country code length.
 *
 * @example
 * const formatter = new InternationalPhoneFormatter();
 * formatter.format('+1 555 123 4567');  // US format
 * formatter.format('+44 20 7123 4567'); // UK format
 */
class InternationalPhoneFormatter {
  /**
   * Map digit positions in formatted string
   * @param {string} formatted - Formatted phone string
   * @returns {number[]} Array of positions for each digit
   */
  map_digit_positions(formatted) {
    const positions = [];
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        positions.push(i + 1);
      }
    }
    return positions;
  }

  /**
   * Format international phone number with smart grouping
   *
   * @param {string} raw - Raw phone input
   * @returns {{ formatted: string, digits: string, positions: number[], prefix_length: number }}
   */
  format_value(raw) {
    const text = raw || '';
    const trimmed = text.trim();
    const digits_only = text.replace(/\D+/g, '');

    // Return as-is if not international format
    if (!trimmed.startsWith('+') || !digits_only.length) {
      return {
        formatted: text,
        digits: digits_only,
        positions: this.map_digit_positions(text),
        prefix_length: trimmed.startsWith('+') ? 1 : 0
      };
    }

    // Determine country code length (1 for US/Russia, 2 for most others)
    let country_length;
    if (digits_only[0] === '1' || digits_only[0] === '7') {
      country_length = 1;
    } else if (digits_only.length >= 2) {
      country_length = 2;
    } else {
      country_length = digits_only.length;
    }

    const country = digits_only.slice(0, country_length);
    let remainder = digits_only.slice(country_length);

    // Group remaining digits in chunks of 3-4
    const groups = [];
    while (remainder.length > 4) {
      groups.push(remainder.slice(0, 3));
      remainder = remainder.slice(3);
    }
    if (remainder.length) {
      groups.push(remainder);
    }

    // Build formatted string
    let formatted = `+${country}`;
    if (groups.length) {
      formatted += ' ' + groups.join(' ');
    }

    const positions = this.map_digit_positions(formatted);
    const prefix_space_index = formatted.indexOf(' ');
    const prefix_length = prefix_space_index === -1
      ? formatted.length
      : Math.min(formatted.length, prefix_space_index + 1);

    return {
      formatted,
      digits: digits_only,
      positions,
      prefix_length
    };
  }

  /**
   * Simple format function
   * @param {string} value - Phone number
   * @returns {string} Formatted phone number
   */
  format(value) {
    return this.format_value(value).formatted;
  }
}


/**
 * Browser Autofill Detector
 *
 * Detects browser autofill events and triggers validation.
 * Uses CSS animation detection (most reliable cross-browser method)
 * with fallback to pseudo-class checking.
 *
 * Problem: Browser autofill doesn't trigger 'input' events consistently,
 * causing validation to miss autofilled values.
 *
 * Solution: Inject CSS animation on :-webkit-autofill pseudo-class,
 * listen for animationstart, then trigger validation.
 *
 * @example
 * const detector = new AutofillDetector();
 * detector.init();
 *
 * // Or with callback
 * detector.init((input) => {
 *   console.log('Autofill detected on:', input.name);
 *   validate_field(input);
 * });
 *
 * @see /src/2_javascript/form/form_validation.js:1264-1321
 */
class AutofillDetector {
  /** CSS style element ID */
  static STYLE_ID = 'autofill-detect-animation';

  /** Animation name for detection */
  static ANIMATION_NAME = 'autofilldetect';

  /** WeakSet to track bound inputs (prevents double-binding) */
  bound_inputs = new WeakSet();

  /**
   * Inject CSS animation styles for autofill detection
   * @private
   */
  inject_styles() {
    if (document.getElementById(AutofillDetector.STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = AutofillDetector.STYLE_ID;
    style.textContent = `
      @keyframes ${AutofillDetector.ANIMATION_NAME} {
        0% { opacity: 1; }
        100% { opacity: 1; }
      }
      input:-webkit-autofill,
      textarea:-webkit-autofill {
        animation: ${AutofillDetector.ANIMATION_NAME} 0.001s;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Bind autofill detection to input element
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} input - Input to monitor
   * @param {Function} [on_autofill] - Callback when autofill detected
   */
  bind_input(input, on_autofill) {
    // Skip if already bound (WeakSet prevents double-binding)
    if (this.bound_inputs.has(input)) {
      return;
    }
    this.bound_inputs.add(input);

    // Listen for animation triggered by autofill
    input.addEventListener('animationstart', (event) => {
      if (event.animationName === AutofillDetector.ANIMATION_NAME) {
        // Small delay to ensure autofill value is set
        setTimeout(() => {
          if (on_autofill) {
            on_autofill(input);
          } else {
            // Default: dispatch input event to trigger validation
            const input_event = new Event('input', { bubbles: true });
            input.dispatchEvent(input_event);
          }
        }, 50);
      }
    });
  }

  /**
   * Check autofill status using pseudo-class (fallback method)
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} input - Input to check
   * @returns {boolean} True if autofilled
   */
  is_autofilled(input) {
    try {
      return input.matches(':-webkit-autofill') || input.matches(':autofill');
    } catch (e) {
      // Browser doesn't support these pseudo-classes
      return false;
    }
  }

  /**
   * Initialize autofill detection on all inputs
   *
   * @param {Function} [on_autofill] - Callback when autofill detected
   */
  init(on_autofill) {
    this.inject_styles();

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      this.bind_input(input, on_autofill);
    });

    // Fallback: Check for autofill pseudo-class at various intervals
    // (catches autofill that happens before our listeners are bound)
    const check_autofill = () => {
      inputs.forEach((input) => {
        if (this.is_autofilled(input)) {
          if (on_autofill) {
            on_autofill(input);
          } else {
            const input_event = new Event('input', { bubbles: true });
            input.dispatchEvent(input_event);
          }
        }
      });
    };

    // Check at various intervals to catch different autofill timings
    setTimeout(check_autofill, 100);
    setTimeout(check_autofill, 500);
    setTimeout(check_autofill, 1000);
  }
}


/**
 * Field Binding Tracker
 *
 * WeakSet-based tracker to prevent double-binding of event handlers.
 * Essential for forms that may be re-initialized or have dynamic fields.
 *
 * Problem: Without tracking, re-running init() or adding dynamic fields
 * can result in multiple event handlers on the same element.
 *
 * Solution: WeakSet stores references without preventing garbage collection,
 * and provides O(1) lookup for "already bound?" checks.
 *
 * @example
 * const tracker = new FieldBindingTracker();
 *
 * function bindValidation(input) {
 *   if (tracker.is_bound(input, 'validation')) return;
 *   tracker.mark_bound(input, 'validation');
 *
 *   input.addEventListener('blur', validate_field);
 * }
 *
 * @see /src/2_javascript/form/form_validation.js:28-29
 */
class FieldBindingTracker {
  /**
   * Map of binding type to WeakSet
   * @type {Map<string, WeakSet>}
   */
  binding_sets = new Map();

  /**
   * Get or create WeakSet for binding type
   *
   * @param {string} binding_type - Type identifier (e.g., 'validation', 'formatter')
   * @returns {WeakSet}
   * @private
   */
  get_set(binding_type) {
    if (!this.binding_sets.has(binding_type)) {
      this.binding_sets.set(binding_type, new WeakSet());
    }
    return this.binding_sets.get(binding_type);
  }

  /**
   * Check if element is already bound for given type
   *
   * @param {Element} element - DOM element to check
   * @param {string} binding_type - Type of binding to check
   * @returns {boolean} True if already bound
   */
  is_bound(element, binding_type) {
    return this.get_set(binding_type).has(element);
  }

  /**
   * Mark element as bound for given type
   *
   * @param {Element} element - DOM element to mark
   * @param {string} binding_type - Type of binding
   */
  mark_bound(element, binding_type) {
    this.get_set(binding_type).add(element);
  }

  /**
   * Clear binding for element (useful for re-initialization)
   *
   * @param {Element} element - DOM element
   * @param {string} binding_type - Type of binding to clear
   */
  clear_binding(element, binding_type) {
    this.get_set(binding_type).delete(element);
  }

  /**
   * Clear all bindings of a type
   * Note: WeakSet doesn't support iteration, so this creates a new set
   *
   * @param {string} binding_type - Type to clear
   */
  clear_all_of_type(binding_type) {
    this.binding_sets.set(binding_type, new WeakSet());
  }
}


/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

// Export for module systems (Node.js, bundlers)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Original patterns
    ContactForm,
    // SafeDOM - REMOVED (deprecated 2026-01-11, use textContent directly)
    APIClient,
    // Webflow patterns
    BotpoisonProtection,
    WebflowFormState,
    WebflowForm,
    // Phone formatting & autofill detection
    DutchPhoneFormatter,
    InternationalPhoneFormatter,
    AutofillDetector,
    FieldBindingTracker
  };
}

// Export for ES modules
if (typeof window !== 'undefined') {
  window.ValidationPatterns = {
    // Original patterns
    ContactForm,
    // SafeDOM - REMOVED (deprecated 2026-01-11, use textContent directly)
    APIClient,
    // Webflow patterns
    BotpoisonProtection,
    WebflowFormState,
    WebflowForm,
    // Phone formatting & autofill detection
    DutchPhoneFormatter,
    InternationalPhoneFormatter,
    AutofillDetector,
    FieldBindingTracker
  };
}
