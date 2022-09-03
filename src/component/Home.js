import RoomEntry from "./RoomEntry";
import { useState, useEffect } from "react";
import { imgs, houseIcon } from "./img";
import { DotSpinner } from "@uiball/loaders";

const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/rooms";

const Home = () => {
  const [position, setPosition] = useState(1);
  const [rooms, setRooms] = useState([]);

  const fetchList = async () => {
    try {
      const rawData = await fetch(url, {
        headers: {
          Authorization:
            "Bearer bWy7TZEGzadpOP4XuSzwl15ae3sYtR4GvQHTTo431uDWu9yvrMrHkXXm5nsB",
        },
      });
      const roomsList = await rawData.json();
      setRooms(roomsList.items);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const changePosition = setTimeout(() => {
      setPosition(() => {
        let nextPosition = position + 1;
        if (nextPosition > 4) nextPosition = 1;
        return nextPosition;
      });
    }, 6000);
    return () => {
      clearTimeout(changePosition);
    };
  }, [position]);

  return rooms.length < 1 ? (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <DotSpinner size={100} speed={0.9} color="#38470B" />
    </div>
  ) : (
    <div className="relative w-full h-screen">
      {imgs.map((img, index) => {
        return (
          <div
            className={`absolute w-full h-full bg-black ease-in-out duration-500 ${
              position !== index + 1 && "opacity-0"
            }`}
            key={index}
          >
            <img
              src={img}
              className="opacity-60 w-full h-screen object-cover"
              alt={img}
            />
          </div>
        );
      })}
      <div className="absolute left-0 right-0 container mx-auto flex justify-between py-28">
        <div className="relative flex flex-col text-white">
          <img src={houseIcon} alt="logo" />
          <h1 className="mt-auto mb-3.5">好室旅店。HOUSE HOTEL</h1>
          <p className="mb-1.5">花蓮縣花蓮市國聯一路1號</p>
          <p className="mb-1.5">03-8321155</p>
          <p>HOUSE@HOTEL.COM</p>
          <ol className="absolute flex gap-3 bottom-0 left-1/2 -translate-x-1/2 -mb-20">
            {imgs.map((img, index) => {
              return (
                <li
                  className={`w-3 h-3 border border-white rounded-full cursor-pointer ${
                    position === index + 1 && "bg-white"
                  }`}
                  onClick={() => {
                    setPosition(index + 1);
                  }}
                  key={img}
                ></li>
              );
            })}
          </ol>
        </div>
        <div className="grid grid-cols-3">
          {rooms.map((room) => {
            return (
              <RoomEntry
                key={room.id}
                img={room.imageUrl}
                name={room.name}
                id={room.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
