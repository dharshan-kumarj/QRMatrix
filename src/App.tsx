import { useState } from "react";
import QRCodeGenerator from "./components/QRCodeGenerator";
import BulkQRGenerator from "./components/BulkQRGenerator";
import MatrixRainBackground from "./components/MatrixRainBackground";

function App() {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  // Modular header
  const Header = () => (
    <div className="flex items-center justify-between px-2 md:px-4 pt-2 pb-1">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">QRMatrix</h1>
      <div className="flex space-x-2 md:space-x-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("single")}
          className={`pb-1 md:pb-2 border-b-2 text-xs md:text-sm font-semibold transition ${
            activeTab === "single"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          Single QR
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`pb-1 md:pb-2 border-b-2 text-xs md:text-sm font-semibold transition ${
            activeTab === "bulk"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          Bulk QR
        </button>
      </div>
    </div>
  );

  // Modular content area
  const Content = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full">
        {activeTab === "single" ? <QRCodeGenerator /> : <BulkQRGenerator />}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full font-sans overflow-hidden">
      {/* Matrix-style animated background */}
      <MatrixRainBackground />

      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-2 md:p-6">
        <div className="w-full max-w-5xl h-[90vh] max-h-[800px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2 md:p-6 flex flex-col gap-2 md:gap-4 overflow-hidden">
          <Header />
          <div className="flex-1 flex flex-col justify-center">
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
