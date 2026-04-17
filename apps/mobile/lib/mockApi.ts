export type DharmaFilter = 'All' | 'Urgent' | 'Events' | 'Teaching' | 'Local';
export type ArthaFilter = 'For you' | 'Remote' | 'Product' | 'Engineering' | 'Chennai';
export type KamaFilter = 'All' | 'Family-ready' | 'Nearby' | 'Traditional' | 'Professional';

export type DharmaAgendaItem = {
  id: string;
  time: string;
  title: string;
  note: string;
};

export type DharmaPost = {
  id: string;
  category: Exclude<DharmaFilter, 'All'>;
  title: string;
  description: string;
  organizer: string;
  location: string;
  accent: string;
  saved: boolean;
  volunteered: boolean;
  joinedCount: number;
  body: string[];
};

export type ArthaJob = {
  id: string;
  company: string;
  role: string;
  location: string;
  details: string;
  note: string;
  skills: string[];
  accent: string;
  saved: boolean;
  applied: boolean;
  summary: string;
  qualifications: string[];
};

export type KamaProfile = {
  id: string;
  name: string;
  age: number;
  location: string;
  title: string;
  prompt: string;
  values: string[];
  accent: string;
  tint: string;
  saved: boolean;
  introRequested: boolean;
  bio: string;
  family: string;
  education: string;
  profession: string;
  languages: string[];
  lookingFor: string;
  highlights: string[];
};

export type MokshaCreator = {
  id: string;
  name: string;
  avatarUrl: string;
  accent: string;
  description: string;
  followers: string;
  following: boolean;
  bio: string;
  location: string;
  tradition: string;
  focus: string;
  yearsActive: string;
  facts: string[];
  portraitTint: string;
};

export type MokshaVideo = {
  id: string;
  creatorId: string;
  creator: string;
  title: string;
  meta: string;
  duration: string;
  accent: string;
  description: string;
  streamUrl: string;
  liked: boolean;
  likes: number;
  shares: number;
  comments: string[];
};

export type MokshaPost = {
  id: string;
  creatorId: string;
  creator: string;
  title: string;
  meta: string;
  accent: string;
  excerpt: string;
  body: string;
  liked: boolean;
  likes: number;
  shares: number;
  comments: string[];
};

export type MokshaFeedItem = {
  id: string;
  type: 'video' | 'post';
  itemId: string;
};

const dharmaAgenda: DharmaAgendaItem[] = [
  {
    id: 'agenda-1',
    time: '4:30 pm',
    title: 'Temple clean-up rotation',
    note: 'Bring gloves if you have them.',
  },
  {
    id: 'agenda-2',
    time: '6:00 pm',
    title: 'Youth mentoring introductions',
    note: 'Three students need career guidance.',
  },
];

const dharmaPosts: DharmaPost[] = [
  {
    id: 'dharma-1',
    category: 'Urgent',
    title: 'Need three volunteers for evening annadanam packing',
    description:
      'Parthasarathy Temple is short on hands from 5:30 pm to 7:00 pm. Food packing, queue flow, and elder assistance are the main needs.',
    organizer: 'Madhavan Iyer',
    location: 'Triplicane',
    accent: '#fff1f2',
    saved: false,
    volunteered: false,
    joinedCount: 14,
    body: [
      'The packing line is already set up. We mainly need people who can keep the movement smooth and help with handoff to the distribution team.',
      'If you are comfortable speaking with elders or helping first-time volunteers get oriented, that is especially useful tonight.',
    ],
  },
  {
    id: 'dharma-2',
    category: 'Teaching',
    title: 'Saturday reading circle for Vishnu Sahasranamam learners',
    description:
      'A calm beginner-friendly session with printed transliteration sheets and guided chanting in small groups.',
    organizer: 'Sowmya Narayanan',
    location: 'Mylapore',
    accent: '#eff6ff',
    saved: true,
    volunteered: false,
    joinedCount: 9,
    body: [
      'This is meant for beginners and families. No prior familiarity is needed.',
      'We will spend time on pronunciation, repetition, and a gentle pace rather than completion.',
    ],
  },
  {
    id: 'dharma-3',
    category: 'Local',
    title: 'Wheelchair-access ride assistance needed for utsavam night',
    description:
      'Looking for one driver and one companion volunteer for pickup, darshan support, and drop-off for two senior devotees.',
    organizer: 'Sesha Care Circle',
    location: 'Adyar',
    accent: '#f8fafc',
    saved: false,
    volunteered: true,
    joinedCount: 5,
    body: [
      'The route is straightforward and the family can coordinate timing directly after you respond.',
      'Comfort, patience, and clear communication matter more than speed.',
    ],
  },
];

