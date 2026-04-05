/* ─────────────────────────────────────────────────────────────
   DEFENSE-IN-DEPTH VALIDATION PATTERNS
   Production-ready TypeScript validation templates

   Validates at every layer to make errors structurally impossible

   Universal patterns that work across frontend stacks:
   - React, Vue, Svelte, Angular
   - Vanilla TypeScript/JavaScript
   - Node.js backend validation
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

/**
 * Validation result with typed error messages
 */
export interface ValidationResult<T = string> {
  /** Whether validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: T;
  /** Sanitized/transformed value */
  value?: unknown;
}

/**
 * Field validation rule
 */
export interface ValidationRule<T = unknown> {
  /** Validation function returning true if valid */
  validate: (value: T) => boolean | Promise<boolean>;
  /** Error message if validation fails */
  message: string;
}

/**
 * Form field configuration
 */
export interface FieldConfig {
  /** Field is required */
  required?: boolean;
  /** Minimum length */
  minLength?: number;
  /** Maximum length */
  maxLength?: number;
  /** Regex pattern to match */
  pattern?: RegExp;
  /** Custom validation rules */
  rules?: ValidationRule[];
  /** Custom error messages */
  messages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
  };
}

/**
 * API response validation schema
 */
export interface ResponseSchema<T = unknown> {
  /** Required fields */
  required?: (keyof T)[];
  /** Field type validators */
  fields?: Partial<Record<keyof T, (value: unknown) => boolean>>;
  /** Nested object schemas */
  nested?: Partial<Record<keyof T, ResponseSchema>>;
}

/**
 * Sanitization options
 */
export interface SanitizeOptions {
  /** Maximum string length */
  maxLength?: number;
  /** Trim whitespace */
  trim?: boolean;
  /** Convert to lowercase */
  lowercase?: boolean;
  /** Strip HTML tags */
  stripHtml?: boolean;
  /** Encode HTML entities */
  encodeHtml?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   1. TYPE GUARDS AND NARROWING
──────────────────────────────────────────────────────────────── */

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number (not NaN)
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Check if value is a finite number
 */
export function isFiniteNumber(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value);
}

/**
 * Check if value is an integer
 */
export function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value);
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Check if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if value is an array of specific type
 */
export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return isArray(value) && value.every(guard);
}

/**
 * Check if value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is not null or undefined
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

/**
 * Check if value is a Date object
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if value is a valid URL string
 */
export function isValidUrl(value: unknown): value is string {
  if (!isString(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Check if value is a Promise-like object
 */
export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    isPlainObject(value) &&
    'then' in value &&
    isFunction((value as Record<string, unknown>).then)
  );
}

/* ─────────────────────────────────────────────────────────────
   2. INPUT VALIDATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Strong password regex (8+ chars, uppercase, lowercase, number)
 */
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Phone regex (international format with optional +)
 */
const PHONE_REGEX = /^\+?[\d\s\-()]{7,20}$/;

/**
 * URL regex (http/https)
 */
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

/**
 * UUID v4 regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Slug regex (lowercase letters, numbers, hyphens)
 */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validate email address
 *
 * @example
 * if (validateEmail(input).isValid) {
 *   sendEmail(input);
 * }
 */
export function validateEmail(value: unknown): ValidationResult {
  if (!isString(value)) {
    return { isValid: false, error: 'Email must be a string' };
  }

  const trimmed = value.trim().toLowerCase();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true, value: trimmed };
}

/**
 * Validate password strength
 *
 * @param value - Password to validate
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * const result = validatePassword(password, { minLength: 10 });
 * if (!result.isValid) {
 *   showError(result.error);
 * }
 */
export function validatePassword(
  value: unknown,
  options: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecial?: boolean;
  } = {}
): ValidationResult {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = false,
  } = options;

  if (!isString(value)) {
    return { isValid: false, error: 'Password must be a string' };
  }

  if (value.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }

  if (value.length > maxLength) {
    return { isValid: false, error: `Password must be at most ${maxLength} characters` };
  }

  if (requireUppercase && !/[A-Z]/.test(value)) {
    return { isValid: false, error: 'Password must contain an uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(value)) {
    return { isValid: false, error: 'Password must contain a lowercase letter' };
  }

  if (requireNumber && !/\d/.test(value)) {
    return { isValid: false, error: 'Password must contain a number' };
  }

  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return { isValid: false, error: 'Password must contain a special character' };
  }

  return { isValid: true };
}

