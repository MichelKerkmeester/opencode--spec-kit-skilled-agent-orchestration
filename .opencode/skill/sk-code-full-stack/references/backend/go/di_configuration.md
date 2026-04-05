---
title: Dependency Injection Configuration - DI System Patterns and Debugging
description: DI configuration structure, JSON nesting rules, token-to-key mapping, and debugging configuration errors in backend systems.
---

# Dependency Injection Configuration - DI System Patterns and Debugging

DI configuration structure, JSON nesting rules, token-to-key mapping, and debugging configuration errors in backend systems.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This document explains how the Dependency Injection (DI) configuration system works in backend systems. Understanding these patterns is critical for correctly configuring services and debugging "configuration not found" errors.

### Progressive Disclosure

| If you need to... | Read section... |
|-------------------|-----------------|
| Understand core DI functions | 2 (The Four DI Functions) |
| Understand the golden rule | 3 (Key Principle) |
| Debug a config error | 6 (Debugging) |
| Add new service config | 7 (Practical Guide) |
| Understand nesting | 4 (Configuration Structure) |
| See real examples | 8 (Real-World Examples) |

### File Relationships

```
di_configuration.md (this file)
    |- Bootstrap patterns -> microservice_bootstrap_architecture.md
    |- Injection tokens -> infra/di/injection_tokens.go
    |- Registry functions -> bundles/registry.go, internal/domain/*/registry.go
    +- Config files -> misc/configs/*.json
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:the-four-di-functions -->
## 2. THE FOUR DI FUNCTIONS

The DI system in backend systems uses four core functions from `github.com/pixie-sh/di-go`. Understanding these is **critical** for working with the codebase.

### 2.1 Registration Functions (Called Once at Startup)

**`di.RegisterConfiguration[T]`** - Registers a factory function that knows how to look up configuration of type `T`.

```go
// Signature
di.RegisterConfiguration[*YourConfiguration](lookupFunc, di.WithToken(token))

// Example from internal/domain/payments/registry.go:21
di.RegisterConfiguration[*payments_data_layer.PaymentsDataLayerConfiguration](
    payments_data_layer.RegistryPaymentsDataLayerConfiguration,  // The lookup function
    di.WithToken(coredi.RegistryTokenPaymentsDataLayer),         // Token for identification
)
```

**`di.Register[T]`** - Registers a factory function that knows how to create instances of type `T`.

```go
// Signature
di.Register[*YourType](factoryFunc, di.WithToken(token))

// Example from internal/domain/payments/registry.go:22
di.Register[*payments_data_layer.PaymentsDataLayer](
    payments_data_layer.RegistryPaymentsDataLayer,         // The factory function
    di.WithToken(coredi.RegistryTokenPaymentsDataLayer),   // Same token as config
)
```

### 2.2 Creation Functions (Called at Runtime)

**`di.CreateConfiguration[T]`** - Looks up and returns configuration of type `T` from the JSON config tree.

```go
// Signature
config, err := di.CreateConfiguration[*YourConfiguration](ctx, di.WithOpts(opts))

// Example from payments_business_layer/registry.go:21
config, err := di.CreateConfiguration[*PaymentsBusinessLayerConfiguration](ctx, di.WithOpts(opts))
```

**`di.Create[T]`** - Creates an instance of type `T` by calling the registered factory function.

```go
// Signature
instance, err := di.Create[*YourType](ctx, di.WithOpts(opts), di.WithToken(token))

// Example from payments_business_layer/registry.go:27
paymentsDatalayer, err := di.Create[*payments_data_layer.PaymentsDataLayer](
    ctx,
    di.WithOpts(opts),                                      // Passes parent config context
    di.WithToken(coredi.RegistryTokenPaymentsDataLayer),    // Which registered type to create
)
```

### 2.3 The Registration Pattern

Every injectable type follows this **paired registration pattern**:

```go
// In domain/*/registry.go - Register BOTH config and instance factory
func Registry() {
    once.Do(func() {
        // 1. Register the configuration lookup
        errors.Must(di.RegisterConfiguration[*MyServiceConfiguration](
            RegistryMyServiceConfiguration,           // Function that calls di.ConfigurationLookup
            di.WithToken(RegistryTokenMyService),
        ))

        // 2. Register the instance factory
        errors.Must(di.Register[*MyService](
            RegistryMyService,                        // Function that calls di.Create for deps
            di.WithToken(RegistryTokenMyService),
        ))
    })
}
```

### 2.4 The Factory Function Pattern

Every factory function follows this pattern:

```go
// Configuration lookup function
func RegistryMyServiceConfiguration(ctx di.Context, opts *di.RegistryOpts) (*MyServiceConfiguration, error) {
    return di.ConfigurationLookup[*MyServiceConfiguration](ctx, opts)
}

