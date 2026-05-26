//Event listener for the spanish language button
// Highlight correct option in language selector
const currentLang = window.location.pathname.includes('_es') ? 'es' : 'en';
const langSelect = document.getElementById('languageSelect') || document.getElementById('languageSelectEs');
if (langSelect) langSelect.value = currentLang;

document.getElementById('languageSelect').addEventListener('change', function() {
  const selectedLanguage = this.value;
  // Change the index html element to the selected language
  if (selectedLanguage === 'es') {
    window.location.href = "index_es.html";
  } else {
    window.location.href = "index.html";
  }
});
  //Change the index html element to the collage view
document.getElementById('viewCollageButton').addEventListener('click', function(){
  window.location.href = "photo_collage.html";
});

