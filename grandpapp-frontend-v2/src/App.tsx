import './App.css';
import { useState } from 'react';
import Listener from './Listener/Listener';
import Sender from './Sender/Sender';

const App = () => {
  
  const [isListener, setIsListener] = useState<boolean>();
  const [isGrandma, setIsGrandma] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      {
        isListener === undefined ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h1>Are you grandpa?</h1>
            </div>
            <div>
              <button onClick={() => setIsListener(true)} className="yes button" style={{ marginRight: '1rem' }}>Yes, I am grandpa.</button>
              <button onClick={() => setIsListener(false)} className="no button">No, I am not grandpa.</button>
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
    </div>
  );
}

export default App;