// Instance creation function
func RegistryMyService(ctx di.Context, opts *di.RegistryOpts) (*MyService, error) {
    // 1. Get own configuration
    config, err := di.CreateConfiguration[*MyServiceConfiguration](ctx, di.WithOpts(opts))
    if err != nil {
        return nil, err
    }

    // 2. Create dependencies (each di.Create looks for nested config)
    dependency, err := di.Create[*SomeDependency](ctx, di.WithOpts(opts), di.WithToken(RegistryTokenSomeDependency))
    if err != nil {
        return nil, err
    }

    // 3. Construct and return instance
    return NewMyService(config, dependency), nil
}
```

### 2.5 Key Insight: Why This Matters for JSON Structure

The **`di.WithOpts(opts)`** parameter is crucial - it passes the configuration context from parent to child. This is how the DI system knows to look for `dependency_service` config **inside** `my_service` config in the JSON.

---

### The Golden Rule

> **JSON configuration nesting follows where `di.Create` calls are made in the registry functions.**

This is the most important concept to understand:

- JSON nesting is determined by **where** the `di.Create` is called
- Each `di.Create` call looks for its configuration within the **parent configuration context**
- Configuration hierarchy mirrors the call stack of `di.Create` invocations

### Why Does This Matter?

When you see an error like:
```
configuration not found for token "notifications_push_service"
Breadcrumbs: [notifications_business_layer notifications_push_service]
```

The breadcrumbs tell you exactly where in the JSON hierarchy the system is looking.

---

<!-- /ANCHOR:the-four-di-functions -->
<!-- ANCHOR:configuration-structure -->
## 4. CONFIGURATION STRUCTURE

### 4.1 How do I map registry tokens to JSON keys?

Registry tokens are defined in `infra/di/injection_tokens.go` and convert directly to JSON keys:

```go
// infra/di/injection_tokens.go
RegistryTokenPaymentsBusinessLayer = pdi.RegisterInjectionToken("payments_business_layer")
RegistryTokenPaymentService        = pdi.RegisterInjectionToken("payment_service")
RegistryTokenOrganizationsBusinessLayer = pdi.RegisterInjectionToken("organizations_business_layer")
RegistryTokenOrganizationLocationsService = pdi.RegisterInjectionToken("organization_locations_service")
```

The **string value** passed to `RegisterInjectionToken()` is the **exact JSON key** used in config files.

| Registry Token | Token Value | JSON Key |
|---------------|-------------|----------|
| `RegistryTokenPaymentsBusinessLayer` | `"payments_business_layer"` | `"payments_business_layer"` |
| `RegistryTokenPaymentService` | `"payment_service"` | `"payment_service"` |
| `RegistryTokenHTTPServerBundle` | `"http_server_bundle"` | `"http_server_bundle"` |
| `RegistryTokenOrganizationsBusinessLayer` | `"organizations_business_layer"` | `"organizations_business_layer"` |
| `RegistryTokenOrganizationLocationsService` | `"organization_locations_service"` | `"organization_locations_service"` |
| `RegistryTokenFeedValidators` | `"feed_validators"` | `"feed_validators"` |

**Token Categories in `injection_tokens.go`:**
- **Global** - Bundles, caches, servers, forwarders
- **Domain-specific** - Data layers, services, business layers per domain
- **Validators** - Validation tokens per domain (payments, vendors, orders, feed, etc.)

### 4.2 Configuration Struct Embedding and LookupNode

**This is critical for understanding how microservice configurations work.**

Microservice configuration structs use **Go struct embedding** to compose configuration. Each embedded struct has a JSON tag that determines where in the JSON tree that config lives.

**Example from ms_payments/microservice.go:**

```go
type PaymentsMicroserviceConfiguration struct {
    // Embedded bundle configurations - these become root-level JSON keys
    bundles.TokenServicesBundleConfiguration         `json:"token_services_bundle"`
    bundles.AuthorizationGatesBundleConfiguration    `json:"authorization_gates_bundle"`
    bundles.MetricsBundleConfiguration               `json:"metrics_bundle"`
    bundles.HttpServerBundleConfigurations           `json:"http_server_bundle"`
    bundles.SQSProducerPoolBundleConfiguration       `json:"sqs_producer_pool_bundle"`

    // Embedded domain configurations - these become root-level JSON keys
    payments_business_layer.PaymentsBusinessLayerConfiguration             `json:"payments_business_layer"`
    payments_business_layer.CouponsBusinessLayerConfiguration              `json:"coupons_business_layer"`
    payments_business_layer.BillableItemsBusinessLayerConfiguration        `json:"billable_items_business_layer"`
    payments_business_layer.PaymentEventsHandlerBusinessLayerConfiguration `json:"payment_events_handler_business_layer"`

    // Direct fields - these are root-level JSON keys
    ListenAddr        string `json:"listen_addr"`
    ListenMetricsAddr string `json:"listen_metrics_addr"`

    // Non-embedded nested configs
    SQSPaymentsConsumerConfiguration sqs.ConsumerConfiguration `json:"sqs_payments_consumer"`
}

