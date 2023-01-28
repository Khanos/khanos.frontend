import { createContext, useContext, ReactNode, useState } from "react";

type sidebarType = {
  isOpen: boolean;
};

type appContextType = {
  sidebar: sidebarType;
  toggleSidebar: () => void;
  hideSidebar: () => void;
  showSidebar: () => void;
};

const appContextDefaultValues: appContextType = {
  sidebar: {
    isOpen: false,
  },
  toggleSidebar: () => {},
  hideSidebar: () => {},
  showSidebar: () => {},
};

const AppContext = createContext<appContextType>(appContextDefaultValues);

export function useApp() {
    return useContext(AppContext);
}

type Props = {
    children: ReactNode;
};

export function AppProvider({ children }: Props) {
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

    const value = {
        // SideBar stuff
        sidebar,
        toggleSidebar,
        hideSidebar,
        showSidebar,
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