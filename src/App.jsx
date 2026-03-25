import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen">

        {/* 🚀 ROUTES ONLY (NO HEADER) */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;