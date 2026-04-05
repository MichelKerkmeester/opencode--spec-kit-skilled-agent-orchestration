---
title: Persistence Patterns
description: A comprehensive guide to data persistence in iOS including SwiftData for iOS 17+, Core Data patterns for legacy code, UserDefaults, Keychain access, file system operations, and CloudKit integration basics.
---

# Persistence Patterns

A comprehensive guide to data persistence in iOS including SwiftData for iOS 17+, Core Data patterns for legacy code, UserDefaults, Keychain access, file system operations, and CloudKit integration basics.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on data persistence including:

- **SwiftData** - Modern persistence framework (iOS 17+)
- **Core Data** - Legacy persistence patterns
- **UserDefaults** - Simple key-value storage
- **Keychain** - Secure credential storage
- **File system** - Document and cache storage
- **CloudKit** - Cloud synchronization basics

### When to Use

| Storage Type | Use Case |
|-------------|----------|
| SwiftData | Structured data, relationships (iOS 17+) |
| Core Data | Structured data, legacy apps |
| UserDefaults | App settings, small data |
| Keychain | Passwords, tokens, secrets |
| File System | Documents, images, large files |
| CloudKit | Cross-device sync, sharing |

### Core Principle

Choose the right storage for the data type + handle errors gracefully + maintain data integrity.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:swiftdata-ios-17 -->
## 2. SWIFTDATA (iOS 17+)

### Basic Model Definition

```swift
import SwiftData

@Model
class User {
    @Attribute(.unique) var id: String
    var name: String
    var email: String
    var createdAt: Date

    // Relationships
    @Relationship(deleteRule: .cascade)
    var posts: [Post] = []

    @Relationship(inverse: \Organization.members)
    var organization: Organization?

    init(id: String = UUID().uuidString, name: String, email: String) {
        self.id = id
        self.name = name
        self.email = email
        self.createdAt = Date()
    }
}

@Model
class Post {
    var id: String
    var title: String
    var content: String
    var publishedAt: Date?
    var isDraft: Bool

    // Inverse relationship
    var author: User?

    init(title: String, content: String, isDraft: Bool = true) {
        self.id = UUID().uuidString
        self.title = title
        self.content = content
        self.isDraft = isDraft
    }
}

@Model
class Organization {
    var id: String
    var name: String

    @Relationship
    var members: [User] = []

    init(name: String) {
        self.id = UUID().uuidString
        self.name = name
    }
}
```

### Model Container Setup

```swift
import SwiftUI
import SwiftData

@main
struct MyApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([
            User.self,
            Post.self,
            Organization.self
        ])

        let modelConfiguration = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: false,
            allowsSave: true
        )

        do {
            return try ModelContainer(
                for: schema,
                configurations: [modelConfiguration]
            )
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(sharedModelContainer)
    }
}

// For previews and testing
extension ModelContainer {
    static var preview: ModelContainer {
        let schema = Schema([User.self, Post.self])
        let configuration = ModelConfiguration(isStoredInMemoryOnly: true)

        do {
            let container = try ModelContainer(for: schema, configurations: [configuration])

            // Seed preview data
            let context = container.mainContext
            let user = User(name: "Preview User", email: "preview@example.com")
            context.insert(user)

            return container
        } catch {
            fatalError("Failed to create preview container: \(error)")
        }
    }
}
```

### CRUD Operations

```swift
struct UserListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \User.name) private var users: [User]

    var body: some View {
        List {
            ForEach(users) { user in
                UserRow(user: user)
            }
            .onDelete(perform: deleteUsers)
        }
        .toolbar {
            Button("Add User", action: addUser)
        }
    }

    private func addUser() {
        let user = User(name: "New User", email: "new@example.com")
        modelContext.insert(user)
    }

    private func deleteUsers(offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(users[index])
        }
    }
}

// Update operations
struct UserDetailView: View {
    @Bindable var user: User

    var body: some View {
        Form {
            TextField("Name", text: $user.name)
            TextField("Email", text: $user.email)
        }
        // Changes are automatically persisted
    }
}
```

### Advanced Queries

