/* ─────────────────────────────────────────────────────────────
   SERVICE PATTERNS
   Generic Service Implementation for Node.js/TypeScript
──────────────────────────────────────────────────────────────── */
// PURPOSE: Reusable service layer patterns for backend applications
// PATTERNS: Repository, Unit of Work, CQRS basics, Dependency Injection
// COMPATIBLE WITH: Prisma, TypeORM, Drizzle, or any data layer

/* ─────────────────────────────────────────────────────────────
   1. TYPE DEFINITIONS & INTERFACES
──────────────────────────────────────────────────────────────── */

/**
 * Base entity interface - all entities must have an ID and timestamps.
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination parameters for list operations.
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper.
 * @template T - The entity type being paginated
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Filter options for queries.
 * @template T - The entity type to filter
 */
export type FilterOptions<T> = Partial<{
  [K in keyof T]: T[K] | { in: T[K][] } | { contains: string } | { gte: T[K] } | { lte: T[K] };
}>;

/**
 * Service result wrapper for operations that can fail.
 * @template T - Success result type
 * @template E - Error type (defaults to Error)
 */
export type ServiceResult<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Async service result type alias.
 */
export type AsyncServiceResult<T, E = Error> = Promise<ServiceResult<T, E>>;

/* ─────────────────────────────────────────────────────────────
   2. REPOSITORY PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * Generic repository interface defining standard data access operations.
 * Implement this interface for each entity type.
 *
 * @template T - Entity type
 * @template CreateInput - Input type for create operations
 * @template UpdateInput - Input type for update operations
 *
 * @example
 * ```typescript
 * interface UserRepository extends IRepository<User, CreateUserDTO, UpdateUserDTO> {
 *   findByEmail(email: string): Promise<User | null>;
 * }
 * ```
 */
export interface IRepository<T extends BaseEntity, CreateInput, UpdateInput> {
  /**
   * Create a new entity.
   * @param data - The data to create the entity with
   * @returns The created entity
   */
  create(data: CreateInput): Promise<T>;

  /**
   * Find an entity by its ID.
   * @param id - The entity ID
   * @returns The entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities matching the filter criteria.
   * @param filter - Optional filter criteria
   * @returns Array of matching entities
   */
  findAll(filter?: FilterOptions<T>): Promise<T[]>;

  /**
   * Find entities with pagination.
   * @param params - Pagination parameters
   * @param filter - Optional filter criteria
   * @returns Paginated result
   */
  findPaginated(params: PaginationParams, filter?: FilterOptions<T>): Promise<PaginatedResult<T>>;

  /**
   * Update an existing entity.
   * @param id - The entity ID
   * @param data - The data to update
   * @returns The updated entity
   */
  update(id: string, data: UpdateInput): Promise<T>;

  /**
   * Delete an entity by ID.
   * @param id - The entity ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if an entity exists.
   * @param id - The entity ID
   * @returns True if entity exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Count entities matching the filter.
   * @param filter - Optional filter criteria
   * @returns Count of matching entities
   */
  count(filter?: FilterOptions<T>): Promise<number>;
}

/* ─────────────────────────────────────────────────────────────
   3. BASE REPOSITORY IMPLEMENTATION (PRISMA)
──────────────────────────────────────────────────────────────── */

import { PrismaClient } from '@prisma/client';

