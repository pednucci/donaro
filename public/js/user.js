var navProfile = document.querySelector('.nav-profile');
var toggleMenu = document.querySelector('.toggle-menu');


navProfile.addEventListener('click', () => {
  if (toggleMenu.classList.contains('visible')) {
    toggleMenu.classList = "toggle-menu"
    console.log('si')
  } else {
    toggleMenu.classList = "toggle-menu visible"
    console.log('no')
  }

})

// window.addEventListener('click', (e) => {
//   if (display == "block") {
//     if (e.target.tagName == "section") {
//       console.log(e.target.tagName)
//       toggleMenu.style.display = "none";
//     } else {
//       console.log(e.target.tagName)
//       toggleMenu.style.display = "block";
//     }
//     display = toggleMenu.style.display;
//   }
// })