```swift
// Basic query with sorting
@Query(sort: \User.name, order: .forward)
private var users: [User]

// Query with predicate
@Query(filter: #Predicate<User> { user in
    user.name.contains("John")
})
private var filteredUsers: [User]

// Complex predicate
@Query(filter: #Predicate<Post> { post in
    !post.isDraft && post.publishedAt != nil
}, sort: \Post.publishedAt, order: .reverse)
private var publishedPosts: [Post]

// Dynamic queries
struct SearchableUserList: View {
    @State private var searchText = ""

    var body: some View {
        UserListContent(searchText: searchText)
            .searchable(text: $searchText)
    }
}

struct UserListContent: View {
    @Query private var users: [User]

    init(searchText: String) {
        let predicate = #Predicate<User> { user in
            searchText.isEmpty || user.name.localizedStandardContains(searchText)
        }
        _users = Query(filter: predicate, sort: \User.name)
    }

    var body: some View {
        List(users) { user in
            Text(user.name)
        }
    }
}
```

### ModelContext Operations

```swift
class UserService {
    private let modelContext: ModelContext

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
    }

    func createUser(name: String, email: String) throws -> User {
        let user = User(name: name, email: email)
        modelContext.insert(user)
        try modelContext.save()
        return user
    }

    func fetchUser(id: String) throws -> User? {
        let predicate = #Predicate<User> { user in
            user.id == id
        }
        let descriptor = FetchDescriptor<User>(predicate: predicate)
        let results = try modelContext.fetch(descriptor)
        return results.first
    }

    func fetchAllUsers(limit: Int? = nil) throws -> [User] {
        var descriptor = FetchDescriptor<User>(sortBy: [SortDescriptor(\.name)])
        descriptor.fetchLimit = limit
        return try modelContext.fetch(descriptor)
    }

    func updateUser(_ user: User, name: String?, email: String?) throws {
        if let name { user.name = name }
        if let email { user.email = email }
        try modelContext.save()
    }

    func deleteUser(_ user: User) throws {
        modelContext.delete(user)
        try modelContext.save()
    }

    func deleteAllUsers() throws {
        try modelContext.delete(model: User.self)
        try modelContext.save()
    }
}
```

### Background Context

```swift
actor BackgroundDataHandler {
    private let modelContainer: ModelContainer

    init(modelContainer: ModelContainer) {
        self.modelContainer = modelContainer
    }

    func importUsers(_ userData: [UserDTO]) async throws {
        let context = ModelContext(modelContainer)

        for dto in userData {
            let user = User(id: dto.id, name: dto.name, email: dto.email)
            context.insert(user)
        }

        try context.save()
    }

    func performBatchUpdate() async throws {
        let context = ModelContext(modelContainer)

        let descriptor = FetchDescriptor<User>()
        let users = try context.fetch(descriptor)

        for user in users {
            user.name = user.name.capitalized
        }

        try context.save()
    }
}

// Usage
struct ContentView: View {
    @Environment(\.modelContext) private var modelContext

    var body: some View {
        Button("Import Data") {
            Task {
                let handler = BackgroundDataHandler(
                    modelContainer: modelContext.container
                )
                try await handler.importUsers(fetchedData)
            }
        }
    }
}
```

---

<!-- /ANCHOR:swiftdata-ios-17 -->
<!-- ANCHOR:core-data-legacy -->
## 3. CORE DATA (Legacy)

### Model Setup

```swift
import CoreData

// NSManagedObject subclass
@objc(CDUser)
public class CDUser: NSManagedObject {
    @NSManaged public var id: String
    @NSManaged public var name: String
    @NSManaged public var email: String
    @NSManaged public var createdAt: Date
    @NSManaged public var posts: NSSet?
}

// Extension for convenience
extension CDUser {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<CDUser> {
        return NSFetchRequest<CDUser>(entityName: "CDUser")
    }

    var postsArray: [CDPost] {
        let set = posts as? Set<CDPost> ?? []
        return Array(set)
    }
}
```

### Persistence Controller

```swift
class PersistenceController {
    static let shared = PersistenceController()

    static var preview: PersistenceController = {
        let controller = PersistenceController(inMemory: true)
        let viewContext = controller.container.viewContext

        // Create preview data
        let user = CDUser(context: viewContext)
        user.id = UUID().uuidString
        user.name = "Preview User"
        user.email = "preview@example.com"
        user.createdAt = Date()

        try? viewContext.save()
        return controller
    }()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "MyApp")

        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        }

        container.loadPersistentStores { description, error in
            if let error = error as NSError? {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        }

        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }

    func save() {
        let context = container.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                let nsError = error as NSError
                print("Unresolved error \(nsError), \(nsError.userInfo)")
            }
        }
    }

    func newBackgroundContext() -> NSManagedObjectContext {
        let context = container.newBackgroundContext()
        context.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
        return context
    }
}
```