// LookupNode enables the DI system to traverse the config tree
func (p *PaymentsMicroserviceConfiguration) LookupNode(lookupPath string) (any, error) {
    return di.ConfigurationNodeLookup(p, lookupPath)
}
```

**The `LookupNode` method is essential** - it implements the `di.Configuration` interface, allowing the DI system to navigate into embedded structs to find nested configurations.

### 4.3 How Embedding Maps to JSON

The JSON tag on embedded structs determines the top-level key:

```go
// Go struct embedding:
type PaymentsMicroserviceConfiguration struct {
    payments_business_layer.PaymentsBusinessLayerConfiguration `json:"payments_business_layer"`
}

// Results in JSON structure:
{
    "payments_business_layer": {
        // Contents of PaymentsBusinessLayerConfiguration go here
    }
}
```

### 4.4 How Nesting Works Within Business Layers

When a business layer's registry function calls `di.Create`, the DI system looks for that dependency's config **inside** the current config context.

**Code (payments_business_layer/registry.go:18-91):**

```go
func RegistryPaymentsBusinessLayer(ctx di.Context, opts *di.RegistryOpts) (*PaymentsBusinessLayer, error) {
    // 1. Get own configuration
    config, err := di.CreateConfiguration[*PaymentsBusinessLayerConfiguration](ctx, di.WithOpts(opts))

    // 2. Each di.Create looks for config NESTED inside payments_business_layer
    paymentsDatalayer, err := di.Create[*payments_data_layer.PaymentsDataLayer](
        ctx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenPaymentsDataLayer))

    paymentService, err := di.Create[*payments_services.PaymentService](
        ctx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenPaymentService))

    walletService, err := di.Create[*payments_services.WalletService](
        ctx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenWalletService))
    // ...
}
```

**Corresponding JSON (misc/configs/ms_payments.json):**

```json
{
    "payments_business_layer": {
        "payments_data_layer": {
            "database_orm": { ... }
        },
        "payment_service": {
            "webhook_username": "...",
            "payment_api": { ... },
            "wallet_service": {
                "payment_api": { ... }
            }
        },
        "wallet_service": {
            "payment_api": { ... }
        }
    }
}
```

---

<!-- /ANCHOR:configuration-structure -->
<!-- ANCHOR:configuration-patterns -->
## 5. CONFIGURATION PATTERNS

### Pattern 1: Root-Level Services (via Struct Embedding)

When a configuration is embedded in the microservice config struct, it becomes a root-level JSON key.

**Code:**
```go
// internal/ms/ms_payments/microservice.go
type PaymentsMicroserviceConfiguration struct {
    bundles.HttpServerBundleConfigurations `json:"http_server_bundle"`
    // ...
}
```

**JSON:**
```json
{
  "http_server_bundle": {
    "cors_configuration": { ... }
  }
}
```

### Pattern 2: Nested Services (via di.Create chain)

Services created inside registry functions are nested under their parent's config.

**Code:**
```go
// internal/domain/payments/payments_business_layer/registry.go
func RegistryPaymentsBusinessLayer(ctx di.Context, opts *di.RegistryOpts) (*PaymentsBusinessLayer, error) {
    // This di.Create looks for "payments_data_layer" INSIDE "payments_business_layer"
    paymentsDatalayer, err := di.Create[*payments_data_layer.PaymentsDataLayer](
        ctx, di.WithOpts(opts), di.WithToken(coredi.RegistryTokenPaymentsDataLayer))
}
```

**JSON:**
```json
{
  "payments_business_layer": {
    "payments_data_layer": {
      "database_orm": { ... }
    }
  }
}
```

### Pattern 3: Deep Nesting (Multiple Levels)

When services create other services, nesting continues recursively.

**Code:**
```go
// Level 1: Business Layer creates PaymentService
func RegistryPaymentsBusinessLayer(...) {
    paymentService, err := di.Create[*PaymentService](ctx, di.WithOpts(opts), ...)
}

