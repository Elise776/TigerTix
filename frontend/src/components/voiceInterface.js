import React, { useState, useRef } from "react";

export default function VoiceChat({
  messages,
  setMessages,
  pendingParse,
  setPendingParse,
  handleConfirm,
}) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);
  const llmApi = "http://localhost:7001/api/llm/parse";

  function playBeep() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioContext.currentTime + 0.5
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  const startRecording = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    playBeep();

    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecording(true);

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      addMessage("user", text);
      setRecording(false);

      // Check for confirmation shortcut
      if (
        pendingParse &&
        ["confirm", "yes", "y"].includes(text.toLowerCase())
      ) {
        handleConfirm();
        return;
      }

      await handleSend(text);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error", err);
      setRecording(false);
    };

    recognition.onend = () => setRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSend = async (text) => {
    if (!text) return;

    try {
      const res = await fetch(llmApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.parsed && data.result) {
        const { event, tickets } = data.result;

        // Store pending parse in App.js
        setPendingParse({ event, tickets });

        const reply = `I understood: Book ${tickets} tickets for ${event}. Confirm?`;
        addMessage("bot", reply);
        speak(reply);
      } else {
        const fallback = data.message || "Sorry, I couldn’t understand that.";
        addMessage("bot", fallback);
        speak(fallback);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = "An error occured while booking. Please try again.";
      addMessage("bot", errorMsg);
      speak(errorMsg);
    }
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const addMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      { role: sender === "user" ? "user" : "bot", text },
    ]);
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-xl shadow-md bg-white space-y-3">
      <h2 className="text-xl font-bold text-center">Voice Booking Assistant</h2>
      <div
        className="border h-64 overflow-y-auto p-2 bg-gray-50 rounded"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-1 ${
              m.role === "user" ? "text-blue-600" : "text-green-700"
            }`}
          >
            <strong>{m.role === "user" ? "You:" : "Bot:"}</strong> {m.text}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <button
          id="mic-button"
          onClick={startRecording}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            recording
              ? "bg-red-600 animate-pulse"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          aria-label="Start voice input"
        >
          {recording ? "Listening..." : "Speech to text"}
        </button>
      </div>
    </div>
  );
}
