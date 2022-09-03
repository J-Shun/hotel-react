import { Link } from "react-router-dom";

const RoomEntry = ({ img, name, id }) => {
  return (
    <Link
      to={`/room/${id}`}
      style={{
        backgroundImage: `url(${img})`,
      }}
      className="relative bg-cover bg-center cursor-pointer overflow-hidden group w-entry-card h-entry-card"
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 ease-linear duration-200">
        {name}
      </div>
    </Link>
  );
};

export default RoomEntry;
