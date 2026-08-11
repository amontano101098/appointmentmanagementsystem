import { useState } from "react";

function Booking() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [room, setRoom] = useState("Standard Room");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(`Thank you, ${name}! Your ${room} has been booked.`);

    // Reset form (optional)
    setName("");
    setEmail("");
    setCheckIn("");
    setCheckOut("");
    setRoom("Standard Room");
  };

  return (
    <section id="booking" className="booking">
      <h2>Book Your Stay</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />

        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />

        <select
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>Standard Room</option>
          <option>Deluxe Room</option>
          <option>Suite</option>
        </select>

        <button type="submit">BOOK</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}

export default Booking;