---
title: Async Patterns
description: A comprehensive guide to Swift concurrency including async/await, Task and TaskGroup, actor isolation, structured concurrency, AsyncSequence, error handling, and Combine integration for modern iOS development.
---

# Async Patterns

A comprehensive guide to Swift concurrency including async/await, Task and TaskGroup, actor isolation, structured concurrency, AsyncSequence, error handling, and Combine integration for modern iOS development.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on Swift concurrency including:

- **async/await** - Asynchronous function syntax and usage
- **Task and TaskGroup** - Structured concurrency primitives
- **Actor isolation** - Data race prevention
- **AsyncSequence** - Asynchronous iterations
- **Error handling** - Async error patterns
- **Combine basics** - Reactive programming for legacy code

### When to Use

- Making network requests
- Performing background operations
- Handling concurrent data access
- Processing streams of data
- Coordinating multiple async operations
- Migrating from completion handlers

### Core Principle

Structured concurrency + async/await + actors = safe, readable, maintainable asynchronous code.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:async-await-fundamentals -->
## 2. ASYNC/AWAIT FUNDAMENTALS

### Basic Async Functions

```swift
// Async function declaration
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, response) = try await URLSession.shared.data(from: url)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw NetworkError.invalidResponse
    }

    return try JSONDecoder().decode(User.self, from: data)
}

// Calling async functions
func loadUserProfile() async {
    do {
        let user = try await fetchUser(id: "123")
        print("Loaded user: \(user.name)")
    } catch {
        print("Failed to load user: \(error)")
    }
}
```

### Async Properties

```swift
struct UserProfile {
    let userId: String

    // Async computed property
    var avatar: UIImage {
        get async throws {
            let url = URL(string: "https://api.example.com/users/\(userId)/avatar")!
            let (data, _) = try await URLSession.shared.data(from: url)
            guard let image = UIImage(data: data) else {
                throw ImageError.decodingFailed
            }
            return image
        }
    }

    // Async read-only property
    var followers: [User] {
        get async throws {
            try await UserService.shared.fetchFollowers(for: userId)
        }
    }
}

// Usage
func displayProfile(_ profile: UserProfile) async throws {
    let avatar = try await profile.avatar
    let followers = try await profile.followers
    // Update UI
}
```

### Async Closures

```swift
// Async closure type
typealias AsyncHandler = () async throws -> Void
typealias AsyncDataHandler<T> = () async throws -> T

// Function accepting async closure
func withRetry<T>(
    maxAttempts: Int = 3,
    delay: Duration = .seconds(1),
    operation: () async throws -> T
) async throws -> T {
    var lastError: Error?

    for attempt in 1...maxAttempts {
        do {
            return try await operation()
        } catch {
            lastError = error
            if attempt < maxAttempts {
                try await Task.sleep(for: delay)
            }
        }
    }

    throw lastError!
}

// Usage
let user = try await withRetry {
    try await fetchUser(id: "123")
}
```

### Converting Completion Handlers

```swift
// Original completion-based API
func fetchData(completion: @escaping (Result<Data, Error>) -> Void) {
    // Legacy implementation
}

// Wrapped with async/await
func fetchData() async throws -> Data {
    try await withCheckedThrowingContinuation { continuation in
        fetchData { result in
            switch result {
            case .success(let data):
                continuation.resume(returning: data)
            case .failure(let error):
                continuation.resume(throwing: error)
            }
        }
    }
}

// For non-throwing callbacks
func fetchDataNonThrowing() async -> Data? {
    await withCheckedContinuation { continuation in
        fetchData { result in
            switch result {
            case .success(let data):
                continuation.resume(returning: data)
            case .failure:
                continuation.resume(returning: nil)
            }
        }
    }
}
```

### Continuation Safety

