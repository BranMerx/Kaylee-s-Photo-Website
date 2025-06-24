document.getElementById('english').addEventListener('click', function(){
  window.location.href = "index.html";
});

//event listern for the photo upload spanish version
document.getElementById('subirButton').addEventListener('click', ()=> {
  //Access the phone camera
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log("Foto tomada o subida:", file);
    // Logic to store the photo in the database
    // This is where you would implement your database logic
  }
});

//event listener to view the collage
document.getElementById('vistaButon').addEventListener('click', function(){
  //Change the index html element to the collage view
  window.location.href = "photo_collage.html";
});

//Function to send pictures to database