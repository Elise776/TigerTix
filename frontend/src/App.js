/**
 * App.js
 * Combines events list and LLM chatbot booking with explicit confirmation.
 */

import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]); // chat messages
  const [input, setInput] = useState("");
  const [pendingParse, setPendingParse] = useState(null); // { event, tickets }

  // Load events list
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  // Buy ticket via direct purchase button
  const buyTicket = (eventId) => {
    fetch(`http://localhost:5000/api/events/${eventId}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) {
          alert("No tickets left to purchase");
          return null;
        }
        return res.json();
      })
      .then((updatedEvent) => {
        if (!updatedEvent) return;
        setEvents((prev) =>
          prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
        );
      })
      .catch((err) => console.error("Error purchasing ticket:", err));
  };

  // Chat: parse user input via LLM
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:7001/api/llm/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok || !data.parsed || !data.result) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: data.message || "I couldn't extract booking details.",
          },
        ]);
        return;
      }

      const { event, tickets } = data.result;

      setPendingParse({ event, tickets });

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `I understood: Book ${tickets} ticket(s) for "${event}". Confirm?`,
        },
      ]);
    } catch (err) {
      console.error("parse error", err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Server error while parsing. Try again." },
      ]);
    }
  };

  // Confirm booking using transactional backend
  const handleConfirm = async () => {
    if (!pendingParse) return;
    const { event, tickets } = pendingParse;

    setMessages((m) => [
      ...m,
      { role: "user", text: `Confirm booking ${tickets} for ${event}` },
    ]);

    try {
      const res = await fetch("http://localhost:7001/api/llm/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirm: true,
          parse: { event, tickets },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessages((m) => [
          ...m,
          { role: "bot", text: data.message || "Booking failed." },
        ]);
        setPendingParse(null);
        return;
      }

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `✅ Booking successful (qty: ${data.booking.qty}) for "${event}".`,
        },
      ]);

      // Refresh events list
      fetch("http://localhost:5000/api/events")
        .then((r) => r.json())
        .then((updatedEvents) => setEvents(updatedEvents))
        .catch(() => {});
    } catch (err) {
      console.error("confirm error", err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Server error while booking." },
      ]);
    } finally {
      setPendingParse(null);
    }
  };

  const handleCancel = () => {
    setMessages((m) => [...m, { role: "bot", text: "Booking cancelled." }]);
    setPendingParse(null);
  };

  return (
    <div className="App">
      <h1>Clemson Campus Events</h1>
      <h2>Upcoming Events</h2>

      <ul>
        {events.length === 0 ? (
          <li>No events available</li>
        ) : (
          events.map((event) => (
            <li key={event.id}>
              <span>
                {event.name} - {event.date} - Tickets Available:{" "}
                <span aria-live="polite">{event.tickets ?? 0}</span>
              </span>{" "}
              <button
                onClick={() => buyTicket(event.id)}
                aria-label={`Buy a ticket for ${event.name}`}
              >
                Buy Ticket
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Chatbot */}
      <div className="chat-container">
        <h2>🎟️ Chat Assistant</h2>

        <div
          className="chat-box"
          style={{
            height: 300,
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: 10,
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                margin: 6,
                textAlign: m.role === "user" ? "right" : "left",
              }}
            >
              <strong>{m.role === "user" ? "You" : "Bot"}: </strong>
              <span>{m.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            aria-label="Chat input"
            style={{ flex: 1, padding: 8 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder='Try "Book 2 tickets for Jazz Night"'
          />
          <button onClick={handleSend}>Send</button>
        </div>

        {pendingParse && (
          <div
            style={{
              marginTop: 12,
              borderTop: "1px solid #eee",
              paddingTop: 12,
            }}
          >
            <div>
              <strong>Confirm booking:</strong> {pendingParse.tickets} ×{" "}
              {pendingParse.event}
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={handleConfirm} style={{ marginRight: 8 }}>
                Confirm Booking
              </button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
