import { useEffect, useRef, useState } from "react";

const Listener: React.FC = (props) => {
    const [eventSource ,setEventSource] = useState<EventSource>();
    const [messageHistory, setMessageHistory] = useState<{ user: string, color: string, message: string }[]>([])

    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setEventSource(() => {
            let eventSource: EventSource;
            eventSource = new EventSource('https://grandappv2.onrender.com/listen');
            
            eventSource.onopen = () => {
                console.log('event source opened');
            }
            eventSource.onmessage = (e: any) => {
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
        
            return eventSource;
        })

        return () => {
            setEventSource((eventSource) => {
                if (eventSource) eventSource.close();
                return undefined;
            })
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
            {messageHistory.length === 0 && (
                <div style={{ color: '#afaf00' }}>No messages</div>
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