# QR Image Studio

A sleek, modern web application that seamlessly merges your existing QR codes with custom background images.

By scanning your uploaded QR code and regenerating it as a transparent dot-pattern, this tool allows your custom background images to shine through beautifully between the dots.

## ✨ Features

- **Smart Decoding:** Uses `jsQR` to scan and decode your uploaded QR code image entirely in the browser.
- **Dotted Regeneration:** Automatically redraws your QR code using a dotted pattern (via `qr-code-styling`) with a completely transparent background.
- **Dot Density Control:** Lower the dot density to create fewer, cleaner dots, allowing more of your custom background image to be visible without breaking scannability.
- **Readability Overlay:** Adjust the background white opacity to ensure your black QR dots remain perfectly readable, even against dark or noisy backgrounds.
- **High-Quality Export:** Uses native HTML5 Canvas to composite your images and export a flawless, high-resolution PNG.
- **Privacy First:** 100% client-side processing. Your images and QR data never leave your browser.

## 🚀 How to Use

1. **Launch the App:** Simply open `index.html` in any modern web browser or serve it via a local web server (e.g., `python3 -m http.server`).
2. **Upload QR Code:** Select your existing QR code image (JPG/PNG).
3. **Upload Background:** Choose the image you want to appear *behind* the QR code.
4. **Adjust Visibility:** 
   - Use the **QR Dot Density** dropdown to reduce the number of dots. (Low density = fewer dots, more background).
   - Tweak the **White Opacity** slider to add a subtle white haze behind the dots if your background image is too dark.
5. **Merge & Export:** Click **Merge Images** to preview, and **Download Final Image** to save your composite PNG.

## 🛠 Built With

- **HTML5 / CSS3 / Vanilla JavaScript**
- **[jsQR](https://github.com/cozmo/jsQR)** - For reading the original QR code image data.
- **[qr-code-styling](https://qr-code-styling.com/)** - For generating the beautiful, transparent dotted QR layout.

## 📝 License

This project is free to use for personal and commercial purposes.
