import type { Room } from "../../types/Room";

interface RoomCardProps {
  room: Room;
}

function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="room-card">
      <img src={room.image} alt={room.name} />

      <div className="room-content">
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <span>{room.price}</span>
        <a href="#book" className="btn-small">Book this room →</a>
      </div>
    </div>
  );
}

export default RoomCard;
