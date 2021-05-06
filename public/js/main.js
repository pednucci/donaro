var navProfile = document.querySelector('.nav-profile');
var toggleMenu = document.querySelector('.toggle-menu');
var display = toggleMenu.style.display;
// console.log(display)

navProfile.addEventListener('click', () => {
  if (toggleMenu.style.display == "none") {
    toggleMenu.style.display = "none";
  } else {
    toggleMenu.style.display = "block";
  }
})
