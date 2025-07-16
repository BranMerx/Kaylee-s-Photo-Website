const photoGrid = document.getElementById('photoGrid');

document.getElementById('returnButton').addEventListener('click', function(){
  window.location.href = "index.html";
});

//Function to add a photo to the grid
function addPhotoToGrid(photoUrl, fullName) {
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';

  const img = document.createElement('img');
  img.src = photoUrl;
  img.alt = fullName;

  const name = document.createElement('p');
  name.textContent = fullName;

  gridItem.appendChild(img);
  gridItem.appendChild(name);
  photoGrid.appendChild(gridItem);
}

// Function to fetch and display photos from the server
async function fetchPhotos() {
  try {
    const response = await fetch('https://kaylee-s-photo-website.onrender.com/photos');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const photos = await response.json();


    photos.forEach(photo => {
      const fullName = `${photo.FirstName} ${photo.LastName}`;
      addPhotoToGrid(photo.S3url, fullName);
    }); 
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
}
// Call the function to fetch and display photos when the page loads
fetchPhotos();


