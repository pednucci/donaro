var navProfile = document.querySelector('.nav-profile');
var toggleMenu = document.querySelector('.toggle-menu');
var display = toggleMenu.style.display;



navProfile.addEventListener('click', () => {
  if (display == "block") {
    toggleMenu.style.display = "none";
  } else {
    toggleMenu.style.display = "block";
  }
  display = toggleMenu.style.display;

})

window.addEventListener('click', (e) => {
  console.log(e)
})

