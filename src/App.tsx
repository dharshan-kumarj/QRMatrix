// App.tsx
import QRCodeGenerator from "./components/QRCodeGenerator";

function App() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background image and overlay */}
      <div className="absolute inset-0 bg-[url('/QR-BG.jpg')] bg-cover bg-center z-0" />
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      {/* Main Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <QRCodeGenerator />
      </div>
    </div>
  );
}

export default App;