// Level 2: PaymentService creates WalletService
func RegistryPaymentService(...) {
    walletService, err := di.Create[*WalletService](ctx, di.WithOpts(opts), ...)
}
```

**JSON:**
```json
{
  "payments_business_layer": {
    "payment_service": {
      "wallet_service": {
        "payment_api": { ... }
      }
    }
  }
}
```

### Pattern 4: Configuration References (#ref)

The config system supports **reusable configuration blocks** via the `#ref` pattern.

**JSON:**
```json
{
  "#ref": {
    "database_orm": {
      "driver": "gorm_db_driver",
      "values": {
        "dsn": "host=${env.DB_HOST} ..."
      }
    },
    "payment_provider": {
      "site_name": "${env.PAYMENT_SITE_NAME}",
      "api_key": "${env.PAYMENT_API_KEY}"
    }
  },
  "payments_business_layer": {
    "payments_data_layer": {
      "database_orm": "${#ref.database_orm}"
    },
    "payment_service": {
      "payment_api": "${#ref.payment_provider}"
    }
  }
}
```

The `${#ref.name}` syntax injects the referenced configuration block, avoiding duplication.

### Pattern 5: Environment Variables

Configuration values can reference environment variables:

```json
{
  "listen_addr": ":8080",
  "database": {
    "host": "${env.DB_HOST}",
    "port": ${env.DB_PORT},
    "password": "${env.DB_PASSWORD}"
  }
}
```

---

<!-- /ANCHOR:configuration-patterns -->
<!-- ANCHOR:debugging-configuration-issues -->
## 6. DEBUGGING CONFIGURATION ISSUES

### 6.1 How do I read error messages?

**Error:**
```
configuration not found for token "payments_data_layer"
Breadcrumbs: [payments_business_layer payments_data_layer]
```

**What it means:**
1. The system started at root config
2. Found and entered `payments_business_layer`
3. Looked for `payments_data_layer` inside it
4. Failed to find that key

### 6.2 Common Mistake 1: Wrong Nesting Level

```json
// WRONG - Service at root when it should be nested
{
  "payments_business_layer": {},
  "payments_data_layer": {
    "database_orm": { ... }
  }
}

// CORRECT - Service nested inside business layer
{
  "payments_business_layer": {
    "payments_data_layer": {
      "database_orm": { ... }
    }
  }
}
```

### 6.3 Common Mistake 2: Incorrect Key Name

```json
// WRONG - Key doesn't match token value
{
  "payments_business_layer": {
    "data_layer": { ... }
  }
}

// CORRECT - Key matches RegistryTokenPaymentsDataLayer ("payments_data_layer")
{
  "payments_business_layer": {
    "payments_data_layer": { ... }
  }
}
```

### 6.4 Common Mistake 3: Missing #ref Expansion

```json
// WRONG - Reference typo or missing #ref block
{
  "payments_data_layer": {
    "database_orm": "${#ref.database}"  // typo: should be "database_orm"
  }
}

// CORRECT - Reference matches #ref key
{
  "#ref": {
    "database_orm": { ... }
  },
  "payments_data_layer": {
    "database_orm": "${#ref.database_orm}"
  }
}
```