### Core Data Operations

```swift
class CoreDataUserRepository {
    private let persistenceController: PersistenceController
    private var viewContext: NSManagedObjectContext {
        persistenceController.container.viewContext
    }

    init(persistenceController: PersistenceController = .shared) {
        self.persistenceController = persistenceController
    }

    func create(name: String, email: String) throws -> CDUser {
        let user = CDUser(context: viewContext)
        user.id = UUID().uuidString
        user.name = name
        user.email = email
        user.createdAt = Date()

        try viewContext.save()
        return user
    }

    func fetchAll() throws -> [CDUser] {
        let request = CDUser.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \CDUser.name, ascending: true)]
        return try viewContext.fetch(request)
    }

    func fetch(id: String) throws -> CDUser? {
        let request = CDUser.fetchRequest()
        request.predicate = NSPredicate(format: "id == %@", id)
        request.fetchLimit = 1
        return try viewContext.fetch(request).first
    }

    func update(_ user: CDUser) throws {
        try viewContext.save()
    }

    func delete(_ user: CDUser) throws {
        viewContext.delete(user)
        try viewContext.save()
    }

    // Background operations
    func importInBackground(_ data: [UserDTO]) async throws {
        let context = persistenceController.newBackgroundContext()

        try await context.perform {
            for dto in data {
                let user = CDUser(context: context)
                user.id = dto.id
                user.name = dto.name
                user.email = dto.email
                user.createdAt = Date()
            }

            try context.save()
        }
    }
}
```

### FetchedResultsController with SwiftUI

```swift
class UserListViewModel: NSObject, ObservableObject {
    @Published var users: [CDUser] = []

    private let fetchedResultsController: NSFetchedResultsController<CDUser>
    private let context: NSManagedObjectContext

    init(context: NSManagedObjectContext) {
        self.context = context

        let request = CDUser.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \CDUser.name, ascending: true)]

        fetchedResultsController = NSFetchedResultsController(
            fetchRequest: request,
            managedObjectContext: context,
            sectionNameKeyPath: nil,
            cacheName: nil
        )

        super.init()

        fetchedResultsController.delegate = self
        try? fetchedResultsController.performFetch()
        users = fetchedResultsController.fetchedObjects ?? []
    }
}

extension UserListViewModel: NSFetchedResultsControllerDelegate {
    func controllerDidChangeContent(_ controller: NSFetchedResultsController<NSFetchRequestResult>) {
        users = fetchedResultsController.fetchedObjects ?? []
    }
}
```

---

<!-- /ANCHOR:core-data-legacy -->
<!-- ANCHOR:userdefaults -->
## 4. USERDEFAULTS

### Basic Usage

```swift
// Simple values
UserDefaults.standard.set("John", forKey: "username")
let username = UserDefaults.standard.string(forKey: "username")

UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
let completed = UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")

UserDefaults.standard.set(25, forKey: "userAge")
let age = UserDefaults.standard.integer(forKey: "userAge")

// Remove value
UserDefaults.standard.removeObject(forKey: "username")
```

### Property Wrapper

```swift
@propertyWrapper
struct UserDefault<Value> {
    let key: String
    let defaultValue: Value
    let container: UserDefaults

    init(
        key: String,
        defaultValue: Value,
        container: UserDefaults = .standard
    ) {
        self.key = key
        self.defaultValue = defaultValue
        self.container = container
    }

    var wrappedValue: Value {
        get {
            container.object(forKey: key) as? Value ?? defaultValue
        }
        set {
            container.set(newValue, forKey: key)
        }
    }
}

// For Codable types
@propertyWrapper
struct CodableUserDefault<Value: Codable> {
    let key: String
    let defaultValue: Value
    let container: UserDefaults

    init(
        key: String,
        defaultValue: Value,
        container: UserDefaults = .standard
    ) {
        self.key = key
        self.defaultValue = defaultValue
        self.container = container
    }

    var wrappedValue: Value {
        get {
            guard let data = container.data(forKey: key),
                  let value = try? JSONDecoder().decode(Value.self, from: data) else {
                return defaultValue
            }
            return value
        }
        set {
            if let data = try? JSONEncoder().encode(newValue) {
                container.set(data, forKey: key)
            }
        }
    }
}
```

### Settings Manager

