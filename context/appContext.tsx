import { createContext, useContext, ReactNode, useState } from "react";

type sidebarType = {
  isOpen: boolean;
};

type githubCommitType = {
  author: string;
  commit: {
    message: string;
    date: string;
    url: string;
  };
  id: string;
  queryWord: string;
};

type githubType = {
  commits: githubCommitType[];
};

type appContextType = {
  sidebar: sidebarType;
  toggleSidebar: () => void;
  hideSidebar: () => void;
  showSidebar: () => void;
  github: githubType;
  addCommit: (commit: githubCommitType) => void;
  setCommitList: (commitList: githubCommitType[]) => void;
};

const appContextDefaultValues: appContextType = {
  sidebar: {
    isOpen: false,
  },
  toggleSidebar: () => {},
  hideSidebar: () => {},
  showSidebar: () => {},
  github: {
    commits: [],
  },
  addCommit: () => {},
  setCommitList: () => {},
};

const AppContext = createContext<appContextType>(appContextDefaultValues);

export function useAppContext() {
    return useContext(AppContext);
}

type Props = {
    children: ReactNode;
};

export function AppProvider({ children }: Props) {
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


  const value = {
    // SideBar stuff
    sidebar,
    toggleSidebar,
    hideSidebar,
    showSidebar,
    // Github Stuff
    github,
    addCommit,
    setCommitList,
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