```swift
// IMPORTANT: Resume exactly once
func fetchWithTimeout(seconds: Int) async throws -> Data {
    try await withCheckedThrowingContinuation { continuation in
        var didResume = false

        let timer = Timer.scheduledTimer(withTimeInterval: TimeInterval(seconds), repeats: false) { _ in
            guard !didResume else { return }
            didResume = true
            continuation.resume(throwing: TimeoutError())
        }

        performNetworkRequest { result in
            guard !didResume else { return }
            didResume = true
            timer.invalidate()

            switch result {
            case .success(let data):
                continuation.resume(returning: data)
            case .failure(let error):
                continuation.resume(throwing: error)
            }
        }
    }
}
```

---

<!-- /ANCHOR:async-await-fundamentals -->
<!-- ANCHOR:task-and-taskgroup -->
## 3. TASK AND TASKGROUP

### Creating Tasks

```swift
// Unstructured task - runs independently
func startBackgroundSync() {
    Task {
        do {
            try await syncData()
        } catch {
            print("Sync failed: \(error)")
        }
    }
}

// Detached task - no context inheritance
func performHeavyComputation() {
    Task.detached(priority: .background) {
        let result = await computeExpensiveResult()
        await MainActor.run {
            self.updateUI(with: result)
        }
    }
}

// Task with priority
Task(priority: .userInitiated) {
    await loadCriticalData()
}
```

### Task Cancellation

```swift
class DataLoader {
    private var loadTask: Task<Void, Never>?

    func startLoading() {
        // Cancel any existing task
        loadTask?.cancel()

        loadTask = Task {
            do {
                // Check for cancellation
                try Task.checkCancellation()

                let data = try await fetchData()

                // Check again after long operation
                guard !Task.isCancelled else { return }

                await processData(data)
            } catch is CancellationError {
                print("Task was cancelled")
            } catch {
                print("Task failed: \(error)")
            }
        }
    }

    func stopLoading() {
        loadTask?.cancel()
    }
}

// Cancellation-aware operations
func fetchWithCancellation() async throws -> [Item] {
    var items: [Item] = []

    for page in 1...10 {
        // Check cancellation before each page
        try Task.checkCancellation()

        let pageItems = try await fetchPage(page)
        items.append(contentsOf: pageItems)
    }

    return items
}
```

### TaskGroup for Parallel Operations

```swift
// Parallel fetching with TaskGroup
func fetchAllUserData(userID: String) async throws -> UserData {
    async let profile = fetchProfile(userID: userID)
    async let posts = fetchPosts(userID: userID)
    async let followers = fetchFollowers(userID: userID)

    // Await all in parallel
    return try await UserData(
        profile: profile,
        posts: posts,
        followers: followers
    )
}

// Dynamic TaskGroup
func fetchProducts(ids: [String]) async throws -> [Product] {
    try await withThrowingTaskGroup(of: Product?.self) { group in
        for id in ids {
            group.addTask {
                try? await self.fetchProduct(id: id)
            }
        }

        var products: [Product] = []
        for try await product in group {
            if let product {
                products.append(product)
            }
        }
        return products
    }
}

// TaskGroup with results dictionary
func fetchMultipleResources() async throws -> [String: Data] {
    let urls = [
        "config": URL(string: "https://api.example.com/config")!,
        "settings": URL(string: "https://api.example.com/settings")!,
        "features": URL(string: "https://api.example.com/features")!
    ]

    return try await withThrowingTaskGroup(of: (String, Data).self) { group in
        for (key, url) in urls {
            group.addTask {
                let (data, _) = try await URLSession.shared.data(from: url)
                return (key, data)
            }
        }

        var results: [String: Data] = [:]
        for try await (key, data) in group {
            results[key] = data
        }
        return results
    }
}
```

### Limiting Concurrency