```swift
@Observable
class AppSettings {
    static let shared = AppSettings()

    @UserDefault(key: "theme", defaultValue: "system")
    var theme: String

    @UserDefault(key: "notificationsEnabled", defaultValue: true)
    var notificationsEnabled: Bool

    @UserDefault(key: "fontSize", defaultValue: 16.0)
    var fontSize: Double

    @CodableUserDefault(key: "recentSearches", defaultValue: [])
    var recentSearches: [String]

    @CodableUserDefault(key: "lastSyncDate", defaultValue: nil)
    var lastSyncDate: Date?

    private init() { }

    func reset() {
        theme = "system"
        notificationsEnabled = true
        fontSize = 16.0
        recentSearches = []
        lastSyncDate = nil
    }
}

// SwiftUI integration with @AppStorage
struct SettingsView: View {
    @AppStorage("username") private var username = ""
    @AppStorage("showNotifications") private var showNotifications = true
    @AppStorage("fontSize") private var fontSize = 16.0

    var body: some View {
        Form {
            TextField("Username", text: $username)
            Toggle("Notifications", isOn: $showNotifications)
            Slider(value: $fontSize, in: 12...24, step: 1) {
                Text("Font Size: \(Int(fontSize))")
            }
        }
    }
}
```

---

<!-- /ANCHOR:userdefaults -->
<!-- ANCHOR:keychain -->
## 5. KEYCHAIN

### Keychain Wrapper

```swift
import Security

enum KeychainError: Error {
    case duplicateEntry
    case noData
    case unexpectedStatus(OSStatus)
    case encodingFailed
    case decodingFailed
}

class KeychainManager {
    static let shared = KeychainManager()

    private let service: String

    init(service: String = Bundle.main.bundleIdentifier ?? "com.myapp") {
        self.service = service
    }

    // MARK: - String Operations

    func save(_ value: String, for key: String) throws {
        guard let data = value.data(using: .utf8) else {
            throw KeychainError.encodingFailed
        }
        try save(data, for: key)
    }

    func getString(for key: String) throws -> String? {
        guard let data = try getData(for: key) else {
            return nil
        }
        return String(data: data, encoding: .utf8)
    }

    // MARK: - Data Operations

    func save(_ data: Data, for key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]

        // Delete existing item
        SecItemDelete(query as CFDictionary)

        let status = SecItemAdd(query as CFDictionary, nil)

        guard status == errSecSuccess else {
            throw KeychainError.unexpectedStatus(status)
        }
    }

    func getData(for key: String) throws -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        switch status {
        case errSecSuccess:
            return result as? Data
        case errSecItemNotFound:
            return nil
        default:
            throw KeychainError.unexpectedStatus(status)
        }
    }

    func delete(key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]

        let status = SecItemDelete(query as CFDictionary)

        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.unexpectedStatus(status)
        }
    }

    // MARK: - Codable Operations

    func save<T: Codable>(_ value: T, for key: String) throws {
        let data = try JSONEncoder().encode(value)
        try save(data, for: key)
    }

    func get<T: Codable>(_ type: T.Type, for key: String) throws -> T? {
        guard let data = try getData(for: key) else {
            return nil
        }
        return try JSONDecoder().decode(type, from: data)
    }
}
```

### Secure Credentials Storage

```swift
struct Credentials: Codable {
    let accessToken: String
    let refreshToken: String
    let expiresAt: Date
}

class AuthTokenManager {
    private let keychain = KeychainManager.shared
    private let credentialsKey = "auth_credentials"

    func saveCredentials(_ credentials: Credentials) throws {
        try keychain.save(credentials, for: credentialsKey)
    }

    func getCredentials() throws -> Credentials? {
        try keychain.get(Credentials.self, for: credentialsKey)
    }

    func clearCredentials() throws {
        try keychain.delete(key: credentialsKey)
    }

    var isAuthenticated: Bool {
        guard let credentials = try? getCredentials() else {
            return false
        }
        return credentials.expiresAt > Date()
    }
}
```

---

<!-- /ANCHOR:keychain -->
<!-- ANCHOR:file-system -->
## 6. FILE SYSTEM

### File Manager Operations

