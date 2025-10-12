import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  const buyTicket = (eventID) => {
    fetch(`http://localhost:5000/api/events/${eventID}/purchase`, {
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

        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );
      })
      .catch((err) => {
        console.error("Error purchasing ticket:", err);
      });
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
                <span aria-live="polite">
                  {event.tickets != null ? event.tickets : 0}
                </span>
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
    </div>
  );
}

export default App;
