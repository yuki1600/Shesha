# Sesha MVP Data Model and API

## Purpose
This document defines the minimum viable backend model and HTTP API surface required to support the MVP.

## Modeling principles
- Keep one `User` and one shared `Profile` as the source of truth.
- Add pillar-specific extension records only where needed.
- Represent social/content objects with explicit types instead of separate systems when the behaviors are similar.
- Keep privacy and moderation fields first-class.

## Core entities

### User
Represents the account and access state.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `invite_code_id` | UUID nullable | Redeemed invite reference |
| `phone_e164` | string nullable | Recommended primary auth identifier |
| `email` | string nullable | Optional backup identity |
| `status` | enum | `active`, `disabled`, `pending_review` |
| `roles` | string[] | `user`, `admin` |
| `locale` | enum | `en`, `ta` |
| `created_at` | timestamp |  |
| `last_active_at` | timestamp nullable |  |

### InviteCode
Tracks invite-only access and referral chain.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `code` | string | Unique, human-entered |
| `created_by_user_id` | UUID nullable | Referrer |
| `max_redemptions` | integer | `1` for single-use by default |
| `redemption_count` | integer |  |
| `expires_at` | timestamp nullable |  |
| `created_at` | timestamp |  |

### Profile
Shared profile used across all pillars.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `user_id` | UUID | Unique FK to User |
| `display_name` | string |  |
| `city` | string |  |
| `state_region` | string nullable |  |
| `country_code` | string | Default `IN` |
| `languages` | string[] | Example: `en`, `ta` |
| `bio` | text nullable |  |
| `role_tags` | string[] | Example: `recruiter`, `seeker`, `guardian` |
| `avatar_url` | string nullable |  |
| `contact_visibility` | enum | `hidden`, `approved_only` |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### KamaProfile
Matchmaking-specific extension.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `user_id` | UUID | Unique FK |
| `is_visible` | boolean | Default false until completed |
| `age` | integer |  |
| `height_cm` | integer nullable |  |
| `education` | string nullable |  |
| `occupation` | string nullable |  |
| `city_preference` | string nullable |  |
| `practice_preferences` | string[] |  |
| `temple_affiliation` | string nullable |  |
| `lineage_preference` | string nullable |  |
| `values_prompts` | JSONB | Prompt-answer pairs |
| `guardian_mode` | enum | `off`, `optional`, `required` |
| `guardian_contact_text` | string nullable | Non-sensitive instructions |
| `photo_urls` | string[] | Optional |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### ArthaProfile
Career-specific extension.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `user_id` | UUID | Unique FK |
| `headline` | string nullable |  |
| `current_role` | string nullable |  |
| `years_experience` | numeric nullable |  |
| `skills` | string[] |  |
| `preferred_roles` | string[] |  |
| `preferred_locations` | string[] |  |
| `workplace_modes` | string[] | `remote`, `hybrid`, `onsite` |
| `is_open_to_work` | boolean |  |
| `summary` | text nullable |  |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### Post
Used by Moksha and Dharma for the lighter content surfaces.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `pillar` | enum | `moksha`, `dharma` |
| `post_type` | enum | `link`, `text`, `question`, `announcement`, `seva_opportunity` |
| `author_user_id` | UUID |  |
| `title` | string nullable |  |
| `body` | text nullable |  |
| `link_url` | string nullable | For link posts |
| `content_language` | enum | `en`, `ta`, `mixed` |
| `topic_tags` | string[] |  |
| `teacher_tags` | string[] | Moksha only |
| `starts_at` | timestamp nullable | Dharma seva only |
| `ends_at` | timestamp nullable | Dharma seva only |
| `location_text` | string nullable | Dharma seva only |
| `capacity` | integer nullable | Dharma seva only |
| `status` | enum | `active`, `removed`, `closed` |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### Comment

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `post_id` | UUID | FK to Post |
| `author_user_id` | UUID |  |
| `body` | text |  |
| `parent_comment_id` | UUID nullable | Keep nullable for future threading |
| `status` | enum | `active`, `removed` |
| `created_at` | timestamp |  |