```swift
class FileStorageManager {
    static let shared = FileStorageManager()

    // Directory URLs
    var documentsDirectory: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    var cachesDirectory: URL {
        FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
    }

    var temporaryDirectory: URL {
        FileManager.default.temporaryDirectory
    }

    // MARK: - Save Operations

    func save(_ data: Data, to filename: String, in directory: URL? = nil) throws -> URL {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)

        try data.write(to: fileURL)
        return fileURL
    }

    func save<T: Codable>(_ object: T, to filename: String, in directory: URL? = nil) throws -> URL {
        let data = try JSONEncoder().encode(object)
        return try save(data, to: filename, in: directory)
    }

    func saveImage(_ image: UIImage, to filename: String, quality: CGFloat = 0.8) throws -> URL {
        guard let data = image.jpegData(compressionQuality: quality) else {
            throw FileError.encodingFailed
        }
        return try save(data, to: filename)
    }

    // MARK: - Load Operations

    func load(from filename: String, in directory: URL? = nil) throws -> Data {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)
        return try Data(contentsOf: fileURL)
    }

    func load<T: Codable>(_ type: T.Type, from filename: String, in directory: URL? = nil) throws -> T {
        let data = try load(from: filename, in: directory)
        return try JSONDecoder().decode(type, from: data)
    }

    func loadImage(from filename: String) throws -> UIImage {
        let data = try load(from: filename)
        guard let image = UIImage(data: data) else {
            throw FileError.decodingFailed
        }
        return image
    }

    // MARK: - Delete Operations

    func delete(_ filename: String, in directory: URL? = nil) throws {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)
        try FileManager.default.removeItem(at: fileURL)
    }

    func clearDirectory(_ directory: URL) throws {
        let contents = try FileManager.default.contentsOfDirectory(
            at: directory,
            includingPropertiesForKeys: nil
        )
        for file in contents {
            try FileManager.default.removeItem(at: file)
        }
    }

    // MARK: - Utility

    func fileExists(_ filename: String, in directory: URL? = nil) -> Bool {
        let dir = directory ?? documentsDirectory
        let fileURL = dir.appendingPathComponent(filename)
        return FileManager.default.fileExists(atPath: fileURL.path)
    }

    func createDirectory(at url: URL) throws {
        try FileManager.default.createDirectory(
            at: url,
            withIntermediateDirectories: true,
            attributes: nil
        )
    }
}

enum FileError: Error {
    case encodingFailed
    case decodingFailed
    case fileNotFound
}
```

### Image Cache

```swift
actor ImageCache {
    static let shared = ImageCache()

    private var memoryCache: [String: UIImage] = [:]
    private let fileManager = FileStorageManager.shared
    private let cacheDirectory: URL

    init() {
        cacheDirectory = fileManager.cachesDirectory.appendingPathComponent("images")
        try? fileManager.createDirectory(at: cacheDirectory)
    }

    func image(for key: String) async -> UIImage? {
        // Check memory cache
        if let cached = memoryCache[key] {
            return cached
        }

        // Check disk cache
        let filename = key.addingPercentEncoding(withAllowedCharacters: .alphanumerics) ?? key
        if let image = try? fileManager.loadImage(from: filename) {
            memoryCache[key] = image
            return image
        }

        return nil
    }

    func cache(_ image: UIImage, for key: String) async {
        memoryCache[key] = image

        let filename = key.addingPercentEncoding(withAllowedCharacters: .alphanumerics) ?? key
        try? fileManager.saveImage(image, to: filename)
    }

    func clearMemoryCache() {
        memoryCache.removeAll()
    }

    func clearAllCache() async throws {
        memoryCache.removeAll()
        try fileManager.clearDirectory(cacheDirectory)
    }
}
```

---

<!-- /ANCHOR:file-system -->
<!-- ANCHOR:cloudkit-basics -->
## 7. CLOUDKIT BASICS

### CloudKit Setup

```swift
import CloudKit

class CloudKitManager {
    static let shared = CloudKitManager()

    private let container: CKContainer
    private let privateDatabase: CKDatabase
    private let publicDatabase: CKDatabase

    init() {
        container = CKContainer.default()
        privateDatabase = container.privateCloudDatabase
        publicDatabase = container.publicCloudDatabase
    }

    // MARK: - Account Status

    func checkAccountStatus() async throws -> CKAccountStatus {
        try await container.accountStatus()
    }

    // MARK: - Save Record

    func save(_ record: CKRecord, to database: CKDatabase? = nil) async throws -> CKRecord {
        let db = database ?? privateDatabase
        return try await db.save(record)
    }

    // MARK: - Fetch Record

    func fetch(recordID: CKRecord.ID, from database: CKDatabase? = nil) async throws -> CKRecord {
        let db = database ?? privateDatabase
        return try await db.record(for: recordID)
    }

    // MARK: - Query Records

    func query(
        recordType: String,
        predicate: NSPredicate = NSPredicate(value: true),
        sortDescriptors: [NSSortDescriptor]? = nil,
        from database: CKDatabase? = nil
    ) async throws -> [CKRecord] {
        let db = database ?? privateDatabase
        let query = CKQuery(recordType: recordType, predicate: predicate)
        query.sortDescriptors = sortDescriptors

        let (results, _) = try await db.records(matching: query)
        return results.compactMap { try? $0.1.get() }
    }

    // MARK: - Delete Record

    func delete(recordID: CKRecord.ID, from database: CKDatabase? = nil) async throws {
        let db = database ?? privateDatabase
        try await db.deleteRecord(withID: recordID)
    }
}
```

