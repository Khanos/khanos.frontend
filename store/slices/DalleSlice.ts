import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { dalleType, dalleImageType } from "@/store/types";

interface DalleState {
  dalle: dalleType;
}

const initialState: DalleState = {
  dalle: {
    imageList: [],
  }
}

export const dalleSlice = createSlice({
  name: "dalle",
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<dalleImageType>) => {
      state.dalle.imageList = [ action.payload, ...state.dalle.imageList ];
    },
  },
})

export const { addImage } = dalleSlice.actions;

export default dalleSlice.reducer;