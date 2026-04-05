---
title: Microservice Bootstrap Architecture - DI-Driven Bootstrap and Registry System
description: Modern microservice bootstrap pattern, registry hierarchy, configuration-DI mapping, and old-to-new migration patterns for backend systems.
---

# Microservice Bootstrap Architecture - DI-Driven Bootstrap and Registry System

Modern microservice bootstrap pattern, registry hierarchy, configuration-DI mapping, and old-to-new migration patterns for backend systems.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This document provides comprehensive guidance on the modern microservice architecture pattern used in backend systems. The primary reference implementations are `ms_core` and `ms_payments` (complete examples of new pattern).

**Migration Status (as of Phase One):**
- **10 of 12 microservices** now use the new DI-driven pattern
- Only `ms_ai_integrations` and `ms_chat` still use the old pattern
- `ms_cron` and `ms_notifications` have been **fully migrated** to the new pattern

### Progressive Disclosure

| If you need to... | Read section... |
|-------------------|-----------------|
| Understand new vs old pattern | 2 (Architecture Patterns) |
| Create a new microservice | 4 (File Organization) |
| Set up DI registry | 3 (Registry System) |
| Configure microservice | 5 (Configuration & DI Tree) |
| Migrate old microservice | 6 (Migration Guide) |
| Debug bootstrap issues | 7 (Common Pitfalls) |

### File Relationships

```
microservice_bootstrap_architecture.md (this file)
    ├── DI configuration → di_configuration.md
    ├── Domain patterns → domain_layers.md
    ├── Bootstrap pkg → pkg/microservice/bootstrap.go
    ├── DI tokens → infra/di/injection_tokens.go
    └── Bundle registry → bundles/registry.go
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:architecture-patterns -->
## 2. ARCHITECTURE PATTERNS

### New Pattern (Standard - 10 Microservices)

**Applies to:** `ms_authentication`, `ms_core`, `ms_creators`, `ms_cron`, `ms_orders`, `ms_feed`, `ms_media`, `ms_notifications`, `ms_vendors`, `ms_payments`

**Characteristics:**
- Uses `microservice.BootstrapMust[T, CT]()` generic bootstrapper
- Fully DI-driven with registry functions
- Clean separation of concerns
- Declarative configuration structure
- Registry-based dependency resolution

**Structure:**
```
cmd/ms/ms_core/
  └── application.go          # Minimal entry point (10-15 lines)

internal/ms/ms_core/
  ├── microservice.go         # Microservice struct and lifecycle methods
  ├── registry.go             # DI registry functions
  ├── http_controllers.go     # HTTP routing setup
  └── http_bo_controllers.go  # Backoffice HTTP routing
```

### Old Pattern (DEPRECATED - 2 Remaining)

**Applies to:** `ms_ai_integrations`, `ms_chat` only

**Characteristics:**
- Manual dependency wiring in main()
- Direct instantiation of all dependencies
- Large application.go files (300-400+ lines)
- No registry pattern
- Manual configuration to dependency mapping

**Structure:**
```
cmd/ms/ms_chat/
  └── application.go          # Everything in main() (300+ lines)

internal/ms/ms_chat/
  ├── layers.go               # Layer grouping
  └── chat_ms_controllers/
      ├── setup.go
      └── *_controller.go
```

> **Note:** All new microservices MUST use the new pattern. The old pattern is being phased out.

---

<!-- /ANCHOR:architecture-patterns -->
<!-- ANCHOR:registry-system -->
## 3. REGISTRY SYSTEM

### How does the registry hierarchy work?

Registries are organized at three levels:

```
1. Bundle Registry (bundles/registry.go)
   └── Infrastructure: HTTP, SQS, Auth, Metrics, etc.

2. Domain Registries (internal/domain/{domain}/registry.go)
   └── Data layers, services, business layers

3. Microservice Registry (internal/ms/ms_{name}/registry.go)
   └── Orchestrates domain registries, creates microservice
```

### Domain-Level Registry Pattern

```go
// internal/domain/{domain_name}/registry.go
package domain_name

import (
    "sync"
    "github.com/pixie-sh/di-go"
    "github.com/pixie-sh/errors-go"
    coredi "github.com/example/backend/infra/di"
)

var once sync.Once

