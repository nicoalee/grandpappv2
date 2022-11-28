import { useEffect, useRef, useState } from "react";

const Listener: React.FC = (props) => {
    const [messageHistory, setMessageHistory] = useState<{ user: string, color: string, message: string }[]>([])
    const [connected, setConnected] = useState(false);

    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let eventSource: EventSource;
        // PROD
        eventSource = new EventSource('https://grandappv2.onrender.com/listen');
        // DEV
        // eventSource = new EventSource('http://localhost:3001/listen');

        eventSource.onopen = (event: any) => {
            setConnected(true)
        }

        eventSource.onmessage = (e: any) => {
            console.log('hello');
            
            setMessageHistory((prevMessageHistory) => {
                const receivedMessageObj = JSON.parse(e.data);                    
                const newMessageHistory = [...prevMessageHistory];
                newMessageHistory.push({
                    user: receivedMessageObj.user,
                    message: receivedMessageObj.transcript,
                    color: receivedMessageObj.color
                })
                
                return newMessageHistory;
            })
        }

        eventSource.onerror = (e: any) => {
            eventSource.close();
            setConnected(false)
        }

        return () => {
            eventSource.close();
            setConnected(false)
        }
    }, [])

    useEffect(() => {
        if (elementRef?.current) {
            const offsetBottom = elementRef.current.offsetTop + elementRef.current.offsetHeight;                
            window.scrollTo({ top: offsetBottom, behavior: 'smooth' });
        }
    }, [messageHistory])

    return (
        <div ref={elementRef} style={{ padding: '2rem' }}>
            <div style={{
                fontSize: '1rem',
                position: 'sticky',
                backgroundColor: connected ? 'lightgreen' : '#ff9a93',
                padding: '1rem',
                right: 0,
                top: 0,
                textAlign: 'center',
                color: connected ? 'green' : 'red'
            }}>{ connected ? 'CONNECTED' : 'NOT CONNECTED' }</div>
            {messageHistory.length === 0 && (
                <div style={{ color: '#afaf00', fontSize: '6rem' }}>No messages</div>
            )}
            {messageHistory.map((messageObj, index) => (
                <div key={index} style={{ backgroundColor: messageObj.color, color: 'white', borderRadius: '4px', padding: '1rem', marginBottom: '0.5rem' }}>
                    <h1 style={{ margin: 0, fontSize: '4rem' }}><b>{messageObj.user}</b></h1>
                    <div style={{ fontSize: '6rem' }}>{messageObj.message}</div>
                </div>
            ))}
        </div>
    )
}

export default Listener;