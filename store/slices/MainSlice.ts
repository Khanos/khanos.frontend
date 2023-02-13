import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MainState {
  loading: boolean;
  error: string | null;
}

const initialState: MainState = {
  loading: false,
  error: null,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
})

export const { setLoading } = mainSlice.actions;

export default mainSlice.reducer;