const fileInput = document.getElementById('file-input');
const convertButton = document.getElementById('convert-button');
const fileNamesDiv = document.querySelector('.file-names');
const fileNamesList = document.querySelector('.file-names ul');

fileInput.addEventListener('change', function() {
  const files = fileInput.files;
  fileNamesList.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const li = document.createElement('li');
    li.textContent = files[i].name;
    fileNamesList.appendChild(li);
  }
});

convertButton.addEventListener('click', function() {
  convertImagesToWebP(fileInput.files);
});

function convertImagesToWebP(files) {
  const zip = new JSZip();

  let processedFiles = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    // Only process image files.
    if (!file.type.match('image/png') && !file.type.match('image/jpeg') && !file.type.match('image/jpg')) {
      continue;
    }

    reader.onload = function() {
      const img = new Image();
      img.src = reader.result;

      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        canvas.toBlob(function(blob) {
          const fileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
          zip.file(fileName, blob);
          processedFiles++;

          if (processedFiles === files.length) {
            zip.generateAsync({ type: 'blob' }).then(function(content) {
              saveAs(content, 'converted_images.zip');
            });
          }
        });
      };
    };

    reader.readAsDataURL(file);
  }
}

const progressBar = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress-bar-container');

function updateProgressBar(progress) {
  progressBar.style.width = `${progress}%`;
}

function downloadZip() {
  const files = document.querySelector('#file-input').files;
  const zip = new JSZip();

  // add files to zip object
  // ...

  // create zip file
  zip.generateAsync({ type: 'blob' }, (metadata) => {
    const progress = metadata.percent.toFixed(2);
    updateProgressBar(progress);
  }).then((content) => {
    // save zip file
    FileSaver.saveAs(content, 'images.zip');
    // reset progress bar
    updateProgressBar(0);
  });
}

document.querySelector('#convert-button').addEventListener('click', downloadZip);
