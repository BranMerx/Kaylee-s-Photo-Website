document.getElementById('english').addEventListener('click', function(){
  window.location.href = "index.html";
});
document.getElementById('vistaButon').addEventListener('click', function(){
  //Change the index html element to the collage view
  window.location.href = "photo_collage_es.html";
});
//event listener for the photo upload spanish version
document.getElementById('subirButon').addEventListener('click', () => {
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

//event listener to view the collage


//Function to send pictures to database