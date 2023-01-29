import { createContext, useContext, ReactNode, useState } from "react";

type sidebarType = {
  isOpen: boolean;
};

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

type githubType = {
  commits: githubCommitType[];
  searchWord: string;
};

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