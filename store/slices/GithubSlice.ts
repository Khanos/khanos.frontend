import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { githubType, githubCommitType } from "@/store/types";

interface GithubState {
  github: githubType;
}

const initialState: GithubState = {
  github: {
    commits: [],
    searchWord: '',
  },
};

export const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {
    addCommit: (state, action: PayloadAction<githubCommitType>) => {
      state.github.commits.push(action.payload);
    },
    setCommitList: (state, action: PayloadAction<githubCommitType[]>) => {
      state.github.commits = action.payload;
    },
    setGithubSearchWord: (state, action: PayloadAction<string>) => {
      state.github.searchWord = action.payload;
    }
  },
});

export const { addCommit, setCommitList, setGithubSearchWord } = githubSlice.actions;

export default githubSlice.reducer;