const arthaJobs: ArthaJob[] = [
  {
    id: 'job-1',
    company: 'Sudar Labs',
    role: 'Founding Product Manager',
    location: 'Chennai · Hybrid',
    details: '5-8 yrs · Full-time',
    note: 'Alumni from your network work here.',
    skills: ['Roadmaps', '0→1', 'Consumer'],
    accent: '#e8f1f3',
    saved: true,
    applied: false,
    summary:
      'Lead early product direction, work closely with founders, and shape the operating cadence for a new consumer platform.',
    qualifications: [
      'Experience building and shipping user-facing products end to end.',
      'Comfort working directly with design and engineering in a fast loop.',
      'Strong writing and synthesis for founder-level product decisions.',
    ],
  },
  {
    id: 'job-2',
    company: 'Vedha Systems',
    role: 'Senior Frontend Engineer',
    location: 'Bengaluru · Remote-friendly',
    details: '4-7 yrs · Full-time',
    note: 'Strong fit based on React Native and product design overlap.',
    skills: ['React Native', 'TypeScript', 'Design systems'],
    accent: '#eef4f5',
    saved: false,
    applied: true,
    summary:
      'Own the mobile product experience, improve the design system, and partner with product to raise shipping quality.',
    qualifications: [
      'Production React Native experience with strong TypeScript habits.',
      'Comfort debugging product issues directly from user behavior.',
      'Taste for minimal interfaces and scalable UI primitives.',
    ],
  },
  {
    id: 'job-3',
    company: 'Temple Grid',
    role: 'Community Partnerships Lead',
    location: 'Chennai · On-site',
    details: '6+ yrs · Growth',
    note: 'Hiring manager responded to candidates within 3 days last month.',
    skills: ['Partnerships', 'Operations', 'Community'],
    accent: '#f4f1eb',
    saved: false,
    applied: false,
    summary:
      'Build temple and community partnerships, coordinate activations, and create trust-based growth loops across cities.',
    qualifications: [
      'Strong relationship-building with institutions and local communities.',
      'Clear written follow-through and operational discipline.',
      'Comfort traveling for events and partnership meetings.',
    ],
  },
];