### CloudKit Sync Service

```swift
class CloudSyncService {
    private let cloudKit = CloudKitManager.shared
    private let recordType = "UserItem"

    // Convert local model to CKRecord
    func createRecord(from item: UserItem) -> CKRecord {
        let recordID = CKRecord.ID(recordName: item.id)
        let record = CKRecord(recordType: recordType, recordID: recordID)

        record["name"] = item.name as CKRecordValue
        record["description"] = item.description as CKRecordValue
        record["createdAt"] = item.createdAt as CKRecordValue
        record["isCompleted"] = item.isCompleted as CKRecordValue

        return record
    }

    // Convert CKRecord to local model
    func createItem(from record: CKRecord) -> UserItem? {
        guard let name = record["name"] as? String,
              let description = record["description"] as? String,
              let createdAt = record["createdAt"] as? Date,
              let isCompleted = record["isCompleted"] as? Bool else {
            return nil
        }

        return UserItem(
            id: record.recordID.recordName,
            name: name,
            description: description,
            createdAt: createdAt,
            isCompleted: isCompleted
        )
    }

    // Sync operations
    func upload(_ item: UserItem) async throws {
        let record = createRecord(from: item)
        _ = try await cloudKit.save(record)
    }

    func fetchAll() async throws -> [UserItem] {
        let records = try await cloudKit.query(recordType: recordType)
        return records.compactMap { createItem(from: $0) }
    }

    func delete(_ item: UserItem) async throws {
        let recordID = CKRecord.ID(recordName: item.id)
        try await cloudKit.delete(recordID: recordID)
    }
}

struct UserItem: Identifiable {
    let id: String
    var name: String
    var description: String
    var createdAt: Date
    var isCompleted: Bool
}
```

---

<!-- /ANCHOR:cloudkit-basics -->
<!-- ANCHOR:rules -->
## 8. RULES

### ✅ ALWAYS

1. **Choose appropriate storage** - Match storage type to data needs
2. **Handle errors gracefully** - Never crash on storage failures
3. **Use background contexts** - For large data operations
4. **Encrypt sensitive data** - Use Keychain for credentials
5. **Clean up caches** - Implement cache eviction policies
6. **Validate data integrity** - Check data before and after storage
7. **Use migrations** - Plan for schema changes
8. **Test persistence** - Include storage in test coverage
9. **Consider offline first** - Cache for offline access
10. **Monitor storage usage** - Respect device storage limits

### ❌ NEVER

1. **Store passwords in UserDefaults** - Use Keychain instead
2. **Block main thread** - Use async/background operations
3. **Ignore CoreData context threading** - Use appropriate contexts
4. **Skip data validation** - Validate before persisting
5. **Hardcode file paths** - Use system-provided directories
6. **Store large data in UserDefaults** - Use file system or database
7. **Forget to save context** - Ensure changes are persisted
8. **Mix sync and async carelessly** - Maintain consistency
9. **Ignore CloudKit quotas** - Monitor usage limits
10. **Skip error handling** - Storage can fail

### ⚠️ ESCALATE IF

1. **Schema migration complexity** - Plan migrations carefully
2. **Data corruption detected** - Investigate root cause
3. **Performance issues** - May need indexing or optimization
4. **Sync conflicts** - Need conflict resolution strategy

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

| File | Purpose |
|------|---------|
| [swift_standards.md](./swift_standards.md) | Swift project structure and naming conventions |
| [swiftui_patterns.md](./swiftui_patterns.md) | SwiftUI view composition and state management |
| [mvvm_architecture.md](./mvvm_architecture.md) | MVVM architecture patterns with SwiftUI |
| [async_patterns.md](./async_patterns.md) | Swift concurrency and async/await patterns |
| [testing_strategy.md](./testing_strategy.md) | XCTest and testing best practices |
<!-- /ANCHOR:related-resources -->