### 6.5 Debugging Steps

1. **Read the breadcrumbs** - They show exactly where lookup failed
2. **Check injection_tokens.go** - Find exact string value for the token
3. **Trace di.Create calls** - Follow the code path to understand nesting
4. **Verify JSON structure** - Ensure nesting matches call hierarchy
5. **Check for typos** - Token strings must match JSON keys exactly

---

<!-- /ANCHOR:debugging-configuration-issues -->
<!-- ANCHOR:practical-guide -->
## 7. PRACTICAL GUIDE

### 7.1 How do I add configuration for a new service?

**Step 1: Define the Injection Token**

```go
// infra/di/injection_tokens.go
RegistryTokenMyNewService = pdi.RegisterInjectionToken("my_new_service")
```

**Step 2: Create Configuration Struct**

```go
// internal/domain/myfeature/myfeature_services/my_service.go
type MyNewServiceConfiguration struct {
    ApiKey  string `json:"api_key"`
    Timeout int    `json:"timeout_seconds"`
}
```

**Step 3: Create Registry Functions**

```go
// internal/domain/myfeature/myfeature_services/registry.go
func RegistryMyNewServiceConfiguration(ctx di.Context, opts *di.RegistryOpts) (*MyNewServiceConfiguration, error) {
    return di.ConfigurationLookup[*MyNewServiceConfiguration](ctx, opts)
}

func RegistryMyNewService(ctx di.Context, opts *di.RegistryOpts) (*MyNewService, error) {
    config, err := di.CreateConfiguration[*MyNewServiceConfiguration](ctx, di.WithOpts(opts))
    if err != nil {
        return nil, err
    }
    return NewMyNewService(config), nil
}
```

**Step 4: Register in Domain Registry**

```go
// internal/domain/myfeature/registry.go
func Registry() {
    once.Do(func() {
        errors.Must(di.RegisterConfiguration[*myfeature_services.MyNewServiceConfiguration](
            myfeature_services.RegistryMyNewServiceConfiguration,
            di.WithToken(coredi.RegistryTokenMyNewService),
        ))
        errors.Must(di.Register[*myfeature_services.MyNewService](
            myfeature_services.RegistryMyNewService,
            di.WithToken(coredi.RegistryTokenMyNewService),
        ))
    })
}
```

**Step 5: Find Where di.Create Will Be Called**

```bash
# Search for where your service will be instantiated
grep -r "RegistryTokenMyNewService" internal/
```

If it's called from `RegistryMyFeatureBusinessLayer`, the config goes inside `my_feature_business_layer`.

**Step 6: Add JSON Configuration**

```json
{
  "my_feature_business_layer": {
    "my_new_service": {
      "api_key": "${env.MY_API_KEY}",
      "timeout_seconds": 30
    }
  }
}
```

### 7.2 Configuration Checklist

When adding a new service configuration:

- [ ] Define injection token in `infra/di/injection_tokens.go`
- [ ] Create configuration struct with JSON tags
- [ ] Create `RegistryXxxConfiguration` function (calls `di.ConfigurationLookup`)
- [ ] Create `RegistryXxx` function (calls `di.CreateConfiguration` and `di.Create` for deps)
- [ ] Register both in domain `Registry()` function
- [ ] Identify parent registry (determines JSON nesting)
- [ ] Add JSON config at correct nesting level
- [ ] Test configuration loads without errors

---

<!-- /ANCHOR:practical-guide -->
<!-- ANCHOR:real-world-example-ms-payments -->
## 8. REAL-WORLD EXAMPLE: ms_payments

This section traces through the complete ms_payments configuration to show how all concepts connect.

### 8.1 The Microservice Configuration Struct

