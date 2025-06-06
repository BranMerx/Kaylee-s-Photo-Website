document.getElementById('español').addEventListener('click', toSpanish);
document.getElementById('english').addEventListener('click', toEnglish);

//function to change to english
function toEnglish() {
  window.location.href = "index.html";
}
//function to change to spanish
function toSpanish() {
  window.location.href = "index_es.html";
}

