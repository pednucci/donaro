var navProfile = document.querySelector('.nav-menu');
var toggleMenu = document.querySelector('.toggle-menu.header');
var seta = document.querySelector('.seta')

navProfile.addEventListener('click', () => {
  if (navProfile.classList.contains('toggled')) {
    navProfile.classList.remove('toggled');
  } else {
    navProfile.classList.add('toggled');
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

