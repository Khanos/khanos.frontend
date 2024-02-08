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
    avatar_url: string;
  };
  commit: {
    message: string;
    author: {
      date: string;
    };
    url: string;
  };
  repository: {
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

// experience types
export type experienceType = {
  name: string;
  error: boolean;
  message: string;
  data?: any;
};

export type expItemType = {
  avatar: string,
  avatarAlt: string,
  avatarColor: string,
  avatarSize: {
    width: number,
    height: number,
  },
  title: string,
  company: string,
  location: string,
  description: string,
  tech: string[],
  date: string,
  link: string,
};