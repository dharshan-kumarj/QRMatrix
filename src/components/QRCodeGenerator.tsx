import React, { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import {
  Square,
  Circle,
  SquareRoundCorner,
  PaintBucket,
  UploadCloud,
  X,
} from "lucide-react";

const QRCodeGenerator = () => {
  const presetColors = ["#000000", "#1A4D8F", "#ED6A33", "#ED2B2A", "#2A7432"];
  const [url, setUrl] = useState("https://example.com");
  const [fileExt, setFileExt] = useState("png");
  const [color, setColor] = useState("#000000");
  const [dotStyle, setDotStyle] = useState("square");
  const [markerStyle, setMarkerStyle] = useState("square");
  const [markerCenter, setMarkerCenter] = useState("square");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [isLogoDragActive, setIsLogoDragActive] = useState(false);
  const [downloadPulse, setDownloadPulse] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = "";
      const previewQR = new QRCodeStyling({
        width: 300,
        height: 300,
        type: fileExt === "svg" ? "svg" : "canvas",
        data: url,
        image: logo || "",
        dotsOptions: {
          color,
          type: dotStyle as any,
        },
        cornersSquareOptions: {
          type: markerStyle as any,
        },
        cornersDotOptions: {
          type: markerCenter as any,
        },
        backgroundOptions: {
          color: "#fff",
        },
      });
      previewQR.append(previewRef.current);
    }
  }, [url, color, dotStyle, markerStyle, markerCenter, fileExt, logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  // Drag and drop handlers for logo
  const handleLogoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsLogoDragActive(true);
  };
  const handleLogoDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsLogoDragActive(false);
  };
  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsLogoDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setLogoFileName(droppedFile.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleDownload = () => {
    setDownloadPulse(true);
    const qr = new QRCodeStyling({
      width: 1000,
      height: 1000,
      type: fileExt as any,
      data: url,
      image: logo || "",
      dotsOptions: {
        color,
        type: dotStyle as any,
      },
      cornersSquareOptions: {
        type: markerStyle as any,
      },
      cornersDotOptions: {
        type: markerCenter as any,
      },
      backgroundOptions: {
        color: "#fff",
      },
    });
    qr.download(fileExt);
    setTimeout(() => setDownloadPulse(false), 800);
  };

  // --- UI RETURN ---
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex-1 w-full h-[100dvh] md:h-full max-w-full md:max-w-3xl min-h-[340px] flex flex-col md:flex-row gap-2 md:gap-4 bg-gradient-to-br from-white via-gray-50 to-gray-200 border border-gray-200 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl p-1 xs:p-2 md:p-4 overflow-hidden min-h-0">
        {/* QR PREVIEW */}
        <div className="flex-1 flex items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-3 md:p-4 min-h-[100px] md:min-h-[180px] max-h-[260px] sm:max-h-none">
          <div
            className="aspect-square flex items-center justify-center bg-white rounded-md md:rounded-lg shadow border border-gray-100 w-full"
            style={{
              maxWidth: 'min(90vw, 220px)',
              maxHeight: 'min(60vw, 220px)',
              minWidth: 0,
              minHeight: 0,
              height: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <div
              ref={previewRef}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                minWidth: 0,
                minHeight: 0,
                margin: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </div>
        </div>

        {/* QR CONFIG CARD */}
        <div className="flex-1 min-h-0 flex flex-col bg-white/95 rounded-lg md:rounded-xl p-2 xs:p-3 md:p-4 shadow border border-gray-100 min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] md:min-w-[220px] max-w-full h-full max-h-[90vh] sm:max-h-full overflow-hidden">
          <h2 className="text-base xs:text-lg md:text-xl font-bold mb-2 text-gray-900 text-center tracking-tight">Single QR Code Generator</h2>
          <div className="flex-1 min-h-0 flex flex-col gap-1 xs:gap-2 pr-0 xs:pr-1 overflow-y-auto h-full">
            {/* URL Input */}
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Enter or paste URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter a website link, e.g., https://example.com"
              />
            </div>
            {/* File Format */}
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs text-gray-600">File format</label>
              <select
                value={fileExt}
                onChange={(e) => setFileExt(e.target.value)}
                className="p-1 rounded border border-gray-200 text-xs"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="svg">SVG</option>
              </select>
            </div>
            {/* Color Picker */}
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Choose a color</label>
              <div className="flex items-center gap-1 flex-wrap">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${color === c ? "border-black" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    type="button"
                  />
                ))}
                <div className="relative">
                  <button
                    className="p-1 border rounded bg-gray-100 hover:bg-gray-200"
                    title="Pick color"
                    tabIndex={-1}
                    disabled
                  >
                    <PaintBucket className="w-4 h-4" />
                  </button>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="absolute left-0 top-0 w-6 h-6 opacity-0 cursor-pointer"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>
              </div>
            </div>
            {/* Style Options */}
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Choose a style</label>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-gray-500">Dots</span>
                {[
                  { type: "square", icon: <Square className="w-4 h-4" /> },
                  { type: "rounded", icon: <SquareRoundCorner className="w-4 h-4" /> },
                  { type: "dots", icon: <Circle className="w-4 h-4" /> },
                ].map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() => setDotStyle(type)}
                    className={`p-1 rounded border ${dotStyle === type ? "bg-black text-white" : "bg-white"}`}
                    type="button"
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-gray-500">Marker border</span>
                {[
                  { type: "square", icon: <Square className="w-4 h-4" /> },
                  { type: "extra-rounded", icon: <SquareRoundCorner className="w-4 h-4" /> },
                  { type: "dot", icon: <Circle className="w-4 h-4" /> },
                ].map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() => setMarkerStyle(type)}
                    className={`p-1 rounded border ${markerStyle === type ? "bg-black text-white" : "bg-white"}`}
                    type="button"
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs text-gray-500">Marker center</span>
                {[
                  { type: "square", icon: <Square className="w-4 h-4" /> },
                  { type: "dot", icon: <Circle className="w-4 h-4" /> },
                ].map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() => setMarkerCenter(type)}
                    className={`p-1 rounded border ${markerCenter === type ? "bg-black text-white" : "bg-white"}`}
                    type="button"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            {/* Logo Upload */}
            <div className="mb-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Upload Logo (optional)</label>
              <div
                className="relative"
                onDragOver={handleLogoDragOver}
                onDragLeave={handleLogoDragLeave}
                onDrop={handleLogoDrop}
              >
                <label
                  className={`flex items-center gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:shadow-md transition text-xs ${isLogoDragActive ? "border-black bg-gray-100" : "border-gray-200"}`}
                  style={{ position: 'relative' }}
                >
                  <UploadCloud className="w-5 h-5 text-gray-800" />
                  <span className="truncate max-w-[120px]">{logoFileName ? logoFileName : "Choose File"}</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {logoFileName && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-white hover:bg-gray-200 text-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
                    style={{ zIndex: 2, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={e => { e.stopPropagation(); setLogo(undefined); setLogoFileName(""); }}
                    tabIndex={-1}
                    aria-label="Cancel logo upload"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            {/* Download Button */}
            <button
              className={`w-full bg-gradient-to-r from-black to-gray-800 text-white py-2 rounded-lg text-base font-semibold mt-2 hover:from-gray-900 hover:to-black transition-colors duration-200 shadow ${downloadPulse ? "animate-pulse" : ""}`}
              onClick={handleDownload}
            >
              Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeGenerator;

