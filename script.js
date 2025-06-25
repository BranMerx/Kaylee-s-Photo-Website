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

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file){
    console.log("Picture taken or uploaded:", file);
  }

  //Logic to store the photo in the database
  
});

