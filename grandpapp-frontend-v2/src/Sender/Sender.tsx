import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStopCircle } from '@fortawesome/free-solid-svg-icons'
import './Sender.css';
import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios'

enum ELang {
    'en-US' = 'en-US',
    'zh-CN' = 'zh-CN',
    'ja' = 'ja'
}

const Sender: React.FC = (props) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState<string>('');
    const [language, setLanguage] = useState<ELang>(ELang['en-US']);
    const [isListening, setIsListening] = useState(false);

    const [submitted, setSubmitted] = useState(false);
    

    const { 
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({  });
    
      useEffect(() => {
        if (isListening) {
          console.log('started listening');
        } else {
            // implement debounce
            if (transcript && transcript.length > 0 && submitted) {
                const timeout = setTimeout(async () => {
                    axios.post('https://grandappv2.onrender.com/listen', { user: name, transcript: transcript, color: color })
                }, 200);
        
                return () => {
                    clearTimeout(timeout);
                };
            }
        }
      }, [color, name, submitted, transcript, isListening])

    const disabled = color === undefined || color.length === 0 || name.length === 0 || language.length === 0;

    const handleSubmit = () => {
        if (name.length && name.length > 0 && color && color.length > 0) {
            setSubmitted(true)
        } 
    }

    const handleStartListen = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: language });
        setIsListening(true);
    }

    const handleStopListen = () => {
        SpeechRecognition.stopListening();
        setIsListening(false)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {
                submitted ? (
                    <>
                        <p>Click to record and send your voice</p>
                        {
                            isListening ? (
                                <FontAwesomeIcon onClick={handleStopListen} className='mic' style={{ color: isListening ? 'green' : 'gray' }} icon={faStopCircle} />
                                ) : (
                                <FontAwesomeIcon onClick={handleStartListen} className='mic' style={{ color: isListening ? 'green' : 'gray' }} icon={faMicrophone} />
                            )
                        }
                        <p>{transcript}</p>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1>What is your name?</h1>
                        <input
                            placeholder='name'
                            style={{
                                width: '300px',
                                padding: '1rem',
                                marginBottom: '1rem',
                            }}
                            onChange={(event) => setName(event.target.value)} />
                        <select
                            value={color}
                            onChange={(event) => setColor(event.target.value)}
                            style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }}>
                            <option value="">select color</option>
                            <option value="green">green</option>
                            <option value="blue">blue</option>
                            <option value="orange">orange</option>
                            <option value="red">red</option>
                            <option value="purple">purple</option>
                            <option value="#dbdb2c">yellow</option>
                            <option value="darkgray">gray</option>
                            <option value="brown">brown</option>
                        </select>
                        <select
                            value={language}
                            onChange={(event) => setLanguage(event.target.value as ELang)}
                            style={{ width: '100%', padding: '1rem' }}>
                            <option value="">select language</option>
                            <option value={ELang['en-US']}>English</option>
                            <option value={ELang.ja}>Japanese</option>
                            <option value={ELang['zh-CN']}>Chinese</option>
                        </select>
        
                        <button onClick={handleSubmit} className={`yes-button ${disabled ? 'disabled' : ''}`} style={{ marginTop: '1rem' }}>Submit</button>
                    </div>
                )
            }

        </div>
    )
}

export default Sender;