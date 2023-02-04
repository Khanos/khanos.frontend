import { createContext, useContext, ReactNode, useState } from "react";
import { sidebarType, githubCommitType, githubType, chatGptMessageType, chatGptType, dalleType, dalleImageType } from "@/context/types";

type appContextType = {
  loading: boolean;
  setIsLoading: (loading: boolean) => void;
  sidebar: sidebarType;
  toggleSidebar: () => void;
  hideSidebar: () => void;
  showSidebar: () => void;
  github: githubType;
  addCommit: (commit: githubCommitType) => void;
  setCommitList: (commitList: githubCommitType[]) => void;
  setGithubSearchWord: (searchWord: string) => void;
  chatGpt: chatGptType;
  addChatGptMessage: (message: chatGptMessageType) => void;
  dalle: dalleType;
  addImage: (image: dalleImageType) => void;
};

const appContextDefaultValues: appContextType = {
  loading: false,
  setIsLoading: () => {},
  sidebar: {
    isOpen: false,
  },
  toggleSidebar: () => {},
  hideSidebar: () => {},
  showSidebar: () => {},
  github: {
    commits: [],
    searchWord: '',
  },
  addCommit: () => {},
  setCommitList: () => {},
  setGithubSearchWord: () => {},
  chatGpt: {
    messageList: [{
      id: '00001',
      message: `Hi, I'm a chatbot that uses GPT-3 to answer your questions. Ask me anything!`,
      isUser: false,
    }],
    userMessage: '',
    aiMessage: '',
  },
  addChatGptMessage: () => {},
  dalle: {
    imageList: [],
  },
  addImage: () => {},
};

const AppContext = createContext<appContextType>(appContextDefaultValues);
export function useAppContext() {
    return useContext(AppContext);
}

type Props = {
    children: ReactNode;
};
export function AppProvider({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(appContextDefaultValues.loading);
  const setIsLoading = (loading: boolean) => {
    setLoading(loading);
  };
  // SideBar stuff
  const [sidebar, setSidebar] = useState<sidebarType>(appContextDefaultValues.sidebar);
  const toggleSidebar = () => {
    setSidebar((prev) => {
      return {
        ...prev,
        isOpen: !prev.isOpen,
      };
    });
  };
  const hideSidebar = () => {
    setSidebar((prev) => {
      return {
        ...prev,
        isOpen: false,
      };
    });
  };
  const showSidebar = () => {
    setSidebar((prev) => {
      return {
        ...prev,
        isOpen: true,
      };
    });
  };

  // Github stuff
  const [github, setGithub] = useState<githubType>(appContextDefaultValues.github);
  const addCommit = (commit: githubCommitType) => {
    setGithub((prev) => {
      return {
        ...prev,
        commits: [...prev.commits, commit],
      };
    });
  };
  const setCommitList = (commitList: githubCommitType[]) => {
    setGithub((prev) => {
      return {
        ...prev,
        commits: commitList,
      };
    });
  };
  const setGithubSearchWord = (searchWord: string) => {
    setGithub((prev) => {
      return {
        ...prev,
        searchWord,
      };
    });
  };

  // ChatGpt stuff
  const [chatGpt, setChatGpt] = useState<chatGptType>(appContextDefaultValues.chatGpt);
  const addChatGptMessage = (message: chatGptMessageType) => {
    setChatGpt((prev) => {
      return {
        ...prev,
        messageList: [...prev.messageList, message],
      };
    });
  };

  // Dalle stuff
  const [dalle, setDalle] = useState<dalleType>(appContextDefaultValues.dalle);
  const addImage = (image: dalleImageType) => {
    setDalle((prev) => {
      return {
        ...prev,
        imageList: [...prev.imageList, image],
      };
    });
  };


  const value = {
    loading,
    setIsLoading,
    // SideBar stuff
    sidebar,
    toggleSidebar,
    hideSidebar,
    showSidebar,
    // Github Stuff
    github,
    addCommit,
    setCommitList,
    setGithubSearchWord,
    // ChatGpt Stuff
    chatGpt,
    addChatGptMessage,
    // Dalle Stuff
    dalle,
    addImage,
    // Other Stuff
  };

  return (
      <>
          <AppContext.Provider value={value}>
              {children}
          </AppContext.Provider>
      </>
  );
}