/**
 * Abstract base repository implementation using Prisma.
 * Extend this class for each entity-specific repository.
 *
 * @template T - Entity type
 * @template CreateInput - Create DTO type
 * @template UpdateInput - Update DTO type
 *
 * @example
 * ```typescript
 * class UserRepository extends BaseRepository<User, CreateUserDTO, UpdateUserDTO> {
 *   constructor(prisma: PrismaClient) {
 *     super(prisma, 'user');
 *   }
 *
 *   async findByEmail(email: string): Promise<User | null> {
 *     return this.prisma.user.findUnique({ where: { email } });
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<T extends BaseEntity, CreateInput, UpdateInput>
  implements IRepository<T, CreateInput, UpdateInput>
{
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly modelName: string
  ) {}

  /**
   * Get the Prisma delegate for this model.
   * Uses dynamic access - ensure modelName matches Prisma schema.
   */
  protected get model(): any {
    return (this.prisma as any)[this.modelName];
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data }) as Promise<T>;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } }) as Promise<T | null>;
  }

  async findAll(filter?: FilterOptions<T>): Promise<T[]> {
    return this.model.findMany({
      where: filter ? this.buildWhereClause(filter) : undefined,
    }) as Promise<T[]>;
  }

  async findPaginated(
    params: PaginationParams,
    filter?: FilterOptions<T>
  ): Promise<PaginatedResult<T>> {
    const { page, limit, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: filter ? this.buildWhereClause(filter) : undefined,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder || 'asc' } : undefined,
      }),
      this.model.count({
        where: filter ? this.buildWhereClause(filter) : undefined,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    }) as Promise<T>;
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }

  async count(filter?: FilterOptions<T>): Promise<number> {
    return this.model.count({
      where: filter ? this.buildWhereClause(filter) : undefined,
    });
  }

  /**
   * Build Prisma where clause from filter options.
   * Override in subclass for custom filter handling.
   */
  protected buildWhereClause(filter: FilterOptions<T>): Record<string, unknown> {
    const where: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filter)) {
      if (value === undefined) continue;

      if (typeof value === 'object' && value !== null) {
        // Handle special operators
        if ('in' in value) {
          where[key] = { in: value.in };
        } else if ('contains' in value) {
          where[key] = { contains: value.contains, mode: 'insensitive' };
        } else if ('gte' in value || 'lte' in value) {
          where[key] = value;
        }
      } else {
        where[key] = value;
      }
    }

    return where;
  }
}

/* ─────────────────────────────────────────────────────────────
   4. GENERIC SERVICE CLASS
──────────────────────────────────────────────────────────────── */

/**
 * Service operation context for tracking and logging.
 */
export interface ServiceContext {
  requestId?: string;
  userId?: string;
  correlationId?: string;
  timestamp?: Date;
}

/**
 * Service error types for categorizing failures.
 */
export enum ServiceErrorType {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  CONFLICT = 'CONFLICT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL = 'INTERNAL',
}

/**
 * Structured service error with type and optional details.
 */
