import type { chatGptMessageType } from '@/store/types';
import ChatMessage from '@/components/ChatGPT/ChatMessage';
import styles from '@/styles/Chatgpt.module.css'
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export default function ChatContent() {
  const chatGpt = useAppSelector((state) => state.chatGpt.chatGpt);
  useEffect(() => {
    const chatContent = document.getElementById('chatContainer');
    if (chatContent) chatContent.scrollTop = chatContent.scrollHeight;
  }, [chatGpt.messageList]);

  return (
    <div id="chatContainer" className={styles['chat-content']}>
      {chatGpt.messageList.map((data: chatGptMessageType) => (
        <ChatMessage key={data.id} data={ data } />
      ))}
    </div>
  );
}