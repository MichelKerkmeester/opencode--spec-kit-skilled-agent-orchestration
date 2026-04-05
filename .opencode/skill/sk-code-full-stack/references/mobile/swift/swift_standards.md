---
title: Swift Standards
description: A comprehensive guide to Swift 5.9+ project structure, Xcode organization, Swift Package Manager, naming conventions, code organization patterns, and API Design Guidelines for iOS development.
---

# Swift Standards

A comprehensive guide to Swift 5.9+ project structure, Xcode organization, Swift Package Manager, naming conventions, code organization patterns, and API Design Guidelines for iOS development.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on Swift project organization including:

- **Project structure** - Xcode project and Swift Package organization
- **File naming** - Consistent, readable file naming conventions
- **Code organization** - Extensions, protocols, and type organization
- **Style guidelines** - Swift API Design Guidelines adherence
- **Modern Swift** - Swift 5.9+ features and best practices

### When to Use

- Creating new iOS/macOS projects
- Organizing Swift source files
- Establishing team coding standards
- Reviewing code for style compliance
- Onboarding developers to Swift codebases

### Core Principle

Clarity at the point of use + consistent naming + organized structure = maintainable Swift code.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:project-structure -->
## 2. PROJECT STRUCTURE

### Xcode Project Organization

A well-organized Xcode project follows a predictable folder structure that mirrors the file system:

```
MyApp/
├── MyApp.xcodeproj/
├── MyApp/                          # Main app target
│   ├── App/                        # App lifecycle
│   │   ├── MyAppApp.swift          # @main entry point
│   │   └── AppDelegate.swift       # If using UIKit lifecycle
│   ├── Features/                   # Feature modules
│   │   ├── Home/
│   │   │   ├── Views/
│   │   │   ├── ViewModels/
│   │   │   └── Models/
│   │   ├── Profile/
│   │   └── Settings/
│   ├── Core/                       # Shared infrastructure
│   │   ├── Networking/
│   │   ├── Storage/
│   │   ├── Extensions/
│   │   └── Utilities/
│   ├── UI/                         # Shared UI components
│   │   ├── Components/
│   │   ├── Modifiers/
│   │   └── Styles/
│   ├── Resources/                  # Assets and resources
│   │   ├── Assets.xcassets
│   │   ├── Localizable.xcstrings
│   │   └── Info.plist
│   └── Preview Content/            # SwiftUI previews
├── MyAppTests/                     # Unit tests
├── MyAppUITests/                   # UI tests
└── Packages/                       # Local Swift packages
```

### Feature Module Structure

Each feature should be self-contained:

```
Features/
├── Home/
│   ├── Views/
│   │   ├── HomeView.swift
│   │   ├── HomeHeaderView.swift
│   │   └── HomeItemRow.swift
│   ├── ViewModels/
│   │   └── HomeViewModel.swift
│   ├── Models/
│   │   └── HomeItem.swift
│   └── Services/
│       └── HomeService.swift
```

### When to Use Local Swift Packages

| Scenario | Recommendation |
|----------|---------------|
| Shared code between targets | Local package |
| Reusable UI components | Local package |
| Feature isolation | Local package |
| Third-party wrapper | Local package |
| App-specific code | Main target |

### Creating a Local Swift Package

```
Packages/
└── MyAppCore/
    ├── Package.swift
    ├── Sources/
    │   └── MyAppCore/
    │       ├── Networking/
    │       ├── Models/
    │       └── Extensions/
    └── Tests/
        └── MyAppCoreTests/
```

**Package.swift structure:**

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MyAppCore",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "MyAppCore",
            targets: ["MyAppCore"]
        )
    ],
    dependencies: [],
    targets: [
        .target(
            name: "MyAppCore",
            dependencies: []
        ),
        .testTarget(
            name: "MyAppCoreTests",
            dependencies: ["MyAppCore"]
        )
    ]
)
```

---

<!-- /ANCHOR:project-structure -->
<!-- ANCHOR:file-naming-conventions -->
## 3. FILE NAMING CONVENTIONS

### File Naming Rules

| File Type | Convention | Example |
|-----------|-----------|---------|
| Swift source | PascalCase | `UserProfile.swift` |
| Views | PascalCase + View suffix | `ProfileView.swift` |
| ViewModels | PascalCase + ViewModel suffix | `ProfileViewModel.swift` |
| Extensions | Type+Extension | `String+Validation.swift` |
| Protocols | PascalCase | `DataProvider.swift` |
| Tests | Type+Tests | `UserProfileTests.swift` |

### Extension File Naming

When extending types, use the `Type+Category` pattern:

```
Extensions/
├── String+Validation.swift
├── String+Formatting.swift
├── Date+Formatting.swift
├── View+Modifiers.swift
└── URLRequest+Convenience.swift
```

### Protocol File Naming

Protocols should be named for what they describe:

```swift
// ✅ CORRECT - describes capability
protocol DataProviding { }
protocol Identifiable { }
protocol Cacheable { }

