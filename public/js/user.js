var navProfile = document.querySelector('.nav-profile');
var toggleMenu = document.querySelector('.toggle-menu.header');


navProfile.addEventListener('click', () => {
  if (toggleMenu.classList.contains('visible')) {
    toggleMenu.classList.remove('visible');
  } else {
    toggleMenu.classList.add('visible');
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