export class ServiceError extends Error {
  constructor(
    public readonly type: ServiceErrorType,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ServiceError';
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(entity: string, id?: string): ServiceError {
    return new ServiceError(
      ServiceErrorType.NOT_FOUND,
      id ? `${entity} with ID '${id}' not found` : `${entity} not found`,
      { entity, id }
    );
  }

  static validation(message: string, details?: Record<string, unknown>): ServiceError {
    return new ServiceError(ServiceErrorType.VALIDATION, message, details);
  }

  static conflict(message: string, details?: Record<string, unknown>): ServiceError {
    return new ServiceError(ServiceErrorType.CONFLICT, message, details);
  }

  static unauthorized(message = 'Unauthorized'): ServiceError {
    return new ServiceError(ServiceErrorType.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden'): ServiceError {
    return new ServiceError(ServiceErrorType.FORBIDDEN, message);
  }

  static internal(message: string, details?: Record<string, unknown>): ServiceError {
    return new ServiceError(ServiceErrorType.INTERNAL, message, details);
  }
}

/**
 * Abstract base service providing common CRUD operations with error handling.
 *
 * @template T - Entity type
 * @template CreateInput - Create DTO type
 * @template UpdateInput - Update DTO type
 *
 * @example
 * ```typescript
 * class UserService extends BaseService<User, CreateUserDTO, UpdateUserDTO> {
 *   constructor(
 *     private readonly userRepository: UserRepository,
 *     private readonly eventEmitter: EventEmitter
 *   ) {
 *     super(userRepository, 'User');
 *   }
 *
 *   protected async afterCreate(entity: User, context?: ServiceContext): Promise<void> {
 *     this.eventEmitter.emit('user.created', { user: entity, context });
 *   }
 * }
 * ```
 */
export abstract class BaseService<T extends BaseEntity, CreateInput, UpdateInput> {
  constructor(
    protected readonly repository: IRepository<T, CreateInput, UpdateInput>,
    protected readonly entityName: string
  ) {}

  /**
   * Create a new entity with lifecycle hooks.
   */
  async create(data: CreateInput, context?: ServiceContext): AsyncServiceResult<T, ServiceError> {
    try {
      await this.beforeCreate(data, context);
      const entity = await this.repository.create(data);
      await this.afterCreate(entity, context);
      return { success: true, data: entity };
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }

  /**
   * Find entity by ID, returning error if not found.
   */
  async findById(id: string, context?: ServiceContext): AsyncServiceResult<T, ServiceError> {
    try {
      const entity = await this.repository.findById(id);
      if (!entity) {
        return { success: false, error: ServiceError.notFound(this.entityName, id) };
      }
      return { success: true, data: entity };
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }

  /**
   * Find entity by ID, throwing if not found.
   * Use when you need to guarantee entity exists.
   */
  async findByIdOrThrow(id: string): Promise<T> {
    const result = await this.findById(id);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  /**
   * Find all entities with optional filtering.
   */
  async findAll(filter?: FilterOptions<T>): AsyncServiceResult<T[], ServiceError> {
    try {
      const entities = await this.repository.findAll(filter);
      return { success: true, data: entities };
    } catch (error) {
      return this.handleError(error, 'findAll');
    }
  }

  /**
   * Find entities with pagination.
   */
  async findPaginated(
    params: PaginationParams,
    filter?: FilterOptions<T>
  ): AsyncServiceResult<PaginatedResult<T>, ServiceError> {
    try {
      const result = await this.repository.findPaginated(params, filter);
      return { success: true, data: result };
    } catch (error) {
      return this.handleError(error, 'findPaginated');
    }
  }

  /**
   * Update entity by ID with lifecycle hooks.
   */
  async update(
    id: string,
    data: UpdateInput,
    context?: ServiceContext
  ): AsyncServiceResult<T, ServiceError> {
    try {
      const exists = await this.repository.exists(id);
      if (!exists) {
        return { success: false, error: ServiceError.notFound(this.entityName, id) };
      }

      await this.beforeUpdate(id, data, context);
      const entity = await this.repository.update(id, data);
      await this.afterUpdate(entity, context);
      return { success: true, data: entity };
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }

  /**
   * Delete entity by ID with lifecycle hooks.
   */
  async delete(id: string, context?: ServiceContext): AsyncServiceResult<void, ServiceError> {
    try {
      const exists = await this.repository.exists(id);
      if (!exists) {
        return { success: false, error: ServiceError.notFound(this.entityName, id) };
      }

      await this.beforeDelete(id, context);
      await this.repository.delete(id);
      await this.afterDelete(id, context);
      return { success: true, data: undefined };
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }

  /* ───────────────────────────────────────────────────────────
     Lifecycle Hooks (Override in subclass)
  ──────────────────────────────────────────────────────────── */

  /** Called before creating an entity. Use for validation or transformation. */
  protected async beforeCreate(data: CreateInput, context?: ServiceContext): Promise<void> {}

  /** Called after creating an entity. Use for side effects like events. */
  protected async afterCreate(entity: T, context?: ServiceContext): Promise<void> {}

  /** Called before updating an entity. */
  protected async beforeUpdate(
    id: string,
    data: UpdateInput,
    context?: ServiceContext
  ): Promise<void> {}

  /** Called after updating an entity. */
  protected async afterUpdate(entity: T, context?: ServiceContext): Promise<void> {}

  /** Called before deleting an entity. */
  protected async beforeDelete(id: string, context?: ServiceContext): Promise<void> {}

  /** Called after deleting an entity. */
  protected async afterDelete(id: string, context?: ServiceContext): Promise<void> {}

  /* ───────────────────────────────────────────────────────────
     Error Handling
  ──────────────────────────────────────────────────────────── */

  /**
   * Handle and transform errors into ServiceError.
   * Override to add custom error handling.
   */
  protected handleError(error: unknown, operation: string): ServiceResult<never, ServiceError> {
    if (error instanceof ServiceError) {
      return { success: false, error };
    }

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return {
      success: false,
      error: ServiceError.internal(`${this.entityName} ${operation} failed: ${message}`, {
        operation,
        originalError: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TRANSACTION SUPPORT
──────────────────────────────────────────────────────────────── */

/**
 * Unit of Work interface for managing transactions.
 * Coordinates multiple repository operations in a single transaction.
 */
export interface IUnitOfWork {
  /**
   * Execute operations within a transaction.
   * @param work - Async function containing transactional operations
   * @returns Result of the work function
   */
  transaction<T>(work: (tx: unknown) => Promise<T>): Promise<T>;
}

/**
 * Prisma Unit of Work implementation.
 *
 * @example
 * ```typescript
 * const unitOfWork = new PrismaUnitOfWork(prisma);
 *
 * await unitOfWork.transaction(async (tx) => {
 *   const user = await tx.user.create({ data: userData });
 *   await tx.profile.create({ data: { ...profileData, userId: user.id } });
 *   return user;
 * });
 * ```
 */
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async transaction<T>(work: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return work(tx as PrismaClient);
    });
  }
}

/**
 * Transaction-aware service that can operate within a unit of work.
 *
 * @example
 * ```typescript
 * class OrderService extends TransactionalService<Order, CreateOrderDTO, UpdateOrderDTO> {
 *   async createWithItems(
 *     orderData: CreateOrderDTO,
 *     items: CreateOrderItemDTO[]
 *   ): AsyncServiceResult<Order, ServiceError> {
 *     return this.unitOfWork.transaction(async (tx) => {
 *       const order = await this.repositoryFactory(tx).create(orderData);
 *       const itemRepo = this.itemRepositoryFactory(tx);
 *
 *       for (const item of items) {
 *         await itemRepo.create({ ...item, orderId: order.id });
 *       }
 *
 *       return order;
 *     });
 *   }
 * }
 * ```
 */
export abstract class TransactionalService<
  T extends BaseEntity,
  CreateInput,
  UpdateInput,
> extends BaseService<T, CreateInput, UpdateInput> {
  constructor(
    repository: IRepository<T, CreateInput, UpdateInput>,
    entityName: string,
    protected readonly unitOfWork: IUnitOfWork
  ) {
    super(repository, entityName);
  }

  /**
   * Execute service operation within a transaction.
   */
  protected async withTransaction<R>(
    work: (tx: unknown) => Promise<R>
  ): Promise<ServiceResult<R, ServiceError>> {
    try {
      const result = await this.unitOfWork.transaction(work);
      return { success: true, data: result };
    } catch (error) {
      return this.handleError(error, 'transaction');
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   6. DEPENDENCY INJECTION CONTAINER
──────────────────────────────────────────────────────────────── */

/**
 * Service registration token type.
 */
export type ServiceToken<T> = symbol & { __type?: T };

/**
 * Create a typed service token.
 */
export function createToken<T>(name: string): ServiceToken<T> {
  return Symbol(name) as ServiceToken<T>;
}

/**
 * Service factory function type.
 */
export type ServiceFactory<T> = (container: Container) => T;

/**
 * Service lifecycle enum.
 */
export enum Lifecycle {
  /** New instance every time */
  TRANSIENT = 'transient',
  /** Single instance for container lifetime */
  SINGLETON = 'singleton',
  /** Single instance per request scope */
  SCOPED = 'scoped',
}

/**
 * Simple dependency injection container.
 * For production use, consider tsyringe, InversifyJS, or similar.
 *
 * @example
 * ```typescript
 * // Define tokens
 * const TOKENS = {
 *   PrismaClient: createToken<PrismaClient>('PrismaClient'),
 *   UserRepository: createToken<UserRepository>('UserRepository'),
 *   UserService: createToken<UserService>('UserService'),
 * };
 *
 * // Configure container
 * const container = new Container();
 * container.registerSingleton(TOKENS.PrismaClient, () => new PrismaClient());
 * container.register(TOKENS.UserRepository, (c) => new UserRepository(c.resolve(TOKENS.PrismaClient)));
 * container.register(TOKENS.UserService, (c) => new UserService(c.resolve(TOKENS.UserRepository)));
 *
 * // Resolve services
 * const userService = container.resolve(TOKENS.UserService);
 * ```
 */
export class Container {
  private factories = new Map<symbol, { factory: ServiceFactory<unknown>; lifecycle: Lifecycle }>();
  private singletons = new Map<symbol, unknown>();
  private scopedInstances = new Map<symbol, unknown>();
  private parent?: Container;

  /**
   * Register a transient service (new instance each time).
   */
  register<T>(token: ServiceToken<T>, factory: ServiceFactory<T>): this {
    this.factories.set(token, { factory, lifecycle: Lifecycle.TRANSIENT });
    return this;
  }

  /**
   * Register a singleton service (one instance for container lifetime).
   */
  registerSingleton<T>(token: ServiceToken<T>, factory: ServiceFactory<T>): this {
    this.factories.set(token, { factory, lifecycle: Lifecycle.SINGLETON });
    return this;
  }

  /**
   * Register a scoped service (one instance per scope).
   */
  registerScoped<T>(token: ServiceToken<T>, factory: ServiceFactory<T>): this {
    this.factories.set(token, { factory, lifecycle: Lifecycle.SCOPED });
    return this;
  }

  /**
   * Register an existing instance as singleton.
   */
  registerInstance<T>(token: ServiceToken<T>, instance: T): this {
    this.singletons.set(token, instance);
    this.factories.set(token, { factory: () => instance, lifecycle: Lifecycle.SINGLETON });
    return this;
  }

  /**
   * Resolve a service by its token.
   */
  resolve<T>(token: ServiceToken<T>): T {
    // Check singleton cache
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }

    // Check scoped cache
    if (this.scopedInstances.has(token)) {
      return this.scopedInstances.get(token) as T;
    }

    // Get factory
    const registration = this.factories.get(token) ?? this.parent?.factories.get(token);
    if (!registration) {
      throw new Error(`Service not registered: ${String(token)}`);
    }

    const { factory, lifecycle } = registration;
    const instance = factory(this) as T;

    // Cache based on lifecycle
    switch (lifecycle) {
      case Lifecycle.SINGLETON:
        this.singletons.set(token, instance);
        break;
      case Lifecycle.SCOPED:
        this.scopedInstances.set(token, instance);
        break;
    }

    return instance;
  }

  /**
   * Create a child container (scoped container).
   * Scoped instances are isolated to the child.
   */
  createScope(): Container {
    const child = new Container();
    child.parent = this;
    child.factories = this.factories;
    child.singletons = this.singletons;
    return child;
  }

  /**
   * Clear scoped instances (call at end of request).
   */
  clearScope(): void {
    this.scopedInstances.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
   7. CQRS PATTERN (BASIC)
──────────────────────────────────────────────────────────────── */

/**
 * Command interface - represents an intention to change state.
 */
export interface ICommand {
  readonly type: string;
}

/**
 * Query interface - represents a request for data.
 */
export interface IQuery<TResult> {
  readonly type: string;
}

/**
 * Command handler interface.
 */
export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
  execute(command: TCommand): Promise<TResult>;
}

/**
 * Query handler interface.
 */
export interface IQueryHandler<TQuery extends IQuery<TResult>, TResult> {
  execute(query: TQuery): Promise<TResult>;
}

/**
 * Simple command/query bus for CQRS pattern.
 *
 * @example
 * ```typescript
 * // Define command
 * class CreateUserCommand implements ICommand {
 *   readonly type = 'CreateUser';
 *   constructor(public readonly data: CreateUserDTO) {}
 * }
 *
 * // Define handler
 * class CreateUserHandler implements ICommandHandler<CreateUserCommand, User> {
 *   constructor(private userService: UserService) {}
 *
 *   async execute(command: CreateUserCommand): Promise<User> {
 *     const result = await this.userService.create(command.data);
 *     if (!result.success) throw result.error;
 *     return result.data;
 *   }
 * }
 *
 * // Register and execute
 * bus.registerCommand('CreateUser', new CreateUserHandler(userService));
 * const user = await bus.executeCommand(new CreateUserCommand({ name: 'John' }));
 * ```
 */
export class CommandQueryBus {
  private commandHandlers = new Map<string, ICommandHandler<ICommand, unknown>>();
  private queryHandlers = new Map<string, IQueryHandler<IQuery<unknown>, unknown>>();

  registerCommand<TCommand extends ICommand, TResult>(
    type: string,
    handler: ICommandHandler<TCommand, TResult>
  ): this {
    this.commandHandlers.set(type, handler as ICommandHandler<ICommand, unknown>);
    return this;
  }

  registerQuery<TQuery extends IQuery<TResult>, TResult>(
    type: string,
    handler: IQueryHandler<TQuery, TResult>
  ): this {
    this.queryHandlers.set(type, handler as IQueryHandler<IQuery<unknown>, unknown>);
    return this;
  }

  async executeCommand<TResult>(command: ICommand): Promise<TResult> {
    const handler = this.commandHandlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.type}`);
    }
    return handler.execute(command) as Promise<TResult>;
  }

  async executeQuery<TResult>(query: IQuery<TResult>): Promise<TResult> {
    const handler = this.queryHandlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler registered for query: ${query.type}`);
    }
    return handler.execute(query) as Promise<TResult>;
  }
}

/* ─────────────────────────────────────────────────────────────
   8. EVENT-DRIVEN PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Domain event interface.
 */
export interface IDomainEvent {
  readonly type: string;
  readonly occurredAt: Date;
  readonly aggregateId?: string;
}

/**
 * Domain event handler interface.
 */
export interface IDomainEventHandler<TEvent extends IDomainEvent> {
  handle(event: TEvent): Promise<void>;
}

/**
 * Simple in-memory event dispatcher.
 * For production, consider using a message broker (Redis, RabbitMQ, etc.).
 *
 * @example
 * ```typescript
 * // Define event
 * class UserCreatedEvent implements IDomainEvent {
 *   readonly type = 'UserCreated';
 *   readonly occurredAt = new Date();
 *   constructor(public readonly aggregateId: string, public readonly user: User) {}
 * }
 *
 * // Define handler
 * class SendWelcomeEmailHandler implements IDomainEventHandler<UserCreatedEvent> {
 *   async handle(event: UserCreatedEvent): Promise<void> {
 *     await this.emailService.sendWelcome(event.user.email);
 *   }
 * }
 *
 * // Register and dispatch
 * dispatcher.register('UserCreated', new SendWelcomeEmailHandler());
 * await dispatcher.dispatch(new UserCreatedEvent(user.id, user));
 * ```
 */
export class EventDispatcher {
  private handlers = new Map<string, IDomainEventHandler<IDomainEvent>[]>();

  register<TEvent extends IDomainEvent>(
    eventType: string,
    handler: IDomainEventHandler<TEvent>
  ): this {
    const existing = this.handlers.get(eventType) ?? [];
    existing.push(handler as IDomainEventHandler<IDomainEvent>);
    this.handlers.set(eventType, existing);
    return this;
  }

  async dispatch(event: IDomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) ?? [];
    await Promise.all(handlers.map((handler) => handler.handle(event)));
  }

  async dispatchAll(events: IDomainEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.dispatch(event)));
  }
}

/**
 * Aggregate root with domain event collection.
 * Base class for domain-driven design aggregates.
 */
export abstract class AggregateRoot<TId = string> {
  private _domainEvents: IDomainEvent[] = [];

  constructor(public readonly id: TId) {}

  get domainEvents(): readonly IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}

/* ─────────────────────────────────────────────────────────────
   9. COMPLETE EXAMPLE - USER SERVICE
──────────────────────────────────────────────────────────────── */

/**
 * Example: Complete user service implementation demonstrating all patterns.
 */

// Types
interface User extends BaseEntity {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface CreateUserDTO {
  email: string;
  name: string;
  role?: 'admin' | 'user';
}

interface UpdateUserDTO {
  name?: string;
  role?: 'admin' | 'user';
}

// Events
class UserCreatedEvent implements IDomainEvent {
  readonly type = 'UserCreated';
  readonly occurredAt = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly user: User
  ) {}
}

// Repository
class UserRepository extends BaseRepository<User, CreateUserDTO, UpdateUserDTO> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({ where: { email } }) as Promise<User | null>;
  }
}

// Service
class UserService extends BaseService<User, CreateUserDTO, UpdateUserDTO> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventDispatcher: EventDispatcher
  ) {
    super(userRepository, 'User');
  }

  async findByEmail(email: string): AsyncServiceResult<User, ServiceError> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return { success: false, error: ServiceError.notFound('User') };
      }
      return { success: true, data: user };
    } catch (error) {
      return this.handleError(error, 'findByEmail');
    }
  }

  protected async beforeCreate(data: CreateUserDTO): Promise<void> {
    // Check for duplicate email
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw ServiceError.conflict(`User with email '${data.email}' already exists`);
    }
  }

  protected async afterCreate(entity: User): Promise<void> {
    // Dispatch domain event
    await this.eventDispatcher.dispatch(new UserCreatedEvent(entity.id, entity));
  }
}

/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Example implementations (for reference)
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserCreatedEvent,
  UserRepository,
  UserService,
};
