# Sesha MVP PRD

## Document status
- Version: V1
- Date: 2026-04-17
- Status: Draft ready for execution
- Product: Invite-only mobile app for the Ramanuja Sampradaya community across Dharma, Artha, Kama, Moksha

## Product summary
Sesha is an invite-only, India-first mobile community app with Tamil and English support. The MVP centers on four pillars:
- `Dharma`: seva opportunities, community announcements, and a private daily-practice checklist
- `Artha`: jobs and candidate discovery
- `Kama`: respectful matchmaking with profile-first browsing and structured introductions
- `Moksha`: spiritual content feed and lightweight Q&A

The MVP goes deep on `Kama` and `Artha` and keeps `Dharma` and `Moksha` reliable but intentionally lighter.

## Product goals
- Ship a calm, functional, modern mobile experience on iOS and Android.
- Create useful Sampradaya-aligned interactions without overbuilding.
- Validate demand first in matchmaking and jobs, where utility is highest.
- Keep trust and safety central: invite-only access, report/block flows, rate limits, and admin review.

## Non-goals
- Full real-time chat in MVP
- Astrology or horoscope workflows
- Donations, payments, and complex seva scheduling
- Live streaming or course infrastructure
- ATS-grade recruiting workflows

## Decisions made to unblock MVP
- Access is invite-only with referral codes and invite-chain tracking.
- MVP contact model is `structured intro/contact requests`, not free-form chat.
- Kama profiles are visible only within the Kama pillar by default.
- Guardian participation is opt-in at profile level, not required globally.
- Admin tooling ships as a separate web console, not in-app.
- Mobile is the primary client surface; no end-user web app in MVP.

## Target users
- Community member: wants aligned networking, content, and opportunities.
- Seeker/newcomer: wants guided entry and respectful participation.
- Matchmaking participant or guardian: wants discovery, filters, and safe introductions.
- Recruiter or hiring manager: wants jobs, discovery, and controlled contact.
- Seva coordinator: wants to post announcements and track interest.

## Success metrics
- Activation: invite accepted to completed signup conversion >= 55%
- Activation: first meaningful action within 24 hours >= 45%
- Kama: profile completion >= 60%, first interest sent within 7 days >= 25%
- Artha: at least 30% of active users view a job or candidate detail weekly
- Safety: report review median time under 24 hours in alpha/beta
- Retention: week-4 retention to be benchmarked in alpha, then improved release to release

## Experience principles
- Calm over noisy: simple layouts, restrained interaction patterns, no addictive swiping.
- Respectful by default: minimal exposure of personal contact data and explicit opt-ins.
- Utility first: each pillar solves a clear job to be done.
- Localization by design: Tamil and English are first-class, not bolted on.

## Information architecture

### Primary navigation
- `Dharma`
- `Artha`
- `Kama`
- `Moksha`
- `Profile`

### Global patterns
- Contextual search within each pillar
- Saved items/bookmarks where relevant
- Report/block on people and content
- App language toggle in settings
- Content language tags and filtering

## Scope overview

### In scope for MVP
- Invite-gated onboarding and core profile setup
- Pillar-specific profile extensions for Kama and Artha
- Kama discovery, filters, interests, and intro/contact approval flow
- Artha jobs, candidate cards, search/filter, and intro/contact approval flow
- Moksha posts, detail view, saves, comments, and question posts
- Dharma seva opportunities, announcements, signups, and private practice checklist
- Report/block, rate limiting, and basic moderation tooling
- Tamil and English localization for app UI and content tagging

### Out of scope for MVP
- Free-form chat or group chat
- Payments, subscriptions, or donations
- Video/live sessions inside the app
- Resume uploads, interview scheduling, or recruiter pipelines
- Complex volunteer shift planning
- Desktop or mobile web client for end users

## User stories and acceptance criteria

### 1. Invite, onboarding, and shared profile

