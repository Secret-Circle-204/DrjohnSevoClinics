# Clinic Project Constitution

> **Purpose:** This document is the mandatory engineering constitution for the Clinic Project.
> All AI agents and developers working on the project must follow these rules before, during, and after implementation.

---

# 1. Project Engineering Philosophy

The Clinic Project must be built as a clean, maintainable, production-ready system.

The goal is not to produce the fastest possible implementation.

The goal is to produce an implementation that is:

- Maintainable
- Reliable
- Secure
- Performant
- Type-safe
- Structured
- Scalable
- Easy to understand
- Easy to extend
- Free from unnecessary technical debt

The project must remain intentionally simple.

The architecture must not introduce unnecessary layers, domains, services, adapters, abstractions, or infrastructure when the project does not require them.

---

# 2. Project Architecture

The project uses a deliberately simple architecture:

```text
                    CLINIC PROJECT
                          |
            +-------------+-------------+
            |                           |
        NEXT.JS                      PAYLOAD
        Frontend                 Backend / Admin
            |                           |
            +-------------+-------------+
                          |
                    REPOSITORY LAYER
                          |
                      POSTGRESQL
```

## Core Stack

- **Next.js** — Frontend application
- **React** — UI component architecture
- **TypeScript** — Primary development language
- **Payload** — Backend and administration infrastructure
- **PostgreSQL** — Primary database

The architecture must remain centered around these technologies.

### Explicitly Avoid

Do not introduce:

- Microservices
- Multiple backend applications
- Separate domain servers
- Unnecessary service boundaries
- Unnecessary adapters
- Unnecessary infrastructure layers
- Complex enterprise architecture patterns
- Duplicate repository systems
- Duplicate API/data-access layers

Unless a real project requirement proves that such complexity is necessary.

---

# 3. Layer Structure

The project should follow a simple and clear flow:

```text
PostgreSQL
    |
Payload
    |
Repository Boundary
    |
Next.js Server/Application Code
    |
UI Components
```

The **Repository Layer** is the organized data-access boundary between the application and the backend/data infrastructure.

Repositories should be grouped by responsibility.

Example:

```text
repositories/
├── clients/
├── appointments/
├── consultations/
├── reports/
├── blog/
├── media/
├── clinic/
├── contact/
└── users/
```

Do not create a repository for every tiny operation.

Create repositories around meaningful data responsibilities.

---

# 4. No Patchwork / No Technical Band-Aids

Patchwork is strictly prohibited.

Do not solve a problem by adding:

- Random conditionals
- Temporary flags
- Duplicate logic
- Special-case branches
- Unnecessary wrappers
- Unrelated helpers
- Quick fixes that bypass the existing architecture
- Local workarounds that hide the real cause

Before changing code:

1. Identify the real problem.
2. Identify its owner.
3. Trace the complete data/control flow.
4. Determine the root cause.
5. Fix the root cause at the correct architectural layer.

A fix must solve the problem at its source rather than hide its symptoms.

---

# 5. Strict Non-Duplication Rule

Before creating any new:

- File
- Folder
- Function
- Service
- Repository
- Helper
- Hook
- Component
- Query
- DTO
- Mapper
- Utility
- Validation
- Data-access abstraction

the existing project must be inspected to determine whether an equivalent implementation already exists.

## Rule

> **Reuse and extend existing architecture before creating parallel structures.**

No duplicate implementation of the same responsibility is allowed.

Examples:

```text
Existing repository
        |
        +---- Extend it

NOT

Existing repository
        |
        +---- Create another repository
```

If an existing abstraction is incomplete, improve it.

Do not create a second abstraction simply because it is easier.

---

# 6. Single Source of Truth

Every business rule must have one authoritative owner.

The same rule must not be independently implemented in:

- UI components
- Pages
- API routes
- Hooks
- Repository code
- Payload hooks
- Server actions
- Utility functions

The rule must live in one appropriate place and be reused.

Examples include:

- Appointment status transitions
- Client access rules
- Data validation rules
- Report ownership
- Appointment calculations
- Notification rules
- Cache invalidation rules

---

# 7. No Hardcoded Business Data

Hardcoded business data is strictly prohibited.

Do not embed real project data directly inside source code.

Examples of prohibited hardcoding:

```ts
const clinicName = "Example Dental Clinic";
const phone = "01000000000";
const openingHours = "9:00 - 17:00";
const services = [...]
```

if those values belong to configurable project content.

Such information must come from the appropriate backend data source.

The same applies to:

- Clinic information
- Services
- Blog content
- YouTube content
- Contact information
- Opening hours
- Client records
- Appointments
- Reports
- Configurable SEO content
- Business rules

---

# 8. Mock Data Is Forbidden

**Mock data must never be used in the application.**

Do not create fake records merely to make a page look complete.

Forbidden examples:

```ts
const clients = [{ name: "John Doe" }, { name: "Jane Doe" }];
```

or fake:

- Appointments
- Clients
- Reports
- Consultations
- Blog posts
- Testimonials
- Clinic information
- Statistics
- Dashboard records

If real data does not exist, the correct behavior is to represent the actual empty state.

```text
No Data
```

not:

```text
Fake Data
```

A missing data source is a real implementation problem and must not be hidden with mock content.

---

# 9. No Fake Fallbacks

Fallbacks that hide implementation errors are strictly prohibited.

Do not silently replace missing or invalid backend data with:

- Fake values
- Hardcoded values
- Empty substitute objects
- Arbitrary numbers
- Fake records
- Default business rules

Example of prohibited behavior:

```ts
const clinic = data ?? fakeClinic;
```

or:

```ts
const price = config?.price ?? 100;
```

when `100` is an undocumented business value.

If required production configuration or data is missing, the system should fail clearly and explicitly.

## Fail Fast

A missing required business configuration must produce an explicit error rather than silently continuing with incorrect data.

The objective is:

> **Never hide a real problem behind a fallback.**

---

# 10. Empty States Are Not Errors

An intentionally empty dataset is different from missing required data.

Example:

A client legitimately has no appointments:

```text
No appointments yet.
```

This is a valid empty state.

But if the application expects a required database configuration and cannot find it:

```text
Configuration missing
```

This must be treated as a real error.

Agents must distinguish:

```text
Valid Empty State
```

from:

```text
Missing / Invalid Required Data
```

---

# 11. Data Retrieval Contract

All potentially large or unbounded datasets must use:

> **Bounded, Server-Side, Demand-Driven Data Retrieval**

The UI must never load an entire potentially-large collection simply to display a subset.

The database query must retrieve only the records required for the current operation.

Use:

- Server-side filtering
- Server-side sorting
- Bounded pagination
- Cursor-based retrieval when appropriate
- Demand-driven loading

---

# 12. Never Use Arbitrary Limits as Dataset Limits

This rule is critical.

Do not interpret:

```text
limit = 100
```

as:

> "The system only has access to 100 records."

The limit applies to the **individual retrieval operation**, not the dataset.

Correct:

```text
Dataset
   |
   +--> Page 1 → 100 records
   |
   +--> Page 2 → 100 records
   |
   +--> Page 3 → 100 records
   |
   +--> ...
   |
   +--> Final page
```

Incorrect:

```text
Dataset
   |
   +--> First 100 records
   |
   +--> Stop
```

The entire dataset must remain accessible through subsequent requests.

---

# 13. No Unbounded Collection Reads

Do not use:

```text
pagination: false
```

or an equivalent unbounded collection read for a collection that can grow significantly.

An unbounded read is permitted only when an architectural review explicitly proves that the dataset is permanently small and bounded.

The default assumption is:

> **Treat collections as potentially large.**

---

# 14. Pagination Strategy

Pagination is mandatory for potentially-large collections.

The exact strategy depends on the use case.

Possible strategies include:

### Offset / Page Pagination

```text
page = 1
limit = 20

page = 2
limit = 20

page = 3
limit = 20
```

### Cursor-Based Pagination

```text
cursor = lastSeenId
limit = 20
```

Then:

```text
nextCursor
```

Do not force one pagination strategy globally.

Choose the appropriate bounded retrieval strategy according to the query, UI requirements, dataset characteristics, and existing project architecture.

---

# 14.1. Scalable Repeated Public Content & Bounded Reads

This principle defines how repeated public content must be modeled and queried to guarantee scalability, performance, and bounded resource consumption across the entire application lifecycle.

## Architectural Rule

> **Public content that is inherently bounded and local to a single document may use an Array field. Public content that represents an independently growing set of records, or whose cardinality may become materially large, MUST be modeled as a Collection rather than as an unbounded Array embedded in a Global or single document.**

The distinction is semantic and scalability-based, not an arbitrary fixed numeric threshold.

### Semantic Content Classification

```text
BOUNDED LOCAL CONTENT (Array is appropriate)
  ├── Opening hours (e.g. 7 days a week)
  ├── Small phone directory / social links
  ├── Fixed, curated trust stats / metrics
  └── Section-specific pillar highlights (e.g. 6-9 why-choose pillars)

INDEPENDENT / GROWING / LARGE CONTENT (Collection is mandatory)
  ├── Blog Posts (growing over years)
  ├── Clinical Services
  ├── Medical Team / Doctors
  └── Clinical Transformations / Before & After Cases (may scale to hundreds or thousands)
```

## Bounded Reads Mandate

1. **Bounded by Default:** Public reads MUST be bounded by default. A public page MUST NOT fetch the complete dataset merely to render its initial view.
2. **Initial View Cardinality:** Initial requests MUST retrieve only the records required for the current user-visible experience (e.g., `limit: 6` for the homepage Theatre).
3. **Explicit User-Driven Retrieval:** Additional records may only be retrieved through explicit user-driven operations:
   - Pagination controls
   - User-triggered "Load More"
   - Server-side search
   - Server-side filtering
   - Structured navigation
4. **End-to-End Pagination:** Pagination must exist end-to-end:
   ```text
   PostgreSQL (LIMIT/OFFSET/INDEX)
         ↓
   Payload Collection (limit, page, hasNextPage, select)
         ↓
   Repository Boundary (enforced bounded parameters)
         ↓
   Server / Application Logic (page-specific data retrieval)
         ↓
   UI Components (viewport-bounded DOM & state)
   ```
5. **No Memory Slicing:** Using `.slice()` after retrieving an unbounded dataset does NOT satisfy bounded-read requirements.
6. **Prohibited Unbounded Reads:** `pagination: false` is strictly prohibited for potentially large public collections.
7. **Direct DB Queries Forbidden:** Frontend code MUST NOT query PostgreSQL or Payload database internals directly. Repositories and existing server data-access boundaries remain responsible for bounded data retrieval.
8. **Admin Operability:** Content collections intended for large growth must remain operable in Payload Admin through native collection pagination (e.g., `defaultLimit: 10`, `limits: [10, 25, 50]`), sorting, search, and filtering.

---

# 15. Data Flow Rules

The preferred flow is:

```text
PostgreSQL
   ↓
Payload + Generated Types
   ↓
Repository Boundary
   ↓
Server / Application Logic
   ↓
Next.js UI
```

The UI must not directly become responsible for database logic.

Do not place database queries throughout components.

Do not duplicate data-access logic inside pages.

Keep data access organized through the repository layer.

---

# 16. Content Architecture

All website content must be treated as real application data.

Content includes:

- Clinic information
- Services
- Blog posts
- YouTube videos
- Categories
- Images
- Media
- Contact information
- Opening hours
- SEO metadata
- Client information
- Appointments
- Consultations
- Reports

Content must be retrieved from the appropriate backend/data source.

The UI must not contain production content as hardcoded replacement data.

---

# 17. Client Collection

A dedicated Payload collection named:

```text
Client
```

will provide the central foundation for all client-related information.

The purpose of this collection is not to introduce an unnecessarily large CRM system. It is a structured **Client Management Layer** that keeps client information organized and makes the backend ready for future client-facing functionality.

The Client collection should contain only information that belongs to the client itself, while operational records such as appointments, consultations, reports, and follow-ups should remain in their appropriate collections and reference the related client.

This separation keeps the data model clean, avoids duplication, and allows each type of record to evolve independently.

The Client entity may include:

- Client profile information
- Full name
- Contact information
- Phone number
- Email address
- Account/access information
- Client status
- Internal notes where appropriate
- Related appointments
- Related consultations
- Related medical reports
- Related treatment records
- Related documents
- Related media
- Notification preferences

The Client collection must act as the **single source of truth for client identity and basic client information**.

Client information must not be duplicated unnecessarily across appointments, consultations, reports, or other records.

For example:

```text
Client
   |
   +--> Appointments
   |
   +--> Consultations
   |
   +--> Reports
   |
   +--> Treatment Records
   |
   +--> Documents
   |
   +--> Notifications
```

Each related record should reference the appropriate Client rather than storing a separate copy of the client's complete profile.

This provides a clean relational structure and makes future dashboard, notification, and client-management features easier to implement.

---

# 18. Client Management Layer

The system may provide a lightweight client-management layer built around the Client entity and its related records.

This layer is intentionally designed to remain simple.

It is not intended to become a large enterprise CRM system with unnecessary modules, duplicated workflows, or excessive abstraction.

Its primary responsibility is to provide a clear relationship between the client and the activities associated with that client.

The relationship can be represented as:

```text
CLIENT
  |
  +-------------------+
  |                   |
  v                   v
APPOINTMENTS       CONSULTATIONS
  |                   |
  v                   v
FOLLOW-UPS          REPORTS
  |
  v
NOTIFICATIONS
```

The system should allow authorized administrative users to understand a client's current and historical activity without introducing unnecessary complexity.

The client-management layer may support:

- Client profiles
- Appointment history
- Consultation history
- Follow-up records
- Treatment history
- Reports and documents
- Communication-related records
- Notification status
- Client account/access status

The architecture must prioritize **clear ownership of data**.

For example:

- Client information belongs to `Client`.
- Appointment information belongs to `Appointment`.
- Consultation information belongs to `Consultation`.
- Follow-up information belongs to `FollowUp`.
- Notification information belongs to `Notification`.

This prevents unrelated collections from becoming overloaded and prevents the same business data from being stored in multiple places.

---

# 19. Appointment & Follow-up Foundation

Appointments and follow-ups are treated as structured operational records rather than simple text fields attached to a client.

A future appointment system should be based on a dedicated appointment entity, for example:

```text
Appointment
```

Each appointment should reference the related client.

A simplified relationship is:

```text
Client
   |
   +----> Appointment
              |
              +--> Date & Time
              +--> Appointment Type
              +--> Status
              +--> Notes
              +--> Follow-up Requirements
```

Possible appointment states may include:

```text
Scheduled
Confirmed
Completed
Cancelled
Rescheduled
No-Show
```

The exact statuses should be defined according to the actual clinic workflow rather than introducing unnecessary states.

Follow-ups should also be represented as structured records when they require future action.

For example:

```text
FollowUp
   |
   +--> Client
   +--> Related Appointment
   +--> Related Consultation
   +--> Due Date
   +--> Status
   +--> Notes
```

This allows the system to distinguish between:

- A normal appointment
- A future follow-up
- A post-consultation action
- A reminder generated from an existing event

This distinction is important because a reminder should not become the source of truth.

The **Appointment or FollowUp record remains the source of truth**.

The notification system only reacts to that information.

---

# 20. Client Dashboard Readiness

The current website does not need to expose a Client Dashboard as a public feature.

However, the backend architecture must be prepared for a future private dashboard for authenticated clients.

The dashboard should primarily act as a **secure presentation layer** for client-specific information.

It should not contain the core business logic responsible for appointments, follow-ups, or notifications.

A future dashboard may provide:

```text
Client
   |
   +--> Profile
   |
   +--> Appointments
   |
   +--> Consultations
   |
   +--> Treatment History
   |
   +--> Medical Reports
   |
   +--> Documents
   |
   +--> Notifications
```

The dashboard may allow a client to view:

- Personal profile information
- Upcoming appointments
- Previous appointments
- Appointment status
- Consultation records where permitted
- Treatment history where permitted
- Available reports
- Available documents
- Relevant notifications
- Follow-up information

The dashboard must retrieve this information through the existing backend architecture.

The UI must not directly access the database or bypass server-side authorization.

The expected flow is:

```text
Client Dashboard
       |
       v
Next.js Application
       |
       v
Server-Side Logic
       |
       v
Repository Layer
       |
       v
Payload
       |
       v
PostgreSQL
```

This keeps the dashboard independent from the underlying storage implementation.

The architecture must allow the dashboard to be introduced later without rebuilding the Client data foundation.

---

# 21. Authentication & Authorization

Client access and administrative access must be treated as separate responsibilities.

The system must enforce:

- Authentication
- Authorization
- Role-based access
- Server-side access checks
- Server-side validation
- Controlled data access
- Client data isolation

A client must only be able to access data belonging to that client.

For example:

```text
Authenticated Client A
        |
        v
Server-Side Authorization
        |
        v
Client A Data Only
```

The system must never rely only on frontend restrictions such as hiding buttons or pages.

Access control must be enforced on the server.

Administrative users may have broader access according to their assigned roles, but administrative privileges must not automatically change the behavior of the client-facing dashboard.

Different responsibilities should remain explicit:

```text
ADMIN
  |
  +--> Manage Clients
  +--> Manage Appointments
  +--> Manage Content
  +--> Manage Reports
  +--> Manage Follow-ups

CLIENT
  |
  +--> View Own Profile
  +--> View Own Appointments
  +--> View Allowed Records
  +--> View Own Notifications
```

The exact permissions should be implemented through role-based authorization and server-side access rules.

---

# 22. Notification & Reminder System

The notification system must be designed as a lightweight, event-driven system rather than a large standalone messaging platform.

Its purpose is simple:

**When an important client-related event occurs, the system can create and deliver the appropriate notification according to predefined rules.**

The notification system should not own the business data that causes the notification.

For example:

```text
Appointment
     |
     | event
     v
Notification Logic
     |
     +----> Dashboard Notification
     |
     +----> Email
```

The original appointment remains the source of truth.

The notification is only a reaction to that event.

This prevents situations where an outdated reminder contains information that no longer matches the actual appointment.

---

# 23. Event-Driven Reminder Architecture

Reminder scheduling must be based on actual system events and records.

The system should not depend on a permanently running frontend timer or a simple hardcoded date field.

For example:

```text
Appointment Created
        |
        v
Appointment Event
        |
        v
Reminder Rules
        |
        v
Notification Record
        |
        +----------------+
        |                |
        v                v
Client Dashboard    External Channel
                    Email (Transactional)
```

The same approach can be used when an appointment is:

- Created
- Confirmed
- Rescheduled
- Cancelled
- Completed

And when a follow-up is created or updated.

The important principle is:

```text
Business Event
      ↓
Notification Decision
      ↓
Notification
```

The notification system must not invent or guess business information.

It should always derive its information from the current authoritative record.