// ❌ WRONG - describes implementation
protocol DataProviderProtocol { }
protocol IdentifiableProtocol { }
```

### View and ViewModel Pairing

Keep related files together:

```
Profile/
├── Views/
│   └── ProfileView.swift
├── ViewModels/
│   └── ProfileViewModel.swift
└── Models/
    └── Profile.swift
```

---

<!-- /ANCHOR:file-naming-conventions -->
<!-- ANCHOR:code-organization-within-files -->
## 4. CODE ORGANIZATION WITHIN FILES

### Type Organization Order

Organize types in a consistent order within each file:

```swift
// MARK: - ProfileView

struct ProfileView: View {

    // MARK: - Environment

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    // MARK: - State

    @State private var isEditing = false
    @State private var showingAlert = false

    // MARK: - Properties

    let user: User
    var onUpdate: ((User) -> Void)?

    // MARK: - Body

    var body: some View {
        content
    }

    // MARK: - Subviews

    @ViewBuilder
    private var content: some View {
        // ...
    }

    private var headerSection: some View {
        // ...
    }

    // MARK: - Actions

    private func handleSave() {
        // ...
    }
}
```

### Class/Struct Organization Order

```swift
class UserService {

    // MARK: - Types

    enum UserError: Error {
        case notFound
        case invalidData
    }

    // MARK: - Properties

    private let networkClient: NetworkClient
    private let cache: UserCache

    // MARK: - Initialization

    init(networkClient: NetworkClient, cache: UserCache) {
        self.networkClient = networkClient
        self.cache = cache
    }

    // MARK: - Public Methods

    func fetchUser(id: String) async throws -> User {
        // ...
    }

    // MARK: - Private Methods

    private func cacheUser(_ user: User) {
        // ...
    }
}
```

### MARK Comments

Use MARK comments to organize code sections:

```swift
// MARK: - Section Name
// MARK: Section Name (without divider)
// TODO: Something to do
// FIXME: Something to fix
```

---

<!-- /ANCHOR:code-organization-within-files -->
<!-- ANCHOR:naming-conventions -->
## 5. NAMING CONVENTIONS

### Swift API Design Guidelines

Follow Apple's [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/).

#### Clarity at the Point of Use

```swift
// ✅ CORRECT - clear at call site
users.remove(at: index)
image.scaled(to: size)
view.constraint(equalTo: anchor)

// ❌ WRONG - unclear at call site
users.remove(index)
image.scaled(size)
view.constraint(anchor)
```

#### Naming Types

```swift
// Types use PascalCase
struct UserProfile { }
class NetworkClient { }
enum LoadingState { }
protocol DataProviding { }

// Type aliases use PascalCase
typealias UserID = String
typealias CompletionHandler = (Result<Data, Error>) -> Void
```

#### Naming Functions and Methods

```swift
// Functions and methods use camelCase
func fetchUser(withID id: String) -> User
func makeRequest(for endpoint: Endpoint) -> URLRequest

// Factory methods start with "make"
func makeViewController() -> UIViewController
func makeRequest() -> URLRequest

// Boolean methods/properties read as assertions
var isEmpty: Bool
var hasContent: Bool
func canPerform(_ action: Action) -> Bool
func contains(_ element: Element) -> Bool
```

#### Naming Variables and Constants

```swift
// Variables and constants use camelCase
let userName = "John"
var currentIndex = 0
let maximumRetryCount = 3

// Avoid abbreviations except well-known ones
let url: URL          // Well-known
let id: String        // Well-known
let userID: String    // Preferred over userIdentifier
let numberOfItems: Int // Not numItems or itemCount
```

### Argument Labels

```swift
// Use argument labels that read grammatically
func move(from source: Point, to destination: Point)
func add(_ element: Element, at index: Int)
func remove(_ element: Element)

// Omit labels when the first argument forms a phrase with the method name
func contains(_ element: Element) -> Bool
func append(_ newElement: Element)

// Use labels for all arguments in initializers
init(name: String, age: Int, email: String)
```

### Boolean Naming

```swift
// Boolean properties/variables read as assertions
var isEnabled: Bool
var hasChanges: Bool
var canSubmit: Bool
var shouldRefresh: Bool

