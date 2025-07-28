import { useState } from "react";
import QRCodeGenerator from "./components/QRCodeGenerator";
import BulkQRGenerator from "./components/BulkQRGenerator";

function App() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  return (
    <div className="relative min-h-screen w-full font-sans">
      {/* Background image and overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4 md:p-10">
        <div className="w-full max-w-7xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 space-y-8">

          {/* Header Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">QRMatrix</h1>

            {/* Tab Buttons */}
            <div className="flex space-x-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("single")}
                className={`pb-2 border-b-2 text-sm font-semibold transition ${
                  activeTab === "single"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Single QR
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`pb-2 border-b-2 text-sm font-semibold transition ${
                  activeTab === "bulk"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Bulk QR
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full">
            {activeTab === "single" ? <QRCodeGenerator /> : <BulkQRGenerator />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