---

# 24. Smart Reminder Rules

The reminder system should be configurable and based on the type and state of the underlying event.

Examples include:

### Appointment Confirmation

When an appointment is successfully created or confirmed:

```text
Appointment Confirmed
        |
        v
Confirmation Notification
```

The client may receive a confirmation through an enabled channel.

### Upcoming Appointment Reminder

For appointments that require advance notification:

```text
Upcoming Appointment
        |
        v
Reminder Rule
        |
        v
Reminder Notification
```

The exact timing should be configurable according to the clinic's operational requirements.

The system should not hardcode unnecessary timing assumptions directly into UI components.

### Follow-up Reminder

When a follow-up record has a defined due date:

```text
FollowUp Created
       |
       v
Due Date
       |
       v
Reminder Rule
       |
       v
Notification
```

### Rescheduled Appointment

If an appointment is rescheduled:

```text
Old Appointment State
        |
        v
Appointment Rescheduled
        |
        v
Previous Reminder State
        |
        v
Re-evaluate Reminder
        |
        v
New Notification
```

Previously scheduled reminders must not blindly continue using the old appointment time.

The system should re-evaluate the notification state against the updated appointment.

### Cancelled Appointment

If an appointment is cancelled:

```text
Appointment Cancelled
        |
        v
Related Pending Reminders
        |
        v
Invalidate / Cancel
```

A cancelled appointment must not continue generating normal upcoming-appointment reminders.

This is an important part of keeping notifications consistent with the actual business state.

---

# 25. Notification Records

Notifications should be represented as structured records when persistence, tracking, or dashboard visibility is required.

A dedicated collection may be used:

```text
Notification
```

A notification may reference:

- Client
- Related appointment
- Related follow-up
- Notification type
- Notification status
- Scheduled time
- Sent time
- Delivery channel
- Related event
- Read status where applicable

A simplified structure is:

```text
Notification
   |
   +--> Client
   +--> Related Record
   +--> Type
   +--> Channel
   +--> Scheduled At
   +--> Status
   +--> Sent At
   +--> Read At
```

Possible notification states may include:

```text
Pending
Sent
Read
Failed
Cancelled
```

The exact states should remain limited to what the actual application requires.

The system should not create notification records merely to increase the complexity of the architecture.

Persistent notification records are appropriate when the application needs to:

- Display notifications in the Client Dashboard
- Track whether a notification was sent
- Track delivery state
- Prevent duplicate notifications
- Audit important notification events
- Handle failed delivery

---

# 26. Notification Deduplication & Consistency

The notification system must prevent duplicate notifications for the same business event.

For example, if an appointment is updated multiple times, the system must not blindly create multiple identical reminder notifications.

The notification flow should therefore consider:

```text
Business Event
      |
      v
Existing Notification State
      |
      +----> Already Handled
      |          |
      |          v
      |        Do Not Duplicate
      |
      +----> Not Handled
                 |
                 v
          Create / Schedule
```

Notification processing should be idempotent where appropriate.

A notification must be associated with enough information to identify the business event that generated it.

For example:

```text
Appointment ID
+
Notification Type
+
Reminder Rule
```

can be used as part of the logic for determining whether the same notification has already been generated or processed.

This prevents repeated execution from creating unnecessary duplicate messages.

---

# 27. Notification Channels & Client Phone Usage

The architecture separates notification logic from automated delivery channels and clarifies the role of client contact information.

## In-System Automated Channels

Automated, system-generated notifications are strictly limited to:

```text
Notification System (In-System Automated)
       |
       +--> Dashboard (Secure Client Presentation)
       |
       +--> Email (Transactional & Reminder Delivery)
```

The core business logic determines **what notification should happen**.
The delivery integration determines **how that email or dashboard notification is delivered**.

```text
Appointment Reminder
       |
       v
Notification Service
       |
       +--> Email Provider (e.g. Resend / Transactional SMTP)
       |
       +--> Client Dashboard Feed
```

External delivery providers must not become the source of truth for appointment or client information.

## No Automated WhatsApp or SMS Engines

The system must not introduce automated WhatsApp, SMS, or external mobile messaging engines, APIs, bots, or gateway integrations.

All automated messaging within the software platform is handled via **Email** and **Dashboard Notifications**.

## Client Phone Number for Out-of-Band Manual Contact

The Client entity retains the client's phone number as standard contact and profile data:

- The phone number is stored for operational and identity records.
- Clinic staff may use the phone number for direct, manual communication (e.g. phone calls or manual WhatsApp messages from clinic devices) strictly **outside the system**.
- No automated WhatsApp or SMS sending infrastructure is built into the application.

---

# 28. Notification Preferences

If required by the final product scope, clients may have notification preferences stored as part of their Client profile or a dedicated preferences structure.

Supported preferences are limited to:

- Email notifications
- Dashboard notifications

The system must respect configured preferences where applicable.

However, critical system or clinic communications may require separate handling according to the clinic's actual operational policy.

Notification preferences should therefore control delivery behavior without changing the underlying appointment or follow-up record.

For example:

```text
Appointment
     |
     v
Reminder Required
     |
     v
Client Preferences
     |
     +----> Email Enabled
     |
     +----> Dashboard Notifications Enabled
```

---

# 29. Reminder Processing Responsibility

Reminder processing belongs to the backend/application infrastructure.

The frontend must not be responsible for deciding when a reminder should be sent.

The Client Dashboard may display:

```text
Upcoming Appointment
Reminder Status
Notification History
```

but it should not contain the core reminder scheduling logic.

The responsibility should remain approximately:

```text
Frontend
   |
   | Display
   v
Backend
   |
   | Business Logic
   v
Reminder / Notification Processing
   |
   v
Delivery Channel
```

This prevents reminder behavior from depending on whether the client currently has the website open.

---

# 30. Background Processing Readiness

The architecture should be prepared for background processing of scheduled reminders without requiring a complex distributed architecture.

If the project requires scheduled notifications, the backend may use a controlled background-processing mechanism responsible for checking and processing due notification tasks.

The implementation should remain proportional to the actual project requirements.

The system does not need microservices or a large messaging infrastructure merely to support appointment reminders.

A simple architecture is preferred:

```text
Appointment / FollowUp
        |
        v
Reminder Task
        |
        v
Background Processing
        |
        v
Notification
        |
        v
Delivery Channel
```

