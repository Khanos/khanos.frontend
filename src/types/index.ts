// Github types
export interface GithubSearchProps {
  setLoading: (loading: boolean) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  commits: githubCommitType[];
  setCommits: (commits: githubCommitType[] | []) => void;
};
export interface GithubCardListProps {
  loading: boolean;
  commits: githubCommitType[];
  searchQuery: string;
};
export interface GithubCardProps {
  commit: githubCommitType;
  searchQuery: string;
};
export interface githubCommitType {
  id: string;
  queryWord: string;
  author: {
    login: string;
    avatar_url: string;
  } | null;
  commit: {
    message: string;
    author: {
      date: string;
      name: string;
    };
    url: string;
  };
  repository: {
    name: string;
    description: string | null;
    html_url: string;
  };
  html_url: string;
};
export interface githubType {
  commits: githubCommitType[];
  searchWord: string;
};

// Chatbot types
export interface chatGptMessageType {
  id: string;
  message: string;
  isUser: boolean;
};
export interface chatGptType {
  messageList: chatGptMessageType[];
  userMessage: string;
  aiMessage: string;
}

// dalle types
export interface dalleType {
  imageList: dalleImageType[];
};
export interface dalleImageType {
  text: string;
  image: string;
};

export interface ProjectShowcase {
  summary: string;
  description?: string;
  purpose?: string;
  status?: 'public' | 'private' | 'experimental' | 'archived';
  statusNote?: string;
  images?: { src: string | import('astro').ImageMetadata; alt: string; caption?: string }[];
  highlights?: { title: string; description: string }[];
  tech?: string[];
  links?: { label: string; url: string; type: 'repository' | 'live' | 'article' | 'documentation' }[];
}

export interface ProjectType {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  showcase?: ProjectShowcase;
}

// Url Shortener types
export interface urlShortenerListProps {
  urlList: urlShortenerType[];
  onDelete: (code: number) => Promise<void>;
  disabled: boolean;
};

export interface urlShortenerType {
  _id: string;
  original_url: string;
  short_url: number;
  creation_date: string;
};

export interface urlListType {
  message: string;
  data: urlShortenerType[];
  error: false;
  pagination: { limit: number; next: string | null };
};

// Lab cards share the portfolio project model, with imported or public covers.
export interface LabProject extends Omit<ProjectType, 'image'> {
  image: string | import('astro').ImageMetadata;
  status: string;
  linkLabel: string;
  liveHref?: string;
}
