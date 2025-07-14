//Event listener for the spanish language button
document.getElementById('languageSelectEs').addEventListener('change', function() {
  const selectedLanguage = this.value;
  // Change the index html element to the selected language
  if (selectedLanguage === 'en') {
    window.location.href = "index.html";
  } else {
    window.location.href = "index_es.html";
  }
});
document.getElementById('vistaButon').addEventListener('click', function(){
  //Change the index html element to the collage view
  window.location.href = "photo_collage_es.html";
});

let selectedFile = null;
//event listener for the photo upload spanish version
document.getElementById('subirButon').addEventListener('click', () => {
  // This triggers the file input (which can open the camera on mobile)
  document.getElementById('fileInput').click();
});

//Event listener to send collected file to the database
document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const fileStatus = document.getElementById('statusDeFoto');
  if (file) {
    selectedFile = file; // Store the selected file for later use
    fileStatus.textContent = `Archivo seleccionado: ${file.name}`;
  } else {
    selectedFile = null; // Reset the selected file if none is chosen
    fileStatus.textContent = "No se ha seleccionado ningún archivo.";
  }
  });

//Event listener for spanish submit button:
document.getElementById('enviarButon').addEventListener('click', async () => {
  const firstName = document.getElementById('PrimerNombre').value;
  const lastName = document.getElementById('Apellido').value;
  
  if (!selectedFile) {
    alert("Please select a file to upload.");
    return;
  } else if (!firstName || !lastName) {
    alert("Please enter both first and last names.");
    return;
  }

  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('file', selectedFile);

  try {
    const response = await fetch('http://localhost:5342/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    alert(result.message || "Upload successful!");
    // Optionally, reset the form or file input after successful upload
    document.getElementById('fileInput').value = ''; // Reset file input
    document.getElementById('FirstName').value = ''; // Reset first name input
    document.getElementById('LastName').value = ''; // Reset last name input
    document.getElementById('fileStatus').textContent = ''; // Reset file status display
    selectedFile = null; // Reset selected file
  } catch (error) {
    console.error("Error uploading:", error);
    alert("Upload failed.");
  }
});