const kamaProfiles: KamaProfile[] = [
  {
    id: 'kama-1',
    name: 'Ananya',
    age: 29,
    location: 'Chennai',
    title: 'Architect · Family-aware introductions',
    prompt:
      'Looking for someone calm, spiritually grounded, and open to building a thoughtful home.',
    values: ['Temple-going', 'Classical music', 'One city at a time'],
    accent: '#5b6d73',
    tint: '#e8eceb',
    saved: false,
    introRequested: false,
    bio:
      'I like simple routines, clean spaces, and conversations that are honest without being loud. I am interested in a steady long-term partnership.',
    family:
      'Close-knit family in Chennai. Parents are involved but respectful of pace and mutual clarity.',
    education: 'B.Arch, Anna University',
    profession: 'Lead Architect at Studio Three',
    languages: ['English', 'Tamil'],
    lookingFor:
      'A grounded person who values sincerity, family warmth, and a calm rhythm of life.',
    highlights: ['Verified identity', 'Family introductions optional', 'Open to relocation'],
  },
  {
    id: 'kama-2',
    name: 'Raghav',
    age: 31,
    location: 'Bengaluru',
    title: 'Product lead · Intentional dating',
    prompt:
      'Best first conversation: values, books, and how we want family life to feel five years from now.',
    values: ['Vegetarian', 'Travel-light', 'Respectful pace'],
    accent: '#51655b',
    tint: '#e7ede7',
    saved: true,
    introRequested: false,
    bio:
      'I care about emotional steadiness, mature communication, and relationships that grow through consistency rather than intensity.',
    family:
      'Family based in Coimbatore. Open to gradual introductions once both people feel aligned.',
    education: 'MBA, IIM Kozhikode',
    profession: 'Product Lead at a health-tech startup',
    languages: ['English', 'Tamil', 'Kannada'],
    lookingFor:
      'Someone thoughtful, kind, and comfortable balancing tradition with a modern work life.',
    highlights: ['Career stable', 'Temple visits monthly', 'Prefers slow introductions'],
  },
  {
    id: 'kama-3',
    name: 'Harini',
    age: 27,
    location: 'Coimbatore',
    title: 'Teacher · Family introductions welcome',
    prompt:
      'I value softness, humor, and people who show up reliably for community and family.',
    values: ['Teaching', 'Early mornings', 'Simple rituals'],
    accent: '#6a725f',
    tint: '#ebece5',
    saved: false,
    introRequested: true,
    bio:
      'I enjoy teaching, devotional music, and quiet weekends with family. I prefer clarity over drawn-out ambiguity.',
    family:
      'Joint-family values with a practical modern outlook. Parents are open and gentle.',
    education: 'M.A. English Literature',
    profession: 'Higher secondary school teacher',
    languages: ['English', 'Tamil'],
    lookingFor:
      'A patient and respectful person with a clear intention toward marriage.',
    highlights: ['Guardian mode enabled', 'Open to meeting families early', 'Nearby to Chennai'],
  },
  {
    id: 'kama-4',
    name: 'Sriram',
    age: 30,
    location: 'Hyderabad',
    title: 'Doctor · Long-term minded',
    prompt:
      'Interested in a grounded partnership with patience, sincerity, and room for both tradition and modern life.',
    values: ['Pilgrimage', 'Health', 'Small gatherings'],
    accent: '#4d6b51',
    tint: '#e6ede5',
    saved: false,
    introRequested: false,
    bio:
      'I value discipline, kindness, and making room for both service and rest. I prefer communication that is direct and considerate.',
    family:
      'Parents in Hyderabad. Sister married and settled in Bengaluru. Family values steadiness and simplicity.',
    education: 'MBBS, MD',
    profession: 'Internal medicine specialist',
    languages: ['English', 'Telugu', 'Tamil'],
    lookingFor:
      'Someone emotionally mature, rooted, and open to building family life with patience.',
    highlights: ['Doctor schedule', 'Open to relocation', 'Traditional but flexible'],
  },
];

function buildAvatarUrl(label: string, background: string, color = '3b2f25') {
  const name = encodeURIComponent(label);
  const bg = background.replace('#', '');
  return `https://ui-avatars.com/api/?name=${name}&background=${bg}&color=${color}&size=256&bold=true`;
}

const mokshaCreators: MokshaCreator[] = [
  {
    id: 'creator-1',
    name: 'Dr. Venkatesh',
    avatarUrl: buildAvatarUrl('Dr. Venkatesh', '#e8eee6'),
    accent: '#5f79a6',
    description: 'Short reflections on lived practice, temple rhythm, and devotional steadiness.',
    followers: '148K',
    following: true,
    bio:
      'A compact, calm creator profile for the Moksha prototype. The focus here is simple spiritual guidance that feels accessible in daily life.',
    location: 'Chennai',
    tradition: 'Sri Vaishnava',
    focus: 'Daily practice and reflection',
    yearsActive: '8 years',
    facts: ['Daily shorts', 'Temple reflections', 'Family-friendly'],
    portraitTint: '#f3f0ea',
  },
  {
    id: 'creator-2',
    name: 'Dushyanth Sridhar',
    avatarUrl: buildAvatarUrl('Dushyanth Sridhar', '#ece7de'),
    accent: '#55657a',
    description: 'Longer discourse clips and summary posts for scriptural listening.',
    followers: '392K',
    following: true,
    bio:
      'This profile is tuned for long-form talks, study-oriented clips, and steady listener engagement in the feed.',
    location: 'Bengaluru',
    tradition: 'Scriptural discourse',
    focus: 'Lectures and story-led explanation',
    yearsActive: '10 years',
    facts: ['Long-form talks', 'Festival series', 'Q&A sessions'],
    portraitTint: '#f4f1eb',
  },
  {
    id: 'creator-3',
    name: 'Velukkudi Krishnan',
    avatarUrl: buildAvatarUrl('Velukkudi Krishnan', '#e6efe6'),
    accent: '#6e8a70',
    description: 'Accessible talks, short answers, and structured spiritual study prompts.',
    followers: '521K',
    following: false,
    bio:
      'A creator layout for study-minded listeners who want a strong video library and post archive with easier discovery.',
    location: 'Srirangam',
    tradition: 'Sri Vaishnava discourse',
    focus: 'Structured talks and study prompts',
    yearsActive: '14 years',
    facts: ['Weekly uploads', 'Topic playlists', 'Beginner friendly'],
    portraitTint: '#eef4ef',
  },
  {
    id: 'creator-4',
    name: 'Velukkudi Ranganathan',
    avatarUrl: buildAvatarUrl('Velukkudi Ranganathan', '#e2e8f0'),
    accent: '#334155',
    description: 'Short-form clips and thoughtful text posts around devotional habits.',
    followers: '117K',
    following: false,
    bio:
      'This creator profile mixes short videos with concise posts so the feed can switch between lighter and denser formats.',
    location: 'Coimbatore',
    tradition: 'Spiritual reflection',
    focus: 'Devotional habits and study notes',
    yearsActive: '5 years',
    facts: ['Post-first format', 'Short clips', 'Study notes'],
    portraitTint: '#f8fafc',
  },
  {
    id: 'creator-5',
    name: 'Dr. D A Joseph',
    avatarUrl: buildAvatarUrl('Dr. D A Joseph', '#dcfce7'),
    accent: '#15803d',
    description: 'Gentle content on discipline, prayer rhythm, and evening listening.',
    followers: '94K',
    following: true,
    bio:
      'A prototype profile centered on slower listening, evening routines, and low-noise devotional content.',
    location: 'Hyderabad',
    tradition: 'Devotional listening',
    focus: 'Prayer rhythm and evening listening',
    yearsActive: '6 years',
    facts: ['Audio-first', 'Calm pacing', 'Short reflections'],
    portraitTint: '#f0fdf4',
  },
];

