//Event listener for the spanish language button
document.getElementById('languageSelect').addEventListener('change', function() {
  const selectedLanguage = this.value;
  // Change the index html element to the selected language
  if (selectedLanguage === 'es') {
    window.location.href = "index_es.html";
  } else {
    window.location.href = "index.html";
  }
});
  //Change the index html element to the collage view
document.getElementById('viewCollageButton').addEventListener('click', function(){
  window.location.href = "photo_collage.html";
});

let selectedFile = null;
//Event Listener for upload button to access phone camera and upload the picture
document.getElementById('uploadButton').addEventListener('click', () => {
  // This triggers the file input (which can open the camera on mobile)
  document.getElementById('fileInput').click();
});

//Event listener to send collected file to the database
document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  //updating file name status display
  const fileStatus = document.getElementById('fileStatus');
  if (file){
    selectedFile = file; // Store the selected file for later use
    fileStatus.textContent = `Selected file: ${file.name}`;
  }else {
    selectedFile = null; // Reset the selected file if none is chosen
    fileStatus.textContent = "No file selected.";
  }
});

//Event listener to submit the picture and names to the server
document.getElementById('submitButton').addEventListener('click', async () => {
  //retrieve the first name and last name from the input fields
  const firstName = document.getElementById('FirstName').value;
  const lastName = document.getElementById('LastName').value;

  if(!selectedFile) {
    alert("Please select a picture to upload.");
    return;
  }
  if(!firstName || !lastName) {
    alert("Please enter both first and last names.");
    return;
  }

  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('file', selectedFile);

  try{
    const response = await fetch('https://kaylee-s-photo-website-production.up.railway.app/upload', {
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