func Registry() {
    once.Do(func() {
        // Data Layers
        errors.Must(di.RegisterConfiguration[*DataLayerConfiguration](
            RegistryDataLayerConfiguration,
            di.WithToken(coredi.RegistryTokenDataLayer),
        ))
        errors.Must(di.Register[*DataLayer](
            RegistryDataLayer,
            di.WithToken(coredi.RegistryTokenDataLayer),
        ))

        // Services
        errors.Must(di.RegisterConfiguration[*ServiceConfiguration](
            RegistryServiceConfiguration,
            di.WithToken(coredi.RegistryTokenService),
        ))
        errors.Must(di.Register[*Service](
            RegistryService,
            di.WithToken(coredi.RegistryTokenService),
        ))

        // Business Layers
        errors.Must(di.RegisterConfiguration[*BusinessLayerConfiguration](
            RegistryBusinessLayerConfiguration,
            di.WithToken(coredi.RegistryTokenBusinessLayer),
        ))
        errors.Must(di.Register[*BusinessLayer](
            RegistryBusinessLayer,
            di.WithToken(coredi.RegistryTokenBusinessLayer),
        ))
    })
}
```

### Microservice-Level Registry Pattern

```go
// internal/ms/ms_{name}/registry.go
package ms_name

import (
    "github.com/example/backend/bundles"
    "github.com/example/backend/internal/domain/auth"
    "github.com/example/backend/internal/domain/payments"
)

func init() {
    // Call all required domain registries
    bundles.Registry()
    auth.Registry()
    payments.Registry()
    Registry()  // Self-registration
}

var once sync.Once

func Registry() {
    once.Do(func() {
        errors.Must(di.RegisterConfiguration[*MicroserviceConfiguration](
            RegistryMicroserviceConfiguration,
        ))
        errors.Must(di.Register[*Microservice](
            RegistryMicroservice,
        ))
    })
}
```

### Injection Tokens

**Location:** `infra/di/injection_tokens.go`

```go
// Global tokens
var (
    RegistryTokenMetricsBundle = pdi.RegisterInjectionToken("metrics_bundle")
    RegistryTokenHTTPServerBundle = pdi.RegisterInjectionToken("http_server_bundle")
)

// Domain-specific tokens (payments example)
var (
    RegistryTokenPaymentsDataLayer = pdi.RegisterInjectionToken("payments_data_layer")
    RegistryTokenPaymentsBusinessLayer = pdi.RegisterInjectionToken("payments_business_layer")
    RegistryTokenStripeService = pdi.RegisterInjectionToken("stripe_payment_service")
)
```

---

<!-- /ANCHOR:registry-system -->
<!-- ANCHOR:file-organization -->
## 4. FILE ORGANIZATION

### Modern Microservice Structure

```
cmd/ms/ms_name/
└── application.go                    # Entry point (minimal, 10-15 lines)

internal/ms/ms_name/
├── microservice.go                   # Core microservice definition
│   ├── type MicroserviceConfiguration struct
│   ├── type Microservice struct
│   ├── func NewMicroservice(...)
│   ├── func (m *Microservice) Setup() error
│   ├── func (m *Microservice) Start() error
│   ├── func (m *Microservice) PanicHandler()
│   ├── func (m *Microservice) Defer()
│   └── func (m *Microservice) Valid() error
│
├── registry.go                       # DI registry
│   ├── func init()                   # Call domain registries
│   ├── func Registry()               # Register microservice types
│   ├── func RegistryMicroserviceConfiguration(...)
│   └── func RegistryMicroservice(...)
│
├── http_controllers.go               # Public API controllers
└── http_bo_controllers.go            # Backoffice controllers

internal/domain/{domain_name}/
├── registry.go                       # Domain-level registry
├── {domain}_data_layer/
│   ├── registry.go
│   ├── {domain}_entities/
│   ├── {domain}_migrations/
│   └── {domain}_repositories/
├── {domain}_services/
│   └── registry.go
└── {domain}_business_layer/
    └── registry.go

bundles/
├── registry.go                       # Bundles registry
├── http_server_bundle.go
├── token_bundle.go
├── authorization_gates_bundle.go
└── ...

infra/di/
└── injection_tokens.go               # All DI tokens
```

---

<!-- /ANCHOR:file-organization -->
<!-- ANCHOR:configuration-di-tree -->
## 5. CONFIGURATION & DI TREE

### Critical Principle

> **Configuration struct hierarchy MUST exactly mirror the dependency injection tree.**

Each embedded struct in configuration corresponds to a component created via DI.

### Configuration Pattern

```go
type MicroserviceConfiguration struct {
    // 1. Bundle Configurations (infrastructure)
    bundles.TokenServicesBundleConfiguration         `json:"token_services_bundle"`
    bundles.AuthorizationGatesBundleConfiguration    `json:"authorization_gates_bundle"`
    bundles.TracerExporterBundleConfiguration        `json:"metrics_bundle"`
    bundles.HttpServerBundleConfigurations           `json:"http_server_bundle"`
    bundles.SQSProducerPoolBundleConfiguration       `json:"sqs_producer_pool_bundle"`

    // 2. Business Layer Configurations (domain logic)
    payments_business_layer.PaymentsBusinessLayerConfiguration `json:"payments_business_layer"`
    payments_business_layer.CouponsBusinessLayerConfiguration  `json:"coupons_business_layer"`

    // 3. Microservice-specific configs
    ListenAddr        string `json:"listen_addr"`
    ListenMetricsAddr string `json:"listen_metrics_addr"`

    // 4. Consumer/External service configs
    SQSPaymentsConsumerConfiguration sqs.ConsumerConfiguration `json:"sqs_payments_consumer"`
}

