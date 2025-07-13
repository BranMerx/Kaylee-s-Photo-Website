const photoGrid = document.getElementById('photoGrid');
document.getElementById('returnButton').addEventListener('click', function(){
  window.location.href = "index.html";
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

// Function to fetch and display photos from the server
async function fetchPhotos() {
  try {
    const response = await fetch('http://localhost:5342/photos');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const photos = await response.json();
    photos.forEach(photo => addPhotoToGrid(photo.S3url));
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
}
// Call the function to fetch and display photos when the page loads
fetchPhotos();


