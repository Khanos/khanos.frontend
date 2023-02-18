import styles from '@/styles/Chatgpt.module.css'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLoading } from '@/store/slices/MainSlice';
import { setUserMessage, addChatGptMessage } from '@/store/slices/ChatGPTSlice';

export default function ChatForm() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.main.loading);
  const submitMessage = () => {
    const message = document.getElementsByName('message')[0] as HTMLInputElement;
    if(!message || message.value === '') return;
    const messageValue = message.value;
    message.value = ''; // Clear input
    dispatch(setUserMessage(messageValue));
    dispatch(addChatGptMessage({
      id: `${Date.now()}`,
      message: messageValue,
      isUser: true,
    }));
    dispatch(setLoading(true));
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