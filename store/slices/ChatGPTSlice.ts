import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { chatGptType, chatGptMessageType } from "@/store/types";

interface ChatGPTState {
  chatGpt: chatGptType;
}

const initialState: ChatGPTState = {
  chatGpt: {
    messageList: [{
      id: '00001',
      message: `Hi, I'm a chatbot that uses GPT-3 to answer your questions. Ask me anything!`,
      isUser: false,
    }],
    userMessage: '',
    aiMessage: '',
  },
};

export const chatGptSlice = createSlice({
  name: "chatGpt",
  initialState,
  reducers: {
    addChatGptMessage: (state, action: PayloadAction<chatGptMessageType>) => {
      state.chatGpt.messageList.push(action.payload);
    },
    setUserMessage: (state, action: PayloadAction<string>) => {
      state.chatGpt.userMessage = action.payload;
    },
    setAiMessage: (state, action: PayloadAction<string>) => {
      state.chatGpt.aiMessage = action.payload;
    }
  },
});

export const { addChatGptMessage, setUserMessage, setAiMessage } = chatGptSlice.actions;

export default chatGptSlice.reducer;