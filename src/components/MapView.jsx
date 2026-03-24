import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

function MapView() {
  const path = [
    [13.0827, 80.2707],
    [13.0835, 80.2715],
    [13.0845, 80.2725],
    [13.0855, 80.2735],
  ];

  const dangerZone = [13.0845, 80.2725];

  const [position, setPosition] = useState(path[0]);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [alert, setAlert] = useState("Safe");

  const [accident, setAccident] = useState(false);
  const [time, setTime] = useState(0);

  // 🚗 Movement + Speed + Danger Detection
  useEffect(() => {
    if (accident) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % path.length;

        const currentPos = path[next];
        setPosition(currentPos);

        const randomSpeed = Math.floor(Math.random() * 100);
        setSpeed(randomSpeed);

        // 🚨 Danger Zone (HIGH PRIORITY)
        if (
          Math.abs(currentPos[0] - dangerZone[0]) < 0.0005 &&
          Math.abs(currentPos[1] - dangerZone[1]) < 0.0005
        ) {
          setAlert("🚨 Accident-Prone Area!");
        } 
        // ⚠️ Speed
        else if (randomSpeed > 60) {
          setAlert("⚠️ Over Speeding!");
        } 
        // ✅ Safe
        else {
          setAlert("Safe");
        }

        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [accident]);

  // ⏱️ Golden Hour Timer
  useEffect(() => {
    if (!accident) return;

    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [accident]);

  // 🚑 Accident Trigger
  const handleAccident = () => {
    setAccident(true);
    setAlert("🚑 Accident Detected!");
  };

  // 🔄 Reset System
  const handleReset = () => {
    setAccident(false);
    setTime(0);
    setAlert("Safe");
  };

  return (
    <div className="h-[80vh] w-full rounded-xl overflow-hidden mt-4 relative">

      {/* STATUS PANEL */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 p-4 rounded-xl z-[1000] shadow-lg">

        {/* System Status */}
        <p className={accident ? "text-red-400" : "text-green-400"}>
          {accident ? "System Alert 🔴" : "System Active 🟢"}
        </p>

        <p className="text-white mt-1">Speed: {speed} km/h</p>

        {/* Alert */}
        <p className="text-red-500 font-bold animate-pulse text-lg">
  {alert}
</p>

        {/* Emergency Info */}
        {accident && (
          <>
            <p className="text-yellow-400 mt-2">
              ⏱️ Emergency Time: {time}s
            </p>

            <div className="text-green-400 mt-2">
              📡 Alert sent to Emergency Contact & Nearby Hospital
            </div>
          </>
        )}
      </div>

      {/* BUTTONS */}
      <button
        onClick={handleAccident}
        className="absolute bottom-6 left-6 bg-red-600 text-white px-4 py-2 rounded-lg z-[1000] shadow-md"
      >
        Simulate Accident 🚨
      </button>

      <button
        onClick={handleReset}
        className="absolute bottom-6 left-40 bg-green-600 text-white px-4 py-2 rounded-lg z-[1000] shadow-md"
      >
        Reset 🔄
      </button>

      <MapContainer center={position} zoom={15} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🚗 Vehicle Marker */}
        <Marker position={position}>
          <Popup>🚗 Vehicle</Popup>
        </Marker>

        {/* 🚨 Danger Zone Marker */}
        <Marker
          position={dangerZone}
          icon={L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
            iconSize: [30, 30],
          })}
        >
          <Popup>🚨 Danger Zone</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;