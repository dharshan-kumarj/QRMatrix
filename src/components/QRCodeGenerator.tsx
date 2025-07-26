// components/QRCodeGenerator.tsx
import { useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: "svg", // SVG by default
  data: "",
  dotsOptions: {
    color: "#ffffff",
    type: "rounded",
  },
  backgroundOptions: {
    color: "#1f2937", // Tailwind gray-800
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10,
  },
});

export default function QRCodeGenerator() {
  const qrRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleGenerate = () => {
    qrCode.update({
      data: text,
      image: file ? URL.createObjectURL(file) : undefined,
    });
    qrCode.append(qrRef.current!);
  };

  const downloadAs = (type: "png" | "svg") => {
    qrCode.download({ name: "qr-code", extension: type });
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl w-full max-w-md shadow-lg space-y-4">
      <h1 className="text-2xl font-bold text-center">QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter URL or text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm text-gray-300"
      />

      <button
        onClick={handleGenerate}
        className="bg-green-500 w-full py-2 rounded hover:bg-green-600 transition"
      >
        Generate QR
      </button>

      <div ref={qrRef} className="flex justify-center py-4"></div>

      <div className="flex justify-between">
        <button
          onClick={() => downloadAs("png")}
          className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadAs("svg")}
          className="bg-purple-500 px-4 py-1 rounded hover:bg-purple-600"
        >
          Download SVG
        </button>
      </div>
    </div>
  );
}