The exact scheduler or job-processing mechanism can be selected during implementation according to the deployment environment and actual notification requirements.

The architecture must remain replaceable without changing the core Client, Appointment, or FollowUp data model.

---

# 31. Client Data Isolation

Client-specific information must remain isolated from unrelated clients.

All client-facing queries must apply server-side authorization and ownership checks.

The expected pattern is:

```text
Authenticated User
       |
       v
Identify Client
       |
       v
Verify Ownership / Permission
       |
       v
Retrieve Authorized Data
```

The system must never rely on a client-provided ID alone to determine whether the requested information is accessible.

For example, a request such as:

```text
/client-dashboard?clientId=123
```

must not automatically grant access to Client `123`.

The server must determine the authenticated user's authorized Client relationship before returning the data.

This rule applies to:

- Appointments
- Consultations
- Reports
- Treatment records
- Documents
- Media
- Notifications
- Any future private client information

---

# 32. Data Ownership & Single Source of Truth

Each business concept must have one authoritative source.

The architecture should follow:

```text
Client
   |
   +--> Owns Client Identity
   |
Appointment
   |
   +--> Owns Appointment State
   |
Consultation
   |
   +--> Owns Consultation Data
   |
FollowUp
   |
   +--> Owns Follow-up State
   |
Notification
   |
   +--> Owns Notification State
```

Notifications must not replace appointments.

Reminders must not replace follow-ups.

The Client Dashboard must not become another database.

The frontend must display authoritative backend data rather than maintaining an independent copy of business records.

This prevents synchronization problems and keeps the system understandable.

---

# 33. Future Expansion Without Overengineering

The Client Management Layer must be designed for future growth without requiring unnecessary architecture today.

Possible future additions include:

- Client Dashboard
- Appointment booking
- Online appointment confirmation
- Follow-up tracking
- Notification history
- Email notifications
- Additional client documents
- Additional reporting functionality

These features should be added only when required.

The initial implementation must not introduce unnecessary services, databases, queues, microservices, or abstractions simply because they may be useful in the future.

The architectural principle is:

```text
Prepare the foundation.
Do not build unnecessary complexity.
```

The existing Client, Appointment, Consultation, FollowUp, and Notification relationships should provide enough structure to support future functionality without requiring a complete redesign.

---

# 34. Client Management Architecture Summary

The complete client-related architecture can be represented as:

```text
                         CLIENT MANAGEMENT
                                |
             +------------------+------------------+
             |                  |                  |
             v                  v                  v
          CLIENT          APPOINTMENTS        CONSULTATIONS
             |                  |                  |
             |                  v                  v
             |              FOLLOW-UPS          REPORTS
             |                  |
             +------------------+
                      |
                      v
               NOTIFICATION SYSTEM
                       |
                 +-----+-----+
                 |           |
                 v           v
             DASHBOARD     EMAIL
```

Automated WhatsApp and SMS channels are excluded. Client phone numbers are stored strictly for manual contact outside the platform.

The core principles are:

```text
Client = Client Identity
Appointment = Appointment State
Consultation = Consultation Data
FollowUp = Follow-up Requirement
Notification = Notification State
Dashboard = Secure Presentation Layer
```

No component should take ownership of another component's business data.

The architecture should remain simple, secure, event-driven, and ready for future client-facing functionality.

The system should provide enough structure to support real client management and intelligent reminders while avoiding unnecessary CRM complexity.

# 35. Cache Architecture

**Caching is a first-class system concern.**

Potentially reusable content and data should participate in the project cache strategy.

This includes, where appropriate:

- Website content
- Clinic information
- Blog data
- Media metadata
- Public pages
- Client dashboard data
- Client-specific records
- Appointments
- Consultations
- Reports
- Other repeatedly requested data

Caching decisions must respect data sensitivity and ownership.

---

# 36. TTL-Based Cache Invalidation Is Forbidden

**TTL-based cache invalidation must not be used.**

This rule is strict.

Do not solve cache consistency by assigning arbitrary expiration periods such as:

```text
TTL = 60 seconds
TTL = 5 minutes
TTL = 1 hour
```

The system must not rely on time passing to decide when changed data becomes stale.

The preferred model is:

```text
Read Request
    ↓
Check Cache
    ↓
Return Cached Data when valid
```

and:

```text
Actual Data Change
    ↓
Relevant Event / Hook
    ↓
Invalidate Affected Cache
    ↓
Next Request Rebuilds / Refreshes Data
```

---

# 37. Event-Driven Cache Invalidation

Cache invalidation must occur through explicit events or hooks.

Examples:

```text
Blog Updated
    ↓
Invalidate Blog Cache
```

```text
Clinic Information Updated
    ↓
Invalidate Clinic Information Cache
```

```text
Appointment Updated
    ↓
Invalidate That Client's Appointment Cache
```

```text
Report Updated
    ↓
Invalidate That Client's Report Cache
```

The invalidation must be as narrow as possible.

---

# 38. Invalidate Only What Changed

Do not flush the entire cache when a single record changes.

Incorrect:

```text
Update one blog post
       ↓
Clear entire application cache
```

Correct:

```text
Update Blog Post #42
       ↓
Invalidate Blog Post #42
       ↓
Invalidate only directly affected derived data
```

For client data:

```text
Appointment #125 updated
       ↓
Invalidate Appointment #125
       ↓
Invalidate affected Client Dashboard data
       ↓
Keep unrelated client data cached
```

The principle is:

> **Invalidate the smallest cache scope that correctly reflects the change.**

---

# 39. Cache on Demand

The cache should primarily be populated when data is requested.

Preferred behavior:

```text
First Request
    ↓
Database / Backend
    ↓
Response
    ↓
Store in Cache
```

Then:

```text
Next Request
    ↓
Cache Hit
    ↓
Return Cached Data
```

After an actual change:

```text
Mutation
    ↓
Relevant Hook / Event
    ↓
Targeted Invalidation
```

The system should not depend on periodic cache expiration.

---

# 40. Client Dashboard Caching

Client dashboard data should participate in the cache architecture when appropriate.

However, client-specific data must always remain isolated by client identity and access control.

Example conceptual cache scope:

```text
Client A
  └── Dashboard Cache

Client B
  └── Dashboard Cache
```

Never allow cached data belonging to one client to become accessible to another client.

Caching must never weaken authorization.

---

# 41. Mutations and Cache Consistency

Every operation that changes data must have an explicit cache-consistency strategy.