#### User stories
- As an invited user, I want to redeem a referral code and join the app without searching publicly.
- As a new user, I want to complete one core profile and then opt into the pillars that matter to me.
- As a privacy-conscious user, I want my personal contact details hidden by default.

#### Acceptance criteria
- A valid invite code is required before account creation completes.
- A redeemed invite is tied to the new user and marked unusable if single-use.
- Onboarding collects core profile fields: display name, city, languages, short bio, role tags.
- Users can skip Kama and Artha extensions during onboarding and complete them later.
- Phone/email fields are not publicly shown by default.
- App language can be set to Tamil or English during onboarding or later in settings.

### 2. Kama

#### Objective
Enable respectful, profile-first matchmaking with controlled discovery and explicit contact approvals.

#### In scope
- Kama profile extension
- Optional photos
- Browse list/card views
- Filters and recommendation sorting
- Express interest with optional note
- Mutual match state
- Structured intro/contact request
- Block/report and spam controls

#### Out of scope
- Chat threads
- Audio/video calls
- Horoscope matching
- Algorithmic compatibility scoring beyond simple rule-based sorting

#### User stories
- As a participant, I want to create a profile that reflects both biodata and values.
- As a participant, I want to browse and filter profiles without the experience feeling gamified.
- As a participant, I want to send interest and optionally add a short respectful note.
- As a participant, I want contact sharing to happen only after both sides approve.
- As a guardian-enabled participant, I want to specify whether a guardian should be part of introductions.

#### Acceptance criteria
- Kama profile fields support: age, height, education, work, city, languages, optional temple affiliation, optional lineage preference, practice preferences, values prompts, guardian preference.
- Browse supports at minimum city, age range, language, education, occupation, and profile visibility filters.
- Profiles can be sorted by recent, recommended, or proximity/city relevance.
- Sending interest is disabled when the recipient is blocked, archived, or outside visibility rules.
- A mutual interest creates a match state but does not automatically reveal phone/email.
- Contact details are revealed only after both parties approve the structured intro/contact request.
- A user can block or report a profile from browse, profile detail, or match state.
- A user can pause Kama visibility without affecting the rest of the account.

### 3. Artha

#### Objective
Provide a credible community jobs and candidate discovery experience with lightweight contact workflows.

#### In scope
- Job listing creation and editing
- Candidate "open to work" cards
- Search and filters for jobs and candidates
- Structured intro/contact requests
- Save/bookmark job posts

#### Out of scope
- Resume/document uploads
- Interview scheduling
- Multi-stage application pipelines
- Recruiter team seats and permissions beyond admin

#### User stories
- As a recruiter, I want to post a job with skills, location, and requirements.
- As a job seeker, I want to create a candidate card and signal openness to work.
- As a user, I want to search and filter jobs or candidates quickly.
- As a recruiter or candidate, I want controlled contact rather than open DMs.

#### Acceptance criteria
- Job posts support title, company, location, workplace mode, description, requirements, optional salary range, skills tags, and experience level.
- Candidate cards support preferred roles, location, total experience, current role, skills, and a short summary.
- Job search supports location, experience level, workplace mode, and skills filters.
- Candidate search supports location, experience range, and skills filters.
- Users can save jobs and unsave them later.
- An intro/contact request records requester, recipient, subject context, status, and timestamps.
- Contact details are shared only after recipient approval.
- Closed or expired jobs are removed from default search results.

### 4. Moksha

#### Objective
Create a calm spiritual feed with saves, comments, and simple Q&A.

#### In scope
- Link and text posts
- Topic/teacher/language tagging
- Feed listing and content detail
- Saves/bookmarks
- Flat comments
- Question posts

#### Out of scope
- Live sessions
- Structured learning paths
- Rich moderation roles beyond admin review

#### User stories
- As a user, I want to browse a clean spiritual feed by topic, teacher, or language.
- As a user, I want to save useful content for later.
- As a user, I want to ask a respectful question and receive responses.

