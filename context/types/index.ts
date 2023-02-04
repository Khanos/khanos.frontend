// Sidebar types
export type sidebarType = {
  isOpen: boolean;
};

// Github types
export type githubCommitType = {
  id: string;
  queryWord: string;
  author: {
    login: string;
    avatar: string;
  };
  commit: {
    message: string;
    date: string;
    url: string;
  };
  repo: {
    name: string;
    description: string;
  };
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