For every mutation, determine:

1. What data changed?
2. Which cached representation depends on it?
3. Which cache key(s) are affected?
4. Which event/hook performs invalidation?
5. What should happen on the next request?

A mutation is not considered complete architecturally until its affected cache state is handled.

---

# 42. Component Architecture

The UI must be divided into small, focused components.

Do not create massive files containing hundreds or thousands of lines of unrelated JSX and logic.

Prefer:

```text
components/
├── layout/
├── navigation/
├── home/
├── about/
├── blog/
├── contact/
├── client/
└── shared/
```

Components should have clear responsibilities.

Avoid:

- Giant components
- Repeated markup
- Repeated business logic
- Unrelated responsibilities inside one component
- Copy-pasted UI structures

---

# 43. Folder Organization

Project folders must remain organized by responsibility.

Avoid dumping unrelated files into:

```text
utils/
helpers/
components/
services/
```

without structure.

Prefer meaningful grouping.

Example:

```text
src/
├── app/
├── components/
│   ├── home/
│   ├── about/
│   ├── blog/
│   ├── contact/
│   └── client/
├── repositories/
│   ├── clients/
│   ├── appointments/
│   ├── blog/
│   └── reports/
├── lib/
├── hooks/
├── types/
└── config/
```

The exact structure may evolve, but organizational clarity is mandatory.

---

# 44. No Giant Files

Do not place an entire feature into one enormous file.

If a file begins accumulating multiple unrelated responsibilities, split it.

The goal is not to maximize the number of files.

The goal is:

> **Small, meaningful, maintainable units with clear ownership.**

---

# 45. UI Components Must Not Own Business Logic

Pages and components should focus on:

- Presentation
- User interaction
- Rendering
- Requesting the required data

They should not become the source of truth for business rules.

Avoid implementing the same business rule in:

```text
Component
Page
API Route
Repository
Hook
```

The business rule must have one owner.

---

# 46. Error Handling

Errors must be explicit and observable.

Never hide an error using:

- Fake data
- Silent fallback values
- Empty fake responses
- Arbitrary defaults
- `catch` blocks that simply ignore failures

Bad:

```ts
try {
  return await getData();
} catch {
  return [];
}
```

if the failure represents an actual backend/data problem.

Prefer explicit error handling that preserves the distinction between:

- No data
- Invalid data
- Missing required configuration
- Authentication failure
- Authorization failure
- Backend failure
- Database failure

---

# 47. Loading States

Loading states are legitimate UI states.

Use:

- Skeletons
- Loading indicators
- Progressive rendering
- Empty states

when appropriate.

Do not replace unavailable data with fake records just to avoid a loading or empty state.

---

# 48. Search, Filtering & Sorting

For potentially-large datasets:

```text
UI Request
    ↓
Server
    ↓
Database Query
    ↓
Filter
    ↓
Sort
    ↓
Bounded Result
    ↓
UI
```

Do not:

```text
Load Everything
    ↓
Send Everything to Browser
    ↓
Filter in Browser
```

unless the dataset is proven to be permanently small and the architecture explicitly permits it.

---

# 49. Reconnaissance Before Code Changes

Before modifying existing code, an agent must inspect the current architecture.

The agent must determine:

- Existing folder structure
- Existing data flow
- Existing repositories
- Existing components
- Existing hooks
- Existing queries
- Existing validation
- Existing cache behavior
- Existing business rules
- Existing ownership of the functionality being changed

Do not modify code before understanding the relevant implementation.

---

# 50. Read / Inspect Before Modify

During investigation:

```text
Read
Inspect
Search
Trace
Understand
```

must happen before:

```text
Modify
Create
Delete
Move
Refactor
```

Do not make speculative changes.

---

# 51. Root Cause Before Implementation

When a bug is discovered:

```text
Symptom
   ↓
Trace
   ↓
Root Cause
   ↓
Correct Owner
   ↓
Minimal Architectural Fix
```

Do not immediately add a workaround.

A successful temporary workaround is not considered a completed engineering solution if the underlying cause remains.

---

# 52. Change Ownership

Before implementing a change, identify which layer owns the responsibility.

Example:

```text
UI problem
     ↓
UI Component

Data retrieval problem
     ↓
Repository / Data Layer

Business rule problem
     ↓
Business Logic Owner

Cache consistency problem
     ↓
Cache/Event/Mutation Owner

Database integrity problem
     ↓
Data Layer
```

Do not move logic into another layer simply because that layer is easier to edit.

---

# 53. No Parallel Implementations

Never create a second implementation of an existing mechanism because:

- The existing one is inconvenient
- The existing name is different
- A new agent prefers another pattern
- A new component needs slightly different behavior

First determine whether the existing implementation can be extended.

Parallel systems create:

- Duplication
- Inconsistent behavior
- Maintenance problems
- Cache inconsistencies
- Multiple sources of truth

---

# 54. Production-First Engineering

The project must be designed for actual production behavior.

Do not build the production architecture around fake assumptions such as:

- Tiny datasets
- Permanent mock content
- Hidden fallback values
- Browser-only data filtering
- Unlimited database reads
- Temporary development shortcuts

Development conveniences must not become production architecture.

---

# 55. Performance Principles

Performance must be considered at every layer.

Prefer:

- Server-side data retrieval
- Bounded database queries
- Efficient filtering
- Efficient sorting
- Pagination
- Demand-driven loading
- Appropriate caching
- Targeted cache invalidation
- Image optimization
- Small UI components
- Server-side rendering where appropriate
- Static generation where appropriate

Avoid:

- Loading unnecessary records
- Loading entire collections
- Repeated identical queries
- Duplicate data fetching
- Full-cache invalidation
- Large client-side datasets
- Giant components

---

# 56. Security Principles

Security must never be implemented as an afterthought.

The project must enforce:

- Authentication
- Authorization
- Role-based access
- Server-side validation
- Controlled data access
- Secure API operations
- HTTPS
- Protected environment configuration
- Client data isolation

Sensitive client information must never be exposed simply because it exists in the backend.

---

# 57. Client Data Privacy

Client-related data is private data.

The system must ensure that:

```text
Client A
   X
Client B Data
```

and:

```text
Client B
   X
Client A Data
```

Access must always be verified server-side.

Do not rely on UI hiding alone.

---

# 58. Content and Media

Media must be managed through the project's backend/media infrastructure.

Do not scatter production media references and business content throughout source files.