```swift
func processImages(_ images: [UIImage], maxConcurrency: Int = 4) async -> [ProcessedImage] {
    await withTaskGroup(of: ProcessedImage?.self) { group in
        var results: [ProcessedImage] = []
        var iterator = images.makeIterator()

        // Start initial batch
        for _ in 0..<min(maxConcurrency, images.count) {
            if let image = iterator.next() {
                group.addTask {
                    await self.processImage(image)
                }
            }
        }

        // As each completes, start another
        for await result in group {
            if let processed = result {
                results.append(processed)
            }

            // Add next task if available
            if let image = iterator.next() {
                group.addTask {
                    await self.processImage(image)
                }
            }
        }

        return results
    }
}
```

---

<!-- /ANCHOR:task-and-taskgroup -->
<!-- ANCHOR:actor-isolation -->
## 4. ACTOR ISOLATION

### Basic Actor

```swift
// Actor for thread-safe state
actor UserCache {
    private var users: [String: User] = [:]
    private var pendingRequests: [String: Task<User, Error>] = [:]

    func user(for id: String) async throws -> User {
        // Return cached if available
        if let cached = users[id] {
            return cached
        }

        // Coalesce concurrent requests
        if let pending = pendingRequests[id] {
            return try await pending.value
        }

        // Create new request
        let task = Task {
            try await fetchUserFromNetwork(id: id)
        }
        pendingRequests[id] = task

        do {
            let user = try await task.value
            users[id] = user
            pendingRequests[id] = nil
            return user
        } catch {
            pendingRequests[id] = nil
            throw error
        }
    }

    func cache(_ user: User) {
        users[user.id] = user
    }

    func clear() {
        users.removeAll()
        pendingRequests.values.forEach { $0.cancel() }
        pendingRequests.removeAll()
    }

    private func fetchUserFromNetwork(id: String) async throws -> User {
        // Network fetch implementation
        let url = URL(string: "https://api.example.com/users/\(id)")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(User.self, from: data)
    }
}

// Usage
let cache = UserCache()

Task {
    let user = try await cache.user(for: "123")
    print(user.name)
}
```

### @MainActor

```swift
// Class isolated to main actor
@MainActor
class ViewModel {
    var items: [Item] = []
    var isLoading = false
    var errorMessage: String?

    func loadItems() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Network call runs off main actor
            items = try await fetchItems()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private nonisolated func fetchItems() async throws -> [Item] {
        // This runs on cooperative pool, not main actor
        let url = URL(string: "https://api.example.com/items")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode([Item].self, from: data)
    }
}

// Updating UI from non-main context
func updateUI() async {
    let data = await processDataInBackground()

    await MainActor.run {
        self.label.text = data.description
        self.view.setNeedsLayout()
    }
}
```

### Global Actors

```swift
// Define custom global actor
@globalActor
actor DatabaseActor {
    static let shared = DatabaseActor()
}

// Use for database operations
@DatabaseActor
class DatabaseManager {
    private var connection: DatabaseConnection?

    func connect() async throws {
        connection = try await DatabaseConnection.open()
    }

    func execute(_ query: String) async throws -> [Row] {
        guard let connection else {
            throw DatabaseError.notConnected
        }
        return try await connection.execute(query)
    }
}

// Isolated function
@DatabaseActor
func performDatabaseOperation() async throws {
    let manager = DatabaseManager()
    try await manager.connect()
    let results = try await manager.execute("SELECT * FROM users")
    // Process results
}
```

### Sendable

```swift
// Value types are implicitly Sendable
struct UserDTO: Sendable {
    let id: String
    let name: String
    let email: String
}

// Classes must be explicitly marked
final class Configuration: Sendable {
    let apiURL: URL
    let timeout: TimeInterval

    init(apiURL: URL, timeout: TimeInterval) {
        self.apiURL = apiURL
        self.timeout = timeout
    }
}

// @unchecked for types that manage their own thread safety
final class ThreadSafeCache<Key: Hashable & Sendable, Value: Sendable>: @unchecked Sendable {
    private let lock = NSLock()
    private var storage: [Key: Value] = [:]

    subscript(key: Key) -> Value? {
        get {
            lock.lock()
            defer { lock.unlock() }
            return storage[key]
        }
        set {
            lock.lock()
            defer { lock.unlock() }
            storage[key] = newValue
        }
    }
}
```

