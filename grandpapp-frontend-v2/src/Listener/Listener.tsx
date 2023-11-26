import { useEffect, useRef, useState } from "react";

const Listener: React.FC = (props) => {
  const [messageHistory, setMessageHistory] = useState<
    { user: string; color: string; message: string }[]
  >([]);
  const [connected, setConnected] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let eventSource: EventSource;
    // PROD
    eventSource = new EventSource("https://grandappv2.onrender.com/listen");
    // DEV
    // eventSource = new EventSource('http://localhost:3001/listen');

    eventSource.onopen = (event: any) => {
      setConnected(true);
    };

    eventSource.onmessage = (e: any) => {
      const receivedMessageObj = JSON.parse(e.data);
      setMessageHistory((prevMessageHistory) => {
        return [
          ...prevMessageHistory,
          {
            user: receivedMessageObj.user,
            message: receivedMessageObj.transcript,
            color: receivedMessageObj.color,
          },
        ];
      });
    };

    eventSource.onerror = (e: any) => {
      eventSource.close();
      setConnected(false);
    };

    const cleanup = () => {
      if (eventSource.OPEN) eventSource.close();
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
      if (eventSource.OPEN) eventSource.close();
      setConnected(false);
    };
  }, []);

  // useEffect(() => {
  //   const showNotification = async () => {
  //     const registration = await navigator.serviceWorker.register(
  //       "serviceWorker.js",
  //       { scope: "./" }
  //     );

  //     const requestedPermission = await window.Notification.requestPermission();

  //     if (requestedPermission === "granted") {
  //       const lastMessage = messageHistory[messageHistory.length - 1];

  //       console.log("showing notification");
  //       await registration.showNotification(lastMessage.user, {
  //         body: lastMessage.message,
  //       });
  //     }
  //   };

  //   showNotification();
  // }, [messageHistory]);

  useEffect(() => {
    const setupServiceWorker = async () => {
      const registration = await navigator.serviceWorker.register(
        "serviceWorker.js",
        { scope: "./" }
      );

      const requestedPermission = await window.Notification.requestPermission();

      if (requestedPermission === "granted") {
        console.log({ registration });
        await registration.showNotification("Grandpapp", {
          body: "notification 1!",
        });
        await registration.showNotification("Grandpapp", {
          body: "notification 2!",
        });
      }
    };

    setupServiceWorker();
  }, [messageHistory]);

  useEffect(() => {
    if (elementRef?.current) {
      const offsetBottom =
        elementRef.current.offsetTop + elementRef.current.offsetHeight;
      window.scrollTo({ top: offsetBottom, behavior: "smooth" });
    }
  }, [messageHistory]);

  return (
    <div ref={elementRef} style={{ padding: "2rem" }}>
      <div
        style={{
          fontSize: "1rem",
          position: "sticky",
          backgroundColor: connected ? "lightgreen" : "#ff9a93",
          padding: "1rem",
          right: 0,
          top: 0,
          textAlign: "center",
          color: connected ? "green" : "red",
        }}
      >
        {connected ? "CONNECTED" : "NOT CONNECTED"}
      </div>
      {messageHistory.length === 0 && (
        <div style={{ color: "#afaf00", fontSize: "2.5rem" }}>No messages</div>
      )}
      {messageHistory.map((messageObj, index) => (
        <div
          key={index}
          style={{
            backgroundColor: messageObj.color,
            color: "white",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.5rem" }}>
            <b>{messageObj.user}</b>
          </h1>
          <div style={{ fontSize: "2.5rem", wordBreak: "break-all" }}>
            {messageObj.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Listener;