Images, videos, blog content, and clinic content should be represented by structured data wherever appropriate.

---

# 59. SEO Data

SEO information should be treated as structured project data.

Where applicable:

- Metadata
- Open Graph information
- Structured Data
- Sitemap data
- Search-friendly content

should be generated from the appropriate content/data source.

Do not duplicate the same SEO information manually across multiple pages when it can have a single source of truth.

---

# 60. No Unnecessary Abstraction

Do not create an abstraction simply because it looks architecturally sophisticated.

A new abstraction must have a real purpose.

Before adding one, ask:

1. What problem does it solve?
2. Does an existing abstraction already solve it?
3. Who owns this responsibility?
4. Does it reduce duplication?
5. Does it improve maintainability?
6. Is the added complexity justified?

If the answer is no, do not add it.

---

# 61. Simplicity Is an Architectural Requirement

The Clinic Project is not a distributed enterprise platform.

Do not introduce complexity for the appearance of complexity.

The preferred architecture is:

```text
Next.js
   ↓
Payload
   ↓
Repository Boundary
   ↓
PostgreSQL
```

with supporting capabilities used where actually required:

```text
Authentication / Authorization
Validation
Caching
Events / Hooks
Media
SEO
Deployment
```

These are capabilities and responsibilities—not automatic reasons to create
additional layers, services, DTOs, mappers, adapters, or parallel systems.

Simple does not mean careless.

Simple means:

> **Only the complexity required by the actual project is allowed.**

---

# 62. Agent Rules

Every AI agent working on this project must:

1. Inspect before changing.
2. Search before creating.
3. Reuse before duplicating.
4. Fix root causes instead of symptoms.
5. Never use mock data.
6. Never hide errors with fallbacks.
7. Never hardcode production business data.
8. Never create arbitrary dataset limits.
9. Never perform unbounded reads on potentially-large collections.
10. Use server-side bounded retrieval.
11. Preserve complete dataset accessibility through pagination or appropriate bounded retrieval.
12. Respect the repository layer.
13. Keep components small.
14. Keep folders organized.
15. Keep business logic in one authoritative location.
16. Treat caching as part of the data architecture.
17. Never use TTL as the cache invalidation mechanism.
18. Invalidate cache through relevant events/hooks.
19. Invalidate only affected data.
20. Never weaken client data isolation for convenience.

---

# 63. Final Engineering Contract

The following principles are mandatory:

```text
NO PATCHWORK
NO DUPLICATION
NO HARD-CODED BUSINESS DATA
NO MOCK DATA
NO ERROR-HIDING FALLBACKS
NO UNBOUNDED READS
NO ARBITRARY DATASET LIMITS
NO GIANT FILES
NO UNNECESSARY ARCHITECTURE
NO DUPLICATE SOURCES OF TRUTH
NO TTL-BASED CACHE INVALIDATION
NO FULL CACHE FLUSH FOR LOCAL CHANGES
```

And:

```text
ROOT CAUSE OVER WORKAROUND
REUSE OVER DUPLICATION
BOUNDED READS OVER FULL COLLECTION LOADS
SERVER-SIDE RETRIEVAL OVER CLIENT-SIDE BULK DATA
EVENT-DRIVEN INVALIDATION OVER TTL
TARGETED INVALIDATION OVER GLOBAL CACHE FLUSH
SMALL COMPONENTS OVER GIANT FILES
CLEAR OWNERSHIP OVER PARALLEL LOGIC
SIMPLE ARCHITECTURE OVER UNNECESSARY COMPLEXITY
```

---

# 64. Final Rule

> **Build the Clinic Project as a clean production system, not as a collection of quick fixes.**

Every implementation decision must preserve:

- Correctness
- Simplicity
- Maintainability
- Security
- Performance
- Clear ownership
- Data integrity
- Complete data accessibility
- Cache consistency

When there is a choice between a quick workaround and a correct architectural solution:

> **Choose the correct architectural solution.**
---

---

# 2A. Official Initialization Without Manual Foundation Recreation

The project must begin with the official, supported Next.js and Payload
initialization workflow for the approved versions.

The agent must:

1. Verify the approved versions and official documentation.
2. Use the official CLI or documented bootstrap workflow.
3. Allow Next.js, Payload, and their official integrations to create the
   framework foundation.
4. Inspect the generated project before adding custom application code.
5. Extend the generated foundation instead of recreating it.

The agent must not manually recreate functionality already provided by the
official stack, including:

- The Next.js application foundation;
- Payload configuration and admin infrastructure;
- Payload's official API/data-access mechanisms;
- Payload authentication capabilities where applicable;
- Payload database integration;
- Generated Payload types;
- Official upload/media infrastructure;
- Duplicate admin, API, database, session, or user-store systems.

The exact initialization command must come from the official documentation for
the approved versions. The agent must not invent an unofficial bootstrap
workflow.

---

# 5A. Payload Types Are the Default Data Contract

Payload's generated TypeScript types are the authoritative types for Payload
entities.

The default data flow is:

```text
Payload
   ↓
Generated Payload Types
   ↓
Repository Boundary
   ↓
Application / Server Action / UI
```

Payload's native `select`, `depth`, and `populate` capabilities must be used
to request the data shape actually required by the consumer.

## No Automatic DTO or Mapper Layer

DTOs, mappers, view models, serializers, and transformation classes are not
mandatory architectural layers.

The agent must not create:

- One DTO for every Payload collection;
- One mapper for every repository;
- A second interface that merely copies a generated Payload type;
- A mapper that converts an object into an identical object;
- A service whose only purpose is to pass data through a DTO and mapper;
- Additional transformation layers merely to make the architecture look
  sophisticated.

If the generated Payload type and selected data shape are already correct for
the consumer, the Repository should return that typed data directly.

Rule:

> **If the data shape is already correct, return it directly. Do not map an
> object to an identical object.**

## When a Custom Type or Transformation Is Allowed

A custom type, DTO, view model, serializer, or mapper is allowed only when a
real and documented boundary exists, such as:

- Removing or protecting sensitive fields;
- Creating a genuinely different public response shape;
- Combining multiple authoritative records;
- Supporting an external integration contract;
- Versioning an external API contract;
- Converting data into a genuinely independent domain model;
- Representing a form input or command that is intentionally different from
  the stored record.

Before creating one, the agent must explain:

1. Why the generated Payload type is insufficient;
2. Why `select`, `depth`, or `populate` cannot solve the requirement;
3. What actual shape, security, integration, or domain boundary changes;
4. Which layer owns the new contract;
5. Why direct typed Payload data would be incorrect or unsafe.

If these questions cannot be answered clearly, the additional DTO, mapper, or
transformation must not be created.

---

# 21A. Payload-First Authentication and Authorization

Payload authentication and access control are the default mechanisms.

Before creating custom authentication infrastructure, the agent must inspect
the capabilities already provided by Payload and Next.js for the approved
versions.

The project must not automatically create:

- A parallel user store;
- A parallel session system;
- Duplicate login or password handling;
- Duplicate token verification;
- A separate permission engine;
- Custom authentication middleware replacing Payload;
- A second authorization framework.

Custom server-side checks are still required where the Clinic Project has
specific ownership, role, privacy, or workflow rules. These checks should use
the authenticated user context and Payload access-control capabilities where
they are sufficient.

The rule is:

```text
Payload Auth / Access Control
             ↓
Additional server-side ownership checks when required
             ↓
Repository / Application operation
```

A custom authentication or authorization mechanism is allowed only when a
specific requirement cannot be satisfied by Payload's native capabilities.
That decision must be documented before implementation.

Frontend route guards and hidden UI controls are never sufficient security.

---

# 35A. Cache Rules Without Automatic Cache Layers

The cache principles in Sections 35–41 remain mandatory, but they do not
require a new cache service, cache repository, cache adapter, or custom
invalidation framework for every feature.

The agent must first identify:

1. Which system owns the cached representation;
2. Which mutation changes the underlying data;
3. Which cache key or scope is affected;
4. Which supported invalidation mechanism belongs to that owner.

Use the native mechanism that fits the actual owner, such as Payload hooks/events
for Payload-owned changes or Next.js revalidation for Next.js-managed
representations.

Do not add multiple invalidation mechanisms redundantly when one authoritative
mechanism is sufficient.

The requirement is:

> **Targeted, event-driven consistency—not automatic cache infrastructure
> everywhere.**

---

# 43A. Folder Structure Must Follow Real Responsibilities

The folder examples in this constitution are guidance, not a command to
manufacture every possible folder or layer.

The agent must:

- Start from the official generated Next.js/Payload structure;
- Preserve framework-supported locations for generated files and types;
- Add folders only when an actual responsibility exists;
- Keep repositories around meaningful data responsibilities;
- Avoid creating `types/`, `services/`, `api/`, `admin/`, `database/`, or
  `payload/` folders merely to duplicate official framework responsibilities;
- Avoid creating a DTO, mapper, service, hook, helper, or adapter only because
  a folder exists for that category.

The final structure is:

```text
Official Framework Foundation
        +
Only the custom application code actually required
```

It is not a rigid enterprise template.

---

# 58A. Payload Media and Upload Infrastructure

Where Payload is the authoritative backend for media, use Payload's official
upload and media infrastructure.

Configure only what the actual requirements need:

- Upload-enabled collections;
- Storage adapter or provider;
- Public/private visibility;
- Access control;
- File and image constraints;
- Relationships to clinic content, clients, reports, or other records.

Do not recreate Payload's upload API, media infrastructure, storage integration,
or admin upload functionality manually.

Do not introduce a separate media service unless a documented requirement
cannot be satisfied by the official Payload capabilities.

---

# 62A. Mandatory Simplicity Checklist for Agents

Before creating a new architectural element, the agent must confirm:

- [ ] The official Next.js/Payload foundation was initialized and inspected.
- [ ] The existing Payload capability was checked first.
- [ ] The existing repository or application owner was checked first.
- [ ] Generated Payload types are being reused.
- [ ] `select`, `depth`, or `populate` cannot already provide the needed shape,
      if a transformation is being proposed.
- [ ] No DTO or mapper is being created merely by convention.
- [ ] No framework feature is being recreated manually.
- [ ] No duplicate authentication, session, database, API, admin, or media
      infrastructure is being introduced.
- [ ] The proposed element has one clear owner and one real responsibility.
- [ ] The added complexity is necessary and documented.
- [ ] The smallest correct change has been selected.

---

# 63A. Final Architectural Precedence

When an example, diagram, folder tree, or generic pattern conflicts with the
principle of simplicity or with the official framework capabilities, use this
order of precedence:

1. Actual project requirements;
2. Official Next.js/Payload workflow and capabilities;
3. Generated framework foundation;
4. Existing project architecture and ownership;
5. Minimal custom application code;
6. Illustrative diagrams and folder examples.

The diagrams and examples in this constitution are explanatory. They must not
be used to justify:

- Manual recreation of framework infrastructure;
- Duplicate generated types;
- Automatic DTO or mapper layers;
- Parallel authentication systems;
- Duplicate repositories or APIs;
- Unnecessary services, adapters, or abstractions.

The canonical architecture is:

```text
Official Next.js + Payload Foundation
                ↓
Generated Payload Types and Native Capabilities
                ↓
Repository Boundary Where Useful
                ↓
Application / Server Actions Where Required
                ↓
Next.js UI
```

A Repository is a boundary for organized data access. It is not an instruction
to create DTOs, mappers, services, or additional layers automatically.

---

# 64A. Required Completion Report

For every substantial implementation, the agent must report:

- What existing architecture was inspected;
- Which official framework capabilities were reused;
- Which generated types were reused;
- Which repositories or application owners were reused;
- Which new files were created and why;
- Which layers were intentionally not created;
- Whether any DTO, mapper, service, adapter, or custom auth mechanism was
  introduced;
- If introduced, the concrete requirement and documented justification;
- The affected data flow, authorization path, cache path, and tests.

The agent must explicitly state when the simplest correct solution required no
new DTO, mapper, service, adapter, or parallel infrastructure.

---

# 65. Final Simplicity Contract

The Clinic Project must remain a simple, production-ready Next.js + Payload
application with PostgreSQL and a clear Repository boundary.

The architecture must prefer:

```text
Reuse official capability
        ↓
Reuse existing project owner
        ↓
Use generated types directly
        ↓
Add only the smallest required custom code
```

over:

```text
Create another layer
        ↓
Create another abstraction
        ↓
Create another DTO / Mapper / Service
        ↓
Duplicate an existing responsibility
```

The final rule is:

> **Do not add architecture to satisfy a pattern. Add architecture only to
> satisfy a real requirement.**
