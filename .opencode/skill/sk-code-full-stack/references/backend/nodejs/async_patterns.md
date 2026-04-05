---
title: Async Patterns - Promise and Async/Await Best Practices
description: Mandatory async/await patterns for Node.js backend projects defining promise handling, error management, concurrent operations, streams, and event emitter patterns.
---

# Async Patterns - Promise and Async/Await Best Practices

Mandatory async/await patterns for Node.js backend projects defining promise handling, error management, concurrent operations, streams, and event emitter patterns.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

- **Consistent async code** - Predictable patterns for asynchronous operations
- **Proper error handling** - No silent failures or unhandled rejections
- **Performance optimization** - Efficient concurrent and sequential operations
- **Resource management** - Proper cleanup and cancellation patterns
- **Readability** - Clear, maintainable async code

### Progressive Disclosure

```
Level 1: This file (async_patterns.md)
         - Promises, async/await, errors, concurrency, streams
            |
Level 2: Related knowledge files
         |- nodejs_standards.md - Project structure and logging
         |- express_patterns.md - Async middleware patterns
         +- testing_strategy.md - Testing async code
```

### When to Use This File

- Writing async functions
- Handling promise errors
- Implementing concurrent operations
- Processing streams
- Working with event emitters
- Reviewing async code for patterns compliance

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:promise-fundamentals -->
## 2. PROMISE FUNDAMENTALS

### How Do I Create Promises?

**Basic Promise Creation:**

```typescript
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
```

**Promisifying Callbacks:**

```typescript
import { promisify } from 'util';
import { readFile as readFileCallback } from 'fs';

// Using promisify
const readFile = promisify(readFileCallback);

// Manual promisification
function readFileManual(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    readFileCallback(path, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
```

### Promise States

| State       | Description                      | Transitions To     |
| ----------- | -------------------------------- | ------------------ |
| `pending`   | Initial state, operation ongoing | fulfilled/rejected |
| `fulfilled` | Operation completed successfully | (terminal)         |
| `rejected`  | Operation failed                 | (terminal)         |

### Promise Chain Methods

```typescript
// .then() - Transform fulfilled value
const result = await promise
  .then((value) => transform(value))
  .then((transformed) => process(transformed));

// .catch() - Handle rejection
const safeResult = await promise
  .catch((error) => {
    log.error({ err: error }, 'Operation failed');
    return defaultValue;
  });

// .finally() - Cleanup regardless of outcome
await promise
  .finally(() => {
    cleanup();
  });
```

---

<!-- /ANCHOR:promise-fundamentals -->
<!-- ANCHOR:async-await-patterns -->
## 3. ASYNC/AWAIT PATTERNS

### Basic Async Function Structure

```typescript
async function processUser(userId: string): Promise<UserResult> {
  const log = createChildLogger('processUser');

  try {
    log.debug({ userId }, 'Starting user processing');

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User');
    }

    const processed = await processUserData(user);

    log.info({ userId }, 'User processing completed');
    return processed;
  } catch (error) {
    log.error({ err: error, userId }, 'User processing failed');
    throw error;
  }
}
```

### Sequential vs Parallel Execution

**Sequential (when order matters or dependent):**

```typescript
async function processOrderSequentially(orderId: string): Promise<void> {
  // Each step depends on the previous
  const order = await orderRepository.findById(orderId);
  const validated = await validateOrder(order);
  const priced = await calculatePricing(validated);
  const saved = await orderRepository.save(priced);
  await sendConfirmation(saved);
}
```

**Parallel (independent operations):**

```typescript
async function fetchDashboardData(userId: string): Promise<DashboardData> {
  // All operations are independent
  const [user, orders, notifications, analytics] = await Promise.all([
    userService.getById(userId),
    orderService.getByUserId(userId),
    notificationService.getUnread(userId),
    analyticsService.getUserStats(userId),
  ]);

  return { user, orders, notifications, analytics };
}
```

**Mixed Sequential and Parallel:**