---

<!-- /ANCHOR:actor-isolation -->
<!-- ANCHOR:asyncsequence-and-asyncstream -->
## 5. ASYNCSEQUENCE AND ASYNCSTREAM

### Basic AsyncSequence

```swift
// Iterating over async sequence
func processNotifications() async {
    let notifications = NotificationCenter.default.notifications(named: .userDidLogin)

    for await notification in notifications {
        guard let userInfo = notification.userInfo,
              let userId = userInfo["userId"] as? String else {
            continue
        }

        await handleUserLogin(userId: userId)
    }
}

// URL bytes async sequence
func downloadFile(from url: URL) async throws -> Data {
    var data = Data()

    let (bytes, response) = try await URLSession.shared.bytes(from: url)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw NetworkError.invalidResponse
    }

    for try await byte in bytes {
        data.append(byte)
    }

    return data
}
```

### Creating AsyncStream

```swift
// Basic AsyncStream
func countdown(from: Int) -> AsyncStream<Int> {
    AsyncStream { continuation in
        Task {
            for i in stride(from: from, through: 0, by: -1) {
                continuation.yield(i)
                try? await Task.sleep(for: .seconds(1))
            }
            continuation.finish()
        }
    }
}

// Usage
for await count in countdown(from: 5) {
    print(count)
}

// AsyncThrowingStream for operations that can fail
func fetchPaginatedData() -> AsyncThrowingStream<[Item], Error> {
    AsyncThrowingStream { continuation in
        Task {
            var page = 1
            var hasMore = true

            while hasMore {
                do {
                    let response = try await fetchPage(page)
                    continuation.yield(response.items)
                    hasMore = response.hasNextPage
                    page += 1
                } catch {
                    continuation.finish(throwing: error)
                    return
                }
            }

            continuation.finish()
        }
    }
}
```

### AsyncStream with Cancellation

```swift
class LocationManager {
    func locationUpdates() -> AsyncStream<CLLocation> {
        AsyncStream { continuation in
            let delegate = LocationDelegate()

            delegate.onLocationUpdate = { location in
                continuation.yield(location)
            }

            delegate.onError = { _ in
                continuation.finish()
            }

            continuation.onTermination = { @Sendable _ in
                // Clean up when stream is cancelled
                delegate.stopUpdates()
            }

            delegate.startUpdates()
        }
    }
}

// Usage with cancellation
func trackLocation() async {
    let manager = LocationManager()

    // This will be cancelled when task is cancelled
    for await location in manager.locationUpdates() {
        print("Location: \(location.coordinate)")

        if location.horizontalAccuracy < 10 {
            break // Stream automatically cleans up
        }
    }
}
```

### Custom AsyncSequence

```swift
struct ChunkedSequence<Base: AsyncSequence>: AsyncSequence {
    typealias Element = [Base.Element]

    let base: Base
    let chunkSize: Int

    struct AsyncIterator: AsyncIteratorProtocol {
        var baseIterator: Base.AsyncIterator
        let chunkSize: Int

        mutating func next() async throws -> [Base.Element]? {
            var chunk: [Base.Element] = []

            while chunk.count < chunkSize {
                guard let element = try await baseIterator.next() else {
                    return chunk.isEmpty ? nil : chunk
                }
                chunk.append(element)
            }

            return chunk
        }
    }

    func makeAsyncIterator() -> AsyncIterator {
        AsyncIterator(baseIterator: base.makeAsyncIterator(), chunkSize: chunkSize)
    }
}

extension AsyncSequence {
    func chunked(by size: Int) -> ChunkedSequence<Self> {
        ChunkedSequence(base: self, chunkSize: size)
    }
}

// Usage
for await chunk in someAsyncSequence.chunked(by: 10) {
    await processChunk(chunk)
}
```

