// src/utils/captureUtils.js
export const captureElement = async (element, fileName = 'collage', format = 'png') => {
  try {
    let dataUrl;
    
    switch (format) {
      case 'jpg':
      case 'jpeg':
        dataUrl = await toJpeg(element, { quality: 0.95 });
        break;
      case 'svg':
        dataUrl = await toSvg(element);
        break;
      case 'png':
      default:
        dataUrl = await toPng(element, { quality: 0.95 });
        break;
    }
    
    return dataUrl;
  } catch (error) {
    console.error('Error capturing element:', error);
    throw error;
  }
};

export const downloadImage = (dataUrl, fileName = 'collage') => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};