```typescript
async function processCheckout(cartId: string): Promise<Order> {
  // Step 1: Get cart (must happen first)
  const cart = await cartService.getById(cartId);

  // Step 2: Parallel validations
  const [inventory, pricing, userAddress] = await Promise.all([
    inventoryService.checkAvailability(cart.items),
    pricingService.calculate(cart.items),
    addressService.getDefault(cart.userId),
  ]);

  // Step 3: Create order (depends on step 2)
  const order = await orderService.create({
    cart,
    inventory,
    pricing,
    shippingAddress: userAddress,
  });

  // Step 4: Parallel post-processing
  await Promise.all([
    cartService.clear(cartId),
    notificationService.sendOrderConfirmation(order),
    analyticsService.trackOrder(order),
  ]);

  return order;
}
```

---

<!-- /ANCHOR:async-await-patterns -->
<!-- ANCHOR:error-handling-in-async-code -->
## 4. ERROR HANDLING IN ASYNC CODE

### Try/Catch Patterns

**Basic try/catch:**

```typescript
async function safeOperation(): Promise<Result> {
  try {
    return await riskyOperation();
  } catch (error) {
    // Handle or transform error
    throw new AppError('Operation failed', ErrorCode.INTERNAL_ERROR, 500);
  }
}
```

**Typed error handling:**

```typescript
async function handleTypedErrors(): Promise<User> {
  try {
    return await userRepository.findById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      // Handle not found
      throw error;
    }

    if (error instanceof DatabaseError) {
      // Handle database errors
      log.error({ err: error }, 'Database error');
      throw new InternalError('Database unavailable');
    }

    // Unknown error
    log.error({ err: error }, 'Unexpected error');
    throw new InternalError();
  }
}
```

**Error boundary pattern:**

```typescript
async function withErrorBoundary<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    log.error({ err: error, context }, 'Operation failed');

    if (error instanceof AppError) {
      throw error;
    }

    throw new InternalError(`${context}: ${(error as Error).message}`);
  }
}

// Usage
const user = await withErrorBoundary(
  () => userService.create(data),
  'User creation'
);
```

### Error Wrapping

```typescript
class AsyncError extends Error {
  public readonly cause: Error;
  public readonly context: Record<string, unknown>;

  constructor(
    message: string,
    cause: Error,
    context: Record<string, unknown> = {}
  ) {
    super(message);
    this.cause = cause;
    this.context = context;
    this.name = 'AsyncError';
  }
}

async function wrapError<T>(
  promise: Promise<T>,
  message: string,
  context: Record<string, unknown> = {}
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    throw new AsyncError(message, error as Error, context);
  }
}

// Usage
const order = await wrapError(
  orderService.create(data),
  'Failed to create order',
  { userId: data.userId, itemCount: data.items.length }
);
```

### Handling Multiple Errors

```typescript
interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

async function tryAll<T>(
  operations: Array<() => Promise<T>>
): Promise<OperationResult<T>[]> {
  return Promise.all(
    operations.map(async (operation) => {
      try {
        const data = await operation();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: error as Error };
      }
    })
  );
}

// Usage
const results = await tryAll([
  () => sendEmail(user),
  () => sendSms(user),
  () => sendPush(user),
]);

const failures = results.filter((r) => !r.success);
if (failures.length > 0) {
  log.warn({ failures }, 'Some notifications failed');
}
```

---

<!-- /ANCHOR:error-handling-in-async-code -->
<!-- ANCHOR:concurrent-operations -->
## 5. CONCURRENT OPERATIONS

### Promise.all - All Must Succeed

```typescript
async function fetchAllUserData(userId: string): Promise<UserData> {
  // If any fails, all fail
  const [profile, orders, preferences] = await Promise.all([
    profileService.get(userId),
    orderService.getRecent(userId),
    preferenceService.get(userId),
  ]);

  return { profile, orders, preferences };
}
```

### Promise.allSettled - Independent Results

```typescript
interface NotificationResults {
  sent: string[];
  failed: Array<{ channel: string; error: Error }>;
}

async function notifyAllChannels(
  user: User,
  message: string
): Promise<NotificationResults> {
  const channels = ['email', 'sms', 'push'] as const;

  const results = await Promise.allSettled(
    channels.map((channel) => notify(channel, user, message))
  );

  const sent: string[] = [];
  const failed: Array<{ channel: string; error: Error }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      sent.push(channels[index]);
    } else {
      failed.push({ channel: channels[index], error: result.reason });
    }
  });

  return { sent, failed };
}
```