// MUST implement di.Configuration
func (p *MicroserviceConfiguration) LookupNode(lookupPath string) (any, error) {
    return di.ConfigurationNodeLookup(p, lookupPath)
}
```

### Configuration Nesting Rules

| Rule | Description |
|------|-------------|
| Direct Embedding | Use embedded structs for bundles and major components |
| Named Fields | Use named fields for specific configurations |
| JSON Tags | MUST match the DI lookup path expectations |
| LookupNode | Required for all microservice configurations |

---

<!-- /ANCHOR:configuration-di-tree -->
<!-- ANCHOR:migration-guide -->
## 6. MIGRATION GUIDE

### How do I migrate from old to new pattern?

**Step 1: Create Registry Structure**

```bash
# Create microservice registry
touch internal/ms/ms_name/registry.go

# Ensure domain registries exist
ls internal/domain/{domain}/registry.go
```

Add injection tokens to `infra/di/injection_tokens.go`.

**Step 2: Extract Configuration**

Move config from `application.go` to `microservice.go`:

```go
// internal/ms/ms_name/microservice.go
type MicroserviceConfiguration struct {
    bundles.TokenServicesBundleConfiguration         `json:"token_services_bundle"`
    bundles.AuthorizationGatesBundleConfiguration    `json:"authorization_gates_bundle"`

    domain_business_layer.BusinessLayerConfiguration `json:"domain_business_layer"`

    ListenAddr        string `json:"listen_addr"`
    ListenMetricsAddr string `json:"listen_metrics_addr"`
}

func (m *MicroserviceConfiguration) LookupNode(lookupPath string) (any, error) {
    return di.ConfigurationNodeLookup(m, lookupPath)
}
```

**Step 3: Create Microservice Struct**

```go
type Microservice struct {
    ctx context.Context

    // From DI
    configuration     *MicroserviceConfiguration
    server            http.Server
    metricsServer     http.Server
    businessLayer     *domain_business_layer.BusinessLayer
    gates             *bundles.AuthorizationGatesBundle

    // Non-DI (controllers)
    controllers       httpControllers
}

var _ microservice.Starter = &Microservice{}
var _ di.Configuration = &MicroserviceConfiguration{}
```

**Step 4: Implement Lifecycle Methods**

```go
func (m *Microservice) Setup() error {
    err := m.Valid()
    if err != nil {
        return err
    }

    m.controllers = httpControllers{
        server:        m.server,
        gates:         m.gates,
        businessLayer: m.businessLayer,
    }

    return m.controllers.SetupHTTP()
}

func (m *Microservice) Start() error {
    go func() {
        err := m.metricsServer.Listen(m.configuration.ListenMetricsAddr)
        if err != nil {
            logger.With("error", err).Error("unable to start metrics server")
        }
    }()

    return m.server.Listen(m.configuration.ListenAddr)
}

func (m *Microservice) PanicHandler() {
    microservice.PanicHandler()
}

func (m *Microservice) Defer() {
    metrics.Defer(m.ctx)
}

func (m *Microservice) Valid() error {
    return nil
}
```

**Step 5: Create Registry Function**

```go
func RegistryMicroservice(dictx di.Context, opts *di.RegistryOpts) (*Microservice, error) {
    log := pixiecontext.GetCtxLogger(dictx)

    // 1. Get configuration
    cfg, err := di.CreateConfiguration[*MicroserviceConfiguration](dictx, di.WithOpts(opts))
    if err != nil {
        return nil, err
    }

    // 2. Create bundles
    serverBundle, err := di.Create[*bundles.HttpServerBundle](
        dictx,
        di.WithOpts(opts),
        di.WithToken(coredi.RegistryTokenHTTPServerBundle),
    )
    if err != nil {
        return nil, err
    }

    gates, err := di.Create[*bundles.AuthorizationGatesBundle](
        dictx,
        di.WithOpts(opts),
        di.WithToken(coredi.RegistryTokenAuthorizationGatesBundle),
    )
    if err != nil {
        return nil, err
    }

    // 3. Create business layers
    businessLayer, err := di.Create[*domain_business_layer.BusinessLayer](
        dictx,
        di.WithOpts(opts),
        di.WithToken(coredi.RegistryTokenBusinessLayer),
    )
    if err != nil {
        return nil, err
    }

    // 4. Instantiate microservice
    ms := NewMicroservice(dictx, cfg, serverBundle, businessLayer, gates)

    // 5. Setup and return
    return ms, ms.Setup()
}
```

**Step 6: Simplify Entry Point**

```go
// cmd/ms/ms_name/application.go
package main

