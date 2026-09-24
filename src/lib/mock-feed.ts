export type FeedCategory =
  | "all"
  | "politics"
  | "economy"
  | "society"
  | "tech"
  | "sports"
  | "world";

export type MockSource = {
  id: string;
  publisher: string;
  title: string;
  url: string;
  publishedAt: string;
};

export type MockOption = {
  id: string;
  label: string;
  voteCount: number;
};

export type MockPoll = {
  id: string;
  question: string;
  category: Exclude<FeedCategory, "all">;
  options: MockOption[];
  sources: MockSource[];
  voteCount: number;
  commentCount: number;
  publishedAt: string;
};

export const CATEGORIES: { id: FeedCategory; label: string }[] = [
  { id: "all", label: "Trending" },
  { id: "politics", label: "Politics" },
  { id: "economy", label: "Economy" },
  { id: "society", label: "Society" },
  { id: "tech", label: "Tech" },
  { id: "sports", label: "Sports" },
  { id: "world", label: "World" },
];

/** Scaffold mock data — replace with trending feed API when ingest is live. */
export const MOCK_POLLS: MockPoll[] = [
  {
    id: "poll-1",
    question:
      "Should Türkiye raise the minimum wage again before the end of the year?",
    category: "economy",
    options: [
      { id: "o1a", label: "Yes — inflation demands it", voteCount: 1842 },
      { id: "o1b", label: "No — wait for next cycle", voteCount: 967 },
      { id: "o1c", label: "Only with tax relief", voteCount: 521 },
    ],
    sources: [
      {
        id: "s1a",
        publisher: "Hürriyet",
        title: "Asgari ücret tartışması yeniden alevlendi",
        url: "https://example.com/hurriyet-asgari",
        publishedAt: "2026-09-22T08:00:00Z",
      },
      {
        id: "s1b",
        publisher: "Reuters",
        title: "Turkey minimum wage debate resurfaces",
        url: "https://example.com/reuters-wage",
        publishedAt: "2026-09-22T11:30:00Z",
      },
    ],
    voteCount: 3330,
    commentCount: 412,
    publishedAt: "2026-09-23T10:00:00Z",
  },
  {
    id: "poll-2",
    question:
      "Is AI-written news summarization trustworthy enough for daily briefings?",
    category: "tech",
    options: [
      { id: "o2a", label: "Yes, with clear sourcing", voteCount: 1204 },
      { id: "o2b", label: "Only for soft news", voteCount: 890 },
      { id: "o2c", label: "No — too risky", voteCount: 1566 },
    ],
    sources: [
      {
        id: "s2a",
        publisher: "The Verge",
        title: "Newsrooms rethink AI summaries",
        url: "https://example.com/verge-ai",
        publishedAt: "2026-09-21T16:00:00Z",
      },
    ],
    voteCount: 3660,
    commentCount: 288,
    publishedAt: "2026-09-22T18:00:00Z",
  },
  {
    id: "poll-3",
    question: "Should major cities ban private cars from downtown cores on weekdays?",
    category: "society",
    options: [
      { id: "o3a", label: "Full ban on weekdays", voteCount: 742 },
      { id: "o3b", label: "Congestion charge only", voteCount: 1103 },
      { id: "o3c", label: "Keep access as-is", voteCount: 655 },
    ],
    sources: [
      {
        id: "s3a",
        publisher: "BBC",
        title: "City centres push car-free pilots",
        url: "https://example.com/bbc-carfree",
        publishedAt: "2026-09-20T09:00:00Z",
      },
      {
        id: "s3b",
        publisher: "NTV",
        title: "İstanbul’da araçsız alan tartışması",
        url: "https://example.com/ntv-cars",
        publishedAt: "2026-09-20T14:00:00Z",
      },
    ],
    voteCount: 2500,
    commentCount: 190,
    publishedAt: "2026-09-21T12:00:00Z",
  },
  {
    id: "poll-4",
    question: "Will the national football team reach the next major tournament final?",
    category: "sports",
    options: [
      { id: "o4a", label: "Yes", voteCount: 2100 },
      { id: "o4b", label: "No", voteCount: 980 },
    ],
    sources: [
      {
        id: "s4a",
        publisher: "TRT Spor",
        title: "Milli takım hazırlık kampı başladı",
        url: "https://example.com/trt-milli",
        publishedAt: "2026-09-19T07:00:00Z",
      },
    ],
    voteCount: 3080,
    commentCount: 520,
    publishedAt: "2026-09-20T08:00:00Z",
  },
];
