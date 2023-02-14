import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { sidebarType } from "@/store/types";

interface SidebarState {
  sidebar: sidebarType;
}

const initialState: SidebarState = {
  sidebar: {
    isOpen: false,
  },
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    hideSidebar: (state) => {
      state.sidebar.isOpen = false;
    },
    showSidebar: (state) => {
      state.sidebar.isOpen = true;
    },
  },
});

export const { toggleSidebar, hideSidebar, showSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;