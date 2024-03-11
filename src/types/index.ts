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
  };
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
    description: string;
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

export interface ProjectType {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

// Url Shortener types
export interface urlShortenerType {
  original_url: string;
  short_url: number;
  creation_date: string;
  error: string;
};