const mokshaVideos: MokshaVideo[] = [
  {
    id: 'video-1',
    creatorId: 'creator-1',
    creator: 'Dr. Venkatesh',
    title: 'A simple morning routine that stays realistic even on workdays',
    meta: '48K views · 2 days ago',
    duration: '12:18',
    accent: '#f3f0ea',
    description:
      'A compact video on keeping chanting, reading, and silence small enough to repeat consistently.',
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    liked: true,
    likes: 2400,
    shares: 186,
    comments: ['This format feels practical.', 'Would love a Tamil version too.'],
  },
  {
    id: 'video-2',
    creatorId: 'creator-2',
    creator: 'Dushyanth Sridhar',
    title: 'Why a longer story often teaches better than a short explanation',
    meta: '63K views · 4 days ago',
    duration: '18:06',
    accent: '#f4f1eb',
    description:
      'A longer listening clip on how narrative, memory, and repetition deepen spiritual attention.',
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    liked: false,
    likes: 3900,
    shares: 244,
    comments: ['This belongs in a playlist.', 'Very clear pacing.'],
  },
  {
    id: 'video-3',
    creatorId: 'creator-3',
    creator: 'Velukkudi Krishnan',
    title: 'Three questions to ask before starting any new study routine',
    meta: '76K views · 1 day ago',
    duration: '09:41',
    accent: '#eef3fb',
    description:
      'A short framework for deciding what to study, how much to commit, and what to keep repeatable.',
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    liked: true,
    likes: 5100,
    shares: 312,
    comments: ['Very useful framing.', 'This was easy to share in our group.'],
  },
  {
    id: 'video-4',
    creatorId: 'creator-4',
    creator: 'Velukkudi Ranganathan',
    title: 'How to make evening prayer feel calmer and less rushed',
    meta: '22K views · 5 days ago',
    duration: '07:54',
    accent: '#f8fafc',
    description:
      'A short clip on building one quiet transition between work, screens, and evening prayer.',
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    liked: false,
    likes: 1400,
    shares: 91,
    comments: ['Needed this reminder.'],
  },
  {
    id: 'video-5',
    creatorId: 'creator-5',
    creator: 'Dr. D A Joseph',
    title: 'An evening listening session for winding the mind down',
    meta: '31K views · 6 days ago',
    duration: '21:05',
    accent: '#f0fdf4',
    description:
      'A softer long-form session designed for low stimulation, repeated listening, and steadier breath.',
    streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    liked: true,
    likes: 2800,
    shares: 137,
    comments: ['Perfect for late evenings.', 'Please keep making more of these.'],
  },
];

