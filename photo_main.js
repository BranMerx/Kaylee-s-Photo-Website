const photoGrid = document.getElementById('photoGrid');

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
