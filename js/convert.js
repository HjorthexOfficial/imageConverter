let quality = 0.75;

function setQuality(newQuality) {
  quality = newQuality;
}

async function convertToWebp() {
  const fileInput = document.getElementById('file-input');
  if (!fileInput.files.length) {
    alert('Please select a PNG, JPG, or JPEG file to convert.');
    return;
  }
  const file = fileInput.files[0];
  if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
    alert('Please select a PNG, JPG, or JPEG file to convert.');
    return;
  }
  const reader = new FileReader();
  reader.onload = async (event) => {
    const buffer = event.target.result;
    const image = new Image();
    image.onload = async () => {
      // Clear previous previews
      document.getElementById('preview-upload').innerHTML = '';
      document.getElementById('preview-converted').innerHTML = '';
      
      // Create canvas for uploaded image preview
      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = image.width;
      previewCanvas.height = image.height;
      const previewCtx = previewCanvas.getContext('2d');
      previewCtx.drawImage(image, 0, 0);
      // Append preview canvas to the DOM
      document.getElementById('preview-upload').appendChild(previewCanvas);

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const mimeType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
      const dataURL = canvas.toDataURL(mimeType, quality);
      const response = await fetch(dataURL);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name.replace(/\.[^/.]+$/, "")}.webp`;

      const convertedImage = new Image();
      convertedImage.onload = async () => {
        // Create canvas for converted image preview
        const previewConvertedCanvas = document.createElement('canvas');
        previewConvertedCanvas.width = convertedImage.width;
        previewConvertedCanvas.height = convertedImage.height;
        const previewConvertedCtx = previewConvertedCanvas.getContext('2d');
        previewConvertedCtx.drawImage(convertedImage, 0, 0);
        // Append preview canvas to the DOM
        document.getElementById('preview-converted').appendChild(previewConvertedCanvas);
      };
      convertedImage.src = URL.createObjectURL(blob);
    };
    image.src = buffer;
  };
  reader.readAsDataURL(file);
}


function downloadWebp() {
  const link = document.createElement('a');
  link.href = document.getElementById('preview-converted').getElementsByTagName('canvas')[0].toDataURL();
  link.download = 'converted.webp';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}