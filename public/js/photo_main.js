const photoGrid = document.getElementById('photoGrid');

document.getElementById('returnButton').addEventListener('click', function(){
  window.location.href = "index.html";
});

//lightbox functionality
const galleryImages = document.querySelectorAll('.grid-item img');

galleryImages.forEach(image => {
  image.addEventListener('click', function() {
    document.getElementById('lightbox').style.display = 'flex';
    document.getElementById('lightbox').querySelector('img').src = this.src;
  });
});

document.getElementById('lightbox').addEventListener('click', function() {
  this.style.display = 'none';
});

  