const mokshaPosts: MokshaPost[] = [
  {
    id: 'post-1',
    creatorId: 'creator-1',
    creator: 'Dr. Venkatesh',
    title: 'A sustainable practice starts with a smaller promise',
    meta: 'Posted 1 day ago',
    accent: '#f3f0ea',
    excerpt:
      'If the routine only works on ideal mornings, it is too large. Shrink it until it survives real life.',
    body:
      'Keep one chant, one reading, and one brief silence. Repeat that structure for a month before you add anything else.',
    liked: false,
    likes: 860,
    shares: 74,
    comments: ['This is exactly the reset I needed.'],
  },
  {
    id: 'post-2',
    creatorId: 'creator-2',
    creator: 'Dushyanth Sridhar',
    title: 'Listening slowly is different from merely consuming content',
    meta: 'Posted 3 days ago',
    accent: '#f4f1eb',
    excerpt:
      'A discourse should leave an after-effect on memory and attention, not just a pile of notes.',
    body:
      'Try replaying one section twice instead of moving quickly to the next video. Depth usually appears after repetition.',
    liked: true,
    likes: 1320,
    shares: 98,
    comments: ['Strong point.', 'Replay has helped a lot.'],
  },
  {
    id: 'post-3',
    creatorId: 'creator-3',
    creator: 'Velukkudi Krishnan',
    title: 'Study notes work better when they end in one practical action',
    meta: 'Posted 4 days ago',
    accent: '#eef4ef',
    excerpt:
      'Every study session should leave you with one repeated action, not only a new idea.',
    body:
      'Write down a single thing you will repeat tomorrow. It could be one verse, one reflection, or one question to revisit.',
    liked: false,
    likes: 1740,
    shares: 121,
    comments: ['That final action point matters.'],
  },
  {
    id: 'post-4',
    creatorId: 'creator-4',
    creator: 'Velukkudi Ranganathan',
    title: 'Evening discipline becomes easier when the room looks quieter',
    meta: 'Posted 5 days ago',
    accent: '#f8fafc',
    excerpt:
      'Reduce the visual noise before you expect the mind to settle. Environment matters more than we admit.',
    body:
      'Dim one set of lights, keep one seat ready, and use the same starting audio each evening for a week.',
    liked: true,
    likes: 910,
    shares: 67,
    comments: ['The environment point is real.'],
  },
  {
    id: 'post-5',
    creatorId: 'creator-5',
    creator: 'Dr. D A Joseph',
    title: 'A gentle night routine needs fewer decisions, not more motivation',
    meta: 'Posted 6 days ago',
    accent: '#f0fdf4',
    excerpt:
      'Make the path obvious: one audio, one place, one time window. Consistency grows when choice shrinks.',
    body:
      'If you want an evening ritual to stay alive, decide the setup once and then remove daily negotiation from it.',
    liked: false,
    likes: 740,
    shares: 52,
    comments: ['This feels very doable.'],
  },
];

const mokshaFeed: MokshaFeedItem[] = [
  { id: 'feed-1', type: 'video', itemId: 'video-1' },
  { id: 'feed-2', type: 'post', itemId: 'post-1' },
  { id: 'feed-3', type: 'video', itemId: 'video-2' },
  { id: 'feed-4', type: 'post', itemId: 'post-2' },
  { id: 'feed-5', type: 'video', itemId: 'video-4' },
  { id: 'feed-6', type: 'post', itemId: 'post-3' },
];

function wait(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cloneItem<T extends object>(item: T): T {
  return { ...item };
}

function cloneList<T extends object>(list: T[]) {
  return list.map((item) => cloneItem(item));
}

function findOrThrow<T extends { id: string }>(list: T[], id: string) {
  const item = list.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`Item not found: ${id}`);
  }

  return item;
}

export async function listDharmaData() {
  await wait();

  return {
    agenda: cloneList(dharmaAgenda),
    posts: cloneList(dharmaPosts),
  };
}

export async function getDharmaPost(id: string) {
  await wait();
  return cloneItem(findOrThrow(dharmaPosts, id));
}

export async function toggleDharmaSaved(id: string) {
  await wait();
  const post = findOrThrow(dharmaPosts, id);
  post.saved = !post.saved;
  return cloneItem(post);
}

export async function toggleDharmaHelp(id: string) {
  await wait();
  const post = findOrThrow(dharmaPosts, id);
  post.volunteered = !post.volunteered;
  post.joinedCount += post.volunteered ? 1 : -1;
  post.joinedCount = Math.max(0, post.joinedCount);
  return cloneItem(post);
}