### Promise.race - First to Complete

```typescript
async function fetchWithFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  primaryTimeoutMs: number
): Promise<T> {
  try {
    return await Promise.race([
      primary(),
      delay(primaryTimeoutMs).then(() => {
        throw new Error('Primary source timeout');
      }),
    ]);
  } catch {
    log.warn('Primary source failed, using fallback');
    return fallback();
  }
}
```

### Promise.any - First Success

```typescript
async function fetchFromAnyMirror<T>(
  mirrors: Array<() => Promise<T>>
): Promise<T> {
  try {
    return await Promise.any(mirrors.map((fn) => fn()));
  } catch (error) {
    // AggregateError if all fail
    throw new Error('All mirrors failed');
  }
}
```

### Concurrency Control

**Batch processing with limit:**

```typescript
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  const queue = [...items];

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const item = queue.shift()!;
      const result = await processor(item);
      results.push(result);
    }
  }

  const workers = Array(Math.min(concurrency, items.length))
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);
  return results;
}

// Usage
const processed = await processBatch(
  users,
  (user) => processUser(user),
  5 // Max 5 concurrent operations
);
```

**Using p-limit library:**

```typescript
import pLimit from 'p-limit';

const limit = pLimit(5);

async function processWithLimit<T>(items: T[]): Promise<void> {
  await Promise.all(
    items.map((item) => limit(() => processItem(item)))
  );
}
```

**Rate limiting:**

```typescript
async function rateLimitedProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  requestsPerSecond: number
): Promise<R[]> {
  const delayMs = 1000 / requestsPerSecond;
  const results: R[] = [];

  for (const item of items) {
    const start = Date.now();
    results.push(await processor(item));
    const elapsed = Date.now() - start;

    if (elapsed < delayMs) {
      await delay(delayMs - elapsed);
    }
  }

  return results;
}
```

---

<!-- /ANCHOR:concurrent-operations -->
<!-- ANCHOR:retry-patterns -->
## 6. RETRY PATTERNS

### Basic Retry

```typescript
async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number,
  delayMs: number
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      log.warn({ attempt, maxAttempts, err: error }, 'Operation failed, retrying');

      if (attempt < maxAttempts) {
        await delay(delayMs);
      }
    }
  }

  throw lastError!;
}
```

### Exponential Backoff

```typescript
interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors?: Array<new (...args: unknown[]) => Error>;
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxAttempts,
    initialDelayMs,
    maxDelayMs,
    backoffMultiplier,
    retryableErrors,
  } = options;

  let lastError: Error;
  let delayMs = initialDelayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      if (retryableErrors && retryableErrors.length > 0) {
        const isRetryable = retryableErrors.some(
          (ErrorClass) => error instanceof ErrorClass
        );
        if (!isRetryable) {
          throw error;
        }
      }

      log.warn(
        { attempt, maxAttempts, delayMs, err: error },
        'Operation failed, retrying with backoff'
      );

      if (attempt < maxAttempts) {
        await delay(delayMs);
        delayMs = Math.min(delayMs * backoffMultiplier, maxDelayMs);
      }
    }
  }

  throw lastError!;
}

// Usage
const result = await retryWithBackoff(
  () => externalApi.call(),
  {
    maxAttempts: 5,
    initialDelayMs: 100,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    retryableErrors: [NetworkError, TimeoutError],
  }
);
```

### Retry with Jitter

```typescript
function jitter(delayMs: number, factor = 0.3): number {
  const jitterAmount = delayMs * factor;
  return delayMs + Math.random() * jitterAmount - jitterAmount / 2;
}

async function retryWithJitter<T>(
  operation: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxAttempts) {
        const delayWithJitter = jitter(baseDelayMs * Math.pow(2, attempt - 1));
        await delay(delayWithJitter);
      }
    }
  }

  throw lastError!;
}
```

---

<!-- /ANCHOR:retry-patterns -->
<!-- ANCHOR:timeout-patterns -->
## 7. TIMEOUT PATTERNS

### Basic Timeout

```typescript
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

// Usage
const data = await withTimeout(
  fetchData(),
  5000,
  'Data fetch timed out after 5 seconds'
);
```

### AbortController Pattern

