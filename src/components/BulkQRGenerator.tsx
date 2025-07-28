import React, { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import {
  Square,
  Circle,
  SquareRoundCorner,
  PaintBucket,
  FileUp,
  UploadCloud,
} from "lucide-react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import styles from "./BulkQRGenerator.module.css";

const BulkQRGenerator = () => {
  const presetColors = ["#000000", "#1A4D8F", "#ED6A33", "#ED2B2A", "#2A7432"];
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [color, setColor] = useState("#000000");
  const [dotStyle, setDotStyle] = useState("square");
  const [markerStyle, setMarkerStyle] = useState("square");
  const [markerCenter, setMarkerCenter] = useState("square");
  const [fileExt, setFileExt] = useState("png");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  // ...existing code...

  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = "";
      const previewQR = new QRCodeStyling({
        width: 300,
        height: 300,
        type: fileExt === "svg" ? "svg" : "canvas",
        data: "Preview QR",
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
  }, [color, dotStyle, markerStyle, markerCenter, fileExt, logo]);
  // ...existing code...

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setStatus("Reading file...");
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const records: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (records.length === 0) {
        setStatus("No records found in file.");
        return;
      }

      const zip = new JSZip();
      const rows = records.slice(1);

      setStatus("Generating QR codes...");

      for (const [index, row] of rows.entries()) {
        const data = row.join(", "); // Or use row[1] if you only want a particular column
        const name = String(row[0] || `Record-${index + 1}`);

        const qr = new QRCodeStyling({
          width: 1000,
          height: 1000,
          type: fileExt as 'svg' | 'canvas',
          data: data,
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
          }
        });

        const blob = await qr.getRawData(fileExt as any);
        zip.file(`${name}.${fileExt}`, blob);
      }

      setStatus("Zipping files...");
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "qr-codes.zip");
      setStatus("✅ All QR Codes Generated!");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen p-4 md:p-10 gap-6 bg-white">
      {/* QR PREVIEW */}
      <div className="w-full md:w-1/2 flex justify-center items-center relative">
        <div className="p-4 bg-white rounded-xl" ref={previewRef} />
      </div>

      {/* QR CONFIG CARD */}
      <div className="w-full md:w-1/2 bg-white rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Bulk QR Code Generator</h2>

        {/* File Upload */}
        <label className="text-sm mb-1 block text-gray-700">Upload CSV or Excel file:</label>
        <label className="flex items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:shadow-lg mb-4">
          <FileUp className="w-6 h-6 text-gray-800" />
          <span className="text-sm font-medium text-gray-800">Choose File</span>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {/* File Format */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm text-gray-700">File format</label>
          <select
            value={fileExt}
            onChange={(e) => setFileExt(e.target.value)}
            className="p-2 rounded border border-gray-300"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="svg">SVG</option>
          </select>
        </div>

        {/* Color Picker */}
        <div className="mb-4 relative">
          <label className="text-sm mb-1 block text-gray-700">Choose a color</label>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {presetColors.map((c) => (
              <button
                key={c}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${color === c ? "border-black" : "border-transparent"}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                type="button"
              />
            ))}
            <div className="relative">
              <button
                className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
                title="Pick color"
                tabIndex={-1}
                disabled
              >
                <PaintBucket className="w-5 h-5" />
              </button>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute left-0 top-0 w-8 h-8 opacity-0 cursor-pointer"
                style={{ pointerEvents: "auto" }}
              />
            </div>
          </div>
        </div>

        {/* Style Options */}
        <div className="mb-4">
          <label className="text-sm mb-1 block text-gray-700">Choose a style</label>

          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <span className="text-sm text-gray-600">Dots</span>
            {[
              { type: "square", icon: <Square className="w-4 h-4" /> },
              { type: "rounded", icon: <SquareRoundCorner className="w-4 h-4" /> },
              { type: "dots", icon: <Circle className="w-4 h-4" /> },
            ].map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => setDotStyle(type)}
                className={`p-2 rounded border ${dotStyle === type ? "bg-black text-white" : "bg-white"}`}
                type="button"
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <span className="text-sm text-gray-600">Marker border</span>
            {[
              { type: "square", icon: <Square className="w-4 h-4" /> },
              { type: "extra-rounded", icon: <SquareRoundCorner className="w-4 h-4" /> },
              { type: "dot", icon: <Circle className="w-4 h-4" /> },
            ].map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => setMarkerStyle(type)}
                className={`p-2 rounded border ${markerStyle === type ? "bg-black text-white" : "bg-white"}`}
                type="button"
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <span className="text-sm text-gray-600">Marker center</span>
            {[
              { type: "square", icon: <Square className="w-4 h-4" /> },
              { type: "dot", icon: <Circle className="w-4 h-4" /> },
            ].map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => setMarkerCenter(type)}
                className={`p-2 rounded border ${markerCenter === type ? "bg-black text-white" : "bg-white"}`}
                type="button"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Logo */}
        <div className="mb-6">
          <label className="text-sm mb-1 block text-gray-700">Upload Logo (optional)</label>
          <label className="flex items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:shadow-lg">
            <UploadCloud className="w-6 h-6 text-gray-800" />
            <span className="text-sm font-medium text-gray-800">Choose File</span>
            <input type="file" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>

        <button
          className={styles.button}
          onClick={handleGenerate}
        >
          Generate Bulk QR
        </button>

        {status && <p className={styles.status}>{status}</p>}
      </div>
    </div>
  );
};

export default BulkQRGenerator;
