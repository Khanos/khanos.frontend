// Github types
export type GithubSearchProps = {
  setLoading: (loading: boolean) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  commits: githubCommitType[];
  setCommits: (commits: githubCommitType[] | []) => void;
};
export type GithubCardListProps = {
  loading: boolean;
  commits: githubCommitType[];
  searchQuery: string;
};
export type GithubCardProps = {
  commit: githubCommitType;
  searchQuery: string;
};
export type githubCommitType = {
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
export type githubType = {
  commits: githubCommitType[];
  searchWord: string;
};

// Chatbot types
export type chatGptMessageType = {
  id: string;
  message: string;
  isUser: boolean;
};
export type chatGptType = {
  messageList: chatGptMessageType[];
  userMessage: string;
  aiMessage: string;
}

// dalle types
export type dalleType = {
  imageList: dalleImageType[];
};
export type dalleImageType = {
  text: string;
  image: string;
};