import { useEffect } from 'react';
import styles from '@/styles/Chatgpt.module.css'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLoading } from '@/store/slices/MainSlice';
import { addChatGptMessage } from '@/store/slices/ChatGPTSlice';

export default function ChatForm() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.main.loading);
  const submitMessage = () => {
    const message = document.getElementsByName('message')[0] as HTMLInputElement;
    if(!message || message.value === '') return;
    const messageValue = message.value;
    message.value = '';
    dispatch(setLoading(true));
    dispatch(addChatGptMessage({
      id: `${Date.now()}`,
      message: messageValue,
      isUser: true,
    }));

    fetch(`https://khanos-backend.herokuapp.com/api/v1/openai/getResponse/${messageValue}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          addChatGptMessage({
            id: `${Date.now()}`,
            message: `I'm sorry, I don't understand that. Please try again.`,
            isUser: false,
          });
        }
        const response = data.output.split('\n').slice(2).join('<br />');
        dispatch(addChatGptMessage({
          id: `${Date.now()}`,
          message: response,
          isUser: false,
        }));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(addChatGptMessage({
          id: `${Date.now()}`,
          message: `I'm sorry, I don't understand that. Please try again.`,
          isUser: false,
        }));
        dispatch(setLoading(false));
      });
  } 

  return (
    <div className={styles['chat-input-container']}>
      <input name='message' type="text" autoComplete="off" className={styles['chat-input']} onKeyUp={(e) => {
        if (e.key === "Enter") submitMessage();
      }}/>
      <button className={styles['chat-button']} onClick={submitMessage}>{
        loading ?
          <div className="snippet" data-title="dot-pulse">
            <div className="stage">
              <div className="dot-pulse"></div>
            </div>
          </div>
          : 
          'Send'
      }</button>
    </div>
  )
}