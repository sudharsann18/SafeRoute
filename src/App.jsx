import MapView from "./components/MapView";

function App() {
  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-red-500 text-center mb-2">
  SafeRoute 🚗
</h1>

<p className="text-center text-gray-400">
  Real-Time Accident Prevention & Emergency System
</p>

      <MapView />
    </div>
  );
}

export default App;