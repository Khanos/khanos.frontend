import { useAppContext } from '@/context/appContext';
import styles from '@/styles/Chatgpt.module.css'

export default function ChatForm() {
  const { addChatGptMessage, setIsLoading, loading } = useAppContext();
  const submitMessage = () => {
    // Get the message from the input field using typescript
    const message = document.getElementsByName('message')[0] as HTMLInputElement;
    if(!message || message.value === '') return;
    
    setIsLoading(true);
    addChatGptMessage({
      id: `${Date.now()}`,
      message: message.value,
      isUser: true,
    });

    fetch(`https://khanos-backend.herokuapp.com/api/v1/mocked/openai/getResponse/${message.value}`)
      .then((response) => response.json())
      .then((data) => {
        message.value = '';
        if (data.error) {
          addChatGptMessage({
            id: `${Date.now()}`,
            message: `I'm sorry, I don't understand that. Please try again.`,
            isUser: false,
          });
        }
        console.log(data.output);
        const response = data.output.split('\n').slice(2).join('<br />');
        addChatGptMessage({
          id: `${Date.now()}`,
          message: response,
          isUser: false,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        addChatGptMessage({
          id: `${Date.now()}`,
          message: `I'm sorry, I don't understand that. Please try again.`,
          isUser: false,
        });
        setIsLoading(false);
      });
  } 
  return (
    <div className={styles['chat-input-container']}>
      <input name='message' type="text" className={styles['chat-input']} onKeyUp={(e) => {
        if (e.key === "Enter") submitMessage();
      }}/>
      <button className={styles['chat-button']} onClick={submitMessage}>{
        loading ?
          'loading...'
          : 
          'Send'
      }</button>
    </div>
  )
}