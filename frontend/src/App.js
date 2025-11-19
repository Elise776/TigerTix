import React, { useEffect, useState } from "react";
import "./App.css";
import VoiceChat from "./components/voiceInterface";

function App() {
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]); // chat messages
  const [input, setInput] = useState("");
  const [pendingParse, setPendingParse] = useState(null); // { event, tickets }
  //User login info, used in testing
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  //JWT token
  const [token, setToken] = useState("");
  //Swaps between user login and registration
  const [authenticationMode, setAuthenticationMode] = useState("login");
  //Sets user email
  const [email, setEmail] = useState("");
  //Sets user password
  const [password, setPassword] = useState("");

  // Load events list
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  //Handles user registration
  const handleRegister = async () => {
    try {
      //Sends a POST request using the registerUser api to register the user
      const response = await fetch(
        "http://localhost:8001/api/authentication/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      //Gets the JSON response from the server and parses it
      const data = await response.json();

      //Raises an error if the registration process cannot be completed
      if (!response.ok) return alert(data.error || "Registration failed");

      //Lets the user know if registration has been completed
      alert("Registration successful. Please log in.");

      //Switches to the login screen
      setAuthenticationMode("login");
    } catch (err) {
      //Raises an error if an error occured during registration
      console.error("An error occured during registration", err);
    }
  };

  //Handles user login
  const handleLogin = async () => {
    try {
      //Sends a post request to the userLogin api to login the user
      const response = await fetch(
        "http://localhost:8001/api/authentication/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      //Gets the JSON response from the server and parses it
      const data = await response.json();

      //Raises an error if the login process cannot be completed
      if (!response.ok) return alert(data.error || "Login failed");

      //Assigns a token to the user
      setToken(data.token);
      //Sets the user's login info
      setUser({ email });
      setEmail("");
      setPassword("");
    } catch (err) {
      //Raisies an error if an error occurs during the login process
      console.error("An error occured during login", err);
    }
  };

  //Handles user logout
  const handleLogout = async () => {
    try {
      //Uses the userLogout api to logout the user using a POST request
      await fetch("http://localhost:7002/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      //Throws an error if an error occurs while logging out
      console.error("An error occured during logout", err);
    }

    //Resets the user
    setUser(null);
    //Resets the token
    setToken("");
    //Clears chatbot message log
    setMessages([]);
    setPendingParse(null);
    setInput("");
  };

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
  const handleSend = async (text) => {
    const inputText = text?.trim() ?? input.trim();
    if (!inputText) return;

    setMessages((m) => [...m, { role: "user", text: inputText }]);
    setInput("");

    // Check for user confirmation shortcut
    if (
      pendingParse &&
      ["confirm", "yes", "y"].includes(inputText.toLowerCase())
    ) {
      handleConfirm();
      return;
    }

    // Otherwise, parse input via LLM
    try {
      const res = await fetch("http://localhost:7001/api/llm/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
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
          text: `Booking successful (qty: ${data.booking.qty}) for "${event}".`,
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

      {!user ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: 16,
            width: 400,
            margin: "40px auto",
          }}
        >
          <h2>{authenticationMode === "login" ? "Login" : "Register"}</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 8, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
          />
          {authenticationMode === "login" ? (
            <>
              <button onClick={handleLogin} style={{ marginRight: 8 }}>
                Login
              </button>
              <button onClick={() => setAuthenticationMode("register")}>
                Need an account?
              </button>
            </>
          ) : (
            <>
              <button onClick={handleRegister} style={{ marginRight: 8 }}>
                Register
              </button>
              <button onClick={() => setAuthenticationMode("login")}>
                Back to login
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div style={{ textAlign: "right", marginBottom: 12 }}>
            <p>
              Logged in as <strong>{user.email}</strong>
            </p>
            <button onClick={handleLogout}>Logout</button>
          </div>

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

          <div className="chat-container">
            <h2>Chat Assistant</h2>
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
              <button onClick={() => handleSend()}>Send</button>
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
                  <strong>Confirm booking:</strong> {pendingParse.tickets}{" "}
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

          <div style={{ marginTop: 40 }}>
            <VoiceChat
              messages={messages}
              setMessages={setMessages}
              pendingParse={pendingParse}
              setPendingParse={setPendingParse}
              handleConfirm={handleConfirm}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