---

<!-- /ANCHOR:asyncsequence-and-asyncstream -->
<!-- ANCHOR:error-handling -->
## 6. ERROR HANDLING

### Async Error Patterns

```swift
// Error types
enum NetworkError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(statusCode: Int)
    case decodingFailed(Error)
    case noData
    case timeout

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let code):
            return "HTTP error: \(code)"
        case .decodingFailed(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .noData:
            return "No data received"
        case .timeout:
            return "Request timed out"
        }
    }
}

// Result-based async function
func fetchUserSafely(id: String) async -> Result<User, NetworkError> {
    do {
        let user = try await fetchUser(id: id)
        return .success(user)
    } catch let error as NetworkError {
        return .failure(error)
    } catch {
        return .failure(.invalidResponse)
    }
}
```

### Retry with Exponential Backoff

```swift
func fetchWithExponentialBackoff<T>(
    maxAttempts: Int = 3,
    initialDelay: Duration = .seconds(1),
    maxDelay: Duration = .seconds(30),
    operation: () async throws -> T
) async throws -> T {
    var currentDelay = initialDelay
    var lastError: Error?

    for attempt in 1...maxAttempts {
        do {
            return try await operation()
        } catch {
            lastError = error

            // Don't retry on cancellation
            if error is CancellationError {
                throw error
            }

            // Don't delay after last attempt
            if attempt < maxAttempts {
                let jitter = Double.random(in: 0.8...1.2)
                let delaySeconds = min(
                    currentDelay.components.seconds,
                    maxDelay.components.seconds
                )
                try await Task.sleep(for: .seconds(Double(delaySeconds) * jitter))
                currentDelay = currentDelay * 2
            }
        }
    }

    throw lastError!
}
```

### Timeout Handling

```swift
func fetchWithTimeout<T>(
    timeout: Duration,
    operation: @escaping () async throws -> T
) async throws -> T {
    try await withThrowingTaskGroup(of: T.self) { group in
        // Add the actual operation
        group.addTask {
            try await operation()
        }

        // Add timeout task
        group.addTask {
            try await Task.sleep(for: timeout)
            throw NetworkError.timeout
        }

        // Return first result, cancel the other
        let result = try await group.next()!
        group.cancelAll()
        return result
    }
}

// Usage
let user = try await fetchWithTimeout(timeout: .seconds(10)) {
    try await fetchUser(id: "123")
}
```

### Graceful Degradation

```swift
func loadContentWithFallback() async -> Content {
    // Try primary source
    if let content = try? await fetchFromServer() {
        return content
    }

    // Try cache
    if let cached = try? await loadFromCache() {
        return cached
    }

    // Return default
    return Content.default
}

// Multiple fallbacks with async let
func loadUserProfile(id: String) async -> UserProfile {
    async let serverProfile = fetchProfileFromServer(id: id)
    async let cachedProfile = loadProfileFromCache(id: id)

    // Try server first, fall back to cache
    if let profile = try? await serverProfile {
        // Update cache in background
        Task {
            try? await saveProfileToCache(profile)
        }
        return profile
    }

    if let cached = try? await cachedProfile {
        return cached
    }

    return UserProfile.placeholder
}
```

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:combine-basics-legacy-interop -->
## 7. COMBINE BASICS (Legacy/Interop)

### Publisher Basics

```swift
import Combine

// Creating publishers
let just = Just("Hello")
let future = Future<String, Error> { promise in
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
        promise(.success("Completed"))
    }
}

// Common operators
let numbers = [1, 2, 3, 4, 5].publisher

numbers
    .map { $0 * 2 }
    .filter { $0 > 4 }
    .sink { value in
        print(value) // 6, 8, 10
    }

// Handling completion
numbers
    .sink(
        receiveCompletion: { completion in
            switch completion {
            case .finished:
                print("Completed")
            case .failure(let error):
                print("Error: \(error)")
            }
        },
        receiveValue: { value in
            print(value)
        }
    )
```

