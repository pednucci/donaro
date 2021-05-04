var navProfile = document.querySelector('.nav-profile');
var toggleMenu = document.querySelector('.toggle-menu');
var display = toggleMenu.style.display;


navProfile.addEventListener('click', () => {
  if (toggleMenu.style.display == "none") {
    toggleMenu.style.display = "block";
  } else {
    toggleMenu.style.display = "none";
  }
})