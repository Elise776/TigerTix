import React, { useState, useRef } from "react";

export default function VoiceChat() 
{
  //An array to store messages between the user and llm
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  //Stores the api for parsing text for the llm 
  const llmApi = "http://localhost:7001/api/llm/parse"; 

  //Function to play a "beep" when recording starts
  function playBeep() 
  {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square"; 
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); 
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.00001,audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  } 
  

  //Records audio using the web speech api
  const startRecording = () => 
  {
    //Checks if the web speech api is supported
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) 
    {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    //Plays beep to signal recording
    playBeep();

    //Sets up speech recognition 
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();
    //Sets language for recognition
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => 
    {
      setRecording(true);
    };

    //Checks if the user's speech is sucessfully recognized and converted to text
    recognition.onresult = async (event) => 
    {
      //Extracts recognized text
      const text = event.results[0][0].transcript;

      //Adds the user's text to the chat window
      addMessage("user", text);

      //Stops recording
      setRecording(false);

      //Sends the text to the llm
      await handleSend(text);
    };

    //Raises an error if an error occurs where speech cannot be recognized
    recognition.onerror = (err) => 
    {
      console.error("An error occured while recognizing speech", err);
      setRecording(false);
    };

    //Stops recording
    recognition.onend = () => setRecording(false);

    //Restarts listening
    recognition.start();
  };

  //Sends the user's input, converted to text, to the llm
  const handleSend = async (text) => 
  {
    //Returns if the text is empty
    if (!text) return;

    try 
    {
      //Sends a POST request with the user's input to the llm for parsing
      const res = await fetch(llmApi, {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }),});
      
      //Waits for the response of parsing
      const data = await res.json();

      //Checks if the llm sucessfully parsed the input
      if (data.parsed && data.result) 
      {
        const { event, tickets } = data.result;

        //Stores a response to the user
        const reply = `I understood: Book ${tickets} tickets for ${event}. Confirm?`;
        
        //Adds the llm's message to the chat window
        addMessage("bot", reply);

        //Vocalizes a response to the user
        speak(reply);
      } 
      else 
      {
        //Stores a message if the user's input couldn't be understood
        const fallback = data.message || "Sorry, I couldn’t understand that.";
        
        //Adds the llm's message to the chat window
        addMessage("bot", fallback);

        //Vocalizes a response to the user
        speak(fallback);
      }
    } 
    //Raises an error if an error occurs in the booking process
    catch (err) 
    {
      console.error(err);

      //Stores an error message
      const errorMsg = "An error occured while booking. Please try again.";
      
      //Adds the llm's message to the chat window
      addMessage("bot", errorMsg);

      //Vocalizes a response to the user
      speak(errorMsg);
    }
  };

  //Vocalizes the given message, usually a response to the user
  const speak = (text) => 
  {
    //Makes sure the user's browser supports web speech
    if (!window.speechSynthesis) return;

    //Creates a new message to be vocalized based on the input to the function
    const utterance = new SpeechSynthesisUtterance(text);

    //Sets language for speech
    utterance.lang = "en-US";
    //Sets speed for speech
    utterance.rate = 0.9;
    //Sets pitch for speech
    utterance.pitch = 1.0;

    //Vocalizes message
    window.speechSynthesis.speak(utterance);
  };

  //Adds message to the chat window
  const addMessage = (sender, text) => 
  {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-xl shadow-md bg-white space-y-3">
      <h2 className="text-xl font-bold text-center"> Voice Booking Assistant</h2>
      <div
        className="border h-64 overflow-y-auto p-2 bg-gray-50 rounded"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`my-1 ${m.sender === "user" ? "text-blue-600" : "text-green-700"}`}
          >
            <strong>{m.sender === "user" ? "You:" : "Bot:"}</strong> {m.text}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center">
        <button
          id="mic-button"
          onClick={startRecording}
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            recording ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
          }`}
          aria-label="Start voice input"
        >
          {recording ? "Listening..." : "Speech to text"}
        </button>

      </div>
    </div>
  );
}
