import styles from '@/styles/Chatgpt.module.css'
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch, useFetch } from '@/store/hooks';
import { addChatGptMessage, setUserMessage } from '@/store/slices/ChatGPTSlice';
import { setLoading } from '@/store/slices/MainSlice';
import ChatMessage from '@/components/ChatGPT/ChatMessage';
import type { chatGptMessageType } from '@/store/types';

export default function ChatContent() {
  const dispatch = useAppDispatch();
  const chatGpt = useAppSelector((state) => state.chatGpt.chatGpt);
  const { response, error, loading } = useFetch({
    url: chatGpt.userMessage ? 
      `https://khanos-backend.herokuapp.com/api/v1/openai/getResponse/${chatGpt.userMessage}`
      :
      '',
  });

  console.log('response', response, error);

  useEffect(() => {
    if (response) {
      const aiResponse = response.output.split('\n').slice(2).join('<br />');
      dispatch(addChatGptMessage({
        id: `ai-chat-${Date.now()}`,
        message: aiResponse,
        isUser: false,
      }));
      dispatch(setUserMessage(''));
      dispatch(setLoading(false));
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(addChatGptMessage({
        id: `ai-chat-${Date.now()}`,
        message: 'Ups, something went wrong. Please try again later.',
        isUser: false,
      }));
      dispatch(setLoading(false));
    }
  }, [error, dispatch]);

  // Handling the scroll to bottom of the chat content
  useEffect(() => {
    const chatContent = document.getElementById('chatContainer');
    if (chatContent) chatContent.scrollTop = chatContent.scrollHeight;
  }, [chatGpt.messageList.length]);

  return (
    <div id="chatContainer" className={styles['chat-content']}>
      {chatGpt.messageList.length > 0 && chatGpt.messageList.map((data: chatGptMessageType) => (
        <ChatMessage key={data.id} data={ data } />
      ))}
    </div>
  );
}