### Subjects

```swift
// PassthroughSubject - sends values as they arrive
let passthrough = PassthroughSubject<String, Never>()

let subscription = passthrough.sink { value in
    print("Received: \(value)")
}

passthrough.send("Hello")
passthrough.send("World")

// CurrentValueSubject - holds current value
let currentValue = CurrentValueSubject<Int, Never>(0)

print(currentValue.value) // 0

currentValue.sink { value in
    print("Current: \(value)")
}

currentValue.send(1) // Prints "Current: 1"
print(currentValue.value) // 1
```

### Converting Combine to Async/Await

```swift
extension Publisher where Failure == Never {
    var values: AsyncStream<Output> {
        AsyncStream { continuation in
            let cancellable = self.sink { value in
                continuation.yield(value)
            }

            continuation.onTermination = { _ in
                cancellable.cancel()
            }
        }
    }
}

extension Publisher {
    func firstValue() async throws -> Output {
        try await withCheckedThrowingContinuation { continuation in
            var cancellable: AnyCancellable?

            cancellable = first()
                .sink(
                    receiveCompletion: { completion in
                        switch completion {
                        case .finished:
                            break
                        case .failure(let error):
                            continuation.resume(throwing: error)
                        }
                        cancellable?.cancel()
                    },
                    receiveValue: { value in
                        continuation.resume(returning: value)
                    }
                )
        }
    }
}

// Usage
let publisher = somePublisher()
for await value in publisher.values {
    print(value)
}
```

### Common Combine Patterns

```swift
class SearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var results: [SearchResult] = []

    private var cancellables = Set<AnyCancellable>()

    init() {
        // Debounce search
        $searchText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .filter { !$0.isEmpty }
            .flatMap { query in
                self.search(query: query)
                    .catch { _ in Just([]) }
            }
            .receive(on: RunLoop.main)
            .assign(to: \.results, on: self)
            .store(in: &cancellables)
    }

    private func search(query: String) -> AnyPublisher<[SearchResult], Error> {
        // Return publisher for search results
        URLSession.shared.dataTaskPublisher(for: searchURL(query))
            .map(\.data)
            .decode(type: [SearchResult].self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
}
```

---

<!-- /ANCHOR:combine-basics-legacy-interop -->
<!-- ANCHOR:practical-patterns -->
## 8. PRACTICAL PATTERNS

### Network Layer with Async/Await

```swift
protocol NetworkClientProtocol {
    func request<T: Decodable>(
        endpoint: Endpoint,
        method: HTTPMethod,
        body: Encodable?
    ) async throws -> T
}

class NetworkClient: NetworkClientProtocol {
    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder

    init(
        session: URLSession = .shared,
        decoder: JSONDecoder = JSONDecoder(),
        encoder: JSONEncoder = JSONEncoder()
    ) {
        self.session = session
        self.decoder = decoder
        self.encoder = encoder
    }

    func request<T: Decodable>(
        endpoint: Endpoint,
        method: HTTPMethod = .get,
        body: Encodable? = nil
    ) async throws -> T {
        var request = URLRequest(url: endpoint.url)
        request.httpMethod = method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let body {
            request.httpBody = try encoder.encode(body)
        }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.httpError(statusCode: httpResponse.statusCode)
        }

        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw NetworkError.decodingFailed(error)
        }
    }
}
```

### Background Task Coordination

