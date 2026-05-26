//Event listener for the spanish language button
// Highlight correct option in language selector
const currentLang = window.location.pathname.includes('_es') ? 'es' : 'en';
const langSelect = document.getElementById('languageSelect') || document.getElementById('languageSelectEs');
if (langSelect) langSelect.value = currentLang;

document.getElementById('languageSelectEs').addEventListener('change', function() {
  const selectedLanguage = this.value;
  // Change the index html element to the selected language
  if (selectedLanguage === 'en') {
    window.location.href = "index.html";
  } else {
    window.location.href = "index_es.html";
  }
});
document.getElementById('vistaButon').addEventListener('click', function(){
  //Change the index html element to the collage view
  window.location.href = "photo_collage_es.html";
});

let selectedFile = null;
//event listener for the photo upload spanish version
document.getElementById('subirButon').addEventListener('click', () => {
  // This triggers the file input (which can open the camera on mobile)
  document.getElementById('fileInput').click();
});
