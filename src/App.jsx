import React, { useState, useEffect, useRef } from "react";
import { IoMic } from "react-icons/io5";
import { IoMicOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import "./App.css";

const AudioToText = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.log("Speech Recognition API not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = transcript;

      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error: ", event.error);
    };

    recognitionRef.current.onend = () => {
      if (listening) {
        recognitionRef.current.start();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [language]);

  

  const toggleListening = () => {
    if (listening) {
      setListening(false);
      recognitionRef.current.stop();
      clearInterval(timerRef.current);
    } else {
      setListening(true);
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const copyText = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      alert("Text copied to clipboard!");
    }
  };

  const deleteText = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the text?"
    );
    if (confirmDelete) {
      setTranscript("");
    }
  };

  const saveAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "MadeByMohdSakib.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container">
      <div className="content">
        <div className="top-section">
          <h1>Speech to Text</h1>
          <label>
            <select
              value={language}
              onChange={handleLanguageChange}
              disabled={listening}
            >
              <option value="en-US">English</option>
              <option value="hi-IN">Hindi</option>
              <option value="ur-PK">Urdu</option>
            </select>
          </label>
        </div>
        <div className="mic-content">
          <div className="mic-box">
            <button className="mic" onClick={toggleListening}>
              {listening ? <IoMic /> : <IoMicOutline />}
            </button>
          </div>
          <div className="mic-text">
            <p>{listening ? "Tap to Stop" : "Tap to Record"}</p>
            <p>
              <strong>Time:</strong> {formatTime(recordingTime)}
            </p>
          </div>
        </div>

        <div className="little-box">
          <div className="text-top">
            <p>
              <strong>Text:</strong>
            </p>
          </div>
          <div className="transcript">
            <p> {transcript}</p>
          </div>
          <div className="copy-delete-buttons">
            <div className="cpy">
              <button onClick={copyText} disabled={!transcript || listening}>
                <FaRegCopy />
              </button>
            </div>
            <button onClick={deleteText} disabled={!transcript || listening}>
              <MdDeleteOutline />
            </button>
          </div>
        </div>
        <div className="save-btn">
          <button onClick={saveAsTxt} disabled={!transcript}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioToText;