```swift
class DataSyncManager {
    private var syncTask: Task<Void, Never>?
    private let syncInterval: Duration = .minutes(15)

    func startPeriodicSync() {
        syncTask?.cancel()

        syncTask = Task {
            while !Task.isCancelled {
                await performSync()

                do {
                    try await Task.sleep(for: syncInterval)
                } catch {
                    break // Task was cancelled
                }
            }
        }
    }

    func stopPeriodicSync() {
        syncTask?.cancel()
        syncTask = nil
    }

    private func performSync() async {
        // Perform parallel sync operations
        async let userSync = syncUsers()
        async let dataSync = syncData()
        async let settingsSync = syncSettings()

        // Wait for all to complete
        _ = await (userSync, dataSync, settingsSync)
    }

    private func syncUsers() async { /* ... */ }
    private func syncData() async { /* ... */ }
    private func syncSettings() async { /* ... */ }
}
```

### Progress Reporting

```swift
func downloadWithProgress(
    url: URL,
    progressHandler: @escaping (Double) -> Void
) -> AsyncThrowingStream<Data, Error> {
    AsyncThrowingStream { continuation in
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error {
                continuation.finish(throwing: error)
                return
            }

            if let data {
                continuation.yield(data)
            }

            continuation.finish()
        }

        // Observe progress
        let observation = task.progress.observe(\.fractionCompleted) { progress, _ in
            progressHandler(progress.fractionCompleted)
        }

        continuation.onTermination = { _ in
            observation.invalidate()
            task.cancel()
        }

        task.resume()
    }
}

// Usage
@MainActor
class DownloadViewModel {
    var progress: Double = 0
    var downloadedData: Data?

    func download(from url: URL) async {
        do {
            for try await data in downloadWithProgress(url: url) { [weak self] progress in
                Task { @MainActor in
                    self?.progress = progress
                }
            } {
                downloadedData = data
            }
        } catch {
            print("Download failed: \(error)")
        }
    }
}
```

---

<!-- /ANCHOR:practical-patterns -->
<!-- ANCHOR:rules -->
## 9. RULES

### ✅ ALWAYS

1. **Use async/await over completion handlers** - Cleaner, more readable code
2. **Check for cancellation in long operations** - `Task.checkCancellation()`
3. **Use structured concurrency** - async let, TaskGroup over detached tasks
4. **Handle errors appropriately** - Don't swallow errors silently
5. **Use actors for shared mutable state** - Prevents data races
6. **Mark UI updates with @MainActor** - Ensures main thread execution
7. **Cancel tasks when views disappear** - Prevent resource leaks
8. **Use withTaskGroup for parallel operations** - Better than multiple Tasks
9. **Resume continuations exactly once** - Critical for withCheckedContinuation
10. **Use Sendable for cross-actor types** - Ensures thread safety

### ❌ NEVER

1. **Force unwrap Task.value** - Always handle potential errors
2. **Ignore CancellationError** - Propagate or handle explicitly
3. **Use detached tasks without good reason** - Loses context and priority
4. **Perform UI updates off main actor** - Causes crashes or undefined behavior
5. **Create unbounded TaskGroups** - Limit concurrency when appropriate
6. **Block threads with semaphores in async code** - Defeats purpose of async
7. **Mix old completion handlers with async/await carelessly** - Use continuations
8. **Forget to store Combine subscriptions** - Leads to immediate cancellation
9. **Use global actors for everything** - Only when truly needed
10. **Ignore actor reentrancy** - Be aware of suspension points

### ⚠️ ESCALATE IF

1. **Complex concurrency patterns needed** - Multi-actor coordination
2. **Performance issues with async code** - May need optimization
3. **Legacy code migration** - Completion handlers to async/await
4. **Real-time requirements** - May need different approaches

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

| File | Purpose |
|------|---------|
| [swift_standards.md](./swift_standards.md) | Swift project structure and naming conventions |
| [swiftui_patterns.md](./swiftui_patterns.md) | SwiftUI view composition and state management |
| [mvvm_architecture.md](./mvvm_architecture.md) | MVVM architecture patterns with SwiftUI |
| [testing_strategy.md](./testing_strategy.md) | XCTest and testing best practices |
| [persistence_patterns.md](./persistence_patterns.md) | SwiftData, Core Data, and storage patterns |
<!-- /ANCHOR:related-resources -->
