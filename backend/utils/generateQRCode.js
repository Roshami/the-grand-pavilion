const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#8B0000',  // Burgundy color
        light: '#FFF9F0'  // Cream color
      }
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

module.exports = generateQRCode;