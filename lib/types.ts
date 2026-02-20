export type SourceStatus = 'active' | 'quarantined';

export type SubscriptionStatus = 'free' | 'standard' | 'plus' | 'premium' | 'trial';

export type Locale = 'es' | 'en';

export interface Team {
  id: string;
  key: string;
  sportId: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  language: Locale;
  primaryTeamId: string | null;
  secondaryTeamIds: string[] | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: string | null;
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SubscriptionFeature {
  subscriptionStatus: SubscriptionStatus;
  featureId: string;
  feature?: Feature;
}


export interface Source {
  id: string;
  name: string;
  url: string;
  teamId: string;
  logoUrl?: string;
  keywords?: string[];
  contentSelector?: string;
  articleLinkSelector?: string;
  status: SourceStatus;
  consecutiveFailures: number;
  quarantineThreshold: number;
}

export type TeamKey = 'liverpool' | 'everton';
export type SportKey = 'football';

export interface SourceMeta {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface BaseFeedItem {
  id: string;
  type: 'news' | 'news_group' | 'ephemeris' | 'photo_of_day';
  teamId: string;
  createdAt: string;
}

export interface ArticleLink {
  id: string;
  title: string;
  originalUrl: string;
  source: {
    name: string;
  };
}

export interface NewsItem extends BaseFeedItem {
  type: 'news';
  title: string;
  aiSummary: string;
  publishedAt: string;
  originalUrl: string;
  source: {
    name: string;
  };
}

export interface GroupedNewsItem extends BaseFeedItem {
  type: 'news_group';
  title: string;
  titleEn?: string;
  aiSummary: string;
  aiSummaryEn?: string;
  shortSummary?: string;
  shortSummaryEn?: string;
  publishedAt: string;
  articles: ArticleLink[];
  imageUrl?: string;
  rivalSentiment?: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
}

export interface EphemerisItem extends BaseFeedItem {
  type: 'ephemeris';
  title: string;
  shortSummary: string;
  detail: string;
}

export interface PhotoOfDayItem extends BaseFeedItem {
  type: 'photo_of_day';
  imageUrl: string;
  caption: string;
  originalPostUrl: string;
  source: { name: string };
  publishedAt: string;
}

export type FeedItem = NewsItem | GroupedNewsItem | EphemerisItem | PhotoOfDayItem;

export interface Efemeride {
  date: string;
  year: number;
  title: string;
  description: string;
  type: 'match' | 'birth' | 'title' | 'generic';
}