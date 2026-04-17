# Sesha MVP Screen List and Flows

## Purpose
This document converts the MVP PRD into a build-oriented screen inventory and task flows for the mobile app and the admin console.

## App structure

### Entry flow
- Splash
- Invite gate
- Auth verification
- Onboarding
- Main tab shell

### Main tabs
- Dharma
- Artha
- Kama
- Moksha
- Profile

### Shared secondary screens
- Search/filter sheet
- Saved items
- Report sheet
- Block confirmation
- Intro/contact request sheet
- Notifications/inbox

## Screen inventory

### Entry and account
- `Splash`: bootstraps session, locale, remote config
- `InviteGate`: enter invite code, validate, continue
- `AuthVerification`: phone OTP or chosen secure login method
- `OnboardingWelcome`: explain pillars and invite-only norms
- `CoreProfileSetup`: display name, city, languages, short bio, role tags
- `PillarSelection`: choose whether to complete Kama and/or Artha setup now
- `NotificationPermission`: optional

### Dharma
- `DharmaFeed`: mixed list of seva opportunities and announcements
- `DharmaDetail`: full post details and organizer info
- `DharmaSignupSheet`: interested/going selection
- `DharmaComposer`: create seva opportunity or announcement
- `PracticeChecklist`: private daily checklist

### Artha
- `ArthaHome`: segmented jobs/candidates entry
- `JobList`: searchable/filterable list of jobs
- `JobDetail`: full listing, save, apply/intro actions
- `JobComposer`: create or edit a job
- `CandidateList`: searchable/filterable list of candidate cards
- `CandidateDetail`: candidate summary, skills, intro/contact action
- `CandidateComposer`: create or edit open-to-work card
- `ArthaFilterSheet`: filters for jobs or candidates

### Kama
- `KamaHome`: browse entry with recommendation and filter summary
- `KamaBrowse`: list/card browse
- `KamaProfileDetail`: profile details, photos, values prompts, interest action
- `KamaFilters`: filter and visibility settings
- `KamaProfileComposer`: create or edit matchmaking profile
- `InterestSentState`: confirmation and pending state
- `MutualMatchDetail`: mutual interest state and intro/contact request action

### Moksha
- `MokshaFeed`: link, text, and question posts
- `MokshaDetail`: content detail, comments, save
- `MokshaComposer`: create link/text/question post
- `MokshaFilterSheet`: topic, teacher, language filters

### Profile and settings
- `ProfileHome`: shared profile summary and pillar completion status
- `EditCoreProfile`
- `SavedItems`
- `MyActivity`: jobs posted, candidate card, interests, signups
- `Settings`: app language, notifications, privacy, logout
- `PrivacySettings`: contact visibility, Kama visibility, block list
- `BlockedUsers`

### Admin web console
- `AdminLogin`
- `AdminReportQueue`
- `AdminReportDetail`
- `AdminUserDetail`
- `AdminContentDetail`
- `AdminAuditLog`

## Core flows

### 1. Invite to onboarding
`Splash -> InviteGate -> AuthVerification -> OnboardingWelcome -> CoreProfileSetup -> PillarSelection -> MainTabShell`

#### Notes
- Invite validation happens before account creation completes.
- Core profile is mandatory.
- Kama and Artha extensions are skippable but prompted.

### 2. Kama browse to intro
`KamaHome -> KamaBrowse -> KamaProfileDetail -> SendInterest -> InterestSentState`

If mutual:
`InterestSentState or Notifications/Inbox -> MutualMatchDetail -> IntroContactRequestSheet -> ApprovalPending`

If approved:
`ApprovalPending -> ContactSharedState`

#### Edge conditions
- If blocked or reported, the target disappears from browse and match views.
- If profile visibility is paused, the user can still view others but is not shown in discovery.

### 3. Artha jobs flow
`ArthaHome -> JobList -> JobDetail -> Save or Apply/IntroRequest`

Poster flow:
`ArthaHome -> JobComposer -> Publish -> JobDetail`

#### Edge conditions
- Expired or closed jobs are labeled and excluded from default active search.
- External apply opens a safe external link confirmation.

### 4. Artha candidate flow
`ArthaHome -> CandidateList -> CandidateDetail -> IntroContactRequest`

Candidate setup:
`ProfileHome or ArthaHome -> CandidateComposer -> Publish -> CandidateDetail`

#### Edge conditions
- Candidate cards can be paused without deleting the account.
- Contact is only revealed after approval.

### 5. Moksha feed to discussion
`MokshaFeed -> MokshaDetail -> Comment or Save`

Question post flow:
`MokshaFeed -> MokshaComposer -> Publish -> MokshaDetail`

#### Edge conditions
- Language filters persist across sessions if the user has set a preference.
- Deleted posts show a removed state if opened from stale notifications.

### 6. Dharma board to signup
`DharmaFeed -> DharmaDetail -> DharmaSignupSheet -> SignedUpState`

Coordinator flow:
`DharmaFeed -> DharmaComposer -> Publish -> DharmaDetail`

Private practice:
`DharmaFeed or ProfileHome -> PracticeChecklist`

#### Edge conditions
- If capacity is full, `Interested` can remain available while `Going` is disabled.
- Practice checklist does not appear in social activity surfaces.

### 7. Safety flow
From any profile, post, comment, job, candidate card, or seva opportunity:
`OverflowMenu -> ReportSheet -> SubmittedState`

Block flow:
`OverflowMenu -> BlockConfirmation -> BlockedState`

#### Notes
- Report reasons are standardized to support triage.
- Block is global across all pillars.

### 8. Admin review flow
`AdminLogin -> AdminReportQueue -> AdminReportDetail -> Action`

Possible actions:
- Dismiss report
- Remove content
- Disable account
- Leave internal note

Then:
`Action -> AuditLogEntry`

## UX implementation notes
- Keep top-level navigation identical across tabs.
- Use one shared component system for list rows, filter chips, empty states, and moderation actions.
- Avoid swipe-heavy interaction patterns in Kama.
- Prefer bottom sheets for actions like filters, reports, and contact requests.
- Keep all composer forms multi-step only where complexity justifies it; otherwise use one screen with sections.

## Build priority
1. Entry flow and shared profile
2. Kama browse/profile/interest flow
3. Artha list/detail/composer flows
4. Moksha feed/detail/composer flow
5. Dharma board/signup/checklist flow
6. Admin moderation screens
