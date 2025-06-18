//Event listener for the spanish language button
document.getElementById('español').addEventListener('click', function(){
  //Change the index html element to the selected language
  window.location.href = "index_es.html";
   
});

//Event Listener for upload button to access phone camera
document.getElementById('uploadButton').addEventListener('click', function(){
});


document.getElementById('viewCollageButton').addEventListener('click', function(){
  //Change the index html element to the collage view
  window.location.href = "photo_collage.html";
});