import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function FitBounds({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route?.length) map.fitBounds(route);
  }, [route]);
  return null;
}

function MapPage() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [destCoords, setDestCoords] = useState(null);

  const [routesList, setRoutesList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  const getDistance = (route) => {
    let d = 0;
    for (let i = 1; i < route.length; i++) {
      d += L.latLng(route[i - 1]).distanceTo(L.latLng(route[i]));
    }
    return d / 1000;
  };

  const getMLPrediction = async (distance) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speed: 40 + Math.random() * 60,
          acceleration: -5 + Math.random() * 10,
          hour: new Date().getHours(),
          distance,
        }),
      });
      return await res.json();
    } catch {
      return null;
    }
  };

  const generateAlertsInsights = (score, reasons, ml) => {
    let alerts = [];
    let insights = [];

    if (score > 70) alerts.push("High accident risk detected");
    if (reasons.includes("distance")) {
      alerts.push("Long driving may cause fatigue");
      insights.push("Take breaks every 2–3 hours");
    }
    if (reasons.includes("Night")) {
      alerts.push("Night driving risk is high");
      insights.push("Avoid late-night travel");
    }
    if (ml?.risk === 1) {
      alerts.push("ML predicts dangerous conditions");
      insights.push("Drive cautiously");
    }

    if (score < 40) insights.push("This route is relatively safe");
    if (score > 40 && score < 70)
      insights.push("Moderate risk — stay alert");
    if (score > 70)
      insights.push("Consider choosing a safer route");

    return { alerts, insights };
  };

  const calculateRisk = async (route) => {
    const distance = getDistance(route);

    let score = 0;
    let reasons = [];

    if (distance > 800) {
      score += 60;
      reasons.push("distance");
    } else if (distance > 500) {
      score += 45;
      reasons.push("distance");
    } else if (distance > 250) {
      score += 30;
      reasons.push("distance");
    } else score += 10;

    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) {
      score += 25;
      reasons.push("Night");
    }

    score += Math.random() * 20;

    const ml = await getMLPrediction(distance);
    if (ml?.risk === 1) score += 25;

    const level =
      score > 70 ? "High" : score > 40 ? "Medium" : "Low";

    const ai = generateAlertsInsights(score, reasons.join(","), ml);

    return {
      score,
      level,
      reasons: reasons.join(", "),
      ml,
      ...ai,
    };
  };

  const createVariations = (coords) => [
    coords,
    coords.map(([lat, lng]) => [lat + 0.1, lng]),
    coords.map(([lat, lng]) => [lat, lng + 0.1]),
  ];

  const generateRoute = async () => {
    if (!destination || !location) return;

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
    );
    const geoData = await geoRes.json();

    const dest = [
      parseFloat(geoData[0].lat),
      parseFloat(geoData[0].lon),
    ];

    setDestCoords(dest);

    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${location[1]},${location[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`
    );

    const data = await res.json();

    const baseCoords = data.routes[0].geometry.coordinates.map((c) => [
      c[1],
      c[0],
    ]);

    const variations = createVariations(baseCoords);

    let routes = [];

    for (let coords of variations) {
      const analysis = await calculateRisk(coords);

      routes.push({
        coords,
        distance: getDistance(coords),
        analysis,
      });
    }

    setRoutesList(routes);
    selectRoute(routes, 0);
  };

  const selectRoute = (routes, index) => {
    setSelectedIndex(index);
    setAnalysis(routes[index].analysis);
  };

  const getColor = (score, selected) => {
    if (selected) return "#2563eb";
    if (score > 70) return "#ef4444";
    if (score > 40) return "#f59e0b";
    return "#22c55e";
  };

  if (!location) return <div>Loading...</div>;

  return (
    <div className="h-screen w-full relative">

      {/* INPUT */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/90 p-4 rounded-xl text-white w-[240px] shadow-xl border border-gray-700">
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination..."
          className="p-2 text-black w-full mb-2 rounded"
        />
        <button
          onClick={generateRoute}
          className="bg-red-500 hover:bg-red-600 transition p-2 w-full rounded font-semibold"
        >
          Find Route
        </button>
      </div>

      {/* ROUTES */}
      <div className="absolute top-36 left-4 z-[1000] flex flex-col gap-2 w-[240px]">
        {routesList.map((r, i) => (
          <div
            key={i}
            onClick={() => selectRoute(routesList, i)}
            className={`p-3 rounded-xl cursor-pointer shadow-lg border ${
              i === selectedIndex
                ? "bg-blue-600 text-white border-blue-400"
                : "bg-black text-white border-gray-700"
            }`}
          >
            <b>Route {i + 1}</b>
            <p>{Math.round(r.distance)} km</p>

            <p
              style={{
                color:
                  r.analysis.level === "High"
                    ? "#ef4444"
                    : r.analysis.level === "Medium"
                    ? "#f59e0b"
                    : "#22c55e",
              }}
            >
              {r.analysis.level}
            </p>

            <p className="text-xs mt-1 opacity-80">
              {i === 0 && "🚗 Balanced"}
              {i === 1 && "⚡ Faster"}
              {i === 2 && "🛡 Safer"}
            </p>
          </div>
        ))}
      </div>

      {/* ANALYSIS PANEL */}
      {analysis && (
        <div className="absolute bottom-6 left-6 bg-black/90 p-5 text-white z-[1000] rounded-2xl w-[300px] shadow-2xl border border-gray-700">

          <h3 className="text-xl font-bold mb-3">🚦 Risk Analysis</h3>

          <p><b>Score:</b> {analysis.score.toFixed(1)}</p>
          <p>
            <b>Level:</b>{" "}
            <span
              style={{
                color:
                  analysis.level === "High"
                    ? "#ef4444"
                    : analysis.level === "Medium"
                    ? "#f59e0b"
                    : "#22c55e",
              }}
            >
              {analysis.level}
            </span>
          </p>

          <p className="text-sm opacity-80">{analysis.reasons}</p>

          {analysis.ml && (
            <>
              <p>🤖 ML: {analysis.ml.message}</p>
              <p>Confidence: {analysis.ml.confidence}</p>
            </>
          )}

          <div className="mt-3">
            <p className="text-red-400 font-semibold">⚠ Alerts</p>
            {analysis.alerts.map((a, i) => (
              <p key={i}>• {a}</p>
            ))}
          </div>

          <div className="mt-3">
            <p className="text-green-400 font-semibold">💡 Insights</p>
            {analysis.insights.map((i, idx) => (
              <p key={idx}>• {i}</p>
            ))}
          </div>
        </div>
      )}

      {/* MAP */}
      <MapContainer center={location} zoom={5} className="h-full w-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        <Marker position={location} />
        {destCoords && <Marker position={destCoords} />}

        {routesList.map((r, i) => (
          <Polyline
            key={i}
            positions={r.coords}
            pathOptions={{
              color: getColor(r.analysis.score, i === selectedIndex),
              weight: i === selectedIndex ? 7 : 4,
              opacity: i === selectedIndex ? 1 : 0.3,
              dashArray: i === selectedIndex ? null : "6,8",
            }}
            eventHandlers={{
              click: () => selectRoute(routesList, i),
            }}
          />
        ))}

        {routesList[selectedIndex] && (
          <FitBounds route={routesList[selectedIndex].coords} />
        )}
      </MapContainer>
    </div>
  );
}

export default MapPage;