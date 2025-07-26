// QRCodeGenerator.tsx
import { useState } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = async () => {
    try {
      if (!text.trim()) {
        setError("Enter some text or a URL first.");
        return;
      }
      const url = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
      });
      setQrUrl(url);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to generate QR code.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
      <h1 className="text-xl font-semibold text-gray-700">QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter text or link..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        onClick={generateQRCode}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
      >
        Generate
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {qrUrl && (
        <div className="flex flex-col items-center">
          <img src={qrUrl} alt="Generated QR" className="my-4" />
          <a
            href={qrUrl}
            download="qrcode.png"
            className="text-blue-600 underline text-sm"
          >
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
