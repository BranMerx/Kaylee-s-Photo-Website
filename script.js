//Event listener for the spanish language button
document.getElementById('español').addEventListener('click', function(){
  //Change the index html element to the selected language
  window.location.href = "index_es.html";
   
});

document.getElementById('viewCollageButton').addEventListener('click', function(){
  //Change the index html element to the collage view
  window.location.href = "photo_collage.html";
});

//Event Listener for upload button to access phone camera
document.getElementById('uploadButton').addEventListener('click', () => {
  // This triggers the file input (which can open the camera on mobile)
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const firstName = document.getElementById('FirstName').value;
  const lastName = document.getElementById('LastName').value;

  if (!file) {
    alert("Please select a file to upload.");
    return;
  } else if (!firstName || !lastName) {
    alert("Please enter both first and last names.");
    return;
  }

  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('photo', file);

  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    alert(result.message || "Upload complete!");
  } catch (error) {
    console.error("Error uploading:", error);
    alert("Upload failed.");
  }
  
});

