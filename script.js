//Event listener for the spanish language button
document.getElementById('español').addEventListener('click', function(){
  //Change the index html element to the selected language
  window.location.href = "index_es.html";
   
});

//Event listener for english language button
document.getElementById('english').addEventListener('click', function(){
//Change the index_es to index.html
  window.location.href = "index.html";
});