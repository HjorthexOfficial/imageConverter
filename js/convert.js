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
      link.click();
      document.getElementById('output').innerHTML = 'Conversion complete!';
    };
    image.src = buffer;
  };
  reader.readAsDataURL(file);
}