// Boolean functions ask a question
func contains(_ element: Element) -> Bool
func isValid(for context: Context) -> Bool
```

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:swift-style-guide -->
## 6. SWIFT STYLE GUIDE

### Spacing and Indentation

```swift
// Use 4 spaces for indentation (Xcode default)
struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello")
        }
    }
}

// One blank line between type declarations
struct User { }

struct UserView { }

// One blank line between method declarations
func methodOne() { }

func methodTwo() { }
```

### Braces

```swift
// Opening brace on same line
if condition {
    // ...
}

func doSomething() {
    // ...
}

// Closing brace on its own line
guard let value = optional else {
    return
}
```

### Line Length

- Keep lines under 120 characters
- Break long function signatures:

```swift
// Long function signature - break after opening parenthesis
func performComplexOperation(
    with firstParameter: String,
    and secondParameter: Int,
    completion: @escaping (Result<Data, Error>) -> Void
) {
    // ...
}
```

### Access Control

```swift
// Explicit access control (except for default internal)
public struct PublicAPI { }

internal struct InternalHelper { }  // "internal" is optional

private struct PrivateImplementation { }

fileprivate struct FilePrivateHelper { }

// Order: public > internal > fileprivate > private
public class MyClass {
    public var publicProperty: String
    var internalProperty: String
    fileprivate var filePrivateProperty: String
    private var privateProperty: String
}
```

### Type Inference

```swift
// Use type inference when the type is obvious
let name = "John"           // String is obvious
let count = 42              // Int is obvious
let items = [Item]()        // Empty array needs type

// Explicit types when not obvious
let result: Result<User, Error> = .success(user)
let handler: (Int) -> String = { "\($0)" }
```

### Optionals

```swift
// Prefer optional binding over force unwrapping
// ✅ CORRECT
if let user = optionalUser {
    print(user.name)
}

guard let user = optionalUser else {
    return
}

// ❌ WRONG - force unwrap
print(optionalUser!.name)

// Use nil coalescing for defaults
let name = user.nickname ?? user.name

// Optional chaining
let streetName = user.address?.street?.name
```

---

<!-- /ANCHOR:swift-style-guide -->
<!-- ANCHOR:swift-5-9-features -->
## 7. SWIFT 5.9+ FEATURES

### Macros

```swift
// Use @Observable for observable types (iOS 17+)
@Observable
class UserViewModel {
    var name: String = ""
    var email: String = ""
}

// Use @Model for SwiftData (iOS 17+)
@Model
class User {
    var name: String
    var email: String

    init(name: String, email: String) {
        self.name = name
        self.email = email
    }
}
```

### if and switch Expressions

```swift
// if expressions (Swift 5.9+)
let status = if isConnected {
    "Online"
} else {
    "Offline"
}

// switch expressions
let description = switch state {
case .loading: "Loading..."
case .loaded(let data): "Loaded \(data.count) items"
case .error(let error): "Error: \(error.localizedDescription)"
}
```

### Parameter Packs

```swift
// Variadic generics (Swift 5.9+)
func process<each T>(_ items: repeat each T) {
    repeat print(each items)
}
```

### Copyable and NonCopyable

```swift
// Non-copyable types (Swift 5.9+)
struct UniqueResource: ~Copyable {
    let handle: Int

    consuming func close() {
        // Cleanup
    }
}
```

---

<!-- /ANCHOR:swift-5-9-features -->
<!-- ANCHOR:documentation -->
## 8. DOCUMENTATION

### Documentation Comments

```swift
/// A user in the system.
///
/// Use `User` to represent authenticated users in the app.
/// Users have a unique identifier and associated profile information.
///
/// ## Example
///
/// ```swift
/// let user = User(id: "123", name: "John")
/// print(user.displayName)
/// ```
///
/// - Note: Users are Codable for persistence.
/// - Important: The `id` property is immutable after creation.
struct User: Codable, Identifiable {
    /// The unique identifier for this user.
    let id: String

    /// The user's display name.
    var name: String