### Job

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `posted_by_user_id` | UUID |  |
| `company_name` | string |  |
| `title` | string |  |
| `location_text` | string |  |
| `workplace_mode` | enum | `remote`, `hybrid`, `onsite` |
| `description` | text |  |
| `requirements` | text nullable |  |
| `skills` | string[] |  |
| `experience_min_years` | numeric nullable |  |
| `experience_max_years` | numeric nullable |  |
| `salary_min` | integer nullable |  |
| `salary_max` | integer nullable |  |
| `apply_mode` | enum | `in_app_intro`, `external_link`, `both` |
| `external_apply_url` | string nullable |  |
| `status` | enum | `draft`, `published`, `closed`, `removed` |
| `expires_at` | timestamp nullable |  |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### CandidateCard

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to profile owner |
| `title` | string | Preferred headline |
| `preferred_roles` | string[] |  |
| `location_text` | string |  |
| `workplace_modes` | string[] |  |
| `years_experience` | numeric nullable |  |
| `skills` | string[] |  |
| `summary` | text nullable |  |
| `status` | enum | `active`, `paused`, `removed` |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### MatchInterest

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `from_user_id` | UUID |  |
| `to_user_id` | UUID |  |
| `note` | string nullable | Short note |
| `status` | enum | `sent`, `mutual`, `withdrawn`, `declined` |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### IntroRequest
Shared structured contact workflow for Kama and Artha.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `context_type` | enum | `kama_match`, `job`, `candidate` |
| `context_id` | UUID | Match, job, or candidate reference |
| `requester_user_id` | UUID |  |
| `recipient_user_id` | UUID |  |
| `message` | string nullable |  |
| `status` | enum | `pending`, `approved`, `declined`, `cancelled` |
| `created_at` | timestamp |  |
| `responded_at` | timestamp nullable |  |

### SevaSignup

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `post_id` | UUID | FK to seva `Post` |
| `user_id` | UUID |  |
| `status` | enum | `interested`, `going`, `cancelled` |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### SavedItem

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `user_id` | UUID |  |
| `item_type` | enum | `post`, `job`, `candidate` |
| `item_id` | UUID |  |
| `created_at` | timestamp |  |

### Block

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `user_id` | UUID | Block initiator |
| `blocked_user_id` | UUID |  |
| `created_at` | timestamp |  |

### Report

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `reporter_user_id` | UUID |  |
| `target_type` | enum | `user`, `post`, `comment`, `job`, `candidate`, `match_interest` |
| `target_id` | UUID |  |
| `reason` | enum | `harassment`, `impersonation`, `spam`, `inappropriate_content`, `other` |
| `details` | text nullable |  |
| `status` | enum | `open`, `reviewing`, `resolved`, `dismissed` |
| `assigned_admin_user_id` | UUID nullable |  |
| `created_at` | timestamp |  |
| `updated_at` | timestamp |  |

### AdminAction

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Primary key |
| `admin_user_id` | UUID |  |
| `action_type` | enum | `remove_content`, `disable_user`, `restore_content`, `dismiss_report` |
| `target_type` | string |  |
| `target_id` | UUID |  |
| `report_id` | UUID nullable |  |
| `notes` | text nullable |  |
| `created_at` | timestamp |  |

## Relationship summary
- `User 1:1 Profile`
- `User 1:0..1 KamaProfile`
- `User 1:0..1 ArthaProfile`
- `User 1:N Job`
- `User 1:N CandidateCard`
- `User 1:N Post`
- `Post 1:N Comment`
- `Post 1:N SevaSignup` when `post_type = seva_opportunity`
- `User N:N User` through `Block`
- `User N:N User` through `MatchInterest`
- `User N:N User` through `IntroRequest`

## API design assumptions
- REST JSON API for MVP
- Bearer token auth after invite redemption and login
- Cursor pagination for list endpoints
- Soft-delete/removal for moderation-sensitive records
- Search first implemented with database filters; dedicated search service can be added later

## API endpoints

### Auth and invites
- `POST /v1/invites/validate`
  - Input: `code`
  - Output: validity, remaining redemptions, invite metadata safe for client
- `POST /v1/auth/start`
  - Input: phone or chosen login identifier, invite code
  - Output: challenge started
- `POST /v1/auth/verify`
  - Input: challenge token, otp
  - Output: auth token, user summary, onboarding state

### Profile
- `GET /v1/me`
- `PATCH /v1/me`
- `GET /v1/me/profile`
- `PUT /v1/me/profile`
- `GET /v1/me/settings`
- `PATCH /v1/me/settings`