/**
 * Validate phone number
 *
 * @example
 * const result = validatePhone('+1 555-123-4567');
 */
export function validatePhone(value: unknown): ValidationResult {
  if (!isString(value)) {
    return { isValid: false, error: 'Phone must be a string' };
  }

  const cleaned = value.replace(/[\s\-()]/g, '');

  if (cleaned.length === 0) {
    return { isValid: false, error: 'Phone is required' };
  }

  if (!/^\+?\d{7,15}$/.test(cleaned)) {
    return { isValid: false, error: 'Invalid phone format' };
  }

  return { isValid: true, value: cleaned };
}

/**
 * Validate URL
 *
 * @param value - URL to validate
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * const result = validateUrl(url, { requireHttps: true });
 */
export function validateUrl(
  value: unknown,
  options: {
    requireHttps?: boolean;
    allowedProtocols?: string[];
  } = {}
): ValidationResult {
  const { requireHttps = false, allowedProtocols = ['http:', 'https:'] } = options;

  if (!isString(value)) {
    return { isValid: false, error: 'URL must be a string' };
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const url = new URL(trimmed);

    if (!allowedProtocols.includes(url.protocol)) {
      return {
        isValid: false,
        error: `URL must use one of: ${allowedProtocols.join(', ')}`,
      };
    }

    if (requireHttps && url.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use HTTPS' };
    }

    return { isValid: true, value: url.href };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate UUID
 *
 * @example
 * if (validateUuid(id).isValid) {
 *   fetchUser(id);
 * }
 */
export function validateUuid(value: unknown): ValidationResult {
  if (!isString(value)) {
    return { isValid: false, error: 'UUID must be a string' };
  }

  if (!UUID_REGEX.test(value)) {
    return { isValid: false, error: 'Invalid UUID format' };
  }

  return { isValid: true, value: value.toLowerCase() };
}

/**
 * Validate slug
 *
 * @example
 * const result = validateSlug('my-blog-post');
 */
export function validateSlug(
  value: unknown,
  options: { minLength?: number; maxLength?: number } = {}
): ValidationResult {
  const { minLength = 1, maxLength = 200 } = options;

  if (!isString(value)) {
    return { isValid: false, error: 'Slug must be a string' };
  }

  const trimmed = value.trim().toLowerCase();

  if (trimmed.length < minLength) {
    return { isValid: false, error: `Slug must be at least ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Slug must be at most ${maxLength} characters` };
  }

  if (!SLUG_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: 'Slug must contain only lowercase letters, numbers, and hyphens',
    };
  }

  return { isValid: true, value: trimmed };
}

/**
 * Validate numeric value within range
 *
 * @example
 * const result = validateNumber(age, { min: 0, max: 150, integer: true });
 */
export function validateNumber(
  value: unknown,
  options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): ValidationResult {
  const { min, max, integer = false } = options;

  if (!isNumber(value)) {
    // Try to parse if string
    if (isString(value)) {
      const parsed = Number(value);
      if (isNaN(parsed)) {
        return { isValid: false, error: 'Invalid number' };
      }
      return validateNumber(parsed, options);
    }
    return { isValid: false, error: 'Value must be a number' };
  }

  if (integer && !Number.isInteger(value)) {
    return { isValid: false, error: 'Value must be an integer' };
  }

  if (min !== undefined && value < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && value > max) {
    return { isValid: false, error: `Value must be at most ${max}` };
  }

  return { isValid: true, value };
}

/**
 * Validate date
 *
 * @example
 * const result = validateDate(birthDate, { maxDate: new Date() });
 */
export function validateDate(
  value: unknown,
  options: {
    minDate?: Date;
    maxDate?: Date;
  } = {}
): ValidationResult {
  const { minDate, maxDate } = options;

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (isString(value) || isNumber(value)) {
    date = new Date(value);
  } else {
    return { isValid: false, error: 'Invalid date value' };
  }

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  if (minDate && date < minDate) {
    return { isValid: false, error: `Date must be after ${minDate.toISOString()}` };
  }

  if (maxDate && date > maxDate) {
    return { isValid: false, error: `Date must be before ${maxDate.toISOString()}` };
  }

  return { isValid: true, value: date };
}

/* ─────────────────────────────────────────────────────────────
   3. SANITIZATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Sanitize text input
 * Removes potential XSS vectors and normalizes whitespace
 *
 * @example
 * const safe = sanitizeText(userInput, { maxLength: 1000, encodeHtml: true });
 */
export function sanitizeText(value: unknown, options: SanitizeOptions = {}): string {
  const {
    maxLength = 10000,
    trim = true,
    lowercase = false,
    stripHtml = true,
    encodeHtml = false,
  } = options;

  if (!isString(value)) {
    return '';
  }

  let result = value;

  // Trim whitespace
  if (trim) {
    result = result.trim();
  }

  // Strip HTML tags
  if (stripHtml) {
    result = result.replace(/<[^>]*>/g, '');
  }

  // Encode HTML entities
  if (encodeHtml) {
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Convert to lowercase
  if (lowercase) {
    result = result.toLowerCase();
  }

  // Enforce max length
  if (result.length > maxLength) {
    result = result.slice(0, maxLength);
  }

  return result;
}

/**
 * Sanitize email address
 *
 * @example
 * const email = sanitizeEmail('  User@Example.COM  ');
 * // Returns: 'user@example.com'
 */
export function sanitizeEmail(value: unknown): string {
  if (!isString(value)) return '';

  return value.toLowerCase().trim().slice(0, 254);
}

/**
 * Sanitize phone number
 * Removes formatting characters, keeps only digits and leading +
 *
 * @example
 * const phone = sanitizePhone('+1 (555) 123-4567');
 * // Returns: '+15551234567'
 */
export function sanitizePhone(value: unknown): string {
  if (!isString(value)) return '';

  const hasPlus = value.trim().startsWith('+');
  const digits = value.replace(/\D/g, '');

  return hasPlus ? `+${digits}` : digits;
}

/**
 * Sanitize URL
 * Validates and normalizes URL
 *
 * @example
 * const url = sanitizeUrl('  HTTPS://EXAMPLE.COM/Path  ');
 * // Returns: 'https://example.com/Path'
 */
export function sanitizeUrl(value: unknown): string | null {
  if (!isString(value)) return null;

  try {
    const url = new URL(value.trim());

    // Only allow safe protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

/**
 * Sanitize filename
 * Removes path traversal and invalid characters
 *
 * @example
 * const filename = sanitizeFilename('../../../etc/passwd');
 * // Returns: 'etcpasswd'
 */
export function sanitizeFilename(value: unknown): string {
  if (!isString(value)) return '';

  return value
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[<>:"|?*\x00-\x1f]/g, '') // Remove invalid chars
    .trim()
    .slice(0, 255);
}

/**
 * Sanitize for SQL LIKE pattern
 * Escapes special LIKE characters
 *
 * @example
 * const pattern = sanitizeLikePattern('100%');
 * // Returns: '100\\%'
 */
export function sanitizeLikePattern(value: unknown): string {
  if (!isString(value)) return '';

  return value.replace(/[%_\\]/g, '\\$&');
}

/* ─────────────────────────────────────────────────────────────
   4. API RESPONSE VALIDATION
──────────────────────────────────────────────────────────────── */

/**
 * Validate API response structure
 *
 * @example
 * const schema: ResponseSchema<User> = {
 *   required: ['id', 'email'],
 *   fields: {
 *     id: isString,
 *     email: (v) => isString(v) && EMAIL_REGEX.test(v),
 *     age: (v) => v === undefined || isNumber(v)
 *   }
 * };
 *
 * const result = validateResponse(apiData, schema);
 */
export function validateResponse<T>(
  data: unknown,
  schema: ResponseSchema<T>
): ValidationResult {
  if (!isPlainObject(data)) {
    return { isValid: false, error: 'Response must be an object' };
  }

  const obj = data as Record<string, unknown>;

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in obj) || obj[field as string] === undefined) {
        return { isValid: false, error: `Missing required field: ${String(field)}` };
      }
    }
  }

  // Validate field types
  if (schema.fields) {
    for (const [field, validator] of Object.entries(schema.fields)) {
      if (field in obj && validator && !validator(obj[field])) {
        return { isValid: false, error: `Invalid type for field: ${field}` };
      }
    }
  }

  // Validate nested objects
  if (schema.nested) {
    for (const [field, nestedSchema] of Object.entries(schema.nested)) {
      if (field in obj && nestedSchema) {
        const nestedResult = validateResponse(obj[field], nestedSchema);
        if (!nestedResult.isValid) {
          return {
            isValid: false,
            error: `${field}.${nestedResult.error}`,
          };
        }
      }
    }
  }

  return { isValid: true, value: data };
}

/**
 * Type guard for API error response
 */
export interface ApiErrorResponse {
  error: string;
  code?: string | number;
  details?: unknown;
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  return isPlainObject(response) && 'error' in response && isString(response.error);
}

/**
 * Validate paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function validatePaginatedResponse<T>(
  response: unknown,
  itemValidator?: (item: unknown) => item is T
): ValidationResult<PaginatedResponse<T>> {
  if (!isPlainObject(response)) {
    return { isValid: false, error: 'Response must be an object' };
  }

  const obj = response as Record<string, unknown>;

  if (!isArray(obj.data)) {
    return { isValid: false, error: 'Response must have data array' };
  }

  if (!isInteger(obj.total) || obj.total < 0) {
    return { isValid: false, error: 'Invalid total count' };
  }

  if (!isInteger(obj.page) || obj.page < 0) {
    return { isValid: false, error: 'Invalid page number' };
  }

  if (!isInteger(obj.pageSize) || obj.pageSize <= 0) {
    return { isValid: false, error: 'Invalid page size' };
  }

  if (!isBoolean(obj.hasMore)) {
    return { isValid: false, error: 'Invalid hasMore flag' };
  }

  // Validate items if validator provided
  if (itemValidator && !obj.data.every(itemValidator)) {
    return { isValid: false, error: 'Invalid item in data array' };
  }

  return { isValid: true, value: obj as PaginatedResponse<T> };
}

/* ─────────────────────────────────────────────────────────────
   5. FORM VALIDATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Create a field validator with multiple rules
 *
 * @example
 * const validateUsername = createFieldValidator({
 *   required: true,
 *   minLength: 3,
 *   maxLength: 20,
 *   pattern: /^[a-z0-9_]+$/,
 *   messages: {
 *     pattern: 'Username can only contain lowercase letters, numbers, and underscores'
 *   }
 * });
 *
 * const result = validateUsername(input);
 */
export function createFieldValidator(
  config: FieldConfig
): (value: unknown) => ValidationResult {
  return (value: unknown): ValidationResult => {
    // Required check
    if (config.required && (value === undefined || value === null || value === '')) {
      return {
        isValid: false,
        error: config.messages?.required || 'This field is required',
      };
    }

    // Skip other validations if empty and not required
    if (!config.required && (value === undefined || value === null || value === '')) {
      return { isValid: true };
    }

    // String validations
    if (isString(value)) {
      const trimmed = value.trim();

      if (config.minLength !== undefined && trimmed.length < config.minLength) {
        return {
          isValid: false,
          error:
            config.messages?.minLength ||
            `Must be at least ${config.minLength} characters`,
        };
      }

      if (config.maxLength !== undefined && trimmed.length > config.maxLength) {
        return {
          isValid: false,
          error:
            config.messages?.maxLength ||
            `Must be at most ${config.maxLength} characters`,
        };
      }

      if (config.pattern && !config.pattern.test(trimmed)) {
        return {
          isValid: false,
          error: config.messages?.pattern || 'Invalid format',
        };
      }
    }

    // Custom rules
    if (config.rules) {
      for (const rule of config.rules) {
        const result = rule.validate(value);
        if (result instanceof Promise) {
          // For async validation, return a marker
          // Caller should handle async validation separately
          console.warn('Async validation rules should be handled separately');
        } else if (!result) {
          return { isValid: false, error: rule.message };
        }
      }
    }

    return { isValid: true, value };
  };
}

/**
 * Validate entire form data object
 *
 * @example
 * const errors = validateForm(formData, {
 *   email: { required: true, pattern: EMAIL_REGEX },
 *   password: { required: true, minLength: 8 },
 *   age: { rules: [{ validate: (v) => Number(v) >= 18, message: 'Must be 18+' }] }
 * });
 *
 * if (Object.keys(errors).length > 0) {
 *   showErrors(errors);
 * }
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  schema: Record<keyof T, FieldConfig>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const [field, config] of Object.entries(schema) as [keyof T, FieldConfig][]) {
    const validator = createFieldValidator(config);
    const result = validator(data[field]);

    if (!result.isValid && result.error) {
      errors[field] = result.error;
    }
  }

  return errors;
}

/**
 * Create async validator for fields requiring API checks
 *
 * @example
 * const checkUsernameAvailable = createAsyncValidator(
 *   async (username) => {
 *     const response = await fetch(`/api/check-username?q=${username}`);
 *     const data = await response.json();
 *     return data.available;
 *   },
 *   'Username is already taken'
 * );
 */
export function createAsyncValidator(
  check: (value: unknown) => Promise<boolean>,
  errorMessage: string
): (value: unknown) => Promise<ValidationResult> {
  return async (value: unknown): Promise<ValidationResult> => {
    try {
      const isValid = await check(value);
      return isValid ? { isValid: true } : { isValid: false, error: errorMessage };
    } catch (error) {
      return { isValid: false, error: 'Validation check failed' };
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   6. ZOD-STYLE SCHEMA BUILDER
──────────────────────────────────────────────────────────────── */

/**
 * Schema builder for type-safe validation
 * Inspired by Zod but framework-agnostic
 */
export class Schema<T> {
  private validators: Array<(value: unknown) => ValidationResult> = [];
  private transformers: Array<(value: T) => T> = [];

  /**
   * Add a validation rule
   */
  refine(
    check: (value: T) => boolean,
    message: string
  ): Schema<T> {
    this.validators.push((value: unknown) => {
      if (!check(value as T)) {
        return { isValid: false, error: message };
      }
      return { isValid: true };
    });
    return this;
  }

  /**
   * Add a transformation
   */
  transform(fn: (value: T) => T): Schema<T> {
    this.transformers.push(fn);
    return this;
  }

  /**
   * Parse and validate value
   */
  parse(value: unknown): { success: true; data: T } | { success: false; error: string } {
    for (const validator of this.validators) {
      const result = validator(value);
      if (!result.isValid) {
        return { success: false, error: result.error || 'Validation failed' };
      }
    }

    let transformed = value as T;
    for (const transformer of this.transformers) {
      transformed = transformer(transformed);
    }

    return { success: true, data: transformed };
  }

  /**
   * Safe parse (returns result object)
   */
  safeParse(value: unknown): { success: boolean; data?: T; error?: string } {
    return this.parse(value);
  }
}

/**
 * Create a string schema
 */
export function string(): Schema<string> & {
  min: (length: number, message?: string) => Schema<string>;
  max: (length: number, message?: string) => Schema<string>;
  email: (message?: string) => Schema<string>;
  url: (message?: string) => Schema<string>;
  uuid: (message?: string) => Schema<string>;
  regex: (pattern: RegExp, message?: string) => Schema<string>;
  trim: () => Schema<string>;
  toLowerCase: () => Schema<string>;
} {
  const schema = new Schema<string>();

  schema.refine(isString, 'Expected string');

  return Object.assign(schema, {
    min(length: number, message = `Must be at least ${length} characters`) {
      return schema.refine((v) => v.length >= length, message);
    },
    max(length: number, message = `Must be at most ${length} characters`) {
      return schema.refine((v) => v.length <= length, message);
    },
    email(message = 'Invalid email') {
      return schema.refine((v) => EMAIL_REGEX.test(v), message);
    },
    url(message = 'Invalid URL') {
      return schema.refine((v) => URL_REGEX.test(v), message);
    },
    uuid(message = 'Invalid UUID') {
      return schema.refine((v) => UUID_REGEX.test(v), message);
    },
    regex(pattern: RegExp, message = 'Invalid format') {
      return schema.refine((v) => pattern.test(v), message);
    },
    trim() {
      return schema.transform((v) => v.trim());
    },
    toLowerCase() {
      return schema.transform((v) => v.toLowerCase());
    },
  });
}

/**
 * Create a number schema
 */
export function number(): Schema<number> & {
  min: (value: number, message?: string) => Schema<number>;
  max: (value: number, message?: string) => Schema<number>;
  int: (message?: string) => Schema<number>;
  positive: (message?: string) => Schema<number>;
  negative: (message?: string) => Schema<number>;
} {
  const schema = new Schema<number>();

  schema.refine(isNumber, 'Expected number');

  return Object.assign(schema, {
    min(value: number, message = `Must be at least ${value}`) {
      return schema.refine((v) => v >= value, message);
    },
    max(value: number, message = `Must be at most ${value}`) {
      return schema.refine((v) => v <= value, message);
    },
    int(message = 'Must be an integer') {
      return schema.refine(Number.isInteger, message);
    },
    positive(message = 'Must be positive') {
      return schema.refine((v) => v > 0, message);
    },
    negative(message = 'Must be negative') {
      return schema.refine((v) => v < 0, message);
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   7. ERROR MESSAGE FORMATTING
──────────────────────────────────────────────────────────────── */

/**
 * Error message templates
 */
export const ErrorMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must be at most ${max} characters`,
  email: (field: string) => `${field} must be a valid email address`,
  url: (field: string) => `${field} must be a valid URL`,
  phone: (field: string) => `${field} must be a valid phone number`,
  number: (field: string) => `${field} must be a number`,
  integer: (field: string) => `${field} must be a whole number`,
  min: (field: string, min: number) => `${field} must be at least ${min}`,
  max: (field: string, max: number) => `${field} must be at most ${max}`,
  pattern: (field: string) => `${field} format is invalid`,
  match: (field: string, other: string) => `${field} must match ${other}`,
};

/**
 * Format validation errors for display
 *
 * @example
 * const formatted = formatErrors({
 *   email: 'Invalid email',
 *   password: 'Too short'
 * });
 * // Returns: 'email: Invalid email\npassword: Too short'
 */
export function formatErrors(errors: Record<string, string>): string {
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join('\n');
}

/**
 * Format errors as HTML list
 *
 * @example
 * const html = formatErrorsHtml(errors);
 * errorContainer.innerHTML = html;
 */
export function formatErrorsHtml(errors: Record<string, string>): string {
  const items = Object.entries(errors)
    .map(([field, message]) => `<li><strong>${field}:</strong> ${message}</li>`)
    .join('');

  return `<ul class="validation-errors">${items}</ul>`;
}

/**
 * Get first error message
 */
export function getFirstError(errors: Record<string, string>): string | null {
  const entries = Object.entries(errors);
  return entries.length > 0 ? entries[0][1] : null;
}

/* ─────────────────────────────────────────────────────────────
   8. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Deep freeze an object to make it immutable
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach((key) => {
    const value = (obj as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value as object);
    }
  });
  return Object.freeze(obj);
}

/**
 * Assert value is defined (throws if null/undefined)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value is required'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

/**
 * Assert condition is true
 */
export function assert(condition: boolean, message = 'Assertion failed'): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Exhaustive check for switch statements
 * Ensures all cases are handled at compile time
 *
 * @example
 * type Status = 'pending' | 'success' | 'error';
 *
 * function handleStatus(status: Status) {
 *   switch (status) {
 *     case 'pending': return 'Loading...';
 *     case 'success': return 'Done!';
 *     case 'error': return 'Failed';
 *     default: return exhaustive(status);
 *   }
 * }
 */
export function exhaustive(value: never): never {
  throw new Error(`Unhandled case: ${value}`);
}

/**
 * Safe JSON parse with validation
 */
export function safeJsonParse<T>(
  json: string,
  validator?: (data: unknown) => data is T
): T | null {
  try {
    const data = JSON.parse(json);
    if (validator && !validator(data)) {
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

/**
 * Coerce value to string safely
 */
export function coerceString(value: unknown): string {
  if (isString(value)) return value;
  if (isNullish(value)) return '';
  if (isNumber(value) || isBoolean(value)) return String(value);
  return '';
}

/**
 * Coerce value to number safely
 */
export function coerceNumber(value: unknown, fallback = 0): number {
  if (isNumber(value)) return value;
  if (isString(value)) {
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

/**
 * Coerce value to boolean safely
 */
export function coerceBoolean(value: unknown): boolean {
  if (isBoolean(value)) return value;
  if (isString(value)) {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  if (isNumber(value)) return value !== 0;
  return Boolean(value);
}
