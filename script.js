document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const qrInput = document.getElementById('qr-input');
    const bgInput = document.getElementById('bg-input');
    const qrFileName = document.getElementById('qr-file-name');
    const bgFileName = document.getElementById('bg-file-name');
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityVal = document.getElementById('opacity-val');
    const densitySelect = document.getElementById('density-select');
    const generateBtn = document.getElementById('generate-btn');
    const downloadPngBtn = document.getElementById('download-png');
    const canvas = document.getElementById('result-canvas');
    const ctx = canvas.getContext('2d');

    let qrImageSrc = null;
    let bgImageSrc = null;

    // Handle File Uploads
    const handleUpload = (inputElem, nameElem, isBg) => {
        inputElem.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                nameElem.textContent = file.name;
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (isBg) {
                        bgImageSrc = event.target.result;
                    } else {
                        qrImageSrc = event.target.result;
                    }
                };
                reader.readAsDataURL(file);
            } else {
                nameElem.textContent = 'No file chosen';
                if (isBg) bgImageSrc = null;
                else qrImageSrc = null;
            }
        });
    };

    handleUpload(qrInput, qrFileName, false);
    handleUpload(bgInput, bgFileName, true);

    // Update Opacity Slider Label
    opacitySlider.addEventListener('input', (e) => {
        opacityVal.textContent = Math.round(e.target.value * 100) + '%';
    });

    // Helper to load images
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Helper to extract data from uploaded QR Code using jsQR
    const scanQRCode = (imgElement) => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgElement.width;
        tempCanvas.height = imgElement.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);
        
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        return code ? code.data : null;
    };

    // Initialize blank canvas visually
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Handle Generate Button Click
    generateBtn.addEventListener('click', async () => {
        if (!qrImageSrc || !bgImageSrc) {
            alert('Please upload both a QR Code image and a Background image.');
            return;
        }

        try {
            const qrImg = await loadImage(qrImageSrc);
            const bgImg = await loadImage(bgImageSrc);

            // 1. Scan the uploaded QR image
            const qrDataStr = scanQRCode(qrImg);
            if (!qrDataStr) {
                alert('Could not decode the uploaded QR Code. Please try a clearer or standard QR code image.');
                return;
            }

            // 2. Generate a fresh, transparent QR code made of dots using qr-code-styling
            const qrStyling = new QRCodeStyling({
                width: 800,
                height: 800,
                type: "canvas",
                data: qrDataStr,
                qrOptions: {
                    errorCorrectionLevel: densitySelect.value
                },
                dotsOptions: {
                    color: "#000000",
                    type: "dots" // This makes it look like dots instead of squares
                },
                backgroundOptions: {
                    color: "transparent" // Ensure background is completely see-through
                }
            });

            // Extract the generated QR code as an image blob
            const qrBlob = await qrStyling.getRawData('png');
            const qrUrl = URL.createObjectURL(qrBlob);
            const generatedQrImg = await loadImage(qrUrl);

            // 3. Composite everything onto the final canvas
            canvas.width = 1000;
            canvas.height = 1000;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Background Image (cover style)
            const bgAspect = bgImg.width / bgImg.height;
            const canvasAspect = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (bgAspect > canvasAspect) {
                drawHeight = canvas.height;
                drawWidth = bgImg.width * (canvas.height / bgImg.height);
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = bgImg.height * (canvas.width / bgImg.width);
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }
            ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);

            // Draw semi-transparent white overlay to ensure QR readability
            const opacity = parseFloat(opacitySlider.value);
            if (opacity > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Draw the generated dotted QR code on top
            // Since it's transparent, the background image will show beautifully through the dots
            const qrSize = canvas.width * 0.85;
            const qrOffset = (canvas.width - qrSize) / 2;
            
            ctx.drawImage(generatedQrImg, qrOffset, qrOffset, qrSize, qrSize);

            // Clean up object URL
            URL.revokeObjectURL(qrUrl);

        } catch (error) {
            console.error(error);
            alert('Error processing the images. Please make sure they are valid.');
        }
    });

    // Handle Download
    downloadPngBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'dotted-qr-background.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
});
