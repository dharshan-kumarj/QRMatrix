import React, { useRef, useState, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { HexColorPicker } from "react-colorful";
import {
  SquareIcon,
  CircleIcon,
  PaintBucketIcon,
  UploadCloudIcon,
  ShapesIcon,
  SquareRoundCornerIcon,
  EyeIcon,
  Share2Icon,
  ClipboardCopyIcon,
  XIcon,
} from "lucide-react";

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: "png",
  data: "https://example.com",
  image: "",
  dotsOptions: {
    color: "#000",
    type: "square",
  },
  cornersSquareOptions: {
    type: "square",
  },
  cornersDotOptions: {
    type: "square",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
});

const QRCodeGenerator = () => {
  const ref = useRef(null);
  const modalRef = useRef(null);
  const [url, setUrl] = useState("https://example.com");
  const [fileExt, setFileExt] = useState("png");
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [dotStyle, setDotStyle] = useState("square");
  const [markerStyle, setMarkerStyle] = useState("square");
  const [markerCenter, setMarkerCenter] = useState("square");
  const [downloadPulse, setDownloadPulse] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const presetColors = ["#000000", "#1A4D8F", "#ED6A33", "#ED2B2A", "#2A7432"];

  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: url,
      dotsOptions: { color, type: dotStyle },
      cornersSquareOptions: { type: markerStyle },
      cornersDotOptions: { type: markerCenter },
    });
  }, [url, fileExt, color, dotStyle, markerStyle, markerCenter]);

  const handleDownload = () => {
    setDownloadPulse(true);
    qrCode.download(fileExt);
    setTimeout(() => setDownloadPulse(false), 800);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        qrCode.update({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch (err) {
      alert("Failed to copy");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ url });
    } catch (err) {
      alert("Sharing failed or was cancelled.");
    }
  };

  return (
    <>
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl relative w-[90%] max-w-sm animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <XIcon className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-4">
              <div ref={modalRef} />
            </div>
            <div className="flex justify-around mt-4">
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center gap-2"
                onClick={handleCopy}
              >
                <ClipboardCopyIcon className="w-4 h-4" /> Copy Link
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                onClick={handleShare}
              >
                <Share2Icon className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full min-h-screen p-4 md:p-10 gap-6 bg-[url('/QR-BG.jpg')] bg-cover bg-center bg-no-repeat">
        {/* QR PREVIEW */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          <div className="p-4 bg-white rounded-xl" ref={ref} />
          <button
            className="absolute bottom-4 right-4 bg-white border p-2 rounded-full shadow hover:scale-105 transition"
            onClick={() => {
              setShowModal(true);
              setTimeout(() => {
                modalRef.current.innerHTML = "";
                qrCode.append(modalRef.current);
              }, 50);
            }}
          >
            <EyeIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* QR CONFIG */}
        <div className="w-full md:w-1/2 bg-white rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Generate QR code</h2>

          <label className="text-sm mb-1 block text-gray-700">Enter or paste URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 mb-4"
            placeholder="Enter a website link, e.g., https://example.com"
          />

          {/* File Format */}
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-gray-700">File format</label>
            <select
              value={fileExt}
              onChange={(e) => setFileExt(e.target.value)}
              className="p-2 rounded border border-gray-300"
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </div>

          {/* Color Picker */}
          <div className="mb-4 relative">
            <label className="text-sm mb-1 block text-gray-700">Choose a color</label>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {presetColors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                    color === c ? "border-black" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
                >
                  <PaintBucketIcon className="w-5 h-5" />
                </button>
                {showColorPicker && (
                  <div className="absolute z-20 mt-2 bg-white p-2 shadow-lg rounded">
                    <HexColorPicker color={color} onChange={setColor} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Style Options */}
          <div className="mb-4">
            <label className="text-sm mb-1 block text-gray-700">Choose a style</label>

            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <span className="text-sm text-gray-600">Dots</span>
              {[
                { type: "square", icon: <SquareIcon /> },
                { type: "rounded", icon: <ShapesIcon /> },
                { type: "dots", icon: <CircleIcon /> },
              ].map(({ type, icon }) => (
                <button
                  key={type}
                  onClick={() => setDotStyle(type)}
                  className={`p-2 rounded border ${
                    dotStyle === type ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <span className="text-sm text-gray-600">Marker border</span>
              {[
                { type: "square", icon: <SquareIcon /> },
                { type: "extra-rounded", icon: <SquareRoundCornerIcon /> },
                { type: "dot", icon: <CircleIcon /> },
              ].map(({ type, icon }) => (
                <button
                  key={type}
                  onClick={() => setMarkerStyle(type)}
                  className={`p-2 rounded border ${
                    markerStyle === type ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-2 flex-wrap">
              <span className="text-sm text-gray-600">Marker center</span>
              {[
                { type: "square", icon: <SquareIcon /> },
                { type: "dot", icon: <CircleIcon /> },
              ].map(({ type, icon }) => (
                <button
                  key={type}
                  onClick={() => setMarkerCenter(type)}
                  className={`p-2 rounded border ${
                    markerCenter === type ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Logo */}
          <div className="mb-6">
            <label className="text-sm mb-1 block text-gray-700">Upload Logo</label>
            <label className="flex items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:shadow-lg">
              <UploadCloudIcon className="w-6 h-6 text-gray-800" />
              <span className="text-sm font-medium text-gray-800">Choose File</span>
              <input type="file" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>

          {/* Download Button */}
          <button
            className={`bg-black text-white px-4 py-2 rounded hover:bg-gray-800 ${
              downloadPulse ? "animate-pulse" : ""
            }`}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
};

export default QRCodeGenerator;
