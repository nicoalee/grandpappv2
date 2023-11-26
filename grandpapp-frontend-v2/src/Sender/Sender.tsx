import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStopCircle } from "@fortawesome/free-solid-svg-icons";
import "./Sender.css";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";

enum ELang {
  "en-US" = "en-US",
  "zh-CN" = "zh-CN",
  "ja" = "ja",
}

const Sender: React.FC = (props) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>("");
  const [language, setLanguage] = useState<ELang>(ELang["en-US"]);
  const [isListening, setIsListening] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const disabled =
    color === undefined ||
    color.length === 0 ||
    name.length === 0 ||
    language.length === 0;

  const handleSubmit = () => {
    if (name.length && name.length > 0 && color && color.length > 0) {
      localStorage.setItem("grandpapp-name", name);
      localStorage.setItem("grandpapp-color", color);
      localStorage.setItem("grandpapp-language", language);
      setSubmitted(true);
    }
  };

  const handleStartListen = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: language });
    setIsListening(true);
  };

  const handleStopListen = async () => {
    await SpeechRecognition.stopListening();
    setIsListening(false);
    const registration = await navigator.serviceWorker.register(
      "serviceWorker.js",
      { scope: "./" }
    );

    const requestedPermission = await window.Notification.requestPermission();
    console.log(requestedPermission);
    if (requestedPermission === "granted") {
      console.log("granted");
      await registration.showNotification("Hello World", {
        body: "My first notification on iOS",
      });
    }

    return;

    // if (transcript.length > 0) {
    //   // PROD
    //   axios.post("https://grandappv2.onrender.com/listen", {
    //     user: name,
    //     transcript: transcript,
    //     color: color,
    //   });
    //   // DEV
    //   // axios.post('http://localhost:3001/listen', { user: name, transcript: transcript, color: color })
    // }
  };

  const handleCancelListen = async () => {
    await SpeechRecognition.abortListening();
    resetTranscript();
    setIsListening(false);
  };

  useEffect(() => {
    const name = localStorage.getItem("grandpapp-name");
    const color = localStorage.getItem("grandpapp-color");
    const language = localStorage.getItem("grandpapp-language") as ELang;

    setName(name || "");
    setColor(color || "");
    setLanguage(language || ELang["en-US"]);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {browserSupportsSpeechRecognition || isMicrophoneAvailable ? (
        submitted ? (
          <>
            <p>Click to record and send your voice</p>
            {isListening ? (
              <FontAwesomeIcon
                onClick={handleStopListen}
                className="mic"
                style={{ color: isListening ? "green" : "gray" }}
                icon={faStopCircle}
              />
            ) : (
              <FontAwesomeIcon
                onClick={handleStartListen}
                className="mic"
                style={{ color: isListening ? "green" : "gray" }}
                icon={faMicrophone}
              />
            )}
            {isListening && (
              <button
                onClick={handleCancelListen}
                style={{ marginTop: "1rem", maxWidth: "300px" }}
                className="button no"
              >
                CANCEL
              </button>
            )}
            <div style={{ padding: "1rem" }}>
              <p style={{ fontSize: "2rem" }}>{transcript}</p>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
            }}
          >
            <h1>What is your name?</h1>
            <input
              placeholder="name"
              style={{
                padding: "1rem",
                marginBottom: "1rem",
              }}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <select
              value={color}
              onChange={(event) => {
                setColor(event.target.value);
              }}
              className="select"
              style={{ marginBottom: "1rem" }}
            >
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
              onChange={(event) => {
                setLanguage(event.target.value as ELang);
              }}
              className="select"
            >
              <option value="">select language</option>
              <option value={ELang["en-US"]}>English</option>
              <option value={ELang.ja}>Japanese</option>
              <option value={ELang["zh-CN"]}>Chinese</option>
            </select>

            <button
              onClick={handleSubmit}
              className={`yes-button ${disabled ? "disabled" : ""}`}
              style={{ marginTop: "1rem", cursor: "pointer" }}
            >
              Submit
            </button>
          </div>
        )
      ) : (
        <span>
          This browser does not support speech recognition, or the mic is not
          available
        </span>
      )}
    </div>
  );
};

export default Sender;
