const photoGrid = document.getElementById('photoGrid');
document.addEventListener('returnButton').addEventListener('click', function() {
  // Redirect to the main page
  window.location.href = "index.html";
});

document.addEventListener('returnButton_es').addEventListener('click', function() {
  // Redirect to the main page in Spanish
  window.location.href = "index_es.html";
});
//Function to add a photo to the grid
function addPhotoToGrid(photoUrl) {
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';

  const img = document.createElement('img');
  img.src = photoUrl;
  img.alt = 'Uploaded Photo';

  gridItem.appendChild(img);
  photoGrid.appendChild(gridItem);
}

//function to get photo url from database
