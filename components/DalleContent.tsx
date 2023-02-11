import Image from 'next/image'
import styles from '@/styles/Dalle.module.css'
import DalleGallery from '@/components/DalleGallery';
import { useAppContext } from '@/context/appContext';

export default function DalleContent() {
  const { addImage, loading, setIsLoading } = useAppContext();
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      prompt: { value: string };
    };
    if(!target.prompt || target.prompt.value.length < 4) {
      return;
    }
    getImageData(target.prompt.value);
  };

  const getImageData = (prompt: string ) => {
    setIsLoading(true);
    console.log('prompt',prompt);
    fetch(`https://khanos-backend.herokuapp.com/api/v1/openai/getImage/${prompt}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          addImage({
            text: data.input,
            image: `data:image/png;base64,${data.output}`,
          });
        }
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <section className={styles['section-container-dalle']}>
      <div className={styles['top-panel']}>
        <div className={styles['dalle-img']}>
          <Image 
            src="/img/chatgpt-logo.png" 
            alt="the chatgpt logo"
            width={250}
            height={250}
          />
        </div>
        <div className={styles['what-title']}>
          <h2>Dall-<span className={styles['foxy']}>E</span> 2</h2>
          <h2><span className={styles['foxy']}>D</span>emo</h2>
        </div>
        <div className={styles['resume']}>
          <p><b>Dall-<span className={styles['foxy']}>E</span></b> is a large-scale image generation model that can create photorealistic images given a text description.</p>
        </div>
        <div className={styles['form-container']}>
          <form onSubmit={handleSubmit}>
            <div className={styles['input-label']}>
              {`Lets generate some FUN images using OpenAI.`}
            </div>
            <input
              className={styles['input-prompt']}
              type="text"
              placeholder="e.g. A photo of a cat"
              name='prompt'
              onKeyUp={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
            ></input>
            <div className={styles['input-description']}>
              {`The prompt is the text description of the image you want to generate.`}
            </div>
            <button className={styles['main-button']} type="submit">
              {loading ? 'Loading...' : 'Generate'}
            </button>
          </form>
        </div>
      </div>
      <div className={styles['bottom-panel']}>
        <DalleGallery />
      </div>
        
    </section>
  )
}