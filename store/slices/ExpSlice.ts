import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { experienceType } from "@/store/types";

interface DalleState {
  exp: experienceType;
}

const initialState: DalleState = {
  exp: {
    name: "experience",
    error: false,
    message: "",
    data: [],
  }
}

export const expSlice = createSlice({
  name: "dalle",
  initialState,
  reducers: {
    setExpData: (state, action: PayloadAction<experienceType>) => {
      state.exp.data = action.payload;
    }
  },
});

export const { setExpData } = expSlice.actions;

export default expSlice.reducer;