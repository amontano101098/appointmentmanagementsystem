import RoomCard from "./RoomCard";

import hotelRoom from "../../assets/images/hotelRoom.jpg";
import deluxeRoom from "../../assets/images/deluxe room.jpeg";
import executiveSuite from "../../assets/images/executive suite.jpeg";

const rooms = [
  {
    id: 1,
    name: "Standard Room",
    description: "Simply Smart — the perfect blend of cozy and cost-effective, with everything you need for a comfortable night.",
    price: "15,000 FCFA / night",
    image: hotelRoom,
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "Your Scenic Sanctuary — upgrade your stay with stunning views and premium amenities.",
    price: "90,000 FCFA / night",
    image: deluxeRoom,
  },
  {
    id: 3,
    name: "Executive Suite",
    description: "Elevate Your Hustle — a full suite experience crafted for the modern executive.",
    price: "150,000 FCFA / night",
    image: executiveSuite,
  },
];

function Rooms() {
  return (
    <section id="rooms" className="rooms">
      <div className="rooms-header">
        <span className="section-label">Accommodations</span>
        <h2>Our Rooms</h2>
        <p>Choose the room that fits your journey</p>
      </div>

      <div className="room-container">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}

export default Rooms;