```go
// internal/ms/ms_payments/microservice.go:30-47
type PaymentsMicroserviceConfiguration struct {
    // Bundle configs (root-level in JSON via embedding)
    bundles.TokenServicesBundleConfiguration         `json:"token_services_bundle"`
    bundles.AuthorizationGatesBundleConfiguration    `json:"authorization_gates_bundle"`
    bundles.MetricsBundleConfiguration               `json:"metrics_bundle"`
    bundles.HttpServerBundleConfigurations           `json:"http_server_bundle"`
    bundles.SQSProducerPoolBundleConfiguration       `json:"sqs_producer_pool_bundle"`

    // Domain configs (root-level in JSON via embedding)
    payments_business_layer.PaymentsBusinessLayerConfiguration             `json:"payments_business_layer"`
    payments_business_layer.CouponsBusinessLayerConfiguration              `json:"coupons_business_layer"`
    payments_business_layer.BillableItemsBusinessLayerConfiguration        `json:"billable_items_business_layer"`
    payments_business_layer.PaymentEventsHandlerBusinessLayerConfiguration `json:"payment_events_handler_business_layer"`

    // Direct fields (root-level in JSON)
    ListenAddr        string `json:"listen_addr"`
    ListenMetricsAddr string `json:"listen_metrics_addr"`

    // Non-embedded configs
    SQSPaymentsConsumerConfiguration sqs.ConsumerConfiguration `json:"sqs_payments_consumer"`
    SQSConsumerClientConfiguration   sqs.ClientConfiguration   `json:"sqs_consumer_client"`
    SQSConsumerDisabled              bool                      `json:"sqs_consumer_disabled"`
}

// LookupNode enables DI tree traversal
func (p *PaymentsMicroserviceConfiguration) LookupNode(lookupPath string) (any, error) {
    return di.ConfigurationNodeLookup(p, lookupPath)
}
```

### 8.2 The Registration Chain

```go
// internal/ms/ms_payments/registry.go:34-35
di.RegisterConfiguration[*PaymentsMicroserviceConfiguration](RegistryMSPaymentsConfiguration)
di.Register[*PaymentsMicroservice](RegistryMSPayments)

// internal/domain/payments/registry.go:26-27
di.RegisterConfiguration[*payments_business_layer.PaymentsBusinessLayerConfiguration](
    payments_business_layer.RegistryPaymentsBusinessLayerConfiguration,
    di.WithToken(coredi.RegistryTokenPaymentsBusinessLayer))
di.Register[*payments_business_layer.PaymentsBusinessLayer](
    payments_business_layer.RegistryPaymentsBusinessLayer,
    di.WithToken(coredi.RegistryTokenPaymentsBusinessLayer))
```

### 8.3 The Factory Function (Creates Dependencies)

```go
// internal/domain/payments/payments_business_layer/registry.go:18-95
func RegistryPaymentsBusinessLayer(ctx di.Context, opts *di.RegistryOpts) (*PaymentsBusinessLayer, error) {
    // Get own config
    config, err := di.CreateConfiguration[*PaymentsBusinessLayerConfiguration](ctx, di.WithOpts(opts))

    // Each di.Create looks for nested config inside payments_business_layer
    paymentsDatalayer, err := di.Create[*payments_data_layer.PaymentsDataLayer](ctx, di.WithOpts(opts),
        di.WithToken(coredi.RegistryTokenPaymentsDataLayer))              // -> "payments_data_layer"

    paymentService, err := di.Create[*payments_services.PaymentService](ctx, di.WithOpts(opts),
        di.WithToken(coredi.RegistryTokenPaymentService))                 // -> "payment_service"

    walletService, err := di.Create[*payments_services.WalletService](ctx, di.WithOpts(opts),
        di.WithToken(coredi.RegistryTokenWalletService))                  // -> "wallet_service"

    // ... more dependencies
}
```

### 8.4 The JSON Configuration (misc/configs/ms_payments.json)

```json
{
  "#ref": {
    "database_orm": { "driver": "gorm_db_driver", "values": { "dsn": "..." } },
    "payment_provider": { "site_name": "${env.PAYMENT_SITE_NAME}", "api_key": "${env.PAYMENT_API_KEY}" }
  },

  "listen_addr": ":8080",
  "listen_metrics_addr": ":3000",

  "token_services_bundle": {
    "token_service": { "validity_in_seconds_token": 5259492, ... },
    "token_cache": { "address": "${env.REDIS_HOST}:${env.REDIS_PORT}" }
  },

  "authorization_gates_bundle": {
    "jwt_header_key": "authorization",
    "authorization_gate": { "value": "${env.AUTH_KEY}", "header": "X-AuthKey" }
  },

  "payments_business_layer": {
    "payments_data_layer": {
      "database_orm": "${#ref.database_orm}"
    },
    "payment_service": {
      "payments_data_layer": { "database_orm": "${#ref.database_orm}" },
      "payment_api": "${#ref.payment_provider}",
      "wallet_service": { "payment_api": "${#ref.payment_provider}" }
    },
    "wallet_service": { "payment_api": "${#ref.payment_provider}" },
    "billable_items_service": {
      "payments_data_layer": { "database_orm": "${#ref.database_orm}" },
      "payment_api": "${#ref.payment_provider}"
    }
  },

  "coupons_business_layer": {
    "payments_data_layer": { "database_orm": "${#ref.database_orm}" },
    "coupon_service": { "payment_api": "${#ref.payment_provider}" }
  }
}
```