#### Acceptance criteria
- Moksha feed shows link posts, text posts, and question posts in a single list with type labels.
- Posts can be tagged by topic, teacher, and content language.
- Users can open a post detail view, see comments, and add a comment.
- Users can save or unsave a post from list or detail views.
- Questions are distinct post types and appear in the feed and detail views.

### 5. Dharma

#### Objective
Support service-oriented participation and simple day-to-day practice support.

#### In scope
- Seva opportunity posts
- Community/temple announcements
- Signup or attendance intent
- Capacity limits when configured
- Private daily practice checklist

#### Out of scope
- Shift management
- Payments
- Volunteer hour tracking

#### User stories
- As a coordinator, I want to post a seva opportunity with place and time.
- As a participant, I want to mark interest or attendance without friction.
- As a user, I want a lightweight private practice checklist that no one else sees.

#### Acceptance criteria
- Dharma posts support seva opportunities and announcements as distinct types.
- Seva opportunities support title, description, time, place, optional capacity, and organizer reference.
- Users can mark `Interested` or `Going`, and capacity enforcement applies only when configured.
- Practice checklist data is private to the user and never appears in public feeds.

### 6. Safety and moderation

#### User stories
- As a user, I want to report harassment, impersonation, spam, or inappropriate content.
- As a user, I want to block another user across the whole app.
- As an admin, I want to review reports, disable abusive accounts, and remove violating content.

#### Acceptance criteria
- Reports are available on user profiles, posts, comments, jobs, candidate cards, and seva opportunities.
- Report reasons include harassment, impersonation, spam, inappropriate content, and other.
- Blocking hides the blocked user and their content across all pillars.
- Admins can view open reports, change report status, disable accounts, and remove content.
- Admin actions are audit logged with actor, action, target, reason, and timestamp.
- Rate limits exist for comments, posts, interests, and intro requests.

### 7. Localization and accessibility

#### User stories
- As a Tamil-speaking user, I want the app chrome and navigation in Tamil.
- As a bilingual user, I want content to be filterable by language without losing relevant results.
- As a user with larger text settings, I want the UI to remain readable.

#### Acceptance criteria
- All navigation, settings, onboarding, and system messages ship in English and Tamil.
- Posts and profiles support language tags where relevant.
- Search/filter UI can restrict by language or show all.
- Mobile UI supports system text scaling and contrast-safe colors.

## Release gating

### Closed alpha
- Invite redemption works end to end
- Kama and Artha core flows are testable
- Reporting and blocking are functional
- Admin can review reports and disable accounts

### Beta
- Localization coverage is complete for app UI
- Rate limits and monitoring are in place
- Performance is acceptable on representative mid-range Android devices

### V1
- Matchmaking and job flows are stable under real user load
- Feed and seva experiences are reliable enough to support daily/weekly use
- Trust and safety operations have sustainable turnaround times

## Dependencies and risks
- Trust risk: community products fail quickly without strong moderation. Mitigation: admin console first, audit logs, invite-chain visibility.
- Privacy risk: Kama requires careful defaults. Mitigation: visibility isolation, contact hidden by default, explicit opt-ins.
- Localization risk: Tamil support can regress if added late. Mitigation: i18n from first implementation slice.
- Scope risk: chat or ATS features can derail MVP. Mitigation: hold to structured intros and lightweight workflows.

## Recommended implementation order
1. Onboarding, invites, auth, and shared profile
2. Kama profile, browse, filters, interests, and intro request flow
3. Artha jobs, candidate cards, search, and intro request flow
4. Moksha feed, post detail, comments, saves
5. Dharma board, signups, checklist
6. Admin console, moderation workflows, analytics hardening

## Related docs
- [Execution plan](./śeṣa_mvp_prd.plan.md)
- [Screen flows](./mvp_screen_flows.md)
- [Data model and API](./mvp_data_model_api.md)
- [Tech stack decision](./mvp_tech_stack.md)
