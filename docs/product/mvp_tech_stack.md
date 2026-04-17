# Sesha MVP Tech Stack Decision

## Recommendation summary
Use a TypeScript stack centered on:
- Mobile: `React Native` with `Expo`
- Backend API: `NestJS`
- Database: `PostgreSQL`
- Cache/queues/rate limits: `Redis`
- Object storage: `S3-compatible storage`
- Admin console: `Next.js`
- Analytics: `PostHog`
- Error monitoring: `Sentry`

This is the best fit for a fast-moving MVP that still needs clean domain modeling, moderation controls, localization, and a credible path to future chat.

## Chosen stack

### Mobile
- `React Native + Expo + TypeScript`
- Navigation: `Expo Router`
- Data fetching/cache: `TanStack Query`
- Forms/validation: `React Hook Form` + `Zod`
- Localization: `react-i18next` with ICU message formatting
- Push notifications: `Expo Notifications`
- Image handling: optimized CDN/object storage URLs and aggressive caching

### Backend
- `NestJS + TypeScript`
- Auth and API: REST JSON over HTTPS
- Validation: `class-validator` or `Zod` at boundary
- Background jobs: `BullMQ` with Redis
- Search v1: PostgreSQL indexes and trigram/full-text search
- Search v2 if needed: `Meilisearch`

### Data and infrastructure
- `PostgreSQL` for relational data and auditability
- `Redis` for caching, queues, and rate limiting
- `S3-compatible storage` for profile photos and post media
- CDN in front of media
- Deploy backend/admin on a managed platform with separate staging and production

### Admin tooling
- `Next.js` web console sharing TypeScript types with backend contracts
- Admin auth separated from consumer login session
- Report queue, content actions, user disabling, audit log

### Observability
- `Sentry` for mobile, API, and admin errors
- `PostHog` for product analytics and funnels
- Structured logs with request IDs

## Why this stack

### Why React Native with Expo
- One codebase for iOS and Android without accepting the maintenance cost of two native apps.
- Fast iteration on onboarding, feeds, and form-heavy flows.
- Mature ecosystem for localization, notifications, deep linking, and OTA updates.
- Sufficient performance for list-based social/productivity experiences when implemented carefully.

### Why NestJS instead of a purely backendless stack
- The product has non-trivial domain rules: invite chains, privacy states, moderation actions, structured intro workflows, and pillar-specific permissions.
- A dedicated backend keeps these rules coherent and auditable.
- It gives cleaner control over future chat, moderation escalation, and admin features than stitching logic across client and database triggers.

### Why PostgreSQL
- Strong fit for relational community/product workflows.
- Supports audit-friendly data access patterns.
- Good enough search for MVP if schema and indexes are designed carefully.
- Flexible JSONB support for evolving structured prompts and settings.

### Why a web admin console
- Moderation is operational work and should not depend on shipping an app update.
- Reviewing reports, notes, and audit history is materially better on desktop.
- Keeps consumer app scope under control.

## Alternatives considered

### Flutter
Rejected for MVP because the surrounding hiring pool, admin web reuse, and shared TypeScript contracts favor React Native.

### Native iOS + Android
Rejected because the product is still validating demand and does not justify two mobile teams.

### Supabase-first backend
Viable for a smaller or prototype product, but not the best primary choice here because moderation workflows, invite logic, and structured contact rules will become backend code anyway. Supabase-hosted Postgres remains a valid infrastructure option if desired.

### Firebase
Rejected because the data model is strongly relational and moderation/audit workflows benefit from SQL and explicit server control.

## Non-functional implications

### Localization
- Build i18n into the app from the first screen.
- Store content language explicitly on relevant objects.
- Keep all API enums and labels locale-agnostic; translate only in client/admin UI.

### Performance
- Use paginated APIs and optimistic caching carefully.
- Pre-size and compress images before upload.
- Use virtualized lists and avoid nested heavy scroll regions.
- Measure cold start and scroll performance early on representative Android devices.

### Security and privacy
- Keep contact info hidden by default at API level, not just UI level.
- Use signed upload URLs for media.
- Encrypt sensitive data at rest where supported.
- Store audit trails for admin actions and content removals.

### Future chat path
- Do not build chat in MVP.
- When needed, add either:
  - managed chat infrastructure such as Stream, or
  - a dedicated realtime service backed by WebSockets and PostgreSQL
- The intro approval model already creates the necessary permission boundary.

## Suggested repo layout

```text
apps/
  mobile/
  admin/
services/
  api/
packages/
  ui/
  config/
  types/
  i18n/
infra/
  migrations/
  deployment/
docs/
  product/
```

## Delivery sequence
1. Mobile shell, auth, invite flow, localization setup
2. Shared profile and backend auth/profile endpoints
3. Kama backend and mobile flows
4. Artha backend and mobile flows
5. Moksha and Dharma content systems
6. Admin console and moderation
7. Analytics, observability, performance hardening

## Final decision
Proceed with `React Native (Expo) + NestJS + PostgreSQL + Redis + Next.js admin`.

This keeps the MVP buildable by a small team, aligns with the product's domain complexity, and avoids locking the product into a weak moderation or privacy foundation.