### 8.5 The Token-to-JSON Mapping

| Token in Code | Token String Value | JSON Key |
|---------------|-------------------|----------|
| `RegistryTokenPaymentsBusinessLayer` | `"payments_business_layer"` | `"payments_business_layer"` |
| `RegistryTokenPaymentsDataLayer` | `"payments_data_layer"` | `"payments_data_layer"` |
| `RegistryTokenPaymentService` | `"payment_service"` | `"payment_service"` |
| `RegistryTokenWalletService` | `"wallet_service"` | `"wallet_service"` |
| `RegistryTokenPaymentAPI` | `"payment_api"` | `"payment_api"` |

---

<!-- /ANCHOR:real-world-example-ms-payments -->
<!-- ANCHOR:best-practices -->
## 9. BEST PRACTICES

### DO

- **Trace the di.Create chain**: Always follow where `di.Create` is called to understand JSON nesting
- **Check injection_tokens.go**: The string value passed to `RegisterInjectionToken()` is the exact JSON key
- **Use #ref for shared configs**: Database, API clients, etc. that are used in multiple places
- **Implement LookupNode**: Every configuration struct must implement `di.Configuration` interface
- **Match token and config registration**: Always register both configuration and instance with the same token
- **Test config loading early**: Run microservice startup to catch config errors during development
- **Use breadcrumbs for debugging**: Error messages show exact JSON path that failed

### DON'T

- **Flatten nested configs**: Never move a nested config to root unless you also move the `di.Create` call
- **Guess JSON keys**: Always check `injection_tokens.go` for the exact token string
- **Skip nesting levels**: Each `di.Create` inside a registry creates one nesting level
- **Ignore di.WithOpts(opts)**: This parameter carries parent context; omitting it breaks nesting
- **Duplicate configuration**: Use `#ref` pattern instead of copying config blocks

---

<!-- /ANCHOR:best-practices -->
<!-- ANCHOR:rules -->
## 10. RULES

### ✅ ALWAYS

- Register BOTH configuration and instance factory for each injectable type
- Use `di.WithOpts(opts)` when calling `di.Create` inside factory functions
- Implement `LookupNode()` method on microservice configuration structs
- Test configuration loading before committing changes
- Check injection token strings match JSON keys exactly

### ❌ NEVER

- Create instances with `di.Create` without proper token registration
- Move configurations to different nesting levels without updating code
- Skip the paired registration pattern (config + instance)
- Hardcode configuration values that should come from JSON/env
- Create circular dependencies in the `di.Create` chain

### ⚠️ ESCALATE IF

- Breadcrumbs don't match expected JSON structure
- Configuration works in dev but fails in production
- You need to share configuration between unrelated services
- Circular dependency error occurs
- Multiple services need different configurations for same token

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

| Topic | Location | Description |
|-------|----------|-------------|
| DI Library | `github.com/pixie-sh/di-go` | External DI framework |
| Injection tokens | `infra/di/injection_tokens.go` | All token definitions |
| Domain registries | `internal/domain/*/registry.go` | Domain-level DI registration |
| MS registries | `internal/ms/*/registry.go` | Microservice-level DI registration |
| Config files | `misc/configs/*.json` | JSON configuration files |
| Bundle configs | `bundles/*.go` | Shared bundle configurations |
| Bootstrap | [microservice_bootstrap_architecture.md](./microservice_bootstrap_architecture.md) | Microservice startup process |
<!-- /ANCHOR:related-resources -->