### Kama
- `GET /v1/kama/profile/me`
- `PUT /v1/kama/profile/me`
- `PATCH /v1/kama/profile/me/visibility`
- `GET /v1/kama/profiles`
  - Query: city, age_min, age_max, language, education, occupation, page cursor, sort
- `GET /v1/kama/profiles/{userId}`
- `POST /v1/kama/interests`
  - Input: `to_user_id`, `note`
- `GET /v1/kama/interests/me`
- `POST /v1/kama/interests/{interestId}/withdraw`
- `GET /v1/kama/matches`
- `POST /v1/kama/matches/{matchUserId}/intro-requests`

### Artha jobs
- `GET /v1/artha/jobs`
  - Query: location, workplace_mode, experience_min, experience_max, skills, status
- `POST /v1/artha/jobs`
- `GET /v1/artha/jobs/{jobId}`
- `PATCH /v1/artha/jobs/{jobId}`
- `POST /v1/artha/jobs/{jobId}/save`
- `DELETE /v1/artha/jobs/{jobId}/save`
- `POST /v1/artha/jobs/{jobId}/intro-requests`

### Artha candidates
- `GET /v1/artha/candidates`
  - Query: location, experience_min, experience_max, skills, role
- `POST /v1/artha/candidates`
- `GET /v1/artha/candidates/{candidateId}`
- `PATCH /v1/artha/candidates/{candidateId}`
- `PATCH /v1/artha/candidates/{candidateId}/status`
- `POST /v1/artha/candidates/{candidateId}/save`
- `DELETE /v1/artha/candidates/{candidateId}/save`
- `POST /v1/artha/candidates/{candidateId}/intro-requests`

### Moksha and Dharma posts
- `GET /v1/posts`
  - Query: `pillar`, `post_type`, `language`, `topic`, `teacher`, `cursor`
- `POST /v1/posts`
- `GET /v1/posts/{postId}`
- `PATCH /v1/posts/{postId}`
- `POST /v1/posts/{postId}/save`
- `DELETE /v1/posts/{postId}/save`
- `GET /v1/posts/{postId}/comments`
- `POST /v1/posts/{postId}/comments`

### Dharma signups
- `POST /v1/dharma/seva/{postId}/signups`
  - Input: `status` = `interested` or `going`
- `PATCH /v1/dharma/seva/{postId}/signups/me`
- `GET /v1/dharma/seva/{postId}/signups`
  - Organizer/admin only

### Shared intro/contact workflow
- `GET /v1/intro-requests`
- `POST /v1/intro-requests/{introRequestId}/approve`
- `POST /v1/intro-requests/{introRequestId}/decline`

### Moderation and safety
- `POST /v1/reports`
- `POST /v1/blocks`
- `DELETE /v1/blocks/{blockedUserId}`
- `GET /v1/admin/reports`
- `GET /v1/admin/reports/{reportId}`
- `POST /v1/admin/reports/{reportId}/assign`
- `POST /v1/admin/reports/{reportId}/resolve`
- `POST /v1/admin/content/{targetType}/{targetId}/remove`
- `POST /v1/admin/users/{userId}/disable`
- `GET /v1/admin/audit-log`

## Authorization rules
- Users can edit only their own profile, extension records, jobs, and candidate cards unless admin.
- Contact details are only returned after intro approval.
- Blocked relationships suppress browse/search/detail visibility wherever relevant.
- Admin endpoints require `admin` role and all actions are audit logged.

## Rate limit recommendations
- Comment creation: 10 per 10 minutes
- Post creation: 5 per hour per pillar
- Kama interests: 20 per day
- Intro requests: 15 per day across Kama and Artha
- Reports: low enough to limit abuse, high enough not to suppress legitimate reporting

## Search and indexing recommendation
- Start with PostgreSQL indexes plus trigram/full-text where needed.
- Add filtered indexes for common browse dimensions:
  - Kama: city, age, languages, occupation
  - Artha jobs: location, workplace mode, skills
  - Artha candidates: location, years experience, skills
  - Posts: pillar, post_type, content_language, created_at

## Data protection notes
- Encrypt sensitive contact fields at rest where supported by the platform.
- Avoid storing raw media outside controlled object storage.
- Keep audit logs append-only.
- Store moderation notes separately from user-visible objects.

## Future-compatible extensions
- Real-time chat can be added later on top of `IntroRequest` approval states.
- Resume/document support can be added to Artha without redesigning the core candidate model.
- Richer Kama compatibility scoring can be derived from stored structured preferences without changing the base schema.