    /// Creates a new user with the specified properties.
    ///
    /// - Parameters:
    ///   - id: The unique identifier for the user.
    ///   - name: The user's display name.
    init(id: String, name: String) {
        self.id = id
        self.name = name
    }
}
```

### Function Documentation

```swift
/// Fetches a user from the server.
///
/// This method performs a network request to retrieve user data.
/// The request is authenticated using the current session token.
///
/// - Parameters:
///   - id: The unique identifier of the user to fetch.
///   - includeProfile: Whether to include extended profile data.
///
/// - Returns: The requested user object.
///
/// - Throws: `NetworkError.notFound` if the user doesn't exist.
/// - Throws: `NetworkError.unauthorized` if the session is invalid.
///
/// ## Example
///
/// ```swift
/// let user = try await service.fetchUser(id: "123")
/// ```
func fetchUser(id: String, includeProfile: Bool = false) async throws -> User {
    // ...
}
```

---

<!-- /ANCHOR:documentation -->
<!-- ANCHOR:common-patterns -->
## 9. COMMON PATTERNS

### Dependency Injection

```swift
// Protocol-based dependency injection
protocol UserRepositoryProtocol {
    func fetchUser(id: String) async throws -> User
    func saveUser(_ user: User) async throws
}

class UserService {
    private let repository: UserRepositoryProtocol

    init(repository: UserRepositoryProtocol) {
        self.repository = repository
    }
}

// Environment-based injection for SwiftUI
struct UserRepositoryKey: EnvironmentKey {
    static let defaultValue: UserRepositoryProtocol = UserRepository()
}

extension EnvironmentValues {
    var userRepository: UserRepositoryProtocol {
        get { self[UserRepositoryKey.self] }
        set { self[UserRepositoryKey.self] = newValue }
    }
}
```

### Result Builders

```swift
// Custom result builder for configuration
@resultBuilder
struct ConfigurationBuilder {
    static func buildBlock(_ components: Configuration...) -> [Configuration] {
        components
    }
}

func configure(@ConfigurationBuilder builder: () -> [Configuration]) {
    let configurations = builder()
    // Apply configurations
}
```

### Property Wrappers

```swift
// Custom property wrapper
@propertyWrapper
struct UserDefault<Value> {
    let key: String
    let defaultValue: Value

    var wrappedValue: Value {
        get {
            UserDefaults.standard.object(forKey: key) as? Value ?? defaultValue
        }
        set {
            UserDefaults.standard.set(newValue, forKey: key)
        }
    }
}

// Usage
class Settings {
    @UserDefault(key: "username", defaultValue: "")
    var username: String

    @UserDefault(key: "isFirstLaunch", defaultValue: true)
    var isFirstLaunch: Bool
}
```

---

<!-- /ANCHOR:common-patterns -->
<!-- ANCHOR:rules -->
## 10. RULES

### ✅ ALWAYS

1. **Follow Swift API Design Guidelines** - Clarity at the point of use is paramount
2. **Use meaningful names** - Names should be self-documenting
3. **Organize code with MARK comments** - Makes navigation easier
4. **Use access control** - Minimize exposed API surface
5. **Prefer value types** - Use structs over classes when possible
6. **Use protocol-oriented design** - Composition over inheritance
7. **Document public APIs** - Use documentation comments
8. **Handle optionals safely** - Use optional binding, never force unwrap in production
9. **Group related code** - Keep related functionality together
10. **Use Swift 5.9+ features** - Leverage modern Swift capabilities

### ❌ NEVER

1. **Force unwrap optionals** - Use `guard let` or `if let`
2. **Use abbreviations** - Except well-known ones (URL, ID, etc.)
3. **Mix naming conventions** - Stick to Swift conventions
4. **Create massive files** - Split into logical units
5. **Ignore warnings** - Treat warnings as errors
6. **Use `Any` unnecessarily** - Prefer specific types or generics
7. **Hardcode strings** - Use constants or localization
8. **Skip access control** - Default internal is often too permissive
9. **Nest types deeply** - Flatten when possible
10. **Ignore the style guide** - Consistency matters

### ⚠️ ESCALATE IF

1. **Architecture decisions needed** - Major structural changes require team consensus
2. **New patterns introduced** - Document and discuss before adopting
3. **Breaking API changes** - Coordinate with dependent code
4. **Performance concerns** - Profile before optimizing

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

| File | Purpose |
|------|---------|
| [swiftui_patterns.md](./swiftui_patterns.md) | SwiftUI view composition and state management |
| [mvvm_architecture.md](./mvvm_architecture.md) | MVVM architecture patterns with SwiftUI |
| [async_patterns.md](./async_patterns.md) | Swift concurrency and async/await patterns |
| [testing_strategy.md](./testing_strategy.md) | XCTest and testing best practices |
| [persistence_patterns.md](./persistence_patterns.md) | SwiftData, Core Data, and storage patterns |
<!-- /ANCHOR:related-resources -->