```typescript
async function fetchWithAbort(
  url: string,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### Cancellable Operations

```typescript
interface CancellableOperation<T> {
  promise: Promise<T>;
  cancel: () => void;
}

function makeCancellable<T>(promise: Promise<T>): CancellableOperation<T> {
  let isCancelled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then((result) => {
        if (!isCancelled) {
          resolve(result);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          reject(error);
        }
      });
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCancelled = true;
    },
  };
}

// Usage
const operation = makeCancellable(longRunningTask());

// Later, if needed:
operation.cancel();
```

---

<!-- /ANCHOR:timeout-patterns -->
<!-- ANCHOR:stream-processing -->
## 8. STREAM PROCESSING

### Readable Stream Patterns

```typescript
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

async function processStream(stream: Readable): Promise<void> {
  for await (const chunk of stream) {
    await processChunk(chunk);
  }
}

// With backpressure handling
async function processWithBackpressure(
  source: Readable,
  processor: (chunk: Buffer) => Promise<void>
): Promise<void> {
  for await (const chunk of source) {
    await processor(chunk);
  }
}
```

### Transform Stream

```typescript
import { Transform, TransformCallback } from 'stream';

class JsonLineTransform extends Transform {
  private buffer = '';

  _transform(
    chunk: Buffer,
    _encoding: string,
    callback: TransformCallback
  ): void {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          this.push(JSON.parse(line));
        } catch (error) {
          callback(error as Error);
          return;
        }
      }
    }

    callback();
  }

  _flush(callback: TransformCallback): void {
    if (this.buffer.trim()) {
      try {
        this.push(JSON.parse(this.buffer));
      } catch (error) {
        callback(error as Error);
        return;
      }
    }
    callback();
  }
}
```

### Pipeline Pattern

```typescript
import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';

async function compressFile(input: string, output: string): Promise<void> {
  await pipeline(
    createReadStream(input),
    createGzip(),
    createWriteStream(output)
  );
}

// With transform
async function processAndSave(
  inputPath: string,
  outputPath: string
): Promise<void> {
  await pipeline(
    createReadStream(inputPath),
    new JsonLineTransform(),
    new Transform({
      objectMode: true,
      transform(data, _encoding, callback) {
        const processed = processData(data);
        callback(null, JSON.stringify(processed) + '\n');
      },
    }),
    createWriteStream(outputPath)
  );
}
```

### Async Iteration

```typescript
async function* generateBatches<T>(
  items: T[],
  batchSize: number
): AsyncGenerator<T[]> {
  for (let i = 0; i < items.length; i += batchSize) {
    yield items.slice(i, i + batchSize);
  }
}

async function processBatches<T>(
  items: T[],
  processor: (batch: T[]) => Promise<void>,
  batchSize: number
): Promise<void> {
  for await (const batch of generateBatches(items, batchSize)) {
    await processor(batch);
  }
}

// Database cursor iteration
async function* iterateCursor<T>(
  query: () => Promise<{ data: T[]; cursor: string | null }>
): AsyncGenerator<T> {
  let cursor: string | null = null;

  do {
    const result = await query();
    for (const item of result.data) {
      yield item;
    }
    cursor = result.cursor;
  } while (cursor);
}
```

---

<!-- /ANCHOR:stream-processing -->
<!-- ANCHOR:event-emitter-patterns -->
## 9. EVENT EMITTER PATTERNS

### Typed Event Emitter

```typescript
import { EventEmitter } from 'events';

interface OrderEvents {
  created: (order: Order) => void;
  updated: (order: Order, changes: Partial<Order>) => void;
  completed: (order: Order) => void;
  cancelled: (order: Order, reason: string) => void;
}

class TypedEventEmitter<T extends Record<string, (...args: unknown[]) => void>> {
  private emitter = new EventEmitter();

  on<K extends keyof T>(event: K, listener: T[K]): void {
    this.emitter.on(event as string, listener);
  }

  off<K extends keyof T>(event: K, listener: T[K]): void {
    this.emitter.off(event as string, listener);
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): boolean {
    return this.emitter.emit(event as string, ...args);
  }

  once<K extends keyof T>(event: K, listener: T[K]): void {
    this.emitter.once(event as string, listener);
  }
}

const orderEmitter = new TypedEventEmitter<OrderEvents>();

