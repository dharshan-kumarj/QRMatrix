
# 🔳 QRMatrix

**QRMatrix** is a modern, intuitive QR code generator built with React, TypeScript, and Tailwind CSS. Generate customizable QR codes from any text or URL, with options to embed logos/images and download in multiple formats.

## ✨ Features

- 🎨 **Custom QR Code Generation** - Create QR codes from any text or URL
- 🖼️ **Logo Embedding** - Add custom images/logos to your QR codes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎯 **Multiple Export Formats** - Download as PNG or SVG
- 🌙 **Dark Theme UI** - Modern, sleek dark interface
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

---

## 📁 Project Structure

``` 
├── public/                    # Static assets
├── src/  
│   ├── components/
│   │   └── QRCodeGenerator.tsx # Main QR code component
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles with Tailwind
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── postcss.config.cjs        # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts           # Vite build configuration

```

---

## 🧰 Tech Stack

- ⚛️ **React 19** - Modern React with latest features
- ⚡ **Vite** - Lightning fast build tool
- 🎨 **Tailwind CSS v3** - Utility-first CSS framework
- 🟦 **TypeScript** - Type-safe JavaScript
- 📱 **qr-code-styling** - Advanced QR code generation library

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dharshan-kumarj/QRcode_Generator.git
cd QRcode_Generator

```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🎯 How to Use

1. **Enter Text/URL**: Type any text or URL in the input field
2. **Add Logo (Optional)**: Upload an image file to embed in the center of your QR code
3. **Generate**: Click the "Generate QR" button to create your QR code
4. **Download**: Choose between PNG or SVG format to download your QR code

---

## 🎨 Customization

The QR code generator comes with several customization options:

- **Size**: 300x300 pixels (configurable in code)
- **Colors**: Dark theme with white dots on gray background
- **Dot Style**: Rounded dots for modern appearance
- **Logo Integration**: Automatic margin and positioning for embedded images

To modify the default styling, edit the `qrCode` configuration in `src/components/QRCodeGenerator.tsx`:

```tsx
const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: "svg",
  dotsOptions: {
    color: "#ffffff",      // QR code color
    type: "rounded",       // Dot style
  },
  backgroundOptions: {
    color: "#1f2937",      // Background color
  },
});
```

----------

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Dependencies

**Core Libraries:**
- `qr-code-styling` - Advanced QR code generation with customization
- `qrcode` - Additional QR code utilities
- `react` & `react-dom` - React framework

**Development Tools:**
- `vite` - Build tool and development server
- `typescript` - Type checking
- `tailwindcss` - Utility-first CSS framework
- `eslint` - Code linting

---

## 🧩 Tailwind CSS Configuration

QRMatrix uses Tailwind CSS for styling. The configuration is optimized for the dark theme UI:

###  `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Key Classes Used
- `bg-gray-900` - Dark background for the main container
- `text-white` - White text for contrast
- `rounded-2xl` - Rounded corners for modern look
- `shadow-lg` - Subtle shadow for depth

---

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📱 Browser Support

QRMatrix works in all modern browsers that support:
- ES2020+ JavaScript features
- CSS Grid and Flexbox
- Canvas API (for PNG downloads)
- SVG (for SVG downloads)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🔗 Links

- **Repository**: [https://github.com/dharshan-kumarj/QRcode_Generator](https://github.com/dharshan-kumarj/QRcode_Generator)
- **Live Demo**: [Deploy your own instance!](#)

---

## 📧 Contact

Created by [Dharshan Kumar J](https://github.com/dharshan-kumarj)

**QRMatrix** - Generate beautiful QR codes with ease! 🔳✨
