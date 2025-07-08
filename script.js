//Event listener for the spanish language button
document.getElementById('español').addEventListener('click', function(){
  //Change the index html element to the selected language
  window.location.href = "index_es.html";
   
});
  //Change the index html element to the collage view
document.getElementById('viewCollageButton').addEventListener('click', function(){
  window.location.href = "photo_collage.html";
});

//Event Listener for upload button to access phone camera and upload the picture
document.getElementById('uploadButton').addEventListener('click', () => {
  // This triggers the file input (which can open the camera on mobile)
  document.getElementById('fileInput').click();
});

//Event listener to send collected file to the database
document

document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  const firstName = document.getElementById('FirstName').value;
  const lastName = document.getElementById('LastName').value;

  //updating file name status display
  const fileStatus = document.getElementById('fileStatus');
  if (file){
    fileStatus.textContent = `Selected file: ${file.name}`;
  }else {
    fileStatus.textContent = "No file selected.";
  }

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

//Event listener to submit the picture and names to the server
document.getElementById('submitButton').addEventListener('click', async () => {
  //retrieve the first name and last name from the input fields
  const firstName = document.getElementById('FirstName').value;
  const lastName = document.getElementById('LastName').value;

  if(!selectedFile) {
    alert("Please select a file to upload.");
    return;
  }
  if(!firstName || !lastName) {
    alert("Please enter both first and last names.");
    return;
  }
  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('photo', selectedFile);

  try{
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    alert(result.message || "Upload successful!");
  } catch (error) {
    console.error("Error uploading:", error);
    alert("Upload failed.");
  }
});
