import { useAppContext } from '@/context/appContext';
import type { chatGptMessageType } from '@/context/types';
import ChatMessage from '@/components/Chat/ChatMessage';
import styles from '@/styles/Chatgpt.module.css'
import { useEffect } from 'react';

export default function ChatContent() {
  const { chatGpt } = useAppContext();
  // Scroll to the bottom of the chat content
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