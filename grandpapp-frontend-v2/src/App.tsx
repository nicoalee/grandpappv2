import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Listener from './Listener/Listener';
import Sender from './Sender/Sender';

const App = () => {
  
  const [isListener, setIsListener] = useState<boolean>();

  return (
    <div style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
      {
        isListener === undefined ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h1>Are you grandpa?</h1>
            </div>
            <div>
              <button onClick={() => setIsListener(true)} className="yes-button" style={{ marginRight: '1rem' }}>Yes, I am grandpa.</button>
              <button onClick={() => setIsListener(false)} className="no-button">No, I am not grandpa.</button>
            </div>
          </div>
        ) : (
          isListener ? (
            <Listener />
          ) : (
            <Sender />
          )
        )
      }

      {/* <button onClick={() => SpeechRecognition.startListening()}>Start</button>
      <button onClick={() => SpeechRecognition.stopListening()}>Stop</button>
      <button onClick={() => resetTranscript()}>Reset</button>
      <div>listening: {listening ? 'YES' : 'NO'}</div>
      <p>{transcript}</p>
      <div>{JSON.stringify(browserSupportsSpeechRecognition)}</div> */}
    </div>
  );
}

export default App;
