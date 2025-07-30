import React, { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Square, Circle, SquareRoundCorner, PaintBucket, FileUp, UploadCloud, Loader2, X } from "lucide-react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const BulkQRGenerator = () => {
  const presetColors = ["#000000", "#1A4D8F", "#ED6A33", "#ED2B2A", "#2A7432"];
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [color, setColor] = useState("#000000");
  const [dotStyle, setDotStyle] = useState("square");
  const [markerStyle, setMarkerStyle] = useState("square");
  const [markerCenter, setMarkerCenter] = useState("square");
  const [fileExt, setFileExt] = useState("png");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [isFileDragActive, setIsFileDragActive] = useState(false);
  const [isLogoDragActive, setIsLogoDragActive] = useState(false);

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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  // Drag and drop handlers for CSV/Excel
  const handleFileDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsFileDragActive(true);
  };
  const handleFileDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsFileDragActive(false);
  };
  const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsFileDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && ["csv", "xlsx", "xls"].some(ext => droppedFile.name.endsWith(ext))) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  // Drag and drop handlers for logo
  const handleLogoDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsLogoDragActive(true);
  };
  const handleLogoDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsLogoDragActive(false);
  };
  const handleLogoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
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

  // Modular UI sections for compact card layout
  const FileUpload = () => (
    <div className="mb-2 relative">
      <label className="text-xs font-semibold text-gray-600 mb-1 block">Upload CSV or Excel file</label>
      <div className="relative">
        <label
          className={`flex items-center gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:shadow-md transition text-xs ${isFileDragActive ? "border-black bg-gray-100" : "border-gray-200"}`}
          onDragOver={handleFileDragOver}
          onDragLeave={handleFileDragLeave}
          onDrop={handleFileDrop}
          style={{ position: 'relative' }}
        >
          <FileUp className="w-5 h-5 text-gray-800" />
          <span className="truncate max-w-[120px]">{fileName ? fileName : "Upload File"}</span>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        {fileName && (
          <button
            type="button"
            className="absolute top-1 right-1 p-0.5 rounded-full bg-white hover:bg-gray-200 text-gray-500 shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ zIndex: 2, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={e => { e.stopPropagation(); setFile(null); setFileName(""); }}
            tabIndex={-1}
            aria-label="Cancel file upload"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );

  const FileFormat = () => (
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
  );

  const ColorPicker = () => (
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
  );

  const StyleOptions = () => (
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
  );

  const LogoUpload = () => (
    <div className="mb-2 relative">
      <label className="text-xs font-semibold text-gray-600 mb-1 block">Upload Logo (optional)</label>
      <div className="relative">
        <label
          className={`flex items-center gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:shadow-md transition text-xs ${isLogoDragActive ? "border-black bg-gray-100" : "border-gray-200"}`}
          onDragOver={handleLogoDragOver}
          onDragLeave={handleLogoDragLeave}
          onDrop={handleLogoDrop}
          style={{ position: 'relative' }}
        >
          <UploadCloud className="w-5 h-5 text-gray-800" />
          <span className="truncate max-w-[120px]">{logoFileName ? logoFileName : "Upload File"}</span>
          <input type="file" onChange={handleLogoUpload} className="hidden" />
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
  );

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
        <div className="flex-1 flex flex-col bg-white/95 rounded-lg md:rounded-xl p-2 xs:p-3 md:p-4 shadow border border-gray-100 min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] md:min-w-[220px] max-w-full h-full max-h-[90vh] sm:max-h-full overflow-hidden">
          <h2 className="text-base xs:text-lg md:text-xl font-bold mb-2 text-gray-900 text-center tracking-tight">Bulk QR Code Generator</h2>
        <div className="flex-1 flex flex-col gap-1 xs:gap-2 pr-0 xs:pr-1 overflow-y-auto h-full">
            <FileUpload />
            <FileFormat />
            <ColorPicker />
            <StyleOptions />
            <LogoUpload />
            <button
              className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-2 rounded-lg text-base font-semibold mt-2 hover:from-gray-900 hover:to-black transition-colors duration-200 shadow"
              onClick={handleGenerate}
            >
              Generate Bulk QR
            </button>
            {status && (
              <div className="mt-2 flex items-center justify-center gap-2">
                {(status.includes("Generating QR") || status.includes("Zipping")) && (
                  <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
                )}
                <p className="text-xs text-gray-600 text-center">{status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkQRGenerator;