import (
    "context"
    "github.com/example/backend/internal/ms/ms_name"
    "github.com/example/backend/pkg/microservice"
)

func main() {
    bootstrap := microservice.BootstrapMust[*ms_name.Microservice, *ms_name.MicroserviceConfiguration](context.Background())
    bootstrap.Start()
}
```

---

<!-- /ANCHOR:migration-guide -->
<!-- ANCHOR:common-pitfalls -->
## 7. COMMON PITFALLS

### Pitfall 1: Missing Configuration Embedding

```go
// WRONG - Named field instead of embedded
type MicroserviceConfiguration struct {
    BusinessLayerConfig SomeBusinessLayerConfiguration `json:"business_layer"`
}

// CORRECT - Embedded type
type MicroserviceConfiguration struct {
    SomeBusinessLayerConfiguration `json:"business_layer"`
}
```

**Why:** DI looks for embedded types when resolving dependencies.

### Pitfall 2: Forgetting Registry Calls in init()

```go
// WRONG - Missing domain registries
func init() {
    bundles.Registry()
    Registry()
}

// CORRECT - All required registries called
func init() {
    bundles.Registry()
    auth.Registry()
    payments.Registry()
    core.Registry()
    Registry()
}
```

**Why:** Dependencies won't be resolvable if their registries aren't called.

### Pitfall 3: Incorrect Token Usage

```go
// WRONG - Missing token
businessLayer, err := di.Create[*BusinessLayer](dictx)

// CORRECT - With domain-specific token
businessLayer, err := di.Create[*BusinessLayer](
    dictx,
    di.WithToken(coredi.RegistryTokenPaymentsBusinessLayer),
)
```

**Why:** When multiple instances of same type exist, tokens disambiguate.

### Pitfall 4: Missing LookupNode Implementation

```go
// WRONG - Missing LookupNode
type MicroserviceConfiguration struct {
    // ... fields
}

// CORRECT - With LookupNode
type MicroserviceConfiguration struct {
    // ... fields
}

func (m *MicroserviceConfiguration) LookupNode(lookupPath string) (any, error) {
    return di.ConfigurationNodeLookup(m, lookupPath)
}
```

**Why:** DI system needs this to traverse configuration tree.

---

<!-- /ANCHOR:common-pitfalls -->
<!-- ANCHOR:rules -->
## 8. RULES

### ✅ ALWAYS

- Use `sync.Once` for registry functions
- Call all domain registries in `init()`
- Implement `LookupNode` for configuration structs
- Use tokens for disambiguation
- Embed configuration structs (not named fields)
- Follow the new pattern for new microservices

### ❌ NEVER

- Put business logic in registry functions
- Create circular dependencies between registries
- Skip the `init()` function for registry calls
- Use named fields for bundle configurations
- Manually wire dependencies in main()

### ⚠️ ESCALATE IF

- Circular dependency detected
- Configuration not found after correct nesting
- Bootstrap panics with registry errors
- Migration breaks existing functionality

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

| Topic | Document | Section |
|-------|----------|---------|
| DI configuration | [di_configuration.md](./di_configuration.md) | Nesting rules |
| Domain patterns | [domain_layers.md](./domain_layers.md) | Layer structure |
| Go standards | [go_standards.md](./go_standards.md) | Coding patterns |
| Bootstrap package | `pkg/microservice/bootstrap.go` | Generic bootstrapper |
| Injection tokens | `infra/di/injection_tokens.go` | Token definitions |
| Example: ms_core | `internal/ms/ms_core/` | Reference: multi-domain MS |
| Example: ms_payments | `internal/ms/ms_payments/` | Reference: MS with SQS consumers |
| Example: ms_cron | `internal/ms/ms_cron/` | Reference: migrated cron service |
| Example: ms_notifications | `internal/ms/ms_notifications/` | Reference: migrated notification service |
<!-- /ANCHOR:related-resources -->