// Usage
orderEmitter.on('created', (order) => {
  log.info({ orderId: order.id }, 'Order created');
});
```

### Promisified Event Handling

```typescript
import { once } from 'events';

async function waitForEvent<T>(
  emitter: EventEmitter,
  event: string,
  timeoutMs?: number
): Promise<T> {
  if (timeoutMs) {
    return Promise.race([
      once(emitter, event).then(([data]) => data as T),
      delay(timeoutMs).then(() => {
        throw new Error(`Timeout waiting for event: ${event}`);
      }),
    ]);
  }

  const [data] = await once(emitter, event);
  return data as T;
}

// Usage
const result = await waitForEvent<ProcessResult>(
  processor,
  'complete',
  30000
);
```

### Event-Driven Async Queue

```typescript
import { EventEmitter } from 'events';

interface QueueEvents<T> {
  enqueue: (item: T) => void;
  dequeue: (item: T) => void;
  empty: () => void;
  error: (error: Error, item: T) => void;
}

class AsyncQueue<T> extends EventEmitter {
  private queue: T[] = [];
  private processing = false;
  private concurrency: number;
  private activeCount = 0;

  constructor(
    private processor: (item: T) => Promise<void>,
    concurrency = 1
  ) {
    super();
    this.concurrency = concurrency;
  }

  enqueue(item: T): void {
    this.queue.push(item);
    this.emit('enqueue', item);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0 && this.activeCount < this.concurrency) {
      const item = this.queue.shift()!;
      this.activeCount++;
      this.emit('dequeue', item);

      this.processItem(item).finally(() => {
        this.activeCount--;
        if (this.queue.length === 0 && this.activeCount === 0) {
          this.emit('empty');
        }
        this.process();
      });
    }

    this.processing = false;
  }

  private async processItem(item: T): Promise<void> {
    try {
      await this.processor(item);
    } catch (error) {
      this.emit('error', error, item);
    }
  }

  async drain(): Promise<void> {
    if (this.queue.length === 0 && this.activeCount === 0) {
      return;
    }
    return new Promise((resolve) => this.once('empty', resolve));
  }
}
```

---

<!-- /ANCHOR:event-emitter-patterns -->
<!-- ANCHOR:resource-management -->
## 10. RESOURCE MANAGEMENT

### Cleanup Patterns

```typescript
async function withResource<T, R>(
  acquire: () => Promise<T>,
  release: (resource: T) => Promise<void>,
  use: (resource: T) => Promise<R>
): Promise<R> {
  const resource = await acquire();
  try {
    return await use(resource);
  } finally {
    await release(resource);
  }
}

// Usage with database connection
const result = await withResource(
  () => pool.acquire(),
  (conn) => pool.release(conn),
  async (conn) => {
    return conn.query('SELECT * FROM users');
  }
);
```

### Connection Pool Pattern

```typescript
class ConnectionPool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();
  private waiting: Array<(conn: T) => void> = [];

  constructor(
    private factory: () => Promise<T>,
    private destroyer: (conn: T) => Promise<void>,
    private maxSize: number
  ) {}

  async acquire(): Promise<T> {
    // Return available connection
    if (this.available.length > 0) {
      const conn = this.available.pop()!;
      this.inUse.add(conn);
      return conn;
    }

    // Create new connection if under limit
    if (this.inUse.size < this.maxSize) {
      const conn = await this.factory();
      this.inUse.add(conn);
      return conn;
    }

    // Wait for available connection
    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(conn: T): void {
    this.inUse.delete(conn);

    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      this.inUse.add(conn);
      resolve(conn);
    } else {
      this.available.push(conn);
    }
  }

  async destroy(): Promise<void> {
    for (const conn of [...this.available, ...this.inUse]) {
      await this.destroyer(conn);
    }
    this.available = [];
    this.inUse.clear();
  }
}
```

### Semaphore Pattern

```typescript
class Semaphore {
  private permits: number;
  private waiting: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      resolve();
    } else {
      this.permits++;
    }
  }

  async withPermit<T>(operation: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await operation();
    } finally {
      this.release();
    }
  }
}

// Usage
const dbSemaphore = new Semaphore(10);