export async function createDharmaPost(input: {
  title: string;
  description: string;
  location: string;
  category: Exclude<DharmaFilter, 'All'>;
}) {
  await wait();

  const post: DharmaPost = {
    id: `dharma-${Date.now()}`,
    category: input.category,
    title: input.title,
    description: input.description,
    organizer: 'You',
    location: input.location,
    accent: '#eef3ea',
    saved: false,
    volunteered: false,
    joinedCount: 0,
    body: [
      input.description,
      'This request was created locally in the prototype and is ready for backend integration later.',
    ],
  };

  dharmaPosts.unshift(post);
  return cloneItem(post);
}

export async function listArthaJobs() {
  await wait();
  return cloneList(arthaJobs);
}

export async function getArthaJob(id: string) {
  await wait();
  return cloneItem(findOrThrow(arthaJobs, id));
}

export async function toggleArthaSaved(id: string) {
  await wait();
  const job = findOrThrow(arthaJobs, id);
  job.saved = !job.saved;
  return cloneItem(job);
}

export async function applyToArthaJob(id: string) {
  await wait();
  const job = findOrThrow(arthaJobs, id);
  job.applied = true;
  return cloneItem(job);
}

export async function listKamaProfiles() {
  await wait();
  return cloneList(kamaProfiles);
}

export async function getKamaProfile(id: string) {
  await wait();
  return cloneItem(findOrThrow(kamaProfiles, id));
}

export async function toggleKamaSaved(id: string) {
  await wait();
  const profile = findOrThrow(kamaProfiles, id);
  profile.saved = !profile.saved;
  return cloneItem(profile);
}

export async function requestKamaIntro(id: string) {
  await wait();
  const profile = findOrThrow(kamaProfiles, id);
  profile.introRequested = !profile.introRequested;
  return cloneItem(profile);
}

export async function listMokshaData() {
  await wait();

  return {
    creators: cloneList(mokshaCreators),
    videos: cloneList(mokshaVideos),
    posts: cloneList(mokshaPosts),
    feed: cloneList(mokshaFeed),
  };
}

export async function getMokshaCreator(id: string) {
  await wait();

  const creator = findOrThrow(mokshaCreators, id);

  return {
    creator: cloneItem(creator),
    videos: cloneList(mokshaVideos.filter((video) => video.creatorId === id)),
    posts: cloneList(mokshaPosts.filter((post) => post.creatorId === id)),
  };
}

export async function getMokshaVideo(id: string) {
  await wait();

  const video = findOrThrow(mokshaVideos, id);
  const creator = findOrThrow(mokshaCreators, video.creatorId);

  return {
    video: cloneItem(video),
    creator: cloneItem(creator),
  };
}

export async function toggleMokshaCreatorFollow(id: string) {
  await wait();
  const creator = findOrThrow(mokshaCreators, id);
  creator.following = !creator.following;
  return cloneItem(creator);
}

export async function toggleMokshaVideoReaction(id: string) {
  await wait();
  const video = findOrThrow(mokshaVideos, id);
  video.liked = !video.liked;
  video.likes += video.liked ? 1 : -1;
  video.likes = Math.max(0, video.likes);
  return cloneItem(video);
}

export async function toggleMokshaPostReaction(id: string) {
  await wait();
  const post = findOrThrow(mokshaPosts, id);
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  post.likes = Math.max(0, post.likes);
  return cloneItem(post);
}

export async function addMokshaVideoComment(id: string, comment: string) {
  await wait();
  const video = findOrThrow(mokshaVideos, id);
  const nextComment = comment.trim();

  if (nextComment) {
    video.comments.push(nextComment);
  }

  return cloneItem(video);
}

export async function addMokshaPostComment(id: string, comment: string) {
  await wait();
  const post = findOrThrow(mokshaPosts, id);
  const nextComment = comment.trim();

  if (nextComment) {
    post.comments.push(nextComment);
  }

  return cloneItem(post);
}

export async function shareMokshaVideo(id: string) {
  await wait();
  const video = findOrThrow(mokshaVideos, id);
  video.shares += 1;
  return cloneItem(video);
}

export async function shareMokshaPost(id: string) {
  await wait();
  const post = findOrThrow(mokshaPosts, id);
  post.shares += 1;
  return cloneItem(post);
}
