import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen font-sans">

      {/* 🔝 NAVBAR */}
      <div className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 className="text-xl font-semibold tracking-wide text-blue-500">
          CrashSense Navigator
        </h1>

        <button
          onClick={() => navigate("/map")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm shadow-md"
        >
          Open App
        </button>
      </div>

      {/* 🚀 HERO (LEFT + RIGHT) */}
      <div className="grid md:grid-cols-2 items-center px-10 mt-20 gap-10">

        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Navigate Smarter with
            <span className="text-blue-500"> Risk Intelligence</span>
          </h1>

          <p className="text-gray-400 mt-6 text-lg">
            Go beyond fastest routes. Our system predicts accident risk,
            analyzes conditions, and helps you choose the safest journey.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/map")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg shadow-lg"
            >
              Start Navigation 🚀
            </button>

            <button className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-900">
              Learn More
            </button>
          </div>
        </div>

        {/* RIGHT (Visual Box instead of empty space) */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/10 border border-gray-800 rounded-2xl p-10 backdrop-blur-lg shadow-xl">
          <p className="text-gray-300 text-sm">
            🔴 High Risk Route Detected
          </p>

          <h3 className="text-2xl font-semibold mt-3">
            Chennai → Kashmir
          </h3>

          <p className="text-red-400 mt-4">
            ⚠ Night driving + long distance increases risk
          </p>

          <p className="text-green-400 mt-2">
            ✅ Suggested safer alternative available
          </p>
        </div>

      </div>

      {/* 🔥 FEATURES */}
      <div className="mt-28 px-10">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why CrashSense?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl hover:scale-105 transition">
            <h3 className="text-lg font-semibold text-blue-400">
              🧠 AI Risk Prediction
            </h3>
            <p className="text-gray-400 mt-3">
              Machine learning predicts accident probability before you travel.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl hover:scale-105 transition">
            <h3 className="text-lg font-semibold text-blue-400">
              🗺 Smart Route Selection
            </h3>
            <p className="text-gray-400 mt-3">
              Compare multiple routes with safety-focused insights.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6 rounded-xl hover:scale-105 transition">
            <h3 className="text-lg font-semibold text-blue-400">
              ⚠ Alerts & Insights
            </h3>
            <p className="text-gray-400 mt-3">
              Real-time alerts like fatigue risk, night driving danger.
            </p>
          </div>

        </div>
      </div>

      {/* ⚙️ HOW IT WORKS (STEP STYLE) */}
      <div className="mt-28 px-10 text-center">
        <h2 className="text-3xl font-bold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-sm">

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            📍 Enter Destination
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            🛣 Generate Routes
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            📊 Risk Analysis
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            ⚠ Get Alerts
          </div>

        </div>
      </div>

      {/* 🎯 CTA */}
      <div className="mt-28 text-center pb-20">
        <h2 className="text-3xl font-bold">
          Drive Safer, Not Just Faster
        </h2>

        <button
          onClick={() => navigate("/map")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg shadow-lg"
        >
          Launch App 🚀
        </button>
      </div>

    </div>
  );
}