async function queryDatabase(): Promise<Data> {
  return dbSemaphore.withPermit(() => db.query('...'));
}
```

---

<!-- /ANCHOR:resource-management -->
<!-- ANCHOR:common-anti-patterns -->
## 11. COMMON ANTI-PATTERNS

### Avoid These Patterns

**Floating Promises (missing await):**

```typescript
// BAD - Promise not awaited
async function badExample(): Promise<void> {
  saveToDatabase(data); // Missing await!
  console.log('Done'); // Runs before save completes
}

// GOOD
async function goodExample(): Promise<void> {
  await saveToDatabase(data);
  console.log('Done');
}
```

**Sequential when Parallel is Possible:**

```typescript
// BAD - Unnecessary sequential execution
async function fetchSequential(): Promise<Data> {
  const users = await fetchUsers();
  const orders = await fetchOrders(); // Doesn't depend on users!
  return { users, orders };
}

// GOOD - Parallel execution
async function fetchParallel(): Promise<Data> {
  const [users, orders] = await Promise.all([
    fetchUsers(),
    fetchOrders(),
  ]);
  return { users, orders };
}
```

**Swallowing Errors:**

```typescript
// BAD - Error swallowed silently
async function badErrorHandling(): Promise<User | null> {
  try {
    return await fetchUser();
  } catch {
    return null; // Error lost!
  }
}

// GOOD - Error logged and handled appropriately
async function goodErrorHandling(): Promise<User | null> {
  try {
    return await fetchUser();
  } catch (error) {
    log.error({ err: error }, 'Failed to fetch user');
    return null;
  }
}
```

**Unnecessary async:**

```typescript
// BAD - async not needed
async function unnecessaryAsync(): Promise<number> {
  return 42;
}

// GOOD - Direct return
function directReturn(): Promise<number> {
  return Promise.resolve(42);
}

// GOOD - async needed for await
async function needsAsync(): Promise<number> {
  const value = await fetchValue();
  return value * 2;
}
```

---

<!-- /ANCHOR:common-anti-patterns -->
<!-- ANCHOR:rules -->
## 12. RULES

### ✅ ALWAYS

1. **Await all promises** - No floating promises
2. **Handle errors** - Try/catch or .catch() for every async operation
3. **Use Promise.all for independent operations** - Maximize parallelism
4. **Use Promise.allSettled when failures are acceptable** - Independent results
5. **Implement timeouts for external calls** - Prevent hanging operations
6. **Log async errors with context** - Include operation details
7. **Clean up resources in finally** - Prevent leaks
8. **Use async iterators for large datasets** - Memory efficiency
9. **Implement retry with backoff** - For transient failures
10. **Type async function returns** - Explicit Promise<T> types
11. **Cancel ongoing operations on shutdown** - Use AbortController
12. **Limit concurrency** - Prevent resource exhaustion

### ❌ NEVER

1. **Ignore promise rejections** - Always handle errors
2. **Use `.then()/.catch()` in async functions** - Use await instead
3. **Mix callbacks and promises** - Promisify callbacks
4. **Create promises in loops without control** - Use batching
5. **Use `async void`** - Always return Promise
6. **Catch and re-throw without context** - Add error information
7. **Use `Promise.race` without timeout cleanup** - Clear timers
8. **Block event loop with sync operations** - Use async alternatives
9. **Nest promises unnecessarily** - Flatten with await
10. **Forget cleanup in finally** - Resources must be released
11. **Use `new Promise` for simple transforms** - Use .then() chains
12. **Return inside finally** - Can swallow errors

### ⚠️ ESCALATE IF

1. **Deadlock suspected** - Circular await dependencies
2. **Memory growing** - Possible promise accumulation
3. **Unhandled rejection warnings** - Missing error handling
4. **Performance degradation** - Run `sk-code-review` baseline with performance focus
5. **Timeout values uncertain** - Business decision required
6. **Retry strategy needed** - Error categorization required

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

| File                                         | Purpose                                    |
| -------------------------------------------- | ------------------------------------------ |
| [nodejs_standards.md](./nodejs_standards.md) | Project structure and logging              |
| [express_patterns.md](./express_patterns.md) | Async middleware and error handling        |
| [testing_strategy.md](./testing_strategy.md) | Testing async code with Jest               |
<!-- /ANCHOR:related-resources -->
