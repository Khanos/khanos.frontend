import { configureStore } from '@reduxjs/toolkit'
import mainReducer from '@/store/slices/MainSlice'
import sidebarReducer from '@/store/slices/SidebarSlice'
import chatGptReducer from '@/store/slices/ChatGPTSlice'
import githubReducer from '@/store/slices/GithubSlice'
import dalleReducer from '@/store/slices/DalleSlice'

export const store = configureStore({
  reducer: {
    main: mainReducer,
    sidebar: sidebarReducer,
    chatGpt: chatGptReducer,
    github: githubReducer,
    dalle: dalleReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch